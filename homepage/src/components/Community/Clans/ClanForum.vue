<template>
    <div id="clan-forum">
        <nav class="tab-rounded">
            <ul>
                <li :class="{ selected : $route.name === 'clans' }">
                    <router-link :to="{ name: 'clans' }" title="전체 클랜">
                        <span class="tab-icon icon-group"></span>
                        <span>전체 클랜</span>
                    </router-link>
                </li>
                <li :class="{ selected : $route.name === 'clan-forum' }">
                    <router-link :to="{ name: 'my-clan' }" title="내 클랜">
                        <span class="tab-icon icon-me"></span>
                        <span>내 클랜</span>
                    </router-link>
                </li>
            </ul>
        </nav>

        <div class="clan-info">
            <div class="clan-name-title">게시판 이름</div>
            <div class="clan-name">{{clanName}} 게시판</div>
        </div>

        <table class="clan-forum-table">
            <thead>
                <tr>
                    <!-- <th><div>번호</div></th> -->
                    <th><div>제목</div></th>
                    <th><div>작성자</div></th>
                    <th><div>작성일</div></th>
                    <th><div>조회수</div></th>
                    <th><div>공감수</div></th>
                </tr>
            </thead>
           <tbody v-if="hasLoaded && posts.length <= 0">
                <tr class="no-content">
                    <td colspan="6">게시물이 없습니다.</td>
                </tr>
            </tbody>

            <tbody v-else>
                <tr v-bind:key="post.id" v-for="post in posts" @click="view(post.id)">
                    <!-- <td class="id">{{ post.id }}</td> -->
                    <td v-if="post.author.secession !== 0" class="subject">탈퇴자의 글로 볼 수 없습니다.</td>
                    <td v-else-if="post.deleted_at === null" class="subject">{{ post.subject }}&nbsp;&nbsp;{{ '[' + post.comments_count +']' }}</td>
                    <td v-else class="subject">관리자에 의해 삭제된 글입니다.&nbsp;&nbsp;{{ '[' + post.comments_count +']' }}</td>
                    <td class="author">{{ post.author.nickname }}</td>
                    <td class="created-at">{{ createdAt(post.created_at) }}</td>
                    <td class="views">{{ formatter(post.views) }}</td>
                    <td class="likes">{{ formatter(post.likes) }}</td>
                </tr>
            </tbody>
        </table>

        <div class="clan-forum-buttons">
            <!-- <button class="button-rounded-red">글쓰기</button> -->
            <router-link 
                :to="{ name: 'clan-forum-write',  params: { clanId: this.clanId, clanName: this.clanName}}" 
                class="button-rounded-red">
                글쓰기
            </router-link>
        </div>

        <pagination :current="page" :totalCount="totalCount" />
    </div>
</template>

<script>
import moment from "moment";
import Result from "../../../utils/result";

export default {
    
    data() { //변수 초기화
        return {
            totalCount: 0,
            posts: [],
            hasLoaded: false,
            isLogin: this.$root.isLoggedIn(),
            clanId: localStorage.getItem("clanId"),
            clanName : localStorage.getItem("clanName"),
        };
    },
    
    computed: {
        page() {     //페이지번호
            return this.$route.query.page || 1;
        }
    },

    watch: {
        $route() { 
            this.fetchPosts();      
        }
    },
    methods: {
        view(id) {  //페이지번호 보관
            localStorage.setItem("pagenum", this.page);
            this.$router.push({ name: "clan-forum-view", params: { id: id }});
        },

        createdAt(createdAt) {
            return moment(createdAt)
                .utcOffset("+0900")
                .format("YYYY-MM-DD");
        },

        formatter(number) {//수값 형식
            return number ? new Intl.NumberFormat("ko-KR").format(number) : 0;
        },

        fetchPosts() { //서버에서 자료가져오기
            //console.log(this.page);
            const args = {
                bbs: "forum_clan",
                page: this.page,
                clan_id: this.clanId
            };
            //console.log(this.args);
     
            this.$axios
                .get(
                    this.$Api.postsClan +
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

                    if (!response || response.data.code !== Result.OK.code) {
                        return;
                    }

                    this.totalCount = response.data.totalCount;
                    this.posts = response.data.items;
                })
                .catch(error => {
                    console.log(error);
                    this.hasLoaded = true;
                });
        },
        
        signInBtn() { //로그인 버튼
            if (!confirm("로그인한 회원만 글쓰기가 가능합니다, 로그인하시겠습니까?")) {
                return;
            }
            //console.log('회원가입으로 이동');
            this.$root.redirectToLogin();
        }
    },

    created() {
        this.fetchPosts();
        if(this.page === null) {
            this.page = 1;
        }
        
    }
}
</script>