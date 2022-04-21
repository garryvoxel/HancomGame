/**
 * 파일명: gcserver/common/BaseUser.js
 * 기초 유저 클래스 정의 
 * 닉네임과 소켓정보 포함
 */
class CBaseUser{
    constructor(){
        this.NickName   = null;
        this.Socket     = -1;
    }

    /**
     * 소켓을 저장하는 함수
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
}


module.exports = CBaseUser;