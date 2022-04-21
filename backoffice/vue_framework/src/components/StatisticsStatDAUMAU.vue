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
                                <i class="ti-control-play"></i> DAU / MAU
                            </h4>
                        </div>
                    </div>
                </div>
            </div>


            <!-- 탭 처리 -->
            <div class="mt-3">
                    <ul class="nav nav-tabs" id="myTab" role="tablist">
                        <li class="nav-item">
                            <a class="nav-link "  v-bind:class="[tabController == 'i' ? 'active':'']" id="web-tab" data-toggle="tab" href="#web-info" role="tab"  aria-selected="false">DAU</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" v-bind:class="[tabController == 'f' ? 'active':'']" id="mobile-tab" data-toggle="tab" href="#mobile-info" role="tab" aria-selected="false">MAU</a>
                        </li>
                    </ul>
                    <div class="tab-content mt-2" id="myTabContent">
                        <!-- DAU 탭 시작 -->
                        <div class="tab-pane fade " v-bind:class="[tabController == 'i' ? 'active show':'']" id="web-info" role="tabpanel" >
                            <div class="row">
                                
                                <!-- data table start -->
                                <div class="col-12">
                                    <div class="data-tables">
                                        <div class="tablewrap">
                                            <!-- 검색 바 : 시작 -->
                                            <table class="tbsty02 text-center">
                                                <colgroup>
                                                    <col width="150">
                                                    <col width="*">
                                                </colgroup>
                                                <tbody>
                                                    <tr>
                                                        <th>조회기간</th>
                                                        <td>
                                                            <div class="col-12 text-left">
                                                                <span class="dset" style="border:0">
                                                                    <select class="form-control" v-model="selectedYearMonth" @change="getYMList">
                                                                        <option v-for="ym in ymList">{{ym.ym}}</option>
                                                                    </select>
                                                                </span>                                        
                                                                <!--span class="demi">
                                                                    &nbsp; <button type="submit" class="btn btn-warning">검색</button>
                                                                </span-->
                                                                
                                                            </div>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>    
                                            <!-- 검색 바 : 끝 -->                                        
                                            <table class="tbsty01 text-center">
                                                <colgroup>
                                                    <col width="200">
                                                    <col width="*">
                                                </colgroup>
                                                <thead>
                                                    <tr>
                                                        <th>
                                                            <span>날짜
                                                                <i class="ti-exchange-vertical"></i>
                                                            </span>
                                                        </th>
                                                        <th>
                                                            <span>DAU<br>(Daily Active User)

                                                                <i class="ti-exchange-vertical"></i>
                                                            </span>
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr v-for="(log, the_date) in dauStatList">
                                                        <td>{{log.m}}</td>
                                                        <td>{{log.dau_count}}</td>
                                                    </tr>
                                                    <tr v-if="dauStatList.length === 0 ">
                                                        <td  colspan="2"> 등록된 로그가 없습니다. </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                        <button class="btn btn-default btn-success mt-3" @click.prevent="csvDownload('dau')"><i class="fa fa-download"></i> 다운로드</button>
                                    </div>
                                </div>
                                <!-- data table end -->
                            </div>
                        </div>
                        <!-- DAU 탭 끝 -->

                        <!-- MAU 탭 시작 -->
                        <div class="tab-pane fade" v-bind:class="[tabController == 'f' ? 'active show':'']" id="mobile-info" role="tabpanel">
                            <div class="row">
                                <!-- data table start -->
                                <div class="col-12">
                                    <div class="data-tables">
                                        <div class="tablewrap">

                                            <!-- 검색 바 : 시작 -->
                                            <table class="tbsty02 text-center">
                                                <colgroup>
                                                    <col width="150">
                                                    <col width="*">
                                                </colgroup>
                                                <tbody>
                                                    <tr>
                                                        <th>조회기간</th>
                                                        <td>
                                                            <div class="col-12 text-left">
                                                                <span class="dset" style="border:0">
                                                                    <select class="form-control" v-model="selectedYear" @change="getYList">
                                                                        <option v-for="year in yearList" :value="year">{{year}}</option>
                                                                    </select>
                                                                </span>                                         
                                                                <!--span class="demi">
                                                                    &nbsp; <button type="submit" class="btn btn-warning">검색</button>
                                                                </span-->
                                                                
                                                            </div>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>    
                                            <!-- 검색 바 : 끝 -->

                                            <table class="tbsty01 text-center">
                                                <colgroup>
                                                    <col width="200">
                                                    <col width="*">
                                                </colgroup>
                                                <thead>
                                                    <tr>
                                                        <th>
                                                            <span>날짜
                                                                <i class="ti-exchange-vertical"></i>
                                                            </span>
                                                        </th>
                                                        <th>
                                                            <span>MAU<br>(Monthly Active User)
                                                                <i class="ti-exchange-vertical"></i>
                                                            </span>
                                                        </th>                                                        
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr v-for="(log, the_date) in mauStatList">
                                                        <td>{{log.m}}</td>
                                                        <td>{{log.mau_count}}</td>
                                                    </tr>
                                                    <tr v-if="mauStatList.length === 0 ">
                                                        <td  colspan="6"> 등록된 로그가 없습니다. </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                        <button class="btn btn-default btn-success mt-3" @click.prevent="csvDownload('mau')"><i class="fa fa-download"></i> 다운로드</button>
                                    </div>
                                </div>
                                <!-- data table end -->
                            </div>
                        </div>
                        <!-- 모바일 탭 끝 -->
                    </div>
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
    name: "statisticsDAUMAU",
    components: {
        "header-area": HeaderArea,
        "favor-zone": FavorZone,
        "page-title-area": PageTitleArea
    },
    data(){
        return {
            tabController: 'i',
            dauStatList: [],
            mauStatList: [],
            selectedOption: 'daily',
            searchDate: '',
            yearList: [],
            ymList: [],
            weekList:[],
            selectedYear: '',
            selectedYearMonth: '',
            selectedWeek: 0,
            selectedWeekStartDate: '',
            selectedWeekEndDate: '',            
        }
    },
    methods:{
        updateFavor(){
            this.$refs.favor_zone.updateFavorZone();
        },
        getYMList(){
            let _url='/typing/api/statistics/getymlist?year='+this.selectedYear;
            this.$axios
                .get(_url)
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

                            case ResponseCode.OK.code:
                                //alert(JSON.stringify(response.data.result));
                                this.ymList = response.data.result;
                                this.getDAU();
                                break;

                            default:
                                alert(
                                    "날짜 정보를 가져오는데 실패 했습니다.\n다시 시도해 주세요.\n"
                                    +response.data.code+ "::" +response.data.message
                                );
                        } //switch
                        
                    } //if else                      
                })
        },        
        getYList(){
            let _year = new Date().getFullYear();
            let yearArr = [];
            let cnt = _year;
            for(cnt ; cnt >= 2019 ; cnt-- ) {
                yearArr.push(cnt);
            }
            this.yearList = yearArr;
            this.selectedYear = _year;
            this.getMAU();        
        },
        dateFormat(datetime) {
            return moment(datetime).utcOffset('+0900').format("YYYY-MM-DD");
        },
        toNumberFormat(value) {
            if (typeof value !== "number") {
                return value;
            }
            var formatter = new Intl.NumberFormat('en-IN', { maximumSignificantDigits: 3 });
            return formatter.format(value);
        },    
        csvDownload(target){
            //let csvContent = "data:text/csv;charset=utf-8,";
            let filename = target+"_"+moment().utcOffset('+0900').format("YYYYMMDD_HHmmss")+".csv";
            let csvContent = "";
            switch(target){
                case 'dau' :  
                    csvContent = "날짜,DAU\n";
                    /*
                    csvContent += [
                        Object.keys(this.browserStatList).join("\n"),
                        ...this.browserStatList.map(item => Object.values(item).join(","))
                    ]
                    */
                    csvContent += [
                        ...this.dauStatList.map(item => Object.values(item).join(","))
                    ]
                        .join("\n")
                        .replace(/(^\[)|(\]$)/gm, "");
                    //한글처리                        
                    //const wurl = window.URL.createObjectURL(new Blob([csvContent]));
                    const wurl = window.URL.createObjectURL(new Blob(["\ufeff"+csvContent], {type: 'text/csv;charset=utf-8;'}));
                    const wlink = document.createElement('a');
                    wlink.href = wurl;
                    wlink.setAttribute('download', filename);         
                    document.body.appendChild(wlink); 
                    wlink.click();
                break;
                case 'mau' :  
                    csvContent = "날짜,MAU\n";
                    csvContent += [
                        ...this.mauStatList.map(item => Object.values(item).join(","))
                    ]
                        .join("\n")
                        .replace(/(^\[)|(\]$)/gm, "");
                    //const murl = window.URL.createObjectURL(new Blob([csvContent]));
                    const murl = window.URL.createObjectURL(new Blob(["\ufeff"+csvContent], {type: 'text/csv;charset=utf-8;'}));
                    const mlink = document.createElement('a');
                    mlink.href = murl;
                    mlink.setAttribute('download', filename);         
                    document.body.appendChild(mlink); 
                    mlink.click();                
                break;
                default :
                    return '';
            }
        },

        // -----------------------  DAU, MAU

        getDAU(){
            let _url = "/typing/api/statistics/stat-dau?yearmonth="+this.selectedYearMonth;
            //alert('일별:::'+_url);

            this.$axios
            .get(_url)
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

                        case ResponseCode.OK.code:
                            //alert(response.data.result.dauLog);
                            this.dauStatList = response.data.result.dauLog;
                            break;

                        default:
                            alert(
                                "통계 데이터를 가져오는데 실패 했습니다.\n다시 시도해 주세요."
                            );
                    } //switch

                } //else
            })
            .catch(error=>{alert('Catch case: '+error.message);});            
        },        
        
        getMAU(){
            let _url = "/typing/api/statistics/stat-mau?year="+this.selectedYear;
            //alert('월별:::'+_url);

            this.$axios
            .get(_url)
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

                        case ResponseCode.OK.code:
                            //alert(response.data.result.mobileLog);
                            this.mauStatList = response.data.result.mauLog;
                            break;

                        default:
                            alert(
                                "통계 데이터를 가져오는데 실패 했습니다.\n다시 시도해 주세요."
                            );
                    } //switch

                } //else
            })
            .catch(error=>{alert('Catch case: '+error.message);});            
        },



        
    },
    created(){
        let date = new Date();
        this.getYList();
        this.selectedYear = date.getFullYear();
        this.selectedYearMonth = date.getFullYear()+'-'+('0' + (date.getMonth() + 1)).slice(-2);
        this.getYMList();
    }
};
</script>