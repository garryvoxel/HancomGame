<template>
  <div id="my-clan">
    <nav class="tab-rounded">
      <ul>
        <li :class="{ selected : $route.name === 'clans' }">
          <router-link :to="{ name: 'clans' }" title="전체 클랜">
            <span class="tab-icon icon-group"></span>
            <span>전체 클랜</span>
          </router-link>
        </li>
        <li :class="{ selected : $route.name === 'my-clan' }">
          <router-link :to="{ name: 'my-clan' }" title="내 클랜">
            <span class="tab-icon icon-me"></span>
            <span>내 클랜</span>
          </router-link>
        </li>
      </ul>
    </nav>

    <div>
      <table class="clan-table" v-if="!isMaster">
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
        <tbody v-if="myClan">
          <tr>
            <td class="clan">
              <div class="clan-name">{{myClan.name}}</div>
              <div class="clan-description">{{myClan.description}}</div>
            </td>
            <td class="master">{{myClan.manager_nickname}}</td>
            <td class="member-count">{{myClan.member_count}}</td>
            <td class="info">
              <!-- <div>
                                <button class="button-rounded-gray-small">클랜 정보</button>
              </div>-->
              <div>
                <router-link
                  :to="{ name: 'clan-view', params: { id: myClan.id } }"
                  class="button-rounded-gray-small"
                >클랜 정보</router-link>
              </div>
            </td>
            <td class="join">
              <div class="join-completed">
                <div v-if="myClan.id">
                  <img src="/images/icon_check.png" alt="체크" />
                  <div>가입완료</div>
                </div>
                <div v-else>
                  <div>승인대기</div>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <table class="clan-view-table master" v-if="!isMaster && myClan">
        <tr>
          <th>클랜명</th>
          <td>
            <div class="clan-name-container">
              <div class="clan-name">{{myClan.name}}</div>
              <!-- <button class="button-rounded-blue" @click="goToClanForum">클랜 게시판 가기</button> -->
            </div>
          </td>
        </tr>
        <tr>
          <th>클랜 소개</th>
          <td>{{myClan.description}}</td>
        </tr>
        <tr>
          <th>클랜장</th>
          <td>{{myClan.manager_nickname}}</td>
        </tr>
        <tr>
          <th>클랜원</th>
          <td class="members">
            <ul class="member-list">
              <li v-bind:key="member.nickname" v-for="member in myClanMembers">
                <div class="avatar">
                  <avatar-image :index="2" />
                </div>
                <div class="info">
                  <div class="nickname">{{member.nickname}}</div>
                </div>
              </li>
            </ul>
          </td>
        </tr>
      </table>
      <div id="clan-view">
        <div class="button-container" v-if="!isMaster">
          <button class="button-rounded-red" @click="outClan(uuid)">탈퇴하기</button>
        </div>
      </div>
      <!-- <div class="pendings" v-if="isMaster">
                <div class="pending-title">신청목록</div>
                <ul class="pending-list">
                    <li>
                        <div class="avatar">
                            <avatar-image :index="3"/>
                        </div>
                        <div class="info">
                            <div class="nickname">닉네임</div>
                            <div class="level">LV. 32</div>
                        </div>
                        <button class="button-rounded-navy">신청삭제</button>
                    </li>
                </ul>
      </div>-->

      <table class="clan-view-table master" v-if="isMaster">
        <tr>
          <th>클랜명</th>
          <td>
            <div class="clan-name-container">
              <div class="clan-name">{{myClan.name}}</div>
              <!-- <button class="button-rounded-blue" @click="goToClanForum">클랜 게시판 가기</button> -->
            </div>
          </td>
        </tr>
        <tr>
          <th>클랜 소개</th>
          <td>
            <div class="clan-description-container">
              <textarea id="desc">{{ myClan.description }}</textarea>
              <button class="button-save" @click="changeDesc">저장</button>
            </div>
          </td>
        </tr>
        <tr>
          <th>클랜장</th>
          <td>{{myClan.manager_nickname}}</td>
        </tr>
        <tr>
          <th>클랜원</th>
          <td class="members">
            <ul class="member-list menu">
              <li v-bind:key="myMember.user_id" v-for="myMember in myClanMembers">
                <div class="avatar">
                  <avatar-image :index="myMember.avatar" />
                </div>
                <div class="info">
                  <div class="nickname">{{myMember.nickname}}</div>
                </div>

                <button
                  v-if="myMember.is_manager === 0"
                  class="button-rounded-navy delegate"
                  @click="mandateMaster(myMember.user_id, myMember.nickname)"
                >클랜장 위임</button>
                <button
                  v-if="myMember.is_manager === 0"
                  class="button-rounded-red kickout"
                  @click="outClan(myMember.user_id)"
                >강제탈퇴</button>
                <button v-if="myMember.is_manager === 1" class="button-rounded-gray-small">클랜장</button>
              </li>
            </ul>
          </td>
        </tr>
        <tr>
          <th>
            클랜원
            <br />승인대기
          </th>
          <td class="members">
            <ul class="member-list menu" v-if="isWanb">
              <li v-bind:key="member.user_id" v-for="member in wabMembers">
                <div class="avatar">
                  <avatar-image :index="member.avatar" />
                </div>
                <div class="info">
                  <div class="nickname">{{member.nickname}}</div>
                </div>
                <button class="button-rounded-navy accept" @click="acceptMember(member.user_id)">승인</button>
                <button class="button-rounded-red decline" @click="denyMember(member.user_id)">거절</button>
              </li>
            </ul>
            <ul v-else>승인 대기자가 없습니다.</ul>
          </td>
        </tr>
        <tr>
          <th>클랜 폐쇄</th>
          <td>
            <div class="clan-close-container">
              <button class="button-rounded-red" @click="destroyClan">폐쇄하기</button>
              <span>
                * 클랜원이 없어야 클랜을 폐쇄할 수 있습니다.
                <br />클랜원이 있다면 모두 강제 탈퇴 처리 후에 시도해 주세요.
              </span>
            </div>
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  data() { //변수 초기화
    return {
      isMaster: false,
      myClan: null,
      clans: { total: 0 },
      myClanMembers: [],
      uuid: 0,
      wabMembers: null,
      newDescription: "",
      isWanb: false,
      sessionid: "",
      myClanId: 0
    };
  },

  methods: {
    getMyClan() { //내 클랜 가져오기
      this.$EventBus.$emit("loading-add", "getMyClan");

      this.sessionid = this.$root.sessionId();
      this.$axios
        .post(this.$Api2.clans.getMyClan, { sessionid: this.sessionid })
        .then(response => {
          if (!response) {
            return;
          }
          this.myClan = response.data.MyClanInfo[0];
          this.myClanId = this.myClan.id;
          this.uuid = response.data.uuid;
          localStorage.setItem("uuid", this.uuid);
          if (response.data.MyClanInfo[0].manager_id === response.data.uuid) {
            this.isMaster = true;
          } else {
            this.isMaster = false;
          }
          this.myClanMembers = response.data.myclanMember;
          //console.log(this.myClanMembers);
          this.$EventBus.$emit("loading-remove", "getMyClan");
          this.getWanbMembers();
        })
        .catch(error => {
          console.log(error);
          this.$EventBus.$emit("loading-remove", "getMyClan");
          alert("잘못된 접근 입니다.");
          this.$router.push({ name: "home" });
          return;
        });
    },

    getWanbMembers() {
      this.$EventBus.$emit("loading-add", "getWanbMembers");
      this.$axios
        .post(this.$Api2.clans.getWabMembers, { id: this.myClan.id })
        .then(response => {
          if (!response) {
            return;
          }
          this.wabMembers = response.data[0].wanab_memberinfo;
          if (this.wabMembers.length > 0) {
            this.isWanb = true;
          }
          this.$EventBus.$emit("loading-remove", "getWanbMembers");
        })
        .catch(error => {
          console.log(error);
          this.$EventBus.$emit("loading-remove", "getWanbMembers");
        });
    },

    outClan(id) { //클랜 탈퇴하기
      if (!confirm("정말 탈퇴하시겠습니까?")) {
        return;
      }
      this.$EventBus.$emit("loading-add", "outClan");
      this.$axios
        .post(this.$Api2.clans.deleteMember, {
          userid: id,
          clanid: this.myClan.id,
          sessionid: this.$root.sessionId()
        })
        .then(response => {
          this.$EventBus.$emit("loading-remove", "outClan");
          if (!response || response.data.result === 9151) {
            alert("클랜 탈퇴에 실패하였습니다.");
            console.log(response.data.result);
            return;
          } else if (response.data.result === 1) {
            alert("클랜장은 클랜을 탈퇴할 수 없습니다.");
          } else {
            this.$router.push("/community/clans");
            alert("클랜 탈퇴가 완료되었습니다.");
            this.$router.go();
          }
        })
        .catch(error => {
          console.log(error);
          this.$EventBus.$emit("loading-remove", "outClan");
        });
    },

    destroyClan() { //클랜 폐쇄하기
      if (this.myClanMembers.length !== 1) {
        alert(
          " 클랜원이 없어야 클랜을 폐쇄할 수 있습니다.\n 클랜원이 있다면 모두 강제 탈퇴 처리 후에 시도해 주세요"
        );
        return;
      } else {
        if (!confirm("정말 삭제하겠습니까?")) {
          return;
        }
        //TODO :::  여기에 삭제 함수 호출...
        this.$EventBus.$emit("loading-add", "destroyClan");
        this.$axios
          .post(this.$Api2.clans.deleteClan, {
            clanid: this.myClan.id,
            sessionid: this.$root.sessionId()
          })
          .then(response => {
            this.$EventBus.$emit("loading-remove", "destroyClan");
            if (!response || response.data.result === 9151) {
              alert("클랜 폐쇄에 실패하였습니다.");
              console.log(response.data.result);
              return;
            } else {
              this.$router.push("/community/clans");
              alert("클랜 폐쇄가 완료되었습니다.");
              this.$router.go();
            }
          })
          .catch(error => {
            console.log(error);
            this.$EventBus.$emit("loading-remove", "destroyClan");
          });
      }
    },

    mandateMaster(id, nick) { //클랜장 위임하기
      if (!confirm("정말 위임 하시겠습니까?")) {
        return;
      }
      this.$EventBus.$emit("loading-add", "mandateMaster");
      this.$axios
        .post(this.$Api2.clans.mandateMaster, {
          from_id: this.uuid,
          to_id: id,
          to_nick: nick,
          clan_id: this.myClan.id,
          sessionid: this.$root.sessionId()
        })
        .then(response => {
          this.$EventBus.$emit("loading-remove", "mandateMaster");
          if (!response || response.data.result === 9151) {
            alert("클랜장 위임에 실패하였습니다.");
            console.log(response.data.result);
            return;
          } else {
            this.$router.push("/community/clans/my");
            alert("클랜장 위임이 완료되었습니다.");
            this.$router.go();
          }
        })
        .catch(error => {
          console.log(error);
          this.$EventBus.$emit("loading-remove", "mandateMaster");
        });
    },

    acceptMember(id) { //멤버 승인하기
      if (!confirm("가입 승인 하시겠습니까?")) {
        return;
      }
      this.$EventBus.$emit("loading-add", "acceptMember");
      this.$axios
        .post(this.$Api2.clans.acceptMember, {
          userid: id,
          clanid: this.myClan.id,
          sessionid: this.$root.sessionId()
        })
        .then(response => {
          this.$EventBus.$emit("loading-remove", "acceptMember");
          if (
            !response ||
            response.data.result === 9151 ||
            response.data.result === 1
          ) {
            alert("가입 승인에 실패하였습니다.");
            console.log(response.data.result);
            return;
          } else if (response.data.result === 9182) {
            alert("다른 클랜에 가입되어 가입 승인을 할 수 없습니다.");
          } else {
            this.$router.push("/community/clans/my");

            alert("가입 승인이 완료되었습니다.");
            this.$router.go();
          }
        })
        .catch(error => {
          console.log(error);
          this.$EventBus.$emit("loading-remove", "acceptMember");
        });
    },

    denyMember(id) { //가입 거절하기
      if (!confirm("가입 거절을 하시겠습니까?")) {
        return;
      }
      this.$EventBus.$emit("loading-add", "denyMember");
      this.$axios
        .post(this.$Api2.clans.denyMember, {
          userid: id,
          clanid: this.myClan.id,
          sessionid: this.$root.sessionId()
        })
        .then(response => {
          //console.log(response.data);
          this.$EventBus.$emit("loading-remove", "denyMember");
          if (
            !response ||
            response.data.result === 9151 ||
            response.data.result === 1
          ) {
            alert("가입 거절에 실패하였습니다.");
            console.log(response.data.result);
            return;
          } else {
            this.$router.push("/community/clans/my");

            alert("가입 거절이 완료되었습니다.");
            this.$router.go();
          }
        })
        .catch(error => {
          console.log(error);
          this.$EventBus.$emit("loading-remove", "denyMember");
        });
    },

    changeDesc() { //클랜 소개 내용 변경하기
      this.newDescription = document.getElementById("desc").value;
      if (this.newDescription.length > 40) {
        alert("클랜 소개 내용은 40자를 넘어갈 수 없습니다.");
        return;
      }
      this.$EventBus.$emit("loading-add", "changeDesc");

      this.$axios
        .post(this.$Api2.clans.changeDesc, {
          clanid: this.myClan.id,
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
            this.$router.push("/community/clans/my");
            alert("수정이 완료되었습니다.");
          }
        })
        .catch(error => {
          console.log(error);
          this.$EventBus.$emit("loading-remove", "changeDesc");
        });
    },

    goToClanForum() { //클랜포럼으로 가기
      localStorage.setItem("clanId", this.myClan.id);
      localStorage.setItem("clanName", this.myClan.name);
      this.$router.push({
        name: "clan-forum",
        params: { clanId: this.myClan.id, clanName: this.myClan.name }
      });
    }
  },

  created() {
    this.getMyClan();
  }
};
</script>