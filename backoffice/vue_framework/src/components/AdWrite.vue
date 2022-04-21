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
                    <button v-on:click.prevent="doWriteAd" class="btn btn-flat btn-success">등록</button>
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
        doWriteAd(){
            if(this.adName == "") {alert('광고명을 입력해 주세요'); return;}
            if(this.bannerImage == "") {alert('배너이미지를 입력해 주세요'); return;}
            if(this.linkURL == "") {alert('이동링크를 입력해 주세요'); return;}

            if(confirm('작성하신 내용으로 광고를 등록 하시겠습니까?')) {
                this.$axios
                .post('/typing/api/ad/write',{
                    name: this.adName
                    , platform: this.platform
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
                                
                            case ResponseCode.OK.code:
                                alert('신규 광고가 등록되었습니다.')
                                window.location.href = "/typing/ad/ad-management/list";
                                break;

                            default:
                                alert(
                                    "신규 광고등록에 실패 했습니다.\n다시 시도해 주세요.\n"
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
    created() {
        this.defaultDateSet();
    }
};
</script>