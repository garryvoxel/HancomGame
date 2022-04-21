const credis = require('./../src/module/redis');
const res_code = require('./../config/res_code');
const { isEmpty } = require('./../utils/global');
const { getRedUserCount, getBlueUserCount, addUserToRoom,
        setRoomDetailInfo, findUser, getSocketIdByIdx, setUserDetailInfo, getRoomDetail,
        getUserListInRoom, getTeamSocketIdList,
        getUserDetailInfo, removeUserList, removeUserDetail, removeUserSocketRoom,
        addUserList, getRoomNumberList, removeRedisInfo, setSocketIdByIdx, setSocketRoomInfo,
        removeSocketInRankList } = require('./../src/module/panchangeModule');
const {  changeMasterSettingInRoom, changeClanB, changeClanA } = require('./panchange/panchangeMethod');

const { getUserScore, addUserToRankList, setGameDataObject, getGameDataObject } = require('./../src/module/gameEngineModule');

const redis_config = require('./../config/redis.json')[process.env.NODE_ENV || 'development']['PANCHANGE_CHANNEL'];
const async = require('async');

// 게임방 입장
exports.joinUser = async function(req, res) {   
        //get room detail
        if(isEmpty(req.body.room_number) || isEmpty(req.body.PK) || isEmpty(req.body.NICKNAME) || isEmpty(req.body.AVATAR) || isEmpty(req.body.SESSION_ID)
        || isEmpty(req.body.socket_id)) {
            res.json({ 'ERR_CODE': res_code.INVALID_PARAM });   
            return;
        }
        const pan_room_list_redis = credis.getPanchangeChannel();
        try {
            let _room_detail_info = await getRoomDetail(pan_room_list_redis, req.body.room_number);

            if(parseInt(_room_detail_info.current_user_count) >= parseInt(_room_detail_info.user_max_count)) {
                res.json({ 'ERR_CODE': res_code.PAN_GAME_ROOM_FULL });  //방에 가득참
                return;
            }
            if(_room_detail_info.status != 0) {
                res.json({ 'ERR_CODE': res_code.PAN_GAME_ROOM_IS_PLAY });  //play상태
                return;
            }

            /**
                 * 비번이 틀림 방
            */   
           if(_room_detail_info.is_lock == 1 && _room_detail_info.password != req.body.PASSWORD)    {
               res.json({ 'ERR_CODE': res_code.PAN_GAME_NOTMATCHPWD });
               return;
           }
           if(_room_detail_info.is_clan == 1 && isEmpty(req.body.CLAN)) {
                res.json({ 'ERR_CODE': res_code.INVALID_PARAM });
                return;
           }

           /**
             * 클랜 , 추후 체크 요망2
             */
            if( _room_detail_info.is_clan == 1 && !(
                _room_detail_info.a_clan == req.body.CLAN ||
                _room_detail_info.a_clan == "" ||
                _room_detail_info.b_clan == req.body.CLAN ||
                _room_detail_info.b_clan == "")) {
                    res.json({ 'ERR_CODE': res_code.PAN_GAME_ROOM_NOTMYCLAN });
                    return;
            }

            let red_user_count = await getRedUserCount(pan_room_list_redis, req.body.room_number);
            let blue_user_count = await getBlueUserCount(pan_room_list_redis, req.body.room_number);

            let _user_detail_info = {
                'PK': req.body.PK,
                'NICKNAME': req.body.NICKNAME,
                'AVATAR': req.body.AVATAR,
                'SESSION_ID': req.body.SESSION_ID,
                'SOCKET': req.body.socket_id,
                'READY': 0,
                'LOADING': 0,
                'CLAN': req.body.CLAN,
                'SCORE': 0
            };

            if(_room_detail_info.host_name == req.body.NICKNAME)
                _user_detail_info['MASTER'] = 1;
            else
                _user_detail_info['MASTER'] = 0;

            if(_room_detail_info.is_clan == 0) { // 자유대전 게임방인 경우
                if(req.body.COLOR == 'RED') {
                    if(parseInt(red_user_count) < parseInt(_room_detail_info.user_max_count) / 2) {
                        await addUserToRoom(pan_room_list_redis, req.body.room_number, req.body.socket_id, _user_detail_info, 'RED');
                    }
                    else {
                        await addUserToRoom(pan_room_list_redis, req.body.room_number, req.body.socket_id, _user_detail_info, 'BLUE');
                    }
                } else if(req.body.COLOR == 'BLUE') {
                    if(parseInt(blue_user_count) < parseInt(_room_detail_info.user_max_count) / 2) {
                        await addUserToRoom(pan_room_list_redis, req.body.room_number, req.body.socket_id, _user_detail_info, 'BLUE');
                    }
                    else {
                        await addUserToRoom(pan_room_list_redis, req.body.room_number, req.body.socket_id, _user_detail_info, 'RED');
                    }
                } else {
                    if(parseInt(red_user_count) > parseInt(blue_user_count)) {
                        await addUserToRoom(pan_room_list_redis, req.body.room_number, req.body.socket_id, _user_detail_info, 'BLUE');
                    } else {
                        await addUserToRoom(pan_room_list_redis, req.body.room_number, req.body.socket_id, _user_detail_info, 'RED');
                    }
                }
            }
            else { // 클랜 방인 경우
                if(_room_detail_info.a_clan == req.body.CLAN && parseInt(red_user_count) < parseInt(_room_detail_info.user_max_count) / 2) {

                    await addUserToRoom(pan_room_list_redis, req.body.room_number, req.body.socket_id, _user_detail_info, 'RED');

                } else if(_room_detail_info.b_clan == req.body.CLAN && parseInt(blue_user_count) < parseInt(_room_detail_info.user_max_count) / 2) {

                    await addUserToRoom(pan_room_list_redis, req.body.room_number, req.body.socket_id, _user_detail_info, 'BLUE');

                } 
                /**
                 * 기존파일경로/파일명: HANCOM_TT_REPO/hancom_tt_module/panchangeserver/src/game.js
                 * 기존함수명: joinUser (418 ~ 426)
                 */
                else if(_room_detail_info.a_clan == "") {

                    await addUserToRoom(pan_room_list_redis, req.body.room_number, req.body.socket_id, _user_detail_info, 'RED');
                    await setRoomDetailInfo(pan_room_list_redis, req.body.room_number, {
                        'a_clan': req.body.CLAN
                    });
                    await changeClanB(pan_room_list_redis, req.body.room_number, req.body.CLAN);

                } else if(_room_detail_info.b_clan == "") {

                    await addUserToRoom(pan_room_list_redis, req.body.room_number, req.body.socket_id, _user_detail_info, 'BLUE');
                    await setRoomDetailInfo(pan_room_list_redis, req.body.room_number, {
                        'b_clan': req.body.CLAN
                    });
                    await changeClanB(pan_room_list_redis, req.body.room_number, req.body.CLAN);

                } else {
                    res.json({ 'ERR_CODE': res_code.PAN_GAME_ROOM_FULL })
                    return;
                }
            }
            
            //update member num
            await setRoomDetailInfo(pan_room_list_redis, req.body.room_number, {
                'current_user_count': parseInt(_room_detail_info.current_user_count) + 1
            });

            res.json({
                'ERR_CODE': res_code.SUCCESS,
                'MEMBERS': parseInt(_room_detail_info.current_user_count) + 1
            });
            return;
        }
        catch(err22) {
            res.json({ 'ERR_CODE': err22 });
            return;
        }
}

// nickname으로 socket 찾기
exports.findNickname = async function(req, res) {
    if(isEmpty(req.body.nickname)) {
        res.json({ 'ERR_CODE': res_code.INVALID_PARAM });   
        return;           
    }
    const pan_room_list_redis = credis.getPanchangeChannel();
    try {
        let _room_list = await getRoomNumberList(pan_room_list_redis);
        for(let i = 0; i < _room_list.length; i ++) {
            let _red_user_list = await getTeamSocketIdList(pan_room_list_redis, _room_list[i], 'RED');
            for(let j = 0; j < _red_user_list.length; j ++) {
                let _user_detail = await getUserDetailInfo(pan_room_list_redis, _red_user_list[j]);
                if(_user_detail.NICKNAME == req.body.nickname) {
                    return res.json({ 'ERR_CODE': res_code.SUCCESS, 'SOCKET': _user_detail.SOCKET });
                }
            }
            let _blue_user_list = await getTeamSocketIdList(pan_room_list_redis, _room_list[i], 'BLUE');
            for(let j = 0; j < _blue_user_list.length; j ++) {
                let _user_detail = await getUserDetailInfo(pan_room_list_redis, _blue_user_list[j]);
                if(_user_detail.NICKNAME == req.body.nickname) {
                    return res.json({ 'ERR_CODE': res_code.SUCCESS, 'SOCKET': _user_detail.SOCKET });
                }
            }
        }
        return res.json({ 'ERR_CODE': res_code.SUCCESS, 'SOCKET': null });
    }
    catch(err22) {
        return res.json({ 'ERR_CODE': err22 });
    }
}

// socketID 속한 방 찾기
exports.findRoomNum = function(req, res) {
    if(isEmpty(req.body.socket_id)) {
        res.json({ 'ERR_CODE': res_code.INVALID_PARAM });   
        return;           
    }
    const pan_room_list_redis = credis.getPanchangeChannel();

    pan_room_list_redis.hgetall(redis_config.SOCKET_ROOM_KEY + '_' + req.body.socket_id, (err1, res1) => {
        if(err1) {
            console.log("findNickname err ===", err1);
            res.json({ 'ERR_CODE': res_code.PAN_GAME_USER_DETAIL_FAIL, 'ROOM_NUMBER': null  });   
            return; 
        }
        if(res1 <= 0 || isEmpty(res1))
            return res.json({ 'ERR_CODE': res_code.SUCCESS, 'ROOM_NUMBER': null });
        
        return res.json({ 'ERR_CODE': res_code.SUCCESS, 'ROOM_NUMBER': 'room' + res1.room_number });
    });
}

//세션 duplicate 체크
exports.findUserBySession = function(req, res) {
    if(isEmpty(req.body.session_id)) {
        res.json({ 'ERR_CODE': res_code.INVALID_PARAM });   
        return;                   
    }
    const pan_room_list_redis = credis.getPanchangeChannel();
    async.waterfall([   
        function(callback1) { //게임방 목록 가져오기
            pan_room_list_redis.zrevrange(redis_config.ROOM_LIST_KEY, 0, -1, (err1, res1) => {
                if(res1 == null || err1)         {
                    console.log("=================== findUserBySession1 ================", err1);
                    callback1(null, res_code.GET_ROOM_LIST_FAIL, null);
                    return;
                }
                callback1(null, res_code.SUCCESS, res1);
            });
        },
        function(err1, _room_list, callback1) { //게임방 의 유저목록 가져오기 
            if(err1 != res_code.SUCCESS) {
                callback1(null, err1, false, _room_list);
                return;
            }
            let _passed_len_room_list = 0, _is_exist_in_red = false;
            if(_room_list.length == 0)  {
                callback1(null, res_code.SUCCESS, false, _room_list);
                return;
            }
            //red user인 경우
            for(let i = 0; i < _room_list.length; i ++) {
                pan_room_list_redis.lrange(redis_config.RED_USER_LIST_KEY + '_' + _room_list[i], 0, -1, (err2, res2) => {    
                    if(err2 || res2 == null) {
                        _passed_len_room_list ++;
                        if(_passed_len_room_list == _room_list.length) { //모든 방 에 대한 유저리스트 체크 완료
                            callback1(null, res_code.SUCCESS, _is_exist_in_red, _room_list);
                            return;
                        }
                    }
                    else {
                        let _passed_len_user_list = 0;
                        if(res2.length == 0) {
                            _passed_len_room_list ++;
                            if(_passed_len_room_list == _room_list.length) { //모든 방 에 대한 유저리스트 체크 완료
                                callback1(null, res_code.SUCCESS, _is_exist_in_red, _room_list);
                                return;
                            }
                        }
                        else {
                            for(let idx = 0; idx < res2.length; idx ++) {
                                pan_room_list_redis.hget(redis_config.USER_DETAIL_KEY + '_' + res2[idx], 'SESSION_ID', (err3, res3) => {
                                    if(err3) {
                                        _passed_len_user_list ++;
                                    }
                                    else 
                                        _passed_len_user_list ++;
                                    /**  */
                                    if(res3 == req.body.session_id) {
                                        _is_exist_in_red = true;
                                        callback1(null, res_code.SUCCESS, true, _room_list);
                                        return;
                                    }
    
                                    if(_passed_len_user_list == res2.length) { //한개 방 에 대한 유저리스트 체크 완료
                                        _passed_len_room_list ++;
                                    }
                                    if(_passed_len_room_list == _room_list.length) { //모든 방 에 대한 유저리스트 체크 완료
                                        callback1(null, res_code.SUCCESS, _is_exist_in_red, _room_list);
                                        return;
                                    }
                                });
                            }
                        }
                    }
                });
            }
        },
        function(err1, _is_exist_in_red, _room_list, callback1) {
            if(err1 != res_code.SUCCESS) {
                callback1(null, err1, _is_exist_in_red);
                return;
            }
            if(err1 == res_code.SUCCESS && _is_exist_in_red) {
                callback1(null, err1, _is_exist_in_red);
                return;
            }
            let _passed_len_room_list = 0, _is_exist_in_blue = false;
            if(_room_list.length == 0) {
                callback1(null, res_code.SUCCESS, false);
                return;
            }
            //blue user인 경우
            for(let i = 0; i < _room_list.length; i ++) {
                pan_room_list_redis.lrange(redis_config.BLUE_USER_LIST_KEY + '_' + _room_list[i], 0, -1, (err2, res2) => {
                    if(err2 || res2 == null) {
                        _passed_len_room_list ++;
                        if(_passed_len_room_list == _room_list.length) { //모든 방에 대한 유저리스트 체크완료
                            callback1(null, res_code.SUCCESS, _is_exist_in_blue);
                            return;
                        }
                    }
                    else {
                        let _passed_len_user_list = 0;
                        if(res2.length == 0) {
                            _passed_len_room_list ++;
                            if(_passed_len_room_list == _room_list.length) { //모든 방 에 대한 유저리스트 체크 완료
                                callback1(null, res_code.SUCCESS, _is_exist_in_blue);
                                return;
                            }
                        }
                        else {
                            for(let idx = 0; idx < res2.length; idx ++) {
                                pan_room_list_redis.hget(redis_config.USER_DETAIL_KEY + '_' + res2[idx], 'SESSION_ID', (err3, res3) => {
                                    if(err3) {
                                        _passed_len_user_list ++;
                                    }
                                    else
                                        _passed_len_user_list ++;
                                    /** */
                                    if(res3 == req.body.session_id) {
                                        _is_exist_in_blue = true;
                                        callback1(null, res_code.SUCCESS, true);
                                        return;
                                    }
    
                                    if(_passed_len_user_list == res2.length) { // 한개 방 에 대한 유저리스트 체크 완료
                                        _passed_len_room_list ++;
                                    }
                                    if(_passed_len_room_list == _room_list.length) { // 모든 방 에 대한 유저리스트 체크 완료
                                        callback1(null, res_code.SUCCESS, _is_exist_in_blue);
                                        return;
                                    }
                                });    
                            }
                        }
                    }
                });
            }
        }
    ], function(err, _res_code, _is_exist) {
        console.log("find user by session method completed====");
        res.json({
            'ERR_CODE': _res_code,
            'IS_EXIST': _is_exist
        });
    });
}

//룸번호 , 소켓아이디로 유저정보 가져오기
exports.getUser = async function(req, res) {
    if(isEmpty(req.body.room_number) || isEmpty(req.body.socket_id)) {
        res.json({ 'ERR_CODE': res_code.INVALID_PARAM });
        return;
    }
    const pan_room_list_redis = credis.getPanchangeChannel();

    try {
        let _key = null;
        if(!isEmpty(req.body.key)) {
            _key = req.body.key;
        }
        let _data = await getUserDetailInfo(pan_room_list_redis, req.body.socket_id, _key);
        res.json({ 'ERR_CODE': res_code.SUCCESS, 'DATA': _data });   
        return;                   
    }
    catch(err22) {
        res.json({ 'ERR_CODE': err22 });   
        return;                   
    }
}

exports.isAllReady = async function(req, res) {
    if(isEmpty(req.body.room_number)) {
        res.json({ 'ERR_CODE': res_code.INVALID_PARAM });   
        return;                   
    }
    const pan_room_list_redis = credis.getPanchangeChannel();
    try {
        let _red_user_list = await getTeamSocketIdList(pan_room_list_redis, req.body.room_number, 'RED');
        let _blue_user_list = await getTeamSocketIdList(pan_room_list_redis, req.body.room_number, 'BLUE');
        let _unready_socket_list = [];

        for(let i = 0; i < _red_user_list.length; i ++) {
            let _user_detail = await getUserDetailInfo(pan_room_list_redis, _red_user_list[i]);
            if(_user_detail.READY == 0 && _user_detail.MASTER == 0) {
                _unready_socket_list.push(_red_user_list[i]);
            }
        }
        for(let i = 0; i < _blue_user_list.length; i ++) {
            let _user_detail = await getUserDetailInfo(pan_room_list_redis, _blue_user_list[i]);
            if(_user_detail.READY == 0 && _user_detail.MASTER == 0) {
                _unready_socket_list.push(_blue_user_list[i]);
            }
        }
        res.json({
            'ERR_CODE': res_code.SUCCESS,
            'UNREADY_LIST': _unready_socket_list
        })
        return;
    }
    catch(err22) {
        res.json({ 'ERR_CODE': err22 });   
        return;                   
    }
}

exports.isValance = async function(req, res) {
    if(isEmpty(req.body.room_number)) {
        res.json({ 'ERR_CODE': res_code.INVALID_PARAM });   
        return;                   
    }
    const pan_room_list_redis = credis.getPanchangeChannel();
    try {
        if((await getRedUserCount(pan_room_list_redis, req.body.room_number)) == (await getBlueUserCount(pan_room_list_redis, req.body.room_number))) {
            res.json({
                'ERR_CODE': res_code.SUCCESS,
                'IS_VALANCE': true
            });
            return;
        }
        return res.json({ 'ERR_CODE': res_code.SUCCESS, 'IS_VALANCE': false });
    }
    catch(err22) {
        res.json({ 'ERR_CODE': err22 });   
        return;                   
    }
}

exports.findByUUID = function(req, res) {
    if(isEmpty(req.body.room_number)) {
        res.json({ 'ERR_CODE': res_code.INVALID_PARAM });   
        return;                   
    }
    const pan_room_list_redis = credis.getPanchangeChannel();

    if(req.body.uuid != 0) {
        findUser(pan_room_list_redis, req.body.room_number, req.body.uuid, 2, (_res_code, _data, _is_exist) => {
            // let ret = _data;
            if(_is_exist)
                _data.TEAM = _data.COLOR;
            return res.json({
                'ERR_CODE': _res_code,
                'DATA': _data
            });
        });
    } else {
        findUser(pan_room_list_redis, req.body.room_number, req.body.nickname, 1, (_res_code, _data, _is_exist) => {
            if(_is_exist)
                _data.TEAM = _data.COLOR;
            return res.json({
                'ERR_CODE': _res_code,
                'DATA': _data
            });
        });
    }
}

//게임방 탈퇴
exports.leaveUser = function(req, res) {

    if(isEmpty(req.body.room_number) || isEmpty(req.body.socket_id)) {
        res.json({ 'ERR_CODE': res_code.INVALID_PARAM });   
        return;                   
    }
    const pan_room_list_redis = credis.getPanchangeChannel();

    //소켓으로 유저 정보 가져오기
    findUser(pan_room_list_redis, req.body.room_number, req.body.socket_id, 3, async (_res_code, _data, _is_exist) => {
        if(_res_code != res_code.SUCCESS) {
            res.json({ 'ERR_CODE': _res_code });   
            return;
        }
        if(!_is_exist) {
            res.json({ 'ERR_CODE': res_code.PAN_GAME_USER_IS_NOT_EXIST });
            return;
        }
        try {
            //유저 정보 삭제 
            await removeUserList(pan_room_list_redis, req.body.room_number, _data.SOCKET, _data.COLOR);
            await removeUserDetail(pan_room_list_redis, _data.SOCKET);
            await removeUserSocketRoom(pan_room_list_redis, _data.SOCKET);
            //
            if(_data.MASTER == 1) {
                //방장이면  방장바꾸기
                if(_data.COLOR == 'RED')  {
                    if( ( await getRedUserCount(pan_room_list_redis, req.body.room_number) ) > 0 )  {       
                        let _team_first_socket = await getSocketIdByIdx(pan_room_list_redis, req.body.room_number, 0, 'RED');
                        await setUserDetailInfo(pan_room_list_redis, _team_first_socket, { MASTER: 1 });
                        await changeMasterSettingInRoom(pan_room_list_redis, req.body.room_number, _data.NICKNAME, (await getUserDetailInfo(pan_room_list_redis, _team_first_socket, 'NICKNAME')));
                    }
                    else if( ( await getBlueUserCount(pan_room_list_redis, req.body.room_number) ) > 0 ) {
                        let _team_first_socket = await getSocketIdByIdx(pan_room_list_redis, req.body.room_number, 0, 'BLUE');
                        await setUserDetailInfo(pan_room_list_redis, _team_first_socket, { MASTER: 1 });
                        await changeMasterSettingInRoom(pan_room_list_redis, req.body.room_number, _data.NICKNAME, (await getUserDetailInfo(pan_room_list_redis, _team_first_socket, 'NICKNAME')));
                    }
                }
                else if(_data.COLOR == 'BLUE') {
                    if( ( await getBlueUserCount(pan_room_list_redis, req.body.room_number) ) > 0 )  {       
                        let _team_first_socket = await getSocketIdByIdx(pan_room_list_redis, req.body.room_number, 0, 'BLUE');
                        await setUserDetailInfo(pan_room_list_redis, _team_first_socket, { MASTER: 1 });
                        await changeMasterSettingInRoom(pan_room_list_redis, req.body.room_number, _data.NICKNAME, (await getUserDetailInfo(pan_room_list_redis, _team_first_socket, 'NICKNAME')));
                    }
                    else if( ( await getRedUserCount(pan_room_list_redis, req.body.room_number) ) > 0 ) {
                        let _team_first_socket = await getSocketIdByIdx(pan_room_list_redis, req.body.room_number, 0, 'RED');
                        await setUserDetailInfo(pan_room_list_redis, _team_first_socket, { MASTER: 1 });
                        await changeMasterSettingInRoom(pan_room_list_redis, req.body.room_number, _data.NICKNAME, (await getUserDetailInfo(pan_room_list_redis, _team_first_socket, 'NICKNAME')));
                    }
                }
            }
            //게임방 정보 가져오기
            let _room_detail_info = await getRoomDetail(pan_room_list_redis, req.body.room_number);
            if(_room_detail_info.is_clan == 1) { // 클랜방 여부
                /**
                 * 기존파일경로/파일명: HANCOM_TT_REPO/hancom_tt_module/panchangeserver/src/game.js
                 * 기존함수명: leaveUser (471 ~ 479, 503 ~ 510)
                 */
                if(_data.COLOR == 'RED')     {
                    if(( await getRedUserCount(pan_room_list_redis, req.body.room_number) ) == 0) {
                        if(_room_detail_info.pk_clan == _room_detail_info.a_clan && _room_detail_info.b_clan != "") {
                            await setRoomDetailInfo(pan_room_list_redis, req.body.room_number, { 'pk_clan': _room_detail_info.b_clan });
                            await changeClanA(pan_room_list_redis, req.body.room_number, _room_detail_info.a_clan, _room_detail_info.b_clan);
                        } else if(_room_detail_info.pk_clan != _room_detail_info.a_clan) {
                            await changeClanB(pan_room_list_redis, req.body.room_number, "");
                        }
                        await setRoomDetailInfo(pan_room_list_redis, req.body.room_number, { 'a_clan': ""});
                    }
                }
                else if(_data.COLOR == 'BLUE') {
                    if(( await getBlueUserCount(pan_room_list_redis, req.body.room_number) ) == 0) {
                        if(_room_detail_info.pk_clan == _room_detail_info.b_clan && _room_detail_info.a_clan != "") {
                            await setRoomDetailInfo(pan_room_list_redis, req.body.room_number, { 'pk_clan': _room_detail_info.a_clan });
                            await changeClanA(pan_room_list_redis, req.body.room_number, _room_detail_info.b_clan, _room_detail_info.a_clan);
                        } else if(_room_detail_info.pk_clan != _room_detail_info.b_clan) {
                            await changeClanB(pan_room_list_redis, req.body.room_number, "");
                        }
                        await setRoomDetailInfo(pan_room_list_redis, req.body.room_number, { 'b_clan': "" });
                    }
                }
            }
            // 멤버수 감소
            await setRoomDetailInfo(pan_room_list_redis, req.body.room_number, {'current_user_count': parseInt(_room_detail_info.current_user_count) - 1});
            res.json({ 'ERR_CODE': res_code.SUCCESS, 'MEMBERS': (parseInt(_room_detail_info.current_user_count) - 1) });
            return;
        }
        catch(err22) {
            res.json({ 'ERR_CODE': err22 });
            return;
        }
    });
}

exports.getRoomInfo = async function(req, res) {
    if(isEmpty(req.body.room_number)) {
        res.json({ 'ERR_CODE': res_code.INVALID_PARAM });   
        return;                   
    }
    const pan_room_list_redis = credis.getPanchangeChannel();
    try {
        let _room_detail_info = await getRoomDetail(pan_room_list_redis, req.body.room_number);
        res.json({  'ERR_CODE': res_code.SUCCESS,
                    'DATA': { 
                        'ROOM_NAME': _room_detail_info.room_title,
                        'ROOM_TYPE': _room_detail_info.is_clan == 1 ? '클랜' : '자유',
                        'RUNNING_TIME': parseInt(_room_detail_info.play_time) * 60,
                        'BACKGROUND': _room_detail_info.back_ground,
                        'IS_FREE': _room_detail_info.is_lock == 1 ? false : true,
                        'MEMBER_NUM': _room_detail_info.user_max_count,
                        'A_CLAN': _room_detail_info.a_clan,
                        'B_CLAN': _room_detail_info.b_clan,
                        'PASSWORD' : _room_detail_info.password
                    } });
    }
    catch(err22) {
        res.json({ 'ERR_CODE': err22 });
        return;
    }
}

exports.getClanInfo = async function(req, res) {
    if(isEmpty(req.body.room_number)) {
        res.json({ 'ERR_CODE': res_code.INVALID_PARAM });   
        return;                   
    }
    const pan_room_list_redis = credis.getPanchangeChannel();
    try {
        let _room_detail_info = await getRoomDetail(pan_room_list_redis, req.body.room_number);
        res.json({  'ERR_CODE': res_code.SUCCESS,
                    'DATA': { 
                        'A_CLAN': _room_detail_info.a_clan,
                        'B_CLAN': _room_detail_info.b_clan
                    } });    
    }
    catch(err22) {
        res.json({ 'ERR_CODE': err22 });
        return;
    }
}

// 준비상태 변경
exports.changeReady = async function(req, res) {

    console.log("changeReady====================");

    if(isEmpty(req.body.room_number) || isEmpty(req.body.socket_id)) {
        res.json({ 'ERR_CODE': res_code.INVALID_PARAM });   
        return;                   
    }
    try {
        const pan_room_list_redis = credis.getPanchangeChannel();
        let _room_detail_info = await getRoomDetail(pan_room_list_redis, req.body.room_number);
        if(_room_detail_info.status != 0) { // wait 
            res.json({ 'ERR_CODE': res_code.SUCCESS,
                       'CHANGE_READY': false });
            return;
        }
        findUser(pan_room_list_redis, req.body.room_number, req.body.socket_id, 3, async (_res_code, _data, _is_exist) => {
            if(_res_code != res_code.SUCCESS) {
                res.json({ 'ERR_CODE': _res_code, 'CHANGE_READY': false });
                return;
            }
            if(!_is_exist) {
                res.json({ 'ERR_CODE': res_code.PAN_GAME_USER_IS_NOT_EXIST,
                           'CHANGE_READY': false });
                return;
            }
            try {
                await setUserDetailInfo(pan_room_list_redis, _data.SOCKET, { 'READY': (_data.READY == 0 ? 1 : 0) });
                return res.json({ 'ERR_CODE': res_code.SUCCESS,
                                   'CHANGE_READY': true });
            }
            catch(err22) {
                return res.json({ 'ERR_CODE': err22 });
            }
        });
    }
    catch(err22) {
        res.json({ 'ERR_CODE': err22 });
        return;
    }
}

// 게임방 유저 목록 가져오기
exports.getUserInfo = async function(req, res) {   
    if(isEmpty(req.body.room_number)) {
        res.json({ 'ERR_CODE': res_code.INVALID_PARAM });   
        return;                   
    }
    try {      
        const pan_room_list_redis = credis.getPanchangeChannel();
        res.json({
            'ERR_CODE': res_code.SUCCESS,
            'DATA': {
                'RED': (await getUserListInRoom(pan_room_list_redis, req.body.room_number, 'RED')),
                'BLUE': (await getUserListInRoom(pan_room_list_redis, req.body.room_number, 'BLUE')),
                'MEMBER_NUM': (await getRoomDetail(pan_room_list_redis, req.body.room_number, 'user_max_count'))
            }
        });
        return;
    }
    catch(err22) {
        res.json({ 'ERR_CODE': err22 });
        return;    
    }
}

exports.setLoading = function(req, res) {
    if(isEmpty(req.body.room_number) || isEmpty(req.body.socket_id)) {
        res.json({ 'ERR_CODE': res_code.INVALID_PARAM });   
        return;                   
    }
    const pan_room_list_redis = credis.getPanchangeChannel();
    findUser(pan_room_list_redis, req.body.room_number, req.body.socket_id, 3, async (_res_code, _data, _is_exist) => {
        if(_res_code != res_code.SUCCESS) {
            res.json({ 'ERR_CODE': _res_code });
            return;
        }
        if(!_is_exist) {
            res.json({ 'ERR_CODE': res_code.PAN_GAME_USER_IS_NOT_EXIST });
            return;
        }
        try {
            await setUserDetailInfo(pan_room_list_redis, _data.SOCKET, { 'LOADING': 1 });
            res.json({ 'ERR_CODE': res_code.SUCCESS });
            return;
        }
        catch(err22) {
            res.json({ 'ERR_CODE': err22 });
            return;
        }
    });
}

exports.isAllLoading = async function(req, res) {

    if(isEmpty(req.body.room_number)) {
        res.json({ 'ERR_CODE': res_code.INVALID_PARAM });   
        return;                   
    }

    try {
        const pan_room_list_redis = credis.getPanchangeChannel();

        if( (await getRoomDetail(pan_room_list_redis, req.body.room_number, 'status')) != 1 ) {
            res.json({ 'ERR_CODE': res_code.SUCCESS, 'IS_ALL_LOADING': false });
            return;
        }

        let red_user_list = await getTeamSocketIdList(pan_room_list_redis, req.body.room_number, 'RED');
        for(let i = 0; i < red_user_list.length; i ++) {
            if((await getUserDetailInfo(pan_room_list_redis, red_user_list[i], 'LOADING')) == 0) {
                res.json({ 'ERR_CODE': res_code.SUCCESS, 'IS_ALL_LOADING': false });
                return;
            }
        }
        let blue_user_list = await getTeamSocketIdList(pan_room_list_redis, req.body.room_number, 'BLUE');
        for(let i = 0; i < blue_user_list.length; i ++) {
            if((await getUserDetailInfo(pan_room_list_redis, blue_user_list[i], 'LOADING')) == 0) {
                res.json({ 'ERR_CODE': res_code.SUCCESS, 'IS_ALL_LOADING': false });
                return;
            }
        }
        // set room status playing
        await setRoomDetailInfo(pan_room_list_redis, req.body.room_number, { 'status': 2, 'update_time': Math.floor(Date.now() / 1000) });
        res.json({ 'ERR_CODE': res_code.SUCCESS, 'IS_ALL_LOADING': true });
        return;
    }
    catch(err22) {
        res.json({ 'ERR_CODE': err22, 'IS_ALL_LOADING': false });
        return;
    }
}

exports.forceStartGame = async function(req, res) {

    if(isEmpty(req.body.room_number)) {
        res.json({ 'ERR_CODE': res_code.INVALID_PARAM });   
        return;                   
    }
    try {
        const pan_room_list_redis = credis.getPanchangeChannel();
        let socket_list = [];

        if( (await getRoomDetail(pan_room_list_redis, req.body.room_number, 'status')) == 1 ) {
            let red_user_list = await getTeamSocketIdList(pan_room_list_redis, req.body.room_number, 'RED');
            for(let i = 0; i < red_user_list.length; i ++) {
                if( (await getUserDetailInfo(pan_room_list_redis, red_user_list[i], 'LOADING')) != 1 ) {
                    await setUserDetailInfo(pan_room_list_redis, red_user_list[i], { 'LOADING' : 1 });
                    socket_list.push((await getUserDetailInfo(pan_room_list_redis, red_user_list[i], 'SOCKET')));
                }
            }
            let blue_user_list = await getTeamSocketIdList(pan_room_list_redis, req.body.room_number, 'BLUE');
            for(let i = 0; i < blue_user_list.length; i ++) {
                console.log((await getUserDetailInfo(pan_room_list_redis, blue_user_list[i], 'LOADING')));
                if( (await getUserDetailInfo(pan_room_list_redis, blue_user_list[i], 'LOADING')) != 1 ) {
                    await setUserDetailInfo(pan_room_list_redis, blue_user_list[i], { 'LOADING' : 1 });
                    socket_list.push((await getUserDetailInfo(pan_room_list_redis, blue_user_list[i], 'SOCKET')));
                }
            }
        }
        return res.json({ 'ERR_CODE': res_code.SUCCESS, 'SOCKET_LIST': socket_list });
    }
    catch(err22) {
        return res.json({ 'ERR_CODE': err22 });
    }

}

exports.getCurrentLoading = async function(req, res) {
    if(isEmpty(req.body.room_number)) {
        res.json({ 'ERR_CODE': res_code.INVALID_PARAM });   
        return;                   
    }
    try {
        const pan_room_list_redis = credis.getPanchangeChannel();    
        let _room_detail_info = await getRoomDetail(pan_room_list_redis, req.body.room_number);

        if(_room_detail_info.status != 1) {
            return res.json({ 'ERR_CODE': res_code.SUCCESS,
                              'MSG': _room_detail_info.current_user_count + ' / ' + _room_detail_info.current_user_count });    
        }

        let current = 0;
        let red_user_list = await getTeamSocketIdList(pan_room_list_redis, req.body.room_number, 'RED');
        for(let i = 0; i < red_user_list.length; i ++) {
            if( (await getUserDetailInfo(pan_room_list_redis, red_user_list[i], 'LOADING')) == 1 ) {
                current += 1;
            }    
        }   
        let blue_user_list = await getTeamSocketIdList(pan_room_list_redis, req.body.room_number, 'BLUE');
        for(let i = 0; i < blue_user_list.length; i ++) {
            if( (await getUserDetailInfo(pan_room_list_redis, blue_user_list[i], 'LOADING')) == 1 ) {
                current += 1;
            }
        }
        return res.json({ 'ERR_CODE': res_code.SUCCESS,
                        'MSG': current + ' / ' + _room_detail_info.current_user_count });
    }
    catch(err22) {
        return res.json({ 'ERR_CODE': err22 });
    }
}

// 게임 종료
exports.setEndGame = function(req, res) {
    if(isEmpty(req.body.room_number) || isEmpty(req.body.socket_id)) {
        res.json({ 'ERR_CODE': res_code.INVALID_PARAM });   
        return;
    }
    const pan_room_list_redis = credis.getPanchangeChannel();
    findUser(pan_room_list_redis, req.body.room_number, req.body.socket_id, 3, async (_res_code, _data, _is_exist) => {
        if(_res_code != res_code.SUCCESS) {
            res.json({ 'ERR_CODE': _res_code });
            return;           
        }
        if(!_is_exist) {
            res.json({ 'ERR_CODE': res_code.PAN_GAME_USER_IS_NOT_EXIST });
            return;
        }
        try {
            await setUserDetailInfo(pan_room_list_redis, _data.SOCKET, { 'ENDGAME': 1 });
            res.json({ 'ERR_CODE': res_code.SUCCESS });
            return;
        }
        catch(err22) {
            res.json({ 'ERR_CODE': err22 });
            return;
        }
    });
}

exports.isAllEndGame = async function(req, res) {
    if(isEmpty(req.body.room_number)) {
        res.json({ 'ERR_CODE': res_code.INVALID_PARAM });   
        return;        
    }
    try {
        const pan_room_list_redis = credis.getPanchangeChannel();    
        if( (await getRoomDetail(pan_room_list_redis, req.body.room_number, 'status')) != 2 ) {
            res.json({ 'ERR_CODE': res_code.SUCCESS, 'IS_ALL_END_GAME': false });
            return;
        }
        let red_user_list = await getTeamSocketIdList(pan_room_list_redis, req.body.room_number, 'RED');
        for(let i = 0; i < red_user_list.length; i ++) {
            if((await getUserDetailInfo(pan_room_list_redis, red_user_list[i], 'ENDGAME')) == 0) { 
                res.json({ 'ERR_CODE': res_code.SUCCESS, 'IS_ALL_END_GAME': false });           
                return;
            }
        }
        let blue_user_list = await getTeamSocketIdList(pan_room_list_redis, req.body.room_number, 'BLUE');
        for(let i = 0; i < blue_user_list.length; i ++) {
            if((await getUserDetailInfo(pan_room_list_redis, blue_user_list[i], 'ENDGAME')) == 0) {
                res.json({ 'ERR_CODE': res_code.SUCCESS, 'IS_ALL_END_GAME': false });           
                return;
            }
        }
        res.json({ 'ERR_CODE': res_code.SUCCESS, 'IS_ALL_END_GAME': true })
        return;
    }
    catch(err22) {
        return res.json({ 'ERR_CODE': err22 });
    }
}

//팀 이동
exports.moveOtherTeam = async function(req, res) {
    if(isEmpty(req.body.room_number) || isEmpty(req.body.socket_id)) {
        res.json({ 'ERR_CODE': res_code.INVALID_PARAM });   
        return;        
    }
    const pan_room_list_redis = credis.getPanchangeChannel();    
    try {
        let _data = await getUserDetailInfo(pan_room_list_redis, req.body.socket_id);
        if(_data.COLOR == 'RED') {
            if( parseInt((await getBlueUserCount(pan_room_list_redis, req.body.room_number))) >= ( parseInt((await getRoomDetail(pan_room_list_redis, req.body.room_number, 'user_max_count'))) / 2) ) {
                res.json({ 'ERR_CODE': res_code.PAN_GAME_METHOD_FAIL });   
                return;        
            }
        }
        else {
            if( parseInt((await getRedUserCount(pan_room_list_redis, req.body.room_number))) >= ( parseInt((await getRoomDetail(pan_room_list_redis, req.body.room_number, 'user_max_count'))) / 2) ) {
                res.json({ 'ERR_CODE': res_code.PAN_GAME_METHOD_FAIL });   
                return;               
            }    
        }

        if(_data.COLOR == 'RED') {
            if(_data.MASTER == 1) {
                await removeUserList(pan_room_list_redis, req.body.room_number, _data.SOCKET, 'RED');
                await addUserList(pan_room_list_redis, req.body.room_number, _data.SOCKET, 'BLUE');
                await setUserDetailInfo(pan_room_list_redis, _data.SOCKET, {
                    'COLOR': 'BLUE'
                });
            } else {
                await removeUserList(pan_room_list_redis, req.body.room_number, _data.SOCKET, 'RED');
                await addUserList(pan_room_list_redis, req.body.room_number, _data.SOCKET, 'BLUE', 2);
                await setUserDetailInfo(pan_room_list_redis, _data.SOCKET, {
                    'COLOR': 'BLUE'
                });
            }
        } else {
            if(_data.MASTER == 1) {
                await removeUserList(pan_room_list_redis, req.body.room_number, _data.SOCKET, 'BLUE');
                await addUserList(pan_room_list_redis, req.body.room_number, _data.SOCKET, 'RED');
                await setUserDetailInfo(pan_room_list_redis, _data.SOCKET, {
                    'COLOR': 'RED'
                });
            } else {
                await removeUserList(pan_room_list_redis, req.body.room_number, _data.SOCKET, 'BLUE');
                await addUserList(pan_room_list_redis, req.body.room_number, _data.SOCKET, 'RED', 2);   
                await setUserDetailInfo(pan_room_list_redis, _data.SOCKET, {
                    'COLOR': 'RED'
                });
            }
        }
        res.json({ 'ERR_CODE': res_code.SUCCESS });
        return;
    }
    catch(err22) {
        res.json({ 'ERR_CODE': err22 });   
        return;               
    }
}

exports.replaceSocketByNickname = async function(req, res) {
    if(isEmpty(req.body.room_number) || isEmpty(req.body.socket_id) || isEmpty(req.body.nickname)) {
        res.json({ 'ERR_CODE': res_code.INVALID_PARAM });   
        return;               
    }
    const pan_room_list_redis = credis.getPanchangeChannel();
    findUser(pan_room_list_redis, req.body.room_number, req.body.nickname, 1, async (_res_code, _data, _is_exist) => {
        if(_res_code != res_code.SUCCESS) {
            res.json({ 'ERR_CODE': _res_code });   
            return;
        }
        if(!_is_exist) {
            res.json({ 'ERR_CODE': res_code.PAN_GAME_USER_IS_NOT_EXIST });
            return;
        }

        try {
            let _old_socket = _data.SOCKET;
            //
            await removeRedisInfo(pan_room_list_redis, redis_config.SOCKET_ROOM_KEY + '_' + _old_socket);
            await removeRedisInfo(pan_room_list_redis, redis_config.USER_DETAIL_KEY + '_' + _old_socket);
            //
            let _user_list = await getTeamSocketIdList(pan_room_list_redis, req.body.room_number, _data.COLOR);
            let idx = -1;
            for(let i = 0; i < _user_list.length; i ++) {
                if(_user_list[i] == _old_socket) {
                    idx = i;
                    break;
                }
            }
            _data.SOCKET = req.body.socket_id;
            await setUserDetailInfo(pan_room_list_redis, req.body.socket_id, _data);
            await setSocketRoomInfo(pan_room_list_redis, req.body.socket_id, {
                'room_number': req.body.room_number
            });
            if(idx >= 0)
                await setSocketIdByIdx(pan_room_list_redis, req.body.room_number, idx, req.body.socket_id, _data.COLOR);
            //////////////////////////////
            /**
             * gameData
             */ 
            //////////////////////////////
            let _user_score = await getUserScore(pan_room_list_redis, req.body.room_number, _old_socket, _data.COLOR);
            if(!isNaN(_user_score)) {
                let _rank_user_detail = await getGameDataObject(4, pan_room_list_redis, req.body.room_number, 0, _old_socket, '');
                await removeSocketInRankList(pan_room_list_redis, req.body.room_number, _old_socket, _data.COLOR);
                await removeRedisInfo(pan_room_list_redis, redis_config.RANK_USER_DETAIL + '_' + _old_socket);
                await addUserToRankList(pan_room_list_redis, req.body.room_number, req.body.socket_id, _data.COLOR, parseInt(_user_score));
                _rank_user_detail.SOCKET = req.body.socket_id;
                await setGameDataObject(4, pan_room_list_redis, req.body.room_number, 0, req.body.socket_id, '', _rank_user_detail);
            }
            return res.json({ 'ERR_CODE': res_code.SUCCESS });
        }
        catch(err22) {
            return res.json({ 'ERR_CODE': err22 });
        }
    });
}