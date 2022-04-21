const
    Result = require('../classes/result.class'),
    Controller = require('./controller'),
    AuthController = require('./auth.controller'),
    redis = require('../../../src/redis'),
    models = require('../../../models'),
    User = models.User,
    Log_game_using = models.Log_game_using

const LogGameUsingController = {

    post(req, res) {

        let
            _os
        _browser
        _nickname = req.body.nickname
        _gamecode = req.body.gamecode
        _playtime = req.body.playtime
        _game_value = req.body.game_value
        _difficult_lev = req.body.difficult_lev
        _taja_check_count = req.body.taja_check_count
        _sentence_idx = req.body.sentence_idx

        console.log("게임 로그 닉네임 =========================" + req.body.nickname);

        User
            .findOne({
                where: {
                    nickname: _nickname
                }
            })
            .then(user => {
                if (!user) {
                    // throw Result.NO_MATCHING_USER_WITH_SESSION_ID

                    return Log_game_using.create({
                        uuid: 0,
                        nickname: user.nickname,
                        os: 1,
                        browser: 1,
                        game_type: _gamecode,
                        game_value: (_game_value) ? _game_value : 0,
                        difficult_lev: (_difficult_lev) ? _difficult_lev : 0,
                        taja_check_count: (_taja_check_count) ? _taja_check_count : 0,
                        sentence_idx: (_sentence_idx) ? _sentence_idx : 0,
                        play_time: (_play_time) ? _play_time : 0,
                        is_result: (_is_result) ? _is_login : 0,
                        is_login: (_is_login) ? _is_login : 0
                    })

                } else {

                    redis.getUserSessionRedis().get(user.nickname, (err, res) => {
                        if (err) {
                            throw Result.CANNOT_FIND_USER_DATA_FROM_REDIS_MEMORY
                        } else {
                            if (res <= 0) {
                                throw Result.CANNOT_FIND_USER_DATA_FROM_REDIS_MEMORY
                            }
                            _os = res.os_type,
                                _browser = res.bw_type
                        }
                    })

                    return Log_game_using.create({
                        uuid: user.id,
                        nickname: user.nickname,
                        os: _os,
                        browser: _browser,
                        game_type: _gamecode,
                        game_value: (_game_value) ? _game_value : 0,
                        difficult_lev: (_difficult_lev) ? _difficult_lev : 0,
                        taja_check_count: (_taja_check_count) ? _taja_check_count : 0,
                        sentence_idx: (_sentence_idx) ? _sentence_idx : 0,
                        play_time: (_play_time) ? _play_time : 0,
                        is_result: (_is_result) ? _is_login : 0,
                        is_login: (_is_login) ? _is_login : 0
                    })

                }


            })
            .then(() => {
                Controller.response(res, Result.OK)
            })
            .catch(error => {
                Controller.response(res, error)
            })

    }
}
module.exports = LogGameUsingController