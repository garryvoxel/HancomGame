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
                                <i class="ti-control-play"></i> 한컴타자 연습 문제관리
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
                            <col width="150">
                            <col width="*">
                        </colgroup>
                        <tbody>
                            <tr>
                                <th>검색조건</th>
                                <td>카테고리 선택</td>
                                <td class="text-left">
                                    <div class="form-row align-items-center">
                                        <div class="col-sm-2">
                                            <select class="form-control" v-model="fieldId" @change="getWordList()">
                                                <option value=0>전체</option>
                                                <option v-for="category in categoryList" :value="category.Idx">{{category.CategoryName}}</option>
                                                
                                            </select>
                                        </div>
                                        <div class="col-sm-4">
                                            <div class="input-group">
                                                <input
                                                    type="text"
                                                    class="form-control"
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
                                    @change="getWordList()"
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
                                            <span>Game구분
                                                <i class="ti-exchange-vertical"></i>
                                            </span>
                                        </th>
                                        <th>
                                            <span>카테고리
                                                <i class="ti-exchange-vertical"></i>
                                            </span>
                                        </th>
                                        <th>
                                            <span>파일이름
                                                <i class="ti-exchange-vertical"></i>
                                            </span>
                                        </th>
                                        <th>
                                            <span>파일내용
                                                <i class="ti-exchange-vertical"></i>
                                            </span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(word , index) in wordList">
                                        <td>
                                            <input type="checkbox" :id="word.Idx" :value="word.Idx" v-model="selectedWords">
                                        </td>
                                        <td>{{virtualNumber - index}}</td>
                                        <td>{{convGameCode(word.GameCode)}}</td>
                                        <td>{{word['TbCategory.CategoryName']}}</td>
                                        <td>{{word.FileName}}</td>
                                        <td>{{word.Words}}</td>
                                    </tr>
                                    <tr v-if="wordList.length === 0">
						                <td colspan="6" class="clan-empty">등록된 문제항목이 없습니다.</td>
						            </tr>
                                </tbody>
                            </table>
                        </div>
                        <div class="mt-1 text-left">
                            <button
                                class="btn btn-sm btn-flat btn-outline-danger pull-left" style="margin-right:5px"
                                v-on:click.prevent="doDeleteWord"
                            >선택항목 삭제</button>
                            <button
                                class="btn btn-sm btn-flat btn-outline-success pull-left" style="margin-right:5px"
                                data-toggle="modal"
                                data-target="#registerModalCenter"
                            >문제등록</button>  
                                            <div
                                                class="modal fade"
                                                id="registerModalCenter"
                                                aria-hidden="true"
                                                style="display: none;" 
                                                
                                            >
                                                <div
                                                    class="modal-dialog modal-dialog-centered" role="document">
                                                    <div class="modal-content" >
                                                        <div class="modal-header" >
                                                            <h5 class="modal-title">문제등록</h5>
                                                            <button
                                                                type="button"
                                                                class="close"
                                                                data-dismiss="modal"
                                                            >
                                                                <span>×</span>
                                                            </button>
                                                        </div>
                                                        <div class="modal-body" >
                                                            <table class="tbsty01">
                                                                <colgroup>
                                                                    <col width="150">
                                                                    <col width="*">
                                                                </colgroup>
                                                                <tr>
                                                                    <th>타입</th>
                                                                    <td> 
                                                                        <select class="custom-select custom-select-sm form-control form-control-sm pull-right"
                                                                        v-model="selectedWordType">
                                                                            <option v-for="sType in wordType" :value="sType.code">
                                                                                {{sType.value}}
                                                                            </option>
                                                                        </select>
                                                                    </td>
                                                                </tr>                                                                
                                                                <tr>
                                                                    <th>게임코드</th>
                                                                    <td> 
                                                                        <select class="custom-select custom-select-sm form-control form-control-sm pull-right"
                                                                        v-model="selectedGamecode">
                                                                            <option v-for="gcode in gameCode" :value="gcode.code">
                                                                                {{gcode.name}}
                                                                            </option>
                                                                        </select>
                                                                    </td>
                                                                </tr>                                                                
                                                                <tr>
                                                                    <th>카테고리</th>
                                                                    <td> 
                                                                        <select class="custom-select custom-select-sm form-control form-control-sm pull-right"
                                                                        v-model="selectedCategory">
                                                                            <option v-for="category in categoryList" :value="category.Idx">
                                                                                {{category.CategoryName}}
                                                                            </option>
                                                                        </select>
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <th>출처</th>
                                                                    <td> 
                                                                        <input type="text" class="form-control" v-model="regReference">
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <th>파일선택</th>
                                                                    <td> 
                                                                        <input
                                                                            type="file"
                                                                            id="inputGroupFile01"
                                                                            ref="wordFile"
                                                                            enctype="multipart/form-data"
                                                                            v-on:change="handleFileUpload()"
                                                                        >
                                                                        
                                                                    </td>
                                                                </tr>    
                                                                <tr>
                                                                    <td colspan="2" class="text-center"> 
                                                                        <button class="btn btn-success btn-flat"
                                                                        v-on:click="doWrite"
                                                                        >저장</button>
                                                                    </td>
                                                                </tr>                                                                                                                            
                                                            </table>
                                                            
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
                            <!--button
                                class="btn btn-sm btn-flat btn-outline-success pull-left"
                                data-toggle="modal"
                                data-target="#exampleModalCenter"
                            >카테고리 관리</button--> 
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
                                                            <h5 class="modal-title">카테고리 추가삭제</h5>
                                                            <button
                                                                type="button"
                                                                class="close"
                                                                data-dismiss="modal"
                                                            >
                                                                <span>×</span>
                                                            </button>
                                                        </div>
                                                        <div class="modal-body">
                                                            <table class="tbsty01 text-center">
                                                                <colgroup>
                                                                    <col width="300">
                                                                    <col width="*">
                                                                </colgroup>
                                                                <tr>
                                                                    <th>카테고리명</th>
                                                                    <th>관리</th>
                                                                </tr>
                                                                <tr v-for="category,index in categoryList">
                                                                    <td><input type='text' class="form-control" :value="category.CategoryName" ref="dCategory" ></td>
                                                                    <td>
                                                                        <button v-if="index < categoryItemCount" class="btn btn-danger btn-flat"
                                                                            v-on:click="doDelCategory(index, category.Idx)"
                                                                            >삭제</button>
                                                                        <button v-if="index >= categoryItemCount" class="btn btn-success btn-flat"
                                                                            v-on:click="doAddCategory(index)"
                                                                            >등록</button>
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td colspan="2">
                                                                        <button class="btn btn-warning btn-flat"
                                                                        v-on:click="addCategoryItem"
                                                                        >
                                                                            + 카테고리 항목 추가
                                                                        </button>
                                                                    </td>
                                                                </tr>
                                                            </table>
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
    name: "hancomtaja-bank",
    components: {
        "header-area": HeaderArea,
        "favor-zone": FavorZone,
        "page-title-area": PageTitleArea
    },
    data(){
        return {
            wordList: [],
            listScale: [
                { count: 10 },
                { count: 25 },
                { count: 50 },
                { count: 100 }
            ],
            gameCode:[
                {code: '10003', name: '한컴타자연습'},
            ],            
            gameCodeOld:[
                {code: '10000', name: '동전쌓기'},
                {code: '10001', name: '판뒤집기'},
                {code: '10002', name: '두더지잡기'},
                {code: '10003', name: '한컴타자연습'},
            ],                        
            selectedGamecode: '10003',
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
            selectedWords: [],
            toggleAll: 0,
            categoryList: [
                {CategoryName:'영어', Idx: 1}
                ,{CategoryName:'한글', Idx: 2}
            ],
            selectedCategory: '',
            categoryItemCount: 0,
            regReference: '',
            wordFile: '',
            wordType:[
                {code:1, value: '짧은글'},
                {code:2, value: '긴글'},
                {code:3, value: '긴글 개념원리'},
                {code:4, value: '긴글 반크'}
            ],
            selectedWordType : 1
        }
    },    
    methods: {
        goToBack(){
            this.$router.go(-1);
        },
        handleFileUpload(){
            this.wordFile = this.$refs.wordFile.files[0];
        },
        getWordList(){
            let url =
                "/typing/api/content/typing/list?" +
                (this.count ? "count=" + this.count : "") +
                (this.currentPage ? "&page=" + this.currentPage : "") +
                (this.fieldId ? "&fieldId=" + this.fieldId : "") +
                (this.keyword ? "&keyword=" + this.keyword : "");

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

                                this.wordList =     response.data.result.rows;
                                this.totalCount =       response.data.result.pagination.totalItemCount;
                                this.virtualNumber =    response.data.result.pagination.virutalNumberStart;
                                this.count =            response.data.result.pagination.itemsPerPage;
                                this.currentPage =      response.data.result.pagination.currentPage;
                                this.totalPageCount =   response.data.result.pagination.totalPageCount;
                                break;

                            default:
                                alert(
                                    "목록을 가져오는데 실패 했습니다.\n다시 시도해 주세요.\n"
                                    +response.data.code+ "::" +response.data.message
                                );
                        } //switch

                    } //if else   
                })
                .catch(error=>{alert('Catch case: '+error.message);});
        },
        getCategoryList() {
            this.$axios
                .get('/typing/api/content/typing/categorylist')
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
                                this.categoryList =           response.data.result;
                                this.categoryItemCount = response.data.result.length;
                                break;

                            default:
                                alert(
                                    "카테고리 목록을 가져오는데 실패 했습니다.\n다시 시도해 주세요.\n"
                                    +response.data.code+ "::" +response.data.message
                                );
                        } //switch

                    } //if else                     
                })
        },
        dateFormat(datetime) {
            return moment(datetime).utcOffset('+0900').format("YYYY-MM-DD");
        },  
        dateTimeFormat(datetime) {
            return moment(datetime).utcOffset('+0900').format("YYYY-MM-DD HH:mm:ss");
        },                
        search(){
            this.currentPage=1;
            this.getWordList();
        },
        searchCancel(){
            this.keyword='';
            this.fieldId=0;
            this.currentPage=1;
            this.getWordList();
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
            this.getWordList();
        },
        doClear(){
            this.selectedWords = [];
        },
        doSelectAll(){
            for (var i in this.wordList){
                this.selectedWords.push(this.wordList[i].Idx);
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
        doDeleteWord(){
            if(this.selectedWords.length <= 0 ) {alert('삭제하려는 항목을 선택해 주세요.'); return;}
            if(confirm('선택한 문제 항목을 삭제 하시겠습니까?\n해당 카테고리의 글이 모두 삭제됩니다.')) {
                //alert( this.selectedWords );
                this.$axios
                    .post('/typing/api/content/typing/delete',{
                        selectedWords: this.selectedWords
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
                                alert('문제항목이 삭제 되었습니다.');
                                this.selectedLogs=[];
                                this.getWordList();
                                break;

                            default:
                                alert(
                                    "문제항목 삭제에 실패 했습니다.\n다시 시도해 주세요.\n"
                                    +response.data.code+ "::" +response.data.message
                                );
                        } //switch

                    } //if else   
                    })
                    .catch(error=>{alert('Catch case: '+error.message);});

            }
            
        },
        addCategoryItem(){
                //alert(this.categoryItemCount);
                //this.categoryList.unshift('');
                this.categoryList.push('');
        },
        doAddCategory(index){
            //alert(this.$refs.dCategory[index].value);
            if(confirm("'"+this.$refs.dCategory[index].value+"' 을(를) 카테고리로 등록 하시겠습니까?")) {
                this.$axios
                    .post('/typing/api/content/typing/addcategory',{
                        categoryName: this.$refs.dCategory[index].value
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
                                    alert('카테고리로 등록되었습니다.');
                                    this.getCategoryList();
                                    break;

                                default:
                                    alert(
                                        "카테고리 등록에 실패 했습니다.\n다시 시도해 주세요.\n"
                                        +response.data.code+ "::" +response.data.message
                                    );
                            } //switch

                        } //if else                           
                    })
            }
        },
        doDelCategory(index,categoryIdx){
            //alert(this.$refs.dCategory[index].value);
            if(confirm(this.$refs.dCategory[index].value+' 을(를) 삭제 하시겠습니까?\n')) {
                this.$axios
                    .post('/typing/api/content/typing/delcategory',{
                        categoryIdx: categoryIdx
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
                                    alert('카테고리가 삭제되었습니다.');
                                    this.getCategoryList();
                                    break;

                                default:
                                    alert(
                                        "카테고리 삭제에 실패 했습니다.\n다시 시도해 주세요.\n"
                                        +response.data.code+ "::" +response.data.message
                                    );
                            } //switch

                        } //if else                           
                    })
            }
        },
        doWrite(){

            //alert(this.wordFile);
            if(typeof this.wordFile == 'undefined' || this.wordFile == '' ) { alert('파일을 첨부해 주세요'); return;}
             if(this.selectedCategory == '') { alert('카테고리를 선택해 주세요'); return;}

            if(confirm('선택한 파일을 등록하시겠습니까?')) {

                var data = new FormData();
                data.set('CategoryIdx', this.selectedCategory)
                data.set('Reference', this.regReference)
                data.set('GameCode', this.selectedGamecode)
                data.set('Type', this.selectedWordType)
                data.append('WordFile',this.wordFile);

                this.$axios
                    .post('/typing/api/content/typing/write'
                        ,data
                        ,{
                            headers: {
                                'content-type': 'multipart/form-data'
                            }
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
                                
                                case ResponseCode.NO_UTF8.code:
                                alert('업로드 하신 파일이 \'UTF-8\' 로 인코딩 되어 있지 않습니다.\n문서편집기에서 내용 작성후 저장하실때\n\'UTF-8\' 로 인코딩 설정해 저장하신후 다시 올려주시기 바랍니다. ');
                                break;

                                case ResponseCode.OK.code:
                                    //alert(JSON.stringify(response.data.result));
                                    alert('파일이 등록되었습니다.');
                                    this.getWordList();
                                    this.selectedWordType = 1;
                                    this.selectedGamecode = '10003';
                                    this.selectedCategory = 1;
                                    this.regReference = ''
                                    this.wordFile = ''

                                    let input = this.$refs.wordFile
                                        input.type = 'text'
                                        input.type = 'file'
                                    $('#registerModalCenter').modal('hide');
                                    break;

                                default:
                                    alert(
                                        "파일등록에 실패 했습니다.\n다시 시도해 주세요.\n"
                                        +response.data.code+ "::" +response.data.message
                                    );
                            } //switch

                        } //if else 
                    })
            }
        },
        convGameCode(gamecode){
            for(let idx in this.gameCode){
                if(this.gameCode[idx].code == gamecode) return this.gameCode[idx].name;
            }
        }
    },
    created(){
        this.getWordList();
        //this.getCategoryList();
    }
}
</script>