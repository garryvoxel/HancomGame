const
    Sequelize = require('sequelize'),
    axios = require('axios'),
    path = require('path'),
    fs = require('fs'),
    config = require(__dirname + '/../config/config.json'),
    webConfig = require(__dirname + '/../config/web.config.js'),
    models = require(__dirname + '/../models'),
    ResponseCode = require(__dirname + '/../classes/response_code'),
    Validator = require(__dirname + '/../classes/validator'),
    Pagination = require(__dirname + '/../classes/pagination'),
    Op = Sequelize.Op,
    Moment =  require('moment'),
    Events = models.Events,
    Managers = models.Managers;
    //Events.belongsTo(Managers, {foreignKey:'creator_id', targetKey:'id'});

var FormData = require('form-data');

const EventsController = {
    /**
     * 이벤트 목록 페이지
     */
    indexNresponseJson(req, res) {
        console.log(`EventsController.indexNresponseJson] req.query: %j`, req.query);

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

        
        // 각각의 모델로 select 하는 테스트
        /*
        Managers
            .findById(req.session.managerId)
        
            //.findOne({ where: {id: req.session.managerId}  })
                   
            .then(ManagerInfo=>{
                //console.log("관리자 정보는::"+JSON.stringify(ManagerInfo));

                Events
                .findAndCountAll({
                    where: where,
                    order: order,
                    offset: (page - 1) * count,
                    limit: count,
                    // include: [{
                    //     model: Managers,
                    //     attributes: ['display_name'],
                    //     where: { id: Sequelize.col('events.creator_id')}
                    // }]
                })
                .then(Events => {
                    //console.log("관리자 정보는::"+JSON.stringify(ManagerInfo));
                    var result = JSON.parse(JSON.stringify(Events));
    
                    result['status'] = 'ok';
                    result['pagination'] = new Pagination(req, result.count),
                    result['page']=page,
                    res.jsonp(result); 
                });                
            });
        */
        
        Events
        .findAndCountAll({
            where: where,
            order: order,
            offset: (page - 1) * count,
            limit: count,
            // include: [{
            //     model: Managers,
            //     attributes: ['display_name'],
            //     where: { id: Sequelize.col('events.creator_id')}
            // }]
        })
        .then(Events => {
            var result = JSON.parse(JSON.stringify(Events));

            result['pagination'] = new Pagination(req, result.count),
            result['page']=page,
            res.jsonp({...ResponseCode.OK, result: result}); 
        });  

    },
        
    /**
     * 이벤트 생성
     */    
    storeNresponseJson(req, res) {
        console.log(`[EventsController.infoNresponseJson] write a Events info: %j`,req.body);
        const
            validator = new Validator([
                { name: 'subject', required: true },
                { name: 'content', required: true }
            ]),
            result = validator.validate(req.body);

        if (result !== true) {
            return res.jsonp(ResponseCode.INVALID_PARAMETERS);
        }

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
            let fileNameM = fileNameGenerate(15);
            let fileExt = path.extname(req.files.image.name);
            let fileExtM = path.extname(req.files.imageM.name);
            let imageURL = webConfig.llnw['baseImageURL']+'/event_images/events_'+fileName+fileExt;     
            let imageURLM = webConfig.llnw['baseImageURL']+'/event_images/events_'+fileNameM+'_M'+fileExtM;     

            console.log("CDN imageURL::: "+imageURL);
            console.log("CDN imageURL::: "+imageURLM);

            req.files.image.mv('/tmp/'+req.files.image.name, err=>{
                if (err) { 
                    console.log(err);
                    return res.status(500).send(err); 
                }

                req.files.imageM.mv('/tmp/'+req.files.imageM.name, err=>{

                    if (err) { 
                        console.log(err);
                        return res.status(500).send(err); 
                    }                    

                    /*
                    let data = new FormData();

                    const fileBuffer = fs.readFileSync('/tmp/'+req.files.image.name);
                    data.append('dataa', fileBuffer, req.files.image.name);                
                    */

                    //console.log("FormData 의 내용 보자::: %j", data);

                    let uploadHeaders = {
                        //"Content-Type": `multipart/form-data; boundary=${data._boundary}`,
                        //"Accept": "*/*",
                        'X-Agile-Authorization': authToken,
                        'X-Agile-Directory': webConfig.llnw['X-Agile-Directory']+'/event_images',
                        'X-Agile-Basename': 'events_'+fileName+fileExt
                    };

                    let uploadHeadersM = {
                        //"Content-Type": `multipart/form-data; boundary=${data._boundary}`,
                        //"Accept": "*/*",
                        'X-Agile-Authorization': authToken,
                        'X-Agile-Directory': webConfig.llnw['X-Agile-Directory']+'/event_images',
                        'X-Agile-Basename': 'events_'+fileNameM+'_M'+fileExtM
                    };                

                    console.log("CDN Header::: %j", uploadHeaders);
                    console.log("CDN Header::: %j", uploadHeadersM);

                    const fileBuffer = fs.readFileSync('/tmp/'+req.files.image.name);
                    const fileBufferM = fs.readFileSync('/tmp/'+req.files.imageM.name);

                    Promise.all([
                        axios({
                            method: 'post',
                            url: webConfig.llnw['uploadURL'],
                            headers: uploadHeaders, 
                            //data: data
                            data: fileBuffer
                        }) ,
                        axios({
                            method: 'post',
                            url: webConfig.llnw['uploadURL'],
                            headers: uploadHeadersM, 
                            //data: data
                            data: fileBufferM
                        }) 
                    ])
                    .then((response, responseM)=>{

                        //DB에 이벤트 등록
                        Events
                        .create({
                            subject: req.body.subject
                            , content: req.body.content
                            , creator_id: req.session.managerId
                            //, start_at: Moment(req.body.startDate.concat(' 00:00:00')).format("YYYY-MM-DD HH:mm:ss")
                            , start_at: req.body.startDate.concat(' 00:00:00')
                            //, end_at: Moment(req.body.endDate.concat(' 23:59:59')).format("YYYY-MM-DD HH:mm:ss")
                            , end_at: req.body.endDate.concat(' 23:59:59')
                            , status: req.body.status
                            , image_uri: imageURL
                            , mobile_image_uri: imageURLM                            
                        })
                        .then(result=>{
                            fs.unlink('/tmp/'+req.files.image.name, err=>{
                                console.log('파일 지웠음.::: '+'/tmp/'+req.files.image.name);
                                if(err) {
                                    console.log(JSON.stringify(err));
                                }
                            });

                            fs.unlink('/tmp/'+req.files.imageM.name, err=>{
                                console.log('모바일 파일 지웠음.::: '+'/tmp/'+req.files.imageM.name);
                                if(err) {
                                    console.log(JSON.stringify(err));
                                }
                            });                            

                            if (result) {
                                console.log(`A events has been created: ${req.body.subject}.`);
                
                                res.jsonp(ResponseCode.OK);
                            } else {
                                res.jsonp(ResponseCode.ERROR);
                            }
                            }
                        ); 
                    }, (error) => { console.log(error.response)}
                    )
                    .catch(error=>{
                        console.log("Catch:::"+error);
                    });
                })
            });
        }//, (error) => { console.log(error.response)}
        )
        .catch(error=>{
            console.log("Catch:::"+error);
        });;
        
        /*

        let fileName = fileNameGenerate(15);
        let fileExt = path.extname(req.files.image.name);
        let imageURL = '';
        //첨부파일 업로드
        req.files.image.mv(__dirname +'/temp/'+req.files.image.name, err=>{
            if (err) { 
                console.log(err);
                return res.status(500).send(err); 
            }
        });

        */

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
     * CDN control
     */

    cdnTest(req, res) {
        console.log(`[EventsController.cdnTest] test Value is : %j`, req.body);
        /** 일단 로그인 */
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

            //디렉토리 리스팅 
            // let listdirJSON= {
            //     "method": "listDir", 
            //     "id": 1, 
            //     "params": { 
            //         "token": token,
            //         "path": '/typing', 
            //         "pageSize": 100, 
            //         "cookie": 0, 
            //         "stat": true
            //     }
            //     , "jsonrpc": "2.0"
            // };

            // axios({
            //     method: 'post',
            //     url:  webConfig.llnw['jsonRPC'],
            //     headers: {}, 
            //     data: listdirJSON
            // })
            // .then(response=>{
            //     console.log('디렉토리 리스팅::: %j', response.data);
            //     res.jsonp(ResponseCode.OK);
            // })
            

            //디렉토리 파일 리스팅 
            // let filelistJSON= {
            //     "method": "listFile", 
            //     "id": 1, 
            //     "params": { 
            //         "token": token,
            //         "path": '/typing/event_images', 
            //         "pageSize": 100, 
            //         "cookie": 0, 
            //         "stat": true
            //     }
            //     , "jsonrpc": "2.0"
            // };

            // axios({
            //     method: 'post',
            //     url:  webConfig.llnw['jsonRPC'],
            //     headers: {}, 
            //     data: filelistJSON
            // })
            // .then(response=>{
            //     console.log('디렉토리 파일 리스팅::: %j', response.data);
            //     res.jsonp(ResponseCode.OK);
            // })


            //섭폴더 생성 
            let mkdirJSON= {
                "method": "makeDir", 
                "id": 1, 
                "params": { 
                    "token": token,
                    "path": '/typing/news_images', 
                }
                , "jsonrpc": "2.0"
            };

            axios({
                method: 'post',
                url:  webConfig.llnw['jsonRPC'],
                headers: {}, 
                data: mkdirJSON
            })
            .then(response=>{
                console.log('디렉토리 생성::: %j', response.data);
                res.jsonp(ResponseCode.OK);
            })

            //섭폴더 삭제 
            // let deletedirJSON= {
            //     "method": "deleteDir", 
            //     "id": 1, 
            //     "params": { 
            //         "token": token,
            //         "path": '/typing/event_image', 
            //     }
            //     , "jsonrpc": "2.0"
            // };

            // axios({
            //     method: 'post',
            //     url:  webConfig.llnw['jsonRPC'],
            //     headers: {}, 
            //     data: deletedirJSON
            // })
            // .then(response=>{
            //     console.log('디렉토리 삭제::: %j', response.data);
            //     res.jsonp(ResponseCode.OK);
            // })      

            //파일 삭제 
            // let deletefileJSON= {
            //     "method": "deleteFile", 
            //     "id": 1, 
            //     "params": { 
            //         "token": token,
            //         "path": '/typing/event_images/events_2tmwqy1ttzxejpg.png', 
            //     }
            //     , "jsonrpc": "2.0"
            // };

            // axios({
            //     method: 'post',
            //     url:  webConfig.llnw['jsonRPC'],
            //     headers: {}, 
            //     data: deletefileJSON
            // })
            // .then(response=>{
            //     console.log('파일 삭제::: %j', response.data);

            //     let filelistJSON= {
            //         "method": "listFile", 
            //         "id": 1, 
            //         "params": { 
            //             "token": token,
            //             "path": '/typing/event_images', 
            //             "pageSize": 100, 
            //             "cookie": 0, 
            //             "stat": true
            //         }
            //         , "jsonrpc": "2.0"
            //     };
    
            //     axios({
            //         method: 'post',
            //         url:  webConfig.llnw['jsonRPC'],
            //         headers: {}, 
            //         data: filelistJSON
            //     })
            //     .then(response=>{
            //         console.log('디렉토리 파일 리스팅::: %j', response.data);
            //         res.jsonp(ResponseCode.OK);
            //     })                
                
            // })  

            //cdn test 끝

        });
            
    },

    /**
     * 이벤트 상세 및 편집
     */
    infoNresponseJson(req, res) {
        console.log(`[EventsController.infoNresponseJson] serve a Events info: ${req.params.id}.`);

        Events
            .findByPk(req.params.id)
            .then(Events => {
                var result = JSON.parse(JSON.stringify(Events));
                delete result['password'];
                
                res.jsonp({ ...ResponseCode.OK, eventInfo: result} ); 
                
            })
            .catch(error => {
                res.jsonp( ResponseCode.NO_CONTENTS ); 
            });
    },

    /**
     * 이벤트 수정
     */
    updateNresponseJson(req, res) {
        console.log(`[EventsController.update] Update a Events id is ${req.params.id}: %j`, req.body);

        // 파일이 올라오는지 안올라 오는지 확인. 
        // 하지 않음 S3로 변경될 예정임
        /*
        //if ( !req.files || typeof req.files.image !== 'object' ) {
        if ( !req.files || !req.files.image) {
            //첨부파일 없음
            console.log("파일 첨부 없음.");
        } else {
            //첨부파일 있음
            console.log("파일 첨부 있음.");
            //기존 첨부파일을 지움
            if (fs.existsSync(__dirname +'/../public'+req.body.oldImgUri)) {
                //file exists
                fs.unlink( __dirname +'/../public'+req.body.oldImgUri, err=>{
                    console.log('파일 지웠음.'+__dirname +'/../public'+req.body.oldImgUri);
                    if(err) {
                        console.log(JSON.stringify(err));
                    }
                });                
            }

            // 새로운 파일 복사
            req.files.image.mv(__dirname +'/../public/events/'+req.files.image.name, err=>{});
            Events['image_uri'] = '/events/'+req.files.image.name;            
        }
        */

        const
            fields = [ 'id','subject','content'],
            validator = new Validator([
                { id: 'id', required: true },
                { subject: 'subject', required: true },
                { content: 'content', required: true }
            ]),

        result = validator.validate(req.body);
        if (result !== true) {
            req.jsonp(ResponseCode.INVALID_PARAMETERS);
        }

        // 변수 할당
        Events['subject'] = req.body.subject;
        Events['content'] = req.body.content;
        Events['start_at'] = Moment(req.body.startDate.concat(' 00:00:00')).utcOffset("-0900").format("YYYY-MM-DD HH:mm:ss");
        //Events['start_at'] = req.body.startDate.concat(' 00:00:00');
        Events['end_at'] = Moment(req.body.endDate.concat(' 23:59:59')).utcOffset("-0900").format("YYYY-MM-DD HH:mm:ss");
        //Events['end_at'] = req.body.endDate.concat(' 23:59:59');
        Events['status'] = req.body.status;

        Events
            .update(Events, {
                where: {
                    id: req.body.id
//                    ,deleted_at: null
                }
            })
            .then(() => {
                console.log(`A Events has been modified: %j`, Events);

                res.jsonp(ResponseCode.OK);
            })
            .catch(error => {
                console.log("catch : " + error.message);
                res.jsonp(ResponseCode.ERROR);
            });
           
    },

    updatePCbanner(req, res) {
        console.log(`[EventsController.updatePCbanner]`);

        if ( !req.files || !req.files.image) {
            //첨부파일 없음
            console.log("파일 첨부 없음.");
            return res.jsonp(ResponseCode.OK);
        } else {
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
                //let fileNameM = fileNameGenerate(15);
                let fileExt = path.extname(req.files.image.name);
                //let fileExtM = path.extname(req.files.imageM.name);
                let imageURL = webConfig.llnw['baseImageURL']+'/event_images/events_'+fileName+fileExt;     
                //let imageURLM = webConfig.llnw['baseImageURL']+'/event_images/events_'+fileNameM+'_M'+fileExtM;     
    
                console.log("CDN imageURL::: "+imageURL);
                //console.log("CDN imageURL::: "+imageURLM);
    
                req.files.image.mv('/tmp/'+req.files.image.name, err=>{
                    if (err) { 
                        console.log(err);
                        return res.status(500).send(err); 
                    } 

                    let uploadHeaders = {
                        'X-Agile-Authorization': authToken,
                        'X-Agile-Directory': webConfig.llnw['X-Agile-Directory']+'/event_images',
                        'X-Agile-Basename': 'events_'+fileName+fileExt
                    };     

                    const fileBuffer = fs.readFileSync('/tmp/'+req.files.image.name);
                    
                    axios({
                        method: 'post',
                        url: webConfig.llnw['uploadURL'],
                        headers: uploadHeaders, 
                        data: fileBuffer
                    })
                    .then(response=>{
                        // 기존 파일 삭제
                        let oldFile = req.body.olduri.replace(webConfig.llnw['baseImageDomain'],'');

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
                                        "path": oldFile, 
                                    }
                                    , "jsonrpc": "2.0"
                                };     
                                
                                axios({
                                    method: 'post',
                                    url:  webConfig.llnw['jsonRPC'],
                                    headers: {}, 
                                    data: deletefileJSON
                                })
                                .then(response=>{

                                    fs.unlink('/tmp/'+req.files.image.name, err=>{
                                        console.log('파일 지웠음.::: '+'/tmp/'+req.files.image.name);
                                        if(err) {
                                            console.log(JSON.stringify(err));
                                        }
                                    });

                                    //파일 정보 업데이트
                                    Events
                                    .update({ image_uri: imageURL}, {
                                        where: {
                                            id: req.body.id
                                        }
                                    })
                                    .then(response=>{
                                        res.jsonp(ResponseCode.OK);
                                    })
                                })
                        })
                        
                    })
                    .catch(error=>{
                        console.log("catch : " + error.message);
                        res.jsonp(ResponseCode.ERROR);                        
                    })
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
        }
            
        
    },

    updateMobilebanner(req, res) {
        console.log(`[EventsController.updateMobilebanner]`);

        if ( !req.files || !req.files.imageM) {
            //첨부파일 없음
            console.log("파일 첨부 없음.");
            return res.jsonp(ResponseCode.OK);
        } else {
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
                //let fileName = fileNameGenerate(15);
                let fileNameM = fileNameGenerate(15);
                //let fileExt = path.extname(req.files.image.name);
                let fileExtM = path.extname(req.files.imageM.name);
                //let imageURL = webConfig.llnw['baseImageURL']+'/event_images/events_'+fileName+fileExt;     
                let imageURLM = webConfig.llnw['baseImageURL']+'/event_images/events_'+fileNameM+'_M'+fileExtM;     
    
                console.log("CDN imageURL::: "+imageURLM);
                //console.log("CDN imageURL::: "+imageURLM);
    
                req.files.imageM.mv('/tmp/'+req.files.imageM.name, err=>{
                    if (err) { 
                        console.log(err);
                        return res.status(500).send(err); 
                    } 

                    let uploadHeaders = {
                        'X-Agile-Authorization': authToken,
                        'X-Agile-Directory': webConfig.llnw['X-Agile-Directory']+'/event_images',
                        'X-Agile-Basename': 'events_'+fileNameM+'_M'+fileExtM
                    };     

                    const fileBufferM = fs.readFileSync('/tmp/'+req.files.imageM.name);
                    
                    axios({
                        method: 'post',
                        url: webConfig.llnw['uploadURL'],
                        headers: uploadHeaders, 
                        data: fileBufferM
                    })
                    .then(response=>{
                        // 기존 파일 삭제
                        let oldFile = req.body.olduri.replace(webConfig.llnw['baseImageDomain'],'');

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
                                        "path": oldFile, 
                                    }
                                    , "jsonrpc": "2.0"
                                };     
                                
                                axios({
                                    method: 'post',
                                    url:  webConfig.llnw['jsonRPC'],
                                    headers: {}, 
                                    data: deletefileJSON
                                })
                                .then(response=>{

                                    fs.unlink('/tmp/'+req.files.imageM.name, err=>{
                                        console.log('파일 지웠음.::: '+'/tmp/'+req.files.imageM.name);
                                        if(err) {
                                            console.log(JSON.stringify(err));
                                        }
                                    });

                                    //파일 정보 업데이트
                                    Events
                                    .update({ mobile_image_uri: imageURLM}, {
                                        where: {
                                            id: req.body.id
                                        }
                                    })
                                    .then(response=>{
                                        res.jsonp(ResponseCode.OK);
                                    })
                                })
                        })
                        
                    })
                    .catch(error=>{
                        console.log("catch : " + error.message);
                        res.jsonp(ResponseCode.ERROR);                        
                    })
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
        }        
    },

    deleteNresponseJson(req, res){
        console.log(`[EventsController.delete] delete a Event id is: %j`, req.body);
        const
            fields = [ 'id'],
            validator = new Validator([
                { name: 'id', required: true },
            ])

        result = validator.validate(req.body);
        if (result !== true) {
            return req.jsonp(ResponseCode.INVALID_PARAMETERS);
        }

        Events
            .findByPk(req.body.id)
            .then( (EventInfo)=> {

                if(!EventInfo){
                    return req.jsonp(ResponseCode.NO_CONTENTS);
                }

                let image_uri = EventInfo.image_uri.replace(webConfig.llnw['baseImageDomain'],'');
                let mobile_image_uri = EventInfo.mobile_image_uri ? EventInfo.mobile_image_uri.replace(webConfig.llnw['baseImageDomain'],''): '';

                console.log('이미지 경로 보자 : \n%j \n%j', image_uri, mobile_image_uri);

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

                    let deletefileMJSON= {
                        "method": "deleteFile", 
                        "id": 2, 
                        "params": { 
                            "token": token,
                            "path": mobile_image_uri, 
                        }
                        , "jsonrpc": "2.0"
                    };                

                    Promise.all([
                        axios({
                            method: 'post',
                            url:  webConfig.llnw['jsonRPC'],
                            headers: {}, 
                            data: deletefileJSON
                        }) ,
                        axios({
                            method: 'post',
                            url:  webConfig.llnw['jsonRPC'],
                            headers: {}, 
                            data: deletefileMJSON
                        })

                    ])
                    .then( (response, responseM)=> {
                        Events
                        .destroy({
                            where: {
                                id: req.body.id
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

module.exports = EventsController;