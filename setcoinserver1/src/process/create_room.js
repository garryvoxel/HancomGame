const user_pool         = require('../UserPool');
const CG_PACKET_ERR     = require('../packet_err').CG_PACKET_ERR;
const SS_PACKET_DEF     = require('../packet_def').SS_PACKET_DEF;
const GAME_CODE         = require('../../config/game_code.json');
const getPlayId         = require('../../common/util').getPlayId;
const get_room_number           = require('../call_apiserver').get_room_number;
const check_prohibit_words      = require('../call_apiserver').check_prohibit_words;
const room_pool         = require('../RoomPool');
const PUBSUB            = require('../pubsub');

const WebConfig         = require('./../../config/config');
const svrcfg            = require('./../../config/server.json')[process.env.NODE_ENV || 'development'];

/**
 * 게임방 생성하기
 * @param {*  소켓}     socket      
 * @param {*  방제목}  room_title   
 * @param {*  별명(게임방 방장 닉네임)}  nick_name   
 * @param {*  비번방인지}  is_lock  
 * @param {*  비번방 패스워드}  password
 * @param {*  혼자플레이}  is_single   
 * @param {*  메인캐릭터}  character_type
 * @param {*  배경}  back_ground
 * @param {*  총 플레이 시간}  play_time
 */
exports.create_room = function(socket,room_title,
                                nick_name,is_lock,
                                password,is_single,
                                character_type,back_ground,
                                play_time, session_id, callback){
    
    //금지된 단어 체크
    check_prohibit_words(room_title, async (err)=>{
            if(err != CG_PACKET_ERR.SUCCESS) {
                callback(err);
                return;            
            }
            else {                 
                try {
                    // 게임방번호 생성
                    let _room_number = await get_room_number(svrcfg.SERVER_IDX);
                    if(!_room_number) {
                        callback(CG_PACKET_ERR.CREATE_ROOM_API_SERVER_ROOM_NUMBER,0);
                        return;
                    }
        
                    // 필요 없는 코드인듯
                    /*
                    let _usr = user_pool.getUserBySocketId(socket.id);
                    if( _usr === null && _usr === undefined){
                        console.log("critical create room......user disconnect");
                        socket.disconnect(true);
                        return
                    }
                    if(_usr.getNickName() != nick_name){
                        callback(CG_PACKET_ERR.CREATE_ROOM_USER_NICKNAME,0);
                        return;
                    }  */   

//                   _usr.setCharacterType(character_type);
                    let _ip = WebConfig.getDNS(process.env.NODE_ENV || 'development');
                    if(await room_pool.setUsedRoom1(nick_name, _ip, svrcfg.SERVER_IDX, _room_number, room_title, is_lock, password, (is_single == true ? '1' : '0'), back_ground, play_time, nick_name, socket.id, session_id)) {
                        callback(CG_PACKET_ERR.SUCCESS, _room_number);
                        //GCServer에 유저 상태값 변경 통보
                        let _rdata={};
                        _rdata.msg_idx      = SS_PACKET_DEF.USER_GAME_PLAYING;
                        _rdata.nick_name    = nick_name;
                        PUBSUB.on_publish(_rdata);
                        socket.join("room" + _room_number, function() {
                        });
                        return;
                    }
                    else {
                        callback(CG_PACKET_ERR.CREATE_ROOM_ROOM_REDIS_1, 0)
                        return;
                    }
                }
                catch(err22) {
                    console.log("[err]====================", err22);
                }
            }
    });                            
}



