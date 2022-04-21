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
                                <i class="ti-control-play"></i> 클랜관리
                            </h4>
                        </div>
                    </div>
                </div>
            </div>

            <div class="data-tables">
                <div class="tablewrap2">
                    <table class="tbsty02 text-center">
                        <colgroup>
                            <col width="150">
                            <col width="*">
                        </colgroup>
                        <tbody>
                            <tr>
                                <th>검색조건</th>
                                <td>
                                    <form>
                                        <div class="col-12 form-row align-items-center">
                                            <div class="col-sm-4 my-1">
                                                <div class="input-group">
                                                    <input v-model="keyword" id="es-keyword" type="text" class="form-control" placeholder="클랜명">
                                                </div>
                                            </div>
                                            <div class="col-auto my-1">
                                                <button class="btn btn-warning" v-on:click.prevent="search">검색</button> &nbsp;
                                                <button class="btn btn-warning" v-on:click.prevent="searchCancel">검색취소</button>
                                            </div>
                                        </div>
                                    </form>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <!-- search area end -->
            <div class="row">
                <!-- data table start -->
                <div class="col-12 mt-5">
                    <div class="data-tables">
                        <div class="row">
                            <div class="col-md-6 pull-left pt-2">전체 :
                                <span class="fc_y">{{ this.totalCount }}</span>
                            </div>
                            <div class="col-md-6">
                                <select
                                    class="custom-select custom-select-sm form-control form-control-sm pull-right"
                                    style="width:100px;"
                                    v-model="count"
                                    @change="getClanList()"
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
                                    <col width="*">
                                    <col width="250">
                                    <col width="120">
                                    <col width="120">
                                </colgroup>
                                <thead>
                                    <tr>
                                        <th>
                                            <span>ID
                                                
                                            </span>
                                        </th>
                                        <th>
                                            <span>클랜명
                                                
                                            </span>
                                        </th>
                                        <th>
                                            <span>클랜소개
                                                
                                            </span>
                                        </th>
                                        <th>
                                            <span>클랜장
                                                
                                            </span>
                                        </th>
                                        <th>
                                            <span>인원수
                                                <i class="ti-exchange-vertical" v-on:click="setOrderedByMemberCnt()"></i>
                                            </span>
                                        </th>
                                        <th>
                                            <span>상태
                                                <i class="ti-exchange-vertical" v-on:click="setOrderedByClanState()"></i>
                                            </span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(clan,index) in clanList" v-on:click="goToDetail(clan.id)">
                                        <td>{{virtualNumber - index}}</td>
                                        <td>{{clan.name}}</td>
                                        <td style="white-space: pre;">{{clan.description}}</td>
                                        <td>{{clan.manager_nickname}}</td>
                                        <td>{{clan.member_count}}</td>
                                        <td v-bind:style= "[clan.is_dell == 1 ? {'color':'red', 'font-weight':'bold'} : {}]">{{clan.is_dell == 1 ? "폐쇄":"정상"}}</td>
                                    </tr>
                                    <tr v-if="clanList.length === 0">
						                <td colspan="6">등록된 클랜이 없습니다.</td>
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

export default {
    name: "clanList",
    components: {
        "header-area": HeaderArea,
        "favor-zone": FavorZone,
        "page-title-area": PageTitleArea
    },
    data(){
        return {
            clanList: [],
            searchOptions : [
                {title: '이름', value: 1 }
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
            pages: [],
            orderedByMemberCnt: 0, // 정렬 0: 없음, 1: ASC, 2: DESC
            orderedByClanState: 0  // 정렬 0: 없음, 1: ASC, 2: DESC

        }
    },
    methods: {
        goToDetail(id) {
            window.location.href='/typing/service/clan/'+id+'/detail';
        },
        setOrderedByMemberCnt() {
            if(this.orderedByMemberCnt == 1)  { 
                this.orderedByMemberCnt = 2; 
                this.orderedByClanState = 0;
                this.getClanList(); return; 
                }
            if(this.orderedByMemberCnt == 0 || this.orderedByMemberCnt == 2)  { 
                this.orderedByMemberCnt = 1; 
                this.orderedByClanState = 0;
                this.getClanList(); return; 
                }
        },
        setOrderedByClanState() {
            if(this.orderedByClanState == 1)  { 
                this.orderedByMemberCnt = 0; 
                this.orderedByClanState = 2;
                this.getClanList(); return; 
                }
            if(this.orderedByClanState == 0 || this.orderedByClanState == 2)  { 
                this.orderedByMemberCnt = 0; 
                this.orderedByClanState = 1;
                this.getClanList(); return; 
                }
        },
        getClanList(){
            let url =
                "/typing/api/service/clan/list?" +
                (this.count ? "count=" + this.count : "") +
                (this.currentPage ? "&page=" + this.currentPage : "") +
                (this.keyword
                    ? "&fieldId=" + this.fieldId + "&keyword=" + this.keyword
                    : "")+
                (this.orderedByMemberCnt > 0 ? "&ordered_by=member_count"+(this.orderedByMemberCnt == 1 ? "&ordered_to=ASC":"&ordered_to=DESC"):"") +
                (this.orderedByClanState > 0 ? "&ordered_by=is_dell"+(this.orderedByClanState == 1 ? "&ordered_to=ASC":"&ordered_to=DESC"):"")
                    ;

            this.$axios
	            .get(url)
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
                                return;
                                break;
                                
                            case ResponseCode.PASSWORDEXPIRE.code:
                                alert('비밀번호 유효기간(180일)이 지났습니다.\n비밀번호를 변경해 주세요.');
                                window.location.href = "/typing/managers/pwmodifyforce";
                                return;
                                break;
                                                                
                            case ResponseCode.OK.code:
                                //alert(JSON.stringify(response.data.result));
                                this.startPage =        response.data.result.pagination.firstPage;
                                this.endPage =          response.data.result.pagination.lastPage;    
                                this.pages =            this.makePages(this.startPage, this.endPage); 

                                this.clanList =         response.data.result.rows;
                                this.totalCount =       response.data.result.pagination.totalItemCount;
                                this.virtualNumber =    response.data.result.pagination.virutalNumberStart;
                                this.count =            response.data.result.pagination.itemsPerPage;
                                this.currentPage =      response.data.result.pagination.currentPage;
                                this.totalPageCount =   response.data.result.pagination.totalPageCount;
                                break;

                            default:
                                alert(
                                    "클랜 목록을 가져오는데 실패 했습니다.\n다시 시도해 주세요.\n"
                                    +response.data.code+ "::" +response.data.message
                                );
                        } //switch

                    } //if else   
                })
                .catch(error=>{alert('Catch case: '+error.message);});            
        },
        dateFormat(datetime) {
            return moment(datetime).utcOffset('+0900').format("YYYY-MM-DD");
        },
        search(){
            this.currentPage=1;
            this.getClanList();
        },
        searchCancel(){
            this.keyword='';
            this.fieldId=0;
            this.currentPage=1;
            this.getClanList();
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
        goToPage(pageNum){
            this.currentPage = pageNum;
            this.getClanList();
        },     
        updateFavor(){
            this.$refs.favor_zone.updateFavorZone();
        }     
    },
    created() {
        this.getClanList();
    }
}
</script>