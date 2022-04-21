<template>
  <div id="support">
    <site-header />

    <!-- 본문영역 -->
    <section id="container">
      <div class="content-wrapper">
        <div class="contentService5" style="margin-bottom: 36px;">
          <!-- 타이틀 -->
          <h4 class="page_tit">FAQ</h4>
          <!-- location -->
          <div class="location">
            <ol>
              <li class="home">
                <router-link to="/" title="홈으로">
                  <img src="/images/icon_home.png" alt="홈으로" />
                </router-link>
              </li>
              <li class="on">
                <router-link :to="menu.uri" :title="menu.name">{{ menu.name }}</router-link>
              </li>
              <li>{{ items[$route.name].name }}</li>
            </ol>
          </div>
        </div>

        <div id="faq">
          <form class="search-bar" @submit.prevent="submit">
            <div class="type">
              <select v-model="searchType">
                <option>제목</option>
                <option>내용</option>
              </select>
            </div>
            <input type="text" v-model="keyword" />
            <button></button>
          </form>

          <table class="faq-list">
            <thead>
              <tr>
                <th class="category">
                  <div>구분</div>
                </th>
                <th colspan="2" class="faq-content">
                  <div>자주묻는 질문</div>
                </th>
              </tr>
            </thead>

            <tbody v-if="! faqs.length">
              <tr>
                <td colspan="3" class="no-faqs">FAQ가 없습니다.</td>
              </tr>
            </tbody>

            <tbody v-else>
              <tr
                :class="{ question : faq.type === 'question', answer : faq.type === 'answer', open: index + 1 < faqs.length ? faqs[index + 1].isActive : false }"
                v-for="(faq, index) in faqs"
                :key="faq.id"
                @click="toggle(faq.type, index)"
                v-if="faq.type === 'question' || faq.isActive"
              >
                <td class="category">{{ faq.category }}</td>

                <td class="type-icon" v-if="faq.type === 'question'">
                  <div class="icon-q">Q</div>
                </td>
                <td class="type-icon" v-else>
                  <div class="icon-a">A</div>
                </td>

                <td class="qna" v-html="faq.text"></td>
              </tr>
            </tbody>
          </table>

          <pagination :current="page" :totalCount="totalCount" />
        </div>
      </div>
    </section>

    <site-footer />
  </div>
</template>

<script>
import Result from "../utils/result";

export default {
  name: "support",

  data() {
    return {
      menu: this.$root.menu[this.$options.name],
      items: this.$root.menu[this.$options.name].children,
      faqs: [],
      keyword: "",
      searchType: "제목",
      totalCount: 0
    };
  },

  computed: {
    page() {
      return this.$route.query.page || 1;
    }
  },

  methods: {
    toggle(type, index) { //FAQ내용 보이기
      if (type === "answer") {
        return;
      }

      this.faqs.forEach((faq, i) => {
        if (faq.type === "answer") {
          if (i === index + 1) {
            this.faqs[i].isActive = !this.faqs[i].isActive;
          } else {
            this.faqs[i].isActive = false;
          }
        }
      });
    },

    submit() { //FAQ만들기
      if (this.keyword === "") {
        this.$router.push("/support/faq");

        this.fetchFaqs();
      } else {
        this.$router.push({
          path: "/support/faq",
          query: { search: this.keyword }
        });
        this.fetchFaqs();

        this.keyword = "";
      }
    },

    fetchFaqs() { //FAQ목록 가져오기 함수
      const args = {
        page: this.page
      };

      if (this.keyword) {
        args.search_type = this.searchType;
        args.keyword = this.keyword;
      }
      this.$axios
        .get(
          this.$Api.faqs +
            "?" +
            Object.keys(args)
              .map(key => {
                return key + "=" + encodeURIComponent(args[key]);
              })
              .join("&"),
          this.$root.bearerHeaders()
        )
        .then(response => {
          if (!response || response.data.code !== Result.OK.code) {
            return;
          }

          if (response.data.totalCount && !response.data.itemCount) {
            this.$router.push({ query: { page: 1 } });
            return;
          }

          const convertedItems = [];
          const httpUriRegexp = /([^\S]|^)(((http?\:\/\/)|(https?\:\/\/)|(www\.))(\S+))/gi;

          response.data.items.forEach(item => {
            convertedItems.push({
              category: item.category,
              type: "question",
              text: item.question
            });

            convertedItems.push({
              category: item.category,
              type: "answer",
              text: item.answer,
              isActive: false
            });
          });
          this.totalCount = response.data.totalCount;
          this.faqs = convertedItems;
        });
    }
  },

  // beforeRouteEnter(to, from, next) {
  //     next(vm => {
  //         vm.$root.registerNicknameIfNotExist();
  //     });

  // },
  watch: {
    $route() {
      this.fetchFaqs();
    }
  },
  created() {
    this.$root.sendLog(17);
    if (this.keyword === "") {
      this.$router.push("/support/faq");
      this.fetchFaqs();
    } else {
      this.$router.push({
        path: "/support/faq",
        query: { search: this.keyword }
      });
      this.fetchFaqs();

      this.keyword = "";
    }
    this.searchType = "제목";
  }
};
</script>