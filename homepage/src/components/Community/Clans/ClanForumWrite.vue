<template>
  <div id="clan-forum-write">
    <table class="post-writer">
      <tr>
        <th class="post-subject">제 목</th>
        <td class="post-subject">
          <input type="text" v-model="post.subject" placeholder="제목을 입력합니다." />
        </td>
      </tr>
      <tr>
        <th class="post-content">내 용</th>
        <td class="post-content">
          <textarea id="content">{{ post.content }}</textarea>
        </td>
      </tr>
    </table>

    <div class="post-button-row center">
      <a
        @click.prevent="submit"
        class="button-rounded-red"
        v-if="$route.name === 'clan-forum-write'"
      >등록</a>
      <a @click.prevent="submit" class="button-rounded-red" v-else>저장</a>

      <a @click.prevent="$router.back()" class="button-rounded-gray">취소</a>
    </div>
  </div>
</template>

<script>
import Result from "../../../utils/result";

export default {
  data() { //변수 초기화
    return {
      MIN_SUBJECT_LENGTH: 5,
      MAX_SUBJECT_LENGTH: 30,
      post: {
        subject: "",
        content: ""
      },
      editor: [],
      isSaving: false,
      clanId: localStorage.getItem("clanId"),
      clanName: localStorage.getItem("clanName")
    };
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

      this.editor.getById["content"].exec("UPDATE_CONTENTS_FIELD", []);

      this.isSaving = true;

      if (this.$route.name === "clan-forum-write") {
        this.store();
        //console.log("store!!!!");
      } else {
        this.update();
        //console.log("update!!!!");
      }
    },

    store() { //보관하기
      // console.log(this.post.subject);
      // console.log(document.getElementById("content").value);
      // console.log(this.clanId);
      console.log(
        document.getElementById("content").value.replace(/<em/g, "<i")
      );
      this.$axios
        .put(
          this.$Api.writeClanPost,
          {
            bbs: "forum_clan",
            subject: this.post.subject,
            content: document
              .getElementById("content")
              .value.replace(/<em/g, "<i"),
            clan_id: this.clanId
          },
          this.$root.bearerHeaders()
        )
        .then(this.handleResponse)
        .catch(this.handleError);
    },

    update() { //업데이트하기
      console.log(document.getElementById("content").value);
      this.$axios
        .post(
          this.$Api.updateClanPost.replace(":id", this.$route.params.id),
          {
            bbs: "forum_clan",
            subject: this.post.subject,
            content: document
              .getElementById("content")
              .value.replace(/<em/g, "<i"),
            clan_id: this.clanId
          },
          this.$root.bearerHeaders()
        )
        .then(this.handleResponse)
        .catch(this.handleError);
    },

    handleResponse(response) { //서버로부터 온 결과처리
      //console.log(response.data);

      this.isSaving = false;
      if (response.data.code === 405 || response.data.code === 406) {
        alert(
          response.data.word +
            "은(는) 사용할 수 없습니다.\n올바르게 수정 후 다시 등록해주세요."
        );
        return;
      }

      if (!response || response.data.code !== Result.OK.code) {
        return;
      }

      if (response.data.code === Result.SUBJECT_IS_TOO_SHORT.code) {
        alert("제목이 너무 짧습니다.");
        return;
      }

      this.$router.push({ name: "clan-forum" });
    },

    handleError(error) { //오류처리
      console.log(error);

      this.isSaving = false;
    },

    fetchPost() { //자료불러오기
      this.$axios
        .get(
          this.$Api.viewClanPost.replace(":id", this.$route.params.id) +
            "?bbs=forum_clan",
          this.$root.bearerHeaders()
        )
        .then(response => {
          //console.log(response.data);

          if (!response || response.data.code !== Result.OK.code) {
            return;
          }

          if (
            this.$route.name === "clan-forum-edit" &&
            !response.data.post.isEditable
          ) {
            alert("잘못된 접근입니다.");
            this.$router.push({ name: "clan-forum" });
            return;
          }

          this.post = response.data.post;
        })
        .catch(error => {
          console.log(error);
        });
    }
  },

  created() { //페이지 초기 로딩
    if (this.$route.name === "clan-forum-edit") {
      this.fetchPost();
    }
  },

  mounted() {
    this.$nextTick(() => {
      const self = this;

      nhn.husky.EZCreator.createInIFrame({
        oAppRef: self.editor,
        elPlaceHolder: "content",
        sSkinURI: "/assets/vendors/smarteditor2/SmartEditor2SkinHancom.html",
        htParams: {
          bUseToolbar: true, // 툴바 사용 여부 (true:사용/ false:사용하지 않음)
          bUseVerticalResizer: false, // 입력창 크기 조절바 사용 여부 (true:사용/ false:사용하지 않음)
          bUseModeChanger: false, // 모드 탭(Editor | HTML | TEXT) 사용 여부 (true:사용/ false:사용하지 않음)
          bSkipXssFilter: false, // client-side xss filter 무시 여부 (true:사용하지 않음 / 그외:사용)
          //aAdditionalFontList : aAdditionalFontSet,		// 추가 글꼴 목록
          fOnBeforeUnload: function() {
            //alert("완료!");
          },
          I18N_LOCALE: "ko_KR"
        }, //boolean
        fOnAppLoad: function() {
          //예제 코드
          //oEditors.getById["ir1"].exec("PASTE_HTML", ["로딩이 완료된 후에 본문에 삽입되는 text입니다."]);
          self.editor.getById.content.setDefaultFont("나눔고딕", 14);
        },
        fCreator: "createSEditor2"
      });
    });
  }
};
</script>