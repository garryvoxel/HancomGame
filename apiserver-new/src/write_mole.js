const write_log = require('./write_log').write_log;
const mysql = require('./mysql'); // kevin added
const redis = require('./redis');
const getRankTable = require('../common/util').getRankTable;
const PACKET_ERR = require('./packet_err').PACKET_ERR;
const async = require('async');
const getWeekOfMonth = require('../common/util').getWeekOfMonth;
const Check_Packet_Time = require('../common/util').Check_Packet_Time;
/**
 * 
 * @param 로그 인덱스 msg_idx
 * @param uuid uuid 
 * @param 닉네임 nick_name 
 * @param 게임코드 game_code 
 * @param 스테이지 번호 stage 
 * @param 점수 score 
 * @param 클리어 여부 is_clear 
 * @param 게임시작 시간 game_start_time 
 * @param 게임종료시간 game_end_time 
 * @param 콜백 callback 
 */
function isEmpty(value) {
    if (value == "" || value == null || value == undefined || (value != null && typeof value == "object" && !Object.keys(value).length)) {
        return true
    } else {
        return false
    }


};

function save_mole_clear_data_init(uuid, callback) {
    mysql.getGameWrite().getConnection((err, con) => {
        if (err) {
            if (con) con.release();
            console.error("wwrite mole clear stage Init >> connect mysql error..!");
            callback(PACKET_ERR.WRITE_SETCOIN_RESULT_MYSQL_DB_CONN);
        } else {
            let _q = 'call web_insert_tbMole(?)';
            con.query(_q, [uuid], (err1, rows, fields) => {
                con.release();
                if (err1) {
                    console.error("write mole clear stage Init query error : " + err1);
                    //  callback(PACKET_ERR.WRITE_SETCOIN_RESULT_MYSQL_DB_QUERY);
                } else {
                    // 10스테이지까지 자동으로 클리어를 위한것으로서 내부 호출임으로 콜백 필요없다.
                    //  callback(PACKET_ERR.SUCCESS);           
                }
            });

        }


    })
}

const Check_isGuest = require('../common/util').Check_isGuest;

function start_end_game_log(msg_idx, uuid, nick_name, game_code,
    stage, score, is_clear,
    game_start_time, game_end_time,
    callback) {

    var task = [

        function(callback1) {

            const user_session_redis = redis.getUserSessionRedis();
            var os, browser;

            if (Check_isGuest(nick_name)) {
                //Guest는 UUID 가 존재하지않으며 로그상 접속환경이 분분명함으로 로그를 남기지 않습니다.
                callback(-1, 0);
                return;
            }

            user_session_redis.hgetall(nick_name, (err, res) => {
                // redis.getUserSessionRedis().get(nick_name,(err,res)=>{
                if (err) {
                    console.log("Mole game using log redis err1-----" + err);
                    callback(err, 0);
                    return;
                } else {
                    if (res === null || res.length <= 0) {
                        console.log('GAME USING LOG . THERE IS NOT USERDATA IN REDIS!.');
                        callback(PACKET_ERR.THERE_IS_NOT_USER_DATA_IN_REDIS, 0);
                    } else {
                        //  console.log("계산해보자 1전체 카운트   2uuid========="+res.length+"==="+res[0].session_id);
                        //  var _val = res[0];   
                        os = res.os_type;
                        browser = res.bw_type;
                        console.log("운영체제 타입 ============================" + os);

                        callback1(null, os, browser);
                    }
                }
            })

        },

        function(os, bw, callback1) {

            var _is_result = true;
            var _is_login = true;

            if (isEmpty(os)) {
                os = -1;
            }
            if (isEmpty(bw)) {
                bw = -1;
            }

            // 언디파인 나옵니다. 클라쪽 확인해봐야 하니다.
            console.log("게임시작시간 파싱 =======================================" + start_time);

            var start_time = Date.parse(game_start_time);
            var end_time = Date.parse(game_end_time);

            console.log("게임시작시간 파싱 =======================================" + start_time);
            console.log("게임끝난시간 파싱 =======================================" + end_time);

            var play_time = end_time - start_time; //끝낸시간에서 시작시간을 빼내어 플레이타임을 체크합니다.

            mysql.getLogWrite().getConnection((error, con) => {
                if (error) {
                    con.release();
                    console.log('Mole game using log mysql err1.' + error);
                    callback(error);
                    return;
                } else {
                    let _query = 'call InserGameMole(?,?,?,?,?,?,?,?,?,?,?,?)'

                    con.query(_query, [uuid,
                        nick_name, os, bw,
                        game_code, score, stage,
                        play_time, _is_result, //게임시작시간이 클라에서 안날라옵니다. 원래 없는듯 Nan 일단 0으로 셋팅
                        _is_login, game_start_time, game_end_time
                    ], (err, result1, fields) => {
                        con.release();
                        if (err) {
                            console.log('Mole game using log mysql err2.' + err);
                            callback();
                            return;
                        } else {
                            console.log("성공 ========================================2");
                            callback1(null);
                        }
                    });
                }

            });
        }


    ];

    async.waterfall(task, (err) => {
        if (err) {
            callback(PACKET_ERR.READ_RABK_DOESNT_EXIST);
        } else {
            console.log("성공 ========================================3");
            callback(PACKET_ERR.SUCCESS);
        }

    });
}

/* function start_end_game_log(    msg_idx,uuid,nick_name,game_code,
                                stage,score,is_clear,
                                game_start_time,game_end_time,callback){
    write_log(msg_idx,uuid,nick_name,
        "","","","","","","","","","","","","","","","","","","","",
        game_code,stage,score,is_clear,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
        0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
        game_start_time,game_end_time,null,null,null,null,null,null,null,null,(err)=>{
            callback(err);
        });
}
 */

// kevin
function end_game(uuid, nick_name, stage, star, score, date, callback) {

    console.log("날짜 데이트========================== " + uuid);
    console.log("날짜 데이트========================== " + nick_name);
    console.log("날짜 데이트========================== " + stage);
    console.log("날짜 데이트========================== " + star);
    console.log("날짜 데이트========================== " + score);
    console.log("날짜 데이트========================== " + date);
    if (isEmpty(uuid) === true || isEmpty(nick_name) === true || isEmpty(stage) === true || isEmpty(star) === true || isEmpty(score) === true || isEmpty(date) === true) {
        console.error('mole end_game >>there is not param data !!!!..' + PACKET_ERR.COMMON_FAIL);
        callback(error);
        return;
    }

    //패킷 복사를 예방합니다. 0.5초이상 느리게 온 패킷은 받지 않습니다.
    if (Check_Packet_Time(date) === false) {
        //패킷 타임시퀀스에러 (패킥복사 의심)
        return;
    }

    mysql.getGameWrite().getConnection(function(error, con) {
        if (error) {
            console.error('mole end_game >> getConnection error (mysql)!!!!..' + error);
            callback(error);
            return;
        } else {

        }

        /* let query = 'INSERT INTO TbMole(UUID, Stage, Star, score) VALUES (?, ?, ?, ?)' +
             ' ON DUPLICATE KEY UPDATE Star = GREATEST(Star, VALUES(Star)), score = GREATEST(score, VALUES(score))';*/

        let query = 'call SPMoleResult(?,?,?,?,@score,@ret);SELECT @score as score,@ret as ret';
        let params = [uuid, stage, star, score];

        con.query(query, params, function(error, results, fields) {
            con.release();
            if (error) {
                console.error('mole end_game >> query error (mysql)!!!!..' + error);
                callback(error);
                return;
            } else {
                if (results.length <= 0) {
                    callback();
                    return;
                } else {
                    console.log(JSON.stringify(results[1][0]));
                    if (parseInt(results[1][0].ret) < 0) {
                        console.error('mole end_game >> query error res ' + results);
                        callback();
                        return;
                    } else {
                        // var score = results[1][0].score;
                        update_ranking(uuid, nick_name, score, (err) => {
                            callback(err);
                        });
                    }


                }
            }
        });
    });
};

const RANKING = require('../config/redis.json')[process.env.NODE_ENV || 'development'].RANKING_REDIS;
/**
 * @param 닉네임 nick_name
 * @param 스코어 score
 * 두더지 랭킹
 */
function update_ranking(uuid, nick_name, score, callback) {
    let _nn = nick_name;
    var tasks = [
        function(callback1) {

            console.log("두더지 ======== 스코어 =============================" + score);
            var _data = {};
            mysql.getGameRead().getConnection(function(err, con) {
                let query = 'SELECT max(Stage) as stage, sum(Score) as score FROM GameDB.TbMole WHERE UUID=?';
                let params = [uuid];
                if (err) {
                    //_data.result = PACKET_ERR.MOLE_RANKING_MYSQL;
                    console.error('mole update_ranking >> getConnection..1..err : ' + err);
                    callback(PACKET_ERR.MOLE_RANKING_MYSQL, null);
                    return;
                } else {
                    con.query(query, params, function(err1, results, fields) {
                        con.release();
                        if (err1) {
                            console.error('mole update_ranking >> getConnection ..1..error (mysql)!!!!..' + err1);
                            //_data.result = PACKET_ERR.MOLE_RANKING_MYSQL_QUERY;
                            callback(PACKET_ERR.MOLE_RANKING_MYSQL_QUERY, null);
                            return;
                        } else {
                            //_data.result = PACKET_ERR.SUCCESS;

                            _data.stage = results[0].stage;
                            _data.score = results[0].score;

                            // 랭킹에서 같은 스테이지 달성자끼리는 닉네임 ㄱㄴ 우선순위로 올라가서 점수까지 합산합니다.

                            callback1(PACKET_ERR.SUCCESS, _data);
                        }
                    });
                }
            });
        },
        function(data, callback1) {

            const redis_rank = redis.getWeekRankingRedis();

            var befor_score = 0;

            redis_rank.zscore(RANKING.KEY3, nick_name, (err, res) => {
                if (err) {
                    console.error('mole update_ranking >> zscore ...4...error (redis)!!!!..' + err);
                    //_data.result = PACKET_ERR.MOLE_RANKING_REDIS_REDIS2;
                    callback(PACKET_ERR.MOLE_RANKING_REDIS_REDIS2, null);
                    return;
                } else {
                    if (res < 0) {

                        console.log("두더지 레디스 랭킹 기존점수와 비교 ============================레디스정보없음넘어감");
                        callback1(PACKET_ERR.SUCCESS, data);
                        return;
                    } else {
                        befor_score = res;

                        if (befor_score > score) {
                            console.log("두더지 레디스 랭킹 기존점수와 비교 ============================기존점수큼");
                            score = befor_score;
                        }

                        callback1(PACKET_ERR.SUCCESS, data);

                    }
                }
            });

        },
        //스코어 저장
        function(data, callback1) {
            const redis_rank = redis.getWeekRankingRedis();
            let _data = {};
            /* 기존의 data.score 는 게임디비의 점수 총합산임 실시간과 안맞기에
            실제 리어타임의 순간점수만을 기록하기위해 변경합니다. */
            redis_rank.zadd(RANKING.KEY3, score, _nn, (err, res) => {
                if (err) {
                    console.error('mole update_ranking >> zincrby..2.. error (redis)!!!!..' + err);
                    //_data.result = PACKET_ERR.MOLE_RANKING_REDIS;

                    callback(PACKET_ERR.MOLE_RANKING_REDIS, _data);
                    return;
                } else {
                    if (res < 0) {
                        console.error('mole update_ranking >> zincrby..2.. error (redis res)!!!!..' + res);
                        // _data.result = PACKET_ERR.MOLE_RANKING_REDIS_RES;
                        callback(PACKET_ERR.MOLE_RANKING_REDIS_RES, _data);
                        return;
                    } else {
                        _data = data;
                        callback1(PACKET_ERR.SUCCESS, _data);
                    }
                }
            });

        },
        //Redis 백업용 RDB 저장 (유저용) 이것은 레디스 초기화때 부릅니다.
        function(data, callback1) {

            mysql.getWebWrite().getConnection(function(err, conn) {
                if (err) {
                    conn.release();
                    console.error('mole redis backup rdb connection error' + err);
                } else {
                    let _query = "call WebDB.web_insert_user_rank_redis(?,?,?)";
                    conn.query(_query, [RANKING.KEY3, _nn, score], (err1, result, fields) => {
                        conn.release();
                        if (err1) {
                            console.error('mole redis backup rdb write error' + err1);
                        } else {
                            callback1(PACKET_ERR.SUCCESS, data);
                        }
                    });
                }

            });

        },
        //해당 랭크 가져오기  
        function(data, callback1) {
            const redis_rank = redis.getWeekRankingRedis();
            let _data = {};
            redis_rank.zrevrank(RANKING.KEY3, nick_name, (err, res) => {
                if (err) {
                    console.error('mole update_ranking >> zrevrange ...3..error (redis)!!!!..' + err1);
                    //_data.result = PACKET_ERR.MOLE_RANKING_REDIS_REDIS1;
                    callback(PACKET_ERR.MOLE_RANKING_REDIS_REDIS1, null);
                    return;
                } else {
                    if (res < 0) {
                        console.error('mole update_ranking >> zrevrange ..3..error (redis res)!!!!..' + res1);
                        //_data.result = PACKET_ERR.MOLE_RANKING_REDIS_REDIS1_RES;
                        callback(PACKET_ERR.MOLE_RANKING_REDIS_REDIS1_RES, _data);
                        return;
                    } else {
                        //_data.result=PACKET_ERR.SUCCESS;
                        _data.rank = res;
                        _data.stage = data.stage;
                        callback1(PACKET_ERR.SUCCESS, _data);
                    }
                }
            });
        },
        //해당 점수 가져오기
        function(data, callback1) {
            const redis_rank = redis.getWeekRankingRedis();
            let _data = {};

            redis_rank.zscore(RANKING.KEY3, nick_name, (err, res) => {
                if (err) {
                    console.error('mole update_ranking >> zscore ...4...error (redis)!!!!..' + err);
                    //_data.result = PACKET_ERR.MOLE_RANKING_REDIS_REDIS2;
                    callback(PACKET_ERR.MOLE_RANKING_REDIS_REDIS2, null);
                    return;
                } else {
                    if (res < 0) {
                        console.error('mole update_ranking >> zscore ...4...error (redis res)!!!!..' + res);
                        //_data.result = PACKET_ERR.MOLE_RANKING_REDIS_REDIS2_RES;
                        callback(PACKET_ERR.MOLE_RANKING_REDIS_REDIS2_RES, null);
                        return;
                    } else {
                        _data.score = res;
                        _data.rank = data.rank;
                        _data.stage = data.stage;
                        callback1(PACKET_ERR.SUCCESS, _data);

                    }
                }
            });

        },
        //스쿨 아이디 가져오기
        function(data, callback1) {
            const web_mysql = mysql.getWebWrite();
            let _data = {};
            web_mysql.getConnection((err, con) => {
                if (err) {
                    console.error('mole update_ranking >> getConnection error.5.(mysql err)!!!!..' + err);
                    callback(PACKET_ERR.MOLE_RANKING_REDIS_SCHOOL_MYSQL);
                    return;
                } else {
                    let _query = 'SELECT * FROM WebDB.UserSchools WHERE user_id=?';
                    con.query(_query, [uuid], (err1, result, fields) => {
                        con.release();
                        if (err1) {
                            console.error('mole update_ranking >> query error.5.(mysql err)!!!' + err1);
                            callback(PACKET_ERR.MOLE_RANKING_REDIS_SCHOOL_MYSQL_QUERY);
                            return;
                        } else {
                            if (result.length <= 0) {
                                _data.rank = data.rank;
                                _data.stage = data.stage;
                                _data.school_id = 0;
                                callback1(PACKET_ERR.SUCCESS, _data);
                            } else {
                                _data.rank = data.rank;
                                _data.stage = data.stage;
                                _data.school_id = result[0].school_id;
                                callback1(PACKET_ERR.SUCCESS, _data);
                            }
                        }
                    });
                }
            });

        },
        //학교랭킹 반영
        function(data, callback1) {
            let _data = {};
            _data = data;
            if (data.school_id <= 0 || data.school_id === 1) {
                callback1(PACKET_ERR.SUCCESS, _data);
            } else {
                const redis_rank = redis.getWeekRankingRedis();
                redis_rank.zincrby(RANKING.KEY7, score, data.school_id, (err, res) => {
                    if (err) {
                        console.error('setcoin update_ranking >>...6..err...' + err);
                        callback(PACKET_ERR.SETCOIN_RANKING_SCHOOL_REDIS);
                        return;
                    } else {
                        if (res <= 0) {
                            console.error('setcoin update_ranking >>...6..res...' + res);
                            //callback(PACKET_ERR.SETCOIN_RANKING_SCHOOL_REDIS_RES);
                            callback1(PACKET_ERR.SUCCESS, _data);
                            return;
                        } else {
                            callback1(PACKET_ERR.SUCCESS, _data);
                        }
                    }
                });
            }
        },
        //스쿨랭킹 레디스 백업 
        function(data, callback1) {

            console.log("두더지 레디스 백업 ================= 학교아이디" + data.school_id);
            console.log("두더지 레디스 백업 ================= 점수" + score);

            if (data.school_id === 1 || data.school_id <= 0) {
                callback1(PACKET_ERR.SUCCESS, data);
            } else {
                mysql.getWebWrite().getConnection(function(err, conn) {
                    if (err) {
                        conn.release();
                        console.error('mole 학교 redis backup rdb connection error' + err);
                    } else {
                        let _query = "call WebDB.web_insert_school_rank_redis(?,?,?)";
                        conn.query(_query, [RANKING.KEY7, data.school_id, score], (err1, result, fields) => {
                            conn.release();
                            if (err1) {
                                console.error('mole 학교 redis backup rdb write error' + err1);
                            } else {
                                callback1(PACKET_ERR.SUCCESS, data);
                            }
                        });
                    }

                });
            }

        },
        //주간 점수 반영
        function(data, callback1) {
            let _date = new Date();
            let _week = getWeekOfMonth(_date);
            let _data = {};
            const rank_mysql = mysql.getRankingWrite();
            rank_mysql.getConnection((err, con) => {
                if (err) {
                    console.error('typing write_game_result >> getConnection error.7. (mysql err)!!!!..' + err);
                    callback(PACKET_ERR.MOLE_RANKING_SCHOOL_MYSQL2);
                    return;
                } else {
                    let _query = 'call SPMoleSchoolRanking(?,?,?,?,@ret);SELECT @ret as ret';
                    con.query(_query, [_week, score, data.stage, data.school_id], (err1, result, fields) => {
                        con.release();
                        if (err1) {
                            console.error('typing write_game_result >> query..7.. error' + err1);
                            callback(PACKET_ERR.MOLE_RANKING_SCHOOL_MYSQL2_QUERY);
                            return;
                        } else {
                            _data = data;
                            callback1(PACKET_ERR.SUCCESS, _data);
                        }
                    });
                }
            });

        },

        //해당 점수를 rdb에 저장하기
        function(data, callback4) {
            const rank_mysql = mysql.getRankingWrite();
            rank_mysql.getConnection((err, con) => {
                if (err) {
                    if (con) con.release();
                    console.error('mole update_ranking >> getConnection error (mysql err)!!!!..' + err);
                    callback(PACKET_ERR.MOLE_RANKING_REDIS_MYSQL);
                } else {
                    console.log('score : ' + data.score + " rank : " + data.rank);
                    let _week_table = getRankTable();
                    let _query = 'call SPMoleRanking(?,?,?,?,?,?,@ret);SELECT @ret as ret';
                    con.query(_query, [_week_table, uuid, nick_name, score, data.rank, data.school_id], (err1, result, fields) => {
                        con.release();
                        if (err1) {
                            console.error('mole update_ranking >> query error (mysql err)!!!' + err1);
                            callback(PACKET_ERR.MOLE_RANKING_REDIS_MYSQL_QUERY);
                        } else {
                            console.log('mole mysq query return : ' + result[1][0].ret);
                            if (result[1][0].ret < 0) {
                                callback(PACKET_ERR.MOLE_RANKING_REDIS_MYSQL_QUERY_RES);
                            } else {
                                callback4(PACKET_ERR.SUCCESS);
                            }
                        }
                    });
                }
            });
        }

    ];
    async.waterfall(tasks, (err) => {
        callback(err);
    });
}
/**
 * 
 * @param 로그 인덱스       msg_idx 
 * @param uuid              uuid 
 * @param 닉네임            nick_name 
 * @param 게임코드          game_code 
 * @param 타자 호칭         tier_1 
 * @param 타자 호칭 순위    tier_2 
 * @param 개인 순위         personal_rank 
 * @param 학교 순위         school_rank 
 * @param 점수              score 
 * @param 승리 수           win_count 
 * @param 타수              typing_count 
 * @param 정확도            acc 
 * @param 공개 위치         pos 
 * @param {*} callback 
 */
function write_share_facebook(msg_idx, uuid, nick_name, game_code,
    tier_1, tier_2, personal_rank, school_rank,
    score, win_count, typing_count, acc, pos, callback) {
    let _ct = TIME.getTime();
    let _gst = TIME.getYMD(_ct);

    write_log(msg_idx, uuid, nick_name,
        tier_1, "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",
        tier_2, personal_rank, school_rank, game_code, score, win_count, typing_count, acc, pos, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        _gst, null, null, null, null, null, null, null, null, null, (err) => {
            callback(err);
        });

}

/**
 * 
 * @param 로그 인덱스       msg_idx 
 * @param uuid              uuid 
 * @param 닉네임            nick_name 
 * @param 게임코드          game_code 
 * @param 타자 호칭         tier_1 
 * @param 타자 호칭 순위    tier_2 
 * @param 개인 순위         personal_rank 
 * @param 학교 순위         school_rank 
 * @param 점수              score 
 * @param 승리 수           win_count 
 * @param 타수              typing_count 
 * @param 정확도            acc 
 * @param 공개 위치         pos 
 * @param {*} callback 
 */

function write_share_kakao(msg_idx, uuid, nick_name, game_code,
    tier_1, tier_2, personal_rank, school_rank,
    score, win_count, typing_count, acc, pos, callback) {
    let _ct = TIME.getTime();
    let _gst = TIME.getYMD(_ct);
    write_log(msg_idx, uuid, nick_name,
        tier_1, "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",
        tier_2, personal_rank, school_rank, game_code, score, win_count, typing_count, acc, pos, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        _gst, null, null, null, null, null, null, null, null, null, (err) => {
            callback(err);
        });
}




module.exports = {
    update_ranking: update_ranking,
    end_game: end_game,
    start_end_game_log: start_end_game_log,
    write_share_facebook: write_share_facebook,
    write_share_kakao: write_share_kakao,
    save_mole_clear_data_init: save_mole_clear_data_init
}