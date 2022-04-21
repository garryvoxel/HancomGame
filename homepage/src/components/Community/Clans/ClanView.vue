<template>
  <div id="clan-view">
    <nav class="tab-rounded">
      <ul>
        <li :class="{ selected : $route.name === 'clan-view' }">
          <router-link :to="{ name: 'clans' }" title="전체 클랜">
            <span class="tab-icon icon-group"></span>
            <span>클랜 정보</span>
          </router-link>
        </li>
        <!-- <li :class="{ selected : $route.name === 'my-clan' }">
                    <router-link :to="{ name: 'my-clan' }" title="내 클랜">
                        <span class="tab-icon icon-me"></span>
                        <span>내 클랜</span>
                    </router-link>
        </li>-->
      </ul>
    </nav>
    <table class="clan-view-table master" v-if="clanInfo">
      <tr>
        <th>클랜명</th>
        <td>{{clanInfo.name}}</td>
      </tr>
      <tr>
        <th>클랜 소개</th>
        <td>{{clanInfo.description}}</td>
      </tr>
      <tr>
        <th>클랜장</th>
        <td>{{clanInfo.manager_nickname}}</td>
      </tr>
      <tr>
        <th>클랜원</th>
        <td class="members">
          <ul class="member-list">
            <li v-for="member in members">
              <div class="avatar">
                <avatar-image :index="member.avatar" />
              </div>
              <div class="info">
                <div class="nickname">{{member.nickname}}</div>
              </div>
            </li>
          </ul>
        </td>
      </tr>
    </table>
    <div class="button-container" v-if="clanInfo">
      <!-- <button class="button-rounded-red" v-if="isClan === false" @click="denyWanbMember(clanId)">신청취소</button> -->
      <button class="button-rounded-gray" @click.prevent="$router.go(-1)">나가기</button>
    </div>
  </div>
</template>

<script>
import { constants } from "crypto";
export default {
  data() {
    return {
      clan: null,
      myClan: null,
      clanInfo: null,
      members: null,
      clanId: null,
      isClan: false
    };
  },

  methods: {
    loadClan() {
      this.$EventBus.$emit("loading-add", "loadClan");
      this.$axios
        .post(this.$Api2.clans.getSelectedClan, { id: this.id })
        .then(response => {
          //console.log(response.data)
          this.$EventBus.$emit("loading-remove", "loadClan");
          if (!response) {
            return;
          }
          this.clan = response.data[0];
          this.clanInfo = this.clan.claninfo[0];
          this.members = this.clan.memberinfo;
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
          //console.log(response.data);
          this.$EventBus.$emit("loading-remove", "getMyClan");
          if (!response) {
            return;
          } else if (response.data.result === 2) {
            return;
          } else {
            this.isClan = true;
          }
          this.myClan = response.data.MyClanInfo[0].id;
          //console.log('this.myClan :: ');
          //console.log(this.myClan);
        })
        .catch(error => {
          console.log(error);
          this.$EventBus.$emit("loading-remove", "getMyClan");
        });
    },

    signUpClan() {
      if (this.myClan !== null) {
        alert(
          "클랜은 중복 가입할 수 없습니다.\n탈퇴나 폐쇄를 먼저 진행해 주세요."
        );
      } else {
        if (this.$root.isLoggedIn()) {
          if (!confirm("클랜에 가입하시겠습니까?")) {
            return;
          }
          //TODO ::: 여기에서 클랜 가입처리...
          this.$axios
            .post(this.$Api2.clans.signUpClan, {
              sessionid: this.$root.sessionId(),
              clanid: this.clanInfo.id
            })
            .then(response => {
              if (!response || response.data.result != 0) {
                alert("가입요청에 실패하였습니다.");
              } else {
                alert("가입요청이 완료되었습니다.");
              }
            });
        } else {
          alert("로그인이 필요합니다.");
        }
      }
    },
    back() {
      this.$router.go(-1);
    }
  },

  computed: {
    id() {
      return this.$route.params.id;
    }
  },

  created() {
    this.loadClan();
  }
};
</script>