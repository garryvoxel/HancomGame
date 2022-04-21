<template>
    <div class="page-container">
        <!-- sidebar menu area start -->
        <main-menu />
        <!-- sidebar menu area end -->
        
        <!-- main content area start -->
        <service-forum-accusation-list v-if="isCurrentPage('/typing/service/accusation/list')" />
        <service-forum-accusation-detail v-if="isCurrentPage('/typing/service/accusation/__id__/detail')"/>
        <!-- main content area end -->
    </div>
    <!-- page container area end -->
</template>    

<script>

import MainMenu from '@/components/MainMenu.vue';

import ServiceForumAccusationList from '@/components/ServiceForumAccusationList.vue';
import ServiceForumAccusationDetail from '@/components/ServiceForumAccusationDetail.vue';

export default {
    name: "serviceforumaccusation",
    components: {
        'main-menu': MainMenu
        ,'service-forum-accusation-list': ServiceForumAccusationList
        ,'service-forum-accusation-detail': ServiceForumAccusationDetail
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