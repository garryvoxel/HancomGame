/**
 * 기본 소켓 로직 처리
 */

var gameSocket = null;
var roomSocket = null;

function SocketManager () {
	var game = null;
	this.game;
	this.onSocket = false;
	this.focusoutTimer = null;
	this.isReconnectPanChangeGame = true;
	this.forceExit = false;

	this.disconnectTimer = null;

	this.joining = false;

	var host = WebConfig.getSvrURL(ENVConfig);
	
	roomSocket = io.connect(host + '/robby', {transports: [ 'websocket', 'polling' ]});
	this.roomNum = "00000000";
	
	this.setGame = function(_game) {
		console.log(_game);
		game = _game;
		this.game = _game;
	};
	
	/* * * * * * * */
	/*    game     */ 
	/* * * * * * * */
	
	this.changeVisible = function(visible) {
		if(visible == "hidden") {
			if(this.game.hasOwnProperty('gameManager') && this.game.gameManager.hasOwnProperty('isPlay') && this.game.gameManager.isPlay && this.game.userInfoManager.currentStatus == 'GAME') {
				let _counter = 0;
				let _self = this;
				this.focusoutTimer = setInterval(function() {
					_counter ++;
					if(_counter == 3) {
						if(!(gameSocket == null || gameSocket == undefined))  {
							_counter = 0;
							clearInterval(_self.focusoutTimer);
							_self.focusoutTimer = null;
							_self.forceExit = true;
							gameSocket.disconnect();
						}
					}
				}, 1000);
			}
		}
		else {
			if(this.focusoutTimer != null) {
				clearInterval(this.focusoutTimer);
				this.focusoutTimer = null;
			}
		}
	}

	//SEND
	this.joinRoom = function(roomHost, roomNum, password, color) {
		if(this.joining)
			return;
		if(!this.joining)
			this.joining = true;
			
		this.initGameSocket(roomHost);
		if(gameSocket == null || gameSocket == undefined)
			return;

		game.userInfoManager.currentStatus = "ROBBY";

		gameSocket.emit('JOIN_ROOM', roomNum, {
			SESSION_ID: game.userInfoManager.sessionID,
			PK: game.userInfoManager.pk,
			NICKNAME: game.userInfoManager.nickname,
			AVATAR: game.userInfoManager.avatar,
			COLOR: color,
			PASSWORD: password,
			CLAN: game.userInfoManager.clan
		});
	};
	
	this.changeRoom = function(data) {
		if(gameSocket == null || gameSocket == undefined)
			return;

		gameSocket.emit('CHANGE_ROOM', game.userInfoManager.roomNum, data);
	};
	
	this.leaveRoom = function() {
		console.log("[gameSocket]========",gameSocket);
		if(gameSocket == null || gameSocket == undefined)
			return;

		gameSocket.emit('LEAVE_ROOM', game.userInfoManager.roomNum);
	};
	
	this.startGame = function() {
		if(gameSocket == null || gameSocket == undefined)
			return;

		gameSocket.emit('START_GAME', game.userInfoManager.roomNum);
	};
	
	this.comloading = function() {
		if(gameSocket == null || gameSocket == undefined)
			return;

		console.log("SEND COMLOADING");
		gameSocket.emit('COM_LOADING', game.userInfoManager.roomNum);
	};
	
	this.sendAnswer = function(answer, id) {
		if(gameSocket == null || gameSocket == undefined)
			return;

		gameSocket.emit('SEND_ANSWER', game.userInfoManager.roomNum, {
			'BOARD_ID' : id,
			'ANSWER' : answer
		});
	};
	
	this.sendEvent = function(eventId, quizId) {
		if(gameSocket == null || gameSocket == undefined)
			return;

		console.log("SEND_EVENT");
		gameSocket.emit('SEND_EVENT', game.userInfoManager.roomNum, {
			'EVENT_ID' : eventId,
			'QUIZ_ID' : quizId
		});
	};
	
	this.useItem = function(id) {
		if(gameSocket == null || gameSocket == undefined)
			return;

		gameSocket.emit('USE_ITEM', game.userInfoManager.roomNum, {
			'MSG' : 'USE_ITEM',
			'ITEM_ID' : id
		});
	};
	
	this.sendEndGame = function() {
		if(gameSocket == null || gameSocket == undefined)
			return;

		gameSocket.emit('SEND_ENDGAME', game.userInfoManager.roomNum);
	};
	
	this.loadedLevel = function() {
		if(gameSocket == null || gameSocket == undefined)
			return;

		if(gameSocket) {
			console.log("LOADED_LEVEL=================")
			gameSocket.emit('LOADED_LEVEL', game.userInfoManager.roomNum);
		}
	};

	//need to check later
	this.loadedRobby = function() {
		_socketManager.game.userInfoManager.currentStatus = "ROBBY";
		if(gameSocket)
			gameSocket.emit('LOADED_ROBBY', game.userInfoManager.roomNum);
		_socketManager.game.myPopup = null;
	};

	this.replayGame = function () {
		_socketManager.game.userInfoManager.currentStatus = "ROBBY";
		
		if(gameSocket == null || gameSocket == undefined)
			return;

		gameSocket.emit("RE_PLAY", game.userInfoManager.roomNum)
	};

	this.sendReadyState = function() {
		if(gameSocket == null || gameSocket == undefined)
			return;

		gameSocket.emit('SEND_READY', game.userInfoManager.roomNum);
	};
	
	this.getFrdList = function() {
		if(gameSocket == null || gameSocket == undefined)
			return;

		gameSocket.emit('GET_FRDLIST', game.userInfoManager.roomNum, {
			'SESSION': game.userInfoManager.sessionID
		});
	};
	
	this.getAnotherUserInfo = function(obj) {
		if(gameSocket == null || gameSocket == undefined)
			return;

		gameSocket.emit('GET_ANOTHER', game.userInfoManager.roomNum, {
			'UUID': obj.PK,
			'NICKNAME': obj.NICKNAME
		});
	};
	
	this.moveOtherTeam = function(obj) {
		if(gameSocket == null || gameSocket == undefined)
			return;
			
		gameSocket.emit('MOVE_OTHERTEAM', game.userInfoManager.roomNum, {
			'SOCKET': obj.SOCKET
		});
	};
	
	this.changeMaster = function(obj) {
		if(gameSocket == null || gameSocket == undefined)
			return;

		if(obj.SOCKET != game.userInfoManager.socketID) {
			gameSocket.emit('CHANGE_MASTER', game.userInfoManager.roomNum, {
				'SOCKET': obj.SOCKET
			});
		}
	};
	
	//need to check later  강제추방
	this.fireMen = function(obj) {
		if(gameSocket == null || gameSocket == undefined)
			return;

		if(obj.SOCKET != game.userInfoManager.socketID) {
			gameSocket.emit('FIRE_MEN', game.userInfoManager.roomNum, {
				'SOCKET': obj.SOCKET
			});
		}
	};
	
	this.invitation = function(obj) {
		if(gameSocket == null || gameSocket == undefined)
			return;

		console.log(obj);
		gameSocket.emit('INVITATION', game.userInfoManager.roomNum, {
			'INVILIST' : obj
		});
	};
	
	// need to check later
	this.updateCount = function(count) {
		if(gameSocket == null || gameSocket == undefined)
			return;
		try{
			console.log('UPDATE_COUNT==============', count);
			gameSocket.emit('UPDATE_COUNT', game.userInfoManager.roomNum, count);
		}
		catch(e) {
			game.panAlert("서버와의 연결이 끊어졌습니다.\n다시 접속해주세요.", function() {
				window.close();
			});
		}
	};
	
	/* * * * * * * */
	/*    robby    */ 
	/* * * * * * * */
	
	// send
	this.reqRoomList = function(flag) {

		console.log("[reqRoomList]==============");

		var tmp_page = game.userInfoManager.roomListPage;
		if(flag == 1) {
			tmp_page = game.userInfoManager.roomListPage + 1;
		}
		else if(flag == -1) {
			tmp_page = game.userInfoManager.roomListPage - 1;
			if(tmp_page <= 0) {
				tmp_page = 1;
			}
		}
		roomSocket.emit('REQ_ROOMLIST', {
			PAGE: tmp_page
		});
	};
	
	this.checkClan = function(nickname) {
		roomSocket.emit('CHECK_CLAN', nickname);
	};
	
	this.createRoom = function(data) {
		roomSocket.emit('CREATE_ROOM', data);
	};
	
	this.searchRoom = function(searchType, keyword) {
		roomSocket.emit('SEARCH_ROOM', {
			searchType: searchType,
			keyword: keyword
		});
	};
	
	this.autoEnter = function() {
		roomSocket.emit('AUTO_ENTER');
	};
	
	this.autoClan = function() {
		roomSocket.emit('AUTO_CLAN', game.userInfoManager.nickname);
	};
	
	this.getUserInfo = function() {
		console.log('REQ_USERINFO : ' + game.userInfoManager.sessionID);
		roomSocket.emit('REQ_USERINFO', {
			SESSION: game.userInfoManager.sessionID
		});
	}
	
	// receive
	roomSocket.on('RES_ROOMLIST', function(data) {
		if(game.userInfoManager.currentStatus == 'ROOMLIST') {
			game.roomManager.setRoomList(data);	
		}
	});

	roomSocket.on('RES_ROOMLIST_INDIVIDUAL', function(data) {
		if(game.userInfoManager.currentStatus == 'ROOMLIST') {
			game.userInfoManager.roomListPage = data.CURRENT_PAGE_NUMBER;
			game.roomManager.setRoomList(data);	
		}
	});

	roomSocket.on('UPDATE_MEMBERS', function(data) {
		if(game.userInfoManager.nickname != data.nickname && game.userInfoManager.currentStatus == 'ROOMLIST') {
			game.roomManager.applyMemberNum(data.room_number, data.members);
		}
	});

	roomSocket.on('UPDATE_ROOM_PLAY', function(data) {
		if(game.userInfoManager.currentStatus == 'ROOMLIST') {
			console.log("[UPDATE_ROOM_PLAY]==============", data)
			game.roomManager.applyRoomStatus(data.room_number, data.is_play);
		}
	});

	roomSocket.on('UPDATE_ROOM_INFO', function(data) {
		if(game.userInfoManager.currentStatus == 'ROOMLIST') {
			game.roomManager.applyRoomInfo(data.room_number, data.is_lock, data.play_time);
		}
	});
	
	roomSocket.on('CREATED_ROOM', function(data) {
		if(data.myteam) {
			game.userInfoManager.clan = data.myteam;
		} 
		game.popupManager.closePopup("createRoom");
		game.socketManager.joinRoom(data.roomHost, 'room' + data.roomNum, data.password, data.color);
	});
	
	roomSocket.on('CHECKED_CLAN', function(clan_name) {
		game.roomManager.enterClanCallback(clan_name);
	});
	
	roomSocket.on('CREATE_ROOM_FAIL', function(idx) {
		console.log(idx);
		if(idx == 0) {
			game.panAlert("방 생성에 실패했습니다.\n잠시 후 다시 시도해주세요.", function() {
				game.createRoom.showPopup();
			});
		}
		else if(idx == 1){
			game.panAlert("클랜방이 이미 존재합니다.\n클랜대전 빠른입장을 이용해주세요.", function() {
				game.createRoom.showPopup();
			});
		}
		else if(idx == 2) {
			game.panAlert("클랜대전은 클랜가입 후 입장할 수 있습니다.\n클랜가입 후 재시도 해주세요.", function() {
				game.createRoom.showPopup();
			});
		}
		else if(idx == 3) {
			game.panAlert("클랜대전은 클랜가입 후 입장할 수 있습니다.\n클랜가입 후 재시도 해주세요.", function() {
			});
		}
		else {
			game.panAlert("방제목은 바른말로 입력해주세요.", function() {
				game.createRoom.showPopup();
			});
		}
		
	});
	
	roomSocket.on('SEARCH_RESULT', function(data) {
		// 찾기 성공
		if(data.result.ERR_CODE == 0) {
			game.userInfoManager.searchRoom = data.result.data;
			game.roomManager.searchPopup.fSBtnAdmit.setFrames(1, 0, 2, null);
		}
		//찾기 실패
		else {
			game.userInfoManager.searchRoom = null;
			game.roomManager.searchPopup.fSBtnAdmit.setFrames(3, 3, 3, null);
			game.roomManager.searchPopup.hidePopup();
			game.panAlert("조건과 일치하는 방을 찾지 못했습니다.", function() {
				game.roomManager.searchPopup.showPopup();
			});
		}
	});
	
	roomSocket.on('AUTO_RESULT', function(data) {
		console.log(data);
		try {
			if(data) {
				var room = data.data[0];
				game.socketManager.joinRoom(room.ip, "room" + room.room_number, "");
			}
			else {
				// 찾기 실패
				game.panAlert("입장 가능한 방이 없습니다. \n방을 만들어보세요.", function() {
				});
			}
		}
		catch(e) {
			// 찾기 실패
			game.panAlert("입장 가능한 방이 없습니다. \n방을 만들어보세요.", function() {
			});
		}
	});
	
	roomSocket.on('AUTO_CLAN_RESULT', function(data) {
		if(data.result == 4202) {
			game.panAlert("클랜이 없습니다.", function() {
			});
		}
		else if(data.result == 1 || data.result == 2) {
			game.panAlert("입장 가능한 방이 없습니다. \n방을 만들어보세요.", function() {
			});
		}
		else {
			var room = data.data[0];
			if(data.data[0].my_clan_name) {
				game.userInfoManager.clan = data.data[0].my_clan_name;
			}
			
			if(room.is_lock == 1) {
				var okCallback = function(pwd) {
					game.socketManager.joinRoom(room.ip, "room" + room.room_number, pwd);
				};
				var cancelCallback = function() {
				};
				if(game.popupManager.openPopup("pwd")) {
					var _group = new EnterPWDPopup(game);
					_group.init(
						okCallback,
						cancelCallback
					);
					_group.position.setTo(243.5, 120);
					_group.myInput.startFocus();
				}
			}
			else {
				game.socketManager.joinRoom(room.ip, "room" + room.room_number, "");
			}
		}
	});
	
	roomSocket.on('RES_USERINFO', function(data) {
		console.log(data);
		if(data.result == 0) {
			game.userInfoManager.nickname = data.nick_name;
			game.userInfoManager.avatar = data.character_type;
			game.userInfoManager.pk = data.uuid;
			if(data.clan) {
				game.userInfoManager.clan = data.clan;
			}
			
			checkInviteLogin(game);
		}
		else {
			roomSocket = null;
			game.panAlert("서버와의 연결이 끊어졌습니다.\n다시 접속해주세요.", function() {
				window.close();
			});
		}
	});
	
	roomSocket.on('DUPLICATE_SESSION', function() {
		game.panAlert("이미 다른 경로로 접속이\n되어있어 게임을 종료합니다.", function(data) {
			game.popupManager.closePopup("createRoom");
			game.myPopup.myInput.destroy();
			game.myPopup.destroy();
			window.close();
		});
	});

	roomSocket.on('connect', function() {
		if(this.disconnectTimer != null) {
			clearInterval(this.disconnectTimer);
			this.disconnectTimer = null;
		}
	});
	
	roomSocket.on('disconnect', function() {
		let _disconnect_counter = 0;
		let _self = this;
		this.disconnectTimer = setInterval(function() {
			_disconnect_counter ++;
			if(game.userInfoManager.currentStatus == "MAIN_READY") {
				return;
			}
			if(_disconnect_counter >= 12) {
				clearInterval(_self.disconnectTimer);
				_self.disconnectTimer = null;
				_disconnect_counter = 0;
				if(game.hasOwnProperty('normalTimer')) {
					game.normalTimer.pause();
				}
				game.panAlert("네트워크 문제로 연결이 끊어졌습니다.\n 다시 접속해 주세요.", function() {
					window.close();
				});
			}
		}, 1000);
	});
}

function checkInviteLogin(game)
{
		if (ttsdk) {
			mInvitation = ttsdk.takeAcceptedInvitation();
		} else {
			console.error("Cannot find ttsdk!");
		}
		
		if(mInvitation !== null){
			game.socketManager.joinRoom(
				mInvitation.server_dns,
				'room' + mInvitation.room_number,
				(mInvitation.is_lock)?(mInvitation.password):(""),
				mInvitation.back_ground
			);
		}		
}


SocketManager.prototype.initGameSocket = function(roomHost) {
	gameSocket = io.connect(roomHost + '/game', {transports: [ 'websocket', 'polling' ]});
	
	var _socketManager = this;
	_socketManager.isReconnectPanChangeGame = false;

	gameSocket.on('connect', function() {
		
		_socketManager.game.userInfoManager.socketID = gameSocket.id;
		_socketManager.game.socketID = gameSocket.id;
		gameSocket.emit('JOIN_GAME', {
			NICKNAME: _socketManager.game.userInfoManager.nickname,
			roomNum: _socketManager.game.userInfoManager.roomNum,
			isReconnectPanChangeGame: _socketManager.isReconnectPanChangeGame
		});

		_socketManager.onSocket = true;
		_socketManager.forceExit = false;
		_socketManager.isReconnectPanChangeGame = true;
	});
	
	gameSocket.on('disconnect', function() {
		_socketManager.onSocket = false;
		if(_socketManager.forceExit) {
			_socketManager.game.normalTimer.pause();
			_socketManager.game.panAlert("서버와의 연결이 끊겼습니다.\n다시 접속해주세요.", function() {
				window.close();
			});
		}
	});
	
	//RECEIVE
	gameSocket.on('ENTERED_ROOM', function(data) {
		console.log("ENTERED_ROOM", data);
		//gameManager not initialized yet;
		_socketManager.game.userInfoManager.socketID = data.SOCKET;
		_socketManager.game.userInfoManager.team = data.TEAM;
		_socketManager.game.userInfoManager.roomNum = data.ROOM_NUM;
		
		/* 진성 임시 코드 : 삭제 확인 */
		_socketManager.game.socketID = data.SOCKET;
		_socketManager.game.TEAM = data.TEAM;
		
		clearInterval(_socketManager.game.intervalID); 
		_socketManager.game.state.start("Robby");
		_socketManager.game.popupManager.clearPopup();
	});
	
	gameSocket.on('JOIN_ROOM_FAIL', function(data) {
		console.log('JOIN_ROOM_FAIL', data);
		_socketManager.joining = false;
		_socketManager.reqRoomList(0);

		if(data == 1) { // full
			_socketManager.game.panAlert("방에 빈 자리가 없습니다\n다른 방을 선택해 주세요.", function() {
			});
		}
		else if(data == 2) { // playing
			_socketManager.game.panAlert("해당 방은 게임 진행중입니다.\n다른 방을 선택해 주세요.", function() {
			});
		}
		else if(data == 3) { // not match
			_socketManager.game.panAlert("입력한 비밀번호가 틀립니다.", function() {
			});
		}
		else if(data == 4) { // hasnt clan
			_socketManager.game.panAlert("클랜대전은 클랜 가입 후 입장할 수 있습니다.\n클랜가입 후 재시도 해주세요.", function() {
			});
		}
		else if(data == 5) { // isnt my clan room
			_socketManager.game.panAlert("입장할 수 없는 클랜방입니다.", function() {
			});
		}
		else if(data == 99) { // not match
			_socketManager.game.panAlert("이미 사라진 방입니다.\n잠시후 다시 시도해주세요.", function() {
			});
		}

		if(gameSocket)
			gameSocket.disconnect();
	});
	
	gameSocket.on('RES_ROOM_INIT', function(data) {
		if(data.roomNum != _socketManager.game.userInfoManager.roomNum)
			return;
		console.log('RES_ROOM_INIT', data);

		if(_socketManager.game.userInfoManager.currentStatus != "ROBBY") {
			return;
		}
		if(data.CODE == 0) {
			_socketManager.game.robbyManager.setRoomInfo(data.ROOM_INFO);
			_socketManager.game.robbyManager.setUserInfo(data.USER_INFO);
			_socketManager.game.robbyManager.setMaster(data.MASTER);
			_socketManager.game.userInfoManager.isRoomInit = true;
		}
		else {
			_socketManager.game.panAlert("강제 퇴장 당했습니다.",function() {
				_socketManager.game.state.start('RoomList');
				_socketManager.game.popupManager.clearPopup();
				_socketManager.game.userInfoManager.currentStatus = "ROOMLIST";
				_socketManager.game.userInfoManager.isRoomInit = false;
				if(gameSocket)
					gameSocket.disconnect();
			});
		}
	});
	
	gameSocket.on('CHANGED_ROOM', function(data) {
		if(data.roomNum != _socketManager.game.userInfoManager.roomNum)
			return;
		console.log('CHANGED_ROOM', data);
		if(_socketManager.game.userInfoManager.currentStatus != "ROBBY") {
			return;
		}
		if(data.result == 0) {
			_socketManager.game.robbyManager.updateRoomInfo(data.room);
		}
		else {
			_socketManager.game.panAlert("정상처리 되지 않았습니다.\n잠시 후 다시 시도해주세요.", function() {
			});
		}
	});
	
	gameSocket.on('DUPLICATE_SESSION', function() {
		_socketManager.game.panAlert("이미 다른 경로로 접속이\n되어있어 게임을 종료합니다.", function(data) {
			window.close();
		});
	});
	
	gameSocket.on('LEAVE_ROOM', function(data) {
		if(data.roomNum != _socketManager.game.userInfoManager.roomNum)
			return;
		console.log("LEAVE_ROOM", data);
		_socketManager.game.state.start('RoomList');
		_socketManager.game.popupManager.clearPopup();
		_socketManager.game.userInfoManager.currentStatus = "ROOMLIST";
		_socketManager.game.userInfoManager.isRoomInit = false;
		if(gameSocket)
			gameSocket.disconnect();
	});
	
	gameSocket.on('UPDATE_MEMBERS', function(data) {
		if(data.roomNum != _socketManager.game.userInfoManager.roomNum)
			return;
		console.log("UPDATE_MEMBERS", data);
		if(_socketManager.game.userInfoManager.currentStatus != "ROBBY") {
			return;
		}
		if(!_socketManager.game.userInfoManager.isRoomInit)
			return;
		_socketManager.game.robbyManager.setMaster(data.MASTER);
		_socketManager.game.robbyManager.setUserInfo(data.USER_INFO);
	});
	
	gameSocket.on('INGAME_LEAVE', function(data) {
		if(data.roomNum != _socketManager.game.userInfoManager.roomNum)
			return;
		console.log("INGAME_LEAVE", data);
		if(_socketManager.game.userInfoManager.currentStatus != "GAME") {
			return;
		}
		_socketManager.game.gameManager.newToastMessage(data.NICKNAME + '님이 나가셨습니다.');
	});
	
	gameSocket.on('RES_FRDLIST', function(data) {
		if(data.roomNum != _socketManager.game.userInfoManager.roomNum)
			return;
		console.log("RES_FRDLIST", data);
		if(_socketManager.game.userInfoManager.currentStatus != "ROBBY") {
			return;
		}
		_socketManager.game.robbyManager.openFrdPopup(data);		
	});
	
	gameSocket.on('RES_ANOTHER', function(data) {
		if(data.roomNum != _socketManager.game.userInfoManager.roomNum)
			return;
		console.log('RES_ANOTHER', data);		
		if(_socketManager.game.userInfoManager.currentStatus != "ROBBY") {
			return;
		}
		_socketManager.game.robbyManager.openUserInfoPopup(data);
	});
	
	gameSocket.on('MOVE_FAIL', function(data) {
		if(data.roomNum != _socketManager.game.userInfoManager.roomNum)
			return;
		console.log('MOVE_FAIL', data);
		if(_socketManager.game.userInfoManager.currentStatus != "ROBBY") {
			return;
		}
		
		_socketManager.game.panAlert("다른 팀으로 이동할 수 없습니다.",function() {
		});
	});
	
	gameSocket.on('YOU_MASTER', function(data) {
		if(data.roomNum != _socketManager.game.userInfoManager.roomNum)
			return;
		console.log('YOU_MASTER');
		if(_socketManager.game.userInfoManager.currentStatus != "ROBBY") {
			return;
		}
		
		_socketManager.game.panAlert("방장을 위임 받았습니다.",function() {
		});
	});
	
	gameSocket.on('YOU_FIRE', function(data) {
		if(data.roomNum != _socketManager.game.userInfoManager.roomNum)
			return;
		console.log('YOU_FIRE');
		if(_socketManager.game.userInfoManager.currentStatus != "ROBBY") {
			return;
		}
		
		_socketManager.game.panAlert("강제 퇴장 당했습니다.",function() {
			_socketManager.game.state.start('RoomList');
			_socketManager.game.popupManager.clearPopup();
			_socketManager.game.userInfoManager.currentStatus = "ROOMLIST";
			_socketManager.game.userInfoManager.isRoomInit = false;
			if(gameSocket)
				gameSocket.disconnect();
		});
	});
	
	gameSocket.on('START_GAME_FAIL', function(data) {
		if(data.roomNum != _socketManager.game.userInfoManager.roomNum)
			return;
		console.log('START_GAME_FAIL', data);
		if(_socketManager.game.userInfoManager.currentStatus != "ROBBY") {
			return;
		}
		
		_socketManager.game.panAlert("모든 유저가 준비되지 않았습니다.",function() {
		});
	});
	
	gameSocket.on('START_GAME_FAIL_VAL', function(data) {
		if(data.roomNum != _socketManager.game.userInfoManager.roomNum)
			return;
		console.log('START_GAME_FAIL_VAL', data);
		if(_socketManager.game.userInfoManager.currentStatus != "ROBBY") {
			return;
		}
		
		_socketManager.game.panAlert("팀원수가 맞지 않습니다.",function() {
		});
	});
	
	/////////////////////
	// game 
	/////////////////////
	
	gameSocket.on('LOAD_LEVEL', function(data) {
		if(data.roomNum != _socketManager.game.userInfoManager.roomNum)
			return;
		_socketManager.game.audioManager.stopBgm();
		_socketManager.game.state.start('Level');
		_socketManager.game.popupManager.clearPopup();
		_socketManager.game.userInfoManager.currentStatus = "GAME";
		_socketManager.game.userInfoManager.isRoomInit = false;
	});
	
		//init game
	gameSocket.on('INIT_GAME', function(data) {
		if(data.roomNum != _socketManager.game.userInfoManager.roomNum)
			return;
		console.log("INIT_GAME", data);
		_socketManager.game.gameManager.initGame(data);
	});
	
		//game start
	gameSocket.on('PLAY_GAME', function(data) {
		if(data.roomNum != _socketManager.game.userInfoManager.roomNum)
			return;
		_socketManager.game.gameManager.startCountDown();
	});
	
		//update board (flip)
	gameSocket.on('UPDATE_BOARD', function(data){
		if(data.roomNum != _socketManager.game.userInfoManager.roomNum)
			return;
		console.log("UPDATE_BOARD====================", data);
		_socketManager.game.gameManager.updateBoard(data);
	});
	
		//answer response
	gameSocket.on('RES_ANSWER', function(data){
		if(data.roomNum != _socketManager.game.userInfoManager.roomNum)
			return;
		_socketManager.game.gameManager.resAnswer(data);
	});
	
		//update ranking
	gameSocket.on('UPDATE_RANKING', function(data){
		if(data.roomNum != _socketManager.game.userInfoManager.roomNum)
			return;
		_socketManager.game.gameManager.updateScore(data);
	});
	
		//update event
	gameSocket.on('UPDATE_EVENT', function(data){
		if(data.roomNum != _socketManager.game.userInfoManager.roomNum)
			return;
		_socketManager.game.gameManager.updateEvent(data);
	});
	
		//update response
	gameSocket.on('RES_EVENT', function(data){
		if(data.roomNum != _socketManager.game.userInfoManager.roomNum)
			return;
		_socketManager.game.gameManager.resEvent(data);
	});
	
		//ITEM
	gameSocket.on('USED_CLOUD', function(data){
		if(data.roomNum != _socketManager.game.userInfoManager.roomNum)
			return;
		console.log("USED_CLOUD", data);
		_socketManager.game.itemManager.activeCloudItem(data);
	});
	
	gameSocket.on('USED_CANTINPUT', function(data){
		if(data.roomNum != _socketManager.game.userInfoManager.roomNum)
			return;
		console.log("USED_CANTINPUT", data);
		_socketManager.game.itemManager.activeFreezeItem(data);
	});
	
	gameSocket.on('USED_ANGEL', function(data){
		if(data.roomNum != _socketManager.game.userInfoManager.roomNum)
			return;
		console.log("USED_ANGEL", data);
		_socketManager.game.itemManager.activeAngelItem(data);
	});
	
	gameSocket.on('USED_ERASER', function(data){
		if(data.roomNum != _socketManager.game.userInfoManager.roomNum)
			return;
		console.log("USED_ERASER", data);
		_socketManager.game.itemManager.alarmEraserItem(data);
	});
	
	gameSocket.on('UPDATE_TEAMBOARD', function(data){
		if(data.roomNum != _socketManager.game.userInfoManager.roomNum)
			return;
		console.log("UPDATE_TEAMBOARD", data);
		_socketManager.game.itemManager.activeEraserItem(data);
	});
	
	//end game
	gameSocket.on('END_GAME', function(data){
		if(data.roomNum != _socketManager.game.userInfoManager.roomNum)
			return;
		console.log("RCV_END_GAME", data);
		_socketManager.game.gameManager.endGame(data);
	});
	
	gameSocket.on('REJECT_INVI', function(data) {
		console.log("REJECT_INVI");
		console.log(data.NICKNAME);
		_socketManager.game.robbyManager.rejectInvi(data.NICKNAME);
	});
	
	gameSocket.on('CURRENT_LOADING', function(data) {
		if(data.roomNum != _socketManager.game.userInfoManager.roomNum)
			return;
		console.log('CURRENT_LOADING', data);
		if(_socketManager.game.userInfoManager.currentStatus != "GAME") {
			return;
		}
		// data.MSG : 'n / n' 으로 넘어
		// 메시지
		if(!(_socketManager.game.gameManager == null || _socketManager.game.gameManager == undefined )) {
			_socketManager.game.gameManager.updateLoadingStatus(data.MSG);
		}
	});
	
	gameSocket.on('NEED_READY', function(data) {
		if(data.roomNum != _socketManager.game.userInfoManager.roomNum)
			return;
		console.log('NEED_READY', data);
		_socketManager.game.robbyManager.showNeedReady();
	});
	
	gameSocket.on('ON_TIMING', function(data) {
		// gameSocket.emit('UPDATE_COUNT', _socketManager.game.userInfoManager.roomNum, data);
	});
}


