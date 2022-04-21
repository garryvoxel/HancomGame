const mysql                             = require('./mysql');
const mysql_acc                         = require('./mysql');

const async                             = require('async');
const PACKET_ERR                        = require('./packet_err').PACKET_ERR;


exports.search_all_caln = function(page,pagesize,callback){

    mysql.getWebRead().getConnection((err, con)=>{
        if(err){   
            if(con) con.release();
            console.error('search_all_caln >> getConnection error (mysql err)!!!'+err);                 
            callback(PACKET_ERR.TYPING_READ_POS_PRACTICE_MYSQL,null);
        }else{

            let _query = "call web_select_clans(?,?,@_total_count);SELECT @_total_count as _total_count";

            con.query(_query,[page, pagesize],(err,rows, fields)=>{
                if(con) con.release();
                if(err){
                    console.error('search_all_caln >> query error (mysql err)!!!'+err);                 
                    callback(PACKET_ERR.READ_RABK_DOESNT_EXIST,null);
                    return;
                }else{ 
                    let _data=[];
                    var rowdata ={};

                    if(rows[0][0]!=null){
                        rowdata.AllClan = rows[0];
                        rowdata.TotalCount = rows[2];
                    }else{
                        rowdata.AllClan = "NoClans"
                        rowdata.TotalCount = 0;
                    }
                    _data.push(rowdata);
                    callback(PACKET_ERR.SUCCESS, rowdata);
                    
                   /*  if(rows){
                
                        rowdata.AllClan = rows;
                        rowdata.TotalCount = rows.length;
                       
                         
                      
                    }else{
                        callback(PACKET_ERR.COMMON_NO_DATA, null);
                    } */
                  
                }

            });


        }

    });
}

exports.search_chosed_caln = function(id,callback){

    mysql.getWebRead().getConnection((err, con1)=>{
        if(err){   
            if(con1) con1.release();
            console.error('search_chosed_caln >> getConnection error (mysql err)!!!'+err);                 
            callback(PACKET_ERR.COMMON_FAIL,null);
        }else{

     
            let _query = "SELECT * FROM Clans WHERE id=?";

            con1.query(_query,[id],(err,rows, fields)=>{
                let _data=[];
                let rowdata ={};
                if(con1) con1.release();
                if(err){
                    console.error('search_chosed_caln >> query error (mysql err)!!!'+err);                 
                    callback(PACKET_ERR.COMMON_FAIL,null);
                    return;
                }else{ 
                  
                    
                    if(rows){
                 
                        rowdata.claninfo = rows;

                        console.log("id"+id);
                        var num = parseInt(id);

                        mysql.getWebRead().getConnection((err, con2)=>{
                            if(err){   
                                if(con2) con2.release();
                                console.error('search_chosed_caln >> getConnection error (mysql err)!!!'+err);                 
                                callback(PACKET_ERR.COMMON_FAIL,null);
                            }else{

                                let _query = "SELECT * FROM ClanMembers WHERE clan_id=? AND is_member = 1 AND is_dell=0";
                                con2.query(_query,[num],(err,rows2, fields)=>{
                                    if(con2) con2.release();
                                    if(err){
                                        console.error('search_chosed_caln >> query error (mysql err)!!!'+err);                 
                                        callback(PACKET_ERR.COMMON_FAIL,null);
                                        return;
                                    }else{
                                        if(rows2){
                                     
                            
                                            rowdata.memberinfo = rows2;
                                            rowdata.TotalCount = rows2.length;
        
                                            mysql.getWebRead().getConnection((err, con3)=>{
                                                if(err){   
                                                    if(con3) con3.release();
                                                    console.error('search_chosed_caln >> getConnection error (mysql err)!!!'+err);                 
                                                    callback(PACKET_ERR.COMMON_FAIL,null);
                                                }else{

                                                    let _query = "SELECT * FROM ClanMembers WHERE clan_id=? AND is_member = 0 AND is_dell=0";
                                            
                                                    con3.query(_query,[num],(err,rows3, fields)=>{
                                                        if(con3) con3.release();
                                                        if(err){
                                                            console.error('search_chosed_caln >> query error (mysql err)!!!'+err);                 
                                                            callback(PACKET_ERR.COMMON_FAIL,null);
                                                            return;
                                                        }else{
                                                            if(rows3[0]!==null){
                                                                rowdata.wanab_memberinfo = rows3;
                                                                rowdata.wanab_TotalCount = rows3.length;
                                                                _data.push(rowdata);
                                                                callback(PACKET_ERR.SUCCESS, _data);
                                                                
                                                            }else{
                                                                callback(PACKET_ERR.COMMON_NO_DATA, null);
                                                                return;
                                                            }
                                                        }
                
                                                    });
                                                }

                                            });
                                     
        
        
                                          
                                        }else{
                                          
                                            callback(PACKET_ERR.COMMON_FAIL, null);
                                            return;
                                        }
                                    }
        
                                }); 
                            }

                        });

               

                        
                    }else{
                      
                        callback(PACKET_ERR.COMMON_FAIL, null);
                        return;
                    }
                  
                  
                }

            });


        }

    });
}


exports.get_my_clan = function(session_id,callback){

    task =[

        function(callback1){

            var id;
    
           // console.log("프론트에서 보넨 세션 =========================================>>"+session_id);
            mysql.getAccountRead().getConnection((err,con)=>{
                if(err){   
                    if(con) con.release();
                    console.error('get_my_clan >> getConnection error (mysql err)!!!'+err);                 
                    callback(PACKET_ERR.READ_RABK_DOESNT_EXIST);
                    return;
                }else{

                    let _query = "call WEB_check_session(?)";
                    con.query(_query,[session_id],(err1,result,fields)=>{
                        if(con) con.release();
                        if(err1){
                         
                            console.log('get_my_clan >> query error (mysql err)!!!'+err1);  
                            callback(PACKET_ERR.MYSQL_READ_BY_SESSION_NOT_INFO);
                            return;
                        }else{   

                            if(result[0] !== null){
                              
                                let minedata={};
      
                                for(var i=0; i< result.length; i++){
                                    for(var j=0 ; j<result[i].length; j++)
                                    {
                                        minedata.id = result[i][j].id;
                                    }
                                    
                                }
                               
                                callback1(null, minedata);
                            }else{
                               
                                callback(PACKET_ERR.COMMON_NO_DATA);
                                return;
                            }
                            
                        }
                    });

                }

            })    

        },

        function(minedata, callback1){

            mysql.getWebRead().getConnection((err, con)=>{

                let _query = "call web_select_my_claninfo(?)";
                con.query(_query,[minedata.id],(err, result, fields)=>{
                    if(con) con.release();
                    if(err){
                        console.error('get_my_clan >> query error (mysql err)!!!'+err);  
                        callback(PACKET_ERR.COMMON_FAIL);
                        return;
                    }else{
                        let data =[];
                        let rowdata = {}; // 지역변수화 해야함.
                        
                       /*  if(result[0].length == 0){
                           console.log("널"); 
                        }else{
                            console.log("널아님"); 
                        } */
                      
                        if(result[0].length > 0){
                            rowdata.uuid = minedata.id;
                            rowdata.myclanMember = result[0];
                            rowdata.memberCount = result[0].length;
                            if(result[0][0].clan_id == null){
                                rowdata.MyClanInfo = "클랜정보 없음";
                            }else{
                                let clan_id = result[0][0].clan_id;
                           
                                mysql.getWebRead().getConnection((err, con1)=>{
                                    if(err){   
                                        if(con1) con1.release();
                                        console.error('get_my_clan >> getConnection error (mysql err)!!!'+err);                 
                                        callback(PACKET_ERR.COMMON_GET_CONNECTION_ERR);
                                        return;
                                    }else{

                                        let _query = "SELECT * FROM Clans WHERE id =? AND is_dell =0";
                                        con1.query(_query,[clan_id],(err, result, fields)=>{
                                            if(con1) con1.release();
                                            if(err){
                                                console.error('get_my_clan >> query error (mysql err)!!!'+err);  
                                                callback(PACKET_ERR.COMMON_FAIL);
                                                return;
                                            }else{
                                                if(result){
                                                    rowdata.MyClanInfo = result;
                                                    callback1(null, rowdata);  
                                                }else{
                                                    callback(PACKET_ERR.COMMON_FAIL, null);
                                                }
                                            }
                                        });
                                    }
                                });
                            
                            }
                          
                           
                        }else{
                       
                            callback(PACKET_ERR.COMMON_NO_DATA, null);
                        }

                    }

                });
            });
        }
    ];
    async.waterfall(task,(err,data, count, MyRank)=>{
        if(err)
        {
            callback(PACKET_ERR.READ_RABK_DOESNT_EXIST,data, count, MyRank);
        }else{

            callback(PACKET_ERR.SUCCESS,data, (count/2), MyRank);
        }
     
    });
        
}


exports.get_my_clan_wanab_member = function(session_id,callback){

    task =[

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

            mysql.getWebRead().getConnection((err, con)=>{

                let _query = "SELECT * FROM ClanMembers WHERE user_id =? AND is_member =? AND is_dell = 0";
                con.query(_query,[minedata.id, 0],(err, result, fields)=>{
                    if(con) con.release();
                    if(err){
                        console.error('read_uuid_4_rank_redis >> query error (mysql err)!!!'+err);  
                       
                        callback(PACKET_ERR.READ_RABK_DOESNT_EXIST);
                        return;
                    }else{
                        let data =[];
                        let rowdata = {}; // 지역변수화 해야함.

                        if(result.length > 0){
                            rowdata = result;
                            data.push(rowdata);  
                            callback1(null, data);  
                        }else{

                            callback(PACKET_ERR.COMMON_FAIL, null);
                        }

                    }

                });
            });
        }
    ];
    async.waterfall(task,(err,data, count, MyRank)=>{
        if(err)
        {
            callback(PACKET_ERR.READ_RABK_DOESNT_EXIST,data, count, MyRank);
        }else{

            callback(PACKET_ERR.SUCCESS,data, (count/2), MyRank);
        }
     
    });
        
}

exports.get_my_clan_all = function(session_id,callback){

    task =[

        function(callback1){

            var id;
          //  console.log("프론트에서 보넨 세션 =========================================>>"+session_id);

            mysql.getAccountRead().getConnection((err,con)=>{
                if(err){   
                    if(con) con.release();
                    console.error('get_my_clan >> getConnection error (mysql err)!!!'+err);                 
                    callback(PACKET_ERR.COMMON_FAIL);
                    return;
                }else{

                    let _query = "call WEB_check_session(?)";
                    con.query(_query,[session_id],(err1,result,fields)=>{
                        if(con) con.release();
                        if(err1){
                         
                            console.log('get_my_clan >> query error (mysql err)!!!'+err1);  
                            callback(PACKET_ERR.MYSQL_READ_BY_SESSION_NOT_INFO);
                            return;
                        }else{   

                            if(result[0] !== null){
                              
                                let minedata={};
      
                                for(var i=0; i< result.length; i++){
                                    for(var j=0 ; j<result[i].length; j++)
                                    {
                                        minedata.id = result[i][j].id;
                                    }
                                    
                                }
                               
                                callback1(null, minedata);
                            }else{
                               
                                callback(PACKET_ERR.COMMON_NO_DATA);
                                return;
                            }
                            
                        }
                    });

                }

            })    

        },

        function(minedata, callback1){

            mysql.getWebRead().getConnection((err, con)=>{
                if(err){   
                    if(con) con.release();
                    console.error('get_my_clan >> getConnection error (mysql err)!!!'+err);                 
                    callback(PACKET_ERR.COMMON_FAIL);
                    return;
                }else{
                    let _query = "call web_select_my_claninfo_regit(?)";
                    con.query(_query,[minedata.id],(err, result, fields)=>{
                        if(con) con.release();
                        if(err){
                            console.error('get_my_clan >> query error (mysql err)!!!'+err);  
                            callback(PACKET_ERR.COMMON_FAIL);
                            return;
                        }else{
                            let data =[];
                            let rowdata = {}; // 지역변수화 해야함.
                            
                           /*  if(result[0].length == 0){
                               console.log("널"); 
                            }else{
                                console.log("널아님"); 
                            } */
                          
                            if(result[0].length > 0){
                    
                                rowdata.regitClan = result[0];
    
                            }else{
                                rowdata.regitClan = "NoClan";
                            }
    
                            mysql.getWebRead().getConnection((err, con1)=>{
                                if(err){   
                                    if(con1) con1.release();
                                    console.error('get_my_clan >> getConnection error (mysql err)!!!'+err);                 
                                    callback(PACKET_ERR.COMMON_FAIL);
                                    return;
                                }else{

                                    let _query = "call web_select_my_claninfo_wanab(?)";
                                    con1.query(_query,[minedata.id],(err, result, fields)=>{
                                        if(con1) con1.release();
                                        if(err){ 
                                            console.error('get_my_clan >> query error (mysql err)!!!'+err);  
                                            callback(PACKET_ERR.COMMON_FAIL);
                                            return;
                                        }else{
            
                                            if(result[0].length > 0){
                            
                                                rowdata.wanabClan = result[0];
                    
                                            }else{
                                                rowdata.wanabClan = "NoClan";
                                            }
            
                                            data.push(rowdata);  
                                            callback1(null, data);
                                        }
            
                                    });
                                }
                            });
                        
    
                        }
    
                    });
                }
            
            });
        }
    ];
    async.waterfall(task,(err,data, count, MyRank)=>{
        if(err)
        {
            callback(PACKET_ERR.READ_RABK_DOESNT_EXIST,data, count, MyRank);
        }else{

            callback(PACKET_ERR.SUCCESS,data, (count/2), MyRank);
        }
     
    });
        
}
