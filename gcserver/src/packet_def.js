/**
 * 파일명: gcserver/src/packet_def.js
 * 소켓 이벤트 타입 정의
 */
exports.PACKET_DEF = {
    "REQ_LOGIN":"req_login", //유저 로그인 이벤트
    "RES_LOGIN":"res_login",
    "REQ_INVITE":"req_invite",
    "RES_INVITE":"res_invite",
    "REQ_INVITE_ACCEPT":"req_invite_accept",
    "RES_INVITE_ACCEPT":"res_invite_accept",
    "REQ_INVITE_REJECT":"req_invite_reject",
    "RES_INVITE_REJECT":"res_invite_reject",
    "ENTER_GAME":"enter_game", //게임을 실행시키도록 통지
    "CONNECTION_FULL":"connection_full", //서버가 풀이라고 알려줌
    "GAME_INVITED":"game_invited",// 상대방에게 게임초대 메세지를 보냄
    "GAME_INVITED_ACCPET":"game_invited_accept",
    "GAME_INVITED_REJECT":"game_invited_reject",
    /**
     * 서버끼리 통신하는 패킷
     */
    "REQ_USER_STATE":"req_user_state",
    "RES_USER_STATE":"res_user_state",

    "USER_GAME_PLAYING":"user_game_playing",
    "USER_GAME_LEAVE":"user_game_leave"
}