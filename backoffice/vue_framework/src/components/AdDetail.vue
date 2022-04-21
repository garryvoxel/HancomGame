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
                                <i class="ti-control-play"></i> 신규광고등록
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
                                <th>광고명</th>
                                <td>
                                    <div class="col-sm-4">
                                        <div class="input-group">
                                            <input
                                                type="text"
                                                class="form-control"
                                                placeholder="광고명"
                                                v-model="adName"
                                            >
                                        </div>
                                    </div>
                                </td>
                            </tr>                            
                            <tr>
                                <th>광고타입</th>
                                <td>
                                    <div class="col-sm-4">
                                        <div class="input-group">
                                            <select name id class="form-control"  @change="eventTypeDataSetting" v-model="selectedType">
                                                <option v-for="type in adTypes" :value="type.typeType">{{type.typeName}}</option>
                                            </select>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <th>기간</th>
                                <td>
                                    <div class="col-5 text-left">
                                        <div class="input-group">
                                            <input
                                                type="date"
                                                class="form-control"
                                                v-model="startDate"
                                            >
                                            <span >~</span>
                                            <input
                                                type="date"
                                                class="form-control"
                                                    v-model="endDate"
                                            >                                                    
                                        </div>
                                    </div>
                                    <div class="col-2 text-left">
                                        <div class="input-group">

                                        </div>
                                    </div>                                            
                                </td>
                            </tr>                            
                            <tr>
                                <th>배너이미지</th>
                                <td>
                                    <div class="col-sm-4 pull-left">
                                        <div class="input-group">
                                            <input
                                                type="text"
                                                class="form-control"
                                                placeholder="http://"
                                                v-model="bannerImage"
                                            >

                                            <!--div class="custom-file">
                                                <input
                                                    type="file"
                                                    class="custom-file-input"
                                                    id="inputGroupFile01"
                                                >
                                                <label
                                                    class="custom-fileform"
                                                    for="inputGroupFile01"
                                                >이미지 선택</label>
                                                
                                            </div-->
                                        </div>
                                    </div>
                                    <div class="text-left">{{sizeComment}}
                                    </div>
                                    <div class="col-sm-12 pull-left text-left mt-2">
                                        <img  v-if="bannerImage" :src="bannerImage">
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <th>이동링크</th>
                                <td>
                                    <div class="col-sm-4">
                                        <div class="input-group">
                                            <input
                                                type="text"
                                                class="form-control"
                                                placeholder="http://"
                                                v-model="linkURL"
                                            >
                                        </div>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <th>상태설정</th>
                                <td>
                                    <div class="col-sm-4">
                                        <div class="input-group">
                                            <select class="form-control" v-model="isActive">
                                                <option v-for="option in isActiveOptions" :value="option.value">{{ option.title }}</option>
                                            </select>
                                        </div>
                                    </div>
                                </td>
                            </tr>                            
                        </tbody>
                    </table>
                </div>
                <div class="col-12 text-center mt-3">
                    <button v-on:click="goToBack" class="btn btn-flat btn-dark">취소</button>
                    <button v-on:click.prevent="doEditAd" class="btn btn-flat btn-success">수정</button>
                    <button v-on:click.prevent="doDeleteAd" class="btn btn-flat btn-danger">삭제</button>
                    <!-- button type="submit" class="btn btn-flat btn-primary">미리보기</button-->
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
    name: "AdList",
    components: {
        "header-area": HeaderArea,
        "favor-zone": FavorZone,
        "page-title-area": PageTitleArea
    },
    data(){
        return {
            isActiveOptions:[
                {title:'공개', value: 1}
                , {title:'정지', value: 0}
            ],
            adTypes:[
                {typeName: '웹 메인 하단1', typeType: 'main-bottom1', platform:'web', imgSize:'W1290 * H200'}
                , {typeName:  '웹 메인 하단2', typeType: 'main-bottom2', platform:'web', imgSize:'W1290 * H200'}
                , {typeName:  '웹 메인 왼쪽', typeType: 'main-left', platform:'web', imgSize:'W150 * H500'}
                , {typeName:  '웹 메인 오른쪽', typeType: 'main-right', platform:'web', imgSize:'W150 * H500'}
            ]
            , adName: ''
            , selectedType:'' || 'main-bottom1'
            , sizeComment:'' || 'W1290 * H200'
            , platform:'' || 'web'
            , bannerImage: ''
            , linkURL: ''
            , startDate: ''
            , endDate: ''         
            , isActive: 0  
        }
    },
    methods: {
        goToBack(){
            this.$router.go(-1);
        },
        eventTypeDataSetting(){
            //alert(JSON.stringify(this.adTypes));
            for(var i in this.adTypes) {
                if(this.adTypes[i].typeType === this.selectedType) { 
                    this.platform = this.adTypes[i].platform  ;
                    this.sizeComment = this.adTypes[i].imgSize;
                    }
            }
        },
        defaultDateSet() {
            this.startDate =  this.getToday();
            this.endDate = this.getToday();
        },
        getToday(){
            var now = new Date();
            var month = (now.getMonth() + 1);               
            var day = now.getDate();
            if (month < 10) 
                month = "0" + month;
            if (day < 10) 
                day = "0" + day;
            var today = now.getFullYear() + '-' + month + '-' + day;
            return today;
        },
        doEditAd(){
            if(confirm('이벤트 정보를 수정하시겠습니까?')) {
                this.$axios
                .post('/typing/api/ad/update',{
                    platform: this.platform
                    , id: this.id
                    , name: this.adName
                    , type: this.selectedType
                    , is_active: this.isActive
                    , image_url: this.bannerImage
                    , target_uri: this.linkURL
                    , start_at: this.startDate
                    , end_at: this.endDate
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
                                alert('광고가 수정되었습니다.')
                                window.location.href = "/typing/ad/ad-management/list";
                                break;

                            default:
                                alert(
                                    "광고수정에 실패 했습니다.\n다시 시도해 주세요.\n"
			                        +response.data.code+ "::" +response.data.message
                                );
                        } //switch

                    } //if else                    
                })
                .catch(error=>{alert('Catch case: '+error.message);});
            }
            
        },
        getAdInfo(){
            this.$axios
                .get('/typing/api/ad/'+this.id+'/info')
                .then( response => {
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
                                this.adName = response.data.eventInfo.name;
                                this.selectedType = response.data.eventInfo.type;
                                this.eventTypeDataSetting();
                                this.isActive = response.data.eventInfo.is_active;
                                this.bannerImage = response.data.eventInfo.image_url;
                                this.linkURL = response.data.eventInfo.target_uri;
                                this.startDate = this.dateFormat(response.data.eventInfo.start_at);
                                this.endDate = this.dateFormat(response.data.eventInfo.end_at);
                                break;

                            default:
                                alert(
                                    "광고 정보를 가져오는데 실패 했습니다.\n다시 시도해 주세요.\n"
                                    +response.data.code+ "::" +response.data.message
                                );
                        } //switch

                    } //if else                    
                })
                .catch(error=>{alert('Catch case: '+error.message);});

        },
        dateFormat(datetime) {
            return moment(datetime).utcOffset('+0900').format("YYYY-MM-DD");
        },
        doDeleteAd(){
            if(confirm('해당 광고를 삭제 하시겠습니까?')){
                this.$axios
                    .post('/typing/api/ad/delete',{
                        id: this.id
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
                                alert('해당 광고정보가 삭제되었습니다.')
                                window.location.href = "/typing/ad/ad-management/list";
                                break;

                            default:
                                alert(
                                    "광고정보 삭제에 실패 했습니다.\n다시 시도해 주세요.\n"
                                    +response.data.code+ "::" +response.data.message
                                );
                        } //switch

                    } //if else                           
                    })
                    .catch(error=>{alert('Catch case: '+error.message);});

            }
        },
        updateFavor(){
            this.$refs.favor_zone.updateFavorZone();
        }
    },
    computed:{
        id(){
            return this.$route.params.id;
        }
    },
    created() {
        this.getAdInfo();
    }
};
</script>