<template>
    <div class="page-container">
        <!-- sidebar menu area start -->
        <main-menu />
        <!-- sidebar menu area end -->
        
        <!-- main content area start -->
        <service-clan-list v-if="isCurrentPage('/typing/service/clan/list')" />
        <service-clan-detail v-if="isCurrentPage('/typing/service/clan/__id__/detail')" />
        <service-clan-forum-detail v-if="isCurrentPage('/typing/service/clan/__id__/forumdetail')" />
        <!-- main content area end -->
    </div>
    <!-- page container area end -->
</template>    

<script>

import MainMenu from '@/components/MainMenu.vue';

import ServiceClanList from '@/components/ServiceClanList.vue';
import ServiceClanDetail from '@/components/ServiceClanDetail.vue';
import ServiceClanForumDetail from '@/components/ServiceClanForumDetail.vue';

export default {
    name: "clan",
    components: {
        'main-menu': MainMenu
        ,'service-clan-list': ServiceClanList
        ,'service-clan-detail': ServiceClanDetail
        ,'service-clan-forum-detail': ServiceClanForumDetail
    },
    methods: {
        isCurrentPage(page) {
            const
            pathUriArray = this.$route.path.split('/'),
            pageUriArray = page.split('/');
            
            var isSameUri = true,
            idIndex = 0,
            index = 0;

            idIndex = pageUriArray.indexOf('__id__');

            if(idIndex > 0) {
                for( var item in pageUriArray ) {
                    if(index === idIndex ) { index++; continue;}
                    if(pageUriArray[index] != pathUriArray[index]) isSameUri = false;
                    index++;       
                }
                return isSameUri;
            }

            //id 값을 가지는 페이지 인지 확인후 로직을 달리함.
            return this.$route.path === page;
        }
    },
    created(){
        require('es6-promise').polyfill();
    }
}
</script>