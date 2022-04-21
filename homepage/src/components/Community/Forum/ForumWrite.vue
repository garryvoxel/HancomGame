<template>
  <div id="forum-write">
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
          <div class="post-info">
            <h5>
              <i class="fa fa-exclamation-triangle"></i> 게시판 작성 시 유의사항
            </h5>
            <ul>
              <li>욕설 및 비방과 같이 타인에게 불쾌감을 주는 게시물을 작성할 경우, 관리자에 의해 통보 없이 게시물이 삭제됩니다.</li>
              <li>신고 누적 횟수에 따라 글쓰기 일정기간 제한 및 계정 삭제가 될 수 있으니 유의하시기 바랍니다.</li>
            </ul>
            <p>
              <a
                href="https://accounts.malangmalang.com/terms/current/ko"
                class="post-info-btn"
              >한컴타자 이용약관 게시물 운영정책 바로가기</a>
            </p>
          </div>
          <textarea id="content">{{ post.content }}</textarea>
        </td>
      </tr>
    </table>

    <div class="post-button-row center">
      <a @click.prevent="submit" class="button-rounded-red" v-if="$route.name === 'forum-write'">등록</a>
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
      isSaving: false
    };
  },

  methods: {
    submit() { //게시글 보관하기
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

      if (this.$route.name === "forum-write") {
        this.store();
      } else {
        this.update();
      }
    },

    store() { //게시글 보관하기
      this.$axios
        .put(
          this.$Api.writePost,
          {
            bbs: "forum",
            subject: this.post.subject,
            content: document
              .getElementById("content")
              .value.replace(/<em/g, "<i")
          },
          this.$root.bearerHeaders()
        )
        .then(this.handleResponse)
        .catch(this.handleError);
    },

    update() { //게시글 업데이트
      this.$axios
        .post(
          this.$Api.updatePost.replace(":id", this.$route.params.id),
          {
            bbs: "forum",
            subject: this.post.subject,
            content: document
              .getElementById("content")
              .value.replace(/<em/g, "<i")
          },
          this.$root.bearerHeaders()
        )
        .then(this.handleResponse)
        .catch(this.handleError);
    },

    handleResponse(response) { //서버로부터 온 결과처리
      this.isSaving = false;
      //console.log(response.data.code);
      if (response.data.code === 405 || response.data.code === 406) {
        alert(
          response.data.word +
            "은(는) 사용할 수 없습니다.\n올바르게 수정 후 다시 등록해주세요."
        );
        return;
      } else if (response.data.code === 407) {
        alert(
          "등록할 수 있는 게시물의 수를 초과하였습니다.\n나중에 다시 시도해 주세요."
        );
        return;
      } else if (response.data.code == Result.NOT_ALLOWED_TO_WRITE.code) {
        alert("게시물 작성 이용이 제한 되었습니다.");
        return;
      } else if (response.data.code == Result.NOT_ALLOWED_TO_UPDATE.code) {
        alert("게시물 수정 이용이 제한 되었습니다.");
        return;
      } else if (response.data.code == Result.NOT_ALLOWED_TO_DELETE.code) {
        alert("게시물 삭제 이용이 제한 되었습니다.");
        return;
      }
      if (!response || response.data.code !== Result.OK.code) {
        return;
      }

      if (response.data.code === Result.SUBJECT_IS_TOO_SHORT.code) {
        alert("제목이 너무 짧습니다.");
        return;
      }

      this.$router.push({ name: "forum" });
    },

    handleError(error) {//오류처리
      console.log(error);

      this.isSaving = false;
    },

    fetchPost() { //게시글 불러오기
      this.$axios
        .get(
          this.$Api.viewPost.replace(":id", this.$route.params.id) +
            "?bbs=forum",
          this.$root.bearerHeaders()
        )
        .then(response => {
          //console.log(response.data);

          if (!response || response.data.code !== Result.OK.code) {
            return;
          }

          if (
            this.$route.name === "forum-edit" &&
            !response.data.post.isEditable
          ) {
            alert("잘못된 접근입니다.");
            this.$router.push({ name: "forum" });
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
    if (this.$route.name === "forum-edit") {
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
<style>
.post-info {
  text-align: left;
  margin: 10px 0 20px;
  color: #666;
}
.post-info h5 {
  margin: 0 0 0.3em 0;
  font-size: 1em;
  font-weight: 700;
  line-height: 1.3;
}
.post-info ul {
  list-style: none;
  margin: 0;
  padding: 0;
}
.post-info li {
  position: relative;
  margin-left: 0.3em;
  padding-left: 0.6em;
  font-size: 0.85em;
  line-height: 1.5;
}
.post-info li + li {
  margin-top: 0.2em;
}
.post-info li:before {
  content: "-";
  position: absolute;
  left: 0;
}
.post-info p {
  margin-top: 0.5em;
  font-size: 0.9em;
  font-weight: 700;
  line-height: 1.5;
}
.post-info-btn {
  color: #f75259;
  position: relative;
  padding-left: 1.2em;
}
.post-info-btn:hover,
.post-info-btn:focus {
  text-decoration: underline;
}
.post-info-btn:before {
  position: absolute;
  left: 0;
  content: "\f138";
  font-family: "FontAwesome";
}
</style>
