const
    Result = require('../classes/result.class'),
    Controller = require('./controller'),
    AuthController = require('./auth.controller'),
    models = require('../../../models'),
    Op = models.Sequelize.Op,
    Event = models.Event

const DEFAULT_EVENT_COUNT = 10

const EventController = {
    events(req, res) {
        const
            count = req.query.count || DEFAULT_EVENT_COUNT,
            page = req.query.page || 1

        Event
            .findAndCountAll({
                where: {
                    status: {
                        [Op.ne] : 'inactive'
                    }
                },
                order: [ ['id', 'DESC'] ],
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

                Controller.response(res, {
                    ...Result.OK,
                    totalCount: result.count,
                    itemCount: result.rows.length,
                    items: result.rows.map(event => {
                        return event.toJSON()
                    })
                })
            })
            .catch(error => {
                Controller.response(res, error)
            })
    },

    view(req, res) {
        const id = req.params.id

        Event
            .findByPk(id)
            .then(event => {
                Controller.response(res, {
                    ...Result.OK,
                    event: event ? event.toJSON() : null
                })
            })
            .catch(error => {
                Controller.response(res, error)
            })
    }
}

module.exports = EventController