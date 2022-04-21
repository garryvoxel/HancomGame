const
    Sequelize = require('sequelize'),
    config = require(__dirname + '/../config/config.json'),
    models = require(__dirname + '/../models'),
    ResponseCode = require(__dirname + '/../classes/response_code'),
    Validator = require(__dirname + '/../classes/validator'),
    Pagination = require(__dirname + '/../classes/pagination'),
    Op = Sequelize.Op,
    
    Users = models.Users;

    School = models.School;
    UserSchool = models.UserSchool;
    FriendShip = models.Friendship;
    Clan = models.Clan;
    ClanMember = models.ClanMember;

    UserSchool.belongsTo(School, {foreignKey: 'school_id'});
    ClanMember.belongsTo(Clan, {foreignKey: 'clan_id'});
    
    function _isRestricted(src, code) {
        if ((src == null) || (src == "") || (code == null)) {
            return false;
        }
        code = parseInt(code);
        if ((code == NaN) || (code < ResponseCode.NOT_ALLOWED_TO_WRITE.code)) {
            return false;
        }
        var restrictedIndx = code - ResponseCode.NOT_ALLOWED_TO_WRITE.code;
        if ((restrictedIndx < 0) || (src.length <= restrictedIndx)) {
            return false;
        }
        if (src.charAt(restrictedIndx) == '0') {
            return false;
        }

        return true;
    }


const UsersController = {
    /**
     * 회원 목록 페이지
     */
    indexNresponseJson(req, res) {
        console.log(`UsersController.indexNresponseJson] req.query: %j`, req.query);
        
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

        let ResResult = {};    

        if (keyword) {
            switch (fieldId) {
                case '1':
                case '0':
                default:
                    where = { nickname: { [Op.like]: '%' + keyword + '%' } };
                    break;
            }
        }

        if (orderby) {
            order = [ [ orderby, (sort || 'DESC').toUpperCase() ] ];
        } else {
            order = [ [ 'id', 'DESC' ] ];
        }

        Users
            .findAndCountAll({
                where: where,
                order: order,
                offset: (page - 1) * count,
                limit: count,
            })
            .then(Users => {
                var result = JSON.parse(JSON.stringify(Users));

                result['pagination'] = new Pagination(req, result.count),
                result['page']=page,
                //res.jsonp({...ResponseCode.OK, result: result}); 

                ResResult = result;

                //유저목록 ID 추출
                let authorsArr = []
                    , schoolNameObj = {};

                for (i in ResResult.rows) {
                    authorsArr.push(ResResult.rows[i].id)
                }

                //유저목록 중복 ID 제거
                authorsArr = Array.from(new Set(authorsArr));
                console.log(authorsArr);

                UserSchool
                    .findAll({
                        where: {
                            user_id : authorsArr
                        },
                        raw: true,
                        include: [ School ]
                    })
                    .then( schoolInfo=>{
                        for(i in schoolInfo){
                            schoolNameObj[schoolInfo[i].user_id] = schoolInfo[i]["School.name"];
                        }
                        //학교 이름 정보 넣어 주기
                        for(i in ResResult.rows){
                            ResResult.rows[i].schoolname = schoolNameObj[ResResult.rows[i].id] ;
                        }                        
                        
                        res.jsonp({...ResponseCode.OK, result: ResResult});
                    })
                    .catch(error=>{ console.log(`CATCH::: %j`,error); res.jsonp(ResponseCode.SQLERROR) });

                
            });
    },
        

    /**
     * 회원 상세 및 편집
     */
    infoNresponseJson(req, res) {
        console.log(`[UsersController.infoNresponseJson] serve a Users info: ${req.params.id}.`);

        let ResResult={};
        
        Users
            .findByPk(req.params.id,{raw:true})
            .then(UserInfo => {
                //console.log(UserInfo);

                ResResult.UserInfo = UserInfo;
                var restrictedResult = {};
                restrictedResult[ResponseCode.NOT_ALLOWED_TO_WRITE.code] = _isRestricted(UserInfo.restricted, ResponseCode.NOT_ALLOWED_TO_WRITE.code);
                restrictedResult[ResponseCode.NOT_ALLOWED_TO_UPDATE.code] = _isRestricted(UserInfo.restricted, ResponseCode.NOT_ALLOWED_TO_UPDATE.code);
                restrictedResult[ResponseCode.NOT_ALLOWED_TO_DELETE.code] = _isRestricted(UserInfo.restricted, ResponseCode.NOT_ALLOWED_TO_DELETE.code);
                ResResult.UserInfo["restricted"] = restrictedResult;

                //학교 이름 가져오기
                return UserSchool
                    .findAll({
                        where: {
                            user_id : req.params.id
                        },
                        raw: true,
                        include: [ School ]
                    })
                
            })
            .then( schoolInfo=>{
                    if(!schoolInfo){
                        ResResult.UserInfo.schoolname = '';
                    } else {
                        let schoolNameObj = {};
                        for(i in schoolInfo){
                            //schoolNameObj[schoolInfo[i].user_id] = schoolInfo[i]["School.name"];
                            ResResult.UserInfo.schoolname = schoolInfo[i]["School.name"] ; 
                            ResResult.UserInfo.schoolId = schoolInfo[i]["School.id"] ; 
                        }
                        //학교 이름 정보 넣어 주기
                        //console.log(`%j`, schoolNameObj);
                        //ResResult.UserInfo.schoolname = schoolNameObj[ResResult.UserInfo.id] ;                              
                    }

                    //클랜정보 가져오기
                    return ClanMember
                        .findOne({
                            where: { 
                                user_id: req.params.id 
                            },
                            raw: true,
                            include: [ Clan ]
                        });
            })
            .then( ClanInfo=>{

                    if(!ClanInfo) {
                        ResResult.UserInfo.clanname = '';
                    } else {
                        ResResult.UserInfo.clanname = ClanInfo["Clan.name"];
                    }

                    //친구목록 가져오기 
                    return FriendShip
                    .findAll({
                        where: {
                            user_id: req.params.id
                        },
                        raw: true
                    });
            })
            .then( friendList=>{
                if(!friendList) {
                    ResResult.FriendList = [];
                    ResResult.FriendCount = 0;
                    res.jsonp({...ResponseCode.OK, result: ResResult});
                } else {
                    ResResult.FriendList = friendList;
                    ResResult.FriendCount = friendList.length;
                }

                let frindids = [];

                for (i in friendList) {
                    frindids.push(friendList[i].friend_id)
                }

                //친구목록 중복 ID 제거
                frindids = Array.from(new Set(frindids));

                return Users
                .findAll({
                    where: {
                        id: frindids
                    }
                })
            })
            .then( friendNickNames => {
                if(!friendNickNames) {

                }else{

                    let friendNicknameObj = {};
                    for(i in friendNickNames){
                        friendNicknameObj[friendNickNames[i].id] = friendNickNames[i].nickname;
                    }

                    for(i in ResResult.FriendList){
                        ResResult.FriendList[i].nickname = friendNicknameObj[ResResult.FriendList[i].friend_id];
                    }
                }

                // 최근 접속을 추가

                models.sequelizes.LogDB.query(" select max(regit_date) as last_login_date from log_login where uuid = ? ", {
                    replacements: [req.params.id],
                    type: models.Sequelize.QueryTypes.SELECT,
                    raw:true
                })
                .then(rsrs=>{
                    ResResult.lastLoginDate = rsrs[0].last_login_date;
                    //결과응답
                    res.jsonp({...ResponseCode.OK, result: ResResult});
                })

                                
            })
            .catch(error => {
                res.jsonp({...ResponseCode.SQLERROR, error: error});
            });
    },


    /**
     * 회원 수정
     */
    updateNresponseJson(req, res) {
        console.log(`[UsersController.update] Update a Users id is ${req.params.id}: %j`, req.body);

        const
            fields = [ 'subject', 'content','is_private', 'restricted'],
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
                Users[name] = value;
            }
        }

        Users
            .update(Users, {
                where: {
                    id: req.params.id
//                    deleted_at: null
                }
            })
            .then(() => {
                console.log(`A Users has been modified: %j`, Users);

                res.jsonp(ResponseCode.OK);
            })
            .catch(error => {
                res.jsonp(ResponseCode.ERROR);
            });
    },

    deleteNresponseJson(req, res){
        console.log(`[UsersController.delete] delete a Users id is: %j`, req.body);
        const
            fields = [ 'id'],
            validator = new Validator([
                { name: 'id', required: true },
            ])

        result = validator.validate(req.body);
        if (result !== true) {
            return res.jsonp(ResponseCode.INVALID_PARAMETERS);
        }

        Users
            .destroy({
                where: {
                    id: req.body.id
                }
            })
            .then(()=>{
                res.jsonp(ResponseCode.OK);
            });

    }
};

module.exports = UsersController;