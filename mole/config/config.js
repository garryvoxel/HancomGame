var _configInfo = {
	test: {
		protocol: 'http://',
		head: '',
		api_host: 'taja.malangmalang.com',
		api_port: '7311',
		home_host: 'taja.malangmalang.com',
		home_port: '7302',
		mobile_host: 'taja.malangmalang.com',
		mobile_port: '7312'
	},

	development: {
		protocol: 'https://',
		head: 'dev-',
		api_host: 'api.malangmalang.com',
		home_host: 'typing.malangmalang.com',
		mobile_host: 'typing-m.malangmalang.com'
	},

	stage: {
		protocol: 'https://',
		head: 'stg-',
		api_host: 'api.malangmalang.com',
		home_host: 'typing.malangmalang.com',
		mobile_host: 'typing-m.malangmalang.com'
	},

	production: {
		protocol: 'https://',
		head: '',
		api_host: 'api.malangmalang.com',
		home_host: 'typing.malangmalang.com',
		mobile_host: 'typing-m.malangmalang.com'
	}
}

var gURL = _configInfo[ENVConfig].protocol+_configInfo[ENVConfig].head+_configInfo[ENVConfig].api_host;
if (_configInfo[ENVConfig].api_port != null) {
	gURL += ":" + _configInfo[ENVConfig].api_port;
}
gURL += "/";

var gHomeURL = _configInfo[ENVConfig].protocol+_configInfo[ENVConfig].head+_configInfo[ENVConfig].home_host;
if (_configInfo[ENVConfig].home_port != null) {
	gHomeURL += ":" + _configInfo[ENVConfig].home_port;
}

var gMobileURL = _configInfo[ENVConfig].protocol+_configInfo[ENVConfig].head+_configInfo[ENVConfig].mobile_host;
if (_configInfo[ENVConfig].mobile_port != null) {
	gMobileURL += ":" + _configInfo[ENVConfig].mobile_port;
}
