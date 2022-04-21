const mysql                   = require('./mysql');
const async                   = require('async');       // kevin added
const PACKET_ERR              = require('./packet_err').PACKET_ERR;

exports.join_clan = function(session_id, clan_id, callback){

    var task = [

        function(callback1){

            var id;
    

            mysql.getAccountRead().getConnection((err,con)=>{
                if(err){   
                    if(con) con.release();
                    console.error('read_rank_school >> getConnection error (mysql err)!!!'+err);                 
                    callback(PACKET_ERR.READ_RABK_DOESNT_EXIST);
                    return;
                }else{

                    let _query = "call WEB_check_session(?)";
                    con.query(_query,[session_id],(err1,result,fields)=>{
                        if(con) con.release();
                        if(err1){
                            console.log('read_rank_school >> query error (mysql err)!!!'+err1);  
                            callback(PACKET_ERR.MYSQL_READ_BY_SESSION_NOT_INFO);
                            return;
                        }else{   

                            if(result[0] !== null){
                              
                                let minedata={};
                         
                                for(var i=0; i< result.length; i++){
                                    for(var j=0 ; j<result[i].length; j++)
                                    {
                                        minedata.id = result[i][j].id;
                                        minedata.nickname = result[i][j].nickname;
                                        minedata.avatar = result[i][j].avatar;
    
                                    }
                                    
                                }
    
                      
                                callback1(null, minedata);
                            }else{
            
                                callback(PACKET_ERR.MYSQL_READ_BY_SESSION_NOT_MATCH);
                                return;
                            }
                            
                        }
                    });

                }

            })    

        },

        function(minedata, callback1){
            mysql.getWebRead().getConnection((err,con1)=>{
                if(err)
                {
                    console.log('clanJoinMember get con err >> query error (mysql err)!!!'+err);  
                    callback(PACKET_ERR.MYSQL_READ_BY_SESSION_NOT_INFO);
                    return;
                }else{
                    con1.query("SELECT count(*) cnt FROM ClanMembers WHERE user_id=? AND is_member=1 AND is_dell = 0", [minedata.id], function(err, result){
                        if(con1) con1.release();
                        if(err){
                            console.error("join clan query err");
                            callback(PACKET_ERR.COMMON_QUERY_ERROR,null);
                            return;
                        }else{
                            if(result[0].cnt > 0){
                                console.error("join clan Alread join");
                                callback(PACKET_ERR.JOIN_CLANMEBER_ALREDY_JOIN,null);
                                return;

                            }else{
                            
                                callback1(null, minedata);

                            }
                        }
                    });
                }

            });
            
        },

        function(minedata, callback1){
            mysql.getWebRead().getConnection((err,con1)=>{
                if(err)
                {
                    console.log('clanJoinMember get con err >> query error (mysql err)!!!'+err);  
                    callback(PACKET_ERR.MYSQL_READ_BY_SESSION_NOT_INFO);
                    return;
                }else{
                    con1.query("SELECT count(*) cnt FROM ClanMembers WHERE user_id=? AND clan_id=? AND is_dell = 0", [minedata.id, clan_id], function(err, result){
                        if(con1) con1.release();
                        if(err){
                            console.error("join clan query err");
                            callback(PACKET_ERR.COMMON_QUERY_ERROR,null);
                            return;
                        }else{
                            if(result[0].cnt > 0){
                                console.error("join clan Alread join");
                                callback(PACKET_ERR.CLAN_DO_JOIN_ALREADY_SAME_CLAN_BEFOR,null);
                                return;

                            }else{
                            
                                callback1(null, minedata);

                            }
                        }
                    });
                }

            });
            
        },

        function(minedata, callback1){

         
            mysql.getWebWrite().getConnection((err,con)=>{

                if(err)
                {
                    console.log('clanJoinMember get con err >> query error (mysql err)!!!'+err);  
                    callback(PACKET_ERR.MYSQL_READ_BY_SESSION_NOT_INFO);
                    return;
                }else{

                    let _query = "call web_join_clan(?,?,?,?)";

    
                    
                    con.query("SELECT count(*) cnt FROM ClanMembers WHERE user_id=? AND clan_id=? AND is_dell = 0", [minedata.id, clan_id], function(err, result){
                        if(err){
                            if(con) con.release();
                            console.error("join clan query err");
                            callback(PACKET_ERR.COMMON_QUERY_ERROR,null);
                             return;
                        }else{

                            if(result[0].cnt > 0){
                                console.error("join clan Alread join");
                                callback(PACKET_ERR.JOIN_CLANMEBER_ALREDY_JOIN,null);
                                 return;

                            }else{
                                let _query = "call web_join_clan(?,?,?,?)";

                                con.query(_query,[clan_id, minedata.id, minedata.nickname, minedata.avatar],(err, result, fields)=>{
                                    if(con) con.release();
                                    if(err){
                                        console.error('read_uuid_4_rank_redis >> query error (mysql err)!!!'+err);  
                                        con.release(); 
                                        callback(PACKET_ERR.JOINCLAN_ALREADY_JOIN,null);
                                        return;
                                    }else{
                                        callback1(PACKET_ERR.SUCCESS , null);
                                    }
                                });
                            }
                        
                           
                        }
                    });
                    
                  
                }
            });
         
        }

    ];

    async.waterfall(task,(err,data)=>{
        if(err)
        {
            callback(PACKET_ERR.READ_RABK_DOESNT_EXIST,data);
        }else{

            callback(PACKET_ERR.SUCCESS,data);
        }
     
    });

  /*   const writeMysql = mysql.getWebWrite();

    writeMysql.getConnection((err,con)=>{
        if(err){   
            if(con) con.release();
            console.error('read_rank_school >> getConnection error (mysql err)!!!'+err);                 
            callback(PACKET_ERR.TYPING_READ_POS_PRACTICE_MYSQL,null);
        }else{

            let _query = "call web_join_clan(?,?,?");


        }
    }); */


}
