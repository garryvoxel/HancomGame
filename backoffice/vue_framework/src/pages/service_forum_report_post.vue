<template>
    <div class="page-container">
        <!-- sidebar menu area start -->
        <main-menu />
        <!-- sidebar menu area end -->
        
        <!-- main content area start -->
        <service-forum-list-post v-if="isCurrentPage('/typing/service/forum-report-post/list')" />
        <service-forum-detail-post v-if="isCurrentPage('/typing/service/forum-report-post/__id__/detail')"/>
        <!-- main content area end -->
    </div>
    <!-- page container area end -->
</template>    

<script>

import MainMenu from '@/components/MainMenu.vue';

import ServiceForumreportPostList from '@/components/ServiceForumreportPostList.vue';
import ServiceForumreportPostDetail from '@/components/ServiceForumreportPostDetail.vue';

export default {
    name: "serviceforumreportpost",
    components: {
        'main-menu': MainMenu
        ,'service-forum-list-post': ServiceForumreportPostList
        ,'service-forum-detail-post': ServiceForumreportPostDetail
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