const user_session_redis = require('./redis').user_session_redis;
const mysql = require('./mysql');
const async = require('async'); // kevin added
const request = require('request'); // kevin added
const querystring = require('querystring'); // kevin added
const PACKET_ERR = require('./packet_err').PACKET_ERR;
const TIME = require('../common/time');
const GAME_CODE = require('../config/game_code.json');
const Check_Packet_Time = require('../common/util').Check_Packet_Time;
const getDelUserResponseValue = require('./def').GET_DEL_USER_RESPONSE_VALUE;
/**
 * @param {*닉네임} nick_name
 * @param {*섹션아이디} session_id
 */
function write_session_id(nick_name, session_id, uuid, callback) {
    var _sid = {};
    _sid.session_id = session_id;
    _sid.uuid = uuid;
    user_session_redis.hmset(nick_name, _sid, (err, res) => {
        if (err) {
            console.log('write_session_id..err.!!!! ' + err + " res : " + res);
            callback(PACKET_ERR.WRITE_SESSION_ID_REDIS_DB_CONN);
            return;
        } else {
            if (res != "OK") {
                console.log('write redis error :' + res);
                callback(PACKET_ERR.WRITE_SESSION_ID_GET_MYSQL_DB);
                return;
            } else {
                write_mysql(nick_name, session_id, (err) => {
                    callback(err);
                });
            }
        }
    });

};

function write_mysql(nick_name, session_id, callback) {
    mysql.getAccountWrite().getConnection((err, conn) => {
        if (err) {
            console.log('write mysql error....!!!');
            callback(PACKET_ERR.WRITE_SESSION_ID_MYSQ_DB_CONN);
            conn.release();
            return;
        } else {
            conn.query("UPDATE Users SET session_id = ? WHERE nickname = ?", [session_id, nick_name], (err1, rows, fields) => {
                conn.release();
                if (err1) {
                    console.log('write mysql update err...!!' + err2);
                    callback(PACKET_ERR.WRITE_SESSION_ID_QUERY);
                    return;
                } else {
                    callback(PACKET_ERR.SUCCESS);
                    return;
                }
            });
        }
    });
}

function write_new_user(uuid, nick_name, language, country, session_id, callback) {
    mysql.getAccountWrite().getConnection((err, conn) => {
        if (err) {
            callback();
            conn.release();
            return;
        } else {
            let _query = 'call SPInsertUser(?,?,?,?,?,@ret);SELECT @ret as ret';
            conn.query(_query, [uuid, nick_name, language, country, session_id], (err, result, fields) => {
                conn.release();
                if (err) {
                    console.log('write_new_user query error : ' + err);
                    callback();
                    return;
                } else {
                    callback();
                }
            });
        }
    });


}




function write_setcoin_table(uuid) {
    mysql.getAccountWrite().getConnection((err, conn) => {
        if (err) {} else {
            let _query = 'call SPInsertUser(?,?,?,?,?,@ret);SELECT @ret as ret';
            conn.query(_query, [uuid], (err, result, fiedlds) => {

            });
        }
    });
}

////////////////////////////////////////////////////////////////////////////////////////////////////////
// kevin added
// 회원 탈퇴
const CODE = {
    'SUCCESS': '01.000',
    'FAIL': '02.001'
};

function delete_user(user_ids, token, validToken, callback) {

    console.log("체크 1단계 ===================" + token);

    var result = {
        'code': CODE.SUCCESS
    };

    if (null == user_ids || null == token || !Array.isArray(user_ids)) {
        result.code = CODE.FAIL;
        result['reason'] = "parameter error";
        callback(null, result);
        return;
    }

    check_opt(token, validToken, function(err) {
        if (err) {
            result.code = CODE.FAIL;
            result['reason'] = err;
            console.error(err);
            callback(null, result);
            return;
        }
        console.log("체크 2단계 DleteUser 들어가기전===================");
        delete_user_data(user_ids, function(err, result_delete) {
            if (err) {
                result.code = CODE.FAIL;
                result['reason'] = err;
                console.error(err);
                callback(null, result);
                return;
            }

            result['data'] = {
                'result': result_delete
            };

            callback(null, result);
        });
    });
};

// 한컴 token 체크
function check_opt(token, validToken, callback) {
    console.log("체크 OPT ===================체크시도  +" + token);
    if (token === validToken) {
        callback();
    }
    else {
        console.log("체크 OPT ===================에러 +" + validToken);
        callback("invalid token");
    }
}
/*    let options = {
        uri: validOtpURL,
        method: 'POST',
        json: {
            "otpKey": otp_key
        }
    };

    // form-data 방식
    // let form = {
    //     "otpKey" : otp_key
    // };

    // let form_data = querystring.stringify(form);

    // let options = {
    //     headers: {
    //         'Content-Length': form_data.length,
    //         'Content-Type': 'application/x-www-form-urlencoded'
    //     },
    //     uri : URL_CHECK_OPT,
    //     method : 'POST',
    //     body : form_data
    // };

    request(options, function(err, res, body) {
        if (err) {
            console.log("체크 OPT ===================에러 +" + err);
            callback(err);
            return;
        }

        if (200 !== res.statusCode) {
            callback('checkOtp Server statusCode : ' + res.statusCode);
            return;
        }

        // body.code = '01.000';    // 테스트 - 무조건 검증 성공

        if (body && CODE.SUCCESS !== body.code) {
            callback('invalid otpKey');
            console.error(body);
            console.log(options);
            return;
        }

        callback();
    });

}*/

// 유저 정보 테이블 삭제
function delete_user_data(user_ids, cb) {
    // AccountDB.TbUser 삭제
    mysql.getAccountWrite().getConnection(function(error, connection_account_db) {
        if (error) {
            if (connection_account_db) {
                connection_account_db.release();
            }
            cb(error);
            return;
        }

        mysql.getLogWrite().getConnection(function(error, connection_log_db) {
            if (error) {
                if (connection_log_db) {
                    connection_log_db.release();
                }
                if (connection_account_db) {
                    connection_account_db.release();
                }
                cb(error);
                return;
            }

            //친구를 지웁니다.
            mysql.getWebWrite().getConnection(function(error, connection_web_db) {
                if (error) {
                    if (connection_web_db) {
                        connection_web_db.release();
                    }
                    if (connection_log_db) {
                        connection_log_db.release();
                    }
                    if (connection_account_db) {
                        connection_account_db.release();
                    }
                    cb(error);
                    return;
                }
                let result = {};
                let query_web = "DELETE FROM WebDB.Friendships where user_id =? OR friend_id =?";

                async.forEach(user_ids, function(user_idx, cb_for){
                    connection_web_db.query(query_web, [user_idx,user_idx], function(error, results, fiedlds){
                        if (error) {
                            console.log("에러 -====" + error);
                            result[user_idx] = getDelUserResponseValue(false, "Error occured from Database.");

                            cb_for();
                            return;
                        }
                        // 삭제된 유저 없음
                        else if (0 === results.affectedRows) {
                            result[user_idx] = getDelUserResponseValue(true, "No user deleted.");

                            cb_for();
                            return;
                        }
                    });
                });//어싱크 FOREACH  웹 프렌드 지우기

                if (connection_web_db) {
                    connection_web_db.release();
                }

            // GameDB.TbMole 삭제
            // GameDB.TbChange 삭제
            // GameDB.TbSetCoin 삭제
            mysql.getGameWrite().getConnection(function(error, connection_game_db) {
                if (error) {
                    if (connection_game_db) {
                        connection_game_db.release();
                    }
                    if (connection_log_db) {
                        connection_log_db.release();
                    }
                    if (connection_account_db) {
                        connection_account_db.release();
                    }
                    cb(error);
                    return;
                }

                if (connection_game_db) {
                    connection_game_db.release();
                }
                
                let result = {};
                //let query_account = 'DELETE FROM Users WHERE id = ?';
                //let query_account = 'UPDATE Users SET session_id = NULL , nickname = NULL, secession = 1 WHERE id = ?';

                //진원PM의 요청으로 회원탈퇴시 다른 유저가 같은 닉네임을 못쓰도록 nickname을 null처리 하지 않는다 2020-01-20
                let query_account = 'UPDATE Users SET session_id = NULL ,secession = 1 WHERE id = ?';

                async.forEach(user_ids, function(user_idx, cb_for) {
                    // All transaction 성공
                    connection_account_db.query(query_account, [user_idx], function(error, results, fields) {
                        // AccountDB 삭제 실패
                        if (error) {
                            console.log("에러 -====" + error);
                            result[user_idx] = getDelUserResponseValue(false, "Error occured from Database.");

                            cb_for();
                            return;
                        }
                        // 삭제된 유저 없음
                        else if (0 === results.affectedRows) {
                            result[user_idx] = getDelUserResponseValue(true, "No user deleted.");

                            cb_for();
                            return;
                        }

                        RegitLogSecession(connection_log_db, [user_idx], function(error) {

                            if (error) {
                                console.log("에러 ==========" + error);
                                result[user_idx] = getDelUserResponseValue(false, error);
                            }
                            // 전부 삭제 성공
                            else {
                                result[user_idx] = getDelUserResponseValue(true, "");
                            }
                            cb_for();
                        });

                        // AccountDB 삭제 성공
                        // GameDB 삭제 시작
                        // 게임데이터는 그대로 둡니다 정책이 바뀌었음 (2019, 8)
                        /*     GameDbDelete(connection_game_db, [user_idx], function(error) {
                                // 전부 삭제 성공
                                result.push({
                                    'userId' : user_idx,
                                    'delYn' : 'Y'
                                });
                                cb_for();
                            }); */
                    });
                }, function() {
                    if (connection_account_db) {
                        connection_account_db.release();
                    }

                    if(connection_log_db) {
                        connection_log_db.release();
                    }

                    cb(null, result);
                });

            });//mysql.getGameWrite()

            });//mysql.getWebWrite()

        });//mysql.getLogWrite()


    });
}
//LogDB log_account_regit 로그테이블 유저데이터에서 탈퇴처리 (통계위함)
function RegitLogSecession(connection_log_db, params, callback) {
    let query_log_regit = 'UPDATE log_account_regit SET secession = 1 , secession_date = NOW()  WHERE uuid = ?';

    console.log("로그 지움 =" + params);
    connection_log_db.query(query_log_regit, params, function(error, result, fiedlds) {
        if (error) {
            console.log('log_account_regit secession failed error: %s', error);
            callback("Error occured from Database.");
        } else {
            callback();
        }
    })
}

// GameDB 테이블 삭제
// TODO : 게임 추가 할때 마다 여기에 테이블 삭제 추가 해야 함
function GameDbDelete(connection_game_db, params, callback) {
    let query_game_mole = 'DELETE FROM TbMole WHERE UUID = ?';
    let query_game_PanChange = 'DELETE FROM TbPanChange WHERE UUID = ?';
    let query_game_SetCoin = 'DELETE FROM TbSetCoin WHERE UUID = ?';

    // TbMole 삭제
    connection_game_db.query(query_game_mole, params, function(error, results, fields) {
        // TbMole 삭제 실패
        if (error) {
            console.log('TbMole delete failed : %s', error);
        } else {
            // TbPanChange 삭제
            connection_game_db.query(query_game_PanChange, params, function(error, results, fields) {
                // TbPanChange 삭제 실패
                if (error) {
                    console.log('TbPanChange delete failed : %s', error);
                }

                // TbSetCoin 삭제
                connection_game_db.query(query_game_SetCoin, params, function(error, results, fields) {
                    // TbSetCoin 삭제 실패
                    if (error) {
                        console.log('TbSetCoin delete failed : %s', error);
                    }

                    callback();
                });
            });

        }


    });
}
// end 회원 탈퇴
////////////////////////////////////////////////////////////////////////////////////////////////////////

// kevin added
// 채널 user count 업데이트
function update_channel(game_code, channel_id, count, callback) {

    if (null == game_code || null == channel_id || null == count) {
        callback('update_channel parameter error');
        return;
    }

    mysql.getGameWrite().getConnection(function(error, connection) {
        if (error) {
            if (connection) {
                connection.release();
            }
            callback(error);
            return;
        }

        let query = 'UPDATE TbChannel SET current_count = current_count + ? WHERE game_code = ? AND channel_id = ?';
        let params = [count, game_code, channel_id];

        connection.query(query, params, function(error, results, fields) {
            if (connection) {
                connection.release();
            }
            if (error) {
                callback(error);
                return;
            }

            callback();
        });
    });
};

const LOG_MSG_IDX = require('./log_msg_idx').LOG_MSG_IDX;

// kevin added
// AccountDB.Users 테이블 points 업데이트
function update_point(uuid, point, nick_name, game_code, date, callback) {

    /*   console.log("업데이트 포인트 UUID ==============================="+uuid);
      console.log("업데이트 포인트 point ==============================="+point);
      console.log("업데이트 포인트 nick_name ==============================="+nick_name);
      console.log("업데이트 포인트 game_code ==============================="+game_code); */
    if (null == uuid || null == point || 0 > point || date == null) {
        callback('update_channel parameter error');
        //   res.end();
        return;
    }

    //패킷 복사를 예방합니다. 0.5초이상 느리게 온 패킷은 받지 않습니다.
    if (Check_Packet_Time(date) === false) {
        //패킷 타임시퀀스에러 (패킥복사 의심)
        return;
    }

    mysql.getAccountWrite().getConnection(function(error, connection) {
        if (error) {
            if (connection) {
                connection.release();
            }
            callback(error);
            return;
        }

        let query = 'UPDATE Users SET points = points + ? WHERE id = ? ';
        let params = [point, uuid];

        connection.query(query, params, function(error, results, fields) {
            if (connection) {
                connection.release();
            }
            if (error) {
                callback(error);
                return;
            }

            callback();
        });
    });

    //LogDB에 로그 쌓기
    write_point_log(LOG_MSG_IDX.GET_POINT, uuid, nick_name, game_code, point, 1, (err) => {
        if (err != PACKET_ERR.SUCCESS) {
            console.error("write_point_log >> err : " + err);
        }
    });

    let _get_pos;
    var _desc;
    var num_game_code = parseInt(game_code);

    switch (num_game_code) {
        case GAME_CODE.GAME_SET_COIN:
            {
                _get_pos = 3;
                _desc = "동전쌓기 게임 포인트";
            }
            break;
        case GAME_CODE.GAME_PAN_CHANGE:
            {
                _get_pos = 4;
                _desc = "판뒤집기 게임 포인트";
            }
            break;
        case GAME_CODE.GAME_MOLE:
            {
                _get_pos = 2;
                _desc = "두더지잡기 게임 포인트";
            }
            break;
        case GAME_CODE.GAME_TYPING:
            {
                _get_pos = 1;
                _desc = "타자연습 게임 포인트";
            }
            break;
        default:
            {
                _get_pos = 0;
            }
    }
      console.log("첫번쨰 겟포스 ============="+_get_pos);
      console.log("첫번쨰 디스크립션 ============="+_desc);
    //WebDb에 포인트 로그 쌓기 (획득시 1 , 소진시2)
    write_point_list(uuid, nick_name, point, 1, _desc, _get_pos, (err) => {});

};

const write_log = require('./write_log').write_log;

function write_point_log(msg_idx, uuid, nick_name, game_code, point, pos, callback) {
    let _ct = TIME.getTime();
    let _gst = TIME.getYMD(_ct);
    write_log(msg_idx, uuid, nick_name,
        "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",
        point, game_code, pos, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        _gst, null, null, null, null, null, null, null, null, null, (err) => {
            callback(err);
        });
}

function write_point_list(uuid, nick_name, point, logtype, desc, get_pos, callback) {
    var tasks = [
        function(callback1) {
            mysql.getAccountRead().getConnection((err, con) => {
                if (err) {
                    if (con) con.release();
                    console.error('write_point_list >> getConnection...1 err ' + err);
                    callback(PACKET_ERR.WRITE_POINT_LIST_MYSQL_1);
                } else {
                    /*      console.log("저장하는  포인트 ================="+point); */
                    let _query = "SELECT points FROM AccountDB.Users WHERE id=?";
                    con.query(_query, [uuid], (err1, result, fields) => {
                        con.release();
                        if (err1) {
                            console.error('write_point_list >> query...1 err ' + err1);
                            callback(PACKET_ERR.WRITE_POINT_LIST_MYSQL_1_QUERY);
                            return;
                        } else {
                            if (result.length <= 0) {
                                console.error('write_point_list >> qeury...1 res ' + result.length);
                                callback(PACKET_ERR.WRITE_POINT_LIST_MYSQL_1_RES);
                                return;
                            } else {
                                /*     console.log("두번쨰 디스크립션 ============="+desc); */
                                let _rdata = {};
                                _rdata.result = PACKET_ERR.SUCCESS;
                                _rdata.total_point = result[0].points;
                                _rdata.desc = desc;
                                /*         console.log("어카운트에 저장됫엇던  포인트를 가져옵니다. ================="+_rdata.total_point); */
                                callback1(PACKET_ERR.SUCCESS, _rdata);
                            }
                        }
                    });
                }

            });
        },
        function(data, callback1) {
               console.log("포인트 로그 타입 ==================="+logtype);
               console.log("포인트 값 타입 ==================="+point);

            mysql.getWebWrite().getConnection((err, con) => {
                if (err) {
                    if (con) con.release();
                    console.error('write_point_list >> getConnection...2 err ' + err);
                    callback(PACKET_ERR.WRITE_POINT_LIST_MYSQL_2);
                } else {

                    /*       console.log("마지막 입력되는 획득 포인트 . ================="+point);
                          console.log("마지막 가져오는 보유 포인트 . ================="+data.total_point);
                        
                        console.log("디스크립트 ======================="+data.desc); */

                    let _query = 'call web_insert_point(?,?,?,?,?,@_total_balance);SELECT @_total_balance as _total_balance';
                    con.query(_query, [uuid, parseInt(logtype), get_pos, point, data.desc], (err, result) => {
                        con.release();
                        if (err) {
                            console.error('write_point_list >> query err ' + err);
                            callback(PACKET_ERR.WRITE_POINT_LIST_MYSQL_2_QUERY);
                        } else {
                            if (result.length > 0) {

                                // 결과값은 내부 프로시져에서 로그를 뒤져 총획득치와 소모치를 사칙연산해서 
                                // 최종 보유값을 찾아냅니다. 이코드가 들어간 이유는 기존 포인트 적재 코드에
                                // 오류가 있어 라이브 서버의 포인트 인서트시마다 계산해서 갱신하기 위함입니다.


                                // 최종 보유값. 이것을 다시 어카운트에 넣습니다 ㅡㅡ;;;

                                /*     console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@ ---- 최종 결과값 ---"+ result[1][0]._total_balance); */
                                data.total_point = result[1][0]._total_balance;

                                    console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@ ---- 최종 보유값 ---"+data.total_point);
                                callback1(null, data);


                            } else {

                                console.error('write pont : there is not result (total balance) ');
                                callback(PACKET_ERR.WRITE_POINT_LIST_MYSQL_2_QUERY);
                                return;
                            }

                        }
                    });

                }
            });
        },

        function(data2, callback1) {
            mysql.getWebRead().getConnection((err, con) => {
                if (err) {
                    if (con) con.release();
                    console.error('wrtie_game_point >> getConnection error (mysql err)!!!' + err);
                    callback(PACKET_ERR.WRITE_POINT_LIST_MYSQL_2_QUERY);
                    return;
                } else {
                    let _query3 = "SELECT balance FROM WebDB.PointLogs WHERE user_id =? \
                                ORDER BY created_at desc limit 1";
                    con.query(_query3, [uuid], (err1, rows, fields) => {
                        if (con) con.release();
                        if (err1) {
                            console.log("query_err from readPoint333")
                            callback(PACKET_ERR.COMMON_QUERY_ERROR);
                        } else {
                            if (rows.length > 0) {
                                for (var i = 0; i < rows.length; i++) {
                                    data2.total_point = rows[i].balance;
                                }
                                callback1(null, data2);

                            } else {
                                data2.total_point = 0;
                                callback1(null, data2);
                            }
                        }

                    })
                }
            })
        },

        function(data2, callback1) {
            mysql.getAccountWrite().getConnection((err, con) => {
                if (err) {
                    if (con) con.release();
                    console.error('write_point_list >> getConnection...2 err ' + err);
                    callback(PACKET_ERR.WRITE_POINT_LIST_MYSQL_2);
                } else {
                    console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@ ---- 최종 보유값 2---" + data2.total_point);
                    let _query = 'UPDATE AccountDB.Users SET points=? WHERE id=?';
                    con.query(_query, [data2.total_point, uuid], (err, result) => {
                        con.release();
                        if (err) {
                            console.error('write_point_list >> query err last process ' + err);
                            callback(PACKET_ERR.WRITE_POINT_LIST_MYSQL_2_QUERY);
                        } else {
                            if (result.length <= 0) {
                                console.error('write_point_list >> qeury...2 res ' + result.length);
                                callback(PACKET_ERR.WRITE_POINT_LIST_MYSQL_3_RES);
                                return;
                            } else {
                                callback1(PACKET_ERR.SUCCESS);
                            }

                        }


                    });

                }
            })
        }
    ];

    async.waterfall(tasks, (err, data) => {
        callback(err, data);
    });

}

/**
 * 포인트 차감
 * @param UUID uuid 
 * @param 차감포인트 point 
 * @param 닉네임 nick_name 
 * @param 게임코드 game_code 
 * @param 차감위치 get_pos 1: 상점, 2 : 포인터 소멸, 3: 관리자 회수
 * @param 획득 아이템 get_item 
 * @param 콜백 callback 
 * 
 * 
 */
function reduce_point(uuid, point, nick_name, game_code, get_pos, get_item, callback) {

    var tasks = [
        function(callback1) {
            mysql.getAccountWrite().getConnection(function(err, con) {
                if (err) {
                    console.error('reduce_point >> getConnection ...err ' + err);
                    callback(PACKET_ERR.REDUCE_POINT_MYSQL);
                    return;
                } else {
                    let _q = 'call SPReducePoint(?,?,@ret);SELECT @ret as ret';
                    con.query(_q, [uuid, point], (err1, result, fields) => {
                        con.release();
                        if (err1) {
                            console.error('reduce_point >> query.....' + err1);
                            callback(PACKET_ERR.REDUCE_POINT_MYSQL_QUERY);
                            return;
                        } else {
                            callback1(PACKET_ERR.SUCCESS);
                        }
                    });
                }
            });
        },
        //로그 쌓기
        function(callback1) {
            write_reduce_point_log(LOG_MSG_IDX.REDUCE_POINT, uuid, nick_name, game_code, point, get_pos, get_item, (err) => {
                if (err != PACKET_ERR.SUCCESS) {
                    console.error('reduce_point >> query..2...' + err);
                    callback(err);
                    return;
                } else {
                    callback1(PACKET_ERR.SUCCESS);
                }
            });
        },
        //포인트 가져오기
        function(callback1) {
            mysql.getAccountWrite().getConnection((err, con) => {
                if (err) {
                    if (con) con.release();
                    console.error('reduce_point >> getConnection...3 err ' + err);
                    callback(PACKET_ERR.REDUCE_POINT_MYSQL_MYSQL2);
                } else {
                    let _query = "SELECT points FROM AccountDB.Users WHERE id=?";
                    con.query(_query, [uuid], (err1, result, fields) => {
                        con.release();
                        if (err1) {
                            console.error('reduce_point >> query...3 err ' + err1);
                            callback(PACKET_ERR.REDUCE_POINT_MYSQL_MYSQL2_QUERY);
                        } else {
                            if (result.length <= 0) {
                                console.error('reduce_point >> qeury...3 res ' + result.length);
                                callback(PACKET_ERR.REDUCE_POINT_MYSQL_MYSQL2_QUERY_RES);
                            } else {
                                let _rdata = {};
                                _rdata.result = PACKET_ERR.SUCCESS;
                                _rdata.total_point = result[0].points;
                                callback1(PACKET_ERR.SUCCESS, _rdata);
                            }
                        }
                    });
                }

            });
        },
        function(data, callback1) {
            mysql.getWebWrite().getConnection((err, con) => {
                if (err) {
                    if (con) con.release();
                    console.error('reduce_point >> getConnection...4 err ' + err);
                    callback(PACKET_ERR.REDUCE_POINT_MYSQL_MYSQL3);
                } else {

                    let _query = 'call web_insert_point(?,?,?,?,@_total_balance);SELECT @_total_balance';
                    con.query(_query, [uuid, 2, get_pos, point], (err, result) => {
                        con.release();
                        if (err) {
                            console.error('write_point_list >> query err ' + err);
                            callback(PACKET_ERR.WRITE_POINT_LIST_MYSQL_2_QUERY);
                        } else {
                            if (result.length <= 0) {

                                // 결과값은 내부 프로시져에서 로그를 뒤져 총획득치와 소모치를 사칙연산해서 
                                // 최종 보유값을 찾아냅니다. 이코드가 들어간 이유는 기존 포인트 적재 코드에
                                // 오류가 있어 라이브 서버의 포인트 인서트시마다 계산해서 갱신하기 위함입니다.

                                result.forEach(function(row) {

                                    // 최종 보유값. 이것을 다시 어카운트에 넣습니다 ㅡㅡ;;;
                                    data.total_point = row._total_balance;
                                    callback1(data);
                                });


                            } else {

                                console.error('write pont : there is not result (total balance) ');
                                callback(PACKET_ERR.WRITE_POINT_LIST_MYSQL_2_QUERY);
                            }

                        }
                    });

                }
            });
        },

        function(data, callback1) {
            mysql.getAccountWrite().getConnection((err, con) => {
                if (err) {
                    if (con) con.release();
                    console.error('write_point_list >> getConnection...2 err ' + err);
                    callback(PACKET_ERR.WRITE_POINT_LIST_MYSQL_2);
                } else {
                    let _query = 'UPDATE AccountDB.Users SET points=? WHERE id=?';
                    con.query(_query, [data.total_point, uuid], (err, result) => {
                        con.release();
                        if (err) {
                            console.error('write_point_list >> query err last process ' + err);
                            callback(PACKET_ERR.WRITE_POINT_LIST_MYSQL_2_QUERY);
                        } else {
                            if (result.length <= 0) {
                                console.error('write_point_list >> qeury...2 res ' + result.length);
                                callback(PACKET_ERR.WRITE_POINT_LIST_MYSQL_3_RES);
                            } else {
                                callback1(PACKET_ERR.SUCCESS);
                            }

                        }


                    });

                }
            })
        }
    ];
    async.waterfall(tasks, (err, data) => {
        callback(err);
    });

}

/**
 * 
 * @param 로그인덱스 msg_idx 
 * @param UUID uuid 
 * @param 닉네임 nick_name 
 * @param 게임코드 game_code 
 * @param 차감포인트 point 
 * @param 차감한 위치 pos 1: 상점, 2 : 포인터 소멸, 3: 관리자 회수
 * @param 획득 아이템 get_item 
 * @param 콜백 callback 
 */

function write_reduce_point_log(msg_idx, uuid, nick_name, game_code, point, pos, get_item, callback) {
    let _ct = TIME.getTime();
    let _gst = TIME.getYMD(_ct);
    write_log(msg_idx, uuid, nick_name,
        "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",
        point, game_code, pos, get_item, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        _gst, null, null, null, null, null, null, null, null, null, (err) => {
            callback(err);
        });
}


module.exports = {
    write_session_id: write_session_id,
    delete_user: delete_user,
    write_new_user: write_new_user,
    write_setcoin_table: write_setcoin_table,
    update_channel: update_channel,
    update_point: update_point,
    reduce_point: reduce_point
}