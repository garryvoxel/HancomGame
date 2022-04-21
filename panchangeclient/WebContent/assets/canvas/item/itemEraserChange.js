
// -- user code here --

/* --- start generated code --- */

// Generated by  1.5.3 (Phaser v2.6.2)


/**
 * itemEraserChange.
 * @param {Phaser.Game} aGame A reference to the currently running game.
 * @param {Phaser.Group} aParent The parent Group (or other {@link DisplayObject}) that this group will be added to.
 * @param {string} aName A name for this group. Not used internally but useful for debugging.
 * @param {boolean} aAddToStage If true this group will be added directly to the Game.Stage instead of Game.World.
 * @param {boolean} aEnableBody If true all Sprites created with {@link #create} or {@link #createMulitple} will have a physics body created on them. Change the body type with {@link #physicsBodyType}.
 * @param {number} aPhysicsBodyType The physics body type to use when physics bodies are automatically added. See {@link #physicsBodyType} for values.
 */
function itemEraserChange(aGame, aParent, aName, aAddToStage, aEnableBody, aPhysicsBodyType) {
	
	Phaser.Group.call(this, aGame, aParent, aName, aAddToStage, aEnableBody, aPhysicsBodyType);
	var _ItemChangeEff = this.game.add.sprite(0.0, 0.0, 'ItemChangeEff', 0, this);
	_ItemChangeEff.anchor.setTo(0.5, 0.5);
	var _ItemChangeEff_change = _ItemChangeEff.animations.add('change', [0, 1, 2, 3, 4], 10, false);
	_ItemChangeEff_change.killOnComplete = true;
	_ItemChangeEff_change.play();
	
	
	
}

/** @type Phaser.Group */
var itemEraserChange_proto = Object.create(Phaser.Group.prototype);
itemEraserChange.prototype = itemEraserChange_proto;
itemEraserChange.prototype.constructor = itemEraserChange;

/* --- end generated code --- */
// -- user code here --