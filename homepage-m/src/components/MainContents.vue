<template>
    <div class="page-container">
        <SideMenu/> 
        <div class="main-content">          
          <div class="header-area">           
              <div class="row align-items-center">
                <div class="col-3 col-sm-6 clearfix">
                  <div class="nav-btn pull-left" v-on:click="show = !show" >                
                    <span></span>
                    <span></span>
                    <span></span>                  
                  </div>
                </div>        
              
                <div class="col-6 col-sm-6  text-center clearfix">
                  <div class="nav-clogo">
                      <img src="imgs/logo_new.png" alt="">
                  </div>
                </div>

                <div class="col-3 col-sm-6 clearfix">
                  <div class="nav-logo pull-right">
                      <img src="imgs/new_menu.png" alt="">
                  </div>
                </div>

                <!-- <div class="main_noti">
                  <span class="bagi_new">N</span>
                  <span class="tt">한컴타자 신규오픈 EVENT</span>
                  <span class="data">2019.02.28</span>
                </div> -->
              </div> 
          </div>

          <div class="main-content-inner">
            <div class="main_card mc_bg1">
              <router-link to="/game/coin" class="btn_mred"><img src="imgs/btn_start_r.png" alt=""></router-link>
              <img src="imgs/main_cd01.png" alt="">
            </div>
            <div class="main_card mc_bg2">
              <router-link to="/game/moles" class="btn_mred"><img src="imgs/btn_start_r.png" alt=""></router-link>
              <img src="imgs/main_cd02.png" alt="">
            </div>
            <div class="main_card mc_bg3">
              <img src="imgs/main_cd03.png" alt="">
            </div>
            <div class="main_card mc_bg4">
              <img src="imgs/main_cd04.png" alt="">
            </div>
          </div>
        </div>
    </div>
</template>

<script>
import SideMenu from '@/components/SideMenu.vue'

export default {
    data(){
        return{
            show : false
        }
    },

    components:{
        SideMenu,
    }
}
</script>

<style>
/* .slide{
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
} */
</style>

