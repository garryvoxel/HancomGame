const redis = require('redis');
const redis_config = require('./../../config/redis.json')[process.env.NODE_ENV || 'development'];

class CRedis {
    constructor() {
        this.panchange_channel = null;
        this.gcserver_channel = null;
    }

    init() {
        this.panchange_channel = redis.createClient(redis_config.PANCHANGE_CHANNEL.PORT, redis_config.PANCHANGE_CHANNEL.HOST);
        this.gcserver_channel = redis.createClient(redis_config.PANCHANGE_CHANNEL.PORT, redis_config.PANCHANGE_CHANNEL.HOST);
    }

    onError() {
        this.panchange_channel.on('error', (err) => {
            console.log('panchange_redis error :' + err);
        });
        this.gcserver_channel.on('error', (err) => {
            console.log('gcserver error :' + err);
        });
    }

    onConnect() {
        this.panchange_channel.on('connect', () => {
            console.log('panchange_redis connect');
        });
        this.gcserver_channel.on('connect', () => {
            console.log('gcserver_redis connect');
        });
    }

    onReady() {
        this.panchange_channel.on('ready', () => {
            console.log('panchange_redis ready');
            this.panchange_channel.select(redis_config.PANCHANGE_CHANNEL.DB, (err) => {
                console.log('panchange_redis select :' + '(' + this.panchange_channel.selected_db + ')..' + err);
            });
        });        

        this.gcserver_channel.on('ready', () => {
            console.log('gcserver_redis ready');
            this.gcserver_channel.select(redis_config.GCSERVER_CHANNEL.DB, (err) => {
                console.log('gcserver_redis select :' + '(' + this.gcserver_channel.selected_db + ')..' + err);
            });
        });        
    }

    getPanchangeChannel()     {
        return this.panchange_channel;
    }

    getGcserverChannel() {
        return this.gcserver_channel;
    }
}
let gRedis = new CRedis();
module.exports = gRedis;