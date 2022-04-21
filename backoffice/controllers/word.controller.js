const
    Sequelize = require('sequelize'),
    config = require(__dirname + '/../config/config.json'),
    models = require(__dirname + '/../models'),
    ResponseCode = require(__dirname + '/../classes/response_code'),
    Validator = require(__dirname + '/../classes/validator'),
    Pagination = require(__dirname + '/../classes/pagination'),
    fs = require('fs'),
    detectCharacterEncoding = require('detect-character-encoding'),
    Op = Sequelize.Op,

    TbWord = models.TbWord,
    TbCategory = models.TbCategory;

    TbWord.belongsTo(TbCategory, {foreignKey: 'CategoryIdx', targetKey: 'Idx'});
    
const WordController = {
    /**
     * 문제관리 목록 페이지
     */
    indexNresponseJson(req, res) {
        console.log(`WordController.indexNresponseJson] req.query: %j`, req.query);

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

        if (fieldId) {
            if(fieldId != 0) where = { CategoryIdx: fieldId }
        }

        if (keyword) {

            if(fieldId != 0) {
                where = { 
                    CategoryIdx: fieldId,
                    Words: { [Op.like]: '%' + keyword + '%' } };
            } else {
                where = { 
                    Words: { [Op.like]: '%' + keyword + '%' } };
            }
        }



        //console.log('검색조건 보자 %j', where);

        if (orderby) {
            order = [ [ orderby, (sort || 'DESC').toUpperCase() ] ];
        } else {
            order = [ [ 'Idx', 'DESC' ] ];
        }

        TbWord
        .findAndCountAll({
            attributes: ['Idx',
                    'CategoryIdx',
                    'Reference',
                    'Type',
                    'GameCode',
                    'FileName',
                    [models.sequelizes.WordDB.fn('left', models.sequelizes.WordDB.col('Words'),20),'Words']
                ],
            where: where,
            order: order,
            offset: (page - 1) * count,
            limit: count,
            include: [ { model: TbCategory, attributes: ['CategoryName'] } ],
            raw: true
        })
        .then(wordList => {
            wordList['pagination'] = new Pagination(req, wordList.count),
            wordList['page']=page,
            res.jsonp({...ResponseCode.OK, result: wordList}); 
        });  

    },

    /**
     * 파일 등록
     */
    storeNresponseJson(req,res) {
        console.log(`WordController.storeNresponseJson] req.body: %j`, req.body);
        const
        validator = new Validator([
            { name: 'CategoryIdx', required: true },
            { name: 'Reference', required: true },
            { name: 'GameCode', required: true },
            { name: 'Type', required: true },
        ]),
        result = validator.validate(req.body);

        if (result !== true) {
            return res.jsonp(ResponseCode.INVALID_PARAMETERS);
        }        

        if ( !req.files || typeof req.files.WordFile !== 'object' ) {
            //파일 업로드 되지 않았음.
        } else {
            //첨부파일 있음
            //console.log(req.files.csvfile);
            let fileName = fileNameGenerate(15)+'.word.txt';
            req.files.WordFile.mv('/tmp/'+fileName, err=>{
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
                    if(charsetMatch.encoding != 'UTF-8' && charsetMatch.encoding != 'ISO-8859-1') return res.jsonp(ResponseCode.NO_UTF8);

                    TbWord.create(
                        {
                            CategoryIdx: req.body.CategoryIdx,
                            GameCode: req.body.GameCode,
                            Reference: req.body.Reference,
                            FileName: req.files.WordFile.name,
                            Words: fileBuffer,
                            Type: req.body.Type
                        }
                    )
                    .then(()=>{
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

    /**
     * 글삭제
     */

    deleteNresponseJson(req,res) {
        console.log(`WordController.deleteNresponseJson] req.body: %j`, req.body);

        const
        validator = new Validator([
            { name: 'selectedWords', required: true },
        ]),
        result = validator.validate(req.body);

        if (result !== true) {
            return res.jsonp(ResponseCode.INVALID_PARAMETERS);
        }        

        TbWord.destroy({
            where: {
                Idx: req.body.selectedWords
            }
        })
        .then(rs=>{
            res.jsonp(ResponseCode.OK);
        })

    },     
    /**
     * 카테고리 목록 리스팅
     */
    categoryList(req, res) {
        console.log(`WordController.categoryList] req.query: %j`, req.query);

        TbCategory
            .findAll({
                raw: true
            })
            .then(rsCategory=>{
                res.jsonp({...ResponseCode.OK, result: rsCategory});     
            })
    },

    /**
     * 카테고리 등록
     */
    categoryAdd(req, res) {
        console.log(`WordController.categoryAdd] req.body: %j`, req.body);

        TbCategory
            .create({
                CategoryName : req.body.categoryName
            })
            .then(rs=>{
                res.jsonp(ResponseCode.OK); 
            })
    },

    /**
     * 카테고리 등록
     */
    categoryDel(req, res) {
        console.log(`WordController.categoryDel] req.body: %j`, req.body);

        TbWord
            .destroy({
                where: {
                    CategoryIdx: req.body.categoryIdx
                }
            })
            .then(rs=>{

                TbCategory
                .destroy({
                    where: {
                        Idx : req.body.categoryIdx
                    }
                })
                .then(rs=>{
                    res.jsonp(ResponseCode.OK); 
                })
            })
    }
};

module.exports = WordController;