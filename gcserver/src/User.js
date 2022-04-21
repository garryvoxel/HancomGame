/**
 * 파일명: gcserver/src/User.js
 * CBaseUser에서 파생된 CUser 클래스 정의
 * 닉네임, 소켓 정보 포함
 * 유저 상태 정보 포함
 */
let CBaseUser = require('../common/BaseUser');
const USER_POSITION = require('./Def').USER_POSITION;
class CUser extends CBaseUser {
    constructor(){
        super();
        //유저 LOBBY 상태로 초기화
        this.Position = USER_POSITION.LOBBY;
        //소켓 , 닉네임 초기화
        this.Socket = -1;
        this.NickName = null;
    }

    reset(){
        this.Socket = -1;
        this.NickName = null;
    }

    /**
     * 유저 소켓 설정
     * @param {*저장 할 소켓} s
     */
    setSocket(s){
        this.Socket = s;

    }

    /**
     * 소켓을 가져오는 함수
    */
    getSocket(){
        return this.Socket;
    }

    getSocketId() {
        return this.Socket.id;
    }

    /**
     * 닉네임을 저장하는 함수
     * @param {*저장 할 닉네임} n
     */
    setNickName(n){
        this.NickName = n;
    }

    /**
     * 닉네임을 가져오는 함수
     */
    getNickName(){
        return this.NickName;
    }

    /**
     * 유저의 포지션을 세팅하는 함수
     * @param {* 유저의 포지션} p
     */
    setPosition(p){
        this.Position = p;
    }

    /**
     * 유저의 포지션 값을 가져오는 함수
     */
    getPosition(){
        return this.Position;
    }
}

module.exports = CUser;