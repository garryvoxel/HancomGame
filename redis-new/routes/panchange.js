'use strict';    
module.exports = function(app) {
    var panchange = require('./../src/panchangeController');

    /**
     * 판뒤집기 레디스 reset
     */
    app.route('/panchange/reset_redis')
    .post(panchange.resetRedis);

    /**
     * 게임방 목록 가져오기
     */
    app.route('/panchange/get_room_list')
    .post(panchange.getRoomList);

    /**
     * 게임방 생성
     * room_number host_name is_lock room_title user_max_count is_clan ip back_ground play_time password status
     */
    app.route('/panchange/create_room')
    .post(panchange.createRoom);

    /**
     * 게임방 번호 생성
     */
    app.route('/panchange/get_room_number')
    .post(panchange.getRoomNumber);

    app.route('/panchange/delete_room')
    .post(panchange.deleteRoom);
    /**
     * 게임방 플레이 상태 변경
     */
    app.route('/panchange/update_room_playing')
    .post(panchange.updateRoomPlaying);

    /**
     * 방설정 변경
     */
    app.route('/panchange/change_room_option')
    .post(panchange.changeRoomOption);

    /**
     * 게임방번호로 방검색
     */
    app.route('/panchange/search_room_by_number') 
    .post(panchange.searchRoomByNumber);

    /**
     * 클랜 이름으로 방검색
     */
    app.route('/panchange/search_room_by_clan')
    .post(panchange.searchRoomByClan);

    /**
     * 닉네임으로 게임방 검색
     */
    app.route('/panchange/search_room_by_nickname')
    .post(panchange.searchRoomByNickname);

    /**
     * 필요 없는 코드인듯..... 추후 체크 필요
     */
    app.route('/panchange/change_game_room_user_count')
    .post(panchange.changeGameRoomUserCount);

    /**
     * 자유대전 게임방 호스트 유저 변경
     * room_number / socket_id
     */
    app.route('/panchange/change_room_master')
    .post(panchange.changeRoomMaster);

    /**
     * clanB 변경
     * room_number / clan_name_B
     */
    app.route('/panchange/change_clan_b')
    .post(panchange.changeClanB);

    /**
     * clanA변경
     * room_number / old_clan_name / new_clan_name
     */
    app.route('/panchange/change_room_clan')
    .post(panchange.changeRoomClan);

    app.route('/panchange/get_master')
    .post(panchange.getMaster);

    app.route('/panchange/auto_enter')    
    .post(panchange.autoEnter);

    app.route('/panchange/check_room_list_for_remove')
    .post(panchange.checkRoomListForRemove);
}
