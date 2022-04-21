exports.ROOM_NO = "room-";
exports.SYS_USER="sys-user-";
exports.MAX_SETCOIN_PAGE_LIST=8;
exports.MAX_PANCHANGE_PAGE_LIST=8;

exports.RESULT_STATE = {
    "WIN":0,
    "LOSE":1,
    "DRAW":2
}

exports.GET_DEL_USER_RESPONSE_VALUE = function (isDeleted, failReason) {
    return { "delYn": (isDeleted? "Y" :"N"), "reason": (failReason? failReason :"") };
}