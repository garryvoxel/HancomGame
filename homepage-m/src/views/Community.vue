<template>
    <div id="community">
        <site-header/>

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
                                    <img src="/images/icon_home.png" alt="홈으로">
                                </router-link>
                            </li>
                            <li class="on">
                                <router-link :to="menu.uri" :title="menu.name">{{ menu.name }}</router-link>
                            </li>

                            <!-- 3rd depth -->
                            <li
                                v-if="['forum', 'news', 'events'].indexOf($route.name) != -1"
                            >{{ title }}</li>
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
                            <li v-else>
                                <router-link
                                    :to="items[page].uri"
                                    :title="items[page].name"
                                >{{ items[page].name }}</router-link>
                            </li>

                            <!-- 4th depth -->
                            <!-- <li v-if="isClanCreate()">클랜 만들기</li> -->
                            <!-- <li v-else-if="isCurrentPage('clans', /[0-9]+/)">클랜 정보</li> -->
                            <li v-if="$route.name === 'clans'">전체 클랜</li>
                            <li v-else-if="$route.name === 'my-clan'">내 클랜</li>
                            <li v-else-if="$route.name === 'clan-view'">클랜 정보</li>
                            <li v-else-if="$route.name === 'forum-write'">글쓰기</li>
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

                <!-- <clan-form v-if="isClanCreate()"/> -->
                <!-- <clan-view v-else-if="isCurrentPage('clans', /[0-9]+/)" /> -->
                <clan-view v-if="$route.name === 'clan-view'"/>
                <forum v-else-if="$route.name === 'forum'"/>
                <forum-write v-else-if="['forum-write', 'forum-edit'].indexOf($route.name) !== -1"/>
                <forum-view v-else-if="$route.name === 'forum-view'"/>
                <friends v-else-if="isFriends()"/>
                <news v-else-if="$route.name === 'news'"/>
                <news-view v-else-if="$route.name === 'news-view'"/>
                <events v-else-if="$route.name === 'events'"/>
                <event-view v-else-if="$route.name === 'event-view'"/>
                <clan-list v-else/>
            </div>
        </section>

        <site-footer/>
    </div>
</template>

<script>
import ClanList from "../components/Community/Clans/ClanList.vue";
import ClanForm from "../components/Community/Clans/ClanForm.vue";
import ClanView from "../components/Community/Clans/ClanView.vue";
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
        page() {
            return this.$route.params.page || "clans";
        },

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