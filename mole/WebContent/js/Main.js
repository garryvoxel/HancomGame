window.onload = function() {
	var game = new Phaser.Game(720, 800, Phaser.AUTO);
	
	// Add the States your game has.
	game.state.add("Boot", Boot);
	game.state.add("Preloader", Preloader);
	game.state.add("Menu", Menu);
	game.state.add("Level", Level);

	game.state.start("Boot");

};
