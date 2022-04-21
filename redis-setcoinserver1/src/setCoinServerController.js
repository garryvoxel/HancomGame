const async = require('async');
const credis = require('./module/redis');
const res_code = require('../config/res_code');
const redis_config = require('../config/redis.json')[process.env.NODE_ENV || 'development']['REDIS_KEY'];
const { isEmpty, generateRoomNumber, getRandomIntInclusive } = require('../utils/global');
const { removeRoomNo, setUserScore, getRoomDetail, addUserList, getSessionIdByIdx, 
    getUserDetailInfo, setRoomDetailInfo, setUserDetailInfo, getUserSessionListInRoom,
    setHashValue, updateScore, getUserScore, getAvailableRoomNumberList, addDataToArray, getListFromArray, getRoomNumberList } = require('./module/setCoinModule');
const { getOtherUser, userReset, deleteRoomMethod } = require('./module/setCoinMethod');
const gameConf = require('./../config/game.json');
const TIME = require('./../utils/time');

exports.resetRedis = function(req, res) {
    console.log("=================== 동전쌓기 삭제 ================", req.body);
    const setcoinserver1_redis = credis.getSetcoinRoomChannel(req.body.server_idx);
    setcoinserver1_redis.flushdb((err, succeeded) => {
        if (err) {
            console.log("=================== 동전쌓기 삭제 오류 ================", err);   
            res.json({
                'ERR_CODE': res_code.SETCOIN_DB_RESET_FAIL
            })
            return;
        }
        console.log("=================== 동전쌓기 성공 ================");   
        res.json({ 'ERR_CODE': res_code.SUCCESS });
    });
}
/**
 * 게임방 번호 생성
 * @param {*} req 
 * @param {*} res 
 */
exports.getRoomNumber = function(req, res) {
    const setcoinserver1_redis = credis.getSetcoinRoomChannel(req.body.server_idx);
    // 방번호 목록 가져오기
    async.waterfall([
        function(callback) {
            setcoinserver1_redis.zrevrange(redis_config.ROOM_LIST_KEY, 0, -1, (err, res1) => {
                if(err) {
                    console.log("방번호 목록 가져오기 오류 -- ", err);
                    callback(null, res_code.GET_ROOM_LIST_FAIL, null)
                    return;
                }
                if(res1 <= 0)
                    callback(null, res_code.SUCCESS, []);
                else
                    callback(null, res_code.SUCCESS, res1);
            });
        },
        function(_res_code, data, callback) {
            if(_res_code != res_code.SUCCESS) {
                callback(null, _res_code, null);
                return;
            }
            let _room_number = generateRoomNumber();
            while(data.indexOf(_room_number) >= 0) {
                _room_number = generateRoomNumber();
            }
            callback(null, res_code.SUCCESS, _room_number);
        }
    ], function(err, _res_code, _room_number) {
        console.log("방번호 가져오기 =======" + _room_number);
        res.json({
            'ERR_CODE': _res_code,
            'ROOM_NUMBER': _room_number
        });
    });
}

exports.createRoom = function(req, res) {
    if(isEmpty(req.body.room_number) || isEmpty(req.body.title) || isEmpty(req.body.is_lock) 
    || isEmpty(req.body.is_single) || isEmpty(req.body.back_ground)
    || isEmpty(req.body.play_time) || isEmpty(req.body.nick_name) || isEmpty(req.body.session_id)
    || isEmpty(req.body.ip) || isEmpty(req.body.server_idx) || isEmpty(req.body.host_name) || isEmpty(req.body.socket)) {
        res.json({ 'ERR_CODE': res_code.INVALID_PARAM });   
        return;   
    }

    const setcoinserver1_redis = credis.getSetcoinRoomChannel(req.body.server_idx);
    async.waterfall([
        function(callback) {
            console.log("=========동전쌓기 방생성=========");
            let _create_room_time_stamp = Math.floor(Date.now() / 1000);

            console.log("[redis_config.ROOM_LIST_KEY]", redis_config.ROOM_LIST_KEY);

            setcoinserver1_redis.zadd(redis_config.ROOM_LIST_KEY, _create_room_time_stamp, req.body.room_number, (err1, res1) => {
                if(err1) {
                    console.log("[동전쌓기 방생성 오류]", err1);
                    callback(null, res_code.CREATE_ROOM_FAIL);
                    return;
                }
                callback(null, res_code.SUCCESS);
            })
        },
        function(_res_code, callback) {
            if(_res_code != res_code.SUCCESS) {
                callback(null, _res_code);
                return;
            }
            // 륨 디테일 정보 저장
            let r_value = {
                'room_number': req.body.room_number,
                'host_session_id': req.body.session_id,
                'host_name': req.body.host_name,
                'is_lock': req.body.is_lock,
                'is_single': req.body.is_single,
                'room_title': req.body.title, 
                'ip': req.body.ip,
                'play_time': parseInt(req.body.play_time),
                'back_ground': parseInt(req.body.back_ground),
                'server_idx': req.body.server_idx,
                'state': 1,
                'host_socket': req.body.socket,
                'enter_finish_time': 0,
                'is_result': 0,
                'is_draw': 0,
                'game_over_time': 0,
                'is_wait': 1
            };
            r_value['create_time'] = r_value['update_time'] = Math.floor(Date.now() / 1000);
            if(!isEmpty(req.body.password))  
                r_value['password'] = req.body.password;

            setcoinserver1_redis.hmset(redis_config.ROOM_DETAIL_KEY + '_' + req.body.room_number, r_value, (err1, res1) => {
                if(err1) {
                    console.log("[동전쌓기 방생성 오류2]", err1);
                    callback(null, res_code.CREATE_ROOM_FAIL);
                    return;
                }
                if(res1 != 'OK') {
                    callback(null, res_code.CREATE_ROOM_FAIL);
                    return;
                }
                callback(null, res_code.SUCCESS);
            });         
        },
        function(_res_code, callback) {
            if(_res_code != res_code.SUCCESS) {
                callback(null, _res_code);
                return;
            }
            setcoinserver1_redis.rpush(redis_config.USER_LIST_KEY + '_' + req.body.room_number, req.body.session_id, (err1, res1) => {
                if(err1) {
                    callback(null, res_code.GAME_ROOM_USER_ADD_FAIL);
                    return;
                }
                if(res1 < 0) {
                    callback(null, res_code.GAME_ROOM_USER_ADD_FAIL);
                    return;
                }
                callback(null, res_code.SUCCESS);
            }); 
        },
        function(_res_code, callback) {
            if(_res_code != res_code.SUCCESS) {
                callback(null, _res_code);
                return;
            }
            setcoinserver1_redis.hmset(redis_config.USER_DETAIL_KEY + '_' + req.body.session_id, {room_number: req.body.room_number}, (err1, res1) => {
                if(err1) {
                    callback(null, res_code.CREATE_ROOM_FAIL);
                    return;
                }
                if(res1 != 'OK') {
                    callback(null, res_code.CREATE_ROOM_FAIL);
                    return;
                }
                callback(null, res_code.SUCCESS);
            });
        }
    ], async function(err, _res_code) {
        if(_res_code != res_code.SUCCESS) {
            res.json({
                'ERR_CODE': _res_code
            });    
            return;
        }
        try {
            await setUserScore(setcoinserver1_redis, redis_config.ROOM_SCORE_KEY + '_' + req.body.room_number, 'combo_attack3_offset');
            await setUserScore(setcoinserver1_redis, redis_config.ROOM_SCORE_KEY + '_' + req.body.room_number, 'combo_attack4_offset');
            await setUserScore(setcoinserver1_redis, redis_config.ROOM_SCORE_KEY + '_' + req.body.room_number, 'combo_attack5_offset');
            await setUserScore(setcoinserver1_redis, redis_config.ROOM_SCORE_KEY + '_' + req.body.room_number, 'combo_attack6_offset');
            await setUserScore(setcoinserver1_redis, redis_config.ROOM_SCORE_KEY + '_' + req.body.room_number, 'current_user_count', 1);
            await setUserScore(setcoinserver1_redis, redis_config.ROOM_SCORE_KEY + '_' + req.body.room_number, 'ready_user_count');
            await setUserScore(setcoinserver1_redis, redis_config.ROOM_SCORE_KEY + '_' + req.body.room_number, 'is_result');

            await setUserScore(setcoinserver1_redis, redis_config.ROOM_SCORE_KEY + '_' + req.body.room_number, 'win_calc_A');
            await setUserScore(setcoinserver1_redis, redis_config.ROOM_SCORE_KEY + '_' + req.body.room_number, 'win_calc_B');
            await setUserScore(setcoinserver1_redis, redis_config.ROOM_SCORE_KEY + '_' + req.body.room_number, 'lose_calc_A');
            await setUserScore(setcoinserver1_redis, redis_config.ROOM_SCORE_KEY + '_' + req.body.room_number, 'lose_calc_B');
            await setUserScore(setcoinserver1_redis, redis_config.ROOM_SCORE_KEY + '_' + req.body.room_number, 'draw_calc_A');
            await setUserScore(setcoinserver1_redis, redis_config.ROOM_SCORE_KEY + '_' + req.body.room_number, 'draw_calc_B');

            res.json({
                'ERR_CODE': _res_code
            });    
        }
        catch(err22) {
            res.json({
                'ERR_CODE': err22
            });    
        }
    }); 
}

exports.getRoomList = function(req, res) {
    const setcoinserver1_redis = credis.getSetcoinRoomChannel(req.body.server_idx);
    let _room_list = [];

    setcoinserver1_redis.zrevrange(redis_config.ROOM_LIST_KEY, 0, -1, (err1, res1) => {
        if(res1 == null || err1) {
            console.log("[[동전쌓기 방 리스트 가져오기 오류]]================", err1);
            res.json({ 'ERR_CODE': res_code.GET_ROOM_LIST_FAIL });
            return;
        }
        let length = res1.length;
        if(length == 0) {
            res.json({ 'ERR_CODE': res_code.SUCCESS, 'DATA': [] });
            return;
        }
        for(let i = 0; i < res1.length; i ++) {
            setcoinserver1_redis.hgetall(redis_config.ROOM_DETAIL_KEY + '_' + res1[i], (err2, res2) => {
                if(err2) {
                    length -= 1;
                    removeRoomNo(res1[i], setcoinserver1_redis);
                }        
                else {
                    if(res2 <= 0 || isEmpty(res2)) {
                        length -= 1;
                        removeRoomNo(res1[i], setcoinserver1_redis);
                    }
                    else {
                        //룸번호,  룸 타이틀, 룸 호스트 이름
                        if(!isEmpty(res2.room_number) && !isEmpty(res2.room_title) && !isEmpty(res2.host_name) && res2.is_single != '1' && res2.is_wait == 1) {
                            let r_detail = {};
                            r_detail = {
                                'room_number': res2.room_number,
                                'room_title': res2.room_title,
                                'host_name': res2.host_name,
                                'is_lock': res2.is_lock,
                                'is_single': (res2.is_single == '1' ? true : false),
                                'play_time': parseInt(res2.play_time),
                                'back_ground': parseInt(res2.back_ground),
                                'ip': res2.ip,
                                'password': ( isEmpty(res2.password) ? '' : res2.password ),
                                'server_idx': res2.server_idx
                            };
                            length -= 1;
                            _room_list.push(r_detail);
                        }
                        else {
                            length -= 1;
                            //removeRoomNo(res1[i], setcoinserver1_redis);
                        }
                    } 
                }
                if(length == 0) {
                    res.json({
                        'ERR_CODE': res_code.SUCCESS,
                        'DATA': _room_list 
                    });
                    return;
                }
            });
        } 
    });
}
/**
 * uuid, nickname, session_id, socket, character_type, is_user, win_count, lose_count, draw_count, ip
 * @param {*} req 
 * @param {*} res 
 */
exports.addUser = function(req, res) {
    if(isEmpty(req.body.server_idx) || isEmpty(req.body.uuid) || isEmpty(req.body.nickname) 
    || isEmpty(req.body.session_id) || isEmpty(req.body.socket) || isEmpty(req.body.character_type)
    || isEmpty(req.body.is_user) || isEmpty(req.body.win_count) || isEmpty(req.body.lose_count) || isEmpty(req.body.draw_count))  {
        res.json({ 'ERR_CODE': res_code.INVALID_PARAM });   
        return;   
    }

    const setcoinserver1_redis = credis.getSetcoinRoomChannel(req.body.server_idx);
    let _user_detail = {};
    _user_detail = {
        nickname: req.body.nickname,
        socket: req.body.socket,
        character_type: req.body.character_type,
        uuid: req.body.uuid,
        session_id: req.body.session_id,
        received_combo_attack: 0,
        received_combo_attack_type: 0,
        new_word_send_time: 0,
        restart: 0,
        is_user: (req.body.is_user ? 1 : 0),
        is_end: 0,
        is_disconnected: 0,
        is_win: 0,
        total_score: 0,
        point: 0,
        word_offset: 0,
        check_word: '',
        coin_tower_count: 0
    };
    
    if(!isEmpty(req.body.ip))
        _user_detail['ip'] = req.body.ip;
    
    setcoinserver1_redis.hmset(redis_config.USER_DETAIL_KEY + '_' + req.body.session_id, _user_detail, async (err1, res1) => {
        if(err1) {
            res.json({ 'ERR_CODE': res_code.SET_USER_DETAIL_ERROR });   
            return;   
        }
        if(res1 != 'OK') {
            res.json({ 'ERR_CODE': res_code.SET_USER_DETAIL_ERROR });   
            return;   
        }

        try {
            let _ret_code = 0;
    
            _ret_code = await setUserScore(setcoinserver1_redis, redis_config.USER_SCORE_KEY + '_' + req.body.session_id, 'score');
            if(_ret_code != res_code.SUCCESS) {
                res.json({ 'ERR_CODE': _ret_code });   
                return;
            }
            
            _ret_code = await setUserScore(setcoinserver1_redis, redis_config.USER_SCORE_KEY + '_' + req.body.session_id, 'win', parseInt(req.body.win_count));
            if(_ret_code != res_code.SUCCESS) {
                res.json({ 'ERR_CODE': _ret_code });   
                return;
            }
            
            _ret_code = await setUserScore(setcoinserver1_redis, redis_config.USER_SCORE_KEY + '_' + req.body.session_id, 'lose', parseInt(req.body.lose_count));
            if(_ret_code != res_code.SUCCESS) {
                res.json({ 'ERR_CODE': _ret_code });   
                return;
            }
            
            _ret_code = await setUserScore(setcoinserver1_redis, redis_config.USER_SCORE_KEY + '_' + req.body.session_id, 'draw', parseInt(req.body.draw_count));
            if(_ret_code != res_code.SUCCESS) {
                res.json({ 'ERR_CODE': _ret_code });   
                return;
            }

            //word_level_1_offset
            _ret_code = await setUserScore(setcoinserver1_redis, redis_config.USER_SCORE_KEY + '_' + req.body.session_id, 'word_level_1_offset');
            if(_ret_code != res_code.SUCCESS) {
                res.json({ 'ERR_CODE': _ret_code });   
                return;
            }
            //word_level_2_offset
            _ret_code = await setUserScore(setcoinserver1_redis, redis_config.USER_SCORE_KEY + '_' + req.body.session_id, 'word_level_2_offset');
            if(_ret_code != res_code.SUCCESS) {
                res.json({ 'ERR_CODE': _ret_code });   
                return;
            }
            //word_level_3_offset
            _ret_code = await setUserScore(setcoinserver1_redis, redis_config.USER_SCORE_KEY + '_' + req.body.session_id, 'word_level_3_offset');
            if(_ret_code != res_code.SUCCESS) {
                res.json({ 'ERR_CODE': _ret_code });   
                return;
            }
            //word_level_4_offset
            _ret_code = await setUserScore(setcoinserver1_redis, redis_config.USER_SCORE_KEY + '_' + req.body.session_id, 'word_level_4_offset');
            if(_ret_code != res_code.SUCCESS) {
                res.json({ 'ERR_CODE': _ret_code });   
                return;
            }
            //word_level_5_offset
            _ret_code = await setUserScore(setcoinserver1_redis, redis_config.USER_SCORE_KEY + '_' + req.body.session_id, 'word_level_5_offset');
            if(_ret_code != res_code.SUCCESS) {
                res.json({ 'ERR_CODE': _ret_code });   
                return;
            }
            //word_level_6_offset
            _ret_code = await setUserScore(setcoinserver1_redis, redis_config.USER_SCORE_KEY + '_' + req.body.session_id, 'word_level_6_offset');
            if(_ret_code != res_code.SUCCESS) {
                res.json({ 'ERR_CODE': _ret_code });   
                return;
            }
            //coin_count
            _ret_code = await setUserScore(setcoinserver1_redis, redis_config.USER_SCORE_KEY + '_' + req.body.session_id, 'coin_count');
            if(_ret_code != res_code.SUCCESS) {
                res.json({ 'ERR_CODE': _ret_code });   
                return;
            }
            //heart_count
            _ret_code = await setUserScore(setcoinserver1_redis, redis_config.USER_SCORE_KEY + '_' + req.body.session_id, 'heart_count');
            if(_ret_code != res_code.SUCCESS) {
                res.json({ 'ERR_CODE': _ret_code });   
                return;
            }

            await setHashValue(setcoinserver1_redis, redis_config.SESSION_SOCKET + '_' + req.body.socket, {session_id: req.body.session_id});

            await addDataToArray(setcoinserver1_redis, redis_config.MEMBER_LIST, req.body.session_id);
            
            res.json({ 'ERR_CODE': res_code.SUCCESS });   
            return;
        }
        catch(err22) {
            console.log("[[addUser======================]]", err22);
            res.json({ 'ERR_CODE': err22 });
            return;
        }
    });
}

exports.getRoomInfo = async function(req, res) {
    if(isEmpty(req.body.server_idx) || isEmpty(req.body.room_number))  {
        res.json({ 'ERR_CODE': res_code.INVALID_PARAM });   
        return;   
    }
    console.log("=========게임방 상태 정보 가져오기=========");   
    const setcoinserver1_redis = credis.getSetcoinRoomChannel(req.body.server_idx);   
    try {
        let _state = {};
        _state  = await getRoomDetail(setcoinserver1_redis, req.body.room_number);
        if(!(_state == null || _state == undefined))
            _state.current_user_count = await getUserScore(setcoinserver1_redis, redis_config.ROOM_SCORE_KEY + '_' + req.body.room_number, 'current_user_count');
        return res.json({ 'ERR_CODE': res_code.SUCCESS, 'DATA': _state });
    }
    catch(err22) {
        return res.json({ 'ERR_CODE': err22 });
    }
}

exports.getMaster = async function(req, res) {
    if(isEmpty(req.body.server_idx) || isEmpty(req.body.room_number))  {
        res.json({ 'ERR_CODE': res_code.INVALID_PARAM });   
        return;   
    }
    const setcoinserver1_redis = credis.getSetcoinRoomChannel(req.body.server_idx);   
    try {
        let master_session_id = await getSessionIdByIdx(setcoinserver1_redis, req.body.room_number, 0);
        let _user_detail = await getUserDetailInfo(setcoinserver1_redis, master_session_id);
        return res.json({ 'ERR_CODE': res_code.SUCCESS, 'DATA': _user_detail});
    }
    catch(err22) {
        return res.json({ 'ERR_CODE': err22 });
    }
}

exports.enterRoom = async function(req, res) {
    if(isEmpty(req.body.server_idx) || isEmpty(req.body.room_number) || isEmpty(req.body.session_id)) {
        res.json({ 'ERR_CODE': res_code.INVALID_PARAM });   
        return;
    }
    
    const setcoinserver1_redis = credis.getSetcoinRoomChannel(req.body.server_idx);   
    try {
        // set room number to user
        await addUserList(setcoinserver1_redis, req.body.room_number, req.body.session_id, 2);
        await setUserDetailInfo(setcoinserver1_redis, req.body.session_id, {room_number: req.body.room_number});
        // get current user count
        await updateScore(setcoinserver1_redis, redis_config.ROOM_SCORE_KEY + '_' + req.body.room_number, 'current_user_count', 1);

        // set room state enter finished  & enter finished time
        let _enter_finished_time = TIME.getTime();
        await setRoomDetailInfo(setcoinserver1_redis, req.body.room_number, { 
            state: 2, enter_finish_time: _enter_finished_time, is_wait: 0, update_time: Math.floor(Date.now() / 1000) });    
        return res.json({ 'ERR_CODE': res_code.SUCCESS });
    }   
    catch(err22) {
        return res.json({ 'ERR_CODE': err22 });
    }
}

exports.getUserInfoBySessionId = async function(req, res) {
    if(isEmpty(req.body.server_idx) || isEmpty(req.body.session_id) || isEmpty(req.body.room_number)) {
        res.json({ 'ERR_CODE': res_code.INVALID_PARAM });   
        return;
    }
    console.log("=========소켓으로 유저정보 가져오기=========");   
    const setcoinserver1_redis = credis.getSetcoinRoomChannel(req.body.server_idx);   
    try {
        let _users = await getUserSessionListInRoom(setcoinserver1_redis, req.body.room_number);
        if(_users.length <= 0)
            return res.json({ 'ERR_CODE': res_code.SUCCESS, 'DATA': null });
        for(let i = 0; i < _users.length; i ++) {
            if(_users[i] == req.body.session_id) {
                let _user = await getUserDetailInfo(setcoinserver1_redis, req.body.session_id);
                if(!(_user == null || _user == undefined)) {
                    _user.score = await getUserScore(setcoinserver1_redis, redis_config.USER_SCORE_KEY + '_' + req.body.session_id, 'score');
                    _user.win = await getUserScore(setcoinserver1_redis, redis_config.USER_SCORE_KEY + '_' + req.body.session_id, 'win');
                    _user.lose = await getUserScore(setcoinserver1_redis, redis_config.USER_SCORE_KEY + '_' + req.body.session_id, 'lose');
                    _user.draw = await getUserScore(setcoinserver1_redis, redis_config.USER_SCORE_KEY + '_' + req.body.session_id, 'draw');
                    _user.coin_count = await getUserScore(setcoinserver1_redis, redis_config.USER_SCORE_KEY + '_' + req.body.session_id, 'coin_count');
                    _user.heart_count = await getUserScore(setcoinserver1_redis, redis_config.USER_SCORE_KEY + '_' + req.body.session_id, 'heart_count');
                }
                return res.json({ 'ERR_CODE': res_code.SUCCESS, 'DATA': _user });
            }
        }

        return res.json({ 'ERR_CODE': res_code.SUCCESS, 'DATA': null });
    }   
    catch(err22) {
        return res.json({ 'ERR_CODE': err22 });
    }
}

exports.getUserDetailBySessionId = async function(req, res) {
    if(isEmpty(req.body.server_idx) || isEmpty(req.body.session_id)) {
        res.json({ 'ERR_CODE': res_code.INVALID_PARAM });   
        return;
    }
    const setcoinserver1_redis = credis.getSetcoinRoomChannel(req.body.server_idx);   
    try {
        let _user_info = await getUserDetailInfo(setcoinserver1_redis, req.body.session_id);
        return res.json({ 'ERR_CODE': res_code.SUCCESS, 'DATA': _user_info });
    }    
    catch(err22) {
        return res.json({ 'ERR_CODE': err22 });
    }
}

exports.changeRoomOption = async function(req, res) {
    if(isEmpty(req.body.room_number) || isEmpty(req.body.room_title) || isEmpty(req.body.is_lock)
    || isEmpty(req.body.play_time) || isEmpty(req.body.back_ground)
    || isEmpty(req.body.server_idx) || isEmpty(req.body.session_id)) {
        res.json({ 'ERR_CODE': res_code.INVALID_PARAM });   
        return;       
    }
    console.log("===============게임방 정보변경=============");
    const setcoinserver1_redis = credis.getSetcoinRoomChannel(req.body.server_idx);   
    let _room_change_info = {
        'room_title': req.body.room_title,
        'play_time': req.body.play_time,
        'back_ground': req.body.back_ground,
        'is_lock': req.body.is_lock,
        'update_time': Math.floor(Date.now() / 1000)
    };

    if(!isEmpty(req.body.password) && req.body.is_lock == '1')
        _room_change_info['password'] = req.body.password;
    try {
        let master_session_id = await getSessionIdByIdx(setcoinserver1_redis, req.body.room_number, 0);
        if(master_session_id != req.body.session_id) { 
            return res.json({ 'ERR_CODE': res_code.SUCCESS, 'HOST_CHECK': false });           
        }
        await setRoomDetailInfo(setcoinserver1_redis, req.body.room_number, _room_change_info);
        return res.json({ 'ERR_CODE': res_code.SUCCESS, 'HOST_CHECK': true });       
    }
    catch(err22) {
        return res.json({ 'ERR_CODE': err22 });       
    }
}

exports.userReset2 = async function(req, res) {
    if(isEmpty(req.body.session_id) || isEmpty(req.body.server_idx))        {
        res.json({ 'ERR_CODE': res_code.INVALID_PARAM });   
        return;       
    }
    
    const setcoinserver1_redis = credis.getSetcoinRoomChannel(req.body.server_idx);
    try {
        await userReset(setcoinserver1_redis, req.body.session_id);
        return res.json({ 'ERR_CODE': res_code.SUCCESS });
    }
    catch(err22) {
        return res.json({ 'ERR_CODE': err22 });
    }
}

exports.setReady = async function(req, res) {
    if(isEmpty(req.body.session_id) || isEmpty(req.body.server_idx) || isEmpty(req.body.ready))        {
        res.json({ 'ERR_CODE': res_code.INVALID_PARAM });   
        return;       
    }
    
    const setcoinserver1_redis = credis.getSetcoinRoomChannel(req.body.server_idx);
    try {
        await setUserDetailInfo(setcoinserver1_redis, req.body.session_id, {is_ready: (req.body.ready ? 1 : 0)})
        return res.json({ 'ERR_CODE': res_code.SUCCESS })
    }
    catch(err22) {
        return res.json({ 'ERR_CODE': err22 });       
    }
}

exports.isGameStartReady = async function(req, res) {
    if(isEmpty(req.body.server_idx) || isEmpty(req.body.room_number) || isEmpty(req.body.session_id)) {
        res.json({ 'ERR_CODE': res_code.INVALID_PARAM });   
        return;       
    }
    const setcoinserver1_redis = credis.getSetcoinRoomChannel(req.body.server_idx);
    try {  
        let _users = await getUserSessionListInRoom(setcoinserver1_redis, req.body.room_number);
        if(_users.length <= 1) {
            return res.json({ 'ERR_CODE': res_code.SUCCESS, 'IS_GAME_START_READY': false });
        }

        await userReset(setcoinserver1_redis, req.body.session_id);

        if( (await updateScore(setcoinserver1_redis, redis_config.ROOM_SCORE_KEY + '_' + req.body.room_number, 'ready_user_count', 1)) == 2 ) {
            return res.json({ 'ERR_CODE': res_code.SUCCESS, 'IS_GAME_START_READY': true });                     
        }
        else {
            return res.json({ 'ERR_CODE': res_code.SUCCESS, 'IS_GAME_START_READY': false });                     
        }
    }
    catch(err22) {
        return res.json({ 'ERR_CODE': err22 });
    }
}

exports.getOtherUserInRoom = async function(req, res) {
    if(isEmpty(req.body.server_idx) || isEmpty(req.body.room_number) || isEmpty(req.body.session_id)) {
        res.json({ 'ERR_CODE': res_code.INVALID_PARAM });   
        return;       
    }
    const setcoinserver1_redis = credis.getSetcoinRoomChannel(req.body.server_idx);
    try {
        let _ousr = await getOtherUser(setcoinserver1_redis, req.body.room_number, req.body.session_id);
        return res.json({ 'ERR_CODE': res_code.SUCCESS, 'DATA': _ousr });                            
    }
    catch(err22) {
        return res.json({ 'ERR_CODE': err22 });                            
    }
}

exports.setInfoRoom = async function(req, res) {
    if(isEmpty(req.body.server_idx) || isEmpty(req.body.room_number) || isEmpty(req.body.room_detail_info)) {
        res.json({ 'ERR_CODE': res_code.INVALID_PARAM });   
        return;              
    }
    const setcoinserver1_redis = credis.getSetcoinRoomChannel(req.body.server_idx);
    try {
        await setRoomDetailInfo(setcoinserver1_redis, req.body.room_number, {...req.body.room_detail_info, update_time: Math.floor(Date.now() / 1000)});
        return res.json({ 'ERR_CODE': res_code.SUCCESS });
    }
    catch(err22) {
        return res.json({ 'ERR_CODE': err22 });
    }
}

exports.setInfoUser = async function(req, res) {
    if(isEmpty(req.body.server_idx) || isEmpty(req.body.session_id) || isEmpty(req.body.user_detail_info)) {
        res.json({ 'ERR_CODE': res_code.INVALID_PARAM });   
        return;              
    }
    const setcoinserver1_redis = credis.getSetcoinRoomChannel(req.body.server_idx);
    try {
        await setUserDetailInfo(setcoinserver1_redis, req.body.session_id, req.body.user_detail_info);
        return res.json({ 'ERR_CODE': res_code.SUCCESS });
    }
    catch(err22) {
        return res.json({ 'ERR_CODE': err22 });
    }
}


exports.searchRoomByHostName = async function(req, res) {
    if(isEmpty(req.body.server_idx) || isEmpty(req.body.host_name)) {
        res.json({ 'ERR_CODE': res_code.INVALID_PARAM });   
        return;
    }    
    const setcoinserver1_redis = credis.getSetcoinRoomChannel(req.body.server_idx);
    try {
        let room_list = await getAvailableRoomNumberList(setcoinserver1_redis);

        for(let i = 0; i < room_list.length; i ++) {
            let _room_info = await getRoomDetail(setcoinserver1_redis, room_list[i]);
            if(_room_info.host_name == req.body.host_name) {
                return res.json({ 'ERR_CODE': res_code.SUCCESS, 'IS_EXIST': true, 'DATA': _room_info });        
            }
        }
        return res.json({ 'ERR_CODE': res_code.SUCCESS, 'IS_EXIST': false, 'DATA': null });
    }
    catch(err22) {
        return res.json({ 'ERR_CODE': err22 });
    }
}

exports.searchRoomByRoomNum = async function(req, res) {
    if(isEmpty(req.body.server_idx) || isEmpty(req.body.room_number)) {
        res.json({ 'ERR_CODE': res_code.INVALID_PARAM });   
        return;
    }    
    const setcoinserver1_redis = credis.getSetcoinRoomChannel(req.body.server_idx);
    try {
        let _room_info = await getRoomDetail(setcoinserver1_redis, req.body.room_number);
        console.log("searchRoomByRoomNum========", _room_info);
        return res.json({ 'ERR_CODE': res_code.SUCCESS, 'DATA': _room_info });       
    }   
    catch(err22) {
        return res.json({ 'ERR_CODE': err22 });       
    }
}

exports.autoEnter = async function(req, res) {
    if(isEmpty(req.body.server_idx)) {
        res.json({ 'ERR_CODE': res_code.INVALID_PARAM });   
        return;
    }
    const setcoinserver1_redis = credis.getSetcoinRoomChannel(req.body.server_idx);
    try {
        let _room_number_list = await getAvailableRoomNumberList(setcoinserver1_redis);
        if(_room_number_list.length == 0)        {
            return res.json({ 'ERR_CODE': res_code.SUCCESS, 'DATA': null });           
        }
        let _r_index = getRandomIntInclusive(0, _room_number_list.length - 1);
        let _room_info = await getRoomDetail(setcoinserver1_redis, _room_number_list[_r_index]);
        return res.json({ 'ERR_CODE': res_code.SUCCESS, 'DATA': _room_info });           
    }
    catch(err22) {
        return res.json({ 'ERR_CODE': err22 });       
    }
}

exports.duplicateUser = async function(req, res) {
    if(isEmpty(req.body.session_id) || isEmpty(req.body.server_idx)) {
        res.json({ 'ERR_CODE': res_code.INVALID_PARAM });   
        return;       
    }
    const setcoinserver1_redis = credis.getSetcoinRoomChannel(req.body.server_idx);
    try {   
        let user_list = await getListFromArray(setcoinserver1_redis, redis_config.MEMBER_LIST);

        console.log(user_list, req.body.session_id);

        if( user_list.indexOf(req.body.session_id) >= 0 ) {
            return res.json({ 'ERR_CODE': res_code.SUCCESS, 'IS_DUPLICATE': true });
        }
        return res.json({ 'ERR_CODE': res_code.SUCCESS, 'IS_DUPLICATE': false });
    }
    catch(err22) {
        return res.json({ 'ERR_CODE': err22 });       
    }
}

exports.checkRoomListForRemove = async function(req, res) {
    if(isEmpty(req.body.server_idx)) {
        res.json({ 'ERR_CODE': res_code.INVALID_PARAM });   
        return;
    }
    const setcoinserver1_redis = credis.getSetcoinRoomChannel(req.body.server_idx);
    try {
        let room_list = await getRoomNumberList(setcoinserver1_redis);
        let _delete_room_method_flag = 0;
        let _room_number = [];
        for(let i = 0; i < room_list.length; i ++) {
            let _room_info = await getRoomDetail(setcoinserver1_redis, room_list[i]);
            if(_room_info.is_single != '1') {
                let _current_user_count = await getUserScore(setcoinserver1_redis, redis_config.ROOM_SCORE_KEY + '_' + room_list[i], 'current_user_count');
                if(parseInt(_current_user_count) == 0) {
                    await deleteRoomMethod(setcoinserver1_redis, room_list[i]);
                    _delete_room_method_flag = 1;
                }   
                else if(parseInt(_room_info.state) >= 4 && parseInt(_room_info.state) < 7)     { // 플레이 상태인 경우
                    let during_time =  Math.floor(Date.now() / 1000) - Math.floor(_room_info.game_start_time / 1000);
                    if(during_time >= parseInt(_room_info.play_time) * 60 + gameConf.EXCEED_PLAY_TIME) {
                        await deleteRoomMethod(setcoinserver1_redis, room_list[i]);
                        _delete_room_method_flag = 1;
                    }
                }
                else {
                    let during_time = Math.floor(Date.now() / 1000) - _room_info.update_time;
                    if(during_time >= parseInt(gameConf.NO_ACTION_TIME) * 60) {
                        await deleteRoomMethod(setcoinserver1_redis, room_list[i]);
                        _delete_room_method_flag = 1;
                        _room_number.push(room_list[i]);
                    }
                }
            }
        }
        return res.json({ 'ERR_CODE' : res_code.SUCCESS, 'ROOM_LIST_CHANGE': _delete_room_method_flag, 'ROOM_NUMBER': _room_number });
    }
    catch(err22) {
        console.log(err22);
        return res.json({ 'ERR_CODE': err22 });
    }
}