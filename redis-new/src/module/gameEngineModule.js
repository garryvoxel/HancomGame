'use strict';

const { reject, concatSeries } = require('async');
const res_code = require('../../config/res_code');
const { isEmpty } = require('../../utils/global');

const redis_config = require('./../../config/redis.json')[process.env.NODE_ENV || 'development']['PANCHANGE_CHANNEL'];
// 랜덤 인덱스 Array 가져오기
exports.getRandomIndex = function(max, target) {
    var index = [];
    while (index.length < target) {
        var num = Math.floor(Math.random() * max);
        if (index.indexOf(num) < 0) {
            index.push(num);
        }
    }
    return index;    
}

exports.timeFormat = function(timestamp) {
    let date = new Date(timestamp * 1000);
    let ret = "";
    let y = date.getFullYear();
    let m = date.getMonth();
    let d = date.getDate();
    let h = date.getHours();
    let i = date.getMinutes();
    let s = date.getSeconds();

    ret += y;
    ret += "-";
    ret += ((m + 1) > 10) ? (m + 1) : ('0' + (m + 1));
    ret += "-";
    ret += (d > 10) ? (d) : ('0' + d);
    ret += " ";
    ret += (h > 10) ? (h) : ('0' + h);
    ret += ":";
    ret += (i > 10) ? (i) : ('0' + i);
    ret += ":";
    ret += (s > 10) ? (s) : ('0' + s);

    return ret;
}

/**
 * 소켓아이디 Rank 목록에 추가
 * @param {*} pan_room_list_redis       판뒤집기 레디스 핸들러 
 * @param {*} room_number               게임방 번호
 * @param {*} socket_id                 소켓 아이디
 * @param {*} color                     팀 컬러
 */
exports.addUserToRankList = function(pan_room_list_redis, room_number, socket_id, color, score = 0) {
    return new Promise((resolve, reject) => {
        let _rank_list_key = '';
        if(color == 'RED')
            _rank_list_key = redis_config.RED_RANK_LIST;
        else
            _rank_list_key = redis_config.BLUE_RANK_LIST;

        pan_room_list_redis.zadd(_rank_list_key + '_' + room_number, score, socket_id, (err1, res1) => {
            if(err1) {
                reject(res_code.PAN_GAME_RANK_LIST_ADD_FAIL);
            }
            else {
                if(res1 < 0) {
                    reject(res_code.PAN_GAME_RANK_LIST_ADD_FAIL);
                }
                else {
                    resolve(res_code.SUCCESS);
                }
            } 
        });
    });  
}


exports.addEventQuiz = function(pan_room_list_redis, room_number, event_id, idx, _data) {
    return new Promise((resolve, reject) => {
        pan_room_list_redis.hmset(redis_config.EVENTS_DETAIL + '_' + room_number + '_' + event_id + '_' + idx, _data, (err1, res1) => {
            if(err1) {
                reject(res_code.ADD_EVENT_QUIZ_FAIL);
                return;
            }
            if(res1 != 'OK') {
                reject(res_code.ADD_EVENT_QUIZ_FAIL);
                return;
            }
            //
            resolve(res_code.SUCCESS);
        });
    });
}


exports.getUserScore = function(pan_room_list_redis, room_number, socket_id, color) {
    return new Promise((resolve, reject) => {
        let target_key = '';
        if(color == 'RED')
            target_key = redis_config.RED_RANK_LIST + '_' + room_number;
        else
            target_key = redis_config.BLUE_RANK_LIST + '_' + room_number;

        pan_room_list_redis.zscore(target_key, socket_id, (err1, res1) => {
            if(err1) {
                reject(res_code.PAN_GAME_METHOD_FAIL);
            }
            else {
                resolve(parseInt(res1));
            }
        });
    });
}

/**
 * 
 * @param {*} type   1: board_list 2: red_score/blue_score  4: RANK_USER_DETAIL_socket_id (socket_id는 idx)
 * @param {*} pan_room_list_redis 
 * @param {*} room_number 
 * @param {*} event_time 
 * @param {*} idx 
 * @param {*} _key 
 */

exports.getGameDataObject = function(type, pan_room_list_redis, room_number, event_id, idx, color = '', _key = null) {
    return new Promise((resolve, reject) => {
        let target_key = '';
        if(type == 1)
            target_key = redis_config.BOARD_LIST + '_' + room_number + '_' + idx;
        else if(type == 2) {
            if(color == 'RED')
                target_key = redis_config.RED_SCORE + '_' + room_number;
            else
                target_key = redis_config.BLUE_SCORE + '_' + room_number;
        }
        else if(type == 3) {
            target_key = redis_config.EVENTS_DETAIL + '_' + room_number + '_' + event_id + '_' + idx;
        }
        else if(type = 4) {
            target_key = redis_config.RANK_USER_DETAIL + '_' + idx;
        }

        if(type != 2) {
            if(!_key) {
                pan_room_list_redis.hgetall(target_key, (err1, res1) => {
                    if(err1) {
                        reject(res_code.PAN_GAME_METHOD_FAIL);
                    }
                    else if(res1 <= 0 || isEmpty(res1)) {
                        reject(res_code.PAN_GAME_METHOD_FAIL);
                    }
                    else
                        resolve(res1);
                });
            }
            else {
                pan_room_list_redis.hget(target_key, _key, (err1, res1) => {
                    if(err1) {
                        reject(res_code.PAN_GAME_METHOD_FAIL);
                    }
                    else if(res1 == null) {
                        reject(res_code.PAN_GAME_METHOD_FAIL);
                    }
                    else
                        resolve(res1);
                });
            }
        }
        else {
            pan_room_list_redis.zscore(target_key, _key, (err1, res1) => {
                if(err1) {
                    reject(res_code.PAN_GAME_METHOD_FAIL);
                }
                else {
                    resolve(parseInt(res1));
                }
            });
        }
    });    
}


/**
 * type: 1 - board_list  2 - red_score 3 - events_detail 4: RANK_USER_DETAIL_socket_id (socket_id는 idx) 
 * @param {*} type 
 * @param {*} pan_room_list_redis 
 * @param {*} room_number 
 * @param {*} event_id 
 * @param {*} idx 
 * @param {*} color 
 * @param {*} _data 
 */
exports.setGameDataObject = function(type, pan_room_list_redis, room_number, event_id, idx, color = '', _data) {
    return new Promise((resolve, reject) => {
        let target_key = '';
        if(type == 1) 
            target_key = redis_config.BOARD_LIST + '_' + room_number + '_' + idx;
        else if(type == 2) {
            if(color == 'RED')
                target_key = redis_config.RED_SCORE + '_' + room_number;
            else
                target_key = redis_config.BLUE_SCORE + '_' + room_number;
        }
        else if(type == 3) {
            target_key = redis_config.EVENTS_DETAIL + '_' + room_number + '_' + event_id + '_' + idx;
        }
        else if(type == 4) {
            target_key = redis_config.RANK_USER_DETAIL + '_' + idx;
        }

        if(type == 1 || type == 3 || type == 4) {
            pan_room_list_redis.hmset(target_key , _data, (err1, res1) => {
                if(err1) {
                    reject(res_code.PAN_GAME_METHOD_FAIL);
                }
                else if(res1 != 'OK') {
                    reject(res_code.PAN_GAME_METHOD_FAIL);
                }
                else {
                    resolve(res_code.SUCCESS);
                }   
            });
        }
        else {
            pan_room_list_redis.zadd(target_key, idx, event_id, (err1, res1) => {
                if(err1) {
                    reject(res_code.PAN_GAME_METHOD_FAIL);
                }
                else {
                    if(res1 < 0) {
                        reject(res_code.PAN_GAME_METHOD_FAIL);
                    }
                    else {
                        resolve(res_code.SUCCESS);
                    }
                } 
            });
        }
    });
}

/**
 * 
 * @param {*} pan_room_list_redis 
 * @param {*} room_number 
 * @param {*} event_id 
 * @param {*} quiz_id 
 */
exports.getQuiz = function(pan_room_list_redis, room_number, event_id , quiz_id) {
    return new Promise((resolve, reject) => {
        pan_room_list_redis.hgetall(redis_config.EVENTS_DETAIL + '_' + room_number + '_' + event_id + '_' + quiz_id, (err1, res1) => {
            if(err1)            {
                reject(res_code.GET_QUIZ_FAIL);
            }
            else if(res1 <= 0) {
                reject(res_code.GET_QUIZ_FAIL);
            }
            else 
                resolve(res1);
        });
    });
}

/**
 * 
 * @param {*} pan_room_list_redis 
 * @param {*} room_number 
 * @param {*} socket_id 
 * @param {*} color 
 * @param {*} update_score 
 */
exports.updateRankScore = function(pan_room_list_redis, room_number, member, color, update_score, type = 1) {
    return new Promise((resolve, reject) => {
        let _redis_key = '';
        if(type == 1) {
            if(color == 'RED')
                _redis_key = redis_config.RED_RANK_LIST + '_' + room_number;
            else    
                _redis_key = redis_config.BLUE_RANK_LIST + '_' + room_number;
        }
        else {
            if(color == 'RED')
                _redis_key = redis_config.RED_SCORE + '_' + room_number;
            else 
                _redis_key = redis_config.BLUE_SCORE + '_' + room_number;
        }
        pan_room_list_redis.zincrby(_redis_key, update_score, member, (err1, res1) => {
            if(err1)     {
                reject(res_code.PAN_GAME_METHOD_FAIL);
            }
            else if(res1 < 0) {
                reject(res_code.PAN_GAME_METHOD_FAIL);
            }
            else {
                resolve(res_code.SUCCESS);   
            }
        });
    });
}

exports.getTeamRankList = function(pan_room_list_redis, room_number, color) {
    return new Promise((resolve, reject) => {
        let _redis_key = '';
        if(color == 'RED')
            _redis_key = redis_config.RED_RANK_LIST + '_' + room_number;
        else    
            _redis_key = redis_config.BLUE_RANK_LIST + '_' + room_number;
        pan_room_list_redis.zrevrange(_redis_key, 0, -1, (err1, res1) => {
            if(err1) {
                reject(res_code.PAN_GAME_RANK_LIST_GET_FAIL);
                return;
            }
            if(res1 == null) {
                reject(res_code.PAN_GAME_RANK_LIST_GET_FAIL);
                return;
            }
            resolve(res1);
        });
    });
}

exports.calcPoint = function(win_team, current_team, rank, member_num, current_num, update_time) {
    const score = {
        'N2': [30],
        'N10': [45, 36, 18, 18, 18],
        'N20': [66, 60, 57, 45, 45, 24, 24, 24, 24, 24],
        'N40': [96, 87, 75, 60, 60, 60, 60, 60, 60, 60,
            42, 42, 42, 42, 42, 42, 42, 42, 42, 42
        ],
        'N60': [150, 138, 123, 105, 105, 105, 105, 105, 105, 105,
            84, 84, 84, 84, 84, 84, 84, 84, 84, 84,
            60, 60, 60, 60, 60, 60, 60, 60, 60, 60
        ],
        'N100': [240, 225, 204, 177, 177, 177, 177, 177, 177, 177,
            147, 147, 147, 147, 147, 147, 147, 147, 147, 147,
            117, 117, 117, 117, 117, 117, 117, 117, 117, 117,
            84, 84, 84, 84, 84, 84, 84, 84, 84, 84,
            84, 84, 84, 84, 84, 84, 84, 84, 84, 84
        ]
    }    
    let ret = 0;
    if(win_team == 'DRAW') {
        ret = Math.ceil(score['N' + member_num][rank - 1] * 0.8);
    } else if(win_team == current_team) {
        ret = score['N' + member_num][rank - 1];
    } else {
        ret = Math.ceil(score['N' + member_num][rank - 1] * 0.7);
    }
    
    let plaingTime = Math.floor(Date.now() / 1000) - update_time;

    let gameTime = 180;
    if(plaingTime > gameTime) {
        plaingTime = gameTime;
    }

    ret = Math.ceil(ret * (current_num / member_num) * (plaingTime / gameTime));

    return ret;
}


