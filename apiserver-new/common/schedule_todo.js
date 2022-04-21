const mysql                   = require('../src/mysql');

exports.event_to_end = function(done){
/*
    mysql.getWebWrite().getConnection((err,con)=>{
        if(err){
            if(con) con.release();
            console.error('schedul todo events db connection error'+err);                 
            return;
        }else{
            let _query = "call web_update_event_end()";
            con.query(_query,(err1,result,fields)=>{
                con.release();
                if(err1){
                    console.log('schedul todo events db queary error'+err1);  
                    return;
                }else{
                    console.log('schedul todo events success check!!');  
                }
            })
        }
    });
 */   
}