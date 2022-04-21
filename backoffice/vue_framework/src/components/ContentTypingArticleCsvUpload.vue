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
                                <i class="ti-control-play"></i> 컨텐츠등록
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
                                <th>파일선택</th>
                                <td class="text-left">
                                    <div class="col-sm-6">
                                        <div class="input-group mb-2">
                                            <div class="custom-file">
                                                <input
                                                    type="file"
                                                    class="custom-file-input"
                                                    id="inputGroupFile01"
                                                    ref="csvFile"
                                                    enctype="multipart/form-data"
                                                    v-on:change="handleFileUpload()"
                                                >
                                                <label
                                                    class="custom-file-label"
                                                    for="inputGroupFile01"
                                                >파일선택</label>
                                            </div>
                                        </div>
                                        <p>* 양식에 맞게 정리한 엑셀파일(UTF-8 인코딩된 .csv)을 등록해주세요.</p>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div class="col-12 text-center mt-5">
                <button v-on:click="goToBack" class="btn btn-flat btn-success">취소</button>
                <button  v-on:click.prevent="doUpload" class="btn btn-flat btn-success">등록</button>
                <button type="submit" class="btn btn-flat btn-outline-success">엑셀양식다운로드</button>
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
    name: "MonitoringSlangXlsupload",
    components: {
        "header-area": HeaderArea,
        "favor-zone": FavorZone,
        "page-title-area": PageTitleArea
    },
    data(){
        return {
            csvFile: '',
            fileUrl: '',
        }
    },
    methods: {
        goToBack(){
            this.$router.go(-1);
        },
        handleFileUpload(){
            this.csvFile = this.$refs.csvFile.files[0];
            this.fileUrl = URL.createObjectURL(this.csvFile);
        },        
        doUpload(){
            var data = new FormData();
            data.append('csvfile',this.csvFile);

            this.$axios
                .post(
                    '/typing/api/devtest'
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

                            case ResponseCode.NO_UTF8.code:
                                alert('업로드 하신 파일이 \'UTF-8\' 로 인코딩 되어 있지 않습니다.\n문서편집기에서 내용 작성후 저장하실때\n\'UTF-8\' 로 인코딩 설정해 저장하신후 다시 올려주시기 바랍니다. ');
                                break;

                            case ResponseCode.OK.code:
                                alert('비속어 목록에 추가되었습니다.');
                                window.location.href = '/typing/monitoring/slang/list';
                                break;

                            default:
                                alert('비속어등록에 실패했습니다.\n다시 시도해 주세요.\n'
                                    +response.data.code+'::'+response.data.message);
                        } //switch

                    } //if else

                    this.isSaving = false;
                })
                .catch(error=>{alert('Catch case: '+error.message);});            
        },
        updateFavor(){
            this.$refs.favor_zone.updateFavorZone();
        }
    }
}
</script>