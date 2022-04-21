/**
 * 파일명: setcoinserver2/src/word_ctrl.js
 * CWordCtrl 클래스 정의
 * 동전쌓기의 난이도에 따르는 단어 레벨 결정
 */
 const fs                    = require('fs');
 const TIME                  = require('../common/time');
 const WORD_LEVEL            = require('../config/word_level_ctrl.json');
 const gamecfg               = require('../config/game.json');
 class CWordCtrl{
 
     constructor(){
         this.words          = [];        
         this.offset         = 0;
         
     }
 
     reset(){
         this.offset = 0;
     }
 
     setWords(w){
         this.words = w;
     }
 
     setInitOffset(){
         this.offset = 0;
     }
 
     /**
      * 해당 단어를 가져온다.
      */
     getWord(){
         if( this.offset >= this.words){
             this.offset = 0;
         }
         return this.words[this.offset++];        
     }
 
     /**
      * 
      * @param {*게임을 시작한 시간을 받아서 현재 시간과 비교하여 현재 단어 레벨을 가져온다} t 
      */
     static getWordLevel(t){
         var _ct = TIME.getTime();
         var _lt = _ct - t;
         
         var got = parseInt(gamecfg.GAME_OVER_TIME);
         var gft = got - (_lt/1000);
         
         if((gft <= parseInt(WORD_LEVEL.TIME_1_LEVEL)) && (gft>= parseInt(WORD_LEVEL.TIME_2_LEVEL))){ //180초 ~ 150초
             return WORD_LEVEL.WORD_LEVEL_1;
         }else if((gft <= parseInt(WORD_LEVEL.TIME_2_LEVEL)) && (gft>= parseInt(WORD_LEVEL.TIME_3_LEVEL))){ //150초 ~ 120초
             return WORD_LEVEL.WORD_LEVEL_2;
         }else if((gft <= parseInt(WORD_LEVEL.TIME_3_LEVEL)) && (gft>= parseInt(WORD_LEVEL.TIME_4_LEVEL))){ //120초 ~ 90초
             return WORD_LEVEL.WORD_LEVEL_3;
         }else if((gft <= parseInt(WORD_LEVEL.TIME_4_LEVEL)) && (gft>= parseInt(WORD_LEVEL.TIME_5_LEVEL))){ //90초 ~ 60초
             return WORD_LEVEL.WORD_LEVEL_4;
         }else if((gft <= parseInt(WORD_LEVEL.TIME_5_LEVEL)) && (gft>= parseInt(WORD_LEVEL.TIME_6_LEVEL))){ //60초 ~ 30초
             return WORD_LEVEL.WORD_LEVEL_5;
         }else if((gft <= parseInt(WORD_LEVEL.TIME_6_LEVEL)) && (gft>= parseInt(WORD_LEVEL.TIME_7_LEVEL))){ //30초 ~ 15초
             return WORD_LEVEL.WORD_LEVEL_6;
         }
 
         return WORD_LEVEL.WORD_LEVEL_6;
     }   
 
     static getGosuWordLevel(t){
         var _ct = TIME.getTime();
         var _lt = _ct - t;
         
         var got = parseInt(gamecfg.GAME_OVER_TIME);
         var gft = got - (_lt/1000);
         
         if((gft <= parseInt(WORD_LEVEL.TIME_1_LEVEL)) && (gft>= parseInt(WORD_LEVEL.TIME_2_LEVEL))){ //180초 ~ 150초
             return WORD_LEVEL.WORD_LEVEL_4;
         }else if((gft <= parseInt(WORD_LEVEL.TIME_2_LEVEL)) && (gft>= parseInt(WORD_LEVEL.TIME_3_LEVEL))){ //150초 ~ 120초
             return WORD_LEVEL.WORD_LEVEL_4;
         }else if((gft <= parseInt(WORD_LEVEL.TIME_3_LEVEL)) && (gft>= parseInt(WORD_LEVEL.TIME_4_LEVEL))){ //120초 ~ 90초
             return WORD_LEVEL.WORD_LEVEL_4;
         }else if((gft <= parseInt(WORD_LEVEL.TIME_4_LEVEL)) && (gft>= parseInt(WORD_LEVEL.TIME_5_LEVEL))){ //90초 ~ 60초
             return WORD_LEVEL.WORD_LEVEL_4;
         }else if((gft <= parseInt(WORD_LEVEL.TIME_5_LEVEL)) && (gft>= parseInt(WORD_LEVEL.TIME_6_LEVEL))){ //60초 ~ 30초
             return WORD_LEVEL.WORD_LEVEL_5;
         }else if((gft <= parseInt(WORD_LEVEL.TIME_6_LEVEL)) && (gft>= parseInt(WORD_LEVEL.TIME_7_LEVEL))){ //30초 ~ 15초
             return WORD_LEVEL.WORD_LEVEL_6;
         }
 
         return WORD_LEVEL.WORD_LEVEL_6;        
     }
 
     static getWorldLevel(room,start_time){
         var _ct = TIME.getTime();
         var _lt = _ct - start_time;
         var got = room.getPlayTime();     
         var gft = got - (_lt/1000);   
 
         if((gft <= parseInt(WORD_LEVEL.TIME_1_LEVEL)) && (gft>= parseInt(WORD_LEVEL.TIME_2_LEVEL))){ //180초 ~ 150초
             return WORD_LEVEL.WORD_LEVEL_1;
         }else if((gft <= parseInt(WORD_LEVEL.TIME_2_LEVEL)) && (gft>= parseInt(WORD_LEVEL.TIME_3_LEVEL))){ //150초 ~ 120초
             return WORD_LEVEL.WORD_LEVEL_2;
         }else if((gft <= parseInt(WORD_LEVEL.TIME_3_LEVEL)) && (gft>= parseInt(WORD_LEVEL.TIME_4_LEVEL))){ //120초 ~ 90초
             return WORD_LEVEL.WORD_LEVEL_3;
         }else if((gft <= parseInt(WORD_LEVEL.TIME_4_LEVEL)) && (gft>= parseInt(WORD_LEVEL.TIME_5_LEVEL))){ //90초 ~ 60초
             return WORD_LEVEL.WORD_LEVEL_4;
         }else if((gft <= parseInt(WORD_LEVEL.TIME_5_LEVEL)) && (gft>= parseInt(WORD_LEVEL.TIME_6_LEVEL))){ //60초 ~ 30초
             return WORD_LEVEL.WORD_LEVEL_5;
         }else if((gft <= parseInt(WORD_LEVEL.TIME_6_LEVEL)) && (gft>= parseInt(WORD_LEVEL.TIME_7_LEVEL))){ //30초 ~ 15초
             return WORD_LEVEL.WORD_LEVEL_6;
         }
 
         return WORD_LEVEL.WORD_LEVEL_7;
     }
 
     /**
      * 
      * @param {*단어 레벨을 받아서 랜덤으로 단어 수위를 가져온다} l 
      */
 
     static getLevelWord(l){
         switch(l){
             case WORD_LEVEL.WORD_LEVEL_1:{
                 return get_1_WordLevel();                 
             }
             case WORD_LEVEL.WORD_LEVEL_2:{
                 return get_2_WordLevel();
             }
             case WORD_LEVEL.WORD_LEVEL_3:{
                 return get_3_WordLevel();
             }
             case WORD_LEVEL.WORD_LEVEL_4:{
                 return get_4_WordLevel();
             }
             case WORD_LEVEL.WORD_LEVEL_5:{
                 return get_5_WordLevel();
             }
             case WORD_LEVEL.WORD_LEVEL_6:{
                 return get_6_WordLevel();
             }
             case WORD_LEVEL.WORD_LEVEL_7:{
                 return get_7_WordLevel();
             }
         }        
     }
 
 }
 
 
 /**
  * 난위도 1 레벨 음절 찾기
  */
 function get_1_WordLevel(){
     var _r = TIME.getRandom();
     let _g1 = parseInt(WORD_LEVEL.LEVEL_1_1_WORD); //25%
     let _g2 = parseInt(WORD_LEVEL.LEVEL_1_2_WORD); //30%
     let _g3 = parseInt(WORD_LEVEL.LEVEL_1_3_WORD); //25%
     let _g4 = parseInt(WORD_LEVEL.LEVEL_1_4_WORD); //13%
     let _g5 = parseInt(WORD_LEVEL.LEVEL_1_5_WORD); //5%
     //let _g6 = parseInt(WORD_LEVEL.LEVEL_1_6_WORD); //2%
 
 
     if((_r>=0) &&(_r<= _g1)){ //0 ~ 25%     
         return WORD_LEVEL.WORD_1;       
     }else if((_r>_g1) &&(_r<= (_g1 + _g2))){ // 25% ~ 55%            
         return WORD_LEVEL.WORD_2;
     }else if((_r>(_g1+_g2)) &&(_r<= (_g1 + _g2 + _g3))){ //55% ~ 80%
         return WORD_LEVEL.WORD_3;
     }else if((_r>(_g1+_g2+_g3)) &&(_r<= (_g1 + _g2 + _g3 + _g4))){ //80% ~93%
         return WORD_LEVEL.WORD_4;
     }else if((_r>(_g1+_g2+_g3+_g4)) &&(_r<= (_g1 + _g2 + _g3 + _g4+_g5))){ //93% ~98%
         return WORD_LEVEL.WORD_5;
     }
 
     return WORD_LEVEL.WORD_6;       
 }
 
 /**
  * 난위도 2 레벨 음절 찾기
  */
 function get_2_WordLevel(){
     var _r = TIME.getRandom();
     let _g1 = parseInt(WORD_LEVEL.LEVEL_2_1_WORD); //15%
     let _g2 = parseInt(WORD_LEVEL.LEVEL_2_2_WORD); //30%
     let _g3 = parseInt(WORD_LEVEL.LEVEL_2_3_WORD); //25%
     let _g4 = parseInt(WORD_LEVEL.LEVEL_2_4_WORD); //17%
     let _g5 = parseInt(WORD_LEVEL.LEVEL_2_5_WORD); //8%
     //let _g6 = parseInt(WORD_LEVEL.LEVEL_2_6_WORD); //5%
 
 
     if((_r>=0) &&(_r<= _g1)){ //0 ~ 25%     
         return WORD_LEVEL.WORD_1;       
     }else if((_r>_g1) &&(_r<= (_g1 + _g2))){ // 25% ~ 55%            
         return WORD_LEVEL.WORD_2;
     }else if((_r>(_g1+_g2)) &&(_r<= (_g1 + _g2 + _g3))){ //55% ~ 80%
         return WORD_LEVEL.WORD_3;
     }else if((_r>(_g1+_g2+_g3)) &&(_r<= (_g1 + _g2 + _g3 + _g4))){ //80% ~93%
         return WORD_LEVEL.WORD_4;
     }else if((_r>(_g1+_g2+_g3+_g4)) &&(_r<= (_g1 + _g2 + _g3 + _g4+_g5))){ //93% ~98%
         return WORD_LEVEL.WORD_5;
     }
 
     return WORD_LEVEL.WORD_6;       
 }    
 
 /**
  * 난위도 3 레벨 음절 찾기
  */
 function get_3_WordLevel(){
     var _r = TIME.getRandom();
     let _g1 = parseInt(WORD_LEVEL.LEVEL_3_1_WORD); //13%
     let _g2 = parseInt(WORD_LEVEL.LEVEL_3_2_WORD); //18%
     let _g3 = parseInt(WORD_LEVEL.LEVEL_3_3_WORD); //25%
     let _g4 = parseInt(WORD_LEVEL.LEVEL_3_4_WORD); //20%
     let _g5 = parseInt(WORD_LEVEL.LEVEL_3_5_WORD); //18%
     //let _g6 = parseInt(WORD_LEVEL.LEVEL_3_6_WORD); //6%
 
 
     if((_r>=0) &&(_r<= _g1)){ //0 ~ 25%     
         return WORD_LEVEL.WORD_1;       
     }else if((_r>_g1) &&(_r<= (_g1 + _g2))){ // 25% ~ 55%            
         return WORD_LEVEL.WORD_2;
     }else if((_r>(_g1+_g2)) &&(_r<= (_g1 + _g2 + _g3))){ //55% ~ 80%
         return WORD_LEVEL.WORD_3;
     }else if((_r>(_g1+_g2+_g3)) &&(_r<= (_g1 + _g2 + _g3 + _g4))){ //80% ~93%
         return WORD_LEVEL.WORD_4;
     }else if((_r>(_g1+_g2+_g3+_g4)) &&(_r<= (_g1 + _g2 + _g3 + _g4+_g5))){ //93% ~98%
         return WORD_LEVEL.WORD_5;
     }
 
     return WORD_LEVEL.WORD_6;       
 }  
 /**
  * 난위도 4 레벨 음절 찾기
  */
 function get_4_WordLevel(){
     var _r = TIME.getRandom();
     let _g1 = parseInt(WORD_LEVEL.LEVEL_4_1_WORD); //10%
     let _g2 = parseInt(WORD_LEVEL.LEVEL_4_2_WORD); //15%
     let _g3 = parseInt(WORD_LEVEL.LEVEL_4_3_WORD); //20%
     let _g4 = parseInt(WORD_LEVEL.LEVEL_4_4_WORD); //25%
     let _g5 = parseInt(WORD_LEVEL.LEVEL_4_5_WORD); //20%
     //let _g6 = parseInt(WORD_LEVEL.LEVEL_4_6_WORD); //10%
 
 
     if((_r>=0) &&(_r<= _g1)){ //0 ~ 25%     
         return WORD_LEVEL.WORD_1;       
     }else if((_r>_g1) &&(_r<= (_g1 + _g2))){ // 25% ~ 55%            
         return WORD_LEVEL.WORD_2;
     }else if((_r>(_g1+_g2)) &&(_r<= (_g1 + _g2 + _g3))){ //55% ~ 80%
         return WORD_LEVEL.WORD_3;
     }else if((_r>(_g1+_g2+_g3)) &&(_r<= (_g1 + _g2 + _g3 + _g4))){ //80% ~93%
         return WORD_LEVEL.WORD_4;
     }else if((_r>(_g1+_g2+_g3+_g4)) &&(_r<= (_g1 + _g2 + _g3 + _g4+_g5))){ //93% ~98%
         return WORD_LEVEL.WORD_5;
     }
 
     return WORD_LEVEL.WORD_6;       
 }    
 
 /**
  * 난위도 5 레벨 음절 찾기
  */
 function get_5_WordLevel(){
     var _r = TIME.getRandom();
     let _g1 = parseInt(WORD_LEVEL.LEVEL_5_1_WORD); //5%
     let _g2 = parseInt(WORD_LEVEL.LEVEL_5_2_WORD); //8%
     let _g3 = parseInt(WORD_LEVEL.LEVEL_5_3_WORD); //15%
     let _g4 = parseInt(WORD_LEVEL.LEVEL_5_4_WORD); //30%
     let _g5 = parseInt(WORD_LEVEL.LEVEL_5_5_WORD); //25%
     //let _g6 = parseInt(WORD_LEVEL.LEVEL_2_6_WORD); //17%
 
 
     if((_r>=0) &&(_r<= _g1)){ //0 ~ 25%     
         return WORD_LEVEL.WORD_1;       
     }else if((_r>_g1) &&(_r<= (_g1 + _g2))){ // 25% ~ 55%            
         return WORD_LEVEL.WORD_2;
     }else if((_r>(_g1+_g2)) &&(_r<= (_g1 + _g2 + _g3))){ //55% ~ 80%
         return WORD_LEVEL.WORD_3;
     }else if((_r>(_g1+_g2+_g3)) &&(_r<= (_g1 + _g2 + _g3 + _g4))){ //80% ~93%
         return WORD_LEVEL.WORD_4;
     }else if((_r>(_g1+_g2+_g3+_g4)) &&(_r<= (_g1 + _g2 + _g3 + _g4+_g5))){ //93% ~98%
         return WORD_LEVEL.WORD_5;
     }
 
     return WORD_LEVEL.WORD_6;       
 }      
 
 /**
  * 난위도 6 레벨 음절 찾기
  */
 function get_6_WordLevel(){
     var _r = TIME.getRandom();
     let _g1 = parseInt(WORD_LEVEL.LEVEL_6_1_WORD); //3%
     let _g2 = parseInt(WORD_LEVEL.LEVEL_6_2_WORD); //5%
     let _g3 = parseInt(WORD_LEVEL.LEVEL_6_3_WORD); //8%
     let _g4 = parseInt(WORD_LEVEL.LEVEL_6_4_WORD); //27%
     let _g5 = parseInt(WORD_LEVEL.LEVEL_6_5_WORD); //32%
     //let _g6 = parseInt(WORD_LEVEL.LEVEL_2_6_WORD); //25%
 
 
     if((_r>=0) &&(_r<= _g1)){ //0 ~ 25%     
         return WORD_LEVEL.WORD_1;       
     }else if((_r>_g1) &&(_r<= (_g1 + _g2))){ // 25% ~ 55%            
         return WORD_LEVEL.WORD_2;
     }else if((_r>(_g1+_g2)) &&(_r<= (_g1 + _g2 + _g3))){ //55% ~ 80%
         return WORD_LEVEL.WORD_3;
     }else if((_r>(_g1+_g2+_g3)) &&(_r<= (_g1 + _g2 + _g3 + _g4))){ //80% ~93%
         return WORD_LEVEL.WORD_4;
     }else if((_r>(_g1+_g2+_g3+_g4)) &&(_r<= (_g1 + _g2 + _g3 + _g4+_g5))){ //93% ~98%
         return WORD_LEVEL.WORD_5;
     }
 
     return WORD_LEVEL.WORD_6;       
 }  
 
 /**
  * 난위도 7 레벨 음절 찾기
  */
 function get_7_WordLevel(){
     var _r = TIME.getRandom();
     let _g1 = parseInt(WORD_LEVEL.LEVEL_7_1_WORD); //2%
     let _g2 = parseInt(WORD_LEVEL.LEVEL_7_2_WORD); //3%
     let _g3 = parseInt(WORD_LEVEL.LEVEL_7_3_WORD); //5%
     let _g4 = parseInt(WORD_LEVEL.LEVEL_7_4_WORD); //25%
     let _g5 = parseInt(WORD_LEVEL.LEVEL_7_5_WORD); //30%
     //let _g6 = parseInt(WORD_LEVEL.LEVEL_2_6_WORD); //35%
 
 
     if((_r>=0) &&(_r<= _g1)){ //0 ~ 25%     
         return WORD_LEVEL.WORD_1;       
     }else if((_r>_g1) &&(_r<= (_g1 + _g2))){ // 25% ~ 55%            
         return WORD_LEVEL.WORD_2;
     }else if((_r>(_g1+_g2)) &&(_r<= (_g1 + _g2 + _g3))){ //55% ~ 80%
         return WORD_LEVEL.WORD_3;
     }else if((_r>(_g1+_g2+_g3)) &&(_r<= (_g1 + _g2 + _g3 + _g4))){ //80% ~93%
         return WORD_LEVEL.WORD_4;
     }else if((_r>(_g1+_g2+_g3+_g4)) &&(_r<= (_g1 + _g2 + _g3 + _g4+_g5))){ //93% ~98%
         return WORD_LEVEL.WORD_5;
     }
 
     return WORD_LEVEL.WORD_6;       
 }  
 
 
 module.exports = CWordCtrl;