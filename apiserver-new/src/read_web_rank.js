const mysql = require('./mysql');
const async = require('async'); // kevin added
const PACKET_ERR = require('./packet_err').PACKET_ERR;

exports.search_rank_week_users = function(page, gamecode, session_id, callback) {


    var task = [

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
                        con.release();
                        if (err1) {
                            console.log('read_rank_school >> query error (mysql err)!!!' + err1);
                            callback(PACKET_ERR.MYSQL_READ_BY_SESSION_NOT_INFO);
                            return;
                        } else {


                            if (result[0] !== null) {

                                let minedata = {};
                                for (var i = 0; i < result.length; i++) {
                                    for (var j = 0; j < result[i].length; j++) {
                                        minedata.id = result[i][j].id;
                                        console.log("결과값 " + i + "번쨰" + result[i][j].id);
                                    }

                                }

                                callback1(null, minedata);
                            } else {
                                console.log('read_rank_school >> sessionId Not Match!!!' + err1);
                                callback(PACKET_ERR.MYSQL_READ_BY_SESSION_NOT_MATCH);
                                return;
                            }

                        }
                    });

                }

            })

        },

        function(minedata, callback1) {


            mysql.getWebRead().getConnection((err, con) => {
                if (err) {
                    if (con) con.release();
                    console.error('read_rank_school >> getConnection error (mysql err)!!!' + err);
                    callback(PACKET_ERR.READ_RABK_DOESNT_EXIST);
                    return;
                } else {

                    //게임코드를 프론트에서 받아옵니다.
                    let _gamecode = gamecode;
                    //테이블명 기본
                    let tableName
                    let total_Count

                    var num = parseInt(page);

                    //요청당해년과월을 봅습니다.
                    var date_1st = getDate(num);



                    //요청된 날이 몇번째 주인지 뽑습니다.
                    // var DateType_data = getWeek(num);

                    var str_date = date_1st.toString();

                    console.log("뽑은 날짜=======================================" + str_date);
                    var num = parseInt(gamecode);

                    switch (num) {
                        case 10000: //코인
                            {
                                tableName = 'TbSetCoinRanking_' + str_date;
                            }
                            break;
                        case 10001: //판뒤집기
                            {
                                tableName = 'TbPanChangeRanking_' + str_date;
                            }
                            break;
                        case 10002: //몰
                            {
                                tableName = 'TbMoleRanking_' + str_date;
                            }
                            break;
                        case 10003: //타이핑
                            {
                                //실시간 랭킹 데이터가 남는 테이블명. + 남겨진 주간 
                                tableName = 'TbTypingPracticeRanking_' + str_date;
                            }
                            break;

                    }


                    var int_page = parseInt(page);

                    let _query = "call web_select_rank_school(?,?,?,@_total_count);SELECT @_total_count as _total_count";
                    con.query(_query, [tableName, int_page, 10], (err1, rows, fields) => {
                        con.release();
                        if (err1) {
                            console.log('read_rank_school >> query error (mysql err)!!!' + err1);
                            callback(PACKET_ERR.READ_RABK_DOESNT_EXIST);
                            return;
                        } else {
                            let _rdata = {};
                            let _data = [];
                            let _count = [];

                            var count = 0;

                            if (rows[0].length <= 0) {

                                callback(PACKET_ERR.READ_TABLE_DOESNT_EXIST);
                                return;
                            }

                            for (var j = 0; j < rows[0].length; j++) {
                                let rowdata = {};
                                rowdata.nickname = rows[0][j].NickName;
                                rowdata.Score = rows[0][j].Score;
                                //  rowdata.Rank = rows[0][j].Rank;
                                rowdata.Rank = j + 1;
                                rowdata.year = rows[0][j].year;
                                rowdata.classroom = rows[0][j].classroom;
                                rowdata.SchoolName = rows[0][j].SchoolName;

                                _data.push(rowdata);
                                count += 1;
                            }

                            total_Count = rows[2][0]._total_count;
                            callback1(null, _data, total_Count, minedata);

                        }
                    }); //쿼리
                }
            });
        },

        function(data, count, minedata, callback1) {


            mysql.getAccountRead().getConnection((err, con) => {

                let data2 = [];

                let _query = "SELECT id FROM Users WHERE nickname=?";

                for (var i = 0; i < data.length; i++) {
                    let rowdata = {}; // 지역변수화 해야함.
                    rowdata = data[i];

                    con.query(_query, [rowdata.nickname], (err1, result, fields) => {

                        if (err1) {
                            console.error('read_uuid_4_rank_redis >> query error (mysql err)!!!' + err1);
                            con.release();
                            callback(PACKET_ERR.READ_RABK_DOESNT_EXIST);
                            return;
                        } else {


                            if (result.length !== 0) {
                                rowdata.id = result[0].id;
                            } else {
                                rowdata.id = 0; //개발서버에 가데이터가 많아 예외 처리
                            }

                            data2.push(rowdata);

                            if (data2.length == i) {
                                con.release();
                                callback1(null, data2, count, minedata);
                            }
                        }
                    }); //쿼리

                } //FOR


            }); //커넥션

        },

        //게임결과 정보 셋팅 
        function(data2, count, minedata, callback1) {


            mysql.getGameRead().getConnection((err, con) => {
                let data3 = [];
                let Myinfo = [];
                let MyRank = {};

                var num = parseInt(page);

                var _query = getQueryForGame(gamecode, num);


                for (var i = 0; i < data2.length; i++) {
                    let _gamedata = {}; //지역변수화 해야함.포문

                    _gamedata = data2[i];

                    console.log("두더지 쿼리 ============" + _query);
                    console.log("두더지 아이디 ============" + _gamedata.id);

                    con.query(_query, [_gamedata.id], (err1, result, fields) => {

                        if (err1) {
                            console.error('read_uuid_4_rank_redis Lasts >> query error (mysql err)!!!' + err1);
                            con.release();
                            callback(PACKET_ERR.READ_RABK_DOESNT_EXIST);
                            return;
                        } else {

                            console.log("두더지 select 카운트  ============" + result.length);
                            var num = parseInt(gamecode);
                            switch (num) {
                                case 10000:
                                    {

                                        if (result.length > 0) {
                                            _gamedata.Win = result[0].Win;
                                            _gamedata.Lose = result[0].Lose;
                                            _gamedata.Draw = result[0].Draw;
                                        } else {

                                            _gamedata.Win = 0;
                                            _gamedata.Lose = 0;
                                            _gamedata.Draw = 0;
                                        }
                                    }
                                    break;
                                case 10001:
                                    {
                                        if (result.length > 0) {
                                            _gamedata.Win = result[0].Win;
                                            _gamedata.Lose = result[0].Lose;
                                            _gamedata.Draw = result[0].Draw;
                                        } else {
                                            _gamedata.Win = 0;
                                            _gamedata.Lose = 0;
                                            _gamedata.Draw = 0;
                                        }
                                    }
                                    break;
                                case 10002:
                                    {
                                        if (result.length > 0) {

                                            _gamedata.Stage = result[0].stage;
                                            _gamedata.GameScore = result[0].score;

                                            console.log("두더지 스테이지 =============" + _gamedata.Stage);

                                        } else {

                                            _gamedata.Stage = 0;
                                            _gamedata.GameScore = 0;

                                        }
                                    }
                                    break;
                                case 10003:
                                    {

                                        if (result.length > 0) {
                                            _gamedata.Count = result[0].count;
                                            _gamedata.Speed = result[0].speed;

                                            console.log("타자수 카운트 ====================================" + _gamedata.Count);
                                            console.log("타자수 스피드 ====================================" + _gamedata.Speed);
                                            _gamedata.Speed = Math.floor(_gamedata.Speed / _gamedata.Count);
                                            console.log("타자수 평균치 ====================================" + _gamedata.Speed);

                                        } else {
                                            _gamedata.Speed = 0;

                                        }

                                    }
                                    break;


                            }

                            console.log("게임 아이디 ====" + _gamedata.id + "      " + "내 아이디 =======" + minedata.id);

                            if (_gamedata.id === minedata.id) {

                                console.log("내 랭크 찾아서 들어옴... 게임데이터 내용 " + _gamedata.Rank);
                                MyRank = _gamedata;
                                // Myinfo.push(_gamedata);
                                // data3.push(Myinfo);
                            } else {
                                //  MyRank = null;
                                //  Myinfo.mine.push(_gamedata);
                                //  data3.push(Myinfo);
                            }
                            data3.push(_gamedata);

                            if (data3.length == i) {
                                if (con) {

                                    con.release();
                                }


                                callback1(null, data3, count, MyRank);
                            }

                        }
                    }); //쿼리
                } //FOR
            }); //커넥션
        }


    ];

    async.waterfall(task, (err, data, count, Myinfo) => {
        if (err) {
            callback(PACKET_ERR.READ_RABK_DOESNT_EXIST, data, count);
        } else {
            callback(PACKET_ERR.SUCCESS, data, count, Myinfo);
        }

    });
}

exports.search_rank_week_school = function(page, gamecode, callback) {


    var task = [

        function(callback1) {


            mysql.getWebRead().getConnection((err, con) => {
                if (err) {
                    if (con) con.release();
                    console.error('read_rank_school >> getConnection error (mysql err)!!!' + err);
                    callback(PACKET_ERR.READ_RABK_DOESNT_EXIST);
                    return;
                } else {


                    //테이블명 기본
                    let tableName
                    let total_Count

                    //page 0이면 이번달 1:전달 2:전전달
                    var num = parseInt(page);

                    //요청당해년과월을 봅습니다. 0이면 해당달 1부터 전달입니다.
                    var date_1st = getMonth_new(num);

                    var str_date = date_1st.toString();

                    console.log("학교랭킹 누족 데이트 =================" + str_date);
                    var num = parseInt(gamecode);
                    let _query;
                    switch (num) {
                        case 10000: //코인
                            {
                                tableName = 'TbSetCoinShoolRanking_' + str_date;
                                //아래 프로시져는 동전쌓기와 타이핑 같이 사용합니다 (디비 컬럼 데이터가 같습니다.)
                                _query = "call web_select_rank_school_typing(?,@_total_count);SELECT @_total_count as _total_count";
                            }
                            break;
                        case 10001: //판뒤집기
                            {
                                tableName = 'TbPanChangeShoolRanking_' + str_date;
                                _query = "call web_select_rank_school_typing(?,@_total_count);SELECT @_total_count as _total_count";

                            }
                            break;
                        case 10002: //몰
                            {
                                tableName = 'TbMoleShoolRanking_' + str_date;
                                _query = "call web_select_rank_school_mole(?,@_total_count);SELECT @_total_count as _total_count";
                            }
                            break;
                        case 10003: //타이핑
                            {
                                // 테이블명. + 남겨진 주간 
                                tableName = 'TbTypingShoolRanking_' + str_date;
                                _query = "call web_select_rank_school_typing(?,@_total_count);SELECT @_total_count as _total_count";
                            }
                            break;

                    }

                    con.query(_query, [tableName], (err1, rows, fields) => {
                        con.release();
                        if (err1) {
                            console.log('read_rank_school >> query error (mysql err)!!!' + err1);
                            callback(PACKET_ERR.READ_RABK_DOESNT_EXIST);
                            return;
                        } else {

                            let _data = [];
                            let _count = [];

                            var count = 0;

                            for (var j = 0; j < rows[0].length; j++) {
                                let rowdata = {};
                                rowdata.Week = rows[0][j].Week;
                                rowdata.Score = rows[0][j].Score;
                                rowdata.Rank = j + 1;
                                rowdata.SchoolName = rows[0][j].SchoolName;

                                _data.push(rowdata);
                                count += 1;
                            }

                            total_Count = rows[2][0]._total_count;
                            callback1(null, _data, total_Count);

                        }
                    }); //쿼리
                }
            });
        }


    ];

    async.waterfall(task, (err, data, count) => {
        if (err) {
            callback(PACKET_ERR.READ_RABK_DOESNT_EXIST, data, count);
        } else {
            callback(PACKET_ERR.SUCCESS, data, count);
        }

    });
}


function getDate(num) {
    var today = new Date();
    var startDay = new Date();

    //데이트  들어오는 num값은 지금부터 몇쨰주 뒤이냐는 뜻 
    var count = parseInt(num);
    if (count > 0) {

        for (var i = 0; i < count; i++) {
            today = getMonday(today); //오늘날짜 기준의 월요일 날짜를 뽑는다.
            today.setDate(today.getDate() - 4); //해당 월요일에서 4일을 뺀다.
        }
        //최종값에서 마지막 월요일을 뽑습니다.
        today = getMonday(today);
        startDay = today;

        // 그 마지막 월요일이 해당월간의 몇번째 주 인지 뽑습니다.
        var str_numOfWeek = getWeekOfMonth(startDay);

    } else {
        //최종값에서 마지막 월요일을 뽑습니다.
        today = getMonday(today);
        startDay = today;

        // 그 마지막 월요일이 해당월간의 몇번째 주 인지 뽑습니다.
        var str_numOfWeek = getWeekOfMonth(startDay);
    }

    var mm = startDay.getMonth() + 1;
    var mm2 = (mm > 9 ? '' : '0') + mm;
    var yyyy = startDay.getFullYear();

    var str_today = yyyy.toString() + mm2.toString() + str_numOfWeek;
    return str_today;
};

function getMonth_new(num) {
    var today = new Date();
    var startDay = new Date();

    //데이트  들어오는 num값은 지금부터 몇쨰주 뒤이냐는 뜻 
    var count = parseInt(num);
    if (count > 0) {

        for (var i = 0; i < count; i++) {
            today = getMonday(today); //오늘날짜 기준의 월요일 날짜를 뽑는다.
            today.setDate(today.getDate() - 4); //해당 월요일에서 4일을 뺀다.
        }
        //최종값에서 마지막 월요일을 뽑습니다.
        today = getMonday(today);
        startDay = today;

        // 그 마지막 월요일이 해당월간의 몇번째 주 인지 뽑습니다.
        var str_numOfWeek = getWeekOfMonth(startDay);

    } else {
        //최종값에서 마지막 월요일을 뽑습니다.
        today = getMonday(today);
        startDay = today;

        // 그 마지막 월요일이 해당월간의 몇번째 주 인지 뽑습니다.
        var str_numOfWeek = getWeekOfMonth(startDay);
    }

    var mm = startDay.getMonth() + 1;
    var mm2 = (mm > 9 ? '' : '0') + mm;
    var yyyy = startDay.getFullYear();

    var str_today = yyyy.toString() + mm2.toString();
    return str_today;
};

function getWeekOfMonth(d) {
    var date = d;
    date.setHours(0, 0, 0, 0);
    // Thursday in current week decides the year.
    date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
    // January 4 is always in week 1.
    var week1 = new Date(date.getFullYear(), date.getMonth(), 4);
    // Adjust to Thursday in week 1 and count number of weeks from date to week1.
    let _week = 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
    return "0" + _week;
}

function getMonday(d) {
    d = new Date(d);
    var day = d.getDay(),
        diff = d.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
    return new Date(d.setDate(diff));
}


//쿼리로 날짜 조건을 얻기위해 ios 출력합니다. 셀렉트 시작날짜
function getDateStart(num) {
    var today = new Date();
    var startDay = new Date();
    //데이트  들어오는 num값은 지금부터 몇쨰주 뒤이냐는 뜻 
    if (num > 0) {
        for (var i = 0; i < num; i++) {
            today = getMonday(today); //오늘날짜 기준의 월요일 날짜를 뽑는다.
            today.setDate(today.getDate() - 4); //해당 월요일에서 4일을 뺀다.
        }
        //최종값에서 마지막 월요일을 뽑습니다.
        today = getMonday(today);
        startDay = today;
        var str_today = startDay.toISOString();
        var arr_date = str_today.split('T');

        return arr_date[0];
    }
};

//쿼리로 날짜 조건을 얻기위해 ios 출력합니다. 셀렉트 끝날짜
function getDateEnd(num) {
    var today = new Date();
    var startDay = new Date();
    //데이트  들어오는 num값은 지금부터 몇쨰주 뒤이냐는 뜻 
    if (num > 0) {
        for (var i = 0; i < num; i++) {
            today = getMonday(today); //오늘날짜 기준의 월요일 날짜를 뽑는다.
            today.setDate(today.getDate() - 4); //해당 월요일에서 4일을 뺀다.
        }
        today = getMonday(today);
        today.setDate(today.getDate() + 6); //최종값이 월요일 스타트날짜이니 6일을 더한다(일요일)
        //최종값에서 마지막 월요일을 뽑습니다.

        var str_today = today.toISOString();
        var arr_date = str_today.split('T');

        return arr_date[0];
    }
};

function getMonth() {
    var today = new Date();

    var mm = today.getMonth() + 1;
    var mm2 = (mm > 9 ? '' : '0') + mm;
    var yyyy = today.getFullYear();

    var str_today = yyyy.toString() + mm2.toString();

    return str_today;
};

//쿼리로 날짜 조건을 얻기위해 ios 출력합니다. 셀렉트 끝날짜
function getDateEnd(num) {
    var today = new Date();
    var startDay = new Date();
    //데이트  들어오는 num값은 지금부터 몇쨰주 뒤이냐는 뜻 
    if (num > 0) {
        for (var i = 0; i < num; i++) {
            today = getMonday(today); //오늘날짜 기준의 월요일 날짜를 뽑는다.
            today.setDate(today.getDate() - 4); //해당 월요일에서 4일을 뺀다.
        }
        today = getMonday(today);
        today.setDate(today.getDate() + 6); //최종값이 월요일 스타트날짜이니 6일을 더한다(일요일)
        //최종값에서 마지막 월요일을 뽑습니다.

        var str_today = today.toISOString();
        var arr_date = str_today.split('T');

        return arr_date[0];
    }
};

function getMonth_tracking(num) {
    var today = new Date();
    var mm;
    if (num === 0) {
        mm = today.getMonth() + 1;
    } else {
        mm = today.getMonth() - num;
    }

    var mm2 = (mm > 9 ? '' : '0') + mm;
    var yyyy = today.getFullYear();

    var str_today = yyyy.toString() + mm2.toString();

    return str_today;
};

function getQueryForGame(gamecode, num) {

    let _query
    var _gamecode = parseInt(gamecode);

    var num = parseInt(num);
    var start = getDateStart(num);
    var end = getDateEnd(num);
    console.log("넘버 ===============" + num);
    console.log("스타트 ===============" + start);
    console.log("엔드 ===============" + end);

    switch (_gamecode) {
        //동전쌓기
        case 10000:
            {
                _query = "SELECT SUM(Win) as Win, SUM(Lose) as Lose, SUM(Draw) as Draw FROM TbSetCoin WHERE UUID=? AND UpdatTime > '" + start + "' AND UpdatTime <= '" + end + "'";
            }
            break;
            //판뒤집기
        case 10001:
            {
                _query = "SELECT SUM(Win) as Win, SUM(Lose) as Lose, SUM(Draw) as Draw FROM TbPanChange WHERE UUID=? AND UpdatTime > '" + start + "' AND UpdatTime <= '" + end + "'";

            }
            break;
            //두더지
        case 10002:
            {
                _query = "SELECT MAX(Stage) AS stage, SUM(Score) AS score FROM TbMole WHERE UUID=? AND UpdatTime > '" + start + "' AND UpdatTime <= '" + end + "'";

            }
            break;
            //타이핑
        case 10003:
            {
                var month = getMonth();
                _query = "SELECT SUM(TotalInputCount) as count, SUM(TotalSpeedCount) as speed FROM TbTwoTypingSpeed_" + month + " WHERE UUID=?";
            }
            break;

    }

    return _query;

}