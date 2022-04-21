/**
 * 파일명: setcoinserver1/src/redis_func.js
 * CRedis 클래스 객체에 정의된 메소드를 실제로 이용하는 부분
 * Redis에서 방번호를 가져오는 메소드 정의
 * 다만 Redis 처리 메소드가 아직 개발되어 있지 않다.
 */
const async                     = require('async');
const room_redis                = require('./redis.js');
const PACKET_ERR                = require('./packet_err').CG_PACKET_ERR;
const SETCOIN_ROOM_NUMBER       = require('../config/redis.json').SETCOIN_ROOM_NUMBER;
/**
 * 룸번호 가져오기
 */
exports.get_room_number = function(callback){

    const room_number_redis = room_redis.getRoomNumber();
    let tasks=[
        function(callback){
            room_number_redis.llen(SETCOIN_ROOM_NUMBER.KEY1,(err,reply)=>{     
                if(err){                        
                    callback(PACKET_ERR.SETCOIN_ROOMNUMBER_REDIS,null);
                }else{
                    if(reply <=0){                
                        callback(PACKET_ERR.GET_ROOM_NUMBER_EMPTY,null);
                    }else{    
                        callback(PACKET_ERR.SUCCESS,null);
                    }
                }
            });
        },
        function(data,callback){
            if(data != PACKET_ERR.SUCCESS){
                callback(data,null);
            }else{            
                room_number_redis.rpop(SETCOIN_ROOM_NUMBER.KEY1,(err,reply)=>{
                    if(err){
                        callback(PACKET_ERR.GET_ROOM_NUMBER_REDIS2,null);
                    }else{
                        if(reply1 <= 0){
                            callback(PACKET_ERR.GET_ROOM_NUMBER_EMPTY2,null);
                        }else{           
                            let _rdata = {};                   
                            _rdata.room_number = reply;
                            callback(PACKET_ERR.SUCCESS,_rdata);
                        }
                    }
                });
            }
        }//function
    ];


    async.waterfall(tasks,(err,data)=>{
        callback(err,data);
    });

}

/**
 * 룸번호 반환하기
 */
 exports.return_room_number = function(room_number,callback){
    const room_number_redis = room_redis.getRoomNumber();
    room_number_redis.lpush(SETCOIN_ROOM_NUMBER.KEY1,room_number,(err,reply)=>{
        if(err){           
            callback(PACKET_ERR.RETURN_ROOM_NUMBER_REDIS); 
        }else{
            if(reply <= 0){                
                callback(PACKET_ERR.RETURN_ROOM_NUMBER_REDIS_RES); 
            }else{         
                callback(PACKET_ERR.SUCCESS);       
            }
        }
    });    
 }

 exports.write_room = function(){
     
 }