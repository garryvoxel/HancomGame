const redis   = require('redis');

const rediscfg = require('../config/redis.json')[process.env.NODE_ENV || 'development'];

class CRedis{
    constructor(){
        this.setcoin_channel_1              = 0;
        this.setcoin_channel_2              = 0;
        this.setcoin_channel_1001           = 0;
        this.setcoin_channel_1002           = 0;


        this.panchange_channel_1    = 0;

        
        this.user_session_redis             = 0;        
        this.week_ranking_redis             = 0;        
    }

    on_create(){
        this.setcoin_channel_1          = redis.createClient(rediscfg.SETCOIN_ROOM_CHANNEL_1.PORT,rediscfg.SETCOIN_ROOM_CHANNEL_1.HOST);
        this.setcoin_channel_2          = redis.createClient(rediscfg.SETCOIN_ROOM_CHANNEL_2.PORT,rediscfg.SETCOIN_ROOM_CHANNEL_2.HOST);
        this.setcoin_channel_1001       = redis.createClient(rediscfg.SETCOIN_ROOM_CHANNEL_1001.PORT,rediscfg.SETCOIN_ROOM_CHANNEL_1001.HOST);
        this.setcoin_channel_1002       = redis.createClient(rediscfg.SETCOIN_ROOM_CHANNEL_1002.PORT,rediscfg.SETCOIN_ROOM_CHANNEL_1002.HOST);


               
        this.user_session_redis          = redis.createClient(rediscfg.USER_SESSION_REDIS.PORT,rediscfg.USER_SESSION_REDIS.HOST);
        this.panchange_channel_1         = redis.createClient(rediscfg.PANCHANGE_ROOM_CHANNEL_1.PORT,rediscfg.PANCHANGE_ROOM_CHANNEL_1.HOST);


        //주간랭킹
        this.week_ranking_redis           = redis.createClient(rediscfg.RANKING_REDIS.PORT,rediscfg.RANKING_REDIS.HOST);        
    }

    on_error(){
        this.setcoin_channel_1.on('error',(err)=>{
            console.log('setcoin_channel_1_redis error :'+err);
        });
        this.setcoin_channel_2.on('error',(err)=>{
            console.log('setcoin_channel_2_redis error :'+err);
        });
        this.setcoin_channel_1001.on('error',(err)=>{
            console.log('setcoin_channel_1001 error :'+err);
        });
        this.setcoin_channel_1002.on('error',(err)=>{
            console.log('setcoin_channel_1002 error :'+err);
        });

        this.panchange_channel_1.on('error',(err)=>{
            console.log('panchange_channel_1 error :'+err);
        });

        this.user_session_redis.on('error',(err)=>{
            console.log('user_session error :'+err);
        });

        this.week_ranking_redis.on('error',(err)=>{
            console.log('ranking_redis error :'+err);
        });

    }

    // 이함수들은 해당 게임서버가 재시작 되었을때 레디스를 플러싱하고난후 방번호를 다시  인서트 하기위함입니다.
    on_ready_Coin_redis_ch1(){
         //채널 1번 방번호 생성
        this.setcoin_channel_1.on('ready',()=>{    
            console.log('setcoin_channel_1_redis ready');
            let _max_room_number = rediscfg.SETCOIN_ROOM_CHANNEL_1.MAX_ROOM_NUMBER;
            this.setcoin_channel_1.select(rediscfg.SETCOIN_ROOM_CHANNEL_1.DB,(err)=>{
                if(err){
                    console.log("레디스 에러발생 ------------------");
                }
                console.log('setcoin_channel_1_redis select:'+'('+this.setcoin_channel_1.selected_db+')..'+err);
            });

            this.setcoin_channel_1.llen(rediscfg.SETCOIN_ROOM_CHANNEL_1.KEY1,(err,reply)=>{
                if(err){
                    console.log("on ready setcoin_channel_1_redis >> error "+err);
                }else{
                    if(reply<=0){
                        for( var i =0; i < _max_room_number; i++){
                            var _rn = i+1;
                            this.setcoin_channel_1.lpush(rediscfg.SETCOIN_ROOM_CHANNEL_1.KEY1,_rn,(err,reply)=>{
                                if(err){
                                    console.log('critical >> make setcoin_channel_1_redis err...!!!');
                                }
                            });
                        }
                    }else{
               
                    }
                }                
            });
            
        });

       
    }
    on_ready_Coin_redis_ch2(){
        //채널 2번 방번호 생성
        this.setcoin_channel_2.on('ready',()=>{    
            console.log('setcoin_channel_1_redis ready');
            let _max_room_number = rediscfg.SETCOIN_ROOM_CHANNEL_2.MAX_ROOM_NUMBER;
            this.setcoin_channel_2.select(rediscfg.SETCOIN_ROOM_CHANNEL_2.DB,(err)=>{
                console.log('setcoin_channel_2_redis select:'+'('+this.setcoin_channel_2.selected_db+')..'+err);
            });

            this.setcoin_channel_2.llen(rediscfg.SETCOIN_ROOM_CHANNEL_2.KEY1,(err,reply)=>{
                if(err){
                    console.log("on ready setcoin_channel_2_redis >> error "+err);
                }else{
                    if(reply<=0){
                        for( var i =0; i < _max_room_number; i++){
                            var _rn = i+1;
                            this.setcoin_channel_2.lpush(rediscfg.SETCOIN_ROOM_CHANNEL_2.KEY1,_rn,(err,reply)=>{
                                if(err){
                                    console.log('critical >> make setcoin_channel_2_redis err...!!!');
                                }
                            });
                        }
                    }
                }                
            });
            
        });

       
    }
    on_ready_Coin_redis_ch3(){
         //채널 1001번 방번호 생성
         this.setcoin_channel_1001.on('ready',()=>{    
            console.log('setcoin_channel_1001 ready');
            let _max_room_number = rediscfg.SETCOIN_ROOM_CHANNEL_1001.MAX_ROOM_NUMBER;
            this.setcoin_channel_1001.select(rediscfg.SETCOIN_ROOM_CHANNEL_1001.DB,(err)=>{
                console.log('setcoin_channel_1001 select:'+'('+this.setcoin_channel_1001.selected_db+')..'+err);
            });

            this.setcoin_channel_1001.llen(rediscfg.SETCOIN_ROOM_CHANNEL_1001.KEY1,(err,reply)=>{
                if(err){
                    console.log("on ready setcoin_channel_1001 >> error "+err);
                }else{
                    if(reply<=0){
                        for( var i =0; i < _max_room_number; i++){
                            var _rn = i+1;
                            this.setcoin_channel_1001.lpush(rediscfg.SETCOIN_ROOM_CHANNEL_1001.KEY1,_rn,(err,reply)=>{
                                if(err){
                                    console.log('critical >> make setcoin_channel_1001 err...!!!');
                                }
                            });
                        }
                    }
                }                
            });
            
        });
       
    }
    on_ready_Coin_redis_ch4(){
       //채널 1002번 방번호 생성
       this.setcoin_channel_1002.on('ready',()=>{    
        console.log('setcoin_channel_1002 ready');
        let _max_room_number = rediscfg.SETCOIN_ROOM_CHANNEL_1002.MAX_ROOM_NUMBER;
        this.setcoin_channel_1002.select(rediscfg.SETCOIN_ROOM_CHANNEL_1002.DB,(err)=>{
            console.log('setcoin_channel_1002 select:'+'('+this.setcoin_channel_1002.selected_db+')..'+err);
        });

        this.setcoin_channel_1002.llen(rediscfg.SETCOIN_ROOM_CHANNEL_1002.KEY1,(err,reply)=>{
            if(err){
                console.log("on ready setcoin_channel_1002 >> error "+err);
            }else{
                if(reply<=0){
                    for( var i =0; i < _max_room_number; i++){
                        var _rn = i+1;
                        this.setcoin_channel_1002.lpush(rediscfg.SETCOIN_ROOM_CHANNEL_1002.KEY1,_rn,(err,reply)=>{
                            if(err){
                                console.log('critical >> make setcoin_channel_1002 err...!!!');
                            }
                        });
                    }
                }
            }                
        });
        
    });        
       
    }

    on_ready_PanChange_redis_ch1(){
        this.panchange_channel_1.on('ready',()=>{    
            console.log('panchange_channel_1 ready');
        
            let _max_room_number = rediscfg.PANCHANGE_ROOM_CHANNEL_1.MAX_ROOM_NUMBER;

            this.panchange_channel_1.llen(rediscfg.PANCHANGE_ROOM_CHANNEL_1.KEY4,(err,reply)=>{
                if(err){
                    console.log("on ready panchange_channel_1 >> error "+err);
                }else{
                    if(reply<=0){
                        for( var i =0; i < _max_room_number; i++){
                            var _rn = i+1;
                            this.panchange_channel_1.lpush(rediscfg.PANCHANGE_ROOM_CHANNEL_1.KEY4,_rn,(err,reply)=>{
                                if(err){
                                    console.log('critical >> make panchange_channel_1 err...!!!');
                                    console.log(err);
                                }
                            });
                        }
                    }
                }
            });

        });
    }


    on_ready(){
        //채널 1번 방번호 생성
        this.setcoin_channel_1.on('ready',()=>{    
            console.log('setcoin_channel_1_redis ready');
            let _max_room_number = rediscfg.SETCOIN_ROOM_CHANNEL_1.MAX_ROOM_NUMBER;
            this.setcoin_channel_1.select(rediscfg.SETCOIN_ROOM_CHANNEL_1.DB,(err)=>{
                console.log('setcoin_channel_1_redis select:'+'('+this.setcoin_channel_1.selected_db+')..'+err);
            });

            this.setcoin_channel_1.llen(rediscfg.SETCOIN_ROOM_CHANNEL_1.KEY1,(err,reply)=>{
                if(err){
                    console.log("on ready setcoin_channel_1_redis >> error "+err);
                }else{
                    if(reply<=0){
                        for( var i =0; i < _max_room_number; i++){
                            var _rn = i+1;
                            this.setcoin_channel_1.lpush(rediscfg.SETCOIN_ROOM_CHANNEL_1.KEY1,_rn,(err,reply)=>{
                                if(err){
                                    console.log('critical >> make setcoin_channel_1_redis err...!!!');
                                }
                            });
                        }
                    }
                }                
            });
            
        });


        //채널 2번 방번호 생성
        this.setcoin_channel_2.on('ready',()=>{    
            console.log('setcoin_channel_1_redis ready');
            let _max_room_number = rediscfg.SETCOIN_ROOM_CHANNEL_2.MAX_ROOM_NUMBER;
            this.setcoin_channel_2.select(rediscfg.SETCOIN_ROOM_CHANNEL_2.DB,(err)=>{
                console.log('setcoin_channel_2_redis select:'+'('+this.setcoin_channel_2.selected_db+')..'+err);
            });

            this.setcoin_channel_2.llen(rediscfg.SETCOIN_ROOM_CHANNEL_2.KEY1,(err,reply)=>{
                if(err){
                    console.log("on ready setcoin_channel_2_redis >> error "+err);
                }else{
                    if(reply<=0){
                        for( var i =0; i < _max_room_number; i++){
                            var _rn = i+1;
                            this.setcoin_channel_2.lpush(rediscfg.SETCOIN_ROOM_CHANNEL_2.KEY1,_rn,(err,reply)=>{
                                if(err){
                                    console.log('critical >> make setcoin_channel_2_redis err...!!!');
                                }
                            });
                        }
                    }
                }                
            });
            
        });

        //채널 1001번 방번호 생성
        this.setcoin_channel_1001.on('ready',()=>{    
            console.log('setcoin_channel_1001 ready');
            let _max_room_number = rediscfg.SETCOIN_ROOM_CHANNEL_1001.MAX_ROOM_NUMBER;
            this.setcoin_channel_1001.select(rediscfg.SETCOIN_ROOM_CHANNEL_1001.DB,(err)=>{
                console.log('setcoin_channel_1001 select:'+'('+this.setcoin_channel_1001.selected_db+')..'+err);
            });

            this.setcoin_channel_1001.llen(rediscfg.SETCOIN_ROOM_CHANNEL_1001.KEY1,(err,reply)=>{
                if(err){
                    console.log("on ready setcoin_channel_1001 >> error "+err);
                }else{
                    if(reply<=0){
                        for( var i =0; i < _max_room_number; i++){
                            var _rn = i+1;
                            this.setcoin_channel_1001.lpush(rediscfg.SETCOIN_ROOM_CHANNEL_1001.KEY1,_rn,(err,reply)=>{
                                if(err){
                                    console.log('critical >> make setcoin_channel_1001 err...!!!');
                                }
                            });
                        }
                    }
                }                
            });
            
        });
        
        //채널 1002번 방번호 생성
        this.setcoin_channel_1002.on('ready',()=>{    
            console.log('setcoin_channel_1002 ready');
            let _max_room_number = rediscfg.SETCOIN_ROOM_CHANNEL_1002.MAX_ROOM_NUMBER;
            this.setcoin_channel_1002.select(rediscfg.SETCOIN_ROOM_CHANNEL_1002.DB,(err)=>{
                console.log('setcoin_channel_1002 select:'+'('+this.setcoin_channel_1002.selected_db+')..'+err);
            });

            this.setcoin_channel_1002.llen(rediscfg.SETCOIN_ROOM_CHANNEL_1002.KEY1,(err,reply)=>{
                if(err){
                    console.log("on ready setcoin_channel_1002 >> error "+err);
                }else{
                    if(reply<=0){
                        for( var i =0; i < _max_room_number; i++){
                            var _rn = i+1;
                            this.setcoin_channel_1002.lpush(rediscfg.SETCOIN_ROOM_CHANNEL_1002.KEY1,_rn,(err,reply)=>{
                                if(err){
                                    console.log('critical >> make setcoin_channel_1002 err...!!!');
                                }
                            });
                        }
                    }
                }                
            });
            
        });        





        this.panchange_channel_1.on('ready',()=>{    
            console.log('panchange_channel_1 ready');
        
            let _max_room_number = rediscfg.PANCHANGE_ROOM_CHANNEL_1.MAX_ROOM_NUMBER;

            this.panchange_channel_1.llen(rediscfg.PANCHANGE_ROOM_CHANNEL_1.KEY4,(err,reply)=>{
                if(err){
                    console.log("on ready panchange_channel_1 >> error "+err);
                }else{
                    if(reply<=0){
                        for( var i =0; i < _max_room_number; i++){
                            var _rn = i+1;
                            this.panchange_channel_1.lpush(rediscfg.PANCHANGE_ROOM_CHANNEL_1.KEY4,_rn,(err,reply)=>{
                                if(err){
                                    console.log('critical >> make panchange_channel_1 err...!!!');
                                }
                            });
                        }
                    }
                }
            });

        });

        this.user_session_redis.on('ready',()=>{    
            console.log('user_session ready');
        });

        this.week_ranking_redis.on('ready',()=>{    
            console.log('ranking_redis ready');
        });
        
    }

    on_connect(){
        this.setcoin_channel_1.on('connect',()=>{
            console.log('setcoin_channel_1_redis connected');
        });     
        this.setcoin_channel_2.on('connect',()=>{
            console.log('setcoin_channel_2_redis connected');
        });     
        this.setcoin_channel_1001.on('connect',()=>{
            console.log('setcoin_channel_1001 connected');
        });     

        this.setcoin_channel_1002.on('connect',()=>{
            console.log('setcoin_channel_1002 connected');
        });     


        
        this.panchange_channel_1.on('connect',()=>{
            console.log('panchange_channel_1 connected');
        });

        this.user_session_redis.on('connect',()=>{
            console.log('user_session_redis connected');
        });

        this.week_ranking_redis.on('connect',()=>{
            console.log('setcoin_ranking_redis connected');
        });

    }

    on_select(){
        // this.setcoin_room_number_redis.select(rediscfg.SETCOIN_ROOM_NUMBER.DB,(err)=>{
        //     console.log('setcoin_room_number_redis select:'+'('+this.setcoin_room_number_redis.selected_db+')..'+err);
        // });
        // this.panchange_room_number_redis.select(rediscfg.PANCHANGE_ROOM_NUMBER.DB,(err)=>{
        //     console.log('panchange_room_number_redis select:'+'('+this.panchange_room_number_redis.selected_db+')..'+err);
        // });        
        
        this.panchange_channel_1.select(rediscfg.PANCHANGE_ROOM_CHANNEL_1.DB,(err)=>{
            console.log('panchange_room_list_redis select :'+'('+this.panchange_channel_1.selected_db+')..'+err);
        });
        
        this.user_session_redis.select(rediscfg.USER_SESSION_REDIS.DB,(err)=>{
            console.log('user_session_redis select :'+'('+this.user_session_redis.selected_db+')..'+err);
        });
        
        this.week_ranking_redis.select(rediscfg.RANKING_REDIS.DB,(err)=>{
            console.log('ranking_redis select:'+'('+this.week_ranking_redis.selected_db+')..'+err);
        });

    }
    /**
     * 동전쌓기 채널 1번
     */
    getSetcoinChannel1(){
        return this.setcoin_channel_1;
    }

    /**
    * 동전쌓기 채널 2번
    */
    getSetcoinChannel2(){
        return this.setcoin_channel_2;
    }

    /**
    * 동전쌓기 채널 1001번
    */
    getSetcoinChannel1001(){
        return this.setcoin_channel_1001;
    }


     /**
     * 동전쌓기 채널 1002번
     */
    getSetcoinChannel1002(){
        return this.setcoin_channel_1002;
    }
    

     /**
     * 판뒤집기 룸리스트 레디스
     */
    getPanchangeChannel1(){
        console.log("판뒤집기레디스 들어옴 ==================================");
        return this.panchange_channel_1;
    }
    /**
     * 유저섹션아이디 레디스
     */
    getUserSessionRedis(){
        return this.user_session_redis;
    }

    /**
     * 주간랭킹 레디스
     */
    getWeekRankingRedis(){
        return this.week_ranking_redis;
    }

}

let g_redis = new CRedis();

module.exports = g_redis;