<template>
    <div class="page-container">
        <div class="page-wrapper page-community clanwrite">
            <Header/>
            <SideMenu />
            <section class="main-content">
                <header class="page-header">
                    <h1 class="page-title">클랜게시판</h1>
                </header>
                <div class="sub-wrap p-3">
                    <table class="tbs02 mt-2" style="width:100%;">
                        <colgroup>
                            <col width="30%">
                            <col width="*">
                        </colgroup>
                        <tbody >
                            <tr>
                                <th class="tit">제목</th>
                                <td class="ta_l">
                                    <input type="text" v-model="post.subject"  class="w_100p" name="" id="">
                                </td>
                            </tr>
                            <tr>
                                <th class="tit">내용</th>
                                <td class="ta_l"><textarea id="content" v-model="post.content" name=""  class="w_100p" rows="10"></textarea></td>
                            </tr>
                            
                        </tbody>
                    </table>
                    <div class="row mt-2">
                        <div class="col-4 col-sm-4 text-left" style="margin-bottom:10px;margin-top:10px">
                            <button @click="submit" class="btn btn-danger btn-xs">등록</button>
                        </div>
                        <div class="col-4 col-sm-4 text-center">

                        </div>
                        <div class="col-4 col-sm-4 text-right" style="margin-bottom:10px;margin-top:10px">
                        <router-link to="/clan/board" class="btn btn-dark btn-xs">취소</router-link>
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
import Result from "@/utils/result";
export default {
    components: {
        Header,
        SideMenu,
        Footer,
    },
  data() {
        return {
            MIN_SUBJECT_LENGTH: 5,
            MAX_SUBJECT_LENGTH: 30,
            post: {
                subject: "",
                content: ""
            },
            editor: [],
            isSaving: false,
            clanId: localStorage.getItem("clanId"),
            clanName : localStorage.getItem("clanName")
        };
    },

    methods: {
        submit() {
            if (this.isSaving) {
                alert("저장중입니다. 잠시만 기다려 주세요.");
                return;
            }

            if (!this.post.subject) {
                alert("제목을 입력해주세요.");
                return;
            }

            if (this.post.subject.length < this.MIN_SUBJECT_LENGTH) {
                alert(
                    `제목은 ${this.MIN_SUBJECT_LENGTH}글자 이상 입력해주세요.`
                );
                return;
            }
            if (this.post.subject.length > this.MAX_SUBJECT_LENGTH) {
                alert(
                    `제목은 ${this.MAX_SUBJECT_LENGTH}글자 이상 넘을 수 없습니다.`
                );
                return;
            }

         

            this.isSaving = true;

           this.store();
        },

        store() {
            console.log(this.post.content);
            
            this.$axios
                .put(
                    this.$Api.writeClanPost,
                    {
                        bbs: "forum_clan",
                        subject: this.post.subject,
                        content: this.post.content,
                        clan_id: this.clanId
                    },
                    this.$root.bearerHeaders()
                )
                .then(this.handleResponse)
                .catch(this.handleError);
        },

        update() {
    
            this.$axios
                .post(
                    this.$Api.updateClanPost.replace(":id", this.$route.params.id),
                    {
                        bbs: "forum_clan",
                        subject: this.post.subject,
                        content: this.post.content,
                        clan_id: this.clanId
                    },
                    this.$root.bearerHeaders()
                )
                .then(this.handleResponse)
                .catch(this.handleError);
        },

        handleResponse(response) {
            console.log(response.data);

            this.isSaving = false;
            if(response.data.code === 405 || response.data.code === 406) {
              alert(response.data.word + "은(는) 사용할 수 없습니다.\n올바르게 수정 후 다시 등록해주세요.");
              return;
            }
            
            if (!response || response.data.code !== Result.OK.code) {
              return;
            }

            if (response.data.code === Result.SUBJECT_IS_TOO_SHORT.code) {
              alert("제목이 너무 짧습니다.");
              return;
            }

            this.$router.push({ name: "clanboard" });
        },

        handleError(error) {
            console.log(error);

            this.isSaving = false;
        },

        fetchPost() {
            this.$axios
                .get(
                    this.$Api.viewClanPost.replace(":id", this.$route.params.id) +
                        "?bbs=forum_clan",
                    this.$root.bearerHeaders()
                )
                .then(response => {
                    console.log(response.data);

                    if (!response || response.data.code !== Result.OK.code) {
                        return;
                    }

                    if (
                        this.$route.name === "clan-forum-edit" &&
                        !response.data.post.isEditable
                    ) {
                        alert("잘못된 접근입니다.");
                        this.$router.push({ name: "clan-forum" });
                        return
                    }

                    this.post = response.data.post;
                })
                .catch(error => {
                    console.log(error);
                });
        }
    },

    created() {
        if (this.$route.name === "clan-forum-edit") {
            this.fetchPost();
        }
    },

};

</script>