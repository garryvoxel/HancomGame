<template>
  <div class="page-container">
    <div class="page-wrapper page-community clan">
      <Header />
      <SideMenu />
      <section class="main-content">
        <header class="page-header">
          <h1 class="page-title">클랜</h1>
        </header>
        <div class="sub-wrap p-3">
          <ul class="nav-tabs1">
            <li>
              <div>
                <router-link style="color : black;" to="/clan">전체클랜</router-link>
              </div>
            </li>
            <li class="current">
              <div>
                <router-link to="/clan/my">내 클랜</router-link>
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
          <div class="claninfo" v-if="clancheck === true">
            <table class="tbs02 mt-2" style="width:100%;">
              <colgroup>
                <col width="20%" />
                <col width="*" />
              </colgroup>
              <tbody>
                <tr>
                  <th class="tit">클랜명</th>
                  <td class="ta_l">{{this.myclanInfo.name}}</td>
                </tr>
                <tr>
                  <th class="tit">클랜소개</th>
                  <td class="ta_l" v-if="myclanInfo.manager_nickname === this.$root.user.nickname">
                    <textarea id="desc" name="name" rows="8" style="width:100%;">{{myclanInfo.description}}</textarea>
                    <button
                      style="margin-left:40%"
                      class="btn btn-dark btn-xs mt-1"
                      @click="changeDesc"
                    >저장</button>
                  </td>
                  <td class="ta_l" v-else>
                    <div name="name" rows="8" style="width:100%;">{{myclanInfo.description}}</div>
                  </td>
                </tr>
                <tr>
                  <th class="tit">클랜장</th>
                  <td class="ta_l">{{this.myclanInfo.manager_nickname}}</td>
                </tr>
              </tbody>
            </table>
            <div class="row mt-2" v-if="this.$root.user != null">
              <div
                class="col-4 col-sm-4 text-left"
                v-if="myclanInfo.manager_nickname ===this.$root.user.nickname"
              >
                <button class="btn btn-danger btn-xs" v-show="master" @click="destroyClan">클랜폐쇄</button>
              </div>
              <div
                class="col-4 col-sm-4 text-right"
                v-if="this.$root.user.nickname != myclanInfo.manager_nickname"
              >
                <button @click="outClan(uuid)" class="btn btn-dark btn-xs">탈퇴하기</button>
              </div>
              <div class="col-4 col-sm-4 text-center">
                <!-- <router-link to="/clan/board" class="btn btn-dark btn-xs">클랜게시판</router-link> -->
              </div>
              <div class="col-4 col-sm-4 text-right">
                <router-link to="/clan" class="btn btn-dark btn-xs">클랜목록</router-link>
              </div>
            </div>
            <table class="tbs02 mt-2" style="width:100%;" v-if="master">
              <colgroup>
                <col width="*" />
              </colgroup>
              <thead>
                <tr>
                  <th class="first">클랜원</th>
                </tr>
              </thead>
              <tbody v-for="clanP in clanpeoples">
                <tr>
                  <td class="first ta_l" v-if="clanP.is_manager === 0">
                    <div class="row">
                      <div class="col-6 col-sm-6 pt-2">{{clanP.nickname}}</div>
                      <div v-if="myclan.nick_name === myclanInfo.manager_nickname">
                        <button
                          class="btn btn-danger btn-xs pull-right"
                          @click="kickMember(clanP.user_id)"
                        >강제탈퇴</button>
                        <button
                          class="btn btn-dark btn-xs pull-right mr-1"
                          @click="mandateMaster(clanP.user_id,clanP.nickname)"
                        >클랜장위임</button>
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
              <thead>
                <tr>
                  <th class="first">승인대기목록</th>
                </tr>
              </thead>
              <tbody v-if v-for="chosemember in chosedClanMember">
                <tr>
                  <td class="first ta_l">
                    <div class="row">
                      <div class="col-6 col-sm-6 pt-2">{{chosemember.nickname}}</div>
                      <div v-if="myclan.nick_name === myclanInfo.manager_nickname">
                        <button
                          class="btn btn-danger btn-xs pull-right"
                          @click="agreementClan(chosemember.user_id)"
                        >승인</button>
                        <button
                          class="btn btn-dark btn-xs pull-right mr-1"
                          @click="dellClanMember(chosemember.user_id)"
                        >거절</button>
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
            <table class="tbs02 mt-2" style="width:100%;" v-else>
              <colgroup>
                <col width="*" />
              </colgroup>
              <thead>
                <tr>
                  <th class="first">클랜원</th>
                </tr>
              </thead>
              <tbody v-for="clanP in clanpeoples">
                <tr>
                  <td class="first ta_l" v-if="clanP.is_manager === 0">
                    <div class="row">
                      <div class="col-6 col-sm-6 pt-2">{{clanP.nickname}}</div>
                      <div v-if="myclan.nick_name === myclanInfo.manager_nickname">
                        <button
                          class="btn btn-danger btn-xs pull-right"
                          @click="kickMember(clanP.user_id)"
                        >강제탈퇴</button>
                        <button
                          class="btn btn-dark btn-xs pull-right mr-1"
                          @click="mandateMaster(clanP.user_id,clanP.nickname)"
                        >클랜장위임</button>
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
            <pagination :current="page" :totalCount="totalCount" class="paging1" />
          </div>
          <div v-else>활동중인 클랜이 없습니다.</div>
        </div>
      </section>
      <Footer />
    </div>
  </div>
</template>

<script>
import Header from "@/components/Header.vue";
import SideMenu from "@/components/SideMenu.vue";
import Footer from "@/components/Footer.vue";
import moment from "moment";
import Result from "@/utils/result";

export default {
  components: {
    Header,
    SideMenu,
    Footer
  },

  data() {
    return {
      totalCount: 0,
      myclan: [],
      myclanInfo: {},
      master: false,
      clanpeoples: [],
      clancheck: false,
      clanName: "",
      clanDiscription: "",
      clantotalCount: 0,
      chosedClanMember: [],
      uuid: 0,
      newDescription: ""
    };
  },

  computed: {
    page() {
      return this.$route.query.page || 1;
    }
  },

  methods: {
    createdAt(createdAt) {
      return moment(createdAt).format("YYYY-MM-DD");
    },

    view(id) {
      this.$router.push({ name: "freeview", params: { id: id } });
    },

    destroyClan() {
      if (this.clanpeoples.length !== 1) {
        alert(
          " 클랜원이 없어야 클랜을 폐쇄할 수 있습니다.\n 클랜원이 있다면 모두 강제 탈퇴 처리 후에 시도해 주세요"
        );
        return;
      } else {
        if (!confirm("정말 삭제하겠습니까?")) {
          return;
        }

        this.$axios
          .post(this.$Api2.clans.destroyClan, {
            clanid: this.myclanInfo.id,
            sessionid: this.$root.sessionId()
          })
          .then(response => {
            if (!response) {
              return;
            }
            this.$router.push({ name: "clantotal" });
          })
          .catch(error => {
            console.error(error);
          });
      }
    },
    changeDesc() {
      this.newDescription = document.getElementById("desc").value;
      if (this.newDescription.length > 40) {
        alert("클랜 소개 내용은 40자를 넘어갈 수 없습니다.");
        return;
      }
      this.$EventBus.$emit("loading-add", "changeDesc");
      this.$axios
        .post(this.$Api2.clans.changeDesc, {
          clanid: this.myclanInfo.id,
          desc: this.newDescription,
          sessionid: this.$root.sessionId()
        })
        .then(response => {
          this.$EventBus.$emit("loading-remove", "changeDesc");
          if (
            !response ||
            response.data.result === 9151 ||
            response.data.result === 1
          ) {
            alert("수정에 실패하였습니다.");
            console.log(response.data.result);
            return;
          } else if (response.data.result === 9186) {
            alert("클랜 소개 내용은 40자를 넘어갈 수 없습니다.");
            return;
          } else if (response.data.result === 10303) {
            alert(
              response.data.word +
                "은(는) 사용할 수 없습니다.\n올바르게 수정 후 다시 등록해주세요."
            );
            return;
          } else {
            this.$router.push("my");
            this.$router.go();
            alert("수정이 완료되었습니다.");
          }
        })
        .catch(error => {
          console.log(error);
          this.$EventBus.$emit("loading-remove", "changeDesc");
        });
    },
    loadClanInfo() {
      this.$axios
        .post(this.$Api2.clans.getMyClan, { sessionid: this.$root.sessionId() })
        .then(response => {
          if (response.data.result === 2) {
            this.clancheck = false;
            return;
          }
          if (!response) {
            return;
          }
          this.myclanInfo = response.data.MyClanInfo[0];
          this.clanpeoples = response.data.myclanMember;

          this.loadChosedClanInfo();
          localStorage.setItem("clanId", this.myclanInfo.id);
          localStorage.setItem("clanName", this.myclanInfo.name);

          if (response.data.MyClanInfo[0].manager_id === response.data.uuid) {
            this.master = true;
          } else {
            this.master = false;
          }

          if (this.myclanInfo.name === null) {
            this.clancheck = false;
          } else {
            this.clancheck = true;
          }
          this.clancheck = true;
        })
        .catch(error => {
          this.clanCheck = false;
          console.error(error);
        });
    },
    postAllClan() {
      this.$axios
        .post(this.$Api2.clans.getClans, { sessionid: this.$root.sessionId() })
        .then(response => {
          this.totalCount = response.data.TotalCount;
          if (!response || response.data.code != 1) {
            return;
          }
        })
        .catch(error => {
          console.error(error);
        });
    },
    getUserClan() {
      this.$axios
        .post(this.$Api2.userinfo.getuserinfo, {
          session_id: this.$root.sessionId()
        })
        .then(response => {
          if (!response) {
            return;
          }
          if (response.data !== null) {
            this.myclan = response.data;
            this.uuid = response.data.uuid;
            localStorage.setItem("uuid", this.uuid);

            this.clancheck = true;
          }
          if (this.myclan.name === null) {
            this.clancheck = false;
          } else {
            this.clancheck = true;
          }
          this.loadClanInfo();
        })
        .catch(error => {
          console.log(error);
          alert("잘못된 접근 입니다.");
          this.$router.push({ name: "home" });
        });
    },
    agreementClan(userid) {
      this.$axios
        .post(this.$Api2.clans.clanAgree, {
          userid: userid,
          clanid: this.myclanInfo.id,
          sessionid: this.$root.sessionId()
        })
        .then(response => {
          if (!response) {
            return;
          }
          this.$router.go();
        })
        .catch(error => {
          console.log(error);
        });
    },

    loadChosedClanInfo() {
      this.$axios
        .post(this.$Api2.clans.chosedClan, { id: this.myclanInfo.id })
        .then(response => {
          if (!response) {
            return;
          }
          this.chosedClanMember = response.data[0].wanab_memberinfo;
        })
        .catch(error => {
          console.log(error);
        });
    },
    kickMember(userid) {
      if (!confirm("정말 탈퇴하시겠습니까?")) {
        return;
      }
      this.$axios
        .post(this.$Api2.clans.kickMemverClan, {
          userid: userid,
          clanid: this.myclanInfo.id,
          sessionid: this.$root.sessionId()
        })
        .then(response => {
          if (!response) {
            return;
          }
          if (!response || response.data.result === 9151) {
            alert("클랜 탈퇴에 실패하였습니다.");
            console.log(response.data.result);
            return;
          } else if (response.data.result === 1) {
            alert("클랜장은 클랜을 탈퇴할 수 없습니다.");
          } else {
            this.$router.push("/clan/my");
            alert("클랜 탈퇴가 완료되었습니다.");
            this.$router.go();
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    outClan(id) {
      if (!confirm("정말 탈퇴하시겠습니까?")) {
        return;
      }
      this.$EventBus.$emit("loading-add", "outClan");
      this.$axios
        .post(this.$Api2.clans.kickMemverClan, {
          userid: id,
          clanid: this.myclanInfo.id,
          sessionid: this.$root.sessionId()
        })
        .then(response => {
          this.$EventBus.$emit("loading-remove", "outClan");
          if (!response || response.data.result === 9151) {
            alert("클랜 탈퇴에 실패하였습니다.");
            console.log(response.data.result);
            return;
          } else {
            this.$router.push("/clan");
            alert("클랜 탈퇴가 완료되었습니다.");
          }
        })
        .catch(error => {
          console.log(error);
          this.$EventBus.$emit("loading-remove", "outClan");
        });
    },
    mandateMaster(id, nick) {
      if (!confirm("정말 위임 하시겠습니까?")) {
        return;
      }
      this.$EventBus.$emit("loading-add", "mandateMaster");
      this.$axios
        .post(this.$Api2.clans.exchangeManager, {
          from_id: this.myclanInfo.manager_id,
          to_id: id,
          to_nick: nick,
          clan_id: this.myclanInfo.id,
          sessionid: this.$root.sessionId()
        })
        .then(response => {
          this.$EventBus.$emit("loading-remove", "mandateMaster");
          if (!response || response.data.result === 9151) {
            alert("클랜장 위임에 실패하였습니다.");
            console.log(response.data.result);
            return;
          } else {
            this.$router.push("/clan");
            alert("클랜장 위임이 완료되었습니다.");
          }
        })
        .catch(error => {
          console.log(error);
          this.$EventBus.$emit("loading-remove", "mandateMaster");
        });
    },

    changeManager(id, nick) {
      this.$axios
        .post(this.$Api2.clans.exchangeManager, {
          from_id: this.myclanInfo.manager_id,
          to_id: to_id,
          to_nick: to_nickname,
          clan_id: this.myclanInfo.id,
          sessionid: this.$root.sessionId()
        })
        .then(response => {
          if (!response) {
            return;
          }
          this.$router.go();
        })
        .catch(error => {
          console.log(error);
        });
    },
    dellClanMember(userid) {
      this.$axios
        .post(this.$Api2.clans.denyMember, {
          userid: userid,
          clanid: this.myclanInfo.id,
          sessionid: this.$root.sessionId()
        })

        .then(response => {
          if (!response) {
            return;

            this.$router.go();
          }
          this.$router.push("/clan/my");

          alert("가입 거절이 완료되었습니다.");
          this.$router.go();
        })
        .catch(error => {
          console.log(error);
        });
    }
  },
  created() {
    this.loadClanInfo();
    this.getUserClan();
    this.postAllClan();
  }
};
</script>
