var express = require('express');
var router = express.Router();
const PACKET_ERR = require('../src/packet_err').PACKET_ERR;
const read_rank_school = require('../src/read_web_rank').search_rank_week_school;
const read_web_rank = require('../src/read_web_rank').search_rank_week_users;
const MAX_PANCHANGE_PAGE_LIST = require('../src/def').MAX_SETCOIN_PAGE_LIST;
const LOG_MSG_IDX = require('../src/log_msg_idx').LOG_MSG_IDX;
const GAME_CODE = require('../config/game_code');
const redis = require('../src/redis');
const RLI = require('../config/redis.json')[process.env.NODE_ENV || 'development'].PANCHANGE_ROOM_LIST_REDIS;


router.post('/request_rank_school', (req, res, next) => {
    let _page = req.body.month;
    let _gamecode = req.body.gamecode;
    let _rdata = {};
    console.log("들어옴학교_누적_랭킹");

    read_rank_school(_page, _gamecode, (err, data, count) => {
        if (err != PACKET_ERR.SUCCESS) {
            _rdata.result = err;
            res.send(_rdata);
            res.end();
        } else {
            _rdata.totalcount = count;
            _rdata.page = _page;
            data.push(_rdata);
            res.json(data);
            res.end();
        }
    });
});

//개인별 누적 랭킹 (주단위로 select 합니다)
router.post('/request_rank_week_users', (req, res, next) => {
    let _page = req.body.week;
    let _gamecode = req.body.gamecode;
    let _sessionid = req.body.sessionid;
    let _rdata = {};

    console.log("들어옴 주간 ========================================================" + _page);
    read_web_rank(_page, _gamecode, _sessionid, (err, data, count, MyRank) => {
        if (err != PACKET_ERR.SUCCESS) {
            _rdata.result = err;
            console.log("에러 =================" + err);
            res.send(_rdata);
            res.end();
        } else {
            _rdata.totalcount = count;
            _rdata.page = _page;
            data.push(_rdata);
            let Mine = [];

            Mine.push(MyRank);

            let add = {};
            add.MyRank = Mine;

            data.push(add);
            res.json(data);
            res.end();
        }
    });
});


const get_game_rank_redis = require('../src/read_rank_from_redis').get_game_rank_redis;
router.post('/rank_game_redis', (req, res, next) => {
    let _game_code = req.body.gamecode;
    let _start = req.body.start;
    let _end = req.body.end;
    let _sessionid = req.body.sessionid;
    let _last_rank = req.body.last_rank;
    console.log("들어온 세션 --->" + _sessionid);
    let _rdata = {};

    get_game_rank_redis(_game_code, _start, _end, _sessionid, _last_rank, (err, data, count, MyRank, redisTotalCount) => {
        if (err != PACKET_ERR.SUCCESS) {
            _rdata.result = err;
            res.send(_rdata);
            res.end();
        } else {
            _rdata.result = err;
            _rdata.totalcount = count;
            _rdata.redis_total_count = redisTotalCount;

            data.push(_rdata);

            let Mine = [];
            Mine.push(MyRank);
            let add = {};
            add.Mine = Mine;

            data.push(add);
            res.json(data);
            res.end();
        }
    });
});

//get_game_rank_redis_without_selfinfo

const get_game_rank_redis_without_selfinfo = require('../src/read_rank_from_redis').get_game_rank_redis_without_selfinfo;

router.post('/rank_game_redis_without_selfinfo', (req, res, next) => {
    let _game_code = req.body.gamecode;
    let _start = req.body.start;
    let _end = req.body.end;

    let _rdata = {};
    console.log('들어옴' + req.body.gamecode);

    get_game_rank_redis_without_selfinfo(_game_code, _start, _end, (err, data, count) => {
        if (err != PACKET_ERR.SUCCESS) {
            _rdata.result = err;
            res.send(_rdata);
            res.end();
        } else {
            _rdata.result = err;
            _rdata.totalcount = count;
            data.push(_rdata);

            res.json(data);
            res.end();
        }
    });
});

const get_game_rank_redis_school = require('../src/read_rank_from_redis').get_game_rank_redis_school;
router.post('/rank_game_redis_school', (req, res, next) => {
    let _game_code = req.body.gamecode;
    let _start = req.body.start;
    let _end = req.body.end;
    let _sessionid = req.body.sessionid;
    let _last_rank = req.body.last_rank;
    console.log("들어온 세션 --->" + _sessionid);
    let _rdata = {};
    //  get_game_rank_redis_school(_game_code,_start,_end,_sessionid,(err,data,count)=>{
    get_game_rank_redis_school(_game_code, _start, _end, _sessionid, _last_rank, (err, data, count, MyRank, redisTotalCount) => {
        if (err != PACKET_ERR.SUCCESS) {
            _rdata.result = err;
            res.send(_rdata);
            res.end();
        } else {
            _rdata.result = err;
            _rdata.totalcount = count;
            _rdata.redis_total_count = redisTotalCount;

            data.push(_rdata);

            let Mine = [];
            Mine.push(MyRank);
            let add = {};
            add.Mine = Mine;

            data.push(add);
            res.json(data);
            res.end();
        }
    });
});


module.exports = router;