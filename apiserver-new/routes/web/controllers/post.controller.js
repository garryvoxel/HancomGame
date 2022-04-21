const
    Result = require('../classes/result.class'),
    Controller = require('./controller'),
    AuthController = require('./auth.controller'),
    models = require('../../../models'),
    isGoodWord = require('../../../common/global_array');
const { or } = require('sequelize');
    Op = models.Sequelize.Op,
    User = models.User,
    Forum = models.Forum,
    ForumComment = models.ForumComment,
    ForumLike = models.ForumLike,
    News = models.News

const
    DEFAULT_POST_COUNT = 10,
    MIN_SUBJECT_LENGTH = 5

const PostController = {
    index(req, res) {
        let
            model,
            posts,
            totalCount = 0

        switch (req.query.bbs) {
            case 'forum':
                model = Forum
                break;

            case 'news':
                model = News
                break;

            default:
                return Controller.response(res, Result.UNKNOWN_BBS)
        }

        const
            count = req.query.count || DEFAULT_POST_COUNT,
            //count = 7,
            page = req.query.page || 1,
            keyword = req.query.keyword

        model
            .findAndCountAll({
                where: keyword ? { subject: { [Op.like]: `%${keyword}%` } } : null,
                order: [
                    ['order', 'DESC'],
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
                
                if(model === News){
                    posts = result.rows.map(post => {
                        return Controller.getPublicNews(post)
                    })
                }else{
                    posts = result.rows.map(post => {
                        return Controller.getPublicPost(post)
                    })
    
                }
               
                totalCount = result.count

                return Promise.all(
                    result.rows.map(post => {
                        return User.findByPk(post.author_id)
                    })
                )
            })
       
            .then(responses => {
                responses.forEach((response, i) => {
                    posts[i].author = Controller.getPublicUser(response)
                })

                Controller.response(res, {
                    ...Result.OK,
                    totalCount: totalCount,
                    itemCount: posts.length,
                    items: posts
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
            case 'forum':
                Post = Forum
                break;

            case 'news':
                Post = News
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

                if (Post === Forum) {
                    promises.push(ForumLike.count({
                        where: {
                            post_id: post.id
                        }
                    }))
                }

                thePost = Controller.getPublicPost(post)

                return Promise.all(promises)
            })
            .then(responses => {
                thePost.author = Controller.getPublicUser(responses[0])
                thePost.previous_post_id = responses[1]
                thePost.next_post_id = responses[2] || null
                thePost.isEditable = false
                thePost.isDeletable = false

                if (Post === Forum) {
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
                if (Post === Forum) {
                    return ForumComment
                        .findAll({
                            where: {
                                post_id: thePost.id,
                                parent_id: null,
                                is_dell: 0
                            },
                            include: [
                                { model: ForumComment, as: 'children',required:false, where : {is_dell : {[Op.ne] :1 }} }
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
            case 'forum':
                model = Forum
                break;

            default:
                return Controller.response(res, Result.INVALID_PARAMETERS)
        }

        const
            subject = req.body.subject,
            content = req.body.content

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

                if (Controller.isRestricted(user.restricted, Result.NOT_ALLOWED_TO_WRITE.code) == true) {
                    return Controller.response(res, Result.NOT_ALLOWED_TO_WRITE);
                }

                models.sequelizes.WebDB.query(`SELECT count(*) as counts FROM (SELECT * FROM Forum order by id desc limit 10) as Forum WHERE author_id = :user_id;`, {
                    replacements: {
                        user_id: user.id
                    },
                    type: models.Sequelize.QueryTypes.SELECT
                })
                    .then(checkCounts => {
                        if (checkCounts[0].counts >= 2) {
                            throw Result.FORUM_CONTENTS_SPAMMERS
                        }
                        return model.create({
                            author_id: user.id,
                            subject: subject,
                            content: content
                        })
                    })
                    .then(() => {
                        Controller.response(res, Result.OK)
                    })
                    .catch(error => {
                        Controller.response(res, error)
                    })
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
            case 'forum':
                model = Forum
                break;

            default:
                return Controller.response(res, Result.INVALID_PARAMETERS)
        }

        const
            id = req.params.id,
            subject = req.body.subject,
            content = req.body.content


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

                if (Controller.isRestricted(user.restricted, Result.NOT_ALLOWED_TO_UPDATE.code) == true) {
                    throw Result.NOT_ALLOWED_TO_UPDATE;
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

                return post.save().then(() => {
                    Controller.response(res, Result.OK)
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
            case 'forum':
                model = Forum
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

                if (Controller.isRestricted(user.restricted, Result.NOT_ALLOWED_TO_DELETE.code) == true) {
                    throw Result.NOT_ALLOWED_TO_DELETE;
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
            case 'forum':
                model = Forum
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
                if (model === Forum) {
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
            case 'forum':
                Comment = ForumComment
                break;

            default:
                return Controller.response(res, Result.UNKNOWN_BBS)
        }


        const
            postId = req.params.id,
            parentId = req.body.parent_id,
            comment = req.body.comment

        //비속어 체크
        var bad_word_check=isGoodWord.check(comment);


        if(bad_word_check.isFound){
            var resultMsg=Result.FORUM_CONTENTS_WITH_BAD_WORD;
            resultMsg.word=bad_word_check.word;
            return Controller.response(res, resultMsg);
        }

        let theComments
        Forum.increment('comments_count' , {
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

                if (Controller.isRestricted(user.restricted, Result.NOT_ALLOWED_TO_WRITE.code) == true) {
                    throw Result.NOT_ALLOWED_TO_WRITE;
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

    },

    //덧글을 삭제 (deleted_at 을 입력하여 댓글목록 불러올때 해당 컬럼 null여부 파악 및 managed 여부 파악)
    update_dell_comments(req, res) {
    const sessionId = AuthController.getSessionId(req)
    console.log(`덧글 삭제 들어왓음 ================================== Session ID: ${sessionId}`)

    console.log(`[PostController.update()] Session ID: ${sessionId}`)

    if (!sessionId) {
        return Controller.response(res, Result.SESSION_ID_IS_REQUIRED)
    }

    let model

    switch (req.body.bbs) {
        case 'forum':
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

            if (Controller.isRestricted(user.restricted, Result.NOT_ALLOWED_TO_DELETE.code) == true) {
                throw Result.NOT_ALLOWED_TO_DELETE;
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
                    [Op.or]: [{id : post.id},{parent_id : post.id}],
                    is_dell : 0
                }
            })
                .then(Cforum => {
                    Forum.findOne({
                        where: {
                            id: post.post_id
                        }
                    })
                        .then(forum => {
                            forum.comments_count = forum.comments_count - Cforum.count
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
    }
}

module.exports = PostController