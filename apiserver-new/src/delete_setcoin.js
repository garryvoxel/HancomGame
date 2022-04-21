const redis                             = require('./redis');
const RLI                               = require('../config/redis.json')[process.env.NODE_ENV || 'development'].SETCOIN_ROOM_LIST_REDIS;
//const setcoin_room_number_redis         = require('./back_redis').setcoin_room_number_redis;

const SETCOIN_ROOM_NUMBER               = require('../config/redis.json')[process.env.NODE_ENV || 'development'].SETCOIN_ROOM_NUMBER;
const PACKET_ERR                        = require('./packet_err').PACKET_ERR;
const async                             = require('async');


/**
 * 룸번호와 호스트 이름으로 방삭제하기
 * @param {*} room_num 
 * @param {*} host_name 
 * @param {*} callback 
 */
exports.setcoin_delete_room = function(room_num,host_name,callback){
    const room_list_redis                   = redis.getSetcoinRoomListRedis();
    room_list_redis.zrem(RLI.KEY1,room_num,(err,res)=>{
        if(err){            
            console.log('setcoin_delete_room.....err.1.!!!!!');
            callback(PACKET_ERR.SETCOIN_DELETE_ROOM_REDIS1);
        }else{      
            console.log('detel 1 : ',res);
            var _key = RLI.KEY2+"-"+host_name;
            room_list_redis.del(_key,(err1,res1)=>{
                if(err1){                    
                    console.log('setcoin_delete_room.....err.2.!!!!!');
                    callback(PACKET_ERR.SETCOIN_DELETE_ROOM_REDIS2);
                }else{
                    var _rinfo_key = RLI.KEY2+'-'+room_num; 
                    room_list_redis.del(_rinfo_key,(err2,res2)=>{
                        if(err2){
                            console.log('setcoin_delete_room.....err.3.!!!!!');  
                            callback(PACKET_ERR.SETCOIN_DELETE_ROOM_REDIS3);                     
                        }else{
                            callback(PACKET_ERR.SUCCESS);
                        }
                    }); //room_list_redis.del
                }
            });  //room_list_redis.del    
        }
    }); 
};


var g_room_number = 0;
var tasks = [
    function(callback){        
        const room_list_redis                   = redis.getSetcoinRoomListRedis();
        var _rinfo_key = RLI.KEY2+'-'+g_room_number; //
        var _data={};
        room_list_redis.hgetall(_rinfo_key,(err,res)=>{
            if(err){ 
                _data.result        = -1;
                _data.room_number   =   g_room_number; 
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
        const room_list_redis                   = redis.getSetcoinRoomListRedis();
        var _data ={};
        if(data.result < 0){
            _data.result = -1;
            callback(null,_data);
        }else if( data == 1){
            room_list_redis.zrem(RLI.KEY1,data.room_number,(err,res)=>{
                _data.result = 1;
                _data.room_number = data.room_number;
                callback(null,_data);      
                
            });
        }else{
            var _key = RLI.KEY2+"-"+data.host_name;
            room_list_redis.del(_key,(err,res)=>{
                _data.result = 2;
                _data.room_number = data.room_number;
                callback(null,_data);
            });
        }
    },
    function(data,callback){
        const room_list_redis                   = redis.getSetcoinRoomListRedis();
        var _data ={};
        if(data.result < 0){
            _data.result = -1;
            callback(null,_data);
        }else if( data.result === 1 || data.result === 2){
            var _rinfo_key = RLI.KEY2+'-'+data.room_number; 
            room_list_redis.del(_rinfo_key,(err,res)=>{
                _data.result = 1;
                _data.room_number = data.room_number;
                callback(null,_data);
            });
        }
    },
    function(data,callback){
        const room_list_redis                   = redis.getSetcoinRoomListRedis();
        if(data.result < 0 ){
            callback(-1);
        }else{
            room_list_redis.zrem(RLI.KEY1,data.room_number,(err,res)=>{               
                callback(0);      
                
            });            
        }

    }

];
exports.setcoin_delete_room2 = function(room_number,callback){

    var tasks = [
        function(callback){        
            const room_list_redis                   = redis.getSetcoinRoomListRedis();
            var _rinfo_key = RLI.KEY2+'-'+g_room_number; //
            var _data={};
            room_list_redis.hgetall(_rinfo_key,(err,res)=>{
                if(err){ 
                    _data.result        = -1;
                    _data.room_number   =   g_room_number; 
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
            const room_list_redis                   = redis.getSetcoinRoomListRedis();
            var _data ={};
            if(data.result < 0){
                _data.result = -1;
                callback(null,_data);
            }else if( data == 1){
                room_list_redis.zrem(RLI.KEY1,data.room_number,(err,res)=>{
                    _data.result = 1;
                    _data.room_number = data.room_number;
                    callback(null,_data);      
                    
                });
            }else{
                var _key = RLI.KEY2+"-"+data.host_name;
                room_list_redis.del(_key,(err,res)=>{
                    _data.result = 2;
                    _data.room_number = data.room_number;
                    callback(null,_data);
                });
            }
        },
        function(data,callback){
            const room_list_redis                   = redis.getSetcoinRoomListRedis();
            var _data ={};
            if(data.result < 0){
                _data.result = -1;
                callback(null,_data);
            }else if( data.result === 1 || data.result === 2){
                var _rinfo_key = RLI.KEY2+'-'+data.room_number; 
                room_list_redis.del(_rinfo_key,(err,res)=>{
                    _data.result = 1;
                    _data.room_number = data.room_number;
                    callback(null,_data);
                });
            }
        },
        function(data,callback){
            const room_list_redis                   = redis.getSetcoinRoomListRedis();
            if(data.result < 0 ){
                callback(-1);
            }else{
                room_list_redis.zrem(RLI.KEY1,data.room_number,(err,res)=>{               
                    callback(0);      
                    
                });            
            }
    
        }
    
    ];

    async.waterfall(tasks,(err)=>{
        callback(err);
    });
}


