/**
 * 파일명: panchangeserver/common/utils.js
 * 패킷 압축, 해제 메소드 정의   
 */
const CryptoJS                      = require("crypto-js");
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