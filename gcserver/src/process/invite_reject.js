/**
 * 파일명: gcserver/src/process/invite_reject.js
 * 게임초대 거절
 * 게임모듈에 game거절 정보 발행 - pubsub 이용 
 */
const PACKET_DEF        = require('../packet_def').PACKET_DEF;
let CUserPool           = require('../UserPool');
const PACKET_ERR        = require('../packet_err').PACKET_ERR;
const TIME              = require('../../common/time');
const gamecfg           = require('../../config/game.json');
const pubsub            = require('../pubsub');     
exports.Invite_Reject = function(socket,nick_name,invite_nickname,invited_time,game_code,callback){    
    console.log('Invite_Reject 111: ' + nick_name);
    //닉네임으로 유저정보얻기
    var _user = CUserPool.getUserByNickName(nick_name, (_user) => {
        if(_user === null||
            _user===undefined||_user.length == 0){        
            callback(PACKET_ERR.NOT_USER);        
            return;
        }
        console.log('Invite_Reject 222: ' + invite_nickname);
        //상대방의 닉네임으로 유저정보얻기
        CUserPool.getUserByNickName(invite_nickname, (_to_user) => {
            if(_to_user === null ||
                _to_user === undefined || _to_user.length === 0){
                //상대방이 로그 아웃        
                //socket.emit(PACKET_ERR.RES_INVITE_ACCEPT,_data);
                callback(PACKET_ERR.TO_USER_LOG_OUT);
                return;        
            }
        
            let _ct = TIME.getTime();
            let _rt = (_ct - invited_time)/1000;
            let _invited_time = parseInt(gamecfg.INVITED_TIME);
            //요청유효시간 지남
            if(_rt > _invited_time){
                //해당 메세지를 무시함
                callback(PACKET_ERR.INVITED_TIME_OVER);        
                return;
            } 
        
            //상대방에 게임 거절했다고 통보 임장하라고 통지
            
        
            let _rdata = {};    
            _rdata.msg_idx          = PACKET_DEF.GAME_INVITED_REJECT;
            _rdata.game_code        = game_code;
            _rdata.nick_name        = nick_name;
            _rdata.to_nick_name     = invite_nickname;
        
            pubsub.publish(_rdata);
        
            callback(PACKET_ERR.SUCCESS);
        
            console.log('Invite reject...'+socket.id);
        });
    });
}