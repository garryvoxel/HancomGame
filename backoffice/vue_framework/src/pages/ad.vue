<template>
    <div class="page-container">
        <!-- sidebar menu area start -->
        <main-menu />
        <!-- sidebar menu area end -->
        
        <!-- main content area start -->
        <ad-list v-if="isCurrentPage('/typing/ad/ad-management/list')" />
        <ad-write v-if="isCurrentPage('/typing/ad/ad-management/write')" />
        <ad-detail v-if="isCurrentPage('/typing/ad/ad-management/__id__/detail')" />
        <!-- main content area end -->
    </div>
    <!-- page container area end -->
</template>    

<script>

import MainMenu from '@/components/MainMenu.vue';
import AdList from '@/components/AdList.vue';
import AdWrite from '@/components/AdWrite.vue';
import AdDetail from '@/components/AdDetail.vue';

export default {
    name: "ad",
    components: {
        'main-menu': MainMenu
        ,'ad-list': AdList
        ,'ad-write': AdWrite
        ,'ad-detail': AdDetail
    },
    methods: {
        isCurrentPage(page) {
            const
            pathUriArray = this.$route.path.split('/'),
            pageUriArray = page.split('/');
            
            var isSameUri = true,
            idIndex = 0,
            index = 0;

            //id 값을 가지는 페이지 인지 확인후 로직을 달리함.
            idIndex = pageUriArray.indexOf('__id__');

            if(idIndex > 0) {
                for( var item in pageUriArray ) {
                    if(index === idIndex ) { index++; continue;}
                    if(pageUriArray[index] != pathUriArray[index]) isSameUri = false;
                    index++;       
                }
                return isSameUri;
            }

            return this.$route.path === page;
        }
    },
    created(){
        require('es6-promise').polyfill();
    }
}
</script>