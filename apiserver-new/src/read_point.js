const mysql                             = require('./mysql');
const PACKET_ERR                        = require('./packet_err').PACKET_ERR;
const async                   = require('async');       // kevin added

exports.search_point = function(session_id,start,end,page,pagesize, callback){

    var task = [

        function(callback1){

            var id;
            console.log("###############  포인트 읽기  ---------- 세션 -"+session_id);
            console.log("###############  포인트 읽기  ---------- start -"+start);
            console.log("###############  포인트 읽기  ---------- end -"+end);
            console.log("###############  포인트 읽기  ---------- page -"+page);
            console.log("###############  포인트 읽기  ---------- page -"+pagesize);

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
                            if(result){
                              
                                let minedata={};
                               
                                for(var i=0; i< result.length; i++){
                                    for(var j=0 ; j<result[i].length; j++)
                                    {
                                        minedata.id = result[i][j].id;
                                    //    console.log("결과값 "+i+"번쨰"+result[i][j].id);
                                    }
                                    
                                }
                                
                                console.log("###############  포인트 읽기  ---------- 아이디 -"+minedata.id);
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

                if(err){
                    if(con) con.release();
                    console.error('read_rank_school >> getConnection error (mysql err)!!!'+err);                 
                    callback(PACKET_ERR.READ_RABK_DOESNT_EXIST);
                    return;
                }else{

                    let data = [];
                    let rowdata = {};
                    let my_list = {};

                    let _query = "SELECT SUM(amount) as amount FROM WebDB.PointLogs WHERE  \
                    logtype  =? AND  user_id =?";
                    con.query(_query,[1,minedata.id],(err1,rows,fields)=>{
                        if(err1){
                            if(con) con.release();
                            console.log("query_err from readPoint111="+err1)
                            callback(PACKET_ERR.COMMON_QUERY_ERROR);
                            return;
                        }else{
                            if(rows[0].amount != null){
                                for(var i=0; i<rows.length; i++){
                                    rowdata.amount = rows[i].amount;
                                }
                               
                            }else{
                                rowdata.amount = 0;
                            }
                            console.log("###############  포인트 읽기  ---------- 수익 -"+rowdata.amount);
                         
                        }
                        let _query2 = "SELECT SUM(amount) FROM WebDB.PointLogs WHERE \
                        logtype  =? AND  user_id =?";
                        con.query(_query2,[2,minedata.id],(err1,rows,fields)=>{
                            if(err1){
                                if(con) con.release();
                                console.log("query_err from readPoint222="+err1)
                                callback(PACKET_ERR.COMMON_QUERY_ERROR);
                            }else{
  
                                if(rows[0].amount == null){
                                    rowdata.consume = 0;
                                }else{
                                    for(var i=0 ; i < rows.length; i++){
                                        rowdata.consume = rows[i].amount;
                                    }
                                   
                                }

                                console.log("###############  포인트 읽기  ---------- 소비 -"+rowdata.consume);

                                let _query3 = "SELECT balance FROM WebDB.PointLogs WHERE user_id =? \
                                ORDER BY created_at desc limit 1";
                                con.query(_query3,[minedata.id],(err1,rows,fields)=>{
                                    if(err1){
                                        if(con) con.release();
                                        console.log("query_err from readPoint333")
                                        callback(PACKET_ERR.COMMON_QUERY_ERROR);
                                    }else{
                                       

                                        if(rows.length > 0){
                                            for(var i=0 ; i < rows.length; i++){
                                                rowdata.balance = rows[i].balance;
                                            }
                                          
                                        }else{
                                            rowdata.balance = 0;
                                        }
                                      
                                        console.log("###############  포인트 읽기  ---------- 최종잔금 -"+rowdata.balance);

                                        data.push(rowdata);
                    
                                        let _quert4 = "call web_select_point(?,?,?,?,?,@_total_count);SELECT @_total_count as _total_count";
                                        con.query(_quert4,[minedata.id,start,end,page,pagesize],(err1,result,fields)=>{
                                            if(con) con.release();
                                            if(err1){
                                                console.error('read_rank_school >> query error (mysql err)!!!'+err1);                 
                                                callback(PACKET_ERR.READ_RABK_DOESNT_EXIST,null);
                                                return;
                                            }else{   
                                             
                                   
                                                if(result[0][0]!= null){
                                                    let point_list = {};
                                                 
                                                    point_list = result;

                                                    let add =[];
                                                    add.MyList = result;

                                                    data.push(result[0]);
                                                    data.push(result[2]);
                                                    
                                                    callback1(null, data);
                                                }else{
                                                    callback1(null, data);
                                                }
                                             
 
                                            }

                                        });

                                      
                                
                                    }
                                });
        

                            }
                        });

                    });

                }
            });
        }

    ];

    async.waterfall(task,(err,data)=>{
        if(err)
        {
            callback(PACKET_ERR.COMMON_FAIL,data);
        }else{
            callback(PACKET_ERR.SUCCESS,data);
        }
     
    });

}