const room_pool         = require('../RoomPool');
const CG_PACKET_ERR     = require('../packet_err').CG_PACKET_ERR;
const CS_PACKET_DEF     = require('../packet_def').CS_PACKET_DEF;
const PacketEncode      = require('../../common/util').PacketEncode;
const TIME              = require('../../common/time');

exports.how_game = async function(game, room_number, nick_name, session_id, callback){
    try {
        //룸번호로 룸가져오기
        let _room = await room_pool.getRoomInfo(room_number);
        //룸이 비였는가 판단
        if(_room === undefined || _room === null)         {
            callback(CG_PACKET_ERR.HOW_GAME_ROOM);
            return;                
        }
        //세션아이디로 유저정보 가져오기
        let _usr = await room_pool.getUserBySessionId(session_id, room_number);
        if(_usr === undefined || _usr === null) {
            callback(CG_PACKET_ERR.HOW_GAME_USER);
            return;                
        }
        
        //방의 유저가 2 아래일때
        if(_room.current_user_count < 2) {
            //진행중이거나 끝나기 30초전일때
            if(_room.state == 4 || _room.state == 5) {
                let _rdata = {};
                _rdata.msg_idx  = CS_PACKET_DEF.RES_HOW_GAME;
                _rdata.result   = CG_PACKET_ERR.HOW_GAME_USER_COUNT;

                let _d = PacketEncode(_rdata);
                game.to(_usr.socket).emit(CS_PACKET_DEF.RES_HOW_GAME, _d);
         
                if(_room.state != 7) {
                    let _rdata = {};
                    _rdata.msg_idx = CS_PACKET_DEF.GAME_OVER;
                    _rdata.result = CG_PACKET_ERR.SUCCESS;
                    let _d = PacketEncode(_rdata);
                    game.to(_usr.socket).emit(CS_PACKET_DEF.GAME_OVER, _d);
                    let _game_over_time = TIME.getTime();
                    await room_pool.setRoomDetailInfo(room_number, {state: 7, game_over_time: _game_over_time, end_date: TIME.getYMD(_game_over_time)});
                }

            }
            else {
                let _rdata = {};
                _rdata.msg_idx = CS_PACKET_DEF.GAME_START_FAIL;

                let _d = PacketEncode(_rdata);
                game.to(_usr.socket).emit(CS_PACKET_DEF.GAME_START_FAIL, _d);
            }
        }
        else {
            let _rdata = {};
            _rdata.msg_idx  = CS_PACKET_DEF.RES_HOW_GAME;
            _rdata.result   = CG_PACKET_ERR.SUCCESS;
            let _d = PacketEncode(_rdata);
            game.to(_usr.socket).emit(CS_PACKET_DEF.RES_HOW_GAME, _d);
        }
    }    
    catch(err22) {
        console.log("[HOW_GAME  err]===========", err22);    
    }
}