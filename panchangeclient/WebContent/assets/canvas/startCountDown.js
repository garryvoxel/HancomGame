
// -- user code here --

/* --- start generated code --- */

// Generated by  1.5.3 (Phaser v2.6.2)


/**
 * startCountDown.
 * @param {Phaser.Game} aGame A reference to the currently running game.
 * @param {Phaser.Group} aParent The parent Group (or other {@link DisplayObject}) that this group will be added to.    If undefined/unspecified the Group will be added to the {@link Phaser.Game#world Game World}; if null the Group will not be added to any parent.
 * @param {string} aName A name for this group. Not used internally but useful for debugging.
 * @param {boolean} aAddToStage If true this group will be added directly to the Game.Stage instead of Game.World.
 * @param {boolean} aEnableBody If true all Sprites created with {@link #create} or {@link #createMulitple} will have a physics body created on them. Change the body type with {@link #physicsBodyType}.
 * @param {number} aPhysicsBodyType The physics body type to use when physics bodies are automatically added. See {@link #physicsBodyType} for values.
 */
function startCountDown(aGame, aParent, aName, aAddToStage, aEnableBody, aPhysicsBodyType) {
	
	Phaser.Group.call(this, aGame, aParent, aName, aAddToStage, aEnableBody, aPhysicsBodyType);
	var _beginReady = this.game.add.sprite(0.0, 0.0, 'beginReady', 2, this);
	_beginReady.anchor.setTo(0.5, 0.5);
	var _beginReady_countdown = _beginReady.animations.add('countdown', [2, 1, 0, 3], 1, false);
	_beginReady_countdown.killOnComplete = true;
	
	
	
	// fields
	
	this.fBeginReady = _beginReady;
	
	//this.countdownDoneAnimation = _number_buttons_countdown;
	this.gameManager;
	_beginReady_countdown.onComplete.add(this.startGame, this);
	
}

/** @type Phaser.Group */
var startCountDown_proto = Object.create(Phaser.Group.prototype);
startCountDown.prototype = startCountDown_proto;
startCountDown.prototype.constructor = startCountDown;

/* --- end generated code --- */
// -- user code here --


startCountDown.prototype.startCountDown = function() {
	this.fBeginReady.animations.getAnimation('countdown').onComplete.add(this.startGame, this);
	this.fBeginReady.animations.getAnimation('countdown').enableUpdate = true;
	this.fBeginReady.animations.getAnimation('countdown').onUpdate.add(this.onUpdate, this);
	this.fBeginReady.animations.play('countdown', 1.0, false);
	
	this.game.audioManager.playSfx('CoDown_3_2_1');
};

startCountDown.prototype.onUpdate = function(anim, frame) {
	
	if (frame.index == 1 || frame.index == 0) {
		this.game.audioManager.playSfx('CoDown_3_2_1');
	} else if (frame.index == 3) {
		this.game.audioManager.playSfx('G_Start');
		this.game.gameManager.hideStartNotice();
	}
};

startCountDown.prototype.startGame = function() {
	this.game.gameManager.startGame();
};