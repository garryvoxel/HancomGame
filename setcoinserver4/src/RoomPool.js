/**
 * 파일명: setcoinserver4/src/RoomPool.js
 * 게임방Pool 클래스 정의 
 * 동전쌓기에 생성된 게임방 목록
 * 최대로 생성가능한 게임방 수 제한
 * 게임방 삭제 및 추가 , 검색 , 자동입장 , 사용중인 게임방 갯수등 게임방 관리 메소드 정의
 */
 const config 				= require('../config/server.json')[process.env.NODE_ENV || 'development'];
 const gamecfg               = require('../config/game.json');
 const Room 					= require('./Room.js');
 const return_room_number   	= require('./call_apiserver').return_room_number;
 const clear_room_info		= require('./call_apiserver').clear_room_info;
 const TIME 					= require('../common/time');
 
 const setcoinserverRedisApiHandler = require('axios');
 setcoinserverRedisApiHandler.defaults.baseURL = config.REDIS_NEW_MODULE;
 setcoinserverRedisApiHandler.defaults.headers.post['Content-Type'] = 'application/json';
 
 class CRoomPool{
	 constructor(){		
		 this.pool 			= [];
		 this.usedpool 		=[];
		 this.MAX_ROOM_COUNT = 0;	
 
	 }
 
	 //초기화
	 init(){
		 console.log('ROOM_MAX : '+config.ROOM_MAX);
		 var _room_max = parseInt(config.ROOM_MAX);
		 for( var i = 0; i < _room_max; i++){
			 this.pool.push(new Room(null,null));
		 }
 
		 this.MAX_ROOM_COUNT = _room_max;
	 }
	 //유저풀이 비였는가 판단
	 isEmpty(){
		 return this.MAX_ROOM_COUNT === this.usedpool.length ? true : false;
	 }
 
 
	 /**
	  * queue에서 room 하나 가져오기
	  */
	 get(){
		 return this.pool.shift();
	 }
	 //room 저장
	 set(r){
		 this.pool.push(r);
	 }
	 //RoomPool에서 가져 올수 있는 룸 갯수를 가져오는 함수
	 getSize(){
		 return this.pool.length;
	 }
 
	 //사용중인 룸을 저장
	 setUsedRoom(r){
		 this.usedpool.push(r);
	 }
 
	 //사용중인 룸 갯수를 가져오는 함수
	 getUsedRoomSize(){
		 return this.usedpool.length;
	 }
	 //사용중인 룸 가져오는 함수
	 getUsedRoom(i){
		 return this.usedpool[i];
	 }
 
 
	 /**
	  * 룸번호로 룸 포인트 가져오기
	  * @param {*룸번호} room_number 
	  */
	 getRoom(room_number){
		 // let _rn = parseInt(room_number);
		 let _rn = room_number;
		 for( var i = 0; i < this.usedpool.length; i++){
			 var _r = this.usedpool[i];
			 if(_rn == _r.getNumber()){	
				 return _r;			
			 }
		 }
		 return null;
	 }
 
	 /**
	  * 자동입장에서 사용하는 함수로 입장가능한 룸을 하나 가져온다.
	  */
	 getRoomByAutoEnter(){
		 for( var i = 0; i < this.usedpool.length; i++){
			 var _r = this.usedpool[i];
			 if( _r.getLock() ) continue;
			 return _r;
		 }
 
		 return null;
	 }
 
	 /*** 
	  * room 포인터 반환
	  * 
	 */
	 withdraw(room){
		 if( !room.isEmpty() ) return false;
		 
		 
		 var _rn = room.getNumber();
		 
		 var _num = -1;
		 var _flag = false;
		 
		 for( var i = 0; i < this.usedpool.length; i++ ){
			 if( room.getNumber() === this.usedpool[i].getNumber()){
				 _num = i;
				 _flag = true;
				 break;
			 }
		 }
		 if( _flag ){
			 //풀 비워둔다
			 this.usedpool.splice(_num,1);
			 room.reset();
			 this.return_room_number(_rn);
		 }		
		 
		 room.reset();
		 this.pool.push(room);
		 console.log('release room count : '+this.usedpool.length);
		 return true;		
	 }
 
	 /**
	  * 룽번호 반환하기
	  * @param {* 룸번호} room_number 
	  */
	 return_room_number(room_number){
		 return_room_number(room_number,()=>{});
		 clear_room_info(room_number,()=>{});
	 }
 
	 /**
	  * 게임 종료 체크
	  */
	 check_game_over(){
		 let _ct = TIME.getTime();
		 let _len = this.usedpool.length;
		 if( _len > 0 ) {
			 // console.log('Room Count ...' + _len);
		 }
		 //console.log(this.usedpool);
		 for( let i = 0; i < _len; i++){
			 let _r = this.usedpool[i];			
			 if( _r === null || _r === undefined) continue;
			 if( _r != null&&_r != undefined &&_r.isEmpty()){
				 //console.log('room number '+_r.getNumber());
				 if(_r.isEmpty()){
					 console.log('room is empty....delete ');
					 this.withdraw(_r);
				 }
				 continue;
			 }			
			 let _st;
			 try{
			 //	console.log('room_number'+ _r.getNumber());
				 _st = _r.getGameStartTime();							
				 if( _r.isGamePlaying()){
					 //방뽀개짐...
					 if(_r.getUserCount() == 1){
						 //게임 중 유저가 나간 방..
						 _r.send_game_over();
						 continue;
					 }else if(_r.getUserCount() <= 0){
						 //비어 있는 방
						 this.withdraw(_r);
						 continue;
					 }else{
						 //게임 30초전 체크
						 //console.log('pre_game_over...start :'+_r.getNumber()+' play time : '+_r.getPlayTime());
					 //	console.log('_ct : '+_ct+' _st : '+_st);
						 let _t = (_ct - _st)/1000;
						 //console.log('pre_game_over...start 111 :'+_r.getNumber()+' play time : '+_r.getPlayTime() +' _t : '+_t);
						 if( _t >= (_r.getPlayTime()-30)){
							 _r.send_pre_game_over();					
							 console.log('pre_game_over...send :'+_r.getNumber()+' play time : '+_r.getPlayTime());
							 continue;
						 }
					 }
					 
				 }
			 }catch(e){
				 console.log("isGameplaying.....e"+e);
			 }
			 try{
				 if(_r.isPreGameOver()){
					 console.log('isPreGameOver : '+_r.getState());
					 //게임 종료 체크				
					 let _t = (_ct - _st)/1000;		
					 console.log("pre gameover  t : "+_t);
					 console.log("pre gameover  pt : "+_r.getPlayTime());
					 if( _t >= _r.getPlayTime()){
						 console.log("send_game_over...room_number"+_r.getNumber());
						 _r.send_game_over();
						 //_r.setGameOverWait();
						 continue					
					 }
				 }
			 }catch(e){
				 console.log('isPreGameOver e : '+e);
			 }
 
			 if(_r.isGameOver()){				
				 console.log('GameOver : '+_r.getState());
 
				 let got = _r.getGameOverTime();
 
				 //let _t = (_ct - _st)/1000;
				 let _t = (_ct - got)/1000;
 
				 console.log('gameover t : '+_t);
				 //console.log('gameover st : '+_st);
 
				 let _vt = parseInt(gamecfg.GAME_OVER_WAIT_TIME) * 1000;
				 console.log('game over vt :'+_vt);
				 console.log('1....t : '+(_st +  _vt));
				 console.log('1111.....'+(_r.getPlayTime() + parseInt(gamecfg.GAME_OVER_WAIT_TIME)));
				 if( _t >= parseInt(gamecfg.GAME_OVER_WAIT_TIME)){					
					 console.log("isGameOver...room_number "+_r.getNumber()+" send go_to_lobby");
					 //_r.destroy();
				 // 클라 요청으로 게임끝낫후 로비로 보네는 패킷을 삭제합니다 2019.07.22
				 //	_r.send_go_to_lobby();
					 continue;
				 }
			 }
 
			 if(_r.isGameClear()){
				 
				 let _t = (_ct - _st)/1000;				
 
				 let _vt = parseInt(gamecfg.GAME_OVER_WAIT_TIME) * 1000;
				 if( _t >= (((_r.getPlayTime() + _vt)/1000) + gamecfg.GO_TO_LOBBY)){
					 console.log('isGameClear  : '+_r.getNumber());
					 this.withdraw(_r);
				 }
			 }
		 }
	 }
 
	 check_ghost_room(){	
	 }
 
	 /**
	  * new added
	  * @param {*} host_name 
	  * @param {*} ip 
	  * @param {*} server_idx 
	  * @param {*} room_number 
	  * @param {*} title 
	  * @param {*} is_lock 
	  * @param {*} password 
	  * @param {*} is_single 
	  * @param {*} back_ground 
	  * @param {*} play_time 
	  * @param {*} nick_name 
	  */
	 async setUsedRoom1(host_name, ip, server_idx, room_number, title, is_lock, password, is_single, back_ground, play_time, nick_name, socket, session_id) {		
		 try {
			 let ret = await setcoinserverRedisApiHandler.post('/setcoinserver/create_room', {
				 room_number: room_number,  // 게임방 번호
				 title: title,
				 is_lock: is_lock,
				 password: password,       // 비번
				 is_single: is_single,
				 back_ground: back_ground,
				 play_time: play_time,
				 nick_name: nick_name,
				 ip: ip,
				 server_idx: server_idx,
				 host_name: host_name,
				 socket: socket,
				 session_id: session_id
			 });
 
			 if(ret.data.ERR_CODE == 0)
				 return true;
			 return false;
		 }
		 catch(err22) {
			 console.log("[게임방생성 오류1]======", err22);
			 return false;	
		 }
	 }
 
	 /**
	  * new added
	  * @param {*} room_number 
	  */
	 async getRoomInfo(room_number) {
		 try {
			 let ret = await setcoinserverRedisApiHandler.post('/setcoinserver/get_room_info', {
				 room_number: room_number,
				 server_idx: config.SERVER_IDX
			 });
			 if(ret.data.ERR_CODE == 0)
				 return ret.data.DATA;
			 return null;
		 }
		 catch(err22) {
			 console.log("[게임방 상태 체크]========", err22);
			 return null;
		 }
	 }
 
	 /**
	  * new added
	  * @param {*} room_number 
	  */
	 async getMaster(room_number) {
		 try {
			 let ret = await setcoinserverRedisApiHandler.post('/setcoinserver/get_master', {
				 room_number: room_number,
				 server_idx: config.SERVER_IDX
			 });
			 if(ret.data.ERR_CODE == 0)
				 return ret.data.DATA;
			 return null;
		 }
		 catch(err22) {
			 return null;
		 }
	 }
 
	 /**
	  * new added
	  * @param {*} socket 
	  */
	 async getUserBySessionId(session_id, room_number) {
		 try {
			 
			 let ret = await setcoinserverRedisApiHandler.post('/setcoinserver/get_user_info_by_session_id', {
				 server_idx: config.SERVER_IDX,
				 session_id: session_id,
				 room_number: room_number
			 });
			 if(ret.data.ERR_CODE == 0)
				 return ret.data.DATA;
			 return null;
		 }
		 catch(err22) {
			 return null;
		 }
	 }
	 
	 async getUserBySocket(socket) {
		 try { 
			 let ret = await setcoinserverRedisApiHandler.post('/setcoinserver_game/get_user_by_socket', {
				 server_idx: config.SERVER_IDX,
				 socket: socket
			 });
			 if(ret.data.ERR_CODE == 0)
				 return ret.data.DATA;
			 
			 return null;
		 }
		 catch(err22) {
			 return null;
		 }
	 }
	 
	 async getUserDetailBySessionId(session_id) {
		 try {
			 let ret = await setcoinserverRedisApiHandler.post('/setcoinserver/get_user_detail_by_session_id', {
				 server_idx: config.SERVER_IDX,
				 session_id: session_id
			 });
			 if(ret.data.ERR_CODE == 0)
				 return ret.data.DATA;
			 return null;
		 }
		 catch(err22) {
			 return null;
		 }
	 }
 
	 async enterRoom(room_number, session_id) {
		 try {
			 let ret = await setcoinserverRedisApiHandler.post('/setcoinserver/enter_room', {
				 server_idx: config.SERVER_IDX,
				 room_number: room_number,
				 session_id: session_id
			 });
			 if(ret.data.ERR_CODE == 0)	
				 return true;
			 return false;
		 }
		 catch(err22) {
			 return false;
		 }
	 }
 
	 async changeRoomOption(room_number, room_title, is_lock, play_time, back_ground, session_id, password) {
		 try {
			 let ret = await setcoinserverRedisApiHandler.post('/setcoinserver/change_room_option', {
				 room_number: room_number,
				 room_title: room_title,
				 is_lock: is_lock,
				 play_time: play_time,
				 back_ground: back_ground,
				 server_idx: config.SERVER_IDX,
				 session_id: session_id,
				 password: password
			 });
 
			 if(ret.data.ERR_CODE != 0) 
				 return 0;
			 if(ret.data.ERR_CODE == 0 && !ret.data.HOST_CHECK)
				 return 2;
			 return 1;
		 }
		 catch(err22) {
			 return 0;
		 }
	 }
 
	 async userReset2(session_id) {
		 try {
			 let ret = await setcoinserverRedisApiHandler.post('/setcoinserver/user_reset2', {
				 session_id: session_id,
				 server_idx: config.SERVER_IDX
			 });
			 
			 if(ret.data.ERR_CODE != 0)
				 return false;
			 return true;
		 }
		 catch(err22) {
			 return false;
		 }
	 }
 
	 async setReady(session_id, _ready) {
		 try {
			 let ret = await setcoinserverRedisApiHandler.post('/setcoinserver/set_ready', {
				 session_id: session_id,
				 server_idx: config.SERVER_IDX,
				 ready: _ready
			 });
 
			 if(ret.data.ERR_CODE != 0)
				 return false;
			 return true;
		 }
		 catch(err22) {
			 return false;
		 }
	 }
	 
	 async isGameStartReady(room_number, session_id) {
		 try {
			 let ret = await setcoinserverRedisApiHandler.post('/setcoinserver/is_game_start_ready', {
				 room_number: room_number,
				 server_idx: config.SERVER_IDX,
				 session_id: session_id
			 });
			 if(ret.data.ERR_CODE != 0)
				 return false;
			 return ret.data.IS_GAME_START_READY;
		 }
		 catch(err22) {
			 return false;
		 }
	 }
 
	 async roomGameReady(room_number, session_id) {
		 try {
			 let ret = await setcoinserverRedisApiHandler.post('/setcoinserver_game/room_game_ready', {
				 server_idx: config.SERVER_IDX,
				 room_number: room_number,
				 session_id: session_id
			 });
 
			 if(ret.data.ERR_CODE != 0)
				 return null;
			 return ret.data.DATA;
		 }
		 catch(err22) {
			 return null;
		 }
	 }
 
	 async getOtherUser(room_number, session_id) {
		 try {
			 let ret = await setcoinserverRedisApiHandler.post('/setcoinserver/get_other_user', {
				 server_idx: config.SERVER_IDX,
				 room_number: room_number,
				 session_id: session_id
			 });
			 if(ret.data.ERR_CODE != 0)
				 return null;
			 return ret.data.DATA;
		 }
		 catch(err22) {
			 return null;
		 }
	 }
 
	 async setRoomDetailInfo(room_number, room_detail_info) {
		 try {
			 let ret = await setcoinserverRedisApiHandler.post('/setcoinserver/set_info_room', {
				 server_idx: config.SERVER_IDX,
				 room_number: room_number,
				 room_detail_info: room_detail_info
			 });
			 
			 if(ret.data.ERR_CODE != 0)
				 return false;
			 return true;
		 }
		 catch(err22) {
			 return false;
		 }
	 }
 
	 async setUserDetailInfo(session_id, user_detail_info) {
		 try {
			 let ret = await setcoinserverRedisApiHandler.post('/setcoinserver/set_info_user', {
				 server_idx: config.SERVER_IDX,
				 session_id: session_id,
				 user_detail_info: user_detail_info
			 });
 
			 if(ret.data.ERR_CODE != 0)
				 return false;
			 return true;
		 }
		 catch(err22) {
			 return false;
		 }
	 }
 
	 async newWord(room_number, session_id) {
		 try {
			 let ret = await setcoinserverRedisApiHandler.post('/setcoinserver_game/new_word', {
				 server_idx: config.SERVER_IDX,
				 room_number: room_number,
				 session_id: session_id
			 });
 
			 if(ret.data.ERR_CODE != 0)
				 return null;
			 return ret.data.DATA;
		 }
		 catch(err22) {
			 return null;
		 }
	 }
 
	 async checkWord(room_number, session_id, o_session_id, is_combo_flag, bad_coin_count) {
		 try {
			 let ret = await setcoinserverRedisApiHandler.post('/setcoinserver_game/check_word', {
				 server_idx: config.SERVER_IDX,
				 room_number: room_number,
				 session_id: session_id,
				 o_session_id: o_session_id,
				 is_combo_flag: is_combo_flag,
				 bad_coin_count: bad_coin_count
			 });
 
			 console.log("[[RoomPool CheckWord]]====================", ret.data);
 
			 if(ret.data.ERR_CODE != 0)
				 return null;
			 return ret.data.DATA;
		 }
		 catch(err22) {
			 return null;
		 }
	 }
 
	 async inputWordTimeOver(room_number, nickname, session_id) {
		 try {
			 let ret = await setcoinserverRedisApiHandler.post('/setcoinserver_game/input_word_time_over', {
				 server_idx: config.SERVER_IDX,
				 room_number: room_number,
				 nickname: nickname,
				 session_id: session_id
			 });
 
			 if(ret.data.ERR_CODE != 0)
				 return null;
			 if(ret.data.RES_CODE == 3) {
				 return { RES_CODE: ret.data.RES_CODE, DATA: ret.data.DATA };
			 }
			 else {
				 return { RES_CODE: ret.data.RES_CODE };
			 }
		 }
		 catch(err22) {
 
			 console.log("RoomPool inpoutWordTimeOver err=====", err22);
 
			 return null;
		 }
	 }
 
	 async userExitFromRoom(session_id, room_number) {
		 try {
			 let ret = await setcoinserverRedisApiHandler.post('/setcoinserver_game/user_leave', {
				 room_number: room_number,
				 session_id: session_id,
				 server_idx: config.SERVER_IDX
			 });
 
			 if(ret.data.ERR_CODE != 0)
				 return null;
			 if(ret.data.FIND_USER_NULL)
				 return null;
			 
			 return ret.data.SOCKET_LIST;
		 }
		 catch(err22) {
			 console.log("[userExitFromRoom]==========", err22);		
			 return null;
		 }
	 }
 
	 async reGameStart(room_number) {
		 try {
			 let ret = await setcoinserverRedisApiHandler.post('/setcoinserver_game/re_game_start', {
				 server_idx: config.SERVER_IDX,
				 room_number: room_number
			 });
			 if(ret.data.ERR_CODE != 0)
				 return false;
			 if(!ret.data.IS_RESTART)
				 return false;
			 return true;
		 }
		 catch(err22) {
			 return false;
		 }
	 }
 
	 async gameResult(room_number, session_id) {
		 try {
			 let ret = await setcoinserverRedisApiHandler.post('/setcoinserver_game_result/game_result', {		
				 server_idx: config.SERVER_IDX,
				 room_number: room_number,
				 session_id: session_id
			 });
 
			 if(ret.data.ERR_CODE != 0)
				 return null;
			 
			 return ret.data.DATA;
		 }
		 catch(err22) {
			 return null;
		 }
	 }
 
	 //disconnect process
	 async deleteUser(session_id, socket) {
		 try {
			 let ret = await setcoinserverRedisApiHandler.post('/setcoinserver_game/delete_user', {
				 server_idx: config.SERVER_IDX,
				 socket: socket,
				 session_id: session_id
			 });
 
			 if(ret.data.ERR_CODE != 0) 
				 return false;
			 
			 return true;
		 }
		 catch(err22) {
			 return false;
		 }
	 }
 
	 async getEnterOtherNickName(room_number, session_id) {
		 try {
			 let ret = await setcoinserverRedisApiHandler.post('/setcoinserver_game/get_enter_other_nickname', {
				 server_idx: config.SERVER_IDX,
				 room_number: room_number,
				 session_id: session_id
			 });
 
			 if(ret.data.ERR_CODE != 0)
				 return null;
			 
			 return ret.data.DATA;
		 }
		 catch(err22) {
			 return null;
		 }
	 }
 
	 async deleteRoom(room_number) {
		 try {
			 let ret = await setcoinserverRedisApiHandler.post('/setcoinserver_game/delete_room', {
				 server_idx: config.SERVER_IDX,
				 room_number: room_number
			 });
 
			 if(ret.data.ERR_CODE != 0)
				 return false;
			 
			 if(ret.data.DELETE_DONE)
				 return true;
				 
			 return false;
		 }
		 catch(err22) {
			 return false;
		 }
	 }
 
	 async replaceSocket(socket, session_id) {
		 try {
			 let ret = await setcoinserverRedisApiHandler.post('/setcoinserver_game/replace_socket_by_session_id', {
				 server_idx: config.SERVER_IDX,
				 session_id: session_id,
				 socket: socket
			 });
 
			 if(ret.data.ERR_CODE != 0)
				 return false;
			 
			 return true;
		 }
		 catch(err22) {
			 return false;
		 }		
	 }
 
	 async resetRedis() {
		 try {
			 let ret = await setcoinserverRedisApiHandler.post('/setcoinserver/reset_redis', {
				 server_idx: config.SERVER_IDX
			 });
			 if(ret.data.ERR_CODE != 0)
				 return false;
			 return true;	
		 }
		 catch(err22) {
			 return false;
		 }
	 }
 
	 async searchRoomByHostName(host_name) {
		 try {
			 let ret = await setcoinserverRedisApiHandler.post('/setcoinserver/search_room_by_host_name', {
				 server_idx: config.SERVER_IDX,
				 host_name: host_name
			 });
 
			 if(ret.data.ERR_CODE != 0)
				 return null;
 
			 if(!ret.data.IS_EXIST)
				 return null;
 
			 return ret.data.DATA;
		 }
		 catch(err22) {
			 return null;
		 }
	 }
 
	 async searchRoomByRoomNum(room_number) {
		 try {
			 let ret = await setcoinserverRedisApiHandler.post('/setcoinserver/search_room_by_roomnum', {
				 server_idx: config.SERVER_IDX,
				 room_number: room_number
			 });
 
			 if(ret.data.ERR_CODE != 0)
				 return null;
 
			 return ret.data.DATA;
		 }
		 catch(err22) {
			 return null;
		 }
	 }
 
	 async autoEnter() {
		 try {
			 let ret = await setcoinserverRedisApiHandler.post('/setcoinserver/auto_enter', {
				 server_idx: config.SERVER_IDX
			 });
 
			 if(ret.data.ERR_CODE != 0)
				 return null;
 
			 return ret.data.DATA;
		 }
		 catch(err22) {
			 return null;
		 }
	 }
 
	 async checkDuplicate(session_id) {
		 try {
			 let ret = await setcoinserverRedisApiHandler.post('/setcoinserver/duplicate_user', {
				 session_id: session_id,
				 server_idx: config.SERVER_IDX
			 });
 
			 if(ret.data.ERR_CODE != 0)
				 return false;
			 return ret.data.IS_DUPLICATE;
		 }
		 catch(err22) {
			 return false;
		 }
	 }

	 async checkRoomListForRemove() {
        try {
            let ret = await setcoinserverRedisApiHandler.post('/setcoinserver/check_room_list_for_remove', {
                server_idx: config.SERVER_IDX
            });

            console.log("checkRoomListStatus=========", ret.data);

            if(ret.data.ERR_CODE != 0) 
                return { ret_code: 0, room_number: [] };
            return { ret_code: ret.data.ROOM_LIST_CHANGE, room_number: ret.data.ROOM_NUMBER };
        }
        catch(err22) {
            return { ret_code: 0, room_number: [] };
        }
    }
 }
 
 var pool = new CRoomPool();
 pool.init();
 module.exports = pool;