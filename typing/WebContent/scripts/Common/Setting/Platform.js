/**
 *
 */
function Platform () {
	
}

Platform.prototype.getWindowInnerWidth = function(posX){	
	var baseWidth = 1024;
	var screenWidth = ( (window.innerWidth * posX) / baseWidth);
	
	return screenWidth;
};

Platform.prototype.getWindowInnerHeight = function(posY){
	var baseHeight = 576;
	var screenHeight = ( (window.innerHeight * posY) / baseHeight);
	
	return screenHeight;
};

Platform.prototype.getWindowInnerFontSize = function(fontS){
	var baseHeight = 576;
	var fontSizeY = ( (window.innerHeight * fontS) / baseHeight);
	
	return fontSizeY;
};
