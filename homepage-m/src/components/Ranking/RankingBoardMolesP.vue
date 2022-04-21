<template>
  <div class="tb_sort_wrap mt-3">
    <div class="week" v-if="!dataCheck">
      <button class="prev_week" @click="prevweek">
        <span>지난주</span>
      </button>
      <span>{{this.getDateStart(datetotalcount)}}</span>
      <button class="next_week" @click="nextWeek">
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
          <!-- <th>학교</th>-->
          <!--<th>점수</th>-->
          <!-- <th class="last">스테이지</th> -->
          <th class="last">스코어</th>
        </tr>
      </thead>
      <tbody v-if="dataCheck">
        <tr v-if="isLogin" class="myRanking">
          <td
            v-if="myRanking !== null"
            class="ta_li"
          >{{this.myRanking.rank === -1 ? '--' : this.myRanking.rank}}</td>
          <td v-else class="ta_li">--</td>
          <td v-if="myRanking !== null" class="ta_li">{{this.userName ? this.userName : '--'}}</td>
          <td v-else class="ta_li">{{this.userName ? this.userName : '--'}}</td>
          <!--<td class="ta_li">{{this.userSchool ? this.userSchool : '소속 학교 없음' }}</td>-->
          <!--<td class="ta_li">{{this.myRanking.Mine[0].score ? this.myRanking.Mine[0].score : 0}}</td>-->
          <!-- <td v-if="myRanking !== null" class="last">{{this.myRanking.rank === -1 ? '0' : this.myRanking.Stage}}</td> -->
          <td
            v-if="myRanking !== null"
            class="last"
          >{{this.myRanking.rank === -1 ? '0' : this.myRanking.gamedata}}</td>
          <td v-else class="last">0</td>
        </tr>
        <tr v-else class="myRanking">
          <td class="ta_li">--</td>
          <td class="ta_li">--</td>
          <!--<td class="ta_li">{{this.userSchool ? this.userSchool : '소속 학교 없음' }}</td>-->
          <!--<td class="ta_li">{{this.myRanking.Mine[0].score ? this.myRanking.Mine[0].score : 0}}</td>-->
          <td class="last">--</td>
        </tr>
        <tr v-for="ranking in rankingList">
          <td class="first">{{ranking.rank ? ranking.rank : '--'}}</td>
          <td class="ta_li">{{ranking.nickname ? ranking.nickname : '--'}}</td>
          <!--<td class="ta_li">{{ranking.schoolname ? ranking.schoolname : '소속 학교 없음'}}</td>-->
          <!--<td class="ta_li">{{ranking.score ? ranking.score : 0}}</td>-->
          <!--   <td class="last">{{ranking.stage ? ranking.stage : '0'}}</td> -->
          <td class="last">{{ranking.gamedata ? ranking.gamedata : '0'}}</td>
        </tr>
      </tbody>
      <tbody v-else>
        <tr v-if="isLogin" class="myRanking">
          <td
            v-if="myRanking !== null"
            class="ta_li"
          >{{this.myRanking.rank === -1 ? '--' : this.myRanking.rank}}</td>
          <td v-else class="ta_li">--</td>
          <td v-if="myRanking !== null" class="ta_li">{{this.userName ? this.userName : '--'}}</td>
          <td v-else class="ta_li">{{this.userName ? this.userName : '--'}}</td>
          <!--<td class="ta_li">{{this.userSchool ? this.userSchool : '소속 학교 없음' }}</td>-->
          <!--<td class="ta_li">{{this.myRanking.Mine[0].score ? this.myRanking.Mine[0].score : 0}}</td>-->
          <!-- <td v-if="myRanking !== null" class="last">{{this.myRanking.Stage ? this.myRanking.Stage : '0'}}</td> -->
          <td
            v-if="myRanking !== null"
            class="last"
          >{{this.myRanking.Score ? this.myRanking.Score : '0'}}</td>
          <td v-else class="last">0</td>
        </tr>
        <tr v-else class="myRanking">
          <td class="ta_li">--</td>
          <td class="ta_li">--</td>
          <td class="last">--</td>
        </tr>
        <tr v-for="ranking in rankingList">
          <td class="first">{{ranking.Rank ? ranking.Rank : '--'}}</td>
          <td class="ta_li">{{ranking.nickname ? ranking.nickname : '--'}}</td>
          <!--<td class="ta_li">{{ranking.schoolname ? ranking.schoolname : '소속 학교 없음'}}</td>-->
          <!--<td class="ta_li">{{ranking.score ? ranking.score : 0}}</td>-->
          <td class="last">{{ranking.Score ? ranking.Score : '0'}}</td>
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
export default {
  data() {
    return {
      show: false,
      totalCount: 0,
      posts: [],
      hasLoaded: false,
      myRanking: [],
      rankingList: [],
      thisWeek: null,
      preWeek: null,
      days: 0,
      predays: 7,
      datetotalcount: 1,
      gameCode: "MOLE_RANKING",
      userName: "",
      userSchool: "",
      dataCheck: true,
      rankingsText: "누적랭킹보기",
      savedMyRanking: [],
      isLogin: this.$root.isLoggedIn(),

      rankingAmount: 0,
      redisTotalCount: 0,
      startRanking: 0,
      endRank: 0,
      state: false,

      school_redisTotalCount: 0,
      school_startRanking: 0,
      school_endRank: 0,
      school_state: false
    };
  },

  computed: {
    page() {
      return this.$route.query.page || 1;
    },
    startRank() {
      return this.startRanking;
    },
    school_startRank() {
      return this.school_startRanking;
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
          { menu_type: 9, Authorization: "Bearer" + this.$root.sessionId() },
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
    fetchLiveRankings() {
      this.startRanking = this.$store.state.start_Rank;
      var _lastRank = this.$store.state.last_Rank;
      this.endRank = this.startRanking + 9;
      this.$EventBus.$emit("loading-add", "fetch-rankings");
      // console.log("this.gameCode  :::: " + this.gameCode);
      // console.log("this.startRank  :::: " + this.startRank);
      // console.log("this.endRank  :::: " + this.endRank);
      // console.log("this.last_rank  :::: " + this._lastRank);
      this.$axios
        .post(this.$Api2.ranking.getrankingPersonal, {
          gamecode: this.gameCode,
          start: this.startRank,
          end: this.endRank,
          sessionid: this.$root.sessionId(),
          last_rank: this.startRanking
        })
        .then(response => {
          this.$EventBus.$emit("loading-remove", "fetch-rankings");
          this.rankingList = [];
          this.myRanking = {};
          console.log(this.myRanking);
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
            this.totalCount = 0;

            alert("랭킹 정보가 없습니다.");
            return;
          }
          this.rankings = response.data;
          console.log(response.data);
          this.myRanking = response.data[response.data.length - 1].Mine[0];
          console.log("myRanking", this.myRanking);

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
          console.log(this.rankings[response.data.length - 1].rank);

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
      this.$EventBus.$emit("loading-add", "fetch-rankings");
      this.$axios
        .post(this.$Api2.ranking.getrankingSchool2, {
          week: this.datetotalcount,
          gamecode: 10002,
          sessionid: this.$root.sessionId()
        })
        .then(response => {
          this.$EventBus.$emit("loading-remove", "fetch-rankings");
          console.log(this.$Api2.ranking.getrankingSchool2);
          console.log(this.$root.sessionId());
          console.log(this.datetotalcount);
          this.myRanking = {};
          this.rankingList = [];
          if (!response) {
            return;
          }

          if (response.data.result === 9151 || response.data.result === 9155) {
            this.totalCount = 0;
            this.myRanking = null;
            console.log(this.myRanking);
            alert("랭킹 정보가 없습니다.");
            return;
          }
          console.log(response.data);
          for (var i = 0; i < response.data.length; i++) {
            if (response.data[i].nickname != null) {
              this.rankingList.push(response.data[i]);
            } else if (response.data[i].totalcount != null) {
              this.totalCount = response.data[i].totalcount;
            }
            if (response.data[i].nickname === this.userName) {
              this.myRanking =
                response.data[response.data.length - 1].MyRank[0];
              console.log("if", this.myRanking);
            } else {
              this.myRanking = null;
              console.log("else", this.myRanking);
            }
          }
          console.log(this.myRanking);
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

    prevweek() {
      this.datetotalcount += 1;
      this.fetchSavedRankings();
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
    block() {
      alert("서비스 준비중 입니다.");
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
        alert("게임 기록이 없습니다.");
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
        alert("게임 기록이 없습니다.");
        return;
      }
      Kakao.Link.sendDefault({
        objectType: "feed",
        content: {
          title: "두더지잡기",
          description:
            this.userName +
            "님이 " +
            this.myRanking.gamedata +
            "하이 스코어 점수로 " +
            this.myRanking.rank +
            "위를 달성했습니다.",
          imageUrl:
            "https://cdn.malangmalang.com/typing/images/AllTempleteImg.png",
          link: {
            mobileWebUrl: "https://typing-m.malangmalang.com/ranking/moles",
            webUrl: "https://typing-m.malangmalang.com/ranking/moles"
          }
        },
        social: {},
        buttons: [
          {
            title: "웹으로 보기",
            link: {
              mobileWebUrl: "https://typing-m.malangmalang.com/ranking/moles",
              webUrl: "https://typing-m.malangmalang.com/ranking/moles"
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
