/**
 * 파일명: gcserver/src/client.js
 * 소켓 테스트를 위한 클라이언트 모의 클래스 정의
 */
const io                    = require('socket.io-client');
const config                = require('../config/server.json');
const PACKET_DEF            = require('./packet_def').PACKET_DEF;
//const PACKET_ERR            = require('./packet_err').PACKET_ERR;
const ServerInfo            = require('../common/ServerInfo');

let _host = "http://"+config.CENTER_SERVER_HOST+":"+config.CENTER_SERVER_PORT;

function CClient(){
    this.Socket = null;
}

CClient.prototype.Start = function(){
    this.Socket = io.connect(_host);
}

CClient.prototype.disconnect = function(){
    this.Socket.on('disconnect',()=>{            
        console.log('CenterServer disconnected....!!');
        this.Socket.disconnect();
    });
}

CClient.prototype.connect = function(){
    console.log('Connected CenterServer....!!');
    var _ip = ServerInfo.getPrivateip();
    var _data = {};
    _data.id = 2;
    _data.ip = _ip;
    this.Socket.emit(PACKET_DEF.REQ_LOGIN,_data);
}

CClient.prototype.res_login = function(){
    this.Socket.on(PACKET_DEF.RES_LOGIN,(d)=>{
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
