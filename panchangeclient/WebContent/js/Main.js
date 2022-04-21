function setCookie(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  var expires = "expires="+ d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
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
}

function setFriendVisitePopup(game) {
	var host = WebConfig.getHomeURL(ENVConfig);

	var script = document.createElement('script');
	script.setAttribute('type', 'text/javascript');
	script.setAttribute('src', host + '/assets/javascripts/tt-sdk.js');
	script.onload = function() {
		ttsdk.onInit = function () {
			//로드가 될때 init이 된
			 if(game.userInfoManager.currentStatus === 'ROOMLIST'){
				 return true; // 초대 펍업 열기				 
			 } else {
				 return false; // 초대 팝업 열지 않고 무시
			 }
		 }
		ttsdk.init(10001, {
			home: WebConfig.getHomeURL(ENVConfig),
			coin: WebConfig.getCoinURL(ENVConfig),
			pan: WebConfig.getPanURL(ENVConfig)
		});
	};
	document.getElementsByTagName('head')[0].appendChild(script);

	var stylesheet = document.createElement('link');
	stylesheet.setAttribute('rel', 'stylesheet');
	stylesheet.setAttribute('type', 'text/css');
	stylesheet.setAttribute('href', host + '/assets/stylesheets/tt-sdk.css');
	document.getElementsByTagName('head')[0].appendChild(stylesheet);
}

window.onload = function() {
	//var game = new Phaser.Game(1280, 720, Phaser.AUTO);
	//backGround image standard
	var game = new Phaser.Game(1024, 576, Phaser.CANVAS);
	game.transparent = true;
	
	setFriendVisitePopup(game);
	
	_socketManager = new SocketManager();
	_socketManager.game = game;
	_socketManager.setGame(game);
	game.socketManager = _socketManager;
	
	_userInfoManager = new UserInfoManager(game);
	game.userInfoManager = _userInfoManager;
	
	game.audioManager = new AudioManager(game);
	
	game.popupManager = new PopupManager(game);

	game.state.add("Level", Level);
	game.state.add("RoomList", RoomList);
	game.state.add("Robby", Robby);
	game.state.add("MainReady", MainReady);

	game.state.start("MainReady");

	function onchange(evt) {
      _socketManager.changeVisible(evt.target.visibilityState);
    }
    document.addEventListener("visibilitychange", onchange);
};
