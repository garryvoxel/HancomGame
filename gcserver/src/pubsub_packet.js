/**
 * 파일명: gcserver/src/pubsub_packet.js
 * 다른 모듈(setcoinserver , gcserver) 로부터 유저 상태를 수신하기 위한 구독 메소드 정의
 * 유저 게임 탈퇴 , 게임중 , 게임초대 메소드 정의 - 일종의 이벤트 핸들러정의와 유사한 경우
 * 다만, 이벤트 트리거는 게임서버측에서 publish발행 메소드로 진행
 */
const user_pool                         = require('./UserPool');
const PACKET_DEF                        = require('./packet_def').PACKET_DEF;
const USER_POSITION                     = require('./Def').USER_POSITION;

exports.pubsub_packet = function(msg, _io){
    console.log("pubsub_packet : =>");
    console.log(msg);
    let _msg = JSON.parse(msg);
    switch(_msg.msg_idx){
        case PACKET_DEF.GAME_INVITED:{
            game_invited(_msg, _io);
        }break;
        case PACKET_DEF.USER_GAME_PLAYING:{
            on_user_game_playing(_msg.nick_name);
        }break;
        case PACKET_DEF.USER_GAME_LEAVE:{
            on_user_game_leave(_msg.nick_name);
        }break;

    }
}
//유저가 게임탈퇴
function on_user_game_leave(nick_name){
    user_pool.getUserByNickName(nick_name, (usr) => {
        if(usr === undefined || usr === null || usr.length == 0){
            //유저풀에 없음
            console.log("game_invited usr is null");
            return;
        }
        console.log('on_user_game_leave >>...'+usr);
        // 유저 포지션을 0으로 설정
        user_pool.setPosition(nick_name, USER_POSITION.LOBBY);
    });
}
function on_user_game_playing(nick_name){
    user_pool.getUserByNickName(nick_name, (usr) => {
        if(usr === undefined || usr === null || usr.length == 0){
            //유저풀에 없음
            console.log("game_invited usr is null");
            return;
        }
        console.log('on_user_game_playing >>...'+usr);
        // 유저 포지션을 1로 설정
        user_pool.setPosition(nick_name, USER_POSITION.GAME);
    });
}
function game_invited(msg, _io){
    console.log("game_invited - MSG : =>");
    console.log(msg);

    for(var i = 0; i < msg.to_nick_name.length; i++ ){
        //초대된 유저정보 얻기
        user_pool.getUserByNickName(msg.to_nick_name[i], (usr) => {
            if(usr === undefined || usr === null || usr.length === 0){
                //유저풀에 없음
                console.log("game_invited usr is null");
                return;
            }
            console.log("game_invited - USER : =>");
            console.log(usr);

            console.log('send invited.....nick_name : '+msg.to_nick_name[i]);
            let _rdata = {};
            _rdata.msg_idx              = PACKET_DEF.GAME_INVITED;
            _rdata.room_number          = msg.room_number;
            _rdata.room_title           = msg.room_title;
            _rdata.is_lock              = msg.is_lock;
            _rdata.password             = msg.password;
            _rdata.back_ground          = msg.back_ground;
            _rdata.play_time            = msg.play_time;
            _rdata.game_code            = msg.game_code;
            _rdata.invited_time         = msg.invited_time;
            _rdata.from_nick_name       = msg.from_nick_name;
            _rdata.from_character_type  = msg.from_character_type;
            _rdata.to_nick_name         = msg.to_nick_name[i];
            _rdata.server_dns           = msg.server_dns;
            _rdata.server_idx           = msg.server_idx;

            // 유저의 포지션값 비교하기
            for(let j = 0; j < usr.length; j ++) {
                if( parseInt(usr[j].POSITION) == USER_POSITION.GAME ) {
                    console.log('game_invited >> position : '+usr[j].POSITION);
                    continue;
                }
                _io.to(usr[j].SOCKET).emit(PACKET_DEF.GAME_INVITED,_rdata);
            }    
        });
    }

}
