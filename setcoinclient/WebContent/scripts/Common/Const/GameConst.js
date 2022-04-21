var GameConst = (function () {
	  var instance;
	  function init() {
	    return {
	     getMessageString: function (aMessage, arg1, arg2, args3) {	    	  
	    	var stringMessage = aMessage;
	        if(arg1 !== undefined && arg1 !== null){
	        	stringMessage = stringMessage.replaceAll("$1", arg1);
	        }
	        
	        if(arg2 !== undefined && arg2 !== null){
	        	stringMessage = stringMessage.replaceAll("$2", arg2);
	        }	        
	        
	        if(arg3 !== undefined && arg3 !== null){
	        	stringMessage = stringMessage.replaceAll("$3", arg3);
	        }
	        return stringMessage;
	      },
	      
	      getPopupServerMessage: function (index){
	    	  if(this.ErrorCode !== undefined && this.ErrorCode.properties !== undefined && this.ErrorCode.properties[index] !== undefined){
	    		  if(this.ErrorCode.properties[index].explain !== ""){
		    		  return this.ErrorCode.properties[index].explain;
		    	  }
		    	  return this.ErrorCode.properties[index].code;  
	    	  } else {
	    		  console.log("[Caution!!] Server Error is " + index);
	    	  }
	    	  return index.toString();	    	   
	      },
	    	  
	      ComboTextEffectNames : ["combo_effText_1", "combo_effText_2", "combo_effText_3", "combo_effText_4", "combo_effText_5", "combo_effText_6"],
	      ComboGaugeNames : ["ui_comboGaugeSheet_q1", "ui_comboGaugeSheet_q2", "ui_comboGaugeSheet_q3", "ui_comboGaugeSheet_q4", "ui_comboGaugeSheet_q5"],
	      CharacterNames : ["아모개", "지지", "모아", "마망", "육비", "야야"],
	      
		  //enum
		  GameModeType : {AI : 0, VS_1 : 1},		  
		  WordType : {BASIC : 0, ATTACK_1 : 1, ATTACK_2 : 2, ATTACK_3 : 3, ATTACK_4 : 4},
		  GameStateType : {ENTER : 0, READY : 1, START : 2, INGAME_FINISH : 3, INGAME_END_READY : 4, INGAME_END : 5, INGAME_END_ANIMATION : 6, RESULT : 7, OUTGAME_END : 8},	
		  GameStateOption : {NONE : 0, DROP_ANI : 1},
		  GameLevel : {NORMAL : 0, HARD : 1},
		  Toggle : {OFF : 0, ON : 1},
		  NetState : {YET : 0, COMPLETE : 1},		  
		  RoomPasswordSateType : {ROOM_LIST : 0, ROOM_CREATE : 1, ROOM_FASTER : 2, ROOM_SEARCH : 3, ROOM_RESET : 4, ROOM_INVITE : 5},
		  NextLoginType : {ROOM_CREATE : 0, ROOM_ENTER_ROOM_LIST : 1, ROOM_ENTER_FASTER : 2, ROOM_ENTER_ROOM_SEARCH : 3, ROOM_RESET : 4, ROOM_INVITE : 5},
		  PopupType : {BULE_ONE_BUTTON : 0, BLUE_TWO_BUTTON : 1, RED_ONE_BUTTON : 2, RED_TWO_BUTTON : 3, RED_ONE_BUTTON_GAME_OUT : 4},
		  CHARACTER_TYPE : {"AMOGAE":0, "GIGI":1, "MOA":2, "MAMANG":3, "YUKBEE":4, "YAYA":5},
		  
		  ErrorCode : {
			  properties: {
			    0: {code: "SUCCESS", explain: ""},
			    
			    200: {code: "LOGIN_PARAMETER", explain: "로그인에 문제가 발생했습니다.\n게임을 종료합니다."},
			    201: {code: "LOGIN_API_SERVER", explain: "로그인에 문제가 발생했습니다.\n게임을 종료합니다."},
			    202: {code: "LOGIN_SESSION_ID", explain: "이미 다른 경로로 접속이\n되어있어 게임을 종료합니다."},
			    203: {code: "LOGIN_REQUEST_API_SERVER_GAME_RESULT", explain: "로그인에 문제가 발생했습니다.\n게임을 종료합니다."},
			    204: {code: "LOGIN_DUPLICATION", explain: "이미 다른 경로로 접속이\n되어있어 게임을 종료합니다."},
			    
			    300: {code: "CREATE_ROOM_PARAMETER", explain: "방 생성을 실패했습니다."},
			    301: {code: "CREATE_ROOM_NICK_NAME_DUPLICATION", explain: "방 생성을 실패했습니다."},
			    302: {code: "CREATE_ROOM_ROOM_NULL", explain: "방 생성을 실패했습니다."},
			    303: {code: "CREATE_ROOM_SESSION_ID", explain: "이미 다른 경로로 접속이\n되어있어 게임을 종료합니다."},
			    304: {code: "CREATE_ROOM_API_SERVER_ROOM_NUMBER", explain: "방 생성을 실패했습니다."},
			    305: {code: "CREATE_ROOM_USER_NICKNAME", explain: "방 생성을 실패했습니다."},
			    306: {code: "CREATE_ROOM_ROOM_NULL_2", explain: "방 생성을 실패했습니다."},
			    307: {code: "CREATE_ROOM_API_SERVER_ROOM_LIST", explain: "방 생성을 실패했습니다."},
			    308: {code: "CREATE_ROOM_API_SERVER_ROOM_NUMBER2", explain: "방 생성을 실패했습니다."},
			    309: {code: "CREATE_ROOM_ROOM_NUMBER_DUPLICATION", explain: "다시 방을 만들어주세요."},
			    
			    400: {code: "CHANGE_ROOM_OPTION_PARAMETER", explain: "방 옵션 변경을 실패했습니다."},
			    401: {code: "CHANGE_ROOM_OPTION_SESSION_ID", explain: "이미 다른 경로로 접속이\n되어있어 게임을 종료합니다."},
			    402: {code: "CHANGE_ROOM_OPTION_ROOM_NULL", explain: "방 옵션 변경을 실패했습니다."},
			    403: {code: "CHANGE_ROOM_OPTION_HOST_USER_NULL", explain: "방 옵션 변경을 실패했습니다."},
			    404: {code: "CHANGE_ROOM_OPTION_HOST_USER", explain: "방 옵션 변경을 실패했습니다."},
			    405: {code: "CHANGE_ROOM_OPTION_API_SERVER", explain: "방 옵션 변경을 실패했습니다."},
			    
			    500: {code: "GAME_INVITE_PRAMETER", explain: "게임 초대를 실패했습니다."},
			    501: {code: "GAME_INVITE_SESSION_ID", explain: "이미 다른 경로로 접속이\n되어있어 게임을 종료합니다."},
			    502: {code: "GAME_INVITE_ROOM_NULL", explain: "게임 초대를 실패했습니다."},
			    503: {code: "GAME_INVITE_USER_NULL", explain: "게임 초대를 실패했습니다."},
			    
			    600: {code: "ENTER_ROOM_PARAMETER", explain: "입장할 수 있는 방이 없습니다."},
			    601: {code: "ENTER_ROOM_ROOM", explain: "입장할 수 있는 방이 없습니다."},
			    602: {code: "ENTER_ROOM_GAME_PLAYING", explain: "이미 게임이 시작되었습니다."},
			    603: {code: "ENTER_ROOM_HOST_USER", explain: "입장할 수 있는 방이 없습니다."},
			    604: {code: "ENTER_ROOM_ENTER_USER", explain: "입장할 수 있는 방이 없습니다."},
			    605: {code: "ENTER_ROOM_PASSWORD", explain: "패스워드가 틀렸습니다."},
			    606: {code: "ENTER_ROOM_SESSION_ID", explain: "이미 다른 경로로 접속이 되어있어 게임을 종료합니다."},
			    
			    700: {code: "GAME_READY_PARAMETER", explain: "게임 시작을 실패했습니다."},
			    701: {code: "GAME_READY_SESSION_ID", explain: "이미 다른 경로로 접속이 되어있어 게임을 종료합니다."},
			    702: {code: "GAME_READY_ROOM", explain: "게임 시작을 실패했습니다."},
			    703: {code: "GAME_READY_ENTERFINISHED", explain: "게임 시작을 실패했습니다."},
			    704: {code: "GAME_READY_USER", explain: "게임 시작을 실패했습니다."},
			    
			    800: {code: "NEW_WORD_PARAMETER", explain: "단어 요청을 실패했습니다."},
			    801: {code: "NEW_WORD_SESSION_ID", explain: "이미 다른 경로로 접속이 되어있어 게임을 종료합니다."},
			    802: {code: "NEW_WORD_ROOM", explain: "단어 요청을 실패했습니다."},
			    803: {code: "NEW_WORD_USER", explain: "단어 요청을 실패했습니다."},
			    804: {code: "NEW_WORD_OTHER_USER", explain: "단어 요청을 실패했습니다."},
			    805: {code: "NEW_WORD_GAMEPLAYING", explain: "단어 요청을 실패했습니다."},
			    
			    900: {code: "CHECK_WORD_PARAMETER", explain: "단어 검증을 실패했습니다."},
			    901: {code: "CHECK_WORD_SESSION_ID", explain: "이미 다른 경로로 접속이 되어있어 게임을 종료합니다."},
			    902: {code: "CHECK_WORD_ROOM", explain: "단어 검증을 실패했습니다."},
			    903: {code: "CHECK_WORD_USER", explain: "단어 검증을 실패했습니다."},
			    904: {code: "CHECK_WORD_OTHER__USER", explain: "단어 검증을 실패했습니다."},
			    905: {code: "CHECK_WORD_FAIL", explain: "단어 검증을 실패했습니다."},
			    906: {code: "CHECK_WORD_GAMEPLAYING", explain: "단어 검증을 실패했습니다."},
			    
			    1000: {code: "LEAVE_ROOM_PARAMETER", explain: "방 나가기에 실패했습니다."},
			    1001: {code: "LEAVE_ROOM_SESSION_ID", explain: "이미 다른 경로로 접속이\n되어있어 게임을 종료합니다."},
			    1002: {code: "LEAVE_ROOM_ROOM", explain: "방 나가기에 실패했습니다."},
			    1003: {code: "LEAVE_ROOM_USER", explain: "방 나가기에 실패했습니다."},
			    1004: {code: "LEAVE_ROOM_IN_ROOM", explain: "방 나가기에 실패했습니다."},
			    1005: {code: "LEAVE_ROOM_OTHER_USER", explain: "방 나가기에 실패했습니다."},
			    
			    1100: {code: "GAME_RESULT_ROOM", explain: "게임 결과 처리를 실패했습니다."},
			    1101: {code: "GAME_RESULT_USER", explain: "게임 결과 처리를 실패했습니다."},
			    1102: {code: "GAME_RESULT_OTHER_USER", explain: "게임 결과 처리를 실패했습니다."},
			    1103: {code: "GAME_RESULT_GAME_OVER", explain: "게임 결과 처리를 실패했습니다."},
			    
			    1200: {code: "INPUT_WORD_TIME_OVER_PARAMETER", explain: "네트워크 에러가 발생했습니다."},
			    1201: {code: "INPUT_WORD_TIME_OVER_SESSION_ID", explain: "이미 다른 경로로 접속이 되어있어 게임을 종료합니다."},
			    1202: {code: "INPUT_WORD_TIME_OVER_ROOM", explain: "네트워크 에러가 발생했습니다."},
			    1203: {code: "INPUT_WORD_TIME_OVER_USER", explain: "네트워크 에러가 발생했습니다."},
			    1204: {code: "INPUT_WORD_TIME_OVER_OTHER_USER", explain: "네트워크 에러가 발생했습니다."},
			    1205: {code: "INPUT_WORD_TIME_OVER_FAIL", explain: "네트워크 에러가 발생했습니다."},
			    
			    1300: {code: "TOWER_FALL_PARAMETER", explain: "네트워크 에러가 발생했습니다."},
			    1301: {code: "TOWER_FALL_SESSION_ID", explain: "이미 다른 경로로 접속이 되어있어 게임을 종료합니다."},
			    1302: {code: "TOWER_FALL_ROOM", explain: "네트워크 에러가 발생했습니다."},
			    1303: {code: "TOWER_FALL_USER", explain: "네트워크 에러가 발생했습니다."},
			    1304: {code: "TOWER_FALL_OTHER_USER", explain: "네트워크 에러가 발생했습니다."},
			    1305: {code: "TOWER_FALL_HEART_COUNT", explain: "네트워크 에러가 발생했습니다."},
			    
			    1400: {code: "GAME_RESULT_PARAMETER", explain: "게임 결과처리 실패했습니다."},
			    1401: {code: "GAME_RESULT_SESSION_ID", explain: "이미 다른 경로로 접속이 되어있어 게임을 종료합니다."},
			    1402: {code: "GAME_RESULT_ROOM", explain: "게임 결과처리 실패했습니다."},
			    1403: {code: "GAME_RESULT_USER", explain: "게임 결과처리 실패했습니다."},
			    1404: {code: "GAME_RESULT_OTHER_USER", explain: "게임 결과처리 실패했습니다."},
			    1405: {code: "GAME_RESULT_GAME_OVER", explain: "게임 결과처리 실패했습니다."},
			    1406: {code: "GAME_RESULT_TIME_OVER", explain: "게임 결과처리 실패했습니다."},
			    
			    1500: {code: "RE_GAME_START_PARAMETER", explain: "게임 재시작 실패했습니다."},
			    1501: {code: "RE_GAME_START_SESSION_ID", explain: "이미 다른 경로로 접속이 되어있어 게임을 종료합니다."},
			    1502: {code: "RE_GAME_START_ROOM", explain: "게임 재시작 실패했습니다."},
			    1503: {code: "RE_GAME_START_USER", explain: "게임 재시작 실패했습니다."},
			    1504: {code: "RE_GAME_START_OTHER_USER", explain: "상대가 나가서 게임을 시작할 수 없습니다."},
			    
			    1600: {code: "CHECK_ROOM_PARAMETER", explain: "게임 상태를 체크중입니다."},
			    1601: {code: "CHECK_ROOM_SESSION", explain: "이미 다른 경로로 접속이 되어있어 게임을 종료합니다."},
			    1602: {code: "CHECK_ROOM_ROOM", explain: "게임 상태를 체크중입니다."},
			    1603: {code: "CHECK_ROOM_USER", explain: "게임 상태를 체크중입니다."},
			    1604: {code: "CHECK_ROOM_USER_COUNT", explain: "게임 상태를 체크중입니다."},
			    
			    1700: {code: "HOW_GAME_PARAMETER", explain: "상대 유저가 나갔습니다."},
			    1701: {code: "HOW_GAME_SESSION", explain: "이미 다른 경로로 접속이 되어있어 게임을 종료합니다."},
			    1702: {code: "HOW_GAME_ROOM", explain: "상대 유저가 나갔습니다."},
			    1703: {code: "HOW_GAME_USER", explain: "상대 유저가 나갔습니다."},
			    1704: {code: "HOW_GAME_USER_COUNT", explain: "상대 유저가 나갔습니다."},
			    
			    3000: {code: "GET_SESSION_ID", explain: "네트워크 에러가 발생했습니다."},
			    3101: {code: "MYSQL_READ_BY_SESSION_NOT_INFO", explain: "세션이 만료되었습니다."},
			    3102: {code: "MYSQL_READ_BY_SESSION_QUERY", explain: "DB요청 실패하였습니다."},
			    
			    4000: {code: "GET_ROOM_NUMBER_REDIS", explain: "네트워크 에러가 발생했습니다."},
			    4001: {code: "GET_ROOM_NUMBER_EMPTY", explain: "네트워크 에러가 발생했습니다."},
			    4002: {code: "GET_ROOM_NUMBER_REDIS2", explain: "네트워크 에러가 발생했습니다."},
			    4003: {code: "GET_ROOM_NUMBER_EMPTY2", explain: "네트워크 에러가 발생했습니다."},
			    
			    4100: {code: "RETURN_ROOM_NUMBER_REDIS", explain: "네트워크 에러가 발생했습니다."},
			    4101: {code: "RETURN_ROOM_NUMBER_REDIS_RES", explain: "네트워크 에러가 발생했습니다."},
			    
			    7604: {code: "ENTER_ROOM_NOT_EXIST", explain: "입장할 수 있는 방이 없습니다."},
			    
			    
			    10000: {code: "STATUS ERROR", explain: "네트워크 에러가 발생했습니다."},
			    10303: {code: "CHECK_PROHIBIT_WORDS_NO_WORDS", explain: "비속어가 포함되어 있습니다\n 다시 입력해주세요."},
			  }
			},
		
		  BackGround : ["랜덤", "산", "우주", "눈 덮인 산", "바다 속", 	"빌딩", "고목나무", "노을 지는 산", "동굴", "없음"],
		  
//		  sessionID : "0x0001",
//		  userNickName : "Test0001",
//		  userCharacterType : 2,
//		  otherCharacterType : 4,
//		  uuid : 50,
		  
//		  sessionID : "0x0002",
//		  userNickName : "Test0002",
//		  userCharacterType : 4,
//		  otherCharacterType : 2,
//		  uuid : 5006,
//		  
//		  gameGenerateDelay : 3,
//		  //gameURL : "http://192.168.0.8:7305",	//광렬님 컴터 Test용...
//		  gameURL : "https://dev-tt-coin-rt.malangmalang.com",	//아마존
//		//gameURL = "http://192.168.0.9:3000";	//마이컴 Test용...
//		  gameSocketIP : "128.1.123.21",
//		  gameCode : "10000",
//		  roomNumber : "roomNumber000",
//		  roomTitle : "aaa",
//		  roomIsLock : 0,
//		  roomPlayTime : 0,
//		  roomPassword : 0,		
//		  roomOwner : 1,
//		  backGround : 0,
//		  otherNickName : "",	  
//		  gamePlayMode : 1,
		  
		  
//		  //gameURL : "http://192.168.0.9:3000",	//마이컴 Test용...
		  
//		  rateLimitTime : 3000,	//3000msecond...

//		  AlarmTitle : {
//			  PASSWORD_SET_TITLE : "비밀번호 설정",
//			  },
//			  
//		  AlarmDescription : {
//			  NOT_SEARCH_ROOM : "조건과 일치하는 방을 찾지\n못했습니다.",
//			  PASSWORD_INPUT : "4자리 숫자로 비밀번호를 입력해 주세요.",
//			  PASSWORD_INPUT_WRONG : "입력하신 비밀번호가 틀립니다.",
//			  EXSIT_PERSON_IN_ROOM : "방에 이미 다른 사용자가\n 입장하였습니다.\n다른 방을 선택해 주세요.",
//			  ROOM_NAME_WRONG : "최소 4글자 12글자 이내의\n 바른말로 방 이름을 설정해 주세요.",
//			  
//			  ROOM_PASSWORD_CONFIRM : " '$1'으로 \n비밀번호가 설정되었습니다.",
//			  ROOM_INVITE_EXCESS : "초대 가능한 친구 수를 초과했습니다.\n잠시 후 다시 시도해 주십시오.",
//			  INVITE_REFUSE : "'$1'님이 초대를 거부했습니다.",
//			  INVITE_FAIL : "'$1'님이 초대를 실패했습니다.",
//			  INVITE_MESSAGE_POPUP : "$1 님이 $2 에서 초대했습니다.\n(비밀번호 : $3)",
//			  
//			  GAME_ALREAY_START : "게임이 이미 시작되었습니다.",
//			  NOT_EMPTY_ROOM : "빈방이 없습니다.\n다시 자동 입장을 선택하시거나\n새 방을 만들어 주세요."
//			  },
//			  
//			  
//		  CautionTitle : {
//			  HUMAN_USER_TITLE : "접속불가",
//			  },
//			  
//		  CautionDescription : {
//			  HUMAN_USER : "이전에 게임을 강제  종료한 기록이\n있어서 게임 접속을 할 수 없습니다.\n잠시 후 다시 접속해 주세요.",
//			  SYSTEM_ERROR : "시스템 오류가 발생하였습니다.\다시 실행 해 주시기 바랍니다.",
//			  },
			  
	    };
	  }

	  return {
	    getInstance: function () {
	      if ( !instance ) {
	        instance = init();
	        //console.log( "The GameConst init!!!" );
	      } else {
	    	  //console.log( "The GameConst instance!" );
		  }
	      return instance;
	    }
	  };
	})();

