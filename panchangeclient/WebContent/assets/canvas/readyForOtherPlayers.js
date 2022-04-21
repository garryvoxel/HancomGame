
// -- user code here --

/* --- start generated code --- */

// Generated by  1.5.3 (Phaser v2.6.2)


/**
 * readyForOtherPlayers.
 * @param {Phaser.Game} aGame A reference to the currently running game.
 * @param {Phaser.Group} aParent The parent Group (or other {@link DisplayObject}) that this group will be added to.
 * @param {string} aName A name for this group. Not used internally but useful for debugging.
 * @param {boolean} aAddToStage If true this group will be added directly to the Game.Stage instead of Game.World.
 * @param {boolean} aEnableBody If true all Sprites created with {@link #create} or {@link #createMulitple} will have a physics body created on them. Change the body type with {@link #physicsBodyType}.
 * @param {number} aPhysicsBodyType The physics body type to use when physics bodies are automatically added. See {@link #physicsBodyType} for values.
 */
function readyForOtherPlayers(aGame, aParent, aName, aAddToStage, aEnableBody, aPhysicsBodyType) {
	
	Phaser.Group.call(this, aGame, aParent, aName, aAddToStage, aEnableBody, aPhysicsBodyType);
	var _RFOPbg = this.game.add.sprite(0.0, 0.0, 'PanelToastMessage', null, this);
	_RFOPbg.scale.setTo(2.0, 1.5);
	_RFOPbg.anchor.setTo(0.5, 0.5);
	
	var _RFOPtext = this.game.add.text(0.0, 0.0, '다른 유저를 기다리는 중입니다', {"font":"30px Nanum Gothic","fill":"#ffffff"}, this);
	_RFOPtext.anchor.setTo(0.5, 0.5);
	
	
	
	// fields
	
	this.fRFOPbg = _RFOPbg;
	this.fRFOPtext = _RFOPtext;
	
	this.afterCreate();
	
}

/** @type Phaser.Group */
var readyForOtherPlayers_proto = Object.create(Phaser.Group.prototype);
readyForOtherPlayers.prototype = readyForOtherPlayers_proto;
readyForOtherPlayers.prototype.constructor = readyForOtherPlayers;

/* --- end generated code --- */
// -- user code here --

readyForOtherPlayers.prototype.afterCreate = function() {
	
	this.game.add.tween(this.fRFOPbg).to({alpha : 0.5}, 1000, Phaser.Easing.Linear.None, true, 0, -1, true);
	this.game.add.tween(this.fRFOPtext).to({alpha : 0.5}, 1000, Phaser.Easing.Linear.None, true, 0, -1, true);
	
};

readyForOtherPlayers.prototype.changeLoadingStatus = function(msg) {
	this.fRFOPtext.text = "다른 유저를 기다리는 중입니다. (" + msg + ")";
};