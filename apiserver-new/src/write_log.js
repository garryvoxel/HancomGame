const mysql = require('./mysql');
const PACKET_ERR = require('./packet_err').PACKET_ERR;

exports.write_log = function(msg_idx,uuid,nick_name,
    msg0,msg1,msg2,msg3,msg4,msg5,msg6,msg7,msg8,msg9,msg10,msg11,msg12,msg13,msg14,msg15,msg16,msg17,msg18,msg19,
    val0,val1,val2,val3,val4,val5,val6,val7,val8,val9,val10,val11,val12,val13,val14,val15,val16,val17,val18,val19,
    val20,val21,val22,val23,val24,val25,val26,val27,val28,val29,val30,val31,val32,val33,val34,val35,val36,val37,val38,val39,
    date0,date1,date2,date3,date4,date5,date6,date7,date8,date9,callback){

        mysql.getLogWrite().getConnection((err,conn)=>{
        if(err){
            if(conn) conn.release();
            console.error('write_log >> getConnection error (mysql err)!!!'+err);
            callback(PACKET_ERR.WRITE_LOG_MYSQL);
        }else{
            let _query = 'call SPInsertLog(?,?,?,\
                                            ?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,\
                                            ?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,\
                                            ?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,\
                                            ?,?,?,?,?,?,?,?,?,?,@ret);SELECT @ret as ret';
            conn.query(_query,[msg_idx,uuid,nick_name,
                msg0,msg1,msg2,msg3,msg4,msg5,msg6,msg7,msg8,msg9,msg10,msg11,msg12,msg13,msg14,msg15,msg16,msg17,msg18,msg19,
                val0,val1,val2,val3,val4,val5,val6,val7,val8,val9,val10,val11,val12,val13,val14,val15,val16,val17,val18,val19,
                val20,val21,val22,val23,val24,val25,val26,val27,val28,val29,val30,val31,val32,val33,val34,val35,val36,val37,val38,val39,
                date0,date1,date2,date3,date4,date5,date6,date7,date8,date9],(err1,result1,fields1)=>{
                conn.release();
                if(err1){
                    console.error('write_log >> query error (mysql err)!!!'+err1);
                    callback(PACKET_ERR.WRITE_LOG_MYSQL_QUERY);
                }else{
                    if(result1[1][0].ret < 0){
                        console.error('write_log >> query res '+result1[1][0].ret);
                        callback(PACKET_ERR.WRITE_LOG_MYSQL_QUERY_RES);
                    }else{
                        callback(PACKET_ERR.SUCCESS);
                    }
                }
                
            });
        }
    });


}