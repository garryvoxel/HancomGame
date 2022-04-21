/***
 * project name : hancom-api-server
 * author       : Kevin
 * date         : 2019-02-20
 * file         : log
 */

const express           = require('express');
const router            = express.Router();
const write_log         = require(APP_ROOT + '/src/write_log').write_log;

const METHOD = 'post';
const URI = {
    'login' : '/login',                             // 로그인
    'logout' : '/logout',                           // 로그아웃
    'banner' : {
        'click' : '/banner/click',                  // 배너 클릭
        'show' : '/banner/show'                     // 배너 노출
    },
    'friend' : {
        'accept' : '/friend/accept',                // 친구 수락
        'delete' : '/friend/delete',                // 친구 삭제
        'message' : '/friend/message',              // 친구 쪽지 보내기
        'request' : '/friend/request'               // 친구 신청
    },
    'game' : {
        'start' : {
            'mole' : '/game/start/mole',            // 두더지 게임 시작
            'type' : '/game/start/type'             // 타자게임 종료
        },
        'end' : {
            'mole' : '/game/end/mole',              // 두더지 게임 종료
            'type' : '/game/end/type'               // 타자게임 종료
        }
    },
    'page' : {
        'view' : '/page/view'                       // 페이지 뷰
    },
    'score' : {
        'consume' : '/score/consume',               // 포인트 소모
        'earn' : '/score/earn'                      // 포인트 획득
    },
    'sns' : {
        'share' : {
            'facebook' : '/sns/share/facebook',     // 점수 공유 facebook
            'kakao' : '/sns/share/kakao'            // 점수 공유 kakaotalk
        }
    }
};

// 로그인
router[METHOD](URI.login, (req, res, next)=>{

    console.log('%s : %j', req.originalUrl, req.body);

    let msg_idx     = TYPE.LOG.LOGIN_WEB;
    let uuid        = req.body.uuid;
    let nick_name   = req.body.nick_name;
    let os          = req.body.os;
    let browser     = req.body.browser;
    let now_time    = TIME.getYMD(TIME.getTime());

    write_log(msg_idx, uuid, nick_name,
        null, null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,
        os, browser,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
        0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
        now_time,null,null,null,null,null,null,null,null,null,(err)=>{
            // res.json();  // json format
            // 성공
            if (0 === err) {
                res.end();
                return;
            }
            next(err);
        });
});

// 로그아웃
router[METHOD](URI.logout, (req, res, next)=>{

    console.log('%s : %j', req.originalUrl, req.body);

    let msg_idx = TYPE.LOG.LOGOUT_WEB;
    let uuid   = req.body.uuid;
    let nick_name = req.body.nick_name;
    let now_time = TIME.getYMD(TIME.getTime());

    write_log(msg_idx, uuid, nick_name,
        null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,
        0, 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
        0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
        now_time,null,null,null,null,null,null,null,null,null,(err)=>{
            // res.json();  // json format
            // 성공
            if (0 === err) {
                res.end();
                return;
            }
            next(err);
        });
});

// 배너 클릭
router[METHOD](URI.banner.click, (req, res, next)=>{

    console.log('%s : %j', req.originalUrl, req.body);

    let msg_idx = TYPE.LOG.AD_WEB_CLICK;
    let uuid   = req.body.uuid;
    let nick_name = req.body.nick_name;
    let ad_id = req.body.ad_id;
    let now_time = TIME.getYMD(TIME.getTime());

    write_log(msg_idx, uuid, nick_name,
        null, null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,
        ad_id, 0, 0, 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
        0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
        now_time,null,null,null,null,null,null,null,null,null,(err)=>{
            // res.json();  // json format
            // 성공
            if (0 === err) {
                res.end();
                return;
            }
            next(err);
        });
});

// 배너 노출
router[METHOD](URI.banner.show, (req, res, next)=>{

    console.log('%s : %j', req.originalUrl, req.body);

    let msg_idx = TYPE.LOG.AD_WEB_SHOW;
    let uuid   = req.body.uuid;
    let nick_name = req.body.nick_name;
    let ad_id = req.body.ad_id;
    let now_time = TIME.getYMD(TIME.getTime());

    write_log(msg_idx, uuid, nick_name,
        null, null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,
        ad_id, 0, 0, 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
        0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
        now_time,null,null,null,null,null,null,null,null,null,(err)=>{
            // res.json();  // json format
            // 성공
            if (0 === err) {
                res.end();
                return;
            }
            next(err);
        });
});

// 친구 수락
router[METHOD](URI.friend.accept, (req, res, next)=>{

    console.log('%s : %j', req.originalUrl, req.body);

    let msg_idx = TYPE.LOG.FRIEND_ACCEPT;
    let uuid   = req.body.uuid;
    let nick_name = req.body.nick_name;
    let target_id  = req.body.target_id;
    let now_time = TIME.getYMD(TIME.getTime());

    write_log(msg_idx, uuid, nick_name,
        target_id, null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,
        target_id, 0, 0, 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
        0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
        now_time,null,null,null,null,null,null,null,null,null,(err)=>{
            // res.json();  // json format
            // 성공
            if (0 === err) {
                res.end();
                return;
            }
            next(err);
        });
});

// 친구 삭제
router[METHOD](URI.friend.delete, (req, res, next)=>{

    console.log('%s : %j', req.originalUrl, req.body);

    let msg_idx = TYPE.LOG.FRIEND_DELETE;
    let uuid   = req.body.uuid;
    let nick_name = req.body.nick_name;
    let target_id  = req.body.target_id;
    let now_time = TIME.getYMD(TIME.getTime());

    write_log(msg_idx, uuid, nick_name,
        target_id, null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,
        target_id, 0, 0, 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
        0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
        now_time,null,null,null,null,null,null,null,null,null,(err)=>{
            // res.json();  // json format
            // 성공
            if (0 === err) {
                res.end();
                return;
            }
            next(err);
        });
});

// 친구 쪽지 보내기
router[METHOD](URI.friend.message, (req, res, next)=>{

    console.log('%s : %j', req.originalUrl, req.body);

    let msg_idx = TYPE.LOG.SCORE_SEND;
    let uuid   = req.body.uuid;
    let nick_name = req.body.nick_name;
    let target_id  = req.body.target_id;
    let now_time = TIME.getYMD(TIME.getTime());

    write_log(msg_idx, uuid, nick_name,
        target_id, null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,
        target_id, 0, 0, 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
        0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
        now_time,null,null,null,null,null,null,null,null,null,(err)=>{
            // res.json();  // json format
            // 성공
            if (0 === err) {
                res.end();
                return;
            }
            next(err);
        });
});

// 친구 신청
router[METHOD](URI.friend.request, (req, res, next)=>{

    console.log('%s : %j', req.originalUrl, req.body);

    let msg_idx = TYPE.LOG.FRIEND_REQUEST;
    let uuid   = req.body.uuid;
    let nick_name = req.body.nick_name;
    let target_id  = req.body.target_id;
    let now_time = TIME.getYMD(TIME.getTime());

    write_log(msg_idx, uuid, nick_name,
        target_id, null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,
        target_id, 0, 0, 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
        0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
        now_time,null,null,null,null,null,null,null,null,null,(err)=>{
            // res.json();  // json format
            // 성공
            if (0 === err) {
                res.end();
                return;
            }
            next(err);
        });
});

// 두더지 게임 시작
router[METHOD](URI.game.start.mole, (req, res, next)=>{

    console.log('%s : %j', req.originalUrl, req.body);

    let msg_idx = TYPE.LOG.GAME_MOLE_BEGIN;
    let uuid   = req.body.uuid;
    let nick_name = req.body.nick_name;
    let game_id = req.body.game_id;
    let stage = req.body.stage;
    let now_time = TIME.getYMD(TIME.getTime());

    write_log(msg_idx, uuid, nick_name,
        null, null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,
        game_id, stage, 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
        0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
        now_time,null,null,null,null,null,null,null,null,null,(err)=>{
            // res.json();  // json format
            // 성공
            if (0 === err) {
                res.end();
                return;
            }
            next(err);
        });
});

// 타자 게임 시작
router[METHOD](URI.game.start.type, (req, res, next)=>{

    console.log('%s : %j', req.originalUrl, req.body);

    let msg_idx = TYPE.LOG.GAME_TYPE_BEGIN;
    let uuid   = req.body.uuid;
    let nick_name = req.body.nick_name;
    let game_id = req.body.game_id;
    let division = req.body.division;
    let level = req.body.level;
    let now_time = TIME.getYMD(TIME.getTime());

    write_log(msg_idx, uuid, nick_name,
        null, null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,
        game_id, division, level,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
        0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
        now_time,null,null,null,null,null,null,null,null,null,(err)=>{
            // res.json();  // json format
            // 성공
            if (0 === err) {
                res.end();
                return;
            }
            next(err);
        });
});

// 두더지 게임 종료
router[METHOD](URI.game.end.mole, (req, res, next)=>{

    console.log('%s : %j', req.originalUrl, req.body);

    let msg_idx = TYPE.LOG.GAME_MOLE_END;
    let uuid   = req.body.uuid;
    let nick_name = req.body.nick_name;
    let game_id = req.body.game_id;
    let stage = req.body.stage;
    let score = req.body.score;
    let point = req.body.point;
    let result = req.body.stage;
    let now_time = TIME.getYMD(TIME.getTime());

    write_log(msg_idx, uuid, nick_name,
        null, null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,
        game_id, stage, score, point, result,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
        0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
        now_time,null,null,null,null,null,null,null,null,null,(err)=>{
            // res.json();  // json format
            // 성공
            if (0 === err) {
                res.end();
                return;
            }
            next(err);
        });
});

// 타자 게임 종료
router[METHOD](URI.game.end.type, (req, res, next)=>{

    console.log('%s : %j', req.originalUrl, req.body);

    let msg_idx = TYPE.LOG.GAME_TYPE_END;
    let uuid   = req.body.uuid;
    let nick_name = req.body.nick_name;
    let game_id = req.body.game_id;
    let division = req.body.division;
    let level = req.body.level;
    let count_ave = req.body.count_ave;
    let count_key = req.body.count_key;
    let cor_rate = req.body.cor_rate;
    let cor_key_rate = req.body.cor_key_rate;
    let fast_rate = req.body.fast_rate;
    let result = req.body.result;
    let now_time = TIME.getYMD(TIME.getTime());

    write_log(msg_idx, uuid, nick_name,
        null, null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,
        game_id, division, level, count_ave, count_key, cor_rate, cor_key_rate, fast_rate, result,0,0,0,0,0,0,0,0,0,0,0,
        0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
        now_time,null,null,null,null,null,null,null,null,null,(err)=>{
            // res.json();  // json format
            // 성공
            if (0 === err) {
                res.end();
                return;
            }
            next(err);
        });
});

// 페이지 뷰
router[METHOD](URI.page.view, (req, res, next)=>{

    console.log('%s : %j', req.originalUrl, req.body);

    let msg_idx = TYPE.LOG.MENU_ENTRANCE;
    let uuid   = req.body.uuid;
    let nick_name = req.body.nick_name;
    let menu = req.body.menu;
    let now_time = TIME.getYMD(TIME.getTime());

    write_log(msg_idx, uuid, nick_name,
        null, null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,
        menu, 0, 0, 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
        0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
        now_time,null,null,null,null,null,null,null,null,null,(err)=>{
            // res.json();  // json format
            // 성공
            if (0 === err) {
                res.end();
                return;
            }
            next(err);
        });
});

// 포인트 소모
router[METHOD](URI.score.consume, (req, res, next)=>{

    console.log('%s : %j', req.originalUrl, req.body);

    let msg_idx = TYPE.LOG.SCORE_CONSUME;
    let uuid   = req.body.uuid;
    let nick_name = req.body.nick_name;
    let amount = req.body.amount;
    let way = req.body.way;
    let game_id = req.body.game_id;
    let item_id  = req.body.item_id ;
    let now_time = TIME.getYMD(TIME.getTime());

    write_log(msg_idx, uuid, nick_name,
        null, null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,
        amount, game_id, way, item_id,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
        0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
        now_time,null,null,null,null,null,null,null,null,null,(err)=>{
            // res.json();  // json format
            // 성공
            if (0 === err) {
                res.end();
                return;
            }
            next(err);
        });
});

// 포인트 획득
router[METHOD](URI.score.earn, (req, res, next)=>{

    console.log('%s : %j', req.originalUrl, req.body);

    let msg_idx = TYPE.LOG.SCORE_EARN;
    let uuid   = req.body.uuid;
    let nick_name = req.body.nick_name;
    let amount = req.body.amount;
    let way = req.body.way;
    let game_id = req.body.game_id;
    let now_time = TIME.getYMD(TIME.getTime());

    write_log(msg_idx, uuid, nick_name,
        null, null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,
        amount, game_id, way,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
        0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
        now_time,null,null,null,null,null,null,null,null,null,(err)=>{
            // res.json();  // json format
            // 성공
            if (0 === err) {
                res.end();
                return;
            }
            next(err);
        });
});

// 점수 공유 facebook
router[METHOD](URI.sns.share.facebook, (req, res, next)=>{

    console.log('%s : %j', req.originalUrl, req.body);

    let msg_idx = TYPE.LOG.SCORE_SHARE_FACEBOOK;
    let uuid   = req.body.uuid;
    let nick_name = req.body.nick_name;
    let tier  = req.body.tier;
    let rank_self  = req.body.rank_self;
    let rank_school  = req.body.rank_school;
    let game_id  = req.body.game_id;
    let score  = req.body.score;
    let count_win  = req.body.count_win;
    let count_type  = req.body.count_type;
    let cor_rate  = req.body.cor_rate;
    let now_time = TIME.getYMD(TIME.getTime());

    write_log(msg_idx, uuid, nick_name,
        null, null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,
        tier, rank_self, rank_school, game_id, score, count_win, count_type, cor_rate,0,0,0,0,0,0,0,0,0,0,0,0,
        0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
        now_time,null,null,null,null,null,null,null,null,null,(err)=>{
            // res.json();  // json format
            // 성공
            if (0 === err) {
                res.end();
                return;
            }
            next(err);
        });
});

// 점수 공유 kakaotalk
router[METHOD](URI.sns.share.kakao, (req, res, next)=>{

    console.log('%s : %j', req.originalUrl, req.body);

    let msg_idx = TYPE.LOG.SCORE_SHARE_KAKAOTALK;
    let uuid   = req.body.uuid;
    let nick_name = req.body.nick_name;
    let tier  = req.body.tier;
    let rank_self  = req.body.rank_self;
    let rank_school  = req.body.rank_school;
    let game_id  = req.body.game_id;
    let score  = req.body.score;
    let count_win  = req.body.count_win;
    let count_type  = req.body.count_type;
    let cor_rate  = req.body.cor_rate;
    let now_time = TIME.getYMD(TIME.getTime());

    write_log(msg_idx, uuid, nick_name,
        null, null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,
        tier, rank_self, rank_school, game_id, score, count_win, count_type, cor_rate,0,0,0,0,0,0,0,0,0,0,0,0,
        0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
        now_time,null,null,null,null,null,null,null,null,null,(err)=>{
            // res.json();  // json format
            // 성공
            if (0 === err) {
                res.end();
                return;
            }
            next(err);
        });
});

module.exports = router;