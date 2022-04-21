'use strict';    

var async = require('async');
const redis_config = require('./../../config/redis.json')[process.env.NODE_ENV || 'development']['PANCHANGE_CHANNEL'];
const res_code = require('./../../config/res_code');
const { isEmpty } = require('../../utils/global');
const { setRoomDetailInfo, getRoomDetail, getTeamSocketIdList, getUserDetailInfo, removeRoomInRoomList,
        removeRedisInfo } = require('./../module/panchangeModule');
const { getTeamRankList, getGameDataObject } = require('./../module/gameEngineModule');
const gameConf = require('./../../config/game.json');

exports.findUserByNickNameInRankList = function(pan_room_list_redis, room_number, nickname) {
    return new Promise(async (resolve, reject) => {
        try {
            let _red_rank_list = await getTeamRankList(pan_room_list_redis, room_number, 'RED');
            for(let i = 0; i < _red_rank_list.length; i ++) {
                let _user_detail = await getGameDataObject(4, pan_room_list_redis, room_number, 0, _red_rank_list[i], '');
                if(_user_detail.NICKNAME == nickname)  {
                    resolve(_user_detail);
                    return;
                }
            }
            let _blue_rank_list = await getTeamRankList(pan_room_list_redis, room_number, 'BLUE');
            for(let i = 0; i < _blue_rank_list.length; i ++) {
                let _user_detail = await getGameDataObject(4, pan_room_list_redis, room_number, 0, _blue_rank_list[i], '');
                if(_user_detail.NICKNAME == nickname)  {
                    resolve(_user_detail);
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

/**
 * 게임방 마스터 정보 변경
 * @param {*} pan_room_list_redis       판뒤집기 게임 핸들러 
 * @param {*} room_number               게임방 번호
 * @param {*} old_host_name             이전 마스터 닉네임 
 * @param {*} new_host_name             신규 마스터 닉네임
 */

exports.changeMasterSettingInRoom = function(pan_room_list_redis, room_number, old_host_name, new_host_name) {

    console.log("[changeMasterSettingInRoom]==========", old_host_name, new_host_name);

    return new Promise((resolve, reject) => {
        async.waterfall([
            function(callback1) {
                let _room_detail_info = {
                    'host_name': new_host_name
                };
                setRoomDetailInfo(pan_room_list_redis, room_number, _room_detail_info)
                .then((ret_code) => {
                    callback1(null, ret_code);
                })
                .catch((err_code) => {
                    callback1(null, err_code);
                });
            },
            function(_res_code, callback1) {
                if(_res_code != res_code.SUCCESS) {
                    callback1(null, _res_code);
                    return;
                }
                pan_room_list_redis.del(redis_config.ROOM_HOST_KEY + '_' + old_host_name, (err1 , res1) => {
                    console.log(err1, res1);
                    if(err1) {
                        console.log("err1======", err1);
                        callback1(null, res_code.DELETE_HOST_ROOM_FAIL);
                        return;
                    }
                    if(res1 < 0)  {
                        callback1(null, res_code.DELETE_HOST_ROOM_FAIL);
                        return;
                    }
                    callback1(null, res_code.SUCCESS);
                });
            },
            function(_res_code, callback1) {
                if(_res_code != res_code.SUCCESS) {
                    callback1(null, _res_code);
                    return;
                }
                let _value = {
                    "room_number": room_number
                };
                pan_room_list_redis.hmset(redis_config.ROOM_HOST_KEY + '_' + new_host_name, _value, (err1 , res1) => {
                    if(err1) {
                        console.log("")
                        callback1(null, res_code.SAVE_TO_HOST_KEY_FAIL);
                    }
                    if(res1 != 'OK') {
                        callback1(null, res_code.SAVE_TO_HOST_KEY_FAIL);
                        return;
                    }
                    callback1(null, res_code.SUCCESS);
                });
            }
        ], function(err, _res_code) {
            if(_res_code == res_code.SUCCESS)
                resolve(_res_code)
            else
                reject(_res_code);
        });
    });      
}

/**
 * B 클랜 정보 업데이트 (Blue팀 클랜명 변경)
 * @param {*} pan_room_list_redis 
 * @param {*} room_number           게임방번호
 * @param {*} clan_name_B           변경 하려는 클랜명
 */
exports.changeClanB = function(pan_room_list_redis, room_number, clan_name_B) {
    return new Promise((resolve, reject) => {
        let _room_detail_info = {};
        _room_detail_info.clan_name_B = clan_name_B;
        setRoomDetailInfo(pan_room_list_redis, room_number, _room_detail_info) 
        .then((ret_code) => {
            resolve(ret_code);
        })
        .catch((err_code) => {
            reject(err_code);
        });
    });
}

/**
 * A 클랜 정보 업데이트 (Red팀 클랜명 변경)
 * @param {*} pan_room_list_redis       판뒤집기 게임 핸들러
 * @param {*} room_number               게임방 번호
 * @param {*} old_clan_name             이전 클랜명 
 * @param {*} new_clan_name             신규 클랜명
 */
exports.changeClanA = function(pan_room_list_redis, room_number, old_clan_name, new_clan_name) {
    return new Promise((resolve, reject) => {
        async.waterfall([
            function(callback1) {
                pan_room_list_redis.hgetall(redis_config.ROOM_DETAIL_KEY + '_' + room_number, (err1, res1) => {
                    if(err1) {
                        console.log("클랜 정보 변경 - 룸 디테일 정보 가져오기 오류====", err1);
                        callback1(null, res_code.GET_ROOM_DETAIL_FAIL);
                        return;
                    }
                    if(res1 <= 0 || isEmpty(res1)) {
                        callback1(null, res_code.GET_ROOM_DETAIL_FAIL);
                        return;     
                    }
                    if(parseInt(res1.is_clan) != 1) {
                        callback1(null, res_code.ROOM_NOT_CLAN);
                        return;
                    }
                    if(res1.clan_name_A != old_clan_name) {
                        callback1(null, res_code.CLAN_NAME_FAIL);
                        return;
                    }
                    callback1(null, res_code.SUCCESS);
                });
            },
            function(_res_code, callback1) {
                if(_res_code != res_code.SUCCESS) {
                    callback1(null, _res_code);
                    return;
                }
                let _room_detail_info = {
                    'clan_name_A': new_clan_name
                };       
                setRoomDetailInfo(pan_room_list_redis, room_number, _room_detail_info)
                .then((ret_code) => {
                    callback1(null, ret_code);
                })
                .catch((err_code) => {
                    callback1(null, err_code);
                });   
            },
            function(_res_code, callback1) {
                if(_res_code != res_code.SUCCESS) {
                    callback1(null, _res_code);
                    return;
                }
                pan_room_list_redis.del(redis_config.CLAN_NAME_KEY + '_' + old_clan_name, (err1 , res1) => {
                    if(err1) {
                        callback1(null, res_code.DELETE_CLAN_ROOM_FAIL);
                        return;
                    }
                    if(res1 < 0)  {
                        callback1(null, res_code.DELETE_CLAN_ROOM_FAIL);
                        return;
                    }
                    callback1(null, res_code.SUCCESS);
                });    
            },
            function(_res_code, callback1) {
                if(_res_code != res_code.SUCCESS) {
                    callback1(null, _res_code);
                    return;
                }
                let _value = {
                    "room_number": room_number
                };   

                pan_room_list_redis.hmset(redis_config.CLAN_NAME_KEY + '_' + new_clan_name, _value, (err1 , res1) => {
                    if(err1) {
                        console.log("클랜마스터 변경 오류 =======", err1);
                        callback1(null, res_code.SAVE_TO_CLAN_KEY_FAIL);
                        return;
                    }
                    if(res1 != 'OK') {
                        callback1(null, res_code.SAVE_TO_CLAN_KEY_FAIL);
                        return;
                    }
                    callback1(null, res_code.SUCCESS);
                });
            }
        ], function(err, _res_code) {
            if(_res_code == res_code.SUCCESS)
                resolve(_res_code);
            else
                reject(_res_code);
        });
    });
}

/**
 * 게임방 마스터 유저 정보 가져오기
 * @param {*} pan_room_list_redis 
 * @param {*} room_number 방번호
 */

exports.findMaster = function(pan_room_list_redis, room_number) {
    return new Promise(async (resolve, reject) => {
        try {
            let host_name = await getRoomDetail(pan_room_list_redis, room_number, 'host_name');
            let red_user_list = await getTeamSocketIdList(pan_room_list_redis, room_number, 'RED');
            for(let i = 0; i < red_user_list.length; i ++) {
                let _obj = await getUserDetailInfo(pan_room_list_redis, red_user_list[i]);
                if( _obj.NICKNAME == host_name ) {
                    resolve(_obj);
                    return;
                }
            }
            let blue_user_list = await getTeamSocketIdList(pan_room_list_redis, room_number, 'BLUE');
            for(let i = 0; i < blue_user_list.length; i ++) {
                let _obj = await getUserDetailInfo(pan_room_list_redis, blue_user_list[i]);
                if( _obj.NICKNAME == host_name ) {
                    resolve(_obj);
                    return;
                }
            }
            reject(res_code.PAN_GAME_NO_MASTER);
        }
        catch(err22) {
            reject(err22);
        }
    });
}

/**
 * 게임방 삭제
 */
exports.deleteRoomMethod = function(pan_room_list_redis, room_number) {
    return new Promise(async (resolve, reject) => {
        try {
            // get room detail info
            let _room_detail_info = await getRoomDetail(pan_room_list_redis, room_number);
            // remove room in roomlist
            await removeRoomInRoomList(pan_room_list_redis, room_number);
            // room number host name
            await removeRedisInfo(pan_room_list_redis, redis_config.ROOM_HOST_KEY + '_' + _room_detail_info.host_name);
            // room number clan name
            await removeRedisInfo(pan_room_list_redis, redis_config.CLAN_NAME_KEY + '_' + _room_detail_info.clan_name_A);
            // room detail
            await removeRedisInfo(pan_room_list_redis, redis_config.ROOM_DETAIL_KEY + '_' + room_number);           
            let _red_user_list = await getTeamSocketIdList(pan_room_list_redis, room_number, 'RED');
            let _blue_user_list = await getTeamSocketIdList(pan_room_list_redis, room_number, 'BLUE');
            // remove PANCHANGE_USER_DETAIL(_SOCKETID) && PANCHANGE_SOCKET_ROOM(_SOCKETID)
            for(let i = 0; i < _red_user_list.length; i ++) {
                await removeRedisInfo(pan_room_list_redis, redis_config.USER_DETAIL_KEY + '_' + _red_user_list[i]);
                await removeRedisInfo(pan_room_list_redis, redis_config.SOCKET_ROOM_KEY + '_' + _red_user_list[i]);
            }
            for(let i = 0; i < _blue_user_list.length; i ++) {
                await removeRedisInfo(pan_room_list_redis, redis_config.USER_DETAIL_KEY + '_' + _blue_user_list[i]);
                await removeRedisInfo(pan_room_list_redis, redis_config.SOCKET_ROOM_KEY + '_' + _blue_user_list[i]);
            }           
            // PANCHANGE_RED_USER_LIST(_room_number) && PANCHANGE_BLUE_USER_LIST(_room_number)
            await removeRedisInfo(pan_room_list_redis, redis_config.RED_USER_LIST_KEY + '_' + room_number);
            await removeRedisInfo(pan_room_list_redis, redis_config.BLUE_USER_LIST_KEY + '_' + room_number);      

            await removeRedisInfo(pan_room_list_redis, redis_config.BOARD_RED_PK_ARRAY + '_' + room_number);
            await removeRedisInfo(pan_room_list_redis, redis_config.BOARD_BLUE_PK_ARRAY + '_' + room_number);

            // 게임데이터 삭제
            // board list
            for(let i = 0; i < gameConf.BOARD_NUM; i ++)  {
                await removeRedisInfo(pan_room_list_redis, redis_config.BOARD_LIST + '_' + room_number + '_' + i);
            }   
            // red score / blue score
            await removeRedisInfo(pan_room_list_redis, redis_config.RED_SCORE + '_' + room_number);
            await removeRedisInfo(pan_room_list_redis, redis_config.BLUE_SCORE + '_' + room_number);
            // events detail 
            for(let i = 0; i < parseInt(_room_detail_info.event_num); i ++)
                for(let j = 0; j < parseInt(gameConf.EVENT_QUIZ_NUM); j ++) {
                    await removeRedisInfo(pan_room_list_redis, redis_config.EVENTS_DETAIL + '_' + room_number + '_' + i + '_' + j);
                }   
            // rank list & rank user detail
            let _red_rank_list = await getTeamRankList(pan_room_list_redis, room_number, 'RED');
            let _blue_rank_list = await getTeamRankList(pan_room_list_redis, room_number, 'BLUE');

            for(let i = 0; i < _red_rank_list.length; i ++)  {
                await removeRedisInfo(pan_room_list_redis, redis_config.RANK_USER_DETAIL + '_' + _red_rank_list[i]);
            }
            for(let i = 0; i < _blue_rank_list.length; i ++) {
                await removeRedisInfo(pan_room_list_redis, redis_config.RANK_USER_DETAIL + '_' + _blue_rank_list[i]);
            }
            await removeRedisInfo(pan_room_list_redis, redis_config.RED_RANK_LIST + '_' + room_number);
            await removeRedisInfo(pan_room_list_redis, redis_config.BLUE_RANK_LIST + '_' + room_number);

            resolve(res_code.SUCCESS);
        }
        catch(err22) {
            reject(err22);
        }
    });
}