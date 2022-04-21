var _configInfo = {
	test: {
		protocol: 'http://',
		head: '',
		api_host: 'taja.malangmalang.com',
		api_port: '7311',
		home_host: 'taja.malangmalang.com',
		home_port: '7302'
	},

	development: {
		protocol: 'https://',
		head: 'dev-',
		api_host: 'api.malangmalang.com',
		home_host: 'typing.malangmalang.com',
	},

	stage: {
		protocol: 'https://',
		head: 'stg-',
		api_host: 'api.malangmalang.com',
		home_host: 'typing.malangmalang.com',
	},

	production: {
		protocol: 'https://',
		head: '',
		api_host: 'api.malangmalang.com',
		home_host: 'typing.malangmalang.com',
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
	getHomeURL: function (env) {
		var url = _configInfo[env].protocol+_configInfo[env].head+_configInfo[env].home_host;
		if (_configInfo[env].home_port != null) {
			url += ":" + _configInfo[env].home_port;
		}
		url += "/";
		return url;
	}
}

