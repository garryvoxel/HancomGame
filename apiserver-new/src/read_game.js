//const user_session_redis      = require('./redis').user_session_redis;
const redis                     = require('./redis');
const mysql                     = require('./mysql');
const async                     = require('async');                 // kevin added
const PACKET_ERR                = require('./packet_err').PACKET_ERR;
const USER_SESSION_REDIS        = require('../config/redis.json')[process.env.NODE_ENV || 'development'].USER_SESSION_REDIS;

exports.read_user_info = function(nick_name,callback){
    const user_session_redis = redis.getUserSessionRedis();
    var _userinfo = {};
    user_session_redis.hgetall(nick_name,(err,res)=>{
        if(err){
            callback(PACKET_ERR.GAME_READ_BY_NICNAME_USERINFO_REDIS_DB,null);
            return;
        }else{
            if(res <=0 ){    
                read_mysql(nick_name,(err1,res1)=>{
                    if(err1){         
                        callback(err1);
                        return;
                    }else{
                        if(res1.length <= 0){
                            console.log("get userinfo error...");
                            callback(PACKET_ERR.GAME_READ_BY_NICNAME_USERINFO_GET_MYSQL_DB,null);
                            return;
                        }
                        else{
                            var _val = res1[0];                            
                            _userinfo.session_id =_val.Session_id;
                            _userinfo.uuid       = _val.UUID;
                            user_session_redis.hmset(nick_name,_userinfo,(err2,res2)=>{     
                                if(err2){     
                                    callback(PACKET_ERR.GAME_READ_BY_NICNAME_WRITE_USERINFO_REDIS,null);
                                    return;                             
                                }else{         
                                    callback(PACKET_ERR.SUCCESS,_userinfo);
                                    return;
                                }
                            });                            
                        }
                    }
                });                
            }else{             
                _userinfo.uuid          = res.uuid;
                _userinfo.session_id    = res.session_id;   
                callback(PACKET_ERR.SUCCESS,_userinfo);
                return;
            }
        }
    });
}
exports.read_session_id = function(nick_name,callback){    
    const user_session_redis = redis.getUserSessionRedis();
    var _sid = {};
    user_session_redis.hgetall(nick_name,(err,res)=>{
        if(err){
            _sid.seesion_id=0;
            callback(PACKET_ERR.READ_SESSION_ID_REDIS_DB_CONN,_sid);
            return;
        }else{
            if(res<=0){
                read_mysql(nick_name,(err1,res1)=>{
                    if(err1){
                        _sid.seesion_id=0;
                        callback(err,_sid);        
                        return;                
                    }else{                    
                        if(res1.length <= 0 ){
                            console.log('read session id from mysql!! error');
                            callback(PACKET_ERR.READ_SESSION_ID_GET_MYSQL_DB,0);
                            return;
                        }else{
                            var _val = res1[0];                            
                            _sid.session_id =_val.Session_id; 
                            _sid.uuid       = _val.UUID;                           
                            user_session_redis.hmset(nick_name,_sid,(err2,res2)=>{
                                if(err2){
                                    console.log('read_session_id write redis');
                                    callback(PACKET_ERR.READ_SESSION_WRITE_REDIS,0);
                                    return;
                                }else{
                                    if(res2 <=0){
                                        console.log('read_session_id write redis..22');
                                        callback()
                                        return;
                                    }else{
                                        //3시간 10800
                                        user_session_redis.expire(nick_name,USER_SESSION_REDIS.EXPIRE);
                                        callback(PACKET_ERR.SUCCESS,_val.Session_id);
                                    }

                                    return;
                                }
                            });
                        }                        
                    }
                });
            }else{
                var session_id = res.session_id;
                callback(PACKET_ERR.SUCCESS,session_id);
                return;        
            }
        }
    });    
};

/**
 * 섹션아이디로 유저 정보 가져오기
 * @param {* 세션아이디} session_id 
 * @param {* 콜백함수} callback 
 */
exports.request_userinfo_by_session = function(session_id,callback){
    read_mysql_by_session(session_id,(err,res)=>{
        if(err){
            callback(err,null);
            return;            
        }else{
            if(res.length <= 0){
                callback(err,null);
                return;
            }else{
                var _val = res[0];   
                callback(PACKET_ERR.SUCCESS,_val);
            }
        }

    });
}

/**
 * 닉네임으로 유저 정보를 가져옴
 * @param {* 닉네임} nick_name 
 * @param {* 콜백함수} callback 
 */
function read_mysql(nick_name,callback){
    mysql.getAccountRead().getConnection((err,conn)=>{
        if(err){
            if(conn) conn.release();
            console.log('read mysql error...!!!');
            callback(PACKET_ERR.READ_SESSION_ID_MYSQL_DB_CONN,0);
        }else{            
            conn.query("SELECT `id` AS UUID, `session_id` AS Session_id FROM `Users` WHERE `nickname` = ?",[nick_name],(err1,rows,fields)=>{
                conn.release();
                if(err1){                    
                }else{
                    if(rows.length <=0){    
                        callback(PACKET_ERR.READ_SESSION_ID_GET_MYSQL_DB,0);
                    }else{
                        callback(PACKET_ERR.SUCCESS,rows)
                    }
                }
            });
        }
    });
}

/**
 * 섹션아이디로 유저 정보를 가져온다
 * @param {* 섹션아이디} session_id 
 * @param {* 콜백함수} callback 
 */
function read_mysql_by_session(session_id, callback) {
    mysql.getAccountRead().getConnection((err, conn) => {
        if (err) {        
            console.log('read mysql error...!!!');
            if(conn) conn.release();
            callback(PACKET_ERR.MYSQL_READ_BY_SESSION_CONNECT, 0);
            
        } else {
    
            conn.query("SELECT `id`, `nickname`, `avatar`, `points`, `target_typing_speed`, `target_typing_accuracy` FROM Users WHERE `session_id` = ?", [session_id], (err1, users, fields) => {
                conn.release();
                if (err1) {
                    callback(PACKET_ERR.MYSQL_READ_BY_SESSION_QUERY, 0);                    
                } else {                    
                    if (users.length <= 0) {
                        callback(PACKET_ERR.MYSQL_READ_BY_SESSION_NOT_INFO, 0);
                        
                    } else {
                        mysql.getWebRead().getConnection((err, conn) => {
                            if (err) {
                                console.error(err);
                                callback(PACKET_ERR.MYSQL_READ_BY_SESSION_CONNECT, 0);
                                if(conn) conn.release();
                            } else {
                                var my_clan_name = null;
                                let _q = 'call SPWebUserInfo(?,@clan_name,@school_name);SELECT @clan_name as clan_name,@school_name as school_name';
                                conn.query(_q,[users[0].id],(err1,rows,fields)=>{
                                    conn.release();
                                    if(err1){
                                        console.error(err1)
                                        callback(PACKET_ERR.MYSQL_READ_BY_SESSION_QUERY, 0);
                                    }else{

                                        mysql.getWebRead().getConnection((err, con)=>{
                                            if(err){
                                                if(con) con.release();
                                                console.error('get_my_clan >> getConnection error (mysql err)!!!'+err);                 
                                                callback(PACKET_ERR.COMMON_GET_CONNECTION_ERR);
                                                return;
                                            }else{
                                                let _query = "call web_select_my_claninfo_nick(?)";
                                                con.query(_query,[users[0].nickname],(err, result, fields)=>{
                                                    con.release();
                                                    for(var i=0; i< result.length; i++){
                                                        for(var j=0 ; j<result[i].length; j++)
                                                        {
                                                            my_clan_name  = result[i][j].name;
                                                      
                                                        }
                                                        
                                                    }

                                                    if (rows.length) {
                                                      
                                                         users[0].clan = my_clan_name;
                                                         users[0].school = rows[1][0].school_name;
                                                         console.log('read_game >> 1..users '+JSON.stringify(users));
                                                         callback(PACKET_ERR.SUCCESS, users)
                                                     } else {
                                                       
                                                         users[0].clan = my_clan_name;
                                                         users[0].school = null;
                                                         console.log('read_game >> 2..users '+JSON.stringify(users));
                                                         callback(PACKET_ERR.SUCCESS, users)
                                                     }
                                                   
                                                });

                                            }
                                        });

                                       
                                    }
                                });                               

                                    
                            }
                                /*conn.query('SELECT c.`name` FROM `ClanMembers` AS m JOIN `Clans` AS c ON m.`clan_id` = c.`id` WHERE m.`user_id` = ?', [users[0].id], (error, clans) => {
                                    conn.release();
                                    if (error) {
                                        console.error(error)
                                        callback(PACKET_ERR.MYSQL_READ_BY_SESSION_QUERY, 0);
                                    } else {
                                        if (clans.length) {
                                            users[0].clan = {
                                                name: clans[0].name
                                            }
                                        } else {
                                            users[0].clan = null
                                        }

                                        mysql.getWebRead().getConnection

                                        callback(PACKET_ERR.SUCCESS, users)
                                    }
                                })*/
                            //}
                        })
                    }
                }
            });
        }
    });
}

// kevin added
// 채널 user count 조회
exports.show_channel = function(game_code, callback){

    if (null == game_code) {
        callback('show_channel parameter error');
        return;
    }

    mysql.getGameRead().getConnection(function(error, connection) {
        if (error) {
            if (connection) {
                connection.release();
            }
            callback(error);
            return;
        }

        let query = 'SELECT game_code, channel_id, current_count, max_count FROM TbChannel WHERE game_code = ? ';
        let params = [game_code];

        connection.query(query, params, function (error, results, fields) {
            if(connection) connection.release();
            if (error) {
                callback(error);
                return;
            }


            let result = [];
            async.forEach(results, function(item, cb_for) {
                result.push({
                    'game_code' : item['game_code'],
                    'channel_id' : item['channel_id'],
                    'current_count' : item['current_count'],
                    'max_count' : item['max_count']
                });
                cb_for();
            }, function (){
                callback(null, result);
            });
        });
    });
};

const word_pool            = require('../common/global_array');
exports.check_prohibit_word = function(words,callback){

    var bad_word_check=word_pool.check(words);
    if(bad_word_check.isFound){
        callback(PACKET_ERR.CHECK_PROHIBIT_WORDS_NO_WORDS);            
        return;
    }else{
        callback(PACKET_ERR.SUCCESS);            
        return;     
    }
}

/* const check_words_token = require('./check_prohibit_word').check_words_token;
exports.check_prohibit_word = function(words,callback){
    var _words = words.split(/[\s\d/;.,!@#$%^&*()_-]+/);
    //console.log(_str_room_title);
    _words = _words.join(',');    
    var _s = check_words_token(_words);    
    //console.log('s2 > '+_s.toString());    
    
    mysql.getWebRead().getConnection((err,con)=>{
        if(err){            
            if(con) con.release();
            console.error("check_words_token >> getConnection error..!" +err);
            callback(PACKET_ERR.CHECK_PROHIBIT_WORDS_MYSQL);
            return;
        }else{     
            //let _q = 'select count(*) as cnt from WebDB.Slang where word REGEXP ?';
            let _q = 'select count(*) as cnt from WebDB.Slang where word in (?'+')';
            //let _q = 'select word cnt from WebDB.Slang where word in (?'+')';
            con.query(_q,[_s],(err1,rows,fields)=>{
                if(con) con.release();
                if(err1){        
                    console.error("check_words_token >> query error..!" +err1);
                    callback(PACKET_ERR.CHECK_PROHIBIT_WORDS_MYSQL_QUERY);            
                    return;
                }else{     
                    if(rows.length <=0 ){
                        console.error('check_words_token >> query res '+rows.length);
                        callback(PACKET_ERR.CHECK_PROHIBIT_WORDS_MYSQL_QUERY_RES);            
                        return;
                    }else{
                        if(rows[0].cnt == 0){
                            callback(PACKET_ERR.SUCCESS);            
                            return;                            
                        }else{
                            callback(PACKET_ERR.CHECK_PROHIBIT_WORDS_NO_WORDS);            
                            return;
                        }

                        
                    }
                    
                }
            });
        }       
    });  
} */

function isEmpty(value){
    if( value == "" || value == null || value == undefined || ( value != null && typeof value == "object" && !Object.keys(value).length ) ){
         return true 
        }else{
         return false }

   
};