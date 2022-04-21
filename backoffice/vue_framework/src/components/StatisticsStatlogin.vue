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
                                <i class="ti-control-play"></i> 로그인 통계
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
                                <th>기간구분</th>
                                <td>
                                    <form>
                                        <div class="col-12 form-row align-items-center">
                                            <div class="col-sm-4 my-1">
                                                <div class="input-group">
                                                    <label class="radio-inline"
                                                    v-for="(option, index) in searchOptions"
                                                    ><input type="radio" name="optradio" 
                                                        :value="option.value"
                                                        v-model="selectedOption"
                                                        v-on:click="searchOptionChange(option.value)"
                                                    >{{option.name}} &nbsp;&nbsp;&nbsp;</label>
                                                </div>
                                            </div>
                                            
                                        </div>
                                    </form>
                                </td>
                            </tr>
                            <tr>
                                <th>조회기간</th>
                                <td>
                                    <div class="col-12 text-left">
                                        <span class="dset" style="border:0" v-if="selectedOption =='daily' || selectedOption =='weekly'">
                                            <select class="form-control" v-model="selectedYearMonth" @change="getYMList">
                                                <option v-for="ym in ymList">{{ym.ym}}</option>
                                            </select>
                                        </span>                                        
                                        <span class="dset" style="border:0" v-if="selectedOption =='weekly'">
                                            <select class="form-control" v-model="selectedWeek" @change="getWeeklyStatList">
                                                <option v-for="(week,index) in weekList" :value="week.week_count">{{week.week_count}}번째 주 {{week.start_date}}~{{week.end_date}}</option>
                                            </select>
                                        </span>
                                        <span class="dset" style="border:0" v-if="selectedOption =='monthly'">
                                            <select class="form-control" v-model="selectedYear">
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
                </div>
            </div>
            <!-- search area end -->



            <!-- 탭 처리 -->
            <div class="mt-3">
                    <ul class="nav nav-tabs" id="myTab" role="tablist">
                        <li class="nav-item">
                            <a class="nav-link "  v-bind:class="[tabController == 'i' ? 'active':'']" id="web-tab" data-toggle="tab" href="#web-info" role="tab"  aria-selected="false">WEB</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" v-bind:class="[tabController == 'f' ? 'active':'']" id="mobile-tab" data-toggle="tab" href="#mobile-info" role="tab" aria-selected="false">Mobile</a>
                        </li>
                    </ul>
                    <div class="tab-content mt-2" id="myTabContent">
                        <!-- 웹 정보 탭 시작 -->
                        <div class="tab-pane fade " v-bind:class="[tabController == 'i' ? 'active show':'']" id="web-info" role="tabpanel" >
                            <div class="row">
                                <!-- data table start -->
                                <div class="col-12">
                                    <div class="data-tables">
                                        <div class="tablewrap">
                                            <table class="tbsty01 text-center">
                                                <colgroup>
                                                    <col width="200">
                                                    <col width="*">
                                                    <col width="*">
                                                    <col width="*">
                                                    <col width="*">
                                                    <col width="*">
                                                    <col width="*">
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
                                                            <span>크롬
                                                                <i class="ti-exchange-vertical"></i>
                                                            </span>
                                                        </th>
                                                        <th>
                                                            <span>IE
                                                                <i class="ti-exchange-vertical"></i>
                                                            </span>
                                                        </th>
                                                        <th>
                                                            <span>파이어폭스
                                                                <i class="ti-exchange-vertical"></i>
                                                            </span>
                                                        </th>
                                                        <th>
                                                            <span>엣지
                                                                <i class="ti-exchange-vertical"></i>
                                                            </span>
                                                        </th>
                                                        <th>
                                                            <span>사파리
                                                                <i class="ti-exchange-vertical"></i>
                                                            </span>
                                                        </th>                                        
                                                        <th>
                                                            <span>ETC.
                                                                <i class="ti-exchange-vertical"></i>
                                                            </span>
                                                        </th>
                                                        <th>
                                                            <span>총횟수
                                                                <i class="ti-exchange-vertical"></i>
                                                            </span>
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr v-for="(log, the_date) in browserStatList">
                                                        <td>{{log.m}}</td>
                                                        <td>{{log.Chrome}}</td>
                                                        <td>{{log.IE}}</td>
                                                        <td>{{log.Firefox}}</td>
                                                        <td>{{log.Edge}}</td>
                                                        <td>{{log.Sapari}}</td>
                                                        <td>{{log.Etc}}</td>
                                                        <td>{{log.total_count}}</td>
                                                    </tr>
                                                    <tr v-if="browserStatList.length === 0 ">
                                                        <td  colspan="8"> 등록된 로그가 없습니다. </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                        <button class="btn btn-default btn-success mt-3" @click.prevent="csvDownload('web')"><i class="fa fa-download"></i> 다운로드</button>
                                    </div>
                                </div>
                                <!-- data table end -->
                            </div>
                        </div>
                        <!-- 웹 정보 탭 끝 -->

                        <!-- 모바일 자게 탭 시작 -->
                        <div class="tab-pane fade" v-bind:class="[tabController == 'f' ? 'active show':'']" id="mobile-info" role="tabpanel">
                            <div class="row">
                                <!-- data table start -->
                                <div class="col-12">
                                    <div class="data-tables">
                                        <div class="tablewrap">
                                            <table class="tbsty01 text-center">
                                                <colgroup>
                                                    <col width="200">
                                                    <col width="*">
                                                    <col width="*">
                                                    <col width="*">
                                                    <col width="*">
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
                                                            <span>PC
                                                                <i class="ti-exchange-vertical"></i>
                                                            </span>
                                                        </th>                                                        
                                                        <th>
                                                            <span>Android
                                                                <i class="ti-exchange-vertical"></i>
                                                            </span>
                                                        </th>
                                                        <th>
                                                            <span>IOS
                                                                <i class="ti-exchange-vertical"></i>
                                                            </span>
                                                        </th>
                                                        <th>
                                                            <span>ETC.
                                                                <i class="ti-exchange-vertical"></i>
                                                            </span>
                                                        </th>
                                                        <th>
                                                            <span>총횟수
                                                                <i class="ti-exchange-vertical"></i>
                                                            </span>
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr v-for="(log, the_date) in osStatList">
                                                        <td>{{log.m}}</td>
                                                        <td>{{log.PC}}</td>
                                                        <td>{{log.Android}}</td>
                                                        <td>{{log.IOS}}</td>
                                                        <td>{{log.Etc}}</td>
                                                        <td>{{log.total_count}}</td>
                                                    </tr>
                                                    <tr v-if="osStatList.length === 0 ">
                                                        <td  colspan="6"> 등록된 로그가 없습니다. </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                        <button class="btn btn-default btn-success mt-3" @click.prevent="csvDownload('mobile')"><i class="fa fa-download"></i> 다운로드</button>
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
    name: "statisticsLoginList",
    components: {
        "header-area": HeaderArea,
        "favor-zone": FavorZone,
        "page-title-area": PageTitleArea
    },
    data(){
        return {
            tabController: 'i',
            osStatList: [],
            browserStatList: [],
            searchOptions: [
                {name:"일별", value:"daily"},
                {name:"주별", value:"weekly"},
                {name:"월별", value:"monthly"},
            ],
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
                                if(this.selectedOption =="weekly") { this.getWeekList();}
                                if(this.selectedOption =="daily") this.getDailyStatList();
                                break;

                            default:
                                alert(
                                    "1 날짜 정보를 가져오는데 실패 했습니다.\n다시 시도해 주세요.\n"
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
        },
        getWeekList(){
            this.$axios
                .get('/typing/api/statistics/getweeklist?year='+this.selectedYear+'&yearmonth='+this.selectedYearMonth)
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
                                this.weekList = response.data.result;
                                this.selectedWeek = response.data.result[0].week_count;
                                if(this.selectedOption == 'weekly') this.getWeeklyStatList();
                                break;

                            default:
                                alert(
                                    "주차정보를 실패 했습니다.\n다시 시도해 주세요.\n"
                                    +response.data.code+ "::" +response.data.message
                                );
                        } //switch
                        
                    } //if else                      
                })
        },
        dateFormat(datetime) {
            return moment(datetime).utcOffset('+0900').format("YYYY-MM-DD");
        },
        searchOptionChange(option) {
            //alert(option);
            switch(option) {

                case 'weekly' :
                this.getWeeklyStatList();
                break;

                case 'monthly' :
                this.getMonthlyStatList();
                break;
                
                case 'daily' : 
                default :
                this.getDailyStatList();
            }

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
                case 'web' :  
                    csvContent = "날짜,Chrome,IE,Firefox,Edge,Sapari,ETC,총횟수\n";
                    /*
                    csvContent += [
                        Object.keys(this.browserStatList).join("\n"),
                        ...this.browserStatList.map(item => Object.values(item).join(","))
                    ]
                    */
                    csvContent += [
                        ...this.browserStatList.map(item => Object.values(item).join(","))
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
                case 'mobile' :  
                    csvContent = "날짜,PC,Android,IOS,ETC,총횟수\n";
                    csvContent += [
                        ...this.osStatList.map(item => Object.values(item).join(","))
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

        // -----------------------  일별, 주별, 월별

        getDailyStatList(){
            let _url = "/typing/api/statistics/stat-login-daily?yearmonth="+this.selectedYearMonth;
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
                            //alert(response.data.result.mobileLog);
                            this.browserStatList = response.data.result.webLog;
                            this.osStatList = response.data.result.mobileLog;
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
        getWeeklyStatList(){
            //주차를 선택하면... start_date 와  end_date 를 계산 함. 
            for(let week in this.weekList) {
                if(this.selectedWeek == this.weekList[week].week_count) {
                    this.selectedWeekStartDate = this.weekList[week].start_date;
                    this.selectedWeekEndDate = this.weekList[week].end_date
                }
            }

            let _url = "/typing/api/statistics/stat-login-weekly?week="+this.selectedWeek
                +"&start_date="+this.selectedWeekStartDate 
                +"&end_date="+this.selectedWeekEndDate           
            //alert('주별:::'+_url); 

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
                            this.browserStatList = response.data.result.webLog;
                            this.osStatList = response.data.result.mobileLog;
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
        getMonthlyStatList(){
            let _url = "/typing/api/statistics/stat-login-monthly?year="+this.selectedYear;
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
                            this.browserStatList = response.data.result.webLog;
                            this.osStatList = response.data.result.mobileLog;
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
        this.getWeekList();
        this.getDailyStatList();        
    }
};
</script>