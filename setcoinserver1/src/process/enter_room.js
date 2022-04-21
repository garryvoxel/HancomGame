const CS_PACKET_DEF     = require('../packet_def').CS_PACKET_DEF;
const CG_PACKET_ERR     = require('../packet_err').CG_PACKET_ERR;
const room_pool         = require('../RoomPool');
const user_pool         = require('../UserPool');
const PUBSUB            = require('../pubsub');
const TIME              = require('../../common/time');
const PacketEncode      = require('../../common/util').PacketEncode;
const clear_room_info   = require('../call_apiserver').clear_room_info;
/**
 * 게임방 입장하기
 * @param {*방번호} room_number 
 * @param {*닉네임} nick_name 
 * @param {*방비번} password 
 * @param {*} callback 
 */
exports.enter_room = async function(room_number, nick_name, password, game, socket, session_id, callback){
    try {
        // 게임방 정보 가져오기
        let _room_info = await room_pool.getRoomInfo(room_number);

        console.log("[[enter_room get room info]]", _room_info);

        if(_room_info === null) {
            callback(CG_PACKET_ERR.ENTER_ROOM_ROOM);
            return;    
        }
        // 게임방 상태 create_room이 아닌 경우
        if(_room_info.state != '1') {
            callback(CG_PACKET_ERR.ENTER_ROOM_GAME_PLAYING);
            return;
        }
        // 방장정보 가져오기
        let _hu = await room_pool.getMaster(room_number);

        console.log("[[enter_room get master]]", _hu, nick_name);

        if(_hu === undefined || _hu === null) {
            callback(CG_PACKET_ERR.ENTER_ROOM_HOST_USER);
            return;
        }
        // 입장유저와 방장 닉네임 체크
        if(_hu.nickname == nick_name) {
            callback(CG_PACKET_ERR.ENTER_ROOM_HOST_USER);
            return;
        }
        // 닉네임으로 유저정보 가져오기
        let _eu = await room_pool.getUserDetailBySessionId(session_id);

        if(_eu === undefined || _eu === null) {
            callback(CG_PACKET_ERR.ENTER_ROOM_ENTER_USER);
            return;
        }

        if(_room_info.is_lock == '1') {
            if(_room_info.password.toString() != password.toString())     {
                callback(CG_PACKET_ERR.ENTER_ROOM_PASSWORD);
                return;
            }
        }
        //입장 api 호출
        if( !(await room_pool.enterRoom(room_number, session_id)) ) {
            callback(CG_PACKET_ERR.ENTER_ROOM_ROOM);
            return;    
        }
        
        // 소켓 룸 join
        socket.join("room" + room_number, function() {
        });

        //호스트에게 전달
        let _rdata1 = {};
        _rdata1.msg_idx                     = CS_PACKET_DEF.USER_ENTER_ROOM;
        _rdata1.enter_user_nick_name        = _eu.nickname;
        _rdata1.enter_user_character_type   = parseInt(_eu.character_type);
        

        console.log("[[HOST_ENTER_ROOM]]===============", _rdata1);

        game.to(_hu.socket).emit(CS_PACKET_DEF.USER_ENTER_ROOM, PacketEncode(_rdata1));

        //입장한 사람에게 전달..
        let _rdata2 = {};
        _rdata2.msg_idx                     = CS_PACKET_DEF.RES_ENTER_ROOM;
        _rdata2.result                      = CG_PACKET_ERR.SUCCESS;
        _rdata2.host_user_nick_name         = _hu.nickname;
        _rdata2.host_user_character_type    = parseInt(_hu.character_type);    
        _rdata2.back_ground                 = parseInt(_room_info.back_ground); //_room.getBackGround();
        _rdata2.play_time                   = parseInt(_room_info.play_time);   //get_converse_play_time(_room.getPlayTime());
        _rdata2.room_title                  = _room_info.room_title;            //_room.getTitle();


        console.log("[[OTHER_ENTER_ROOM]]===============", _rdata2);

        game.to(_eu.socket).emit(CS_PACKET_DEF.RES_ENTER_ROOM,PacketEncode(_rdata2));

        callback(CG_PACKET_ERR.SUCCESS);

        //GCServer에 유저 상태값 변경 통보
        //GCServer에서 유저상태 lobby에서 ingame상태로 변경
        let _rdata={};
        _rdata.msg_idx      = "user_game_playing";
        _rdata.nick_name    = nick_name;
        console.log('pubsub start....');
        PUBSUB.on_publish(_rdata);
        console.log('pubsub end....');
    }
    catch(err22){
        console.log("[enter_room err==========]", err22);
    }
}