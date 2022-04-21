<template>
  <div class="home">
    <div id="banner_test" >
	  <!-- AD Area -->	
	  </div>
    <div class="page-container">
     
      <!-- <PreLoader/> -->
      <SideMenu/>

      <div class="main-content">          

        <div class="header-area">           
            <div class="row align-items-center">

              <div class="col-3 col-sm-6 clearfix">
                <div class="nav-btn pull-left">                
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
                    <!-- <img src="imgs/new_menu.png" alt=""> -->
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
            <img src="imgs/main_cd001.png" alt="">
          </div>
          <div class="main_card mc_bg2">
            <router-link to="/game/moles" class="btn_mred"><img src="imgs/btn_start_r.png" alt=""></router-link>
            <img src="imgs/main_cd002.png" alt="">
          </div>
          <div class="main_card mc_bg3">
            <router-link to="/ranking/coin" ><img src="imgs/main_cd003.png" alt=""></router-link>
          </div>
          <!--<div class="main_card mc_bg4">
            <router-link to="/event/view" ><img src="imgs/main_cd004.png" alt=""></router-link>
          </div>
          <div class="main_card mc_bg5">
            <router-link to="/event/view" ><img src="imgs/main_cd004.png" alt=""></router-link>
          </div>-->
        </div>
      </div>
      <footer>
          <ul class="private">
            <li><a href="https://accounts.malangmalang.com/terms/current/ko">서비스 이용약관</a></li>
            <li><a href="https://accounts.malangmalang.com/privacy/current/ko" style="color:#ba8feb;">개인정보처리방침</a></li>
          </ul>
          <div class="family_zone text-center mb-1">
            <select name="" id="" onchange="javascript:go_url(this.options[this.selectedIndex].value);">
              <option selected> 패밀리사이트</option>
              <option value="http://www.hancomgroup.com">한글과컴퓨터그룹</option>
              <option value="http://www.hancom.com">한글과컴퓨터</option>
              <option value="http://www.mdstec.com">한컴MDS</option>
              <option value="http://www.hsecure.co.kr">한컴시큐어</option>
              <option value="http://www.hancomgmd.com">한컴GMD</option>
              <option value="http://www.interfree.com">한컴인터프리</option>
              <option value="http://www.talkafe.net">한컴톡카페</option>
              <option value="http://www.sancheong.com">산청</option>
              <option value="http://www.hancomunimax.co.kr">한컴유니맥스</option>
              <option value="http://www.teladin.com">텔라딘</option>
              <option value="http://www.hancomrobotics.com">한컴로보틱스</option>
            </select>
          </div>
          <ul>
            <!-- <li class="text-center">
              <img srcA="imgs/f_logo.png" alt="" width="30%">
            </li> -->
            <li >
              <p>경기도 성남시 분당구 대왕판교로 644번길 49 한컴타워 10층</p>
            </li>
            <li><p>고객지원 : 평일 9시~18시, typing@hancom.com</p></li>
            <li><p>사업자등록번호 107-81-52230 통신판매신고번호 2012-경기성남-1092</p></li>
            <li><p>(주)한글과컴퓨터 대표자 : 김상철</p></li>
            <li><p>Copyrights © Hancom Inc. All rights reserved.</p></li>
          </ul>

          <!-- <div class="footer_family_wrap" style="display: none;">
            <div class="footer_family_inbox">
              <div class="footer_family_list">
                <ul>
                  <li class="footer_family_item"><a href="http://www.hancomgroup.com" target="_blank">한글과컴퓨터그룹</a></li>
                  <li class="footer_family_item"><a href="http://www.hancom.com" target="_blank">한글과컴퓨터</a></li>
                  <li class="footer_family_item"><a href="http://www.mdstec.com" target="_blank">한컴MDS</a></li>
                  <li class="footer_family_item"><a href="https://www.hsecure.co.kr" target="_blank">한컴시큐어</a></li>
                  <li class="footer_family_item"><a href="http://ko.hancomgmd.com" target="_blank">한컴GMD</a></li>
                  <li class="footer_family_item"><a href="http://www.interfree.com" target="_blank">한컴인터프리</a></li>
                  <li class="footer_family_item"><a href="http://www.talkafe.net" target="_blank">한컴톡카페</a></li>
                  <li class="footer_family_item"><a href="http://www.sancheong.com" target="_blank">산청</a></li>
                  <li class="footer_family_item"><a href="http://hancomunimax.co.kr" target="_blank">한컴유니맥스</a></li>
                  <li class="footer_family_item"><a href="http://teladin.com" target="_blank">텔라딘</a></li>
                  <li class="footer_family_item"><a href="http://www.hancomrobotics.com" target="_blank">한컴로보틱스</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div class="footer_family_btn">
            <a href="#none" class="on">패밀리사이트</a>
          </div> -->
        </footer>
    </div>
  </div>
</template>

<script>
import Header from '@/components/Header.vue'
import PreLoader from '@/components/PreLoader.vue'
import MainContents from '@/components/MainContents.vue'
import SideMenu from '@/components/SideMenu.vue'
import { callbackify } from 'util';


export default {
  name: 'home',
  components: {
    Header,
    SideMenu,
    
  },
  data()
  {
    return{
      ad_state : false
    };
  },
  methods:{
    Logs() {
        this.$axios
        .put(this.$Api.adLogs,
        { check_type: 1,id: 803607,advertis_type : 3, Authorization:'Bearer' + this.$root.sessionId() }, this.$root.bearerHeaders())
        .then(response => {
            console.log(response.data);
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
        this.adStart('0px', '0px', 'banner_test');
      }
}
</script>
