const room_pool         = require('../RoomPool');
const CG_PACKET_ERR     = require('../packet_err').CG_PACKET_ERR;
const CS_PACKET_DEF     = require('../packet_def').CS_PACKET_DEF;
const PacketEncode      = require('../../common/util').PacketEncode;

/**
 * 게임방 체크 & 게임방 참가 인원이 2명이상인지 체크
 * @param {*방번호} room_number 
 * @param {*닉네임} nick_name 
 * @param {*} callback 
 */
 exports.check_room = async function(socket, room_number, nick_name, session_id, callback){
    try {
        //룸정보 가져오기
        let _room_info = await room_pool.getRoomInfo(room_number);
        if(_room_info === undefined || _room_info === null) {
            callback(CG_PACKET_ERR.CHECK_ROOM_ROOM);
            return;       
        }

        //게임방에서 세션아이디로 유저정보 가져오기
        let _usr = await room_pool.getUserBySessionId(session_id, room_number);
        if(_usr === undefined || _usr === null) {
            callback(CG_PACKET_ERR.CHECK_ROOM_USER);
            return;
        }

        let _rdata = {};
        _rdata.msg_idx = CS_PACKET_DEF.RES_CHECK_ROOM;
        
        //게임방 참여인원수가 2명 인지 체크
        if(parseInt(_room_info.current_user_count) < 2) {
            _rdata.result = CG_PACKET_ERR.CHECK_ROOM_USER_COUNT;
        } else {
            _rdata.result = CG_PACKET_ERR.SUCCESS;
        }
        let _d = PacketEncode(_rdata);
        socket.emit(CS_PACKET_DEF.RES_CHECK_ROOM, _d);
    }
    catch(err22) {
        console.log("[err22]================", err22);
    }
}
