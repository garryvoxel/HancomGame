/** 
 * 파일명: gcserver/src/pubsub.js
 * CPubSub 클래스 정의
 * 레디스 구독 발행을 클래스로 정의
*/
const redis      = require('redis');
const pscfg      = require('../config/pubsub.json')[process.env.NODE_ENV]; //Redis 서버정보 가져오기
const pubsub_packet = require('./pubsub_packet').pubsub_packet;

function CPubSub(){
    this.pub = null;
    this.sub = null;
    this.io = null;
}

//1단계 redis 서버 접속
CPubSub.prototype.init = function(){
    console.log('process.env.NODE_ENV : '+process.env.NODE_ENV);
    console.log('pscfgf : '+pscfg);
    console.log("pubsub port : "+pscfg.PUB_SUB_REDIS_PORT," host : "+pscfg.PUB_SUB_REDIS_HOST);
    // Redis 서버 연결 , 2개의 redis client핸들러 생성
    this.pub     = redis.createClient(pscfg.PUB_SUB_REDIS_PORT,pscfg.PUB_SUB_REDIS_HOST); 
    this.sub     = redis.createClient(pscfg.PUB_SUB_REDIS_PORT,pscfg.PUB_SUB_REDIS_HOST);
    this.sub.subscribe(pscfg.CHANNEL_NAME); // "private_system_chat" 채널로 보내진(publish) 메시지를 전달받기 위한 subscribe설정
    this.io = null;
}

/**
 * pub , sub에 대한 error 이벤트 정의
*/
CPubSub.prototype.error = function(){
    this.pub.on('error',(err)=>{
        console.log('pub error :'+err);
    });
    this.sub.on('error',(err)=>{
        console.log('sub error :'+err);
    });
}

/**
 * main socket io setting
 */
CPubSub.prototype.setSocketHandler = function(_io) {
    this.io = _io;
}

/**
 * pub , sub에 대한 connect 이벤트 정의
*/
CPubSub.prototype.connect = function(){
    this.sub.on('connect',()=>{
        console.log('sub connected');
    });
    this.pub.on('connect',()=>{
        console.log('pub connected');
    });
}

/**
 * sub에 대한 ready 이벤트 정의
*/
CPubSub.prototype.ready = function(){
    this.sub.on('ready',()=>{
        console.log('sub ready');
    });
}

//"private_system_chat" 채널에 publish한 message받기
CPubSub.prototype.message = function(){
    this.sub.on("message",(channel,msg)=>{
        pubsub_packet(msg, this.io);
    });
}

//"private_system_chat" 채널에 message를 발행
CPubSub.prototype.publish = function(data){
    this.pub.publish(pscfg.CHANNEL_NAME,JSON.stringify(data));
}

//sub 클라이언트 객체 redis서버와의 연결 해제
CPubSub.prototype.close = function(){
    if(this.sub){
        this.sub.quit();
    }
}

//CPubSub 클랙스 객체 생성
let pubsub = new CPubSub();

module.exports = pubsub;



