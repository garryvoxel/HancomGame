const redis = require('redis');
const redis_config = require('./../../config/redis.json')[process.env.NODE_ENV || 'development'];

class CRedis {
    constructor() {
        this.setcoin_room_channel1 = null;
        this.setcoin_room_channel2 = null;
        this.setcoin_room_channel3 = null;
        this.setcoin_room_channel4 = null;
    }

    init() {
        this.setcoin_room_channel1 = redis.createClient(redis_config.SETCOIN_ROOM_CHANNEL_1.PORT, redis_config.SETCOIN_ROOM_CHANNEL_1.HOST);
        this.setcoin_room_channel2 = redis.createClient(redis_config.SETCOIN_ROOM_CHANNEL_2.PORT, redis_config.SETCOIN_ROOM_CHANNEL_2.HOST);
        this.setcoin_room_channel3 = redis.createClient(redis_config.SETCOIN_ROOM_CHANNEL_3.PORT, redis_config.SETCOIN_ROOM_CHANNEL_3.HOST);
        this.setcoin_room_channel4 = redis.createClient(redis_config.SETCOIN_ROOM_CHANNEL_4.PORT, redis_config.SETCOIN_ROOM_CHANNEL_4.HOST);
    }

    onError() {
       this.setcoin_room_channel1.on('error', (err) => {
            console.log('setcoin_room_channel1 error :' + err);
       });
       this.setcoin_room_channel2.on('error', (err) => {
            console.log('setcoin_room_channel2 error :' + err);
       });
       this.setcoin_room_channel3.on('error', (err) => {
            console.log('setcoin_room_channel3 error :' + err);
       });
       this.setcoin_room_channel4.on('error', (err) => {
            console.log('setcoin_room_channel4 error :' + err);
       });
    }

    onConnect() {
       this.setcoin_room_channel1.on('connect', () => {
            console.log('setcoin_room_channel1 connect');
       });
       this.setcoin_room_channel2.on('connect', () => {
            console.log('setcoin_room_channel2 connect');
       });
       this.setcoin_room_channel3.on('connect', () => {
            console.log('setcoin_room_channel3 connect');
       });
       this.setcoin_room_channel4.on('connect', () => {
            console.log('setcoin_room_channel4 connect');
       });
    }

    onReady() {
        this.setcoin_room_channel1.on('ready', () => {
            console.log('setcoin_room_channel1_redis ready');
            this.setcoin_room_channel1.select(redis_config.SETCOIN_ROOM_CHANNEL_1.DB, (err) => {
                console.log('setcoin_room_channel1_redis select :' + '(' + this.setcoin_room_channel1.selected_db + ')..' + err);
            });
        });

        this.setcoin_room_channel2.on('ready', () => {
            console.log('setcoin_room_channel2_redis ready');
            this.setcoin_room_channel2.select(redis_config.SETCOIN_ROOM_CHANNEL_2.DB, (err) => {
                console.log('setcoin_room_channel2_redis select :' + '(' + this.setcoin_room_channel2.selected_db + ')..' + err);
            });
        });

        this.setcoin_room_channel3.on('ready', () => {
            console.log('setcoin_room_channel3_redis ready');
            this.setcoin_room_channel3.select(redis_config.SETCOIN_ROOM_CHANNEL_3.DB, (err) => {
                console.log('setcoin_room_channel3_redis select :' + '(' + this.setcoin_room_channel3.selected_db + ')..' + err);
            });
        });

        this.setcoin_room_channel4.on('ready', () => {
            console.log('setcoin_room_channel4_redis ready');
            this.setcoin_room_channel4.select(redis_config.SETCOIN_ROOM_CHANNEL_4.DB, (err) => {
                console.log('setcoin_room_channel4_redis select :' + '(' + this.setcoin_room_channel4.selected_db + ')..' + err);
            });
        });
    }

    getSetcoinRoomChannel(server_idx) {
        if(server_idx == 1)
            return this.setcoin_room_channel1;
        else if(server_idx == 2) 
            return this.setcoin_room_channel2;
        else if(server_idx == 1001)
            return this.setcoin_room_channel3;
        else
            return this.setcoin_room_channel4;
    }
}
let gRedis = new CRedis();
module.exports = gRedis;

