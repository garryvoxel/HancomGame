const
    express = require('express'),
    router = express.Router(),
    LoginController = require('./controllers/login.controller'),
    ClanController = require('./controllers/clan.controller'),
    UserController = require('./controllers/user.controller'),
    FriendController = require('./controllers/friend.controller'),
    PostController = require('./controllers/post.controller'),
    PostClanController = require('./controllers/postclan.cotroller'),
    FaqController = require('./controllers/faq.controller'),
    EventController = require('./controllers/event.controller'),
    ChannelController = require('./controllers/channel.controller'),
    SchoolController = require('./controllers/school.controller'),
    AdController = require('./controllers/ad.controller'),
    RankingController = require('./controllers/ranking.controller'),
    AccustaionController = require('./controllers/accustaion.controller'),
    LogMenuUsingController = require('./controllers/log_menu_using.controller')
    LogGameUsingController = require('./controllers/log_game_using.controller')
    LogAdvertisController = require('./controllers/log_adverst.controller')

router.get('/login', LoginController.login)

router.get('/me', UserController.me)
router.post('/me', UserController.updateMe)
router.get('/my/clan', UserController.clan)
router.get('/my/points', UserController.points)
router.get('/restricted', UserController.restricted)

router.get('/posts', PostController.index)
router.put('/posts', PostController.store)
router.get('/posts/:id(\\d+)', PostController.view)
router.post('/posts/:id(\\d+)', PostController.update)
router.post('/posts/:id(\\d+)/dell_comment', PostController.update_dell_comments)
router.delete('/posts/:id(\\d+)', PostController.destroy)
router.post('/posts/:id(\\d+)/like', PostController.toggleLike)
router.put('/posts/:id(\\d+)/comments', PostController.storeComment)

router.get('/posts_clan', PostClanController.index)
router.put('/posts_clan', PostClanController.store)
router.get('/posts_clan/:id(\\d+)', PostClanController.view)
router.post('/posts_clan/:id(\\d+)', PostClanController.update)
router.post('/posts_clan/:id(\\d+)/dell_comment', PostClanController.update_dell_comments)
router.delete('/posts_clan/:id(\\d+)', PostClanController.destroy)
router.post('/posts_clan/:id(\\d+)/like', PostClanController.toggleLike)
router.put('/posts_clan/:id(\\d+)/comments', PostClanController.storeComment)

router.post('/accustaion', AccustaionController.post)
router.put('/log_menu_using', LogMenuUsingController.post)
router.put('/log_adverstisement', LogAdvertisController.post)
router.post('/log_game_using/:id(\\d+)', LogGameUsingController.post)

router.get('/my/friends', FriendController.friends)
router.delete('/my/friends', FriendController.deleteFriendship)
router.get('/my/friends/find', FriendController.findFriend)
router.put('/my/friends/request', FriendController.requestFriendship)
router.post('/my/friends/accept', FriendController.acceptFriendRequest)

router.get('/events', EventController.events)
router.get('/events/:id(\\d+)', EventController.view)

router.get('/ads', AdController.index);

router.get('/clans', ClanController.index)
router.get('/clans/:id', ClanController.show)
router.post('/clans/create', ClanController.create)

router.get('/faqs', FaqController.index)

router.get('/channels', ChannelController.index)
router.get('/channels/:id(\\d+)', ChannelController.view)

router.get('/schools', SchoolController.index)

router.get('/rankings', RankingController.index)

module.exports = router