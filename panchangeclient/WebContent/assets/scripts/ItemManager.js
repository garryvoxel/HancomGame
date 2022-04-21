/**
 *
 */
function ItemManager (aGame) {
	
	this.game = aGame;
	this.itemSpawnActivate = true;
	
	this.disableTimeBeforeEvent = 7; //seconds (check time in normalTimer)
	
	this.disableTimeWhileUsingItem = 7;
	
	this.mosaicTime = 3;
	
	this.tempIndex = 0;
	
	
	this.deactiveItemSpawn = function() {
		console.log("deactiveItemSpawn");
		this.itemSpawnActivate = false;
	};
	
	this.activeItemSpawn = function() {
		console.log("activeItemSpawn");
		this.itemSpawnActivate = true;
	};
	
	this.noItemSpawnForWhile = function() {
		console.log("item spawn disable for " + this.disableTimeWhileUsingItem + "sec");
		this.itemSpawnActivate = false;
		
		this.game.time.events.add(Phaser.Timer.SECOND * this.disableTimeWhileUsingItem, this.activeItemSpawn, this);
	};
	
	this.spawnItem = function(x, y) {
		
		if (this.itemSpawnActivate == false) {
			return;
		}
		
		//아이템 발생확률
		var itemChance = 0.05;			//아이템 등장 확률
		var chanceRnd = Math.random();
		if (chanceRnd > itemChance) { return; }
		
		//Emit socket msg 0-먹구름, 1-천사, 2-지우개, 3-보너스, 4-입력금지
		var rnd = Math.random();
		if (rnd < 0.2) {
			//bonus
			console.log("emit bonusItem");
			//this.game.socketManager.useItem(3); --> move to itemBonusScore.js
			//active bonus (self)
			this.activeScoreItem(x, y);
			
		} else {
			//3 sec timer
			this.deactiveItemSpawn();
			this.game.time.events.add(Phaser.Timer.SECOND * 3, this.activeItemSpawn, this);
			
			if (rnd < 0.4) {
				//angel
				console.log("emit angelItem");
				this.game.socketManager.useItem(1);
			} 
			else if (rnd < 0.6) {
				//eraser
				console.log("emit eraserItem");
				this.game.socketManager.useItem(2);
			} 
			else if (rnd < 0.8) {
				//cloud
				console.log("emit cloudItem");
				this.game.socketManager.useItem(0);
			} 
			else {
				//freeze
				console.log("emit freezeItem");
				this.game.socketManager.useItem(4);
			}
		}
	};
	
	
	//Receive socket msg
	this.activeScoreItem = function(x, y) {
		var _bonus = new itemBonusScore(this.game, x, y);
		this.game.add.existing(_bonus);
		
		this.game.audioManager.playSfx('Card_it4');
	};
	
	this.activeCloudItem = function(data) {
		this.noItemSpawnForWhile();
		//alarm
		this.itemAlarm("구름", data.USING_USER.NICKNAME, data.USING_TEAM);
		
		if (this.game.userInfoManager.team == data.USING_TEAM) {return;}
		var _ItemCloud = new itemCloud(this.game, 470.0, 535.0);
		this.game.add.existing(_ItemCloud);
	};
	
	this.activeAngelItem = function(data) {
		this.noItemSpawnForWhile();
		
		_angel = new itemAngel(this.game);
		_angel.start(data.USING_TEAM);
		
		//alarm
		this.itemAlarm("천사", data.USING_USER.NICKNAME, data.USING_TEAM);
	};
	
	this.activeEraserItem = function(data) {
		this.noItemSpawnForWhile();
		
		console.log(data);
		//set answer = "" (can't flip while showing effect)
		for (var i = 0; i < data.BOARD.length; i++) {
			_board = data.BOARD;
			index = _board[i].IDX;
			this.game.gameManager.erasedAnswers.push(this.game.gameManager.answers[index]);
			this.game.gameManager.answers[index] = "";
		}
		this.game.time.events.add(Phaser.Timer.SECOND * 2, this.game.gameManager.clearErasedAnswer, this.game.gameManager);
		
		//eraser effect
		_eraser = new itemEraser(this.game);
		_eraser.start(data);
	};
	
	this.activeFreezeItem = function(data) {
		this.noItemSpawnForWhile();
		//alarm
		this.itemAlarm("입력금지", data.USING_USER.NICKNAME, data.USING_TEAM);
		
		if (this.game.userInfoManager.team == data.USING_TEAM) {return;}
		var _itemIce = new itemIce(this.game, this.game.inputPanel.x, this.game.inputPanel.y -20);
		this.game.add.existing(_itemIce);
	};
	
	this.alarmEraserItem = function(data) {
		//alarm
		this.itemAlarm("지우개", data.USING_USER.NICKNAME, data.USING_TEAM);
	};
	
	
	//Active boards Effect
	
	//Mosaic
//	this.mosaicBoardsText = function(_teamColor) {
//		
//		this.game.smallBoards.boards.forEach(function(board) {
//			if (board.teamColor == _teamColor) {
//				board.mosaic(this.mosaicTime);
//			}
//		});
//		
//		this.game.time.events.add(Phaser.Timer.SECOND * this.mosaicTime, this.removeMosaic, this);
//	};
//	
//	this.removeMosaic = function() {
//		this.game.smallBoards.boards.forEach(function(board) {
//			board.removeMosaic();
//		});
//	};
	
	//Text alpha
	this.disappearText = function(_teamColor) {
		this.game.smallBoards.boards.forEach(function(board) {
			if (board.teamColor == _teamColor) {
				board.alphaTween.start();
			}
		});
	};
	
	
	//ChangeText
	this.changeBoardsText = function(board) {
		
		for (var i = 0; i < board.length; i++) {
			index = board[i].IDX;
			
			_smallBoard = this.game.smallBoards.boards[index];
			_smallBoard.changeEffect();					//effect
			_smallBoard.textValue = board[i].ANSWER;	//change answer (text)
			_smallBoard.setBoardText();					//insert break
			this.game.gameManager.answers[index] = board[i].ANSWER;
		}
	};
	
	
	//Item alarm
	this.itemAlarm = function(itemName, userName, team) {
		console.log(team + "팀의 " + userName + "님이 " + itemName + " 아이템을 사용하셨습니다");
		this.game.itemNotify.showNotify(userName, itemName, team);
	};
	
}

