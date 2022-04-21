const
    Sequelize = require('sequelize'),
    config = require(__dirname + '/../config/config.json'),
    models = require(__dirname + '/../models'),
    ResponseCode = require(__dirname + '/../classes/response_code'),
    Moment =  require('moment'),
    Validator = require(__dirname + '/../classes/validator'),
    Pagination = require(__dirname + '/../classes/pagination'),
    
    Op = Sequelize.Op,
    fs = require('fs'),
    Ad = models.Ad;

    Managers = models.Managers;
    //Ad.belongsTo(Managers, {foreignKey:'creator_id', targetKey:'id'});

const AdController = {
    /**
     * 광고 목록 페이지
     */
    indexNresponseJson(req, res) {
        console.log(`AdController.indexNresponseJson] req.query: %j`, req.query);

        const
            query = req.query || {},
            page = parseInt(query.page || 1),
            count = parseInt(query.count || 10),
            fieldId = query.fieldId || 0,
            keyword = query.keyword || null,
            orderby = query.orderby,
            sort = query.sort;
            rangeType = query.rangeType,
            startDate = query.startDate || '',
            endDate = query.endDate || '';

        let
            where, order;


        if(rangeType == 'custom') {
            //where = {createdAt: {between: [new Date(), Date.parse('2012-01-01')]} }
            where = {start_at: { [Op.gt]: startDate+' 00:00:00' } , end_at: { [Op.lt]: endDate+' 23:59:59'} }
        }



        if (keyword) {
            switch (fieldId) {
                case '1':
                    where = { subject: { [Op.like]: '%' + keyword + '%' } };
                    break;

                case '2':
                    where = { content: { [Op.like]: '%' + keyword + '%' } };
                    break;

                case '0':
                default:
                    where = {
                        [Op.or]: [
                            { subject: { [Op.like]: '%' + keyword + '%' }},
                            { content: { [Op.like]: '%' + keyword + '%'}}
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

        console.log('검색 구간 ::: %j, %j', startDate, endDate);
        console.log('검색 구간 조합 ::: %j', where);

        Ad
        .findAndCountAll({
            where: where,
            order: order,
            offset: (page - 1) * count,
            limit: count,
            // include: [{
            //     model: Managers,
            //     attributes: ['display_name'],
            //     where: { id: Sequelize.col('ad.creator_id')}
            // }]
        })
        .then(Ad => {
            var result = JSON.parse(JSON.stringify(Ad));

            result['pagination'] = new Pagination(req, result.count),
            result['page']=page,
            res.jsonp({...ResponseCode.OK, result: result}); 
        });  

    },
        
    /**
     * 광고 생성
     */    
    storeNresponseJson(req, res) {
        console.log(`[AdController.infoNresponseJson] write a Ad info: %j`,req.body);
        const
            validator = new Validator([
                { name: 'platform', required: true }
                , { name: 'type', required: true }
                //, { name: 'is_active', required: true }
                , { name: 'image_url', required: true }
                , { name: 'target_uri', required: true }
                , { name: 'start_at', required: true }
                , { name: 'end_at', required: true }
            ]),
            result = validator.validate(req.body);

        if (result !== true) {
            console.log(result);
            return res.jsonp(ResponseCode.INVALID_PARAMETERS);
        }

        //첨부파일 저장
        /* 안함. S3 로 변경될 예정
        req.files.image.mv(__dirname +'/../public/ad/'+req.files.image.name, err=>{
            if (err) { 
                console.log(err);
                return res.status(500).send(err); 
            }
        });
        */
        Ad
        .create({
            creator_id: req.session.managerId
            , name : req.body.name
            , platform: req.body.platform
            , type: req.body.type
            , is_active: req.body.is_active
            , image_url: req.body.image_url
            , target_uri: req.body.target_uri
            , start_at: Moment(req.body.start_at.concat(' 00:00:00')).utcOffset('-0900').format("YYYY-MM-DD HH:mm:ss")
            //, start_at: req.body.start_at.concat(' 00:00:00')
            , end_at: Moment(req.body.end_at.concat(' 23:59:59')).utcOffset('-0900').format("YYYY-MM-DD HH:mm:ss")
            //, end_at: req.body.end_at.concat(' 23:59:59')
            //, image_uri: '/ad/'+req.files.image.name
        })
        .then(
            result=>{
            if (result) {
                console.log(`A ad has been created`);

                res.jsonp(ResponseCode.OK);
            } else {
                res.jsonp(ResponseCode.ERROR);
            }
            }
        );        
    },

    /**
     * 광고 상세 및 편집
     */
    infoNresponseJson(req, res) {
        console.log(`[AdController.infoNresponseJson] serve a Ad info: ${req.params.id}.`);

        Ad
            .findByPk(req.params.id)
            .then(Ad => {
                var result = JSON.parse(JSON.stringify(Ad));
                delete result['password'];
                
                res.jsonp({ ...ResponseCode.OK, eventInfo: result} ); 
                
            })
            .catch(error => {
                res.jsonp( ResponseCode.NO_CONTENTS ); 
            });
    },


    /**
     * 광고 수정
     */
    updateNresponseJson(req, res) {
        console.log(`[AdController.update] Update a Ad id is ${req.params.id}: %j`, req.body);

        // 파일이 올라오는지 안올라 오는지 확인. 
        // 하지 않음 S3로 변경될 예정임
        /*
        //if ( !req.files || typeof req.files.image !== 'object' ) {
        if ( !req.files || !req.files.image) {
            //첨부파일 없음
            console.log("파일 첨부 없음.");
        } else {
            //첨부파일 있음
            console.log("파일 첨부 있음.");
            //기존 첨부파일을 지움
            if (fs.existsSync(__dirname +'/../public'+req.body.oldImgUri)) {
                //file exists
                fs.unlink( __dirname +'/../public'+req.body.oldImgUri, err=>{
                    console.log('파일 지웠음.'+__dirname +'/../public'+req.body.oldImgUri);
                    if(err) {
                        console.log(JSON.stringify(err));
                    }
                });                
            }

            // 새로운 파일 복사
            req.files.image.mv(__dirname +'/../public/ad/'+req.files.image.name, err=>{});
            Ad['image_uri'] = '/ad/'+req.files.image.name;            
        }
        */

        const
        validator = new Validator([
            { name: 'platform', required: true }
            , { name: 'id', required: true }
            , { name: 'type', required: true }
            //, { name: 'is_active', required: true }
            , { name: 'image_url', required: true }
            , { name: 'target_uri', required: true }
            , { name: 'start_at', required: true }
            , { name: 'end_at', required: true }
        ]),
        result = validator.validate(req.body);

        if (result !== true) {
            req.jsonp(ResponseCode.INVALID_PARAMETERS);
        }

        Ad
            .update({
                platform: req.body.platform
                ,name: req.body.name        
                ,type: req.body.type
                ,is_active: req.body.is_active
                ,image_url: req.body.image_url
                ,target_uri: req.body.target_uri
                ,start_at:  Moment(req.body.start_at.concat(' 00:00:00')).utcOffset('-0900').format("YYYY-MM-DD HH:mm:ss")
                //,start_at:  req.body.start_at.concat(' 00:00:00')
                ,end_at: Moment(req.body.end_at.concat(' 23:59:59')).utcOffset('-0900').format("YYYY-MM-DD HH:mm:ss")
                //,end_at: req.body.end_at.concat(' 23:59:59')
            }, {
                where: {
                    id: req.body.id,
                    deleted_at: null
                }
            })
            .then(() => {
                console.log(`A Ad has been modified: %j`, Ad);

                res.jsonp(ResponseCode.OK);
            })
            .catch(error => {
                console.log("catch : " + error.message);
                res.jsonp(ResponseCode.ERROR);
            });
    },

    deleteNresponseJson(req, res){
        console.log(`[AdController.delete] delete a Event id is: %j`, req.body);
        const
            fields = [ 'id'],
            validator = new Validator([
                { name: 'id', required: true },
            ])

        result = validator.validate(req.body);
        if (result !== true) {
            return req.jsonp(ResponseCode.INVALID_PARAMETERS);
        }

        Ad
            .findByPk(req.body.id)
            .then( (AdInfo)=> {

                if(!AdInfo){
                    return req.jsonp(ResponseCode.NO_CONTENTS);
                }

                // 첨부파일 삭제
                // 하지 않음 S3 에 저장할 예정임
                /*
                if (fs.existsSync(__dirname +'/../public'+EventInfo.image_uri)) {
                    //file exists
                    fs.unlink( __dirname +'/../public'+EventInfo.image_uri, err=>{
                        console.log('파일 지웠음.'+__dirname +'/../public'+EventInfo.image_uri);
                        if(err) {
                            console.log(JSON.stringify(err));
                        }
                    });                
                }
                */

                Ad
                .destroy({
                    where: {
                        id: req.body.id
                    }
                })
                .then(()=>{
                    res.jsonp(ResponseCode.OK);
                });
            })
            .catch(error => {
                console.log("catch : " + error.message);
                res.jsonp(ResponseCode.ERROR);
            });

    }

};

module.exports = AdController;