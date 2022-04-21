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
                                <i class="ti-control-play"></i> 공지사항
                            </h4>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row">
                <!-- data table start -->
                <div class="col-12">
                    <form id="es-manager-register-form" action="/api/manager/store" method="POST">
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
                                                            placeholder="제목"
                                                            ref="subject"
                                                            v-model="subject"
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
                                                            style="width:100%;"
                                                            rows="15"
                                                            id="content"
                                                        >{{ content }}</textarea>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>이미지 첨부</th>
                                            <td>
                                                <div class="col-1">
                                                    <button type="button" class="btn btn-success align-left" data-toggle="modal" data-target="#exampleModal">이미지 업로드</button>
                                                </div>
                                                <div class="col-12 text-left mt-3">
                                                    첨부파일 목록 (에디터 원하는 위치에 드래그&amp;드롭)
                                                </div>
                                                <div class="col-12 text-left mt-1" v-for="imageUrl in imageList" >
                                                    <img  :src="imageUrl.image_url" style="cursor:pointer"> <button type="button" class="btn btn-gray" v-on:click="delImage(imageUrl.id)">X 이미지 삭제</button>
                                                </div>
                                            </td>
                                        </tr>                                        
                                        <tr>
                                            <th>등록일시</th>
                                            <td>
                                                <div class="col-sm-4">
                                                    <div class="input-group">
                                                        {{ created_at }}
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>수정일시</th>
                                            <td>
                                                <div class="col-sm-4">
                                                    <div class="input-group">
                                                        {{ updated_at }}
                                                        {{   }}
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>

                                        <tr>
                                            <th>상태설정</th>
                                            <td>
                                                <div class="col-sm-4">
                                                    <div class="input-group">
                                                        <select
                                                            class="form-control"
                                                            v-model="is_private"
                                                        >
                                                            <option
                                                                v-for="option in status_options"
                                                                :value="option.value"
                                                            >{{option.title}}</option>
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
                            <button
                                v-on:click.prevent="goToBack"
                                class="btn btn-flat btn-secondary"
                            >취소</button>
                            <button
                                v-on:click.prevent="updateNewsInfo"
                                class="btn btn-flat btn-success"
                            >수정</button>
                            <button
                                v-on:click.prevent="deleteNews"
                                class="btn btn-flat btn-danger"
                            >삭제</button>
                        </div>
                    </form>
                </div>
                <!-- data table end -->
            </div>
        </div>

            <div class="modal  fade" tabindex="-1" role="dialog" id="exampleModal">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">이미지 업로드</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="col-12">
                        <input
                            type="file"
                            accept="image/gif, image/jpeg, image/png"
                            id="inputGroupFile02"
                            ref="attachImage"
                            v-on:change="handleImageUpload()"
                            enctype="multipart/form-data"
                        >
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-primary" v-on:click="doUploadImage()">이미지업로드</button>
                </div>
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
    name: "newsForm",
    components: {
        "header-area": HeaderArea,
        "favor-zone": FavorZone,
        "page-title-area": PageTitleArea
    },
    data() {
        return {
            status_options: [
                { title: "공개", value: 0 },
                { title: "비공개", value: 1 }
            ],
            subject: "",
            content: "",
            created_at: "",
            updated_at: "",
            is_private: 0,
            editor: [],
            isSaving: false,
            attachImage: '',
            imgUrl: '',            
            tempId: '',
            imageList: []
        };
    },
    methods: {
        goToBack() {
            this.$router.go(-1);
        },
        doNothing() {
            //do nothing
        },
        handleImageUpload(){
            this.attachImage = this.$refs.attachImage.files[0];
            this.imgUrl = URL.createObjectURL(this.attachImage);
        },         
        getNewsInfo(){
            //alert(this.id);
            this.$axios
                .get('/typing/api/service/news/'+this.id+'/info')
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
                                //alert('____')
                                let newsInfo = response.data.result;
                                this.subject = newsInfo.subject;
                                this.content = newsInfo.content;
                                this.is_private = newsInfo.is_private;
                                this.tempId = newsInfo.temp_article_id;
                                this.created_at = moment(newsInfo.created_at).utcOffset('+0900').format("YYYY-MM-DD hh:mm:ss");
                                this.updated_at = moment(newsInfo.updated_at).utcOffset('+0900').format("YYYY-MM-DD hh:mm:ss");
                                this.renewImageList();
                                break;

                            default:
                                alert(
                                    "공지사항 정보를 가져오는데 실패 했습니다.\n다시 시도해 주세요.\n"+response.data.code
                                );
                        }

                    }                    
                })
                .catch(error=>{
                  alert('Catch case: '+error.message);
                });
        }, 
        doUploadImage(){
            if (this.imgUrl == "") {alert("업로드 하려는 이미지를 선택해 주세요."); return;}

            var data = new FormData();
            data.set('tempId', this.tempId);
            data.append('image',this.attachImage);

            if(confirm('이미지를 업로드 하시겠습니까?')) { 
                this.$axios
                .post(
                    '/typing/api/service/news/imageupload'
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
                                //alert('이미지가 등록되었습니다.');
                                //이미지 리스팅
                                //alert(response.data.imageUrl);
                                $('#exampleModal').modal('hide');
                                this.renewImageList();
                                break;

                            default:
                                alert('이미지 업로드에 실패했습니다.\n다시 시도해 주세요.\n'
                                    +response.data.code+'::'+response.data.message);
                        } //switch

                    } //if else

                    this.isSaving = false;
                })
                .catch(error=>{alert('Catch case: '+error.message);});
            }

            this.$refs.attachImage.type = 'text';
            this.$refs.attachImage.type = 'file';
        },
        renewImageList(){

            this.$axios
                .get(
                    '/typing/api/service/news/getimagelist?tempId='+this.tempId
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
                                //alert(response.data.result.rows);
                                this.imageList = response.data.result.rows;
                                break;

                            default:
                                alert('이미지 업로드에 실패했습니다.\n다시 시도해 주세요.\n'
                                    +response.data.code+'::'+response.data.message);
                        } //switch

                    } //if else   
                })
        },
        delImage(imageSeq){
            var data = new FormData();
            data.set('imageSeq',imageSeq);

            if(confirm('해당 이미지를 삭제 하시겠습니까?')) { 
                this.$axios
                .post(
                    '/typing/api/service/news/delimage'
                    ,data
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
                                //이미지 리스팅 갱신
                                $('#exampleModal').modal('hide');
                                this.renewImageList();
                                break;

                            default:
                                alert('이미지 업로드에 실패했습니다.\n다시 시도해 주세요.\n'
                                    +response.data.code+'::'+response.data.message);
                        } //switch

                    } //if else

                    this.isSaving = false;
                })
                .catch(error=>{alert('Catch case: '+error.message);});
            }
        },        
        updateNewsInfo(){
            //editor content sync
            this.editor.getById["content"].exec("UPDATE_CONTENTS_FIELD", []);

            if(confirm('공지사항의 내용을 수정하시겠습니까?')) {
                this.$axios
                .post('/typing/api/service/news/'+this.id+'/update',{
                    subject: this.subject
                    , content: document.getElementById("content").value
                    , is_private: this.is_private
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
                                alert('공지사항 정보가 갱신되었습니다.')
                                window.location.href = "/typing/service/news/list";
                                break;

                            default:
                                alert(
                                    "공지사항 정보갱신에 실패 했습니다.\n다시 시도해 주세요.\n"
                                    +response.data.code+"::"+response.data.message
                                );
                        } //switch

                    } //else
                })
                .catch(error=>{alert('Catch case: '+error.message);});
            }
        },
        deleteNews(){
            if(confirm('해당 공지를 삭제 하시겠습니까?')){
                this.$axios
                    .post('/typing/api/service/news/delete',{
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

                                case ResponseCode.OK.code:
                                    alert('공지사항이 삭제되었습니다.')
                                    window.location.href = "/typing/service/news/list";
                                    break;

                                default:
                                    alert(
                                        "공지사항 삭제에 실패 했습니다.\n다시 시도해 주세요."
                                    );
                            } //switch

                        } //else
                    })
                    .catch(error=>{alert('Catch case: '+error.message);});
            }
        },
        updateFavor(){
            this.$refs.favor_zone.updateFavorZone();
        }
    },
    computed: {
        id(){
            return this.$route.params.id;
        }
    },
    created(){
        this.getNewsInfo();
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
};
</script>