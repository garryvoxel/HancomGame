const io                    = require('socket.io-client');
const config                = require('../config/server.json');
var room_pool               = require('./RoomPool');
var user_pool               = require('./UserPool');
//var waitUser                = require('./WaitUser');
//const PACKET_DEF            = require('./packet_def').PACKET_DEF;

const SS_PACKET_DEF         = require('./packet_def').SS_PACKET_DEF;
const ROOM_NO               = require('./define').ROOM_NO;
const ServerInfo            = require('../common/ServerInfo');

let _host = "http://"+config.CENTER_SERVER_HOST+":"+config.CENTER_SERVER_PORT;

function CClient(){
    this.Socket = null;
}
//소켓 연결
CClient.prototype.Start = function(){
    this.Socket = io.connect(_host);
}
//소켓 연결 끊기
CClient.prototype.disconnect = function(){
    this.Socket.on('disconnect',()=>{            
        console.log('CenterServer disconnected....!!');
        this.Socket.disconnect();
    });
}
//소켓 연결하여 서버에 접속하기
CClient.prototype.connect = function(){
    console.log('Connected CenterServer....!!');
    var _ip = ServerInfo.getPrivateip();
    var _data = {};
    _data.id = 2;
    _data.ip = _ip;
    this.Socket.emit(SS_PACKET_DEF.REQ_LOGIN,_data);
}

CClient.prototype.res_login = function(){
    this.Socket.on(SS_PACKET_DEF.RES_LOGIN,(d)=>{
        console.log('res_login >> ' + JSON.stringify(d));
    });
}

CClient.prototype.process =function(){
    this.connect();
    this.disconnect();
    this.res_login();
}




let g_client = new CClient();
module.exports = g_client;



