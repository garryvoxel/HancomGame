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
                                <i class="ti-control-play"></i> 회원관리
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
                                <th>포인트</th>
                                <td class="text-left">
                                    <div class="form-row align-items-center">
                                        <div class="col-sm-4">
                                            <div class="input-group">
                                                <input
                                                    type="text"
                                                    class="form-control"
                                                    :value="userInfo.points"
                                                >
                                            </div>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <th>닉네임</th>
                                <td class="text-left">
                                    <div class="form-row align-items-center">
                                        <div class="col-sm-4">
                                            <div class="input-group">
                                                <input
                                                    type="text"
                                                    class="form-control"
                                                    :value="userInfo.nickname"
                                                >
                                            </div>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <th>학교</th>
                                <td class="text-left">
                                    <div class="form-row align-items-center">
                                        <div class="col-sm-4">
                                            <div class="input-group">
                                                <input
                                                    type="text"
                                                    class="form-control"
                                                    :value="[userInfo.schoolname?userInfo.schoolname:'소속학교 없음']"
                                                >
                                            </div>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <th>클랜</th>
                                <td class="text-left">
                                    <div class="form-row align-items-center">
                                        <div class="col-sm-4">
                                            <div class="input-group">
                                                <input
                                                    type="text"
                                                    class="form-control"
                                                    :value="[userInfo.clanname?userInfo.clanname:'소속클랜 없음']"
                                                >
                                            </div>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <th>친구</th>
                                <td class="text-left">
                                    <div class="form-row align-items-center">
                                        <div class="col-sm-1">
                                            <div class="input-group">{{ FriendCount }}명</div>
                                        </div>
                                        <div class="col-auto">
                                            <button
                                                type="button"
                                                class="btn btn-warning btn-flat"
                                                data-toggle="modal"
                                                data-target="#exampleModalCenter"
                                            >친구목록</button>
                                            <div
                                                class="modal fade"
                                                id="exampleModalCenter"
                                                aria-hidden="true"
                                                style="display: none;"
                                            >
                                                <div
                                                    class="modal-dialog modal-dialog-centered"
                                                    role="document"
                                                >
                                                    <div class="modal-content">
                                                        <div class="modal-header">
                                                            <h5 class="modal-title">{{ userInfo.nickname }} 회원의 친구목록</h5>
                                                            <button
                                                                type="button"
                                                                class="close"
                                                                data-dismiss="modal"
                                                            >
                                                                <span>×</span>
                                                            </button>
                                                        </div>
                                                        <div class="modal-body">
                                                            <ul>
                                                                <li v-for="friend in FriendList">{{ friend.nickname }} : {{ friendStateStr(friend.state) }}</li>
                                                            </ul>
                                                        </div>
                                                        <div class="modal-footer text-center">
                                                            <button
                                                                type="button"
                                                                class="btn btn-secondary"
                                                                data-dismiss="modal"
                                                            >Close</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                            </tr>

                            <tr>
                                <th>이용제한</th>
                                <td class="text-left">
                                    <div class="custom-control custom-checkbox custom-control-inline">
                                        <input
                                            type="checkbox"
                                            id="checkboxRestrictedC"
                                            name="userRestricted"
                                            class="custom-control-input"
                                            value="checkboxRestrictedC"
                                            v-model="userInfo.restricted[restrictedCode.write]" />
                                        <label class="custom-control-label" for="checkboxRestrictedC">쓰기</label>
                                    </div>
                                    <div class="custom-control custom-checkbox custom-control-inline">
                                        <input
                                            type="checkbox"
                                            id="checkboxRestrictedU"
                                            name="userRestricted"
                                            class="custom-control-input"
                                            value="checkboxRestrictedU"
                                            v-model="userInfo.restricted[restrictedCode.update]" />
                                        <label class="custom-control-label" for="checkboxRestrictedU">수정</label>
                                    </div>
                                    <div class="custom-control custom-checkbox custom-control-inline">
                                        <input
                                            type="checkbox"
                                            id="checkboxRestrictedD"
                                            name="userRestricted"
                                            class="custom-control-input"
                                            value="checkboxRestrictedD"
                                            v-model="userInfo.restricted[restrictedCode.delete]" />
                                        <label class="custom-control-label" for="checkboxRestrictedD">삭제</label>
                                    </div>
                                    <div class="custom-control custom-control-inline">
                                        <button class="btn btn-warning" v-on:click.prevent="setRestricted">적용</button>
                                    </div>
                                </td>
                            </tr>

                        </tbody>
                    </table>
                </div>
            </div>

            <div class="spage-title-area">
                <div class="row align-items-center">
                    <div class="col-sm-12">
                        <div class="breadcrumbs-area clearfix">
                            <h4 class="spage-title pull-left">
                                <i class="ti-control-play"></i> 활동정보
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
                                <th>타자 정보</th>
                                <td class="text-left" style="padding-left:0">
                                    <span class="dset" style="border:0; margin-left:0">
                                        <select class="form-control" v-model="selectedYear" @change="doYearChange()">
                                            <option v-for="year in yearList" :value="year">{{year}}년</option>
                                        </select>
                                    </span>                                                                              
                                    <span class="dset" style="border:0" >
                                        <select class="form-control" v-model="selectedMonth" @change="doMonthChange()">
                                            <option v-for="month in monthList" :value="month">{{month}}월</option>
                                        </select>
                                    </span>      
                                    <hr>
                                    <table class="tbl">
                                        <tr>
                                            <td>
                                                <table class="tbl">
                                                    <tr>
                                                        <td>날짜</td>
                                                        <td>자판</td>
                                                        <td>정확도</td>
                                                    </tr>
                                                    <tr v-for="acc in statAccList">
                                                        <td>{{acc.Day}}일</td>
                                                        <td>{{acc.LanguageName}}</td>
                                                        <td class="text-right">{{acc.avgAcc}}%</td>
                                                    </tr>   
                                                    <tr v-if="statAccList.length == 0">
                                                        <td colspan="3">정보없음</td>
                                                    </tr>                                                     
                                                </table>
                                            </td>
                                            <td class="align-text-top">
                                                <table class="tbl">
                                                    <tr>
                                                        <td>날짜</td>
                                                        <td>자판</td>
                                                        <td>속도</td>
                                                    </tr>
                                                    <tr v-for="speed in statSpeedList">
                                                        <td>{{speed.Day}}일</td>
                                                        <td>{{speed.LanguageName}}</td>
                                                        <td class="text-right">{{speed.avgSpeed}}</td>
                                                    </tr> 
                                                    <tr v-if="statSpeedList.length == 0">
                                                        <td colspan="3">정보없음</td>
                                                    </tr>                                                        
                                                </table>                                                
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                            <tr>
                                <th>게임활동정보</th>
                                <td class="text-left">
                                    <div class="form-row align-items-center">
                                        <div class="col-sm-2">
                                            <select class="form-control" v-model="selectedGame" @change="getGameCount">
                                                <option v-for="game in gameOptions" :value="game.value">{{game.name}}</option>
                                            </select>
                                        </div>
                                    </div>
                                    <hr>
                                    <table>
                                        <tr>
                                            <th>게임실행횟수</th>
                                            <td class="text-left">{{ gameRunCount }}번</td>
                                        </tr>                            
                                        <tr>
                                            <th>학교순위</th>
                                            <td class="text-left">{{ schoolRank }}</td>
                                        </tr>                                             
                                    </table>
                                </td>
                            </tr>
                            <tr>
                                <th>가입일</th>
                                <td class="text-left">{{ dateFormat(userInfo.created_at) }}</td>
                            </tr>
                            <tr>
                                <th>최근접속일</th>
                                <td class="text-left">{{ dateFormat(lastLoginDate) }}</td>
                            </tr>

                        </tbody>
                    </table>
                </div>
            </div>

            <div class="col-12 text-center mt-3">
                <button v-on:click="goToBack()" class="btn btn-flat btn-success">목록으로</button>
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
    name: "maincontentwrite",
    components: {
        "header-area": HeaderArea,
        "favor-zone": FavorZone,
        "page-title-area": PageTitleArea
    },
    data(){
        var restrictedDef = {};
        restrictedDef[ResponseCode.NOT_ALLOWED_TO_WRITE.code] = false;
        restrictedDef[ResponseCode.NOT_ALLOWED_TO_UPDATE.code] = false;
        restrictedDef[ResponseCode.NOT_ALLOWED_TO_DELETE.code] = false;
        return{
            statList: []
            , statAccList: []
            , statSpeedList: []
            , userInfo: {
                restricted: restrictedDef
            }
            , lastLoginDate: ''
            , FriendState: {
                'sent' : '친구 신청중'
                , 'received' : '친구 신청받음'
                , 'friend' : '친구'
            }
            ,gameOptions:[
                {name:'게임선택', value:''},
                {name:'동전쌓기', value:'10000'},
                {name:'판뒤집기', value:'10001'},
                {name:'두더지잡기', value:'10002'},
                {name:'타자연습', value:'10003'}
            ]            
            , FriendList : []
            , FriendCount: 0,
            yearList: [],
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
            selectedYear: '',
            selectedMonth: '',
            selectedGame:'',
            gameRunCount: 0,
            schoolRank: '',
            restrictedCode: {
                write: ResponseCode.NOT_ALLOWED_TO_WRITE.code,
                update: ResponseCode.NOT_ALLOWED_TO_UPDATE.code,
                delete: ResponseCode.NOT_ALLOWED_TO_DELETE.code
            }
        }
    },
    methods: {
        getUserInfo(){
            this.$axios
                .get('/typing/api/users/'+this.id+'/info')
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
                                
                                this.userInfo = response.data.result.UserInfo;
                                //alert(JSON.stringify(this.userInfo));
                                this.FriendList = response.data.result.FriendList;
                                this.FriendCount = response.data.result.FriendCount;
                                this.lastLoginDate = response.data.result.lastLoginDate;

                                this.schoolRank = this.userInfo.schoolname? '게임을 선택해주세요':'소속학교 없음';
                                break;

                            default:
                                alert(
                                    "회원의 정보를 가져오는데 실패 했습니다.\n다시 시도해 주세요."
                                );
                        } //switch

                    } //if else
                })
                .catch(error=>{alert('Catch case: '+error.message);});
        },
        goToBack(){
            this.$router.go(-1);
        },
        dateFormat(datetime) {
            return moment(datetime).utcOffset('+0900').format("YYYY-MM-DD");
        },
        friendStateStr(state){
            return this.FriendState[state];
        },
        updateFavor(){
            this.$refs.favor_zone.updateFavorZone();
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
        doYearChange(){
            this.statList=[];
            this.dayList=[];
            this.selectedMonth='';
        },
        doMonthChange(){
            this.statList=[];
            //통계 가져오기
            this.getStat();
        },        
        setRestricted() {
            var restrictedResult = "";
            restrictedResult += (this.userInfo.restricted[this.restrictedCode.write] === true)? "1" :"0";
            restrictedResult += (this.userInfo.restricted[this.restrictedCode.update] === true)? "1" :"0";
            restrictedResult += (this.userInfo.restricted[this.restrictedCode.delete] === true)? "1" :"0";
            this.$axios
                .post("/typing/api/users/"+this.id+"/update", {
                    restricted: restrictedResult
                })
                .then(response=>{
                    if (typeof response == "undefined") {
                        alert(
                            "서버와 통신이 원활하지 않습니다.\n잠시후 다시 시도해 주세요."
                        );
                    } else {
                        switch (response.data.code) {
                            case ResponseCode.UNAUTHORIZED.code:
                                return this.$root.deleteCookieNGoToLogin();
                                break;

                            case ResponseCode.NO_AUTHORITY.code:
                                alert('해당 페이지에 접근할 권한이 없습니다.');
                                return;
                                break;

                            case ResponseCode.PASSWORDEXPIRE.code:
                                return;
                                break;

                            case ResponseCode.OK.code:
                                alert('사용자 정보가 업데이트 되었습니다.');
                                break;

                            default:
                                alert(
                                    "사용자 정보를 업데이트하는데 실패 했습니다.\n다시 시도해 주세요.\n"
                                    +response.data.code+ "::" +response.data.message
                                );
                        } //switch
                        
                    } //if else                     
                })
        },
        getStat(){
            let get_param = "uuid="+this.id+"&yearmonth="+this.selectedYear+this.selectedMonth;
            let _url = "/typing/api/statistics/stat-user-typingbymonth?"+get_param ;
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

                            case ResponseCode.PASSWORDEXPIRE.code:
                                return;
                                break;

                            case ResponseCode.OK.code:
                                //alert(JSON.stringify(response.data.result.speed));
                                //this.statList = response.data.result;
                                this.statAccList = response.data.result.acc;
                                this.statSpeedList = response.data.result.speed;
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
        getGameCount(){
            this.gameRunCount = 0;
            this.schoolRank = '';
            if(this.selectedGame == '') { alert('게임을 선택해주세요!'); return; }
            let get_param = "uuid="+this.id+"&gameid="+this.selectedGame+"&SchoolId="+this.userInfo.schoolId;
            let _url = "/typing/api/statistics/stat-user-gamerunbymonth?"+get_param ;
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

                            case ResponseCode.PASSWORDEXPIRE.code:
                                return;
                                break;

                            case ResponseCode.OK.code:
                                //alert(JSON.stringify(response.data.result));
                                //this.statList = response.data.result;
                                //alert(response.data.result[0].runCount);
                                this.gameRunCount = response.data.result[0].runCount;
                                if(typeof(this.userInfo.schoolId) != 'undefined') this.getSchoolRanking();
                                else this.schoolRank = '소속학교 없음';
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
        getSchoolRanking(){
            let get_param = "gameid="+this.selectedGame+"&SchoolId="+this.userInfo.schoolId;
            let _url = "/typing/api/statistics/stat-school-rank-bygame?"+get_param ;           
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

                            case ResponseCode.PASSWORDEXPIRE.code:
                                return;
                                break;
                                
                            case ResponseCode.OK.code:
                                //alert(JSON.stringify(response.data.result));
                                if(response.data.result == 0) this.schoolRank = '순위에 없음.';
                                else this.schoolRank = response.data.result;
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
    computed: {
        id(){
            return this.$route.params.id
        }
    },
    created(){
        let date = new Date();
        this.getYList();
        this.selectedYear = date.getFullYear();  
        this.selectedMonth = date.getMonth() + 1 < 10 ? '0'.concat('',date.getMonth()+1) : date.getMonth()+1; 
        this.getUserInfo();
        this.getStat();
    }
};
</script>
