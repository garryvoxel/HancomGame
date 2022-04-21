/**
 * 파일명: gcserver/src/UserPool.js
 * CUserPool 클래스 정의
 * 현재 사이트에 접속되어 있는 유저 정보를 포함
 * 매 유저는 닉네임과 소켓정보 포함
 * 유저의 서버연결이 끊길 경우 목록에서 삭제
 */
const config 	        = require('../config/server.json')[process.env.NODE_ENV];
const request = require('request');
let CUser               =  require('./User');

class CUserPool {
    constructor() {
        this.MAX_USER_POOL  = 0;  
    }

    init(){
        console.log('usermax : '+config.MAX_USER);
        var _user_max = parseInt(config.MAX_USER);
        this.MAX_USER_POOL = _user_max;
    }

    /**
     *
     * @param {* 사용중인 유저를 UserPool에 저장} u
     */
    setUsedUser(nick_name, socket_id, session_id){
        request.post(
            config.REDIS_NEW_MODULE + '/gcserver/set_used_user', {
                json: {
                    "nick_name": nick_name,
                    "socket_id": socket_id,
                    "session_id": session_id
                }
            },
            function(error, response, body) {
                if (error) {
                    console.log('[[REDIS ERROR]]/set_used_user');
                    console.log(error);
                } else {
                    console.log('[[REDIS]]/set_used_user', body);
                }
            }
        );
    } 

    /**
     * 유저를 반환함
     * @param {*반환 할 유저 포인트} user 
     */
    withdraw(socket_id, callback){
        request.post(config.REDIS_NEW_MODULE + '/gcserver/withdraw',  {
            json: {
                "socket_id": socket_id
            }
        },
        function(error, response, body) {
            if (error) {
                console.log('[[REDIS ERROR]]/withdraw');
                console.log(error);
                callback(null);
            } else {
                console.log('[[REDIS]]/withdraw', body);
                if(body.ERR_CODE != 0)
                    callback(null);
                else
                    callback(body.NICKNAME);
            }
        });
    }

    /**
     * 닉네임으로 유저 찾기
     * @param {*닉네임} s
     */
    getUserByNickName(n, callback){
        request.post(config.REDIS_NEW_MODULE + '/gcserver/get_user_by_nick_name',  {
            json: {
                "nick_name": n
            }
        },
        function(error, response, body) {
            if (error) {
                console.log('[[REDIS ERROR]]/get_user_by_nick_name');
                console.log(error);
            } else {
                console.log('[[REDIS]]/get_user_by_nick_name', body);
                if(body.ERR_CODE != 0)
                    callback([]);
                else
                    callback(body.USER);
            }
        });
    }

    /**
     * 소켓아이디로 유저 찾기
     * @param {*소켓아이디} socket_id 
     */
    getUserBySocketId(socket_id, callback){
        request.post(config.REDIS_NEW_MODULE + '/gcserver/get_user_by_socket_id',  {
            json: {
                "socket_id": socket_id
            }
        },
        function(error, response, body) {
            if (error) {
                console.log('[[REDIS ERROR]]/get_user_by_socket_id');
                console.log(error);
            } else {
                console.log('[[REDIS]]/get_user_by_socket_id', body);
                if(body.ERR_CODE != 0)
                    callback(null);
                else
                    callback(body.USER);
            }
        });
    }

    setPosition(nickname, position) {
        request.post(
            config.REDIS_NEW_MODULE + '/gcserver/set_position', {
                json: {
                    "nick_name": nickname,
                    "position": position
                }
            },
            function(error, response, body) {
                if (error) {
                    console.log('[[REDIS ERROR]]/set_position');
                    console.log(error);
                } else {
                    console.log('[[REDIS]]/set_position', body);
                }
            }
        );
    }

    clear(){
        request.post(
            config.REDIS_NEW_MODULE + '/gcserver/clear', {
                json: {}
            },
            function(error, response, body) {
                if (error) {
                    console.log('[[REDIS ERROR]]/clear');
                    console.log(error);
                } else {
                    console.log('[[REDIS]]/clear', body);
                }
            }
        );
    }
}

let pool = new CUserPool();
pool.init();

module.exports = pool;