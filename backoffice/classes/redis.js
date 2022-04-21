const redis   = require('redis');

const rediscfg = require('../config/redis.json')[process.env.NODE_ENV || 'development'];

class cRedis{
    constructor(){
        this.week_ranking_redis             = 0;
        this.on_create();    
        this.on_error();
        this.on_ready();
        this.on_connect();
        this.on_select();
    }

    on_create(){
        //주간랭킹
        this.week_ranking_redis           = redis.createClient(rediscfg.RANKING_REDIS.PORT,rediscfg.RANKING_REDIS.HOST);
    }

    on_error(){
        this.week_ranking_redis.on('error',(err)=>{
            console.log('ranking_redis error :'+err);
        });
    }

    on_ready(){
        this.week_ranking_redis.on('ready',()=>{
            console.log('ranking_redis ready');
        });

    }

    on_connect(){
        this.week_ranking_redis.on('connect',()=>{
            console.log('ranking_redis connected');
        });
    }

    on_select(){
        this.week_ranking_redis.select(rediscfg.RANKING_REDIS.DB,(err)=>{
            console.log('ranking_redis select:'+'('+this.week_ranking_redis.selected_db+')..'+err);
        });

    }

    /**
     * 주간랭킹 레디스
     */
    getWeekRankingRedis(){
        return this.week_ranking_redis;
    }
}

module.exports = cRedis;