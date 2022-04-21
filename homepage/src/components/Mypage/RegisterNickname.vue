<template>
  <div id="register-nickname" class="content">
    <div class="nickname-container">
      <div class="nickname-setting">
        <div class="icon-wrapper">
          <img src="/images/icon_check_circle_violet.png" alt="체크" />
        </div>
        <div>
          <h5>게임 닉네임 설정</h5>
          <p>
            말랑말랑 연동이 되었습니다.
            <br />한컴타자연습에서 사용할 고유한 닉네임을 설정해주세요
          </p>
        </div>
      </div>
      <form class="input-container" @submit.prevent="submit">
        <label for="nickname">닉네임 :</label>
        <input
          style="font-size : 14px"
          id="nickname"
          v-model.trim="nickname"
          type="text"
          placeholder="실명은 사용하지 않는 것이 좋습니다."
        />
        <button title="중복확인" v-if="! isConfirmed">중복확인</button>
        <button title="저장" v-else>저장</button>
      </form>
      <p class="description">* 닉네임은 2~8자의 한글, 영어, 숫자로만 설정해주세요.</p>
    </div>
  </div>
</template>

<script>
import Result from "../../utils/result";

export default {
  data() {
    return {
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
        alert(response.data.word + "은(는) 닉네임으로 사용할 수 없습니다.");
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
      if (!this.isConfirmed) {
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
        .catch(err => {
          alert("서버와의 통신에 오류가 있습니다.");
        });
    }
  }
};
</script>