/**
 * 파일명: setcoinserver1/src/packet_def.js
 * 소켓 이벤트 타입 정의
 */
 exports.CS_PACKET_DEF = {    
    "REQ_LOGIN":"req_login",
    "RES_LOGIN":"res_login",
    
    "REQ_AUTO_ENTER_ROOM":"req_auto_enter_room",
    "RES_AUTO_ENTER_ROOM":"res_auto_enter_room",

    "REQ_CREATE_ROOM":"req_create_room",
    "RES_CREATE_ROOM":"res_create_room",

    "REQ_CHANGE_ROOM_OPTION":"req_change_room_option",
    "RES_CHANGE_ROOM_OPTION":"res_change_room_option",


    "REQ_ENTER_ROOM":"req_enter_room",
    "RES_ENTER_ROOM":"res_enter_room",
    "USER_ENTER_ROOM":"user_enter_room",

    "REQ_LEAVE_ROOM":"req_leave_room",
    "RES_LEAVE_ROOM":"res_leave_room",
    "USER_LEAVE_ROOM":"user_leave_room",

    "REQ_GAME_LEAVE_ROOM":"req_game_leave_room",
    "RES_GAME_LEAVE_ROOM":"res_game_leave_room",
    "USER_GAME_LEAVE_ROOM":"user_game_leave_room",

    "REQ_GAME_READY":"req_game_ready",
    "RES_GAME_READY":"res_game_ready",
    
    "GAME_START":"game_start",

    "REQ_NEW_WORD":"req_new_word",
    "RES_NEW_WORD":"res_new_word",
    "USER_NEW_WORD":"user_new_word",

    "REQ_CHECK_WORD":"req_check_word",
    "RES_CHECK_WORD":"res_check_word",
    "USER_CHECK_WORD":"user_check_word",

    "REQ_INPUT_WORD_TIME_OVER":"req_input_word_time_over",
    "RES_INPUT_WORD_TIME_OVER":"res_input_word_time_over",
    "INPUT_WORD_TIME_OVER":"input_word_time_over",

    "REQ_GAME_RESULT":"req_game_result",
    "RES_GAME_RESULT":"res_game_result",
    "GAME_RESULT":"game_result",

    
    "PRE_GAME_OVER":"pre_game_over",
    
    "GAME_OVER":"game_over",

    "REQ_TOWER_FALL":"req_tower_fall",
    "RES_TOWER_FALL":"res_tower_fall",
    "TOWER_FALL":"tower_fall",


    "REQ_RE_GAME_START":"req_re_game_start",
    "RES_RE_GAME_START":"res_re_game_start",
    "USER_RE_GAME_START":"user_re_game_start",

    "RE_GAME_START":"re_game_start",

    "REQ_INVITE":"req_invite",
    "RES_INVITE":"res_invite",

    "GAME_INVITED":"game_invited",



    "GAME_INVITED_REJECT":"game_invited_reject",

    "GO_TO_LOBBY":"go_to_lobby",

    "REQ_CHECK_ROOM":"req_check_room",
    "RES_CHECK_ROOM":"res_check_room",

    "REQ_HOW_GAME":"req_how_game",
    "RES_HOW_GAME":"res_how_game",


    "GAME_START_FAIL":"game_start_fail",

    "RES_ROOM_LIST": "res_room_list",

    "REQ_ROOM_LIST": "req_room_list",

    "RES_CHANGE_ROOM_INFO": "res_change_room_info",

    "REQ_JOIN_GAME": "req_join_game",

    "REQ_SEARCH_ROOM_BY_HOST": "req_search_room_by_host",
    "RES_SEARCH_ROOM_BY_HOST": "res_search_room_by_host",
    
    "REQ_SEARCH_ROOM_BY_ROOMNUM": "req_search_room_by_roomnum",
    "RES_SEARCH_ROOM_BY_ROOMNUM": "res_search_room_by_roomnum",
    "YOU_FIRE": "res_you_fire"
    //======================================================
}

exports.SS_PACKET_DEF = {
    "REQ_LOGIN":"req_login",
    "RES_LOGIN":"res_login",
    "REQ_GET_PLAYID":"req_get_playid",
    "RES_GET_PLAYID":"res_get_playid",



    //==========================================================
    //pubsub packet
    "USER_GAME_PLAYING":"user_game_playing",
    "USER_GAME_LEAVE":"user_game_leave",
}