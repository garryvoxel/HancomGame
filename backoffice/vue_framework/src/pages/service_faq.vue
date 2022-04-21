<template>
    <div class="page-container">
        <!-- sidebar menu area start -->
        <main-menu />
        <!-- sidebar menu area end -->
        
        <!-- main content area start -->
        <service-faq-list v-if="isCurrentPage('/typing/service/faq/list')" />
        <service-faq-write v-if="isCurrentPage('/typing/service/faq/write')"/>
        <service-faq-detail v-if="isCurrentPage('/typing/service/faq/__id__/detail')"/>
        <!-- main content area end -->
    </div>
    <!-- page container area end -->
</template>    

<script>

import MainMenu from '@/components/MainMenu.vue';

import ServiceFaqList from '@/components/ServiceFaqList.vue';
import ServiceFaqWrite from '@/components/ServiceFaqWrite.vue';
import ServiceFaqDetail from '@/components/ServiceFaqDetail.vue';

export default {
    name: "faq",
    components: {
        'main-menu': MainMenu
        ,'service-faq-list': ServiceFaqList
        ,'service-faq-write': ServiceFaqWrite
        ,'service-faq-detail': ServiceFaqDetail
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