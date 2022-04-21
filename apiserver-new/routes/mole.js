var express                 = require('express');
const LOG_MSG_IDX           = require('../src/log_msg_idx').LOG_MSG_IDX;
const TIME                  = require('../common/time');
const start_end_game_log    = require('../src/write_mole').start_end_game_log;
const GAME_CODE             = require('../config/game_code');
const end_game              = require('../src/write_mole').end_game;  // kevin added
const get_info              = require('../src/read_mole').get_info;  // kevin added
const CryptoJS_EN                = require('../common/util').CryptoJS_EN; 
const CryptoJS_DE                = require('../common/util').CryptoJS_DE;

////////////////////////////////////////////////////////////////
// kevin added
const METHOD = 'post';
const URI = {
    'info'          : '/info',      // 두더지 게임 정보 조회
    'end'           : '/end'        // 두더지 게임 종료
};
////////////////////////////////////////////////////////////////

var router = express.Router();


const update_ranking = require('../src/write_mole').update_ranking;
/***
 * 두더지 랭킹 저장하기
 */
router.post('/write_ranking',(req,res,next)=>{    
    let _nn     = req.body.nick_name;
    let _score  = req.body.score;
    console.log("nick_name : "+_nn+" score:"+_score);
    update_ranking(_nn,_score,(err)=>{
        let _rdata ={};
        _rdata.result = err;
        res.send(_rdata);
        res.end();
    });
});

router.post('/start_end_game_log',(req,res,next)=>{

    let _uuid       = req.body.uuid;
    let _nn         = req.body.nick_name;
    let _stage      = req.body.stage;
    let _score      = req.body.score;    
    let _is_clear   = req.body.is_clear;
    let _st         = req.body.game_start_time;
    let _et         = req.body.game_end_time;

    console.log("두더지 들어온 시간 =========================================="+req.body.game_start_time);
    
    let _rdata = {};
    start_end_game_log(LOG_MSG_IDX.GAME_MOLE_BEGIN_END,
                    _uuid,_nn,GAME_CODE.GAME_MOLE,
                    _stage,_score,_is_clear,_st,_et,(err)=>{
        _rdata.result = err;
        res.send(_rdata);
        res.end();

    });


});

// kevin added
router[METHOD](URI.info, (req, res, next)=>{
    // src 에서 로직 처리
    console.log('%s : %j', req.originalUrl, req.body);

    let uuid   = req.body.uuid;

    get_info(uuid, function(error, result) {
        if (error) {
            console.error(error);
            next(error);
        }
        res.json(result);
    })
});

router.post('/end',(req,res,next)=>{

    console.log("/API 두더지게임결과 일단 들어옴 ==============");

    console.log("/API 두더지게임결과 req 정보  받았어요 =========================================== "+req.body.packet);

    var jpacket = CryptoJS_DE(req.body.packet);

    console.log("/API 두더지게임결과 암호화 해독 완성 =========================================== "+JSON.stringify(jpacket));
 
    let uuid   = BigInt(jpacket.uuid);
    let nick_name = jpacket.nick_name;
    let stage = Number(jpacket.stage);
    let star = Number(jpacket.star);
    let score = Number(jpacket.score);
    let m_date = jpacket.date;

   /*  let uuid   = req.body.uuid;
    let nick_name = req.body.nick_name;
    let stage = req.body.stage;
    let star = req.body.star;
    let score = req.body.score; */

    let _rdata = {};

    end_game(uuid, nick_name, stage, star, score,m_date, function(error) {
       /*  if (error) {
            console.error(error);
            next(error);
        } */
        if (error) {
            console.error(error);
        }
        _rdata.result = error;
        res.send(_rdata);
        res.end();
    });
})



const write_share_facebook = require('../src/write_mole').write_share_facebook;
const write_share_kakao = require('../src/write_mole').write_share_kakao;

router.post('/write_share_facebook',(req,res,next)=>{
    let _uuid   = req.body.uuid;
    let _nn     = req.body.nick_name;
    let _tier_1 = req.body.tier_1;
    let _tier_2 = req.body.tier_2;
    let _pr     = req.body.personal_rank;
    let _sr     = req.body.school_rank;
    let _s      = req.body.score;
    let _wc     = req.body.win_count;
    let _tc     = req.body.typing_count;
    let _acc    = req.body.acc;
    let _pos    = req.body.pos;

    write_share_facebook(LOG_MSG_IDX.SCORE_SHARE_FACEBOOK,_uuid,_nn,GAME_CODE.GAME_MOLE,
        _tier_1,_tier_2,_pr,_sr,_s,_wc,_tc,_acc,_pos,(err)=>{

            let _rdata={};
            _rdata.result = err;
            res.send(_rdata);
            res.end();
        });
})

router.post('/write_share_kakao',(req,res,next)=>{
    let _uuid   = req.body.uuid;
    let _nn     = req.body.nick_name;
    let _tier_1 = req.body.tier_1;
    let _tier_2 = req.body.tier_2;
    let _pr     = req.body.personal_rank;
    let _sr     = req.body.school_rank;
    let _s      = req.body.score;
    let _wc     = req.body.win_count;
    let _tc     = req.body.typing_count;
    let _acc    = req.body.acc;
    let _pos    = req.body.pos;

    write_share_kakao(LOG_MSG_IDX.SCORE_SHARE_KAKAOTALK,_uuid,_nn,GAME_CODE.GAME_MOLE,
        _tier_1,_tier_2,_pr,_sr,_s,_wc,_tc,_acc,_pos,(err)=>{

            let _rdata={};
            _rdata.result = err;
            res.send(_rdata);
            res.end();
        });
})


module.exports = router;