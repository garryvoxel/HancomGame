<template>
    <div class="header-area">
        <div class="row align-items-center">
            <!-- nav and search button -->
            <div class="col-md-6 col-sm-8 clearfix">
                <div class="nav-btn pull-left" @click="menuShow()">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
                <i class="ti-face-smile"></i> {{ loginDisplayName }}님 안녕하세요.
            </div>
            <!-- profile info & task notification -->
            <div class="col-md-6 col-sm-4 clearfix">
                <ul class="notification-area pull-right">
                    <li @click.prevent="logout">
                        <i class="ti-lock"></i> 로그아웃
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>

import ResponseCode from "@/utils/response_code";

export default {
    name: "headerarea",
    data() {
        return {
            loginDisplayName: this.$cookie.get('display_name')
        }
    },
    methods: {
        logout(){
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
        },
        menuShow(){
            $(".sidebar-menu").css("left", '0');
            $(".sidebar-menu").css("width", '100%');
        }
    }
}
</script>