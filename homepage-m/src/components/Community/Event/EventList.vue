<template>
  <div class="page-container">
    <div class="page-wrapper page-community event">
      <Header/>
      <SideMenu />
      <section class="main-content">
        <header class="page-header">
          <h1 class="page-title">이벤트</h1>
        </header>
        <!-- <div class="sub-wrap p-3">
                    <div class="event-list" v-if="! events.length">
                        <p>진행중인 이벤트가 없습니다.</p>
                    </div>
                    <div class="event-list" v-else>            
                        <table class="tbs02 mt-2" style="width:100%;">
                            <colgroup>
                                <col width="50%"/>
                                <col width="50%"/>
                            </colgroup>
                            <tbody>
                                <tr 
                                    class="event-listitem"
                                    v-for="event in events"
                                    :key="event.id"
                                    @click="view(event.id)" 
                                >
                                    <td class="first">
                                        <span class="bgi1">{{ statusText(event.status) }}</span>
                                        <img :src="event.image_uri" :alt="event.subject">
                                    </td>
                                    <td class="last">
                                        <p class="bbs_tit1">{{ event.subject }}</p>
                                        <p class="bbs_data fc_bu">
                                            {{ dateFormat(event.start_at) }} ~ {{ dateFormat(event.end_at) }}
                                        </p>
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                        <pagination :current="page" :totalCount="totalCount" class="paging1"/>

                    </div>
        </div>-->
        <div id="events">
          <ul class="event-list" v-if="! events.length">
            <li class="no-event">이벤트가 없습니다.</li>
          </ul>
          <ul class="event-list" v-else>
            <li
              class="event-listitem"
              v-for="event in events"
              :key="event.id"
              @click="view(event.id)"
            >
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
      </section>
      <Footer />
    </div>
  </div>
</template>

<script>
import Header from '@/components/Header.vue'
import SideMenu from "@/components/SideMenu.vue";
import Footer from "@/components/Footer.vue";
import moment from "moment";
import Result from "@/utils/result";

export default {
  components: {
    Header,
    SideMenu,
    Footer
  },

  data() {
    return {
      show: false,
      activetab: 1,
      tabName1: "current w_50p",
      tabName2: "w_50p",
      totalCount: 0,
      events: []
    };
  },

  computed: {
    page() {
      return this.$route.query.page || 1;
    }
  },

  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.$root.registerNicknameIfNotExist();
    });
  },

  methods: {
    Log() {
      this.$axios
        .put(
          this.$Api.logs,
          { menu_type: 16, Authorization: "Bearer" + this.$root.sessionId() },
          this.$root.bearerHeaders()
        )
        .then(response => {
          console.log(response.data);
          if (!response || response.data.code != 1) {
            return;
          }
        })
        .catch(error => {
          console.error(error);
        });
    },
    view(id) {
      this.$router.push({ name: "eventview", params: { id: id } });
    },

    statusText(status) {
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

    dateFormat(date) {
      if (!date) {
        return "종료시까지";
      }

      return moment(date).format("YYYY. M. D.");
    },

    fetchEvents() {
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
          console.log(response.data);

          if (!response || response.data.code !== Result.OK.code) {
            return;
          }

          this.events = [];
          this.totalCount = response.data.totalCount;
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

  created() {
    this.fetchEvents();
    this.Log();
  }
};
</script>

<style>
#events {
  margin-top: 58px;
  position: relative;
  width: 100%;
}

#events .paging {
  margin-top: 44px;
}

.event-list {
  cursor: pointer;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -ms-flex-wrap: wrap;
  flex-wrap: wrap;
  width: 100%;
}

.event-list .event-listitem {
  margin: 0.9rem;
  position: relative;
  width: 500px;
}

.event-list .event-image {
  height: 180px;
  overflow: hidden;
  position: relative;
}

.event-list .event-image > img {
  height: auto;
  left: 50%;
  top: 50%;
  position: absolute;
  -webkit-transform: translate(-50%, -50%);
  -ms-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
  width: 100%;
}

.event-list .event-description {
  border-bottom: 1px solid #ddd;
  border-left: 1px solid #ddd;
  border-right: 1px solid #ddd;
  padding: 16px 28px;
}

.event-list .event-subject {
  color: #222;
  font-size: 16px;
  line-height: 1;
}

.event-list .event-period {
  color: #39a0d1;
  font-size: 16px;
  line-height: 1;
  margin-top: 14px;
}

.event-list .event-ongoing {
  background-color: #39a0d1;
  color: #fff;
  font-size: 14px;
  left: 0;
  padding: 12px 30px;
  position: absolute;
  top: 0;
}

.event-list .event-onready {
  background-color: #f75259;
  color: #fff;
  font-size: 14px;
  left: 0;
  padding: 12px 30px;
  position: absolute;
  top: 0;
}

.event-list .event-end {
  background-color: #3a3a3a;
  color: #fff;
  font-size: 14px;
  left: 0px;
  padding: 12px 30px;
  position: absolute;
  top: 0px;
}

.event-list .no-event {
  border-bottom: 1px solid #ccc;
  color: #222;
  font-size: 16px;
  padding: 60px 0 118px;
  text-align: center;
  width: 100%;
}
.paging {
  clear: both;
  text-align: center;
  margin-top: 30px;
  margin-bottom: 30px;
  position: relative;
}
</style>

