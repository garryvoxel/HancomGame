<template>
  <div id="ranking-piling-coins">
    <nav v-if="$parent.isRankingOfPilingCoins" class="tab-rounded">
      <ul>
        <li :class="{ selected: $route.name === 'ranking-piling-coins-personal' }">
          <router-link :to="{ name: 'ranking-piling-coins-personal' }" title="개인 순위">
            <span class="tab-icon icon-person"></span>
            <span>개인 순위</span>
          </router-link>
        </li>
        <li :class="{ selected: $route.name === 'ranking-piling-coins-school' }">
          <router-link :to="{ name: 'ranking-piling-coins-school' }" title="학교 순위">
            <span class="tab-icon icon-school"></span>
            <span>학교 순위</span>
          </router-link>
        </li>
      </ul>
    </nav>

    <div v-if="$route.name === 'ranking-piling-coins-personal'" class="ranking-content-wrapper">
      <div class="ranking-content">
        <!-- <div class="ranking-week">
                    <div class="ranking-share">
                        <a class="button-toggle" @click="realTime=!realTime" style="margin-right: 38rem;">{{toggleText}}</a>
                        <a class="button-facebook" @click="shareFaceBook">공유하기</a>
                        <a class="button-kakaotalk" @click="shareKakao">공유하기</a>
                    </div>
        </div>-->
        <table
          v-if="realTime"
          class="ranker-table"
          style="background-color: #fff; margin-top: 10px;"
        >
          <thead>
            <tr>
              <th style="text-align: left; background-color: white;">
                <!-- <a class="toggle-button" @click="realTime=!realTime">{{toggleText}}</a> -->
              </th>
              <th style="text-align: center; background-color: white;">
                <!-- <a class="pre-button">지난 달</a>
                                2018-12-19 ~ 2018-12-19 
                <a class="next-button">다음 달</a>-->
              </th>
              <th style="text-align: right; background-color: white;">
                <a class="facebook-button" @click="shareFaceBook">
                  <i class="fab fa-facebook-square"></i> 공유하기
                </a>
                <a class="kakao-button" @click="shareKakao">
                  <i class="fas fa-comment"></i> 공유하기
                </a>
              </th>
            </tr>
          </thead>
        </table>
        <table v-else class="ranker-table" style="background-color: #fff; margin-top: 10px;">
          <thead>
            <tr>
              <th style="text-align: left; background-color: white;">
                <a class="toggle-button" @click="realTime = !realTime">
                  {{
                  toggleText
                  }}
                </a>
              </th>
              <th style="text-align: center; background-color: white">
                <a class="pre-button" @click="prevWeek()">
                  <i class="fas fa-arrow-left"></i> 지난 주
                </a>
                <b class="dateSearch">{{ getDateStart(datetotalcount) }}</b>
                <a class="next-button" @click="nextWeek()">
                  다음 주
                  <i class="fas fa-arrow-right"></i>
                </a>
              </th>
              <th style="text-align: right; background-color: white;">
                <a class="facebook-button" @click="shareFaceBook">
                  <i class="fab fa-facebook-square"></i> 공유하기
                </a>
                <a class="kakao-button" @click="shareKakao">
                  <i class="fas fa-comment"></i> 공유하기
                </a>
              </th>
            </tr>
          </thead>
        </table>

        <table v-if="realTime" class="ranker-table">
          <thead>
            <tr>
              <th class="ranking">
                <div>순위</div>
              </th>
              <th class="school">
                <div>학교</div>
              </th>
              <th class="nickname">
                <div>별명</div>
              </th>
              <th class="score" style="text-align: center !important;">
                <div>승점</div>
              </th>
              <th class="typing-speed">
                <div>누적승</div>
              </th>
              <th class="typing-speed">
                <div>누적패</div>
              </th>
              <th class="typing-speed">
                <div>누적무</div>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="isLogin" class="my-ranking">
              <td class="ranking">
                <b>{{ myRanking.rank > 0 ? myRanking.rank : '--' }}</b>
              </td>
              <td class="school">
                <b>{{ userSchool ? userSchool : '학교정보미입력' }}</b>
              </td>
              <td class="nickname">
                <b>{{ userName }}</b>
              </td>
              <td class="score" style="padding-right: 15px;">
                <b>
                  {{
                  myRanking.rank > 0
                  ? numberWithCommas(myRanking.gamedata)
                  : '--'
                  }}
                </b>
              </td>
              <td class="typing-speed">
                <b>
                  {{
                  myRanking.rank > 0 ? numberWithCommas(myRanking.WIN) : '--'
                  }}
                </b>
              </td>
              <td class="typing-speed">
                <b>
                  {{
                  myRanking.rank > 0 ? numberWithCommas(myRanking.Lose) : '--'
                  }}
                </b>
              </td>
              <td class="typing-speed">
                <b>
                  {{
                  myRanking.rank > 0 ? numberWithCommas(myRanking.Draw) : '--'
                  }}
                </b>
              </td>
            </tr>
            <tr v-else class="my-ranking">
              <td class="ranking">
                <b>--</b>
              </td>
              <td class="school">
                <b>--</b>
              </td>
              <td class="nickname">
                <b>--</b>
              </td>
              <td class="score" style="padding-right: 15px;">
                <b>--</b>
              </td>

              <td class="typing-speed">
                <b>--</b>
              </td>

              <td class="typing-speed">
                <b>--</b>
              </td>

              <td class="typing-speed">
                <b>--</b>
              </td>
            </tr>
            <tr v-for="(ranking, idx) in rankingList" :key="idx">
              <td class="ranking">{{ ranking.rank }}</td>
              <td class="school">{{ ranking.school ? ranking.school : '학교정보미입력' }}</td>
              <td class="nickname">{{ ranking.nickname ? ranking.nickname : '--' }}</td>
              <td class="score" style="padding-right: 15px;">
                {{
                numberWithCommas(ranking.gamedata)
                ? numberWithCommas(ranking.gamedata)
                : '0'
                }}
              </td>

              <td class="typing-speed">{{ ranking.WIN ? ranking.WIN : '0' }}</td>
              <td class="typing-speed">{{ ranking.Lose ? ranking.Lose : '0' }}</td>
              <td class="typing-speed">{{ ranking.Draw ? ranking.Draw : '0' }}</td>
            </tr>
          </tbody>
        </table>
        <table v-else class="ranker-table">
          <thead>
            <tr>
              <th class="ranking">
                <div>순위</div>
              </th>
              <th class="school">
                <div>학교</div>
              </th>
              <th class="nickname">
                <div>별명</div>
              </th>
              <th class="score" style="text-align: center !important;">
                <div>승점</div>
              </th>
              <th class="typing-speed">
                <div>승</div>
              </th>
              <th class="typing-speed">
                <div>패</div>
              </th>
              <th class="typing-speed">
                <div>무</div>
              </th>
            </tr>
            <tr v-if="isLogin && myRanking.Rank" class="my-ranking">
              <td class="ranking">
                <b>{{ myRanking.Rank > 0 ? myRanking.Rank : '--' }}</b>
              </td>
              <td class="school">
                <!-- <span>내 순위</span> -->
                <b>{{ userSchool ? userSchool : '학교정보미입력' }}</b>
              </td>
              <td class="nickname">
                <b>{{ userName ? userName : '--' }}</b>
              </td>
              <td class="score" style="padding-right: 15px;">
                <b>{{ numberWithCommas(myRanking.Score) }}</b>
              </td>
              <td class="typing-speed">
                <b>{{ numberWithCommas(myRanking.WIN) }}</b>
              </td>
              <td class="typing-speed">
                <b>{{ numberWithCommas(myRanking.Lose) }}</b>
              </td>
              <td class="typing-speed">
                <b>{{ numberWithCommas(myRanking.Draw) }}</b>
              </td>
            </tr>
            <tr v-else class="my-ranking">
              <td class="ranking">
                <b>--</b>
              </td>
              <td class="school">
                <!-- <span>내 순위</span> -->
                <b>--</b>
              </td>
              <td class="nickname">
                <b>--</b>
              </td>
              <td class="score" style="padding-right: 15px;">
                <b>--</b>
              </td>
              <td class="typing-speed">
                <b>--</b>
              </td>
              <td class="typing-speed">
                <b>--</b>
              </td>
              <td class="typing-speed">
                <b>--</b>
              </td>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(ranking, index) in rankingList[page - 1]" :key="index">
              <td class="ranking">{{ ranking.Rank }}</td>
              <td class="school">{{ ranking.SchoolName ? ranking.SchoolName : '학교정보미입력' }}</td>
              <td class="nickname">{{ ranking.nickname ? ranking.nickname : '--' }}</td>
              <td class="score" style="padding-right: 15px;">
                {{
                numberWithCommas(ranking.Score)
                ? numberWithCommas(ranking.Score)
                : '0'
                }}
              </td>
              <td class="typing-speed">{{ ranking.Win ? ranking.Win : '0' }}</td>
              <td class="typing-speed">{{ ranking.Lose ? ranking.Lose : '0' }}</td>
              <td class="typing-speed">{{ ranking.Draw ? ranking.Draw : '0' }}</td>
            </tr>
          </tbody>
        </table>
        <ul v-if="rankingList.length === 0" class="ranking-null">
          <li style="margin-top:15px">{{ rankingText }}</li>
        </ul>
        <rankingpagination
          v-if="realTime"
          :current="page"
          :redis_total_count="redisTotalCount"
          :total-count="totalCount"
          :start-rank="startRanking"
        />
        <pagination v-else :current="page" :total-count="totalCount" />
      </div>
    </div>

    <div v-if="$route.name === 'ranking-piling-coins-school'">
      <div class="ranking-content">
        <!-- <div class="ranking-week">
                    <button class="prev">지난 주</button>
                    <div class="period">2018-12-19~2018-12-19</div>
                    <button class="next">다음 주</button>
                    <div class="ranking-share">
                        <a class="button-facebook" @click="shareFaceBook">공유하기</a>
                        <a class="button-kakaotalk" @click="shareKakao">공유하기</a>
                    </div>
        </div>-->
        <table
          v-if="realTime"
          class="ranker-table"
          style="background-color: #fff; margin-top: 10px;"
        >
          <thead>
            <tr>
              <th style="text-align: left; background-color: white;">
                <!-- <a class="toggle-button" @click="realTime=!realTime">{{toggleText}}</a> -->
              </th>
              <th style="text-align: center; background-color: white;">
                <!-- <a class="pre-button">지난 달</a>
                                2018-12-19 ~ 2018-12-19 
                <a class="next-button">다음 달</a>-->
              </th>
              <th style="text-align: right; background-color: white;">
                <a class="facebook-button" @click="shareFaceBookSchool">
                  <i class="fab fa-facebook-square"></i> 공유하기
                </a>
                <a class="kakao-button" @click="shareKakaoSchool">
                  <i class="fas fa-comment"></i> 공유하기
                </a>
              </th>
            </tr>
          </thead>
        </table>
        <table v-else class="ranker-table" style="background-color: #fff; margin-top: 10px;">
          <thead>
            <tr>
              <th style="text-align: left; background-color: white;">
                <a class="toggle-button" @click="realTime = !realTime">
                  {{
                  toggleText
                  }}
                </a>
              </th>
              <th style="text-align: center; background-color: white;">
                <!-- <a class="pre-button"><i class="fas fa-arrow-left"></i> 지난 달</a>
                                2018-12-19 ~ 2018-12-19 
                <a class="next-button">다음 달 <i class="fas fa-arrow-right"></i></a>-->
              </th>
              <th style="text-align: center; background-color: white; padding-right: 200px;">
                <a class="pre-button" @click="prevWeek()">
                  <i class="fas fa-arrow-left"></i> 지난 달
                </a>
                <b>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{
                  thismonth
                  }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                </b>
                <a class="next-button" @click="nextWeek()">
                  다음 달
                  <i class="fas fa-arrow-right"></i>
                </a>
              </th>
            </tr>
          </thead>
        </table>
        <table v-if="realTime" class="ranker-table">
          <thead>
            <tr>
              <th class="ranking">
                <div>순위</div>
              </th>
              <th class="school">
                <div>학교</div>
              </th>
              <th class="score" style="text-align: center !important;">
                <div>총점</div>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="isLogin" class="my-ranking">
              <td
                class="ranking"
                style="font-weight : bold"
              >{{ myRanking.rank ? myRanking.rank : '--' }}</td>
              <td class="school" style="font-weight :bold">
                <!-- <span>내 순위</span> -->
                {{ userSchool ? userSchool : '학교정보미입력' }}
              </td>

              <td
                class="score"
                style="padding-right: 15px;"
              >{{ myRanking.gamedata ? myRanking.gamedata : '--' }}</td>
            </tr>
            <tr v-else class="my-ranking">
              <td class="ranking" style="font-weight : bold">--</td>
              <td class="school" style="font-weight :bold">
                <!-- <span>내 순위</span> -->
                --
              </td>

              <td class="score" style="padding-right: 15px;">--</td>
            </tr>
            <tr v-for="(ranking, idx) in rankingList" :key="idx">
              <td class="ranking">{{ ranking.rank ? ranking.rank : '--' }}</td>
              <td class="school">{{ ranking.schoolname ? ranking.schoolname : '--' }}</td>
              <td class="score" style="padding-right: 15px;">
                {{
                numberWithCommas(ranking.gamedata)
                ? numberWithCommas(ranking.gamedata)
                : '--'
                }}
              </td>
            </tr>
          </tbody>
        </table>
        <table v-else class="ranker-table">
          <thead>
            <tr>
              <th class="ranking">
                <div>순위</div>
              </th>
              <th class="school">
                <div>학교</div>
              </th>
              <th class="score" style="text-align: center !important;">
                <div>총점</div>
              </th>
            </tr>
            <tr v-if="isLogin && myRanking.Score" class="my-ranking">
              <td class="ranking">
                <b>{{ myRanking.Rank ? myRanking.Rank : '--' }}</b>
              </td>
              <td class="school">
                <b>{{ userSchool ? userSchool : '--' }}</b>
              </td>
              <td class="score" style="padding-right: 15px;">
                <b>
                  {{
                  numberWithCommas(myRanking.Score)
                  ? numberWithCommas(myRanking.Score)
                  : '--'
                  }}
                </b>
              </td>
            </tr>
            <tr v-else class="my-ranking">
              <td class="ranking">--</td>
              <td class="school">--</td>
              <td class="score" style="padding-right: 15px;">--</td>
            </tr>
          </thead>
          <tbody v-if="rankingList.length !== 0">
            <tr v-for="(ranking, index) in rankingList[page - 1]" :key="index">
              <td class="ranking">{{ ranking.Rank ? ranking.Rank : '--' }}</td>
              <td class="school">{{ ranking.SchoolName ? ranking.SchoolName : '--' }}</td>
              <td class="score" style="padding-right: 15px;">
                {{
                numberWithCommas(ranking.Score)
                ? numberWithCommas(ranking.Score)
                : '0'
                }}
              </td>
            </tr>
          </tbody>
        </table>
        <ul v-if="rankingList.length === 0" class="ranking-null">
          <li style="margin-top:15px">{{ this.rankingText }}</li>
        </ul>
        <rankingpagination
          v-if="realTime"
          :current="page"
          :redis_total_count="redisTotalCount"
          :total-count="totalCount"
          :start-rank="school_startRanking"
        />
        <pagination v-else :current="page" :total-count="totalCount" @next="onNext" @prev="onPrev" />
      </div>
    </div>
  </div>
</template>

<script>
import Result from "../../utils/result";
import moment from "moment";
import mixin from "@/mixin";

export default {
  mixins: [mixin],
  data() {
    return {
      myRanking: {},
      totalCount: 0,
      rankings: [],
      schoolRanking: [],
      rankingList: [],
      week: 0,
      dateTotalCount: 1,
      isLogin: this.$root.isLoggedIn(),
      gameCode: "SETCOIN_RANKING",
      realTime: true,
      toggleText: "기간랭킹 보기",
      userSchool: "",
      mySchool: null,
      thismonth: moment().format("YYYY-MM"),
      datetotalcount: 1,
      datetotalcounts: 1,
      schoolrank: "",
      userName: "",
      rankingText: "랭킹 정보가 없습니다.",
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
      this.myRanking;
      if (this.$route.name === "ranking-piling-coins-personal") {
        this.startRank;
        this.fetchPersonalRankings();
      } else {
        this.school_startRank;
        this.$store.commit("user_Rank", 0);
        this.fetchSchoolRankings();
      }
    },
    realTime: function(newVal, oldVal) {
      this.$store.commit("school_first_user_Rank", 0);
      this.$store.commit("school_user_Rank", 0);
      this.$store.commit("school_start_Rank", 0);
      this.$store.commit("first_user_Rank", 0);
      this.$store.commit("user_Rank", 0);
      this.$store.commit("start_Rank", 0);
      this.myRanking;
      if (this.$route.name === "ranking-piling-coins-personal") {
        if (this.realTime) {
          this.fetchPersonalRankings();
          this.toggleText = "기간랭킹 보기";
          this.$router.push({ query: { page: 1 } });
          this.$store.commit("ranking_notice_Show", true);
        } else {
          this.fetchPersonalRankingsAcc();

          this.toggleText = "실시간랭킹 보기";
          this.$router.push({ query: { page: 1 } });
          this.$store.commit("ranking_notice_Show", false);
        }
      } else {
        if (this.realTime) {
          this.fetchSchoolRankings();
          this.toggleText = "기간랭킹 보기";
          this.$router.push({ query: { page: 1 } });
          this.$store.commit("ranking_notice_Show", true);
        } else {
          this.fetchSchoolRankingsAcc();

          this.toggleText = "실시간랭킹 보기";
          this.$router.push({ query: { page: 1 } });
          this.$store.commit("ranking_notice_Show", false);
        }
      }
    }
  },
  mounted() {
    // console.log('mounted');
    this.$axios
      .get(this.$Api.me, this.$root.bearerHeaders())
      .then(response => {
        if (!response || response.data.code !== Result.OK.code) {
          return;
        }
        if (response.data.user.mySchool !== null) {
          this.userSchool = response.data.user.mySchool.school.name;
        }
        this.userName = response.data.user.nickname;
        // console.log(this.userName);
      })
      .catch(error => {
        console.log(error);
      });
  },
  destroyed() {
    // console.log('ss');
    this.$store.commit("school_first_user_Rank", 0);
    this.$store.commit("school_user_Rank", 0);
    this.$store.commit("school_start_Rank", 0);
    this.$store.commit("first_user_Rank", 0);
    this.$store.commit("user_Rank", 0);
    this.$store.commit("start_Rank", 0);
  },
  created() {
    this.$store.commit("school_first_user_Rank", 0);
    this.$store.commit("school_user_Rank", 0);
    this.$store.commit("school_start_Rank", 0);
    this.$store.commit("first_user_Rank", 0);
    this.$store.commit("user_Rank", 0);
    this.$store.commit("start_Rank", 0);
    // console.log(this.$route);
    this.$router.push({ query: { page: 1 } });
    this.startRanking = (this.$route.query.page || 1) - 1;
    this.$store.commit("start_Rank", this.startRanking);

    this.thismonth = moment().format("YYYY-MM");

    if (this.$route.name === "ranking-piling-coins-personal") {
      if (this.realTime) {
        this.fetchPersonalRankings();
        this.toggleText = "기간랭킹 보기";
      } else {
        this.fetchPersonalRankingsAcc();

        this.toggleText = "실시간랭킹 보기";
      }
    } else {
      if (this.realTime) {
        this.fetchSchoolRankings();
        this.toggleText = "기간랭킹 보기";
      } else {
        this.fetchSchoolRankingsAcc();

        this.toggleText = "실시간랭킹 보기";
      }
    }
    this.$root.sendLog(10);
  },
  methods: {
    fetchPersonalRankings() {
      this.$axios
        .get(this.$Api.me, this.$root.bearerHeaders())
        .then(response => {
          if (!response || response.data.code !== Result.OK.code) {
            return;
          }
          if (response.data.user.mySchool !== null) {
            this.userSchool = response.data.user.mySchool.school.name;
          }
          this.userName = response.data.user.nickname;
          // console.log(this.userName);
        })
        .catch(error => {
          console.log(error);
        });
      // console.log(this.$root.sessionId());
      this.$store.commit("school_first_user_Rank", 0);
      this.$store.commit("school_user_Rank", 0);
      this.$store.commit("school_start_Rank", 0);
      //console.log(this.$root.sessionId());
      this.startRanking = this.$store.state.start_Rank;
      var _lastRank = this.$store.state.last_Rank;

      this.endRank = this.startRanking + 9;
      this.realTime = true;
      this.$EventBus.$emit("loading-add", "fetch-rankings");
      this.$axios
        .post(this.$Api2.ranking.getrankingPersonal, {
          gamecode: this.gameCode,
          start: this.startRank,
          end: this.endRank,
          sessionid: this.$root.sessionId(),
          last_rank: this.startRank
        })
        .then(response => {
          this.$EventBus.$emit("loading-remove", "fetch-rankings");
          this.rankingList = [];
          if (!response.data) {
            this.$EventBus.$emit("loading-remove", "fetch-rankings");
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
            // alert('랭킹 정보가 없습니다.');
            return;
          }
          // console.log(response.data);
          this.rankings = response.data;

          // 첫페이지가 아닐경우 내 순위가 사라지는 문제 땜빵
          if (this.startRanking == 0) {
            this.myRanking = response.data[response.data.length - 1].Mine[0];
          }

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

          for (var i = 0; i < this.rankings.length; i++) {
            this.rankingList.push(this.rankings[i]);
          }
        })
        .catch(error => {
          console.log(error);
          this.$EventBus.$emit("loading-remove", "fetch-rankings");
        });
    },

    fetchPersonalRankingsAcc() {
      this.$axios
        .get(this.$Api.me, this.$root.bearerHeaders())
        .then(response => {
          if (!response || response.data.code !== Result.OK.code) {
            return;
          }
          if (response.data.user.mySchool !== null) {
            this.userSchool = response.data.user.mySchool.school.name;
          }
          this.userName = response.data.user.nickname;
        })
        .catch(error => {
          console.log(error);
        });
      this.$EventBus.$emit("loading-add", "fetch-rankings");
      this.$axios
        .post(this.$Api2.ranking.getrankingPersonalACC, {
          week: this.datetotalcount,
          gamecode: 10000,
          sessionid: this.$root.sessionId()
        })
        .then(response => {
          this.$EventBus.$emit("loading-remove", "fetch-rankings");
          this.rankingList = [];
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
            this.myRanking = {};
            // alert('랭킹 정보가 없습니다.');
            return;
          }

          // 첫페이지가 아닐경우 내 순위가 사라지는 문제 땜빵
          this.myRanking = response.data[response.data.length - 1].MyRank[0];

          this.rankings = response.data;

          this.totalCount =
            response.data[response.data.length - 2]["totalcount"];

          this.rankings.splice(
            response.data.indexOf(response.data[response.data.length - 2]),
            2
          );

          for (var i = 0; i < parseInt(this.rankings.length / 10); i++) {
            this.rankingList.push(this.rankings.slice(i * 10, (i + 1) * 10));
          }
          this.rankingList.push(
            this.rankings.slice(parseInt(this.rankings.length / 10) * 10)
          );
          for (var i = 0; i < response.data.length; i++) {
            if (response.data[i].nickname === this.userName) {
              this.myRanking = response.data[i];
            }
          }
          // console.log(response.data[response.data.length - 1]);
          // console.log('myRanking', this.myRanking);
        })
        .catch(error => {
          console.log(error);
          this.$EventBus.$emit("loading-remove", "fetch-rankings");
        });
    },

    fetchSchoolRankings() {
      this.$axios
        .get(this.$Api.me, this.$root.bearerHeaders())
        .then(response => {
          if (!response || response.data.code !== Result.OK.code) {
            return;
          }
          if (response.data.user.mySchool !== null) {
            this.userSchool = response.data.user.mySchool.school.name;
          }
          this.userName = response.data.user.nickname;
        })
        .catch(error => {
          console.log(error);
        });
      this.$store.commit("first_user_Rank", 0);
      this.$store.commit("user_Rank", 0);
      this.$store.commit("start_Rank", 0);
      this.realTime = true;
      this.school_startRanking = this.$store.state.school_start_Rank;
      this.school_endRank = this.school_startRanking + 9;
      var _lastRank = this.$store.state.school_last_Rank;
      this.$EventBus.$emit("loading-add", "fetch-rankings");
      this.$axios
        .post(this.$Api2.ranking.getrankingSchool, {
          gamecode: "SETCOIN_SCHOOL_RANKING",
          start: this.school_startRank,
          end: this.school_endRank,
          sessionid: this.$root.sessionId(),
          last_rank: this.school_startRank
        })
        .then(response => {
          this.$EventBus.$emit("loading-remove", "fetch-rankings");

          this.rankingList = [];
          if (!response.data) {
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
            // alert('랭킹 정보가 없습니다.');
            return;
          }
          // console.log(response.data);
          this.rankings = response.data;

          // 첫페이지가 아닐경우 내 순위가 사라지는 문제 땜빵
          if (this.startRanking == 0) {
            this.myRanking = response.data[response.data.length - 1].Mine[0];
            // this.myRanking = response.data[response.data.length - 1].MyRank[0];
          }

          this.totalCount =
            response.data[response.data.length - 2]["totalcount"];
          this.redisTotalCount =
            response.data[response.data.length - 2]["redis_total_count"];

          this.rankings.splice(response.data.length - 2, 2);

          this.$store.commit("school_first_user_Rank", this.rankings[0].rank);
          this.$store.commit(
            "school_user_Rank",
            this.rankings[response.data.length - 1].rank
          );
          for (var i = 0; i < this.rankings.length; i++) {
            this.rankingList.push(this.rankings[i]);
          }
        })
        .catch(error => {
          console.log(error);
          this.$EventBus.$emit("loading-remove", "fetch-rankings");
        });
    },

    fetchSchoolRankingsAcc() {
      this.$axios
        .get(this.$Api.me, this.$root.bearerHeaders())
        .then(response => {
          if (!response || response.data.code !== Result.OK.code) {
            return;
          }
          if (response.data.user.mySchool !== null) {
            this.userSchool = response.data.user.mySchool.school.name;
          }
          this.userName = response.data.user.nickname;
        })
        .catch(error => {
          console.log(error);
        });
      this.$EventBus.$emit("loading-add", "fetch-rankings");
      this.$axios
        .post(this.$Api2.ranking.getrankingSchoolACC, {
          month: this.datetotalcounts,
          gamecode: 10000
        })
        .then(response => {
          this.$EventBus.$emit("loading-remove", "fetch-rankings");
          this.rankingList = [];

          if (!response) {
            return;
          }

          if (
            response.data.length === 0 ||
            response.data.length <= 1 ||
            response.data.result === 9151 ||
            response.data.result === 9155 ||
            response.data.length === 0 ||
            response.data.result === 9152 ||
            response.data.result
          ) {
            this.totalCount = 0;
            this.rankingList = [];
            // alert('랭킹 정보가 없습니다.');
            return;
          }
          // console.log(response.data);
          this.rankings = response.data;

          this.totalCount =
            response.data[response.data.length - 2]["totalcount"];
          this.rankings.splice(
            response.data.indexOf(response.data[response.data.length - 1]),
            1
          );

          for (var i = 0; i < parseInt(this.rankings.length / 10); i++) {
            this.rankingList.push(this.rankings.slice(i * 10, (i + 1) * 10));
          }
          this.rankingList.push(
            this.rankings.slice(parseInt(this.rankings.length / 10) * 10)
          );
          for (var i = 0; i < response.data.length; i++) {
            if (response.data[i].SchoolName === this.userSchool) {
              this.myRanking = response.data[i];
              this.schoolrank = response.data[i].rank;
            }
          }
          // console.log(response.data[response.data.length - 1]);
          // console.log('myRanking', this.myRanking);
        })
        .catch(error => {
          console.log(error);
          this.$EventBus.$emit("loading-remove", "fetch-rankings");
        });
    },

    shareFaceBook: function() {
      if (!this.$root.isLoggedIn()) {
        if (!confirm("로그인이 필요합니다.\n로그인 하시겠습니까?")) {
          return;
        }
        this.$root.redirectToLogin();
        return;
      }

      if (!this.checkRankData(this.myRanking.rank, this.myRanking.gamedata)) {
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

    shareFaceBookSchool: function() {
      if (!this.$root.isLoggedIn()) {
        if (!confirm("로그인이 필요합니다.\n로그인 하시겠습니까?")) {
          return;
        }
        this.$root.redirectToLogin();
        return;
      }

      if (!this.checkRankData(this.myRanking.rank, this.myRanking.gamedata)) {
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
        this.$root.redirectToLogin();
        return;
      }

      if (!this.checkRankData(this.myRanking.rank, this.myRanking.gamedata)) {
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
            mobileWebUrl:
              "https://typing.malangmalang.com/rankings/typing-practice/school",
            webUrl:
              "https://typing.malangmalang.com/rankings/typing-practice/school"
          }
        },
        social: {},
        buttons: [
          {
            title: "웹으로 보기",
            link: {
              mobileWebUrl:
                "https://typing.malangmalang.com/rankings/typing-practice/school",
              webUrl:
                "https://typing.malangmalang.com/rankings/typing-practice/school"
            }
          }
        ]
      });
    },

    shareKakaoSchool: function() {
      if (!this.$root.isLoggedIn()) {
        if (!confirm("로그인이 필요합니다.\n로그인 하시겠습니까?")) {
          return;
        }
        this.$root.redirectToLogin();
        return;
      }

      if (!this.checkRankData(this.myRanking.rank, this.myRanking.gamedata)) {
        return;
      }

      Kakao.Link.sendDefault({
        objectType: "feed",
        content: {
          title: "동전쌓기",
          description:
            this.myRanking.schoolname +
            "가 " +
            this.myRanking.gamedata +
            " 총점으로 " +
            this.myRanking.rank +
            "위를 달성했습니다.",
          imageUrl:
            "https://cdn.malangmalang.com/typing/images/AllTempleteImg.png",
          link: {
            mobileWebUrl:
              "https://typing.malangmalang.com/rankings/typing-practice/school",
            webUrl:
              "https://typing.malangmalang.com/rankings/typing-practice/school"
          }
        },
        social: {},
        buttons: [
          {
            title: "웹으로 보기",
            link: {
              mobileWebUrl:
                "https://typing.malangmalang.com/rankings/typing-practice/school",
              webUrl:
                "https://typing.malangmalang.com/rankings/typing-practice/school"
            }
          }
        ]
      });
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

        return arr_date[0];
      }
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
          }
          this.userName = response.data.user.nickname;
        })
        .catch(error => {
          console.log(error);
        });
    },
    prevWeek() {
      if (this.$route.name === "ranking-piling-coins-personal") {
        this.datetotalcount += 1;
        this.thismonth = moment(this.thismonth)
          .subtract(1, "month")
          .format("YYYY-MM");
        this.fetchPersonalRankingsAcc();
      } else {
        this.datetotalcounts += 5;
        this.thismonth = moment(this.thismonth)
          .subtract(1, "month")
          .format("YYYY-MM");
        this.fetchSchoolRankingsAcc();
      }
    },
    nextWeek() {
      if (this.$route.name === "ranking-piling-coins-personal") {
        if (this.datetotalcount > 1) {
          this.datetotalcount -= 1;
          this.fetchPersonalRankingsAcc();
          this.thismonth = moment()
            .add(this.datetotalcount, "month")
            .format("YYYY-MM");
        } else {
          alert("랭킹 정보가 없습니다.");
          return;
        }
      } else {
        if (this.datetotalcounts > 0) {
          this.datetotalcounts -= 5;
          this.fetchSchoolRankingsAcc();
          this.thismonth = moment(this.thismonth)
            .add(1, "month")
            .format("YYYY-MM");
        } else {
          alert("랭킹 정보가 없습니다.");
          return;
        }
      }
    }
  }
};
</script>

<style>
.toggle-button {
  background-color: orange;
  color: white;
  padding: 10px 30px;
  border-radius: 74px;
  width: 100px;
  font-size: 14px;
  text-align: center;
}

.pre-button {
  background-color: rgb(233, 231, 230);
  color: black;
  padding: 10px 30px;
  border-radius: 74px;
  width: 100px;
  font-size: 14px;
  text-align: center;
  margin-left: 25px;
}
.next-button {
  background-color: rgb(233, 231, 230);
  color: black;
  padding: 10px 30px;
  border-radius: 74px;
  width: 100px;
  font-size: 14px;
  text-align: center;
}
.facebook-button {
  background-color: #3b599a;
  color: white;
  padding: 10px 20px;
  border-radius: 74px;
  width: 100px;
  font-size: 14px;
  text-align: center;
  margin-right: 5px;
}
.kakao-button {
  background-color: #ffd542;
  color: black;
  padding: 10px 20px;
  border-radius: 74px;
  width: 100px;
  font-size: 14px;
  text-align: center;
}
</style>
