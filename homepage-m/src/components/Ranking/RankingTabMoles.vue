<template>
    <div>
      <div class="sub-wrap p-3">
        <div style="text-align : center; margin-bottom : 10px; font-size : 20px">두더지잡기</div>
        <div style="text-align: center;font-size: 12px;padding-bottom: 10px;">
          실시간 개인랭킹과 학교랭킹은 하루 기준으로 랭킹에 등재되며,
          <br> 익일 00:00시를 기준으로 초기화됩니다. 
          <br>초기화 이후에는 게임을 플레이 하셔야 랭킹 데이터가 생성됩니다.
        </div>
        <ul class="nav-tabs">
          <li :class="tabName1">
              <div class="ico_01" v-on:click="tab(1)">개인 순위</div>
          </li>
          <li :class="tabName2">
              <div class="ico_02" v-on:click='tab(2)'>학교 순위</div>
          </li>
        </ul>
        <div v-if="activetab === 1">
            <RankingBoardMolesP/>
        </div>
        <div v-else>
            <RankingBoardMolesS/>
        </div>
      </div>
    </div>    
</template>

<script>
import RankingBoardMolesP from '@/components/Ranking/RankingBoardMolesP.vue'
import RankingBoardMolesS from '@/components/Ranking/RankingBoardMolesS.vue'

export default {
  components: {
    RankingBoardMolesP,
    RankingBoardMolesS
  },

  data(){
    return{
      show : false,
      activetab : 1,
      tabName1 : 'current w_50p',
      tabName2 : 'w_50p'
    }
  },

  methods:{
    tab: function (tabNum) {
      if(tabNum === 1){
        this.tabName1 = 'current w_50p';
        this.tabName2 = 'w_50p';
        this.activetab = 1;
        this.$router.push({name : 'ranking-catching-moles-personal'})
      }else{
        this.tabName1 = 'w_50p';
        this.tabName2 = 'current w_50p'
        this.activetab = 2;
        this.$router.push({name : 'ranking-catching-moles-school'})
      }  
    },
      block(){
      alert("서비스 준비중 입니다.");
    },
  }
}
</script>

<style>

</style>
