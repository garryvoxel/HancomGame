'use strict';
const { setUserScore } = require('../src/module/setCoinModule');

    
module.exports = function(app) {
    var setcoinserver_game = require('../src/setCoinServerGameController');

    /**
     * 동전쌓기 게임 레디 체크
     */
    app.route('/setcoinserver_game/room_game_ready')
    .post(setcoinserver_game.roomGameReady);
    
    /**
     * 새 단어
     */
    app.route('/setcoinserver_game/new_word')
    .post(setcoinserver_game.newWord);

    /**
     * 단어 체크
     */
    app.route('/setcoinserver_game/check_word')
    .post(setcoinserver_game.checkWord);

    /**
     * 단어 입력 시간 초과 
     */
    app.route('/setcoinserver_game/input_word_time_over')
    .post(setcoinserver_game.inputWordTimeOver);

    /**
     * 게임방 떠나기
     */
    app.route('/setcoinserver_game/user_leave')
    .post(setcoinserver_game.userLeave);


    /**
     * 게임 재 시작
     */
    app.route('/setcoinserver_game/re_game_start')
    .post(setcoinserver_game.reGameStart);

    /**
     * 소켓아이디로 유저정보 가져오기
     */
    app.route('/setcoinserver_game/get_user_by_socket')
    .post(setcoinserver_game.getUserBySocket);

    /**
     * disconnect 처리
     */
    app.route('/setcoinserver_game/delete_user')
    .post(setcoinserver_game.deleteUser);

    app.route('/setcoinserver_game/get_enter_other_nickname')
    .post(setcoinserver_game.getEnterOtherNickName);

    app.route('/setcoinserver_game/delete_room')
    .post(setcoinserver_game.deleteRoom);

    /**
     * replace socket
     */
    app.route('/setcoinserver_game/replace_socket_by_session_id')
    .post(setcoinserver_game.replaceSocketBySessionId);
}