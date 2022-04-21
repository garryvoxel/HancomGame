const room_pool         = require('../RoomPool');
const user_pool         = require('../UserPool');
const CG_PACKET_ERR     = require('../packet_err').CG_PACKET_ERR;
const CS_PACKET_DEF     = require('../packet_def').CS_PACKET_DEF;
const SS_PACKET_DEF     = require('../packet_def').SS_PACKET_DEF;
const PacketEncode      = require('../../common/util').PacketEncode;
const PUBSUB            = require('./../pubsub');
const TIME              = require('./../../common/time');

async function userLeave(game, user_name, room_number, _room, session_id) {
    try {
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
            await room_pool.setRoomDetailInfo(room_number, {state: 7, game_over_time: _game_over_time, end_date: TIME.getYMD(_game_over_time)});
        }

        let _rdata = {};
        _rdata.msg_idx      = SS_PACKET_DEF.USER_GAME_LEAVE;
        _rdata.nick_name    = user_name;
        PUBSUB.on_publish(_rdata);
        return true;
    }
    catch(err22) {
        console.log("[userLeave ERR]", err22);
    }
}


exports.userGameLeave = async function(game, nickname, room_number, _room, session_id) {
    let _ret = await room_pool.userExitFromRoom(session_id, room_number);
    if( _ret == null )
        return false;
    
    if(_room.state == 4 || _room.state == 5) {
        let _rdata = {};
        _rdata.msg_idx = CS_PACKET_DEF.GAME_OVER;
        _rdata.result = CG_PACKET_ERR.SUCCESS;

        let _d = PacketEncode(_rdata);

        for(let index = 0; index < _ret.length; index ++) 
            game.to(_ret[index]).emit(CS_PACKET_DEF.GAME_OVER, _d);
        
        let _game_over_time = TIME.getTime();
        await room_pool.setRoomDetailInfo(room_number, {state: 7, game_over_time: _game_over_time, end_date: TIME.getYMD(_game_over_time)});
    } else {
        console.log("userGameLeave: room state : " + _room.state);
        //"ENTER_FINISHED":2,
        //"GAME_PLAY_READY":3,
        if(_room.state == 2 || _room.state == 3) {
            console.log('send game start .....' + _ret.length);
            if(_ret.length == 1) {
                console.log('send game start fail......' + _ret[0]);
            }
        }
    }

    if(_ret.length == 1) {
        console.log('userGameLeave.....send.');
        let _rdata = {};
        _rdata.msg_idx = CS_PACKET_DEF.USER_GAME_LEAVE_ROOM;
        _rdata.leave_nick_name = nickname;
        let _d = PacketEncode(_rdata);
        game.to(_ret[0]).emit(CS_PACKET_DEF.USER_GAME_LEAVE_ROOM, _d);
    }

    //GCServer에 유저 상태값 변경 통보
    let _rdata1 = {};
    _rdata1.msg_idx         = SS_PACKET_DEF.USER_GAME_LEAVE;
    _rdata1.nick_name       = nickname;
    PUBSUB.on_publish(_rdata1);

    return true;
}

//방 떠나기
exports.leave_room = async function(game, room_number, nick_name, session_id, callback){    
    try {
        //룸번호로 룸가져오기
        let _room = await room_pool.getRoomInfo(room_number);
        //룸이 비엿는가 판단
        if(_room === undefined || _room === null)     {
            callback(CG_PACKET_ERR.LEAVE_ROOM_ROOM);
            return;    
        }
        //세션아이디로 유저정보 가져오기
        let _user = await room_pool.getUserBySessionId(session_id, room_number);
        if(_user === undefined || _user === null) {
            callback(CG_PACKET_ERR.LEAVE_ROOM_USER);
            return;    
        }
        //상대방 유저 가져오기
        let _ousr = await room_pool.getOtherUser(room_number, session_id);

        if(_ousr === undefined || _ousr === null) {
            if(parseInt(_room.current_user_count) == 1) {
                await userLeave(game, nick_name, room_number, _room, session_id);
                callback(CG_PACKET_ERR.SUCCESS);
            }
            return;
        }

        let _rdata = {};
        _rdata.msg_idx = CS_PACKET_DEF.USER_LEAVE_ROOM;
        _rdata.leave_nick_name = nick_name;
        let _d = PacketEncode(_rdata);
        game.to(_ousr.socket).emit(CS_PACKET_DEF.USER_LEAVE_ROOM, _d);

        let _rdata1 = {};
        _rdata1.msg_idx = CS_PACKET_DEF.RES_LEAVE_ROOM;
        _rdata1.result = 0;
        let _d1 = PacketEncode(_rdata1);
        game.to(_user.socket).emit(CS_PACKET_DEF.RES_LEAVE_ROOM,_d1);
        
       if( !(await userLeave(game, nick_name, room_number, _room)) ) {
            callback(CG_PACKET_ERR.LEAVE_ROOM_IN_ROOM);
            return;
       }
       callback(CG_PACKET_ERR.SUCCESS);
    }
    catch(err22) {
        console.log("[[leave_room]]======", err22);
    }
}