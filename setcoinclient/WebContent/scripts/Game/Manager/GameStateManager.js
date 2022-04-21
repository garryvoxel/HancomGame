window.onload = function() {
	var game = new Phaser.Game(1024, 576, Phaser.AUTO);
	
	let _config = Config.getInstance();
	let _game_util = GameUtil.getInstance();

	let _socketManager = SocketManager.getInstance();

	_socketManager.setRobbyConnect( _config.getGameSocketURL(_game_util.getQuery('channel')) + '/robby' + _game_util.getQuery('channel') );
	// _socketManager.setRobbyConnect('ws://localhost:7334');
	
	// Add the States your game has.
	game.state.add("Boot", Boot);
	game.state.add("Preloader", Preloader);
	//game.state.add("Menu", Menu);
	game.state.add("MenuV2", MenuV2);
	
	game.state.add("Level1", Level1);
	game.state.add("SingleLevel1", SingleLevel1);	

	
	game.state.start("Boot");

	function onchange(evt) {
		_socketManager.changeVisible(evt.target.visibilityState);
	}
	document.addEventListener("visibilitychange", onchange);
};