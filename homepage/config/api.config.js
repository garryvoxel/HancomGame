import WebConfig from './web.config';
const ApiServer = {
  test: {
    protocol: 'http',
    host: 'taja.malangmalang.com:7311',
    version: 'v1'
  },

  /* development: {
    protocol: 'https',
    host: 'dev-api.malangmalang.com',
    version: 'v1'
  }, */

  development: {
    protocol: 'http',
    host: 'localhost:7311',
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

  _routes: {
    login: 'GET /login',
    /**
     * Account
     */
    me: 'GET /me',
    updateMe: 'POST /me',
    myClan: 'GET /my/clan',
    myPoints: 'GET /my/points',
    schools: 'GET /schools',
    restricted: 'GET /restricted',

    /**
     * Post
     */
    posts: 'GET /posts',
    writePost: 'PUT /posts',
    viewPost: 'GET /posts/:id',
    updatePost: 'POST /posts/:id',
    likePost: 'POST /posts/:id/like',
    destroyPost: 'DELETE /posts/:id',
    writeComment: 'PUT /posts/:id/comments',
    deleteReply: 'POST /posts/:id/dell_comment',
    accustaion: 'POST /accustaion',
    /**
     * ClanPost
     */
    postsClan: 'GET /posts_clan',
    writeClanPost: 'PUT /posts_clan',
    viewClanPost: 'GET /posts_clan/:id',
    updateClanPost: 'POST /posts_clan/:id',
    likeClanPost: 'POST /posts_clan/:id/like',
    destroyClanPost: 'DELETE /posts_clan/:id',
    writeClanComment: 'PUT /posts_clan/:id/comments',
    deleteClanReply: 'POST /posts_clan/:id/dell_comment',
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

    /**
     * Support
     */
    faqs: 'GET /faqs',

    /**
     * Game Channel
     */
    channels: 'GET /channels',

    /**
     * Ad
     */
    ads: 'GET /ads',

    /**
     * Ranking
     */
    rankings: 'GET /rankings',
    /**
     * Log
     */
    logs: 'PUT /log_menu_using'
  }
};

const server = ApiServer[WebConfig.environment];

for (var name in ApiServer._routes) {
  const route = ApiServer._routes[name];
  ApiServer[name] =
    `${server.protocol}://${server.host}/game/web/${server.version}` +
    route.split(' ')[1];
}

export default ApiServer;
