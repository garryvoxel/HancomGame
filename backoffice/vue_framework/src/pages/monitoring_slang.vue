<template>
    <div class="page-container">
        <!-- sidebar menu area start -->
        <main-menu />
        <!-- sidebar menu area end -->
        
        <!-- main content area start -->
        <monitoring-slang-list v-if="isCurrentPage('/typing/monitoring/slang/list')" />
        <monitoring-slang-write v-if="isCurrentPage('/typing/monitoring/slang/write')" />
        <monitoring-slang-csvupload v-if="isCurrentPage('/typing/monitoring/slang/csvupload')" />
        <!-- main content area end -->
    </div>
    <!-- page container area end -->
</template>    

<script>

import MainMenu from '@/components/MainMenu.vue';
import MonitoringSlangList from '@/components/MonitoringSlangList.vue';
import MonitoringSlangWrite from '@/components/MonitoringSlangWrite.vue';
import MonitoringSlangCsvupload from '@/components/MonitoringSlangCsvupload.vue';

export default {
    name: "monitoringslang",
    components: {
        'main-menu': MainMenu
        ,'monitoring-slang-list': MonitoringSlangList
        ,'monitoring-slang-write': MonitoringSlangWrite
        ,'monitoring-slang-csvupload': MonitoringSlangCsvupload
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