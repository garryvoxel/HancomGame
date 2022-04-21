import Vue from 'vue';
import Router from 'vue-router';
import WebConfig from '../config/web.config';
import Home from './pages/Home.vue';
import TypingPractice from './pages/TypingPractice.vue';
import Game from './pages/Game.vue';
import Ranking from './pages/Ranking.vue';
import Community from './pages/Community.vue';
import Support from './pages/Support.vue';
import MyPage from './pages/MyPage';
import Stats from './components/Mypage/Stats.vue';
import VueExample from './components/VueExample.vue';

Vue.use(Router);

const router = new Router({
  mode: 'history',
  routes: [
    { path: '/', name: 'home', component: Home },

    /**
     * 한컴 타자연습
     * + 자리연습
     * + 낱말연습
     * + 짧은글연습
     * + 긴글연습
     */
    { path: '/typing-practice', redirect: { name: 'learning-key-placements' } },
    {
      path: '/typing-practice/learning-key-placements',
      name: 'learning-key-placements',
      component: TypingPractice,
    },
    {
      path: '/typing-practice/exercising-words-typing',
      name: 'exercising-words-typing',
      component: TypingPractice,
    },
    {
      path: '/typing-practice/exercising-sentence-typing',
      name: 'exercising-sentence-typing',
      component: TypingPractice,
    },
    {
      path: '/typing-practice/exercising-writing-typing',
      name: 'exercising-writing-typing',
      component: TypingPractice,
    },

    /**
     * 게임
     * + 두더지잡기
     * + 동전쌓기
     * + 판 뒤집기
     */
    { path: '/games', redirect: { name: 'catching-moles' } },
    { path: '/games/catching-moles', name: 'catching-moles', component: Game },
    { path: '/games/piling-coins', name: 'piling-coins', component: Game },
    { path: '/games/flipping-cards', name: 'flipping-cards', component: Game },

    /**
     * 게임랭킹
     * + 한컴 타자연습
     * + 두더지잡기
     * + 동전쌓기
     * + 판 뒤집기
     */
    { path: '/rankings', redirect: '/rankings/typing-practice' },
    {
      path: '/rankings/typing-practice',
      redirect: '/rankings/typing-practice/personal',
      name: 'ranking-typing-practice',
      component: Ranking,
      children: [
        {
          path: 'personal',
          name: 'ranking-typing-practice-personal',
          component: Ranking,
        },
        {
          path: 'school',
          name: 'ranking-typing-practice-school',
          component: Ranking,
        },
      ],
    },

    {
      path: '/rankings/catching-moles',
      redirect: '/rankings/catching-moles/personal',
    },
    {
      path: '/rankings/catching-moles',
      name: 'ranking-catching-moles',
      component: Ranking,
      children: [
        {
          path: 'personal',
          name: 'ranking-catching-moles-personal',
          component: Ranking,
        },
        {
          path: 'school',
          name: 'ranking-catching-moles-school',
          component: Ranking,
        },
      ],
    },
    // { path: '/rankings', redirect: '/rankings/piling-coins' },
    {
      path: '/rankings/piling-coins',
      redirect: '/rankings/piling-coins/personal',
    },
    {
      path: '/rankings/piling-coins',
      name: 'ranking-piling-coins',
      component: Ranking,
      children: [
        {
          path: 'personal',
          name: 'ranking-piling-coins-personal',
          component: Ranking,
        },
        {
          path: 'school',
          name: 'ranking-piling-coins-school',
          component: Ranking,
        },
      ],
    },
    // { path: '/rankings', redirect: '/rankings/flipping-cards' },
    {
      path: '/rankings/flipping-cards',
      redirect: '/rankings/flipping-cards/personal',
    },
    {
      path: '/rankings/flipping-cards',
      name: 'ranking-flipping-cards',
      component: Ranking,
      children: [
        {
          path: 'personal',
          name: 'ranking-flipping-cards-personal',
          component: Ranking,
        },
        {
          path: 'school',
          name: 'ranking-flipping-cards-school',
          component: Ranking,
        },
      ],
    },

    { path: '/community', redirect: '/community/news' },
    {
      path: '/community/clans',
      name: 'clans',
      component: Community,
      children: [
        {
          path: 'my',
          name: 'my-clan',
          component: Community,
          children: [
            {
              path: 'forum',
              name: 'clan-forum',
              component: Home,
              beforeEnter: authenticate,
            },
            {
              path: 'write',
              name: 'clan-forum-write',
              component: Home,
              beforeEnter: authenticate,
            },
            {
              path: ':id(\\d+)',
              name: 'clan-forum-view',
              component: Home,
              beforeEnter: authenticate,
            },
            {
              path: ':id(\\d+)/edit',
              name: 'clan-forum-edit',
              component: Home,
              beforeEnter: authenticate,
            },
          ],
        },
        { path: 'create', name: 'clan-create', component: Community },
        { path: ':id(\\d+)', name: 'clan-view', component: Community },
      ],
    },

    /**
     * 커뮤니티 > 자유게시판
     * + 글쓰기
     * + 글보기
     * + 글편집
     */
    {
      path: '/community/forum',
      name: 'forum',
      component: Community,
      children: [
        {
          path: 'write',
          name: 'forum-write',
          component: Community,
          beforeEnter: authenticate,
        },
        { path: ':id(\\d+)', name: 'forum-view', component: Community },
        { path: ':id(\\d+)/edit', name: 'forum-edit', component: Community },
      ],
    },

    /**
     * 커뮤니티 > 친구관리 > 친구목록
     * + 받은 친구 요청
     * + 보낸 친구 요청
     */
    {
      path: '/community/friends',
      name: 'friends',
      component: Community,
      children: [
        {
          path: 'friend-requests-received',
          name: 'friend-requests-received',
          component: Community,
          beforeEnter: authenticate,
        },
        {
          path: 'friend-requests-sent',
          name: 'friend-requests-sent',
          component: Community,
          beforeEnter: authenticate,
        },
      ],
    },

    /**
     * 커뮤니티 > 공지사항
     * + 공지 보기
     */
    {
      path: '/community/news',
      name: 'news',
      component: Community,
      children: [
        { path: ':id(\\d+)', name: 'news-view', component: Community },
      ],
    },

    /**
     * 커뮤니티 > 이벤트
     * + 이벤트 보기
     */
    {
      path: '/community/events',
      name: 'events',
      component: Community,
      children: [
        { path: ':id(\\d+)', name: 'event-view', component: Community },
      ],
    },

    /**
     * 고객센터
     * + FAQ
     * + 문의하기 - 문의하기는 외부 URL로 연결함. GNB에서 예외처리.
     */
    { path: '/support', redirect: { name: 'faq' } },
    { path: '/support/faq', name: 'faq', component: Support },

    /**
     * 마이페이지
     * + 닉네임 등록
     * + 내 정보
     * + 포인트
     * + 통계
     */
    { path: '/mypage', redirect: { name: 'basic-info' } },
    {
      path: '/mypage/register-nickname',
      name: 'register-nickname',
      component: MyPage,
      beforeEnter: authenticate,
    },
    {
      path: '/mypage/basic-info',
      name: 'basic-info',
      component: MyPage,
      beforeEnter: authenticate,
    },
    {
      path: '/mypage/points',
      name: 'points',
      component: MyPage,
      beforeEnter: authenticate,
    },

    {
      path: '/mypage/stats',
      name: 'stats',
      component: MyPage,
      beforeEnter: authenticate,
      children: [
        {
          path: 'typing-speed',
          name: 'typing-speed',
          component: MyPage,
          beforeEnter: authenticate,
        },
        {
          path: 'typing-velocity',
          name: 'typing-velocity',
          component: MyPage,
          beforeEnter: authenticate,
        },
        {
          path: 'finger-speed',
          name: 'finger-speed',
          component: MyPage,
          beforeEnter: authenticate,
        },
        {
          path: 'typing-acc',
          name: 'typing-acc',
          component: MyPage,
          beforeEnter: authenticate,
        },
        {
          path: 'typing-total',
          name: 'typing-total',
          component: MyPage,
          beforeEnter: authenticate,
        },
      ],
    },

    /**
     * 404 Not found
     */
    { path: '*', redirect: '/' },
    { path: '/example', name: 'example', component: VueExample },
  ],
});

router.beforeEach((to, from, next) => {
  if (localStorage.getItem('isSelected') === 'Y') {
    if (!confirm('기본정보를 저장하지 않고 이동 하시겠습니까?')) {
      return;
    } else {
      localStorage.setItem('isSelected', 'N');
      next();
    }
  } else {
    next();
  }

  next();
});

function authenticate(to, from, next) {
  if (WebConfig.environment === 'test') {
    next();
    return;
  }

  if (!Vue.cookie.get('session_id')) {
    var site = window.location.host;
    var URL = '';

    if (site.indexOf('localhost') != -1) {
      URL = encodeURIComponent(window.location.href); //local
    } else if (site.indexOf('dev-') != -1) {
      URL = encodeURIComponent('https://dev-typing.malangmalang.com'); //dev
    } else if (site.indexOf('stg-') != -1) {
      URL = encodeURIComponent('https://stg-typing.malangmalang.com'); //stg
    } else {
      URL = encodeURIComponent('https://typing.malangmalang.com'); //live
    }

    window.location.href =
      WebConfig.malangmalangLinks.login.uri + '?redirect=' + URL;
    return;
  }

  next();
}

// function sendLog(num){
//     this.$axios
//     .post(
//         this.$Api.logs,
//         {
//             menu_type : num
//         },
//         this.$root.bearerHeaders()
//     )
//     .then(response => {
//         console.log(response.data);
//         if (!response || response.data.code !== Result.OK.code) {
//             return;
//         }
//     })
//     .catch(error => {
//         console.log(error);
//     });
// }

export default router;
