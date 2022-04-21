<template>
  <div class="tb_sort_wrap mt-3">
    <div class="week" v-if="!dataCheck">
      <button @click="prevWeek" class="prev_week">
        <span>지난주</span>
      </button>
      <span>{{getDateStart(datetotalcount)}}</span>
      <button @click="nextWeek" class="next_week">
        <span>다음주</span>
      </button>
    </div>
    <div class="tbs_sns mt-3">
      <!-- <button class="rankingBtn" @click="changeData">{{rankingsText}}</button> -->
      <a v-if="dataCheck" class="facebook" style="color : #fff" @click="shareFaceBook">공유하기</a>
      <a v-if="dataCheck" class="kakao" style="color : #fff" @click="shareKakao">공유하기</a>
    </div>

    <table class="tbs02 mt-2" style="width:100%;">
      <thead>
        <tr>
          <th class="first">순위</th>
          <th>별명</th>
          <!--<th>학교</th>-->
          <th>승</th>
          <th class="last">패</th>
          <th class="last">무</th>
        </tr>
      </thead>

      <tbody v-if="dataCheck">
        <tr v-if="isLogin" class="myRanking">
          <!--  <td class="ta_li">{{this.myRanking.rank ? this.myRanking.rank : '--'}}</td> -->
          <td
            v-if="myRanking !==null"
            class="ta_li"
          >{{this.myRanking.rank === -1 ? '--' : this.myRanking.rank}}</td>
          <td v-else class="ta_li">--</td>
          <td v-if="myRanking !==null" class="ta_li">{{this.userName ? this.userName : '--'}}</td>
          <td v-else class="ta_li">{{this.userName ? this.userName : '--'}}</td>
          <!--<td class="ta_li">{{this.userSchool ? this.userSchool : '소속 학교 없음' }}</td>-->
          <td
            v-if="myRanking !==null"
            class="ta_li"
          >{{this.myRanking.WIN ? this.myRanking.WIN : '0'}}</td>
          <td v-else class="ta_li">0</td>
          <td
            v-if="myRanking !==null"
            class="ta_li"
          >{{this.myRanking.Lose ? this.myRanking.Lose : '0'}}</td>
          <td v-else class="ta_li">0</td>
          <td
            v-if="myRanking !==null"
            class="last"
          >{{this.myRanking.Draw ? this.myRanking.Draw : '0'}}</td>
          <td v-else class="last">0</td>
        </tr>
        <tr v-else class="myRanking">
          <td>--</td>
          <td>--</td>
          <td>--</td>
          <td>--</td>
          <!--<td class="ta_li">{{this.userSchool ? this.userSchool : '소속 학교 없음' }}</td>-->
          <td>--</td>
        </tr>
        <tr v-for="ranking in rankingList">
          <td class="first">{{ranking.rank ? ranking.rank : '--'}}</td>
          <td class="ta_li">{{ranking.nickname ? ranking.nickname : '--'}}</td>
          <!--<td class="ta_li">{{ranking.schoolname ? ranking.schoolname : '소속 학교 없음'}}</td>-->
          <td class="ta_li">{{ranking.WIN ? ranking.WIN : '0'}}</td>
          <td class="ta_li">{{ranking.Lose ? ranking.Lose : '0'}}</td>
          <td class="last">{{ranking.Draw ? ranking.Draw : '0'}}</td>
        </tr>
      </tbody>
      <tbody v-else>
        <tr v-if="isLogin" class="myRanking">
          <!--  <td class="ta_li">{{this.myRanking.rank ? this.myRanking.rank : '--'}}</td> -->
          <td
            v-if="myRanking !==null"
            class="ta_li"
          >{{this.myRanking.rank === -1 ? '--' : this.myRanking.rank}}</td>
          <td v-else class="ta_li">--</td>
          <td v-if="myRanking !==null" class="ta_li">{{this.userName ? this.userName : '--'}}</td>
          <td v-else class="ta_li">{{this.userName ? this.userName : '--'}}</td>
          <!--<td class="ta_li">{{this.userSchool ? this.userSchool : '소속 학교 없음' }}</td>-->
          <td
            v-if="myRanking !==null"
            class="ta_li"
          >{{this.myRanking.WIN ? this.myRanking.WIN : '0'}}</td>
          <td v-else class="ta_li">0</td>
          <td
            v-if="myRanking !==null"
            class="ta_li"
          >{{this.myRanking.Lose ? this.myRanking.Lose : '0'}}</td>
          <td v-else class="ta_li">0</td>
          <td
            v-if="myRanking !==null"
            class="last"
          >{{this.myRanking.Draw ? this.myRanking.Draw : '0'}}</td>
          <td v-else class="last">0</td>
        </tr>
        <tr v-else class="myRanking">
          <td>--</td>
          <td>--</td>
          <td>--</td>
          <td>--</td>
          <!--<td class="ta_li">{{this.userSchool ? this.userSchool : '소속 학교 없음' }}</td>-->
          <td>--</td>
        </tr>
        <tr v-for="ranking in rankingList">
          <td class="first">{{ranking.Rank ? ranking.Rank : '--'}}</td>
          <td class="ta_li">{{ranking.nickname ? ranking.nickname : '--'}}</td>
          <!--<td class="ta_li">{{ranking.schoolname ? ranking.schoolname : '소속 학교 없음'}}</td>-->
          <td class="ta_li">{{ranking.Win ? ranking.Win : '0'}}</td>
          <td class="ta_li">{{ranking.Lose ? ranking.Lose : '0'}}</td>
          <td class="last">{{ranking.Draw ? ranking.Draw : '0'}}</td>
        </tr>
      </tbody>
    </table>
    <ul class="ranking-null" v-if="rankingList.length === 0">
      <li style="margin-top : 15px">랭킹 정보가 없습니다.</li>
    </ul>
    <rankingpagination
      v-if="dataCheck"
      :current="page"
      :redis_total_count="redisTotalCount"
      :totalCount="totalCount"
      :startRank="startRanking"
    />
    <pagination v-else :current="page" :totalCount="totalCount" />
  </div>
</template>

<script>
import Result from "@/utils/result";
import moment from "moment";
export default {
  data() {
    return {
      savetotalCount: 0,
      rankings: [],
      myRanking: {},
      rankingList: [],
      days: 0,
      predays: 7,
      datetotalcount: 1,
      gameCode: "SETCOIN_RANKING",
      userName: "",
      userSchool: "",
      savedRankings: [],
      dataCheck: true,
      rankingsText: "누적랭킹보기",
      savedMyRanking: [],
      isLogin: this.$root.isLoggedIn(),
      totalCount: 0,
      rankingAmount: 0,
      redisTotalCount: 0,
      startRanking: 0,
      endRank: 0,
      state: false,
      _lastRank: 0
    };
  },

  computed: {
    page() {
      return this.$route.query.page || 1;
    },
    startRank() {
      return this.startRanking;
    }
  },
  watch: {
    $route() {
      if (this.dataCheck === true) this.fetchLiveRankings();
      else {
        this.fetchSavedRankings();
      }
      this.dataCheck;
    }
  },
  methods: {
    Log() {
      this.$axios
        .put(
          this.$Api.logs,
          { menu_type: 10, Authorization: "Bearer" + this.$root.sessionId() },
          this.$root.bearerHeaders()
        )
        .then(response => {
          console.log(response.data);
          if (!response || response.data.code != 1) {
            return;
          }
        })
        .catch(error => {
          console.error(error);
        });
    },
    block() {
      alert("서비스 준비중 입니다");
      return;
    },
    fetchLiveRankings() {
      console.log(this.dataCheck);
      this._lastRank = 0;
      this.startRanking = this.$store.state.start_Rank;
      this._lastRank = this.$store.state.last_Rank;
      console.log;
      this.endRank = this.startRanking + 9;
      this.$EventBus.$emit("loading-add", "fetch-rankings");
      this.$axios
        .post(this.$Api2.ranking.getrankingPersonal, {
          gamecode: this.gameCode,
          start: this.startRank,
          end: this.endRank,
          sessionid: this.$root.sessionId(),
          last_rank: this._lastRank
        })
        .then(response => {
          this.$EventBus.$emit("loading-remove", "fetch-rankings");
          this.rankingList = [];
          this.myRanking = {};
          if (!response) {
            return;
          }
          if (
            response.data.length <= 1 ||
            response.data.length === 0 ||
            response.data.result === 9151 ||
            response.data.result === 9155 ||
            response.data.result === 9152 ||
            response.data.result === 9153
          ) {
            this.myRanking = null;
            this.totalCount = 0;
            alert("랭킹 정보가 없습니다.");
            return;
          }
          this.rankings = response.data;
          console.log(response.data);
          this.myRanking = response.data[response.data.length - 1].Mine[0];

          this.totalCount =
            response.data[response.data.length - 2]["totalcount"];
          this.redisTotalCount =
            response.data[response.data.length - 2]["redis_total_count"];

          this.rankings.splice(response.data.length - 2, 2);

          this.$store.commit("first_user_Rank", this.rankings[0].rank);
          this.$store.commit(
            "user_Rank",
            this.rankings[response.data.length - 1].rank
          );
          console.log(this.myRanking);
          console.log("gamedata", this.myRanking.gamedata);

          for (var i = 0; i < this.rankings.length; i++) {
            this.rankingList.push(this.rankings[i]);
          }
        })
        .catch(error => {
          console.log(error);
          this.$EventBus.$emit("loading-remove", "fetch-rankings");
        });
    },
    fetchSavedRankings() {
      console.log(this.dataCheck);
      this.$store.commit("first_user_Rank", 0);
      this.$store.commit("user_Rank", 0);
      this.$store.commit("start_Rank", 0);
      this.$EventBus.$emit("loading-add", "fetch-rankings");
      this.$axios
        .post(this.$Api2.ranking.getrankingSchool2, {
          week: this.datetotalcount,
          gamecode: 10000,
          sessionid: this.$root.sessionId()
        })
        .then(response => {
          this.$EventBus.$emit("loading-remove", "fetch-rankings");
          this.rankingList = [];
          this.myRanking = {};
          if (!response) {
            return;
          }
          if (response.data.result === 9151 || response.data.result === 9155) {
            this.myRanking = null;
            this.totalCount = 0;
            alert("랭킹 정보가 없습니다.");
            return;
          }

          for (var i = 0; i < response.data.length; i++) {
            if (response.data[i].nickname != null) {
              this.rankingList.push(response.data[i]);
            } else if (response.data[i].totalcount != null) {
              this.totalCount = response.data[i].totalcount;
            }
            if (this.userName === response.data[i].nickname) {
              this.myRanking =
                response.data[response.data.length - 1].MyRank[0];
            } else {
              this.myRanking = null;
            }
          }

          console.log(this.myRanking);
          console.log("gamedata", this.myRanking.gamedata);
        })
        .catch(error => {
          console.log(error);
          this.$EventBus.$emit("loading-remove", "fetch-rankings");
        });
    },
    fetchUser() {
      this.$axios
        .get(this.$Api.me, this.$root.bearerHeaders())
        .then(response => {
          console.log(response.data);

          if (!response || response.data.code !== Result.OK.code) {
            return;
          }

          this.userInfo = response.data;
          this.userName = this.userInfo.user.nickname;
          this.userSchool = this.userInfo.user.mySchool.school.name;
          console.log(this.userName);
        })
        .catch(error => {
          console.log(error);
        });
    },

    prevWeek() {
      /*
        this.thisWeek = moment().subtract(this.days + 7,'days').format("YYYY-MM-DD");
        this.preWeek = moment().subtract(this.predays + 7,'days').format("YYYY-MM-DD");
        this.days += 7;
        this.predays += 7;
        */
      this.datetotalcount += 1;
      this.fetchSavedRankings();
      console.log(this.datetotalcount);
    },
    nextWeek() {
      /*
        this.thisWeek = moment().add(this.days + 7,'days').format("YYYY-MM-DD");
        this.preWeek = moment().add(this.predays + 7,'days').format("YYYY-MM-DD");
        this.days += 7;
        this.predays += 7;
       */
      if (this.datetotalcount > 1) {
        this.datetotalcount -= 1;
        this.fetchSavedRankings();
        console.log(this.datetotalcount);
      } else if (this.datetotalcount === 1) {
        alert("랭킹 정보가 없습니다.");
        return;
      }
    },
    getMonday(d) {
      d = new Date(d);
      var day = d.getDay(),
        diff = d.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
      return new Date(d.setDate(diff));
    },

    //쿼리로 날짜 조건을 얻기위해 ios 출력합니다. 셀렉트 시작날짜
    getDateStart(num) {
      var today = new Date();
      var startDay = new Date();
      //데이트  들어오는 num값은 지금부터 몇쨰주 뒤이냐는 뜻
      if (num > 0) {
        for (var i = 0; i < num; i++) {
          today = this.getMonday(today); //오늘날짜 기준의 월요일 날짜를 뽑는다.
          today.setDate(today.getDate() - 4); //해당 월요일에서 4일을 뺀다.
        }
        //최종값에서 마지막 월요일을 뽑습니다.
        today = this.getMonday(today);
        startDay = today;
        var str_today = startDay.toISOString();
        var arr_date = str_today.split("T");
        console.log("검색할 게임데이터 첫째날 --" + arr_date[0]);
        return arr_date[0];
      }
    },
    shareFaceBook: function() {
      if (!this.$root.isLoggedIn()) {
        if (!confirm("로그인이 필요합니다.\n로그인 하시겠습니까?")) {
          return;
        }
        this.$root.redirectToLoginUrl();
        return;
      }
      if (parseInt(this.myRanking.gamedata) === 0 || !this.myRanking.gamedata) {
        alert("랭킹 정보가 없습니다..");
        return;
      }
      var site = window.location.host;
      var snsURL = "";
      console.log("site = " + site);
      if (site.indexOf("localhost") != -1) {
        snsURL = encodeURIComponent("https://dev-typing.malangmalang.com"); //local
      } else if (site.indexOf("dev-") != -1) {
        snsURL = encodeURIComponent("https://dev-typing.malangmalang.com"); //dev
      } else if (site.indexOf("stg-") != -1) {
        snsURL = encodeURIComponent("https://stg-typing.malangmalang.com"); //stg
      } else {
        snsURL = encodeURIComponent("https://typing.malangmalang.com"); //live
      }
      window.open(
        "http://www.facebook.com/sharer/sharer.php?u=" + snsURL,
        "_blank"
      );
    },

    shareKakao: function() {
      if (!this.$root.isLoggedIn()) {
        if (!confirm("로그인이 필요합니다.\n로그인 하시겠습니까?")) {
          return;
        }
        this.$root.redirectToLoginUrl();
        return;
      }

      if (parseInt(this.myRanking.gamedata) === 0 || !this.myRanking.gamedata) {
        alert("랭킹 정보가 없습니다..");
        return;
      }
      Kakao.Link.sendDefault({
        objectType: "feed",
        content: {
          title: "동전쌓기",
          description:
            this.userName +
            "님이 " +
            this.myRanking.WIN +
            "승으로 " +
            this.myRanking.rank +
            "위를 달성했습니다.",
          imageUrl:
            "https://cdn.malangmalang.com/typing/images/AllTempleteImg.png",
          link: {
            mobileWebUrl: "https://typing-m.malangmalang.com/ranking/coin",
            webUrl: "https://typing-m.malangmalang.com/ranking/coin"
          }
        },
        social: {},
        buttons: [
          {
            title: "웹으로 보기",
            link: {
              mobileWebUrl: "https://typing-m.malangmalang.com/ranking/coin",
              webUrl: "https://typing-m.malangmalang.com/ranking/coin"
            }
          }
        ]
      });
    },
    changeData() {
      this.dataCheck = !this.dataCheck;
      if (this.dataCheck === true) {
        this.fetchLiveRankings();

        this.rankingsText = "누적랭킹보기";
      } else {
        this.fetchSavedRankings();
        this.rankingsText = "실시간랭킹보기";
      }
    }
  },
  destroyed() {
    this.$store.commit("first_user_Rank", 0);
    this.$store.commit("user_Rank", 0);
    this.$store.commit("start_Rank", 0);
  },
  created() {
    this.$router.push({ query: { page: 1 } });
    console.log("ss");
    this._lastRank = 0;
    this.$store.commit("first_user_Rank", 0);
    this.$store.commit("user_Rank", 0);
    this.$store.commit("start_Rank", 0);
    this.dataCheck = true;
    this.$router.push({ query: { page: 1 } });
    this.startRanking = (this.$route.query.page || 1) - 1;
    this.fetchLiveRankings();
    this.fetchUser();
    this.Log();
  }
};
</script>

