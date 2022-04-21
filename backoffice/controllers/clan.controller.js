const
    Sequelize = require('sequelize'),
    config = require(__dirname + '/../config/config.json'),
    models = require(__dirname + '/../models'),
    ResponseCode = require(__dirname + '/../classes/response_code'),
    Validator = require(__dirname + '/../classes/validator'),
    Pagination = require(__dirname + '/../classes/pagination'),
    Op = Sequelize.Op,
    Clan = models.Clan,
    ClanMember = models.ClanMember,
    Users = models.Users;;

    //ClanMember.belongsTo(Clan, {foreignKey: 'clan_id'});
    Clan.hasMany(ClanMember);

    const ClanController = {
        /**
         * 클랜 목록 페이지
         */
        indexNresponseJson(req, res) {
            console.log(`ClanController.indexNresponseJson] req.query: %j`, req.query);        

            const
            query = req.query || {},
            page = parseInt(query.page || 1),
            count = parseInt(query.count || 10),
            fieldId = query.fieldId || 1,
            keyword = query.keyword || null,
            orderby = query.orderby,
            sort = query.sort;

            let
            where, order;

            let ResResult = {};  

            if (keyword) {
                switch (fieldId) {
                    case '0':
                    default:
                        where = { name: { [Op.like]: '%' + keyword + '%' } };
                        break;
                }
            }
    
            let orderArr = [];
            if(req.query.ordered_by && req.query.ordered_to) {
                //console.log('정렬들어왔음.');
                orderArr = [[req.query.ordered_by, req.query.ordered_to]];
            } else {
                orderArr = [ [ 'id', 'DESC' ] ];
            }

            Clan
            .findAndCountAll({
                //attributes: Object.keys(Clan.attributes).concat([
                //    [models.sequelizes.WebDB.literal('(SELECT count(*) FROM `ClanMembers` WHERE `ClanMembers`.`clan_id` = `Clan`.`id`)'), 'member_count']
                //]),
                where: where,
                order: orderArr,
                offset: (page - 1) * count,
                limit: count,
                raw:true // raw:true 없으면 clan 생성자, 관리자 nickname 추가해 넣을때 변수가 박히지 않음.
                //include: [ClanMember] 리스트라서 멤버들 정보는 필요 없음.
            })
            .then( result=> {
                //console.log('------ Result:: %j', result);
                
                result['pagination'] = new Pagination(req, result.count),
                result['page']=page,

                ResResult.result = result;
/* 2019.06.20 DB 스키마 수정으로 필요 없게 된 로직.       
                return;
            })
            .then(()=>{
                //클랜 생성자, 클랜 매니저 이름을 가져온다.
                let UserIds = [];
                //UserIds.push(extractUserid(ResResult.result.rows, 'creator_id')); 
                //push 로 넣으면 [[111,222]] 이런구조... nested array X 

                //생성자
                UserIds = UserIds.concat(extractUserid(ResResult.result.rows, 'creator_id'));
                //매니저
                UserIds = UserIds.concat(extractUserid(ResResult.result.rows, 'manager_id'));

                //id 중복 제거
                UserIds = Array.from(new Set(UserIds));
                //console.log('------ UserIds:: %j', UserIds);

                //유저 이름 (nickname) 가져옴.
                return Users
                .findAll({
                    attributes: ['id', 'nickname'],
                    where: {
                        id : UserIds
                    }
                })
            })
            .then(UserList=>{
                //id, nickname mapper 작성
                let id_n_nick_mapper={};

                for(i in UserList){
                    id_n_nick_mapper[UserList[i].id] = UserList[i].nickname;
                }
                //console.log('id_n_nick_mapper :: %j', id_n_nick_mapper);

                //nickname 넣어주기
                for( i in ResResult.result.rows ) {
                    ResResult.result.rows[i].creator_nickname = id_n_nick_mapper[ResResult.result.rows[i].creator_id]; 
                    ResResult.result.rows[i].manager_nickname = id_n_nick_mapper[ResResult.result.rows[i].manager_id];
                }
*/                
                res.jsonp({...ResponseCode.OK, ...ResResult});
               
            })
            .catch(error=>{
                console.log('------ Catch:: %j', error);
                res.jsonp(ResponseCode.SQLERROR);
            });

            //아이디만 찾아서 추출하는 function
            function extractUserid(anArray, keyName){

                if(typeof(anArray) === 'undefined') { 
                    console.log('----- anArray for extract UserIds is undefined'); 
                    return [];  
                }  
                let ids=[];
                if (!anArray.length) return [];
                else {
                    for(let i in anArray){
                        ids.push(anArray[i][keyName])
                    }
                    return ids;
                }
            }

        },
        infoNresponseJson(req, res) {
            console.log(`ClanController.infoNresponseJson] req.params: %j`, req.params);   

            const
            query = req.query || {},
            page = parseInt(query.page || 1),
            count = parseInt(query.count || 10),
            fieldId = query.fieldId || 1,
            keyword = query.keyword || null,
            orderby = query.orderby,
            sort = query.sort;

            let
            where, order;

            let ResResult = {};  

            if (keyword) {
                switch (fieldId) {
                    case '1':
                    default:
                        where = { nickname: { [Op.like]: '%' + keyword + '%' } };
                        break;
                }
            }
    
            if (orderby) {
                order = [ [ orderby, (sort || 'DESC').toUpperCase() ] ];
            } else {
                order = [ [ 'idx', 'DESC' ] ];
            }

            //기본적으로 clan_id 를 검색하도록 설정
            where = { ...where, clan_id: req.params.id, is_member:1, is_dell: {[Op.ne]: 1}};            

            Promise.all([
                Clan.findByPk(req.params.id,{
                    type: models.Sequelize.QueryTypes.SELECT,
                    raw: true
                })
                , ClanMember.findAndCountAll(
                    {where: where,
                    order: order,
                    offset: (page - 1) * count,
                    limit: count,                        
                    type: models.Sequelize.QueryTypes.SELECT,
                    raw: true
                    }
                )
            ])
            .then(response=>{
                console.log(`Result::: %j `,response);

                ResResult['clanInfo'] = response[0];
                ResResult['clanMembers'] = response[1];

                ResResult['pagination'] = new Pagination(req, response[1].count),
                ResResult['page']=page,

                res.jsonp({...ResponseCode.OK, result:ResResult});
            })

            
        },
        closeNresponseJson (req, res) {
            console.log(`ClanController.closeNresponseJson] req.body: %j`, req.body);

            Clan
            .update({
                is_dell: 1
                //deleted_at: models.sequelizes.WebDB.fn('NOW')
            },{
                where: {
                    id: req.body.clan_id
                }
            })
            .then(response=>{
                ClanMember.update(
                    {is_dell: 1}, {
                        where: {
                            clan_id:  req.body.clan_id
                        }
                    }
                )
                .then(response=>{
                    res.jsonp(ResponseCode.OK);
                })
            })
        }
    };

    module.exports = ClanController;