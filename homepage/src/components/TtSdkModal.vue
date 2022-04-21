<template>
    <div class="tt-sdk-bg">
        <div class="tt-sdk-modal">
            <div class="tt-sdk-header">
                <img src="/images/icon_tooltip_circle.png" alt="툴팁">
                <h4>초대 메시지</h4>
            </div>
            <div class="tt-sdk-body">
                <p>
                    <span class="tt-sdk-bold">'{{ invitation ? invitation.from_nick_name : '' }}'</span>님이
                    <br>
                    <span class="tt-sdk-bold">'{{ gameName }}'</span>에서 초대했습니다.
                </p>
                <!-- <p v-if="invitation && invitation.password">(비밀번호 : {{ invitation && invitation.password ? invitation.password : '' }})</p> -->
                <p>남은 초대 수락 시간 : {{ seconds }} 초</p>
            </div>
            <div class="tt-sdk-footer">
                <button class="tt-sdk-accept tt-sdk-button red" @click="accept">수락</button>
                <button class="tt-sdk-reject tt-sdk-button gray" @click="reject">거절</button>
            </div>
            <!-- <a class="tt-sdk-close" title="닫기" @click.prevent="close">
                <img src="/images/icon_close.png" alt="닫기">
            </a> -->
        </div>
    </div>
</template>

<script>
export default {
    props: ["invitation"],
    data () {
        return {
            now: Math.trunc((new Date()).getTime() / 1000),
            startTime : 0,
            limitTime: 15,
        }
    },
    
    computed: {
        gameName() {
            if (this.invitation && this.invitation.game_code === 10000) {
                return "동전쌓기";
            }else if(this.invitation && this.invitation.game_code === 10001){
                return "판뒤집기";
            }

            return "알 수 없는 게임";
        },
        seconds() {
            //console.log(this.now);
            return  this.limitTime + (this.startTime - this.now); 
        },
    },

    watch: {
        seconds: function(newVal, oldVal){
            if(this.seconds < 0){
                //console.log("TimeOut!!!!!!!!!!!!");
                this.reject();
            }
        }
    },


    methods: {
        accept() {
            this.$EventBus.$emit("ttsdk-accept", this.invitation);
        },

        reject() {
            this.$EventBus.$emit("ttsdk-reject", this.invitation);
        },

        close() {
            this.$EventBus.$emit("ttsdk-close");
        },
        ready() { 
            window.setInterval(() => {
                this.now = Math.trunc((new Date()).getTime() / 1000);
            },1000);
        }   
    },
    
    created() {
        this.ready();
        this.startTime = this.now;

    }
};
</script>