const
    useragent = require('useragent'),
    NetfficeApi = require('../classes/netffice-api.class'),
    Result = require('../classes/result.class'),
    redis = require('../../../src/redis'),
    Controller = require('./controller'),
    AuthController = require('./auth.controller'),
    models = require('../../../models'),
    User = models.User

const LoginController = {
    login(req, res) {
        let os;
        let browser;

        const
            NetfficeSetting = req.app.settings.webConfig.netffice,
            token = req.query.token,
            sessionId = AuthController.getSessionId(req),
            userAgent = useragent.parse(req.headers['user-agent']),
            log = {
                UUID: 0,
                Nickname: '',
                LogIdx: 10001,
                Msg0: sessionId,
                Msg1: userAgent.family,
                Msg2: userAgent.source,
                Msg3: token
            }

        if (!sessionId) {
            console.log("세션아이디 가 문제이다 ============="+sessionId);
            return Controller.response(res, Result.SESSION_ID_IS_REQUIRED, log)
        }

        console.log(`[LoginController.login()] Session ID: ${sessionId}`)

        const netfficeApi = new NetfficeApi(sessionId, NetfficeSetting)

        netfficeApi.getUserInfoUri((response, data) => {
            const validationResult = netfficeApi.validateResponse(response, data)

            if (validationResult.code !== Result.OK.code) {
                Controller.response(res, {
                    ...Result.NETFFICE_NETWORK_ERROR,
                    result: validationResult
                }, log)
                return
            }

            /**
             * Todo: data.user_state === 'ACTIVE' 체크
             */

            const netfficeUser = data.data

            User
                .findByPk(netfficeUser.user_id)
                .then(user => {
                    log.UUID = netfficeUser.user_id

                    if (!user) {
                        
                       
                        console.log("유저등록합니다=============================");
                        return User.create({
                            id: netfficeUser.user_id,
                            session_id: sessionId,
                            language: netfficeUser.user_language,
                            timezone: netfficeUser.user_timezone
                        })
                        .then(user => {
                           
                            if(netfficeUser.user_id != undefined || netfficeUser.user_id != null){
                                console.log("회원가입 =========================="+ netfficeUser.user_id);
                                Controller.account_regit_log(netfficeUser.user_id)
                            }
                           
   
                            throw Controller.response(res, {
                                ...Result.OK,
                                user: {
                                    nickname: null,
                                    language: user.user_language,
                                    timezone: user.user_timezone
                                },
                                token: token
                            }, log)
                        })
                        
                    } else {

                         // 1이면 탈퇴자 이다.
                        if(user.secession === 1){
                            throw Controller.response(res, {
                                ...Result.DELETED_USER,
                                user: Controller.getPublicUser(user),
                                token: token
                            })
                        }

                        log.NickName = user.nickname

                        user.session_id = sessionId
                        user.language = netfficeUser.user_language
                        user.timezone = netfficeUser.user_timezone
 
                    
            
                        switch(log.Msg1){
                            case 'Chrome':
                                {
                                    os = 1;
                                    browser = 1;
                                }
                                break;
                            case 'Chrome Mobile':
                                {
                                    os = 2;
                                    browser = 1;
                                }
                                break;
                            case 'IE':
                                {
                                    os = 1;
                                    browser = 2;
                                }
                                break;
                            case 'IE Mobile':
                                {
                                    os = 2;
                                    browser = 2;
                                }
                                break;
                            case 'Android':
                                {
                                    os = 2;
                                    browser = 0;
                                }
                                break;
                            case 'IOS':
                                {
                                    os = 3;
                                    browser = 0;
                                }
                                break;
                            case 'Safari':
                                {
                                    os = 1;
                                    browser = 5;
                                }
                                break;
                            case 'Safari Mobile':
                                {
                                    os = 3;
                                    browser = 5;
                                }
                                break;
                            case 'Firefox':
                                {
                                    os = 1;
                                    browser = 3;
                                }
                                break;
                            default:
                                {
                                    os = 0;
                                    browser = 0;
                                }
                        }
                        return user.save()
                    }
                    
                })
                .then(user => {

                    if(user.secession === 0){
                        if (process.env.NODE_ENV === 'test') {
                            Controller.response(res, {
                                ...Result.OK,
                                user: Controller.getPublicUser(user),
                                token: token
                            }, log)
                        } else {
    
                         
                            redis.getUserSessionRedis().hmset(user.nickname, {
                                session_id: user.session_id,
                                uuid: user.id,
                                os_type : os,
                                bw_type : browser
                                                   
                            }, (error, response) => {
                                if (error || response !== 'OK') {
                                    throw Controller.response(res, {
                                        ...Result.CANNOT_WRITE_USER_DATA_TO_REDIS_MEMORY,
                                        error: error,
                                        response: response,
                                        token: token
                                    }, log)
                                }
    
    
                                Controller.response(res, {
                                    ...Result.OK,
                                    user: Controller.getPublicUser(user),
                                    token: token
                                }, log)
    
                            })
                        }
                    }
                 
                })
                .catch(error => {
                  //  Controller.response(res, error, log)
                })
        }, error => {
            console.log(`[LoginController.login().netfficeApi] Result: ${JSON.stringify(error)}`)
          
            Controller.response(res, {
                ...Result.NETFFICE_NETWORK_ERROR,
                error: error,
                token: token
            }, log)
        })
    } // End login()
}

module.exports = LoginController