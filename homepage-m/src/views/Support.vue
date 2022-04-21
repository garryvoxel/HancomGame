<template>
    <div class="page-container">
        <div class="page-wrapper page-support support">
            <Header/>
            <SideMenu />
            <section class="main-content">
                <header class="page-header">
                    <h1 class="page-title">고객센터</h1>
                </header>
                <div class="sub-wrap p-3">
                    <div class="faq_tit mt_30">
                        <ul>
                            <li>자주 묻는 질문</li>
                        </ul>
                    </div>
                    <SupportList/>
                </div>
            </section>
            <Footer/>
        </div>
    </div>
</template>

<script>
import Header from '@/components/Header.vue'
import SideMenu from '@/components/SideMenu.vue'
import Footer from '@/components/Footer.vue'
import Result from "../utils/result";
import SupportList from '@/components/SupportList.vue'

export default {  
    
    components: {
        Header,
        SideMenu,
        Footer,
        SupportList
    },

    mounted(){
        
        this.$nextTick( function() {
            $( "#accordion" ).accordion({
                heightStyle: "content"
            });
        });  
    }
}
</script>

<style>
.layer1 {
    margin: 0;
    padding: 0;
    width: 100%;
    background-color: #ffffff;
}

.heading {
    margin: 1px;
    padding: 3px 10px;
    cursor: pointer;
    position: relative;
    font-size: 15px;

    background: url(/imgs/faq_q.png) 20px 50% no-repeat;
    padding-left: 50px;
    line-height: 26px;
    display: block;
    font-size: 14px;
}

.content {
    padding: 5px 10px 5px 50px;
    background: url(/imgs/faq_a.png) 20px 50% no-repeat;
    background-color: #ececec;
}

</style>
