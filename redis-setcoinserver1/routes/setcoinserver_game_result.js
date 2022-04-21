'use strict';    
module.exports = function(app) {
    var setcoinserver_game_result = require('../src/setCoinServerGameResultController');

    app.route('/setcoinserver_game_result/game_result')
    .post(setcoinserver_game_result.gameResult);
}