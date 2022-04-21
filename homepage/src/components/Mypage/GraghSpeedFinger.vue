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
        <a class="mypage-button-listview" @click="isActive=!isActive">{{activeText}}</a>
        <a class="mypage-button-download" @click.prevent="makeCSV">다운로드</a>
        <!-- <a class="mypage-button-facebook">공유하기</a>
        <a class="mypage-button-kakaotalk">공유하기</a>-->
      </div>
    </div>
    <div v-if="!isActive">
      <ve-histo v-if="language===0" :data="chartData"></ve-histo>
      <ve-histo v-else-if="language===1" :data="chartDataEng"></ve-histo>
      <ve-histo v-else-if="language===2" :data="chartDataEngDvo"></ve-histo>
      <ve-histo v-else-if="language===3" :data="chartData390"></ve-histo>
      <ve-histo v-else-if="language===4" :data="chartData3Down"></ve-histo>
      <ve-histo v-else-if="language===5" :data="chartData3Final"></ve-histo>
    </div>
    <div v-else>
      <table class="keyboard-list" v-if="language===0">
        <table class="tg" style="width: 100%;">
          <tr>
            <td class="tg-3mbc">{{chartData.rows[0]['손가락']}}</td>
            <td class="tg-p1mp">{{chartData.rows[0]['속도(타)']}}타</td>
          </tr>
          <tr>
            <td class="tg-3mbc">{{chartData.rows[1]['손가락']}}</td>
            <td class="tg-p1mp">{{chartData.rows[1]['속도(타)']}}타</td>
          </tr>
          <tr>
            <td class="tg-3mbc">{{chartData.rows[2]['손가락']}}</td>
            <td class="tg-p1mp">{{chartData.rows[2]['속도(타)']}}타</td>
          </tr>
          <tr>
            <td class="tg-3mbc">{{chartData.rows[3]['손가락']}}</td>
            <td class="tg-p1mp">{{chartData.rows[3]['속도(타)']}}타</td>
          </tr>
          <tr>
            <td class="tg-3mbc">{{chartData.rows[4]['손가락']}}</td>
            <td class="tg-p1mp">{{chartData.rows[4]['속도(타)']}}타</td>
          </tr>
          <tr>
            <td class="tg-3mbc">{{chartData.rows[5]['손가락']}}</td>
            <td class="tg-p1mp">{{chartData.rows[5]['속도(타)']}}타</td>
          </tr>
          <tr>
            <td class="tg-3mbc">{{chartData.rows[6]['손가락']}}</td>
            <td class="tg-p1mp">{{chartData.rows[6]['속도(타)']}}타</td>
          </tr>
          <tr>
            <td class="tg-3mbc">{{chartData.rows[7]['손가락']}}</td>
            <td class="tg-p1mp">{{chartData.rows[7]['속도(타)']}}타</td>
          </tr>
        </table>
      </table>
      <table class="keyboard-list" v-else-if="language===1">
        <table class="tg" style="width: 100%;">
          <tr>
            <td class="tg-3mbc">{{chartDataEng.rows[0]['손가락']}}</td>
            <td class="tg-p1mp">{{chartDataEng.rows[0]['속도(타)']}}타</td>
          </tr>
          <tr>
            <td class="tg-3mbc">{{chartDataEng.rows[1]['손가락']}}</td>
            <td class="tg-p1mp">{{chartDataEng.rows[1]['속도(타)']}}타</td>
          </tr>
          <tr>
            <td class="tg-3mbc">{{chartDataEng.rows[2]['손가락']}}</td>
            <td class="tg-p1mp">{{chartDataEng.rows[2]['속도(타)']}}타</td>
          </tr>
          <tr>
            <td class="tg-3mbc">{{chartDataEng.rows[3]['손가락']}}</td>
            <td class="tg-p1mp">{{chartDataEng.rows[3]['속도(타)']}}타</td>
          </tr>
          <tr>
            <td class="tg-3mbc">{{chartDataEng.rows[4]['손가락']}}</td>
            <td class="tg-p1mp">{{chartDataEng.rows[4]['속도(타)']}}타</td>
          </tr>
          <tr>
            <td class="tg-3mbc">{{chartDataEng.rows[5]['손가락']}}</td>
            <td class="tg-p1mp">{{chartDataEng.rows[5]['속도(타)']}}타</td>
          </tr>
          <tr>
            <td class="tg-3mbc">{{chartDataEng.rows[6]['손가락']}}</td>
            <td class="tg-p1mp">{{chartDataEng.rows[6]['속도(타)']}}타</td>
          </tr>
          <tr>
            <td class="tg-3mbc">{{chartDataEng.rows[7]['손가락']}}</td>
            <td class="tg-p1mp">{{chartDataEng.rows[7]['속도(타)']}}타</td>
          </tr>
        </table>
      </table>
      <table class="keyboard-list" v-else-if="language===2">
        <table class="tg" style="width: 100%;">
          <tr>
            <td class="tg-3mbc">{{chartDataEngDvo.rows[0]['손가락']}}</td>
            <td class="tg-p1mp">{{chartDataEngDvo.rows[0]['속도(타)']}}타</td>
          </tr>
          <tr>
            <td class="tg-3mbc">{{chartDataEngDvo.rows[1]['손가락']}}</td>
            <td class="tg-p1mp">{{chartDataEngDvo.rows[1]['속도(타)']}}타</td>
          </tr>
          <tr>
            <td class="tg-3mbc">{{chartDataEngDvo.rows[2]['손가락']}}</td>
            <td class="tg-p1mp">{{chartDataEngDvo.rows[2]['속도(타)']}}타</td>
          </tr>
          <tr>
            <td class="tg-3mbc">{{chartDataEngDvo.rows[3]['손가락']}}</td>
            <td class="tg-p1mp">{{chartDataEngDvo.rows[3]['속도(타)']}}타</td>
          </tr>
          <tr>
            <td class="tg-3mbc">{{chartDataEngDvo.rows[4]['손가락']}}</td>
            <td class="tg-p1mp">{{chartDataEngDvo.rows[4]['속도(타)']}}타</td>
          </tr>
          <tr>
            <td class="tg-3mbc">{{chartDataEngDvo.rows[5]['손가락']}}</td>
            <td class="tg-p1mp">{{chartDataEngDvo.rows[5]['속도(타)']}}타</td>
          </tr>
          <tr>
            <td class="tg-3mbc">{{chartDataEngDvo.rows[6]['손가락']}}</td>
            <td class="tg-p1mp">{{chartDataEngDvo.rows[6]['속도(타)']}}타</td>
          </tr>
          <tr>
            <td class="tg-3mbc">{{chartDataEngDvo.rows[7]['손가락']}}</td>
            <td class="tg-p1mp">{{chartDataEngDvo.rows[7]['속도(타)']}}타</td>
          </tr>
        </table>
      </table>
      <table class="keyboard-list" v-else-if="language===3">
        <table class="tg" style="width: 100%;">
          <tr>
            <td class="tg-3mbc">{{chartData390.rows[0]['손가락']}}</td>
            <td class="tg-p1mp">{{chartData390.rows[0]['속도(타)']}}타</td>
          </tr>
          <tr>
            <td class="tg-3mbc">{{chartData390.rows[1]['손가락']}}</td>
            <td class="tg-p1mp">{{chartData390.rows[1]['속도(타)']}}타</td>
          </tr>
          <tr>
            <td class="tg-3mbc">{{chartData390.rows[2]['손가락']}}</td>
            <td class="tg-p1mp">{{chartData390.rows[2]['속도(타)']}}타</td>
          </tr>
          <tr>
            <td class="tg-3mbc">{{chartData390.rows[3]['손가락']}}</td>
            <td class="tg-p1mp">{{chartData390.rows[3]['속도(타)']}}타</td>
          </tr>
          <tr>
            <td class="tg-3mbc">{{chartData390.rows[4]['손가락']}}</td>
            <td class="tg-p1mp">{{chartData390.rows[4]['속도(타)']}}타</td>
          </tr>
          <tr>
            <td class="tg-3mbc">{{chartData390.rows[5]['손가락']}}</td>
            <td class="tg-p1mp">{{chartData390.rows[5]['속도(타)']}}타</td>
          </tr>
          <tr>
            <td class="tg-3mbc">{{chartData390.rows[6]['손가락']}}</td>
            <td class="tg-p1mp">{{chartData390.rows[6]['속도(타)']}}타</td>
          </tr>
          <tr>
            <td class="tg-3mbc">{{chartData390.rows[7]['손가락']}}</td>
            <td class="tg-p1mp">{{chartData390.rows[7]['속도(타)']}}타</td>
          </tr>
        </table>
      </table>
      <table class="keyboard-list" v-else-if="language===4">
        <table class="tg" style="width: 100%;">
          <tr>
            <td class="tg-3mbc">{{chartData3Down.rows[0]['손가락']}}</td>
            <td class="tg-p1mp">{{chartData3Down.rows[0]['속도(타)']}}타</td>
          </tr>
          <tr>
            <td class="tg-3mbc">{{chartData3Down.rows[1]['손가락']}}</td>
            <td class="tg-p1mp">{{chartData3Down.rows[1]['속도(타)']}}타</td>
          </tr>
          <tr>
            <td class="tg-3mbc">{{chartData3Down.rows[2]['손가락']}}</td>
            <td class="tg-p1mp">{{chartData3Down.rows[2]['속도(타)']}}타</td>
          </tr>
          <tr>
            <td class="tg-3mbc">{{chartData3Down.rows[3]['손가락']}}</td>
            <td class="tg-p1mp">{{chartData3Down.rows[3]['속도(타)']}}타</td>
          </tr>
          <tr>
            <td class="tg-3mbc">{{chartData3Down.rows[4]['손가락']}}</td>
            <td class="tg-p1mp">{{chartData3Down.rows[4]['속도(타)']}}타</td>
          </tr>
          <tr>
            <td class="tg-3mbc">{{chartData3Down.rows[5]['손가락']}}</td>
            <td class="tg-p1mp">{{chartData3Down.rows[5]['속도(타)']}}타</td>
          </tr>
          <tr>
            <td class="tg-3mbc">{{chartData3Down.rows[6]['손가락']}}</td>
            <td class="tg-p1mp">{{chartData3Down.rows[6]['속도(타)']}}타</td>
          </tr>
          <tr>
            <td class="tg-3mbc">{{chartData3Down.rows[7]['손가락']}}</td>
            <td class="tg-p1mp">{{chartData3Down.rows[7]['속도(타)']}}타</td>
          </tr>
        </table>
      </table>
      <table class="keyboard-list" v-else-if="language===5">
        <table class="tg" style="width: 100%;">
          <tr>
            <td class="tg-3mbc">{{chartData3Final.rows[0]['손가락']}}</td>
            <td class="tg-p1mp">{{chartData3Final.rows[0]['속도(타)']}}타</td>
          </tr>
          <tr>
            <td class="tg-3mbc">{{chartData3Final.rows[1]['손가락']}}</td>
            <td class="tg-p1mp">{{chartData3Final.rows[1]['속도(타)']}}타</td>
          </tr>
          <tr>
            <td class="tg-3mbc">{{chartData3Final.rows[2]['손가락']}}</td>
            <td class="tg-p1mp">{{chartData3Final.rows[2]['속도(타)']}}타</td>
          </tr>
          <tr>
            <td class="tg-3mbc">{{chartData3Final.rows[3]['손가락']}}</td>
            <td class="tg-p1mp">{{chartData3Final.rows[3]['속도(타)']}}타</td>
          </tr>
          <tr>
            <td class="tg-3mbc">{{chartData3Final.rows[4]['손가락']}}</td>
            <td class="tg-p1mp">{{chartData3Final.rows[4]['속도(타)']}}타</td>
          </tr>
          <tr>
            <td class="tg-3mbc">{{chartData3Final.rows[5]['손가락']}}</td>
            <td class="tg-p1mp">{{chartData3Final.rows[5]['속도(타)']}}타</td>
          </tr>
          <tr>
            <td class="tg-3mbc">{{chartData3Final.rows[6]['손가락']}}</td>
            <td class="tg-p1mp">{{chartData3Final.rows[6]['속도(타)']}}타</td>
          </tr>
          <tr>
            <td class="tg-3mbc">{{chartData3Final.rows[7]['손가락']}}</td>
            <td class="tg-p1mp">{{chartData3Final.rows[7]['속도(타)']}}타</td>
          </tr>
        </table>
      </table>
    </div>
  </div>
</template>
<script>
import Result from "../../utils/result";
import moment from "moment";
import { ExportToCsv } from "export-to-csv";
export default {
  data() {//변수 초기화
    return {
      user: {},
      uuid: null,
      language: 0,
      isLoading: false,
      input_total_ACC: [],
      total_Count: [],
      isActive: false,
      month: "",
      testthisDate: moment(new Date()).format("YYYY-MM"),
      testDate: moment(new Date()).format("YYYY-MM"),
      year: "",
      thisMonth: parseInt(moment(new Date()).format("MM")),
      tab: 0,
      tabs: { tab1: "", tab2: "selected", tab3: "", tab4: "" },
      activeText: "리스트로 보기",
      chartData: {
        columns: ["손가락", "속도(타)"],
        rows: [
          { 손가락: "왼손 소지", "속도(타)": 0 },
          { 손가락: "왼손 약지", "속도(타)": 0 },
          { 손가락: "왼손 중지", "속도(타)": 0 },
          { 손가락: "왼손 검지", "속도(타)": 0 },
          { 손가락: "오른손 검지", "속도(타)": 0 },
          { 손가락: "오른손 중지", "속도(타)": 0 },
          { 손가락: "오른손 약지", "속도(타)": 0 },
          { 손가락: "오른손 소지", "속도(타)": 0 }
        ]
      },
      chartDataEng: {
        columns: ["손가락", "속도(타)"],
        rows: [
          { 손가락: "왼손 소지", "속도(타)": 0 },
          { 손가락: "왼손 약지", "속도(타)": 0 },
          { 손가락: "왼손 중지", "속도(타)": 0 },
          { 손가락: "왼손 검지", "속도(타)": 0 },
          { 손가락: "오른손 검지", "속도(타)": 0 },
          { 손가락: "오른손 중지", "속도(타)": 0 },
          { 손가락: "오른손 약지", "속도(타)": 0 },
          { 손가락: "오른손 소지", "속도(타)": 0 }
        ]
      },
      chartData390: {
        columns: ["손가락", "속도(타)"],
        rows: [
          { 손가락: "왼손 소지", "속도(타)": 0 },
          { 손가락: "왼손 약지", "속도(타)": 0 },
          { 손가락: "왼손 중지", "속도(타)": 0 },
          { 손가락: "왼손 검지", "속도(타)": 0 },
          { 손가락: "오른손 검지", "속도(타)": 0 },
          { 손가락: "오른손 중지", "속도(타)": 0 },
          { 손가락: "오른손 약지", "속도(타)": 0 },
          { 손가락: "오른손 소지", "속도(타)": 0 }
        ]
      },
      chartData3Down: {
        columns: ["손가락", "속도(타)"],
        rows: [
          { 손가락: "왼손 소지", "속도(타)": 0 },
          { 손가락: "왼손 약지", "속도(타)": 0 },
          { 손가락: "왼손 중지", "속도(타)": 0 },
          { 손가락: "왼손 검지", "속도(타)": 0 },
          { 손가락: "오른손 검지", "속도(타)": 0 },
          { 손가락: "오른손 중지", "속도(타)": 0 },
          { 손가락: "오른손 약지", "속도(타)": 0 },
          { 손가락: "오른손 소지", "속도(타)": 0 }
        ]
      },
      chartData3Final: {
        columns: ["손가락", "속도(타)"],
        rows: [
          { 손가락: "왼손 소지", "속도(타)": 0 },
          { 손가락: "왼손 약지", "속도(타)": 0 },
          { 손가락: "왼손 중지", "속도(타)": 0 },
          { 손가락: "왼손 검지", "속도(타)": 0 },
          { 손가락: "오른손 검지", "속도(타)": 0 },
          { 손가락: "오른손 중지", "속도(타)": 0 },
          { 손가락: "오른손 약지", "속도(타)": 0 },
          { 손가락: "오른손 소지", "속도(타)": 0 }
        ]
      },
      chartDataEngDvo: {
        columns: ["손가락", "속도(타)"],
        rows: [
          { 손가락: "왼손 소지", "속도(타)": 0 },
          { 손가락: "왼손 약지", "속도(타)": 0 },
          { 손가락: "왼손 중지", "속도(타)": 0 },
          { 손가락: "왼손 검지", "속도(타)": 0 },
          { 손가락: "오른손 검지", "속도(타)": 0 },
          { 손가락: "오른손 중지", "속도(타)": 0 },
          { 손가락: "오른손 약지", "속도(타)": 0 },
          { 손가락: "오른손 소지", "속도(타)": 0 }
        ]
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
        title: "내손가락빠르기",
        filename: "내손가락빠르기",
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
    getUseruuid() { //유저 uuid가져오기
      this.$EventBus.$emit("loading-add", "fetch-analdata");
      this.$axios
        .post(this.$Api2.userinfo.getuserinfo, {
          session_id: this.$root.sessionId()
        })
        .then(response => {
          if (!response) {
            return;
          }
          console.log(response.data);
          this.uuid = response.data.uuid;

          this.fetchAnalData();
        })
        .catch(error => {
          this.$EventBus.$emit("loading-remove", "fetch-analdata");
          console.log(error);
        });
    },

    fetchAnalData() { //월별 분석자료 가져오기 함수
      this.$axios
        .post(this.$Api2.analictics.keyFingerSpeedMonthly, {
          uuid: this.uuid,
          language: this.language,
          year: this.year,
          month: parseInt(this.month)
        })
        .then(response => {
          console.log(response.data);
          this.$EventBus.$emit("loading-remove", "fetch-analdata");
          if (!response || response.data.result !== 0) {
            for (var i = 0; i < this.chartData.rows.length; i++) {
              this.chartData.rows[i]["속도(타)"] = 0;
              this.chartDataEng.rows[i]["속도(타)"] = 0;
            }
            return;
          }
          this.total_ACC = [];
          this.total_Count = [];

          for (var i = 0; i < 8; i++) {
            this.total_ACC.push(response.data.data[i].input_total_acc);
            this.total_Count.push(response.data.data[i].total_speed);
            switch (this.language) {
              case 0:
                this.chartData.rows[i]["속도(타)"] = parseInt(
                  this.total_Count[i] / this.total_ACC[i]
                );
                if (isNaN(this.chartData.rows[i]["속도(타)"])) {
                  this.chartData.rows[i]["속도(타)"] = 0;
                }
                break;
              case 1:
                this.chartDataEng.rows[i]["속도(타)"] = parseInt(
                  this.total_Count[i] / this.total_ACC[i]
                );
                if (isNaN(this.chartDataEng.rows[i]["속도(타)"])) {
                  this.chartDataEng.rows[i]["속도(타)"] = 0;
                }
                break;
              case 2:
                this.chartDataEngDvo.rows[i]["속도(타)"] = parseInt(
                  this.total_Count[i] / this.total_ACC[i]
                );
                if (isNaN(this.chartDataEngDvo.rows[i]["속도(타)"])) {
                  this.chartDataEngDvo.rows[i]["속도(타)"] = 0;
                }
                break;
              case 3:
                this.chartData390.rows[i]["속도(타)"] = parseInt(
                  this.total_Count[i] / this.total_ACC[i]
                );
                if (isNaN(this.chartData390.rows[i]["속도(타)"])) {
                  this.chartData390.rows[i]["속도(타)"] = 0;
                }
                break;
              case 4:
                this.chartData3Down.rows[i]["속도(타)"] = parseInt(
                  this.total_Count[i] / this.total_ACC[i]
                );
                if (isNaN(this.chartData3Down.rows[i]["속도(타)"])) {
                  this.chartData3Down.rows[i]["속도(타)"] = 0;
                }
                break;
              case 5:
                this.chartData3Final.rows[i]["속도(타)"] = parseInt(
                  this.total_Count[i] / this.total_ACC[i]
                );
                if (isNaN(this.chartData3Final.rows[i]["속도(타)"])) {
                  this.chartData3Final.rows[i]["속도(타)"] = 0;
                }
                break;
            }
            console.log(this.chartData.rows[i]["속도(타)"]);
          }
        })
        .catch(error => {
          this.$EventBus.$emit("loading-remove", "fetch-analdata");
          console.log(error);
        });
    },

    fetchAnalDayData() { //일별 분석자료 가져오기 함수
      this.$axios
        .post(this.$Api2.analictics.keyFingerSpeedDay, {
          uuid: this.uuid,
          language: this.language
        })
        .then(response => {
          console.log(response.data);

          if (!response || response.data.result !== 0) {
            for (var i = 0; i < this.chartData.rows.length; i++) {
              this.chartData.rows[i]["속도(타)"] = 0;
            }
            this.$EventBus.$emit("loading-remove", "fetch-analdata");
            return;
          }
          this.total_ACC = [];
          this.total_Count = [];

          for (var i = 0; i < 8; i++) {
            this.total_ACC.push(response.data.data[i].input_total_acc);
            this.total_Count.push(response.data.data[i].total_speed);

            switch (this.language) {
              case 0:
                this.chartData.rows[i]["속도(타)"] = parseInt(
                  this.total_Count[i] / this.total_ACC[i]
                );
                if (isNaN(this.chartData.rows[i]["속도(타)"])) {
                  this.chartData.rows[i]["속도(타)"] = 0;
                }
                break;
              case 1:
                this.chartDataEng.rows[i]["속도(타)"] = parseInt(
                  this.total_Count[i] / this.total_ACC[i]
                );
                if (isNaN(this.chartDataEng.rows[i]["속도(타)"])) {
                  this.chartDataEng.rows[i]["속도(타)"] = 0;
                }
                break;
              case 2:
                this.chartDataEngDvo.rows[i]["속도(타)"] = parseInt(
                  this.total_Count[i] / this.total_ACC[i]
                );
                if (isNaN(this.chartDataEngDvo.rows[i]["속도(타)"])) {
                  this.chartDataEngDvo.rows[i]["속도(타)"] = 0;
                }
                break;
              case 3:
                this.chartData390.rows[i]["속도(타)"] = parseInt(
                  this.total_Count[i] / this.total_ACC[i]
                );
                if (isNaN(this.chartData390.rows[i]["속도(타)"])) {
                  this.chartData390.rows[i]["속도(타)"] = 0;
                }
                break;
              case 4:
                this.chartData3Down.rows[i]["속도(타)"] = parseInt(
                  this.total_Count[i] / this.total_ACC[i]
                );
                if (isNaN(this.chartData3Down.rows[i]["속도(타)"])) {
                  this.chartData3Down.rows[i]["속도(타)"] = 0;
                }
                break;
              case 5:
                this.chartData3Final.rows[i]["속도(타)"] = parseInt(
                  this.total_Count[i] / this.total_ACC[i]
                );
                if (isNaN(this.chartData3Final.rows[i]["속도(타)"])) {
                  this.chartData3Final.rows[i]["속도(타)"] = 0;
                }
                break;
            }
            console.log(this.chartData.rows[i]["속도(타)"]);
          }

          this.$EventBus.$emit("loading-remove", "fetch-analdata");
        })
        .catch(error => {
          this.$EventBus.$emit("loading-remove", "fetch-analdata");
          console.log(error);
        });
    },

    resetTabSelection() { //탭 선택 재설정
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
      this.month = this.testDate.split("-")[1];
      this.fetchAnalData();
    },

    next() { //이달 분석자료 가져오기 함수
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

    changeTab(tabNum) { //탭 변경하기
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

    getThisMonth() { //월 얻기
      this.testDate = moment(this.testthisDate).format("YYYY-MM");
      this.year = this.testDate.split("-")[0];
      console.log(this.year);
      this.month = this.testDate.split("-")[1];
    },
    getThisYear() { //년 얻기
      this.year = parseInt(moment(new Date()).format("YYYY"));
    },
    makeCSV() { //csv출력
      const csvExporter = new ExportToCsv(this.options);
      switch (this.language) {
        case 0:
          csvExporter.generateCsv(this.chartData.rows);
          break;
        case 1:
          csvExporter.generateCsv(this.chartDataEng.rows);
          break;
        case 2:
          csvExporter.generateCsv(this.chartDataEngDvo.rows);
          break;
        case 3:
          csvExporter.generateCsv(this.chartData390.rows);
          break;
        case 4:
          csvExporter.generateCsv(this.chartData3Down.rows);
          break;
        case 5:
          csvExporter.generateCsv(this.chartData3Final.rows);
          break;
      }
    }
  },

  mounted() {
    this.getUseruuid();
  },

  watch: {
    isActive: function(newVal, oldVal) { //보기타입 선택하기
      if (!this.isActive) {
        this.activeText = "리스트로 보기";
      } else {
        this.activeText = "그래프로 보기";
      }
    },
    selectedLang: function(newVal, oldVal) { //언어 변경
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
<style>
.tg {
  border-collapse: collapse;
  border-spacing: 0;
  border-color: #ccc;
}
.tg td {
  font-family: Arial, sans-serif;
  font-size: 14px;
  padding: 10px 5px;
  border-style: solid;
  border-width: 1px;
  overflow: hidden;
  word-break: normal;
  border-color: #ccc;
  color: #333;
  background-color: #fff;
}
.tg .tg-3mbc {
  background-color: #f4f5f6;
  font-weight: bold;
  font-size: 16px;
  border-color: inherit;
  text-align: right;
  vertical-align: middle;
  width: 50%;
  padding-right: 15px;
}
.tg .tg-p1mp {
  background-color: #f9f9f9;
  font-size: 16px;
  border-color: inherit;
  text-align: left;
  vertical-align: middle;
  width: 50%;
  padding-left: 15px;
}
</style>





