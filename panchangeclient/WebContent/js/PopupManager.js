function PopupManager (game) {
	this.popups = [];
	this.game = game;
	
	this.openPopup = function(name) {
		if(this.popups.indexOf(name) < 0) {
			if(this.popups.length == 0) {
				this.game.backscreen = this.game.add.tileSprite(0.0, 0.0, 1024.0, 576.0, 'ImgBTranslucency', null);
				this.game.backscreen.inputEnabled = true;
			}
			this.popups.push(name);
			return true;
		}
		else {
			return false;
		}
	};
	
	this.closePopup = function(name) {
		var idx = this.popups.indexOf(name);
		if(idx >= 0) {
			this.popups.splice(idx, 1);
		}
		if(this.popups.length == 0) {
			this.game.backscreen.destroy();
		}
	};
	
	this.clearPopup = function() {
		if(this.popups.length > 0) {
			this.popups = [];
			this.game.backscreen.destroy();
		}
	};
}

