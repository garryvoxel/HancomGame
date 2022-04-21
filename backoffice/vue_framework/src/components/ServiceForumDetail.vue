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
                                <i class="ti-control-play"></i> 자유게시판 관리
                            </h4>
                        </div>
                    </div>
                </div>
            </div>
            <!-- search area end -->
            <div class="row">
                <!-- data table start -->
                <div class="col-12">
                    <div class="data-tables">
                        <div class="tablewrap2">
                            <table class="tbsty02 text-center">
                                <colgroup>
                                    <col width="150">
                                    <col width="*">
                                </colgroup>
                                <tbody>
                                    <tr>
                                        <th>원본 게시물 링크</th>
                                        <td class>
                                            <div class="col-sm-12 text-left">
                                                <a v-bind:href="getFrontDoamin()" target="_blank">{{getFrontDoamin()}}</a>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>
                                            <span v-if="forumInfo.deleted_at != null" style="color:red">삭제됨<br></span>
                                            게시물 제목
                                        </th>
                                        <td>
                                            <div class="col-sm-12">
                                                <div class="input-group">
                                                    <input
                                                        type="text"
                                                        class="form-control"
                                                        placeholder="제목"
                                                        v-model="subject"
                                                    >
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>게시물 내용</th>
                                        <td>
                                            <div class="col-sm-12">
                                                <textarea
                                                    id="content"
                                                    style="width:100%;"
                                                >{{ content }}</textarea>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>게시물 작성자</th>
                                        <td>
                                            <div class="form-row align-items-center pl-3">
                                                <div class="col-sm-4 my-1">
                                                    <div class="input-group">
                                                        <input type="text" class="form-control" v-model="author_nickname">
                                                    </div>
                                                </div>
                                                <div class="col-auto my-1">
                                                    <button
                                                        type="submit"
                                                        class="btn btn-warning"
                                                        v-on:click="userInfoOpen(forumInfo.author_id)"
                                                    >회원정보</button>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>댓글 내용</th>
                                        <td>
                                            <div class="col-sm-12">
                                                <table class="tbsty02 " style="text-align:left">
                                                    <colgroup>
                                                        <col width="70">
                                                        <col width="*">
                                                        <col width="200">
                                                        <col width="100">
                                                    </colgroup>
                                                    <tbody>
                                                        <tr v-for="comment in commentInfo" :style="[comment.deleted_at != null ? {'background-color':'#efefef'}:{}]">
                                                            <th >
                                                                <span v-if="comment.deleted_at != null" style="color:red">삭제됨<br></span>
                                                            </th>
                                                            <td  >
                                                                <span v-if="comment.parent_id">&nbsp;&nbsp;&nbsp;└&nbsp;</span>
                                                                <!--{{comment.id}} /--> {{comment.comment}}</td>
                                                            <td >
                                                                {{comment.nickname}}
                                                            </td>
                                                            <td>
                                                                <button class="btn btn-default btn-danger" v-if="comment.deleted_at == null" @click.prevent="doDeleteComment(comment.id)">삭제</button>
                                                                <button class="btn btn-default btn-secondary"  v-if="comment.deleted_at != null" @click.prevent="doReliveComment(comment.id)">복원</button>
                                                            </td>
                                                        </tr>
                                                        <tr v-if="!commentInfo.length">
                                                           <td colspan="3">댓글이 없습니다.</td> 
                                                        </tr>
                                                    </tbody>
                                                </table>                                                
                                            </div>
                                        </td>
                                    </tr>                                    
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div class="col-12 text-center mt-5">
                        <button class="btn btn-flat btn-secondary" v-on:click="goBack">목록으로</button>
                        <button v-on:click.prevent="doDelete" class="btn btn-flat btn-danger">해당 게시물 삭제</button>
                        <button class="btn btn-default btn-secondary"   v-if="forumInfo.deleted_at != null" @click.prevent="doRelive()">복원</button>
                       
                    </div>
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
import WebConfig from '@/../config/web.config'

export default {
    name: "serviceForumList",
    components: {
        "header-area": HeaderArea,
        "favor-zone": FavorZone,
        "page-title-area": PageTitleArea
    },
    data(){
        return{

            type:''
            , forumInfo : {}
            , subject: ''
            , content: ''
            , author_nickname: ''
            , editor: []
            , commentInfo: [],
        }
    },
    methods: {
        goBack() {
            //검색 옵션을 유지해서 뒤로 갈수 있도록 수정
            //this.$router.go(-1);
            //alert(this.$route.query.q);
            let searchValue = JSON.parse(decodeURI(atob(this.$route.query.q)));
            window.location.href="/typing/service/forum/list?q="+this.$route.query.q;            
        },
        getForumInfo(){
            this.$axios
                .get('/typing/api/service/forum/'+this.id+'/info')
                .then( response => {
                    //alert(response.data.result.forumInfo);
                    this.forumInfo = response.data.result.forumInfo;
                    this.subject = response.data.result.forumInfo.subject;
                    this.content = response.data.result.forumInfo.content;
                    this.author_nickname = response.data.result.userInfo.nickname;
                    this.commentInfo = response.data.result.commentInfo;
                });            
        },
        updateFavor(){
            this.$refs.favor_zone.updateFavorZone();
        },
        doDelete(){
            if(confirm('해당글을 삭제 처리 하시겠습니까?')){
                this.$axios
                .post('/typing/api/service/forum-report-post/dodelete',{
                    id: this.id
                })
                .then(response=>{

                    if (typeof response == "undefined") {
                        alert(
                            "서버와 통신이 원활하지 않습니다.\n잠시후 다시 시도해 주세요."
                        );
                        return;
                    } else {
                        //alert(JSON.stringify(response.data));
                        switch (response.data.code) {
                            case ResponseCode.UNAUTHORIZED.code:
                                this.$root.deleteCookieNGoToLogin();
                                break;

                            case ResponseCode.NO_AUTHORITY.code:
                                alert('해당 페이지에 접근할 권한이 없습니다.');
                                return;
                                break;
                                
                            case ResponseCode.PASSWORDEXPIRE.code:
                                return;
                                break;

                            case ResponseCode.OK.code:
                                alert('글이 삭제되었습니다.');
                                this.getForumInfo();
                                break;

                            default:
                                alert(
                                    "글 삭제 처리에 실패 했습니다.\n다시 시도해 주세요.\n"
                                    +response.data.code+ "::" +response.data.message
                                );
                        } //switch

                    } //if else   
                })
            }
        }, 
        doRelive(){
            if(confirm('삭제된 글을 복원 처리 하시겠습니까?')){
                this.$axios
                .post('/typing/api/service/forum-report-post/dorelive',{
                    id: this.id
                })
                .then(response=>{

                    if (typeof response == "undefined") {
                        alert(
                            "서버와 통신이 원활하지 않습니다.\n잠시후 다시 시도해 주세요."
                        );
                        return;
                    } else {
                        //alert(JSON.stringify(response.data));
                        switch (response.data.code) {
                            case ResponseCode.UNAUTHORIZED.code:
                                this.$root.deleteCookieNGoToLogin();
                                break;

                            case ResponseCode.NO_AUTHORITY.code:
                                alert('해당 페이지에 접근할 권한이 없습니다.');
                                return;
                                break;
                                
                            case ResponseCode.PASSWORDEXPIRE.code:
                                return;
                                break;

                            case ResponseCode.OK.code:
                                alert('삭제된 글이 복원되었습니다.');
                                this.getForumInfo();
                                break;

                            default:
                                alert(
                                    "글 삭제 처리에 실패 했습니다.\n다시 시도해 주세요.\n"
                                    +response.data.code+ "::" +response.data.message
                                );
                        } //switch

                    } //if else   
                })
            }
        },        
        doDeleteComment(comment_id){
            if(confirm('해당 댓글을 삭제 처리 하시겠습니까?')) {
                this.$axios
                .post('/typing/api/service/forum-report-comment/dodelete',{
                    id: comment_id
                })
                .then(response=>{

                    if (typeof response == "undefined") {
                        alert(
                            "서버와 통신이 원활하지 않습니다.\n잠시후 다시 시도해 주세요."
                        );
                        return;
                    } else {
                        //alert(JSON.stringify(response.data));
                        switch (response.data.code) {
                            case ResponseCode.UNAUTHORIZED.code:
                                this.$root.deleteCookieNGoToLogin();
                                break;

                            case ResponseCode.NO_AUTHORITY.code:
                                alert('해당 페이지에 접근할 권한이 없습니다.');
                                return;
                                break;
                                
                            case ResponseCode.PASSWORDEXPIRE.code:
                                return;
                                break;

                            case ResponseCode.OK.code:
                                alert('글이 삭제되었습니다.');
                                this.getForumInfo();
                                break;

                            default:
                                alert(
                                    "글 삭제 처리에 실패 했습니다.\n다시 시도해 주세요.\n"
                                    +response.data.code+ "::" +response.data.message
                                );
                        } //switch

                    } //if else   
                })
            }
        },
        doReliveComment(comment_id){
            if(confirm('해당 댓글을 다시 살리시겠습니까?')) {
                this.$axios
                .post('/typing/api/service/forum-report-comment/dorelive',{
                    id: comment_id
                })
                .then(response=>{

                    if (typeof response == "undefined") {
                        alert(
                            "서버와 통신이 원활하지 않습니다.\n잠시후 다시 시도해 주세요."
                        );
                        return;
                    } else {
                        //alert(JSON.stringify(response.data));
                        switch (response.data.code) {
                            case ResponseCode.UNAUTHORIZED.code:
                                this.$root.deleteCookieNGoToLogin();
                                break;

                            case ResponseCode.NO_AUTHORITY.code:
                                alert('해당 페이지에 접근할 권한이 없습니다.');
                                return;
                                break;
                                
                            case ResponseCode.PASSWORDEXPIRE.code:
                                return;
                                break;
                                                                
                            case ResponseCode.OK.code:
                                alert('삭제된 댓글을 다시 복원하였습니다.');
                                this.getForumInfo();
                                break;

                            default:
                                alert(
                                    "글 삭제 처리에 실패 했습니다.\n다시 시도해 주세요.\n"
                                    +response.data.code+ "::" +response.data.message
                                );
                        } //switch

                    } //if else   
                })
            }
        },
        getFrontDoamin(){
            return WebConfig.fontDomain+'/community/forum/'+this.id;
        },
        userInfoOpen(author_id){
            window.open("/typing/member/member-management/"+author_id+"/detail");
        }
    },
    created(){
        this.getForumInfo();
    },
    computed: {
        id(){
            return this.$route.params.id;
        }
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
                    self.editor.getById.content.setDefaultFont("나눔고딕", 11);
                },
                fCreator: "createSEditor2"
            });
        });
    } 
};
</script>