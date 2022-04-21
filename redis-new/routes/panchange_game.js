'use strict';    
module.exports = function(app) {
    var panchangeGame = require('./../src/panchangeGameController');    

    /**
     * 닉네임으로 유저정보 가져오기
     * nickname
     */
    app.route('/panchange_game/find_nickname')
    .post(panchangeGame.findNickname);

    /**
     * 소켓아이디로 룸번호 가져오기
     * socket_id
     */
    app.route('/panchange_game/find_room_num')
    .post(panchangeGame.findRoomNum);

    /**
     * 게임방 입장
     * room_number , PK , NICKNAME , AVATAR , socket_id
     */
    app.route('/panchange_game/join_user')
    .post(panchangeGame.joinUser);

    /**
     * 세션아이디로 유저 검색하기
     * uuid
     */
    app.route('/panchange_game/find_user_by_session')
    .post(panchangeGame.findUserBySession);

    /**
     * 모든 유저의 준비 상태 체크
     * room_number
     */
    app.route('/panchange_game/is_all_ready')
    .post(panchangeGame.isAllReady);

    /**
     * RED팀 , BLUE팀 유저수가 동일한지 체크
     */
    app.route('/panchange_game/is_valance')
    .post(panchangeGame.isValance);

    /**
     * room_number와 소켓아이디로 유저정보 가져오기
     * room_number / socket_id
     */
    app.route('/panchange_game/get_user')
    .post(panchangeGame.getUser);

    /**
     * uuid또는 닉네임으로 유저정보 가져오기 
     * room_number / uuid / nickname
     */
    app.route('/panchange_game/find_by_uuid')
    .post(panchangeGame.findByUUID);

    /**
     * 닉네임으로 유정정보 소켓 아이디 변경하기
     */
    app.route('/panchange_game/replace_socket_by_nickname')
    .post(panchangeGame.replaceSocketByNickname);

    /**
     * 게임방 탈퇴
     * room_number, socket_id
     */
    app.route('/panchange_game/leave_user')
    .post(panchangeGame.leaveUser);

    /**
     * 게임방 상세정보 가져오기
     * room_number
     */
    app.route('/panchange_game/get_room_info')
    .post(panchangeGame.getRoomInfo);

    /**
     * 게임방 클랜정보 가져오기 
     * room_number
     */
    app.route('/panchange_game/get_clan_info')
    .post(panchangeGame.getClanInfo);

    /**
     * 준비상태 변경
     */
    app.route('/panchange_game/change_ready')
    .post(panchangeGame.changeReady);

    /**
     * 게임방 유저 목록 가져오기
     * room_number
     */
    app.route('/panchange_game/get_user_info')
    .post(panchangeGame.getUserInfo);

    /**
     * 유저 게임 로딩 완료
     * room_number
     * socket_id
     */
    app.route('/panchange_game/set_loading')
    .post(panchangeGame.setLoading);

    /**
     * 게임방 내 유저 모두 로딩 완료되었는지 체크
     * room_number
     */
    app.route('/panchange_game/is_all_loading')
    .post(panchangeGame.isAllLoading);

    /**
     * 게임 강제 시작
     * room_number
     */
    app.route('/panchange_game/force_start_game')
    .post(panchangeGame.forceStartGame);

    /**
     * 현재 로딩 완료 수
     * room_number
     */
    app.route('/panchange_game/get_current_loading')
    .post(panchangeGame.getCurrentLoading);

    /**
     * 
     */
    app.route('/panchange_game/set_end_game')
    .post(panchangeGame.setEndGame);

    app.route('/panchange_game/is_all_end_game')
    .post(panchangeGame.isAllEndGame);

    /**
     * 팀 이동
     * socket_id / room_number
     */
    app.route('/panchange_game/move_other_team')
    .post(panchangeGame.moveOtherTeam);
    //
}
