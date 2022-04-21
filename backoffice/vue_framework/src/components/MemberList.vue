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
                                                    v-model="keyword"
                                                    id="es-keyword"
                                                    type="text"
                                                    class="form-control"
                                                    placeholder="검색어"
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
                                    @change="getMemberList()"
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
                                    <col width="150">
                                    <col width="150">
                                    <col width="150">
                                    <col width="150">
                                    <col width="150">
                                    <col width="150">
                                </colgroup>
                                <thead>
                                    <tr>
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
                                            <span>이메일
                                                <i class="ti-exchange-vertical"></i>
                                            </span>
                                        </th>
                                        <th>
                                            <span>학교
                                                <i class="ti-exchange-vertical"></i>
                                            </span>
                                        </th>                                        
                                        <th>
                                            <span>가입일
                                                <i class="ti-exchange-vertical"></i>
                                            </span>
                                        </th>
                                        <th>
                                            <span>접속일
                                                <i class="ti-exchange-vertical"></i>
                                            </span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(member,index) in memberlist" v-on:click="goToDetail(member.id)">
                                        <td>{{ virtualNumber - index }}</td>
                                        <td>{{ member.nickname }}</td>
                                        <td></td>
                                        <td>{{ member.schoolname }}</td>
                                        <td>{{ momentfnc(member.created_at) }}</td>
                                        <td></td>
                                    </tr>
                                    <tr v-if="memberlist.length === 0">
						                <td colspan="6" class="clan-empty">등록된 회원이 없습니다.</td>
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
import moment from "moment";

export default {
    name: "eventList",
    components: {
        "header-area": HeaderArea,
        "favor-zone": FavorZone,
        "page-title-area": PageTitleArea
    },
    data() {
        return {
            memberlist: [],
            searchOptions: [
                { title: "전체", value: 0 },
                { title: "닉네임", value: 1 },
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
            pages: []
        };
    },
    methods: {
        getMemberList() {
            let url =
                "/typing/api/users/list?" +
                (this.count ? "count=" + this.count : "") +
                (this.currentPage ? "&page=" + this.currentPage : "") +
                (this.keyword
                    ? "&fieldId=" + this.fieldId + "&keyword=" + this.keyword
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
                        switch(response.data.code) {
                            case ResponseCode.UNAUTHORIZED.code : 
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
                                                                
                            case ResponseCode.OK.code :
                                this.memberlist =       response.data.result.rows;
                                this.totalCount =       response.data.result.pagination.totalItemCount;
                                this.virtualNumber =    response.data.result.pagination.virutalNumberStart;
                                this.count =            response.data.result.pagination.itemsPerPage;
                                this.currentPage =      response.data.result.pagination.currentPage;
                                this.totalPageCount =   response.data.result.pagination.totalPageCount;
                                this.startPage =        response.data.result.pagination.firstPage;
                                this.endPage =          response.data.result.pagination.lastPage;      
                                this.pages =            this.makePages(this.startPage, this.endPage);                      
                            break;

                            default:
                                alert('공지사항 목록을 가져오는데 실패 했습니다.\n다시 시도해 주세요\n'+response.data.message);
                        }
                    }
                })
                .catch(error=>{
                  alert('Catch case: '+error.message);
                });
        },
        search() {
            this.currentPage = 1;
            this.getMemberList();
        },
        searchCancel() {
            this.keyword = "";
            this.fieldId = 1;
            this.currentPage = 1;
            this.getMemberList();
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
        goToPage(pageNum) {
            this.currentPage = pageNum;
            this.getMemberList();
        },
        goToDetail(id){
            window.location.href="/typing/member/member-management/"+id+"/detail"
        },
        momentfnc(date){
            return moment(date).utcOffset('+0900').format("YYYY-MM-DD");
        },
        updateFavor(){
            this.$refs.favor_zone.updateFavorZone();
        }
    },
    created() {
        this.getMemberList();
    }
}
</script>