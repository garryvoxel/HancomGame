var gENV = 1; //1:dev 2:stg 3:live

var UserInfoManager = function(game) {
	this.game = game;
	
	this.pk = 0;
	this.nickname = "";
	this.avatar = 0;
	this.clan = "";
	
	this.isLogin = false;
	this.sessionID = "";
	this.currentStatus = "MAIN_READY";
	this.isRoomInit = false;
	
	this.socketID = null;
	this.roomNum = null;
	this.team = null;
	this.isMaster = false;
	
	this.roomListPage = 1;
	
	this.inviList = [];
	
	this.searchRoom = null;
	
	this.game.panAlert = function(msg, callback) {
		if(game.popupManager.openPopup("alert")) {
			var _group = new alertPopup(game);
			_group.init(
				msg,
				callback
			);
			_group.position.setTo(243.5, 120);
		}
	};
}