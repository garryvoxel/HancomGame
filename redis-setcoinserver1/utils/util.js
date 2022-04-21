const os = require('os');
const uuid = require('uuid');
const crypto                = require('crypto');
const CryptoJS                      = require("crypto-js");

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
 * @param {* 보낼 패켓을 AES로 암호화} d 
 */
exports.CryptoJS_EN = function(value){

    var _packet = CryptoJS.AES.encrypt(value,"!eogksalsrnrakstp@#")
    return _packet;
}

