'use strict';    
module.exports = function(app) {
    var setcoinserver = require('../src/setCoinServerController');

    /**
     * 동전쌓기 레디스 삭제
     */
    app.route('/setcoinserver/reset_redis')
    .post(setcoinserver.resetRedis);

    /**
     * 게임방 번호 생성
     */
    app.route('/setcoinserver/get_room_number')
    .post(setcoinserver.getRoomNumber);

    /**
     * 게임방 생성
     */
    app.route('/setcoinserver/create_room')
    .post(setcoinserver.createRoom);

    /**
     * 게임방 목록 가져오기
     */
    app.route('/setcoinserver/get_room_list')
    .post(setcoinserver.getRoomList);

    /**
     * 유저정보 초기 등록
     */
    app.route('/setcoinserver/add_user')
    .post(setcoinserver.addUser);

    /**
     * 게임방 상태 정보 가져오기 
     */
    app.route('/setcoinserver/get_room_info')
    .post(setcoinserver.getRoomInfo);

    /**
     * 게임방 방장 정보 가져오기
     */
    app.route('/setcoinserver/get_master')
    .post(setcoinserver.getMaster);

    /**
     * 게임방 입장하기
     */
    app.route('/setcoinserver/enter_room')
    .post(setcoinserver.enterRoom);

    /**
     * 세션아이디로 유저 디테일 정보 가져오기
     */
    app.route('/setcoinserver/get_user_info_by_session_id')
    .post(setcoinserver.getUserInfoBySessionId);

    /**
     * 세션아이디로 유저정보 가져오기
     */
    app.route('/setcoinserver/get_user_detail_by_session_id')
    .post(setcoinserver.getUserDetailBySessionId);

    app.route('/setcoinserver/change_room_option')
    .post(setcoinserver.changeRoomOption);

    /**
     * 유저 리셋
     */
    app.route('/setcoinserver/user_reset2')
    .post(setcoinserver.userReset2);

    app.route('/setcoinserver/set_ready')
    .post(setcoinserver.setReady);

    app.route('/setcoinserver/is_game_start_ready')
    .post(setcoinserver.isGameStartReady);

    app.route('/setcoinserver/get_other_user')
    .post(setcoinserver.getOtherUserInRoom);

    /**
     * 게임방 정보 셋팅
     */
    app.route('/setcoinserver/set_info_room')
    .post(setcoinserver.setInfoRoom);

    /**
     * 유저 정보 셋팅
     */
    app.route('/setcoinserver/set_info_user')
    .post(setcoinserver.setInfoUser);

    
    app.route('/setcoinserver/search_room_by_host_name')
    .post(setcoinserver.searchRoomByHostName);

    app.route('/setcoinserver/search_room_by_roomnum')
    .post(setcoinserver.searchRoomByRoomNum);

    app.route('/setcoinserver/auto_enter')    
    .post(setcoinserver.autoEnter);

    app.route('/setcoinserver/duplicate_user')
    .post(setcoinserver.duplicateUser);

    app.route('/setcoinserver/check_room_list_for_remove')
    .post(setcoinserver.checkRoomListForRemove);
}
