const
    Result = require('../classes/result.class'),
    Controller = require('./controller'),
    models = require('../../../models'),
    Op = models.Sequelize.Op,
    Ad = models.Ad

const AdController = {
    index(req, res) {
        const platform = req.query.platform || 'web'

        /*
        Ad
            .findAll({
                where: {
                    platform: platform,
                    start_at: { [Op.lte]: models.Sequelize.fn('NOW') },
                    end_at: { [Op.gte]: models.Sequelize.fn('NOW') }
                },
                order: [
                    ['id', 'DESC']
                ]
            })
            .then(ads => {
                return Controller.response(res, {
                    ...Result.OK,
                    itemCount: ads.length,
                    items: ads.map(ad => {
                        return Controller.getPublicAd(ad)
                    })
                })
            })
            .catch(error => {
                Controller.response(res, error)
            }) */
            return Controller.response(res, {
                ...Result.OK,
                itemCount: 0,
                items: null
            })
    }
}

module.exports = AdController