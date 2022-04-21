/**
 * 파일명: setcoinserver4/app.js
 * setcoinserver1 시작파일
 */
 const express = require('express');
 const app = express();
 const config = require('./config/server.json')[process.env.NODE_ENV || 'development'];
 const cluster = require('cluster');
 //const redis               = require('socket.io-redis');
 const cpus = require('os').cpus().length;
 const packet = require('./src/packet');
 const ServerInfo = require('./common/ServerInfo');
 const getServerIp = require('./common/util').getServerIP;
 const getPublicIP = require('./common/util').getPublicIP;
 const character_init = require('./common/character').character_init;
 const reset_usercount = require('./src/call_apiserver').reset_usercount;
 const flush_redis_ch = require('./src/call_apiserver').flush_redis_ch;
 //const client            = require('./src/client'); //사용안함 pubusb로대처
 const check_total_room = require('./src/check_total_room');
 const ready_redis_ch = require('./src/call_apiserver').ready_redis_ch;
 const redis         = require('socket.io-redis');
 const redisConf     = require('./config/pubsub.json')[process.env.NODE_ENV || 'development'];
 //require('./src/pubsub');
 
 const port = normalizePort(process.env.PORT || config.SERVER_PORT);

app.enable('trust proxy');

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

const load_word = require('./src/load').load_word;

const pubsub = require('./src/pubsub');

//process.env.NODE_ENV = "production";
//if( process.env.NODE_ENV === "development"){
if (true) {
    var http = require('http').Server(app);
    var io = require('socket.io')(http);

    const ioRedis = redis({ host: redisConf.PUB_SUB_REDIS_HOST, port: redisConf.PUB_SUB_REDIS_PORT });
    ioRedis.prototype.on('error', err => console.error('ioRedis Error', err));
    io.adapter(ioRedis);

    http.listen(port, () => {
        let _ip = getServerIp();
        getPublicIP((err, ip) => {
            if (err) {} else {
                ServerInfo.setPrivateip(_ip);
                ServerInfo.setPublicIP(ip);
                ServerInfo.setPort(port);

                load_word(__dirname + '/data/');
                character_init();
                pubsub.init();
                pubsub.ready();
                pubsub.connect();
                pubsub.on_message();

                // check_total_room.start();

                // 서버가 재시작하면, 모든 유저가 DisConn이기에 DB의 채널유저카운터수도 리셋해야합니다.
                // reset_usercount(1);

                // 서버가 재시작 되면 , API Reidis의 유령방이 생김으로 플러싱 한번 해줍니다.
                //flush_redis_ch();
                //eady_redis_ch();

                console.log('server start  private ip : ' + _ip + ' public ip : ' + ip + ', port : ' + port);
            }

        });
        console.log('SetCoinGameServer start Port(' + port + ')');
        //var _room_max = parseInt(config.MAX_ROOM_POOL);
    });

    packet.process(io, cluster);

} else {
    console.log('Mode : production');
    if (cluster.isMaster) {
        console.log('master.....');
        for (var i = 0; i < cpus; i++) {
            cluster.fork();
        }

        cluster.on('exit', (worker, code, signal) => {
            console.log('worker' + worker.process.pid + 'died');
        });


        let _ip = getServerIp();
        getPublicIP((err, ip) => {
            if (err) {} else {
                ServerInfo.setPrivateip(_ip);
                ServerInfo.setPublicIP(ip);
                ServerInfo.setPort(port);

                console.log('server start  private ip : ' + _ip + ' public ip : ' + ip + ', port : ' + port);
            }

        });


        load_word(__dirname + '/data/');
        character_init();
        pubsub.init();
        pubsub.ready();
        pubsub.connect();
        pubsub.on_message();

        check_room.start();
    } else {
        var http = require('http').Server(app);
        var io = require('socket.io')(http);

        http.listen(port, () => {
            console.log('SetCoinGameServer start Port(' + port + ')' + 'work id : ' + cluster.worker.id);
        });
        io.adapter(redis({ host: 'localhost', poort: 6379 }));
        packet.process(io, cluster);
    }
}

//const Pubsub_close          = require('./src/pubsub').Pubsub_close;
process.on('exit', () => {
    console.log('goodbye!!!!!');
    // Pubsub_close();
});

//catches ctrl+c event
process.on('SIGINT', () => {
    console.log('SIGINT goodbye!!!!!');
    process.exit();

});

// catches "kill pid" (for example: nodemon restart)
process.on('SIGUSR1', () => {
    console.log('SIGUSR1 goodbye!!!!!');
    process.exit();

});
process.on('SIGUSR2', () => {
    console.log('SIGUSR2 goodbye!!!!!');
    process.exit();
});