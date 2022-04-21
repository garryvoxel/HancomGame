const redis                             = require('./redis');

//const setcoin_room_number_redis         = require('./back_redis').setcoin_room_number_redis;

const SETCOIN_ROOM_NUMBER               = require('../config/redis.json')[process.env.NODE_ENV || 'development'].SETCOIN_ROOM_NUMBER;
const PACKET_ERR                        = require('./packet_err').PACKET_ERR;
const async                             = require('async');
const getRLI                         = require('../src/redis_util').getRLI;
const getRedis                       = require('../src/redis_util').getRedis;
const isEmpty                        = require('../common/util').isEmpty;


/**
 * 룸번호와 호스트 이름으로 방삭제하기
 * 
 * @param 룸번호 room_number 
 * @param 서버인덱스 sver_idx 
 * @param 콜백함수 callback 
 */
exports.setcoin_delete_room3 = function(svr_idx,room_number,callback){
    
    var tasks = [
        function(callback){        
            const room_list_redis                   = getRedis(svr_idx);
            const RLI                               = getRLI(svr_idx);
            var _rinfo_key = RLI.KEY3+'-'+room_number; //
            var _data={};
            room_list_redis.hgetall(_rinfo_key,(err,res)=>{
                if(err){ 
                    _data.result        = -1;
                    _data.room_number   =   room_number; 
                    callback(null,_data);
                }else{
                    if(res <= 1){
                        _data.result = 1;   
                        callback(null,_data);
                    }else{
                        _data.result = 2;
                        _data.host_name = res.host_name;
                        _data.room_number = res.room_num;
                        callback(null,_data);
                    }
                }
            });
        },
        function(data,callback){
            const room_list_redis                   = getRedis(svr_idx);
            const RLI                               = getRLI(svr_idx);
            var _data ={};
            if(data.result < 0){
                _data.result = -1;
                callback(null,_data);
            }else if( data == 1){
               
        
                room_list_redis.zrem(RLI.KEY2,data.room_number,(err,res)=>{
                    _data.result = 1;
                    _data.room_number = data.room_number;
                    callback(null,_data);      
                    
                });
            }else{
                var _key = RLI.KEY3+"-"+data.host_name;
                room_list_redis.del(_key,(err,res)=>{
                    _data.result = 2;
                    _data.room_number = data.room_number;
                    callback(null,_data);
                });
            }
        },
        function(data,callback){
            const room_list_redis                   = getRedis(svr_idx);
            const RLI                               = getRLI(svr_idx);
            var _data ={};
            if(data.result < 0){
                _data.result = -1;
                callback(null,_data);
            }else if( data.result === 1 || data.result === 2){
                var _rinfo_key = RLI.KEY3+'-'+data.room_number; 
               
                room_list_redis.del(_rinfo_key,(err,res)=>{
                    _data.result = 1;
                    _data.room_number = data.room_number;
                    callback(null,_data);
                });
            }
        },
        function(data,callback){
            const room_list_redis                   = getRedis(svr_idx);
            const RLI                               = getRLI(svr_idx);
            if(data.result < 0 ){
                callback(-1);
            }else{
             
                // 방에 두유저가 있는데 호스트 유저가 나간이후 두번째 유저가 나갈시 룸넘버가 없어서
                // 두번째 유저가 이 워터풀 함수 호출시 방번호가 없을수 있어서 방어 코드를 넣습니다.
                if(isEmpty(data.room_number)){
                    callback(0);
                }else{
                    room_list_redis.zrem(RLI.KEY1,data.room_number,(err,res)=>{               
                        callback(0);
                    });            
                }
              
            }
    
        }
    
    ];

    async.waterfall(tasks,(err)=>{
        callback(err);
    }); 

    
    

}


