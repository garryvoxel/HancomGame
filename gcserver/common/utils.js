/**
 * 파일명: gcserver/common/utils.js
 * 서버 IP 주소 가져오기, 패킷 압축, 해제 메서드 정의   
 */
const os = require('os');
const CryptoJS = require("crypto-js");
//서버 IPv4 주소얻기
exports.getServerIP = function(){
    var ifaces = os.networkInterfaces();
    var result = '';
    for (var dev in ifaces) {
        var alias = 0;
        ifaces[dev].forEach(function(details) {
            if (details.family == 'IPv4' && details.internal === false) {
                result = details.address;
                ++alias;
            }
        });
    }
    return result;
}

var https = require('https');
var public_ip = null;
//서버 공인IP 주소얻기
exports.getPublicIP = function(callback){

    if(public_ip === null){
        https.get({
            host: 'api.ipify.org',
        }, function(response) {
            var ip = '';
            response.on('data', function(d) {
                ip += d;
            });
            response.on('end', function() {
                if(ip){
                    callback(null, ip);
                } else {
                    callback(1,'could not get public ip address :(');
                }
            });
        });    

    }else{
        callback(null,ip);
    }
}



//=============================================
// util function

/**
 * @param {* 보낼 패켓을 압축} d 
 */
exports.PacketEncode = function(d){
    let _dt = JSON.stringify(d);
    let _data = encodeURIComponent(_dt);
    return _data;
}

/**
 * @param {* 받은 패켓을 해제} d 
 */
exports.PacketDecode = function(d){
    let _d = decodeURIComponent(d);
    let _data = JSON.parse(_d);
    return _data;
}
/**
 * @param {* 보낼 패켓을 AES로 암호화} d 
 */
exports.CryptoJS_EN = function(value){

    var _packet = CryptoJS.AES.encrypt(value,"!eogksalsrnrakstp@#")
    return _packet;
}
/**
 * @param {* 받은 패켓을 AES암호화로 해독} d 
 */
exports.CryptoJS_DE = function(value){

    var _packet = CryptoJS.AES.decrypt(value, "!eogksalsrnrakstp@#");
    var _jpacket = JSON.parse(_packet.toString(CryptoJS.enc.Utf8));

    return _jpacket;
}
    