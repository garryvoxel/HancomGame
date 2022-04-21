const
    Result = require('../classes/result.class'),
    Controller = require('./controller'),
    AuthController = require('./auth.controller'),
    models = require('../../../models'),
    filter = require('../../../common/util').filter_response,
    isGoodWord = require('../../../common/global_array'),
    Op = models.Sequelize.Op,
    User = models.User,
    Forum_Clan = models.ForumClan,
    ForumComment = models.ForumC_Comment,
    ForumLike = models.ForumC_Like,
    ForumViewcHECK = models.ViewCheck

const 
    DEFAULT_POST_COUNT = 10,
    MIN_SUBJECT_LENGTH = 5

const PostClanController = {
    index(req, res){
        let model,
            posts_clan,
            totalCount = 0

            switch (req.query.bbs) {
                case 'forum_clan':
                    model = Forum_Clan
                    break;
    
                default:
                    return Controller.response(res, Result.UNKNOWN_BBS)
            }

    const 
        count = req.query.count || DEFAULT_POST_COUNT,
        page = req.query.page || 1,
        keyword = req.query.keyword,
        clan_id_info = req.query.clan_id
      //  session_id_info = AuthController.getSessionId(req)
        //session_id_info = req.query.session_id
    
    model
        .findAndCountAll({
            where: keyword ? { subject: { [Op.like]: `%${keyword}%` } } : null,
            where: {clan_id : clan_id_info},
            order: [
                ['order', 'DESC'],
                ['id', 'DESC']
            ], 
            offset: (page - 1) * count,
            limit: count

            
        })
   
        .then(result => {
            if(!result.count) {
                throw{
                    ...Result.OK,
                    totalCount: 0 ,
                    itemCount : 0 ,
                    items:[]
                }
            }
            console.log("들어옴 ㅋㅋ=======> 1 >>"+clan_id_info);
            posts_clan = result.rows.map(post => { //post는 이터레이터 
                return Controller.getPublicPostClan(post)
            })

            totalCount = result.count;

            return Promise.all(
                result.rows.map(post =>{
                    return User.findByPk(post.author_id)
                })
            )

        })
            .then(responses => {
                responses.forEach((response, i) => {
                posts_clan[i].author = Controller.getPublicUser(response)
            })

            Controller.response(res, {
                ...Result.OK,
                totalCount : totalCount,
                itemCount : posts_clan.length,
                items : posts_clan
            })
        })
        .catch(error => {
            Controller.response(res, error)
        })
},

view(req, res) {
    const id = req.params.id
    let
        Post,
        thePost

    switch (req.query.bbs) {
        case 'forum_clan':
            Post = Forum_Clan
            break;

        default:
            return Controller.response(res, Result.UNKNOWN_BBS)
    }

    Post
        .findOne({
            where: {
                id: id
            }
        })
        .then(post => {
            if (!post) {
                throw Result.NO_POST_STORED
            }

            const promises = [
                User.findByPk(post.author_id),
                Post.max('id', {
                    where: {
                        id: {
                            [Op.lt]: post.id
                        }
                    }
                }), // Previous Post ID
                Post.min('id', {
                    where: {
                        id: {
                            [Op.gt]: post.id
                        }
                    }
                }), // Next Post ID
            ]

            if (Post === Forum_Clan) {
                promises.push(ForumLike.count({
                    where: {
                        post_id: post.id
                    }
                }))
            }

            thePost = Controller.getPublicPostClan(post)

            return Promise.all(promises)
        })
        .then(responses => {
            thePost.author = Controller.getPublicUser(responses[0])
            thePost.previous_post_id = responses[1]
            thePost.next_post_id = responses[2] || null
            thePost.isEditable = false
            thePost.isDeletable = false

            if (Post === Forum_Clan) {
                thePost.likes = responses[3]
                thePost.hasUserLiked = false
            }

            return Post.increment('views', {
                where: {
                    id: thePost.id
                }
            })
        })
        .then(() => {
            if (Post === Forum_Clan) {
                return ForumComment
                    .findAll({
                        where: {
                            post_id: thePost.id,
                            parent_id: null,
                            is_dell: 0
                        },
                        include: [
                            { model: ForumComment, as: 'children',required:false, where : {is_dell : {[Op.ne] :1 }} }
                        ],
                        order: [
                            ['created_at' , 'DESC']
                        ]
                    })
                    .then(comments => {
                        const authorIds = []

                        comments.forEach(comment => {
                            if (!hasAuthorId(comment.author_id)) {
                                authorIds.push(comment.author_id)
                            }

                            if (comment.children) {
                                comment.children.forEach(child => {
                                    if (!hasAuthorId(child.author_id)) {
                                        authorIds.push(child.author_id)
                                    }
                                })
                            }

                            function hasAuthorId(authorId) {
                                return authorIds.find(id => {
                                    return id === authorId
                                }) ? true : false
                            }
                        })

                        const promises = authorIds.map(id => {
                            return User.findByPk(id)
                        })

                        thePost.comments = comments.map(comment => {
                            return comment.toJSON()
                        })

                        return Promise.all(promises)
                    })
                    .then(responses => {
                        thePost.comments.forEach(comment => {
                            const author = responses.find(user => {
                                return user.id === comment.author_id
                            })

                            if (author) {
                                comment.author = Controller.getPublicUser(author)
                            }

                            comment.children.forEach(child => {
                                const author = responses.find(user => {
                                    return user.id === child.author_id
                                })

                                child.author = Controller.getPublicUser(author)
                            })
                        })

                        const sessionId = AuthController.getSessionId(req)

                        if (sessionId) {
                            return User.findOne({
                                where: {
                                    session_id: sessionId
                                }
                            })
                        }

                        throw {
                            ...Result.OK,
                            post: thePost
                        }
                    })
                    .then(user => {
                        if (!user) {
                            throw Result.NO_MATCHING_USER_WITH_SESSION_ID
                        }

                        if (user.id === thePost.author_id) {
                            thePost.isEditable = true
                            thePost.isDeletable = true
                        }

                        return ForumLike.findOne({
                            where: {
                                post_id: thePost.id,
                                liker_id: user.id
                            }
                        })
                    })
                    .then(like => {
                        if (like) {
                            thePost.hasUserLiked = true
                        }

                        Controller.response(res, {
                            ...Result.OK,
                            post: thePost
                        })
                    })
                    .catch(error => {
                        throw error
                    })
            } else {
                Controller.response(res, {
                    ...Result.OK,
                    post: thePost
                })
            }
        })
        .catch(error => {
            Controller.response(res, error)
        })
},

store(req, res) {
    const sessionId = AuthController.getSessionId(req)

    console.log(`[PostController.create()] Session ID: ${sessionId}`)

    if (!sessionId) {
        return Controller.response(res, Result.SESSION_ID_IS_REQUIRED)
    }

    let model

    switch (req.body.bbs) {
        case 'forum_clan':
            model = Forum_Clan
            break;

        default:
            return Controller.response(res, Result.INVALID_PARAMETERS)
    }

    const
        subject = req.body.subject,
        content = req.body.content,
        clan_id_info = req.body.clan_id

    if (!subject) {
        return Controller.response(res, Result.SUBJECT_IS_REQUIRED)
    }

    if (subject.length < MIN_SUBJECT_LENGTH) {
        return Controller.response(res, Result.SUBJECT_IS_TOO_SHORT)
    }

    // 비속어 체크
    var bad_word_check=isGoodWord.check(subject);


    if(bad_word_check.isFound){
        var resultMsg=Result.CONTENTS_WITH_BAD_WORD;
        resultMsg.word=bad_word_check.word;
        return Controller.response(res, resultMsg);
    }

    bad_word_check=isGoodWord.check(content);


    if(bad_word_check.isFound){
        var resultMsg=Result.FORUM_CONTENTS_WITH_BAD_WORD;
        resultMsg.word=bad_word_check.word;
        return Controller.response(res, resultMsg);
    }

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

            return model.create({
                author_id: user.id,
                subject: subject,
                content: content,
                clan_id: clan_id_info
            })
        })
        .then(() => {
            Controller.response(res, Result.OK)
        })
        .catch(error => {
            Controller.response(res, error)
        })
},      

update(req, res) {
    const sessionId = AuthController.getSessionId(req)

    console.log(`[PostController.update()] Session ID: ${sessionId}`)

    if (!sessionId) {
        return Controller.response(res, Result.SESSION_ID_IS_REQUIRED)
    }

    let model

    switch (req.body.bbs) {
        case 'forum_clan':
            model = Forum_Clan
            break;

        default:
            return Controller.response(res, Result.INVALID_PARAMETERS)
    }

    const
        id = req.params.id,
        subject = req.body.subject,
        content = req.body.content,
        clan_id_info = req.body.clan_id

    if (!subject) {
        return Controller.response(res, Result.SUBJECT_IS_REQUIRED)
    }

    if (subject.length < MIN_SUBJECT_LENGTH) {
        return Controller.response(res, Result.SUBJECT_IS_TOO_SHORT)
    }

    if(!clan_id_info){
        return Controller.response(res, Result.CLAN_ID_IS_REQUIRED)
    }

    // 비속어 체크
    var bad_word_check=isGoodWord.check(subject);


    if(bad_word_check.isFound){
        var resultMsg=Result.CONTENTS_WITH_BAD_WORD;
        resultMsg.word=bad_word_check.word;
        return Controller.response(res, resultMsg);
    }

    bad_word_check=isGoodWord.check(content);


    if(bad_word_check.isFound){
        var resultMsg=Result.FORUM_CONTENTS_WITH_BAD_WORD
        resultMsg.word=bad_word_check.word;
        return Controller.response(res, resultMsg);
    }

    let theUser

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

            return model.findByPk(id)
        })
        .then(post => {
            if (post.author_id !== theUser.id) {
                throw Result.NO_AUTHORITY
            }

            post.subject = subject
            post.content = content
            post.clan_id = clan_id_info

            return post.save().then(() => {
                Controller.response(res, Result.OK)
            })
        })
        .catch(error => {
            Controller.response(res, error)
        })
},

//덧글을 삭제 (deleted_at 을 입력하여 댓글목록 불러올때 해당 컬럼 null여부 파악 및 managed 여부 파악)
update_dell_comments(req, res) {
    const sessionId = AuthController.getSessionId(req)
    console.log(`덧글 삭제 들어왓음 ================================== Session ID: ${sessionId}`)
    console.log(`[PostClanController.update()] Session ID: ${sessionId}`)

    if (!sessionId) {
        return Controller.response(res, Result.SESSION_ID_IS_REQUIRED)
    }

    let model

    switch (req.body.bbs) {
        case 'forum_clan':
            model = ForumComment
            break;

        default:
            return Controller.response(res, Result.INVALID_PARAMETERS)
    }

    const
        postId = req.params.id


    let theUser
    
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

            return model.findByPk(postId)
        })
        .then(post => {
            if (post.author_id !== theUser.id) {
                throw Result.NO_AUTHORITY
            }
            ForumComment.findAndCountAll({
                where : {
                    [Op.or]: [{id : post.id},{parent_id : post.id}]
                }
            })
                .then(C_Cforum =>{
                    Forum_Clan.findOne({
                        where: {
                            id : post.post_id
                        }
                    })
                        .then(forum => {
                            forum.comments_count = forum.comments_count - C_Cforum.count
                            post.is_dell = 1
                            post.deleted_at = models.sequelizes.WebDB.fn('NOW')
                            return forum.save().then(() => {
                                post.save().then(() => {
                                    Controller.response(res, Result.OK)
                                })
                            })
                        }).catch(error => {
                        Controller.response(res, error)
                    })
                }).catch(error => {
                Controller.response(res, error)
            })
        })
        .catch(error => {
            Controller.response(res, error)
        })
},

destroy(req, res) {
    const sessionId = AuthController.getSessionId(req)

    console.log(`[PostController.destroy()] Session ID: ${sessionId}`)

    if (!sessionId) {
        return Controller.response(res, Result.SESSION_ID_IS_REQUIRED)
    }

    let model

    switch (req.body.bbs) {
        case 'forum_clan':
            model = Forum_Clan
            break;

        default:
            return Controller.response(res, Result.INVALID_PARAMETERS)
    }

    const id = req.params.id
    let theUser

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

            return model.findByPk(id)
        })
        .then(post => {
            if (post.author_id !== theUser.id) {
                throw Result.NO_AUTHORITY
            }

            return post.destroy().then(() => {
                Controller.response(res, Result.OK)
            })
        })
        .catch(error => {
            Controller.response(res, error)
        })
},

toggleLike(req, res) {
    const sessionId = AuthController.getSessionId(req)

    console.log(`[PostController.toggleLike()] Session ID: ${sessionId}`)

    if (!sessionId) {
        return Controller.response(res, Result.SESSION_ID_IS_REQUIRED)
    }

    let
        model,
        hasUserLiked = false

    const id = req.params.id

    switch (req.query.bbs) {
        case 'forum_clan':
            model = Forum_Clan
            break;

        default:
            return Controller.response(res, Result.UNKNOWN_BBS)
    }

    User
        .findOne({
            where: {
                session_id: sessionId
            }
        })
        .then(user => {
            if (model === Forum_Clan) {
                return models.sequelizes.WebDB.transaction(t => {
                    return ForumLike
                        .findOrCreate({
                            where: {
                                post_id: id,
                                liker_id: user.id
                            },
                            transaction: t
                        })
                        .spread((like, created) => {
                            if (!created) {
                                return like
                                    .destroy({
                                        transaction: t
                                    })
                                    .then(() => {
                                        return model.decrement('likes', {
                                            where: {
                                                id: id
                                            },
                                            transaction: t
                                        })
                                    })
                            }

                            hasUserLiked = true

                            return model.increment('likes', {
                                where: {
                                    id: id
                                },
                                transaction: t
                            })
                        })
                })
            }

            throw Result.UNKNOWN_BBS
        })
        .then(() => {
            Controller.response(res, {
                ...Result.OK,
                hasUserLiked: hasUserLiked
            })
        })
        .catch(error => {
            Controller.response(res, error)
        })
},

storeComment(req, res) {
    const sessionId = AuthController.getSessionId(req)

    console.log(`[PostController.storeComment()] Session ID: ${sessionId}`)

    if (!sessionId) {
        return Controller.response(res, Result.SESSION_ID_IS_REQUIRED)
    }

    let
        Comment,
        author

    switch (req.body.bbs) {
        case 'forum_clan':
            Comment = ForumComment
            break;

        default:
            return Controller.response(res, Result.UNKNOWN_BBS)
    }

    const
        postId = req.params.id,
        parentId = req.body.parent_id,
        comment = req.body.comment

    // 비속어 체크

    var bad_word_check=isGoodWord.check(comment);

    if(bad_word_check.isFound){
        var resultMsg=Result.FORUM_CONTENTS_WITH_BAD_WORD;
        resultMsg.word=bad_word_check.word;
        return Controller.response(res, resultMsg);
    }


    let theComments
    Forum_Clan.increment('comments_count' , {
        where:{
            id: postId
        }
    })
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

            author = user

            return Comment
                .create({
                    post_id: postId,
                    parent_id: parentId,
                    comment: comment,
                    author_id: author.id
                })
        })
        .then(() => {
            return ForumComment
                .findAll({
                    where: {
                        post_id: postId,
                        parent_id: null
                    },
                    include: [
                        { model: ForumComment, as: 'children' }
                    ]
                })
        })
        .then(comments => {
            const authorIds = []

            comments.forEach(comment => {
                if (!hasAuthorId(comment.author_id)) {
                    authorIds.push(comment.author_id)
                }

                if (comment.children) {
                    comment.children.forEach(child => {
                        if (!hasAuthorId(child.author_id)) {
                            authorIds.push(child.author_id)
                        }
                    })
                }

                function hasAuthorId(authorId) {
                    return authorIds.find(id => {
                        return id === authorId
                    }) ? true : false
                }
            })

            const promises = authorIds.map(id => {
                return User.findByPk(id)
            })

            comments = comments.map(comment => {
                return comment.toJSON()
            })

            theComments = comments

            return Promise.all(promises)
        })
        .then(responses => {
            theComments.forEach(comment => {
                const author = responses.find(user => {
                    return user.id === comment.author_id
                })

                if (author) {
                    comment.author = Controller.getPublicUser(author)
                }

                comment.children.forEach(child => {
                    const author = responses.find(user => {
                        return user.id === child.author_id
                    })

                    child.author = Controller.getPublicUser(author)
                })
            })

            Controller.response(res, {
                ...Result.OK,
                comments: theComments
            })
        })
        .catch(error => {
            Controller.response(res, error)
        })

}



        
}

module.exports = PostClanController