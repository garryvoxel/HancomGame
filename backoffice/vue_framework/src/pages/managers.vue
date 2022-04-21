<template>
    <div class="page-container">
        <!-- sidebar menu area start -->
        <main-menu />
        <!-- sidebar menu area end -->
        
        <!-- main content area start -->
        <managers-list v-if="isCurrentPage('/typing/managers/list')" />
        <managers-form v-if="isCurrentPage('/typing/managers/form')" />
        <managers-edit v-if="isCurrentPage('/typing/managers/__id__/edit')" />
        <managers-pwmodifyforce v-if="isCurrentPage('/typing/managers/pwmodifyforce')" />
        <!-- main content area end -->
    </div>
    <!-- page container area end -->
</template>    

<script>

import MainMenu from '@/components/MainMenu.vue';
import ManagerList from '@/components/ManagerList.vue';
import ManagerForm from '@/components/ManagerForm.vue';
import ManagerEdit from '@/components/ManagerEdit.vue';
import ManagerPwModify from '@/components/ManagerPwModify.vue';

export default {
    name: "managers",
    components: {
        'main-menu': MainMenu
        ,'managers-list': ManagerList
        ,'managers-form': ManagerForm
        ,'managers-edit': ManagerEdit
        ,'managers-pwmodifyforce': ManagerPwModify
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