<template>
  <div class="page-container">
    <div class="page-wrapper home">
      <Header/>
      <SideMenu />
      <section class="main-content">
        <p class="main-headline">
          게임으로 즐기는 새로운 한컴 타자연습
        </p>
        <div class="main-content-inner">
          <div class="main_card mc_bg1">
            <router-link to="/game/coin" class="btn_mred"><img src="/imgs/btn_start_r.png" alt=""></router-link>
            <img src="/imgs/main_cd001.png" alt="">
          </div>
          <div class="main_card mc_bg2">
            <router-link to="/game/moles" class="btn_mred"><img src="/imgs/btn_start_r.png" alt=""></router-link>
            <img src="/imgs/main_cd002.png" alt="">
          </div>
          <!-- <div class="main_card mc_bg3">
            <router-link to="/ranking/coin" ><img src="imgs/main_cd003.png" alt=""></router-link>
          </div> -->
          <!--<div class="main_card mc_bg4">
            <router-link to="/event/view" ><img src="imgs/main_cd004.png" alt=""></router-link>
          </div>
          <div class="main_card mc_bg5">
            <router-link to="/event/view" ><img src="imgs/main_cd004.png" alt=""></router-link>
          </div>-->
        </div>
      </section>
      <Footer/>
      <modal-front />
    </div>
  </div>
</template>

<script>
import Header from '@/components/Header.vue'
import PreLoader from '@/components/PreLoader.vue'
import MainContents from '@/components/MainContents.vue'
import SideMenu from '@/components/SideMenu.vue'
import Footer from '@/components/Footer.vue'
import ModalFront from "@/components/ModalFront.vue";
import { callbackify } from 'util';


export default {
  name: 'home',
  components: {
    Header,
    SideMenu,
    Footer,
    ModalFront,
  },
  data()
  {
    return{
      ad_state : false,
      famillies : this.$WebConfig.hancomFamilies,
    };
  },
  methods:{
    openFamilySite(event){
      const targetUri = event.target.value;
      if(targetUri){
        location.href = targetUri;
      }
    },
    Logs() {
        this.$axios
        .put(this.$Api.adLogs,
        { check_type: 1,id: 803607,advertis_type : 3, Authorization:'Bearer' + this.$root.sessionId() }, this.$root.bearerHeaders())
        .then(response => {
            this.ad_state = false;
            if (!response || response.data.code != 1) {
                return
            }
        })
        .catch(error => {
            console.error(error)
        })
    },
    adStart(top, left, adValue){
		
			var ad = new SignalAD();

			ad.setting({
				ssl : true, 		
				adTarget : adValue, 			
				adDepth : "999999",				
				publisherCD : "1483", 
				mediaCD : "31656", 		
				sectionCD : "803607",      
				linkTarget : "1"                
			},
			{
				done : function( status, msg ) {
					console.log("[event] done : "+status+" msg :"+msg);
				},
				fail : function( status, msg ) {
					console.log("[event] fail : "+status+" msg : "+msg);
				},
				adclick : function( status, msg ) {
          console.log("[event] adclick : ( status "+status+" msg : "+msg+" )");
				},
				etc : function( status, msg ) {
					console.log("[event] fail - status : "+status+" msg : "+msg);
				},
				noad : function( status, msg ) {
					console.log("[event] noad - status : "+status+" msg : "+msg);
				},
				close : function( status, msg ) {
					console.log("[event] close - status : "+status+" msg : "+msg);
				},
				chargeable : function( status, msg ) {
					console.log("[event] at type - status : "+status+" msg : "+msg);
				}
			}); 

			// 4)
      ad.start();
          var elem = document.getElementById("mz_article");
        var elemImg = document.getElementById('mz_first');
        elem.style.width = '100%';
        elem.style.height = '50px';

        elemImg.style.width = '100%';
        elemImg.style.height = '50px';
		},
    
		
  },
  watch: {
        $route() { 
            this.fetchPosts();      
        }
    },
    mounted : function(){
       // this.adStart('0px', '0px', 'banner_test');
      }
}
</script>
<style scoped>
.home .site-header{ 
  background-color: #5C49A7;
  color: #fff;
}
.home >>> .logo-taja {
  fill: currentColor;
}
.main-headline {
  overflow: hidden;
  height: 0;
  margin-top: -50px;
  padding-top: calc(475 / 402 * 100%);
  background: url(/imgs/main_bg.png) 50% 0 no-repeat;
  background-size: cover;
}
</style>