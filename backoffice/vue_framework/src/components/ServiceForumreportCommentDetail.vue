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
                                <i class="ti-control-play"></i> 신고관리
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
                                                <a href target="_blank">TODO:http://hancome.com/~~~~</a>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>신고수</th>
                                        <td>
                                            <div class="col-sm-2">
                                                <div class="input-group">
                                                    <input type="number" class="form-control" :value="rs.commentInfo.reports">
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>댓글 내용</th>
                                        <td>
                                            <div class="col-sm-12">
                                                <div class="input-group">
                                                    <textarea
                                                        name="name"
                                                        rows="4"
                                                        class="form-control"
                                                    >{{rs.commentInfo.comment}}</textarea>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>게시물 작성자</th>
                                        <td>
                                            <div class="form-row align-items-center pl-3">
                                                <div class="col-sm-4 my-1">
                                                    <div class="input-group">
                                                        <input type="text" class="form-control" :value="rs.commentInfo.author_nickname">
                                                    </div>
                                                </div>
                                                <div class="col-auto my-1">
                                                    <button
                                                        type="submit"
                                                        class="btn btn-warning"
                                                    >회원정보</button>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>신고자</th>
                                        <td>
                                            <div class="form-row align-items-center pl-3">
                                                <div class="col-sm-4">
                                                    <div class="input-group">
                                                        <input type="text" class="form-control" id> 
                                                    </div>
                                                </div>
                                                <div class="col-auto">
                                                    <button
                                                        type="submit"
                                                        class="btn btn-warning"
                                                    >회원정보</button> //TODO
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>신고사유</th>
                                        <td>
                                            <div class="col-sm-12">
                                                <table class="tbsty03 text-center">
                                                    <colgroup>
                                                        <col width="*">
                                                        <col width="150">
                                                    </colgroup>
                                                    <tbody>
                                                        <tr v-for="report in rs.reportList">
                                                            <th>{{report.reportTypeName}}</th>
                                                            <td>{{report.reportCounts}}</td>
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
                        <button class="btn btn-flat btn-secondary" v-on:click.prevent="doDelete">신고된 게시물 삭제</button>
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
            rs: {}
        }
    },
    methods: {
        goBack() {
            this.$router.go(-1);
        },
        getCommentInfo(){
            this.$axios
                .get('/typing/api/service/forum-report-comment/'+this.id+'/info')
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
                                //alert(JSON.stringify(response.data.result));
                                this.rs = response.data.result;
                                break;

                            default:
                                alert(
                                    "Comment 정보를 가져오는데 실패 했습니다.\n다시 시도해 주세요.\n"
                                    +response.data.code+ "::" +response.data.message
                                );
                        } //switch

                    } //if else   
                })
                .catch(error=>{alert('Catch case: '+error.message);});            
        },
        updateFavor(){
            this.$refs.favor_zone.updateFavorZone();
        },
        doIssueClear(){
            if(confirm('해당 신고건에 대해서 이상없음 처리 하시겠습니까?')){
                this.$axios
                .post('/typing/api/service/forum-report-comment/doissueclear',{
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
                                window.location.href='/typing/service/forum-report-comment/list';
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
                .post('/typing/api/service/forum-report-comment/dodelete',{
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
                                window.location.href='/typing/service/forum-report-comment/list';
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
        }        
    },
    computed: {
        id(){
            return this.$route.params.id;
        }
    },
    created(){
        this.getCommentInfo();
    }
};
</script>