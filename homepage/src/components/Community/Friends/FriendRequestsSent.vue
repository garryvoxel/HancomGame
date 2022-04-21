
<template>
    <ul id="friend-requests-sent" class="friend-list-container">
        <li v-bind:key="request.nickname" class="user-listitem" v-for="request in friendRequestsSent">
            <div class="avatar-wrapper">
                <avatar-image :index="request.avatar"/>
            </div>
            <div class="user-info-container">
                <div class="user-nickname">{{ request.nickname }}</div>
                <div class="user-clan" v-if="request.clan">{{ request.clan.name }}</div>
            </div>
            <div class="user-action-wrapper">
                <button
                    @click="deleteFriendRequestSent(request.nickname)"
                    class="button-rounded-navy"
                >취소</button>
            </div>
        </li>
    </ul>
</template>

<script>
import Result from "../../../utils/result";

export default {
    props: ["friendRequestsSent"],

    methods: {
        deleteFriendRequestSent(nickname) { //친구요청 취소하기
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
                    //console.log(response.data);

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

                    this.$router.push({name: 'friends'});
                })
                .catch(error => {
                    console.error(error);
                    this.$EventBus.$emit(
                        "loading-remove",
                        "delete-friend-request-sent"
                    );
                });
        }
    }
};
</script>
