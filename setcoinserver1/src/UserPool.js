/**
 * 파일명: setcoinserver1/src/UserPool.js
 * 코인쌓기 게임에 접속되어 있는 유저목록을 관리하는 유저풀 클래스 정의 
 * 유저추가, 유저 삭제, 닉네임 증복검사, 소켓ID로 유저찾기 등의 메소드 정의
 */
const config 	        = require('../config/server.json')[process.env.NODE_ENV || 'development'];
var User                = require('./User.js');

const setcoinserverRedisApiHandler = require('axios');
setcoinserverRedisApiHandler.defaults.baseURL = config.REDIS_NEW_MODULE;
setcoinserverRedisApiHandler.defaults.headers.post['Content-Type'] = 'application/json';

class CUserPool{
    constructor(){        
        this.pool       = [];
        this.usedpool   = [];
        this.MAX_USER_POOL = 0;
    }

    init(){
        console.log('USER_MAX : '+config.USER_MAX);
        var _user_max = parseInt(config.USER_MAX);
        for( var i=0; i < _user_max; i++ ){
            this.pool.push(new User(null));
        }

        this.MAX_USER_POOL = _user_max;
    }

    isEmpty(){
        return this.MAX_USER_POOL === this.usedpool.length?true:false;
    }

    get(){
        return this.pool.shift();
    }

    set(u){
        this.pool.push(u);
    }

    getSize(){
        return this.pool.length;
    }

    /**
     * 유저가 로그인 하면 정보를 세팅하고 등록하는 함수
     * @param {*유저포인트} u 
     */
    setUsedUser(u){
        this.usedpool.push(u);
    }

    /**
     * new added
     */
    async addUserToRedis(user_obj) {
        try {
            let ret = await setcoinserverRedisApiHandler.post('/setcoinserver/add_user', user_obj);
            if(ret.data.ERR_CODE == 0)
                return true;
            return false;
        }
        catch(err22) {
            console.log("[유저정보 생성 오류1]======", err22);
            return false;
        }
    }

    getUsedUserSize(){
        return this.usedpool.length;
    }

    /**
     * user 포인터로 접속 종료 처리하기
     */
    withdraw(user){
        
        if( this.usedpool.length <= 0 ){
            return false;
        }

        var _num = -1;
		var _flag = false;

        for( var i = 0; i < this.usedpool.length; i++){
            if(this.usedpool[i].getNickName() === user.getNickName()){
                _num = i;
                _flag = true;
                break;
            }
        }

        if( _flag ){
            this.usedpool.splice(_num,1);
            user.reset();
            this.pool.push(user);

            console.log('user pool withdraw ' + this.pool.length+ " used :" + this.usedpool.length );;
            return true;
        }

        console.log('user pool withdraw ' + this.pool.length+ " used :" + this.usedpool.length );;

        return false;
    }
    /**
     * 소켓으로 접속 종료 처리하기
     * @param {*소켓} socket 
     */
    withdrawBySocket(socket){
        console.log('user pool withdrawBySocket');
        if( this.usedpool.length <= 0 ){
            return false;
        }
        var _num = -1;
        var _flag = false;
        var user = null;
        for( var i = 0; i < this.usedpool.length; i++){
            if(this.usedpool[i].getSocket().id === socket.id){
                _num = i;
                _flag = true;
                user = this.usedpool[i];
                break;
            }
        }
        if( _flag ){
            /*
            console.log('withdrawBySocket..nickname : '+user.getNickName());
            console.log('1.withdrawBySocket..pool length : '+this.pool.length);
            console.log('1.withdrawBySocket..usedpool length : '+this.usedpool.length); */
            this.usedpool.splice(_num,1);
            user.reset();
            this.pool.push(user);
            socket.disconnect(true);
            /*
            console.log('2.withdrawBySocket..usedpool length : '+this.usedpool.length);
            console.log('2.withdrawBySocket..pool length : '+this.pool.length); */
            return true;
        }
        return false;
    }

    isDuplication_ip(_ip){
        for( var i = 0; i < this.usedpool.length; i++){
         /* console.log("복사체크 합니다. 전체 유저풀 크기 == "+this.usedpool.length);
            console.log("복사체크 합니다. 가져온 아이피 == "+_ip);
            console.log("복사체크 합니다  체크할 아이피 == "+this.usedpool[i].getIp()); */
            if(this.usedpool[i].getIp() === _ip){
                if( this.usedpool[i].getRoomNumber() <= 0 ){
                    this.usedpool[i].getSocket().disconnect(true);
                    this.withdraw(this.usedpool[i]);
                }
                return true;
            }

        }

        return false;
    }
    /***
     * 닉네임으로 중복 체크
     */

     isDuplication(nick_name){
        for( var i = 0; i < this.usedpool.length; i++){
            if(this.usedpool[i].getNickName() === nick_name){
                if( this.usedpool[i].getRoomNumber() <= 0 ){
                    this.usedpool[i].getSocket().disconnect(true);
                    this.withdraw(this.usedpool[i]);
                }
                return true;
            }

        }

        return false;
     }

     /**
      * 소켓아이디로 유저 찾기
      * @param {*소켓아이디} id 
      */
     getUserBySocketId(socket_id){
        if( this.usedpool.length <= 0 ){
            return null;
        }

        for( var i = 0; i < this.usedpool.length; i++){
            if(this.usedpool[i].getSocket().id === socket_id){
                return this.usedpool[i];
            }
        }
        return null;
     }

     /**
      * 닉네임으로 유저 포인트 가져오는 함수
      * @param {*닉네임} nick_name 
      */
     getUserByNickName(nick_name){
        if( this.usedpool.length <= 0 ){
            return null;
        }

        for( var i = 0; i < this.usedpool.length; i++){
            if(this.usedpool[i].getNickName() === nick_name){
                return this.usedpool[i];
            }
        }
        return null;
     }


}

var pool = new CUserPool();
pool.init();

module.exports = pool;