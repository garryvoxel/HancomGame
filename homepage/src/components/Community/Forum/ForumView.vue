<template>
  <div id="forum-view">
    <div class="post-view">
      <div class="header">
        <h3 class="post-content" v-if="post.author.secession !== 0">탈퇴자의 글로 볼 수 없습니다.</h3>
        <h3 v-else-if="post.deleted_at === null" class="subject">{{ post.subject }}</h3>
        <h3 v-else class="subject">관리자에 의해 삭제된 글입니다.</h3>
        <span class="created-at">{{ dateFormat(post.created_at) }}</span>
      </div>

      <div class="author">
        <div class="avatar">
          <avatar-image :index="post.author.avatar" v-if="post.author" />
        </div>
        <div class="nickname">{{ post.author ? post.author.nickname : '닉네임 없음' }}</div>
      </div>
      <div class="post-content" v-if="post.author.secession !== 0">탈퇴자의 글로 볼 수 없습니다.</div>
      <div v-else-if="post.deleted_at === null" class="post-content" v-html="post.content"></div>
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
          <a class="report-button" @click.prevent="report(1, post.id, post.author.id)">신고</a>
        </div>
      </div>

      <div class="menu">
        <div class="left">
          <router-link
            :to="{ name: 'forum-view', params: { id: post.previous_post_id } }"
            class="button-rounded-gray"
            v-if="post.previous_post_id"
          >
            <span>&lt;</span>
            <span>이전 글</span>
          </router-link>

          <router-link
            :to="{ name: 'forum-view', params: { id: post.next_post_id } }"
            class="button-rounded-gray"
            v-if="post.next_post_id"
          >
            <span>다음 글</span>
            <span>&gt;</span>
          </router-link>
        </div>
        <div class="right" v-if="$root.isLoggedIn()">
          <a class="button-rounded-red" @click.prevent="deletePost" v-if="post.isDeletable">삭제</a>
          <router-link
            to
            class="button-rounded-red"
            v-if="post.isEditable"
            @click.native="checkRestricted()"
          >수정</router-link>
          <!-- <router-link :to="{ name: 'forum' }" class="button-rounded-red">목록</router-link> -->
          <router-link :to="backtoList" class="button-rounded-red">목록</router-link>
        </div>
        <div class="right" v-else>
          <!-- <router-link :to="{ name: 'forum' }" class="button-rounded-red">목록</router-link> -->
          <router-link :to="backtoList" class="button-rounded-red">목록</router-link>
        </div>
      </div>

      <div class="comments">
        <div class="comments-header" :class="{ open: showComments }">
          <a @click.prevent="showComments = !showComments">
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
        <form class="write-comment" @submit.prevent="signInBtn" v-else-if="showComments">
          <input
            readonly
            @click.prevent="signInBtn"
            type="text"
            v-model="newComment"
            placeholder="댓글을 입력해주세요."
          />
          <button>등 록</button>
        </form>
        <ul class="comment-list" v-if="showComments && post.comments.length">
          <li class="comment-listitem" v-for="(comment, index) in post.comments" :key="comment.id">
            <div class="comment-container">
              <h5>{{ comment.author.nickname }}</h5>
              <div class="comment-text" v-if="comment.author.secession !== 0">탈퇴자의 글로 볼 수 없습니다.</div>
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
                <span class="created-at">
                  {{
                  dateFormat(comment.created_at)
                  }}
                </span>
                <span class="divider">|</span>
                <button
                  style="background-color : #0000"
                  class="report"
                  @click="report(2, comment.id, comment.author.id)"
                >신고</button>
                <span v-if="comment.author.nickname == nickname" class="divider">|</span>
                <button
                  style="background-color : #0000"
                  v-if="comment.author.nickname == nickname"
                  class="report"
                  @click="deleteReply(comment.id, comment.comment)"
                >삭제</button>
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
                    <div class="comment-text" v-if="reply.author.secession !== 0">퇄퇴자의 글로 볼 수 없습니다.</div>
                    <div
                      v-else-if="reply.deleted_at === null"
                      class="comment-text"
                    >{{ reply.comment }}</div>
                    <div v-else class="comment-text">관리자에 의해 삭제된 글입니다.</div>
                    <div class="info">
                      <span class="created-at">
                        {{
                        dateFormat(reply.created_at)
                        }}
                      </span>
                      <span class="divider">|</span>
                      <button
                        style="background-color : #0000"
                        class="report"
                        @click="report(2, reply.id, reply.author_id)"
                      >신고</button>
                      <span v-if="reply.author.nickname == nickname" class="divider">|</span>
                      <button
                        style="background-color : #0000"
                        v-if="reply.author.nickname == nickname"
                        class="report"
                        @click="deleteReply(reply.id, reply.comment)"
                      >삭제</button>
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
              <form class="write-reply" @submit.prevent="signInBtn" v-else>
                <input
                  readonly
                  @click.prevent="signInBtn"
                  type="text"
                  v-model="newReplies[index]"
                  :placeholder="placeHolder"
                />
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
import { truncate } from "fs";

export default {
  components: {
    AccustaionPopUp
  },

  data() { //변수 초기화
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
      backtoList: "/community/forum?page=" + this.pagenum,
      pagenum: 1,
      reply: [],
      replies: [],
      nickname: localStorage.getItem("nickname"),
      showAccustaionPopUp: false,
      accustaion_type: 0,
      type: 0,
      target_id: 0,
      target_uuid: "",
      desc: ""
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
    deletePost() { //게시물 삭제하기
      if (!confirm("정말 삭제하겠습니까?")) {
        return;
      }
      this.$axios
        .get(
          this.$Api.restricted + "?code=" + Result.NOT_ALLOWED_TO_DELETE.code,
          this.$root.bearerHeaders()
        )
        .then(res => {
          //        console.log("deletePost() - response : "+JSON.stringify(res));
          if (!res || res.data.code !== Result.OK.code) {
            alert("게시물을 삭제할 수 없습니다.\n나중에 다시 시도해 주세요.");
            return;
          }
          if (res.data.restricted == true) {
            alert("게시물 삭제 이용이 제한 되었습니다.");
            return;
          }

          this.$EventBus.$emit("loading-add", "deletePost");
          this.$axios
            .delete(this.$Api.destroyPost.replace(":id", this.post.id), {
              data: {
                bbs: "forum"
              },
              ...this.$root.bearerHeaders()
            })
            .then(response => {
              //console.log(response.data);
              this.$EventBus.$emit("loading-remove", "submit");

              if (response.data.code == Result.NOT_ALLOWED_TO_DELETE.code) {
                alert("게시물 삭제 이용이 제한 되었습니다.");
                return;
              }

              if (!response || response.data.code !== Result.OK.code) {
                return;
              }

              this.$router.push({ name: "forum" });
            })
            .catch(error => {
              console.log(error);
              this.$EventBus.$emit("loading-remove", "submit");
            });
        })
        .catch(error => {
          alert("게시물을 삭제할 수 없습니다.\n나중에 다시 시도해 주세요.");
          return;
        });
    },

    deleteReply(deleteId, comment) { //댓글 삭제하기
      if (comment === "요청자 혹은 관리자에 의해 삭제된 댓글입니다.") {
        alert("이미 삭제된 댓글입니다.");
        return;
      }
      if (!confirm("정말 삭제하겠습니까?")) {
        return;
      }

      this.$axios
        .get(
          this.$Api.restricted + "?code=" + Result.NOT_ALLOWED_TO_DELETE.code,
          this.$root.bearerHeaders()
        )
        .then(res => {
          //        console.log("deleteReply() - response : "+JSON.stringify(res));
          if (!res || res.data.code !== Result.OK.code) {
            alert("댓글을 삭제할 수 없습니다.\n나중에 다시 시도해 주세요.");
            return;
          }
          if (res.data.restricted == true) {
            alert("댓글 삭제 이용이 제한 되었습니다.");
            return;
          }

          this.$EventBus.$emit("loading-add", "deletePost");
          this.$axios
            .post(
              this.$Api.deleteReply.replace(":id", deleteId),
              {
                bbs: "forum"
              },
              this.$root.bearerHeaders()
            )
            .then(response => {
              //console.log(response.data);

              this.$EventBus.$emit("loading-remove", "deletePost");
              if (response.data.code == Result.NOT_ALLOWED_TO_DELETE.code) {
                alert("댓글 삭제 이용이 제한 되었습니다.");
                return;
              }

              if (!response || response.data.code !== Result.OK.code) {
                return;
              }
              alert("댓글 삭제가 완료되었습니다.");
              this.$router.go();
            })
            .catch(error => {
              console.log(error);
              this.$EventBus.$emit("loading-remove", "deletePost");
            });
        })
        .catch(error => {
          alert("댓글을 삭제할 수 없습니다.\n나중에 다시 시도해 주세요.");
          return;
        });
    },

    showReply(index) { //댓글 보기
      this.post.comments[index].showReplies = !this.post.comments[index]
        .showReplies;
    },

    dateFormat(datetime) { //날짜 형식 맞추기
      return moment(datetime)
        .utcOffset("+0900")
        .format("YYYY-MM-DD HH:mm:ss");
    },

    submitReply(index) { //댓글 보내기
      if (!this.newReplies[index]) {
        alert("댓글내용을 입력해주세요.");
        return;
      }

      this.submit({
        bbs: "forum",
        parent_id: this.post.comments[index].id,
        post_id: this.$route.params.id,
        comment: this.newReplies[index]
      });
    },

    submitComment() {//댓글 보내기
      if (!this.newComment) {
        alert("댓글내용을 입력해주세요.");
        return;
      }

      this.submit({
        bbs: "forum",
        post_id: this.$route.params.id,
        comment: this.newComment
      });
      this.newComment = "";
    },

    submit(args) {
      this.$axios
        .get(
          this.$Api.restricted + "?code=" + Result.NOT_ALLOWED_TO_WRITE.code,
          this.$root.bearerHeaders()
        )
        .then(res => {
          //        console.log("submit() - response : "+JSON.stringify(res));
          if (!res || res.data.code !== Result.OK.code) {
            alert("댓글을 작성할 수 없습니다.\n나중에 다시 시도해 주세요.");
            return;
          }
          if (res.data.restricted == true) {
            alert("댓글 작성 이용이 제한 되었습니다.");
            return;
          }

          this.$EventBus.$emit("loading-add", "submit");
          this.$axios
            .put(
              this.$Api.writeComment.replace(":id", this.$route.params.id),
              args,
              this.$root.bearerHeaders()
            )
            .then(response => {
              //console.log(response.data);
              this.$EventBus.$emit("loading-remove", "submit");

              if (response.data.code === 406) {
                alert(
                  response.data.word +
                    "은(는) 사용할 수 없습니다.\n올바르게 수정 후 다시 등록해주세요."
                );
                return;
              } else if (
                response.data.code == Result.NOT_ALLOWED_TO_WRITE.code
              ) {
                alert("댓글 작성 이용이 제한 되었습니다.");
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
        })
        .catch(error => {
          alert("댓글을 작성할 수 없습니다.\n나중에 다시 시도해 주세요.");
          return;
        });
    },

    formatter(number) { //수값 형식 맞추기
      return number ? new Intl.NumberFormat("ko-KR").format(number) : 0;
    },

    report(type, targetId, targetUUid) { //신고서 작성하기
      if (!this.$root.isLoggedIn()) {
        if (!confirm("로그인이 필요합니다.\n로그인 하시겠습니까?")) {
          return;
        }
        this.$root.redirectToLogin();
        return;
      } else {
        this.showAccustaionPopUp = true;
        this.type = type;
        this.target_id = parseInt(targetId);
        this.target_uuid = parseInt(targetUUid);
      }
    },
    cancleReport() { //신고서 취소
      this.showAccustaionPopUp = false;
    },
    sendReport(num, description) { //신고서 보내기
      this.accustaion_type = parseInt(num);
      this.$axios
        .post(
          this.$Api.accustaion,
          {
            accustaion_type: this.accustaion_type,
            type: this.type,
            target_id: this.target_id,
            target_uuid: this.target_uuid,
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

    toggleLike() { //공감수
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
          this.$Api.likePost.replace(":id", this.$route.params.id) +
            "?bbs=forum",
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

    loadPost() { //게시글 불러오기
      this.$EventBus.$emit("loading-add", "loadPost");
      this.$axios
        .get(
          this.$Api.viewPost.replace(":id", this.$route.params.id) +
            "?bbs=forum",
          this.$root.bearerHeaders()
        )
        .then(response => {
          this.$EventBus.$emit("loading-remove", "loadPost");

          if (!response) {
            return;
          }

          if (response.data.code === Result.NO_POST_STORED.code) {
            alert("삭제된 게시글입니다.");
            this.$router.back();
          }

          if (response.data.code !== Result.OK.code) {
            return;
          }

          response.data.post.comments.forEach(comment => {
            comment.showReplies = false;
          });

          this.post = response.data.post;
          console.log(this.post);
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
      console.log("회원가입으로 이동");
      this.$root.redirectToLogin();
    },
    checkRestricted() {
      this.$axios
        .get(
          this.$Api.restricted + "?code=" + Result.NOT_ALLOWED_TO_UPDATE.code,
          this.$root.bearerHeaders()
        )
        .then(response => {
          //            console.log("write() - response : "+JSON.stringify(response));
          if (!response || response.data.code !== Result.OK.code) {
            alert("게시물을 수정할 수 없습니다.\n나중에 다시 시도해 주세요.");
            return;
          }
          if (response.data.restricted == true) {
            alert("게시물 수정 이용이 제한 되었습니다.");
            return;
          }
          this.$router.push({
            name: "forum-edit",
            params: { id: this.post.id }
          });
        })
        .catch(error => {
          alert("게시물을 수정할 수 없습니다.\n나중에 다시 시도해 주세요.");
          return;
        });
    }
  },

  created() { //페이지 초기 로딩
    this.pagenum = parseInt(localStorage.getItem("pagenum"));
    this.backtoList = "/community/forum?page=" + this.pagenum;
    this.loadPost();
  }
};
</script>
