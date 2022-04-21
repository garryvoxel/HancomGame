<template>
  <div id="point-list">
    <div class="mypage-points-status">
      <h3>한컴타자 포인트</h3>
      <table>
        <tr>
          <td rowspan="2" class="current-points">
            <h6>보유포인트</h6>
            <div class="my-points">
              {{balance}}
              <span>점</span>
            </div>
          </td>
          <td class="point-history-cell">
            <div class="point-history">
              <div>적립한 포인트</div>
              <div class="point-amount">
                {{amount}}
                <span>P</span>
              </div>
            </div>
          </td>
        </tr>
        <tr>
          <td class="point-history-cell">
            <div class="point-history">
              <div>사용한 포인트</div>
              <div class="point-amount">
                {{consume}}
                <span>P</span>
              </div>
            </div>
          </td>
        </tr>
      </table>
    </div>
    <div class="mypage-period">
      <div class="mypage-period-header">조회기간</div>
      <div class="mypage-period-controls">
        <div class="mypage-radio-buttons">
          <div :class="tabs.tab1" @click="changeTab(0)">
            <span style="cursor: pointer">1주일</span>
          </div>
          <div :class="tabs.tab2" @click="changeTab(1)">
            <span style="cursor: pointer">월</span>
          </div>
          <div :class="tabs.tab3" @click="changeTab(2)">
            <span style="cursor: pointer">6개월</span>
          </div>
        </div>
        <div class="mypage-period-dates">
          <input
            style="cursor:pointer"
            type="text"
            class="mypage-date"
            id="datepicker-trigger"
            :placeholder="holderStart + ' ~ ' + holderEnd"
            :value="formatDates(dateOne, dateTwo)"
            @click.prevent="searchElement"
          />
          <button class="button-rounded-navy" @click="changeTab(4)">조회</button>
        </div>
        <AirbnbStyleDatepicker
          :trigger-element-id="'datepicker-trigger'"
          :mode="'range'"
          :fullscreen-mobile="true"
          :showShortcutsMenuTrigger="false"
          :offsetY="500"
          :date-one="dateOne"
          :date-two="dateTwo"
          @previous-month="searchElement"
          @next-month="searchElement"
          @date-two-selected="val => { dateTwo = val }"
          @date-one-selected="val => { dateOne = val }"
        />
      </div>
    </div>
    <table class="mypage-points-history">
      <thead>
        <tr>
          <th>
            <div>일자</div>
          </th>
          <th>
            <div>구분</div>
          </th>
          <th>
            <div>내용</div>
          </th>
          <th>
            <div>포인트</div>
          </th>
        </tr>
      </thead>

      <tbody v-if="totalCount <= 0">
        <tr>
          <td colspan="4" class="text-center">포인트 내역이 없습니다.</td>
        </tr>
      </tbody>

      <tbody v-else>
        <tr v-for="(log, index) in pointLogs" :key="index">
          <td>{{ getUTC(index) }}</td>
          <td>{{ log.type }}</td>
          <td>{{ log.description }}</td>
          <td>{{ Math.abs(log.amount) }}</td>
        </tr>
      </tbody>
    </table>
    <p>&nbsp;</p>
    <pagination :current="page" :totalCount="totalCount" />
  </div>
</template>

<script>
import moment from "moment";
import format from "date-fns/format";

export default {
  data() {
    return {
      totalCount: 0,
      pointLogs: [],
      amount: 0,
      balance: 0,
      consume: 0,
      createdAt: "",
      dateFormat: "YYYY-MM-DD",
      dateOne: "",
      dateTwo: "",
      holderStart: "",
      holderEnd: "",
      holderLastDay: "",
      tabs: { tab1: "", tab2: "selected", tab3: "", tab4: "" },
      btnType: 0,
      firstSearch: 0
    };
  },

  methods: {
    searchElement() {
      // console.log(document.getElementsByClassName('asd__month-name'));

      var m_elementList = [];
      var date = [];
      m_elementList.splice(0, m_elementList.length);
      // console.log(m_elementList);
      date.splice(0, date.length);
      var splitData = [];

      var fDate = [];

      // console.log(date);
      for (
        var i = 0;
        i < document.getElementsByClassName("asd__month-name").length;
        i++
      ) {
        m_elementList.push(
          document
            .getElementsByClassName("asd__month-name")
            [i].textContent.replace("월", "")
        );

        date.push(m_elementList[i]);
        // console.log(date[i]);
        fDate.push(date[i].replace("년", ""));
      }
      // console.log("======== fDate ========");
      // console.log(fDate);
      var finalDate = [];
      for (var i = 0; i < fDate.length; i++) {
        splitData.push(fDate[i].split(" "));

        if (splitData[i][0].length <= 2) {
          splitData[i].reverse();
        }
        // console.log("======== Reverse Data ========");
        // console.log(splitData[i]);
        finalDate.push(splitData[i][0] + "년" + " " + splitData[i][1] + "월");
        document.getElementsByClassName("asd__month-name")[
          i
        ].textContent = finalDate[i].toString();
      }
      // console.log("======== finalDate ========");
      // console.log(finalDate);
    },
    getUTC(num) {
      if (this.pointLogs) {
        return moment(this.pointLogs[num].created_at)
          .utcOffset("+0900")
          .format("YYYY-MM-DD");
      }
    },
    getPointData() {
      this.btnType = 0;
      this.$EventBus.$emit("loading-add", "getPointData");
      this.$axios
        .post(this.$Api2.myPoints.getPoints, {
          sessionid: this.$root.sessionId(),
          start: this.holderStart,
          end: this.holderEnd,
          page: this.page,
          pagesize: 10
        })
        .then(response => {
          if (!response || response.data.result === 9151) {
            this.$EventBus.$emit("loading-remove", "getPointData");
            return;
          }
          this.amount = response.data[0].amount;
          this.balance = response.data[0].balance;
          this.consume = response.data[0].consume;
          if (response.data.length < 2) {
            this.$EventBus.$emit("loading-remove", "getPointData");
          } else {
            this.totalCount = response.data[2][0]._total_count;
            console.log(this.totalCount);
            this.pointLogs = response.data[1];
          }

          this.$EventBus.$emit("loading-remove", "getPointData");
        })
        .catch(error => {
          console.error(error);
          this.$EventBus.$emit("loading-remove", "getPointData");
        });
    },

    getPointPickData() {
      this.btnType = 1;
      this.$EventBus.$emit("loading-add", "getPointData");
      this.$axios
        .post(this.$Api2.myPoints.getPoints, {
          sessionid: this.$root.sessionId(),
          start: this.dateOne,
          end: this.dateTwo,
          page: this.page,
          pagesize: 10
        })
        .then(response => {
          if (!response || response.data.result === 9151) {
            console.log("No Server Data...");
            this.$EventBus.$emit("loading-remove", "getPointData");
            return;
          }

          this.amount = response.data[0].amount;
          this.balance = response.data[0].balance;
          this.consume = response.data[0].consume;
          if (response.data.length < 2) {
            this.$EventBus.$emit("loading-remove", "getPointData");
            this.totalCount = 0;
          } else {
            this.totalCount = response.data[2][0]._total_count;
            console.log(this.totalCount);
            this.pointLogs = response.data[1];
            console.log(this.pointLogs);
          }
          this.$EventBus.$emit("loading-remove", "getPointData");
        })
        .catch(error => {
          console.error(error);
          this.$EventBus.$emit("loading-remove", "getPointData");
        });
    },

    formatDates(dateOne, dateTwo) {
      let formattedDates = "";
      if (dateOne) {
        formattedDates = format(dateOne, this.dateFormat);
      }
      if (dateTwo) {
        formattedDates += " - " + format(dateTwo, this.dateFormat);
      }
      return formattedDates;
    },

    changeTab(tabNum) {
      this.$router.push({ query: { page: 1 } });
      switch (tabNum) {
        case 0:
          this.tabs.tab1 = "selected";
          this.tabs.tab2 = "";
          this.tabs.tab3 = "";
          this.holderStart = moment(new Date())
            .add(-1, "week")
            .format("YYYY-MM-DD");
          this.dateOne = this.holderStart;
          this.holderEnd = moment(new Date()).format("YYYY-MM-DD");
          this.dateTwo = this.holderEnd;

          this.getPointPickData();

          break;
        case 1:
          this.tabs.tab1 = "";
          this.tabs.tab2 = "selected";
          this.tabs.tab3 = "";
          this.holderStart = moment(new Date())
            .add(-1, "month")
            .format("YYYY-MM-DD");
          this.dateOne = this.holderStart;
          this.holderEnd = moment(new Date()).format("YYYY-MM-DD");
          this.dateTwo = this.holderEnd;
          this.getPointPickData();
          break;
        case 2:
          this.tabs.tab1 = "";
          this.tabs.tab2 = "";
          this.tabs.tab3 = "selected";
          this.holderStart = moment(new Date())
            .add(-6, "month")
            .format("YYYY-MM-DD");
          this.dateOne = this.holderStart;
          this.holderEnd = moment(new Date()).format("YYYY-MM-DD");
          this.dateTwo = this.holderEnd;
          this.getPointPickData();
          break;
        case 4:
          this.getPointPickData();
      }
    }
  },

  created() {
    this.holderEnd = moment(new Date()).format("YYYY-MM-DD");
    this.holderStart = moment(new Date())
      .add(-1, "month")
      .format("YYYY-MM-DD");
    this.dateOne = this.holderStart;
    this.dateTwo = this.holderEnd;
    this.getPointData();
    // this.getPointPickData();
    localStorage.setItem("isSelected", "N");
    this.$root.sendLog(20);
  },

  computed: {
    page() {
      return this.$route.query.page || 1;
    }
  },
  watch: {
    $route() {
      if (this.btnType === 0) {
        this.getPointData();
      } else {
        this.getPointPickData();
      }
    }
  }
};
</script>