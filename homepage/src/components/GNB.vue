<template>
  <div class="gnb" :class="{ show : isMenuOver }">
    <div class="gnb-submenu-background"></div>
    <div class="gnb-bar">
      <div class="gnb-logo">
        <a :href="$WebConfig.malangmalangLinks.site.uri" title="말랑말랑">
          <img src="/images/logo_malangmalang.png" alt="말랑말랑" />
        </a>
        <router-link to="/" title="한컴 타자">
          <img src="/images/logo_hancom_taja.png" alt="한컴 타자" />
        </router-link>
      </div>
      <nav class="gnb-nav">
        <ul class="gnb-menu" @mouseover="menuOver" @mouseout="menuOut">
          <li
            class="gnb-menuiem"
            v-for="(parent, parentKey) in menu"
            :key="parent.id"
            v-if="isMenuActive(parentKey)"
          >
            <router-link :to="parent.uri" @click.native="hideMenu">{{ parent.name }}</router-link>
            <ul class="gnb-submenu">
              <li
                class="gnb-submenuitem"
                v-for="(child, key) in parent.children"
                :key="child.id"
                v-if="key !== 'register-nickname'"
              >
                <router-link
                  :to="child.uri"
                  :class="{ on : ofPath(child.uri) }"
                  v-if="(key !== 'inquiry') && (key !== 'rain')"
                  @click.native="hideMenu"
                >{{ child.name }}</router-link>
                <a
                  :href="rainUri"
                  :class="{ on : ofPath(child.uri) }"
                  target="_blank"
                  v-if="key === 'rain'"
                >{{ child.name }}</a>
                <a
                  :href="inquiryUri"
                  :class="{ on : ofPath(child.uri) }"
                  target="_blank"
                  v-if="key === 'inquiry'"
                >{{ child.name }}</a>
              </li>
            </ul>
          </li>
        </ul>
      </nav>
      <div class="gnb-account">
        <div class="malang-malang-service darktheme">
          <nav class="clearfix">
            <div id="gnb_hb_menu" class="gnb-group"></div>
            <div id="gnb_login_btn" class="login-group"></div>
          </nav>
        </div>

        <!-- <ul class="gnb-account-menu" v-else>
          <li>
            <a @click.prevent="showServices">
              <img src="/images/button_gnb_more.png" alt="바로가기" />
            </a>

            <transition name="fade">
              <div id="services" class="gnb-tooltip" @mousewheel.stop v-show="isServicesVisible">
                <div class="gnb-tooltip-edge"></div>
                <div class="gnb-tooltip-scroll">
                  <div class="gnb-tooltip-content">
                    <ul>
                      <li v-for="service in services" :key="service.id">
                        <a :href="service.href" target="_blank" :title="service.name">
                          <div class="gnb-service">
                            <div
                              class="gnb-service-icon"
                              :style="`background-image: url('${service.iconUri}');`"
                            ></div>
                            <div class="gnb-service-icon-overlay"></div>
                            <span>{{ service.name }}</span>
                          </div>
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </transition>
          </li>
          <li v-if="! isLoggedIn">
            <a :href="loginUri" title="로그인">
              <img src="/images/button_gnb_login.png" alt="로그인" />
            </a>
          </li>
          <li v-else>
            <a
              class="gnb-profile"
              style="background-image:
                            url('https://dev-api.malangmalang.com/space/mobile/user/avatar?x-mapi-sid=1f782812-6d21-493a-8579-63f8aadc1f06');"
              @click.prevent="showAccountMenu"
            ></a>

            <transition name="fade">
              <div id="my-account" class="gnb-tooltip" v-show="isAccountMenuVisible">
                <div class="gnb-tooltip-edge"></div>
                <div class="gnb-tooltip-content">
                  <div class="gnb-my-account">
                    <div
                      class="gnb-my-profile-image"
                      style="background-image: url('https://dev-api.malangmalang.com/space/mobile/user/avatar?x-mapi-sid=1f782812-6d21-493a-8579-63f8aadc1f06');"
                    ></div>
                    <div
                      class="gnb-my-nickname"
                    >{{ user && user.nickname ? user.nickname : '설정 필요' }}</div>
                    <div class="gnb-my-email">{{ user && user.email ? user.email : '로그인 필요' }}</div>
                    <ul class="gnb-my-buttons">
                      <li>
                        <a @click.prevent="moveToMypage" class="gnb-my-button gray">마이페이지</a>
                      </li>
                      <li>
                        <a @click.prevent="logout" class="gnb-my-button purple">로그아웃</a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>gnb_login_btn
            </transition>
          </li>
        </ul>-->
      </div>
    </div>
  </div>
</template>

<script>
import services from "../services";

export default {
  data() {
    return {
      isLoggedIn: this.$root.isLoggedIn(),
      loginUri: this.$root.loginUri(),
      menu: this.$root.menu,
      services: services,
      isServicesVisible: false,
      isAccountMenuVisible: false,
      rainUri: this.$WebConfig.malangmalangLinks.rain.uri,
      inquiryUri: this.$WebConfig.malangmalangLinks.inquiry.uri,
      isMenuOver: false,
      isPreventedMouseOver: false
    };
  },

  computed: {
    user() {
      return this.$root.user;
    }
  },

  watch: {
    $route() {}
  },

  methods: {
    isMenuActive(key) {
      if (key === "mypage") {
        if (this.$root.isLoggedIn()) {
          return true;
        }
      } else {
        if (Object.keys(this.menu[key].children).length > 1) {
          return true;
        }
      }

      return false;
    },

    moveToMypage() {
      this.isAccountMenuVisible = false;

      if (this.isCurrentPath("/mypage/register-nickname")) {
        alert("닉네임을 먼저 설정해주세요.");
      } else {
        this.$router.push("/mypage");
      }
    },

    menuOver() {
      if (!this.isPreventedMouseOver) {
        this.isMenuOver = true;
      }
    },

    menuOut() {
      this.isMenuOver = false;
    },

    hideMenu() {
      const self = this;

      self.isPreventedMouseOver = true;
      self.isMenuOver = false;

      setTimeout(() => {
        self.isPreventedMouseOver = false;
      }, 500);
    },

    showServices() {
      this.isServicesVisible = !this.isServicesVisible;

      if (this.isAccountMenuVisible) {
        this.isAccountMenuVisible = false;
      }
    },

    showAccountMenu() {
      this.isAccountMenuVisible = !this.isAccountMenuVisible;

      if (this.isServicesVisible) {
        this.isServicesVisible = false;
      }
    },

    logout() {
      this.isLoggedIn = false;
      this.$root.logout();
    },

    isCurrentPath(path) {
      let currentPath = this.$route.path;

      if (
        currentPath !== "/" &&
        currentPath.charAt(currentPath.length - 1) === "/"
      ) {
        currentPath = currentPath.substring(0, currentPath.length - 1);
      }

      return currentPath === path;
    },

    ofPath(path) {
      if (this.$route.path.indexOf(path) != -1) {
        return true;
      }

      return false;
    },

    isCurrentPage(page) {
      const regexp = new RegExp(/^[/]([^/]*)/),
        firstPart = regexp.exec(this.$route.path);

      if (firstPart) {
        return firstPart[1] === page;
      }

      return false;
    }
  },
  mounted() {
    this.$nextTick(() => {
      // if (
      //     this.$WebConfig.environment !== "test" &&
      //     this.$WebConfig.environment !== "development")
      {
        if (window.MalangGNB !== undefined) {
          window.MalangGNB.initialize(
            "ko",
            encodeURIComponent(this.$route.path),
            true,
            "ent"
          );
        }
      }
    });
  }
};
</script>