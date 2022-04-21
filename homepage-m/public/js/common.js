// 공통
$(function() {
	//패밀리사이트
	$('.footer_family_wrap').hide();
    $('.footer_family_btn a').click(function(){
        $('.footer_family_wrap').slideToggle(200, function(){
            if($(this).is(':hidden')) $('.footer_family_btn a').removeClass('on');
            else $('.footer_family_btn a').addClass('on');
        });
    });
	// 퀵메뉴 이동
	$("#top_move").click(function() {
		$('html, body').animate({
			scrollTop : 0
		}, 400);
		return false;
	});
	//탭
	$('ul.nav-tabs li').click(function() {
		var activeTab = $(this).attr('data-tab');
		$('ul.nav-tabs li').removeClass('current');
		$('.tabcontent').removeClass('current');
		$(this).addClass('current');
		$('#' + activeTab).addClass('current');
	});
	$('ul.nav-tabs1 li').click(function() {
		var activeTab = $(this).attr('data-tab');
		$('ul.nav-tabs1 li').removeClass('current');
		$('.tabcontent').removeClass('current');
		$(this).addClass('current');
		$('#' + activeTab).addClass('current');
	});
	//모달팝업
	$( "#opener" ).click(function() {
		$('#myModal').show();
	});
	$( "#close_pop" ).click(function() {
		$('#myModal').hide();
	});

	function go_url(url)
	{
			if(url != '')   window.open(url,'_blank');

			//self.location.href=this.value
	}
});
