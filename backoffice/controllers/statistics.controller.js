const
    Sequelize = require('sequelize'),
    config = require(__dirname + '/../config/config.json'),
    models = require(__dirname + '/../models'),
    ResponseCode = require(__dirname + '/../classes/response_code'),
    Validator = require(__dirname + '/../classes/validator'),
    Pagination = require(__dirname + '/../classes/pagination'),
    Op = Sequelize.Op,
    fs = require('fs');

    Users = models.Users;


const StatisticsController = {
    getLoginStatistics(req, res) {
        /* 2019.06.25 log_login 으로 로그 테이블 변경 적용
        console.log(`[StatisticsController.getLoginStatistics] req.query: %j`, req.query);

        models.sequelizes.LogDB.query (' show tables like :range ', {
            replacements: {range: 'TbLog_'+req.query.range+'%'}
            , type: models.Sequelize.QueryTypes.SELECT
            , raw:true})
        .then(tableList=>{
            //console.log('what the... %j', tableList);
            let genSql = ''
               ,splitArr = []
               ,tableName = '';
            for(var i in tableList ) {
                //console.log('%j', tableList[i]["Tables_in_LogDB (TbLog_"+req.query.range+"%)"]);

                tableName = tableList[i]["Tables_in_LogDB (TbLog_"+req.query.range+"%)"];
                splitArr = String(tableName).split("_");
                if( splitArr[1] == '20190307' || splitArr[1] == '20190308' ) continue;
                if( genSql != "" ) genSql += " union all "
                genSql +=  "select '"+splitArr[1]+"' as date_day,  msg1 as browser, count(*) as cnt  from "+tableName+" where LogIdx=10001 group by msg1";
            }

            //console.log(genSql);
            return models.sequelizes.LogDB.query (genSql, {
                type: models.Sequelize.QueryTypes.SELECT
                , raw:true})
           
        })
        .then(logList=>{
            //날짜별로 데이터 묶어주기
            let rs = {};
            for(var i in logList) {
                the_date = String(logList[i].date_day);
                browser = String(logList[i].browser) == "null" ? 'etc' : String(logList[i].browser);
                rs[the_date] = { ...rs[the_date] , [browser]: logList[i].cnt };
                console.log(i+': %j', browser);
            }

            let ResResult={};
            ResResult.logList = rs;

            res.jsonp({...ResponseCode.OK, result: ResResult});
        })
        .catch(error=>{ 
            console.log('Catch:: %j', error);
            res.jsonp(ResponseCode.SQLERROR); }
        );
        */
       console.log(`[StatisticsController.getLoginStatistics] req.query: %j`, req.query);

    },

    /**
     * 신규 회원 통계 
     */
    getMonthlyNewUserStat(req,res) {
        console.log(`[StatisticsController.getMonthlyNewUserStat] req.query: %j`, req.query);
        _year = req.query.year;
        _yearEmp = req.query.year+'%';

        let _sql= "SELECT "
                    +"    ym_list.ym AS m, ifnull(stat.cnt,0) as cnt "
                    +" FROM "
                    +"    (SELECT "
                    +"        DATE_FORMAT(CONCAT(y, a, '01'), '%Y-%m') ym "
                    +"    FROM "
                    +"        (SELECT '01' a "
                    +"            UNION ALL SELECT '02' "
                    +"            UNION ALL SELECT '03' "
                    +"            UNION ALL SELECT '04' "
                    +"            UNION ALL SELECT '05' "
                    +"            UNION ALL SELECT '06' "
                    +"            UNION ALL SELECT '07' "
                    +"            UNION ALL SELECT '08' "
                    +"            UNION ALL SELECT '09' "
                    +"            UNION ALL SELECT '10' "
                    +"            UNION ALL SELECT '11' "
                    +"            UNION ALL SELECT '12') a, (SELECT ? y) d "
                    +"    ORDER BY ym) ym_list "
                    +"        LEFT OUTER JOIN "
                    +"    (SELECT "
                    +"        DATE_FORMAT(created_at, '%Y-%m') ym, COUNT(*) AS cnt "
                    +"    FROM "
                    +"        Users "
                    +"    WHERE "
                    +"        created_at LIKE ? "
                    +"    GROUP BY ym) AS stat ON ym_list.ym = stat.ym "
                   +" ORDER BY m "

        models.sequelizes.AccountDB.query(_sql, {
            replacements: [_year, _yearEmp],
            type: models.Sequelize.QueryTypes.SELECT,
            raw:true
        })
        .then(monthlyNewUserStat=>{
            res.jsonp({...ResponseCode.OK, result: monthlyNewUserStat})
        })
    },

    getDailyNewUserStat(req,res) {
        console.log(`[StatisticsController.getDailyNewUserStat] req.query: %j`, req.query);
        let dateArr = String(req.query.yearmonth).split('-');
        let _year = dateArr[0];
        let _yearmonth = req.query.yearmonth+'%';

        let _sql= "SELECT "
                    +"    target_cal.m AS m, ifnull(stat.cnt,0) as cnt "
                    +"FROM "
                    +"    (SELECT "
                    +"        ymd AS m "
                    +"    FROM "
                    +"        (SELECT "
                    +"        WEEK(dt) w, "
                    +"            DATE_FORMAT(dt, '%Y-%m-%d') ymd, "
                    +"            DATE_FORMAT(dt, '%Y%m') ym, "
                    +"            DAY(dt) d, "
                    +"            DATE_FORMAT(dt, '%d') zerofilld, "
                    +"            DAYOFWEEK(dt) dw "
                    +"    FROM "
                    +"        (SELECT "
                    +"        CONCAT(y, '0101') + INTERVAL a * 100 + b * 10 + c DAY dt "
                    +"    FROM "
                    +"        (SELECT 0 a UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3) a, "
                    +"        (SELECT 0 b "
                    +"            UNION ALL SELECT 1 "
                    +"            UNION ALL SELECT 2 "
                    +"            UNION ALL SELECT 3 "
                    +"            UNION ALL SELECT 4 "
                    +"            UNION ALL SELECT 5 "
                    +"            UNION ALL SELECT 6 "
                    +"            UNION ALL SELECT 7 "
                    +"            UNION ALL SELECT 8 "
                    +"            UNION ALL SELECT 9) b, "
                    +"        (SELECT 0 c "
                    +"            UNION ALL SELECT 1 "
                    +"            UNION ALL SELECT 2 "
                    +"            UNION ALL SELECT 3 "
                    +"            UNION ALL SELECT 4 "
                    +"            UNION ALL SELECT 5 "
                    +"            UNION ALL SELECT 6 "
                    +"            UNION ALL SELECT 7 "
                    +"            UNION ALL SELECT 8 "
                    +"            UNION ALL SELECT 9) c, "
                    +"        (SELECT ? y) d "
                    +"    WHERE "
                    +"        a * 100 + b * 10 + c < DAYOFYEAR(CONCAT(y, '1231'))) a "
                    +"    ORDER BY ym , d) AS cal "
                    +"    WHERE "
                    +"        ymd LIKE ?) AS target_cal "
                    +"        LEFT OUTER JOIN "
                    +"    (SELECT "
                    +"        DATE_FORMAT(created_at, '%Y-%m-%d') m, COUNT(*) AS cnt "
                    +"    FROM "
                    +"        Users "
                    +"    WHERE "
                    +"        created_at LIKE ? "
                    +"    GROUP BY m) AS stat ON target_cal.m = stat.m "
                    +"ORDER BY m "

        models.sequelizes.AccountDB.query(_sql, {
            replacements: [_year, _yearmonth, _yearmonth],
            type: models.Sequelize.QueryTypes.SELECT,
            raw:true
        })
        .then(monthlyNewUserStat=>{
            res.jsonp({...ResponseCode.OK, result: monthlyNewUserStat})
        })
    },    

    getWeeklyNewUserStat(req,res) {
        console.log(`[StatisticsController.getWeeklyNewUserStat] req.query: %j`, req.query);
        let dateArr = String(req.query.start_date).split('-');
        _week = req.query.week;
        _start = req.query.start_date+' 00:00:00';
        _end = req.query.end_date+' 23:59:59';
        
        _year = dateArr[0];

        let _sql= "SELECT "
                    +"    target_cal.m AS m, ifnull(stat.cnt,0) as cnt "
                    +"FROM "
                    +"    (SELECT "
                    +"        ymd AS m "
                    +"    FROM "
                    +"        (SELECT "
                    +"        WEEK(dt) w, "
                    +"            DATE_FORMAT(dt, '%Y-%m-%d') ymd, "
                    +"            DATE_FORMAT(dt, '%Y%m') ym, "
                    +"            DAY(dt) d, "
                    +"            DATE_FORMAT(dt, '%d') zerofilld, "
                    +"            DAYOFWEEK(dt) dw "
                    +"    FROM "
                    +"        (SELECT "
                    +"        CONCAT(y, '0101') + INTERVAL a * 100 + b * 10 + c DAY dt "
                    +"    FROM "
                    +"        (SELECT 0 a UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3) a, "
                    +"        (SELECT 0 b "
                    +"            UNION ALL SELECT 1 "
                    +"            UNION ALL SELECT 2 "
                    +"            UNION ALL SELECT 3 "
                    +"            UNION ALL SELECT 4 "
                    +"            UNION ALL SELECT 5 "
                    +"            UNION ALL SELECT 6 "
                    +"            UNION ALL SELECT 7 "
                    +"            UNION ALL SELECT 8 "
                    +"            UNION ALL SELECT 9) b, "
                    +"        (SELECT 0 c "
                    +"            UNION ALL SELECT 1 "
                    +"            UNION ALL SELECT 2 "
                    +"            UNION ALL SELECT 3 "
                    +"            UNION ALL SELECT 4 "
                    +"            UNION ALL SELECT 5 "
                    +"            UNION ALL SELECT 6 "
                    +"            UNION ALL SELECT 7 "
                    +"            UNION ALL SELECT 8 "
                    +"            UNION ALL SELECT 9) c, "
                    +"        (SELECT ? y) d "
//                    +"    WHERE "
//                    +"        a * 100 + b * 10 + c < DAYOFYEAR(CONCAT(y, '1231')) "
                    +" ) a "
//                    +"    ORDER BY ym , d"
                    +" ) AS cal "
                    +"    WHERE "
                    +"        w = ? ) AS target_cal "
                    +"        LEFT OUTER JOIN "
                    +"    (SELECT "
                    +"        DATE_FORMAT(created_at, '%Y-%m-%d') m, COUNT(*) AS cnt "
                    +"    FROM "
                    +"        Users "
                    +"    WHERE "
                    +"        created_at between ? and ? "
                    +"    GROUP BY m) AS stat ON target_cal.m = stat.m "
                    +"ORDER BY m "

                    models.sequelizes.AccountDB.query(_sql, {
                        replacements: [_year, _week, _start, _end],
                        type: models.Sequelize.QueryTypes.SELECT,
                        raw:true
                    })
                    .then(weeklyNewUserStat=>{
                        res.jsonp({...ResponseCode.OK, result: weeklyNewUserStat})
                    })
    },


    /**
     * 총 누적회원
     */
    getTotalMemberCount(req, res) {
        console.log(`[StatisticsController.getTotalMemberCount] req.query: %j`, req.query);

        Users.findAll({
            attributes: [[models.sequelizes.AccountDB.fn('COUNT',models.sequelizes.AccountDB.col('id')), "count"]] ,
            raw:true
        })
        .then(count=>{
            res.jsonp({...ResponseCode.OK, result: count})
        })
        
    },

    /**
     * 탈퇴 회원 통계 
     */
    getMonthlyWithdrawalUserStat(req,res) {
        console.log(`[StatisticsController.getMonthlyWithdrawalUserStat] req.query: %j`, req.query);
        _year = req.query.year;
        _yearEmp = req.query.year+'%';

        let _sql= `SELECT 
                        ym_list.ym AS m, ifnull(stat.cnt,0) as cnt 
                     FROM 
                        (SELECT 
                            DATE_FORMAT(CONCAT(y, a, '01'), '%Y-%m') ym 
                        FROM 
                            (SELECT '01' a 
                                UNION ALL SELECT '02' 
                                UNION ALL SELECT '03' 
                                UNION ALL SELECT '04' 
                                UNION ALL SELECT '05' 
                                UNION ALL SELECT '06' 
                                UNION ALL SELECT '07' 
                                UNION ALL SELECT '08' 
                                UNION ALL SELECT '09' 
                                UNION ALL SELECT '10' 
                                UNION ALL SELECT '11' 
                                UNION ALL SELECT '12') a, (SELECT ? y) d 
                        ORDER BY ym) ym_list 
                            LEFT OUTER JOIN 
                        (SELECT 
                            DATE_FORMAT(secession_date, '%Y-%m') ym, COUNT(*) AS cnt 
                        FROM 
                            log_account_regit 
                        WHERE 
                            secession_date LIKE ? and secession = 1
                        GROUP BY ym) AS stat ON ym_list.ym = stat.ym 
                    ORDER BY m `;

        models.sequelizes.LogDB.query(_sql, {
            replacements: [_year, _yearEmp],
            type: models.Sequelize.QueryTypes.SELECT,
            raw:true
        })
        .then(monthlyNewUserStat=>{
            res.jsonp({...ResponseCode.OK, result: monthlyNewUserStat})
        })
    },

    getWeeklyWithdrawalUserStat(req,res) {
        console.log(`[StatisticsController.getWeeklyWithdrawalUserStat] req.query: %j`, req.query);
        let dateArr = String(req.query.start_date).split('-');
        _week = req.query.week;
        _start = req.query.start_date+' 00:00:00';
        _end = req.query.end_date+' 23:59:59';
        
        _year = dateArr[0];

        let _sql= `SELECT 
                        target_cal.m AS m, ifnull(stat.cnt,0) as cnt 
                    FROM 
                        (SELECT 
                            ymd AS m 
                        FROM 
                            (SELECT 
                            WEEK(dt) w, 
                                DATE_FORMAT(dt, '%Y-%m-%d') ymd, 
                                DATE_FORMAT(dt, '%Y%m') ym, 
                                DAY(dt) d, 
                                DATE_FORMAT(dt, '%d') zerofilld, 
                                DAYOFWEEK(dt) dw 
                        FROM 
                            (SELECT 
                            CONCAT(y, '0101') + INTERVAL a * 100 + b * 10 + c DAY dt 
                        FROM 
                            (SELECT 0 a UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3) a, 
                            (SELECT 0 b 
                                UNION ALL SELECT 1 
                                UNION ALL SELECT 2 
                                UNION ALL SELECT 3 
                                UNION ALL SELECT 4 
                                UNION ALL SELECT 5 
                                UNION ALL SELECT 6 
                                UNION ALL SELECT 7 
                                UNION ALL SELECT 8 
                                UNION ALL SELECT 9) b, 
                            (SELECT 0 c 
                                UNION ALL SELECT 1 
                                UNION ALL SELECT 2 
                                UNION ALL SELECT 3 
                                UNION ALL SELECT 4 
                                UNION ALL SELECT 5 
                                UNION ALL SELECT 6 
                                UNION ALL SELECT 7 
                                UNION ALL SELECT 8 
                                UNION ALL SELECT 9) c, 
                            (SELECT ? y) d 
                     ) a 
                     ) AS cal 
                        WHERE 
                            w = ? ) AS target_cal 
                            LEFT OUTER JOIN 
                        (SELECT 
                            DATE_FORMAT(secession_date, '%Y-%m-%d') m, COUNT(*) AS cnt 
                        FROM 
                            log_account_regit 
                        WHERE 
                            secession_date between ? and ?  and secession = 1
                        GROUP BY m) AS stat ON target_cal.m = stat.m 
                    ORDER BY m `;

                    models.sequelizes.LogDB.query(_sql, {
                        replacements: [_year, _week, _start, _end],
                        type: models.Sequelize.QueryTypes.SELECT,
                        raw:true
                    })
                    .then(weeklyNewUserStat=>{
                        res.jsonp({...ResponseCode.OK, result: weeklyNewUserStat})
                    })
    },  
        
    getDailyWithdrawalUserStat(req,res) {
        console.log(`[StatisticsController.getDailyWithdrawalUserStat] req.query: %j`, req.query);
        let dateArr = String(req.query.yearmonth).split('-');
        let _year = dateArr[0];
        let _yearmonth = req.query.yearmonth+'%';

        let _sql= `SELECT 
                        target_cal.m AS m, ifnull(stat.cnt,0) as cnt 
                    FROM 
                        (SELECT 
                            ymd AS m 
                        FROM 
                            (SELECT 
                            WEEK(dt) w, 
                                DATE_FORMAT(dt, '%Y-%m-%d') ymd, 
                                DATE_FORMAT(dt, '%Y%m') ym, 
                                DAY(dt) d, 
                                DATE_FORMAT(dt, '%d') zerofilld, 
                                DAYOFWEEK(dt) dw 
                        FROM 
                            (SELECT 
                            CONCAT(y, '0101') + INTERVAL a * 100 + b * 10 + c DAY dt 
                        FROM 
                            (SELECT 0 a UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3) a, 
                            (SELECT 0 b 
                                UNION ALL SELECT 1 
                                UNION ALL SELECT 2 
                                UNION ALL SELECT 3 
                                UNION ALL SELECT 4 
                                UNION ALL SELECT 5 
                                UNION ALL SELECT 6 
                                UNION ALL SELECT 7 
                                UNION ALL SELECT 8 
                                UNION ALL SELECT 9) b, 
                            (SELECT 0 c 
                                UNION ALL SELECT 1 
                                UNION ALL SELECT 2 
                                UNION ALL SELECT 3 
                                UNION ALL SELECT 4 
                                UNION ALL SELECT 5 
                                UNION ALL SELECT 6 
                                UNION ALL SELECT 7 
                                UNION ALL SELECT 8 
                                UNION ALL SELECT 9) c, 
                            (SELECT ? y) d 
                        WHERE 
                            a * 100 + b * 10 + c < DAYOFYEAR(CONCAT(y, '1231'))) a 
                        ORDER BY ym , d) AS cal 
                        WHERE 
                            ymd LIKE ?) AS target_cal 
                            LEFT OUTER JOIN 
                        (SELECT 
                            DATE_FORMAT(secession_date, '%Y-%m-%d') m, COUNT(*) AS cnt 
                        FROM 
                            log_account_regit 
                        WHERE 
                            secession_date LIKE ? and secession = 1
                        GROUP BY m) AS stat ON target_cal.m = stat.m 
                    ORDER BY m `;

        models.sequelizes.LogDB.query(_sql, {
            replacements: [_year, _yearmonth, _yearmonth],
            type: models.Sequelize.QueryTypes.SELECT,
            raw:true
        })
        .then(monthlyNewUserStat=>{
            res.jsonp({...ResponseCode.OK, result: monthlyNewUserStat})
        })
    },    

  

    /** 로그인 통계 구현 */
    getDailyLoginStat(req, res) {
        console.log(`[StatisticsController.getDailyLoginStat] req.query: %j`, req.query);

        let dateArr = String(req.query.yearmonth).split('-');
        let _year = dateArr[0];
        let _yearmonth = req.query.yearmonth+'%';

        let _sql_web = `
            SELECT 
                target_cal.m,
                IFNULL(stat_data.Chrome, 0) AS Chrome,
                IFNULL(stat_data.IE, 0) AS IE,
                IFNULL(stat_data.Firefox, 0) AS Firefox,
                IFNULL(stat_data.Edge, 0) AS Edge,
                IFNULL(stat_data.Sapari, 0) AS Sapari,
                IFNULL(stat_data.Etc, 0) AS Etc,
                IFNULL(stat_data.total_count, 0) AS total_count
            FROM
                (SELECT 
                    ymd AS m
                FROM
                    (SELECT 
                    WEEK(dt) w,
                        DATE_FORMAT(dt, '%Y-%m-%d') ymd,
                        DATE_FORMAT(dt, '%Y%m') ym,
                        DAY(dt) d,
                        DATE_FORMAT(dt, '%d') zerofilld,
                        DAYOFWEEK(dt) dw
                FROM
                    (SELECT 
                    CONCAT(y, '0101') + INTERVAL a * 100 + b * 10 + c DAY dt
                FROM
                    (SELECT 0 a UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3) a, (SELECT 0 b UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) b, (SELECT 0 c UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) c, (SELECT ? y) d
                WHERE
                    a * 100 + b * 10 + c < DAYOFYEAR(CONCAT(y, '1231'))) a
                ORDER BY ym , d) AS cal
                WHERE
                    ymd LIKE ? ) AS target_cal
                    LEFT OUTER JOIN
                (SELECT 
                    month_total.m,
                        log_data.Chrome,
                        log_data.IE,
                        log_data.Firefox,
                        log_data.Edge,
                        log_data.Sapari,
                        log_data.Etc,
                        month_total.count AS total_count
                FROM
                    (SELECT 
                    log.m, COUNT(idx) AS count
                FROM
                    (SELECT 
                    *, DATE_FORMAT(regit_date, '%Y-%m-%d') m
                FROM
                    log_login
                WHERE
                    regit_date LIKE ? ) AS log
                GROUP BY m
                ORDER BY m) AS month_total
                LEFT OUTER JOIN (SELECT 
                    ld.m,
                        SUM(IF(ld.browser = 1, ld.count, 0)) AS Chrome,
                        SUM(IF(ld.browser = 2, ld.count, 0)) AS IE,
                        SUM(IF(ld.browser = 3, ld.count, 0)) AS Firefox,
                        SUM(IF(ld.browser = 4, ld.count, 0)) AS Edge,
                        SUM(IF(ld.browser = 5, ld.count, 0)) AS Sapari,
                        SUM(IF(ld.browser = 0, ld.count, 0)) AS Etc
                FROM
                    (SELECT 
                    log.m, log.browser, COUNT(idx) AS count
                FROM
                    (SELECT 
                    *, DATE_FORMAT(regit_date, '%Y-%m-%d') m
                FROM
                    log_login
                WHERE
                    regit_date LIKE ? ) AS log
                GROUP BY m , browser) AS ld
                GROUP BY m) AS log_data ON month_total.m = log_data.m) AS stat_data ON target_cal.m = stat_data.m
            ORDER BY m        
        `;

        let _sql_mobile = `
            SELECT
                target_cal.m,
                IFNULL(stat_data.PC, 0) AS PC,
                IFNULL(stat_data.Android, 0) AS Android,
                IFNULL(stat_data.IOS, 0) AS IOS,
                IFNULL(stat_data.Etc, 0) AS Etc,
                IFNULL(stat_data.total_count, 0) AS total_count
            FROM
                (SELECT
                    ymd AS m
                FROM
                    (SELECT
                    WEEK(dt) w,
                        DATE_FORMAT(dt, '%Y-%m-%d') ymd,
                        DATE_FORMAT(dt, '%Y%m') ym,
                        DAY(dt) d,
                        DATE_FORMAT(dt, '%d') zerofilld,
                        DAYOFWEEK(dt) dw
                FROM
                    (SELECT
                    CONCAT(y, '0101') + INTERVAL a * 100 + b * 10 + c DAY dt
                FROM
                    (SELECT 0 a UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3) a, (SELECT 0 b UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) b, (SELECT 0 c UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) c, (SELECT ? y) d
                WHERE
                    a * 100 + b * 10 + c < DAYOFYEAR(CONCAT(y, '1231'))) a
                ORDER BY ym , d) AS cal
                WHERE
                    ymd LIKE ? ) AS target_cal
                    LEFT OUTER JOIN
                (SELECT
                    month_total.m,
                        log_data.PC,
                        log_data.Android,
                        log_data.IOS,
                        log_data.Etc,
                        month_total.count AS total_count
                FROM
                    (SELECT
                    log.m, COUNT(idx) AS count
                FROM
                    (SELECT
                    *, DATE_FORMAT(regit_date, '%Y-%m-%d') m
                FROM
                    log_login
                WHERE
                    regit_date LIKE ? ) AS log
                GROUP BY m
                ORDER BY m) AS month_total
                LEFT OUTER JOIN (SELECT
                    ld.m,
                        SUM(IF(ld.os = 1, ld.count, 0)) AS PC,
                        SUM(IF(ld.os = 2, ld.count, 0)) AS Android,
                        SUM(IF(ld.os = 3, ld.count, 0)) AS IOS,
                        SUM(IF(ld.os = 0, ld.count, 0)) AS Etc
                FROM
                    (SELECT
                    log.m, log.os, COUNT(idx) AS count
                FROM
                    (SELECT
                    *, DATE_FORMAT(regit_date, '%Y-%m-%d') m
                FROM
                    log_login
                WHERE
                    regit_date LIKE ? ) AS log
                GROUP BY m , os) AS ld
                GROUP BY m) AS log_data ON month_total.m = log_data.m) AS stat_data ON target_cal.m = stat_data.m
            ORDER BY m
        `;        
        Promise.all([
            models.sequelizes.LogDB.query(_sql_web, {
                replacements: [_year, _yearmonth, _yearmonth,_yearmonth],
                type: models.Sequelize.QueryTypes.SELECT,
                raw:true
            }),
            models.sequelizes.LogDB.query(_sql_mobile, {
                replacements: [_year, _yearmonth, _yearmonth,_yearmonth],
                type: models.Sequelize.QueryTypes.SELECT,
                raw:true
            }),
        ])
        .then((statLog)=>{
            let ResResult={};
            ResResult.webLog = statLog[0];
            ResResult.mobileLog = statLog[1];

            res.jsonp({...ResponseCode.OK, result: ResResult})
        })

    },
    getWeeklyLoginStat(req, res) {
        console.log(`[StatisticsController.getWeeklyLoginStat] req.query: %j`, req.query);
        let dateArr = String(req.query.start_date).split('-');
        _week = req.query.week;
        _start = req.query.start_date+' 00:00:00';
        _end = req.query.end_date+' 23:59:59';
        
        _year = dateArr[0];        

        let _sql_web = `
            SELECT 
                target_cal.m,
                IFNULL(stat_data.Chrome, 0) AS Chrome,
                IFNULL(stat_data.IE, 0) AS IE,
                IFNULL(stat_data.Firefox, 0) AS Firefox,
                IFNULL(stat_data.Edge, 0) AS Edge,
                IFNULL(stat_data.Sapari, 0) AS Sapari,
                IFNULL(stat_data.Etc, 0) AS Etc,
                IFNULL(stat_data.total_count, 0) AS total_count
            FROM
                (SELECT 
                    ymd AS m
                FROM
                    (SELECT
                        WEEK(dt) w,
                            DATE_FORMAT(dt, '%Y-%m-%d') ymd,
                            DATE_FORMAT(dt, '%Y%m') ym,
                            DAY(dt) d,
                            DATE_FORMAT(dt, '%d') zerofilld,
                            DAYOFWEEK(dt) dw
                    FROM
                        (SELECT 
            CONCAT(y, '0101') + INTERVAL a * 100 + b * 10 + c DAY dt
            FROM
            (SELECT 0 a UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3) a, (SELECT 0 b UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) b, (SELECT 0 c UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) c, (SELECT ? y) d) a) AS cal
            WHERE
            w = ? ) AS target_cal
                    LEFT OUTER JOIN
                (SELECT 
                    month_total.m,
                        log_data.Chrome,
                        log_data.IE,
                        log_data.Firefox,
                        log_data.Edge,
                        log_data.Sapari,
                        log_data.Etc,
                        month_total.count AS total_count
                FROM
                    (SELECT 
                    log.m, COUNT(idx) AS count
                FROM
                    (SELECT 
                    *, DATE_FORMAT(regit_date, '%Y-%m-%d') m
                FROM
                    log_login
                WHERE
                    regit_date BETWEEN ? AND ? ) AS log
                GROUP BY m
                ORDER BY m) AS month_total
                LEFT OUTER JOIN (SELECT 
                    ld.m,
                        SUM(IF(ld.browser = 1, ld.count, 0)) AS Chrome,
                        SUM(IF(ld.browser = 2, ld.count, 0)) AS IE,
                        SUM(IF(ld.browser = 3, ld.count, 0)) AS Firefox,
                        SUM(IF(ld.browser = 4, ld.count, 0)) AS Edge,
                        SUM(IF(ld.browser = 5, ld.count, 0)) AS Sapari,
                        SUM(IF(ld.browser = 0, ld.count, 0)) AS Etc
                FROM
                    (SELECT 
                    log.m, log.browser, COUNT(idx) AS count
                FROM
                    (SELECT 
                    *, DATE_FORMAT(regit_date, '%Y-%m-%d') m
                FROM
                    log_login
                WHERE
                    regit_date BETWEEN ? AND ? ) AS log
                GROUP BY m , browser) AS ld
                GROUP BY m) AS log_data ON month_total.m = log_data.m) AS stat_data ON target_cal.m = stat_data.m
            ORDER BY m        
        `;

        let _sql_mobile = `
            SELECT
                target_cal.m,
                IFNULL(stat_data.PC, 0) AS PC,
                IFNULL(stat_data.Android, 0) AS Android,
                IFNULL(stat_data.IOS, 0) AS IOS,
                IFNULL(stat_data.Etc, 0) AS Etc,
                IFNULL(stat_data.total_count, 0) AS total_count
            FROM
                    (SELECT
                        ymd AS m
                    FROM
                        (SELECT
                        WEEK(dt) w,
                            DATE_FORMAT(dt, '%Y-%m-%d') ymd,
                            DATE_FORMAT(dt, '%Y%m') ym,
                            DAY(dt) d,
                            DATE_FORMAT(dt, '%d') zerofilld,
                            DAYOFWEEK(dt) dw
                    FROM
                        (SELECT 
            CONCAT(y, '0101') + INTERVAL a * 100 + b * 10 + c DAY dt
            FROM
            (SELECT 0 a UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3) a, (SELECT 0 b UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) b, (SELECT 0 c UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) c, (SELECT ? y) d) a) AS cal
            WHERE
            w = ? ) AS target_cal
                    LEFT OUTER JOIN
                (SELECT
                    month_total.m,
                        log_data.PC,
                        log_data.Android,
                        log_data.IOS,
                        log_data.Etc,
                        month_total.count AS total_count
                FROM
                    (SELECT
                    log.m, COUNT(idx) AS count
                FROM
                    (SELECT
                    *, DATE_FORMAT(regit_date, '%Y-%m-%d') m
                FROM
                    log_login
                WHERE
                    regit_date BETWEEN ? AND ?  ) AS log
                GROUP BY m
                ORDER BY m) AS month_total
                LEFT OUTER JOIN (SELECT
                    ld.m,
                        SUM(IF(ld.os = 1, ld.count, 0)) AS PC,
                        SUM(IF(ld.os = 2, ld.count, 0)) AS Android,
                        SUM(IF(ld.os = 3, ld.count, 0)) AS IOS,
                        SUM(IF(ld.os = 0, ld.count, 0)) AS Etc
                FROM
                    (SELECT
                    log.m, log.os, COUNT(idx) AS count
                FROM
                    (SELECT
                    *, DATE_FORMAT(regit_date, '%Y-%m-%d') m
                FROM
                    log_login
                WHERE
                    regit_date BETWEEN ? AND ?  ) AS log
                GROUP BY m , os) AS ld
                GROUP BY m) AS log_data ON month_total.m = log_data.m) AS stat_data ON target_cal.m = stat_data.m
            ORDER BY m
        `;        
        Promise.all([
            models.sequelizes.LogDB.query(_sql_web, {
                replacements: [_year, _week, _start, _end, _start, _end],
                type: models.Sequelize.QueryTypes.SELECT,
                raw:true
            }),
            models.sequelizes.LogDB.query(_sql_mobile, {
                replacements: [_year, _week, _start, _end, _start, _end],
                type: models.Sequelize.QueryTypes.SELECT,
                raw:true
            }),
        ])
        .then((statLog)=>{
            let ResResult={};
            ResResult.webLog = statLog[0];
            ResResult.mobileLog = statLog[1];

            res.jsonp({...ResponseCode.OK, result: ResResult})
        })        
    },
    getMonthlyLoginStat(req, res) {
        console.log(`[StatisticsController.getMonthlyLoginStat] req.query: %j`, req.query);        

        _year = req.query.year;
        _yearEmp = req.query.year+'%';

        let _sql_web = `
            SELECT 
                target_cal.m,
                IFNULL(stat_data.Chrome, 0) AS Chrome,
                IFNULL(stat_data.IE, 0) AS IE,
                IFNULL(stat_data.Firefox, 0) AS Firefox,
                IFNULL(stat_data.Edge, 0) AS Edge,
                IFNULL(stat_data.Sapari, 0) AS Sapari,
                IFNULL(stat_data.Etc, 0) AS Etc,
                IFNULL(stat_data.total_count, 0) AS total_count
            FROM
                (SELECT 
                    DATE_FORMAT(CONCAT(y, a, '01'), '%Y-%m') as m
                FROM
                    (SELECT '01' a UNION ALL SELECT '02' UNION ALL SELECT '03' UNION ALL SELECT '04' UNION ALL SELECT '05' UNION ALL SELECT '06' UNION ALL SELECT '07' UNION ALL SELECT '08' UNION ALL SELECT '09' UNION ALL SELECT '10' UNION ALL SELECT '11' UNION ALL SELECT '12') a, (SELECT ? y) d
                ORDER BY m ) AS target_cal
                    LEFT OUTER JOIN
                (SELECT 
                    month_total.m,
                        log_data.Chrome,
                        log_data.IE,
                        log_data.Firefox,
                        log_data.Edge,
                        log_data.Sapari,
                        log_data.Etc,
                        month_total.count AS total_count
                FROM
                    (SELECT 
                    log.m, COUNT(idx) AS count
                FROM
                    (SELECT 
                    *, DATE_FORMAT(regit_date, '%Y-%m') m
                FROM
                    log_login
                WHERE
                    regit_date LIKE ? ) AS log
                GROUP BY m
                ORDER BY m) AS month_total
                LEFT OUTER JOIN (SELECT 
                    ld.m,
                        SUM(IF(ld.browser = 1, ld.count, 0)) AS Chrome,
                        SUM(IF(ld.browser = 2, ld.count, 0)) AS IE,
                        SUM(IF(ld.browser = 3, ld.count, 0)) AS Firefox,
                        SUM(IF(ld.browser = 4, ld.count, 0)) AS Edge,
                        SUM(IF(ld.browser = 5, ld.count, 0)) AS Sapari,
                        SUM(IF(ld.browser = 0, ld.count, 0)) AS Etc
                FROM
                    (SELECT 
                    log.m, log.browser, COUNT(idx) AS count
                FROM
                    (SELECT 
                    *, DATE_FORMAT(regit_date, '%Y-%m') m
                FROM
                    log_login
                WHERE
                    regit_date LIKE ? ) AS log
                GROUP BY m , browser) AS ld
                GROUP BY m) AS log_data ON month_total.m = log_data.m) AS stat_data ON target_cal.m = stat_data.m
            ORDER BY m        
        `;

        let _sql_mobile = `
            SELECT
                target_cal.m,
                IFNULL(stat_data.PC, 0) AS PC,
                IFNULL(stat_data.Android, 0) AS Android,
                IFNULL(stat_data.IOS, 0) AS IOS,
                IFNULL(stat_data.Etc, 0) AS Etc,
                IFNULL(stat_data.total_count, 0) AS total_count
            FROM
                    (SELECT 
                        DATE_FORMAT(CONCAT(y, a, '01'), '%Y-%m') as m
                    FROM
                        (SELECT '01' a UNION ALL SELECT '02' UNION ALL SELECT '03' UNION ALL SELECT '04' UNION ALL SELECT '05' UNION ALL SELECT '06' UNION ALL SELECT '07' UNION ALL SELECT '08' UNION ALL SELECT '09' UNION ALL SELECT '10' UNION ALL SELECT '11' UNION ALL SELECT '12') a, (SELECT ? y) d
                    ORDER BY m ) AS target_cal
                    LEFT OUTER JOIN
                (SELECT
                    month_total.m,
                        log_data.PC,
                        log_data.Android,
                        log_data.IOS,
                        log_data.Etc,
                        month_total.count AS total_count
                FROM
                    (SELECT
                    log.m, COUNT(idx) AS count
                FROM
                    (SELECT
                    *, DATE_FORMAT(regit_date, '%Y-%m') m
                FROM
                    log_login
                WHERE
                    regit_date LIKE ?  ) AS log
                GROUP BY m
                ORDER BY m) AS month_total
                LEFT OUTER JOIN (SELECT
                    ld.m,
                        SUM(IF(ld.os = 1, ld.count, 0)) AS PC,
                        SUM(IF(ld.os = 2, ld.count, 0)) AS Android,
                        SUM(IF(ld.os = 3, ld.count, 0)) AS IOS,
                        SUM(IF(ld.os = 0, ld.count, 0)) AS Etc
                FROM
                    (SELECT
                    log.m, log.os, COUNT(idx) AS count
                FROM
                    (SELECT
                    *, DATE_FORMAT(regit_date, '%Y-%m') m
                FROM
                    log_login
                WHERE
                    regit_date LIKE ?  ) AS log
                GROUP BY m , os) AS ld
                GROUP BY m) AS log_data ON month_total.m = log_data.m) AS stat_data ON target_cal.m = stat_data.m
            ORDER BY m
        `;        
        Promise.all([
            models.sequelizes.LogDB.query(_sql_web, {
                replacements: [_year, _yearEmp, _yearEmp],
                type: models.Sequelize.QueryTypes.SELECT,
                raw:true
            }),
            models.sequelizes.LogDB.query(_sql_mobile, {
                replacements: [_year, _yearEmp, _yearEmp],
                type: models.Sequelize.QueryTypes.SELECT,
                raw:true
            }),
        ])
        .then((statLog)=>{
            let ResResult={};
            ResResult.webLog = statLog[0];
            ResResult.mobileLog = statLog[1];

            res.jsonp({...ResponseCode.OK, result: ResResult})
        })         
    } ,


    getStatByMenu(req, res) {
        console.log(`[StatisticsController.getStatByMenu] req.query: %j`, req.query); 

        const
            validator = new Validator([
                { name: 'type', required: true },
                { name: 'yearmonth', required: true },
            ]),
            result = validator.validate(req.query);

        if (result !== true) {
            return res.jsonp(ResponseCode.INVALID_PARAMETERS);
        }

        let dateArr = String(req.query.yearmonth).split('-');
        let _year = dateArr[0];
        let _month = dateArr[1];
        let _yearmonth = req.query.yearmonth;
        let _day = req.query.day ? req.query.day : '';        
        let _hour = req.query.hour ? req.query.hour : '';        
        let _week = req.query.week ? req.query.week : '';
        let _start = req.query.start_date ? req.query.start_date+' 00:00:00' : '';
        let _end = req.query.end_date ? req.query.end_date+' 23:59:59' : '';        

        // case 절로 type 에 따라서..  where 상세 조건을 달리 한다.
        let _range_sql;
        let _replacement= [];
        
        switch(req.query.type) {
            case 'hourly': 
                _range_sql = " LIKE ? ";
                _replacement = [_yearmonth+'-'+_day+' '+_hour+'%',_yearmonth+'-'+_day+' '+_hour+'%',_yearmonth+'-'+_day+' '+_hour+'%',_yearmonth+'-'+_day+' '+_hour+'%'];            
                break;
            case 'daily': 
                _range_sql = " LIKE ? ";
                _replacement = [_yearmonth+'-'+_day+'%',_yearmonth+'-'+_day+'%',_yearmonth+'-'+_day+'%',_yearmonth+'-'+_day+'%'];
                break;
            case 'weekly': 
                _range_sql = " BETWEEN ? and ?  ";
                _replacement = [_start,_end,_start,_end,_start,_end,_start,_end];            
                break;
            case 'monthly':  
                _range_sql = " LIKE ? ";
                _replacement = [_yearmonth+'%',_yearmonth+'%',_yearmonth+'%',_yearmonth+'%'];               
                break;
            default : 
        }

        let _sql = `
        SELECT 
            menu.menu,
            menu.menu_name,
            IFNULL(uv_log_data.uv, 0) AS uv_cnt,
            IFNULL(pv_log_data.pv, 0) AS pv_cnt,
            IFNULL(uv_log_nl_data.nl_uv, 0) AS uv_nl_cnt,
            IFNULL(pv_log_nl_data.nl_pv, 0) AS pv_nl_cnt
        FROM
            ((SELECT 
                menu, menu_name
            FROM
                (
                    SELECT 1 AS menu, '자리연습' AS menu_name 
                    UNION ALL SELECT 2 AS menu, '낱말연습' AS menu_name 
                    UNION ALL SELECT 3 AS menu, '짧은글연습' AS menu_name 
                    UNION ALL SELECT 4 AS menu, '긴글연습' AS menu_name 
                    UNION ALL SELECT 5 AS menu, '두더지잡기' AS menu_name 
                    UNION ALL SELECT 6 AS menu, '동전쌓기' AS menu_name 
                    UNION ALL SELECT 7 AS menu, '판뒤집기' AS menu_name 
                    UNION ALL SELECT 8 AS menu, '랭킹 타자' AS menu_name 
                    UNION ALL SELECT 9 AS menu, '랭킹 두더지' AS menu_name 
                    UNION ALL SELECT 10 AS menu, '랭킹 동전쌓기' AS menu_name 
                    UNION ALL SELECT 11 AS menu, '랭킹 판뒤집기' AS menu_name 
                    UNION ALL SELECT 0 AS menu, '로그인' AS menu_name                    
                ) AS menu_group) AS menu
            LEFT OUTER JOIN (SELECT 
                MIN(rd.menu) AS menu, COUNT(*) AS uv
            FROM
                (SELECT 
                MIN(menu) AS menu,
                    MIN(uuid) AS uuid
            FROM
                log_menu_using
            WHERE
                access_date `+_range_sql+`
                    AND menu >= 0
                    AND menu <= 11
            GROUP BY menu , uuid) AS rd
            GROUP BY rd.menu) AS uv_log_data ON menu.menu = uv_log_data.menu
            LEFT OUTER JOIN (SELECT 
                MIN(menu) AS menu, COUNT(*) AS pv
            FROM
                log_menu_using
            WHERE
                access_date `+_range_sql+`
                    AND menu >= 0
                    AND menu <= 11
            GROUP BY menu) AS pv_log_data ON menu.menu = pv_log_data.menu
            LEFT OUTER JOIN (SELECT
                MIN(rd.menu) AS menu, COUNT(*) AS nl_uv
            FROM
                (SELECT
                MIN(menu) AS menu,
                    MIN(uuid) AS uuid
            FROM
                log_menu_using
            WHERE
                access_date  `+_range_sql+`
                    AND menu >= 0
                    AND menu <= 11
                    AND uuid = 0
            GROUP BY menu , uuid, nickname) AS rd
            GROUP BY rd.menu) AS uv_log_nl_data ON menu.menu = uv_log_nl_data.menu
            LEFT OUTER JOIN (SELECT
                MIN(menu) AS menu, COUNT(*) AS nl_pv
            FROM
                log_menu_using
            WHERE
                access_date  `+_range_sql+`
                    AND menu >= 0
                    AND menu <= 11
                    AND uuid = 0
            GROUP BY menu, uuid) AS pv_log_nl_data ON menu.menu = pv_log_nl_data.menu    
            )        
        `;
        
        models.sequelizes.LogDB.query(_sql, {
            replacements: _replacement,
            type: models.Sequelize.QueryTypes.SELECT,
            raw:true
        })
        .then(response=>{
            res.jsonp({...ResponseCode.OK, result: response});
        });

        

    },


    /** DAU/MAU 통계 구현 */
    getDAUStat(req, res) {
        console.log(`[StatisticsController.getDAUStat] req.query: %j`, req.query);

        let dateArr = String(req.query.yearmonth).split('-');
        let _year = dateArr[0];
        let _yearmonth = req.query.yearmonth+'%';

        let _sql_dau = `
        SELECT 
            target_cal.m, IFNULL(stat_data.dau_count, 0) AS dau_count
        FROM
            (SELECT 
                ymd AS m
            FROM
                (SELECT 
                WEEK(dt) w,
                    DATE_FORMAT(dt, '%Y-%m-%d') ymd,
                    DATE_FORMAT(dt, '%Y%m') ym,
                    DAY(dt) d,
                    DATE_FORMAT(dt, '%d') zerofilld,
                    DAYOFWEEK(dt) dw
            FROM
                (SELECT 
                CONCAT(y, '0101') + INTERVAL a * 100 + b * 10 + c DAY dt
            FROM
                (SELECT 0 a UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3) a, (SELECT 0 b UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) b, (SELECT 0 c UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) c, (SELECT ? y) d
            WHERE
                a * 100 + b * 10 + c < DAYOFYEAR(CONCAT(y, '1231'))) a
            ORDER BY ym , d) AS cal
            WHERE
                ymd LIKE ? ) AS target_cal
                LEFT OUTER JOIN
            (SELECT 
                ld.m, COUNT(ld.uuid) AS dau_count
            FROM
                (SELECT 
                log.m, log.uuid, COUNT(idx) AS count
            FROM
                (SELECT 
                *, DATE_FORMAT(regit_date, '%Y-%m-%d') m
            FROM
                log_login
            WHERE
                regit_date LIKE ? ) AS log
            GROUP BY m , uuid) AS ld
            GROUP BY m) AS stat_data ON target_cal.m = stat_data.m
        ORDER BY m       
        `;

        models.sequelizes.LogDB.query(_sql_dau, {
            replacements: [_year, _yearmonth, _yearmonth],
            type: models.Sequelize.QueryTypes.SELECT,
            raw:true
        })
        .then((dauLog)=>{
            let ResResult={};
            ResResult.dauLog = dauLog;

            res.jsonp({...ResponseCode.OK, result: ResResult})
        })

    },

    getMAUStat(req, res) {
        console.log(`[StatisticsController.getMonthlyLoginStat] req.query: %j`, req.query);        

        _year = req.query.year;
        _yearEmp = req.query.year+'%';

        let _sql_mau = `
        SELECT 
            target_cal.m, IFNULL(stat_data.mau_count, 0) AS mau_count
        FROM
            (SELECT 
                            DATE_FORMAT(CONCAT(y, a, '01'), '%Y-%m') as m
                        FROM
                            (SELECT '01' a UNION ALL SELECT '02' UNION ALL SELECT '03' UNION ALL SELECT '04' UNION ALL SELECT '05' UNION ALL SELECT '06' UNION ALL SELECT '07' UNION ALL SELECT '08' UNION ALL SELECT '09' UNION ALL SELECT '10' UNION ALL SELECT '11' UNION ALL SELECT '12') a, (SELECT ? y) d
                        ORDER BY m ) AS target_cal
                LEFT OUTER JOIN
            (SELECT 
                ld.m, COUNT(ld.uuid) AS mau_count
            FROM
                (SELECT 
                log.m, log.uuid, COUNT(idx) AS count
            FROM
                (SELECT 
                *, DATE_FORMAT(regit_date, '%Y-%m') m
            FROM
                log_login
            WHERE
                regit_date LIKE ? ) AS log
            GROUP BY m , uuid) AS ld
            GROUP BY m) AS stat_data ON target_cal.m = stat_data.m
        ORDER BY m       
        `;

        models.sequelizes.LogDB.query(_sql_mau, {
            replacements: [_year, _yearEmp],
            type: models.Sequelize.QueryTypes.SELECT,
            raw:true
        })
        .then((statLog)=>{
            let ResResult={};
            ResResult.mauLog = statLog;

            res.jsonp({...ResponseCode.OK, result: ResResult})
        })         
    } ,    


    /** Game DAU/MAU 통계 구현 */
    getGameDAUStat(req, res) {
        console.log(`[StatisticsController.getGameDAUStat] req.query: %j`, req.query);

        let dateArr = String(req.query.yearmonth).split('-');
        let _year = dateArr[0];
        let _yearmonth = req.query.yearmonth+'%';

        let _game = req.query.game;

        let _sql_dau = `
        SELECT 
            target_cal.m, IFNULL(stat_data.dau_count, 0) AS dau_count
        FROM
            (SELECT 
                ymd AS m
            FROM
                (SELECT 
                WEEK(dt) w,
                    DATE_FORMAT(dt, '%Y-%m-%d') ymd,
                    DATE_FORMAT(dt, '%Y%m') ym,
                    DAY(dt) d,
                    DATE_FORMAT(dt, '%d') zerofilld,
                    DAYOFWEEK(dt) dw
            FROM
                (SELECT 
                CONCAT(y, '0101') + INTERVAL a * 100 + b * 10 + c DAY dt
            FROM
                (SELECT 0 a UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3) a, (SELECT 0 b UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) b, (SELECT 0 c UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) c, (SELECT ? y) d
            WHERE
                a * 100 + b * 10 + c < DAYOFYEAR(CONCAT(y, '1231'))) a
            ORDER BY ym , d) AS cal
            WHERE
                ymd LIKE ? ) AS target_cal
                LEFT OUTER JOIN
            (SELECT 
                ld.m, COUNT(ld.uuid) AS dau_count
            FROM
                (SELECT 
                log.m, log.uuid, COUNT(idx) AS count
            FROM
                (SELECT 
                *, DATE_FORMAT(regit_date, '%Y-%m-%d') m
            FROM
                log_game_using
            WHERE
                regit_date LIKE ?  and game_type = ?) AS log
            GROUP BY m , uuid) AS ld
            GROUP BY m) AS stat_data ON target_cal.m = stat_data.m
        ORDER BY m       
        `;

        models.sequelizes.LogDB.query(_sql_dau, {
            replacements: [_year, _yearmonth, _yearmonth, _game],
            type: models.Sequelize.QueryTypes.SELECT,
            raw:true
        })
        .then((dauLog)=>{
            let ResResult={};
            ResResult.dauLog = dauLog;

            res.jsonp({...ResponseCode.OK, result: ResResult})
        })

    },

    getGameMAUStat(req, res) {
        console.log(`[StatisticsController.getGameMAUStat] req.query: %j`, req.query);        

        _year = req.query.year;
        _yearEmp = req.query.year+'%';
        let _game = req.query.game;

        let _sql_mau = `
        SELECT 
            target_cal.m, IFNULL(stat_data.mau_count, 0) AS mau_count
        FROM
            (SELECT 
                            DATE_FORMAT(CONCAT(y, a, '01'), '%Y-%m') as m
                        FROM
                            (SELECT '01' a UNION ALL SELECT '02' UNION ALL SELECT '03' UNION ALL SELECT '04' UNION ALL SELECT '05' UNION ALL SELECT '06' UNION ALL SELECT '07' UNION ALL SELECT '08' UNION ALL SELECT '09' UNION ALL SELECT '10' UNION ALL SELECT '11' UNION ALL SELECT '12') a, (SELECT ? y) d
                        ORDER BY m ) AS target_cal
                LEFT OUTER JOIN
            (SELECT 
                ld.m, COUNT(ld.uuid) AS mau_count
            FROM
                (SELECT 
                log.m, log.uuid, COUNT(idx) AS count
            FROM
                (SELECT 
                *, DATE_FORMAT(regit_date, '%Y-%m') m
            FROM
                log_game_using
            WHERE
                regit_date LIKE ?   and game_type = ? ) AS log
            GROUP BY m , uuid) AS ld
            GROUP BY m) AS stat_data ON target_cal.m = stat_data.m
        ORDER BY m       
        `;

        models.sequelizes.LogDB.query(_sql_mau, {
            replacements: [_year, _yearEmp, _game],
            type: models.Sequelize.QueryTypes.SELECT,
            raw:true
        })
        .then((statLog)=>{
            let ResResult={};
            ResResult.mauLog = statLog;

            res.jsonp({...ResponseCode.OK, result: ResResult})
        })         
    } ,    


    /** 로그인 리텐션 */
    getRetainLogin(req, res) {
        console.log(`[StatisticsController.RetainLogin] req.query: %j`, req.query);
        // 목표일?(+1, +7, +30)까지 접속인원/지정일 접속한 인원*100

        let _day = req.query.day;
        let _yearmonth = req.query.yearmonth;
        let _ymd = _yearmonth.concat('-',_day);
        let _ymdEmp = _ymd+'%';

        let _sql = `
            SELECT 
                (SELECT target_date) AS target_date,
                (SELECT 
                        COUNT(DISTINCT (uuid))
                    FROM
                        log_login
                    WHERE
                        regit_date LIKE CONCAT(target_date, '%')) AS target_date_count,
                (SELECT 
                        COUNT(DISTINCT (uuid))
                    FROM
                        log_login AS ll
                    WHERE
                        target_date > regit_date
                            AND regit_date >= DATE_ADD(target_date, INTERVAL - 1 DAY)
                            AND EXISTS( SELECT DISTINCT
                                (uuid)
                            FROM
                                log_login ll2
                            WHERE
                                regit_date LIKE CONCAT(target_date, '%')
                                    AND ll.uuid = ll2.uuid)) AS before_aday_count,
                (SELECT 
                        COUNT(DISTINCT (uuid))
                    FROM
                        log_login AS ll
                    WHERE
                        target_date > regit_date
                            AND regit_date >= DATE_ADD(target_date, INTERVAL - 7 DAY)
                            AND EXISTS( SELECT DISTINCT
                                (uuid)
                            FROM
                                log_login ll2
                            WHERE
                                regit_date LIKE CONCAT(target_date, '%')
                                    AND ll.uuid = ll2.uuid)) AS before_aweek_count,
                (SELECT 
                        COUNT(DISTINCT (uuid))
                    FROM
                        log_login AS ll
                    WHERE
                        target_date > regit_date
                            AND regit_date >= DATE_ADD(target_date, INTERVAL - 30 DAY)
                            AND EXISTS( SELECT DISTINCT
                                (uuid)
                            FROM
                                log_login ll2
                            WHERE
                                regit_date LIKE CONCAT(target_date, '%')
                                    AND ll.uuid = ll2.uuid)) AS before_amonth_count,
                (SELECT 
                        CONCAT(IFNULL(ROUND(before_aday_count / target_date_count * 100),
                                            0),
                                    '%')
                    ) AS adr,
                (SELECT 
                        CONCAT(IFNULL(ROUND(before_aweek_count / target_date_count * 100),
                                            0),
                                    '%')
                    ) AS awr,
                (SELECT 
                        CONCAT(IFNULL(ROUND(before_amonth_count / target_date_count * 100),
                                            0),
                                    '%')
                    ) AS amr
            FROM
                (SELECT 
                    m AS target_date
                FROM
                    (SELECT 
                    ymd AS m
                FROM
                    (SELECT 
                    WEEK(dt) w,
                        DATE_FORMAT(dt, '%Y-%m-%d') ymd,
                        DATE_FORMAT(dt, '%Y%m') ym,
                        DAY(dt) d,
                        DATE_FORMAT(dt, '%d') zerofilld,
                        DAYOFWEEK(dt) dw
                FROM
                    (SELECT 
                    CONCAT(y, '0101') + INTERVAL a * 100 + b * 10 + c DAY dt
                FROM
                    (SELECT 0 a UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3) a, (SELECT 0 b UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) b, (SELECT 0 c UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) c, (SELECT '2019' y) d) a) AS cal
                WHERE
                    ymd BETWEEN DATE_ADD(?, INTERVAL - 30 DAY) AND DATE_ADD(?, INTERVAL - 1 DAY)
                ORDER BY m) AS cal) AS td       
            `;
        
            let _replacements = [_ymd, _ymd];

            models.sequelizes.LogDB.query(_sql, {
                replacements: _replacements,
                type: models.Sequelize.QueryTypes.SELECT,
                raw:true
            })
            .then((statLog)=>{
                let ResResult={};
                ResResult = statLog;
    
                res.jsonp({...ResponseCode.OK, result: ResResult})
            });
    },

    /** 게임별 리텐션 */
    getGameRetainLogin(req, res) {
        console.log(`[StatisticsController.getGameRetainLogin] req.query: %j`, req.query);
        // 목표일?(+1, +7, +30)까지 접속인원/지정일 접속한 인원*100

        let _day = req.query.day;
        let _yearmonth = req.query.yearmonth;
        let _ymd = _yearmonth.concat('-',_day);
        let _ymdEmp = _ymd+'%';
        let _game = req.query.game;

        let _sql = `
            SELECT 
                (SELECT target_date) AS target_date,
                (SELECT 
                        COUNT(DISTINCT (uuid))
                    FROM
                        log_game_using
                    WHERE
                        regit_date LIKE CONCAT(target_date, '%') and game_type = td.game_type ) AS target_date_count,
                (SELECT 
                        COUNT(DISTINCT (uuid))
                    FROM
                        log_game_using AS ll
                    WHERE
                        target_date > regit_date
                            AND regit_date >= DATE_ADD(target_date, INTERVAL - 1 DAY)
                            AND EXISTS( SELECT DISTINCT
                                (uuid)
                            FROM
                                log_game_using ll2
                            WHERE
                                regit_date LIKE CONCAT(target_date, '%')
                                    AND ll.uuid = ll2.uuid and game_type = td.game_type )) AS before_aday_count,
                (SELECT 
                        COUNT(DISTINCT (uuid))
                    FROM
                        log_game_using AS ll
                    WHERE
                        target_date > regit_date
                            AND regit_date >= DATE_ADD(target_date, INTERVAL - 7 DAY)
                            AND EXISTS( SELECT DISTINCT
                                (uuid)
                            FROM
                                log_game_using ll2
                            WHERE
                                regit_date LIKE CONCAT(target_date, '%')
                                    AND ll.uuid = ll2.uuid and game_type = td.game_type )) AS before_aweek_count,
                (SELECT 
                        COUNT(DISTINCT (uuid))
                    FROM
                        log_game_using AS ll
                    WHERE
                        target_date > regit_date
                            AND regit_date >= DATE_ADD(target_date, INTERVAL - 30 DAY)
                            AND EXISTS( SELECT DISTINCT
                                (uuid)
                            FROM
                                log_game_using ll2
                            WHERE
                                regit_date LIKE CONCAT(target_date, '%')
                                    AND ll.uuid = ll2.uuid and game_type = td.game_type )) AS before_amonth_count,
                (SELECT 
                        CONCAT(IFNULL(ROUND(before_aday_count / target_date_count * 100),
                                            0),
                                    '%')
                    ) AS adr,
                (SELECT 
                        CONCAT(IFNULL(ROUND(before_aweek_count / target_date_count * 100),
                                            0),
                                    '%')
                    ) AS awr,
                (SELECT 
                        CONCAT(IFNULL(ROUND(before_amonth_count / target_date_count * 100),
                                            0),
                                    '%')
                    ) AS amr
            FROM
                (SELECT 
                    m AS target_date
                    , ? as 'game_type'
                FROM
                    (SELECT 
                    ymd AS m
                FROM
                    (SELECT 
                    WEEK(dt) w,
                        DATE_FORMAT(dt, '%Y-%m-%d') ymd,
                        DATE_FORMAT(dt, '%Y%m') ym,
                        DAY(dt) d,
                        DATE_FORMAT(dt, '%d') zerofilld,
                        DAYOFWEEK(dt) dw
                FROM
                    (SELECT 
                    CONCAT(y, '0101') + INTERVAL a * 100 + b * 10 + c DAY dt
                FROM
                    (SELECT 0 a UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3) a, (SELECT 0 b UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) b, (SELECT 0 c UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) c, (SELECT '2019' y) d) a) AS cal
                WHERE
                    ymd BETWEEN DATE_ADD(?, INTERVAL - 30 DAY) AND DATE_ADD(?, INTERVAL - 1 DAY)
                ORDER BY m) AS cal) AS td       
            `;
        
            let _replacements = [_game,_ymd, _ymd];

            models.sequelizes.LogDB.query(_sql, {
                replacements: _replacements,
                type: models.Sequelize.QueryTypes.SELECT,
                raw:true
            })
            .then((statLog)=>{
                let ResResult={};
                ResResult = statLog;
    
                res.jsonp({...ResponseCode.OK, result: ResResult})
            });
    },

    getStatStartByGameAndUser(req, res){ 
        console.log(`[StatisticsController.getStatStartByGameAndUser] req.query: %j`, req.query); 

        let _uuid = req.query.uuid;
        let _gameid = req.query.gameid;

        let _sql = "SELECT count(*) as runCount FROM log_game_using where  uuid = ? and game_type = ? ";

        let _replacements = [_uuid, _gameid];

        let ResResult={};

        models.sequelizes.LogDB.query(_sql, {
            replacements: _replacements,
            type: models.Sequelize.QueryTypes.SELECT,
            raw:true
        })
        .then((statLog)=>{
            
            ResResult = statLog;
            res.jsonp({...ResponseCode.OK, result: ResResult})
            
        });        
    },

    /** 게임별 실행 수  */
    /** 일별 */
    getDailyStatStartByGame(req, res) {
        console.log(`[StatisticsController.getDailyStatStartByGame] req.query: %j`, req.query);

        let dateArr = String(req.query.yearmonth).split('-');
        let _year = dateArr[0];
        let _yearmonth = req.query.yearmonth+'%';
        let _gamecode = req.query.gamecode;

        let _sql_login = `
        SELECT 
            target_cal.m,
            IFNULL(stat_data.login, 0) AS login,
            IFNULL(stat_data.no_login, 0) AS no_login,
            IFNULL(stat_data.total_count, 0) AS total_count
        FROM
            (SELECT 
                ymd AS m
            FROM
                (SELECT 
                WEEK(dt) w,
                    DATE_FORMAT(dt, '%Y-%m-%d') ymd,
                    DATE_FORMAT(dt, '%Y%m') ym,
                    DAY(dt) d,
                    DATE_FORMAT(dt, '%d') zerofilld,
                    DAYOFWEEK(dt) dw
            FROM
                (SELECT 
                CONCAT(y, '0101') + INTERVAL a * 100 + b * 10 + c DAY dt
            FROM
                (SELECT 0 a UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3) a, (SELECT 0 b UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) b, (SELECT 0 c UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) c, (SELECT ? y) d
            WHERE
                a * 100 + b * 10 + c < DAYOFYEAR(CONCAT(y, '1231'))) a
            ORDER BY ym , d) AS cal
            WHERE
                ymd LIKE ?) AS target_cal
                LEFT OUTER JOIN
            (SELECT 
                month_total.m,
                    log_data.login,
                    log_data.no_login,
                    month_total.count AS total_count
            FROM
                (SELECT 
                log.m, COUNT(idx) AS count
            FROM
                (SELECT 
                *, DATE_FORMAT(regit_date, '%Y-%m-%d') m
            FROM
                log_game_using
            WHERE
                regit_date LIKE ?
                    AND game_type = ?) AS log
            GROUP BY m
            ORDER BY m) AS month_total
            LEFT OUTER JOIN (SELECT 
                ld.m,
                    SUM(IF(ld.is_login = 1, ld.count, 0)) AS login,
                    SUM(IF(ld.is_login = 0, ld.count, 0)) AS no_login
            FROM
                (SELECT 
                log.m, log.is_login, COUNT(idx) AS count
            FROM
                (SELECT 
                *, DATE_FORMAT(regit_date, '%Y-%m-%d') m
            FROM
                log_game_using
            WHERE
                regit_date LIKE ?
                    AND game_type = ?) AS log
            GROUP BY m , is_login) AS ld
            GROUP BY m) AS log_data ON month_total.m = log_data.m) AS stat_data ON target_cal.m = stat_data.m
        ORDER BY m       
        `;

        let _sql_browser = `
        SELECT 
            target_cal.m,
            IFNULL(stat_data.Chrome, 0) AS Chrome,
            IFNULL(stat_data.IE, 0) AS IE,
            IFNULL(stat_data.Firefox, 0) AS Firefox,
            IFNULL(stat_data.Edge, 0) AS Edge,
            IFNULL(stat_data.Sapari, 0) AS Sapari,
            IFNULL(stat_data.Etc, 0) AS Etc,
            IFNULL(stat_data.total_count, 0) AS total_count
        FROM
            (SELECT 
                ymd AS m
            FROM
                (SELECT 
                WEEK(dt) w,
                    DATE_FORMAT(dt, '%Y-%m-%d') ymd,
                    DATE_FORMAT(dt, '%Y%m') ym,
                    DAY(dt) d,
                    DATE_FORMAT(dt, '%d') zerofilld,
                    DAYOFWEEK(dt) dw
            FROM
                (SELECT 
                CONCAT(y, '0101') + INTERVAL a * 100 + b * 10 + c DAY dt
            FROM
                (SELECT 0 a UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3) a, (SELECT 0 b UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) b, (SELECT 0 c UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) c, (SELECT ? y) d
            WHERE
                a * 100 + b * 10 + c < DAYOFYEAR(CONCAT(y, '1231'))) a
            ORDER BY ym , d) AS cal
            WHERE
                ymd LIKE ?) AS target_cal
                LEFT OUTER JOIN
            (SELECT 
                month_total.m,
                    log_data.Chrome,
                    log_data.IE,
                    log_data.Firefox,
                    log_data.Edge,
                    log_data.Sapari,
                    log_data.Etc,
                    month_total.count AS total_count
            FROM
                (SELECT 
                log.m, COUNT(idx) AS count
            FROM
                (SELECT 
                *, DATE_FORMAT(regit_date, '%Y-%m-%d') m
            FROM
                log_game_using
            WHERE
                regit_date LIKE ?
                    AND game_type = ?) AS log
            GROUP BY m
            ORDER BY m) AS month_total
            LEFT OUTER JOIN (SELECT 
                ld.m,
                    SUM(IF(ld.browser = 1, ld.count, 0)) AS Chrome,
                    SUM(IF(ld.browser = 2, ld.count, 0)) AS IE,
                    SUM(IF(ld.browser = 3, ld.count, 0)) AS Firefox,
                    SUM(IF(ld.browser = 4, ld.count, 0)) AS Edge,
                    SUM(IF(ld.browser = 5, ld.count, 0)) AS Sapari,
                    SUM(IF(ld.browser = 0, ld.count, 0)) AS Etc
            FROM
                (SELECT 
                log.m, log.browser, COUNT(idx) AS count
            FROM
                (SELECT 
                *, DATE_FORMAT(regit_date, '%Y-%m-%d') m
            FROM
                log_game_using
            WHERE
                regit_date LIKE ?
                    AND game_type = ?) AS log
            GROUP BY m , browser) AS ld
            GROUP BY m) AS log_data ON month_total.m = log_data.m) AS stat_data ON target_cal.m = stat_data.m
        ORDER BY m     
        `;

        let _sql_os = `
        SELECT 
            target_cal.m,
            IFNULL(stat_data.PC, 0) AS PC,
            IFNULL(stat_data.Android, 0) AS Android,
            IFNULL(stat_data.IOS, 0) AS IOS,
            IFNULL(stat_data.Etc, 0) AS Etc,
            IFNULL(stat_data.total_count, 0) AS total_count
        FROM
            (SELECT 
                ymd AS m
            FROM
                (SELECT 
                WEEK(dt) w,
                    DATE_FORMAT(dt, '%Y-%m-%d') ymd,
                    DATE_FORMAT(dt, '%Y%m') ym,
                    DAY(dt) d,
                    DATE_FORMAT(dt, '%d') zerofilld,
                    DAYOFWEEK(dt) dw
            FROM
                (SELECT 
                CONCAT(y, '0101') + INTERVAL a * 100 + b * 10 + c DAY dt
            FROM
                (SELECT 0 a UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3) a, (SELECT 0 b UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) b, (SELECT 0 c UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) c, (SELECT ? y) d
            WHERE
                a * 100 + b * 10 + c < DAYOFYEAR(CONCAT(y, '1231'))) a
            ORDER BY ym , d) AS cal
            WHERE
                ymd LIKE ?) AS target_cal
                LEFT OUTER JOIN
            (SELECT 
                month_total.m,
                    log_data.PC,
                    log_data.Android,
                    log_data.IOS,
                    log_data.Etc,
                    month_total.count AS total_count
            FROM
                (SELECT 
                log.m, COUNT(idx) AS count
            FROM
                (SELECT 
                *, DATE_FORMAT(regit_date, '%Y-%m-%d') m
            FROM
                log_game_using
            WHERE
                regit_date LIKE ?
                    AND game_type = ?) AS log
            GROUP BY m
            ORDER BY m) AS month_total
            LEFT OUTER JOIN (SELECT 
                ld.m,
                    SUM(IF(ld.os = 1, ld.count, 0)) AS PC,
                    SUM(IF(ld.os = 2, ld.count, 0)) AS Android,
                    SUM(IF(ld.os = 3, ld.count, 0)) AS IOS,
                    SUM(IF(ld.os = 0, ld.count, 0)) AS Etc
            FROM
                (SELECT 
                log.m, log.os, COUNT(idx) AS count
            FROM
                (SELECT 
                *, DATE_FORMAT(regit_date, '%Y-%m-%d') m
            FROM
                log_game_using
            WHERE
                regit_date LIKE ?
                    AND game_type = ?) AS log
            GROUP BY m , os) AS ld
            GROUP BY m) AS log_data ON month_total.m = log_data.m) AS stat_data ON target_cal.m = stat_data.m
        ORDER BY m
        `;        
        Promise.all([
            models.sequelizes.LogDB.query(_sql_login, {
                replacements: [_year, _yearmonth, _yearmonth,_gamecode,_yearmonth,_gamecode],
                type: models.Sequelize.QueryTypes.SELECT,
                raw:true
            }),            
            models.sequelizes.LogDB.query(_sql_browser, {
                replacements: [_year, _yearmonth, _yearmonth,_gamecode,_yearmonth,_gamecode],
                type: models.Sequelize.QueryTypes.SELECT,
                raw:true
            }),
            models.sequelizes.LogDB.query(_sql_os, {
                replacements: [_year, _yearmonth, _yearmonth,_gamecode,_yearmonth,_gamecode],
                type: models.Sequelize.QueryTypes.SELECT,
                raw:true
            }),
        ])
        .then((statLog)=>{
            let ResResult={};
            ResResult.loginLog = statLog[0];
            ResResult.browserLog = statLog[1];
            ResResult.osLog = statLog[2];

            res.jsonp({...ResponseCode.OK, result: ResResult})
        })

    },
    /** 주별 */
    getWeeklyStatStartByGame(req, res) {
        console.log(`[StatisticsController.getWeekilyStatStartByGame] req.query: %j`, req.query);
        let dateArr = String(req.query.start_date).split('-');
        let _year = dateArr[0];  
        let _week = req.query.week;
        let _start = req.query.start_date+' 00:00:00';
        let _end = req.query.end_date+' 23:59:59';
        let _gamecode = req.query.gamecode;


        let _sql_login = `
        SELECT 
            target_cal.m,
            IFNULL(stat_data.login, 0) AS login,
            IFNULL(stat_data.no_login, 0) AS no_login,
            IFNULL(stat_data.total_count, 0) AS total_count
        FROM
            (SELECT 
                ymd AS m
            FROM
                (SELECT
                    WEEK(dt) w,
                        DATE_FORMAT(dt, '%Y-%m-%d') ymd,
                        DATE_FORMAT(dt, '%Y%m') ym,
                        DAY(dt) d,
                        DATE_FORMAT(dt, '%d') zerofilld,
                        DAYOFWEEK(dt) dw
                FROM
                    (SELECT 
        CONCAT(y, '0101') + INTERVAL a * 100 + b * 10 + c DAY dt
        FROM
        (SELECT 0 a UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3) a, (SELECT 0 b UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) b, (SELECT 0 c UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) c, (SELECT ? y) d) a) AS cal
        WHERE
        w = ? ) AS target_cal
                LEFT OUTER JOIN
            (SELECT 
                month_total.m,
                    log_data.login,
                    log_data.no_login,
                    month_total.count AS total_count
            FROM
                (SELECT 
                log.m, COUNT(idx) AS count
            FROM
                (SELECT 
                *, DATE_FORMAT(regit_date, '%Y-%m-%d') m
            FROM
                log_game_using
            WHERE
                regit_date BETWEEN ? AND ?
                    AND game_type = ?) AS log
            GROUP BY m
            ORDER BY m) AS month_total
            LEFT OUTER JOIN (SELECT 
                ld.m,
                    SUM(IF(ld.is_login = 1, ld.count, 0)) AS login,
                    SUM(IF(ld.is_login = 0, ld.count, 0)) AS no_login
            FROM
                (SELECT 
                log.m, log.is_login, COUNT(idx) AS count
            FROM
                (SELECT 
                *, DATE_FORMAT(regit_date, '%Y-%m-%d') m
            FROM
                log_game_using
            WHERE
                regit_date BETWEEN ? AND ?
                    AND game_type = ?) AS log
            GROUP BY m , is_login) AS ld
            GROUP BY m) AS log_data ON month_total.m = log_data.m) AS stat_data ON target_cal.m = stat_data.m
        ORDER BY m
        `;

        let _sql_browser = `
            SELECT 
                target_cal.m,
                IFNULL(stat_data.Chrome, 0) AS Chrome,
                IFNULL(stat_data.IE, 0) AS IE,
                IFNULL(stat_data.Firefox, 0) AS Firefox,
                IFNULL(stat_data.Edge, 0) AS Edge,
                IFNULL(stat_data.Sapari, 0) AS Sapari,
                IFNULL(stat_data.Etc, 0) AS Etc,
                IFNULL(stat_data.total_count, 0) AS total_count
            FROM
                (SELECT 
                    ymd AS m
                FROM
                    (SELECT
                        WEEK(dt) w,
                            DATE_FORMAT(dt, '%Y-%m-%d') ymd,
                            DATE_FORMAT(dt, '%Y%m') ym,
                            DAY(dt) d,
                            DATE_FORMAT(dt, '%d') zerofilld,
                            DAYOFWEEK(dt) dw
                    FROM
                        (SELECT 
            CONCAT(y, '0101') + INTERVAL a * 100 + b * 10 + c DAY dt
            FROM
            (SELECT 0 a UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3) a, (SELECT 0 b UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) b, (SELECT 0 c UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) c, (SELECT ? y) d) a) AS cal
            WHERE
            w = ? ) AS target_cal
                    LEFT OUTER JOIN
                (SELECT 
                    month_total.m,
                        log_data.Chrome,
                        log_data.IE,
                        log_data.Firefox,
                        log_data.Edge,
                        log_data.Sapari,
                        log_data.Etc,
                        month_total.count AS total_count
                FROM
                    (SELECT 
                    log.m, COUNT(idx) AS count
                FROM
                    (SELECT 
                    *, DATE_FORMAT(regit_date, '%Y-%m-%d') m
                FROM
                    log_game_using
                WHERE
                    regit_date BETWEEN ? AND ? AND game_type = ?) AS log
                GROUP BY m
                ORDER BY m) AS month_total
                LEFT OUTER JOIN (SELECT 
                    ld.m,
                        SUM(IF(ld.browser = 1, ld.count, 0)) AS Chrome,
                        SUM(IF(ld.browser = 2, ld.count, 0)) AS IE,
                        SUM(IF(ld.browser = 3, ld.count, 0)) AS Firefox,
                        SUM(IF(ld.browser = 4, ld.count, 0)) AS Edge,
                        SUM(IF(ld.browser = 5, ld.count, 0)) AS Sapari,
                        SUM(IF(ld.browser = 0, ld.count, 0)) AS Etc
                FROM
                    (SELECT 
                    log.m, log.browser, COUNT(idx) AS count
                FROM
                    (SELECT 
                    *, DATE_FORMAT(regit_date, '%Y-%m-%d') m
                FROM
                    log_game_using
                WHERE
                    regit_date BETWEEN ? AND ? AND game_type = ?) AS log
                GROUP BY m , browser) AS ld
                GROUP BY m) AS log_data ON month_total.m = log_data.m) AS stat_data ON target_cal.m = stat_data.m
            ORDER BY m        
        `;

        let _sql_os = `
            SELECT
                target_cal.m,
                IFNULL(stat_data.PC, 0) AS PC,
                IFNULL(stat_data.Android, 0) AS Android,
                IFNULL(stat_data.IOS, 0) AS IOS,
                IFNULL(stat_data.Etc, 0) AS Etc,
                IFNULL(stat_data.total_count, 0) AS total_count
            FROM
                    (SELECT
                        ymd AS m
                    FROM
                        (SELECT
                        WEEK(dt) w,
                            DATE_FORMAT(dt, '%Y-%m-%d') ymd,
                            DATE_FORMAT(dt, '%Y%m') ym,
                            DAY(dt) d,
                            DATE_FORMAT(dt, '%d') zerofilld,
                            DAYOFWEEK(dt) dw
                    FROM
                        (SELECT 
            CONCAT(y, '0101') + INTERVAL a * 100 + b * 10 + c DAY dt
            FROM
            (SELECT 0 a UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3) a, (SELECT 0 b UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) b, (SELECT 0 c UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) c, (SELECT ? y) d) a) AS cal
            WHERE
            w = ? ) AS target_cal
                    LEFT OUTER JOIN
                (SELECT
                    month_total.m,
                        log_data.PC,
                        log_data.Android,
                        log_data.IOS,
                        log_data.Etc,
                        month_total.count AS total_count
                FROM
                    (SELECT
                    log.m, COUNT(idx) AS count
                FROM
                    (SELECT
                    *, DATE_FORMAT(regit_date, '%Y-%m-%d') m
                FROM
                    log_game_using
                WHERE
                    regit_date BETWEEN ? AND ?  AND game_type = ?) AS log
                GROUP BY m
                ORDER BY m) AS month_total
                LEFT OUTER JOIN (SELECT
                    ld.m,
                        SUM(IF(ld.os = 1, ld.count, 0)) AS PC,
                        SUM(IF(ld.os = 2, ld.count, 0)) AS Android,
                        SUM(IF(ld.os = 3, ld.count, 0)) AS IOS,
                        SUM(IF(ld.os = 0, ld.count, 0)) AS Etc
                FROM
                    (SELECT
                    log.m, log.os, COUNT(idx) AS count
                FROM
                    (SELECT
                    *, DATE_FORMAT(regit_date, '%Y-%m-%d') m
                FROM
                    log_game_using
                WHERE
                    regit_date BETWEEN ? AND ?  AND game_type = ?) AS log
                GROUP BY m , os) AS ld
                GROUP BY m) AS log_data ON month_total.m = log_data.m) AS stat_data ON target_cal.m = stat_data.m
            ORDER BY m
        `;        
        Promise.all([
            models.sequelizes.LogDB.query(_sql_login, {
                replacements: [_year, _week, _start, _end, _gamecode, _start, _end, _gamecode],
                type: models.Sequelize.QueryTypes.SELECT,
                raw:true
            }),            
            models.sequelizes.LogDB.query(_sql_browser, {
                replacements: [_year, _week, _start, _end, _gamecode, _start, _end, _gamecode],
                type: models.Sequelize.QueryTypes.SELECT,
                raw:true
            }),
            models.sequelizes.LogDB.query(_sql_os, {
                replacements: [_year, _week, _start, _end, _gamecode, _start, _end, _gamecode],
                type: models.Sequelize.QueryTypes.SELECT,
                raw:true
            }),
        ])
        .then((statLog)=>{
            let ResResult={};
            ResResult.loginLog = statLog[0];
            ResResult.browserLog = statLog[1];
            ResResult.osLog = statLog[2];

            res.jsonp({...ResponseCode.OK, result: ResResult})
        })        
    },
    /** 월별 */
    getMonthlyStatStartByGame(req, res) {
        console.log(`[StatisticsController.getMonthlyStatStartByGame] req.query: %j`, req.query);        

        let _year = req.query.year;
        let _yearEmp = req.query.year+'%';
        let _gamecode = req.query.gamecode;

        let _sql_login = `
        SELECT 
            target_cal.m,
            IFNULL(stat_data.login, 0) AS login,
            IFNULL(stat_data.no_login, 0) AS no_login,
            IFNULL(stat_data.total_count, 0) AS total_count
        FROM
            (SELECT 
                DATE_FORMAT(CONCAT(y, a, '01'), '%Y-%m') as m
            FROM
                (SELECT '01' a UNION ALL SELECT '02' UNION ALL SELECT '03' UNION ALL SELECT '04' UNION ALL SELECT '05' UNION ALL SELECT '06' UNION ALL SELECT '07' UNION ALL SELECT '08' UNION ALL SELECT '09' UNION ALL SELECT '10' UNION ALL SELECT '11' UNION ALL SELECT '12') a, (SELECT ? y) d
            ORDER BY m ) AS target_cal
                LEFT OUTER JOIN
            (SELECT 
                month_total.m,
                    log_data.login,
                    log_data.no_login,
                    month_total.count AS total_count
            FROM
                (SELECT 
                log.m, COUNT(idx) AS count
            FROM
                (SELECT 
                *, DATE_FORMAT(regit_date, '%Y-%m') m
            FROM
                log_game_using
            WHERE
                regit_date LIKE ?
                    AND game_type = ?) AS log
            GROUP BY m
            ORDER BY m) AS month_total
            LEFT OUTER JOIN (SELECT 
                ld.m,
                    SUM(IF(ld.is_login = 1, ld.count, 0)) AS login,
                    SUM(IF(ld.is_login = 0, ld.count, 0)) AS no_login
            FROM
                (SELECT 
                log.m, log.is_login, COUNT(idx) AS count
            FROM
                (SELECT 
                *, DATE_FORMAT(regit_date, '%Y-%m') m
            FROM
                log_game_using
            WHERE
                regit_date LIKE ?
                    AND game_type = ?) AS log
            GROUP BY m , is_login) AS ld
            GROUP BY m) AS log_data ON month_total.m = log_data.m) AS stat_data ON target_cal.m = stat_data.m
        ORDER BY m
        `;

        let _sql_browser = `
            SELECT 
                target_cal.m,
                IFNULL(stat_data.Chrome, 0) AS Chrome,
                IFNULL(stat_data.IE, 0) AS IE,
                IFNULL(stat_data.Firefox, 0) AS Firefox,
                IFNULL(stat_data.Edge, 0) AS Edge,
                IFNULL(stat_data.Sapari, 0) AS Sapari,
                IFNULL(stat_data.Etc, 0) AS Etc,
                IFNULL(stat_data.total_count, 0) AS total_count
            FROM
                (SELECT 
                    DATE_FORMAT(CONCAT(y, a, '01'), '%Y-%m') as m
                FROM
                    (SELECT '01' a UNION ALL SELECT '02' UNION ALL SELECT '03' UNION ALL SELECT '04' UNION ALL SELECT '05' UNION ALL SELECT '06' UNION ALL SELECT '07' UNION ALL SELECT '08' UNION ALL SELECT '09' UNION ALL SELECT '10' UNION ALL SELECT '11' UNION ALL SELECT '12') a, (SELECT ? y) d
                ORDER BY m ) AS target_cal
                    LEFT OUTER JOIN
                (SELECT 
                    month_total.m,
                        log_data.Chrome,
                        log_data.IE,
                        log_data.Firefox,
                        log_data.Edge,
                        log_data.Sapari,
                        log_data.Etc,
                        month_total.count AS total_count
                FROM
                    (SELECT 
                    log.m, COUNT(idx) AS count
                FROM
                    (SELECT 
                    *, DATE_FORMAT(regit_date, '%Y-%m') m
                FROM
                    log_game_using
                WHERE
                    regit_date LIKE ? AND game_type = ?) AS log
                GROUP BY m
                ORDER BY m) AS month_total
                LEFT OUTER JOIN (SELECT 
                    ld.m,
                        SUM(IF(ld.browser = 1, ld.count, 0)) AS Chrome,
                        SUM(IF(ld.browser = 2, ld.count, 0)) AS IE,
                        SUM(IF(ld.browser = 3, ld.count, 0)) AS Firefox,
                        SUM(IF(ld.browser = 4, ld.count, 0)) AS Edge,
                        SUM(IF(ld.browser = 5, ld.count, 0)) AS Sapari,
                        SUM(IF(ld.browser = 0, ld.count, 0)) AS Etc
                FROM
                    (SELECT 
                    log.m, log.browser, COUNT(idx) AS count
                FROM
                    (SELECT 
                    *, DATE_FORMAT(regit_date, '%Y-%m') m
                FROM
                    log_game_using
                WHERE
                    regit_date LIKE ? AND game_type = ?) AS log
                GROUP BY m , browser) AS ld
                GROUP BY m) AS log_data ON month_total.m = log_data.m) AS stat_data ON target_cal.m = stat_data.m
            ORDER BY m        
        `;

        let _sql_os = `
            SELECT
                target_cal.m,
                IFNULL(stat_data.PC, 0) AS PC,
                IFNULL(stat_data.Android, 0) AS Android,
                IFNULL(stat_data.IOS, 0) AS IOS,
                IFNULL(stat_data.Etc, 0) AS Etc,
                IFNULL(stat_data.total_count, 0) AS total_count
            FROM
                    (SELECT 
                        DATE_FORMAT(CONCAT(y, a, '01'), '%Y-%m') as m
                    FROM
                        (SELECT '01' a UNION ALL SELECT '02' UNION ALL SELECT '03' UNION ALL SELECT '04' UNION ALL SELECT '05' UNION ALL SELECT '06' UNION ALL SELECT '07' UNION ALL SELECT '08' UNION ALL SELECT '09' UNION ALL SELECT '10' UNION ALL SELECT '11' UNION ALL SELECT '12') a, (SELECT ? y) d
                    ORDER BY m ) AS target_cal
                    LEFT OUTER JOIN
                (SELECT
                    month_total.m,
                        log_data.PC,
                        log_data.Android,
                        log_data.IOS,
                        log_data.Etc,
                        month_total.count AS total_count
                FROM
                    (SELECT
                    log.m, COUNT(idx) AS count
                FROM
                    (SELECT
                    *, DATE_FORMAT(regit_date, '%Y-%m') m
                FROM
                    log_game_using
                WHERE
                    regit_date LIKE ?  AND game_type = ?) AS log
                GROUP BY m
                ORDER BY m) AS month_total
                LEFT OUTER JOIN (SELECT
                    ld.m,
                        SUM(IF(ld.os = 1, ld.count, 0)) AS PC,
                        SUM(IF(ld.os = 2, ld.count, 0)) AS Android,
                        SUM(IF(ld.os = 3, ld.count, 0)) AS IOS,
                        SUM(IF(ld.os = 0, ld.count, 0)) AS Etc
                FROM
                    (SELECT
                    log.m, log.os, COUNT(idx) AS count
                FROM
                    (SELECT
                    *, DATE_FORMAT(regit_date, '%Y-%m') m
                FROM
                    log_game_using
                WHERE
                    regit_date LIKE ?  AND game_type = ?) AS log
                GROUP BY m , os) AS ld
                GROUP BY m) AS log_data ON month_total.m = log_data.m) AS stat_data ON target_cal.m = stat_data.m
            ORDER BY m
        `;        
        Promise.all([
            models.sequelizes.LogDB.query(_sql_login, {
                replacements: [_year, _yearEmp, _gamecode, _yearEmp, _gamecode],
                type: models.Sequelize.QueryTypes.SELECT,
                raw:true
            }),
            models.sequelizes.LogDB.query(_sql_browser, {
                replacements: [_year, _yearEmp, _gamecode, _yearEmp, _gamecode],
                type: models.Sequelize.QueryTypes.SELECT,
                raw:true
            }),
            models.sequelizes.LogDB.query(_sql_os, {
                replacements: [_year, _yearEmp, _gamecode, _yearEmp, _gamecode],
                type: models.Sequelize.QueryTypes.SELECT,
                raw:true
            }),
        ])
        .then((statLog)=>{
            let ResResult={};
            ResResult.loginLog = statLog[0];
            ResResult.browserLog = statLog[1];
            ResResult.osLog = statLog[2];

            res.jsonp({...ResponseCode.OK, result: ResResult})
        })         
    } ,

    /** 게임별 완료 수  */
    /** 일별 */
    getDailyStatFinByGame(req, res) {
        console.log(`[StatisticsController.getDailyStatFinByGame] req.query: %j`, req.query);

        let dateArr = String(req.query.yearmonth).split('-');
        let _year = dateArr[0];
        let _yearmonth = req.query.yearmonth+'%';
        let _gamecode = req.query.gamecode;

        let _sql_login = `
        SELECT 
            target_cal.m,
            IFNULL(stat_data.login, 0) AS login,
            IFNULL(stat_data.no_login, 0) AS no_login,
            IFNULL(stat_data.total_count, 0) AS total_count
        FROM
            (SELECT 
                ymd AS m
            FROM
                (SELECT 
                WEEK(dt) w,
                    DATE_FORMAT(dt, '%Y-%m-%d') ymd,
                    DATE_FORMAT(dt, '%Y%m') ym,
                    DAY(dt) d,
                    DATE_FORMAT(dt, '%d') zerofilld,
                    DAYOFWEEK(dt) dw
            FROM
                (SELECT 
                CONCAT(y, '0101') + INTERVAL a * 100 + b * 10 + c DAY dt
            FROM
                (SELECT 0 a UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3) a, (SELECT 0 b UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) b, (SELECT 0 c UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) c, (SELECT ? y) d
            WHERE
                a * 100 + b * 10 + c < DAYOFYEAR(CONCAT(y, '1231'))) a
            ORDER BY ym , d) AS cal
            WHERE
                ymd LIKE ?) AS target_cal
                LEFT OUTER JOIN
            (SELECT 
                month_total.m,
                    log_data.login,
                    log_data.no_login,
                    month_total.count AS total_count
            FROM
                (SELECT 
                log.m, COUNT(idx) AS count
            FROM
                (SELECT 
                *, DATE_FORMAT(regit_date, '%Y-%m-%d') m
            FROM
                log_game_using
            WHERE
                regit_date LIKE ?
                    AND game_type = ? and is_result = 1) AS log
            GROUP BY m
            ORDER BY m) AS month_total
            LEFT OUTER JOIN (SELECT 
                ld.m,
                    SUM(IF(ld.is_login = 1, ld.count, 0)) AS login,
                    SUM(IF(ld.is_login = 0, ld.count, 0)) AS no_login
            FROM
                (SELECT 
                log.m, log.is_login, COUNT(idx) AS count
            FROM
                (SELECT 
                *, DATE_FORMAT(regit_date, '%Y-%m-%d') m
            FROM
                log_game_using
            WHERE
                regit_date LIKE ?
                    AND game_type = ? and is_result = 1) AS log
            GROUP BY m , is_login) AS ld
            GROUP BY m) AS log_data ON month_total.m = log_data.m) AS stat_data ON target_cal.m = stat_data.m
        ORDER BY m       
        `;

        let _sql_browser = `
        SELECT 
            target_cal.m,
            IFNULL(stat_data.Chrome, 0) AS Chrome,
            IFNULL(stat_data.IE, 0) AS IE,
            IFNULL(stat_data.Firefox, 0) AS Firefox,
            IFNULL(stat_data.Edge, 0) AS Edge,
            IFNULL(stat_data.Sapari, 0) AS Sapari,
            IFNULL(stat_data.Etc, 0) AS Etc,
            IFNULL(stat_data.total_count, 0) AS total_count
        FROM
            (SELECT 
                ymd AS m
            FROM
                (SELECT 
                WEEK(dt) w,
                    DATE_FORMAT(dt, '%Y-%m-%d') ymd,
                    DATE_FORMAT(dt, '%Y%m') ym,
                    DAY(dt) d,
                    DATE_FORMAT(dt, '%d') zerofilld,
                    DAYOFWEEK(dt) dw
            FROM
                (SELECT 
                CONCAT(y, '0101') + INTERVAL a * 100 + b * 10 + c DAY dt
            FROM
                (SELECT 0 a UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3) a, (SELECT 0 b UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) b, (SELECT 0 c UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) c, (SELECT ? y) d
            WHERE
                a * 100 + b * 10 + c < DAYOFYEAR(CONCAT(y, '1231'))) a
            ORDER BY ym , d) AS cal
            WHERE
                ymd LIKE ?) AS target_cal
                LEFT OUTER JOIN
            (SELECT 
                month_total.m,
                    log_data.Chrome,
                    log_data.IE,
                    log_data.Firefox,
                    log_data.Edge,
                    log_data.Sapari,
                    log_data.Etc,
                    month_total.count AS total_count
            FROM
                (SELECT 
                log.m, COUNT(idx) AS count
            FROM
                (SELECT 
                *, DATE_FORMAT(regit_date, '%Y-%m-%d') m
            FROM
                log_game_using
            WHERE
                regit_date LIKE ?
                    AND game_type = ? and is_result = 1) AS log
            GROUP BY m
            ORDER BY m) AS month_total
            LEFT OUTER JOIN (SELECT 
                ld.m,
                    SUM(IF(ld.browser = 1, ld.count, 0)) AS Chrome,
                    SUM(IF(ld.browser = 2, ld.count, 0)) AS IE,
                    SUM(IF(ld.browser = 3, ld.count, 0)) AS Firefox,
                    SUM(IF(ld.browser = 4, ld.count, 0)) AS Edge,
                    SUM(IF(ld.browser = 5, ld.count, 0)) AS Sapari,
                    SUM(IF(ld.browser = 0, ld.count, 0)) AS Etc
            FROM
                (SELECT 
                log.m, log.browser, COUNT(idx) AS count
            FROM
                (SELECT 
                *, DATE_FORMAT(regit_date, '%Y-%m-%d') m
            FROM
                log_game_using
            WHERE
                regit_date LIKE ?
                    AND game_type = ? and is_result = 1) AS log
            GROUP BY m , browser) AS ld
            GROUP BY m) AS log_data ON month_total.m = log_data.m) AS stat_data ON target_cal.m = stat_data.m
        ORDER BY m     
        `;

        let _sql_os = `
        SELECT 
            target_cal.m,
            IFNULL(stat_data.PC, 0) AS PC,
            IFNULL(stat_data.Android, 0) AS Android,
            IFNULL(stat_data.IOS, 0) AS IOS,
            IFNULL(stat_data.Etc, 0) AS Etc,
            IFNULL(stat_data.total_count, 0) AS total_count
        FROM
            (SELECT 
                ymd AS m
            FROM
                (SELECT 
                WEEK(dt) w,
                    DATE_FORMAT(dt, '%Y-%m-%d') ymd,
                    DATE_FORMAT(dt, '%Y%m') ym,
                    DAY(dt) d,
                    DATE_FORMAT(dt, '%d') zerofilld,
                    DAYOFWEEK(dt) dw
            FROM
                (SELECT 
                CONCAT(y, '0101') + INTERVAL a * 100 + b * 10 + c DAY dt
            FROM
                (SELECT 0 a UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3) a, (SELECT 0 b UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) b, (SELECT 0 c UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) c, (SELECT ? y) d
            WHERE
                a * 100 + b * 10 + c < DAYOFYEAR(CONCAT(y, '1231'))) a
            ORDER BY ym , d) AS cal
            WHERE
                ymd LIKE ?) AS target_cal
                LEFT OUTER JOIN
            (SELECT 
                month_total.m,
                    log_data.PC,
                    log_data.Android,
                    log_data.IOS,
                    log_data.Etc,
                    month_total.count AS total_count
            FROM
                (SELECT 
                log.m, COUNT(idx) AS count
            FROM
                (SELECT 
                *, DATE_FORMAT(regit_date, '%Y-%m-%d') m
            FROM
                log_game_using
            WHERE
                regit_date LIKE ?
                    AND game_type = ? and is_result = 1) AS log
            GROUP BY m
            ORDER BY m) AS month_total
            LEFT OUTER JOIN (SELECT 
                ld.m,
                    SUM(IF(ld.os = 1, ld.count, 0)) AS PC,
                    SUM(IF(ld.os = 2, ld.count, 0)) AS Android,
                    SUM(IF(ld.os = 3, ld.count, 0)) AS IOS,
                    SUM(IF(ld.os = 0, ld.count, 0)) AS Etc
            FROM
                (SELECT 
                log.m, log.os, COUNT(idx) AS count
            FROM
                (SELECT 
                *, DATE_FORMAT(regit_date, '%Y-%m-%d') m
            FROM
                log_game_using
            WHERE
                regit_date LIKE ?
                    AND game_type = ? and is_result = 1) AS log
            GROUP BY m , os) AS ld
            GROUP BY m) AS log_data ON month_total.m = log_data.m) AS stat_data ON target_cal.m = stat_data.m
        ORDER BY m
        `;        
        Promise.all([
            models.sequelizes.LogDB.query(_sql_login, {
                replacements: [_year, _yearmonth, _yearmonth,_gamecode,_yearmonth,_gamecode],
                type: models.Sequelize.QueryTypes.SELECT,
                raw:true
            }),            
            models.sequelizes.LogDB.query(_sql_browser, {
                replacements: [_year, _yearmonth, _yearmonth,_gamecode,_yearmonth,_gamecode],
                type: models.Sequelize.QueryTypes.SELECT,
                raw:true
            }),
            models.sequelizes.LogDB.query(_sql_os, {
                replacements: [_year, _yearmonth, _yearmonth,_gamecode,_yearmonth,_gamecode],
                type: models.Sequelize.QueryTypes.SELECT,
                raw:true
            }),
        ])
        .then((statLog)=>{
            let ResResult={};
            ResResult.loginLog = statLog[0];
            ResResult.browserLog = statLog[1];
            ResResult.osLog = statLog[2];

            res.jsonp({...ResponseCode.OK, result: ResResult})
        })

    },
    /** 주별 */
    getWeeklyStatFinByGame(req, res) {
        console.log(`[StatisticsController.getWeeklyStatFinByGame] req.query: %j`, req.query);
        let dateArr = String(req.query.start_date).split('-');
        let _year = dateArr[0];  
        let _week = req.query.week;
        let _start = req.query.start_date+' 00:00:00';
        let _end = req.query.end_date+' 23:59:59';
        let _gamecode = req.query.gamecode;


        let _sql_login = `
        SELECT 
            target_cal.m,
            IFNULL(stat_data.login, 0) AS login,
            IFNULL(stat_data.no_login, 0) AS no_login,
            IFNULL(stat_data.total_count, 0) AS total_count
        FROM
            (SELECT 
                ymd AS m
            FROM
                (SELECT
                    WEEK(dt) w,
                        DATE_FORMAT(dt, '%Y-%m-%d') ymd,
                        DATE_FORMAT(dt, '%Y%m') ym,
                        DAY(dt) d,
                        DATE_FORMAT(dt, '%d') zerofilld,
                        DAYOFWEEK(dt) dw
                FROM
                    (SELECT 
        CONCAT(y, '0101') + INTERVAL a * 100 + b * 10 + c DAY dt
        FROM
        (SELECT 0 a UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3) a, (SELECT 0 b UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) b, (SELECT 0 c UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) c, (SELECT ? y) d) a) AS cal
        WHERE
        w = ? ) AS target_cal
                LEFT OUTER JOIN
            (SELECT 
                month_total.m,
                    log_data.login,
                    log_data.no_login,
                    month_total.count AS total_count
            FROM
                (SELECT 
                log.m, COUNT(idx) AS count
            FROM
                (SELECT 
                *, DATE_FORMAT(regit_date, '%Y-%m-%d') m
            FROM
                log_game_using
            WHERE
                regit_date BETWEEN ? AND ?
                    AND game_type = ? and is_result = 1) AS log
            GROUP BY m
            ORDER BY m) AS month_total
            LEFT OUTER JOIN (SELECT 
                ld.m,
                    SUM(IF(ld.is_login = 1, ld.count, 0)) AS login,
                    SUM(IF(ld.is_login = 0, ld.count, 0)) AS no_login
            FROM
                (SELECT 
                log.m, log.is_login, COUNT(idx) AS count
            FROM
                (SELECT 
                *, DATE_FORMAT(regit_date, '%Y-%m-%d') m
            FROM
                log_game_using
            WHERE
                regit_date BETWEEN ? AND ?
                    AND game_type = ? and is_result = 1) AS log
            GROUP BY m , is_login) AS ld
            GROUP BY m) AS log_data ON month_total.m = log_data.m) AS stat_data ON target_cal.m = stat_data.m
        ORDER BY m
        `;

        let _sql_browser = `
            SELECT 
                target_cal.m,
                IFNULL(stat_data.Chrome, 0) AS Chrome,
                IFNULL(stat_data.IE, 0) AS IE,
                IFNULL(stat_data.Firefox, 0) AS Firefox,
                IFNULL(stat_data.Edge, 0) AS Edge,
                IFNULL(stat_data.Sapari, 0) AS Sapari,
                IFNULL(stat_data.Etc, 0) AS Etc,
                IFNULL(stat_data.total_count, 0) AS total_count
            FROM
                (SELECT 
                    ymd AS m
                FROM
                    (SELECT
                        WEEK(dt) w,
                            DATE_FORMAT(dt, '%Y-%m-%d') ymd,
                            DATE_FORMAT(dt, '%Y%m') ym,
                            DAY(dt) d,
                            DATE_FORMAT(dt, '%d') zerofilld,
                            DAYOFWEEK(dt) dw
                    FROM
                        (SELECT 
            CONCAT(y, '0101') + INTERVAL a * 100 + b * 10 + c DAY dt
            FROM
            (SELECT 0 a UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3) a, (SELECT 0 b UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) b, (SELECT 0 c UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) c, (SELECT ? y) d) a) AS cal
            WHERE
            w = ? ) AS target_cal
                    LEFT OUTER JOIN
                (SELECT 
                    month_total.m,
                        log_data.Chrome,
                        log_data.IE,
                        log_data.Firefox,
                        log_data.Edge,
                        log_data.Sapari,
                        log_data.Etc,
                        month_total.count AS total_count
                FROM
                    (SELECT 
                    log.m, COUNT(idx) AS count
                FROM
                    (SELECT 
                    *, DATE_FORMAT(regit_date, '%Y-%m-%d') m
                FROM
                    log_game_using
                WHERE
                    regit_date BETWEEN ? AND ? AND game_type = ? and is_result = 1) AS log
                GROUP BY m
                ORDER BY m) AS month_total
                LEFT OUTER JOIN (SELECT 
                    ld.m,
                        SUM(IF(ld.browser = 1, ld.count, 0)) AS Chrome,
                        SUM(IF(ld.browser = 2, ld.count, 0)) AS IE,
                        SUM(IF(ld.browser = 3, ld.count, 0)) AS Firefox,
                        SUM(IF(ld.browser = 4, ld.count, 0)) AS Edge,
                        SUM(IF(ld.browser = 5, ld.count, 0)) AS Sapari,
                        SUM(IF(ld.browser = 0, ld.count, 0)) AS Etc
                FROM
                    (SELECT 
                    log.m, log.browser, COUNT(idx) AS count
                FROM
                    (SELECT 
                    *, DATE_FORMAT(regit_date, '%Y-%m-%d') m
                FROM
                    log_game_using
                WHERE
                    regit_date BETWEEN ? AND ? AND game_type = ? and is_result = 1) AS log
                GROUP BY m , browser) AS ld
                GROUP BY m) AS log_data ON month_total.m = log_data.m) AS stat_data ON target_cal.m = stat_data.m
            ORDER BY m        
        `;

        let _sql_os = `
            SELECT
                target_cal.m,
                IFNULL(stat_data.PC, 0) AS PC,
                IFNULL(stat_data.Android, 0) AS Android,
                IFNULL(stat_data.IOS, 0) AS IOS,
                IFNULL(stat_data.Etc, 0) AS Etc,
                IFNULL(stat_data.total_count, 0) AS total_count
            FROM
                    (SELECT
                        ymd AS m
                    FROM
                        (SELECT
                        WEEK(dt) w,
                            DATE_FORMAT(dt, '%Y-%m-%d') ymd,
                            DATE_FORMAT(dt, '%Y%m') ym,
                            DAY(dt) d,
                            DATE_FORMAT(dt, '%d') zerofilld,
                            DAYOFWEEK(dt) dw
                    FROM
                        (SELECT 
            CONCAT(y, '0101') + INTERVAL a * 100 + b * 10 + c DAY dt
            FROM
            (SELECT 0 a UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3) a, (SELECT 0 b UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) b, (SELECT 0 c UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) c, (SELECT ? y) d) a) AS cal
            WHERE
            w = ? ) AS target_cal
                    LEFT OUTER JOIN
                (SELECT
                    month_total.m,
                        log_data.PC,
                        log_data.Android,
                        log_data.IOS,
                        log_data.Etc,
                        month_total.count AS total_count
                FROM
                    (SELECT
                    log.m, COUNT(idx) AS count
                FROM
                    (SELECT
                    *, DATE_FORMAT(regit_date, '%Y-%m-%d') m
                FROM
                    log_game_using
                WHERE
                    regit_date BETWEEN ? AND ?  AND game_type = ? and is_result = 1) AS log
                GROUP BY m
                ORDER BY m) AS month_total
                LEFT OUTER JOIN (SELECT
                    ld.m,
                        SUM(IF(ld.os = 1, ld.count, 0)) AS PC,
                        SUM(IF(ld.os = 2, ld.count, 0)) AS Android,
                        SUM(IF(ld.os = 3, ld.count, 0)) AS IOS,
                        SUM(IF(ld.os = 0, ld.count, 0)) AS Etc
                FROM
                    (SELECT
                    log.m, log.os, COUNT(idx) AS count
                FROM
                    (SELECT
                    *, DATE_FORMAT(regit_date, '%Y-%m-%d') m
                FROM
                    log_game_using
                WHERE
                    regit_date BETWEEN ? AND ?  AND game_type = ? and is_result = 1) AS log
                GROUP BY m , os) AS ld
                GROUP BY m) AS log_data ON month_total.m = log_data.m) AS stat_data ON target_cal.m = stat_data.m
            ORDER BY m
        `;        
        Promise.all([
            models.sequelizes.LogDB.query(_sql_login, {
                replacements: [_year, _week, _start, _end, _gamecode, _start, _end, _gamecode],
                type: models.Sequelize.QueryTypes.SELECT,
                raw:true
            }),            
            models.sequelizes.LogDB.query(_sql_browser, {
                replacements: [_year, _week, _start, _end, _gamecode, _start, _end, _gamecode],
                type: models.Sequelize.QueryTypes.SELECT,
                raw:true
            }),
            models.sequelizes.LogDB.query(_sql_os, {
                replacements: [_year, _week, _start, _end, _gamecode, _start, _end, _gamecode],
                type: models.Sequelize.QueryTypes.SELECT,
                raw:true
            }),
        ])
        .then((statLog)=>{
            let ResResult={};
            ResResult.loginLog = statLog[0];
            ResResult.browserLog = statLog[1];
            ResResult.osLog = statLog[2];

            res.jsonp({...ResponseCode.OK, result: ResResult})
        })        
    },
    /** 월별 */
    getMonthlyStatFinByGame(req, res) {
        console.log(`[StatisticsController.getMonthlyStatFinByGame] req.query: %j`, req.query);        

        let _year = req.query.year;
        let _yearEmp = req.query.year+'%';
        let _gamecode = req.query.gamecode;

        let _sql_login = `
        SELECT 
            target_cal.m,
            IFNULL(stat_data.login, 0) AS login,
            IFNULL(stat_data.no_login, 0) AS no_login,
            IFNULL(stat_data.total_count, 0) AS total_count
        FROM
            (SELECT 
                DATE_FORMAT(CONCAT(y, a, '01'), '%Y-%m') as m
            FROM
                (SELECT '01' a UNION ALL SELECT '02' UNION ALL SELECT '03' UNION ALL SELECT '04' UNION ALL SELECT '05' UNION ALL SELECT '06' UNION ALL SELECT '07' UNION ALL SELECT '08' UNION ALL SELECT '09' UNION ALL SELECT '10' UNION ALL SELECT '11' UNION ALL SELECT '12') a, (SELECT ? y) d
            ORDER BY m ) AS target_cal
                LEFT OUTER JOIN
            (SELECT 
                month_total.m,
                    log_data.login,
                    log_data.no_login,
                    month_total.count AS total_count
            FROM
                (SELECT 
                log.m, COUNT(idx) AS count
            FROM
                (SELECT 
                *, DATE_FORMAT(regit_date, '%Y-%m') m
            FROM
                log_game_using
            WHERE
                regit_date LIKE ?
                    AND game_type = ? and is_result = 1) AS log
            GROUP BY m
            ORDER BY m) AS month_total
            LEFT OUTER JOIN (SELECT 
                ld.m,
                    SUM(IF(ld.is_login = 1, ld.count, 0)) AS login,
                    SUM(IF(ld.is_login = 0, ld.count, 0)) AS no_login
            FROM
                (SELECT 
                log.m, log.is_login, COUNT(idx) AS count
            FROM
                (SELECT 
                *, DATE_FORMAT(regit_date, '%Y-%m') m
            FROM
                log_game_using
            WHERE
                regit_date LIKE ?
                    AND game_type = ? and is_result = 1) AS log
            GROUP BY m , is_login) AS ld
            GROUP BY m) AS log_data ON month_total.m = log_data.m) AS stat_data ON target_cal.m = stat_data.m
        ORDER BY m
        `;

        let _sql_browser = `
            SELECT 
                target_cal.m,
                IFNULL(stat_data.Chrome, 0) AS Chrome,
                IFNULL(stat_data.IE, 0) AS IE,
                IFNULL(stat_data.Firefox, 0) AS Firefox,
                IFNULL(stat_data.Edge, 0) AS Edge,
                IFNULL(stat_data.Sapari, 0) AS Sapari,
                IFNULL(stat_data.Etc, 0) AS Etc,
                IFNULL(stat_data.total_count, 0) AS total_count
            FROM
                (SELECT 
                    DATE_FORMAT(CONCAT(y, a, '01'), '%Y-%m') as m
                FROM
                    (SELECT '01' a UNION ALL SELECT '02' UNION ALL SELECT '03' UNION ALL SELECT '04' UNION ALL SELECT '05' UNION ALL SELECT '06' UNION ALL SELECT '07' UNION ALL SELECT '08' UNION ALL SELECT '09' UNION ALL SELECT '10' UNION ALL SELECT '11' UNION ALL SELECT '12') a, (SELECT ? y) d
                ORDER BY m ) AS target_cal
                    LEFT OUTER JOIN
                (SELECT 
                    month_total.m,
                        log_data.Chrome,
                        log_data.IE,
                        log_data.Firefox,
                        log_data.Edge,
                        log_data.Sapari,
                        log_data.Etc,
                        month_total.count AS total_count
                FROM
                    (SELECT 
                    log.m, COUNT(idx) AS count
                FROM
                    (SELECT 
                    *, DATE_FORMAT(regit_date, '%Y-%m') m
                FROM
                    log_game_using
                WHERE
                    regit_date LIKE ? AND game_type = ? and is_result = 1) AS log
                GROUP BY m
                ORDER BY m) AS month_total
                LEFT OUTER JOIN (SELECT 
                    ld.m,
                        SUM(IF(ld.browser = 1, ld.count, 0)) AS Chrome,
                        SUM(IF(ld.browser = 2, ld.count, 0)) AS IE,
                        SUM(IF(ld.browser = 3, ld.count, 0)) AS Firefox,
                        SUM(IF(ld.browser = 4, ld.count, 0)) AS Edge,
                        SUM(IF(ld.browser = 5, ld.count, 0)) AS Sapari,
                        SUM(IF(ld.browser = 0, ld.count, 0)) AS Etc
                FROM
                    (SELECT 
                    log.m, log.browser, COUNT(idx) AS count
                FROM
                    (SELECT 
                    *, DATE_FORMAT(regit_date, '%Y-%m') m
                FROM
                    log_game_using
                WHERE
                    regit_date LIKE ? AND game_type = ? and is_result = 1) AS log
                GROUP BY m , browser) AS ld
                GROUP BY m) AS log_data ON month_total.m = log_data.m) AS stat_data ON target_cal.m = stat_data.m
            ORDER BY m        
        `;

        let _sql_os = `
            SELECT
                target_cal.m,
                IFNULL(stat_data.PC, 0) AS PC,
                IFNULL(stat_data.Android, 0) AS Android,
                IFNULL(stat_data.IOS, 0) AS IOS,
                IFNULL(stat_data.Etc, 0) AS Etc,
                IFNULL(stat_data.total_count, 0) AS total_count
            FROM
                    (SELECT 
                        DATE_FORMAT(CONCAT(y, a, '01'), '%Y-%m') as m
                    FROM
                        (SELECT '01' a UNION ALL SELECT '02' UNION ALL SELECT '03' UNION ALL SELECT '04' UNION ALL SELECT '05' UNION ALL SELECT '06' UNION ALL SELECT '07' UNION ALL SELECT '08' UNION ALL SELECT '09' UNION ALL SELECT '10' UNION ALL SELECT '11' UNION ALL SELECT '12') a, (SELECT ? y) d
                    ORDER BY m ) AS target_cal
                    LEFT OUTER JOIN
                (SELECT
                    month_total.m,
                        log_data.PC,
                        log_data.Android,
                        log_data.IOS,
                        log_data.Etc,
                        month_total.count AS total_count
                FROM
                    (SELECT
                    log.m, COUNT(idx) AS count
                FROM
                    (SELECT
                    *, DATE_FORMAT(regit_date, '%Y-%m') m
                FROM
                    log_game_using
                WHERE
                    regit_date LIKE ?  AND game_type = ? and is_result = 1) AS log
                GROUP BY m
                ORDER BY m) AS month_total
                LEFT OUTER JOIN (SELECT
                    ld.m,
                        SUM(IF(ld.os = 1, ld.count, 0)) AS PC,
                        SUM(IF(ld.os = 2, ld.count, 0)) AS Android,
                        SUM(IF(ld.os = 3, ld.count, 0)) AS IOS,
                        SUM(IF(ld.os = 0, ld.count, 0)) AS Etc
                FROM
                    (SELECT
                    log.m, log.os, COUNT(idx) AS count
                FROM
                    (SELECT
                    *, DATE_FORMAT(regit_date, '%Y-%m') m
                FROM
                    log_game_using
                WHERE
                    regit_date LIKE ?  AND game_type = ? and is_result = 1) AS log
                GROUP BY m , os) AS ld
                GROUP BY m) AS log_data ON month_total.m = log_data.m) AS stat_data ON target_cal.m = stat_data.m
            ORDER BY m
        `;        
        Promise.all([
            models.sequelizes.LogDB.query(_sql_login, {
                replacements: [_year, _yearEmp, _gamecode, _yearEmp, _gamecode],
                type: models.Sequelize.QueryTypes.SELECT,
                raw:true
            }),
            models.sequelizes.LogDB.query(_sql_browser, {
                replacements: [_year, _yearEmp, _gamecode, _yearEmp, _gamecode],
                type: models.Sequelize.QueryTypes.SELECT,
                raw:true
            }),
            models.sequelizes.LogDB.query(_sql_os, {
                replacements: [_year, _yearEmp, _gamecode, _yearEmp, _gamecode],
                type: models.Sequelize.QueryTypes.SELECT,
                raw:true
            }),
        ])
        .then((statLog)=>{
            let ResResult={};
            ResResult.loginLog = statLog[0];
            ResResult.browserLog = statLog[1];
            ResResult.osLog = statLog[2];

            res.jsonp({...ResponseCode.OK, result: ResResult})
        })         
    } ,

    /** 뻘짓한 api 사라질 예정 */
    getStatStartByGame(req, res){
        console.log(`[StatisticsController.getStatStartByGame] req.query: %j`, req.query);        

        let dateArr = String(req.query.yearmonth).split('-');
        let _year = dateArr[0];
        let _month = dateArr[1];
        let _yearmonth = req.query.yearmonth;
        let _day = req.query.day ? req.query.day : '';        
        let _week = req.query.week ? req.query.week : '';
        let _start = req.query.start_date ? req.query.start_date+' 00:00:00' : '';
        let _end = req.query.end_date ? req.query.end_date+' 23:59:59' : '';      
        let _gamecode = req.query.gamecode;

        // case 절로 type 에 따라서..  where 상세 조건을 달리 한다.
        let _range_sql;
        let _replacements= [];
        let _sql =``;
        switch(req.query.type) {
            case 'daily': 
                _range_sql = " LIKE ? ";
                _replacements = [_year, _yearmonth+'%',_yearmonth+'%', _gamecode];

                _sql=`
                SELECT 
                    target_cal.m, IFNULL(stat_data.count, 0) AS count
                FROM
                    (SELECT 
                        ymd AS m
                    FROM
                        (SELECT 
                        WEEK(dt) w,
                            DATE_FORMAT(dt, '%Y-%m-%d') ymd,
                            DATE_FORMAT(dt, '%Y%m') ym,
                            DAY(dt) d,
                            DATE_FORMAT(dt, '%d') zerofilld,
                            DAYOFWEEK(dt) dw
                    FROM
                        (SELECT 
                        CONCAT(y, '0101') + INTERVAL a * 100 + b * 10 + c DAY dt
                    FROM
                        (SELECT 0 a UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3) a, (SELECT 0 b UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) b, (SELECT 0 c UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) c, (SELECT ? y) d
                    WHERE
                        a * 100 + b * 10 + c < DAYOFYEAR(CONCAT(y, '1231'))) a
                    ORDER BY ym , d) AS cal
                    WHERE
                        ymd `+_range_sql+`) AS target_cal
                        LEFT OUTER JOIN
                    (SELECT 
                        log.m, COUNT(idx) AS count
                    FROM
                        (SELECT 
                        *, DATE_FORMAT(regit_date, '%Y-%m-%d') m
                    FROM
                        log_game_using
                    WHERE
                        regit_date `+_range_sql+`
                            AND game_type = ?) AS log
                    GROUP BY log.m) AS stat_data ON target_cal.m = stat_data.m
                ORDER BY m                
                `;
                break;
            case 'weekly': 
                _range_sql = " BETWEEN ? and ?  ";
                _replacement = [_year, _start,_end,_start,_end];            
                break;
            case 'monthly':  
                _range_sql = " LIKE ? ";
                _replacement = [_year, _yearmonth+'%',_yearmonth+'%'];               
                break;
            default : 
        }

        models.sequelizes.LogDB.query(_sql, {
            replacements: _replacements,
            type: models.Sequelize.QueryTypes.SELECT,
            raw:true
        })
        .then((statLog)=>{
            let ResResult={};
            ResResult = statLog;

            res.jsonp({...ResponseCode.OK, result: ResResult})
        });

    },

    /** 유저의 월별 타이핑 정확도 & 속도 */
    getUserTypingByMonth(req, res) {
        console.log(`[StatisticsController.getUserTypingByMonth] req.query: %j`, req.query);

        let _uuid = req.query.uuid;
        let _yearmonth = req.query.yearmonth;
        let ResResult={};

        let _table = "TbTypingAcc_"+_yearmonth;
        //let _sql = 'SELECT InputTotalCount,TotalAcc,Day,Idx FROM '+_table+' WHERE UUID=? ';
        let _sql = `
        SELECT 
            rd2.Day AS Day,
            LanguageCode.LanguageName,
            rd2.avgAcc AS avgAcc
        FROM
            (SELECT 
                MIN(zerofillDay) AS Day,
                    MIN(Language) AS LanguageCode,
                    ROUND(AVG(IFNULL(acc, 0)), 0) AS avgAcc
            FROM
                (SELECT 
                IF(day < 10, CONCAT('0', day), day) AS zerofillDay,
                    Language,
                    (ROUND(TotalAcc / InputTotalCount * 100, 0)) AS acc
            FROM
                `+_table+`
            WHERE
                UUID = ?) AS rd
            GROUP BY rd.zerofillDay , Language) AS rd2
                LEFT OUTER JOIN
            (SELECT 0 AS LanguageCode, '한글두벌식' AS LanguageName UNION ALL SELECT 1, '영어 쿼티' UNION ALL SELECT 2, '영어 드보락' UNION ALL SELECT 3, '한글 세벌식 390' UNION ALL SELECT 4, '한글 세벌식 순아래' UNION ALL SELECT 5, '한글 세벌식') AS LanguageCode ON rd2.LanguageCode = LanguageCode.LanguageCode
        `;

        let _replacements = [_uuid];

        models.sequelizes.WebDB.query(_sql, {
            replacements: _replacements,
            type: models.Sequelize.QueryTypes.SELECT,
            raw:true
        })
        .then((statLog)=>{
            let ResResult={};
            ResResult.acc = statLog;

            _table =  "TbTwoTypingSpeed_"+_yearmonth;
            //_sql = 'SELECT Day,TotalInputcount,TotalSpeedCount FROM '+_table+' WHERE UUID=? ';

            _sql =`
            SELECT 
            rd2.Day AS Day,
            LanguageCode.LanguageName,
            rd2.avgSpeed AS avgSpeed
            FROM
                (SELECT 
                    MIN(zerofillDay) AS Day,
                        MIN(Language) AS LanguageCode,
                        ROUND(AVG(IFNULL(speed, 0)), 0) AS avgSpeed
                FROM
                    (SELECT 
                    IF(day < 10, CONCAT('0', day), day) AS zerofillDay,
                        Language,
                        TotalSpeedCount AS speed
                FROM
                    `+_table+`
                WHERE
                    UUID = ?) AS rd
                GROUP BY rd.zerofillDay , Language) AS rd2
                    LEFT OUTER JOIN
                (SELECT 0 AS LanguageCode, '한글두벌식' AS LanguageName UNION ALL SELECT 1, '영어 쿼티' UNION ALL SELECT 2, '영어 드보락' UNION ALL SELECT 3, '한글 세벌식 390' UNION ALL SELECT 4, '한글 세벌식 순아래' UNION ALL SELECT 5, '한글 세벌식') AS LanguageCode ON rd2.LanguageCode = LanguageCode.LanguageCode            
            `            

            models.sequelizes.GameDB.query(_sql, {
                replacements: _replacements,
                type: models.Sequelize.QueryTypes.SELECT,
                raw:true
            })
            .then(rs=>{
                ResResult.speed = rs;
                res.jsonp({...ResponseCode.OK, result: ResResult})
            })
        });
    },

    /** 자리연습 통계 */
    getDailyLkpStat(req, res){
        console.log(`[StatisticsController.getDailyLkpStat] req.query: %j`, req.query);
        let dateArr = String(req.query.yearmonth).split('-');
        let _year = dateArr[0];
        let _yearEmp = req.query.yearmonth+'%';
        
        _sql_using = `
        SELECT 
            target_cal.m AS m, ifnull(stat.cnt,0) as cnt 
        FROM 
            (SELECT 
                ymd AS m 
            FROM 
                (SELECT 
                WEEK(dt) w, 
                    DATE_FORMAT(dt, '%Y-%m-%d') ymd, 
                    DATE_FORMAT(dt, '%Y%m') ym, 
                    DAY(dt) d, 
                    DATE_FORMAT(dt, '%d') zerofilld, 
                    DAYOFWEEK(dt) dw 
            FROM 
                (SELECT 
                CONCAT(y, '0101') + INTERVAL a * 100 + b * 10 + c DAY dt 
            FROM 
                (SELECT 0 a UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3) a, 
                (SELECT 0 b 
                    UNION ALL SELECT 1 
                    UNION ALL SELECT 2 
                    UNION ALL SELECT 3 
                    UNION ALL SELECT 4 
                    UNION ALL SELECT 5 
                    UNION ALL SELECT 6 
                    UNION ALL SELECT 7 
                    UNION ALL SELECT 8 
                    UNION ALL SELECT 9) b, 
                (SELECT 0 c 
                    UNION ALL SELECT 1 
                    UNION ALL SELECT 2 
                    UNION ALL SELECT 3 
                    UNION ALL SELECT 4 
                    UNION ALL SELECT 5 
                    UNION ALL SELECT 6 
                    UNION ALL SELECT 7 
                    UNION ALL SELECT 8 
                    UNION ALL SELECT 9) c, 
                (SELECT ? y) d 
            WHERE 
                a * 100 + b * 10 + c < DAYOFYEAR(CONCAT(y, '1231'))) a 
            ORDER BY ym , d) AS cal 
            WHERE 
                ymd LIKE ? ) AS target_cal 
                LEFT OUTER JOIN 
            (SELECT 
                DATE_FORMAT(regit_date, '%Y-%m-%d') m, COUNT(*) AS cnt 
            FROM 
                log_game_using
            WHERE 
                regit_date like ? and  typing_midle_kind = 1
            GROUP BY m) AS stat ON target_cal.m = stat.m 
        ORDER BY m        
        `;

        _sql_bylevel = `
        SELECT 
            target_cal.m AS m
            , level1
            , level2
            , level3
            , level4
            , level5
            , level6
            , level7
            , level8
        FROM 
            (SELECT 
                ymd AS m 
            FROM 
                (SELECT 
                WEEK(dt) w, 
                    DATE_FORMAT(dt, '%Y-%m-%d') ymd, 
                    DATE_FORMAT(dt, '%Y%m') ym, 
                    DAY(dt) d, 
                    DATE_FORMAT(dt, '%d') zerofilld, 
                    DAYOFWEEK(dt) dw 
            FROM 
                (SELECT 
                CONCAT(y, '0101') + INTERVAL a * 100 + b * 10 + c DAY dt 
            FROM 
                (SELECT 0 a UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3) a, 
                (SELECT 0 b 
                    UNION ALL SELECT 1 
                    UNION ALL SELECT 2 
                    UNION ALL SELECT 3 
                    UNION ALL SELECT 4 
                    UNION ALL SELECT 5 
                    UNION ALL SELECT 6 
                    UNION ALL SELECT 7 
                    UNION ALL SELECT 8 
                    UNION ALL SELECT 9) b, 
                (SELECT 0 c 
                    UNION ALL SELECT 1 
                    UNION ALL SELECT 2 
                    UNION ALL SELECT 3 
                    UNION ALL SELECT 4 
                    UNION ALL SELECT 5 
                    UNION ALL SELECT 6 
                    UNION ALL SELECT 7 
                    UNION ALL SELECT 8 
                    UNION ALL SELECT 9) c, 
                (SELECT ? y) d 
            WHERE 
                a * 100 + b * 10 + c < DAYOFYEAR(CONCAT(y, '1231'))) a 
            ORDER BY ym , d) AS cal 
            WHERE 
                ymd LIKE ? ) AS target_cal 
                LEFT OUTER JOIN 
            (select 
                m 
                ,( if(typing_small_kind = 1 , cnt, 0 ) ) as level1
                ,( if(typing_small_kind = 2 , cnt, 0 ) ) as level2
                ,( if(typing_small_kind = 3 , cnt, 0 ) ) as level3
                ,( if(typing_small_kind = 4 , cnt, 0 ) ) as level4
                ,( if(typing_small_kind = 5 , cnt, 0 ) ) as level5
                ,( if(typing_small_kind = 6 , cnt, 0 ) ) as level6
                ,( if(typing_small_kind = 7 , cnt, 0 ) ) as level7
                ,( if(typing_small_kind = 8 , cnt, 0 ) ) as level8
                from
                (
                select
                m, typing_small_kind, count(idx) as cnt
                from 
                (
                                        SELECT 
                                            idx, DATE_FORMAT(regit_date, '%Y-%m-%d') m , typing_small_kind
                                        FROM 
                                            log_game_using
                                        WHERE 
                                            regit_date like ? and  typing_midle_kind = 1
                ) as dd      
                group by m, typing_small_kind
                ) as ee ) AS stat ON target_cal.m = stat.m 
        ORDER BY m        
        `;
        
        Promise.all([
            models.sequelizes.LogDB.query(_sql_using, {
                replacements: [_year, _yearEmp, _yearEmp],
                type: models.Sequelize.QueryTypes.SELECT,
                raw:true
            }),
            models.sequelizes.LogDB.query(_sql_bylevel, {
                replacements: [_year, _yearEmp, _yearEmp],
                type: models.Sequelize.QueryTypes.SELECT,
                raw:true
            })
        ])
        .then((statLog)=>{
            let ResResult={};
            ResResult.usingLog = statLog[0];
            ResResult.byLevelLog = statLog[1];

            res.jsonp({...ResponseCode.OK, result: ResResult})
        });
    },
    getWeeklyLkpStat(req, res){
        console.log(`[StatisticsController.getWeeklyLkpStat] req.query: %j`, req.query);
        let dateArr = String(req.query.start_date).split('-');
        let _year = dateArr[0];  
        let _week = req.query.week;
        let _start = req.query.start_date+' 00:00:00';
        let _end = req.query.end_date+' 23:59:59';
        
        _sql_using = `
        SELECT 
            target_cal.m AS m, ifnull(stat.cnt,0) as cnt 
        FROM 
            (SELECT 
                ymd AS m 
            FROM 
                (SELECT 
                WEEK(dt) w, 
                    DATE_FORMAT(dt, '%Y-%m-%d') ymd, 
                    DATE_FORMAT(dt, '%Y%m') ym, 
                    DAY(dt) d, 
                    DATE_FORMAT(dt, '%d') zerofilld, 
                    DAYOFWEEK(dt) dw 
            FROM 
                (SELECT 
                CONCAT(y, '0101') + INTERVAL a * 100 + b * 10 + c DAY dt 
            FROM 
                (SELECT 0 a UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3) a, 
                (SELECT 0 b 
                    UNION ALL SELECT 1 
                    UNION ALL SELECT 2 
                    UNION ALL SELECT 3 
                    UNION ALL SELECT 4 
                    UNION ALL SELECT 5 
                    UNION ALL SELECT 6 
                    UNION ALL SELECT 7 
                    UNION ALL SELECT 8 
                    UNION ALL SELECT 9) b, 
                (SELECT 0 c 
                    UNION ALL SELECT 1 
                    UNION ALL SELECT 2 
                    UNION ALL SELECT 3 
                    UNION ALL SELECT 4 
                    UNION ALL SELECT 5 
                    UNION ALL SELECT 6 
                    UNION ALL SELECT 7 
                    UNION ALL SELECT 8 
                    UNION ALL SELECT 9) c, 
                (SELECT ? y) d 
            WHERE 
                a * 100 + b * 10 + c < DAYOFYEAR(CONCAT(y, '1231'))) a 
            ORDER BY ym , d) AS cal 
            WHERE 
                w = ? ) AS target_cal 
                LEFT OUTER JOIN 
            (SELECT 
                DATE_FORMAT(regit_date, '%Y-%m-%d') m, COUNT(*) AS cnt 
            FROM 
                log_game_using
            WHERE 
                regit_date between ? and ?  and  typing_midle_kind = 1
            GROUP BY m) AS stat ON target_cal.m = stat.m 
        ORDER BY m        
        `;

        _sql_bylevel = `
        SELECT 
            target_cal.m AS m
            , level1
            , level2
            , level3
            , level4
            , level5
            , level6
            , level7
            , level8
        FROM 
            (SELECT 
                ymd AS m 
            FROM 
                (SELECT 
                WEEK(dt) w, 
                    DATE_FORMAT(dt, '%Y-%m-%d') ymd, 
                    DATE_FORMAT(dt, '%Y%m') ym, 
                    DAY(dt) d, 
                    DATE_FORMAT(dt, '%d') zerofilld, 
                    DAYOFWEEK(dt) dw 
            FROM 
                (SELECT 
                CONCAT(y, '0101') + INTERVAL a * 100 + b * 10 + c DAY dt 
            FROM 
                (SELECT 0 a UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3) a, 
                (SELECT 0 b 
                    UNION ALL SELECT 1 
                    UNION ALL SELECT 2 
                    UNION ALL SELECT 3 
                    UNION ALL SELECT 4 
                    UNION ALL SELECT 5 
                    UNION ALL SELECT 6 
                    UNION ALL SELECT 7 
                    UNION ALL SELECT 8 
                    UNION ALL SELECT 9) b, 
                (SELECT 0 c 
                    UNION ALL SELECT 1 
                    UNION ALL SELECT 2 
                    UNION ALL SELECT 3 
                    UNION ALL SELECT 4 
                    UNION ALL SELECT 5 
                    UNION ALL SELECT 6 
                    UNION ALL SELECT 7 
                    UNION ALL SELECT 8 
                    UNION ALL SELECT 9) c, 
                (SELECT ? y) d 
            WHERE 
                a * 100 + b * 10 + c < DAYOFYEAR(CONCAT(y, '1231'))) a 
            ORDER BY ym , d) AS cal 
            WHERE 
                w = ? ) AS target_cal 
                LEFT OUTER JOIN 
            (select 
                m 
                ,( if(typing_small_kind = 1 , cnt, 0 ) ) as level1
                ,( if(typing_small_kind = 2 , cnt, 0 ) ) as level2
                ,( if(typing_small_kind = 3 , cnt, 0 ) ) as level3
                ,( if(typing_small_kind = 4 , cnt, 0 ) ) as level4
                ,( if(typing_small_kind = 5 , cnt, 0 ) ) as level5
                ,( if(typing_small_kind = 6 , cnt, 0 ) ) as level6
                ,( if(typing_small_kind = 7 , cnt, 0 ) ) as level7
                ,( if(typing_small_kind = 8 , cnt, 0 ) ) as level8
                from
                (
                select
                m, typing_small_kind, count(idx) as cnt
                from 
                (
                    SELECT 
                        idx, DATE_FORMAT(regit_date, '%Y-%m-%d') m , typing_small_kind
                    FROM 
                        log_game_using
                    WHERE 
                        regit_date between ? and ? and  typing_midle_kind = 1
                ) as dd      
                group by m, typing_small_kind
                ) as ee ) AS stat ON target_cal.m = stat.m 
        ORDER BY m        
        `;
        
        Promise.all([
            models.sequelizes.LogDB.query(_sql_using, {
                replacements: [_year, _week, _start, _end],
                type: models.Sequelize.QueryTypes.SELECT,
                raw:true
            }),
            models.sequelizes.LogDB.query(_sql_bylevel, {
                replacements: [_year, _week, _start, _end],
                type: models.Sequelize.QueryTypes.SELECT,
                raw:true
            })
        ])
        .then((statLog)=>{
            let ResResult={};
            ResResult.usingLog = statLog[0];
            ResResult.byLevelLog = statLog[1];

            res.jsonp({...ResponseCode.OK, result: ResResult})
        });        
    },
    getMonthlyLkpStat(req, res){
        console.log(`[StatisticsController.getMonthlyLkpStat] req.query: %j`, req.query);

        let dateArr = String(req.query.yearmonth).split('-');
        let _year = dateArr[0]; 
        let _yearEmp= _year+'%';        

        _sql_using = `
        SELECT 
            ym_list.ym AS m, ifnull(stat.cnt,0) as cnt 
                    FROM 
                    (SELECT 
                        DATE_FORMAT(CONCAT(y, a, '01'), '%Y-%m') ym 
                    FROM 
                        (SELECT '01' a 
                            UNION ALL SELECT '02' 
                            UNION ALL SELECT '03' 
                            UNION ALL SELECT '04' 
                            UNION ALL SELECT '05' 
                            UNION ALL SELECT '06' 
                            UNION ALL SELECT '07' 
                            UNION ALL SELECT '08' 
                            UNION ALL SELECT '09' 
                            UNION ALL SELECT '10' 
                            UNION ALL SELECT '11' 
                            UNION ALL SELECT '12') a, (SELECT ? y) d 
                    ORDER BY ym) ym_list 
                LEFT OUTER JOIN 
            (SELECT 
                DATE_FORMAT(regit_date, '%Y-%m') ym, COUNT(*) AS cnt 
            FROM 
                log_game_using
            WHERE 
                regit_date LIKE ?  and  typing_midle_kind = 1
            GROUP BY ym) AS stat ON ym_list.ym = stat.ym 
        ORDER BY ym_list.ym        
        `;

        _sql_bylevel = `
        SELECT 
        ym_list.ym AS m
        ,( if(stat.level1 , stat.level1, 0 ) ) as level1
		,( if(stat.level2 , stat.level2, 0 ) ) as level2
		,( if(stat.level3 , stat.level3, 0 ) ) as level3
		,( if(stat.level4 , stat.level4, 0 ) ) as level4
		,( if(stat.level5 , stat.level5, 0 ) ) as level5
		,( if(stat.level6 , stat.level6, 0 ) ) as level6
		,( if(stat.level7 , stat.level7, 0 ) ) as level7
		,( if(stat.level8 , stat.level8, 0 ) ) as level8
        FROM 
           (SELECT 
               DATE_FORMAT(CONCAT(y, a, '01'), '%Y-%m') ym 
           FROM 
               (SELECT '01' a 
                   UNION ALL SELECT '02' 
                   UNION ALL SELECT '03' 
                   UNION ALL SELECT '04' 
                   UNION ALL SELECT '05' 
                   UNION ALL SELECT '06' 
                   UNION ALL SELECT '07' 
                   UNION ALL SELECT '08' 
                   UNION ALL SELECT '09' 
                   UNION ALL SELECT '10' 
                   UNION ALL SELECT '11' 
                   UNION ALL SELECT '12') a, (SELECT ? y) d 
           ORDER BY ym) ym_list 
                LEFT OUTER JOIN 
            (select 
                ym 
                ,( sum(if(typing_small_kind = 1 , cnt, 0 )) ) as level1
                ,( sum(if(typing_small_kind = 2 , cnt, 0 )) ) as level2
                ,( sum(if(typing_small_kind = 3 , cnt, 0 )) ) as level3
                ,( sum(if(typing_small_kind = 4 , cnt, 0 )) ) as level4
                ,( sum(if(typing_small_kind = 5 , cnt, 0 )) ) as level5
                ,( sum(if(typing_small_kind = 6 , cnt, 0 )) ) as level6
                ,( sum(if(typing_small_kind = 7 , cnt, 0 )) ) as level7
                ,( sum(if(typing_small_kind = 8 , cnt, 0 )) ) as level8
                from
                (
                select
                ym, typing_small_kind, count(idx) as cnt
                from 
                (
                    SELECT 
                        idx, DATE_FORMAT(regit_date, '%Y-%m') ym , typing_small_kind
                    FROM 
                        log_game_using
                    WHERE 
                        regit_date LIKE ? and  typing_midle_kind = 1
                ) as dd      
                group by ym, typing_small_kind
                ) as ee group by ee.ym) AS stat ON ym_list.ym = stat.ym 
        ORDER BY ym_list.ym        
        `;
        
        Promise.all([
            models.sequelizes.LogDB.query(_sql_using, {
                replacements: [_year, _yearEmp],
                type: models.Sequelize.QueryTypes.SELECT,
                raw:true
            }),
            models.sequelizes.LogDB.query(_sql_bylevel, {
                replacements: [_year, _yearEmp],
                type: models.Sequelize.QueryTypes.SELECT,
                raw:true
            })
        ])
        .then((statLog)=>{
            let ResResult={};
            ResResult.usingLog = statLog[0];
            ResResult.byLevelLog = statLog[1];

            res.jsonp({...ResponseCode.OK, result: ResResult})
        });          
    },



    /** 낱말연습 통계 */
    getDailyEwtStat(req, res){
        console.log(`[StatisticsController.getDailyEwtStat] req.query: %j`, req.query);
        let dateArr = String(req.query.yearmonth).split('-');
        let _year = dateArr[0];
        let _yearEmp = req.query.yearmonth+'%';
        
        _sql_using = `
        SELECT 
            target_cal.m AS m, ifnull(stat.cnt,0) as cnt 
        FROM 
            (SELECT 
                ymd AS m 
            FROM 
                (SELECT 
                WEEK(dt) w, 
                    DATE_FORMAT(dt, '%Y-%m-%d') ymd, 
                    DATE_FORMAT(dt, '%Y%m') ym, 
                    DAY(dt) d, 
                    DATE_FORMAT(dt, '%d') zerofilld, 
                    DAYOFWEEK(dt) dw 
            FROM 
                (SELECT 
                CONCAT(y, '0101') + INTERVAL a * 100 + b * 10 + c DAY dt 
            FROM 
                (SELECT 0 a UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3) a, 
                (SELECT 0 b 
                    UNION ALL SELECT 1 
                    UNION ALL SELECT 2 
                    UNION ALL SELECT 3 
                    UNION ALL SELECT 4 
                    UNION ALL SELECT 5 
                    UNION ALL SELECT 6 
                    UNION ALL SELECT 7 
                    UNION ALL SELECT 8 
                    UNION ALL SELECT 9) b, 
                (SELECT 0 c 
                    UNION ALL SELECT 1 
                    UNION ALL SELECT 2 
                    UNION ALL SELECT 3 
                    UNION ALL SELECT 4 
                    UNION ALL SELECT 5 
                    UNION ALL SELECT 6 
                    UNION ALL SELECT 7 
                    UNION ALL SELECT 8 
                    UNION ALL SELECT 9) c, 
                (SELECT ? y) d 
            WHERE 
                a * 100 + b * 10 + c < DAYOFYEAR(CONCAT(y, '1231'))) a 
            ORDER BY ym , d) AS cal 
            WHERE 
                ymd LIKE ? ) AS target_cal 
                LEFT OUTER JOIN 
            (SELECT 
                DATE_FORMAT(regit_date, '%Y-%m-%d') m, COUNT(*) AS cnt 
            FROM 
                log_game_using
            WHERE 
                regit_date like ? and  typing_midle_kind = 2
            GROUP BY m) AS stat ON target_cal.m = stat.m 
        ORDER BY m        
        `;

        _sql_bylevel = `
        SELECT 
            target_cal.m AS m
            , level1
            , level2
            , level3
            , level4
            , level5
            , level6
            , level7
            , level8
        FROM 
            (SELECT 
                ymd AS m 
            FROM 
                (SELECT 
                WEEK(dt) w, 
                    DATE_FORMAT(dt, '%Y-%m-%d') ymd, 
                    DATE_FORMAT(dt, '%Y%m') ym, 
                    DAY(dt) d, 
                    DATE_FORMAT(dt, '%d') zerofilld, 
                    DAYOFWEEK(dt) dw 
            FROM 
                (SELECT 
                CONCAT(y, '0101') + INTERVAL a * 100 + b * 10 + c DAY dt 
            FROM 
                (SELECT 0 a UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3) a, 
                (SELECT 0 b 
                    UNION ALL SELECT 1 
                    UNION ALL SELECT 2 
                    UNION ALL SELECT 3 
                    UNION ALL SELECT 4 
                    UNION ALL SELECT 5 
                    UNION ALL SELECT 6 
                    UNION ALL SELECT 7 
                    UNION ALL SELECT 8 
                    UNION ALL SELECT 9) b, 
                (SELECT 0 c 
                    UNION ALL SELECT 1 
                    UNION ALL SELECT 2 
                    UNION ALL SELECT 3 
                    UNION ALL SELECT 4 
                    UNION ALL SELECT 5 
                    UNION ALL SELECT 6 
                    UNION ALL SELECT 7 
                    UNION ALL SELECT 8 
                    UNION ALL SELECT 9) c, 
                (SELECT ? y) d 
            WHERE 
                a * 100 + b * 10 + c < DAYOFYEAR(CONCAT(y, '1231'))) a 
            ORDER BY ym , d) AS cal 
            WHERE 
                ymd LIKE ? ) AS target_cal 
                LEFT OUTER JOIN 
            (select 
                m 
                ,( if(typing_small_kind = 1 , cnt, 0 ) ) as level1
                ,( if(typing_small_kind = 2 , cnt, 0 ) ) as level2
                ,( if(typing_small_kind = 3 , cnt, 0 ) ) as level3
                ,( if(typing_small_kind = 4 , cnt, 0 ) ) as level4
                ,( if(typing_small_kind = 5 , cnt, 0 ) ) as level5
                ,( if(typing_small_kind = 6 , cnt, 0 ) ) as level6
                ,( if(typing_small_kind = 7 , cnt, 0 ) ) as level7
                ,( if(typing_small_kind = 8 , cnt, 0 ) ) as level8
                from
                (
                select
                m, typing_small_kind, count(idx) as cnt
                from 
                (
                                        SELECT 
                                            idx, DATE_FORMAT(regit_date, '%Y-%m-%d') m , typing_small_kind
                                        FROM 
                                            log_game_using
                                        WHERE 
                                            regit_date like ? and  typing_midle_kind = 2
                ) as dd      
                group by m, typing_small_kind
                ) as ee ) AS stat ON target_cal.m = stat.m 
        ORDER BY m        
        `;
        
        Promise.all([
            models.sequelizes.LogDB.query(_sql_using, {
                replacements: [_year, _yearEmp, _yearEmp],
                type: models.Sequelize.QueryTypes.SELECT,
                raw:true
            }),
            models.sequelizes.LogDB.query(_sql_bylevel, {
                replacements: [_year, _yearEmp, _yearEmp],
                type: models.Sequelize.QueryTypes.SELECT,
                raw:true
            })
        ])
        .then((statLog)=>{
            let ResResult={};
            ResResult.usingLog = statLog[0];
            ResResult.byLevelLog = statLog[1];

            res.jsonp({...ResponseCode.OK, result: ResResult})
        });
    },
    getWeeklyEwtStat(req, res){
        console.log(`[StatisticsController.getWeeklyEwtStat] req.query: %j`, req.query);
        let dateArr = String(req.query.start_date).split('-');
        let _year = dateArr[0];  
        let _week = req.query.week;
        let _start = req.query.start_date+' 00:00:00';
        let _end = req.query.end_date+' 23:59:59';
        
        _sql_using = `
        SELECT 
            target_cal.m AS m, ifnull(stat.cnt,0) as cnt 
        FROM 
            (SELECT 
                ymd AS m 
            FROM 
                (SELECT 
                WEEK(dt) w, 
                    DATE_FORMAT(dt, '%Y-%m-%d') ymd, 
                    DATE_FORMAT(dt, '%Y%m') ym, 
                    DAY(dt) d, 
                    DATE_FORMAT(dt, '%d') zerofilld, 
                    DAYOFWEEK(dt) dw 
            FROM 
                (SELECT 
                CONCAT(y, '0101') + INTERVAL a * 100 + b * 10 + c DAY dt 
            FROM 
                (SELECT 0 a UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3) a, 
                (SELECT 0 b 
                    UNION ALL SELECT 1 
                    UNION ALL SELECT 2 
                    UNION ALL SELECT 3 
                    UNION ALL SELECT 4 
                    UNION ALL SELECT 5 
                    UNION ALL SELECT 6 
                    UNION ALL SELECT 7 
                    UNION ALL SELECT 8 
                    UNION ALL SELECT 9) b, 
                (SELECT 0 c 
                    UNION ALL SELECT 1 
                    UNION ALL SELECT 2 
                    UNION ALL SELECT 3 
                    UNION ALL SELECT 4 
                    UNION ALL SELECT 5 
                    UNION ALL SELECT 6 
                    UNION ALL SELECT 7 
                    UNION ALL SELECT 8 
                    UNION ALL SELECT 9) c, 
                (SELECT ? y) d 
            WHERE 
                a * 100 + b * 10 + c < DAYOFYEAR(CONCAT(y, '1231'))) a 
            ORDER BY ym , d) AS cal 
            WHERE 
                w = ? ) AS target_cal 
                LEFT OUTER JOIN 
            (SELECT 
                DATE_FORMAT(regit_date, '%Y-%m-%d') m, COUNT(*) AS cnt 
            FROM 
                log_game_using
            WHERE 
                regit_date between ? and ?  and  typing_midle_kind = 2
            GROUP BY m) AS stat ON target_cal.m = stat.m 
        ORDER BY m        
        `;

        _sql_bylevel = `
        SELECT 
            target_cal.m AS m
            , level1
            , level2
            , level3
            , level4
            , level5
            , level6
            , level7
            , level8
        FROM 
            (SELECT 
                ymd AS m 
            FROM 
                (SELECT 
                WEEK(dt) w, 
                    DATE_FORMAT(dt, '%Y-%m-%d') ymd, 
                    DATE_FORMAT(dt, '%Y%m') ym, 
                    DAY(dt) d, 
                    DATE_FORMAT(dt, '%d') zerofilld, 
                    DAYOFWEEK(dt) dw 
            FROM 
                (SELECT 
                CONCAT(y, '0101') + INTERVAL a * 100 + b * 10 + c DAY dt 
            FROM 
                (SELECT 0 a UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3) a, 
                (SELECT 0 b 
                    UNION ALL SELECT 1 
                    UNION ALL SELECT 2 
                    UNION ALL SELECT 3 
                    UNION ALL SELECT 4 
                    UNION ALL SELECT 5 
                    UNION ALL SELECT 6 
                    UNION ALL SELECT 7 
                    UNION ALL SELECT 8 
                    UNION ALL SELECT 9) b, 
                (SELECT 0 c 
                    UNION ALL SELECT 1 
                    UNION ALL SELECT 2 
                    UNION ALL SELECT 3 
                    UNION ALL SELECT 4 
                    UNION ALL SELECT 5 
                    UNION ALL SELECT 6 
                    UNION ALL SELECT 7 
                    UNION ALL SELECT 8 
                    UNION ALL SELECT 9) c, 
                (SELECT ? y) d 
            WHERE 
                a * 100 + b * 10 + c < DAYOFYEAR(CONCAT(y, '1231'))) a 
            ORDER BY ym , d) AS cal 
            WHERE 
                w = ? ) AS target_cal 
                LEFT OUTER JOIN 
            (select 
                m 
                ,( if(typing_small_kind = 1 , cnt, 0 ) ) as level1
                ,( if(typing_small_kind = 2 , cnt, 0 ) ) as level2
                ,( if(typing_small_kind = 3 , cnt, 0 ) ) as level3
                ,( if(typing_small_kind = 4 , cnt, 0 ) ) as level4
                ,( if(typing_small_kind = 5 , cnt, 0 ) ) as level5
                ,( if(typing_small_kind = 6 , cnt, 0 ) ) as level6
                ,( if(typing_small_kind = 7 , cnt, 0 ) ) as level7
                ,( if(typing_small_kind = 8 , cnt, 0 ) ) as level8
                from
                (
                select
                m, typing_small_kind, count(idx) as cnt
                from 
                (
                    SELECT 
                        idx, DATE_FORMAT(regit_date, '%Y-%m-%d') m , typing_small_kind
                    FROM 
                        log_game_using
                    WHERE 
                        regit_date between ? and ? and  typing_midle_kind = 2
                ) as dd      
                group by m, typing_small_kind
                ) as ee ) AS stat ON target_cal.m = stat.m 
        ORDER BY m        
        `;
        
        Promise.all([
            models.sequelizes.LogDB.query(_sql_using, {
                replacements: [_year, _week, _start, _end],
                type: models.Sequelize.QueryTypes.SELECT,
                raw:true
            }),
            models.sequelizes.LogDB.query(_sql_bylevel, {
                replacements: [_year, _week, _start, _end],
                type: models.Sequelize.QueryTypes.SELECT,
                raw:true
            })
        ])
        .then((statLog)=>{
            let ResResult={};
            ResResult.usingLog = statLog[0];
            ResResult.byLevelLog = statLog[1];

            res.jsonp({...ResponseCode.OK, result: ResResult})
        });            
    },
    getMonthlyEwtStat(req, res){
        console.log(`[StatisticsController.getMonthlyEwtStat] req.query: %j`, req.query);
        let dateArr = String(req.query.yearmonth).split('-');
        let _year = dateArr[0]; 
        let _yearEmp= _year+'%';        

        _sql_using = `
        SELECT 
            ym_list.ym AS m, ifnull(stat.cnt,0) as cnt 
                    FROM 
                    (SELECT 
                        DATE_FORMAT(CONCAT(y, a, '01'), '%Y-%m') ym 
                    FROM 
                        (SELECT '01' a 
                            UNION ALL SELECT '02' 
                            UNION ALL SELECT '03' 
                            UNION ALL SELECT '04' 
                            UNION ALL SELECT '05' 
                            UNION ALL SELECT '06' 
                            UNION ALL SELECT '07' 
                            UNION ALL SELECT '08' 
                            UNION ALL SELECT '09' 
                            UNION ALL SELECT '10' 
                            UNION ALL SELECT '11' 
                            UNION ALL SELECT '12') a, (SELECT ? y) d 
                    ORDER BY ym) ym_list 
                LEFT OUTER JOIN 
            (SELECT 
                DATE_FORMAT(regit_date, '%Y-%m') ym, COUNT(*) AS cnt 
            FROM 
                log_game_using
            WHERE 
                regit_date LIKE ?  and  typing_midle_kind = 2
            GROUP BY ym) AS stat ON ym_list.ym = stat.ym 
        ORDER BY ym_list.ym        
        `;

        _sql_bylevel = `
        SELECT 
        ym_list.ym AS m
        ,( if(stat.level1 , stat.level1, 0 ) ) as level1
		,( if(stat.level2 , stat.level2, 0 ) ) as level2
		,( if(stat.level3 , stat.level3, 0 ) ) as level3
		,( if(stat.level4 , stat.level4, 0 ) ) as level4
		,( if(stat.level5 , stat.level5, 0 ) ) as level5
		,( if(stat.level6 , stat.level6, 0 ) ) as level6
		,( if(stat.level7 , stat.level7, 0 ) ) as level7
		,( if(stat.level8 , stat.level8, 0 ) ) as level8
        FROM 
           (SELECT 
               DATE_FORMAT(CONCAT(y, a, '01'), '%Y-%m') ym 
           FROM 
               (SELECT '01' a 
                   UNION ALL SELECT '02' 
                   UNION ALL SELECT '03' 
                   UNION ALL SELECT '04' 
                   UNION ALL SELECT '05' 
                   UNION ALL SELECT '06' 
                   UNION ALL SELECT '07' 
                   UNION ALL SELECT '08' 
                   UNION ALL SELECT '09' 
                   UNION ALL SELECT '10' 
                   UNION ALL SELECT '11' 
                   UNION ALL SELECT '12') a, (SELECT ? y) d 
           ORDER BY ym) ym_list 
                LEFT OUTER JOIN 
            (select 
                ym 
                ,( sum(if(typing_small_kind = 1 , cnt, 0 )) ) as level1
                ,( sum(if(typing_small_kind = 2 , cnt, 0 )) ) as level2
                ,( sum(if(typing_small_kind = 3 , cnt, 0 )) ) as level3
                ,( sum(if(typing_small_kind = 4 , cnt, 0 )) ) as level4
                ,( sum(if(typing_small_kind = 5 , cnt, 0 )) ) as level5
                ,( sum(if(typing_small_kind = 6 , cnt, 0 )) ) as level6
                ,( sum(if(typing_small_kind = 7 , cnt, 0 )) ) as level7
                ,( sum(if(typing_small_kind = 8 , cnt, 0 )) ) as level8
                from
                (
                select
                ym, typing_small_kind, count(idx) as cnt
                from 
                (
                    SELECT 
                        idx, DATE_FORMAT(regit_date, '%Y-%m') ym , typing_small_kind
                    FROM 
                        log_game_using
                    WHERE 
                        regit_date LIKE ? and  typing_midle_kind = 2
                ) as dd      
                group by ym, typing_small_kind
                ) as ee group by ee.ym) AS stat ON ym_list.ym = stat.ym 
        ORDER BY ym_list.ym        
        `;
        
        Promise.all([
            models.sequelizes.LogDB.query(_sql_using, {
                replacements: [_year, _yearEmp],
                type: models.Sequelize.QueryTypes.SELECT,
                raw:true
            }),
            models.sequelizes.LogDB.query(_sql_bylevel, {
                replacements: [_year, _yearEmp],
                type: models.Sequelize.QueryTypes.SELECT,
                raw:true
            })
        ])
        .then((statLog)=>{
            let ResResult={};
            ResResult.usingLog = statLog[0];
            ResResult.byLevelLog = statLog[1];

            res.jsonp({...ResponseCode.OK, result: ResResult})
        });               
    },
    
    /** 짧은글연습 통계 */
    getDailyEstStat(req, res){
        console.log(`[StatisticsController.getDailyEstStat] req.query: %j`, req.query);
        let dateArr = String(req.query.yearmonth).split('-');
        let _year = dateArr[0];
        let _yearEmp = req.query.yearmonth+'%';
        
        _sql_using = `
        SELECT 
            target_cal.m AS m, ifnull(stat.cnt,0) as cnt 
        FROM 
            (SELECT 
                ymd AS m 
            FROM 
                (SELECT 
                WEEK(dt) w, 
                    DATE_FORMAT(dt, '%Y-%m-%d') ymd, 
                    DATE_FORMAT(dt, '%Y%m') ym, 
                    DAY(dt) d, 
                    DATE_FORMAT(dt, '%d') zerofilld, 
                    DAYOFWEEK(dt) dw 
            FROM 
                (SELECT 
                CONCAT(y, '0101') + INTERVAL a * 100 + b * 10 + c DAY dt 
            FROM 
                (SELECT 0 a UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3) a, 
                (SELECT 0 b 
                    UNION ALL SELECT 1 
                    UNION ALL SELECT 2 
                    UNION ALL SELECT 3 
                    UNION ALL SELECT 4 
                    UNION ALL SELECT 5 
                    UNION ALL SELECT 6 
                    UNION ALL SELECT 7 
                    UNION ALL SELECT 8 
                    UNION ALL SELECT 9) b, 
                (SELECT 0 c 
                    UNION ALL SELECT 1 
                    UNION ALL SELECT 2 
                    UNION ALL SELECT 3 
                    UNION ALL SELECT 4 
                    UNION ALL SELECT 5 
                    UNION ALL SELECT 6 
                    UNION ALL SELECT 7 
                    UNION ALL SELECT 8 
                    UNION ALL SELECT 9) c, 
                (SELECT ? y) d 
            WHERE 
                a * 100 + b * 10 + c < DAYOFYEAR(CONCAT(y, '1231'))) a 
            ORDER BY ym , d) AS cal 
            WHERE 
                ymd LIKE ? ) AS target_cal 
                LEFT OUTER JOIN 
            (SELECT 
                DATE_FORMAT(regit_date, '%Y-%m-%d') m, COUNT(*) AS cnt 
            FROM 
                log_game_using
            WHERE 
                regit_date like ? and  typing_midle_kind = 3
            GROUP BY m) AS stat ON target_cal.m = stat.m 
        ORDER BY m        
        `;

        _sql_bylevel = `
        select 
            target_cal.m AS m
            , ifnull(stat.avg_play_time_min,0) as avg_min
        from (
        SELECT
            ymd AS m
        FROM
            (SELECT
            WEEK(dt) w,
                DATE_FORMAT(dt, '%Y-%m-%d') ymd,
                DATE_FORMAT(dt, '%Y%m') ym,
                DAY(dt) d,
                DATE_FORMAT(dt, '%d') zerofilld,
                DAYOFWEEK(dt) dw
        FROM
            (SELECT
            CONCAT(y, '0101') + INTERVAL a * 100 + b * 10 + c DAY dt
        FROM
            (SELECT 0 a UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3) a,
            (SELECT 0 b
                UNION ALL SELECT 1
                UNION ALL SELECT 2
                UNION ALL SELECT 3
                UNION ALL SELECT 4
                UNION ALL SELECT 5
                UNION ALL SELECT 6
                UNION ALL SELECT 7
                UNION ALL SELECT 8
                UNION ALL SELECT 9) b,
            (SELECT 0 c
                UNION ALL SELECT 1
                UNION ALL SELECT 2
                UNION ALL SELECT 3
                UNION ALL SELECT 4
                UNION ALL SELECT 5
                UNION ALL SELECT 6
                UNION ALL SELECT 7
                UNION ALL SELECT 8
                UNION ALL SELECT 9) c,
            (SELECT ? y) d
        WHERE
            a * 100 + b * 10 + c < DAYOFYEAR(CONCAT(y, '1231'))) a
        ORDER BY ym , d) AS cal
        WHERE
            ymd LIKE ? 
        ) as target_cal  left outer join
        (
            select
            m
            , cnt
            , avg_play_time_min
            from
            (
                select
                m, count(idx) as cnt,  truncate( avg(play_time)/1000, 0 ) as avg_play_time_min
                from
                (
                    SELECT
                        idx, DATE_FORMAT(regit_date, '%Y-%m-%d') m, play_time
                    FROM
                        log_game_using
                    WHERE
                        regit_date like ? and  typing_midle_kind = 3
                ) as dd
                group by m ) as stat
        ) as stat 
        on target_cal.m = stat.m
        ORDER BY target_cal.m   
        `;
        
        Promise.all([
            models.sequelizes.LogDB.query(_sql_using, {
                replacements: [_year, _yearEmp, _yearEmp],
                type: models.Sequelize.QueryTypes.SELECT,
                raw:true
            }),
            models.sequelizes.LogDB.query(_sql_bylevel, {
                replacements: [_year, _yearEmp, _yearEmp],
                type: models.Sequelize.QueryTypes.SELECT,
                raw:true
            })
        ])
        .then((statLog)=>{
            let ResResult={};
            ResResult.usingLog = statLog[0];
            ResResult.byLevelLog = statLog[1];

            res.jsonp({...ResponseCode.OK, result: ResResult})
        });
    },
    getWeeklyEstStat(req, res){
        console.log(`[StatisticsController.getWeeklyEstStat] req.query: %j`, req.query);
        let dateArr = String(req.query.start_date).split('-');
        let _year = dateArr[0];  
        let _week = req.query.week;
        let _start = req.query.start_date+' 00:00:00';
        let _end = req.query.end_date+' 23:59:59';
        
        _sql_using = `
        SELECT 
            target_cal.m AS m, ifnull(stat.cnt,0) as cnt 
        FROM 
            (SELECT 
                ymd AS m 
            FROM 
                (SELECT 
                WEEK(dt) w, 
                    DATE_FORMAT(dt, '%Y-%m-%d') ymd, 
                    DATE_FORMAT(dt, '%Y%m') ym, 
                    DAY(dt) d, 
                    DATE_FORMAT(dt, '%d') zerofilld, 
                    DAYOFWEEK(dt) dw 
            FROM 
                (SELECT 
                CONCAT(y, '0101') + INTERVAL a * 100 + b * 10 + c DAY dt 
            FROM 
                (SELECT 0 a UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3) a, 
                (SELECT 0 b 
                    UNION ALL SELECT 1 
                    UNION ALL SELECT 2 
                    UNION ALL SELECT 3 
                    UNION ALL SELECT 4 
                    UNION ALL SELECT 5 
                    UNION ALL SELECT 6 
                    UNION ALL SELECT 7 
                    UNION ALL SELECT 8 
                    UNION ALL SELECT 9) b, 
                (SELECT 0 c 
                    UNION ALL SELECT 1 
                    UNION ALL SELECT 2 
                    UNION ALL SELECT 3 
                    UNION ALL SELECT 4 
                    UNION ALL SELECT 5 
                    UNION ALL SELECT 6 
                    UNION ALL SELECT 7 
                    UNION ALL SELECT 8 
                    UNION ALL SELECT 9) c, 
                (SELECT ? y) d 
            WHERE 
                a * 100 + b * 10 + c < DAYOFYEAR(CONCAT(y, '1231'))) a 
            ORDER BY ym , d) AS cal 
            WHERE 
                w = ? ) AS target_cal 
                LEFT OUTER JOIN 
            (SELECT 
                DATE_FORMAT(regit_date, '%Y-%m-%d') m, COUNT(*) AS cnt 
            FROM 
                log_game_using
            WHERE 
                regit_date between ? and ?  and  typing_midle_kind = 3
            GROUP BY m) AS stat ON target_cal.m = stat.m 
        ORDER BY m        
        `;

        _sql_bylevel = `
        select 
            target_cal.m AS m
            , ifnull(stat.avg_play_time_min,0) as avg_min
        from (
        SELECT
            ymd AS m
        FROM
            (SELECT
            WEEK(dt) w,
                DATE_FORMAT(dt, '%Y-%m-%d') ymd,
                DATE_FORMAT(dt, '%Y%m') ym,
                DAY(dt) d,
                DATE_FORMAT(dt, '%d') zerofilld,
                DAYOFWEEK(dt) dw
        FROM
            (SELECT
            CONCAT(y, '0101') + INTERVAL a * 100 + b * 10 + c DAY dt
        FROM
            (SELECT 0 a UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3) a,
            (SELECT 0 b
                UNION ALL SELECT 1
                UNION ALL SELECT 2
                UNION ALL SELECT 3
                UNION ALL SELECT 4
                UNION ALL SELECT 5
                UNION ALL SELECT 6
                UNION ALL SELECT 7
                UNION ALL SELECT 8
                UNION ALL SELECT 9) b,
            (SELECT 0 c
                UNION ALL SELECT 1
                UNION ALL SELECT 2
                UNION ALL SELECT 3
                UNION ALL SELECT 4
                UNION ALL SELECT 5
                UNION ALL SELECT 6
                UNION ALL SELECT 7
                UNION ALL SELECT 8
                UNION ALL SELECT 9) c,
            (SELECT ? y) d
        WHERE
            a * 100 + b * 10 + c < DAYOFYEAR(CONCAT(y, '1231'))) a
        ORDER BY ym , d) AS cal
        WHERE
            w = ?
        ) as target_cal  left outer join
        (
            select
            m
            , cnt
            , avg_play_time_min
            from
            (
                select
                m, count(idx) as cnt,  truncate( avg(play_time)/1000 ,0 ) as avg_play_time_min
                from
                (
                    SELECT
                        idx, DATE_FORMAT(regit_date, '%Y-%m-%d') m, play_time
                    FROM
                        log_game_using
                    WHERE
                        regit_date between ? and ? and  typing_midle_kind = 3
                ) as dd
                group by m ) as stat
        ) as stat 
        on target_cal.m = stat.m
        ORDER BY target_cal.m   
        `;
        
        Promise.all([
            models.sequelizes.LogDB.query(_sql_using, {
                replacements: [_year, _week, _start, _end],
                type: models.Sequelize.QueryTypes.SELECT,
                raw:true
            }),
            models.sequelizes.LogDB.query(_sql_bylevel, {
                replacements: [_year, _week, _start, _end],
                type: models.Sequelize.QueryTypes.SELECT,
                raw:true
            })
        ])
        .then((statLog)=>{
            let ResResult={};
            ResResult.usingLog = statLog[0];
            ResResult.byLevelLog = statLog[1];

            res.jsonp({...ResponseCode.OK, result: ResResult})
        });

    },
    getMonthlyEstStat(req, res){
        console.log(`[StatisticsController.getMonthlyEstStat] req.query: %j`, req.query);
        let dateArr = String(req.query.yearmonth).split('-');
        let _year = dateArr[0]; 
        let _yearEmp= _year+'%';
        
        let _year_month_query = `
        SELECT
            DATE_FORMAT(CONCAT(y, a, '01'), '%Y-%m') ym
        FROM
            (SELECT '01' a
                UNION ALL SELECT '02'
                UNION ALL SELECT '03'
                UNION ALL SELECT '04'
                UNION ALL SELECT '05'
                UNION ALL SELECT '06'
                UNION ALL SELECT '07'
                UNION ALL SELECT '08'
                UNION ALL SELECT '09'
                UNION ALL SELECT '10'
                UNION ALL SELECT '11'
                UNION ALL SELECT '12') a, (SELECT ? y) d
        ORDER BY ym 
        `;

        let _content_query1 = `
        SELECT 
            DATE_FORMAT(regit_date, '%Y-%m') ym, COUNT(*) AS cnt 
        FROM 
            log_game_using
        WHERE 
            regit_date like ?  and  typing_midle_kind = 3
        GROUP BY ym        
        `;

        let _content_query2 = `
        select
            ym, count(idx) as cnt,  truncate( avg(play_time)/1000,0 ) as avg_play_time_min
        from
        (
            SELECT
                idx, DATE_FORMAT(regit_date, '%Y-%m') ym, play_time
            FROM
                log_game_using
            WHERE
                regit_date LIKE ? and  typing_midle_kind = 3
        ) as dd
        group by ym 
        `;

        _sql_using = `
        SELECT 
            ym_list.ym AS m, ifnull(stat.cnt,0) as cnt 
        FROM 
            ( `+_year_month_query+`) ym_list 
                LEFT OUTER JOIN 
            ( `+_content_query1+`) AS stat ON ym_list.ym = stat.ym 
        ORDER BY ym_list.ym        
        `;

        _sql_bylevel = `
        select 
            ym_list.ym AS m
            , ifnull(stat.avg_play_time_min,0) as avg_min
        from (`+_year_month_query+`) ym_list  
                left outer join
             (`+_content_query2+`) as stat 
        on ym_list.ym = stat.ym
        ORDER BY ym_list.ym 
        `;
        
        Promise.all([
            models.sequelizes.LogDB.query(_sql_using, {
                replacements: [_year, _yearEmp],
                type: models.Sequelize.QueryTypes.SELECT,
                raw:true
            }),
            models.sequelizes.LogDB.query(_sql_bylevel, {
                replacements: [_year, _yearEmp],
                type: models.Sequelize.QueryTypes.SELECT,
                raw:true
            })
        ])
        .then((statLog)=>{
            let ResResult={};
            ResResult.usingLog = statLog[0];
            ResResult.byLevelLog = statLog[1];

            res.jsonp({...ResponseCode.OK, result: ResResult})
        });        
    },
    
    /** 긴글연습 통계 */
    getDailyEwrtStat(req, res){
        console.log(`[StatisticsController.getDailyEwrtStat] req.query: %j`, req.query);
        let dateArr = String(req.query.yearmonth).split('-');
        let _year = dateArr[0];
        let _yearEmp = req.query.yearmonth+'%';
        
        _calendar = `
        SELECT 
            ymd AS m 
        FROM 
            (SELECT 
            WEEK(dt) w, 
                DATE_FORMAT(dt, '%Y-%m-%d') ymd, 
                DATE_FORMAT(dt, '%Y%m') ym, 
                DAY(dt) d, 
                DATE_FORMAT(dt, '%d') zerofilld, 
                DAYOFWEEK(dt) dw 
        FROM 
            (SELECT 
            CONCAT(y, '0101') + INTERVAL a * 100 + b * 10 + c DAY dt 
        FROM 
            (SELECT 0 a UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3) a, 
            (SELECT 0 b 
                UNION ALL SELECT 1 
                UNION ALL SELECT 2 
                UNION ALL SELECT 3 
                UNION ALL SELECT 4 
                UNION ALL SELECT 5 
                UNION ALL SELECT 6 
                UNION ALL SELECT 7 
                UNION ALL SELECT 8 
                UNION ALL SELECT 9) b, 
            (SELECT 0 c 
                UNION ALL SELECT 1 
                UNION ALL SELECT 2 
                UNION ALL SELECT 3 
                UNION ALL SELECT 4 
                UNION ALL SELECT 5 
                UNION ALL SELECT 6 
                UNION ALL SELECT 7 
                UNION ALL SELECT 8 
                UNION ALL SELECT 9) c, 
            (SELECT ? y) d 
        WHERE 
            a * 100 + b * 10 + c < DAYOFYEAR(CONCAT(y, '1231'))) a 
        ORDER BY ym , d) AS cal 
        WHERE 
            ymd LIKE ?        
        `;

        _content_using = `
        SELECT 
            DATE_FORMAT(regit_date, '%Y-%m-%d') m, COUNT(*) AS cnt 
        FROM 
            log_game_using
        WHERE 
            regit_date like ? and  typing_midle_kind = 4
        GROUP BY m        
        `;

        _content_clear = `
        SELECT 
            DATE_FORMAT(regit_date, '%Y-%m-%d') m, COUNT(*) AS cnt 
        FROM 
            log_game_using
        WHERE 
            regit_date like ? and  typing_midle_kind = 4 and is_result = 1
        GROUP BY m        
        `;

        _content_playtime = `
        select
            m, count(idx) as cnt,  truncate( avg(play_time)/1000,0 ) as avg_play_time_min
        from
        (
            SELECT
                idx, DATE_FORMAT(regit_date, '%Y-%m-%d') m, play_time
            FROM
                log_game_using
            WHERE
                regit_date LIKE ? and  typing_midle_kind = 4
        ) as dd
        group by m        
        `;

        _sql_using = `
        SELECT 
            target_cal.m AS m, ifnull(stat.cnt,0) as cnt 
        FROM 
            ( `+_calendar+` ) AS target_cal 
                LEFT OUTER JOIN 
            ( `+_content_using+` ) AS stat ON target_cal.m = stat.m 
        ORDER BY m        
        `;

        _sql_clear = `
        SELECT 
            target_cal.m AS m, ifnull(stat.cnt,0) as cnt 
        FROM 
            ( `+_calendar+` ) AS target_cal 
                LEFT OUTER JOIN 
            ( `+_content_clear+` ) AS stat ON target_cal.m = stat.m 
        ORDER BY m        
        `;

        _sql_by_playtime = `
        SELECT 
            target_cal.m AS m
            , ifnull(stat.avg_play_time_min,0) as avg_min
        FROM 
            ( `+_calendar+` ) AS target_cal 
                LEFT OUTER JOIN 
            ( `+_content_playtime+` ) AS stat ON target_cal.m = stat.m 
        ORDER BY m        
        `;
        
        _sql_by_sentence = `
        SELECT 
            sentence_idx , COUNT(*) AS cnt 
        FROM 
            log_game_using
        WHERE 
            regit_date like ? and  typing_midle_kind = 4 
        GROUP BY sentence_idx       
        `;

        Promise.all([
            models.sequelizes.LogDB.query(_sql_using, {
                replacements: [_year, _yearEmp, _yearEmp],
                type: models.Sequelize.QueryTypes.SELECT,
                raw:true
            }),
            models.sequelizes.LogDB.query(_sql_clear, {
                replacements: [_year, _yearEmp, _yearEmp],
                type: models.Sequelize.QueryTypes.SELECT,
                raw:true
            }),            
            models.sequelizes.LogDB.query(_sql_by_playtime, {
                replacements: [_year, _yearEmp, _yearEmp],
                type: models.Sequelize.QueryTypes.SELECT,
                raw:true
            }),
            models.sequelizes.LogDB.query(_sql_by_sentence, {
                replacements: [_yearEmp],
                type: models.Sequelize.QueryTypes.SELECT,
                raw:true
            })
        ])
        .then((statLog)=>{
            let ResResult={};
            ResResult.usingLog = statLog[0];
            ResResult.byClear = statLog[1];
            ResResult.byPlaytime = statLog[2];
            ResResult.bySentence = statLog[3];

            res.jsonp({...ResponseCode.OK, result: ResResult})
        });
    },
    getWeeklyEwrtStat(req, res){
        console.log(`[StatisticsController.getWeeklyEwrtStat] req.query: %j`, req.query);
        let dateArr = String(req.query.start_date).split('-');
        let _year = dateArr[0];  
        let _week = req.query.week;
        let _start = req.query.start_date+' 00:00:00';
        let _end = req.query.end_date+' 23:59:59';
        
        _calendar = `
        SELECT 
            ymd AS m 
        FROM 
            (SELECT 
            WEEK(dt) w, 
                DATE_FORMAT(dt, '%Y-%m-%d') ymd, 
                DATE_FORMAT(dt, '%Y%m') ym, 
                DAY(dt) d, 
                DATE_FORMAT(dt, '%d') zerofilld, 
                DAYOFWEEK(dt) dw 
        FROM 
            (SELECT 
            CONCAT(y, '0101') + INTERVAL a * 100 + b * 10 + c DAY dt 
        FROM 
            (SELECT 0 a UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3) a, 
            (SELECT 0 b 
                UNION ALL SELECT 1 
                UNION ALL SELECT 2 
                UNION ALL SELECT 3 
                UNION ALL SELECT 4 
                UNION ALL SELECT 5 
                UNION ALL SELECT 6 
                UNION ALL SELECT 7 
                UNION ALL SELECT 8 
                UNION ALL SELECT 9) b, 
            (SELECT 0 c 
                UNION ALL SELECT 1 
                UNION ALL SELECT 2 
                UNION ALL SELECT 3 
                UNION ALL SELECT 4 
                UNION ALL SELECT 5 
                UNION ALL SELECT 6 
                UNION ALL SELECT 7 
                UNION ALL SELECT 8 
                UNION ALL SELECT 9) c, 
            (SELECT ? y) d 
        WHERE 
            a * 100 + b * 10 + c < DAYOFYEAR(CONCAT(y, '1231'))) a 
        ORDER BY ym , d) AS cal 
        WHERE 
            w = ?        
        `;

        _content_using = `
        SELECT 
            DATE_FORMAT(regit_date, '%Y-%m-%d') m, COUNT(*) AS cnt 
        FROM 
            log_game_using
        WHERE 
            regit_date between ? and ?  and  typing_midle_kind = 4
        GROUP BY m        
        `;

        _content_clear = `
        SELECT 
            DATE_FORMAT(regit_date, '%Y-%m-%d') m, COUNT(*) AS cnt 
        FROM 
            log_game_using
        WHERE 
            regit_date between ? and ?  and  typing_midle_kind = 4 and is_result = 1
        GROUP BY m        
        `;

        _content_playtime = `
        select
            m, count(idx) as cnt,  truncate( avg(play_time)/1000,0 ) as avg_play_time_min
        from
        (
            SELECT
                idx, DATE_FORMAT(regit_date, '%Y-%m-%d') m, play_time
            FROM
                log_game_using
            WHERE
                regit_date between ? and ?  and  typing_midle_kind = 4
        ) as dd
        group by m        
        `;

        _sql_using = `
        SELECT 
            target_cal.m AS m, ifnull(stat.cnt,0) as cnt 
        FROM 
            ( `+_calendar+` ) AS target_cal 
                LEFT OUTER JOIN 
            ( `+_content_using+` ) AS stat ON target_cal.m = stat.m 
        ORDER BY m        
        `;

        _sql_clear = `
        SELECT 
            target_cal.m AS m, ifnull(stat.cnt,0) as cnt 
        FROM 
            ( `+_calendar+` ) AS target_cal 
                LEFT OUTER JOIN 
            ( `+_content_clear+` ) AS stat ON target_cal.m = stat.m 
        ORDER BY m        
        `;

        _sql_by_playtime = `
        SELECT 
            target_cal.m AS m
            , ifnull(stat.avg_play_time_min,0) as avg_min
        FROM 
            ( `+_calendar+` ) AS target_cal 
                LEFT OUTER JOIN 
            ( `+_content_playtime+` ) AS stat ON target_cal.m = stat.m 
        ORDER BY m        
        `;
        
        _sql_by_sentence = `
        SELECT 
            sentence_idx , COUNT(*) AS cnt 
        FROM 
            log_game_using
        WHERE 
            regit_date between ? and ? and  typing_midle_kind = 4 
        GROUP BY sentence_idx       
        `;

        Promise.all([
            models.sequelizes.LogDB.query(_sql_using, {
                replacements: [_year, _week, _start, _end],
                type: models.Sequelize.QueryTypes.SELECT,
                raw:true
            }),
            models.sequelizes.LogDB.query(_sql_clear, {
                replacements: [_year, _week, _start, _end],
                type: models.Sequelize.QueryTypes.SELECT,
                raw:true
            }),            
            models.sequelizes.LogDB.query(_sql_by_playtime, {
                replacements: [_year, _week, _start, _end],
                type: models.Sequelize.QueryTypes.SELECT,
                raw:true
            }),
            models.sequelizes.LogDB.query(_sql_by_sentence, {
                replacements: [_start, _end],
                type: models.Sequelize.QueryTypes.SELECT,
                raw:true
            })
        ])
        .then((statLog)=>{
            let ResResult={};
            ResResult.usingLog = statLog[0];
            ResResult.byClear = statLog[1];
            ResResult.byPlaytime = statLog[2];
            ResResult.bySentence = statLog[3];

            res.jsonp({...ResponseCode.OK, result: ResResult})
        });        
    },
    getMonthlyEwrtStat(req, res){
        console.log(`[StatisticsController.getMonthlyEwrtStat] req.query: %j`, req.query);
        let dateArr = String(req.query.yearmonth).split('-');
        let _year = dateArr[0]; 
        let _yearEmp= _year+'%';
        
        _calendar = `
        SELECT 
            DATE_FORMAT(CONCAT(y, a, '01'), '%Y-%m') ym 
        FROM 
            (SELECT '01' a 
                UNION ALL SELECT '02' 
                UNION ALL SELECT '03' 
                UNION ALL SELECT '04' 
                UNION ALL SELECT '05' 
                UNION ALL SELECT '06' 
                UNION ALL SELECT '07' 
                UNION ALL SELECT '08' 
                UNION ALL SELECT '09' 
                UNION ALL SELECT '10' 
                UNION ALL SELECT '11' 
                UNION ALL SELECT '12') a, (SELECT ? y) d 
        ORDER BY ym      
        `;

        _content_using = `
        SELECT 
            DATE_FORMAT(regit_date, '%Y-%m') ym, COUNT(*) AS cnt 
        FROM 
            log_game_using
        WHERE 
            regit_date like ?  and  typing_midle_kind = 4
        GROUP BY ym        
        `;

        _content_clear = `
        SELECT 
            DATE_FORMAT(regit_date, '%Y-%m') ym, COUNT(*) AS cnt 
        FROM 
            log_game_using
        WHERE 
            regit_date like ?  and  typing_midle_kind = 4 and is_result = 1
        GROUP BY ym        
        `;

        _content_playtime = `
        select
            ym, count(idx) as cnt,  truncate( avg(play_time)/1000,0 ) as avg_play_time_min
        from
        (
            SELECT
                idx, DATE_FORMAT(regit_date, '%Y-%m') ym, play_time
            FROM
                log_game_using
            WHERE
                regit_date like ?  and  typing_midle_kind = 4
        ) as dd
        group by ym        
        `;

        _sql_using = `
        SELECT 
            target_cal.ym AS m, ifnull(stat.cnt,0) as cnt 
        FROM 
            ( `+_calendar+` ) AS target_cal 
                LEFT OUTER JOIN 
            ( `+_content_using+` ) AS stat ON target_cal.ym = stat.ym 
        ORDER BY target_cal.ym        
        `;

        _sql_clear = `
        SELECT 
            target_cal.ym AS m, ifnull(stat.cnt,0) as cnt 
        FROM 
            ( `+_calendar+` ) AS target_cal 
                LEFT OUTER JOIN 
            ( `+_content_clear+` ) AS stat ON target_cal.ym = stat.ym 
        ORDER BY target_cal.ym        
        `;

        _sql_by_playtime = `
        SELECT 
            target_cal.ym AS m
            , ifnull(stat.avg_play_time_min,0) as avg_min
        FROM 
            ( `+_calendar+` ) AS target_cal 
                LEFT OUTER JOIN 
            ( `+_content_playtime+` ) AS stat ON target_cal.ym = stat.ym 
        ORDER BY target_cal.ym        
        `;
        
        _sql_by_sentence = `
        SELECT 
            sentence_idx , COUNT(*) AS cnt 
        FROM 
            log_game_using
        WHERE 
            regit_date like ? and  typing_midle_kind = 4 
        GROUP BY sentence_idx       
        `;

        Promise.all([
            models.sequelizes.LogDB.query(_sql_using, {
                replacements: [_year, _yearEmp],
                type: models.Sequelize.QueryTypes.SELECT,
                raw:true
            }),
            models.sequelizes.LogDB.query(_sql_clear, {
                replacements: [_year, _yearEmp],
                type: models.Sequelize.QueryTypes.SELECT,
                raw:true
            }),            
            models.sequelizes.LogDB.query(_sql_by_playtime, {
                replacements: [_year, _yearEmp],
                type: models.Sequelize.QueryTypes.SELECT,
                raw:true
            }),
            models.sequelizes.LogDB.query(_sql_by_sentence, {
                replacements: [_yearEmp],
                type: models.Sequelize.QueryTypes.SELECT,
                raw:true
            })
        ])
        .then((statLog)=>{
            let ResResult={};
            ResResult.usingLog = statLog[0];
            ResResult.byClear = statLog[1];
            ResResult.byPlaytime = statLog[2];
            ResResult.bySentence = statLog[3];

            res.jsonp({...ResponseCode.OK, result: ResResult})
        });          
    },

    /**
     * ---------------------------------------------------------------------- 기간 조회관련 
     */

    getYMList(req, res) {
        console.log(`[StatisticsController.getYMList] req.query: %j`, req.query);

        let _sql= "select * from "
                    +"( SELECT date_format( CONCAT(y, a,'01') , '%Y-%m' ) ym "
                    +"FROM (SELECT '01' a  "
                    +"    UNION ALL SELECT '02' "
                    +"    UNION ALL SELECT '03' "
                    +"    UNION ALL SELECT '04' "
                    +"    UNION ALL SELECT '05' "
                    +"    UNION ALL SELECT '06' "
                    +"    UNION ALL SELECT '07' "
                    +"    UNION ALL SELECT '08' "
                    +"    UNION ALL SELECT '09' "
                    +"    UNION ALL SELECT '10' "
                    +"    UNION ALL SELECT '11' "
                    +"    UNION ALL SELECT '12' "
                    +"    ) a "
                    +", (SELECT ? y) d "
                    +"order by ym desc ) ym_list "
                    +"where ym >= '2019-03' and ym <= date_format(now(), '%Y-%m') ";
        models.sequelizes.LogDB.query (_sql, {
            replacements: [req.query.year],
            type: models.Sequelize.QueryTypes.SELECT
            , raw:true})
        .then(ymList=>{
            res.jsonp({...ResponseCode.OK, result: ymList})
        })
    },

    getDayList(req, res) {
        console.log(`[StatisticsController.getYMList] req.query: %j`, req.query);

        let dateArr = String(req.query.yearmonth).split('-');
        let _year = dateArr[0];
        _yearmonth = req.query.yearmonth+'%';

        let _sql= `
        -- 해당월에 속한 날짜들 가져오기 ( 오늘보다 큰 날 제거 )
        SELECT 
            target_cal.m AS days
        FROM
            (SELECT 
                ymd AS m
            FROM
                (SELECT 
                WEEK(dt) w,
                    DATE_FORMAT(dt, '%Y-%m-%d') ymd,
                    DATE_FORMAT(dt, '%Y%m') ym,
                    DAY(dt) d,
                    DATE_FORMAT(dt, '%d') zerofilld,
                    DAYOFWEEK(dt) dw
            FROM
                (SELECT 
                CONCAT(y, '0101') + INTERVAL a * 100 + b * 10 + c DAY dt
            FROM
                (SELECT 0 a UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3) a, (SELECT 0 b UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) b, (SELECT 0 c UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) c, (SELECT ? y) d
            WHERE
                a * 100 + b * 10 + c < DAYOFYEAR(CONCAT(y, '1231'))) a
            ORDER BY ym , d) AS cal
            WHERE
                ymd LIKE ?  AND ymd  <= DATE_FORMAT(now(),'%Y-%m-%d') ) AS target_cal
        ORDER BY m        
        `;
        models.sequelizes.LogDB.query (_sql, {
            replacements: [_year, _yearmonth],
            type: models.Sequelize.QueryTypes.SELECT
            , raw:true})
        .then(dayList=>{
            console.log("days::: %j", dayList);
            res.jsonp({...ResponseCode.OK, result: dayList})
        })
    },

    getWeeklyList(req, res) {
        console.log(`[StatisticsController.getWeeklyList] req.query: %j`, req.query);

        _year = req.query.year;
        _yearmonth = req.query.yearmonth+'%';

        let _sql= " select * from "
        +" (select min(w) week_count, min(ymd) as start_date, max(ymd) as end_date from ( "
        +" SELECT "
        +"            Week(dt) w "
        +"             , date_format(dt,'%Y-%m-%d') ymd "
        +"             , date_format(dt,'%Y%m') ym "
        +"             , Day(dt) d "
        +"             , date_format(dt,'%d') zerofilld "
        +"             , DayofWeek(dt) dw "
        +"          FROM (SELECT CONCAT(y, '0101') + INTERVAL a*100 + b*10 + c DAY dt "
        +"                  FROM (SELECT 0 a "
        +"                        UNION ALL SELECT 1 "
        +"                        UNION ALL SELECT 2 "
        +"                        UNION ALL SELECT 3 "
        +"                        ) a "
        +"                     , (SELECT 0 b "
        +"                        UNION ALL SELECT 1 "
        +"                        UNION ALL SELECT 2 "
        +"                        UNION ALL SELECT 3 "
        +"                        UNION ALL SELECT 4 "
        +"                        UNION ALL SELECT 5 "
        +"                        UNION ALL SELECT 6 "
        +"                        UNION ALL SELECT 7 "
        +"                        UNION ALL SELECT 8 "
        +"                        UNION ALL SELECT 9 "
        +"                        ) b "
        +"                     , (SELECT 0 c "
        +"                        UNION ALL SELECT 1 "
        +"                        UNION ALL SELECT 2 "
        +"                        UNION ALL SELECT 3 "
        +"                        UNION ALL SELECT 4 "
        +"                        UNION ALL SELECT 5 "
        +"                        UNION ALL SELECT 6 "
        +"                        UNION ALL SELECT 7 "
        +"                        UNION ALL SELECT 8 "
        +"                        UNION ALL SELECT 9 "
        +"                        ) c "
        +"                     , (SELECT ? y) d "
        +"                 WHERE a*100 + b*10 + c < DayOfYear(CONCAT(y, '1231')) "
        +"                ) a "
        +" order by ym , d  ) as cal "
        +" group by w ) as raw "
        +" where start_date like ? ";

        models.sequelizes.LogDB.query (_sql, {
            replacements: [_year, _yearmonth],
            type: models.Sequelize.QueryTypes.SELECT
            , raw:true})
        .then(ymList=>{
            res.jsonp({...ResponseCode.OK, result: ymList})
        })

    }
}

module.exports = StatisticsController;