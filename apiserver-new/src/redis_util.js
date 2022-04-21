const redis                         = require('../src/redis');


exports.getRedis = function(channel_idx){
    switch(channel_idx){
        case 1: return redis.getSetcoinChannel1();         
        case 2: return redis.getSetcoinChannel2();
        case 1001: return redis.getSetcoinChannel1001();
        case 1002: return redis.getSetcoinChannel1002();
    }

    return null;
}

exports.getRedis_Pan = function(channel_idx){
   
       return redis.getPanchangeChannel1();

}

exports.getRLI = function(channel_idx){
    switch(channel_idx){
        case 1: return require('../config/redis.json')[process.env.NODE_ENV || 'development'].SETCOIN_ROOM_CHANNEL_1;         
        case 2: return require('../config/redis.json')[process.env.NODE_ENV || 'development'].SETCOIN_ROOM_CHANNEL_2;
        case 1001: return require('../config/redis.json')[process.env.NODE_ENV || 'development'].SETCOIN_ROOM_CHANNEL_1001;
        case 1002: return require('../config/redis.json')[process.env.NODE_ENV || 'development'].SETCOIN_ROOM_CHANNEL_1002;
    }

    return null;
}

