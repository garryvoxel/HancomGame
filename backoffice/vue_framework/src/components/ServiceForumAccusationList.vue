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
                                    <col width="50">
                                    <col width="150">
                                    <col width="*">
                                    <col width="150">
                                    <col width="200">
                                    <col width="100">
                                    <col width="200">
                                </colgroup>
                                <thead>
                                    
                                    <tr>
                                        <th>
                                            <span>
                                                <input type="checkbox" @change="doToggleAll()">
                                            </span>
                                        </th>                                        
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
                                                분류
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
                                    <tr v-for="(forum,index) in forumlist">
                                        <td><input type='checkbox' :id="forum.type+'_'+forum.target_id" :value="forum.type+'_'+forum.target_id" v-model="selectedId"></td>
                                        <td>{{ virtualNumber - index }}</td>
                                        <td style="word-break: break-all">{{ forum.subject }}</td>
                                        <td>{{ convTypeStr(forum.type)}}</td>
                                        <td>{{ forum.nickname }}</td>
                                        <td>{{ forum.cnt }}</td>
                                        <td>
                                            <button
                                                v-on:click.prevent="gotoDetail(forum.type, forum.target_id)"
                                                class="btn btn-flat btn-success btn-xs"
                                                v-if="forum.is_complete === 0"
                                            >신고관리</button>
                                            <button
                                                v-on:click.prevent="gotoDetail(forum.type, forum.target_id)"
                                                class="btn btn-flat btn-secondary btn-xs"
                                                v-if="forum.is_complete != 0"
                                            >처리완료</button>                                            
                                        </td>
                                    </tr>
                                    <tr v-if="forumlist.length === 0">
						                <td colspan="7" class="clan-empty">신고글된 글이 없습니다.</td>
						            </tr>
                                </tbody>
                            </table>
                        </div>
                        <div class="row mt-2 ml-1 input-group">
                            <select class="form-control col-md-2 mr-2" v-model="batchActionType">
                                <option value='0'>선택된 게시물 처리내용 선택</option>
                                <option value="1">이상없음 처리</option>
                                <option value="2">신고된 게시물 삭제</option>
                            </select>
                            <button type="button" class="btn btn-primary" v-on:click="setAccusationBatch()">선택된 게시물 일괄처리</button>
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
                { title: "작성자", value: 2 }
            ],
            listScale: [
                { count: 10 },
                { count: 25 },
                { count: 50 },
                { count: 100 }
            ],
            typeStr: { "1": "자유게시판","2":"자게코멘트","3":"클랜게시판","4":"클게코멘트"},
            fieldId: 0,
            keyword: "",
            count: 10,
            totalCount: 0,
            totalPageCount: 0,
            startPage: 0,
            endPage: 0,
            currentPage: 1,
            virtualNumber: 0,
            pages: [],
            selectedId: [],
            toggleAll: 0,
            batchActionType: 0
        };
    },
    methods: {
        getForumList() {
            this.batchActionType = 0;
            this.doClear();
            let url =
                "/typing/api/service/accusation/list?" +
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
                                break;

                            case ResponseCode.NO_AUTHORITY.code:
                                alert('해당 페이지에 접근할 권한이 없습니다.');
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
                                    "신고글 목록을 가져오는데 실패 했습니다.\n다시 시도해 주세요.\n"
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
        gotoDetail(type, target_id) {
            //window.location.href = "/typing/service/accusation/" + type+'_'+target_id + "/detail";
            let searchOpstion =  {
                deleted_flag: this.deletedFlag ,
                count: this.count ,
                currentPage: this.currentPage,
                fieldId: this.fieldId,
                keyword: this.keyword
            };

            let q = btoa(encodeURI(JSON.stringify(searchOpstion)));
            window.location.href = "/typing/service/accusation/" + type+'_'+target_id + "/detail?q="+q;                
        },
        updateFavor(){
            this.$refs.favor_zone.updateFavorZone();
        },
        convTypeStr(type){
            return this.typeStr[type];
        },
        startProcess(){
            if(typeof(this.$route.query.q) == 'undefined') {
                this.getForumList();
            } else{
                //페이지의 검색옵션 복원
                let searchValue = JSON.parse(decodeURI(atob(this.$route.query.q)));
                //alert('이전페이지 검색옵션 있음'+JSON.stringify(searchValue));
                this.deletedFlag = searchValue.deleted_flag;
                this.count = searchValue.count;
                this.currentPage = searchValue.currentPage;
                this.fieldId = searchValue.fieldId;
                this.keyword = searchValue.keyword;

                this.getForumList();               
            };
        },
        doSelectAll(){
            this.doClear();
            for (var i in this.forumlist){
                this.selectedId.push(this.forumlist[i].type+'_'+this.forumlist[i].target_id);
            }
        },
        doToggleAll(){
            if(this.toggleAll == 1) {
                this.doClear();
                this.toggleAll = 0;
            } else {
                this.doSelectAll();
                this.toggleAll = 1;
            }
        },     
        doClear(){
            this.selectedId = [];
        },         
        setAccusationBatch() {
            if(this.batchActionType == 0) {alert('일괄 처리내용을 선택해 주세요.'); return false;}
            if(this.selectedId == ''){
                alert('선택된 신고글이 없습니다.');
            } else {
                alert("선택한 "+this.selectedId.length+"건에 대해서 일괄처리 하시겠습니까?");

                this.$axios
                .post("/typing/api/service/accusation/setbatch", {
                    typeNIds: this.selectedId,
                    actionType: this.batchActionType
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
                                break;

                            case ResponseCode.OK.code:
                                alert('일괄처리 되었습니다.');
                                this.getForumList();
                                 break;
                            default:
                                alert(
                                    "일괄처리에 실패 했습니다.\n다시 시도해 주세요.\n"
                                    +response.data.code+ "::" +response.data.message
                                );
                        } //switch

                    } //if else   
//
                })
                .catch(error=>{alert('Catch case: '+error.message);});
            }
        }     
    },
    created(){
        this.startProcess();
    }
};
</script>