/**
 *
 */


function AudioManager (_game) {
	
	this.game = _game;
	
	this.nowBgm = null;
	
	this.bgmVolume = 0.5;
	this.sfxVolume = 0.5;
	this.bgmMute = false;
	this.sfxMute = false;
	
	this.playBgm = function(soundName) {
		_currentVolume = 0.0;
		
		//this.game.sound.play(soundName, bgmVolume, true);
		if (this.bgmMute == false) {
			_currentVolume = this.bgmVolume;
		}
		
		this.stopBgm();
		this.nowBgm = this.game.add.audio(soundName, _currentVolume, true);
		this.nowBgm.play();
		//loop = true
	};
	
	this.updateBgmVolume = function() {
		
		_currentVolume = 0.0;
		
		if (this.bgmMute == false) {
			_currentVolume = this.bgmVolume;
		}
		
		if (this.nowBgm != null) {
			this.nowBgm.volume = _currentVolume;
			this.nowBgm.update();
		}
	};
	
	this.playSfx = function(soundName) {
		if (this.sfxMute == false) {
			this.game.sound.play(soundName, this.sfxVolume, false);
			//loop = false
		}
	};
	
	this.playSfxLoop = function(soundName) {
		if (this.sfxMute == false) {
			this.game.sound.play(soundName, this.sfxVolume, true);
			//loop = true
		}
	};
	
	this.stopBgm = function() {
		if (this.nowBgm) {
			this.nowBgm.destroy();
		}
	};
	
	this.stopAllSound = function() {
		this.game.sound.stopAll();
	};
}

