/**
 * 파일명: panchangeserver/src/enum.js
 * 판뒤집기 게임 관련 상수 정의 
 */
exports.ROOM_STATUS =  {
    WAIT : 0,
    LOADING: 1,
    PLAYING : 2
}

exports.ITEM = {
    CLOUD : 0,
    ANGEL : 1,
    ERASER : 2,
    BONUS : 3,
    STOP : 4
}

exports.JOIN_RET = {
    OK : 0,
    FULL : 1,
    PLAYING : 2,
    NOTMATCHPWD : 3,
    CLANERR : 4,
    NOTMYCLANROOM : 5,
    ERR: 99
}

exports.REDIS_RET = {
    ROOM_FULL: 124
}