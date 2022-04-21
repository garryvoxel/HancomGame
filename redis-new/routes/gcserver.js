'use strict';    
module.exports = function(app) {
    var gcserver = require('./../src/gcserverController');

    app.route('/gcserver/clear')
    .post(gcserver.clear);

    app.route('/gcserver/set_used_user')    
    .post(gcserver.setUsedUser);

    app.route('/gcserver/withdraw')
    .post(gcserver.withdraw);

    app.route('/gcserver/get_user_by_nick_name') 
    .post(gcserver.getUserByNickName);

    app.route('/gcserver/get_user_by_socket_id')
    .post(gcserver.getUserBySocketId);

    app.route('/gcserver/set_position')
    .post(gcserver.setPosition);
}
