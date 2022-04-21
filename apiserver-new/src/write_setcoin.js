const redis                = require('./redis');
const RLI                  = require('../config/redis.json')[process.env.NODE_ENV || 'development'].SETCOIN_ROOM_LIST_REDIS;
const TIME                 = require('../common/time');
const RESULT_STATE         = require('./def').RESULT_STATE;
const mysql                = require('./mysql');
const PACKET_ERR           = require('./packet_err').PACKET_ERR;
const write_log            = require('./write_log').write_log;
const async                 = require('async');
const getRankTable          = require('../common/util').getRankTable;


/**
 * 1) zadd로 방생성 타임을 value로 저장한다.
 * 2) 방장닉네임을 키로 방번호를 value로 저장한다
 * 3) 방번호로 키로 했어 방전체 정보를 저장한다.
 * 4) 동전쌓기
 */
function setcoin_write_room(room_num,host_name,
                                        room_title,is_single,
                                        is_lock,ip,play_time,back_ground,password,server_idx,
                                        callback){
    const room_list_redis       = redis.getSetcoinRoomListRedis();
    var _room_num={};    
    _room_num.host_name     = host_name;
    //_room_num._create_time  = TIME.getTime();
    let _ct = TIME.getTime();

    //오름차순으로 저장한다.
    room_list_redis.zadd(RLI.KEY1,_ct,room_num,(err,res)=>{
        if(err){            
            console.log('write_room err...0'+err);
            console.log('write_room res...0 : '+res);
        }else{   
            //방장닉네임 키로 방번호 저장한다.         
            var _host = {};
            _host.room_num = room_num;
            var _key = RLI.KEY2+"-"+host_name;
            room_list_redis.hmset(_key,_host,(err1,res1)=>{
                if(err1){                  
                    console.log('write_room err...1'+err1);
                    console.log('write_room res...1 : '+res1);  
                }else{
                    //룸 전체 정보를 저장한다
                    var _rinfo_key = RLI.KEY2+'-'+room_num; //
                    var _ri={};
                    _ri.room_num    =   room_num;
                    _ri.host_name   =   host_name;
                    _ri.is_lock     =   is_lock;
                    _ri.is_single   =   is_single;
                    _ri.room_title  =   room_title;
                    _ri.ip          =   ip;
                    _ri.play_time   =   play_time;
                    _ri.back_ground =   back_ground;
                    _ri.password    =   password;
                    _ri.server_idx  =   server_idx;
                    room_list_redis.hmset(_rinfo_key,_ri,(err2,res2)=>{
                        if(err2){
                            console.log('write_room err...2'+err2);
                            console.log('write_room res...2 : '+res2);  
                        }
                    });
                }
            });
        }
    });
    callback();
};

/**
 * 동전쌓기 방 옵션 변경
 * @param {*} room_num 
 * @param {*} room_title 
 * @param {*} play_time 
 * @param {*} is_lock 
 * @param {*} back_ground 
 * @param {*} password 
 * @param {*} callback 
 */
function change_room_option(room_num,
                            room_title,play_time,
                            is_lock,back_ground,password,callback){
    const room_list_redis       = redis.getSetcoinRoomListRedis();                                
    var _rinfo_key = RLI.KEY2+'-'+room_num; //
    var _ri={};

    _ri.is_lock     =   is_lock;    
    _ri.room_title  =   room_title;    
    _ri.play_time   =   play_time;
    _ri.back_ground =   back_ground;
    _ri.password    =   password;
    
    room_list_redis.hmset(_rinfo_key,_ri,(err,res)=>{
        if(err){
            console.log('write_room err...1'+err);
            console.log('write_room res...2 : '+res);  
            callback(err);
        }else{
            if(res<=0){
                console.log('write_room res...3 : '+res);  
            }
            callback(0);
        }

    });
}

//==============================================================
// mysql
/**
 * @param {*유니크아이디} uuid
 * @param {*결과 상태} result_state
 * 게임 결과 저장
 */
function result(uuid,nick_name,result_state,callback){
    if( result_state === RESULT_STATE.WIN ){
        write_result(uuid,RESULT_STATE.WIN,(err)=>{
            if(err != PACKET_ERR.SUCCESS){
                callback(err);
            }else{    
                update_ranking(nick_name,1,(err)=>{
                    callback(err);
                })  ;          
            }
            
        });
    }else if(result_state === RESULT_STATE.LOSE ){        
        write_result(uuid,RESULT_STATE.LOSE,(err)=>{            
            callback(err);
        });
    }else{        
        write_result(uuid,RESULT_STATE.DRAW,(err)=>{            
            callback(err);
        });
    }
}

function write_result(uuid,state,callback){    
    console.log( "UUID : "+uuid+" state : "+state);
    mysql.getGameWrite().getConnection((err,con)=>{     
        if(err){            
            if(con) con.release();
            console.error("write setcoin result >> connect mysql error..!");
            callback(PACKET_ERR.WRITE_SETCOIN_RESULT_MYSQL_DB_CONN);
        }else{            
            let _q = 'call SPSetCoinResult(?,?,@ret);SELECT @ret as ret';
            con.query(_q,[uuid,state],(err1,rows,fields)=>{
                con.release();
                if(err1){
                    console.error("write setcoin result query error : "+_q);
                    callback(PACKET_ERR.WRITE_SETCOIN_RESULT_MYSQL_DB_QUERY);
                }else{         
                    callback(PACKET_ERR.SUCCESS);           
                }
            });
        }
    }); 
}
    

const SETCOIN_ROOM_NUMBER               = require('../config/redis.json')[process.env.NODE_ENV || 'development'].SETCOIN_ROOM_NUMBER;
//==================================================
/**
 * 룸번호 반환하기
 * @param {*룸번호} room_number 
 * @param {*콜백함수} callback 
 */
//redis.lpush(dbcfg.ROOM_NUMBER_REDIS_QUEUE,i.toString());
function return_room_number(room_number,callback){
    const setcoin_room_number_redis         = redis.getSetcoinRoomNumberRedis();
    setcoin_room_number_redis.lpush(SETCOIN_ROOM_NUMBER.KEY1,room_number,(err,reply)=>{
        if(err){           
            callback(PACKET_ERR.SETCOIN_RETURN_ROOM_NUMBER_REDIS); 
        }else{
            if(reply <= 0){                
                callback(PACKET_ERR.SETCOIN_RETURN_ROOM_NUMBER_REDIS_WRITE); 
            }else{         
                callback(PACKET_ERR.SUCCESS);       
            }
        }
    });    
}



const RANKING                  = require('../config/redis.json')[process.env.NODE_ENV || 'development'].RANKING_REDIS;
/**
 * @param 닉네임 nick_name
 * @param 랭킹 스코어 win
 * 동전쌓기 랭킹
 */
function update_ranking (nick_name,win,callback){
    let _nn = nick_name;
    let _s  = win;
    var tasks =[
        //스코어 저장
        function(callback1){
            const redis_rank = redis.getWeekRankingRedis();
            let _data ={};
            redis_rank.zincrby(RANKING.KEY1,_s,_nn,(err,res)=>{
                if(err){
                    console.error('setcoin update_ranking >> zincrby error (redis)!!!!..'+err);
                    _data.result = PACKET_ERR.SETCOIN_RANKING_REDIS;

                    callback1(PACKET_ERR.SETCOIN_RANKING_REDIS,_data);
                }else{
                    if(res<0){ 
                        console.error('setcoin update_ranking >> zincrby error (redis res)!!!!..'+res);
                        _data.result = PACKET_ERR.SETCOIN_RANKING_REDIS_RES;
                        callback1(PACKET_ERR.SETCOIN_RANKING_REDIS_RES,_data);
                    }else{     
                        _data.result = PACKET_ERR.SUCCESS;
                        callback1(PACKET_ERR.SUCCESS,_data);
                    }
                }   
            });            
        },
        //해당 랭크 가져오기  
        function(data,callback1){
            const redis_rank = redis.getWeekRankingRedis();
            
            if(data.result != PACKET_ERR.SUCCESS){
                callback(data.result);
            }else{
                let _data ={};
                redis_rank.zrevrank(RANKING.KEY1,nick_name,(err,res)=>{
                    if(err){                       
                        console.error('setcoin update_ranking >> zrevrange error (redis)!!!!..'+err1);
                        _data.result = PACKET_ERR.SETCOIN_RANKING_REDIS_REDIS1;
                        callback(PACKET_ERR.SETCOIN_RANKING_REDIS_REDIS1,_data);
                    }else{
                        if(res < 0){                           
                            console.error('setcoin update_ranking >> zrevrange error (redis res)!!!!..'+res1);
                            _data.result = PACKET_ERR.SETCOIN_RANKING_REDIS_REDIS1_RES;
                            callback(PACKET_ERR.SETCOIN_RANKING_REDIS_REDIS1_RES,_data); 
                        }else{                        
                            _data.result=PACKET_ERR.SUCCESS;
                            _data.rank = res;
                            callback1(PACKET_ERR.SUCCESS,_data); 
                        }
                    }
                });
            }
        },
        //해당 점수 가져오기
        function(data,callback1){
            const redis_rank = redis.getWeekRankingRedis();
            let _data ={};
            if(data.result != PACKET_ERR.SUCCESS){   
                callback1(data.result);             
            }else{
                redis_rank.zscore(RANKING.KEY1,nick_name,(err,res)=>{
                    if(err){                                        
                        console.error('setcoin update_ranking >> zscore error (redis)!!!!..'+err);
                        _data.result = PACKET_ERR.SETCOIN_RANKING_REDIS_REDIS2;
                        callback1(PACKET_ERR.SETCOIN_RANKING_REDIS_REDIS2,_data);
                    }else{
                        if( res < 0 ){
                            console.error('setcoin update_ranking >> zscore error (redis res)!!!!..'+res);
                            _data.result = PACKET_ERR.SETCOIN_RANKING_REDIS_REDIS2_RES;
                            callback(PACKET_ERR.SETCOIN_RANKING_REDIS_REDIS2_RES,_data);
                        }else{
                            _recv_score = res; 
                            _data.result = PACKET_ERR.SUCCESS;
                            _data.rank = data.rank;
                            _data.score = res;                      
                            callback1(PACKET_ERR.SUCCESS,_data); 

                        }
                    }
                });
            }
        },
        //해당 점수를 rdb에 저장하기
        function(data,callback4){
            const rank_mysql = mysql.getWebWrite();
            if(data.result != PACKET_ERR.SUCCESS){  
                callback(data.result);              
            }else{
                rank_mysql.getConnection((err,con)=>{
                    if(err){   
                        console.error('setcoin update_ranking >> getConnection error (mysql err)!!!!..'+err);
                        callback(PACKET_ERR.SETCOIN_RANKING_REDIS_MYSQL);                 
                    }else{      
                        let _week_table = getRankTable();
                        let _query = 'call SPSetCoinRanking(?,?,?,?,@ret);SELECT @ret as ret';
                        con.query(_query,[_week_table,nick_name,data.score,data.rank],(err1,result,fields)=>{
                            con.release();
                            if(err1){  
                                console.error('setcoin update_ranking >> query error (mysql err)!!!'+err1);
                                callback(PACKET_ERR.SETCOIN_RANKING_REDIS_MYSQL_QUERY);                                       
                            }else{           
                                console.log('setcoin mysq query return : '+result[1][0].ret);
                                if(result[1][0].ret <0){                                
                                    callback(PACKET_ERR.SETCOIN_RANKING_REDIS_MYSQL_QUERY_RES);
                                }else{  
                                    callback4(PACKET_ERR.SUCCESS);
                                }
                            }
                        });              
                    }
                });          
            }  
        }
    ];

    async.waterfall(tasks,(err,data)=>{
        callback(err,data);
    });
}






module.exports = {
    setcoin_write_room:setcoin_write_room,
    change_room_option:change_room_option,
    result:result,
    return_room_number:return_room_number,
    update_ranking:update_ranking,    

}