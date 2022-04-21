// kevin added

const mysql = require('./mysql');
const async = require('async');
let saveClear1_10 = require("./write_mole").save_mole_clear_data_init;

exports.get_info = function(uuid, callback){
    mysql.getGameRead().getConnection(function(error, connection) {
        if(error) {
            if (connection) {
                connection.release();
            }
            callback(error);
            return;
        }       
        
        console.log("두더지 인포 uuid "+uuid);

        let query = 'SELECT Stage, Star, Score FROM TbMole WHERE UUID = ? ORDER BY Stage ASC';
        let params = [uuid];

        connection.query(query, params, function (error, results, fields) {
            if (connection) {
                connection.release();
            }
            if (error) {
                if (connection) {
                    connection.release();
                }
                console.log("두더지 인포 에러 ============ ");
                callback(error);
                return;
            }

            let result = [];
            let data = [];
            let rowdata = {};
            rowdata.result = 1;
            data.push(rowdata);
            async.forEach(results, function(item, cb_for) {
             
               

                result.push({
            
                    'stage' : item['Stage'],
                    'star' : item['Star'],
                    'score' : item['Score']
                });
              
                cb_for();
            }, function (){
                data.push(result);
                callback(null, data);
            });


          /*   console.log("두더지 인포 데이터 ============리턴값 "+results.length);
            let result = [];
            if(results.length === 0){

                saveClear1_10(uuid);

                let data = [];
                let rowdata = {};
                rowdata.result = 0;
                data.push(rowdata);

                for(var i=1; i <= 10 ; i++){
                    result.push({
                        'stage' : i,
                        'star' : 0,
                        'score' : 0
                    });
                   
                }
                data.push(result);
                
                 callback(null, data);
            }else{
                let data = [];
                let rowdata = {};
                rowdata.result = 1;
                data.push(rowdata);
                async.forEach(results, function(item, cb_for) {
                 
                   

                    result.push({
                
                        'stage' : item['Stage'],
                        'star' : item['Star'],
                        'score' : item['Score']
                    });
                  
                    cb_for();
                }, function (){
                    data.push(result);
                    callback(null, data);
                });
            } */
         
        });
    });
};