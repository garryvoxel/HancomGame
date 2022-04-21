<template>
    <div class="page-container">
        <div class="page-wrapper page-community clan">
            <Header/>
            <SideMenu />
            <section class="main-content">
                <header class="page-header">
                    <h1 class="page-title">클랜게시판</h1>
                </header>
                <div class="sub-wrap p-3">
                    <ul class="nav-tabs1">
                        <ul class="nav-tabs1">
                            <li>
                                <div><router-link style="color : black;" to="/clan">전체클랜</router-link></div>
                            </li>
                            <li class="current">
                                <div><router-link  to="/clan/my"> 내 클랜</router-link></div>
                            </li>
                            <li >
                                <div><router-link style="color : black;" to="/clan/make">클랜만들기</router-link></div>
                            </li>
                        </ul> 
                    </ul>
                    <div class="clanboard">      
                        
                        <table class="tbs02 mt-2" style="width:100%;">
                                <colgroup>
                            <col width="30%">
                            <col width="*">
                                </colgroup>
                                <tbody>
                                    <tr>
                                <th class="tit">클랜게시판</th>
                                <td class="ta_l">
                                </td>
                            </tr>
                            </tbody>
                        </table>
                        <table class="tbs02 mt-2" style="width:100%;">
                            <colgroup>
                                <col width="10%"/>
                                <col width="*"/>
                                <col width="20%"/>
                                <col width="20%"/>
                                <col width="10%"/>
                                <col width="10%"/>
                            </colgroup>
                            <thead>
                                <tr>
                                <!--<th class="first">번호</th>-->
                                <th>제목</th>
                                <th>작성자</th>
                                <th>작성일</th>
                                <!--<th>조회수</th>
                                <th >공감수</th>-->
                                </tr>
                            </thead>
                            <tbody v-if="posts.length <= 0">
                                <tr class="no-content">
                                    <td colspan="6">게시물이 없습니다.</td>
                                </tr>
                            </tbody>
                            <tbody v-else v-for="list in posts">
                                <!--<td>{{list.id}}</td>-->
                                <td v-if="list.author.secession !== 0" style="width : 25%" @click="view(list.id)">탈퇴자의 글로 볼 수 없습니다.</td>
                                <td v-else-if="list.deleted_at === null" style="width : 25%" @click="view(list.id)">{{list.subject }}&nbsp;&nbsp;{{ '[' + list.comments_count + ']'}}</td>
                                <td v-else style="width : 25%" @click="view(list.id)">관리자에 의해 삭제된 글입니다.&nbsp;&nbsp;{{ '[' + list.comments_count + ']'}}</td>
                                <td style="width : 10%">{{list.author.nickname}}</td>
                                <td style="width : 10%">{{createdAt(posts.created_at)}}</td>
                               <!-- <td>{{list.views}}</td>
                                <td class="last">{{list.likes}}</td>-->
                                
                            </tbody>
                            
                        </table>
                        <pagination :current="page" :totalCount="totalCount" class="paging1"/>
                        <div class="row mt-2">
                            <div class="col-4 col-sm-4 text-left">
                                <router-link to="/clan/my" class="btn btn-danger btn-xs" >클랜정보</router-link>
                            </div>
                            <div class="col-4 col-sm-4 text-center">

                            </div>
                            <div class="col-4 col-sm-4 text-right">
                                <router-link to="/clan/board/write" class="btn btn-dark btn-xs">글쓰기</router-link>
                            </div>
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
 data() {
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
        page() {     
            return this.$route.query.page || 1;
        }
    },

    watch: {
        $route() { 
            this.fetchPosts();      
        }
    },
    methods: {
        view(id) {
  
            localStorage.setItem("pagenum", id);
            this.$router.push({ name: "clanboardview", params: { id: id }});
        },

        createdAt(createdAt) {
            return moment(createdAt)
                .utcOffset("+0900")
                .format("YYYY-MM-DD");
        },

        formatter(number) {
            return number ? new Intl.NumberFormat("ko-KR").format(number) : 0;
        },

        fetchPosts() {
            const args = {
                bbs: "forum_clan",
                page: this.page,
                clan_id: this.clanId
            };
     
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
        
        signInBtn() {
            if (!confirm("로그인한 회원만 글쓰기가 가능합니다, 로그인하시겠습니까?")) {
                return;
            }
            this.$root.redirectToLogin();
        }
    },
    components: {
        Header,
        SideMenu,
        Footer
    },

    created() {
        this.fetchPosts();
        if(this.page === null) {
            this.page = 1;
        }
        
    }
     
}

</script>
