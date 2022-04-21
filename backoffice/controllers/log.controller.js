const
    models = require(__dirname + '/../models'),
    Log = models.TbLog;

const LogController = {
    test(req, res) {
        console.log(`[LogController.test] test: %j`, req.query);   

        Log.findAll({
            attributes: ['Idx', 'LogIdx', 'RegisterTime']
        }).then(result => {
            res.send(result);
        });
    },

    // 로그인 통계(웹)
    login(req, res) {
        // http://localhost:3000/stats/login?type=1&year=2019&month=12&platform=1
        console.log(`[LogController.login] login: %j`, req.query);

        if (null == req.query.type 
            || null == req.query.year 
            || null == req.query.month 
            || null == req.query.platform)
        {
            return res.send('null request');
        }

        Log.findAll({
            attributes: [
                'Idx',
                'LogIdx',
                'nickname',
                'msg0',         // OS
                'msg1',         // browser
                'val0',         // device - 1 : windows, 2 : mac, 3 : ios, 4 : android
                'val1',         // brwoser explorer - 1 : explorer, 2 : chrome, 3 : safari 
                'Date0'         // login time
            ]
        }).then(result => {
            res.send(result);
        });
    }
};

module.exports = LogController;