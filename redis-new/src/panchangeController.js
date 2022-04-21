const credis = require('./../src/module/redis');
const res_code = require('./../config/res_code');
const { isEmpty, generateRoomNumber } = require('./../utils/global');
const serverConf = require('./../config/server.json')[process.env.NODE_ENV || 'development'];
const redis_config = require('./../config/redis.json')[process.env.NODE_ENV || 'development']['PANCHANGE_CHANNEL'];
const { removeRoomNo, setRoomDetailInfo,  
        getRoomDetail, getRedUserCount, getBlueUserCount, 
        addUserList, removeUserList, setUserDetailInfo, findUser, auto_enter } = require('./../src/module/panchangeModule');
const { findMaster, changeMasterSettingInRoom, changeClanB, changeClanA, deleteRoomMethod } = require('./panchange/panchangeMethod');
const { generateRoom, getRoomNumberList } = require('./module/panchangeModule');
const gameConf = require('./../config/game.json');
const async = require('async');

exports.resetRedis = function(req, res) {   
    console.log("=================== 판뒤집기 삭제 ================", req.body);
    const pan_room_list_redis = credis.getPanchangeChannel();
    pan_room_list_redis.flushdb((err, succeeded) => {
        if (err) {
            console.log("=================== 판뒤집기 삭제 오류 ================", err);   
            res.json({
                'ERR_CODE': res_code.PANCHANGE_DB_RESET_FAIL
            })
            return;
        }
        console.log("=================== 판뒤집기 성공 ================");   
        res.json({ 'ERR_CODE': res_code.SUCCESS });
    });
}

// 방 목록 가져오기
exports.getRoomList = function(req, res) {
    console.log("=================== 판뒤집기 방 리스트 가져오기 ================", req.body);
    const pan_room_list_redis = credis.getPanchangeChannel();
    let page = req.body.page;
    if(isEmpty(page) || page <= 0) {
        res.json({ 'ERR_CODE': res_code.INVALID_PARAM });
        return;
    }

    let _room_list = [];
    let _start_ix = (page - 1) * serverConf.page_length;
    let _end_ix = _start_ix + (serverConf.page_length - 1);

    pan_room_list_redis.zrevrange(redis_config.ROOM_LIST_KEY, 0, -1, (err1, res1) => {

        if(res1 == null || err1) {
            console.log("=================== 판뒤집기 방목록 가져오기 오류 ================", err1)
            res.json({ 'ERR_CODE': res_code.GET_ROOM_LIST_FAIL });
            return;
        }

        let length = res1.length;

        if(length == 0) {
            res.json({ 'ERR_CODE': res_code.SUCCESS, 'DATA': [] });
            return;
        }

        for(let i = 0; i < res1.length; i ++) {
            pan_room_list_redis.hgetall(redis_config.ROOM_DETAIL_KEY + '_' + res1[i], (err2, res2) => {
                if(err2) {
                    length -= 1;
                    removeRoomNo(res1[i], pan_room_list_redis);
                }        
                else {
                    if(res2 <= 0 || isEmpty(res2)) {
                        length -= 1;
                        removeRoomNo(res1[i], pan_room_list_redis);
                    }
                    else {
                        //룸번호,  룸 타이틀, 룸 호스트 이름
                        if(!isEmpty(res2.room_number) && !isEmpty(res2.room_title) && !isEmpty(res2.host_name)) {
                            let r_detail = {};
                            r_detail = {
                                'room_number': res2.room_number, //방번호 
                                'room_title': res2.room_title, //방이름
                                'host_name': res2.host_name, //
                                'play_time': res2.play_time,  //시간
                                'back_ground': res2.back_ground, //방 배경
                                'is_play': res2.is_play, //게임중 or 입장
                                'current_user_count': res2.current_user_count,
                                'user_max_count': res2.user_max_count,  //방인원
                                'clan_name_A': res2.clan_name_A, 
                                'clan_name_B': res2.clan_name_B,
                                'is_clan': res2.is_clan,  //자유대전 or 클랜대전
                                'is_lock': res2.is_lock, //속성
                                'ip': res2.ip
                            };
                            length -= 1;
                            _room_list.push(r_detail);
                        }
                        else {
                            length -= 1;
                            removeRoomNo(res1[i], pan_room_list_redis);
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

// 방 생성
exports.createRoom = function(req, res) {
    if( isEmpty(req.body.room_number) || isEmpty(req.body.host_name) || isEmpty(req.body.is_lock) || isEmpty(req.body.room_title)
    || isEmpty(req.body.user_max_count) || isEmpty(req.body.is_clan) || isEmpty(req.body.ip)
    || isEmpty(req.body.back_ground) || isEmpty(req.body.play_time) ) {
        res.json({ 'ERR_CODE': res_code.INVALID_PARAM });
        return;
    }   
    const pan_room_list_redis = credis.getPanchangeChannel();
    let _pwd = '';
    if( isEmpty(req.body.password) )
        _pwd = '';
    else
        _pwd = req.body.password;

    generateRoom(pan_room_list_redis, req.body.room_number, req.body.host_name, req.body.is_lock, req.body.room_title, req.body.user_max_count, req.body.is_clan, req.body.ip, req.body.back_ground, req.body.play_time, req.body.clan_name_A, req.body.clan_name_B, _pwd, (err) => {    
        console.log("방만들기 레스코드 =======" + err);
        res.json({
            'ERR_CODE': err
        });    
        return; 
    });
}

// 게임방 번호 생성
exports.getRoomNumber = function(req, res) {
    const pan_room_list_redis = credis.getPanchangeChannel();
// 방번호 목록 가져오기
    async.waterfall([
        function(callback) {
            pan_room_list_redis.zrevrange(redis_config.ROOM_LIST_KEY, 0, -1, (err, res1) => {
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
    })    
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * 게임 종료후 방삭제
 */
exports.deleteRoom = async function(req, res) {
    if( isEmpty(req.body.room_number) ) {
        res.json({ 'ERR_CODE': res_code.INVALID_PARAM });
        return;
    }       
    const pan_room_list_redis = credis.getPanchangeChannel();
    try {           
        await deleteRoomMethod(pan_room_list_redis, req.body.room_number);
        return res.json({ 'ERR_CODE': res_code.SUCCESS });
    }
    catch(err22) {
        return res.json({ 'ERR_CODE': err22 });
    }
}

exports.updateRoomPlaying = function(req, res) {
    if( isEmpty(req.body.room_number) || isEmpty(req.body.is_play)) {
        res.json({ 'ERR_CODE': res_code.INVALID_PARAM });
        return;
    }       
    const pan_room_list_redis = credis.getPanchangeChannel();
    let _room_detail_info = {};
    _room_detail_info.is_play = req.body.is_play;
    _room_detail_info.update_time = Math.floor(Date.now() / 1000);
    setRoomDetailInfo(pan_room_list_redis, req.body.room_number, _room_detail_info) 
    .then((ret_code) => {
        res.json({ 'ERR_CODE': ret_code });
    })
    .catch((err_code) => {
        res.json({ 'ERR_CODE': err_code });
    });
}

/**
 * COLOR
 * IS_PUBLIC
 * IS_FREE
 * PASSWORD
 * BACKGROUND
 * RUNNING_TIME
 * UPDATE
 * room_number
 * @param {*} req 
 * @param {*} res 
 */
exports.changeRoomOption = async function(req, res) {

    console.log("[[change room option]]============", req.body);

    if( isEmpty(req.body.room_number) 
    || isEmpty(req.body.IS_PUBLIC) 
    || isEmpty(req.body.IS_FREE) 
    || isEmpty(req.body.BACKGROUND)
    || isEmpty(req.body.RUNNING_TIME)) {
        res.json({ 'ERR_CODE': res_code.INVALID_PARAM });
        return;
    }
    const pan_room_list_redis = credis.getPanchangeChannel();
    try {
        let _master = await findMaster(pan_room_list_redis, req.body.room_number);
        let _room_info = await getRoomDetail(pan_room_list_redis, req.body.room_number);
        
        if(_master.COLOR != req.body.COLOR && _room_info.is_clan == 0) {
            if(req.body.COLOR == 'RED') {
                if( (await getRedUserCount(pan_room_list_redis, req.body.room_number)) >= (_room_info.user_max_count / 2) ) {
                    return res.json({'ERR_CODE': res_code.PAN_GAME_ROOM_FULL});
                }
            } else {
                if( (await getBlueUserCount(pan_room_list_redis, req.body.room_number)) >= (_room_info.user_max_count / 2) ) {
                    return res.json({'ERR_CODE': res_code.PAN_GAME_ROOM_FULL});
                }
            }
            // 방장 이동
            if(_master.COLOR == 'RED') {
                //RED에서 삭제, BLUE에 추가    
                await removeUserList(pan_room_list_redis, req.body.room_number, _master.SOCKET, 'RED');
                await addUserList(pan_room_list_redis, req.body.room_number, _master.SOCKET, 'BLUE', 1);
                await setUserDetailInfo(pan_room_list_redis, _master.SOCKET, { COLOR: 'BLUE' });
            } else {
                //BLUE에서 삭제, RED에 추가
                await removeUserList(pan_room_list_redis, req.body.room_number, _master.SOCKET, 'BLUE');
                await addUserList(pan_room_list_redis, req.body.room_number, _master.SOCKET, 'RED', 1);
                await setUserDetailInfo(pan_room_list_redis, _master.SOCKET, { COLOR: 'RED' });
            }
        }
        
        let _room_detail_info = {
            'is_lock': (req.body.IS_FREE == 1 ? 0 : 1),
            'is_clan': (req.body.IS_PUBLIC == 1 ? 0 : 1),
            'password': (req.body.IS_FREE == 0 ? req.body.PASSWORD : ''),
            'back_ground': req.body.BACKGROUND,
            'play_time': req.body.RUNNING_TIME,
            'update_time': Math.floor(Date.now() / 1000)
        };
        console.log("[[change room option]]============", _room_detail_info);
        await setRoomDetailInfo(pan_room_list_redis, req.body.room_number, _room_detail_info);
        return res.json({ 'ERR_CODE': res_code.SUCCESS });
    }
    catch(err2) {
        return res.json({ 'ERR_CODE': err2 });
    }
}

exports.searchRoomByNumber = function(req, res) {
    if( isEmpty(req.body.room_number) ) {
        res.json({ 'ERR_CODE': res_code.INVALID_PARAM });
        return;
    }
    const pan_room_list_redis = credis.getPanchangeChannel();
    pan_room_list_redis.hgetall(redis_config.ROOM_DETAIL_KEY + '_' + req.body.room_number, (err1, res1) => {
        if(err1) {
            res.json({ 'ERR_CODE': res_code.PANCHANGE_SEARCH_ROOM_NUM_REDIS });
            return;
        }
        if(res1 == null) {
            res.json({ 'ERR_CODE': res_code.PANCHANGE_SEARCH_ROOM_NUM_EMPTY });
            return;
        }

        res.json({
            'ERR_CODE': res_code.SUCCESS,
            'data': res1
        });
        return;
    });
}

exports.searchRoomByClan = function(req, res) {
    if( isEmpty(req.body.clan_name) ) {
        res.json({ 'ERR_CODE': res_code.INVALID_PARAM });
        return;
    }
    const pan_room_list_redis = credis.getPanchangeChannel();
    pan_room_list_redis.hgetall(redis_config.CLAN_NAME_KEY + '_' + req.body.clan_name, (err1, res1) => {
        if(err1) {
            res.json({ 'ERR_CODE': res_code.PANCHANGE_SEARCH_CLAN_ROOM_REDIS });
            return;
        }
        if(res1 == null) {
            res.json({ 'ERR_CODE': res_code.PANCHANGE_SEARCH_CLAN_ROOM_EMPTY });
            return;
        }
        pan_room_list_redis.hgetall(redis_config.ROOM_DETAIL_KEY + '_' + res1.room_number, (err2, res2) => {
            if(err2) {
                res.json({ 'ERR_CODE': res_code.PANCHANGE_SEARCH_CLAN_ROOM_EMPTY2 });
                return;
            }
            if(res2 == null) {
                res.json({ 'ERR_CODE': res_code.PANCHANGE_SEARCH_CLAN_ROOM_EMPTY2 });
                return;
            }
            res.json({
                'ERR_CODE': res_code.SUCCESS,
                'data': res2
            });
            return;
        });
    });
}

exports.searchRoomByNickname = function(req, res) {
    if( isEmpty(req.body.nick_name) ) {
        res.json({ 'ERR_CODE': res_code.INVALID_PARAM });
        return;
    }            
    const pan_room_list_redis = credis.getPanchangeChannel();
    pan_room_list_redis.hgetall(redis_config.ROOM_HOST_KEY + '_' + req.body.nick_name, (err1, res1) => {
        if(err1) {
            res.json({ 'ERR_CODE': res_code.PANCHANGE_SEARCH_NICK_NAME_REDIS1 });
            return;
        }
        if(res1 == null) {
            res.json({ 'ERR_CODE': res_code.PANCHANGE_SEARCH_NICK_NAME_REDIS1_RES });
            return;            
        }

        pan_room_list_redis.hgetall(redis_config.ROOM_DETAIL_KEY + '_' + res1.room_number, (err2, res2) => {
            if(err2) {
                console.log("닉네임 검색 오류 ====", err2);     
                res.json({ 'ERR_CODE': res_code.PANCHANGE_SEARCH_NICK_NAME_REDIS2 });
                return;
            }
            if(res2 == null) {
                res.json({ 'ERR_CODE': res_code.PANCHANGE_SEARCH_NICK_NAME_REDIS2_RES });
                return;
            }
            res.json({
                'ERR_CODE': res_code.SUCCESS,
                'data': res2
            });
            return;
        });
    });
}

exports.changeGameRoomUserCount = async function(req, res) {
    if( isEmpty(req.body.room_number) || isEmpty(req.body.user_count) ) {
        res.json({ 'ERR_CODE': res_code.INVALID_PARAM });
        return;
    }
    const pan_room_list_redis = credis.getPanchangeChannel();
    try {
        await setRoomDetailInfo(pan_room_list_redis, req.body.room_number, {
            'current_user_count': req.body.user_count
        });
        return res.json({ 'ERR_CODE': res_code.SUCCESS });
    }
    catch(err22) {
        return res.json({ 'ERR_CODE': err22 });
    }
}

exports.changeRoomMaster = function(req, res) {
    if( isEmpty(req.body.room_number) || isEmpty(req.body.socket_id)) {
        res.json({ 'ERR_CODE': res_code.INVALID_PARAM });
        return;
    }
    const pan_room_list_redis = credis.getPanchangeChannel();
    findUser(pan_room_list_redis, req.body.room_number, req.body.socket_id, 3, async (_res_code, target, _is_exist) => {
        if(_res_code != res_code.SUCCESS) {
            res.json({ 'ERR_CODE': _res_code });
            return;
        }
        if(!_is_exist) {
            res.json({ 'ERR_CODE': res_code.PAN_GAME_USER_IS_NOT_EXIST });
            return;
        }
        let master = await findMaster(pan_room_list_redis, req.body.room_number);
        try {
            //old set master false
            await setUserDetailInfo(pan_room_list_redis, master.SOCKET, {MASTER: 0});
            //new set master true
            await setUserDetailInfo(pan_room_list_redis, target.SOCKET, {MASTER: 1});
            //copy user to the first index
            await removeUserList(pan_room_list_redis, req.body.room_number, target.SOCKET, target.COLOR);
            await addUserList(pan_room_list_redis, req.body.room_number, target.SOCKET, target.COLOR, 1);
            await changeMasterSettingInRoom(pan_room_list_redis, req.body.room_number, master.NICKNAME, target.NICKNAME);
            return res.json({ 'ERR_CODE': res_code.SUCCESS });
        }
        catch(err22) {
            return res.json({ 'ERR_CODE': err22 });
        }
    });
}


//체크 필요
exports.changeClanB = async function(req, res) {
    if( isEmpty(req.body.room_number) /* || isEmpty(req.body.clan_name_B)*/ ) {
        res.json({ 'ERR_CODE': res_code.INVALID_PARAM });
        return;
    }    
    const pan_room_list_redis = credis.getPanchangeChannel();
    
    try {
        await changeClanB(pan_room_list_redis, req.body.room_number, req.body.clan_name_B);
        return res.json({ 'ERR_CODE': res_code.SUCCESS });
    }
    catch(err22) {
        return res.json({ 'ERR_CODE': err22 });
    }
}

//체크 필요
exports.changeRoomClan = async function(req, res) {
    if( isEmpty(req.body.room_number) || isEmpty(req.body.old_clan_name) || isEmpty(req.body.new_clan_name) ) {
        res.json({ 'ERR_CODE': res_code.INVALID_PARAM });
        return;
    }
    const pan_room_list_redis = credis.getPanchangeChannel();
    try {
        await changeClanA(pan_room_list_redis, req.body.room_number, req.body.old_clan_name, req.body.new_clan_name);
        return res.json({ 'ERR_CODE': res_code.SUCCESS });
    }
    catch(err22) {
        return res.json({ 'ERR_CODE': err22 });
    }
}

exports.getMaster = async function(req, res) {
    if( isEmpty(req.body.room_number) ) {
        res.json({ 'ERR_CODE': res_code.INVALID_PARAM });
        return;
    }   
    const pan_room_list_redis = credis.getPanchangeChannel();
    try {
        let _master = await findMaster(pan_room_list_redis, req.body.room_number);
        return res.json({ 'ERR_CODE': res_code.SUCCESS, 'MASTER': _master });
    }
    catch(err22) {
        return res.json({ 'ERR_CODE': err22 });
    }
}


exports.autoEnter = function(req, res) {
    const pan_room_list_redis = credis.getPanchangeChannel();
    auto_enter(pan_room_list_redis, (err, data) => {
        return res.json({ 'ERR_CODE': err, 'DATA': data });
    });
}

exports.checkRoomListForRemove = async function(req, res) {
    const pan_room_list_redis = credis.getPanchangeChannel();
    try {
        let room_list = await getRoomNumberList(pan_room_list_redis);
        let _delete_room_method_flag = 0;
        let _room_number = '';
        for(let i = 0; i < room_list.length; i ++) {
            let _room_info = await getRoomDetail(pan_room_list_redis, room_list[i]);
            if(parseInt(_room_info.current_user_count) == 0) {
                 //인원수가 0명일 경우 join_user가 호출되기 전의 경우는 if문에서 빠져야 함
                 let during_time =  Math.floor(Date.now() / 1000) - _room_info.update_time;
                 if(during_time >= gameConf.CREATE_ROOM_BEFORE_JOIN_DELAY_INTERVAL) {
                    await deleteRoomMethod(pan_room_list_redis, room_list[i]); 
                    _delete_room_method_flag = 1;
                 }
            }
            else if(_room_info.status == 2) {
                // 플레이 상태인 경우 게임 플레이시간이 play_time을 벗어난 경우
                let during_time = Math.floor(Date.now() / 1000) - _room_info.update_time;        
                if(during_time >= parseInt(_room_info.play_time) * 60 + gameConf.EXCEED_PLAY_TIME) {
                    await deleteRoomMethod(pan_room_list_redis, room_list[i]);
                    _delete_room_method_flag = 1;
                }
            }
            else if(_room_info.status == 0) {
                let during_time = Math.floor(Date.now() / 1000) - _room_info.update_time;
                if(during_time >= parseInt(gameConf.NO_ACTION_TIME) * 60) {
                    await deleteRoomMethod(pan_room_list_redis, room_list[i]);
                    _delete_room_method_flag = 1;
                    _room_number = room_list[i];
                }
            }
        }
        
        return res.json({ 'ERR_CODE' : res_code.SUCCESS, 'ROOM_LIST_CHANGE': _delete_room_method_flag, 'ROOM_NUMBER': _room_number });
    }    
    catch(err22) {
        return res.json({ 'ERR_CODE' : err22 });
    }
}