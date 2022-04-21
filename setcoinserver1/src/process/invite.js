const room_pool         = require('../RoomPool');
const CG_PACKET_ERR     = require('../packet_err').CG_PACKET_ERR;
const GAME_CODE         = require('../../config/game_code');
const TIME              = require('../../common/time');
const PUBSUB            = require('../pubsub');
const CS_PACKET_DEF     = require('../packet_def').CS_PACKET_DEF;
const svrcfg            = require('../../config/server.json')[process.env.NODE_ENV];
const WebConfig         = require('../../config/config');
/**
     * to_nick_name에게 invite소켓 전달
     * @param {*방번호} room_number
     * @param {*친구요청 한 유저 닉네임} nick_name
     * @param {*친구요청 대상 닉네임} to_nick_name
     * @param {*콜백} callback
*/
exports.invite = async function(room_number, nick_name, to_nick_name, session_id, callback){
    try {
        // 륨번호로 룸 가져오기
        let _room_info = await room_pool.getRoomInfo(room_number);
        if(_room_info === undefined || _room_info === null) {
            callback(CG_PACKET_ERR.GAME_INVITE_ROOM_NULL);
            return;
        }

        // 방장 정보 가져오기
        let _usr = await room_pool.getMaster(room_number);
        if(_usr === undefined || _usr === null) {
            callback(CG_PACKET_ERR.GAME_INVITE_USER_NULL);
            return;  
        }

        // 방장 닉네임과 친규요청한 유저 닉네임 비교
        if(_usr.nickname != nick_name) {
            callback(CG_PACKET_ERR.GAME_INVITE_USER_NULL);
            return;       
        }
        console.log('invite....1');
        
        //룸정보 가져오기
        let _rt = _room_info.room_title;
        let _lock = _room_info.is_lock;
        let _pw = '';
        if( !(_room_info.password == '' || _room_info.password == null || _room_info.password == undefined) )
            _pw = _room_info.password;
        let _pt = parseInt(_room_info.play_time) * 60;
        let _bg = parseInt(_room_info.back_ground);
        let _gc = GAME_CODE.GAME_SET_COIN;
        let _invite_time = TIME.getTime();
        let _rdata = {};
        _rdata.msg_idx      = CS_PACKET_DEF.GAME_INVITED;
        _rdata.room_number  = room_number;
        _rdata.room_title   = _rt;
        _rdata.is_lock      = _lock;
        _rdata.password     = _pw;
        _rdata.back_ground  = _bg;
        _rdata.play_time    = _pt;
        _rdata.game_code    = _gc;
        _rdata.invited_time = _invite_time;
        _rdata.from_nick_name = nick_name;
        _rdata.from_character_type = parseInt(_usr.character_type);
        _rdata.to_nick_name = to_nick_name;
        _rdata.server_dns   = WebConfig.getDNS(process.env.NODE_ENV);
        _rdata.server_idx   = svrcfg.SERVER_IDX;

        //초대 보내기
        console.log("invite - SERVER DNS : " + _rdata.server_dns);
        PUBSUB.on_publish(_rdata);
        callback(CG_PACKET_ERR.SUCCESS,_rdata);
    }
    catch(err22) {
        console.log("[invite err]===================", err22);
    }
}