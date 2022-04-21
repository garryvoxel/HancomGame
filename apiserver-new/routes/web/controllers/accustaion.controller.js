const
    Result = require('../classes/result.class'),
    Controller = require('./controller'),
    AuthController = require('./auth.controller'),
    models = require('../../../models'),
    Op = models.Sequelize.Op,
    User = models.User,
    Accusation = models.Accusation


    const AccustaionController = {
        post(req, res){

            const sessionId = AuthController.getSessionId(req)

            console.log(`[AccustaionController.create()] Session ID: ${sessionId}`)
    
            if (!sessionId) {
                return Controller.response(res, Result.SESSION_ID_IS_REQUIRED)
            }

            var 
            t_nick = "",//신고대상자
            f_nick = "",//신고자
            _from_uuid = 0; //신고자 uuid

                const
                    _accustaion_type = req.body.accustaion_type,
                    _type = req.body.type,
                    _target_id =  req.body.target_id,
                    _target_uuid =  req.body.target_uuid,
                    //_from_uuid = req.body.from_uuid,
                    _desc = req.body.desc

            /*     Accusation
                    .findAndCountAll({
                        where : {type : _type , target_id : _target_id , from_uuid : _from_uuid }
                    })
                    .then(result =>{
                        if (result.count > 0) {
                            throw {
                                ...Result.OK,
                                already_accustaion: 1
                            }
                        }
                    })
 */
                User
                    .findOne({
                        where : {
                            id : _target_uuid
                        }
                    })
                    .then(userinfo1 =>{
                        if(!userinfo1){
                            throw Result.CANNOT_FIND_USER_BY_UUID
                        }else{
                            t_nick = userinfo1.nickname;

                            User //요청자의 닉네임정보를 찾는다.
                            .findOne({
                                where : {
                                session_id : sessionId
                                }
                            })
                            .then(userinfo2 =>{
                                if(!userinfo2){
                                    throw Result.CANNOT_FIND_USER_BY_UUID
                                }else{

                                    f_nick = userinfo2.nickname;
                                    _from_uuid = userinfo2.id;
                                }
                                console.log("찾은 요청자 아이디와 닉네임 ==========================="+f_nick);
                                
                                Accusation
                                .create({
                                    accustaion_type : _accustaion_type,
                                    type: _type,
                                    target_id:_target_id,
                                    target_uuid: _target_uuid,
                                    target_nickname:t_nick,
                                    from_uuid: _from_uuid,
                                    from_nickname : f_nick,
                                    desc  : req.body.desc
                                  /*   is_complete : 0,
                                    complete_date : null,
                                    regit_date : NOW() */
                                })
                                .then(() =>{
                                    Controller.response(res, Result.OK)
                                })
                                .catch(error =>{
                                    Controller.response(res, error)
                                })
                            })
                        }
                    })
                
                
              
        }
    }

module.exports = AccustaionController
