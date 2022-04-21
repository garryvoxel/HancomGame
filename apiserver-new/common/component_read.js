const mysql = require('../src/mysql');
const async = require('async'); // kevin added
const redis = require('../src/redis');
const PACKET_ERR = require('../src/packet_err').PACKET_ERR;
const CryptoJS_DE = require('./util').CryptoJS_DE;
const Check_Packet_Time = require('./util').Check_Packet_Time;
const Util = require('./util');
const Component_write = require('./component_write');

/* SDK 게임의결과를 저장하기위해서 어카운트의 idx및 nickname 학교정보를 가져 옵니다
기존의 어카운트 정보에 학교정보가 들어가지 않아서 스키마를 추가 했습니다.
기존 라이브에는 신규유저를 제외하고는 어카운트에 학교정보가 없습니다.
일률적으로 유저어카운트에 web디비에 있는 학교정보를 재매칭 시켜줘야 합니다. */
function Get_account_Info(session_id, callback){
    
    mysql.getAccountRead().getConnection((error, con)=>{
        if(error){
            con.release();
            console.log('SDK Register_gamee  mysql.getWebWrite().getConnection 1' + error);
            callback(PACKET_ERR.COMMON_FAIL, null);
            return;
        }else{

           // let _query = "CALL WEB_get_account_info4SDK(?,@o_res);SELECT @o_res as o_res";
           let _query = "CALL WEB_get_account_info4SDK(?);";
            con.query(_query, [session_id], (err, results, fields) =>{
                con.release();
                if(err){
                    console.error("read Get_account_Info query error : " + err);
                    callback(PACKET_ERR.COMMON_QUERY_ERROR, null);
                    return;
                }else{

                    var data = {};
                    var _cnt;
                    var _user_id;
                    var _nickname;
                    var _school_id;
                    var _school_name = "학교정보미입력";

                    for (var i = 0; i < results.length; i++) {
                        for (var j = 0; j < results[i].length; j++) {
                            _cnt = results[i][j].cnt;
                            _user_id = results[i][j].id;
                            _nickname = results[i][j].nickname;
                            _school_id = results[i][j].schoold_id;
                            _school_name = results[i][j].school_name;
                            console.log("Get_account_Info : 닉네임 -----------------"+_nickname);
                            console.log("Get_account_Info : 스쿨아이디 -----------------"+_school_id);
                            console.log("Get_account_Info : 스쿨네임 -----------------"+_school_name);
                          
                        }
                    }

                    /* 세션 매칭 데이터가 없습니다 */
                    if(_cnt === 0){

                        callback(PACKET_ERR.SDK_ERR_NO_MATCHING_SESSION, null);

                    }else if(_cnt === 1){
                        
                        if(!Util.isEmpty(_user_id)){
                            data.user_id = _user_id;
                        }
                        if(!Util.isEmpty(_nickname)){
                            data.nickname = _nickname;
                        }
                        if(!Util.isEmpty(_school_id)){
                            data.school_id = _school_id;
                        }else{
                            data.school_id = 1;
                        }
                        if(!Util.isEmpty(_school_name)){
                            data.school_name = _school_name;
                        }else{
                            data.school_name = "학교정보미입력"
                        }
    
                        callback(PACKET_ERR.SUCCESS, data);
                    }
                 
                }
            });
        }
    });
}

/* 게임디비의 유저 게임의 누적 전적을 조회 합니다. */
function Get_game_result(session_id, game_code, callback){
    var task = [

        function(callback1){

            if(Util.isEmpty(session_id) || Util.isEmpty(game_code)){
                callback(PACKET_ERR.COMMON_NULL_VALUE);
                return;
            }else{
                callback1(null);
            }
        },

        function(callback1) {

            /* 게임이 정식 등록되었는지 체크 합니다. */
            Component_write.CheckGameConfirm(game_code,(err)=>{
               if(err != PACKET_ERR.SUCCESS){
                   callback(err);
                   return;
               }else{
                   callback1(null);
               }

           });
       },

        function(callback1){

            /* 게임관련 저장에 필요한 어카운트 정보를 가져옵니다 */
            Get_account_Info(session_id,(err,data)=>{
                if(err != PACKET_ERR.SUCCESS){
                    callback(err, null);
                    return;
                }else{
                    callback1(null,data);
                }

            });
        },

        function(_data, callback1){

            console.log("넘어가브럿다 ㅜㅜ ");
            console.log("내 아이디  ㅜㅜ "+_data.user_id);
            mysql.getGameRead().getConnection((error, con) =>{
                if(error){
                    con.release();
                    console.log('SDK Get_game_result  mysql.getGameRead().getConnection 1' + error);
                    callback(PACKET_ERR.COMMON_DATABASE_ERROR, null);
                    return;
                }else{

                    let table_name = "GameDB.TbGameId_"+game_code+"";
                    let _query = "SELECT count(*) CNT, SUM(mainscore) as M_SCORE, SUM(subscore) as S_SCORE FROM "+table_name+" where UUID = ?";

                    con.query(_query,[_data.user_id], (err, results, fields)=>{
                        con.release();
                        if(err){
                            console.error("[ SDK Get_game_result querry error ] : " + err);
                            callback(PACKET_ERR.COMMON_QUERY_ERROR, null);
                            return;
                        }else{
                            var data = {};
                            var _cnt;
                            var _m_socre;
                            var _s_score;

        

                            for (var i = 0; i < results.length; i++) {
                                _cnt = results[i].CNT;
                                _m_socre = results[i].M_SCORE;
                                _s_score = results[i].S_SCORE; 
                            }

                            /* 사용자 의 게임 기록이 없는 경우 입니다. */
                            if(_cnt === 0){
                                _m_socre = 0;
                                _s_score = 0;

                                data.nickname = _data.nickname;
                                data.main_score = _m_socre;
                                data.sub_score = _s_score;

                                callback1(PACKET_ERR.SUCCESS, data);
                            }else{
                                data.nickname = _data.nickname;
                                data.main_score = _m_socre;
                                data.sub_score = _s_score;

                                callback1(PACKET_ERR.SUCCESS, data);
                            }
        
                        }
                    });
                }
            });
        }
    ];

    async.waterfall(task, (err, _data) => {
        callback(err, _data);
    });
}


/* 게임디비의 게임 제이슨 데이터를 받아 옵니다. */
function Get_game_json_data(session_id, game_code, callback){

    var task = [

        function(callback1){

            if(Util.isEmpty(session_id) || Util.isEmpty(game_code)){
                callback(PACKET_ERR.COMMON_NULL_VALUE);
                return;
            }else{
                callback1(null);
            }
        },

        function(callback1) {

            /* 게임이 정식 등록되었는지 체크 합니다. */
            Component_write.CheckGameConfirm(game_code,(err)=>{
               if(err != PACKET_ERR.SUCCESS){
                   callback(err);
                   return;
               }else{
                   callback1(null);
               }

           });
       },

        function(callback1){

            /* 게임관련 저장에 필요한 어카운트 정보를 가져옵니다 */
            Get_account_Info(session_id,(err,data)=>{
                if(err != PACKET_ERR.SUCCESS){
                    callback(err, null);
                    return;
                }else{
                    callback1(null,data);
                }

            });
        },

        function(_data, callback1){

            console.log("넘어가브럿다 ㅜㅜ ");
            console.log("내 아이디  ㅜㅜ "+_data.user_id);
            mysql.getGameRead().getConnection((error, con) =>{
                if(error){
                    con.release();
                    console.log('SDK Get_game_result  mysql.getGameRead().getConnection 1' + error);
                    callback(PACKET_ERR.COMMON_DATABASE_ERROR, null);
                    return;
                }else{

                    let table_name = "GameDB.TbGameId_"+game_code+"";
                    let _query = "SELECT count(*) CNT, gamedata_json as JDATA FROM "+table_name+" where UUID = ? ORDER BY regit_date desc limit 1";

                    con.query(_query,[_data.user_id], (err, results, fields)=>{
                        con.release();
                        if(err){
                            console.error("[ SDK Get_game_result querry error ] : " + err);
                            callback(PACKET_ERR.COMMON_QUERY_ERROR, null);
                            return;
                        }else{
                            var data = {};
                            var _cnt;
                            var _j_data;
                         

        

                            for (var i = 0; i < results.length; i++) {
                                _cnt = results[i].CNT;
                                _j_data = results[i].JDATA;
                            }

                            /* 사용자 의 게임 기록이 없는 경우 입니다. */
                            if(_cnt === 0){

                                data.nickname = _data.nickname;
                                
                                let jdata = {};
                                
                                jdata.isData = 0;
                                data.json_game_data = jdata;
                            
                                callback1(PACKET_ERR.SUCCESS, data);

                            }else{
                                data.nickname = _data.nickname;
                                data.json_game_data = _j_data;

                                callback1(PACKET_ERR.SUCCESS, data);
                            }
        
                        }
                    });
                }
            });
        }

    ];

    async.waterfall(task, (err, _data) => {
        callback(err, _data);
    });
}

function Get_rank_redis_data(game_code, start, end, last_rank = 0, callback){

    var task =[

        function(callback1){

            const rank_game_redis = redis.getWeekRankingRedis();
            var redis_game_key = "USER_GAME_CODE_"+game_code;
            rank_game_redis.zrevrange(redis_game_key, start, end,'WITHSCORES', (err, reply) =>{

                if(err){
                    console.error("[SDK Get_real_time_rank redis.zrevrange] -- ERROR : "+err);
                    callback(PACKET_ERR.COMMON_REDIS_ERROR);
                    return;
                }else{
                    if(reply.length <=0){
                        callback(PACKET_ERR.COMMON_NO_DATA);
                        return;
                    }else{

                        let _data = [];
                        let _arr_nickname = [];

                        /* 페이지네이션을 위해 마지막 랭킹넘버를 받아옵니다.
                        없으면 기본이 0으로 시작 합니다. 숫자변경을 위한 곱하기1*/
                        var _rank = (last_rank*1);

                        for(var i =0 ; i < reply.length; i++){
                            let _rowData = {};

                            _rank += 1;

                            _rowData.rank = _rank;
                            _rowData.nickname = reply[i];
                            _rowData.gamedata = reply[i+= 1];
                            /* 닉네임 정보만 따로 배열로 챙겨둡니다. */
                            _arr_nickname.push(_rowData.nickname);

                            _data.push(_rowData);

                        }

                        callback1(null, _arr_nickname, _data);
                    }

                }
            });
        },

        function(_arr_nickname, _data, callback1){

            mysql.getGameRead().getConnection((err,con)=>{
                if(err){
                    con.release();
                    console.error("[  SDK REAL TIME RANK  ] ERROR : "+err);
                    callback(PACKET_ERR.COMMON_DATABASE_ERROR);
                    return;
                }else{

                    /* 배열로 담긴 닉네임들을 쿼리화 시키기위해 스트링 조합합니다. */
                    var str_query_nicknames = "(";

                    for(var i=0 ; i < _arr_nickname.length; i ++){

                        if(i === (_arr_nickname.length -1)){
                            str_query_nicknames += "'"+_arr_nickname[i]+"'";
                        }else{
                            str_query_nicknames += "'"+_arr_nickname[i]+"'"+",";
                        }
                        
                    }
                    str_query_nicknames +=")";
                    
                    var table = "TbGameId_"+game_code;
                    let _query = "SELECT nickname, SUM(mainscore) AS M_SCORE , SUM(subscore) AS S_SCORE , school_name FROM "+table+" WHERE nickname IN "+str_query_nicknames+"GROUP BY UUID";

                    con.query(_query, (err, results, fields)=>{
                        con.release();
                        if(err){
                            console.error("[  SDK REAL TIME RANK  ] QUERY ERROR : "+err);
                            callback(PACKET_ERR.COMMON_DATABASE_ERROR);
                            return;
                        }else{

                            
                            if(results[0] !== null){
                                results.forEach(row => {
                                  
                                    for(var i =0 ; i < _data.length; i++){
                                        if(_data[i].nickname  === row.nickname){
                                           _data[i].m_score = row.M_SCORE;
                                           _data[i].s_score = row.S_SCORE;
                                           _data[i].school_name = row.school_name;
                                        }
                                    }
                                });

                                callback1(PACKET_ERR.SUCCESS, _data);
                            }else{
                                
                                callback1(PACKET_ERR.COMMON_FAIL, _data);
                            }
                            //IF

                            
                        }
                    });
                }

            });
        }
    ];
    async.waterfall(task, (err, data) => {
      
        callback(err,data);

    });
}

function Get_my_rank_redis(session_id, game_code, callback){

    var task = [

        function(callback1){

            if(Util.isEmpty(game_code)){
                callback(PACKET_ERR.COMMON_NULL_VALUE);
                return;
            }else{
                callback1(null);
            }
        },

        function(callback1) {

            /* 게임이 정식 등록되었는지 체크 합니다. */
           /*  Component_write.CheckGameConfirm(game_code,(err)=>{
               if(err != PACKET_ERR.SUCCESS){
                   callback(err);
                   return;
               }else{
                   callback1(null);
               }

           }); */
           callback1(null);
       }, 

       function(callback1){

            if(session_id === "0"){

                /* 비로그인자가 랭킹을 보는 경우 입니다. */
                console.log("비로그인자 1");
                var data = null;
                callback1(null,data);
                

            }else{
                /* 게임관련 저장에 필요한 어카운트 정보를 가져옵니다 */
                Get_account_Info(session_id,(err,data)=>{
                    if(err != PACKET_ERR.SUCCESS){
                        callback(err, null);
                        return;
                    }else{
                        callback1(null,data);
                    }

                });
            }
            
        },

        function(data, callback1){

            console.log("비로그인자 2");
            const rank_game_redis = redis.getWeekRankingRedis();
            var redis_game_key = "USER_GAME_CODE_"+game_code;

            rank_game_redis.zrevrange(redis_game_key, 0, -1,'WITHSCORES', (err, reply) =>{

                if(err){
                    console.error("[SDK Get_real_time_rank redis.zrevrange] -- ERROR : "+err);
                    callback(PACKET_ERR.COMMON_REDIS_ERROR);
                    return;
                }else{
                    if(reply.length <=0){
                        callback(PACKET_ERR.COMMON_NO_DATA);
                        return;
                    }else{

                        let my_rank = {};
                       
                        var _rank = 0;
                        for(var i =0 ; i < reply.length; i++){
                            let _rowData = {};

                            /* 랭크를 체크하는 이유는 내랭킹 체크도 이유지만
                            전체 토탈 카운트를 내려주기위함입니다. */
                            _rank += 1;

                            if(data !== null){
                                if(data.nickname === reply[i]){
                                    my_rank.rank = _rank;
                                    my_rank.nickname = data.nickname;
                                    my_rank.gamedata = reply[i += 1];
                                }else{
                                    /* 다음카운터를 위해서 1올립니다. */
                                    reply[i += 1];
                                }
                            }
                           
                        }

                        if(data !== null){
                            if(Util.isEmpty(my_rank.rank)){
                                my_rank.rank = -1;
                                my_rank.nickname = data.nickname;
                                my_rank.gamedata = 0;
    
                                callback1(null, my_rank, data, _rank);
                            }else{
                                callback1(null, my_rank, data, _rank);
                            }
    
                        }else{
                            /* 비로그인자 세션을 주지 않앗음으로 랭킹 데이터는 다 널입니다. */
                            console.log("비로그인자 2-1");
                            my_rank = null;
                            callback1(null, my_rank, data, _rank);
                        }
                        
                       
                    }

                }
            });
        },

        function(my_rank, data, total_cnt, callback1){

            if(data !== null){
                mysql.getGameRead().getConnection((err,con)=>{
                    if(err){
                        con.release();
                        console.error("[   SDK REAL TIME my RANK  ] ERROR : "+err);
                        callback(PACKET_ERR.COMMON_DATABASE_ERROR);
                        return;
                    }else{
    
                        
                        var table = "TbGameId_"+game_code;
                        let _query = "SELECT count(*) AS CNT, SUM(mainscore) AS M_SCORE , SUM(subscore) AS S_SCORE , school_name FROM "+table+" WHERE UUID = "+data.user_id;
    
                        con.query(_query, (err, results, fields)=>{
                            con.release();
                            if(err){
                                console.error("[  SDK REAL TIME my RANK  ] QUERY ERROR : "+err);
                                callback(PACKET_ERR.COMMON_DATABASE_ERROR);
                                return;
                            }else{
    
                                var _cnt;
                                var _m_socre;
                                var _s_score;
    
                                for (var i = 0; i < results.length; i++) {
                                    _cnt = results[i].CNT;
                                    _m_socre = results[i].M_SCORE;
                                    _s_score = results[i].S_SCORE; 
                                }
    
                                if(_cnt === 0){
                                    callback(PACKET_ERR.COMMON_NO_DATA);
                                    return;
                                }else{
                                    my_rank.m_score = _m_socre
                                    my_rank.s_score = _s_score
                                    my_rank.school_name = data.school_name;
    
                                    callback1(PACKET_ERR.SUCCESS, my_rank, total_cnt);
                                }
                            }
                        });
                    }
    
                });

            }else{
                console.log("비로그인자 3");
                callback1(PACKET_ERR.SUCCESS, my_rank, total_cnt);
            }

            
        }
    ];

    async.waterfall(task, (err, data, total_cnt) => {
      
        console.log("비로그인자 4 최종 read");
        callback(err,data, total_cnt/2);

    });

}

function Get_my_sc_rank_redis(session_id, game_code, callback){

    var task = [

        function(callback1){

            if(Util.isEmpty(session_id) || Util.isEmpty(game_code)){
                callback(PACKET_ERR.COMMON_NULL_VALUE);
                return;
            }else{
                callback1(null);
            }
        },

        function(callback1) {

            /* 게임이 정식 등록되었는지 체크 합니다. */
           /*  Component_write.CheckGameConfirm(game_code,(err)=>{
               if(err != PACKET_ERR.SUCCESS){
                   callback(err);
                   return;
               }else{
                   callback1(null);
               }

           }); */
           callback1(null);
       }, 

       function(callback1){

            if(session_id === "0"){
                var data = null;
                callback1(null,data);
            }else{
                /* 게임관련 저장에 필요한 어카운트 정보를 가져옵니다 */
            Get_account_Info(session_id,(err,data)=>{
                if(err != PACKET_ERR.SUCCESS){
                    callback(err, null);
                    return;
                }else{
                    callback1(null,data);
                }

            });
            }

        
        },

        function(data, callback1){

            const rank_game_redis = redis.getWeekRankingRedis();
            var redis_game_key = "SC_GAME_CODE_"+game_code;

            rank_game_redis.zrevrange(redis_game_key, 0, -1,'WITHSCORES', (err, reply) =>{

                if(err){
                    console.error("[SDK Get_real_time_rank redis.zrevrange] -- ERROR : "+err);
                    callback(PACKET_ERR.COMMON_REDIS_ERROR);
                    return;
                }else{
                    if(reply.length <=0){
                        callback(PACKET_ERR.COMMON_NO_DATA);
                        return;
                    }else{

                        let my_rank = {};
                       
                        var _rank = 0;
                        for(var i =0 ; i < reply.length; i++){
                          
                             /* 랭크를 체크하는 이유는 내랭킹 체크도 이유지만
                            전체 토탈 카운트를 내려주기위함입니다. */
                            _rank += 1;

                            /* data가 null인경우는 비로그인자 요청 입니다. 세션 없음 */
                            if(data !== null){
                                 /* 레디스의 값이 문자로 되어있어 곱하기 1 합니다. */
                                if((data.school_id*1) === (reply[i]*1)){
                              
                                    my_rank.rank = _rank;
                                    my_rank.school_id = data.school_id;
                                    my_rank.gamedata = reply[i += 1];
                                
                                }else{
                                    /* 다음카운터를 위해서 1올립니다. */
                                    reply[i += 1];
                                
                                }
                            } 
                        }

                        if(data !== null){
                            if(Util.isEmpty(my_rank.rank)){
                                my_rank.rank = -1;
                                my_rank.school_id = 0;
                                my_rank.gamedata = 0;
                                callback1(null, my_rank, data, _rank);
                            
                            }else{
                                callback1(null, my_rank, data, _rank);
                            }
                        }else{
                            console.log("비로그인자 2-1");
                            my_rank = null;
                            callback1(null, my_rank, data, _rank);
                        }
                     
                    }
                }
            });
        },

        function(my_rank, data, total_cnt, callback1){

            if(data !== null){
                mysql.getGameRead().getConnection((err,con)=>{
                    if(err){
                        con.release();
                        console.error("[   SDK REAL TIME my RANK  ] ERROR : "+err);
                        callback(PACKET_ERR.COMMON_DATABASE_ERROR);
                        return;
                    }else{
    
                        var table = "TbGameId_"+game_code;
                        let _query = "SELECT count(*) AS CNT, SUM(mainscore) AS M_SCORE , SUM(subscore) AS S_SCORE , school_name FROM "+table+" WHERE school_id = "+data.school_id;
    
                        con.query(_query, (err, results, fields)=>{
                            con.release();
                            if(err){
                                console.error("[  SDK REAL TIME my RANK  ] QUERY ERROR : "+err);
                                callback(PACKET_ERR.COMMON_DATABASE_ERROR);
                                return;
                            }else{
    
                                var _cnt;
                                var _m_socre;
                                var _s_score;
    
                                for (var i = 0; i < results.length; i++) {
                                    _cnt = results[i].CNT;
                                    _m_socre = results[i].M_SCORE;
                                    _s_score = results[i].S_SCORE; 
                                }
    
                                if(_cnt === 0){
                                    callback(PACKET_ERR.COMMON_NO_DATA, my_rank, total_cnt );
                                    return;
                                }else{
                                  
                                    my_rank.m_score = _m_socre
                                    my_rank.s_score = _s_score
                                    my_rank.school_name = data.school_name;
    
                                    callback1(PACKET_ERR.SUCCESS, my_rank, total_cnt);
                                }
                            }
                        });
                    }
    
                });
            }else{
                callback1(PACKET_ERR.SUCCESS, my_rank, total_cnt);
            }
         
        }
    ];

    async.waterfall(task, (err, data, total_cnt) => {
      
        callback(err,data, total_cnt/2);

    });

}

function Get_sc_rank_redis_data(game_code, start, end, last_rank = 0, callback){

    var task =[

        function(callback1){

            const rank_game_redis = redis.getWeekRankingRedis();
            var redis_game_key = "SC_GAME_CODE_"+game_code;
            rank_game_redis.zrevrange(redis_game_key, start, end,'WITHSCORES', (err, reply) =>{

                if(err){
                    console.error("[SDK Get_real_time_rank redis.zrevrange] -- ERROR : "+err);
                    callback(PACKET_ERR.COMMON_REDIS_ERROR);
                    return;
                }else{
                    if(reply.length <=0){
                        callback(PACKET_ERR.COMMON_NO_DATA);
                        return;
                    }else{

                        let _data = [];
                        let _arr_school_id = [];

                        /* 페이지네이션을 위해 마지막 랭킹넘버를 받아옵니다.
                        없으면 기본이 0으로 시작 합니다. 숫자변경을 위한 곱하기1*/
                        var _rank = (last_rank*1);

                        for(var i =0 ; i < reply.length; i++){
                            let _rowData = {};

                            _rank += 1;

                            _rowData.rank = _rank;
                            _rowData.school_id = reply[i];
                            _rowData.gamedata = reply[i+= 1];
                            /* 닉네임 정보만 따로 배열로 챙겨둡니다. */
                            _arr_school_id.push(_rowData.school_id);

                            _data.push(_rowData);

                        }

                        callback1(null, _arr_school_id, _data);
                    }

                }
            });
        },

        function(_arr_school_id, _data, callback1){

            mysql.getGameRead().getConnection((err,con)=>{
                if(err){
                    con.release();
                    console.error("[  SDK REAL TIME RANK  ] ERROR : "+err);
                    callback(PACKET_ERR.COMMON_DATABASE_ERROR);
                    return;
                }else{

                    /* 배열로 담긴 닉네임들을 쿼리화 시키기위해 스트링 조합합니다. */
                    var str_query_school_id = "(";

                    for(var i=0 ; i < _arr_school_id.length; i ++){

                        if(i === (_arr_school_id.length -1)){
                            str_query_school_id += "'"+_arr_school_id[i]+"'";
                        }else{
                            str_query_school_id += "'"+_arr_school_id[i]+"'"+",";
                        }
                        
                    }
                    str_query_school_id +=")";
                    
                    var table = "TbGameId_"+game_code;
                    let _query = "SELECT school_id, SUM(mainscore) AS M_SCORE , SUM(subscore) AS S_SCORE , school_name FROM "+table+" WHERE school_id IN "+str_query_school_id+" GROUP BY school_id";

                    con.query(_query, (err, results, fields)=>{
                        con.release();
                        if(err){
                            console.error("[  SDK REAL TIME RANK  ] QUERY ERROR : "+err);
                            callback(PACKET_ERR.COMMON_DATABASE_ERROR);
                            return;
                        }else{

                            
                            if(results[0] !== null){
                                results.forEach(row => {
                                  
                                    for(var i =0 ; i < _data.length; i++){
                                        if(_data[i].school_id* 1  === row.school_id){
                                           _data[i].m_score = row.M_SCORE;
                                           _data[i].s_score = row.S_SCORE;
                                           _data[i].school_name = row.school_name;
                                        }
                                    }
                                });

                                callback1(PACKET_ERR.SUCCESS, _data);
                            }else{
                                
                                callback1(PACKET_ERR.COMMON_FAIL, _data);
                            }
                            //IF

                            
                        }
                    });
                }

            });
        }
    ];
    async.waterfall(task, (err, data) => {
      
        callback(err,data);

    });
}

function Get_week_user_rank(game_code, start_date, end_date, session_id, callback){

    var task = [
        function(callback1){

            if(Util.isEmpty(game_code) || Util.isEmpty(start_date)|| Util.isEmpty(end_date)|| Util.isEmpty(session_id)){
                callback(PACKET_ERR.COMMON_NULL_VALUE);
                return;
            }else{
                callback1(null);
            }
        },

        function(callback1){

            if(session_id === "0"){

                /* 비로그인자가 랭킹을 보는 경우 입니다. */
                var data = null;
                callback1(null,data);

            }else{
                /* 게임관련 저장에 필요한 어카운트 정보를 가져옵니다 */
                Get_account_Info(session_id,(err,data)=>{
                    if(err != PACKET_ERR.SUCCESS){
                        callback(err, null);
                        return;
                    }else{
                        callback1(null,data);
                    }
    
                });
            }
            
        },

        function(data, callback1){

            mysql.getGameRead().getConnection((err, con)=>{
                if(err){
                    con.release();
                    console.error('[ SDK Get_week_user_rank ]  >> getConnection error (mysql err)!!!'+err);                 
                    callback(PACKET_ERR.COMMON_DATABASE_ERROR);
                    return;
                }else{

                    var sd = new Date(start_date);
                    var ed = new Date(end_date);

                    let _query = "call web_sdk_select_rank(?,?,?)";
                    con.query(_query, [game_code, sd, ed], (err, results, fields)=>{
                        con.release();
                        if(err){
                            console.error('[ SDK Get_week_user_rank ]  >> query error (mysql err)!!!'+err);                 
                            callback(PACKET_ERR.COMMON_DATABASE_ERROR);
                            return;
                        }else{

                            let rank_data = [];
                            let my_rank = {};

                            if(results[0]!= null){
                              

                                rank_data.push(results[0]);

                                if(data !== null){

                                    for(var i=0 ; (results[0].length-1); i ++){

                                        /* 자꾸 넘어가기에 방어코드를 넣엇습니다. */
                                        if(i === (results[0].length-1)){
                                            break;
                                        }
                                        console.log("뒤져보기 --------------------"+results[0][i].UUID);
                                        if(data.user_id === results[0][i].UUID){
                                            my_rank = results[0][i];
                                        }
                                        
                                    }
                                    
                                }
                              
                                console.log("뒤져보기2 --------------------"+my_rank.UUID);
                               
                                callback1(PACKET_ERR.SUCCESS, rank_data, my_rank);
                            }else{
                                callback1(PACKET_ERR.COMMON_NO_DATA, rank_data, my_rank);
                            }
                        }
                    });
                }
            });
          
        }
    

    ];
    async.waterfall(task,(err,data, my)=>{
       callback(err,data, my);
    });
}

function Get_week_school_rank(game_code, start_date, end_date, session_id, callback){

    var task = [
        function(callback1){

            if(Util.isEmpty(game_code) || Util.isEmpty(start_date)|| Util.isEmpty(end_date)|| Util.isEmpty(session_id)){
                callback(PACKET_ERR.COMMON_NULL_VALUE);
                return;
            }else{
                callback1(null);
            }
        },

        function(callback1){


            if(session_id === "0"){
                  /* 비로그인자가 랭킹을 보는 경우 입니다. */
                  var data = null;
                  callback1(null,data);
            }else{
                  /* 게임관련 저장에 필요한 어카운트 정보를 가져옵니다 */
                  Get_account_Info(session_id,(err,data)=>{
                    if(err != PACKET_ERR.SUCCESS){
                        callback(err, null);
                        return;
                    }else{
                        callback1(null,data);
                    }
    
                });
            }
          
        },

        function(data, callback1){

            mysql.getGameRead().getConnection((err, con)=>{
                if(err){
                    con.release();
                    console.error('[ SDK Get_week_school_rank ]  >> getConnection error (mysql err)!!!'+err);                 
                    callback(PACKET_ERR.COMMON_DATABASE_ERROR);
                    return;
                }else{

                    var sd = new Date(start_date);
                    var ed = new Date(end_date);

                    let _query = "call web_sdk_select_scrank(?,?,?)";
                    con.query(_query, [game_code, sd, ed], (err, results, fields)=>{
                        con.release();
                        if(err){
                            console.error('[ SDK Get_week_school_rank ]  >> query error (mysql err)!!!'+err);                 
                            callback(PACKET_ERR.COMMON_DATABASE_ERROR);
                            return;
                        }else{

                           /*  let rank_data = [];

                            if(results[0]!= null){
                              
                                rank_data.push(results[0]);
                               
                                callback1(PACKET_ERR.SUCCESS, rank_data);
                            }else{
                                callback1(PACKET_ERR.COMMON_NO_DATA, rank_data);
                            } */
                            let rank_data = [];
                            let my_rank = {};

                            if(results[0]!= null){
                              

                                rank_data.push(results[0]);

                                if(data !== null){

                                    for(var i=0 ; (results[0].length-1); i ++){

                                        /* 자꾸 넘어가기에 방어코드를 넣엇습니다. */
                                        if(i === (results[0].length-1)){
                                            break;
                                        }
                                        console.log("뒤져보기 --------------------"+results[0][i].school_id);
                                        if(data.school_id === results[0][i].school_id){
                                            my_rank = results[0][i];
                                        }
                                        
                                    }
                                    
                                }
                              
                                console.log("뒤져보기2 --------------------"+my_rank.UUID);
                               
                                callback1(PACKET_ERR.SUCCESS, rank_data, my_rank);
                            }else{
                                callback1(PACKET_ERR.COMMON_NO_DATA, rank_data, my_rank);
                            }
                        }
                    });
                }
            });
        }
    

    ];
    async.waterfall(task,(err,data, my)=>{
        callback(err,data, my);
     });
}

function Get_user_id_from_session(session_id,callback) {
    var user_id ="";
    // console.log("프론트에서 보넨 세션 =========================================>>"+session_id);
    mysql.getAccountRead().getConnection((err,con1)=>{
        if(err){
            if(con1) con1.release();
            console.error('Get_user_id_from_session >> getConnection error (mysql err)!!!'+err);
            callback(PACKET_ERR.READ_SESSION_ID_MYSQL_DB_CONN,null);
            return;
        }else{

            let _query = "call WEB_check_session(?)";
            con1.query(_query,[session_id],(err1,result,fields)=>{
                if(con1) con1.release();
                if(err1){
                    console.log('Get_user_id_from_session >> query error (mysql err)!!!'+err1);
                    callback(PACKET_ERR.MYSQL_READ_BY_SESSION_NOT_INFO,null);
                    return;
                }else{
                    if(result[0].length >0){
                        for(var i=0; i< result.length; i++){
                            for(var j=0 ; j<result[i].length; j++)
                            {
                                user_id = result[i][j].id;
                            }
                        }
                        callback(PACKET_ERR.SUCCESS,user_id);
                        return;
                    }else{
                        callback(PACKET_ERR.COMMON_NO_DATA,null);
                        return;
                    }
                }
            });
        }
    })
}

module.exports = {
    Get_account_Info : Get_account_Info,
    Get_game_result : Get_game_result,
    Get_game_json_data : Get_game_json_data,
    Get_rank_redis_data : Get_rank_redis_data,
    Get_my_rank_redis : Get_my_rank_redis,
    Get_my_sc_rank_redis : Get_my_sc_rank_redis,
    Get_sc_rank_redis_data : Get_sc_rank_redis_data,
    Get_week_user_rank : Get_week_user_rank,
    Get_week_school_rank : Get_week_school_rank,
    Get_user_id_from_session : Get_user_id_from_session
}
