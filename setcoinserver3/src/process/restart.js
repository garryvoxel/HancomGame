const room_pool             = require('../RoomPool');
const CG_PACKET_ERR         = require('../packet_err').CG_PACKET_ERR;
const CS_PACKET_DEF         = require('../packet_def').CS_PACKET_DEF;
const PacketEncode      = require('../../common/util').PacketEncode;
/**
 * 
 * @param {* 게임방번호} room_number 
 * @param {* 닉네임} nick_name 
 * @param {* 콜백} callback 
 */
exports.re_game_start = async function(game, room_number, nick_name, session_id, callback){
    try {
        //룸번호로 룸 가져오기
        let _room = await room_pool.getRoomInfo(room_number);
        //룸이 비였는가 판단
        if(_room === undefined || _room === null)    {
            callback(CG_PACKET_ERR.RE_GAME_START_ROOM);
            return;
        }
        //세션아이디로 유저정보 가져오기
        let _user = await room_pool.getUserBySessionId(session_id, room_number);
        if(_user === undefined || _user === null) {
                callback(CG_PACKET_ERR.RE_GAME_START_USER);
                return;
        }
        //상대방 유저 가져오기
        let _ouser = await room_pool.getOtherUser(room_number, session_id);
        if(_ouser === undefined || _ouser === null) {
                callback(CG_PACKET_ERR.RE_GAME_START_OTHER_USER);
                return;
        }

        await room_pool.setUserDetailInfo(session_id, {restart: 1});

        let _rdata1 = {};
        let _rdata2 = {};

        _rdata1.msg_idx = CS_PACKET_DEF.RES_RE_GAME_START;
        _rdata1.result = CG_PACKET_ERR.SUCCESS;
        
        let _d1 = PacketEncode(_rdata1);
        game.to(_user.socket).emit(CS_PACKET_DEF.RES_RE_GAME_START,_d1);

        //상대방에게 게임재시작 요청을 알려줌
        _rdata2.msg_idx = CS_PACKET_DEF.USER_RE_GAME_START;
        _rdata2.nick_name = nick_name;
        let _d2 = PacketEncode(_rdata2);
        game.to(_ouser.socket).emit(CS_PACKET_DEF.USER_RE_GAME_START,_d2);

        if( (await room_pool.reGameStart(room_number)) )  {
            let _rdata = {
                msg_idx:CS_PACKET_DEF.GAME_START,
                result:0
            };
            let _d = PacketEncode(_rdata);

            game.to("room" + room_number).emit(CS_PACKET_DEF.RE_GAME_START, _d);
        }
    }
    catch(err22) {
        console.log("[RE_GAME_START  err]===========", err22);    
    }
}