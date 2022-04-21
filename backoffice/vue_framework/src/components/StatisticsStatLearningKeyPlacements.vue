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
                                <i class="ti-control-play"></i> 자리연습통계
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
                                        <span class="dset" style="border:0">
                                            <select class="form-control" v-model="selectedYear" @change="doYearChange()">
                                                <option v-for="year in yearList" :value="year">{{year}}</option>
                                            </select>
                                        </span>                                                                              
                                        <span class="dset" style="border:0" v-if="selectedOption =='hourly' || selectedOption =='daily' || selectedOption =='weekly' ">
                                            <select class="form-control" v-model="selectedMonth" @change="doMonthChange()">
                                                <option v-for="month in monthList" :value="month">{{month}}</option>
                                            </select>
                                        </span>                                          
                                        <span class="dset" style="border:0" v-if="selectedOption =='weekly'">
                                            <select class="form-control" v-model="selectedWeek"  @change="doWeekChange()">
                                                <option v-for="(week,index) in weekList" :value="week.week_count">{{week.week_count}}번째 주 {{week.start_date}}~{{week.end_date}}</option>
                                            </select>
                                        </span>                                        
                                        <span class="dset" style="border:0" v-if="selectedOption =='hourly'">
                                            <select class="form-control" v-model="selectedDay"  @change="doDayChange()">
                                                <option v-for="day in dayList" :value="day">{{day}}</option>
                                            </select>
                                        </span>                                              
                                        <span class="demi">
                                            &nbsp; <!--button type="submit" class="btn btn-warning">검색</button-->
                                        </span>
                                        
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
                        <a class="nav-link "  v-bind:class="[tabController == 'i' ? 'active':'']" id="web-tab" data-toggle="tab" href="#web-info" role="tab"  aria-selected="false">사용횟수</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" v-bind:class="[tabController == 'f' ? 'active':'']" id="mobile-tab" data-toggle="tab" href="#mobile-info" role="tab" aria-selected="false">난이도별 사용횟수</a>
                    </li>
                </ul>
                <!-- tab-content 시작 -->
                <div class="tab-content mt-2" id="myTabContent">
                    <!-- 웹 정보 탭 시작 -->
                    <div class="tab-pane fade " v-bind:class="[tabController == 'i' ? 'active show':'']" id="web-info" role="tabpanel" >
                        <!-- class row 시작 -->
                        <div class="row">
                            <!-- data table start -->
                            <div class="col-12">
                                <div class="data-tables">
                                    <div class="tablewrap mt-2">
                                        <table class="tbsty01 text-center">
                                            <colgroup>
                                                <col width="300">
                                                <col width="*">
                                            </colgroup>
                                            <thead>
                                                <tr>
                                                    <th style="border-right:1px #ccc solid">
                                                        날짜
                                                    </th>
                                                    <th style="border-right:1px #ccc solid">
                                                        <span>사용횟수
                                                            
                                                        </span>
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr v-for="(stat, index) in statListUsing">
                                                    <td style="border-right:1px #ccc solid">
                                                        {{stat.m}}
                                                    </td>
                                                    <td style="border-right:1px #ccc solid">
                                                        {{stat.cnt}}
                                                    </td>
                                                </tr>                                    
                                            </tbody>
                                        </table>
                                    </div>
                                    <button class="btn btn-default btn-success mt-3" @click.prevent="csvDownload('byUsing')"><i class="fa fa-download"></i> 다운로드</button>
                                </div>
                            </div>
                            <!-- data table end -->
                        </div> 
                        <!-- class row 끝 -->
                    </div>
                    <!-- 웹 정보 탭 끝 -->

                    <!-- 모바일 자게 탭 시작 -->
                    <div class="tab-pane fade" v-bind:class="[tabController == 'f' ? 'active show':'']" id="mobile-info" role="tabpanel">
                        <!-- class row 시작 -->
                        <div class="row">
                            <!-- data table start -->
                            <div class="col-12">
                                <div class="data-tables">
                                    <div class="tablewrap mt-2">
                                        <table class="tbsty01 text-center">
                                            <colgroup>
                                                <col width="300">
                                                <col width="*">
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
                                                    <th style="border-right:1px #ccc solid">
                                                        날짜
                                                    </th>
                                                    <th style="border-right:1px #ccc solid">
                                                        <span>1단계
                                                            
                                                        </span>
                                                    </th>
                                                    <th style="border-right:1px #ccc solid">
                                                        <span>2단계
                                                            
                                                        </span>
                                                    </th>
                                                    <th >
                                                        <span>3단계
                                                            
                                                        </span>
                                                    </th>
                                                    <th >
                                                        <span>4단계
                                                            
                                                        </span>
                                                    </th>
                                                    <th >
                                                        <span>5단계
                                                            
                                                        </span>
                                                    </th>
                                                    <th >
                                                        <span>6단계
                                                            
                                                        </span>
                                                    </th>                                                                                                        
                                                    <th >
                                                        <span>7단계
                                                            
                                                        </span>
                                                    </th>
                                                    <th >
                                                        <span>8단계
                                                            
                                                        </span>
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr v-for="(stat, index) in statListbyLevel">
                                                    <td style="border-right:1px #ccc solid">
                                                        {{stat.m}}
                                                    </td>
                                                    <td style="border-right:1px #ccc solid">
                                                        {{stat.level1}}
                                                    </td>
                                                    <td style="border-right:1px #ccc solid">
                                                        {{stat.level2}}
                                                    </td>
                                                    <td style="border-right:1px #ccc solid">
                                                        {{stat.level3}}
                                                    </td>
                                                    <td style="border-right:1px #ccc solid">
                                                        {{stat.level4}}
                                                    </td>
                                                    <td style="border-right:1px #ccc solid">
                                                        {{stat.level5}}
                                                    </td>                                      
                                                    <td style="border-right:1px #ccc solid">
                                                        {{stat.level6}}
                                                    </td>     
                                                    <td style="border-right:1px #ccc solid">
                                                        {{stat.level7}}
                                                    </td> 
                                                    <td style="border-right:1px #ccc solid">
                                                        {{stat.level8}}
                                                    </td>                                                                                      
                                                </tr>                                    
                                            </tbody>
                                        </table>
                                    </div>
                                    <button class="btn btn-default btn-success mt-3" @click.prevent="csvDownload('byLevel')"><i class="fa fa-download"></i> 다운로드</button>
                                </div>
                            </div>
                            <!-- data table end -->
                        </div> 
                        <!-- class row 끝 -->
                    </div>
                    <!-- 모바일 탭 끝 -->
                </div>
                <!-- tab-content 끝 -->
            </div>
            <!-- 탭 처리 : 끝-->



        </div>
        <!-- main-content-inner 끝 -->
    </div>
    <!-- main-content 끝 -->
</template>
<script>
import HeaderArea from "@/components/HeaderArea.vue";
import FavorZone from "@/components/FavorZone.vue";
import PageTitleArea from "@/components/PageTitleArea.vue";

import ResponseCode from "@/utils/response_code";
import moment from "moment";

export default {
    name: "statisticsByMenu",
    components: {
        "header-area": HeaderArea,
        "favor-zone": FavorZone,
        "page-title-area": PageTitleArea
    },
    data(){
        return {
            tabController: 'i',
            statList: [],
            statListUsing: [],
            statListbyLevel: [],
            searchOptions: [
                {name:"일별", value:"daily"},
                {name:"주별", value:"weekly"},
                {name:"월별", value:"monthly"},
            ],
            searchDate: '',
            yearList: [],
            ymList: [],
            monthList: [],
            dayList: [],
            dayYMDList: [],
            monthList:[
                ,'01'
                ,'02'
                ,'03'
                ,'04'
                ,'05'
                ,'06'
                ,'07'
                ,'08'
                ,'09'
                ,'10'
                ,'11'
                ,'12'
            ],            
            weekList:[],
            hourList:['00'
                ,'01'
                ,'02'
                ,'03'
                ,'04'
                ,'05'
                ,'06'
                ,'07'
                ,'08'
                ,'09'
                ,'10'
                ,'11'
                ,'12'
                ,'13'
                ,'14'
                ,'15'
                ,'16'
                ,'17'
                ,'18'
                ,'19'
                ,'20'
                ,'21'
                ,'22'
                ,'23'
            ],
            selectedOption: 'daily',
            selectedYear: '',
            selectedMonth: '',
            selectedYearMonth: '',
            selectedWeek: 0,
            selectedHour: '',
            selectedDay: '',
            selectedWeekStartDate: '',
            selectedWeekEndDate: ''
        }
    },
    methods:{
        updateFavor(){
            this.$refs.favor_zone.updateFavorZone();
        },
        searchOptionChange(option) {
            //alert(option);
            switch(option) {

                case 'weekly' :
                    this.selectedOption = 'weekly';
                    this.doWeekChange();
                break;

                case 'monthly' :
                    this.selectedOption = 'monthly';
                    this.doMonthChange();
                break;
                
                case 'hourly' :
                    this.selectedOption = 'hourly';
                    this.doHourChange();
                break;

                case 'daily' : 
                    this.selectedOption = 'daily';
                default :
                    this.doDayChange();
            }
        },        
        doYearChange(){
            this.statList=[];
            this.dayList=[];
            this.selectedMonth='';
            this.selectedDay='';
            this.selectedWeek='';
            this.selectedHour='';
            this.selectedYearMonth='';
            this.selectedWeekStartDate='';
            this.selectedWeekEndDate='';
            this.getStat();
        },
        doMonthChange(){
            this.statList=[];
            this.selectedYearMonth = this.selectedYear+'-'+this.selectedMonth;

            this.getDayList();    
            this.getWeekList() ;
            this.selectedDay='';
            if(this.selectedOption == 'weekly') {
                this.getWeekList();
            } else this.getStat();
        },
        doWeekChange(){
            //주차를 선택하면... start_date 와  end_date 를 계산 함. 
            for(let week in this.weekList) {
                if(this.selectedWeek == this.weekList[week].week_count) {
                    this.selectedWeekStartDate = this.weekList[week].start_date;
                    this.selectedWeekEndDate = this.weekList[week].end_date
                }
            }            
            this.statList=[];
            this.selectedYearMonth = this.selectedYear+'-'+this.selectedMonth;
            this.getStat();
        },        
        doDayChange(){
            this.statList=[];
            if(this.selectedOption == 'daily') this.getStat();
            if(this.selectedOption == 'hourly') {
                this.statList=[];
                this.selectedHour = '';
            }
        },
        doHourChange(){
            this.selectedOption = 'hourly';
            this.statList = [];
            this.getStat('h');
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
                                this.getDayList();
                                if(this.selectedOption =="daily") ; //this.getDailyStatList();
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
        getDayList(){
            let _url='/typing/api/statistics/getdaylist?yearmonth='+this.selectedYearMonth;
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
                                let sdayList=[];
                                let tempList=[];
                                response.data.result.forEach(row=>{
                                    //alert(JSON.stringify(row));
                                    tempList = row.days.split('-');
                                    sdayList.push(tempList[2]);
                                });
                                this.dayList = sdayList;
                                this.dayYMDList = response.data.result;
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

                            case ResponseCode.OK.code:
                                //alert(JSON.stringify(response.data.result));
                                this.weekList = response.data.result;
                                this.selectedWeek = response.data.result[0].week_count;
                                this.selectedWeekStartDate = response.data.result[0].start_date;
                                this.selectedWeekEndDate = response.data.result[0].end_date;
                                if(this.selectedOption == 'weekly') this.getStat();
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
                case 'byUsing' :  
                    csvContent = "날짜,사용횟수\n";
                    csvContent += [
                        ...this.statListUsing.map(item => Object.values(item).join(","))
                    ]
                        .join("\n")
                        .replace(/(^\[)|(\]$)/gm, "");
                    //const murl = window.URL.createObjectURL(new Blob([csvContent]));
                    const uurl = window.URL.createObjectURL(new Blob(["\ufeff"+csvContent], {type: 'text/csv;charset=utf-8;'}));
                    const ulink = document.createElement('a');
                    ulink.href = uurl;
                    ulink.setAttribute('download', filename);         
                    document.body.appendChild(ulink); 
                    ulink.click();                
                break;
                case 'byLevel' :  
                    csvContent = "날짜,level1,level2,level3,level4,level5,level6,level7,level8\n";
                    csvContent += [
                        ...this.statListbyLevel.map(item => Object.values(item).join(","))
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
        getStat(){
            let get_param = '';
            let _url = '' ;
            switch(this.selectedOption) {
                case 'daily' : 
                    get_param = 'type=daily&yearmonth='+this.selectedYearMonth;
                    _url = "/typing/api/statistics/stat-lkp-daily?";
                    break;
                case 'weekly' : 
                    get_param = "type=weekly&week="+this.selectedWeek
                        +"&start_date="+this.selectedWeekStartDate 
                        +"&end_date="+this.selectedWeekEndDate
                    _url = "/typing/api/statistics/stat-lkp-weekly?";    
                break;
                case 'monthly' : 
                    get_param = 'type=monthly&yearmonth='+this.selectedYearMonth;
                    _url = "/typing/api/statistics/stat-lkp-monthly?";
                    break;                
                default :
                    get_param = 'yearmonth='+this.selectedYearMonth;    
            }

            _url += get_param;
            //alert(_url);
            //return;
            
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
                                return this.$root.deleteCookieNGoToLogin();
                                break;

                            case ResponseCode.NO_AUTHORITY.code:
                                alert('해당 페이지에 접근할 권한이 없습니다.');
                                return;
                                break;

                            case ResponseCode.OK.code:
                                //alert(JSON.stringify(response.data.result));
                                //this.statList = response.data.result;
                                this.statListUsing = response.data.result.usingLog;
                                this.statListbyLevel = response.data.result.byLevelLog;
                                break;

                            default:
                                alert(
                                    "통계정보를 가져오는데 실패 했습니다.\n다시 시도해 주세요.\n"
                                    +response.data.code+ "::" +response.data.message
                                );
                        } //switch
                        
                    } //if else                     
                })
        }
    },
    created(){
        let date = new Date();
        //set default to_day
        this.selectedYear = date.getFullYear();        
        this.selectedMonth = date.getMonth() + 1 < 10 ? '0'.concat('',date.getMonth()+1) : date.getMonth()+1; 
        this.selectedHour = '00'; 
        this.selectedDay = date.getDate() < 10 ? '0'.concat('',date.getDate()) : date.getDate();
        this.selectedYearMonth = date.getFullYear()+'-'+('0' + (date.getMonth() + 1)).slice(-2);

        this.getYList();
        this.getYMList();
        this.getWeekList();  

        //초기 페이지
        this.getStat('daily');

    }
};
</script>