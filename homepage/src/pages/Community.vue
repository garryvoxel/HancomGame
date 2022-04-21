<template>
  <div id="community">
    <site-header />

    <!-- 본문영역 -->
    <section id="container">
      <div class="content-wrapper">
        <div class="contentService4">
          <!-- 타이틀 -->
          <h4 class="page_tit">{{ title }}</h4>
          <!-- location -->
          <div class="location">
            <ol>
              <li class="home">
                <router-link to="/" title="홈으로">
                  <img src="/images/icon_home.png" alt="홈으로" />
                </router-link>
              </li>
              <li class="on">
                <router-link :to="menu.uri" :title="menu.name">{{ menu.name }}</router-link>
              </li>

              <!-- 3rd depth -->
              <li v-if="['forum', 'news', 'events'].indexOf($route.name) != -1">{{ title }}</li>
              <li v-else-if="isClans()">
                <router-link :to="{ name: 'clans' }" :title="title">{{ title }}</router-link>
              </li>
              <li v-else-if="isForum()">
                <router-link :to="{ name: 'forum' }" :title="title">{{ title }}</router-link>
              </li>
              <li v-else-if="isFriends()">
                <router-link :to="{ name: 'friends' }" :title="title">{{ title }}</router-link>
              </li>
              <li v-else-if="isNews()">
                <router-link :to="{ name: 'news' }" :title="title">{{ title }}</router-link>
              </li>
              <li v-else-if="isEvents()">
                <router-link :to="{ name: 'events' }" :title="title">{{ title }}</router-link>
              </li>

              <!-- 4th depth -->
              <li v-if="$route.name === 'clans'">전체 클랜</li>
              <li v-else-if="$route.name === 'my-clan'">내 클랜</li>
              <li v-else-if="$route.name === 'clan-create'">클랜 만들기</li>
              <li v-else-if="$route.name === 'clan-view'">클랜 정보</li>
              <!-- <li v-else-if="$route.name === 'clan-forum'">클랜게시판</li> -->
              <li
                v-else-if="['clan-forum-view', 'clan-forum-edit'].indexOf($route.name) !== -1"
              >게시글 #{{ $route.params.id }}</li>
              <li v-else-if="$route.name === 'clan-forum-write'">글쓰기</li>
              <li
                v-else-if="['forum-view', 'forum-edit'].indexOf($route.name) !== -1"
              >게시글 #{{ $route.params.id }}</li>
              <li v-else-if="$route.name === 'friends'">친구목록</li>
              <li v-else-if="$route.name === 'friend-requests-received'">받은 친구 요청</li>
              <li v-else-if="$route.name === 'friend-requests-sent'">보낸 친구 요청</li>
              <li v-else-if="$route.name === 'news-view'">공지 #{{ $route.params.id }}</li>
              <li v-else-if="$route.name === 'event-view'">이벤트 #{{ $route.params.id }}</li>
            </ol>
          </div>
        </div>
        <div v-if="$route.name === 'forum'" class="forum-info">
          <ul>
            <li>욕설 및 비방과 같이 타인에게 불쾌감을 주는 게시물을 작성할 경우, 관리자에 의해 게시물이 삭제됩니다.</li>
            <li>신고 누적 횟수에 따라 글쓰기 일정기간 제한 및 계정 삭제가 될 수 있으니 유의하시기 바랍니다.</li>
          </ul>
        </div>
        <clan-view v-if="$route.name === 'clan-view'" />
        <my-clan v-else-if="$route.name === 'my-clan'" />
        <clan-form v-else-if="$route.name === 'clan-create'" />
        <clan-forum v-else-if="$route.name === 'clan-forum'" />
        <clan-forum-view v-else-if="$route.name === 'clan-forum-view'" />
        <clan-forum-write
          v-else-if="['clan-forum-write', 'clan-forum-edit'].indexOf($route.name) !== -1"
        />
        <forum v-else-if="$route.name === 'forum'" />
        <forum-write v-else-if="['forum-write', 'forum-edit'].indexOf($route.name) !== -1" />
        <forum-view v-else-if="$route.name === 'forum-view'" />
        <friends v-else-if="isFriends()" />
        <news v-else-if="$route.name === 'news'" />
        <news-view v-else-if="$route.name === 'news-view'" />
        <events v-else-if="$route.name === 'events'" />
        <event-view v-else-if="$route.name === 'event-view'" />
        <clan-list v-else />
      </div>
    </section>

    <site-footer />
  </div>
</template>

<script>
import ClanList from "../components/Community/Clans/ClanList.vue";
import ClanForm from "../components/Community/Clans/ClanForm.vue";
import ClanView from "../components/Community/Clans/ClanView.vue";
import MyClan from "../components/Community/Clans/MyClan.vue";
import ClanForum from "../components/Community/Clans/ClanForum.vue";
import ClanForumView from "../components/Community/Clans/ClanForumView.vue";
import ClanForumWrite from "../components/Community/Clans/ClanForumWrite.vue";
import Forum from "../components/Community/Forum/Forum.vue";
import ForumWrite from "../components/Community/Forum/ForumWrite.vue";
import ForumView from "../components/Community/Forum/ForumView.vue";
import Friends from "../components/Community/Friends/Friends.vue";
import News from "../components/Community/News/News.vue";
import NewsView from "../components/Community/News/NewsView.vue";
import Events from "../components/Community/Events/Events.vue";
import EventView from "../components/Community/Events/EventView.vue";

export default {
  name: "community",

  components: {
    "clan-list": ClanList,
    "clan-form": ClanForm,
    "clan-view": ClanView,
    "my-clan": MyClan,
    "clan-forum": ClanForum,
    "clan-forum-view": ClanForumView,
    "clan-forum-write": ClanForumWrite,
    forum: Forum,
    "forum-write": ForumWrite,
    "forum-view": ForumView,
    friends: Friends,
    news: News,
    "news-view": NewsView,
    events: Events,
    "event-view": EventView
  },

  data() {
    return {
      menu: this.$root.menu[this.$options.name],
      items: this.$root.menu[this.$options.name].children
    };
  },

  computed: {
    id() {
      return this.$route.params.id || "list";
    },
    title() {
      const community = this.$root.menu.community;

      if (this.isClans()) {
        return community.children.clans.name;
      } else if (this.isForum()) {
        return community.children.forum.name;
      } else if (this.isFriends()) {
        return community.children.friends.name;
      } else if (this.isNews()) {
        return community.children.news.name;
      } else if (this.isEvents()) {
        return community.children.events.name;
      } else {
        return community.name;
      }
    }
  },

  methods: {
    isClans() {
      return /^[/]community[/]clans[/]?.*$/.test(this.$route.path);
    },

    isForum() {
      return /^[/]community[/]forum[/]?.*$/.test(this.$route.path);
    },

    isFriends() {
      return /^[/]community[/]friends[/]?.*$/.test(this.$route.path);
    },

    isNews() {
      return /^[/]community[/]news[/]?.*$/.test(this.$route.path);
    },

    isEvents() {
      return /^[/]community[/]events[/]?.*$/.test(this.$route.path);
    }
  },

  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.$root.registerNicknameIfNotExist();
    });
  }
};
</script>
<style>
.forum-info ul {
  list-style: none;
  margin: 0;
  padding: 20px 25px;
  border: 1px solid #dcdcdc;
  background-color: #fdfdfd;
}
.forum-info li {
  position: relative;
  color: #f75259;
  padding-left: 1.2em;
  font-size: 1em;
  line-height: 1.5;
}
.forum-info li:before {
  content: "\f06a";
  position: absolute;
  left: 0;
  font-family: "FontAwesome";
}
.forum-info li + li {
  margin-top: 0.5em;
}
</style>
