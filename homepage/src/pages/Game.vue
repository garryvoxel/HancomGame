<template>
  <div id="game">
    <site-header />

    <!-- 본문영역 -->
    <section id="container">
      <div class="content-wrapper">
        <div class="contentService2">
          <!-- 타이틀 -->
          <h4 class="page_tit">게임</h4>
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
              <li>{{ items[$route.name].name }}</li>
            </ol>
          </div>
        </div>

        <div class="content" v-if="$route.name === 'piling-coins'">
          <div class="board">
            <div class="figure">
              <img src="/images/02_sub_img_02_02.png" alt="동전쌓기" />
            </div>
            <div>
              <h5>“동전을 쌓고 쌓아 승리를 쟁취하세요!”</h5>
              <p>
                쉬지 않고 쌓아서 상대방에게 무서운 공격을 보내주세요!
                <br />하늘의 별을 딸 수 있을만큼 높이 올라가봐요!
              </p>
            </div>
          </div>

          <div class="button-play">
            <a v-on:click.prevent="launch" title="동전쌓기 시작하기">
              <img src="/images/start.png" alt="동전쌓기 시작하기" />
            </a>
          </div>
          <div class="screenshot">
            <iframe
              width="1024"
              height="576"
              src="https://www.youtube.com/embed/3cw4JMgUF24"
              frameborder="0"
              allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
            ></iframe>
          </div>
        </div>

        <div class="content" v-else-if="$route.name === 'catching-moles'">
          <div class="board">
            <div class="figure">
              <img src="/images/02_sub_img_02_03.png" alt="두더지잡기" />
            </div>
            <div>
              <h5>"말랑말랑 무브먼트의 캐릭터가 사라지기 전에 타격!”</h5>
              <p>
                아이템을 지배하는 자! 두더지잡기를 정복한다.
                <br />스테이지를 진행할수록 재미있는 모험이 기다리고 있습니다.
              </p>
            </div>
          </div>

          <div class="button-play">
            <a v-on:click.prevent="launch" title="두더지잡기 시작하기">
              <img src="/images/start.png" alt="두더지잡기 시작하기" />
            </a>
          </div>
          <div class="screenshot">
            <iframe
              width="1024"
              height="576"
              src="https://www.youtube.com/embed/Dfmzp2srz98"
              frameborder="0"
              allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
            ></iframe>
          </div>
        </div>

        <div class="content" v-else>
          <div class="board">
            <div class="figure">
              <img src="/images/02_sub_img_02_01.png" alt="판 뒤집기" />
            </div>
            <div>
              <h5>“판을 지배하는 팀이 승리한다!”</h5>
              <p>
                뒤집고 뒤집어 승부를 뒤집는 영웅은 누구?
                <br />팀원과의 호흡, 완벽한 전략으로 모든 판을 뒤집어봐요!
              </p>
            </div>
          </div>

          <div class="button-play">
            <a v-on:click.prevent="launch" title="판 뒤집기 시작하기">
              <img src="/images/start.png" alt="판 뒤집기 시작하기" />
            </a>
          </div>
          <div class="screenshot">
            <iframe
              width="1024"
              height="576"
              src="https://www.youtube.com/embed/CgSmukiy_ss?rel=0"
              frameborder="0"
              allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
            ></iframe>
          </div>
        </div>
      </div>
    </section>

    <site-footer />

    <modal-channel v-if="showSelectChannel" @close="showSelectChannel = false" />
    <CatchingMolesAlert
      @cancel="cancelCatchingMolesAlert"
      @continue="continueCatchingMolesAlert"
      v-if="showCatchingMolesAlert"
    />
    <PilingCoinAlert
      @cancel="cancelPilingCoinAlert"
      @continue="continuePilingCoinAlert"
      v-if="showPilingCoinAlert"
    />
    <FlipingCardsAlert
      @cancel="cancelFlipingCardsAlert"
      @continue="continueFlipingCardsAlert"
      v-if="showFlipingCardsAlert"
    />
  </div>
</template>

<script>
import Result from "../utils/result";
import ModalChannel from "../components/ModalChannel.vue";
import FlipingCardsAlert from "../components/FlipingCardsAlert.vue";
import PilingCoinAlert from "../components/PilingCoinAlert.vue";
import CatchingMolesAlert from "../components/CatchingMolesAlert.vue";

export default {
  name: "games",

  components: {
    "modal-channel": ModalChannel,
    FlipingCardsAlert,
    PilingCoinAlert,
    CatchingMolesAlert
  },

  data() {
    return {
      menu: this.$root.menu[this.$options.name],
      items: this.$root.menu[this.$options.name].children,
      showSelectChannel: false,
      cookieNameDontShowPilingCoinAlertToday:
        "dont_show_Pilingcoin_alert_today",
      showPilingCoinAlert: false,
      cookieNameDontShowCatchingMolesAlertToday:
        "dont_show_catchingmoles_alert_today",
      showCatchingMolesAlert: false,
      cookieNameDontShowFlipingCardsAlertToday:
        "dont_show_flipingcards_alert_today",
      showFlipingCardsAlert: false
    };
  },

  methods: {
    launch() {
      if (!this.$root.isLoggedIn()) {
        if (
          !confirm(
            "게스트는 전적, 포인트 등이 기록되지 않습니다.\n로그인 하시겠습니까?"
          )
        ) {
          switch (this.$route.name) {
            case "piling-coins":
              if (
                !this.$cookie.get(this.cookieNameDontShowPilingCoinAlertToday)
              ) {
                this.showPilingCoinAlert = true;
                //console.log(this.$cookie.get(this.cookieNameDontShowPilingCoinAlertToday));
              } else {
                this.showSelectChannel = true;
              }
              break;
            case "catching-moles":
              if (
                !this.$cookie.get(
                  this.cookieNameDontShowCatchingMolesAlertToday
                )
              ) {
                this.showCatchingMolesAlert = true;
              } else {
                this.$root.playGame(this.$route.name);
              }
              break;
            case "flipping-cards":
              if (
                !this.$cookie.get(this.cookieNameDontShowFlipingCardsAlertToday)
              ) {
                this.showFlipingCardsAlert = true;
              } else {
                this.$root.playGame(this.$route.name);
              }
              break;
          }
          return;
        }
        this.$root.redirectToLogin();
        return;
      } else {
        switch (this.$route.name) {
          case "piling-coins":
            if (
              !this.$cookie.get(this.cookieNameDontShowPilingCoinAlertToday)
            ) {
              this.showPilingCoinAlert = true;
              //console.log(this.$cookie.get(this.cookieNameDontShowPilingCoinAlertToday));
            } else {
              this.showSelectChannel = true;
            }
            break;
          case "catching-moles":
            if (
              !this.$cookie.get(this.cookieNameDontShowCatchingMolesAlertToday)
            ) {
              this.showCatchingMolesAlert = true;
            } else {
              this.$root.playGame(this.$route.name);
            }
            break;
          case "flipping-cards":
            if (
              !this.$cookie.get(this.cookieNameDontShowFlipingCardsAlertToday)
            ) {
              this.showFlipingCardsAlert = true;
            } else {
              this.$root.playGame(this.$route.name);
            }
            break;
        }
      }
    },

    processCookieDontShowCatchingMolesAlertToday(isChecked) { //두더지잡기 광고 만료날짜 세팅
      if (isChecked) {
        const midnight = new Date();

        midnight.setDate(midnight.getDate() + 7);
        midnight.setHours(0);
        midnight.setMinutes(0);
        midnight.setSeconds(0);
        midnight.setMilliseconds(0);

        this.$cookie.set(this.cookieNameDontShowCatchingMolesAlertToday, true, {
          expires: midnight
        });
      } else {
        this.$cookie.delete(this.cookieNameDontShowCatchingMolesAlertToday);
      }
    },

    cancelCatchingMolesAlert(isChecked) { //두더지잡기 광고나오기 없애기
      this.showCatchingMolesAlert = false;
      this.processCookieDontShowCatchingMolesAlertToday(isChecked);
    },

    continueCatchingMolesAlert(isChecked) { //두더지잡기 7일동안 광고나오지 않기
      this.showCatchingMolesAlert = false;
      this.processCookieDontShowCatchingMolesAlertToday(isChecked);
      this.$root.playGame(this.$route.name);
    },

    processCookieDontShowPilingCoinAlertToday(isChecked) { //동전쌓기 광고 만료날짜 세팅
      //console.log(isChecked);
      if (isChecked) {
        const midnight = new Date();

        midnight.setDate(midnight.getDate() + 7);
        midnight.setHours(0);
        midnight.setMinutes(0);
        midnight.setSeconds(0);
        midnight.setMilliseconds(0);

        this.$cookie.set(this.cookieNameDontShowPilingCoinAlertToday, true, {
          expires: midnight
        });
      } else {
        this.$cookie.delete(this.cookieNameDontShowPilingCoinAlertToday);
      }
    },

    cancelPilingCoinAlert(isChecked) { //동전쌓기 광고나오기 없애기
      this.showPilingCoinAlert = false;
      this.processCookieDontShowPilingCoinAlertToday(isChecked);
    },

    continuePilingCoinAlert(isChecked) { //동전쌓기 7일동안 광고나오지 않기
      this.showPilingCoinAlert = false;
      this.processCookieDontShowPilingCoinAlertToday(isChecked);
      this.showSelectChannel = true;
    },

    processCookieDontShowFlipingCardsAlertToday(isChecked) { //판뒤집기 광고 만료날짜 세팅
      if (isChecked) {
        const midnight = new Date();

        midnight.setDate(midnight.getDate() + 7);
        midnight.setHours(0);
        midnight.setMinutes(0);
        midnight.setSeconds(0);
        midnight.setMilliseconds(0);

        this.$cookie.set(this.cookieNameDontShowFlipingCardsAlertToday, true, {
          expires: midnight
        });
      } else {
        this.$cookie.delete(this.cookieNameDontShowFlipingCardsAlertToday);
      }
    },

    cancelFlipingCardsAlert(isChecked) { //판뒤집기 광고나오기 없애기
      this.showFlipingCardsAlert = false;
      this.processCookieDontShowFlipingCardsAlertToday(isChecked);
    },

    continueFlipingCardsAlert(isChecked) { //판뒤집기 7일동안 광고나오지 않기
      this.showFlipingCardsAlert = false;
      this.processCookieDontShowFlipingCardsAlertToday(isChecked);
      this.$root.playGame(this.$route.name);
    }
  },

  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.$root.registerNicknameIfNotExist();
    });
  },

  created() {
    this.$on("close", () => {
      this.showSelectChannel = false;
    });
  },

  mounted() {
    this.$nextTick(() => {
      if (this.$route.query.autorun === "true") {
        this.launch();
      }
    });
  }
};
</script>