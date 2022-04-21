<template>
  <div class="page-container">
    <div class="page-wrapper page-game gamecoin">
      <Header/>
      <SideMenu />
      <section class="main-content">
        <header class="page-header">
          <h1 class="page-title">동전쌓기</h1>
        </header>
        <div class="sub-wrap">
          <button class="btn-m1 bg-fl fc-wh" @click="launch">
            <span class="pull-left">게임시작</span>
            <i class="ti-angle-right pull-right"></i>
          </button>
          <img src="/imgs/main_cd01.png" alt />
        </div>
      </section>
      <Footer />
    <modal
      id="modal-select-channel"
      title="동전쌓기 서버 선택"
      v-if="showModalSelectChannel"
      @close="showModalSelectChannel = false"
    ></modal>
    </div>
  </div>
</template>

<script>
import Header from '@/components/Header.vue'
import SideMenu from "@/components/SideMenu.vue";
import Footer from "@/components/Footer.vue";
import Result from "@/utils/result";

export default {
  data() {
    return {
      showModalSelectChannel: false
    };
  },

  components: {
    Header,
    SideMenu,
    Footer
  },

  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.$root.registerNicknameIfNotExist();
    });
  },

  methods: {
    adLogs() {
      this.$axios
        .put(
          this.$Api.adLogs,
          {
            check_type: 1,
            id: 803607,
            advertis_type: 3,
            Authorization: "Bearer" + this.$root.sessionId()
          },
          this.$root.bearerHeaders()
        )
        .then(response => {
          console.log(response.data);
          this.ad_state = false;
          if (!response || response.data.code != 1) {
            return;
          }
        })
        .catch(error => {
          console.error(error);
        });
    },
    launch() {
      if (!this.$root.isLoggedIn()) {
        if (
          !confirm(
            "게스트는 전적, 포인트 등이 기록되지 않습니다.\n로그인 하시겠습니까?"
          )
        ) {
          this.showModalSelectChannel = true;
          return;
        }
        this.$root.redirectToLoginUrl();
        return;
      } else {
        this.showModalSelectChannel = true;
      }
    },

    adStart(top, left, adValue) {
      var ad = new SignalAD();

      ad.setting(
        {
          ssl: true,
          adTarget: adValue,
          adDepth: "999999",
          publisherCD: "1483",
          mediaCD: "31656",
          sectionCD: "803607",
          linkTarget: "1"
        },
        {
          done: function(status, msg) {
            console.log("[event] done : " + status + " msg :" + msg);
          },
          fail: function(status, msg) {
            console.log("[event] fail : " + status + " msg : " + msg);
          },
          adclick: function(status, msg) {
            console.log(
              "[event] adclick : ( status " + status + " msg : " + msg + " )"
            );
          },
          etc: function(status, msg) {
            console.log("[event] fail - status : " + status + " msg : " + msg);
          },
          noad: function(status, msg) {
            console.log("[event] noad - status : " + status + " msg : " + msg);
          },
          close: function(status, msg) {
            console.log("[event] close - status : " + status + " msg : " + msg);
          },
          chargeable: function(status, msg) {
            console.log(
              "[event] at type - status : " + status + " msg : " + msg
            );
          }
        }
      );

      // 4)
      ad.start();
      var elem = document.getElementById("mz_article");
      var elemImg = document.getElementById("mz_first");
      console.log(elem.style.width);
      elem.style.width = "100%";
      elem.style.height = "50px";

      elemImg.style.width = "100%";
      elemImg.style.height = "50px";
    }
  },

  mounted: function() {
    this.$nextTick(() => {
      if (this.$route.query.autorun === "true") {
        this.launch();
      }
    });
    // this.adStart('0px', '0px', 'banner_test');
  },
  created() {}
};
</script>