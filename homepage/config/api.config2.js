import ApiBase from './api.config';
const ENVIRONMENT = process.env.NODE_ENV;
const ServerBase = ApiBase[ENVIRONMENT].protocol + "://" + ApiBase[ENVIRONMENT].host;
const ApiServer2 = {
  analictics: {
    keyDay:                 ServerBase + '/game/typing_practice/read_Day_typing_speed',
    keyMonthly:             ServerBase + '/game/typing_practice/read_month_typing_speed',

    keyTotalDay:            ServerBase + '/game/typing_practice/read_day_typing_speed_stat',
    keyTotalMonthly:        ServerBase + '/game/typing_practice/read_month_typing_speed_stat',

    keyAccDay:              ServerBase + '/game/typing_practice/read_day_typing_acc',
    keyAccMonthly:          ServerBase + '/game/typing_practice/read_month_typing_acc',

    keyVelocityDay:         ServerBase + '/game/typing_practice/read_day_word_velocity',
    keyVelocityMonthly:     ServerBase + '/game/typing_practice/read_month_word_velocity',

    keyFingerSpeedDay:      ServerBase + '/game/typing_practice/read_day_two_word_finger_speed',
    keyFingerSpeedMonthly:  ServerBase + '/game/typing_practice/read_month_two_word_finger_speed'
  },

  friends: {
    acceptFriend:           ServerBase + '/game/web2/friend/accept_friend_request'
  },

  userinfo: {
    getuserinfo:            ServerBase + '/game/request_userinfo2'
  },

  ranking: {
    getrankingSchool:       ServerBase + '/game/rank/rank_game_redis_school',
    getrankingPersonal:     ServerBase + '/game/rank/rank_game_redis',
    getrankingTop5:         ServerBase + '/game/rank/rank_game_redis_without_selfinfo',
    getrankingPersonalACC:  ServerBase + '/game/rank/request_rank_school2',
    getrankingSchoolACC:    ServerBase + '/game/rank/request_rank_school'
  },

  myPoints: {
    getPoints:              ServerBase + '/game/point/request_user_point'
  },

  clans: {
    getIsClan:              ServerBase + '/game/clan/request_my_clan_info_all',
    getAllClans:            ServerBase + '/game/clan/request_all_clan_info',
    makeClan:               ServerBase + '/game/clan/request_regit_clan',
    getMyClan:              ServerBase + '/game/clan/request_my_clan_info',
    signUpClan:             ServerBase + '/game/clan/request_join_clan',
    getSelectedClan:        ServerBase + '/game/clan/request_chosed_clan_info',
    deleteMember:           ServerBase + '/game/clan/request_dell_clanmember',
    deleteClan:             ServerBase + '/game/clan/request_dell_clan',
    mandateMaster:          ServerBase + '/game/clan/request_exchange_master_clan',
    acceptMember:           ServerBase + '/game/clan/request_accept_clanmember',
    denyMember:             ServerBase + '/game/clan/request_dell_clan_wanab_member',
    changeDesc:             ServerBase + '/game/clan/request_update_clan_desc',
    getWabMembers:          ServerBase + '/game/clan/request_chosed_clan_info'
  },
  _routes: {
    /*새로 추가된 친구수락*/
    /**
     * Analictics
     */
  }
};

export default ApiServer2;
