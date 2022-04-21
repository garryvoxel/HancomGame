var urlType;

var Config = (function () {
	  var instance;
	  function init() {
	    return {
//	    	setURLType : function(){
//	    		urlType = this.URL_TYPE.SET_1;
//	    		//urlType = this.URL_TYPE.IN_HOUSE;
//	    		//urlType = this.URL_TYPE.DEV;
//	    		//urlType = this.URL_TYPE.LIVE;
//	    	},
//	    	
	    	setURLType : function(){
		    	if (ENVConfig == "test") {
		    		urlType = this.URL_TYPE.MY_COM;
				}
				else if (ENVConfig == "development") {
		        	urlType = this.URL_TYPE.DEV;
				}
				else if (ENVConfig == "stage") {
		        	urlType = this.URL_TYPE.STG;
				}
				else if (ENVConfig == "production") {
		        	urlType = this.URL_TYPE.LIVE;
		        }
	          },
	          
	    	getURLType : function(){
	    		return urlType;
	    	},
	    	
	    	URL_TYPE : {MY_COM : 0, IN_HOUSE : 1, DEV : 2, LIVE : 3, STG : 4, SET_1 : 5, SET_2 : 6, SET_3 : 7},
	    	URL : {
				  properties: {
				    0: {game_api_home_domain: WebConfig.getApiURL("test"), game_socket_home_domain: WebConfig.getSocketURL("test")},	//MY_COM			    
				    1: {game_api_home_domain: WebConfig.getApiURL("test"), game_socket_home_domain: WebConfig.getSocketURL("test")},	//IN_HOUSE
				    2: {game_api_home_domain: WebConfig.getApiURL("development"), game_socket_home_domain: WebConfig.getSocketURL("development")},	//DEV
				    3: {game_api_home_domain: WebConfig.getApiURL("production"), game_socket_home_domain: WebConfig.getSocketURL("production")},	//LIVE
				    4: {game_api_home_domain: WebConfig.getApiURL("stage"), game_socket_home_domain: WebConfig.getSocketURL("stage")},	//STG
				    
				    5: {game_api_home_domain: WebConfig.getApiURL("development"), game_socket_home_domain: WebConfig.getSocketURL("test")},	//SET_1
				    6: {game_api_home_domain: WebConfig.getApiURL("development"), game_socket_home_domain: WebConfig.getSocketURL("development")},	//SET_2
				    7: {game_api_home_domain: WebConfig.getApiURL("development"), game_socket_home_domain: WebConfig.getSocketURL("test")}		//SET_3				    
				  } 
	    	},
	    	
	    	getGameSocketURL : function(ch) {
				if(ch == 1001)
					ch = 3;
				else if(ch == 1002)
					ch = 4;
				
				if(ch == 1)	
					return 'ws://localhost:7331';
				else if(ch == 2)
					return 'ws://localhost:7332';
				else if(ch == 3)
					return 'ws://localhost:7333';
				else
					return 'ws://localhost:7334';
	    		//return this.URL.properties[urlType].game_socket_home_domain.replace("{0}", (ch != null)? ch :1);
	    	},
	    	
	    	getGameAPIURL : function(){	    		
	    		return this.URL.properties[urlType].game_api_home_domain;
	    	},
	    	
	    	getParentsURL : function(){
				return WebConfig.getHomeURL(ENVConfig);
			},
			
	    	getCoinURL : function(){
				return WebConfig.getCoinURL(ENVConfig);
			},
			
	    	getPanURL : function(){
				return WebConfig.getPanURL(ENVConfig);
	    	}
	    	
	    	
//	    	getWebpageAPIURL : function(){
//	    		return this.URL.properties[urlType].webpage_api_home_domain;
//	    	}
	    	
	    };
	  }

	  return {
	    getInstance: function () {
	      if ( !instance ) {
	        instance = init();
	        instance.setURLType();
	        //console.log( "The Config init!!!" );
	      } else {
	    	  //console.log( "The Config instance!" );
		  }
	      return instance;
	    }
	  };
	})();