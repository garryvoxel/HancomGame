var socket = null;
var robby_socket = null;
var gameURL;

/**
 * 소켓 처리
 */
var SocketManager = (function () {
	  // Instance stores a reference to the Singleton
	  var instance;
	  var address;
	  function init() {
	    return {
	    	//=================================== Common ===========================================
	    	
			isSocketOnCommon : false, //소켓 상태 변수
			isSocketOnLobby : false, //소켓이 대기중인 상태
			isSocketOnGame : false, //소켓이 게임중인 상태
			isRoomList : true,
			isSetRobbyConnect: false,
			isEventDefine: false,
			isreqJoinTrigger: false,

			focusoutTimer: null,
			forceExit: false,
			isPlay: false,

	    	gameData : GameData.getInstance(), //게임데이터 가져오기			
			changeVisible: function(visible) {
				if(visible == "hidden") {
					if(instance.isPlay) {
						let _counter = 0;
						instance.focusoutTimer = setInterval(function() {
							_counter ++;
							if(_counter >= 1) {
								if(!(socket == null || socket == undefined))  {
									_counter = 0;
									clearInterval(instance.focusoutTimer);	
									instance.focusoutTimer = null;
									instance.forceExit = true;
									socket.disconnect();
								}	
							}
						}, 500);
					}
				}
				else {
					if(instance.focusoutTimer != null) {
						clearInterval(instance.focusoutTimer);
						instance.focusoutTimer = null;
					}
				}
			},
			setEventDefine: function(aSuccessCallBack) {
				if(instance.isEventDefine)
					return;
				instance.isEventDefine = true;
				aSuccessCallBack();
			},
			setRobbyConnect: function(socketUrl /*, aSuccessCallBack */ ) {

				if(instance.isSetRobbyConnect)
					return;

				// if(this.gameData.gameURL === undefined || this.gameData.gameURL === null || this.gameData.gameURL === ""){
				//	return;
				// }
				// robby_socket = io.connect(this.gameData.gameURL, {transports:['websocket']} );

				robby_socket = io.connect(socketUrl, {reconnectionDelay: 500} );

				instance.isSetRobbyConnect = true;				

				robby_socket.on('connect', function(data) {
					console.log("aSuccessCallBack===============");
				});

				robby_socket.on('error', function(err) {
					console.log("robby Socket error===============", err);
				});

				robby_socket.on('disconnect', function(data) {
				});
			},

			netRobbySocketOn : function(aEventName, aSuccessCallBack, aFailCallBack){
            	robby_socket.on(aEventName, function(data){
                    console.log("[aEventName========]", aEventName);
                    //data수신방식 : UTF8 encode 된 상태 -> decodeURIComponent : UTF8 decode... -> JSON.parse : json string 를 json Object의 객체로 변경.
                    var jsonStringData = decodeURIComponent(data);
                    var jsonParserData = JSON.parse(jsonStringData);

                    if(jsonParserData.result !== undefined && jsonParserData.result !== 0){
                        //console.log("SocketManager :: netSocketOn -> ERROR!!! [EvnetName] " + aEventName + " [Data] " + jsonStringData);
                        aFailCallBack(jsonParserData.result);
                    } else {
                        //console.log("SocketManager :: netSocketOn -> SUCCESS!!! [EvnetName] " + aEventName + " [Data] " + jsonStringData);
                        aSuccessCallBack(jsonParserData);
                    }
                });
            },

			/**
			 * 소켓커넥트.	     
			 * @param {*소켓 연결 성공 후 실행해야 하는 메소드 정의} aSuccessCallBack 
			 */	
	    	setConnect : function(channel, aSuccessCallBack, disconnectCallBack){
	    		if(this.gameData.gameURL === undefined || this.gameData.gameURL === null || this.gameData.gameURL === ""){
	    			console.log("SocketManager :: setConnect -> this.gameData.gameURL is undefined or null or empty");
	    			return;
	    		}	    		
	    		//console.log("SocketManager :: setConnect -> this.gameData.gameURL : " + this.gameData.gameURL);
				//소켓 연결
				
				// socket = io.connect(this.gameData.gameURL + '/game', {transports:['websocket']} );
				// socket = io.connect('ws://localhost:7334/game', {reconnectionDelay: 500} );

				console.log("[[gameSocketUrl=========]]", this.gameData.gameURL + '/game' + channel);

				socket = io.connect(this.gameData.gameURL + '/game' + channel, {reconnectionDelay: 500} );

				instance.isreqJoinTrigger = true;

	    		//socket = io.connect(this.gameData.gameURL, {reconnection:false} );
	    		//socket = io.connect(gameURL);
	    		//console.log("SocketManager :: setConnect -> init");
	    		//console.log("SocketManager :: setConnect -> this.isSocketOnCommon is " + instance.isSocketOnCommon);
	    		socket.on('connect', function(data) {
	    			//address = socket.request.connection.remoteAddress;
	    			//console.log("SocketManager :: setConnect -> connect 소켓이 연결됐습니다.");	    			
	    			//console.log("SocketManager :: SetConnet -> address.address : " + address);
	    			if(instance.isSocketOnCommon === false && !instance.isreqJoinTrigger){
						instance.isSocketOnCommon = true;
		    			aSuccessCallBack();
		    		}
					instance.isreqJoinTrigger = false;
	    		});
	    	   socket.on('disconnect', function(){
	    		   instance.isSocketOnCommon = false;
    			   //console.log("SocketManager :: disconnect");
	    		   //window.setTimeOut(function(){self.close();}, 1000);
	    			//self.close();
					if(instance.forceExit) {
						disconnectCallBack();
					}
	    		});
	    	},
	    	//DisConnect이벤트 호출.
	    	setDisConnect : function(){
	    			if(socket) socket.disconnect();
	    			instance.isSocketOnCommon = false;
	    			//console.log("SocketManager :: setDisConnet -> DisConnect");
	    			//window.setTimeOut(function(){self.close();}, 1000);
	    			//self.close();
	    		
			},
			
	    	getSocketOnCommon : function(){
	    		return instance.isSocketOnCommon;
	    	},	    	
	    	
	    	netSocketEmit : function(aEventName, aJsonObjectData){
	    		//reqEnterRoomData전송방식 : json object 객체 -> JSON.stringify : json 형태의 string -> encodeURIComponent : UTF8 encoder
	    		var jsonStringReqData = JSON.stringify(aJsonObjectData);
	    		
	    		if(socket === undefined || socket === null){
	    			//console.log("SocketManager :: socket is undefined!!!");
	    			return;
	    		}	    		
	    		
	    		socket.emit(aEventName, encodeURIComponent(jsonStringReqData)  );
	    		//console.log("SocketManager :: netSocketEmit -> [EvnetName] " + aEventName + " [Data] " + jsonStringReqData);
			},
			
			netRobbySocketEmit : function(aEventName, aJsonObjectData){
	    		//reqEnterRoomData전송방식 : json object 객체 -> JSON.stringify : json 형태의 string -> encodeURIComponent : UTF8 encoder
	    		var jsonStringReqData = JSON.stringify(aJsonObjectData);
	    		
	    		if(robby_socket === undefined || robby_socket === null){
	    			//console.log("SocketManager :: socket is undefined!!!");
	    			return;
	    		}	    		
	    		
	    		robby_socket.emit(aEventName, encodeURIComponent(jsonStringReqData)  );
	    		//console.log("SocketManager :: netSocketEmit -> [EvnetName] " + aEventName + " [Data] " + jsonStringReqData);
			},
	    	
	    	netSocketOn : function(aEventName, aSuccessCallBack, aFailCallBack){
	    		socket.on(aEventName, function(data){


					console.log("[aEventName========]", aEventName);

	    			//data수신방식 : UTF8 encode 된 상태 -> decodeURIComponent : UTF8 decode... -> JSON.parse : json string 를 json Object의 객체로 변경.
	    			var jsonStringData = decodeURIComponent(data);
	    			var jsonParserData = JSON.parse(jsonStringData);

	    			if(jsonParserData.result !== undefined && jsonParserData.result !== 0){
	    				//console.log("SocketManager :: netSocketOn -> ERROR!!! [EvnetName] " + aEventName + " [Data] " + jsonStringData);
	    	    		aFailCallBack(jsonParserData.result);
	    			} else {
	    				//console.log("SocketManager :: netSocketOn -> SUCCESS!!! [EvnetName] " + aEventName + " [Data] " + jsonStringData);
	    				aSuccessCallBack(jsonParserData);
	    			}
	    		});
	    	},
	    	//======================================================================================
	    	
			//==================================== Lobby ===========================================
			netReqRoomList : function(aMsgIdx) {
				this.netRobbySocketEmit(aMsgIdx, {
					"msg_idx" : aMsgIdx
				});
			},
			netReqSearchRoomByHost : function(aMsgIdx, host_name) {
				this.netRobbySocketEmit(aMsgIdx, {
					"msg_idx": aMsgIdx,
					"host_name": host_name
				});
			},
			netReqSearchRoomByRoomNum : function(aMsgIdx, room_number) {
				this.netRobbySocketEmit(aMsgIdx, {
					"msg_idx": aMsgIdx,
					"room_number": room_number
				});
			},
			netReqAutoEnterRoom : function(aMsgIdx) {
				this.netRobbySocketEmit(aMsgIdx, {
					"msg_idx": aMsgIdx
				});
			},
			//==================================== Game ===========================================
			netReqJoinGame: function(aMsgIdx, nickname, session_id, roomNum) {
				this.netSocketEmit(aMsgIdx, {
    				"msg_idx" : aMsgIdx,
					"nick_name" : nickname,
					"room_number": roomNum,
					"session_id": session_id
	    		});
			},
			/**
			 * 게임서버 로그인 요청 소켓
			 * @param {*소켓 메시지 타입} aMsgIdx 
			 * @param {*닉네임} aNickName 
			 * @param {*세션아이디} aSessionID 
			 * @param {*말랑말랑에서 가져온 캐릭터} aCharacterType 
			 * @param {*} aUUid 
			 */
	    	netReqLogin : function(aMsgIdx, aNickName, aSessionID, aCharacterType, aUUid){
	    		this.netSocketEmit(aMsgIdx, {
    				"msg_idx" : aMsgIdx,
    				"nick_name" : aNickName,
    				"session_id" : aSessionID,    				
    				"character_type" : aCharacterType,
    				"uuid" : aUUid
	    		});
			},
	    	/**
			 * 게임방 생성 소켓
			 * @param {*소켓 메시지 타입} aMsgIdx 
			 * @param {*방이름} aRoomTitle 
			 * @param {*닉네임} aNickName 
			 * @param {*비밀방} aIsLock 
			 * @param {*세션아이디} aSessionId 
			 * @param {*자유클랜} aIsSingle 
			 * @param {*} aCharacterType 
			 * @param {*선택배경} aBackGround 
			 * @param {*게임시간} aPlayTime 
			 * @param {*비번} aPassword 
			 */
	    	netReqCreateRoom : function(aMsgIdx, aRoomTitle, aNickName, aIsLock, aSessionId, aIsSingle, aCharacterType, aBackGround, aPlayTime, aPassword){
	    		this.netSocketEmit(aMsgIdx, {
	    			"msg_idx" : aMsgIdx,
	    			"room_title" : aRoomTitle,
	    			"nick_name" : aNickName,
	    			"is_lock" : aIsLock,
	    			"session_id" : aSessionId,
	    			"is_single" : aIsSingle,
	    			"character_type" : aCharacterType,
	    			"back_ground" : aBackGround,		
	    			"play_time" : aPlayTime,
	    			"password" : aPassword
	    		});
	    	},
	    	/**
			 * 게임방 입장 소켓
			 * @param {*소켓 메시지 타입} aMsgIdx 
			 * @param {*세션아이디} aSessionId 
			 * @param {*방번호} aRoomNum 
			 * @param {*닉네임} aNickName 
			 * @param {*비번} aPassword 
			 */
	    	netReqEnterRoom : function(aMsgIdx, aSessionId, aRoomNum, aNickName, aPassword){
	    		this.netSocketEmit(aMsgIdx, {
	    			"msg_idx" : aMsgIdx,
	    			"session_id" : aSessionId,
	    			"room_number" : aRoomNum,
	    			"nick_name" : aNickName,
	    			"password" : aPassword
	    		});
	    	},
	    	/**
			 * 친구요청 소켓
			 * @param {*소켓 메시지 타입} aMsgIdx 
			 * @param {*세션아이디} aSessionId 
			 * @param {*친구요청을 보낸 유저 닉네임} aFromNickName 
			 * @param {*친구요청 대상 닉네임} aToNickNameArray 
			 * @param {*방번호} aRoomNumber 
			 */
	    	netReqInvite : function(aMsgIdx, aSessionId, aFromNickName, aToNickNameArray, aRoomNumber){
	    		this.netSocketEmit(aMsgIdx, {
	    			"msg_idx" : aMsgIdx,
	    			"session_id" : aSessionId,
	    			"from_nick_name" : aFromNickName,
	    			"to_nick_name" : aToNickNameArray,
	    			"room_number" : aRoomNumber
	    		});
	    	},
	    	/**
			 * 게임방 설정변경 소켓
			 * @param {*소켓 메시지 타입} aMsgIdx 
			 * @param {*세션아이디} aSessionId 
			 * @param {*방번호} aRoomNumber 
			 * @param {*닉네임} aNickName 
			 * @param {*방이름} aRoomTitle 
			 * @param {*선택배경} aBackGround 
			 * @param {*비밀방} aIsLock 
			 * @param {*방 비번} aPassword 
			 * @param {*게임시간} aPlayTime 
			 */
	    	netReqChangeRoomOption : function(aMsgIdx, aSessionId, aRoomNumber, aNickName, aRoomTitle, aBackGround, aIsLock, aPassword, aPlayTime){	    		
	    		this.netSocketEmit(aMsgIdx, {
	    			"msg_idx" : aMsgIdx,
	    			"session_id" : aSessionId,
	    			"room_number" : aRoomNumber,
	    			"nick_name" : aNickName,
	    			"room_title" : aRoomTitle,
	    			"back_ground" : aBackGround,
	    			"is_lock" : aIsLock,
	    			"password" : aPassword,	
	    			"play_time" : aPlayTime
	    		});
	    	},	    	
	    	/**
			 * 게임방 탈퇴 소켓
			 * @param {*소켓 메시지 타입} aMsgIdx 
			 * @param {*세션아이디} aSessionID 
			 * @param {*방번호} aRoomNum 
			 * @param {*닉네임} aNickName 
			 */
	    	netReqLeaveRoom : function(aMsgIdx, aSessionID, aRoomNum, aNickName){	    		
	    		this.netSocketEmit(aMsgIdx, {
	    			"msg_idx" : aMsgIdx,
	    			"session_id" : aSessionID,
	    			"room_number" : aRoomNum,
	    			"nick_name" : aNickName
	    		});
			},
			/**
			 * 게임방 목록 가져오기
			 * @param {*} aSuccessCallBack 
			 * @param {*} aFailCallBack 
			 */
			netResRoomList : function(aSuccessCallBack, aFailCallBack) {
				this.netRobbySocketOn('res_room_list', aSuccessCallBack, aFailCallBack);
			},
			netResRoomChangeInfo : function(aSuccessCallBack, aFailCallBack) {
				this.netRobbySocketOn('res_change_room_info', aSuccessCallBack, aFailCallBack);
			},
			netResSearchRoomByHost: function(aSuccessCallBack, aFailCallBack) {
				this.netRobbySocketOn('res_search_room_by_host', aSuccessCallBack, aFailCallBack);
			},
			netResSearchRoomByRoomNum: function(aSuccessCallBack, aFailCallBack) {
				this.netRobbySocketOn('res_search_room_by_roomnum', aSuccessCallBack, aFailCallBack);
			},
			netResAutoEnterRoom: function(aSuccessCallBack, aFailCallBack) {
				this.netRobbySocketOn('res_auto_enter_room', aSuccessCallBack, aFailCallBack);
			},
			netResFire : function(aSuccessCallBack, aFailCallBack) {
				this.netSocketOn('res_you_fire', aSuccessCallBack, aFailCallBack);
			},
	    	/**
			 * 게임서버 로그인 요청 소켓 응답
			 * @param {*} aSuccessCallBack 
			 * @param {*} aFailCallBack 
			 */
	    	netResLogin : function(aSuccessCallBack, aFailCallBack){
 	    		this.netSocketOn('res_login', aSuccessCallBack, aFailCallBack);
 	    	},
 	    	/**
			  * 게임방 생성 소켓 응답 new added
			  * @param {*} aSuccessCallBack 
			  * @param {*} aFailCallBack 
			  */
 	    	netResCreateRoom : function(aSuccessCallBack, aFailCallBack){
 	    		this.netSocketOn('res_create_room', aSuccessCallBack, aFailCallBack);
			},
 	    	/**
			  * 호스트유저(방장) 게임방 입장 소켓 응답
			  * @param {*} aSuccessCallBack 
			  * @param {*} aFailCallBack 
			  */
 	    	netResHostEnterRoom : function(aSuccessCallBack, aFailCallBack){
 	    		this.netSocketOn('user_enter_room', aSuccessCallBack, aFailCallBack);
 	    	},
 	    	/**
			  * 일반 유저 게임방 입장 소켓 응답
			  * @param {*} aSuccessCallBack 
			  * @param {*} aFailCallBack 
			  */
 	    	netResPersonEnterRoom : function(aSuccessCallBack, aFailCallBack){
 	    		this.netSocketOn('res_enter_room', aSuccessCallBack, aFailCallBack);
 	    	},    		    	
 	    	/**
			  * 친구요청 거절 응답
			  * @param {*} aSuccessCallBack 
			  * @param {*} aFailCallBack 
			  */
 	    	netResInvitedReject : function(aSuccessCallBack, aFailCallBack){
	    		this.netSocketOn('game_invited_reject', aSuccessCallBack, aFailCallBack);
	    	},
	    	/**
			 * 게임방 설정변경 소켓 응답
			 * @param {*} aSuccessCallBack 
			 * @param {*} aFailCallBack 
			 */
 	    	netResChangeRoomOption : function(aSuccessCallBack, aFailCallBack){
 	    		this.netSocketOn('res_change_room_option', aSuccessCallBack, aFailCallBack);
 	    	},
 	    	/**
			  * 게임방 탈퇴 소켓 응답
			  * @param {*} aSuccessCallBack 
			  * @param {*} aFailCallBack 
			  */
 	    	netResUserLeaveRoom : function(aSuccessCallBack, aFailCallBack){
 	    		this.netSocketOn('res_leave_room', aSuccessCallBack, aFailCallBack);
 	    	},
 	    	/**
			  * 게임방 탈퇴 소켓 응답
			  * @param {*} aSuccessCallBack 
			  * @param {*} aFailCallBack 
			  */
 	    	netResOtherLeaveRoom : function(aSuccessCallBack, aFailCallBack){
 	    		this.netSocketOn('user_leave_room', aSuccessCallBack, aFailCallBack);
 	    	},
 	    	//====================================================================================== 	    	
 	    	
 	    	
	    	
	    	//=================================== InGame =========================================== 	    		
 	    	netReqGameReady : function(aMsgIdx, aSessionID, aRoomNum, aNickName){
 	    		this.netSocketEmit(aMsgIdx, {
 	    			"msg_idx" : aMsgIdx,
 	    			"session_id" : aSessionID,
 	    			"room_number" : aRoomNum,
 	    			"nick_name" : aNickName
 	 	    	});
	    	},
	    	
	    	netReqCheckRoomStatus : function(aMsgIdx, aSessionID, aRoomNum, aNickName){
 	    		this.netSocketEmit(aMsgIdx, {
 	    			"msg_idx" : aMsgIdx,
 	    			"session_id" : aSessionID,
 	    			"room_number" : aRoomNum,
 	    			"nick_name" : aNickName
 	 	    	});
	    	},
	    	
	    	netReqCheckHowGameStatus : function(aMsgIdx, aSessionID, aRoomNum, aNickName){
 	    		this.netSocketEmit(aMsgIdx, {
 	    			"msg_idx" : aMsgIdx,
 	    			"session_id" : aSessionID,
 	    			"room_number" : aRoomNum,
 	    			"nick_name" : aNickName
 	 	    	});
	    	},
	    	
	    	netReqNewWord : function(aMsgIdx, aSessionID, aRoomNum, aNickName){	    		
	    		this.netSocketEmit(aMsgIdx, {
 	    			"msg_idx" : aMsgIdx,
 	    			"session_id" : aSessionID,
 	    			"room_number" : aRoomNum,
 	    			"nick_name" : aNickName
 	    		});
	    	},
	    	
	    	netReqCheckWord : function(aMsgIdx, aSessionId, aRoomNum, aNickName, aCoinLineType, aBadCoinCount, aWord){

				console.log("[netReqCheckWord=======================]", aMsgIdx, aSessionId, aRoomNum, aNickName, aCoinLineType, aBadCoinCount, aWord);

	    		this.netSocketEmit(aMsgIdx, {
 	    			"msg_idx" : aMsgIdx,
 	    			"session_id" : aSessionId,
 	    			"room_number" : aRoomNum,
 	    			"nick_name" : aNickName,
 	    			"coin_line_type" : aCoinLineType,
 	    			"bad_coin_count" : aBadCoinCount,
 	    			"word" : aWord
 	    		});
	    	},
	    	
	    	netReqInputWordTimeOver : function(aMsgIdx, aSessionID, aRoomNum, aNickName){
	    		this.netSocketEmit(aMsgIdx, {
 	    			"msg_idx" : aMsgIdx,
 	    			"session_id" : aSessionID,
 	    			"room_number" : aRoomNum,
 	    			"nick_name" : aNickName			
 	    		});
	    	},
	    	
	    	netReqTowerFall : function(aMsgIdx, aSessionID, aRoomNum, aNickName){		
	    		this.netSocketEmit(aMsgIdx, {
 	    			"msg_idx" : aMsgIdx,
 	    			"session_id" : aSessionID,
 	    			"room_number" : aRoomNum,
 	    			"nick_name" : aNickName			
 	    		});
	    	},
	    	
	    	netReqGameResult : function(aMsgIdx, aSessionID, aRoomNum, aNickName){
	    		this.netSocketEmit(aMsgIdx, {
 	    			"msg_idx" : aMsgIdx,
 	    			"session_id" : aSessionID,
 	    			"room_number" : aRoomNum,
 	    			"nick_name" : aNickName,
 	    		});
	    	},
	    	
	    	netReqReGameStart : function(aMsgIdx, aRoomNum, aSessionID, aNickName){
	    		this.netSocketEmit(aMsgIdx, {
 	    			"msg_idx" : aMsgIdx,
 	    			"room_number" : aRoomNum,		
 	    			"session_id" : aSessionID,
 	    			"nick_name" : aNickName,
 	    		});
	    	},
	    	
	    	netReqGameLeaveRoom : function(aMsgIdx, aSessionID, aRoomNum, aNickName){	    		
	    		this.netSocketEmit(aMsgIdx, {
	    			"msg_idx" : aMsgIdx,
	    			"session_id" : aSessionID,
	    			"room_number" : aRoomNum,
	    			"nick_name" : aNickName
	    		});
	    	},
	    	
	    	netResGameReady : function(aSuccessCallBack, aFailCallBack){
	    		this.netSocketOn('res_game_ready', aSuccessCallBack, aFailCallBack);
	    	},
	    	
	    	netResCheckRoomStatus : function(aSuccessCallBack, aFailCallBack){
	    		this.netSocketOn('res_check_room', aSuccessCallBack, aFailCallBack);
	    	},
	    	
	    	netResCheckGameStatus : function(aSuccessCallBack, aFailCallBack){
	    		this.netSocketOn('res_how_game"', aSuccessCallBack, aFailCallBack);
	    	},
	    	
	    	netResGameStart : function(aSuccessCallBack, aFailCallBack){
	    		this.netSocketOn('game_start', aSuccessCallBack, aFailCallBack);
	    	},
	    	
	    	netResGameStartOtherOut : function(aSuccessCallBack, aFailCallBack){
	    		this.netSocketOn('game_start_fail', aSuccessCallBack, aFailCallBack);
	    	},
	    	
	    	netResUserNewWord : function(aSuccessCallBack, aFailCallBack){
	    		this.netSocketOn('res_new_word', aSuccessCallBack, aFailCallBack);
	    	},
	    	
	    	netResOtherNewWord : function(aSuccessCallBack, aFailCallBack){
	    		this.netSocketOn('user_new_word', aSuccessCallBack, aFailCallBack);
	    	},
	    	
	    	netResUserCheckWord : function(aSuccessCallBack, aFailCallBack){
	    		this.netSocketOn('res_check_word', aSuccessCallBack, aFailCallBack);
	    	},
	    	
	    	netResOtherCheckWord : function(aSuccessCallBack, aFailCallBack){
	    		this.netSocketOn('user_check_word', aSuccessCallBack, aFailCallBack);
	    	},
	    	
	    	netResUserInputWordTimeOver : function(aSuccessCallBack, aFailCallBack){
	    		this.netSocketOn('res_input_word_time_over', aSuccessCallBack, aFailCallBack);
	    	},	
	    	
	    	netResOtherInputWordTimeOver : function(aSuccessCallBack, aFailCallBack){
	    		this.netSocketOn('input_word_time_over', aSuccessCallBack, aFailCallBack);
	    	},	
	    	
	    	netResUserTowerFall : function(aSuccessCallBack, aFailCallBack){
	    		this.netSocketOn('res_tower_fall', aSuccessCallBack, aFailCallBack);
	    	},	

	    	netResOtherTowerFall : function(aSuccessCallBack, aFailCallBack){
	    		this.netSocketOn('tower_fall', aSuccessCallBack, aFailCallBack);
	    	},
	    	
	    	netResUserGameLeaveRoom : function(aSuccessCallBack, aFailCallBack){
 	    		this.netSocketOn('res_game_leave_room', aSuccessCallBack, aFailCallBack);
 	    	},
 	    	
 	    	netResOtherGameLeaveRoom : function(aSuccessCallBack, aFailCallBack){
 	    		this.netSocketOn('user_game_leave_room', aSuccessCallBack, aFailCallBack);
 	    	},
 	    	
	    	netResPreGameOver : function(aSuccessCallBack, aFailCallBack){
	    		this.netSocketOn('pre_game_over', aSuccessCallBack, aFailCallBack);
	    	},	    	
	    		    	
	    	netResGameOver : function(aSuccessCallBack, aFailCallBack){
	    		this.netSocketOn('game_over', aSuccessCallBack, aFailCallBack);
	    	},
	    	
	    	netResGameResult : function(aSuccessCallBack, aFailCallBack){
	    		this.netSocketOn('res_game_result', aSuccessCallBack, aFailCallBack);
	    	},
	    	
	    	netResUserReGameStart : function(aSuccessCallBack, aFailCallBack){
	    		this.netSocketOn('res_re_game_start', aSuccessCallBack, aFailCallBack);
	    	},	
	    	
	    	netResOtherReGameStart : function(aSuccessCallBack, aFailCallBack){
	    		this.netSocketOn('user_re_game_start', aSuccessCallBack, aFailCallBack);
	    	},	
	    	
	    	netResReGameStart : function(aSuccessCallBack, aFailCallBack){
	    		this.netSocketOn('re_game_start', aSuccessCallBack, aFailCallBack);
	    	},
	    	
	    	netResGoToLobby : function(aSuccessCallBack, aFailCallBack){
	    		this.netSocketOn('go_to_lobby', aSuccessCallBack, aFailCallBack);
	    	},	    	
	    	//======================================================================================
	    };
	  }

	  return {
	    getInstance: function () {
	      if ( !instance ) {
			instance = init();
	        //instance.setURL();
	        //console.log( "The SocketManager init!!!" );
	      } else {
	    	  //console.log( "The SocketManager instance!" );
		  }
	      return instance;
	    }
	  };
	})();
