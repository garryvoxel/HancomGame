const redis = require('./redis');
const async = require('async'); // kevin added
const PACKET_ERR = require('./packet_err').PACKET_ERR;
const mysql = require('./mysql');
const moment = require('moment');
require('moment-timezone');


//게임 스쿨 랭킹 레디스 정보 받기  start 1위 : 0  end 100위 : 99
exports.get_game_rank_redis_school = function(gamecode, start, end, session_id, last_rank, callback) {

    var task = [

        //레디스가 비어있으면 게임데이터를 레디스에 넣는다.
        function(callback1) {
            const rank_game_redis = redis.getWeekRankingRedis();
            let _gmaecode = gamecode;
            let checkCount = 0;
            rank_game_redis.zrevrange(_gmaecode, 0, 10, 'WITHSCORES', (err, reply) => {
                if (err) {
                    console.log("레디스 토탈 카운트 에러" + err);
                } else {
                    checkCount = reply.length;
                    console.log("레디스 체크카운트 11======================" + checkCount);
                    callback1(null, checkCount)
                }
            });
        },
        function(checkCount, callback1) {

            console.log("레디스 체크카운트22 ======================" + checkCount);

            // 카운트가 0일때만 물리디비에서 각 랭킹을 가져 옵니다 FROM WebDB.TbUserRankRedis
            // 위 테이블을 유저가 실시간으로 레디스에 저장할때 물리디비에 백업합니다.


            if (checkCount === 0) {
                let _query;

                // 서버는 UTC0시이나 디비저장을 한국 시간으로 하고 있음
                moment.tz.setDefault("Asia/Seoul");
                var date = moment().format('YYYY-MM-DD');

                console.log("오늘의 시간 ===========================================" + date);

                _query = "SELECT school_id, score, update_time FROM WebDB.TbSchoolRankRedis where rediskey = '" + gamecode + "' and update_time >= '" + date + "' ORDER BY update_time desc limit 100";

                console.log("만든 쿼리 ==================" + _query);
                mysql.getWebRead().getConnection((err, con) => {
                    if (err) {
                        con.release();
                        console.error('백업 SCHOOL REDIS READ >> getConnection error (mysql err)!!!' + err);
                        callback(PACKET_ERR.COMMON_GET_CONNECTION_ERR);
                        return;
                    } else {
                        con.query(_query, (err, result, fields) => {
                            con.release();
                            if (err) {
                                console.error("백업SCHOOL REDIS READ >> 쿼리에러 !! " + err);
                                let data = null;
                                callback();
                            } else {

                                let data = [];
                                console.log(" SCHOOL 디비 결과값 길이 ====================" + result.length)
                                if (result.length > 0) {
                                    /*  let rowdata = {};
                                     rowdata = result;
                                     console.log("데이터 ==="+rowdata);
                                     data.push(rowdata); */

                                    for (var i = 0; i < result.length; i++) {
                                        let rowdata = {};
                                        console.log("SCHOOL 랭킹 읽는다 ===== 닉네임 ================" + result[i].school_id);
                                        rowdata.school_id = result[i].school_id;
                                        rowdata.score = result[i].score;
                                        data.push(rowdata);
                                    }


                                    callback1(null, data);
                                } else {
                                    console.log("레디스 스쿨 복원할 물리디비 데이터가 없습니다 -----------------------");
                                    callback(PACKET_ERR.READ_RANK_REDIS_NODATA);
                                    return;
                                }

                            }
                        });
                    }
                });
            } else {
                let data = [];
                callback1(null, data);
            }



        },

        function(data, callback1) {

            //console.log("데이터 사이즈 ====================" + data.length);

            /* 데이터가 0보다 크다면 레디스가 비었고 레디스백업디비로 부터 읽어온것입니다. */
            if (data.length > 0) {
                //console.log("레디스비어서 데이터 넣습니다 =============================");
                const redis_rank = redis.getWeekRankingRedis();
                for (var i = 0; i < data.length; i++) {
                    let row = {};
                    row = data[i];

                    redis_rank.zadd(gamecode, row.score, row.school_id, (err, res) => {
                        if (err) {
                            console.error('SCHOOL RANK REDIS ......error (redis)!!!!..' + err);
                            callback(PACKET_ERR.RANKING_REDIS_CONNECTION_ERR);
                            return;
                        } else {
                            if (res <= 0) {
                                console.error('typing write_game_result >>...5..res...' + res);
                                callback(PACKET_ERR.TYPING_RANKING_REDIS_SCHOOOL_REDIS_RES);
                                return;
                            } else {
                                console.log("레디스 복원 성공 ======================== ");
                            }
                        }
                    });

                } //for
                callback1(null);

            } else {
                console.log("레디스 데이터 존재함으로 그냥 넘어갑니다 =============================");
                callback1(null);
            }
        },

        // 세션에 따라 요청자 정보 받기
        function(callback1) {

            var id;


            mysql.getAccountRead().getConnection((err, con) => {
                if (err) {
                    if (con) con.release();
                    console.error('read_rank_school >> getConnection error (mysql err)!!!' + err);
                    callback(PACKET_ERR.READ_RABK_DOESNT_EXIST);
                    return;
                } else {

                    let _query = "call WEB_check_session(?)";
                    con.query(_query, [session_id], (err1, result, fields) => {
                        if (con) con.release();
                        if (err1) {
                            console.log('read_rank_school >> query error (mysql err)!!!' + err1);
                            callback(PACKET_ERR.MYSQL_READ_BY_SESSION_NOT_INFO);
                            return;
                        } else {

                            if (result[0] !== null) {

                                let minedata = {};

                                //내 학교 순위를 알기 위해서 내정보를 체크 해둡니다.

                                for (var i = 0; i < result.length; i++) {
                                    for (var j = 0; j < result[i].length; j++) {
                                        minedata.id = result[i][j].id;

                                    }

                                }


                                if (minedata.id === undefined) {
                                    minedata = null;
                                    callback1(null, minedata);
                                } else {
                                    callback1(null, minedata);
                                }

                            } else {

                                callback(PACKET_ERR.MYSQL_READ_BY_SESSION_NOT_MATCH);
                                return;
                            }

                        }
                    });

                }

            })

        },

        function(minedata, callback1) {
            if (minedata !== null) {
                let _query = "SELECT * FROM WebDB.UserSchools WHERE user_id =" + minedata.id;

                mysql.getWebRead().getConnection((err, con) => {
                    if (err) {
                        if (con) con.release();
                        console.error('get rank redis for school first myself serch schoolID >> getConnection error (mysql err)!!!' + err);
                        callback(PACKET_ERR.COMMON_GET_CONNECTION_ERR);
                        return;
                    } else {

                        con.query(_query, (err, result, fields) => {
                            if (con) con.release();
                            if (err) {
                                console.error("QueryError Rank School Redis " + err);
                                callback(PACKET_ERR.COMMON_FAIL, null);
                                return;
                            } else {
                                if (result.length > 0) {

                                    //포이치로 돌려서 레디스의 랭커 학교 아이디와 디비의 학교정보 아이디를 비교해서 데이터를 조합합니다.
                                    result.forEach(function(row) {

                                        minedata.school = row.school_id;

                                    });

                                    let _query = "SELECT id, name FROM  Schools WHERE id =" + minedata.school;

                                    //레디스의 학교 아이디를 취합해서 한방쿼리로 학교정보를 끌고 옵니다.
                                    mysql.getWebRead().getConnection((err, con) => {
                                        if (err) {
                                            if (con) con.release();
                                            console.error('get rank redis for school game >> getConnection error (mysql err)!!!' + err);
                                            callback(PACKET_ERR.COMMON_GET_CONNECTION_ERR);
                                            return;
                                        } else {

                                            con.query(_query, (err, result, fields) => {
                                                let MyRank = {};
                                                if (con) con.release();
                                                if (err) {
                                                    console.error("QueryError Rank School Redis " + err);
                                                    callback(PACKET_ERR.COMMON_FAIL, null);
                                                    return;
                                                } else {
                                                    if (result[0] != null) {

                                                        //포이치로 돌려서 레디스의 랭커 학교 아이디와 디비의 학교정보 아이디를 비교해서 데이터를 조합합니다.
                                                        result.forEach(function(row) {

                                                            minedata.schoolname = row.name;

                                                        });



                                                    } else {
                                                        console.error("Ther is Not Rank School Game Data ");
                                                        callback(PACKET_ERR.COMMON_NO_DATA, null);
                                                        return;

                                                    }



                                                }
                                            })

                                        }

                                    });

                                    callback1(null, minedata);

                                } else {
                                    // 내학교정보가 없다. 1번은 학교정보가 없음.
                                    //  minedata.school = "학교정보미입력";
                                    minedata.school = 1;
                                    callback1(null, minedata);

                                }

                            }
                        })

                    }

                });
            } else {

                console.log("스쿨랭킹 내세션이 없습니다 ---------------");
                callback1(null, minedata);
            }

        },

        function(minedata, callback1) {

            if (minedata !== null) {
                const rank_game_redis = redis.getWeekRankingRedis();
                let _gmaecode = gamecode;
                //게임코드는 프론트단에서 받아옵니다. 
                rank_game_redis.zrevrange(_gmaecode, 0, -1, 'WITHSCORES', (err, reply) => {
                    let _data = {};

                    if (err) {
                        console.error('ranking_redis_select_err >> zrevrange error (redis)!!!!..' + err);
                        _data.result = PACKET_ERR.READ_RANK_REDIS_CONNECTION_ERR;
                        callback(PACKET_ERR.READ_RANK_REDIS_CONNECTION_ERR, _data);
                        return;
                    } else {
                        if (reply <= 0) {
                            // 레디스에 해당게임 랭킹정보가 없을 리스폰스 하자.
                            // console.error('no ranking data from redis >> zincrby error (redis res)!!!!..'+res);
                            console.log("데이터 없음");
                            _data.result = PACKET_ERR.READ_RANK_REDIS_NODATA;
                            callback(PACKET_ERR.READ_RANK_REDIS_NODATA, _data);
                            return;
                        } else {
                            let _data = [];
                            let _count = reply.length;

                            var rank = 0;
                            var _school_id4check = 0;
                            var _gamedata = 0;
                            for (var i = 0; i < _count; i++) {

                                rank = rank += 1;

                                //입력값이 문자로 들어올수 있어서 INT로 파싱을 합니다.
                                _school_id4check = parseInt(reply[i]);

                                //학교정보를 나타내는 ID가 null인경우가 있어 이경우 1번으로 셋팅합니다
                                //1번은 DB상에 학교 없음 이라는 정보로 리턴합니다.
                                if (isNaN(_school_id4check)) {
                                    _school_id4check = 1;
                                }

                                _gamedata = reply[i += 1]; //학교 스코어

                                console.log("마인데이터 학교아이디 ===========" + minedata.school);
                                if (_school_id4check === minedata.school) {
                                    minedata.rank = rank;
                                    minedata.gamedata = _gamedata;
                                    break;
                                }

                            }

                            callback1(null, minedata)
                        }

                    }
                });
            } else {
                callback1(null, minedata)
            }

        },

        // 스쿨랭킹 레디스에서 랭킹 정보 받기 
        function(minedata, callback1) {
            const rank_game_redis = redis.getWeekRankingRedis();

            let _gmaecode = gamecode;
            let _start = start;
            let _end = end;

            /*    console.log("마인데이타 닉네임"+minedata.id);
               console.log("게임코드 "+_gmaecode); */

            let totalCount = 0;

            //페이지네이션을 위해서 최초에 레디스의 랭킹 토탈 카운트를 얻습니다.
            rank_game_redis.zrevrange(_gmaecode, 0, -1, 'WITHSCORES', (err, reply) => {
                if (err) {
                    console.log("레디스 토탈 카운트 에러" + err);
                } else {
                    totalCount = reply.length;
                    console.log("레디스 토탈 카운트" + totalCount);
                }
            });

            //게임코드는 프론트단에서 받아옵니다. 
            rank_game_redis.zrevrange(_gmaecode, _start, _end, 'WITHSCORES', (err, reply) => {
                let _data = {};

                if (err) {
                    console.error('ranking_redis_select_err >> zrevrange error (redis)!!!!..' + err);
                    _data.result = PACKET_ERR.READ_RANK_REDIS_CONNECTION_ERR;
                    callback(PACKET_ERR.READ_RANK_REDIS_CONNECTION_ERR, _data);
                    return;
                } else {
                    if (reply <= 0) {
                        // 레디스에 해당게임 랭킹정보가 없을 리스폰스 하자.
                        // console.error('no ranking data from redis >> zincrby error (redis res)!!!!..'+res);
                        console.log("데이터 없음");
                        _data.result = PACKET_ERR.READ_RANK_REDIS_NODATA;
                        callback(PACKET_ERR.READ_RANK_REDIS_NODATA, _data);
                        return;
                    } else {

                        let _data = [];
                        let _count = reply.length;

                        var rank = 0;

                        for (var i = 0; i < _count; i++) {
                            let rowdata = {};

                            /*  페이지네이션 하기전코드
                             rowdata.rank = rank += 1; */


                            // 페이지네이션에 따라 전페이지의 마지막랭킹 숫자를 가져옵니다.
                            rowdata.rank = last_rank += 1;

                            //입력값이 문자로 들어올수 있어서 INT로 파싱을 합니다.
                            rowdata.school = parseInt(reply[i]);

                            //학교정보를 나타내는 ID가 null인경우가 있어 이경우 1번으로 셋팅합니다
                            //1번은 DB상에 학교 없음 이라는 정보로 리턴합니다.
                            if (isNaN(rowdata.school)) {
                                rowdata.school = 1;
                            }

                            rowdata.gamedata = reply[i += 1]; //schoolname
                            rowdata.schoolname = "없음";

                            _data.push(rowdata);

                        }

                        callback1(null, _data, _count, minedata, totalCount)
                    }

                }
            });
        },

        // 학교 이름 정보 받아오기 
        function(data2, count, minedata, totalCount, callback1) {

            var str_query = "(";

            //console.log("들어온 카운트 "+data.length);
            //한방 쿼리를 만들기위해 닉네임을 하나의 문자열로 조립합니다.
            for (var i = 0; i < data2.length; i++) {

                let rowdata = {};

                rowdata = data2[i];

                //school은 학교 아이디 입니다.
                var school = rowdata.school.toString();
                //   console.log("아이디-->"+rowdata.school);
                //쿼리조합 합니다.

                if (i == (data2.length - 1)) {
                    str_query += school;
                } else {
                    str_query += school + ",";
                }
            }
            str_query += ")";
            // console.log("쿼리-----"+str_query);

            let _query = "SELECT id, name FROM  Schools WHERE id IN " + str_query;

            //레디스의 학교 아이디를 취합해서 한방쿼리로 학교정보를 끌고 옵니다.
            mysql.getWebRead().getConnection((err, con) => {
                if (err) {
                    if (con) con.release();
                    console.error('get rank redis for school game >> getConnection error (mysql err)!!!' + err);
                    callback(PACKET_ERR.COMMON_GET_CONNECTION_ERR);
                    return;
                } else {

                    con.query(_query, (err, result, fields) => {
                        let MyRank = {};
                        if (con) con.release();
                        if (err) {
                            console.error("QueryError Rank School Redis " + err);
                            callback(PACKET_ERR.COMMON_FAIL, null);
                            return;
                        } else {
                            if (result[0] != null) {

                                //포이치로 돌려서 레디스의 랭커 학교 아이디와 디비의 학교정보 아이디를 비교해서 데이터를 조합합니다.
                                result.forEach(function(row) {

                                    for (var i = 0; i < data2.length; i++) {


                                        console.log("로우 학교아이디" + row.id);
                                        if (data2[i].school === row.id) {
                                            console.log("내부 학교아이디" + data2[i].school);
                                            data2[i].schoolname = row.name

                                        }
                                    }
                                });
                                // 요청자의 학교 아이디와 일치함을 따져서 내 학교 랭커 정보를 별개로 뽑습니다.
                                /*  for (var i = 0; i < data2.length; i++) {
                                     let _minedata = {};
                                     _minedata = data2[i];
                                     if (minedata.id == _minedata.id) {
                                         minedata = _minedata;
                                         MyRank = minedata;
                                         break;
                                     }
                                 } */
                                let _minedata = {};

                                if (minedata !== null) {
                                    _minedata.rank = minedata.rank;
                                    _minedata.school = minedata.school;
                                    _minedata.gamedata = minedata.gamedata;
                                    _minedata.schoolname = minedata.schoolname;
                                    MyRank = _minedata;
                                } else {

                                }


                                callback1(null, data2, count, MyRank, totalCount);

                            } else {
                                console.error("Ther is Not Rank School Game Data ");
                                callback(PACKET_ERR.COMMON_NO_DATA, null);
                                return;

                            }



                        }
                    })

                }

            });

        }

    ];

    async.waterfall(task, (err, data, count, MyRank, totalCount) => {
        if (err) {
            callback(PACKET_ERR.READ_RABK_DOESNT_EXIST, data, count, MyRank);
        } else {

            callback(PACKET_ERR.SUCCESS, data, (count / 2), MyRank, (totalCount / 2));
        }

    });

}

//게임 랭크 레디스 정보 받기 BY GAMECODE
exports.get_game_rank_redis = function(gamecode, start, end, session_id, last_rank, callback) {


    var task = [

        //레디스가 비어있으면 게임데이터를 레디스에 넣는다.
        function(callback1) {
            const rank_game_redis = redis.getWeekRankingRedis();
            let _gmaecode = gamecode;
            var checkCount = 0;
            rank_game_redis.zrevrange(_gmaecode, 0, -1, 'WITHSCORES', (err, reply) => {
                if (err) {
                    console.log("레디스 토탈 카운트 에러" + err);
                } else {
                    checkCount = reply.length;
                    console.log("레디스 체크카운트 11======================" + checkCount);
                    callback1(null, checkCount)
                }
            });



        },
        function(checkCount, callback1) {


            console.log("레디스 체크카운트22======================" + checkCount);

            // 카운트가 0일때만 물리디비에서 각 랭킹을 가져 옵니다 FROM WebDB.TbUserRankRedis
            // 위 테이블을 유저가 실시간으로 레디스에 저장할때 물리디비에 백업합니다.
            if (checkCount === 0) {
                let _query;

                // 서버는 UTC0시이나 디비저장을 한국 시간으로 하고 있음
                moment.tz.setDefault("Asia/Seoul");
                var date = moment().format('YYYY-MM-DD');

                console.log("오늘의 시간 ===========================================" + date);

                _query = "SELECT nickname, score, update_time FROM WebDB.TbUserRankRedis where rediskey = '" + gamecode + "' and update_time >= '" + date + "' ORDER BY update_time desc limit 100";

                mysql.getWebRead().getConnection((err, con) => {
                    if (err) {
                        con.release();
                        console.error('백업USER REDIS READ >> getConnection error (mysql err)!!!' + err);

                    } else {
                        con.query(_query, (err, result, fields) => {
                            con.release();
                            if (err) {
                                console.error("백업 USER REDIS READ >> 쿼리에러 !! " + err);
                                let data = null;
                                callback1(null, data);
                            } else {

                                let data = [];
                                console.log("USER REDIS 디비 결과값 길이 ====================" + result.length)
                                if (result.length > 0) {
                                    /*  let rowdata = {};
                                     rowdata = result;
                                     console.log("데이터 ==="+rowdata);
                                     data.push(rowdata); */
                                    for (var i = 0; i < result.length; i++) {
                                        let rowdata = {};
                                        console.log("USER REDIS 랭킹 읽는다 ===== 닉네임 ================" + result[i].nickname);
                                        rowdata.nickname = result[i].nickname;
                                        rowdata.score = result[i].score;
                                        data.push(rowdata);
                                    }

                                    callback1(null, data);
                                } else {
                                    console.log("레디스 복원할 물리디비 데이터가 없습니다 -----------------------");
                                    callback(PACKET_ERR.READ_RANK_REDIS_NODATA);
                                    return;
                                }

                            }
                        });
                    }
                });
            } else {
                let data = [];
                callback1(null, data);
            }


        },

        // 레디스에 데이터를 새로 갱신 합니다. 
        function(data, callback1) {
            console.log("게인랭킹 물리디비데이터 사이즈 ====================" + data.length);

            /* 데이터가 0보다 크다면 레디스가 비었고 레디스백업디비로 부터 읽어온것입니다. */
            if (data.length > 0) {
                const redis_rank = redis.getWeekRankingRedis();
                for (var i = 0; i < data.length; i++) {
                    let row = {};
                    row = data[i];
                    redis_rank.zadd(gamecode, row.score, row.nickname, (err, res) => {
                        if (err) {
                            console.error('USER RANK REDIS >> zadd ...2...error (redis)!!!!..' + err);
                            callback(PACKET_ERR.RANKING_REDIS_CONNECTION_ERR);
                            return;
                        } else {
                            if (res <= 0) {
                                console.error('typing write_game_result >>...5..res...' + res);
                                callback(PACKET_ERR.TYPING_RANKING_REDIS_SCHOOOL_REDIS_RES);
                                return;
                            } else {
                                console.log("개인랭킹 레디스 복원 성공 ======================== ");
                            }
                        }
                    });
                } //for
                callback1(null);

            } else {
                console.log("게인 랭킹 레디스 데이터 존재함으로 그냥 넘어갑니다 =============================");
                callback1(null);
            }
        },

        // 세션정보를 통해 내정보를 캣취합니다.
        function(callback1) {

            if(session_id === undefined || session_id === null || session_id === ""){

                var first_minedata = null;
                callback1(null, first_minedata);

            }else{
                mysql.getAccountRead().getConnection((err, con) => {
                    if (err) {
                        if (con) con.release();
                        console.error('read_rank_school >> getConnection error (mysql err)!!!' + err);
                        callback(PACKET_ERR.READ_RABK_DOESNT_EXIST);
                        return;
                    } else {
    
                        let _query = "call WEB_check_session(?)";
                        con.query(_query, [session_id], (err1, result, fields) => {
                            if (con) con.release();
                            if (err1) {
                                console.log('read_rank_school >> query error (mysql err)!!!' + err1);
                                callback(PACKET_ERR.MYSQL_READ_BY_SESSION_NOT_INFO);
                                return;
                            } else {
    
                                if (result[0] !== null) {
    
    
                                    let first_minedata = {};
    
                                    for (var i = 0; i < result.length; i++) {
                                        for (var j = 0; j < result[i].length; j++) {
                                            first_minedata.id = result[i][j].id;
                                            first_minedata.avatar = result[i][j].avatar;
                                            first_minedata.nickname = result[i][j].nickname;
                                        }
                                    }
                                    console.log("맨처음 내 데이터 입니다 ==========id" + first_minedata.id);
                                    console.log("맨처음 내 데이터 입니다 ==========avatar" + first_minedata.avatar);
                                    console.log("맨처음 내 데이터 입니다 ==========nickname" + first_minedata.nickname);
    
    
    
                                    if (first_minedata.id === undefined) {
                                        first_minedata = null;
                                        callback1(null, first_minedata);
                                    } else {
                                        callback1(null, first_minedata);
                                    }
    
                                } else {
    
                                }
    
                            }
                        });
    
                    }
    
                })
            }
         

        },

        /*  가져온 내정보를 통해 전체 레디스에서 내순위및 스코어를 미리 뽑습니다.
         기존에 일괄적으로 100개를 뽑앗으나 페이지네이션으로 바꾸면서
         1페이지에 내 게임전적을 먼저 보여줘야 했기 때문에 미리 뽑아야 했습니다. */
        function(first_minedata, callback1) {
            const rank_game_redis = redis.getWeekRankingRedis();
            let _gmaecode = gamecode;
            let checkCount = 0;

            if (first_minedata !== null) {
                rank_game_redis.zrevrange(_gmaecode, 0, -1, 'WITHSCORES', (err, reply) => {
                    if (err) {
                        console.log("레디스 토탈 카운트 에러" + err);
                    } else {
                        var _exsit_my_rank = false;
                        checkCount = reply.length;
                        let minedata = {};
                        if (checkCount > 0) {
                            var _rank = 0;
                            var _nickname = "";
                            var _gamedata;
                            for (var i = 0; i < checkCount; i++) {
                                _rank = _rank += 1;
                                _nickname = reply[i];
                                _gamedata = reply[i += 1];

                                if (_nickname === first_minedata.nickname) {
                                    minedata.rank = _rank;
                                    minedata.nickname = _nickname;
                                    minedata.gamedata = _gamedata;
                                    minedata.id = first_minedata.id;
                                    minedata.avatar = first_minedata.avatar;
                                    _exsit_my_rank = true;
                                    break;
                                }
                            }

                            if (_exsit_my_rank === true) {
                                callback1(null, minedata);
                            } else {
                                /* 레디스 랭킹에 내 데이터가 없는 경우 입니다. 랭킹정보관련은 다 -1 입니다. */
                                minedata.rank = -1;
                                minedata.nickname = first_minedata.nickname;
                                minedata.gamedata = -1;
                                minedata.id = first_minedata.id;
                                minedata.avatar = first_minedata.avatar;

                                console.log("레디스에 내랭킹이 없다 ====== 랭크" + minedata.rank);
                                console.log("레디스에 내랭킹이 없다 ====== nickname" + minedata.nickname);
                                console.log("레디스에 내랭킹이 없다 ====== gamedata" + minedata.gamedata);
                                console.log("레디스에 내랭킹이 없다 ====== id" + minedata.id);
                                console.log("레디스에 내랭킹이 없다 ====== avatar" + minedata.avatar);

                                callback1(null, minedata);
                            }

                        } else {





                        }

                    }
                });
            } else {
                console.log("내세션이 없이에 넘어갑니다 ------------------최초 내 닉네임 아이디 얻는곳 ");
                callback1(null, first_minedata);
            }

        },

        // 내 랭킹 상단 표현을 위해 미리 내학교를 셀렉트 합니다.
        function(minedata, callback1) {



            if (minedata !== null) {
                let _query = "select c.name , b.user_id from  UserSchools b , Schools c where b.school_id = c.id and b.user_id  = " + minedata.id;
                //  console.log("마지막 쿼리에용 -----------"+_query);
                mysql.getWebRead().getConnection((err, con) => {
                    if (err) {
                        if (con) con.release();
                        console.error('get school info 4 rank >> getConnection error (mysql err)!!!' + err);
                        callback(PACKET_ERR.COMMON_GET_CONNECTION_ERR);
                        return;
                    } else {
                        con.query(_query, (err, result, fields) => {
                            let MyRank = {};
                            if (con) con.release();
                            if (err) {
                                console.error("에러 " + err);
                                callback(PACKET_ERR.COMMON_FAIL, null);
                                return;
                            } else {
                                if (result[0] != null) {
                                    result.forEach(function(row) {
                                        minedata.school = row.name;
                                    });

                                    callback1(null, minedata);
                                } else {
                                    minedata.school = "학교정보미입력";;
                                    console.log("학교 없는 상태 -----------minedata.gamedata----------"+minedata.gamedata);
                                    callback1(null, minedata)
                                }

                            }

                        });


                    }


                });
            } else {
                console.log("네세션이 없기에 넘어갑니다 =====================");
                callback1(null, minedata)
            }

        },


        /* 랭킹에 있는 내 uuid를 통해 미리 게임 전적을 뽑아 놓습니다. */
        function(minedata, callback1) {
           
            if (minedata !== null) {
                let _query;
                switch (gamecode) {
                    case "SETCOIN_RANKING":
                        {
                            _query = "SELECT UUID ,SUM(Win) as Win , SUM(Lose) as Lose, SUM(Draw) as Draw FROM TbSetCoin WHERE UUID = " + minedata.id + " ORDER BY UpdatTime desc";

                        }
                        break;
                    case "PANCHANGE_RANKING":
                        {
                            _query = "SELECT UUID ,SUM(Win) as Win , SUM(Lose) as Lose, SUM(Draw) as Draw FROM TbPanChange WHERE UUID = " + minedata.id + " ORDER BY UpdatTime desc";

                        }
                        break;
                    case "MOLE_RANKING":
                        {
                            _query = "SELECT UUID, Stage AS stage, Score AS score  FROM TbMole WHERE UUID = " + minedata.id + "  ORDER BY UpdatTime desc limit 1";

                        }
                        break;
                    case "TYPING_RANKING":
                        {
                            var month = getMonth();
                            _query = "SELECT UUID, SUM(TotalInputCount) AS count, SUM(TotalSpeedCount) AS speed FROM TbTwoTypingSpeed_" + month + " WHERE UUID = " + minedata.id + " GROUP BY UUID";
                        }
                        break;
                }


                mysql.getGameRead().getConnection((err, con) => {

                    if (err) {
                        if (con) con.release();
                        console.error('read_rank_school >> getConnection error (mysql err)!!!' + err);

                        callback(PACKET_ERR.READ_RABK_DOESNT_EXIST);
                        return;
                    } else {
                        con.query(_query, (err, result, fields) => {
                            let MyRank = {};
                            let _minedata = {};
                            if (con) con.release();
                            if (err) {
                                console.error("에러 " + err);
                                console.log("테이블이 없다아아아 (내랭크) ===============================");
                                callback(PACKET_ERR.READ_TABLE_DOESNT_EXIST, null);
                                return;
                            } else {

                                if (result[0] != null) {


                                    switch (gamecode) {
                                        case "SETCOIN_RANKING":
                                            {


                                                result.forEach(function(row) {
                                                    minedata.WIN = row.Win;
                                                    minedata.Lose = row.Lose;
                                                    minedata.Draw = row.Draw;
                                                });

                                                callback1(null, minedata);
                                                return;
                                            }
                                            break;
                                        case "PANCHANGE_RANKING":
                                            {
                                                result.forEach(function(row) {
                                                    minedata.WIN = row.Win;
                                                    minedata.Lose = row.Lose;
                                                    minedata.Draw = row.Draw;
                                                });

                                                callback1(null, minedata);
                                                return;
                                            }
                                            break;
                                        case "MOLE_RANKING":
                                            {
                                                result.forEach(function(row) {
                                                    minedata.stage = row.stage;
                                                    minedata.score = row.score;
                                                });
                                                callback1(null, minedata);
                                                return;
                                            }
                                            break;

                                        case "TYPING_RANKING":
                                            {

                                                result.forEach(function(row) {
                                                    var count = Math.floor(row.speed / row.count);
                                                    minedata.TotalSpeedCount = count;
                                                });

                                                callback1(null, minedata);
                                                // return;
                                            }
                                            break;
                                    }


                                } else {
                                    // 게임전적에 내 게임전적이 없는경우 입니다. (모드 -1로 처리)
                                    switch (gamecode) {
                                        case "SETCOIN_RANKING":
                                            {

                                                minedata.WIN = 0;
                                                minedata.Lose = 0;
                                                minedata.Draw = 0;


                                                callback1(null, minedata);
                                                return;
                                            }
                                            break;
                                        case "PANCHANGE_RANKING":
                                            {
                                                minedata.WIN = 0;
                                                minedata.Lose = 0;
                                                minedata.Draw = 0;

                                                callback1(null, minedata);
                                                return;
                                            }
                                            break;
                                        case "MOLE_RANKING":
                                            {
                                                minedata.stage = 0;
                                                minedata.score = 0;

                                                callback1(null, minedata);
                                                return;
                                            }
                                            break;

                                        case "TYPING_RANKING":
                                            {

                                                minedata.TotalSpeedCount = 0;

                                                callback1(null, minedata);

                                            }
                                            break;
                                    }

                                }

                            }
                        });
                    }


                });
            } else {

                console.log("내 세션이 없기에 넘어갑니다 게임전적부분 ---------------------");
                callback1(null, minedata);
            }

        }, // 여기까지 해서 웹요청자의 랭킹과 게임전적 및 학교정보를 미리 뽑았습니다  하단부터는 다른유저페이지네이션에 따른 서칭 작업들어갑니다.
        // 요청자의 학교정보를 뽑아냅니다 (이것은 랭킹에서 요청자의 랭킹및 게임정보 학교정보를 먼저 보여줘야해서)

        function(minedata, callback1) {
            const rank_game_redis = redis.getWeekRankingRedis();

            let _gmaecode = gamecode;
            let _start = start;
            let _end = end;

            console.log("시작점 -----------" + _start);
            console.log("끝점 -----------" + _end);
            //    console.log("마인데이타 닉네임"+minedata.nickname);

            let totalCount = 0;

            //페이지네이션을 위해서 최초에 레디스의 랭킹 토탈 카운트를 얻습니다.
            rank_game_redis.zrevrange(_gmaecode, 0, -1, 'WITHSCORES', (err, reply) => {
                if (err) {
                    console.log("레디스 토탈 카운트 에러" + err);
                } else {
                    totalCount = reply.length;
                    console.log("레디스 토탈 카운트" + totalCount);
                }
            });

            //게임코드는 프론트단에서 받아옵니다. 셀렉트는 한번 요청에 10개씩만 리스폰스 합니다. (기획합의완료)
            //전체를 받고 코드 후반부에 splice로 99등 이후로 잘라냅니다 (내랭킹을 받아야해서 전체 검색)
            rank_game_redis.zrevrange(_gmaecode, _start, _end, 'WITHSCORES', (err, reply) => {
                let _data = {};

                if (err) {
                    console.error('ranking_redis_select_err >> zrevrange error (redis)!!!!..' + err);
                    _data.result = PACKET_ERR.READ_RANK_REDIS_CONNECTION_ERR;
                    callback(PACKET_ERR.READ_RANK_REDIS_CONNECTION_ERR, _data);
                    return;
                } else {
                    if (reply <= 0) {
                        console.log("redis count =============" + reply.length);
                        // 레디스에 해당게임 랭킹정보가 없을 리스폰스 하자.
                        // console.error('no ranking data from redis >> zincrby error (redis res)!!!!..'+res);
                        _data.result = PACKET_ERR.READ_RANK_REDIS_NODATA;
                        callback(PACKET_ERR.READ_RANK_REDIS_NODATA, _data);
                        return;
                    } else {

                        let _data = [];
                        let _count = reply.length;

                        // 프론트에서 페이지네이션 할때 전페이지의 마지막 랭킹 넘버를 
                        // 알아야 다음페이지의 랭킹숫자를 가산할수 있기에 수정합니다.2019.12.30
                        // var rank = 0;
                        console.log("redis count =============" + reply.length);

                        //2019년11월1일 
                        if (_count > 202) {
                            _count = 202;
                            console.log("redis count over202 reset202 =============" + _count);
                        }

                        for (var i = 0; i < _count; i++) {
                            let rowdata = {};

                            // 페이지네이션에 따라 전페이지의 마지막랭킹 숫자를 가져옵니다.
                            rowdata.rank = last_rank += 1;
                            rowdata.nickname = reply[i];
                            rowdata.gamedata = reply[i += 1];


                            _data.push(rowdata);

                        }

                        callback1(null, _data, _count, minedata, totalCount)
                    }

                }
            });
        },

        //아이디와 아바타 셋팅
        function(data, count, minedata, totalCount, callback1) {

            let totalCount1 = totalCount;
            mysql.getAccountRead().getConnection((err, con) => {
                if (err) {
                    if (con) con.release();
                    console.error('read_rank_school >> getConnection error (mysql err)!!!' + err);
                    callback(PACKET_ERR.READ_RABK_DOESNT_EXIST);
                    return;
                } else {
                    let data2 = [];
                    var str_query = "(";



                    //한방 쿼리를 만들기위해 닉네임을 하나의 문자열로 조립합니다.
                    for (var i = 0; i < data.length; i++) {

                        var rowdata = data[i];
                        var str_nick = rowdata.nickname;

                        //쿼리조합 합니다.
                        if (i == (data.length - 1)) {
                            str_query += "'" + str_nick + "'";
                        } else {
                            str_query += "'" + str_nick + "'" + ",";
                        }
                    }
                    str_query += ")";

                    //쿼리날립니다.
                    let _query1 = "SELECT id, avatar,nickname FROM Users WHERE nickname IN " + str_query;

                    con.query(_query1, (err, result, fields) => {
                        if (con) con.release();
                        if (err) {
                            console.error("에러 " + err);
                            callback(PACKET_ERR.COMMON_FAIL, null);
                            return;
                        } else {


                            if (result[0] !== null) {


                                result.forEach(function(row) {


                                    for (var i = 0; i < data.length; i++) {



                                        if (data[i].nickname === row.nickname) {
                                            data[i].id = row.id;
                                            data[i].avatar = row.avatar;
                                            data[i].school = "학교정보미입력";

                                        }

                                    }

                                });


                            }

                            callback1(null, data, count, minedata, totalCount1);

                        }
                    });
                } //ELSE

            });

        },

        //게임결과 정보 셋팅 
        function(data2, count, minedata, totalCount1, callback1) {
            let data3 = [];

          
            let totalCount2 = totalCount1;


            var str_query = "(";

            //console.log("들어온 카운트 "+data2.length);
            //한방 쿼리를 만들기위해 닉네임을 하나의 문자열로 조립합니다.

            //  console.log("레디스 카운트 ------------"+count);
            for (var i = 0; i < data2.length; i++) {

                let rowdata = {};

                rowdata = data2[i];
                //    console.log("세션 ------------"+rowdata.session_id);
                //    console.log("아이디  ------------"+rowdata.id);
                if (isEmpty(rowdata.id) === false) {
                    var str_id = rowdata.id.toString();
                    //    console.log("아이디-->"+rowdata.id);
                    //쿼리조합 합니다.
                }


                if (i == (data2.length - 1)) {
                    if (isEmpty(str_id) === false) {
                        str_query += str_id;
                    }

                } else {
                    if (isEmpty(str_id) === false) {
                        str_query += str_id + ",";
                    }

                }
            }
            str_query += ")";
            var month = getMonth();
            console.log("유아디 리스 ----------월 =" + month + "---------->" + str_query);
            let _query;
            switch (gamecode) {
                case "SETCOIN_RANKING":
                    {
                        //_query = "SELECT UUID ,Win, Lose, Draw FROM TbSetCoin WHERE UUID IN "+str_query+" ORDER BY UpdatTime desc LIMIT 1 ";
                        _query = "SELECT UUID ,SUM(Win) as Win , SUM(Lose) as Lose, SUM(Draw) as Draw FROM TbSetCoin WHERE UUID IN " + str_query + " GROUP BY UUID";

                    }
                    break;
                case "PANCHANGE_RANKING":
                    {
                        _query = "SELECT UUID ,SUM(Win) as Win , SUM(Lose) as Lose, SUM(Draw) as Draw FROM TbPanChange WHERE UUID IN " + str_query + " GROUP BY UUID";

                    }
                    break;
                case "MOLE_RANKING":
                    {
                        _query = "SELECT UUID, Stage AS stage, Score AS score  FROM TbMole WHERE UUID IN " + str_query + " AND UpdatTime IN(SELECT MAX(UpdatTime) FROM TbMole GROUP BY UUID) ";

                    }
                    break;
                case "TYPING_RANKING":
                    {
                        var month = getMonth();
                        _query = "SELECT UUID, SUM(TotalInputCount) AS count, SUM(TotalSpeedCount) AS speed FROM TbTwoTypingSpeed_" + month + " WHERE UUID IN " + str_query + " GROUP BY UUID";
                    }
                    break;
            }

            mysql.getGameRead().getConnection((err, con) => {

                if (err) {
                    if (con) con.release();
                    console.error('read_rank_school >> getConnection error (mysql err)!!!' + err);
                    callback(PACKET_ERR.READ_RABK_DOESNT_EXIST);
                    return;
                } else {
                    con.query(_query, (err, result, fields) => {
                        let MyRank = {};
                        let _minedata = {};
                        if (con) con.release();
                        if (err) {
                            console.error("에러 " + err);
                            console.log("테이블이 없다아아아 (전체랭크) ===============================");
                            callback(PACKET_ERR.READ_TABLE_DOESNT_EXIST, null);
                            return;
                        } else {

                            if (result[0] != null) {

                                switch (gamecode) {

                                    case "SETCOIN_RANKING":
                                        {


                                            result.forEach(function(row) {


                                                for (var i = 0; i < data2.length; i++) {


                                                    if (data2[i].id === row.UUID) {
                                                        data2[i].WIN = row.Win;
                                                        data2[i].Lose = row.Lose;
                                                        data2[i].Draw = row.Draw;

                                                        //             console.log("닉네임3------"+  data2[i].nickname);
                                                        //             console.log("스코어3------"+  data2[i].gamedata);
                                                    }

                                                    // data3.push(gamedata);
                                                }

                                            });
                                            /*  for (var i = 0; i < data2.length; i++) {
                                                 //  let _minedata ={};
                                                 _minedata = data2[i];

                                                 if (minedata.id == _minedata.id) {

                                                     minedata = _minedata;
                                                     MyRank = minedata;
                                                     break;
                                                 }
                                             } */
                                            MyRank = minedata;
                                            callback1(null, data2, count, MyRank, totalCount2);
                                            return;
                                        }
                                        break;
                                    case "PANCHANGE_RANKING":
                                        {
                                            let gamedata = {};
                                            gamedata.WIN = 0;
                                            gamedata.Lose = 0;
                                            gamedata.Draw = 0;
                                            result.forEach(function(row) {

                                                for (var i = 0; i < data2.length; i++) {

                                                    gamedata = data2[i];

                                                    if (data2[i].id === row.UUID) {
                                                        data2[i].WIN = row.Win;
                                                        data2[i].Lose = row.Lose;
                                                        data2[i].Draw = row.Draw;

                                                    }


                                                }

                                            });
                                            /*  for (var i = 0; i < data2.length; i++) {
                                                 //    let _minedata ={};
                                                 _minedata = data2[i];
                                                 if (minedata.id == _minedata.id) {
                                                     minedata = _minedata;
                                                     MyRank = minedata;
                                                     break;
                                                 }
                                             } */
                                            MyRank = minedata;
                                            callback1(null, data2, count, MyRank, totalCount2);
                                            return;
                                        }
                                        break;
                                    case "MOLE_RANKING":
                                        {
                                            let gamedata = {};
                                            gamedata.stage = 0;
                                            gamedata.score = 0;

                                            result.forEach(function(row) {


                                                for (var i = 0; i < data2.length; i++) {

                                                    if (data2[i].id == row.UUID) {

                                                        data2[i].stage = row.stage;
                                                        data2[i].score = row.score;
                                                        console.log("스테이지------" + data2[i].stage);
                                                        console.log("스코어------" + data2[i].score);
                                                    }



                                                }

                                            });

                                            /*   for (var i = 0; i < data2.length; i++) {
                                                  //       let _minedata ={};
                                                  _minedata = data2[i];
                                                  if (minedata.id == _minedata.id) {
                                                      minedata = _minedata;
                                                      MyRank = minedata;
                                                      console.log("마이랭크------" + MyRank);

                                                      break;
                                                  }
                                              } */
                                            MyRank = minedata;
                                            callback1(null, data2, count, MyRank, totalCount2);
                                            return;
                                        }
                                        break;

                                    case "TYPING_RANKING":
                                        {
                                            let gamedata = {};
                                            gamedata.TotalSpeedCount = 0;
                                            result.forEach(function(row) {

                                                for (var i = 0; i < data2.length; i++) {

                                                    console.log("게임데이터 셋팅" + row.UUID);
                                                    // gamedata = data2[i];

                                                    if (data2[i].id === row.UUID) {

                                                        var count = Math.floor(row.speed / row.count);
                                                        data2[i].TotalSpeedCount = count;

                                                    }
                                                }

                                            });

                                            /*   for (var i = 0; i < data2.length; i++) {
                                                  //     let _minedata ={};
                                                  _minedata = data2[i];
                                                  if (minedata.id == _minedata.id) {
                                                      minedata = _minedata;
                                                      MyRank = minedata;
                                                      break;
                                                  }
                                              } */
                                            MyRank = minedata;
                                            callback1(null, data2, count, MyRank, totalCount2);
                                            return;
                                        }
                                        break;
                                }


                            } else {

                            }

                        }
                    });
                }


            });


        },

        function(data3, count, minedata, totalCount2, callback1) {
            let totalCount3 = totalCount2;
            var str_query = "(";

            //console.log("들어온 카운트 "+data2.length);
            //한방 쿼리를 만들기위해 닉네임을 하나의 문자열로 조립합니다.
            for (var i = 0; i < data3.length; i++) {

                let rowdata = {};

                rowdata = data3[i];
                if (isEmpty(rowdata.id) === false) {
                    var str_id = rowdata.id.toString();
                    //  console.log("아이디-->"+rowdata.id);
                    //쿼리조합 합니다.
                }


                if (i == (data3.length - 1)) {
                    if (isEmpty(str_id) === false) {
                        str_query += str_id;
                    }

                } else {
                    if (isEmpty(str_id) === false) {
                        str_query += str_id + ",";
                    }

                }
            }
            str_query += ")";

            let _query = "select c.name , b.user_id from  UserSchools b , Schools c where b.school_id = c.id and b.user_id  IN " + str_query;

            //  console.log("마지막 쿼리에용 -----------"+_query);
            mysql.getWebRead().getConnection((err, con) => {
                if (err) {
                    if (con) con.release();
                    console.error('get school info 4 rank >> getConnection error (mysql err)!!!' + err);
                    callback(PACKET_ERR.COMMON_GET_CONNECTION_ERR);
                    return;
                } else {
                    con.query(_query, (err, result, fields) => {
                        let MyRank = {};
                        if (con) con.release();
                        if (err) {
                            console.error("에러 " + err);
                            callback(PACKET_ERR.COMMON_FAIL, null);
                            return;
                        } else {
                            if (result[0] != null) {
                                result.forEach(function(row) {

                                    for (var i = 0; i < data3.length; i++) {

                                        gamedata = data3[i];

                                        if (data3[i].id === row.user_id) {
                                            data3[i].school = row.name
                                        }
                                    }
                                });
                                /*   for (var i = 0; i < data3.length; i++) {
                                      let _minedata = {};
                                      _minedata = data3[i];
                                      if (minedata.id == _minedata.id) {
                                          minedata = _minedata;
                                          MyRank = minedata;
                                          break;
                                      }
                                  } */
                                MyRank = minedata;
                                console.log("데이타===" + data3.length);
                                console.log("카운트===" + count);
                                console.log("마이랭크===" + MyRank);
                                console.log("토탈카운트===" + totalCount3);

                              

                                if (totalCount3 === null || totalCount3 === undefined) {
                                    console.log("토탈카운트===   에러 ----------------------------");
                                }


                            }else{
                                MyRank = minedata;
                            }
                            callback1(null, data3, count, MyRank, totalCount3);
                        }

                    });


                }


            });
        }


    ];

    async.waterfall(task, (err, data, count, MyRank, totalCount3) => {
        if (err) {
            callback(PACKET_ERR.READ_RABK_DOESNT_EXIST, data, count, MyRank);
        } else {

            callback(PACKET_ERR.SUCCESS, data, (count / 2), MyRank, (totalCount3 / 2));
        }

    });



}

//게임 랭크 레디스 정보 받기 BY GAMECODE NONE MY INFO
exports.get_game_rank_redis_without_selfinfo = function(gamecode, start, end, callback) {

    var task = [

        function(callback1) {
            const rank_game_redis = redis.getWeekRankingRedis();

            let _gmaecode = gamecode;
            let _start = start;
            let _end = end;

            console.log("들어왓엄 내부로" + _gmaecode);

            //게임코드는 프론트단에서 받아옵니다. 셀렉트는 한번 요청에 10개씩만 리스폰스 합니다. (기획합의완료)
            rank_game_redis.zrevrange(_gmaecode, _start, _end, 'WITHSCORES', (err, reply) => {
                let _data = {};

                if (err) {
                    console.error('ranking_redis_select_err >> zrevrange error (redis)!!!!..' + err);
                    _data.result = PACKET_ERR.READ_RANK_REDIS_CONNECTION_ERR;
                    callback(PACKET_ERR.READ_RANK_REDIS_CONNECTION_ERR, _data);
                    return;
                } else {
                    if (reply <= 0) {
                        // 레디스에 해당게임 랭킹정보가 없을 리스폰스 하자.
                        // console.error('no ranking data from redis >> zincrby error (redis res)!!!!..'+res);
                        _data.result = PACKET_ERR.READ_RANK_REDIS_NODATA;
                        callback(PACKET_ERR.READ_RANK_REDIS_NODATA, _data);
                        return;
                    } else {

                        let _data = [];
                        let _count = reply.length;

                        var rank = 0;

                        for (var i = 0; i < _count; i++) {
                            let rowdata = {};
                            rowdata.rank = rank += 1;
                            rowdata.nickname = reply[i];
                            rowdata.gamedata = reply[i += 1];

                            _data.push(rowdata);
                        }
                        //  for(var i=0; i < _data.length; i++){
                        //    console.log("닉네임-------------카운트"+i+"--"+_data[i].nickname);
                        //  }

                        callback1(null, _data, _count)
                    }

                }
            });
        },

        //아이디와 아바타 셋팅
        function(data, count, callback1) {


            mysql.getAccountRead().getConnection((err, con) => {
                if (err) {
                    if (con) con.release();
                    console.error('read_rank_school >> getConnection error (mysql err)!!!' + err);
                    callback(PACKET_ERR.READ_RABK_DOESNT_EXIST);
                    return;
                } else {
                    let data2 = [];
                    var str_query = "(";



                    //한방 쿼리를 만들기위해 닉네임을 하나의 문자열로 조립합니다.
                    for (var i = 0; i < data.length; i++) {

                        var rowdata = data[i];
                        var str_nick = rowdata.nickname;

                        //쿼리조합 합니다.
                        if (i == (data.length - 1)) {
                            str_query += "'" + str_nick + "'";
                        } else {
                            str_query += "'" + str_nick + "'" + ",";
                        }
                    }
                    str_query += ")";

                    //쿼리날립니다.
                    let _query1 = "SELECT id, avatar,nickname FROM Users WHERE nickname IN " + str_query;

                    con.query(_query1, (err, result, fields) => {
                        if (con) con.release();
                        if (err) {
                            console.error("에러 " + err);
                            callback(PACKET_ERR.COMMON_FAIL, null);
                            return;
                        } else {


                            if (result[0] !== null) {


                                result.forEach(function(row) {


                                    for (var i = 0; i < data.length; i++) {


                                        if (data[i].nickname === row.nickname) {
                                            data[i].id = row.id;
                                            data[i].avatar = row.avatar;
                                            data[i].school = "학교정보미입력";

                                        }

                                    }

                                });


                            }

                            callback1(null, data, count);

                        }
                    });
                } //ELSE

            });

        },

        //게임결과 정보 셋팅 
        function(data2, count, callback1) {
            let data3 = [];


            // console.log("내아이디 ---------------------------->"+minedata.id);

            var str_query = "(";

            //console.log("들어온 카운트 "+data2.length);
            //한방 쿼리를 만들기위해 닉네임을 하나의 문자열로 조립합니다.

            //  console.log("레디스 카운트 ------------"+count);
            for (var i = 0; i < data2.length; i++) {

                let rowdata = {};

                rowdata = data2[i];
                //    console.log("세션 ------------"+rowdata.session_id);
                console.log("아이디  ------------" + rowdata.id);
                var str_id = rowdata.id.toString();
                //    console.log("아이디-->"+rowdata.id);
                //쿼리조합 합니다.

                if (i == (data2.length - 1)) {
                    str_query += str_id;
                } else {
                    str_query += str_id + ",";
                }
            }
            str_query += ")";
            //console.log("유아디 리스 -------------------->"+str_query);
            let _query;
            switch (gamecode) {
                case "SETCOIN_RANKING":
                    {
                        //_query = "SELECT UUID ,Win, Lose, Draw FROM TbSetCoin WHERE UUID IN "+str_query+" ORDER BY UpdatTime desc LIMIT 1 ";
                        _query = "SELECT UUID ,Win, Lose, Draw FROM TbSetCoin WHERE UUID IN " + str_query + " ORDER BY UpdatTime desc";

                    }
                    break;
                case "PANCHANGE_RANKING":
                    {
                        _query = "SELECT UUID ,Win, Lose, Draw FROM TbPanChange WHERE UUID IN " + str_query + " ORDER BY UpdatTime desc";

                    }
                    break;
                case "MOLE_RANKING":
                    {
                        _query = "SELECT UUID, MAX(Stage) AS stage, SUM(Score) AS score  FROM TbMole WHERE UUID IN " + str_query + " GROUP BY UUID";

                    }
                    break;
                case "TYPING_RANKING":
                    {
                        var month = getMonth();
                        _query = "SELECT UUID, SUM(TotalInputCount) AS count, SUM(TotalSpeedCount) AS speed FROM TbTwoTypingSpeed_" + month + " WHERE UUID IN " + str_query + " GROUP BY UUID";
                    }
                    break;
            }


            mysql.getGameRead().getConnection((err, con) => {

                if (err) {
                    if (con) con.release();
                    console.error('read_rank_school >> getConnection error (mysql err)!!!' + err);
                    callback(PACKET_ERR.READ_RABK_DOESNT_EXIST);
                    return;
                } else {
                    con.query(_query, (err, result, fields) => {
                        let MyRank = {};
                        let _minedata = {};
                        if (con) con.release();
                        if (err) {
                            console.error("에러 " + err);
                            callback(PACKET_ERR.COMMON_FAIL, null);
                            return;
                        } else {

                            if (result[0] != null) {


                                switch (gamecode) {
                                    case "SETCOIN_RANKING":
                                        {


                                            result.forEach(function(row) {


                                                for (var i = 0; i < data2.length; i++) {


                                                    if (data2[i].id === row.UUID) {
                                                        data2[i].WIN = row.Win;
                                                        data2[i].Lose = row.Lose;
                                                        data2[i].Draw = row.Draw;

                                                        //             console.log("닉네임3------"+  data2[i].nickname);
                                                        //             console.log("스코어3------"+  data2[i].gamedata);
                                                    }

                                                    // data3.push(gamedata);
                                                }

                                            });

                                            callback1(null, data2, count);
                                            return;
                                        }
                                        break;
                                    case "PANCHANGE_RANKING":
                                        {
                                            let gamedata = {};
                                            gamedata.WIN = 0;
                                            gamedata.Lose = 0;
                                            gamedata.Draw = 0;
                                            result.forEach(function(row) {

                                                for (var i = 0; i < data2.length; i++) {

                                                    gamedata = data2[i];

                                                    if (data2[i].id === row.UUID) {
                                                        data2[i].WIN = row.Win;
                                                        data2[i].Lose = row.Lose;
                                                        data2[i].Draw = row.Draw;

                                                    }


                                                }

                                            });

                                            callback1(null, data2, count);
                                            return;
                                        }
                                        break;
                                    case "MOLE_RANKING":
                                        {
                                            let gamedata = {};
                                            gamedata.stage = 0;
                                            gamedata.score = 0;

                                            result.forEach(function(row) {


                                                for (var i = 0; i < data2.length; i++) {

                                                    if (data2[i].id == row.UUID) {

                                                        data2[i].stage = row.stage;
                                                        data2[i].score = row.score;
                                                    }



                                                }

                                            });


                                            callback1(null, data2, count);
                                            return;
                                        }
                                        break;

                                    case "TYPING_RANKING":
                                        {
                                            let gamedata = {};
                                            gamedata.TotalSpeedCount = 0;

                                            result.forEach(function(row) {

                                                for (var i = 0; i < data2.length; i++) {

                                                    // gamedata = data2[i];

                                                    if (data2[i].id === row.UUID) {

                                                        var count = Math.floor(row.speed / row.count);
                                                        data2[i].TotalSpeedCount = count;

                                                    }
                                                }

                                            });


                                            callback1(null, data2, count);
                                            // return;
                                        }
                                        break;
                                }


                            } else {

                            }

                        }
                    });
                }


            });


        },

        function(data3, count, callback1) {

            var str_query = "(";

            console.log("들어온 카운트 " + data3.length);
            //한방 쿼리를 만들기위해 닉네임을 하나의 문자열로 조립합니다.
            for (var i = 0; i < data3.length; i++) {

                let rowdata = {};

                rowdata = data3[i];
                var str_id = rowdata.id.toString();
                //  console.log("아이디-->"+rowdata.id);
                //쿼리조합 합니다.

                if (i == (data3.length - 1)) {
                    str_query += str_id;
                } else {
                    str_query += str_id + ",";
                }
            }
            str_query += ")";

            let _query = "select c.name , b.user_id from  UserSchools b , Schools c where b.school_id = c.id and b.user_id  IN " + str_query;

            //  console.log("마지막 쿼리에용 -----------"+_query);
            mysql.getWebRead().getConnection((err, con) => {
                if (err) {
                    if (con) con.release();
                    console.error('get school info 4 rank >> getConnection error (mysql err)!!!' + err);
                    callback(PACKET_ERR.COMMON_GET_CONNECTION_ERR);
                    return;
                } else {
                    con.query(_query, (err, result, fields) => {
                        let MyRank = {};
                        if (con) con.release();
                        if (err) {
                            console.error("에러 " + err);
                            callback(PACKET_ERR.COMMON_FAIL, null);
                            return;
                        } else {
                            if (result[0] != null) {
                                result.forEach(function(row) {

                                    for (var i = 0; i < data3.length; i++) {

                                        gamedata = data3[i];

                                        if (data3[i].id === row.user_id) {
                                            data3[i].school = row.name
                                        }
                                    }
                                });

                                callback1(null, data3, count);
                            } else {
                                // callback1(null, data3, count, MyRank);
                            }

                        }

                    });


                }


            });
        }


    ];

    async.waterfall(task, (err, data, count) => {
        if (err) {
            callback(PACKET_ERR.READ_RABK_DOESNT_EXIST, data, count);
        } else {

            callback(PACKET_ERR.SUCCESS, data, (count / 2));
        }

    });



}


//쿼리로 날짜 조건을 얻기위해 ios 출력합니다. 셀렉트 시작날짜
function getDateStart() {
    var today = new Date();
    var startDay = new Date();

    today = getMonday(today); //오늘날짜 기준의 월요일 날짜를 뽑는다.
    today.setDate(today.getDate() - 4); //해당 월요일에서 4일을 뺀다.
    startDay = getMonday(today); //오늘날짜 기준의 월요일 날짜를 뽑는다.

    var str_today = startDay.toISOString();
    var arr_date = str_today.split('T');
    //  console.log("검색할 게임데이터 첫째날 --"+arr_date[0]);
    return arr_date[0];

};

//쿼리로 날짜 조건을 얻기위해 ios 출력합니다. 셀렉트 끝날짜
function getDateEnd(num) {
    var today = new Date();
    var endDay = new Date();

    today = getMonday(today); //오늘날짜 기준의 월요일 날짜를 뽑는다.
    today.setDate(today.getDate() - 4); //해당 월요일에서 4일을 뺀다.
    endDay = getMonday(today); //오늘날짜 기준의 월요일 날짜를 뽑는다.
    endDay.setDate(endDay.getDate() + 6); //해당 월요일에서 6일을더한다 일요일을 찾음
    var str_today = endDay.toISOString();
    var arr_date = str_today.split('T');
    // console.log("검색할 게임데이터 마지막날 --"+arr_date[0]);
    return arr_date[0];

};

function getMonth() {
    var today = new Date();

    var mm = today.getMonth() + 1;
    var mm2 = (mm > 9 ? '' : '0') + mm;
    var yyyy = today.getFullYear();

    var str_today = yyyy.toString() + mm2.toString();

    return str_today;
};

function getQueryForGame(gamecode) {

    let _query

    var start = getDateStart();
    var end = getDateEnd();

    switch (gamecode) {
        case "SETCOIN_RANKING":
            {
                _query = "SELECT Win, Lose, Draw FROM TbSetCoin WHERE UUID=? ORDER BY UpdatTime desc LIMIT 1";
            }
            break;
        case "PANCHANGE_RANKING":
            {
                _query = "SELECT Win, Lose, Draw FROM TbPanChange WHERE UUID=? ORDER BY UpdatTime desc LIMIT 1";

            }
            break;
        case "MOLE_RANKING":
            {
                _query = "SELECT MAX(Stage) AS stage, SUM(Score) AS score FROM TbMole WHERE UUID=? ORDER BY UpdatTime desc LIMIT 1";

            }
            break;
        case "TYPING_RANKING":
            {
                var month = getMonth();
                _query = "SELECT SUM(TotalInputCount) as count, SUM(TotalSpeedCount) as speed FROM TbTwoTypingSpeed_" + month + " WHERE UUID=?";
            }
            break;
    }

    return _query;

}

function getMonday(d) {
    d = new Date(d);
    var day = d.getDay(),
        diff = d.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
    return new Date(d.setDate(diff));
}

function isEmpty(value) {
    if (value == "" || value == null || value == undefined || (value != null && typeof value == "object" && !Object.keys(value).length)) {
        return true
    } else {
        return false
    }


};