
// -- user code here --

/* --- start generated code --- */

// Generated by  1.5.2 (Phaser v2.6.2)


/**
 * FlowingLetterV1.
 * @param {Phaser.Game} aGame A reference to the currently running game.
 * @param {Phaser.Group} aParent The parent Group (or other {@link DisplayObject}) that this group will be added to.    If undefined/unspecified the Group will be added to the {@link Phaser.Game#world Game World}; if null the Group will not be added to any parent.
 * @param {string} aName A name for this group. Not used internally but useful for debugging.
 * @param {boolean} aAddToStage If true this group will be added directly to the Game.Stage instead of Game.World.
 * @param {boolean} aEnableBody If true all Sprites created with {@link #create} or {@link #createMulitple} will have a physics body created on them. Change the body type with {@link #physicsBodyType}.
 * @param {number} aPhysicsBodyType The physics body type to use when physics bodies are automatically added. See {@link #physicsBodyType} for values.
 */
function FlowingLetterV1(aGame, aParent, aName, aAddToStage, aEnableBody, aPhysicsBodyType) {
	
	Phaser.Group.call(this, aGame, aParent, aName, aAddToStage, aEnableBody, aPhysicsBodyType);
	
	this.beforeCreate();
	var _text = this.game.add.text(0.0, 0.0, 'This is a text abacdefghijklmn', {"font":"14px 나눔고딕","fill":"#959595"}, this);
	
	
	
	// fields
	
	this.fText = _text;
	
	this.afterCreate();
	
}

/** @type Phaser.Group */
var FlowingLetterV1_proto = Object.create(Phaser.Group.prototype);
FlowingLetterV1.prototype = FlowingLetterV1_proto;
FlowingLetterV1.prototype.constructor = FlowingLetterV1;

/* --- end generated code --- */
// -- user code here --

var mTextWidth;	//텍스트 넓이
//var mRectWidth;	//글자박스넓이
//var mSpeed;		//흐르는글자속도
//var mIsPlay; 	//흐르는글자시작여부
//var mMask;		//마스크
//var mInitTextPosX;	//처음 셋팅된 글자 X 위치.

FlowingLetterV1.prototype.beforeCreate = function() {
	
};

FlowingLetterV1.prototype.afterCreate = function() {
	this.visible = false;
	this.mIsPlay = false;
	
	mTextWidth = 0;
	this.mRectWidth = 0;
	this.mSpeed = 0;
	this.mInitTextPosX = 0;
	
	this.fText.mask = this.game.add.graphics(0, 0);
};

FlowingLetterV1.prototype.update = function () {	
	if(this.mIsPlay){
		this.fText.x -= this.mSpeed;
		if( (this.fText.x + mTextWidth + 25) <= this.mInitTextPosX){	//글자총길이 + 25 가 처음셋팅 위치를 벗어난경우 재 셋팅해준다.
			this.fText.x = this.mInitTextPosX + this.mRectWidth;	//재 시작은 박스 바로 뒤에서...
		}
	}
};

//aText(글자-변경시), aSpeed(글자 흐르는 속도), aRectPosX(글자박스위치X), aRectPosY(글자박스위치Y), aRectWidth(글자박스넓이), aRectHeight(글자박스높이)
FlowingLetterV1.prototype.setText = function(aText, aSpeed, aRectPosX, aRectPosY, aRectWidth, aRectHeight, aIsPlay) {
	
	this.visible = true;
	this.mIsPlay = aIsPlay;
	
	this.fText.text = aText;
	this.fText.x = 0;
	this.mInitTextPosX = this.fText.x;
	this.mInitTextPosY = aRectPosY;
	
	this.mSpeed = aSpeed;
	
	this.mRectWidth = aRectWidth;
		
//	this.fText.mask = this.game.add.graphics(0, 0);
	this.fText.mask.beginFill(0x000000);
	this.fText.mask.drawRect(aRectPosX,aRectPosY,aRectWidth,aRectHeight);
	
	var ctx = this.fText.canvas.getContext("2d");
	ctx.font = this.fText.font;
	var text = ctx.measureText(this.fText.text);
//	this.mTextWidth = text.width;
	if(mTextWidth < text.width)
		mTextWidth = text.width; 
};

FlowingLetterV1.prototype.setPlay = function(){
	this.mIsPlay = true;
};