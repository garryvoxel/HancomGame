<template>
  <div class="page-container">
    <div class="page-wrapper page-community freeview">
      <Header/>
      <SideMenu />
      <section class="main-content">
        <header class="page-header">
          <h1 class="page-title">자유게시판</h1>
        </header>
        <div class="sub-wrap p-3">
          <section class="post-view">
            <header clahss="post-header">
              <div class="post-subject">
                <h5 v-if="post.author.secession !== 0">탈퇴자의 글로 볼 수 없습니다.</h5>
                <h5 v-else-if="post.deleted_at === null">{{ post.subject }}</h5>
                <h5 v-else>관리자에 의해 삭제된 글입니다.</h5>
              </div>
              <div class="post-author">
                <div class="post-author-col">{{ post.author ? post.author.nickname : "닉네임 없음" }}</div>
                <div class="post-author-col">{{ dateFormat(post.created_at) }}</div>
              </div>
            </header>
            <article class="post-content">
              <div v-if="post.author.secession !== 0" class="post-alert">탈퇴자의 글로 볼 수 없습니다.</div>
              <div v-else-if="post.deleted_at === null" v-html="post.content"></div>
              <div v-else class="post-alert">관리자에 의해 삭제된 글입니다.</div>
            </article>
            <div class="post-footer">
              <div class="post-footer-col">
                조회수 <span>{{ formatter(post.views) }}</span> &nbsp; | &nbsp; 
                <a class="likers" @click.prevent="toggleLike">
                  공감수
                  <span
                    class="licker-button"
                    :class="{ liked: post.hasUserLiked }"
                  >{{ formatter(post.likes) }}</span>
                </a>
              </div>
              <div class="post-footer-col">
                <button type="button" class="btn btn-danger btn-xs" @click="report(1)">신고</button>
              </div>
            </div>
          </section>

          <div class="row p_10">
            <div class="col-8 text-left">
          <router-link
            :to="{ params: { id: post.previous_post_id } }"
            class="btn btn-dark btn-xs"
            v-if="post.previous_post_id"
          >
            <span>이전글</span>
          </router-link>
          <router-link
            :to="{ params: { id: post.next_post_id } }"
            class="btn btn-dark btn-xs"
            v-if="post.next_post_id"
          >
            <span>다음글</span>
          </router-link>
            </div>
            <div class="col-4 text-right">
              <router-link to="/free" class="btn btn-dark btn-xs">목록</router-link>
            </div>
          </div>
          <div class="row p_10" v-if="post.author.nickname === nickname">
            <div class="col-12 text-right">
              <button type="button" class="btn btn-danger btn-xs" @click="deletePost">삭제</button>
            </div>
          </div>
          <div class="comments-header" :class="{ open : showComments }">
            <a @click.prevent="showComments = !showComments">
              <h4 class="pg_tit1 mt-4">
                댓글
                <span>{{ post.comments_count }}</span>
              </h4>
            </a>
          </div>
          <!-- <h4 class="pg_tit1 mt-4">댓글 <span>{{ post.comments.length }}</span></h4> -->
          <table class="tbs02 mt-2" style="width:100%;">
            <colgroup>
              <col width="*" />
              <col width="20%" />
            </colgroup>
            <tbody>
              <tr>
                <td width="100%">
                  <input
                    type="text"
                    class="instb w_100p"
                    v-model="newComment"
                    name
                    id
                    placeholder="댓글 입력하세요."
                  />
                </td>
                <td class="text-right pl_5">
                  <button class="btn btn-dark btn-xs" @click="submitComment">등록</button>
                </td>
              </tr>
            </tbody>
          </table>

          <table style="width:100%" class="tbs02 mt-2" v-if="replies.length !== 0">
            <tbody v-for="(item,index) in replies">
              <tr>
                <td class="ta_l">
                  <b>
                    <p>{{ item.author.nickname }}</p>
                  </b>
                  <p v-if="item.author.secession !== 0">탈퇴자의 글로 볼 수 없습니다.</p>
                  <p v-else-if="item.deleted_at === null">{{ item.comment }}</p>
                  <p v-else>관리자에 의해 삭제된 글입니다.</p>
                  <p class="rly">
                    <!--<span>답글20</span>-->
                    <span>{{ dateFormat(item.created_at) }}</span>
                    <span @click="report(2)">신고</span>
                    <span v-if="item.author.nickname == nickname" class="divider">|</span>
                    <span
                      v-if="item.author.nickname == nickname"
                      class="report"
                      @click="deleteReply(item.id,item.comment)"
                    >삭제</span>
                  </p>
                  <div class="info">
                    <a
                      class="toggle-replies"
                      :class="{open : replies[index].showReplies}"
                      style="border : 1px solid #959595; border-radius : 6px #fff; width : 150px;"
                      @click.prevent="showReply(index)"
                    >
                      <span>답글{{item.children.length}}</span>
                    </a>
                  </div>
                </td>
              </tr>
              <div class="reply-container" v-if="replies[index].showReplies">
                <ul class="reply-list">
                  <li class="comment-listitem-reply" v-for="reply in item.children" :key="reply.id">
                    <div class="comment-container">
                      <h5>
                        <div class="comment-sign"></div>
                        <div>{{ reply.author.nickname }}</div>
                      </h5>
                      <div
                        class="comment-text"
                        v-if="reply.author.secession !== 0"
                      >탈퇴자의 글로 볼 수 없습니다.</div>
                      <div
                        v-else-if="reply.deleted_at === null"
                        class="comment-text"
                        style="margin-top : 25px"
                      >{{ reply.comment }}</div>
                      <div v-else class="comment-text" style="margin-top : 25px">관리자에 의해 삭제된 글입니다.</div>
                      <div class="freeviewInfo">
                        <span class="created-at">{{ dateFormat(reply.created_at) }}</span>
                        <span class="divider">|</span>
                        <span class="report" @click="report(2)">신고</span>
                        <span v-if="reply.author.nickname == nickname" class="divider">|</span>
                        <span
                          v-if="reply.author.nickname == nickname"
                          class="report"
                          @click="deleteReply(reply.id, reply.comment)"
                        >삭제</span>
                      </div>
                    </div>
                  </li>
                  <colgroup>
                    <col width="*" />
                    <col width="1%" />
                  </colgroup>
                  <tbody>
                    <tr>
                      <td>
                        <input
                          type="text"
                          class="instb w_100p"
                          v-model="newReplies"
                          name
                          id
                          placeholder="댓글 입력하세요."
                        />
                      </td>
                      <td>
                        <button class="btn btn-dark btn-xs" @click="submitReply(index)">등록</button>
                      </td>
                    </tr>
                  </tbody>
                </ul>
              </div>
            </tbody>
          </table>
        </div>
      </section>
      <Footer />
      <AccustaionPopUp @cancel="cancleReport" @continue="sendReport" v-if="showAccustaionPopUp" />
      </div>
  </div>
</template>

<script>
import Header from '@/components/Header.vue'
import SideMenu from "@/components/SideMenu.vue";
import Footer from "@/components/Footer.vue";
import moment from "moment";
import Result from "@/utils/result";
import AccustaionPopUp from "@/components/AccustaionPopUp.vue";
import { constants, truncate, truncateSync } from "fs";
import { fail } from "assert";

export default {
  components: {
    Header,
    SideMenu,
    Footer,
    AccustaionPopUp
  },

  data() {
    return {
      post: {
        author: [],
        comments: []
      },
      newComment: "",
      newReplies: "",
      showComments: true,
      reply: [],
      getview_id: 0,
      replies: [],
      showReplies: false,
      commentIdx: 0,
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
    reply: function(newVal, oldVal) {
      this.reply = newVal;
    }
  },

  methods: {
    deletePost() {
      if (!confirm("정말 삭제하겠습니까?")) {
        return;
      }
      this.$axios
      .get(
        this.$Api.restricted + '?code=' + Result.NOT_ALLOWED_TO_DELETE.code,
        this.$root.bearerHeaders()
      )
      .then(res => {
        if (!res || res.data.code !== Result.OK.code) {
          alert('게시물을 삭제할 수 없습니다.\n나중에 다시 시도해 주세요.');
          return;
        }
        if (res.data.restricted === true) {
          alert('게시물 삭제 이용이 제한 되었습니다.');
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
            console.log(response.data);
            this.$EventBus.$emit("loading-remove", "submit");

            if (response.data.code === Result.NOT_ALLOWED_TO_DELETE.code) {
              alert('게시물 삭제 이용이 제한 되었습니다.');
              return;
            }

            if (!response || response.data.code !== Result.OK.code) {
              return;
            }

            this.$router.push({ name: "freelist" });
          })
          .catch(error => {
            console.log(error);
            this.$EventBus.$emit("loading-remove", "submit");
          });
      })
      .catch(error => {
          alert('게시물을 삭제할 수 없습니다.\n나중에 다시 시도해 주세요.');
          return;
      });
    },

    deleteReply(deleteId, comment) {
      console.log(deleteId);
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
          if (!res || res.data.code !== Result.OK.code) {
            alert("댓글을 삭제할 수 없습니다.\n나중에 다시 시도해 주세요.");
            return;
          }
          if (res.data.restricted === true) {
            alert("댓글 삭제 이용이 제한 되었습니다.");
            return;
          }
          this.$EventBus.$emit("loading-add", "deletePost");
          this.$axios
            .post(
              this.$Api.deletReply.replace(":id", deleteId),
              {
                bbs: "forum"
              },
              this.$root.bearerHeaders()
            )
            .then(response => {
              console.log(response.data);
              if (response.data.code === Result.NOT_ALLOWED_TO_DELETE.code) {
                alert("댓글 삭제 이용이 제한 되었습니다.");
                return;
              }

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
      })
      .catch(error => {
        alert("댓글을 삭제할 수 없습니다.\n나중에 다시 시도해 주세요.");
        return;
      });
    },
    showReply(index) {
      this.showComments = !this.showComments;
      this.replies[index].showReplies = !this.replies[index].showReplies;
      this.newReplies = "";
    },

    dateFormat(datetime) {
      return moment(datetime).format("YYYY-MM-DD hh:mm:ss");
    },

    submitReply(index) {
      if (this.$root.isLoggedIn()) {
        if (this.nickname != null) {
          this.submit({
            bbs: "forum",
            parent_id: this.post.comments[index].id,
            post_id: this.$route.params.id,
            comment: this.newReplies
          });
        } else {
          alert("닉네임 등록 후 사용하실 수 있습니다.");
          this.newComment = "";
          this.$router.push("/mypage/register-nickname");
          return;
        }
      } else {
        if (!confirm("로그인이 필요합니다.\n로그인 하시겠습니까?")) {
          this.newReplies = "";
          return;
        }
        this.$root.redirectToLoginUrl();
      }
      if (!this.newReplies) {
        alert("댓글내용을 입력해주세요.");
        return;
      }
      this.newReplies = "";
    },
    submitComment() {
      if (!this.newComment) {
        alert("댓글내용을 입력해주세요.");
        return;
      }

      if (this.$root.isLoggedIn()) {
        if (this.nickname != null) {
          this.submit({
            bbs: "forum",
            post_id: this.$route.params.id,
            comment: this.newComment
          });
        } else {
          alert("닉네임 등록 후 사용하실 수 있습니다.");
          this.newComment = "";
          this.$router.push("/mypage/register-nickname");
          return;
        }
      } else {
        if (!confirm("로그인이 필요합니다.\n로그인 하시겠습니까?")) {
          this.newComment = "";
          return;
        }
        this.$root.redirectToLoginUrl();
      }

      this.newComment = "";
    },

    submit(args) {
      this.$axios
        .get(
          this.$Api.restricted + "?code=" + Result.NOT_ALLOWED_TO_WRITE.code,
          this.$root.bearerHeaders()
        )
        .then(res => {
          if (!res || res.data.code !== Result.OK.code) {
            alert("댓글을 작성할 수 없습니다.\n나중에 다시 시도해 주세요.");
            return;
          }
          if (res.data.restricted === true) {
            alert("댓글 작성 이용이 제한 되었습니다.");
            return;
          }
          this.$EventBus.$emit("loading-add", "submit");
          this.$axios
            .put(
              this.$Api.writeComment.replace(":id", this.post.id),
              args,
              this.$root.bearerHeaders()
            )
            .then(response => {
              this.$EventBus.$emit("loading-remove", "submit");

              if (response.data.code === 406) {
                alert(response.data.word + "은(는) 사용할 수 없습니다.\n올바르게 수정 후 다시 등록해주세요.");
                return;
              } else if (
                response.data.code === Result.NOT_ALLOWED_TO_WRITE.code
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
              this.$router.go();

              this.newReplies = null;
              // this.view(this.getview_id);
            })
            .catch(error => {
              console.log("respon error : " + error);
              this.$EventBus.$emit("loading-remove", "submit");
            });
        })
        .catch(error => {
          alert("댓글을 작성할 수 없습니다.\n나중에 다시 시도해 주세요.");
          return;
        });
    },

    formatter(number) {
      return number ? new Intl.NumberFormat("ko-KR").format(number) : 0;
    },

    report(type) {
      if (!this.$root.isLoggedIn()) {
        if (!confirm("로그인이 필요합니다.\n로그인 하시겠습니까?")) {
          return;
        }
        this.$root.redirectToLoginUrl();
        return;
      } else {
        this.showAccustaionPopUp = true;
        this.type = type;
      }
    },
    cancleReport() {
      this.showAccustaionPopUp = false;
    },
    sendReport(num, description) {
      console.log(num);
      console.log(description);
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
          console.log(response.data);
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

    toggleLike() {
      if (!this.$root.isLoggedIn()) {
        alert("로그인이 필요합니다.");
        return;
      }

      this.$axios
        .post(
          this.$Api.likePost.replace(":id", this.$route.params.id) +
            "?bbs=forum",
          {},
          this.$root.bearerHeaders()
        )
        .then(response => {
          console.log(response.data);

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
        });
    },

    loadPost() {
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
          this.replies = [];

          for (var i = 0; i < response.data.post.comments.length; i++) {
            this.replies.push(response.data.post.comments[i]);
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

    reloadPost(id) {
      this.$axios
        .get(
          this.$Api.viewPost.replace(":id", id.toString()) + "?bbs=forum",
          this.$root.bearerHeaders()
        )
        .then(response => {
          console.log(response.data);
          console.log(id);
          console.log(this.$Api.viewPost.replace(":id", id) + "?bbs=forum");
          if (!response || response.data.code !== Result.OK.code) {
            return;
          }
          this.replies = [];

          for (var i = 0; i < response.data.post.comments.length; i++) {
            this.replies.push(response.data.post.comments[i]);
            this.replies.showReplies = false;
          }
          response.data.post.comments.forEach(comment => {
            comment.showReplies = false;
          });

          this.post = response.data.post;
        })
        .catch(error => {
          console.log(error);
        });
    },

    view(id) {
      localStorage.removeItem("viewid");
      localStorage.setItem("viewid", id);
      console.log(parseInt(localStorage.getItem("viewid")));
      this.getview_id = parseInt(localStorage.getItem("viewid"));
    }
  },

  created() {
    // this.replys = false;
    // this.getview_id = parseInt(localStorage.getItem("viewid"));
    // console.log(this.getview_id);
    // this.reloadPost(this.getview_id);
    this.loadPost();
    // console.log(localStorage.getItem("nickname"));
  },
};
</script>
