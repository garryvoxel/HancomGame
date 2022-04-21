<template>
    <div id="news">
        <form class="post-search" @submit.prevent="search">
            <input type="text" v-model="keyword">
            <button @keyup.enter="search"></button>
        </form>
        <table class="post-list">
            <thead>
                <th class="id">
                    <!--<div>번호</div>-->
                </th>
                <th class="subject">
                    <div>제목</div>
                </th>
                <th class="created-at">
                    <div>작성일</div>
                </th>
            </thead>

            <tbody v-if="hasLoaded && !posts.length && !titleposts.length">
                <tr class="no-content">
                    <td colspan="3">게시물이 없습니다.</td>
                </tr>
            </tbody>
             <tbody v-bind:key="titlepost.id" v-for="titlepost in titleposts" >
                <tr @click="view(titlepost.id)" class="titleNoti">
                    <td class="id">{{"[ 공지 ]"}}</td>
                    <td class="subject">{{ titlepost.subject }}</td>
                    <td class="created-at">{{ createdAt(titlepost.created_at) }}</td>
                </tr>
            </tbody>
            <tbody v-bind:key="post.id" v-for="post in posts" >
                <tr v-if="post.order ===0" @click="view(post.id)">
                    <td class="id">{{"[ 공지 ]"}}</td>
                    <td class="subject">{{ post.subject }}</td>
                    <td class="created-at">{{ createdAt(post.created_at) }}</td>
                </tr>
             
            </tbody>
        </table>
        <pagination :current="page" :totalCount="totalCount"/>
    </div>
</template>

<script>
import moment from "moment";
import Result from "../../../utils/result";

export default {
    data() { //변수 초기화
        return {
            keyword: "",
            totalCount: 0,
            posts: [],
            hasLoaded: false,
            titleposts:[],
        };
    },

    computed: {
        page() { //페이지번호 세팅
            return this.$route.query.page || 1;
        }
    },

    watch: {
        $route() {
            this.fetchNews();
        },
    },

    methods: {
        search() { //게시물 검색
            if(this.keyword === ""){
                this.$router.push('/community/news');
                this.keyword = "";
                this.fetchNews();
            }else{
                //console.log(this.keyword);
                this.$router.push({path: '/community/news', query: {search: this.keyword}});
                
                this.fetchNews(); 

            }    
            
            // this.$router.push({path: '/community/news?', query: {search: this.keyword}});
            // this.fetchNews();
        },

        view(id) { //게시물 보기페이지로 이행
            this.$router.push({ name: "news-view", params: { id: id } });
        },

        dateFormat(datetime) { //날짜 형식 맞추기
            return moment(datetime).utcOffset('+0900').format("YYYY-MM-DD");
        },

        createdAt(createdAt) { //작성날짜 형식 맞추기
            return moment(createdAt).utcOffset('+0900').format("YYYY-MM-DD");
        },

        formatter(number) {//수값형식 맞추기
            return number ? new Intl.NumberFormat("ko-KR").format(number) : 0;
        },

        fetchNews() { //게시물들을 불러오기
            this.titleposts = [];
            this.posts = [];
            this.$EventBus.$emit("loading-add", "fetchNews");
            const args = {
                bbs: "news",
                page: this.page,
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
                                return (
                                    key + "=" + encodeURIComponent(args[key])
                                );
                            })
                            .join("&"),
                    this.$root.bearerHeaders()
                )
                .then(response => {
                    //console.log(response.data);
                    
                    this.hasLoaded = true;
                    this.posts = [];
                    this.titleposts = [];
                    if (!response || response.data.code !== Result.OK.code) {
                        return;
                    }
                    this.totalCount = response.data.totalCount;

                    for(var i=0; i<response.data.items.length; i++){
                        if(response.data.items[i].is_private === 0 && response.data.items[i].order === 0){
                            this.posts.push(response.data.items[i]);
                        }
                        if(response.data.items[i].order !== 0)
                        {
                            this.titleposts.push(response.data.items[i]);
                        }
                    }
                    this.titleposts.reverse();
                    console.log(this.titleposts);
                    this.$EventBus.$emit("loading-remove", "fetchNews");
                    this.keyword ="";
                })
                .catch(error => {
                    console.log(error);
                    this.hasLoaded = true;
                    this.$EventBus.$emit("loading-remove", "fetchNews");
                });
        }
    },

    created() { //페이지 초기 로딩
        if(this.keyword === ""){
            this.$router.push('/community/news');
            this.keyword = "";
            this.fetchNews();
        }else{
            this.$router.push({path: '/community/news', query: {search: this.keyword}});
            this.fetchNews();
            this.keyword = "";
        }         
    }
};
</script>
<style>
tr.titleNoti td{
    background-color: #fff2e3;
    font-weight: bold;
}
</style>
