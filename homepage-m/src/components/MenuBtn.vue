<template>
    <div class="sidemenu-btn">
        <div class="col-3 col-sm-6 clearfix">
            <div class="nav-btn pull-left" v-on:click="show = !show" >                
                <span></span>
                <span></span>
                <span></span>                  
            </div>
        </div>

        <transition name="slide" class="slide">
            <div v-if="show" class="slide">
                <SideMenu/>
            </div>   
        </transition>          
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
.slide{
    padding-left: 15%;
    box-shadow: 2px 0 32px rgba(0, 0, 0, 0.05);
}
.slide-enter-active {
  transition: all .1s ease;
}
.slide-leave-active {
  transition: all .1s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-enter, .slide-leave-to{
  transform: translateX(20px);
  opacity: 0;
}
</style>
