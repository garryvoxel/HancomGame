<template>
    <div class="header">
        <div class="sub-header-area">
            <div class="row align-items-center">
                <div class="col-3 col-sm-3 clearfix">
                    <div class="nav-btn pull-left">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>

                </div>
                <div class="col-6 col-sm-6 clearfix text-center">
                    <h4>{{getTitle}}</h4>
                </div>
                <div class="col-3 col-sm-3 clearfix">
                    <div class="nav-logo pull-right">
                        <img src="/imgs/ad_logo.png" alt="">
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data(){
        return{
           pageTitle : '' 
        }
    },
    
    computed : {
        getTitle() {
           return this.$route.titlename;
        }
    }
}
</script>
