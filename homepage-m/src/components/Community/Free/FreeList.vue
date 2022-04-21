<template>
  <div class="page-container">
    <div class="page-wrapper page-community freeboard">
      <Header/>
      <SideMenu />
      <section class="main-content">
        <header class="page-header">
          <h1 class="page-title">자유게시판</h1>
        </header>
        <div class="sub-wrap p-3">
          <div class="forum-info">
            <ul>
              <li>욕설 및 비방과 같이 타인에게 불쾌감을 주는 게시물을 작성할 경우, 관리자에 의해 게시물이 삭제됩니다.</li>
              <li>신고 누적 횟수에 따라 글쓰기 일정기간 제한 및 계정 삭제가 될 수 있으니 유의하시기 바랍니다.</li>
            </ul>
          </div>
          <table class="tbs02 mt-2" style="width:100%;">
            <colgroup>
              <col width="*" />
              <col width="*" />
              <col width="*" />
              <col width="*" />
            </colgroup>

            <thead>
              <tr>
                <th class="first">번호</th>
                <th>제목</th>
                <th>작성자</th>
                <th>작성일</th>
                <!-- <th>조회</th>
                <th class="last">공감</th>-->
              </tr>
            </thead>
            <tbody v-for="post in posts">
              <tr @click="view(post.id)">
                <td class="first">{{post.id}}</td>
                <td v-if="post.author.secession !== 0">탈퇴자의 글로 볼 수 없습니다.</td>
                <td
                  v-else-if="post.deleted_at === null"
                  class="ta_li"
                  style="width : 50%"
                >{{post.subject.substring(0,9) }}&nbsp;&nbsp;{{ '[' + post.comments_count + ']'}}</td>
                <td
                  v-else
                  class="ta_li"
                  style="width : 50%"
                >관리자에 의해 삭제된 글입니다.&nbsp;&nbsp;{{ '[' + post.comments_count + ']'}}</td>
                <td class>{{post.author.nickname}}</td>
                <td class>{{createdAt(post.created_at)}}</td>
                <!--    <td class="">{{post.views}}</td>
                <td class="last">{{post.likes}}</td>-->
              </tr>
            </tbody>
          </table>

          <pagination :current="page" :totalCount="totalCount" class="paging1" />

          <div class="row mt-4">
            <div class="col-3 col-sm-3 text-left"></div>
            <div class="col-3 col-sm-3 text-center"></div>
            <div class="col-6 col-sm-6 text-right">
              <button @click="write()" class="btn btn-danger btn-xs">글쓰기</button>
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
import moment from "moment";
import Result from "@/utils/result";

export default {
  components: {
    Header,
    SideMenu,
    Footer
  },

  data() {
    return {
      totalCount: 0,
      posts: [],
      hasLoaded: false,
      userCount: 0,
      nickname: localStorage.getItem("nickname")
    };
  },

  computed: {
    page() {
      return this.$route.query.page || 1;
    }
  },

  watch: {
    $route() {
      this.fetchPosts();
    }
  },

  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.$root.registerNicknameIfNotExist();
    });
  },

  methods: {
    Log() {
      this.$axios
        .put(
          this.$Api.logs,
          { menu_type: 14, Authorization: "Bearer" + this.$root.sessionId() },
          this.$root.bearerHeaders()
        )
        .then(response => {
          console.log(response.data);
          if (!response || response.data.code != 1) {
            return;
          }
        })
        .catch(error => {
          console.error(error);
        });
    },
    createdAt(createdAt) {
      return moment(createdAt).format("YYYY-MM-DD");
    },

    view(id) {
      console.log(id);
      localStorage.setItem("viewid", id);
      this.$router.push({ name: "freeview", params: { id: id } });
    },
    formatter(number) {
      return number ? new Intl.NumberFormat("ko-KR").format(number) : 0;
    },

    fetchPosts() {
      const args = {
        bbs: "forum",
        page: this.page
      };
      this.$axios
        .get(
          this.$Api.posts +
            "?" +
            Object.keys(args)
              .map(key => {
                return key + "=" + encodeURIComponent(args[key]);
              })
              .join("&"),
          this.$root.bearerHeaders()
        )
        .then(response => {
          console.log(response.data);
          console.log(this.$Api.posts);
          this.hasLoaded = true;

          if (!response || response.data.code !== Result.OK.code) {
            return;
          }

          this.totalCount = response.data.totalCount;
          this.posts = response.data.items;
          for (var i = 0; i < this.posts.length; i++) {
            if (this.posts[i].author.nickname === this.nickname) {
              this.userCount += 1;
            }
          }
          var t = "33579649";
        })
        .catch(error => {
          console.log(error);
          this.hasLoaded = true;
        });
    },
    write() {
      if (this.$root.isLoggedIn()) {
        if (this.userCount >= 2) {
          alert(
            "등록할 수 있는 게시물의 수를 초과하였습니다.\n나중에 다시 시도해 주세요."
          );
          return;
        } else {
          this.$axios
          .get(
            this.$Api.restricted + '?code=' + Result.NOT_ALLOWED_TO_WRITE.code,
            this.$root.bearerHeaders()
          )
          .then(response => {
            if (!response || response.data.code !== Result.OK.code) {
              alert('게시물을 작성할 수 없습니다.\n나중에 다시 시도해 주세요.');
              return;
            }
            if (response.data.restricted === true) {
              alert('게시물 작성 이용이 제한 되었습니다.');
              return;
            }
          this.$router.push("/free/write");
          })
          .catch(error => {
            alert('게시물을 작성할 수 없습니다.\n나중에 다시 시도해 주세요.');
            return;
          });
        }
      } else {
        if (!confirm('로그인이 필요합니다.\n로그인 하시겠습니까?')) {
          return;
        }
        this.$root.redirectToLoginUrl();
      }
    }
  },

  created() {
    this.fetchPosts();
    this.Log();
    if (this.page === null) {
      this.page = 1;
    }
  }
};
</script>
<style scoped>
.forum-info { 
  margin-bottom: 15px;
}
.forum-info ul {
  list-style: none;
  margin: 0;
  padding: 10px 10px;
  border: 1px solid #dcdcdc;
  background-color: #fdfdfd;
}
.forum-info li {
  position: relative;
  color: #f75259;
  padding-left: 1.2em;
  font-size: 13px;
  line-height: 1.5;
  word-break: keep-all;
}
.forum-info li:before {
  content: "\F06A";
  position: absolute;
  left: 0;
  font-family: 'FontAwesome';
}
.forum-info li + li {
  margin-top: 0.5em;
}

</style>