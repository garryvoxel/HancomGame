<template>
  <div id="clan-form">
    <!--클랜만들기 -->
    <form v-on:submit.prevent="submit">
      <table class="tbs03 w_100p">
        <colgroup>
          <col width="150" />
          <col width="*" />
        </colgroup>
        <tr>
          <th>클랜 이름</th>
          <td>
            <input
              type="text"
              ref="name"
              v-model="name"
              placeholder="클랜이름을 입력합니다."
              class="inputstb01 w_100p"
            />
          </td>
        </tr>
        <tr>
          <th>클랜 소개</th>
          <td>
            <textarea
              ref="description"
              v-model="description"
              rows="20"
              placeholder="클랜을 소개할 내용을 입력합니다."
              class="inputstb01 w_100p"
            ></textarea>
          </td>
        </tr>
      </table>
      <div class="btn_zone">
        <button class="btn_blue">등록</button>
        <button v-on:click.prevent="back" class="btn_gray ml_10">취소</button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      action: this.$Api.createClan.uri,
      name: "",
      description: "",
      isSaving: false
    };
  },

  methods: {
    submit() {
      if (this.isSaving) {
        return;
      }

      if (!this.name) {
        alert("클랜이름을 입력해주세요.");
        this.$refs.name.focus();
        return;
      }

      if (!this.description) {
        alert("클랜 소개 내용을 입력해주세요.");
        this.$refs.description.focus();
        return;
      }

      this.isSaving = true;

      this.$axios
        .put(
          this.$Api.createClan,
          {
            name: this.name,
            description: this.description
          },
          this.$root.bearerHeaders()
        )
        .then(response => {
          console.log(response.data);

          this.isSaving = false;

          if (!response) {
            alert("클랜을 생성하지 못했습니다.");
            return;
          } else if (response.data.code == 3001) {
            alert(
              "동일한 클랜 이름이 있습니다.\n다른 이름으로 다시 시도해 주세요."
            );
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
          } else if (response.data.code != 1) {
            alert("클랜을 생성하지 못했습니다.");
            return;
          }

          alert("클랜을 생성하였습니다.");

          this.$router.push("/community/clans?type=my");
        })
        .catch(error => {
          this.isSaving = false;
          console.log(error);
        });
    },

    back() {
      this.$router.go(-1);
    }
  }
};
</script>