window.onload = function() {
	var game = new Phaser.Game(1024, 576, Phaser.AUTO, "", this, false, true);

	// Add the States your game has.
	game.state.add("Boot", Boot);
	// console.log('load1');
	game.state.add("Preloader", Preloader);
	// console.log('load2');
//	game.state.add("Menu", Menu);
	game.state.add("MenuV2", MenuV2);
	// console.log('load2');
//	game.state.add("Level", Level);

	
	game.state.start("Boot");
};