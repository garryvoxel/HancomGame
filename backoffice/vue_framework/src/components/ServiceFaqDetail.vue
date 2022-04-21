<template>
    <div class="main-content">
        <!-- header area start -->
        <header-area/>
        <favor-zone ref="favor_zone"/>
        <!-- header area end -->
        <div class="main-content-inner">
            <!-- page title area start -->
            <page-title-area/>
            <!-- page title area end -->
            <!-- search area start -->
            <div class="spage-title-area">
                <div class="row align-items-center">
                    <div class="col-sm-12">
                        <div class="breadcrumbs-area clearfix">
                            <h4 class="spage-title pull-left">
                                <i class="ti-control-play"></i> FQA 수정
                            </h4>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row">
                <!-- data table start -->
                <div class="col-12">
                    <form id="es-manager-register-form" action="/api/manager/store" method="POST">
                        <div class="data-tables">
                            <div class="tablewrap2">
                                <table class="tbsty02 text-center">
                                    <colgroup>
                                        <col width="150">
                                        <col width="*">
                                    </colgroup>
                                    <tbody>
                                        <tr>
                                            <th>질문</th>
                                            <td>
                                                <div class="col-sm-12">
                                                    <div class="input-group">
                                                        <input
                                                            type="text"
                                                            class="form-control"
                                                            placeholder="제목"
                                                            ref="subject"
                                                            v-model="question"
                                                        >
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>카테고리</th>
                                            <td>
                                                <div class="col-sm-12">
                                                    <div class="input-group">
                                                        <select v-model="selectedCategory">
                                                            <option v-for="category in this.category_options" v-bind:value="category" >{{category}}</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>                                        
                                        <tr>
                                            <th>내용</th>
                                            <td>
                                                <div class="col-sm-12">
                                                        <textarea
                                                            name="name"
                                                            style="width:100%;"
                                                            id="content"
                                                        >{{ content }}</textarea>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>등록일시</th>
                                            <td>
                                                <div class="col-sm-4">
                                                    <div class="input-group">
                                                        {{ created_at }}
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>수정일시</th>
                                            <td>
                                                <div class="col-sm-4">
                                                    <div class="input-group">
                                                        {{ updated_at }}
                                                        {{   }}
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div class="col-12 text-center mt-5">
                            <button
                                v-on:click.prevent="goToBack"
                                class="btn btn-flat btn-secondary"
                            >취소</button>
                            <button
                                v-on:click.prevent="updateFaqInfo"
                                class="btn btn-flat btn-success"
                            >수정</button>
                            <button
                                v-on:click.prevent="deleteFaq"
                                class="btn btn-flat btn-danger"
                            >삭제</button>
                        </div>
                    </form>
                </div>
                <!-- data table end -->
            </div>
        </div>
    </div>
</template>

<script>
import HeaderArea from "@/components/HeaderArea.vue";
import FavorZone from "@/components/FavorZone.vue";
import PageTitleArea from "@/components/PageTitleArea.vue";

import ResponseCode from "@/utils/response_code";
import moment from "moment";

export default {
    name: "faqForm",
    components: {
        "header-area": HeaderArea,
        "favor-zone": FavorZone,
        "page-title-area": PageTitleArea
    },
    data() {
        return {
            category_options: [
                '사용환경'
                ,'기능'
                ,'계정'
                ,'포인트'
                ,'한컴 타자연습'
                ,'문의하기'               
            ],
            selectedCategory: '',
            question: "",
            content: "",
            created_at: "",
            updated_at: "",
            status: 1,
            editor: [],
            isSaving: false
        };
    },
    methods: {
        goToBack() {
            this.$router.go(-1);
        },
        doNothing() {
            //do nothing
        },
        getFaqInfo(){
            //alert(this.id);
            this.$axios
                .get('/typing/api/service/faq/'+this.id+'/info')
                .then(response=>{
                    if (typeof response == "undefined") {
                        alert(
                            "서버와 통신이 원활하지 않습니다.\n잠시후 다시 시도해 주세요."
                        );
                        return;
                    } else {

                        switch (response.data.code) {
                            case ResponseCode.UNAUTHORIZED.code:
                                this.$root.deleteCookieNGoToLogin();
                                return;
                                break;

                            case ResponseCode.NO_AUTHORITY.code:
                                alert('해당 페이지에 접근할 권한이 없습니다.');
                                return;
                                break;

                            case ResponseCode.PASSWORDEXPIRE.code:
                                alert('비밀번호 유효기간(180일)이 지났습니다.\n비밀번호를 변경해 주세요.');
                                window.location.href = "/typing/managers/pwmodifyforce";
                                return;
                                break;

                            case ResponseCode.OK.code:
                                let faqInfo = response.data.result;
                                this.question = faqInfo.question;
                                this.content = faqInfo.answer;
                                this.selectedCategory = faqInfo.category;
                                this.created_at = moment(faqInfo.created_at).utcOffset('+0900').format("YYYY-MM-DD hh:mm:ss");
                                this.updated_at = moment(faqInfo.updated_at).utcOffset('+0900').format("YYYY-MM-DD hh:mm:ss");
                                break;

                            default:
                                alert(
                                    "FAQ 정보를 가져오는데 실패 했습니다.\n다시 시도해 주세요.\n"+response.data.code
                                );
                        }

                    }                    
                })
                .catch(error=>{
                  alert('Catch case: '+error.message);
                });
        }, 
        updateFaqInfo(){
            //editor content sync
            this.editor.getById["content"].exec("UPDATE_CONTENTS_FIELD", []);

            this.$axios
                .post('/typing/api/service/faq/'+this.id+'/update',{
                    question: this.question
                    , category: this.selectedCategory
                    , answer: document.getElementById("content").value
                })
                .then(response=>{
                    if (typeof response == "undefined") {
                        alert(
                            "서버와 통신이 원활하지 않습니다.\n잠시후 다시 시도해 주세요."
                        );
                        return;
                    } else {

                        switch (response.data.code) {
                            case ResponseCode.UNAUTHORIZED.code:
                                this.$root.deleteCookieNGoToLogin();
                                return;
                                break;

                            case ResponseCode.NO_AUTHORITY.code:
                                alert('해당 페이지에 접근할 권한이 없습니다.');
                                return;
                                break;

                            case ResponseCode.PASSWORDEXPIRE.code:
                                return;
                                break;

                            case ResponseCode.OK.code:
                                alert('FAQ 정보가 갱신되었습니다.')
                                window.location.href = "/typing/service/faq/list";
                                break;

                            default:
                                alert(
                                    "FAQ 정보갱신에 실패 했습니다.\n다시 시도해 주세요.\n"
                                    +response.data.code+"::"+response.data.message
                                );
                        } //switch

                    } //else
                })
                .catch(error=>{alert('Catch case: '+error.message);});
        },
        deleteFaq(){
            if(confirm('해당 FAQ를 삭제 하시겠습니까?')){
                this.$axios
                    .post('/typing/api/service/faq/delete',{
                        id: this.id
                    })
                    .then(response=>{
                        if (typeof response == "undefined") {
                            alert(
                                "서버와 통신이 원활하지 않습니다.\n잠시후 다시 시도해 주세요."
                            );
                            return;
                        } else {

                            switch (response.data.code) {
                                case ResponseCode.UNAUTHORIZED.code:
                                    this.$root.deleteCookieNGoToLogin();
                                    return;
                                    break;

                                case ResponseCode.NO_AUTHORITY.code:
                                    alert('해당 페이지에 접근할 권한이 없습니다.');
                                    return;
                                    break;
                                    
                            case ResponseCode.PASSWORDEXPIRE.code:
                                return;
                                break;

                                case ResponseCode.OK.code:
                                    alert('FAQ이 삭제되었습니다.')
                                    window.location.href = "/typing/service/faq/list";
                                    break;

                                default:
                                    alert(
                                        "FAQ 삭제에 실패 했습니다.\n다시 시도해 주세요."
                                    );
                            } //switch

                        } //else
                    })
                    .catch(error=>{alert('Catch case: '+error.message);});
            }
        },
        updateFavor(){
            this.$refs.favor_zone.updateFavorZone();
        }
    },
    computed: {
        id(){
            return this.$route.params.id;
        }
    },
    created(){
        this.getFaqInfo();
    },
    mounted() {
        this.$nextTick(() => {
            const self = this;

            nhn.husky.EZCreator.createInIFrame({
                oAppRef: self.editor,
                elPlaceHolder: "content",
                sSkinURI:
                    "/typing/static/vendors/smarteditor2/SmartEditor2SkinHancom.html",
                htParams: {
                    bUseToolbar: true, // 툴바 사용 여부 (true:사용/ false:사용하지 않음)
                    bUseVerticalResizer: false, // 입력창 크기 조절바 사용 여부 (true:사용/ false:사용하지 않음)
                    bUseModeChanger: false, // 모드 탭(Editor | HTML | TEXT) 사용 여부 (true:사용/ false:사용하지 않음)
                    //bSkipXssFilter : true,		// client-side xss filter 무시 여부 (true:사용하지 않음 / 그외:사용)
                    //aAdditionalFontList : aAdditionalFontSet,		// 추가 글꼴 목록
                    fOnBeforeUnload: function() {
                        //alert("완료!");
                    },
                    I18N_LOCALE: "ko_KR"
                }, //boolean
                fOnAppLoad: function() {
                    //예제 코드
                    //oEditors.getById["ir1"].exec("PASTE_HTML", ["로딩이 완료된 후에 본문에 삽입되는 text입니다."]);
                    self.editor.getById.content.setDefaultFont("나눔고딕", 12);
                },
                fCreator: "createSEditor2"
            });
        });
    }  
};
</script>