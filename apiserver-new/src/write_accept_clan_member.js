const mysql                   = require('./mysql');
const async                   = require('async');       // kevin added
const PACKET_ERR              = require('./packet_err').PACKET_ERR;
const isGoodWord = require('../common/global_array');
const component_read = require('../common/component_read');
exports.update_clan_desc = function(manager_session_id,clan_id,desc, callback){

    var bad_word_check_decs = isGoodWord.check(desc);

    if(bad_word_check_decs.isFound){
        callback(PACKET_ERR.CHECK_PROHIBIT_WORDS_NO_WORDS, { word:bad_word_check_decs.word});
        return;
    } else if (desc.length > 40) {
        callback(PACKET_ERR.CLAN_EXPLAINED_TOO_MUCH);
        return;
    }
    component_read.Get_user_id_from_session(manager_session_id,(err,manager_id)=> {
        if (err !== PACKET_ERR.SUCCESS) {
            callback(err);
            return;
        } else {
            is_manager(manager_id, clan_id, (err, res) => {
                if (err !== PACKET_ERR.WRITE_CLAN_DATA_SUCESS) {
                    callback(err);
                    return;
                } else {
                    mysql.getWebWrite().getConnection((err, con) => {

                        if (err) {
                            if (con) con.release();
                            console.error('update_clan_desc >> getConnection error (mysql err)!!!' + err);
                            callback(PACKET_ERR.COMMON_FAIL, null);
                            return;
                        } else {
                            let _query = "UPDATE Clans SET description =? WHERE id = ? AND is_dell = 0";
                            con.query(_query, [desc, clan_id], (err, result, fields) => {
                                if (con) con.release();
                                if (err) {
                                    console.error('read_uuid_4_rank_redis >> query error (mysql err)!!!' + err);
                                    callback(PACKET_ERR.COMMON_FAIL, null);
                                    return;
                                } else {
                                    callback(PACKET_ERR.SUCCESS, null);
                                }

                            });
                        }
                    });
                }
            });
        }
    });
}

exports.accept_clan_member = function(manager_session_id,clan_id, wanab_id, callback){

    component_read.Get_user_id_from_session(manager_session_id,(err,manager_id)=> {
        if (err !== PACKET_ERR.SUCCESS) {
            callback(err);
            return;
        } else {
            is_manager(manager_id, clan_id, (err, res) => {
                if (err !== PACKET_ERR.WRITE_CLAN_DATA_SUCESS) {
                    callback(err);
                    return;
                } else {
                    mysql.getWebRead().getConnection((err, con0) => {
                        if (err) {
                            if (con0) con0.release();
                            console.error('read_rank_school >> getConnection error (mysql err)!!!' + err);
                            callback(PACKET_ERR.TYPING_READ_POS_PRACTICE_MYSQL, null);
                            return;
                        } else {//이미 죽은 상태를 체크 하는것은 이사람이 다른곳에도 신청해 놧는데 해당 마스터가 승인해버리면 죽은상태임으로..
                            con0.query("SELECT COUNT(*) cnt FROM ClanMembers WHERE is_dell = 0 AND is_member=1 AND user_id=?", [wanab_id], function (err, results) {
                                if (con0) con0.release();
                                if (err) {
                                    console.error("regit clan conn err");
                                    callback(PACKET_ERR.REGIT_CLAN_SAME_CLAN_NAME, null);
                                    return;
                                } else {
                                    if (results[0].cnt > 0) {
                                        console.error("join clan Alread join");
                                        callback(PACKET_ERR.JOIN_CLANMEBER_ALREDY_JOIN, null);
                                        return;

                                    } else {

                                        mysql.getWebRead().getConnection((err, conn) => {
                                            if (err) {
                                                if (conn) conn.release();
                                                console.error('read_rank_school >> getConnection error (mysql err)!!!' + err);
                                                callback(PACKET_ERR.TYPING_READ_POS_PRACTICE_MYSQL, null);
                                                return;
                                            } else {

                                                conn.query("SELECT COUNT(*) cnt FROM Clans WHERE is_dell = 0 AND manager_id=?", [wanab_id], function (err, results) {
                                                    if (conn) conn.release();
                                                    if (err) {
                                                        console.error("regit clan conn err");
                                                        callback(PACKET_ERR.REGIT_CLAN_SAME_CLAN_NAME, null);
                                                        return;
                                                    } else {
                                                        if (results[0].cnt > 0) {
                                                            console.error('regit clan error alerdy member another');
                                                            callback(PACKET_ERR.CLAN_CANT_DELL_ALREADY_ANOTHER_CLAN_MEMBER, null);
                                                            return;
                                                        } else {

                                                            mysql.getWebWrite().getConnection((err, con) => {

                                                                if (err) {
                                                                    if (con) con.release();
                                                                    console.error('read_rank_school >> getConnection error (mysql err)!!!' + err);
                                                                    callback(PACKET_ERR.TYPING_READ_POS_PRACTICE_MYSQL, null);
                                                                    return;
                                                                }

                                                                con.beginTransaction(function (err) {
                                                                    if (err) {
                                                                        console.error("accept_clan_member rollBack Transaction!!" + err);
                                                                        if (con) con.release();
                                                                        callback(PACKET_ERR.COMMON_FAIL, null);
                                                                        return;
                                                                    } else {
                                                                        let _query = "update ClanMembers set is_member = 1 where clan_id =? and user_id =? and is_dell = 0";

                                                                        // var uid = BigInt(user_id);
                                                                        var cid = parseInt(clan_id);

                                                                        con.query(_query, [cid, wanab_id], (err, result, fields) => {

                                                                            if (err) {
                                                                                console.error("accept_clan_member rollBack Transaction!!" + err);
                                                                                con.rollback(function () {
                                                                                    if (con) con.release();
                                                                                });

                                                                                callback(PACKET_ERR.COMMON_FAIL, null);
                                                                                return;
                                                                            } else {
                                                                                if (result) {

                                                                                    let _query = "UPDATE ClanMembers SET is_dell = 1 WHERE NOT clan_id =? AND user_id =?";
                                                                                    con.query(_query, [cid, wanab_id], (err, result, fields) => {
                                                                                        if (err) {
                                                                                            console.error("accept_clan_member rollBack Transaction!!" + err);
                                                                                            con.rollback(function () {
                                                                                                if (con) con.release();
                                                                                            });

                                                                                            callback(PACKET_ERR.COMMON_FAIL, null);
                                                                                            return;
                                                                                        } else {
                                                                                            //let _query ="UPDATE Clans SET member_count =? WHERE id =?";
                                                                                            let _query = "call web_update_clancount(?)";
                                                                                            con.query(_query, [cid], (err, result, fields) => {

                                                                                                if (err) {
                                                                                                    console.error("accept_clan_member rollBack Transaction!!" + err);
                                                                                                    con.rollback(function () {
                                                                                                        if (con) con.release();
                                                                                                    });

                                                                                                    callback(PACKET_ERR.COMMON_FAIL, null);
                                                                                                    return;
                                                                                                } else {
                                                                                                    con.commit(function (err) {
                                                                                                        if (err) {
                                                                                                            if (con) con.release();
                                                                                                            console.error("dell_clan commitFail rollBack Transaction!!" + err);
                                                                                                            con.rollback(function () {
                                                                                                                if (con) con.release();
                                                                                                            });

                                                                                                            callback(PACKET_ERR.COMMON_FAIL, null);
                                                                                                            return;
                                                                                                        } else {
                                                                                                            if (con) con.release();
                                                                                                            callback(PACKET_ERR.SUCCESS, null);
                                                                                                        }
                                                                                                    });
                                                                                                }
                                                                                            });
                                                                                        }
                                                                                    });
                                                                                } else {
                                                                                    if (con) con.release();
                                                                                    callback(PACKET_ERR.READ_RABK_DOESNT_EXIST);
                                                                                    return;
                                                                                }

                                                                            }
                                                                        });
                                                                    }
                                                                });
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
            });
        }
    });



}

exports.dell_clan_member = function(sender_session_id,clan_id, member_id, callback){
    component_read.Get_user_id_from_session(sender_session_id,(err,sender_id)=> {
        if (err !== PACKET_ERR.SUCCESS) {
            callback(err);
            return;
        } else {
            if(sender_id==member_id){
                updateDB_delete_clan_member(sender_id, clan_id, (err, res) => {
                    callback(err);
                    return;
                });
            }
            else{
                is_manager(sender_id, clan_id, (err, res) => {
                    if (err !== PACKET_ERR.WRITE_CLAN_DATA_SUCESS) {
                        callback(err);
                        return;
                    } else {
                        updateDB_delete_clan_member(member_id, clan_id, (err, res) => {
                            callback(err);
                            return;
                        });
                    }
                });
            }
        }
    });
}

exports.dell_clan_wanab_member = function (sender_session_id, clan_id, wanab_id, callback) {
    component_read.Get_user_id_from_session(sender_session_id,(err,sender_id)=> {
        if (err !== PACKET_ERR.SUCCESS) {
            callback(err);
            return;
        } else {
            if (sender_id == wanab_id) {
                updateDB_delete_clan_wanab_member(sender_id,clan_id,(err, res) => {
                    callback(err);
                    return;
                });
            } else {
                is_manager(sender_id, clan_id, (err, res) => {
                    if (err !== PACKET_ERR.WRITE_CLAN_DATA_SUCESS) {
                        callback(err);
                        return;
                    } else {
                        updateDB_delete_clan_wanab_member(wanab_id,clan_id,(err, res) => {
                            callback(err);
                            return;
                        });
                    }
                });
            }
        }
    });
}

exports.dell_clan = function (manager_session_id, clan_id, callback) {
    component_read.Get_user_id_from_session(manager_session_id,(err,manager_id)=>{
        if(err!==PACKET_ERR.SUCCESS){
            callback(err);
            return;
        }
        else {
            is_manager(manager_id, clan_id, (err, res) => {
                if (err !== PACKET_ERR.WRITE_CLAN_DATA_SUCESS) {
                    callback(err);
                    return;
                } else {
                    mysql.getWebWrite().getConnection((err, con) => {
                        if (err) {
                            if (con) con.release();
                            console.error('dell_clan >> getConnection error (mysql err)!!!' + err);
                            callback(PACKET_ERR.err, null);
                        } else {

                            con.beginTransaction(function (err) {
                                if (err) {
                                    console.error("dell_clan rollBack Transaction!!" + err);
                                    if (con) con.release();
                                    callback(PACKET_ERR.COMMON_FAIL, null);
                                    return;
                                } else {

                                    let _query = "UPDATE Clans SET is_dell = 1 WHERE id = ?";
                                    con.query(_query, [clan_id], (err, result, fields) => {
                                        if (err) {
                                            console.error("dell_clan rollBack Transaction!!" + err);
                                            con.rollback(function () {
                                                if (con) con.release();
                                            });

                                            callback(PACKET_ERR.COMMON_FAIL, null);
                                            return;
                                        } else {

                                            let _query = "UPDATE ClanMembers SET is_dell = 1 WHERE clan_id = ?";
                                            con.query(_query, [clan_id], (err, result, fields) => {
                                                if (err) {
                                                    console.error("dell_clan rollBack Transaction!!" + err);
                                                    con.rollback(function () {
                                                        if (con) con.release();
                                                    });

                                                    callback(PACKET_ERR.COMMON_FAIL, null);
                                                    return;
                                                } else {
                                                    con.commit(function (err) {
                                                        if (err) {
                                                            if (con) con.release();
                                                            console.error("dell_clan commitFail rollBack Transaction!!" + err);
                                                            con.rollback(function () {
                                                                if (con) con.release();
                                                            });

                                                            callback(PACKET_ERR.COMMON_FAIL, null);
                                                            return;
                                                        } else {
                                                            if (con) con.release();
                                                            callback(PACKET_ERR.SUCCESS, null);
                                                        }
                                                    });

                                                }

                                            });

                                        }
                                    });
                                }
                            });
                        }
                    });
                }


            });

        }
    });
}

exports.exchange_master = function (oldManager_session_id, newManager_id, newManager_nick, clan_id, callback) {
    component_read.Get_user_id_from_session(oldManager_session_id,(err,oldManager_id)=>{
       if(err!==PACKET_ERR.SUCCESS){
            callback(err);
            return;
       }
       else{
           is_manager(oldManager_id, clan_id, (err, res) => {
               if (err!==PACKET_ERR.WRITE_CLAN_DATA_SUCESS) {
                   callback(err);
                   return;
               } else {
                   mysql.getWebWrite().getConnection((err, con) => {

                       con.beginTransaction(function (err) {
                           if (err) {
                               console.error("exchangeMasterClan rollBack Transaction!!" + err);
                               if (con) con.release();
                               callback(PACKET_ERR.COMMON_FAIL, null);
                               return;
                           } else {
                               let _query = "SELECT count(*) cnt FROM ClanMembers WHERE user_id = ? and clan_id = ? and is_dell = 0";
                               con.query(_query, [newManager_id, clan_id], (err, results, fields) => {
                                   if (err) {
                                       console.error("exchangeMasterClan rollBack Transaction!!" + err);
                                       con.rollback(function () {
                                           if (con) con.release();
                                       });
                                       callback(PACKET_ERR.COMMON_FAIL, null);
                                       return;
                                   } else {
                                       if (results[0].cnt > 0) {
                                           let _query = "UPDATE Clans SET manager_id=? , manager_nickname=? WHERE id=?";
                                           con.query(_query, [newManager_id, newManager_nick, clan_id], (err, result, fields) => {
                                               if (err) {
                                                   console.error("exchangeMasterClan rollBack Transaction!!" + err);
                                                   con.rollback(function () {
                                                       if (con) con.release();
                                                   });

                                                   callback(PACKET_ERR.COMMON_FAIL, null);
                                                   return;
                                               } else {
                                                   let _query = "UPDATE ClanMembers SET is_manager=? WHERE user_id=? AND clan_id=?";
                                                   con.query(_query, [1, newManager_id, clan_id], (err, result, fields) => {

                                                       if (err) {
                                                           console.error("exchangeMasterClan rollBack Transaction!!" + err);
                                                           con.rollback(function () {
                                                               if (con) con.release();
                                                           });

                                                           callback(PACKET_ERR.COMMON_FAIL, null);
                                                           return;
                                                       } else {
                                                           let _query = "UPDATE ClanMembers SET is_manager=? WHERE user_id=? AND clan_id=?";
                                                           con.query(_query, [0, oldManager_id, clan_id], (err, result, fields) => {
                                                               if (err) {
                                                                   console.error("exchangeMasterClan rollBack Transaction!!" + err);
                                                                   con.rollback(function () {
                                                                       if (con) con.release();
                                                                   });

                                                                   callback(PACKET_ERR.COMMON_FAIL, null);
                                                                   return;
                                                               } else {
                                                                   con.commit(function (err) {
                                                                       if (con) con.release();
                                                                       if (err) {
                                                                           console.error("exchangeMasterClan rollBack Transaction!!" + err);
                                                                           con.rollback(function () {
                                                                               if (con) con.release();
                                                                           });

                                                                           callback(PACKET_ERR.COMMON_FAIL, null);
                                                                           return;
                                                                       } else {

                                                                           callback(PACKET_ERR.SUCCESS, null);
                                                                           return;
                                                                       }
                                                                   });

                                                               }

                                                           });
                                                       }
                                                   });
                                               }
                                           });

                                       } else {
                                           console.error("exchangeMasterClan rollBack Transaction!!" + err);
                                           con.rollback(function () {
                                               if (con) con.release();
                                           });

                                           callback(PACKET_ERR.LEAVE_CLANMEMBER, null);
                                           return;
                                       }
                                   }
                               });
                           }
                       });
                   });
               }
           });
       }
    });
}
function is_manager(user_id, clan_id, callback) {
    var manager_id = "";
    mysql.getWebRead().getConnection((err1, conn) => {
        if (err1) {
            if (conn) conn.release();
            console.error('is_manager >> getConnection error (mysql err)!!!' + err1);
            callback(PACKET_ERR.COMMON_DATABASE_ERROR, null);
            return;
        } else {
            let _query = "SELECT manager_id FROM Clans WHERE id = ?";
            conn.query(_query, [clan_id], (err2, clan_result, fields) => {
                if (conn) conn.release();
                if (err2) {
                    console.log('is_manager >> query error (mysql err)!!!' + err2);
                    callback(PACKET_ERR.MYSQL_READ_BY_SESSION_NOT_INFO, null);
                    return;
                } else {
                    if (clan_result[0] !== null) {
                        manager_id = clan_result[0].manager_id;
                        if (manager_id === user_id) {
                            callback(PACKET_ERR.WRITE_CLAN_DATA_SUCESS, null);
                            return;
                        } else {
                            callback(PACKET_ERR.MANAGER_USER_NOT_MATCHING, null);
                            return;
                        }
                    } else {
                        console.log('is_manager >> clan_id Not Match!!!');
                        callback(PACKET_ERR.MYSQL_READ_BY_CLAN_NOT_MATCH, null);
                        return;
                    }
                }
            });
        }
    });
}
function updateDB_delete_clan_member(user_id,clan_id,callback){

    mysql.getWebRead().getConnection((err1, conn) => {
        if (err1) {
            if (conn) conn.release();
            console.error('updateDB_delete_clan_member >> getConnection error (mysql err)!!!' + err1);
            callback(PACKET_ERR.TYPING_READ_POS_PRACTICE_MYSQL, null);
            return;
        } else {
            conn.query("SELECT COUNT(*) cnt FROM ClanMembers WHERE is_dell = 0 AND user_id =? AND is_manager = 1 AND clan_id=? ", [user_id, clan_id], function (err2, results) {
                if (conn) conn.release();
                if (err2) {
                    console.error("regit clan conn err");
                    callback(PACKET_ERR.REGIT_CLAN_SAME_CLAN_NAME, null);
                    return;
                } else {
                    if (results[0].cnt > 0) {
                        console.error('cant dell clanMember you master');
                        callback(PACKET_ERR.COMMON_FAIL, null);
                        return;
                    } else {
                        mysql.getWebWrite().getConnection((err3, con) => {

                            if (err3) {
                                if (con) con.release();
                                console.error('updateDB_delete_clan_member >> getConnection error (mysql err)!!!' + err3);
                                callback(PACKET_ERR.TYPING_READ_POS_PRACTICE_MYSQL, null);
                                return;
                            }
                            else{
                                //  var uid = BigInt(user_id);
                                var cid = parseInt(clan_id);
                                //   console.log("cid"+cid);
                                //   console.log("uid"+user_id);
                                con.beginTransaction(function (err) {
                                    if (err) {
                                        console.error("dell_clan rollBack Transaction!!" + err);
                                        if (con) con.release();
                                        callback(PACKET_ERR.COMMON_FAIL, null);
                                        return;
                                    } else {
                                        let _query = "UPDATE ClanMembers SET is_dell = 1 where clan_id =? and user_id =? and is_member=1 and is_manager = 0";
                                        con.query(_query, [cid, user_id], (err4, result, fields) => {
                                            if (err4) {
                                                if (con) con.release();
                                                console.error('updateDB_delete_clan_member rollBack >> query error (mysql err)!!!' + err4);
                                                callback(PACKET_ERR.COMMON_FAIL,null);
                                                return;
                                            } else {
                                                if (result) {
                                                    //  console.log("지워짐");
                                                    //let _query ="UPDATE Clans SET member_count =? WHERE id =?";
                                                    let _query = "call web_update_clancount(?)";
                                                    con.query(_query, [cid], (err5, result, fields) => {
                                                        if (err5) {
                                                            console.error('updateDB_delete_clan_member rollBack  >> query error (mysql err)!!!' + err5);
                                                            con.rollback(function () {
                                                                if (con) con.release();
                                                            });

                                                            callback(PACKET_ERR.COMMON_FAIL, null);
                                                            return;

                                                        } else {
                                                            con.commit(function (err6) {
                                                                if (err6) {
                                                                    if (con) con.release();
                                                                    console.error("updateDB_delete_clan_member rollBack Transaction!!" + err6);
                                                                    con.rollback(function () {
                                                                        if (con) con.release();
                                                                    });
                                                                    callback(PACKET_ERR.COMMON_FAIL, null);
                                                                    return;
                                                                } else {
                                                                    if (con) con.release();
                                                                    callback(PACKET_ERR.SUCCESS, null);
                                                                    return;
                                                                }

                                                            });
                                                        }
                                                    });


                                                } else {
                                                    if (con) con.release();
                                                    callback(PACKET_ERR.READ_RABK_DOESNT_EXIST);
                                                    return;
                                                }

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
function updateDB_delete_clan_wanab_member(user_id,clan_id,callback) {
    mysql.getWebWrite().getConnection((err, con) => {

        if (err) {
            if (con) con.release();
            console.error('updateDB_delete_clan_wanab_member >> getConnection error (mysql err)!!!' + err);
            callback(PACKET_ERR.TYPING_READ_POS_PRACTICE_MYSQL, null);
            return;
        }
        let _query = "UPDATE ClanMembers SET is_dell = 1 where clan_id =? and user_id =? and is_member=0";
        //let _query = "DELETE FROM ClanMembers where clan_id =? and user_id =? and is_member=0";
        // var uid = BigInt(user_id);
        var cid = parseInt(clan_id);

        con.query(_query, [cid, user_id], (err, result, fields) => {
            if (con) con.release();
            if (err) {
                console.error('updateDB_delete_clan_wanab_member >> query error (mysql err)!!!' + err);
                callback(PACKET_ERR.READ_RABK_DOESNT_EXIST);
                return;
            } else {
                callback(PACKET_ERR.SUCCESS, null);
                return;
            }
        });
    });
}