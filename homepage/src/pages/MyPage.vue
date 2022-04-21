<template>
  <div id="my-page">
    <site-header />

    <!-- 본문영역 -->
    <section id="container">
      <div class="content-wrapper">
        <div class="contentService6">
          <!-- 타이틀 -->
          <h4 class="page_tit">{{ currentTabName }}</h4>

          <!-- location -->
          <div class="location">
            <ol>
              <li class="home">
                <router-link to="/" title="홈으로">
                  <img src="/images/icon_home.png" alt="홈으로" />
                </router-link>
              </li>
              <li class="on">
                <router-link :to="menu.uri" :title="menu.name">{{ menu.name }}</router-link>
              </li>
              <li>{{ currentTabName }}</li>
            </ol>
          </div>
        </div>

        <register-nickname v-if="currentTab === 'register-nickname'" />
        <div v-else class="content">
          <nav class="tab-rounded">
            <ul>
              <li :class="{ selected : currentTab === 'basic-info' }">
                <router-link to="/mypage/basic-info" title="내 정보">
                  <!-- <a @click.stop="currentTab = 'basic-info'"> -->
                  <span id="icon-basic-info" class="tab-icon"></span>
                  <span>내 정보</span>
                  <!-- </a> -->
                </router-link>
              </li>
              <li :class="{ selected : currentTab === 'points' }">
                <!-- <a @click.stop="currentTab = 'points'">
                  <span id="icon-points" class="tab-icon"></span>
                  <span>포인트</span>
                </a>-->
                <router-link to="/mypage/points" title="포인트">
                  <span id="icon-points" class="tab-icon"></span>
                  <span>포인트</span>
                </router-link>
              </li>
              <li :class="{ selected : currentTab === 'stats' }">
                <!-- <a @click.stop="currentTab = 'stats'">
                  <span id="icon-points" class="tab-icon"></span>
                  <span>통계</span>
                </a>-->
                <router-link to="/mypage/stats" title="통계">
                  <span id="icon-stats" class="tab-icon"></span>
                  <span>통계</span>
                </router-link>
              </li>
            </ul>
          </nav>

          <basic-info v-if="currentTab === 'basic-info'" />
          <point-list v-if="currentTab === 'points'" />
          <stats v-if="currentTab === 'stats'" />
        </div>
      </div>
    </section>

    <site-footer />
  </div>
</template>

<script>
import RegisterNickname from '../components/Mypage/RegisterNickname.vue';
import BasicInfo from '../components/Mypage/BasicInfo.vue';
import PointList from '../components/Mypage/PointList.vue';
import Stats from '../components/Mypage/Stats.vue';
import { parseTwoDigitYear } from 'moment';

export default {
  name: 'mypage',

  components: {
    'basic-info': BasicInfo,
    'register-nickname': RegisterNickname,
    'point-list': PointList,
    stats: Stats,
  },

  data() {
    return {
      menu: this.$root.menu[this.$options.name],
      items: this.$root.menu[this.$options.name].children,
      currentTab: 'basic-info',
      currentTabName: '내 정보',
    };
  },

  methods: {
    points() {
      // if(localStorage.getItem("isSelected") === 'Y'){
      //     if (!confirm("기본정보를 저장하지 않고 이동 하시겠습니까?")) {
      //         return;
      //     }else{
      //         this.$router.push('points');
      //     }
      // }else{
      //     this.$router.push('points');
      //     return;
      // }

      this.$router.push('/mypage/points');
      // alert("서비스 준비중 입니다.");
      // return;
    },

    checkisInfo() {
      // if(localStorage.getItem("isSelected") === 'Y'){
      //     if (!confirm("기본정보를 저장하지 않고 이동 하시겠습니까?")) {
      //         return;
      //     }else{
      //         this.$router.push('stats');
      //     }
      // }else{
      //     this.$router.push('stats');
      //     return;
      // }
      this.$router.push('/mypage/stats');
    },
    changeTab() {
      const tab = this.$route.path;

      if (tab.indexOf('/mypage/basic-info') == 0) {
        this.currentTab = 'basic-info';
        this.currentTabName = this.items['basic-info'].name;
      } else if (tab.indexOf('/mypage/points') == 0) {
        this.currentTab = 'points';
        this.currentTabName = this.items['points'].name;
      } else if (tab.indexOf('/mypage/stats') == 0) {
        this.currentTab = 'stats';
        this.currentTabName = this.items['stats'].name;
      } else if (tab.indexOf('/mypage/register-nickname') == 0) {
        this.currentTab = 'register-nickname';
        this.currentTabName = this.items['register-nickname'].name;
      }
    },
  },

  computed: {
    user() {
      return this.$root.user || null;
    },
  },

  watch: {
    $route(to, from) {
      //   this.currentTab = to.name;
      this.changeTab();
    },
  },

  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (to.name === 'register-nickname') {
        if (vm.$root.registerNicknameIfNotExist()) {
          return;
        }
      }

      vm.$root.registerNicknameIfNotExist();
    });
  },

  mounted() {
    localStorage.setItem('isSelected', 'N');

    // console.log(this.$route.name);

    if (this.$route.name === 'register-nickname') {
      if (this.user && this.user.nickname) {
        alert('이미 닉네임을 설정하였습니다.');
        this.$router.push({ name: 'basic-info' });
        return;
      }
    }
  },

  created() {
    // this.currentTab = this.$route.name;
    this.changeTab();
    localStorage.setItem('isSelected', 'N');
  },
};
</script>