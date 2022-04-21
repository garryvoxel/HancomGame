import Vue from 'vue';
import router from './router';
import VueCookie from 'vue-cookie';
import axios from 'axios';
import App from './App.vue';
import GNB from './components/GNB.vue';
import SiteHeader from './components/SiteHeader.vue';
import SiteFooter from './components/SiteFooter.vue';
import Pagination from './components/Pagination.vue';
import RankingPagination from './components/RankingPagination.vue';
import Modal from './components/Modal.vue';
import AvatarImage from './components/AvatarImage.vue';
import Loader from './components/Loader.vue';
import Menu from './menu';
import WebConfig from '../config/web.config'; //홈페이지 Config값 가져오기
import ApiConfig from '../config/api.config'; //환경변수에 따라 API서버 Config값 가져오기 
import ApiConfig2 from '../config/api.config2'; 
import ApiConfig3 from '../config/api.config3';
import VeLine from 'v-charts/lib/line.common';
import Histogram from 'v-charts/lib/histogram.common';
import AirbnbStyleDatepicker from 'vue-airbnb-style-datepicker';
import 'vue-airbnb-style-datepicker/dist/vue-airbnb-style-datepicker.min.css';
import Result from './utils/result';
import store from './store';
const datepickerOptions = {
  sundayFirst: true,
  dateLabelFormat: 'YYYY ,dddd, MMMM D',
  days: ['월요일', '화요일', '수요일', '목요일', '금요일', '토요일', '일요일'],
  daysShort: ['월', '화', '수', '목', '금', '토', '일'],
  monthNames: [
    '1월',
    '2월',
    '3월',
    '4월',
    '5월',
    '6월',
    '7월',
    '8월',
    '9월',
    '10월',
    '11월',
    '12월',
  ],
  colors: {
    selected: '#8da314',
    inRange: '#cbd78a',
    selectedText: '#fff',
    text: '#565a5c',
    inRangeBorder: '#8da314',
    disabled: '#fff',
  },
  texts: {
    apply: '확인',
    cancel: '취소',
  },
  showShortcutsMenuTrigger: false,
};

Vue.use(AirbnbStyleDatepicker, datepickerOptions);
Vue.use(VueCookie);
//컴포넌트간 통신하기 위한 Vue 이벤트 핸들러를 global로 정의
Vue.prototype.$EventBus = new Vue();
//서버 API 통신을 위한 axios를 global로 정의
Vue.prototype.$axios = axios;
//홈페이지와 API서버 config값을 global로 정의
Vue.prototype.$WebConfig = WebConfig;
Vue.prototype.$Api = ApiConfig;
Vue.prototype.$Api2 = ApiConfig2;
Vue.prototype.$Api3 = ApiConfig3;
//한컴타자 메뉴 global로 정의
Vue.prototype.$Menu = Menu;
Vue.config.productionTip = false;
//global navigation bar
Vue.component('gnb', GNB);
Vue.component('site-header', SiteHeader);
Vue.component('site-footer', SiteFooter);
Vue.component('pagination', Pagination);
Vue.component('modal', Modal);
Vue.component('avatar-image', AvatarImage);
Vue.component('loader', Loader);
Vue.component('ve-line', VeLine);
Vue.component('ve-histo', Histogram);
Vue.component('rankingpagination', RankingPagination);
/**
 * SPA 이기 때문에 한번만 실행된다.
 * 홈페이지가 load되거나 refresh되는 경우 로그인 여부를 판단
 */
function init() {                  
  const token = Vue.cookie.get('session_id');
  if (token) {
    // GET /login API 호출
    return store.dispatch('registerUser', token);
  } else {  
    return Promise.resolve();
  }
}

/**
 * session_id는 다른 모듈에서 cookie에 설정
 * https://accounts.malangmalang.com/sign/in?redirect=https%3A%2F%2Ftyping.malangmalang.com%2F 이 링크 참고
*/
init()
  .then(() => {
    new Vue({
      router,
      store,
      data: {
        menu: Menu,
        user: null,
        isApiServerLoggedIn: false,
        lastLaunchedGameName: '',
        typingPracticeWindow: null,
        gameWindow: null,
      },

      created() {
        console.log('main.js - created');
        if (this.sessionId()) {
          this.registerUser();
        }
        /**
         * 한컴 GNB 동적 script 로드
         */
        const script = document.createElement('script');
        script.setAttribute('type', 'text/javascript');
        script.setAttribute(
          'src',
          this.$WebConfig.malangmalangLinks.gnbScript.uri
        );
        // if (
        //   this.$WebConfig.environment !== 'test' &&
        //   this.$WebConfig.environment !== 'development'
        // )
        // {
          script.onload = function() {
            if (window.MalangGNB) {
              window.MalangGNB.initialize('ko', '/', true, 'ent');
            }
          };
        // }
        document.getElementsByTagName('head')[0].appendChild(script);
      },

      methods: {
        /**
         * 세션아이디 가져오기  vue-cookie 이용
         */
        sessionId() {
          // if (WebConfig.environment === 'test') {
          //   return 'a99e8a9d-3527-4d85-b14a-f075f90599d3';
          // }
          return Vue.cookie.get('session_id');
        },
        /**
         * 로그인 되었는지 판단
         */
        isLoggedIn() {
          // console.log('this.sessionId() : ', this.sessionId());
          return Boolean(this.sessionId());
        },

        registerNicknameIfNotExist() { //닉네임이 없는 경우 등록페이지로 이행
          if (this.isLoggedIn() && this.user && !this.user.nickname) {
            this.$router.push({
              path: '/mypage/register-nickname',
              query: {
                redirect: this.$route.path,
              },
            });

            return true;
          }

          return false;
        },
        /**
         * 로그인되어있는 경우 bearer header에 sessionId 세팅
         */
        bearerHeaders() {
          if (!this.isLoggedIn()) {
            // console.log('!this.isLoggedIn()');
            return;
          }
          return {
            headers: {
              Authorization: 'Bearer ' + this.$root.sessionId(),
              'Cache-Control': 'no-cache',
              Pragma: 'no-cache'
            },
          };
        },
        /**
         * 로그인 페이지 redirect url얻기
         */
        loginUri() { 
          return (
            this.$WebConfig.malangmalangLinks.login.uri +
            '?redirect=' +
            encodeURIComponent(window.location.href)
          );
        },
        /**
         * 로그인 페이지로 이행
         */
        redirectToLogin() {
          window.location.href = this.loginUri();
          // this.$router.push('/')
        },
        /**
         * 로그아웃 & 메인 홈페이지로 이행
         */
        logout() {
          localStorage.clear();
          window.location.href =
            this.$WebConfig.malangmalangLinks.logout.uri +
            '?redirect=' +
            encodeURIComponent(window.location.href);
        },
        /**
         * sessionId를 이용하여 API서버에 로그인상태를 알리고 해당 유저정보를 얻기 
         * 로그인은 말랑말랑 플랫폼에서 하기때문에 로그인 상태를 API서버에 반영할 필요가 있음
         * @param {*registerUser 호출후 실행되어야 하는 메소드를 파라미터로 정의} onSuccess   
        */
        registerUser(onSuccess) {
          this.$axios
            .get(
              this.$Api.login + '?token=' + this.generateUid(12),
              this.bearerHeaders()
            )
            .then(response => {
              if (!response || response.data.code != 1) {
                alert('로그인 정보가 없습니다.');
                if (WebConfig.environment !== 'test') {
                  //로그인 유저 정보 취득에 실패한 경우 로그아웃 메소드 호출
                  this.logout();
                }
                return false;
              }
              //유저정보 설정 & 이메일 설정
              this.user = response.data.user || null;
              if (this.user) {
                this.user.email = Vue.cookie.get('netffice_user_email');
              }
              //Nickname이 없는 유저에 한해 Nickname 등록페이지로 이행
              if (!this.user.nickname) {
                this.$router.push('/mypage/register-nickname');
                return false;
              }
              //Nickname이 설정되어 있는 유저가 Nickname등록페이지로 이행할 경우 Mypage로 redirect
              if (
                this.$route.path === '/mypage/register-nickname' &&
                this.user.nickname
              ) {
                this.$router.push('/mypage');
                return false;
              }
              // console.log(this.user);
              //Nickname을 localstorage에 보관
              localStorage.setItem('nickname', this.user.nickname);
              //API서버 로그인 플래그 설정
              this.isApiServerLoggedIn = true;
              //api-logged-in 이벤트 호출 -> App/mounted 메소드에 이벤트 정의되어 있음
              this.$EventBus.$emit('api-logged-in', this.user);
              if (onSuccess) {
                //onSuccess파라미터가 전달된 경우 onSuccess메소드 호출
                onSuccess();
              }
              this.$root.sendLog(0);
              return true;
            })
            .catch(error => {
              console.error(error);
            });
        },
        /**
         * uid 생성하기
         * @param {* uid길이} length 
         */
        generateUid(length) {
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
        },
        /**
         * 손님아이디 가져오기 함수
         */
        getGuestId() {
          let guestId = Vue.cookie.get('guest_id');
          if (!guestId) {
            guestId = 'Guest_' + this.generateUid(6);
            Vue.cookie.set('guest_id', guestId, {
              expires: '3h',
              domain: 'localhost',
            });
          }
          return guestId;
        },
        /**
         * 타자연습페이지로 이행
         * @param {*} exercise 
         */
        launchTajaTyping(exercise) {
          const name = exercise || 'learning-key-placements',
            specs = {
              width: parseInt(window.screen.width / 2),
              height: parseInt(window.screen.height / 2),
              menubar: 'no',
              resizable: 'yes',
              location: 'no',
            },
            specsArray = [];

          let url =
            WebConfig.malangmalangLinks.typingPractice.uri + '?exercise=';

          switch (name) {
            case 'exercising-words-typing':
              url += 'words-typing';
              this.$root.sendLog(2);
              break;
            case 'exercising-sentence-typing':
              url += 'sentence-typing';
              this.$root.sendLog(3);
              break;
            case 'exercising-writing-typing':
              url += 'writing-typing';
              this.$root.sendLog(4);
              break;

            default:
            case 'learning-key-placements':
              url += 'key-placements';
              this.$root.sendLog(1);
              break;
          }
          specs.width = 1024;
          specs.height = 598;

          specs.width = parseInt(specs.height * 1.78);
          specs.left = parseInt((window.screen.width - specs.width) / 2);
          specs.top = parseInt((window.screen.height - specs.height) / 2);

          for (var key in specs) {
            specsArray.push(`${key}=${specs[key]}`);
          }

          const self = this;

          if (this.isLoggedIn()) {
            this.registerUser(() => {
              self.lastLaunchedGameName = name;
              self.typingPracticeWindow = window.open(
                url,
                name,
                specsArray.join(',')
              );
            });
          } else {
            this.getGuestId();
            this.lastLaunchedGameName = name;
            this.typingPracticeWindow = window.open(
              url,
              name,
              specsArray.join(',')
            );
          }
        },

        playGame(name, channelId) {
          const specs = {
              width: parseInt(window.screen.width / 2),
              height: parseInt(window.screen.height / 2),
              menubar: 'no',
              resizable: 'yes',
              location: 'no',
            },
            specsArray = [];

          let url;

          switch (name) {
            case 'catching-moles':
              url = WebConfig.malangmalangLinks.catchingMoles.uri;
              specs.width = 720;
              specs.height = 800;
              this.sendLog(5);
              break;

            case 'flipping-cards':
              // if (WebConfig.environment !== 'test' && WebConfig.environment !== 'development') {
              //     alert('서비스 준비중 입니다.')
              //     return
              // }

              // alert('서비스 준비중 입니다.')

              url = WebConfig.malangmalangLinks.flippingCards.uri;
              specs.width = 1024;
              specs.height = 598;
              this.sendLog(7);
              break;

            case 'piling-coins':
              url =
                WebConfig.malangmalangLinks.pilingCoins.uri +
                (channelId ? '?channel=' + channelId : '');
              specs.width = 1024;
              specs.height = 598;
              this.sendLog(6);
              break;

            default:
              alert('서비스 준비중입니다.');
              return;
          }

          specs.left = parseInt((window.screen.width - specs.width) / 2);
          specs.top = parseInt((window.screen.height - specs.height) / 2);

          for (var key in specs) {
            specsArray.push(`${key}=${specs[key]}`);
          }

          const self = this;

          if (this.isLoggedIn()) {
            this.registerUser(() => {
              self.lastLaunchedGameName = name;
              self.gameWindow = window.open(url, name, specsArray.join(','));
            });
          } else {
            this.getGuestId();
            this.lastLaunchedGameName = name;
            this.gameWindow = window.open(url, name, specsArray.join(','));
          }
        },
        getExpireTime() {
          //console.log(Vue.cookie.get('expires'));
          return Vue.cookie.get('expires');
        },

        sendLog(num) {
          var checkLogin = null;
          if (this.isLoggedIn()) {
            checkLogin = this.sessionId();
          } else {
            checkLogin = this.getGuestId();
            console.log("checkLogin----", checkLogin);
          }
          this.$axios
            .put(
              this.$Api.logs,
              {
                menu_type: num,
                Authorization: 'Bearer' + checkLogin,
              },
              this.$root.bearerHeaders()
            )
            .then(response => {
              if (!response || response.data.code !== Result.OK.code) {
                return;
              }
            })
            .catch(error => {
              console.log(error);
            });
        },
      },
      render: h => h(App),
    }).$mount('#app');
  })
  .catch(e => {
    console.log('error');
  });
