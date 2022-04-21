const
    Sequelize = require('sequelize'),
    config = require(__dirname + '/../config/config.json'),
    models = require(__dirname + '/../models'),
    ResponseCode = require(__dirname + '/../classes/response_code'),
    Validator = require(__dirname + '/../classes/validator'),
    Pagination = require(__dirname + '/../classes/pagination'),
    Op = Sequelize.Op,
    Faqs = models.Faqs;

const FaqsController = {
    /**
     * 자주하는 질문 목록 페이지
     */
    indexNresponseJson(req, res) {
        console.log(`FaqsController.indexNresponseJson] req.query: %j`, req.query);

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
                    where = { question: { [Op.like]: '%' + keyword + '%' } };
                    break;

                case '2':
                    where = { answer: { [Op.like]: '%' + keyword + '%' } };
                    break;

                case '0':
                default:
                    where = {
                        [Op.or]: [
                            { question: { [Op.like]: '%' + keyword + '%' }},
                            { answer: { [Op.like]: '%' + keyword + '%'}}
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

        Faqs
            .findAndCountAll({
                where: where,
                order: order,
                offset: (page - 1) * count,
                limit: count,
            })
            .then(Faqs => {
                var result = JSON.parse(JSON.stringify(Faqs));

                result['pagination'] = new Pagination(req, result.count),
                result['page']=page,
                res.jsonp({...ResponseCode.OK, result: result}); 
            });
    },
        
    /**
     * 자주하는 질문 생성
     */    
    storeNresponseJson(req, res) {
        const
            validator = new Validator([
                { name: 'question', required: true },
                { name: 'category', required: true },
                { name: 'answer', required: true }
            ]),
            result = validator.validate(req.body);

        if (result !== true) {
            return res.jsonp(ResponseCode.INVALID_PARAMETERS);
        }

        Faqs
            .create({
                question: req.body.question
                , answer: req.body.answer
                , category: req.body.category
                , author_id: req.session.managerId
            })
            .then(
                result=>{
                if (result) {
                    console.log(`A faq has been created: ${req.body.question}.`);

                    res.jsonp(ResponseCode.OK);
                } else {
                    res.jsonp(ResponseCode.ERROR);
                }
                }
            );
    },

    /**
     * 자주하는 질문 상세 및 편집
     */
    infoNresponseJson(req, res) {
        console.log(`[FaqsController.infoNresponseJson] serve a Faqs info: ${req.params.id}.`);

        Faqs
            .findByPk(req.params.id)
            .then(Faqs => {
                var result = JSON.parse(JSON.stringify(Faqs));
                delete result['password'];
                
                res.jsonp({ ...ResponseCode.OK, result: result }); 
            })
            .catch(error => {
                res.jsonp(ResponseCode.ERROR);
            });
    },


    /**
     * 자주하는 질문 수정
     */
    updateNresponseJson(req, res) {
        console.log(`[FaqsController.update] Update a Faqs id is ${req.params.id}: %j`, req.body);

        const
            fields = [ 'question', 'answer','category'],
            validator = new Validator([
                { name: 'question', required: true },
                { name: 'answer', required: true },
                { name: 'category', required: true }
            ])

        result = validator.validate(req.body);
        /*
        if (result !== true) {
            return res.jsonp(ResponseCode.INVALID_PARAMETERS);
        }
        */

        for (var i in fields) {
            const
                name = fields[i],
                value = req.body[name];

            if (value != undefined && value != null) {
                Faqs[name] = value;
            }
        }

        Faqs
            .update(Faqs, {
                where: {
                    id: req.params.id
                }
            })
            .then(() => {
                console.log(`A Faqs has been modified: %j`, Faqs);

                res.jsonp(ResponseCode.OK);
            })
            .catch(error => {
                console.log(`%j`,error);
                res.jsonp(ResponseCode.ERROR);
            });
    },

    deleteNresponseJson(req, res){
        console.log(`[FaqsController.delete] delete a Faqs id is: %j`, req.body);
        const
            fields = [ 'id'],
            validator = new Validator([
                { name: 'id', required: true },
            ])

        result = validator.validate(req.body);
        if (result !== true) {
            return res.jsonp(ResponseCode.INVALID_PARAMETERS);
        }

        Faqs
            .destroy({
                where: {
                    id: req.body.id
                }
            })
            .then(()=>{
                res.jsonp(ResponseCode.OK);
            });

    }
};

module.exports = FaqsController;