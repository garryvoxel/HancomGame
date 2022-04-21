const
    Sequelize = require('sequelize'),
    config = require(__dirname + '/../config/config.json'),
    axios = require('axios'),
    path = require('path'),
    fs = require('fs'),
    models = require(__dirname + '/../models'),
    webConfig = require(__dirname + '/../config/web.config.js'),
    ResponseCode = require(__dirname + '/../classes/response_code'),
    Validator = require(__dirname + '/../classes/validator'),
    Pagination = require(__dirname + '/../classes/pagination'),
    Op = Sequelize.Op,
    News = models.News;
    NewsImages = models.NewsImages;

const NewsController = {
    /**
     * 공지사항 목록 페이지
     */
    indexNresponseJson(req, res) {
        console.log(`NewsController.indexNresponseJson] req.query: %j`, req.query);

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
            switch (fieldId) {
                case '1':
                    where = { subject: { [Op.like]: '%' + keyword + '%' } };
                    break;

                case '2':
                    where = { content: { [Op.like]: '%' + keyword + '%' } };
                    break;

                case '0':
                default:
                    where = {
                        [Op.or]: [
                            { subject: { [Op.like]: '%' + keyword + '%' }},
                            { content: { [Op.like]: '%' + keyword + '%'}}
                        ]
                    };
                    break;
            }
        }

        if (orderby) {
            order = [ [ orderby, (sort || 'DESC').toUpperCase() ] ];
        } else {
            order = [ [ 'id', 'DESC' ] ];
        }

        News
            .findAndCountAll({
                attributes: {exclude: ['content']},
                where: where,
                order: order,
                offset: (page - 1) * count,
                limit: count
            })
            .then(News => {
                var result = JSON.parse(JSON.stringify(News));

                result['pagination'] = new Pagination(req, result.count),
                result['page']=page,
                res.jsonp({...ResponseCode.OK, result: result}); 
            });
    },
    
    /**
     * 상단공지사항 리스트 가져오기
     */
    indexTopNresponseJson(req, res) {
        console.log(`NewsController.indexTopNresponseJson] req.query: %j`, req.query);

        News
            .findAndCountAll({
                attributes: {exclude: ['content']},
                where: { order:  { [Op.gt]: 0 } },
                order: ['order']
            })
            .then(News => {
                res.jsonp({...ResponseCode.OK, result: News}); 
            });
    },

    /**
     * 탑뉴스로 고정
     */

    setTopNewsNresponseJson(req, res){
        console.log(`NewsController.setTopNewsNresponseJson] req.body: %j`, req.body);
        let _news_id = req.body.news_id;

        News
            .findOne(
                {
                    attributes: [ 
                        [models.sequelizes.WebDB.fn('count',  models.sequelizes.WebDB.col('id') ) , 'cnt'] ,
                        [models.sequelizes.WebDB.fn('max',  models.sequelizes.WebDB.col('order') ) , 'order'] ,
                    ],
                    where: { 
                        order: { [Op.gt]: 0 
                        }
                    },
                    raw: true
                }
            )
            .then(countInfo=>{
                //console.log('----- TEST : %j', countInfo);
                if(countInfo.cnt >= 5) {
                    // 최대로 지정할수 있는 갯수를 넘음
                    return res.jsonp(ResponseCode.MAXIUM_LIMIT_EXCEEDED);
                }
                News
                    .update({
                        order: countInfo.order+1 ,
                    }, {
                        where: {id: _news_id}
                    }
                )
                .then(rs=>{
                    res.jsonp(ResponseCode.OK);
                })

            })
            
    },

    /**
     * 탑뉴스로 고정 해제
     */

    unsetTopNewsNresponseJson(req, res){
        console.log(`NewsController.unsetTopNewsNresponseJson] req.body: %j`, req.body);
        _news_id = req.body.news_id;
        _order = req.body.order;

        News
            .update({order: 0}, {where: {id: _news_id}})
            .then(rs=>{
                News
                    .update({order: models.sequelizes.WebDB.literal('`order` - 1')} , {where: {order: {[Op.gt]: _order} }})
                    .then(rs=>{
                        res.jsonp(ResponseCode.OK);
                    })
            })
    },


    /**
     * 탑뉴스 순서 변경 up
     */
    topNewsOrderModifyNresponseJson(req, res){
        let
        _news1 = req.body.news1 ,
        _news1_order = req.body.news1_order,
        _news2 = req.body.news2 , 
        _news2_order = req.body.news2_order;
        
        News.update({
            order: _news1_order
        },{
            where: {id: _news1}
        })
        .then(rs=>{
            News.update({
                order: _news2_order
            },{
                where: {id: _news2}
            })
            .then(rs=>{
                res.jsonp(ResponseCode.OK);
            })
        })

    },

    /**
     * 공지사항 생성
     */    
    storeNresponseJson(req, res) {
        const
            validator = new Validator([
                { name: 'subject', required: true },
                { name: 'content', required: true }
            ]),
            result = validator.validate(req.body);

        if (result !== true) {
            return res.jsonp(ResponseCode.INVALID_PARAMETERS);
        }

        News
            .create({
                subject: req.body.subject
                , content: req.body.content
                , author_id: req.session.managerId
                , temp_article_id: req.body.tempId
            })
            .then(
                result=>{
                if (result) {
                    console.log(`A news has been created: ${req.body.subject}.`);

                    res.jsonp(ResponseCode.OK);
                } else {
                    res.jsonp(ResponseCode.ERROR);
                }
                }
            );
    },

    /**
     * 공지사항 상세 및 편집
     */
    infoNresponseJson(req, res) {
        console.log(`[NewsController.infoNresponseJson] serve a News info: ${req.params.id}.`);

        News
            .findByPk(req.params.id)
            .then(News => {
                var result = JSON.parse(JSON.stringify(News));
                delete result['password'];
                
                res.jsonp({ ...ResponseCode.OK, result: result }); 
            })
            .catch(error => {
                res.jsonp(ResponseCode.ERROR);
            });
    },


    /**
     * 공지사항 수정
     */
    updateNresponseJson(req, res) {
        console.log(`[NewsController.update] Update a News id is ${req.params.id}: %j`, req.body);

        const
            fields = [ 'subject', 'content','is_private'],
            validator = new Validator([
                { name: 'subject', required: true },
                { name: 'content', required: true },
                { name: 'is_private', required: true }
            ])

        result = validator.validate(req.body);
        /*
        if (result !== true) {
            return res.jsonp(ResponseCode.INVALID_PARAMETERS);
        }
        */

        for (var i in fields) {
            const
                name = fields[i],
                value = req.body[name];

            if (value != undefined && value != null) {
                News[name] = value;
            }
        }

        News
            .update(News, {
                where: {
                    id: req.params.id,
                    deleted_at: null
                }
            })
            .then(() => {
                console.log(`A News has been modified: %j`, News);

                res.jsonp(ResponseCode.OK);
            })
            .catch(error => {
                res.jsonp(ResponseCode.ERROR);
            });
    },

    deleteNresponseJson(req, res){
        console.log(`[NewsController.delete] delete a News id is: %j`, req.body);
        const
            fields = [ 'id'],
            validator = new Validator([
                { name: 'id', required: true },
            ])

        result = validator.validate(req.body);
        if (result !== true) {
            return res.jsonp(ResponseCode.INVALID_PARAMETERS);
        }

        News
            .destroy({
                where: {
                    id: req.body.id
                }
            })
            .then(()=>{
                res.jsonp(ResponseCode.OK);
            });

    },

    imageUploadNresponseJson(req, res) {
        console.log(`[NewsController.imageUploadNresponseJson] image upload: %j`, req.body);

        let loginHeaders = {
            "Content-Type": "application/x-www-form-urlencoded",
            "Accept": "*/*",
            'X-Agile-Username': webConfig.llnw['X-Agile-Username'],
            'X-Agile-Password': webConfig.llnw['X-Agile-Password']
        };

        axios({
            method: 'post',
            url:  webConfig.llnw['loginURL'],
            headers: loginHeaders, 
            data: null
        })
        .then(response=>{ 
            //console.log("TOKEN:"+response.headers['x-agile-token']);
            let authToken = response.headers['x-agile-token'];

            //CDN upload
            let fileName = fileNameGenerate(15);
            let fileExt = path.extname(req.files.image.name);
            let imageURL = webConfig.llnw['baseImageURL']+'/news_images/news_'+fileName+fileExt;   
            
            console.log("CDN imageURL::: "+imageURL);

            req.files.image.mv('/tmp/'+req.files.image.name, err=>{
                if (err) { 
                    console.log(err);
                    return res.status(500).send(err); 
                }

                const fileBuffer = fs.readFileSync('/tmp/'+req.files.image.name);

                let uploadHeaders = {
                    'X-Agile-Authorization': authToken,
                    'X-Agile-Directory': webConfig.llnw['X-Agile-Directory']+'/news_images',
                    'X-Agile-Basename': 'news_'+fileName+fileExt
                };

                console.log("CDN Header::: %j", uploadHeaders);

                axios({
                    method: 'post',
                    url: webConfig.llnw['uploadURL'],
                    headers: uploadHeaders, 
                    //data: data
                    data: fileBuffer
                })
                .then(response=>{
                    //DB에 이벤트 등록
                    NewsImages
                    .create({
                        temp_article_id: req.body.tempId
                        , image_url: imageURL
                    })
                    .then(result=>{
                        fs.unlink('/tmp/'+req.files.image.name, err=>{
                            console.log('파일 지웠음.::: '+'/tmp/'+req.files.image.name);
                            if(err) {
                                console.log(JSON.stringify(err));
                            }
                        });

                        if (result) {
                            console.log(`A images has been created: ${req.files.image.name}.`);
                            res.jsonp( {...ResponseCode.OK,imageUrl:imageURL});
                        } else {
                            res.jsonp(ResponseCode.ERROR);
                        }
                        }
                    );
                    
                });
            })
        })


        function fileNameGenerate(count) {
            var _sym = 'abcdefghijklmnopqrstuvwxyz1234567890',
                str = '';
        
            for(var i = 0; i < count; i++) {
                str += _sym[parseInt(Math.random() * (_sym.length))];
            }
            return str;
        }

    },
    getImageListNresponseJson(req, res) {
        console.log(`[NewsController.getImageListNresponseJson] image upload: %j`, req.body);
        NewsImages
        .findAndCountAll({
            where: {temp_article_id: req.query.tempId}
        })
        .then(NewsImagess => {
            var result = JSON.parse(JSON.stringify(NewsImagess));
            res.jsonp({...ResponseCode.OK, result: result}); 
        });
    },

    cdnFileDel(req, res) {
        console.log(`[NewsController.cdnFileDel]`);

        /** CDN 로그인 */
        let loginJSON= {
            "method": "login", 
            "id": 0, 
            "params": { 
                "username": webConfig.llnw['X-Agile-Username'], 
                "password": webConfig.llnw['X-Agile-Password'], 
                "detail": true }
            , "jsonrpc": "2.0"
        };

        axios({
            method: 'post',
            url:  webConfig.llnw['jsonRPC'],
            headers: {}, 
            data: loginJSON
        })
        .then(response=>{
            let token = response.data.result[0];
            let user = response.data.result[1];

            //파일 삭제 
            let deletefileJSON= {
                "method": "deleteFile", 
                "id": 1, 
                "params": { 
                    "token": token,
                    "path": '/typing/news_images/news_xvpy7wosyaoj3zb.png', 
                }
                , "jsonrpc": "2.0"
            };

            axios({
                method: 'post',
                url:  webConfig.llnw['jsonRPC'],
                headers: {}, 
                data: deletefileJSON
            })
            .then( (response)=> {
                console.log(`삭제요청 response: %j`, response.data);
                res.jsonp(ResponseCode.OK);
            })
        })        
        
    },

    delImageNresponseJson(req, res) {
        console.log(`[NewsController.delImageNresponseJson] del image id: %j`, req.body);

        NewsImages
            .findByPk(req.body.imageSeq)
            .then(imageInfo=>{
                if(!imageInfo){
                    return req.jsonp(ResponseCode.NO_CONTENTS);
                }

                let image_uri = imageInfo.image_url.replace(webConfig.llnw['baseImageDomain'],'');

                console.log(`삭제되는 이미지 uri %j`,image_uri);

                /** CDN 로그인 */
                let loginJSON= {
                    "method": "login", 
                    "id": 0, 
                    "params": { 
                        "username": webConfig.llnw['X-Agile-Username'], 
                        "password": webConfig.llnw['X-Agile-Password'], 
                        "detail": true }
                    , "jsonrpc": "2.0"
                };
        
                axios({
                    method: 'post',
                    url:  webConfig.llnw['jsonRPC'],
                    headers: {}, 
                    data: loginJSON
                })
                .then(response=>{
                    let token = response.data.result[0];
                    let user = response.data.result[1];

                    //파일 삭제 
                    let deletefileJSON= {
                        "method": "deleteFile", 
                        "id": 1, 
                        "params": { 
                            "token": token,
                            "path": image_uri, 
                        }
                        , "jsonrpc": "2.0"
                    };

                    axios({
                        method: 'post',
                        url:  webConfig.llnw['jsonRPC'],
                        headers: {}, 
                        data: deletefileJSON
                    })
                    .then( (response)=> {
                        console.log(`삭제요청 response: %j`, response);
                        
                        NewsImages
                        .destroy({
                            where: {
                                id: req.body.imageSeq
                            }
                        })
                        .then(()=>{
                            res.jsonp(ResponseCode.OK);
                        });
                    })
                })
            })
            .catch(error => {
                console.log("catch : " + error.message);
                res.jsonp(ResponseCode.ERROR);
            });

    }
};

module.exports = NewsController;