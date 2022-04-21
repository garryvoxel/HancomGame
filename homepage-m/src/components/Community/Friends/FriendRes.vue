<template>
    <div class="page-container">
        <div class="page-wrapper page-community friends">
            <Header/>
            <SideMenu />
            <section class="main-content">
                <header class="page-header">
                    <h1 class="page-title">친구관리</h1>
                </header>
                <div class="sub-wrap p-3">
                    <ul class="nav-tabs1">
                        <li><router-link to="/friends/list"><div>친구목록 <span>{{friends.length}}</span></div></router-link></li>
                        <li><router-link to="/friends/req"><div>받은<br>친구요청 <span>{{friendRequestsReceived.length}}</span></div></router-link></li>
                        <li class="current"><router-link to="/friends/res"><div>보낸<br>친구요청 <span>{{friendRequestsSent.length}}</span></div></router-link></li>
                        <li><router-link to="/friends/search"><div>친구찾기</div></router-link></li>
                    </ul>
                    <div id="tab1" class="tabcontent current">
                        <ul class="friends-list">
                            <li
                                class="friends-item"
                                v-if="friendRequestsSent.length > 0"
                                v-for="friendRequest in friendRequestsSent"
                            >
                                <div class="friends-thumbnail">
                                    <avatar-image
                                        class="friends-image"
                                        :index="friendRequest.avatar"
                                    />
                                </div>
                                <div class="friends-info">
                                    <p class="nick">닉네임 : <span>{{friendRequest.nickname}}</span></p>
                                    <p class="lv">소속 클랜 : <span>{{friendRequest.clan ? friendRequest.clan : "클랜 없음"}}</span></p>
                                </div>
                                <div class="friends-btn">
                                    <button class="btn btn-secondary btn-xs" @click="deleteFriendRequestSent(friendRequest.nickname)">친구요청취소</button>
                                </div>
                            </li>
                            <li class="friends-item friends-item-empty" v-if="friendRequestsSent.length <=0">
                                <div>{{alert}}</div>
                                <div>보낸 친구 요청이 없습니다.</div>
                            </li>
                        </ul>
                    </div>
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
import Result from "@/utils/result";

export default {
    
    components: {
        Header,
        SideMenu,
        Footer,
    },

    data(){
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
            isLoading: false,
            nickname: ""
        }
    },

    methods: {
        setAlert(text) {
            this.alert = text;
        },

        openModal() {
            this.searchedFriend = null;
            this.isCompletedSentFriendRequest = false;
            this.modalAlert = "";
            this.showModal = true;
            this.nickname = "";
        },

        findFriend() {
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

            if (this.isLoading) {
                return;
            }

            this.isLoading = true;
            this.$EventBus.$emit("loading-add", "find-friend");
            this.$axios
                .get(
                    this.$Api.findFriend + "?nickname=" + this.nickname,
                    this.$root.bearerHeaders()
                )
                .then(response => {
                    console.log(response.data);
                    this.$EventBus.$emit("loading-remove", "find-friend");

                    this.isLoading = false;

                    if (!response) {
                        return;
                    }

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

                        console.log(this.modalAlert);
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
                    this.isLoading = false;
                });
        },
        deleteFriendRequestSent(nickname) {
            if (
                !confirm(`[${nickname}]님에게 보낸 친구요청을 취소하겠습니까?`)
            ) {
                return;
            }

            this.$EventBus.$emit("loading-add", "delete-friend-request-sent");

            this.$axios
                .delete(this.$Api.deleteFriendship, {
                    data: {
                        nickname: nickname,
                        state: "sent"
                    },
                    ...this.$root.bearerHeaders()
                })
                .then(response => {
                    console.log(response.data);

                    this.$EventBus.$emit(
                        "loading-remove",
                        "delete-friend-request-sent"
                    );

                    if (!response || response.data.code !== Result.OK.code) {
                        return;
                    }

                    this.friendRequestsSent.splice(
                        this.friendRequestsSent.findIndex(f => {
                            f.nickname === nickname;
                        }),
                        1
                    );

                    if (!this.friendRequestsSent.length) {
                        this.$emit("alert", "보낸 친구 요청이 없습니다.");
                    }

                    this.$router.push({name: 'friendslist'});
                })
                .catch(error => {
                    console.error(error);
                    this.$EventBus.$emit(
                        "loading-remove",
                        "delete-friend-request-sent"
                    );
                });
        },

        sendFriendRequest(nickname) {
            if (this.isLoading) {
                return;
            }

            this.isLoading = true;

            this.$axios
                .put(
                    this.$Api.requestFriendship,
                    {
                        nickname: nickname
                    },
                    this.$root.bearerHeaders()
                )
                .then(response => {
                    console.log(response.data);

                    this.isLoading = false;

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

                    this.isLoading = false;
                });
        },

        loadFriendships(options) {
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

                    if (!response || response.data.code !== Result.OK.code) {
                        return;
                    }

                    const items = response.data.items;

                    switch (options.state) {
                        case this.State.Received:
                            this.friendRequestsReceived = items;
                            break;

                        case this.State.Sent:
                            this.friendRequestsSent = items;
                            break;

                        default:
                            this.friends = items;
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
                });
        }
    },

    created() {
        this.loadFriendships({ state: this.State.Friend });
        this.loadFriendships({ state: this.State.Received });
        this.loadFriendships({ state: this.State.Sent });
    }
}
</script>
