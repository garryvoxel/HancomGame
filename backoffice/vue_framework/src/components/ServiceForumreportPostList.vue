<template>
    <div class="main-content">
        <!-- header area start -->
        <header-area/>
        <favor-zone ref="favor_zone"/>
        <!-- header area end -->
        <div class="main-content-inner">
            <!-- page title area start 자유게시판 -->
            <page-title-area/>
            <!-- page title area end -->
            <!-- search area start -->
            <div class="spage-title-area">
                <div class="row align-items-center">
                    <div class="col-sm-12">
                        <div class="breadcrumbs-area clearfix">
                            <h4 class="spage-title pull-left">
                                <i class="ti-control-play"></i> 자유게시판 신고글 관리
                            </h4>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-12 mt-1 sch-zone" style>
                <form>
                    <div class="form-row align-items-center">
                        <div class="col-sm-1 my-1">검색조건</div>
                        <div class="col-sm-2 my-1">
                            <select class="form-control" v-model="fieldId">
                                <option
                                    v-for="option in searchOptions"
                                    :value="option.value"
                                >{{ option.title }}</option>
                            </select>
                        </div>
                        <div class="col-sm-4 my-1">
                            <div class="input-group">
                                <input
                                    type="text"
                                    class="form-control"
                                    placeholder="검색"
                                    v-model="keyword"
                                >
                            </div>
                        </div>
                        <div class="col-auto my-1">
                            <button class="btn btn-warning" v-on:click.prevent="search">검색</button>
                            <button class="btn btn-warning" v-on:click.prevent="searchCancel">검색취소</button>
                        </div>
                    </div>
                </form>
            </div>
            <!-- search area end -->
            <div class="row">
                <!-- data table start -->
                <div class="col-12 mt-5">
                    <div class="data-tables">
                        <div class="row">
                            <div class="col-md-6 pull-left">
                                전체 :
                                <span class="fc_y">{{ this.totalCount }}</span>
                            </div>
                            <div class="col-md-6">
                                <select
                                    class="custom-select custom-select-sm form-control form-control-sm pull-right"
                                    style="width:100px;"
                                    v-model="count"
                                    @change="getForumList()"
                                >
                                    <option
                                        v-for="count in listScale"
                                        :value="count.count"
                                    >{{ count.count }}</option>
                                </select>
                            </div>
                        </div>
                        <div class="tablewrap mt-2">
                            <table class="tbsty01 text-center">
                                <colgroup>
                                    <col width="150">
                                    <col width="*">
                                    <col width="200">
                                    <col width="200">
                                    <col width="200">
                                </colgroup>
                                <thead>
                                    
                                    <tr>
                                        <th>
                                            <span>
                                                No
                                                <i class="ti-exchange-vertical"></i>
                                            </span>
                                        </th>
                                        <th>
                                            <span>
                                                제목
                                                <i class="ti-exchange-vertical"></i>
                                            </span>
                                        </th>
                                        <th>
                                            <span>
                                                작성자
                                                <i class="ti-exchange-vertical"></i>
                                            </span>
                                        </th>
                                        <th>
                                            <span>
                                                신고수
                                                <i class="ti-exchange-vertical"></i>
                                            </span>
                                        </th>
                                        <th>
                                            <span>관리</span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(forum,index) in forumlist" @click="gotoDetail(forum.id)">
                                        <td>{{ virtualNumber - index }}</td>
                                        <td>{{ forum.subject }}</td>
                                        <td>{{ forum.nickname }}</td>
                                        <td>{{ forum.reports }}</td>
                                        <td>
                                            <button
                                                v-on:click.prevent="goToDetail(forum.id)"
                                                class="btn btn-flat btn-success btn-xs"
                                            >신고관리</button>
                                        </td>
                                    </tr>
                                    <tr v-if="forumlist.length === 0">
						                <td colspan="6" class="clan-empty">신고글된 글이 없습니다.</td>
						            </tr>
                                </tbody>
                            </table>
                        </div>
                        <div class="paging">
                            <a v-if="startPage > 1" class="prev" v-on:click.prevent="goToPage(startPage-1)">이전</a>
                            
                            <span
                                v-for="n in pages"
                                :key="n.id"
                                v-on:click.prevent="goToPage(n)"
                            >
                                <a v-if="currentPage !== n">{{ n }}</a>
                                <strong v-if="currentPage === n">{{ n }}</strong>
                                <span></span>
                            </span>
                            
                            <a v-if="endPage < totalPageCount" class="next" v-on:click.prevent="goToPage(endPage+1)">다음</a> 
                        </div>
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
import moment from "moment";

export default {
    name: "serviceForumList",
    components: {
        "header-area": HeaderArea,
        "favor-zone": FavorZone,
        "page-title-area": PageTitleArea
    },
    data() {
        return {
            forumlist: [],
            searchOptions: [
                { title: "전체", value: 0 },
                { title: "제목", value: 1 },
                { title: "내용", value: 2 },
                { title: "작성자", value: 3 }
            ],
            listScale: [
                { count: 10 },
                { count: 25 },
                { count: 50 },
                { count: 100 }
            ],
            fieldId: 0,
            keyword: "",
            count: 10,
            totalCount: 0,
            totalPageCount: 0,
            startPage: 0,
            endPage: 0,
            currentPage: 1,
            virtualNumber: 0,
            pages: []
        };
    },
    methods: {
        getForumList() {
            let url =
                "/typing/api/service/forum-report-post/list?" +
                (this.count ? "count=" + this.count : "") +
                (this.currentPage ? "&page=" + this.currentPage : "") +
                (this.keyword
                    ? "&fieldId=" + this.fieldId + "&keyword=" + this.keyword
                    : "");
            this.$axios
                .get(url, {
                    fieldId: this.fieldId,
                    keyword: this.keyword,
                    count: this.count
                })
                .catch(error => {
                    console.log("Catch:", error);
                })
                .then(response => {
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
                                //alert(JSON.stringify(response.data));
                                this.forumlist =        response.data.result.rows;
                                this.totalCount =       response.data.result.pagination.totalItemCount;
                                this.virtualNumber =    response.data.result.pagination.virutalNumberStart;
                                this.count =            response.data.result.pagination.itemsPerPage;
                                this.currentPage =      response.data.result.pagination.currentPage;
                                this.totalPageCount =   response.data.result.pagination.totalPageCount;
                                this.startPage =        response.data.result.pagination.firstPage;
                                this.endPage =          response.data.result.pagination.lastPage;
                                this.pages =            this.makePages(this.startPage, this.endPage);
                                break;

                            default:
                                alert(
                                    "자유게시판의 신고글 글목록을 가져오는데 실패 했습니다.\n다시 시도해 주세요.\n"
                                    +response.data.code+"::"+response.data.message
                                );
                        } //switch

                    } //if else
                });
        },        
        search() {
            this.currentPage = 1;
            this.getForumList();
        },
        searchCancel() {
            this.keyword = "";
            this.fieldId = 1;
            this.currentPage = 1;
            this.getForumList();
        },
        doNothing() {},
        makePages(min,max){
            var array = [],
            j = 0;
            for(var i = min; i <= max; i++){
            array[j] = i;
            j++;
            }
            return array;
        },
        goToPage(pageNum) {
            this.currentPage = pageNum;
            this.getForumList();
        },
        gotoDetail(id) {
            window.location.href = "/typing/service/forum-report-post/" + id + "/detail";
        },
        updateFavor(){
            this.$refs.favor_zone.updateFavorZone();
        }
    },
    created(){
        this.getForumList();
    }
};
</script>