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
            <li>
              <div>
                <router-link to="/clan/my" style="color : black;">내 클랜</router-link>
              </div>
            </li>
            <li>
              <div>
                <router-link style="color : black;" to="/clan/make">클랜만들기</router-link>
                <span></span>
              </div>
            </li>
          </ul>
          <div class="claninfo">
            <table class="tbs02 mt-2" style="width:100%;">
              <colgroup>
                <col width="20%" />
                <col width="*" />
              </colgroup>
              <tbody v-if="clan !==null">
                <tr>
                  <th class="tit">클랜명</th>
                  <td class="ta_l">{{clanInfo.name}}</td>
                </tr>
                <tr>
                  <th class="tit">클랜소개</th>
                  <td class="ta_l">
                    <div readonly name="name" rows="8" style="width:100%;">{{clanInfo.description}}</div>
                    <!-- <button class="btn btn-dark btn-xs mt-1">저장</button>-->
                  </td>
                </tr>
                <tr>
                  <th class="tit">클랜장</th>
                  <td class="ta_l">{{clanInfo.manager_nickname}}</td>
                </tr>
              </tbody>
            </table>
            <div class="row mt-2">
              <div class="col-4 col-sm-4 text-left" v-if="myClan === 'NoClan'">
                <button class="btn btn-danger btn-xs" @click="signinClan(clan.id)">가입하기</button>
              </div>
              <!--<div class="col-4 col-sm-4 text-center">
                                <router-link to="/clan/board" class="btn btn-dark btn-xs" >클랜게시판</router-link>
              </div>-->
              <div class="col-4 col-sm-4 text-right">
                <router-link to="/clan" class="btn btn-dark btn-xs">클랜목록</router-link>
              </div>
            </div>

            <table class="tbs02 mt-2" style="width:100%;" v-if="clan!==null">
              <colgroup>
                <col width="*" />
              </colgroup>
              <thead>
                <tr>
                  <th class="first">클랜원</th>
                </tr>
              </thead>
              <tbody v-for="clanP in members">
                <tr>
                  <td class="first ta_l">
                    <div class="row">
                      <div class="col-6 col-sm-6 pt-2">{{clanP.nickname}}</div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
            <!-- <pagination :current="page" :totalCount="totalCount" class="paging1"/>-->
          </div>
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
  data() {
    return {
      clan: null,
      clanInfo: null,
      members: null,
      myClan: null
    };
  },

  components: {
    Header,
    SideMenu,
    Footer
  },

  created() {
    this.loadClan();
  },

  computed: {
    id() {
      return this.$route.params.id;
    }
  },

  methods: {
    loadClan() {
      this.$EventBus.$emit("loading-add", "loadClan");
      this.$axios
        .post(this.$Api2.clans.chosedClan, { id: this.id })
        .then(response => {
          //console.log(response.data)
          this.$EventBus.$emit("loading-remove", "loadClan");
          if (!response) {
            return;
          }
          this.clan = response.data[0];
          this.clanInfo = this.clan.claninfo[0];
          this.members = this.clan.memberinfo;
          this.myClan = response.data[0].wanabClan;
          this.loadMyClan();
        })
        .catch(error => {
          console.log(error);
          this.$EventBus.$emit("loading-remove", "loadClan");
        });
    },

    loadMyClan() {
      this.$EventBus.$emit("loading-add", "getMyClan");
      this.$axios
        .post(this.$Api2.clans.getMyClan, { sessionid: this.$root.sessionId() })
        .then(response => {
          this.$EventBus.$emit("loading-remove", "getMyClan");
          if (!response) {
            return;
          } else if (response.data.result === 2) {
            return;
          } else {
            this.clanCheck = true;
          }
        })
        .catch(error => {
          console.log(error);
          this.$EventBus.$emit("loading-remove", "getMyClan");
        });
    },

    back() {
      this.$router.go(-1);
    },

    signinClan(id) {
      this.$axios
        .post(this.$Api2.clans.signinClan, {
          sessionid: this.$root.sessionId(),
          clanid: id
        })
        .then(response => {
          if (response.data.result == 9154) {
            alert("이미 가입한 클랜이 있습니다");
            return;
          }
          if (!response || response.data.result != 0) {
            alert("가입요청에 실패하였습니다.");
          } else {
            alert("가입요청이 완료되었습니다.");
            this.clanCheck = true;
          }
        })
        .catch(error => {
          console.error(error);
        });
    }
  }
};
</script>
