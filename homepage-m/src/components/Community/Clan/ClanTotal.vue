<template>
  <div class="page-container">
    <div class="page-wrapper page-community clan">
      <Header/>
      <SideMenu />
      <section class="main-content">
        <header class="page-header">
          <h1 class="page-title">클랜</h1>
        </header>
        <div class="sub-wrap p-3">
          <ul class="nav-tabs1">
            <li class="current">
              <div>
                <router-link to="/clan">전체클랜</router-link>
              </div>
            </li>
            <li>
              <div>
                <router-link style="color : black;" to="/clan/my">내 클랜</router-link>
                <span></span>
              </div>
            </li>
            <li>
              <div>
                <router-link style="color : black;" to="/clan/make">클랜만들기</router-link>
                <span></span>
              </div>
            </li>
          </ul>
          <div class="clantotal">
            <table class="tbs02 mt-2" style="width:100%;">
              <colgroup>
                <col width="40%" />
                <col width="20%" />
                <col width="20%" />
                <col width="20%" />
              </colgroup>
              <thead>
                <tr>
                  <th class="first">클랜명</th>
                  <th>클랜장</th>
                  <th>인원수</th>
                  <th class="last">가입여부</th>
                </tr>
              </thead>
              <tbody v-for="clan in clans">
                <tr>
                  <td class="first ta_lie">
                    <router-link :to="'/clan/' + clan.id">
                      <p class="bbs_tit">{{clan.name}}</p>
                    </router-link>
                    <router-link :to="'/clan/' + clan.id">
                      <p class="bbs_info">{{clan.description}}</p>
                    </router-link>
                  </td>
                  <td>{{clan.manager_nickname}}</td>
                  <td>{{clan.member_count}}</td>

                  <td class="last" v-if="isClan">
                    <div v-if="myClan[0].manager_nickname === clan.manager_nickname">
                      <router-link to="clan/my" class="btn btn-danger btn-xs pull-right">
                        내
                        <br />클랜
                      </router-link>
                    </div>
                  </td>
                  <td v-else-if="wanaClan ==='NoClan'">
                    <button class="btn btn-primary btn-xs pull-right" @click="signUpClan(clan.id)">
                      가입
                      <br />하기
                    </button>
                  </td>
                  <td class="last" v-else>
                    <div v-for="wanab in wanaClan" :key="wanab.id">
                      <div v-if="wanab.id === clan.id">
                        <button
                          class="btn btn-danger btn-xs pull-right"
                          @click="denyWanbMember(clan.id)"
                        >
                          신청
                          <br />취소
                        </button>
                      </div>
                      <div v-else>
                        <button
                          class="btn btn-primary btn-xs pull-right"
                          @click="signUpClan(clan.id)"
                        >
                          가입
                          <br />하기
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
            <pagination :current="page" :totalCount="totalCount" class="paging1" />
          </div>
        </div>
      </section>
      <Footer />
    </div>
  </div>
</template>

<script>
import Header from '@/components/Header.vue'
import SideMenu from "@/components/SideMenu.vue";
import Footer from "@/components/Footer.vue";

export default {
  components: {
    Header,
    SideMenu,
    Footer
  },

  data() {
    return {
      totalCount: 0,
      myClan: [],
      clans: [],
      clanCheck: false,
      uuid: 0,
      wanaClan: null,
      isClan: false
    };
  },

  computed: {
    page() {
      return this.$route.query.page || 1;
    }
  },

  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.$root.registerNicknameIfNotExist();
    });
  },

  methods: {
    Log() {
      this.$axios
        .put(
          this.$Api.logs,
          { menu_type: 13, Authorization: "Bearer" + this.$root.sessionId() },
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
    createdAt(createdAt) {
      return moment(createdAt).format("YYYY-MM-DD");
    },

    view(id) {
      this.$router.push({ name: "freeview", params: { id: id } });
    },

    postAllClan() {
      this.$axios
        .post(this.$Api2.clans.getClans, { page: this.page, pagesize: 10 })
        .then(response => {
          this.clans = response.data.AllClan;

          this.totalCount = response.data.TotalCount[0]._total_count;

          //this.getIsclan();
          if (!response) {
            return;
          }

          this.getUserUuid();
          this.getIsclan();
        })
        .catch(error => {
          console.error(error);
        });
    },
    getIsclan() {
      this.$axios
        .post(this.$Api2.clans.getIsClan, { sessionid: this.$root.sessionId() })
        .then(response => {
          if (!response) {
            return;
          }
          console.log(response.data);

          this.myClan = response.data[0].regitClan;

          this.wanaClan = response.data[0].wanabClan;

          if (this.myClan === "NoClan") {
            this.isClan = false;
          } else {
            this.isClan = true;
          }
        })
        .catch(error => {
          console.log(error);
        });
    },

    denyWanbMember(id) {
      if (!confirm("클랜가입 신청요청을 취소하시겠습니까?")) {
        return;
      }
      this.$EventBus.$emit("loading-add", "denyWanbMember");
      this.$axios
        .post(this.$Api2.clans.denyMember, { userid: this.uuid, clanid: id,
          sessionid: this.$root.sessionId() })
        .then(response => {
          console.log(response.data);

          if (!response) {
            alert("클랜가입 신청요청 취소를 실패하였습니다.");
            return;
          }
          this.$EventBus.$emit("loading-remove", "denyWanbMember");

          this.$router.push("/clan");
          alert("클랜가입 신청요청이 취소되었습니다.");
          this.$router.go();
        })
        .catch(error => {
          console.log(error);
          this.$EventBus.$emit("loading-remove", "denyWanbMember");
        });
    },

    getUserUuid() {
      this.sessionid = this.$root.sessionId();
      this.$axios
        .post(this.$Api2.userinfo.getuserinfo, {
          session_id: this.$root.sessionId()
        })
        .then(response => {
          console.log(response.data);
          if (!response) {
            return;
          }
          this.uuid = response.data.uuid;
        })
        .catch(error => {
          this.clanCheck = false;
          console.error(error);
        });
    },
    signUpClan(id) {
      console.log(this.wanaClan);
      if (this.isClan) {
        alert(
          "클랜은 중복 가입할 수 없습니다.\n탈퇴나 폐쇄를 먼저 진행해 주세요."
        );
      } else {
        if (this.$root.isLoggedIn()) {
          if (this.wanaClan.length > 0 && this.wanaClan !== "NoClan") {
            alert("클랜 가입신청은 중복될 수 없습니다.");
            return;
          }
          if (!confirm("클랜에 가입하시겠습니까?")) {
            return;
          }
          //TODO ::: 여기에서 클랜 가입처리...
          this.$axios
            .post(this.$Api2.clans.signinClan, {
              sessionid: this.$root.sessionId(),
              clanid: id
            })
            .then(response => {
              console.log(response.data);

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
                this.$router.push("/clan");
                alert("가입요청이 완료되었습니다.");
                this.$router.go();
              }
            });
        } else {
          alert("로그인이 필요합니다.");
        }
      }
    }
  },

  watch: {
    $route() {
      this.postAllClan();
    }
  },

  created() {
    if (this.$root.isLoggedIn()) {
      this.postAllClan();
      this.Log();
    } else {
      if (!confirm("로그인이 필요합니다.\n로그인 하시겠습니까?")) {
        this.$router.push("/");
        this.$router.go();
        return;
      }
      this.$root.redirectToLoginUrl();
    }
  }
};
</script>
