<template>
  <div id="pagination" class="paging">
    <!-- <a class="prevv" @click.prevent="prevv">이전</a> -->
    <a class="prev" @click.prevent="prev">이전</a>

    <span v-for="(n, i) in (endPage - startPage + 1)" :key="i">
      <a
        v-if="parseInt(current) !== n + startPage - 1"
        @click.prevent="page(n + startPage - 1)"
      >{{ n + startPage - 1 }}</a>
      <strong v-if="parseInt(current) == n + startPage - 1">{{ n + startPage - 1 }}</strong>
    </span>

    <a class="next" @click.prevent="next">디음</a>
    <!-- <a class="nextt" @click.prevent="nextt">디음</a> -->
  </div>
</template>

<script>
export default {
  props: ["current", "totalCount", "prevent", "count"],

  data() {
    return {
      pagesPerBlock: 10,
      totalSchoolCount: 0,
      curPage: this.current
    };
  },

  methods: {
    page(n) {
      if (this.prevent) {
        this.$emit("page", n);
        return;
      }

      this.$router.push({ query: { page: n } });
    },

    prev() {
      if (this.current <= 1) {
        alert("첫번째 페이지 입니다.");
        return;
      } else if (this.prevent) {
        this.$emit("prev");
        return;
      } else if (this.current > 1) {
        this.$router.push({ query: { page: parseInt(this.current) - 1 } });
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
        this.$router.push({ query: { page: parseInt(this.current) + 1 } });
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
      return this.totalCount > 0
        ? Math.ceil(this.totalCount / this.itemCountPerPage)
        : 1;
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