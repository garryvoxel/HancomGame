const mysql = require('../src/mysql');
const async = require('async'); // kevin added
const GetIsMonday = require('./util').GetIsMonday;
const isEmpty = require('./util').isEmpty
const redis = require('../src/redis');
const PACKET_ERR = require('../src/packet_err').PACKET_ERR;
const CryptoJS_DE = require('./util').CryptoJS_DE;
const Check_Packet_Time = require('./util').Check_Packet_Time;
const Component_read = require('./component_read');

function Rank_week_user(gmae_id, user_idx, nickname, score) {


}

/* SDK 범용 게임 포인트 적립입니다. */
function Insert_game_point(game_code, session_id, point, callback) {

    var task = [

        function(callback1) {
           
            if (isEmpty(game_code) ||
                isEmpty(session_id) ||
                isEmpty(point)
            ) {
                console.error('Insert_game_point >> No Input Value');
                callback(PACKET_ERR.COMMON_NULL_VALUE); // 9164
            } else {
                callback1(null);
            }
        },

        function(callback1) {

            /* 게임이 정식 등록되었는지 체크 합니다. */
            CheckGameConfirm_WithName(game_code,(err, data)=>{
               if(err != PACKET_ERR.SUCCESS){
                
                   callback(err);
                   return;
               }else{
            
                   callback1(null,data);
               }

           });
       },

       function(name,callback1){
       
             /* 게임관련 저장에 필요한 어카운트 정보를 가져옵니다 */
             Component_read.Get_account_Info(session_id,(err,data)=>{
                if(err != PACKET_ERR.SUCCESS){
                    callback(err, null);
                    return;
                }else{
                   
                    callback1(null,name,data);
                }

            });
        },

        function(name, data, callback1) {
         
            mysql.getWebWrite().getConnection((err, con) => {
                if (err) {
                    con.release();
                    console.error('[ SDK Insert_game_point ] >> sql connection err2');
                    callback(PACKET_ERR.COMMON_DATABASE_ERROR);
                    return;
                } else {
                    let _query = 'call web_insert_point(?,?,?,?,?,@_total_balance);SELECT @_total_balance as _total_balance';
                    con.query(_query, [data.user_id, 1, (game_code*1), point, name], (err1, result) => {
                        con.release();
                        if (err1) {
                            console.error('[ SDK Insert_game_point ] Insert_game_point >> sql connection err2');
                            callback(PACKET_ERR.COMMON_DATABASE_ERROR);
                            return;
                        } else {
                            if (result.length > 0) {
                                
                                for (var i = 0; i < result.length; i++) {
                                    for (var j = 0; j < result[i].length; j++) {
                                        data.total_balance = result[i][j]._total_balance;
                                    }
                                }
                                
                                callback1(null, data);

                            } else {
                                console.log("[ SDK Insert_game_point ] Insert_game_point >> no game info from DB");
                                callback(PACKET_ERR.SDK_NO_EXSIT_GAME_FROM_REGITDB);
                                return;
                            }

                        }
                    });
                }

            });
        },

        function(data, callback1) {

            mysql.getAccountWrite().getConnection((err, con) => {
                if (err) {
                    con.release();
                    console.error('Insert_game_point >> sql connection err3');
                    callback(PACKET_ERR.COMMON_DATABASE_ERROR);
                    return;
                } else {
                  
                    let _query = 'UPDATE AccountDB.Users SET points=? WHERE id=?';

                    con.query(_query, [data.total_balance, data.user_id], (err1, result) => {
                        con.release();
                        if (err1) {
                            console.error('Insert_game_point >> sql connection err3');
                            callback(PACKET_ERR.COMMON_DATABASE_ERROR);
                            return;
                        } else {
                            if (result.length <= 0) {
                                console.error('Insert_game_point >> sql connection err3');
                                callback(PACKET_ERR.COMMON_NO_DATA);
                                return;
                            } else {

                                callback1(PACKET_ERR.SUCCESS);
                            }
                        }
                    });

                }
            });
        }
    ];

    async.waterfall(task, (err) => {
        callback(err);
    });
}

/* SDK 게임데이터를 저장합니다
테이블이 없어도 게임코드정보를
이용해 동적 테이블이 생성됩니다. */
function Insert_game_data(game_code,
    uuid,
    nickname,
    main_score,
    sub_score,
    game_data_json,
    school_id, 
    school_name, callback) {

    /* 0이면 인풋벨류중 널,  1 성공 , 3 쿼리 에러 2 컨넥션에러 ,-1 그냥 에러*/
    var return_value = 0;

    console.log("게임 데이터 들어옴------------------------"+game_data_json);

    if (isEmpty(game_code) ||
        isEmpty(uuid) ||
        isEmpty(nickname) ||
        isEmpty(main_score) ||
        isEmpty(sub_score) ||
        isEmpty(game_data_json) ||
        isEmpty(school_id) ||
        isEmpty(school_name)) {

        callback(PACKET_ERR.COMMON_NULL_VALUE);
        return;

    } else {

        console.log("게임 데이터 ------------------------"+game_data_json);
        var game_data = JSON.stringify(game_data_json);
        console.log("게임 데이터 ------------------------"+game_data);
        const game = mysql.getGameWrite();

        game.getConnection((err, con) => {
            if (err) {

                con.release();
                console.error('Insert_game_data >> getConnection error (mysql err)!!!' + err);
                callback(PACKET_ERR.COMMON_DATABASE_ERROR);
                return;

            } else {

                let _query = 'call web_game_data_save(?,?,?,?,?,?,?,?,@ret);SELECT @ret as ret';
                con.query(_query, [game_code, uuid, nickname, main_score, sub_score, game_data, school_id,school_name], (err1, result, fields) => {
                    con.release();

                    if (err1) {

                        console.error('Insert_game_data >> _query error (mysql err)!!!' + err1);
                        callback(PACKET_ERR.COMMON_DATABASE_ERROR);
                        return;

                    } else {

                        if (result[1][0].ret < 0) {

                            console.error('write_typing_setup >> result error (mysql err)!!!' + result[1][0].ret);
                            callback(PACKET_ERR.COMMON_NO_DATA);
                            return;

                        } else {

                           
                            callback(PACKET_ERR.SUCCESS);
                            return;

                        }
                    }
                });
            }
        });
    }
}

function CheckGameConfirm(game_code, callback) {

    mysql.getWebRead().getConnection((err, con) => {
        if (err) {
            con.release();
            console.error('CheckGameConfirm >> sql connection err');
            callback(PACKET_ERR.COMMON_DATABASE_ERROR);
            return;
        } else {

            let _query = "SELECT count(*) as cnt, is_confirm FROM WebDB.SDK_RegisterGame WHERE game_key = ?"

            con.query(_query,[game_code], (err1, results, fields) => {
                con.release();
                if (err1) {
                    console.error('CheckGameConfirm >> sql query err' + err1);
                    callback(PACKET_ERR.COMMON_DATABASE_ERROR);
                    return;
                } else {

                    var _cnt;
                    var _isConfirm = false;
                    console.log("결과갑 길이 ------------------------------"+results.length);
                   /*  _cnt = results[0].cnt;
                    _isConfirm = results[0].is_confirm;
 */
                    results.forEach(function(row){
                        _cnt = row.cnt;
                        _isConfirm = row.is_confirm;
                    });
                 /*    for (var i = 0; i < results.length; i++) {
                        for (var j = 0; j < results[i].length; j++) {
                            _cnt = results[i][j].cnt;
                            _isConfirm = results[i][j].is_confirm;
                           
                        }
                    } */

                    console.log("통과0 ------------------------------"+_cnt);
                    if(_cnt === 0){
                        callback(PACKET_ERR.SDK_NOT_REGITED_GAME);
                        return;

                    }else{
                        if(_isConfirm === 1){
                            callback(PACKET_ERR.SUCCESS);
                            return;
                        }else if(_isConfirm === 0){
                            callback(PACKET_ERR.SDK_ERR_NO_CONFIRM_SERVICE_GAME);
                            return;
                        }
                        
                    }                 

                }
            });
        }

    });

}

function CheckGameConfirm_WithName(game_code, callback) {

    mysql.getWebRead().getConnection((err, con) => {
        if (err) {
            con.release();
            console.error('CheckGameConfirm >> sql connection err');
            callback(PACKET_ERR.COMMON_DATABASE_ERROR, null);
            return;
        } else {

            let _query = "SELECT count(*) as cnt, is_confirm , game_name FROM WebDB.SDK_RegisterGame WHERE game_key = ?"

            con.query(_query,[game_code], (err1, results, fields) => {
                con.release();
                if (err1) {
                    console.error('CheckGameConfirm >> sql query err' + err1);
                    callback(PACKET_ERR.COMMON_DATABASE_ERROR, null);
                    return;
                } else {

                    var _cnt;
                    var _isConfirm = false;
                    var _game_name;
                    console.log("결과갑 길이 ------------------------------"+results.length);
                   /*  _cnt = results[0].cnt;
                    _isConfirm = results[0].is_confirm;
 */
                    results.forEach(function(row){
                        _cnt = row.cnt;
                        _isConfirm = row.is_confirm;
                        _game_name = row.game_name;
                    });
                 /*    for (var i = 0; i < results.length; i++) {
                        for (var j = 0; j < results[i].length; j++) {
                            _cnt = results[i][j].cnt;
                            _isConfirm = results[i][j].is_confirm;
                           
                        }
                    } */

                    console.log("통과0 ------------------------------"+_cnt);
                    if(_cnt === 0){
                        callback(PACKET_ERR.SDK_NOT_REGITED_GAME, null);
                        return;

                    }else{
                        if(_isConfirm === 1){
                            callback(PACKET_ERR.SUCCESS,_game_name);
                            return;
                        }else if(_isConfirm === 0){
                            callback(PACKET_ERR.SDK_ERR_NO_CONFIRM_SERVICE_GAME, null);
                            return;
                        }
                        
                    }                 

                }
            });
        }

    });

}


/* SDK 게임 학교 결과데이터를 레디스에 저장합니다 메인스코어만 저장합니다 */
function Insert_redis_school(game_code, school_id, score, callback) {


    var task = [

        function(callback1) {

             /* 게임이 정식 등록되었는지 체크 합니다. */
            CheckGameConfirm(game_code,(err)=>{
                if(err != PACKET_ERR.SUCCESS){
                    callback(err);
                    return;
                }else{
                    callback1(null);
                }

            });
        },

        function(callback1) {
            const redis_rank = redis.getWeekRankingRedis();

            var RANKING_KEY = "SC_GAME_CODE_" + game_code;

            redis_rank.zincrby(RANKING_KEY, score, school_id, (err, res) => {
                if (err) {
                    console.error('SDK Insert_school_redis>> zincrby.....err...' + err);
                    callback(PACKET_ERR.SDK_REDIS_ERR_ADD);
                    return;
                } else {
                    if (res < 0) {
                        console.error('SDK update_school_ranking >> zadd...2..err...' + err);
                        callback(PACKET_ERR.SDK_REDIS_ERR_ADD_RESULT);
                        return;
                    } else {

                        callback1(null);
                    }
                }
            });
        },

        /* 레디스 저장이 성공하면 디비백업 합니다. */
        function(callback1) {

            var RANKING_KEY = "SC_GAME_CODE_" + game_code;

            mysql.getWebWrite().getConnection(function(err, conn) {
                if (err) {
                    conn.release();
                    console.error('SDK redis school backup rdb connection error' + err);
                } else {
                    let _query = "call WebDB.web_insert_school_rank_redis(?,?,?)";
                    conn.query(_query, [RANKING_KEY, school_id, score], (err1, result, fields) => {
                        conn.release();
                        if (err1) {
                            console.error('SDK redis school backup rdb write error' + err1);
                            callback(PACKET_ERR.COMMON_FAIL);
                        } else {
                            callback1(PACKET_ERR.SUCCESS);
                        }
                    });
                }

            });
        }
    ];

    async.waterfall(task, (err) => {
        callback(err);
    });
}

/* SDK 게임 개인 결과데이터를 레디스에 저장합니다 메인스코어만 저장합니다 */
function Insert_redis_user(game_code, nickname, score, callback) {

    var task = [

        function(callback1) {

            /* 게임이 정식 등록되었는지 체크 합니다. */
             /* 게임이 정식 등록되었는지 체크 합니다. */
             CheckGameConfirm(game_code,(err)=>{
                if(err != PACKET_ERR.SUCCESS){
                    callback(err);
                    return;
                }else{
                    console.log("통과1 ------------------------------");
                    callback1(null);
                }

            });
        },

        function(callback1) {

            console.log("통과2 ------------------------------");
            const redis_rank = redis.getWeekRankingRedis();

            var RANKING_KEY = "USER_GAME_CODE_" + game_code;

            redis_rank.zincrby(RANKING_KEY, score, nickname, (err, res) => {
                if (err) {
                    console.error('SDK Insert_redis>> zincrby.....err...' + err);
                    callback(PACKET_ERR.SDK_REDIS_ERR_ADD);
                    return;
                } else {
                    if (res < 0) {
                        console.error('SDK update_ranking >> zadd...2..err...' + err);
                        callback(PACKET_ERR.SDK_REDIS_ERR_ADD_RESULT);
                        return;
                    } else {

                        callback1(null);
                    }
                }
            });
        },

        /* 레디스 저장이 성공하면 디비백업 합니다. */
        function(callback1) {

            var RANKING_KEY = "USER_GAME_CODE_" + game_code;

            mysql.getWebWrite().getConnection(function(err, conn) {
                if (err) {
                    conn.release();
                    console.error('SDK redis backup rdb connection error' + err);
                } else {
                    let _query = "call WebDB.web_insert_user_rank_redis(?,?,?)";
                    conn.query(_query, [RANKING_KEY, nickname, score], (err1, result, fields) => {
                        conn.release();
                        if (err1) {
                            console.error('SDK redis backup rdb write error' + err1);
                            callback(PACKET_ERR.COMMON_FAIL);
                        } else {
                            callback1(PACKET_ERR.SUCCESS);
                        }
                    });
                }

            });
        }
    ];

    async.waterfall(task, (err) => {
        callback(err);
    });

}


/* SDK 게임 사용 로그를 남깁니다 */
function Insert_game_log(game_code, is_guest, uuid, nickname, score, s_time, e_time, callback) {

    var task = [

        function(callback1) {

            var os, browser;
            var _is_result = true;
            var _is_login = true;

            if (is_guest) {

                /* 비 로그인 게스트는 세션이 없음으로 접속정보가 없습니다. 디펄트 1로 셋팅 */
                os = 1;
                browser = 1;
                _is_login = false;

                callback1(null, os, browser, _is_result, _is_login);

            } else {
                const user_session_redis = redis.getUserSessionRedis();


                user_session_redis.hgetall(nickname, (err, res) => {

                    if (err) {
                        console.log("SetCoin game using log redis err1-----" + err);
                        callback(SDK_ERR_SAVE_GAME_USING_LOG);
                        return;
                    } else {
                        if (res.length <= 0) {
                            console.log('GAME USING LOG . THERE IS NOT USERDATA IN REDIS!.');
                            callback(PACKET_ERR.SDK_ERR_SAVE_GAME_USING_LOG_REDIS1);
                        } else {

                            os = res.os_type;
                            browser = res.bw_type;

                            callback1(null, os, browser, _is_result, _is_login);
                        }
                    }
                })
            }

        },

        function(os, browser, _is_result, _is_login, callback1) {


            var start_time = Date.parse(s_time);
            var end_time = Date.parse(e_time);

            var play_time = end_time - start_time; //끝낸시간에서 시작시간을 빼내어 플레이타임을 체크합니다.

            mysql.getLogWrite().getConnection((error, con) => {
                if (error) {
                    con.release();
                    console.log('SDK Insert Game Log mysql.getLogWrite().getConnection 1 GAMECODE = ' + game_code + ' ERROR : ' + error);
                    callback(PACKET_ERR.COMMON_FAIL);
                    return;
                } else {
                    let _query = 'call InserGameSetcoin(?,?,?,?,?,?,?,?,?,?,?)'

                    con.query(_query, [uuid,
                        nickname, os, browser,
                        game_code, score,
                        play_time, _is_result,
                        _is_login, s_time, e_time
                    ], (err, result1, fields) => {
                        con.release();
                        if (err) {
                            console.log('SDK Insert Game Log mysql.getLogWrite().getConnection 2 GAMECODE = ' + game_code + ' ERROR : ' + err);

                            callback(PACKET_ERR.COMMON_FAIL);
                            return;
                        } else {
                            console.log("성공 ========================================SDK Insert Game Log");
                            callback1(PACKET_ERR.SUCCESS);
                        }
                    });
                }

            });
        }

    ];

    async.waterfall(task, (err) => {

        callback(err);

    });
}

/* 신규게임을 등록 합니다. */
function Register_game(game_name, callback) {

    mysql.getWebWrite().getConnection((error, con) => {
        if (error) {
            con.release();
            console.log('SDK Register_gamee  mysql.getWebWrite().getConnection 1' + error);
            callback(PACKET_ERR.COMMON_FAIL, null);
            return;
        } else {
            let _query = 'call web_regit_new_game(?,@_gamekey); SELECT @_gamekey as gamekey';

            con.query(_query, [game_name], (err, rows, fields) => {
                con.release();
                if (err) {
                    console.error("write web_regit_new_game query error : " + err);
                    callback(PACKET_ERR.COMMON_QUERY_ERROR, null);
                    return;
                } else {
                    console.log("[ SDK Register Game Code ] Out Put code is  ---" + rows[1][0].gamekey);
                    var _gamekey = rows[1][0].gamekey;
                    callback(PACKET_ERR.SUCCESS, _gamekey);
                }
            });
        }
    });
}



module.exports = {
    Insert_game_data: Insert_game_data,
    Insert_game_point: Insert_game_point,
    CheckGameConfirm,
    CheckGameConfirm_WithName,
    Insert_redis_school,
    Insert_redis_user,
    Insert_game_log,
    Register_game: Register_game

}