'use strict';    
const redis_config = require('./../../config/redis.json')[process.env.NODE_ENV || 'development']['REDIS_KEY'];
const credis = require('./redis');
const { isEmpty, generateRoomNumber } = require('./../../utils/global');
const res_code = require('./../../config/res_code');

exports.removeRoomNo = function(room_number, setcoin_redis) {
    setcoin_redis.zrem(redis_config.ROOM_LIST_KEY, room_number, (err, res) => {
        if(err) {
            console.log("=================== 동전쌓기 방번호 삭제 오류1 ================", err);
            return;
        }
        if(res < 0) 
            console.log("=================== 동전쌓기 방번호 삭제 오류2 ================", err);
    });        
}

exports.removeRoomInRoomList = function(setcoin_redis, room_number) {
    return new Promise((resolve, reject) => {
        setcoin_redis.zrem(redis_config.ROOM_LIST_KEY, room_number, (err1, res1) => {
            if(err1) {
                reject(res_code.SETCOIN_GAME_DELETE_METHOD_FAIL);
                return;
            }
            resolve(res_code.SUCCESS);
        });
    });
}

exports.setUserScore = function(setcoin_redis, _user_key, _key, score = 0) {
    return new Promise((resolve, reject) => {
        setcoin_redis.zadd(_user_key, score, _key, (err1, res1) => {
            if(err1) {
                reject(res_code.SET_USER_SCORE_ERROR);
            }
            else {
                if(res1 < 0) {
                    reject(res_code.SET_USER_SCORE_ERROR);
                }
                else {
                    resolve(res_code.SUCCESS);
                }
            }
        });
    });
}

exports.getUserScore = function(setcoin_redis, _key, member) {
    return  new Promise((resolve, reject) => {
        setcoin_redis.zscore(_key, member, (err1, res1) => {
            if(err1) { 
                reject(res_code.GET_USER_SCORE_ERROR);
            }
            else {
                resolve(parseInt(res1));
            }
        });
    });
}

exports.getRoomDetail = function(setcoin_redis, room_number, key = null) {
    return new Promise((resolve, reject) => {
        if(!key) {
            setcoin_redis.hgetall(redis_config.ROOM_DETAIL_KEY + '_' + room_number, (err1, res1) => {
                if(err1) {
                    reject(res_code.GET_ROOM_DETAIL_FAIL);
                }
                else if(res1 <= 0 || isEmpty(res1)) {
                    resolve(null);
                }
                else 
                    resolve(res1);
            });     
        }
        else {
            setcoin_redis.hget(redis_config.ROOM_DETAIL_KEY + '_' + room_number, key, (err1, res1) => {
                if(err1) {
                    resolve(null);
                }
                else
                    resolve(res1);
            });
        }
    });
}

exports.setRoomDetailInfo = function(setcoin_redis, room_number, _room_detail_info) {    
    return new Promise((resolve, reject) => {
        setcoin_redis.hmset(redis_config.ROOM_DETAIL_KEY + '_' + room_number, _room_detail_info, (err1, res1) => {
            if(err1) {
                console.log("[[room_detail_info set err]] ======", err1);
                reject(res_code.ROOM_DETAIL_SET_FAIL)
                return;
            }
            if(res1 != 'OK') {
                reject(res_code.ROOM_DETAIL_SET_FAIL)
                return;
            }
            resolve(res_code.SUCCESS)
        }); 
    });
}

exports.setUserDetailInfo = function(setcoin_redis, session_id, _user_detail_info) {
    return new Promise((resolve, reject) => {
        setcoin_redis.hmset(redis_config.USER_DETAIL_KEY + '_' + session_id, _user_detail_info, (err1, res1) => {
            if(err1) {
                console.log("[[user_detail_info set err]] ======", err1);
                reject(res_code.SET_USER_DETAIL_FAIL);
                return;
            }
            if(res1 != 'OK') {
                reject(res_code.SET_USER_DETAIL_FAIL);
                return;
            }
            resolve(res_code.SUCCESS);
        });
    });
}

exports.getUserDetailInfo = function(setcoin_redis, session_id, key = null) {
    return new Promise((resolve, reject) => {
        if(!key) {
            setcoin_redis.hgetall(redis_config.USER_DETAIL_KEY + '_' + session_id, (err1, res1) => {
                if(err1) {
                    reject(res_code.GET_USER_DETAIL_FAIL);
                }
                else if(res1 <= 0 || isEmpty(res1)) {
                    resolve(null);
                }
                else
                    resolve(res1);
            });
        }
        else {
            setcoin_redis.hget(redis_config.USER_DETAIL_KEY + '_' + session_id, key, (err1, res1) => {
                if(err1) {
                    resolve(null);
                }
                else
                    resolve(res1);
            });
        }
    });
}

exports.getHashValue = function(setcoin_redis, _key, _member = null) {    
    return new Promise((resolve, reject) => {
        if(!_member) {
            setcoin_redis.hgetall(_key, (err1, res1) => {
                if(err1) {
                    reject(res_code.GET_HASH_VALUE_FAIL);
                }
                else if(res1 <= 0 || isEmpty(res1)) {
                    resolve(null);
                }
                else
                    resolve(res1);
            });
        }
        else {
            setcoin_redis.hget(_key, _member, (err1, res1) => {
                if(err1) {
                    resolve(null);
                }
                else
                    resolve(res1);
            });
        }
    });
}

exports.addUserList = function(setcoin_redis, room_number, session_id, insert_type = 1) {
    return new Promise((resolve, reject) => {
        if(insert_type == 2) {
            setcoin_redis.rpush(redis_config.USER_LIST_KEY + '_' + room_number, session_id, (err1, res1) => {
                if(err1) {
                    reject(res_code.GAME_ROOM_USER_ADD_FAIL);
                    return;
                }
                if(res1 < 0) {
                    reject(res_code.GAME_ROOM_USER_ADD_FAIL);
                    return;
                }
                resolve(res_code.SUCCESS);
            });
        }
        else {
            setcoin_redis.lpush(redis_config.USER_LIST_KEY + '_' + room_number, session_id, (err1, res1) => {
                if(err1) {
                    reject(res_code.GAME_ROOM_USER_ADD_FAIL);
                    return;
                }
                if(res1 < 0) {
                    reject(res_code.GAME_ROOM_USER_ADD_FAIL);
                    return;
                }
                resolve(res_code.SUCCESS);
            });
        }
    });  
}

/**
 * idx로 유저정보 가져오기
 * @param {*} setcoin_redis 레디스핸들러
 * @param {*} room_number   게임방번호  
 * @param {*} idx           인덱스
 */
exports.getSessionIdByIdx = function(setcoin_redis, room_number, idx) {
    return new Promise((resolve, reject) => {
        setcoin_redis.lrange(redis_config.USER_LIST_KEY + '_' + room_number, idx, idx, (err2, res2) => {
            if(err2 || res2 == null || res2.length < 1) {
                reject(res_code.GET_USER_IDX_FAIL);
                return;
            }
            resolve(res2[0]);
            return;
        });
    });
}

exports.setNicknameByIdx = function(setcoin_redis, room_number, idx, nickname) {
    return  new Promise((resolve, reject) => {    
        setcoin_redis.lset(redis_config.USER_LIST_KEY + '_' + room_number, idx, nickname, (err1, res1) => {
            if(err1) {
                console.log("[[setSocketIdByIdx]]===========", err1);
                reject(res_code.SET_USER_IDX_FAIL);
                return;
            }
            if(res1 != 'OK') {
                reject(res_code.SET_USER_IDX_FAIL);
                return;
            }
            resolve(res_code.SUCCESS);
            return;
        });
    });
}

exports.getUserSessionListInRoom = function(setcoin_redis, room_number) {
    return new Promise((resolve, reject) => {
        setcoin_redis.lrange(redis_config.USER_LIST_KEY + '_' + room_number, 0, -1, (err1, res1) => {
            if(err1 || res1 == null) {
                reject(res_code.GET_ROOM_USER_LIST_FAIL);
            }
            else {
                resolve(res1);
            }
        });
    });
}

exports.getUserSocketListInRoom = function(setcoin_redis, room_number) {

    return new Promise((resolve, reject) => {
        setcoin_redis.lrange(redis_config.USER_LIST_KEY + '_' + room_number, 0, -1, (err1, res1) => {
            if(err1 || res1 == null) {
                let _socket_list = [];
                // reject(res_code.GET_ROOM_USER_LIST_FAIL);
                resolve(_socket_list);
                return;
            }
            if(Array.isArray(res1) && res1.length == 0) {
                resolve([]);
                return;
            }
            let _socket_list = [], _cntRemain = res1.length;
            for(let i = 0; i < res1.length; i ++) {
                setcoin_redis.hget(redis_config.USER_DETAIL_KEY + '_' + res1[i], 'socket', (err2, res2) => {
                    if(err2) {
                    }
                    else {
                        _socket_list.push(res2);
                    }
                    _cntRemain --;
                    if(_cntRemain == 0) {
                        resolve(_socket_list);
                    }
                });
            }
        });
    });
}

exports.removeRedisInfo = function(setcoin_redis, _key) {
    return new Promise((resolve, reject) => {
        setcoin_redis.del(_key, (err1, res1) => {
            if(err1) {
                reject(res_code.SETCOIN_GAME_DELETE_METHOD_FAIL);
                return;
            }     
            resolve(res_code.SUCCESS);
        });
    });
}

exports.addDataToArray = function(setcoin_redis, _key, _data) {
    return new Promise((resolve, reject) => {
        setcoin_redis.rpush(_key, _data, (err1, res1) => {
            if(err1) {
                reject(res_code.ADD_TO_ARRAY_FAIL);
                return;
            }
            if(res1 < 0) {
                reject(res_code.ADD_TO_ARRAY_FAIL);
                return;
            }
            resolve(res_code.SUCCESS);
        });       
    });
}

exports.setHashValue = function(setcoin_redis, _key, _obj) {    
    return new Promise((resolve, reject) => {
        setcoin_redis.hmset(_key, _obj, (err1, res1) => {
            if(err1) {
                console.log("[[setHashValue err]] ======", err1);
                reject(res_code.SET_HASH_VALUE_FAIL)
                return;
            }
            if(res1 != 'OK') {
                reject(res_code.SET_HASH_VALUE_FAIL)
                return;
            }
            resolve(res_code.SUCCESS)
        }); 
    });
}

/**
 * idx로 요소값 가져오기
 */
exports.getValueByIdx = function(setcoin_redis, key, idx, length = 0) {
    return new Promise((resolve, reject) => {
        let r_index = idx;
        if(length > 0) {
            r_index = idx % length;
        }
        setcoin_redis.lrange(key, r_index, r_index, (err2, res2) => {
            if(err2 || res2 == null || res2.length < 1) {
                reject(res_code.GET_VALUE_BY_IDX);
                return;
            }
            resolve(res2[0]);
            return;
        });
    });
}

/**
 * score값 갱신
 */
exports.updateScore = function(setcoin_redis, key, member, update_score) {  
    return new Promise((resolve, reject) => {
        setcoin_redis.zincrby(key, update_score, member, (err1, res1) => {
            if(err1) {
                reject(res_code.SET_USER_SCORE_ERROR);
            }
            resolve(res1);
        });
    });
}

exports.removeInArray = function(setcoin_redis, key, element) {
    return new Promise((resolve, reject) => {
        setcoin_redis.lrem(key, 1, element, (err1, res1) => {
            if(err1) {
                reject(res_code.REMOVE_ELEMENT_IN_ARRAY_FAIL);
                return;
            }
            if(res1 <= 0) {
                reject(res_code.REMOVE_ELEMENT_IN_ARRAY_FAIL);
                return;
            }
            resolve(res_code.SUCCESS);
        });
    });
}

exports.getListFromArray = function(setcoin_redis, key) {
    return new Promise((resolve, reject) => {
        setcoin_redis.lrange(key, 0, -1, (err1, res1) => {
            if(err1 || res1 == null) {
                reject(res_code.GET_LIST_FROM_ARRAY_FAIL);
            }
            else {
                resolve(res1);
            }
        });
    });
}

exports.getAvailableRoomNumberList = function(setcoin_redis) {
    return  new Promise((resolve, reject) => {
        let _room_number_list = [];
        setcoin_redis.zrevrange(redis_config.ROOM_LIST_KEY, 0, -1, (err1, res1) => {
            if(res1 == null || err1) {
                resolve([]);
                return;
            }
            let length = res1.length;
            if(length == 0) {
                resolve([]);
                return;
            }

            for(let i = 0; i < res1.length; i ++) {
                setcoin_redis.hgetall(redis_config.ROOM_DETAIL_KEY + '_' + res1[i], (err2, res2) => {
                    if(err2) {
                        length -= 1;
                    }
                    else {
                        if(res2 <= 0 || isEmpty(res2)) {
                            length -= 1;
                        }
                        else {
                            if(!isEmpty(res2.room_number) && !isEmpty(res2.room_title) && !isEmpty(res2.host_name) && res2.is_single != '1' && res2.is_wait == 1) {
                                length -= 1;
                                _room_number_list.push(res2.room_number);
                            }
                            else {
                                length -= 1;
                            }
                        }
                    }

                    if(length == 0) {
                        resolve(_room_number_list);
                        return;
                    }
                });
            }
        });
    });
}

exports.getRoomNumberList = function(setcoin_redis) {
    return new Promise((resolve, reject) => {
        setcoin_redis.zrevrange(redis_config.ROOM_LIST_KEY, 0, -1, (err1, res1) => {
            if(res1 == null || err1) {
                reject(res_code.GET_ROOM_LIST_FAIL);
            }
            else {
                resolve(res1);
            }
        });
    });
}