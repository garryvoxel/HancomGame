/**
 * 파일명: gcserver/src/packet_err.js
 * 패킷 Response 케이스 정의
 */
exports.PACKET_ERR = {
    "SUCCESS":0,
    "CONNECT_POOL":1,
    "NOT_USER":100,    
    "USER_GAME_PLAYING":101,
    "USER_REJECT":102,   
    "USER_SESSION_ERROR":103, 
    "USER_POOL_ERROR":104,

    "FROM_USER_POOL_ERROR":201,
    "TO_USER_LOG_OUT":202,

    "INVITED_TIME_OVER":301,

    "PARAMETER_ERR":400,
    "GET_SESSION_ID":500,
    "USER_POOL":600,
}