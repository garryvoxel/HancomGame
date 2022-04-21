<template>
    <div id="event-view">
        <div class="event-header">
            <h3 class="event-subject">{{ event.subject }}</h3>
            <span class="event-period">{{ dateFormat(event.start_at) }} ~ {{ dateFormat(event.end_at) }}</span>
        </div>

        <div class="event-content" v-html="event.content"></div>

        <div class="event-inner-menu" v-show="false">
            <a class="button-rounded-blue-large">응모하기</a>
        </div>
   
        <div class="event-bottom-menu">
            <router-link :to="{ name: 'events' }" class="button-rounded-red">목록</router-link>
        </div>
    </div>
</template>

<script>
import moment from "moment";
import Result from "../../../utils/result";

export default {
    data() { //변수 초기화
        return {
            event: {}
        };
    },

    methods: {
        dateFormat(date) { //날짜 형식 맞추기
            if (!date) {
                return "종료시까지";
            }

            return moment(date).utcOffset('+0900').format("YYYY. M. D.");
        },
      
        fetchEvent() { //이벤트 가져오기 함수
            this.$axios
                .get(this.$Api.viewEvent.replace(':id', this.$route.params.id), this.$root.bearerHeaders())
                .then(response => {
                    //console.log(response.data);

                    if (!response || response.data.code !== Result.OK.code) {
                        return;
                    }
                    if(response.data.event === null){
                        alert("등록된 이벤트가 없습니다");
                        this.$router.push({name : 'events'});
                        return;
                    }
                    this.event = response.data.event;
                });
        }
    },

    created() {

        this.fetchEvent()
    }
}
</script>