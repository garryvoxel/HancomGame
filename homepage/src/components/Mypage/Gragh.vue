<template>
  <div class="mypage-stats-graph-container">
    <div class="mypage-stats-graph-filter">
      <div class="mypage-row">
        <div class="item-container">
          <div>글자판</div>
          <div class="keyboard-language-selector">
            <select v-model="selectedLang">
              <option>한글</option>
              <option>영어</option>
            </select>
          </div>
        </div>
        <div class="item-container">
          <div>글자판 종류</div>
          <div class="keyboard-type-selector">
            <select v-model="selectedKeyboard">
              <option v-if="keyboardType === 0">두벌식</option>
              <option v-if="keyboardType === 0">세벌식 390</option>
              <option v-if="keyboardType === 0">세벌식 순아래</option>
              <option v-if="keyboardType === 0">세벌식 최종</option>
              <option v-if="keyboardType === 1">쿼티</option>
              <option v-if="keyboardType === 1">드보락</option>
            </select>
          </div>
        </div>
      </div>
      <div class="mypage-row">
        <div class="item-subject">조회기간</div>
        <div class="item-container">
          <div class="mypage-radio-buttons">
            <div :class="tabs.tab1" @click="changeTab(0)">오늘</div>
            <!-- <div :class="tabs.tab2" @click="changeTab(1)">이번달</div> -->
            <div :class="tabs.tab3" @click="prev()">&lt;</div>
            <div :class="tabs.tab2" @click="changeTab(1)">
              <b>{{year+'년'}} {{parseInt(month) + '월'}}</b>
            </div>
            <div :class="tabs.tab4" @click="next()">&gt;</div>
          </div>
        </div>
        <!-- <div class="item-container">
                    <div class="mypage-period-dates">
                        <input type="text" class="mypage-date" value="2018-06-01">
                        <span>~</span>
                        <input type="text" class="mypage-date" value="2018-12-01">
                        <button class="button-rounded-navy">조회</button>
                    </div>
        </div>-->
      </div>
    </div>

    <div class="mypage-stats-graph-content">
      <div class="mypage-stats-graph-share">
        <!-- <a class="mypage-button-listview" @click="isActive=!isActive">{{activeText}}</a> -->
        <a class="mypage-button-download" @click.prevent="makeCSV">다운로드</a>
        <!-- <a class="mypage-button-facebook">공유하기</a>
        <a class="mypage-button-kakaotalk">공유하기</a>-->
      </div>
    </div>
    <div v-if="!isActive">
      <ve-histo v-if="language===1" :data="chartDataEng"></ve-histo>
      <ve-histo v-else-if="language===2" :data="chartDataEng"></ve-histo>
      <ve-histo v-else :data="chartData"></ve-histo>
    </div>
    <div v-else>
      <table class="keyboard-list">
        <tbody>
          <tr>
            <td class="id">
              <b style="padding-right: 50px;">`</b>
              [0]['타']}}%
            </td>
            <td class="id">
              <b style="padding-right: 50px;">0</b>
              [10]['타']}}%
            </td>
            <td class="id">
              <b style="padding-right: 50px;">ㅕ</b>
              [20]['타']}}%
            </td>
            <td class="id">
              <b style="padding-right: 50px;">ㅎ</b>
              [30]['타']}}%
            </td>
            <td class="id">
              <b style="padding-right: 50px;">ㅍ</b>
              [40]['타']}}%
            </td>
          </tr>
          <tr>
            <td class="id">
              <b style="padding-right: 50px;">1</b>
              [1]['타']}}%
            </td>
            <td class="id">
              <b style="padding-right: 50px;">-</b>
              [11]['타']}}%
            </td>
            <td class="id">
              <b style="padding-right: 50px;">ㅑ</b>
              [21]['타']}}%
            </td>
            <td class="id">
              <b style="padding-right: 50px;">ㅗ</b>
              [31]['타']}}%
            </td>
            <td class="id">
              <b style="padding-right: 50px;">ㅠ</b>
              [41]['타']}}%
            </td>
          </tr>
          <tr>
            <td class="id">
              <b style="padding-right: 50px;">2</b>
              [2]['타']}}%
            </td>
            <td class="id">
              <b style="padding-right: 50px;">=</b>
              [12]['타']}}%
            </td>
            <td class="id">
              <b style="padding-right: 50px;">ㅐ</b>
              [22]['타']}}%
            </td>
            <td class="id">
              <b style="padding-right: 50px;">ㅓ</b>
              [32]['타']}}%
            </td>
            <td class="id">
              <b style="padding-right: 50px;">ㅜ</b>
              [42]['타']}}%
            </td>
          </tr>
          <tr>
            <td class="id">
              <b style="padding-right: 50px;">3</b>
              [3]['타']}}%
            </td>
            <td class="id">
              <b style="padding-right: 50px;">\</b>
              [13]['타']}}%
            </td>
            <td class="id">
              <b style="padding-right: 50px;">ㅔ</b>
              [23]['타']}}%
            </td>
            <td class="id">
              <b style="padding-right: 50px;">ㅏ</b>
              [33]['타']}}%
            </td>
            <td class="id">
              <b style="padding-right: 50px;">ㅡ</b>
              [43]['타']}}%
            </td>
          </tr>
          <tr>
            <td class="id">
              <b style="padding-right: 50px;">4</b>
              [4]['타']}}%
            </td>
            <td class="id">
              <b style="padding-right: 50px;">ㅂ</b>
              [14]['타']}}%
            </td>
            <td class="id">
              <b style="padding-right: 50px;">[</b>
              [24]['타']}}%
            </td>
            <td class="id">
              <b style="padding-right: 50px;">ㅣ</b>
              [34]['타']}}%
            </td>
            <td class="id">
              <b style="padding-right: 50px;">,</b>
              [44]['타']}}%
            </td>
          </tr>
          <tr>
            <td class="id">
              <b style="padding-right: 50px;">5</b>
              [5]['타']}}%
            </td>
            <td class="id">
              <b style="padding-right: 50px;">ㅈ</b>
              [15]['타']}}%
            </td>
            <td class="id">
              <b style="padding-right: 50px;">]</b>
              [25]['타']}}%
            </td>
            <td class="id">
              <b style="padding-right: 50px;">;</b>
              [35]['타']}}%
            </td>
            <td class="id">
              <b style="padding-right: 50px;">.</b>
              [45]['타']}}%
            </td>
          </tr>
          <tr>
            <td class="id">
              <b style="padding-right: 50px;">6</b>
              [6]['타']}}%
            </td>
            <td class="id">
              <b style="padding-right: 50px;">ㄷ</b>
              [16]['타']}}%
            </td>
            <td class="id">
              <b style="padding-right: 50px;">ㅁ</b>
              [26]['타']}}%
            </td>
            <td class="id">
              <b style="padding-right: 50px;">'</b>
              [36]['타']}}%
            </td>
            <td class="id"></td>
          </tr>
          <tr>
            <td class="id">
              <b style="padding-right: 50px;">7</b>
              [7]['타']}}%
            </td>
            <td class="id">
              <b style="padding-right: 50px;">ㄱ</b>
              [17]['타']}}%
            </td>
            <td class="id">
              <b style="padding-right: 50px;">ㄴ</b>
              [27]['타']}}%
            </td>
            <td class="id">
              <b style="padding-right: 50px;">ㅋ</b>
              [37]['타']}}%
            </td>
            <td class="id"></td>
          </tr>
          <tr>
            <td class="id">
              <b style="padding-right: 50px;">8</b>
              [8]['타']}}%
            </td>
            <td class="id">
              <b style="padding-right: 50px;">ㅅ</b>
              [18]['타']}}%
            </td>
            <td class="id">
              <b style="padding-right: 50px;">ㅇ</b>
              [28]['타']}}%
            </td>
            <td class="id">
              <b style="padding-right: 50px;">ㅌ</b>
              [38]['타']}}%
            </td>
            <td class="id"></td>
          </tr>
          <tr>
            <td class="id">
              <b style="padding-right: 50px;">9</b>
              [9]['타']}}%
            </td>
            <td class="id">
              <b style="padding-right: 50px;">ㅛ</b>
              [19]['타']}}%
            </td>
            <td class="id">
              <b style="padding-right: 50px;">ㄹ</b>
              [29]['타']}}%
            </td>
            <td class="id">
              <b style="padding-right: 50px;">ㅊ</b>
              [39]['타']}}%
            </td>
            <td class="id"></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import Result from "../../utils/result";
import { ExportToCsv } from "export-to-csv";

export default {
  data() { //변수 초기화
    return {
      user: {},
      uuid: null,
      month: "",
      testthisDate: moment(new Date()).format("YYYY-MM"),
      testDate: moment(new Date()).format("YYYY-MM"),
      year: "",
      thisMonth: parseInt(moment(new Date()).format("MM")),
      thisYear: parseInt(moment(new Date()).format("YYYY")),
      language: 0,
      isLoading: false,
      day: [],
      total_input_Count: [],
      total_speed_Count: [],
      isActive: false,
      tab: 0,
      tabs: { tab1: "", tab2: "selected", tab3: "", tab4: "" },
      activeText: "리스트로 보기",
      chartData: {
        columns: ["날짜", "타"],
        rows: []
      },
      chartDataEng: {
        columns: ["날짜", "타"],
        rows: []
      },
      selectedLang: "한글",
      selectedKeyboard: "두벌식",
      keyboardType: 0,
      options: {
        fieldSeparator: ",",
        quoteStrings: '"',
        decimalSeparator: ".",
        showLabels: true,
        showTitle: true,
        title: "내타자속도",
        filename: "내타자속도",
        useTextFile: false,
        useBom: true,
        useKeysAsHeaders: true
      }
    };
  },
  created() {
    this.testDate = moment(this.testthisDate).format("YYYY-MM");
    this.year = this.testDate.split("-")[0];
    this.month = this.testDate.split("-")[1];
  },
  methods: {
    getUseruuid() { //유저 uuid얻기
      this.$EventBus.$emit("loading-add", "fetch-analdata");
      this.$axios
        .post(this.$Api2.userinfo.getuserinfo, {
          session_id: this.$root.sessionId()
        })
        .then(response => {
          if (!response) {
            return;
          }
          this.uuid = response.data.uuid;
          this.fetchAnalData();
        })
        .catch(error => {
          this.$EventBus.$emit("loading-remove", "fetch-analdata");
          console.log(error);
        });
    },

    fetchAnalData() { //월분석자료 가져오기 함수
      this.$axios
        .post(this.$Api2.analictics.keyMonthly, {
          uuid: this.uuid,
          language: this.language,
          year: this.year,
          month: parseInt(this.month)
        })
        .then(response => {
          this.chartData.rows = [];
          this.chartDataEng.rows = [];
          if (!response || response.data.result !== 0) {
            this.chartData.rows.push({
              날짜: "타자속도 정보가 없습니다.",
              타: 0
            });
            this.chartDataEng.rows.push({
              날짜: "타자속도 정보가 없습니다.",
              타: 0
            });
            this.$EventBus.$emit("loading-remove", "fetch-analdata");
            return;
          }
          console.log(response.data);
          for (var i = 0; i < response.data.data.length; i++) {
            var result =
              response.data.data[i]["total_speed_count"] /
              response.data.data[i]["total_input_count"];
            if (isNaN(result)) {
              result = 0;
            }
            if (this.language === 1 || this.language === 2) {
              this.chartDataEng.rows.push({
                날짜: response.data.data[i]["day"] + "일",
                타: result
              });
            } else {
              this.chartData.rows.push({
                날짜: response.data.data[i]["day"] + "일",
                타: result
              });
            }
          }
          this.$EventBus.$emit("loading-remove", "fetch-analdata");
        })
        .catch(error => {
          this.$EventBus.$emit("loading-remove", "fetch-analdata");
          console.log(error);
        });
    },

    fetchAnalDayData() { //일분석자료 가져오기 함수
      this.$axios
        .post(this.$Api2.analictics.keyDay, {
          uuid: this.uuid,
          language: this.language
        })
        .then(response => {
          if (!response || response.data.result !== 0) {
            this.chartData.rows.push({
              날짜: "타자속도 정보가 없습니다.",
              타: "타자속도 정보가 없습니다."
            });
            this.chartDataEng.rows.push({
              날짜: "타자속도 정보가 없습니다.",
              타: "타자속도 정보가 없습니다."
            });
            this.$EventBus.$emit("loading-remove", "fetch-analdata");
            return;
          }
          console.log(response.data);
          var result =
            response.data["TotalSpeedCount"] /
            response.data["total_input_count"];
          if (isNaN(result)) {
            result = 0;
          }
          if (this.language === 1 || this.language === 2) {
            this.chartDataEng.rows = [{ 날짜: "오늘", 타: result }];
          } else {
            this.chartData.rows = [{ 날짜: "오늘", 타: result }];
          }

          this.$EventBus.$emit("loading-remove", "fetch-analdata");
        })
        .catch(error => {
          this.$EventBus.$emit("loading-remove", "fetch-analdata");
          console.log(error);
        });
    },

    resetTabSelection() { //탭선택 재설정
      this.tabs.tab1 = "";
      this.tabs.tab2 = "selected";
      this.tabs.tab3 = "";
      this.tabs.tab4 = "";
    },

    prev() { //전달 분석자료 가져오기 함수
      this.resetTabSelection();

      this.testDate = moment(this.testDate)
        .subtract(1, "M")
        .format("YYYY-MM");
      this.year = this.testDate.split("-")[0];
      console.log(this.year);
      this.month = this.testDate.split("-")[1];
      console.log(this.month);
      this.fetchAnalData();
    },

    next() { //다음달 분서자료 가져오기 함수
      this.resetTabSelection();

      const nextMonth = moment(this.testDate)
        .add(1, "M")
        .format("YYYYMM");
      const currentMonth = moment().format("YYYYMM");

      if (nextMonth > currentMonth) {
        alert("마지막 페이지 입니다.");
      } else {
        this.testDate = moment(this.testDate)
          .add(1, "M")
          .format("YYYY-MM");
        this.year = this.testDate.split("-")[0];
        this.month = this.testDate.split("-")[1];

        this.fetchAnalData();
      }
    },

    changeTab(tabNum) { //탭변경
      switch (tabNum) {
        case 0:
          this.tabs.tab1 = "selected";
          this.tabs.tab2 = "";
          this.tabs.tab3 = "";
          this.tabs.tab4 = "";
          this.getThisMonth();
          this.fetchAnalDayData();
          break;
        case 1:
          this.tabs.tab1 = "";
          this.tabs.tab2 = "selected";
          this.tabs.tab3 = "";
          this.tabs.tab4 = "";
          this.getThisMonth();
          this.fetchAnalData();
          break;
        case 2:
          if (parseInt(this.month) < 2) {
            alert("첫 페이지 입니다.");
            this.tabs.tab1 = "";
            this.tabs.tab2 = "";
            this.tabs.tab3 = "selected";
            this.tabs.tab4 = "";
          } else {
            this.testDate = moment(this.testDate)
              .subtract(1, "M")
              .format("YYYY-MM");
            this.year = this.testDate.split("-")[0];
            console.log(this.year);
            this.month = this.testDate.split("-")[1];
            console.log(this.month);
            this.fetchAnalData();
          }
          break;
        case 3:
          /* if((this.testDate !== this.testthisDate))
                    {
                        this.testDate = moment(this.testDate).add(1,'M').format('YYYY-MM');
                        this.year = this.testDate.split('-')[0];
                        console.log(this.year);
                        this.month = this.testDate.split('-')[1];
                        console.log(this.month);
                        this.tabs.tab1 = '';
                        this.tabs.tab2 = '';
                        this.tabs.tab3 = '';
                        this.tabs.tab4 = 'selected';
                        this.fetchAnalData();
                    }
                    else
                    {
                        alert("마지막 페이지 입니다.");
                        this.tabs.tab1 = '';
                        this.tabs.tab2 = '';
                        this.tabs.tab3 = '';
                        this.tabs.tab4 = 'selected';
                        //this.month = this.thisMonth;
                        //this.fetchAnalData();
                    }
*/
          if (this.thisMonth > parseInt(this.month)) {
            this.testDate = moment(this.testDate)
              .add(1, "M")
              .format("YYYY-MM");
            this.year = this.testDate.split("-")[0];
            console.log(this.year);
            this.month = this.testDate.split("-")[1];
            console.log(this.month);
            this.tabs.tab1 = "";
            this.tabs.tab2 = "";
            this.tabs.tab3 = "";
            this.tabs.tab4 = "selected";
            this.fetchAnalData();
          } else {
            alert("마지막 페이지 입니다.");
            this.tabs.tab1 = "";
            this.tabs.tab2 = "";
            this.tabs.tab3 = "";
            this.tabs.tab4 = "selected";
          }
          break;
      }
    },

    getThisMonth() { //월얻기
      this.testDate = moment(this.testthisDate).format("YYYY-MM");
      this.year = this.testDate.split("-")[0];
      console.log(this.year);
      this.month = this.testDate.split("-")[1];
    },
    getThisYear() { //년얻기
      this.year = parseInt(moment(new Date()).format("YYYY"));
    },
    makeCSV() { //csv출력
      const csvExporter = new ExportToCsv(this.options);
      if (this.language === 1 || this.language === 2) {
        csvExporter.generateCsv(this.chartDataEng.rows);
      } else {
        csvExporter.generateCsv(this.chartData.rows);
      }
    }
  },

  mounted() {
    this.getUseruuid();
  },

  watch: {
    isActive: function(newVal, oldVal) { //보기타입 선택
      if (!this.isActive) {
        this.activeText = "리스트로 보기";
      } else {
        this.activeText = "그래프로 보기";
      }
    },

    selectedLang: function(newVal, oldVal) { //언어 선택
      switch (this.selectedLang) {
        case "한글":
          this.selectedKeyboard = "두벌식";
          this.keyboardType = 0;
          break;
        case "영어":
          this.selectedKeyboard = "쿼티";
          this.keyboardType = 1;
          break;
      }
    },
    selectedKeyboard: function(newVal, oldVal) { //키보드 선택
      switch (this.selectedKeyboard) {
        case "두벌식":
          this.language = 0;
          this.changeTab(1);
          break;
        case "세벌식 390":
          this.language = 3;
          this.changeTab(1);
          break;
        case "세벌식 순아래":
          this.language = 4;
          this.changeTab(1);
          break;
        case "세벌식 최종":
          this.language = 5;
          this.changeTab(1);
          break;
        case "쿼티":
          this.language = 1;
          this.changeTab(1);
          break;
        case "드보락":
          this.language = 2;
          this.changeTab(1);
          break;
      }
    }
  }
};
</script>


