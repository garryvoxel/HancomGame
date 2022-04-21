var express = require('express');
const write_room                    = require('../src/write_setcoin2').setcoin_write_room;
const update_usercount              = require('../src/write_setcoin2').update_usercount;
const reset_usercount               = require('../src/write_setcoin2').reset_usercount;
const search_room_num               = require('../src/read_setcoin2').search_room_num;
const get_total_room_list           = require('../src/read_setcoin2').get_total_room_list;
const delete_room2                  = require('../src/delete_setcoin2').setcoin_delete_room3;
const flush_redis_ch                = require('../src/write_setcoin2').flush_redis_ch;
const ready_redis_coin_ch           = require('../src/write_setcoin2').ready_redis_coin_ch;

//var read_total_room = require('../src/read/setcoin_read_total_room').setcoin_read_total_room;
const getRLI                         = require('../src/redis_util').getRLI;
const getRedis                       = require('../src/redis_util').getRedis;


const MAX_SETCOIN_PAGE_LIST         = require('../src/def').MAX_SETCOIN_PAGE_LIST;
const PACKET_ERR                    = require('../src/packet_err').PACKET_ERR;
const LOG_MSG_IDX                   = require('../src/log_msg_idx').LOG_MSG_IDX;
const isEmpty                       = require('../common/util').isEmpty;


const GAME_CODE                     = require('../config/game_code');
const CryptoJS_EN                = require('../common/util').CryptoJS_EN; 
const CryptoJS_DE                = require('../common/util').CryptoJS_DE;

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
    write_room(_rn,_hn,_rt,_is,_il,_ip,_pt,_bg,_pw,_si,(err)=>{
        let _rdata = {};
        _rdata.result = err;
        res.send(_rdata);
        res.end();
    });
    
});

router.post('/request_room_list',(req,res,next)=>{        

    let page        = req.body.page;
    let server_idx  = parseInt(req.body.server_idx);

    const room_list_redis = getRedis(server_idx);
    const RLI = getRLI(server_idx);
    if(page <=0){
        res.end();
    }else{
        let _cp = page -1;
        let _from = _cp * MAX_SETCOIN_PAGE_LIST;
        let _to = _from + (MAX_SETCOIN_PAGE_LIST-1);
        let _rif = [];         

        console.log(RLI.KEY2);

        room_list_redis.zrevrange(RLI.KEY2,_from,_to,(err,res1) => {
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
                        var _rinfo_key = RLI.KEY3+'-'+res1[i];  
                        console.log("룸정보 --------------------"+res1[i]);

                        room_list_redis.hgetall(_rinfo_key,(err3,res3)=>{
                            if(err3){
                                console.log('read_total_room is err..redis3.!!!'+err3);
                             //   res.send(_rif);
                              //  res.end();     
                               // return;
                               --_cntRemain;    
                            }else{                                  
                                var _if ={};      
                                if(res3 <= 0) { 
                                    console.log("room is empty....");
                                    room_list_redis.zrem(RLI.KEY2,res1[i],(err4,res4)=>{
                                        if(err4){      
                                            console.log('read_total_room is err..redis4...!!!'+err4);
                                            --_cntRemain;    
                                        }else{
                                            room_list_redis.lpush(RLI.KEY1,res1[i],(err5,res5)=>{
                                                console.log('read_total_room is err..redis4...!!!'+err5);
                                                --_cntRemain;    
                                            });                                         
                                        }
                                    });
                                    
                                   // res.send(_rif);
                                   // res.end();     
                                   // return;
                                }else{
                                    
                                    if(isEmpty(res3.room_num)== false &&
                                       isEmpty(res3.room_title)== false &&
                                       isEmpty(res3.host_name)== false){
                                       
                                        console.log("동전싾기 룸정보.. ============= 룸넘버"+isEmpty(res3.room_num));
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
                                    }else{
                                        --_cntRemain;   
                                        room_list_redis.zrem(RLI.KEY2,res1[i],(err4,res4)=>{
                                            if(err4){      
                                                console.log('read_total_room is err..redis4...!!!'+err4);
                                             
                                            }else{
                                               
                                                room_list_redis.lpush(RLI.KEY1,res1[i],(err5,res5)=>{
                                                    console.log('read_total_room is err..redis4...!!!'+err5);
                                                    var _key = RLI.KEY3+"-"+res1[i];
                                                    room_list_redis.del(_key,(err,res)=>{
                                                       
                                                    });  
                                                   
                                                });   
                                               
                                                
                                              
                                            }
                                        });

                                       

                                     
                                    }
                                                                                                  
                                }

                            }

                            console.log("카운타 ======================"+_cntRemain);
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

router.post('/delete_room2',(req,res,next)=>{   
    let _rn = req.body.room_number;   
    var _svr_idx    = req.body.server_idx; 

    delete_room2(_svr_idx,_rn,(err)=>{
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

 //   console.log("동전쌓기 게임 랭킹 들어옴 ==========================================");
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
    let _rn = req.body.room_number;
    var _svr_idx    = parseInt(req.body.server_idx);
    search_room_num(_svr_idx,_rn,(err,data)=>{
        if(err != PACKET_ERR.SUCCESS){  
            var _data={};
            _data.result = err;    
            res.send(_data);
            res.end();      
        }else{                

            var _data={};
            _data.result=PACKET_ERR.SUCCESS; 
            _data.room_number    =   data.room_num;
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


    var _nn         = req.body.nick_name;
    var _svr_idx    = parseInt(req.body.server_idx);

    const room_list_redis                   = getRedis(_svr_idx);
    const RLI                               = getRLI(_svr_idx);

    var _key = RLI.KEY3+"-"+_nn;
    var _rdata = {};
    console.log('key : '+_key);

    if(isNaN(_nn)===false){
        console.log("방검색을 숫자로 넣었네요 못찾아요 ==================");
        _rdata.result =PACKET_ERR.SETCOIN_SEARCH_HOST_NAME_EMPTY2;
        res.send(_rdata);
        res.end();
    }else{
        room_list_redis.hgetall(_key,(err,reply)=>{
            if(err){     
                _rdata.result=PACKET_ERR.SETCOIN_SEARCH_HOST_NAME_REDIS;
                res.send(_rdata);
                res.end();
            }else{       
                if(reply<=0){   
                    _rdata.result=PACKET_ERR.SETCOIN_SEARCH_HOST_NAME_EMPTY1;
                    res.send(_rdata);
                    res.end();             
                }else{
                    var _ri = RLI.KEY3+'-'+reply.room_num;
                    console.log('ri : '+ _ri);
                    room_list_redis.hgetall(_ri,(err1,reply1)=>{
                        if(err1){   
                            _rdata.result =PACKET_ERR.SETCOIN_SEARCH_HOST_NAME_REDIS2;
                            res.send(_rdata);
                            res.end();
                        }else{   
                            if(reply1<0){
                                _rdata.result =PACKET_ERR.SETCOIN_SEARCH_HOST_NAME_EMPTY2;
                                res.send(_rdata);
                                res.end();
                            }else{
                                _rdata.result = PACKET_ERR.SUCCESS;   
                                _rdata.room_number    =   reply1.room_num;
                                _rdata.host_name   =   reply1.host_name;
                                _rdata.is_lock     =   reply1.is_lock;
                                _rdata.is_single   =   reply1.is_single;
                                _rdata.room_title  =   reply1.room_title;  
                                _rdata.ip          =   reply1.ip;
                                _rdata.back_ground =   reply1.back_ground;
                                _rdata.play_time   =   reply1.play_time;  
                                _rdata.password    =   reply1.password;  
                                res.send(_rdata);
                                res.end();
                            }
                        }
                    
                    });
                }           
            }
                
        });

    }
   
    
});


router.post('/auto_enter',(req,res,next)=>{
    console.log(req.body);

    let svr_idx = parseInt(req.body.server_idx);
    const room_list_redis                   = getRedis(svr_idx);
    const RLI                               = getRLI(svr_idx);
    let _rdata={};
    let _rif = []; 
    room_list_redis.zrevrange(RLI.KEY2,0,-1,(err,reply)=>{        
        if(err){  
            console.error('auto_enter >> redis err...'+err);
            _rdata.result = PACKET_ERR.AUTO_ENTER2_REDIS1;      
            res.send(_rdata);
            res.end();
        }else{
            let _len = reply.length;
            let _cntRemain = _len;
            if( _len <= 0 ){                
                console.error('auto_enter >> redis err..res.'+reply);
                _rdata.result = PACKET_ERR.AUTO_ENTER_EMPTY;      
                res.send(_rdata);
                res.end();
            }else{
                var _flag = false;
                for( var i = 0; i<_len; i++){
                    var _rinfo_key = RLI.KEY3+'-'+reply[i];  
                    room_list_redis.hgetall(_rinfo_key,(err1,res1)=>{
                        if(err1){
                            console.error('auto_enter >> redis2 err...'+err);
                            _rdata.result = PACKET_ERR.AUTO_ENTER2_REDIS2;      
                            res.send(_rdata);
                            res.end();                            
                        }else{
                            if( res1 <= 0 ){
                                console.error('auto_enter >> redis2 res...'+res1);
                                _rdata.result = PACKET_ERR.AUTO_ENTER2_REDIS2_RES;      
                                res.send(_rdata);
                                res.end();
                            }
                            else{
                              
                               // 초기에는 락이 걸렷는지만 체크 했지만. 방정보가 널이거나 언디파인이 있을수
                               // 있어 방어코드를 추가 합니다 2019-12-18
                                if(res1.is_lock === "0" && isEmpty(res1.room_num)===false &&isEmpty(res1.room_title)===false&&isEmpty(res1.host_name)===false){   
                                    
                                    if(!_flag){                             
                                        _rdata.room_number = res1.room_num;
                                        _rdata.room_title  = res1.room_title;
                                        _rdata.host_name   = res1.host_name;
                                        _rdata.is_lock     = res1.is_lock;
                                        _rdata.is_single   = res1.is_single; 
                                        _rdata.play_time   = res1.play_time;
                                        _rdata.back_ground = res1.back_ground; 
                                        _rdata.ip          = res1.ip;
                                        _rdata.password    = res1.password;
                                        _rdata.server_idx  = res1.server_idx;
                                        _rdata.result       = PACKET_ERR.SUCCESS;                                    
                                        _flag = true;
                                    }
                                    --_cntRemain; 
                                }else{
                                    
                                    --_cntRemain;                                     
                                }
                            }
                        }
                        if(_cntRemain === 0){     
                            if(!_flag ){
                                _rdata.result = PACKET_ERR.AUTO_ENTER_EMPTY;
                            }
                            res.send(_rdata);
                            res.end()
                        }                        
                    });
                }//for                
            }
        }
    });    
});

const change_room_option = require('../src/write_setcoin2').change_room_option;
// 룸옵션 변경
router.post('/change_room_option',(req,res,next)=>{
    console.log(req.body);
    let _rn = req.body.room_number;
    let _rt = req.body.room_title;
    let _l  = req.body.is_lock;
    let _pt = req.body.play_time;
    let _bg = req.body.back_ground;
    let _pw = req.body.password;
    let _svr_idx = parseInt(req.body.server_idx);

    change_room_option(_svr_idx,_rn,_rt,_pt,_l,_bg,_pw,(err)=>{
        let _rdata={};
        _rdata.result = err;
        res.send(_rdata);
        res.end();

    });

});

const write_result = require('../src/write_setcoin2').result;
//게임 결과 저장
router.post('/write_result',(req,res,next)=>{
     
 //   console.log("/API 동전쌓기 req 정보  받았어요 =========================================== "+req.body.packet);

    var jpacket = CryptoJS_DE(req.body.packet);

 //   console.log("/API 동전쌓기 암호화 해독 완성 =========================================== "+JSON.stringify(jpacket));
    var _uuid   = jpacket.uuid;
    var _rs     = jpacket.result_state;
    var _nn     = jpacket.nick_name;
    var _date   = jpacket.date;

    

    write_result(_uuid,_nn,_rs,_date,(err)=>{
        var _rdata = {}
        _rdata.result = err;
 //       console.log("라우트 에러 ========================="+err);
        res.send(_rdata);
        res.end();
    });
});

const request_game_result = require('../src/read_setcoin2').request_game_result;
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

    var svr_idx = req.body.server_idx;
    
    const room_list_redis                   = getRedis(svr_idx);
    const RLI                               = getRLI(svr_idx);
    var _data = {};
    room_list_redis.llen(RLI.KEY1,(err,reply)=>{     
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
                room_list_redis.rpop(RLI.KEY1,(err1,reply1)=>{
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
const return_room_number = require('../src/write_setcoin2').return_room_number;
router.post('/return_room_number',(req,res,next)=>{
    let _rn = req.body.room_number;
    let _svr_idx = req.body.server_idx;
    var _data ={};
    return_room_number(_svr_idx,_rn,(err)=>{
        _data.result = err;
        res.send(_data);
        res.end();
    })
    
});



router.post('/get_total_room_list',(req,res,next)=>{
    

//    console.log("룸리스트 암호화 정보를 받습니다.~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~"+req.body.packet);

    var jpacket = CryptoJS_DE(req.body.packet);

 //   console.log("룸리스트 암호화를 복호화 합니다.~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~"+JSON.stringify(jpacket));

    let svr_idx = Number(jpacket.server_idx);

    //let svr_idx = parseInt(req.body.server_idx);
    let _rdata = {};
    get_total_room_list(svr_idx,(err,data)=>{
        _rdata.result = err;
        _rdata.count = data;
        console.log(JSON.stringify(_rdata));
        

        var ctipto_output = CryptoJS_EN(JSON.stringify(_rdata));

//        console.log("구수짱님 요청 패킷 ==============================="+ctipto_output);

        let _jsonPack = {};
        _jsonPack.packet = ""+ctipto_output;
   
        res.send(_jsonPack);
        res.end();
        
    });
});

const start_end_game_log                = require('../src/write_setcoin2').start_end_game_log;
router.post('/start_end_game_log',(req,res,next)=>{


    let _uuid   = req.body.uuid;
    let _nn     = req.body.nick_name;
    let _pm     = req.body.play_mode;
    let _onn    = req.body.other_nick_name;
    let _es     = req.body.end_state;
    let _wl     = req.body.win_lose;
    let _s      = req.body.score;
    let _st     = req.body.game_start_time;
    let _et     = req.body.game_end_time;

    
    let _rdata = {};
    start_end_game_log(LOG_MSG_IDX.GAME_COIN_BEGIN_END,
                    _uuid,_nn,GAME_CODE.GAME_SET_COIN,
                    _pm,_onn,_es,_wl,_s,_st,_et,(err)=>{
        _rdata.result = err;
        res.send(_rdata);
        res.end();

    });    

});


router.post('/reset_usercount',(req,res,next)=>{

    console.log('reset_usercount >> '+JSON.stringify(req.body));
    let svr_idx = req.body.server_idx;

    reset_usercount(svr_idx,(err)=>{
        let _rdata = {};
        _rdata.result = err;
        res.send(_rdata);
        res.end();
    });
})

router.post('/ready_redis_coin_ch',(req,res,next)=>{

    console.log('update_usercount >> '+JSON.stringify(req.body));
    let svr_idx = req.body.server_idx;

    ready_redis_coin_ch(svr_idx,(err)=>{
        let _rdata = {};
        _rdata.result = err;
        res.send(_rdata);
        res.end();
    });
})


router.post('/flush_redis_ch',(req,res,next)=>{

    console.log('update_usercount >> '+JSON.stringify(req.body));
    let svr_idx = req.body.server_idx;

    flush_redis_ch(svr_idx,(err)=>{
        let _rdata = {};
        _rdata.result = err;
        res.send(_rdata);
        res.end();
    });
})

router.post('/update_usercount',(req,res,next)=>{

    console.log('update_usercount >> '+JSON.stringify(req.body));
    let svr_idx = req.body.server_idx;
    let state = req.body.state;

    update_usercount(svr_idx,state,(err)=>{
        let _rdata = {};
        _rdata.result = err;
        res.send(_rdata);
        res.end();
    });
})

const write_share_facebook = require('../src/write_setcoin2').write_share_facebook;
const write_share_kakao = require('../src/write_setcoin2').write_share_kakao;

router.post('/write_share_facebook',(req,res,next)=>{

    let _uuid   = req.body.uuid;
    let _nn     = req.body.nick_name;
    let _tier_1 = req.body.tier_1;
    let _tier_2 = req.body.tier_2;
    let _pr     = req.body.personal_rank;
    let _sr     = req.body.school_rank;
    let _s      = req.body.score;
    let _wc     = req.body.win_count;
    let _tc     = req.body.typing_count;
    let _acc    = req.body.acc;
    let _pos    = req.body.pos;

    write_share_facebook(LOG_MSG_IDX.SCORE_SHARE_FACEBOOK,_uuid,_nn,GAME_CODE.GAME_SET_COIN,
        _tier_1,_tier_2,_pr,_sr,_s,_wc,_tc,_acc,_pos,(err)=>{

            let _rdata={};
            _rdata.result = err;
            res.send(_rdata);
            res.end();
        });

})

router.post('/write_share_kakao',(req,res,next)=>{
    let _uuid   = req.body.uuid;
    let _nn     = req.body.nick_name;
    let _tier_1 = req.body.tier_1;
    let _tier_2 = req.body.tier_2;
    let _pr     = req.body.personal_rank;
    let _sr     = req.body.school_rank;
    let _s      = req.body.score;
    let _wc     = req.body.win_count;
    let _tc     = req.body.typing_count;
    let _acc    = req.body.acc;
    let _pos    = req.body.pos;

    write_share_kakao(LOG_MSG_IDX.SCORE_SHARE_KAKAOTALK,_uuid,_nn,GAME_CODE.GAME_SET_COIN,
        _tier_1,_tier_2,_pr,_sr,_s,_wc,_tc,_acc,_pos,(err)=>{

            let _rdata={};
            _rdata.result = err;
            res.send(_rdata);
            res.end();
        });
})


module.exports = router;
