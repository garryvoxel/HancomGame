const redis = require('./redis');
const rediscfg = require('../config/redis.json')[process.env.NODE_ENV || 'development'];
const TIME = require('../common/time');
const RESULT_STATE = require('./def').RESULT_STATE;
const mysql = require('./mysql');
const PACKET_ERR = require('./packet_err').PACKET_ERR;
const write_log = require('./write_log').write_log;
const async = require('async');
const getRankTable = require('../common/util').getRankTable;
const getRLI = require('./redis_util').getRLI;
const getRedis = require('./redis_util').getRedis;
const getWeekOfMonth = require('../common/util').getWeekOfMonth;
const Check_Packet_Time = require('../common/util').Check_Packet_Time;
//const isEmpty        = require('../common/util').isEmpty;


/**
 * 1) zadd로 방생성 타임을 value로 저장한다.
 * 2) 방장닉네임을 키로 방번호를 value로 저장한다
 * 3) 방번호로 키로 했어 방전체 정보를 저장한다.
 * 4) 동전쌓기
 */
function isEmpty(value) {
    if (value == "" || value == null || value == undefined || (value != null && typeof value == "object" && !Object.keys(value).length)) {
        return true
    } else {
        return false
    }


};

//동전쌓기 게임서버가 다운되면 해당 서버 채널에 속한 REDIS의 게임 방정보를 다 지워야 합니다
//안그러면 유령방이 생길 소지가 있습니다.
function flush_redis_ch(svr_idx, callback) {

    var task = [

        function(callback1) {
            console.log('setcoin_Write_room channel: ' + svr_idx);
            const room_list_redis = getRedis(svr_idx);


            room_list_redis.flushdb((err, succeeded) => {
                if (err) {
                    console.error('setcoin_flush_redis_ch redis1....' + err);
                    callback(PACKET_ERR.CREATE_ROOM_REDIS);
                } else {
                    redis.on_create();
                    redis.on_select();
                    redis.on_error();
                    redis.on_connect();
                    //  redis.on_ready_Coin_redis_ch1();
                    callback1();
                }

            });
        },

        function(callback1) {
            switch (svr_idx) {
                case 1:
                    redis.on_ready_Coin_redis_ch1()
                    break;
                case 2:
                    redis.on_ready_Coin_redis_ch2()
                    break;
                case 1001:
                    redis.on_ready_Coin_redis_ch3()
                    break;
                case 1002:
                    redis.on_ready_Coin_redis_ch4()
                    break;

            }
            callback1();
        }
    ];

    async.waterfall(task, (err) => {
        if (err) {
            callback(PACKET_ERR.COMMON_FAIL, null);
        } else {

            callback(PACKET_ERR.SUCCESS, null);
        }
    });

}

function ready_redis_coin_ch(svr_idx, callback) {
    redis.on_connect();
    switch (svr_idx) {
        case 1:
            redis.on_ready_Coin_redis_ch1()
            console.log("레디스 1채널 룸정보 인서트 성공");
            break;
        case 2:
            redis.on_ready_Coin_redis_ch2()
            break;
        case 1001:
            redis.on_ready_Coin_redis_ch3()
            break;
        case 1002:
            redis.on_ready_Coin_redis_ch4()
            break;

    }
}

function setcoin_write_room(room_num, host_name,
    room_title, is_single,
    is_lock, ip, play_time, back_ground, password, svr_idx,
    callback) {

    console.log('setcoin_Write_room channel: ' + svr_idx);
    const room_list_redis = getRedis(svr_idx);
    const RLI = getRLI(svr_idx);
    var _room_num = {};
    _room_num.host_name = host_name;
    //_room_num._create_time  = TIME.getTime();
    let _ct = TIME.getTime();

    //오름차순으로 저장한다.
    room_list_redis.zadd(RLI.KEY2, _ct, room_num, (err, res) => {
        if (err) {
            console.error('setcoin_write_room >> redis1....' + err);
            callback(PACKET_ERR.CREATE_ROOM_REDIS);
        } else {
            //방장닉네임 키로 방번호 저장한다.         
            var _host = {};
            _host.room_num = room_num;
            var datetime = new Date();
            var num_date = Date.parse(datetime);
            _host.start_time_int = num_date;
            var _key = RLI.KEY3 + "-" + host_name;
            room_list_redis.hmset(_key, _host, (err1, res1) => {
                if (err1) {
                    console.error('setcoin_write_room >> redis2....' + err);
                    callback(PACKET_ERR.CREATE_ROOM_REDIS1);
                } else {
                    if (res1 <= 0) {
                        console.error('setcoin_write_room >> redis2.err...' + res1);
                        callback(PACKET_ERR.CREATE_ROOM_REDIS1_RES);
                    } else {
                        //룸 전체 정보를 저장한다
                        var _rinfo_key = RLI.KEY3 + '-' + room_num; //
                        var _ri = {};
                        _ri.room_num = room_num;
                        _ri.host_name = host_name;
                        _ri.is_lock = is_lock;
                        _ri.is_single = is_single;
                        _ri.room_title = room_title;
                        _ri.ip = ip;
                        _ri.play_time = play_time;
                        _ri.back_ground = back_ground;
                        _ri.password = password;
                        _ri.server_idx = svr_idx;
                        room_list_redis.hmset(_rinfo_key, _ri, (err2, res2) => {
                            if (err2) {
                                console.error('setcoin_write_room >> redis3....' + err);
                                callback(PACKET_ERR.CREATE_ROOM_REDIS2);
                            } else {
                                if (res2 <= 0) {
                                    console.error('setcoin_write_room >> redis3.err...' + res2);
                                    callback(PACKET_ERR.CREATE_ROOM_REDIS2_RES);
                                } else {
                                    callback(PACKET_ERR.SUCCESS);
                                }
                            }
                        });
                    }
                }
            });
        }
    });
};

/**
 * 동전쌓기 방 옵션 변경
 * @param {*} room_num 
 * @param {*} room_title 
 * @param {*} play_time 
 * @param {*} is_lock 
 * @param {*} back_ground 
 * @param {*} password 
 * @param {*} callback 
 */
function change_room_option(svr_idx, room_num,
    room_title, play_time,
    is_lock, back_ground, password, callback) {
    console.log('change_room_option >> server_idx ' + svr_idx);
    const room_list_redis = getRedis(svr_idx);
    const RLI = getRLI(svr_idx);

    var _rinfo_key = RLI.KEY3 + '-' + room_num; //
    var _ri = {};

    _ri.is_lock = is_lock;
    _ri.room_title = room_title;
    _ri.play_time = play_time;
    _ri.back_ground = back_ground;
    _ri.password = password;
    console.log('key : ' + _rinfo_key + ' ' + _ri);

    room_list_redis.hmset(_rinfo_key, _ri, (err, res) => {
        if (err) {
            console.log("change_room_option >> redis err...." + err);
            callback(PACKET_ERR.SETCOIN_CHANGE_ROOM_OPTION_REDIS);
        } else {
            if (res <= 0) {
                console.log('write_room res...3 : ' + res);
                callback(PACKET_ERR.SETCOIN_CHANGE_ROOM_OPTION_REDIS_RES);
            } else {
                callback(PACKET_ERR.SUCCESS);
            }
        }

    });
}

//==============================================================
// mysql
/**
 * @param {*유니크아이디} uuid
 * @param {*결과 상태} result_state
 * 게임 결과 저장
 */
function result(uuid, nick_name, state, date, callback) {

    var tasks = [

        function(callback1) {
            //패킷 복사를 예방합니다. 0.5초이상 느리게 온 패킷은 받지 않습니다.
            if (Check_Packet_Time(date) === false) {
                //패킷 타임시퀀스에러 (패킥복사 의심)
                callback(err);
                return;
            }

            var _win = 0;

            if (state === RESULT_STATE.WIN) {
                _win = 1;
                write_result(uuid, RESULT_STATE.WIN, (err) => {
                    if (err != PACKET_ERR.SUCCESS) {
                        callback(err);
                        return;
                    }
                });
            } else if (state === RESULT_STATE.LOSE) {
                write_result(uuid, RESULT_STATE.LOSE, (err) => {
                    if (err != PACKET_ERR.SUCCESS) {
                        callback(err);
                        return;
                    }
                });
            } else {
                write_result(uuid, RESULT_STATE.DRAW, (err) => {
                    if (err != PACKET_ERR.SUCCESS) {
                        callback(err);
                        return;
                    }
                });
            }

            callback1(null, _win);
        },

        function(win, callback1) {

            update_ranking(uuid, nick_name, state, win, (err) => {
                console.log("터진 에러 ============================" + err);
                //  callback(err);
                if (err != PACKET_ERR.SUCCESS) {
                    callback(err);
                    return;
                } else {
                    callback1(PACKET_ERR.SUCCESS);
                }
            });
        }

    ];
    async.waterfall(tasks, (err) => {
        callback(err);
    });




}

//==============================================================
// mysql
/**
 * 
 * * 게임 결과 저장
 * @param {*유니크아이디} uuid
 * @param {*결과 상태} state
 */
function write_result(uuid, state, callback) {
    mysql.getGameWrite().getConnection((err, con) => {
        if (err) {
            if (con) con.release();
            console.error("write setcoin result >> connect mysql error..!");
            callback(PACKET_ERR.WRITE_SETCOIN_RESULT_MYSQL_DB_CONN);
        } else {
            let _q = 'call SPSetCoinResult(?,?,@ret);SELECT @ret as ret';
            con.query(_q, [uuid, state], (err1, rows, fields) => {
                con.release();
                if (err1) {
                    console.error("write setcoin result query error : " + err1);
                    callback(PACKET_ERR.WRITE_SETCOIN_RESULT_MYSQL_DB_QUERY);
                } else {
                    callback(PACKET_ERR.SUCCESS);
                }
            });
        }
    });
}

const RANKING = require('../config/redis.json')[process.env.NODE_ENV || 'development'].RANKING_REDIS;
/**
 * @param 닉네임 nick_name
 * @param 랭킹 스코어 win
 * 동전쌓기 랭킹
 */
//원래는 스코어로 넣었으나. 이긴판수로 랭킹에 정용합니다  win 도전쌓기 서버에서 이기면 1보넴
function update_ranking(uuid, nick_name, state, win, callback) {
    var tasks = [
        //스코어 저장
        function(callback1) {
            console.log("동전쌓기 랭킹에 들어가는 닉네임 ====================" + nick_name);
            var _data = {};
            mysql.getGameRead().getConnection(function(err, con) {
                if (err) {
                    console.error('setcoin update_ranking >> getConnection err...1..' + err);
                    callback(PACKET_ERR.SETCOIN_RANKING_MYSQL);
                    return;
                } else {
                    let _q = 'SELECT Win FROM GameDB.TbSetCoin WHERE UUID=?';
                    con.query(_q, [uuid], (err1, results, fields) => {
                        con.release();
                        if (err1) {
                            console.error('setcoin update_ranking >> query err...1...' + err1);
                            callback(PACKET_ERR.SETCOIN_RANKING_MYSQL_QUERY);
                            return;
                        } else {
                            if (results.length <= 0) {
                               /*  console.error('update_ranking >> query res ...1' + results.length);
                                callback(PACKET_ERR.SETCOIN_RANKING_MYSQL_QUERY_RES);
                                return; */
                                _data.result = PACKET_ERR.SUCCESS;
                                _data.win = win;
                                callback1(PACKET_ERR.SUCCESS, _data);
                            } else {
                                _data.result = PACKET_ERR.SUCCESS;
                                _data.win = results[0].Win;
                                callback1(PACKET_ERR.SUCCESS, _data);
                            }
                        }
                    });
                }

            });
            /*const redis_rank = redis.getWeekRankingRedis();
            let _data ={};
            redis_rank.zincrby(RANKING.KEY1,_s,_nn,(err,res)=>{
                if(err){
                    console.error('setcoin update_ranking >> zincrby error (redis)!!!!..'+err);
                    _data.result = PACKET_ERR.SETCOIN_RANKING_REDIS;

                    callback1(PACKET_ERR.SETCOIN_RANKING_REDIS,_data);
                }else{
                    if(res<0){ 
                        console.error('setcoin update_ranking >> zincrby error (redis res)!!!!..'+res);
                        _data.result = PACKET_ERR.SETCOIN_RANKING_REDIS_RES;
                        callback1(PACKET_ERR.SETCOIN_RANKING_REDIS_RES,_data);
                    }else{     
                        _data.result = PACKET_ERR.SUCCESS;
                        callback1(PACKET_ERR.SUCCESS,_data);
                    }
                }   
            });*/
        },
        //랭크 저장
        function(data, callback1) {
            const redis_rank = redis.getWeekRankingRedis();
            let _data = {};
            if (data.result != PACKET_ERR.SUCCESS) {
                callback(data.result);
            } else {
                console.log("들어가는 승리 점수 ----------------------" + data.win);
                if(win > 1){
                    console.log("레디스 점수 이상!!!!!!!!!! ----------------------" +win);
                    win = 1;
                }
                redis_rank.zincrby(RANKING.KEY1, win, nick_name, (err, res) => {
                    if (err) {
                        console.error('setcoin update_ranking >> zadd...2..err...' + err);
                        callback(PACKET_ERR.SETCOIN_RANKING_REDIS_SAVE);
                        return;
                    } else {
                        if (res < 0) {
                            console.error('setcoin update_ranking >> zadd...2..err...' + err);
                            callback(PACKET_ERR.SETCOIN_RANKING_REDIS_SAVE_RES);
                            return;
                        } else {
                            _data.result = PACKET_ERR.SUCCESS;
                            _data.win = data.win;
                            callback1(PACKET_ERR.SUCCESS, _data);
                        }
                    }
                });
            }
        },
        //Redis 백업용 RDB 저장 (유저용) 이것은 레디스 초기화때 부릅니다.
        function(data, callback1) {

            mysql.getWebWrite().getConnection(function(err, conn) {
                if (err) {
                    conn.release();
                    console.error('동전쌓기 redis backup rdb connection error' + err);
                } else {
                    let _query = "call WebDB.web_insert_user_rank_redis(?,?,?)";
                    conn.query(_query, [RANKING.KEY1, nick_name, win], (err1, result, fields) => {
                        conn.release();
                        if (err1) {
                            console.error('동전쌓기 redis backup rdb write error' + err1);
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

            if (data.result != PACKET_ERR.SUCCESS) {
                callback(data.result);
            } else {
                let _data = {};
                redis_rank.zrevrank(RANKING.KEY1, nick_name, (err, res) => {
                    if (err) {
                        console.error('setcoin update_ranking >> zrevrange error ..3..(redis)!!!!..' + err1);
                        _data.result = PACKET_ERR.SETCOIN_RANKING_REDIS_REDIS1;
                        callback(PACKET_ERR.SETCOIN_RANKING_REDIS_REDIS1, _data);
                    } else {
                        if (res < 0) {
                            console.error('setcoin update_ranking >> zrevrange error ..3..(redis res)!!!!..' + res1);
                            _data.result = PACKET_ERR.SETCOIN_RANKING_REDIS_REDIS1_RES;
                            callback(PACKET_ERR.SETCOIN_RANKING_REDIS_REDIS1_RES, _data);
                        } else {
                            _data.result = PACKET_ERR.SUCCESS;
                            _data.rank = res;
                            _data.win = data.win;
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
                redis_rank.zscore(RANKING.KEY1, nick_name, (err, res) => {
                    if (err) {
                        console.error('setcoin update_ranking >> zscore error..4.. (redis)!!!!..' + err);
                        _data.result = PACKET_ERR.SETCOIN_RANKING_REDIS_REDIS2;
                        callback1(PACKET_ERR.SETCOIN_RANKING_REDIS_REDIS2, _data);
                    } else {
                        if (res < 0) {
                            console.error('setcoin update_ranking >> zscore error..4.. (redis res)!!!!..' + res);
                            _data.result = PACKET_ERR.SETCOIN_RANKING_REDIS_REDIS2_RES;
                            callback(PACKET_ERR.SETCOIN_RANKING_REDIS_REDIS2_RES, _data);
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
        //학교 정보 가져오기
        function(data, callback) {
            const web_mysql = mysql.getWebWrite();
            let _data = {};
            if (data.result != PACKET_ERR.SUCCESS) {
                callback(data.result);
            } else {
                web_mysql.getConnection((err, con) => {
                    if (err) {
                        console.error('setcoin update_ranking >> getConnection error.5.(mysql err)!!!!..' + err);
                        callback(PACKET_ERR.SETCOIN_RANKING_REDIS_SCHOOOL_MYSQL);
                    } else {
                        let _query = 'SELECT * FROM WebDB.UserSchools WHERE user_id=?';
                        con.query(_query, [uuid], (err1, result, fields) => {
                            con.release();
                            if (err1) {
                                console.error('setcoin update_ranking >> query error.5.(mysql err)!!!' + err1);
                                callback(PACKET_ERR.SETCOIN_RANKING_REDIS_SCHOOOL_MYSQL_QUERY);
                            } else {
                                if (result.length <= 0) {
                                    _data.result = PACKET_ERR.SUCCESS;
                                    _data.rank = data.rank;
                                    _data.score = data.score;
                                    _data.school_id = 0;
                                    callback(PACKET_ERR.SUCCESS, _data);
                                } else {
                                    _data.result = PACKET_ERR.SUCCESS;
                                    _data.rank = data.rank;
                                    _data.score = data.score;
                                    _data.school_id = result[0].school_id;
                                    callback(PACKET_ERR.SUCCESS, _data);
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
            if (data.school_id <= 0 || data.school_id === 1 || data.school_id === undefined) {
                callback1(PACKET_ERR.SUCCESS, _data);
            } else {
                const redis_rank = redis.getWeekRankingRedis();
                redis_rank.zincrby(RANKING.KEY5, win, data.school_id, (err, res) => {
                    if (err) {
                        console.error('setcoin update_ranking >>...6..err...' + err);
                        callback(PACKET_ERR.SETCOIN_RANKING_SCHOOL_REDIS);
                        return;
                    } else {
                        if (res <= 0) {
                            console.error('setcoin update_ranking >>...6..res...' + res);
                            callback(PACKET_ERR.SETCOIN_RANKING_SCHOOL_REDIS_RES);
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

            let _data = {};
            _data = data;

            if (_data.school_id === 1 || data.school_id === 0) {

                callback1(PACKET_ERR.SUCCESS, _data);

            } else {
                mysql.getWebWrite().getConnection(function(err, conn) {
                    if (err) {
                        conn.release();
                        console.error('동전쌓기 학교 redis backup rdb connection error' + err);
                    } else {
                        let _query = "call WebDB.web_insert_school_rank_redis(?,?,?)";
                        conn.query(_query, [RANKING.KEY5, data.school_id, win], (err1, result, fields) => {
                            conn.release();
                            if (err1) {
                                console.error('동전쌓기 학교 redis backup rdb write error' + err1);
                            } else {
                                callback1(PACKET_ERR.SUCCESS, _data);
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
            if (data.school_id <= 0 ||
                state === RESULT_STATE.LOSE ||
                state === RESULT_STATE.DRAW) {
                callback1(PACKET_ERR.SUCCESS, _data);
            } else {
                let _date = new Date();
                let _week = getWeekOfMonth(_date);
                const rank_mysql = mysql.getRankingWrite();
                rank_mysql.getConnection((err, con) => {
                    if (err) {
                        console.error('setcoin update_ranking >> getConnection error.7. (mysql err)!!!!..' + err);
                        callback(PACKET_ERR.SETCOIN_RANKING_SCHOOL_MYSQL);
                        return;
                    } else {
                        let _query = 'call SPSetCoinSchoolRanking(?,?,?,@ret);SELECT @ret as ret';
                        con.query(_query, [_week, 1, data.school_id], (err1, result, fields) => {
                            con.release();
                            if (err1) {
                                console.error('setcoin update_ranking >> query error...7..' + err1);
                                callback(PACKET_ERR.SETCOIN_RANKING_SCHOOL_MYSQL_QUERY);
                                return;
                            } else {
                                callback1(PACKET_ERR.SUCCESS, data)
                            }
                        });
                    }
                });
            }
        },
        //해당 점수를 rdb에 저장하기
        function(data, callback1) {
            const rank_mysql = mysql.getRankingWrite();
            if (data.result != PACKET_ERR.SUCCESS) {
                callback(data.result);
            } else {
                rank_mysql.getConnection((err, con) => {
                    if (err) {
                        console.error('setcoin update_ranking >> getConnection error.8.(mysql err)!!!!..' + err);
                        callback(PACKET_ERR.SETCOIN_RANKING_REDIS_MYSQL);
                        return;
                    } else {
                        let _week_table = getRankTable();
                        let _query = 'call SPSetCoinRanking(?,?,?,?,?,?,@ret);SELECT @ret as ret';
                        con.query(_query, [_week_table, uuid, nick_name, data.score, data.rank, data.school_id], (err1, result, fields) => {
                            con.release();
                            if (err1) {
                                console.error('setcoin update_ranking >> query error.8. (mysql err)!!!' + err1);
                                callback(PACKET_ERR.SETCOIN_RANKING_REDIS_MYSQL_QUERY);
                                return;
                            } else {

                                if (result[1][0].ret < 0) {
                                    console.error('setcoin mysq query return : ' + result[1][0].ret);
                                    callback(PACKET_ERR.SETCOIN_RANKING_REDIS_MYSQL_QUERY_RES);
                                    return;
                                } else {
                                    callback1(PACKET_ERR.SUCCESS);
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


//==================================================
/**
 * 룸번호 반환하기
 * @param {*룸번호} room_number 
 * @param {*콜백함수} callback 
 */
//redis.lpush(dbcfg.ROOM_NUMBER_REDIS_QUEUE,i.toString());
function return_room_number(svr_idx, room_number, callback) {
    const room_list_redis = getRedis(svr_idx);
    const RLI = getRLI(svr_idx);
    room_list_redis.lpush(RLI.KEY1, room_number, (err, reply) => {
        if (err) {
            callback(PACKET_ERR.SETCOIN_RETURN_ROOM_NUMBER_REDIS);
        } else {
            if (reply <= 0) {
                callback(PACKET_ERR.SETCOIN_RETURN_ROOM_NUMBER_REDIS_WRITE);
            } else {
                callback(PACKET_ERR.SUCCESS);
            }
        }
    });
}

function reset_usercount(svr_idx, callback) {
    console.log("동전 쌓기 유저 카운트 리셋 ==================서버IDX = " + svr_idx);
    mysql.getGameWrite().getConnection((err, con) => {
        if (err) {
            if (con) con.release();
            console.error("reset_usercount result >> connect mysql error..!");
            callback(PACKET_ERR.SETCOIN_CHANNEL_USERCOUNT_RESET_MYSQL);
        } else {
            let _q;
            _q = 'UPDATE GameDB.TbChannel SET current_count=0 WHERE Idx=?';

            con.query(_q, [svr_idx], (err1, rows, fields) => {
                con.release();
                if (err1) {
                    console.error("update_usercount result query error : " + err1);
                    callback(PACKET_ERR.SETCOIN_CHANNEL_USERCOUNT_RESET_MYSQL_QUERY);
                } else {
                    callback(PACKET_ERR.SUCCESS);
                }
            });
        }
    });
}

function update_usercount(svr_idx, state, callback) {
    console.log("동전 쌓기 유저 카운트 정리 ==================" + state);
    mysql.getGameWrite().getConnection((err, con) => {
        if (err) {
            if (con) con.release();
            console.error("update_usercount result >> connect mysql error..!");
            callback(PACKET_ERR.SETCOIN_CHANNEL_USERCOUNT_UPDATE_MYSQL);
        } else {
            let _q;
            if (parseInt(state) === 0) {
                _q = 'UPDATE GameDB.TbChannel SET current_count=current_count+1 WHERE Idx=?';
            } else {
                _q = 'UPDATE GameDB.TbChannel SET current_count= IF(current_count <= 0,0,current_count-1) WHERE Idx=?';
            }

            con.query(_q, [svr_idx], (err1, rows, fields) => {
                con.release();
                if (err1) {
                    console.error("update_usercount result query error : " + err1);
                    callback(PACKET_ERR.SETCOIN_CHANNEL_USERCOUNT_UPDATE_MYSQL_QUERY);
                } else {
                    callback(PACKET_ERR.SUCCESS);
                }
            });
        }
    });
}

/**
 * 동전쌓기 게임 시작 로그 남기기
 */
/**
 * 
 * @param  로그 인덱스      msg_idx 
 * @param uuid              uuid 
 * @param 닉네임            nick_name 
 * @param 게임코드          game_code 
 * @param 플레이모드        play_mode       1:pvp, 2: 혼자 놀기
 * @param 상대방 닉네임     other_nick_name 상대방 닉네임
 * @param 종료 여부         end_state       1: 정상종료, 2: 상대편 아웃, 3: 나의 아웃
 * @param 승패여부          win_lose        1: 승, 2: 패, 3 :무
 * @param 점수              score 
 * @param 게임시작시간      game_start_time 
 * @param 게임 종료시간     game_end_time 
 * @param 콜백 callback 
 */
const Check_isGuest = require('../common/util').Check_isGuest;

function start_end_game_log(msg_idx, uuid, nick_name,
    game_code,
    play_mode, other_nick_name,
    end_state, win_lose, score,
    game_start_time,
    game_end_time,
    callback) {

    var task = [

        function(callback2) {

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
                    console.log("SetCoin game using log redis err1-----" + err);
                    callback(err, 0);
                    return;
                } else {
                    if (res.length <= 0) {
                        console.log('GAME USING LOG . THERE IS NOT USERDATA IN REDIS!.');
                        callback(PACKET_ERR.THERE_IS_NOT_USER_DATA_IN_REDIS, 0);
                    } else {
                        //  console.log("계산해보자 1전체 카운트   2uuid========="+res.length+"==="+res[0].session_id);
                        //  var _val = res[0];   
                        os = res.os_type;
                        browser = res.bw_type;
                        //   console.log("운영체제 타입 ============================"+os);

                        callback2(null, os, browser);
                    }
                }
            })

        },

        function(os, bw, callback2) {

            var _is_result = true;
            var _is_login = true;

            if (isEmpty(os)) {
                os = -1;
            }
            if (isEmpty(bw)) {
                bw = -1;
            }

            var start_time = Date.parse(game_start_time);
            var end_time = Date.parse(game_end_time);

            //  console.log("게임시작시간 파싱 ======================================="+start_time);
            //  console.log("게임끝난시간 파싱 ======================================="+end_time);

            var play_time = end_time - start_time; //끝낸시간에서 시작시간을 빼내어 플레이타임을 체크합니다.

            mysql.getLogWrite().getConnection((error, con) => {
                if (error) {
                    con.release();
                    console.log('SetCoin game using log mysql err1.' + error);
                    callback(error);
                    return;
                } else {
                    let _query = 'call InserGameSetcoin(?,?,?,?,?,?,?,?,?,?,?)'

                    con.query(_query, [uuid,
                        nick_name, os, bw,
                        game_code, score,
                        play_time, _is_result,
                        _is_login, game_start_time, game_end_time
                    ], (err, result1, fields) => {
                        con.release();
                        if (err) {
                            console.log('SetCoin game using log mysql err2.' + err);
                            callback();
                            return;
                        } else {
                            console.log("성공 ========================================2");
                            callback2(null);
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

            callback(PACKET_ERR.SUCCESS);
        }

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
    setcoin_write_room: setcoin_write_room,
    change_room_option: change_room_option,
    result: result,
    return_room_number: return_room_number,
    update_usercount: update_usercount,
    start_end_game_log: start_end_game_log,
    write_share_facebook: write_share_facebook,
    write_share_kakao: write_share_kakao,
    reset_usercount: reset_usercount,
    flush_redis_ch: flush_redis_ch,
    ready_redis_coin_ch: ready_redis_coin_ch

}