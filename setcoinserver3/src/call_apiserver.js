/**
 * 파일명: setcoinserver3/src/call_apiserver.js
 * API서버 엔드포인트를 호출하는 메소드 목록 정의
 */
 const request = require('request');
 const CG_PACKET_ERR = require('./packet_err').CG_PACKET_ERR;
 const svrcfg = require('../config/server.json')[process.env.NODE_ENV || 'development'];
 const WebConfig = require('../config/config');
 const CryptoJS_EN = require('../common/util').CryptoJS_EN;
 
 const setcoinserverRedisApiHandler = require('axios');
 setcoinserverRedisApiHandler.defaults.baseURL = svrcfg.REDIS_NEW_MODULE;
 setcoinserverRedisApiHandler.defaults.headers.post['Content-Type'] = 'application/json';

/**
 * 게임방 리스트 정보 가져오기 
*/
exports.get_room_list = async function() {
    try {
        let ret = await setcoinserverRedisApiHandler.post('/setcoinserver/get_room_list', {
            server_idx: svrcfg.SERVER_IDX
        });
        if(ret.data.ERR_CODE == 0) 
            return ret.data.DATA; 
        return [];        
    }
    catch(err22) {
        console.log("[GetRoomList Err]============", err22);
        return [];
    }
}

/**
 * 유저 정보 가져오기
 * @param {* 닉네임} nick_name
 */
 exports.get_userinfo = function(nick_name, callback) {
    let _host = WebConfig.getApiURL(process.env.NODE_ENV) + '/game/request_userinfo';

    console.log('get_userinfo : ' + _host);

    let _method = 'POST';
    let _json = {};
    //닉네임 파라미터값 설정
    _json.nick_name = nick_name;


    var _options = {
        url: _host,
        method: _method,
        json: _json
    };
    //서버에 request요청 보내기
    request(_options, (err, res, body) => {
        if (err) {
            console.log('CheckSession err : ' + err);
            callback(CG_PACKET_ERR.LOGIN_API_SERVER, 0);
        } else {
            callback(CG_PACKET_ERR.SUCCESS, body);
        }

    });
}


/**
 * 센션아이디 가져오기
 */
exports.get_session_id = function(nick_name, callback) {
    let _host = WebConfig.getApiURL(process.env.NODE_ENV) + '/game/request_session_id';
    let _method = 'POST';
    let _json = {};
    _json.nick_name = nick_name;

    var ctipto_output = CryptoJS_EN(JSON.stringify(_json));
    let _jsonPack = {};

    _jsonPack.packet = "" + ctipto_output; // toString()을 쓰면 에러가 납니다. 



    var _options = {
        url: _host,
        method: _method,
        json: _jsonPack
    };


    request(_options, (err, res, body) => {
        if (err) {
            console.log('CheckSession err : ' + err);
            callback(CG_PACKET_ERR.GET_SESSION_ID, 0);
        } else {
            callback(CG_PACKET_ERR.SUCCESS, body);
        }

    });


}

//
/**
 * 레디스에 룸 리스트 등록
 * @param {* 룸번호} room_number
 * @param {* 방제목} room_title
 * @param {* 닉네임} nick_name
 * @param {* 비번방여부} is_lock
 * @param {* 싱글방여부} is_single
 * @param {* 플레이타임} play_time
 * @param {* 배경화면} back_ground
 */
exports.insert_room_to_list = function(room_number, room_title, nick_name,
    is_lock, is_single, ip, play_time, back_ground, pw, callback) {
    let _host = WebConfig.getApiURL(process.env.NODE_ENV) + '/game/setcoin/create_room';

    console.log("insert_room_to_list - HOST : " + _host+", IP : "+ip+", SERVER IDX : "+svrcfg.SERVER_IDX);

    let _method = 'POST';
    let _json = {};
    _json.room_num = room_number;
    _json.room_title = room_title;
    _json.host_name = nick_name;
    _json.is_lock = is_lock;
    _json.is_single = is_single;
    _json.ip = ip;
    _json.play_time = play_time;
    _json.back_ground = back_ground;
    _json.password = pw;
    _json.server_idx = svrcfg.SERVER_IDX;

    var _options = {
        url: _host,
        method: _method,
        json: _json
    };
    request(_options, (err, res, body) => {
        if (err) {
            console.log('insert_room_list err : ' + err);
            callback(CG_PACKET_ERR.CREATE_ROOM_API_SERVER_ROOM_LIST);
        } else {
            callback(CG_PACKET_ERR.SUCCESS);
        }

    });

}

/**
 * 룸번호 받아오기 new added
 *  */
 exports.get_room_number = async function(server_idx) {
    try {
        let ret = await setcoinserverRedisApiHandler.post('/setcoinserver/get_room_number', {
            server_idx: server_idx
        });
        if(ret.data.ERR_CODE == 0)
            return ret.data.ROOM_NUMBER;
        return null;
    }
    catch(err22) {
        console.log('get_room_number err : ' + err22);
        return null;
    }
}

/**
 * 룸번호를 반환한다.
 * @param {*룸번호} room_number
 */
exports.return_room_number = function(room_number, callback) {
    let _host = WebConfig.getApiURL(process.env.NODE_ENV) + '/game/setcoin/return_room_number';
    let _method = 'POST';
    let _json = {};
    _json.room_number = room_number;
    _json.server_idx = svrcfg.SERVER_IDX;
    var _options = {
        url: _host,
        method: _method,
        json: _json
    };
    request(_options, (err, res, body) => {
        if (err) {
            console.log('return_room_number err : ' + err);
            callback(CG_PACKET_ERR.CREATE_ROOM_API_SERVER_ROOM_NUMBER, -1);
        } else {
            callback(CG_PACKET_ERR.SUCCESS, body);
        }

    });
}

/**
 * 레디스에 있는 룸 정보를 제거한다.
 * @param {*룸번호} room_number 
 */
exports.clear_room_info = function(room_number, callback) {
    let _host = WebConfig.getApiURL(process.env.NODE_ENV) + '/game/setcoin/delete_room2';

    let _method = 'POST';
    let _json = {};
    _json.room_number = room_number;
    _json.server_idx = svrcfg.SERVER_IDX;
    var _options = {
        url: _host,
        method: _method,
        json: _json
    };
    request(_options, (err, res, body) => {
        if (err) {
            console.log('return_room_number err : ' + err);
            callback(CG_PACKET_ERR.CREATE_ROOM_API_SERVER_ROOM_NUMBER, -1);
        } else {
            callback(CG_PACKET_ERR.SUCCESS, body);
        }

    });
}

/**
 * 게임시작할떄 로그쓰기.
 *  * @param {*uuid} uuid 
 * @param {*닉네임} nick_name 
 */
 exports.write_game_start_log = function(uuid, nick_name, callback) {
    let _host = WebConfig.getApiURL(process.env.NODE_ENV) + '/game/setcoin/start_game_log';

    let _method = 'POST';
    let _json = {};
    _json.uuid = uuid;
    _json.nick_name = nick_name;
    var _options = {
        url: _host,
        method: _method,
        json: _json
    };
    //서버에 request요청 보내기
    request(_options, (err, res, body) => {
        if (err) {
            console.log('return_room_number err : ' + err);
            callback(CG_PACKET_ERR.CREATE_ROOM_API_SERVER_ROOM_NUMBER, -1);
        } else {
            callback(CG_PACKET_ERR.SUCCESS, body);
        }

    });

}

/**
 * 룸 옵션을 변경 처리하는 함수
 * @param {* 룸번호} room_number
 * @param {* 방장 닉네임} nick_name
 * @param {* 방 제목} room_title
 * @param {* 게임 배경} back_ground
 * @param {* 비번 방인지 여부} lock
 * @param {* 패스워드} password
 * @param {* 플레이 타임} play_time
 */
 exports.change_room_option = function(room_number, nick_name, room_title, is_lock, password, play_time, back_ground, callback) {
    let _host = WebConfig.getApiURL(process.env.NODE_ENV) + '/game/setcoin/change_room_option';
    let _method = 'POST';
    let _json = {};
    //파라미터 설정
    _json.room_number = room_number;
    _json.nick_name = nick_name;
    _json.room_title = room_title;
    _json.is_lock = is_lock;
    _json.password = password;
    _json.play_time = play_time;
    _json.back_ground = back_ground;
    _json.server_idx = svrcfg.SERVER_IDX;

    console.log("change_room_option=====================". _json);

    console.log("change_room_option : " + JSON.stringify(_json));
    var _options = {
        url: _host,
        method: _method,
        json: _json
    };
    //서버에 request요청 보내기
    request(_options, (err, res, body) => {
        if (err) {
            console.log('return_room_number err : ' + err);
            callback(CG_PACKET_ERR.CHANGE_ROOM_OPTION_API_SERVER);
        } else {
            callback(CG_PACKET_ERR.SUCCESS);
        }

    });
}


/**
 * 게임 결과를 요청하기
 * @param {* UUID} uuid
 */
 exports.request_game_result = function(uuid, callback) {
    let _host = WebConfig.getApiURL(process.env.NODE_ENV) + '/game/setcoin/request_game_result';

    let _method = 'POST';
    let _json = {};
    //파라미터 설정
    _json.uuid = uuid;

    var _options = {
        url: _host,
        method: _method,
        json: _json
    };

    console.log("동전쌓기 ===================================  request_game_result");
    //서버에 request요청 보내기
    request(_options, (err, res, body) => {
        if (err) {
            console.log('request_game_result err : ' + err);
            callback(CG_PACKET_ERR.LOGIN_REQUEST_API_SERVER_GAME_RESULT, null);
        } else {
            callback(CG_PACKET_ERR.SUCCESS, body);
        }
    });
}


/**
 * 게임 결과 쓰기
 * @param {* UUID} uuid
 * @param {* 닉네임} nick_name
 * @param {* 상태} result_state
 */
 exports.write_game_result = function(uuid, nick_name, result_state, callback) {
    let _host = WebConfig.getApiURL(process.env.NODE_ENV) + '/game/setcoin/write_result';

    //패킷 복제가 될수 있음으로 유니크 패킷을 위해 타임정보를 넣습니다
    // 0.5초 이상 느린 패킷이면 API서버에서 받지 않습니다.
    var newDate = new Date();
    var time = Date.parse(newDate);


    let _method = 'POST';
    let _json = {};
    //파라미터 설정
    _json.uuid = uuid;
    _json.result_state = result_state;
    _json.nick_name = nick_name;
    _json.date = time;

    //파라미터객체를 암호화
    var ctipto_output = CryptoJS_EN(JSON.stringify(_json));

    let _jsonPack = {};

    _jsonPack.packet = "" + ctipto_output; // toString()을 쓰면 에러가 납니다. 

    var _options = {
        url: _host,
        method: _method,
        json: _jsonPack
    };

    console.log("동전쌓기 ===================================  write_game_result");
    //서버에 request요청 보내기
    request(_options, (err, res, body) => {
        if (err) {
            console.log('request_game_result err : ' + err);
            callback(CG_PACKET_ERR.WRITE_GAME_RESULT_API_SERVER, null);
        } else {
            callback(CG_PACKET_ERR.SUCCESS, body);
        }

    });
}

exports.flush_redis_ch = function(callback) {
    let _host = WebConfig.getApiURL(process.env.NODE_ENV) + '/game/setcoin/flush_redis_ch';

    let _method = 'POST';
    let _json = {};

    _json.server_idx = svrcfg.SERVER_IDX;


    var _options = {
        url: _host,
        method: _method,
        json: _json
    };
    request(_options, (err, res, body) => {
        if (err) {
            console.log('request_game_result err : ' + err);
        } else {
            console.log('reset_usercount Success ');
        }

    });
}

exports.ready_redis_ch = function(callback) {
    let _host = WebConfig.getApiURL(process.env.NODE_ENV) + '/game/setcoin/ready_redis_coin_ch';

    let _method = 'POST';
    let _json = {};

    _json.server_idx = svrcfg.SERVER_IDX;


    var _options = {
        url: _host,
        method: _method,
        json: _json
    };
    request(_options, (err, res, body) => {
        if (err) {
            console.log('request_game_result err : ' + err);
        } else {
            console.log('reset_usercount Success ');
        }

    });
}

//유저 카운트 초기화
exports.reset_usercount = function(tmp, callback) {
    let _host = WebConfig.getApiURL(process.env.NODE_ENV) + '/game/setcoin/reset_usercount';

    let _method = 'POST';
    let _json = {};
    //파라미터 설정
    _json.server_idx = svrcfg.SERVER_IDX;


    var _options = {
        url: _host,
        method: _method,
        json: _json
    };
    //서버에 request요청 보내기
    request(_options, (err, res, body) => {
        if (err) {
            console.log('request_game_result err : ' + err);
        } else {
            console.log('reset_usercount Success ');
        }

    });
}
//유저 카운트 업데이트
exports.update_usercount = function(state, callback) {
    let _host = WebConfig.getApiURL(process.env.NODE_ENV) + '/game/setcoin/update_usercount';

    let _method = 'POST';
    let _json = {};
    //파라미터 설정
    _json.state = state;
    _json.server_idx = svrcfg.SERVER_IDX;


    var _options = {
        url: _host,
        method: _method,
        json: _json
    };
    //서버에 request요청 보내기
    request(_options, (err, res, body) => {
        if (err) {
            console.log('request_game_result err : ' + err);
            callback(CG_PACKET_ERR.WRITE_GAME_RESULT_API_SERVER);
        } else {
            callback(CG_PACKET_ERR.SUCCESS);
        }

    });
}

/**
 * 게임 로그 쓰기
 * @param {* UUID} uuid
 * @param {* 닉네임} nick_name
 * @param {* 플레이 모드} play_mode
 * @param {* 닉네임} other_nick_name
 * @param {* 상태} end_state
 * @param {* 승패} win_lose
 * @param {* 스코} score
 * @param {* 시작 시간} start_time
 * @param {* 종료 시간} end_time
 */
 exports.start_end_game_log = function(uuid, nick_name,
    play_mode, other_nick_name,
    end_state, win_lose,
    score, start_time, end_time, callback) {
    let _host = WebConfig.getApiURL(process.env.NODE_ENV) + '/game/setcoin/start_end_game_log';

    let _method = 'POST';
    let _json = {};
    //파라미터 설정
    _json.uuid = uuid;
    _json.nick_name = nick_name;
    _json.play_mode = play_mode;
    _json.other_nick_name = other_nick_name;
    _json.end_state = end_state;
    _json.win_lose = win_lose;
    _json.score = score;
    _json.game_start_time = start_time;
    _json.game_end_time = end_time;

    var _options = {
        url: _host,
        method: _method,
        json: _json
    };
    //서버에 request요청 보내기
    request(_options, (err, res, body) => {
        if (err) {
            console.log('request_game_result err : ' + err);
            callback(CG_PACKET_ERR.WRITE_GAME_RESULT_API_SERVER);
        } else {
            callback(CG_PACKET_ERR.SUCCESS);
        }

    });
}

/**
 * 포인트 업데이트
 * @param {* UUID} uuid
 * @param {* 포인트} point
 * @param {* 닉네임} nickname
 */
exports.update_point = function(uuid, point, nickname, callback) {
    let _host = WebConfig.getApiURL(process.env.NODE_ENV) + '/game/update_point';

    //패킷 복제가 될수 있음으로 유니크 패킷을 위해 타임정보를 넣습니다
    // 0.5초 이상 느린 패킷이면 API서버에서 받지 않습니다.

    console.log("닛네임 =================" + nickname);
    var newDate = new Date();
    console.log("날짜 찍힙니다 =================" + newDate);

    var time = Date.parse(newDate);
    console.log("날짜 변환값 찍힙니다 =================" + time);

    let _method = 'POST';
    let _json = {};
    //파라미터 설정
    _json.uuid = uuid;
    _json.point = point;
    _json.nick_name = nickname;
    _json.game_code = 10000;
    _json.date = time;

    var ctipto_output = CryptoJS_EN(JSON.stringify(_json));

    let _jsonPack = {};
    _jsonPack.packet = "" + ctipto_output; // toString()을 쓰면 에러가 납니다. 


    var _options = {
        url: _host,
        method: _method,
        json: _jsonPack
    };
    //서버에 request요청 보내기
    request(_options, (err, res, body) => {
        if (err) {
            console.log('request_game_result err : ' + err);
            callback(CG_PACKET_ERR.WRITE_GAME_RESULT_API_SERVER);
        } else {
            callback(CG_PACKET_ERR.SUCCESS);
        }

    });
}

//금지된 단어 체크
exports.check_prohibit_words = function(words, callback) {
    let _host = WebConfig.getApiURL(process.env.NODE_ENV) + '/game/check_prohibt_words';

    let _method = 'POST';
    let _json = {};

    _json.words = words;


    var _options = {
        url: _host,
        method: _method,
        json: _json
    };
    request(_options, (err, res, body) => {
        if (err) {
            console.log('check_prohibit_words err : ' + err);
            callback(CG_PACKET_ERR.CHECK_PROHIBIT_WORDS_API_SERVER);
        } else {
            callback(body.result);
        }

    });
}