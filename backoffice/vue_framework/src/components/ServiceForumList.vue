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
                                <i class="ti-control-play"></i> 자유게시판관리
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
                            <select class="form-control" v-model="deletedFlag" @change="getForumList()">
                                <option
                                    v-for="option in deletedOptions"
                                    :value="option.value"
                                >{{ option.title }}</option>
                            </select>
                        </div>                        
                        <div class="col-sm-1 my-1">
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
                                    <col  v-if="deletedFlag!=0" width="170">
                                    <col width="*">
                                    <col width="150">
                                    <col width="150">
                                    <col width="150">
                                    <col width="150">
                                </colgroup>
                                <thead>
                                    
                                    <tr>
                                        <th>
                                            <span>
                                                No
                                                
                                            </span>
                                        </th>
                                        <th v-if="deletedFlag!=0">
                                            <span>
                                                삭제일
                                                
                                            </span>
                                        </th>                                          
                                        <th>
                                            <span>
                                                제목
                                                
                                            </span>
                                        </th>
                                        <th>
                                            <span>
                                                작성자
                                                
                                            </span>
                                        </th>
                                        <th>
                                            <span>
                                                작성일
                                                <i class="ti-exchange-vertical" v-on:click="toggleOrderedByCDate()"></i>
                                            </span>
                                        </th>                                        
                                        <th>
                                            <span>
                                                조회수
                                                <i class="ti-exchange-vertical" v-on:click="toggleOrderedByVCnt()"></i>
                                            </span>
                                        </th>
                                        <th>
                                            <span>
                                                공감수
                                                <i class="ti-exchange-vertical" v-on:click="toggleOrderedByLCnt()"></i>
                                            </span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(forum,index) in forumlist" @click="gotoDetail(forum.id)" :style="[forum.deleted_at != null ? {'background-color':'#efefef'}:{}]">
                                        <td>{{ virtualNumber - index }}</td>
                                        <td  v-if="deletedFlag!=0" :style="[forum.deleted_at != null ? {'color':'red', 'font-weight':'bold'}:{}]" >{{ dateTimeFormat(forum.deleted_at) }}</td>                                        
                                        <td  style="word-break: break-all">{{ forum.subject }}</td>
                                        <td>{{ forum.nickname }}</td>
                                        <td>{{ forum.createdDate }}</td>
                                        <td>{{ forum.views }}</td>
                                        <td>{{ forum.likes }}</td>
                                    </tr>
                                    <tr v-if="forumlist.length === 0">
						                <td  v-if="deletedFlag==0" colspan="6" class="clan-empty">등록된 자유게시판글이 없습니다.</td>
                                        <td  v-if="deletedFlag==1" colspan="7" class="clan-empty">등록된 자유게시판글이 없습니다.</td>
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
            deletedOptions: [
                { title: "삭제된 글 제외", value: 0 },
                { title: "삭제된 글 포함", value: 1 },
            ],            
            listScale: [
                { count: 10 },
                { count: 25 },
                { count: 50 },
                { count: 100 }
            ],
            fieldId: 0,
            deletedFlag: 0,
            keyword: "",
            count: 10,
            totalCount: 0,
            totalPageCount: 0,
            startPage: 0,
            endPage: 0,
            currentPage: 1,
            virtualNumber: 0,
            pages: [],
            orderedCDate : 0, // 작성일 0 : 정렬없음, 1: 정렬, 2: 역정렬
            orderedVCnt : 0, // 조회수 0 : 정렬없음, 1: 정렬, 2: 역정렬
            orderedLCnt : 0 // 공감수 0 : 정렬없음, 1: 정렬, 2: 역정렬
        };
    },
    methods: {
        toggleOrderedByCDate() {
            if(this.orderedCDate == 1)  { 
                this.orderedCDate = 2; 
                this.orderedVCnt = 0; 
                this.orderedLCnt = 0;  
                this.getForumList(); return; 
                }
            if(this.orderedCDate == 0 || this.orderedCDate == 2)  { 
                this.orderedCDate = 1; 
                this.orderedVCnt = 0; 
                this.orderedLCnt = 0; 
                this.getForumList(); return; 
                }
        },
        toggleOrderedByVCnt() {
            if(this.orderedVCnt == 1)  { 
                this.orderedCDate = 0;
                this.orderedVCnt = 2; 
                this.orderedLCnt = 0; 
                this.getForumList(); return; 
                }
            if(this.orderedVCnt == 0 || this.orderedVCnt == 2)  { 
                this.orderedCDate = 0;
                this.orderedVCnt = 1; 
                this.orderedLCnt = 0; 
                this.getForumList(); return; 
                }
        },
        toggleOrderedByLCnt() {
            if(this.orderedLCnt == 1)  { 
                this.orderedCDate = 0;
                this.orderedVCnt = 0;
                this.orderedLCnt = 2; 
                this.getForumList(); return; 
                }
            if(this.orderedLCnt == 0 || this.orderedLCnt == 2)  { 
                this.orderedCDate = 0;
                this.orderedVCnt = 0;
                this.orderedLCnt = 1; 
                this.getForumList(); return; 
                }
        },                
        getForumList() {
            let url =
                "/typing/api/service/forum/list?deleted_flag="+ this.deletedFlag +
                (this.count ? "&count=" + this.count : "") +
                (this.currentPage ? "&page=" + this.currentPage : "") +
                (this.keyword
                    ? "&fieldId=" + this.fieldId + "&keyword=" + this.keyword
                    : "") + 
                (this.orderedCDate > 0 ? "&ordered_by=created_at"+(this.orderedCDate == 1 ? "&ordered_to=ASC":"&ordered_to=DESC")  : "")+
                (this.orderedVCnt > 0 ? "&ordered_by=views"+(this.orderedVCnt == 1 ? "&ordered_to=ASC":"&ordered_to=DESC")  : "")+
                (this.orderedLCnt > 0 ? "&ordered_by=likes"+(this.orderedLCnt == 1 ? "&ordered_to=ASC":"&ordered_to=DESC")  : "")
                    ;
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
                                this.$parent.currentPage = response.data.result.pagination.currentPage;
                                this.totalPageCount =   response.data.result.pagination.totalPageCount;
                                this.startPage =        response.data.result.pagination.firstPage;
                                this.endPage =          response.data.result.pagination.lastPage;
                                this.pages =            this.makePages(this.startPage, this.endPage);
                                break;

                            default:
                                alert(
                                    "자유게시판의 글목록을 가져오는데 실패 했습니다.\n다시 시도해 주세요.\n"
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
            //window.location.href = "/typing/service/forum/" + id + "/detail";
            let searchOpstion =  {
                deleted_flag: this.deletedFlag ,
                count: this.count ,
                currentPage: this.currentPage,
                fieldId: this.fieldId,
                keyword: this.keyword
            };

            let q = btoa(encodeURI(JSON.stringify(searchOpstion)));
            window.location.href = "/typing/service/forum/" + id + "/detail?q="+q;            
        },
        gotoCreate() {
            window.location.href = "/typing/service/forum/form";
        },
        updateFavor(){
            this.$refs.favor_zone.updateFavorZone();
        },
        dateFormat(datetime) {
            return moment(datetime).utcOffset('+0900').format("YYYY-MM-DD");
        },
        dateTimeFormat(datetime) {
            if(datetime === null) return '';
            return moment(datetime).utcOffset('+0900').format("YYYY-MM-DD HH:mm:ss");
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
        }            
    },
    created(){
        this.startProcess();
    }
};
</script>