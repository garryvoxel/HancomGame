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
    fs = require('fs'),
    Slang = models.Slang;
    Slang_temp = models.Slang_temp;


const SlangController = {
    /**
     * 비속어 목록 페이지
     */
    indexNresponseJson(req, res) {
        console.log(`SlangController.indexNresponseJson] req.query: %j`, req.query);

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

        Slang
        .findAndCountAll({
            where: where,
            order: order,
            offset: (page - 1) * count,
            limit: count
        })
        .then(Slang => {
            var result = JSON.parse(JSON.stringify(Slang));

            result['pagination'] = new Pagination(req, result.count),
            result['page']=page,
            res.jsonp({...ResponseCode.OK, result: result}); 
        });  

    },
        
    /**
     * 비속어 생성
     */    
    storeNresponseJson(req, res) {
        console.log(`[SlangController.infoNresponseJson] write a Slang info: %j`,req.body);
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

        Slang_temp.destroy({ truncate : true, cascade: false })
                            .then(()=>{
                                //모든 항목을 Slang_temp 에 일단 다 넣음
                                return Slang_temp.bulkCreate(wordArr)
                            })
                            .then(rs=>{
                                //console.log(`%j`,rs);
                                //원본 테이블에 중복이 있는지 체크 
                                return models.sequelizes.WebDB.query(` update Slang_temp as st set dup = 1 where exists ( select 1 from Slang as s where s.word = st.word ) `);
                            })
                            .then(rs=>{
                                //중복이 아닌 단어들 추가
                                return models.sequelizes.WebDB.query(` insert into Slang (word) select word from Slang_temp where dup is null `);
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
     * 비속어 생성 - CSV 파일 업로드로 일괄 등록
     */     
    cvsUploadNresponseJson(req, res) {
        console.log(`[SlangController.infoNresponseJson] upload csv`);

        if ( !req.files || typeof req.files.csvfile !== 'object' ) {
            //파일 업로드 되지 않았음.
        } else {
            //첨부파일 있음
            //console.log(req.files.csvfile);
            let fileName = fileNameGenerate(15)+'.slang.csv';
            let lineSflag = [];    
            let tmpData ;        

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
                            data;
                            lineSflag = data.splice(',');
                            console.log(`Data line 판정::: %j`, lineSflag.length);

                            if(lineSflag.length > 0) {
                                if(lineSflag.length > 1) {
                                    //console.log("멀티라인");
                                    for(let i in lineSflag) {
                                        myData.push({ word: lineSflag[i]});
                                    }
                                } else {
                                    //console.log("싱글라인");
                                    myData.push({ word: lineSflag[0]});
                                }  
                            }
                        })
                        .on("end", ()=>{
                            //myData.shift();  // 제목줄이 있을경우 삭제용.
                            //비속어 등록용 임시테이블 초기화.

                            Slang_temp.destroy({ truncate : true, cascade: false })
                            .then(()=>{
                                //모든 항목을 Slang_temp 에 일단 다 넣음
                                return Slang_temp.bulkCreate(myData)
                            })
                            .then(rs=>{
                                //console.log(`%j`,rs);
                                //원본 테이블에 중복이 있는지 체크 
                                return models.sequelizes.WebDB.query(` update Slang_temp as st set dup = 1 where exists ( select 1 from Slang as s where s.word = st.word ) `);
                            })
                            .then(rs=>{
                                //중복이 아닌 단어들 추가
                                return models.sequelizes.WebDB.query(` insert into Slang (word) select word from Slang_temp where dup is null `);
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
        console.log(`[SlangController.delete] delete a Event ids is: %j`, req.body);

        Slang
            .destroy({
                where : { 
                    id : req.body.ids 
                } 
            })
            .then( (SlangInfo)=> {
                res.jsonp(ResponseCode.OK);
            })
            .catch(error => {
                console.log("catch : " + error.message);
                res.jsonp(ResponseCode.ERROR);
            });
    }

};

module.exports = SlangController;