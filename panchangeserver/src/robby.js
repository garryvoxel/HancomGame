/**
 * 파일명: panchangeserver/src/robby.js
 * 레디스 서버에 판 뒤집기 게임관련 정보 보관 요청 및 가져오기
 */
var request = require('request');
var serverConf = require('../config/server.json')[process.env.NODE_ENV];
// var serverConf = require('../config/server.json')['test'];
const CryptoJS_EN = require('../common/util').CryptoJS_EN;
const CryptoJS_DE = require('../common/util').CryptoJS_DE;

const panchangeRedisApiHandler = require('axios');
panchangeRedisApiHandler.defaults.baseURL = serverConf.REDIS_NEW_MODULE;
panchangeRedisApiHandler.defaults.headers.post['Content-Type'] = 'application/json';

// 서버 IP & PORT
var SERVER_IP = serverConf.SERVER_IP;

// 서버 종료시, 방 모두 반환
/*
app.js에서 robby 모듈의 exitServer 메소드를 이용하지 않으므로 코멘트 처리
exports.exitServer = function(rooms) {
    console.log('[[[ Close Server ]]]');
    for (var key in rooms) {
        removeRoom(key);
    }
} */


// 전체 방 리스트 - 번호
exports.getAllRoomList = function(callback) {
    request.post(
        serverConf.REDIS_SERVER + '/request_total_room_list', {

        },
        function(error, response, body) {
            try {
                var obj = JSON.parse(body);
                console.log('[[REDIS]]/request_total_room_list');
                if (obj['data']) {
                    callback(obj['data']);
                } else {
                    callback([]);
                }
            } catch (e) {
                console.log('[[REDIS ERR]/request_total_room_list');
                console.log(e);
            }
        }
    )
}

// 전체 방 수 확인
exports.getAllRoomCount = function(callback) {
    request.post(
        serverConf.REDIS_SERVER + '/get_total_room_list', {

        },
        function(error, response, body) {
            try {
                var obj = JSON.parse(body);
                console.log('[[REDIS]]/get_total_room_list : ' + obj['count']);
                callback(obj['count']);
            } catch (e) {
                console.log('[[REDIS ERR]/get_total_room_list');
                console.log(e);
            }
        }
    )
}

// 방 번호 요청
exports.reqRoomNum = async function(callback) {
    console.log("[reqRoomNum]");
    try {
        let ret = await panchangeRedisApiHandler.post('/panchange/get_room_number', {});
        if(ret.data.ERR_CODE == 0)
            return ret.data.ROOM_NUMBER;
        return null;
    }
    catch(err22) {
        return null;
    }
}

exports.resetRedis = async function() {
    try {
        let ret = await panchangeRedisApiHandler.post('/panchange/reset_redis', {});
        if(ret.data.ERR_CODE == 0)
            return true;
        else 
            return false;
    }
    catch(err22) {
        return false;
    }
}

exports.flush_redis_ch = function(callback) {

    console.log("[flush_redis_ch]");

    request.post(
        serverConf.REDIS_SERVER + '/request_room_list_flush', {
            json: {
                channel: 1
            }
        },
        function(error, response, body) {
            console.log('[[REDIS]]/flush_redis_ch Completed');
        }
    )
}


// 방 생성 요청
exports.createRoom = async function(data) {
    return new Promise((resolve, reject) => {
        request.post(serverConf.API_SERVER + '/game/check_prohibt_words', {
            json: {
                words: data.ROOM_NAME
             }    
        }, async function(error, response, body) {
            if(error) {
                return resolve({ success: false, err_code: 0 });     
            }
            if(body.result != 0) {
                return resolve({ success: false, err_code: 4 });        
            }
    
            try {
                // 비속어 필터링 성공
                let ret = await panchangeRedisApiHandler.post('/panchange/create_room', {
                    room_number: data.ROOM_NUMBER,
                    host_name: data.HOST_NAME,
                    is_lock: (data.IS_FREE) ? 0 : 1,
                    room_title: data.ROOM_NAME,
                    user_max_count: data.MEMBER_NUM,
                    is_clan: (data.IS_PUBLIC) ? 0 : 1,
                    ip: SERVER_IP,
                    back_ground: data.BACKGROUND,
                    play_time: data.RUNNING_TIME / 60,
                    clan_name_A: data.CLAN,
                    password: data.PASSWORD
                }); 
    
                if(ret.data.ERR_CODE == 0)
                    return resolve({ success: true, host: SERVER_IP});
    
                if(ret.data.ERR_CODE == 109) //ALREADY_CLAN_CREATED
                    return resolve({ success: false, err_code: 1 });
                
                
                return resolve({ success: false, err_code: 0 });
            }
            catch(err22) {
                console.log("[createRoom]===========", err22);    
                return resolve({
                    success: false,
                    err_code: 0
                });
            }
        });
    });  
}

// 방 리스트 요청
exports.getRoomList = async function(page) {
    let ret = await panchangeRedisApiHandler.post('/panchange/get_room_list', {
        page: page
    });
    if(ret.data.ERR_CODE != 0) {
        return await Promise.reject(new Error("[getRoomList Api Failed]"));
    }
    let roomList = [];
    for(let i = 0; i < ret.data.DATA.length; i ++) {
        roomList.push({
            'ROOM_NUM': ret.data.DATA[i].room_number,
            'ROOM_NAME': ret.data.DATA[i].room_title,
            'CURRENT_MEN': ret.data.DATA[i].current_user_count,
            'MAX_MEN': ret.data.DATA[i].user_max_count,
            'RUNNING_TIME': parseInt(ret.data.DATA[i].play_time) * 60,
            'IS_LOCK': ret.data.DATA[i].is_lock == 1,
            'IP': ret.data.DATA[i].ip,
            'IS_PUBLIC': ret.data.DATA[i].is_clan == 0,
            'A_CLAN': ret.data.DATA[i].clan_name_A,
            'B_CLAN': ret.data.DATA[i].clan_name_B,
            'IS_PLAY': ret.data.DATA[i].is_play
        });
    }
    return {
        "ROOMLIST": roomList,
        "CURRENT_PAGE_NUMBER": page,
        "MAX_PAGE_NUMBER": ( roomList.length == 0 ? 1 : ( parseInt(roomList.length / 8) + (roomList.length % 8 > 0 ? 1 : 0) ) )
    };
}

// 방 시작시 API REDIS 방정보 플레이중 플래그 SET

exports.set_play = async function(roomNum) {
    try {
        let ret = await panchangeRedisApiHandler.post('/panchange/update_room_playing', {
            room_number: roomNum.substring(4),
            is_play: "1"
        });

        if(ret.data.ERR_CODE != 0)
            return false;
        
        return true;
    }
    catch(err22) {
        console.log("[set_play_not]================");
        return false;
    }
}

// 게임 재진행시 API REDIS 방정보 플레이중 플래그 SET

exports.set_play_not = async function(roomNum) {
    try {
        let ret = await panchangeRedisApiHandler.post('/panchange/update_room_playing', {
            room_number: roomNum.substring(4),
            is_play: "0"
        });

        if(ret.data.ERR_CODE != 0)
            return false;

        return true;
    }
    catch(err22) {
        console.log("[set_play_not]================");
        return false;
    }
}

// 방 명수 업데이트
exports.updateMemberNum = function(roomNum, current) {
    request.post(
        serverConf.REDIS_SERVER + '/update_user_count', {
            json: {
                room_number: parseInt(roomNum.substring(4)),
                user_count: current
            }
        },
        function(error, response, body) {}
    )
}

// 방 제거
/*
game모듈의 removeRoom에서 통합처리 진행 , 
robby모듈의 removeRoom은 사용하지 않으므로 코멘트 처리
var removeRoom = function(roomNum) {
    request.post(
        serverConf.REDIS_SERVER + '/delete_room', {
            json: {
                room_number: parseInt(roomNum.substring(4))
            }
        },
        function(error, response, body) {}
    )
}
exports.removeRoom = removeRoom; */

// 방 검색
exports.searchRoom = async function(searchType, keyword) {
    try {
        let ret = null;
        if (searchType == 'N') {
            //nickname
            ret = await panchangeRedisApiHandler.post('/panchange/search_room_by_nickname', {
                nick_name: keyword
            });
        }
        else if(searchType == 'R') {
            // room number        
            ret = await panchangeRedisApiHandler.post('/panchange/search_room_by_number', {
                room_number: keyword
            });
        }
        else if(searchType == 'C') {
            // clan    
            ret = await panchangeRedisApiHandler.post('/panchange/search_room_by_clan', {
                clan_name: keyword
            });
        }
        return ret.data;
    }
    catch(err22) {
        return {'ERR_CODE': 4201};
    }
}

// 자동 입장 클랜 검색
exports.autoSearch = async function() {
    try {
        let ret = await panchangeRedisApiHandler({
            method: 'post',
            url: serverConf.REDIS_NEW_MODULE + '/panchange/auto_enter', 
            data: {}
        });

        if(ret.data.ERR_CODE == 0)
            return ret.data.DATA;
        
        return null;
    }
    catch(err22) {
        return null;
    }
}

// 자동 입장 방 검색
exports.autoClan = async function(nickname) {
    try {
        let ret = await panchangeRedisApiHandler({
            method: 'post',
            url: serverConf.REDIS_SERVER + '/clan_auto_enter', 
            data: {
                nickname: nickname
            }
        });
        return ret.data;
    }
    catch(err22) {
        console.log("[autoClan==================", err22);
        return null;
    }
}

// 유저정보
exports.getUserInfo = function(sessionID, callback) {
    request.post(
        serverConf.API_SERVER + '/game/request_userinfo2', {
            json: {
                session_id: sessionID
            }
        },
        function(error, response, body) {
            try {
                callback(body);
            } catch (e) {
                callback(null);
            }
        }
    )
}

// 친구 목록
exports.getFrdList = function(sessionID, callback) {
    request.get({
            url: serverConf.API_SERVER + '/game/web/v1/my/friends',
            headers: {
                'Authorization': 'Bearer ' + sessionID
            }
        },
        function(error, response, body) {
            try {
                callback(JSON.parse(body));
            } catch (e) {
                callback(null);
            }
        }
    )
}

// 전적 가져오기
exports.getAnother = function(uuid, callback) {
    if (uuid != 0) {
        request.post(
            serverConf.API_SERVER + '/game/panchange/request_game_result', {
                json: {
                    uuid: uuid
                }
            },
            function(error, response, body) {
                try {
                    if (body.result != 0) {
                        callback({
                            uuid: uuid,
                            win: 0,
                            lose: 0,
                            draw: 0
                        });
                    } else {
                        callback(body.data[0]);
                    }
                } catch (e) {
                    callback({
                        uuid: uuid,
                        win: 0,
                        lose: 0,
                        draw: 0
                    });
                }
            }
        )
    } else {
        callback({
            uuid: uuid,
            win: 0,
            lose: 0,
            draw: 0
        });
    }
}

// 전적 저장하기
exports.saveResult = function(data, key, callback) {
    console.log('result', data);
    if (data.UUID != 0) {

        //패킷 복제가 될수 있음으로 유니크 패킷을 위해 타임정보를 넣습니다
        // 0.5초 이상 느린 패킷이면 API서버에서 받지 않습니다.
        var newDate = new Date();
        var time = Date.parse(newDate);

        var jsonData = {
            uuid: data.UUID,
            nick_name: data.NICKNAME,
            date: time,
            win: 0
        };
        if (data.WIN == "DRAW") {
            jsonData.state = 2;
        } else if (data.WIN == data.TEAM) {
            jsonData.state = 0;
            jsonData.win = 1;
            console.log("이겻다   승점 ================" + jsonData.win);
            console.log("이겻다   시간 ================" + jsonData.date);
        } else {
            jsonData.state = 1;
        }

        var ctipto_output = CryptoJS_EN(JSON.stringify(jsonData));

        let _jsonPack = {};
        _jsonPack.packet = "" + ctipto_output; // toString()을 쓰면 에러가 납니다.         

        request.post(
            serverConf.API_SERVER + '/game/panchange/write_game_result', {
                json: _jsonPack
            },
            function(error, response, body) {
                try {
                    data.HISTORY.WIN = body.data[0].win;
                    data.HISTORY.LOSE = body.data[0].lose;
                    data.HISTORY.DRAW = body.data[0].draw;
                    callback(key, data);
                } catch (e) {
                    console.log("--- ranking error : ");
                    console.log(data);
                    console.log(e);
                    console.log(body);
                    console.log(body);
                    console.log("--- ranking ---");
                    callback(key, data);
                }
            }
        )

        if (data.STATE != 3) {

            var newDate = new Date();
            var time = Date.parse(newDate);

            let _json = {};

            _json.uuid = data.UUID;
            _json.point = data.POINT;
            _json.nick_name = data.NICKNAME;
            _json.game_code = serverConf.GAME_CODE;
            _json.date              = time;

            var ctipto_output = CryptoJS_EN(JSON.stringify(_json));

            let _jsonPack = {};
            _jsonPack.packet = "" + ctipto_output; // toString()을 쓰면 에러가 납니다. 

            request.post(
                serverConf.API_SERVER + '/game/update_point', {
                    json: _jsonPack
                },
                function(error, response, body) {}
            )
        }

        request.post(
            serverConf.API_SERVER + '/game/panchange/start_end_game_log', {
                json: {
                    "uuid": data.UUID,
                    "nick_name": data.NICKNAME,
                    "game_mode": data.MODE,
                    "my_team": (data.TEAM == 'RED') ? 1 : 2,
                    "blue_team_count": data.BLUE_STARTCOUNT,
                    "red_team_count": data.RED_STARTCOUNT,
                    "blue_end_team_count": data.BLUE_ENDCOUNT,
                    "red_end_team_count": data.RED_ENDCOUNT,
                    "finish_mode": data.STATE,
                    "win_lose_mode": jsonData.state + 1,
                    "game_start_time": data.STARTTIME,
                    "game_end_time": data.ENDTIME
                }
            },
            function(error, response, body) {}
        )
    } else {
        data.HISTORY.WIN = 0;
        data.HISTORY.LOSE = 0;
        data.HISTORY.DRAW = 0;

        if (data.WIN == "DRAW") {
            data.HISTORY.DRAW = 1;
        } else if (data.WIN == data.TEAM) {
            data.HISTORY.WIN = 1;
        } else {
            data.HISTORY.LOSE = 1;
        }

        callback(key, data);
    }
}

// 방 옵션 변경
exports.changeRoom = async function(roomNum, data) {
    //서버에 요청하기   
    try {
        let ret = await panchangeRedisApiHandler.post('/panchange/change_room_option', {
            room_number: roomNum.substring(4),
            IS_PUBLIC: (data.IS_PUBLIC ? 1 : 0),
            IS_FREE: (data.IS_FREE ? 1 : 0),
            BACKGROUND: data.BACKGROUND,
            RUNNING_TIME: parseInt(data.RUNNING_TIME) / 60,
            COLOR: data.COLOR,
            PASSWORD: (data.hasOwnProperty('PASSWORD') ? data.PASSWORD : '')
        }); 
        return ret.data.ERR_CODE;
    }
    catch(err22) {
        console.log('[[changeRoom============]]', err22);
        return 1;
    }
}

// 방장 변경
exports.changeMaster = function(roomNum, pre, next) {
    request.post(
        serverConf.REDIS_SERVER + '/request_change_host_name', {
            json: {
                "room_num": parseInt(roomNum.substring(4)),
                "pre_host_name": pre,
                "next_host_name": next
            }
        },
        function(error, response, body) {
            if (error) {
                console.log('[[REDIS ERR]/request_change_host_name');
                console.log(error);

            } else {
                console.log('[[REDIS]]/request_change_host_name');
            }
        }
    )
}

// B 클랜 정보 업데이트
exports.changeClanB = function(roomNum, clanName) {
    request.post(
        serverConf.REDIS_SERVER + '/update_clan_B_name', {
            json: {
                "room_number": parseInt(roomNum.substring(4)),
                "clan_name_B": clanName
            }
        },
        function(error, response, body) {
            if (error) {
                console.log('[[REDIS ERR]/update_clan_B_name');
                console.log(error);

            } else {
                console.log('[[REDIS]]/update_clan_B_name');
            }
        }
    )
}

// A 클랜 정보 업데이트
exports.changeClanA = function(roomNum, preClanName, nextClanName) {

    request.post(
        serverConf.REDIS_SERVER + '/change_clan_room_host', {
            json: {
                "room_number": parseInt(roomNum.substring(4)),
                "pre_clan_name_A": preClanName,
                "new_clan_name_A": nextClanName,
            }
        },
        function(error, response, body) {
            if (error) {
                console.log('[[REDIS ERR]/change_clan_room_host');
                console.log(error);

            } else {
                console.log('[[REDIS]]/change_clan_room_host');
            }
        }
    )
}