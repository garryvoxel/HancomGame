/**
 * 파일명: setcoinserver1/src/pubsub.js
 * CPubSub 클래스 정의  (레디스 구독/발행 모듈 클래스로 정의)
 * 다른 모듈에서 보낸 메시지를 pubsub_packet에 전달
 * pubsub_packet에 동기처리 부분 개발되어 있음
 */
const redis      = require('redis');
const pscfg      = require('../config/pubsub.json')[process.env.NODE_ENV];
const pubsub_packet = require('./pubsub_packet').pubsub_packet;



function CPubSub(){
    this.pub = null;
    this.sub = null;
}

//레디스 서버 접속
CPubSub.prototype.init = function(){
    console.log('process.env.NODE_ENV : '+process.env.NODE_ENV);
    console.log('pscfgf : '+pscfg);
    console.log("pubsub port : "+pscfg.PUB_SUB_REDIS_PORT," host : "+pscfg.PUB_SUB_REDIS_HOST);
    //Redis 서버 접속 , 클라이언트 객체 창조
    this.pub     = redis.createClient(pscfg.PUB_SUB_REDIS_PORT,pscfg.PUB_SUB_REDIS_HOST);
    this.sub     = redis.createClient(pscfg.PUB_SUB_REDIS_PORT,pscfg.PUB_SUB_REDIS_HOST);
    //채널에 subscribe
    this.sub.subscribe(pscfg.CHANNEL_NAME);
}

/**
 * pub/sub event 핸들러 정의  error/connect/ready/message
*/
CPubSub.prototype.error = function(){
    this.pub.on('error',(err)=>{
        console.log('pub error :'+err);
    });
    this.sub.on('error',(err)=>{
        console.log('sub error :'+err);
    });
}

CPubSub.prototype.connect = function(){
    this.sub.on('connect',()=>{
        console.log('sub connected');
    });
    this.pub.on('connect',()=>{
        console.log('pub connected');
    });
}


CPubSub.prototype.ready = function(){
    this.sub.on('ready',()=>{    
        console.log('sub ready');
    });
    this.pub.on('ready',()=>{    
        console.log('pub ready');
    });
}

//채널에 publish한 message받기
CPubSub.prototype.on_message = function(){
    this.sub.on("message",(channel,msg)=>{      
        pubsub_packet(msg);
    });
}

//채널에 message를 publish하기
CPubSub.prototype.on_publish = function(data){
    if( this.pub != null){
        this.pub.publish(pscfg.CHANNEL_NAME,JSON.stringify(data));
    }
}

CPubSub.prototype.close = function(){
    if(this.sub){
        this.sub.quit();
    }
}





let pubsub = new CPubSub();




module.exports = pubsub;





// //=========================================
// // pub
// pubsub.getPub().on('error',(err)=>{
//     console.log('publish error :'+err);
// });
// pubsub.getPub().on('ready',()=>{    
//     console.log('publish ready');
// });

// pubsub.getPub().on('connect',()=>{
//     console.log('publish connected');
// });

//==============================
// pubsub.getSub().on("message",(channel,msg)=>{    
//     packet.Pubsub_process(msg);
// });

exports.Pubsub_publish = function(msg){    
    pubsub.getPub().publish(pscfg.CHANNEL_NAME,JSON.stringify(msg));
}

exports.Pubsub_close = function(){    
    pubsub.getSub().quit();
    pubsub.getPub().quit();
}
