var _configInfo = {
	test: {
		protocol: 'http://',
		head: '',
		home_host: 'taja.malangmalang.com',
		home_port: '7302',
		svr_host: 'taja.malangmalang.com',
		svr_port: '7307',
		coin_host: 'taja.malangmalang.com',
		coin_port: '7304',
		pan_host: 'taja.malangmalang.com',
		pan_port: '7306'
	},
	/*
	development: {
		protocol: 'https://',
		head: 'dev-',
		home_host: 'typing.malangmalang.com',
		svr_host: 'tt-block-rt.malangmalang.com',
		coin_host: 'tt-coin-c.malangmalang.com/coinpile_sample/WebContent',
		pan_host: 'tt-block-c.malangmalang.com/Flip01/WebContent'
	}, */
	development: {
		protocol: 'http://',
		head: '',
		home_host: 'localhost:7302',
		svr_host: 'localhost:7307',
		coin_host: 'tt-coin-c.malangmalang.com/coinpile_sample/WebContent',
		pan_host: 'localhost:7306/Flip01/WebContent'
	},

	stage: {
		protocol: 'https://',
		head: 'stg-',
		home_host: 'typing.malangmalang.com',
		svr_host: 'tt-block-rt.malangmalang.com',
		coin_host: 'tt-coin-c.malangmalang.com/coinpile_sample/WebContent',
		pan_host: 'tt-block-c.malangmalang.com/Flip01/WebContent'
	},

	production: {
		protocol: 'https://',
		head: '',
		home_host: 'typing.malangmalang.com',
		svr_host: 'tt-block-rt.malangmalang.com',
		coin_host: 'tt-coin-c.malangmalang.com/coinpile_sample/WebContent',
		pan_host: 'tt-block-c.malangmalang.com/Flip01/WebContent'
	}
}

var WebConfig = {
	getHomeURL: function (env) {
		var url = _configInfo[env].protocol+_configInfo[env].head+_configInfo[env].home_host;
		if (_configInfo[env].home_port != null) {
			url += ":" + _configInfo[env].home_port;
		}
		return url;
	},
	getSvrURL: function (env) {
		var url = _configInfo[env].protocol+_configInfo[env].head+_configInfo[env].svr_host;
		if (_configInfo[env].svr_port != null) {
			url += ":" + _configInfo[env].svr_port;
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
	}
}
