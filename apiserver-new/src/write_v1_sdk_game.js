const redis = require('./redis');
const rediscfg = require('../config/redis.json')[process.env.NODE_ENV || 'development'];
const TIME = require('../common/time');
const RESULT_STATE = require('./def').RESULT_STATE;
const mysql = require('./mysql');
const PACKET_ERR = require('./packet_err').PACKET_ERR;
const write_log = require('./write_log').write_log;
const async = require('async');
const getRLI = require('./redis_util').getRLI;
const getRedis = require('./redis_util').getRedis;
const Check_Packet_Time = require('../common/util').Check_Packet_Time;
const Component_read = require('../common/component_read');
const Component_write = require('../common/component_write');
const Util = require('../common/util');


function GameDataSave(game_code, session_id, main_score, sub_score, gamedata, callback){

    var task = [

        function(callback1){

            if(Util.isEmpty(session_id) ||
            Util.isEmpty(main_score) ||
            Util.isEmpty(sub_score) ||
            Util.isEmpty(game_code) ||
            Util.isEmpty(gamedata)){
     
             callback(PACKET_ERR.COMMON_NULL_VALUE);
             return;

            }else{
                callback1(null);
            }
        },

        function(callback1){

            /* 게임관련 저장에 필요한 어카운트 정보를 가져옵니다 */
            Component_read.Get_account_Info(session_id,(err,data)=>{
                if(err != PACKET_ERR.SUCCESS){
                    callback(err, null);
                    return;
                }else{

                    callback1(null,data);
                    
                }

            });
        },

        function(_data,callback1){

            console.log(" SDK 게임 저장 통과 -------game_code--------"+game_code);
            console.log(" SDK 게임 저장 통과 ---------user_id------"+_data.user_id);
            console.log(" SDK 게임 저장 통과 --------nickname-------"+_data.nickname);
            console.log(" SDK 게임 저장 통과 --------main_score-------"+main_score);
            console.log(" SDK 게임 저장 통과 ---------sub_score------"+sub_score);
            console.log(" SDK 게임 저장 통과 ---------gamedata------"+gamedata);
            console.log(" SDK 게임 저장 통과 --------school_id-------"+_data.school_id);
            console.log(" SDK 게임 저장 통과 ---------------"+_data.school_name);
            Component_write.Insert_game_data(game_code, 
                                            _data.user_id, 
                                            _data.nickname,
                                            main_score,
                                            sub_score,
                                            gamedata,
                                            _data.school_id,
                                            _data.school_name,(err)=>{

                                                console.log("결과치 -----------------------------"+err);

                                                if(err != PACKET_ERR.SUCCESS){
                                                    console.error("[ SDK  GameDataSave DATABASE ERR ]")
                                                    callback(err);
                                                    return;
                                                }else{
                                                    callback1(err);
                                                }

                                            })

        }
    ];

    async.waterfall(task, (err) => {
        console.log("마지막 결과치 -----------------------------"+err);
            callback(err);
    });
    
}

function InsertRealTimeRank(game_code, session_id, score, callback){

    var task = [

        function(callback1){
            if(Util.isEmpty(session_id) ||
            Util.isEmpty(score) ||
            Util.isEmpty(game_code)){
     
             callback(PACKET_ERR.COMMON_NULL_VALUE);
             return;

            }else{
                callback1(null);
            }
        },

        function(callback1){

            /* 게임관련 저장에 필요한 어카운트 정보를 가져옵니다 */
            Component_read.Get_account_Info(session_id,(err,data)=>{
                if(err != PACKET_ERR.SUCCESS){
                    callback(err, null);
                    return;
                }else{

                    callback1(null,data);
                    
                }

            });
        },

        function(_data, callback1){
            Component_write.Insert_redis_user(game_code,_data.nickname,score,(err) => {
                console.log("결과치 -----------------------------"+err);
                if(err != PACKET_ERR.SUCCESS){
                    console.error("[ SDK  InsertRealTimeRank DATABASE ERR ] - "+err);
                    callback(err);
                    return;
                }else{
                    callback1(err);
                }
            });
        }
    ];

    async.waterfall(task, (err) => {
        console.log("마지막 결과치 -----------------------------"+err);
            callback(err);
    });
}

function InsertRealTimeSchoolRank(game_code, session_id, score, callback){

    var task = [

        function(callback1){
            if(Util.isEmpty(session_id) ||
            Util.isEmpty(score) ||
            Util.isEmpty(game_code)){
     
             callback(PACKET_ERR.COMMON_NULL_VALUE);
             return;

            }else{
                callback1(null);
            }
        },

        function(callback1){

            /* 게임관련 저장에 필요한 어카운트 정보를 가져옵니다 */
            Component_read.Get_account_Info(session_id,(err,data)=>{
                if(err != PACKET_ERR.SUCCESS){
                    callback(err, null);
                    return;
                }else{

                    /* 학교아이디가 0이면 유저가 지정하지 않은경우 입니다. */
                    if(data.school_id === 0){
                        callback(PACKET_ERR.READ_RANK_SCHOOL_GROUP_NODATA, null);
                        return;
                    }else{
                        callback1(null,data);
                    }
                    
                    
                }

            });
        },

        function(_data, callback1){
            Component_write.Insert_redis_school(game_code,_data.school_id,score,(err) => {
                console.log("결과치 -----------------------------"+err);
                if(err != PACKET_ERR.SUCCESS){
                    console.error("[ SDK  InsertRealTimeRank4School DATABASE ERR ] - "+err);
                    callback(err);
                    return;
                }else{
                    callback1(err);
                }
            });
        }
    ];

    async.waterfall(task, (err) => {
        console.log("마지막 결과치 -----------------------------"+err);
            callback(err);
    });
}

function GetRealTimeRank(game_code, session_id, start_num, end_num, last_rank = 0, callback){
    var task = [


        function(callback1){
            if(Util.isEmpty(start_num) ||
            Util.isEmpty(end_num) ||
            Util.isEmpty(game_code)){
     
             callback(PACKET_ERR.COMMON_NULL_VALUE);
             return;

            }else{
                callback1(null);
            }
        },

        /* 내 랭킹 데이터를 먼저 받아옵니다. */
        function(callback1){

            Component_read.Get_my_rank_redis(session_id, game_code, (err, data, total_cnt)=>{


                if(err !== PACKET_ERR.SUCCESS){
                    callback(err);
                    return;
                }else{

                    if(data === null)
                    console.log("널이래--");
                    
                    callback1(null, data, total_cnt);
                }

            });
        },

        /* 지정했던 시작번호 에서 끝번호까지 REDIS RANK를 들고 옵니다. */
        function(my_rank,total_cnt, callback1){
            Component_read.Get_rank_redis_data(game_code, start_num, end_num, last_rank, (err, data)=>{
                if(err !== PACKET_ERR.SUCCESS){
                    callback(err);
                    return;
                }else{
                       
                    var redis_rank_data = data;
                      callback1(PACKET_ERR.SUCCESS, redis_rank_data,my_rank, total_cnt);
                }
            });
        }
    ];
    async.waterfall(task, (err, data, data2, total_cnt) => {
            callback(err, data, data2, total_cnt);
    });

}

function GetScRealTimeRank(game_code, session_id, start_num, end_num, last_rank = 0, callback){
    var task = [


        function(callback1){
            if(Util.isEmpty(session_id) ||
            Util.isEmpty(start_num) ||
            Util.isEmpty(end_num) ||
            Util.isEmpty(game_code)){
     
             callback(PACKET_ERR.COMMON_NULL_VALUE);
             return;

            }else{
                callback1(null);
            }
        },

        /* 내 랭킹 데이터를 먼저 받아옵니다. */
        function(callback1){

            console.log("학교랭킹 들어옴--");
            Component_read.Get_my_sc_rank_redis(session_id, game_code, (err, data, total_cnt)=>{
                if(err !== PACKET_ERR.SUCCESS){
                    callback(err);
                    return;
                }else{

                    callback1(null, data, total_cnt);
                }

            });
        },

        /* 지정했던 시작번호 에서 끝번호까지 REDIS RANK를 들고 옵니다. */
        function(my_rank,total_cnt, callback1){
            Component_read.Get_sc_rank_redis_data(game_code, start_num, end_num, last_rank, (err, data)=>{
                if(err !== PACKET_ERR.SUCCESS){
                    callback(err);
                    return;
                }else{
                       
                    var redis_rank_data = data;
                      callback1(PACKET_ERR.SUCCESS, redis_rank_data,my_rank, total_cnt);
                }
            });
        }
    ];
    async.waterfall(task, (err, data, data2, total_cnt) => {
            callback(err, data, data2, total_cnt);
    });

}

module.exports = {
    GameDataSave : GameDataSave,
    InsertRealTimeRank : InsertRealTimeRank,
    InsertRealTimeSchoolRank : InsertRealTimeSchoolRank,
    GetRealTimeRank : GetRealTimeRank,
    GetScRealTimeRank : GetScRealTimeRank
}