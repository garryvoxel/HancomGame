var express = require('express');
const PACKET_ERR = require('../src/packet_err').PACKET_ERR;

const CryptoJS_EN = require('../common/util').CryptoJS_EN;
const CryptoJS_DE = require('../common/util').CryptoJS_DE;

var router = express.Router();

String.prototype.replaceAll = function(org, dest) {
    return this.split(org).join(dest);
}

/* SDK 새로운 게임을 등록합니다. 헤더 키값 통해 게임이름을 넣고 코드를 받습니다. */
const Register_game = require('../common/component_write').Register_game;
router.get('/regit_new_game', (req, res, next) => {
    var txt = req.header('game_name');
    let game_name = txt.replaceAll('"', '');
    console.log("[  SDK Register_game   ] ----- 게임이름 -----" + game_name);

    Register_game(game_name, (err, game_code) => {

        let _data = {};
        if (err === PACKET_ERR.SUCCESS) {
            _data.result = err;
            _data.gamecode = game_code;
            res.send(_data);
        } else {
            _data.result = err;
            _data.gamecode = -1;
            res.send(_data);
        }

    });

});

const GetRealTimeRank = require('../src/write_v1_sdk_game').GetRealTimeRank
router.get('/get_realtime_user_rank', (req, res, next) => {

    var session_id = req.header('session_id');
    var start_num = req.header('start_num');
    var end_num = req.header('end_num');
    var game_code = req.header('game_code');
    var last_rank = req.header('last_rank');

    GetRealTimeRank(game_code, session_id, start_num, end_num, last_rank, (err, rank_data, mine, count) => {

        let _data = {};
        if (err !== PACKET_ERR.SUCCESS) {
            _data.result = err;
            res.send(_data);
        } else {
            _data.result = err;
            _data.total_count = count;
            _data.rankdata = rank_data;
            _data.my_rank = mine;
            
            res.send(_data);
        }

    });

});

const GetScRealTimeRank = require('../src/write_v1_sdk_game').GetScRealTimeRank
router.get('/get_realtime_sc_rank', (req, res, next) => {

    var session_id = req.header('session_id');
    var start_num = req.header('start_num');
    var end_num = req.header('end_num');
    var game_code = req.header('game_code');
    var last_rank = req.header('last_rank');

    GetScRealTimeRank(game_code, session_id, start_num, end_num, last_rank, (err, rank_data, mine, count) => {

        let _data = {};
        if (err !== PACKET_ERR.SUCCESS) {
            _data.result = err;
            res.send(_data);
        } else {
            _data.result = err;
            _data.total_count = count;
            _data.rankdata = rank_data;
            _data.my_rank = mine;
            
            res.send(_data);
        }

    });

});

/* SDK 게임 데이터를 저장 합니다. */
const GameDataSave = require('../src/write_v1_sdk_game').GameDataSave;
router.post('/save_game_data', (req, res, next)=>{

    let _game_code  = req.body.game_code;
    let _session_id = req.body.session_id;
    let _main_score = req.body.main_score;
    let _sub_score  = req.body.sub_score;
    let _game_data  = req.body.game_data; // 제이슨 형태 입니다.

    GameDataSave(_game_code,_session_id,_main_score,_sub_score,_game_data, (err)=>{
        console.log("라우터 ---------------------"+err);
        let _rdata = {};
        _rdata.result = err;
        res.send(_rdata);
        res.end();
    });

});

/* 개인 기준으로 게임 전적을 실시간 랭킹에 적용합니다. */
const InsertRealTimeRank = require('../src/write_v1_sdk_game').InsertRealTimeRank
router.post('/save_realtime_rank', (req, res, next)=>{

    let _game_code  = req.body.game_code;
    let _session_id = req.body.session_id;
    let _score = req.body.score;
  

    InsertRealTimeRank(_game_code,_session_id,_score,(err)=>{
        console.log("라우터 ---------------------"+err);
        let _rdata = {};
        _rdata.result = err;
        res.send(_rdata);
        res.end();
    });

});

/* 학교기준으로 게임전적을 실시간 랭킹에 적용합니다. */
const InsertRealTimeSchoolRank = require('../src/write_v1_sdk_game').InsertRealTimeSchoolRank
router.post('/save_realtime_school_rank', (req, res, next)=>{

    let _game_code  = req.body.game_code;
    let _session_id = req.body.session_id;
    let _score = req.body.score;
  

    InsertRealTimeSchoolRank(_game_code,_session_id,_score,(err)=>{
        console.log("라우터 ---------------------"+err);
        let _rdata = {};
        _rdata.result = err;
        res.send(_rdata);
        res.end();
    });

});

/* 게임의 누적 전적 정보를 내려 받습니다. */
const Get_game_result = require('../common/component_read').Get_game_result;
router.get('/get_game_result', (req, res, next) => {
    var session_id = req.header('session_id');
    var game_code = req.header('game_code');
    let _session_id = session_id.replaceAll('"', '');
    let _game_code = game_code.replaceAll('"', '');

    console.log("[  SDK Get_game_result   ] ----- 세션아이디 -----" + _session_id);
    console.log("[  SDK Get_game_result   ] ----- 게임  코드 -----" + _game_code);

    Get_game_result(_session_id, _game_code, (err, result_data) => {

        let _data = {};
        if (err === PACKET_ERR.SUCCESS) {
            _data.result = err;
            _data.game_data = result_data;
            res.send(_data);
        } else {
            _data.result = err;
            _data.game_data = -1;
            res.send(_data);
        }

    });

});


/* 게임의 저장정보인 JSON 데이터를 내려 받습니다. */
const Get_game_json_data = require('../common/component_read').Get_game_json_data;
router.get('/get_game_json_result', (req, res, next) => {
    var session_id = req.header('session_id');
    var game_code = req.header('game_code');
    let _session_id = session_id.replaceAll('"', '');
    let _game_code = game_code.replaceAll('"', '');

    console.log("[  SDK Get_game_result   ] ----- 세션아이디 -----" + _session_id);
    console.log("[  SDK Get_game_result   ] ----- 게임  코드 -----" + _game_code);

    Get_game_json_data(_session_id, _game_code, (err, result_data) => {

        let _data = {};
        if (err === PACKET_ERR.SUCCESS) {
            _data.result = err;
            _data.game_data = result_data;
            res.send(_data);
        } else {
            _data.result = err;
            _data.game_data = -1;
            res.send(_data);
        }

    });

});

/* 유저의 주간 누적 랭킹을 받습니다. */
const Get_week_user_rank = require('../common/component_read').Get_week_user_rank;
router.get('/get_week_user_rank', (req, res, next) => {
    var game_code = req.header('game_code');
    var session_id = req.header('session_id');
    var start_date = req.header('start_date');
    var end_date = req.header('end_date');

    console.log("[  SDK Get_week_user_rank   ] ----- 세션아이디 -----" + session_id);
    console.log("[  SDK Get_week_user_rank   ] ----- start_date -----" + start_date);

    Get_week_user_rank(game_code, start_date,end_date, session_id, (err, result_data, my_rank) => {

        let _data = {};
        if (err === PACKET_ERR.SUCCESS) {
            _data.result = err;
            _data.rank_data = result_data;
            _data.my_rank = my_rank;

            res.send(_data);
        } else {
            _data.result = err;
            _data.rank_data = -1;
            res.send(_data);
        }

    });

});

/* 학교의 주간 누적 랭킹을 받습니다. */
const Get_week_school_rank = require('../common/component_read').Get_week_school_rank;
router.get('/get_week_school_rank', (req, res, next) => {
    var game_code = req.header('game_code');
    var session_id = req.header('session_id');
    var start_date = req.header('start_date');
    var end_date = req.header('end_date');

    console.log("[  SDK Get_week_school_rank   ] ----- 세션아이디 -----" + session_id);
    console.log("[  SDK Get_week_school_rank   ] ----- start_date -----" + start_date);

    Get_week_school_rank(game_code, start_date,end_date, session_id, (err, result_data, my_rank) => {

        let _data = {};
        if (err === PACKET_ERR.SUCCESS) {
            _data.result = err;
            _data.rank_data = result_data;
            _data.my_rank = my_rank;
            res.send(_data);
        } else {
            _data.result = err;
            _data.rank_data = -1;
            res.send(_data);
        }

    });

});


/* 게임의 포인트를 세이브 합니다. */
const Insert_game_point = require('../common/component_write').Insert_game_point;
router.post('/save_point', (req, res, next)=>{

    var _session_id = req.body.session_id;
    var _game_code  = req.body.game_code;
    var _point = req.body.point;

    Insert_game_point(_game_code , _session_id, _point, (err)=>{

        let _rdata = {};

        _rdata.result = err;

        res.send(_rdata);
        res.end();
    });
});



module.exports = router;