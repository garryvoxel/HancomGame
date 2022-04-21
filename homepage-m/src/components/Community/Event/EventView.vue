<template>
    <div class="page-container">
        <div class="page-wrapper page-community eventview">
            <Header/>
            <SideMenu />
            <section class="main-content">
                <header class="page-header">
                    <h1 class="page-title">이벤트</h1>
                </header>
                <div class="sub-wrap p-3">
                    <section class="post-view">
                        <header clahss="post-header">
                        <div class="post-subject">
                            <h5>{{ post.subject }}</h5>
                        </div>
                        <div class="post-author">
                            <div class="post-author-col"></div>
                            <div class="post-author-col">{{ createdAt(post.created_at) }}</div>
                        </div>
                        </header>
                        <article class="post-content">
                            <div v-html="post.content"></div>
                        </article>
                    </section>
                    <div class="row p_10">
                        <div class="col-8 text-left">
                            <button
                                v-if="post.previous_post_id"
                                class="btn btn-dark btn-xs"
                                @click="view(post.previous_post_id)"
                            >이전글</button>&nbsp;
                           <button
                                v-if="post.next_post_id" 
                                class="btn btn-dark btn-xs"
                                @click="view(post.next_post_id)"
                            >다음글</button>
                        </div>
                        <div class="col-4 text-right">
                            <router-link :to="{ name: 'event' }" class="btn btn-dark btn-xs">목록</router-link>
                        </div>
                    </div>
                </div>
            </section>
            <Footer/>
        </div>
    </div>
</template>

<script>
import Header from '@/components/Header.vue'
import SideMenu from '@/components/SideMenu.vue'
import Footer from '@/components/Footer.vue'
import moment from "moment";
import Result from "@/utils/result";

export default {
    components: {
        Header,
        SideMenu,
        Footer
    },

    data(){
        return{
            show : false,
            activetab : 1,
            tabName1 : 'current w_50p',
            tabName2 : 'w_50p',
            post: {
                id: 12,
                subject: "제목",
                content: "내용.",
                author_id: 24234,
                views: 32,
                likes: 12,
                order: 0,
                created_at: "2019-02-24 12:33:26",
                image_uri : 'https://via.placeholder.com/150x100.png', 
            }
        }
    },
    
    methods:{
        createdAt(createdAt) {
            return moment(createdAt).format("YYYY-MM-DD");
            console.log(post.subject);
        },

        formatter(number) {
            return number ? new Intl.NumberFormat("ko-KR").format(number) : 0;
        },

        reloadPost(id){
            this.$axios
                .get(
                    this.$Api.viewPost.replace(":id", id) +
                        "?bbs=forum",
                    this.$root.bearerHeaders()
                )
                .then(response => {
                    console.log(response.data);

                    if (!response || response.data.code !== Result.OK.code) {
                        return;
                    }

                    response.data.post.comments.forEach(comment => {
                        comment.showReplies = false
                    })

                    this.post = response.data.post;
                })
                .catch(error => {
                    console.log(error);
                });
            
        },

        view(id) {
            this.$router.push({ name: "eventview", params: { id: id } });
            this.reloadPost(id);
        },

        fetchEvent() {
            this.$axios
                .get(this.$Api.viewEvent.replace(':id', this.$route.params.id), this.$root.bearerHeaders())
                .then(response => {
                    console.log(response.data);

                    if (!response || response.data.code !== Result.OK.code) {
                        return;
                    }
                    if(response.data.event === null){
                        alert("존제하지 않는 이벤트 입니다.");
                        this.$router.push({ name: "event" });
                        return;
                    }
                    this.post = response.data.event;
                });
        }
    },

    created() {
        this.fetchEvent()
    }
}
</script>

