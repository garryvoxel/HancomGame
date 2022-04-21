<template>
    <div class="page-container">
        <div class="page-wrapper page-community freeview">
            <Header/>
            <SideMenu />
            <section class="main-content">
                <header class="page-header">
                    <h1 class="page-title">클랜게시판</h1>
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
                                <button type="button" class="btn btn-danger btn-xs" @click="report(3)">신고</button>
                            </div>
                        </div>
                    </section>

                    <div class="row p_10">
                        <div class="col-8 text-left">
                            <!-- 
                            <router-link
                                :to="{ name: 'calnboard', params: { id: post.previous_post_id } }"
                                v-if="post.previous_post_id"
                                class="btn btn-dark btn-xs"
                            >이전글</router-link>&nbsp;
                            <router-link
                                :to="{ name: 'clanboard', params: { id: post.next_post_id } }"
                                v-if="post.next_post_id" 
                                class="btn btn-dark btn-xs"
                            >다음글</router-link> 
                            -->
                        </div>
                        <div class="col-4 text-right">
                            <router-link to="/clan/board" class="btn btn-dark btn-xs">목록</router-link>
                        </div>
                    </div>

                    <div class="row p_10" v-if="post.isDeletable">
                        <div class="col-12 text-right">
                            <button type="button" class="btn btn-danger btn-xs" @click.prevent="deletePost">삭제</button>
                        </div>
                    </div>

                    <h4 class="pg_tit1 mt-4">댓글 <span>{{ post.comments_count }}</span></h4>
                    <table class="tbs02 mt-2" style="width:100%;">
                        <colgroup>
                            <col width="*">
                            <col width="20%">
                        </colgroup>
                        <tbody>
                            <tr>
                                <td>
                                    <input v-model="newComment" type="text" class="instb w_100p" name="" id="" placeholder="댓글 입력하세요.">
                                </td>
                                <td>
                                    <button class="btn btn-dark btn-xs" @click="submitComment">등록</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    <table class="tbs02 mt-2" style="width:100%;" v-if="post.comments.length">
                        <colgroup>
                            <col width="*">
                        </colgroup>
                        <tbody  v-for="(item,index) in post.comments">
                            <tr>
                                    <td class="ta_l">
                                        <b><p>{{ item.author.nickname }}</p></b>
                                        <p v-if="item.author.secession !== 0">탈톼자의 글로 볼 수 없습니다.</p>
                                        <p v-else-if="item.deleted_at === null">{{ item.comment }}</p>
                                        <p v-else>관리자에 의해 삭제된 글입니다.</p>
                                        <p class="rly">
                                            <!--<span>답글20</span>-->
                                            <span>{{ dateFormat(item.created_at) }}</span>
                                            <span @click="report(4)">신고</span>
                                            <span v-if="item.author_id == uuid"  class="divider">|</span>
                                            <span v-if="item.author_id == uuid" @click="deleteReply(item.id)" class="divider">삭제</span>
                                           
                                        </p>
                                        <div class="info">
                                            <a 
                                              class="toggle-replies" 
                                              style="border : 1px solid #959595; border-radius : 6px #fff; width : 150px;"
                                              @click.prevent="showReply(index)"
                                            >
                                            <span>답글{{item.children.length}}</span>
                                            </a>
                                        </div>
                                    </td>
                                </tr>
                                <div class="reply-container" v-if="post.comments[index].showReplies">
                                <ul class="reply-list">
                                    <li
                                        class="comment-listitem-reply"
                                        v-for="reply in item.children"
                                        :key="reply.id"
                                    >
                                        <div class="comment-container">
                                            <h5>
                                                <div class="comment-sign"></div>
                                                <div>{{ reply.author.nickname }}</div>
                                            </h5>
                                            <div v-if="reply.author.secession !== 0" class="comment-text">탈퇴자의 글로 볼 수 없습니다.</div>
                                            <div v-else-if="reply.deleted_at === null" class="comment-text" style="margin-top : 25px">{{ reply.comment }}</div>
                                            <div v-else class="comment-text" style="margin-top : 25px">관리자에 의해 삭제된 글입니다.</div>
                                            <div class="freeviewInfo">
                                                <span
                                                    class="created-at"
                                                >{{ dateFormat(reply.created_at) }}</span>
                                                <span class="divider">|</span>
                                                <span class="report" @click="report(4)">신고</span>
                                                 <span v-if="reply.author_id == uuid"  class="divider">|</span>
                                                <span v-if="reply.author_id == uuid" @click="deleteReply(reply.id)" class="divider">삭제</span>
                                            </div>
                                        </div>
                                    </li>
                                        <colgroup>
                                            <col width="*">
                                            <col width="1%">
                                        </colgroup>
                                    <tbody>
                                        <tr>
                                            <td>
                                                <input type="text" class="instb w_100p" v-model="newReplies[index]" name="" id="" placeholder="댓글 입력하세요.">
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
            <Footer/>
            <AccustaionPopUp
                @cancel="cancleReport"
                @continue="sendReport"
                v-if="showAccustaionPopUp"
            />
        </div>
    </div>
</template>

<script>
import Header from '@/components/Header.vue'
import SideMenu from '@/components/SideMenu.vue'
import Footer from '@/components/Footer.vue'
import AccustaionPopUp from "@/components/AccustaionPopUp.vue";
import moment from "moment";
import Result from "@/utils/result";
import { constants } from 'fs';

export default {
  components: {
    Header,
    SideMenu,
    Footer,
    AccustaionPopUp
  },

  data(){
    return{
      post: {
        author: [],
        comments: []
      },
      newComment: "",
      newReplies: [],
      showComments: true,
      reply: [],
      getview_id:0,
      replies:[],
      showAccustaionPopUp: false,
      uuid:localStorage.getItem("uuid"),
      accustaion_type : 0,
      type : 0,
      target_id : 0,
      target_uuid: "",
      desc : "",
      user:{},
      myClanMembers:[],
    }
  },

  watch: {
    $route() {
      this.loadPost();
    }
  },

    methods:{
        loadClanInfo() {
            this.$axios
            .post(this.$Api2.clans.getMyClan,
            { sessionid : this.$root.sessionId()})
            .then(response => {
                if (!response) {
                    return;
                }
                console.log(response.data);
                console.log(this.user);
                
                // for(var i=0; i<response.data.myclanMember.length; i++){
                    // console.log(response.data.myclanMember[i].nickname);
                if(
                  this.post.clan_id !== response.data.myclanMember[0].clan_id ||
                  response.data.result === 2
                ) {
                 alert("잘못된 접근 입니다.");
                 this.$router.push({ name: "home" });
                }
                // }

            })
            .catch(error => {
                this.clanCheck =false;
                console.error(error)
                alert("잘못된 접근 입니다.");
                this.$router.push({ name: "home" });
            })
        },

         fetchUser() {
            console.log("fetchUser");
            this.$axios
                .get(this.$Api.me, this.$root.bearerHeaders())
                .then(response => {
                    console.log(response.data);
                    if (!response || response.data.code !== Result.OK.code) {
                       alert("잘못된 접근 입니다.");
                        this.$router.push({ name: "home" });
                        return;
                    }
                   
                    this.user = response.data.user;
                    this.loadClanInfo();
                    console.log(this.user);
                })
                .catch(error => {
                    console.log(error);
                });
        },

        deletePost() {
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

                    this.$router.push({ name: "clanboard" });
                })
                .catch(error => {
                    console.log(error);
                    this.$EventBus.$emit("loading-remove", "submit");
                });
        },

        deleteReply(deleteId) {
            if (!confirm("정말 삭제하겠습니까?")) {
                return;
            }
            this.$EventBus.$emit("loading-add", "deletePost");
            this.$axios
                .post(
                    this.$Api.deleteClanReply.replace(":id",  deleteId),
                    {
                        bbs: "forum_clan",
                    },
                    this.$root.bearerHeaders()
                )
                .then(response => {
                    if (!response || response.data.code !== Result.OK.code) {
                        return;
                    }
                    alert('댓글 삭제가 완료되었습니다.');
                    this.$EventBus.$emit("loading-remove", "submit");
                    this.$router.go();
                })
                .catch(error => {
                    console.log(error);
                    this.$EventBus.$emit("loading-remove", "submit");
                });
        },

        showReply(index) {
          this.post.comments[index].showReplies = !this.post.comments[index].showReplies;
        },

        dateFormat(datetime) {
          return moment(datetime).format("YYYY-MM-DD hh:mm:ss");
        },

        submitReply(index) {
            if (!this.newReplies[index]) {
                alert("댓글내용을 입력해주세요.");
                return;
            }

            this.submit({
                bbs: 'forum_clan',
                parent_id: this.post.comments[index].id,
                post_id: this.$route.params.id,
                comment: this.newReplies[index],

            })
        },

        submitComment() {
            if (!this.newComment) {
                alert("댓글내용을 입력해주세요.");
                return;
            }

            this.submit({
                bbs: "forum_clan",
                post_id: this.$route.params.id,
                comment: this.newComment
            })
            this.newComment="";
        },

        submit(args) {
            this.$axios
                .put(
                    this.$Api.writeClanComment.replace(
                        ":id",
                        this.post.id
                    ),
                    args,
                    this.$root.bearerHeaders()
                )
                .then(response => {
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
                        comment.showReplies = false
                    })

                    this.post.comments = response.data.comments;

                    this.$router.go();
                    // this.view(this.getview_id);
                })
                .catch(error => {
                    console.log(error);
                });
        },

        view(id) {
           
            this.replys = false;
            localStorage.removeItem('pagenum');
            localStorage.setItem('pagenum',id);
            this.getview_id = parseInt(localStorage.getItem("pagenum"));
            this.loadPost(this.getview_id);
            this.$router.push({ name: "clanboardview", params: { id: this.getview_id } });
            
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
            }else{
                this.showAccustaionPopUp = true;
                this.type = type;
            }  
        },

        cancleReport() {
            this.showAccustaionPopUp = false;
        },

        sendReport(num, description) {
            this.$axios
                .post(
                    this.$Api.accustaion,
                    {
                        accustaion_type : this.accustaion_type,
                        type : this.type,
                        target_id : this.post.id,
                        target_uuid : this.post.author_id,
                        desc : description
                    },
                    this.$root.bearerHeaders()
                )
                .then(response => {
                    if (!response || response.data.code !== Result.OK.code) {
                        return;
                    }
                    if(num === 0){
                        alert('신고 사유를 선택해 주세요');
                        return;
                    }
                    this.cancleReport();
                    alert('신고 처리 되었습니다.');
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
            this.$axios
                .get(
                    this.$Api.viewClanPost.replace(":id", this.$route.params.id) +
                        "?bbs=forum_clan",
                    this.$root.bearerHeaders()
                )
                .then(response => {
                  if (!response || response.data.code !== Result.OK.code) {
                      return;
                  }
                  console.log(response.data);
                  
                  response.data.post.comments.forEach(comment => {
                    comment.showReplies = false
                  })

                  this.post = response.data.post;
                  this.loadClanInfo();

                })
                .catch(error => {
                    console.log(error);
                });
        }
    },
    created() {
        // this.fetchUser();
        this.loadPost();
        // this.getview_id = parseInt(localStorage.getItem("pagenum"));
        // this.loadPost(this.getview_id);
    }
};
</script>
<style>
.licker-button{
    background-image: url(/images/icon_heart_outline.png);
    color: #f75259;
    margin-left: 8px;
    text-align: right;
    background-position: 18px center;
    background-repeat: no-repeat;
    border: 1px solid #959595;
    border-radius: 18px;
    font-size: 16px;
    line-height: 1.6;
    overflow: hidden;
    padding: 2px 10px 8px 40px;
}
</style>
