const os = require('os');
const mysql = require('../src/mysql');
const async = require('async');
const CryptoJS = require("crypto-js");
const NodeCache = require("node-cache");

function make_packet(err) {
    let _data = {};
    _data.result = err;
    return JSON.stringify(_data);
}

function getServerIP() {
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

function getPublicIP(callback) {

    if (public_ip === null) {
        https.get({
            host: 'api.ipify.org',
        }, function(response) {
            var ip = '';
            response.on('data', function(d) {
                ip += d;
            });
            response.on('end', function() {
                if (ip) {
                    callback(null, ip);
                } else {
                    callback('could not get public ip address :(');
                }
            });
        });

    } else {
        return public_ip;
    }
}

// 월요일인지 구합니다
function GetIsMonday() {

    var day = new Date();

    var week = new Array(1, 2, 3, 4, 5, 6, 7);

    if (week[day.getDay()] === 2) {

        return true;

    } else {

        return false;
    }
}

/**
 * @param 현재 날짜 d
 * 
 * 현재 달에서 몇주차인지 가져오는 함수
 */
function getWeekOfMonth(d) {
    var date = d;
    date.setHours(0, 0, 0, 0);
    // Thursday in current week decides the year.
    date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
    // January 4 is always in week 1.
    var week1 = new Date(date.getFullYear(), date.getMonth(), 4);
    // Adjust to Thursday in week 1 and count number of weeks from date to week1.
    let _week = 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
    return "0" + _week;
}

/**
 * 두자리로 월 표시하는 함수
 */
function getMonth(d) {

    var month = d.getMonth() + 1;
    return month < 10 ? '0' + month : '' + month; // ('' + month) for string result 
}

function getRankTable() {
    let _date = new Date();
    let _w = getWeekOfMonth(_date);
    let _m = getMonth(_date);
    let _y = _date.getFullYear();

    let _table = _y + _m + _w;
    return _table;


}

//특수문자 필터링 (더이상 사용하지 않지만 예시로 둡니다.)
function filter_response_spcail_string(msg) {

    var words = ["^", "%", "$", "@", "!", "&", "*", "(", ")", "_", "-", "+", "~", "\\", "//", "{", "}", "[]", ";", ":", "=", "<", ">"];


    for (var n = 0; n < words.length; n++) {

        if (msg.indexOf(words[n]) != -1) {

            //비속어 감지!
            console.log("특수문자 체크 =============================" + n);

            return false;
        } //if
    } //for 

    return true;
}


function isEmpty(value) {
    if (value === "" || value === null || value === undefined || (value !== null && typeof value === "object" && !Object.keys(value).length)) {
        return true
    } else {
        return false
    }


}

const crypto = require('crypto');

function crypto_encryp(value) {
    const _key = '!eogksalsrnrakstp@#';

    var cripto_packet = crypto.createCipher('aes192', _key);
    var _packet = cripto_packet.update(value, 'utf8', 'hex') + cripto_packet.final('hex');

    return _packet;
}

function crypto_decryp(value) {
    const _key = '!eogksalsrnrakstp@#';

    var decripto = crypto.createDecipher('aes192', _key);
    var _packet = decripto.update(value, 'hex', 'utf8') + decripto.final('utf8');

    return _packet;
}

function CryptoJS_EN(value) {

    var _packet = CryptoJS.AES.encrypt(value, "!eogksalsrnrakstp@#")

    return _packet;
}


function CryptoJS_DE(value) {

    var _packet = CryptoJS.AES.decrypt(value, "!eogksalsrnrakstp@#");
    var _jpacket = JSON.parse(_packet.toString(CryptoJS.enc.Utf8));

    return _jpacket;
}

function Check_Packet_Time(date) {

    var newDate = new Date();
    console.log("API 날짜 찍힙니다 =================" + newDate);
    var time = Date.parse(newDate);
    console.log("API 날짜 변환값 찍힙니다 =================" + time);

    var time_res = time - date;

    if (time_res > 100) {
        console.log("TOO LATE PACKET TIME (It will be hack!!) time_result = " + time_res);
        return false;
    } else {
        return true;
    }
}

function Check_isGuest(nick_name) {
    var subValue = "Guest_";
    var iValue = nick_name.indexOf(subValue);

    if (iValue === 0) {
        //Guest는 UUID 가 존재하지않으며 로그상 접속환경이 분분명함으로 로그를 남기지 않습니다.
        return true;
    } else {
        return false;
    }
}

function getRemoteAddr(req) {
    return req.headers['x-forwarded-for'] || req.connection.remoteAddress;
}


module.exports = {
    getRankTable: getRankTable,
    getMonth: getMonth,
    getWeekOfMonth: getWeekOfMonth,
    GetIsMonday: GetIsMonday,
    getPublicIP: getPublicIP,
    getServerIP: getServerIP,
    make_packet: make_packet,
    isEmpty: isEmpty,
    crypto_encryp: crypto_encryp,
    crypto_decryp: crypto_decryp,
    CryptoJS_EN: CryptoJS_EN,
    CryptoJS_DE: CryptoJS_DE,
    Check_Packet_Time: Check_Packet_Time,
    Check_isGuest: Check_isGuest,
    getRemoteAddr: getRemoteAddr
}