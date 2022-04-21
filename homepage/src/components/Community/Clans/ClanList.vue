<template>
  <div id="clan-list">
    <nav class="tab-rounded">
      <ul>
        <li :class="{ selected : $route.name === 'clans' }">
          <router-link :to="{ name: 'clans' }" title="전체 클랜">
            <span class="tab-icon icon-group"></span>
            <span>전체 클랜</span>
          </router-link>
        </li>
        <li :class="{ selected : $route.name === 'my-clan' }" v-if="isClan">
          <router-link :to="{ name: 'my-clan' }" title="내 클랜">
            <span class="tab-icon icon-me"></span>
            <span>내 클랜</span>
          </router-link>
        </li>
      </ul>
    </nav>

    <div v-if="$route.name === 'clans'">
      <table class="clan-table">
        <thead>
          <tr>
            <th class="clan">
              <div>클랜명</div>
            </th>
            <th class="master">
              <div>클랜장</div>
            </th>
            <th class="member-count">
              <div>인원수</div>
            </th>
            <th class="info">
              <div>클랜정보</div>
            </th>
            <th class="join">
              <div>가입</div>
            </th>
          </tr>
        </thead>
        <tbody v-if="clans">
          <tr v-if="totalCount === 0">
            <td colspan="5" class="no-clans">등록된 클랜이 없습니다.</td>
          </tr>

          <tr v-bind:key="clan.id" v-for="(clan) in clans">
            <td class="clan" v-if="clan.name">
              <div class="clan-name">{{ clan.name }}</div>
              <div class="clan-description">{{ clan.description }}</div>
            </td>
            <td class="master" v-if="clan.manager_nickname">{{ clan.manager_nickname }}</td>
            <td class="member-count">{{ clan.member_count }}</td>
            <td class="info" v-if="clan.name">
              <div>
                <router-link
                  :to="{ name: 'clan-view', params: { id: clan.id } }"
                  class="button-rounded-gray-small"
                >클랜 정보</router-link>
              </div>
            </td>
            <td class="join" v-if="isClan">
              <div v-if="clan.name === myClan[0].name">
                <img src="/images/icon_check.png" alt="체크" />
                <div>내 클랜</div>
              </div>
            </td>
            <td class="join" v-else-if="wanabClan === 'NoClan'">
              <button class="button-rounded-blue" @click="signUpClan(clan.id)">가입신청</button>
            </td>
            <td v-else>
              <div v-for="wanab in wanabClan" :key="wanab.id">
                <div v-if="wanab.id === clan.id">
                  <button class="button-rounded-navy" @click="denyWanbMember(clan.id)">신청취소</button>
                </div>
                <div v-else>
                  <!-- <div v-if="!wanabClan[index]">
                                        <button class="button-rounded-blue" @click="signUpClan(clan.id)">가입신청</button>
                  </div>-->
                  <button class="button-rounded-blue" @click="signUpClan(clan.id)">가입신청</button>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <div class="button-container" v-if="!isClan">
        <router-link :to="{ name: 'clan-create' }" class="button-rounded-red">클랜만들기</router-link>
      </div>

      <pagination :current="page" :totalCount="totalCount" />
    </div>
  </div>
</template>

<script>
import Result from "../../../utils/result";
import moment from "moment";
import { truncate, truncateSync } from "fs";

export default {
  data() { //변수 초기화
    return {
      myClan: null,
      wanabClan: null,
      clans: { total: 0 },
      totalCount: 0,
      // page: this.$route.query.page || 1,
      type: this.$route.query.type,
      clan: {
        id: 0
      },
      isClan: false,
      isShowSignIn: false,
      uuid: 0
    };
  },

  methods: {
    getUserClan() { //유저 클랜 가져오기
      this.$EventBus.$emit("loading-add", "getUserClan");
      this.$axios
        .post(this.$Api2.clans.getIsClan, { sessionid: this.$root.sessionId() })
        .then(response => {
          if (!response) {
            return;
          }
          this.$EventBus.$emit("loading-remove", "getUserClan");
          this.myClan = response.data[0].regitClan;
          this.wanabClan = response.data[0].wanabClan;

          if (this.myClan === "NoClan") {
            this.isClan = false;
          } else {
            this.isClan = true;
          }
          this.getAllClans();
        })
        .catch(error => {
          this.$EventBus.$emit("loading-remove", "getUserClan");
          console.log(error);
        });
    },

    switchToAllClans() { 
      this.$router.push({ query: { type: "all" } });
      this.type = "all";
      this.loadClans();
    },

    switchToMyClan() {
      if (this.$root.isLoggedIn()) {
        this.$router.push({ query: { type: "my" } });
        this.type = "my";
        this.loadClans();
      } else {
        alert("로그인이 필요합니다.");
      }
    },

    getAllClans() { //모든 클랜 가져오기
      this.$EventBus.$emit("loading-add", "fetch-clans");

      this.$axios
        .post(this.$Api2.clans.getAllClans, { page: this.page, pagesize: 10 })
        .then(response => {
          this.$EventBus.$emit("loading-remove", "fetch-clans");

          if (!response) {
            return;
          }

          this.clans = response.data.AllClan;
          this.totalCount = response.data.TotalCount[0]._total_count;
        })
        .catch(error => {
          console.log(error);
          this.$EventBus.$emit("loading-remove", "fetch-clans");
        });
    },

    getMyClan() {
      this.$EventBus.$emit("loading-add", "getMyClan");
      this.sessionid = this.$root.sessionId();
      this.$axios
        .post(this.$Api2.clans.getMyClan, { sessionid: this.sessionid })
        .then(response => {
          //console.log(response.data);
          if (!response) {
            return;
          }
          this.myClan = response.data.MyClanInfo[0];
          this.uuid = response.data.uuid;
          this.$EventBus.$emit("loading-remove", "getMyClan");
        })
        .catch(error => {
          console.log(error);
          this.$EventBus.$emit("loading-remove", "getMyClan");
        });
    },

    destroyClan() {
      if (this.clans.total !== 0) {
        alert(
          " 클랜원이 없어야 클랜을 폐쇄할 수 있습니다.\n 클랜원이 있다면 모두 강제 탈퇴 처리 후에 시도해 주세요"
        );
      } else {
        if (!confirm("정말 삭제하겠습니까?")) {
          return;
        }
        //TODO :::  여기에 삭제 함수 호출...
      }
    },

    signUpClan(id) { //가입신청하기
      if (this.isClan) {
        alert(
          "클랜은 중복 가입할 수 없습니다.\n탈퇴나 폐쇄를 먼저 진행해 주세요."
        );
      } else {
        if (this.$root.isLoggedIn()) {
          if (this.wanabClan.length > 0 && this.wanabClan !== "NoClan") {
            alert("클랜 가입신청은 중복될 수 없습니다.");
            return;
          }
          if (!confirm("클랜에 가입하시겠습니까?")) {
            return;
          }
          //TODO ::: 여기에서 클랜 가입처리...
          this.$axios
            .post(this.$Api2.clans.signUpClan, {
              sessionid: this.$root.sessionId(),
              clanid: id
            })
            .then(response => {
              //console.log(response.data);

              if (!response || response.data.result != 0) {
                switch (response.data.result) {
                  case 9182:
                    alert("이미 다른 클랜의 멤버입니다.");
                    return;
                  case 9184:
                    alert("가입요청에 실패하였습니다.");
                    return;
                  case 9185:
                    alert("이미 가입신청한 클랜입니다.");
                    return;
                  default:
                    alert("가입요청에 실패하였습니다.");
                    return;
                }
              } else {
                this.$router.push("/community/clans");
                alert("가입요청이 완료되었습니다.");
                this.$router.go();
              }
            });
        } else {
          alert("로그인이 필요합니다.");
        }
      }
    },

    denyWanbMember(id) { //신청취소
      if (!confirm("클랜가입 신청요청을 취소하시겠습니까?")) {
        return;
      }
      this.$EventBus.$emit("loading-add", "denyWanbMember");
      this.$axios
        .post(this.$Api2.clans.denyMember, {
          userid: this.uuid,
          clanid: id,
          sessionid: this.$root.sessionId()
        })
        .then(response => {
          //console.log(response.data);

          if (!response) {
            alert("클랜가입 신청요청 취소를 실패하였습니다.");
            return;
          }
          this.$EventBus.$emit("loading-remove", "denyWanbMember");

          this.$router.push("/community/clans");
          alert("클랜가입 신청요청이 취소되었습니다.");
          this.$router.go();
        })
        .catch(error => {
          console.log(error);
          this.$EventBus.$emit("loading-remove", "denyWanbMember");
        });
    },
    getUseruuid() { //유저 UUID가져오기
      this.$EventBus.$emit("loading-add", "getUseruuid");
      this.$axios
        .post(this.$Api2.userinfo.getuserinfo, {
          session_id: this.$root.sessionId()
        })
        .then(response => {
          if (!response) {
            return;
          }
          //console.log(response.data);
          this.uuid = response.data.uuid;
          this.$EventBus.$emit("loading-remove", "getUseruuid");
        })
        .catch(error => {
          this.$EventBus.$emit("loading-remove", "getUseruuid");
          console.log(error);
        });
    }
  },

  watch: {
    $route() {
      if (this.$route.name === "clans") {
        this.getUserClan();
        this.getAllClans();
      }
    }
  },

  computed: {
    page() {
      return this.$route.query.page || 1;
    }
  },

  created() { //페이지 초기 로딩
    if (this.$root.isLoggedIn()) {
      if (this.$route.name === "clans") {
        this.getUserClan();
        this.getUseruuid();
        this.$root.sendLog(13);
      }
    } else {
      if (!confirm("로그인이 필요합니다.\n로그인 하시겠습니까?")) {
        this.$router.push("/community/news");
        return;
      }
      this.$root.redirectToLogin();
    }
  }
};
</script>