const mysql                   = require('./mysql');
const async                   = require('async');       // kevin added
const PACKET_ERR              = require('./packet_err').PACKET_ERR;
const filter                = require('../common/util').filter_response; // 안씁니다 
const filter_spcail_string = require('../common/util').filter_response_spcail_string;
const isGoodWord = require('../common/global_array');

exports.regit_clan = function(session_id, clanName, clanDesc, callback){

    var  task =[

        function(callback1){
            var bad_word_check_name=isGoodWord.check(clanName);
            var bad_word_check_decs=isGoodWord.check(clanDesc);

            if(bad_word_check_name.isFound){
                callback(PACKET_ERR.CHECK_PROHIBIT_WORDS_NO_WORDS, { word:bad_word_check_name.word});
                return;
            }else if(bad_word_check_decs.isFound) {
                callback(PACKET_ERR.CHECK_PROHIBIT_WORDS_NO_WORDS, {word: bad_word_check_decs.word});
                return;
            }else if(clanDesc.length>40){
                callback(PACKET_ERR.CLAN_EXPLAINED_TOO_MUCH);
                return;
            }
            else{

                callback1();

               /*  if(filter_spcail_string(clanName)===fasle){
                    callback(PACKET_ERR.CHECK_PROHIBIT_WORDS_SPECIAL_WORDS);
                }else{
                    callback1();
                } */
               
            }
        },

        function(callback1){

            

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

                             /*    result.forEach(element => {
                                    minedata.id = element.id;
                                    minedata.nickname = element.nickname;
                                }); */

                                for(var i=0; i< result.length; i++){
                                    for(var j=0 ; j<result[i].length; j++)
                                    {
                                        minedata.id = result[i][j].id;
                                        minedata.nickname = result[i][j].nickname;
                                        minedata.avatar = result[i][j].avatar;
                        
                                    }
                                    
                                }
                              //  console.log("아바타 "+minedata.avatar);
                              //  console.log("아이디 _ 닉네임 "+minedata.id+"=="+minedata.nickname);

                                minedata.clanname = clanName;
                                minedata.clandesc = clanDesc;
                              //  console.log("클랜네임 "+minedata.clanname);
                             //   console.log("클랜설명 "+minedata.clandesc);
                                callback1(null, minedata);
                            }else{
                                console.log('read_rank_school >> sessionId Not Match!!!'+err1);  
                                callback(PACKET_ERR.MYSQL_READ_BY_SESSION_NOT_MATCH);
                                return;
                            }
                            
                        }
                    });

                }

            })  
        },
        function(clandData,callback1){

            mysql.getWebWrite().getConnection((err1,con)=>{
                if(err1){
                    if(con) con.release();
                    console.error('read_rank_school >>con error (mysql err)!!!'+err1);                 
                    callback(PACKET_ERR.WRITE_CLAN_DATA_ERROR,null);
                    return;

                }else{// 기존에 클랜을 만든것이 있는가?
                    con.query("SELECT COUNT(*) cnt FROM Clans WHERE is_dell = 0 AND (name=? OR manager_id=?)  ", [clandData.clanname,clandData.id] ,function(err, results){
                        if(con) con.release();
                        if(err){
                            console.error("regit clan conn err");
                            callback(PACKET_ERR.REGIT_CLAN_SAME_CLAN_NAME,null);
                             return;
                        }else{
                           
                            if(results[0].cnt > 0){
                                console.error('regit clan error same clan name exsits');                 
                                callback(PACKET_ERR.REGIT_CLAN_SAME_CLAN_NAME,null);
                             //   console.log("클랜등록 드러옴");
                                return;
                            }else{

                                mysql.getWebWrite().getConnection((err1,con2)=>{
                                    if(err1){
                                        if(con2) con2.release();
                                        console.error('read_rank_school >>con error (mysql err)!!!'+err1);                 
                                        callback(PACKET_ERR.WRITE_CLAN_DATA_ERROR,null);
                                        return;
                    
                                    }else{//클랜을 만들려하는데 이미 다른 클랜의 멤버가 되어있다. 예외처리
                                        con2.query("SELECT COUNT(*) cnt FROM ClanMembers WHERE is_member = 1 AND is_dell=0 AND user_id=?", [clandData.id] ,function(err, results){
                                            if(con2) con2.release();
                                            if(err){
                                                console.error("regit clan conn err");
                                                callback(PACKET_ERR.REGIT_CLAN_SAME_CLAN_NAME,null);
                                                 return;
                                            }else{
                                                if(results[0].cnt > 0){
                                                    console.error('regit clan error You already Another Mem');                 
                                                    callback(PACKET_ERR.CLAN_CANT_RGITL_ALREADY_ANOTHER_CLAN_MEMBER,null);
                                                    return;
                                                }else{
                                                    mysql.getWebWrite().getConnection((err2, con1)=>{
                                                        if(err1){
                                                            if(con1) con1.release();
                                                            console.error('read_rank_school >>con error (mysql err)!!!'+err1);                 
                                                            callback(PACKET_ERR.WRITE_CLAN_DATA_ERROR,null);
                                                            return;
                                        
                                                        }else{ //여기저기 가입신청은 했는데. 클랜을 만들경우 기존 신청 멤버 자료를 델리트 해준다. 
                                                            let _query = "UPDATE ClanMembers SET is_dell = 1 WHERE user_id=? AND is_manager=0 AND is_member =0";
                                                            con1.query(_query,[clandData.id],(err, result, fields)=>{
                                                                if(con1) con1.release();
                                                                if(err){
                                                                    console.error('read_uuid_4_rank_redis >> query error (mysql err)!!!'+err1);  
                                                                    callback(PACKET_ERR.COMMON_FAIL, null);
                                                                    return;
                                                                }else{
                                                                    mysql.getWebWrite().getConnection((err1,con)=>{
                                                                        if(err1){
                                                                            if(con) con.release();
                                                                            console.error('read_rank_school >>con error (mysql err)!!!'+err1);                 
                                                                            callback(PACKET_ERR.WRITE_CLAN_DATA_ERROR,null);
                                                                            return;
                                                        
                                                                        }else{
                                                                            let _query = "call web_insert_clan(?,?,?,?,@_clan_id);SELECT @_clan_id as _clan_id";
                                                                            con.query(_query,[clandData.id,
                                                                                              clandData.clanname, 
                                                                                              clandData.nickname,
                                                                                              clandData.clandesc ], (err, result)=>{
                                                                                                if(con) con.release(); 
                                                                                                if(err){  
                                                                                                    console.error('read_rank_school !!!!>> query error (mysql err)!!!'+err);                 
                                                                                                    callback(PACKET_ERR.REGIT_CLAN_SAME_CLAN_NAME,null);
                                                                                                    return;
                                                                                                }else{
                                                        
                                                                                                    for(var i=0; i< result.length; i++){
                                                                                                        for(var j=0 ; j<result[i].length; j++)
                                                                                                        {
                                                                                                            var tmp = result[i][j];
                                                                                                      
                                                                                                        }
                                                                                                        
                                                                                                    }
                                                                                         
                                                                                                    var id;
                                                                                                    for(var i=0; i< result.length; i++){
                                                                                                        for(var j=0 ; j<result[i].length; j++)
                                                                                                        {
                                                                                                           id = result[i][j]._clan_id;
                                                                                                //            console.log("결과값 "+i+"번쨰"+result[i][j]._clan_id);
                                                                                                        }
                                                                                                        
                                                                                                    }
                                                                                                //    console.log("클랜등록 드러옴 아바타값"+clandData.avatar);
                                                                                                    
                                                                                                    mysql.getWebWrite().getConnection((err1,con1)=>{
                                                                                                        if(err1){
                                                                                                            if(con1) con1.release();
                                                                                                            console.error('read_rank_school >>con error (mysql err)!!!'+err1);                 
                                                                                                            callback(PACKET_ERR.WRITE_CLAN_DATA_ERROR,null);
                                                                                                            return;
                                                                                        
                                                                                                        }else{
                                                                                                            let _query2 = "call web_join_clan_master(?,?,?,?)";
                                            
                                                                                                            con1.query(_query2,[id, clandData.id, clandData.nickname, clandData.avatar],(err, result, fields)=>{
                                                                                                                if(con1) con1.release();
                                                                                                                if(err){
                                                                                                                    console.error('read_uuid_4_rank_redis >> query error (mysql err)!!!'+err);  
                                                                                                                    callback(PACKET_ERR.JOINCLAN_ALREADY_JOIN,null);
                                                                                                                    return;
                                                                                                                }else{
                                                                        
                                                                                                                    callback1(PACKET_ERR.SUCCESS , null);
                                                                                                                }
                                                                                                            });
                                                                                                        }       
                                    
                                                                                                    });
                                                                                                   
                                                                                               
                                                                                            
                                                                                                }
                                                                                              });//컨 쿼리
                                                                        }
                                    
                                    
                                    
                                                                    });
                                                                }
                    
                                                            });
                    
                                                        }
                    
                                                    });
                                                }
                                            }
                                        });
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
            callback(PACKET_ERR.WRITE_CLAN_DATA_ERROR,null);
        }else{
   
            callback(PACKET_ERR.WRITE_CLAN_DATA_SUCESS,null);
        }     
    });
}