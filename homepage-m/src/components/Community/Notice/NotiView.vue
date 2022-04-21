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
                    <section class="post-view">
                        <header clahss="post-header">
                        <div class="post-subject">
                            <h5>{{ post.subject }}</h5>
                        </div>
                        <div class="post-author">
                            <div class="post-author-col"></div>
                            <div class="post-author-col">{{ createdAt }}</div>
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
                            <router-link :to="{ name: 'notice' }" class="btn btn-dark btn-xs">목록</router-link>
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
            post: {}
        }
    },

    computed: {
        createdAt() {
            return moment(this.post.creatd_at).format("YYYY-MM-DD");
        }
    },

    watch: {
        $route() {
            this.loadPost();
        }
    },

    methods: {
        formatter(number) {
            return number ? new Intl.NumberFormat("ko-KR").format(number) : 0;
        },

        toggleLike() {
            if (!this.$root.isLoggedIn()) {
                alert("로그인이 필요합니다.");
                return;
            }
            this.$axios
                .post(
                    this.$Api.likePost.replace(":id", this.$route.params.id) +
                        "?bbs=news",
                    {},
                    this.$root.bearerHeaders()
                )
                .then(response => {
                    console.log(response.data);

                    if (!response || response.data.code !== Result.OK.code) {
                        return;
                    }

                    if (response.data.hasUserLiked) {
                        this.post.likes++;
                    } else {
                        this.post.likes = Math.max(0, this.post.likes - 1);
                    }

                    this.post.hasUserLiked = response.data.hasUserLiked;
                })
                .catch(error => {
                    console.log(error);
                });
        },

        loadPost() {
            this.$axios
                .get(
                    this.$Api.viewPost.replace(":id", this.$route.params.id) +
                        "?bbs=news",
                    this.$root.bearerHeaders()
                )
                .then(response => {
                    console.log(response.data);

                    if (!response || response.data.code !== Result.OK.code) {
                        return;
                    }

                    this.post = response.data.post;
                })
                .catch(error => {
                    console.log(error);
                });
        },

        reloadPost(id){
            this.$axios
                .get(
                    this.$Api.viewPost.replace(":id", id) +
                        "?bbs=news",
                    this.$root.bearerHeaders()
                )
                .then(response => {
                    console.log(response.data);

                    if (!response || response.data.code !== Result.OK.code) {
                        return;
                    }

                    this.post = response.data.post;
                })
                .catch(error => {
                    console.log(error);
                });
            
        },

        view(id) {
            this.$router.push({ name: "noticeview", params: { id: id } });
            console.log(id);
            this.reloadPost(id);
        },

    },

    created() {
        this.loadPost();
       
    }
}
</script>

<style>

</style>

<style>
.slide{
  transition: all .1s ease;
  padding-left: 15%;
}
.slide-enter-active {
  transition: all .1s ease;
}
.slide-leave-active {
  transition: all .1s ease;
}
.slide-enter, .slide-leave-to{
  transform: translateX(10px);
}
</style>
