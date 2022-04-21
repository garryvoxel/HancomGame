
// -- user code here --

/* --- start generated code --- */

// Generated by  1.5.2 (Phaser v2.6.2)


/**
 * CharJijiResultV1
 * @param {Phaser.Game} aGame A reference to the currently running game.
 * @param {Number} aX The x coordinate (in world space) to position the Sprite at.
 * @param {Number} aY The y coordinate (in world space) to position the Sprite at.
 * @param {any} aKey This is the image or texture used by the Sprite during rendering. It can be a string which is a reference to the Cache entry, or an instance of a RenderTexture or PIXI.Texture.
 * @param {any} aFrame If this Sprite is using part of a sprite sheet or texture atlas you can specify the exact frame to use by giving a string or numeric index.
 */
function CharJijiResultV1(aGame, aX, aY, aKey, aFrame) {
	BaseCharacterResult.call(this, aGame, aX, aY, aKey || 'CharJijiSheet2', aFrame == undefined || aFrame == null? 0 : aFrame);
	this.anchor.setTo(0.47, 0.88);
	this.animations.add('RESULT_WIN', [0, 1, 2, 3, 3, 3, 2, 4, 5, 6, 7, 8, 8, 8, 8, 9, 10, 9, 10], 8, false);
	this.animations.add('RESULT_LOSE', [24, 25, 26, 27, 28, 29, 29, 29, 29, 30, 31, 32, 33], 8, false);
	this.animations.add('RESULT_DRAW', [11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23], 8, false);
	
}

/** @type BaseCharacterResult */
var CharJijiResultV1_proto = Object.create(BaseCharacterResult.prototype);
CharJijiResultV1.prototype = CharJijiResultV1_proto;
CharJijiResultV1.prototype.constructor = CharJijiResultV1;

/* --- end generated code --- */
// -- user code here --
