const
    express = require('express'),
    router = express.Router(),
    path = require('path'),
    METHOD_POST = 'post';
    METHOD_GET = 'get';
    METHOD_PUT = 'put';

    ResponseCode = require(__dirname + '/../classes/response_code'),
    
    /////////////////////////////////////////////////////////////////////
    // controller list
    LoginController = require(__dirname + '/../controllers/login.controller'),
    ManagerController = require(__dirname + '/../controllers/manager.controller');
    FavorLinksController = require(__dirname + '/../controllers/favorlinks.controller');
    UsersController = require(__dirname + '/../controllers/users.controller');
    NewsController = require(__dirname + '/../controllers/news.controller');
    FaqsController = require(__dirname + '/../controllers/faqs.controller');
    EventsController = require(__dirname + '/../controllers/events.controller');
    ForumController = require(__dirname + '/../controllers/forum.controller');
    ForumClanController = require(__dirname + '/../controllers/forumclan.controller');
    LogController = require(__dirname + '/../controllers/log.controller');
    AdController = require(__dirname + '/../controllers/ad.controller');
    SlangController = require(__dirname + '/../controllers/slang.controller');
    ClanController = require(__dirname + '/../controllers/clan.controller');
    PointController = require(__dirname + '/../controllers/point.controller');
    ContentsController = require(__dirname + '/../controllers/contents.controller');
    StatisticsController = require(__dirname + '/../controllers/statistics.controller');
    RedisController = require(__dirname + '/../controllers/redis.controller');
    WordController = require(__dirname + '/../controllers/word.controller');
    /////////////////////////////////////////////////////////////////////


/* GET home page. */
router.get('/', function (req, res) {
    res.redirect('/typing/login');
});

router.get('/typing', function (req, res) {
    res.redirect('/typing/login');
});

// router.get('/login', function(req, res, next) {
//     if (req.session.managerId && req.session.username) {
//         return res.redirect(decodeURIComponent(req.query.redirectUri || '/managers'));
//     }

//     return next();
// }, LoginController.showLoginForm);

router.get('/typing/logout', function(req, res) {
    if (req.session.managerId && req.session.username) {
        LoginController.logout(req,res);
    }
   res.redirect('/typing/login');
});

router.get('/typing/api/logout', function(req, res) {
    if (req.session.managerId && req.session.username) {
        LoginController.logout(req,res);
    }
    return res.jsonp(ResponseCode.OK);
});

router.post('/typing/login', function(req, res, next) {
    if (req.session.managerId && req.session.username) {
        return res.jsonp({
            error: 'Manager has been already logged in.'
        });
    }

    return next();
}, LoginController.login);

router.post('/typing/api/login', function(req, res, next) {
    if (req.session.managerId && req.session.username) {
        return res.jsonp({...ResponseCode.OK
            , display_name: req.session.display_name });
    }
    return next();
}, LoginController.login);


/////////////////////////////////////////////////////////////////////
// session_check
 router[METHOD_GET]('/typing/api/session_check', (req, res)=>{
    if (req.session.managerId && req.session.username) {
        res.jsonp(ResponseCode.OK);
    }else{
        res.jsonp(ResponseCode.UNAUTHORIZED);
    }
 });

/////////////////////////////////////////////////////////////////////
// manager route
//router[METHOD_GET]('/typing/managers', authenticate, ManagerController.index);
// router[METHOD_GET]('/typing/managers/create', authenticate, ManagerController.create);
//router[METHOD_POST]('/typing/managers', authenticate, ManagerController.store);
// router[METHOD_GET]('/typing/managers/:id/edit', authenticate, ManagerController.edit);
//router[METHOD_POST]('/typing/managers/:id', authenticate, ManagerController.update);

 router[METHOD_PUT]('/typing/api/manager/store', authenticate, ManagerController.storeNresponseJson);
 router[METHOD_GET]('/typing/api/manager/:id/info', authenticate, ManagerController.infoNresponseJson);
router[METHOD_POST]('/typing/api/manager/:id/update', authenticate, ManagerController.updateNresponseJson);
 router[METHOD_GET]('/typing/api/manager/list', authenticate, ManagerController.indexNresponseJson);
router[METHOD_POST]('/typing/api/manager/pwupdateself', authenticate, ManagerController.updatePwNresponseJson);

/////////////////////////////////////////////////////////////////////
// favorlinks route
 router[METHOD_GET]('/typing/api/favorlinks/list', authenticate, FavorLinksController.getList);
router[METHOD_POST]('/typing/api/favorlinks/add', authenticate, FavorLinksController.add);
router[METHOD_POST]('/typing/api/favorlinks/del', authenticate, FavorLinksController.del);

/////////////////////////////////////////////////////////////////////
// users route
 router[METHOD_GET]('/typing/api/users/list', authenticate, UsersController.indexNresponseJson);
 router[METHOD_GET]('/typing/api/users/:id/info', authenticate, UsersController.infoNresponseJson);
 router[METHOD_POST]('/typing/api/users/:id/update', authenticate, UsersController.updateNresponseJson);

/////////////////////////////////////////////////////////////////////
// news route
 router[METHOD_GET]('/typing/api/service/news/list', authenticate, NewsController.indexNresponseJson);
 router[METHOD_GET]('/typing/api/service/topnews/list', authenticate, NewsController.indexTopNresponseJson);
router[METHOD_POST]('/typing/api/service/topnews/set', authenticate, NewsController.setTopNewsNresponseJson);
router[METHOD_POST]('/typing/api/service/topnews/unset', authenticate, NewsController.unsetTopNewsNresponseJson);  
router[METHOD_POST]('/typing/api/service/topnews/setorder', authenticate, NewsController.topNewsOrderModifyNresponseJson);  
 router[METHOD_PUT]('/typing/api/service/news/write', authenticate, NewsController.storeNresponseJson);
 router[METHOD_GET]('/typing/api/service/news/:id/info', authenticate, NewsController.infoNresponseJson);
router[METHOD_POST]('/typing/api/service/news/:id/update', authenticate, NewsController.updateNresponseJson);
router[METHOD_POST]('/typing/api/service/news/delete', authenticate, NewsController.deleteNresponseJson);
router[METHOD_POST]('/typing/api/service/news/imageupload', authenticate, NewsController.imageUploadNresponseJson);
router[METHOD_GET]('/typing/api/service/news/getimagelist', authenticate, NewsController.getImageListNresponseJson);
router[METHOD_POST]('/typing/api/service/news/delimage', authenticate, NewsController.delImageNresponseJson);

 /////////////////////////////////////////////////////////////////////
// faqs route
 router[METHOD_GET]('/typing/api/service/faq/list', authenticate, FaqsController.indexNresponseJson);
 router[METHOD_PUT]('/typing/api/service/faq/write', authenticate, FaqsController.storeNresponseJson);
 router[METHOD_GET]('/typing/api/service/faq/:id/info', authenticate, FaqsController.infoNresponseJson);
router[METHOD_POST]('/typing/api/service/faq/:id/update', authenticate, FaqsController.updateNresponseJson);
router[METHOD_POST]('/typing/api/service/faq/delete', authenticate, FaqsController.deleteNresponseJson);

/////////////////////////////////////////////////////////////////////
// ranking
router[METHOD_POST]('/typing/api/service/ranking', authenticate, RedisController.getRanking);

/////////////////////////////////////////////////////////////////////
// clan
 router[METHOD_GET]('/typing/api/service/clan/list', authenticate, ClanController.indexNresponseJson);
 router[METHOD_GET]('/typing/api/service/clan/:id/info', authenticate, ClanController.infoNresponseJson);
router[METHOD_POST]('/typing/api/service/clan/close', authenticate, ClanController.closeNresponseJson);

 router[METHOD_GET]('/typing/api/service/forumclan/list', authenticate, ForumClanController.indexNresponseJson);
 router[METHOD_GET]('/typing/api/service/forumclan/:id/info', authenticate, ForumClanController.infoNresponseJson); 
router[METHOD_POST]('/typing/api/service/forumclan/delete', authenticate, ForumClanController.doDeleteNresponseJson); 
router[METHOD_POST]('/typing/api/service/forumclan/relive', authenticate, ForumClanController.doReliveNresponseJson); 

router[METHOD_POST]('/typing/api/service/forum-clan-comment/dodelete', authenticate, ForumClanController.clanCommentDoDeleteNresponseJson);
router[METHOD_POST]('/typing/api/service/forum-clan-comment/dorelive', authenticate, ForumClanController.clanCommentDoReliveNresponseJson);

/////////////////////////////////////////////////////////////////////
// event route
 router[METHOD_GET]('/typing/api/service/event/list', authenticate, EventsController.indexNresponseJson);
router[METHOD_POST]('/typing/api/service/event/write', authenticate, EventsController.storeNresponseJson);
 router[METHOD_GET]('/typing/api/service/event/:id/info', authenticate, EventsController.infoNresponseJson);
router[METHOD_POST]('/typing/api/service/event/update', authenticate, EventsController.updateNresponseJson);
router[METHOD_POST]('/typing/api/service/event/updatePCBanner', authenticate, EventsController.updatePCbanner);
router[METHOD_POST]('/typing/api/service/event/updateMobileBanner', authenticate, EventsController.updateMobilebanner);
router[METHOD_POST]('/typing/api/service/event/delete', authenticate, EventsController.deleteNresponseJson);

/////////////////////////////////////////////////////////////////////
// Ad route
 router[METHOD_GET]('/typing/api/ad/list', authenticate, AdController.indexNresponseJson);
router[METHOD_POST]('/typing/api/ad/write', authenticate, AdController.storeNresponseJson);
 router[METHOD_GET]('/typing/api/ad/:id/info', authenticate, AdController.infoNresponseJson);
router[METHOD_POST]('/typing/api/ad/update', authenticate, AdController.updateNresponseJson);
router[METHOD_POST]('/typing/api/ad/delete', authenticate, AdController.deleteNresponseJson);

/////////////////////////////////////////////////////////////////////
// forum route
 router[METHOD_GET]('/typing/api/service/forum/list', authenticate, ForumController.indexNresponseJson);
 router[METHOD_GET]('/typing/api/service/forum/:id/info', authenticate, ForumController.infoNresponseJson);

//---- db table 변경으로 사용하지 않음. ▼
 router[METHOD_GET]('/typing/api/service/forum-report-post/list', authenticate, ForumController.reportPostIndexNresponseJson);
 router[METHOD_GET]('/typing/api/service/forum-report-post/:id/info', authenticate, ForumController.reportPostInfoNresponseJson);
router[METHOD_POST]('/typing/api/service/forum-report-post/doissueclear', authenticate, ForumController.reportPostIssueClearNresponseJson);
router[METHOD_POST]('/typing/api/service/forum-report-post/dodelete', authenticate, ForumController.reportPostDoDeleteNresponseJson);
router[METHOD_POST]('/typing/api/service/forum-report-post/dorelive', authenticate, ForumController.reportPostDoReliveNresponseJson);

 router[METHOD_GET]('/typing/api/service/forum-report-comment/list',  authenticate, ForumController.reportCommentIndexNresponseJson);
 router[METHOD_GET]('/typing/api/service/forum-report-comment/:id/info', authenticate, ForumController.reportCommentInfoNresponseJson);
router[METHOD_POST]('/typing/api/service/forum-report-comment/doissueclear', authenticate, ForumController.reportCommentIssueClearNresponseJson);
router[METHOD_POST]('/typing/api/service/forum-report-comment/dodelete', authenticate, ForumController.reportCommentDoDeleteNresponseJson);
router[METHOD_POST]('/typing/api/service/forum-report-comment/dorelive', authenticate, ForumController.reportCommentDoReliveNresponseJson);
//---- db table 변경으로 사용하지 않음. ▲

// 신고글 관리
router[METHOD_GET]('/typing/api/service/accusation/list', authenticate, ForumController.accusationIndexNresponseJson);
router[METHOD_GET]('/typing/api/service/accusation/:id/info', authenticate, ForumController.accusationInfoNresponseJson);
router[METHOD_POST]('/typing/api/service/accusation/doissueclear', authenticate, ForumController.accusationIssueClearNresponseJson);
router[METHOD_POST]('/typing/api/service/accusation/dodelete', authenticate, ForumController.accusationDoDeleteNresponseJson);
router[METHOD_POST]('/typing/api/service/accusation/dorelive', authenticate, ForumController.accusationDoReliveNresponseJson);
// 신고글 일괄처리
router[METHOD_POST]('/typing/api/service/accusation/setbatch', authenticate, ForumController.accusationSetBatchNresponseJson);

/////////////////////////////////////////////////////////////////////
// log route
 router[METHOD_GET]('/typing/stats/web', authenticate, LogController.test);
 router[METHOD_GET]('/typing/stats/login', authenticate, LogController.login);
/////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////////////
// slang
 router[METHOD_GET]('/typing/api/monitoring/slang/list', authenticate, SlangController.indexNresponseJson);
router[METHOD_POST]('/typing/api/monitoring/slang/csvupload', authenticate, SlangController.cvsUploadNresponseJson);
router[METHOD_POST]('/typing/api/monitoring/slang/delete', authenticate, SlangController.deleteNresponseJson);
router[METHOD_POST]('/typing/api/monitoring/slang/write', authenticate, SlangController.storeNresponseJson);

/////////////////////////////////////////////////////////////////////
// point
 router[METHOD_GET]('/typing/api/point/list', authenticate, PointController.indexNresponseJson);
router[METHOD_POST]('/typing/api/point/givepoint', authenticate, PointController.givepointNresponseJson);
router[METHOD_POST]('/typing/api/point/revokepoint', authenticate, PointController.revokepointNresponseJson);

/////////////////////////////////////////////////////////////////////
// statistics

 //router[METHOD_GET]('/typing/api/statistics/stat-login', authenticate, StatisticsController.getLoginStatistics); 2019-06-25 테이블 변경
 /* 신규 가입 통계 */
 router[METHOD_GET]('/typing/api/statistics/stat-newuser-monthly', authenticate, StatisticsController.getMonthlyNewUserStat);
 router[METHOD_GET]('/typing/api/statistics/stat-newuser-daily', authenticate, StatisticsController.getDailyNewUserStat);
 router[METHOD_GET]('/typing/api/statistics/stat-newuser-weekly', authenticate, StatisticsController.getWeeklyNewUserStat);

  /* 탈퇴 회원 통계 */
  router[METHOD_GET]('/typing/api/statistics/stat-withdrawal-monthly', authenticate, StatisticsController.getMonthlyWithdrawalUserStat);
  router[METHOD_GET]('/typing/api/statistics/stat-withdrawal-daily', authenticate, StatisticsController.getDailyWithdrawalUserStat);
  router[METHOD_GET]('/typing/api/statistics/stat-withdrawal-weekly', authenticate, StatisticsController.getWeeklyWithdrawalUserStat);
  
 /* 로그인 통계 */
 router[METHOD_GET]('/typing/api/statistics/stat-login-monthly', authenticate, StatisticsController.getMonthlyLoginStat);
 router[METHOD_GET]('/typing/api/statistics/stat-login-daily', authenticate, StatisticsController.getDailyLoginStat);
 router[METHOD_GET]('/typing/api/statistics/stat-login-weekly', authenticate, StatisticsController.getWeeklyLoginStat);

 /* 회원수 카운트 */
 router[METHOD_GET]('/typing/api/statistics/stat-user-totalcount', authenticate, StatisticsController.getTotalMemberCount);

 /* 메뉴별 통계 */
 router[METHOD_GET]('/typing/api/statistics/stat-bymenu', authenticate, StatisticsController.getStatByMenu);

 /* DAU / MAU */
 router[METHOD_GET]('/typing/api/statistics/stat-dau', authenticate, StatisticsController.getDAUStat);
 router[METHOD_GET]('/typing/api/statistics/stat-mau', authenticate, StatisticsController.getMAUStat);

 /* Game DAU / MAU */
 router[METHOD_GET]('/typing/api/statistics/stat-game-dau', authenticate, StatisticsController.getGameDAUStat);
 router[METHOD_GET]('/typing/api/statistics/stat-game-mau', authenticate, StatisticsController.getGameMAUStat);

 /* 로그인 리텐션 통계 */
 router[METHOD_GET]('/typing/api/statistics/stat-retain-login', authenticate, StatisticsController.getRetainLogin);

 /* 게임별 실행수 */
 router[METHOD_GET]('/typing/api/statistics/stat-start-bygame', authenticate, StatisticsController.getStatStartByGame);

 router[METHOD_GET]('/typing/api/statistics/stat-start-bygame-daily', authenticate, StatisticsController.getDailyStatStartByGame);
 router[METHOD_GET]('/typing/api/statistics/stat-start-bygame-weekily', authenticate, StatisticsController.getWeeklyStatStartByGame);
 router[METHOD_GET]('/typing/api/statistics/stat-start-bygame-monthly', authenticate, StatisticsController.getMonthlyStatStartByGame);

 /* 게임별 완료수 */
 router[METHOD_GET]('/typing/api/statistics/stat-fin-bygame-daily', authenticate, StatisticsController.getDailyStatFinByGame);
 router[METHOD_GET]('/typing/api/statistics/stat-fin-bygame-weekily', authenticate, StatisticsController.getWeeklyStatFinByGame);
 router[METHOD_GET]('/typing/api/statistics/stat-fin-bygame-monthly', authenticate, StatisticsController.getMonthlyStatFinByGame);


 /* 게임별 리텐션 통계 */
 router[METHOD_GET]('/typing/api/statistics/stat-retain-bygame', authenticate, StatisticsController.getGameRetainLogin);

 /* 유저 월별 타자 정보 */
 router[METHOD_GET]('/typing/api/statistics/stat-user-typingbymonth', StatisticsController.getUserTypingByMonth);

 /* 유저 월별 게임실행 정보 */
 router[METHOD_GET]('/typing/api/statistics/stat-user-gamerunbymonth', StatisticsController.getStatStartByGameAndUser);
 
 /* 게임별 학교 랭킹 정보 */
 router[METHOD_GET]('/typing/api/statistics/stat-school-rank-bygame', RedisController.getSchoolRanking);
 

 //날짜, 주간 리스트
 router[METHOD_GET]('/typing/api/statistics/getymlist', StatisticsController.getYMList);
 router[METHOD_GET]('/typing/api/statistics/getdaylist', StatisticsController.getDayList);
 router[METHOD_GET]('/typing/api/statistics/getweeklist', StatisticsController.getWeeklyList);


  /* 자리연습 통계 */
  router[METHOD_GET]('/typing/api/statistics/stat-lkp-monthly', authenticate, StatisticsController.getMonthlyLkpStat);
  router[METHOD_GET]('/typing/api/statistics/stat-lkp-weekly', authenticate, StatisticsController.getWeeklyLkpStat);
  router[METHOD_GET]('/typing/api/statistics/stat-lkp-daily', authenticate, StatisticsController.getDailyLkpStat);

  /* 낱말연습 통계 */
  router[METHOD_GET]('/typing/api/statistics/stat-ewt-monthly', authenticate, StatisticsController.getMonthlyEwtStat);
  router[METHOD_GET]('/typing/api/statistics/stat-ewt-weekly', authenticate, StatisticsController.getWeeklyEwtStat);
  router[METHOD_GET]('/typing/api/statistics/stat-ewt-daily', authenticate, StatisticsController.getDailyEwtStat);

  /* 짧은글연습 통계 */
  router[METHOD_GET]('/typing/api/statistics/stat-est-monthly', authenticate, StatisticsController.getMonthlyEstStat);
  router[METHOD_GET]('/typing/api/statistics/stat-est-weekly', authenticate, StatisticsController.getWeeklyEstStat);
  router[METHOD_GET]('/typing/api/statistics/stat-est-daily', authenticate, StatisticsController.getDailyEstStat);

  /* 긴글연습 통계 */
  router[METHOD_GET]('/typing/api/statistics/stat-ewrt-monthly', authenticate, StatisticsController.getMonthlyEwrtStat);
  router[METHOD_GET]('/typing/api/statistics/stat-ewrt-weekly', authenticate, StatisticsController.getWeeklyEwrtStat);
  router[METHOD_GET]('/typing/api/statistics/stat-ewrt-daily', authenticate, StatisticsController.getDailyEwrtStat);  

/////////////////////////////////////////////////////////////////////
// word : 문제관리

 router[METHOD_GET]('/typing/api/content/typing/list', authenticate, WordController.indexNresponseJson);
router[METHOD_POST]('/typing/api/content/typing/write', authenticate, WordController.storeNresponseJson);
router[METHOD_POST]('/typing/api/content/typing/delete', authenticate, WordController.deleteNresponseJson);
 router[METHOD_GET]('/typing/api/content/typing/categorylist', authenticate, WordController.categoryList);
router[METHOD_POST]('/typing/api/content/typing/addcategory', authenticate, WordController.categoryAdd);
router[METHOD_POST]('/typing/api/content/typing/delcategory', authenticate, WordController.categoryDel);




module.exports = router;

function authenticate(req, res, next) {
    
    if (req.session.managerId && req.session.username) {

        //페이지 접근 권한 살펴서 없다면  NO_AUTHORITY  반환.
        //console.log( "접근하려는 URI ::: "+req.originalUrl.split('/')[3] );
        let permission = 0;
        switch(req.originalUrl.split('/')[3]) {
            case 'service' : permission = 1; break;
            case 'content' : permission = 2; break;
            case 'ad' : permission = 3; break;
            case 'users' : permission = 4; break;
            case 'point' : permission = 5; break;
            case 'manager' : permission = 6; break;
            case 'monitoring' : permission = 7; break;
            case 'statistics' : permission = 8; break;
            default: break;
        }

        console.log("Authority check::: %j, %j ", req.originalUrl.split('/')[3], req.session.permissions.substr((permission -1) ,1));
        console.log("Authority url check::: %j ", req.originalUrl.split('/')[4]);

        if(req.originalUrl.split('/')[4] == 'pwupdateself') return next();

        if (permission == 0 || (req.session.permissions.substr((permission -1) ,1) > 0))  {
            if(req.session.passwordExpire) res.jsonp({...ResponseCode.PASSWORDEXPIRE });
            else return next(); 
        }
        else return res.jsonp({...ResponseCode.NO_AUTHORITY }); 
        
    } else {
        console.log('↓↓'+ResponseCode.UNAUTHORIZED.message);
        res.jsonp({...ResponseCode.UNAUTHORIZED });
    }
}
