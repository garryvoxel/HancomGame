const redis                             = require('../src/redis');
const RLI                               = require('../config/redis.json')[process.env.NODE_ENV || 'development'].PANCHANGE_ROOM_CHANNEL_1;
const PACKET_ERR                        = require('../src/packet_err').PACKET_ERR;
const async                              = require('async');




/**
 * 방 삭제.
 */
exports.delete_room = function(room_number,callback){
    const room_list_redis                   = redis.getPanchangeChannel1();
    console.log("판뒤집기 방지웁니다 -----------------------------------------------"+room_number);
    var tasks = [
       
        //룸정보 가져오기
        function(callback1){            
            var _rinfo_key = RLI.KEY2+'-'+room_number; //
            var _data={};
            room_list_redis.hgetall(_rinfo_key,(err,res)=>{
                if(err){     
                    console.error("panchange delete_room >>...hgetall.1..err "+err);
                    callback(PACKET_ERR.PANCHANGE_DELETE_ROOM_REDIS);
                    return;
                }else{
                    if(res <= 0){
                        console.error("panchange delete_room >>..hgetall..1.res "+res);
                        callback(PACKET_ERR.PANCHANGE_DELETE_ROOM_REDIS_RES);
                        return;
                    }else{
                        _data.result = PACKET_ERR.SUCCESS;
                        _data.host_name     = res.host_name;                        
                        _data.is_clan       = res.is_clan;
                        _data.clan_name_A     = res.clan_name_A; 
                        _data.clan_name_B     = res.clan_name_B;   
                        callback1(PACKET_ERR.SUCCESS,_data);
                    }
                }
            });
        },

        //룸번호 삭제
        function(data,callback1){
            room_list_redis.zrem(RLI.KEY1,room_number,(err,res)=>{
                if(err){       
                    console.error('panchange delete_room >> zrem...2..err '+err);             
                    callback(PACKET_ERR.PANCHANGE_DELETE_ROOM_REDIS2);
                    return;
                }else{
                    if(res <= 0 ){
                        console.error('panchange delete_room >> zrem...2..res '+res);             
                        callback(PACKET_ERR.PANCHANGE_DELETE_ROOM_REDIS2_RES);
                        return;
                    }else{   
                        let _data={};
                        _data = data;       
                        callback1(PACKET_ERR.SUCCESS,_data);                     
                    }
                }
            });
        },
        //호스트 정보 삭제
        function(data,callback1){
            var _key = RLI.KEY5+"-"+data.host_name;
            let _data={};
            room_list_redis.del(_key,(err,res)=>{
                if(err){   
                    console.error('panchange delete_room >> del...3..err '+err);             
                    callback(PACKET_ERR.PANCHANGE_DELETE_ROOM_REDIS3);                 
                    return;
                }else{                    
                    if(res <= 0){
                        console.error('panchange delete_room >> del...3..res '+res);
                        callback(PACKET_ERR.PANCHANGE_DELETE_ROOM_REDIS3_RES);
                        return;
                        
                    }                        
                    _data = data;
                    callback1(PACKET_ERR.SUCCESS,_data);
                    
                }

            });                        
        },
        //방정보 삭제
        function(data,callback1){
            var _rinfo_key = RLI.KEY2+'-'+room_number; 
            room_list_redis.del(_rinfo_key,(err,res)=>{
                if(err){
                    console.error('panchange delete_room >> del...4.err '+err);          
                    callback(PACKET_ERR.PANCHANGE_DELETE_ROOM_REDIS4);
                    return;
                }else{
                    if(res <= 0){
                        console.error('panchange delete_room >> del...4..res '+res); 
                        callback(PACKET_ERR.PANCHANGE_DELETE_ROOM_REDIS4_RES);
                        return;      
                        
                    }
                    let _data={};
                    _data = data;
                    callback1(PACKET_ERR.SUCCESS,_data);
                    
                }
            });
        },
        //클랜방 정보 삭제
        function(data,callback1){
            
            if(data.is_clan === "1"){   
                console.log("클랜이냐? ==================================="+data.is_clan); 
                console.log("클랜 이름은? ==================================="+data.clan_name_A); 
                var _rinfo_key2 = RLI.KEY3+'-'+data.clan_name_A; 
                room_list_redis.del(_rinfo_key2,(err,res)=>{
                    if(err){
                        console.error('panchange delete_room >> del...5..err '+err);        
                        callback(PACKET_ERR.PANCHANGE_DELETE_ROOM_REDIS5);
                        return;
                    }else{
                        if(res<=0){                            
                            console.error('panchange delete_room >> del...5..res '+res);    
                            callback(PACKET_ERR.PANCHANGE_DELETE_ROOM_REDIS5_RES);
                            return;
                        }else{                            
                            callback1(PACKET_ERR.SUCCESS);
                        }
                    }      
                });
            }else{
                console.log("클랜이 아니야 ==================================="+data.is_clan); 
                let _data={};
                _data = data;
                callback1(PACKET_ERR.SUCCESS);
            }
        },
        //룸번호 반환
        function(callback1){
            const panchange_room_number_redis         = redis.getPanchangeChannel1();
            panchange_room_number_redis.lpush(RLI.KEY4,room_number,(err,res)=>{
                if(err){                    
                    console.error('panchange delete_room >> del...6..err '+err);   
                    callback(PACKET_ERR.PANCHANGE_DELETE_ROOM_REDIS6);
                    return;
                }else{     
                    if(res<=0){
                        console.error('panchange delete_room >> del...6..res '+res);  
                        callback(PACKET_ERR.PANCHANGE_DELETE_ROOM_REDIS6_RES);  
                        return;
                    }else{
                        callback1(PACKET_ERR.SUCCESS);
                    }
                }
            });
        }
    ];

    async.waterfall(tasks,(err)=>{
        console.log("마지막 콜백 에러는? ========================"+err);
        callback(err);
    });    
}
/**
 * 
 */
exports.panchange_delete_room = function(room_number,host_name,is_clan,clan_name,callback){
    const room_list_redis                   = redis.getPanchangeChannel1();
    room_list_redis.zrem(RLI.KEY1,room_number,(err,res)=>{
        if(err){            
            console.log('setcoin_delete_room.....err.1.!!!!!');
            callback(PACKET_ERR.PANCHANGE_DELETE_ROOM_REDIS);
        }else{      
            console.log('detel 1 : ',res);
            var _key = RLI.KEY2+"-"+host_name;
            room_list_redis.del(_key,(err1,res1)=>{
                if(err1){                    
                    console.log('setcoin_delete_room.....err.2.!!!!!');
                    callback(PACKET_ERR.PANCHANGE_DELETE_ROOM_REDIS2);
                }else{
                    var _rinfo_key = RLI.KEY2+'-'+room_number; 
                    room_list_redis.del(_rinfo_key,(err2,res2)=>{
                        if(err2){
                            console.log('setcoin_delete_room.....err.3.!!!!!');  
                            callback(PACKET_ERR.PANCHANGE_DELETE_ROOM_REDIS3);                     
                        }else{
                            if(is_clan){      
                                var _rinfo_key2 = RLI.KEY3+'-'+clan_name; 
                                room_list_redis.del(_rinfo_key2,(err3,res3)=>{
                                    if(err3){
                                        console.log('setcoin_delete_room.....err.4.!!!!!');  
                                        callback(PACKET_ERR.PANCHANGE_DELETE_ROOM_REDIS4);   
                                    }else{
                                        callback(PACKET_ERR.SUCCESS);
                                    }
                                });
                            }else{
                                callback(PACKET_ERR.SUCCESS);
                            }
                        }
                    }); //room_list_redis.del
                }
            });  //room_list_redis.del    
        }
    }); 
}


var g_room_number = 0;
var tasks = [
    function(callback){        
        const room_list_redis                   = redis.getPanchangeChannel1();
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
                    _data.host_name     = res.host_name;
                    _data.room_number   = res.room_number;
                    _data.is_clan       = res.is_clan;
                    _data.clan_name_A     = res.clan_name_A;
                    _data.clan_name_B     = res.clan_name_B;
                    callback(null,_data);
                }
            }
        });
    },
    function(data,callback){
        const room_list_redis                   = redis.getPanchangeChannel1();
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
                if(err){
                    console.error("panchange_delete_room2..2..del.errr. : "+err);
                    _data.result = -1;
                    _data.room_number   = data.room_number;
                    _data.is_clan       = data.is_clan;
                    _data.clan_name_A     = data.clan_name_A; 
                    _data.clan_name_B     = data.clan_name_B;                 
                    callback(null,_data);
                }else{
                    if(res <= 0 ){
                        console.error("panchange_delete_room2..2..del.errr.res : "+_key);
                        _data.result = 1;
                        _data.room_number   = data.room_number;
                        _data.is_clan       = data.is_clan;
                        _data.clan_name_A     = data.clan_name_A; 
                        _data.clan_name_B     = data.clan_name_B;            
                        callback(null,_data);
                    }else{
                        _data.result = 2;
                        _data.room_number   = data.room_number;
                        _data.is_clan       = data.is_clan;
                        _data.clan_name_A     = data.clan_name_A; 
                        _data.clan_name_B     = data.clan_name_B;               
                        callback(null,_data);
                    }
                }

            });
        }
    },
    function(data,callback){
        const room_list_redis                   = redis.getPanchangeChannel1();
        var _data ={};
        if(data.result < 0){
            _data.result = -1;
            callback(null,_data);
        }else if( data.result === 1 || data.result === 2){
            var _rinfo_key = RLI.KEY2+'-'+data.room_number; 
            room_list_redis.del(_rinfo_key,(err,res)=>{
                if(err){
                    console.error("panchange_delete_room2..3..del.errr. : "+err);
                    _data.result = -1;
                    _data.room_number = data.room_number;
                    _data.is_clan       = data.is_clan;
                    _data.clan_name_A     = data.clan_name_A; 
                    _data.clan_name_B     = data.clan_name_B;   
                    callback(null,_data);

                }else{
                    if(res <= 0){
                    console.error("panchange_delete_room2..3..del.errr.res : "+_rinfo_key);
                    _data.result = -2;
                    _data.room_number = data.room_number;
                    _data.is_clan       = data.is_clan;
                    _data.clan_name_A     = data.clan_name_A; 
                    _data.clan_name_B     = data.clan_name_B;   
                callback(null,_data);
                    }else{
                        _data.result = 1;
                        _data.room_number = data.room_number;
                        _data.is_clan       = data.is_clan;
                        _data.clan_name_A     = data.clan_name_A; 
                        _data.clan_name_B     = data.clan_name_B;   
                        callback(null,_data);
                    }

                }
                
            });
        }
    },
    function(data,callback){
        const room_list_redis                   = redis.getPanchangeChannel1();
        var _data ={};
        if(data.result < 0 ){
            callback(-1);
        }else{
            if(!data.is_clan){
                room_list_redis.zrem(RLI.KEY1,data.room_number,(err,res)=>{   
                    if(err){
                        console.error("panchange_delete_room2..4..del.errr. : "+err);
                        callback(0);    
                    }else{       
                        if(res <= 0){
                            console.error("panchange_delete_room2..3..del.errr.res : room_number "+data.room_number);
                            callback(0);    
                        }else{
                            callback(0);    
                        }
                    }
                                          
                });            
            }else{
                var _rinfo_key = RLI.KEY3+'-'+data.clan_name; 
                room_list_redis.del(_rinfo_key,(err,res)=>{    
                    _data.room_number = data.room_number;                
                    callback(null,_data);
                });                
            }
        }

    },
    function(data,callback){
        const room_list_redis                   = redis.getPanchangeChannel1();
        room_list_redis.zrem(RLI.KEY1,data.room_number,(err,res)=>{               
            callback(0);                          
        });            
    }

];

exports.panchange_delete_room2 = function(room_number,callback){

    g_room_number = room_number;
    async.waterfall(tasks,(err)=>{
        callback(err);
    });
}