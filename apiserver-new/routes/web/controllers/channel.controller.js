const
    Result = require('../classes/result.class'),
    Controller = require('./controller'),
    AuthController = require('../controllers/auth.controller'),
    models = require('../../../models'),
    Channel = models.Channel

const DEFULAT_CHANNEL_COUNT = 10

const ChannelController = {
    index(req, res) {
        const
            count = req.query.count || DEFULAT_CHANNEL_COUNT,
            page = req.query.page || 1,
            game_code = req.query.code || 10000

            /*
        Channel
            .findAndCountAll({
                where: {
                    game_code: game_code
                },
                order: [
                    ['idx', 'DESC']
                ],
                offset: (page - 1) * count,
                limit: parseInt(count)
            })
            .then(result => {
                Controller.response(res, {
                    ...Result.OK,
                    totalCount: result.count,
                    itemCount: result.rows.length,
                    items: result.rows.map(channel => {
                        return channel.toJSON()
                    })
                })
            })
            .catch(error => {
                Controller.response(res, error)
            }) */

            Controller.response(res, {
                ...Result.OK,
                totalCount: 4,
                itemCount: 4,
                items: [
                    {
                        "channel_dns": "ws://dev-tt-coin-rt-4.malangmalang.com",
                        "channel_name": "02 고수",
                        "current_count": 0,
                        "game_code": 10000,
                        "idx": 1002,
                        "max_count": 500
                    },
                    {
                        "channel_dns": "ws://dev-tt-coin-rt-3.malangmalang.com",
                        "channel_name": "01 고수",
                        "current_count": 0,
                        "game_code": 10000,
                        "idx": 1001,
                        "max_count": 500
                    },
                    {
                        "channel_dns": "ws://dev-tt-coin-rt-2.malangmalang.com",
                        "channel_name": "02",
                        "current_count": 0,
                        "game_code": 10000,
                        "idx": 2,
                        "max_count": 500
                    },
                    {
                        "channel_dns": "ws://dev-tt-coin-rt-1.malangmalang.com",
                        "channel_name": "01",
                        "current_count": 0,
                        "game_code": 10000,
                        "idx": 1,
                        "max_count": 500
                    }
                ]
            })
    },

    view(req, res) {
        const id = req.params.id

        /*
        Channel
            .findByPk(id)
            .then(channel => {
                if (! channel) {
                    throw Result.NO_CONTENTS
                }
                
                Controller.response(res, {
                    ...Result.OK,
                    channel: channel.toJSON()
                })
            })
            .catch(error => {
                Controller.response(res, error)
            }) */
        Controller.response(res, {
            ...Result.OK,
            channel: {
                "channel_dns": "ws://localhost:7331",
                "channel_name": "01",
                "current_count": 0,
                "game_code": 10000,
                "idx": 1,
                "max_count": 500
            }
        })
    }
}

module.exports = ChannelController