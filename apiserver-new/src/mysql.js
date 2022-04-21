const mysql             = require('mysql');

const config = require('../config/db.json')[process.env.NODE_ENV || 'development'];

function CMysql(){
    this.account_db_w = null;
    this.account_db_r = null;
    this.game_db_w = null;
    this.game_db_r = null;
    this.log_db_w = null;
    this.log_db_r = null;
    this.web_db_w = null;
    this.web_db_r = null;
    this.ranking_db_w = null;
    this.ranking_db_r = null;
    this.word_db_r = null;
}

CMysql.prototype.create = function(){
	console.log('account_db : '+ JSON.stringify(config.MYSQL_ACCOUNT_DB_W));
    this.account_db_w = mysql.createPool(config.MYSQL_ACCOUNT_DB_W);
    this.account_db_r = mysql.createPool(config.MYSQL_ACCOUNT_DB_W);

    console.log('game_db : '+ JSON.stringify(config.MYSQL_GAME_R));
    this.game_db_w               = mysql.createPool(config.MYSQL_GAME_W);
    this.game_db_r               = mysql.createPool(config.MYSQL_GAME_R);

    this.log_db_w                = mysql.createPool(config.MYSQL_LOG_W);
    this.log_db_r                = mysql.createPool(config.MYSQL_LOG_R);

    this.web_db_w                = mysql.createPool(config.MYSQL_WEB_W);
    this.web_db_r                = mysql.createPool(config.MYSQL_WEB_R);

    this.ranking_db_w            = mysql.createPool(config.MYSQL_RANKING_W);
    this.ranking_db_r            = mysql.createPool(config.MYSQL_RANKING_R);

    this.word_db_r               = mysql.createPool(config.MYSQL_WORD_R);
}

CMysql.prototype.on_error = function(){
    this.account_db_w.on('error',(err)=>{
        //console.log('mysql_log_w..error >> '+err);
    });

    this.account_db_r.on('error',(err)=>{
        //console.log('mysql_log_w..error >> '+err);
    });

    this.game_db_w.on('error',(err)=>{
        //console.log('mysql_game_w..error >> '+err);
    });

    this.game_db_r.on('error',(err)=>{
        //console.log('mysql_game_r..error >> '+err);
    });

    this.log_db_w.on('error',(err)=>{
        //console.log('mysql_log_w..error >> '+err);
    });

    this.log_db_r.on('error',(err)=>{
        //console.log('mysql_log_r..error >> '+err);
    });

    this.web_db_w.on('error',(err)=>{
        //console.log('mysql_web_w..error >> '+err);
    });

    this.web_db_r.on('error',(err)=>{
        //console.log('mysql_web_r..error >> '+err);
    });

    this.word_db_r.on('error',(err)=>{
        //console.log('mysql_web_r..error >> '+err);
    });
}

CMysql.prototype.on_connection = function(){
    this.account_db_w.on('connection',(err)=>{
        //console.log('mysql_log_w..error >>'+err);
    });

    this.account_db_r.on('connection',(err)=>{
        //console.log('mysql_log_r..error >> '+err);
    });

    this.log_db_w.on('connection',(err)=>{
        //console.log('mysql_log_w..error  >>'+err);
    });

    this.log_db_r.on('connection',(err)=>{
        //console.log('mysql_log_r..error >>' + err);
    });

    this.game_db_r.on('connection',(err)=>{
        //console.log('mysql_game_r..error >>' + err);
    });

    this.game_db_w.on('connection',(err)=>{
        //console.log('mysql_game_w..error >>' + err);
    });

    this.web_db_r.on('connection',(err)=>{
        //console.log('mysql_web_r..error >>' + err);
    });

    this.web_db_w.on('connection',(err)=>{
        //console.log('mysql_web_w..error >>' + err);
    });

    this.word_db_r.on('connection',(err)=>{
        //console.log('mysql_web_w..error >>' + err);
    });
}

CMysql.prototype.connection = function(){
    this.account_db_w.on('connection', function(connection) {
        // 퀴리 로그 - 디버깅 용
        connection.on('account_w enqueue', function(sequence) {
            if ('Query' === sequence.constructor.name) {
                console.debug(sequence.sql);
            }
        });
    });

    this.account_db_r.on('connection', function(connection) {
        connection.on('account_r enqueue', function(sequence) {
            if ('Query' === sequence.constructor.name) {
                console.debug(sequence.sql);
            }
        });
    });

    this.game_db_w.on('connection', function(connection) {
        connection.on('game_w enqueue', function(sequence) {
            if ('Query' === sequence.constructor.name) {
                console.debug(sequence.sql);
            }
        });
    });

    this.game_db_r.on('connection', function(connection) {
        connection.on('game_r enqueue', function(sequence) {
            if ('Query' === sequence.constructor.name) {
                console.debug(sequence.sql);
            }
        });
    });

    this.log_db_w.on('connection', function(connection) {
        connection.on('log_w enqueue', function(sequence) {
            if ('Query' === sequence.constructor.name) {
                console.debug(sequence.sql);
            }
        });
    });

    this.log_db_r.on('connection', function(connection) {
        connection.on('log_r enqueue', function(sequence) {
            if ('Query' === sequence.constructor.name) {
                console.debug(sequence.sql);
            }
        });
    });

    this.web_db_w.on('connection', function(connection) {
        connection.on('web_w enqueue', function(sequence) {
            if ('Query' === sequence.constructor.name) {
                console.debug(sequence.sql);
            }
        });
    });

    this.web_db_r.on('connection', function(connection) {
        connection.on('web_r enqueue', function(sequence) {
            if ('Query' === sequence.constructor.name) {
                console.debug(sequence.sql);
            }
        });
    });

    this.word_db_r.on('connection', function(connection) {
        connection.on('word_r enqueue', function(sequence) {
            if ('Query' === sequence.constructor.name) {
                console.debug(sequence.sql);
            }
        });
    });

    // this.account_db_w.on('connection',(err)=>{
    //     console.log('mysql_log_w..error >>'+err);
    // });
    //
    // this.account_db_r.on('connection',(err)=>{
    //     console.log('mysql_log_r..error >> '+err);
    // });
    //
    // this.log_db_w.on('connection',(err)=>{
    //     console.log('mysql_log_w..error  >>'+err);
    // });
    //
    // this.log_db_r.on('connection',(err)=>{
    //     console.log('mysql_log_r..error >>' + err);
    // });
    //
    // this.game_db_r.on('connection',(err)=>{
    //     console.log('mysql_game_r..error >>' + err);
    // });
    //
    // this.game_db_w.on('connection',(err)=>{
    //     console.log('mysql_game_w..error >>' + err);
    // });
}

CMysql.prototype.on_enqueue = function(){
    this.log_db_w.on('enqueue',(err)=>{
        console.log('mysql_log_w..enqueue..error : '+err);
    });
    
    this.log_db_r.on('enqueue',(err)=>{
        console.log('mysql_log_r..enqueue..error : '+err);
    });

    this.game_db_r.on('enqueue',(err)=>{
        console.log('mysql_game_r.enqueue.error >>' + err);
    });

    this.game_db_w.on('enqueue',(err)=>{
        console.log('mysql_game_w.enqueue.error >>' + err);
    });
}

CMysql.prototype.getLogWrite = function(){
    return this.log_db_w;
}

CMysql.prototype.getLogRead = function(){
    return this.log_db_r;
}

CMysql.prototype.getAccountRead = function(){
    return this.account_db_r;
}

CMysql.prototype.getAccountWrite = function(){
    return this.account_db_w;
}

CMysql.prototype.getGameWrite = function(){
    return this.game_db_w;
}

CMysql.prototype.getGameRead = function(){
    return this.game_db_r;
}

CMysql.prototype.getWebWrite = function(){
    return this.web_db_w;
}

CMysql.prototype.getWebRead = function(){
    return this.web_db_r;
}

CMysql.prototype.getWordRead = function(){
    return this.word_db_r;
}


CMysql.prototype.getRankingWrite = function(){
    return this.ranking_db_w;
}

CMysql.prototype.getRankingRead = function(){
    return this.ranking_db_r;
}



let g_mysql = new CMysql();
module.exports = g_mysql;







