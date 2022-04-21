var express = require('express');
var router = express.Router();
const write_session_id = require('../src/write_game').write_session_id;
const write_new_user = require('../src/write_game').write_new_user;
const delete_user = require('../src/write_game').delete_user; // kevin added
const update_channel = require('../src/write_game').update_channel; // kevin added
const update_point = require('../src/write_game').update_point; // kevin added
const show_channel = require('../src/read_game').show_channel; // kevin added
const read_session_id = require('../src/read_game').read_session_id;
const read_user_info = require('../src/read_game').read_user_info;
const request_userinfo_by_session = require('../src/read_game').request_userinfo_by_session;
const PACKET_ERR = require('../src/packet_err').PACKET_ERR;
const decripto = require('../common/util').crypto_decryp; //사용하지 않습니다 클라 호환문제.
const CryptoJS_EN = require('../common/util').CryptoJS_EN; // 위 문제로 새로운 모듈을 씁니다.
const CryptoJS_DE = require('../common/util').CryptoJS_DE;
const word_pool = require('./../common/global_array');

router.post('/write_session_id', (req, res, next) => {
    let _nn = req.body.nick_name;
    let _si = req.body.session_id;
    let _uuid = req.body.uuid;
    write_session_id(_nn, _si, _uuid, (err) => {
        var _data = {};
        _data.result = err;
        res.end();
    });

});

router.post('/request_session_id', (req, res, next) => {
    console.log("요주의 리퀘스트 호출 !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
    var jpacket = CryptoJS_DE(req.body.packet);
    let _nn = jpacket.nick_name;
    var _data = {};
    read_session_id(_nn, (err, data) => {
        _data.result = err;
        if (err != PACKET_ERR.SUCCESS) {
            res.send(_data);
        } else {
            _data.session_id = data;
            res.send(_data);
        }
        res.end();
    });
});

/**
 * 닉네임으로 유저 정보 가져오기
 */
router.post('/request_userinfo', (req, res, next) => {
    let _nn = req.body.nick_name;
    var _data = {};
    read_user_info(_nn, (err, data) => {
        _data.result = err;
        if (err != PACKET_ERR.SUCCESS) {
            res.send(_data);
        } else {
            _data.uuid = data.uuid;
            _data.session_id = data.session_id;
            res.send(_data);
        }
        res.end();
    });
});

/**
 * 섹션아이디로 유저 정보를 가져오기
 */
router.post('/request_userinfo2', (req, res, next) => {
    let _sid = req.body.session_id;
    let _data = {};
    request_userinfo_by_session(_sid, (err, data) => {
        _data.result = err;
        if (err != PACKET_ERR.SUCCESS) {
            res.send(_data);
            res.end();
        } else {
            _data.uuid = data.id;
            _data.nick_name = data.nickname;
            _data.character_type = data.avatar;
            _data.target_typing_speed = data.target_typing_speed;
            _data.target_typing_accuracy = data.target_typing_accuracy;
            _data.clan = data.clan;
            _data.school = data.school;
            res.send(_data);
            res.end();
        }
    });
});

router.post('/insert_new_user', (req, res, next) => {
    let _uuid = req.body.uuid;
    let _nn = req.body.nick_name;
    let _lang = req.body.language;
    let _country = req.body.country;
    let _sid = req.body.session_id;

    write_new_user(_uuid, _nn, _lang, _country, _sid, (err) => {
        res.end();
    });
});

// kevin added
// 회원 탈퇴
router.post('/delete_user', (req, res, next) => {
    var netfficeSettings = req.app.settings.webConfig.netffice;
//    var validOtpURL = netfficeSettings.protocol + "://" + netfficeSettings.host + netfficeSettings.validOtp;
//    console.log('delete_user API URL : '+validOtpURL);
    console.log('%s : %j', req.originalUrl, req.body);
    var validToken = netfficeSettings.token;

    let user_ids = req.body.userIds;
    let token = req.body.token;

    delete_user(user_ids, token, validToken, function(error, result) {
        if (error) {
            console.error(error);
            next(error);
            return;
        }
        res.json(result);
    });
});

// kevin added
// 채널 user count 업데이트
router.post('/update_channel', (req, res, next) => {

    console.log('%s : %j', req.originalUrl, req.body);

    let game_code = req.body.game_code;
    let channel_id = req.body.channel_id;
    let count = req.body.count;

    update_channel(game_code, channel_id, count, function(error) {
        if (error) {
            next(error);
            return;
        }
        res.end();
    });
});

// kevin added
// 채널 user count 조회
router.post('/show_channel', (req, res, next) => {

    console.log('%s : %j', req.originalUrl, req.body);

    let game_code = req.body.game_code;

    show_channel(game_code, function(error, result) {
        if (error) {
            next(error);
            return;
        }
        res.json(result);
    });
});

// kevin added
// AccountDB.Users 테이블 points 업데이트
router.post('/update_point', (req, res, next) => {

    console.log('%s : %j', req.originalUrl, req.body);

    var jpacket = CryptoJS_DE(req.body.packet);
    console.log("/API 포인트  암호화 해독 완성 =========================================== " + JSON.stringify(jpacket));

    let uuid = jpacket.uuid;
    let point = jpacket.point;
    let _nn = jpacket.nick_name;
    let _gc = jpacket.game_code;
    let _date = jpacket.date;

    /*   let uuid       = req.body.uuid;
      let point      = req.body.point;
      let _nn        = req.body.nick_name;
      let _gc        = req.body.game_code; */


    /*  var _packet = decripto(req.body.packet);
     console.log("/write_result >>  포인트 저장합니다.................=========== "+_packet);

     var jpacket = JSON.parse(_packet);

     let uuid       = jpacket.uuid;
     let point      = jpacket.point;
     let _nn        = jpacket.nick_name;
     let _gc        = jpacket.game_code; */

    let _rdata = {};
    update_point(uuid, point, _nn, _gc, _date, function(error, result) {
        if (error != PACKET_ERR.SUCCESS) {
            //next(error);
            _rdata.result = error;
            res.send(_rdata);
            return;
        } else {
            _rdata.result = error;
            res.send(_rdata);
        }
        res.end();
    });
});

const get_point = require('../src/read_game').get_point;
router.post('/get_point', (req, res, next) => {
    let uuid = req.body.uuid;
    let _rdata = {};
    get_point(uuid, (err, data) => {
        if (err != PACKET_ERR.SUCCESS) {
            _rdata.result = err;
            res.send(_rdata);
        } else {
            _rdata.result = err;
            _rdata.point = data;
            res.send(_rdata);
        }
        res.end();
    });

});

const reduce_point = require('../src/write_game').reduce_point;
router.post('/reduce_point', (req, res, next) => {
    console.log(JSON.stringify(req.body));
    let _uuid = req.body.uuid;
    let _point = req.body.point; //차감 포인트
    let _nn = req.body.nick_name;
    let _gc = req.body.game_code;
    let _pos = req.body.pos; // 차감 위치
    let _gi = req.body.item;
    reduce_point(_uuid, _point, _nn, _gc, _pos, _gi, (err) => {
        let _sdata = {};
        _sdata.result = err;
        res.send(_sdata);
        res.end();
    });

});

const check_prohibit_words = require('../src/read_game').check_prohibit_word;
router.post('/check_prohibt_words', (req, res, next) => {
    let _words = req.body.words;
    check_prohibit_words(_words, (err) => {
        let _sdata = {};
        _sdata.result = err;
        res.send(_sdata);
        res.end();
    });
});

router.post('/check_slang_word', (req, res, next) => {
    console.log('called - check_slang_word');
    let _word = req.body.word;
    var slang_word_check = word_pool.check(_word);
    let _sdata = {};
    if(slang_word_check.isFound) {
        _sdata.result = PACKET_ERR.CHECK_PROHIBIT_WORDS_NO_WORDS;
        res.send(_sdata);
        res.end();
    }
    else {
        _sdata.result = PACKET_ERR.SUCCESS;
        res.send(_sdata);
        res.end();
    }
});

module.exports = router;











