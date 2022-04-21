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
                                <i class="ti-control-play"></i> 포인트
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
                                <td class="text-left">
                                    <div class="form-row align-items-center">
                                        <div class="col-sm-2">
                                            <select class="form-control" v-model="fieldId">
                                                <option
                                                    v-for="option in searchOptions"
                                                    :value="option.value"
                                                >{{ option.title }}</option>
                                            </select>
                                        </div>
                                        <div class="col-sm-4">
                                            <div class="input-group">
                                                <input
                                                    type="text"
                                                    class="form-control"
                                                    placeholder="검색"
                                                    v-model="keyword"
                                                >
                                            </div>
                                        </div>
                                        <div class="col-auto">
                                            <button class="btn btn-warning" v-on:click.prevent="search">검색</button> 
                                            <button class="btn btn-warning" v-on:click.prevent="searchCancel">검색취소</button>
                                        </div>
                                    </div>
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
                            <div class="col-md-6 pull-left">전체 :
                                <span class="fc_y">{{ this.totalCount }}</span>
                            </div>
                            <div class="col-md-6">
                                <select
                                    class="custom-select custom-select-sm form-control form-control-sm pull-right"
                                    style="width:100px;"
                                    v-model="count"
                                    @change="getPointLogList()"
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
                                    <col width="*">
                                    <col width="*">
                                    <col width="*">
                                    <col width="*">
                                </colgroup>
                                <thead>
                                    <tr>
                                        <th>
                                            <input type="checkbox" @change="doToggleAll()">
                                        </th>
                                        <th>
                                            <span>No
                                                <i class="ti-exchange-vertical"></i>
                                            </span>
                                        </th>
                                        <th>
                                            <span>닉네임
                                                <i class="ti-exchange-vertical"></i>
                                            </span>
                                        </th>
                                        <th>
                                            <span>구분
                                                <i class="ti-exchange-vertical"></i>
                                            </span>
                                        </th>
                                        <th>
                                            <span>내용
                                                <i class="ti-exchange-vertical"></i>
                                            </span>
                                        </th>
                                        <th>
                                            <span>포인트
                                                <i class="ti-exchange-vertical"></i>
                                            </span>
                                        </th>
                                        <th>
                                            <span>날짜
                                                <i class="ti-exchange-vertical"></i>
                                            </span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(log , index) in pointLogList">
                                        <td>
                                            <input type="checkbox" :id="log.id" :value="log.id" v-model="selectedLogs" :disabled="log.amount < 0">
                                        </td>
                                        <td>{{virtualNumber - index}}</td>
                                        <td>{{log.nickname}}</td>
                                        <td>{{log.type}}</td>
                                        <td>{{log.description}}</td>
                                        <td>{{toNumberFormat(log.amount)}}</td>
                                        <td>{{dateTimeFormat(log.created_at)}}</td>
                                    </tr>
                                    <tr v-if="pointLogList.length === 0">
						                <td colspan="7" class="clan-empty">기록된 포인트 목록이 없습니다.</td>
						            </tr>
                                </tbody>
                            </table>
                        </div>
                        <div class="mt-1 text-left">
                            <button
                                class="btn btn-sm btn-flat btn-outline-success pull-left" style="margin-right:5px"
                                v-on:click.prevent="revokePoint"
                            >선택항목 포인트회수</button>
                            <button
                                class="btn btn-sm btn-flat btn-outline-success pull-left"
                                v-on:click.prevent="goToGiveForm"
                            >포인트 지급</button>                            
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
    name: "pointList",
    components: {
        "header-area": HeaderArea,
        "favor-zone": FavorZone,
        "page-title-area": PageTitleArea
    },
    data(){
        return {
            pointLogList: [],
            listScale: [
                { count: 10 },
                { count: 25 },
                { count: 50 },
                { count: 100 }
            ],
            searchOptions: [
                { title: "전체", value: 0 },
                { title: "닉네임", value: 1 },
                { title: "내용", value: 2 }
            ],            
            posStr: {
                0: '관리자'
                , 1: '타이핑연습'
                , 2: '동전쌓기'
                , 3: '두더지잡기'
                , 4: '판뒤집기'
                , 5: '관리자'
            },            
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
            selectedLogs: [],
            toggleAll: 0
        }
    },    
    methods: {
        goToBack(){
            this.$router.go(-1);
        },
        getPointLogList(){
            let url =
                "/typing/api/point/list?" +
                (this.count ? "count=" + this.count : "") +
                (this.currentPage ? "&page=" + this.currentPage : "") +
                (this.keyword
                    ? "&fieldId=" + this.fieldId + "&keyword=" + this.keyword
                    : "");

            this.$axios
                .get(url)
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
                                alert('비밀번호 유효기간(180일)이 지났습니다.\n비밀번호를 변경해 주세요.');
                                window.location.href = "/typing/managers/pwmodifyforce";
                                return;
                                break;

                            case ResponseCode.OK.code:
                                //alert(JSON.stringify(response.data));
                                this.startPage =        response.data.result.pagination.firstPage;
                                this.endPage =          response.data.result.pagination.lastPage;    
                                this.pages =            this.makePages(this.startPage, this.endPage); 

                                this.pointLogList =     response.data.result.rows;
                                this.totalCount =       response.data.result.pagination.totalItemCount;
                                this.virtualNumber =    response.data.result.pagination.virutalNumberStart;
                                this.count =            response.data.result.pagination.itemsPerPage;
                                this.currentPage =      response.data.result.pagination.currentPage;
                                this.totalPageCount =   response.data.result.pagination.totalPageCount;
                                break;

                            default:
                                alert(
                                    "포인트 로그 목록을 가져오는데 실패 했습니다.\n다시 시도해 주세요.\n"
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
        dateTimeFormat(datetime) {
            return moment(datetime).utcOffset('+0900').format("YYYY-MM-DD HH:mm:ss");
        },                
        search(){
            this.currentPage=1;
            this.getPointLogList();
        },
        searchCancel(){
            this.keyword='';
            this.fieldId=0;
            this.currentPage=1;
            this.getPointLogList();
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
            this.getPointLogList();
        },
        doClear(){
            this.selectedLogs = [];
        },
        doSelectAll(){
            for (var i in this.pointLogList){
                if(this.pointLogList[i].amount > 0)this.selectedLogs.push(this.pointLogList[i].id);
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
        updateFavor(){
            this.$refs.favor_zone.updateFavorZone();
        },
        toNumberFormat(value) {
            if (typeof value !== "number") {
                return value;
            }
            var formatter = new Intl.NumberFormat('en-IN', { maximumSignificantDigits: 3 });
            return formatter.format(value);
        },
        goToGiveForm(){
            window.location.href='/typing/point/point-management/givepoint';
        },
        revokePoint(){
            if(confirm('선택한 포인트를 회수 하시겠습니까?')) {
                //alert( this.selectedLogs );
                this.$axios
                    .post('/typing/api/point/revokepoint',{
                        selectedLogs: this.selectedLogs
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
                                //alert(JSON.stringify(response.data.result));
                                alert('포인트가 회수 되었습니다.');
                                this.selectedLogs=[];
                                this.getPointLogList();
                                break;

                            default:
                                alert(
                                    "포인트 회수에 실패 했습니다.\n다시 시도해 주세요.\n"
                                    +response.data.code+ "::" +response.data.message
                                );
                        } //switch

                    } //if else   
                    })
                    .catch(error=>{alert('Catch case: '+error.message);});

            }
        },
        convPos(index) {
            return this.posStr[index];
        }
    },
    created(){
        this.getPointLogList();
    }
}
</script>