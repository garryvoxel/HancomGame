/**
 * 파일명: gcserver/src/call_apiserver.js
 * 세션아이디 얻기 함수 정의
 * API서버에 세션ID 요청 API 호출(닉네임을 파라미터로 전송)
 * 요청객체 암호화를 진행하여 전송
 */
const request = require('request');
const svrcfg = require('../config/server.json')[process.env.NODE_ENV];
const PACKET_ERR = require('./packet_err').PACKET_ERR;
const CryptoJS_EN = require('../common/utils').CryptoJS_EN;
/**
 * 세션아이디 얻기
 * @param {*닉네임 - unique} nick_name 
 * @param {*get_session_id 실행후 호출되는 콜백 정의} callback  
 */
exports.get_session_id = function(nick_name,callback){
    /**
     * API서버에 request_session_id 요청
     * response는 닉네임에 대응하는 세션아이디
     */
    let _host = svrcfg.API_SERVER_PROTOCOL+'://'+svrcfg.API_SERVER_HOST+((svrcfg.API_SERVER_PORT != null)? (':'+svrcfg.API_SERVER_PORT) :'')+'/game/request_session_id';
    let _method = 'POST';
    let _json = {};
    _json.nick_name = nick_name;
    //닉네임이 들어있는 객체를 암호화
    var ctipto_output = CryptoJS_EN(JSON.stringify(_json));

    let _jsonPack = {};
    _jsonPack.packet = "" + ctipto_output; // toString()을 쓰면 에러가 납니다.

    var _options ={
        url:_host,
        method:_method,
        json:_jsonPack
    };
    console.log("get_session_id - HOST : "+_host);
    //apiserver서버로 POST요청 보내기 & response를 파라미터로 콜백 호출
    request(_options,(err,res,body)=>{
        if(err){
            console.log('CheckSession err : '+err);
            callback(PACKET_ERR.GET_SESSION_ID,0);
        }
        else{
            //SUCCESS
            console.log("get_session_id - OK : "+body);
            callback(PACKET_ERR.SUCCESS,body);
        }

    });
}