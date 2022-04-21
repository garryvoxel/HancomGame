/**
 *
 */

var normalTimer = function(game) {
	this.game = game;
	
	this.gameTime = Phaser.Timer.SECOND * 180;	//Phaser.Timer.MINUTE * 3;
	this.eventTimes = [];	//eventTimes (second)
	
	this.timer = this.game.time.create();
	//this.timerEvent = this.timer.add(this.gameTime, this.endTimer, this);
	
	this.lastTime = -1;
	
	this.isOnceDead = false;
};

normalTimer.prototype.startTimer = function() {
	this.timerEvent = this.timer.add(this.gameTime, this.endTimer, this);
	this.timer.start();
};

normalTimer.prototype.pause = function() {
	this.timer.pause();
};

normalTimer.prototype.endTimer = function() {
	this.timer.stop();
	this.timer.destroy();
	this.isOnceDead = true;
	//game end
	
};

normalTimer.prototype.update = function() {

	if(this.timerEvent == null) {return;}
	
	var s = Math.round((this.timerEvent.delay - this.timer.ms) / 1000);
	
	if (Math.floor(s) != this.lastTime) { //1 second
		this.lastTime = Math.floor(s);

		//////////  need to remove
		// this.game.socketManager.updateCount(this.lastTime);
		///////////
		
		//check event
		this.eventCheck(this.lastTime);
		
		//time over
		if (this.lastTime == 0) {
			this.endTimer();
			this.game.mainTime.blinkTween.stop();
			this.game.gameManager.timeOver();
			//this.game.gameManager.endGame();
		} else if (this.lastTime == 20) {
			this.game.mainTime.blinkTween.start();
			this.game.audioManager.playSfxLoop('Time_danger');
		}
		
		console.log(this.lastTime);
	}
};

normalTimer.prototype.getTime = function() {
	if(this.timerEvent == null) {return "";}
	
	if (this.isOnceDead == true) {return "00:00";}
	
	var s = Math.round((this.timerEvent.delay - this.timer.ms) / 1000);
	
	var minutes = "0" + Math.floor(s / 60);
    var seconds = "0" + (s - minutes * 60);
    return minutes.substr(-2) + ":" + seconds.substr(-2);
};

normalTimer.prototype.getTimeMS = function() {
	if(this.timerEvent == null) {return -1;}
	
	return this.timerEvent.delay - this.timer.ms;
};

normalTimer.prototype.eventCheck = function(now) {
	//console.log(now);
	for (var i = 0; i < this.eventTimes.length; i++) {
		if (this.eventTimes[i] == now) {
			console.log("EVENT TIME!");
			//EVENT
			this.game.gameManager.initEvent();
			
		}
		
		if (now == (this.eventTimes[i] - this.game.itemManager.disableTimeBeforeEvent)) {
			//item disable
			this.game.itemManager.deactiveItemSpawn();
		}
	}
};