const room_pool         = require('../RoomPool');
const CG_PACKET_ERR     = require('../packet_err').CG_PACKET_ERR;
const check_prohibit_words = require('./../call_apiserver').check_prohibit_words;

/**
 * 게임방 옵션을 변경 처리하는 함수
 * @param {* 룸번호} room_num
 * @param {* 방장 닉네임} nick_name
 * @param {* 방 제목} room_title
 * @param {* 게임 배경} back_ground
 * @param {* 비번 방인지 여부} lock
 * @param {* 패스워드} password
 * @param {* 플레이 타임} play_time
 */
exports.change_room_option = function(room_num, nick_name, room_title, back_ground, lock, password, play_time, session_id, callback){
    //금지된 단어 체크
    check_prohibit_words(room_title, async (err) => {
        if(err != CG_PACKET_ERR.SUCCESS) {
            callback(err);
            return;
        }       
        try {
            let ret = await room_pool.changeRoomOption(room_num, room_title, lock, play_time, back_ground, session_id, password);
            if(ret == 0)    {
                callback(CG_PACKET_ERR.CHANGE_ROOM_OPTION_HOST_USER_NULL);
                return;
            }
            if(ret== 2)     {
                callback(CG_PACKET_ERR.CHANGE_ROOM_OPTION_HOST_USER);
                return;
            }

            callback(CG_PACKET_ERR.SUCCESS);
            return;
        }
        catch(err22) {
            console.log("[err]==============", err22);
            callback(CG_PACKET_ERR.CHANGE_ROOM_OPTION_HOST_USER_NULL);           
        }
    });
}