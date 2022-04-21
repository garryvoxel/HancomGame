/**
 * 파일명: panchangeserver/src/redis.js
 * gc_server와 setcoinserver1에서 pubsub파일과 같은 기능
 * 다른 모듈과의 메시지 전송/구독
 * 게임 초대 및 게임중인 경우 gc_server호출
 */
var redis = require('redis');
var redisConf = require('../config/pubsub.json')[process.env.NODE_ENV || 'development'];
var serverConf = require('../config/server.json')[process.env.NODE_ENV || 'development'];
// var redisConf = require('../config/pubsub.json')['test'];
// var serverConf = require('../config/server.json')['test'];
const INVITE_MSG = 'game_invited';
const ACCEPT_MSG = 'game_invited_accept';
const REJECT_MSG = 'game_invited_reject';
const CHANNEL_NAME = 'private_system_chat';

var rejectCallback = null;
var acceptCallback = null;
//Redis 서버 접속 , 클라이언트 객체 창조
var pub = redis.createClient(
    redisConf.PUB_SUB_REDIS_PORT, 
    redisConf.PUB_SUB_REDIS_HOST
    );
var sub = redis.createClient(
    redisConf.PUB_SUB_REDIS_PORT, 
    redisConf.PUB_SUB_REDIS_HOST
    );

pub.on('connect', function() {
    console.log('--- pub connected');
});

sub.on('connect', function() {
    console.log('--- sub connected');
});

pub.on('error', function(err) {
    console.log(err);
});

sub.on('error', function(err) {
    console.log(err);
});

//채널에 subscribe
sub.subscribe(CHANNEL_NAME);
//publish한 messge받기
sub.on('message', function(channel, msg) {
    //채널네임이 다를때
    if(channel != CHANNEL_NAME) {
        return;
    }
    //메세지 JSON parse
    var data = JSON.parse(msg);
    //게이코드가 다를때
    if(data.game_code != serverConf.GAME_CODE) {
        return;
    }

    switch(data.msg_idx) {
        case REJECT_MSG: {
            console.log('[[ ' + REJECT_MSG + ' ]]');
            if(rejectCallback) {
                rejectCallback({
                    from : data.to_nick_name,
                    to: data.nick_name
                })
            }
        }
    }
});
//메세지 받기
sub.on(ACCEPT_MSG, function(data) {
    console.log("[[ACCEPT_MSG]]");
    console.log(data);
    if(acceptCallback) {
        acceptCallback();
    }
});
//메세지 거절
sub.on(REJECT_MSG, function(data) {
    console.log("[[REJECT_MSG]]");
    console.log(data);
    if(rejectCallback) {
        rejectCallback();
    }
});
//초대
exports.invite = function(from, fromAvatar, color, to, roomNum, roomInfo) {
    // if(rejectCallback) {
    //     rejectCallback(from, to[0]);
    // }
    //redish의 채널에 publish
    pub.publish(CHANNEL_NAME, JSON.stringify({
        msg_idx: INVITE_MSG,
        room_number: roomNum.substring(4),
        room_title: roomInfo.ROOM_NAME,
        is_lock: !roomInfo.IS_FREE,
        password: roomInfo.PASSWORD,
        // back_ground: roomInfo.BACKGROUND,
        back_ground: color,
        play_time: roomInfo.RUNNING_TIME / 60,
        game_code: serverConf.GAME_CODE,
        invited_time: new Date(),
        from_nick_name: from,
        from_character_type: fromAvatar,
        to_nick_name: to,
        server_dns: serverConf.SERVER_IP,
        server_idx: serverConf.SERVER_IDX
    }));
}

exports.initRejectCallback = function(callback) {
    rejectCallback = callback;
}

exports.initAcceptCallback = function(callback) {
    acceptCallback = callback;
}