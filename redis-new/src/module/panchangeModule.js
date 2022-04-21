'use strict';    
var async = require('async');
const redis_config = require('./../../config/redis.json')[process.env.NODE_ENV || 'development']['PANCHANGE_CHANNEL'];
const res_code = require('./../../config/res_code');
const { isEmpty } = require('../../utils/global');
// 판뒤집기 레디스 기본 모듈 정의
exports.removeRoomNo = function(room_number, pan_room_list_redis) {
    pan_room_list_redis.zrem(redis_config.ROOM_LIST_KEY, room_number, (err, res) => {
        if(err) {
            console.log("=================== 판뒤집기 방번호 삭제 오류1 ================", err);
            return;
        }
        if(res < 0) 
            console.log("=================== 판뒤집기 방번호 삭제 오류2 ================", err);
    });        
}

/**
 * 클랜 게임방 생성
 * @param {*} pan_room_list_redis  판뒤집기 레디스 핸들러
 * @param {*} room_number          방번호
 * @param {*} host_name            방장 닉네임 
 * @param {*} is_lock              비밀방 여부 0/1
 * @param {*} room_title           방제목
 * @param {*} user_max_count       게임방 인원수 
 * @param {*} is_clan              클랜방 여부 0/1
 * @param {*} ip                   판뒤집기 서버 도메인
 * @param {*} back_ground          게임방 배경색
 * @param {*} play_time            게임 플레이 시간 
 * @param {*} clan_name_A          red팀 클랜명
 * @param {*} clan_name_B          blue팀 클랜명 (default = "")
 * @param {*} password             비밀방인 경우 비번
 * @param {*} callback           
 */
function create_clan_room(pan_room_list_redis, room_number, host_name, is_lock, room_title, user_max_count, is_clan, ip, back_ground, play_time, clan_name_A, clan_name_B, password, callback) {   
    console.log("=========클랜대전 방생성=========");
    let _create_room_time_stamp = Math.floor(Date.now() / 1000);
    
    async.waterfall([
        function(callback1) {
            pan_room_list_redis.zrevrange(redis_config.ROOM_LIST_KEY, 0, -1, (err, res) => {
                if(err) {
                    callback1(null, res_code.GET_ROOM_LIST_FAIL, null)
                    return;
                }
                if(res == null)
                    callback1(null, res_code.SUCCESS, []);
                else
                    callback1(null, res_code.SUCCESS, res);
            });
        },
        function(err, data, callback1) {
            console.log("======클랜대전 방생성 시 방번호 목록======", data);
            if(err != res_code.SUCCESS) {
                callback1(null, err);
                return;
            }
            let _length = data.length;
            if(data.length == 0)
                callback1(null, res_code.SUCCESS);
            else {
                let is_prev_clan = false;
                for(let i = 0; i < data.length; i ++) {
                    pan_room_list_redis.hgetall(redis_config.ROOM_DETAIL_KEY + '_' + data[i], (err1, res) => {
                        if(err1)
                            _length -= 1;          
                        else if(res <= 0 || isEmpty(res))
                            _length -= 1;
                        else {
                            _length -= 1;
                            if(res.is_clan) {
                                if (!isEmpty(res.clan_name_B)) {
                                    if (res.clan_name_B === clan_name_A) {
                                        is_prev_clan = true;
                                        return;
                                    }
                                } else if(!isEmpty(res.clan_name_A)) {
                                    if (res.clan_name_A === clan_name_A) {
                                        is_prev_clan = true;
                                        return;
                                    }
                                }
                                console.log("클랜 조건 만족");
                            }
                        }
                        if(_length == 0)  {
                            if(is_prev_clan) {
                                callback1(null, res_code.ALREADY_CLAN_CREATED);
                                return;
                            }
                            callback1(null, res_code.SUCCESS);
                            return;
                        }
                    });
                }
            }
        },
        //방번호 저장하기
        function(err, callback1) {
            if(err != res_code.SUCCESS) {
                callback1(null, err);
                return;
            }
            pan_room_list_redis.zadd(redis_config.ROOM_LIST_KEY, _create_room_time_stamp, room_number, (err1, res) => {
                if(err1) {
                    console.log("=======클랜방 번호 저장 오류========", err1);
                    callback1(null, res_code.CREATE_CLAN_ROOM_NUMBER_FAIL);
                    return;
                }       
                else {
                    if(res < 0) {
                        callback1(null, res_code.CREATE_CLAN_ROOM_NUMBER_FAIL);
                        return;
                    } else {
                        callback1(null, res_code.SUCCESS);
                        return;
                    }
                }
            });  
        },
        //방장 호스트 정보 저장하기 
        function(err, callback1) {

            if(err != res_code.SUCCESS) {
                callback1(null, err);
                return;
            }

            let _host = {
                "room_number": room_number    
            };
            pan_room_list_redis.hmset(redis_config.ROOM_HOST_KEY + '_' + host_name, _host, (err1, res) => {
                if(err1) {
                    console.log("=======클랜방 호스트정보 저장 오류========", err1);
                    callback1(null, res_code.CREATE_CLAN_ROOM_HOST_FAIL);
                    return;
                }
                if(res != 'OK') {
                    callback1(null, res_code.CREATE_CLAN_ROOM_HOST_FAIL);
                    return;
                }
                callback1(null, res_code.SUCCESS);
                return;
            });
        },
        //클랜이름으로 방번호 저장하기
        function(err, callback1) {

            if(err != res_code.SUCCESS) {
                callback1(null, err);
                return;
            }

            let _clan_name = {
                "room_number": room_number    
            };

            pan_room_list_redis.hmset(redis_config.CLAN_NAME_KEY + '_' + clan_name_A, _clan_name, (err1, res) => {
                if(err1) {
                    console.log("=======클랜방 클랜이름에 룸번호 저장 오류========", err1);
                    callback1(null, res_code.CREATE_CLAN_ROOM_CLANINFO_FAIL);
                    return;
                }
                if(res != 'OK') {
                    callback1(null, res_code.CREATE_CLAN_ROOM_CLANINFO_FAIL);
                    return;
                }
                callback1(null, res_code.SUCCESS);
                return;
            }); 
        },
        //룸 디테일 정보 저장하기
        function(err, callback1) {

            if(err != res_code.SUCCESS) {
                callback1(null, err);
                return;
            }

            let r_value = {
                "room_number": room_number,
                "host_name": host_name,
                "is_lock": is_lock,
                "room_title": room_title,
                "ip": ip,
                "play_time": play_time,
                "back_ground": back_ground,
                "clan_name_A": clan_name_A,
                "clan_name_B": "",
                "is_clan": is_clan,
                "user_max_count": user_max_count,
                "current_user_count": 0,
                "is_battle_clan": false,
                "battle_clan_name": "",
                "is_play": 0,
                'password': password,
                'status': 0,
                "pk_clan": clan_name_A,
                "a_clan": clan_name_A,
                "b_clan": "",
                "event_num": 0
            };

            r_value['create_time'] = r_value['update_time'] = Math.floor(Date.now() / 1000);
            
            pan_room_list_redis.hmset(redis_config.ROOM_DETAIL_KEY + '_' + room_number, r_value, (err1, res) => {
                if(err1) {
                    console.log("=======클랜방 룸디테일 정보 저장 오류========", err1);           
                    callback1(null, res_code.CREATE_CLAN_ROOM_DETAIL_FAIL);
                    return;
                }
                if(res != 'OK') {
                    callback1(null, res_code.CREATE_CLAN_ROOM_DETAIL_FAIL);
                    return;
                }
                callback1(null, res_code.SUCCESS);
                return;
            });
        }
    ], function(err, _res_code) {
        // console.log('====create clan room err code====', err);
        // console.log('====create clan room result====', result);
        callback(_res_code);
    });
}

/**
 * 자유대전 게임방 생성
 * @param {*} pan_room_list_redis   판뒤집기레디스 핸들러
 * @param {*} room_number           게임방 번호
 * @param {*} host_name             호스트 닉네임
 * @param {*} is_lock               비밀방 여부
 * @param {*} room_title            게임방 제목
 * @param {*} user_max_count        게임방 인원수 
 * @param {*} is_clan               클랜 게임방 여부
 * @param {*} ip                    판뒤집기 게임 서버 도메인
 * @param {*} back_ground           게임방 배경색
 * @param {*} play_time             게임방 플레이 시간
 * @param {*} password              비번
 * @param {*} callback 
 */
function create_free_room(pan_room_list_redis, room_number, host_name, is_lock, room_title, user_max_count, is_clan, ip, back_ground, play_time, password, callback) {
    console.log("=========자유대전 방생성=========");
    let _create_room_time_stamp = Math.floor(Date.now() / 1000);
    pan_room_list_redis.zadd(redis_config.ROOM_LIST_KEY, _create_room_time_stamp, room_number, (err, res) => {
        if(err) {
            console.log(err);
            callback(res_code.CREATE_FREE_ROOM_NUMBER_FAIL);
            return;
        } 
        //호스트 네임을 키로 방번호 저장한다.
        let _host = {
            "room_number": room_number
        };
        pan_room_list_redis.hmset(redis_config.ROOM_HOST_KEY + '_' + host_name, _host, (err1, res1) => {
            if(err1) {
                console.log("=================== 판뒤집기 방번호 생성 오류1 ================", err1)
                callback(res_code.CREATE_FREE_ROOM_HOST_FAIL);
                return; 
            }
            if(res1 != 'OK') {
                callback(res_code.CREATE_FREE_ROOM_HOST_FAIL);
                return;
            }
            //룸 디테일 정보 저장
            let r_value = {
                'room_number': room_number,
                'host_name': host_name,
                'is_lock' : is_lock,
                'room_title': room_title,
                'ip': ip,
                'play_time': play_time,
                'back_ground': back_ground,
                'clan_name_A': '',
                'clan_name_B': '',
                'is_clan': is_clan,
                'user_max_count': user_max_count,
                'current_user_count': 0,
                'is_play': 0,
                'password': password,
                'status': 0,
                "pk_clan": '',
                "a_clan": '',
                "b_clan": '',
                "event_num": 0
            };
            r_value['create_time'] = r_value['update_time'] = Math.floor(Date.now() / 1000);
            
            pan_room_list_redis.hmset(redis_config.ROOM_DETAIL_KEY + '_' + room_number, r_value, (err2, res2) => {
                if(err2) {
                    console.log("=================== 판뒤집기 방번호 생성 오류2 ================", err2)
                    callback(res_code.CREATE_FREE_ROOM_DETAIL_FAIL);
                    return;
                }
                if(res2 != 'OK') {
                    callback(res_code.CREATE_FREE_ROOM_DETAIL_FAIL);
                    return;
                }
                callback(res_code.SUCCESS);
            });
        });
    });
}

/**
 * 게임방 생성 (자유대전 게임방 + 클랜 게임방)
 * @param {*} pan_room_list_redis   판뒤집기 게임 핸들러
 * @param {*} room_number           게임방 번호
 * @param {*} host_name             방장 닉네임
 * @param {*} is_lock               비밀방 여부 1/0           
 * @param {*} room_title            게임방 제목
 * @param {*} user_max_count        게임방 인원수
 * @param {*} is_clan               클랜방 여부
 * @param {*} ip                    판뒤집기 게임 도메인 
 * @param {*} back_ground           게임방 배경색
 * @param {*} play_time             게임방 플레이 시간
 * @param {*} clan_name_A           게임방 RED팀 클랜명
 * @param {*} clan_name_B           게임방 BLUE팀 클랜명
 * @param {*} password              비번
 * @param {*} callback 
 */
exports.generateRoom = async function(pan_room_list_redis, room_number, host_name, is_lock, room_title, user_max_count, is_clan, ip, back_ground, play_time, clan_name_A, clan_name_B, password, callback) {        
    if(is_clan == "1") {
        create_clan_room(pan_room_list_redis, room_number, host_name, is_lock, room_title, user_max_count, is_clan, ip, back_ground, play_time, clan_name_A, clan_name_B, password, (err) => {
            callback(err);
            return;
        });
    }
    else {
        create_free_room(pan_room_list_redis, room_number, host_name, is_lock, room_title, user_max_count, is_clan, ip, back_ground, play_time, password, (err) => {
            callback(err);
            return;
        });    

    }
}

/**
 * RED팀 인원수 가져오기
 * @param {*} pan_room_list_redis 
 * @param {*} room_number    방번호
 */
exports.getRedUserCount = function(pan_room_list_redis, room_number) {
    return new Promise((resolve, reject) => {
        pan_room_list_redis.llen(redis_config.RED_USER_LIST_KEY + '_' + room_number, (err1 , res1) => {
            if(err1) {
                console.log("getRedUserCount ======", err1);
                reject(res_code.PAN_GAME_ROOM_COUNT_GET_FAIL);
            }
            resolve(res1);
        });
    });
}

/**
 * BLUE팀 인원수 가져오기
 * @param {*} pan_room_list_redis 
 * @param {*} room_number  방번호
 */
exports.getBlueUserCount = function(pan_room_list_redis, room_number) {
    return new Promise((resolve, reject) => {
        pan_room_list_redis.llen(redis_config.BLUE_USER_LIST_KEY + '_' + room_number, (err1 , res1) => {
            if(err1) {
                console.log("getBlueUserCount ======", err1);
                reject(res_code.PAN_GAME_ROOM_COUNT_GET_FAIL);
            }
            resolve(res1);
        });
    });
}

/**
 * 유저 게임방에 추가
 * @param {*} pan_room_list_redis 
 * @param {*} room_number       게임방 번호
 * @param {*} socket_id         소켓 아이디
 * @param {*} data              유저 데이터
 * @param {*} color             유저 팀 컬러
 * @param {*} callback 
 */
exports.addUserToRoom = function(pan_room_list_redis, room_number, socket_id, data, color) {

    return new Promise((resolve, reject) => {
        let _key = '';
        if(color == 'RED') {
            _key = redis_config.RED_USER_LIST_KEY + '_' + room_number;
            data['COLOR'] = 'RED';
        }
        if(color == 'BLUE')  {
            _key = redis_config.BLUE_USER_LIST_KEY + '_' + room_number;
            data['COLOR'] = 'BLUE';
        }
        // let user_time_stamp = Math.floor(Date.now() / 1000);

        pan_room_list_redis.rpush(_key, socket_id, (err1, res1) => {
            if(err1) {
                console.log("addUserToRoom1 ====== ", err1);
                reject(res_code.PAN_GAME_ROOM_USER_ADD_FAIL)
                return;
            }
            if(res1 < 0) {
                reject(res_code.PAN_GAME_ROOM_USER_ADD_FAIL);
                return;
            }
            // 
            pan_room_list_redis.hmset(redis_config.USER_DETAIL_KEY + '_' + socket_id, data, (err2, res2) => {
                if(err2) {
                    console.log("addUserToRoom2 ====== ", err2);
                    reject(res_code.PAN_GAME_ROOM_USER_ADD_FAIL);
                    return;
                }
                if(res2 != 'OK') {
                    reject(res_code.PAN_GAME_ROOM_USER_ADD_FAIL);
                    return;
                }
                // add socket key - room number value
                let socket_info = {
                    room_number: room_number
                };
                pan_room_list_redis.hmset(redis_config.SOCKET_ROOM_KEY + '_' + data.SOCKET, socket_info, (err3, res3) => {
                    if(err3) {
                        console.log("addUserToRoom3 ====== ", err3);
                        reject(res_code.PAN_GAME_ROOM_USER_ADD_FAIL);
                        return;
                    }
                    if(res3 != 'OK') {
                        reject(res_code.PAN_GAME_ROOM_USER_ADD_FAIL);    
                        return;
                    }
                    resolve(res_code.SUCCESS);
                    return;
                });
            });
        })
    });
}

/**
 * 게임방 디테일 정보 가져오기
 * @param {*} pan_room_list_redis 
 * @param {*} room_number 방번호
 */
exports.getRoomDetail = function(pan_room_list_redis, room_number, key = null) {
    return new Promise((resolve, reject) => {
        if(!key) {
            pan_room_list_redis.hgetall(redis_config.ROOM_DETAIL_KEY + '_' + room_number, (err1, res1) => {
                if(err1) {
                    reject(res_code.GET_ROOM_DETAIL_FAIL);
                }
                else if(res1 <= 0 || isEmpty(res1)) {
                    reject(res_code.GET_ROOM_DETAIL_FAIL);
                }
                else 
                    resolve(res1);
            });     
        }
        else {
            pan_room_list_redis.hget(redis_config.ROOM_DETAIL_KEY + '_' + room_number, key, (err1, res1) => {
                if(err1) {
                    reject(res_code.GET_ROOM_DETAIL_FAIL);
                }
                else
                    resolve(res1);
            });
        }
    });
}

/**
 * 게임방 상세정보 설정
 * @param {*} pan_room_list_redis   판뒤집기 레디스 핸들러 
 * @param {*} room_number           게임방 번호
 * @param {*} _room_detail_info     게임방 디테일 정보 
 */
exports.setRoomDetailInfo = function(pan_room_list_redis, room_number, _room_detail_info) {    
    return new Promise((resolve, reject) => {
        pan_room_list_redis.hmset(redis_config.ROOM_DETAIL_KEY + '_' + room_number, _room_detail_info, (err1, res1) => {
            if(err1)    {
                console.log("room_detail_info set error======", err1);
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

/**
 * 유저 상세 정보 설정
 * @param {*} pan_room_list_redis       판뒤집기 레디스 핸들러
 * @param {*} socket_id                 소켓 아이디
 * @param {*} _user_detail_info         유저 디테일 정보
 */
exports.setUserDetailInfo = function(pan_room_list_redis, socket_id, _user_detail_info) {
    return new Promise((resolve, reject) => {
        pan_room_list_redis.hmset(redis_config.USER_DETAIL_KEY + '_' + socket_id, _user_detail_info, (err1, res1) => {
            if(err1) {
                reject(res_code.PAN_GAME_ROOM_USER_ADD_FAIL);
                return;
            }
            if(res1 != 'OK') {
                reject(res_code.PAN_GAME_ROOM_USER_ADD_FAIL);
                return;
            }
            resolve(res_code.SUCCESS);
        });
    });
}

exports.setSocketRoomInfo = function(pan_room_list_redis, socket_id, _data) {
    return new Promise((resolve, reject) => {
        pan_room_list_redis.hmset(redis_config.SOCKET_ROOM_KEY + '_' + socket_id, _data, (err1, res1) => {
            if(err1) {
                reject(res_code.PAN_GAME_METHOD_FAIL);
                return;
            }
            if(res1 != 'OK') {
                reject(res_code.PAN_GAME_METHOD_FAIL);
                return;
            }
            resolve(res_code.SUCCESS);
        });
    });
}
/**
 * 
 * @param {*} pan_room_list_redis   판뒤집기 레디스 핸들러
 * @param {*} socket_id             소켓 아이디
 * @param {*} key                   키
 */
exports.getUserDetailInfo = function(pan_room_list_redis, socket_id, key = null) {
    return new Promise((resolve, reject) => {
        if(!key) {
            pan_room_list_redis.hgetall(redis_config.USER_DETAIL_KEY + '_' + socket_id, (err1, res1) => {
                if(err1) {
                    reject(res_code.PAN_GAME_USER_DETAIL_FAIL);
                }
                else if(res1 <= 0 || isEmpty(res1)) {
                    reject(res_code.PAN_GAME_USER_DETAIL_FAIL);
                }
                else
                    resolve(res1);
            });
        }
        else {
            pan_room_list_redis.hget(redis_config.USER_DETAIL_KEY + '_' + socket_id, key, (err1, res1) => {
                if(err1) {
                    reject(res_code.PAN_GAME_USER_DETAIL_FAIL);
                }
                else
                    resolve(res1);
            });
        }
    });
}

/**
 * 팀목록에서 유저정보 삭제
 * @param {*} pan_room_list_redis       판뒤집기 레디스 핸들러
 * @param {*} room_number               게임방 번호 
 * @param {*} socket_id                 삭제하려는 유저 소켓아이디
 * @param {*} color                     팀 컬러
 */
exports.removeUserList = function(pan_room_list_redis, room_number, socket_id, color) {
    return new Promise((resolve, reject) => {
        let _user_list_key = '';
        if(color == 'RED')
            _user_list_key = redis_config.RED_USER_LIST_KEY;
        else 
            _user_list_key = redis_config.BLUE_USER_LIST_KEY;
        pan_room_list_redis.lrem(_user_list_key + '_' + room_number, 1, socket_id, (err1, res1) => {
            if(err1) {
                reject(res_code.PAN_GAME_USER_DELETE_FAIL);
                return;
            }
            if(res1 <= 0) {
                reject(res_code.PAN_GAME_USER_DELETE_FAIL);
                return;
            }
            resolve(res_code.SUCCESS);
        });
    });
}

/**
 * 유저 상세 정보 삭제
 * @param {*} pan_room_list_redis 
 * @param {*} socket_id  삭제하려는 유저 소켓아이디
 */
exports.removeUserDetail = function(pan_room_list_redis, socket_id) {
    return new Promise((resolve, reject) => {
        pan_room_list_redis.del(redis_config.USER_DETAIL_KEY + '_' + socket_id, (err1, res1) => {
            if(err1) {
                reject(res_code.PAN_GAME_USER_DELETE_FAIL);
                return;
            }
            if(res1 < 0) {
                reject(res_code.PAN_GAME_USER_DELETE_FAIL);
                return;
            }
            resolve(res_code.SUCCESS);
        });
    })
}

/**
 * 유저 소켓아이디 삭제
 * @param {*} pan_room_list_redis 
 * @param {*} socket_id                 삭제하려는 유저 소켓 아이디 
 */
exports.removeUserSocketRoom = function(pan_room_list_redis, socket_id) {
    return new Promise((resolve, reject) => {
        pan_room_list_redis.del(redis_config.SOCKET_ROOM_KEY + '_' + socket_id, (err1, res1) => {
            if(err1) {
                reject(res_code.PAN_GAME_USER_DELETE_FAIL);
                return;
            }
            if(res1 < 0) {
                reject(res_code.PAN_GAME_USER_DELETE_FAIL);
                return;
            }
            resolve(res_code.SUCCESS);
        });
    });
}

/**
 * 유저정보 팀 리스트에 추가
 * @param {*} pan_room_list_redis   판뒤집기 레디스 핸들러 
 * @param {*} room_number           게임방번호
 * @param {*} socket_id             소켓 아이디
 * @param {*} color                 팀컬러
 * @param {*} insert_type           1: list index-0 에 추가 2: list index - length 에 추가
 */
exports.addUserList = function(pan_room_list_redis, room_number, socket_id, color, insert_type = 1) {
    return new Promise((resolve, reject) => {
        let _user_list_key = '';
        if(color == 'RED')
            _user_list_key = redis_config.RED_USER_LIST_KEY;
        else 
            _user_list_key = redis_config.BLUE_USER_LIST_KEY;
        if(insert_type == 2) {
            pan_room_list_redis.rpush(_user_list_key + '_' + room_number, socket_id, (err1, res1) => {
                if(err1) {
                    reject(res_code.PAN_GAME_ROOM_USER_ADD_FAIL);
                    return;
                }
                if(res1 < 0) {
                    reject(res_code.PAN_GAME_ROOM_USER_ADD_FAIL);
                    return;
                }
                resolve(res_code.SUCCESS);
            });
        }
        else {
            pan_room_list_redis.lpush(_user_list_key + '_' + room_number, socket_id, (err1, res1) => {
                if(err1) {
                    reject(res_code.PAN_GAME_ROOM_USER_ADD_FAIL);
                    return;
                }
                if(res1 < 0) {
                    reject(res_code.PAN_GAME_ROOM_USER_ADD_FAIL);
                    return;
                }
                resolve(res_code.SUCCESS);
            });
        }
    })
}

/**
 * 유저 정보 검색
 * @param {*} pan_room_list_redis       판뒤집기 게임 핸들러
 * @param {*} room_number               게임방 번호
 * @param {*} search_key                검색 키 
 * @param {*} search_type 1: 닉네임 2: 세션ID 3: 소켓 아이디
 * return err, data, is_exist
 */
exports.findUser = function(pan_room_list_redis, room_number, search_key, search_type, callback) {
    if(search_type == 3) { // socket id
        pan_room_list_redis.hgetall(redis_config.USER_DETAIL_KEY + '_' + search_key, (err2, res2) => {
            if(err2) {
                callback(res_code.PAN_GAME_USER_DETAIL_FAIL, null, false);
                return;
            }
            if(res2 <= 0 || isEmpty(res2)) {
                callback(res_code.SUCCESS, null, false);
                return;
            }
            callback(res_code.SUCCESS, res2, true);
        });
    }
    else if(search_type == 1 || search_type == 2) { // nickname or uuid
        async.waterfall([
            function(callback1) {
                pan_room_list_redis.lrange(redis_config.RED_USER_LIST_KEY + '_' + room_number, 0, -1, (err2, res2) => {
                    if(err2 || res2 == null) {
                        callback1(null, res_code.PAN_GAME_ROOM_RED_USER_FAIL, null, false);
                        return;
                    }
                    let _passed_len = 0, _is_exist = false;
                    if(res2.length == 0) {
                        callback1(null, res_code.SUCCESS, null, false);
                    }
                    else {
                        for(let i = 0; i < res2.length; i ++) {
                            pan_room_list_redis.hgetall(redis_config.USER_DETAIL_KEY + '_' + res2[i], (err3, res3) => {
                                if(err3 || res3 <= 0 || isEmpty(res3)) {
                                    _passed_len ++;
                                }
                                else {
                                    _passed_len ++;
                                    
                                    if( (search_type == 2 && res3.PK == search_key) 
                                    ||  (search_type == 1 && res3.NICKNAME == search_key)) {
                                        _is_exist = true;
                                        callback1(null, res_code.SUCCESS, res3, true);   
                                    }
                                }       
    
                                if(_passed_len == res2.length && !_is_exist) {
                                    callback1(null, res_code.SUCCESS, null, false);
                                }
                            });
                        }
                    }
                });
            },
            function(_res_code, _data, _is_exist, callback1) {
                if(_res_code != res_code.SUCCESS) {
                    callback1(null, _res_code, null, false);
                    return;
                }
                if(_res_code == res_code.SUCCESS && _is_exist) {
                    callback1(null, _res_code, _data, true);
                    return;
                }
                // blue user에 대한 체크
                pan_room_list_redis.lrange(redis_config.BLUE_USER_LIST_KEY + '_' + room_number, 0, -1, (err2, res2) => {
                    if(err2 || res2 == null) {
                        callback1(null, res_code.PAN_GAME_ROOM_BLUE_USER_FAIL, null, false);
                        return;
                    }
                    let _passed_len = 0, __is_exist = false;
                    if(res2.length == 0) {
                        callback1(null, res_code.SUCCESS, null, false);
                    }
                    else {
                        for(let i = 0; i < res2.length; i ++) {
                            pan_room_list_redis.hgetall(redis_config.USER_DETAIL_KEY + '_' + res2[i], (err3, res3) => {
                                if(err3 || res3 <= 0 || isEmpty(res3)) {
                                    _passed_len ++;
                                }         
                                else {
                                    _passed_len ++;
    
                                    if( (search_type == 2 && res3.PK == search_key) 
                                    ||  (search_type == 1 && res3.NICKNAME == search_key)) {
                                        __is_exist = true;
                                        callback1(null, res_code.SUCCESS, res3, true);   
                                    }   
                                }
    
                                if(_passed_len == res2.length && !__is_exist) {
                                    callback1(null, res_code.SUCCESS, null, false);
                                }
                            });     
                        }  
                    }
                });
            }
        ], function(err, _res_code, _data, _is_exist) {
                callback(res_code.SUCCESS, _data, _is_exist);
        });
    }
}

/**
 * index로 유저정보 가져오기
 * @param {*} pan_room_list_redis       판뒤집기 게임 핸들러
 * @param {*} room_number               게임방 번호
 * @param {*} idx                       리스트 pos
 * @param {*} COLOR                     팀 컬러
 */
exports.getSocketIdByIdx = function(pan_room_list_redis, room_number, idx, COLOR) {
    return new Promise((resolve, reject) => {
        let key = '';
        if(COLOR == 'RED') 
            key = redis_config.RED_USER_LIST_KEY + '_' + room_number;
        else
            key = redis_config.BLUE_USER_LIST_KEY + '_' + room_number;

        pan_room_list_redis.lrange(key, idx, idx, (err2, res2) => {
            if(err2 || res2 == null || res2.length < 1) {
                reject(res_code.PAN_GAME_USER_DETAIL_FAIL);
                return;
            }
            resolve(res2[0]);
            return;
        });
    }); 
}

exports.setSocketIdByIdx = function(pan_room_list_redis, room_number, idx, socket_id, COLOR) {
    return  new Promise((resolve, reject) => {
        let key = '';
        if(COLOR == 'RED') 
            key = redis_config.RED_USER_LIST_KEY + '_' + room_number;
        else
            key = redis_config.BLUE_USER_LIST_KEY + '_' + room_number;
        
        pan_room_list_redis.lset(key, idx, socket_id, (err1, res1) => {

            console.log("[setSocketidByIdx]", err1, res1);
            console.log("[setSocketidByIdx]", key, idx, socket_id);

            if(err1) {
                console.log("[[setSocketIdByIdx]]===========", err1);
                reject(res_code.PAN_GAME_METHOD_FAIL);
                return;
            }
            if(res1 != 'OK') {
                reject(res_code.PAN_GAME_METHOD_FAIL);
                return;
            }
            resolve(res_code.SUCCESS);
            return;
        });
    });
}

exports.getUserListInRoom = function(pan_room_list_redis, room_number, COLOR) {
    return new Promise((resolve, reject) => {
        let user_list_key = '';
        if(COLOR == 'RED')
            user_list_key = redis_config.RED_USER_LIST_KEY + '_' + room_number;
        else
            user_list_key = redis_config.BLUE_USER_LIST_KEY + '_' + room_number; 

        pan_room_list_redis.lrange(user_list_key, 0, -1, (err1, res1) => {

            if(err1 || res1 == null) {
                if(COLOR == 'RED')
                    reject(res_code.PAN_GAME_ROOM_RED_USER_FAIL);
                else
                    reject(res_code.PAN_GAME_ROOM_BLUE_USER_FAIL);
            }
            else {
                let _passed_len = 0;
                let _data = [];
                if(res1.length == 0) {
                    resolve(_data);
                    return;
                }
                for(let i = 0; i < res1.length; i ++) {
                    pan_room_list_redis.hgetall(redis_config.USER_DETAIL_KEY + '_' + res1[i], (err2, res2) => {
                        if(err2 || res2 <= 0 || isEmpty(res2)) {
                            _passed_len ++;
                        }
                        else {
                            _passed_len ++;
                            _data.push({
                                'PK': res2.PK,
                                'NICKNAME': res2.NICKNAME,
                                'AVATAR': res2.AVATAR,
                                'SOCKET': res2.SOCKET,
                                'READY': (res2.READY == 1 ? true : false),                        
                                'LOADING': (res2.LOADING == 1 ? true : false),
                                'CLAN': res2.CLAN,
                                'MASTER': (res2.MASTER == 1 ? true : false),
                                'COLOR': res2.COLOR,
                                'ENDGAME': (res2.ENDGAME == 1 ? true : false)
                            });
                        }
                        if(_passed_len == res1.length) {
                            resolve(_data);
                        }
                    });
                }
            }
        });               
    });
}

/**
 * 
 * @param {*} pan_room_list_redis       판뒤집기 레디스 핸들러
 * @param {*} room_number               게임방번호 
 * @param {*} COLOR                     팀 컬러 
 */
exports.getTeamSocketIdList = function(pan_room_list_redis, room_number, COLOR) {
    return new Promise((resolve, reject) => {
        let user_list_key = '';
        if(COLOR == 'RED') 
            user_list_key = redis_config.RED_USER_LIST_KEY + '_' + room_number;
        else
            user_list_key = redis_config.BLUE_USER_LIST_KEY + '_' + room_number;

        pan_room_list_redis.lrange(user_list_key, 0, -1, (err1, res1) => {
            if(err1 || res1 == null) {
                if(COLOR == 'RED')
                    reject(res_code.PAN_GAME_ROOM_RED_USER_FAIL);
                else
                    reject(res_code.PAN_GAME_ROOM_BLUE_USER_FAIL);
            }
            else {
                resolve(res1);
            }
        });
    });
}

exports.getRoomNumberList = function(pan_room_list_redis) {
    return new Promise((resolve, reject) => {
        pan_room_list_redis.zrevrange(redis_config.ROOM_LIST_KEY, 0, -1, (err1, res1) => {
            if(res1 == null || err1) {
                reject(res_code.GET_ROOM_LIST_FAIL);
            }
            else {
                resolve(res1)
            }
        });
    });
}

// delete room in room_list in redis
exports.removeRoomInRoomList = function(pan_room_list_redis, room_number) {
    return new Promise((resolve, reject) => {
        pan_room_list_redis.zrem(redis_config.ROOM_LIST_KEY, room_number, (err1, res1) => {
            if(err1) {
                reject(res_code.PAN_GAME_DELETE_METHOD_FAIL);
                return;
            }
            if(res1 < 0) {
                reject(res_code.PAN_GAME_DELETE_METHOD_FAIL);
                return;
            }
            resolve(res_code.SUCCESS);
        });
    });
}

exports.removeRedisInfo = function(pan_room_list_redis, _key) {
    return new Promise((resolve, reject) => {
        pan_room_list_redis.del(_key, (err1, res1) => {
            if(err1) {
                reject(res_code.PAN_GAME_DELETE_METHOD_FAIL);
                return;
            }     
            resolve(res_code.SUCCESS);
        });
    });
}

// delete socket in rank list in redis
exports.removeSocketInRankList = function(pan_room_list_redis, room_number, socket_id, color) {
    return new Promise((resolve, reject) => {
        let _key = '';
        if(color == 'RED')
            _key = redis_config.RED_RANK_LIST + '_' + room_number;
        else 
            _key = redis_config.BLUE_RANK_LIST + '_' + room_number;

        pan_room_list_redis.zrem(_key, socket_id, (err1, res1) => {
            if(err1) {
                reject(res_code.PAN_GAME_DELETE_METHOD_FAIL);
                return;
            }
            if(res1 < 0) {
                reject(res_code.PAN_GAME_DELETE_METHOD_FAIL);
                return;
            }
            resolve(res_code.SUCCESS);
        });
    });
}

exports.auto_enter = function(pan_room_list_redis, callback) {
    auto_enter_func1(pan_room_list_redis, 0, (err, data) => {
        if (err === res_code.SUCCESS) {
            callback(res_code.SUCCESS, data);
        } else if (err === -1) {
            let _cs = data;
            auto_enter_func1(pan_room_list_redis, _cs, (err1, data1) => {
                if (err1 === 0) {
                } 
                else {
                    callback(res_code.PANCHANGE_AUTO_ENTER_NOT_ENOUGH, null);
                }
            });
        } else {
            callback(res_code.PANCHANGE_AUTO_ENTER_NOT_ENOUGH, null);
        }
    });    
}

function auto_enter_func1(pan_room_list_redis, cursor, callback) {
    pan_room_list_redis.zscan(redis_config.ROOM_LIST_KEY, cursor, (err, res) => {
        if (err) {
            console.log('panchange auto_enter redis err : ' + err);
            callback(res_code.PANCHANGE_AUTO_ENTER_REDIS, null);
        } else {
            if (res[1].length <= 0) {
                console.log('panchange auto_enter redis err : ' + res[1].length);
                callback(res_code.PANCHANGE_AUTO_ENTER_REDIS_RES, null);
            } else {
                auto_enter_func2(pan_room_list_redis, res[0], res[1], callback);
            }
        }
    });
}

function auto_enter_func2(pan_room_list_redis, cursor, room_number, callback) {
    let _loop_length = 0;
    let _search_success = false;
    let _rdata = {};
    let _data = [];
    
    for (let i = 0; i < room_number.length; i += 2) {
        let _rinfo_key = redis_config.ROOM_DETAIL_KEY + '_' + room_number[i]; //
        pan_room_list_redis.hgetall(_rinfo_key, (err1, res1) => {
            if (err1) { _loop_length += 2; } else {
                if (res1 <= 0) {
                    //룸번호 반환      
                    _loop_length += 2;
                } else {
                    _loop_length += 2;
                    if (res1.is_lock === "0" && res1.is_clan === "0" && res1.is_play === "0" && (parseInt(res1.user_max_count) > parseInt(res1.current_user_count))) {
                        _search_success = true;
                        _rdata.result = 0;
                        let _room_info = {};
                        _room_info.room_number = res1.room_number;
                        _room_info.host_name = res1.host_name;
                        _room_info.is_lock = res1.is_lock;
                        _room_info.room_title = res1.room_title;
                        _room_info.play_time = res1.play_time;
                        _room_info.back_ground = res1.back_ground;
                        _room_info.user_max_count = res1.user_max_count;
                        _room_info.current_user_count = res1.current_user_count;
                        _room_info.ip = res1.ip;
                        _room_info.host_name = res1.host_name;

                        if (_data.length <= 0) {
                            _data.push(_room_info);
                        }
                        _rdata.data = _data;
                    }
                }
            }

            //루프 상태 체크
            if (room_number.length == _loop_length) {
                if (_search_success) {
                    callback(res_code.SUCCESS, _rdata);
                } else {
                    if (cursor != 0) {
                        callback(-1, cursor);
                    } else {
                        callback(res_code.PANCHANGE_AUTO_ENTER_NOT_ENOUGH, 0);
                    }
                }
            }
        });
    }
}

exports.addDataToArray = function(pan_room_list_redis, _key, _data) {
    return new Promise((resolve, reject) => {
        pan_room_list_redis.rpush(_key, _data, (err1, res1) => {
            if(err1) {
                reject(res_code.ADD_DATA_TO_ARRAY_FAIL);
                return;
            }
            if(res1 < 0) {
                reject(res_code.ADD_DATA_TO_ARRAY_FAIL);
                return;
            }
            resolve(res_code.SUCCESS);
        });       
    });
}

exports.getListFromArray = function(pan_room_list_redis, key) {
    return new Promise((resolve, reject) => {
        pan_room_list_redis.lrange(key, 0, -1, (err1, res1) => {
            if(err1 || res1 == null) {
                reject(res_code.GET_LIST_FROM_ARRAY_FAIL);
            }
            else {
                resolve(res1);
            }
        });
    });
}

exports.removeInArray = function(pan_room_list_redis, key, element) {
    return new Promise((resolve, reject) => {
        pan_room_list_redis.lrem(key, 1, element, (err1, res1) => {
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