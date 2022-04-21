/**
 * 파일명: setcoinserver4/src/Room.js
 * 게임방 클래스 정의
 * 게임방 제목, 게임방 번호, 게임방 가입 유저목록, 게임방 상태, 게임방 시작시간, 종료시간등의 정보 포함
 * 비밀방 여부 , 비밀방 비번, 싱글플레이 판단
 * 게임방 워드 레벨 조종 클래스 객체 포함
 */
//var CUser                   = require('./User.js');
const CWordCtrl             = require('./word_ctrl');
var combo_attack_type       = require('./define').COMBO_ATTACK_TYPYE;
const CS_PACKET_DEF         = require('./packet_def').CS_PACKET_DEF;
const CG_PACKET_ERR         = require('./packet_err').CG_PACKET_ERR;
const SS_PACKET_DEF         = require('./packet_def').SS_PACKET_DEF;
const TIME                  = require('../common/time');
const PacketEncode          = require('../common/util').PacketEncode;
const user_pool             = require('./UserPool');
const wlccfg                = require('../config/word_level_ctrl.json');
const GameResultJudgement   = require('./game_judgemnt');
const PUBSUB                = require('./pubsub');

ROOM_STATE = {    
    "INIT":0,
    "CREATE_ROOM":1,
    "ENTER_FINISHED":2,
    "GAME_PLAY_READY":3,
    "GAME_PAYING":4,
    "PRE_GAME_OVER":5,
    "GAME_OVER_WAIT":6, //약 1초 뒤에 게임종료 처리한다.
    "GAME_OVER":7,  //game_over 상태이면 결과창을 요청한다.    
    "GAME_CLEAR":8
}


class CRoom{
    constructor(num,title){
        this.Title              = title;
        this.Number             = num;
        this.Users              = [];
        this.LeaveUsers         = [];
        this.State              = ROOM_STATE.INIT;
        this.GameStartTime      = 0;
        this.EnterFinishTime    = 0;

        //콤보단어 옵셋
        //this.ComboAttacWordListOffset   = -1;
        //콤보 단어리스트
        
        this.ComboAttackType3 = new CWordCtrl();
        this.ComboAttackType4 = new CWordCtrl();
        this.ComboAttackType5 = new CWordCtrl();
        this.ComboAttackType6 = new CWordCtrl();
        
        //this.ComboAttackType_3_WordList = [];
       // this.ComboAttackType_4_WordList = [];
        //this.ComboAttackType_5_WordList = [];
        //this.ComboAttackType_6_WordList = [];

        this.lock           = false; //비밀방인가?
        this.password       = null;  //비밀방 패스워
        this.startDate      = null;
        this.endDate        = null;
        this.single         = false; //싱글플레이인지 판단
        this.back_ground    = -1;  //배경이미지
        this.play_time      = 0;  //초로 저장, 게임종료 해야할 시간

        this.PlayerA_NickName = "";
        this.PlayerB_NickName = "";

        this.Word_Level_1 = [];
        this.Word_Level_2 = [];
        this.Word_Level_3 = [];
        this.Word_Level_4 = [];
        this.Word_Level_5 = [];
        this.Word_Level_6 = [];
        this.WordLevel=[];
        this.gameResultJudgement = new GameResultJudgement();
        this.game_over_wait_time = 0;
        this.game_over_wait = false;
        this.isResult = false;
        this.isDraw = false;

        this.game_over_time = 0;

        this.EnterUsersNickName = [];

        
        
    }
    setisDraw(f){
        this.isDraw = f;
    }
    getisDraw(){
        return this.isDraw;
    }

    getisResult(){
        return this.isResult;
    }

    setisResult(f){
        this.isResult = f;
    }
    
    getGameOverWaitFlag(){
        return this.game_over_wait;
    }

    setGameOverWaitFlag(f){
        this.game_over_wait = f;
    }

    reset(){
        this.isDraw = false;
        this.Title      = null;
        // this.Number     = -1;
        this.Number     = '';
        this.State      = ROOM_STATE.INIT;
        
        this.Users.splice(0,this.Users.length);
        this.Users = [];
        this.GameStartTime = 0;

       // this.ComboAttacWordListOffset   = -1;
        
       // this.ComboAttackType_3_WordList = [];
       // this.ComboAttackType_4_WordList = [];
       // this.ComboAttackType_5_WordList = [];
       // this.ComboAttackType_6_WordList = [];   
        
        this.lock                       = false;
        this.password                   = null;
        this.single                     = false; //싱글플레이인지 판단

        this.ComboAttackType3.reset();
        this.ComboAttackType4.reset();
        this.ComboAttackType5.reset();
        this.ComboAttackType6.reset();

        this.startDate      = null;
        this.endDate        = null;

        this.back_ground        = -1;  //배경이미지
        this.play_time          = 0;  //초로 저장, 게임종료 해야할 시간
        this.PlayerA_NickName   = "";
        this.PlayerB_NickName   = "";

        this.Word_Level_1 = [];
        this.Word_Level_2 = [];
        this.Word_Level_3 = [];
        this.Word_Level_4 = [];
        this.Word_Level_5 = [];
        this.Word_Level_6 = [];

        this.WordLevel=[];

        /*for( var i = 0; i< this.LeaveUsers.length; i++){
            if(this.LeaveUsers[i] === null || this.LeaveUsers[i] === undefined) continue;
            if( this.LeaveUsers[i].getSocket() != -1){
                this.LeaveUsers[i].getSocket().disconnect(true);
            }
            this.LeaveUsers[i].reset();
            user_pool.withdraw(this.LeaveUsers[i]);
        }*/

        this.LeaveUsers         = [];       

        this.gameResultJudgement.reset();
        this.game_over_wait_time = 0;
        this.game_over_wait = false;
        this.isResult = false;
        this.game_over_time = 0;

        this.game_start_time = "";
        this.game_end_time = "";



        this.EnterUsersNickName.splice(0,this.EnterUsersNickName.length);
        
    }

    setEnterUsers(nick_name){
        this.EnterUsersNickName.push(nick_name);
    }

    getEnterOtherNickName(nick_name){
        for(var i=0; i < this.EnterUsersNickName.length; i++){
            if( this.EnterUsersNickName != nick_name){
                return this.EnterUsersNickName;
            }
        }

        return null;
    }

    setStartInit(){
        this.Word_Level_1.splice(0,this.Word_Level_1.length);
        this.Word_Level_2.splice(0,this.Word_Level_2.length);
        this.Word_Level_3.splice(0,this.Word_Level_3.length);
        this.Word_Level_4.splice(0,this.Word_Level_4.length);
        this.Word_Level_5.splice(0,this.Word_Level_5.length);
        this.Word_Level_6.splice(0,this.Word_Level_6.length);
    }

    setGameOverTime(){
        this.game_over_time = TIME.getTime();
        this.endDate = TIME.getYMD(this.game_over_time);
    }

    isTimeOver(){
        if( this.game_over_time === 0 ) return;
        let _pt = (this.game_over_time - this.GameStartTime)/1000;
        if( (_pt - this.play_time) >= 0 ){
            return true;
        }
        return false;
    }

    /**
     * 실제 플레이 타임......
     */
    getRealPlayTime(){
        let _pt = (this.game_over_time - this.GameStartTime)/1000;
        return _pt;
    }

    getGameOverTime(){
        return this.game_over_time;
    }
    setGameOverWaitTime(){
        this.game_over_wait_time = TIME.getTime();
    }

    getGameOverWaitTime(){
        return this.game_over_wait_time;
    }

    getGameResultJudgement(){
        return this.gameResultJudgement;
    }

    getLeaveUserNickName(nick_name){
        for(var i=0; i < this.LeaveUsers.length; i++){
            if(nick_name != this.LeaveUsers[i]){
                return this.LeaveUsers[i];
            }
        }

        return null;
    }
    /*getLeaveUser(nick_name){
        for(var i=0; i < this.LeaveUsers.length; i++){
            if(nick_name != this.LeaveUsers[i].getNickName()){
                return this.LeaveUsers[i];
            }
        }

        return null;
    }*/

    
    setWordlv(idx,level){
        this.WordLevel[idx]=level;
    }

    getWordlv(idx){
        return this.WordLevel[idx];        
    }

    setWordLevel(level,word){
        switch(level){
            case wlccfg.WORD_1:{                        
                this.Word_Level_1.push(word);
               // console.log('Word_Level_1 :'+this.Word_Level_1.length);
            }break;
            case wlccfg.WORD_2:{                       
                this.Word_Level_2.push(word);
               // console.log('Word_Level_2 :'+this.Word_Level_2.length);
            }break;
            case wlccfg.WORD_3:{                           
                this.Word_Level_3.push(word);
               // console.log('Word_Level_3 :'+this.Word_Level_3.length);
            }break;
            case wlccfg.WORD_4:{                          
                this.Word_Level_4.push(word);
               // console.log('Word_Level_4 :'+this.Word_Level_4.length);
            }break;
            case wlccfg.WORD_5:{                
                this.Word_Level_5.push(word);
                //console.log('Word_Level_5 :'+this.Word_Level_5.length);
            }break;
            case wlccfg.WORD_6:{                
                this.Word_Level_6.push(word);
                //console.log('Word_Level_6 :'+this.Word_Level_6.length);
            }break;
            
                            
        }
    }
    getWordLevel(level,idx){
        switch(level){
            case wlccfg.WORD_1:{                
                return this.Word_Level_1[idx];
            }
            case wlccfg.WORD_2:{       
                return this.Word_Level_2[idx];
            }
            case wlccfg.WORD_3:{                
                return this.Word_Level_3[idx];
            }
            case wlccfg.WORD_4:{                
                return this.Word_Level_4[idx];
            }
            case wlccfg.WORD_5:{
                return this.Word_Level_5[idx];
            }
            case wlccfg.WORD_6:{
                return this.Word_Level_6[idx];
            }
            
        }
    }


    /**
     * 결과창에 사용하기 위하여 닉네임을 따로 저장한다.
     * @param {* 플레이 닉네임} nn1 
     * @param {* 플레이 닉네임} nn2 
     */
    setPlayNickName(nn1,nn2){
        this.PlayerA_NickName = nn1;
        this.PlayerB_NickName = nn2;
    }


    //플레이 타임 세팅
    setPlayTime(pt){
        console.log('play time : '+pt);
        switch(pt){
            case 1:{
                console.log('set play time 1' );
                this.play_time = 60;
            }
            break;
            case 2:{
                console.log('set play time 2' );
                this.play_time = 120;
            }
            break;
            case 3:{
                console.log('set play time 3' );
                this.play_time = 180;
            }break;
            case 4:{
                console.log('set play time 4' );
                this.play_time = 240;
            }break;            
            case 5:{                
                console.log('set play time 5' );
                this.play_time = 300;
            }break;
            default:{
                console.log('set play time default' );
                this.play_time = 300;
            }break;            
        }        
    }
    //플레이 타임 가져옴
    getPlayTime(){
        return this.play_time;
    }
    /**
     * 
     * @param {*배경이미지 타입} bg 
     */
    setBackGround(bg){
        this.back_ground = bg;
    }

    /**
     * 배경이미지 가져옴
     */
    getBackGround(){
        return this.back_ground;
    }

    /**
     * 혼자 플레이 하는지 여부를 저장
     * @param {*혼자 플레이 옵션( 0 : 멀티플레이,1 : 혼자플레이)} f 
     */
    setSingle(f){
        this.single = f;
    }
    /**
     * 혼자 플레이 하는지 가져오는 함수
     */
    getSingle(){
        return this.single;
    }

    /**
     * 
     * @param {*비번방인지 여부 저장 ( 0 : 일반방, 1:비번방)} l 
     */
    setLock(l){
        this.lock = l;
    }
    /**
     * 비번방인지 여부를 가져오는 함수
     */
    getLock(){
        return this.lock;
    }
    //패스워드 저장
    setPassword(pw){
        this.password = pw;
    }
    //패스워트 가져오기
    getPassword(){
        return this.password;
    }

    //룸 타이틀 가져오기
    getTitle(){
        return this.Title;
    }
    //룸 타이틀 저장
    setTitle(title){
        this.Title = title;
    }
    //룸 넘버 가져오기
    getNumber(){
        return this.Number;
    }
    //룸 넘버 저장
    setNumber(num){
        // this.Number = parseInt(num);
        this.Number = num;
    }

    /**
     * 방장이 혼자 게임 준비 된 상태
     */
    setCreateGame(){
        this.State = ROOM_STATE.CREATE_ROOM;
    }

    /**
     * 게임이 만들어진 상태인지 체크하는 함수
     */
    isCreateGame(){
        if(this.State === ROOM_STATE.CREATE_ROOM){
            return true;
        }
        
        return false;
    }
    //게임이 시작하였는지 판단
    isGameStart() {
        if(this.State === ROOM_STATE.GAME_PAYING){
            return true;
        }
        return false;
        //return this.State === ROOM_STATE.GAME_PAYING ? true : false;
    }
    //게임이 종료되였는지 판단
    isGameOver(){
        if( this.State === ROOM_STATE.GAME_OVER ){
            return true;
        }
        return false;
        //return this.State === ROOM_STATE.GAME_OVER ? true : false;
    }
    //상태 얻기
    getState(){
        return this.State;
    }

    
    //게임시작준비가 되였는지 판단
    isGameStartReady(){
        if(this.Users.length <= 1 ) return false;
        if( this.Users[0].getReady() === true && 
            this.Users[1].getReady() === true){
                return true;
        }
        return false;
    }

    /**
     * 룸 입장 완료 처리 함수
     */
    setEnterFinished(){
        this.State = ROOM_STATE.ENTER_FINISHED;       
    }

    /**
     * 입장 완료 상황을 체크하는 함수
     */
    isEnterFinished(){
        return this.State === ROOM_STATE.ENTER_FINISHED? true : false;
    }

    /**
     * 유저 두명이 입장 완료가 되면 현재 상태가 됨.
     */
    setGamePlayReady(){
        this.State = ROOM_STATE.GAME_PLAY_READY;
    }
    /***
     * 게임 종료 30초전 상태로 만듬..
     */
    setPreGameOver(){
        this.State = ROOM_STATE.PRE_GAME_OVER;
    }

    /**
     * 1초뒤에 게임 종료 처리한다.
     */
    setGameOverWait(){
        this.State = ROOM_STATE.GAME_OVER_WAIT;
    }

    isGameOverWait(){
        if(this.State === ROOM_STATE.GAME_OVER_WAIT){
            return true;
        }
        return false;        
    }

    /*** 
     * 게임 종료 상태로 만듬..
    */
    setGameOver(){
        this.State = ROOM_STATE.GAME_OVER;
    }

    /**게임 레디 상태인지 확인하는 함수 */
    isGamePlayReady(){
        if(this.State === ROOM_STATE.GAME_PLAY_READY){
            return true;
        }
        return false;
    }

    /***
     * 게임 진행중인지 확인하는 함수
     */
     isGamePlaying(){
         if( this.State === ROOM_STATE.GAME_PAYING){
             return true;
         }
         return false;
     }

     /**
      * 
      * 게임 종료 30초전 상태인지 확인하는 함수
      */
      isPreGameOver(){
          if( this.State === ROOM_STATE.PRE_GAME_OVER){
              return true;
          }
          return false;
      }     



    /**
     * 유저가 방에서 떠날때 사용
     * @param {닉네임} user_name 
     */

    userLeave(user_name){
        console.log("room userLeave nickName : "+user_name);
        var user = this.findUser(user_name);
        if( user === null) {
            return false;
        }

        var _flag = false;
        var _num = -1;
        for( var i = 0; i< this.Users.length; i++){
            if( this.Users[i].getNickName() === user_name){
                _num = i;
				_flag = true;
                break;
            }
        }
        if(_flag){
            this.LeaveUsers.push(this.Users[_num].getNickName());
            this.Users.splice(_num,1);   
        }

        if( this.isGamePlaying() === true || this.isPreGameOver() === true){     
            this.send_game_over();       
        }else{
            console.log("userLeave : room state : "+this.getState());
            //"ENTER_FINISHED":2,
            //"GAME_PLAY_READY":3,
            if(this.State === ROOM_STATE.ENTER_FINISHED ||
            this.State === ROOM_STATE.GAME_PLAY_READY ){
                console.log('send game start .....'+this.Users.length);
                if( this.Users.length === 1 ){
                    console.log('send game start fail.....'+this.Users[0].getNickName());
                    //게임 시작하기 전에 유저가 나갈 경우 방을 폭파 시킴
                    // let _rdata={};
                    // _rdata.msg_idx  =   CS_PACKET_DEF.GAME_START_FAIL;                    
                    
                    // let _d = PacketEncode(_rdata);
                    // this.Users[0].getSocket().emit(CS_PACKET_DEF.GAME_START_FAIL,_d);
                }
            }
        }

        //GCServer에 유저 상태값 변경 통보
        let _rdata={};
        _rdata.msg_idx      = SS_PACKET_DEF.USER_GAME_LEAVE;
        _rdata.nick_name    = user_name;
        PUBSUB.on_publish(_rdata);

        // user_pool.withdraw(user);
              
        return true;
    }
    //유저가 게임을 떠날때
    userGameLeave(user_name){
        console.log("userGameLeave nickName : "+user_name);      
        
        var user = this.findUser(user_name);
        if( user === null) {
            return false;
        }

        var _flag = false;
        var _num = -1;
        //유저목록에 있는지 체크
        for( var i = 0; i< this.Users.length; i++){
            if( this.Users[i].getNickName() === user_name){
                _num = i;
				_flag = true;
                break;
            }
        }
        //유저목록에서 삭제
        if(_flag){
            this.LeaveUsers.push(this.Users[_num].getNickName());
            this.Users.splice(_num,1);   
        }
        //게임이 진행중이거나 종료 30초전 상태이면 게임종료
        if( this.isGamePlaying() === true || this.isPreGameOver() === true){     
            this.send_game_over();       
        }else{
            console.log("userGameLeave : room state : "+this.getState());
            //"ENTER_FINISHED":2,
            //"GAME_PLAY_READY":3,
            if(this.State === ROOM_STATE.ENTER_FINISHED ||
            this.State === ROOM_STATE.GAME_PLAY_READY ){
                console.log('send game start .....'+this.Users.length);
                if( this.Users.length === 1 ){
                    console.log('send game start fail.....'+this.Users[0].getNickName());
                }
            }
        }
        if(this.Users.length == 1){
            console.log('userGameLeave....send.')
            let _rdata={};
            _rdata.msg_idx = CS_PACKET_DEF.USER_GAME_LEAVE_ROOM;
            _rdata.leave_nick_name = user_name;
            let _d = PacketEncode(_rdata);
            this.Users[0].getSocket().emit(CS_PACKET_DEF.USER_GAME_LEAVE_ROOM,_d);
        }

        //GCServer에 유저 상태값 변경 통보
        let _rdata1={};
        _rdata1.msg_idx      = SS_PACKET_DEF.USER_GAME_LEAVE;
        _rdata1.nick_name    = user_name;
        PUBSUB.on_publish(_rdata1);

        
              
        return true;        
    }
    
    //룸에 유저 등록하기
    setUser(u){        
        this.Users.push(u);
        u.setIdx(this.Users.length-1);
        console.log('setUser User Name : '+u.getNickName());
        console.log('setUser idx : '+u.getIdx());
        console.log("setUser length : "+this.Users.length);
    }

    //유저 풀 비우기
    setUserClear(){
        console.log("1.setUserClear length : "+this.Users.length);
        this.pool = [];
        console.log("2.setUserClear length : "+this.Users.length);
    }

    /***
     * 인덱스로 유저 포인트 가져오기
     */
    getUserByIdx(idx){
        if(this.Users.length <= 0){
            return null;
        }
        return this.Users[idx];
    }
    /**
     * 닉네임으로 찾아서 유저 포인트 가져오기
     * @param {닉네임} nick_name 
     */
    getUserByNickName(nick_name){
        if(this.Users.length <= 0){
            return null;
        }

        for( var i=0; i < this.Users.length; i++){
            var _nn = this.Users[i].getNickName();
            if( _nn === nick_name){
                return this.Users[i];
            }

        }

        return null;
    }

    /**
     * 본인 닉네임으로 상대방 닉네임 가져오기
     * @param {*닉네임} nick_name 
     */
    getOtherUser(nick_name){
        if(this.Users.length <= 0){
            return null;
        }

        for( var i=0; i < this.Users.length; i++){
            if( this.Users[i].getNickName() != nick_name){
                return this.Users[i];
            }

        }

        return null;
    }

    /**
     * 게임 시작 시간 저장하는 함수
     * @param {*저장 할 게임 시작 시간 } t 
     */
    setGameStartTime(t){
        this.GameStartTime = t;
        this.startDate = TIME.getYMD(t);
    }
    //게임 시작 날짜 가져오기 함수
    getStartDate(){
        return this.startDate;
    }
    //게임 종료 날짜 가져오기 함수
    getEndDate(){
        return this.endDate;
    }

    /**
     * 게임 시작 시간 가져오기
     */
    getGameStartTime(){
        return this.GameStartTime;
    }

    /**
     * 
     * @param {*방 입장 완료 시간 저장하는 함수} t 
     */
    setEnterFinishedTime(t){
        this.EnterFinishTime = t;
    }
    //방 입장 완료 시간 가져오기 함수
    getEnterFinishedTime(){
        return this.EnterFinishTime;
    }
    //방 상태를 클리어로 저장
    setGameClear(){
        this.State = ROOM_STATE.GAME_CLEAR;
    }
    //방 상태가 클리어인가 판단
    isGameClear(){
        if( this.State === ROOM_STATE.GAME_CLEAR){
            return true;
        }

        return false;
    }


    /*enter_room(name){
        var user = new CUser(name);                
        this.Users.push(user);
        user.setIdx(this.Users.length-1);
        
        
    }*/

    /**
     * 룸안에 유저가 비어있는지 체크 하는 함수
     */
    isEmpty(){
        return this.Users.length>0 ? false : true;
    }

    /**
     * 닉네임으로 유저 포인트 가져오기
     * @param {*닉네임} user_name 
     */
    findUser(user_name){
        for( var i=0; i < this.Users.length; i++){
            let _usr = this.Users[i];
            if( _usr != null && _usr != undefined){
               if( this.Users[i].getNickName() === user_name){
                    return this.Users[i];
                }
            }
        }

        return null;
    }

    /**
     * 현재 룸에 있는 유저 수 가져오는 함수
     */

     getUserCount(){
         return this.Users.length;
     }     


    //콤보 공격 3음절 단어 목록 저장
    setComboAttackType3WordList(w){    
        //this.ComboAttackType_3_WordList = w;  
        this.ComboAttackType3.setWords(w);
    }
    //콤보 공격 3음절 단어 목록 가져오는 함수
    getComboAttackType3Word(){
        return this.ComboAttackType3.getWord();
    }
    //콤보 공격 4음절 단어 목록 저장
    setComboAttackType4WordList(w){
        //this.ComboAttackType_4_WordList = w;
        this.ComboAttackType4.setWords(w);
    }
    //콤보 공격 4음절 단어 목록 가져오는 함수
    getComboAttackType4Word(){ 
        return this.ComboAttackType4.getWord();
    }
    //콤보 공격 5음절 단어 목록 저장
    setComboAttackType5WordList(w){
        //this.ComboAttackType_5_WordList = w;
        this.ComboAttackType5.setWords(w);
    }
    //콤보 공격 5음절 단어 목록 가져오는 함수
    getComboAttackType5Word(){
        return this.ComboAttackType5.getWord()
    }
    //콤보 공격 6음절 단어 목록 저장
    setComboAttackType6WordList(w){
        //this.ComboAttackType_6_WordList = w;
        this.ComboAttackType6.setWords(w);
    }
    //콤보 공격 6음절 단어 목록 가져오는 함수
    getComboAttackType6Word(){
        return this.ComboAttackType6.getWord();
        //return this.ComboAttackType_6_WordList[offset];
    }    

    //해당 콥보 공격의 단어를 가져온다
    getComboAttackWord(received_combo_attack_type){

        var _t = received_combo_attack_type;
        var _w=null;
        

        switch(_t){
            case combo_attack_type.ATTACK_TYPE_3:
            {
                _w = this.getComboAttackType3Word();
            }
            break;
            case combo_attack_type.ATTACK_TYPE_4:
            {                
                _w = this.getComboAttackType4Word();
            }
            break;
            case combo_attack_type.ATTACK_TYPE_5:
            {
                _w = this.getComboAttackType5Word();
            }
            break;
            case combo_attack_type.ATTACK_TYPE_6:
            {                
                _w = this.getComboAttackType6Word();
            }
            break;
        }        

        return _w;
    }

    /**
     * 방 뽀개짐....
     */
    destroy(){    
        
        for( var i = 0; i < this.Users.length; i++ ){            
            let _s = this.Users[i].getSocket();   
            if(_s != -1){         
            _s.disconnect(true);}
            this.Users[i].reset();
            user_pool.withdraw(this.Users[i]);
            
        }
        this.reset();


    }

    /***게임시작 알림 */
    sendGameStart(){
        this.State = ROOM_STATE.GAME_PAYING;
        var _rdata = {
            msg_idx:CS_PACKET_DEF.GAME_START,
            result:0
        };

        let _d = PacketEncode(_rdata);

        for( var i = 0; i < this.Users.length; i++ ){

            this.Users[i].getSocket().emit(CS_PACKET_DEF.GAME_START,_d);
        }

        this.isResult = false;
    }
    /***게임 재시작 알림 */
    sendReGameStart(){     
        this.setEnterFinished(); //방을 재시작 할 수 있는 상태로 모두 입장한 상태로 변경한다.   

        var _rdata = {
            msg_idx:CS_PACKET_DEF.GAME_START,
            result:0
        };

        let _d = PacketEncode(_rdata);

        for( var i = 0; i < this.Users.length; i++ ){
            if(this.Users[i]){
                this.Users[i].reset2();                
                this.Users[i].getSocket().emit(CS_PACKET_DEF.RE_GAME_START,_d);
            }
        }
        this.gameResultJudgement.reset2();
    }
    /***게임 종료 알림 */
    send_game_over(){
        if( this.isGameOver()) return;
        this.setGameOver();
        var _rdata = {};
        _rdata.msg_idx  = CS_PACKET_DEF.GAME_OVER;
        _rdata.result   = CG_PACKET_ERR.SUCCESS;
        
        let _d = PacketEncode(_rdata);
        let _len = this.Users.length;
        //방 유저들에게 게임 종료 알림
        for( var i = 0; i < _len; i++){
            let _u = this.Users[i];
            if( _u != null && _u != undefined && _u.getSocket() != -1){
            _u.getSocket().emit(CS_PACKET_DEF.GAME_OVER,_d);
         }
        }

        this.setGameOverTime();
        //this.setGameOverWaitTime();
        //this.game_over_wait = true;
    }

    /***
     * 게임 30초전 알림
     */
    send_pre_game_over(){
        this.setPreGameOver();
        
        let _rdata={};
        _rdata.msg_idx  =   CS_PACKET_DEF.PRE_GAME_OVER;
        _rdata.result   =   CG_PACKET_ERR.SUCCESS;
        
        let _d = PacketEncode(_rdata);
        let _len = this.Users.length;
        //방 유저들에게 게임 30초전 알림
        for( var i = 0; i < _len; i++){
            if(this.Users[i]){                
                this.Users[i].getSocket().emit(CS_PACKET_DEF.PRE_GAME_OVER,_d);
            }
        }

        //방에서 유저 수 만큼 비워준다...
        
    }

    /**
     * 로비로 나가라고 통보
     */
    send_go_to_lobby(){
        this.setGameClear();
        let _rdata={};
        _rdata.msg_idx  =   CS_PACKET_DEF.GO_TO_LOBBY;        
        
        let _d = PacketEncode(_rdata);
        let _len = this.Users.length;

        console.log('send send_go_to_lobby...len '+_len);

        /**
         * 노드에서는 삭제를 하면 밀려서 내려간다 for loop 돌릴때 주의
         */

        for( var i = 0; i < _len; i++){
            
            if(this.Users[0] === null || this.Users[0] === undefined) continue;
            if( this.Users[0] && this.Users[0].getSocket() != -1){
                console.log('send send_go_to_lobby...'+this.Users[0].getNickName());
                this.Users[0].getSocket().emit(CS_PACKET_DEF.GO_TO_LOBBY,_d);
            }         

            this.userLeave(this.Users[0].getNickName());
        }
    }
    //재시작인가 판단
    isReStart(){
        if( this.Users.length != 2 ){
            return false;
        }
        if(this.Users[0].getRestart() === true && this.Users[1].getRestart() === true){
            return true;
        }
        return false;
    }
    
}


module.exports = CRoom;