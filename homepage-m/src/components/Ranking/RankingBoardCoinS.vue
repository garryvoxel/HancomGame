<template>
  <div class="tb_sort_wrap mt-3">
    <div class="week" v-if="!dataCheck">
      <button @click="prevWeek" class="prev_week">
        <span>지난달</span>
      </button>
      <span>{{this.thismonth}}</span>
      <button @click="nextWeek" class="next_week">
        <span>다음달</span>
      </button>
    </div>
    <div class="tbs_sns mt-3">
      <!-- <button class="rankingBtn" @click="changeData">{{rankingsText}}</button> -->
      <a v-if="dataCheck" class="facebook" style="color : #fff" @click="shareFaceBook">공유하기</a>
      <a v-if="dataCheck" class="kakao" style="color : #fff" @click="shareKakao">공유하기</a>
    </div>
    <table class="tbs02 mt-2" style="width:100%;">
      <colgroup>
        <col width="*" />
        <col width="*" />
        <col width="*" />
        <col width="*" />
        <col width="*" />
      </colgroup>
      <thead>
        <tr>
          <th class="first">순위</th>
          <th>학교</th>
          <th class="last">총점</th>
        </tr>
      </thead>
      <tbody v-if="dataCheck">
        <tr v-if="isLogin" class="myRanking">
          <td class="first">{{this.myLiveSchool.rank ? this.myLiveSchool.rank : '--'}}</td>
          <td class="ta_li">{{this.userSchool ? this.userSchool : "--"}}</td>
          <td class="last">{{this.myLiveSchool.gamedata ? this.myLiveSchool.gamedata : '0'}}</td>
        </tr>
        <tr v-else class="myRanking">
          <td class="first">--</td>
          <td class="ta_li">--</td>
          <td class="last">--</td>
        </tr>
        <tr v-for="liveRanking in liveRankings">
          <td class="first">{{liveRanking.rank ? liveRanking.rank : '--'}}</td>
          <td class="ta_li">{{liveRanking.schoolname ? liveRanking.schoolname : '--'}}</td>
          <td class="last">{{liveRanking.gamedata ? liveRanking.gamedata : '0'}}</td>
        </tr>
      </tbody>
      <tbody v-else>
        <tr v-if="isLogin" class="myRanking">
          <td class="first">{{this.myLiveSchool.Rank ? this.myLiveSchool.Rank : "--"}}</td>
          <td class="ta_li">{{this.userSchool ? this.userSchool : "--"}}</td>
          <td class="last">{{this.myLiveSchool.Score ? this.myLiveSchool.Score : '0'}}</td>
        </tr>
        <tr v-else class="myRanking">
          <td class="first">--</td>
          <td class="ta_li">--</td>
          <td class="last">--</td>
        </tr>
        <tr v-for="savaranking in liveRankings">
          <td class="first">{{savaranking.Rank ? savaranking.Rank : '--'}}</td>
          <td class="ta_li">{{savaranking.SchoolName ? savaranking.SchoolName : '--'}}</td>
          <td class="last">{{savaranking.Score ? savaranking.Score : '0'}}</td>
        </tr>
      </tbody>
    </table>

    <ul class="ranking-null" v-if="liveRankings.length === 0">
      <li style="margin-top : 15px">랭킹 정보가 없습니다.</li>
    </ul>
    <rankingpagination
      v-if="dataCheck"
      :current="page"
      :redis_total_count="school_redisTotalCount"
      :totalCount="totalCount"
      :startRank="school_startRanking"
    />
    <pagination v-else :current="page" :totalCount="totalCount" />
  </div>
</template>

<script>
import Result from "@/utils/result";
import { create } from "domain";
import moment from "moment";
export default {
  data() {
    return {
      rankings: [],
      totalCount: 0,
      gamecode: 10000,
      datetotalcount: 0,
      savedRankings: [],
      liveRankings: [],
      dataCheck: true,
      rankingsText: "누적랭킹보기",
      userSchool: "",
      myLiveSchool: {},
      mySaveSchool: {},
      schoolrank: "",
      thismonth: moment().format("YYYY-MM"),
      selectDate: new Date(),
      isLogin: this.$root.isLoggedIn(),

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
    school_startRank() {
      return this.school_startRanking;
    }
  },

  watch: {
    $route() {
      if (this.dataCheck === true) this.fetchSchoolsLiveRankings();
      else {
        this.fetchSchoolsSaveRankings();
      }
      this.dataCheck;
    }
  },
  methods: {
    prevWeek() {
      /*
        this.thisWeek = moment().subtract(this.days + 7,'days').format("YYYY-MM-DD");
        this.preWeek = moment().subtract(this.predays + 7,'days').format("YYYY-MM-DD");
        this.days += 7;
        this.predays += 7;
        */

      this.datetotalcount += 1;
      this.fetchSchoolsSaveRankings();
      this.thismonth = moment(this.thismonth)
        .subtract(1, "month")
        .format("YYYY-MM");
    },
    nextWeek() {
      /*
        this.thisWeek = moment().add(this.days + 7,'days').format("YYYY-MM-DD");
        this.preWeek = moment().add(this.predays + 7,'days').format("YYYY-MM-DD");
        this.days += 7;
        this.predays += 7;
       */

      if (this.datetotalcount > 0) {
        this.nowmonth = 1;
        this.datetotalcount -= 1;
        this.fetchSchoolsSaveRankings();
        this.thismonth = moment(this.thismonth)
          .add(1, "month")
          .format("YYYY-MM");
      } else {
        alert("랭킹 정보가 없습니다.");
        return;
      }
    },

    changeData() {
      this.dataCheck = !this.dataCheck;
      if (this.dataCheck === true) {
        this.fetchSchoolsLiveRankings();
        this.rankingsText = "누적랭킹보기";
      } else {
        this.$store.commit("school_first_user_Rank", 0);
        this.$store.commit("school_user_Rank", 0);
        this.$store.commit("school_start_Rank", 0);
        this.fetchSchoolsSaveRankings();
        this.rankingsText = "실시간랭킹보기";
      }
    },

    fetchSchoolsSaveRankings() {
      this.$axios
        .post(this.$Api2.ranking.getrankingSchoolSaved, {
          month: this.datetotalcount,
          gamecode: 10000
        })
        .then(response => {
          this.myLiveSchool = {};
          this.liveRankings = [];
          console.log(response.data);
          if (response.data.length <= 1) {
            alert("랭킹 정보가 없습니다.");
            return;
          }

          if (response.data.result === 9151 || response.data.result === 9155) {
            this.totalCount = 0;
            alert("랭킹 정보가 없습니다.");
            return;
          }
          for (var i = 0; i < response.data.length; i++) {
            if (response.data[i].SchoolName != null) {
              this.liveRankings.push(response.data[i]);
            } else if (response.data[i].totalcount != null) {
              this.totalCount = response.data[i].totalcount;
            }
          }

          for (var i = 0; i < response.data.length; i++) {
            if (response.data[i].SchoolName === this.userSchool) {
              this.myLiveSchool = response.data[i];
              this.schoolrank = response.data[i].Rank;
            } else {
              this.myLiveSchool = null;
              this.schoolrank = null;
            }
          }
        });
    },
    fetchSchoolsLiveRankings() {
      this.school_startRanking = this.$store.state.school_start_Rank;
      this.school_endRank = this.school_startRanking + 9;
      var _lastRank = this.$store.state.school_last_Rank;
      this.$axios
        .post(this.$Api2.ranking.getrankingSchoolLive, {
          gamecode: "SETCOIN_SCHOOL_RANKING",
          start: this.school_startRank,
          end: this.school_endRank,
          sessionid: this.$root.sessionId(),
          last_rank: _lastRank
        })
        .then(response => {
          this.liveRankings = [];
          this.myLiveSchool = {};

          if (
            response.data.length === 0 ||
            response.data.result === 9151 ||
            response.data.result === 9155 ||
            response.data.result === 9152 ||
            response.data.result === 9153 ||
            response.data.length <= 1
          ) {
            this.totalCount = 0;
            alert("랭킹 정보가 없습니다.");
            return;
          }
          this.rankings = response.data;
          this.myRanking = response.data[response.data.length - 1].Mine[0];

          this.totalCount =
            response.data[response.data.length - 2]["totalcount"];
          this.school_redisTotalCount =
            response.data[response.data.length - 2]["redis_total_count"];

          this.rankings.splice(response.data.length - 2, 2);

          this.$store.commit("school_first_user_Rank", this.rankings[0].rank);
          this.$store.commit(
            "school_user_Rank",
            this.rankings[response.data.length - 1].rank
          );

          console.log(response.data[response.data.length - 1]);
          for (var i = 0; i < this.rankings.length; i++) {
            this.liveRankings.push(this.rankings[i]);
          }
        });
    },

    shareFaceBook: function() {
      if (!this.$root.isLoggedIn()) {
        if (!confirm("로그인이 필요합니다.\n로그인 하시겠습니까?")) {
          return;
        }
        this.$root.redirectToLoginUrl();
        return;
      }
      if (this.userSchool === "" || this.schoolrank === "") {
        alert("랭킹 정보가 없습니다.");
        return;
      }
      var site = window.location.host;
      var snsURL = "";

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
      if (this.userSchool === "" || this.schoolrank === "") {
        alert("랭킹 정보가 없습니다.");
        return;
      }
      Kakao.Link.sendDefault({
        objectType: "feed",
        content: {
          title: "동전쌓기",
          description:
            this.userSchool +
            "가 " +
            this.myLiveSchool.gamedata +
            " 총점으로 " +
            this.schoolrank +
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
    fetchUser() {
      this.$axios
        .get(this.$Api.me, this.$root.bearerHeaders())
        .then(response => {
          if (!response || response.data.code !== Result.OK.code) {
            return;
          }
          if (response.data.user.mySchool !== null) {
            this.userSchool = response.data.user.mySchool.school.name;
            localStorage.setItem("userSchool", this.userSchool);
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
  },

  destroyed() {
    this.$store.commit("school_first_user_Rank", 0);
    this.$store.commit("school_user_Rank", 0);
    this.$store.commit("school_start_Rank", 0);
  },
  created() {
    this.$router.push({ query: { page: 1 } });
    this.$store.commit("school_first_user_Rank", 0);
    this.$store.commit("school_user_Rank", 0);
    this.$store.commit("school_start_Rank", 0);
    this.$router.push({ query: { page: 1 } });
    this.userSchool = localStorage.getItem("userSchool");
    this.thismonth = moment().format("YYYY-MM");
    this.fetchUser();

    this.fetchSchoolsLiveRankings();
  }
};
</script>
