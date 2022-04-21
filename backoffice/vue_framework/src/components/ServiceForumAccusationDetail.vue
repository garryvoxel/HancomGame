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
                                <i class="ti-control-play"></i> {{pageTitle}} 신고관리
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
                                                <a href target="_blank"> </a>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>신고수</th>
                                        <td>
                                            <div class="col-sm-2">
                                                <div class="input-group">
                                                    <input type="number" class="form-control" :value="accusationCount" readonly>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th :style= "[(type == 1 || type == 3 ) && target_id == forumInfo.id ? {'background-color':'yellow'} : {}]" >
                                            <span v-if="(type == 1 || type == 3 ) && forumInfo.deleted_at != null" style="color:red">삭제됨<br></span>
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
                                        <th :style= "[(type == 1 || type == 3 ) && target_id == forumInfo.id ? {'background-color':'yellow'} : {}]">게시물 내용</th>
                                        <td >
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
                                                        <input type="text" class="form-control" :value="forumInfo.nickname">
                                                    </div>
                                                </div>
                                                <div class="col-auto my-1">
                                                    <button
                                                        type="submit"
                                                        class="btn btn-warning"
                                                        v-on:click.prevent="userInfoOpen(forumInfo.author_id)"
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
                                                        <tr v-for="comment in commentInfo">
                                                            <th  :style= "[(type == 2 || type == 4 ) && target_id == comment.id ? {'background-color':'yellow'} : {}]">
                                                                <span v-if="comment.deleted_at != null" style="color:red">삭제됨<br></span>
                                                            </th>
                                                            <td  :style= "[(type == 2 || type == 4 ) && target_id == comment.id ? {'background-color':'yellow'} : {}]">
                                                                <span v-if="comment.parent_id">&nbsp;&nbsp;&nbsp;└&nbsp;</span>
                                                                <!--{{comment.id}} /--> {{comment.comment}}</td>
                                                            <td  :style= "[(type == 2 || type == 4 ) && target_id == comment.id ? {'background-color':'yellow'} : {}]">
                                                                {{comment.nickname}}
                                                            </td>
                                                            <td >
                                                                <button class="btn btn-default btn-secondary"  v-if="(type == 2 || type == 4 ) && target_id == comment.id && comment.deleted_at != null" @click.prevent="doRelive()">복원</button>
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
                                    <tr>
                                        <th>신고사유</th>
                                        <td>
                                            <div class="col-sm-12">
                                                <table class="tbsty03 text-center">
                                                    <colgroup>
                                                        <col width="250">
                                                        <col width="150">
                                                        <col width="*">
                                                    </colgroup>
                                                    <tbody>
                                                        <tr >
                                                            <th>신고내용</th>
                                                            <th>신고횟수</th>
                                                            <th>신고자</th>
                                                        </tr>                                                        
                                                        <tr v-for="report in reportsList">
                                                            <th>{{convAccusationStr(report.accustaion_type)}}</th>
                                                            <td>{{report.cnt}}</td>
                                                            <td>{{report.from_nicknames}}</td>
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
                        <button class="btn btn-flat btn-secondary" v-on:click.prevent="goBack">목록으로</button>
                        <button class="btn btn-flat btn-secondary" v-on:click.prevent="doIssueClear">이상없음 처리</button>
                        <button class="btn btn-flat btn-secondary" v-on:click.prevent="doDelete" >신고된 게시물 삭제</button>
                        <button class="btn btn-flat btn-warning" v-on:click.prevent="doRelive" v-if="(type == 1 || type == 3 ) && forumInfo.deleted_at != null" >삭제된 게시물 복원</button>
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

export default {
    name: "serviceForumList",
    components: {
        "header-area": HeaderArea,
        "favor-zone": FavorZone,
        "page-title-area": PageTitleArea
    },
    data(){
        return{
            forumInfo: {}
            , subject: ''
            , content: ''
            , reportsList: []
            , editor: []
            , accusationCount: 0
            , commentInfo: []
            , type: 0
            , target_id: 0
            , pageTitle: ''
            , styleRed: {
                backGround: 'yellow'
            }
        }
    },
    methods: {
        goBack() {
            //this.$router.go(-1);
            let searchValue = JSON.parse(decodeURI(atob(this.$route.query.q)));
            window.location.href="/typing/service/accusation/list?q="+this.$route.query.q;  
        },
        getForumInfo(){
            this.$axios
                .get('/typing/api/service/accusation/'+this.id+'/info')
                .then( response => {
                    
                    if (typeof response == "undefined") {
                        alert(
                            "서버와 통신이 원활하지 않습니다.\n잠시후 다시 시도해 주세요."
                        );
                        return;
                    } else {
                        switch (response.data.code) {
                            case ResponseCode.UNAUTHORIZED.code:
                                this.$root.deleteCookieNGoToLogin();
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
                                //alert(JSON.stringify(response.data.result.articleInfo));
                                this.type = response.data.result.type;
                                this.target_id = response.data.result.target_id;
                                this.forumInfo = response.data.result.articleInfo;
                                this.reportsList  = response.data.result.accusationInfo;
                                this.subject = this.forumInfo.subject;
                                this.content = this.forumInfo.content;
                                this.accusationCount = response.data.result.accusationCount;
                                this.commentInfo = response.data.result.commentInfo;


                                switch(this.type) {
                                    case '1': this.pageTitle = '자유게시판'; break;
                                    case '2': this.pageTitle = '자유게시판 코멘트'; break;
                                    case '3': this.pageTitle = '클랜 자유게시판'; break;
                                    case '4': this.pageTitle = '클랜 자유게시판 코멘트'; break;
                                }
                                break;

                            default:
                                //alert('hi' );
                        } //switch

                    } //if else   
                   
                });            
        },
        doIssueClear(){
            if(confirm('해당 신고건에 대해서 이상없음 처리 하시겠습니까?')){
                //alert(this.type+'/'+this.target_id, );
                this.$axios
                .post('/typing/api/service/accusation/doissueclear',{
                    type: this.type ,
                    target_id: this.target_id
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
                                break;

                            case ResponseCode.NO_AUTHORITY.code:
                                alert('해당 페이지에 접근할 권한이 없습니다.');
                                return;
                                break;

                            case ResponseCode.PASSWORDEXPIRE.code:
                                return;
                                break;

                            case ResponseCode.OK.code:
                                alert('이상없음 처리 했습니다.');
                                window.location.href='/typing/service/accusation/list';
                                break;

                            default:
                                alert(
                                    "이상없음 처리에 실패 했습니다.\n다시 시도해 주세요.\n"
                                    +response.data.code+ "::" +response.data.message
                                );
                        } //switch

                    } //if else                       
                })
            }
        },
        doIssueClear_old(){
            if(confirm('해당 신고건에 대해서 이상없음 처리 하시겠습니까?')){
                this.$axios
                .post('/typing/api/service/forum-report-post/doissueclear',{
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
                                break;

                            case ResponseCode.NO_AUTHORITY.code:
                                alert('해당 페이지에 접근할 권한이 없습니다.');
                                return;
                                break;

                            case ResponseCode.PASSWORDEXPIRE.code:
                                return;
                                break;

                            case ResponseCode.OK.code:
                                alert('이상없음 처리 했습니다.');
                                window.location.href='/typing/service/forum-report-post/list';
                                break;

                            default:
                                alert(
                                    "이상없음 처리에 실패 했습니다.\n다시 시도해 주세요.\n"
                                    +response.data.code+ "::" +response.data.message
                                );
                        } //switch

                    } //if else   
                })
            }
        },
        doDelete(){
            if(confirm('해당 신고건에 대해서 글 삭제 처리 하시겠습니까?')){ 
                this.$axios
                .post('/typing/api/service/accusation/dodelete',{
                    type: this.type ,
                    target_id: this.target_id
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
                                break;

                            case ResponseCode.NO_AUTHORITY.code:
                                alert('해당 페이지에 접근할 권한이 없습니다.');
                                return;
                                break;

                            case ResponseCode.PASSWORDEXPIRE.code:
                                return;
                                break;

                            case ResponseCode.OK.code:
                                alert('신고 대상글을 삭제처리 했습니다.');
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
            if(confirm('삭제된 해당 신고건에 대해서 복원 처리 하시겠습니까?')){ 
                this.$axios
                .post('/typing/api/service/accusation/dorelive',{
                    type: this.type ,
                    target_id: this.target_id
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
                                break;

                            case ResponseCode.NO_AUTHORITY.code:
                                alert('해당 페이지에 접근할 권한이 없습니다.');
                                return;
                                break;
                                
                            case ResponseCode.PASSWORDEXPIRE.code:
                                return;
                                break;

                            case ResponseCode.OK.code:
                                alert('신고 대상글을 복원 처리 했습니다.');
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
        doDelete_old(){
            if(confirm('해당 신고건에 대해서 글 삭제 처리 하시겠습니까?')){
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
                                window.location.href='/typing/service/forum-report-post/list';
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
        updateFavor(){
            this.$refs.favor_zone.updateFavorZone();
        },
        convAccusationStr(aType) {
            switch(aType) {
                case '1' : return '부적절한 홍보 게시글' ; break;
                case '2' : return '음란성' ; break;
                case '3' : return '명예훼손' ; break;
                case '4' : 
                default: return '기타' ; 
            }
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
                    self.editor.getById.content.setDefaultFont("나눔고딕", 14);
                },
                fCreator: "createSEditor2"
            });
        });
    } 
};
</script>