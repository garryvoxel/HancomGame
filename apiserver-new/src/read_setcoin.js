const mysql                     = require('./mysql');
const PACKET_ERR                = require('./packet_err').PACKET_ERR;
const redis                             = require('./redis');
const RLI                               = require('../config/redis.json')[process.env.NODE_ENV || 'development'].SETCOIN_ROOM_LIST_REDIS;



/***
 * 자동입장에 사용하는 함수
 */
exports.auto_enter = function(callback){
    const room_list_redis                   = redis.getSetcoinRoomListRedis();
    room_list_redis.zrange(RLI.KEY1,0,0,(err,res)=>{    
        if(err){            
            callback(err,null);
        }else{            
            callback(0,res);
        }
    });
}



/**
 * 룸번호로 방 찾기
 */
exports.search_room_num = function(room_num,callback){
    const room_list_redis                   = redis.getSetcoinRoomListRedis();
    var _rinfo_key = RLI.KEY2+'-'+room_num; //
    room_list_redis.hgetall(_rinfo_key,(err,res)=>{
        if(err){            
            callback(err,null);
        }else{                      
            if(res === null){
                callback(-1,null);
            }
            else{
                callback(0,res);
            }
        }
    });
}

/**
 * 룸의 총 갯수 가져오기
 */
exports.get_total_room_list = function(callback){
    const room_list_redis                   = redis.getSetcoinRoomListRedis();
    room_list_redis.zcard(RLI.KEY1,(err,reply)=>{
        if(err){           
            callback(err,null); 
        }else{         
            callback(0,reply);
        }
    });
}

/**
 * {
"result": 0,
"data":[
{"uuid": 21, "win": 6, "lose": 0, "draw": 0}
]
}
 */
exports.request_game_result = function(uuid,callback){
    mysql.getGameWrite().getConnection((err,con)=>{

        if(err){          
            if(con) con.release();
            console.error('request_game_result >> getConnection error (mysql err)!!!'+err);
            callback(PACKET_ERR.SETCOIN_READ_GAME_RESULT_MYSQL,null);
        }else{
            let _query = 'SELECT * FROM GameDB.TbSetCoin WHERE UUID=?';
            con.query(_query,[uuid],(err1,result,fields)=>{
                con.release();
                if(err1){          
                    console.error('request_game_result >> query error (mysql err)!!!'+err1);                           
                    callback(PACKET_ERR.SETCOIN_READ_GAME_RESULT_MYSQL_QUERY,null);
                }else{    
                    if( result.length <= 0){
                        console.error('request_game_result >> query res !!!'+result.length);
                        callback(PACKET_ERR.SETCOIN_READ_GAME_RESULT_MYSQL_QUERY_RES,null);
                    }else{
                        let _rdata={};
                        //let _data=[];
                        //let _info={};
                        _rdata.result = PACKET_ERR.SUCCESS;
                        _rdata.uuid = result[0].UUID;
                        _rdata.win = result[0].Win;
                        _rdata.lose = result[0].Lose;
                        _rdata.draw = result[0].Draw;
                        //_data.push(_info);
                        //_rdata.data = _data;
                        callback(PACKET_ERR.SUCCESS,_rdata);                        
                    }
                }
            });
        }

    });             
}

