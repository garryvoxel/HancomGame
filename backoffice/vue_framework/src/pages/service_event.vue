<template>
    <div class="page-container">
        <!-- sidebar menu area start -->
        <main-menu />
        <!-- sidebar menu area end -->
        
        <!-- main content area start -->
        <service-event-list v-if="isCurrentPage('/typing/service/event/list')" />
        <service-event-write v-if="isCurrentPage('/typing/service/event/write')"/>
        <service-event-detail v-if="isCurrentPage('/typing/service/event/__id__/detail')"/>
        <!-- main content area end -->
    </div>
    <!-- page container area end -->
</template>    

<script>

import MainMenu from '@/components/MainMenu.vue';

import ServiceEventList from '@/components/ServiceEventList.vue';
import ServiceEventWrite from '@/components/ServiceEventWrite.vue';
import ServiceEventDetail from '@/components/ServiceEventDetail.vue';

export default {
    name: "event",
    components: {
        'main-menu': MainMenu
        ,'service-event-list': ServiceEventList
        ,'service-event-write': ServiceEventWrite
        ,'service-event-detail': ServiceEventDetail
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