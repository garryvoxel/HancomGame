
<template>
    <ul id="friend-requests-received" class="friend-list-container">
        <li v-bind:key="request.nickname" class="user-listitem" v-for="request in friendRequestsReceived">
            <div class="avatar-wrapper">
                <avatar-image :index="request.avatar"/>
            </div>
            <div class="user-info-container">
                <div class="user-nickname">{{ request.nickname }}</div>
                <div class="user-clan" v-if="request.clan">{{ request.clan.name }}</div>
            </div>
            <div class="user-action-wrapper">
                <button
                    @click="acceptFriendRequest(request.nickname)"
                    class="button-rounded-blue"
                >수락</button>
                <a
                    @click="deleteFriendRequestReceived(request.nickname)"
                    class="button-rounded-navy"
                >요청 삭제</a>
            </div>
        </li>
    </ul>
</template>

<script>
import Result from "../../../utils/result";

export default {
    props: ["friends", "friendRequestsReceived"],

    methods: {
        acceptFriendRequest(nickname) { //친구 요청 수락하기
            if (!confirm(`[${nickname}]님의 친구 요청을 수락하겠습니까?`)) {
                return;
            }

            this.$EventBus.$emit("loading-add", "accept-friend-request");

            this.$axios
                .post(
                    this.$Api2.friends.acceptFriend,
                    {
                        session_id : this.$root.sessionId(),
                        friend_nick_name: nickname
                    },
                    this.$root.bearerHeaders()
                )
                .then(response => {
                    this.$EventBus.$emit(
                        "loading-remove",
                        "accept-friend-request"
                    );

                    if (!response) {
                        return;
                    }

                    this.friends.push(
                        this.friendRequestsReceived.find(request => {
                            return request.nickname === nickname;
                        })
                    );

                    this.friendRequestsReceived.splice(
                        this.friendRequestsReceived.findIndex(request => {
                            return request.nickname === nickname;
                        }),
                        1
                    );
                   
                    if (!this.friendRequestsReceived.length) {
                        this.$emit("alert", "받은 친구 요청이 없습니다.");
                    }
                    this.$router.push({name: 'friends'});
                })
                .catch(error => {
                    console.error(error);
                    this.$EventBus.$emit(
                        "loading-remove",
                        "accept-friend-request"
                    );
                });
        },

        deleteFriendRequestReceived(nickname) { //친구요청삭제하기
            if (
                !confirm(`[${nickname}]님에게 받은 친구요청을 삭제하겠습니까?`)
            ) {
                return;
            }

            this.$EventBus.$emit("loading-add", "delete-friend-request");

            this.$axios
                .delete(this.$Api.deleteFriendship, {
                    data: {
                        nickname: nickname,
                        state: "received"
                    },
                    ...this.$root.bearerHeaders()
                })
                .then(response => {
                    //console.log(response.data);

                    this.$EventBus.$emit(
                        "loading-remove",
                        "delete-friend-request"
                    );

                    if (!response || response.data.code !== Result.OK.code) {
                        return;
                    }

                    this.friendRequestsReceived.splice(
                        this.friendRequestsReceived.findIndex(f => {
                            f.nickname === nickname;
                        }),
                        1
                    );

                    if (!this.friendRequestsReceived.length) {
                        this.$emit("alert", "받은 친구 요청이 없습니다.");
                    }
                    this.$router.push({ name: 'friends'});
                })
                .catch(error => {
                    console.error(error);
                    this.$EventBus.$emit(
                        "loading-remove",
                        "delete-friend-request"
                    );
                });
        }
    }
};
</script>
