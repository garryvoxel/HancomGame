const
    Sequelize = require('sequelize'),
    config = require(__dirname + '/../config/config.json'),
    models = require(__dirname + '/../models'),
    Validator = require(__dirname + '/../classes/validator'),
    Pagination = require(__dirname + '/../classes/pagination'),
    UserUtils = require(__dirname + '/../classes/userutils'),
    ResponseCode = require(__dirname + '/../classes/response_code'),
    Op = Sequelize.Op,
    ForumClan = models.ForumClan;
    ForumC_Comment = models.ForumC_Comment;
    Users = models.Users;

const ForumClanController = {
    /**
     * 자유게시판 목록 페이지
     */
    indexNresponseJson(req, res) {
        console.log(`ForumClanController.indexNresponseJson] req.query: %j`, req.query);

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

        if (orderby) {
            order = [ [ orderby, (sort || 'DESC').toUpperCase() ] ];
        } else {
            order = [ [ 'id', 'DESC' ] ];
        }

        //삭제된글 처리 
        if(req.query.deleted_flag == 0) where = { ...where, deleted_at: { [Op.eq]: null} };

        //클랜 소속글만 보이기
        where = { ...where, clan_id: req.query.clan_id };

        let ResResult = '';

        ForumClan
            .findAndCountAll({
                where: where,
                order: order,
                offset: (page - 1) * count,
                limit: count,
                raw: true
            })
            .then(ForumClan => {
                var result = JSON.parse(JSON.stringify(ForumClan));
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
     * 자유게시판 상세 및 편집
     */
    infoNresponseJson(req, res) {
        console.log(`[ForumClanController.infoNresponseJson] serve a ForumClan info: ${req.params.id}.`);

        let ResResult={};
        ForumClan
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

                sql = " SELECT *, ifnull(parent_id, id) as parent_group  FROM WebDB.ForumC_Comment where post_id = :id order by post_id desc, parent_group, id ";

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

 
    /**
     * 자유게시판 수정
     */
    updateNresponseJson(req, res) {
        console.log(`[ForumClanController.update] Update a ForumClan id is ${req.params.id}: %j`, req.body);

        const
            fields = [ 'display_name', 'username', 'password', 'permissions', 'is_active'],
            validator = new Validator([
                { name: 'username', required: true },
                { name: 'display_name', required: true }
            ]),
            ForumClan = {};

        if (ForumClan.password) {
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
                ForumClan[name] = value;
            }
        }

        ForumClan
            .update(ForumClan, {
                where: {
                    id: req.params.id,
                    deleted_at: null
                }
            })
            .then(() => {
                console.log(`A ForumClan has been modified: %j`, ForumClan);

                res.jsonp({
                    status: 'ok',
                    message: "A ForumClan has been modified"
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

    doDeleteNresponseJson(req, res) {
        console.log(`[ForumClanController.doDeleteNresponseJson] Delete ForumClan id is : %j`, req.body);

        ForumClan
            .update({
                deleted_at: models.sequelizes.WebDB.fn('NOW')
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

    doReliveNresponseJson(req, res) {
        console.log(`[ForumClanController.doReliveNresponseJson] Relive ForumClan id is : %j`, req.body);

        ForumClan
            .update({
                deleted_at: null
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

    clanCommentDoDeleteNresponseJson(req, res) {
        ForumC_Comment
            .update({
                deleted_at: models.sequelizes.WebDB.fn('NOW')
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

    clanCommentDoReliveNresponseJson(req, res) {
        ForumC_Comment
            .update({
                deleted_at: null
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

};

module.exports = ForumClanController;