var RoomManager = function(game, scene) {
	this.game = game;
	this.scene = scene;
	this.reqRoomList = function() {
		game.socketManager.reqRoomList(0);
	};
	
	this.invitePopup = function(invite) {
		/* invite */
//		0:
//			back_ground: 0
//			from_character_type: 0
//			from_nick_name: "malang"
//			game_code: 10001
//			invited_time: "2019-04-13T12:36:19.490Z"
//			isForGame: true
//			is_lock: true
//			msg_idx: "game_invited"
//			password: "5555"
//			play_time: 3
//			room_number: "274"
//			room_title: "승리는 나의 것"
//			server_dns: "dev-tt-block-rt.malangmalang.com"
//			server_idx: 1001
//			to_nick_name: ["noii"]
//			__proto__: Object
//			length: 1
		
		
	};
	
	this.nextPage = function() {
		game.socketManager.reqRoomList(1);
	};
	
	this.prevPage = function() {
		game.socketManager.reqRoomList(-1);
	};

	this.applyRoomStatus = function(room_number, is_play) {
		for(let i = 0; i < scene.roomList.length; i ++)	 {
			if(scene.roomList[i].roomNum == room_number) {
				scene.roomList[i].isPlay = is_play ? '1' : '0';

				if(!is_play) {
					scene.roomList[i].fSBtnAdmit.frame = 0;
					scene.roomList[i].fSBtnAdmit.freezeFrames = false; 
					scene.roomList[i].fSBtnAdmit.inputEnabled = true;
				}
				else {
					scene.roomList[i].fSBtnAdmit.frame = 3;
					scene.roomList[i].fSBtnAdmit.freezeFrames = true; 
					scene.roomList[i].fSBtnAdmit.inputEnabled = false;
				}

				break;
			}			
		}
	}

	this.applyMemberNum = function(room_number , members) {
		for(let i = 0; i < scene.roomList.length; i ++) {
			if(scene.roomList[i].roomNum == room_number) {
				scene.roomList[i].currentMen = members;
				scene.roomList[i].fTxt_roomMenNum.setText(members + '/' + scene.roomList[i].maxMen);			
				break;
			}
		}
	}

	this.applyRoomInfo = function(room_number, is_lock, play_time) {
		for(let i = 0; i < scene.roomList.length; i ++) {
			if(scene.roomList[i].roomNum == room_number) {
				scene.roomList[i].isLock = is_lock == 1 ? true : false;
				if(is_lock == 1) {
					scene.roomList[i].fIconLock.frame = 1;
				}
				else {
					scene.roomList[i].fIconLock.frame = 0;
				}
				scene.roomList[i].fTxt_runningTime.setText(play_time / 60 + '분');
				break;
			}
		}
	}

	this.setRoomList = function(data) {
		var roomList = data.ROOMLIST;
		scene.fTxt_roomCount.setText(game.userInfoManager.roomListPage + '/' + data.MAX_PAGE_NUMBER);

		if(game.userInfoManager.roomListPage == data.MAX_PAGE_NUMBER) {
			scene.fBtnArrowR.visible = false;
		}
		else {
			scene.fBtnArrowR.visible = true;
		}
		
		if(game.userInfoManager.roomListPage == 1) {
			scene.fBtnArrowL.visible = false;
		}
		else {
			scene.fBtnArrowL.visible = true;
		}
		
		for(var i = 0 ; i < scene.roomList.length ; i++) {
			scene.roomList[i].visible = false;
		}

		let start_idx = (game.userInfoManager.roomListPage - 1) * scene.roomList.length;
		let end_idx = (game.userInfoManager.roomListPage * scene.roomList.length > roomList.length) ? roomList.length : game.userInfoManager.roomListPage * scene.roomList.length;

		for(var i = start_idx; i < end_idx; i++) {
			scene.roomList[i - start_idx].roomNum = 'room' + roomList[i].ROOM_NUM;
			scene.roomList[i - start_idx].ip = roomList[i].IP;
			scene.roomList[i - start_idx].fTxt_roomNum.setText(roomList[i].ROOM_NUM);
			scene.roomList[i - start_idx].fTxt_roomName.setText(roomList[i].ROOM_NAME);
			scene.roomList[i - start_idx].currentMen = roomList[i].CURRENT_MEN;
			scene.roomList[i - start_idx].maxMen = roomList[i].MAX_MEN;
			scene.roomList[i - start_idx].fTxt_roomMenNum.setText(roomList[i].CURRENT_MEN + '/' + roomList[i].MAX_MEN);
			scene.roomList[i - start_idx].fTxt_runningTime.setText(roomList[i].RUNNING_TIME / 60 + '분');
			scene.roomList[i - start_idx].isLock = roomList[i].IS_LOCK;
			scene.roomList[i - start_idx].isPublic = roomList[i].IS_PUBLIC;
			scene.roomList[i - start_idx].aClan = roomList[i].A_CLAN;
			scene.roomList[i - start_idx].bClan = roomList[i].B_CLAN;
			scene.roomList[i - start_idx].isPlay = roomList[i].IS_PLAY;
			if(scene.roomList[i - start_idx].isPlay === "0"){
				
				scene.roomList[i - start_idx].fSBtnAdmit.frame = 0;
				scene.roomList[i - start_idx].fSBtnAdmit.freezeFrames = false; 
				scene.roomList[i - start_idx].fSBtnAdmit.inputEnabled = true; 

			}else{
				// console.log("입장불가 :: 이미 게임이 시작된 방입니다!!");
				scene.roomList[i - start_idx].fSBtnAdmit.frame = 3;
				scene.roomList[i - start_idx].fSBtnAdmit.freezeFrames = true; 
				scene.roomList[i - start_idx].fSBtnAdmit.inputEnabled = false; 
			}
			console.log("scene.roomList\[" + (i - start_idx) + "\].fSBtnAdmit.inputEnabled");
			console.log(scene.roomList[i - start_idx].fSBtnAdmit.inputEnabled);
			if(roomList[i].IS_LOCK) {
				scene.roomList[i - start_idx].fIconLock.frame = 1;
			}
			else {
				scene.roomList[i - start_idx].fIconLock.frame = 0;
			}
			if(roomList[i].IS_PUBLIC) {
				scene.roomList[i - start_idx].fTxt_roomType.setText("자유");
			}
			else {
				scene.roomList[i - start_idx].fTxt_roomType.setText("클랜");
			}
			scene.roomList[i - start_idx].visible = true;
		}
	};
};

