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
                            <h4 class="spage-title pull-left"><i class="ti-control-play"></i> 관리자정보수정</h4>
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
                                <th>이름</th>
                                <td>
                                    <div class="col-sm-4">
                                        <div class="input-group">
                                            <input v-model.trim="display_name" name="display_name" ref="display_name" type="text" class="form-control" placeholder="이름">
                                        </div>
                                    </div>
                                </td>
                                </tr>
                                <tr>
                                <th>아이디</th>
                                <td>
                                    <div class="col-sm-4">
                                        <div class="input-group">
                                            <input v-model.trim="username" name="username" ref="username" type="text" class="form-control" id="" placeholder="아이디">
                                        </div>
                                    </div>
                                </td>
                                </tr>
                                <tr>
                                <th>비밀번호</th>
                                <td>
                                    <div class="col-sm-4">
                                        <div class="input-group">
                                            <input v-model.trim="password" name="password" ref="password" type="password" class="form-control" id="" placeholder="비밀번호">
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
                                <tr>
                                <th>권한</th>
                                <td class="text-left pl-4">
                                    <div class="custom-control custom-checkbox custom-control-inline">
                                        <input type="checkbox" class="custom-control-input" id="customCheck1" v-model="auth1"  true-value="1" false-value="0">
                                        <label class="custom-control-label" for="customCheck1">서비스관리</label>
                                    </div>
                                    <div class="custom-control custom-checkbox custom-control-inline">
                                        <input type="checkbox" class="custom-control-input" id="customCheck2" v-model="auth2"  true-value="1" false-value="0">
                                        <label class="custom-control-label" for="customCheck2">콘텐츠관리</label>
                                    </div>
                                    <div class="custom-control custom-checkbox custom-control-inline">
                                        <input type="checkbox" class="custom-control-input" id="customCheck3" v-model="auth3"  true-value="1" false-value="0">
                                        <label class="custom-control-label" for="customCheck3">광고관리</label>
                                    </div>
                                    <div class="custom-control custom-checkbox custom-control-inline">
                                        <input type="checkbox" class="custom-control-input" id="customCheck4" v-model="auth4"  true-value="1" false-value="0">
                                        <label class="custom-control-label" for="customCheck4">회원관리</label>
                                    </div>
                                    <div class="custom-control custom-checkbox custom-control-inline">
                                        <input type="checkbox" class="custom-control-input" id="customCheck5" v-model="auth5"  true-value="1" false-value="0">
                                        <label class="custom-control-label" for="customCheck5">포인트</label>
                                    </div>
                                    <div class="custom-control custom-checkbox custom-control-inline">
                                        <input type="checkbox" class="custom-control-input" id="customCheck6" v-model="auth6"  true-value="1" false-value="0">
                                        <label class="custom-control-label" for="customCheck6">관리자관리</label>
                                    </div>
                                    <div class="custom-control custom-checkbox custom-control-inline">
                                        <input type="checkbox" class="custom-control-input" id="customCheck7" v-model="auth7"  true-value="1" false-value="0">
                                        <label class="custom-control-label" for="customCheck7">모니터링</label>
                                    </div>
                                    <div class="custom-control custom-checkbox custom-control-inline">
                                        <input type="checkbox" class="custom-control-input" id="customCheck8" v-model="auth8"  true-value="1" false-value="0">
                                        <label class="custom-control-label" for="customCheck8">통계</label>
                                    </div>
                                    <div class="custom-control custom-checkbox custom-control-inline">
                                        <input type="checkbox" class="custom-control-input" id="customCheck9" v-model="auth9"  true-value="1" false-value="0">
                                        <label class="custom-control-label" for="customCheck9">예비1</label>
                                    </div>

                                </td>
                                </tr>
                                <tr>
                                <th>IPv4</th>
                                <td>
                                    <div class="col-sm-4">
                                        <div class="input-group">
                                            <input v-model.trim="ipv4" name="ipv4" ref="ipv4" type="text" class="form-control" id="" placeholder="IPv4">
                                        </div>
                                    </div>
                                </td>
                                </tr>
                                <tr>
                                <th>상태설정</th>
                                <td>
                                    <div class="col-sm-4">
                                        <div class="input-group">
                                    <select v-model="is_active" class="form-control"  name="is_active">
                                        <option value="1" selected>사용중</option>
                                        <option value="0">정지</option>
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
                    <button class="btn btn-flat btn-secondary" v-on:click.prevent="back" >취소</button>  <button @click.prevent="editManger" class="btn btn-flat btn-success">수정</button>
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
    name: "managerEdit",
    data() {
      return {
          display_name: ""
          , username: ""
          , password: ""
          , password_confirmation: ""
          , is_active: 1
          , ipv4: ""
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
            
            var permissions = this.auth1
                + this.auth2 
                + this.auth3 
                + this.auth4 
                + this.auth5 
                + this.auth6 
                + this.auth7 
                + this.auth8 
                + this.auth9;

            if (!this.display_name){
                alert('이름을 입력해주세요.');
                this.$refs.display_name.focus();
                return;
            }

            if(!this.username){
                alert('아이디를 입력해 주세요');
                this.$refs.username.focus();
                return;
            }

            if(this.password != this.password_confirmation ){
                alert('비밀번호와 비밀번호확인은 동일해야 합니다.');
                this.password = "";
                this.password_confirmation = "";
                this.$refs.password.focus();
                return;
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
                    '/typing/api/manager/'+this.id+'/update'
                    ,{
                        display_name: this.display_name
                        , username: this.username
                        , password: this.password
                        , password_confirmation: this.password_confirmation
                        , is_active: this.is_active
                        , ipv4: this.ipv4
                        , permissions: permissions
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

                            case ResponseCode.PASSWORDEXPIRE.code:
                                return;
                                break;

                            case ResponseCode.OK.code:
                                alert('관리자의 정보가 수정되었습니다.');
                                window.location.href = '/typing/managers/list'; 
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
        getManagerInfo(){
            this.$axios
                .get('/typing/api/manager/'+this.id+'/info')
                .then( response => {
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

                            case ResponseCode.INACCESSIBLE_IP.code:
                                alert('접근할 수 없는 IP 입니다.');
                                return;
                                break;

                            case ResponseCode.PASSWORDEXPIRE.code:
                                alert('비밀번호 유효기간(180일)이 지났습니다.\n비밀번호를 변경해 주세요.');
                                window.location.href = "/typing/managers/pwmodifyforce";
                                return;
                                break;
                                
                            case ResponseCode.OK.code:
                                var managerInfo = response.data.result;
                                this.display_name = managerInfo.display_name;
                                this.username = managerInfo.username;
                                this.is_active = managerInfo.is_active ? '1':'0';
                                this.ipv4 = managerInfo.ipv4;

                                //permissions
                                this.auth1 = managerInfo.permissions.substr(0,1);
                                this.auth2 = managerInfo.permissions.substr(1,1);
                                this.auth3 = managerInfo.permissions.substr(2,1);
                                this.auth4 = managerInfo.permissions.substr(3,1);
                                this.auth5 = managerInfo.permissions.substr(4,1);
                                this.auth6 = managerInfo.permissions.substr(5,1);
                                this.auth7 = managerInfo.permissions.substr(6,1);
                                this.auth8 = managerInfo.permissions.substr(7,1);
                                this.auth9 = managerInfo.permissions.substr(8,1);
                                break;
                                
                            default:
                                alert(
                                    "관리자 정보를 가져오는데 했습니다.\n다시 시도해 주세요.\n"
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
        this.getManagerInfo();
    }
}
</script>
