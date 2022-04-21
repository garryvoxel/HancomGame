<template>
  <div id="rankingpagination" class="paging">
    <!-- <a class="prevv" @click.prevent="prevv">이전</a> -->
    <a class="prev" @click.prevent="prev">이전</a>

    <span v-for="n in (endPage - startPage + 1)">
      <a
        v-if="parseInt(current) !== n + startPage - 1"
        @click.prevent="page(n + startPage - 1)"
      >{{ n + startPage - 1 }}</a>
      <strong v-if="parseInt(current) == n + startPage - 1">{{ n + startPage - 1 }}</strong>
    </span>

    <a class="next" v-on:click.prevent="next">디음</a>
    <!-- <a class="nextt" @click.prevent="nextt">디음</a> -->
  </div>
</template>

<script>
export default {
  props: ["current", "totalCount", "prevent", "count", "redis_total_count"],

  data() {
    return {
      pagesPerBlock: 10,
      totalSchoolCount: 0,
      curPage: this.current
    };
  },

  watch: {
    current(n) {
      console.log("watch rank pagination : " + n);
      this.page(n);
    }
  },

  methods: {
    page(n) {
      if (this.prevent) {
        this.$emit("page", n);
        return;
      }
      if (this.$route.name.match("personal")) {
        this.$store.commit("start_Rank", n * this.$store.state.max_Count - 10);
        this.$store.commit(
          "user_Rank",
          n * this.$store.state.max_Count - this.$store.state.max_Count
        );
        this.$store.commit("page_direction", "page");
        this.$router.push({ query: { page: n } });
      } else {
        this.$store.commit(
          "school_start_Rank",
          n * this.$store.state.school_max_Count - 10
        );
        this.$store.commit(
          "school_user_Rank",
          n * this.$store.state.school_max_Count -
            this.$store.state.school_max_Count
        );
        this.$store.commit("school_page_direction", "page");
        this.$router.push({ query: { page: n } });
      }
    },

    prev() {
      if (this.current <= 1) {
        alert("첫번째 페이지 입니다.");
        return;
      } else if (this.prevent) {
        this.$emit("prev");
        return;
      } else if (this.current > 1) {
        if (this.$route.name.match("personal")) {
          this.$store.commit("page_direction", "prev");
          this.$store.commit(
            "start_Rank",
            this.$store.state.start_Rank - this.$store.state.max_Count
          );
          this.$store.commit(
            "user_Rank",
            this.$store.state.first_user_Rank - this.$store.state.max_Count - 1
          );
          this.$router.push({ query: { page: parseInt(this.current) - 1 } });
        } else {
          this.$store.commit("school_page_direction", "prev");
          this.$store.commit(
            "school_start_Rank",
            this.$store.state.school_start_Rank -
              this.$store.state.school_max_Count
          );

          this.$store.commit(
            "school_user_Rank",
            this.$store.state.school_first_user_Rank -
              this.$store.state.school_max_Count -
              1
          );
          this.$router.push({ query: { page: parseInt(this.current) - 1 } });
        }
      }
    },

    prevv() {
      if ((this.curPage -= 10 <= 1)) {
        this.page(1);
        alert("첫번째 페이지 입니다.");
        return;
      } else if (this.prevent) {
        this.$emit("prevv");
        return;
      } else if (this.current > 1) {
        this.$router.push({ query: { page: parseInt(this.current) - 10 } });
      }
    },

    next() {
      if (this.current >= this.totalPageCount) {
        alert("마지막 페이지 입니다.");
        return;
      } else if (this.prevent) {
        this.$emit("next");
        return;
      } else if (this.current < this.totalPageCount) {
        if (this.$route.name.match("personal")) {
          this.$store.commit("page_direction", "page");
          this.$store.commit(
            "start_Rank",
            this.$store.state.start_Rank + this.$store.state.max_Count
          );
          this.$store.commit("user_Rank", this.$store.state.last_Rank);
          this.$router.push({ query: { page: parseInt(this.current) + 1 } });
        } else {
          this.$store.commit("school_page_direction", "page");
          this.$store.commit(
            "school_start_Rank",
            this.$store.state.school_start_Rank +
              this.$store.state.school_max_Count
          );
          this.$store.commit(
            "school_user_Rank",
            this.$store.state.school_last_Rank
          );
          this.$router.push({ query: { page: parseInt(this.current) + 1 } });
        }
      }
    },

    nextt() {
      if ((this.curPage += 10 >= this.totalPageCount)) {
        //console.log(this.totalPageCount);
        this.page(this.totalPageCount);
        alert("마지막 페이지 입니다.");
        return;
      } else if (this.prevent) {
        this.$emit("next");
        return;
      } else if (this.current <= this.totalPageCount) {
        this.$router.push({ query: { page: this.current + 10 } });
      }
    }
  },

  computed: {
    itemCountPerPage() {
      return this.count || 10;
    },

    totalPageCount() {
      var _idx = this.redis_total_count;
      var _count;
      for (var i = 0; _idx > -10; i++) {
        _idx -= 10;
        _count = i;
      }
      //return this.totalCount > 0 ? Math.floor(this.redis_total_count /this.totalCount) :1;
      console.log("redis_total_count : ", this.redis_total_count);
      console.log("페이지 생성 갯수 : ", _count);

      return _count;
    },

    totalBlockCount() {
      return Math.ceil(this.totalPageCount / this.pagesPerBlock);
    },

    currentBlock() {
      return Math.ceil(this.current / this.pagesPerBlock);
    },

    startPage() {
      return (this.currentBlock - 1) * this.pagesPerBlock + 1;
    },

    endPage() {
      return Math.min(
        this.currentBlock * this.pagesPerBlock,
        this.totalPageCount
      );
    }
  }
};
</script>