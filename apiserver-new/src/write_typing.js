const redis = require('./redis');
const async = require('async');
const mysql = require('./mysql');
const RANKING = require('../config/redis.json')[process.env.NODE_ENV || 'development'].RANKING_REDIS;
const PACKET_ERR = require('./packet_err').PACKET_ERR;
const getRankTable = require('../common/util').getRankTable;
const write_log = require('./write_log').write_log;
const TIME = require('../common/time');
const LOG_MSG_IDX = require('./log_msg_idx').LOG_MSG_IDX;
const getWeekOfMonth = require('../common/util').getWeekOfMonth;
const Check_Packet_Time = require('../common/util').Check_Packet_Time;
const Check_isGuest = require('../common/util').Check_isGuest;

/**
 * 
 */
function write_typing_pos_practice(uuid, step, language, is_complete, callback) {
    const typing_mysql = mysql.getGameWrite();
    typing_mysql.getConnection((err, con) => {
        if (err) {
            con.release();
            console.error('write_typing_pos_practice >> getConnection error (mysql err)!!!' + err);
            callback(PACKET_ERR.TYPING_POS_PRACTICE_MYSQL);
        } else {
            let _query = 'call SPTypingPosPractice(?,?,?,?,@ret);SELECT @ret as ret';
            con.query(_query, [uuid, step, language, is_complete], (err1, result, fields) => {
                con.release();
                if (err1) {
                    console.error('write_typing_pos_practice >> query error (mysql err)!!!' + err1);
                    callback(PACKET_ERR.TYPING_POS_PRACTICE_MYSQL_QUERY);
                } else {
                    if (result[1][0].ret < 0) {
                        console.error('write_typing_pos_practice >> result!!!' + result[1][0].ret);
                        callback(PACKET_ERR.TYPING_POS_PRACTICE_MYSQL_QUERY_RESULT);
                    } else {
                        callback(PACKET_ERR.SUCCESS);

                    }

                }

            });
        }

    });
}

function write_typing_word_practice(uuid, step, language, is_complete, callback) {
    const typing_mysql = mysql.getGameWrite();
    typing_mysql.getConnection((err, con) => {
        if (err) {
            if (con) con.release();
            console.error('write_typing_word_practice >> getConnection error (mysql err)!!!' + err);
            callback(PACKET_ERR.TYPING_WORD_PRACTICE_MYSQL);
        } else {
            let _query = 'call SPTypingWordPractice(?,?,?,?,@ret);SELECT @ret as ret';
            con.query(_query, [uuid, step, language, is_complete], (err1, result, fields) => {
                con.release();
                if (err1) {
                    console.error('write_typing_word_practice >> query error (mysql err)!!!' + err1);
                    callback(PACKET_ERR.TYPING_WORD_PRACTICE_MYSQL_QUERY);
                } else {
                    if (result[1][0].ret < 0) {
                        console.error('write_typing_word_practice >> result error !!!' + result[1][0].ret);
                        callback(PACKET_ERR.TYPING_WORD_PRACTICE_MYSQL_QUERY_RESULT);
                    } else {
                        callback(PACKET_ERR.SUCCESS);

                    }

                }

            });
        }

    });
}

function write_typing_long_word_practice(uuid, language, step, content, is_practice, is_verify, callback) {
    const typing_mysql = mysql.getGameWrite();
    typing_mysql.getConnection((err, con) => {
        if (err) {
            if (con) con.release();
            console.error('write_typing_long_word_practice >> getConnection error (mysql err)!!!' + err);
            callback(PACKET_ERR.TYPING_LONG_WORD_PRACTICE_MYSQL);
        } else {
            let _query = 'call SPTypingLongWordPractice(?,?,?,?,?,?,@ret);SELECT @ret as ret';
            con.query(_query, [uuid, language, step, content, is_practice, is_verify], (err1, result, fields) => {
                con.release();
                if (err1) {
                    console.error('write_typing_long_word_practice > query error (mysql err)!!!' + err1);
                    callback(PACKET_ERR.TYPING_LONG_WORD_PRACTICE_MYSQL_QUERY);
                } else {
                    if (result[1][0].ret < 0) {
                        console.error('write_typing_long_word_practice >> result error (mysql err)!!!' + result[1][0].ret);
                        callback(PACKET_ERR.TYPING_LONG_WORD_PRACTICE_MYSQL_QUERY_RESULT);
                    } else {
                        callback(PACKET_ERR.SUCCESS);
                    }
                }
            });
        }
    });
}

/**
 * @param 유유아이디(한컴에서 보내준 고유아이디) uuid
 * @param 키보드 keyboard
 * @param 언어 language
 * @param 소리 sound
 * @param 손가락 가이드 finger_guide
 * 타자 연습 설정값 저장하기
 */

function write_typing_setup(uuid, keyboard1, keyboard2, language, sound, finger_guide, callback) {
    const typing_mysql = mysql.getGameWrite();
    typing_mysql.getConnection((err, con) => {
        if (err) {
            if (con) con.release();
            console.error('write_typing_setup >> getConnection error (mysql err)!!!' + err);
            callback(PACKET_ERR.TYPING_SETUP_MYSQL);
        } else {
            let _query = 'call SPTypingPracticeSetup(?,?,?,?,?,?,@ret);SELECT @ret as ret';
            con.query(_query, [uuid, keyboard1, keyboard2, language, sound, finger_guide], (err1, result, fields) => {
                con.release();
                if (err1) {
                    console.error('write_typing_setup > query error (mysql err)!!!' + err1);
                    callback(PACKET_ERR.TYPING_SETUP_MYSQL_QUERY);
                } else {
                    if (result[1][0].ret < 0) {
                        console.error('write_typing_setup >> result error (mysql err)!!!' + result[1][0].ret);
                        callback(PACKET_ERR.TYPING_SETUP_MYSQL_QUERY_RESULT);
                    } else {
                        callback(PACKET_ERR.SUCCESS);
                    }
                }
            });
        }
    });
}

/**
 * @param 유유아이디(한컴에서 보내준 고유아이디) uuid
 * @param 타입 type
 * @pos 소설선택 pos
 * @page 페이지 page
 * @param 정확도 acc
 * 
 * 타자연습 이어가기
 */
function write_typing_continue_play(uuid, language, type, pos, page, acc, kind, callback) {
    const typing_mysql = mysql.getGameWrite();
    typing_mysql.getConnection((err, con) => {
        if (err) {
            if (con) con.release();
            console.error('write_typing_continue_play >> getConnection error (mysql err)!!!' + err);
            callback(PACKET_ERR.TYPING_SETUP_MYSQL);
        } else {
            let _query = 'call SPTypingContinuePlay(?,?,?,?,?,?,?,@ret);SELECT @ret as ret';
            con.query(_query, [uuid, language, type, pos, page, acc, kind], (err1, result, fields) => {
                con.release();
                if (err1) {
                    console.error('write_typing_continue_play > query error (mysql err)!!!' + err1);
                    callback(PACKET_ERR.TYPING_SETUP_MYSQL_QUERY);
                } else {
                    if (result[1][0].ret < 0) {
                        console.error('write_typing_continue_play >> result error (mysql err)!!!' + result[1][0].ret);
                        callback(PACKET_ERR.TYPING_SETUP_MYSQL_QUERY_RESULT);
                    } else {
                        callback(PACKET_ERR.SUCCESS);
                    }
                }
            });
        }
    });
}


function write_game_result(uuid, nick_name, score, date, callback) {
    var tasks = [
        function(callback1) { //rdb에 점수 누적 저장

             let _data = {};


            //패킷 복사를 예방합니다. 0.5초이상 느리게 온 패킷은 받지 않습니다.
            if (Check_Packet_Time(date) === false) {
                //패킷 타임시퀀스에러 (패킥복사 의심) 에러 9163
                console.log("찍혔으면 시간에러 터진거입니다 =======================");
                callback(PACKET_ERR.COMMON_LATE_PACKET_ERR, _data);
                return;
            } 

            mysql.getGameWrite().getConnection((err, con) => {
                if (err) {
                    if (con) con.release();
                    console.error("typing write_game_result >> connect mysql...1 error..!");
                    _data.result = PACKET_ERR.TYPING_WRITE_GAME_RESULT_MYSQL;
                    callback(PACKET_ERR.TYPING_WRITE_GAME_RESULT_MYSQL, _data);
                    return;
                } else {
                    let _q = 'call SPTypingScore(?,?,@total_score,@ret);SELECT @ret as ret,@total_score as total_score';
                    con.query(_q, [uuid, score], (err1, rows, fields) => {
                        con.release();
                        if (err1) {
                            _data.result = PACKET_ERR.TYPING_WRITE_GAME_RESULT_QUERY;
                            console.error("typing write_game_result  query ...1error : " + err1);
                            callback(PACKET_ERR.TYPING_WRITE_GAME_RESULT_MYSQL, _data);
                            return;
                        } else {
                            let _total_score = rows[1][0].total_score;
                            _data.result = PACKET_ERR.SUCCESS;
                            _data.total_score = _total_score;

                            callback1(PACKET_ERR.SUCCESS, _data);
                        }
                    });
                }
            });
        },
        function(data, callback1) { //레디스 랭킹에 점수 반영
            if (data.result != PACKET_ERR.SUCCESS) {
                callback1(data.result, null);
            } else {
                let _total_score = data.total_score;
                const redis_rank = redis.getWeekRankingRedis();
                let _data = {};


                redis_rank.zincrby(RANKING.KEY4, score, nick_name, (err, res) => {
                    if (err) {
                        console.error('typing write_game_result >> zadd ...2...error (redis)!!!!..' + err);
                        _data.result = PACKET_ERR.TYPING_RANKING_REDIS;
                        callback(PACKET_ERR.TYPING_RANKING_REDIS, _data);
                        return;
                    } else {
                        if (res < 0) {
                            console.error('typing write_game_result >> zadd ...2...error (redis res)!!!!..' + res);
                            _data.result = PACKET_ERR.TYPING_RANKING_REDIS_RES;
                            callback(PACKET_ERR.TYPING_RANKING_REDIS_RES, _data);
                            return;
                        } else {
                            _data.result = PACKET_ERR.SUCCESS;
                            _data.total_score = data.total_score;
                            callback1(PACKET_ERR.SUCCESS, data);
                        }
                    }
                });
            }
        },
        //Redis 백업용 RDB 저장 (유저용) 이것은 레디스 초기화때 부릅니다.
        function(data, callback1) {
            let _data = {};
            mysql.getWebWrite().getConnection(function(err, conn) {
                if (err) {
                    conn.release();
                    console.error('mole redis backup rdb connection error' + err);
                } else {
                    console.log("타이핑 유저 랭킹 저장합니다 == 닉네임 = " + nick_name + "-점수 : " + data.total_score);
                    console.log("타이핑 유저 랭킹 저장합니다 == 게임코드 = " + RANKING.KEY4);
                    let _query = "call WebDB.web_insert_user_rank_redis(?,?,?)";
                    conn.query(_query, [RANKING.KEY4, nick_name, score], (err1, result, fields) => {
                        conn.release();
                        if (err1) {
                            console.error('mole redis backup rdb write error' + err1);
                        } else {
                            _data.result = PACKET_ERR.SUCCESS;
                            _data.total_score = data.total_score;
                            callback1(PACKET_ERR.SUCCESS, _data);
                        }
                    });
                }

            });

        },
        function(data, callback1) { //랭킹 가져오기
            const redis_rank = redis.getWeekRankingRedis();

            if (data.result != PACKET_ERR.SUCCESS) {
                callback(data.result);
            } else {
                let _data = {};
                redis_rank.zrevrank(RANKING.KEY4, nick_name, (err, res) => {
                    if (err) {
                        console.error('typing write_game_result >> zrevrange ...3..error (redis)!!!!..' + err1);
                        _data.result = PACKET_ERR.TYPING_RANKING_REDIS_REDIS1;
                        callback(PACKET_ERR.TYPING_RANKING_REDIS_REDIS1, _data);
                        return;
                    } else {
                        if (res < 0) {
                            console.error('typing write_game_result >> zrevrange ..3..error (redis res)!!!!..' + res1);
                            _data.result = PACKET_ERR.TYPING_RANKING_REDIS_REDIS1_RES;
                            callback(PACKET_ERR.TYPING_RANKING_REDIS_REDIS1_RES, _data);
                            return;
                        } else {
                            _data.result = PACKET_ERR.SUCCESS;
                            _data.rank = res;
                            _data.total_score = data.total_score;
                            callback1(PACKET_ERR.SUCCESS, _data);
                        }
                    }
                });
            }
        },
        //schoool_id 가져오기
        function(data, callback1) {
            const web_mysql = mysql.getWebWrite();
            let _data = {};
            if (data.result != PACKET_ERR.SUCCESS) {
                callback(data.result);
            } else {
                web_mysql.getConnection((err, con) => {
                    if (err) {
                        console.error('typing write_game_result >> getConnection error.4.(mysql err)!!!!..' + err);
                        callback(PACKET_ERR.TYPING_RANKING_REDIS_SCHOOOL_MYSQL);
                        return;
                    } else {
                        let _query = 'SELECT * FROM WebDB.UserSchools WHERE user_id=?';
                        con.query(_query, [uuid], (err1, result, fields) => {
                            con.release();
                            if (err1) {
                                console.error('typing write_game_result >> query error...4..(mysql err)!!!' + err1);
                                callback(PACKET_ERR.TYPING_RANKING_REDIS_SCHOOOL_MYSQL_QUERY);
                                return;
                            } else {
                                if (result.length <= 0) {
                                    _data.result = PACKET_ERR.SUCCESS;
                                    _data.rank = data.rank;
                                    _data.total_score = data.total_score;
                                    _data.school_id = 0;
                                    callback1(PACKET_ERR.SUCCESS, _data);
                                } else {
                                    _data.result = PACKET_ERR.SUCCESS;
                                    _data.rank = data.rank;
                                    _data.total_score = data.total_score;
                                    _data.school_id = result[0].school_id;
                                    callback1(PACKET_ERR.SUCCESS, _data);
                                }
                            }
                        });
                    }
                });
            }
        },
        //학교랭킹 반영
        function(data, callback1) {
            let _data = {};
            _data = data;
            if (data.school_id <= 0 || data.school_id === 1) {
                console.log("타이핑 스쿨 저장 하지 않아여 000000000000000");
                callback1(PACKET_ERR.SUCCESS, _data);
            } else {
                const redis_rank = redis.getWeekRankingRedis();
                redis_rank.zincrby(RANKING.KEY8, score, data.school_id, (err, res) => {
                    if (err) {
                        console.error('typing write_game_result >>...5..err...' + err);
                        callback(PACKET_ERR.TYPING_RANKING_REDIS_SCHOOOL_REDIS);
                        return;
                    } else {
                        if (res <= 0) {
                            console.error('typing write_game_result >>...5..res...' + res);
                            callback(PACKET_ERR.TYPING_RANKING_REDIS_SCHOOOL_REDIS_RES);
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

         
            console.log("타이핑 레디스 백업 ================= 학교아이디" + data.school_id);
            console.log("타이핑 레디스 백업 ================= 점수" + score);

            if (data.school_id === 1 || data.school_id === 0) {
                callback1(PACKET_ERR.SUCCESS, data);
            } else {
                mysql.getWebWrite().getConnection(function(err, conn) {
                    if (err) {
                        conn.release();
                        console.error('타이핑 학교 redis backup rdb connection error' + err);
                    } else {
                        let _query = "call WebDB.web_insert_school_rank_redis(?,?,?)";
                        conn.query(_query, [RANKING.KEY8, data.school_id, score], (err1, result, fields) => {
                            conn.release();
                            if (err1) {
                                console.error('타이핑 학교 redis backup rdb write error' + err1);
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
            let _data = {};
            _data = data;
            if (data.school_id <= 0) {
                callback1(PACKET_ERR.SUCCESS, _data);
            } else {
                let _date = new Date();
                let _week = getWeekOfMonth(_date);
                const rank_mysql = mysql.getRankingWrite();
                rank_mysql.getConnection((err, con) => {
                    if (err) {
                        console.error('typing write_game_result >> getConnection error.6. (mysql err)!!!!..' + err);
                        callback(PACKET_ERR.TYPING_RANKING_REDIS_SCHOOOL_MYSQL);
                        return;
                    } else {
                        let _query = 'call SPTypingSchoolRanking(?,?,?,?,?,@ret);SELECT @ret as ret';
                        con.query(_query, [_week, score, data.school_id, uuid, nick_name], (err1, result, fields) => {
                            con.release();
                            if (err1) {
                                console.error('typing write_game_result >> 6.query error ' + err1);
                                callback(PACKET_ERR.TYPING_RANKING_REDIS_SCHOOOL_MYSQL_QUERY);
                                return;
                            } else {
                                callback1(PACKET_ERR.SUCCESS, data)
                            }
                        });
                    }

                });
            }

        },
        function(data, callback1) { //rdb에 저장하기
            const rank_mysql = mysql.getRankingWrite();
            if (data.result != PACKET_ERR.SUCCESS) {
                callback1(data.result);
            } else {
                rank_mysql.getConnection((err, con) => {
                    if (err) {
                        if (con) con.release();
                        console.error('typing write_game_result >> getConnection error.7 (mysql err)!!!!..' + err);
                        callback(PACKET_ERR.TYPING_RANKING_REDIS_MYSQL);
                        return;
                    } else {
                        let _week_table = getRankTable();
                        let _query = 'call SPTypingPracticeRanking(?,?,?,?,?,?,@ret);SELECT @ret as ret';
                        con.query(_query, [_week_table, uuid, nick_name, data.total_score, data.rank, data.school_id], (err1, result, fields) => {
                            con.release();
                            if (err1) {
                                console.error('typing write_game_result >> query error.7 (mysql err)!!!' + err1);
                                callback(PACKET_ERR.TYPING_RANKING_REDIS_MYSQL_QUERY);
                                return;
                            } else {

                                if (result[1][0].ret < 0) {
                                    console.error('typing mysq query return : ' + result[1][0].ret);
                                    callback1(PACKET_ERR.TYPING_RANKING_REDIS_MYSQL_QUERY_RES);
                                    return;
                                } else {
                                    callback1(PACKET_ERR.SUCCESS, null);
                                }
                            }
                        });
                    }
                });
            }
        }
    ];

    async.waterfall(tasks, (err, data) => {
        console.log("에러 코드 ===========" + err);
        callback(err, data);
    });

}


/**
 * @param 닉네임 nick_name
 * @param 랭킹 스코어 score
 * 동전쌓기 랭킹
 */
function update_ranking(nick_name, score, callback) {
    let _nn = nick_name;
    let _s = score;
    var tasks = [
        //스코어 저장
        function(callback1) {
            console.log("타이핑 개인 랭킹 저장 합니다 ------------------" + nick_name);
            const redis_rank = redis.getWeekRankingRedis();
            let _data = {};
            redis_rank.zincrby(RANKING.KEY4, _s, _nn, (err, res) => {
                if (err) {
                    console.error('typing update_ranking >> zincrby error (redis)!!!!..' + err);
                    _data.result = PACKET_ERR.TYPING_RANKING_REDIS;

                    callback1(PACKET_ERR.TYPING_RANKING_REDIS, _data);
                } else {
                    if (res < 0) {
                        console.error('typing update_ranking >> zincrby error (redis res)!!!!..' + res);
                        _data.result = PACKET_ERR.TYPING_RANKING_REDIS_RES;
                        callback1(PACKET_ERR.TYPING_RANKING_REDIS_RES, _data);
                    } else {
                        _data.result = PACKET_ERR.SUCCESS;
                        callback1(PACKET_ERR.SUCCESS, _data);
                    }
                }
            });
        },
        //Redis 백업용 RDB 저장 (유저용) 이것은 레디스 초기화때 부릅니다.
        function(data, callback1) {
            let _data = {};
            mysql.getWebWrite().getConnection(function(err, conn) {
                if (err) {
                    conn.release();
                    console.error('mole redis backup rdb connection error' + err);
                } else {
                    let _query = "call WebDB.web_insert_user_rank_redis(?,?,?)";
                    conn.query(_query, [RANKING.KEY4, _nn, _s], (err1, result, fields) => {
                        conn.release();
                        if (err1) {
                            console.error('mole redis backup rdb write error' + err1);
                        } else {
                            _data.result = PACKET_ERR.SUCCESS;
                            callback1(PACKET_ERR.SUCCESS, _data);
                        }
                    });
                }

            });

        },
        //해당 랭크 가져오기  
        function(data, callback1) {
            const redis_rank = redis.getWeekRankingRedis();

            if (data.result != PACKET_ERR.SUCCESS) {
                callback(data.result);
            } else {
                let _data = {};
                redis_rank.zrevrank(RANKING.KEY4, nick_name, (err, res) => {
                    if (err) {
                        console.error('typing update_ranking >> zrevrange error (redis)!!!!..' + err1);
                        _data.result = PACKET_ERR.TYPING_RANKING_REDIS_REDIS1;
                        callback(PACKET_ERR.TYPING_RANKING_REDIS_REDIS1, _data);
                    } else {
                        if (res < 0) {
                            console.error('typing update_ranking >> zrevrange error (redis res)!!!!..' + res1);
                            _data.result = PACKET_ERR.TYPING_RANKING_REDIS_REDIS1_RES;
                            callback(PACKET_ERR.TYPING_RANKING_REDIS_REDIS1_RES, _data);
                        } else {
                            _data.result = PACKET_ERR.SUCCESS;
                            _data.rank = res;
                            callback1(PACKET_ERR.SUCCESS, _data);
                        }
                    }
                });
            }
        },
        //해당 점수 가져오기
        function(data, callback1) {
            const redis_rank = redis.getWeekRankingRedis();
            let _data = {};
            if (data.result != PACKET_ERR.SUCCESS) {
                callback1(data.result);
            } else {
                redis_rank.zscore(RANKING.KEY4, nick_name, (err, res) => {
                    if (err) {
                        console.error('typing update_ranking >> zscore error (redis)!!!!..' + err);
                        _data.result = PACKET_ERR.TYPING_RANKING_REDIS_REDIS2;
                        callback1(PACKET_ERR.TYPING_RANKING_REDIS_REDIS2, _data);
                    } else {
                        if (res < 0) {
                            console.error('typing update_ranking >> zscore error (redis res)!!!!..' + res);
                            _data.result = PACKET_ERR.TYPING_RANKING_REDIS_REDIS2_RES;
                            callback(PACKET_ERR.TYPING_RANKING_REDIS_REDIS2_RES, _data);
                        } else {
                            _recv_score = res;
                            _data.result = PACKET_ERR.SUCCESS;
                            _data.rank = data.rank;
                            _data.score = res;
                            callback1(PACKET_ERR.SUCCESS, _data);

                        }
                    }
                });
            }
        },
        //해당 점수를 rdb에 저장하기
        function(data, callback4) {
            const rank_mysql = mysql.getWebWrite();
            if (data.result != PACKET_ERR.SUCCESS) {
                callback(data.result);
            } else {
                rank_mysql.getConnection((err, con) => {
                    if (err) {
                        if (con) con.release();
                        console.error('typing update_ranking >> getConnection error (mysql err)!!!!..' + err);
                        callback(PACKET_ERR.TYPING_RANKING_REDIS_MYSQL);
                    } else {
                        let _week_table = getRankTable();
                        let _query = 'call SPTypingPracticeRanking(?,?,?,?,@ret);SELECT @ret as ret';
                        con.query(_query, [_week_table, nick_name, data.score, data.rank], (err1, result, fields) => {
                            con.release();
                            if (err1) {
                                console.error('typing update_ranking >> query error (mysql err)!!!' + err1);
                                callback(PACKET_ERR.TYPING_RANKING_REDIS_MYSQL_QUERY);
                            } else {
                                console.log('typing mysq query return : ' + result[1][0].ret);
                                if (result[1][0].ret < 0) {
                                    callback(PACKET_ERR.TYPING_RANKING_REDIS_MYSQL_QUERY_RES);
                                } else {
                                    callback4(PACKET_ERR.SUCCESS);
                                }
                            }
                        });
                    }
                });
            }
        }
    ];

    async.waterfall(tasks, (err, data) => {
        callback(err, data);
    });
}

/**
 * 이벌식 글쇠별 타자수
 * @param uuid uuid 
 * @param 언어 language 
 * @param 인덱스 배열 idx_array 
 * @param 입력값 배열 count_array 
 * @param 콜백 callback 
 */
function write_two_typing_speed(uuid, language, idx_array, count_array, callback) {
    mysql.getWebWrite().getConnection((err, con) => {
        if (err) {
            if (con) con.release();
            console.error('write_two_typing_speed >> getConnection error (mysql err)!!!!..' + err);
            callback(PACKET_ERR.WRITE_TWO_TYPING_SPEED_MYSQL);

        } else {
            //let _query = 'call SPTypingTwoTypingSpeed(?,?,?,@ret);SELECT @ret as ret';
            let _query = 'call SPTypingSpeed(?,?,?,?,@ret);SELECT @ret as ret';
            //con.query(_query,[uuid,language,speed],(err1,result,fields)=>{
            con.query(_query, [uuid, language, idx_array, count_array], (err1, result, fields) => {
                con.release();
                if (err1) {
                    console.error('write_two_typing_speed >> query error !!!!..' + err1);
                    callback(PACKET_ERR.WRITE_TWO_TYPING_SPEED_QUERY);
                } else {
                    if (result[1][0].ret < 0) {
                        console.error('write_two_typing_speed >> query res error !!!!..' + result[1][0].ret);
                        callback(PACKET_ERR.WRITE_TWO_TYPING_SPEED_QUERY);
                    } else {
                        callback(PACKET_ERR.SUCCESS);
                    }
                }
            });
        }
    });

}


/**
 * 이벌식 글쇠별 정확도
 * @param uuid uuid 
 * @param 언어 language 
 * @param 인덱스 배열 idx 
 * @param 입력값 배열 input_total 
 * @param 정확도배열 total_acc 
 * @param 콜백 callback 
 */
function write_two_word_acc(uuid, language, idx, input_total, total_acc, callback) {
    mysql.getWebWrite().getConnection((err, con) => {
        if (err) {
            if (con) con.release();
            console.error('write_two_word_acc >> getConnection error (mysql err)!!!!..' + err);
            callback(PACKET_ERR.WRITE_TWO_WORD_ACC_MYSQL);

        } else {
            let _query = 'call SPTypingAcc(?,?,?,?,?,@ret);SELECT @ret as ret';
            con.query(_query, [uuid, language, idx, input_total, total_acc], (err1, result, fields) => {
                con.release();
                if (err1) {
                    console.error('write_two_word_acc >> query error !!!!..' + err1);
                    callback(PACKET_ERR.WRITE_TWO_WORD_ACC_MYSQL_QUERY);
                } else {
                    if (result[1][0].ret < 0) {
                        console.error('write_two_word_acc >> query res error !!!!..' + result[1][0].ret);
                        callback(PACKET_ERR.WRITE_TWO_WORD_ACC_MYSQL_QUERY_RES);
                    } else {
                        callback(PACKET_ERR.SUCCESS);
                    }
                }
            });
        }
    });
}

/**
 * 이벌식 글쇠별 정확도
 * @param uuid uuid 
 * @param 언어 language 
 * @param {*} idx_array 
 * @param {*} input_total_array 
 * @param {*} total_velocity_array 
 * @param {*} callback 
 */
function write_two_word_velocity(uuid, language, idx_array, input_total_array, total_velocity_array, callback) {
    mysql.getWebWrite().getConnection((err, con) => {
        if (err) {
            if (con) con.release();
            console.error('write_two_word_velocity >> getConnection error (mysql err)!!!!..' + err);
            callback(PACKET_ERR.WRITE_TWO_WORD_VELOCITY_MYSQL);

        } else {
            let _query = 'call SPTypingVelocity(?,?,?,?,?,@ret);SELECT @ret as ret';
            con.query(_query, [uuid, language, idx_array, input_total_array, total_velocity_array], (err1, result, fields) => {
                con.release();
                if (err1) {
                    console.error('write_two_word_velocity >> query error !!!!..' + err1);
                    callback(PACKET_ERR.WRITE_TWO_WORD_VELOCITY_MYSQL_QUERY);
                } else {
                    if (result[1][0].ret < 0) {
                        console.error('write_two_word_velocity >> query res error !!!!..' + result[1][0].ret);
                        callback(PACKET_ERR.WRITE_TWO_WORD_VELOCITY_MYSQL_QUERY_RES);
                    } else {
                        callback(PACKET_ERR.SUCCESS);
                    }
                }
            });
        }
    });

}
/**
 * 이벌식 손가락 빠르기
 * @param uuid uuid 
 * @param 언어 language 
 * @param 인덱스 배열 idx_array 
 * @param 입력값 배열 input_total_array 
 * @param 스피드 배열 total_speed_array 
 * @param 콜백 callback 
 */
function write_two_word_finger_speed(uuid, language, idx_array, input_total_array, total_speed_array, callback) {
    //var a="1,2,3,4,5,5,6,6,";
    mysql.getWebWrite().getConnection((err, con) => {
        if (err) {
            if (con) con.release();
            console.error('write_two_word_speed >> getConnection error (mysql err)!!!!..' + err);
            callback(PACKET_ERR.WRITE_TWO_WORD_SPEED_MYSQL);

        } else {
            let _query = 'call SPTypingFingerSpeed(?,?,?,?,?,@ret);SELECT @ret as ret';
            con.query(_query, [uuid, language, idx_array, input_total_array, total_speed_array], (err1, result, fields) => {
                con.release();
                if (err1) {
                    console.error('write_two_word_speed >> query error !!!!..' + err1);
                    callback(PACKET_ERR.WRITE_TWO_WORD_SPEED_MYSQL_QUERY);
                } else {
                    if (result[1][0].ret < 0) {
                        console.error('write_two_word_speed >> query res error !!!!..' + result[1][0].ret);
                        callback(PACKET_ERR.WRITE_TWO_WORD_SPEED_MYSQL_QUERY_RES);
                    } else {
                        callback(PACKET_ERR.SUCCESS);
                    }
                }
            });
        }
    });

}

function isEmpty(value) {
    if (value == "" || value == null || value == undefined || (value != null && typeof value == "object" && !Object.keys(value).length)) {
        return true
    } else {
        return false
    }


};

function start_end_game_log(msg_idx, uuid, nick_name,
    game_code, typing_kind,
    middle_kind, small_kind,
    long_word_id, is_clear_mode,
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
                    console.log("Typing game using log redis err1-----" + err);
                    callback(err, 0);
                    return;
                } else {
                    if (res.length <= 0) {
                        console.log('Typing GAME USING LOG . THERE IS NOT USERDATA IN REDIS!.');
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
                    console.log('Typing game using log mysql err1.' + error);
                    callback(error);
                    return;
                } else {
                    let _query = 'call InserGameType(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)'

                    con.query(_query, [uuid,
                        nick_name, os, bw,
                        game_code, 0, small_kind, typing_kind, long_word_id,
                        play_time, is_clear_mode, //게임시작시간이 클라에서 안날라옵니다. 원래 없는듯 Nan 일단 0으로 셋팅
                        _is_login, middle_kind, small_kind, game_start_time, game_end_time
                    ], (err, result1, fields) => {
                        con.release();
                        if (err) {
                            console.log('Typing game using log mysql err2.' + err);
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
/**
 * 타자연습 시작과 끝 로그 남기기
 * @param 로그 인덱스 msg_idx
 * @param uuid uuid
 * @param 닉네임 nick_name
 * @param 게임코드 game_code
 * @param 글자판 종류 typing_kind 1: 한글두벌식 2:한글세벌식390 3: 한글세벌식순아래 4: 한글세벌식최종 5: 영뭔쿼터 6: 영어드보락
 * @param 중분류 middle_kind
 * @param 소분류 small_kind
 * @param 긴글id long_word_id
 * @param 각 모드 클리어 여부 1: 클리어 한 경우 2 : 클리어 안한 경우
 */
/* function start_end_game_log (  msg_idx,uuid,nick_name,
                                        game_code,typing_kind,
                                        middle_kind,small_kind,
                                        long_word_id,is_clear_mode,
                                        game_start_time,game_end_time,callback){
    write_log(msg_idx,uuid,nick_name,
        "","","","","","","","","","","","","","","","","","","","",
        game_code,typing_kind,middle_kind,small_kind,long_word_id,is_clear_mode,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
        0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
        game_start_time,game_end_time,null,null,null,null,null,null,null,null,(err)=>{
            callback(err);
        });
} */
/**
 * 
 * @param 로그 인덱스 msg_idx 
 * @param uuid uuid 
 * @param 닉네임 nick_name 
 * @param 받는 사람 메일 주소 to_mail 
 * @param 콜백 callback 
 */
function send_mail_log(msg_idx, uuid, nick_name, to_mail, callback) {

    var _ct = TIME.getTime();
    var _st = TIME.getNowYMD(_ct);

    write_log(msg_idx, uuid, nick_name,
        to_mail, "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        _st, null, null, null, null, null, null, null, null, null, (err) => {
            callback(err);
        });
}

const mail = require('nodemailer');
const mailcfg = require('../config/mail.json');
//send mail
/**
 * 
 * @param 메일 제목 mail_title 
 * @param 메일 보낼 곳 to_mail 
 * @param 메일 내용 contents 
 * @param uuid uuid 
 * @param 닉네임 nick_name 
 * @param 콜백 callback 
 */
function send_mail(mail_title, to_mail, contents, uuid, nick_name, callback) {
    let mailOption = {
        from: mailcfg.from_mail,
        to: to_mail,
        subject: mail_title,
        text: contents
    };

    console.log("mailOption : " + JSON.stringify(mailOption));

    let transporter = mail.createTransport({
        host: mailcfg.host,
        port: mailcfg.port,
        secure: false
    });



    transporter.sendMail(mailOption, (err, info) => {
        if (err) {
            console.error('send_mail......err...' + err);
            callback(PACKET_ERR.SNED_MAIL_ERROR);
            return;
        }
        console.log("info : " + JSON.stringify(info));
        callback(PACKET_ERR.SUCCESS);
    });

    //로그 남기기
    send_mail_log(LOG_MSG_IDX.TYPING_SCORE_SEND_MAIL, uuid, nick_name, to_mail, (err) => {});
}

/**
 * 타자 속도
 */
function write_two_typing_speed_speed(uuid, language, speed, callback) {
    mysql.getGameWrite().getConnection((err, con) => {
        if (err) {
            if (con) con.release();
            console.error('write_two_typing_speed_speed >> getConnection error (mysql err)!!!!..' + err);
            callback(PACKET_ERR.WRITE_TWO_TYPING_SPEED_MYSQL);

        } else {
            let _query = 'call SPTwoTypingSpeed(?,?,?,@ret);SELECT @ret as ret';
            con.query(_query, [uuid, language, speed], (err1, result, fields) => {
                con.release();
                if (err1) {
                    console.error('write_two_typing_speed_speed >> query error !!!!..' + err1);
                    callback(PACKET_ERR.WRITE_TWO_TYPING_SPEED_MYSQL_QUERY);
                } else {
                    if (result[1][0].ret < 0) {
                        console.error('write_two_typing_speed_speed >> query res error !!!!..' + result[1][0].ret);
                        callback(PACKET_ERR.WRITE_TWO_TYPING_SPEED_MYSQL_QUERY_RES);
                    } else {
                        callback(PACKET_ERR.SUCCESS);
                    }
                }
            });
        }
    });
}

/**
 * 
 * @param uuid uuid 
 * @param 타자수 typing_count 
 * @param 정확도 acc 
 * @param 콜백 callback 
 */
function high_typing_record(uuid, typing_count, acc, callback) {}

function write_check_result(uuid, title, speed, acc, page_ing, page_end, callback) {

    mysql.getWebWrite().getConnection((err, con) => {
        if (err) {
            if (con) con.release();
            console.error('write_check_result >> getConnection error (mysql err)!!!!..' + err);
            callback(PACKET_ERR.WRITE_TWO_TYPING_SPEED_MYSQL);

        } else {
            let _query = 'call web_insert_taja_check_res(?,?,?,?,?,?)';
            con.query(_query, [uuid, title, speed, acc, page_ing, page_end], (err1, fields) => {
                con.release();
                if (err1) {
                    console.error('write_taja_check_result >> query error !!!!..' + err1);
                    callback(PACKET_ERR.COMMON_QUERY_ERROR);
                } else {
                    callback(PACKET_ERR.SUCCESS);
                }
            })
        }
    })
}

module.exports = {
    write_typing_setup: write_typing_setup,
    write_game_result: write_game_result,
    update_ranking: update_ranking,
    write_two_typing_speed: write_two_typing_speed,
    write_typing_long_word_practice: write_typing_long_word_practice,
    write_typing_word_practice: write_typing_word_practice,
    write_typing_pos_practice: write_typing_pos_practice,
    write_two_word_acc: write_two_word_acc,
    write_two_word_velocity: write_two_word_velocity,
    write_two_word_finger_speed: write_two_word_finger_speed,
    start_end_game_log: start_end_game_log,
    send_mail: send_mail,
    send_mail_log: send_mail_log,
    high_typing_record: high_typing_record,
    write_typing_continue_play: write_typing_continue_play,
    write_two_typing_speed_speed: write_two_typing_speed_speed,
    write_check_result: write_check_result
}