<template>
    <div class="main-content">
        <!-- header area start -->
        <header-area />
        <favor-zone ref="favor_zone"/>
        <!-- header area end -->

        <div class="main-content-inner">
            <!-- page title area start -->
            <page-title-area />
            <!-- page title area end -->
            <!-- search area start -->
            <div class="spage-title-area">
                <div class="row align-items-center">
                    <div class="col-sm-12">
                        <div class="breadcrumbs-area clearfix">
                            <h4 class="spage-title pull-left"><i class="ti-control-play"></i> 관리자 비밀번호 수정 (비밀번호 유효기간 180일 경과되어 필수적으로 변경되어야 합니다.)</h4>
                        </div>
                    </div>
                </div>
            </div>

            <div class="row">
                <!-- data table start -->
                <div class="col-12">
                <form id="es-manager-register-form" method="POST">    
                    <div class="data-tables">
                        <div class="tablewrap2">
                        <table class="tbsty02 text-center">
                            <colgroup>
                            <col width="150">
                            <col width="*">
                            </colgroup>
                            <tbody>
                                <tr>
                                <th>비밀번호</th>
                                <td>
                                    <div class="col-sm-4">
                                        <div class="input-group">
                                            <input v-model.trim="password" name="password" ref="password" type="password" class="form-control" id="" placeholder="비밀번호">
                                        </div>
                                        <div class="">
                                            <span class="small text-danger">
                                                영문 대문자, 영문 소문자, 숫자, 특수문자 중 2종류 이상을 조합하여 최소 10자리 이상
                                            </span>
                                        </div>
                                    </div>
                                </td>
                                </tr>
                                <tr>
                                <th>비밀번호확인</th>
                                <td>

                                    <div class="col-sm-4">
                                        <div class="input-group">
                                            <input v-model.trim="password_confirmation" name="password_confirmation" ref="password_confirmation" type="password" class="form-control" id="" placeholder="비밀번호확인">
                                        </div>
                                    </div>
                                </td>
                                </tr>
                            </tbody>
                        </table>
                        </div>
                    </div>
                    <div class="col-12 text-center mt-5">
                    <button @click.prevent="editManger" class="btn btn-flat btn-success">수정</button>
                    </div>
                    </form>
                </div>
                <!-- data table end -->
            </div>
        </div>
    </div>
</template>

<script>
import HeaderArea from '@/components/HeaderArea.vue';
import FavorZone from '@/components/FavorZone.vue';
import PageTitleArea from '@/components/PageTitleArea.vue';

import ResponseCode from "@/utils/response_code";

export default {
    name: "managerPwModify",
    data() {
      return {
          display_name: ""
          , username: ""
          , password: ""
          , password_confirmation: ""
          , is_active: 1
          , auth1: "0"
          , auth2: "0"
          , auth3: "0"
          , auth4: "0"
          , auth5: "0"
          , auth6: "0"
          , auth7: "0"
          , auth8: "0"
          , auth9: "0"
      }  
    },
    components: {
        'header-area': HeaderArea
        ,'favor-zone': FavorZone
        ,'page-title-area': PageTitleArea
    },
    methods: {
        editManger(){

            let typeCount = 0;

            if( this.password != this.password_confirmation ) {
                alert('입력된 패스워드가 확인에 작성한 비밀번호와 일치 하지 않습니다.');
                this.password = '';
                this.password_confirmation = '';
                return false;
            }

            if(!/^[a-zA-Z0-9\W]{10,100}$/.test(this.password)){
                alert('숫자와 영문자 조합으로 10자리 이상을 사용해야 합니다.');
                this.password = '';
                this.password_confirmation = '';                
                return false;
            }

            if(!/^[A-Z0-9\W]{1,100}$/.test(this.password)){
                //alert('알파벳 소문자');
                typeCount++;
            }
            if(!/^[a-z0-9\W]{1,100}$/.test(this.password)){
                //alert('알파벳 대문자');
                typeCount++;
            }
            if(!/^[a-zA-Z\W]+$/.test(this.password)){
                //alert('숫자');
                typeCount++;
            }            
            if(!/^[a-zA-Z0-9]{1,100}$/.test(this.password)){
                //alert('특수문자');
                typeCount++;
            }            
            
            if(typeCount < 2) {
                alert('숫자와 영문자 조합으로 2종류 이상을 사용해야 합니다.');
                this.password = '';
                this.password_confirmation = '';                
                return false;                
            }

            this.$axios
                .post(
                    '/typing/api/manager/pwupdateself'
                    ,{
                        password: this.password
                        , password_confirmation: this.password_confirmation
                    })
                .then(response => {
                    //console.log(response.data);

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

                            case ResponseCode.OK.code:
                                alert('비밀번호가 수정되었습니다.');
                                    this.$axios
                                    .get('/typing/api/logout')
                                    .then(response =>{
                                        this.$cookie.delete("loginuser");
                                        this.$cookie.delete("display_name");                            
                                        this.$cookie.delete("permissions");                            
                                        window.location.href = "/typing/login";
                                    })
                                    .catch(error=>{
                                        alert('Catch case: '+error.message);
                                    });
                                break;
                            default:
                                alert(
                                    "관리자 정보 수정에 실패 했습니다.\n다시 시도해 주세요.\n"
                                    +response.data.code+ "::" +response.data.message
                                );
                        } //switch

                    } //if else                      
                    
                });

        },
        back() {
            window.location.href = '/typing/managers/list';
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
    created() {
     
    }
}
</script>
