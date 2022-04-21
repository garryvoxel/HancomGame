<template>
    <div class="page-container">
        <!-- sidebar menu area start -->
        <main-menu />
        <!-- sidebar menu area end -->
        
        <!-- main content area start -->
        <content-typing-index v-if="isCurrentPage('/typing/content/typing/index')" />
        <content-typing-article-csvupload v-if="isCurrentPage('/typing/content/typing/article_csvupload')" />
        <!-- main content area end -->
    </div>
    <!-- page container area end -->
</template>    

<script>

import MainMenu from '@/components/MainMenu.vue';
import ContentTypingIndex from '@/components/ContentTypingIndex.vue';
import ContentTypingArticleCsvUpload from '@/components/ContentTypingArticleCsvUpload.vue';

export default {
    name: "contenttyping",
    components: {
        'main-menu': MainMenu
        ,'content-typing-index': ContentTypingIndex
        ,'content-typing-article-csvupload': ContentTypingArticleCsvUpload
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