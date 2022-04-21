const room_pool         = require('../RoomPool');
const CG_PACKET_ERR     = require('../packet_err').CG_PACKET_ERR;
const CS_PACKET_DEF     = require('../packet_def').CS_PACKET_DEF;
const PacketEncode      = require('../../common/util').PacketEncode;
exports.tower_fall = async function(game, socket, room_number,nick_name, session_id, callback){
    try {
        //룸번호로 륨 가져오기
        let _room = await room_pool.getRoomInfo(room_number);
        //룸이 비였는가 판단
        if(_room === undefined || _room === null)     {
            callback(CG_PACKET_ERR.TOWER_FALL_ROOM);        
            return;    
        }
        
        let _ret = await room_pool.inputWordTimeOver(room_number, nick_name, session_id);
        if(_ret == null)
            return;
        
        if(_ret.RES_CODE == 1) {
            callback(CG_PACKET_ERR.TOWER_FALL_OTHER_USER);        
            return;
        }
        if(_ret.RES_CODE == 4) {
            callback(CG_PACKET_ERR.TOWER_FALL_USER);        
            return;
        }

        if(_ret.RES_CODE == 2) {
            let _rdata = {};
            _rdata.msg_idx = CS_PACKET_DEF.RES_TOWER_FALL;
            _rdata.result = CG_PACKET_ERR.TOWER_FALL_HEART_COUNT;    
            let _d = PacketEncode(_rdata);
            socket.emit(CS_PACKET_DEF.RES_TOWER_FALL,_d);
            return;
        }

        if(_ret.RES_CODE == 3) {
            let _rdata1 = {
                msg_idx: CS_PACKET_DEF.RES_TOWER_FALL,
                result: CG_PACKET_ERR.SUCCESS,
                heart_count: _ret.DATA.heart_count,
                is_combo_attack : _ret.DATA.is_combo_attack,
                combo_attack_type : _ret.DATA.combo_attack_type,
                combo_count: _ret.DATA.combo_count
            };

            let _rdata2 = {
                msg_idx:CS_PACKET_DEF.TOWER_FALL,        
                nick_name: _ret.DATA.nick_name,
                heart_count: _ret.DATA.heart_count,
                is_combo_attack : _ret.DATA.is_combo_attack,
                combo_attack_type : _ret.DATA.combo_attack_type,
                combo_count: _ret.DATA.combo_count
            };

            let _d1 = PacketEncode(_rdata1);
            let _d2 = PacketEncode(_rdata2);

            game.to(_ret.DATA.usr_socket).emit(CS_PACKET_DEF.RES_TOWER_FALL,_d1);
            game.to(_ret.DATA.ousr_socket).emit(CS_PACKET_DEF.TOWER_FALL,_d2);

            if(parseInt(_ret.DATA.heart_count) == 0) {
                if(_room.state == 7)
                    return;

                //게임오버 처리해야함...        
                console.log('tower_fall >> heart count is zero..');
                let _rdata = {};
                _rdata.msg_idx = CS_PACKET_DEF.GAME_OVER;
                _rdata.result = CG_PACKET_ERR.SUCCESS;

                let _d = PacketEncode(_rdata);
                game.to('room' + room_number).emit(CS_PACKET_DEF.GAME_OVER, _d);                                
                
                let _game_over_time = TIME.getTime();
                await room_pool.setRoomDetailInfo(room_number, {state: 7, game_over_time: _game_over_time, end_date: TIME.getYMD(_game_over_time)})
                return;
            }

        }
    }
    catch(err22) {      
        console.log("[TOWER_FALL  err]===========", err22);
    }
}