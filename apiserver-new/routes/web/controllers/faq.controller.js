const
    Result = require('../classes/result.class'),
    Controller = require('./controller'),
    AuthController = require('./auth.controller'),
    models = require('../../../models'),
    Op = models.Sequelize.Op,
    Faq = models.Faq

const DEFALUT_FAQ_COUNT = 10

const FaqController = {
    index(req, res) {
        const
            count = req.query.count || DEFALUT_FAQ_COUNT,
            page = req.query.page || 1,
            keyword = req.query.keyword,
            searchType = req.query.search_type || 'all'

        let where = {}

        if (keyword) {
            switch (searchType) {
                case 'question':
                    where = { question: { [Op.like]: `%${keyword}%` } }
                    break;

                case 'answer':
                    where = { answer: { [Op.like]: `%${keyword}%` } }
                    break;

                default:
                    where = {
                        [Op.or]: [
                            { question: { [Op.like]: `%${keyword}%` } },
                            { answer: { [Op.like]: `%${keyword}$` } }
                        ]
                    }
                    break;
            }
        }

        Faq
            .findAndCountAll({
                where: where,
                order: [
                    ['id', 'DESC']
                ],
                offset: (page - 1) * count,
                limit: count
            })
            .then(result => {
                if (!result.count) {
                    throw {
                        ...Result.OK,
                        totalCount: 0,
                        itemCount: 0,
                        items: []
                    }
                }

                console.log(result.rows)

                const faqs = result.rows.map(faq => {
                    return Controller.getPublicFaq(faq)
                })

                Controller.response(res, {
                    ...Result.OK,
                    totalCount: result.count,
                    items: faqs,
                    itemCount: faqs.length
                })
            })
            .catch(error => {
                Controller.response(res, error)
            })
    }
}

module.exports = FaqController