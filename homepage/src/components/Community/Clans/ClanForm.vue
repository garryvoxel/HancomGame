<template>
  <div id="clan-form">
    <nav class="tab-rounded">
      <ul>
        <li :class="{ selected : $route.name === 'clan-create' }">
          <router-link :to="{ name: 'clans' }" title="전체 클랜">
            <span class="tab-icon icon-group"></span>
            <span>클랜 만들기</span>
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

    <!--클랜만들기 -->
    <form v-on:submit.prevent="submit">
      <table class="clan-form-table">
        <tr>
          <th>클랜 이름</th>
          <td class="clan-name">
            <input type="text" ref="name" v-model="name" placeholder="클랜이름을 입력합니다." />
          </td>
        </tr>
        <tr>
          <th>클랜 소개</th>
          <td class="clan-description">
            <textarea
              ref="description"
              v-model="description"
              rows="10"
              placeholder="클랜을 소개할 내용을 입력합니다. 40자 이내로 입력해주세요."
              class="inputstb01 w_100p"
            ></textarea>
          </td>
        </tr>
      </table>
      <div class="clan-form-buttons">
        <button class="button-rounded-red" @click.prevent="submit">등록</button>
        <button v-on:click.prevent="$router.go(-1)" class="button-rounded-gray">취소</button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      name: "",
      description: "",
      isSaving: false
    };
  },

  methods: {
    submit() {
      //클랜이름과 소개 내용에 대한 validation 체크
      if (this.isSaving) {
        return;
      } else if (!this.name) {
        alert("클랜이름을 입력해주세요.");
        this.$refs.name.focus();
        return;
      } else if (this.name.length > 16) {
        // this.$refs.name.focus()
        alert("클랜 이름은 16자를 넘어갈 수 없습니다.");
        return;
      } else if (!this.description) {
        alert("클랜 소개 내용을 입력해주세요.");
        this.$refs.description.focus();
        return;
      } else if (this.description.length > 40) {
        // this.$refs.description.focus()
        alert("클랜 소개 내용은 40자를 넘어갈 수 없습니다.");
        return;
      }

      this.isSaving = true;
      //서버에 post요청 보내기
      this.$axios
        .post(this.$Api2.clans.makeClan, {
          sessionid: this.$root.sessionId(),
          clanname: this.name,
          desc: this.description
        })
        .then(response => {
          console.log(response.data);

          this.isSaving = false;

          if (!response || response.data.result !== 0) {
            switch (response.data.result) {
              case 9184:
                alert("클랜을 생성하지 못했습니다.");
                return;
              case 9181:
                alert("이미 존재하는 클랜명입니다.");
                return;
              case 9186:
                alert("클랜 소개 내용은 40자를 넘어갈 수 없습니다.");
                return;
              case 10303:
                alert(
                  response.data.word +
                    "은(는) 사용할 수 없습니다.\n올바르게 수정 후 다시 등록해주세요."
                );
                return;
              case 10304:
                alert("특수문자는 사용할 수 없습니다.");
                return;
            }
          }

          alert("클랜을 생성하였습니다.");

          this.$router.push("/community/clans");
        })
        .catch(error => {
          this.isSaving = false;
          console.log(error);
        });
    }
  }
};
</script>