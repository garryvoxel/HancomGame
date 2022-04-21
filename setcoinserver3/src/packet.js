const CS_PACKET_DEF         = require('./packet_def').CS_PACKET_DEF;
const CG_PACKET_ERR         = require('./packet_err').CG_PACKET_ERR;
const GAME_CODE             = require('../config/game_code');
const PacketDecode          = require('../common/util').PacketDecode;
const PacketEncode          = require('../common/util').PacketEncode;
const character_suffle      = require('../common/character').character_suffle;
const get_bot_character     = require('../common/character').get_bot_character;

const room_pool             = require('./RoomPool');
const user_pool             = require('./UserPool');


//api 호출
const get_session_id        = require('./call_apiserver').get_session_id;
const insert_room_to_list   = require('./call_apiserver').insert_room_to_list;
const api_change_room_option   = require('./call_apiserver').change_room_option;
//로직 호출
const create_room           = require('./process/create_room').create_room;
const change_room_option    = require('./process/change_room_option').change_room_option;
const invite                = require('./process/invite').invite;
const enter_room            = require('./process/enter_room').enter_room;
const game_ready            = require('./process/game_ready').game_ready;
const new_word              = require('./process/new_word').new_word;
const check_word            = require('./process/check_word').check_word;
const input_word_time_over  = require('./process/input_word_time_over').input_word_time_over;
const tower_fall            = require('./process/tower_fall').tower_fall;
const game_result           = require('./process/game_result').game_result;
const leave_room            = require('./process/leave_room').leave_room;
const userGameLeave         = require('./process/leave_room').userGameLeave;
const game_leave_room       = require('./process/game_leave_room').game_leave_room;
const re_game_start         = require('./process/restart').re_game_start;

const check_room            = require('./process/check_room').check_room;
const how_game              = require('./process/how_game').how_game;

const WebConfig             = require('../config/config');
const start_end_game_log    = require('./call_apiserver').start_end_game_log;
const get_room_list         = require('./call_apiserver').get_room_list;

const gamecfg               = require('./../config/game.json');


var robby = null;
var game = null;

function CPacket(){

}


CPacket.prototype.process = function(io,cluster){    
    setInterval(this.checkRoomListStatus, gamecfg.CHECK_ROOM_INTERVAL);
    /* * * * * * * * * * * * * * * * * */
    /*              robby              */
    /* * * * * * * * * * * * * * * * * */
    
    robby = io.of('/robby1001');
    robby.on('connection', (socket) => {
        var add = socket.handshake.headers["x-forwarded-for"];
        console.log('robby connection...Client Real IP'+add);
        console.log('robby connection...'+socket.id);
        //소켓 연결 끊기
        socket.on('disconnect', () => {
            console.log('robby disconnect...' + socket.id);
            socket.disconnect();
        });

        socket.on(CS_PACKET_DEF.REQ_ROOM_LIST, async (d) => {
            // await room_pool.resetRedis();
            await this.get_room_list(socket);
        });

        socket.on(CS_PACKET_DEF.REQ_AUTO_ENTER_ROOM, async (d) => {
            //받은 패켓을 체크
            let _data   = PacketDecode(d);
            let _room_info = await room_pool.autoEnter();

            if(_room_info) {
                _rdata = {
                    msg_idx: CS_PACKET_DEF.RES_AUTO_ENTER_ROOM,
                    result: CG_PACKET_ERR.SUCCESS,
                    data: {
                        room_number: _room_info.room_number, 
                        room_title: _room_info.room_title,
                        is_lock: _room_info.is_lock,
                        play_time: parseInt(_room_info.play_time),
                        back_ground: parseInt(_room_info.back_ground),
                        password: _room_info.password,
                        host_name: _room_info.host_name,
                        ip: _room_info.ip,
                        server_idx: _room_info.server_idx
                    }  
                };

                socket.emit(CS_PACKET_DEF.RES_AUTO_ENTER_ROOM, PacketEncode(_rdata));
                return;        
            }

            _rdata = {
                msg_idx: CS_PACKET_DEF.RES_AUTO_ENTER_ROOM,
                result: CG_PACKET_ERR.ENTER_ROOM_PARAMETER
            };
            socket.emit(CS_PACKET_DEF.RES_AUTO_ENTER_ROOM, PacketEncode(_rdata));
        });

        socket.on(CS_PACKET_DEF.REQ_SEARCH_ROOM_BY_ROOMNUM, async (d) => {
            //받은 패켓을 체크
            let _data   = PacketDecode(d);
            let _rn = _data.room_number;
            let _room_info = await room_pool.searchRoomByRoomNum(_rn);
            if(_room_info) {
                _rdata = {
                    msg_idx: CS_PACKET_DEF.RES_SEARCH_ROOM_BY_ROOMNUM,
                    result: CG_PACKET_ERR.SUCCESS,
                    data: {
                        room_number: _room_info.room_number, 
                        room_title: _room_info.room_title,
                        is_lock: _room_info.is_lock,
                        play_time: parseInt(_room_info.play_time),
                        back_ground: parseInt(_room_info.back_ground),
                        password: _room_info.password,
                        host_name: _room_info.host_name,
                        ip: _room_info.ip,
                        server_idx: _room_info.server_idx
                    }  
                };
                socket.emit(CS_PACKET_DEF.RES_SEARCH_ROOM_BY_ROOMNUM, PacketEncode(_rdata));
                return;        
            }
            
            _rdata = {
                msg_idx: CS_PACKET_DEF.RES_SEARCH_ROOM_BY_ROOMNUM,
                result: CG_PACKET_ERR.SEARCH_ROOM_BY_ROOMNUM
            };

            socket.emit(CS_PACKET_DEF.RES_SEARCH_ROOM_BY_ROOMNUM, PacketEncode(_rdata));
        });
        
        socket.on(CS_PACKET_DEF.REQ_SEARCH_ROOM_BY_HOST, async (d) => {
            //받은 패켓을 체크
            let _data   = PacketDecode(d);
            let _host_name = _data.host_name;
            let _room_info = await room_pool.searchRoomByHostName(_host_name);
            let _rdata = {};
            if(_room_info) {
                _rdata = {
                    msg_idx: CS_PACKET_DEF.RES_SEARCH_ROOM_BY_HOST,
                    result: CG_PACKET_ERR.SUCCESS,
                    data: {
                        room_number: _room_info.room_number, 
                        room_title: _room_info.room_title,
                        is_lock: _room_info.is_lock,
                        play_time: parseInt(_room_info.play_time),
                        back_ground: parseInt(_room_info.back_ground),
                        password: _room_info.password,
                        host_name: _room_info.host_name,
                        ip: _room_info.ip,
                        server_idx: _room_info.server_idx
                    }  
                };
                socket.emit(CS_PACKET_DEF.RES_SEARCH_ROOM_BY_HOST, PacketEncode(_rdata));
                return;
            }
            _rdata = {
                msg_idx: CS_PACKET_DEF.RES_SEARCH_ROOM_BY_HOST,
                result: CG_PACKET_ERR.SEARCH_ROOM_BY_HOST
            }
            socket.emit(CS_PACKET_DEF.RES_SEARCH_ROOM_BY_HOST, PacketEncode(_rdata));
        });
    });

    /* * * * * * * * * * * * * * * * * */
    /*              game               */
    /* * * * * * * * * * * * * * * * * */
    game = io.of('/game1001');
    game.on('connection', (socket) => {
        console.log("game connect........" + socket.id);
        /**
         * 소켓 연결 끊기 
         */
        socket.on('disconnect', () => {
            console.log('game disconnect...' + socket.id);
            this.disconnect(robby, socket);
        });

        /**
         * 게임서버 로그인 요청 done
         */
        socket.on(CS_PACKET_DEF.REQ_LOGIN, (d) => {
            //받은 패켓을 해제
            var _data   = PacketDecode(d);
            console.log('req_login...'+JSON.stringify(_data)+" socket id : "+socket.id);     
            var _rdata = {};
            //받은 패킷 체크 
            if( _data.session_id === undefined || _data.session_id === null || _data.session_id === "" || 
                _data.nick_name === undefined || _data.nick_name === null || _data.nick_name === "") {
                _rdata.msg_idx = CS_PACKET_DEF.RES_LOGIN;
                _rdata.result = CG_PACKET_ERR.LOGIN_PARAMETER;
                var _rd = PacketEncode(_rdata);
                socket.emit(CS_PACKET_DEF.RES_LOGIN, _rd);
                return;
            }
            var _sid    = _data.session_id;
            var _nn     = _data.nick_name;
            //세션 체크
            check_session_id(_sid, _nn, (err) => {
                if(!err) {
                    _rdata.msg_idx = CS_PACKET_DEF.RES_LOGIN;
                    _rdata.result = CG_PACKET_ERR.LOGIN_SESSION_ID;
                    var _rd = PacketEncode(_rdata);
                    socket.emit(CS_PACKET_DEF.RES_LOGIN, _rd);
                    return;
                } else {
                    this.req_login(socket, _data);
                }
            });
        });

        /**
        * 게임방 생성 요청 done
        */        
       socket.on(CS_PACKET_DEF.REQ_CREATE_ROOM, (d) => {
            //받은 패켓을 해제   
            var _data = PacketDecode(d);
            var _rdata = {};
            //받은 패킷 체크
            if(_data.room_title === undefined       || _data.room_title === null        || _data.room_title === ""||
            _data.nick_name === undefined       || _data.nick_name === null         || _data.nick_name === "" ||
            _data.is_lock === undefined         || _data.is_lock === null           ||                
            _data.is_single == undefined        || _data.is_single === null         ||
            _data.character_type === undefined  || _data.character_type === null    ||
            _data.back_ground === undefined     || _data.back_ground === null       ||
            _data.play_time === undefined       || _data.play_time === null         ||
            _data.session_id === undefined      ||_data.session_id === null         || _data.session_id === "") {
                _rdata.msg_idx = CS_PACKET_DEF.RES_CREATE_ROOM;
                _rdata.result = CG_PACKET_ERR.CREATE_ROOM_PARAMETER;
                var _rd = PacketEncode(_rdata);
                socket.emit(CS_PACKET_DEF.RES_CREATE_ROOM,_rd);
                return;                                
            }

            var _sid = _data.session_id;
            var _nn = _data.nick_name;
            //세션 체크
            check_session_id(_sid, _nn, async(err) => {
                if(!err) {
                    _rdata.msg_idx = CS_PACKET_DEF.RES_CREATE_ROOM;
                    _rdata.result = CG_PACKET_ERR.CREATE_ROOM_SESSION_ID;          
                    var _rd = PacketEncode(_rdata);
                    socket.emit(CS_PACKET_DEF.RES_CREATE_ROOM, _rd);          
                }
                else {
                    this.req_create_room(robby, socket,_data);
                }
            });        
       });

       /**
        * 게임방 입장 done
        */
       socket.on(CS_PACKET_DEF.REQ_ENTER_ROOM, (d) => {
            //받은 패켓을 해제    
            var _data = PacketDecode(d);

            console.log("[REQ_ENTER_ROOM]========", _data);

            let _rdata = {};
            //받은 패켓 체크
            if( _data.room_number === undefined || _data.room_number === null   ||
                _data.nick_name === undefined   || _data.nick_name === null     || _data.nick_name === "" ||
                _data.session_id === undefined  || _data.session_id === null    || _data.session_id === ""
                ) {
                    _rdata.msg_idx = CS_PACKET_DEF.RES_ENTER_ROOM;
                    _rdata.result = CG_PACKET_ERR.ENTER_ROOM_PARAMETER;             
                    var _rd = PacketEncode(_rdata);
                    socket.emit(CS_PACKET_DEF.RES_ENTER_ROOM, _rd);                                        
                    return;
            }

            let _sid = _data.session_id;
            let _nn = _data.nick_name;
            //세션 체크
            check_session_id(_sid,_nn,(err)=>{
                if(!err){     
                    _rdata.msg_idx = CS_PACKET_DEF.RES_ENTER_ROOM;
                    _rdata.result = CG_PACKET_ERR.ENTER_ROOM_SESSION_ID;
                    var _rd = PacketEncode(_rdata);
                    socket.emit(CS_PACKET_DEF.RES_ENTER_ROOM,_rd);               
                }else{       
                    this.req_enter_room(robby, socket,_data);
                }
            });   
        });

       /**
        * 게임방 설정변경 소켓 done
        */
       socket.on(CS_PACKET_DEF.REQ_CHANGE_ROOM_OPTION, (d) => {
            //받은 패켓을 해제    
            var _data = PacketDecode(d);
            let _rdata = {};
            //받은 패켓 체크  
            if(_data.room_number === undefined  || _data.room_number === null   ||
                _data.nick_name === undefined   || _data.nick_name === null     || _data.nick_name === "" ||
                _data.room_title === undefined  || _data.room_title === null    ||
                _data.back_ground === undefined || _data.back_ground === null   ||
                _data.is_lock === undefined     || _data.is_lock === null       ||
                _data.password === undefined    || _data.password === null      ||
                _data.play_time === undefined   || _data.play_time === null     ||
                _data.session_id === undefined  ||_data.session_id === null     || _data.session_id === "") {
                    _rdata.msg_idx = CS_PACKET_DEF.RES_CHANGE_ROOM_OPTION;
                    _rdata.result = CG_PACKET_ERR.CHANGE_ROOM_OPTION_PARAMETER;
                    var _rd = PacketEncode(_rdata);
                    socket.emit(CS_PACKET_DEF.RES_CHANGE_ROOM_OPTION, _rd);
                    return;
            }

            var _sid = _data.session_id;
            var _nn = _data.nick_name;
            //세션 체크
            check_session_id(_sid,_nn,(err)=>{
                if(!err){
                    _rdata.msg_idx = CS_PACKET_DEF.RES_CHANGE_ROOM_OPTION;
                    _rdata.result = CG_PACKET_ERR.CHANGE_ROOM_OPTION_SESSION_ID;
                    var _rd = PacketEncode(_rdata);
                    socket.emit(CS_PACKET_DEF.RES_CHANGE_ROOM_OPTION,_rd);
                }else{
                    this.req_change_room_option(robby, socket,_data);
                }
            }); 
       });

       /**
        * 친구 요청 done
        */
       socket.on(CS_PACKET_DEF.REQ_INVITE, (d) => {
            //받은 패켓을 해제    
            var _data = PacketDecode(d);
            let _rdata = {};
            //받은 패켓 체크
            if(_data.room_number === undefined      || _data.room_number === null   ||
                _data.from_nick_name === undefined  || _data.from_nick_name === null||_data.from_nick_name === ""||
                _data.to_nick_name === undefined    || _data.to_nick_name === null  ||_data.to_nick_name === ""||
                _data.session_id === undefined      ||_data.session_id === null     ||_data.session_id === "") {
                    _rdata.msg_idx = CS_PACKET_DEF.RES_INVITE;
                    _rdata.result = CG_PACKET_ERR.GAME_INVITE_PRAMETER;
                    var _rd = PacketEncode(_rdata);             
                    socket.emit(CS_PACKET_DEF.RES_CHANGE_ROOM_OPTION,_rd);                    
                    return;     
            }  
            let _sid = _data.session_id;
            let _nn = _data.from_nick_name;
            // 세션 체크
            check_session_id(_sid,_nn,(err)=>{
                if(!err){
                    _rdata.msg_idx = CS_PACKET_DEF.RES_INVITE;
                    _rdata.result = CG_PACKET_ERR.GAME_INVITE_SESSION_ID;
                    var _rd = PacketEncode(_rdata);
                    socket.emit(CS_PACKET_DEF.RES_INVITE,_rd);
                }else{
                    this.req_invite(socket,_data);                    
                }
            });                           
       });

       /**
         * 게임 진행하기전 상태 체크 done
         */
        socket.on(CS_PACKET_DEF.REQ_CHECK_ROOM, (d) => {
            //받은 패켓을 해제
            var _data = PacketDecode(d);
            let _rdata = {};
            //받은 패켓 체크
            if( _data.session_id === undefined  || _data.session_id === null    || _data.session_id === ""||
            _data.nick_name === undefined   || _data.nick_name === null     || _data.nick_name === ""||
            _data.room_number === undefined || _data.room_number === null   || _data.room_number =="") {
                _rdata.msg_idx = CS_PACKET_DEF.RES_CHECK_ROOM;
                _rdata.result = CG_PACKET_ERR.CHECK_ROOM_PARAMETER;
                var _rd = PacketEncode(_rdata);
                socket.emit(CS_PACKET_DEF.RES_CHECK_ROOM,_rd);
                return;
            }     
            
            let _sid = _data.session_id;
            let _nn = _data.nick_name;
            //세션 체크
            check_session_id(_sid,_nn,(err)=>{
                if(!err){       
                    _rdata.msg_idx = CS_PACKET_DEF.RES_CHECK_ROOM;
                    _rdata.result = CG_PACKET_ERR.CHECK_ROOM_SESSION;
                    var _rd = PacketEncode(_rdata);
                    socket.emit(CS_PACKET_DEF.RES_CHECK_ROOM,_rd);                 
                }else{            
                    this.check_room(socket,_data);
                }
            });  
        });

       //게임 준비 상태 done
       socket.on(CS_PACKET_DEF.REQ_GAME_READY, (d) => {
            //받은 패켓을 해제
            var _data = PacketDecode(d);
            let _rdata = {};
            //받은 패켓 체크
            if( _data.session_id === undefined  || _data.session_id === null    || _data.session_id === ""||
                _data.nick_name === undefined   || _data.nick_name === null     || _data.nick_name === ""||
                _data.room_number === undefined || _data.room_number === null ) {
                _rdata.msg_idx = CS_PACKET_DEF.RES_GAME_READY;
                _rdata.result = CG_PACKET_ERR.GAME_READY_PARAMETER;
                var _rd = PacketEncode(_rdata);
                socket.emit(CS_PACKET_DEF.RES_GAME_READY, _rd);
                return;                         
            }            

            let _sid = _data.session_id;
            let _nn = _data.nick_name;

            //세션 체크
            check_session_id(_sid,_nn,(err)=>{
                if(!err){       
                    _rdata.msg_idx = CS_PACKET_DEF.RES_GAME_READY;
                    _rdata.result = CG_PACKET_ERR.GAME_READY_SESSION_ID;
                    var _rd = PacketEncode(_rdata);
                    socket.emit(CS_PACKET_DEF.RES_GAME_READY,_rd);                 
                }else{            
                    this.req_game_ready(socket,_data);
                }
            });            
       });

       /**
        * 새단어 요청 done
        */
       socket.on(CS_PACKET_DEF.REQ_NEW_WORD, (d) => {
            //받은 패켓을 해제
            var _data = PacketDecode(d);
            let _rdata = {};
            //받은 패켓 체크
            if( _data.session_id === undefined  || _data.session_id === null    || _data.session_id === ""||
            _data.nick_name === undefined   || _data.nick_name === null     || _data.nick_name === ""||
            _data.room_number === undefined || _data.room_number === null) {
                _rdata.msg_idx = CS_PACKET_DEF.RES_NEW_WORD;
                _rdata.result = CG_PACKET_ERR.NEW_WORD_PARAMETER;
                var _rd = PacketEncode(_rdata);
                socket.emit(CS_PACKET_DEF.RES_NEW_WORD,_rd);
                return;
            }
            let _sid = _data.session_id;
            let _nn = _data.nick_name;     
            //세션 체크
            check_session_id(_sid,_nn,(err)=>{
                if(!err){       
                    _rdata.msg_idx = CS_PACKET_DEF.RES_NEW_WORD;
                    _rdata.result = CG_PACKET_ERR.NEW_WORD_SESSION_ID;
                    var _rd = PacketEncode(_rdata);
                    socket.emit(CS_PACKET_DEF.RES_NEW_WORD,_rd);                 
                }else{            
                    this.req_new_word(socket,_data);
                }
            });              
       });

        //입력한 단어 체크 done
        socket.on(CS_PACKET_DEF.REQ_CHECK_WORD, (d) => {
            //받은 패켓을 해제
            var _data = PacketDecode(d);

            let _rdata = {};
            //받은 패켓 체크
            if( _data.session_id === undefined  || _data.session_id === null    || _data.session_id === ""||
            _data.nick_name === undefined   || _data.nick_name === null     || _data.nick_name === ""||
            _data.room_number === undefined || _data.room_number === null   || _data.room_number =="" ||
             _data.word === undefined       || _data.word == null           || _data.word === ""||
            _data.coin_line_type === undefined || _data.coin_line_type === null || _data.coin_line_type === "") {
                _rdata.msg_idx = CS_PACKET_DEF.RES_CHECK_WORD;
                _rdata.result = CG_PACKET_ERR.CHECK_WORD_PARAMETER;
                var _rd = PacketEncode(_rdata);
                socket.emit(CS_PACKET_DEF.RES_CHECK_WORD,_rd);
                return;                         
            }
            let _sid = _data.session_id;
            let _nn = _data.nick_name;
            //세션 체크
            check_session_id(_sid,_nn,(err)=>{
                if(!err){       
                    _rdata.msg_idx = CS_PACKET_DEF.RES_CHECK_WORD;
                    _rdata.result = CG_PACKET_ERR.CHECK_WORD_SESSION_ID;
                    var _rd = PacketEncode(_rdata);
                    socket.emit(CS_PACKET_DEF.RES_CHECK_WORD,_rd);                 
                }else{            
                    this.req_check_word(socket,_data);
                }
            });
        });    
        /**
         * 단어 입력 시간 초과 done
         */
        socket.on(CS_PACKET_DEF.REQ_INPUT_WORD_TIME_OVER, (d) => {
            //받은 패켓을 해제
            var _data = PacketDecode(d);
            let _rdata = {};
            //받은 패켓 체크
            if( _data.session_id === undefined  || _data.session_id === null    || _data.session_id === ""||
            _data.nick_name === undefined   || _data.nick_name === null     || _data.nick_name === ""||
            _data.room_number === undefined || _data.room_number === null   || _data.room_number =="") {
                _rdata.msg_idx = CS_PACKET_DEF.RES_INPUT_WORD_TIME_OVER;
                _rdata.result = CG_PACKET_ERR.INPUT_WORD_TIME_OVER_PARAMETER;
                var _rd = PacketEncode(_rdata);
                socket.emit(CS_PACKET_DEF.RES_INPUT_WORD_TIME_OVER,_rd);
                return;                
            } 
            
            let _sid = _data.session_id;
            let _nn = _data.nick_name;
            //세션 체크
            check_session_id(_sid,_nn,(err)=>{
                if(!err){       
                    _rdata.msg_idx = CS_PACKET_DEF.RES_INPUT_WORD_TIME_OVER;
                    _rdata.result = CG_PACKET_ERR.INPUT_WORD_TIME_OVER_SESSION_ID;
                    var _rd = PacketEncode(_rdata);
                    socket.emit(CS_PACKET_DEF.RES_INPUT_WORD_TIME_OVER,_rd);                 
                }else{            
                    this.input_word_time_over(socket,_data);
                }
            });     
        });
        /**
         * 동전 타워 무너지기 done
         */
        socket.on(CS_PACKET_DEF.REQ_TOWER_FALL, (d) => {
            //받은 패켓을 해제
            var _data = PacketDecode(d);         
            let _rdata = {};
            //받은 패켓 체크
            if( _data.session_id === undefined  || _data.session_id === null    || _data.session_id === ""||
            _data.nick_name === undefined   || _data.nick_name === null     || _data.nick_name === ""||
            _data.room_number === undefined || _data.room_number === null   || _data.room_number =="") {
                _rdata.msg_idx = CS_PACKET_DEF.RES_TOWER_FALL;
                _rdata.result = CG_PACKET_ERR.TOWER_FALL_PARAMETER;
                var _rd = PacketEncode(_rdata);
                socket.emit(CS_PACKET_DEF.RES_TOWER_FALL,_rd);
                return;
            }    
            let _sid = _data.session_id;
            let _nn = _data.nick_name;
            //세션 체크
            check_session_id(_sid,_nn,(err)=>{
                if(!err){       
                    _rdata.msg_idx = CS_PACKET_DEF.RES_TOWER_FALL;
                    _rdata.result = CG_PACKET_ERR.TOWER_FALL_SESSION_ID;
                    var _rd = PacketEncode(_rdata);
                    socket.emit(CS_PACKET_DEF.RES_TOWER_FALL,_rd);                 
                }else{            
                    this.tower_fall(socket,_data);
                }
            });            
        });

        /**
         * 방나가기 done
         */
        socket.on(CS_PACKET_DEF.REQ_LEAVE_ROOM, (d) => {
            //받은 패켓을 해제
            var _data = PacketDecode(d);
            let _rdata = {};
            if( _data.session_id === undefined  || _data.session_id === null    || _data.session_id === ""||
            _data.nick_name === undefined   || _data.nick_name === null     || _data.nick_name === ""||
            _data.room_number === undefined || _data.room_number === null   || _data.room_number =="") {
                _rdata.msg_idx = CS_PACKET_DEF.RES_LEAVE_ROOM;
                _rdata.result = CG_PACKET_ERR.LEAVE_ROOM_PARAMETER;
                var _rd = PacketEncode(_rdata);
                socket.emit(CS_PACKET_DEF.RES_LEAVE_ROOM, _rd);
                return;
            }                  

            let _sid = _data.session_id;
            let _nn = _data.nick_name;
            //세션 체크
            check_session_id(_sid,_nn,(err)=>{
                if(!err){       
                    _rdata.msg_idx = CS_PACKET_DEF.RES_LEAVE_ROOM;
                    _rdata.result = CG_PACKET_ERR.LEAVE_ROOM_SESSION_ID;
                    var _rd = PacketEncode(_rdata);
                    socket.emit(CS_PACKET_DEF.RES_LEAVE_ROOM,_rd);                 
                }else{            
                    this.leave_room(socket,_data);
                }
            });                                           
        });

        /**
         * 게임 상태에 대한 결과 알려줌 done
         */
        socket.on(CS_PACKET_DEF.REQ_HOW_GAME, (d) => {
            //받은 패켓을 해제
            var _data = PacketDecode(d);
            let _rdata = {};
            //받은 패켓 체크
            if( _data.session_id === undefined  || _data.session_id === null    || _data.session_id === ""||
            _data.nick_name === undefined   || _data.nick_name === null     || _data.nick_name === ""||
            _data.room_number === undefined || _data.room_number === null   || _data.room_number =="") {
                _rdata.msg_idx = CS_PACKET_DEF.RES_HOW_GAME;
                _rdata.result = CG_PACKET_ERR.HOW_GAME_PARAMETER;
                var _rd = PacketEncode(_rdata);
                socket.emit(CS_PACKET_DEF.RES_HOW_GAME,_rd);         
                return;
            }                           
            
            let _sid = _data.session_id;
            let _nn = _data.nick_name;
            //세션 체크
            check_session_id(_sid,_nn,(err)=>{
                if(!err){       
                    _rdata.msg_idx = CS_PACKET_DEF.RES_HOW_GAME;
                    _rdata.result = CG_PACKET_ERR.HOW_GAME_SESSION;
                    var _rd = PacketEncode(_rdata);
                    socket.emit(CS_PACKET_DEF.RES_HOW_GAME,_rd);                 
                }else{            
                    this.how_game(socket,_data);
                }
            });
        });

        /**
         * 게임 재시작  done
         */
        socket.on(CS_PACKET_DEF.REQ_RE_GAME_START, (d) => {
            //받은 패켓을 해제
            var _data = PacketDecode(d);
            let _rdata = {};
            //받은 패켓 체크
            if( _data.session_id === undefined  || _data.session_id === null    || _data.session_id === ""||
            _data.nick_name === undefined   || _data.nick_name === null     || _data.nick_name === ""||
            _data.room_number === undefined || _data.room_number === null   || _data.room_number =="") {
                _rdata.msg_idx = CS_PACKET_DEF.RES_RE_GAME_START;
                _rdata.result = CG_PACKET_ERR.RE_GAME_START_PARAMETER;
                var _rd = PacketEncode(_rdata);
                socket.emit(CS_PACKET_DEF.RES_RE_GAME_START, _rd);         
                return;
            }                         

            let _sid = _data.session_id;
            let _nn = _data.nick_name;
            //세션 체크
            check_session_id(_sid,_nn,(err)=>{
                if(!err){       
                    _rdata.msg_idx = CS_PACKET_DEF.RES_RE_GAME_START;
                    _rdata.result = CG_PACKET_ERR.RE_GAME_START_SESSION_ID;
                    var _rd = PacketEncode(_rdata);
                    socket.emit(CS_PACKET_DEF.RES_RE_GAME_START,_rd);                 
                }else{            
                    this.re_start(socket,_data);
                }
            });              
        });      

        /**
         * 인게임에서 나가기 done
         */
        socket.on(CS_PACKET_DEF.REQ_GAME_LEAVE_ROOM, (d) => {
            //받은 패켓을 해제
            var _data = PacketDecode(d);
            let _rdata = {};
            //받은 패켓 체크
            if( _data.session_id === undefined  || _data.session_id === null    || _data.session_id === ""||
            _data.nick_name === undefined   || _data.nick_name === null     || _data.nick_name === ""||
            _data.room_number === undefined || _data.room_number === null   || _data.room_number =="") {
                _rdata.msg_idx = CS_PACKET_DEF.RES_GAME_LEAVE_ROOM;
                _rdata.result = CG_PACKET_ERR.GAME_LEAVE_ROOM_PARAMETER;
                var _rd = PacketEncode(_rdata);
                socket.emit(CS_PACKET_DEF.RES_GAME_LEAVE_ROOM,_rd);
                return;         
            }
            let _sid = _data.session_id;
            let _nn = _data.nick_name;
            //세션 체크
            check_session_id(_sid,_nn,(err)=>{
                if(!err){       
                    _rdata.msg_idx = CS_PACKET_DEF.RES_GAME_LEAVE_ROOM;
                    _rdata.result = CG_PACKET_ERR.GAME_LEAVE_ROOM_SESSION;
                    var _rd = PacketEncode(_rdata);
                    socket.emit(CS_PACKET_DEF.RES_GAME_LEAVE_ROOM,_rd);                 
                }else{            
                    this.game_leave_room(socket,_data);
                }
            });                    
        });

        /**
         * 결과처리 done
         */
        socket.on(CS_PACKET_DEF.REQ_GAME_RESULT, (d) => {
            //받은 패켓을 해제
            var _data = PacketDecode(d);
            let _rdata = {};
            //받은 패켓 체크
            if( _data.session_id === undefined  || _data.session_id === null    || _data.session_id === ""||
            _data.nick_name === undefined   || _data.nick_name === null     || _data.nick_name === ""||
            _data.room_number === undefined || _data.room_number === null   || _data.room_number =="") {
                _rdata.msg_idx = CS_PACKET_DEF.RES_GAME_RESULT;
                _rdata.result = CG_PACKET_ERR.GAME_RESULT_PARAMETER;
                var _rd = PacketEncode(_rdata);
                socket.emit(CS_PACKET_DEF.RES_GAME_RESULT, _rd);     
                return;
            }
            let _sid = _data.session_id;
            let _nn = _data.nick_name;
            //세션 체크
            check_session_id(_sid,_nn,(err)=>{
                if(!err){       
                    _rdata.msg_idx = CS_PACKET_DEF.RES_GAME_RESULT;
                    _rdata.result = CG_PACKET_ERR.GAME_RESULT_SESSION_ID;
                    var _rd = PacketEncode(_rdata);
                    socket.emit(CS_PACKET_DEF.RES_GAME_RESULT,_rd);                 
                }else{            
                    this.game_result(socket,_data);
                }
            });                    
        }); 

        /**
         * 서버 재부팅 처리
         */
        socket.on(CS_PACKET_DEF.REQ_JOIN_GAME, (d) => {
            let _data = PacketDecode(d);

            console.log("[[REQ_JOIN_GAME========]]", _data);

            let _rdata = {};
            if( _data.session_id === undefined  || _data.session_id === null    || _data.session_id === ""||
                _data.nick_name === undefined || _data.nick_name === null || _data.nick_name === "") { 
                _rdata.msg_idx = CS_PACKET_DEF.RES_GAME_RESULT;
                _rdata.result = CG_PACKET_ERR.GAME_RESULT_PARAMETER;
                var _rd = PacketEncode(_rdata);
                socket.emit(CS_PACKET_DEF.RES_GAME_RESULT, _rd);     
                return;
            }

            let _sid = _data.session_id;
            let _nn = _data.nick_name;

            //세션 체크
            check_session_id(_sid,_nn, async (err)=>{
                if(!err){       
                    _rdata.msg_idx = CS_PACKET_DEF.RES_GAME_RESULT;
                    _rdata.result = CG_PACKET_ERR.GAME_RESULT_SESSION_ID;
                    var _rd = PacketEncode(_rdata);
                    socket.emit(CS_PACKET_DEF.RES_GAME_RESULT,_rd);                 
                }else{  
                    if(_data.room_number == 'roomNumber000') {
                        await room_pool.replaceSocket(socket.id, _data.session_id);
                    }
                    else {
                        socket.join("room" + _data.room_number, async function() {
                            await room_pool.replaceSocket(socket.id, _data.session_id);
                        });
                    }
                }
            });
        });
    });
}


const update_usercount = require('./call_apiserver').update_usercount;

CPacket.prototype.get_room_list = async function(robby) {
    let _room_list = await get_room_list();
    let _rl_data = {
        "msg_idx": CS_PACKET_DEF.RES_ROOM_LIST,
        "result": CG_PACKET_ERR.SUCCESS,
        "room_list": _room_list
    };
    robby.emit(CS_PACKET_DEF.RES_ROOM_LIST, PacketEncode(_rl_data));    
}

CPacket.prototype.change_room_info = function(robby, room_number, room_title, is_lock, play_time, password) {
    let _rl_data = {
        "msg_idx": CS_PACKET_DEF.RES_CHANGE_ROOM_INFO,
        "result": CG_PACKET_ERR.SUCCESS,
        "data": {
            "room_number": room_number,
            "room_title": room_title,
            "is_lock": is_lock,
            "play_time": play_time,
            "password" : password
        }
    };

    robby.emit(CS_PACKET_DEF.RES_CHANGE_ROOM_INFO, PacketEncode(_rl_data));
}

/**
 * 서버 접속이 끊겨진 소켓을 처리하는 함수
 */
 CPacket.prototype.disconnect = async function(robby, socket){    
    update_usercount(1, (err) => {
        console.log(err);
    });
    try {
        //유저풀에서 소켓아이디로 유저 얻기
        let _usr = await room_pool.getUserBySocket(socket.id);
        if(_usr == null || _usr == undefined) {
            return;
        }
        console.log("[disconnect process]===[socket: " + socket.id + "]===[nickname: " + _usr.nickname + "]===[roomnumber: " + _usr.room_number + "]");
        //룸번호로부터 룸정보 얻기
        let _room = await room_pool.getRoomInfo(_usr.room_number);
        if(_room == null || _room == undefined) {
            console.log("disconnect when room is null or undefined")
            // 유저 삭제
            await room_pool.deleteUser(_usr.session_id, socket.id);
            socket.disconnect();
        }
        else {
            //게임이 진행중일때
            if(_room.state == 4) {
                let _ousr_nick_name = await room_pool.getEnterOtherNickName(_room.room_number, _usr.session_id);
                if(_ousr_nick_name == null) {
                    start_end_game_log(_usr.uuid, _usr.nickname, 
                        1, /*play mode */
                        "",
                        3, /* out */
                        2, /* 승패 */
                        0,
                        _room.start_date, _room.end_date, () => {});
                }
                else {
                    start_end_game_log(_usr.uuid, _usr.nickname,
                        1, /*play mode */
                        _ousr_nick_name,
                        3, /* out */
                        2, /* 승패 */
                        0, 
                        _room.start_date, _room.end_date, () => {});
                }
            }
            //_usr.setDisconnected(true);
            console.log("room is available");
            //룸 떠나기 
            userGameLeave(game, _usr.nickname, _usr.room_number, _room, _usr.session_id);
            //유저삭제
            await room_pool.deleteUser(_usr.session_id, socket.id);
            //게임방 유저수가 0 일때 게임방 정보 삭제 
            if( await room_pool.deleteRoom(_usr.room_number) ) {
                if(_room.is_wait == 1)
                    await this.get_room_list(robby);
            }
        }
    }
    catch(err22) {
        console.log("[socket disconnect err]===============", err22);
    }
}
//게임서버에 접속하기
const log_in = require('./process/login').log_in;
CPacket.prototype.req_login = function(socket,data){  
    
    let _nn     = data.nick_name;
    let _sid    = data.session_id;
    let _ct     = data.character_type;
    var _ip     = socket.handshake.headers["x-forwarded-for"];
  
    console.log("동전쌓기 로그인 처리 클라이언트 리얼 아이피 ===="+_ip);
    let _rdata = {};
    _rdata.msg_idx = CS_PACKET_DEF.RES_LOGIN;

    //로직 처리
    log_in(socket,_ip,_nn,_ct,_sid,(err)=>{        
        _rdata.result = err;
        var _rd = PacketEncode(_rdata);
        socket.emit(CS_PACKET_DEF.RES_LOGIN,_rd);
        return; 
    });
}
//룸 창조
CPacket.prototype.req_create_room = function(robby, socket, data){    

    let _rt = data.room_title;
    let _nn = data.nick_name;
    let _l  = data.is_lock;
    let _pw = data.password;
    let _is = data.is_single;
    let _ct = data.character_type;
    let _bg = data.back_ground;
    let _pt = data.play_time;
    let _si = data.session_id;

    var _rdata = {};
    //룸 창조
    create_room(socket,_rt,_nn,_l,_pw,_is,_ct,_bg,_pt, _si, async (err,reply)=>{

        console.log("[req_create_room] == create_room err", err);

        if(err != CG_PACKET_ERR.SUCCESS){     
            _rdata.msg_idx =CS_PACKET_DEF.RES_CREATE_ROOM;
            _rdata.result=err;
            var _rd = PacketEncode(_rdata);
            socket.emit(CS_PACKET_DEF.RES_CREATE_ROOM, _rd);
            return;
        }else{
            let _ip = WebConfig.getDNS(process.env.NODE_ENV || 'development');
            console.log("req_create_room(@"+process.env.NODE_ENV+") - _IP : "+_ip);
            let _rn = reply; //룸넘버

            _rdata.msg_idx       = CS_PACKET_DEF.RES_CREATE_ROOM;
            _rdata.result        = CG_PACKET_ERR.SUCCESS;
            _rdata.room_number   = _rn;
            _rdata.is_lock       = _l;
            _rdata.room_title    = _rt,
            _rdata.is_single     = _is;
            _rdata.back_ground   = _bg;
            _rdata.play_time     = _pt;

            if(parseInt(_is)) {
                character_suffle();
                var _bot = get_bot_character(_ct);
                // character_type --> redis에 저장해야 할 정보!!!!
                _rdata.bot_character_type = _bot.getType(); 
            }
            var _rd = PacketEncode(_rdata);  
            socket.emit(CS_PACKET_DEF.RES_CREATE_ROOM, _rd);
            await this.get_room_list(robby);
        }        

    });
}
//룸 옵션 변경하기
CPacket.prototype.req_change_room_option = function(robby, socket,data){
    let _rn = data.room_number;
    let _rt = data.room_title;
    let _bg = data.back_ground;
    let _il = data.is_lock;
    let _pw = data.password;
    let _pt = data.play_time;
    let _nn = data.nick_name;
    let _si = data.session_id;

    let _rdata={};
    change_room_option(_rn,_nn,_rt,_bg,_il,_pw,_pt, _si, (err)=>{
        _rdata.msg_idx = CS_PACKET_DEF.RES_CHANGE_ROOM_OPTION;       
        if(err === CG_PACKET_ERR.SUCCESS){ //성공
            _rdata.result = CG_PACKET_ERR.SUCCESS;
            var _rd = PacketEncode(_rdata);
            socket.emit(CS_PACKET_DEF.RES_CHANGE_ROOM_OPTION, _rd);

            this.change_room_info(robby, _rn, _rt, _il, _pt,_pw);
        }else{ //실패
            _rdata.result = err;
            var _rd = PacketEncode(_rdata);
            socket.emit(CS_PACKET_DEF.RES_CHANGE_ROOM_OPTION,_rd);
        }
    });
}
//룸 입장하기
CPacket.prototype.req_enter_room = function(robby, socket, data){
    let _rn = data.room_number;
    let _nn = data.nick_name;
    let _pw = data.password;
    let _si = data.session_id;

    console.log('req_enter_room socket '+socket.id);
    let _rdata = {};
    //룸 입장
    enter_room(_rn, _nn, _pw, game, socket, _si, async (err)=>{
        if(err != CG_PACKET_ERR.SUCCESS) {
            _rdata.msg_idx = CS_PACKET_DEF.RES_ENTER_ROOM;
            _rdata.result = err;
            var _rd = PacketEncode(_rdata);
            socket.emit(CS_PACKET_DEF.RES_ENTER_ROOM,_rd);
        }
        else {
            await this.get_room_list(robby);
        }
    });
}

/**
 * 게임 준비..
 */
CPacket.prototype.req_game_ready = function(socket,data){
    let _rn = data.room_number;
    let _nn = data.nick_name;
    let _si = data.session_id;
    let _rdata={};
    game_ready(game, socket, _rn,_nn, _si, (err)=>{
        _rdata.mag_idx = CS_PACKET_DEF.RES_GAME_READY;
        _rdata.result = err;
        var _rd = PacketEncode(_rdata);
        socket.emit(CS_PACKET_DEF.RES_GAME_READY,_rd);
    });
}

/**
 * 새 단어 요청
 */
CPacket.prototype.req_new_word = function(socket,data){
    let _rn = data.room_number;
    let _nn = data.nick_name;
    let _si = data.session_id;
    let _rdata ={};
    new_word(game, _rn,_nn, _si, (err)=>{
        _rdata.msg_idx = CS_PACKET_DEF.RES_NEW_WORD;
        _rdata.result = err;
        var _rd = PacketEncode(_rdata);
        socket.emit(CS_PACKET_DEF.RES_NEW_WORD,_rd);
    });
}

/**
 * 단어 체크
 */
CPacket.prototype.req_check_word = function(socket,data){
    let _rn = data.room_number;
    let _nn = data.nick_name;
    let _w  = data.word;
    let _cly = data.coin_line_type;
    let _bcc = data.bad_coin_count;
    let _si = data.session_id;
    let _rdata = {};

    check_word(game, _rn,_nn,_w,_cly,_bcc, _si, (err)=>{
        _rdata.msg_idx = CS_PACKET_DEF.RES_CHECK_WORD;
        _rdata.result = err;
        var _rd = PacketEncode(_rdata);
        socket.emit(CS_PACKET_DEF.RES_CHECK_WORD,_rd);
    });
}

/**
 * 단어 입력 시간 초과 처리
 */
 CPacket.prototype.input_word_time_over = function(socket,data){
    let _rn = data.room_number;
    let _nn = data.nick_name;
    let _si = data.session_id;

    let _rdata = {};
    input_word_time_over(game, socket, _rn,_nn, _si, (err)=>{
        _rdata.msg_idx = CS_PACKET_DEF.RES_INPUT_WORD_TIME_OVER;
        _rdata.result = err;
        var _rd = PacketEncode(_rdata);
        socket.emit(CS_PACKET_DEF.RES_INPUT_WORD_TIME_OVER,_rd);
    });
 }

 /**
 * 동전 타워 무너질때 처리
 */
 CPacket.prototype.tower_fall = function(socket,data){
    let _rn = data.room_number;
    let _nn = data.nick_name;
    let _si = data.session_id;

    let _rdata={};
    tower_fall(game, socket, _rn,_nn, _si, (err)=>{
        _rdata.msg_idx = CS_PACKET_DEF.RES_TOWER_FALL;
        _rdata.result = err;
        var _rd = PacketEncode(_rdata);
        socket.emit(CS_PACKET_DEF.RES_TOWER_FALL,_rd);

    });
 }


 //결과 처리
 CPacket.prototype.game_result = function(socket,data){
    let _rn = data.room_number;
    let _nn = data.nick_name;
    let _si = data.session_id;
    let _rdata={};
    game_result(game, _rn,_nn, _si, (err)=>{
        _rdata.msg_idx = CS_PACKET_DEF.RES_TOWER_FALL;
        _rdata.result = err;
        var _rd = PacketEncode(_rdata);
        socket.emit(CS_PACKET_DEF.RES_TOWER_FALL,_rd);

    });
 }

 //방 떠나기
 CPacket.prototype.leave_room = function(socket,data){
    let _rn = data.room_number;
    let _nn = data.nick_name;
    let _si = data.session_id;
    leave_room(game, _rn,_nn, _si, (err)=>{
        let _rdata={};
         _rdata.msg_idx = CS_PACKET_DEF.RES_LEAVE_ROOM;
         _rdata.result = err;
         var _rd = PacketEncode(_rdata);
         socket.emit(CS_PACKET_DEF.RES_LEAVE_ROOM,_rd);
        //socket.disconnect(true);
    });    
 }

 //인게임 떠나기
 CPacket.prototype.game_leave_room = function(socket, data){
    let _rn = data.room_number;
    let _nn = data.nick_name;
    let _si = data.session_id;
    game_leave_room(game, socket, _rn,_nn, _si, (err)=>{
        let _rdata={};
         _rdata.msg_idx = CS_PACKET_DEF.RES_GAME_LEAVE_ROOM;
         _rdata.result = err;
         var _rd = PacketEncode(_rdata);
         socket.emit(CS_PACKET_DEF.RES_GAME_LEAVE_ROOM,_rd);
    });
 }

 //게임 재시작
 CPacket.prototype.re_start = function(socket,data){
    let _rn = data.room_number;
    let _nn = data.nick_name;
    let _si = data.session_id;
    let _rdata ={};
    re_game_start(game, _rn,_nn, _si, (err)=>{
        _rdata.msg_idx = CS_PACKET_DEF.RES_RE_GAME_START;
        _rdata.result = err;
        var _rd = PacketEncode(_rdata);
        socket.emit(CS_PACKET_DEF.RES_RE_GAME_START,_rd);        
    });

 }

 //게임 상태 체크
 CPacket.prototype.check_room = function(socket, data){

    let _rn = data.room_number;
    let _nn = data.nick_name;
    let _si = data.session_id;
    let _rdata ={};
    check_room(socket, _rn,_nn, _si, (err)=>{
        _rdata.msg_idx = CS_PACKET_DEF.RES_CHECK_ROOM;
        _rdata.result = err;
        var _rd = PacketEncode(_rdata);
        socket.emit(CS_PACKET_DEF.RES_CHECK_ROOM,_rd);        
    });    

 }

 //게임 상태에 대한 처리
 CPacket.prototype.how_game = function(socket,data){
    let _rn = data.room_number;
    let _nn = data.nick_name;
    let _si = data.session_id;
    let _rdata ={};
    how_game(game, _rn, _nn, _si, (err)=>{
        _rdata.msg_idx = CS_PACKET_DEF.RES_HOW_GAME;
        _rdata.result = err;
        var _rd = PacketEncode(_rdata);
        socket.emit(CS_PACKET_DEF.RES_HOW_GAME,_rd);        
    });    
 }

//exports.invite = function(room_number,nick_name,to_nick_name,callback){
//초대 보내기
CPacket.prototype.req_invite = function(socket,data){
    let _rn     = data.room_number;
    let _fnn    = data.from_nick_name;
    let _tnn    = data.to_nick_name;
    let _fsi     = data.session_id;
    let _rdata  = {};
    invite(_rn,_fnn,_tnn, _fsi, (err)=>{
        _rdata.msg_idx = CS_PACKET_DEF.RES_INVITE;
        _rdata.result = err;
        var _rd = PacketEncode(_rd);
        socket.emit(CS_PACKET_DEF.RES_INVITE,_rd);        
    });
}

CPacket.prototype.checkRoomListStatus = async function() {
    let _res = await room_pool.checkRoomListForRemove();
    
    if(_res.ret_code == 1) {
        if(robby != null) {
            let _room_list = await get_room_list();
            let _rl_data = {
                "msg_idx": CS_PACKET_DEF.RES_ROOM_LIST,
                "result": CG_PACKET_ERR.SUCCESS,
                "room_list": _room_list
            };
            robby.emit(CS_PACKET_DEF.RES_ROOM_LIST, PacketEncode(_rl_data));    
        }
        if(_res.room_number.length > 0 && game != null) {
            for(let i = 0; i < _res.room_number.length; i ++) {
                let _d = PacketEncode({
                    "msg_idx": CS_PACKET_DEF.RES_ROOM_LIST,
                    "result": CG_PACKET_ERR.SUCCESS,
                    "roomNum": _res.room_number
                });
                game.to('room' + _res.room_number[i]).emit(CS_PACKET_DEF.YOU_FIRE, _d);
            }   
        }
    }
}


//세션 체크
function check_session_id(session_id,nick_name,callback){
    if (/^Guest[_][0-9a-zA-Z]{6}$/.test(session_id)) {
        callback(true);
    }else{
        get_session_id(nick_name,(err,data)=>{
            if(err != CG_PACKET_ERR.SUCCESS){
                callback(false);
            }else{
                if(data.session_id !=session_id){
                    callback(false);
                }else{
                    callback(true);
                }
            }
        });
    }
}

let g_packet = new CPacket();

module.exports = g_packet;