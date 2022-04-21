import ApiBase from './api.config';

const ENVIRONMENT = process.env.NODE_ENV
const ServerBase = ApiBase[ENVIRONMENT].protocol + "://" + ApiBase[ENVIRONMENT].host;
const ApiServer2 = {
    analictics:{
        keyDay:                 ServerBase + '/game/typing_practice/read_Day_typing_speed',
        keyMonthly:             ServerBase + '/game/typing_practice/read_month_typing_speed',
        
        keyTotalDay:            ServerBase + '/game/typing_practice/read_day_typing_speed_stat',
        keyTotalMonthly:        ServerBase + '/game/typing_practice/read_mouth_typing_speed_stat',
        
        keyAccDay:              ServerBase + '/game/typing_practice/read_day_typing_acc',
        keyAccMonthly:          ServerBase + '/game/typing_practice/read_month_typing_acc',
        
        keyVelocityDay:         ServerBase + '/game/typing_practice/read_day_word_velocity',
        keyVelocityMonthly:     ServerBase + '/game/typing_practice/read_month_word_velocity',

        keyFingerSpeedDay:      ServerBase + '/game/typing_practice/read_day_two_word_finger_speed',
        keyFingerSpeedMonthly:  ServerBase + '/game/typing_practice/read_month_two_word_finger_speed',
    },

    friends:{
        acceptFriend:           ServerBase + '/game/web2/friend/accept_friend_request',
    },

    userinfo:{
        getuserinfo:            ServerBase + "/game/request_userinfo2"
    },

    ranking:{
        getrankingSchool:       ServerBase + '/game/rank/request_rank_school',
        getrankingSchool2:      ServerBase + '/game/rank/request_rank_week_users',
        getrankingPersonal:     ServerBase + '/game/rank/rank_game_redis',
        getrankingSchoolSaved:  ServerBase + '/game/rank/request_rank_school',
        getrankingSchoolLive:   ServerBase + '/game/rank/rank_game_redis_school'
    },

    myPoints:{
        getPoints:              ServerBase + '/game/point/request_user_point'
    },

    clans:{
        getWabMembers:          ServerBase + '/game/clan/request_chosed_clan_info',
        getClans:               ServerBase + '/game/clan/request_all_clan_info',
        getMyClan:              ServerBase + '/game/clan/request_my_clan_info',
        makeClan:               ServerBase + '/game/clan/request_regit_clan',
        destroyClan:            ServerBase + '/game/clan/request_dell_clan',
        signinClan:             ServerBase + '/game/clan/request_join_clan',
        clanAgree:              ServerBase + '/game/clan/request_accept_clanmember',
        chosedClan:             ServerBase + '/game/clan/request_chosed_clan_info',
        kickMemverClan:         ServerBase + '/game/clan/request_dell_clanmember',
        exchangeManager:        ServerBase + '/game/clan/request_exchange_master_clan',
        denyMember:             ServerBase + '/game/clan/request_dell_clan_wanab_member',
        getIsClan:              ServerBase + '/game/clan/request_my_clan_info_all',
        changeDesc:             ServerBase + '/game/clan/request_update_clan_desc',

    },
    myClans:{
        postMyClans:            ServerBase +'/game/clan/request_my_clan_info'
    },
    kakaoAuthKey:{
        key : '95e3a945acd67ca51c5a4a0910a78d83'
    },
    menu:{
        usingLog : '/log_menu_using'
    },

    _routes: {
       
        /*새로 추가된 친구수락*/

        

        /**
         * Analictics
         */
        
    }
}

const server = ServerBase + "/game/web/" + ApiBase[ENVIRONMENT].version
for (var name in ApiServer2._routes) {
    const route = ApiServer2._routes[name]
    ApiServer2[name] = server + route.split(' ')[1]
}
export default ApiServer2;