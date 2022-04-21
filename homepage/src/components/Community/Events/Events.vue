<template>
  <div id="events">
    <ul class="event-list" v-if="! events.length">
      <li class="no-event">이벤트가 없습니다.</li>
    </ul>
    <ul class="event-list" v-else>
      <li class="event-listitem" v-for="event in events" :key="event.id" @click="view(event.id)">
        <div class="event-image">
          <img :src="event.image_uri" :alt="event.subject" />
        </div>
        <div class="event-description">
          <h5 class="event-subject">{{ event.subject }}</h5>
          <div
            class="event-period"
          >{{ dateFormat(event.start_at) }} ~ {{ dateFormat(event.end_at) }}</div>
        </div>
        <!-- <div :class="ongoing" >{{ eventText }}</div> -->
        <div v-if="event.status === 'ongoing'">
          <div class="event-ongoing">{{ statusText(event.status) }}</div>
        </div>
        <div v-else-if="event.status === 'end'">
          <div class="event-end">{{ statusText(event.status) }}</div>
        </div>
        <div v-else>
          <div class="event-onready">{{ statusText(event.status) }}</div>
        </div>
      </li>
    </ul>
    <pagination :current="page" :totalCount="totalCount" />
  </div>
</template>

<script>
import moment from "moment";
import Result from "../../../utils/result";

export default {
  data() { //변수 초기화
    return {
      totalCount: 0,
      events: [],
      ongoing: "event-ongoing",
      eventText: ""
    };
  },

  computed: {
    page() { //페이지번호 세팅
      return this.$route.query.page || 1;
    }
  },

  methods: {
    view(id) { //이벤트보기페이지로 이행
      this.$router.push({ name: "event-view", params: { id: id } });
    },

    statusText(status) { //상태값 표시
      switch (status) {
        case "ongoing":
          return "진행중";
        case "winnersannounced":
          return "당첨자발표";
        case "inactive":
          return "비활성";
        case "onready":
          return "발표준비중";
        default:
          return "종료됨";
      }
    },

    dateFormat(date) { //날짜 형식 맞추기
      if (!date) {
        return "종료시까지";
      }

      return moment(date)
        .utcOffset("+0900")
        .format("YYYY. M. D.");
    },

    fetchEvents() { //이벤트 가져오기
      const args = {
        page: this.page
      };

      this.$axios
        .get(
          this.$Api.events +
            "?" +
            Object.keys(args)
              .map(key => {
                return key + "=" + encodeURIComponent(args[key]);
              })
              .join("&"),
          this.$root.bearerHeaders()
        )
        .then(response => {
          //console.log(response.data);

          if (!response || response.data.code !== Result.OK.code) {
            return;
          }

          this.totalCount = response.data.totalCount;
          //console.log("this.totalCount ::: " + this.totalCount);

          this.events = [];
          for (var i = 0; i < response.data.items.length; i++) {
            if (response.data.items[i].status !== "inactive") {
              this.events.push(response.data.items[i]);
            }
          }
        });
    }
  },

  watch: {
    $route() {
      this.fetchEvents();
    }
  },

  created() { //페이지 초기 로딩
    this.fetchEvents();
    this.$root.sendLog(16);
  }
};
</script>