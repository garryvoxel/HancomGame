const mysql                   = require('./mysql');
const async                   = require('async');       // kevin added
const PACKET_ERR              = require('./packet_err').PACKET_ERR;
const word_pool               = require('../common/global_array');

// 비속어를 백오피스나 외부에서 새로 디비에서 불러와서 셋팅하기위해 만들었습니다. 
// 비속어는 서버 스타트시 이과정을 1회 실시 합니다. 
exports.loadWord = function(callback){

    mysql.getWebRead().getConnection((err,con)=>{
        if(err){
            con.release();
            console.error('write_friend_complete >> getConnection .1. mysql err' + err);            
            callback(PACKET_ERR.COMMON_GET_CONNECTION_ERR);
        }else{
            con.query('SELECT word FROM Slang', function(err,result,fields){
                con.release();
                if(err){
                    console.log('write_friend_complete >> query.1..'+err);
                    callback(PACKET_ERR.ACCEPT_FRIEND_REQUEST_QUERY1);
                }else{
                    var arr_word =[];
            
                    for(var i=0; i < result.length; i++){
                        arr_word[i]= result[i].word;
                    }

                    // 비속어를 스태틱 array 에 담습니다.
                    word_pool.set(arr_word);
                    callback(PACKET_ERR.SUCCESS);
                 
                }
            })
        }
    });
}

exports.write_friend_complete = function(session_id,friend_nick_name,callback){

    var tasks =[
        //자기 uuid 가져옥
        function(callback1){
            mysql.getAccountWrite().getConnection((err,con)=>{
                if(err){
                    con.release();
                    console.error('write_friend_complete >> getConnection .1. mysql err' + err);            
                    callback(PACKET_ERR.ACCEPT_FRIEND_REQUEST_MSQL1);
                }else{
                    let _query = 'call SPGetFriendInfo(?,?,@sid_uid,@friend_uid,@ret);SELECT @ret as ret,@sid_uid as sid_uuid,@friend_uid as friend_uuid';
                    con.query(_query,[session_id,friend_nick_name],(err1,result,fields)=>{
                        con.release();
                        if(err1){
                            console.log('write_friend_complete >> query.1..'+err1);
                            callback(PACKET_ERR.ACCEPT_FRIEND_REQUEST_QUERY1);
                        }else{
                            if(result.length <= 0){
                                console.log('write_friend_complete >> res..1.'+result.length);
                                callback(PACKET_ERR.ACCEPT_FRIEND_REQUEST_RES1);
                            }else{
                                let _rdata={};
                                
                                _rdata.result = PACKET_ERR.SUCCESS;

                                if(result[1][0].sid_uuid === null ||
                                    result[1][0].friend_uuid === null){
                                        callback(PACKET_ERR.ACCEPT_FRIEND_REQUEST);
                                    }else{
                                        _rdata.session_uuid = result[1][0].sid_uuid;
                                        _rdata.friend_uuid = result[1][0].friend_uuid;
                                        console.log(JSON.stringify(_rdata));
                                        callback1(PACKET_ERR.SUCCESS,_rdata);
                                    }

                            }
                        }
                    });
                }
            });

        },
        function(data,callback1){
            mysql.getWebWrite().getConnection((err,con)=>{
                if(err){
                    console.error('write_friend_complete >> getConnection .2. mysql err' + err);    
                    callback(PACKET_ERR.ACCEPT_FRIEND_REQUEST_MSQL2);        
                }else{
                    let _query = 'call SPFriendComplete(?,?,@ret);SELECT @ret as ret';
                    con.query(_query,[data.session_uuid,data.friend_uuid],(err1,result,fields)=>{
                        con.release();
                        if(err1){
                            console.log('write_friend_complete >> query.2..'+err1);
                            callback(PACKET_ERR.ACCEPT_FRIEND_REQUEST_QUERY2);       
                        }else{
                            if(result.length<=0){
                                console.log('write_friend_complete >> res..2.'+result.length);
                                callback(PACKET_ERR.ACCEPT_FRIEND_REQUEST_RES2);     
                            }else{
                                callback1(PACKET_ERR.SUCCESS);
                            }
                        }
                    });
                }
            });

        }
    ];

    async.waterfall(tasks,(err,data)=>{
        callback(err,data);
    });

}