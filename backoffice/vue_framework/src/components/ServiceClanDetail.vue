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

<!-- 탭 처리 -->
<div class="mt-5">
        <ul class="nav nav-tabs" id="myTab" role="tablist">
            <li class="nav-item">
                <a class="nav-link "  v-bind:class="[tabController == 'i' ? 'active':'']" id="clan-tab" data-toggle="tab" href="#clan-profile" role="tab"  aria-selected="false">클랜정보 & 클랜원</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" v-bind:class="[tabController == 'f' ? 'active':'']" id="freeboard-tab" data-toggle="tab" href="#clan-freeboard" role="tab" aria-selected="false">클랜 자유게시판</a>
            </li>
        </ul>
        <div class="tab-content mt-3" id="myTabContent">
            <!-- 길드 정보 탭 시작 -->
            <div class="tab-pane fade " v-bind:class="[tabController == 'i' ? 'active show':'']" id="clan-profile" role="tabpanel" >
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
                                <th>클랜이름</th>
                                <td>
                                    <div class="col-12 form-row align-items-center">
                                        <div class="col-sm-4">
                                            <div class="input-group">
                                                <input
                                                    type="text"
                                                    class="form-control"
                                                    id
                                                    placeholder
                                                    v-model="clanInfo.name"
                                                >
                                            </div>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <th>클랜장</th>
                                <td>
                                    <div class="col-12 form-row align-items-center">
                                        <div class="col-sm-4">
                                            <div class="input-group">
                                                <input
                                                    type="text"
                                                    class="form-control"
                                                    id
                                                    placeholder
                                                    v-model="clanInfo.manager_nickname"
                                                >
                                            </div>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <th>클랜소개</th>
                                <td>
                                    <div class="col-12 form-row align-items-center">
                                        <div class="col-sm-12">
                                            <div class="input-group">
                                                <input
                                                    type="text"
                                                    class="form-control"
                                                    id
                                                    placeholder
                                                    v-model="clanInfo.description"
                                                >
                                            </div>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div class="data-tables mt-5">
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
                                                    <input
                                                        type="text"
                                                        class="form-control"
                                                        placeholder="닉네임"
                                                        v-model="keyword"
                                                    >
                                                </div>
                                            </div>
                                            <div class="col-auto my-1">
                                                <button class="btn btn-warning" v-on:click.prevent="search">검색</button>
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
                            <div class="col-md-6 pull-left pt-2">클랜원 :
                                <span class="fc_y">{{totalCount}}</span>
                            </div>
                            <div class="col-md-6">
                                <select
                                    class="custom-select custom-select-sm form-control form-control-sm pull-right"
                                    style="width:100px;"
                                >
                                    <option value="10">10</option>
                                    <option value="25">25</option>
                                    <option value="50">50</option>
                                    <option value="100">100</option>
                                </select>
                            </div>
                        </div>
                        <div class="tablewrap mt-2">
                            <table class="tbsty01 text-center">
                                <colgroup>
                                    <col width="150">
                                    <col width="*">
                                    <col width="200">
                                </colgroup>
                                <thead>
                                    <tr>
                                        <th>
                                            <span>NO</span>
                                        </th>
                                        <th>
                                            <span>닉네임</span>
                                        </th>
                                  
                                        <th>
                                            <span>클랜 가입일</span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr  v-for=" member, index in clanMemberList">
                                        <td>{{virtualNumber - index}}</td>
                                        <td>{{member.nickname}}</td>
                                        <td>{{dateTimeFormat(member.created_at)}}</td>
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
                        <button v-on:click="goToBack()" class="btn btn-flat btn-secondary">목록으로</button>
                        <button type="submit" class="btn btn-flat btn-secondary" @click="doCloseClan">클랜 폐쇄하기</button>
                    </div>
                </div>
                <!-- data table end -->
            </div>
            </div>
            <!-- 길드 정보 탭 끝 -->

            <!-- 길드 자게 탭 시작 -->
            <div class="tab-pane fade" v-bind:class="[tabController == 'f' ? 'active show':'']" id="clan-freeboard" role="tabpanel">
            <div class="spage-title-area">
                <div class="row align-items-center">
                    <div class="col-sm-12">
                        <div class="breadcrumbs-area clearfix">
                            <h4 class="spage-title pull-left">
                                <i class="ti-control-play"></i> 자유게시판관리
                            </h4>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-12 mt-1 sch-zone" style>
                <form>
                    <div class="form-row align-items-center">
                        <div class="col-sm-1 my-1">검색조건</div>
                        <div class="col-sm-2 my-1">
                            <select class="form-control" v-model="deletedFlag" @change="getForumClanList()">
                                <option
                                    v-for="option in deletedOptions"
                                    :value="option.value"
                                >{{ option.title }}</option>
                            </select>
                        </div>                        
                        <div class="col-sm-1 my-1">
                            <select class="form-control" v-model="cfieldId">
                                <option
                                    v-for="option in csearchOptions"
                                    :value="option.value"
                                >{{ option.title }}</option>
                            </select>
                        </div>
                        <div class="col-sm-4 my-1">
                            <div class="input-group">
                                <input
                                    type="text"
                                    class="form-control"
                                    placeholder="검색"
                                    v-model="ckeyword"
                                >
                            </div>
                        </div>
                        <div class="col-auto my-1">
                            <button class="btn btn-warning" v-on:click.prevent="csearch">검색</button>
                            <button class="btn btn-warning" v-on:click.prevent="csearchCancel">검색취소</button>
                        </div>
                    </div>
                </form>
            </div>
            <!-- search area end -->
            <div class="row">
                <!-- data table start -->
                <div class="col-12 mt-5">
                    <div class="data-tables">
                        <div class="row">
                            <div class="col-md-6 pull-left">
                                전체 :
                                <span class="fc_y">{{ this.ctotalCount }}</span>
                            </div>
                            <div class="col-md-6">
                                <select
                                    class="custom-select custom-select-sm form-control form-control-sm pull-right"
                                    style="width:100px;"
                                    v-model="ccount"
                                    @change="getForumList()"
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
                                    <col  v-if="deletedFlag!=0" width="170">
                                    <col width="*">
                                    <col width="150">
                                    <col width="150">
                                    <col width="150">
                                    <col width="150">
                                </colgroup>
                                <thead>
                                    
                                    <tr>
                                        <th>
                                            <span>
                                                No
                                                <i class="ti-exchange-vertical"></i>
                                            </span>
                                        </th>
                                        <th v-if="deletedFlag!=0">
                                            <span>
                                                삭제일
                                                <i class="ti-exchange-vertical"></i>
                                            </span>
                                        </th>                                          
                                        <th>
                                            <span>
                                                제목
                                                <i class="ti-exchange-vertical"></i>
                                            </span>
                                        </th>
                                        <th>
                                            <span>
                                                작성자
                                                <i class="ti-exchange-vertical"></i>
                                            </span>
                                        </th>
                                        <th>
                                            <span>
                                                작성일
                                                <i class="ti-exchange-vertical"></i>
                                            </span>
                                        </th>                                        
                                        <th>
                                            <span>
                                                조회수
                                                <i class="ti-exchange-vertical"></i>
                                            </span>
                                        </th>
                                        <th>
                                            <span>
                                                공감수
                                                <i class="ti-exchange-vertical"></i>
                                            </span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(forum,index) in forumlist" @click="cgotoDetail(forum.id)" :style="[forum.deleted_at != null ? {'background-color':'#efefef'}:{}]">
                                        <td>{{ cvirtualNumber - index }}</td>
                                        <td  v-if="deletedFlag!=0" :style="[forum.deleted_at != null ? {'color':'red', 'font-weight':'bold'}:{}]" >{{ dateTimeFormat(forum.deleted_at) }}</td>                                        
                                        <td>{{ forum.subject }}</td>
                                        <td>{{ forum.nickname }}</td>
                                        <td>{{ dateTimeFormat(forum.created_at) }}</td>
                                        <td>{{ forum.views }}</td>
                                        <td>{{ forum.likes }}</td>
                                    </tr>
                                    <tr v-if="forumlist.length === 0">
						                <td  v-if="deletedFlag==0" colspan="6" class="clan-empty">등록된 자유게시판글이 없습니다.</td>
                                        <td  v-if="deletedFlag==1" colspan="7" class="clan-empty">등록된 자유게시판글이 없습니다.</td>
						            </tr>
                                </tbody>
                            </table>
                        </div>
                        <div class="paging">
                            <a v-if="cstartPage > 1" class="prev" v-on:click.prevent="goToPage(startPage-1)">이전</a>
                            
                            <span
                                v-for="n in cpages"
                                :key="n.id"
                                v-on:click.prevent="cgoToPage(n)"
                            >
                                <a v-if="ccurrentPage !== n">{{ n }}</a>
                                <strong v-if="ccurrentPage === n">{{ n }}</strong>
                                <span></span>
                            </span>
                            
                            <a v-if="cendPage < ctotalPageCount" class="next" v-on:click.prevent="goToPage(endPage+1)">다음</a> 
                        </div>
                    </div>
                </div>
                </div>
            </div>
            <!-- 길드 자게 탭 끝 -->
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
    name: "newsList",
    components: {
        "header-area": HeaderArea,
        "favor-zone": FavorZone,
        "page-title-area": PageTitleArea
    },
    data(){
        return {
            tabController: 'i',
            clanInfo: {},
            clanMemberList: [],
            forumlist: [],
            searchOptions : [
                {title: '이름', value: 1 }
            ],
            csearchOptions: [
                { title: "전체", value: 0 },
                { title: "제목", value: 1 },
                { title: "내용", value: 2 },
                { title: "작성자", value: 3 }
            ],            
            deletedOptions: [
                { title: "삭제된 글 제외", value: 0 },
                { title: "삭제된 글 포함", value: 1 },
            ],            
            listScale: [
                { count: 10 },
                { count: 25 },
                { count: 50 },
                { count: 100 }
            ],
            fieldId: 0,
            cfieldId: 0,
            deletedFlag: 0,
            keyword: "",
            ckeyword: "",
            count: 10,
            ccount: 10,
            totalCount: 0,
            ctotalCount: 0,
            totalPageCount: 0,
            ctotalPageCount: 0,
            startPage: 0,
            cstartPage: 0,
            endPage: 0,
            cendPage: 0,
            currentPage: 1,
            ccurrentPage: 1,
            virtualNumber: 0,
            cvirtualNumber: 0,
            pages: [],
            cpages: []
        }
    },    
    methods: {
        goToBack(){
            //this.$router.go(-1);
            window.location.href='/typing/service/clan/list'
        },
        updateFavor(){
            this.$refs.favor_zone.updateFavorZone();
        },
        getClanInfo(){
            let url =
                "/typing/api/service/clan/"+this.id+"/info?" +
                (this.count ? "count=" + this.count : "") +
                (this.currentPage ? "&page=" + this.currentPage : "") +
                (this.keyword
                    ? "&fieldId=" + this.fieldId + "&keyword=" + this.keyword
                    : "");                

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
                                this.clanInfo = response.data.result.clanInfo;
                                this.clanMemberList = response.data.result.clanMembers.rows;

                                this.startPage =        response.data.result.pagination.firstPage;
                                this.endPage =          response.data.result.pagination.lastPage;    
                                this.pages =            this.makePages(this.startPage, this.endPage); 

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
        getForumClanList() {
            let url =
                "/typing/api/service/forumclan/list?deleted_flag="+ this.deletedFlag + "&clan_id="+this.id +
                (this.ccount ? "&count=" + this.ccount : "") +
                (this.ccurrentPage ? "&page=" + this.ccurrentPage : "") +
                (this.ckeyword
                    ? "&fieldId=" + this.cfieldId + "&keyword=" + this.ckeyword
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
                                return;
                                break;

                            case ResponseCode.OK.code:
                                //alert(JSON.stringify(response.data));
                                this.forumlist =        response.data.result.rows;
                                this.ctotalCount =       response.data.result.pagination.totalItemCount;
                                this.cvirtualNumber =    response.data.result.pagination.virutalNumberStart;
                                this.ccount =            response.data.result.pagination.itemsPerPage;
                                this.ccurrentPage =      response.data.result.pagination.currentPage;
                                this.ctotalPageCount =   response.data.result.pagination.totalPageCount;
                                this.cstartPage =        response.data.result.pagination.firstPage;
                                this.cendPage =          response.data.result.pagination.lastPage;
                                this.cpages =            this.makePages(this.cstartPage, this.cendPage);
                                break;

                            default:
                                alert(
                                    "자유게시판의 글목록을 가져오는데 실패 했습니다.\n다시 시도해 주세요.\n"
                                    +response.data.code+"::"+response.data.message
                                );
                        } //switch

                    } //if else
                });
        },          
        doCloseClan() {
            if(confirm('해당 클랜을 폐쇄하시겠 습니까?')){
                this.$axios
                .post('/typing/api/service/clan/close', {
                    clan_id : this.id
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
                                return;
                                break;                                
                                
                            case ResponseCode.OK.code:
                                //alert(JSON.stringify(response.data));
                                alert('해당 클랜이 폐쇄 되었습니다.');
                                window.location.href='/typing/service/clan/list';
                                break;

                            default:
                                alert(
                                    "클랜을 폐쇄하는데 실패 했습니다.\n다시 시도해 주세요.\n"
                                    +response.data.code+"::"+response.data.message
                                );
                        } //switch

                    } //if else
                });
            }
            
        },         
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
            this.getClanInfo();
        },  
        cgoToPage(pageNum){
            this.ccurrentPage = pageNum;
            this.getForumClanList();
        },                
        dateTimeFormat(datetime) {
            if(datetime == null) return '';
            return moment(datetime).utcOffset('+0900').format("YYYY-MM-DD HH:mm:ss");
        },        
        search() {
            this.currentPage = 1;
            this.getClanInfo();
        },
        searchCancel() {
            this.keyword = "";
            this.fieldId = 1;
            this.currentPage = 1;
            this.getClanInfo();
        },   
        csearch() {
            this.ccurrentPage = 1;
            this.getForumClanList();
        },
        csearchCancel() {
            this.ckeyword = "";
            this.cfieldId = 1;
            this.ccurrentPage = 1;
            this.getForumClanList();
        },    
        cgotoDetail(id) {
            let searchOpstion =  {
                clan_id: this.id,
                deleted_flag: this.deletedFlag ,
                ccount: this.ccount ,
                ccurrentPage: this.ccurrentPage,
                cfieldId: this.cfieldId,
                ckeyword: this.ckeyword
            };

            let q = btoa(encodeURI(JSON.stringify(searchOpstion)));
            window.location.href = "/typing/service/clan/" + id + "/forumdetail?q="+q;
        },
        startProcess(){
            if(typeof(this.$route.query.q) == 'undefined') {
                this.getClanInfo();
                this.getForumClanList();
            } else{
                //페이지의 검색옵션 복원
                let searchValue = JSON.parse(decodeURI(atob(this.$route.query.q)));
                //alert('이전페이지 검색옵션 있음'+JSON.stringify(searchValue));
                this.deletedFlag = searchValue.deleted_flag;
                this.ccount = searchValue.ccount;
                this.ccurrentPage = searchValue.ccurrentPage;
                this.cfieldId = searchValue.cfieldId;
                this.ckeyword = searchValue.ckeyword;

                this.getClanInfo();
                this.getForumClanList();                

                // 클랜 포럼페이지로 활성화
                this.tabController = 'f';
            };
        }              
    },
    computed: {
        id(){
            return this.$route.params.id
        }
    },
    created(){
        this.startProcess();
    }
}
</script>