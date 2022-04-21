const
    Sequelize = require('sequelize'),
    config = require(__dirname + '/../config/config.json'),
    models = require(__dirname + '/../models'),
    Validator = require(__dirname + '/../classes/validator'),
    Pagination = require(__dirname + '/../classes/pagination'),
    UserUtils = require(__dirname + '/../classes/userutils'),
    ResponseCode = require(__dirname + '/../classes/response_code'),
    Op = Sequelize.Op,
    Forum = models.Forum;
    ForumComment = models.ForumComment;
    ForumReports = models.ForumReports;
    Users = models.Users;
    Accusation = models.Accusation;

const ForumController = {
    /**
     * 자유게시판 목록 페이지
     */
    indexNresponseJson(req, res) {
        console.log(`ForumController.indexNresponseJson] req.query: %j`, req.query);

        if(req.query.keyword && (req.query.fieldId == "3" || req.query.fieldId == "0" )) {
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


        function mainProcess(req,res,idArr) {
            const
            query = req.query || {},
            page = parseInt(query.page || 1),
            count = parseInt(query.count || 10),
            fieldId = query.fieldId || "0",
            keyword = query.keyword || null,
            orderby = query.orderby,
            sort = query.sort;

        let
            where, order;

        //console.log("여기는 선택분기 들어가기전 : %j", fieldId);

        if (keyword) {
            switch (fieldId) {
                case "1":
                    where = { subject: { [Op.like]: '%' + keyword + '%' } };
                    break;

                case "2":
                    where = { content: { [Op.like]: '%' + keyword + '%' } };
                    break;

                case "3":
                    where = { author_id: idArr };
                break;

                case "0":
                default:
                    where = {
                        [Op.or]: [
                            { subject: { [Op.like]: '%' + keyword + '%' }},
                            { content: { [Op.like]: '%' + keyword + '%'}},
                            { author_id: idArr }
                        ]
                    };
                    break;
            }
        }

        let orderArr = [];
        if(req.query.ordered_by && req.query.ordered_to) {
            //console.log('정렬들어왔음.');
            orderArr = [[req.query.ordered_by, req.query.ordered_to]];
        } else {
            orderArr = [ [ 'id', 'DESC' ] ];
        }

        //삭제된글 처리 
        if(req.query.deleted_flag == 0) where = { ...where, deleted_at: { [Op.eq]: null} };

        let ResResult = '';

        Forum
            .findAndCountAll({
                where: where,
                order: orderArr,
                offset: (page - 1) * count,
                limit: count
            })
            .then(Forum => {
                var result = JSON.parse(JSON.stringify(Forum));
                delete result['password'];
                result['pagination'] = new Pagination(req, result.count),
                result['page']=page;
                //res.jsonp(result); 

                ResResult = result;

                //유저목록 ID 추출
                let authorsArr = []
                    , authorObj = {};
                for (i in ResResult.rows) {
                    authorsArr.push(ResResult.rows[i].author_id)
                }

                //유저목록 중복 ID 제거
                authorsArr = Array.from(new Set(authorsArr));
                //console.log(authorsArr);

                Users
                    .findAll({
                    where: { id: authorsArr }
                    , raw: true 
                    })
                    .then(userList=>{
                        //console.log(userList);
                        for(i in userList){
                            authorObj[userList[i].id] = userList[i].nickname;
                        }
                        //console.log(authorObj);
                        //글 레코드에 nickname 달아주기
                        for(i in ResResult.rows){
                            //console.log(authorObj[ResResult.rows[i].author_id]);
                            ResResult.rows[i].nickname = authorObj[ResResult.rows[i].author_id] ;
                        }
                        //console.log(JSON.stringify(ResResult));
                        return res.jsonp({...ResponseCode.OK, result: ResResult} );
                    })
                    .catch(error=>{ 
                        console.log("ERROR: "+error.message);
                        res.jsonp(ResponseCode.SQLERROR)}
                    );
                /*
                return Promise.all(
                    result.rows.map(forum => {
                        return User.findByPk(forum.author_id)
                    })
                ) 
                */
            })
            .catch(error=>{ 
                console.log("ERROR: "+error.message);
                res.jsonp(ResponseCode.SQLERROR)}
            );            
        }

    },

    /**
     * 자유게시판-원글 신고글 리스트
     */
    reportPostIndexNresponseJson(req, res) {
        console.log(`[ForumController.reportIndex] req.query : %j`, req.query);

        const
            query = req.query || {},
            page = parseInt(query.page || 1),
            count = parseInt(query.count || 10),
            fieldId = query.field || 0,
            keyword = query.keyword || null,
            orderby = query.orderby,
            sort = query.sort;

        let
            where, order;

        where = {
            [Op.and]: {
                reports: {
                    [Op.gt]: 0
                },
                managed_at: {
                    [Op.eq]: null
                }
            }
            
        }
            
        let ResResult = {};

        Forum
            .findAndCountAll({
                where: where,
                order: order,
                offset: (page - 1) * count,
                limit: count
            })
            .then(Forum => {
                var result = JSON.parse(JSON.stringify(Forum));
                result['pagination'] = new Pagination(req, result.count),
                result['page']=page;
                //res.jsonp(result); 

                ResResult = result;

                //유저목록 ID 추출
                let authorsArr = []
                    , authorObj = {};
                for (i in ResResult.rows) {
                    authorsArr.push(ResResult.rows[i].author_id)
                }

                //유저목록 중복 ID 제거
                authorsArr = Array.from(new Set(authorsArr));
                //console.log(authorsArr);

                Users
                    .findAll({
                    where: { id: authorsArr }
                    , raw: true 
                    })
                    .then(userList=>{
                        //console.log(userList);
                        for(i in userList){
                            authorObj[userList[i].id] = userList[i].nickname;
                        }
                        //console.log(authorObj);
                        //글 레코드에 nickname 달아주기
                        for(i in ResResult.rows){
                            //console.log(authorObj[ResResult.rows[i].author_id]);
                            ResResult.rows[i].nickname = authorObj[ResResult.rows[i].author_id] ;
                        }
                        //console.log(JSON.stringify(ResResult));
                        return res.jsonp({...ResponseCode.OK, result: ResResult} );
                    })
                    .catch(error=>{ 
                        console.log("ERROR: "+error.message);
                        res.jsonp(ResponseCode.SQLERROR)}
                    );
                /*
                return Promise.all(
                    result.rows.map(forum => {
                        return User.findByPk(forum.author_id)
                    })
                ) 
                */
            })
            .catch(error=>{ 
                console.log("ERROR: "+error.message);
                res.jsonp(ResponseCode.SQLERROR)}
            );
    },
        
    /**
     * 자유게시판-댓글 신고글 리스트
     */
    reportCommentIndexNresponseJson(req, res) {
        console.log(`[ForumController.reportCommentIndexNresponseJson] req.query : %j`, req.query);

        const
            query = req.query || {},
            page = parseInt(query.page || 1),
            count = parseInt(query.count || 10),
            fieldId = query.field || 0,
            keyword = query.keyword || null,
            orderby = query.orderby,
            sort = query.sort;

        let
            where, order;

        where = {
            [Op.and]: {
                reports: {
                    [Op.gt]: 0
                },
                managed_at: {
                    [Op.eq]: null
                }
            }
            
        }
            
        let ResResult = {};

        ForumComment
            .findAndCountAll({
                where: where,
                order: order,
                offset: (page - 1) * count,
                limit: count,
                raw: true
            })
            .then(Forum => {
                var result = JSON.parse(JSON.stringify(Forum));
                result['pagination'] = new Pagination(req, result.count),
                result['page']=page;
                //res.jsonp(result); 

                ResResult = result;

                //유저목록 ID 추출
                let authorsArr = []
                    , authorObj = {};
                
                authorsArr = extractUserid(ResResult.rows, 'author_id');

                console.log(authorsArr);

                Users
                    .findAll({
                    where: { id: authorsArr }
                    , raw: true 
                    })
                    .then(userList=>{
                        //console.log(userList);
                        for(i in userList){
                            authorObj[userList[i].id] = userList[i].nickname;
                        }
                        //console.log(authorObj);
                        //글 레코드에 nickname 달아주기
                        for(i in ResResult.rows){
                            //console.log(authorObj[ResResult.rows[i].author_id]);
                            ResResult.rows[i].nickname = authorObj[ResResult.rows[i].author_id] ;
                        }
                        //console.log(JSON.stringify(ResResult));
                        return res.jsonp({...ResponseCode.OK, result: ResResult} );
                    })
                    .catch(error=>{ 
                        console.log("ERROR: "+error.message);
                        res.jsonp(ResponseCode.SQLERROR)}
                    );
                /*
                return Promise.all(
                    result.rows.map(forum => {
                        return User.findByPk(forum.author_id)
                    })
                ) 
                */
            })
            .catch(error=>{ 
                console.log("ERROR: "+error.message);
                res.jsonp(ResponseCode.SQLERROR)}
            );

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
    
    /**
     * 자유게시판 상세 및 편집
     */
    infoNresponseJson(req, res) {
        console.log(`[ForumController.infoNresponseJson] serve a Forum info: ${req.params.id}.`);

        let ResResult={};
        Forum
            .findByPk(req.params.id, {raw: true})
            .then(forumInfo => {
                //console.log('확인하자:: %j', forumInfo);
                ResResult.forumInfo = forumInfo;

                return Users
                .findByPk(forumInfo.author_id, {attributes: ['nickname'] , raw: true})
            })
            .then(userInfo=>{
                //console.log('확인하자:: %j', userInfo);
                ResResult.userInfo = userInfo;

                sql = " SELECT *, ifnull(parent_id, id) as parent_group  FROM WebDB.ForumComments where post_id = :id order by post_id desc, parent_group, id ";

                return models.sequelizes.WebDB.query(sql, {
                    replacements: {id: req.params.id},
                    type: models.Sequelize.QueryTypes.SELECT,
                    raw: true
                })
            })
            .then(response=>{
                ResResult['commentInfo'] = response;

                // 댓글들 작성자 닉네임 가져오기
                let userIds = [];
                ResResult['commentInfo'].forEach(comment=>{
                    userIds.push(comment.author_id);
                });
                // 중복제거
                userIds = Array.from(new Set(userIds));
                
                if(userIds.length == 0) userIds = [''];
                
                return models.sequelizes.AccountDB.query(" select id, nickname from Users where id in ( :ids ) ", {
                    replacements: {
                        ids: userIds},
                    type: models.Sequelize.QueryTypes.SELECT,
                    raw: true
                })
            })
            .then(response=>{

                // 각 댓글에 닉네임 넣어 주기
                let authorObj = {};
                for(i in response){
                    authorObj[response[i].id] = response[i].nickname;
                }
                for(let i in ResResult['commentInfo'] ) {
                    ResResult['commentInfo'][i].nickname = authorObj[ResResult['commentInfo'][i].author_id] ;
                }       
                
                console.log("이것 맞지요? :::  %j", ResResult);
                res.jsonp({...ResponseCode.OK, result: ResResult});
            })
            .catch(error=>{
                console.log('Catch:: %j', error);
                res.jsonp(ResponseCode.SQLERROR);
            });
    },

    reportPostInfoNresponseJson(req, res) {
        console.log(`[ForumController.reportPostInfoNresponseJson] serve a Forum info: ${req.params.id}.`);

        let ResResult={};
        Forum
            .findByPk(req.params.id, {raw: true})
            .then(forumInfo => {
                //console.log('확인하자:: %j', forumInfo);
                ResResult.forumInfo = forumInfo;

                return ForumReports
                .findAll ({
                    attributes: ['report_id'
                        , [Sequelize.fn('COUNT', 'id'), 'reportCounts']
                        , [models.sequelizes.WebDB.literal('(SELECT subject FROM `Reports` WHERE `Reports`.`id` = `ForumReports`.`report_id`)'), 'reportTypeName']    
                    ], 
                    where: {
                        type: 'post',
                        source_id: forumInfo.id
                    },
                    group: 'report_id',
                    raw: true
                })
            })
            .then(reportList=>{
                //console.log('확인하자:: %j', reportList);
                ResResult.reportsList = reportList;

                return Users
                .findByPk(ResResult.forumInfo.author_id, {attributes: ['id','nickname'] , raw: true})
            })
            .then(userInfo=>{
                //console.log('확인하자:: %j', userInfo);
                ResResult.userInfo = userInfo;
                res.jsonp({...ResponseCode.OK, result: ResResult});
            })
            .catch(error=>{
                console.log('Catch:: %j', error);
                res.jsonp(ResponseCode.SQLERROR);
            });
    },

    reportCommentInfoNresponseJson(req, res){
        console.log(`[ForumController.reportCommentInfoNresponseJson] serve a Comment info: ${req.params.id}.`);

        //코멘트의 정보와
        //작성자
        //신고내역을 가져온다.
        let ResResult = {};

        ForumComment
            .findByPk(req.params.id, {raw:true})
            .then(commentInfo=>{
                //console.log('%j', commentInfo);
                ResResult.commentInfo = commentInfo;

                return ForumReports
                .findAll ({
                    attributes: ['report_id'
                        , [Sequelize.fn('COUNT', 'id'), 'reportCounts']
                        , [models.sequelizes.WebDB.literal('(SELECT subject FROM `Reports` WHERE `Reports`.`id` = `ForumReports`.`report_id`)'), 'reportTypeName']    
                        , [models.sequelizes.WebDB.literal(' GROUP_CONCAT( reporter_id SEPARATOR ",") '), 'userIds']    
                    ], 
                    where: {
                        type: 'comment',
                        source_id: req.params.id
                    },
                    group: 'report_id',
                    raw: true
                })                
            })
            .then(reportList=>{
                //console.log(`reportList ::: %j`, reportList)
                ResResult.reportList = reportList;

                //유저의 nickname 을 가져옴
                return Users
                    .findByPk( ResResult.commentInfo.author_id ,{
                        attributes:['id','nickname'],
                        raw: true
                    })

            })
            .then(UserInfo=>{
                //console.log (' %j ', UserInfo);
                ResResult.commentInfo.author_nickname = UserInfo.nickname;
                return
            })
            .then(()=>{
                res.jsonp({...ResponseCode.OK, result: ResResult});
            })
    },

    /**
     * 자유게시판 수정
     */
    updateNresponseJson(req, res) {
        console.log(`[ForumController.update] Update a Forum id is ${req.params.id}: %j`, req.body);

        const
            fields = [ 'display_name', 'username', 'password', 'permissions', 'is_active'],
            validator = new Validator([
                { name: 'username', required: true },
                { name: 'display_name', required: true }
            ]),
            Forum = {};

        if (Forum.password) {
            validator.rules.push({ name: 'password', required: true, confirmed: true });
        }

        result = validator.validate(req.body);
        if (result !== true) {
            return onUpdateFailed(result);
        }

        for (var i in fields) {
            const
                name = fields[i],
                value = req.body[name];

            if (value != undefined && value != null) {
                Forum[name] = value;
            }
        }

        Forum
            .update(Forum, {
                where: {
                    id: req.params.id,
                    deleted_at: null
                }
            })
            .then(() => {
                console.log(`A Forum has been modified: %j`, Forum);

                res.jsonp({
                    status: 'ok',
                    message: "A Forum has been modified"
                });
            })
            .catch(error => {
                onUpdateFailed(`저장에 실패하였습니다: ${error}.`);
            });

        function onUpdateFailed(message) {
            console.error(message);

            res.jsonp({
                status: 'fail',
                message: message
            });
        }
    },

    reportPostIssueClearNresponseJson(req, res) {
        console.log(`[ForumController.reportPostIssueClearNresponseJson] Do issue clear Forum id is : %j`, req.body);

        Forum
            .update({
                is_managed: 'N'
                , managed_at: models.sequelizes.WebDB.fn('NOW')
            }, {
                where: {
                    id: req.body.id
                }
            })
            .then(result=>{
                res.jsonp(ResponseCode.OK);
            })
            .catch(error=>{
                console.log('%j', error);
                res.jsonp(ResponseCode.SQLERROR);
            });
            
    },

    reportPostDoDeleteNresponseJson(req, res) {
        console.log(`[ForumController.reportPostDoDeleteNresponseJson] Delete Forum id is : %j`, req.body);

        Forum
            .update({
                is_managed: 'D'
                , managed_at: models.sequelizes.WebDB.fn('NOW')
                , deleted_at: models.sequelizes.WebDB.fn('NOW')
            }, {
                where: {
                    id: req.body.id
                }
            })
            .then(result=>{
                res.jsonp(ResponseCode.OK);
            })
            .catch(error=>{
                console.log('%j', error);
                res.jsonp(ResponseCode.SQLERROR);
            });        
    },

    reportPostDoReliveNresponseJson(req, res) {
        console.log(`[ForumController.reportPostDoReliveNresponseJson] Relive Forum id is : %j`, req.body);

        Forum
            .update({
                is_managed: ''
                , managed_at: models.sequelizes.WebDB.fn('NOW')
                , deleted_at: null
            }, {
                where: {
                    id: req.body.id
                }
            })
            .then(result=>{
                res.jsonp(ResponseCode.OK);
            })
            .catch(error=>{
                console.log('%j', error);
                res.jsonp(ResponseCode.SQLERROR);
            });        
    },

    reportCommentIssueClearNresponseJson(req, res) {
        console.log(`[ForumController.reportCommentIssueClearNresponseJson] Do issue clear Forum id is : %j`, req.body);

        ForumComment
            .update({
                is_managed: 'N'
                , managed_at: models.sequelizes.WebDB.fn('NOW')
            }, {
                where: {
                    id: req.body.id
                }
            })
            .then(result=>{
                res.jsonp(ResponseCode.OK);
            })
            .catch(error=>{
                console.log('%j', error);
                res.jsonp(ResponseCode.SQLERROR);
            });
            
    },

    reportCommentDoDeleteNresponseJson(req, res) {
        console.log(`[ForumController.reportCommentDoDeleteNresponseJson] Delete Forum id is : %j`, req.body);

        ForumComment
            .update({
                is_managed: 'D'
                , managed_at: models.sequelizes.WebDB.fn('NOW')
                , deleted_at: models.sequelizes.WebDB.fn('NOW')
            }, {
                where: {
                    id: req.body.id
                }
            })
            .then(result=>{
                res.jsonp(ResponseCode.OK);
            })
            .catch(error=>{
                console.log('%j', error);
                res.jsonp(ResponseCode.SQLERROR);
            });        
    },
    
    reportCommentDoReliveNresponseJson(req, res) {
        console.log(`[ForumController.reportCommentDoReliveNresponseJson] Relive ForumComment id is : %j`, req.body);

        ForumComment
            .update({
                is_managed: ''
                , managed_at: models.sequelizes.WebDB.fn('NOW')
                , deleted_at: null
            }, {
                where: {
                    id: req.body.id
                }
            })
            .then(result=>{
                res.jsonp(ResponseCode.OK);
            })
            .catch(error=>{
                console.log('%j', error);
                res.jsonp(ResponseCode.SQLERROR);
            });        
    },

    /**
     * 새로 변경된 자게신고글 관리
     */

    accusationIndexNresponseJson(req, res) {
        console.log(`[ForumController.accusationIndexNresponseJson] req.query : %j`, req.query);

        const
        query = req.query || {},
        page = parseInt(query.page || 1),
        count = parseInt(query.count || 10),
        fieldId = query.fieldId || "0",
        keyword = query.keyword || null,
        orderby = query.orderby,
        sort = query.sort;

        let where='', order='';

        if (keyword) {
            switch (fieldId) {
                case "1":
                    //where = { subject: { [Op.like]: '%' + keyword + '%' } };
                    where = " where subject like '%" + keyword +"%'";
                    break;

                case "2":
                    //where = { author_id: idArr };
                    where = " where  nickname like '%" + keyword +"%'";
                break;

                case "0":
                default:
                    /*
                    where = {
                        [Op.or]: [
                            { subject: { [Op.like]: '%' + keyword + '%' }},
                            { content: { [Op.like]: '%' + keyword + '%'}},
                            { author_id: idArr }
                        ]
                    };
                    */
                   where = " where subject like '%" + keyword +"%' or nickname like '%" + keyword+"%'";
                    break;
            }
        }

        if (orderby) {
            order = [ [ orderby, (sort || 'DESC').toUpperCase() ] ];
        } else {
            order = [ [ 'id', 'DESC' ] ];
        }

       /*
        countsql = `
            SELECT 
            COUNT(*) AS total_count
            FROM
                (SELECT 
                    MIN(type),
                    MIN(target_id)
                FROM
                    WebDB.Accusation
                GROUP BY type , target_id , target_nickname , is_complete) AS AL        
        `;
        */

        let sql = `
            SELECT 
                ALS.type AS type,
                ALS.target_id AS target_id,
                ALS.cnt AS cnt,
                ALS.created_at AS created_at,
                (CASE
                    WHEN ALS.type = 1 THEN IFNULL (ALS.forum_subject,"")
                    WHEN ALS.type = 2 THEN IFNULL (ALS.forum_comment,"")
                    WHEN ALS.type = 3 THEN IFNULL (ALS.fromC_subject, "")
                    WHEN ALS.type = 4 THEN IFNULL (ALS.forumC_comment, "")
                END) AS subject,
                ALS.nickname,
                ALS.is_complete
            FROM
                (SELECT 
                    *,
                        (SELECT 
                                subject
                            FROM
                                WebDB.Forum
                            WHERE
                                id = AL.target_id) AS forum_subject,
                        (SELECT 
                                comment
                            FROM
                                WebDB.ForumComments
                            WHERE
                                id = AL.target_id) AS forum_comment,
                        (SELECT 
                                subject
                            FROM
                                WebDB.ForumClan
                            WHERE
                                id = AL.target_id) AS fromC_subject,
                        (SELECT 
                                comment
                            FROM
                                WebDB.ForumC_Comment
                            WHERE
                                id = AL.target_id) AS forumC_comment
                FROM
                    (SELECT 
                    MIN(type) AS type,
                        MIN(target_id) AS target_id,
                        MIN(target_nickname) AS nickname,
                        COUNT(idx) AS cnt,
                        MIN(created_at) AS created_at,
                        MIN(is_complete) AS is_complete
                FROM
                    WebDB.Accusation
                    GROUP BY type , target_id , target_nickname , is_complete
                ORDER BY created_at DESC) AS AL) AS ALS
            `;

        //for searching
        let countsql = 'select count(*) as total_count from ( ' + sql + ' ) aList ' + where;
        sql = 'select * from ( ' + sql + ' ) aList ' + where ;

        
        //for pagenation
            sql += ' limit '+(page - 1) * count+','+ count;

        Promise.all([
            models.sequelizes.WebDB.query(countsql,{
                type: models.Sequelize.QueryTypes.SELECT,
                raw: true
            }),            
            models.sequelizes.WebDB.query(sql,{
                type: models.Sequelize.QueryTypes.SELECT,
                raw: true
            })
        ])
        .then(response=>{

            //console.log(`Listing::: %j`, response);

            let ResResult = {}; 
            ResResult['rows'] = response[1];
            ResResult['pagination'] = new Pagination(req, response[0][0].total_count),
            ResResult['page']=page;

            res.jsonp({...ResponseCode.OK, result: ResResult});
        })  

    },
    accusationInfoNresponseJson(req, res) {
        console.log(`[ForumController.accusationInfoNresponseJson] req.params : %j`, req.params);
        
        let paramsArr = req.params.id.split('_');
        let type = paramsArr[0];
        let target_id = paramsArr[1];

        console.log(`params type::: %j , target_id::: %j`, type, target_id);

        let ResResult = {};

        ResResult['type'] = type;
        ResResult['target_id'] = target_id;

        // 원글 정보 가져오기
        let sql='';

        switch(type) {
            case '1':
                sql = ` select * from Forum where id = :id `;  
                break;
            case '2':
                sql = ` select fm.* from Forum as fm inner join ForumComments as fc on fc.post_id = fm.id where fc.id = :id `;
                break;
            case '3':
                sql = ` select * from ForumClan where id = :id `;
                break;
            case '4':
                sql = ` select fm.* from ForumClan as fm inner join ForumC_Comment as fc on fc.post_id = fm.id where fc.id = :id `
                break;
            default:

        }

        models.sequelizes.WebDB.query(sql, {
            replacements: {id: target_id},
            type: models.Sequelize.QueryTypes.SELECT,
            raw: true
        })
        .then(response=>{
            //console.log(`컨텐츠 내용::: %j`, response);
            ResResult['articleInfo'] = response[0];

            //덧글들 정보
            let boardName = '';
            switch (type) {
                case '1' :
                case '2' : boardName = "WebDB.ForumComments"
                break;
                case '3' :
                case '4' : boardName = "WebDB.ForumC_Comment"
                break;
                default :
            }


            let a_author_id = 0 , a_id = 0;
            if(typeof(response[0]) === 'undefined')  { 
                a_author_id = 0;
                a_id = 0;
            } else { 
                a_author_id = response[0].author_id ;
                a_id = response[0].id
            };

            let nickname_sql = " select nickname from AccountDB.Users where id = :author_id ";
            sql = " SELECT *, ifnull(parent_id, id) as parent_group  FROM "+ boardName +" where post_id = :id order by post_id desc, parent_group, id ";

            Promise.all([
                models.sequelizes.WebDB.query(nickname_sql, {
                    replacements: {author_id: a_author_id},
                    type: models.Sequelize.QueryTypes.SELECT,
                    raw: true
                }),                
                models.sequelizes.WebDB.query(sql, {
                    replacements: {id: a_id},
                    type: models.Sequelize.QueryTypes.SELECT,
                    raw: true
                })
            ])
            .then(response=>{
                if(typeof(response[0][0]) === 'undefined') {} else {
                    console.log(typeof(response[0][0]));
                    ResResult['articleInfo'].nickname = response[0][0].nickname;
                }
                
                ResResult['commentInfo'] = response[1];

                //신고 내용 요약.
                let count_query = "select  count(*) as total_count from WebDB.Accusation where type= :type and target_id = :target_id ";
                sql = "select  accustaion_type , count(*) as cnt, group_concat(from_nickname) as from_nicknames , min(target_nickname) as target_nickname from WebDB.Accusation where type= :type and target_id = :target_id group by accustaion_type"

                // 댓글들 작성자 닉네임 가져오기
                let userIds = [];
                ResResult['commentInfo'].forEach(comment=>{
                    userIds.push(comment.author_id);
                });
                // 중복제거
                userIds = Array.from(new Set(userIds));
                
                if(userIds.length == 0) userIds = [''];

                Promise.all([
                    models.sequelizes.WebDB.query(count_query, {
                        replacements: {
                            type: type ,
                            target_id: target_id},
                        type: models.Sequelize.QueryTypes.SELECT,
                        raw: true
                    }),                    
                    models.sequelizes.WebDB.query(sql, {
                        replacements: {
                            type: type ,
                            target_id: target_id},
                        type: models.Sequelize.QueryTypes.SELECT,
                        raw: true
                    }),
                    models.sequelizes.AccountDB.query(" select id, nickname from Users where id in ( :ids ) ", {
                        replacements: {
                            ids: userIds},
                        type: models.Sequelize.QueryTypes.SELECT,
                        raw: true
                    }),                    
                ])
                .then(response=>{
                    ResResult['accusationCount'] = response[0][0].total_count;
                    ResResult['accusationInfo'] = response[1];

                    //ResResult['commentNickNames'] = response[2];
                    // 각 댓글에 닉네임 넣어 주기
                    let authorObj = {};
                    for(i in response[2]){
                        authorObj[response[2][i].id] = response[2][i].nickname;
                    }
                    for(let i in ResResult['commentInfo'] ) {
                        ResResult['commentInfo'][i].nickname = authorObj[ResResult['commentInfo'][i].author_id] ;
                    }
                    //console.log(ResResult);
                    res.jsonp({...ResponseCode.OK, result:ResResult});
                })
                
            })
            
        })
       
    },
    accusationIssueClearNresponseJson(req, res) {
        console.log(`[ForumController.accusationIssueClearNresponseJson] req.body : %j`, req.body);

        Accusation
        .update({
            is_complete: 1
        },{
            where: {
                type: req.body.type ,
                target_id: req.body.target_id
            }
        })
        .then( response=>{
            res.jsonp(ResponseCode.OK);
        })
        
    },
    accusationDoDeleteNresponseJson(req, res) {
        console.log(`[ForumController.accusationDoDeleteNresponseJson] req.body : %j`, req.body);

        Accusation
        .update({
            is_complete: 1
        },{
            where: {
                type: req.body.type ,
                target_id: req.body.target_id
            }
        })
        .then( response=>{
            let sql='';
            switch(req.body.type) {
                case '1': 
                    sql = "update WebDB.Forum set deleted_at = now() where id = :id ";
                    break;
                case '2': 
                    //sql = "update WebDB.ForumComments set comment='요청자 혹은 관리자에 의해 삭제된 덧글입니다.' where id = :id " ; 
                    sql = "update WebDB.ForumComments set deleted_at = now() where id = :id " ; 
                    break;
                case '3': 
                    sql = "update WebDB.ForumClan set deleted_at = now() where id = :id" ; 
                    break;
                case '4': 
                    //sql = "update WebDB.ForumC_Comment set comment='요청자 혹은 관리자에 의해 삭제된 덧글입니다.' where id = :id " ; 
                    sql = "update WebDB.ForumC_Comment set deleted_at = now() where id = :id " ; 
                    break;
                default: 
                    sql = " select 1 "
            }

            models.sequelizes.WebDB.query(sql, {
                replacements: {
                    id: req.body.target_id
                }
            })
            .then(response=>{
                res.jsonp(ResponseCode.OK);
            })
            
        })

    },
    accusationDoReliveNresponseJson(req, res) {
        console.log(`[ForumController.accusationDoReliveNresponseJson] req.body : %j`, req.body);

        Accusation
        .update({
            is_complete: 1
        },{
            where: {
                type: req.body.type ,
                target_id: req.body.target_id
            }
        })
        .then( response=>{
            let sql='';
            switch(req.body.type) {
                case '1': 
                    sql = "update WebDB.Forum set deleted_at = null where id = :id ";
                    break;
                case '2': 
                    //sql = "update WebDB.ForumComments set comment='요청자 혹은 관리자에 의해 삭제된 덧글입니다.' where id = :id " ; 
                    sql = "update WebDB.ForumComments set deleted_at = null where id = :id " ; 
                    break;
                case '3': 
                    sql = "update WebDB.ForumClan set deleted_at = null where id = :id" ; 
                    break;
                case '4': 
                    //sql = "update WebDB.ForumC_Comment set comment='요청자 혹은 관리자에 의해 삭제된 덧글입니다.' where id = :id " ; 
                    sql = "update WebDB.ForumC_Comment set deleted_at = null where id = :id " ; 
                    break;
                default: 
                    sql = " select 1 "
            }

            models.sequelizes.WebDB.query(sql, {
                replacements: {
                    id: req.body.target_id
                }
            })
            .then(response=>{
                res.jsonp(ResponseCode.OK);
            })
            
        })

    },
    accusationSetBatchNresponseJson(req, res) {
        console.log(`[ForumController.accusationSetBatchNresponseJson] req.body : %j`, req.body);
        // action type 별 ,  게시판 type 과 id 수집
        // req.body.actionType 가 1: 이상없음 처리 | 2: 삭제 처리

        // 우선 신고 게시판의 상태값 변경 
        let where='';
        let sql = `
            update Accusation set is_complete = 1 where is_complete = 0 and 
        `;
        let count = 0;
        let delForumIds = [];
        let delForumCIds = [];
        let delClanIds = [];
        let delClanCIds = [];

        req.body.typeNIds.forEach(function(items){
            tempArr = items.split('_');
            where+=(count > 0? " or ":"")+` ( type = '`+tempArr[0]+`' and target_id ='`+tempArr[1]+`' )` ;
            switch(tempArr[0]) {
                case '1' : delForumIds.push(tempArr[1]); break;
                case '2' : delForumCIds.push(tempArr[1]); break;
                case '3' : delClanIds.push(tempArr[1]); break;
                case '4' : delClanCIds.push(tempArr[1]); break;
            }
            count++;
        });
        
        sql+='( '+where+' ) ';

        models.sequelizes.WebDB.query(sql)
        .then(response=>{

            if(req.body.actionType == 1) {
                // 처리완료 해준것으로 끝
                res.jsonp(ResponseCode.OK);
            } else{
                //2 인것으로 원글 삭제 처리도 진행 함.
                //type 별로 id 목록 수집해서 한번씩 쿼리 날려줌. 
                if(delForumIds.length == 0) delForumIds.push(0);
                if(delForumCIds.length == 0) delForumCIds.push(0);
                if(delClanIds.length == 0) delClanIds.push(0);
                if(delClanCIds.length == 0) delClanCIds.push(0);

                Promise.all([
                    models.sequelizes.WebDB.query("update WebDB.Forum set deleted_at = now() where id in ( :ids )", {
                        replacements: {
                            ids: delForumIds
                        }
                    }),                    
                    models.sequelizes.WebDB.query("update WebDB.ForumComments set deleted_at = now() where id in ( :ids )", {
                        replacements: {
                            ids: delForumCIds
                        }
                    }),
                    models.sequelizes.WebDB.query("update WebDB.ForumClan set deleted_at = now() where id in ( :ids )", {
                        replacements: {
                            ids: delClanIds
                        }
                    }), 
                    models.sequelizes.WebDB.query("update WebDB.ForumC_Comment set deleted_at = now() where id in ( :ids )", {
                        replacements: {
                            ids: delClanCIds
                        }
                    }),                                        
                ])
                .then(response=>{
                    res.jsonp(ResponseCode.OK);
                })
                
            }
        })
    }
};

module.exports = ForumController;