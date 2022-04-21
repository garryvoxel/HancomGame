<template>
    <div class="page-container">
        <div class="page-wrapper page-community clan">
            <Header/>
            <SideMenu />
            <section class="main-content">
                <header class="page-header">
                    <h1 class="page-title">클랜</h1>
                </header>
                <div class="sub-wrap p-3">
                    <ul class="nav-tabs1">
                        <li :class="tabName1" @click="tab1"><div>전체클랜<span>50</span></div></li>
                        <li :class="tabName2" @click="tab2"><div>내 클랜<span>50</span></div></li>
                        <li :class="tabName3" @click="tab3"><div>클랜만들기<span>50</span></div></li>
                    </ul>
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
import ClanTotal from '@/components/Community/Clan/ClanTotal.vue'
import ClanMy from '@/components/Community/Clan/ClanMy.vue'
import ClanMake from '@/components/Community/Clan/ClanMake.vue'


export default {
    components: {
        Header,
        SideMenu,
        Footer,
        ClanTotal,
        ClanMy,
        ClanMake
    },

    data(){
        return{
            show : false,
            activetab : 'tab1',
            tabName1 : 'current ',
            tabName2 : '',
            tabName3 : '',
            title : ''
        }
    },

    methods:{
        tab1: function () {
            this.tabName1 = 'current';
            this.tabName2 = '';
            this.tabName3 = '';
            this.activetab = 'tab1';
        },

        tab2: function () {
            this.tabName1 = '';
            this.tabName2 = 'current';
            this.tabName3 = '';
            this.activetab = 'tab2';
        },

        tab3: function () {
            this.tabName1 = '';
            this.tabName2 = '';
            this.tabName3 = 'current';
            this.activetab = 'tab3';

        },

        getTitle: function () {
            // console.log(this.$route[]) ;
        }
    },

    computed: {
        page() {
            return this.$route.query.page || 1;
        },

        
    },
}
</script>
