<template>
  <div id="clan-forum-view">
    <div class="post-view">
      <div class="header">
        <h3 v-if="post.deleted_at === null" class="subject">{{ post.subject || '제목' }}</h3>
        <h3 v-else class="subject">관리자에 의해 삭제된 글입니다.</h3>
        <span class="created-at">{{ dateFormat(post.created_at) }}</span>
      </div>

      <div class="author">
        <div class="avatar">
          <avatar-image :index="post.author.avatar" v-if="post.author" />
        </div>
        <div class="nickname">{{ post.author ? post.author.nickname : "닉네임 없음" }}</div>
      </div>
      <div v-if="post.author.secession !== 0" class="post-content">탈퇴자의 글로 볼 수 없습니다.</div>
      <div v-if="post.deleted_at === null" class="post-content" v-html="post.content"></div>
      <div v-else class="post-content">관리자에 의해 삭제된 글입니다.</div>

      <div class="footer">
        <div class="left">
          <div class="views">
            조회수
            <span>{{ formatter(post.views) }}</span>
          </div>
          <a class="likers" @click.prevent="toggleLike">
            <div class="liker-label">공감수</div>
            <div
              class="liker-button"
              :class="{ liked: post.hasUserLiked }"
            >{{ formatter(post.likes) }}</div>
          </a>
        </div>
        <div class="right">
          <a class="report-button" @click.prevent="report(3)">신고</a>
        </div>
      </div>

      <div class="menu">
        <div class="left"></div>
        <div class="right">
          <a class="button-rounded-red" @click.prevent="deletePost" v-if="post.isDeletable">삭제</a>
          <router-link
            :to="{ name: 'clan-forum-edit', params: { id: post.id } }"
            class="button-rounded-red"
            v-if="post.isEditable"
          >수정</router-link>
          <router-link :to="{ name: 'clan-forum' }" class="button-rounded-red">목록</router-link>
        </div>
      </div>

      <div class="comments">
        <div class="comments-header" :class="{ open : showComments }">
          <a @click.prevent="showComments = ! showComments">
            <span class="label">댓글</span>
            <span class="count">{{ post.comments_count }}</span>
          </a>
        </div>
        <form
          class="write-comment"
          @submit.prevent="submitComment"
          v-if="$root.isLoggedIn() && showComments"
        >
          <input type="text" v-model="newComment" placeholder="댓글을 입력해주세요." />
          <button>등 록</button>
        </form>
        <ul class="comment-list" v-if="showComments && post.comments.length">
          <li class="comment-listitem" v-for="(comment, index) in post.comments" :key="comment.id">
            <div class="comment-container">
              <h5>{{ comment.author.nickname }}</h5>
              <div v-if="comment.author.secession !== 0" class="comment-text">탈퇴자의 글로 볼 수 없습니다.</div>
              <div
                v-else-if="comment.deleted_at === null"
                class="comment-text"
              >{{ comment.comment }}</div>
              <div v-else class="comment-text">관리자에 의해 삭제된 글입니다.</div>
              <div class="info">
                <a class="toggle-replies" @click.prevent="showReply(index)">
                  답글
                  <span class="count">{{ comment.children.length }}</span>
                </a>
                <span class="created-at">{{ dateFormat(comment.created_at )}}</span>
                <span class="divider">|</span>
                <span style="cursor:pointer;" class="report" @click="report(4)">신고</span>
                <span v-if="comment.author_id == uuid" class="divider">|</span>
                <span
                  style="cursor:pointer;"
                  v-if="comment.author_id == uuid"
                  class="report"
                  @click="deleteReply(comment.id, comment.comment)"
                >삭제</span>
              </div>
            </div>

            <div class="reply-container" v-if="post.comments[index].showReplies">
              <ul class="reply-list">
                <li
                  class="comment-listitem reply"
                  v-for="reply in comment.children"
                  :key="reply.id"
                >
                  <div class="comment-container">
                    <h5>
                      <div class="comment-sign"></div>
                      <div>{{ reply.author.nickname }}</div>
                    </h5>
                    <div v-if="reply.author.secession !== 0" class="comment-text">탈퇴자의 글로 볼 수 없습니다.</div>
                    <div
                      v-else-if="reply.deleted_at === null"
                      class="comment-text"
                    >{{ reply.comment }}</div>
                    <div v-else class="comment-text">관리자에 의해 삭제된 글입니다.</div>
                    <div class="info">
                      <span class="created-at">{{ dateFormat(reply.created_at) }}</span>
                      <span class="divider">|</span>
                      <span style="cursor:pointer;" class="report" @click="report(4)">신고</span>
                      <span v-if="reply.author_id == uuid" class="divider">|</span>
                      <span
                        style="cursor:pointer;"
                        v-if="reply.author_id == uuid"
                        class="report"
                        @click="deleteReply(reply.id,reply.comment)"
                      >삭제</span>
                    </div>
                  </div>
                </li>
              </ul>

              <form
                class="write-reply"
                v-if="$root.isLoggedIn()"
                @submit.prevent="submitReply(index)"
              >
                <input :type="text" v-model="newReplies[index]" :placeholder="placeHolder" />
                <button>등 록</button>
              </form>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <AccustaionPopUp @cancel="cancleReport" @continue="sendReport" v-if="showAccustaionPopUp" />
  </div>
</template>

<script>
import moment from "moment";
import Result from "../../../utils/result";
import AccustaionPopUp from "@/components/AccustaionPopUp.vue";

export default {
  components: {
    AccustaionPopUp
  },

  data() { //변수초기화
    return {
      post: {
        author: [],
        comments: []
      },
      newComment: "",
      newReplies: [],
      showComments: true,
      session: this.$root.sessionId(),
      placeHolder: "댓글을 입력해주세요.",
      text: "",
      backtoList: "/community/clans/my/forum?page=" + this.pagenum,
      pagenum: 1,
      reply: [],
      replies: [],
      clanId: localStorage.getItem("clanId"),
      clanName: localStorage.getItem("clanName"),
      uuid: localStorage.getItem("uuid"),
      showAccustaionPopUp: false,
      accustaion_type: 0,
      type: 0,
      target_id: 0,
      target_uuid: "",
      desc: "",
      myClanMembers: [],
      user: {},
      bordnickname: "",
      bordState: false
    };
  },

  watch: {
    $route() {
      this.loadPost();
    },
    pagenum: function(newVal, oldVal) {
      this.pagenum = newVal;
    }
  },

  methods: {
    deletePost() { //삭제
      if (!confirm("정말 삭제하겠습니까?")) {
        return;
      }
      this.$EventBus.$emit("loading-add", "deletePost");
      this.$axios
        .delete(this.$Api.destroyClanPost.replace(":id", this.post.id), {
          data: {
            bbs: "forum_clan"
          },
          ...this.$root.bearerHeaders()
        })
        .then(response => {
          this.$EventBus.$emit("loading-remove", "submit");
          if (!response || response.data.code !== Result.OK.code) {
            return;
          }

          this.$router.push({ name: "clan-forum" });
        })
        .catch(error => {
          console.log(error);
          this.$EventBus.$emit("loading-remove", "submit");
        });
    },

    deleteReply(deleteId, comment) { //댓글 삭제
      if (comment === "요청자 혹은 관리자에 의해 삭제된 댓글입니다.") {
        alert("이미 삭제된 댓글입니다.");
        return;
      }
      //console.log(deleteId);
      if (!confirm("정말 삭제하겠습니까?")) {
        return;
      }
      this.$EventBus.$emit("loading-add", "deletePost");
      this.$axios
        .post(
          this.$Api.deleteClanReply.replace(":id", deleteId),
          {
            bbs: "forum_clan"
          },
          this.$root.bearerHeaders()
        )
        .then(response => {
          if (!response || response.data.code !== Result.OK.code) {
            return;
          }
          alert("댓글 삭제가 완료되었습니다.");
          this.$EventBus.$emit("loading-remove", "submit");
          this.$router.go();
        })
        .catch(error => {
          console.log(error);
          this.$EventBus.$emit("loading-remove", "submit");
        });
    },

    showReply(index) { //댓글 보기
      this.post.comments[index].showReplies = !this.post.comments[index]
        .showReplies;
    },

    dateFormat(datetime) { //날짜 형식
      return moment(datetime)
        .utcOffset("+0900")
        .format("YYYY-MM-DD HH:mm:ss");
    },

    submitReply(index) {  //댓글회답 달기
      if (!this.newReplies[index]) {
        alert("댓글내용을 입력해주세요.");
        return;
      }

      this.submit({
        bbs: "forum_clan",
        parent_id: this.post.comments[index].id,
        post_id: this.$route.params.id,
        comment: this.newReplies[index]
      });
    },

    submitComment() { //댓글 달기
      if (!this.newComment) {
        alert("댓글내용을 입력해주세요.");
        return;
      }

      this.submit({
        bbs: "forum_clan",
        post_id: this.$route.params.id,
        comment: this.newComment
      });
      this.newComment = "";
    },

    submit(args) {
      this.$EventBus.$emit("loading-add", "submit");
      this.$axios
        .put(
          this.$Api.writeClanComment.replace(":id", this.$route.params.id),
          args,
          this.$root.bearerHeaders()
        )
        .then(response => {
          this.$EventBus.$emit("loading-remove", "submit");
          if (response.data.code === 406) {
            alert(
              response.data.word +
                "은(는) 사용할 수 없습니다.\n올바르게 수정 후 다시 등록해주세요."
            );
            return;
          }

          if (!response || response.data.code !== Result.OK.code) {
            return;
          }

          response.data.comments.forEach(comment => {
            comment.showReplies = false;
          });

          this.post.comments = response.data.comments;
          alert("입력이 완료되었습니다.");
          this.$router.go();
        })
        .catch(error => {
          console.log(error);
          this.$EventBus.$emit("loading-remove", "submit");
        });
    },

    formatter(number) { //형식맞추기
      return number ? new Intl.NumberFormat("ko-KR").format(number) : 0;
    },

    report(type) { //신고서 쓰기
      if (!this.$root.isLoggedIn()) {
        if (!confirm("로그인이 필요합니다.\n로그인 하시겠습니까?")) {
          return;
        }
        this.$root.redirectToLogin();
        return;
      } else {
        this.showAccustaionPopUp = true;
        this.type = type;
      }
    },

    cancleReport() { //신고서 취소
      this.showAccustaionPopUp = false;
    },

    sendReport(num, description) { //신고서 보내기
      this.$axios
        .post(
          this.$Api.accustaion,
          {
            accustaion_type: this.accustaion_type,
            type: this.type,
            target_id: this.post.id,
            target_uuid: this.post.author_id,
            desc: description
          },
          this.$root.bearerHeaders()
        )
        .then(response => {
          //console.log(response.data);
          if (!response || response.data.code !== Result.OK.code) {
            return;
          }
          if (num === 0) {
            alert("신고 사유를 선택해 주세요");
            return;
          }
          this.cancleReport();
          alert("신고 처리 되었습니다.");
          this.$router.go();
        })
        .catch(error => {
          console.log(error);
          this.$EventBus.$emit("loading-remove", "submit");
        });
    },

    toggleLike() { //공감수 클릭
      if (!this.$root.isLoggedIn()) {
        if (!confirm("로그인이 필요합니다.\n로그인 하시겠습니까?")) {
          return;
        }
        this.$root.redirectToLogin();
        return;
      }
      this.$EventBus.$emit("loading-add", "toggleLike");
      this.$axios
        .post(
          this.$Api.likeClanPost.replace(":id", this.$route.params.id) +
            "?bbs=forum_clan",
          {},
          this.$root.bearerHeaders()
        )
        .then(response => {
          //console.log(response.data);
          this.$EventBus.$emit("loading-remove", "toggleLike");
          if (!response || response.data.code !== Result.OK.code) {
            return;
          }

          if (response.data.hasUserLiked) {
            this.post.likes++;
          } else {
            this.post.likes = Math.max(0, this.post.likes - 1);
          }

          this.post.hasUserLiked = response.data.hasUserLiked;
        })
        .catch(error => {
          console.log(error);
          this.$EventBus.$emit("loading-remove", "toggleLike");
        });
    },

    loadPost() { //자료 불러오기 함수
      this.$EventBus.$emit("loading-add", "loadPost");
      this.$axios
        .get(
          this.$Api.viewClanPost.replace(":id", this.$route.params.id) +
            "?bbs=forum_clan",
          this.$root.bearerHeaders()
        )
        .then(response => {
          //console.log(response.data);
          this.$EventBus.$emit("loading-remove", "loadPost");

          if (!response) {
            return;
          }

          if (response.data.code === Result.NO_POST_STORED.code) {
            alert("삭제된 게시글입니다.");
            this.$router.push({ name: "home" });
          }

          if (response.data.code !== Result.OK.code) {
            return;
          }

          response.data.post.comments.forEach(comment => {
            comment.showReplies = false;
          });

          this.post = response.data.post;
          console.log(this.post);
          this.getMyClan();
        })
        .catch(error => {
          console.log(error);
          this.$EventBus.$emit("loading-remove", "loadPost");
        });
    },
    signInBtn() { //로그인 버튼
      if (
        !confirm("로그인한 회원만 댓글 작성이 가능합니다, 로그인하시겠습니까?")
      ) {
        return;
      }
      //console.log('회원가입으로 이동');
      this.$root.redirectToLogin();
    },
    getMyClan() { //나의 클랜 가져오기 함수
      this.$EventBus.$emit("loading-add", "getMyClan");

      this.sessionid = this.$root.sessionId();
      this.$axios
        .post(this.$Api2.clans.getMyClan, { sessionid: this.sessionid })
        .then(response => {
          if (!response) {
            return;
          }
          //console.log(response.data.myclanMembers.length);

          console.log(response.data);
          if (
            this.post.clan_id !== response.data.myclanMember[0].clan_id ||
            response.data.result === 2
          ) {
            alert("잘못된 접근 입니다.");
            this.$EventBus.$emit("loading-remove", "getMyClan");
            this.$router.push({ name: "home" });
          }
          this.$EventBus.$emit("loading-remove", "getMyClan");
        })
        .catch(error => {
          console.log(error);
          alert("잘못된 접근 입니다.");
          this.$EventBus.$emit("loading-remove", "getMyClan");
          this.$router.push({ name: "home" });
        });
    }
  },

  created() { //페이지 초기 로딩
    this.loadPost();

    this.pagenum = parseInt(localStorage.getItem("pagenum"));
    this.backtoList = "/community/clans/my/forum?page=" + this.pagenum;
  }
};
</script>