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
                                <i class="ti-control-play"></i> 이벤트등록
                            </h4>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row">
                <!-- data table start -->
                <div class="col-12">
                    <div class="data-tables">
                        <div class="tablewrap2">
                            <table class="tbsty02 text-center">
                                <colgroup>
                                    <col width="150">
                                    <col width="*">
                                </colgroup>
                                <tbody>
                                    <tr>
                                        <th>제목</th>
                                        <td>
                                            <div class="col-sm-12">
                                                <div class="input-group">
                                                    <input
                                                        type="text"
                                                        class="form-control"
                                                        id
                                                        placeholder="제목"
                                                        v-model="subject"
                                                    >
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
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>내용</th>
                                        <td>
                                            <div class="col-sm-12">
                                                <textarea
                                                    name="name"
                                                    id="content"
                                                    style="width:100%;"
                                                >{{ content }}</textarea>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>배너이미지</th>
                                        <td>
                                            <div class="col-sm-12">
                                                <input
                                                        type="text"
                                                        class="form-control"
                                                        id
                                                        placeholder="이미지 URL"
                                                        v-model="imgUrl"
                                                        readonly
                                                    >
                                            </div>
                                            <div class="col-sm-2 pull-left">
                                                <div class="input-group" style="margin-top:10px">
                                                    <div class="custom-file">
                                                        <input
                                                            type="file"
                                                            class="custom-file-input"
                                                            id="inputGroupFile01"
                                                            ref="bannerImg"
                                                            v-on:change="handleFileUpload()"
                                                            enctype="multipart/form-data"
                                                        >
                                                        <label
                                                            class="custom-fileform"
                                                            for="inputGroupFile01"
                                                        >이미지 변경</label>
                                                    </div>
                                                </div>
                                            </div>                                            
                                            <div class="col-sm-12 pull-left text-left mt-2">
                                                <!-- div class="img-prev1 text-center">미리보기</div-->
                                                <img :src="imgUrl" /> 
                                                <button v-on:click.prevent="setPCBanner" v-if="bannerImage" class="btn btn-flat btn-success">변경한 이미지로 수정</button>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>모바일 배너이미지</th>
                                        <td>
                                            <div class="col-sm-12">
                                                <input
                                                        type="text"
                                                        class="form-control"
                                                        id
                                                        placeholder="이미지 URL"
                                                        v-model="imgUrlM"
                                                        readonly
                                                    >
                                            </div>
                                            <div class="col-sm-2 pull-left">
                                                <div class="input-group" style="margin-top:10px">
                                                    <div class="custom-file">
                                                        <input
                                                            type="file"
                                                            class="custom-file-input"
                                                            id="inputGroupFile02"
                                                            ref="bannerImgM"
                                                            v-on:change="handleFileUploadM()"
                                                            enctype="multipart/form-data"
                                                        >
                                                        <label
                                                            class="custom-fileform"
                                                            for="inputGroupFile02"
                                                        >이미지 변경</label>
                                                    </div>
                                                </div>
                                            </div>                                            
                                            <div class="col-sm-12 pull-left text-left mt-2">
                                                <!-- div class="img-prev1 text-center">미리보기</div-->
                                                <img :src="imgUrlM" />
                                                <button v-on:click.prevent="setMobileBanner" v-if="bannerImageM" class="btn btn-flat btn-success">변경한 이미지로 수정</button>
                                            </div>
                                        </td>
                                    </tr>                                    
                                    <tr>
                                        <th>등록일시</th>
                                        <td>
                                            <div class="col-sm-4">
                                                <div class="input-group">
                                                    <!--input
                                                        type="datetime-local"
                                                        class="form-control"
                                                        v-model=""
                                                    -->
                                                    {{ created_at }}
                                                </div>
                                            </div>
                                        </td>
                                    </tr>

                                    <tr>
                                        <th>상태설정</th>
                                        <td>
                                            <div class="col-sm-4">
                                                <div class="input-group">
                                                    <select class="form-control" v-model="status">
                                                        <option v-for="option in statusOptions" :value="option.value">{{ option.name }}</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div class="col-12 text-center mt-5">
                        <button v-on:click.prevent="goBack" class="btn btn-flat btn-secondary">취소</button>
                        <button v-on:click.prevent="setEventInfo" class="btn btn-flat btn-success">수정</button>
                        <button v-on:click.prevent="delEventInfo" class="btn btn-flat btn-danger">삭제</button>
                        <!--button type="submit" class="btn btn-flat btn-primary">미리보기</button-->
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

import { stringify } from 'querystring';

export default {
    name: "eventWrite",
    components: {
        "header-area": HeaderArea,
        "favor-zone": FavorZone,
        "page-title-area": PageTitleArea
    },
    data() {
        return {
            statusOptions: [
                {name:'진행중', value:'ongoing'},
                {name:'발표준비중', value:'onready'},
                {name:'당첨자발표', value:'winnersannounced'},
                {name:'비활성', value:'inactive'},          
                {name:'종료', value:'end'}                
            ],         
            subject: ''
            , content: ''
            , startDate: ''
            , endDate: ''
            , created_at: ''
            , status: ''
            , bannerImage: ''
            , imgUrl: ''
            , bannerImageM: ''
            , imgUrlM: ''
            , oldImgUri: ''
            , oldImgUriM: ''
            , editor: []
            , isSaving: false            
        }
    },
    methods: {
        goBack(){
            //this.$router.go(-1);
            window.location.href='/typing/service/event/list';
        },
        getEventInfo(){
            this.$axios
                .get('/typing/api/service/event/'+this.id+'/info')
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
                                alert('비밀번호 유효기간(180일)이 지났습니다.\n비밀번호를 변경해 주세요.');
                                window.location.href = "/typing/managers/pwmodifyforce";
                                return;
                                break;

                            case ResponseCode.OK.code:
                                let eventInfo = response.data.eventInfo;
                                //alert(JSON.stringify(eventInfo));
                                let datefn = new Date();

                                this.subject = eventInfo.subject;
                                this.content = eventInfo.content;
                                this.startDate = this.dateFormat(eventInfo.start_at);
                                this.endDate = this.dateFormat(eventInfo.end_at);
                                this.created_at = moment(eventInfo.created_at).utcOffset('+0900').format("YYYY-MM-DD hh:mm:ss");
                                this.status = eventInfo.status;
                                this.oldImgUri = eventInfo.image_uri;
                                this.imgUrl = eventInfo.image_uri;
                                this.oldImgUriM = eventInfo.mobile_image_uri;
                                this.imgUrlM = eventInfo.mobile_image_uri;

                                break;

                            default:
                                alert(
                                    "이벤트 정보를 가져오느데 실패 했습니다.\n다시 시도해 주세요."
                                );
                        } //switch

                    } //else
                })
                .catch(error=>{alert('Catch case: '+error.message);});

        },    
        delEventInfo(){
            if(confirm('해당 이벤트를 삭제 하시겠습니까?')){
                this.$axios
                    .post('/typing/api/service/event/delete',{id: this.id})
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
                                    alert('해당 이벤트가 삭제되었습니다.');
                                    window.location.href = "/typing/service/event/list";
                                    break;

                                default:
                                    alert(
                                        "해당 이벤트 삭제에 실패 했습니다.\n다시 시도해 주세요."
                                    );
                            } //switch

                        } //if else
                    })
                    .catch(error=>{alert('Catch case: '+error.message);});
            }
        },    
        dateFormat(datetime) {
            return moment(datetime).utcOffset('+0900').format("YYYY-MM-DD");
        },
        handleFileUpload(){
            this.bannerImage = this.$refs.bannerImg.files[0];
            this.imgUrl = URL.createObjectURL(this.bannerImage);
        },
        handleFileUploadM(){
            this.bannerImageM = this.$refs.bannerImgM.files[0];
            this.imgUrlM = URL.createObjectURL(this.bannerImageM);
        },        
        setEventInfo(){
            
            //editor content sync
            this.editor.getById["content"].exec("UPDATE_CONTENTS_FIELD", []);

            var data = new FormData();
            data.set('id', this.id);
            data.set('subject', this.subject);
            data.set('content', document.getElementById("content").value);
            data.set('startDate', this.startDate);
            data.set('endDate', this.endDate);
            data.set('status', this.status);
            // data.append('image',this.bannerImage);
            // data.append('imageM',this.bannerImageM);            


            if(confirm('이벤트 내용을 수정하시겠습니까?')) {
                this.$axios
                .post(
                    '/typing/api/service/event/update'
                    ,data
                    ,{
                        headers: {
                            'content-type': 'multipart/form-data'
                        }
                    }
                )
                .then(response =>{
                    //alert(JSON.stringify(response.data));

                    if (typeof response == "undefined") {
                        alert(
                            "서버와 통신이 원활하지 않습니다.\n잠시후 다시 시도해 주세요."
                        );
                        return;
                    } else {
                        //alert(response.data.code);

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
                                alert('이벤트 정보가 수정되었습니다.');
                                window.location.href = "/typing/service/event/list";
                                break;

                            default:
                                alert(
                                    "이벤트 정보 수정에 실패했습니다.\n다시 시도해 주세요."
                                );
                        } //switch

                    } //if else
                });
            }
            
        },
        setPCBanner(){
            var data = new FormData();
            data.set('id', this.id);
            data.set('olduri', this.oldImgUri);
            data.append('image',this.bannerImage);
            //data.append('imageM',this.bannerImageM);            


            if(confirm('PC용 배너이미지를 수정하시겠습니까?')) {
                this.$axios
                .post(
                    '/typing/api/service/event/updatePCBanner'
                    ,data
                    ,{
                        headers: {
                            'content-type': 'multipart/form-data'
                        }
                    }
                )
                .then(response =>{
                    //alert(JSON.stringify(response.data));

                    if (typeof response == "undefined") {
                        alert(
                            "서버와 통신이 원활하지 않습니다.\n잠시후 다시 시도해 주세요."
                        );
                        return;
                    } else {
                        //alert(response.data.code);

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
                                alert('PC용 배너이미지가 수정되었습니다.');
                                this.bannerImage='';
                                this.getEventInfo();
                                break;

                            default:
                                alert(
                                    "이벤트 정보 수정에 실패했습니다.\n다시 시도해 주세요."
                                );
                        } //switch

                    } //if else
                });
            }
            
        },
        setMobileBanner(){
            var data = new FormData();
            data.set('id', this.id);
            data.set('olduri', this.oldImgUriM);
            //data.append('image',this.bannerImage);
            data.append('imageM',this.bannerImageM);            


            if(confirm('모바일용 배너이미지를 수정하시겠습니까?')) {
                this.$axios
                .post(
                    '/typing/api/service/event/updateMobileBanner'
                    ,data
                    ,{
                        headers: {
                            'content-type': 'multipart/form-data'
                        }
                    }
                )
                .then(response =>{
                    //alert(JSON.stringify(response.data));

                    if (typeof response == "undefined") {
                        alert(
                            "서버와 통신이 원활하지 않습니다.\n잠시후 다시 시도해 주세요."
                        );
                        return;
                    } else {
                        //alert(response.data.code);

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
                                alert('모바일용 배너이미지가 수정되었습니다.');
                                this.bannerImageM='';
                                this.getEventInfo();
                                break;

                            default:
                                alert(
                                    "이벤트 정보 수정에 실패했습니다.\n다시 시도해 주세요."
                                );
                        } //switch

                    } //if else
                });
            }
            
        },        
        updateFavor(){
            this.$refs.favor_zone.updateFavorZone();
        }
    },
    computed: {
        id(){
            return this.$route.params.id
        }
    },
    created(){
        this.getEventInfo();
    },
    mounted() {
        this.$nextTick(() => {
            const self = this;

            nhn.husky.EZCreator.createInIFrame({
                oAppRef: self.editor,
                elPlaceHolder: "content",
                sSkinURI:
                    "/typing/static/vendors/smarteditor2/SmartEditor2SkinHancom.html",
                htParams: {
                    bUseToolbar: true, // 툴바 사용 여부 (true:사용/ false:사용하지 않음)
                    bUseVerticalResizer: false, // 입력창 크기 조절바 사용 여부 (true:사용/ false:사용하지 않음)
                    bUseModeChanger: true, // 모드 탭(Editor | HTML | TEXT) 사용 여부 (true:사용/ false:사용하지 않음)
                    //bSkipXssFilter : true,		// client-side xss filter 무시 여부 (true:사용하지 않음 / 그외:사용)
                    //aAdditionalFontList : aAdditionalFontSet,		// 추가 글꼴 목록
                    fOnBeforeUnload: function() {
                        //alert("완료!");
                    },
                    I18N_LOCALE: "ko_KR"
                }, //boolean
                fOnAppLoad: function() {
                    //예제 코드
                    //oEditors.getById["ir1"].exec("PASTE_HTML", ["로딩이 완료된 후에 본문에 삽입되는 text입니다."]);
                    self.editor.getById.content.setDefaultFont("나눔고딕", 14);
                },
                fCreator: "createSEditor2"
            });
        });
    }   
}
</script>
