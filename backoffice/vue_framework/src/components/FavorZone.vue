<template>
    <div class="favor-zone">
        <ul>
        <li class="favor-tit"><i class="ti-star"></i> 즐겨찾기</li>
        <li class="favor-tab" v-for="(favor, index) in favorZoneList" :alt="favor.link_url"><a :href="favor.link_url">{{favor.title}}
            <i class="ti-close" v-on:click.prevent="delFavor(favor.id)"></i></a>
        </li>
        </ul>
    </div>
</template>

<script>

import ResponseCode from "@/utils/response_code";

export default { 
    name: "favorZone",   
    data(){
        return {
            favorZoneList: []
        }
    }, 
    methods: {
        updateFavorZone(){
            this.getFaverZoneList();
        },
        getFaverZoneList(){
            this.$axios
                .get('/typing/api/favorlinks/list')
                .then(response=>{
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

                            case ResponseCode.NO_AUTHORITY.code:
                                alert('해당 페이지에 접근할 권한이 없습니다.');
                                return;
                                break;

                            case ResponseCode.PASSWORDEXPIRE.code:
                                return;
                                break;
                                
                            case ResponseCode.OK.code:
                                this.favorZoneList =           response.data.result;
                                break;

                            default:
                                alert(
                                    "관리자의 즐겨찾기 목록을 가져오는데 실패 했습니다.\n다시 시도해 주세요.\n"
                                    +response.data.code+ "::" +response.data.message
                                );
                        } //switch

                    } //if else   
                })
        },

        delFavor(favorlink_id){
            if(confirm('해당 즐겨찾기를 삭제 하시겠습니까?')) {
            this.$axios
                .post('/typing/api/favorlinks/del', {
                    id: favorlink_id
                })
                .then(response=>{
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

                            case ResponseCode.NO_AUTHORITY.code:
                                alert('해당 페이지에 접근할 권한이 없습니다.');
                                return;
                                break;

                            case ResponseCode.PASSWORDEXPIRE.code:
                                return;
                                break;
                                
                            case ResponseCode.OK.code:
                                //alert(JSON.stringify(response.data.result));
                                this.updateFavorZone();
                                break;
                            default:
                                alert(
                                    "즐겨찾기 삭제에 실패 했습니다.\n다시 시도해 주세요.\n"
                                    +response.data.code+ "::" +response.data.message
                                );
                        } //switch

                    } //if else   
                })
            }
        }
    },
    created() {
        this.getFaverZoneList();
    }
}
</script>