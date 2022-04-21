const
    Sequelize = require('sequelize'),
    config = require(__dirname + '/../config/config.json'),
    models = require(__dirname + '/../models'),
    ResponseCode = require(__dirname + '/../classes/response_code'),
    Validator = require(__dirname + '/../classes/validator'),
    Pagination = require(__dirname + '/../classes/pagination'),
    Op = Sequelize.Op,
    fs = require('fs'),
    Moment =  require('moment'),
    
    csv = require('fast-csv'),
    detectCharacterEncoding = require('detect-character-encoding'),

    PointLogs = models.PointLogs;
    Users = models.Users;

    const PointController = {

    /**
     * 포인트 목록 페이지
     */
    indexNresponseJson(req, res) {
        console.log(`PointController.indexNresponseJson] req.query: %j`, req.query);
    
        if(req.query.keyword && (req.query.fieldId == "1" || req.query.fieldId == "0" )) {
            Users
                .findAll({
                    attributes: ['id','nickname'],
                    where: {
                        nickname: {[Op.like]: '%' + req.query.keyword + '%'}
                    }
                })
                .then(userList=>{
                    let idArr = [];
                    for(let cnt in userList){
                        idArr.push(userList[cnt].id);
                    }
                    mainProcess(req, res, idArr);
                })
            
        } else {
            mainProcess(req, res, []);
        }

            function mainProcess(req,res,idArr){
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
                            case "1":
                                where = { user_id: idArr };
                                break;
            
                            case "2":
                                where = { description: { [Op.like]: '%' + keyword + '%' } };
                                break;
            
                            case "3":
                               
                            break;
            
                            case "0":
                            default:
                                where = {
                                    [Op.or]: [
                                        { description: { [Op.like]: '%' + keyword + '%'}},
                                        { user_id: idArr }
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
            
                    let ResResult = {};
        
                    PointLogs
                    .findAndCountAll({
                        where: where,
                        order: order,
                        offset: (page - 1) * count,
                        limit: count,
                        raw: true
                    })
                    .then(pointLogs => {
                        var result = {};
                        result = pointLogs;
            
                        result['pagination'] = new Pagination(req, result.count),
                        result['page']=page;
        
                        ResResult.result = result;
        
                        let UserIds = [];
                        UserIds = extractUserid(result.rows, 'user_id');
                        //console.log(`닉네임 가져올 유저들. %j`, UserIds);
        
                        return Users
                            .findAll({
                                attributes: ['id','nickname'],
                                where: {
                                    id: UserIds
                                }
                            })
                    })
                    .then(userList=>{
                        //console.log(`유저정보  %j`, userList);
        
                        //id, nickname mapper 작성
                        let id_n_nick_mapper={};
        
                        for(i in userList){
                            id_n_nick_mapper[userList[i].id] = userList[i].nickname;
                        }
        
                        //nickname 넣어주기
                        for( i in ResResult.result.rows ) {
                            ResResult.result.rows[i].nickname = id_n_nick_mapper[ResResult.result.rows[i].user_id]; 
                        }
        
                        res.jsonp({...ResponseCode.OK, ...ResResult}); 
                    })
                    ;      
            }


            //아이디만 찾아서 추출하는 function
            function extractUserid(anArray, keyName){

                if(typeof(anArray) === 'undefined') { 
                    console.log('----- anArray for extract UserIds is undefined'); 
                    return [];  
                }  
                let ids=[];
                if (!anArray.length) return [];
                else {
                    for(let i in anArray){
                        ids.push(anArray[i][keyName])
                    }
                    //유저목록 중복 ID 제거
                    ids = Array.from(new Set(ids));
                    return ids;
                }
            }
    },
    givepointNresponseJson(req, res) {
        console.log(`PointController.givepointNresponseJson] req.body: %j`, req.body);

        if ( !req.files || typeof req.files.csvfile !== 'object' ) {
            //파일 업로드 되지 않았음.
            mainProcess(req,res);
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
                                //myData.push(data);
                                myData = myData.concat(data);
                            }
                        })
                        .on("end", ()=>{
                            if(req.body.nicknames == '') {
                                req.body.nicknames = myData;
                            } else {
                                myData = myData.concat(req.body.nicknames.split(','));
                            }
                            myData = Array.from(new Set(myData)); 
                            req.body.nicknames  = myData;

                            //임시파일 삭제 response
                            fs.unlink( '/tmp/'+fileName, err=>{
                                console.log('파일 지웠음 :'+'/tmp/'+fileName);
                                if(err) {
                                    console.log(err);
                                    return res.jsonp(ResponseCode.ERROR);
                                }
                            }); 
                            mainProcess(req,res);
                        });
                        
                    stream.pipe(csvStream);
                    
                }
            });
        } 

        function mainProcess(req,res){
            if(typeof(req.body.nicknames) == 'string') {
                req.body.nicknames = req.body.nicknames.split(',');
            }

            //유저에게 로그를 쌓고
            Users
            .findAll({
                attributes: [ ['id','user_id'],'nickname', ['points','balance']],
                where: {
                    nickname: req.body.nicknames
                },
                raw: true
            })
            .then(result=>{
                //console.log('%j', result);
                for(let i in result ) {
                    result[i].type = req.body.type;
                    result[i].description = req.body.description;
                    result[i].logtype = 3; // 포인트 지급
                    result[i].pos = 5; // 관리자
                    result[i].amount = req.body.point_amount;
                    //기존값을 balance 가 가지는것으로 변경.
                    //if( req.body.type == 'point' ) result[i].balance = Number(result[i].balance) + Number(req.body.point_amount); 
                }

                /* 프로시져 변경으로 사용하지 않음.
                    for(let a in result) {
                        models.sequelizes.LogDB.query('call SPInsertLog(?,?,?,\
                            ?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,\
                            ?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,\
                            ?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,\
                            ?,?,?,?,?,?,?,?,?,?,@ret);SELECT @ret as ret',
                            { replacements: [10003,result[a].user_id,result[a].nickname,
                                "","","","","","","","","","","","","","","","","","","","",
                                Number(req.body.point_amount),0,10,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                                0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
                                Moment().utcOffset('+0900').format("YYYY-MM-DD HH:mm:ss"),null,null,null,null,null,null,null,null,null],  
                            type: models.sequelizes.LogDB.QueryTypes.RAW  }, ()=>{});                
                    }


                    //로그 쌓고 포인트 지급
                    console.log(`결과.. %j`, result);
                    return Promise.all([
                        PointLogs.bulkCreate(result)
                        ]   
                    );
                */
                for(let a in result) {
                    models.sequelizes.WebDB.query('call web_insert_point(?,?,?,?,?,@total_balance)',
                        { replacements: [result[a].user_id, 3, 0, Number(req.body.point_amount),result[a].description],  
                          type: models.sequelizes.LogDB.QueryTypes.RAW  
                        }, ()=>{});                
                }  
                
                return;
            })
            .then(()=>{
                return Users.update( 
                    {points: models.sequelizes.AccountDB.literal('points + ' + req.body.point_amount)}
                    , {
                        where: {
                            nickname: req.body.nicknames
                        }
                    }
                )
                

            })
            .then(updateRes=>{
                res.jsonp(ResponseCode.OK);
            })            
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

    revokepointNresponseJson(req, res) {
        console.log(`PointController.revokepointNresponseJson] req.body: %j`, req.body);

        let ResResult={};

        PointLogs
            .findAll({
                where: {
                    id: req.body.selectedLogs
                },
                raw:true
            })
            .then(pointLogs=>{
                console.log('point logs %j', pointLogs);
                
                ResResult.pointLogs = pointLogs;

                let instantUserInfo = {} ;
                //포인트 차감 로그를 쌓고 유저정보를 갱신 한다.  트랜잭션을 써본다. 트랜잭션을 못쓴다.. DB 가 달라서...
                for(let i in ResResult.pointLogs) {
                   
                    Users.findByPk(ResResult.pointLogs[i].user_id)
                    .then(UserInfo => {
                        console.log("프로시져 호출");
                        models.sequelizes.WebDB.query('call web_insert_point(?,?,?,?,?,@total_balance)',
                        { replacements: [UserInfo.id, 4, 0, Number(ResResult.pointLogs[i].amount),'관리자 회수'],  
                            type: models.sequelizes.LogDB.QueryTypes.RAW  
                        }, ()=>{});   
                        
                        return Users.update( 
                            {points: models.sequelizes.AccountDB.literal('points - ' + ResResult.pointLogs[i].amount)}
                            , {
                                where: {
                                    id: ResResult.pointLogs[i].user_id
                                }
                            })
                    })
                    .then(()=>{})
                }

                return ;
            })
            .then(updateRes=>{
                res.jsonp({...ResponseCode.OK});
            })
    }

    };

    module.exports = PointController;