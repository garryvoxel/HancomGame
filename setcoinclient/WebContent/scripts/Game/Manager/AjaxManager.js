var channels_url;
var session_id_login_url;
var auto_enter_url;
var request_room_list_url;
var request_room_total_count_url;
var search_host_name_url;
var search_room_num_url;
  
var friend_list_url;

var start_end_game_url;
//  
//Data - Request
var reqSessionIDLoginData = {
	"session_id" : "Test001",
};
  
//자동입장.
var reqAutoEnterData = {
	"no_send": 0,
	"server_idx": 0
};

var reqLoadRoomCountData = {
	"server_idx": 0,	
};

//룸 불러오기.
var reqLoadRoomData = {
	"page":1,
	"server_idx": 0
};
  
//별명으로 룸 찾기.
var reqNicknameRoomSearchData = {
	"nick_name":"hunt",
	"server_idx": 0
};
  
//별명으로 방번호 찾기.
var reqRoomNumberRoomSearchData = {
	"room_number":102,
	"server_idx": 0
};

var reqLogStartEndGameData = {
	"uuid": 99,
	"nick_name": "헌트",
	"play_mode": 2,
	"other_nick_name": "",
	"end_state": 1,
	"win_lose": 2,
	"score": 100,
	"game_start_time": "",
	"game_end_time":"",	
};

var reqLogShareFacebookData= {
	  "uuid": 99,
	  "nick_name": "헌트",
	  "tier_1": "",
	  "tier_2": 0,
	  "personal_rank":0,
	  "school_rank":0,
	  "score":87,
	  "win_count":2,
	  "typing_count":0,
	  "acc":53,
	  "pos":2
};

var reqLogShareKakaoData = {
	  "uuid": 99,
	  "nick_name": "헌트",
	  "tier_1": "",
	  "tier_2": 0,
	  "personal_rank":0,
	  "school_rank":0,
	  "score":87,
	  "win_count":2,
	  "typing_count":0,
	  "acc":53,
	  "pos":2
};

////친구 리스트 불러오기.
//var reqFriendListData = {	
//	session_id : "11111"
//};
  
  
  //Data - ResponseData
  var resSessionIDLoginData = {
	  "result": 0,
	  "uuid" : 1,
	  "nick_name" : "nickName000",
	  "character_type" : 0
  };
  
  //자동입장.
  var resAutoEnterData = {
	  "result": 0,
	  "room_number": 1,		  
	  "host_name": '헌트',
	  "is_lock": '1',
	  "is_single": '1',
	  "room_title": '다함께 한판',
	  "ip": '218.235.226.242',
	  "play_time" : '1',
	  "password" : "",
	  "back_ground ": '4',
	  "server_idx" : "1"
  };
  
//룸 불러오기.
  var resLoadRoomCountData = {
	"result" : 0,
	"count" : 33
  };
  
  var resLoadRoomDataArray = [];
  
  var resLoadRoomData = {		  
	  "room_number": 1,
	  "room_title": '다함께 한판',
	  "host_name": '헌트',
	  "is_lock": '1',
	  "is_single": '1',		  
	  "play_time": '1',
	  "back_ground": '4',
	  "password" : "",
	  "ip": '218.235.226.242',
	  "server_idx" : "1"
  };
  
//별명으로 룸 찾기.
  var resNicknameRoomSearchData = {
	  "result": 0,
	  "room_number": "103",
	  "host_name": "hunt103",
	  "is_lock": "1",
	  "is_single": "0",
	  "room_title": "고고103",
	  "ip": "128.1.123.21",
	  "play_time" : '1',
	  "password" : "",
	  "back_ground ": '4',
	  "server_idx" : "1"
  };
  
//방번호로 룸 찾기.
  var resRoomNumberRoomSearchData = {
	  "result": 0,
	  "room_number": "102",
	  "host_name": "hunt102",
	  "is_lock": "1",
	  "is_single": "0",
	  "room_title": "고고102",
	  "ip": "128.1.123.1",
	  "play_time" : '1',
	  "password" : "",
	  "back_ground ": '4',
	  "server_idx" : "1"
  };  

  var resLogStartEndGameData = {
	  "result" : 0
 };
  
  var resLogShareFacebookData = {
	  "result" : 0
 };
  
  var resLogShareKakaoData = {
	  "result" : 0
 };  
////친구 리스트 불러오기.
//  var resFriendListData = {
//	  NickName: "saimter",
//	  Img: "ch03.png",
//	  ClanID : 0,
//	  flag_state : "1",
//	  clan_name:"미가입"
//  };
  
  
	  
	  
var AjaxManager = (function () {
	  var instance;
	  
	  
	  
	  function init() {
	    return {
	    	
        config : Config.getInstance(),        
	    setURL : function(){
	    	//session_id_login_url = this.config.getGameAPIURL() + "request_userinfo2";
	    	channels_url = this.config.getGameAPIURL() + "web/v1/channels";
	    	session_id_login_url = this.config.getGameAPIURL() + "web/v1/login";
	  	    auto_enter_url = this.config.getGameAPIURL() + "setcoin/auto_enter";
	  	    request_room_list_url = this.config.getGameAPIURL() + "setcoin/request_room_list";
	  	    request_room_total_count_url = this.config.getGameAPIURL() + "setcoin/get_total_room_list";
	  	    search_host_name_url = this.config.getGameAPIURL() + "setcoin/search_host_name";
	  	    search_room_num_url = this.config.getGameAPIURL() + "setcoin/search_room_num";
	  	  
	  	    friend_list_url = this.config.getGameAPIURL() + "web/v1/my/friends";
	  	    
	  	    start_end_game_url = this.config.getGameAPIURL() + "setcoin/start_end_game_log";
	  	    share_facebook_url = this.config.getGameAPIURL() + "setcoin/write_share_facebook";
	  	    share_kakao_url = this.config.getGameAPIURL() + "setcoin/write_share_kakao";
	    },	
	    	  
    	//================================== Request ===========================================
//    	  netReqSessionIDLogin : function(aSessionID, aSuccessCallBack, aFailCallBack){
//    	  	reqSessionIDLoginData.session_id = aSessionID;   	  	
//    	  	this.netReqAjax(session_id_login_url, reqSessionIDLoginData, instance.netResSessionIDLogin, this.netResError, aSuccessCallBack, aFailCallBack);
//    	  },
	      netReqChannelUrl : function(aChannelID, aSuccessCallBack, aFailCallBack){
	    	var channelurl = channels_url + "/" + aChannelID.toString();
      		var data = aChannelID;      		
      		
      		this.netReqAjaxGet(channelurl, data, "", instance.netResChannelUrl, this.netResError, aSuccessCallBack, aFailCallBack);
    	  }, 
	    
	  	  netReqSessionIDLogin : function(aSessionID, aSuccessCallBack, aFailCallBack){
	  		var bearerToken =  aSessionID;
      		var data = "";
      		
      		this.netReqAjaxGet(session_id_login_url, data, bearerToken.toString(), instance.netResSessionIDLogin, this.netResError, aSuccessCallBack, aFailCallBack);
	  	  },
    	  
    	  netReqAutoEnter : function(aChannelIndex, aSuccessCallBack, aFailCallBack){	
    		reqAutoEnterData.no_send = 0;    
    		reqAutoEnterData.server_idx = aChannelIndex;
    		this.netReqAjax(auto_enter_url, reqAutoEnterData, instance.netResAutoEnter, this.netResError, aSuccessCallBack, aFailCallBack);
      	  },
      	  
    	  netReqLoadRoom : function(aPage, aChannelIndex, aSuccessCallBack, aFailCallBack){	
    		reqLoadRoomData.page = aPage;
    		reqLoadRoomData.server_idx = aChannelIndex;
      	  	this.netReqAjax(request_room_list_url, reqLoadRoomData, instance.netResLoadRoom, this.netResError, aSuccessCallBack, aFailCallBack);
      	  },
      	  
      	  netReqLoadRoomCount : function(aChannelIndex, aSuccessCallBack, aFailCallBack){	
    		reqLoadRoomCountData.server_idx = aChannelIndex;    		

    		var jsonPack = {};    		
    		var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(reqLoadRoomCountData), "!eogksalsrnrakstp@#");
    		jsonPack.packet = "" + ciphertext;    		

    		this.netReqAjax(request_room_total_count_url, jsonPack, instance.netResLoadRoomCount, this.netResError, aSuccessCallBack, aFailCallBack);
      	  },
      	  
      	  netReqNicknameRoomSearch : function(aNickName, aChannelIndex, aSuccessCallBack, aFailCallBack){	
      		reqNicknameRoomSearchData.nick_name = aNickName;
      		reqNicknameRoomSearchData.server_idx = aChannelIndex;
    	  	this.netReqAjax(search_host_name_url, reqNicknameRoomSearchData, instance.netResNicknameRoomSearch, this.netResError, aSuccessCallBack, aFailCallBack);
    	  },
    	  
    	  netReqRoomNumberRoomSearch : function(aRoomNum, aChannelIndex, aSuccessCallBack, aFailCallBack){	
    		reqRoomNumberRoomSearchData.room_number = aRoomNum;
    		reqRoomNumberRoomSearchData.server_idx = aChannelIndex;      	  
      	  	this.netReqAjax(search_room_num_url, reqRoomNumberRoomSearchData, instance.netResRoomNumberRoomSearch, this.netResError, aSuccessCallBack, aFailCallBack);
      	  },
      	  
      	  netReqFriendList : function(aSessionID, aSuccessCallBack, aFailCallBack){      		
      		var bearerToken =  aSessionID;
      		var data = "count=100";
      		
      		this.netReqAjaxGet(friend_list_url, data, bearerToken.toString(), instance.netResFriendList, this.netResError, aSuccessCallBack, aFailCallBack);
    	  },
    	  
    	  netReqLogStartEndGame : function(aUUID, aNickName, aPlayMode, aOtherNickName, aEndState, aWinLose, aScore, aGameStateTime, aGameEndTime, aSuccessCallBack, aFailCallBack){      		
    		  reqLogStartEndGameData.uuid = aUUID;
    		  reqLogStartEndGameData.nick_name = aNickName;
    		  reqLogStartEndGameData.play_mode = aPlayMode;
    		  reqLogStartEndGameData.other_nick_name = aOtherNickName;
    		  reqLogStartEndGameData.end_state = aEndState;
    		  reqLogStartEndGameData.win_lose = aWinLose;
    		  reqLogStartEndGameData.score = aScore;
    		  reqLogStartEndGameData.game_start_time = aGameStateTime;
    		  reqLogStartEndGameData.game_end_time = aGameEndTime;	
    		
    		  this.netReqAjax(start_end_game_url, reqLogStartEndGameData, instance.netResLogStartEndGame, this.netResError, aSuccessCallBack, aFailCallBack);
      	  }, 
      	  
      	  netReqLogShareFacebook : function(aUUID, aNickName, aTierOne, aTierTwo, aPersonalRank, aSchoolRank, aScore, aWinCount, aTypingCount, aAcc, aPos, aSuccessCallBack, aFailCallBack){      		
			  reqLogShareFacebookData.uuid = aUUID;
			  reqLogShareFacebookData.nick_name = aNickName,
			  reqLogShareFacebookData.tier_1 = aTierOne,
			  reqLogShareFacebookData.tier_2 = aTierTwo,
			  reqLogShareFacebookData.personal_rank = aPersonalRank,
			  reqLogShareFacebookData.school_rank = aSchoolRank,
			  reqLogShareFacebookData.score = aScore,
			  reqLogShareFacebookData.win_count = aWinCount,
			  reqLogShareFacebookData.typing_count = aTypingCount,
			  reqLogShareFacebookData.acc = aAcc,
			  reqLogShareFacebookData.pos = aPos,
	  		
	  		  this.netReqAjax(share_facebook_url, reqLogShareFacebookData, instance.netResLogShareFacebook, this.netResError, aSuccessCallBack, aFailCallBack);
    	  }, 
    	  
    	  netReqLogShareKakao : function(aUUID, aNickName, aTierOne, aTierTwo, aPersonalRank, aSchoolRank, aScore, aWinCount, aTypingCount, aAcc, aPos, aSuccessCallBack, aFailCallBack){      		
    		  reqLogShareFacebookData.uuid = aUUID;
			  reqLogShareFacebookData.nick_name = aNickName,
			  reqLogShareFacebookData.tier_1 = aTierOne,
			  reqLogShareFacebookData.tier_2 = aTierTwo,
			  reqLogShareFacebookData.personal_rank = aPersonalRank,
			  reqLogShareFacebookData.school_rank = aSchoolRank,
			  reqLogShareFacebookData.score = aScore,
			  reqLogShareFacebookData.win_count = aWinCount,
			  reqLogShareFacebookData.typing_count = aTypingCount,
			  reqLogShareFacebookData.acc = aAcc,
			  reqLogShareFacebookData.pos = aPos,
    		
    		  this.netReqAjax(share_kakao_url, reqLogShareKakaoData, instance.netResLogShareKakao, this.netResError, aSuccessCallBack, aFailCallBack);
      	  }, 
      	
    	  //post
    	  netReqAjax : function(aUrl, aJsonObjectData, aResCallBack, aErrorCallBack, aSuccessCallBack, aFailCallBack){
    	  	
    	  	//console.log("AjaxManager :: netReqAjax -> [url] " + aUrl + " [Data] " + JSON.stringify(aJsonObjectData));
    	  	
    	  	$.ajax({
    	          type: 'post',        
    	          url: aUrl,
    	          data: aJsonObjectData,
    	          dataType:'json',
    	          success: function (data) {
    	          	aResCallBack(aUrl, data, aSuccessCallBack, aFailCallBack);
    	          },
    	          error: function (response, status, error) {
    	        	aErrorCallBack(aUrl, response, status, error, aFailCallBack);
    	          }
    	      });
    	  },
    	  
    	  //get	Authorization;
    	  netReqAjaxGet : function(aUrl, aData, aBearerToken, aResCallBack, aErrorCallBack, aSuccessCallBack, aFailCallBack){    		  
      	  	//console.log("AjaxManager :: netReqAjaxGet -> [url] " + aUrl + " [aData] " + aData + " [aBearerToken] " + aBearerToken);
      	  	var bearerToken = (aBearerToken === "") ? "" : ('Bearer ' + aBearerToken);
      	  	
      	  	$.ajax({
      	          type: 'get',     
      	          data: aData,
      	          url: aUrl,
	      	        headers: {
	      	          "Authorization": bearerToken,
	      	        },
      	          success: function (data) {
      	          	aResCallBack(aUrl, data, aSuccessCallBack, aFailCallBack);
      	          },
      	          error: function (response, status, error) {
      	        	aErrorCallBack(aUrl, response, status, error, aFailCallBack);
      	          }
      	      });
      	  },
    	  //======================================================================================
    	  
    	//================================== Response ==========================================
      	  
    	  netResChannelUrl : function(aLoginURL, aData, aSuccessCallBack, aFailCallBack){
    		  instance.netResData(aLoginURL, aData, instance.setResChannelUrl, aSuccessCallBack, aFailCallBack);
    	  },

      	
    	  netResSessionIDLogin : function(aLoginURL, aData, aSuccessCallBack, aFailCallBack){
    		  instance.netResData(aLoginURL, aData, instance.setResSessionIDLogin, aSuccessCallBack, aFailCallBack);
    	  },
    	  
    	  netResAutoEnter : function(aAutoEnterURL, aData, aSuccessCallBack, aFailCallBack){
    		  instance.netResData(aAutoEnterURL, aData, instance.setResAutoEnter, aSuccessCallBack, aFailCallBack);
    	  },
      	  
      	  netResLoadRoom : function(aLoadRoomURL, aData, aSuccessCallBack, aFailCallBack){
      		instance.netResData(aLoadRoomURL, aData, instance.setResLoadRoom, aSuccessCallBack, aFailCallBack);
    	  },
    	  
    	  netResLoadRoomCount : function(aLoadRoomCountURL, aData, aSuccessCallBack, aFailCallBack){
    		  
    		   //console.log("netResLoadRoomCount aData is " + aData);
    		  	//var _packet = CryptoJS.AES.decrypt(aData, "!eogksalsrnrakstp@#");
    		  	//console.log("netResLoadRoomCount _packet is " + _packet);
    		    //var _jpacket = JSON.parse(_packet.toString(CryptoJS.enc.Utf8));
    		    //console.log("netResLoadRoomCount _jpacket is " + _jpacket);
    		    
    		    
    		    //var packetData = {"packet":"U2FsdGVkX19GJWaQW4sCDPH3IqX0C+9nZKKF2m/9YXqAoRTvALsH0ae/1GD+j2QN"};
    			//console.log("roomOpinion packetData packet " + packetData.packet); // 'my message'
    			//var jsonPack = packetData.packet.toString();
    			//console.log("roomOpinion jsonPack " + packetData.packet); // 'my message'
    			
    			var decrypted = CryptoJS.AES.decrypt(aData.packet, '!eogksalsrnrakstp@#');
    			var decryptedData = JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));
    			//console.log("netResLoadRoomCount " + decryptedData);
    			
    		    
        		instance.netResData(aLoadRoomCountURL, decryptedData, instance.setResLoadRoomCount, aSuccessCallBack, aFailCallBack);
      	  },
    	  
    	  netResNicknameRoomSearch : function(aNicknameRoomSearchURL, aData, aSuccessCallBack, aFailCallBack){
    		  instance.netResData(aNicknameRoomSearchURL, aData, instance.setResNicknameRoomSearch, aSuccessCallBack, aFailCallBack);
      	  },
      	  
      	  netResRoomNumberRoomSearch : function(aRoomNumberRoomSearchURL, aData, aSuccessCallBack, aFailCallBack){
      		instance.netResData(aRoomNumberRoomSearchURL, aData, instance.setRoomNumberRoomSearch, aSuccessCallBack, aFailCallBack);
    	  },    	        	  
    	  
    	  netResFriendList : function(aFriendListURL, aData, aSuccessCallBack, aFailCallBack){
        		instance.netResData(aFriendListURL, aData, instance.setFriendList, aSuccessCallBack, aFailCallBack);
      	  },
      	  
      	  netResLogStartEndGame : function(aLogStartEndGameURL, aData, aSuccessCallBack, aFailCallBack){
      		instance.netResData(aLogStartEndGameURL, aData, instance.setLogStartEndGame, aSuccessCallBack, aFailCallBack);
      	  },
      	  
      	  netResLogShareFacebook : function(aLogShareFacebookURL, aData, aSuccessCallBack, aFailCallBack){
      		instance.netResData(aLogShareFacebookURL, aData, instance.setLogShareFacebook, aSuccessCallBack, aFailCallBack);
      	  },
      	  
      	  netResLogShareKakao : function(aLogShareKakaoURL, aData, aSuccessCallBack, aFailCallBack){
      		instance.netResData(aLogShareKakaoURL, aData, instance.setLogShareKakao, aSuccessCallBack, aFailCallBack);
      	  },
      	  
    	  netResData : function(aUrl, aData, aResCallback, aSuccessCallBack, aFailCallBack){
    		 //console.log("AjaxManager :: netResData -> [url] " + aUrl + " [Data] " + JSON.stringify(aData));
    		  
//	    	  	if(aData.length === 0){
//	    	  		console.log("AjaxManager :: netResData " + "[url] " + aUrl + " jsonStringData.length is zero");
//	    	  		//return;
//	    	  	}
    	  	
	    	  	if(aData.result !== undefined){
	    	  		if(aData.result !== 0){
	    	  			this.netResResultError(aData.result, aFailCallBack);
		    	  		return;
		    	  	}
	    	  	}
    	  	
    	  	aResCallback(aData, aSuccessCallBack);
    	  },

    	  //result error
    	  netResResultError : function(aResult, aFailCallBack){
    	  		//console.log("AjaxManager :: netResResultError -> [aResult] " + aResult);
    	  		aFailCallBack(aResult);
    	  },	

    	  //ajax error
    	  netResError : function(aUrl, aResponse, aStatus, aError, aFailCallBack){
    	  	//console.log("AjaxManager :: netResError -> [Url] " + aUrl + " [Response] " + aResponse + " [Status] " + aStatus + " [ERROR] " + aError);
    	  	aFailCallBack(10000);
    	  },
    	  //======================================================================================
    	  
    	//=============================== SetGetResponseData ===================================
    	  setResChannelUrl : function(aResData, aSuccessCallBack){	
        		//resFriendListData = aResData;        		
        		aSuccessCallBack(aResData);
      	  },
      	  
    	  setResSessionIDLogin : function(aResData, aSuccessCallBack){	
    	  	resSessionIDLoginData = aResData;
    	  	aSuccessCallBack(aResData);
    	  },

    	  getResSessionIDLogin : function(){	
    	  	return resSessionIDLoginData;
    	  },
    	  
    	  setResAutoEnter : function(aResData, aSuccessCallBack){	
    		  resAutoEnterData = aResData;
    		  aSuccessCallBack(aResData);
      	  },

      	  getResAutoEnter : function(){	
      	  	return resAutoEnterData;
      	  },
      	  
      	  setResLoadRoomCount : function(aResData, aSuccessCallBack){	
      		resLoadRoomCountData = aResData;
      		aSuccessCallBack(aResData);
    	  },

    	  getResLoadRoomCount : function(){	
    	  	return resLoadRoomCountData;
    	  },
      	  
      	  setResLoadRoom : function(aResData, aSuccessCallBack){	
      		resLoadRoomDataArray = aResData;
      		aSuccessCallBack(aResData);
    	  },

    	  getResLoadRoom : function(){	
    		  if(resLoadRoomDataArray === undefined) {
    			  return ""; 
    		  }
    	  	return resLoadRoomDataArray;
    	  },
    	  
    	  getResLoadRoomInfo : function(idx){	
    		 if(resLoadRoomDataArray === undefined || resLoadRoomDataArray[idx] === undefined){
    			 return "";
    		 }
      	  	return resLoadRoomDataArray[idx];
      	  },
    	  
    	  setResNicknameRoomSearch : function(aResData, aSuccessCallBack){	
    		  resNicknameRoomSearchData = aResData;
    		  aSuccessCallBack(aResData);
      	  },

      	  getResNicknameRoomSearch : function(){	
      	  	return resNicknameRoomSearchData;
      	  },
      	  
      	  setRoomNumberRoomSearch : function(aResData, aSuccessCallBack){	
      		resRoomNumberRoomSearchData = aResData;
      		aSuccessCallBack(aResData);
    	  },

    	  getRoomNumberRoomSearch : function(){	
    	  	return resRoomNumberRoomSearchData;
    	  },
    	  
    	  //Get Authorization
    	  setFriendList : function(aResData, aSuccessCallBack){	
        		//resFriendListData = aResData;        		
        		aSuccessCallBack(aResData);
      	  },
//      	  getFriendList : function(){
//      		console.log( "resFriendListData : " + resFriendListData);
//      	  	return resFriendListData;
//      	  }    	  
		  
      	  
      	  setLogStartEndGame : function(aResData, aSuccessCallBack){	
      		resLogStartEndGameData = aResData;
      		aSuccessCallBack(aResData);
    	  },

    	  getLogStartEndGame : function(){	
    	  	return resLogStartEndGameData;
    	  },
    	  
    	  setLogShareFacebook : function(aResData, aSuccessCallBack){	
        		resLogShareFacebookData = aResData;
        		aSuccessCallBack(aResData);
      	  },

      	  getLogShareFacebook : function(){	
      	  	return resLogShareFacebookData;
      	  },
      	  
      	  setLogShareKakao : function(aResData, aSuccessCallBack){	
      		resLogShareKakaoData = aResData;
      		aSuccessCallBack(aResData);
    	  },

    	  getLogShareKakao : function(){	
    	  	return resLogShareKakaoData;
    	  },
    	  
    	  //gameConst : GameConst.getInstance(),    	  
      	  
    	  //======================================================================================
	    };
	  }

	  return {
	    getInstance: function () {
	      if ( !instance ) {
	        instance = init();
	        instance.setURL();
	        //console.log( "The AjaxManager init!!!" );
	      } else {
	    	 //console.log( "The AjaxManager instance!" );
		  }
	      return instance;
	    }
	  };
	})();