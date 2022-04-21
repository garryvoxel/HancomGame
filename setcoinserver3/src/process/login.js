const get_userinfo      = require('../call_apiserver').get_userinfo;
const request_game_result = require('../call_apiserver').request_game_result;
const update_usercount = require('../call_apiserver').update_usercount;

const user_pool         = require('../UserPool');
const room_pool         = require('../RoomPool');

const CG_PACKET_ERR     = require('../packet_err').CG_PACKET_ERR;
const svrcfg            = require('./../../config/server.json')[process.env.NODE_ENV || 'development'];

/**
 * 로그인 처리
 * 유저풀에 닉네임 + 소켓 + 세션아이디 저장
 * @param {* 소켓} socket 
 * @param {* IP} ip 
 * @param {* 닉네임} nick_name 
 * @param {* 캐릭터 타입} character_type 
 * @param {* 세션아이디} session_id 
 * @param {* 콜백} callback 
 */
exports.log_in = async function(socket, ip, nick_name, character_type, session_id, callback){

    update_usercount(0,(err)=>{
        console.log(err);
    });

    if (/^Guest[_][0-9a-zA-Z]{6}$/.test(session_id)) {
        //유저 풀에서 포인트를 가져왔어 유저 정보를 세팅한다.
        try {

            if( (await room_pool.checkDuplicate(session_id)) ) {
                callback(CG_PACKET_ERR.LOGIN_SESSION_ID);            
                return;
            }

            await user_pool.addUserToRedis({
                'uuid': 99999,
                'nickname': nick_name,
                'session_id': session_id,
                'socket': socket.id,
                'character_type': character_type,
                'is_user': false,
                'win_count': 0,
                'lose_count': 0,
                'draw_count': 0,
                'ip': ip,
                'server_idx': svrcfg.SERVER_IDX
            });      
            callback(CG_PACKET_ERR.SUCCESS);            
        }
        catch(err22) {
            console.log("[login setusedUser err=====]", err22);
        }
    }else{
        get_userinfo(nick_name,(err,data)=>{
            if(err){    
                callback(err);
            }else{           
                let _uuid       = data.uuid;
                let _session_id = data.session_id;            
                //유저 풀에서 포인트를 가져왔어 유저 정보를 세팅한다.
                request_game_result(_uuid, async (err,data1)=>{
                    try {

                        if( (await room_pool.checkDuplicate(session_id)) ) {
                            callback(CG_PACKET_ERR.LOGIN_SESSION_ID);            
                            return;
                        }
                        
                        await user_pool.addUserToRedis({
                            'uuid': _uuid,
                            'nickname': nick_name,
                            'session_id': _session_id,
                            'socket': socket.id,
                            'character_type': character_type,
                            'is_user': true,
                            'win_count': ( (data1.win == null || data1.win == undefined) ? 0 : data1.win ),
                            'lose_count': ( (data1.lose == null || data1.lose == undefined) ? 0 : data1.lose ),
                            'draw_count': ( (data1.draw == null || data1.draw == undefined) ? 0 : data1.draw ),
                            'ip': ip,
                            'server_idx': svrcfg.SERVER_IDX
                        });
                        callback(err);            
                    }
                    catch(err22) {
                        console.log("[login setusedUser err=====]", err22);    
                    }
                });
                
            }
        });   
    } 
    
}