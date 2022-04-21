/**
 * 파일명: setcoinserver2/src/redis.js
 * CRedis클래스 정의
 * room_number_redis, room_list_redis 레디스 클라이언트 핸들러 정의
 * Redis에 저장되어 있는 게임방번호 및 게임방 목록 정보 가져오기
 * config/redis.json 파일 없음 , rediscfg.SETCOIN_ROOM_NUMBER.KEY1 확인 필요
 */
 const redis = require('redis');
 const rediscfg = require('../config/redis.json');
 
 class CRedis{
     constructor(){
         this.room_number_redis = 0;
         this.room_list_redis = 0;
     }
 
     on_create(){      
         this.room_number_redis     = redis.createClient(rediscfg.SETCOIN_ROOM_NUMBER.PORT,rediscfg.SETCOIN_ROOM_NUMBER.HOST);  
         this.room_list_redis        = redis.createClient(rediscfg.SETCOIN_ROOM_LIST.PORT,rediscfg.SETCOIN_ROOM_LIST.HOST);  
     }
 
     on_ready(){        
         this.room_number_redis.on('ready',()=>{    
             console.log('setcoin_room_number_redis ready');
             let _max_room_number = rediscfg.SETCOIN_ROOM_NUMBER.MAX_ROOM_NUMBER;
             this.room_number_redis.flushdb((err,reply)=>{
                 if(err){
                     console.log('critical >> setcoin_room_number_redis flush err..');
                     return;            
                 }else{
                     if(!reply){
                         console.log('critical >> setcoin_room_number_redis flush fail..'+reply);
                         return;
                     }else{
                         for( var i =0; i < _max_room_number; i++){
                             var _rn = i+1;
                             this.room_number_redis.lpush(rediscfg.SETCOIN_ROOM_NUMBER.KEY1,_rn,(err,reply)=>{
                                 if(err){
                                     console.log('critical >> make setcoin_room_number err...!!!');
                                 }
                             });
                         }
                     }            
                 }
             });
         });
 
         this.room_list_redis.on('ready',()=>{
             console.log('room_list_redis ready');            
         });
     }
 
     on_connect(){        
         this.room_number_redis.on('connect',()=>{
             console.log('room_number_redis connected');
         });     
         
         this.room_list_redis.on('connect',()=>{
             console.log('room_list_redison connected');
         });
 
     }
 
     on_error(){
         this.room_number_redis.on('error',(err)=>{
             console.log('room_number_redis error :'+err);
         });        
         this.room_list_redis.on('error',(err)=>{
             console.log('room_list_redison error :'+err);
         });        
     }
 
     getRoomNumber(){
         return this.room_number_redis;
     }
 
     getRoomList(){
         return this.room_list_redis;
     }
 }
 
 let g_redis = new CRedis();
 
 module.exports = g_redis;