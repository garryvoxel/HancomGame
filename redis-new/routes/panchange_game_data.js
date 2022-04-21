'use strict';
module.exports = function(app) {
    var panchangeGameData = require('./../src/panchangeGameDataController');   

    /**
     * 게임 데이터 가져오기 
     * room_number
     */
    app.route('/panchange_game_data/get_init')
    .post(panchangeGameData.getInit);

    /**
     * 게임데이터 초기화
     * room_number
     */
    app.route('/panchange_game_data/init')
    .post(panchangeGameData.init);

    /**
     * 정답 체크 
     * room_number / socket_id / board_id / answer
     */
    app.route('/panchange_game_data/check_answer')
    .post(panchangeGameData.checkAnswer);

    /**
     * 게임보드 정보 가져오기
     * room_number / board_id
     */
    app.route('/panchange_game_data/game_board')
    .post(panchangeGameData.getBoard);

    /**
     * 해당 팀 보드 정보 확인
     * room_number , socket_id
     */
    app.route('/panchange_game_data/get_team_board')
    .post(panchangeGameData.getTeamBoard);
    
    /**
     * 장문 정답 체크
     * room_number / socket_id / event_id / quiz_id
     */
    app.route('/panchange_game_data/check_event')
    .post(panchangeGameData.checkEvent);

    /**
     * 이벤트 정답자 정보 전송
     * room_number / event_id / quiz_id
     */
    app.route('/panchange_game_data/get_event')
    .post(panchangeGameData.getEvent);

    /**
     * 보너스 아이템 점수 가산
     * room_number / socket_id
     */
    app.route('/panchange_game_data/add_bonus')
    .post(panchangeGameData.addBonus);

    /**
     * 해당 팀 보드 초기화
     * room_number / socket_id
     */
    app.route('/panchange_game_data/set_team_board')
    .post(panchangeGameData.setTeamBoard);

    app.route('/panchange_game_data/get_ranking')
    .post(panchangeGameData.getRanking);

    app.route('/panchange_game_data/get_game_result')
    .post(panchangeGameData.getGameResult);

    app.route('/panchange_game_data/set_game_timer')
    .post(panchangeGameData.setGameTimer);
}