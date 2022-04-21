const room_pool         = require('../RoomPool');
const CG_PACKET_ERR     = require('../packet_err').CG_PACKET_ERR;
const CS_PACKET_DEF     = require('../packet_def').CS_PACKET_DEF;
const SS_PACKET_DEF     = require('../packet_def').SS_PACKET_DEF;
const PUBSUB            = require('./../pubsub');
const TIME              = require('./../../common/time');
const PacketEncode      = require('../../common/util').PacketEncode;

async function userLeave(game, user_name, room_number, _room, session_id) {
    let _ret = await room_pool.userExitFromRoom(session_id, room_number);
    if( _ret == null )
        return false;
        
    if(_room.state == 4 || _room.state == 5) {
        let _rdata = {};
        _rdata.msg_idx = CS_PACKET_DEF.GAME_OVER;
        _rdata.result  = CG_PACKET_ERR.SUCCESS;
        let _d = PacketEncode(_rdata);
        
        for(let index = 0; index < _ret.length; index ++)
            game.to(_ret[index]).emit(CS_PACKET_DEF.GAME_OVER, _d);
        
        let _game_over_time = TIME.getTime();
        await room_pool.setRoomDetailInfo(room_number, {state: 7, game_over_time: _game_over_time, end_date: TIME.getYMD(_game_over_time)})
    }

    let _rdata = {};
    _rdata.msg_idx      = SS_PACKET_DEF.USER_GAME_LEAVE;
    _rdata.nick_name    = user_name;
    PUBSUB.on_publish(_rdata);
    
    return true;
}


/**
 * 게임방 탈퇴
 * @param {*유저 소켓} socket 
 * @param {*방번호} room_number 
 * @param {*닉네임} nick_name 
 */
exports.game_leave_room = async function(game, socket, room_number, nick_name, session_id, callback){
    try {
        //룸번호로 룸가져오기
        let _room = await room_pool.getRoomInfo(room_number);
        //룸이 비였는가 판단
        if(_room === undefined || _room === null)     {
            callback(CG_PACKET_ERR.GAME_LEAVE_ROOM_ROOM);
            return;    
        }
        //세션아이디로 유저정보 가져오기
        let _user = await room_pool.getUserBySessionId(session_id, room_number);
        if(_user === undefined || _user === null) {
            callback(CG_PACKET_ERR.GAME_LEAVE_ROOM_USER);
            return;    
        }
        //상대방 유저 정보 가져오기
        let _ousr = await room_pool.getOtherUser(room_number, session_id);
        if(_ousr === undefined || _ousr === null) {
            if(parseInt(_room.current_user_count) == 1) {
                await userLeave(game, nick_name, room_number, _room, session_id);
                callback(CG_PACKET_ERR.SUCCESS);
            }       
            return;    
        }

        let _rdata1={};
        _rdata1.msg_idx = CS_PACKET_DEF.RES_GAME_LEAVE_ROOM;
        _rdata1.result = CG_PACKET_ERR.SUCCESS;
        let _d1 = PacketEncode(_rdata1);
        game.to(_user.socket).emit(CS_PACKET_DEF.RES_GAME_LEAVE_ROOM,_d1);
        callback(CG_PACKET_ERR.SUCCESS);
    }    
    catch(err22) {
        console.log("[[GAME_LEAVE_ROOM]]======", err22);
    }
}