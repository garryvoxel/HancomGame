import WebConfig from './web.config'

const ApiServer = {
    test: {
        protocol: 'http',
        host: 'taja.malangmalang.com:7311',
        version: 'v1'
    },

    development: {
        protocol: 'https',
        host: 'dev-api.malangmalang.com',
        version: 'v1'
    },
    stage: {
        protocol: 'https',
        host: 'stg-api.malangmalang.com',
        version: 'v1'
    },

    production: {
        protocol: 'https',
        host: 'api.malangmalang.com',
        version: 'v1'
    },


    ranking:{
        getrankingSchool: 'https://dev-api.malangmalang.com/game/rank/request_rank_school',
        getrankingSchool2: 'https://dev-api.malangmalang.com/game/rank/request_rank_week_users',
        getrankingPersonal: 'https://dev-api.malangmalang.com/game/rank/rank_game_redis',
        getrankingSchoolSaved: 'https://dev-api.malangmalang.com/game/rank/request_rank_school',
        getrankingSchoolLive: 'https://dev-api.malangmalang.com/game/rank/rank_game_redis_school'
    },
    
    

    

    friends:{
        acceptFriend: 'https://dev-api.malangmalang.com/game/web2/friend/accept_friend_request',
    },

    _routes: {
        login: 'GET /login',

		/**
		 * Account
		 */
        me: 'GET /me',
        updateMe: 'POST /me',
        myClan: 'GET /my/clan',
        myPoints: 'POST /point/request_user_point',

		/**
		 * Post
		 */
        posts: 'GET /posts',
        writePost: 'PUT /posts',
        viewPost: 'GET /posts/:id',
        updatePost: 'POST /posts/:id',
        likePost: 'POST /posts/:id/like',
        writeComment: 'PUT /posts/:id/comments',
        destroyPost: 'DELETE /posts/:id',
        deletReply: 'POST /posts/:id/dell_comment',
        accustaion: 'POST /accustaion',
		/**
		 * Friendship
		 */
        myFriends: 'GET /my/friends',
        deleteFriendship: 'DELETE /my/friends',
        findFriend: 'GET /my/friends/find',
        requestFriendship: 'PUT /my/friends/request',
        acceptFriendship: 'POST /my/friends/accept',

        /**
         * Event
         */
        events: 'GET /events',
        viewEvent: 'GET /events/:id',

		/**
		 * Clan
		 */
        clans: 'GET /clans',
        clan: 'GET /clans/:id',
        createClan: 'PUT /clans/create',
        postsClan: 'GET /posts_clan',
        updateClanPost: 'POST /posts_clan/:id',
        writeClanPost: 'PUT /posts_clan',
        viewClanPost: 'GET /posts_clan/:id',
        destroyClanPost: 'DELETE /posts_clan/:id',
        writeClanComment: 'PUT /posts_clan/:id/comments',
        deleteClanReply: 'POST /posts_clan/:id/dell_comment',
        /**
         * Support
         */
        faqs: 'GET /faqs',
        
        /**
         * Game Channel
         */
        channels: 'GET /channels',

        /**
         * Ranking
         */
        rankings: 'GET /rankings',

        schools: 'GET /schools',
        
        /**
         * Log
         */
        logs: 'PUT /log_menu_using',

        adLogs: 'PUT /log_adverstisement',

        //
        restricted: 'GET /restricted',
    }
    
}

const server = ApiServer[WebConfig.environment]
for (var name in ApiServer._routes) {
    const route = ApiServer._routes[name]
    ApiServer[name] = `${server.protocol}://${server.host}/game/web/${server.version}` + route.split(' ')[1]
}

export default ApiServer