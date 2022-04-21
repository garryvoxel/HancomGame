const 
cRedis = require(__dirname + '/../classes/redis'),
models = require(__dirname + '/../models'),
ResponseCode = require(__dirname + '/../classes/response_code'),
Users = models.Users,
School = models.School,
UserSchool = models.UserSchool,
Moment =  require('moment');

UserSchool.belongsTo(School, {foreignKey: 'school_id'});

var rankingRedis = new cRedis();
var weekRankingRedis = rankingRedis.getWeekRankingRedis();

const RedisController = {
    getRanking (req,res) {
        _game_code = req.body.game_code;
        _start = req.body.start;
        _end = req.body.end;

        getGameRankingRedis(req, res, _game_code,_start,_end);

        function getGameRankingRedis(req, res, _game_code,_start,_end){
            /*
            let temp = '{"code":1,"message":"Ok","result":{"rows":[{"rank":1,"nickname":"Test104","gamedata":"30812"},{"rank":2,"nickname":"하하호호","gamedata":"15366"},{"rank":3,"nickname":"kenima","gamedata":"10524"},{"rank":4,"nickname":"치자피즈","gamedata":"9613"},{"rank":5,"nickname":"서슬푸른","gamedata":"6250"},{"rank":6,"nickname":"MANLV2","gamedata":"2148"},{"rank":7,"nickname":"일단해보자","gamedata":"1576"},{"rank":8,"nickname":"데브닉네임여덟자","gamedata":"774"},{"rank":9,"nickname":"MANLEV","gamedata":"633"},{"rank":10,"nickname":"이쏘2","gamedata":"500"},{"rank":11,"nickname":"12","gamedata":"410"},{"rank":12,"nickname":"두더지","gamedata":"59"}],"count":24,"totalCount":12,"status":"OK","userList":[{"id":32658276,"nickname":"일단해보자","target_typing_speed":50,"target_typing_accuracy":30},{"id":32659866,"nickname":"서슬푸른","target_typing_speed":2,"target_typing_accuracy":60},{"id":32659893,"nickname":"kenima","target_typing_speed":50,"target_typing_accuracy":40},{"id":32660064,"nickname":"하하호호","target_typing_speed":200,"target_typing_accuracy":50},{"id":32660103,"nickname":"치자피즈","target_typing_speed":600,"target_typing_accuracy":95},{"id":32660187,"nickname":"데브닉네임여덟자","target_typing_speed":1,"target_typing_accuracy":1},{"id":32662041,"nickname":"두더지","target_typing_speed":0,"target_typing_accuracy":0},{"id":32737119,"nickname":"MANLV2","target_typing_speed":800,"target_typing_accuracy":90},{"id":32738406,"nickname":"MANLEV","target_typing_speed":850,"target_typing_accuracy":85},{"id":32844246,"nickname":"이쏘2","target_typing_speed":300,"target_typing_accuracy":95},{"id":32844279,"nickname":"12","target_typing_speed":50,"target_typing_accuracy":1}],"schoolList":[{"user_id":32658276,"school_id":24,"year":3,"classroom":"새우깡","updated_at":"2019-03-20T04:27:27.000Z","created_at":"2019-03-09T13:26:29.000Z","School.id":24,"School.region":"서울특별시","School.name":"한영고등학교","School.address":"서울특별시 강동구 동남로 832 (상일동.한영고등학교)","School.website":"http://hanyoung.hs.kr","School.created_at":"2019-03-20T04:27:27.000Z"},{"user_id":32659866,"school_id":12,"year":1,"classroom":"1","updated_at":"2019-03-14T05:08:11.000Z","created_at":"2019-03-14T05:08:11.000Z","School.id":12,"School.region":"대구광역시","School.name":"대구대덕초등학교","School.address":"대구광역시 남구 대명서로 28 . 대덕초등학교 (대명동)","School.website":"http://www.daeduk.es.kr","School.created_at":"2019-03-14T05:08:11.000Z"},{"user_id":32659893,"school_id":27,"year":3,"classroom":"1","updated_at":"2019-03-26T02:20:52.000Z","created_at":"2019-03-15T04:28:27.000Z","School.id":27,"School.region":"대구광역시","School.name":"대구고등학교","School.address":"대구광역시 남구 중앙대로 171 . 대구고등학교 (대명동)","School.website":"http://www.daegu.hs.kr","School.created_at":"2019-03-26T02:20:52.000Z"},{"user_id":32660064,"school_id":15,"year":1,"classroom":"6","updated_at":"2019-03-26T02:21:30.000Z","created_at":"2019-03-15T04:27:38.000Z","School.id":15,"School.region":"서울특별시","School.name":"상계제일중학교","School.address":"서울특별시 노원구 덕릉로86길 29-15 . 상계제일중학교 (중계동)","School.website":"http://www.sanggyejeil.ms.kr","School.created_at":"2019-03-15T04:28:48.000Z"},{"user_id":32660103,"school_id":34,"year":0,"classroom":"","updated_at":"2019-04-04T07:02:30.000Z","created_at":"2019-03-28T04:00:49.000Z","School.id":34,"School.region":"경기도","School.name":"청강문화산업대학교","School.address":"경기도 이천시 마장면 청강가창로 389-94 (해월리, 청강문화산업대학)","School.website":"http://www.ck.ac.kr","School.created_at":"2019-04-04T06:40:27.000Z"},{"user_id":32660187,"school_id":17,"year":6,"classroom":"1","updated_at":"2019-03-15T04:31:10.000Z","created_at":"2019-03-15T04:30:32.000Z","School.id":17,"School.region":"서울특별시","School.name":"서울대학교","School.address":"서울특별시 관악구 관악로 1 (신림동, 서울대학교)","School.website":"http://www.snu.ac.kr/index.html","School.created_at":"2019-03-15T04:31:10.000Z"},{"user_id":32662041,"school_id":32,"year":6,"classroom":"9999999","updated_at":"2019-03-28T03:56:03.000Z","created_at":"2019-03-28T03:56:03.000Z","School.id":32,"School.region":"서울특별시","School.name":"KDB금융대학교","School.address":"서울특별시 영등포구 은행로 14 (여의도동, 산업은행본점)","School.website":"http://kfu.kdb.co.kr","School.created_at":"2019-03-28T03:56:03.000Z"},{"user_id":32737119,"school_id":21,"year":2,"classroom":"1","updated_at":"2019-04-05T08:20:23.000Z","created_at":"2019-03-18T02:29:21.000Z","School.id":21,"School.region":"전라남도","School.name":"전남과학대학교","School.address":"전라남도 곡성군 옥과면 대학로 113 (옥과리)","School.website":"http://www.cntu.ac.kr","School.created_at":"2019-03-19T01:42:33.000Z"},{"user_id":32738406,"school_id":25,"year":3,"classroom":"1","updated_at":"2019-03-23T02:38:18.000Z","created_at":"2019-03-19T01:42:33.000Z","School.id":25,"School.region":"경기도","School.name":"서울예술대학교","School.address":"경기도 안산시 단원구 예술대학로 171 (고잔동, 서울예술대학)","School.website":"http://www.seoularts.ac.kr","School.created_at":"2019-03-23T02:38:18.000Z"},{"user_id":32844246,"school_id":17,"year":5,"classroom":"1","updated_at":"2019-04-08T07:57:44.000Z","created_at":"2019-04-08T07:56:27.000Z","School.id":17,"School.region":"서울특별시","School.name":"서울대학교","School.address":"서울특별시 관악구 관악로 1 (신림동, 서울대학교)","School.website":"http://www.snu.ac.kr/index.html","School.created_at":"2019-03-15T04:31:10.000Z"}]}}';
            res.jsonp(JSON.parse(temp));
            */

            //*
            weekRankingRedis.zrevrange(_game_code, _start, _end, 'WITHSCORES',(err,reply)=>{
                let _data ={};
    
                if(err){
                    console.error('ranking_redis_select_err >> zrevrange error (redis)!!!!..'+err);
                    _data.status = "REDIS_CONN_ERROR";
                    res.jsonp({...ResponseCode.ERROR, result: _data});
                }else{
                    if(reply<=0){
                        //레디스에 해당게임 랭킹정보가 없음 .
                        _data.status = "NODATA";
                        res.jsonp({...ResponseCode.OK, result: _data});
                    }else{
                        _data.rows =[];
                        _data.count = reply.length;
                        _data.totalCount = reply.length/2;
    
                        var rank = 0;

                        let nicknamesArr = [];
    
                        for(var i = 0; i < _data.count; i++)
                        {
                            let rowdata = {};
                            rowdata.rank = rank += 1;
                            rowdata.nickname = reply[i];
                            nicknamesArr.push(reply[i]);
                            rowdata.gamedata = reply[i+=1];
                            _data.rows.push(rowdata);
                        }
                        _data.status = "OK";
                        
                        //res.jsonp({...ResponseCode.OK, result: _data});
                        //학교 정보와 평균타수 정보를 가져옴
                        Users
                            .findAll({
                                attributes: ['id','nickname','target_typing_speed','target_typing_accuracy'],
                                where: {
                                    nickname : nicknamesArr
                                }
                            })
                            .then (userList =>{
                                if(!userList.length) {
                                    res.jsonp({...ResponseCode.OK, result: _data});
                                } else {
                                    _data.userList = userList;
                                    let userIdsArr = [];
                                    for (let i in userList ){
                                        userIdsArr.push(userList[i].id);
                                    }

                                    return UserSchool
                                        .findAll({
                                            where: {
                                                user_id : userIdsArr
                                            },
                                            raw: true,
                                            include: [ School ]
                                        })
                                }
                            })
                            .then(schoolList=>{
                                _data.schoolList = schoolList;
                                let _query ;
                                switch(_game_code)
                                {
                                    case "SETCOIN_RANKING":
                                    {
                                        _query = "SELECT UUID as user_id, Win, Lose, Draw FROM TbSetCoin WHERE UUID in (?)";
                                    }break;
                                    case "PANCHANGE_RANKING":
                                    {
                                        _query = "SELECT UUID as user_id, Win, Lose, Draw FROM TbPanChange WHERE UUID in (?) ";
                              
                                    }break;
                                    case "MOLE_RANKING":
                                    {
                                        _query = "SELECT UUID as user_id, MAX(Stage) AS stage, SUM(Score) AS score FROM TbMole WHERE UUID in (?) group by UUID order by stage desc";
                              
                                    }break;
                                    case "TYPING_RANKING":
                                    {
                                        _query = "SELECT UUID as user_id, TotalSpeedCount FROM TbTwoTypingSpeed_"+Moment().utcOffset('+0900').format("YYYYMM")+" WHERE UUID in (?)";
                                    }break;
                                }                                
                                
                                let userIdsArr = [];
                                for (let i in _data.userList ){
                                    userIdsArr.push(_data.userList[i].id);
                                }

                                return models.sequelizes.GameDB.query(_query,{
                                    replacements: [userIdsArr]
                                    ,type: models.sequelizes.GameDB.QueryTypes.SELECT});
                            })
                           .then(gameData=>{
                                _data.gameData= gameData;
                                res.jsonp({...ResponseCode.OK, result: _data});
                           })
                    }
    
                }
            });
        //*/    
        }
    },

    getSchoolRanking(req, res) {
        console.log(`[RedisController.getSchoolRanking] Start!!`);

        let _schoold_id = req.query.SchoolId;

        let _gameCode='';
        switch (req.query.gameid){
            case '10000': _gameCode = 'SETCOIN_SCHOOL_RANKING'; break;
            case '10001': _gameCode = 'PANCHANGE__SCHOOL_RANKING'; break;
            case '10002': _gameCode = 'MOLE_SCHOOL_RANKING'; break;
            case '10003': _gameCode = 'TYPING_SCHOOL_RANKING'; break;
            default :
        }
        console.log("랭크:::%j", _gameCode);
        weekRankingRedis.zrevrange(_gameCode, 0, 99, 'WITHSCORES',(err,reply)=>{ 
            let _data ={};
    
            if(err){
                console.error('ranking_redis_select_err >> zrevrange error (redis)!!!!..'+err);
                _data.status = "REDIS_CONN_ERROR";
                res.jsonp({...ResponseCode.ERROR, result: _data});
            }else{
                if(reply<=0){
                    //레디스에 해당게임 랭킹정보가 없음 .
                    console.log("Redis에 랭크정보 없음.");
                    res.jsonp({...ResponseCode.OK, result: 'NORANK'});
                }else{
                    console.log("Redis에 랭크정보 있음.");
                    console.log("Rank 정보 Redis 조회 결과값 ::: %j", reply);
                    _data.rows =[];
                    _data.count = reply.length;

                    var rank = 0;
                    var rank_ok = 0;

                    for(var i = 0; i < _data.count; i++)
                    {
                        rank++;
                        console.log("Rank :: %j / 학교 코드 :: %j / Loog Code :: %j ", rank, _schoold_id, reply[i]);
                        if(reply[i] == _schoold_id) { rank_ok=1; break; }
                        i++;
                    }
                    if(rank_ok != 1)  rank = 0
                    res.jsonp({...ResponseCode.OK, result: rank});

                }

            }            
        })
    }

    
}

module.exports = RedisController;
