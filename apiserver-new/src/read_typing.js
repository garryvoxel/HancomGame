const mysql                     = require('./mysql');
const PACKET_ERR                = require('./packet_err').PACKET_ERR;
const async                     = require('async');
exports.read_typing_pos_practice = function(uuid,callback){
    const typing_mysql = mysql.getGameRead();
    typing_mysql.getConnection((err,con)=>{
        if(err){   
            if(con) con.release();
            console.error('read_typing_pos_practice >> getConnection error (mysql err)!!!'+err);                 
            callback(PACKET_ERR.TYPING_READ_POS_PRACTICE_MYSQL,null);
        }else{
            let _query = "SELECT Step, Language, isComplete FROM GameDB.TbTypingPosPractice WHERE UUID=?";
            con.query(_query,[uuid],(err1,result,fields)=>{
                con.release();
                if(err1){
                    console.error('read_typing_pos_practice >> query error (mysql err)!!!'+err1);                 
                    callback(PACKET_ERR.TYPING_READ_POS_PRACTICE_MYSQL_QUERY,null);
                }else{                    
                    let _rdata ={};
                    let _data=[];
                    _rdata.result = PACKET_ERR.SUCCESS;

                    for( var i = 0; i < result.length; i++){
                        let _if ={};
                        _if.step        = result[i].Step;
                        _if.language    = result[i].Language;
                        _if.iscomplete  = result[i].isComplete;
                        _data.push(_if);
                    }                       

                     _rdata.data = _data;
                    callback(PACKET_ERR.SUCCESS,_rdata);
                }
            });
        }
    });
}

exports.read_typing_word_practice = function(uuid,callback){
    const typing_mysql = mysql.getGameRead();
    typing_mysql.getConnection((err,con)=>{
        if(err){   
            if(con) con.release();
            console.error('read_typing_word_practice >> getConnection error (mysql err)!!!'+err);                 
            callback(PACKET_ERR.TYPING_READ_WORD_PRACTICE_MYSQL,null);
        }else{
            let _query = "SELECT Step, Language, isComplete FROM GameDB.TbTypingWordPractice WHERE UUID=?";
            con.query(_query,[uuid],(err1,result,fields)=>{
                con.release();
                if(err1){
                    console.error('read_typing_word_practice >> query error (mysql err)!!!'+err1);                 
                    callback(PACKET_ERR.TYPING_READ_WORD_PRACTICE_MYSQL_QUERY,null);
                }else{
                    let _rdata={};
                    let _data=[];
                    _rdata.result = PACKET_ERR.SUCCESS;
                    for( let i=0; i<result.length; i++){
                        let _if={};
                        _if.step        = result[i].Step;
                        _if.language    = result[i].Language;
                        _if.iscomplete  = result[i].isComplete;
                        _data.push(_if);
                    }

                    _rdata.data = _data;
                    callback(PACKET_ERR.SUCCESS,_rdata);
                }
            });
        }
    });
}


exports.read_typing_long_word_practice = function(uuid,callback){
    const typing_mysql = mysql.getGameRead();
    typing_mysql.getConnection((err,con)=>{
        if(err){   
            if(con) con.release();
            console.error('read_typing_long_word_practice >> getConnection error (mysql err)!!!'+err);
            callback(PACKET_ERR.TYPING_READ_LONG_WORD_PRACTICE_MYSQL,null);
        }else{
            let _query = "SELECT * FROM GameDB.TbTypingLongWordPractice WHERE UUID=?";
            con.query(_query,[uuid],(err1,result,fields)=>{
                con.release();
                if(err1){
                    console.error('read_typing_long_word_practice >> query error (mysql err)!!!'+err1);
                    callback(PACKET_ERR.TYPING_READ_LONG_WORD_PRACTICE_MYSQL_QUERY,null);
                }else{
                    let _rdata={};
                    let _data=[];
                    _rdata.result = PACKET_ERR.SUCCESS;

                    for( let i=0; i<result.length; i++){
                        let _if={};
                        _if.language            = result[i].Language;
                        _if.step                = result[i].Step;
                        _if.content             = result[i].Content;
                        _if.ispracticecomplete  = result[i].isPracticeComplete;
                        _if.isverifycomplete    = result[i].isVerifyComplete;
                        _data.push(_if);
                    }
                    _rdata.data = _data;
                    callback(PACKET_ERR.SUCCESS,_rdata);
                }
            });
        }
    });
}

exports.read_typing_setup = function(uuid,callback){
    const typing_mysql = mysql.getGameRead();
    typing_mysql.getConnection((err,con)=>{
        if(err){   
            if(con) con.release();
            console.error('read_typing_setup >> getConnection error (mysql err)!!!'+err);
            callback(PACKET_ERR.TYPING_READ_SETUP_MYSQL,null);
        }else{
            let _query = "SELECT KeyBoard1, KeyBoard2,Language, Sound, FingerGuide FROM GameDB.TbTypingPracticeSetup WHERE UUID=?";
            con.query(_query,[uuid],(err1,result,fields)=>{
                con.release();
                if(err1){
                    console.error('read_typing_setup >> query error (mysql err)!!!'+err1);
                    callback(PACKET_ERR.TYPING_READ_SETUP_MYSQL_QUERY,null);
                }else{
                    let _rdata={};
                    let _data=[]; 
                    _rdata.result = PACKET_ERR.SUCCESS;
                    if(result.length > 0){
                        let _if = {};
                        _rdata.result   = PACKET_ERR.SUCCESS;
                        _if.keyboard1     = result[0].KeyBoard1;
                        _if.keyboard2     = result[0].KeyBoard2;
                        _if.language     = result[0].Language;
                        _if.sound        = result[0].Sound;
                        _if.fingerguide  = result[0].FingerGuide;
                        _data.push(_if);

                    }                  

                    _rdata.data = _data;
                    callback(PACKET_ERR.SUCCESS,_rdata);
                }
            });
        }
    });
}

exports.read_typing_continue_play = function(uuid,callback){
    const typing_mysql = mysql.getGameRead();
    typing_mysql.getConnection((err,con)=>{
        if(err){   
            if(con) con.release();
            console.error('read_typing_continue_play >> getConnection error (mysql err)!!!'+err);
            callback(PACKET_ERR.TYPING_READ_SETUP_MYSQL,null);
        }else{
            let _query = "SELECT * FROM GameDB.TbTypingPracticeContinue WHERE UUID=?";
            con.query(_query,[uuid],(err1,result,fields)=>{
                con.release();
                if(err1){
                    console.error('read_typing_continue_play >> query error (mysql err)!!!'+err1);
                    callback(PACKET_ERR.TYPING_READ_SETUP_MYSQL_QUERY,null);
                }else{
                    
                    let _rdata={};
                    let _data=[];            
                    for( var i = 0; i < result.length; i++){
                        let _if = {};
                        _rdata.result   = PACKET_ERR.SUCCESS;
                        _if.language     = result[i].Language;
                        _if.type     = result[i].Type;
                        _if.pos     = result[i].Pos;
                        _if.page  = result[i].page;
                        _if.acc        = result[i].Acc;
                        _if.kind       = result[i].Kind;
                        
                        _data.push(_if);
                    }        

                    _rdata.data = _data;
                    callback(PACKET_ERR.SUCCESS,_rdata);
                }
            });
        }
    });
}

exports.read_game_result = function(uuid,callback){
    mysql.getGameWrite().getConnection((err,con)=>{
        if(err){   
            if(con) con.release();
            console.error('read_game_result >> getConnection error (mysql err)!!!'+err);         
            callback(PACKET_ERR.TYPING_READ_GAME_RESULT_MYSQL,null);
        }else{   
            let _query = 'SELECT * FROM GameDB.TbTypingPracticeScore WHERE UUID=?';
            con.query(_query,[uuid],(err1,result,fields)=>{
                con.release();
                if(err1){      
                    console.error('read_game_result >> query error (mysql err)!!!'+err1);
                    callback(PACKET_ERR.TYPING_READ_GAME_RESULT_MYSQL_QUERY,null);
                }else{
                    if(result.length <= 0){  
                        console.error('read_game_result >> query res !!!'+result.length);   
                        callback(PACKET_ERR.TYPING_READ_GAME_RESULT_MYSQL_QUERY_RES,null);               
                    }else{  
                        let _rdata={};
                        let _data=[];
                        let _info={};
                        _rdata.result = PACKET_ERR.SUCCESS;   
                        _info.score = result[0].Score;
                        
                        _data.push(_info);
                        _rdata.data = _data;
                        callback(PACKET_ERR.SUCCESS,_rdata);                                           
                    }
                }
            });
        }
    });
}

/**
 * 이벌식 타속
 */
/*
exports.read_two_typing_speed = function(uuid,language,callback){
    mysql.getGameWrite().getConnection((err,con)=>{
        if(err){          
            if(con) con.release();
            console.error('read_two_typing_speed >> getConnection error (mysql err)!!!'+err);
            callback(PACKET_ERR.READ_TWO_TYPING_SPEED_MYSQL,null);
        }else{           
            let _query = 'SELECT * FROM GameDB.TbTypingTwoTypingSpeed WHERE UUID=? AND Language=?';
            con.query(_query,[uuid,language],(err1,result,fields)=>{
                con.release();
                if(err1){             
                    console.error('read_two_typing_speed >> query err...'+err1);
                    callback(PACKET_ERR.READ_TWO_TYPING_SPEED_MYSQL_QUERY,null);
                }else{ 
                    if(result.length <= 0){
                        console.error('read_two_typing_speed >> query err...'+result.length);
                        callback(PACKET_ERR.READ_TWO_TYPING_SPEED_MYSQL_QUERY_RES,null);
                    }else{
                        let _rdata={};
                        let _data=[];
                        
                        _rdata.result = PACKET_ERR.SUCCESS;  
                        
                        for( var i = 0; i < result.length; i++){
                            let _info={};
                            _info.idx   = result[i].Idx;
                            _info.count = result[i].Count;
                            _data.push(_info);
                        };

                        _rdata.data = _data;
                        callback(PACKET_ERR.SUCCESS,_rdata);  
                    }
                }
            });
        }
    });
}*/

/**
 * 이벌식 정확도
 */
/*
exports.read_two_word_acc = function(uuid,language,callback){
    mysql.getGameRead().getConnection((err,con)=>{
        if(err){   
            if(con) con.release();
            console.error('read_two_word_acc >> getConnection error (mysql err)!!!'+err);         
            callback(PACKET_ERR.READ_TWO_WORD_ACC_MYSQL,null);
        }else{   
            let _query = 'SELECT * FROM GameDB.TbTypingPracticeTwoWordAcc WHERE UUID=? AND Language=?';
            con.query(_query,[uuid,language],(err1,result,fields)=>{
                con.release();
                if(err1){      
                    console.error('read_two_word_acc >> query error (mysql err)!!!'+err1);
                    callback(PACKET_ERR.READ_TWO_WORD_ACC_MYSQL_QUERY,null);
                }else{
                    if(result.length <= 0){  
                        console.error('read_two_word_acc >> query res !!!'+result.length);   
                        callback(PACKET_ERR.READ_TWO_WORD_ACC_MYSQL_QUERY_RES,null);               
                    }else{  
                        let _rdata={};
                        let _data=[];
                        _rdata.result = PACKET_ERR.SUCCESS;   

                        for( var i = 0; i < result.length; i++){
                            let _info={};
                            _info.idx               = result[i].Idx;
                            _info.input_total_count = result[i].InputTotalCount;
                            _info.total_acc         = result[i].TotalAcc;
                            _data.push(_info);

                        }
                        _rdata.data = _data;
                        callback(PACKET_ERR.SUCCESS,_rdata);                                           
                    }
                }
            });
        }
    });
}*/

/**
 * 이벌식 속도
 */
/*
exports.read_two_word_velocity = function(uuid,language,callback){
    mysql.getGameRead().getConnection((err,con)=>{
        if(err){   
            if(con) con.release();
            console.error('read_two_word_velocity >> getConnection error (mysql err)!!!'+err);         
            callback(PACKET_ERR.READ_TWO_WORD_VELOCITY_MYSQL,null);
        }else{   
            let _query = 'SELECT * FROM GameDB.TbTypingPracticeTwoWordVelocity WHERE UUID=? AND Language=?';
            con.query(_query,[uuid,language],(err1,result,fields)=>{
                con.release();
                if(err1){      
                    console.error('read_two_word_velocity >> query error (mysql err)!!!'+err1);
                    callback(PACKET_ERR.READ_TWO_WORD_VELOCITY_MYSQL_QUERY,null);
                }else{
                    if(result.length <= 0){  
                        console.error('read_two_word_velocity >> query res !!!'+result.length);   
                        callback(PACKET_ERR.READ_TWO_WORD_VELOCITY_MYSQL_QUERY_RES,null);               
                    }else{  
                        let _rdata={};
                        let _data=[];                        

                        _rdata.result = PACKET_ERR.SUCCESS;   

                        for( var i=0; i<result.length; i++){
                            let _info={};
                            _info.idx               = result[i].Idx;
                            _info.input_total_acc   = result[i].InputTotalAcc;
                            _info.total_velocity    = result[i].TotalVelocity;
                            _data.push(_info);
                        }
                        
                        _rdata.data = _data;
                        callback(PACKET_ERR.SUCCESS,_rdata);                                           
                    }
                }
            });
        }
    });    
}
*/

/**
 * 손가락 빠르기
 */
exports.read_day_two_word_finger_speed = function(uuid,language,callback){
    mysql.getWebRead().getConnection((err,con)=>{
        if(err){
            if(con) con.release();
            console.error('read_day_two_word_finger_speed >> getConnection error : '+err);
            callback(PACKET_ERR.READ_DAY_FINGER_SPEED_MYSQL,null);
            return;
        }else{
            let _table = "WebDB.TbTypingFingerSpeed_"+TIME.getYear()+TIME.getMonth();
            let _day = TIME.getDate();
            let _query='SELECT InputTotalAcc,TotalSpeed,Idx FROM '+_table+' WHERE UUID=? AND Language=? AND Day=?';
            con.query(_query,[uuid,language,_day],(err1,result,fields)=>{
                con.release();
                if(err1){             
                    console.error('read_day_two_word_finger_speed >> query error : '+err1);
                    callback(PACKET_ERR.READ_DAY_FINGER_SPEED_QUERY,null);
                    return;       
                }else{
                    if(result.length <= 0 ){
                        console.error('read_day_two_word_finger_speed >> query res : ' + result.length);
                        callback(PACKET_ERR.READ_DAY_FINGER_SPEED_QUERY_RES,null);
                        return;
                    }else{          
                        let _rdata = {};
                        let _data =[];
                        _rdata.result = PACKET_ERR.SUCCESS;
                        for( var i= 0; i< result.length; i++){
                            let _info={};
                            _info.idx              = result[i].Idx;
                            _info.input_total_acc  = result[i].InputTotalAcc;
                            _info.total_speed      = result[i].TotalSpeed;
                            _data.push(_info);
                        }

                        _rdata.data = _data;
                        
                        callback(PACKET_ERR.SUCCESS,_rdata);
                    }
                }
            });
        }
    });
}

exports.read_month_two_word_finger_speed = function(uuid,language,year,month,callback){
    mysql.getGameRead().getConnection((err,con)=>{
        if(err){           
            console.error('read_month_two_word_finger_speed >> getConnection error : '+err);
            callback(PACKET_ERR.READ_MONTH_FINGER_SPEED_MYSQL,null);
            return;
        }else{            
            let _table = "WebDB.TbTypingFingerSpeed_"+year+month;  
            let _query='SELECT Day,InputTotalAcc,TotalSpeed,Idx FROM '+_table+' WHERE UUID=? AND Language=?';
            con.query(_query,[uuid,language],(err1,result,fields)=>{
                con.release();
                if(err1){                
                    console.error('read_month_two_word_finger_speed >> query error : '+err1);    
                    callback(PACKET_ERR.READ_MONTH_FINGER_SPEED_QUERY,null);
                    return;
                }else{                 
                    if(result.length <= 0){
                        console.error('read_month_two_word_finger_speed >> query res : '+result.length);
                        callback(PACKET_ERR.READ_MONTH_FINGER_SPEED_QUERY_RES,null);
                        return;
                    }else{              
                        let _rdata = {};   
                        let _data=[];                     
                        
                        _rdata.result = PACKET_ERR.SUCCESS;

                        for( var i = 0; i <9; i++ ){
                            let _info ={};
                            _info.idx                           = i;
                            _info.input_total_acc               = 0;
                            _info.total_speed                = 0;
                            _data.push(_info);
                        }
                        
                        
                        for( var i=0; i < result.length; i++){
                            _data[parseInt(result[i].Idx)].input_total_acc  += result[i].InputTotalAcc;                            
                            _data[parseInt(result[i].Idx)].total_speed   += result[i].TotalSpeed;                            
                            //let _info ={};
                            //_info.day                   = result[i].Day;
                            //_info.idx                   = result[i].Idx;
                            //_info.input_total_acc       = result[i].InputTotalAcc;
                            //_info.total_speed           = result[i].TotalSpeed;
                            //_data.push(_info);
                        }                        
                        _data.splice(0,1);
                        _rdata.data = _data;                        
                        callback(PACKET_ERR.SUCCESS,_rdata);                         
                    }
                }
            });
        }
    });
}





/**
 * 글쇠별 속도
 */
exports.read_day_word_velocity = function(uuid,language,callback){
    mysql.getWebRead().getConnection((err,con)=>{
        if(err){
            if(con) con.release();
            console.error('read_day_two_word_velocity >> getConnection error : '+err);
            callback(PACKET_ERR.READ_DAY_VELOCITY_MYSQL,null);
            return;
        }else{
            let _table = "WebDB.TbTypingVelocity_"+TIME.getYear()+TIME.getMonth();
            let _day = TIME.getDate();
            let _query='SELECT InputTotalAcc,TotalVelocity,Idx FROM '+_table+' WHERE UUID=? AND Language=? AND Day=?';
            con.query(_query,[uuid,language,_day],(err1,result,fields)=>{
                con.release();
                if(err1){             
                    console.error('read_day_two_word_velocity >> query error : '+err1);
                    callback(PACKET_ERR.READ_DAY_VELOCITY_MYSQL_QUERY,null);
                    return;       
                }else{
                    if(result.length <= 0 ){
                        console.error('read_day_two_word_velocity >> query res : ' + result.length);
                        callback(PACKET_ERR.READ_DAY_VELOCITY_MYSQL_QUERY_RES,null);
                        return;
                    }else{          
                        let _rdata = {};
                        let _data=[];
                        _rdata.result               = PACKET_ERR.SUCCESS;
                        for( var i=0; i < result.length; i++){
                            let _info = {};
                            _info.idx                  = result[i].Idx;
                            _info.input_total_acc      = result[i].InputTotalAcc;
                            _info.total_velocity       = result[i].TotalVelocity;
                            _data.push(_info);
                        }

                        _rdata.data = _data;

                        callback(PACKET_ERR.SUCCESS,_rdata);
                    }
                }
            });
        }
    });
}

exports.read_month_word_velocity = function(uuid,language,year,month,callback){
    mysql.getWebRead().getConnection((err,con)=>{
        if(err){
            if(con) con.release();
            console.error('read_month_two_word_velocity >> getConnection error : '+err);
            callback(PACKET_ERR.READ_MONTH_VELOCITY_MYSQL,null);
            return;
        }else{
            let _table = "WebDB.TbTypingVelocity_"+year+month;  
            let _query='SELECT Day,InputTotalAcc,TotalVelocity,Idx FROM '+_table+' WHERE UUID=? AND Language=?';
            con.query(_query,[uuid,language],(err1,result,fields)=>{
                con.release();
                if(err1){  
                    console.error('read_month_two_word_velocity >> query error : '+err1);
                    callback(PACKET_ERR.READ_MONTH_VELOCITY_MYSQL_QUERY,null);                  
                    return;
                }else{              
                    if(result.length <= 0){             
                        console.error('read_month_two_word_velocity >> query res : '+result.length);
                        callback(PACKET_ERR.READ_MONTH_VELOCITY_MYSQL_QUERY_RES,null);
                        return;
                    }else{       
                        let _rdata = {};   
                        let _data=[];                     
                        
                        _rdata.result = PACKET_ERR.SUCCESS;

                        for( var i = 0; i <47; i++ ){
                            let _info ={};
                            _info.idx                           = i;
                            _info.input_total_acc               = 0;
                            _info.total_velocity                = 0;
                            _data.push(_info);
                        }
                        
                        for( var i=0; i < result.length; i++){
                            //let _info ={};
                            //_info.day                   = result[i].Day;
                            //_info.idx                   = result[i].Idx;
                            _data[parseInt(result[i].Idx)].input_total_acc  += result[i].InputTotalAcc;                            
                            _data[parseInt(result[i].Idx)].total_velocity   += result[i].TotalVelocity;                            
                            //_info.input_total_acc       = result[i].InputTotalAcc;
                            //_info.total_velocity        = result[i].TotalVelocity;
                            //_data.push(_info);
                        }                        

                        _data.splice(0,1);
                        _rdata.data = _data;                        
                        callback(PACKET_ERR.SUCCESS,_rdata);                                          
                    }
                }

            });
        }
    });
}







/**
 * 정확도....
 */
exports.read_day_typing_acc = function(uuid,language,callback){
    mysql.getWebRead().getConnection((err,con)=>{
        if(err){
            if(con) con.release();
            console.error('read_day_typing_acc >> getConnection error : '+err);
            callback(PACKET_ERR.READ_DAY_ACC_MYSQL,null);
            return;
        }else{
            let _table = "WebDB.TbTypingAcc_"+TIME.getYear()+TIME.getMonth();
            let _day = TIME.getDate();
            let _query='SELECT Idx,InputTotalCount,TotalAcc FROM '+_table+' WHERE UUID=? AND Language=? AND Day=?';
            con.query(_query,[uuid,language,_day],(err1,result,fields)=>{
                con.release();
                if(err1){             
                    console.error('read_day_typing_acc >> query error : '+err1);
                    callback(PACKET_ERR.READ_DAY_ACC_MYSQL_QEURY,null);
                    return;       
                }else{
                    if(result.length <= 0 ){
                        console.error('read_day_typing_acc >> query res : ' + result.length);
                        callback(PACKET_ERR.READ_DAY_ACC_MYSQL_QUERY_RES,null);
                        return;
                    }else{          
                        let _rdata = {};
                        let _data=[];

                        _rdata.result               = PACKET_ERR.SUCCESS;
                        for( var i=0; i < result.length; i++){
                            let _info={};
                            _info.idx                  = result[i].Idx;
                            _info.input_total_count      = result[i].InputTotalCount;
                            _info.total_acc       = result[i].TotalAcc;
                            _data.push(_info);
                        }

                        _rdata.data = _data;
                        
                        
                        callback(PACKET_ERR.SUCCESS,_rdata);
                    }
                }
            });
        }
    });
}









exports.read_month_typing_acc = function(uuid,language,year,month,callback){
    mysql.getWebRead().getConnection((err,con)=>{
        if(err){
            if(con) con.release();
            console.error('read_month_typing_acc >> getConnection error : '+err);
            callback(PACKET_ERR.READ_MONTH_ACC_MYSQL,null);
            return;
        }else{
            let _table = "WebDB.TbTypingAcc_"+year+month;
            let _day = TIME.getDate();
            let _query='SELECT InputTotalCount,TotalAcc,Day,Idx FROM '+_table+' WHERE UUID=? AND Language=?';
            con.query(_query,[uuid,language,_day],(err1,result,fields)=>{
                con.release();
                if(err1){             
                    console.error('read_month_typing_acc >> query error : '+err1);
                    callback(PACKET_ERR.READ_MONTH_ACC_MYSQL_QEURY,null);
                    return;       
                }else{
                    if(result.length <= 0 ){
                        console.error('read_month_typing_acc >> query res : ' + result.length);
                        callback(PACKET_ERR.READ_MONTH_ACC_MYSQL_QUERY_RES,null);
                        return;
                    }else{          
                        let _rdata = {};
                        let _data=[];

                        _rdata.result               = PACKET_ERR.SUCCESS;
                        for( var i = 0; i <47; i++ ){
                            let _info ={};
                            _info.idx                   = i;
                            _info.input_total_count       = 0;
                            _info.total_acc        = 0;
                            _data.push(_info);
                        }
                        for( var i=0; i < result.length; i++){
                            //let _info={};

                            _data[parseInt(result[i].Idx)].input_total_count += result[i].InputTotalCount;
                            _data[parseInt(result[i].Idx)].total_acc += result[i].TotalAcc;
                            
                            //_info.idx                  = result[i].Idx;
                            //_info.input_total_acc      = result[i].InputTotalCount;
                            //_info.total_velocity       = result[i].TotalAcc;
                            //_data.push(_info);
                        }
                        _data.splice(0,1);
                        _rdata.data = _data;
                        
                        
                        callback(PACKET_ERR.SUCCESS,_rdata);
                    }
                }
            });
        }
    });
}



exports.read_day_typing_speed = function(uuid,language,callback){
    mysql.getWebRead().getConnection((err,con)=>{
        if(err){
            if(con) con.release();
            console.error('read_day_typing_speed >> getConnection error : '+err);
            callback(PACKET_ERR.READ_DAY_TYPING_SPEED_MYSQL,null);
            return;
        }else{
            let _table = "WebDB.TbTypingSpeed_"+TIME.getYear()+TIME.getMonth();
            let _day = TIME.getDate();
            let _query='SELECT Count,Idx FROM '+_table+' WHERE UUID=? AND Language=? AND Day=?';

            console.log("타이핑 통계 언어 쿼리======================="+_query);
            console.log("타이핑 통계 언어 ======================="+language);
            console.log("타이핑 통계 언어  날짜 ======================="+_day);

            con.query(_query,[uuid,language,_day],(err1,result,fields)=>{
                con.release();
                if(err1){             
                    console.error('read_day_typing_speed >> query error : '+err1);
                    callback(PACKET_ERR.READ_DAY_TYPING_SPEED_MYSQL_QUERY,null);
                    return;       
                }else{
                    if(result.length <= 0 ){
                        console.error('read_day_typing_speed >> query res : ' + result.length);
                        callback(PACKET_ERR.READ_DAY_TYPING_SPEED_MYSQL_QUERY_RES,null);
                        return;
                    }else{          
                        let _rdata = {};
                        let _data=[];
                        _rdata.result               = PACKET_ERR.SUCCESS;
                        for( var i=0; i < result.length; i++){
                            let _info = {};
                            _info.idx                  = result[i].Idx;
                            _info.count                = result[i].Count;                            
                            _data.push(_info);
                        }

                        _rdata.data = _data;

                        callback(PACKET_ERR.SUCCESS,_rdata);
                    }
                }
            });
        }
    });
}

exports.read_month_typing_speed = function(uuid,language,year,month,callback){
    mysql.getWebRead().getConnection((err,con)=>{
        if(err){
            if(con) con.release();
            console.error('read_month_typing_speed >> getConnection error : '+err);
            callback(PACKET_ERR.READ_MONTH_TYPING_SPEED_MYSQL,null);
            return;
        }else{
            let _table = "WebDB.TbTypingSpeed_"+year+month;  
            let _query='SELECT Day,Count,Idx FROM '+_table+' WHERE UUID=? AND Language=?';
            con.query(_query,[uuid,language],(err1,result,fields)=>{
                con.release();
                if(err1){  
                    console.error('read_month_typing_speed >> query error : '+err1);
                    callback(PACKET_ERR.READ_MONTHY_TYPING_SPEED_MYSQL_QUERY,null);                  
                    return;
                }else{              
                    if(result.length <= 0){             
                        console.error('read_month_typing_speed >> query res : '+result.length);
                        callback(PACKET_ERR.READ_MONTH_TYPING_SPEED_MYSQL_QUERY_RES,null);
                        return;
                    }else{       
                        let _rdata = {};   
                        let _data=[];                     
                        //let _data2=[];
                        _rdata.result = PACKET_ERR.SUCCESS;
                        for( var i = 0; i <47; i++ ){
                            let _info ={};
                            _info.idx                   = i;
                            _info.count                 = 0;
                            _data.push(_info);
                        }
                        
                        for( var i=0; i < result.length; i++){                            
                            //let _info = {};
                            //_info.day                   = result[i].Day;
                            //_info.idx                   = result[i].Idx;
                            _data[parseInt(result[i].Idx)].count += result[i].Count;                            
                            //_data.push(_info);
                        }              
                        _data.splice(0,1);

                        _rdata.data = _data;                        
                        callback(PACKET_ERR.SUCCESS,_rdata);                                          
                    }
                }

            });
        }
    }); 
}




/**
 * 
 */
exports.read_two_word_finger_speed = function(uuid,language,callback){
    mysql.getGameRead().getConnection((err,con)=>{
        if(err){   
            if(con) con.release();
            console.error('read_two_word_finger_speed >> getConnection error (mysql err)!!!'+err);         
            callback(PACKET_ERR.READ_TWO_WORD_SPEED_MYSQL,null);
        }else{   
            let _query = 'SELECT * FROM GameDB.TbTypingPracticeTwoWordFingerSpeed WHERE UUID=? AND Language=?';
            con.query(_query,[uuid,language],(err1,result,fields)=>{
                con.release();
                if(err1){      
                    console.error('read_two_word_finger_speed >> query error (mysql err)!!!'+err1);
                    callback(PACKET_ERR.READ_TWO_WORD_SPEED_MYSQL_QUERY,null);
                }else{
                    if(result.length <= 0){  
                        console.error('read_two_word_finger_speed >> query res !!!'+result.length);   
                        callback(PACKET_ERR.READ_TWO_WORD_SPEED_MYSQL_QUERY_RES,null);               
                    }else{  
                        let _rdata={};
                        let _data=[];
                        let _info={};

                        _rdata.result = PACKET_ERR.SUCCESS;  
                        
                        for( var i=0; i<result.length; i++){
                            let _info={};
                            
                            _info.idx               = result[i].Idx;
                            _info.input_total_acc   = result[i].InputTotalAcc;
                            _info.total_velocity    = result[i].TotalSpeed;
                            _data.push(_info);
                        }                       
                        
                        _data.push(_info);
                        _rdata.data = _data;
                        callback(PACKET_ERR.SUCCESS,_rdata);                                           
                    }
                }
            });
        }
    });        
}

















/**
 * 오늘 타수
 */
const TIME = require('../common/time');
exports.read_day_two_typing_speed_speed = function(uuid,language,callback){
    mysql.getGameRead().getConnection((err,con)=>{
        if(err){           
            if(con) con.release();
            console.error('read_day_two_typing_speed_speed >> getConnection error : '+err);
            callback(PACKET_ERR.READ_DAY_TOW_TYPING_SPEED_MYSQL,null); 
            return;
        }else{
            let _table = "GameDB.TbTwoTypingSpeed_"+TIME.getYear()+TIME.getMonth();
            let _day = TIME.getDate();
            let _query='SELECT sum(TotalInputcount) as ti,sum(TotalSpeedCount) as ts FROM '+_table+' WHERE UUID=? AND Language=? AND Day=?';
            con.query(_query,[uuid,language,_day],(err1,result,fields)=>{
                con.release();
                if(err1){                   
                    console.error('read_day_two_typing_speed_speed >> query error : '+err1);
                    callback(PACKET_ERR.READ_DAY_TOW_TYPING_SPEED_MYSQL_QUERY,null); 
                    return;
                }else{                    
                    if(result.length<=0){
                        callback(PACKET_ERR.READ_DAY_TOW_TYPING_SPEED_MYSQL_RES,null);
                        return;
                    }else{         
                        let _rdata = {};
                        _rdata.result = PACKET_ERR.SUCCESS;

                        _rdata.total_input_count =  result[0].ti === null ? 0 : result[0].ti;
                        _rdata.TotalSpeedCount = result[0].ts === null ? 0 : result[0].ts;
                        callback(PACKET_ERR.SUCCESS,_rdata);               
                    }
                }
            });
        }
    });
}
/**
 * 달 타수 가져오기
 */
exports.read_month_two_typing_speed_speed = function(uuid,language,year,month,callback){
    mysql.getGameRead().getConnection((err,con)=>{
        if(err){           
            if(con) con.release();
            console.error('read_day_two_typing_speed_speed >> getConnection error : '+err);
            callback(PACKET_ERR.READ_DAY_TOW_TYPING_SPEED_MYSQL,null); 
            return;
        }else{
            let _table = "GameDB.TbTwoTypingSpeed_"+year+month;           
            //let _query='SELECT sum(TotalInputcount) as ti,sum(TotalSpeedCount) as ts FROM '+_table+' WHERE UUID=? AND Language=?';
            let _query='SELECT Day,TotalInputcount,TotalSpeedCount FROM '+_table+' WHERE UUID=? AND Language=?';
            con.query(_query,[uuid,language],(err1,result,fields)=>{
                con.release();
                if(err1){                   
                    console.error('read_day_two_typing_speed_speed >> query error : '+err1);
                    callback(PACKET_ERR.READ_DAY_TOW_TYPING_SPEED_MYSQL_QUERY,null); 
                    return;
                }else{                    
                    if(result.length<=0){
                        callback(PACKET_ERR.READ_DAY_TOW_TYPING_SPEED_MYSQL_RES,null);
                        return;
                    }else{         
                        let _rdata = {};
                        
                        let _data=[];
                        _rdata.result = PACKET_ERR.SUCCESS;
                        for( var i=0; i < result.length; i++){
                            let _info ={};
                            _info.day                   = result[i].Day;
                            _info.total_input_count     = result[i].TotalInputcount;
                            _info.total_speed_count     = result[i].TotalSpeedCount;
                            _data.push(_info);
                        }

                        _rdata.data = _data;
                        //_rdata.total_input_count =  result[0].ti === null ? 0 : result[0].ti;
                        //_rdata.TotalSpeedCount = result[0].ts === null ? 0 : result[0].ts;
                        callback(PACKET_ERR.SUCCESS,_rdata);               
                    }
                }
            });
        }
    });    
}

exports.read_check_result = function(uuid, callback){
    const typing_mysql = mysql.getWebRead();

    typing_mysql.getConnection((err,con)=>{
        if(err){
            if(con) con.release();
            console.error('read_check_result >> getConnection error (mysql err)!!!!..'+err);
            callback(PACKET_ERR.WRITE_TWO_TYPING_SPEED_MYSQL);
        }else{
            let _query = 'call web_select_taja_check_res(?,@ret);SELECT @ret as ret';
            con.query(_query,[uuid], (err,result,fields)=>{
                con.release();
                if(err){
                    console.error('read_check_result >>query error (mysql err)!!!!..'+err);
                    callback(PACKET_ERR.COMMON_QUERY_ERROR);
                }else{
                    let _rdata={};
                    let _data=[];
                    _data.result = PACKET_ERR.SUCCESS;
                    _data.count = result[0].ret;

                    console.log("타자 결과 카운트 0 "+ result[0].length);
                    console.log("타자 결과 카운트 1 "+ result[1].length);
                    console.log("타자 결과 카운트 2 "+ result[2].length);
                    
                    
                    if(result[0].ret == 0){
                        //데이터가 없습니다.
                        _rdata.data = _data;
                        callback(PACKET_ERR.SUCCESS, _rdata);
                    }else{

                        for(var i=0; i <result[0].length; i++){
                            let check_result={};
                            check_result.uuid   = result[0][i].uuid;
                            check_result.title  = result[0][i].title;
                            check_result.speed  = result[0][i].speed;
                            check_result.acc  = result[0][i].acc;
                            check_result.page_ing  = result[0][i].page_ing;
                            check_result.page_end  = result[0][i].page_end;
                            check_result.regit_date  = result[0][i].regit_date;

                            _data.push(check_result);
                        }

                        _rdata.data = _data;
                        callback(PACKET_ERR.SUCCESS, _rdata);
                    }
                }
            })
        }
    })

}

exports.read_taja_contents = function(category, type, callback){
    const typing_mysql = mysql.getWordRead();

    typing_mysql.getConnection((err,con)=>{
        if(err){
            if(con) con.release();
            console.error('read_taja_contents >> getConnection error (mysql err)!!!!..'+err);
            callback(PACKET_ERR.WRITE_TWO_TYPING_SPEED_MYSQL);
        }else{
            let _query = 'call web_select_word(?,?)';
            con.query(_query,[category,type], (err,result,fields)=>{
                con.release();
                if(err){
                    console.error('read_check_result >>query error (mysql err)!!!!..'+err);
                    callback(PACKET_ERR.COMMON_QUERY_ERROR);
                }else{
                    let _rdata={};
                    let _data=[];
                    _rdata.result = PACKET_ERR.SUCCESS;

                    for(var i=0; i <result[0].length; i++){
                        let word_data={};
                        word_data.CategoryIdx   = result[0][i].CategoryIdx;
                        word_data.Reference  = result[0][i].Reference;
                        word_data.Type  = result[0][i].Type;
                        word_data.Idx  = result[0][i].Idx;
                        var title = result[0][i].FileName;

                        var str_title = title.split('.');
                        word_data.Title  = str_title[0];
                    
                        _data.push(word_data);
                    }

                    _rdata.data = _data;
                    callback(PACKET_ERR.SUCCESS, _rdata);
                }
            });
        }
    })
}

exports.read_taja_contents_data = function(idx, callback){
    const typing_mysql = mysql.getWordRead();

    typing_mysql.getConnection((err,con)=>{
        if(err){
            if(con) con.release();
            console.error('read_taja_contents >> getConnection error (mysql err)!!!!..'+err);
            callback(PACKET_ERR.WRITE_TWO_TYPING_SPEED_MYSQL);
        }else{
            let _query = 'call web_select_word_data(?)';
            con.query(_query,[idx], (err,result,fields)=>{
                con.release();
                if(err){
                    console.error('read_check_result >>query error (mysql err)!!!!..'+err);
                    callback(PACKET_ERR.COMMON_QUERY_ERROR);
                }else{
                    let _rdata={};
                    let _data=[];
                    _rdata.result = PACKET_ERR.SUCCESS;

                    for(var i=0; i <result[0].length; i++){
                        let word_data={};
                        word_data.CategoryIdx   = result[0][i].CategoryIdx;
                        word_data.Reference  = result[0][i].Reference;
                        word_data.Type  = result[0][i].Type;
                        word_data.Idx  = result[0][i].Idx;
                        var title = result[0][i].FileName;

                        var str_title = title.split('.');
                        word_data.Title  = str_title[0];

                        word_data.Words  = result[0][i].Words;
                    
                        _data.push(word_data);
                    }

                    _rdata.data = _data;
                    callback(PACKET_ERR.SUCCESS, _rdata);
                }
            });
        }
    })
}