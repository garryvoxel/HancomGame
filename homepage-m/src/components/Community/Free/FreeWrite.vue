<template>
  <div class="page-container">
    <div class="page-wrapper page-community freewrite">
      <Header/>
      <SideMenu />
      <section class="main-content">
        <header class="page-header">
          <h1 class="page-title">자유게시판</h1>
        </header>
        <div class="sub-wrap p-3">
          <table class="tbs02 mt-2" style="width:100%;">
            <colgroup>
              <col width="20%" />
              <col width="*" />
            </colgroup>
            <tbody>
              <tr>
                <th class="tit">제목</th>
                <td class="ta_l">
                  <input type="text" class="w_100p" v-model="post.subject" placeholder="제목을 입력합니다." />
                </td>
              </tr>
              <tr>
                <th class="tit">내용</th>
                <td class="ta_l">
                  <textarea id="content" class="w_100p" v-model="post.content" rows="12"></textarea>
                </td>
              </tr>
              <!-- <tr>
                            <th class="tit">첨부</th>
                            <td class="ta_l">
                                    <input type="file" name="" id="">
                            </td>
              </tr>-->
            </tbody>
          </table>

          <div class="row mt-2">
            <div class="col-4 col-sm-4 text-left">
              <button class="btn btn-danger btn-xs" @click="submit">등록</button>
            </div>
            <div class="col-4 col-sm-4 text-center"></div>
            <div class="col-4 col-sm-4 text-right">
              <router-link to="/free" class="btn btn-dark btn-xs">취소</router-link>
            </div>
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
      MIN_SUBJECT_LENGTH: 5,
      MAX_SUBJECT_LENGTH: 30,
      post: {
        subject: "",
        content: ""
      },
      editor: [],
      isSaving: false
    };
  },

  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.$root.registerNicknameIfNotExist();
    });
  },

  methods: {
    submit() {
      if (this.isSaving) {
        alert("저장중입니다. 잠시만 기다려 주세요.");
        return;
      }

      if (!this.post.subject) {
        alert("제목을 입력해주세요.");
        return;
      }

      if (this.post.subject.length < this.MIN_SUBJECT_LENGTH) {
        alert(`제목은 ${this.MIN_SUBJECT_LENGTH}글자 이상 입력해주세요.`);
        return;
      }

      if (this.post.subject.length > this.MAX_SUBJECT_LENGTH) {
        alert(`제목은 ${this.MAX_SUBJECT_LENGTH}글자 이상 넘을 수 없습니다.`);
        return;
      }

      //this.editor.getById["content"].exec("UPDATE_CONTENTS_FIELD", []);

      this.isSaving = true;

      if (this.$route.name === "freewrite") {
        this.store();
      } else {
        this.update();
      }
    },

    store() {
      this.$axios
        .put(
          this.$Api.writePost,
          {
            bbs: "forum",
            subject: this.post.subject,
            content: document.getElementById("content").value
          },
          this.$root.bearerHeaders()
        )
        .then(this.handleResponse)
        .catch(this.handleError);
    },

    update() {
      this.$axios
        .post(
          this.$Api.updatePost.replace(":id", this.$route.params.id),
          {
            bbs: "forum",
            subject: this.post.subject,
            content: document.getElementById("content").value
          },
          this.$root.bearerHeaders()
        )
        .then(response => {
          console.log(response.data);
        })
        .catch(this.handleError);
    },

    handleResponse(response) {
      console.log(response.data);
      this.isSaving = false;
      if (response.data.code === 405 || response.data.code === 406) {
        alert(
          response.data.word + "은(는) 사용할 수 없습니다.\n올바르게 수정 후 다시 등록해주세요."
          );
        return;
      } else if (response.data.code === 407) {
        alert(
          "등록할 수 있는 게시물의 수를 초과하였습니다.\n나중에 다시 시도해 주세요."
        );
        return;
      }
      else if (response.data.code === Result.NOT_ALLOWED_TO_WRITE.code) {
        alert('게시물 작성 이용이 제한 되었습니다.');
        return;
      }
      else if (response.data.code === Result.NOT_ALLOWED_TO_UPDATE.code) {
        alert('게시물 수정 이용이 제한 되었습니다.');
        return;
      }
      else if (response.data.code === Result.NOT_ALLOWED_TO_DELETE.code) {
        alert('게시물 삭제 이용이 제한 되었습니다.');
        return;
      }
      if (!response || response.data.code !== Result.OK.code) {
        return;
      }

      if (response.data.code === Result.SUBJECT_IS_TOO_SHORT.code) {
        alert("제목이 너무 짧습니다.");
        return;
      }

      this.$router.push({ name: "freelist" });
    },

    handleError(error) {
      console.log(error);

      this.isSaving = false;
    },

    fetchPost() {
      console.log(this.$route.params.id);
      this.$axios
        .get(
          this.$Api.viewPost.replace(":id", this.$route.params.id) +
            "?bbs=forum",
          this.$root.bearerHeaders()
        )
        .then(response => {
          console.log(response.data);

          if (!response || response.data.code !== Result.OK.code) {
            return;
          }

          this.post = response.data.post;
        })
        .catch(error => {
          console.log(error);
        });
    }
  },
  created() {}
};
</script>

<style>
</style>

