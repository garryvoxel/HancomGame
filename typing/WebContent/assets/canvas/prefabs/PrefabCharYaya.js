
// -- user code here --

/* --- start generated code --- */

// Generated by  1.5.2 (Phaser v2.6.2)


/**
 * PrefabCharYaya
 * @param {Phaser.Game} aGame A reference to the currently running game.
 * @param {Number} aX The x coordinate (in world space) to position the Sprite at.
 * @param {Number} aY The y coordinate (in world space) to position the Sprite at.
 * @param {any} aKey This is the image or texture used by the Sprite during rendering. It can be a string which is a reference to the Cache entry, or an instance of a RenderTexture or PIXI.Texture.
 * @param {any} aFrame If this Sprite is using part of a sprite sheet or texture atlas you can specify the exact frame to use by giving a string or numeric index.
 */
function PrefabCharYaya(aGame, aX, aY, aKey, aFrame) {
	BaseCharacterGame.call(this, aGame, aX, aY, aKey || 'CharYayaSheet', aFrame == undefined || aFrame == null? 0 : aFrame);
	this.scale.setTo(0.9, 0.9);
	this.anchor.setTo(0.5, 0.5);
	this.animations.add('IDLE', [0, 1, 1, 1, 0, 2, 2, 3, 4, 4, 5, 6, 7, 7, 8], 6, true);
	this.animations.add('RIGHT', [9, 10, 11, 12, 13, 14, 15, 16], 10, false);
	this.animations.add('WRONG', [17, 18, 19, 19, 20, 21, 22, 20, 21, 22, 23], 10, false);
	
}

/** @type BaseCharacterGame */
var PrefabCharYaya_proto = Object.create(BaseCharacterGame.prototype);
PrefabCharYaya.prototype = PrefabCharYaya_proto;
PrefabCharYaya.prototype.constructor = PrefabCharYaya;

/* --- end generated code --- */
// -- user code here --
