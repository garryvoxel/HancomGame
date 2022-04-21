var express = require('express');
var router = express.Router();

Sequelize = require('sequelize'),
models = require(__dirname + '/../models'),
Moment =  require('moment'),

/* TestApi  
URI param : req.params.id=1  
Get param : req.query= {page: 1 , count: 10} 
Post param : req.body= {id : 1, name: 'test'}
*/

// router.get('/typing/api/createcdnsubfolder', function(req, res) {

//     console.log('Developer API test CAll ');
//     console.log('URL req.params ::: %j ', req.params);
//     console.log('POST req.body :::: %j ', req.body);

//     /**
//      * Event 섭폴더 만들기
//      */

//     EventsController.cdnTest(req, res);
// }),

router.get('/typing/api/cdnfiledel', function(req, res) {

    /**
     * NewImage 삭제
     */

    NewsController.cdnFileDel(req, res);
}),

router.post('/typing/api/devtest', function(req, res) {

    console.log('Developer API test CAll ');
    console.log('URL req.params ::: %j ', req.params);
    console.log('POST req.body :::: %j ', req.body);


    /**
     * Event 섭폴더 만들기
     */

    EventsController.cdnTest(req, res);

    /**
     * Event 파일 업로드
     */
    //EventsController.storeNresponseJson(req, res);

    /**
     * 랭킹
     */
    //RedisController.getRanking(req, res);

    /**
     * 탑뉴스로 고정
     */
    //NewsController.setTopNewsNresponseJson(req, res);

}),

router.get('/typing/api/db', function(req, res){
    let _send_message='test';
    models.sequelizes.WebDB.query("select date_format(now(),'%Y-%m-%d %H:%i:%s') as 현재시간 ", {
        type: models.Sequelize.QueryTypes.SELECT
    })
    .then(rs=>{
        console.log('RS 현재 시간 ::: %j', rs[0]['현재시간']);
        let _moment_org = Moment().utcOffset('+0900').format("YYYY-MM-DD HH:mm:ss")
        let _moment = Moment(rs[0]['현재시간']).utcOffset('+0900').format("YYYY-MM-DD HH:mm:ss")
        let _moment_not_modify = Moment(rs[0]['현재시간']).format("YYYY-MM-DD HH:mm:ss")
        res.jsonp({...rs
            , '모멘트 현재시간':_moment_org
            , '모멘트에서 조정한 시간': _moment 
            , '모멘트에서 조정한 안한': _moment_not_modify 
        });
    })
    
}),    
router.get('/typing/api/devtest', function(req, res){

    //req.query= {range: '201903'}

    console.log('Developer API test CAll ');
    console.log('URL req.params ::: %j ', req.params);
    console.log('GET req.query :::: %j ', req.query);


    /**
     * 게시판 신고글
     */
    ForumController.accusationIndexNresponseJson(req, res);
    /**
     * 총 누적회원
     */
    //StatisticsController.getTotalMemberCount(req, res);

    /**
     * ymList
     * req.query= {year: '2019'}
     */
    //StatisticsController.getYMList(req,res);

    /**
     * 콘텐츠관리 
     */
    //WordController.indexNresponseJson(req,res);

    /**
     * 관리자 즐겨 찾기
     */
    //FavorLinksController.getList(req, res);

    /**
     * 통계 - Login
     * req.query= {range: '201903'}
     */
    //StatisticsController.getLoginStatistics(req, res);

    //* 컨텐츠관리 장문 등록
    //req.params.id=1
    //ContentsController.cvsUploadNresponseJson(req, res);
    //*/

    /* ForumComment Info
    //req.params.id=1
    ForumController.reportCommentInfoNresponseJson(req, res);
    */

    /* Clan list
    req.query= {page: 1 , count: 10} 
    ClanController.indexNresponseJson(req, res)
    */

    /* Slang List
    req.params.id=2;
    SlangController.indexNresponseJson(req, res);
    */

//------------------ 광고관리    

    /* Ad Info
    req.params.id=2;
    AdController.infoNresponseJson(req, res);
    */

    /* Ad Write
    req.body= {
        platform: 'web'
        , type: 'main-bottom1'
        , is_active: '0'
        , image_url: 'http://yijoongwon.net/testimg/W1290H200.png'
        , target_uri: 'https://www.google.com/'
        , start_at: '2019-03-17'
        , end_at: '2019-03-20'
    }
    AdController.storeNresponseJson(req, res);
    */
    
    /* Ad List
    req.query= {page: 1 , count: 10}
    AdController.indexNresponseJson(req, res);
    */

//------------------ 유저관리    
    /* UserInfo
    req.params.id=32659461
    UsersController.infoNresponseJson(req, res);
    */

    /* UserList
    req.query= {page: 1 , count: 10}
    UsersController.indexNresponseJson(req, res);
    */
});

module.exports = router;
