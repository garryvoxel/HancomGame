<template>
  <div class="page-container">
    <div class="page-wrapper mypagenick">
      <Header/>
      <SideMenu />
      <section class="main-content">
        <header class="page-header">
          <h1 class="page-title">게임 닉네임 설정</h1>
        </header>
        <div class="sub-wrap p-3">
          <div id="tab1" class="tabcontent current">
            <h4 class="pg_tit1 mt-5 text-center">닉네임설정</h4>
            <p>말랑말랑연동되었습니다.</p>
            <p>한컴타자연습에서 사용할 닉네임을 설정하세요.</p>
            <table class="tbs02 mt-2" style="width:100%;">
              <colgroup>
                <col width="20%" />
                <col width="*" />
                <col width="20%" />
              </colgroup>
              <tbody>
                <tr>
                  <th class="tit">닉네임</th>
                  <td>
                    <span class="nickArea">
                      <input
                        type="text"
                        class="inputType"
                        name
                        id="nickname"
                        v-model.trim="nickname"
                        placeholder="닉네임 입력"
                      />
                    </span>
                  </td>
                  <td>
                    <button class="btn btn-dark btn-xs" @click="submit">중복확인</button>
                  </td>
                </tr>
              </tbody>
            </table>
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
import Result from "@/utils/result";

export default {
  components: {
    Header,
    SideMenu,
    Footer
  },

  data() {
    return {
      show: false,
      activetab: 1,
      tabName1: "current w_50p",
      tabName2: "w_50p",
      nickname: "",
      isConfirmed: false,
      isLoading: false
    };
  },
  watch: {
    nickname() {
      this.isConfirmed = false;
    }
  },

  methods: {
    submit() {
      if (this.isConfirmed) {
        this.registerNickname();
      } else {
        this.confirmNicknameDuplication();
      }
    },

    responseCodeCheck(response) {
      if (!response) {
        alert("네트워크 연결을 확인해주세요.");
        return false;
      } else if (response.data.code === Result.NICKNAME_WITH_BAD_WORD.code) {
        alert(response.data.word + '은(는) 닉네임으로 사용할 수 없습니다.');
        return false;
      } else if (response.data.code === Result.OK.code) {
        alert(
          "동일한 닉네임을 가진 유저가  있습니다.\n다른 닉네임으로 다시 시도해 주세요."
        );
        return false;
      } else if (response.data.code === Result.NICKNAME_IS_TOO_SHORT.code) {
        alert("닉네임은 2글자 이상이어야 합니다.");
        return false;
      } else if (response.data.code === Result.NICKNAME_IS_TOO_LONG.code) {
        alert("닉네임은 8자 이하여야 합니다.");
        return false;
      } else if (
        response.data.code === Result.NICKNAME_HAS_DISALLOWED_CHARACTER.code
      ) {
        alert("닉네임은 한글, 영어, 숫자 2~8자로 설정해야 합니다.");
        return false;
      }

      if (response.data.code !== Result.UNKNOWN_NICKNAME.code) {
        alert(`오류가 발생하였습니다(Error code: ${response.data.message})`);
        return false;
      }

      return true;
    },

    confirmNicknameDuplication() {
      if (!this.nickname) {
        alert("닉네임을 입력해주세요.");
        return;
      }
      this.$axios
        .get(
          this.$Api.updateMe +
            "?nickname=" +
            encodeURIComponent(this.nickname) +
            "&token=" +
            this.$root.generateUid(12),
          this.$root.bearerHeaders()
        )
        .then(response => {
          this.isLoading = false;

          if (this.responseCodeCheck(response) !== true) {
            return;
          }

          this.isConfirmed = true;

          if (
            confirm(
              `'${this.nickname}'은(는) 사용가능합니다. 사용하시겠습니까?`
            )
          ) {
            this.registerNickname();
          }
        })
        .catch(error => {
          console.log(error);
          this.isLoading = false;
        });
    },

    registerNickname() {
      if (this.isConfirmed === false) {
        alert("닉네임 중복확인을 먼저 해주세요.");
        return;
      }

      this.$axios
        .post(
          this.$Api.me,
          {
            nickname: this.nickname
          },
          this.$root.bearerHeaders()
        )
        .then(response => {
          if (!response || response.data.code !== 1) {
            alert(`서버와의 통신에 오류가 있습니다(${response.data.code}).`);
          }

          window.location.href = "/";
        })
        .catch(error => {
          console.log(error);
          alert("서버와의 통신에 오류가 있습니다.");
        });
    },
    tab1: function() {
      this.tabName1 = "current w_50p";
      this.tabName2 = "w_50p";
      this.activetab = 1;
    },

    tab2: function() {
      this.tabName1 = "w_50p";
      this.tabName2 = "current w_50p";
      this.activetab = 2;
    }
  }
};
</script>
<style>
.inputType {
  height: 35px;
  line-height: 35px;
  box-sizing: border-box;
  width: 90%;
  text-align: center;
  border: 3px #333;
  display: inline-block;
}
.nickArea {
  width: 100%;
  display: inline-block;
  border: 1px #dddddd solid;
  box-sizing: border-box;
  padding: 0 30px;
}
</style>
