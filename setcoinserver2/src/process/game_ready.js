const CG_PACKET_ERR     = require('../packet_err').CG_PACKET_ERR;
const CS_PACKET_DEF     = require('../packet_def').CS_PACKET_DEF;
const room_pool         = require('../RoomPool');
const PacketEncode      = require('./../../common/util').PacketEncode;
const write_game_start_log = require('../call_apiserver').write_game_start_log;

/**
 * 게임 준비
 * @param {*방번호} room_number 
 * @param {*닉네임} nick_name 
 * @param {*콜백} callback 
 */
exports.game_ready = async function(game, socket, room_number, nick_name, session_id, callback){
    try {
        let _room_info = await room_pool.getRoomInfo(room_number);
        //Room정보 validation처리
        if(_room_info === null || _room_info === undefined) {
            callback(CG_PACKET_ERR.GAME_READY_ROOM);
            return;
        }
        //Room 입장이 완료되지 않은 경우
        if(_room_info.state != 2) {
            callback(CG_PACKET_ERR.GAME_READY_ENTERFINISHED);        
            return;        
        }
        //세션아이디로 유저정보 가져오기
        let _usr = await room_pool.getUserBySessionId(session_id, room_number);
        if(_usr === undefined || _usr === null) {
            callback(CG_PACKET_ERR.GAME_READY_USER);
            return;
        }
        // console.log("nickname game ready=====", nick_name);
        if((await room_pool.isGameStartReady(room_number, session_id)) != true) {
            console.log("유저1 - 게임준비상태 플래그 true -------------");
            callback(CG_PACKET_ERR.SUCCESS);
            return;
        }
        /////////////////////////////////////////////
        //게임 시작...  
        console.log("유저2 - 게임준비상태 플래그 true -------------");
        callback(CG_PACKET_ERR.SUCCESS);

        let _user_data = await room_pool.roomGameReady(room_number, session_id);
        if(_user_data == null || _user_data == undefined)
            return;

        let _rdata = {
            msg_idx: CS_PACKET_DEF.GAME_START,
            result: 0
        };

        let _d = PacketEncode(_rdata);

        game.to('room' + room_number).emit(CS_PACKET_DEF.GAME_START, _d);

        write_game_start_log(_user_data.USER.uuid, _user_data.USER.nickname, (err, res) => {});
        write_game_start_log(_user_data.OUSER.uuid, _user_data.OUSER.nickname, (err, res) => {});
    }
    catch(err22) {
        console.log("[game_ready]=====================", err22);
    }
}