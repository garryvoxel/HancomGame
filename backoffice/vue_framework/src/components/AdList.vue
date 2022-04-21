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
                                <i class="ti-control-play"></i> 광고관리
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
                                <th>검색기간</th>
                                <td class="text-left">
                                    <div class="custom-control custom-radio custom-control-inline">
                                        <input
                                            type="radio"
                                            id="customRadio1"
                                            name="customRadio2"
                                            class="custom-control-input"
                                            value="entire"
                                            v-model="selectedRangeType"
                                        >
                                        <label class="custom-control-label" for="customRadio1">전체기간</label>
                                    </div>

                                    <div class="custom-control custom-radio custom-control-inline">
                                        <input
                                            type="radio"
                                            id="customRadio2"
                                            name="customRadio2"
                                            class="custom-control-input"
                                            value="custom"
                                            v-model="selectedRangeType"
                                        >
                                        <label class="custom-control-label" for="customRadio2">사용자설정</label>
                                    </div>
                                    <div class="custom-control custom-control-inline">
                                        <div class="input-group">
                                                    <input
                                                        type="date"
                                                        class="form-control"
                                                        v-model="startDate"
                                                        v-if="selectedRangeType == 'custom'"
                                                    >
                                                    <span v-if="selectedRangeType == 'custom'">~</span>
                                                    <input
                                                        type="date"
                                                        class="form-control"
                                                         v-model="endDate"
                                                         v-if="selectedRangeType == 'custom'"
                                                    >                                                    
                                                </div>
                                    </div>
                                    <div class="custom-control custom-control-inline">
                                        <button class="btn btn-warning" v-on:click.prevent="search">검색</button> &nbsp;
                                        <button class="btn btn-warning" v-on:click.prevent="searchCancel">검색취소</button>
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
                            <div class="col-md-6 pull-left"></div>
                            <div class="col-md-6">
                                <select
                                    class="custom-select custom-select-sm form-control form-control-sm pull-right"
                                    style="width:100px;"
                                    v-model="count"
                                    @change="getAdList()"
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
                                    <col width="100">
                                    <col width="100">
                                    <col width="100">
                                    <col width="150">
                                    <col width="120">
                                    <col width="120">
                                    <col width="120">
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
                                                광고명
                                                <i class="ti-exchange-vertical"></i>
                                            </span>
                                        </th>
                                        <th>
                                            <span>
                                                광고타입
                                                <i class="ti-exchange-vertical"></i>
                                            </span>
                                        </th>
                                        <th>
                                            <span>
                                                기간
                                                <i class="ti-exchange-vertical"></i>
                                            </span>
                                        </th>
                                        <th>
                                            <span>
                                                노출위치
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
                                            <span>
                                                등록일시
                                                <i class="ti-exchange-vertical"></i>
                                            </span>
                                        </th>
                                        <th>
                                            <span>
                                                노출수
                                                <i class="ti-exchange-vertical"></i>
                                            </span>
                                        </th>
                                        <th>
                                            <span>
                                                클릭수
                                                <i class="ti-exchange-vertical"></i>
                                            </span>
                                        </th>
                                        <th>
                                            <span>
                                                CTR
                                                <i class="ti-exchange-vertical"></i>
                                            </span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(ad,index) in adList" v-on:click="goToDetail(ad.id)" >
                                        <td>{{ virtualNumber - index }}</td>
                                        <td>{{ad.name}}</td>
                                        <td>{{ad.platform}}</td>
                                        <td>{{dateTimeFormat(ad.start_at)}} ~ {{dateTimeFormat(ad.end_at)}}</td>
                                        <td>{{ad.type}}</td>
                                        <td>{{ad.is_active == 1 ? "노출":"숨김"}}</td>
                                        <td>{{dateFormat(ad.created_at)}}</td>
                                        <td>-</td>
                                        <td>-</td>
                                        <td>-%</td>
                                    </tr>
                                    <tr v-if="adList.length === 0">
						                <td colspan="10" class="clan-empty">등록된 광고가 없습니다.</td>
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
import HeaderArea from '@/components/HeaderArea.vue';
import FavorZone from '@/components/FavorZone.vue';
import PageTitleArea from '@/components/PageTitleArea.vue';

import ResponseCode from "@/utils/response_code";
import moment from "moment";

export default {
    name: "AdList",
    components: {
        'header-area': HeaderArea
        ,'favor-zone': FavorZone
        ,'page-title-area': PageTitleArea
    },
    data(){
        return {
            adList: [],
            listScale: [
                { count: 10 },
                { count: 25 },
                { count: 50 },
                { count: 100 }
            ],
            fieldId: 0,
            selectedRangeType: 'entire',
            startDate:'',
            endDate:'',
            keyword: "",
            count: 10,
            totalCount: 0,
            totalPageCount: 0,
            startPage: 0,
            endPage: 0,
            currentPage: 1,
            virtualNumber: 0,
            pages: []
        }
    },
    methods: {
        getAdList(){
            
            let url =
                "/typing/api/ad/list?" +
                (this.count ? "count=" + this.count : "") +
                (this.currentPage ? "&page=" + this.currentPage : "") +
                (this.keyword
                    ? "&fieldId=" + this.fieldId + "&keyword=" + this.keyword
                    : "")+
                (this.selectedRangeType == 'custom' ? "&rangeType=custom&startDate="+this.startDate+'&endDate='+this.endDate:"&rangeType=entire");

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

                                //alert(JSON.stringify(response.data.result));
                                this.startPage =        response.data.result.pagination.firstPage;
                                this.endPage =          response.data.result.pagination.lastPage;    
                                this.pages =            this.makePages(this.startPage, this.endPage); 
                                this.adList =           response.data.result.rows;
                                this.totalCount =       response.data.result.pagination.totalItemCount;
                                this.virtualNumber =    response.data.result.pagination.virutalNumberStart;
                                this.count =            response.data.result.pagination.itemsPerPage;
                                this.currentPage =      response.data.result.pagination.currentPage;
                                this.totalPageCount =   response.data.result.pagination.totalPageCount;

                                break;

                            default:
                                alert(
                                    "이벤트 목록을 가져오는데 실패 했습니다.\n다시 시도해 주세요."
                                );
                        } //switch

                    } //else                    
                })
                .catch(error=>{alert('Catch case: '+error.message);});
        },
        goToWrite(){
            window.location.href='/typing/ad/ad-management/write'
        },
        dateFormat(datetime) {
            return moment(datetime).utcOffset('+0900').format("YYYY-MM-DD");
        },
        dateTimeFormat(datetime) {
            return moment(datetime).utcOffset('+0900').format("YYYY-MM-DD HH:mm:ss");
        },        
        search(){
            if(this.selectedRangeType == 'custom' && (this.startDate == '' || this.endDate == '')) {alert('진행 날짜를 입력해 주시고 다시 검색해 주시기 바랍니다.'); return;}
            this.currentPage=1;
            this.getAdList();
        },
        searchCancel(){
            this.selectedRangeType = 'entire';
            this.startDate='';
            this.endDate='';
            this.keyword='';
            this.fieldId=1;
            this.currentPage=1;
            this.getAdList();
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
            this.getAdList();
        },   
        goToDetail(id){
            window.location.href='/typing/ad/ad-management/'+id+'/detail';
        },
        updateFavor(){
            this.$refs.favor_zone.updateFavorZone();
        }
    },
    created(){
        this.getAdList();
    }
}    
</script>