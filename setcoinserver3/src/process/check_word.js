const room_pool             = require('../RoomPool');
const CG_PACKET_ERR         = require('../packet_err').CG_PACKET_ERR;
const CS_PACKET_DEF         = require('../packet_def').CS_PACKET_DEF;
const TIME                  = require('../../common/time');
const PacketEncode          = require('../../common/util').PacketEncode;
/**
 * 단어 체크 
 * @param {*} room_number        룸번호
 * @param {*} nick_name          닉네임
 * @param {*} word 
 * @param {*} coin_line_type 
 * @param {*} bad_coin_count 
 * @param {*} callback 
 */
exports.check_word = async function(game, room_number, nick_name, word, coin_line_type, bad_coin_count, session_id, callback){
    try {
        //룸번호로 룸 가져오기
        let _room = await room_pool.getRoomInfo(room_number);
        //룸이 비였는가 판단
        if(_room === undefined || _room === null)    {
            callback(CG_PACKET_ERR.CHECK_WORD_ROOM);
            return;
        }
        //세션아이디로 유저정보 가져오기
        let _user = await room_pool.getUserBySessionId(session_id, room_number);
        if( _user === undefined || _user === null ){
            callback(CG_PACKET_ERR.CHECK_WORD_USER);
            return;
        }
        //상대방 유저 가져오기
        let _ouser = await room_pool.getOtherUser(room_number, session_id);
        if(_ouser === undefined || _ouser === null){
            callback(CG_PACKET_ERR.CHECK_WORD_OTHER__USER);
            return;
        }
        //진행중이지 않으며 30초전이 아닐때
        if( _room.state != 4 && _room.state != 5 ) {
            callback(CG_PACKET_ERR.CHECK_WORD_GAMEPLAYING);
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

                    console.log("[[game over event trigger]]========CHECK WORD");

                    let _d = PacketEncode(_rdata);
                    game.to('room' + room_number).emit(CS_PACKET_DEF.GAME_OVER, _d);
                    let _game_over_time = TIME.getTime();
                    await room_pool.setRoomDetailInfo(room_number, {state: 7, game_over_time: _game_over_time, end_date: TIME.getYMD(_game_over_time)})      
                }
                return;       
            }
        }
        
        //game over 처리 완료

        var _is_combo_flag = false;
        _is_combo_flag = coin_line_type;
        
        //2.입력한 단어가 정확한지 체크
        let _rdata1 = {};
        let _rdata2 = {};
        _rdata1.msg_idx = CS_PACKET_DEF.RES_CHECK_WORD;
        _rdata2.msg_idx = CS_PACKET_DEF.USER_CHECK_WORD;
        
        if(word != _user.check_word) {
            _rdata1.result = CG_PACKET_ERR.CHECK_WORD_FAIL;
            _rdata2.result = CG_PACKET_ERR.CHECK_WORD_FAIL;
            let _d1 = PacketEncode(_rdata1);
            let _d2 = PacketEncode(_rdata2);
            game.to(_user.socket).emit(CS_PACKET_DEF.RES_CHECK_WORD, _d1);
            game.to(_ouser.socket).emit(CS_PACKET_DEF.USER_CHECK_WORD, _d2);
            return;
        }
        // _rdata1.result = CG_PACKET_ERR.SUCCESS;
        // _rdata2.result = CG_PACKET_ERR.SUCCESS;
        let _ret_data = await room_pool.checkWord(room_number, session_id, _ouser.session_id, _is_combo_flag, bad_coin_count);

        console.log("[[REQ_CHECK_WORD result=================]]", _ret_data);

        if(_ret_data == null) {
            return;
        }
        let _d1 = PacketEncode(_ret_data.rdata1);
        let _d2 = PacketEncode(_ret_data.rdata2);
        game.to(_user.socket).emit(CS_PACKET_DEF.RES_CHECK_WORD, _d1);
        game.to(_ouser.socket).emit(CS_PACKET_DEF.USER_CHECK_WORD, _d2);
    }   
    catch(err22) {
        console.log("[CHECK_WORD  err]===========", err22);
    }
}