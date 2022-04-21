const room_pool             = require('../RoomPool');
const CG_PACKET_ERR         = require('../packet_err').CG_PACKET_ERR;
const CS_PACKET_DEF         = require('../packet_def').CS_PACKET_DEF;
const PacketEncode          = require('../../common/util').PacketEncode;

exports.game_result = async function(game, room_number, nick_name, session_id, callback) {
    try {
        //룸번호로 룸 가져오기
        let _room = await room_pool.getRoomInfo(room_number);
        //룸이 비였는가 판단
        if(_room === undefined || _room === null)                      {
            callback(CG_PACKET_ERR.GAME_RESULT_ROOM);        
            return;    
        }
        //룸이 끝났는가 판단
        if(_room.state != 7) {
            callback(CG_PACKET_ERR.GAME_RESULT_GAME_OVER);                
            return;
        }
        //세션아이디로 유저정보 가져오기
        let _user = await room_pool.getUserBySessionId(session_id, room_number);
        if(_user == null || _user == undefined) {
            callback(CG_PACKET_ERR.GAME_RESULT_USER);
            return;    
        }
        let _rdata = await room_pool.gameResult(room_number, session_id);
        if(_rdata != null) {
            let _d = PacketEncode(_rdata);
            game.to(_user.socket).emit(CS_PACKET_DEF.RES_GAME_RESULT, _d);
        }
        
    }
    catch(err22) {
        console.log("[GAME_RESULT ERR]========", err22);
    }
}
