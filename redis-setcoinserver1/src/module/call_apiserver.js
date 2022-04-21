const request = require('request');
const serverConf = require('./../../config/server.json')[process.env.NODE_ENV || 'development'];
const CryptoJS_EN = require('./../../utils/util').CryptoJS_EN;
const CG_PACKET_ERR = require('./../../utils/packet_err').CG_PACKET_ERR;

/**
 * 게임 결과 쓰기
 * @param {* UUID} uuid
 * @param {* 닉네임} nick_name
 * @param {* 상태} result_state
 */
exports.write_game_result = function(uuid, nick_name, result_state, callback) {
    let _host = serverConf.api_server + '/game/setcoin/write_result';
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

    let _host = serverConf.api_server + '/game/setcoin/start_end_game_log';        
    
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
    let _host = serverConf.api_server + '/game/update_point';
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

//유저 카운트 업데이트
exports.update_usercount = function(state, callback) {
    let _host = serverConf.api_server + '/game/setcoin/update_usercount';        

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
