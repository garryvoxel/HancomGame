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
                                <i class="ti-control-play"></i> 상단공지사항
                            </h4>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row">
                <!-- data table start -->
                <div class="col-12">
                    <div class="data-tables">
                        <div class="tablewrap mt-1">
                            <table class="tbsty01 text-center">
                                <colgroup>
                                    <col width="150">
                                    <col width="*">
                                    <col width="150">
                                    <col width="150">
                                    <col width="150">
                                    <col width="120">
                                </colgroup>
                                <thead>
                                    <tr>
                                        <th>
                                            <span>
                                                No
                                                
                                            </span>
                                        </th>
                                        <th>
                                            <span>
                                                제목
                                                
                                            </span>
                                        </th>
                                        <th>
                                            <span>
                                                등록일
                                                
                                            </span>
                                        </th>
                                        <th>
                                            <span>
                                                조회
                                                
                                            </span>
                                        </th>
                                        <th>
                                            <span>
                                                상태
                                                
                                            </span>
                                        </th>
                                        <th>
                                            <span>상단해제</span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(topnews , index) in topnewslist">
                                        <td>
                                            <button class="btn btn-default" v-if="topnews.order != 1"
                                             v-on:click="doTopNewsOrderModify(topnews.id, topnews.order, topnewslist[index-1].id, topnewslist[index-1].order)"
                                            ><i class="fa fa-angle-double-up"></i></button>
                                            <button class="btn" style="background-color:white" v-if="topnews.order == 1">&nbsp;</button>
                                            {{topnews.order}}
                                            <button class="btn btn-default" v-if="topnews.order != 5 && topnews.order != topnewslist.length"
                                            v-on:click="doTopNewsOrderModify(topnews.id, topnews.order, topnewslist[index+1].id, topnewslist[index+1].order)"
                                            ><i class="fa fa-angle-double-down"></i></button>
                                            <button class="btn" style="background-color:white" v-if="topnews.order == 5 || topnews.order == topnewslist.length  ">&nbsp;</button>
                                            </td>
                                        <td @click="goToDetail(topnews.id)">{{topnews.subject}}</td>
                                        <td @click="goToDetail(topnews.id)">{{topnews.createdDate}}</td>
                                        <td @click="goToDetail(topnews.id)">{{topnews.views}}</td>
                                        <td @click="goToDetail(topnews.id)">{{topnews.is_private === 0 ? "공개" : "비공개"}}</td>
                                        <td>
                                            <button
                                                type="submit"
                                                class="btn btn-flat btn-dark btn-xs"
                                                @click.prevent="doUnsetTopNews(topnews.id,topnews.order )"
                                            >상단해제</button>
                                        </td>
                                    </tr>
                                    <tr v-if="topnewslist.length == 0">
                                        <td colspan="6" class="text-center">
                                            상단에 고정된 공지사항이 없습니다.
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <!-- data table end -->
            </div>
            <div class="spage-title-area">
                <div class="row align-items-center">
                    <div class="col-sm-12">
                        <div class="breadcrumbs-area clearfix">
                            <h4 class="spage-title pull-left">
                                <i class="ti-control-play"></i> 일반공지사항
                            </h4>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-12 mt-1 sch-zone" style>
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
                                v-model="keyword"
                                id="es-keyword"
                                type="text"
                                class="form-control"
                                placeholder="검색어"
                            >
                        </div>
                    </div>
                    <div class="col-auto my-1">
                        <button class="btn btn-warning" v-on:click.prevent="search">검색</button>
                        <button class="btn btn-warning" v-on:click.prevent="searchCancel">검색취소</button>
                    </div>
                </div>
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
                                    @change="getNewsList()"
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
                                    <col width="150">
                                    <col width="150">
                                    <col width="150">
                                    <col width="120">
                                </colgroup>
                                <thead>
                                    <tr>
                                        <th>
                                            <span>
                                                ID
                                                
                                            </span>
                                        </th>
                                        <th>
                                            <span>
                                                제목
                                            </span>
                                        </th>
                                        <th>
                                            <span>
                                                등록일
                                                <i class="ti-exchange-vertical"></i>
                                            </span>
                                        </th>
                                        <th>
                                            <span>
                                                조회
                                                <i class="ti-exchange-vertical"></i>
                                            </span>
                                        </th>
                                        <th>
                                            <span>
                                                상태
                                                <i class="ti-exchange-vertical"></i>
                                            </span>
                                        </th>
                                        <th>
                                            <span>상단등록</span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(news,index) in newslist">
                                        <td @click="goToDetail(news.id)">{{ virtualNumber - index }}</td>
                                        <td @click="goToDetail(news.id)">{{ news.subject }}</td>
                                        <td @click="goToDetail(news.id)">
                                            {{ news.createdDate }}<br>
                                            {{ dateTimeFormat(news.created_at)}}
                                        </td>
                                        <td @click="goToDetail(news.id)">{{ news.views }}</td>
                                        <td @click="goToDetail(news.id)">{{ news.is_private === 0 ? "공개" : "비공개" }}</td>
                                        <td>
                                            <button
                                                class="btn btn-flat btn-success btn-xs"
                                                v-if="news.order == 0"
                                                @click.prevent="doSetTopNews(news.id)"
                                            >상단등록</button>
                                            <span v-if="news.order > 0" >상단 {{news.order}}번째</span>
                                        </td>
                                    </tr>
                                    <tr v-if="newslist.length === 0">
						                <td colspan="6" class="clan-empty">등록된 공지사항이 없습니다.</td>
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
                    <div class="col-12 text-center mt-5">
                        <button v-on:click="goToWrite" class="btn btn-flat btn-success">신규등록</button>
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
    name: "newsList",
    components: {
        "header-area": HeaderArea,
        "favor-zone": FavorZone,
        "page-title-area": PageTitleArea
    },
    data() {
        return {
            newslist: [],
            topnewslist: [],
            searchOptions: [
                { title: "전체", value: 0 },
                { title: "제목", value: 1 },
                { title: "내용", value: 2 }
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
        goToWrite() {
            window.location.href = "/typing/service/news/write";
        },
        getNewsList() {
            let url =
                "/typing/api/service/news/list?" +
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
                        switch(response.data.code) {
                            case ResponseCode.UNAUTHORIZED.code : 
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
                                
                            case ResponseCode.PASSWORDEXPIRE.code:
                                alert('비밀번호 유효기간(180일)이 지났습니다.\n비밀번호를 변경해 주세요.');
                                window.location.href = "/typing/managers/pwmodifyforce";
                                return;
                                break;

                            case ResponseCode.OK.code :
                                this.newslist =         response.data.result.rows;
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
                                alert('공지사항 목록을 가져오는데 실패 했습니다.\n다시 시도해 주세요\n'+response.data.message);
                        }
                    }
                })
                .catch(error=>{
                  alert('Catch case: '+error.message);
                });
        },
        getTopNewsList(){
            let _url = '/typing/api/service/topnews/list';
            this.$axios
                .get(_url)
                .then(response=>{
                    //alert(JSON.stringify(response.data.result));
                    this.topnewslist = response.data.result.rows;
                })
        },
        search() {
            this.currentPage = 1;
            this.getNewsList();
        },
        searchCancel() {
            this.keyword = "";
            this.fieldId = 1;
            this.currentPage = 1;
            this.getNewsList();
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
            this.getNewsList();
        },
        goToDetail(id) {
            window.location.href = "/typing/service/news/" + id + "/detail";
        },
        updateFavor(){
            this.$refs.favor_zone.updateFavorZone();
        }, 
        doSetTopNews(newsID) {
            if(confirm('해당 공지사항을 상단 고정 공지사항으로 설정 하시겠습니까?')) {
                this.$axios
                .post('/typing/api/service/topnews/set', {
                    news_id: newsID
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
                        switch(response.data.code) {
                            case ResponseCode.UNAUTHORIZED.code : 
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

                            case ResponseCode.MAXIUM_LIMIT_EXCEEDED.code :
                                alert('상단 공지사항은 최대 5개 까지 설정이 가능합니다.');
                            break;
                            case ResponseCode.OK.code :
                                //alert('상단 공지사항으로 등록되었습니다.');
                                this.getTopNewsList();
                                this.getNewsList();
                            break;

                            default:
                                alert('공지사항 목록을 가져오는데 실패 했습니다.\n다시 시도해 주세요\n'+response.data.message);
                        }
                    }
                })
                .catch(error=>{
                  alert('Catch case: '+error.message);
                });
            }

        },
        doUnsetTopNews(newsID, order) {
            if(confirm('해당 공지사항을 상단 고정 공지사항에서 해지 하시겠습니까?')) {
                this.$axios
                .post('/typing/api/service/topnews/unset', {
                    news_id: newsID,
                    order: order
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
                        switch(response.data.code) {
                            case ResponseCode.UNAUTHORIZED.code : 
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

                            case ResponseCode.OK.code :
                                //alert('상단 공지사항에서 해지되었습니다.');
                                this.getTopNewsList();
                                this.getNewsList();
                            break;

                            default:
                                alert('공지사항 목록을 가져오는데 실패 했습니다.\n다시 시도해 주세요\n'+response.data.message);
                        }
                    }
                })
                .catch(error=>{
                  alert('Catch case: '+error.message);
                });
            }
        }, 
        doTopNewsOrderModify(newsID, order, uNewsID, uOrder) {
            //alert( newsID+" / "+order+" / "+uNewsID+" / "+uOrder );
            let _url="/typing/api/service/topnews/setorder"
            this.$axios
                .post(_url, {
                    news1: newsID ,
                    news1_order: uOrder,
                    news2: uNewsID ,
                    news2_order: order
                })
                .then(response=>{
                    if (typeof response == "undefined") {
                        alert(
                            "서버와 통신이 원활하지 않습니다.\n잠시후 다시 시도해 주세요."
                        );
                        return;
                    } else {
                        switch(response.data.code) {
                            case ResponseCode.UNAUTHORIZED.code : 
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
                                                                
                            case ResponseCode.OK.code :
                                this.getTopNewsList();
                                this.getNewsList();
                            break;

                            default:
                                alert('공지사항 목록을 가져오는데 실패 했습니다.\n다시 시도해 주세요\n'+response.data.message);
                        }
                    }
                })
                .catch(error=>{
                  alert('Catch case: '+error.message);
                });
        },
        dateFormat(datetime) {
            return moment(datetime).utcOffset("+0900").format("YYYY-MM-DD");
        },
        dateTimeFormat(datetime) {
            return moment(datetime).utcOffset("+0900").format("YYYY-MM-DD HH:mm:ss");
        },         
    },
    created() {
        this.getTopNewsList();
        this.getNewsList();
    }
};
</script>