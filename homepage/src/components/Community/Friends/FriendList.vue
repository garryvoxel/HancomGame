
<template>
    <ul id="friend-list" class="friend-list-container">
        <li v-bind:key="friend.nickname" class="user-listitem" v-for="friend in friends">
            <div class="avatar-wrapper">
                <avatar-image :index="friend.avatar"/>
            </div>
            <div class="user-info-container">
                <div class="user-nickname">{{ friend.nickname }}</div>
                <div class="user-clan" v-if="friend.clan">{{ friend.clan.name }}</div>
            </div>
            <div class="user-action-wrapper">
                <button @click="deleteFriend(friend.nickname)" class="button-rounded-navy">삭제</button>
            </div>
        </li>
    </ul>
</template>

<script>
import Result from "../../../utils/result";

export default {
    props: ["friends"],

    methods: {
        deleteFriend(nickname) { //친구 삭제하기
            if (!confirm(`친구 [${nickname}]님을 정말 삭제하겠습니까?`)) {
                return;
            }

            this.$EventBus.$emit('loading-add', 'friend-delete')

            this.$axios
                .delete(this.$Api.deleteFriendship, {
                    data: {
                        nickname: nickname,
                        state: "friend"
                    },
                    ...this.$root.bearerHeaders()
                })
                .then(response => {
                    //console.log(response.data);

                    this.$EventBus.$emit('loading-remove', 'friend-delete')

                    if (!response || response.data.code !== Result.OK.code) {
                        return;
                    }

                    this.friends.splice(
                        this.friends.findIndex(f => {
                            f.nickname === nickname;
                        }),
                        1
                    );

                    if (!this.friends.length) {
                        this.$emit("alert", "등록된 친구가 없습니다.");
                    }
                    this.$router.go();
                })
                .catch(error => {
                    console.error(error);
                    this.$EventBus.$emit('loading-remove', 'friend-delete')
                });
        }
    },
    created(){
        this.$root.sendLog(15);
    }
}
</script>
