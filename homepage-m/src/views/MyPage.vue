<template>
  <div class="page-container">
    <div id="mypage" class="page-wrapper page-mypage mypage">
      <Header/>
      <SideMenu />
      <section class="main-content">
        <header class="page-header">
          <h1 class="page-title">내타자정보</h1>
        </header>
        <div class="sub-wrap p-3">
          <ul class="nav-tabs">
            <li :class="tabName1">
              <div class="ico_03" v-on:click="tab1">내 정보</div>
            </li>
            <li :class="tabName2">
              <div class="ico_04" v-on:click="tab2">포인트</div>
            </li>
          </ul>
          <div v-if="activetab === 1">
            <MyInfo />
          </div>
          <div v-else>
            <MyPoint />
          </div>
        </div>
      </section>
      <Footer />
    </div>
  </div>
</template>

<script>
import Header from '@/components/Header.vue'
import SideMenu from "@/components/SideMenu.vue";
import Footer from "@/components/Footer.vue";
import MyInfo from "@/components/MyPage/MyInfo.vue";
import MyPoint from "@/components/MyPage/MyPoint.vue";
import { Z_BLOCK } from "zlib";

export default {
  name: "mypage",
  components: {
    Header,
    SideMenu,
    Footer,
    MyInfo,
    MyPoint
  },

  data() {
    return {
      show: false,
      activetab: 1,
      tabName1: "current w_50p",
      tabName2: "w_50p"
    };
  },

  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.$root.registerNicknameIfNotExist();
    });
  },

  methods: {
    tab1: function() {
      this.tabName1 = "current w_50p";
      this.tabName2 = "w_50p";
      this.activetab = 1;
    },

    tab2: function() {
      if (this.checkInfoChanged()) {
        this.tabName1 = "w_50p";
        this.tabName2 = "current w_50p";
        this.activetab = 2;
      }
    },
    block() {
      alert("서비스 준비중 입니다.");
    },

    checkInfoChanged() {
      if (localStorage.getItem("isSelected") === "Y") {
        if (!confirm("기본정보를 저장하지 않고 이동 하시겠습니까?")) {
          return false;
        } else {
          localStorage.setItem("isSelected", "N");
          return true;
        }
      } else {
        return true;
      }
    }
  }
};
</script>

<style>
</style>



<style>
.slide {
  transition: all 0.1s ease;
  padding-left: 15%;
}
.slide-enter-active {
  transition: all 0.1s ease;
}
.slide-leave-active {
  transition: all 0.1s ease;
}
.slide-enter,
.slide-leave-to {
  transform: translateX(10px);
}
</style>
