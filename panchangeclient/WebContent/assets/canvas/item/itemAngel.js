
// -- user code here --

/* --- start generated code --- */

// Generated by  1.5.3 (Phaser v2.6.2)


/**
 * itemAngel.
 * @param {Phaser.Game} aGame A reference to the currently running game.
 * @param {Phaser.Group} aParent The parent Group (or other {@link DisplayObject}) that this group will be added to.    If undefined/unspecified the Group will be added to the {@link Phaser.Game#world Game World}; if null the Group will not be added to any parent.
 * @param {string} aName A name for this group. Not used internally but useful for debugging.
 * @param {boolean} aAddToStage If true this group will be added directly to the Game.Stage instead of Game.World.
 * @param {boolean} aEnableBody If true all Sprites created with {@link #create} or {@link #createMulitple} will have a physics body created on them. Change the body type with {@link #physicsBodyType}.
 * @param {number} aPhysicsBodyType The physics body type to use when physics bodies are automatically added. See {@link #physicsBodyType} for values.
 */
function itemAngel(aGame, aParent, aName, aAddToStage, aEnableBody, aPhysicsBodyType) {
	
	Phaser.Group.call(this, aGame, aParent, aName, aAddToStage, aEnableBody, aPhysicsBodyType);
	var _angelGroup = this.game.add.group(this);
	_angelGroup.position.setTo(512.0, 288.0);
	_angelGroup.scale.setTo(0.0, 0.0);
	
	var _ItemEngelLight2 = this.game.add.sprite(0.0, 0.0, 'ItemEngelLight', null, _angelGroup);
	_ItemEngelLight2.scale.setTo(0.8, 0.8);
	_ItemEngelLight2.anchor.setTo(0.5, 0.5);
	
	var _ItemEngelLight = this.game.add.sprite(0.0, 0.0, 'ItemEngelLight', null, _angelGroup);
	_ItemEngelLight.anchor.setTo(0.5, 0.5);
	
	var _ItemEngelRingLight = this.game.add.sprite(0.0, 0.0, 'ItemEngelRingLight50', 0, _angelGroup);
	_ItemEngelRingLight.scale.setTo(2.0, 2.0);
	_ItemEngelRingLight.anchor.setTo(0.5, 0.5);
	var _ItemEngelRingLight_spread = _ItemEngelRingLight.animations.add('spread', [0, 1, 2, 3, 4, 5, 3, 4, 5, 6, 7, 8], 12, false);
	_ItemEngelRingLight_spread.killOnComplete = true;
	
	var _ItemEngel = this.game.add.sprite(0.0, 0.0, 'ItemEngel', null, _angelGroup);
	_ItemEngel.anchor.setTo(0.5, 0.5);
	
	var _ItemEngelStarExplosion = this.game.add.sprite(0.0, 0.0, 'ItemEngelStarExplosion', 0, _angelGroup);
	_ItemEngelStarExplosion.anchor.setTo(0.5, 0.5);
	var _ItemEngelStarExplosion_spread2 = _ItemEngelStarExplosion.animations.add('spread2', [0, 1, 2, 3, 4, 5, 2, 3, 6, 7], 10, false);
	_ItemEngelStarExplosion_spread2.killOnComplete = true;
	
	
	
	// fields
	
	this.fAngelGroup = _angelGroup;
	this.fItemEngelLight2 = _ItemEngelLight2;
	this.fItemEngelLight = _ItemEngelLight;
	this.fItemEngelRingLight = _ItemEngelRingLight;
	this.fItemEngelStarExplosion = _ItemEngelStarExplosion;
	
}

/** @type Phaser.Group */
var itemAngel_proto = Object.create(Phaser.Group.prototype);
itemAngel.prototype = itemAngel_proto;
itemAngel.prototype.constructor = itemAngel;

/* --- end generated code --- */
// -- user code here --

itemAngel.prototype.start = function(_teamColor) {
	
	this.teamColor = _teamColor;
	
	//this.game.time.events.add(Phaser.Timer.SECOND * 2, this.killAndMosaic, this);
	
	this.fItemEngelRingLight.visible = false;
	this.fItemEngelStarExplosion.visible = false;
	
	this.growTween = this.game.add.tween(this.fAngelGroup.scale).to({x : 1, y : 1}, 300, Phaser.Easing.Linear.None, true);
	this.shrinkTween = this.game.add.tween(this.fAngelGroup.scale).to({x : 0, y : 0}, 300, Phaser.Easing.Linear.None, false, 1400);
	this.growTween.chain(this.shrinkTween);
	
	this.growTween.onComplete.add(this.startAnimation, this);
	this.shrinkTween.onComplete.add(this.killAndMosaic, this);
	
	//Light rotation angle
	this.anglePerSec = (360 / 8) / 60;	//360 / rotationPerSec / fps
	
	this.game.audioManager.playSfx('Card_it2');
};

itemAngel.prototype.startAnimation = function() {
	console.log("angel startAnimation");
	
	this.fItemEngelRingLight.visible = true;
	this.fItemEngelStarExplosion.visible = true;
	
	this.fItemEngelRingLight.animations.getAnimation('spread').play();
	this.fItemEngelStarExplosion.animations.getAnimation('spread2').play();
};

itemAngel.prototype.killAndMosaic = function() {
	console.log("kill angel");
	//disappear (modaic X)
	this.game.itemManager.disappearText(this.teamColor);
	
	this.destroy();
};

itemAngel.prototype.update = function() {
	this.fItemEngelLight.angle += this.anglePerSec;
	this.fItemEngelLight2.angle -= this.anglePerSec;
};
