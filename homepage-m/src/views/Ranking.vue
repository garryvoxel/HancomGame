<template>
    <div class="page-container">
        <div class="page-wrapper page-ranking ranking">
            <Header/>
            <SideMenu />
            <section class="main-content">
                <header class="page-header">
                  <h1 class="page-title">클랜</h1>
                </header>
                <RakingCoin/>
            </section>
            <Footer/>
        </div>
    </div>
</template>

<script>
import Header from '@/components/Header.vue'
import SideMenu from '@/components/SideMenu.vue'
import Footer from '@/components/Footer.vue'

export default {
  components: {
    Header,
    SideMenu,
    Footer,
  }
}
</script>
