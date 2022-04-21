const
    Result = require('../classes/result.class'),
    Controller = require('./controller'),
    AuthController = require('./auth.controller'),
    models = require('../../../models'),
    Op = models.Sequelize.Op,
    User = models.User,
    Clan = models.Clan,
    ClanMember = models.ClanMember,
    Friendship = models.Friendship

const
    MAX_FRIEND_COUNT = 100,
    State = {
        Friend: 'friend',
        Sent: 'sent',
        Received: 'received'
    }

const FriendController = {
    findFriend(req, res) {
        const sessionId = AuthController.getSessionId(req)

        console.log(`[FriendController.findFriend()] Session ID: ${sessionId}`)

        if (!sessionId) {
            return Controller.response(res, Result.SESSION_ID_IS_REQUIRED)
        }

        const nickname = req.query.nickname

        console.log(`[FriendController.findFriend()] Nickname: ${nickname}`)

        if (!nickname) {
            return Controller.response(res, Result.INVALID_PARAMETERS)
        }

        if (nickname.length < 2) {
            return Controller.response(res, Result.NICKNAME_IS_TOO_SHORT)
        }

        let
            theUser,
            theCandidate,
            theFriendship

        User
            .findOne({
                where: {
                    session_id: sessionId
                }
            })
            .then(user => {
                if (!user) {
                    throw Result.NO_MATCHING_USER_WITH_SESSION_ID
                }

                theUser = user

                return User
                    .findOne({
                        where: {
                            nickname: nickname,
                            id: {
                                [Op.ne]: theUser.id
                            }
                        }
                    })
            })
            .then(candidate => {
                if (!candidate) {
                    throw {
                        ...Result.OK,
                        totalCount: 0,
                        itemCount: 0,
                        items: []
                    }
                } else {
                    theCandidate = candidate

                    return Friendship
                        .findOne({
                            where: {
                                user_id: theUser.id,
                                friend_id: candidate.id
                            }
                        })
                }
            })
            .then(friendship => {
                if (friendship) {
                    switch (friendship.state) {
                        case State.Friend:
                            throw Result.CANNOT_SEND_FRIEND_REQUST_TO_FRIEND
                        case State.Sent:
                            throw Result.YOU_HAVE_ALREADY_SENT_FRIEND_REQUEST
                        case State.Received:
                            throw Result.FRIEND_HAVE_ALREADY_SENT_FRIEND_REQUEST

                        default:
                            break;
                    }
                }

                theFriendship = friendship

                return ClanMember
                    .findOne({
                        where: {
                            user_id: theCandidate.id
                        },
                        include: [{
                            model: Clan,
                            as: 'clan'
                        }]
                    })
            })
            .then(member => {
                Controller.response(res, {
                    ...Result.OK,
                    totalCount: 1,
                    itemCount: 1,
                    items: [{
                        ...Controller.getPublicUser(theCandidate),
                        state: theFriendship ? theFriendship.state : null,
                        clan: member && member.clan ? Controller.getPublicClan(member.clan) : null
                    }]
                })
            })
            .catch(error => {
                Controller.response(res, error)
            })
    },

    requestFriendship(req, res) {
        const sessionId = AuthController.getSessionId(req)

        console.log(`[FriendController.requestFriendship()] Session ID: ${sessionId}`)

        if (!sessionId) {
            return Controller.response(res, Result.SESSION_ID_IS_REQUIRED)
        }

        const nickname = req.body.nickname

        if (!nickname) {
            return Controller.response(res, Result.INVALID_PARAMETERS)
        }

        let
            theUser,
            theFriend

        User
            .findOne({
                where: {
                    session_id: sessionId
                }
            })
            .then(user => {
                if (!user) {
                    throw Result.NO_MATCHING_USER_WITH_SESSION_ID
                }

                theUser = user

                return User.findOne({
                    where: {
                        nickname: nickname
                    }
                })
            })
            .then(friend => {
                if (!friend) {
                    throw Result.CANNOT_FIND_USER_BY_NICKNAME
                }

                theFriend = friend

                return Friendship
                    .findAndCountAll({
                        where: {
                            user_id: theUser.id
                        }
                    })
            })
            .then(result => {
                if (result.count >= MAX_FRIEND_COUNT) {
                    throw Result.CANNOT_SEND_FRIEND_REQUEST_MORE
                }

                const friendship = result.rows.find(friendship => {
                    return friendship.friend_id === theFriend.id
                })

                if (friendship) {
                    switch (friendship.state) {
                        case State.Friend:
                            throw Result.CANNOT_SEND_FRIEND_REQUST_TO_FRIEND

                        case State.Sent:
                            throw Result.YOU_HAVE_ALREADY_SENT_FRIEND_REQUEST

                        case State.Received:
                            throw Result.FRIEND_HAVE_ALREADY_SENT_FRIEND_REQUEST

                        default:
                            break;
                    }
                }

                return Friendship
                    .bulkCreate([{
                        user_id: theUser.id,
                        friend_id: theFriend.id,
                        state: State.Sent
                    }, {
                        user_id: theFriend.id,
                        friend_id: theUser.id,
                        state: State.Received
                    }])
            })
            .then(() => {
                return Controller.response(res, Result.OK)
            })
            .catch(error => {
                Controller.response(res, error)
            })
    },

    friends(req, res) {
        const sessionId = AuthController.getSessionId(req)

        console.log(`[FriendController.friends()] Session ID: ${sessionId}`)

        if (!sessionId) {
            return Controller.response(res, Result.SESSION_ID_IS_REQUIRED)
        }

        const state = req.query.state || State.Friend

        console.log(`[FriendController.friends()] state: ${state}`)

        User
            .findOne({
                where: {
                    session_id: sessionId
                }
            })
            .then(user => {
                if (!user) {
                    throw Result.NO_MATCHING_USER_WITH_SESSION_ID
                }

                return Friendship
                    .findAll({
                        where: {
                            user_id: user.id,
                            state: state
                        }
                    })
            })
            .then(friendships => {
                if (!friendships.length) {
                    throw {
                        ...Result.OK,
                        totalItemCount: 0,
                        itemCount: 0,
                        items: []
                    }
                }

                return User
                    .findAll({
                        where: {
                            id: {
                                [Op.in]: friendships.map(friendship => {
                                    return friendship.friend_id
                                })
                            }
                        }
                    })
            })
            .then(friends => {
                Controller.response(res, {
                    ...Result.OK,
                    totalItemCount: friends.length,
                    itemCount: friends.length,
                    items: friends.map(friend => {
                        return Controller.getPublicUser(friend)
                    })
                })
            })
            .catch(error => {
                Controller.response(res, error)
            })
    },

    deleteFriendship(req, res) {
        const sessionId = AuthController.getSessionId(req)

        console.log(`[FriendController.deleteFriend()] Session ID: ${sessionId}`)

        if (!sessionId) {
            return Controller.response(res, Result.SESSION_ID_IS_REQUIRED)
        }

        const
            nickname = req.body.nickname,
            state = req.body.state || State.Friend

        console.log(`[FriendController.deleteFriend()] Nickname: ${nickname}, state: ${state}`)

        if (!nickname) {
            return Controller.response(res, Result.NICKNAME_IS_REQUIRED)
        }

        let
            theUser,
            theFriend

        User
            .findOne({
                where: {
                    session_id: sessionId
                }
            })
            .then(user => {
                if (!user) {
                    throw Result.NO_MATCHING_USER_WITH_SESSION_ID
                }

                theUser = user

                return User
                    .findOne({
                        where: {
                            nickname: nickname
                        }
                    })
            })
            .then(friend => {
                if (!friend) {
                    throw Result.CANNOT_DELETE_FRIEND_NOT_IN_FRIENDSHIP
                }

                theFriend = friend

                let friendState

                switch (state) {
                    case State.Received:
                        friendState = State.Sent
                        break;

                    case State.Sent:
                        friendState = State.Received
                        break;

                    default:
                        friendState = State.Friend
                        break;
                }

                return Promise
                    .all([
                        Friendship.findOne({
                            where: {
                                user_id: theUser.id,
                                friend_id: theFriend.id,
                                state: state
                            }
                        }),
                        Friendship.findOne({
                            where: {
                                user_id: theFriend.id,
                                friend_id: theUser.id,
                                state: friendState
                            }
                        }),
                    ])
            })
            .spread((userFriendship, friendFriendship) => {
                if (!userFriendship || !friendFriendship) {
                    throw Result.FRIENDSHIP_DATA_IS_ABNORMAL
                }

                return Friendship
                    .destroy({
                        where: {
                            [Op.or]: [{
                                [Op.and]: [{
                                    user_id: theUser.id
                                }, {
                                    friend_id: theFriend.id
                                }]
                            }, {
                                [Op.and]: [{
                                    user_id: theFriend.id
                                }, {
                                    friend_id: theUser.id
                                }]
                            }]
                        }
                    })
            })
            .then(() => {
                Controller.response(res, Result.OK)
            })
            .catch(error => {
                Controller.response(res, error)
            })
    },

    acceptFriendRequest(req, res) {
        const sessionId = AuthController.getSessionId(req)

        console.log(`[FriendController.acceptFriendRequest()] Session ID: ${sessionId}`)

        if (!sessionId) {
            return Controller.response(res, Result.SESSION_ID_IS_REQUIRED)
        }

        const nickname = req.body.nickname

        console.log(`[FriendController.acceptFriendRequest()] Nickname: ${nickname}`)

        if (!nickname) {
            return Controller.response(res, Result.NICKNAME_IS_REQUIRED)
        }

        let
            theUser,
            theFriend

        User
            .findOne({
                where: {
                    session_id: sessionId
                }
            })
            .then(user => {
                if (!user) {
                    throw Result.NO_MATCHING_USER_WITH_SESSION_ID
                }

                theUser = user

                return User
                    .findOne({
                        where: {
                            nickname: nickname
                        }
                    })
            })
            .then(friend => {
                if (!friend) {
                    throw Result.CANNOT_FIND_USER_BY_NICKNAME
                }

                theFriend = friend

                return Friendship
                    .findAll({
                        where: {
                            [Op.or]: [{
                                [Op.and]: [{
                                    user_id: theUser.id
                                }, {
                                    friend_id: theFriend.id
                                }]
                            },
                            {
                                [Op.and]: [{
                                    user_id: theFriend.id
                                }, {
                                    friend_id: theUser.id
                                }]
                            },
                            ]
                        }
                    })
            })
            .then(rows => {
                const
                    userFriendship = rows.find(friendship => {
                        return friendship.user_id === theUser.id
                    }),
                    friendFriendship = rows.find(friendship => {
                        return friendship.user_id === theFriend.id
                    })

                if (userFriendship.state !== State.Received && friendFriendship.state !== State.Sent) {
                    throw Result.CANNOT_ACCEPT_SINCE_INVALID_STATE
                }

                models.sequelizes.WebDB
                    .transaction(t => {
                        userFriendship.state = State.Friend

                        return userFriendship
                            .save({
                                transaction: t
                            })
                            .then(() => {
                                friendFriendship.state = State.Friend

                                return friendFriendship.save({
                                    transaction: t
                                })
                            })
                    })
                    .then(() => {
                        Controller.response(res, Result.OK)
                    })
            })
            .catch(error => {
                Controller.response(res, error)
            })
    }
}

module.exports = FriendController