
// -- user code here --

/* --- start generated code --- */

// Generated by  1.5.3 (Phaser v2.6.2)


/**
 * BlueUser.
 * @param {Phaser.Game} aGame A reference to the currently running game.
 * @param {Phaser.Group} aParent The parent Group (or other {@link DisplayObject}) that this group will be added to.    If undefined/unspecified the Group will be added to the {@link Phaser.Game#world Game World}; if null the Group will not be added to any parent.
 * @param {string} aName A name for this group. Not used internally but useful for debugging.
 * @param {boolean} aAddToStage If true this group will be added directly to the Game.Stage instead of Game.World.
 * @param {boolean} aEnableBody If true all Sprites created with {@link #create} or {@link #createMulitple} will have a physics body created on them. Change the body type with {@link #physicsBodyType}.
 * @param {number} aPhysicsBodyType The physics body type to use when physics bodies are automatically added. See {@link #physicsBodyType} for values.
 */
function BlueUser(aGame, aParent, aName, aAddToStage, aEnableBody, aPhysicsBodyType) {
	
	Phaser.Group.call(this, aGame, aParent, aName, aAddToStage, aEnableBody, aPhysicsBodyType);
	this.game.add.button(0.0, 0.0, 'BarUnitWaitRoomB', selUserInRobby, this, null, 0, null, null, this);
	
	var _isReady = this.game.add.sprite(6.0, 6.0, 'ReadyForLightB', null, this);
	
	var _txt_nickname = this.game.add.text(77.0, 18.0, '닉네임이여덟자임', {"font":"12px Arial","align":"center"}, this);
	_txt_nickname.anchor.setTo(0.5, 0.5);
	
	
	
	// fields
	
	this.fIsReady = _isReady;
	this.fTxt_nickname = _txt_nickname;
	
}

/** @type Phaser.Group */
var BlueUser_proto = Object.create(Phaser.Group.prototype);
BlueUser.prototype = BlueUser_proto;
BlueUser.prototype.constructor = BlueUser;

/* --- end generated code --- */
// -- user code here --
