const
    Sequelize = require('sequelize'),
    config = require(__dirname + '/../config/config.json'),
    models = require(__dirname + '/../models'),
    ResponseCode = require(__dirname + '/../classes/response_code'),
    Validator = require(__dirname + '/../classes/validator'),
    Pagination = require(__dirname + '/../classes/pagination'),
    Op = Sequelize.Op,
    Manager = models.Managers;

const ManagerController = {
    /**
     * 관리자 목록 페이지
     */
    index(req, res) {
        console.log(`[ManagerController.index] Show managers: %j`, req.query);

        const
            query = req.query || {},
            page = parseInt(query.page || 1),
            count = parseInt(query.count || 10),
            fieldId = query.field || 0,
            keyword = query.keyword || null,
            orderby = query.orderby,
            sort = query.sort;

        let
            where, order;

        if (keyword) {
            switch (fieldId) {
                case 1:
                    where = { username: { [Op.like]: '%' + keyword + '%' } };
                    break;

                case 2:
                    where = { display_name: { [Op.like]: '%' + keyword + '%' } };
                    break;

                case 0:
                default:
                    where = {
                        [Op.or]: [
                            { username: { [Op.like]: '%' + keyword + '%' }},
                            { display_name: { [Op.like]: '%' + keyword + '%'}}
                        ]
                    };
                    break;
            }
        }

        if (orderby) {
            order = [ [ orderby, (sort || 'DESC').toUpperCase() ] ];
        } else {
            order = [ [ 'id', 'DESC' ] ];
        }

        Manager
            .findAndCountAll({
                where: where,
                order: order,
                offset: (page - 1) * count,
                limit: count,
            })
            .then(result => {
                const data = {
                    config: config,
                    req: req,
                    breadcrumbs: [
                        { name: '홈', href: '/' },
                        { name: '관리자관리', href: '/managers' },
                        { name: '관리자관리', href: '/managers' }
                    ],
                    pagination: new Pagination(req, result.count),
                    managers: result.rows,
                    alert: req.session.alert || ''
                };

                delete req.session.alert;
                
                res.render('pages/managers', data);
            });
    },

    indexNresponseJson(req, res) {
        console.log(`ManagerController.indexNresponseJson] req.query: %j`, req.query);

        const
            query = req.query || {},
            page = parseInt(query.page || 1),
            count = parseInt(query.count || 10),
            fieldId = query.fieldId || 0,
            keyword = query.keyword || null,
            orderby = query.orderby,
            sort = query.sort;

        let
            where, order;

        if (keyword) {
            switch (fieldId) {
                case '1':
                    where = { username: { [Op.like]: '%' + keyword + '%' } };
                    break;

                case '2':
                    where = { display_name: { [Op.like]: '%' + keyword + '%' } };
                    break;

                case '0':
                default:
                    where = {
                        [Op.or]: [
                            { username: { [Op.like]: '%' + keyword + '%' }},
                            { display_name: { [Op.like]: '%' + keyword + '%'}}
                        ]
                    };
                    break;
            }
        }

        if (orderby) {
            order = [ [ orderby, (sort || 'DESC').toUpperCase() ] ];
        } else {
            order = [ [ 'id', 'DESC' ] ];
        }

        Manager
            .findAndCountAll({
                where: where,
                order: order,
                offset: (page - 1) * count,
                limit: count,
            })
            .then(managers => {
                //managers 가 object 여서 엄청 많은 data 를 가지고 있음. stringify 로 result set 만 array로 변경.
                var result = JSON.parse(JSON.stringify(managers));

                //패스워드 칼럼 삭제
                for(var i = 0 ; i < result['rows'].length ; i ++) {
                    delete result['rows'][i]['password'];
                }
                result['pagination'] = new Pagination(req, result.count),
                result['page']=page,
                res.jsonp({...ResponseCode.OK, result: result}); 
            });
    },
        
    /**
     * 관리자 추가 페이지
     */
    create(req, res) {
        console.log(`[ManagerController.create] Create a new manager.`);
        
        const data = {
            config: config,
            req: req,
            breadcrumbs: [
                { name: '홈', href: '/' },
                { name: '관리자관리', href: '/managers' },
                { name: '관리자신규등록', href: '/managers/create' }
            ],
            fields: req.session.fields || {},
            alert: req.session.alert || '',
            mode: 'create'
        };

        delete req.session.fields;
        delete req.session.alert;

        res.render('pages/manager-form', data);
    },

    /**
     * 관리자 편집
     */
    edit(req, res) {
        console.log(`[ManagerController.edit] Edit a manager: ${req.params.id}.`);

        Manager
            .findByPk(req.params.id)
            .then(manager => {
                manager.password = '';

                const data = {
                    config: config,
                    req: req,
                    breadcrumbs: [
                        { name: '홈', href: '/' },
                        { name: '관리자관리', href: '/managers' },
                        { name: '관리자정보수정', href: `/managers/${req.params.id}/edit` }
                    ],
                    fields: req.session.fields || manager,
                    alert: req.session.alert || '',
                    manager: manager,
                    mode: 'edit'
                };
        
                delete req.session.fields;
                delete req.session.alert;
        
                res.render('pages/manager-form', data);
            });
    },

    infoNresponseJson(req, res) {
        console.log(`[ManagerController.infoNresponseJson] serve a manager info: ${req.params.id}.`);

        Manager
            .findByPk(req.params.id)
            .then(manager => {
                var result = JSON.parse(JSON.stringify(manager));
                delete result['password'];
                result['status'] = 'ok';
                res.jsonp({...ResponseCode.OK, result: result}); 
            })
            .catch(error => {
                req.jsonp(ResponseCode.ERROR);
            });
    },

    /**
     * 관리자 저장
     */
    store(req, res) {
        console.log(models);

        const
            validator = new Validator([
                { name: 'username', required: true },
                { name: 'display_name', required: true },
                { name: 'password', required: true, confirmed: true }
            ]),
            result = validator.validate(req.body);

        if (result !== true) {
            return onStoreFailed(result);
        }

        console.log(Manager);

        Manager
            .findOrCreate({
                where: { username: req.body.username },
                defaults: req.body
            })
            .spread((manager, created) => {
                if (created) {
                    console.log(`A manager has been created: ${req.body.username}.`);

                    res.redirect('/managers');
                } else {
                    onStoreFailed(`이미 사용중인 아이디입니다: ${req.body.username}.`);
                }
            });

        function onStoreFailed(message) {
            console.error(message);

            req.session.fields = req.body;
            req.session.alert = message;

            res.redirect('/managers/create');
        }
    },

    storeNresponseJson(req, res) {
        const
            validator = new Validator([
                { name: 'username', required: true },
                { name: 'display_name', required: true },
                { name: 'password', required: true, confirmed: true }
            ]),
            result = validator.validate(req.body);

        if (result !== true) {
            return onStoreFailed(result);
        }

        console.log(Manager);

        req.body.login_fail_count = 0;

        Manager
            .findOrCreate({
                where: { username: req.body.username },
                defaults: req.body
            })
            .spread((manager, created) => {
                if (created) {
                    console.log(`A manager has been created: ${req.body.username}.`);

                    res.jsonp(ResponseCode.OK);
                } else {
                    res.jsonp(ResponseCode.ADMINID_ALREADY_HAS_BEEN_OCCUPIED);
                }
            });
    },

    update(req, res) {
        console.log(`[ManagerController.update] Update a manager id is ${req.params.id}: %j`, req.body);

        const
            fields = [ 'display_name', 'username', 'password', 'permissions', 'is_active', 'ipv4'],
            validator = new Validator([
                { name: 'username', required: true },
                { name: 'display_name', required: true }
            ]),
            manager = {};

        if (manager.password) {
            validator.rules.push({ name: 'password', required: true, confirmed: true });
        }

        result = validator.validate(req.body);
        if (result !== true) {
            return onUpdateFailed(result);
        }

        for (var i in fields) {
            const
                name = fields[i],
                value = req.body[name];

            if (value != undefined && value != null) {
                manager[name] = value;
            }
        }

        Manager
            .update(manager, {
                where: {
                    id: req.params.id,
                    deleted_at: null
                }
            })
            .then(() => {
                console.log(`A manager has been modified: %j`, manager);

                res.redirect('/managers');
            })
            .catch(error => {
                onUpdateFailed(`저장에 실패하였습니다: ${error}.`);
            });

        function onUpdateFailed(message) {
            console.error(message);

            req.session.fields = req.body;
            req.session.alert = message;

            res.redirect(`/managers/${req.params.id}/edit`);
        }
    },

    updateNresponseJson(req, res) {
        console.log(`[ManagerController.updateNresponseJson] Update a manager id is ${req.params.id}: %j`, req.body);

        const
            fields = [ 'display_name', 'username', 'password', 'permissions', 'is_active', 'ipv4'],
            validator = new Validator([
                { name: 'username', required: true },
                { name: 'display_name', required: true }
            ]),
            manager = {};

        if (manager.password) {
            validator.rules.push({ name: 'password', required: true, confirmed: true });
        }

        result = validator.validate(req.body);
        if (result !== true) {
            return onUpdateFailed(result);
        }

        for (var i in fields) {
            const
                name = fields[i],
                value = req.body[name];

            if (value != undefined && value != null && value != '') {
                manager[name] = value;
            }
        }

        if (manager.password) {
            manager.pw_updated_at = Date.now();
        }

        console.log(`------------Manager: %j`, manager);

        Manager
            .update(manager, {
                where: {
                    id: req.params.id,
                    deleted_at: null
                }
            })
            .then(() => {
                console.log(`A manager has been modified: %j`, manager);

                res.jsonp(ResponseCode.OK);
            })
            .catch(error => {
                res.jsonp(ResponseCode.ERROR);
            });
    },

    updatePwNresponseJson(req, res) {
        console.log(`[ManagerController.updatePwNresponseJson] Update pw a manager id is ${req.params.id}: %j`, req.body);

        const
            fields = [ 'password'],
            validator = new Validator([]),
            manager = {};

        if (manager.password) {
            validator.rules.push({ name: 'password', required: true, confirmed: true });
        }

        result = validator.validate(req.body);
        if (result !== true) {
            return onUpdateFailed(result);
        }

        for (var i in fields) {
            const
                name = fields[i],
                value = req.body[name];

            if (value != undefined && value != null && value != '') {
                manager[name] = value;
            }
        }

        if (manager.password) {
            manager.pw_updated_at = Date.now();
        }

        console.log(`------------Manager: %j`, manager);

        Manager
            .update(manager, {
                where: {
                    id: req.session.managerId,
                    deleted_at: null
                }
            })
            .then(() => {
                console.log(`A manager pw has been modified: %j`, manager);
                req.session.passwordExpire = false;
                res.jsonp(ResponseCode.OK);
            })
            .catch(error => {
                res.jsonp(ResponseCode.ERROR);
            });
    }    
};


module.exports = ManagerController;