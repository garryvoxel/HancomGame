const
    config = require(__dirname + '/../config/config.json'),
    Validator = require(__dirname + '/../classes/validator'),
    models = require(__dirname + '/../models'),
    ResponseCode = require(__dirname + '/../classes/response_code'),
    Op = models.Sequelize.Op,
    Manager = models.Managers;

    function _isUserIpRegistered(req, registerdIP) {
        if (registerdIP == null || registerdIP == "") {
            return false;
        }
        var isFound = false;
        var reqIP = (req.headers['x-forwarded-for'] || "").split(',')[0] || req.connection.remoteAddress.replace(/^.*:/, '');
        console.log("USER IP : "+reqIP+", REGISTERED IP : "+registerdIP);
        if (reqIP === registerdIP) {
            isFound = true;
        }
        else {
            console.log('INACCESSIBLE IP : '+reqIP);
        }

        return isFound;
    }


const LoginController = {
    showLoginForm(req, res) {
        console.log(config);

        res.render('pages/login', {
            config: config,
            redirectUri: req.query.redirectUri || ''
        });
    },

    login(req, res) {
        console.log(`LoginController.login] req.body: %j`, req.body);

        const
            validator = new Validator([
                { name: 'username', required: true },
                { name: 'password', required: true }
            ]);
            result = validator.validate(req.body);

        if (result !== true) {
            return onLoginFailed();
        }

        let managerLoginFailCount = 0;

        Manager
            .findOne({
                where: {
                    username: req.body.username,
                    deleted_at: null
                }
            })
            .then(manager => {

                managerLoginFailCount = manager.login_fail_count;

                if (! manager || ! manager.verifyPassword(req.body.password)) {
                    return onLoginFailed();
                } else {
                    if (manager.is_active == '0') {
                        console.log('비활성화된 관리자 계정. ::: %j', manager.username);
                        return res.jsonp(ResponseCode.NO_AUTHORITY);
                    }
                    else if (_isUserIpRegistered(req, manager.ipv4) === false) {
                        return res.jsonp(ResponseCode.INACCESSIBLE_IP);
                    } else {
                        //정상적인 로그인 성공시 로그인 실패 카운트 초기화
                        Manager.update(
                            {'login_fail_count':0}
                        ,{
                            where: {
                                    username: req.body.username
                            }
                        })
                        console.log(`A manager logged in : ${manager.username}.`);
                    }

                }
                
                req.session.managerId = manager.id;
                req.session.username = manager.username;
                req.session.display_name = manager.display_name;
                req.session.permissions = manager.permissions;

                if (manager.diffPwUpdatedDate > 180) {
                    console.log('비번변경 180일 지남. ::: %j', manager.username);
                    req.session.passwordExpire = true;
                } else {
                    req.session.passwordExpire = false;
                }
                
                res.jsonp({
                    ...ResponseCode.OK,
                    display_name: manager.display_name,
                    permissions: manager.permissions
                });

            });

        function onLoginFailed() {

           console.log(req.body.username+' 로그인 실패 카운트 ::: %j', managerLoginFailCount);

           if(managerLoginFailCount >= 4) {
               console.log("계정 잠금 : "+req.body.username);
               //계정 잠금
                Manager
                .update(
                    {'is_active':0}
                ,{
                    where: {
                            username: req.body.username
                    }
                })
                .then( response=>{
                    Manager
                    .increment(
                        {'login_fail_count':1}
                    ,{
                        where: {
                            username: req.body.username
                        }
                    })
                    .then( response=>{
                    res.jsonp({...ResponseCode.UNAUTHORIZED});
                    })
                })
           } else {
               //로그인 실패 카운트만 증가 
               Manager
               .increment(
                   {'login_fail_count':1}
               ,{
                   where: {
                       username: req.body.username
                   }
               })
               .then( response=>{
               res.jsonp({...ResponseCode.UNAUTHORIZED});
               })               
           }
        }
    },
    logout(req, res) {
        req.session.destroy();
    }
};

module.exports = LoginController;