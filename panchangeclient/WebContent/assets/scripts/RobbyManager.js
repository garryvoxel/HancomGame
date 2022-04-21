var RobbyManager = function(game, scene) {
	const background = 
		[
		 	'랜덤',
		 	'칠판',
		 	'운동장',
		 	'책상',
		 	'눈밭',
		 	'보도블록',
		 	'꽃밭',
		 	'책',
		 	'나무바닥'
		 ];

	
	this.game = game;
	this.scene = scene;
	var _this = this;
	game.userInfoManager.currentRoom = null;
	game.userInfoManager.currentPage_red = 0;
	game.userInfoManager.maxPage_red = 0;
	
	game.userInfoManager.currentPage_blue = 0;
	game.userInfoManager.maxPage_blue = 0;
	
	game.userInfoManager.chiefTeam = '';
	
	this.setMaster = function(data) {
		if(game.userInfoManager.socketID == data[2]) {
			scene.fBtnGameReady.visible = false;
			scene.fBtnGameStart.visible = true;
			scene.fBtnSetChange.visible = true;
			game.userInfoManager.isMaster = true;
		}
		else {
			scene.fBtnGameReady.visible = true;
			scene.fBtnGameStart.visible = false;
			scene.fBtnSetChange.visible = false;
			game.userInfoManager.isMaster = false;
		}
		
		if(data[0]  == 'RED') {
			scene.fRedChief.visible = true;
			scene.fBlueChief.visible = false;
			game.userInfoManager.chiefTeam = 'RED';
		}
		else {
			scene.fRedChief.visible = false;
			scene.fBlueChief.visible = true;
			game.userInfoManager.chiefTeam = 'BLUE';
		}
	};
	
	this.setRoomInfo = function(data) {
		game.userInfoManager.currentRoom = data;
		if(data.IS_FREE) {
			scene.fIconLock.frame = 0;
		}
		else {
			scene.fIconLock.frame = 1;
		}
		scene.fTxt_roomNum.setText(game.userInfoManager.roomNum.substring(4));
		scene.fTxt_roomName.setText(data.ROOM_NAME);
		scene.fTxt_roomType.setText(data.ROOM_TYPE);
		game.userInfoManager.roomType = data.ROOM_TYPE;
		scene.fTxt_boardColor.setText(game.userInfoManager.team=='RED'?'빨강':'파랑');
		scene.fTxt_runningTime.setText(data.RUNNING_TIME/60 + '분');
		scene.fTxt_background.setText(background[data.BACKGROUND]);
	};
	
	this.updateRoomInfo = function(data) {
		game.userInfoManager.currentRoom.IS_FREE = data.IS_FREE;
		game.userInfoManager.currentRoom.RUNNING_TIME = data.RUNNING_TIME;
		game.userInfoManager.currentRoom.BACKGROUND = data.BACKGROUND;
		
		if(data.IS_FREE) {
			scene.fIconLock.frame = 0;
		}
		else {
			scene.fIconLock.frame = 1;
		}
		scene.fTxt_runningTime.setText(data.RUNNING_TIME/60 + '분');
		scene.fTxt_background.setText(background[data.BACKGROUND]);
	};
	
	this.setUserInfo = function(data) {
		scene.fTxt_redMen.setText(data.RED.length + '/' + ( parseInt(data.MEMBER_NUM) / 2));
		scene.fTxt_blueMen.setText(data.BLUE.length + '/' + ( parseInt(data.MEMBER_NUM) / 2));

		for(var i = 0 ; i < game.robbyManager.scene.redUsers.length ; i++) {
			game.robbyManager.scene.redUsers[i].children[0].setFrames(0, 0, 0);
			game.robbyManager.scene.redUsers[i].children[0].selected = false;
		}
		for(var i = 0 ; i < game.robbyManager.scene.blueUsers.length ; i++) {
			game.robbyManager.scene.blueUsers[i].children[0].setFrames(0, 0, 0);
			game.robbyManager.scene.blueUsers[i].children[0].selected = false;
		}
		
		if(data.RED.length % 15 == 0) {
			game.userInfoManager.maxPage_red = data.RED.length / 15;
		}
		else {
			game.userInfoManager.maxPage_red = parseInt(data.RED.length / 15) + 1;
		}
		
		if(data.BLUE.length % 15 == 0) {
			game.userInfoManager.maxPage_blue = data.BLUE.length / 15;
		}
		else {
			game.userInfoManager.maxPage_blue = parseInt(data.BLUE.length / 15) + 1;
		}
		
		if(game.userInfoManager.currentPage_red > game.userInfoManager.maxPage_red) {
			game.userInfoManager.currentPage_red = game.userInfoManager.maxPage_red;
		}
		if(game.userInfoManager.currentPage_blue > game.userInfoManager.maxPage_blue) {
			game.userInfoManager.currentPage_blue = game.userInfoManager.maxPage_blue;
		}
		
		if(game.userInfoManager.currentPage_red == 0) {
			scene.fBtnArrowSL.visible = false;
		}
		else {
			scene.fBtnArrowSL.visible = true;
		}
		if((game.userInfoManager.currentPage_red + 1 == game.userInfoManager.maxPage_red) || game.userInfoManager.maxPage_red == 0){
			scene.fBtnArrowSR.visible = false;
		}
		else {
			scene.fBtnArrowSR.visible = true;
		}
		
		if(game.userInfoManager.currentPage_blue == 0) {
			scene.fBtnArrowSL1.visible = false;
		}
		else {
			scene.fBtnArrowSL1.visible = true;
		}
		if((game.userInfoManager.currentPage_blue + 1 == game.userInfoManager.maxPage_blue) || game.userInfoManager.maxPage_blue == 0) {
			scene.fBtnArrowSR1.visible = false;
		}
		else {
			scene.fBtnArrowSR1.visible = true;
		}
		
		game.userInfoManager.robby_red = data.RED;
		game.userInfoManager.robby_blue = data.BLUE;
		
		for(var i = 0 ; i < data.RED.length ; i++) {
			if(data.RED[i].SOCKET == game.userInfoManager.socketID) {
				game.userInfoManager.team = 'RED';
				if(data.RED[i].READY) {
					scene.fBtnGameReady.setFrames(4, 3, 5);
				}
				else {
					scene.fBtnGameReady.setFrames(1, 0, 2);
				}
			}
			if(game.userInfoManager.inviList.indexOf(data.RED[i].NICKNAME) >= 0) {
				this.acceptInvi(data.RED[i].NICKNAME);
				game.userInfoManager.inviList.splice(game.userInfoManager.inviList.indexOf(data.RED[i].NICKNAME), 1);
			}
		}
		for(var i = 0 ; i < data.BLUE.length ; i++) {
			if(data.BLUE[i].SOCKET == game.userInfoManager.socketID) {
				game.userInfoManager.team = 'BLUE';
				if(data.BLUE[i].READY) {
					scene.fBtnGameReady.setFrames(4, 3, 5);
				}
				else {
					scene.fBtnGameReady.setFrames(1, 0, 2);
				}
			}
			if(game.userInfoManager.inviList.indexOf(data.BLUE[i].NICKNAME) >= 0) {
				this.acceptInvi(data.BLUE[i].NICKNAME);
				game.userInfoManager.inviList.splice(game.userInfoManager.inviList.indexOf(data.BLUE[i].NICKNAME), 1);
			}
		}
		scene.fTxt_boardColor.setText(game.userInfoManager.team=='RED'?'빨강':'파랑');
		
		_this.drawMember();
	};
	
	this.drawMember = function() {
		for(var i = 0 ; i < scene.redUsers.length ; i++) {
			scene.redUsers[i].visible = false;
			scene.blueUsers[i].visible = false;
		}
		
		for(var i = game.userInfoManager.currentPage_red * 15 ; i < (game.userInfoManager.currentPage_red + 1) * 15 ; i++) {
			if(game.userInfoManager.robby_red.length > i) {
				scene.redUsers[i - game.userInfoManager.currentPage_red * 15].visible = true;
				scene.redUsers[i - game.userInfoManager.currentPage_red * 15].fTxt_nickname.setText(game.userInfoManager.robby_red[i].NICKNAME);
				if(game.userInfoManager.robby_red[i].READY) {
					scene.redUsers[i - game.userInfoManager.currentPage_red * 15].fIsReady.visible = true;
				}
				else {
					scene.redUsers[i - game.userInfoManager.currentPage_red * 15].fIsReady.visible = false;
				}
				
				if(game.userInfoManager.robby_selected != null) {
					if(game.userInfoManager.robby_selected.SOCKET == game.userInfoManager.robby_red[i].SOCKET) {
						scene.redUsers[i - game.userInfoManager.currentPage_red * 15].children[0].setFrames(1, 1, 1);
						scene.redUsers[i - game.userInfoManager.currentPage_red * 15].children[0].selected = true;
					}
				}
			}
		}
		
		for(var i = game.userInfoManager.currentPage_blue * 15 ; i < (game.userInfoManager.currentPage_blue + 1) * 15 ; i++) {
			if(game.userInfoManager.robby_blue.length > i) {
				scene.blueUsers[i - game.userInfoManager.currentPage_blue * 15].visible = true;
				scene.blueUsers[i - game.userInfoManager.currentPage_blue * 15].fTxt_nickname.setText(game.userInfoManager.robby_blue[i].NICKNAME);
				if(game.userInfoManager.robby_blue[i].READY) {
					scene.blueUsers[i - game.userInfoManager.currentPage_blue * 15].fIsReady.visible = true;
				}
				else {
					scene.blueUsers[i - game.userInfoManager.currentPage_blue * 15].fIsReady.visible = false;
				}
				if(game.userInfoManager.robby_selected != null) {
					if(game.userInfoManager.robby_selected.SOCKET == game.userInfoManager.robby_blue[i].SOCKET) {
						scene.blueUsers[i - game.userInfoManager.currentPage_blue * 15].children[0].setFrames(1, 1, 1);
						scene.blueUsers[i - game.userInfoManager.currentPage_blue * 15].children[0].selected = true;
					}
				}
			}
		}
		

		if(game.userInfoManager.chiefTeam == 'RED') {
			if(game.userInfoManager.currentPage_red == 0) {
				scene.fRedChief.visible = true;
			}
			else {
				scene.fRedChief.visible = false;
			}
		}
		else {
			if(game.userInfoManager.currentPage_blue == 0) {
				scene.fBlueChief.visible = true;
			}
			else {
				scene.fBlueChief.visible = false;
			}
		}
	}
	
	this.moveRedTeam = function(val) {
		if(val > 0) {
			game.userInfoManager.currentPage_red += 1;
			if(game.userInfoManager.maxPage_red == 0) {
				game.userInfoManager.currentPage_red = 0;
			}
			else if(game.userInfoManager.currentPage_red >= game.userInfoManager.maxPage_red) {
				game.userInfoManager.currentPage_red = game.userInfoManager.maxPage_red - 1;
			}
		}
		else {
			game.userInfoManager.currentPage_red -= 1;
			if(game.userInfoManager.currentPage_red < 0) {
				game.userInfoManager.currentPage_red = 0;
			}
		}
		_this.drawMember();
	};
	
	this.moveBlueTeam = function(val) {
		if(val > 0) {
			game.userInfoManager.currentPage_blue += 1;
			if(game.userInfoManager.maxPage_blue == 0) {
				game.userInfoManager.currentPage_blue = 0;
			}
			else if(game.userInfoManager.currentPage_blue >= game.userInfoManager.maxPage_blue) {
				game.userInfoManager.currentPage_blue = game.userInfoManager.maxPage_blue - 1;
			}
		}
		else {
			game.userInfoManager.currentPage_blue -= 1;
			if(game.userInfoManager.currentPage_blue < 0) {
				game.userInfoManager.currentPage_blue = 0;
			}
		}
		
		_this.drawMember();
	};
	
	this.openFrdPopup = function(data) {
		if(game.popupManager.openPopup("frd")) {
			var _group = new FrdInvitationPopup(game);
			_group.init(data.items);
			_group.position.setTo(273.5, 50);
		}
	};
	
	this.openUserInfoPopup = function(data) {
		if(game.popupManager.openPopup("userInfo")) {
			if(game.userInfoManager.isMaster) {
				var _group = new UserInfoPopup(game);
				_group.position.setTo(273.5, 50);
			}
			else {
				var _group = new UserInfoNormalPopup(game);
				_group.position.setTo(273.5, 100);
			}
			_group.init(data, game.userInfoManager.roomType);
		}
	};
	
	this.showNeedReady = function() {
		var _group = new needReady(game);
		_group.position.setTo(795, 410);
		_group.init();
	};
	
	this.rejectInvi = function(nickname) {
		var _group = new InviToast(game);
		_group.position.setTo(830, 418);
		_group.init(false, nickname);
	};
	
	this.acceptInvi = function(nickname) {
		var _group = new InviToast(game);
		_group.position.setTo(830, 418);
		_group.init(true, nickname);
	};
};

