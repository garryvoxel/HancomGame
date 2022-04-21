/**
 * 기본 게임 로직 처리
 */
var GameManager = function(game) {
	this.gameStatus = "ready";
	this.isPlay = false;

	this.game = game;
	this.level;
	
	//gameObjects
	this.smallBoards;
	this.normalTimer;
	this.countdown;
	this.eventGame;
	
	//Answers
	this.answers = [];
	
	this.oldAnswers = [];
	this.erasedAnswers = [];
	
	//Event;
	this.nowEventId = 0;
	this.sentences = [];
	this.allEventsSentences = [];
	this.isLastEvent = false;
	
	//Score
	this.redScores = [];
	this.blueScores = [];
	
	this.redEventScore = 0;
	this.blueEventScore = 0;
	this.myScore = 0;
	
	//Input controll
	this.inputTextUnavailable = false;
	
	//Toast message
	this.toastPosX = 512;
	this.toastPosY = 500;
	
	console.log("gameManager initialized");
	
};


GameManager.prototype.initGame = function(data) {	//INIT_GAME
	//background
	this.level.fBackGround.setBackGround(data.BACKGROUND);
	
	//boards
	this.settingAnswers(data.BOARD);
	
	//score
	this.updateScore(data);
	this.redScores = data.RED_SCORE;
	this.blueScores = data.BLUE_SOCORE;

	if (this.game.userInfoManager.team == "RED") {
		this.level.fBlueNowRanking.alpha = 0;
		this.level.fMyRankPanelB.alpha = 0;
		this.level.fPanelMeBlue.alpha = 0;
		
		this.level.fRedNowRanking.alpha = 1;
		this.level.fMyRankPanelR.alpha = 1;
		this.level.fPanelMeRed.alpha = 1;
	} else {
		this.level.fRedNowRanking.alpha = 0;
		this.level.fMyRankPanelR.alpha = 0;
		this.level.fPanelMeRed.alpha = 0;
		
		this.level.fBlueNowRanking.alpha = 1;
		this.level.fMyRankPanelB.alpha = 1;
		this.level.fPanelMeBlue.alpha = 1;
	}
	
	//game time
	this.game.normalTimer.gameTime = Phaser.Timer.SECOND * data.TIME;
	
	//events
	this.settingEvents(data.EVENTS);
	
	//Call COMLOADING
	this.game.socketManager.comloading();
};

GameManager.prototype.settingAnswers = function(board) {
	for (var i = 0; i < board.length; i++) {
		this.answers[i] = board[i].ANSWER;
		this.game.smallBoards.boards[i].textValue = board[i].ANSWER;
	}
};

GameManager.prototype.settingEvents = function(events) {
	for (var i = 0; i < events.length; i++) {

		//setting eventTime
		this.game.normalTimer.eventTimes.push(
				(this.game.normalTimer.gameTime / Phaser.Timer.SECOND) - events[i].TIME);
		
		//setting eventAnswer
		for (var j = 0; j < events[i].QUIZ.length; j++) {
			this.allEventsSentences.push(events[i].QUIZ[j].ANSWER);
		}
	}
	console.log(this.game.normalTimer.eventTimes);
	console.log(this.allEventsSentences);
	//setting firstEvent
	this.getLastEventAnswers();
};

GameManager.prototype.getLastEventAnswers = function() {
	var eventBoardsCount = 3;
	
	this.sentences = [];
	
	if (this.allEventsSentences.length < eventBoardsCount) {
		console.log("NO MORE EVENT");
		return;
	}
	
	for (var j = 0; j < eventBoardsCount; j++) {
		this.sentences.push(this.allEventsSentences.splice(0,1));
		//this.allEventsSentences.shift();
		//get last 3 answers
	}
	
	if (this.allEventsSentences.length < eventBoardsCount) {
		console.log("NO MORE EVENT");
		this.isLastEvent = true;
	}
};

GameManager.prototype.checkAnswer = function(inputText) {
	
	if (inputText == "") {return;}
	
	//check answer list
	for (var i = 0; i < this.answers.length; i++) {
		if (this.answers[i] === inputText) {
			//SEND_ANSWER
			this.game.socketManager.sendAnswer(inputText, i);
			return;
		}
	}
	
	//check old answer list
	for (var i = 0; i < this.oldAnswers.length; i++) {
		if (this.oldAnswers[i] === inputText) {
			//다른 사용자가 먼저 정답을 입력했습니다
			console.log("다른 사용자가 먼저 정답을 입력했습니다.");
			var tm = new ToastMessage(this.game);
			tm.position.setTo(this.toastPosX, this.toastPosY);
			tm.show("다른 사용자가 먼저 정답을 입력했습니다.");
			break;
		}
	}
	
	//check erased answer list
	for (var i = 0; i < this.erasedAnswers.length; i++) {
		if (this.erasedAnswers[i] === inputText) {
			//아이템 효과로인해 단어가 변경되었습니다
			console.log("아이템 효과로 인해 단어가 변경되었습니다.");
			var tm = new ToastMessage(this.game);
			tm.position.setTo(this.toastPosX, this.toastPosY);
			tm.show("아이템 효과로 인해 단어가 변경되었습니다.");
			break;
		}
	}
	
	this.game.audioManager.playSfx('Ans_wrong');
};

GameManager.prototype.updateBoard = function(data) {
	console.log(data);
	//console.log(this.answers);
	
	var index = data.IDX;
	board = this.game.smallBoards.boards[index];
	
	//push currentAnswer to oldAnswer
	this.pushOldAnswer(this.answers[index]);
	//new Answer
	this.answers[index] = data.ANSWER;
	
	//flip
	if (data.COLOR == "RED") {
		board.flipToRed(this.answers[index]);
	} else {
		board.flipToBlue(this.answers[index]);
	}
};

GameManager.prototype.checkEventAnswer = function(inputText) {
	console.log("check event answer");
	console.log(inputText);
	for (var i = 0; i < this.sentences.length; i++) {
		console.log(this.sentences[i]);
		if (this.sentences[i] == inputText) {
			//SEND_EVENT
			this.game.socketManager.sendEvent(this.nowEventId, i);
			return;
		}
	}
	this.game.audioManager.playSfx('Ans_wrong');
};

GameManager.prototype.checkEventTyping = function(inputText) {
	if (inputText.length < 2) {return;}
	var completedText = inputText.substr(0, inputText.length -1);
	//console.log("checkEventTyping..." + completedText);
	for (var i = 0; i < this.sentences.length; i++) {
		var correctIndex = this.sentences[i][0].indexOf(completedText);
		console.log(this.sentences[i][0]);
		console.log(completedText);
		console.log(correctIndex);
		if (correctIndex == 0) {
			this.eventGame.boards[i].setColorIndex(completedText.length);
		} else {
			this.eventGame.boards[i].setColorIndex(0);
		}
	}
};

GameManager.prototype.updateEvent = function(data) {
	
	console.log("UPDATE_EVENT DATA");
	console.log(data);
	
	this.eventGame.flip(data.QUIZ_ID, data.COLOR, data.USER.NICKNAME, data.USER.AVATAR);
	
};

GameManager.prototype.deleteOldAnswer = function(answer) {
	//console.log("delete old answer : " + answer);
	
	var index = this.oldAnswers.indexOf(answer);
	if (index > -1) {
		this.oldAnswers.splice(index, 1);
	}
	//console.log(this.oldAnswers);
};

GameManager.prototype.pushOldAnswer = function(answer) {
	console.log("push old answer : " + answer);
	
	this.oldAnswers.push(answer);
	this.game.time.events.add(Phaser.Timer.SECOND * 2, this.deleteOldAnswer, this, answer);
	
	console.log(this.oldAnswers);
};

GameManager.prototype.clearErasedAnswer = function() {
	console.log("erasedAnswer cleared");
	this.erasedAnswers = [];
	console.log(this.erasedAnswers);
};

GameManager.prototype.startCountDown = function() {
	this.level.fReadyForMsg.destroy();
	this.level.fStartCountDown.startCountDown();
	this.showStartNotice();
};

GameManager.prototype.startGame = function() {
	console.log("countdown done!");
	this.isPlay = true;
	this.gameStatus = "play";
	this.game.normalTimer.startTimer();
	this.game.smallBoards.startGame();
	this.level.fTOW.start();
	
	this.game.audioManager.playBgm("Card_music");
	
	this.game.time.events.loop(Phaser.Timer.SECOND * 2, this.updateTOW, this);
};

GameManager.prototype.initEvent = function() {
	console.log(this.eventGame);
	console.log(this.sentences);
	
	this.eventGame = new eventGame(this.game);
	this.level.clearInput();
	this.eventGame.position.setTo(512.0, 288.0);
	this.eventGame.gameManager = this;
	this.gameStatus = "event";
	
	for (var i = 0; i < this.sentences.length; i++) {
		this.eventGame.boards[i].fSentenceText.text = this.sentences[i];
	}
	
	this.level.bringTopInputGroup();	//typingInputGroup to top (of canvas)
	
	this.game.audioManager.stopBgm();
	this.game.audioManager.playSfx("Card_evst");
};

GameManager.prototype.updateScore = function(data) {
	console.log("UPDATE SCORE");
	
	//total score
	this.level.fRedTotalScore.text = data.RED_SCORE.TEAM_SCORE;
	this.level.fBlueTotalScore.text = data.BLUE_SCORE.TEAM_SCORE;
	this.redEventScore = data.RED_SCORE.BONUS_SCORE;
	this.blueEventScore = data.BLUE_SCORE.BONUS_SCORE;
	
	//team rank
	redTeamCount = data.RED_SCORE.RANK_SCORE.length;
	blueTeamCount = data.BLUE_SCORE.RANK_SCORE.length;
	
	if (redTeamCount > 0) {
		this.level.fRedPlayer1.setText(this.setRankName(data.RED_SCORE.RANK_SCORE[0].NICKNAME));
	}
	if (redTeamCount > 1) {
		this.level.fRedPlayer2.setText(this.setRankName(data.RED_SCORE.RANK_SCORE[1].NICKNAME));
	}
	if (redTeamCount > 2) {
		this.level.fRedPlayer3.setText(this.setRankName(data.RED_SCORE.RANK_SCORE[2].NICKNAME));
	}
	
	if (blueTeamCount > 0) {
		this.level.fBluePlayer1.setText(this.setRankName(data.BLUE_SCORE.RANK_SCORE[0].NICKNAME));
	}
	if (blueTeamCount > 1) {
		this.level.fBluePlayer2.setText(this.setRankName(data.BLUE_SCORE.RANK_SCORE[1].NICKNAME));
	}
	if (blueTeamCount > 2) {
		this.level.fBluePlayer3.setText(this.setRankName(data.BLUE_SCORE.RANK_SCORE[2].NICKNAME));
	}
	
	//my rank / score
	this.updateMyScore(data);
	
	//bonus score
	this.level.fRedBonusScore.text = data.RED_SCORE.BONUS_SCORE;
	this.level.fBlueBonusScore.text = data.BLUE_SCORE.BONUS_SCORE;
};

GameManager.prototype.setRankName = function(name) {
	var limitLength = 5;
	var tmpName = name;
	if (name.length >= limitLength) {
		tmpName = name.substr(0, limitLength - 1) + '...';
	}
	return tmpName;
};

GameManager.prototype.updateMyScore = function(data) {
	console.log("UPDATE_MYSCORE");
	console.log(data);
	
	red_rank_score = data.RED_SCORE.RANK_SCORE;
	blue_rank_score = data.BLUE_SCORE.RANK_SCORE;
	
	var scoreGap = 0;
	
	for (var i = 0; i < red_rank_score.length; i++) {
		if (red_rank_score[i].SOCKET == this.game.userInfoManager.socketID) {			///here
			scoreGap = red_rank_score[i].SCORE - this.myScore;
			this.myScore = red_rank_score[i].SCORE;
			this.updateMyRank(i);
		}
	}
	for (var i = 0; i < blue_rank_score.length; i++) {
		if (blue_rank_score[i].SOCKET == this.game.userInfoManager.socketID) {			///here
			scoreGap = blue_rank_score[i].SCORE - this.myScore;
			this.myScore = blue_rank_score[i].SCORE;
			this.updateMyRank(i);
		}
	}
	
	if (scoreGap > 0) { 	//+score
		this.game.myScore.addScore(scoreGap);
	} else if (scoreGap < 0) {	//-score
		console.log("-score");
		this.game.myScore.minusScore(scoreGap);
	}
	
};

GameManager.prototype.updateMyRank = function(rankIndex) {
	console.log("UPDATE MYRANK");
	console.log(rankIndex);
	
	_rank = rankIndex + 1;
	this.level.fBlueNowRanking.setText(_rank + "위");
	this.level.fRedNowRanking.setText(_rank + "위");
	
	rankY = [250, 313, 377];
	if (rankIndex < 3) {
		this.level.fPanelMeRed.y = rankY[rankIndex];
		this.level.fPanelMeBlue.y = rankY[rankIndex];
	} else {
		this.level.fPanelMeRed.y = 700;
		this.level.fPanelMeBlue.y = 700;
	}
};

GameManager.prototype.resAnswer = function(data) {
	if (data.RESULT == true) {
		//item spawn
		this.game.itemManager.spawnItem(board.board.x, board.board.y);
		
		this.game.audioManager.playSfx('Ans_right');
	} else {
		var tm = new ToastMessage(this.game);
		tm.position.setTo(this.toastPosX, this.toastPosY);
		tm.show("다른 사용자가 먼저 정답을 입력했습니다.");
		
		this.game.audioManager.playSfx('Ans_wrong');
	}
};

GameManager.prototype.resEvent = function(data) {		//for SE
	console.log("RES_EVENT");
	console.log(data);
	if (data.RESULT == true) {
		this.game.audioManager.playSfx('Ans_right');
	} else {
		this.game.audioManager.playSfx('Ans_wrong');
	}
};

GameManager.prototype.updateTOW = function() {
	
	var redEventBoardCount = 0;
	var blueEventBoardCount = 0;
	if (this.redEventScore > 0) {
		redEventBoardCount = this.redEventScore / 1000;
	}
	if (this.blueEventScore > 0) {
		blueEventBoardCount = this.blueEventScore / 1000;
	}
	
	var blueSum = 0;
	var boardSum = this.game.smallBoards.boards.length;
	for (var i = 0; i < boardSum; i++) {
		if (this.game.smallBoards.boards[i].teamColor == "BLUE") {
			blueSum++;
		}
	}
	var redSum = boardSum - blueSum;
	var redCondition = (redEventBoardCount * 10) + redSum;
	var blueCondition = (blueEventBoardCount * 10) + blueSum;
	//this.level.fTOW.move(blueSum/boardSum);
	this.level.fTOW.move(blueCondition/(blueCondition + redCondition));
};

GameManager.prototype.timeOver = function() {
	console.log("TIME OVER");
	
	//send endgame msg
	this.game.socketManager.sendEndGame();
	
	//wait for other players
	this.game.audioManager.stopAllSound();
	//timer stop
	this.game.normalTimer.pause();
	//disable input
	this.inputTextUnavailable = true;
};

GameManager.prototype.endGame = function(data) {
	console.log("END GAME");
	console.log(data);
	
	this.isPlay = false;

	this.game.audioManager.stopAllSound();
	
	//timer stop
	this.game.normalTimer.pause();
	
	//disable input
	this.inputTextUnavailable = true;
	
	
	//show result
	_result = new mainGameResult(this.game);
	_result.position.setTo(this.game.world.centerX, this.game.world.centerY - 20);
	
	_resultData = new resultData();
	_resultData.winColor = data.WIN;
	
	_resultData.redSmall = data.RED.SMALL_NUM;
	_resultData.redBig = data.RED.BIG_NUM;
	_resultData.redScore = data.RED.TEAM_SCORE;
	_resultData.redBonus = data.RED.BONUS_SCORE;
	
	_resultData.blueSmall = data.BLUE.SMALL_NUM;
	_resultData.blueBig = data.BLUE.BIG_NUM;
	_resultData.blueScore = data.BLUE.TEAM_SCORE;
	_resultData.blueBonus = data.BLUE.BONUS_SCORE;
	
	_resultData.myRank = data.RANK;
	_resultData.myWin = data.HISTORY.WIN;
	_resultData.myLose = data.HISTORY.LOSE;
	_resultData.myDraw = data.HISTORY.DRAW;
	_resultData.gamePoint = data.POINT;
	
	_result.customInit(_resultData);
	
};


GameManager.prototype.newToastMessage = function(msg) {
	var tm = new ToastMessage(this.game);
	tm.position.setTo(this.toastPosX, this.toastPosY);
	tm.show(msg);
};

GameManager.prototype.updateLoadingStatus = function(msg) {
	if (this.level.fReadyForMsg != null) {
		this.level.fReadyForMsg.changeLoadingStatus(msg);
	}
};

GameManager.prototype.showStartNotice = function() {
	if (this.game.userInfoManager.team == "RED") {
		this.level.fStartNotice_blueTeam.alpha = 1.0;
	} else {
		this.level.fStartNotice_reaTeam.alpha = 1.0;
	}
};

GameManager.prototype.hideStartNotice = function() {
	this.level.fStartNotice_blueTeam.alpha = 0.0;
	this.level.fStartNotice_reaTeam.alpha = 0.0;
};