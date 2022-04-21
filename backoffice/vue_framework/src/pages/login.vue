<template lang="html">
    
    <!-- login area start -->
    <div id="es-login" class="login-area">
        <div class="login-tit">
        <i class="ti-face-sad"></i> 로그인하세요.
        </div>
        <div class="container">
            <div class="login-box ptb--100">
                <form id="es-login-form" action="/typing/api/login" method="POST">
                    <div class="login-form-head">
                    <div class="logo" style="padding-bottom:20px;">
                        <img src="/typing/static/images/ad_logo.png" alt="logo" width="60px">
                    </div>
                        <h2>한컴타자 백오피스 로그인</h2>
                    </div>
                    <div class="login-form-body">
                        <div class="form-gp">
                            <input type="text" ref="UserName" v-model="UserName" name="username" placeholder="아이디" >
                            <i class="ti-marker-alt"></i>
                        </div>
                        <div class="form-gp">
                            <input type="password" ref="Password" v-model="Password" name="password" placeholder="비밀번호">
                            <i class="ti-lock"></i>
                        </div>
                        <div class="row mb-4 rmber-area">
                            <div class="col-6">
                                <div class="custom-control custom-checkbox mr-sm-2">
                                    <input type="checkbox" class="custom-control-input" name="remember_username" id="customControlAutosizing" :checked=isUsernameSave >
                                    <label class="custom-control-label" for="customControlAutosizing">아이디저장</label>
                                </div>
                            </div>
                        </div>
                    </div>
                        <input type="hidden" name="redirect_uri" value="">
                    <div class="login-form-foot">
                        <div class="submit-btn-area">
                            <button v-on:click.prevent="onLoginButtonAction" id="form_submit" >로그인 <i class="ti-arrow-right"></i></button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
        <!-- login area end -->
    
  
</template>

<script>

import ResponseCode from "@/utils/response_code";

var $login = $('#es-login');
var rememberedUsername = fv.Cookie.getCookie('username');
var loginuser = fv.Cookie.getCookie('loginuser');

export default {
    name: "login",
    data() {
        return{
            UserName: "",
            isUsernameSave: false,
            Password: ""
        }
    },
    methods: {

        loadSavedUserName(){

            if (rememberedUsername) {
                this.UserName = rememberedUsername;
                this.isUsernameSave = true;
            } else {
                this.UserName = rememberedUsername;
                this.isUsernameSave = false;
            }
        },
        loginCheck(){
            if(loginuser) {
                window.location.href="/typing/service/news/list";
            }
        },
        onLoginButtonAction(){
            var
                url = $("#es-login-form").attr("action"),
                args = {},
                username = this.UserName,
                password = this.Password;

            if (! username || ! username.length) {
                alert('아이디를 입력해주세요.');
                this.$refs.UserName.focus();
                return false;
            }

            if (! password || ! password.length) {
                alert('비밀번호를 입력해주세요.');
                this.$refs.Password.focus();
                return false;
            }

            if ($('input[name="remember_username"]').prop('checked')) {
                fv.Cookie.setCookie('username', username, 7);
            } else {
                fv.Cookie.setCookie('username', '', 0);
            }

            args.username = username;
            args.password = password;

            setDisabled(true);

            $.post(url, args, function(data) {
                setDisabled(false);

                switch(data.code) {

                    case ResponseCode.OK.code: 
                        //login 성공으로 쿠키에 저장
                        fv.Cookie.setCookie('loginuser', username, 1/24);
                        fv.Cookie.setCookie('display_name', data.display_name, 1);
                        fv.Cookie.setCookie('permissions', data.permissions, 1);

                        window.location.href = $('input[name="redirect_uri"]').val() || '/typing/service/news/list';
                    break;

                    case ResponseCode.PASSWORDEXPIRE.code: 
                        //login 성공 했으나 패스워드 변경을 해야함.
                        fv.Cookie.setCookie('loginuser', username, 1/24);
                        fv.Cookie.setCookie('display_name', data.display_name, 1);
                        fv.Cookie.setCookie('permissions', data.permissions, 1);

                        //window.location.href = '/typing/managers/'+req.session.managerId+'/edit';
                    break;

                    default:
                        if (data.code == ResponseCode.NO_AUTHORITY.code) {
                            alert('비활성화된 계정입니다. 관리자에게 문의 하세요.');
                            return;
                        }
                        else if (data.code == ResponseCode.INACCESSIBLE_IP.code) {
                            alert('접근할 수 없는 IP입니다. 관리자에게 문의 하세요.');
                            return;
                        } else {
                            alert('아이디나 비밀번호를 확인해주세요.');
                            return;
                        }  
                }
            }, 'jsonp')
            .fail(function(jqXHR, textStatus, errorThrown) {
                setDisabled(false);
                alert('아이디나 비밀번호를 확인해주세요.');
                return;
            });

            function setDisabled(isDisabled) {
                $('input[name="username"]').prop('disabled', isDisabled);
                $('input[name="password"]').prop('disabled', isDisabled);
                $('#form_submit').prop('disabled', isDisabled);
            }

            return false;            
        },
        
    },
    created() {
        require('es6-promise').polyfill();
        this.loadSavedUserName();
        this.loginCheck();
    }
}    
</script>
