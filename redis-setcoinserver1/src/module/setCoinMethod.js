'use strict';    
var combo_attack_type = require('./define').COMBO_ATTACK_TYPYE;
const gamecfg = require('./../../config/game.json');
const wlccfg       = require('./../../config/word_level_ctrl.json');
const redis_config = require('./../../config/redis.json')[process.env.NODE_ENV || 'development']['REDIS_KEY'];
const { getUserSessionListInRoom, getUserDetailInfo, removeRedisInfo, addDataToArray,
    getValueByIdx, updateScore, getUserScore, getSessionIdByIdx, setUserScore, getListFromArray, setUserDetailInfo,
    removeRoomInRoomList, 
    removeInArray} = require('./setCoinModule');
const res_code = require('./../../config/res_code');


exports.sendComboAttack = function(setcoin_redis, score, session_id, combo_attck_count, able, combo_attack_type, coin_line_type, bad_coin_count) {
    return new Promise(async(resolve, reject) => {
        try {
            let _rdata1 = {};
            let _rdata2 = {};
            await updateScore(setcoin_redis, redis_config.USER_SCORE_KEY + '_' + session_id, 'score', parseInt(score));
            
            _rdata1.combo_count = combo_attck_count;
            _rdata2.combo_count = combo_attck_count;

            _rdata1.is_combo_attack = able;
            _rdata2.is_combo_attack = able;

            _rdata1.combo_attack_type = combo_attack_type;
            _rdata2.combo_attack_type = combo_attack_type;
            
           _rdata1.coin_tower_count = await getUserScore(setcoin_redis, redis_config.USER_SCORE_KEY + '_' + session_id, 'coin_count');
           _rdata2.coin_tower_count = _rdata1.coin_tower_count;

           _rdata1.coin_line_type = coin_line_type;
           _rdata2.coin_line_type = coin_line_type;

           _rdata1.bad_coin_count = bad_coin_count;
           _rdata2.bad_coin_count = bad_coin_count;

           _rdata1.score = score;
           _rdata2.score = score;

           _rdata1.total_score =  await getUserScore(setcoin_redis, redis_config.USER_SCORE_KEY + '_' + session_id, 'score');
           _rdata2.total_score =  _rdata1.total_score;

           console.log('check_word 1 : '+JSON.stringify(_rdata1));
           console.log('check_word 2 : '+JSON.stringify(_rdata2));
           resolve({rdata1: _rdata1, rdata2: _rdata2});
        }
        catch(err22) {
            reject(err22);
        }
    });
}

exports.findUser = function(setcoin_redis, room_number, session_id) {
    return new Promise(async(resolve, reject) => {
        try {
            let _users = await getUserSessionListInRoom(setcoin_redis, room_number);   
            if(_users.length <= 0) {
                resolve(false);
                return;
            }
            for(let i = 0; i < _users.length; i ++) {
                if(_users[i] == session_id) {
                    resolve(true);
                    return;
                }
            }
            resolve(false);
        }
        catch(err22) {
            reject(err22);
        }
    });
}

exports.setDataToArray = function(setcoin_redis, key, _array) {
    return new Promise(async(resolve, reject) => {
        try {
            await removeRedisInfo(setcoin_redis, key);
            for(let i = 0; i < _array.length; i ++)
                await addDataToArray(setcoin_redis, key, _array[i]);
            resolve(true);
        }
        catch(err22) {
            reject(err22);
        }
    });
}

exports.getComboAttackWord = function(setcoin_redis, _type, room_number) { 
    return new Promise(async(resolve, reject) => {
        try {
            let _combo_attack_key = '', _member = '', max_len = 0;
            if(_type == combo_attack_type.ATTACK_TYPE_3) {
                _combo_attack_key = redis_config.COMBO_ATTACK_TYPE + '_3_' + room_number;
                _member = 'combo_attack3_offset';
                max_len = gamecfg.MAX_COMBO_ATTACK_TYPE_3;
            }
            else if(_type == combo_attack_type.ATTACK_TYPE_4) {
                _combo_attack_key = redis_config.COMBO_ATTACK_TYPE + '_4_' + room_number;
                _member = 'combo_attack4_offset';
                max_len = gamecfg.MAX_COMBO_ATTACK_TYPE_4;
            }
            else if(_type == combo_attack_type.ATTACK_TYPE_5) {
                _combo_attack_key = redis_config.COMBO_ATTACK_TYPE + '_5_' + room_number;
                _member = 'combo_attack5_offset';
                max_len = gamecfg.MAX_COMBO_ATTACK_TYPE_5;
            }
            else if(_type == combo_attack_type.ATTACK_TYPE_6) {
                _combo_attack_key = redis_config.COMBO_ATTACK_TYPE + '_6_' + room_number;
                _member = 'combo_attack6_offset';
                max_len = gamecfg.MAX_COMBO_ATTACK_TYPE_6;
            }
            
            let _idx = await getUserScore(setcoin_redis, redis_config.ROOM_SCORE_KEY + '_' + room_number, _member);

            if(_idx >= max_len)
                _idx = 0;

            let _word = await getValueByIdx(setcoin_redis, _combo_attack_key, _idx, max_len);

            if(_idx == 0) 
                await setUserScore(setcoin_redis, redis_config.ROOM_SCORE_KEY + '_' + room_number, _member, 1);
            else 
                await updateScore(setcoin_redis, redis_config.ROOM_SCORE_KEY + '_' + room_number, _member, 1);

            resolve(_word);
        }
        catch(err22) {
            reject(err22);
        }
    });
}

exports.roomGetWordLevelS1 = function(setcoin_redis, _wlv, session_id, room_number) {
    return new Promise(async (resolve, reject) => {
        try {
            let _word_key = '', _member = '';
            if(_wlv == wlccfg.WORD_1) {
                _word_key = redis_config.WORD_LEVEL + '1_' + room_number;
                _member = 'word_level_1_offset';
            }
            else if(_wlv == wlccfg.WORD_2) {
                _word_key = redis_config.WORD_LEVEL + '2_' + room_number;
                _member = 'word_level_2_offset';
            }
            else if(_wlv == wlccfg.WORD_3) {
                _word_key = redis_config.WORD_LEVEL + '3_' + room_number;
                _member = 'word_level_3_offset';
            }
            else if(_wlv == wlccfg.WORD_4) {
                _word_key = redis_config.WORD_LEVEL + '4_' + room_number;
                _member = 'word_level_4_offset';
            }
            else if(_wlv == wlccfg.WORD_5) {
                _word_key = redis_config.WORD_LEVEL + '5_' + room_number;
                _member = 'word_level_5_offset';
            }
            else if(_wlv == wlccfg.WORD_6) {
                _word_key = redis_config.WORD_LEVEL + '6_' + room_number;
                _member = 'word_level_6_offset';
            }
            let _idx = await getUserScore(setcoin_redis, redis_config.USER_SCORE_KEY + '_' + session_id, _member);
            let _word = await getValueByIdx(setcoin_redis, _word_key, _idx, gamecfg.MAX_WORD_POOL);
            await updateScore(setcoin_redis, redis_config.USER_SCORE_KEY + '_' + session_id, _member, 1);
            resolve(_word);
        }
        catch(err22) {
            reject(err22);
        }
    });
}
exports.roomGetWordLevelS2 = function(setcoin_redis, _wlv, session_id, room_number) {
    return new Promise(async (resolve, reject) => {
        try {
            let _word_key = '', _member = '';
            if(_wlv == wlccfg.WORD_1) {
                _word_key = redis_config.WORD_LEVEL + '4_' + room_number;
                _member = 'word_level_4_offset';
            }
            else if(_wlv == wlccfg.WORD_2) {
                _word_key = redis_config.WORD_LEVEL + '4_' + room_number;
                _member = 'word_level_4_offset';
            }
            else if(_wlv == wlccfg.WORD_3) {
                _word_key = redis_config.WORD_LEVEL + '4_' + room_number;
                _member = 'word_level_4_offset';
            }
            else if(_wlv == wlccfg.WORD_4) {
                _word_key = redis_config.WORD_LEVEL + '4_' + room_number;
                _member = 'word_level_4_offset';
            }
            else if(_wlv == wlccfg.WORD_5) {
                _word_key = redis_config.WORD_LEVEL + '5_' + room_number;
                _member = 'word_level_5_offset';
            }
            else if(_wlv == wlccfg.WORD_6) {
                _word_key = redis_config.WORD_LEVEL + '6_' + room_number;
                _member = 'word_level_6_offset';
            }
            let _idx = await getUserScore(setcoin_redis, redis_config.USER_SCORE_KEY + '_' + session_id, _member);
            let _word = await getValueByIdx(setcoin_redis, _word_key, _idx, gamecfg.MAX_WORD_POOL);
            await updateScore(setcoin_redis, redis_config.USER_SCORE_KEY + '_' + session_id, _member, 1);
            resolve(_word);
        }
        catch(err22) {
            reject(err22);
        }
    });
}

exports.isRestart = function(setcoin_redis, room_number) {
    return new Promise(async (resolve, reject) => {
        try {
            let current_user_count = await getUserScore(setcoin_redis, redis_config.ROOM_SCORE_KEY + '_' + room_number, 'current_user_count');
            if(current_user_count != 2) {
                resolve(false);
                return;
            }

            let first_session_id = await getSessionIdByIdx(setcoin_redis, room_number, 0);
            let second_session_id = await getSessionIdByIdx(setcoin_redis, room_number, 1);

            if( (await getUserDetailInfo(setcoin_redis, first_session_id, 'restart')) == 1 && (await getUserDetailInfo(setcoin_redis, second_session_id, 'restart')) == 1 ) {
                resolve(true);
                return;
            }
            resolve(false);
            return;
        }
        catch(err22) {
            reject(err22);
        }
    });
}

exports.roomReset = function(setcoin_redis, room_number) {
    return new Promise(async (resolve, reject) => {
        try {
            await setUserScore(setcoin_redis, redis_config.ROOM_SCORE_KEY + '_' + room_number, 'ready_user_count');
            await setUserScore(setcoin_redis, redis_config.ROOM_SCORE_KEY + '_' + room_number, 'is_result');
            await setUserScore(setcoin_redis, redis_config.ROOM_SCORE_KEY + '_' + room_number, 'win_calc_A');
            await setUserScore(setcoin_redis, redis_config.ROOM_SCORE_KEY + '_' + room_number, 'win_calc_B');
            await setUserScore(setcoin_redis, redis_config.ROOM_SCORE_KEY + '_' + room_number, 'lose_calc_A');
            await setUserScore(setcoin_redis, redis_config.ROOM_SCORE_KEY + '_' + room_number, 'lose_calc_B');
            await setUserScore(setcoin_redis, redis_config.ROOM_SCORE_KEY + '_' + room_number, 'draw_calc_A');
            await setUserScore(setcoin_redis, redis_config.ROOM_SCORE_KEY + '_' + room_number, 'draw_calc_B');
            resolve(true);    
        }
        catch(err22) {
            reject(err22);
        }
    });
}

exports.userReset = function(setcoin_redis, session_id) {
    return new Promise(async (resolve, reject) => {
        try {
            let _user_change_info = {
                'word_offset': 0,
                'received_combo_attack': 0,
                'received_combo_attack_type': combo_attack_type.ATTACK_TYPE_INIT,
                'new_word_send_time': 0,
                'check_word': '',
                'combo_attack_count': 0,
                'coin_tower_count': 0,
                'restart': 0,
                'is_end': 0,
                'is_win': 0,
                'total_score': 0,
                'point': 0
            }; 

            await setUserDetailInfo(setcoin_redis, session_id, _user_change_info);
            await setUserScore(setcoin_redis, redis_config.USER_SCORE_KEY + '_' + session_id, 'score');

            await setUserScore(setcoin_redis, redis_config.USER_SCORE_KEY + '_' + session_id, 'word_level_1_offset');
            await setUserScore(setcoin_redis, redis_config.USER_SCORE_KEY + '_' + session_id, 'word_level_2_offset');
            await setUserScore(setcoin_redis, redis_config.USER_SCORE_KEY + '_' + session_id, 'word_level_3_offset');
            await setUserScore(setcoin_redis, redis_config.USER_SCORE_KEY + '_' + session_id, 'word_level_4_offset');
            await setUserScore(setcoin_redis, redis_config.USER_SCORE_KEY + '_' + session_id, 'word_level_5_offset');
            await setUserScore(setcoin_redis, redis_config.USER_SCORE_KEY + '_' + session_id, 'word_level_6_offset');
            await setUserScore(setcoin_redis, redis_config.USER_SCORE_KEY + '_' + session_id, 'coin_count');
            await setUserScore(setcoin_redis, redis_config.USER_SCORE_KEY + '_' + session_id, 'heart_count');

            resolve(true);
        }
        catch(err22) {
            reject(err22);
        }
    });  
}

exports.getLeaveUserNickName = function(setcoin_redis, room_number, session_id) {
    return new Promise(async (resolve, reject) => {
        try {
            let _leave_users = await getListFromArray(setcoin_redis, redis_config.L_USER_LIST_KEY + '_' + room_number);
            for(let i = 0; i < _leave_users.length; i ++) {
                if(_leave_users[i] != session_id) {
                    resolve(await getUserDetailInfo(setcoin_redis, _leave_users[i], 'nickname'));
                    return;
                }    
            }
            resolve(null);
        }
        catch(err22) {
            reject(err22);
        }
    });  
}

exports.getOtherUser = function(setcoin_redis, room_number, session_id) {
    return new Promise(async(resolve, reject) => {
        try {
            let _users = await getUserSessionListInRoom(setcoin_redis, room_number);

            if(_users.length <= 0)
                resolve(null);
            for(let i = 0; i < _users.length; i ++) {
                if(_users[i] != session_id) {
                    let _user = await getUserDetailInfo(setcoin_redis, _users[i]);
                    _user.score = await getUserScore(setcoin_redis, redis_config.USER_SCORE_KEY + '_' + _users[i], 'score');
                    _user.win = await getUserScore(setcoin_redis, redis_config.USER_SCORE_KEY + '_' + _users[i], 'win');
                    _user.lose = await getUserScore(setcoin_redis, redis_config.USER_SCORE_KEY + '_' + _users[i], 'lose');
                    _user.draw = await getUserScore(setcoin_redis, redis_config.USER_SCORE_KEY + '_' + _users[i], 'draw');
                    _user.coin_count = await getUserScore(setcoin_redis, redis_config.USER_SCORE_KEY + '_' + _users[i], 'coin_count');
                    _user.heart_count = await getUserScore(setcoin_redis, redis_config.USER_SCORE_KEY + '_' + _users[i], 'heart_count');
                    resolve(_user);
                    return;
                }
            }
            resolve(null);
        }
        catch(err22) {
            reject(err22);
        }
    });
}

exports.getEnterOtherNickName = function(setcoin_redis, room_number, session_id) {
    return new Promise(async(resolve, reject) => {
        try {
            //get enter user list
            let _enter_users = await getListFromArray(setcoin_redis, redis_config.USER_LIST_KEY + '_' + room_number);
            let _leave_users = await getListFromArray(setcoin_redis, redis_config.L_USER_LIST_KEY + '_' + room_number);
            for(let i = 0; i < _enter_users.length; i ++) {
                if(_enter_users[i] != session_id) {
                    resolve(await getUserDetailInfo(setcoin_redis, _enter_users[i], 'nickname'));
                    return;
                }
            }
            for(let i = 0; i < _leave_users.length; i ++) {
                if(_leave_users[i] != session_id) {
                    resolve(await getUserDetailInfo(setcoin_redis, _leave_users[i], 'nickname'));
                    return;
                }
            }
            resolve(null);
        }
        catch(err22) {
            reject(err22);
        }
    });
}

exports.deleteRoomMethod = function(setcoinserver1_redis, room_number) {
    return new Promise(async (resolve, reject) => {
        try {
            await removeRoomInRoomList(setcoinserver1_redis, room_number);
            // SETCOIN_ROOM_DETAIL_(room_number)
            await removeRedisInfo(setcoinserver1_redis, redis_config.ROOM_DETAIL_KEY + '_' + room_number);
            // SETCOIN_ROOM_SCORE_(room_number)
            await removeRedisInfo(setcoinserver1_redis, redis_config.ROOM_SCORE_KEY + '_' + room_number);

            let room_user_list = await getListFromArray(setcoinserver1_redis, redis_config.USER_LIST_KEY + '_' + room_number);

            console.log(room_user_list);

            for(let i = 0; i < room_user_list.length; i ++) {
                await removeInArray(setcoinserver1_redis, redis_config.MEMBER_LIST, room_user_list[i]);
            }
            let room_l_user_list = await getListFromArray(setcoinserver1_redis, redis_config.L_USER_LIST_KEY + '_' + room_number);
            for(let i = 0; i < room_l_user_list.length; i ++) {
                await removeInArray(setcoinserver1_redis, redis_config.MEMBER_LIST, room_l_user_list[i]);
            }
            // SET_COIN_USER_LIST_(room_number)
            await removeRedisInfo(setcoinserver1_redis, redis_config.USER_LIST_KEY + '_' + room_number);
            // SET_COIN_L_USER_LIST_(room_number)
            await removeRedisInfo(setcoinserver1_redis, redis_config.L_USER_LIST_KEY + '_' + room_number);
            // WORD_LEVEL_LIST_(room_number) 
            await removeRedisInfo(setcoinserver1_redis, redis_config.WORD_LEVEL_LIST + '_' + room_number);
            // SET_COIN_COMBO_A_3,  SET_COIN_COMBO_A_4,  SET_COIN_COMBO_A_5,  SET_COIN_COMBO_A_6
            await removeRedisInfo(setcoinserver1_redis, redis_config.COMBO_ATTACK_TYPE + '_3_' + room_number);
            await removeRedisInfo(setcoinserver1_redis, redis_config.COMBO_ATTACK_TYPE + '_4_' + room_number);
            await removeRedisInfo(setcoinserver1_redis, redis_config.COMBO_ATTACK_TYPE + '_5_' + room_number);
            await removeRedisInfo(setcoinserver1_redis, redis_config.COMBO_ATTACK_TYPE + '_6_' + room_number);   
            // SET_COIN_WORD_LEVEL(1~6)_(room_number)
            await removeRedisInfo(setcoinserver1_redis, redis_config.WORD_LEVEL + '1_' + room_number);
            await removeRedisInfo(setcoinserver1_redis, redis_config.WORD_LEVEL + '2_' + room_number);
            await removeRedisInfo(setcoinserver1_redis, redis_config.WORD_LEVEL + '3_' + room_number);
            await removeRedisInfo(setcoinserver1_redis, redis_config.WORD_LEVEL + '4_' + room_number);
            await removeRedisInfo(setcoinserver1_redis, redis_config.WORD_LEVEL + '5_' + room_number);
            await removeRedisInfo(setcoinserver1_redis, redis_config.WORD_LEVEL + '6_' + room_number);
            
            resolve(res_code.SUCCESS);
        }
        catch(err22) {
            reject(err22);
        }
    });
}