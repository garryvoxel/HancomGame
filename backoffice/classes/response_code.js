module.exports = {
    OK: {
        code: 1,
        message: 'Ok'
    },

    SQLERROR: {
        code:99,
        message: 'SQL Error.'
    },
    ERROR: {
        code:100,
        message: 'Error.'
    },
    UNAUTHORIZED: {
        code: 101,
        message: 'Unauhorized.'
    },
    INVALID_PARAMETERS: {
        code: 102,
        message: 'Invalid parameters.'
    },
    SESSION_ID_IS_REQUIRED: {
        code: 103,
        message: 'Session ID is required.'
    },
    NO_MATCHING_USER_WITH_SESSION_ID: {
        code: 104,
        message: 'No matching user with session id.'
    },
    NO_CONTENTS: {
        code: 105,
        message: 'No contents.'
    },
    NO_AUTHORITY: {
        code: 108,
        message: 'No authority.'
    },
    PASSWORDEXPIRE: {
        code: 109,
        message: 'Password Expire.'
    },
    INACCESSIBLE_IP: {
        code: 110,
        message: 'IP is inaccessible.'
    },

    ADMINID_ALREADY_HAS_BEEN_OCCUPIED: {
        code: 200,
        message: 'Admin ID already has been occupied.'
    },
    NICKNAME_ALREADY_HAS_BEEN_OCCUPIED: {
        code: 201,
        message: 'Nickname already has been occupied.'
    },
    NICKNAME_IS_REQUIRED: {
        code: 202,
        message: 'Nickname is required.'
    },
    NICKNAME_IS_TOO_SHORT: {
        code: 203,
        message: 'Nickname is too short.'
    },
    NICKNAME_IS_TOO_LONG: {
        code: 204,
        message: 'Nickname is too long.'
    },
    NICKNAME_HAS_DISALLOWED_CHARACTER: {
        code: 204,
        message: 'Nickname has disallowed character.'
    },
    UNKNOWN_NICKNAME: {
        code: 205,
        message: 'Unknown nickname.'
    },

    CANNOT_SEND_FRIEND_REQUEST_MORE: {
        code: 301,
        message: 'Cannot send friend request more.'
    },
    CANNOT_SEND_FRIEND_REQUST_TO_FRIEND: {
        code: 302,
        message: 'Cannot send friend request to friend.'
    },
    YOU_HAVE_ALREADY_SENT_FRIEND_REQUEST: {
        code: 303,
        message: 'You have already sent friend request.'
    },
    FRIEND_HAVE_ALREADY_SENT_FRIEND_REQUEST: {
        code: 304,
        message: 'Friend have already sent friend request.'
    },
    CANNOT_DELETE_FRIEND_NOT_IN_FRIENDSHIP: {
        code: 305,
        message: 'Cannot delete friend not in friendship'
    },
    CANNOT_ACCEPT_SINCE_INVALID_STATE: {
        code: 306,
        message: 'Cannot accept since invalid state.'
    },
    FRIENDSHIP_DATA_IS_ABNORMAL: {
        code: 307,
        message: 'Friendship data is abnormal.'
    },
    CANNOT_FIND_USER_BY_NICKNAME: {
        code: 308,
        message: 'Cannot find user by nickname.'
    },

    SUBJECT_IS_REQUIRED: {
        code: 401,
        message: 'Subject is required.'
    },
    SUBJECT_IS_TOO_SHORT: {
        code: 402,
        message: 'Subject is too short.'
    },
    UNKNOWN_BBS: {
        code: 403,
        message: 'Unknown bbs.'
    },
    NO_POST_STORED: {
        code: 404,
        message: 'No post stored.'
    },

    NO_UTF8:{
        code: 405,
        message: 'Text encoding type is not'        
    },

    DUP_CONTENT:{
        code: 406,
        message: 'duplicated content'    
    },

    MAXIUM_LIMIT_EXCEEDED:{
        code: 407,
        message: 'Maxium limit exceeded'    
    },

    NOT_ALLOWED_TO_WRITE: {
        code: 500,
        message: 'Not allowed to write.',
    },
    NOT_ALLOWED_TO_UPDATE: {
        code: 501,
        message: 'Not allowed to update.',
    },
    NOT_ALLOWED_TO_DELETE: {
        code: 502,
        message: 'Not allowed to delete.',
    },

    NETFFICE_NETWORK_ERROR: {
        code: 1001,
        message: 'Network error occured from Netfice Api.'
    },
    NETFFICE_NO_DATA: {
        code: 1002,
        message: 'No data responsed from Netffice Api.'
    },
    NETFFICE_ERROR: {
        code: 1003,
        message: 'Error occured from Netffice Api.'
    },
    CANNOT_WRITE_USER_DATA_TO_REDIS_MEMORY: {
        code: 1004,
        message: 'Cannot write user data to redis memory.'
    },

    DATABASE_ERROR: {
        code: 2001,
        message: 'Error occured from Database.'
    },

    CLAN_NAME_IS_DUPLICATED: {
        code: 3001,
        message: 'Clan name is duplicated.'
    },
    USER_ALREADY_HAS_CLAN: {
        code: 3002,
        message: 'User already has a clan.'
    }
}