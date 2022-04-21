<template>
    <div class="page-title-area">
        <div class="row align-items-center">
            <div class="col-sm-12">
                <div class="breadcrumbs-area clearfix">
                    <h2 class="page-title pull-left">{{ pageTitle }}</h2>
                    <ul class="tit-btn pull-left">
                        <li><a class="bookmk" v-on:click="addFavorLink" style="cursor:pointer"><i class="ti-bookmark"></i> 즐겨찾기 추가</a></li>
                        <li><a v-on:click.prevent="newWinOpen"  style="cursor:pointer"><i class="ti-new-window"></i> 새창보기</a></li>
                    </ul>
                    <ul class="breadcrumbs pull-right">
                        <li><a href="/typing/service/news/list"><i class="ti-location-pin"></i> 홈</a></li>
                        <li><span>{{ pageTitle }}</span></li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import ResponseCode from "@/utils/response_code";

export default {
    name: "pageTitleArea",
    data(){
        return {
            pageTitle: ''
            , subTitle: ''
        }
    },
    methods: {
        changeTitleString(){
            let urlArr = this.$route.path.split('/');
            // 페이지 제목
            switch(urlArr[2]){
                case 'managers' : this.pageTitle = '관리자관리'; break;
                case 'service' : this.pageTitle = '서비스관리'; break;
                case 'content' : this.pageTitle = '콘텐츠관리'; break;
                case 'ad' : this.pageTitle = '광고관리'; break;
                case 'member' : this.pageTitle = '회원관리'; break;
                case 'point' : this.pageTitle = '포인트'; break;
                case 'monitoring' : this.pageTitle = '모니터링'; break;
                case 'statistics' : this.pageTitle = '통계'; break;
                default: this.pageTitle = '--';
            }
        },
        addFavorLink(){
            var prompStr = prompt( '즐겨찾기의 이름을 입력해 주세요', '' );
            if(prompStr == '' || prompStr == null) {alert('즐겨찾기의 이름이 입력되지 않았습니다. 다시 시도해 주세요'); reutrn ;}

            if(confirm('현재 페이지를 \''+prompStr+'\'로 즐겨찾기에 등록 하시겠습니까?')) {
                this.$axios
                    .post('/typing/api/favorlinks/add',{
                        link_url: this.$route.path
                        ,favor_title: prompStr
                    })
                    .then(response=>{
//
                    if (typeof response == "undefined") {
                        alert(
                            "서버와 통신이 원활하지 않습니다.\n잠시후 다시 시도해 주세요."
                        );
                        return;
                    } else {
                        switch (response.data.code) {
                            case ResponseCode.UNAUTHORIZED.code:
                                this.$root.deleteCookieNGoToLogin();
                                break;
                                
                            case ResponseCode.DUP_CONTENT.code:
                                alert('이미 즐겨 찾기에 등록된 페이지 입니다.');
                                break;

                            case ResponseCode.OK.code:
                                this.$parent.updateFavor();
                                break;

                            default:
                                alert(
                                    "즐겨찾기 등록에 실패 했습니다.\n다시 시도해 주세요.\n"
                                    +response.data.code+ "::" +response.data.message
                                );
                        } //switch

                    } //if else   
//                        
                        
                    })
                
            }
            
        },
        newWinOpen(){
            window.open(this.$route.path, '_blank');
        }
    },
    created() {
        this.changeTitleString();
    }
}
</script>