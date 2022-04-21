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
                                <i class="ti-control-play"></i> 주간 랭킹 (100위)
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
                                            <div class="col-sm-2 my-1">
                                                <div class="input-group">
                                                    <select class="form-control" 
                                                    v-model="game_code"
                                                    @change="getRankingList()">
                                                        <option v-for="item in game_arr" :value="item.value">{{item.title}}</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div class="col-auto my-1">
                                                <!--button type="submit" class="btn btn-warning">검색</button-->
                                            </div>
                                        </div>
                                    </form>
                                </td>
                            </tr>
                            <!--tr>
                                <th>기간</th>
                                <td>
                                    <div class="col-12 text-left">
                                        <span class="dset">
                                            <input
                                                type="text"
                                                class="datepicker inpType"
                                                name="searchStartDate"
                                                id="searchStartDate"
                                            >
                                            <a href="#none" class="btncalendar dateclick">달력</a>
                                        </span>
                                        <span class="demi">~</span>
                                        <! -- 종료일 -  ->
                                        <span class="dset ml-3">
                                            <input
                                                type="text"
                                                class="datepicker inpType"
                                                name="searchEndDate"
                                                id="searchEndDate"
                                            >
                                            <a href="#none" class="btncalendar dateclick">달력</a>
                                        </span>
                                    </div>
                                </td>
                            </tr -->
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
                                    <col width="120">
                                    <col width="120">
                                </colgroup>
                                <thead>
                                    <tr>
                                        <th>
                                            <span>순위
                                                <i class="ti-exchange-vertical"></i>
                                            </span>
                                        </th>
                                        <th>
                                            <span>닉네임
                                                <i class="ti-exchange-vertical"></i>
                                            </span>
                                        </th>
                                        <th>
                                            <span>학교
                                                <i class="ti-exchange-vertical"></i>
                                            </span>
                                        </th>
                                        <th>
                                            <span>점수
                                                <i class="ti-exchange-vertical"></i>
                                            </span>
                                        </th>
                                        <th v-if="game_code === 'TYPING_RANKING'">
                                            <span>평균타수
                                                <i class="ti-exchange-vertical"></i>
                                            </span>
                                        </th>
                                        <th  v-if="game_code === 'SETCOIN_RANKING' || game_code === 'PANCHANGE_RANKING'">
                                            <span>승
                                                <i class="ti-exchange-vertical"></i>
                                            </span>
                                        </th>
                                        <th v-if="game_code === 'SETCOIN_RANKING' || game_code === 'PANCHANGE_RANKING'">
                                            <span>패
                                                <i class="ti-exchange-vertical"></i>
                                            </span>
                                        </th>
                                        <th v-if="game_code === 'SETCOIN_RANKING' || game_code === 'PANCHANGE_RANKING'">
                                            <span>무
                                                <i class="ti-exchange-vertical"></i>
                                            </span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(row , index) in rankingList">
                                        <td>{{row.rank}}</td>
                                        <td v-on:click.prevent="findUserIDByNickName(row.nickname)">{{row.nickname}}</td>
                                        <td>{{findSchoolnameByNickName(row.nickname)}}</td>
                                        <td>{{toNumberFormat(Number(row.gamedata))}}</td>
                                        <td v-if="game_code === 'TYPING_RANKING'">{{toNumberFormat(findTypingspeedByNickName(row.nickname))}}</td>
                                        <td v-if="game_code === 'SETCOIN_RANKING' || game_code === 'PANCHANGE_RANKING'">{{findWinByNickName(row.nickname)}}</td>
                                        <td v-if="game_code === 'SETCOIN_RANKING' || game_code === 'PANCHANGE_RANKING'">{{findLoseByNickName(row.nickname)}}</td>
                                        <td v-if="game_code === 'SETCOIN_RANKING' || game_code === 'PANCHANGE_RANKING'">{{findDrawByNickName(row.nickname)}}</td>
                                    </tr>
                                    <tr v-if="rankingList.length === 0">
						                <td colspan="8" class="clan-empty">등록된 랭킹정보가 없습니다.</td>
						            </tr>
                                </tbody>
                            </table>
                        </div>
                        <!-- div class="paging">
                            <a href class="prev">이전</a>
                            <strong>1</strong>
                            <a href>2</a>
                            <a href>3</a>
                            <a href>4</a>
                            <a href>5</a>
                            <a href>6</a>
                            <a href>7</a>
                            <a href>8</a>
                            <a href>9</a>
                            <a href>10</a>
                            <a href class="next">다음</a>
                        </div-->
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
    name: "ranking",
    components: {
        "header-area": HeaderArea,
        "favor-zone": FavorZone,
        "page-title-area": PageTitleArea
    },
    data(){
        return {
            rankingList: [],
            userList: [],
            schoolList: [],
            gameData: [],
            game_arr : [
                 {title:'한컴 타자연습', value:'TYPING_RANKING'}
                ,{title:'두더지잡기', value:'MOLE_RANKING'}
                ,{title:'동전쌓기', value:'SETCOIN_RANKING'}
                ,{title:'판 뒤집기', value:'PANCHANGE_RANKING'}
            ],
            listScale: [
                { count: 100 }
            ],
            listScale_back: [
                { count: 10 },
                { count: 25 },
                { count: 50 },
                { count: 100 }
            ],            
            count: 100,
            totalCount: 0,
            totalPageCount: 0,
            startPage: 0,
            endPage: 0,
            currentPage: 1,
            virtualNumber: 0,
            pages: [],
            game_code: 'TYPING_RANKING',
        }
    },
    methods:{
        getRankingList(){
            this.$axios
                .post('/typing/api/service/ranking',{
                    game_code: this.game_code ,
                    start: (this.currentPage -1) * this.count ,
                    end : this.currentPage * this.count -1
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
                                alert('비밀번호 유효기간(180일)이 지났습니다.\n비밀번호를 변경해 주세요.');
                                window.location.href = "/typing/managers/pwmodifyforce";
                                return;
                                break;
                                                                
                            case ResponseCode.OK.code:
                                //alert(JSON.stringify(response.data.result));
                                this.rankingList = response.data.result.rows;
                                this.userList = response.data.result.userList;
                                this.schoolList = response.data.result.schoolList;
                                this.gameData = response.data.result.gameData;
                                break;

                            default:
                                alert(
                                    "____ 실패 했습니다.\n다시 시도해 주세요.\n"
                                    +response.data.code+ "::" +response.data.message
                                );
                        } //switch

                    } //if else   
                })
                .catch(error=>{alert('Catch case: '+error.message);});
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
        findUserIDByNickName(nickname){
            for(let i in this.userList) {
                if (this.userList[i].nickname == nickname)  return this.userList[i].id
            }
        },
        findSchoolnameByNickName(nickname){
            let userID = this.findUserIDByNickName(nickname);
            for(let i in this.schoolList) {
                if (this.schoolList[i].user_id == userID)  return this.schoolList[i]["School.name"];
            }
            return "소속 학교 없음";
        },
        findTypingspeedByNickName(nickname){
            let userID = this.findUserIDByNickName(nickname);

            switch (this.game_code) {
                case 'TYPING_RANKING' : 
                    for(let i in this.gameData) {
                    if (this.gameData[i].user_id == userID)  return this.gameData[i]["TotalSpeedCount"];
                    }
                break;

                default :
                return '-';
            }
        },
        findWinByNickName(nickname){
            let userID = this.findUserIDByNickName(nickname);

            switch (this.game_code) {
                case 'PANCHANGE_RANKING' : 
                case 'SETCOIN_RANKING' : 
                    for(let i in this.gameData) {
                    if (this.gameData[i].user_id == userID)  return this.gameData[i]["Win"];
                    }
                break;

                default :
                return '-';
            }
        },
        findLoseByNickName(nickname){
            let userID = this.findUserIDByNickName(nickname);

            switch (this.game_code) {
                case 'PANCHANGE_RANKING' : 
                case 'SETCOIN_RANKING' : 
                    for(let i in this.gameData) {
                    if (this.gameData[i].user_id == userID)  return this.gameData[i]["Lose"];
                    }
                break;

                default :
                return '-';
            }
        },
        findDrawByNickName(nickname){
            let userID = this.findUserIDByNickName(nickname);

            switch (this.game_code) {
                case 'PANCHANGE_RANKING' : 
                case 'SETCOIN_RANKING' : 
                    for(let i in this.gameData) {
                    if (this.gameData[i].user_id == userID)  return this.gameData[i]["Draw"];
                    }
                break;

                default :
                return '-';
            }
        }                                           
    },
   created(){
       this.getRankingList();
   } 
};
</script>