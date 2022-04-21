const
    Result = require('../classes/result.class'),
    Controller = require('./controller'),
    AuthController = require('./auth.controller'),
    models = require('../../../models'),
    User = models.User,
    LogAdvertis = models.Log_advertisement

    const LogAdvertisController = {
        post(req, res){
            const sessionId = AuthController.getSessionId(req)

            console.log(`[LogAdvertisController.create()] Session ID===========================================: ${sessionId}`)

            if(!sessionId){
                return Controller.response(res, Result.SESSION_ID_IS_REQUIRED)
            }

         
            const 
                advertis_id = req.body.id,
                advertis_type =  req.body.advertis_type
                check_type =  req.body.check_type
            
                User
                    .findOne({
                        where:{
                            session_id: sessionId
                        }
                    })
                    .then(user => {
                        if(!user){
                            throw Result.NO_MATCHING_USER_WITH_SESSION_ID
                        }

                        return LogAdvertis.create({
                            id : advertis_id,  //광고전용 내부 IDX
                            uuid : user.id,
                            nickname : user.nickname,
                            adversting_type : advertis_type,  //우리 내부 광고 디파인 넘버 정보
                            check_type : check_type
                        })
                    })
                    .then(() => {
                        Controller.response(res, Result.OK)
                    })
                    .catch(error => {
                        Controller.response(res, error)
                    })
        }


    }

    module.exports = LogAdvertisController