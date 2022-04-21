var GameUtil = (function () {
	  // Instance stores a reference to the Singleton
	  var instance;
	  function init() {
	    // Singleton
	    return {
//	      // Public methods and variables
//	      publicMethod: function () {
//	        console.log( "The public can see me!" );
//	      },
//	      publicProperty: "I am also public",
	      
	      //Collection
	      removeAt : function(aArray, aIdx) {
	      	return aArray.splice(aIdx, 1);
	      },

	      checkRayCollison : function(aCx1, aCx2, aKx1, aKx2) {
	      	if(	(aCx1 <= aKx1 && aKx1 <= aCx2)	|| (aCx1 <= aKx2 && aKx2 <= aCx2) || (aCx1 >= aKx1 && aKx2 >= aCx2) )	{
	      		return true;
	      	}
	      	return false;
	      },

	      checkCollision : function(aCx1, aCx2, aKx1, aKx2, aCy1, aCy2, aKy1, aKy2) {
	      	if(	(aCx1 <= aKx1 && aKx1 <= aCx2)	|| (aCx1 <= aKx2 && aKx2 <= aCx2) || (aCx1 >= aKx1 && aKx2 >= aCx2) ) {
	      		if(	(aCy1 <= aKy1 && aKy1 <= aCy2)	|| (aCy1 <= aKy2 && aKy2 <= aCy2) || (aCy1 >= aKy1 && aKy2 >= aCy2) ) {
	      			return true;
	      		}
	      	}	
	      	return false;
	      },

	      setText : function(aObject, aBoxWidth, aBoxHeight, aH, aV, aText){
	      	aObject.setTextBounds(0, 0, aBoxWidth, aBoxHeight);	
	      	aObject.boundsAlignH = aH;
	      	aObject.boundsAlignV = aV;
	      	
	      	if(typeof aText !== undefined) 
	      		aObject.text = aText;
	      },


	      setTextAlign : function(aObject, aBoxWidth, aBoxHeight, aH, aV){
	      	aObject.setTextBounds(0, 0, aBoxWidth, aBoxHeight);	
	      	aObject.boundsAlignH = aH;
	      	aObject.boundsAlignV = aV;	
	      },

	      setTextColor : function(aObject, aFillColor, aStrokeColor){
	      	aObject.fill = aFillColor;
	      	aObject.stroke = aStrokeColor;
	      },
	      
	      getParameterByName: function(name,href) {
	    	  if (!url) url = window.location.href;
	    	  //window.location.saerch	... 쿼리 부붑만 가져옴..
	    	    name = name.replace(/[\[\]]/g, "\\$&");
	    	    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
	    	        results = regex.exec(url);
	    	    if (!results) return null;
	    	    if (!results[0]) return '';
	    	    return decodeURIComponent(results[0].replace(/\+/g, " "));
	      },
	      
	      getQuery: function(needle) {
	    	    if (needle === undefined || needle === null) {
	    	        return null;
	    	    }

	    	    var
	    	        items = {},
	    	        queries = {};

	    	    if (window.location.search) {
	    	        items = window.location.search.substr(1).split('&');
	    	    }

	    	    for (var key in items) {
	    	        var fragments = items[key].split('=');
	    	        queries[fragments[0]] = fragments[1];
	    	    }

	    	    if (queries[needle]) {
	    	        return queries[needle];
	    	    }

	    	    return null;
	    	},
	      
	    	getCookie: function(cname) {
		    	  var name = cname + "=";
		    	  var decodedCookie = decodeURIComponent(document.cookie);
		    	  var ca = decodedCookie.split(';');
		    	  for(var i = 0; i <ca.length; i++) {
		    	    var c = ca[i];
		    	    while (c.charAt(0) == ' ') {
		    	      c = c.substring(1);
		    	    }
		    	    if (c.indexOf(name) == 0) {
		    	      return c.substring(name.length, c.length);
		    	    }
		    	  }
		    	  return "";
		    	},
		    	
	    	setCookie : function (cname, cvalue, exdays) {
	    		  var d = new Date();
	    		  d.setTime(d.getTime() + (exdays*24*60*60*1000));
	    		  var expires = "expires="+ d.toUTCString();
	    		  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
	    		},
	    };
	  };

	  return {
	    // Get the Singleton instance if one exists
	    // or create one if it doesn't
	    getInstance: function () {
	      if ( !instance ) {
	        instance = init();
	        console.log( "The GameUtil init!!!" );
	      } else {
	    	  console.log( "The GameUtil instance!" );
		  }
	      return instance;
	    }
	  };
	})();