<template>
  <div id="forum" style="margin-top :-5%">
    <table class="post-list">
      <thead>
        <tr>
          <th class="id">
            <div>번호</div>
          </th>
          <th class="subject">
            <div>제목</div>
          </th>
          <th class="author">
            <div>작성자</div>
          </th>
          <th class="created-at">
            <div>작성일</div>
          </th>
          <th class="views">
            <div>조회수</div>
          </th>
          <th class="likes">
            <div>공감수</div>
          </th>
        </tr>
      </thead>

      <tbody v-if="hasLoaded && posts.length <= 0">
        <tr class="no-content">
          <td colspan="6">게시물이 없습니다.</td>
        </tr>
      </tbody>

      <tbody v-else>
        <tr v-for="post in posts" @click="view(post.id)" :key="post.id">
          <td class="id">{{ post.id }}</td>
          <td class="subject" v-if="post.author.secession !== 0">
            탈퇴자의 글로 볼 수 없습니다.&nbsp;&nbsp;{{
            '[' + post.comments_count + ']'
            }}
          </td>
          <td
            class="subject"
            v-else-if="post.deleted_at === null"
          >{{ post.subject }}&nbsp;&nbsp;{{ '[' + post.comments_count + ']' }}</td>
          <td class="subject" v-else>
            관리자에 의해 삭제된 글입니다.&nbsp;&nbsp;{{
            '[' + post.comments_count + ']'
            }}
          </td>
          <td class="author">{{ post.author.nickname }}</td>
          <td class="created-at">{{ createdAt(post.created_at) }}</td>
          <td class="views">{{ formatter(post.views) }}</td>
          <td class="likes">{{ formatter(post.likes) }}</td>
        </tr>
      </tbody>
    </table>
    <div class="post-button-row" v-if="isLogin">
      <button style="width : 226px; height : 42px" @click="write()" class="button-rounded-red">글쓰기</button>
    </div>
    <div class="post-button-row" v-else>
      <button class="button-rounded-red" @click="signInBtn">로그인 후 글쓰기</button>
    </div>

    <pagination :current="page" :totalCount="totalCount" />
  </div>
</template>

<script>
import moment from "moment";
import Result from "../../../utils/result";

export default {
  data() { //변수 초기화
    return {
      totalCount: 0,
      posts: [],
      hasLoaded: false,
      isLogin: this.$root.isLoggedIn(),
      forumCount: 0,
      nickname: localStorage.getItem("nickname")
    };
  },

  computed: {
    page() { //페이지번호 세팅
      return this.$route.query.page || 1;
    }
  },

  watch: {
    $route() {
      this.fetchPosts();
    }
  },

  methods: {
    view(id) {
      localStorage.setItem("pagenum", this.page);
      this.$router.push({
        name: "forum-view",
        params: { id: id, page: this.page || 1 }
      });
    },

    createdAt(createdAt) {//날짜 형식 맞추기
      return moment(createdAt)
        .utcOffset("+0900")
        .format("YYYY-MM-DD");
    },
    formatter(number) {
      return number ? new Intl.NumberFormat("ko-KR").format(number) : 0;
    },
    fetchPosts() { //게시물 가져오기 함수
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
          this.hasLoaded = true;
          //console.log(response.data);
          if (!response || response.data.code !== Result.OK.code) {
            return;
          }
          this.totalCount = response.data.totalCount;
          this.posts = response.data.items;
          for (var i = 0; i < this.posts.length; i++) {
            if (this.posts[i].author.nickname === this.nickname) {
              this.forumCount += 1;
            }
          }
          //console.log(this.forumCount);
          //console.log(this.nickname);
        })
        .catch(error => {
          console.log(error);
          this.hasLoaded = true;
        });
    },

    signInBtn() { //로그인 버튼
      if (
        !confirm("로그인한 회원만 글쓰기가 가능합니다, 로그인하시겠습니까?")
      ) {
        return;
      }
      //console.log('회원가입으로 이동');
      this.$root.redirectToLogin();
    },
    write() {
      if (this.$root.isLoggedIn()) {
        if (this.forumCount >= 2) {
          alert(
            "등록할 수 있는 게시물의 수를 초과하였습니다.\n나중에 다시 시도해 주세요."
          );
          return;
        } else {
          this.$axios
            .get(
              this.$Api.restricted +
                "?code=" +
                Result.NOT_ALLOWED_TO_WRITE.code,
              this.$root.bearerHeaders()
            )
            .then(response => {
              //            console.log("write() - response : "+JSON.stringify(response));
              if (!response || response.data.code !== Result.OK.code) {
                alert(
                  "게시물을 작성할 수 없습니다.\n나중에 다시 시도해 주세요."
                );
                return;
              }
              if (response.data.restricted == true) {
                alert("게시물 작성 이용이 제한 되었습니다.");
                return;
              }
              this.$router.push({ name: "forum-write" });
            })
            .catch(error => {
              alert("게시물을 작성할 수 없습니다.\n나중에 다시 시도해 주세요.");
              return;
            });
        }
      } else {
        if (!confirm("로그인이 필요합니다.\n로그인 하시겠습니까?")) {
          return;
        }
        this.$root.redirectToLogin();
      }
    }
  },

  created() {
    this.fetchPosts();
    this.$root.sendLog(14);
    if (this.page === null) {
      this.page = 1;
    }
  }
};
</script>
