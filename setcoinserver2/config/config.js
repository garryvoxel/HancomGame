const _svrcfg = require('./server.json');
const ENVIRONMENT = process.env.NODE_ENV;
var _confInfo = _svrcfg[ENVIRONMENT];

var WebConfig = {
	svrcfg: _confInfo,
	/**
	 * env를 통한 apiserver url 가져오기
	 * @param {*} env 
	 */
	getApiURL: function (env) { //api url얻기
		var url = _svrcfg[env].API_SERVER_PROTOCOL + _svrcfg[env].API_SERVER_HOST;
		if (_svrcfg[env].API_SERVER_PORT) {
			url += ":" + _svrcfg[env].API_SERVER_PORT;
		}
		return url;
	},
	/**
	 * env를 통한 서버 DNS주소 가져오기 (setcoinserver1의 dns)
	 * @param {*} env 
	 */
	getDNS: function (env) { //서버 DNS주소 얻기
		if (_svrcfg[env].SERVER_DNS != null) {
			return _svrcfg[env].SERVER_DNS;
		}
		return _svrcfg[env].API_SERVER_PROTOCOL + _svrcfg[env].API_SERVER_HOST + ":" + _svrcfg[env].SERVER_PORT;
	}
}

module.exports = WebConfig;