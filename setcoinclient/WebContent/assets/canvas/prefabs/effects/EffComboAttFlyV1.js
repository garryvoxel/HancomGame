
// -- user code here --

/* --- start generated code --- */

// Generated by  1.5.2 (Phaser v2.6.2)


/**
 * EffComboAttFlyV1
 * @param {Phaser.Game} aGame A reference to the currently running game.
 * @param {Number} aX The x coordinate (in world space) to position the Sprite at.
 * @param {Number} aY The y coordinate (in world space) to position the Sprite at.
 * @param {any} aKey This is the image or texture used by the Sprite during rendering. It can be a string which is a reference to the Cache entry, or an instance of a RenderTexture or PIXI.Texture.
 * @param {any} aFrame If this Sprite is using part of a sprite sheet or texture atlas you can specify the exact frame to use by giving a string or numeric index.
 */
function EffComboAttFlyV1(aGame, aX, aY, aKey, aFrame) {
	
	this.beforeCreate();
	
	Phaser.Sprite.call(this, aGame, aX, aY, aKey || 'SheetEffComboAtt1', aFrame == undefined || aFrame == null? 0 : aFrame);
	this.anchor.setTo(0.48, 0.5);
	this.animations.add('PLAY', [2, 3, 4, 5, 6, 4, 7, 8], 11, false);
	this.animations.add('IDLE', [0, 1], 12, false);
	
	this.afterCreate();
	
}

/** @type Phaser.Sprite */
var EffComboAttFlyV1_proto = Object.create(Phaser.Sprite.prototype);
EffComboAttFlyV1.prototype = EffComboAttFlyV1_proto;
EffComboAttFlyV1.prototype.constructor = EffComboAttFlyV1;

/* --- end generated code --- */
// -- user code here --
//캐릭터 점프 트윈.
EffComboAttFlyV1.prototype.beforeCreate = function(){
	
};

EffComboAttFlyV1.prototype.afterCreate = function(){	
	this.tweenA = null;
	this.isTween = false;
	this.targetX = 0;
	this.targetY = 0;
	this.initX = 0;
	this.initY = 0;	
};

EffComboAttFlyV1.prototype.setPlay = function(aAnimaitonName, aIsTween, aAngle, aInitX, aInitY, aTargetX, aTargetY) {	
	if(this === undefined || this.animations === undefined) { console.log("EffComboAttFlyV1 SetPlay undefined!!!"); return;}
	if(aIsTween !== undefined && aIsTween !== null) { this.isTween = aIsTween; }	
	if(aTargetX !== undefined && aTargetX !== null) { this.targetX = aTargetX; }
	if(aTargetY !== undefined && aTargetY !== null) { this.targetY = aTargetY; }
	if(this.visible === false) this.visible = true;
	if(this.alpha === 0) this.alpha = 1;
	
	
	this.angle = aAngle;	
	
	switch(aAnimaitonName)	{
		case  "IDLE" :					
			this.initX = aInitX;
			this.initY = aInitY;
			this.x = this.initX;
			this.y = this.initY;
			this.animations.play("IDLE");
		break;
		
		case  "PLAY" :						
			this.animations.play("PLAY");		
			if(this.isTween) this.playTweenBasic();
		break;
	}			
	console.log("EffComboAttFlyV1 aAnimaitonName is " + aAnimaitonName);
};

EffComboAttFlyV1.prototype.update = function () {
	//기존함수테스트
	this.gameProcess();	
};

EffComboAttFlyV1.prototype.gameProcess = function() {	
	this.processCharacter();
	this.animationOnComplete();
};

EffComboAttFlyV1.prototype.processCharacter = function() {	
	
};

EffComboAttFlyV1.prototype.animationOnComplete = function(){	
	if(this.animations.currentAnim.isFinished === false) return;	

	switch(this.animations.currentAnim.name) {
		case  "IDLE" :
			this.setPlay("PLAY", true, this.angle, this.initX, this.initY, this.targetX, this.targetY);
			break;
			
		case  "PLAY" :
			
			break;
	}
};

//현재 트위너 멈춤.
EffComboAttFlyV1.prototype.setDestoryTween = function(){	
	if(this.tweenA !== null)	{		
		this.tweenA.pendingDelete = true;
	}	
};

//트윈은 있는 동작만 추가한다.
EffComboAttFlyV1.prototype.playTweenBasic = function(){	
	this.setDestoryTween();
	this.tweenA = this.game.add.tween(this).to({ x: this.targetX, y: this.targetY }, 600, "Quart.easeIn");	
	this.tweenA.start();
	this.tweenA.onComplete.add(this.endTweenPlay, this);
};

EffComboAttFlyV1.prototype.endTweenPlay = function(){	
	//this.endObject.setPlay("PLAY", false, 750, 50);
	//this.endObject.setPlay("PLAY", false, 750, 50);
	//this.setPlay("PILE");
	//this.alpha = 0;
	//this.visible = false;
};