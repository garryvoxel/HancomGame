const mysql = require('./mysql');
const redis = require('./redis');
const async = require('async');
const g_redis = require('./redis');
const RLI = require('../config/redis.json')[process.env.NODE_ENV || 'development'].PANCHANGE_ROOM_CHANNEL_1;
const PACKET_ERR = require('./packet_err').PACKET_ERR;
const RANKINFO = require('../config/redis.json')[process.env.NODE_ENV].RANKING_REDIS;

const MAX_RANKING_PAGE_LIST = require('./def').MAX_RANKING_PAGE_LIST;

/***
 * 일반 자동방
 * 자동입장에 사용하는 함수
 */
exports.auto_enter = function(callback) {

    auto_enter_func1(0, (err, data) => {
        if (err === PACKET_ERR.SUCCESS) {
            callback(PACKET_ERR.SUCCESS, data);
        } else if (err === -1) {
            let _cs = data;
            auto_enter_func1(_cs, (err1, data1) => {
                if (err1 === 0) {} else {
                    callback(PACKET_ERR.PANCHANGE_AUTO_ENTER_NOT_ENOUGH, null);
                }
            });
        } else {
            callback(PACKET_ERR.PANCHANGE_AUTO_ENTER_NOT_ENOUGH, null);
        }
    });
}

function auto_enter_func1(cursor, callback) {
    const room_list_redis = redis.getPanchangeChannel1();
    room_list_redis.zscan(RLI.KEY1, cursor, (err, res) => {
        if (err) {
            console.log('panchange auto_enter redis err : ' + err);
            callback(PACKET_ERR.PANCHANGE_AUTO_ENTER_REDIS, null);
        } else {
            if (res[1].length <= 0) {
                console.log('panchange auto_enter redis err : ' + res[1].length);
                callback(PACKET_ERR.PANCHANGE_AUTO_ENTER_REDIS_RES, null);
            } else {
                auto_enter_func2(res[0], res[1], callback);
            }
        }
    });
}

function auto_enter_func2(cursor, room_number, callback) {
    const room_list_redis = redis.getPanchangeChannel1();

    let _loop_length = 0;
    let _search_success = false;
    let _rdata = {};
    let _data = [];
    for (let i = 0; i < room_number.length; i += 2) {
        var _rinfo_key = RLI.KEY2 + '_' + room_number[i]; //
        room_list_redis.hgetall(_rinfo_key, (err1, res1) => {
            if (err1) { _loop_length += 2; } else {
                if (res1 <= 0) {
                    //룸번호 반환      
                    _loop_length += 2;
                } else {
                    _loop_length += 2;
                    if (res1.is_lock === "0" && res1.is_clan === "0" && res1.is_play === "0") {
                        _search_success = true;
                        _rdata.result = 0;
                        let _room_info = {};
                        _room_info.room_number = res1.room_number;
                        _room_info.host_name = res1.host_name;
                        _room_info.is_lock = res1.is_lock;
                        _room_info.room_title = res1.room_title;
                        _room_info.play_time = res1.play_time;
                        _room_info.back_ground = res1.back_ground;
                        _room_info.user_max_count = res1.user_max_count;
                        _room_info.current_user_count = res1.current_user_count;
                        _room_info.ip = res1.ip;
                        _room_info.host_name = res1.host_name;

                        if (_data.length <= 0) {
                            _data.push(_room_info);
                        }
                        _rdata.data = _data;
                    }
                }
            }

            //루프 상태 체크
            if (room_number.length == _loop_length) {
                if (_search_success) {
                    callback(PACKET_ERR.SUCCESS, _rdata);
                } else {
                    if (cursor != 0) {
                        callback(-1, cursor);
                    } else {
                        callback(PACKET_ERR.PANCHANGE_AUTO_ENTER_NOT_ENOUGH, 0);
                    }
                }
            }
        });
    } //for


}

exports.auto_clan_enter = function(clan_name0, callback) {

    auto_clan_enter_func1(clan_name0, 0, (err, data) => {
        if (err === PACKET_ERR.SUCCESS) {
            callback(PACKET_ERR.SUCCESS, data);
        } else if (err === -1) {
            let _cs = data;
            auto_clan_enter_func1(_cs, (err1, data1) => {
                if (err1 === 0) {} else {
                    callback(PACKET_ERR.PANCHANGE_AUTO_ENTER_NOT_ENOUGH, null);
                }
            });
        } else {
            callback(PACKET_ERR.PANCHANGE_AUTO_ENTER_NOT_ENOUGH, null);
        }
    });
}

exports.auto_clan_enter_by_nickname = function(nickname, callback) {

    mysql.getWebRead().getConnection((err, con) => {
        if (err) {
            if (con) con.release();
            console.error('get_my_clan >> getConnection error (mysql err)!!!' + err);
            callback(PACKET_ERR.COMMON_GET_CONNECTION_ERR);
            return;
        } else {
            let _query = "call web_select_my_claninfo_nick(?)";
            con.query(_query, [nickname], (err, result, fields) => {
                if (con) con.release();
                if (err) {
                    console.error('get_my_clan 4 PanChangers >>>>>>>>>>>>>>>>> query error (mysql err)!!!' + err);
                    callback(PACKET_ERR.COMMON_FAIL);
                    return;
                } else {
                    console.log("닉네임       ======================================" + nickname);
                    console.log("결과값 카운트 ======================================" + result.length);

                    var clan_name;
                    for (var i = 0; i < result.length; i++) {
                        for (var j = 0; j < result[i].length; j++) {
                            clan_name = result[i][j].name;
                            console.log("찾아낸 클랜 네임       ======================================" + clan_name);
                        }

                    }

                    if (isEmpty(clan_name) === false) {

                        auto_clan_enter_func1(clan_name, 0, (err, data) => {
                            if (err === PACKET_ERR.SUCCESS) {
                                callback(PACKET_ERR.SUCCESS, data);
                            } else if (err === -1) {
                                let _cs = data;
                                auto_clan_enter_func1(_cs, (err1, data1) => {
                                    if (err1 === 0) {} else {
                                        console.log("오토클랜 펑션1 실패 =======================" + data1);
                                        callback(PACKET_ERR.PANCHANGE_AUTO_ENTER_NOT_ENOUGH, data1);
                                    }
                                });
                            } else {
                                callback(PACKET_ERR.PANCHANGE_AUTO_ENTER_NOT_ENOUGH, data);
                            }
                        });
                    } else {
                        let _rdata = {};
                        _rdata.result = PACKET_ERR.PANCHANGE_NOTHIG_CLAN_INFO;

                        callback(PACKET_ERR.COMMON_FAIL, _rdata);
                    }

                }

            });
        }

    });

}

function auto_clan_enter_func1(clan_name1, cursor, callback) {
    const room_list_redis = redis.getPanchangeChannel1();
    room_list_redis.zscan(RLI.KEY1, cursor, (err, res) => {
        if (err) {
            console.log('panchange auto_enter redis err : ' + err);
            callback(PACKET_ERR.PANCHANGE_AUTO_ENTER_REDIS, null);
        } else {
            if (res[1].length <= 0) {
                console.log("오토클랜 펑션1 데이터가 없어요 =======================" + res[1].length);
                console.log('panchange auto_enter redis err : ' + res[1].length);
                let _rdata = {};
                let _data = [];
                let _room_info = {};
                _rdata.result = 2;
                _room_info.my_clan_name = clan_name1;
                if (_data.length <= 0) {
                    _data.push(_room_info);
                }
                _rdata.data = _data;

                callback(PACKET_ERR.PANCHANGE_AUTO_ENTER_REDIS_RES, _rdata);
            } else {
                auto_clan_enter_func2(clan_name1, res[0], res[1], callback);
            }
        }
    });
}

function auto_clan_enter_func2(clan_name2, cursor, room_number, callback) {
    const room_list_redis = redis.getPanchangeChannel1();

    let _loop_length = 0;
    let _search_success = false;
    let _rdata = {};
    let _data = [];

    for (let i = 0; i < room_number.length; i += 2) {
        var _rinfo_key = RLI.KEY2 + '_' + room_number[i]; //
        room_list_redis.hgetall(_rinfo_key, (err1, res1) => {

            if (err1) {} else {
                if (res1 <= 0) {
                    //룸번호 반환      
                    _loop_length += 2;
                    console.log("클랜방 리스트가 없다 ==================================");
                } else {
                    _loop_length += 2;

                    console.log("클랜방 찾고있음 =================================" + res1.clan_name_A + "------" + clan_name2);
                    if ((res1.clan_name_A === clan_name2 || res1.clan_name_B === clan_name2) && res1.is_play === "0") {

                        _rdata.clan_room_number = res1.room_number;


                        _search_success = true;
                        _rdata.result = 0;
                        let _room_info = {};
                        _room_info.room_number = res1.room_number;
                        _room_info.host_name = res1.host_name;
                        _room_info.is_lock = res1.is_lock;
                        _room_info.room_title = res1.room_title;
                        _room_info.play_time = res1.play_time;
                        _room_info.back_ground = res1.back_ground;
                        _room_info.user_max_count = res1.user_max_count;
                        _room_info.current_user_count = res1.current_user_count;
                        _room_info.ip = res1.ip;
                        _room_info.host_name = res1.host_name;
                        _room_info.is_clan = res1.is_clan;
                        _room_info.clan_name_A = res1.clan_name_A;
                        _room_info.clan_name_B = res1.clan_name_B;
                        _room_info.my_clan_name = clan_name2;

                        console.log("클랜방 찾았어요 =================================" + res1.clan_name_A);

                        if (_data.length <= 0) {
                            _data.push(_room_info);
                        }
                        _rdata.data = _data;
                    } else {


                    }

                    //루프 상태 체크
                    if (room_number.length == _loop_length) {
                        if (_search_success) {

                            callback(PACKET_ERR.SUCCESS, _rdata);

                        } else {
                            if (cursor != 0) {
                                callback(-1, cursor);
                            } else {
                                console.log("클랜방 매칭 안됨 =================================" + clan_name2);
                                _rdata.result = 1;
                                let _room_info = {};
                                _room_info.my_clan_name = clan_name2;
                                if (_data.length <= 0) {
                                    _data.push(_room_info);
                                }
                                _rdata.data = _data;

                                callback(PACKET_ERR.SUCCESS, _rdata);
                            }
                        }
                    }

                }


            }


        });
    } //for



};



exports.clan_auto_enter2 = function(clan_name, callback) {
    const room_list_redis = redis.getPanchangeChannel1();
    var tasks = [
        //룸리스트 가져오기
        function(callback1) {
            let _sdata = {};
            let _data = [];
            room_list_redis.zrevrange(RLI.KEY1, 0, -1, (err, res) => {
                if (err) {
                    console.error('clan_auto_enter >> zrevrange....1..err ' + err);
                    callback(PACKET_ERR.PANCHANGE_CREATE_ROOM_CLAN_CHECK_REDIS);
                    return;
                } else {
                    console.log("클랜방 리스트 카운트 ========================" + res);
                    if (res <= 0) {
                        _sdata.result = PACKET_ERR.SUCCESS;
                        _sdata.data = _data;
                        callback1(PACKET_ERR.SUCCESS, _sdata);
                    } else {
                        let _data = [];
                        for (var i = 0; i < res.length; i++) {
                            _data.push(res[i]);
                        }
                        _sdata.result = PACKET_ERR.SUCCESS;
                        _sdata.data = _data;
                        callback1(PACKET_ERR.SUCCESS, _sdata);
                    }
                }
            });
        },
        //클랜방이 존재하는지 체크
        function(data, callback1) {
            let _len = data.data.length;
            let _cntRemain = data.data.length;
            let _data = {};
            _data.my_clan_flag = false;
            _data.first_clan_number = 0;
            let _flag = false;
            let _room_data = [];

            if (_len == 0) {
                _data.result = PACKET_ERR.SUCCESS;
                _data.data = data.data;
                callback1(PACKET_ERR.SUCCESS, _data);

            } else {

                for (var i = 0; i < _len; i++) {
                    let _rn = data.data[i];
                    let _key = RLI.KEY2 + '-' + data.data[i];
                    room_list_redis.hgetall(_key, (err, res) => {
                        if (err) {
                            console.error('clan_auto_enter >> hgetall...2...err ' + err);
                            callback(PACKET_ERR.PANCHANGE_CREATE_ROOM_CLAN_CHECK_REDIS2);
                            return;
                        } else {
                            if (res <= 0) {
                                console.error('clan_auto_enter >> ' + _key + ' ....2...res ' + res);
                                --_cntRemain;
                            } else {
                                --_cntRemain;
                                if (res.is_clan) {
                                    if (!_flag) {

                                        //최초 클랜룸 생성시 clan_B는 null 이다. 그럼으로 체크해야한다. 
                                        if (isEmpty(res.clan_name_B)) {
                                            if (res.clan_name_A === clan_name) {
                                                //같은 클랜을 찾음
                                                console.log('clan name : ' + clan_name);
                                                _data.clan_room_number = _rn;
                                                _data.my_clan_flag = true;
                                                _data.data = data.data;

                                                _flag = true;

                                                console.log("호스트네임=======================" + res.host_name);
                                                let _room_info = {};
                                                _room_info.room_number = res.room_number;
                                                _room_info.host_name = res.host_name;
                                                _room_info.is_lock = res.is_lock;
                                                _room_info.room_title = res.room_title;
                                                _room_info.play_time = res.play_time;
                                                _room_info.back_ground = res.back_ground;
                                                _room_info.user_max_count = res.user_max_count;
                                                _room_info.current_user_count = res.current_user_count;
                                                _room_info.ip = res.ip;
                                                _room_info.host_name = res.host_name;
                                                _room_info.clan_name_A = res.clan_name_A;
                                                _room_info.clan_name_B = res.clan_name_B;

                                                _room_data.push(_room_info);
                                                _data.info = _room_data;
                                            } else {
                                                if (_data.first_clan_number === 0) {
                                                    _data.first_clan_number = _rn;
                                                }
                                            }
                                        } else if (isEmpty(res.clan_name_A)) {

                                            if (res.clan_name_B === clan_name) {
                                                //같은 클랜을 찾음
                                                console.log('clan name : ' + clan_name);
                                                _data.clan_room_number = _rn;
                                                _data.my_clan_flag = true;
                                                _data.data = data.data;
                                                _flag = true;

                                                console.log("호스트네임=======================" + res.host_name);
                                                let _room_info = {};
                                                _room_info.room_number = res.room_number;
                                                _room_info.host_name = res.host_name;
                                                _room_info.is_lock = res.is_lock;
                                                _room_info.room_title = res.room_title;
                                                _room_info.play_time = res.play_time;
                                                _room_info.back_ground = res.back_ground;
                                                _room_info.user_max_count = res.user_max_count;
                                                _room_info.current_user_count = res.current_user_count;
                                                _room_info.ip = res.ip;
                                                _room_info.host_name = res.host_name;
                                                _room_info.clan_name_A = res.clan_name_A;
                                                _room_info.clan_name_B = res.clan_name_B;

                                                _room_data.push(_room_info);
                                                _data.info = _room_data;

                                            } else {
                                                if (_data.first_clan_number === 0) {
                                                    _data.first_clan_number = _rn;
                                                }
                                            }
                                        }

                                    }

                                } //res.is_clan                                 
                            }
                        }
                        if (_cntRemain === 0) {


                            _data.result = PACKET_ERR.SUCCESS;
                            //_data.data = data.data;
                            callback1(PACKET_ERR.SUCCESS, _data);

                        }
                    });
                } //for
            }
        },
        function(data, callback1) {
            let _sdata = {};
            if (data.my_clan_flag) {
                _sdata.clan_room_number = data.clan_room_number;
                _sdata.data = data.data;
            } else {
                _sdata.clan_room_number = data.first_clan_number;
                _sdata.data = data.data;
            }
            callback1(PACKET_ERR.SUCCESS, _sdata);
        }

    ];

    async.waterfall(tasks, (err, data) => {
        callback(err, data);
    });
}

function isEmpty(value) {
    if (value == "" || value == null || value == undefined || (value != null && typeof value == "object" && !Object.keys(value).length)) {
        return true
    } else {
        return false
    }


};

/**
 * 룸번호로 방 찾기
 */
exports.search_room_num = function(room_number, callback) {
    const room_list_redis = redis.getPanchangeChannel1();
    var _rinfo_key = RLI.KEY2 + '-' + room_number; //
    room_list_redis.hgetall(_rinfo_key, (err, res) => {
        if (err) {
            callback(PACKET_ERR.PANCHANGE_SEARCH_ROOM_NUM_REDIS, null);
        } else {
            if (res == null) {
                callback(PACKET_ERR.PANCHANGE_SEARCH_ROOM_NUM_EMPTY, null);
            } else {
                callback(PACKET_ERR.SUCCESS, res);
            }
        }
    });
}

/**
 * 룸의 총 갯수 가져오기
 */
exports.get_total_room_list = function(callback) {
    const room_list_redis = redis.getPanchangeChannel1();
    room_list_redis.zcard(RLI.KEY1, (err, reply) => {
        if (err) {
            callback(PACKET_ERR.PANCHANGE_GET_TOTAL_ROOM_LIST_REDIS, null);
        } else {
            if (reply == null) {
                callback(PACKET_ERR.PANCHANGE_SEARCH_CLAN_ROOM_EMPTY, null);
            }
            callback(PACKET_ERR.SUCCESS, reply);
        }
    });
}

/**
 * 클랜 방 찾기
 */

exports.get_clan_room = function(clan_name, callback) {
    const room_list_redis = redis.getPanchangeChannel1();
    var _rinfo_key = RLI.KEY3 + '-' + clan_name; //
    room_list_redis.hgetall(_rinfo_key, (err, res) => {
        if (err) {
            callback(PACKET_ERR.PANCHANGE_SEARCH_CLAN_ROOM_REDIS);
        } else {
            if (res == null) {
                callback(PACKET_ERR.PANCHANGE_SEARCH_CLAN_ROOM_EMPTY);
            } else {
                var _rinfo_key2 = RLI.KEY2 + '-' + res.room_number; //
                room_list_redis.hgetall(_rinfo_key2, (err1, res1) => {
                    if (err1) {
                        callback(PACKET_ERR.PANCHANGE_SEARCH_CLAN_ROOM_EMPTY2);
                    } else {
                        if (res1 === null) {
                            callback();
                        } else {
                            callback(PACKET_ERR.SUCCESS, res1);
                        }
                    }
                });
            }
        }
    });
}


/**
 * 닉네임으로 방찾기
 */
exports.search_host_name = function(nick_name, callback) {
    const room_list_redis = redis.getPanchangeChannel1();
    var tasks = [
        function(callback1) {
            var _key = RLI.KEY5 + "-" + nick_name;
            room_list_redis.hgetall(_key, (err, res) => {
                var _data = {};
                if (err) {
                    console.error('search_host_name >> ...key ' + _key + '..1..err ' + err);
                    callback(PACKET_ERR.PANCHANGE_SEARCH_NICK_NAME_REDIS1, null);
                    return;
                } else {
                    if (res === null) {
                        console.error('search_host_name >> ...key ' + _key + '..1..res ' + res);
                        callback(PACKET_ERR.PANCHANGE_SEARCH_NICK_NAME_REDIS1_RES, null);
                        return;
                    } else {
                        _data.result = 0;
                        _data.room_number = res.room_number;
                        callback1(PACKET_ERR.SUCCESS, _data);
                    }
                }

            });
        },
        function(data, callback1) {
            var _data = {}
            var _key = RLI.KEY2 + '-' + data.room_number; //
            room_list_redis.hgetall(_key, (err, res) => {
                if (err) {
                    console.error('search_host_name >> ...key ' + _key + '..2..err ' + err);
                    callback(PACKET_ERR.PANCHANGE_SEARCH_NICK_NAME_REDIS2, null);
                    return;
                } else {
                    if (res === null) {
                        console.error('search_host_name >> ...key ' + _key + '..2..res ' + res);
                        callback(PACKET_ERR.PANCHANGE_SEARCH_NICK_NAME_REDIS2_RES, null);
                        return;
                    } else {
                        _data.result = 0;
                        _data.room_number = res.room_number;
                        _data.host_name = res.host_name;
                        _data.is_lock = res.is_lock;
                        _data.room_title = res.room_title;
                        _data.ip = res.ip;
                        _data.play_time = res.play_titme;
                        _data.back_ground = res.back_ground;
                        _data.clan_name_A = res.clan_name_A;
                        _data.clan_name_B = res.clan_name_B;
                        _data.is_clan = res.is_clan;
                        _data.user_max_count = res.user_max_count;
                        _data.current_user_count = res.current_user_count;
                        callback1(PACKET_ERR.SUCCESS, _data);
                    }

                }
            });

        }
    ];

    async.waterfall(tasks, (err, data) => {
        callback(err, data);
    });
}


exports.get_user_count = function(room_number, callback) {

    const room_list_redis = redis.getPanchangeChannel1();
    var _rinfo_key = RLI.KEY2 + '-' + room_number; //
    let _data = {};
    room_list_redis.hgetall(_rinfo_key, (err, res) => {
        if (err) {
            callback(PACKET_ERR.PANCHANGE_REQUEST_USER_COUNT_REDIS, null);
        } else {
            if (res <= 0) {
                callback(PACKET_ERR.PANCHANGE_REQUEST_USER_COUNT_REDIS, null);
            } else {
                _data.result = PACKET_ERR.SUCCESS;
                _data.room_number = res.room_number;
                _data.host_name = res.host_name;
                _data.is_lock = res.is_lock;
                _data.room_title = res.room_title;
                _data.ip = res.ip;
                _data.play_time = res.play_titme;
                _data.back_ground = res.back_ground;
                _data.clan_name_A = res.clan_name_A;
                _data.clan_name_B = res.clan_name_B;
                _data.is_clan = res.is_clan;
                _data.user_max_count = res.user_max_count;
                _data.current_user_count = res.current_user_count;
                callback(PACKET_ERR.SUCCESS, _data);
            }

        }
    });
}

exports.read_result = function(uuid, callback) {
    let _rdata = {};
    let _info = {};
    let _data = [];

    console.log(" 판뒤집기 게임 결과 불러옵니다============================== 1");
    mysql.getGameWrite().getConnection((err, con) => {

        if (err) {
            con.release();
            console.error('panchange read_result >> getConnection error (mysql err)!!!' + err);
            callback(PACKET_ERR.PANCHANGE_READ_RESULT_MYSQL, null);
        } else {
            let _query = 'SELECT SUM(Win) as Win, SUM(Lose) as Lose, SUM(Draw) as Draw  FROM GameDB.TbPanChange WHERE UUID=?';
            con.query(_query, [uuid], (err1, result, fields) => {
                con.release();
                if (err1) {
                    console.error('panchange read_result >> query error (mysql err)!!!' + err1);
                    callback(PACKET_ERR.PANCHANGE_READ_RESULT_MYSQL_RES, null);
                } else {
                    if (result.length <= 0) {
                        //console.error('panchange read_result >> query res !!!'+result.length);
                        //callback(PACKET_ERR.PANCHANGE_READ_RESULT_MYSQL_RES,null);
                        _rdata.result = PACKET_ERR.SUCCESS;
                        _info.uuid = uuid
                        _info.win = 0;
                        _info.lose = 0;
                        _info.draw = 0;
                        _data.push(_info);
                        _rdata.data = _data;
                        callback(PACKET_ERR.SUCCESS, _rdata);
                    } else {

                        let _data = [];

                        _rdata.result = PACKET_ERR.SUCCESS;
                        _info.uuid = result[0].UUID;
                        _info.win = result[0].Win;
                        _info.lose = result[0].Lose;
                        _info.draw = result[0].Draw;

                        console.log(" 판뒤집기 게임 결과 불러옵니다============================== 승점" + _info.win);
                        console.log(" 판뒤집기 게임 결과 불러옵니다============================== 승점" + _info.lose);
                        console.log(" 판뒤집기 게임 결과 불러옵니다============================== 승점" + _info.draw);

                        _data.push(_info);
                        _rdata.data = _data;
                        callback(PACKET_ERR.SUCCESS, _rdata);
                    }
                }
            });
        }

    });
}

exports.request_total_room_list = function(callback) {
    const room_list_redis = redis.getPanchangeChannel1();

    console.log("*************************request_total_room_list*****************************")

    room_list_redis.zrange(RLI.KEY1, 0, -1, (err, res) => {
        if (err) {
            console.error('request_total_room_list >> zrange err ' + err);
            callback(PACKET_ERR.REQUEST_TOTAL_ROOM_LIST_REDIS, null);
        } else {
            if (res <= 0) {
                console.error('request_total_room_list >> zrange res ' + res);
                callback(PACKET_ERR.REQUEST_TOTAL_ROOM_LIST_REDIS_RES, null);
            } else {
                let _data = [];
                let _rdata = {};
                _rdata.result = PACKET_ERR.SUCCESS;
                for (var i = 0; i < res.length; i++) {
                    _data.push(res[i]);
                }
                _rdata.data = _data;
                console.log("---------------data------------------", _rdata)
                callback(PACKET_ERR.SUCCESS, _rdata);
            }
        }
    });
}


exports.request_ranking = function(page, callback) {
    const ranking_redis = redis.getWeekRankingRedis();
    if (page <= 0) {
        callback();
    } else {
        let _cp = page - 1;
        let _from = _cp * MAX_RANKING_PAGE_LIST;
        let _to = _from + (MAX_RANKING_PAGE_LIST - 1);


        ranking_redis.zrevrange(RANKINFO.KEY2, _from, _to, 'WITHSCORES', (err, res) => {
            if (err) {
                console.error('setcoin request_ranking >> zrevrange ...error ' + err);
            } else {
                let _len = res.length;
                if (_len <= 0) {
                    console.error('setcoin request_ranking >> res ...error ' + res);
                } else {
                    let _rdata = {};
                    let _data = [];
                    for (var i = 0; i < _len; i = i + 2) {
                        let _info = {};
                        _info.nick_name = res[i];
                        _info.score = res[i + 1];
                        _data.push(_info);
                    }
                    _rdata.result = PACKET_ERR.SUCCESS;
                    _rdata.data = _data;

                    callback(PACKET_ERR.SUCCESS, _rdata);
                }
            }
        });


    }
}