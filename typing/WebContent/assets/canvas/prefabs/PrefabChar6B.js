
// -- user code here --

/* --- start generated code --- */

// Generated by  1.5.2 (Phaser v2.6.2)


/**
 * PrefabChar6B
 * @param {Phaser.Game} aGame A reference to the currently running game.
 * @param {Number} aX The x coordinate (in world space) to position the Sprite at.
 * @param {Number} aY The y coordinate (in world space) to position the Sprite at.
 * @param {any} aKey This is the image or texture used by the Sprite during rendering. It can be a string which is a reference to the Cache entry, or an instance of a RenderTexture or PIXI.Texture.
 * @param {any} aFrame If this Sprite is using part of a sprite sheet or texture atlas you can specify the exact frame to use by giving a string or numeric index.
 */
function PrefabChar6B(aGame, aX, aY, aKey, aFrame) {
	BaseCharacterGame.call(this, aGame, aX, aY, aKey || 'Char6BSheet', aFrame == undefined || aFrame == null? 0 : aFrame);
	this.scale.setTo(0.9, 0.9);
	this.anchor.setTo(0.48, 0.6);
	this.animations.add('IDLE', [0, 1, 2, 2, 3, 4, 4, 5, 6, 6, 7, 8, 1], 6, true);
	this.animations.add('RIGHT', [9, 10, 11, 12, 11, 12, 13, 14, 15, 16, 17, 10, 18, 19], 10, false);
	this.animations.add('WRONG', [20, 21, 22, 23, 24, 25, 26, 27, 28, 29], 10, false);
	
}

/** @type BaseCharacterGame */
var PrefabChar6B_proto = Object.create(BaseCharacterGame.prototype);
PrefabChar6B.prototype = PrefabChar6B_proto;
PrefabChar6B.prototype.constructor = PrefabChar6B;

/* --- end generated code --- */
// -- user code here --
