var soundArray = [];

var SoundManager = (function() {
	// Instance stores a reference to the Singleton
	var instance;	
	var that;
	
	function init() {
		return {
			gameData : this.GameData.getInstance(),
			SoundNames : ["Ans_right", "Ans_wrong", "Click", "CoDown_3_2_1", "Coin_coat",
			                        "Coin_com", "Coin_des", "Coin_land", "Coin_score", "Draw",
			                        "G_Start", "Lose", "Popup", "Time_danger", "Vict",
			                        "Tog_sound", "Coin_Rm", "Coin_Lob", "Coin_Music"],
			                        
            SOUND_TYPE : {Ans_right : 0, Ans_wrong : 1, Click : 2, CoDown_3_2_1 : 3, Coin_coat : 4,
                        Coin_com : 5, Coin_des : 6, Coin_land : 7, Coin_score : 8, Draw : 9,
                        G_Start : 10, Lose : 11, Popup : 12, Time_danger : 13, Vict : 14,
                        Tog_sound : 15, Coin_Rm : 16, Coin_Lob : 17, Coin_Music : 18},

			setSoundArray : function(){
				for(var i = 0; i < this.SoundNames.length; i++){
					soundArray.push(that.game.add.audio(this.SoundNames[i]));
				}
			},
			
			play : function(aSoundName) {
				// BGM의 경우...'Coin_Music'
					var volume = 0.5;					
					if((aSoundName === this.SOUND_TYPE.Coin_Rm || aSoundName === this.SOUND_TYPE.Coin_Lob || aSoundName === this.SOUND_TYPE.Coin_Music) ){
						volume = (this.gameData.backgroundVolume / 100.0);
						soundArray[aSoundName].loop = true;
					} else {
						volume = (this.gameData.effectVolume / 100.0);
						if(aSoundName === this.SOUND_TYPE.Time_danger)
							soundArray[aSoundName].loop = true;
						else 
							soundArray[aSoundName].loop = false;
					}
					soundArray[aSoundName].volume = volume;
					soundArray[aSoundName].play();
			},

			stop : function(aSoundName) {
				soundArray[aSoundName].stop();			
			},
			
			pause : function(aSoundName) {
				soundArray[aSoundName].pause();			
			},
			
			resume : function(aSoundName) {
				var volume = 0.5;					
				if((aSoundName === this.SOUND_TYPE.Coin_Rm || aSoundName === this.SOUND_TYPE.Coin_Lob || aSoundName === this.SOUND_TYPE.Coin_Music) ){
					volume = (this.gameData.backgroundVolume / 100.0);
					soundArray[aSoundName].loop = true;
				} else {
					volume = (this.gameData.effectVolume / 100.0);
					if(aSoundName === this.SOUND_TYPE.Time_danger)
						soundArray[aSoundName].loop = true;
					else 
						soundArray[aSoundName].loop = false;
				}
				soundArray[aSoundName].volume = volume;
				soundArray[aSoundName].resume();			
			},

		};
	}

	return {
		getInstance : function(_that) {			
			if (!instance) {
				instance = init();
				that = _that;
				instance.setSoundArray();
				//console.log("The SoundManager init!!!");
			} else {
				//console.log("The SoundManager instance!");
			}
			return instance;
		}
	};
})();
