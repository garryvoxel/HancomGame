var express = require('express');
var router = express.Router();
const redis = require('../src/redis');
const RLI = require('../config/redis.json')[process.env.NODE_ENV || 'development'].PANCHANGE_ROOM_CHANNEL_1;
const PACKET_ERR = require('../src/packet_err').PACKET_ERR;
const MAX_PANCHANGE_PAGE_LIST = require('../src/def').MAX_SETCOIN_PAGE_LIST;
const LOG_MSG_IDX = require('../src/log_msg_idx').LOG_MSG_IDX;
const GAME_CODE = require('../config/game_code');
/**
 * 판뒤집기 방 만들기
 */
var write_room = require('../src/write_panchange').panchage_write_room;
router.post('/create_room', (req, res, next) => {
    console.log(req.body);
    let _rn = req.body.room_number;
    let _hn = req.body.host_name;
    let _il = req.body.is_lock;
    let _rt = req.body.room_title;
    let _umc = req.body.user_max_count;
    let _ic = req.body.is_clan;
    let _ip = req.body.ip;
    let _bg = req.body.back_ground;
    let _pt = req.body.play_time;
    let _cn_a = req.body.clan_name_A; //호스트 클랜
    let _cn_b = req.body.clan_name_B; //참여 클랜  (원래는 필요 없으나 게임서버에서 클랜B가 있음을 명시적으로 알리기위해 굳이 받음 "" 로 받는다.)

    console.log("판뒤집기 방만드는데 필요한 UUID ==============================" + req.body.room_number);

    write_room(_rn, _hn, _rt, _ic, _cn_a, _cn_b, _il, _ip, _pt, _bg, _umc, (err) => {
        let _rdata = {};
        _rdata.result = err;
        console.log("비속어 방만들기 최조오오오옹 ==================================" + err);
        res.send(_rdata);
        res.end();
    });
});

const set_play_game = require('../src/write_panchange').set_play_game;
// 게임 플레이중 플레크 업데이트
router.post('/set_play', (req, res, next) => {
    console.log('/set_play ' + JSON.stringify(req.body));
    let _rn = req.body.room_number;
    console.log("판뒤집기 플레이 체크 ==================================" + _rn);
    let _rdata = {};
    set_play_game(_rn, (err) => {
        _rdata.result = err;
        res.send(_rdata);
        res.end();

    });

});

const set_play_game_not = require('../src/write_panchange').set_play_game_not;
// 게임 플레이중 플레크 업데이트
router.post('/set_play_not', (req, res, next) => {
    console.log('/set_play_not ' + JSON.stringify(req.body));
    let _rn = req.body.room_number;
    console.log("판뒤집기 플레이 체크 ==================================" + _rn);
    let _rdata = {};
    set_play_game_not(_rn, (err) => {
        _rdata.result = err;
        res.send(_rdata);
        res.end();

    });

});

const change_room_option = require('../src/write_panchange').change_room_option;
// 룸옵션 변경
router.post('/change_room_option', (req, res, next) => {
    console.log('/change_room_option ' + JSON.stringify(req.body));
    let _rn = req.body.room_num;
    //let _rt = req.body.room_title;
    let _l = req.body.is_lock;
    let _pt = req.body.play_time;
    let _bg = req.body.back_ground;

    let _rdata = {};
    change_room_option(_rn, _l, _pt, _bg, (err) => {
        _rdata.result = err;
        res.send(_rdata);
        res.end();

    });

});

router.post('/request_room_list', (req, res, next) => {
    const room_list_redis = redis.getPanchangeChannel1();
    let page = req.body.page;
    let _rdata = {};
    if (page <= 0) {
        console.log('....1');
        _rdata.result = PACKET_ERR.PANCHANGE_REQUEST_ROOMLIST_PARAMETER;
        res.send(_rdata);
        res.end();
    } else {
        let _cp = page - 1;
        let _from = _cp * MAX_PANCHANGE_PAGE_LIST;
        let _to = _from + (MAX_PANCHANGE_PAGE_LIST - 1);
        let _rif = [];
        room_list_redis.zrevrange(RLI.KEY1, _from, _to, (err1, res1) => {
            if (err1) {
                console.log('....2');
                _rdata.result = PACKET_ERR.PANCHANGE_REQUEST_ROOMLIST_REDIS1;
                res.send(_rdata);
                res.end();
            } else {
                let _len = res1.length;
                let _cntRemain = _len;

                if (_len <= 0) {
                    console.log('....3');
                    _rdata.result = PACKET_ERR.PANCHANGE_REQUEST_ROOMLIST_REDIS1_RES;
                    res.send(_rdata);
                    res.end();              
                } else {
                    /**
                     * 추가 작업 내용
                     * zrevrange에는 방번호가 있는데 룸 상세 정보가 
                     * 없으면 zreverange에서 해당 방번호를 삭제해줘야 한다
                     */
                    for (let i = 0; i < _len; i++) {
                        var _rinfo_key = RLI.KEY2 + '-' + res1[i];
                        console.log('_rinfo_key....' + _rinfo_key + "redis : " + room_list_redis);
                        room_list_redis.hgetall(_rinfo_key, (err2, res2) => {
                            if (err2) {
                                console.log('....4');
                                // _rdata.result = PACKET_ERR.PANCHANGE_REQUEST_ROOMLIST_REDIS2;
                                // res.send(_rdata);
                                // res.end();     
                                --_cntRemain;
                            } else {
                                var _if = {};
                                console.log('.RINFO_KEY.' + _rinfo_key + ' HGETALL.RES.' + res2);
                                if (res2 <= 0) {
                                    // _rdata.result = PACKET_ERR.PANCHANGE_REQUEST_ROOMLIST_REDIS2_RES;
                                    // res.send(_rdata);
                                    // res.end();        
                                    --_cntRemain;
                                } else {
                                    // 룸정보에 하나라도 문제가 있으면 걸러냅니다.
                                    if (isEmpty(res2.room_number) === false &&
                                        isEmpty(res2.room_title) === false &&
                                        isEmpty(res2.host_name) === false) {

                                        _if.room_number = res2.room_number;
                                        _if.room_title = res2.room_title;
                                        _if.host_name = res2.host_name;
                                        _if.is_lock = res2.is_lock;
                                        _if.play_time = res2.play_time;
                                        _if.back_ground = res2.back_ground;
                                        _if.ip = res2.ip;
                                        _if.is_clan = res2.is_clan;
                                        _if.clan_name_A = res2.clan_name_A;
                                        _if.clan_name_B = res2.clan_name_B;
                                        _if.user_max_count = res2.user_max_count;
                                        _if.current_user_count = res2.current_user_count;
                                        _if.is_play = res2.is_play;

                                        --_cntRemain;
                                        _rif.push(_if);
                                        //console.log(JSON.stringify(_if));    
                                    }

                                }
                            }
                            if (_cntRemain === 0) {
                                console.log('....6');
                                _rdata.result = PACKET_ERR.SUCCESS;
                                _rdata.data = _rif;
                                res.send(_rdata);
                                res.end()
                            }
                        });
                    } //for                                                        
                }
            }
        });
    }
});

const delete_room3 = require('../src/delete_panchange').delete_room;


router.post('/delete_room', (req, res, next) => {
    let _rn = req.body.room_number;
    delete_room3(_rn, (err) => {
        let _sdata = {};
        _sdata.result = err;
        console.log("라우터 마지막 관문 ==========================" + err);
        res.send(_sdata);
        res.end();
    })
});


/**
 * 룸 리스트 삭제
 * 클랜 룸리스트 삭제
 */
const delete_room = require('../src/delete_panchange').panchange_delete_room;
const delete_room2 = require('../src/delete_panchange').panchange_delete_room2;
router.post('/delete_room1', (req, res, next) => {
    let _rn = req.body.room_number;
    let _hn = req.body.host_name;
    let _ic = req.body.is_clan;
    let _cn = req.body.clan_name;

    delete_room(_rn, _hn, _ic, _cn, (err) => {
        let _rdata = {};
        _rdata.result = err;
        res.send(_rdata);
        res.end();
    });
});

router.post('/delete_room2', (req, res, next) => {
    let _rn = req.body.room_number;

    delete_room2(_rn, (err) => {
        let _rdata = {};
        _rdata.result = err;
        res.send(_rdata);
        res.end();
    });
});


//룸번호가져오기
//const panchange_room_number_redis               = require('../src/back_redis').panchange_room_number_redis;
const PANCHANGE_ROOM_NUMBER = require('../config/redis.json')[process.env.NODE_ENV || 'development'].PANCHANGE_ROOM_CHANNEL_1;
router.post('/get_room_number', (req, res, next) => {
    const panchange_room_number_redis = redis.getPanchangeChannel1();
    var _data = {};
    panchange_room_number_redis.llen(PANCHANGE_ROOM_NUMBER.KEY4, (err, reply) => {
        if (err) {
            _data.result = PACKET_ERR.PANCHANGE_ROOMNUMBER_REDIS;
            res.send(_data);
            res.end();
            return;
        } else {
            if (reply <= 0) {
                _data.result = PACKET_ERR.PANCHANGE_ROOMNUMBER_EMPTY;
                res.send(_data);
                res.end();
            } else {
                panchange_room_number_redis.rpop(PANCHANGE_ROOM_NUMBER.KEY4, (err1, reply1) => {
                    if (err1) {
                        _data.result = PACKET_ERR.PANCHANGE_ROOMNUMBER_REDIS2;
                        res.send(_data);
                        res.end();
                    } else {
                        if (reply1 <= 0) {
                            _data.result = PACKET_ERR.PANCHANGE_ROOMNUMBER_EMPTY2;
                            res.send(_data);
                            res.end();
                        } else {
                            _data.result = PACKET_ERR.SUCCESS;
                            _data.room_number = reply1;
                            res.send(_data);
                            res.end();
                        }
                    }
                });
            }
        }
    });
});


//==========================================
//룸번호 반환
const return_room_number = require('../src/write_panchange').return_room_number;
router.post('/return_room_number', (req, res, next) => {
    let _rn = req.body.room_number;
    var _data = {};

    return_room_number(_rn, (err) => {
        _data.result = err;
        res.send(_data);
        res.end();
    })

});

/**
 * 방 총 갯수
 */
const get_total_room_list = require('../src/read_panchange').get_total_room_list;
router.post('/get_total_room_list', (req, res, next) => {
    let _rdata = {};
    get_total_room_list((err, data) => {
        _rdata.result = err;
        _rdata.count = data;
        console.log(JSON.stringify(_rdata));
        res.send(_rdata);
        res.end();

    });
});

/**
 * 방번호 찾기
 */
const search_room_num = require('../src/read_panchange').search_room_num;
router.post('/search_room_num', (req, res, next) => {
    let _rn = req.body.room_number;
    var _data = {};
    search_room_num(_rn, (err, data) => {
        if (err) {

            _data.result = err;
            res.send(_data);
            res.end();
        } else {
            _data.result = 0;
            _data.room_number = data.room_number;
            _data.host_name = data.host_name;
            _data.is_lock = data.is_lock;
            _data.room_title = data.room_title;
            _data.ip = data.ip;
            _data.back_ground = data.back_ground;
            _data.play_time = data.play_time;
            _data.is_clan = data.is_clan;
            _data.clan_name_A = data.clan_name_A;
            _data.clan_name_B = data.clan_name_B;
            _data.user_max_count = data.user_max_count;
            _data.current_user_count = data.current_user_count;
            res.send(_data);
            res.end();
        }

    });
});

/**
 * 클랜으로 방 찾기
 */
const get_clan_room = require('../src/read_panchange').get_clan_room;
router.post('/search_clan_room', (req, res, next) => {
    let _cn = req.body.clan_name;
    var _rdata = {};
    var _data = [];
    get_clan_room(_cn, (err, data) => {
        if (err != PACKET_ERR.SUCCESS) {
            _data.result = err;
            res.send(_data);
            res.end();
        } else {
            _rdata.result = 0;
            var _rinfo = {};
            _rinfo.room_number = data.room_number;
            _rinfo.host_name = data.host_name;
            _rinfo.is_lock = data.is_lock;
            _rinfo.room_title = data.room_title;
            _rinfo.ip = data.ip;
            _rinfo.back_ground = data.back_ground;
            _rinfo.play_time = data.play_time;
            _rinfo.is_clan = data.is_clan;
            _rinfo.clan_name_A = data.clan_name_A;
            _rinfo.clan_name_B = data.clan_name_B;
            _rinfo.user_max_count = data.user_max_count;
            _rinfo.current_user_count = data.current_user_count;
            _data.push(_rinfo);
            _rdata.data = _data;
            res.send(_rdata);
            res.end();
        }

    });
});

/**
 * 닉네임으로 찾기
 */
const search_host_name = require('../src/read_panchange').search_host_name;
router.post('/search_host_name', (req, res, next) => {

    console.log('search_host_name >> ' + JSON.stringify(req.body));

    var _nn = req.body.nick_name;
    search_host_name(_nn, (err, data) => {
        if (err != PACKET_ERR.SUCCESS) {
            let _sdata = {};
            _sdata.result = err;
            res.send(_sdata);
            res.end();
        } else {
            res.send(data);
            res.end();
        }


    });

});

const get_user_count = require('../src/read_panchange').get_user_count;
router.post('/request_user_count', (req, res, next) => {
    let _rn = req.body.room_number;
    get_user_count(_rn, (err, data) => {
        if (err != PACKET_ERR.SUCCESS) {
            let _rdata = {};
            _rdata.result = err;
            res.send(_rdata);
            res.end();
        } else {
            res.send(data);
            res.end();
        }
    });
});


const update_clan_B_name = require('../src/write_panchange').update_clan_B_name;
router.post('/update_clan_B_name', (req, res, next) => {
    console.log(req.body);

    let _rn = req.body.room_number;
    let _cB = req.body.clan_name_B;


    console.log("들어옴=============================  업데이트 클랜B  이름" + req.body.clan_name_B);
    update_clan_B_name(_rn, _cB, (err) => {
        let _rdata = {};
        _rdata.result = err;
        res.send(_rdata);
        res.end();
    });
});


const update_user_count = require('../src/write_panchange').update_user_count;
router.post('/update_user_count', (req, res, next) => {
    console.log(req.body);

    let _rn = req.body.room_number;
    let _uc = req.body.user_count;
    update_user_count(_rn, _uc, (err) => {
        let _rdata = {};
        _rdata.result = err;
        res.send(_rdata);
        res.end();
    });
});

const start_end_game_log = require('../src/write_panchange').start_end_game_log;
router.post('/start_end_game_log', (req, res, next) => {

    let _uuid = req.body.uuid;
    let _nn = req.body.nick_name;
    let _gm = req.body.game_mode;
    let _mt = req.body.my_team;
    let _btc = req.body.blue_team_count;
    let _rtc = req.body.red_team_count;
    let _betc = req.body.blue_end_team_count;
    let _retc = req.body.red_end_team_count;
    let _fm = req.body.finish_mode;
    let _wlm = req.body.win_lose_mode;
    let _gst = req.body.game_start_time;
    let _get = req.body.game_end_time;

    console.log("판뒤집기 로그남기기 들어옴 ============================================");


    let _rdata = {};
    start_end_game_log(LOG_MSG_IDX.GAME_PAN_BEGIN_END,
        _uuid, _nn, GAME_CODE.GAME_PAN_CHANGE, _gm, _mt, _btc, _rtc, _betc, _retc, _fm, _wlm, _gst, _get,
        (err) => {
            _rdata.result = err;
            res.send(_rdata);
            res.end();

        });

});

const write_share_facebook = require('../src/write_panchange').write_share_facebook;
const write_share_kakao = require('../src/write_panchange').write_share_kakao;

router.post('/write_share_facebook', (req, res, next) => {

    let _uuid = req.body.uuid;
    let _nn = req.body.nick_name;
    let _tier_1 = req.body.tier_1;
    let _tier_2 = req.body.tier_2;
    let _pr = req.body.personal_rank;
    let _sr = req.body.school_rank;
    let _s = req.body.score;
    let _wc = req.body.win_count;
    let _tc = req.body.typing_count;
    let _acc = req.body.acc;
    let _pos = req.body.pos;

    write_share_facebook(LOG_MSG_IDX.SCORE_SHARE_FACEBOOK, _uuid, _nn, GAME_CODE.GAME_PAN_CHANGE,
        _tier_1, _tier_2, _pr, _sr, _s, _wc, _tc, _acc, _pos, (err) => {

            let _rdata = {};
            _rdata.result = err;
            res.send(_rdata);
            res.end();
        });

})

router.post('/write_share_kakao', (req, res, next) => {
    let _uuid = req.body.uuid;
    let _nn = req.body.nick_name;
    let _tier_1 = req.body.tier_1;
    let _tier_2 = req.body.tier_2;
    let _pr = req.body.personal_rank;
    let _sr = req.body.school_rank;
    let _s = req.body.score;
    let _wc = req.body.win_count;
    let _tc = req.body.typing_count;
    let _acc = req.body.acc;
    let _pos = req.body.pos;

    write_share_kakao(LOG_MSG_IDX.SCORE_SHARE_KAKAOTALK, _uuid, _nn, GAME_CODE.GAME_PAN_CHANGE,
        _tier_1, _tier_2, _pr, _sr, _s, _wc, _tc, _acc, _pos, (err) => {

            let _rdata = {};
            _rdata.result = err;
            res.send(_rdata);
            res.end();
        });
})


const update_ranking = require('../src/write_panchange').update_ranking;
/***
 * 판뒤집기 랭킹 저장
 */
router.post('/write_ranking', (req, res, next) => {
    let uuid = req.body.uuid;
    let nick_name = req.body.nick_name;
    let win = req.body.win;
    let state = req.body.state;

    console.log("판뒤집기 업데이트트트 랭킹 =========================닉네임=====>" + req.body.nick_name);
    console.log("판뒤집기 업데이트트트 랭킹 =========================점수=====>" + req.body.win);

    update_ranking(uuid, nick_name, win, state, (err) => {
        let _rdata = {};
        _rdata.result = err;
        res.send(_rdata);
        res.end();
    });
});


const auto_enter = require('../src/read_panchange').auto_enter;
/**
 * 판뒤집기 자동입장
 */
router.post('/auto_enter', (req, res, next) => {
    console.log("그냥 클랜 들어옴 =================================");
    auto_enter((err, data) => {
        res.send(data);
        res.end();
    });
});

const clan_auto_enter = require('../src/read_panchange').auto_clan_enter_by_nickname;
router.post('/clan_auto_enter', (req, res, next) => {
    console.log(JSON.stringify());
    let _sdata = {};
    if (req.body.nickname === null || req.body.nickname === undefined) {
        console.log("오토클랜이지만 ==================================비었다!!!!");
        res.send(_sdata);
        res.end();
    } else {
        console.log("오토 클랜 들어옴 =================================" + req.body.nickname);

        //클랜네임을 닉네임으로 받습니다. 종전 클랜네임으로 찾는게 문제가 있엇음.
        //이유는 자기 클랜이 신규 클랜으로 반지를 못함.
        //결과가 0이면 클랜명으로 방찾은것이고 아니면 1 , 모든경우에도 nickname에 따른 클랜정보를 리스폰스 한다.
        let _nickname = req.body.nickname;
        clan_auto_enter(_nickname, (err, data) => {
            if (err != PACKET_ERR.SUCCESS) {

                console.log("클랜 자동입장 매칭 실패후 리스폰스 ======================" + data)
                _sdata.result = err;
                res.send(data);
                res.end();
            } else {
                res.send(data);
                res.end();
            }
        });

    }



})

const read_result = require('../src/read_panchange').read_result;

/**
 * 판뒤집기 게임 결과 불러오기
 */
router.post('/request_game_result', (req, res, next) => {
    let _uuid = req.body.uuid;
    let _rdata = {};
    let _data = [];
    read_result(_uuid, (err, data) => {
        if (err != PACKET_ERR.SUCCESS) {
            _rdata.result = err;
            _rdata.data = _data;
            res.send(_rdata);
            res.end();
        } else {
            res.send(data);
            res.end();
        }
    })
});

const write_result = require('../src/write_panchange').write_result;
/**
 * 판뒤집기 결과 저장
 */
const CryptoJS_DE = require('../common/util').CryptoJS_DE;
router.post('/write_game_result', (req, res, next) => {

    console.log("/API 판뒤집기 req 정보  받았어요 =========================================== " + req.body.packet);

    var jpacket = CryptoJS_DE(req.body.packet);

    console.log("/API 판뒤집기 암호화 해독 완성 =========================================== " + JSON.stringify(jpacket));

    let _uuid = jpacket.uuid;
    let _state = jpacket.state;
    let _nn = jpacket.nick_name;
    var _date = jpacket.date;
    let _win = jpacket.win;
    let _rdata = {};

    /* console.log("판뒤집기 결과 저장 uuid ====================================="+_uuid);
    console.log("판뒤집기 결과 저장 _state ====================================="+_state);
    console.log("판뒤집기 결과 저장 닉네 ====================================="+_nn); */

    write_result(_uuid, _nn, _state, _win, _date, (err, data) => {
        if (err != PACKET_ERR.SUCCESS) {
            _rdata.result = err;
            res.send(_rdata);
        } else {
            res.send(data);
        }
        res.end();

    });
});

const request_total_room_list = require('../src/read_panchange').request_total_room_list;

router.post('/request_total_room_list', (req, res, next) => {
    request_total_room_list((err, data) => {
        let _rdata = {};
        if (err != PACKET_ERR.SUCCESS) {
            _rdata.result = err;
            res.send(_rdata);
        } else {
            res.send(data);
        }
        res.end();
    });
});

const request_room_list_flush = require('../src/write_panchange').request_room_list_flush;
router.post('/request_room_list_flush', (req, res, next) => {


    console.log('update_usercount >> ' + JSON.stringify(req.body));
    let channel = req.body.channel;

    request_room_list_flush(channel, (err) => {
        let _rdata = {};
        _rdata.result = err;
        res.send(_rdata);
        res.end();
    });
});

//동전쌓기 랭킹 가져오기
const request_ranking = require('../src/read_panchange').request_ranking;
router.post('/request_ranking', (req, res, next) => {
    let _page = req.body.page;

    request_ranking(_page, (err, data) => {
        let _rdata = {};
        if (err != PACKET_ERR.SUCCESS) {
            _rdata.result = err;
            res.send(_rdata);
        } else {
            res.send(data);
        }

        res.end();
    });
});


//방장 변경
const change_host_name = require('../src/write_panchange').write_change_host_name;
router.post('/request_change_host_name', (req, res, next) => {
    let _pre_host_name = req.body.pre_host_name;
    let _new_host_name = req.body.next_host_name;
    let _room_number = req.body.room_num;
    console.log('/request_change_host_name : ' + JSON.stringify(req.body));
    change_host_name(_room_number, _pre_host_name, _new_host_name, (err) => {
        let _sdata = {};
        _sdata.result = err;
        res.send(_sdata);
        res.end();
    });
});

const write_reset_room_clan_name_A = require('../src/write_panchange').write_reset_room_clan_name;
router.post('/change_clan_room_host', (req, res, next) => {
    let _room_number = req.body.room_number;
    let _pre_clan_name = req.body.pre_clan_name_A;
    let _new_clan_name = req.body.new_clan_name_A;

    write_reset_room_clan_name_A(_room_number, _pre_clan_name, _new_clan_name, (err) => {
        let _sdata = {};
        _sdata.result = err;
        res.send(_sdata);
        res.end();
    });
});

/* const write_reset_room_clan_name_A = require('../src/write_panchange').write_reset_room_clan_name_A;
const write_reset_room_clan_name_B = require('../src/write_panchange').write_reset_room_clan_name_B;
router.post('/change_clan_room_host_A_OR_B',(req,res,next)=>{
    let _room_number    = req.body.room_number;
    let _pre_clan_name  = req.body.pre_clan_name_PREV;
    let _new_clan_name_A  = req.body.new_clan_name_A;
    let _new_clan_name_B = req.body.new_clan_name_B;

    if(isEmpty(_new_clan_name_A)){
        write_reset_room_clan_name_B(_room_number,_pre_clan_name,_new_clan_name_B,(err)=>{
            let _sdata = {};
            _sdata.result = err;
            res.send(_sdata);
            res.end();
        });
    }else{
        write_reset_room_clan_name_A(_room_number,_pre_clan_name,_new_clan_name_A,(err)=>{
            let _sdata = {};
            _sdata.result = err;
            res.send(_sdata);
            res.end();
        });
    }
}) */

function isEmpty(value) {
    if (value == "" || value == null || value == undefined || (value != null && typeof value == "object" && !Object.keys(value).length)) {
        return true
    } else {
        return false
    }


};

module.exports = router;