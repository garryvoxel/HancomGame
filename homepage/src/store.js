import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import ApiConfig from '../config/api.config';

Vue.use(Vuex);

function generateUid(length) {
  const candidates =
    '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let uid = '';

  length = length || 6;

  for (var i = 0; i < length; i++) {
    const index = Math.floor(Math.random() * candidates.length);

    uid += candidates.charAt(index);
  }
  localStorage.setItem('uid', uid);
  return uid;
}

const store = new Vuex.Store({
  state: {
    last_Rank: 0,
    page: '',
    start_Rank: 0,
    first_user_Rank: 0,
    max_Count: 10,

    school_last_Rank: 0,
    school_page: '',
    school_start_Rank: 0,
    school_first_user_Rank: 0,
    school_max_Count: 10,
    ranking_noticeShow: true,
  },
  actions: {
    /**
     * GET /login api호출
     * @param {*로그인시 유효한 값} token
     */
    registerUser({ commit }, token) {
      return axios
        .get(ApiConfig.login, {
          headers: {
            Authorization: 'Bearer ' + token,
          },
        })
        .then(response => {
          //   if (!response || response.data.code != 1) {
          //     alert('로그인 정보가 없습니다.');

          //     return false;
          //   }

          //   this.user = response.data.user || null;
          //   if (this.user) {
          //     this.user.email = Vue.cookie.get('netffice_user_email');
          //   }

          //   if (!this.user.nickname) {
          //     this.$router.push('/mypage/register-nickname');
          //     return false;
          //   }

          //   if (
          //     this.$route.path === '/mypage/register-nickname' &&
          //     this.user.nickname
          //   ) {
          //     this.$router.push('/mypage');
          //     return false;
          //   }
          //   // console.log(this.user);
          //   localStorage.setItem('nickname', this.user.nickname);
          //   this.isApiServerLoggedIn = true;
          //   this.$EventBus.$emit('api-logged-in', this.user);
          return true;
        });
    },
  },
  mutations: {
    user_Rank: function(state, payload) {
      // console.log('user_Rank ', payload)
      state.last_Rank = payload;
    },
    first_user_Rank: function(state, payload) {
      state.first_user_Rank = payload;
    },
    page_direction: function(state, payload) {
      state.page = payload;
    },
    start_Rank: function(state, payload) {
      state.start_Rank = payload;
    },

    school_user_Rank: function(state, payload) {
      state.school_last_Rank = payload;
    },
    school_first_user_Rank: function(state, payload) {
      state.school_first_user_Rank = payload;
    },
    school_page_direction: function(state, payload) {
      state.school_page = payload;
    },
    school_start_Rank: function(state, payload) {
      state.school_start_Rank = payload;
    },
    ranking_notice_Show: function(state, payload) {
      // console.log(state.ranking_noticeShow);
      // console.log(payload);
      state.ranking_noticeShow = payload;
    },
  },
});
export default store;
