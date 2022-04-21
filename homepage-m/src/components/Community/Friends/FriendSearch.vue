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
                        <li><router-link to="/friends/res"><div>보낸<br>친구요청 <span>{{friendRequestsSent.length}}</span></div></router-link></li>
                        <li class="current"><router-link to="/friends/search"><div>친구찾기</div></router-link></li>
                    </ul>
                    <div id="tab1" class="tabcontent current">
                        <form action="." @submit="findFriend" class="friends-form">
                            <fieldset>
                                <legend>친구 검색</legend>
                                <div class="friends-find">
                                    <div class="friends-find-input">
                                        <input type="text" class="instb w_100p" v-model="nickname" name="" id="" placeholder="닉네임 입력하세요.">
                                    </div>
                                    <div class="friends-find-btn">
                                        <button type="search" class="btn btn-primary btn-xs"><i class="fa fa-search" aria-hidden="true"></i> 친구검색</button>
                                    </div>
                                </div>
                            </fieldset>
                        </form>
                         <ul class="friends-list">
                            <li class="friends-item" v-if="this.showModal">
                                <div class="friends-thumbnail">
                                    <avatar-image
                                        class="friends-image"
                                        :index="searchedFriend.avatar"
                                    />
                                </div>
                                <div class="friends-info">
                                    <p class="nick">닉네임 : <span>{{this.searchedFriend.nickname}}</span></p>
                                    <p class="lv">소속 클랜 : <span>{{this.searchedFriend.clan ? this.searchedFriend.clan : '클랜 없음'}}</span></p>
                                </div>
                                <div class="friends-btn">
                                    <button class="btn btn-primary btn-xs" @click="sendFriendRequest(searchedFriend.nickname)" v-if="! isCompletedSentFriendRequest">친구요청</button>
                                    <span class="icon-check" v-if="isCompletedSentFriendRequest"><i aria-hidden="true" class="fa fa-check"></i> 친구 요청 완료</span>
                                </div>
                            </li>
                            <!--<div class="row" v-else>
                                <div>{{alert}}</div>
                               <div style='text-align : center; width: 100%;'>등록된 친구가 없습니다.</div>
                            </div>-->
                        </ul>
                       <!--<div class="fri_list mt-3">
                            <div class="row" v-if="friends.length > 0">
                                <div class="col-3 col-sm-3">
                                    <div class="thum"><img src="/imgs/sub04_img01.png" alt=""></div>
                                </div>
                                <div class="col-6 col-sm-6">
                                    <p class="nick">친구 닉네임</p>
                                    <p class="lv">친구 클랜이름</p>
                                </div>
                                <div class="col-3 col-sm-3 btn-box">
                                    <button class="btn btn-dark btn-xs pull-right mt-2">삭제</button>
                                </div>
                            </div>
                            <div class="row" v-else>
                                <div>{{alert}}</div>
                                <div style='text-align : center; width: 100%;'>등록된 친구가 없습니다.</div>
                            </div>
                        </div>-->
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
                Sent: "sent",
                Search: "search"
            },

            RouteName: {
                Friends: "friends",
                FriendRequestsSent: "friend-requests-sent",
                FriendRequestsReceived: "friend-requests-received",
                FriendRequestsSearch: "friend-requests-search"
            },

            friends: [],
            friendRequestsReceived: [],
            friendRequestsSent: [],
            FriendRequestsSearch: [],
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
    methods:{

        sendFriendRequest(nickname) {
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
                    console.log(response.data);
                    console.log(response.data.items);
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
        //친구검색
        findFriend(e) {
            e.preventDefault();
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

            this.$axios
                .get(
                    this.$Api.findFriend + "?nickname=" + this.nickname,
                    this.$root.bearerHeaders()
                )
                .then(response => {
                    console.log(response.data);

                    this.isLoading = false;

                    if (!response) {
                        return;
                    }
                    if(response.data.itemCount ===0){
                        this.searchedFriend = null;
                        alert("검색된 사용자가 없습니다.");
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
                            "이미 친구인 유저입니다.\n친구목록을 확인해주세요.";
                            alert(this.modalAlert);
                        return;
                    } else if (
                        response.data.code ===
                        Result.YOU_HAVE_ALREADY_SENT_FRIEND_REQUEST.code || response.data.code === 303
                    ) {
                        this.searchedFriend = null;
                        this.modalAlert =
                            "이미 친구 요청한 사용자입니다.\n보낸 친구요청 목록을 확인해주세요.";
                                    alert(this.modalAlert);
                        console.log(this.modalAlert);
                        return;
                    } else if (
                        response.data.code ===
                        Result.FRIEND_HAVE_ALREADY_SENT_FRIEND_REQUEST.code
                    ) {
                        this.searchedFriend = null;
                        this.modalAlert =
                            "친구 요청을 받은 사용자입니다.\n받은 친구요청 목록을 확인해주세요.";
                                    alert(this.modalAlert);
                        return;
                    } else if (response.data.code !== Result.OK.code) {
                        return;
                    }

                    if (response.data.itemCount) {
                        this.searchedFriend = response.data.items[0];
                        this.showModal = true;
                        
                        console.log("search : " + this.searchedFriend.nickname);
                        console.log("clan : " + this.searchedFriend.clan);
                        this.modalAlert = "";
                    } 
                })
                .catch(error => {
                    console.error(error);

                    this.isLoading = false;
                });
        },
        //친구목록
        loadFriendships(options) {
            options = options || {};
            options.state = options.state || this.State.Friend;

            if (
                (this.$route.name === this.RouteName.FriendRequestsReceived &&
                    options.state === this.State.Received) ||
                (this.$route.name === this.RouteName.FriendRequestsSent &&
                    options.state === this.State.Sent) ||
                (this.$route.name === this.RouteName.Friends &&
                    options.state === this.State.Friend) ||
                (this.$route.name === this.RouteName.FriendRequestsSearch &&
                    options.state === this.State.Search
                )
            )
            {
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
<style scoped>

.friends-form fieldset {
    margin: 0;
    padding: 0;
    border: none;
}
.friends-form legend {
    position: absolute;
    width: 0;
    height: 0;
    overflow: hidden;
    clip: rect(-1, -1, -1, -1r);
}
.friends-find {
    display: flex;
    padding: 10px;
    border-width: 1px 0;
    border-style: solid;
    border-color: #ececec;
}
.friends-find-input {
    flex-grow: 1;
    flex-shrink: 1;
}
.friends-find-input input {
    box-shadow: none;
    border-radius: 0;
    -webkit-appearance: none;
}
.friends-find-btn {
    margin-left:5px;
    flex-shrink: 0;
}
.friends-find-btn .btn {
    border-radius: 0;
}
</style>