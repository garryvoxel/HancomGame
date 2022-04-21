<template>
    <div class="page-container">
        <!-- sidebar menu area start -->
        <main-menu />
        <!-- sidebar menu area end -->
        
        <!-- main content area start -->
        <member-list v-if="isCurrentPage('/typing/member/member-management/list')" />
        <member-detail v-if="isCurrentPage('/typing/member/member-management/__id__/detail')" />
        <!-- main content area end -->
    </div>
    <!-- page container area end -->
</template>    

<script>

import MainMenu from '@/components/MainMenu.vue';
import MemberList from '@/components/MemberList.vue';
import MemberDetail from '@/components/MemberDetail.vue';

export default {
    name: "member",
    components: {
        'main-menu': MainMenu
        ,'member-list': MemberList
        ,'member-detail': MemberDetail
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