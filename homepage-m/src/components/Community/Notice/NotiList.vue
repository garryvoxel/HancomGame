<template>
  <div class="page-container">
    <div class="page-wrapper page-community notice">
      <Header/>
      <SideMenu />
      <section class="main-content">
        <header class="page-header">
          <h1 class="page-title">공지사항</h1>
        </header>
        <div class="sub-wrap p-3">
          <table class="tbs02 mt-2" style="width:100%;">
            <colgroup>
              <col width="*" />
              <col width="*" />
              <col width="*" />
              <col width="*" />
            </colgroup>
            <thead>
              <tr>
                <th class="id"></th>
                <th class="subject">제목</th>
                <th class="last">작성일</th>
              </tr>
            </thead>

            <tbody v-if="hasLoaded && !posts.length && !titleposts.length">
              <tr class="no-content">
                <td colspan="3">게시물이 없습니다.</td>
              </tr>
            </tbody>
            <tbody v-for="titlepost in titleposts">
              <tr @click="view(titlepost.id)" class="titleNoti">
                <td class="id">{{"[ 공지 ]"}}</td>
                <td class="subject">{{ titlepost.subject.substring(0,15) }}</td>
                <td class="created-at">{{ createdAt(titlepost.created_at) }}</td>
              </tr>
            </tbody>
            <tbody v-for="post in posts">
              <tr @click="view(post.id)">
                <td class="id">{{"[ 공지 ]"}}</td>
                <td class="subject">{{ post.subject.substring(0,15) }}</td>
                <td class="created-at">{{ createdAt(post.created_at) }}</td>
              </tr>
            </tbody>
          </table>
          <pagination :current="page" :totalCount="totalCount" class="paging1" />
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
      show: false,
      totalCount: 0,
      posts: [],
      titleposts: [],
      hasLoaded: false
    };
  },

  computed: {
    page() {
      return this.$route.query.page || 1;
    }
  },

  watch: {
    $route() {
      this.fetchNews();
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
          { menu_type: 12, Authorization: "Bearer" + this.$root.sessionId() },
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
    search() {
      this.fetchNews();
    },

    view(id) {
      this.$router.push({ name: "noticeview", params: { id: id } });
    },

    createdAt(createdAt) {
      return moment(createdAt).format("YYYY-MM-DD");
    },

    formatter(number) {
      return number ? new Intl.NumberFormat("ko-KR").format(number) : 0;
    },

    fetchNews() {
      this.titleposts = [];
      this.posts = [];
      const args = {
        bbs: "news",
        page: this.page
      };

      if (this.keyword) {
        args.keyword = this.keyword;
      }

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
          this.posts = [];
          this.titleposts = [];
          this.hasLoaded = true;

          if (!response || response.data.code !== Result.OK.code) {
            return;
          }

          this.totalCount = response.data.totalCount;

          for (var i = 0; i < response.data.items.length; i++) {
            if (
              response.data.items[i].is_private === 0 &&
              response.data.items[i].order === 0
            ) {
              this.posts.push(response.data.items[i]);
            }
            if (response.data.items[i].order !== 0) {
              this.titleposts.push(response.data.items[i]);
            }
          }
          console.log(this.titleposts);
          console.log(this.posts);
        })
        .catch(error => {
          this.hasLoaded = true;
          console.log(error);
        });
    }
  },

  created() {
    this.fetchNews();
    this.Log();
  }
};
</script>

<style>
.titleNoti {
  background-color: #fffacd;
  font-weight: bold;
  font-size: 14px;
}
</style>
