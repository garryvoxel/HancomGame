<template>
    <div id="forum-view">
        <div class="post-view">
            <div class="header">
                <h3 class="subject">{{ post.subject }}</h3>
                <span class="created-at">{{ dateFormat(post.created_at) }}</span>
            </div>

            <div class="post-content" v-html="post.content"></div>

            <div class="menu">
                <div class="left">
                    <router-link
                        :to="{ name: 'news-view', params: { id: post.previous_post_id } }"
                        class="button-rounded-gray"
                        v-if="post.previous_post_id"
                    >
                        <span>&lt;</span>
                        <span>이전 글</span>
                    </router-link>

                    <router-link
                        :to="{ name: 'news-view', params: { id: post.next_post_id } }"
                        class="button-rounded-gray"
                        v-if="post.next_post_id"
                    >
                        <span>다음 글</span>
                        <span>&gt;</span>
                    </router-link>
                </div>
                <div class="right">
                    <router-link :to="{ name: 'news' }" class="button-rounded-red">목록</router-link>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import moment from "moment";
import Result from "../../../utils/result";

export default {
    data() { //변수 초기화
        return {
            post: {}
        };
    },

    watch: {
        $route() {
            this.loadPost();
        }
    },

    methods: {
        dateFormat(datetime) { //날짜 형식 맞추기
            return moment(datetime).utcOffset('+0900').format("YYYY-MM-DD hh:mm:ss");
        },

        formatter(number) { //수값 형식 맞추기
            return number ? new Intl.NumberFormat("ko-KR").format(number) : 0;
        },

        toggleLike() { //이용하지 않음
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

        loadPost() { //게시글 가져오기
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
        }
    },

    created() {
        this.loadPost();
    }
};
</script>