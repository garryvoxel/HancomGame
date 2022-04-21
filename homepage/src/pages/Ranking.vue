<template>
  <div id="ranking">
    <site-header />

    <!-- 본문영역 -->
    <section id="container" class="sub03">
      <div class="content-wrapper">
        <div class="contentService3" style="margin-bottom: 36px;">
          <!-- 타이틀 -->
          <h4 class="page_tit">
            {{ items[menuKey].name }}
            <span v-if="$store.state.ranking_noticeShow">오늘의 랭킹</span>
          </h4>
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
              <li>{{ items[menuKey].name }}</li>
            </ol>
          </div>
        </div>
        <div v-if="$store.state.ranking_noticeShow" class="ranking-info">
          <h5>
            <i class="fa fa-trophy"></i> 오늘의 랭킹이란?
          </h5>
          <ul>
            <li>오늘의 랭킹이란, 하루 기준으로 랭킹 정보가 등재되며,익일 00:00시 자정을 기준으로 랭킹 정보가 초기화 됩니다.</li>
            <li>랭킹 초기화 후 게임을 플레이하면 랭킹 정보가 생성됩니다.</li>
          </ul>
          <!-- <p>
            <i class="fa fa-exclamation-circle"></i> 로그인 후 ⟩ 내 타자정보 ⟩ '대학교' 학교 정보 등록 이벤트에 참여할 수 있습니다. 학교 정보 등록은 최초 1회만 가능합니다.
          </p>-->
        </div>
        <ranking-typing-practice v-if="isRankingOfTypingPractice" />
        <ranking-catching-moles v-else-if="isRankingOfCatchingMoles" />
        <ranking-piling-coins v-else-if="isRankingOfPilingCoins" />
        <ranking-flipping-cards v-else-if="isRankingOfFlippingCards" />
      </div>
    </section>

    <site-footer />
  </div>
</template>

<script>
import RankingTypingPractice from "../components/Ranking/RankingTypingPractice.vue";
import RankingCatchingMoles from "../components/Ranking/RankingCatchingMoles.vue";
import RankingPilingCoins from "../components/Ranking/RankingPilingCoins.vue";
import RankingFlippingCards from "../components/Ranking/RankingFlippingCards.vue";

export default {
  name: "rankings",

  components: {
    "ranking-typing-practice": RankingTypingPractice,
    "ranking-catching-moles": RankingCatchingMoles,
    "ranking-piling-coins": RankingPilingCoins,
    "ranking-flipping-cards": RankingFlippingCards
  },

  props: ["menus"],

  data() {
    return {
      menu: this.$root.menu[this.$options.name],
      items: this.$root.menu[this.$options.name].children
    };
  },

  computed: {
    menuKey() {
      return this.$route.name.replace(/ranking[-]|[-]personal|[-]school/g, "");
    },

    isRankingOfTypingPractice() {
      return /^[/]?rankings[/]typing-practice[/]?.*$/.test(this.$route.path);
    },

    isRankingOfCatchingMoles() {
      return /^[/]?rankings[/]catching-moles[/]?.*$/.test(this.$route.path);
    },

    isRankingOfPilingCoins() {
      return /^[/]?rankings[/]piling-coins[/]?.*$/.test(this.$route.path);
    },

    isRankingOfFlippingCards() {
      return /^[/]?rankings[/]flipping-cards[/]?.*$/.test(this.$route.path);
    }
  },

  created() {
    // console.log(this.$WebConfig.kakaoAuthKey.key)
    if (Kakao.init(this.$WebConfig.kakaoAuthKey.key)) {
      console.log("Kakao Initialized!!");
    } else {
      Kakao.init(this.$WebConfig.kakaoAuthKey.key);
    }
  },

  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.$root.registerNicknameIfNotExist();
    });
  }
};
</script>

<style>
.todayRankingOn {
  margin-top: 2px;
  margin-left: 4px;
  font-size: 28px;
  text-align: left;
  font-family: Nanum Gothic;
  flex: auto;
  color: black;
}

.todayRankingOff {
  margin-top: 2px;
  margin-left: 4px;
  font-size: 28px;
  text-align: left;
  font-family: Nanum Gothic;
  flex: auto;
  color: white;
}
</style>
<style scoped>
.ranking-info {
  padding: 20px;
  border: 1px solid #e8e8e8;
  background-color: #fff;
  font-size: 14px;
  line-height: 1.3;
  color: #222;
}
.ranking-info h5 {
  position: relative;
  display: table;
  margin: 0 0 0.6em 0;
  font-size: 1.2em;
  font-weight: 700;
  padding-left: 1.5em;
}
.ranking-info h5 .fa {
  position: absolute;
  left: 0;
  top: 0.2em;
}
.ranking-info h5:after {
  content: "";
  border-bottom: 5px solid rgba(255, 159, 0, 0.5);
  display: block;
  margin-top: -5px;
}
.ranking-info ul {
  list-style: none;
  margin: 0 0 0 0.5em;
  padding: 0;
}
.ranking-info li {
  position: relative;
  margin: 0;
  padding-left: 0.7em;
}
.ranking-info li:before {
  content: "-";
  position: absolute;
  left: 0;
}
.ranking-info li + li {
  margin-top: 0.4em;
}
.ranking-info p {
  margin: 1em 0 0 0.5em;
  color: #f75259;
}
</style>
