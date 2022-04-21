var urlType;

var Config = (function () {
	  var instance;
	  function init() {
	    return {	    	
	    	setURLType : function(){
		    	if (ENVConfig == "test") {
		    		urlType = this.UrlType.MY_COM;
				}
		    	else if (ENVConfig == "test-me") {
		    		urlType = this.UrlType.ONLY_ME;
				}
				else if (ENVConfig == "development") {
		        	urlType = this.UrlType.DEV;
				}
				else if (ENVConfig == "stage") {
		        	urlType = this.UrlType.STG;
				}
				else if (ENVConfig == "production") {
		        	urlType = this.UrlType.LIVE;
		        }
			},
	    	
	    	getURLType : function(){
	    		return urlType;
	    	},
	    	
	    	UrlType : {MY_COM : 0, ONLY_ME : 1, DEV : 2, LIVE : 3, STG : 4, SET_1 : 5, SET_2 : 6, SET_3 : 7},	    	
	    	URL : {				  
				  properties: {
				    0: {game_api_home_domain: WebConfig.getApiURL("test"), webpage_api_home_domain : WebConfig.getHomeURL("test")},	//MY_COM			    
				    1: {game_api_home_domain: WebConfig.getApiURL("development"), webpage_api_home_domain : WebConfig.getHomeURL("development")},	//ONLY_ME			    
				    2: {game_api_home_domain: WebConfig.getApiURL("development"), webpage_api_home_domain : WebConfig.getHomeURL("development")},	//DEV
				    3: {game_api_home_domain: WebConfig.getApiURL("production"), webpage_api_home_domain : WebConfig.getHomeURL("production")},	//LIVE
				    4: {game_api_home_domain: WebConfig.getApiURL("stage"), webpage_api_home_domain : WebConfig.getHomeURL("stage")},	//STG
				    5: {game_api_home_domain: WebConfig.getApiURL("production"), webpage_api_home_domain : WebConfig.getHomeURL("production")},	//SET_1
				    6: {game_api_home_domain: "", webpage_api_home_domain : ""},	//SET_2
				    7: {game_api_home_domain: "", webpage_api_home_domain : ""}		//SET_3				    
				  } 
	    	},
	    	
//	    	getGameSocketURL : function(){	    		
//	    		return this.URL.properties[urlType].game_socket_home_domain;
//	    	},
	    	
	    	getGameAPIURL : function(){	    		
	    		return this.URL.properties[urlType].game_api_home_domain;
	    	},
	    	
	    	getWebpageAPIURL : function(){
	    		return this.URL.properties[urlType].webpage_api_home_domain;
	    	}
	    	
	    };
	  }

	  return {
	    getInstance: function () {
	      if ( !instance ) {
	        instance = init();
	        instance.setURLType();
	        console.log( "The Config init!!!" );
	      } else {
	    	  console.log( "The Config instance!" );
		  }
	      return instance;
	    }
	  };
	})();