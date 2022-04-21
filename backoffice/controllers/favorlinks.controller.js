const
    Sequelize = require('sequelize'),
    config = require(__dirname + '/../config/config.json'),
    models = require(__dirname + '/../models'),
    ResponseCode = require(__dirname + '/../classes/response_code'),
    Validator = require(__dirname + '/../classes/validator'),
    Pagination = require(__dirname + '/../classes/pagination'),
    Op = Sequelize.Op,
    fs = require('fs'),
    FavorLinks = models.FavorLinks;



const FavorLinksController = {
    getList(req, res) {
        console.log(`[FavorLinksController.getList] list favorlinks manager_id : %j`, req.session.managerId);

        FavorLinks
            .findAll({
                where: {
                    manager_id : req.session.managerId
                },
                raw: true
            })
            .then(favorlinkList =>{
                //console.log(`List: %j`, favorlinkList);
                res.jsonp({...ResponseCode.OK, result: favorlinkList});
            })
            .catch(error=>{
                console.log(`Catch: %j`, error);
            })


    },

    add(req, res){
        console.log(`[FavorLinksController.add] add favorlinks manager_id : %j, %j`, req.session.managerId, req.body);

        const
            validator = new Validator([
                { name: 'link_url', required: true },
                { name: 'favor_title', required: true }
            ])

            testResult = validator.validate(req.body);
            if (testResult !== true) {
                res.jsonp(ResponseCode.INVALID_PARAMETERS);
            }

        FavorLinks
            .findAll({
                where:{
                    manager_id : req.session.managerId
                    , link_url : req.body.link_url
                },
                raw: true
            })
            .then(dupList=>{
                if(dupList.length > 0) {
                    res.jsonp(ResponseCode.DUP_CONTENT);
                } else {
                    FavorLinks
                    .create({
                        manager_id : req.session.managerId ,
                        link_url : req.body.link_url,
                        title : req.body.favor_title
                    })
                    .then(rs=>{
                        res.jsonp(ResponseCode.OK);
                    })                    
                }
            })
    },

    del(req, res){
        console.log(`[FavorLinksController.del] del favorlinks manager_id : %j, %j`, req.session.managerId, req.body);

        /*
        const
        validator = new Validator([
            { name: 'asdfasdf', required: true }
        ])

        testResult = validator.validate(req.body);
        console.log("validator test: %j", testResult);
        if (testResult !== true) {
            console.log('INVALID_PARAMETERS');
            res.jsonp(ResponseCode.INVALID_PARAMETERS);
        }
        */

        FavorLinks
        .destroy({
            where: {
                manager_id : req.session.managerId
                , id : req.body.id
            }
        })
        .then(()=>{
            res.jsonp(ResponseCode.OK);
        })
        .catch(error=>{
            res.jsonp(ResponseCode.ERROR);
        }); ;
        
        
    }
        
};

module.exports = FavorLinksController;    