var invitationData; 

/**
 *  동전쌓기 게임 데이터
 */
var GameData = (function () {
	  var instance;
	  function init() {
	    return {
//			sessionID : "Guest_P7YdkW",
//			//sessionID : "43c65a4b-e0f6-4575-8d93-3f5d96c8325d",	//구수짱
//			userNickName : "Test101",
//			userCharacterType : 2,
//			otherCharacterType : 4,
//			uuid : 50,
//			  
			sessionID : "Guest_VjVbIJ", //세션 아이디   메인 홈페이지 세션아이디 공유
			//sessionID : "634708ce-a382-42e5-89d5-0e919330467f",	//서슬푸른
			userNickName : "Test102",   //닉네임
			userCharacterType : 4,     	//
			otherCharacterType : 2,
			uuid : 5006,
			  
			backgroundVolume : 50,
			effectVolume : 50,			
				
			gameGenerateDelay : 1,
			//gameURL : "http://192.168.0.8:7305",	//광렬님 컴터 Test용...
			gameURL : "",	//판 뒤집기 소켓 서버
			//gameURL = "http://192.168.0.9:3000";	//마이컴 Test용...
			gameSocketIP : "128.1.123.21",
			gameCode : "10000",
			roomNumber : "roomNumber000",
			roomTitle : "aaa",
			roomIsLock : 0,
			roomPlayTime : 0,
			roomPassword : 0,
			roomOwner : 1,
			roomSeverIndex : 1,
			backGround : 0,
			otherNickName : "",	  
			gamePlayMode : 1,
			gamePlayLevel : 0,
			isGameHelp : false,
			isInviteUser : false,
			isFriendVisitePopup : true,
			channelIndex : 0,	
			isStandByRoom : false,
		  
			result_score : 0,
			result_coin_count : 0,
			result_win_count : 0,	
			result_lose_count : 0,
			result_draw_count : 0,
			result_draw : false,
			//other_nick_name : "other000",
			result_other_score : 0,
			result_other_coin_count : 0,
			result_other_win_count : 0,
			result_other_lose_count : 0,
			result_other_draw_count : 0,
			result_win : true,
			
			rateLimitTime : 3000,	//3000msecond...
				
			setInvitation : function(aData){	
				invitationData = aData;
			},
			
			getInvitation : function(){	
			 	return invitationData;
			},
			  
	    };
	  };

	  return {
	    // Get the Singleton instance if one exists
	    // or create one if it doesn't
	    getInstance: function () {
	      if ( !instance ) {
	        instance = init();
	        //console.log( "The GameData init!!!" );
	      } else {
	    	  //console.log( "The GameData instance!" );
		  }
	      return instance;
	    }
	  };
	})();

