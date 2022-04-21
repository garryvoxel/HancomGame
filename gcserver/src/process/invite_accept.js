/**
 * 파일명: gcserver/src/process/invite_accept.js
 * 게임초대에 대한 응답처리 부분
 * 요청유효시간을 경과하면 게임초대에 응할 수 없다.
 */
let CUserPool       = require('../UserPool');
const PACKET_DEF    = require('../packet_def').PACKET_DEF;
const PACKET_ERR    = require('../packet_err').PACKET_ERR;
const TIME          = require('../../common/time');
const gamecfg       = require('../../config/game.json');

exports.Invite_Accept = function(socket,nickname,invite_nickname,invited_time,game_code){
    var _data ={};
    _data.msg_idx = PACKET_DEF.RES_INVITE_ACCEPT;
    //닉네임으로 유저정보얻기
    CUserPool.getUserByNickName(nickname, (_user) => {
        if(_user === undefined ||
            _user === null || _user.length === 0){
            //_data.result = PACKET_ERR.NOT_USER;
            //socket.emit(PACKET_DEF.RES_INVITE_ACCEPT,_data);
            socket.disconnect(true);
            return;
        }
        //상대방의 닉네임으로 유저정보얻기
        CUserPool.getUserByNickName(invite_nickname, (_to_user) => {
            if(_to_user === undefined ||
                _to_user === null || _to_user.length === 0){
                //상대방이 로그 아웃
                _data.result = PACKET_ERR.TO_USER_LOG_OUT;
                socket.emit(PACKET_DEF.RES_INVITE_ACCEPT,_data);
                return;        
            }
        
            let _ct = TIME.getTime();
            let _rt = (_ct - invited_time)/1000;
            let _invited_time = parseInt(gamecfg.INVITED_TIME);
            //요청유효시간 지남
            if(_rt > _invited_time){
                _data.result = PACKET_ERR.INVITED_TIME_OVER;
                socket.emit(PACKET_DEF.RES_INVITE_ACCEPT,_data);
                return;
            } 
        
            _data.result = PACKET_ERR.SUCCESS;
            socket.emit(PACKET_DEF.RES_INVITE_ACCEPT,_data);
        
            //게임 임장하라고 통지
            var _data1 = {};    
            _data1.msg_idx = PACKET_DEF.ENTER_GAME;
            _data1.game_code = game_code;
            socket.emit(PACKET_DEF.ENTER_GAME,_data1);
        
            console.log('Invite accept...'+socket.id);
        });
    });
}