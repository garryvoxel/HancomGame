const
    Sequelize = require('sequelize'),
    config = require(__dirname + '/../config/config.json'),
    models = require(__dirname + '/../models'),
    ResponseCode = require(__dirname + '/../classes/response_code'),
    Validator = require(__dirname + '/../classes/validator'),
    Pagination = require(__dirname + '/../classes/pagination'),
    csv = require('fast-csv'),
    detectCharacterEncoding = require('detect-character-encoding'),
    Op = Sequelize.Op,
    fs = require('fs');

const ContentsController = {
    /**
     * 컨텐츠 목록 페이지
     */
    indexNresponseJson(req, res) {
        console.log(`ContentsController.indexNresponseJson] req.query: %j`, req.query);

        const
            query = req.query || {},
            page = parseInt(query.page || 1),
            count = parseInt(query.count || 10),
            fieldId = query.fieldId || 0,
            keyword = query.keyword || null,
            orderby = query.orderby,
            sort = query.sort;

        let
            where, order;

        if (keyword) {
            where = { word: { [Op.like]: '%' + keyword + '%' } };
        }

        if (orderby) {
            order = [ [ orderby, (sort || 'DESC').toUpperCase() ] ];
        } else {
            order = [ [ 'id', 'DESC' ] ];
        }

        Contents
        .findAndCountAll({
            where: where,
            order: order,
            offset: (page - 1) * count,
            limit: count
        })
        .then(Contents => {
            var result = JSON.parse(JSON.stringify(Contents));

            result['pagination'] = new Pagination(req, result.count),
            result['page']=page,
            res.jsonp({...ResponseCode.OK, result: result}); 
        });  

    },
        
    /**
     * 컨텐츠 생성
     */    
    storeNresponseJson(req, res) {
        console.log(`[ContentsController.infoNresponseJson] write a Contents info: %j`,req.body);
        const
            validator = new Validator([
                { name: 'words', required: true },
            ]),
            result = validator.validate(req.body);

        if (result !== true) {
            return res.jsonp(ResponseCode.INVALID_PARAMETERS);
        }

        let wordArr = [];
        for(var i=0 in req.body.words){
           if(req.body.words[i] != '') wordArr[i]={word: req.body.words[i]};
        }

        Contents_temp.destroy({ truncate : true, cascade: false })
                            .then(()=>{
                                //모든 항목을 Contents_temp 에 일단 다 넣음
                                return Contents_temp.bulkCreate(wordArr)
                            })
                            .then(rs=>{
                                //console.log(`%j`,rs);
                                //원본 테이블에 중복이 있는지 체크 
                                return models.sequelizes.WebDB.query(` update Contents_temp as st set dup = 1 where exists ( select 1 from Contents as s where s.word = st.word ) `);
                            })
                            .then(rs=>{
                                //중복이 아닌 단어들 추가
                                return models.sequelizes.WebDB.query(` insert into Contents (word) select word from Contents_temp where dup is null `);
                            })
                            .then(rs=>{
                                //정상 응답.
                                res.jsonp(ResponseCode.OK);   
                            })
                            .catch(error=>{
                                console.log("Catch : %j"+ error);
                                res.jsonp(ResponseCode.ERROR);
                            });
    },

    /**
     * 컨텐츠 생성 - CSV 파일 업로드로 일괄 등록
     */     
    cvsUploadNresponseJson(req, res) {
        console.log(`[ContentsController.infoNresponseJson] upload csv`);

/** 참고용 소스 
 * 
 fs.open(temp_path, 'r', function (status, fd) {
    if (status) {
        console.log(status.message);
        return;
    }
    var fileSize = getFilesizeInBytes(temp_path);
    var buffer = new Buffer(fileSize);
    fs.read(fd, buffer, 0, fileSize, 0, function (err, num) {

        var query = "INSERT INTO files SET ?",
            values = {
                file_type: 'img',
                file_size: buffer.length,
                file: buffer
            };
        mySQLconnection.query(query, values, function (er, da) {
            if(er)throw er;
        });

    });
});
 * 
 */
        
        if ( !req.files || typeof req.files.csvfile !== 'object' ) {
            //파일 업로드 되지 않았음.
        } else {
            //첨부파일 있음
            //console.log(req.files.csvfile);
            let fileName = fileNameGenerate(15)+'.slang.csv';
            req.files.csvfile.mv('/tmp/'+fileName, err=>{
                if (err) { 
                    console.log(err);
                    return res.jsonp(ResponseCode.ERROR); 
                } else {
                    // 업로드는 잘되었고 DB에 쓰기 처리
                    console.log("파일 처리중.");
                    const fileBuffer = fs.readFileSync('/tmp/'+fileName);
                    const charsetMatch = detectCharacterEncoding(fileBuffer);
                    
                    console.log('파일의 인코딩상태는: %j',charsetMatch); 
                    // 파일의 인코딩상태는: {"encoding":"EUC-KR","confidence":100}  {"encoding":"UTF-8","confidence":100}
                    if(charsetMatch.encoding != 'UTF-8') return res.jsonp(ResponseCode.NO_UTF8);
                    
                    let stream = fs.createReadStream('/tmp/'+fileName, {encoding: 'utf8'});
                    let myData = [];
                    let csvStream = csv
                        .parse()
                        .on("data", data=>{
                            if(data != "") {
                                myData.push({ word: data});
                            }
                        })
                        .on("end", ()=>{
                            //myData.shift();  // 제목줄이 있을경우 삭제용.
                            //컨텐츠 등록용 임시테이블 초기화.
                            Contents_temp.destroy({ truncate : true, cascade: false })
                            .then(()=>{
                                //모든 항목을 Contents_temp 에 일단 다 넣음
                                return Contents_temp.bulkCreate(myData)
                            })
                            .then(rs=>{
                                //console.log(`%j`,rs);
                                //원본 테이블에 중복이 있는지 체크 
                                return models.sequelizes.WebDB.query(` update Contents_temp as st set dup = 1 where exists ( select 1 from Contents as s where s.word = st.word ) `);
                            })
                            .then(rs=>{
                                //중복이 아닌 단어들 추가
                                return models.sequelizes.WebDB.query(` insert into Contents (word) select word from Contents_temp where dup is null `);
                            })
                            .then(rs=>{
                                //임시파일 삭제 response
                                fs.unlink( '/tmp/'+fileName, err=>{
                                    console.log('파일 지웠음 :'+'/tmp/'+fileName);
                                    if(err) {
                                        console.log(err);
                                        return res.jsonp(ResponseCode.ERROR);
                                    }
                                    res.jsonp(ResponseCode.OK);
                                });     
                            })
                            .catch(error=>{
                                console.log("Catch : %j"+ error);
                                res.jsonp(ResponseCode.ERROR);
                            });


                        });
                        
                    stream.pipe(csvStream);
                    
                }
            });
        }

        function fileNameGenerate(count) {
            var _sym = 'abcdefghijklmnopqrstuvwxyz1234567890',
                str = '';
        
            for(var i = 0; i < count; i++) {
                str += _sym[parseInt(Math.random() * (_sym.length))];
            }
            return str;
        }
    },

    deleteNresponseJson(req, res){
        console.log(`[ContentsController.delete] delete a Event ids is: %j`, req.body);

        Contents
            .destroy({
                where : { 
                    id : req.body.ids 
                } 
            })
            .then( (ContentsInfo)=> {
                res.jsonp(ResponseCode.OK);
            })
            .catch(error => {
                console.log("catch : " + error.message);
                res.jsonp(ResponseCode.ERROR);
            });
    }

};

module.exports = ContentsController;