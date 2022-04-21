const
    Result = require('../classes/result.class'),
    Controller = require('./controller'),
    AuthController = require('./auth.controller'),
    models = require('../../../models'),
    isGoodWord = require('../../../common/global_array');
    User = models.User,
    Clan = models.Clan,
    ClanMember = models.ClanMember,
    PointLog = models.PointLog,
    School = models.School,
    UserSchool = models.UserSchool;

    const debug = require('debug')('routes/web/controllers/user.controller.js')

function isAllowNickname(res, nickname) {

    if (!nickname) {
        nickname = 'aaaa';
    }

    // 비속어 체크
    var bad_word_check=isGoodWord.check(nickname);


    if(bad_word_check.isFound){
        var resultMsg=Result.NICKNAME_WITH_BAD_WORD;
        resultMsg.word=bad_word_check.word;
        return Controller.response(res, resultMsg);
    }

    //console.log("닉네임 길이 ----------------------------------------"+nickname.length);

    if (nickname.length < 2) {
        return Controller.response(res, Result.NICKNAME_IS_TOO_SHORT)
    }

    if (nickname.length > 8) {
        return Controller.response(res, Result.NICKNAME_IS_TOO_LONG)
    }

    if (/[^ㄱ-ㅎ|ㅏ-ㅣ|가-힣|0-9a-zA-Z]/.test(nickname)) {
        return Controller.response(res, Result.NICKNAME_HAS_DISALLOWED_CHARACTER)
    }

    return true;
}

const UserController = {
    me(req, res) {
        const sessionId = AuthController.getSessionId(req)

        debug('test')

        console.log(`[UserController.myBasicInfo()] Session ID: ${sessionId}`)

        if (!sessionId) {
            return Controller.response(res, Result.SESSION_ID_IS_REQUIRED)
        }
        console.log("-----------+++++++++++++++++그냥 ME 들어옴 ");
        const
            nickname = req.query.nickname,
            token = req.query.token
        let
            theUser,
            where = {};

        // 닉네임 확인
        if (isAllowNickname(res, nickname) !== true) {
            return;
        }

        if (nickname) {
            where = {
                nickname: nickname
            }
        } else {
            where = {
                session_id: sessionId
            }
        }

        debug(where)

        User
            .findOne({
                where: where
            })
            .then(user => {
                if (!user) {
                    throw {
                        ...Result.UNKNOWN_NICKNAME,
                        token: token
                    }
                }

                theUser = Controller.getPrivateUser(user)

                return UserSchool.findOne({
                    where: {
                        user_id: user.id
                    },
                    include: [
                        { model: School, as: 'school' }
                    ]
                })
            })
            .then(userSchool => {
                if (userSchool) {
                    theUser.mySchool = userSchool.toJSON()
                } else {
                    theUser.mySchool = null
                }

                Controller.response(res, {
                    ...Result.OK,
                    user: theUser,
                    token: token
                })
            })
            .catch(error => {
                Controller.response(res, error)
            })


    },

    updateMe(req, res) {
        const sessionId = AuthController.getSessionId(req)
        var uuid = 0;

        console.log("-----------+++++++++++++++++업데이트 ME 들어옴 ");

        console.log(`[UserController.updateMe()] Session ID: ${sessionId}`)

        if (!sessionId) {
            return Controller.response(res, Result.SESSION_ID_IS_REQUIRED)
        }

        const
            nickname = req.body.nickname ? req.body.nickname.trim() : null,
            avatar = req.body.avatar || 0,
            targetTypingSpeed = req.body.target_typing_speed,
            targetTypingAccuracy = req.body.target_typing_accuracy


        // 닉네임 확인
        if (isAllowNickname(res, nickname) !== true) {
            return;
        }


        let theUser

        User
            .findOne({
                where: {
                    session_id: sessionId
                }
            })
            .then(user => {
                if (!user) {
                    throw Result.NO_MATCHING_USER_WITH_SESSION_ID
                }

                // 클랜정보의 아바타를 바꾸기 위해 검색조건인 유저ID를 미리 받습니다.
                theUser = user.id;

                if(user.nickname ==null && nickname){
                    user.nickname = nickname;
                    //닉네임이 들어온 시점이 제대로된 가입시점이다. 그전단계에는 어카운트테이블에 닉네임없이 INSERT되어있다.
                    console.log("가입들어왓어유=============================================");
                    Controller.account_regit_log(user.id,nickname,0)
                }
                else if(nickname){
                    throw Result.NICKNAME_CANNOT_BE_CHANGED
                }

                if (avatar !== undefined && avatar !== null) {
                    user.avatar = avatar
                }

                if (targetTypingSpeed) {
                    user.target_typing_speed = targetTypingSpeed
                }

                if (targetTypingAccuracy) {
                    user.target_typing_accuracy = targetTypingAccuracy
                }
                Controller.update_avatar_clanmem(user.id, avatar)
                return user.save()


            })
            .then(user => {
                if (req.body.school_name || req.body.school_year || req.body.school_classroom) {
                    let theSchool

                    return models.sequelizes.WebDB.transaction(t => {
                        return School
                            .findOrCreate({
                                where: {
                                    name: req.body.school_name,
                                    address: req.body.school_address
                                },
                                defaults: {
                                    region: req.body.school_region,
                                    name: req.body.school_name,
                                    address: req.body.school_address,
                                    website: req.body.school_website
                                },
                                transaction: t
                            })
                            .spread(school => {
                                theSchool = school

                                return UserSchool
                                    .findOrCreate({
                                        where: {
                                            user_id: user.id
                                        },
                                        defaults: {
                                            school_id: school.id,
                                            year: req.body.school_year,
                                            classroom: req.body.school_classroom
                                        },
                                        transaction: t
                                    })
                            })
                            .spread((userSchool, created) => {
                                if (!created) {
                                    userSchool.school_id = theSchool.id
                                    userSchool.year = req.body.school_year
                                    userSchool.classroom = req.body.school_classroom
                                }

                                return userSchool.save({
                                    transaction: t
                                })
                            })
                            .then(() => {

                                Controller.update_account_school_info(user.id, theSchool.id, req.body.school_name )
                            })
                            .then(() => {

                                Controller.response(res, Result.OK)

                            })
                            .then(() => {

                                Controller.update_school_id_regit_log(user.id, theSchool.id)
                            })
                            .catch(error => {
                                throw error
                            })
                    })
                } else {
                    Controller.response(res, Result.OK)

                }
            })
            .catch(error => {
                console.log("updateMe error : " +error);
                Controller.response(res, Result.DATABASE_ERROR);
            })


    },

    clan(req, res) {
        const sessionId = AuthController.getSessionId(req)

        console.log(`[UserController.clan()] Session ID: ${sessionId}`)

        if (!sessionId) {
            return Controller.response(res, Result.session_id_IS_REQUIRED)
        }

        User
            .findOne({
                where: {
                    session_id: sessionId
                }
            })
            .then(user => {
                console.log(user.toJSON())

                ClanMember
                    .findByPk(user.id, {
                        include: [{ model: Clan, as: 'clan' }],
                    })
                    .then(member => {
                        if (member) {
                            return Controller.response(res, {
                                ...Result.OK,
                                clan: member.clan.toJSON()
                            })
                        } else {
                            return Controller.response(res, {
                                ...Result.OK,
                                clan: null
                            })
                        }
                    })
                    .catch(error => {
                        console.log(`[UserController.clan().member] Result: ${JSON.stringify(error.message)}`)

                        return Controller.response(res, {
                            ...Result.DATABASE_ERROR,
                            error: error.message
                        })
                    })
            })
            .catch(error => {
                console.log(`[UserController.clan().user] Result: ${JSON.stringify(error.message)}`)

                return Controller.response(res, {
                    ...Result.DATABASE_ERROR,
                    error: error.message
                })
            })
    },

    points(req, res) {
        const sessionId = AuthController.getSessionId(req)

        console.log(`[UserController.points()] Session ID: ${sessionId}`)

        if (!sessionId) {
            return Controller.response(res, Result.SESSION_ID_IS_REQUIRED)
        }

        User
            .findOne({
                where: {
                    session_id: sessionId
                }
            })
            .then(user => {
                console.log(user.toJSON())

                PointLog
                    .findAndCountAll({
                        where: {
                            user_id: user.id
                        },
                        order: [['id', 'DESC']]
                    })
                    .then(result => {
                        return Controller.response(res, {
                            ...Result.OK,
                            totalCount: result.count,
                            itemCount: result.rows.length,
                            items: result.rows
                        })
                    })
                    .catch(error => {
                        console.log(`[UserController.points().findPoints] Result: ${JSON.stringify(error.message)}`)

                        return Controller.response(res, {
                            ...Result.DATABASE_ERROR,
                            error: error.message
                        })
                    })
            })
            .catch(error => {
                console.log(`[UserController.points().findUser] Result: ${JSON.stringify(error.message)}`)

                return Controller.response(res, {
                    ...Result.DATABASE_ERROR,
                    error: error.message
                })
            })
    },

    restricted(req, res) {
        const sessionId = AuthController.getSessionId(req)

        console.log(`[UserController.restricted()] Session ID: ${sessionId}`)

        if (!sessionId) {
            return Controller.response(res, Result.SESSION_ID_IS_REQUIRED)
        }

        User
            .findOne({
                where: {
                    session_id: sessionId
                }
            })
            .then(user => {
                return Controller.response(res, {
                    ...Result.OK,
                    restricted: Controller.isRestricted(user.restricted, req.query.code)
                })
            })
            .catch(error => {
                Controller.response(res, Result.DATABASE_ERROR)
            })
    },

    myBasicInfo(req, res) {
        const sessionId = AuthController.getSessionId(req)

        console.log(`[UserController.myBasicInfo()] Session ID: ${sessionId}`)

        if (!sessionId) {
            return Controller.response(res, Result.SESSION_ID_IS_REQUIRED)
        }

        User
            .findOne({
                where: {
                    session_id: sessionId
                }
            })
            .then(user => {
                Controller.response(res, {
                    ...Result.OK,
                    user: Controller.getPublicUser(user)
                })
            })
            .catch(error => {
                Controller.response(res, error)
            })
    }
}

module.exports = UserController