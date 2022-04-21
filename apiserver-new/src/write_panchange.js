const redis = require('./redis');
const RLI = require('../config/redis.json')[process.env.NODE_ENV || 'development'].PANCHANGE_ROOM_CHANNEL_1;
const TIME = require('../common/time');
const RESULT_STATE = require('./def').RESULT_STATE;
const PACKET_ERR = require('./packet_err').PACKET_ERR;
const write_log = require('./write_log').write_log;
const async = require('async');
const mysql = require('./mysql');
const getRankTable = require('../common/util').getRankTable;
const getWeekOfMonth = require('../common/util').getWeekOfMonth;
const filter = require('../common/util').filter_response;
const isEmpty = require('../common/util').isEmpty;
const word_pool = require('../common/global_array');
/**
 * 방생성
 * @param {* 룸넘버} room_number 
 * @param {* 호스트이름} host_name 
 * @param {* 룸 제목} room_title 
 * @param {* 클랜방 여부} is_clan 
 * @param {* 클랜이름} clan_name 
 * @param {* 비번방여부} is_lock 
 * @param {* 서버 아이피} ip 
 * @param {* 플레이타임} play_time 
 * @param {* 배경화면} back_ground 
 * @param {* 플레이 인원} user_count 
 * @param {* 플레이 중인지 체크} is_play 
 * @param {* 콜백함수} callback 
 */
function panchage_write_room(room_number, host_name, room_title, is_clan, clan_name_A, clan_name_B, is_lock, ip, play_time, back_ground, user_max_count, callback) {

    console.log('panchange write room....1');
    console.log("방만들기 바디 정보 =============================룸넘버" + room_number);
    console.log("방만들기 바디 정보 =============================host_name" + host_name);
    console.log("방만들기 바디 정보 =============================room_title" + room_title);
    console.log("방만들기 바디 정보 =============================is_clan" + is_clan);
    console.log("방만들기 바디 정보 =============================clan_name_A" + clan_name_A);
    console.log("방만들기 바디 정보 =============================clan_name_B" + clan_name_B);
    console.log("방만들기 바디 정보 =============================is_lock" + is_lock);
    console.log("방만들기 바디 정보 =============================ip" + ip);
    console.log("방만들기 바디 정보 =============================play_time" + play_time);
    console.log("방만들기 바디 정보 =============================back_ground" + back_ground);
    console.log("방만들기 바디 정보 =============================user_max_count" + user_max_count);


    var async = require('async');

    async.waterfall([

            function(callback1) {
                var bad_word_check=word_pool.check(room_title);
                // console.log("비속어 체그 해봅니다 =========================================="+filter(room_title));
                console.log("비속어 체그 해봅니다 ==========================================" + word_pool.length);
                console.log("비속어 체그 해봅니다 ==========================================" + bad_word_check.isFound);

                if (bad_word_check.isFound) {
                    var err = PACKET_ERR.CHECK_PROHIBIT_WORDS_NO_WORDS;
                    //   console.log("욕방이다아============================================"+err);
                    callback(err);
                    return;
                } else {
                    //  console.log("욕방이다아 를 넘어갔다============================================");
                    callback1(null);
                }
            },

            function(callback1) {

                if (is_clan) {
                    //  console.log("욕방이다아 를 넘어갔고 방만들기 실제 들어옴 클랜!============================================");
                    clan_create_room(room_number, host_name, room_title, is_clan, clan_name_A, clan_name_B, is_lock, ip, play_time, back_ground, user_max_count, (err) => {
                        callback1(err);
                        return;
                    });
                } else {
                    //  console.log("욕방이다아 를 넘어갔고 방만들기 실제 들어옴 노클랜!============================================");
                    no_clan_create_room(room_number, host_name, room_title, is_clan, is_lock, ip, play_time, back_ground, user_max_count, (err) => {
                        callback1(err);
                        return;
                    });
                }

            }
        ], function(err) {
            // console.log("마지막 들어옴~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~"+err);
            callback(err);
        }

    );
}

function no_clan_create_room(room_number, host_name, room_title, is_clan, is_lock, ip, play_time, back_ground, user_max_count, callback) {
    console.log('no_clan.........');
    const room_list_redis = redis.getPanchangeChannel1();
    var _room_num = {};
    _room_num.host_name = host_name;
    //_room_num._create_time  = TIME.getTime();
    let _ct = TIME.getTime();

    //오름차순으로 저장한다.
    room_list_redis.zadd(RLI.KEY1, _ct, room_number, (err, res) => {
        if (err) {
            callback(PACKET_ERR.PANCHANGE_CREATE_ROOM_NO_CLAN_REDIS);
        } else {
            //방장닉네임 키로 방번호 저장한다.         
            var _host = {};
            _host.room_number = room_number;
            var _key = RLI.KEY5 + "-" + host_name;
            room_list_redis.hmset(_key, _host, (err1, res1) => {
                if (err1) {
                    callback(PACKET_ERR.PANCHANGE_CREATE_ROOM_NO_CLAN_REDIS);
                } else {
                    if (res1 != 'OK') {
                        callback(PACKET_ERR.PANCHANGE_CREATE_ROOM_NO_CLAN_REDIS1_RES);
                    } else {
                        //룸 전체 정보를 저장한다
                        var _rinfo_key = RLI.KEY2 + '-' + room_number; //
                        var _ri = {};
                        _ri.room_number = room_number;
                        _ri.host_name = host_name;
                        _ri.is_lock = is_lock;
                        _ri.room_title = room_title;
                        _ri.ip = ip;
                        _ri.play_time = play_time;
                        _ri.back_ground = back_ground;
                        _ri.clan_name_A = "",
                            _ri.clan_name_B = "",
                            _ri.is_clan = is_clan;
                        _ri.user_max_count = user_max_count;
                        _ri.current_user_count = 0;
                        _ri.is_play = 0;
                        room_list_redis.hmset(_rinfo_key, _ri, (err2, res2) => {
                            if (err2) {
                                callback(PACKET_ERR.PANCHANGE_CREATE_ROOM_NO_CLAN_REDIS2);
                            } else {
                                if (res2 != 'OK') {
                                    callback(PACKET_ERR.PANCHANGE_CREATE_ROOM_NO_CLAN_REDIS2_RES);
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
}

function clan_create_room(room_number, host_name, room_title, is_clan, clan_name_A, clan_name_B, is_lock, ip, play_time, back_ground, user_max_count, callback) {
    console.log('clan.....');
    const room_list_redis = redis.getPanchangeChannel1();
    var _room_num = {};
    _room_num.host_name = host_name;
    //_room_num._create_time  = TIME.getTime();
    let _ct = TIME.getTime();

    //클랜방이 존재하는지 체크

    var tasks = [
        //룸리스트 가져온다.
        function(callback1) {
            let _sdata = {};
            let _data = [];
            room_list_redis.zrevrange(RLI.KEY1, 0, -1, (err, res) => {
                if (err) {
                    //_sdata.result = PACKET_ERR.PANCHANGE_CREATE_ROOM_CLAN_CHECK_REDIS;         
                    console.error('clan_create_room >> zrevrange....1..err ' + err);
                    callback(PACKET_ERR.PANCHANGE_CREATE_ROOM_CLAN_CHECK_REDIS);
                    return;
                } else {
                    if (res <= 0) {
                        //console.error('clan_create_room >> ..1...res '+res);
                        //_sdata.result = PACKET_ERR.PANCHANGE_CREATE_ROOM_CLAN_CHECK_REDIS_RES;
                        //callback(PACKET_ERR.PANCHANGE_CREATE_ROOM_CLAN_CHECK_REDIS_RES);
                        _sdata.result = PACKET_ERR.SUCCESS;
                        _sdata.data = _data;
                        callback1(PACKET_ERR.SUCCESS, _sdata);
                    } else {
                        let _data = [];
                        for (var i = 0; i < res.length; i++) {
                            if (room_number == res[i]) {
                                _sdata.result = PACKET_ERR.PANCHANGE_CREATE_ROOM_CLAN_CHECK_ROOM_NUMBER;
                                callback(PACKET_ERR.PANCHANGE_CREATE_ROOM_CLAN_CHECK_ROOM_NUMBER, _sdata);
                                return;
                            }
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

            if (_len == 0) {
                _data.result = PACKET_ERR.SUCCESS;
                _data.data = data.data;
                callback1(PACKET_ERR.SUCCESS, _data);
            } else {

                for (var i = 0; i < _len; i++) {
                    let _key = RLI.KEY2 + '-' + data.data[i];
                    room_list_redis.hgetall(_key, (err, res) => {
                        if (err) {
                            console.error('clan_create_room >> hgetall...2...err ' + err);
                            callback(PACKET_ERR.PANCHANGE_CREATE_ROOM_CLAN_CHECK_REDIS2);
                            return;
                        } else {
                            if (res <= 0) {
                                console.error('clan_create_room >> ' + _key + ' ....2...res ' + res);
                                --_cntRemain;
                            } else {
                                --_cntRemain;
                                if (res.is_clan) { // 받은 룸정보의 클랜A와 클랜B에 내 클랜이 있는지 체크합니다.

                                    if (isEmpty(res.clan_name_B)) {

                                        if (res.clan_name_B === clan_name_A) {
                                            callback(PACKET_ERR.PANCHANGE_CREATE_ROOM_CLAN_CHECK_CLAN);
                                            return;
                                        }

                                    } else if (isEmpty(res.clan_name_A)) {

                                        if (res.clan_name_A === clan_name_A) {
                                            callback(PACKET_ERR.PANCHANGE_CREATE_ROOM_CLAN_CHECK_CLAN);
                                            return;
                                        }

                                    }
                                    console.log("클랜찾아도 없었음 ========================================");
                                }
                            }
                        }
                        if (_cntRemain === 0) {

                            _data.result = PACKET_ERR.SUCCESS;
                            _data.data = data.data;
                            callback1(PACKET_ERR.SUCCESS, _data);
                        }
                    });
                } //for

            }


        },
        //방번호 저장하기
        function(data, callback1) {
            //오름 차순으로 저장
            room_list_redis.zadd(RLI.KEY1, _ct, room_number, (err, res) => {
                if (err) {
                    console.error('clan_create_room >>..zadd.3.. err ' + err);
                    callback(PACKET_ERR.PANCHANGE_CREATE_ROOM_CLAN_REDIS);
                    return;
                } else {
                    if (res < 0) {
                        console.error('clan_create_room >>..res.3.. err ' + res);
                        callback(PACKET_ERR.PANCHANGE_CREATE_ROOM_CLAN_REDIS_RES);
                        return;
                    } else {
                        callback1(PACKET_ERR.SUCCESS, null);
                    }
                }
            });
        },
        //방장 정보 저장
        function(data, callback1) {
            //방장닉네임 키로 방번호 저장한다.         
            var _host = {};
            _host.room_number = room_number;
            var _key = RLI.KEY5 + "-" + host_name;
            room_list_redis.hmset(_key, _host, (err, res) => {
                if (err) {
                    console.error('clan_create_room >> hmset...4..error ' + err + ' key : ' + _key);
                    callback(PACKET_ERR.PANCHANGE_CREATE_ROOM_CLAN_REDIS1);
                    return;
                } else {
                    if (res != 'OK') {
                        console.error('clan_create_room >> hmset.4...hmset not ok.res ' + res);
                        callback(PACKET_ERR.PANCHANGE_CREATE_ROOM_CLAN_REDIS1_RES1);
                        return;
                    } else {
                        callback1(PACKET_ERR.SUCCESS, null);
                    }
                }
            });
        },
        //클랜 정보 저장
        function(data, callback1) {
            var _clan_name = {};
            _clan_name.room_number = room_number;
            var _key3 = RLI.KEY3 + "-" + clan_name_A;
            room_list_redis.hmset(_key3, _clan_name, (err, res) => {
                if (err) {
                    console.error('clan_create_room >> hmset 5 error ' + err + ' key : ' + _key3);
                    callback(PACKET_ERR.PANCHANGE_CREATE_ROOM_CLAN_REDIS2);
                    return;
                } else {
                    if (res != 'OK') {
                        console.error('clan_create_room >> hmset.5...hmset not ok.res ' + res);
                        callback(PACKET_ERR.PANCHANGE_CREATE_ROOM_CLAN_REDIS2_RES2);
                        return;
                    } else {
                        callback1(PACKET_ERR.SUCCESS, null);
                    }
                }
            });
        },
        //룸정보 저장
        function(data, callback1) {
            //룸 전체 정보를 저장한다
            var _rinfo_key = RLI.KEY2 + '-' + room_number; //
            var _ri = {};
            _ri.room_number = room_number;
            _ri.host_name = host_name;
            _ri.is_lock = is_lock;
            _ri.room_title = room_title;
            _ri.ip = ip;
            _ri.play_time = play_time;
            _ri.back_ground = back_ground;
            _ri.clan_name_A = clan_name_A, //처음 생성한것이니 생성 요청 클랜이 A클랜 '호스트'가 된다.
                _ri.clan_name_B = ""; //비엇으니 "" 블랭크로 셋팅
            _ri.is_clan = is_clan;
            _ri.user_max_count = user_max_count;
            _ri.current_user_count = 0;
            _ri.is_battle_clan = false;
            _ri.battle_clan_name = "";
            _ri.is_play = 0;
            room_list_redis.hmset(_rinfo_key, _ri, (err, res) => {
                if (err) {
                    console.error('clan_create_room >> hmset..6.error ' + err + ' key : ' + _rinfo_key);
                    callback(PACKET_ERR.PANCHANGE_CREATE_ROOM_CLAN_REDIS3);
                    return;
                } else {
                    if (res != 'OK') {
                        console.error('clan_create_room >> hmset.6...hmset not ok.res ' + res);
                        callback(PACKET_ERR.PANCHANGE_CREATE_ROOM_CLAN_REDIS3_RES);
                        return;
                    } else {
                        callback1(PACKET_ERR.SUCCESS, null);
                    }
                }
            });
        }

    ];

    async.waterfall(tasks, (err, data) => {
        callback(err, data);
    });



    /*
        //오름차순으로 저장한다.
        room_list_redis.zadd(RLI.KEY1,_ct,room_number,(err,res)=>{
            if(err){                               
    	        console.error('clan_create_room >>  err '+err);
                callback(PACKET_ERR.PANCHANGE_CREATE_ROOM_CLAN_REDIS);
            }else{               
                if( res < 0){               
    		        console.error('zadd.....'+res+' ct : '+_ct+' redis : '+JSON.stringify(room_list_redis)+' key : ' + RLI.KEY1); 
                    callback(PACKET_ERR.PANCHANGE_CREATE_ROOM_CLAN_REDIS_RES);                
                }else{
                    //방장닉네임 키로 방번호 저장한다.         
                    var _host = {};
                    _host.room_number = room_number;
                    var _key = RLI.KEY2+"-"+host_name;
                    room_list_redis.hmset(_key,_host,(err1,res1)=>{
                        if(err1){             
    			            console.error('clan_create_room >> hmset 1 error '+err1+' key : '+_key);
                            callback(PACKET_ERR.PANCHANGE_CREATE_ROOM_CLAN_REDIS1);                        
                        }else{
                            if( res1 != 'OK'){                                             
    			                console.error('clan_create_room >> hmset....hmset not ok.res '+res1);
                                callback(PACKET_ERR.PANCHANGE_CREATE_ROOM_CLAN_REDIS1_RES1);                            
                            }else{
                                var _clan_name = {};
                                _clan_name.room_number = room_number;
                                var _key3 = RLI.KEY3+"-"+clan_name;
                                room_list_redis.hmset(_key3,_clan_name,(err2,res2)=>{
                                    if(err2){         
                                        console.error('clan_create_room >> hmset 2 error '+err2+' key : '+_key3);
                                        callback(PACKET_ERR.PANCHANGE_CREATE_ROOM_CLAN_REDIS2);              
                                    }else{ 
                                        if( res2 != 'OK'){        
                                            console.error('clan_create_room >> hmset.2...hmset not ok.res '+res2);    
                                            callback(PACKET_ERR.PANCHANGE_CREATE_ROOM_CLAN_REDIS2_RES2);              
                                        }else{
                                            //룸 전체 정보를 저장한다
                                            var _rinfo_key = RLI.KEY2+'-'+room_number; //
                                            var _ri={};
                                            _ri.room_number         =   room_number;
                                            _ri.host_name           =   host_name;
                                            _ri.is_lock             =   is_lock;                    
                                            _ri.room_title          =   room_title;
                                            _ri.ip                  =   ip;
                                            _ri.play_time           =   play_time;
                                            _ri.back_ground         =   back_ground;
                                            _ri.clan_name           =   clan_name,
                                            _ri.is_clan             =   is_clan;
                                            _ri.user_max_count      =   user_max_count;
                                            _ri.current_user_count  = 0;
                                            _ri.is_battle_clan      = false;
                                            _ri.battle_clan_name    = "";
                                            room_list_redis.hmset(_rinfo_key,_ri,(err3,res3)=>{
                                                if(err3){          
                                                    console.error('clan_create_room >> hmset 3 error '+err3+' key : '+_rinfo_key);       
                                                    callback(PACKET_ERR.PANCHANGE_CREATE_ROOM_CLAN_REDIS3);  
                                                }else{
                                                    if(res3 != 'OK'){          
                                                        console.error('clan_create_room >> hmset.3...hmset not ok.res '+res3);                                        
                                                        callback(PACKET_ERR.PANCHANGE_CREATE_ROOM_CLAN_REDIS3_RES);                                                      
                                                    }else{
                                                        callback(PACKET_ERR.SUCCESS);                                                      
                                                    }
                                                }
                                            });
                                        }           
                                    }
                                });
                            }
                        }
                    });
                }  
            }
        });       */
}

const getRedis_Pan = require('./redis_util').getRedis_Pan;

function request_room_list_flush(channel, callback) {



    var task = [

        function(callback1) {

            console.log("판뒤집기 지우기 ===================================");

            const room_list_redis = getRedis_Pan(channel);

            room_list_redis.flushdb((err, succeeded) => {
                if (err) {
                    console.error('PanChange_flush_redis_ch redis1....' + err);
                    callback(PACKET_ERR.CREATE_ROOM_REDIS);
                } else {
                    redis.on_create();
                    redis.on_select();
                    redis.on_error();
                    redis.on_connect();
                    callback1();
                }

            });
        },

        function(callback1) {
            redis.on_ready_PanChange_redis_ch1();
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

/* 2020-1-20 판뒤집기 방의 플레이중인지 상태정보는 API에 추가합니다. */
function set_play_game(room_number, callback) {
    const room_list_redis = redis.getPanchangeChannel1();
    var _rinfo_key = RLI.KEY2 + '-' + room_number; //
    var _ri = {};

    _ri.is_play = 1;

    room_list_redis.hmset(_rinfo_key, _ri, (err, res) => {
        if (err) {
            console.error('change_room_option >> err ' + err);
            callback(PACKET_ERR.PANCHANGE_CHANGE_IS_PLAY_REDIS);
            return;
        } else {
            if (res <= 0) {
                console.error('change_room_option >> res : ' + res);
                callback(PACKET_ERR.PANCHANGE_CHANGE_IS_PLAY_REDIS_RES);
                return;
            }
            callback(PACKET_ERR.SUCCESS);
        }

    });
}
/* 2020-1-20 판뒤집기 방의 플레이중인지 상태정보는 API에 추가합니다. */
function set_play_game_not(room_number, callback) {
    const room_list_redis = redis.getPanchangeChannel1();
    var _rinfo_key = RLI.KEY2 + '-' + room_number; //
    var _ri = {};

    _ri.is_play = 0;

    room_list_redis.hmset(_rinfo_key, _ri, (err, res) => {
        if (err) {
            console.error('change_room_option >> err ' + err);
            callback(PACKET_ERR.PANCHANGE_CHANGE_IS_PLAY_REDIS);
            return;
        } else {
            if (res <= 0) {
                console.error('change_room_option >> res : ' + res);
                callback(PACKET_ERR.PANCHANGE_CHANGE_IS_PLAY_REDIS_RES);
                return;
            }
            callback(PACKET_ERR.SUCCESS);
        }

    });
}
/**
 * 판뒤집기 룸옵션
 * @param {*} room_title 
 * @param {*} play_time 
 */
function change_room_option(room_number, is_lock, play_time, back_ground, callback) {
    const room_list_redis = redis.getPanchangeChannel1();
    var _rinfo_key = RLI.KEY2 + '-' + room_number; //
    var _ri = {};

    _ri.is_lock = is_lock;
    _ri.play_time = play_time;
    _ri.back_ground = back_ground;

    console.log("룸넘버 = " + room_number);
    console.log("키값 = " + _rinfo_key);

    room_list_redis.hmset(_rinfo_key, _ri, (err, res) => {
        if (err) {
            console.error('change_room_option >> err ' + err);
            callback(PACKET_ERR.PANCHANGE_CHANGE_ROOM_OPTION_REDIS);
            return;
        } else {
            if (res <= 0) {
                console.error('change_room_option >> res : ' + res);
                callback(PACKET_ERR.PANCHANGE_CHANGE_ROOM_OPTION_REDIS_RES);
                return;
            }
            callback(PACKET_ERR.SUCCESS);
        }

    });
}


const PANCHANGE_ROOM_NUMBER = require('../config/redis.json')[process.env.NODE_ENV || 'development'].PANCHANGE_ROOM_NUMBER;
/**
 * 룸번호 반환하기
 * @param {*룸번호} room_number 
 * @param {*콜백함수} callback 
 */
function return_room_number(room_number, callback) {
    const panchange_room_number_redis = redis.getPanchangeChannel1();
    panchange_room_number_redis.lpush(RLI.KEY4, room_number, (err, reply) => {
        if (err) {
            callback(PACKET_ERR.PANCHANGE_RETURN_ROOM_NUMBER_REDIS);
        } else {
            if (reply <= 0) {
                callback(PACKET_ERR.PANCHANGE_RETURN_ROOM_NUMBER_REDIS_WRITE);
            } else {
                callback(PACKET_ERR.SUCCESS);
            }
        }
    });
}

/**
 * 클랜B 네이밍 업데이트 
 */
function update_clan_B_name(room_number, clan_name_B, callback) {
    const room_list_redis = redis.getPanchangeChannel1();


    var _rinfo_key = RLI.KEY2 + '-' + room_number; //
    var _ri = {};
    console.log("클랜 B =======================================" + clan_name_B);

    _ri.clan_name_B = clan_name_B;
    room_list_redis.hmset(_rinfo_key, _ri, (err, res) => {
        if (err) {
            callback(PACKET_ERR.PANCHANGE_UPDATE_USER_COUNT_REDIS);
        } else {
            if (res != 'OK') {
                callback(PACKET_ERR.PANCHANGE_UPDATE_USER_COUNT_REDIS_RES);
            } else {
                callback(PACKET_ERR.SUCCESS);
            }
        }
    });


    /*   if(isEmpty(clan_name_A))
    {
        var _rinfo_key = RLI.KEY2+'-'+room_number; //
        var _ri={};       
        _ri.clan_name_B = clan_name_B;
        room_list_redis.hmset(_rinfo_key,_ri,(err,res)=>{
            if(err){                                                
                callback(PACKET_ERR.PANCHANGE_UPDATE_USER_COUNT_REDIS);  
            }else{
                if(res != 'OK'){                                                    
                    callback(PACKET_ERR.PANCHANGE_UPDATE_USER_COUNT_REDIS_RES);                                                      
                }else{
                    callback(PACKET_ERR.SUCCESS);                                                      
                }
            }
        });    
    }else{
        var _rinfo_key = RLI.KEY2+'-'+room_number; //
        var _ri={};       
        _ri.clan_name_A = clan_name_A;
        room_list_redis.hmset(_rinfo_key,_ri,(err,res)=>{
            if(err){                                                
                callback(PACKET_ERR.PANCHANGE_UPDATE_USER_COUNT_REDIS);  
            }else{
                if(res != 'OK'){                                                    
                    callback(PACKET_ERR.PANCHANGE_UPDATE_USER_COUNT_REDIS_RES);                                                      
                }else{
                    callback(PACKET_ERR.SUCCESS);                                                      
                }
            }
        });    
    }
 */
    /*  var _rinfo_key = RLI.KEY2+'-'+room_number; //
     var _ri={};       
     _ri.clan_name_B = clan_name;
     room_list_redis.hmset(_rinfo_key,_ri,(err,res)=>{
         if(err){                                                
             callback(PACKET_ERR.PANCHANGE_UPDATE_USER_COUNT_REDIS);  
         }else{
             if(res != 'OK'){                                                    
                 callback(PACKET_ERR.PANCHANGE_UPDATE_USER_COUNT_REDIS_RES);                                                      
             }else{
                 callback(PACKET_ERR.SUCCESS);                                                      
             }
         }
     });     */
}


/**
 * 현재 방 유저 증가 시키기
 */
function update_user_count(room_number, user_count, callback) {
    const room_list_redis = redis.getPanchangeChannel1();

    var _rinfo_key = RLI.KEY2 + '-' + room_number; //
    var _ri = {};
    _ri.current_user_count = user_count;
    room_list_redis.hmset(_rinfo_key, _ri, (err, res) => {
        if (err) {
            callback(PACKET_ERR.PANCHANGE_UPDATE_USER_COUNT_REDIS);
        } else {
            if (res != 'OK') {
                callback(PACKET_ERR.PANCHANGE_UPDATE_USER_COUNT_REDIS_RES);
            } else {
                callback(PACKET_ERR.SUCCESS);
            }
        }
    });
}


function isEmpty2(value) {
    if (value == "" || value == null || value == undefined || (value != null && typeof value == "object" && !Object.keys(value).length)) {
        return true
    } else {
        return false
    }


};

const Check_isGuest = require('../common/util').Check_isGuest;

function start_end_game_log(msg_idx, uuid, nick_name,
    game_code, game_mode,
    my_team, blue_team_count, red_team_count,
    blue_end_team_count, red_end_team_count,
    finish_mode, win_lose_mode,
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
                    if (res.length <= 0) {
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

            if (isEmpty2(os) === true) {
                os = -1;
            }
            if (isEmpty2(bw) === true) {
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
                    let _query = 'call InserGamePan(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)'

                    con.query(_query, [uuid,
                        nick_name, os, bw,
                        game_code, win_lose_mode, finish_mode,
                        play_time, _is_result, //게임시작시간이 클라에서 안날라옵니다. 원래 없는듯 Nan 일단 0으로 셋팅
                        _is_login, game_start_time, game_end_time, red_end_team_count, blue_end_team_count, my_team
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

/**
 * 판뒤집기 게임 시작 로그 남기기
 */
/**
 * 
 * @param 로그 인덱스 msg_idx 
 * @param uuid uuid 
 * @param 닉네임 nick_name 
 * @param 게임코드 game_code 
 * @param 게임모드 game_mode 1: 자유대전, 2:클랜전
 * @param 나의 팀 my_team 1:청팀, 2:홍팀
 * @param 청팀 참여자수 blue_team_count 
 * @param 홍팀 참여자수 red_team_count  
 * @param 청팀 종료시 참여자수 blue_end_team_count 
 * @param 홍팀 종료시 참여자수 red_end_team_count  홍팀 종료시 참여자수
 * @param 정상종료 여부 finish_mode     1:정상종료, 2:상대편 전원 아웃, 3:나의 아웃
 * @param 승패 여부 win_lose_mode  1: 승, 2: 패, 3: 무
 * @param 게임시작 시간 game_start_time 
 * @param 게임종료시간game_end_time 
 * @param 콜백 callback 
 */
/* function start_end_game_log(msg_idx,uuid,nick_name,
                            game_code,game_mode,
                            my_team,blue_team_count,red_team_count,
                            blue_end_team_count,red_end_team_count,
                            finish_mode,win_lose_mode,
                            game_start_time,game_end_time,callback){

    write_log(msg_idx,uuid,nick_name,
        "","","","","","","","","","","","","","","","","","","","",
        game_code,game_mode,my_team,blue_team_count,red_team_count,blue_end_team_count,red_end_team_count,finish_mode,win_lose_mode,0,0,0,0,0,0,0,0,0,0,0,
        0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
        game_start_time,game_end_time,null,null,null,null,null,null,null,null,(err)=>{
            callback(err);
        });
}
 */
// function update_user_count(room_number,count,callback){
//     const room_list_redis      = redis.getPanchangeRoomListRedis();   

//     var _rinfo_key = RLI.KEY2+'-'+room_number; //
//     var _ri={};       
//     _ri.current_user_count = count;
//     room_list_redis.hmset(_rinfo_key,_ri,(err,res)=>{
//         if(err){                                                
//             callback(PACKET_ERR.PANCHANGE_UPDATE_USER_COUNT_REDIS);  
//         }else{
//             if(res != 'OK'){                                                    
//                 callback(PACKET_ERR.PANCHANGE_UPDATE_USER_COUNT_REDIS_RES);                                                      
//             }else{
//                 callback(PACKET_ERR.SUCCESS);                                                      
//             }
//         }
//     });    
// }

const RANKING = require('../config/redis.json')[process.env.NODE_ENV || 'development'].RANKING_REDIS;
/**
 * @param 닉네임 nick_name
 * @param 랭킹 스코어 win
 * 판뒤집기 랭킹
 */
function update_ranking(uuid, nick_name, win, state, callback) {
    console.log('panchange update_ranking 업데이트 =============================>> uuid : ' + uuid + ' nick_name : ' + nick_name);
    console.log('panchange update_ranking 마지막랭킹 레디스 저장 승리수 =============================>> uuid : ' + win);

    var tasks = [
        function(callback1) {
            var _data = {};
            mysql.getGameRead().getConnection(function(err, con) {
                let query = 'SELECT Win, Lose FROM GameDB.TbPanChange WHERE UUID=?';
                let params = [uuid];
                if (err) {
                    console.error('panchange update_ranking >> getConnection...1..err ' + err);
                    _data.result = PACKET_ERR.PANCHANGE_RANKING_MYSQL;
                    callback(PACKET_ERR.PANCHANGE_RANKING_MYSQL);
                    return;
                } else {
                    con.query(query, params, function(err1, results, fields) {
                        con.release();
                        if (err1) {
                            console.error('panchange update_ranking >> query...1.. error (mysql)!!!!..' + err1);
                            _data.result = PACKET_ERR.PANCHANGE_RANKING_MYSQL_QUERY;
                            callback(PACKET_ERR.PANCHANGE_RANKING_MYSQL_QUERY);
                            return;
                        } else {
                            _data.result = PACKET_ERR.SUCCESS;
                            _data.win = results[0].Win;
                            _data.lose = results[0].Lose;
                            callback1(PACKET_ERR.SUCCESS, _data, _data);
                        }
                    });
                }
            });
        },
        //스코어 저장
        function(result_data, data, callback1) {
            const redis_rank = redis.getWeekRankingRedis();
            let _data = {};
            if (data.result === PACKET_ERR.SUCCESS) {
                console.log('2...data : ' + JSON.stringify(data));
                redis_rank.zincrby(RANKING.KEY2, win, nick_name, (err, res) => {
                    if (err) {
                        console.error('panchange update_ranking >> zincrby ...2...error (redis)!!!!..' + err);
                        _data.result = PACKET_ERR.PANCHANGE_RANKING_REDIS;
                        callback(PACKET_ERR.PANCHANGE_RANKING_REDIS);
                        return;
                    } else {
                        if (res < 0) {
                            console.error('panchange update_ranking >> zincrby...2...error (redis res)!!!!..' + res);
                            _data.result = PACKET_ERR.PANCHANGE_RANKING_REDIS_RES;
                            callback(PACKET_ERR.PANCHANGE_RANKING_REDIS_RES);
                            return;
                        } else {
                            _data.result = PACKET_ERR.SUCCESS;
                            callback1(PACKET_ERR.SUCCESS, result_data, data);
                        }
                    }
                });
            }

        },

        //Redis 백업용 RDB 저장 (유저용) 이것은 레디스 초기화때 부릅니다.
        function(result_data, data, callback1) {

            let _data = {};
            mysql.getWebWrite().getConnection(function(err, conn) {
                if (err) {
                    conn.release();
                    console.error('mole redis backup rdb connection error' + err);
                } else {
                    let _query = "call WebDB.web_insert_user_rank_redis(?,?,?)";
                    conn.query(_query, [RANKING.KEY2, nick_name, win], (err1, result, fields) => {
                        conn.release();
                        if (err1) {
                            console.error('mole redis backup rdb write error' + err1);
                        } else {
                            _data.result = PACKET_ERR.SUCCESS;
                            callback1(PACKET_ERR.SUCCESS, result_data, _data);
                        }
                    });
                }

            });

        },
        //해당 랭크 가져오기  
        function(result_data, data, callback1) {
            const redis_rank = redis.getWeekRankingRedis();

            if (data.result != PACKET_ERR.SUCCESS) {
                callback(data.result);
            } else {
                console.log('3...data : ' + JSON.stringify(data));
                let _data = {};
                redis_rank.zrevrank(RANKING.KEY2, nick_name, (err, res) => {
                    if (err) {
                        console.error('panchange update_ranking >> zrevrange...3...error (redis)!!!!..' + err1);
                        _data.result = PACKET_ERR.PANCHANGE_RANKING_REDIS_REDIS1;
                        callback(PACKET_ERR.PANCHANGE_RANKING_REDIS_REDIS1, _data);
                        return;
                    } else {
                        if (res < 0) {
                            console.error('panchange update_ranking >> zrevrange ...3...error (redis res)!!!!..' + res1);
                            _data.result = PACKET_ERR.PANCHANGE_RANKING_REDIS_REDIS1_RES;
                            callback(PACKET_ERR.PANCHANGE_RANKING_REDIS_REDIS1_RES, _data);
                            return;
                        } else {
                            _data.result = PACKET_ERR.SUCCESS;
                            _data.rank = res;
                            callback1(PACKET_ERR.SUCCESS, result_data, _data);
                        }
                    }
                });
            }
        },
        //해당 점수 가져오기
        function(result_data, data, callback1) {
            const redis_rank = redis.getWeekRankingRedis();
            let _data = {};
            if (data.result != PACKET_ERR.SUCCESS) {
                callback1(data.result);
            } else {
                console.log('4...data : ' + JSON.stringify(data));
                redis_rank.zscore(RANKING.KEY2, nick_name, (err, res) => {
                    if (err) {
                        console.error('panchange update_ranking >> zscore...4...error (redis)!!!!..' + err);
                        _data.result = PACKET_ERR.PANCHANGE_RANKING_REDIS_RES2;
                        callback(PACKET_ERR.PANCHANGE_RANKING_REDIS_RES2, _data);
                        return;
                    } else {
                        if (res < 0) {
                            console.error('panchange update_ranking >> zscore...4...error (redis res)!!!!..' + res);
                            _data.result = PACKET_ERR.PANCHANGE_RANKING_REDIS_RES2_RES;
                            callback(PACKET_ERR.PANCHANGE_RANKING_REDIS_RES2_RES, _data);
                            return;
                        } else {
                            _recv_score = res;
                            _data.result = PACKET_ERR.SUCCESS;
                            _data.rank = data.rank;
                            _data.score = res;
                            callback1(PACKET_ERR.SUCCESS, result_data, _data);

                        }
                    }
                });
            }
        },
        //학교 정보 가져오기
        function(result_data, data, callback) {
            const web_mysql = mysql.getWebWrite();
            let _data = {};
            if (data.result != PACKET_ERR.SUCCESS) {
                callback(data.result);
            } else {
                console.log('5...data : ' + JSON.stringify(data));
                web_mysql.getConnection((err, con) => {
                    if (err) {
                        console.error('panchange update_ranking >> getConnection error.5.(mysql err)!!!!..' + err);
                        callback(PACKET_ERR.PANCHANGE_RANKING_REDIS_SCHOOL_MYSQL);
                        return;
                    } else {
                        let _query = 'SELECT * FROM WebDB.UserSchools WHERE user_id=?';
                        con.query(_query, [uuid], (err1, result, fields) => {
                            con.release();
                            if (err1) {
                                console.error('panchange update_ranking >> query error.5.(mysql err)!!!' + err1);
                                callback(PACKET_ERR.PANCHANGE_RANKING_REDIS_SCHOOL_MYSQL_QUERY);
                                return;
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
                                    callback(PACKET_ERR.SUCCESS, result_data, _data);
                                }
                            }
                        });
                    }
                });
            }
        },

        //학교랭킹 반영
        function(result_data, data, callback1) {
            let _data = {};
            _data = data;

            const redis_rank = redis.getWeekRankingRedis();

            console.log("학교 승점 파악 =================================스테이트값 -- " + state);
            //스테이트 0 이면 승리. 나머지는 점수 0점입니다.

            //학교아이디가 없으면 건너 뜁니다.
            if (data.school_id !== undefined || data.school_id === 1 || data.school_id === 0) {

                if (state === 0) {

                    redis_rank.zincrby(RANKING.KEY6, 1, data.school_id, (err, res) => {
                        if (err) {
                            console.error('panchange update_ranking >>...6..err...' + err);
                            callback(PACKET_ERR.PANCHANGE_RANKING_SCHOOL_REDIS);
                            return;
                        }
                    });
                } else {

                    redis_rank.zincrby(RANKING.KEY6, 0, data.school_id, (err, res) => {
                        if (err) {
                            console.error('panchange update_ranking >>...6..err...' + err);
                            callback(PACKET_ERR.PANCHANGE_RANKING_SCHOOL_REDIS);
                            return;
                        }
                    });
                }



            } else {
                callback1(PACKET_ERR.SUCCESS, result_data, _data);
            }

        },
        //스쿨랭킹 레디스 백업 
        function(result_data, data, callback1) {

            if (data.school_id === 1 || data.school_id <= 0) {

                callback1(PACKET_ERR.SUCCESS, result_data, data);

            } else {
                mysql.getWebWrite().getConnection(function(err, conn) {
                    if (err) {
                        conn.release();
                        console.error('mole 학교 redis backup rdb connection error' + err);
                    } else {
                        let _query = "call WebDB.web_insert_school_rank_redis(?,?,?)";
                        conn.query(_query, [RANKING.KEY6, data.school_id, 1], (err1, result, fields) => {
                            conn.release();
                            if (err1) {
                                console.error('mole 학교 redis backup rdb write error' + err1);
                            } else {
                                callback1(PACKET_ERR.SUCCESS, result_data, data);
                            }
                        });
                    }

                });
            }


        },
        //주간 점수 반영
        function(result_data, data, callback1) {
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
                        console.error('panchange update_ranking >> getConnection error.7. (mysql err)!!!!..' + err);
                        callback(PACKET_ERR.PANCHANGE_RANKING_SCHOOL_MYSQL);
                        return;
                    } else {
                        /* console.log("판뒤집기 업데이트 렝킹 주간점수 반영 _week ================================"+_week);
                        console.log("판뒤집기 업데이트 렝킹 주간점수 반영 data.score ================================"+data.score);
                        console.log("판뒤집기 업데이트 렝킹 주간점수 반영 data.school_id ================================"+data.school_id);
                        console.log("판뒤집기 업데이트 렝킹 주간점수 반영 uuid ================================"+uuid);
                        console.log("판뒤집기 업데이트 렝킹 주간점수 반영 nick_name ================================"+nick_name);
                        console.log("판뒤집기 업데이트 렝킹 주간점수 반영 data.win ================================"+data.win);
                        console.log("판뒤집기 업데이트 렝킹 주간점수 반영 data.lose ================================"+result_data.lose); */

                        let _query = 'call SPPanChangeSchoolRanking(?,?,?,@ret);SELECT @ret as ret';
                        //  con.query(_query,[_week,data.score,data.school_id,uuid,nick_name,result_data.win,result_data.lose],(err1,result,fields)=>{
                        con.query(_query, [_week, data.score, data.school_id], (err1, result, fields) => {
                            con.release();
                            if (err1) {
                                console.error('panchange update_ranking >> query error...7..' + err1);
                                callback(PACKET_ERR.PANCHANGE_RANKING_SCHOOL_MYSQL_QUERY);
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
        function(data, callback4) {
            const rank_mysql = mysql.getRankingWrite();
            if (data.result != PACKET_ERR.SUCCESS) {
                callback(data.result);
            } else {
                console.log('6...data : ' + JSON.stringify(data));
                rank_mysql.getConnection((err, con) => {
                    if (err) {
                        console.error('panchange update_ranking >> getConnection ..8..error (mysql err)!!!!..' + err);
                        callback(PACKET_ERR.PANCHANGE_RANKING_REDIS_MYSQL);
                        return;
                    } else {
                        let _week_table = getRankTable();
                        let _query = 'call SPPanChangeRanking(?,?,?,?,?,?,@ret);SELECT @ret as ret';
                        con.query(_query, [_week_table, uuid, nick_name, data.score, data.rank, data.school_id], (err1, result, fields) => {
                            con.release();
                            if (err1) {
                                console.error('panchange update_ranking >> query..8..error (mysql err)!!!' + err1);
                                callback(PACKET_ERR.PANCHANGE_RANKING_REDIS_MYSQL_QUERY);
                                return;
                            } else {
                                console.log('panchange mysq query return : ' + result[1][0].ret);
                                if (result[1][0].ret < 0) {
                                    callback(PACKET_ERR.PANCHANGE_RANKING_REDIS_MYSQL_QUERY_RES);
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
 * 
 */
const Check_Packet_Time = require('../common/util').Check_Packet_Time;

function write_result(uuid, nick_name, state, win, date, callback) {


    var tasks = [

        function(callback1) {
            //패킷 복사를 예방합니다. 0.5초이상 느리게 온 패킷은 받지 않습니다.
            if (Check_Packet_Time(date) === false) {
                //패킷 타임시퀀스에러 (패킥복사 의심)
                return;
            }

            console.log("판뒤집기 게임 결과 저장 wort Result : UUID =================================" + uuid);
            console.log("판뒤집기 게임 결과 저장 wort Result : nick_name =================================" + nick_name);
            console.log("판뒤집기 게임 결과 저장 wort Result : state =================================" + state);
            console.log("판뒤집기 게임 결과 승리판수  =================================" + win);
            console.log("판뒤집기 게임 결과 저장 시간 =================================" + date);
            mysql.getGameWrite().getConnection((err, con) => {
                if (err) {
                    console.error("write panchange result >> connect mysql error..!");
                    callback(PACKET_ERR.WRITE_SETCOIN_RESULT_MYSQL_DB_CONN, null);
                } else {
                    let _q = 'call SPPanChangeResult(?,?,@win,@lose,@draw,@ret);SELECT @ret as ret,@win as win,@lose as lose,@draw as draw';
                    con.query(_q, [uuid, state], (err1, rows, fields) => {
                        con.release();
                        if (err1) {
                            console.error("write panchange result query error : " + err1);
                            callback(PACKET_ERR.WRITE_SETCOIN_RESULT_MYSQL_DB_QUERY, null);
                        } else {
                            let _rdata = {};
                            let _data = [];
                            let _info = {};
                            _rdata.result = PACKET_ERR.SUCCESS;
                            _info.win = rows[1][0].win;
                            _info.lose = rows[1][0].lose;
                            _info.draw = rows[1][0].draw;
                            _data.push(_info);
                            _rdata.data = _data;

                            callback1(null, _rdata);


                        }
                    });
                }
            });
        },

        function(rdata, callback1) {

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
                                let _rdata = {};
                                let _data = [];
                                let _info = {};
                                _rdata.result = PACKET_ERR.SUCCESS;
                                _info.win = 0;
                                _info.lose = 0;
                                _info.draw = 0;
                                _data.push(_info);
                                _rdata.data = _data;

                                callback1(null, _rdata);
                            } else {

                                let _rdata = {};
                                let _data = [];
                                let _info = {};
                                _rdata.result = PACKET_ERR.SUCCESS;
                                _info.win = result[0].Win;
                                _info.lose = result[0].Lose;
                                _info.draw = result[0].Draw;
                                _data.push(_info);
                                _rdata.data = _data;

                                console.log(" 판뒤집기 게임 결과 불러옵니다============================== 승점" + _info.win);
                                console.log(" 판뒤집기 게임 결과 불러옵니다============================== 승점" + _info.lose);
                                console.log(" 판뒤집기 게임 결과 불러옵니다============================== 승점" + _info.draw);

                                callback1(null, _rdata);



                            }
                        }
                    });
                }

            });
        },

        //실시간 랭킹 업데이트가 비동기로 문제되서 워터풀 동기로 합니다.
        function(rdata, callback1) {

            if (state === 0) {
                update_ranking(uuid, nick_name, win, state, (err) => {

                });
            } else {
                update_ranking(uuid, nick_name, 0, state, (err) => {

                });
            }


            callback1(PACKET_ERR.SUCCESS, rdata);
        }

    ];

    async.waterfall(tasks, (err, data) => {
        callback(err, data);
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


/**
 * 호스트 변경
 * @param 전 호스트 닉네임 pre_host_name 
 * @param 현재 호스트 닉네임 new_host_name 
 * @param 콜백 callback 
 */
function write_change_host_name(room_number, pre_host_name, new_host_name, callback) {
    const room_list_redis = redis.getPanchangeChannel1();
    var tasks = [
        function(callback1) {
            let _data = {};
            let _key = RLI.KEY2 + '-' + room_number; //
            console.log("판뒤집기 호스트 네임 변경 (write_change_host_name) ===================== 룸넘버" + room_number);
            console.log("판뒤집기 호스트 네임 변경 (write_change_host_name) ===================== 전 호스트네임" + pre_host_name);
            console.log("판뒤집기 호스트 네임 변경 (write_change_host_name) ===================== 신 호스트네임" + new_host_name);

            room_list_redis.hgetall(_key, (err, res) => {
                if (err) {
                    console.error('write_change_host_name >> hgetall....key : ' + _key + '...1..err ' + err);
                    callback(PACKET_ERR.CHANGE_HOST_REDIS1);
                    return;
                } else {
                    if (res === null) {
                        console.error('write_change_host_name >> null error hgetall....key : ' + _key + '...1..res ' + res);
                        callback(PACKET_ERR.CHANGE_HOST_REDIS1_RES);
                        return;
                    } else {
                        callback1(PACKET_ERR.SUCCESS);
                    }
                }
            });
        },
        //룸정보 수정
        function(callback1) {
            let _key = RLI.KEY2 + '-' + room_number; //
            let _ri = {};
            _ri.host_name = new_host_name;
            room_list_redis.hmset(_key, _ri, (err, res) => {
                if (err) {
                    console.error('write_change_host_name >>..hmset...key' + _key + '...2....err ' + err);
                    callback(PACKET_ERR.CHANGE_HOST_REDIS2);
                    return;
                } else {
                    if (res != 'OK') {
                        console.error('write_change_host_name >>..hmset...key' + _key + '...2....res ' + res);
                        callback(PACKET_ERR.CHANGE_HOST_REDIS2_RES);
                        return;
                    } else {
                        callback1(PACKET_ERR.SUCCESS);
                    }
                }
            });
        },
        //호스트 정보 삭제
        function(callback1) {
            var _key = RLI.KEY5 + "-" + pre_host_name;
            room_list_redis.del(_key, (err, res) => {
                if (err) {
                    console.error('write_change_host_name >>..del...key' + _key + '...3....err ' + err);
                    callback(PACKET_ERR.CHANGE_HOST_REDIS3);
                    return;
                } else {
                    if (res <= 0) {
                        console.error('write_change_host_name  RES <= 0 >>..del...key' + _key + '...3....res ' + res);
                        callback(PACKET_ERR.CHANGE_HOST_REDIS3_RES);
                        return;
                    } else {
                        callback1(PACKET_ERR.SUCCESS);
                    }
                }
            });
        },
        function(callback1) {
            var _host = {};
            _host.room_number = room_number;
            var _key = RLI.KEY5 + "-" + new_host_name;
            room_list_redis.hmset(_key, _host, (err, res) => {
                if (err) {
                    console.error('write_change_host_name >>..hmset...key' + _key + '...4....err ' + err);
                    callback(PACKET_ERR.CHANGE_HOST_REDIS4);
                    return;
                } else {
                    if (res != 'OK') {
                        console.error('write_change_host_name >>..hmset...key' + _key + '...4....res ' + res);
                        callback(PACKET_ERR.CHANGE_HOST_REDIS4_RES);
                        return;
                    } else {
                        callback1(PACKET_ERR.SUCCESS);
                    }
                }
            });
        }
    ];

    async.waterfall(tasks, (err, data) => {
        callback(err, data);
    });

}

/** 
 * 클랜방 변경
 */
function write_reset_room_clan_name_A(room_number, pre_clan_name, new_clan_name, callback) {
    const room_list_redis = redis.getPanchangeChannel1();
    var tasks = [
        //룸정보 가져오기
        function(callback1) {
            var _rinfo_key = RLI.KEY2 + '-' + room_number; //
            var _data = {};
            room_list_redis.hgetall(_rinfo_key, (err, res) => {
                if (err) {
                    console.error("write_reset_room_clan_name >>...hgetall.1..err " + err);
                    callback(PACKET_ERR.WRITE_RESET_CLAN_NAME_REDIS1);
                    return;
                } else {
                    if (res <= 0) {
                        console.error("write_reset_room_clan_name >>..hgetall..1.res " + res);
                        callback(PACKET_ERR.WRITE_RESET_CLAN_NAME_NO_ROOM);
                        return;
                    } else {
                        // _data.result = PACKET_ERR.SUCCESS;
                        // _data.host_name     = res.host_name;                        
                        // _data.is_clan       = res.is_clan;
                        // _data.clan_name     = res.clan_name;
                        if (parseInt(res.is_clan) != 1) {
                            callback(PACKET_ERR.WRITE_RESET_CLAN_NAME_ROOM_NO_CLAN);
                            return;
                        }
                        callback1(PACKET_ERR.SUCCESS);
                    }
                }
            });
        },
        //룸정보에서 클랜명 갱신
        function(callback1) {
            var _rinfo_key = RLI.KEY2 + '-' + room_number; //
            var _ri = {};
            _ri.clan_name_A = new_clan_name;
            room_list_redis.hmset(_rinfo_key, _ri, (err, res) => {
                if (err) {
                    console.error('write_reset_room_clan_name >> hmset..2.error ' + err + ' key : ' + _rinfo_key);
                    callback(PACKET_ERR.WRITE_RESET_CLAN_NAME_REDIS2);
                    return;
                } else {
                    if (res != 'OK') {
                        console.error('write_reset_room_clan_name >> hmset.2...hmset not ok.res ' + res);
                        callback(PACKET_ERR.WRITE_RESET_CLAN_NAME_REDIS2_RES);
                        return;
                    } else {
                        callback1(PACKET_ERR.SUCCESS);
                    }
                }
            });
        },
        //기존 클랜명 정보 삭제
        function(callback1) {
            var _rinfo_key2 = RLI.KEY3 + '-' + pre_clan_name;
            room_list_redis.del(_rinfo_key2, (err, res) => {
                if (err) {
                    console.error('write_reset_room_clan_name >> del...3..err ' + err);
                    callback(PACKET_ERR.WRITE_RESET_CLAN_NAME_REDIS3);
                    return;
                } else {
                    if (res <= 0) {
                        console.error('write_reset_room_clan_name >> del...3..res ' + res);
                        callback(PACKET_ERR.WRITE_RESET_CLAN_NAME_REDIS3_RES);
                        return;
                    } else {
                        callback1(PACKET_ERR.SUCCESS);
                    }
                }
            });
        },

        //새 클랜명 정보 생성                
        function(callback1) {
            var _clan_name = {};
            _clan_name.room_number = room_number;
            var _key3 = RLI.KEY3 + "-" + new_clan_name;
            room_list_redis.hmset(_key3, _clan_name, (err, res) => {
                if (err) {
                    console.error('clan_create_room >> hmset 4 error ' + err + ' key : ' + _key3);
                    callback(PACKET_ERR.WRITE_RESET_CLAN_NAME_REDIS4);
                    return;
                } else {
                    if (res != 'OK') {
                        console.error('clan_create_room >> hmset.4...hmset not ok.res ' + res);
                        callback(PACKET_ERR.WRITE_RESET_CLAN_NAME_REDIS4_RES);
                        return;
                    } else {
                        callback1(PACKET_ERR.SUCCESS);
                    }
                }
            });
        }

    ];

    async.waterfall(tasks, (err, data) => {
        callback(err, data);
    });
}

function write_reset_room_clan_name_B(room_number, pre_clan_name, new_clan_name, callback) {
    const room_list_redis = redis.getPanchangeChannel1();
    var tasks = [
        //룸정보 가져오기
        function(callback1) {
            var _rinfo_key = RLI.KEY2 + '-' + room_number; //
            var _data = {};
            room_list_redis.hgetall(_rinfo_key, (err, res) => {
                if (err) {
                    console.error("write_reset_room_clan_name >>...hgetall.1..err " + err);
                    callback(PACKET_ERR.WRITE_RESET_CLAN_NAME_REDIS1);
                    return;
                } else {
                    if (res <= 0) {
                        console.error("write_reset_room_clan_name >>..hgetall..1.res " + res);
                        callback(PACKET_ERR.WRITE_RESET_CLAN_NAME_NO_ROOM);
                        return;
                    } else {
                        // _data.result = PACKET_ERR.SUCCESS;
                        // _data.host_name     = res.host_name;                        
                        // _data.is_clan       = res.is_clan;
                        // _data.clan_name     = res.clan_name;
                        if (parseInt(res.is_clan) != 1) {
                            callback(PACKET_ERR.WRITE_RESET_CLAN_NAME_ROOM_NO_CLAN);
                            return;
                        }
                        callback1(PACKET_ERR.SUCCESS);
                    }
                }
            });
        },
        //룸정보에서 클랜명 갱신
        function(callback1) {
            var _rinfo_key = RLI.KEY2 + '-' + room_number; //
            var _ri = {};
            _ri.clan_name_B = new_clan_name;
            room_list_redis.hmset(_rinfo_key, _ri, (err, res) => {
                if (err) {
                    console.error('write_reset_room_clan_name >> hmset..2.error ' + err + ' key : ' + _rinfo_key);
                    callback(PACKET_ERR.WRITE_RESET_CLAN_NAME_REDIS2);
                    return;
                } else {
                    if (res != 'OK') {
                        console.error('write_reset_room_clan_name >> hmset.2...hmset not ok.res ' + res);
                        callback(PACKET_ERR.WRITE_RESET_CLAN_NAME_REDIS2_RES);
                        return;
                    } else {
                        callback1(PACKET_ERR.SUCCESS);
                    }
                }
            });
        }
    ];

    async.waterfall(tasks, (err, data) => {
        callback(err, data);
    });
}

function write_reset_room_clan_name(room_number, pre_clan_name, new_clan_name, callback) {
    const room_list_redis = redis.getPanchangeChannel1();
    var tasks = [
        //룸정보 가져오기
        function(callback1) {
            var _rinfo_key = RLI.KEY2 + '-' + room_number; //
            var _data = {};
            room_list_redis.hgetall(_rinfo_key, (err, res) => {
                if (err) {
                    console.error("write_reset_room_clan_name >>...hgetall.1..err " + err);
                    callback(PACKET_ERR.WRITE_RESET_CLAN_NAME_REDIS1);
                    return;
                } else {
                    if (res <= 0) {
                        console.error("write_reset_room_clan_name >>..hgetall..1.res " + res);
                        callback(PACKET_ERR.WRITE_RESET_CLAN_NAME_NO_ROOM);
                        return;
                    } else {
                        // _data.result = PACKET_ERR.SUCCESS;
                        // _data.host_name     = res.host_name;                        
                        // _data.is_clan       = res.is_clan;
                        // _data.clan_name     = res.clan_name;
                        if (parseInt(res.is_clan) != 1) {
                            callback(PACKET_ERR.WRITE_RESET_CLAN_NAME_ROOM_NO_CLAN);
                            return;
                        }
                        callback1(PACKET_ERR.SUCCESS);
                    }
                }
            });
        },
        //룸정보에서 클랜명 갱신
        function(callback1) {
            var _rinfo_key = RLI.KEY2 + '-' + room_number; //
            var _ri = {};
            _ri.clan_name_A = new_clan_name;
            _ri.clan_name_B = "";
            _ri.battle_clan_name = "";
            room_list_redis.hmset(_rinfo_key, _ri, (err, res) => {
                if (err) {
                    console.error('write_reset_room_clan_name >> hmset..2.error ' + err + ' key : ' + _rinfo_key);
                    callback(PACKET_ERR.WRITE_RESET_CLAN_NAME_REDIS2);
                    return;
                } else {
                    if (res != 'OK') {
                        console.error('write_reset_room_clan_name >> hmset.2...hmset not ok.res ' + res);
                        callback(PACKET_ERR.WRITE_RESET_CLAN_NAME_REDIS2_RES);
                        return;
                    } else {
                        callback1(PACKET_ERR.SUCCESS);
                    }
                }
            });
        },
        //기존 클랜명 정보 삭제
        function(callback1) {
            var _rinfo_key2 = RLI.KEY3 + '-' + pre_clan_name;
            room_list_redis.del(_rinfo_key2, (err, res) => {
                if (err) {
                    console.error('write_reset_room_clan_name >> del...3..err ' + err);
                    callback(PACKET_ERR.WRITE_RESET_CLAN_NAME_REDIS3);
                    return;
                } else {
                    if (res <= 0) {
                        console.error('write_reset_room_clan_name >> del...3..res ' + res);
                        callback(PACKET_ERR.WRITE_RESET_CLAN_NAME_REDIS3_RES);
                        return;
                    } else {
                        callback1(PACKET_ERR.SUCCESS);
                    }
                }
            });
        },

        //새 클랜명 정보 생성                
        function(callback1) {
            var _clan_name = {};
            _clan_name.room_number = room_number;
            var _key3 = RLI.KEY3 + "-" + new_clan_name;
            room_list_redis.hmset(_key3, _clan_name, (err, res) => {
                if (err) {
                    console.error('clan_create_room >> hmset 4 error ' + err + ' key : ' + _key3);
                    callback(PACKET_ERR.WRITE_RESET_CLAN_NAME_REDIS4);
                    return;
                } else {
                    if (res != 'OK') {
                        console.error('clan_create_room >> hmset.4...hmset not ok.res ' + res);
                        callback(PACKET_ERR.WRITE_RESET_CLAN_NAME_REDIS4_RES);
                        return;
                    } else {
                        callback1(PACKET_ERR.SUCCESS);
                    }
                }
            });
        }

    ];

    async.waterfall(tasks, (err, data) => {
        callback(err, data);
    });
}

module.exports = {
    start_end_game_log: start_end_game_log,
    set_play_game: set_play_game,
    set_play_game_not: set_play_game_not,
    change_room_option: change_room_option,
    panchage_write_room: panchage_write_room,
    update_user_count: update_user_count,
    update_ranking: update_ranking,
    write_result: write_result,
    write_share_facebook: write_share_facebook,
    write_share_kakao: write_share_kakao,
    return_room_number: return_room_number,
    update_clan_B_name: update_clan_B_name,
    write_change_host_name: write_change_host_name,
    write_reset_room_clan_name: write_reset_room_clan_name,
    write_reset_room_clan_name_A: write_reset_room_clan_name_A,
    write_reset_room_clan_name_B: write_reset_room_clan_name_B,
    request_room_list_flush: request_room_list_flush
}