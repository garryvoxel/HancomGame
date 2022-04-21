/* eslint-disable no-console */
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import VueCookie from 'vue-cookie'
import WebConfig from '../config/web.config'
import ApiConfig from '../config/api.config'
import ApiConfig2 from '../config/api.config2'
import ApiConfig3 from '../config/api.config3'
import Pagination from './components/Pagination.vue'
import Modal from './components/Modal.vue'
import ModalSearch from './components/modalSearch.vue'
import ModalReport from './components/ModalReport.vue'
import AvatarImage from './components/AvatarImage.vue'
import RankingPagination from './components/RankingPagination.vue'
import AirbnbStyleDatepicker from 'vue-airbnb-style-datepicker'
import 'vue-airbnb-style-datepicker/dist/vue-airbnb-style-datepicker.min.css'
import store from './store';
const datepickerOptions = {sundayFirst: true,
    dateLabelFormat: 'dddd, MMMM D, YYYY',
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
      selected: '#00a699',
      inRange: '#66e2da',
      selectedText: '#fff',
      text: '#565a5c',
      inRangeBorder: '#33dacd',
      disabled: '#fff',
    },
    texts: {
      apply: '확인',
      cancel: '취소',
    },
  }

Vue.use(VueCookie)
Vue.use(require('vue-moment'))
Vue.use(AirbnbStyleDatepicker, datepickerOptions)
Vue.component('pagination', Pagination)
Vue.component('modal', Modal)
Vue.component('modalSearch',ModalSearch)
Vue.component('ModalReport',ModalReport);
Vue.component('avatar-image', AvatarImage)
Vue.component('rankingpagination',RankingPagination);

Vue.prototype.$EventBus = new Vue()
Vue.prototype.$axios = axios
Vue.prototype.$WebConfig = WebConfig
Vue.prototype.$Api = ApiConfig
Vue.prototype.$Api2 = ApiConfig2
Vue.prototype.$Api3 = ApiConfig3
Vue.prototype.$childWindow = null
Vue.config.productionTip = false


new Vue({
  router,
  store,
  render: h => h(App),

  data: {
    // menu: Menu,
    user: null,
    isApiServerLoggedIn: false,
    lastLaunchedGameName: '',
    gameHosts: {},
    nickname: '',
    checkmassage:''
  },

  methods: {
    sessionId() {
        // if (WebConfig.environment === 'test') {
        //  return 'b6155029-4d05-4108-a5db-a9ab8ca97e50';
        // }

        return Vue.cookie.get('session_id')
    },

    isLoggedIn() {

        return Boolean(this.sessionId())
    },

    registerNicknameIfNotExist() {
        if (this.isLoggedIn() && this.user && !this.user.nickname) {
            this.$router.push({
                path: '/mypage/register-nickname',
                query: {
                    redirect: this.$route.path
                }
            })

            return true
        }

        return false
    },

    bearerHeaders() {
        if (!this.isLoggedIn()) {
            return
        }

        return {
            headers: {
                Authorization: 'Bearer ' + this.$root.sessionId(),
                'Cache-Control': 'no-cache',
                Pragma: 'no-cache'
            }
        }
    },
    malangUri() {
        this.Log(0);
        return this.$WebConfig.malangmalangLinks.site.uri
    },
    loginUri() {
        this.Log(0);
        return this.$WebConfig.malangmalangLinks.login.uri + '?redirect=' + encodeURIComponent(window.location.href)
    },
    signupUri()
    {

       return this.$WebConfig.malangmalangLinks.signup.uri
    },
    mypageUri() {
        return this.$WebConfig.malangmalangLinks.mypage.uri;
    },
    inquryUri(){
        this.Log(18);
        return this.$WebConfig.malangmalangLinks.inquiry.uri

    },
    redirectToLoginUrl()
    {
        window.location.href = this.loginUri();
    },



    logout() {
      localStorage.clear();
       window.location.href = this.$WebConfig.malangmalangLinks.logout.uri + '?redirect=' + encodeURIComponent(window.location.href)
       this.$router.push({name:'home'});
    },

    registerUser(onSuccess) {
        console.log("registerUser");
        this.$axios
            .get(this.$Api.login + '?token=' + this.generateUid(12), this.bearerHeaders())
            .then(response => {
                console.log(response.data)

                if (!response || response.data.code != 1) {
                    console.error('Failed to register user by Session Id: ' + this.sessionId())
                    alert('로그인 정보가 없습니다.')
                    if (WebConfig.environment !== 'test') {
                        this.logout()
                    }
                    return false
                }

                this.user = response.data.user || null;

                console.log(response.data);
                if (this.user) {
                    this.user.email = Vue.cookie.get('netffice_user_email')
                }

                if (!this.user.nickname) {
                    this.$router.push('/mypage/register-nickname')
                    return false
                }

                if (this.$route.path === '/mypage/register-nickname' && this.user.nickname) {
                    this.$router.push('/mypage')
                    return false
                }

                this.isApiServerLoggedIn = true
                this.$EventBus.$emit('api-logged-in', this.user)
                localStorage.setItem("nickname",this.user.nickname);
                if (onSuccess) {
                    onSuccess()
                }

                return true
            })
            .catch(error => {
                console.error(error)
            })
    },
    generateUid(length) {
        const candidates = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
        let uid = ''

        length = length || 6

        for (var i = 0; i < length; i++) {
            const index = Math.floor(Math.random() * candidates.length)

            uid += candidates.charAt(index)
        }

        return uid
    },

    generateGuestUid() {
        const
            candidates = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
            length = 6

        let uid = ''

        for (var i = 0; i < length; i++) {
            const index = Math.floor(Math.random() * candidates.length)

            uid += candidates.charAt(index)
        }

        return uid
    },

    getGuestId() {
        let guestId = Vue.cookie.get('guest_id')

        if (!guestId) {
            guestId = 'Guest_' + this.generateGuestUid()

            Vue.cookie.set('guest_id', guestId, {
                expires: '3h',
                domain: '.malangmalang.com'
            })
        }

        return guestId
    },

    playGame(name,channelId) {
        const
            specs = {
                width: parseInt(window.screen.width / 2),
                height: parseInt(window.screen.height / 2),
                menubar: 'no',
                resizable: 'yes'
            },
            specsArray = []

        let url;

        switch (name) {
            case 'catching-moles':
                url = WebConfig.malangmalangLinks.catchingMoles.uri
                specs.width = 700
                specs.height = 800
                break

            case 'piling-coins':
                url = WebConfig.malangmalangLinks.pilingCoins.uri + '/' + (channelId ? "?channel=" + channelId : '')
             //   alert("join : " + channelId )
                specs.width = 1024
                specs.height = 598
                break

            default:
                alert('준비중입니다.')
                return
        }

        this.lastLaunchedGameName = name

        if (!this.isLoggedIn()) {
            this.getGuestId()
        }

        specs.left = parseInt((window.screen.width - specs.width) / 2)
        specs.top = parseInt((window.screen.height - specs.height) / 2)

        for (var key in specs) {
            specsArray.push(`${key}=${specs[key]}`)
        }

        this.$childWindow = window.open(url, name, specsArray.join(','))

    },
    Log(num)
    {
        this.$axios
        .put(this.$Api.logs,
        { menu_type: num, Authorization:'Bearer' + this.$root.sessionId() }, this.$root.bearerHeaders())
        .then(response => {
            console.log(response.data);
            if (!response || response.data.code != 1) {
                return
            }
        })
        .catch(error => {
            console.error(error)
        })
    }
},

created() {

    console.log('Mode: ' + process.env.NODE_ENV)

    if (this.sessionId()) {
        this.registerUser()

    }


    /**
     * 한컴 GNB 동적 script 로드
     */
    const script = document.createElement('script')

    script.setAttribute('type', 'text/javascript');
    script.setAttribute('src', this.$WebConfig.malangmalangLinks.gnbScript.uri);

    if (this.$WebConfig.environment !== 'test' && this.$WebConfig.environment !== 'development') {
        script.onload = function () {
            if (window.MalangGNB) {
                window.MalangGNB.initialize('ko', '/');
            }
        }
    }

    document.getElementsByTagName('head')[0].appendChild(script)

    /**
     * 임 윈도우와 통신
     */
    const
        self = this,
        whitelistUri = [
            this.$WebConfig.malangmalangLinks.pilingCoins.uri,
            this.$WebConfig.malangmalangLinks.catchingMoles.uri,
            this.$WebConfig.malangmalangLinks.flippingCards.uri,
            this.$WebConfig.malangmalangLinks.typingPractice.uri
        ],
        whitelist = whitelistUri.map(uri => {
            const parser = document.createElement('a')

            parser.href = uri

            return `${parser.protocol}//${parser.host}`
        })

    this.gameHosts = {
        'taja-typing': whitelist[3],
        'catching-moles': whitelist[1],
        'flipping-cards': whitelist[2],
        'piling-coins': whitelist[0]
    }

    window.addEventListener('message', (event) => {
        if (whitelist.includes(event.origin)) {
            self.$EventBus.$emit('onPostMessage', event)
        }
    })
  }
}).$mount('#app')
