/**
 * 파일명: setcoinserver1/src/game_judgetmnt.js
 * GameResultJudgement 클래스 정의
 * 게임승부 결정 및 결과 정보 보관 클래스
 * 2명중 1명의 연결이 끊어졌을 경우 무승부
 * 결과는 획득한 코인수 또는 스코어에 따라 결정됨
 */
const write_game_result = require('./call_apiserver').write_game_result;
class GameResultJudgement{
    constructor(){
        this.isGameOver = false;
        this.Users = [];
        this.winUser = null;
        this.loseUser = null;
        this.isDraw = false;
    }

    //완전 초기화
    reset(){
        this.isGameOver = false;
        var _cnt = this.Users.length;
        this.Users.splice(0,_cnt);
        this.winUser = null;
        this.loseUser = null;
        this.isDraw = false;
    }

    //게임 재시작
    reset2(){
        this.isGameOver = false;
        this.winUser = null;
        this.loseUser = null;
        this.isDraw = false;
    }

    getisDraw(){
        return this.isDraw;
    }

    setisGameOver(f){
        this.isGameOver = f;
    }

    getisGameOver(){
        return this.isGameOver;
    }

    setUser(u){
        this.Users.push(u);
    }
    //승부결정
    jusement(){

        if(this.Users.length == 2){
            //두명다 접속해 있는 상태
            if(this.Users[0].getDisconnected() === false &&
            this.Users[1].getDisconnected() === false){
                //1. 코인 비교
                if(this.Users[0].getCoinCount() == this.Users[1].getCoinCount()){
                    //코인 갯수가 같으면 스코어 비교
                    
                    if(this.Users[0].getScore() === this.Users[1].getScore() ){
                        this.isDraw = true;
                    }else{
                        if(this.Users[0].getScore() > this.Users[1].getScore() ){
                            this.winUser = this.Users[0];
                            this.loseUser = this.Users[1];
                        }else{
                            this.winUser = this.Users[1];
                            this.loseUser = this.Users[0];
                        }                        
                    }
                }else{
                    if(this.Users[0].getCoinCount() > this.Users[1].getCoinCount() ){
                        this.winUser = this.Users[0];
                        this.loseUser = this.Users[1];
                    }else{
                        this.winUser = this.Users[1];
                        this.loseUser = this.Users[0];
                    }
                }
            }else{//한명이 접속이 끊겼을 경우
                if(this.Users[0].getDisconnected() &&this.Users[1].getDisconnected()){  
                    this.isDraw = true;
                }else{
                    if(this.Users[0].getDisconnected()){
                        this.winUser = this.Users[1];
                        this.loseUser = this.Users[0];
                    }else{
                        this.winUser = this.Users[0];
                        this.loseUser = this.Users[1];
                    }
                }

            }
        }
        
    }
    //승부처리
    jusement_process(){
        if(this.isDraw){            
            this.Users[0].setDrawCount(1); 
            this.Users[1].setDrawCount(1); 
            if(this.Users[0].getIsUser() === true){
                write_game_result(this.Users[0].getUUID(),this.Users[0].getNickName(),2,(err)=>{
                    if(this.Users[1].getIsUser() === true){
                        write_game_result(this.Users[1].getUUID(),this.Users[1].getNickName(),2,(err)=>{
                        });
                    }
                });
            }
        }else{
            this.winUser.setWin(true);
            this.winUser.setWinCount(1);
            this.loseUser.setLoseCount(1);
            if(this.winUser.getIsUser() === true){
                write_game_result(this.winUser.getUUID(),this.winUser.getNickName(),0,(err)=>{
                    if(this.loseUser.getIsUser() === true){
                        write_game_result(this.loseUser.getUUID(),this.loseUser.getNickName(),1,(err)=>{
                        });
                    }
                });
            }
        }
    }

}

module.exports = GameResultJudgement;