/**
 * 파일명: gcserver/src/process/login.js
 * process 디렉토리는 소켓으로 들어온 말단의 요청처리를 개별js파일들로 분할하여 정의
 * login요청에 대한 처리 진행
 * 소켓으로 유저정보 가져오기
 */
let CUserPool = require('../UserPool');
const PACKET_DEF = require('../packet_def').PACKET_DEF;
const PACKET_ERR = require('../packet_err').PACKET_ERR;
/**
 * 소켓 로그인 처리 부분
 * @param {*req_login으로 전송된 소켓} socket 
 * @param {*req_login으로 전송된 닉네임} nickname 
 */
exports.Login = function(socket, nickname, session_id) {
    let _data = {};
    CUserPool.getUserBySocketId(socket.id, (_u) => {
        if(_u === undefined || _u === null) {
            //로그인 요청한 유저의 닉네임,소켓을 UserPool Redis에 저장
            CUserPool.setUsedUser(nickname, socket.id, session_id);
            
            _data.msg_idx = PACKET_DEF.RES_LOGIN;
            _data.result = PACKET_ERR.SUCCESS;

            //성공후 말단에 성공여부 소켓 전송
            socket.emit(PACKET_DEF.RES_LOGIN,_data);
            return;            
        } else if(_u.NICKNAME != nickname) {
            // 소켓이 같으나 닉네임이 다른 경우 
            CUserPool.withdraw(socket.id, (_n) => {
                CUserPool.setUsedUser(nickname, socket.id, session_id);
                //성공후 말단에 성공여부 소켓 전송
                _data.msg_idx = PACKET_DEF.RES_LOGIN;
                _data.result = PACKET_ERR.SUCCESS;
                socket.emit(PACKET_DEF.RES_LOGIN,_data);
                return;          
            });
        }
    });
}