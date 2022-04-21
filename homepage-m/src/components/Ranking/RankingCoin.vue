<template>
    <div class="page-container">
        <div class="rankingcoin">
            <SideMenu/>   
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
                        <h4>랭킹</h4>
                    </div>
                    <div class="col-3 col-sm-3 clearfix">
                        <div class="nav-logo pull-right">
                            <router-link to="/"><img src="/imgs/ad_logo.png"></router-link>
                        </div>
                    </div>
                </div>
            </div>
            <RankingTabCoin/>
            <Footer/>
        </div>
    </div>
</template>

<script>
import SideMenu from '@/components/SideMenu.vue'
import Footer from '@/components/Footer.vue'
import RankingTabCoin from '@/components/Ranking/RankingTabCoin.vue'

export default {
    data(){
        return{
            show : false
        }
    },

    components:{
        SideMenu,
        Footer,
        RankingTabCoin
    }
}
</script>

<style>
.slide{
  transition: all .1s ease;
  padding-left: 15%;
}
.slide-enter-active {
  transition: all .1s ease;
}
.slide-leave-active {
  transition: all .1s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-enter, .slide-leave-to{
  transform: translateX(10px);
  opacity: 0;
}
</style>


