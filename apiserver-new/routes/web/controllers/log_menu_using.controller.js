const
    Result = require('../classes/result.class'),
    Controller = require('./controller'),
    AuthController = require('./auth.controller'),
    redis = require('../../../src/redis'),
    models = require('../../../models'),
    User = models.User,
    LogMenu = models.Log_menu_using,
    utils = require('../../../common/util');

const LogMenuUsingController = {
    post(req, res) {
        const sessionId = AuthController.getSessionId(req)

        
        console.log(`[LogMenuUsingController.create()] Session ID===========================================: ${sessionId}`)

        const ip = utils.getRemoteAddr(req).replace(/\./g, '')

        console.log(`[LogMenuUsingController.create()] IP ===========================================: ${ip}`)

        
        if (!sessionId) {
            // 한컴에서 비로그인자 로그도 남겨달라함. 세션아이디 체크 안합니다. 2019-12-11
            // return Controller.response(res, Result.SESSION_ID_IS_REQUIRED)
        }
        
        
        const using_menu_type = req.body.menu_type
        // const ip = utils.getRemoteAddr(req)
        

        /*
        User
            .findOne({
                where: {
                    session_id: sessionId
                }
            })
            .then(user => {
                if (!user || sessionId === null) {
                    // 한컴에서 비로그인자 로그도 남겨달라함. 세션아이디 체크 안합니다. 2019-12-11
                    // throw Result.NO_MATCHING_USER_WITH_SESSION_ID
                    return LogMenu.create({
                        uuid: 0,
                        nickname: "GUEST_" + ip,
                        menu: using_menu_type
                    })
                } else {
                    return LogMenu.create({
                        uuid: user.id,
                        nickname: user.nickname,
                        menu: using_menu_type
                    })
                }
            })
            .then(() => {
                Controller.response(res, Result.OK)
            })
            .catch(error => {
                Controller.response(res, error)
            }) */
            Controller.response(res, Result.OK)
    }


}

module.exports = LogMenuUsingController