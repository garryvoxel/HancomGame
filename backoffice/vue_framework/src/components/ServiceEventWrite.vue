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
                                            <div class="col-2 text-left">
                                                <div class="input-group">

                                                </div>
                                            </div>                                            
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>내용</th>
                                        <td>
                                            <div class="col-sm-12">
                                                <textarea
                                                    style="width:100%;"
                                                    id="content"
                                                ></textarea>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>배너이미지<br>Link</th>
                                        <td>
                                            <div class="col-sm-12 ">
                                                <div class="input-group">
                                                    <input
                                                        type="text"
                                                        class="form-control"
                                                        placeholder="이미지 URL"
                                                        v-model="imgUrl"
                                                        readonly
                                                    >
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>배너이미지</th>
                                        <td>
                                            <div class="col-sm-2 pull-left">
                                                <div class="input-group">
                                                    <div class="custom-file">
                                                        <input
                                                            type="file"
                                                            accept="image/gif, image/jpeg, image/png"
                                                            class="custom-file-input"
                                                            id="inputGroupFile01"
                                                            ref="bannerImg"
                                                            v-on:change="handleFileUpload()"
                                                            enctype="multipart/form-data"
                                                        >
                                                        <label
                                                            class="custom-fileform"
                                                            for="inputGroupFile01"
                                                        >이미지 선택</label>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="text-left">W500 * H280
                                                <br>최대 1MB / 확장자 JPG,PNG,GIF 만 가능
                                            </div>
                                            <div class="col-sm-12 pull-left text-left mt-2">
                                                <div v-if="!bannerImage" class="img-prev1 text-center"  style='width:500px;height:280px'>미리보기</div>
                                                <img v-if="bannerImage" :src="imgUrl" />
                                            </div>
                                        </td>
                                    </tr>                                    

                                    <tr>
                                        <th>모바일 배너이미지<br>Link</th>
                                        <td>
                                            <div class="col-sm-12 ">
                                                <div class="input-group">
                                                    <input
                                                        type="text"
                                                        class="form-control"
                                                        placeholder="이미지 URL"
                                                        v-model="imgUrlM"
                                                        readonly
                                                    >
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>모바일 배너이미지</th>
                                        <td>
                                            <div class="col-sm-2 pull-left">
                                                <div class="input-group">
                                                    <div class="custom-file">
                                                        <input
                                                            type="file"
                                                            accept="image/gif, image/jpeg, image/png"
                                                            class="custom-file-input"
                                                            id="inputGroupFile02"
                                                            ref="bannerImgM"
                                                            v-on:change="handleFileUploadM()"
                                                            enctype="multipart/form-data"
                                                        >
                                                        <label
                                                            class="custom-fileform"
                                                            for="inputGroupFile02"
                                                        >이미지 선택</label>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="text-left">W500 * H200
                                                <br>최대 1MB / 확장자 JPG,PNG,GIF 만 가능
                                            </div>
                                            <div class="col-sm-12 pull-left text-left mt-2">
                                                <div v-if="!bannerImageM" class="img-prev1 text-center" style='width:500px;height:200px'>미리보기</div>
                                                <img v-if="bannerImageM" :src="imgUrlM" />
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
                        <button v-on:click.prevent="writeEvent" class="btn btn-flat btn-success">등록</button>
                        <!-- button type="submit" class="btn btn-flat btn-primary">미리보기</button -->
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
import WebConfig from '../../config/web.config';

export default {
    name: "eventWrite",
    components: {
        "header-area": HeaderArea,
        "favor-zone": FavorZone,
        "page-title-area": PageTitleArea
    },
    data(){
        return {
            statusOptions: [
                {name:'진행중', value:'ongoing'},
                {name:'발표준비중', value:'onready'},
                {name:'당첨자발표', value:'winnersannounced'},
                {name:'비활성', value:'inactive'},          
                {name:'종료', value:'end'}                
            ],
            subject: '',
            content: '',
            startDate: '',
            endDate: '',
            bannerImage: '',
            imgUrl: '',
            bannerImageM: '',
            imgUrlM: '',
            status: 'ongoing',
            editor: [],
            isSaving: false
        }
    },
    methods: {
        goBack(){
            this.$router.go(-1);
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
        handleFileUpload(){
            this.bannerImage = this.$refs.bannerImg.files[0];
//            alert(this.bannerImage.type);
            if(this.bannerImage.type != 'image/jpeg' && this.bannerImage.type != 'image/gif' && this.bannerImage.type != 'image/png' ) return false;
            this.imgUrl = URL.createObjectURL(this.bannerImage);
        },
        handleFileUploadM(){
            this.bannerImageM = this.$refs.bannerImgM.files[0];
            this.imgUrlM = URL.createObjectURL(this.bannerImageM);
        },        
        writeEvent(){

            //editor content sync
            this.editor.getById["content"].exec("UPDATE_CONTENTS_FIELD", []);

            this.isSaving = true;
            var data = new FormData();
            data.set('subject', this.subject);
            data.set('content', document.getElementById("content").value);
            data.set('startDate', this.startDate);
            data.set('endDate', this.endDate);
            data.set('status', this.status);
            data.set('imgUrl', this.imgUrl);
            data.append('image',this.bannerImage);
            data.append('imageM',this.bannerImageM);
            
            if(this.subject == "") {alert('제목을 입력해 주세요'); return;}

            if (!document.getElementById("content").value || document.getElementById("content").value=="<p><br></p>") {
                alert("공지내용을 입력해 주세요");
                this.$refs.content.focus();
                return;
            }

            if (this.imgUrl == "") {alert("배너이미지를 입력해 주세요"); return;}
            if (this.imgUrlM == "") {alert("모바일 배너이미지를 입력해 주세요"); return;}

            if(confirm('이벤트를 등록 하시겠습니까?')) {
                this.$axios
                .post(
                    '/typing/api/service/event/write'
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
                                alert('이벤트가 등록되었습니다.');
                                window.location.href = '/typing/service/event/list';
                                break;

                            default:
                                alert('이벤트등록에 실패했습니다.\n다시 시도해 주세요.\n'
                                    +response.data.code+'::'+response.data.message);
                        } //switch

                    } //if else

                    this.isSaving = false;
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