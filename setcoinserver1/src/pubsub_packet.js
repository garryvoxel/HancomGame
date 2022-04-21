/**
 * 파일명: setcoinserver1/src/pubsub_packet.js
 * pubsub 구독처리부분
 * 자세한 내용은 게임 초대 거절에 대한 처리부분
 * gcserver모듈에서 게임초대 거절 메시지를 발행한 경우 game_invited_reject 메소드 호출
 */
const CS_PACKET_DEF = require('./packet_def').CS_PACKET_DEF;
const use_pool      = require('./UserPool');
const PacketEncode      = require('../common/util').PacketEncode;
exports.pubsub_packet = function(msg){
    let _msg = JSON.parse(msg);
    switch(_msg.msg_idx){
        case CS_PACKET_DEF.GAME_INVITED_REJECT:{
            game_invited_reject(_msg);
        }
        break;     
    }
}

function game_invited_reject(msg){
    console.log('game_invited_reject');
    let _nn     = msg.nick_name;    //초대를 거절한 사람
    let _tnn    = msg.to_nick_name; //초대를 보낸 사람
    let _gc     = msg.game_code;
    //유저풀에서 유저 얻기
    let usr = use_pool.getUserByNickName(_tnn);
    if( usr === undefined || usr === null){
        return;        
    }

    console.log('game_invited_reject...1');

    let _rdata ={};
    _rdata.msg_idx   = CS_PACKET_DEF.GAME_INVITED_REJECT;
    _rdata.nick_name = _nn;
    _rdata.game_code = _gc;

    usr.getSocket().emit(CS_PACKET_DEF.GAME_INVITED_REJECT,PacketEncode(_rdata));
}