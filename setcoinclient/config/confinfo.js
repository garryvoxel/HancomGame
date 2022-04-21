var _configInfo = {
	test: {
		protocol: 'http://',
		head: '',
		api_host: 'taja.malangmalang.com',
		api_port: '7311',
		home_host: 'taja.malangmalang.com',
		home_port: '7302',
		sock_protocol: 'ws://',
		sock_host: 'taja.malangmalang.com',
		sock_port: '733{0}',
		coin_host: 'taja.malangmalang.com',
		coin_port: '7304',
		pan_host: 'taja.malangmalang.com',
		pan_port: '7306'
	},
	
	/* development: {
		protocol: 'https://',
		head: 'dev-',
		api_host: 'api.malangmalang.com',
		home_host: 'typing.malangmalang.com',
		sock_protocol: 'wss://',
		sock_host: 'tt-coin-rt-{0}.malangmalang.com',
		coin_host: 'tt-coin-c.malangmalang.com/coinpile_sample/WebContent',
		pan_host: 'tt-block-c.malangmalang.com/Flip01/WebContent'
	}, */ 
	development: {
		protocol: 'http://',
		head: '',
		api_host: 'localhost:7311',
		home_host: 'localhost:7302',
		sock_protocol: 'ws://',
		sock_host: 'localhost:7331',
		coin_host: 'localhost:7304/coinpile_sample/WebContent',
		pan_host: 'localhost:7306/Flip01/WebContent'
	},
	stage: {
		protocol: 'https://',
		head: 'stg-',
		api_host: 'api.malangmalang.com',
		home_host: 'typing.malangmalang.com',
		sock_protocol: 'wss://',
		sock_host: 'tt-coin-rt-{0}.malangmalang.com',
		coin_host: 'tt-coin-c.malangmalang.com/coinpile_sample/WebContent',
		pan_host: 'tt-block-c.malangmalang.com/Flip01/WebContent'
	},

	production: {
		protocol: 'https://',
		head: '',
		api_host: 'api.malangmalang.com',
		home_host: 'typing.malangmalang.com',
		sock_protocol: 'wss://',
		sock_host: 'tt-coin-rt-{0}.malangmalang.com',
		coin_host: 'tt-coin-c.malangmalang.com/coinpile_sample/WebContent',
		pan_host: 'tt-block-c.malangmalang.com/Flip01/WebContent'
	}
}

var WebConfig = {
	getApiURL: function (env) {
		var url = _configInfo[env].protocol+_configInfo[env].head+_configInfo[env].api_host;
		if (_configInfo[env].api_port != null) {
			url += ":" + _configInfo[env].api_port;
		}
		url += "/game/";
		return url;
	},
	getSocketURL: function (env) {
		var url = _configInfo[env].sock_protocol+_configInfo[env].head+_configInfo[env].sock_host;
		if (_configInfo[env].sock_port != null) {
			url += ":" + (_configInfo[env].sock_port);
		}
		return url;
	},
	getHomeURL: function (env) {
		var url = _configInfo[env].protocol+_configInfo[env].head+_configInfo[env].home_host;
		if (_configInfo[env].home_port != null) {
			url += ":" + _configInfo[env].home_port;
		}
		return url;
	},
	getCoinURL: function (env) {
		var url = _configInfo[env].protocol+_configInfo[env].head+_configInfo[env].coin_host;
		if (_configInfo[env].coin_port != null) {
			url += ":" + _configInfo[env].coin_port;
		}
		return url;
	},
	getPanURL: function (env) {
		var url = _configInfo[env].protocol+_configInfo[env].head+_configInfo[env].pan_host;
		if (_configInfo[env].pan_port != null) {
			url += ":" + _configInfo[env].pan_port;
		}
		return url;
	},
	extractChFromDns: function (chDns) {
		var pos = chDns.lastIndexOf(".malangmalang.com");
		if (pos > 0) {
			return chDns.substring(pos - 1, pos);
		}
		return 1;
	}	
}

