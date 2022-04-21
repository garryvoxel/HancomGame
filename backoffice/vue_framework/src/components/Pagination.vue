<template>
    <div class="paging">
        <button v-on:click="goToPage">테스트</button>
        <a v-if="current <= 1" class="prev" v-on:click.prevent="doNothing" >이전</a>
        <!--router-link v-if="current > 1" :to="{ query: { page : current - 1 } }" class="prev">이전</router-link-->

        <span v-for="n in (startPage, endPage)" :key="n.id">
            <!--router-link v-if="current !== n">{{ n }}</router-link-->
            <strong v-if="current === n">{{ n }}</strong>
        </span>

       <a href="" v-if="current >= totalPageCount" class="next" v-on:click.prevent="doNothing">다음</a>
       <!--router-link v-if="current < totalPageCount" :to="{ query: { page : current + 1 } }" class="next">다음</router-link-->
    </div>
</template>

<script>
export default {
    name: 'pagination',
    props: [ 'current', 'totalCount' ],

    data() {
        return {
            itemCountPerPage: 10,
            pagesPerBlock: 10,
        }
    },

    methods: {
        doNothing() {},
        goToPage(){
            this.$parent.$options.methods.getManagerList();
        }
    },

    computed: {
        totalPageCount() {
            return this.totalCount > 0 ? Math.ceil(this.totalCount / this.itemCountPerPage) : 1
        },

        totalBlockCount() {
            return Math.ceil(this.totalPageCount / this.pagesPerBlock)
        },

        currentBlock() {
            return Math.ceil(this.current / this.pagesPerBlock)
        },

        startPage() {
            return (this.currentBlock - 1) * this.pagesPerBlock + 1
        },

        endPage() {
            return Math.min(this.currentBlock * this.pagesPerBlock, this.totalPageCount)
        }
    }
}
</script>

