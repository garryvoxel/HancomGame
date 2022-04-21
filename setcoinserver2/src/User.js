/**
 * 
 * CUser Class
이름,
소켓,
룸의 유저풀 위치,
게임 진행 준비 상태,
play 중 동전 높이,
play 가능한 하트 개수
play 중인 단어 offset
play 위한 단어 묶음
작업자 : 유광렬
 */

const combo_attack_type     = require('./define').COMBO_ATTACK_TYPYE;
const game_system           = require('../config/game.json');
const CWordCtrl             = require('./word_ctrl');
const WORD_LEVEL            = require('../config/word_level_ctrl.json');
function CUser(name){    
    this.Name       = name;
    this.CharacterType = -1;
    this.socket     = -1;
    this.Idx        = -1;
    this.isReady    = false;  //레디 상태
    this.CoinCount  = 0;  //현재 쌓여있는 동전 개수
    this.HeartCount = game_system.MAX_HEART_COUNT;  // 플레이 가능한 하트 개수
    this.Uuid       = 0;
    this.Session_id = "";
    this.ip = "";


    //this.WordOffset = 0;  // 플레이 중인 단어들 옵셋
    //this.Words      = []; // 플레이 단어들

    //this.Words      = new CWordCtrl();

    this.Lv1Words     = new CWordCtrl();
    this.Lv2Words     = new CWordCtrl();
    this.Lv3Words     = new CWordCtrl();
    this.Lv4Words     = new CWordCtrl();
    this.Lv5Words     = new CWordCtrl();
    this.Lv6Words     = new CWordCtrl();


    

    //콤보
    this.ComboAttackCount               = 0;
    //콤보 공격 받았는지 체크
    this.ReceivedComboAttack            = false; 
    this.ReceivedComboAttackType        = combo_attack_type.ATTACK_TYPE_INIT;    

    //단어 전달 시간
    this.NewWordSendTime = 0;

    //검증 단어 
    this.CheckWord                      = null;
    
    //점수
    this.Score                          = 0;

    //승
    this.Win                            = 0;
    //패
    this.Lose                           = 0;
    //무승부
    this.Draw                           = 0;
    //방번호
    this.RoomNumber                     = 0;
    this.Restart                        = false;

    this.word_level_1_offset            = 0;     
    this.word_level_2_offset            = 0;
    this.word_level_3_offset            = 0;
    this.word_level_4_offset            = 0;
    this.word_level_5_offset            = 0;
    this.word_level_6_offset            = 0;

    this.isUser                         = true;

    this.isEnd                          = false;
    this.isDisconnected                 = false;
    this.isWin                          = false;

    this.total_score                    = 0;

    this.point                          = 0;


}

CUser.prototype.setPoint = function(p){
    this.point = p;
}

CUser.prototype.getPoint = function(){
    return this.point;
}

CUser.prototype.setTotalScore = function(ts){
    this.total_score = ts;
}

CUser.prototype.getTotalScore = function(){
    return this.total_score;
}

CUser.prototype.setIp = function(_ip){
    this.ip = _ip;
}

CUser.prototype.getIp = function(){
    return this.ip;
}

CUser.prototype.setSessionId = function(sid){
    this.Session_id = sid;
}

CUser.prototype.getSessionId = function(){
    return this.Session_id;
}

CUser.prototype.setUUID = function(uuid){
    this.Uuid = uuid;
}

CUser.prototype.getUUID = function(){
    return this.Uuid;
}

CUser.prototype.setCharacterType = function(t){
    this.CharacterType = t;
}

CUser.prototype.getCharacterType = function(){
    return this.CharacterType;
}

//승
CUser.prototype.setWinCount = function(w){
    this.Win += w;
}

CUser.prototype.getWinCount = function(){
    return this.Win;
}

//패
CUser.prototype.setLoseCount = function(l){
    this.Lose += l;
}

CUser.prototype.getLoseCount = function(){
    return this.Lose;
}

//무승부
CUser.prototype.setDrawCount = function(d){
    this.Draw += d;
}

CUser.prototype.getDrawCount = function(){
    return this.Draw;
}

//점수
CUser.prototype.setScore = function(s){
    this.Score += s;
    console.log("setScore >> nickname : "+this.Name+" Score : "+s);
}

CUser.prototype.getScore = function(){
    return this.Score;
}
/**
 * 유저가 방을 나갈 경우 사용하는 함수
 */
CUser.prototype.reset = function(){
    console.log("CUser reset.......");
    this.Name       = null;    
    this.Idx        = -1;
    this.isReady    = false;
    this.CoinCount  = 0;
    this.HeartCount = game_system.MAX_HEART_COUNT;
    this.WordOffset = 0;
    //this.Words      = [];

    //콤보
    this.ReceivedComboAttack            = false;
    this.ReceivedComboAttackType        = combo_attack_type.ATTACK_TYPE_INIT;  
    this.NewWordSendTime                = 0;
    //this.isAbleComboAttack              = false; 
    this.CheckWord                      = null;
    this.ComboAttackCount               = 0;
    this.CoinTowerCount                 = 0;
    this.Score                          = 0;

    //승
    this.Win                            = 0;
    //패
    this.Lose                           = 0;
    //무승부
    this.Draw                           = 0;
    this.CharacterType                  = -1;
    this.Uuid                           = 0;
    this.Session_id                     = "";
    this.ip                             = "";

    this.RoomNumber                     = 0;    
    this.socket                         = -1;
    this.Restart                        = false;

    this.word_level_1_offset            = 0;     
    this.word_level_2_offset            = 0;
    this.word_level_3_offset            = 0;
    this.word_level_4_offset            = 0;
    this.word_level_5_offset            = 0;
    this.word_level_6_offset            = 0;
    

    this.isUser                         = true;
    this.isEnd                          = false;
    this.isDisconnected                 = false;
    this.isWin                          = false;
    
    this.total_score                    = 0;

    this.point                          = 0;

    //this.Words.reset();
}

CUser.prototype.setWin = function(f){
    this.isWin = f;
}

CUser.prototype.getWin = function(){
    return this.isWin;
}

CUser.prototype.setDisconnected = function(f){
    this.isDisconnected = f;
}

CUser.prototype.getDisconnected = function(){
    return this.isDisconnected;
}

CUser.prototype.setisEnd = function(f){
    this.isEnd = f;
}

CUser.prototype.getisEnd = function(){
    return this.isEnd;
}
/**
 * @param 플래그 f
 * 
 * 세션아이디가 게스트일 경우에만 사용하는 함수
 */
CUser.prototype.setIsUser = function(f){
    this.isUser = f;
}

CUser.prototype.getIsUser = function(){
    return this.isUser;
}
/**
 * 게임 재시작 플래그 저장하는 함수
 * @param {*게임 재시작 플래그} f 
 */
CUser.prototype.setRestart = function(f){
    this.Restart = f;
}

/**
 * 게임 재시작 플래그 가져오는 함수
 */
CUser.prototype.getRestart = function(){
    return this.Restart;
}

CUser.prototype.setRoomNumber = function(rn){
    this.RoomNumber = rn;
}

CUser.prototype.getRoomNumber = function(){
    return this.RoomNumber;
}




/**
 * game을 재 시작할 경우 사용하는 함수
 *  */
CUser.prototype.reset2 = function(){

    this.isReady    = false;
    this.CoinCount  = 0;
    this.HeartCount = 0;
    this.WordOffset = 0;
    this.Words      = [];

    //콤보
    this.ReceivedComboAttack            = false;
    this.ReceivedComboAttackType        = combo_attack_type.ATTACK_TYPE_INIT;
    this.NewWordSendTime                = 0;
    //this.isAbleComboAttack              = false; 
    this.CheckWord                      = null;
    this.ComboAttackCount               = 0;
    this.CoinTowerCount                 = 0;        

    this.Restart                        = false;
    this.Score                          = 0;

    this.word_level_1_offset            = 0;     
    this.word_level_2_offset            = 0;
    this.word_level_3_offset            = 0;
    this.word_level_4_offset            = 0;
    this.word_level_5_offset            = 0;
    this.word_level_6_offset            = 0;
    this.isEnd                          = false;
    this.isWin                          = false;

    this.total_score                    = 0;
    this.point                          = 0;


    //this.Words.reset();
}

CUser.prototype.getWordLevel_1_Offset = function(){
    return this.word_level_1_offset++;
}

CUser.prototype.getWordLevel_2_Offset = function(){
    return this.word_level_2_offset++;
}

CUser.prototype.getWordLevel_3_Offset = function(){
    return this.word_level_3_offset++;
}

CUser.prototype.getWordLevel_4_Offset = function(){
    return this.word_level_4_offset++;
}

CUser.prototype.getWordLevel_5_Offset = function(){
    return this.word_level_5_offset++;
}

CUser.prototype.getWordLevel_6_Offset = function(){
    return this.word_level_6_offset++;
}



CUser.prototype.setNickName = function(name){
    this.Name = name;
}

CUser.prototype.getNickName = function(){
    return this.Name;
}

CUser.prototype.setIdx = function(idx){
    this.Idx = idx;
}

CUser.prototype.getIdx = function(){
    return this.Idx;
}


CUser.prototype.setSocket= function(socket){
    this.socket = socket;    
}

/**
 * 소켓을 가져오는 함수
 */
CUser.prototype.getSocket = function(){
    return this.socket;
}

CUser.prototype.setReady = function(r){
    this.isReady = r;
}

CUser.prototype.getReady = function(){
    return this.isReady;
}

CUser.prototype.setCoinCount = function(c){   
    this.CoinCount = c; 
}

CUser.prototype.getCoinCount = function(){    
    return this.CoinCount
}

CUser.prototype.setHeartCount = function(c){
    this.HeartCount = c;
}

CUser.prototype.getHeartCount = function(){
    return this.HeartCount;
}

/*
CUser.prototype.setWordOffset = function(offset){
    this.WordOffset = offset;
}

CUser.prototype.getWordOffset = function(){    

    return this.WordOffset;
}
*/
CUser.prototype.getWord = function(l){
    switch(l){
        case WORD_LEVEL.WORD_1:{
            return this.Lv1Words.getWord();
        }
        case WORD_LEVEL.WORD_2:{
            return this.Lv2Words.getWord();
        }
        case WORD_LEVEL.WORD_3:{
            return this.Lv3Words.getWord();
        }        
        case WORD_LEVEL.WORD_4:{
            return this.Lv4Words.getWord();
        }
        case WORD_LEVEL.WORD_5:{
            return this.Lv5Words.getWord();
        }
        case WORD_LEVEL.WORD_6:{
            return this.Lv6Words.getWord();
        }
    }   

    console.log("CUser.prototype.getWord error level :"+l);
}

/**
 * @param {* 1음절 단어들을 저장하는 함수} w 
 */
CUser.prototype.setLv1Words = function(w){
    this.Lv1Words.setWords(w);
}

/**
 * @param {* 2음절 단어들을 저장하는 함수} w 
 */
CUser.prototype.setLv2Words = function(w){
    this.Lv2Words.setWords(w);
}

/**
 * @param {* 3음절 단어들을 저장하는 함수} w 
 */
CUser.prototype.setLv3Words = function(w){
    this.Lv3Words.setWords(w);
}

/**
 * @param {* 4음절 단어들을 저장하는 함수} w 
 */
CUser.prototype.setLv4Words = function(w){
    this.Lv4Words.setWords(w);
}

/**
 * @param {* 5음절 단어들을 저장하는 함수} w 
 */
CUser.prototype.setLv5Words = function(w){
    this.Lv5Words.setWords(w);
}

/**
 * @param {* 6음절 단어들을 저장하는 함수} w 
 */
CUser.prototype.setLv6Words = function(w){
    this.Lv6Words.setWords(w);
}
/*CUser.prototype.setWords = function(w){

    this.Words.setWords(w);
}*/

//CUser.prototype.getWord = function(i){
//    return this.Words[i];
//}

/***
 * 콤보 공격을 받았을 경우 사용하는 함수
 */
CUser.prototype.setReceivedComboAttack = function(f){
    this.ReceivedComboAttack = f;
}

/***
 * 콤보 공격을 받았는지 가져오는 함수
 */
CUser.prototype.getReceivedComboAttack = function(){
    return this.ReceivedComboAttack;
}


//공격 받은 콤보 타입
CUser.prototype.setReceivedComboAttackType = function(t){
    this.ReceivedComboAttackType = t;
}

//공격 받은 콤보 타입
CUser.prototype.getReceivedComboAttackType = function(){
    return this.ReceivedComboAttackType;
}

//새 단어 받은 시간 값 저장
CUser.prototype.setNewWordSendTime = function(t){
    this.NewWordSendTime = t;
}


//새 단어 받은 시간 값 가져오기
CUser.prototype.getNewWordSendTime = function(){
    return this.NewWordSendTime;
}

/*
//콤보 공격 가능 플래그를 설정 하는 함수
CUser.prototype.setIsAbleComboAttack = function(f){
    this.isAbleComboAttack = f;
}
*/

//콤보 공격 가능 플래그를 요청 함수
CUser.prototype.getIsAbleComboAttack = function(){
    if( parseInt(this.ComboAttackCount) >= 3 ){
        return true;
    }

    return false;
    //return this.isAbleComboAttack >= 3 ? true : false;
}

//검증할 단어 저장
CUser.prototype.setCheckWord = function(w){
    this.CheckWord = null;
    this.CheckWord = w;
}

//검증할 단어 가져오는 함수
CUser.prototype.getCheckWord = function(){
    return this.CheckWord;
}

//콤보 카운트 저장
CUser.prototype.setComboAttackCount = function(c) {
    this.ComboAttackCount = c;
}

CUser.prototype.getComboAttackCount = function(){
    return this.ComboAttackCount;
}

//공격 가능한 콤보 공격 타입
CUser.prototype.getComboAttackType = function(){
    if( parseInt(this.ComboAttackCount) === 3 ){
        return combo_attack_type.ATTACK_TYPE_3;
    }
    else if(parseInt(this.ComboAttackCount) === 4){
        return combo_attack_type.ATTACK_TYPE_4;
    }
    else if( parseInt(this.ComboAttackCount) === 5){
        return combo_attack_type.ATTACK_TYPE_5;
    }
    else if(parseInt(this.ComboAttackCount) === 6){
        return combo_attack_type.ATTACK_TYPE_6;
    }

    return combo_attack_type.ATTACK_TYPE_INIT;
}

CUser.prototype.getReceivedCombo
module.exports = CUser;

