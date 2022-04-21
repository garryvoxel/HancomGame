// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueCookie from 'vue-cookie'
import axios from 'axios'
import Menu from './menu'
import WebConfig from '../config/web.config'
import ResponseCode from './utils/response_code';

Vue.config.productionTip = false

Vue.use(VueCookie)

Vue.prototype.$axios = axios
Vue.prototype.$Menu = Menu

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>',
  data: {
    menu: Menu,
    user: {
      username: '',
      display_name: ''
    }
  },

  methods:{
    sessionId() {
      if (WebConfig.environment === 'development') {
        // Vue.cookie.set('session_id', '0c09b7c2-78b9-4d45-aef4-ee76228cfc89')
        //return '6f50b445-0f46-4488-a35c-cd6c32b413ca'
      }

      return Vue.cookie.get('session_id')
    },

    isLoggedIn() {
      return Boolean(this.sessionId())
    },

		bearerHeaders() {
			if (!this.isLoggedIn()) {
				return
			}

			return {
				headers: {
					Authorization: 'Bearer ' + this.$root.sessionId()
				}
			}
    },

    setCookie(name,val){
      Vue.cookie.set(name, val, 1);
    },
    
    getCookie(name){
      Vue.cookie.get(name);
    },

    deleteCookieNGoToLogin(){
      alert(
        "로그인 세션이 만료되었습니다.\n다시로그인 해주세요."
      );
      this.$cookie.delete("loginuser");
      this.$cookie.delete("display_name");
      window.location.href = "/typing/login";
      return;      
    }
  }
})
