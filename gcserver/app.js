/**
 * 파일명: gcserver/app.js
 * gcserver 시작파일
 */
const express       = require('express');
const app           = express();
const redis         = require('socket.io-redis');
const cluster       = require('cluster'); // 프로세스 병렬 처리를 위한 플러그인 & 멀티 프로세스 지원 - Product 모드에서 이용가능
const cpus          = require('os').cpus().length; // 프로세스 Core 개수 얻기
const config        = require('./config/server.json')[process.env.NODE_ENV];
let CUserPool       = require('./src/UserPool');
const packet        = require('./src/packet');
const pubsub        = require('./src/pubsub'); // 레디스 Pub/Sub(Publish/Subscribe) 시스템 이용
const { pub } = require('./src/pubsub');
const pscfg      = require('./config/pubsub.json')[process.env.NODE_ENV]; //Redis 서버정보 가져오기

//const client        = require('./src/client');

var port = normalizePort(process.env.PORT || config.SERVER_PORT);

//g_cpu 모듈에서 이용하지 않음 
var g_cpu = cpus;
function normalizePort(val) {
    var port = parseInt(val, 10);
    if (isNaN(port)) {
      // named pipe
      return val;
    }
    if (port >= 0) {
      // port number
      return port;
    }
    return false;
}

//process.env.NODE_ENV = "development";
if( true ){

    console.log('Mode : '+ process.env.NODE_ENV);
    var http            = require('http').Server(app);
    var io              = require('socket.io')(http, { transports: [ 'websocket', 'polling' ] });
    http.listen(port,()=>{

        process.send('ready');

        console.log('GCServer start PORT('+port+')');
        const ioRedis = redis({ host: pscfg.PUB_SUB_REDIS_HOST, port: pscfg.PUB_SUB_REDIS_PORT });
        ioRedis.prototype.on('error', err => console.error('ioRedis Error', err));
        io.adapter(ioRedis);

        pubsub.init(); // redis 클라이언트 객체 창조 , redis 서버 접속
        /*
        --------------------
        Pub/Sub 핸들러 정의
             • ready - sub가 redis 서버 접속시 한번 emit~
             • error - pub/sub 오류 발생시 emit~
             • connect - pub/sub stream 데이터가 서버 연결시 emit~
             • message - sub가 listen하고 있는 channel로 message가 전송되면 emit~
        */
        pubsub.ready();
        pubsub.error();
        pubsub.connect();
        pubsub.message();
        pubsub.setSocketHandler(io);
        /*
        ---------------------
        */
        // var _data = {};
        // _data.msg_idx = "login";
        // _data.ip = "19293";
        // _data.game_code = 0;
        // pubsub.publish(_data);

    });
    packet.process(io);


    process.on('SIGINT',()=>{
      console.log('SIGINT 1!!!!!');
      http.close(function () {
        console.log('server closed')
        process.exit(0);
      })
    });

}else{
   //product 버전의 경우 클러스터링 정의
   //클러스터는 단순히 프로세스들을 병렬로 실행하는것이 아니라 포트공유와 로드밸런싱 가능
    console.log('Mode : production');
    //인스턴스가 마스터인지 워커인지 체크
    if(cluster.isMaster){ 
       // 마스터 인스턴스는 워커 생성/관리 포함 (로직 제외)
        for(var i = 0; i < cpus; i ++){
          //cpu개수만큼 워커인스턴스 생성
          cluster.fork();
        }

        // 워커가 죽으면 발생하는 exit이벤트
        cluster.on('exit',(worker,code,signal)=>{
          console.log('exit worker >> '+worker.process.pid+'died');
          if(code === 200){
            // 워커가 죽으면 다시 새로운 워커의 생성이 진행됨 
            cluster.fork();
          }
        });

        //워커 생성 이벤트 
        cluster.on('online',(worker)=>{
          console.log('onine worker'+worker.process.pid);
          //워커가 생성되면 바로 실행되는  online 이벤트
          //생성된 워커수 계수 ,  이용되지 않고 있다.
          ++cnt;
          console.log('cnt ' +cnt);
        });

        //pub/sub 메시지 정의 , 마스터에서만 정의
        pubsub.init();
        pubsub.ready();
        pubsub.connect();
        pubsub.message();

        var _data = {};
        _data.msg_idx = "login";
        _data.ip = "19293";
        _data.game_code = 0;
        pubsub.publish(_data);

    }else{
        var http            = require('http').Server(app);
        var io              = require('socket.io')(http);

        // 워커 프로세스 생성
        http.listen(port,()=>{
          console.log('CenterServer start Port(' + port+')'+'work id : '+cluster.worker.id);
        /**
         * socket-io 를 redis store에 연결
         * 클러스터 적용시에만 필요한 부분으로 워커프로세스간 socket 객체 공유 필요
         * product버전에서만 이용
         */
          io.adapter(redis({host:'localhost',port:6379}));
        });

        packet.process(io);

    }
}

//const Pubsub_close          = require('./src/pubsub').Pubsub_close;
process.on('exit',()=>{
  console.log('goodbye!!!!!');
  pubsub.close();
});

//catches ctrl+c event


// catches "kill pid" (for example: nodemon restart)
process.on('SIGUSR1',()=>{
  console.log('SIGUSR1 goodbye!!!!!');
  process.exit();

});

process.on('SIGUSR2', ()=>{
  console.log('SIGUSR2 goodbye!!!!!');
  process.exit();
});