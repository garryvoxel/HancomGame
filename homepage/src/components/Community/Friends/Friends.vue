<template>
    <div id="friend-list">
        <nav class="tab-rounded">
            <ul>
                <li :class="{ selected : $route.name === RouteName.Friends }">
                    <router-link :to="{ name: RouteName.Friends }" title="친구목록">
                        <span class="tab-icon person"></span>
                        <span>친구목록 {{ friends.length }}</span>
                    </router-link>
                </li>
                <li :class="{ selected : $route.name === RouteName.FriendRequestsReceived }">
                    <router-link :to="{ name: RouteName.FriendRequestsReceived }" title="받은 친구 요청">
                        <span id="icon-points" class="tab-icon inbound"></span>
                        <span>받은 친구 요청 {{ friendRequestsReceived.length }}</span>
                    </router-link>
                </li>
                <li :class="{ selected : $route.name === RouteName.FriendRequestsSent }">
                    <router-link :to="{ name: RouteName.FriendRequestsSent }" title="보낸 친구 요청">
                        <span id="icon-stats" class="tab-icon outbound"></span>
                        <span>보낸 친구 요청 {{ friendRequestsSent.length }}</span>
                    </router-link>
                </li>
            </ul>
        </nav>

        <div>
            <ul class="friend-list-container" v-if="alert">
                <li class="no-friends">{{ alert }}</li>
            </ul>

            <friend-list
                :friends="friends"
                @alert="setAlert"
                v-else-if="$route.name === RouteName.Friends"
            />

            <friend-requests-received
                :friends="friends"
                :friendRequestsReceived="friendRequestsReceived"
                @alert="setAlert"
                v-else-if="$route.name === RouteName.FriendRequestsReceived"
            />

            <friend-requests-sent
                :friendRequestsSent="friendRequestsSent"
                @alert="setAlert"
                v-else-if="$route.name === RouteName.FriendRequestsSent"
            />

            <div class="friend-list-search">
                <button @click="openModal()" class="button-rounded-red-icon-search">친구찾기</button>
            </div>

            <!-- <pagination :current="page" :totalCount="itemCount"/> -->
        </div>

        <modal v-if="showModal" @close="showModal = false">
            <h3 slot="header">닉네임으로 친구 찾기</h3>

            <div slot="body" class="search-friends-body">
                <div class="search-friends-container">
                    <form @submit.prevent="findFriend">
                        <input
                            type="text"
                            class="input-search"
                            placeholder="닉네임으로 검색"
                            v-model="nickname"
                        >
                        <button class="button-search"></button>
                    </form>
                </div>
                <ul class="candidate-list" v-if="searchedFriend">
                    <li class="user-listitem">
                        <div class="avatar-wrapper">
                            <avatar-image :index="searchedFriend.avatar"/>
                        </div>
                        <div class="user-info-container">
                            <div class="user-nickname">{{ searchedFriend.nickname }}</div>
                            <div
                                class="user-clan"
                                v-if="searchedFriend.clan"
                            >{{ searchedFriend.clan.name }}</div>
                        </div>
                        <div class="user-action-wrapper">
                            <button
                                class="button-rounded-navy"
                                @click="sendFriendRequest(searchedFriend.nickname)"
                                v-if="! isCompletedSentFriendRequest"
                            >친구 요청</button>
                            <span class="icon-check" v-if="isCompletedSentFriendRequest">친구 요청 완료</span>
                        </div>
                    </li>
                </ul>
                <p class="alert" v-if="modalAlert" v-html="modalAlert"></p>
            </div>

            <div slot="footer">
                <button class="button-rounded-gray" @click="showModal = false">확인</button>
            </div>
        </modal>
    </div>
</template>

<script>
import Result from "../../../utils/result";
import FriendList from "./FriendList.vue";
import FriendRequestsReceived from "./FriendRequestsReceived.vue";
import FriendRequestsSent from "./FriendRequestsSent.vue";

export default {
    name: "friends",

    components: {
        "friend-list": FriendList,
        "friend-requests-received": FriendRequestsReceived,
        "friend-requests-sent": FriendRequestsSent
    },

    data() { //변수 초기화
        return {
            State: {
                Friend: "friend",
                Received: "received",
                Sent: "sent"
            },

            RouteName: {
                Friends: "friends",
                FriendRequestsSent: "friend-requests-sent",
                FriendRequestsReceived: "friend-requests-received"
            },

            friends: [],
            friendRequestsReceived: [],
            friendRequestsSent: [],
            alert: "",

            // For Modal
            searchedFriend: null,
            isCompletedSentFriendRequest: false,
            modalAlert: null,
            showModal: false,
            nickname: "",
            itemCount: 0,
        };
    },

    computed: {
        // itemCount() {
        //     if (this.$route.name === this.RouteName.FriendRequestsReceived) {
        //         return this.friendRequestsReceived.length;
        //     } else if (this.$route.name === this.RouteName.FriendRequestsSent) {
        //         return this.friendRequestsSent.length;
        //     } else {
        //         return this.friends.length;
        //     }
        // },
        page() {
            return this.$route.query.page || 1;
        }
    },

    watch: {
        $route() {
            if (this.$route.name === this.RouteName.FriendRequestsReceived) {

                this.loadFriendships({ state: this.State.Received });
            } else if (this.$route.name === this.RouteName.FriendRequestsSent) {

                this.loadFriendships({ state: this.State.Sent });
            } else {
                //console.log(this.$route.name);
                this.loadFriendships({ state: this.State.Friend });
            }
        }
    },

    methods: {
        setAlert(text) { 
            this.alert = text;
        },

        openModal() { //modal 열기
            this.searchedFriend = null;
            this.isCompletedSentFriendRequest = false;
            this.modalAlert = "";
            this.showModal = true;
            this.nickname = "";
        },

        findFriend() { //친구 찾기
            if (!this.nickname) {
                alert("검색할 친구의 닉네임을 입력해주세요.");
                return;
            }

            if (this.nickname.length < 2) {
                alert("닉네임은 2글자 이상 입력해주세요.");
                return;
            }

            if (/[^ㄱ-ㅎ|ㅏ-ㅣ|가-힣|0-9a-zA-Z]/.test(this.nickname)) {
                alert("닉네임은 한글, 영어, 숫자로만 검색해주세요.");
                return;
            }

            this.$EventBus.$emit("loading-add", "find-friend");

            this.$axios
                .get(
                    this.$Api.findFriend +
                        "?nickname=" +
                        encodeURIComponent(this.nickname),
                    this.$root.bearerHeaders()
                )
                .then(response => {
                    this.$EventBus.$emit("loading-remove", "find-friend");

                    if (!response) {
                        return;
                    }
                    console.log(response.data);
              
                    if (
                        !response.data.code ===
                        Result.NICKNAME_IS_TOO_SHORT.code
                    ) {
                        alert("검색할 닉네임은 2글자 이상 입력해주세요.");
                        return;
                    }
                    if (
                        response.data.code ===
                        Result.CANNOT_SEND_FRIEND_REQUST_TO_FRIEND.code
                    ) {
                        this.searchedFriend = null;
                        this.modalAlert =
                            "이미 친구인 유저입니다.<br>친구목록을 확인해주세요.";
                        return;
                    } else if (
                        response.data.code ===
                        Result.YOU_HAVE_ALREADY_SENT_FRIEND_REQUEST.code
                    ) {
                        this.searchedFriend = null;
                        this.modalAlert =
                            "이미 친구 요청한 사용자입니다.<br>보낸 친구요청 목록을 확인해주세요.";
                        return;
                    } else if (
                        response.data.code ===
                        Result.FRIEND_HAVE_ALREADY_SENT_FRIEND_REQUEST.code
                    ) {
                        this.searchedFriend = null;
                        this.modalAlert =
                            "친구 요청을 받은 사용자입니다.<br>받은 친구요청 목록을 확인해주세요.";
                        return;
                    } else if (response.data.code !== Result.OK.code) {
                        return;
                    }

                    if (response.data.itemCount) {
                        this.isCompletedSentFriendRequest = false;
                        this.searchedFriend = response.data.items[0];
                        this.modalAlert = "";
                    } else {
                        this.searchedFriend = null;
                        this.modalAlert = "검색된 사용자가 없습니다.";
                    }
                })
                .catch(error => {
                    console.error(error);

                    this.$EventBus.$emit("loading-remove", "find-friend");
                });
        },

        sendFriendRequest(nickname) { //친구요청 보내기
            this.$EventBus.$emit("loading-add", "friend-request");

            this.$axios
                .put(
                    this.$Api.requestFriendship,
                    {
                        nickname: nickname
                    },
                    this.$root.bearerHeaders()
                )
                .then(response => {
                    this.$EventBus.$emit("loading-remove", "friend-request");

                    if (!response) {
                        return;
                    }

                    if (
                        response.data.code ===
                        Result.CANNOT_SEND_FRIEND_REQUST_TO_FRIEND.code
                    ) {
                        this.searchedFriend = null;
                        this.modalAlert =
                            "이미 친구인 유저입니다.<br>친구목록을 확인해주세요.";
                        return;
                    }

                    if (
                        response.data.code ===
                        Result.YOU_HAVE_ALREADY_SENT_FRIEND_REQUEST.code
                    ) {
                        this.searchedFriend = null;
                        this.modalAlert =
                            "이미 친구 요청한 사용자입니다.<br>보낸 친구요청 목록을 확인해주세요.";
                        return;
                    }

                    if (
                        response.data.code ===
                        Result.FRIEND_HAVE_ALREADY_SENT_FRIEND_REQUEST.code
                    ) {
                        this.searchedFriend = null;
                        this.modalAlert =
                            "친구 요청을 받은 사용자입니다.<br>받은 친구요청 목록을 확인해주세요.";
                        return;
                    }

                    if (response.data.code !== Result.OK.code) {
                        return;
                    }

                    this.friendRequestsSent.splice(0, 0, this.searchedFriend);
                    this.modalAlert = "";
                    this.isCompletedSentFriendRequest = true;

                    if (
                        this.$route.name ===
                            this.RouteName.FriendRequestsSent &&
                        this.friendRequestsSent.length
                    ) {
                        this.alert = "";
                    }
                })
                .catch(error => {
                    console.error(error);
                    this.$EventBus.$emit("loading-remove", "friend-request");
                });
        },

        loadFriendships(options) { //친구유저들을 불러오기
            this.$EventBus.$emit(
                "loading-add",
                "load-friendship-" + options.state
            );

            options = options || {};
            options.state = options.state || this.State.Friend;

            if (
                (this.$route.name === this.RouteName.FriendRequestsReceived &&
                    options.state === this.State.Received) ||
                (this.$route.name === this.RouteName.FriendRequestsSent &&
                    options.state === this.State.Sent) ||
                (this.$route.name === this.RouteName.Friends &&
                    options.state === this.State.Friend)
            ) {
                this.alert = "불러오는 중입니다.";
            }

            this.$axios
                .get(
                    this.$Api.myFriends +
                        (options.state ? "?state=" + options.state : ""),
                    this.$root.bearerHeaders()
                )
                .then(response => {
                    console.log(response.data);
                    var items =[];
                    this.$EventBus.$emit(
                        "loading-remove",
                        "load-friendship-" + options.state
                    );

                    if (!response || response.data.code !== Result.OK.code) {
                        return;
                    }
                    for(var i=0; i<response.data.items.length; i++){
                        if(response.data.items[i].secession === 0)
                        {
                            items.push(response.data.items[i]);
                        }
                    }
                    console.log(items);
                    // console.log(items);
                    switch (options.state) {
                        case this.State.Received:
                            this.friendRequestsReceived = items;
                            this.itemCount = response.data.totalItemCount;
                            // console.log(this.itemCount);
                            break;

                        case this.State.Sent:
                            this.friendRequestsSent = items;
                            this.itemCount = response.data.totalItemCount;
                            // console.log(this.itemCount);
                            break;

                        default:
                            this.friends = items;
                            this.itemCount = response.data.totalItemCount;
                            // console.log(this.itemCount);
                            break;
                    }

                    if (
                        this.$route.name ===
                            this.RouteName.FriendRequestsReceived &&
                        options.state === this.State.Received
                    ) {
                        if (!this.friendRequestsReceived.length) {
                            this.alert = "받은 친구 요청이 없습니다.";
                        } else {
                            this.alert = "";
                        }
                    } else if (
                        this.$route.name ===
                            this.RouteName.FriendRequestsSent &&
                        options.state === this.State.Sent
                    ) {
                        if (!this.friendRequestsSent.length) {
                            this.alert = "보낸 친구 요청이 없습니다.";
                        } else {
                            this.alert = "";
                        }
                    } else if (
                        this.$route.name === this.RouteName.Friends &&
                        options.state === this.State.Friend
                    ) {
                        if (!this.friends.length) {
                            this.alert = "등록된 친구가 없습니다.";
                        } else {
                            this.alert = "";
                        }
                    }

                    if (options.onSuccess) {
                        options.onSuccess();
                    }
                })
                .catch(error => {
                    console.error(error);
                    this.$EventBus.$emit(
                        "loading-remove",
                        "load-friendship-" + options.state
                    );
                });
        }
    },

    created() { //페이지 초기 로딩
        if(this.$root.isLoggedIn()) {
            this.loadFriendships({ state: this.State.Friend });
            this.loadFriendships({ state: this.State.Received });
            this.loadFriendships({ state: this.State.Sent });
            console.log('Here!!!');
        }else {
            if (!confirm("로그인이 필요합니다.\n로그인 하시겠습니까?")) {
                this.$router.push('/community/news');
                return;
            }            
            this.$root.redirectToLogin();
        }       
    }
};
</script>