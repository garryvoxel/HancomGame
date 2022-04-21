import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import GameCoin from './components/Game/GameCoin.vue'
import GameMoles from './components/Game/GameMoles.vue'
import RankingCoin from './components/Ranking/RankingCoin.vue'
import RankingMoles from './components/Ranking/RankingMoles.vue'
import Support from './views/Support.vue'

import MyPage from './views/MyPage.vue'
import Nick from './components/MyPage/Nick.vue'

import EventList from './components/Community/Event/EventList.vue'
import EventView from './components/Community/Event/EventView.vue'

import FreeList from './components/Community/Free/FreeList.vue'
import FreeView from './components/Community/Free/FreeView.vue'
import FreeWrite from './components/Community/Free/FreeWrite.vue'


import FriendList from './components/Community/Friends/FriendList.vue'
import FriendReq from './components/Community/Friends/FriendReq.vue'
import FriendRes from './components/Community/Friends/FriendRes.vue'
import FriendSearch from './components/Community/Friends/FriendSearch.vue'

import NotiList from './components/Community/Notice/NotiList.vue'
import NotiView from './components/Community/Notice/NotiView.vue'


import ClanTotal from './components/Community/Clan/ClanTotal.vue'
import ClanMy from './components/Community/Clan/ClanMy.vue'
import ClanMake from './components/Community/Clan/ClanMake.vue'
import ClanBoard from './components/Community/Clan/ClanBoard.vue'
import ClanWrite from './components/Community/Clan/ClanWrite.vue'
import ClanBoardView from './components/Community/Clan/ClanBoardView.vue'
import ClanInfo from './components/Community/Clan/ClanInfo.vue'


import Sample from './components/Sample.vue'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    { name: 'home', path: '/', component: Home, titlename: '홈' },
    { name: 'support', path: '/support', component: Support, titlename: '고객지원' },
    { name: 'gamecoin', path: '/game/coin', component: GameCoin, titlename: '동전쌓기' },
    { name: 'gamemoles',path: '/game/moles', component: GameMoles, titlename: '두더지잡기' },
    
    { name: 'rankingcoinpersonal', path: '/ranking/coin', component: Home, titlename: '랭킹' ,children:[
      // { path: 'personal', name: 'ranking-piling-coins-personal', component: RankingCoin },
      // { path: 'school', name: 'ranking-piling-coins-school', component: RankingCoin }
    ]},
    { name: 'rakingmolespersonal', path: '/ranking/moles', component: Home, titlename: '랭킹', children:[
      // { path: 'personal', name: 'ranking-catching-moles-personal', component: RankingMoles },
      // { path: 'school', name: 'ranking-catching-moles-school', component: RankingMoles }
    ] },
    { name: 'mypage', path: '/mypage', component: MyPage, titlename: '마이페이지', },
    { name: 'nick', path: '/mypage/register-nickname', component: Nick, titlename: '회원가입' },
    { name: 'event', path: '/event', component: EventList, titlename: '이벤트' },
    { name: 'eventview', path: '/event/view/:id(\\d+)', component: EventView, titlename: '이벤트' },
    { name: 'freelist', path: '/free', component: FreeList, titlename: '자유게시판' },
    { name: 'freeview', path: '/free/view/:id(\\d+)', component: FreeView, titlename: '자유게시판' },
    { name: 'freewrite', path: '/free/write', component: FreeWrite, titlename: '자유게시판' },
    { name: 'friendslist', path: '/friends/list', component: FriendList, titlename: '친구관리' },
    { name: 'friendsres', path: '/friends/res', component: FriendRes, titlename: '친구관리' },
    { name: 'friendsreq', path: '/friends/req', component: FriendReq, titlename: '친구관리' },
    { name: 'friendssearch', path: '/friends/Search', component: FriendSearch, titlename: '친구관리'},
    { name: 'notice', path: '/notice', component: NotiList, titlename: '공지사항' },
    { name: 'noticeview', path: '/notice/view/:id(\\d+)', component: NotiView, titlename: '공지사항' },
    { name: 'clantotal', path: '/clan', component: ClanTotal, titlename: '전체클랜' },
    { name: 'clanInfo', path: '/clan/:id(\\d+)', component: ClanInfo, titlename: '클랜정보' },
    { name: 'clanmy', path: '/clan/my', component: ClanMy, titlename: '마이클랜' },
    { name: 'clanmake', path: '/clan/make', component: ClanMake, titlename: '클랜만들기' },
    { name: 'clanboard', path: '/clan/board', component: Home, titlename: '클랜게시판' },
    { name: 'clanboardview', path: '/clan/board/view/:id(\\d+)', component: Home, titlename: '클랜게시판' },
    { name: 'sample', path: '/sample', component: Sample, titlename: '샘플페이지' },
    { name: 'clanwrite', path: '/clan/board/write', component: Home, titlename: '클랜게시판' },
    { path: '*', redirect: '/' }, // catch all use case
  ]
})
router.beforeEach((to,from,next) =>{
  if(localStorage.getItem("isSelected")==='Y'){
    if(!confirm("기본정보를 저장하지 않고 이동 하시겠습니까?")){
      localStorage.setItem("rouetr_state","N");
      next(false);
      return;
    }else{
          localStorage.setItem("isSelected","N");
          localStorage.setItem("rouetr_state","Y");
          next();
    }

  }
  else{
    next();
  }  
  next();
})
export default router;
