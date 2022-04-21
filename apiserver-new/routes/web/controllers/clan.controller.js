const
    AuthController = require('../controllers/auth.controller'),
    Result = require('../classes/result.class'),
    models = require('../../../models'),
    Clan = models.Clan,
    ClanMember = models.ClanMember,
    User = models.User

const ClanController = {
    index(req, res) {
        const
            count = 10,
            page = req.query.page || 1,
            offset = (page - 1) * count,
            type = req.query.type || 'all'

        if (type === 'my') {
            const sessionId = AuthController.getSessionId(req)

            console.log(`[ClanController.index()] Session ID: ${sessionId}`)

            if (!sessionId) {
                return res.json(Result.SESSION_ID_IS_REQUIRED)
            }

            User.findOne({
                where: {
                    session_id: sessionId
                }
            })
                .then(user => {
                    if (user) {
                        ClanMember.findByPk(user.id)
                            .then(member => {
                                if (member) {
                                    sendClans({
                                        id: member.clan_id
                                    })
                                } else {
                                    return res.json({
                                        ...Result.OK,
                                        totalCount: 0,
                                        itemCount: 0,
                                        items: []
                                    })
                                }
                            })
                            .catch(error => {
                                console.error(`[ClanController.index().member] Error: ${JSON.stringify(error.message)}`)

                                return res.json({
                                    ...Result.DATABASE_ERROR,
                                    error: error.message
                                })
                            })
                    } else {
                        return res.json({
                            ...Result.NO_MATCHING_USER_WITH_SESSION_ID,
                            sessionId: sessionId
                        })
                    }
                })
                .catch(error => {
                    console.error(`[ClanController.index().user] Error: ${JSON.stringify(error.message)}`)

                    return res.json({
                        ...Result.DATABASE_ERROR,
                        error: error.message
                    })
                })
        } else {
            sendClans()
        }

        function sendClans(where) {
            Clan.findAndCountAll({
                include: [{ model: ClanMember, as: 'members' }],
                order: [['id', 'DESC']],
                offset: offset,
                limit: count,
                where: where
            })
                .then(result => {
                    let
                        totalCount = result.count,
                        clans = [],
                        promises = []

                    result.rows.forEach(clan => {
                        clans.push({
                            id: clan.id,
                            manager_id: clan.manager_id,
                            name: clan.name,
                            description: clan.description,
                            updated_at: clan.updated_at,
                            created_at: clan.created_at,
                            memberCount: clan.members.length
                        })

                        promises.push(User.findByPk(clan.manager_id))
                    })

                    Promise
                        .all(promises)
                        .then(responses => {
                            responses.forEach((user, index) => {
                                if (user) {
                                    clans[index].manager = {
                                        user_id: user.id,
                                        nickname: user.nickname
                                    }
                                }
                            })

                            return res.json({
                                ...Result.OK,
                                totalCount: totalCount,
                                itemCount: clans.length,
                                items: clans
                            })
                        })
                        .catch(error => {
                            console.log(`[ClanController.index().sendClans()] Error: ${JSON.stringify(error.message)}`)

                            return res.json({
                                ...Result.DATABASE_ERROR,
                                error: error.message
                            })
                        })
                })
        }
    },

    create(req, res) {
        const sessionId = AuthController.getSessionId(req)

        console.log(`[ClanController.create()] Session ID: ${sessionId}`)

        if (!sessionId) {
            return res.json(Result.SESSION_ID_IS_REQUIRED)
        }

        if (!req.body.name || !req.body.description) {
            return res.status(400).json(Result.INVALID_PARAMETERS)
        }

        /**
         * Todo: 비속어 필터링 필요
         */

        Clan.findOne({
            where: {
                name: req.body.name
            }
        })
            .then(clan => {
                if (clan) {
                    return res.json(Result.CLAN_NAME_IS_DUPLICATED)
                } else {
                    User.findOne({
                        where: {
                            session_id: sessionId
                        }
                    })
                        .then(user => {
                            if (user) {
                                ClanMember.findOne({
                                    where: {
                                        user_id: user.id
                                    }
                                })
                                    .then(member => {
                                        if (member) {
                                            return res.json(Result.USER_ALREADY_HAS_CLAN)
                                        } else {
                                            models.sequelizes.WebDB.transaction(t => {
                                                return Clan
                                                    .create({
                                                        creator_id: user.id,
                                                        manager_id: user.id,
                                                        name: req.body.name,
                                                        description: req.body.description
                                                    }, { transaction: t })
                                                    .then(clan => {
                                                        return ClanMember
                                                            .create({
                                                                user_id: user.id,
                                                                clan_id: clan.id,
                                                                is_manager: true
                                                            }, { transaction: t })
                                                            .then(member => {
                                                                return res.json(Result.OK)
                                                            })
                                                            .catch(error => {
                                                                console.log(`[ClanController.create().createMember] Result: ${JSON.stringify(error.message)}`)

                                                                return res.json({
                                                                    ...Result.DATABASE_ERROR,
                                                                    error: error.message
                                                                })
                                                            })
                                                    })
                                                    .catch(error => {
                                                        console.log(`[ClanController.create().createClan] Result: ${JSON.stringify(error.message)}`)

                                                        return res.json({
                                                            ...Result.DATABASE_ERROR,
                                                            error: error.message
                                                        })
                                                    })
                                            })
                                        }
                                    })
                            } else {
                                return res.json(Result.NO_MATCHING_USER_WITH_SESSION_ID)
                            }
                        })
                        .catch(error => {
                            console.log(`[ClanController.create().user] Result: ${JSON.stringify(error.message)}`)

                            return res.json({
                                ...Result.DATABASE_ERROR,
                                error: error.message
                            })
                        })
                }
            })
            .catch(error => {
                console.log(`[ClanController.create().findClan] Result: ${JSON.stringify(error.message)}`)

                return res.json({
                    ...Result.DATABASE_ERROR,
                    error: error.message
                })
            })
    },

    show(req, res) {
        const clanId = req.params.id

        Clan
            .findByPk(clanId, {
                include: [{
                    model: ClanMember,
                    where : {is_member : 1 , is_dell : 0},
                    as: 'members'
                }]
            })
            .then(clan => {
                if (clan) {
                    const
                        newClan = {
                            id: clan.id,
                            name: clan.name,
                            description: clan.description,
                            updated_at: clan.updated_at,
                            created_at: clan.created_at,
                            members: []
                        },
                        promises = [
                            User.findByPk(clan.manager_id)
                        ]

                    clan.members.forEach(member => {
                        promises.push(User.findByPk(member.user_id))
                    })

                    Promise
                        .all(promises)
                        .then(responses => {
                            responses.forEach((response, index) => {
                                if (index === 0) {
                                    if (response) {
                                        newClan.manager = {
                                            user_id: response.id,
                                            nickname: response.nickname
                                        }
                                    }
                                } else {
                                    newClan.members.push({
                                        user_id: response.id,
                                        nickname: response.nickname
                                    })
                                }
                            })

                            return res.json({
                                ...Result.OK,
                                clan: newClan
                            })
                        })
                } else {
                    return res.json(Result.NO_CONTENTS)
                }
            })
            .catch(error => {
                console.log(`[ClanController.show().clan] Result: ${JSON.stringify(error.message)}`)

                return res.json({
                    ...Result.DATABASE_ERROR,
                    error: error.message
                })
            })
    }
}

module.exports = ClanController