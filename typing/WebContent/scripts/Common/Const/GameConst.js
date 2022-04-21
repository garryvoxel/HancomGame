var GameConst = (function () {
	  // Instance stores a reference to the Singleton
	  var instance;
	  function init() {
	    // Singleton
	    return {
	      // Public methods and variables
//	      publicMethod: function () {
//	        console.log( "The public can see me!" );
//	      },
//	      publicProperty: "I am also public",
	    	
	    	GameLanguageSaveType : {DUBEOLSIG : 0, QWERTY : 1, DVORAK : 2, SEBEOLSIG_390 : 3, SEBEOLSIG_SUNALAE : 4, SEBEOLSIG_FINAL : 5},
	    	
	    	GameStateType : {SEAT : 0, WORD : 1, SHORT : 2, LONG : 3},
	    	LanguageType : {HANGUL : 0, ENGLISH : 1},
	    	HangulType : {DUBEOLSIG : 0, SEBEOLSIG_390 : 1, SEBEOLSIG_SUNALAE : 2, SEBEOLSIG_FINAL : 3},
	    	EnglishType : {QWERTY : 0, DVORAK : 1},
	    	InputTotalCount : 120,			//자리, 낱말 연습 전체 횟수 
	    	ShortInputTotalCount : 33,		//짧은글 연습 전체 횟수
        LongReadHangulDataDiv: 42, // stg에 추가되어 있는데 사용처가 없는 듯
        LongReadEnglishDataDiv: 71, // stg에 추가되어 있는데 사용처가 없는 듯
	    	LongTestTime : 300,				//타자 검정 시간
	    	TypingSpeed : 150,				//목표 타수
	    	TypingAccuracy : 95,			//목표 정확도
	    	School : "초등학교",				//학교 정보

	    	GameAgentType : {"IE" : 0, "CHROM" : 1},
	    	GameWordType : {"NONE" : 0, "SEAT" : 1, "WORD" : 2, "SHORT" : 3, "LONG" : 4},
	    	GameStartType : {"WEB" : 0, "EDIT" : 1},
	    	StotyType : {"STORYSELECT" : 0, "STORYCALL" : 1, "STORYVANK" : 2, "EVENTCONCEPT" : 3},		//긴글 탭 (벤트, 불러오기, 반크, 개념원리) 
	    	LongGameType : {"LONGPRACTICE" : 0, "LONGTEST" : 1},	//긴글 연습, 긴글 타자 검정
	    	CharacterType : {"AMOGAE" : 0, "GIGI" : 1, "MOA" : 2, "MAMANG" : 3, "YUKBEE" : 4, "YAYA" : 5},
	    	
	    	sessionID : "3a13ecf1-2c8c-4f19-8901-1bf9d30f3baa",
			userNickName : "Test104",
			userCharacterType : 3,
			uuid : 5006,
	    };
	  };

	  return {
	    // Get the Singleton instance if one exists
	    // or create one if it doesn't
	    getInstance: function () {
	      if ( !instance ) {
	        instance = init();
//	        console.log( "The GameConst init!!!" );
	      } else {
//	    	  console.log( "The GameConst instance!" );
		  }
	      return instance;
	    }
	  };
	})();

