
// -- user code here --

/* --- start generated code --- */

// Generated by  1.5.3 (Phaser v2.6.2)


/**
 * helpPopup.
 * @param {Phaser.Game} aGame A reference to the currently running game.
 * @param {Phaser.Group} aParent The parent Group (or other {@link DisplayObject}) that this group will be added to.    If undefined/unspecified the Group will be added to the {@link Phaser.Game#world Game World}; if null the Group will not be added to any parent.
 * @param {string} aName A name for this group. Not used internally but useful for debugging.
 * @param {boolean} aAddToStage If true this group will be added directly to the Game.Stage instead of Game.World.
 * @param {boolean} aEnableBody If true all Sprites created with {@link #create} or {@link #createMulitple} will have a physics body created on them. Change the body type with {@link #physicsBodyType}.
 * @param {number} aPhysicsBodyType The physics body type to use when physics bodies are automatically added. See {@link #physicsBodyType} for values.
 */
function helpPopup(aGame, aParent, aName, aAddToStage, aEnableBody, aPhysicsBodyType) {
	
	Phaser.Group.call(this, aGame, aParent, aName, aAddToStage, aEnableBody, aPhysicsBodyType);
	this.game.add.sprite(0.0, 0.0, 'PopupHelpPanel', null, this);
	
	this.game.add.sprite(277.0, 476.0, 'PopupHelpPagePanel', null, this);
	
	this.game.add.sprite(221.0, 35.0, 'PopupHelpTitleTxt', null, this);
	
	this.game.add.sprite(66.5, 82.5, 'PopupHelpContentPanel', null, this);
	
	this.game.add.button(527.0, -30.0, 'BtnExit', offHelpPopup, this, 1, 0, 2, null, this);
	
	var _BtnArrowR = this.game.add.button(630.0, 204.0, 'BtnArrowR', nextHelp, this, 1, 0, 2, null, this);
	
	var _BtnArrowL = this.game.add.button(-47.0, 204.0, 'BtnArrowL', prevHelp, this, 1, 0, 2, null, this);
	
	var _help0 = this.game.add.sprite(70.5, 86.5, 'PopupHelpContent1', null, this);
	
	var _help1 = this.game.add.sprite(70.5, 86.5, 'PopupHelpContent2', null, this);
	
	var _help2 = this.game.add.sprite(70.5, 86.5, 'PopupHelpContent3', null, this);
	
	var _help3 = this.game.add.sprite(70.5, 86.5, 'PopupHelpContent4', null, this);
	
	var _help4 = this.game.add.sprite(70.5, 86.5, 'PopupHelpContent5', null, this);
	
	var _help5 = this.game.add.sprite(70.5, 86.5, 'PopupHelpContent6', null, this);
	
	var _help6 = this.game.add.sprite(70.5, 86.5, 'PopupHelpContent7', null, this);
	
	var _help7 = this.game.add.sprite(70.5, 86.5, 'PopupHelpContent8', null, this);
	
	var _txt_page = this.game.add.text(340.0, 501.0, '1/8', {"font":"bold 20px Arial","fill":"#ffffff","align":"center"}, this);
	_txt_page.anchor.setTo(0.5, 0.5);
	
	this.game.add.button(250.0, 435.0, 'PopupHelpDontAgain', toggleNotShow, this, null, null, null, null, this);
	
	var _PopupHelpDontAgainCheck = this.game.add.sprite(248.0, 427.0, 'PopupHelpDontAgainCheck', null, this);
	
	
	
	// fields
	
	this.fBtnArrowR = _BtnArrowR;
	this.fBtnArrowL = _BtnArrowL;
	this.fHelp0 = _help0;
	this.fHelp1 = _help1;
	this.fHelp2 = _help2;
	this.fHelp3 = _help3;
	this.fHelp4 = _help4;
	this.fHelp5 = _help5;
	this.fHelp6 = _help6;
	this.fHelp7 = _help7;
	this.fTxt_page = _txt_page;
	this.fPopupHelpDontAgainCheck = _PopupHelpDontAgainCheck;
	
	this.images = [];
	this.helpPage = 0;
	this.isCheck = false;
	
	this.images.push(this.fHelp0);
	this.images.push(this.fHelp1);
	this.images.push(this.fHelp2);
	this.images.push(this.fHelp3);
	this.images.push(this.fHelp4);
	this.images.push(this.fHelp5);
	this.images.push(this.fHelp6);
	this.images.push(this.fHelp7);
	
	this.fHelp0.visible = true;
	this.fHelp1.visible = false;
	this.fHelp2.visible = false;
	this.fHelp3.visible = false;
	this.fHelp4.visible = false;
	this.fHelp5.visible = false;
	this.fHelp6.visible = false;
	this.fHelp7.visible = false;
	
	this.fPopupHelpDontAgainCheck.visible = false;
	
	this.fBtnArrowL.visible = false;
	
	this.game.audioManager.playSfx("Popup");
	
}

/** @type Phaser.Group */
var helpPopup_proto = Object.create(Phaser.Group.prototype);
helpPopup.prototype = helpPopup_proto;
helpPopup.prototype.constructor = helpPopup;

/* --- end generated code --- */
// -- user code here --

helpPopup.prototype.init = function() {
	if(getCookie("pan_help") == "check") {
		this.fPopupHelpDontAgainCheck.visible = true;
	}
};

var offHelpPopup = function(obj) {
	obj.game.audioManager.playSfx("Click");
	
	obj.game.popupManager.closePopup("help");
	obj.parent.destroy();
};

var prevHelp = function(obj) {
	obj.game.audioManager.playSfx("Click");
	
	obj.parent.helpPage -= 1;
	if(obj.parent.helpPage < 0) {
		obj.parent.helpPage = 0;
	}
	
	for(var i = 0 ; i < 8 ; i ++) {
		if(i == obj.parent.helpPage) {
			obj.parent.images[i].visible = true;
		}
		else {
			obj.parent.images[i].visible = false;
		}
	}
	
	if(obj.parent.helpPage == 0) {
		obj.parent.fBtnArrowL.visible = false;
	}
	else {
		obj.parent.fBtnArrowL.visible = true;
	}
	if(obj.parent.helpPage == 7) {
		obj.parent.fBtnArrowR.visible = false;
	}
	else {
		obj.parent.fBtnArrowR.visible = true;
	}
	
	obj.parent.fTxt_page.setText((obj.parent.helpPage + 1) + " / 8");
};

var nextHelp = function(obj) {
	obj.game.audioManager.playSfx("Click");
	
	obj.parent.helpPage += 1;
	if(obj.parent.helpPage >= 8) {
		obj.parent.helpPage = 7;
	}
	
	for(var i = 0 ; i < 8 ; i ++) {
		if(i == obj.parent.helpPage) {
			obj.parent.images[i].visible = true;
		}
		else {
			obj.parent.images[i].visible = false;
		}
	}
	
	if(obj.parent.helpPage == 0) {
		obj.parent.fBtnArrowL.visible = false;
	}
	else {
		obj.parent.fBtnArrowL.visible = true;
	}
	if(obj.parent.helpPage == 7) {
		obj.parent.fBtnArrowR.visible = false;
	}
	else {
		obj.parent.fBtnArrowR.visible = true;
	}
	
	obj.parent.fTxt_page.setText((obj.parent.helpPage + 1) + " / 8");
};

var toggleNotShow = function(obj) {
	obj.game.audioManager.playSfx("Tog_sound");
	
	obj.parent.fPopupHelpDontAgainCheck.visible = !obj.parent.fPopupHelpDontAgainCheck.visible; 
	if(obj.parent.fPopupHelpDontAgainCheck.visible) {
		setCookie("pan_help", "check", 365);
	}
	else {
		setCookie("pan_help", "-", -1);
	}
};
