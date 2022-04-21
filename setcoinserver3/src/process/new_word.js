const room_pool         = require('../RoomPool');
const CG_PACKET_ERR     = require('../packet_err').CG_PACKET_ERR;
const CS_PACKET_DEF     = require('../packet_def').CS_PACKET_DEF;
const TIME              = require('../../common/time');
const PacketEncode      = require('../../common/util').PacketEncode;

exports.new_word = async function(game, room_number, nick_name, session_id, callback){
    try {
        //룸번호로 룸 가져오기
        let _room = await room_pool.getRoomInfo(room_number);
        //룸이 비었는지 판단
        if(_room === undefined || _room === null)    {
            callback(CG_PACKET_ERR.NEW_WORD_ROOM);
            return;
        }
        //세션아이디로 유저정보 가져오기
        let _user = await room_pool.getUserBySessionId(session_id, room_number);
        if(_user === undefined || _user === null) {
            callback(CG_PACKET_ERR.NEW_WORD_USER);
            return;
        }
        //상대방 유저정보 가져오기
        let _ouser = await room_pool.getOtherUser(room_number, session_id);
        if(_ouser === undefined || _ouser === null) {
            callback(CG_PACKET_ERR.NEW_WORD_OTHER_USER);
            return;
        }
        //진행중이지 않거 30초전이 아닐때
        if( _room.state != 4 && _room.state != 5 ) {
            callback(CG_PACKET_ERR.NEW_WORD_GAMEPLAYING);
            return;    
        }
        //유저가 끝났을때
        if(_user.is_end == 1)      
            return;
            
        //pre game over 체크   
        let _ct = TIME.getTime();
        let _st = _room.game_start_time;
        let _chk_time = (_ct - _st) / 1000;   
        
        let _pre_game_over = false;

        if( _room.state == 4 ) {
            if( _chk_time >= (parseInt(_room.play_time) * 60 - 30) ) {
                _pre_game_over = true;
                await room_pool.setRoomDetailInfo(room_number, {state: 5});

                let _rdata = {};
                _rdata.msg_idx  = CS_PACKET_DEF.PRE_GAME_OVER;
                _rdata.result   = CG_PACKET_ERR.SUCCESS;

                let _d = PacketEncode(_rdata);
                game.to('room' + room_number).emit(CS_PACKET_DEF.PRE_GAME_OVER, _d);
            }
        }

        //game over 체크
        if(_pre_game_over || _room.state == 5) {
            if(_chk_time >= parseInt(_room.play_time) * 60) {
                if(_room.state != 7)  {
                    let _rdata = {};
                    _rdata.msg_idx = CS_PACKET_DEF.GAME_OVER;
                    _rdata.result = CG_PACKET_ERR.SUCCESS;


                    console.log("[[game over event trigger]]========NEW WORD");

                    let _d = PacketEncode(_rdata);
                    game.to('room' + room_number).emit(CS_PACKET_DEF.GAME_OVER, _d);
                    let _game_over_time = TIME.getTime();
                    await room_pool.setRoomDetailInfo(room_number, {state: 7, game_over_time: _game_over_time, end_date: TIME.getYMD(_game_over_time)})
                }
                return;
            }
        }   
        //game over 처리 완료


        //콤보 공격받은 경우 콤보 단어를 전달한다.  
        let _data = await room_pool.newWord(room_number, session_id);
        if(_data == null) {
            return;
        }

        let _rdata1 = {
            msg_idx: CS_PACKET_DEF.RES_NEW_WORD,
            result: CG_PACKET_ERR.SUCCESS,
            new_word: _data.new_word,
            combo_attack: _data.combo_attack,
            combo_attack_type: parseInt(_data.combo_attack_type)
        };

        let _rdata2 = {
            msg_idx: CS_PACKET_DEF.USER_NEW_WORD,
            nick_name: nick_name,
            new_word: _data.new_word,
            combo_attack: _data.combo_attack,
            combo_attack_type: parseInt(_data.combo_attack_type)
        };

        let _d1 = PacketEncode(_rdata1);
        let _d2 = PacketEncode(_rdata2);
        //새 단어를 요청한 당사자에게 전달
        game.to(_user.socket).emit(CS_PACKET_DEF.RES_NEW_WORD, _d1);
        game.to(_ouser.socket).emit(CS_PACKET_DEF.USER_NEW_WORD, _d2);
    }
    catch(err22) {
        console.log("[NEW_WORD  err]===========", err22);
    }
}