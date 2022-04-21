<template>
  <div>
    <h4 class="pg_tit">한컴타자 포인트</h4>
    <ul class="point-box" v-if="this.titlepoint != null">
      <li>
        <span>보유포인트</span>
        <span class="fc-rd fs-big ml_20">{{titlepoint.balance + "P"}}</span>
      </li>
      <li>
        <span>적립한 포인트</span>
        <span class="fc-gr">{{ titlepoint.amount + "P"}}</span>
      </li>
      <li>
        <span>사용한 포인트</span>
        <span class="fc-bu">{{ titlepoint.consume + "P"}}</span>
      </li>
    </ul>

    <table class="searchBox mt_15" style="width:100%;">
      <tbody>
        <tr>
          <td>
            <h4 class="pg_tit">조회기간</h4>
            <ul class="searchDate mt-3">
              <li>
                <span class="chkbox2">
                  <button
                    style="border-style:none"
                    type="button"
                    name="dateType"
                    id="dateType3"
                    @click="changeTab(0)"
                  ></button>
                  <label :class="this.tabName1" for="dateType3">1주</label>
                </span>
              </li>
              <li>
                <span class="chkbox2">
                  <button
                    style="border-style:none"
                    type="button"
                    name="dateType"
                    id="dateType5"
                    @click="changeTab(1)"
                  ></button>
                  <label :class="this.tabName2" for="dateType5">1개월</label>
                </span>
              </li>
              <li>
                <span class="chkbox2">
                  <button
                    style="border-style:none"
                    type="button"
                    name="dateType"
                    id="dateType7"
                    @click="changeTab(2)"
                  ></button>
                  <label :class="this.tabName3" for="dateType7">6개월</label>
                </span>
              </li>
            </ul>
          </td>
        </tr>
        <tr>
          <td>
            <input
              type="text"
              class="datepicker inpType"
              id="datepicker-trigger"
              placeholder="날짜를 선택해 주세요."
              :value="formatDates(this.dateOne, this.dateTwo)"
              @click.prevent="searchElement"
            />

            <AirbnbStyleDatepicker
              :trigger-element-id="'datepicker-trigger'"
              :mode="'range'"
              :fullscreen-mobile="true"
              :showShortcutsMenuTrigger="false"
              :date-one="this.dateOne"
              :date-two="this.dateTwo"
              @previous-month="searchElement"
              @next-month="searchElement"
              @date-one-selected="val => { this.dateOne = val }"
              @date-two-selected="val => { this.dateTwo = val }"
            />
            <!-- <span><button class="datepicker inpType"></button></span> -->
            <span>
              <button class="ip_box_btn2" @click="postpoints">조회</button>
            </span>
          </td>
        </tr>
      </tbody>
    </table>

    <table class="tbs02 mt-2" style="width:100%;">
      <colgroup>
        <col width="*" />
        <col width="*" />
        <col width="*" />
        <col width="*" />
      </colgroup>
      <thead>
        <tr>
          <th class="first">일자</th>
          <th>구분</th>
          <th>내용</th>
          <th class="last">포인트</th>
        </tr>
      </thead>
      <tbody v-if="datalength > 1">
        <tr v-for="(log, index) in pointLogs" :key="index">
          <td>{{ getUTC(index) }}</td>
          <td>{{ log.type }}</td>
          <td>{{ log.description }}</td>
          <td>{{ Math.abs(log.amount) }}</td>
        </tr>
      </tbody>
      <tbody v-else>
        <tr>
          <td colspan="4" class="text-center">이용 내역이 없습니다</td>
        </tr>
      </tbody>
    </table>

    <pagination :current="page" :totalCount="totalCount" class="paging1" />
  </div>
</template>

<script>
import moment from "moment";
// import { truncate } from "fs";
import format from "date-fns/format";
// import { formatWithOptions } from "util";

export default {
  data() {
    return {
      totalCount: 0,
      titlepoint: [],
      pointLogs: [],
      today: moment().format("YYYY-MM-DD"),
      clickcheck: false,
      date: new Date(),
      format: "YYYY-MM-DD",
      befordate: null,
      dateFormat: "YYYY-MM-DD",
      dateOne: "",
      dateTwo: "",
      tabName1: "current w_127p",
      tabName2: "w_127p",
      tabName3: "w_127p",
      datalength: 0
    };
  },
  computed: {
    page() {
      return this.$route.query.page || 1;
    }
  },
  watch: {
    $route() {
      this.postpoints();
    }
  },
  components: {},
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
    changeTab(tabNum) {
      this.$router.replace('/mypage').catch(err =>{});
      switch (tabNum) {
        case 0:
          this.dateOne = moment()
            .subtract(7, "days")
            .format("YYYY-MM-DD");
          this.dateTwo = this.today;
          (this.tabName1 = "current w_127p"),
            (this.tabName2 = "w_127p"),
            (this.tabName3 = "w_127p");
          this.postpoints();
          break;
        case 1:
          this.dateOne = moment()
            .subtract(1, "month")
            .format("YYYY-MM-DD");
          this.dateTwo = this.today;
          (this.tabName1 = "w_127p"),
            (this.tabName2 = "current w_127p"),
            (this.tabName3 = "w_127p");
          this.postpoints();
          break;
        case 2:
          this.dateOne = moment()
            .subtract(6, "month")
            .format("YYYY-MM-DD");
          this.dateTwo = this.today;
          (this.tabName1 = "w_127p"),
            (this.tabName2 = "w_127p"),
            (this.tabName3 = "current w_127p");
          this.postpoints();
          break;
      }
    },

    formatDates(dateOne, dateTwo) {
      let formattedDates = "";
      if (dateOne) {
        formattedDates = format(dateOne, this.dateFormat);
      }
      if (dateTwo) {
        formattedDates += " ~ " + format(dateTwo, this.dateFormat);
      }
      return formattedDates;
    },
    Log() {
      this.$axios
        .put(
          this.$Api.logs,
          { menu_type: 20, Authorization: "Bearer" + this.$root.sessionId() },
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
    postpoints() {
      this.$axios
        .post(this.$Api2.myPoints.getPoints, {
          sessionid: this.$root.sessionId(),
          start: this.dateOne,
          end: this.dateTwo,
          page: this.page,
          pagesize: 10
        })
        .then(response => {
          this.titlepoint = response.data[0];
          this.datalength = response.data.length;
          this.to;
          console.log(response.data);
          console.log(this.dateOne + " ~ " + this.dateTwo);
          if (response.data.length > 1) {
            this.pointLogs = response.data[1];
            this.totalCount = response.data[2][0]._total_count;
          }
          if (!response || response.data.code != 1) {
            return;
          }
        })
        .catch(error => {
          console.error(error);
        });
    }
  },

  created() {
    if (this.$root.isLoggedIn()) {
      this.befordate = moment().format("YYYY-MM-DD");
      this.dateOne = moment()
        .subtract(7, "days")
        .format("YYYY-MM-DD");
      this.dateTwo = this.today;
      this.postpoints();
      this.Log();
    } else {
      if (!confirm("로그인이 필요합니다.\n로그인 하시겠습니까?")) {
        this.$router.push("/");
        this.$router.go();
        return;
      }
      this.$root.redirectToLoginUrl();
    }
  }
};
</script>