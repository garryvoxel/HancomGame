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
                                <i class="ti-control-play"></i> 비속어등록
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
                                <th>비속어 단어등록</th>
                                <td class="text-left">
                                    <ul class="txt-cont">
                                        <li v-for="i in wordCount" class="col-sm-3">
                                            <input type="text" class="form-control" v-model="words[i-1]" >
                                        </li>
                                    </ul>
                                    <div class="pl-1 text-left mt-3">
                                        <button
                                            type="submit"
                                            class="btn btn-flat btn-warning"
                                            v-on:click="addWordCount"
                                        >입력 항목추가</button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div class="col-12 text-center mt-5">
                <button v-on:click="goToBack" class="btn btn-flat btn-dark">취소</button>
                <button v-on:click="doWriteSlang" class="btn btn-flat btn-success">등록</button>
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
    name: "MonitoringSlangWrite",
    components: {
        "header-area": HeaderArea,
        "favor-zone": FavorZone,
        "page-title-area": PageTitleArea
    },
    data() {
        return{
            wordCount : 8
            , words: []
        }
    },
    methods: {
        goToBack() {
            this.$router.go(-1);
        },
        addWordCount(){
            this.wordCount++;
        },
        doWriteSlang(){
            if(confirm('등록하신 단어들을 비속어에 등록하시겠습니까?')){
                this.$axios
                    .post('/typing/api/monitoring/slang/write',{
                        words: this.words
                    })
                .then(response => {
//
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
                                alert(JSON.stringify('작성하신 단어들이 비속어로 등록되었습니다.'));
                                window.location.href='/typing/monitoring/slang/list';
                                break;

                            default:
                                alert(
                                    "비속어 단어 등록을 실패 했습니다.\n다시 시도해 주세요.\n"
                                    +response.data.code+ "::" +response.data.message
                                );
                        } //switch

                    } //if else   
//
                })
                .catch(error=>{alert('Catch case: '+error.message);});                    
            }
        },
        updateFavor(){
            this.$refs.favor_zone.updateFavorZone();
        }
    }
}
</script>