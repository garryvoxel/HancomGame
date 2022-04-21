/**
 * 파일명: setcoinserver1/src/change_room_option.js
 * 게임방 설정 변경 메소드 정의
 * 메소드 파라미터 참조
 */
 const room_pool         = require('../RoomPool');
 const CG_PACKET_ERR     = require('../packet_err').CG_PACKET_ERR;
 
 /**
  * 룸 옵션을 변경 처리하는 함수
  * @param {* 룸번호} room_num
  * @param {* 방장 닉네임} nick_name
  * @param {* 방 제목} room_title
  * @param {* 게임 배경} back_ground
  * @param {* 비번 방인지 여부} lock
  * @param {* 패스워드} password
  * @param {* 플레이 타임} play_time
  */
 exports.change_room_option = function(room_num,nick_name,
                                     room_title,back_ground,lock,
                                     password,play_time,callback){
     //룸에서의 0번째 인덱스는 방장이다.
     var _room = room_pool.getRoom(room_num);
     if(_room === null){
         callback(CG_PACKET_ERR.CHANGE_ROOM_OPTION_ROOM_NULL);
         return;
     }
     var _usr = _room.getUserByIdx(0);
     if( _usr === null){
         callback(CG_PACKET_ERR.CHANGE_ROOM_OPTION_HOST_USER_NULL);
         return;        
     }
     //방장 닉네임이 다를때
     if( _usr.getNickName() != nick_name){
         callback(CG_PACKET_ERR.CHANGE_ROOM_OPTION_HOST_USER);
         return;
     }
     //룸 플레이 타임, 배경, 제목 설정
     _room.setPlayTime(parseInt(play_time));
     _room.setBackGround(parseInt(back_ground));
     _room.setTitle(room_title);
     if(lock == "1"){
         _room.setLock(true);
     }else{
         _room.setLock(false);
     }
     _room.setPassword(password);
 
     callback(CG_PACKET_ERR.SUCCESS);   
 
 }