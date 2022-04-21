var express = require('express');
var router = express.Router();
const PACKET_ERR = require('../src/packet_err').PACKET_ERR;

const write_typing_pos_practice = require('../src/write_typing').write_typing_pos_practice;
const write_typing_word_practice = require('../src/write_typing').write_typing_word_practice;
const write_typing_long_word_practice = require('../src/write_typing').write_typing_long_word_practice;
const write_typing_setup = require('../src/write_typing').write_typing_setup;


const read_typing_pos_practice = require('../src/read_typing').read_typing_pos_practice;
const read_typing_word_practice = require('../src/read_typing').read_typing_word_practice;
const read_typing_long_word_practice = require('../src/read_typing').read_typing_long_word_practice;
const read_typing_setup = require('../src/read_typing').read_typing_setup;

const CryptoJS_EN = require('../common/util').CryptoJS_EN;
const CryptoJS_DE = require('../common/util').CryptoJS_DE;

router.post('/write_typing_pos_practice', (req, res, next) => {
    let _uuid = req.body.uuid;
    let _step = req.body.step;
    let _language = req.body.language;
    let _is_complete = req.body.is_complete;

    write_typing_pos_practice(_uuid, _step, _language, _is_complete, (err) => {
        let _rdata = {};
        _rdata.result = err;
        res.send(_rdata);
        res.end();
    });
});

router.post('/write_typing_word_practice', (req, res, next) => {
    let _uuid = req.body.uuid;
    let _step = req.body.step;
    let _language = req.body.language;
    let _is_complete = req.body.is_complete;

    write_typing_word_practice(_uuid, _step, _language, _is_complete, (err) => {
        let _rdata = {};
        _rdata.result = err;
        res.send(_rdata);
        res.end();
    });
});

/**
 * 긴말 연습 저장하기
 */
router.post('/write_typing_long_word_practice', (req, res, next) => {
    let _uuid = req.body.uuid;
    let _step = req.body.step;
    let _language = req.body.language;
    let _content = req.body.content;
    let _is_practice = req.body.is_practice;
    let _is_verify = req.body.is_verify;

    write_typing_long_word_practice(_uuid, _language, _step, _content, _is_practice, _is_verify, (err) => {
        let _rdata = {};
        _rdata.result = err;
        res.send(_rdata);
        res.end();
    });
});

router.post('/write_typing_setup', (req, res, next) => {
    let _uuid = req.body.uuid;
    let _keyboard1 = req.body.keyboard1;
    let _keyboard2 = req.body.keyboard2;
    let _language = req.body.language;
    let _sound = req.body.sound;
    let _finger_guide = req.body.finger_guide;
    write_typing_setup(_uuid, _keyboard1, _keyboard2, _language, _sound, _finger_guide, (err) => {
        let _rdata = {};
        _rdata.result = err;
        res.send(_rdata);
        res.end();
    });
});


const write_typing_continue_play = require('../src/write_typing').write_typing_continue_play;
/**
 * 이어가기 한글 저장하기
 */

router.post('/write_typing_continue_play', (req, res, next) => {
    let _uuid = req.body.uuid;
    let _language = req.body.language;
    let _type = req.body.type;
    let _pos = req.body.pos;
    let _page = req.body.page;
    let _acc = req.body.acc;
    let _kind = req.body.kind;
    let _rdata = {};
    write_typing_continue_play(_uuid, _language, _type, _pos, _page, _acc, _kind, (err) => {

        _rdata.result = err;
        res.send(_rdata);
        res.end();

    });
});


router.post('/request_typing_pos_practice', (req, res, next) => {
    let _uuid = req.body.uuid;
    let _rdata = {};
    read_typing_pos_practice(_uuid, (err, data) => {
        if (err != PACKET_ERR.SUCCESS) {
            _rdata.result = err;
            res.send(_rdata);
            res.end();
        } else {
            res.send(data);
            res.end();
        }
    });
});


router.post('/request_typing_word_practice', (req, res, next) => {
    let _uuid = req.body.uuid;
    let _rdata = {};
    read_typing_word_practice(_uuid, (err, data) => {
        if (err != PACKET_ERR.SUCCESS) {
            _rdata.result = err;
            res.send(_rdata);
            res.end();
        } else {
            res.send(data);
            res.end();
        }
    });
});

/**
 * 긴말연습 불러오기
 */

router.post('/request_typing_long_word_practice', (req, res, next) => {
    let _uuid = req.body.uuid;
    let _rdata = {};
    read_typing_long_word_practice(_uuid, (err, data) => {
        if (err != PACKET_ERR.SUCCESS) {
            _rdata.result = err;
            res.send(_rdata);
            res.end();
        } else {
            res.send(data);
            res.end();
        }
    });
});

/**
 * 타자 연습 설정 불러오기
 */
router.post('/request_typing_setup', (req, res, next) => {
    let _uuid = req.body.uuid;
    let _rdata = {};
    read_typing_setup(_uuid, (err, data) => {
        if (err != PACKET_ERR.SUCCESS) {
            _rdata.result = err;
            res.send(_rdata);
            res.end();
        } else {
            res.send(data);
            res.end();
        }
    });
});

const read_typing_continue_play = require('../src/read_typing').read_typing_continue_play;
/**
 * 이어가기 불러오기
 */
router.post('/request_typing_continue_play', (req, res, next) => {
    let _uuid = req.body.uuid;
    let _rdata = {};
    read_typing_continue_play(_uuid, (err, data) => {
        if (err != PACKET_ERR.SUCCESS) {
            _rdata.result = err;
            res.send(_rdata);
            res.end();
        } else {
            res.send(data);
            res.end();
        }
    });
});

const write_game_result = require('../src/write_typing').write_game_result;
router.post('/write_game_result', (req, res, next) => {

    console.log("/API 타이핑 들어와용오옹======================================");
    console.log("/API 타이핑 암호 req 정보  받았어요 =========================================== " + req.body.packet);
    const jpacket = CryptoJS_DE(req.body.packet);

    console.log("/API  타이핑  암호화 해독 완성 =========================================== " + JSON.stringify(jpacket));

    let _uuid = Number(jpacket.uuid);
    let _score = Number(jpacket.score);
    let _speed = Number(jpacket.speed);
    let _nn = jpacket.nick_name;
    let _date = jpacket.date;

   /*  let _uuid   = req.body.uuid;
    let _score  = req.body.score;
    let _speed  = req.body.speed;
    let _nn     = req.body.nick_name;
    let _date = 0; */

    let _rdata = {};
    write_game_result(_uuid, _nn, _score, _date, (err, data) => {
        _rdata.result = err;
        res.send(_rdata);
        res.end();
    });
});

const read_game_result = require('../src/read_typing').read_game_result;
router.post('/request_game_result', (req, res, next) => {

    let _uuid = req.body.uuid;
    var _rdata = {};
    read_game_result(_uuid, (err, data) => {
        if (err != PACKET_ERR.SUCCESS) {
            _rdata.result = err;
            res.send(_rdata);
        } else {
            res.send(data);
        }
        res.end();
    });

});


/**
 * 이벌식 글쇠별 타수 
 */
const write_two_typing_speed = require('../src/write_typing').write_two_typing_speed;
router.post('/write_two_typing_speed', (req, res, next) => {
    let _uuid = req.body.uuid;
    let _language = req.body.language;
    let _idx_array = req.body.idx_array;
    let _count_array = req.body.count_array;

    write_two_typing_speed(_uuid, _language, _idx_array, _count_array, (err) => {
        let _rdata = {};
        _rdata.result = err;
        res.send(_rdata);
        res.end();
    });
});


const read_day_typing_speed = require('../src/read_typing').read_day_typing_speed;
router.post('/read_day_typing_speed_stat', (req, res, next) => {
    let _uuid = req.body.uuid;
    let _language = req.body.language;

    console.log("타이핑 통계 언어 =======================" + _language);

    read_day_typing_speed(_uuid, _language, (err, data) => {
        let _sdata = {};
        if (err != PACKET_ERR.SUCCESS) {
            _sdata.result = err;
            res.send(_sdata);
            res.end();
        } else {
            res.send(data);
            res.end();
        }

    });

})

const read_month_typing_speed = require('../src/read_typing').read_month_typing_speed;
router.post('/read_month_typing_speed_stat', (req, res, next) => {
    let _uuid = req.body.uuid;
    let _language = req.body.language;
    let _year = req.body.year;
    let _month = parseInt(req.body.month);
    _month = _month < 10 ? '0' + _month : '' + _month;

    read_month_typing_speed(_uuid, _language, _year, _month, (err, data) => {
        let _sdata = {};
        if (err != PACKET_ERR.SUCCESS) {
            _sdata.result = err;
            res.send(_sdata);
            res.end();
        } else {
            res.send(data);
            res.end();
        }

    });

})


const write_two_word_acc = require('../src/write_typing').write_two_word_acc;
/** 
 * 이벌식 글쇠별 정확도
 */
router.post('/write_two_word_acc', (req, res, next) => {
    let _uuid = req.body.uuid;
    let _language = req.body.language;
    let _idx_array = req.body.idx_array;
    let _input_total_array = req.body.input_total_array;
    let _total_acc_array = req.body.total_acc_array;

    write_two_word_acc(_uuid, _language, _idx_array, _input_total_array, _total_acc_array, (err) => {
        let _rdata = {};
        _rdata.result = err;
        res.send(_rdata);
        res.end();
    });


});


const read_day_typing_acc = require('../src/read_typing').read_day_typing_acc;
router.post('/read_day_typing_acc', (req, res, next) => {
    let _uuid = req.body.uuid;
    let _language = req.body.language;

    read_day_typing_acc(_uuid, _language, (err, data) => {
        let _sdata = {};
        if (err != PACKET_ERR.SUCCESS) {
            _sdata.result = err;
            res.send(_sdata);
            res.end();
        } else {
            res.send(data);
            res.end();
        }

    });

})
const read_month_typing_acc = require('../src/read_typing').read_month_typing_acc;
router.post('/read_month_typing_acc', (req, res, next) => {
    let _uuid = req.body.uuid;
    let _language = req.body.language;
    let _year = req.body.year;
    let _month = parseInt(req.body.month);
    _month = _month < 10 ? '0' + _month : '' + _month;

    read_month_typing_acc(_uuid, _language, _year, _month, (err, data) => {
        let _sdata = {};
        if (err != PACKET_ERR.SUCCESS) {
            _sdata.result = err;
            res.send(_sdata);
            res.end();
        } else {
            res.send(data);
            res.end();
        }

    });
})



const write_two_word_velocity = require('../src/write_typing').write_two_word_velocity;
/**
 * 글쇠별 속도
 */

router.post('/write_two_word_velocity', (req, res, next) => {
    let _uuid = req.body.uuid;
    let _language = req.body.language;
    let _idx_array = req.body.idx_array;
    let _input_total_array = req.body.input_total_array;
    let _total_velocity_array = req.body.total_velocity_array;


    write_two_word_velocity(_uuid, _language, _idx_array, _input_total_array, _total_velocity_array, (err) => {
        let _rdata = {};
        _rdata.result = err;
        res.send(_rdata);
        res.end();
    });
});

const read_day_word_velocity = require('../src/read_typing').read_day_word_velocity;
router.post('/read_day_word_velocity', (req, res, next) => {
    let _uuid = req.body.uuid;
    let _language = req.body.language;

    read_day_word_velocity(_uuid, _language, (err, data) => {
        let _sdata = {};
        if (err != PACKET_ERR.SUCCESS) {
            _sdata.result = err;
            res.send(_sdata);
            res.end();
        } else {
            res.send(data);
            res.end();
        }

    });
})
const read_month_word_velocity = require('../src/read_typing').read_month_word_velocity;
router.post('/read_month_word_velocity', (req, res, next) => {
    let _uuid = req.body.uuid;
    let _language = req.body.language;
    let _year = req.body.year;
    let _month = parseInt(req.body.month);
    _month = _month < 10 ? '0' + _month : '' + _month;

    read_month_word_velocity(_uuid, _language, _year, _month, (err, data) => {
        let _sdata = {};
        if (err != PACKET_ERR.SUCCESS) {
            _sdata.result = err;
            res.send(_sdata);
            res.end();
        } else {
            res.send(data);
            res.end();
        }

    });

})






const write_two_word_finger_speed = require('../src/write_typing').write_two_word_finger_speed;

/**
 * 손가락 빠르기
 */
router.post('/write_two_word_finger_speed', (req, res, next) => {
    let _uuid = req.body.uuid;
    let _language = req.body.language;
    let _idx_array = req.body.idx_array;
    let _input_total_array = req.body.input_total_array;
    let _total_speed_array = req.body.total_speed_array;


    write_two_word_finger_speed(_uuid, _language, _idx_array, _input_total_array, _total_speed_array, (err) => {
        let _rdata = {};
        _rdata.result = err;
        res.send(_rdata);
        res.end();
    });
});

const read_day_two_word_finger_speed = require('../src/read_typing').read_day_two_word_finger_speed;
router.post('/read_day_two_word_finger_speed', (req, res, next) => {
    let _uuid = req.body.uuid;
    let _language = req.body.language;

    read_day_two_word_finger_speed(_uuid, _language, (err, data) => {
        let _sdata = {};
        if (err != PACKET_ERR.SUCCESS) {
            _sdata.result = err;
            res.send(_sdata);
            res.end();
        } else {
            res.send(data);
            res.end();
        }

    });
})
const read_month_two_word_finger_speed = require('../src/read_typing').read_month_two_word_finger_speed;
router.post('/read_month_two_word_finger_speed', (req, res, next) => {
    let _uuid = req.body.uuid;
    let _language = req.body.language;
    let _year = req.body.year;
    let _month = req.body.month;
    _month = _month < 10 ? '0' + _month : '' + _month;

    read_month_two_word_finger_speed(_uuid, _language, _year, _month, (err, data) => {
        let _sdata = {};
        if (err != PACKET_ERR.SUCCESS) {
            _sdata.result = err;
            res.send(_sdata);
            res.end();
        } else {
            res.send(data);
            res.end();
        }

    });
})

/**
 * 타자속도 불러오기
 */
const read_two_typing_speed = require('../src/read_typing').read_two_typing_speed;
router.post('/read_two_typing_speed', (req, res, next) => {
    let _uuid = req.body.uuid;
    let _language = req.body.language;
    let _rdata = {};
    read_two_typing_speed(_uuid, _language, (err, data) => {

        if (err != PACKET_ERR.SUCCESS) {
            _rdata.result = err;
            res.send(_rdata);
            res.end();
        } else {
            res.send(data);
            res.end();
        }
    });

});


const read_two_word_acc = require('../src/read_typing').read_two_word_acc;
/**
 * 글쇠별 정확도 불러오기
 */
router.post('/read_two_word_acc', (req, res, next) => {
    let _uuid = req.body.uuid;
    let _language = req.body.language;
    let _rdata = {};
    read_two_word_acc(_uuid, _language, (err, data) => {
        if (err != PACKET_ERR.SUCCESS) {
            _rdata.result = err;
            res.send(_rdata);
            res.end();
        } else {
            res.send(data);
            res.end();
        }
    });

});

const read_two_word_velocity = require('../src/read_typing').read_two_word_velocity;
/**
 * 글쇠별 속도 불러오기
 */
router.post('/read_two_word_velocity', (req, res, next) => {
    let _uuid = req.body.uuid;
    let _language = req.body.language;
    read_two_word_velocity(_uuid, _language, (err, data) => {
        if (err != PACKET_ERR.SUCCESS) {
            _rdata.result = err;
            res.send(_rdata);
            res.end();
        } else {
            res.send(data);
            res.end();
        }
    });

});



const read_two_word_finger_speed = require('../src/read_typing').read_two_word_finger_speed;
/**
 * 글쇠별 손가락 빠르기 불러오기
 */
router.post('/read_two_word_finger_speed', (req, res, next) => {
    console.log('read_two_word_finger_speed : ' + JSON.stringify(req.body));
    let _uuid = req.body.uuid;
    let _language = req.body.language;
    let _rdata = {};
    read_two_word_finger_speed(_uuid, _language, (err, data) => {
        if (err != PACKET_ERR.SUCCESS) {
            _rdata.result = err;
            res.send(_rdata);
            res.end();
        } else {
            res.send(data);
            res.end();
        }
    });
});


const update_ranking = require('../src/write_typing').update_ranking;
/***
 * 타자연습 랭킹 저장
 */
router.post('/write_ranking', (req, res, next) => {
    let _nn = req.body.nick_name;
    let _score = req.body.score;

    update_ranking(_nn, _score, (err) => {
        let _rdata = {};
        _rdata.result = err;
        res.send(_rdata);
        res.end();
    });
});

const send_mail = require('../src/write_typing').send_mail;
router.post('/send_mail', (req, res, next) => {
    let _tm = req.body.to_mail;
    let _mt = req.body.mail_title;
    let _con = req.body.content;
    let _uuid = req.body.uuid;
    let _nn = req.body.nick_name;

    send_mail(_mt, _tm, _con, _uuid, _nn, (err) => {
        let _rdata = {};
        _rdata.result = err;
        res.send(_rdata);
        res.end();
    });
});

const start_end_game_log = require('../src/write_typing').start_end_game_log;
const LOG_MSG_IDX = require('../src/log_msg_idx').LOG_MSG_IDX;
const GAME_CODE = require('../config/game_code.json');
router.post('/start_end_game_log', (req, res, next) => {

    let _uuid = req.body.uuid;
    let _nn = req.body.nick_name;
    let _tk = req.body.typing_kind;
    let _mk = req.body.middle_kind;
    let _sk = req.body.small_kind;
    let _lwid = req.body.long_word_id;
    let _icm = req.body.is_clear_mode;
    let _st = req.body.game_start_time;
    let _et = req.body.game_end_time;
    start_end_game_log(LOG_MSG_IDX.GAME_TYPE_BEGIN_END, _uuid, _nn, GAME_CODE.GAME_TYPING,
        _tk, _mk, _sk, _lwid, _icm, _st, _et, () => {
            res.end();
        });

});

const write_two_typing_speed_speed = require('../src/write_typing').write_two_typing_speed_speed;

router.post('/write_typing_speed', (req, res, next) => {
    let _uuid = req.body.uuid;
    let _language = req.body.language;
    let _speed = req.body.speed;
    write_two_typing_speed_speed(_uuid, _language, _speed, (err) => {
        let _rdata = {};
        _rdata.result = err;
        res.send(_rdata);
        res.end();
    });
});

const read_day_two_typing_speed_speed = require('../src/read_typing').read_day_two_typing_speed_speed;
router.post('/read_day_typing_speed', (req, res, next) => {
    let _uuid = req.body.uuid;
    let _language = req.body.language;
    let _rdata = {};
    read_day_two_typing_speed_speed(_uuid, _language, (err, data) => {
        if (err != PACKET_ERR.SUCCESS) {
            _rdata.result = err;
            res.send(_rdata);
        } else {
            res.send(data);
        }
        res.end();
    });
});

const read_month_two_typing_speed_speed = require('../src/read_typing').read_month_two_typing_speed_speed;
router.post('/read_month_typing_speed', (req, res, next) => {
    let _uuid = req.body.uuid;
    let _language = req.body.language;
    let _month = parseInt(req.body.month);
    let _year = req.body.year;
    _month = _month < 10 ? '0' + _month : '' + _month;
    let _rdata = {};
    read_month_two_typing_speed_speed(_uuid, _language, _year, _month, (err, data) => {
        if (err != PACKET_ERR.SUCCESS) {
            _rdata.result = err;
            res.send(_rdata);
        } else {
            res.send(data);
        }
        res.end();
    });
});

const write_check_result = require('../src/write_typing').write_check_result;
router.post('/write_check_result', (req, res, next) => {
    let _uuid = req.body.uuid;
    let _title = req.body.title;
    let _speed = req.body.speed;
    let _acc = req.body.acc;
    let _page_ing = req.body.page_ing;
    let _page_end = req.body.page_end;

    /*  console.log("체크 합니다 uuid======================"+req.body.uuid);
     console.log("체크 합니다 title======================"+req.body.title);
     console.log("체크 합니다 speed======================"+req.body.speed);
     console.log("체크 합니다 acc======================"+req.body.acc);
     console.log("체크 합니다 page_ing======================"+req.body.page_ing);
     console.log("체크 합니다 page_end======================"+req.body.page_end); */

    let _rdata = {};
    write_check_result(_uuid, _title, _speed, _acc, _page_ing, _page_end, (err, data) => {
        if (err != PACKET_ERR.SUCCESS) {
            _rdata.result = err;
            res.send(_rdata);
        } else {
            _rdata.result = PACKET_ERR.SUCCESS;
            res.send(_rdata);
        }
        res.end();
    })
})

const read_check_result = require('../src/read_typing').read_check_result
router.post('/read_check_result', (req, res, next) => {

    let _uuid = req.body.uuid;

    let _rdata = {};

    read_check_result(_uuid, (err, data) => {
        if (err != PACKET_ERR.SUCCESS) {
            _rdata.result = err;
            res.send(_rdata);
        } else {
            res.send(data);
        }
        res.end();
    })
})

const read_taja_contents = require('../src/read_typing').read_taja_contents
router.post('/read_taja_contents', (req, res, next) => {

    let _category = req.body.category;
    let _type = req.body.type;

    let _rdata = {};

    read_taja_contents(_category, _type, (err, data) => {
        if (err != PACKET_ERR.SUCCESS) {
            _rdata.result = err;
            res.send(_rdata);
        } else {
            res.send(data);
        }
        res.end();
    })
})

const read_taja_contents_data = require('../src/read_typing').read_taja_contents_data
router.post('/read_taja_contents_data', (req, res, next) => {

    let _idx = req.body.idx;

    let _rdata = {};

    read_taja_contents_data(_idx, (err, data) => {
        if (err != PACKET_ERR.SUCCESS) {
            _rdata.result = err;
            res.send(_rdata);
        } else {
            res.send(data);
        }
        res.end();
    })
})
module.exports = router;