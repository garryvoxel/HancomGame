<template>
    <div class="acco">
        <div  v-if="! faqs.length">
            FAQ 내역이 없습니다.
        </div>
        <div v-else>
            <div class="layer1" v-for="faq in faqs">
                <p class="heading" v-html="faq.question" style="font-weight: bold;"></p>
                <p class="content" v-html="faq.answer"></p>
            </div>
            <!-- <div id="accordion" v-for="faq in faqs">
                <h3><span class="faq_q" v-html="faq.question"></span></h3>
                <div class="faq_a">
                <p v-html="faq.answer"></p>
                </div>
            </div> -->
            <pagination :current="page" :totalCount="totalCount" class="paging1"/>
        </div>
    </div>
</template>

<script>
import Result from "../utils/result";

export default {
    
    data(){
        return{
             keyword: "",
             searchType: "all",
             totalCount: 0,
             faqs:[
                {},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},
                
                // { 
                //     answer: "웹브라우저는 Internet Explorer 11, Chrome 71 이상에서 사용을 권장합니다. ↵단, 윈도우7의 Internet Explorer 11 환경에서 한컴 타자연습 이용시 ↵정상적으로 글자 입력이 안될 수 있으니 가급적 Chrome 브라우저를 사용해주세요!",
                //     category: "사용환경",
                //     id: 18,
                //     question: "권장 사용환경이 어떻게 되나요?"
                // },
                // { question : '질문입니다.', answer: '답변입니다.' },
                // { question : '질문입니다.', answer: '답변입니다.' },
                // { question : '질문입니다.', answer: '답변입니다.' },
                // { question : '질문입니다.', answer: '답변입니다.' },
                // { question : '질문입니다.', answer: '답변입니다.' },
                // { question : '질문입니다.', answer: '답변입니다.' },
                // { question : '질문입니다.', answer: '답변입니다.' },
                // { question : '질문입니다.', answer: '답변입니다.' },
                // { question : '질문입니다.', answer: '답변입니다.' },
                // { question : '질문입니다.', answer: '답변입니다.' },
                // { question : '질문입니다.', answer: '답변입니다.' },
                // { question : '질문입니다.', answer: '답변입니다.' },
                // { question : '질문입니다.', answer: '답변입니다.' },
                // { question : '질문입니다.', answer: '답변입니다.' },
                // { question : '질문입니다.', answer: '답변입니다.' },
                // { question : '질문입니다.', answer: '답변입니다.' },
            ],
        }       
    },

    computed: {
        page() {
            return this.$route.query.page || 1;
        }
    },

    watch: {
        $route() {
            this.fetchFaqs();
        },
    },

    methods: {
        toggle(type, index) {
            if (type === "answer") {
                return;
            }

            this.faqs.forEach((faq, i) => {
                if (faq.type === "answer") {
                    if (i === index + 1) {
                        this.faqs[i].isActive = !this.faqs[i].isActive;
                    } else {
                        this.faqs[i].isActive = false;
                    }
                }
            });
        },

        submit() {
            this.fetchFaqs();
        },

        fetchFaqs() {
            const args = {
                page: this.page
            };

            if (this.keyword) {
                args.search_type = this.searchType;
                args.keyword = this.keyword;
            }

            this.$axios
                .get(
                    this.$Api.faqs +
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
                    console.log(response.data);

                    if (!response || response.data.code !== Result.OK.code) {
                        return;
                    }

                    if (response.data.totalCount && !response.data.itemCount) {
                        this.$router.push({ query: { page: 1 } });
                        return;
                    }

                    const convertedItems = [];
                    const httpUriRegexp = /([^\S]|^)(((http?\:\/\/)|(https?\:\/\/)|(www\.))(\S+))/gi;

                    this.totalCount = response.data.totalCount;
   
                    this.faqs = response.data.items;
                });
        },
    },

    beforeRouteEnter(to, from, next) {
        next(vm => {
            vm.$root.registerNicknameIfNotExist();
        });
    },

    created() {
       this.fetchFaqs();

    },

    mounted() {
        this.$nextTick( function() {
                // $(".layer1").ready();
                $(".content").hide();
                $(".heading").click(function(){
                    $(this).next(".content").slideToggle(300);
                });
            });
        // this.$nextTick( function() {
        // $( "#accordion" ).accordion({
        //     heightStyle: "content"
        //     });
        // });
    }
}
</script>

<style>
.layer1 {
    margin: 0;
    padding: 0;
    width: 100%;
    background-color: #ffffff;
}

.heading {
    margin: 1px;
    padding: 3px 10px;
    cursor: pointer;
    position: relative;
    font-size: 15px;

    background: url(/imgs/faq_q.png) 20px 50% no-repeat;
    padding-left: 50px;
    line-height: 26px;
    display: block;
    font-size: 14px;
}

.content {
    padding: 5px 10px 5px 50px;
    background: url(/imgs/faq_a.png) 20px 50% no-repeat;
    background-color: #ececec;
}

</style>

