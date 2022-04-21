var express                   = require('express');
const mysql                   = require('../src/mysql');
var global_array=[];
module.exports = {  
    init: function(){
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
                        for(var i=0; i < result.length; i++){
                          console.log("디비에서 뽑아요 ==================="+result[i].word);
                          this.global_array[i]= result[i].word;
                        }
                    }
                })
            }
        });
    },
    getPool: function () {
      if (this.global_array.length > 0) return this.global_array;
    }
};