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
                                <i class="ti-control-play"></i> 신규 회원 가입
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
                    <br>
                    <table class="tbsty02 text-center">
                        <colgroup>
                            <col width="150">
                            <col width="*">
                        </colgroup>
                        <tbody>
                            <tr>
                                <th>누적회원</th>
                                <td>
                                    {{userTotalCount}} 명 &nbsp;&nbsp; <button class="btn btn-default" v-on:click="getUserTotalCount">갱신</button>
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
                        <div class="tablewrap mt-2">
                            <table class="tbsty01 text-center">
                                <colgroup>
                                    <col width="300">
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
                                            <span>신규 가입수
                                                <i class="ti-exchange-vertical"></i>
                                            </span>
                                        </th>

                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(stat, index) in statList">
                                        <td>{{stat.m}}</td>
                                        <td>{{stat.cnt ? stat.cnt : '0'}}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <button class="btn btn-default btn-success mt-3" @click.prevent="csvDownload('bymember')"><i class="fa fa-download"></i> 다운로드</button>
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
    name: "statisticsByMember",
    components: {
        "header-area": HeaderArea,
        "favor-zone": FavorZone,
        "page-title-area": PageTitleArea
    },
    data(){
        return {
            statList: [],
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
            userTotalCount: 0
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

                            case ResponseCode.PASSWORDEXPIRE.code:
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
        getDailyStatList(){
            //alert(this.selectedYearMonth);
            let _url = "/typing/api/statistics/stat-newuser-daily?yearmonth="+this.selectedYearMonth;
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

                            case ResponseCode.OK.code:
                                //alert(JSON.stringify(response.data.result));
                                this.statList = response.data.result;
                                break;

                            default:
                                alert(
                                    "통계정보를 가져오는데 실패 했습니다.\n다시 시도해 주세요.\n"
                                    +response.data.code+ "::" +response.data.message
                                );
                        } //switch
                        
                    } //if else                     
                })
        },
        getWeeklyStatList(){
            //주차를 선택하면... start_date 와  end_date 를 계산 함. 
            for(let week in this.weekList) {
                if(this.selectedWeek == this.weekList[week].week_count) {
                    this.selectedWeekStartDate = this.weekList[week].start_date;
                    this.selectedWeekEndDate = this.weekList[week].end_date
                }
            }
            //alert(this.selectedWeek + '/' + this.selectedWeekStartDate + '/' + this.selectedWeekEndDate);
            let _url = "/typing/api/statistics/stat-newuser-weekly?week="+this.selectedWeek
                +"&start_date="+this.selectedWeekStartDate 
                +"&end_date="+this.selectedWeekEndDate

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

                            case ResponseCode.PASSWORDEXPIRE.code:
                                return;
                                break;

                            case ResponseCode.OK.code:
                                //alert(JSON.stringify(response.data.result));
                                this.statList = response.data.result;
                                break;

                            default:
                                alert(
                                    "통계정보를 가져오는데 실패 했습니다.\n다시 시도해 주세요.\n"
                                    +response.data.code+ "::" +response.data.message
                                );
                        } //switch
                        
                    } //if else                        
                })
        },

        getMonthlyStatList(){
            //alert(this.selectedYear);
            let _url = "/typing/api/statistics/stat-newuser-monthly?year="+this.selectedYear;
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

                            case ResponseCode.PASSWORDEXPIRE.code:
                                return;
                                break;

                            case ResponseCode.OK.code:
                                //alert(JSON.stringify(response.data.result));
                                this.statList = response.data.result;
                                break;

                            default:
                                alert(
                                    "통계정보를 가져오는데 실패 했습니다.\n다시 시도해 주세요.\n"
                                    +response.data.code+ "::" +response.data.message
                                );
                        } //switch
                        
                    } //if else
                })

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
        getUserTotalCount(){
            this.$axios
                .get('/typing/api/statistics/stat-user-totalcount')
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
                                //this.userTotalCount = this.toNumberFormat(response.data.result[0].count);
                                this.userTotalCount = this.toNumberFormat(Number(response.data.result[0].count));
                                break;

                            default:
                                alert(
                                    "통계정보를 가져오는데 실패 했습니다.\n다시 시도해 주세요.\n"
                                    +response.data.code+ "::" +response.data.message
                                );
                        } //switch
                        
                    } //if else                    
                })
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
                case 'bymember' :  
                    csvContent = "날짜,신규가입 수\n";
                    csvContent += [
                        ...this.statList.map(item => Object.values(item).join(","))
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

    },
    created(){
        let date = new Date();
        this.getYList();
        this.selectedYear = date.getFullYear();
        this.selectedYearMonth = date.getFullYear()+'-'+('0' + (date.getMonth() + 1)).slice(-2);
        this.getYMList();
        this.getWeekList();
        this.getUserTotalCount();
        this.getDailyStatList();
    }
};
</script>