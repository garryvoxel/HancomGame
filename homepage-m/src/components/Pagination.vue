<template>
  <div id="pagination" class="paging">
    <a class="prev" @click.prevent="prev">이전</a>

    <span v-for="(n, i) in (endPage - startPage + 1)" :key="i">
      <a
        v-if="parseInt(current) !== n + startPage - 1"
        @click.prevent="page(n + startPage - 1)"
      >{{ n + startPage - 1 }}</a>
      <strong v-if="parseInt(current) == n + startPage - 1">{{ n + startPage - 1 }}</strong>
    </span>

    <a class="next" @click.prevent="next">디음</a>
  </div>
</template>

<script>
export default {
  props: ["current", "totalCount", "prevent", "count"],

  data() {
    return {
      pagesPerBlock: 5
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
      if (this.prevent) {
        this.$emit("prev");
        return;
      }

      if (this.current > 1) {
        this.$router.push({ query: { page: parseInt(this.current) - 1 } });
      }
    },

    next() {
      if (this.prevent) {
        this.$emit("next");
        return;
      }

      if (this.current < this.totalPageCount) {
        this.$router.push({ query: { page: parseInt(this.current) + 1 } });
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