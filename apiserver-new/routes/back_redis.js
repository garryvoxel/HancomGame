/*const redis   = require('redis');
const rediscfg  = require('../config/redis.json')[process.env.NODE_ENV || 'development'];

var setcoin_room_number_redis     = redis.createClient(rediscfg.SETCOIN_ROOM_NUMBER.PORT,rediscfg.SETCOIN_ROOM_NUMBER.HOST);
var panchange_room_number_redis   = redis.createClient(rediscfg.PANCHANGE_ROOM_NUMBER.PORT,rediscfg.PANCHANGE_ROOM_NUMBER.HOST);


var setcoin_room_list_redis     = redis.createClient(rediscfg.SETCOIN_ROOM_LIST_REDIS.PORT,rediscfg.SETCOIN_ROOM_LIST_REDIS.HOST);
var user_session_redis          = redis.createClient(rediscfg.USER_SESSION_REDIS.PORT,rediscfg.USER_SESSION_REDIS.HOST);
var panchange_room_list_redis   = redis.createClient(rediscfg.PANCHANGE_ROOM_LIST_REDIS.PORT,rediscfg.PANCHANGE_ROOM_LIST_REDIS.HOST);


//랭킹
var setcoin_ranking_redis           = redis.createClient(rediscfg.RANKING_SETCOIN_REDIS.PORT,rediscfg.RANKING_SETCOIN_REDIS.HOST);
var mole_ranking_redis              = redis.createClient(rediscfg.RANKING_MOLE_REDIS.PORT,rediscfg.RANKING_MOLE_REDIS.HOST);
var localtyping_ranking_redis       = redis.createClient(rediscfg.RANKING_LOCALTYPING_REDIS.PORT,rediscfg.RANKING_LOCALTYPING_REDIS.HOST);
var panchange_ranking_redis         = redis.createClient(rediscfg.RANKING_PANCHANGE_REDIS.PORT,rediscfg.RANKING_PANCHANGE_REDIS.HOST);
//=======================================================
//동전쌓기 룸번호
setcoin_room_number_redis.on('error',(err)=>{
    console.log('setcoin_room_number_redis error :'+err);
});


setcoin_room_number_redis.on('ready',()=>{    
    console.log('setcoin_room_number_redis ready');
    let _max_room_number = rediscfg.SETCOIN_ROOM_NUMBER.MAX_ROOM_NUMBER;
    setcoin_room_number_redis.flushdb((err,reply)=>{
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
                    setcoin_room_number_redis.lpush(rediscfg.SETCOIN_ROOM_NUMBER.KEY1,_rn,(err,reply)=>{
                        if(err){
                            console.log('critical >> make setcoin_room_number err...!!!');
                        }
                    });
                }
            }            
        }
    });

    
});

setcoin_room_number_redis.on('connect',()=>{
    console.log('setcoin_room_number_redis connected');
});
//=======================================================
//판뒤집기 룸번호
panchange_room_number_redis.on('error',(err)=>{
    console.log('panchange_room_number_redis error :'+err);
});


panchange_room_number_redis.on('ready',()=>{    
    console.log('panchange_room_number_redis ready');

    let _max_room_number = rediscfg.PANCHANGE_ROOM_NUMBER.MAX_ROOM_NUMBER;
    panchange_room_number_redis.flushdb((err,reply)=>{
        if(err){
            console.log('critical >> panchange_room_number_redis flush err..');
            return;            
        }else{
            if(!reply){
                console.log('critical >> panchange_room_number_redis flush fail..'+reply);
                return;
            }else{
                for( var i =0; i < _max_room_number; i++){
                    var _rn = i+1;
                    panchange_room_number_redis.lpush(rediscfg.PANCHANGE_ROOM_NUMBER.KEY1,_rn,(err,reply)=>{
                        if(err){
                            console.log('critical >> make panchange_room_number err...!!!');
                        }
                    });
                }
            }            
        }
    });    
});

panchange_room_number_redis.on('connect',()=>{
    console.log('panchange_room_number_redis connected');
});
//=======================================================
//동전쌓기 룸리스트
setcoin_room_list_redis.on('error',(err)=>{
    console.log('room_list error :'+err);
});


setcoin_room_list_redis.on('ready',()=>{    
    console.log('room_list ready');
});

setcoin_room_list_redis.on('connect',()=>{
    console.log('room_list_redis connected');
});

//=============================================
//판뒤집기 룸리스트
panchange_room_list_redis.on('error',(err)=>{
    console.log('panchange_room_list_redis error :'+err);
});

panchange_room_list_redis.on('ready',()=>{    
    console.log('panchange_room_list_redis ready');
});

panchange_room_list_redis.on('connect',()=>{
    console.log('panchange_room_list_redis connected');
});


//=============================================

user_session_redis.on('error',(err)=>{
    console.log('user_session error :'+err);
});

user_session_redis.on('ready',()=>{    
    console.log('user_session ready');
});

user_session_redis.on('connect',()=>{
    console.log('user_session_redis connected');
});

//======================================================
//동전 쌓기 랭킹
setcoin_ranking_redis.on('error',(err)=>{
    console.log('setcoin_ranking_redis error :'+err);
});

setcoin_ranking_redis.on('ready',()=>{    
    console.log('setcoin_ranking_redis ready');
});

setcoin_ranking_redis.on('connect',()=>{
    console.log('setcoin_ranking_redis connected');
});
//두더지 랭킹
mole_ranking_redis.on('error',(err)=>{
    console.log('mole_ranking_redis error :'+err);
});

mole_ranking_redis.on('ready',()=>{    
    console.log('mole_ranking_redis ready');
});

mole_ranking_redis.on('connect',()=>{
    console.log('mole_ranking_redis connected');
});
//타자연습 랭킹
localtyping_ranking_redis.on('error',(err)=>{
    console.log('localtyping_ranking_redis error :'+err);
});

localtyping_ranking_redis.on('ready',()=>{    
    console.log('localtyping_ranking_redis ready');
});

localtyping_ranking_redis.on('connect',()=>{
    console.log('localtyping_ranking_redis connected');
});
//판뒤집기 랭킹
panchange_ranking_redis.on('error',(err)=>{
    console.log('panchange_ranking_redis error :'+err);
});

panchange_ranking_redis.on('ready',()=>{    
    console.log('panchange_ranking_redis ready');
});

panchange_ranking_redis.on('connect',()=>{
    console.log('panchange_ranking_redis connected');
});
//===========================================



//db 설정
//parseInt(rediscfg.SELECT_REDIS_DB.SETCOIN_ROOM_NUMBER)

setcoin_room_number_redis.select(rediscfg.SETCOIN_ROOM_NUMBER.DB,(err)=>{
    console.log('setcoin_room_number_redis select:'+'('+setcoin_room_number_redis.selected_db+')..'+err);
});
panchange_room_number_redis.select(rediscfg.PANCHANGE_ROOM_NUMBER.DB,(err)=>{
    console.log('panchange_room_number_redis select:'+'('+panchange_room_number_redis.selected_db+')..'+err);
});

setcoin_room_list_redis.select(rediscfg.SETCOIN_ROOM_LIST_REDIS.DB,(err)=>{
    console.log('setcoin_room_list_redis select:'+'('+setcoin_room_list_redis.selected_db+')..'+err);
});
panchange_room_list_redis.select(rediscfg.PANCHANGE_ROOM_LIST_REDIS.DB,(err)=>{
    console.log('setcoin_room_list_redis select :'+'('+panchange_room_list_redis.selected_db+')..'+err);
});

user_session_redis.select(rediscfg.USER_SESSION_REDIS.DB,(err)=>{
    console.log('user_session_redis select :'+'('+user_session_redis.selected_db+')..'+err);
});

setcoin_ranking_redis.select(rediscfg.RANKING_SETCOIN_REDIS.DB,(err)=>{
    console.log('setcoin_ranking_redis select:'+'('+setcoin_ranking_redis.selected_db+')..'+err);
});
mole_ranking_redis.select(rediscfg.RANKING_MOLE_REDIS.DB,(err)=>{
    console.log('mole_ranking_redis select:'+'('+mole_ranking_redis.selected_db+')..'+err);
});
panchange_ranking_redis.select(rediscfg.RANKING_PANCHANGE_REDIS.DB,(err)=>{
    console.log('panchange_ranking_redis select:'+'('+panchange_ranking_redis.selected_db+')..'+err);
});
localtyping_ranking_redis.select(rediscfg.RANKING_LOCALTYPING_REDIS.DB,(err)=>{
    console.log('localtyping_ranking_redis select:'+'('+localtyping_ranking_redis.selected_db+')..'+err);
});

module.exports = {
    //룸리스트
    setcoin_room_list_redis:setcoin_room_list_redis,
    panchange_room_list_redis:panchange_room_list_redis,

    user_session_redis:user_session_redis,

    //랭킹
    setcoin_ranking_redis:setcoin_ranking_redis,
    mole_ranking_redis:mole_ranking_redis,
    panchange_ranking_redis:panchange_ranking_redis,
    localtyping_ranking_redis:localtyping_ranking_redis,

    //룸번호
    setcoin_room_number_redis:setcoin_room_number_redis,
    panchange_room_number_redis:panchange_room_number_redis


};*/