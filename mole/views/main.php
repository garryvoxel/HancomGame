<?php
// test는 제개인 폴더경로입니다. 삭제해주세요.
include $_SERVER['DOCUMENT_ROOT']."/test/inc/sub_common.php";
?>
<body>
<!-- 헤더영역 -->
<?php
// test는 제개인 폴더경로입니다. 삭제해주세요.
include $_SERVER['DOCUMENT_ROOT']."/test/inc/main_gnb.php";
?>
<div id="fullpage">
	<div class="section " id="section1">

		<div class="fs01"><img src="imgs/main/t02.png" alt="" /></div>
		<div class="fs011"><img src="imgs/main/01.png" alt="" /></div>
		<div class="fs0111"><img src="imgs/main/02.png" alt="" /></div>
		<div class="fs02"><img src="imgs/main/t03.png" alt="" /></div>
		<div class="fs03"><img src="imgs/main/t04.png" alt="" /></div>	
		<div class="fs033"><img src="imgs/main/04.png" alt="" /></div>	
		<div class="fs04"><img src="imgs/main/fireworks_big.png" alt=""/></div>
		<div class="fs05"><img src="imgs/main/fireworks_big.png" alt=""/></div>
		<div class="fs06"><img src="imgs/main/t01.png" alt="" /></div>
  		<div>
			<div id="clouds3" class="clouds"></div>
			<div id="clouds1" class="clouds"></div>
			<div id="clouds2" class="clouds"></div>
		</div>    
	</div>
	<div class="section" id="section2">
		<div class="ss01"><img src="imgs/main/section02_txt01.png" alt=""/></div>
		<div class="ss02"><img src="imgs/main/tt07.png" alt="" /></div>
		<div class="ss03"><img src="imgs/main/tt03.png" alt="" /></div>		
		<div class="ss04"><img src="imgs/main/tt04.png" alt="" /></div>
		<div class="ss05"><img src="imgs/main/tt05.png" alt="" /></div>
		<div class="ss06"><img src="imgs/main/tt06.png" alt="" /></div>
	</div>
	<div class="section" id="section3">
		<div class="ts01"><img src="imgs/main/ttt01.png" alt="" /></div>
		<div class="ts02"><img src="imgs/main/section03_txt01.png" alt=""/></div>
		<div class="ts03"><img src="imgs/main/ttt04.png" alt="" /></div>		
		<div class="ts04"><img src="imgs/main/ttt05.png" alt="" /></div>
		<div class="ts05"><img src="imgs/main/ttt06.png" alt="" /></div>
		<div class="ts06"><img src="imgs/main/ttt07.png" alt="" /></div>
		<div class="ts07"><img src="imgs/main/ttt08.png" alt="" /></div>
		<div class="ts08"><a href="sub0301.php" class="inblock" style="z-index:99;"><img src="imgs/main/rank_more.png" alt="" /></a></div>
		
		<footer id="main_footer" class="mt_80">
			<section class="quick_zone">
				<div><img src="imgs/quick_img.png" alt="" /></div>
				<div><a href="" id="top_move"><img src="imgs/quick_top.png" alt="" /></a></div>
			</section>
			<section class="footer_in">
				<div class="footer_logo">
					<a href="#"><img src="imgs/sub_logo.png" alt="말랑말랑"></a>
				</div>
				<div class="foot_link">
					<a href="" >회사소개</a>
					<a href="" >이용약관</a>
					<a href="" >개인정보취급방침</a>
					<a href="" >이메일무단수집거부</a>
				</div>
				<address class="mt_8">경기도 성남시 분당구 대왕판교로 644번길 49 한컴타워 10층     고객지원 (평일 9시-18시) : 국내고객 1566-5192 </address>
				<p>사업자등록번호 107-81-52230     통신판매신고번호 2012-경기성남-1092     대표자 : 김상철, 노진호</p>
				<p class="copyright">Copyrights © Hancom Inc. All rights reserved.</p>
				<div class="footer_family_wrap" style="display: none;">
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
				</div>
			</section>
		</footer>
	</div>
</div>
<script type="text/javascript" src="js/fullpage.min.js"></script>
<script type="text/javascript">
    var myFullpage = new fullpage('#fullpage', {       
       anchors: ['firstPage', 'secondPage', '3rdPage'],
       // menu: '#menu',
      
		afterLoad: function(origin, destination, direction){
           
         
			//section 3 is using the state classes to fire the animation
            //see the CSS code above!
           
        }
		
    });
	$(function(){
		$("#clouds1").animate({'background-position-x':'-=10000'}, 500000, 'linear').animate({'background-position-x':'-=10000'}, 500000, 'linear');
		$("#clouds3").animate({'background-position-x':'10000'}, 1000000, 'linear').animate({'background-position-x':'20000'}, 1000000, 'linear');
	});
	resized();
	function get_started(){
		$("#clouds1,#clouds2,#clouds3").stop().stop().animate({'margin-top':'+=50px'}, 1000);
	}
	function resized(){
		$(".clouds").css("top", $(window).height() - 240);
	}
	$(window).resize(resized);
</script>
</body>
</html>
