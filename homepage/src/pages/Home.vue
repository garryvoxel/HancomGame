<template>
  <div id="home">
    <div id="fullpage" style="min-width: 1336px;">
      <section class="section first">
        <gnb class="gnb-slide-transition" :class="{ appear : showGnb[0] }" v-show="showGnb[0]" />

        <div class="bottom-paper"></div>
        <div class="animation-canvas">
          <div class="fs01 is-aniamte-fade">
            <img src="/images/text_as_game.png" alt="게임으로 즐기는" />
          </div>
          <div class="fs02 is-aniamte-fade">
            <img src="/images/text_new_taja_typing.png" alt="새로운 타자게임" />
          </div>

          <div class="fs011 is-animated__single">
            <img src="/images/main/01.png" alt />
          </div>
          <div class="fs0111 is-animated">
            <img src="/images/main/02.png" alt />
          </div>

          <div class="fs03 is-animated">
            <img src="/images/main/t04.png" alt />
          </div>
          <div class="fs033 is-animated">
            <img src="/images/main/04.png" alt />
          </div>
          <div class="fs044 is-animated_f"></div>
          <div class="fs0444 is-animated_f"></div>
          <div class="fs04 is-aniamte-zoomin">
            <img src="/images/main/fireworks_big.png" alt />
          </div>
          <div class="fs05 is-aniamte-zoomin">
            <img src="/images/main/fireworks_big.png" alt />
          </div>
          <div class="fs06 is-animated">
            <img src="/images/main/t01.png" alt />
          </div>
          <div>
            <div class="wave light"></div>
            <div class="wave middle"></div>
            <div class="wave white"></div>
          </div>
          <div class="main-launch-tt">
            <a @click.prevent="launchTajaTyping()" title="한컴 타자연습 시작">
              <img src="/images/button_launch_taja_typing.png" alt="한컴 타자연습 시작" />
            </a>
          </div>
        </div>
        <div class="main-scrollable">
          <img src="/images/scroll.png" alt="스크롤" />
        </div>
      </section>

      <section class="section second">
        <gnb class="gnb-slide-transition" :class="{ appear : showGnb[1] }" v-show="showGnb[1]" />

        <div class="ss01 is-aniamte-fade">
          <img src="/images/main/section02_txt01.png" alt />
        </div>
        <div class="ss02 is-animated__single">
          <img src="/images/main/tt07.png" alt />
        </div>
        <div class="ss03 is-aniamte-fade">
          <img src="/images/main/tt03.png" alt />
        </div>

        <div class="ss04 is-animated mm_box">
          <div class="mgi_thum">
            <img src="/images/main/tt05.png" alt="두더지잡기 소개" />
          </div>
          <p class="ta_c">빠르고 날쌔게~ 출몰하는 두더지를 잡자!</p>
          <div class="main-play-game">
            <a @click.prevent="playGame('catching-moles')" title="두더지잡기 게임 시작하기">
              <img src="/images/button_play_game.png" alt="두더지잡기 게임 시작하기" />
            </a>
          </div>
        </div>

        <div class="ss05 is-animated mm_box">
          <div class="mgi_thum">
            <img src="/images/main/tt04.png" alt="동전쌓기 소개" />
          </div>
          <p class="ta_c">동전 쌓기의 달인에 도전해 보세요!</p>
          <div class="main-play-game">
            <a @click.prevent="playGame('piling-coins')" title="동전쌓기 게임 시작하기">
              <img src="/images/button_play_game.png" alt="동전쌓기 게임 시작하기" />
            </a>
          </div>
        </div>
        <div class="ss06 is-animated mm_box">
          <div class="mgi_thum">
            <img src="/images/main/tt06.png" alt="판 뒤집기 소개" />
          </div>
          <p class="ta_c">판을 뒤집을 역전의 용사, 누구인가?</p>
          <div class="main-play-game">
            <a @click.prevent="playGame('flipping-cards')" title="판 뒤집기 게임 시작하기">
              <img src="/images/button_play_game.png" alt="판 뒤집기 게임 시작하기" />
            </a>
            <!-- <a @click.prevent="readyToService" title="판 뒤집기 게임 시작하기">
                            <img src="/images/button_play_game.png" alt="판 뒤집기 게임 시작하기">
            </a>-->
          </div>
        </div>

        <div>
          <div id="clouds33" class="clouds1"></div>
          <div id="clouds11" class="clouds1"></div>
          <div id="clouds22" class="clouds1"></div>
        </div>
      </section>

      <section class="section fourth fp-auto-height">
        <site-footer :bottomBanner="bottomBanner" />
      </section>
    </div>

    <modal-channel v-if="showSelectChannel" @close="showSelectChannel = false" />

    <typing-practice-alert
      @cancel="cancelTypingPracticeAlert"
      @continue="continueTypingPracticeAlert"
      v-if="showTypingPracticeAlert"
    />
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

    <side-banner id="left-banner" :leftBanner="leftBanner" v-if="leftBanner" />
    <modal-front />
  </div>
</template>

<script>
import Result from "../utils/result";
import ModalChannel from "../components/ModalChannel.vue";
import TypingPracticeAlert from "../components/TypingPracticeAlert.vue";
import FlipingCardsAlert from "../components/FlipingCardsAlert.vue";
import PilingCoinAlert from "../components/PilingCoinAlert.vue";
import CatchingMolesAlert from "../components/CatchingMolesAlert.vue";
import SideBanner from "../components/SideBanner.vue";
import SideBannerRight from "../components/SideBannerRight.vue";
import ModalFront from "../components/ModalFront.vue";

export default {
  name: "home",

  components: {
    "modal-channel": ModalChannel,
    "typing-practice-alert": TypingPracticeAlert,
    "side-banner": SideBanner,
    "side-banner-right": SideBannerRight,
    "modal-front": ModalFront,
    FlipingCardsAlert,
    PilingCoinAlert,
    CatchingMolesAlert
  },

  data() {
    return {
      showSelectChannel: false,
      nowRoute: this.$route.path,
      showGnb: [true, false, false],
      cookieNameDontShowTypngPracticeAlertToday:
        "dont_show_typing_practice_alert_today",
      showTypingPracticeAlert: false,
      cookieNameDontShowPilingCoinAlertToday:
        "dont_show_Pilingcoin_alert_today",
      showPilingCoinAlert: false,
      cookieNameDontShowCatchingMolesAlertToday:
        "dont_show_catchingmoles_alert_today",
      showCatchingMolesAlert: false,
      cookieNameDontShowFlipingCardsAlertToday:
        "dont_show_flipingcards_alert_today",
      showFlipingCardsAlert: false,
      leftBanner: null,
      rightBanner: null,
      bottomBanner: null,
      rankings: [],
      rank1: "",
      rank2: "",
      rank3: "",
      rank4: "",
      rank5: "",
      rank1Avatar: 0,
      rank2Avatar: 1,
      rank3Avatar: 2,
      rank4Avatar: 3,
      rank5Avatar: 4,
      enviroment: this.$WebConfig.environment,
      liveGNB: document.getElementsByClassName("gnb-account")[0]
    };
  },
  methods: {
    //광고 만료날자 세팅
    processCookieDontShowTypingPracticeAlertToday(isChecked) {
      if (isChecked) {
        const midnight = new Date();

        midnight.setDate(midnight.getDate() + 7);
        midnight.setHours(0);
        midnight.setMinutes(0);
        midnight.setSeconds(0);
        midnight.setMilliseconds(0);

        this.$cookie.set(this.cookieNameDontShowTypngPracticeAlertToday, true, {
          expires: midnight
        });
      } else {
        this.$cookie.delete(this.cookieNameDontShowTypngPracticeAlertToday);
      }
    },

    cancelTypingPracticeAlert(isChecked) {
      this.showTypingPracticeAlert = false;
      this.processCookieDontShowTypingPracticeAlertToday(isChecked);
    },

    continueTypingPracticeAlert(isChecked) {
      this.showTypingPracticeAlert = false;
      this.processCookieDontShowTypingPracticeAlertToday(isChecked);
      this.$root.launchTajaTyping();
    },

    processCookieDontShowCatchingMolesAlertToday(isChecked) {
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

    cancelCatchingMolesAlert(isChecked) {
      this.showCatchingMolesAlert = false;
      this.processCookieDontShowCatchingMolesAlertToday(isChecked);
    },

    continueCatchingMolesAlert(isChecked) {
      this.showCatchingMolesAlert = false;
      this.processCookieDontShowCatchingMolesAlertToday(isChecked);
      this.$root.playGame("catching-moles");
    },

    processCookieDontShowPilingCoinAlertToday(isChecked) {
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

    cancelPilingCoinAlert(isChecked) {
      this.showPilingCoinAlert = false;
      this.processCookieDontShowPilingCoinAlertToday(isChecked);
    },

    continuePilingCoinAlert(isChecked) {
      this.showPilingCoinAlert = false;
      this.processCookieDontShowPilingCoinAlertToday(isChecked);
      this.showSelectChannel = true;
    },

    processCookieDontShowFlipingCardsAlertToday(isChecked) {
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

    cancelFlipingCardsAlert(isChecked) {
      this.showFlipingCardsAlert = false;
      this.processCookieDontShowFlipingCardsAlertToday(isChecked);
    },

    continueFlipingCardsAlert(isChecked) {
      this.showFlipingCardsAlert = false;
      this.processCookieDontShowFlipingCardsAlertToday(isChecked);
      this.$root.playGame("flipping-cards");
    },

    playGame(name) { //플레이 게임
      if (!this.$root.isLoggedIn()) {
        if (
          !confirm(
            "게스트는 전적, 포인트 등이 기록되지 않습니다.\n로그인 하시겠습니까?"
          )
        ) {
          switch (name) {
            case "catching-moles":
              if (
                !this.$cookie.get(
                  this.cookieNameDontShowCatchingMolesAlertToday
                )
              ) {
                this.showCatchingMolesAlert = true;
              } else {
                this.$root.playGame(name);
              }
              break;
            case "piling-coins":
              if (
                !this.$cookie.get(this.cookieNameDontShowPilingCoinAlertToday)
              ) {
                this.showPilingCoinAlert = true;
              } else {
                this.showSelectChannel = true;
              }
              break;
            case "flipping-cards":
              if (
                !this.$cookie.get(this.cookieNameDontShowFlipingCardsAlertToday)
              ) {
                this.showFlipingCardsAlert = true;
              } else {
                this.$root.playGame(name);
              }
              break;
          }
          return;
        }
        this.$root.redirectToLogin();
        return;
      } else {
        switch (name) {
          case "catching-moles":
            if (
              !this.$cookie.get(this.cookieNameDontShowCatchingMolesAlertToday)
            ) {
              this.showCatchingMolesAlert = true;
            } else {
              this.$root.playGame(name);
            }
            break;
          case "piling-coins":
            if (
              !this.$cookie.get(this.cookieNameDontShowPilingCoinAlertToday)
            ) {
              this.showPilingCoinAlert = true;
            } else {
              this.showSelectChannel = true;
            }
            break;
          case "flipping-cards":
            if (
              !this.$cookie.get(this.cookieNameDontShowFlipingCardsAlertToday)
            ) {
              this.showFlipingCardsAlert = true;
            } else {
              this.$root.playGame(name);
            }
            break;
        }
      }
    },
    readyToService() {
      alert("서비스 준비중 입니다.");
    },
    launchTajaTyping() { //타자 타이핑 게임 실행
      if (!this.$root.isLoggedIn()) {
        if (
          !confirm(
            "게스트는 전적, 포인트 등이 기록되지 않습니다.\n로그인 하시겠습니까?"
          )
        ) {
          if (
            !this.$cookie.get(this.cookieNameDontShowTypngPracticeAlertToday)
          ) {
            this.showTypingPracticeAlert = true;
            return;
          }
          this.$root.launchTajaTyping();
          return;
        }
        this.$root.redirectToLogin();
      } else {
        if (!this.$cookie.get(this.cookieNameDontShowTypngPracticeAlertToday)) {
          this.showTypingPracticeAlert = true;
          return;
        }
        this.$root.launchTajaTyping();
      }
    },

    getRankingTop5() { //top 5 랭킹 가져오기 함수
      // this.$EventBus.$emit("loading-add", "fetch-rankings");
      this.$axios
        .post(this.$Api2.ranking.getrankingTop5, {
          gamecode: "TYPING_RANKING",
          start: 0,
          end: 100
        })
        .then(response => {
          if (!response) {
            return;
          }
          this.rankings = response.data;
          this.rank1 = this.rankings[0].nickname;
          this.rank2 = this.rankings[1].nickname;
          this.rank3 = this.rankings[2].nickname;
          this.rank4 = this.rankings[3].nickname;
          this.rank5 = this.rankings[4].nickname;

          this.rank1Avatar = 0;
          this.rank2Avatar = this.rankings[1].avatar;
          this.rank3Avatar = this.rankings[2].avatar;
          this.rank4Avatar = this.rankings[3].avatar;
          this.rank5Avatar = this.rankings[4].avatar;
        })
        .catch(error => {
          console.log(error);
          // this.$EventBus.$emit("loading-remove", "fetch-rankings");
        });
    }
  },

  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.$root.registerNicknameIfNotExist();
    });
  },

  created() {
    this.$axios
      .get(this.$Api.ads + "?type=web", this.$root.bearerHeaders())
      .then(response => {
        if (!response || response.data.code !== Result.OK.code) {
          return;
        }

        if (response.data.items && response.data.items.length) {
          response.data.items.forEach(item => {
            switch (item.type) {
              case "main-bottom":
                this.bottomBanner = item;
                break;

              case "main-left":
                this.leftBanner = item;
                break;

              default:
                break;
            }
          });
        }
      })
      .catch(error => {
        console.log(error);
      });
    // this.getRankingTop5();
    this.$root.getExpireTime();
  },

  mounted() {
    const self = this;
    const liveGNB = document.getElementsByClassName("gnb-account")[0];
    this.$nextTick(function() {
      document.body.addEventListener("scroll", function(e) {
        document.getElementById("left-banner").style.left =
          -this.scrollLeft + 40 + "px";
      });

      // variables
      var $isAnimatedFirst = $(".first .is-animated"),
        $isAnimatedFirstSingle = $(".first .is-animated__single"),
        $isAnimatedFirstText = $(".first .is-aniamte-fade"),
        $isAnimatedFirstFire = $(".first .is-aniamte-zoomin"),
        $isAnimatedFirstFires = $(".first .is-animated_f"),
        $isAnimatedSecond = $(".second .is-animated"),
        $isAnimatedSecondSingle = $(".second .is-animated__single"),
        $isAnimatedSecondText = $(".second .is-aniamte-fade"),
        //
        $isAnimatedThird = $(".third .is-animated"),
        $isAnimatedThirdSingle = $(".third .is-animated__single"),
        $isAnimatedThirdText = $(".third .is-aniamte-fade");

      $isAnimatedFirst.addClass("animated fadeInUpBig");
      $isAnimatedFirst.eq(0).css("animation-delay", ".3s");
      $isAnimatedFirst.eq(1).css("animation-delay", ".6s");
      $isAnimatedFirst.eq(2).css("animation-delay", ".9s");
      $isAnimatedFirstText.addClass("animated fadeIn");
      $isAnimatedFirstText.eq(0).css("animation-delay", ".5s");
      $isAnimatedFirstText.eq(1).css("animation-delay", ".8s");
      $isAnimatedFirstFire.addClass("animated_z zoomIn");
      $isAnimatedFirstFire.eq(0).css("animation-delay", ".5s");
      $isAnimatedFirstFire.eq(1).css("animation-delay", ".8s");
      $isAnimatedFirstFires.addClass("animated_s fadeInUpBig2");
      $isAnimatedFirstFires.eq(0).css("animation-delay", ".5s");
      $isAnimatedFirstFires.eq(1).css("animation-delay", ".8s");
      $isAnimatedFirstSingle
        .addClass("animated rollIn")
        .css("animation-delay", "1.7s");

      // initialize fullPage
      $("#fullpage").fullpage({
        // navigation: true,
        anchors: ["typing-practice", "games", "ranking", "company"],
        scrollOverflow: false,
        lockAnchors: true,
        afterLoad(anchor) {
          switch (anchor) {
            case "typing-practice":
              self.$set(self.showGnb, 0, true);
              for (
                var i = 0;
                i > document.getElementsByClassName("gnb-bar").length;
                i++
              ) {
                document.getElementsByClassName("gnb-account")[i].remove();
                document
                  .getElementsByClassName("gnb-bar")
                  [i].append(self.liveGNB);
              }

              break;

            case "games":
              self.$set(self.showGnb, 1, true);
              for (
                var i = 0;
                i > document.getElementsByClassName("gnb-bar").length;
                i++
              ) {
                document.getElementsByClassName("gnb-account")[i].remove();
                document
                  .getElementsByClassName("gnb-bar")
                  [i].append(self.liveGNB);
              }

              break;

            case "ranking":
              self.$set(self.showGnb, 2, true);
              for (
                var i = 0;
                i > document.getElementsByClassName("gnb-bar").length;
                i++
              ) {
                document.getElementsByClassName("gnb-account")[i].remove();
                document
                  .getElementsByClassName("gnb-bar")
                  [i].append(self.liveGNB);
              }

              break;

            default:
              break;
          }
        },
        onLeave(index, nextIndex, direction) {
          self.showGnb = [false, false, false];

          // self.showGnb = false

          /**
           * use the following condition:
           *
           *   if( index == 1 && direction == 'down' ) {
           *
           * if you haven't enabled the dot navigation
           * or you aren't interested in the animations that occur
           * when you jump (using the dot navigation)
           * from the first section to another sections
           */

          // first animation
          if (index == 1 && nextIndex == 2) {
            $isAnimatedSecond.addClass("animated fadeInUpBig");
            $isAnimatedSecond.eq(0).css("animation-delay", ".3s");
            $isAnimatedSecond.eq(1).css("animation-delay", ".6s");
            $isAnimatedSecond.eq(2).css("animation-delay", ".9s");
            $isAnimatedSecondText.addClass("animated fadeIn");
            $isAnimatedSecondText.eq(0).css("animation-delay", ".5s");
            $isAnimatedSecondText.eq(1).css("animation-delay", ".8s");
            $isAnimatedSecondSingle
              .addClass("animated rollIn")
              .css("animation-delay", "1.7s");
          }

          /**
           * use the following condition:
           *
           *   else if( index == 2 && direction == 'down' ) {
           *
           * if you haven't enabled the dot navigation
           * or you aren't interested in the animations that occur
           * when you jump (using the dot navigation) from the first section to the third one
           */

          // second animation
          else if ((index == 1 || index == 2) && nextIndex == 3) {
            $isAnimatedThird.addClass("animated fadeInUpBig");
            $isAnimatedThird.eq(0).css("animation-delay", ".9s");
            $isAnimatedThird.eq(1).css("animation-delay", ".3s");
            $isAnimatedThird.eq(2).css("animation-delay", ".0s");
            $isAnimatedThird.eq(3).css("animation-delay", ".6s");
            $isAnimatedThird.eq(4).css("animation-delay", "1.2s");

            $isAnimatedThirdText.addClass("animated fadeIn");
            $isAnimatedThirdText.eq(0).css("animation-delay", "1s");
            $isAnimatedThirdText.eq(1).css("animation-delay", ".8s");
            $isAnimatedThirdSingle
              .addClass("animated rollIn")
              .css("animation-delay", "1.7s");
          }
        }
      });

      $("#clouds1")
        .animate({ "background-position-x": "-=10000" }, 500000, "linear")
        .animate({ "background-position-x": "-=10000" }, 500000, "linear");
      $("#clouds3")
        .animate({ "background-position-x": "10000" }, 1000000, "linear")
        .animate({ "background-position-x": "20000" }, 1000000, "linear");

      $("#clouds11")
        .animate({ "background-position-x": "-=10000" }, 500000, "linear")
        .animate({ "background-position-x": "-=10000" }, 500000, "linear");
      $("#clouds33")
        .animate({ "background-position-x": "10000" }, 1000000, "linear")
        .animate({ "background-position-x": "20000" }, 1000000, "linear");

      $("#clouds111")
        .animate({ "background-position-x": "-=10000" }, 500000, "linear")
        .animate({ "background-position-x": "-=10000" }, 500000, "linear");
      $("#clouds332")
        .animate({ "background-position-x": "10000" }, 1000000, "linear")
        .animate({ "background-position-x": "20000" }, 1000000, "linear");

      // function get_started() {
      $("#clouds1,#clouds2,#clouds3")
        .stop()
        .stop()
        .animate({ "margin-top": "+=50px" }, 1000);
      $("#clouds11,#clouds22,#clouds33")
        .stop()
        .stop()
        .animate({ "margin-top": "+=50px" }, 1000);
      $("#clouds111,#clouds222,#clouds333")
        .stop()
        .stop()
        .animate({ "margin-top": "+=50px" }, 1000);
      // }

      resized();
      $(window).resize(resized);

      function resized() {
        $(".clouds").css("top", $(window).height() - 240);
        $(".clouds1").css("top", $(window).height() - 60);
      }
    });
  },
  beforeDestroy() {
    if ($.fn.fullpage) {
      $.fn.fullpage.destroy("all");
    }
  }
};
</script>