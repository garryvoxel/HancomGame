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
    <!-- <div v-else>
            <table class="keyboard-list" v-if="language===0">
                <tbody>
                    <tr>
                        <td class="id"><b style="padding-right: 50px;">{{chartData.rows[0]['자판']}}</b>  {{chartData.rows[0]['속도(타)']}}타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartData.rows[10]['자판']}}</b>  {{chartData.rows[10]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartData.rows[20]['자판']}}</b>  {{chartData.rows[20]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartData.rows[30]['자판']}}</b>  {{chartData.rows[30]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartData.rows[40]['자판']}}</b>  {{chartData.rows[40]['속도(타)']}} 타</td>
                    </tr>
                    <tr>
                        <td class="id"><b style="padding-right: 50px;">{{chartData.rows[1]['자판']}}</b>  {{chartData.rows[1]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartData.rows[11]['자판']}}</b>  {{chartData.rows[11]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartData.rows[21]['자판']}}</b>  {{chartData.rows[21]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartData.rows[31]['자판']}}</b>  {{chartData.rows[31]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartData.rows[41]['자판']}}</b>  {{chartData.rows[41]['속도(타)']}} 타</td>
                    </tr>
                    <tr>
                        <td class="id"><b style="padding-right: 50px;">{{chartData.rows[2]['자판']}}</b>  {{chartData.rows[2]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartData.rows[12]['자판']}}</b>  {{chartData.rows[12]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartData.rows[22]['자판']}}</b>  {{chartData.rows[22]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartData.rows[32]['자판']}}</b>  {{chartData.rows[32]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartData.rows[42]['자판']}}</b>  {{chartData.rows[42]['속도(타)']}} 타</td>
                    </tr>
                    <tr>
                        <td class="id"><b style="padding-right: 50px;">{{chartData.rows[3]['자판']}}</b>  {{chartData.rows[3]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartData.rows[13]['자판']}}</b>  {{chartData.rows[13]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartData.rows[23]['자판']}}</b>  {{chartData.rows[23]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartData.rows[33]['자판']}}</b>  {{chartData.rows[33]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartData.rows[43]['자판']}}</b>  {{chartData.rows[43]['속도(타)']}} 타</td>
                    </tr>
                    <tr>
                        <td class="id"><b style="padding-right: 50px;">{{chartData.rows[4]['자판']}}</b>  {{chartData.rows[4]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartData.rows[14]['자판']}}</b>  {{chartData.rows[14]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartData.rows[24]['자판']}}</b>  {{chartData.rows[24]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartData.rows[34]['자판']}}</b>  {{chartData.rows[34]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartData.rows[44]['자판']}}</b>  {{chartData.rows[44]['속도(타)']}} 타</td>
                    </tr>
                    <tr>
                        <td class="id"><b style="padding-right: 50px;">{{chartData.rows[5]['자판']}}</b>  {{chartData.rows[5]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartData.rows[15]['자판']}}</b>  {{chartData.rows[15]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartData.rows[25]['자판']}}</b>  {{chartData.rows[25]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartData.rows[35]['자판']}}</b>  {{chartData.rows[35]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartData.rows[45]['자판']}}</b>  {{chartData.rows[45]['속도(타)']}} 타</td>
                    </tr>
                    <tr>
                        <td class="id"><b style="padding-right: 50px;">{{chartData.rows[6]['자판']}}</b>  {{chartData.rows[6]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartData.rows[16]['자판']}}</b>  {{chartData.rows[16]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartData.rows[26]['자판']}}</b>  {{chartData.rows[26]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartData.rows[36]['자판']}}</b>  {{chartData.rows[36]['속도(타)']}} 타</td>
                        <td class="id"></td>
                    </tr>
                    <tr>
                        <td class="id"><b style="padding-right: 50px;">{{chartData.rows[7]['자판']}}</b>  {{chartData.rows[7]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartData.rows[17]['자판']}}</b>  {{chartData.rows[17]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartData.rows[27]['자판']}}</b>  {{chartData.rows[27]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartData.rows[37]['자판']}}</b>  {{chartData.rows[37]['속도(타)']}} 타</td>
                        <td class="id"></td>
                    </tr>
                    <tr>
                        <td class="id"><b style="padding-right: 50px;">{{chartData.rows[8]['자판']}}</b>  {{chartData.rows[8]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartData.rows[18]['자판']}}</b>  {{chartData.rows[18]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartData.rows[28]['자판']}}</b>  {{chartData.rows[28]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartData.rows[29]['자판']}}</b>  {{chartData.rows[38]['속도(타)']}} 타</td>
                        <td class="id"></td>
                    </tr>
                    <tr>
                        <td class="id"><b style="padding-right: 50px;">{{chartData.rows[9]['자판']}}</b>  {{chartData.rows[9]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartData.rows[19]['자판']}}</b>  {{chartData.rows[19]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartData.rows[29]['자판']}}</b>  {{chartData.rows[29]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartData.rows[39]['자판']}}</b>  {{chartData.rows[39]['속도(타)']}} 타</td>
                        <td class="id"></td>
                    </tr>
                </tbody>
            </table>
            <table class="keyboard-list" v-else-if="language===1">
                <tbody>
                    <tr>
                        <td class="id"><b style="padding-right: 50px;">{{chartDataEng.rows[0]['자판']}}</b>  {{chartDataEng.rows[0]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartDataEng.rows[10]['자판']}}</b>  {{chartDataEng.rows[10]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartDataEng.rows[20]['자판']}}</b>  {{chartDataEng.rows[20]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartDataEng.rows[30]['자판']}}</b>  {{chartDataEng.rows[30]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartDataEng.rows[40]['자판']}}</b>  {{chartDataEng.rows[40]['속도(타)']}} 타</td>
                    </tr>
                    <tr>
                        <td class="id"><b style="padding-right: 50px;">{{chartDataEng.rows[1]['자판']}}</b>  {{chartDataEng.rows[1]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartDataEng.rows[11]['자판']}}</b>  {{chartDataEng.rows[11]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartDataEng.rows[21]['자판']}}</b>  {{chartDataEng.rows[21]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartDataEng.rows[31]['자판']}}</b>  {{chartDataEng.rows[31]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartDataEng.rows[41]['자판']}}</b>  {{chartDataEng.rows[41]['속도(타)']}} 타</td>
                    </tr>
                    <tr>
                        <td class="id"><b style="padding-right: 50px;">{{chartDataEng.rows[2]['자판']}}</b>  {{chartDataEng.rows[2]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartDataEng.rows[12]['자판']}}</b>  {{chartDataEng.rows[12]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartDataEng.rows[22]['자판']}}</b>  {{chartDataEng.rows[22]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartDataEng.rows[32]['자판']}}</b>  {{chartDataEng.rows[32]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartDataEng.rows[42]['자판']}}</b>  {{chartDataEng.rows[42]['속도(타)']}} 타</td>
                    </tr>
                    <tr>
                        <td class="id"><b style="padding-right: 50px;">{{chartDataEng.rows[3]['자판']}}</b>  {{chartDataEng.rows[3]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartDataEng.rows[13]['자판']}}</b>  {{chartDataEng.rows[13]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartDataEng.rows[23]['자판']}}</b>  {{chartDataEng.rows[23]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartDataEng.rows[33]['자판']}}</b>  {{chartDataEng.rows[33]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartDataEng.rows[43]['자판']}}</b>  {{chartDataEng.rows[43]['속도(타)']}} 타</td>
                    </tr>
                    <tr>
                        <td class="id"><b style="padding-right: 50px;">{{chartDataEng.rows[4]['자판']}}</b>  {{chartDataEng.rows[4]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartDataEng.rows[14]['자판']}}</b>  {{chartDataEng.rows[14]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartDataEng.rows[24]['자판']}}</b>  {{chartDataEng.rows[24]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartDataEng.rows[34]['자판']}}</b>  {{chartDataEng.rows[34]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartDataEng.rows[44]['자판']}}</b>  {{chartDataEng.rows[44]['속도(타)']}} 타</td>
                    </tr>
                    <tr>
                        <td class="id"><b style="padding-right: 50px;">{{chartDataEng.rows[5]['자판']}}</b>  {{chartDataEng.rows[5]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartDataEng.rows[15]['자판']}}</b>  {{chartDataEng.rows[15]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartDataEng.rows[25]['자판']}}</b>  {{chartDataEng.rows[25]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartDataEng.rows[35]['자판']}}</b>  {{chartDataEng.rows[35]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartDataEng.rows[45]['자판']}}</b>  {{chartDataEng.rows[45]['속도(타)']}} 타</td>
                    </tr>
                    <tr>
                        <td class="id"><b style="padding-right: 50px;">{{chartDataEng.rows[6]['자판']}}</b>  {{chartDataEng.rows[6]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartDataEng.rows[16]['자판']}}</b>  {{chartDataEng.rows[16]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartDataEng.rows[26]['자판']}}</b>  {{chartDataEng.rows[26]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartDataEng.rows[36]['자판']}}</b>  {{chartDataEng.rows[36]['속도(타)']}} 타</td>
                        <td class="id"></td>
                    </tr>
                    <tr>
                        <td class="id"><b style="padding-right: 50px;">{{chartDataEng.rows[7]['자판']}}</b>  {{chartDataEng.rows[7]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartDataEng.rows[17]['자판']}}</b>  {{chartDataEng.rows[17]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartDataEng.rows[27]['자판']}}</b>  {{chartDataEng.rows[27]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartDataEng.rows[37]['자판']}}</b>  {{chartDataEng.rows[37]['속도(타)']}} 타</td>
                        <td class="id"></td>
                    </tr>
                    <tr>
                        <td class="id"><b style="padding-right: 50px;">{{chartDataEng.rows[8]['자판']}}</b>  {{chartDataEng.rows[8]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartDataEng.rows[18]['자판']}}</b>  {{chartDataEng.rows[18]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartDataEng.rows[28]['자판']}}</b>  {{chartDataEng.rows[28]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartDataEng.rows[29]['자판']}}</b>  {{chartDataEng.rows[38]['속도(타)']}} 타</td>
                        <td class="id"></td>
                    </tr>
                    <tr>
                        <td class="id"><b style="padding-right: 50px;">{{chartDataEng.rows[9]['자판']}}</b>  {{chartDataEng.rows[9]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartDataEng.rows[19]['자판']}}</b>  {{chartDataEng.rows[19]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartDataEng.rows[29]['자판']}}</b>  {{chartDataEng.rows[29]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartDataEng.rows[39]['자판']}}</b>  {{chartDataEng.rows[39]['속도(타)']}} 타</td>
                        <td class="id"></td>
                    </tr>
                </tbody>                
            </table>
            <table class="keyboard-list" v-else-if="language===2">
                <tbody>
                    <tr>
                        <td class="id"><b style="padding-right: 50px;">{{chartDataEngDvo.rows[0]['자판']}}</b>  {{chartDataEngDvo.rows[0]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartDataEngDvo.rows[10]['자판']}}</b>  {{chartDataEngDvo.rows[10]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartDataEngDvo.rows[20]['자판']}}</b>  {{chartDataEngDvo.rows[20]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartDataEngDvo.rows[30]['자판']}}</b>  {{chartDataEngDvo.rows[30]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartDataEngDvo.rows[40]['자판']}}</b>  {{chartDataEngDvo.rows[40]['속도(타)']}} 타</td>
                    </tr>
                    <tr>
                        <td class="id"><b style="padding-right: 50px;">{{chartDataEngDvo.rows[1]['자판']}}</b>  {{chartDataEngDvo.rows[1]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartDataEngDvo.rows[11]['자판']}}</b>  {{chartDataEngDvo.rows[11]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartDataEngDvo.rows[21]['자판']}}</b>  {{chartDataEngDvo.rows[21]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartDataEngDvo.rows[31]['자판']}}</b>  {{chartDataEngDvo.rows[31]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartDataEngDvo.rows[41]['자판']}}</b>  {{chartDataEngDvo.rows[41]['속도(타)']}} 타</td>
                    </tr>
                    <tr>
                        <td class="id"><b style="padding-right: 50px;">{{chartDataEngDvo.rows[2]['자판']}}</b>  {{chartDataEngDvo.rows[2]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartDataEngDvo.rows[12]['자판']}}</b>  {{chartDataEngDvo.rows[12]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartDataEngDvo.rows[22]['자판']}}</b>  {{chartDataEngDvo.rows[22]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartDataEngDvo.rows[32]['자판']}}</b>  {{chartDataEngDvo.rows[32]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartDataEngDvo.rows[42]['자판']}}</b>  {{chartDataEngDvo.rows[42]['속도(타)']}} 타</td>
                    </tr>
                    <tr>
                        <td class="id"><b style="padding-right: 50px;">{{chartDataEngDvo.rows[3]['자판']}}</b>  {{chartDataEngDvo.rows[3]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartDataEngDvo.rows[13]['자판']}}</b>  {{chartDataEngDvo.rows[13]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartDataEngDvo.rows[23]['자판']}}</b>  {{chartDataEngDvo.rows[23]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartDataEngDvo.rows[33]['자판']}}</b>  {{chartDataEngDvo.rows[33]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartDataEngDvo.rows[43]['자판']}}</b>  {{chartDataEngDvo.rows[43]['속도(타)']}} 타</td>
                    </tr>
                    <tr>
                        <td class="id"><b style="padding-right: 50px;">{{chartDataEngDvo.rows[4]['자판']}}</b>  {{chartDataEngDvo.rows[4]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartDataEngDvo.rows[14]['자판']}}</b>  {{chartDataEngDvo.rows[14]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartDataEngDvo.rows[24]['자판']}}</b>  {{chartDataEngDvo.rows[24]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartDataEngDvo.rows[34]['자판']}}</b>  {{chartDataEngDvo.rows[34]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartDataEngDvo.rows[44]['자판']}}</b>  {{chartDataEngDvo.rows[44]['속도(타)']}} 타</td>
                    </tr>
                    <tr>
                        <td class="id"><b style="padding-right: 50px;">{{chartDataEngDvo.rows[5]['자판']}}</b>  {{chartDataEngDvo.rows[5]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartDataEngDvo.rows[15]['자판']}}</b>  {{chartDataEngDvo.rows[15]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartDataEngDvo.rows[25]['자판']}}</b>  {{chartDataEngDvo.rows[25]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartDataEngDvo.rows[35]['자판']}}</b>  {{chartDataEngDvo.rows[35]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartDataEngDvo.rows[45]['자판']}}</b>  {{chartDataEngDvo.rows[45]['속도(타)']}} 타</td>
                    </tr>
                    <tr>
                        <td class="id"><b style="padding-right: 50px;">{{chartDataEngDvo.rows[6]['자판']}}</b>  {{chartDataEngDvo.rows[6]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartDataEngDvo.rows[16]['자판']}}</b>  {{chartDataEngDvo.rows[16]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartDataEngDvo.rows[26]['자판']}}</b>  {{chartDataEngDvo.rows[26]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartDataEngDvo.rows[36]['자판']}}</b>  {{chartDataEngDvo.rows[36]['속도(타)']}} 타</td>
                        <td class="id"></td>
                    </tr>
                    <tr>
                        <td class="id"><b style="padding-right: 50px;">{{chartDataEngDvo.rows[7]['자판']}}</b>  {{chartDataEngDvo.rows[7]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartDataEngDvo.rows[17]['자판']}}</b>  {{chartDataEngDvo.rows[17]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartDataEngDvo.rows[27]['자판']}}</b>  {{chartDataEngDvo.rows[27]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartDataEngDvo.rows[37]['자판']}}</b>  {{chartDataEngDvo.rows[37]['속도(타)']}} 타</td>
                        <td class="id"></td>
                    </tr>
                    <tr>
                        <td class="id"><b style="padding-right: 50px;">{{chartDataEngDvo.rows[8]['자판']}}</b>  {{chartDataEngDvo.rows[8]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartDataEngDvo.rows[18]['자판']}}</b>  {{chartDataEngDvo.rows[18]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartDataEngDvo.rows[28]['자판']}}</b>  {{chartDataEngDvo.rows[28]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartDataEngDvo.rows[29]['자판']}}</b>  {{chartDataEngDvo.rows[38]['속도(타)']}} 타</td>
                        <td class="id"></td>
                    </tr>
                    <tr>
                        <td class="id"><b style="padding-right: 50px;">{{chartDataEngDvo.rows[9]['자판']}}</b>  {{chartDataEngDvo.rows[9]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartDataEngDvo.rows[19]['자판']}}</b>  {{chartDataEngDvo.rows[19]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartDataEngDvo.rows[29]['자판']}}</b>  {{chartDataEngDvo.rows[29]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartDataEngDvo.rows[39]['자판']}}</b>  {{chartDataEngDvo.rows[39]['속도(타)']}} 타</td>
                        <td class="id"></td>
                    </tr>
                </tbody>                
            </table>
            <table class="keyboard-list" v-else-if="language===3">
                <tbody>
                    <tr>
                        <td class="id"><b style="padding-right: 50px;">{{chartData390.rows[0]['자판']}}</b>  {{chartData390.rows[0]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartData390.rows[10]['자판']}}</b>  {{chartData390.rows[10]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartData390.rows[20]['자판']}}</b>  {{chartData390.rows[20]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartData390.rows[30]['자판']}}</b>  {{chartData390.rows[30]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartData390.rows[40]['자판']}}</b>  {{chartData390.rows[40]['속도(타)']}} 타</td>
                    </tr>
                    <tr>
                        <td class="id"><b style="padding-right: 50px;">{{chartData390.rows[1]['자판']}}</b>  {{chartData390.rows[1]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartData390.rows[11]['자판']}}</b>  {{chartData390.rows[11]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartData390.rows[21]['자판']}}</b>  {{chartData390.rows[21]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartData390.rows[31]['자판']}}</b>  {{chartData390.rows[31]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartData390.rows[41]['자판']}}</b>  {{chartData390.rows[41]['속도(타)']}} 타</td>
                    </tr>
                    <tr>
                        <td class="id"><b style="padding-right: 50px;">{{chartData390.rows[2]['자판']}}</b>  {{chartData390.rows[2]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartData390.rows[12]['자판']}}</b>  {{chartData390.rows[12]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartData390.rows[22]['자판']}}</b>  {{chartData390.rows[22]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartData390.rows[32]['자판']}}</b>  {{chartData390.rows[32]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartData390.rows[42]['자판']}}</b>  {{chartData390.rows[42]['속도(타)']}} 타</td>
                    </tr>
                    <tr>
                        <td class="id"><b style="padding-right: 50px;">{{chartData390.rows[3]['자판']}}</b>  {{chartData390.rows[3]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartData390.rows[13]['자판']}}</b>  {{chartData390.rows[13]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartData390.rows[23]['자판']}}</b>  {{chartData390.rows[23]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartData390.rows[33]['자판']}}</b>  {{chartData390.rows[33]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartData390.rows[43]['자판']}}</b>  {{chartData390.rows[43]['속도(타)']}} 타</td>
                    </tr>
                    <tr>
                        <td class="id"><b style="padding-right: 50px;">{{chartData390.rows[4]['자판']}}</b>  {{chartData390.rows[4]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartData390.rows[14]['자판']}}</b>  {{chartData390.rows[14]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartData390.rows[24]['자판']}}</b>  {{chartData390.rows[24]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartData390.rows[34]['자판']}}</b>  {{chartData390.rows[34]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartData390.rows[44]['자판']}}</b>  {{chartData390.rows[44]['속도(타)']}} 타</td>
                    </tr>
                    <tr>
                        <td class="id"><b style="padding-right: 50px;">{{chartData390.rows[5]['자판']}}</b>  {{chartData390.rows[5]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartData390.rows[15]['자판']}}</b>  {{chartData390.rows[15]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartData390.rows[25]['자판']}}</b>  {{chartData390.rows[25]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartData390.rows[35]['자판']}}</b>  {{chartData390.rows[35]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartData390.rows[45]['자판']}}</b>  {{chartData390.rows[45]['속도(타)']}} 타</td>
                    </tr>
                    <tr>
                        <td class="id"><b style="padding-right: 50px;">{{chartData390.rows[6]['자판']}}</b>  {{chartData390.rows[6]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartData390.rows[16]['자판']}}</b>  {{chartData390.rows[16]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartData390.rows[26]['자판']}}</b>  {{chartData390.rows[26]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartData390.rows[36]['자판']}}</b>  {{chartData390.rows[36]['속도(타)']}} 타</td>
                        <td class="id"></td>
                    </tr>
                    <tr>
                        <td class="id"><b style="padding-right: 50px;">{{chartData390.rows[7]['자판']}}</b>  {{chartData390.rows[7]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartData390.rows[17]['자판']}}</b>  {{chartData390.rows[17]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartData390.rows[27]['자판']}}</b>  {{chartData390.rows[27]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartData390.rows[37]['자판']}}</b>  {{chartData390.rows[37]['속도(타)']}} 타</td>
                        <td class="id"></td>
                    </tr>
                    <tr>
                        <td class="id"><b style="padding-right: 50px;">{{chartData390.rows[8]['자판']}}</b>  {{chartData390.rows[8]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartData390.rows[18]['자판']}}</b>  {{chartData390.rows[18]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartData390.rows[28]['자판']}}</b>  {{chartData390.rows[28]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartData390.rows[29]['자판']}}</b>  {{chartData390.rows[38]['속도(타)']}} 타</td>
                        <td class="id"></td>
                    </tr>
                    <tr>
                        <td class="id"><b style="padding-right: 50px;">{{chartData390.rows[9]['자판']}}</b>  {{chartData390.rows[9]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartData390.rows[19]['자판']}}</b>  {{chartData390.rows[19]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartData390.rows[29]['자판']}}</b>  {{chartData390.rows[29]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartData390.rows[39]['자판']}}</b>  {{chartData390.rows[39]['속도(타)']}} 타</td>
                        <td class="id"></td>
                    </tr>
                </tbody>                
            </table>   
            <table class="keyboard-list" v-else-if="language===4">
                <tbody>
                    <tr>
                        <td class="id"><b style="padding-right: 50px;">{{chartData3Down.rows[0]['자판']}}</b>  {{chartData3Down.rows[0]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartData3Down.rows[10]['자판']}}</b>  {{chartData390.rows[10]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartData3Down.rows[20]['자판']}}</b>  {{chartData3Down.rows[20]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartData3Down.rows[30]['자판']}}</b>  {{chartData3Down.rows[30]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartData3Down.rows[40]['자판']}}</b>  {{chartData3Down.rows[40]['속도(타)']}} 타</td>
                    </tr>
                    <tr>
                        <td class="id"><b style="padding-right: 50px;">{{chartData3Down.rows[1]['자판']}}</b>  {{chartData3Down.rows[1]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartData3Down.rows[11]['자판']}}</b>  {{chartData3Down.rows[11]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartData3Down.rows[21]['자판']}}</b>  {{chartData3Down.rows[21]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartData3Down.rows[31]['자판']}}</b>  {{chartData3Down.rows[31]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartData3Down.rows[41]['자판']}}</b>  {{chartData3Down.rows[41]['속도(타)']}} 타</td>
                    </tr>
                    <tr>
                        <td class="id"><b style="padding-right: 50px;">{{chartData3Down.rows[2]['자판']}}</b>  {{chartData3Down.rows[2]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartData3Down.rows[12]['자판']}}</b>  {{chartData3Down.rows[12]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartData3Down.rows[22]['자판']}}</b>  {{chartData3Down.rows[22]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartData3Down.rows[32]['자판']}}</b>  {{chartData3Down.rows[32]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartData3Down.rows[42]['자판']}}</b>  {{chartData3Down.rows[42]['속도(타)']}} 타</td>
                    </tr>
                    <tr>
                        <td class="id"><b style="padding-right: 50px;">{{chartData3Down.rows[3]['자판']}}</b>  {{chartData3Down.rows[3]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartData3Down.rows[13]['자판']}}</b>  {{chartData3Down.rows[13]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartData3Down.rows[23]['자판']}}</b>  {{chartData3Down.rows[23]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartData3Down.rows[33]['자판']}}</b>  {{chartData3Down.rows[33]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartData3Down.rows[43]['자판']}}</b>  {{chartData3Down.rows[43]['속도(타)']}} 타</td>
                    </tr>
                    <tr>
                        <td class="id"><b style="padding-right: 50px;">{{chartData3Down.rows[4]['자판']}}</b>  {{chartData3Down.rows[4]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartData3Down.rows[14]['자판']}}</b>  {{chartData3Down.rows[14]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartData3Down.rows[24]['자판']}}</b>  {{chartData3Down.rows[24]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartData3Down.rows[34]['자판']}}</b>  {{chartData3Down.rows[34]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartData3Down.rows[44]['자판']}}</b>  {{chartData3Down.rows[44]['속도(타)']}} 타</td>
                    </tr>
                    <tr>
                        <td class="id"><b style="padding-right: 50px;">{{chartData3Down.rows[5]['자판']}}</b>  {{chartData3Down.rows[5]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartData3Down.rows[15]['자판']}}</b>  {{chartData3Down.rows[15]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartData3Down.rows[25]['자판']}}</b>  {{chartData3Down.rows[25]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartData3Down.rows[35]['자판']}}</b>  {{chartData3Down.rows[35]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartData3Down.rows[45]['자판']}}</b>  {{chartData3Down.rows[45]['속도(타)']}} 타</td>
                    </tr>
                    <tr>
                        <td class="id"><b style="padding-right: 50px;">{{chartData3Down.rows[6]['자판']}}</b>  {{chartData3Down.rows[6]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartData3Down.rows[16]['자판']}}</b>  {{chartData3Down.rows[16]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartData3Down.rows[26]['자판']}}</b>  {{chartData3Down.rows[26]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartData3Down.rows[36]['자판']}}</b>  {{chartData3Down.rows[36]['속도(타)']}} 타</td>
                        <td class="id"></td>
                    </tr>
                    <tr>
                        <td class="id"><b style="padding-right: 50px;">{{chartData3Down.rows[7]['자판']}}</b>  {{chartData3Down.rows[7]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartData3Down.rows[17]['자판']}}</b>  {{chartData3Down.rows[17]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartData3Down.rows[27]['자판']}}</b>  {{chartData3Down.rows[27]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartData3Down.rows[37]['자판']}}</b>  {{chartData3Down.rows[37]['속도(타)']}} 타</td>
                        <td class="id"></td>
                    </tr>
                    <tr>
                        <td class="id"><b style="padding-right: 50px;">{{chartData3Down.rows[8]['자판']}}</b>  {{chartData3Down.rows[8]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartData3Down.rows[18]['자판']}}</b>  {{chartData3Down.rows[18]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartData3Down.rows[28]['자판']}}</b>  {{chartData3Down.rows[28]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartData3Down.rows[29]['자판']}}</b>  {{chartData3Down.rows[38]['속도(타)']}} 타</td>
                        <td class="id"></td>
                    </tr>
                    <tr>
                        <td class="id"><b style="padding-right: 50px;">{{chartData3Down.rows[9]['자판']}}</b>  {{chartData3Down.rows[9]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartData3Down.rows[19]['자판']}}</b>  {{chartData3Down.rows[19]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartData3Down.rows[29]['자판']}}</b>  {{chartData3Down.rows[29]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartData3Down.rows[39]['자판']}}</b>  {{chartData3Down.rows[39]['속도(타)']}} 타</td>
                        <td class="id"></td>
                    </tr>
                </tbody>                
            </table>
            <table class="keyboard-list" v-else-if="language===5">
                <tbody>
                    <tr>
                        <td class="id"><b style="padding-right: 50px;">{{chartData3Final.rows[0]['자판']}}</b>  {{chartData3Final.rows[0]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartData3Final.rows[10]['자판']}}</b>  {{chartData3Final.rows[10]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartData3Final.rows[20]['자판']}}</b>  {{chartData3Final.rows[20]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartData3Final.rows[30]['자판']}}</b>  {{chartData3Final.rows[30]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartData3Final.rows[40]['자판']}}</b>  {{chartData3Final.rows[40]['속도(타)']}} 타</td>
                    </tr>
                    <tr>
                        <td class="id"><b style="padding-right: 50px;">{{chartData3Final.rows[1]['자판']}}</b>  {{chartData3Final.rows[1]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartData3Final.rows[11]['자판']}}</b>  {{chartData3Final.rows[11]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartData3Final.rows[21]['자판']}}</b>  {{chartData3Final.rows[21]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartData3Final.rows[31]['자판']}}</b>  {{chartData3Final.rows[31]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartData3Final.rows[41]['자판']}}</b>  {{chartData3Final.rows[41]['속도(타)']}} 타</td>
                    </tr>
                    <tr>
                        <td class="id"><b style="padding-right: 50px;">{{chartData3Final.rows[2]['자판']}}</b>  {{chartData3Final.rows[2]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartData3Final.rows[12]['자판']}}</b>  {{chartData3Final.rows[12]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartData3Final.rows[22]['자판']}}</b>  {{chartData3Final.rows[22]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartData3Final.rows[32]['자판']}}</b>  {{chartData3Final.rows[32]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartData3Final.rows[42]['자판']}}</b>  {{chartData3Final.rows[42]['속도(타)']}} 타</td>
                    </tr>
                    <tr>
                        <td class="id"><b style="padding-right: 50px;">{{chartData3Final.rows[3]['자판']}}</b>  {{chartData3Final.rows[3]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartData3Final.rows[13]['자판']}}</b>  {{chartData3Final.rows[13]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartData3Final.rows[23]['자판']}}</b>  {{chartData3Final.rows[23]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartData3Final.rows[33]['자판']}}</b>  {{chartData3Final.rows[33]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartData3Final.rows[43]['자판']}}</b>  {{chartData3Final.rows[43]['속도(타)']}} 타</td>
                    </tr>
                    <tr>
                        <td class="id"><b style="padding-right: 50px;">{{chartData3Final.rows[4]['자판']}}</b>  {{chartData3Final.rows[4]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartData3Final.rows[14]['자판']}}</b>  {{chartData3Final.rows[14]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartData3Final.rows[24]['자판']}}</b>  {{chartData3Final.rows[24]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartData3Final.rows[34]['자판']}}</b>  {{chartData3Final.rows[34]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartData3Final.rows[44]['자판']}}</b>  {{chartData3Final.rows[44]['속도(타)']}} 타</td>
                    </tr>
                    <tr>
                        <td class="id"><b style="padding-right: 50px;">{{chartData3Final.rows[5]['자판']}}</b>  {{chartData3Final.rows[5]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartData3Final.rows[15]['자판']}}</b>  {{chartData3Final.rows[15]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartData3Final.rows[25]['자판']}}</b>  {{chartData3Final.rows[25]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartData3Final.rows[35]['자판']}}</b>  {{chartData3Final.rows[35]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartData3Final.rows[45]['자판']}}</b>  {{chartData3Final.rows[45]['속도(타)']}} 타</td>
                    </tr>
                    <tr>
                        <td class="id"><b style="padding-right: 50px;">{{chartData3Final.rows[6]['자판']}}</b>  {{chartData3Final.rows[6]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartData3Final.rows[16]['자판']}}</b>  {{chartData3Final.rows[16]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartData3Final.rows[26]['자판']}}</b>  {{chartData3Final.rows[26]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartData3Final.rows[36]['자판']}}</b>  {{chartData3Final.rows[36]['속도(타)']}} 타</td>
                        <td class="id"></td>
                    </tr>
                    <tr>
                        <td class="id"><b style="padding-right: 50px;">{{chartData3Final.rows[7]['자판']}}</b>  {{chartData3Final.rows[7]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartData3Final.rows[17]['자판']}}</b>  {{chartData3Final.rows[17]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartData3Final.rows[27]['자판']}}</b>  {{chartData3Final.rows[27]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartData3Final.rows[37]['자판']}}</b>  {{chartData3Final.rows[37]['속도(타)']}} 타</td>
                        <td class="id"></td>
                    </tr>
                    <tr>
                        <td class="id"><b style="padding-right: 50px;">{{chartData3Final.rows[8]['자판']}}</b>  {{chartData3Final.rows[8]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartData3Final.rows[18]['자판']}}</b>  {{chartData3Final.rows[18]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartData3Final.rows[28]['자판']}}</b>  {{chartData3Final.rows[28]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartData3Final.rows[29]['자판']}}</b>  {{chartData3Final.rows[38]['속도(타)']}} 타</td>
                        <td class="id"></td>
                    </tr>
                    <tr>
                        <td class="id"><b style="padding-right: 50px;">{{chartData3Final.rows[9]['자판']}}</b>  {{chartData3Final.rows[9]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartData3Final.rows[19]['자판']}}</b>  {{chartData3Final.rows[19]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartData3Final.rows[29]['자판']}}</b>  {{chartData3Final.rows[29]['속도(타)']}} 타</td>
                        <td class="id"><b style="padding-right: 50px;">{{chartData3Final.rows[39]['자판']}}</b>  {{chartData3Final.rows[39]['속도(타)']}} 타</td>
                        <td class="id"></td>
                    </tr>
                </tbody>                
            </table>
    </div>-->
    <div v-else>
      <table class="keyboard-list" v-if="language===0">
        <tbody>
          <table class="tg" style="width:100%;">
            <tr>
              <td class="tg-vox4">{{chartData.rows[0]['자판']}}</td>
              <td class="tg-5l8j">{{chartData.rows[0]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartData.rows[10]['자판']}}</td>
              <td class="tg-5l8j">{{chartData.rows[10]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartData.rows[20]['자판']}}</td>
              <td class="tg-5l8j">{{chartData.rows[20]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartData.rows[30]['자판']}}</td>
              <td class="tg-5l8j">{{chartData.rows[30]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartData.rows[40]['자판']}}</td>
              <td class="tg-5l8j">{{chartData.rows[40]['속도(타)']}}타</td>
            </tr>
            <tr>
              <td class="tg-vox4">{{chartData.rows[1]['자판']}}</td>
              <td class="tg-5l8j">{{chartData.rows[1]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartData.rows[11]['자판']}}</td>
              <td class="tg-5l8j">{{chartData.rows[11]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartData.rows[21]['자판']}}</td>
              <td class="tg-5l8j">{{chartData.rows[21]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartData.rows[31]['자판']}}</td>
              <td class="tg-5l8j">{{chartData.rows[31]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartData.rows[41]['자판']}}</td>
              <td class="tg-5l8j">{{chartData.rows[41]['속도(타)']}}타</td>
            </tr>
            <tr>
              <td class="tg-vox4">{{chartData.rows[2]['자판']}}</td>
              <td class="tg-5l8j">{{chartData.rows[2]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartData.rows[12]['자판']}}</td>
              <td class="tg-5l8j">{{chartData.rows[12]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartData.rows[22]['자판']}}</td>
              <td class="tg-5l8j">{{chartData.rows[22]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartData.rows[32]['자판']}}</td>
              <td class="tg-5l8j">{{chartData.rows[32]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartData.rows[42]['자판']}}</td>
              <td class="tg-5l8j">{{chartData.rows[42]['속도(타)']}}타</td>
            </tr>
            <tr>
              <td class="tg-vox4">{{chartData.rows[3]['자판']}}</td>
              <td class="tg-5l8j">{{chartData.rows[3]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartData.rows[13]['자판']}}</td>
              <td class="tg-5l8j">{{chartData.rows[13]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartData.rows[23]['자판']}}</td>
              <td class="tg-5l8j">{{chartData.rows[23]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartData.rows[33]['자판']}}</td>
              <td class="tg-5l8j">{{chartData.rows[33]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartData.rows[43]['자판']}}</td>
              <td class="tg-5l8j">{{chartData.rows[43]['속도(타)']}}타</td>
            </tr>
            <tr>
              <td class="tg-vox4">{{chartData.rows[4]['자판']}}</td>
              <td class="tg-5l8j">{{chartData.rows[4]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartData.rows[14]['자판']}}</td>
              <td class="tg-5l8j">{{chartData.rows[14]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartData.rows[24]['자판']}}</td>
              <td class="tg-5l8j">{{chartData.rows[24]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartData.rows[34]['자판']}}</td>
              <td class="tg-5l8j">{{chartData.rows[34]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartData.rows[44]['자판']}}</td>
              <td class="tg-5l8j">{{chartData.rows[44]['속도(타)']}}타</td>
            </tr>
            <tr>
              <td class="tg-vox4">{{chartData.rows[5]['자판']}}</td>
              <td class="tg-5l8j">{{chartData.rows[5]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartData.rows[15]['자판']}}</td>
              <td class="tg-5l8j">{{chartData.rows[15]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartData.rows[25]['자판']}}</td>
              <td class="tg-5l8j">{{chartData.rows[25]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartData.rows[35]['자판']}}</td>
              <td class="tg-5l8j">{{chartData.rows[35]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartData.rows[45]['자판']}}</td>
              <td class="tg-5l8j">{{chartData.rows[45]['속도(타)']}}타</td>
            </tr>
            <tr>
              <td class="tg-vox4">{{chartData.rows[6]['자판']}}</td>
              <td class="tg-5l8j">{{chartData.rows[6]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartData.rows[16]['자판']}}</td>
              <td class="tg-5l8j">{{chartData.rows[16]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartData.rows[26]['자판']}}</td>
              <td class="tg-5l8j">{{chartData.rows[26]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartData.rows[36]['자판']}}</td>
              <td class="tg-5l8j">{{chartData.rows[36]['속도(타)']}}타</td>
              <td class="tg-vox4"></td>
              <td class="tg-5l8j"></td>
            </tr>
            <tr>
              <td class="tg-vox4">{{chartData.rows[7]['자판']}}</td>
              <td class="tg-5l8j">{{chartData.rows[7]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartData.rows[17]['자판']}}</td>
              <td class="tg-5l8j">{{chartData.rows[17]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartData.rows[27]['자판']}}</td>
              <td class="tg-5l8j">{{chartData.rows[27]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartData.rows[37]['자판']}}</td>
              <td class="tg-5l8j">{{chartData.rows[37]['속도(타)']}}타</td>
              <td class="tg-vox4"></td>
              <td class="tg-5l8j"></td>
            </tr>
            <tr>
              <td class="tg-vox4">{{chartData.rows[8]['자판']}}</td>
              <td class="tg-5l8j">{{chartData.rows[8]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartData.rows[18]['자판']}}</td>
              <td class="tg-5l8j">{{chartData.rows[18]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartData.rows[28]['자판']}}</td>
              <td class="tg-5l8j">{{chartData.rows[28]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartData.rows[38]['자판']}}</td>
              <td class="tg-5l8j">{{chartData.rows[38]['속도(타)']}}타</td>
              <td class="tg-vox4"></td>
              <td class="tg-5l8j"></td>
            </tr>
            <tr>
              <td class="tg-vox4">{{chartData.rows[9]['자판']}}</td>
              <td class="tg-5l8j">{{chartData.rows[9]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartData.rows[19]['자판']}}</td>
              <td class="tg-5l8j">{{chartData.rows[19]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartData.rows[29]['자판']}}</td>
              <td class="tg-5l8j">{{chartData.rows[29]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartData.rows[39]['자판']}}</td>
              <td class="tg-5l8j">{{chartData.rows[39]['속도(타)']}}타</td>
              <td class="tg-vox4"></td>
              <td class="tg-5l8j"></td>
            </tr>
          </table>
        </tbody>
      </table>
      <table class="keyboard-list" v-else-if="language===1">
        <tbody>
          <table class="tg" style="width:100%;">
            <tr>
              <td class="tg-vox4">{{chartDataEng.rows[0]['자판']}}</td>
              <td class="tg-5l8j">{{chartDataEng.rows[0]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartDataEng.rows[10]['자판']}}</td>
              <td class="tg-5l8j">{{chartDataEng.rows[10]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartDataEng.rows[20]['자판']}}</td>
              <td class="tg-5l8j">{{chartDataEng.rows[20]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartDataEng.rows[30]['자판']}}</td>
              <td class="tg-5l8j">{{chartDataEng.rows[30]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartDataEng.rows[40]['자판']}}</td>
              <td class="tg-5l8j">{{chartDataEng.rows[40]['속도(타)']}}타</td>
            </tr>
            <tr>
              <td class="tg-vox4">{{chartDataEng.rows[1]['자판']}}</td>
              <td class="tg-5l8j">{{chartDataEng.rows[1]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartDataEng.rows[11]['자판']}}</td>
              <td class="tg-5l8j">{{chartDataEng.rows[11]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartDataEng.rows[21]['자판']}}</td>
              <td class="tg-5l8j">{{chartDataEng.rows[21]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartDataEng.rows[31]['자판']}}</td>
              <td class="tg-5l8j">{{chartDataEng.rows[31]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartDataEng.rows[41]['자판']}}</td>
              <td class="tg-5l8j">{{chartDataEng.rows[41]['속도(타)']}}타</td>
            </tr>
            <tr>
              <td class="tg-vox4">{{chartDataEng.rows[2]['자판']}}</td>
              <td class="tg-5l8j">{{chartDataEng.rows[2]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartDataEng.rows[12]['자판']}}</td>
              <td class="tg-5l8j">{{chartDataEng.rows[12]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartDataEng.rows[22]['자판']}}</td>
              <td class="tg-5l8j">{{chartDataEng.rows[22]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartDataEng.rows[32]['자판']}}</td>
              <td class="tg-5l8j">{{chartDataEng.rows[32]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartDataEng.rows[42]['자판']}}</td>
              <td class="tg-5l8j">{{chartDataEng.rows[42]['속도(타)']}}타</td>
            </tr>
            <tr>
              <td class="tg-vox4">{{chartDataEng.rows[3]['자판']}}</td>
              <td class="tg-5l8j">{{chartDataEng.rows[3]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartDataEng.rows[13]['자판']}}</td>
              <td class="tg-5l8j">{{chartDataEng.rows[13]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartDataEng.rows[23]['자판']}}</td>
              <td class="tg-5l8j">{{chartDataEng.rows[23]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartDataEng.rows[33]['자판']}}</td>
              <td class="tg-5l8j">{{chartDataEng.rows[33]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartDataEng.rows[43]['자판']}}</td>
              <td class="tg-5l8j">{{chartDataEng.rows[43]['속도(타)']}}타</td>
            </tr>
            <tr>
              <td class="tg-vox4">{{chartDataEng.rows[4]['자판']}}</td>
              <td class="tg-5l8j">{{chartDataEng.rows[4]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartDataEng.rows[14]['자판']}}</td>
              <td class="tg-5l8j">{{chartDataEng.rows[14]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartDataEng.rows[24]['자판']}}</td>
              <td class="tg-5l8j">{{chartDataEng.rows[24]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartDataEng.rows[34]['자판']}}</td>
              <td class="tg-5l8j">{{chartDataEng.rows[34]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartDataEng.rows[44]['자판']}}</td>
              <td class="tg-5l8j">{{chartDataEng.rows[44]['속도(타)']}}타</td>
            </tr>
            <tr>
              <td class="tg-vox4">{{chartDataEng.rows[5]['자판']}}</td>
              <td class="tg-5l8j">{{chartDataEng.rows[5]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartDataEng.rows[15]['자판']}}</td>
              <td class="tg-5l8j">{{chartDataEng.rows[15]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartDataEng.rows[25]['자판']}}</td>
              <td class="tg-5l8j">{{chartDataEng.rows[25]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartDataEng.rows[35]['자판']}}</td>
              <td class="tg-5l8j">{{chartDataEng.rows[35]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartDataEng.rows[45]['자판']}}</td>
              <td class="tg-5l8j">{{chartDataEng.rows[45]['속도(타)']}}타</td>
            </tr>
            <tr>
              <td class="tg-vox4">{{chartDataEng.rows[6]['자판']}}</td>
              <td class="tg-5l8j">{{chartDataEng.rows[6]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartDataEng.rows[16]['자판']}}</td>
              <td class="tg-5l8j">{{chartDataEng.rows[16]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartDataEng.rows[26]['자판']}}</td>
              <td class="tg-5l8j">{{chartDataEng.rows[26]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartDataEng.rows[36]['자판']}}</td>
              <td class="tg-5l8j">{{chartDataEng.rows[36]['속도(타)']}}타</td>
              <td class="tg-vox4"></td>
              <td class="tg-5l8j"></td>
            </tr>
            <tr>
              <td class="tg-vox4">{{chartDataEng.rows[7]['자판']}}</td>
              <td class="tg-5l8j">{{chartDataEng.rows[7]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartDataEng.rows[17]['자판']}}</td>
              <td class="tg-5l8j">{{chartDataEng.rows[17]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartDataEng.rows[27]['자판']}}</td>
              <td class="tg-5l8j">{{chartDataEng.rows[27]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartDataEng.rows[37]['자판']}}</td>
              <td class="tg-5l8j">{{chartDataEng.rows[37]['속도(타)']}}타</td>
              <td class="tg-vox4"></td>
              <td class="tg-5l8j"></td>
            </tr>
            <tr>
              <td class="tg-vox4">{{chartDataEng.rows[8]['자판']}}</td>
              <td class="tg-5l8j">{{chartDataEng.rows[8]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartDataEng.rows[18]['자판']}}</td>
              <td class="tg-5l8j">{{chartDataEng.rows[18]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartDataEng.rows[28]['자판']}}</td>
              <td class="tg-5l8j">{{chartDataEng.rows[28]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartDataEng.rows[38]['자판']}}</td>
              <td class="tg-5l8j">{{chartDataEng.rows[38]['속도(타)']}}타</td>
              <td class="tg-vox4"></td>
              <td class="tg-5l8j"></td>
            </tr>
            <tr>
              <td class="tg-vox4">{{chartDataEng.rows[9]['자판']}}</td>
              <td class="tg-5l8j">{{chartDataEng.rows[9]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartDataEng.rows[19]['자판']}}</td>
              <td class="tg-5l8j">{{chartDataEng.rows[19]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartDataEng.rows[29]['자판']}}</td>
              <td class="tg-5l8j">{{chartDataEng.rows[29]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartDataEng.rows[39]['자판']}}</td>
              <td class="tg-5l8j">{{chartDataEng.rows[39]['속도(타)']}}타</td>
              <td class="tg-vox4"></td>
              <td class="tg-5l8j"></td>
            </tr>
          </table>
        </tbody>
      </table>
      <table class="keyboard-list" v-else-if="language===2">
        <tbody>
          <table class="tg" style="width:100%;">
            <tr>
              <td class="tg-vox4">{{chartDataEngDvo.rows[0]['자판']}}</td>
              <td class="tg-5l8j">{{chartDataEngDvo.rows[0]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartDataEngDvo.rows[10]['자판']}}</td>
              <td class="tg-5l8j">{{chartDataEngDvo.rows[10]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartDataEngDvo.rows[20]['자판']}}</td>
              <td class="tg-5l8j">{{chartDataEngDvo.rows[20]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartDataEngDvo.rows[30]['자판']}}</td>
              <td class="tg-5l8j">{{chartDataEngDvo.rows[30]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartDataEngDvo.rows[40]['자판']}}</td>
              <td class="tg-5l8j">{{chartDataEngDvo.rows[40]['속도(타)']}}타</td>
            </tr>
            <tr>
              <td class="tg-vox4">{{chartDataEngDvo.rows[1]['자판']}}</td>
              <td class="tg-5l8j">{{chartDataEngDvo.rows[1]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartDataEngDvo.rows[11]['자판']}}</td>
              <td class="tg-5l8j">{{chartDataEngDvo.rows[11]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartDataEngDvo.rows[21]['자판']}}</td>
              <td class="tg-5l8j">{{chartDataEngDvo.rows[21]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartDataEngDvo.rows[31]['자판']}}</td>
              <td class="tg-5l8j">{{chartDataEngDvo.rows[31]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartDataEngDvo.rows[41]['자판']}}</td>
              <td class="tg-5l8j">{{chartDataEngDvo.rows[41]['속도(타)']}}타</td>
            </tr>
            <tr>
              <td class="tg-vox4">{{chartDataEngDvo.rows[2]['자판']}}</td>
              <td class="tg-5l8j">{{chartDataEngDvo.rows[2]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartDataEngDvo.rows[12]['자판']}}</td>
              <td class="tg-5l8j">{{chartDataEngDvo.rows[12]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartDataEngDvo.rows[22]['자판']}}</td>
              <td class="tg-5l8j">{{chartDataEngDvo.rows[22]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartDataEngDvo.rows[32]['자판']}}</td>
              <td class="tg-5l8j">{{chartDataEngDvo.rows[32]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartDataEngDvo.rows[42]['자판']}}</td>
              <td class="tg-5l8j">{{chartDataEngDvo.rows[42]['속도(타)']}}타</td>
            </tr>
            <tr>
              <td class="tg-vox4">{{chartDataEngDvo.rows[3]['자판']}}</td>
              <td class="tg-5l8j">{{chartDataEngDvo.rows[3]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartDataEngDvo.rows[13]['자판']}}</td>
              <td class="tg-5l8j">{{chartDataEngDvo.rows[13]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartDataEngDvo.rows[23]['자판']}}</td>
              <td class="tg-5l8j">{{chartDataEngDvo.rows[23]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartDataEngDvo.rows[33]['자판']}}</td>
              <td class="tg-5l8j">{{chartDataEngDvo.rows[33]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartDataEngDvo.rows[43]['자판']}}</td>
              <td class="tg-5l8j">{{chartDataEngDvo.rows[43]['속도(타)']}}타</td>
            </tr>
            <tr>
              <td class="tg-vox4">{{chartDataEngDvo.rows[4]['자판']}}</td>
              <td class="tg-5l8j">{{chartDataEngDvo.rows[4]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartDataEngDvo.rows[14]['자판']}}</td>
              <td class="tg-5l8j">{{chartDataEngDvo.rows[14]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartDataEngDvo.rows[24]['자판']}}</td>
              <td class="tg-5l8j">{{chartDataEngDvo.rows[24]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartDataEngDvo.rows[34]['자판']}}</td>
              <td class="tg-5l8j">{{chartDataEngDvo.rows[34]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartDataEngDvo.rows[44]['자판']}}</td>
              <td class="tg-5l8j">{{chartDataEngDvo.rows[44]['속도(타)']}}타</td>
            </tr>
            <tr>
              <td class="tg-vox4">{{chartDataEngDvo.rows[5]['자판']}}</td>
              <td class="tg-5l8j">{{chartDataEngDvo.rows[5]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartDataEngDvo.rows[15]['자판']}}</td>
              <td class="tg-5l8j">{{chartDataEngDvo.rows[15]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartDataEngDvo.rows[25]['자판']}}</td>
              <td class="tg-5l8j">{{chartDataEngDvo.rows[25]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartDataEngDvo.rows[35]['자판']}}</td>
              <td class="tg-5l8j">{{chartDataEngDvo.rows[35]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartDataEngDvo.rows[45]['자판']}}</td>
              <td class="tg-5l8j">{{chartDataEngDvo.rows[45]['속도(타)']}}타</td>
            </tr>
            <tr>
              <td class="tg-vox4">{{chartDataEngDvo.rows[6]['자판']}}</td>
              <td class="tg-5l8j">{{chartDataEngDvo.rows[6]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartDataEngDvo.rows[16]['자판']}}</td>
              <td class="tg-5l8j">{{chartDataEngDvo.rows[16]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartDataEngDvo.rows[26]['자판']}}</td>
              <td class="tg-5l8j">{{chartDataEngDvo.rows[26]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartDataEngDvo.rows[36]['자판']}}</td>
              <td class="tg-5l8j">{{chartDataEngDvo.rows[36]['속도(타)']}}타</td>
              <td class="tg-vox4"></td>
              <td class="tg-5l8j"></td>
            </tr>
            <tr>
              <td class="tg-vox4">{{chartDataEngDvo.rows[7]['자판']}}</td>
              <td class="tg-5l8j">{{chartDataEngDvo.rows[7]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartDataEngDvo.rows[17]['자판']}}</td>
              <td class="tg-5l8j">{{chartDataEngDvo.rows[17]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartDataEngDvo.rows[27]['자판']}}</td>
              <td class="tg-5l8j">{{chartDataEngDvo.rows[27]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartDataEngDvo.rows[37]['자판']}}</td>
              <td class="tg-5l8j">{{chartDataEngDvo.rows[37]['속도(타)']}}타</td>
              <td class="tg-vox4"></td>
              <td class="tg-5l8j"></td>
            </tr>
            <tr>
              <td class="tg-vox4">{{chartDataEngDvo.rows[8]['자판']}}</td>
              <td class="tg-5l8j">{{chartDataEngDvo.rows[8]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartDataEngDvo.rows[18]['자판']}}</td>
              <td class="tg-5l8j">{{chartDataEngDvo.rows[18]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartDataEngDvo.rows[28]['자판']}}</td>
              <td class="tg-5l8j">{{chartDataEngDvo.rows[28]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartDataEngDvo.rows[38]['자판']}}</td>
              <td class="tg-5l8j">{{chartDataEngDvo.rows[38]['속도(타)']}}타</td>
              <td class="tg-vox4"></td>
              <td class="tg-5l8j"></td>
            </tr>
            <tr>
              <td class="tg-vox4">{{chartDataEngDvo.rows[9]['자판']}}</td>
              <td class="tg-5l8j">{{chartDataEngDvo.rows[9]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartDataEngDvo.rows[19]['자판']}}</td>
              <td class="tg-5l8j">{{chartDataEngDvo.rows[19]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartDataEngDvo.rows[29]['자판']}}</td>
              <td class="tg-5l8j">{{chartDataEngDvo.rows[29]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartDataEngDvo.rows[39]['자판']}}</td>
              <td class="tg-5l8j">{{chartDataEngDvo.rows[39]['속도(타)']}}타</td>
              <td class="tg-vox4"></td>
              <td class="tg-5l8j"></td>
            </tr>
          </table>
        </tbody>
      </table>
      <table class="keyboard-list" v-else-if="language===3">
        <tbody>
          <table class="tg" style="width:100%;">
            <tr>
              <td class="tg-vox4">{{chartData390.rows[0]['자판']}}</td>
              <td class="tg-5l8j">{{chartData390.rows[0]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartData390.rows[10]['자판']}}</td>
              <td class="tg-5l8j">{{chartData390.rows[10]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartData390.rows[20]['자판']}}</td>
              <td class="tg-5l8j">{{chartData390.rows[20]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartData390.rows[30]['자판']}}</td>
              <td class="tg-5l8j">{{chartData390.rows[30]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartData390.rows[40]['자판']}}</td>
              <td class="tg-5l8j">{{chartData390.rows[40]['속도(타)']}}타</td>
            </tr>
            <tr>
              <td class="tg-vox4">{{chartData390.rows[1]['자판']}}</td>
              <td class="tg-5l8j">{{chartData390.rows[1]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartData390.rows[11]['자판']}}</td>
              <td class="tg-5l8j">{{chartData390.rows[11]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartData390.rows[21]['자판']}}</td>
              <td class="tg-5l8j">{{chartData390.rows[21]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartData390.rows[31]['자판']}}</td>
              <td class="tg-5l8j">{{chartData390.rows[31]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartData390.rows[41]['자판']}}</td>
              <td class="tg-5l8j">{{chartData390.rows[41]['속도(타)']}}타</td>
            </tr>
            <tr>
              <td class="tg-vox4">{{chartData390.rows[2]['자판']}}</td>
              <td class="tg-5l8j">{{chartData390.rows[2]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartData390.rows[12]['자판']}}</td>
              <td class="tg-5l8j">{{chartData390.rows[12]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartData390.rows[22]['자판']}}</td>
              <td class="tg-5l8j">{{chartData390.rows[22]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartData390.rows[32]['자판']}}</td>
              <td class="tg-5l8j">{{chartData390.rows[32]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartData390.rows[42]['자판']}}</td>
              <td class="tg-5l8j">{{chartData390.rows[42]['속도(타)']}}타</td>
            </tr>
            <tr>
              <td class="tg-vox4">{{chartData390.rows[3]['자판']}}</td>
              <td class="tg-5l8j">{{chartData390.rows[3]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartData390.rows[13]['자판']}}</td>
              <td class="tg-5l8j">{{chartData390.rows[13]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartData390.rows[23]['자판']}}</td>
              <td class="tg-5l8j">{{chartData390.rows[23]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartData390.rows[33]['자판']}}</td>
              <td class="tg-5l8j">{{chartData390.rows[33]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartData390.rows[43]['자판']}}</td>
              <td class="tg-5l8j">{{chartData390.rows[43]['속도(타)']}}타</td>
            </tr>
            <tr>
              <td class="tg-vox4">{{chartData390.rows[4]['자판']}}</td>
              <td class="tg-5l8j">{{chartData390.rows[4]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartData390.rows[14]['자판']}}</td>
              <td class="tg-5l8j">{{chartData390.rows[14]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartData390.rows[24]['자판']}}</td>
              <td class="tg-5l8j">{{chartData390.rows[24]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartData390.rows[34]['자판']}}</td>
              <td class="tg-5l8j">{{chartData390.rows[34]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartData390.rows[44]['자판']}}</td>
              <td class="tg-5l8j">{{chartData390.rows[44]['속도(타)']}}타</td>
            </tr>
            <tr>
              <td class="tg-vox4">{{chartData390.rows[5]['자판']}}</td>
              <td class="tg-5l8j">{{chartData390.rows[5]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartData390.rows[15]['자판']}}</td>
              <td class="tg-5l8j">{{chartData390.rows[15]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartData390.rows[25]['자판']}}</td>
              <td class="tg-5l8j">{{chartData390.rows[25]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartData390.rows[35]['자판']}}</td>
              <td class="tg-5l8j">{{chartData390.rows[35]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartData390.rows[45]['자판']}}</td>
              <td class="tg-5l8j">{{chartData390.rows[45]['속도(타)']}}타</td>
            </tr>
            <tr>
              <td class="tg-vox4">{{chartData390.rows[6]['자판']}}</td>
              <td class="tg-5l8j">{{chartData390.rows[6]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartData390.rows[16]['자판']}}</td>
              <td class="tg-5l8j">{{chartData390.rows[16]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartData390.rows[26]['자판']}}</td>
              <td class="tg-5l8j">{{chartData390.rows[26]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartData390.rows[36]['자판']}}</td>
              <td class="tg-5l8j">{{chartData390.rows[36]['속도(타)']}}타</td>
              <td class="tg-vox4"></td>
              <td class="tg-5l8j"></td>
            </tr>
            <tr>
              <td class="tg-vox4">{{chartData390.rows[7]['자판']}}</td>
              <td class="tg-5l8j">{{chartData390.rows[7]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartData390.rows[17]['자판']}}</td>
              <td class="tg-5l8j">{{chartData390.rows[17]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartData390.rows[27]['자판']}}</td>
              <td class="tg-5l8j">{{chartData390.rows[27]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartData390.rows[37]['자판']}}</td>
              <td class="tg-5l8j">{{chartData390.rows[37]['속도(타)']}}타</td>
              <td class="tg-vox4"></td>
              <td class="tg-5l8j"></td>
            </tr>
            <tr>
              <td class="tg-vox4">{{chartData390.rows[8]['자판']}}</td>
              <td class="tg-5l8j">{{chartData390.rows[8]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartData390.rows[18]['자판']}}</td>
              <td class="tg-5l8j">{{chartData390.rows[18]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartData390.rows[28]['자판']}}</td>
              <td class="tg-5l8j">{{chartData390.rows[28]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartData390.rows[38]['자판']}}</td>
              <td class="tg-5l8j">{{chartData390.rows[38]['속도(타)']}}타</td>
              <td class="tg-vox4"></td>
              <td class="tg-5l8j"></td>
            </tr>
            <tr>
              <td class="tg-vox4">{{chartData390.rows[9]['자판']}}</td>
              <td class="tg-5l8j">{{chartData390.rows[9]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartData390.rows[19]['자판']}}</td>
              <td class="tg-5l8j">{{chartData390.rows[19]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartData390.rows[29]['자판']}}</td>
              <td class="tg-5l8j">{{chartData390.rows[29]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartData390.rows[39]['자판']}}</td>
              <td class="tg-5l8j">{{chartData390.rows[39]['속도(타)']}}타</td>
              <td class="tg-vox4"></td>
              <td class="tg-5l8j"></td>
            </tr>
          </table>
        </tbody>
      </table>
      <table class="keyboard-list" v-else-if="language===4">
        <tbody>
          <table class="tg" style="width:100%;">
            <tr>
              <td class="tg-vox4">{{chartData3Down.rows[0]['자판']}}</td>
              <td class="tg-5l8j">{{chartData3Down.rows[0]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartData3Down.rows[10]['자판']}}</td>
              <td class="tg-5l8j">{{chartData3Down.rows[10]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartData3Down.rows[20]['자판']}}</td>
              <td class="tg-5l8j">{{chartData3Down.rows[20]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartData3Down.rows[30]['자판']}}</td>
              <td class="tg-5l8j">{{chartData3Down.rows[30]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartData3Down.rows[40]['자판']}}</td>
              <td class="tg-5l8j">{{chartData3Down.rows[40]['속도(타)']}}타</td>
            </tr>
            <tr>
              <td class="tg-vox4">{{chartData3Down.rows[1]['자판']}}</td>
              <td class="tg-5l8j">{{chartData3Down.rows[1]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartData3Down.rows[11]['자판']}}</td>
              <td class="tg-5l8j">{{chartData3Down.rows[11]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartData3Down.rows[21]['자판']}}</td>
              <td class="tg-5l8j">{{chartData3Down.rows[21]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartData3Down.rows[31]['자판']}}</td>
              <td class="tg-5l8j">{{chartData3Down.rows[31]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartData3Down.rows[41]['자판']}}</td>
              <td class="tg-5l8j">{{chartData3Down.rows[41]['속도(타)']}}타</td>
            </tr>
            <tr>
              <td class="tg-vox4">{{chartData3Down.rows[2]['자판']}}</td>
              <td class="tg-5l8j">{{chartData3Down.rows[2]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartData3Down.rows[12]['자판']}}</td>
              <td class="tg-5l8j">{{chartData3Down.rows[12]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartData3Down.rows[22]['자판']}}</td>
              <td class="tg-5l8j">{{chartData3Down.rows[22]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartData3Down.rows[32]['자판']}}</td>
              <td class="tg-5l8j">{{chartData3Down.rows[32]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartData3Down.rows[42]['자판']}}</td>
              <td class="tg-5l8j">{{chartData3Down.rows[42]['속도(타)']}}타</td>
            </tr>
            <tr>
              <td class="tg-vox4">{{chartData3Down.rows[3]['자판']}}</td>
              <td class="tg-5l8j">{{chartData3Down.rows[3]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartData3Down.rows[13]['자판']}}</td>
              <td class="tg-5l8j">{{chartData3Down.rows[13]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartData3Down.rows[23]['자판']}}</td>
              <td class="tg-5l8j">{{chartData3Down.rows[23]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartData3Down.rows[33]['자판']}}</td>
              <td class="tg-5l8j">{{chartData3Down.rows[33]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartData3Down.rows[43]['자판']}}</td>
              <td class="tg-5l8j">{{chartData3Down.rows[43]['속도(타)']}}타</td>
            </tr>
            <tr>
              <td class="tg-vox4">{{chartData3Down.rows[4]['자판']}}</td>
              <td class="tg-5l8j">{{chartData3Down.rows[4]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartData3Down.rows[14]['자판']}}</td>
              <td class="tg-5l8j">{{chartData3Down.rows[14]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartData3Down.rows[24]['자판']}}</td>
              <td class="tg-5l8j">{{chartData3Down.rows[24]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartData3Down.rows[34]['자판']}}</td>
              <td class="tg-5l8j">{{chartData3Down.rows[34]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartData3Down.rows[44]['자판']}}</td>
              <td class="tg-5l8j">{{chartData3Down.rows[44]['속도(타)']}}타</td>
            </tr>
            <tr>
              <td class="tg-vox4">{{chartData3Down.rows[5]['자판']}}</td>
              <td class="tg-5l8j">{{chartData3Down.rows[5]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartData3Down.rows[15]['자판']}}</td>
              <td class="tg-5l8j">{{chartData3Down.rows[15]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartData3Down.rows[25]['자판']}}</td>
              <td class="tg-5l8j">{{chartData3Down.rows[25]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartData3Down.rows[35]['자판']}}</td>
              <td class="tg-5l8j">{{chartData3Down.rows[35]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartData3Down.rows[45]['자판']}}</td>
              <td class="tg-5l8j">{{chartData3Down.rows[45]['속도(타)']}}타</td>
            </tr>
            <tr>
              <td class="tg-vox4">{{chartData3Down.rows[6]['자판']}}</td>
              <td class="tg-5l8j">{{chartData3Down.rows[6]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartData3Down.rows[16]['자판']}}</td>
              <td class="tg-5l8j">{{chartData3Down.rows[16]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartData3Down.rows[26]['자판']}}</td>
              <td class="tg-5l8j">{{chartData3Down.rows[26]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartData3Down.rows[36]['자판']}}</td>
              <td class="tg-5l8j">{{chartData3Down.rows[36]['속도(타)']}}타</td>
              <td class="tg-vox4"></td>
              <td class="tg-5l8j"></td>
            </tr>
            <tr>
              <td class="tg-vox4">{{chartData3Down.rows[7]['자판']}}</td>
              <td class="tg-5l8j">{{chartData3Down.rows[7]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartData3Down.rows[17]['자판']}}</td>
              <td class="tg-5l8j">{{chartData3Down.rows[17]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartData3Down.rows[27]['자판']}}</td>
              <td class="tg-5l8j">{{chartData3Down.rows[27]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartData3Down.rows[37]['자판']}}</td>
              <td class="tg-5l8j">{{chartData3Down.rows[37]['속도(타)']}}타</td>
              <td class="tg-vox4"></td>
              <td class="tg-5l8j"></td>
            </tr>
            <tr>
              <td class="tg-vox4">{{chartData3Down.rows[8]['자판']}}</td>
              <td class="tg-5l8j">{{chartData3Down.rows[8]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartData3Down.rows[18]['자판']}}</td>
              <td class="tg-5l8j">{{chartData3Down.rows[18]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartData3Down.rows[28]['자판']}}</td>
              <td class="tg-5l8j">{{chartData3Down.rows[28]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartData3Down.rows[38]['자판']}}</td>
              <td class="tg-5l8j">{{chartData3Down.rows[38]['속도(타)']}}타</td>
              <td class="tg-vox4"></td>
              <td class="tg-5l8j"></td>
            </tr>
            <tr>
              <td class="tg-vox4">{{chartData3Down.rows[9]['자판']}}</td>
              <td class="tg-5l8j">{{chartData3Down.rows[9]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartData3Down.rows[19]['자판']}}</td>
              <td class="tg-5l8j">{{chartData3Down.rows[19]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartData3Down.rows[29]['자판']}}</td>
              <td class="tg-5l8j">{{chartData3Down.rows[29]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartData3Down.rows[39]['자판']}}</td>
              <td class="tg-5l8j">{{chartData3Down.rows[39]['속도(타)']}}타</td>
              <td class="tg-vox4"></td>
              <td class="tg-5l8j"></td>
            </tr>
          </table>
        </tbody>
      </table>
      <table class="keyboard-list" v-else-if="language===5">
        <tbody>
          <table class="tg" style="width:100%;">
            <tr>
              <td class="tg-vox4">{{chartData3Final.rows[0]['자판']}}</td>
              <td class="tg-5l8j">{{chartData3Final.rows[0]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartData3Final.rows[10]['자판']}}</td>
              <td class="tg-5l8j">{{chartData3Final.rows[10]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartData3Final.rows[20]['자판']}}</td>
              <td class="tg-5l8j">{{chartData3Final.rows[20]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartData3Final.rows[30]['자판']}}</td>
              <td class="tg-5l8j">{{chartData3Final.rows[30]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartData3Final.rows[40]['자판']}}</td>
              <td class="tg-5l8j">{{chartData3Final.rows[40]['속도(타)']}}타</td>
            </tr>
            <tr>
              <td class="tg-vox4">{{chartData3Final.rows[1]['자판']}}</td>
              <td class="tg-5l8j">{{chartData3Final.rows[1]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartData3Final.rows[11]['자판']}}</td>
              <td class="tg-5l8j">{{chartData3Final.rows[11]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartData3Final.rows[21]['자판']}}</td>
              <td class="tg-5l8j">{{chartData3Final.rows[21]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartData3Final.rows[31]['자판']}}</td>
              <td class="tg-5l8j">{{chartData3Final.rows[31]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartData3Final.rows[41]['자판']}}</td>
              <td class="tg-5l8j">{{chartData3Final.rows[41]['속도(타)']}}타</td>
            </tr>
            <tr>
              <td class="tg-vox4">{{chartData3Final.rows[2]['자판']}}</td>
              <td class="tg-5l8j">{{chartData3Final.rows[2]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartData3Final.rows[12]['자판']}}</td>
              <td class="tg-5l8j">{{chartData3Final.rows[12]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartData3Final.rows[22]['자판']}}</td>
              <td class="tg-5l8j">{{chartData3Final.rows[22]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartData3Final.rows[32]['자판']}}</td>
              <td class="tg-5l8j">{{chartData3Final.rows[32]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartData3Final.rows[42]['자판']}}</td>
              <td class="tg-5l8j">{{chartData3Final.rows[42]['속도(타)']}}타</td>
            </tr>
            <tr>
              <td class="tg-vox4">{{chartData3Final.rows[3]['자판']}}</td>
              <td class="tg-5l8j">{{chartData3Final.rows[3]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartData3Final.rows[13]['자판']}}</td>
              <td class="tg-5l8j">{{chartData3Final.rows[13]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartData3Final.rows[23]['자판']}}</td>
              <td class="tg-5l8j">{{chartData3Final.rows[23]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartData3Final.rows[33]['자판']}}</td>
              <td class="tg-5l8j">{{chartData3Final.rows[33]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartData3Final.rows[43]['자판']}}</td>
              <td class="tg-5l8j">{{chartData3Final.rows[43]['속도(타)']}}타</td>
            </tr>
            <tr>
              <td class="tg-vox4">{{chartData3Final.rows[4]['자판']}}</td>
              <td class="tg-5l8j">{{chartData3Final.rows[4]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartData3Final.rows[14]['자판']}}</td>
              <td class="tg-5l8j">{{chartData3Final.rows[14]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartData3Final.rows[24]['자판']}}</td>
              <td class="tg-5l8j">{{chartData3Final.rows[24]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartData3Final.rows[34]['자판']}}</td>
              <td class="tg-5l8j">{{chartData3Final.rows[34]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartData3Final.rows[44]['자판']}}</td>
              <td class="tg-5l8j">{{chartData3Final.rows[44]['속도(타)']}}타</td>
            </tr>
            <tr>
              <td class="tg-vox4">{{chartData3Final.rows[5]['자판']}}</td>
              <td class="tg-5l8j">{{chartData3Final.rows[5]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartData3Final.rows[15]['자판']}}</td>
              <td class="tg-5l8j">{{chartData3Final.rows[15]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartData3Final.rows[25]['자판']}}</td>
              <td class="tg-5l8j">{{chartData3Final.rows[25]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartData3Final.rows[35]['자판']}}</td>
              <td class="tg-5l8j">{{chartData3Final.rows[35]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartData3Final.rows[45]['자판']}}</td>
              <td class="tg-5l8j">{{chartData3Final.rows[45]['속도(타)']}}타</td>
            </tr>
            <tr>
              <td class="tg-vox4">{{chartData3Final.rows[6]['자판']}}</td>
              <td class="tg-5l8j">{{chartData3Final.rows[6]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartData3Final.rows[16]['자판']}}</td>
              <td class="tg-5l8j">{{chartData3Final.rows[16]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartData3Final.rows[26]['자판']}}</td>
              <td class="tg-5l8j">{{chartData3Final.rows[26]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartData3Final.rows[36]['자판']}}</td>
              <td class="tg-5l8j">{{chartData3Final.rows[36]['속도(타)']}}타</td>
              <td class="tg-vox4"></td>
              <td class="tg-5l8j"></td>
            </tr>
            <tr>
              <td class="tg-vox4">{{chartData3Final.rows[7]['자판']}}</td>
              <td class="tg-5l8j">{{chartData3Final.rows[7]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartData3Final.rows[17]['자판']}}</td>
              <td class="tg-5l8j">{{chartData3Final.rows[17]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartData3Final.rows[27]['자판']}}</td>
              <td class="tg-5l8j">{{chartData3Final.rows[27]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartData3Final.rows[37]['자판']}}</td>
              <td class="tg-5l8j">{{chartData3Final.rows[37]['속도(타)']}}타</td>
              <td class="tg-vox4"></td>
              <td class="tg-5l8j"></td>
            </tr>
            <tr>
              <td class="tg-vox4">{{chartData3Final.rows[8]['자판']}}</td>
              <td class="tg-5l8j">{{chartData3Final.rows[8]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartData3Final.rows[18]['자판']}}</td>
              <td class="tg-5l8j">{{chartData3Final.rows[18]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartData3Final.rows[28]['자판']}}</td>
              <td class="tg-5l8j">{{chartData3Final.rows[28]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartData3Final.rows[38]['자판']}}</td>
              <td class="tg-5l8j">{{chartData3Final.rows[38]['속도(타)']}}타</td>
              <td class="tg-vox4"></td>
              <td class="tg-5l8j"></td>
            </tr>
            <tr>
              <td class="tg-vox4">{{chartData3Final.rows[9]['자판']}}</td>
              <td class="tg-5l8j">{{chartData3Final.rows[9]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartData3Final.rows[19]['자판']}}</td>
              <td class="tg-5l8j">{{chartData3Final.rows[19]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartData3Final.rows[29]['자판']}}</td>
              <td class="tg-5l8j">{{chartData3Final.rows[29]['속도(타)']}}타</td>
              <td class="tg-vox4">{{chartData3Final.rows[39]['자판']}}</td>
              <td class="tg-5l8j">{{chartData3Final.rows[39]['속도(타)']}}타</td>
              <td class="tg-vox4"></td>
              <td class="tg-5l8j"></td>
            </tr>
          </table>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import Result from "../../utils/result";
import moment from "moment";
import { ExportToCsv } from "export-to-csv";

export default {
  data() { //변수 초기화
    return {
      user: {},
      uuid: 0,
      month: "",
      testthisDate: moment(new Date()).format("YYYY-MM"),
      testDate: moment(new Date()).format("YYYY-MM"),
      year: "",
      thisMonth: parseInt(moment(new Date()).format("MM")),
      language: 0,
      isLoading: false,
      input_total_ACC: [],
      total_Velocity: [],
      isActive: false,
      tab: 0,
      tabs: { tab1: "", tab2: "selected", tab3: "", tab4: "" },
      activeText: "리스트로 보기",
      chartData: {
        columns: ["자판", "속도(타)"],
        rows: [
          { 자판: "`", "속도(타)": 0 },
          { 자판: "1", "속도(타)": 0 },
          { 자판: "2", "속도(타)": 0 },
          { 자판: "3", "속도(타)": 0 },
          { 자판: "4", "속도(타)": 0 },
          { 자판: "5", "속도(타)": 0 },
          { 자판: "6", "속도(타)": 0 },
          { 자판: "7", "속도(타)": 0 },
          { 자판: "8", "속도(타)": 0 },
          { 자판: "9", "속도(타)": 0 },
          { 자판: "0", "속도(타)": 0 },
          { 자판: "-", "속도(타)": 0 },
          { 자판: "=", "속도(타)": 0 },
          { 자판: "₩", "속도(타)": 0 },
          { 자판: "ㅂ", "속도(타)": 0 },
          { 자판: "ㅈ", "속도(타)": 0 },
          { 자판: "ㄷ", "속도(타)": 0 },
          { 자판: "ㄱ", "속도(타)": 0 },
          { 자판: "ㅅ", "속도(타)": 0 },
          { 자판: "ㅛ", "속도(타)": 0 },
          { 자판: "ㅕ", "속도(타)": 0 },
          { 자판: "ㅑ", "속도(타)": 0 },
          { 자판: "ㅐ", "속도(타)": 0 },
          { 자판: "ㅔ", "속도(타)": 0 },
          { 자판: "[", "속도(타)": 0 },
          { 자판: "]", "속도(타)": 0 },
          { 자판: "ㅁ", "속도(타)": 0 },
          { 자판: "ㄴ", "속도(타)": 0 },
          { 자판: "ㅇ", "속도(타)": 0 },
          { 자판: "ㄹ", "속도(타)": 0 },
          { 자판: "ㅎ", "속도(타)": 0 },
          { 자판: "ㅗ", "속도(타)": 0 },
          { 자판: "ㅓ", "속도(타)": 0 },
          { 자판: "ㅏ", "속도(타)": 0 },
          { 자판: "ㅣ", "속도(타)": 0 },
          { 자판: ";", "속도(타)": 0 },
          { 자판: "'", "속도(타)": 0 },
          { 자판: "ㅋ", "속도(타)": 0 },
          { 자판: "ㅌ", "속도(타)": 0 },
          { 자판: "ㅊ", "속도(타)": 0 },
          { 자판: "ㅍ", "속도(타)": 0 },
          { 자판: "ㅠ", "속도(타)": 0 },
          { 자판: "ㅜ", "속도(타)": 0 },
          { 자판: "ㅡ", "속도(타)": 0 },
          { 자판: ",", "속도(타)": 0 },
          { 자판: ".", "속도(타)": 0 }
        ]
      },
      chartDataEng: {
        columns: ["자판", "속도(타)"],
        rows: [
          { 자판: "`", "속도(타)": 0 },
          { 자판: "1", "속도(타)": 0 },
          { 자판: "2", "속도(타)": 0 },
          { 자판: "3", "속도(타)": 0 },
          { 자판: "4", "속도(타)": 0 },
          { 자판: "5", "속도(타)": 0 },
          { 자판: "6", "속도(타)": 0 },
          { 자판: "7", "속도(타)": 0 },
          { 자판: "8", "속도(타)": 0 },
          { 자판: "9", "속도(타)": 0 },
          { 자판: "0", "속도(타)": 0 },
          { 자판: "-", "속도(타)": 0 },
          { 자판: "=", "속도(타)": 0 },
          { 자판: "₩", "속도(타)": 0 },
          { 자판: "Q", "속도(타)": 0 },
          { 자판: "W", "속도(타)": 0 },
          { 자판: "E", "속도(타)": 0 },
          { 자판: "R", "속도(타)": 0 },
          { 자판: "T", "속도(타)": 0 },
          { 자판: "Y", "속도(타)": 0 },
          { 자판: "U", "속도(타)": 0 },
          { 자판: "I", "속도(타)": 0 },
          { 자판: "O", "속도(타)": 0 },
          { 자판: "P", "속도(타)": 0 },
          { 자판: "[", "속도(타)": 0 },
          { 자판: "]", "속도(타)": 0 },
          { 자판: "A", "속도(타)": 0 },
          { 자판: "S", "속도(타)": 0 },
          { 자판: "D", "속도(타)": 0 },
          { 자판: "F", "속도(타)": 0 },
          { 자판: "G", "속도(타)": 0 },
          { 자판: "H", "속도(타)": 0 },
          { 자판: "J", "속도(타)": 0 },
          { 자판: "K", "속도(타)": 0 },
          { 자판: "L", "속도(타)": 0 },
          { 자판: ";", "속도(타)": 0 },
          { 자판: "'", "속도(타)": 0 },
          { 자판: "Z", "속도(타)": 0 },
          { 자판: "X", "속도(타)": 0 },
          { 자판: "C", "속도(타)": 0 },
          { 자판: "V", "속도(타)": 0 },
          { 자판: "B", "속도(타)": 0 },
          { 자판: "N", "속도(타)": 0 },
          { 자판: "M", "속도(타)": 0 },
          { 자판: ",", "속도(타)": 0 },
          { 자판: ".", "속도(타)": 0 }
        ]
      },
      chartDataEngDvo: {
        columns: ["자판", "속도(타)"],
        rows: [
          { 자판: "`", "속도(타)": 0 },
          { 자판: "1", "속도(타)": 0 },
          { 자판: "2", "속도(타)": 0 },
          { 자판: "3", "속도(타)": 0 },
          { 자판: "4", "속도(타)": 0 },
          { 자판: "5", "속도(타)": 0 },
          { 자판: "6", "속도(타)": 0 },
          { 자판: "7", "속도(타)": 0 },
          { 자판: "8", "속도(타)": 0 },
          { 자판: "9", "속도(타)": 0 },
          { 자판: "0", "속도(타)": 0 },
          { 자판: "[", "속도(타)": 0 },
          { 자판: "]", "속도(타)": 0 },
          { 자판: "₩", "속도(타)": 0 },
          { 자판: "'", "속도(타)": 0 },
          { 자판: ",", "속도(타)": 0 },
          { 자판: ".", "속도(타)": 0 },
          { 자판: "P", "속도(타)": 0 },
          { 자판: "Y", "속도(타)": 0 },
          { 자판: "F", "속도(타)": 0 },
          { 자판: "G", "속도(타)": 0 },
          { 자판: "C", "속도(타)": 0 },
          { 자판: "R", "속도(타)": 0 },
          { 자판: "L", "속도(타)": 0 },
          { 자판: "/", "속도(타)": 0 },
          { 자판: "=", "속도(타)": 0 },
          { 자판: "A", "속도(타)": 0 },
          { 자판: "O", "속도(타)": 0 },
          { 자판: "E", "속도(타)": 0 },
          { 자판: "U", "속도(타)": 0 },
          { 자판: "I", "속도(타)": 0 },
          { 자판: "D", "속도(타)": 0 },
          { 자판: "H", "속도(타)": 0 },
          { 자판: "T", "속도(타)": 0 },
          { 자판: "N", "속도(타)": 0 },
          { 자판: "S", "속도(타)": 0 },
          { 자판: "-", "속도(타)": 0 },
          { 자판: ";", "속도(타)": 0 },
          { 자판: "Q", "속도(타)": 0 },
          { 자판: "J", "속도(타)": 0 },
          { 자판: "K", "속도(타)": 0 },
          { 자판: "X", "속도(타)": 0 },
          { 자판: "B", "속도(타)": 0 },
          { 자판: "M", "속도(타)": 0 },
          { 자판: "W", "속도(타)": 0 },
          { 자판: "V", "속도(타)": 0 }
        ]
      },
      chartData390: {
        columns: ["자판", "속도(타)"],
        rows: [
          { 자판: "`", "속도(타)": 0 },
          { 자판: "ㅎ", "속도(타)": 0 },
          { 자판: "ㅆ", "속도(타)": 0 },
          { 자판: "ㅂ", "속도(타)": 0 },
          { 자판: "ㅛ", "속도(타)": 0 },
          { 자판: "ㅠ", "속도(타)": 0 },
          { 자판: "ㅑ", "속도(타)": 0 },
          { 자판: "ㅖ", "속도(타)": 0 },
          { 자판: "ㅢ", "속도(타)": 0 },
          { 자판: "ㅜ", "속도(타)": 0 },
          { 자판: "ㅋ", "속도(타)": 0 },
          { 자판: "-", "속도(타)": 0 },
          { 자판: "=", "속도(타)": 0 },
          { 자판: "₩", "속도(타)": 0 },
          { 자판: "ㅅ", "속도(타)": 0 },
          { 자판: "ㄹ", "속도(타)": 0 },
          { 자판: "ㅕ", "속도(타)": 0 },
          { 자판: "ㅐ", "속도(타)": 0 },
          { 자판: "ㅓ", "속도(타)": 0 },
          { 자판: "ㄹ", "속도(타)": 0 },
          { 자판: "ㄷ", "속도(타)": 0 },
          { 자판: "ㅁ", "속도(타)": 0 },
          { 자판: "ㅊ", "속도(타)": 0 },
          { 자판: "ㅍ", "속도(타)": 0 },
          { 자판: "[", "속도(타)": 0 },
          { 자판: "]", "속도(타)": 0 },
          { 자판: "ㅇ", "속도(타)": 0 },
          { 자판: "ㄴ", "속도(타)": 0 },
          { 자판: "ㅣ", "속도(타)": 0 },
          { 자판: "ㅏ", "속도(타)": 0 },
          { 자판: "ㅡ", "속도(타)": 0 },
          { 자판: "ㄴ", "속도(타)": 0 },
          { 자판: "ㅇ", "속도(타)": 0 },
          { 자판: "ㄱ", "속도(타)": 0 },
          { 자판: "ㅈ", "속도(타)": 0 },
          { 자판: "ㅂ", "속도(타)": 0 },
          { 자판: "ㅌ", "속도(타)": 0 },
          { 자판: "ㅁ", "속도(타)": 0 },
          { 자판: "ㄱ", "속도(타)": 0 },
          { 자판: "ㅔ", "속도(타)": 0 },
          { 자판: "ㅗ", "속도(타)": 0 },
          { 자판: "ㅜ", "속도(타)": 0 },
          { 자판: "ㅅ", "속도(타)": 0 },
          { 자판: "ㅎ", "속도(타)": 0 },
          { 자판: ",", "속도(타)": 0 },
          { 자판: ".", "속도(타)": 0 }
        ]
      },
      chartData3Down: {
        columns: ["자판", "속도(타)"],
        rows: [
          { 자판: "`", "속도(타)": 0 },
          { 자판: "ㅎ", "속도(타)": 0 },
          { 자판: "ㅆ", "속도(타)": 0 },
          { 자판: "ㅂ", "속도(타)": 0 },
          { 자판: "ㅛ", "속도(타)": 0 },
          { 자판: "ㅠ", "속도(타)": 0 },
          { 자판: "ㅑ", "속도(타)": 0 },
          { 자판: "ㅖ", "속도(타)": 0 },
          { 자판: "ㅢ", "속도(타)": 0 },
          { 자판: "ㅋ", "속도(타)": 0 },
          { 자판: "ㅒ", "속도(타)": 0 },
          { 자판: "ㅈ", "속도(타)": 0 },
          { 자판: "ㅊ", "속도(타)": 0 },
          { 자판: "ㅋ", "속도(타)": 0 },
          { 자판: "ㅅ", "속도(타)": 0 },
          { 자판: "ㄹ", "속도(타)": 0 },
          { 자판: "ㅕ", "속도(타)": 0 },
          { 자판: "ㅐ", "속도(타)": 0 },
          { 자판: "ㅓ", "속도(타)": 0 },
          { 자판: "ㄹ", "속도(타)": 0 },
          { 자판: "ㄷ", "속도(타)": 0 },
          { 자판: "ㅁ", "속도(타)": 0 },
          { 자판: "ㅊ", "속도(타)": 0 },
          { 자판: "ㅍ", "속도(타)": 0 },
          { 자판: "ㅌ", "속도(타)": 0 },
          { 자판: "ㅍ", "속도(타)": 0 },
          { 자판: "ㅇ", "속도(타)": 0 },
          { 자판: "ㄴ", "속도(타)": 0 },
          { 자판: "ㅣ", "속도(타)": 0 },
          { 자판: "ㅏ", "속도(타)": 0 },
          { 자판: "ㅡ", "속도(타)": 0 },
          { 자판: "ㄴ", "속도(타)": 0 },
          { 자판: "ㅇ", "속도(타)": 0 },
          { 자판: "ㄱ", "속도(타)": 0 },
          { 자판: "ㅈ", "속도(타)": 0 },
          { 자판: "ㅂ", "속도(타)": 0 },
          { 자판: "ㅌ", "속도(타)": 0 },
          { 자판: "ㅁ", "속도(타)": 0 },
          { 자판: "ㄱ", "속도(타)": 0 },
          { 자판: "ㅔ", "속도(타)": 0 },
          { 자판: "ㅗ", "속도(타)": 0 },
          { 자판: "ㅜ", "속도(타)": 0 },
          { 자판: "ㅅ", "속도(타)": 0 },
          { 자판: "ㅎ", "속도(타)": 0 },
          { 자판: ",", "속도(타)": 0 },
          { 자판: ".", "속도(타)": 0 }
        ]
      },
      chartData3Final: {
        columns: ["자판", "속도(타)"],
        rows: [
          { 자판: "*", "속도(타)": 0 },
          { 자판: "ㅎ", "속도(타)": 0 },
          { 자판: "ㅆ", "속도(타)": 0 },
          { 자판: "ㅂ", "속도(타)": 0 },
          { 자판: "ㅛ", "속도(타)": 0 },
          { 자판: "ㅠ", "속도(타)": 0 },
          { 자판: "ㅑ", "속도(타)": 0 },
          { 자판: "ㅖ", "속도(타)": 0 },
          { 자판: "ㅢ", "속도(타)": 0 },
          { 자판: "ㅋ", "속도(타)": 0 },
          { 자판: "ㅒ", "속도(타)": 0 },
          { 자판: "ㅈ", "속도(타)": 0 },
          { 자판: "ㅊ", "속도(타)": 0 },
          { 자판: "ㅋ", "속도(타)": 0 },
          { 자판: "ㅅ", "속도(타)": 0 },
          { 자판: "ㄹ", "속도(타)": 0 },
          { 자판: "ㅕ", "속도(타)": 0 },
          { 자판: "ㅐ", "속도(타)": 0 },
          { 자판: "ㅓ", "속도(타)": 0 },
          { 자판: "ㄹ", "속도(타)": 0 },
          { 자판: "ㄷ", "속도(타)": 0 },
          { 자판: "ㅁ", "속도(타)": 0 },
          { 자판: "ㅊ", "속도(타)": 0 },
          { 자판: "ㅍ", "속도(타)": 0 },
          { 자판: "ㅌ", "속도(타)": 0 },
          { 자판: "ㅍ", "속도(타)": 0 },
          { 자판: "ㅇ", "속도(타)": 0 },
          { 자판: "ㄴ", "속도(타)": 0 },
          { 자판: "ㅣ", "속도(타)": 0 },
          { 자판: "ㅏ", "속도(타)": 0 },
          { 자판: "ㅡ", "속도(타)": 0 },
          { 자판: "ㄴ", "속도(타)": 0 },
          { 자판: "ㅇ", "속도(타)": 0 },
          { 자판: "ㄱ", "속도(타)": 0 },
          { 자판: "ㅈ", "속도(타)": 0 },
          { 자판: "ㅂ", "속도(타)": 0 },
          { 자판: "ㅌ", "속도(타)": 0 },
          { 자판: "ㅁ", "속도(타)": 0 },
          { 자판: "ㄱ", "속도(타)": 0 },
          { 자판: "ㅔ", "속도(타)": 0 },
          { 자판: "ㅗ", "속도(타)": 0 },
          { 자판: "ㅜ", "속도(타)": 0 },
          { 자판: "ㅅ", "속도(타)": 0 },
          { 자판: "ㅎ", "속도(타)": 0 },
          { 자판: ",", "속도(타)": 0 },
          { 자판: ".", "속도(타)": 0 }
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
        title: "내글쇠별속도",
        filename: "내글쇠별속도",
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
    getUseruuid() {
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

    fetchAnalData() {
      this.$axios
        .post(this.$Api2.analictics.keyVelocityMonthly, {
          uuid: this.uuid,
          language: this.language,
          year: this.year,
          month: parseInt(this.month)
        })
        .then(response => {
          console.log(response.data);
          if (!response || response.data.result !== 0) {
            for (var i = 0; i < this.chartData.rows.length; i++) {
              this.chartData.rows[i]["속도(타)"] = 0;
              this.chartDataEng.rows[i]["속도(타)"] = 0;
            }
            this.$EventBus.$emit("loading-remove", "fetch-analdata");
            return;
          }
          this.input_total_ACC = [];
          this.total_Velocity = [];
          response.data.data.forEach(element => {
            this.input_total_ACC.push(element.input_total_acc);
            this.total_Velocity.push(element.total_velocity);
          });

          for (var i = 0; i < this.input_total_ACC.length; i++) {
            if (this.language === 1 || this.language === 2) {
              this.chartDataEng.rows[i]["속도(타)"] = parseInt(
                this.total_Velocity[i] / this.input_total_ACC[i]
              );
              if (isNaN(this.chartDataEng.rows[i]["속도(타)"])) {
                this.chartDataEng.rows[i]["속도(타)"] = 0;
              }
            } else {
              this.chartData.rows[i]["속도(타)"] = parseInt(
                this.total_Velocity[i] / this.input_total_ACC[i]
              );
              if (isNaN(this.chartData.rows[i]["속도(타)"])) {
                this.chartData.rows[i]["속도(타)"] = 0;
              }
            }
            switch (this.language) {
              case 0:
                this.chartData.rows[i]["속도(타)"] = parseInt(
                  this.total_Velocity[i] / this.input_total_ACC[i]
                );
                if (isNaN(this.chartData.rows[i]["속도(타)"])) {
                  this.chartData.rows[i]["속도(타)"] = 0;
                }
                break;
              case 1:
                this.chartDataEng.rows[i]["속도(타)"] = parseInt(
                  this.total_Velocity[i] / this.input_total_ACC[i]
                );
                if (isNaN(this.chartDataEng.rows[i]["속도(타)"])) {
                  this.chartDataEng.rows[i]["속도(타)"] = 0;
                }
                break;
              case 2:
                this.chartDataEngDvo.rows[i]["속도(타)"] = parseInt(
                  this.total_Velocity[i] / this.input_total_ACC[i]
                );
                if (isNaN(this.chartDataEngDvo.rows[i]["속도(타)"])) {
                  this.chartDataEngDvo.rows[i]["속도(타)"] = 0;
                }
                break;
              case 3:
                this.chartData390.rows[i]["속도(타)"] = parseInt(
                  this.total_Velocity[i] / this.input_total_ACC[i]
                );
                if (isNaN(this.chartData390.rows[i]["속도(타)"])) {
                  this.chartData390.rows[i]["속도(타)"] = 0;
                }
                break;
              case 4:
                this.chartData3Down.rows[i]["속도(타)"] = parseInt(
                  this.total_Velocity[i] / this.input_total_ACC[i]
                );
                if (isNaN(this.chartData3Down.rows[i]["속도(타)"])) {
                  this.chartData3Down.rows[i]["속도(타)"] = 0;
                }
                break;
              case 5:
                this.chartData3Final.rows[i]["속도(타)"] = parseInt(
                  this.total_Velocity[i] / this.input_total_ACC[i]
                );
                if (isNaN(this.chartData3Final.rows[i]["속도(타)"])) {
                  this.chartData3Final.rows[i]["속도(타)"] = 0;
                }
                break;
            }
          }
          this.$EventBus.$emit("loading-remove", "fetch-analdata");
        })
        .catch(error => {
          this.$EventBus.$emit("loading-remove", "fetch-analdata");
          console.log(error);
        });
    },

    fetchAnalDayData() {
      this.$axios
        .post(this.$Api2.analictics.keyVelocityDay, {
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
          this.input_total_ACC = [];
          this.total_Velocity = [];
          response.data.data.forEach(element => {
            this.input_total_ACC.push(element.input_total_acc);
            this.total_Velocity.push(element.total_velocity);
          });

          for (var i = 0; i < this.input_total_ACC.length; i++) {
            switch (this.language) {
              case 0:
                this.chartData.rows[i]["속도(타)"] = parseInt(
                  this.total_Velocity[i] / this.input_total_ACC[i]
                );
                if (isNaN(this.chartData.rows[i]["속도(타)"])) {
                  this.chartData.rows[i]["속도(타)"] = 0;
                }
                break;
              case 1:
                this.chartDataEng.rows[i]["속도(타)"] = parseInt(
                  this.total_Velocity[i] / this.input_total_ACC[i]
                );
                if (isNaN(this.chartDataEng.rows[i]["속도(타)"])) {
                  this.chartDataEng.rows[i]["속도(타)"] = 0;
                }
                break;
              case 2:
                this.chartDataEngDvo.rows[i]["속도(타)"] = parseInt(
                  this.total_Velocity[i] / this.input_total_ACC[i]
                );
                if (isNaN(this.chartDataEngDvo.rows[i]["속도(타)"])) {
                  this.chartDataEngDvo.rows[i]["속도(타)"] = 0;
                }
                break;
              case 3:
                this.chartData390.rows[i]["속도(타)"] = parseInt(
                  this.total_Velocity[i] / this.input_total_ACC[i]
                );
                if (isNaN(this.chartData390.rows[i]["속도(타)"])) {
                  this.chartData390.rows[i]["속도(타)"] = 0;
                }
                break;
              case 4:
                this.chartData3Down.rows[i]["속도(타)"] = parseInt(
                  this.total_Velocity[i] / this.input_total_ACC[i]
                );
                if (isNaN(this.chartData3Down.rows[i]["속도(타)"])) {
                  this.chartData3Down.rows[i]["속도(타)"] = 0;
                }
                break;
              case 5:
                this.chartData3Final.rows[i]["속도(타)"] = parseInt(
                  this.total_Velocity[i] / this.input_total_ACC[i]
                );
                if (isNaN(this.chartData3Final.rows[i]["속도(타)"])) {
                  this.chartData3Final.rows[i]["속도(타)"] = 0;
                }
                break;
            }
          }
          this.$EventBus.$emit("loading-remove", "fetch-analdata");
        })
        .catch(error => {
          this.$EventBus.$emit("loading-remove", "fetch-analdata");
          console.log(error);
        });
    },

    resetTabSelection() {
      this.tabs.tab1 = "";
      this.tabs.tab2 = "selected";
      this.tabs.tab3 = "";
      this.tabs.tab4 = "";
    },

    prev() {
      this.resetTabSelection();
      this.testDate = moment(this.testDate)
        .subtract(1, "M")
        .format("YYYY-MM");
      this.year = this.testDate.split("-")[0];
      this.month = this.testDate.split("-")[1];
      this.fetchAnalData();
    },

    next() {
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
    changeTab(tabNum) {
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

    getThisMonth() {
      this.testDate = moment(this.testthisDate).format("YYYY-MM");
      this.year = this.testDate.split("-")[0];
      console.log(this.year);
      this.month = this.testDate.split("-")[1];
    },
    getThisYear() {
      this.year = parseInt(moment(new Date()).format("YYYY"));
    },
    makeCSV() {
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
    isActive: function(newVal, oldVal) {
      if (!this.isActive) {
        this.activeText = "리스트로 보기";
      } else {
        this.activeText = "그래프로 보기";
      }
    },
    selectedLang: function(newVal, oldVal) {
      switch (this.selectedLang) {
        case "한글":
          this.selectedKeyboard = "두벌식";
          this.keyboardType = 0;
          this.language = this.keyboardType;
          break;
        case "영어":
          this.selectedKeyboard = "쿼티";
          this.keyboardType = 1;
          this.language = this.keyboardType;
          break;
      }
    },
    selectedKeyboard: function(newVal, oldVal) {
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


