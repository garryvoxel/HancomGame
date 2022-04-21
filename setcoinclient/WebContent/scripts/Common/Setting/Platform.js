var Platform = (function () {
	  var instance;
	  function init() {
	    return {
	      	getWindowInnerWidth : function(posX){	
	    		var baseWidth = 1024;
	    		var screenWidth = ( (window.innerWidth * posX) / baseWidth);
	    		
	    		return screenWidth;
	    	},

	    	getWindowInnerHeight : function(posY){
	    		var baseHeight = 576;
	    		var screenHeight = ( (window.innerHeight * posY) / baseHeight);
	    		
	    		return screenHeight;
	    	},
	
	    	getWindowInnerFontSize : function(fontS){
	    		var baseHeight = 576;
	    		var fontSizeY = ( (window.innerHeight * fontS) / baseHeight);
	    		
	    		return fontSizeY;
	    	}
	    };
	  };

	  return {
	    getInstance: function () {
	      if ( !instance ) {
	        instance = init();
	        console.log( "The Platform init!!!" );
	      } else {
	    	  console.log( "The Platform instance!" );
		  }
	      return instance;
	    }
	  };
	})();