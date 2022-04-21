/**
 * 파일명: setcoinserver3/src/check_room.js
 * CCheckRoom클래스 정의
 * 게임방 생성시간 체크하여 게임이 종료되었는지 확인
 */
 const svrcfg            = require('../config/server.json');
 const room_pool         = require('./RoomPool');
 class CCheckRoom{
     constructor(){        
     }
     
     start(){
         setInterval(this.work,svrcfg.CHECK_ROOM_TIME);
     }
     
     work(){
         room_pool.check_game_over();        
     }
 }
 
 
 let check_room = new CCheckRoom();
 
 module.exports = check_room;