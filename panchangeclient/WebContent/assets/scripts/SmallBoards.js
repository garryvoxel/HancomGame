/**
 *
 */
////////// Board ///////////

var SmallBoard = function(game, x, y, teamColor) {
	this.game = game;
	
	//color & position
	this.teamColor = teamColor;
	var redStartFrame = 0;
	var blueStartFrame = 6;
	if (this.teamColor == "RED") {
		this.board = this.game.add.sprite(x, y, 'SheetGamePanel', redStartFrame);
	}
	else {
		this.board = this.game.add.sprite(x, y, 'SheetGamePanel', blueStartFrame);
	}
	this.board.depth = 100;
	
	var anchorRange = 0.1;
	
	this.board.anchor.set(0.5);
//	this.board.anchor.x = 0.5 + Math.random() * anchorRange - (anchorRange * 0.5);
//	this.board.anchor.y = 0.5 + Math.random() * anchorRange - (anchorRange * 0.5);
	
	//animation
	this.animRR = this.board.animations.add('rr', [0, 1, 2, 0, 3, 4, 5, 0], 12, false);
	this.animBB = this.board.animations.add('bb', [6, 7, 8, 6, 9, 10, 11, 6], 12, false);
	this.animRB = this.board.animations.add('rb', [0, 1, 8, 6, 9, 10, 11, 6], 12, false);
	this.animBR = this.board.animations.add('br', [6, 7, 2, 0, 3, 4, 5, 0], 12, false);
	
	this.animRR.onComplete.add(this.setBoardText, this);
	this.animBB.onComplete.add(this.setBoardText, this);
	this.animRB.onComplete.add(this.setBoardText, this);
	this.animBR.onComplete.add(this.setBoardText, this);
	
	//text
	this.textValue = "";
	
	this.redStyle = { font: "15px Nanum Gothic", fill: "#ffffff", wordWrap: true, wordWrapWidth: this.board.width, align: "center", "stroke":"#750000", "strokeThickness":4};
	this.blueStyle = { font: "15px Nanum Gothic", fill: "#ffffff", wordWrap: true, wordWrapWidth: this.board.width, align: "center", "stroke":"#000075", "strokeThickness":4};
	//var style = { font: "15px Arial", fill: "#ffffff", wordWrap: true, wordWrapWidth: this.board.width, align: "center", backgroundColor: "#000000" };
	this.text = this.game.add.text(
			//Math.floor(this.board.x),
			//Math.floor(this.board.y),
			(0.5 - this.board.anchor.x) * this.board.width + this.board.x + 4,
			(0.5 - this.board.anchor.y) * this.board.height + this.board.y + 3,
			"", this.redStyle);
	
	if(this.teamColor != "RED") {
		this.text.setStyle(this.blueStyle);
	}
	this.text.anchor.set(0.5);
	this.text.lineSpacing = -10;
	this.text.smoothed = false;
	
	//angle
	var angleRange = 45;
	var randomAngle = Math.floor(Math.random() * angleRange) - (angleRange * 0.5);
	this.board.angle = randomAngle;
	//this.text.angle = randomAngle;
	
	//filter for mosaic
//	this.filter = this.game.add.filter('Pixelate', 200, 100);
//	this.filter.sizeX = 10;
//	this.filter.sizeY = 10;
	
	//alpha tween
	this.alphaTween = this.game.add.tween(this.text).to({alpha : 0.0}, 200, "Linear", false).to({alpha : 1.0}, 200, "Linear", false, 3000);
	
};

SmallBoard.prototype.flipToRed = function(newText) {
	if (this.teamColor == "RED") {
		this.animRR.play();
	} else {
		this.animBR.play();
	}
	this.teamColor = "RED";
	this.text.text = "";
	this.textValue = newText;
	this.text.setStyle(this.redStyle);
	this.cancelAlphaTween();
	
	this.game.audioManager.playSfx('Card_turn');
};

SmallBoard.prototype.flipToBlue = function(newText) {
	if (this.teamColor == "RED") {
		this.animRB.play();
	} else {
		this.animBB.play();
	}
	this.teamColor = "BLUE";
	this.text.text = "";
	this.textValue = newText;
	this.text.setStyle(this.blueStyle);
	this.cancelAlphaTween();
	
	this.game.audioManager.playSfx('Card_turn');
};

//SmallBoard.prototype.mosaic = function(seconds) {
//	this.text.filters = [this.filter];
//};
//
//SmallBoard.prototype.removeMosaic = function() {
//	this.text.filters = null;
//};

SmallBoard.prototype.cancelAlphaTween = function() {
	this.alphaTween.stop();
	this.text.alpha = 1.0;
};

SmallBoard.prototype.changeEffect = function() {
	var _effect = new itemEraserChange(this.game);
	_effect.position.setTo(this.board.x, this.board.y);
	_effect.angle = this.board.angle;
};

SmallBoard.prototype.setBoardText = function() {
	if (this.textValue.length > 3) {
		var endIndex = this.textValue.length - 1;
		var txt1 = this.textValue.substr(0, 3);
		var txt2 = this.textValue.substr(3, (endIndex - 2));
		this.text.text = txt1 + "\n" + txt2;
	} else {
		this.text.text = this.textValue;
	}
};