var express = require('express');
const write_room                    = require('../src/write_setcoin').setcoin_write_room;
const delete_room                   = require('../src/delete_setcoin').setcoin_delete_room;
const search_room_num               = require('../src/read_setcoin').search_room_num;
const get_total_room_list           = require('../src/read_setcoin').get_total_room_list;
const delete_room2                  = require('../src/delete_setcoin').setcoin_delete_room2;

//var read_total_room = require('../src/read/setcoin_read_total_room').setcoin_read_total_room;
const redis                         = require('../src/redis');
const RLI                           = require('../config/redis.json')[process.env.NODE_ENV || 'development'].SETCOIN_ROOM_LIST_REDIS;
const MAX_SETCOIN_PAGE_LIST         = require('../src/def').MAX_SETCOIN_PAGE_LIST;
const PACKET_ERR                    = require('../src/packet_err').PACKET_ERR;
const LOG_MSG_IDX                   = require('../src/log_msg_idx').LOG_MSG_IDX;
const TIME                          = require('../common/time');
const start_game_log                = require('../src/write_setcoin').start_game_log;
const GAME_CODE                     = require('../config/game_code');


var router = express.Router();
router.post('/create_room',(req,res,next)=>{
    console.log(req.body);
    let _rn = req.body.room_num;
    let _hn = req.body.host_name;
    let _il = req.body.is_lock;
    let _is = req.body.is_single;
    let _rt = req.body.room_title;
    let _ip = req.body.ip;
    let _pt = req.body.play_time;
    let _bg = req.body.back_ground;
    let _pw = req.body.password;
    let _si = req.body.server_idx;
    write_room(_rn,_hn,_rt,_is,_il,_ip,_pt,_bg,_pw,_si,()=>{
        res.end();
    });
    
});

router.post('/request_room_list',(req,res,next)=>{        

    const room_list_redis = redis.getSetcoinRoomListRedis();
    let page = req.body.page;

    if(page <=0){
        res.end();
    }else{
        let _cp = page -1;
        let _from = _cp * MAX_SETCOIN_PAGE_LIST;
        let _to = _from + (MAX_SETCOIN_PAGE_LIST-1);
        let _rif = [];         

        room_list_redis.zrevrange(RLI.KEY1,_from,_to,(err,res1)=>{
            if(err){            
                console.log('read_total_room err...0');     
                res.send(_rif);
                res.end();           
            }else{
                let _len = res1.length;
                let _cntRemain = _len;

                if( _len <= 0){
                    res.send(_rif);
                    res.end();     
                }else{
                    /**
                     * 추가 작업 내용
                     * zrevrange에는 방번호가 있는데 룸 상세 정보가 
                     * 없으면 zreverange에서 해당 방번호를 삭제해줘야 한다
                     */
                    for( let i = 0; i < _len; i++){                
                        var _rinfo_key = RLI.KEY2+'-'+res1[i];  
                        room_list_redis.hgetall(_rinfo_key,(err,res3)=>{
                            if(err){
                                console.log('read_total_room is err...!!!');
                                return;
                            }else{  
                                var _if ={};      
                                if(res3 <= 0) { 
                                    console.log("room is empty....");
                                    return;
                                }else{
                                    
                                    _if.room_number = res3.room_num;
                                    _if.room_title  = res3.room_title;
                                    _if.host_name   = res3.host_name;
                                    _if.is_lock     = res3.is_lock;
                                    _if.is_single   = res3.is_single; 
                                    _if.play_time   = res3.play_time;
                                    _if.back_ground = res3.back_ground; 
                                    _if.ip          = res3.ip;
                                    _if.password    = res3.password;
                                    _if.server_idx  = res3.server_idx;
                                    --_cntRemain;                        
                                    _rif.push(_if);                  
                                    console.log(JSON.stringify(_if));                                                                       
                                }

                            }
                            if(_cntRemain === 0){                        
                                res.send(_rif);
                                res.end()
                            }
                        });                               
                    }//for                                    
                }           
            }
        });
    
    }
});

/**
 * 룸 리스트 삭제
 */
router.post('/delete_room',(req,res,next)=>{   
    let _rn = req.body.room_number;
    let _hn = req.body.host_name;

    delete_room(_rn,_hn,()=>{
        res.end();        
    });
});

router.post('/delete_room2',(req,res,next)=>{   
    let _rn = req.body.room_number;    

    delete_room2(_rn,(err)=>{
	let _rdata={};
	_rdata.result = err;
	res.send(_rdata);
        res.end();        
    });
});




const update_ranking = require('../src/write_setcoin').update_ranking;
/**
 * 동전쌓기 랭킹 저장
 */
router.post('/write_ranking',(req,res,next)=>{    
    let _nn = req.body.nick_name;
    let _win = req.body.score;

    update_ranking(_nn,_win,(err)=>{
        let _rdata ={};
        _rdata.result = err;
        res.send(_rdata);
        res.end();
    });
    
});

/**
 * 방번호 찾기
 */
router.post('/search_room_num',(req,res,next)=>{
    let _rn = req.body.room_num;
    search_room_num(_rn,(err,data)=>{
        if(err != 0){  
            var _data={};
            _data.result = -1;    
            res.send(_data);
            res.end();      
        }else{     

            var _data={};
            _data.result=0; 
            _data.room_num    =   data.room_num;
            _data.host_name   =   data.host_name;
            _data.is_lock     =   data.is_lock;
            _data.is_single   =   data.is_single;
            _data.room_title  =   data.room_title;  
            _data.ip          =   data.ip; 
            _data.back_ground =   data.back_ground;
            _data.play_time   =   data.play_time; 
            _data.password    =   data.password;             
            res.send(_data);   
            res.end();
        }
        
    });
});

/**
 * 닉네임으로 찾기
 */
router.post('/search_host_name',(req,res,next)=>{
    const room_list_redis = redis.getSetcoinRoomListRedis();
    var _nn = req.body.nick_name;
    var _key = RLI.KEY2+"-"+_nn;
    var _data = {};
    console.log('key : '+_key);
    room_list_redis.hgetall(_key,(err,reply)=>{
        if(err){     
            _data.result=-1;
            res.send(_data);
            res.end();
        }else{       
            if(reply<=0){   
                _data.result=-2;
                res.send(_data);
                res.end();             
            }else{
                var _ri = RLI.KEY2+'-'+reply.room_num;
                console.log('ri : '+ _ri);
                room_list_redis.hgetall(_ri,(err1,reply1)=>{
                    if(err1){   
                        _data.result =-2;
                        res.send(_data);
                        res.end();
                    }else{   
                        _data.result = 0;   
                        _data.room_number    =   reply1.room_num;
                        _data.host_name   =   reply1.host_name;
                        _data.is_lock     =   reply1.is_lock;
                        _data.is_single   =   reply1.is_single;
                        _data.room_title  =   reply1.room_title;  
                        _data.ip          =   reply1.ip;
                        _data.back_ground =   reply1.back_ground;
                        _data.play_time   =   reply1.play_time;  
                        _data.password    =   reply1.password;  
                        res.send(_data);
                        res.end();
                    }
                
                });
            }           
        }
            
    });
    
});

/**
 * 자동입장
 */
router.post('/auto_enter',(req,res,next)=>{
    const room_list_redis = redis.getSetcoinRoomListRedis();
    var _data={};
    room_list_redis.zrevrange(RLI.KEY1,0,0,(err,reply)=>{
        if(err){ 
            _data.result = -1;
            res.send(_data);
            res.end();           
        }else{
            if(res <= 0){
                _data.result = -2;
                res.send(_data);
                res.end();        
            }else{
                var _ri = RLI.KEY2+'-'+reply;
                room_list_redis.hgetall(_ri,(err1,reply1)=>{
                    if(err1){   
                        _data.result =-3;
                        res.send(_data);
                        res.end();
                    }else{   
                        _data.result = 0;   
                        _data.room_number =  reply1.room_num;
                        _data.host_name   =     reply1.host_name;
                        _data.is_lock     =     reply1.is_lock;
                        _data.is_single   =     reply1.is_single;
                        _data.room_title  =     reply1.room_title;  
                        _data.ip          =     reply1.ip;
                        _data.play_time   =     reply1.play_time;
                        _data.back_ground =     reply1.back_ground;
                        _data.password    =     reply1.password;
                        res.send(_data);
                        res.end();
                    }
                });
            }
        }
    });    
});


router.post('/auto_enter2',(req,res,next)=>{
    console.log(req.body);

    let _svr_idx = req.body.server_idx;
    const room_list_redis                   = redis.getSetcoinRoomListRedis();
    let _rdata={};
    let _rif = []; 
    room_list_redis.zrevrange(RLI.KEY1,0,-1,(err,res)=>{        
        if(err){  
            _rdata.result = PACKET_ERR.AUTO_ENTER2_REDIS1;      
            res.send(_rdata);
            res.end();
        }else{
            let _len = res.length;
            if( _len <= 0 ){                
                _rdata.result = PACKET_ERR.AUTO_ENTER2_REDIS1_RES;      
                res.send(_rdata);
                res.end();
            }else{
                for( var i = 0; i<_len; i++){
                    var _rinfo_key = RLI.KEY2+'-'+res[i];  
                    room_list_redis.hgetall(_rinfo_key,(err1,res1)=>{
                        if(err1){
                            _rdata.result = PACKET_ERR.AUTO_ENTER2_REDIS2;      
                            res.send(_rdata);
                            res.end();                            
                        }else{
                            if( res1 <= 0 ){
                                _rdata.result = PACKET_ERR.AUTO_ENTER2_REDIS2_RES;      
                                res.send(_rdata);
                                res.end();
                            }
                            else{
                                if(res1.server_idx != _svr_idx) continue;
                                if(res1.is_lock == 1) continue;

                                _if.room_number = res1.room_num;
                                _if.room_title  = res1.room_title;
                                _if.host_name   = res1.host_name;
                                _if.is_lock     = res1.is_lock;
                                _if.is_single   = res1.is_single; 
                                _if.play_time   = res3.play_time;
                                _if.back_ground = res3.back_ground; 
                                _if.ip          = res3.ip;
                                _if.password    = res3.password;
                                _if.server_idx  = res3.server_idx;
                            }
                        }
                    });
                }
            }
        }
    });    
});

const change_room_option = require('../src/write_setcoin').change_room_option;
// 룸옵션 변경
router.post('/change_room_option',(req,res,next)=>{
    console.log(req.body);
    let _rn = req.body.room_number;
    let _rt = req.body.room_title;
    let _l  = req.body.is_lock;
    let _pt = req.body.play_time;
    let _bg = req.body.back_ground;
    let _pw = req.body.password;

    change_room_option(_rn,_rt,_pt,_l,_bg,_pw,(err)=>{
        if(err){            
            res.end();
        }else{
            res.end();
        }
    });

});

const write_result = require('../src/write_setcoin').result;
//게임 결과 저장
router.post('/write_result',(req,res,next)=>{
    var _uuid   = req.body.uuid;
    var _rs     = req.body.result_state;
    var _nn     = req.body.nick_name;
    console.log(req.body);
    write_result(_uuid,_nn,_rs,(err)=>{
        var _rdata = {}
        _rdata.result = err;
        res.send(_rdata);
        res.end();
    });
});

const request_game_result = require('../src/read_setcoin').request_game_result;
router.post('/request_game_result',(req,res,next)=>{
    let _uuid = req.body.uuid;
    request_game_result(_uuid,(err,data)=>{
        if(err != PACKET_ERR.SUCCESS){
            var _rdata={};
            _rdata.result = err;
            res.send(_rdata);
        }else{
            var _rdata ={};
            _rdata.result = data.result;
            _rdata.uuid = data.uuid;
            _rdata.win = data.win;
            _rdata.lose = data.lose;
            _rdata.draw = data.draw;
            res.send(_rdata);
        }

        res.end();

    });

});


//룸번호가져오기
const SETCOIN_ROOM_NUMBER               = require('../config/redis.json')[process.env.NODE_ENV || 'development'].SETCOIN_ROOM_NUMBER;
router.post('/get_room_number',(req,res,next)=>{
    
    const setcoin_room_number_redis = redis.getSetcoinRoomNumberRedis();
    var _data = {};
    setcoin_room_number_redis.llen(SETCOIN_ROOM_NUMBER.KEY1,(err,reply)=>{     
        if(err){                        
            _data.result = PACKET_ERR.SETCOIN_ROOMNUMBER_REDIS;
            res.send(_data);
            res.end();
            return;
        }else{
            if(reply <=0){                
                _data.result = PACKET_ERR.SETCOIN_ROOMNUMBER_EMPTY;
                res.send(_data);
                res.end();
            }else{    
                setcoin_room_number_redis.rpop(SETCOIN_ROOM_NUMBER.KEY1,(err1,reply1)=>{
                    if(err1){
                        _data.result = PACKET_ERR.SETCOIN_ROOMNUMBER_REDIS2;
                        res.send(_data);
                        res.end();
                    }else{
                        if(reply1 <= 0){
                            _data.result = PACKET_ERR.SETCOIN_ROOMNUMBER_EMPTY2;
                            res.send(_data);
                            res.end();
                        }else{      
                            _data.result = PACKET_ERR.SUCCESS;
                            _data.room_number = reply1;
                            res.send(_data)                      ;
                            res.end();
                        }
                    }
                });
            }
        }
    });
});
//redis.lpush(dbcfg.ROOM_NUMBER_REDIS_QUEUE,i.toString());
//}

//==========================================
//룸번호 반환
const return_room_number = require('../src/write_setcoin').return_room_number;
router.post('/return_room_number',(req,res,next)=>{
    let _rn = req.body.room_number;
    var _data ={};
    return_room_number(_rn,(err)=>{
        _data.result = err;
        res.send(_data);
        res.end();
    })
    
});


router.post('/get_total_room_list',(req,res,next)=>{
    let _rdata = {};
    get_total_room_list((err,data)=>{
        _rdata.result = err;
        _rdata.count = data;
        console.log(JSON.stringify(_rdata));
        res.send(_rdata);
        res.end();
        
    });
});


router.post('/start_game_log',(req,res,next)=>{

    let _uuid   = req.body.uuid;
    let _nn     = req.body.nick_name;

    let _c = TIME.getTime();
    let _ct = TIME.getYMD(_c);
    let _rdata = {};
    start_game_log(LOG_MSG_IDX.GAME_MOLE_BEGIN,
                    _uuid,_nn,
                    GAME_CODE.GAME_SET_COIN,_ct,(err)=>{
        _rdata.result = err;
        res.send(_rdata);
        res.end();

    });    

});


router.post('./game_over',(req,res,next)=>{

});
module.exports = router;
