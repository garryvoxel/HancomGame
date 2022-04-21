<template>
  <div id="typing-speed" class="mypage-stats-graph-container">
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
        <tbody>
          <table class="tg" style="width:100%;">
            <tr>
              <td class="tg-vox4">{{chartData.rows[0]['자판']}}</td>
              <td class="tg-5l8j">{{chartData.rows[0]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartData.rows[10]['자판']}}</td>
              <td class="tg-5l8j">{{chartData.rows[10]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartData.rows[20]['자판']}}</td>
              <td class="tg-5l8j">{{chartData.rows[20]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartData.rows[30]['자판']}}</td>
              <td class="tg-5l8j">{{chartData.rows[30]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartData.rows[40]['자판']}}</td>
              <td class="tg-5l8j">{{chartData.rows[40]['정확도(%)']}}%</td>
            </tr>
            <tr>
              <td class="tg-vox4">{{chartData.rows[1]['자판']}}</td>
              <td class="tg-5l8j">{{chartData.rows[1]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartData.rows[11]['자판']}}</td>
              <td class="tg-5l8j">{{chartData.rows[11]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartData.rows[21]['자판']}}</td>
              <td class="tg-5l8j">{{chartData.rows[21]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartData.rows[31]['자판']}}</td>
              <td class="tg-5l8j">{{chartData.rows[31]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartData.rows[41]['자판']}}</td>
              <td class="tg-5l8j">{{chartData.rows[41]['정확도(%)']}}%</td>
            </tr>
            <tr>
              <td class="tg-vox4">{{chartData.rows[2]['자판']}}</td>
              <td class="tg-5l8j">{{chartData.rows[2]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartData.rows[12]['자판']}}</td>
              <td class="tg-5l8j">{{chartData.rows[12]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartData.rows[22]['자판']}}</td>
              <td class="tg-5l8j">{{chartData.rows[22]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartData.rows[32]['자판']}}</td>
              <td class="tg-5l8j">{{chartData.rows[32]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartData.rows[42]['자판']}}</td>
              <td class="tg-5l8j">{{chartData.rows[42]['정확도(%)']}}%</td>
            </tr>
            <tr>
              <td class="tg-vox4">{{chartData.rows[3]['자판']}}</td>
              <td class="tg-5l8j">{{chartData.rows[3]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartData.rows[13]['자판']}}</td>
              <td class="tg-5l8j">{{chartData.rows[13]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartData.rows[23]['자판']}}</td>
              <td class="tg-5l8j">{{chartData.rows[23]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartData.rows[33]['자판']}}</td>
              <td class="tg-5l8j">{{chartData.rows[33]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartData.rows[43]['자판']}}</td>
              <td class="tg-5l8j">{{chartData.rows[43]['정확도(%)']}}%</td>
            </tr>
            <tr>
              <td class="tg-vox4">{{chartData.rows[4]['자판']}}</td>
              <td class="tg-5l8j">{{chartData.rows[4]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartData.rows[14]['자판']}}</td>
              <td class="tg-5l8j">{{chartData.rows[14]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartData.rows[24]['자판']}}</td>
              <td class="tg-5l8j">{{chartData.rows[24]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartData.rows[34]['자판']}}</td>
              <td class="tg-5l8j">{{chartData.rows[34]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartData.rows[44]['자판']}}</td>
              <td class="tg-5l8j">{{chartData.rows[44]['정확도(%)']}}%</td>
            </tr>
            <tr>
              <td class="tg-vox4">{{chartData.rows[5]['자판']}}</td>
              <td class="tg-5l8j">{{chartData.rows[5]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartData.rows[15]['자판']}}</td>
              <td class="tg-5l8j">{{chartData.rows[15]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartData.rows[25]['자판']}}</td>
              <td class="tg-5l8j">{{chartData.rows[25]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartData.rows[35]['자판']}}</td>
              <td class="tg-5l8j">{{chartData.rows[35]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartData.rows[45]['자판']}}</td>
              <td class="tg-5l8j">{{chartData.rows[45]['정확도(%)']}}%</td>
            </tr>
            <tr>
              <td class="tg-vox4">{{chartData.rows[6]['자판']}}</td>
              <td class="tg-5l8j">{{chartData.rows[6]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartData.rows[16]['자판']}}</td>
              <td class="tg-5l8j">{{chartData.rows[16]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartData.rows[26]['자판']}}</td>
              <td class="tg-5l8j">{{chartData.rows[26]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartData.rows[36]['자판']}}</td>
              <td class="tg-5l8j">{{chartData.rows[36]['정확도(%)']}}%</td>
              <td class="tg-vox4"></td>
              <td class="tg-5l8j"></td>
            </tr>
            <tr>
              <td class="tg-vox4">{{chartData.rows[7]['자판']}}</td>
              <td class="tg-5l8j">{{chartData.rows[7]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartData.rows[17]['자판']}}</td>
              <td class="tg-5l8j">{{chartData.rows[17]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartData.rows[27]['자판']}}</td>
              <td class="tg-5l8j">{{chartData.rows[27]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartData.rows[37]['자판']}}</td>
              <td class="tg-5l8j">{{chartData.rows[37]['정확도(%)']}}%</td>
              <td class="tg-vox4"></td>
              <td class="tg-5l8j"></td>
            </tr>
            <tr>
              <td class="tg-vox4">{{chartData.rows[8]['자판']}}</td>
              <td class="tg-5l8j">{{chartData.rows[8]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartData.rows[18]['자판']}}</td>
              <td class="tg-5l8j">{{chartData.rows[18]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartData.rows[28]['자판']}}</td>
              <td class="tg-5l8j">{{chartData.rows[28]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartData.rows[38]['자판']}}</td>
              <td class="tg-5l8j">{{chartData.rows[38]['정확도(%)']}}%</td>
              <td class="tg-vox4"></td>
              <td class="tg-5l8j"></td>
            </tr>
            <tr>
              <td class="tg-vox4">{{chartData.rows[9]['자판']}}</td>
              <td class="tg-5l8j">{{chartData.rows[9]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartData.rows[19]['자판']}}</td>
              <td class="tg-5l8j">{{chartData.rows[19]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartData.rows[29]['자판']}}</td>
              <td class="tg-5l8j">{{chartData.rows[29]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartData.rows[39]['자판']}}</td>
              <td class="tg-5l8j">{{chartData.rows[39]['정확도(%)']}}%</td>
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
              <td class="tg-5l8j">{{chartDataEng.rows[0]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartDataEng.rows[10]['자판']}}</td>
              <td class="tg-5l8j">{{chartDataEng.rows[10]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartDataEng.rows[20]['자판']}}</td>
              <td class="tg-5l8j">{{chartDataEng.rows[20]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartDataEng.rows[30]['자판']}}</td>
              <td class="tg-5l8j">{{chartDataEng.rows[30]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartDataEng.rows[40]['자판']}}</td>
              <td class="tg-5l8j">{{chartDataEng.rows[40]['정확도(%)']}}%</td>
            </tr>
            <tr>
              <td class="tg-vox4">{{chartDataEng.rows[1]['자판']}}</td>
              <td class="tg-5l8j">{{chartDataEng.rows[1]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartDataEng.rows[11]['자판']}}</td>
              <td class="tg-5l8j">{{chartDataEng.rows[11]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartDataEng.rows[21]['자판']}}</td>
              <td class="tg-5l8j">{{chartDataEng.rows[21]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartDataEng.rows[31]['자판']}}</td>
              <td class="tg-5l8j">{{chartDataEng.rows[31]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartDataEng.rows[41]['자판']}}</td>
              <td class="tg-5l8j">{{chartDataEng.rows[41]['정확도(%)']}}%</td>
            </tr>
            <tr>
              <td class="tg-vox4">{{chartDataEng.rows[2]['자판']}}</td>
              <td class="tg-5l8j">{{chartDataEng.rows[2]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartDataEng.rows[12]['자판']}}</td>
              <td class="tg-5l8j">{{chartDataEng.rows[12]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartDataEng.rows[22]['자판']}}</td>
              <td class="tg-5l8j">{{chartDataEng.rows[22]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartDataEng.rows[32]['자판']}}</td>
              <td class="tg-5l8j">{{chartDataEng.rows[32]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartDataEng.rows[42]['자판']}}</td>
              <td class="tg-5l8j">{{chartDataEng.rows[42]['정확도(%)']}}%</td>
            </tr>
            <tr>
              <td class="tg-vox4">{{chartDataEng.rows[3]['자판']}}</td>
              <td class="tg-5l8j">{{chartDataEng.rows[3]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartDataEng.rows[13]['자판']}}</td>
              <td class="tg-5l8j">{{chartDataEng.rows[13]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartDataEng.rows[23]['자판']}}</td>
              <td class="tg-5l8j">{{chartDataEng.rows[23]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartDataEng.rows[33]['자판']}}</td>
              <td class="tg-5l8j">{{chartDataEng.rows[33]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartDataEng.rows[43]['자판']}}</td>
              <td class="tg-5l8j">{{chartDataEng.rows[43]['정확도(%)']}}%</td>
            </tr>
            <tr>
              <td class="tg-vox4">{{chartDataEng.rows[4]['자판']}}</td>
              <td class="tg-5l8j">{{chartDataEng.rows[4]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartDataEng.rows[14]['자판']}}</td>
              <td class="tg-5l8j">{{chartDataEng.rows[14]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartDataEng.rows[24]['자판']}}</td>
              <td class="tg-5l8j">{{chartDataEng.rows[24]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartDataEng.rows[34]['자판']}}</td>
              <td class="tg-5l8j">{{chartDataEng.rows[34]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartDataEng.rows[44]['자판']}}</td>
              <td class="tg-5l8j">{{chartDataEng.rows[44]['정확도(%)']}}%</td>
            </tr>
            <tr>
              <td class="tg-vox4">{{chartDataEng.rows[5]['자판']}}</td>
              <td class="tg-5l8j">{{chartDataEng.rows[5]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartDataEng.rows[15]['자판']}}</td>
              <td class="tg-5l8j">{{chartDataEng.rows[15]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartDataEng.rows[25]['자판']}}</td>
              <td class="tg-5l8j">{{chartDataEng.rows[25]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartDataEng.rows[35]['자판']}}</td>
              <td class="tg-5l8j">{{chartDataEng.rows[35]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartDataEng.rows[45]['자판']}}</td>
              <td class="tg-5l8j">{{chartDataEng.rows[45]['정확도(%)']}}%</td>
            </tr>
            <tr>
              <td class="tg-vox4">{{chartDataEng.rows[6]['자판']}}</td>
              <td class="tg-5l8j">{{chartDataEng.rows[6]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartDataEng.rows[16]['자판']}}</td>
              <td class="tg-5l8j">{{chartDataEng.rows[16]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartDataEng.rows[26]['자판']}}</td>
              <td class="tg-5l8j">{{chartDataEng.rows[26]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartDataEng.rows[36]['자판']}}</td>
              <td class="tg-5l8j">{{chartDataEng.rows[36]['정확도(%)']}}%</td>
              <td class="tg-vox4"></td>
              <td class="tg-5l8j"></td>
            </tr>
            <tr>
              <td class="tg-vox4">{{chartDataEng.rows[7]['자판']}}</td>
              <td class="tg-5l8j">{{chartDataEng.rows[7]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartDataEng.rows[17]['자판']}}</td>
              <td class="tg-5l8j">{{chartDataEng.rows[17]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartDataEng.rows[27]['자판']}}</td>
              <td class="tg-5l8j">{{chartDataEng.rows[27]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartDataEng.rows[37]['자판']}}</td>
              <td class="tg-5l8j">{{chartDataEng.rows[37]['정확도(%)']}}%</td>
              <td class="tg-vox4"></td>
              <td class="tg-5l8j"></td>
            </tr>
            <tr>
              <td class="tg-vox4">{{chartDataEng.rows[8]['자판']}}</td>
              <td class="tg-5l8j">{{chartDataEng.rows[8]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartDataEng.rows[18]['자판']}}</td>
              <td class="tg-5l8j">{{chartDataEng.rows[18]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartDataEng.rows[28]['자판']}}</td>
              <td class="tg-5l8j">{{chartDataEng.rows[28]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartDataEng.rows[38]['자판']}}</td>
              <td class="tg-5l8j">{{chartDataEng.rows[38]['정확도(%)']}}%</td>
              <td class="tg-vox4"></td>
              <td class="tg-5l8j"></td>
            </tr>
            <tr>
              <td class="tg-vox4">{{chartDataEng.rows[9]['자판']}}</td>
              <td class="tg-5l8j">{{chartDataEng.rows[9]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartDataEng.rows[19]['자판']}}</td>
              <td class="tg-5l8j">{{chartDataEng.rows[19]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartDataEng.rows[29]['자판']}}</td>
              <td class="tg-5l8j">{{chartDataEng.rows[29]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartDataEng.rows[39]['자판']}}</td>
              <td class="tg-5l8j">{{chartDataEng.rows[39]['정확도(%)']}}%</td>
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
              <td class="tg-5l8j">{{chartDataEngDvo.rows[0]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartDataEngDvo.rows[10]['자판']}}</td>
              <td class="tg-5l8j">{{chartDataEngDvo.rows[10]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartDataEngDvo.rows[20]['자판']}}</td>
              <td class="tg-5l8j">{{chartDataEngDvo.rows[20]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartDataEngDvo.rows[30]['자판']}}</td>
              <td class="tg-5l8j">{{chartDataEngDvo.rows[30]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartDataEngDvo.rows[40]['자판']}}</td>
              <td class="tg-5l8j">{{chartDataEngDvo.rows[40]['정확도(%)']}}%</td>
            </tr>
            <tr>
              <td class="tg-vox4">{{chartDataEngDvo.rows[1]['자판']}}</td>
              <td class="tg-5l8j">{{chartDataEngDvo.rows[1]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartDataEngDvo.rows[11]['자판']}}</td>
              <td class="tg-5l8j">{{chartDataEngDvo.rows[11]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartDataEngDvo.rows[21]['자판']}}</td>
              <td class="tg-5l8j">{{chartDataEngDvo.rows[21]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartDataEngDvo.rows[31]['자판']}}</td>
              <td class="tg-5l8j">{{chartDataEngDvo.rows[31]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartDataEngDvo.rows[41]['자판']}}</td>
              <td class="tg-5l8j">{{chartDataEngDvo.rows[41]['정확도(%)']}}%</td>
            </tr>
            <tr>
              <td class="tg-vox4">{{chartDataEngDvo.rows[2]['자판']}}</td>
              <td class="tg-5l8j">{{chartDataEngDvo.rows[2]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartDataEngDvo.rows[12]['자판']}}</td>
              <td class="tg-5l8j">{{chartDataEngDvo.rows[12]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartDataEngDvo.rows[22]['자판']}}</td>
              <td class="tg-5l8j">{{chartDataEngDvo.rows[22]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartDataEngDvo.rows[32]['자판']}}</td>
              <td class="tg-5l8j">{{chartDataEngDvo.rows[32]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartDataEngDvo.rows[42]['자판']}}</td>
              <td class="tg-5l8j">{{chartDataEngDvo.rows[42]['정확도(%)']}}%</td>
            </tr>
            <tr>
              <td class="tg-vox4">{{chartDataEngDvo.rows[3]['자판']}}</td>
              <td class="tg-5l8j">{{chartDataEngDvo.rows[3]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartDataEngDvo.rows[13]['자판']}}</td>
              <td class="tg-5l8j">{{chartDataEngDvo.rows[13]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartDataEngDvo.rows[23]['자판']}}</td>
              <td class="tg-5l8j">{{chartDataEngDvo.rows[23]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartDataEngDvo.rows[33]['자판']}}</td>
              <td class="tg-5l8j">{{chartDataEngDvo.rows[33]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartDataEngDvo.rows[43]['자판']}}</td>
              <td class="tg-5l8j">{{chartDataEngDvo.rows[43]['정확도(%)']}}%</td>
            </tr>
            <tr>
              <td class="tg-vox4">{{chartDataEngDvo.rows[4]['자판']}}</td>
              <td class="tg-5l8j">{{chartDataEngDvo.rows[4]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartDataEngDvo.rows[14]['자판']}}</td>
              <td class="tg-5l8j">{{chartDataEngDvo.rows[14]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartDataEngDvo.rows[24]['자판']}}</td>
              <td class="tg-5l8j">{{chartDataEngDvo.rows[24]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartDataEngDvo.rows[34]['자판']}}</td>
              <td class="tg-5l8j">{{chartDataEngDvo.rows[34]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartDataEngDvo.rows[44]['자판']}}</td>
              <td class="tg-5l8j">{{chartDataEngDvo.rows[44]['정확도(%)']}}%</td>
            </tr>
            <tr>
              <td class="tg-vox4">{{chartDataEngDvo.rows[5]['자판']}}</td>
              <td class="tg-5l8j">{{chartDataEngDvo.rows[5]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartDataEngDvo.rows[15]['자판']}}</td>
              <td class="tg-5l8j">{{chartDataEngDvo.rows[15]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartDataEngDvo.rows[25]['자판']}}</td>
              <td class="tg-5l8j">{{chartDataEngDvo.rows[25]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartDataEngDvo.rows[35]['자판']}}</td>
              <td class="tg-5l8j">{{chartDataEngDvo.rows[35]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartDataEngDvo.rows[45]['자판']}}</td>
              <td class="tg-5l8j">{{chartDataEngDvo.rows[45]['정확도(%)']}}%</td>
            </tr>
            <tr>
              <td class="tg-vox4">{{chartDataEngDvo.rows[6]['자판']}}</td>
              <td class="tg-5l8j">{{chartDataEngDvo.rows[6]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartDataEngDvo.rows[16]['자판']}}</td>
              <td class="tg-5l8j">{{chartDataEngDvo.rows[16]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartDataEngDvo.rows[26]['자판']}}</td>
              <td class="tg-5l8j">{{chartDataEngDvo.rows[26]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartDataEngDvo.rows[36]['자판']}}</td>
              <td class="tg-5l8j">{{chartDataEngDvo.rows[36]['정확도(%)']}}%</td>
              <td class="tg-vox4"></td>
              <td class="tg-5l8j"></td>
            </tr>
            <tr>
              <td class="tg-vox4">{{chartDataEngDvo.rows[7]['자판']}}</td>
              <td class="tg-5l8j">{{chartDataEngDvo.rows[7]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartDataEngDvo.rows[17]['자판']}}</td>
              <td class="tg-5l8j">{{chartDataEngDvo.rows[17]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartDataEngDvo.rows[27]['자판']}}</td>
              <td class="tg-5l8j">{{chartDataEngDvo.rows[27]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartDataEngDvo.rows[37]['자판']}}</td>
              <td class="tg-5l8j">{{chartDataEngDvo.rows[37]['정확도(%)']}}%</td>
              <td class="tg-vox4"></td>
              <td class="tg-5l8j"></td>
            </tr>
            <tr>
              <td class="tg-vox4">{{chartDataEngDvo.rows[8]['자판']}}</td>
              <td class="tg-5l8j">{{chartDataEngDvo.rows[8]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartDataEngDvo.rows[18]['자판']}}</td>
              <td class="tg-5l8j">{{chartDataEngDvo.rows[18]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartDataEngDvo.rows[28]['자판']}}</td>
              <td class="tg-5l8j">{{chartDataEngDvo.rows[28]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartDataEngDvo.rows[38]['자판']}}</td>
              <td class="tg-5l8j">{{chartDataEngDvo.rows[38]['정확도(%)']}}%</td>
              <td class="tg-vox4"></td>
              <td class="tg-5l8j"></td>
            </tr>
            <tr>
              <td class="tg-vox4">{{chartDataEngDvo.rows[9]['자판']}}</td>
              <td class="tg-5l8j">{{chartDataEngDvo.rows[9]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartDataEngDvo.rows[19]['자판']}}</td>
              <td class="tg-5l8j">{{chartDataEngDvo.rows[19]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartDataEngDvo.rows[29]['자판']}}</td>
              <td class="tg-5l8j">{{chartDataEngDvo.rows[29]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartDataEngDvo.rows[39]['자판']}}</td>
              <td class="tg-5l8j">{{chartDataEngDvo.rows[39]['정확도(%)']}}%</td>
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
              <td class="tg-5l8j">{{chartData390.rows[0]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartData390.rows[10]['자판']}}</td>
              <td class="tg-5l8j">{{chartData390.rows[10]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartData390.rows[20]['자판']}}</td>
              <td class="tg-5l8j">{{chartData390.rows[20]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartData390.rows[30]['자판']}}</td>
              <td class="tg-5l8j">{{chartData390.rows[30]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartData390.rows[40]['자판']}}</td>
              <td class="tg-5l8j">{{chartData390.rows[40]['정확도(%)']}}%</td>
            </tr>
            <tr>
              <td class="tg-vox4">{{chartData390.rows[1]['자판']}}</td>
              <td class="tg-5l8j">{{chartData390.rows[1]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartData390.rows[11]['자판']}}</td>
              <td class="tg-5l8j">{{chartData390.rows[11]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartData390.rows[21]['자판']}}</td>
              <td class="tg-5l8j">{{chartData390.rows[21]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartData390.rows[31]['자판']}}</td>
              <td class="tg-5l8j">{{chartData390.rows[31]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartData390.rows[41]['자판']}}</td>
              <td class="tg-5l8j">{{chartData390.rows[41]['정확도(%)']}}%</td>
            </tr>
            <tr>
              <td class="tg-vox4">{{chartData390.rows[2]['자판']}}</td>
              <td class="tg-5l8j">{{chartData390.rows[2]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartData390.rows[12]['자판']}}</td>
              <td class="tg-5l8j">{{chartData390.rows[12]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartData390.rows[22]['자판']}}</td>
              <td class="tg-5l8j">{{chartData390.rows[22]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartData390.rows[32]['자판']}}</td>
              <td class="tg-5l8j">{{chartData390.rows[32]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartData390.rows[42]['자판']}}</td>
              <td class="tg-5l8j">{{chartData390.rows[42]['정확도(%)']}}%</td>
            </tr>
            <tr>
              <td class="tg-vox4">{{chartData390.rows[3]['자판']}}</td>
              <td class="tg-5l8j">{{chartData390.rows[3]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartData390.rows[13]['자판']}}</td>
              <td class="tg-5l8j">{{chartData390.rows[13]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartData390.rows[23]['자판']}}</td>
              <td class="tg-5l8j">{{chartData390.rows[23]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartData390.rows[33]['자판']}}</td>
              <td class="tg-5l8j">{{chartData390.rows[33]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartData390.rows[43]['자판']}}</td>
              <td class="tg-5l8j">{{chartData390.rows[43]['정확도(%)']}}%</td>
            </tr>
            <tr>
              <td class="tg-vox4">{{chartData390.rows[4]['자판']}}</td>
              <td class="tg-5l8j">{{chartData390.rows[4]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartData390.rows[14]['자판']}}</td>
              <td class="tg-5l8j">{{chartData390.rows[14]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartData390.rows[24]['자판']}}</td>
              <td class="tg-5l8j">{{chartData390.rows[24]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartData390.rows[34]['자판']}}</td>
              <td class="tg-5l8j">{{chartData390.rows[34]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartData390.rows[44]['자판']}}</td>
              <td class="tg-5l8j">{{chartData390.rows[44]['정확도(%)']}}%</td>
            </tr>
            <tr>
              <td class="tg-vox4">{{chartData390.rows[5]['자판']}}</td>
              <td class="tg-5l8j">{{chartData390.rows[5]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartData390.rows[15]['자판']}}</td>
              <td class="tg-5l8j">{{chartData390.rows[15]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartData390.rows[25]['자판']}}</td>
              <td class="tg-5l8j">{{chartData390.rows[25]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartData390.rows[35]['자판']}}</td>
              <td class="tg-5l8j">{{chartData390.rows[35]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartData390.rows[45]['자판']}}</td>
              <td class="tg-5l8j">{{chartData390.rows[45]['정확도(%)']}}%</td>
            </tr>
            <tr>
              <td class="tg-vox4">{{chartData390.rows[6]['자판']}}</td>
              <td class="tg-5l8j">{{chartData390.rows[6]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartData390.rows[16]['자판']}}</td>
              <td class="tg-5l8j">{{chartData390.rows[16]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartData390.rows[26]['자판']}}</td>
              <td class="tg-5l8j">{{chartData390.rows[26]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartData390.rows[36]['자판']}}</td>
              <td class="tg-5l8j">{{chartData390.rows[36]['정확도(%)']}}%</td>
              <td class="tg-vox4"></td>
              <td class="tg-5l8j"></td>
            </tr>
            <tr>
              <td class="tg-vox4">{{chartData390.rows[7]['자판']}}</td>
              <td class="tg-5l8j">{{chartData390.rows[7]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartData390.rows[17]['자판']}}</td>
              <td class="tg-5l8j">{{chartData390.rows[17]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartData390.rows[27]['자판']}}</td>
              <td class="tg-5l8j">{{chartData390.rows[27]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartData390.rows[37]['자판']}}</td>
              <td class="tg-5l8j">{{chartData390.rows[37]['정확도(%)']}}%</td>
              <td class="tg-vox4"></td>
              <td class="tg-5l8j"></td>
            </tr>
            <tr>
              <td class="tg-vox4">{{chartData390.rows[8]['자판']}}</td>
              <td class="tg-5l8j">{{chartData390.rows[8]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartData390.rows[18]['자판']}}</td>
              <td class="tg-5l8j">{{chartData390.rows[18]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartData390.rows[28]['자판']}}</td>
              <td class="tg-5l8j">{{chartData390.rows[28]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartData390.rows[38]['자판']}}</td>
              <td class="tg-5l8j">{{chartData390.rows[38]['정확도(%)']}}%</td>
              <td class="tg-vox4"></td>
              <td class="tg-5l8j"></td>
            </tr>
            <tr>
              <td class="tg-vox4">{{chartData390.rows[9]['자판']}}</td>
              <td class="tg-5l8j">{{chartData390.rows[9]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartData390.rows[19]['자판']}}</td>
              <td class="tg-5l8j">{{chartData390.rows[19]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartData390.rows[29]['자판']}}</td>
              <td class="tg-5l8j">{{chartData390.rows[29]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartData390.rows[39]['자판']}}</td>
              <td class="tg-5l8j">{{chartData390.rows[39]['정확도(%)']}}%</td>
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
              <td class="tg-5l8j">{{chartData3Down.rows[0]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartData3Down.rows[10]['자판']}}</td>
              <td class="tg-5l8j">{{chartData3Down.rows[10]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartData3Down.rows[20]['자판']}}</td>
              <td class="tg-5l8j">{{chartData3Down.rows[20]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartData3Down.rows[30]['자판']}}</td>
              <td class="tg-5l8j">{{chartData3Down.rows[30]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartData3Down.rows[40]['자판']}}</td>
              <td class="tg-5l8j">{{chartData3Down.rows[40]['정확도(%)']}}%</td>
            </tr>
            <tr>
              <td class="tg-vox4">{{chartData3Down.rows[1]['자판']}}</td>
              <td class="tg-5l8j">{{chartData3Down.rows[1]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartData3Down.rows[11]['자판']}}</td>
              <td class="tg-5l8j">{{chartData3Down.rows[11]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartData3Down.rows[21]['자판']}}</td>
              <td class="tg-5l8j">{{chartData3Down.rows[21]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartData3Down.rows[31]['자판']}}</td>
              <td class="tg-5l8j">{{chartData3Down.rows[31]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartData3Down.rows[41]['자판']}}</td>
              <td class="tg-5l8j">{{chartData3Down.rows[41]['정확도(%)']}}%</td>
            </tr>
            <tr>
              <td class="tg-vox4">{{chartData3Down.rows[2]['자판']}}</td>
              <td class="tg-5l8j">{{chartData3Down.rows[2]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartData3Down.rows[12]['자판']}}</td>
              <td class="tg-5l8j">{{chartData3Down.rows[12]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartData3Down.rows[22]['자판']}}</td>
              <td class="tg-5l8j">{{chartData3Down.rows[22]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartData3Down.rows[32]['자판']}}</td>
              <td class="tg-5l8j">{{chartData3Down.rows[32]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartData3Down.rows[42]['자판']}}</td>
              <td class="tg-5l8j">{{chartData3Down.rows[42]['정확도(%)']}}%</td>
            </tr>
            <tr>
              <td class="tg-vox4">{{chartData3Down.rows[3]['자판']}}</td>
              <td class="tg-5l8j">{{chartData3Down.rows[3]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartData3Down.rows[13]['자판']}}</td>
              <td class="tg-5l8j">{{chartData3Down.rows[13]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartData3Down.rows[23]['자판']}}</td>
              <td class="tg-5l8j">{{chartData3Down.rows[23]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartData3Down.rows[33]['자판']}}</td>
              <td class="tg-5l8j">{{chartData3Down.rows[33]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartData3Down.rows[43]['자판']}}</td>
              <td class="tg-5l8j">{{chartData3Down.rows[43]['정확도(%)']}}%</td>
            </tr>
            <tr>
              <td class="tg-vox4">{{chartData3Down.rows[4]['자판']}}</td>
              <td class="tg-5l8j">{{chartData3Down.rows[4]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartData3Down.rows[14]['자판']}}</td>
              <td class="tg-5l8j">{{chartData3Down.rows[14]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartData3Down.rows[24]['자판']}}</td>
              <td class="tg-5l8j">{{chartData3Down.rows[24]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartData3Down.rows[34]['자판']}}</td>
              <td class="tg-5l8j">{{chartData3Down.rows[34]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartData3Down.rows[44]['자판']}}</td>
              <td class="tg-5l8j">{{chartData3Down.rows[44]['정확도(%)']}}%</td>
            </tr>
            <tr>
              <td class="tg-vox4">{{chartData3Down.rows[5]['자판']}}</td>
              <td class="tg-5l8j">{{chartData3Down.rows[5]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartData3Down.rows[15]['자판']}}</td>
              <td class="tg-5l8j">{{chartData3Down.rows[15]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartData3Down.rows[25]['자판']}}</td>
              <td class="tg-5l8j">{{chartData3Down.rows[25]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartData3Down.rows[35]['자판']}}</td>
              <td class="tg-5l8j">{{chartData3Down.rows[35]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartData3Down.rows[45]['자판']}}</td>
              <td class="tg-5l8j">{{chartData3Down.rows[45]['정확도(%)']}}%</td>
            </tr>
            <tr>
              <td class="tg-vox4">{{chartData3Down.rows[6]['자판']}}</td>
              <td class="tg-5l8j">{{chartData3Down.rows[6]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartData3Down.rows[16]['자판']}}</td>
              <td class="tg-5l8j">{{chartData3Down.rows[16]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartData3Down.rows[26]['자판']}}</td>
              <td class="tg-5l8j">{{chartData3Down.rows[26]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartData3Down.rows[36]['자판']}}</td>
              <td class="tg-5l8j">{{chartData3Down.rows[36]['정확도(%)']}}%</td>
              <td class="tg-vox4"></td>
              <td class="tg-5l8j"></td>
            </tr>
            <tr>
              <td class="tg-vox4">{{chartData3Down.rows[7]['자판']}}</td>
              <td class="tg-5l8j">{{chartData3Down.rows[7]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartData3Down.rows[17]['자판']}}</td>
              <td class="tg-5l8j">{{chartData3Down.rows[17]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartData3Down.rows[27]['자판']}}</td>
              <td class="tg-5l8j">{{chartData3Down.rows[27]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartData3Down.rows[37]['자판']}}</td>
              <td class="tg-5l8j">{{chartData3Down.rows[37]['정확도(%)']}}%</td>
              <td class="tg-vox4"></td>
              <td class="tg-5l8j"></td>
            </tr>
            <tr>
              <td class="tg-vox4">{{chartData3Down.rows[8]['자판']}}</td>
              <td class="tg-5l8j">{{chartData3Down.rows[8]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartData3Down.rows[18]['자판']}}</td>
              <td class="tg-5l8j">{{chartData3Down.rows[18]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartData3Down.rows[28]['자판']}}</td>
              <td class="tg-5l8j">{{chartData3Down.rows[28]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartData3Down.rows[38]['자판']}}</td>
              <td class="tg-5l8j">{{chartData3Down.rows[38]['정확도(%)']}}%</td>
              <td class="tg-vox4"></td>
              <td class="tg-5l8j"></td>
            </tr>
            <tr>
              <td class="tg-vox4">{{chartData3Down.rows[9]['자판']}}</td>
              <td class="tg-5l8j">{{chartData3Down.rows[9]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartData3Down.rows[19]['자판']}}</td>
              <td class="tg-5l8j">{{chartData3Down.rows[19]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartData3Down.rows[29]['자판']}}</td>
              <td class="tg-5l8j">{{chartData3Down.rows[29]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartData3Down.rows[39]['자판']}}</td>
              <td class="tg-5l8j">{{chartData3Down.rows[39]['정확도(%)']}}%</td>
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
              <td class="tg-5l8j">{{chartData3Final.rows[0]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartData3Final.rows[10]['자판']}}</td>
              <td class="tg-5l8j">{{chartData3Final.rows[10]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartData3Final.rows[20]['자판']}}</td>
              <td class="tg-5l8j">{{chartData3Final.rows[20]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartData3Final.rows[30]['자판']}}</td>
              <td class="tg-5l8j">{{chartData3Final.rows[30]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartData3Final.rows[40]['자판']}}</td>
              <td class="tg-5l8j">{{chartData3Final.rows[40]['정확도(%)']}}%</td>
            </tr>
            <tr>
              <td class="tg-vox4">{{chartData3Final.rows[1]['자판']}}</td>
              <td class="tg-5l8j">{{chartData3Final.rows[1]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartData3Final.rows[11]['자판']}}</td>
              <td class="tg-5l8j">{{chartData3Final.rows[11]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartData3Final.rows[21]['자판']}}</td>
              <td class="tg-5l8j">{{chartData3Final.rows[21]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartData3Final.rows[31]['자판']}}</td>
              <td class="tg-5l8j">{{chartData3Final.rows[31]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartData3Final.rows[41]['자판']}}</td>
              <td class="tg-5l8j">{{chartData3Final.rows[41]['정확도(%)']}}%</td>
            </tr>
            <tr>
              <td class="tg-vox4">{{chartData3Final.rows[2]['자판']}}</td>
              <td class="tg-5l8j">{{chartData3Final.rows[2]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartData3Final.rows[12]['자판']}}</td>
              <td class="tg-5l8j">{{chartData3Final.rows[12]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartData3Final.rows[22]['자판']}}</td>
              <td class="tg-5l8j">{{chartData3Final.rows[22]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartData3Final.rows[32]['자판']}}</td>
              <td class="tg-5l8j">{{chartData3Final.rows[32]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartData3Final.rows[42]['자판']}}</td>
              <td class="tg-5l8j">{{chartData3Final.rows[42]['정확도(%)']}}%</td>
            </tr>
            <tr>
              <td class="tg-vox4">{{chartData3Final.rows[3]['자판']}}</td>
              <td class="tg-5l8j">{{chartData3Final.rows[3]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartData3Final.rows[13]['자판']}}</td>
              <td class="tg-5l8j">{{chartData3Final.rows[13]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartData3Final.rows[23]['자판']}}</td>
              <td class="tg-5l8j">{{chartData3Final.rows[23]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartData3Final.rows[33]['자판']}}</td>
              <td class="tg-5l8j">{{chartData3Final.rows[33]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartData3Final.rows[43]['자판']}}</td>
              <td class="tg-5l8j">{{chartData3Final.rows[43]['정확도(%)']}}%</td>
            </tr>
            <tr>
              <td class="tg-vox4">{{chartData3Final.rows[4]['자판']}}</td>
              <td class="tg-5l8j">{{chartData3Final.rows[4]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartData3Final.rows[14]['자판']}}</td>
              <td class="tg-5l8j">{{chartData3Final.rows[14]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartData3Final.rows[24]['자판']}}</td>
              <td class="tg-5l8j">{{chartData3Final.rows[24]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartData3Final.rows[34]['자판']}}</td>
              <td class="tg-5l8j">{{chartData3Final.rows[34]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartData3Final.rows[44]['자판']}}</td>
              <td class="tg-5l8j">{{chartData3Final.rows[44]['정확도(%)']}}%</td>
            </tr>
            <tr>
              <td class="tg-vox4">{{chartData3Final.rows[5]['자판']}}</td>
              <td class="tg-5l8j">{{chartData3Final.rows[5]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartData3Final.rows[15]['자판']}}</td>
              <td class="tg-5l8j">{{chartData3Final.rows[15]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartData3Final.rows[25]['자판']}}</td>
              <td class="tg-5l8j">{{chartData3Final.rows[25]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartData3Final.rows[35]['자판']}}</td>
              <td class="tg-5l8j">{{chartData3Final.rows[35]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartData3Final.rows[45]['자판']}}</td>
              <td class="tg-5l8j">{{chartData3Final.rows[45]['정확도(%)']}}%</td>
            </tr>
            <tr>
              <td class="tg-vox4">{{chartData3Final.rows[6]['자판']}}</td>
              <td class="tg-5l8j">{{chartData3Final.rows[6]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartData3Final.rows[16]['자판']}}</td>
              <td class="tg-5l8j">{{chartData3Final.rows[16]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartData3Final.rows[26]['자판']}}</td>
              <td class="tg-5l8j">{{chartData3Final.rows[26]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartData3Final.rows[36]['자판']}}</td>
              <td class="tg-5l8j">{{chartData3Final.rows[36]['정확도(%)']}}%</td>
              <td class="tg-vox4"></td>
              <td class="tg-5l8j"></td>
            </tr>
            <tr>
              <td class="tg-vox4">{{chartData3Final.rows[7]['자판']}}</td>
              <td class="tg-5l8j">{{chartData3Final.rows[7]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartData3Final.rows[17]['자판']}}</td>
              <td class="tg-5l8j">{{chartData3Final.rows[17]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartData3Final.rows[27]['자판']}}</td>
              <td class="tg-5l8j">{{chartData3Final.rows[27]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartData3Final.rows[37]['자판']}}</td>
              <td class="tg-5l8j">{{chartData3Final.rows[37]['정확도(%)']}}%</td>
              <td class="tg-vox4"></td>
              <td class="tg-5l8j"></td>
            </tr>
            <tr>
              <td class="tg-vox4">{{chartData3Final.rows[8]['자판']}}</td>
              <td class="tg-5l8j">{{chartData3Final.rows[8]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartData3Final.rows[18]['자판']}}</td>
              <td class="tg-5l8j">{{chartData3Final.rows[18]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartData3Final.rows[28]['자판']}}</td>
              <td class="tg-5l8j">{{chartData3Final.rows[28]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartData3Final.rows[38]['자판']}}</td>
              <td class="tg-5l8j">{{chartData3Final.rows[38]['정확도(%)']}}%</td>
              <td class="tg-vox4"></td>
              <td class="tg-5l8j"></td>
            </tr>
            <tr>
              <td class="tg-vox4">{{chartData3Final.rows[9]['자판']}}</td>
              <td class="tg-5l8j">{{chartData3Final.rows[9]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartData3Final.rows[19]['자판']}}</td>
              <td class="tg-5l8j">{{chartData3Final.rows[19]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartData3Final.rows[29]['자판']}}</td>
              <td class="tg-5l8j">{{chartData3Final.rows[29]['정확도(%)']}}%</td>
              <td class="tg-vox4">{{chartData3Final.rows[39]['자판']}}</td>
              <td class="tg-5l8j">{{chartData3Final.rows[39]['정확도(%)']}}%</td>
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
      language: 0,
      month: "",
      testthisDate: moment(new Date()).format("YYYY-MM"),
      testDate: moment(new Date()).format("YYYY-MM"),
      year: parseInt(moment(new Date()).format("YYYY")),
      thisMonth: parseInt(moment(new Date()).format("MM")),
      isLoading: false,
      total_ACC: [],
      total_Count: [],
      isActive: false,
      tab: 0,
      tabs: { tab1: "", tab2: "selected", tab3: "", tab4: "" },
      activeText: "리스트로 보기",
      chartData: {
        columns: ["자판", "정확도(%)"],
        rows: [
          { 자판: "`", "정확도(%)": 0 },
          { 자판: "1", "정확도(%)": 0 },
          { 자판: "2", "정확도(%)": 0 },
          { 자판: "3", "정확도(%)": 0 },
          { 자판: "4", "정확도(%)": 0 },
          { 자판: "5", "정확도(%)": 0 },
          { 자판: "6", "정확도(%)": 0 },
          { 자판: "7", "정확도(%)": 0 },
          { 자판: "8", "정확도(%)": 0 },
          { 자판: "9", "정확도(%)": 0 },
          { 자판: "0", "정확도(%)": 0 },
          { 자판: "-", "정확도(%)": 0 },
          { 자판: "=", "정확도(%)": 0 },
          { 자판: "₩", "정확도(%)": 0 },
          { 자판: "ㅂ", "정확도(%)": 0 },
          { 자판: "ㅈ", "정확도(%)": 0 },
          { 자판: "ㄷ", "정확도(%)": 0 },
          { 자판: "ㄱ", "정확도(%)": 0 },
          { 자판: "ㅅ", "정확도(%)": 0 },
          { 자판: "ㅛ", "정확도(%)": 0 },
          { 자판: "ㅕ", "정확도(%)": 0 },
          { 자판: "ㅑ", "정확도(%)": 0 },
          { 자판: "ㅐ", "정확도(%)": 0 },
          { 자판: "ㅔ", "정확도(%)": 0 },
          { 자판: "[", "정확도(%)": 0 },
          { 자판: "]", "정확도(%)": 0 },
          { 자판: "ㅁ", "정확도(%)": 0 },
          { 자판: "ㄴ", "정확도(%)": 0 },
          { 자판: "ㅇ", "정확도(%)": 0 },
          { 자판: "ㄹ", "정확도(%)": 0 },
          { 자판: "ㅎ", "정확도(%)": 0 },
          { 자판: "ㅗ", "정확도(%)": 0 },
          { 자판: "ㅓ", "정확도(%)": 0 },
          { 자판: "ㅏ", "정확도(%)": 0 },
          { 자판: "ㅣ", "정확도(%)": 0 },
          { 자판: ";", "정확도(%)": 0 },
          { 자판: "'", "정확도(%)": 0 },
          { 자판: "ㅋ", "정확도(%)": 0 },
          { 자판: "ㅌ", "정확도(%)": 0 },
          { 자판: "ㅊ", "정확도(%)": 0 },
          { 자판: "ㅍ", "정확도(%)": 0 },
          { 자판: "ㅠ", "정확도(%)": 0 },
          { 자판: "ㅜ", "정확도(%)": 0 },
          { 자판: "ㅡ", "정확도(%)": 0 },
          { 자판: ",", "정확도(%)": 0 },
          { 자판: ".", "정확도(%)": 0 }
        ]
      },
      chartDataEng: {
        columns: ["자판", "정확도(%)"],
        rows: [
          { 자판: "`", "정확도(%)": 0 },
          { 자판: "1", "정확도(%)": 0 },
          { 자판: "2", "정확도(%)": 0 },
          { 자판: "3", "정확도(%)": 0 },
          { 자판: "4", "정확도(%)": 0 },
          { 자판: "5", "정확도(%)": 0 },
          { 자판: "6", "정확도(%)": 0 },
          { 자판: "7", "정확도(%)": 0 },
          { 자판: "8", "정확도(%)": 0 },
          { 자판: "9", "정확도(%)": 0 },
          { 자판: "0", "정확도(%)": 0 },
          { 자판: "-", "정확도(%)": 0 },
          { 자판: "=", "정확도(%)": 0 },
          { 자판: "₩", "정확도(%)": 0 },
          { 자판: "Q", "정확도(%)": 0 },
          { 자판: "W", "정확도(%)": 0 },
          { 자판: "E", "정확도(%)": 0 },
          { 자판: "R", "정확도(%)": 0 },
          { 자판: "T", "정확도(%)": 0 },
          { 자판: "Y", "정확도(%)": 0 },
          { 자판: "U", "정확도(%)": 0 },
          { 자판: "I", "정확도(%)": 0 },
          { 자판: "O", "정확도(%)": 0 },
          { 자판: "P", "정확도(%)": 0 },
          { 자판: "[", "정확도(%)": 0 },
          { 자판: "]", "정확도(%)": 0 },
          { 자판: "A", "정확도(%)": 0 },
          { 자판: "S", "정확도(%)": 0 },
          { 자판: "D", "정확도(%)": 0 },
          { 자판: "F", "정확도(%)": 0 },
          { 자판: "G", "정확도(%)": 0 },
          { 자판: "H", "정확도(%)": 0 },
          { 자판: "J", "정확도(%)": 0 },
          { 자판: "K", "정확도(%)": 0 },
          { 자판: "L", "정확도(%)": 0 },
          { 자판: ";", "정확도(%)": 0 },
          { 자판: "'", "정확도(%)": 0 },
          { 자판: "Z", "정확도(%)": 0 },
          { 자판: "X", "정확도(%)": 0 },
          { 자판: "C", "정확도(%)": 0 },
          { 자판: "V", "정확도(%)": 0 },
          { 자판: "B", "정확도(%)": 0 },
          { 자판: "N", "정확도(%)": 0 },
          { 자판: "M", "정확도(%)": 0 },
          { 자판: ",", "정확도(%)": 0 },
          { 자판: ".", "정확도(%)": 0 }
        ]
      },
      chartData390: {
        columns: ["자판", "정확도(%)"],
        rows: [
          { 자판: "`", "정확도(%)": 0 },
          { 자판: "ㅎ", "정확도(%)": 0 },
          { 자판: "ㅆ", "정확도(%)": 0 },
          { 자판: "ㅂ", "정확도(%)": 0 },
          { 자판: "ㅛ", "정확도(%)": 0 },
          { 자판: "ㅠ", "정확도(%)": 0 },
          { 자판: "ㅑ", "정확도(%)": 0 },
          { 자판: "ㅖ", "정확도(%)": 0 },
          { 자판: "ㅢ", "정확도(%)": 0 },
          { 자판: "ㅜ", "정확도(%)": 0 },
          { 자판: "ㅋ", "정확도(%)": 0 },
          { 자판: "-", "정확도(%)": 0 },
          { 자판: "=", "정확도(%)": 0 },
          { 자판: "₩", "정확도(%)": 0 },
          { 자판: "ㅅ", "정확도(%)": 0 },
          { 자판: "ㄹ", "정확도(%)": 0 },
          { 자판: "ㅕ", "정확도(%)": 0 },
          { 자판: "ㅐ", "정확도(%)": 0 },
          { 자판: "ㅓ", "정확도(%)": 0 },
          { 자판: "ㄹ", "정확도(%)": 0 },
          { 자판: "ㄷ", "정확도(%)": 0 },
          { 자판: "ㅁ", "정확도(%)": 0 },
          { 자판: "ㅊ", "정확도(%)": 0 },
          { 자판: "ㅍ", "정확도(%)": 0 },
          { 자판: "[", "정확도(%)": 0 },
          { 자판: "]", "정확도(%)": 0 },
          { 자판: "ㅇ", "정확도(%)": 0 },
          { 자판: "ㄴ", "정확도(%)": 0 },
          { 자판: "ㅣ", "정확도(%)": 0 },
          { 자판: "ㅏ", "정확도(%)": 0 },
          { 자판: "ㅡ", "정확도(%)": 0 },
          { 자판: "ㄴ", "정확도(%)": 0 },
          { 자판: "ㅇ", "정확도(%)": 0 },
          { 자판: "ㄱ", "정확도(%)": 0 },
          { 자판: "ㅈ", "정확도(%)": 0 },
          { 자판: "ㅂ", "정확도(%)": 0 },
          { 자판: "ㅌ", "정확도(%)": 0 },
          { 자판: "ㅁ", "정확도(%)": 0 },
          { 자판: "ㄱ", "정확도(%)": 0 },
          { 자판: "ㅔ", "정확도(%)": 0 },
          { 자판: "ㅗ", "정확도(%)": 0 },
          { 자판: "ㅜ", "정확도(%)": 0 },
          { 자판: "ㅅ", "정확도(%)": 0 },
          { 자판: "ㅎ", "정확도(%)": 0 },
          { 자판: ",", "정확도(%)": 0 },
          { 자판: ".", "정확도(%)": 0 }
        ]
      },
      chartData3Down: {
        columns: ["자판", "정확도(%)"],
        rows: [
          { 자판: "`", "정확도(%)": 0 },
          { 자판: "ㅎ", "정확도(%)": 0 },
          { 자판: "ㅆ", "정확도(%)": 0 },
          { 자판: "ㅂ", "정확도(%)": 0 },
          { 자판: "ㅛ", "정확도(%)": 0 },
          { 자판: "ㅠ", "정확도(%)": 0 },
          { 자판: "ㅑ", "정확도(%)": 0 },
          { 자판: "ㅖ", "정확도(%)": 0 },
          { 자판: "ㅢ", "정확도(%)": 0 },
          { 자판: "ㅋ", "정확도(%)": 0 },
          { 자판: "ㅒ", "정확도(%)": 0 },
          { 자판: "ㅈ", "정확도(%)": 0 },
          { 자판: "ㅊ", "정확도(%)": 0 },
          { 자판: "ㅋ", "정확도(%)": 0 },
          { 자판: "ㅅ", "정확도(%)": 0 },
          { 자판: "ㄹ", "정확도(%)": 0 },
          { 자판: "ㅕ", "정확도(%)": 0 },
          { 자판: "ㅐ", "정확도(%)": 0 },
          { 자판: "ㅓ", "정확도(%)": 0 },
          { 자판: "ㄹ", "정확도(%)": 0 },
          { 자판: "ㄷ", "정확도(%)": 0 },
          { 자판: "ㅁ", "정확도(%)": 0 },
          { 자판: "ㅊ", "정확도(%)": 0 },
          { 자판: "ㅍ", "정확도(%)": 0 },
          { 자판: "ㅌ", "정확도(%)": 0 },
          { 자판: "ㅍ", "정확도(%)": 0 },
          { 자판: "ㅇ", "정확도(%)": 0 },
          { 자판: "ㄴ", "정확도(%)": 0 },
          { 자판: "ㅣ", "정확도(%)": 0 },
          { 자판: "ㅏ", "정확도(%)": 0 },
          { 자판: "ㅡ", "정확도(%)": 0 },
          { 자판: "ㄴ", "정확도(%)": 0 },
          { 자판: "ㅇ", "정확도(%)": 0 },
          { 자판: "ㄱ", "정확도(%)": 0 },
          { 자판: "ㅈ", "정확도(%)": 0 },
          { 자판: "ㅂ", "정확도(%)": 0 },
          { 자판: "ㅌ", "정확도(%)": 0 },
          { 자판: "ㅁ", "정확도(%)": 0 },
          { 자판: "ㄱ", "정확도(%)": 0 },
          { 자판: "ㅔ", "정확도(%)": 0 },
          { 자판: "ㅗ", "정확도(%)": 0 },
          { 자판: "ㅜ", "정확도(%)": 0 },
          { 자판: "ㅅ", "정확도(%)": 0 },
          { 자판: "ㅎ", "정확도(%)": 0 },
          { 자판: ",", "정확도(%)": 0 },
          { 자판: ".", "정확도(%)": 0 }
        ]
      },
      chartData3Final: {
        columns: ["자판", "정확도(%)"],
        rows: [
          { 자판: "*", "정확도(%)": 0 },
          { 자판: "ㅎ", "정확도(%)": 0 },
          { 자판: "ㅆ", "정확도(%)": 0 },
          { 자판: "ㅂ", "정확도(%)": 0 },
          { 자판: "ㅛ", "정확도(%)": 0 },
          { 자판: "ㅠ", "정확도(%)": 0 },
          { 자판: "ㅑ", "정확도(%)": 0 },
          { 자판: "ㅖ", "정확도(%)": 0 },
          { 자판: "ㅢ", "정확도(%)": 0 },
          { 자판: "ㅋ", "정확도(%)": 0 },
          { 자판: "ㅒ", "정확도(%)": 0 },
          { 자판: "ㅈ", "정확도(%)": 0 },
          { 자판: "ㅊ", "정확도(%)": 0 },
          { 자판: "ㅋ", "정확도(%)": 0 },
          { 자판: "ㅅ", "정확도(%)": 0 },
          { 자판: "ㄹ", "정확도(%)": 0 },
          { 자판: "ㅕ", "정확도(%)": 0 },
          { 자판: "ㅐ", "정확도(%)": 0 },
          { 자판: "ㅓ", "정확도(%)": 0 },
          { 자판: "ㄹ", "정확도(%)": 0 },
          { 자판: "ㄷ", "정확도(%)": 0 },
          { 자판: "ㅁ", "정확도(%)": 0 },
          { 자판: "ㅊ", "정확도(%)": 0 },
          { 자판: "ㅍ", "정확도(%)": 0 },
          { 자판: "ㅌ", "정확도(%)": 0 },
          { 자판: "ㅍ", "정확도(%)": 0 },
          { 자판: "ㅇ", "정확도(%)": 0 },
          { 자판: "ㄴ", "정확도(%)": 0 },
          { 자판: "ㅣ", "정확도(%)": 0 },
          { 자판: "ㅏ", "정확도(%)": 0 },
          { 자판: "ㅡ", "정확도(%)": 0 },
          { 자판: "ㄴ", "정확도(%)": 0 },
          { 자판: "ㅇ", "정확도(%)": 0 },
          { 자판: "ㄱ", "정확도(%)": 0 },
          { 자판: "ㅈ", "정확도(%)": 0 },
          { 자판: "ㅂ", "정확도(%)": 0 },
          { 자판: "ㅌ", "정확도(%)": 0 },
          { 자판: "ㅁ", "정확도(%)": 0 },
          { 자판: "ㄱ", "정확도(%)": 0 },
          { 자판: "ㅔ", "정확도(%)": 0 },
          { 자판: "ㅗ", "정확도(%)": 0 },
          { 자판: "ㅜ", "정확도(%)": 0 },
          { 자판: "ㅅ", "정확도(%)": 0 },
          { 자판: "ㅎ", "정확도(%)": 0 },
          { 자판: ",", "정확도(%)": 0 },
          { 자판: ".", "정확도(%)": 0 }
        ]
      },
      chartDataEngDvo: {
        columns: ["자판", "정확도(%)"],
        rows: [
          { 자판: "`", "정확도(%)": 0 },
          { 자판: "1", "정확도(%)": 0 },
          { 자판: "2", "정확도(%)": 0 },
          { 자판: "3", "정확도(%)": 0 },
          { 자판: "4", "정확도(%)": 0 },
          { 자판: "5", "정확도(%)": 0 },
          { 자판: "6", "정확도(%)": 0 },
          { 자판: "7", "정확도(%)": 0 },
          { 자판: "8", "정확도(%)": 0 },
          { 자판: "9", "정확도(%)": 0 },
          { 자판: "0", "정확도(%)": 0 },
          { 자판: "[", "정확도(%)": 0 },
          { 자판: "]", "정확도(%)": 0 },
          { 자판: "₩", "정확도(%)": 0 },
          { 자판: "'", "정확도(%)": 0 },
          { 자판: ",", "정확도(%)": 0 },
          { 자판: ".", "정확도(%)": 0 },
          { 자판: "P", "정확도(%)": 0 },
          { 자판: "Y", "정확도(%)": 0 },
          { 자판: "F", "정확도(%)": 0 },
          { 자판: "G", "정확도(%)": 0 },
          { 자판: "C", "정확도(%)": 0 },
          { 자판: "R", "정확도(%)": 0 },
          { 자판: "L", "정확도(%)": 0 },
          { 자판: "/", "정확도(%)": 0 },
          { 자판: "=", "정확도(%)": 0 },
          { 자판: "A", "정확도(%)": 0 },
          { 자판: "O", "정확도(%)": 0 },
          { 자판: "E", "정확도(%)": 0 },
          { 자판: "U", "정확도(%)": 0 },
          { 자판: "I", "정확도(%)": 0 },
          { 자판: "D", "정확도(%)": 0 },
          { 자판: "H", "정확도(%)": 0 },
          { 자판: "T", "정확도(%)": 0 },
          { 자판: "N", "정확도(%)": 0 },
          { 자판: "S", "정확도(%)": 0 },
          { 자판: "-", "정확도(%)": 0 },
          { 자판: ";", "정확도(%)": 0 },
          { 자판: "Q", "정확도(%)": 0 },
          { 자판: "J", "정확도(%)": 0 },
          { 자판: "K", "정확도(%)": 0 },
          { 자판: "X", "정확도(%)": 0 },
          { 자판: "B", "정확도(%)": 0 },
          { 자판: "M", "정확도(%)": 0 },
          { 자판: "W", "정확도(%)": 0 },
          { 자판: "V", "정확도(%)": 0 }
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
        title: "내글쇠별정확도",
        filename: "내글쇠별정확도",
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
    getUseruuid() { //유져 UUID가져오기 함수
      // this.$EventBus.$emit("loading-add", "fetch-analdata");
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
          //   this.$EventBus.$emit('loading-remove', 'fetch-analdata');
          console.log(error);
        });
    },

    fetchAnalData() { //월 분석자료 가져오기 함수
      //   this.$EventBus.$emit('loading-add', 'fetch-analdata');
      this.$axios
        .post(this.$Api2.analictics.keyAccMonthly, {
          uuid: this.uuid,
          language: this.language,
          year: this.year,
          month: parseInt(this.month)
        })
        .then(response => {
          console.log(response.data);
          if (
            !response ||
            response.data.result === 10651 ||
            !response.data.data
          ) {
            for (var i = 0; i < this.chartData.rows.length; i++) {
              this.chartData.rows[i]["정확도(%)"] = 0;
              this.chartDataEng.rows[i]["정확도(%)"] = 0;
            }
            // this.$EventBus.$emit('loading-remove', 'fetch-analdata');
            return;
          }
          //   this.$EventBus.$emit('loading-remove', 'fetch-analdata');
          this.total_ACC = [];
          this.total_Count = [];
          console.log(response.data.data);

          for (var i = 0; i < 46; i++) {
            this.total_ACC.push(response.data.data[i].total_acc);
            this.total_Count.push(response.data.data[i].input_total_count);
            // if(this.language === 1 || this.language === 2){
            //     this.chartDataEng.rows[i]['정확도(%)'] = parseInt(this.total_ACC[i]/this.total_Count[i]*100);
            //     if(isNaN(this.chartDataEng.rows[i]['정확도(%)'])){
            //         this.chartDataEng.rows[i]['정확도(%)'] = 0;
            //     }
            // }else{
            //     this.chartData.rows[i]['정확도(%)'] = parseInt(this.total_ACC[i]/this.total_Count[i]*100);
            //     if(isNaN(this.chartData.rows[i]['정확도(%)'])){
            //         this.chartData.rows[i]['정확도(%)'] = 0;
            //     }
            // }
            switch (this.language) {
              case 0:
                this.chartData.rows[i]["정확도(%)"] = parseInt(
                  (this.total_ACC[i] / this.total_Count[i]) * 100
                );
                if (isNaN(this.chartData.rows[i]["정확도(%)"])) {
                  this.chartData.rows[i]["정확도(%)"] = 0;
                }
                break;
              case 1:
                this.chartDataEng.rows[i]["정확도(%)"] = parseInt(
                  (this.total_ACC[i] / this.total_Count[i]) * 100
                );
                if (isNaN(this.chartDataEng.rows[i]["정확도(%)"])) {
                  this.chartDataEng.rows[i]["정확도(%)"] = 0;
                }
                break;
              case 2:
                this.chartDataEngDvo.rows[i]["정확도(%)"] = parseInt(
                  (this.total_ACC[i] / this.total_Count[i]) * 100
                );
                if (isNaN(this.chartDataEngDvo.rows[i]["정확도(%)"])) {
                  this.chartDataEngDvo.rows[i]["정확도(%)"] = 0;
                }
                break;
              case 3:
                this.chartData390.rows[i]["정확도(%)"] = parseInt(
                  (this.total_ACC[i] / this.total_Count[i]) * 100
                );
                if (isNaN(this.chartData390.rows[i]["정확도(%)"])) {
                  this.chartData390.rows[i]["정확도(%)"] = 0;
                }
                break;
              case 4:
                this.chartData3Down.rows[i]["정확도(%)"] = parseInt(
                  (this.total_ACC[i] / this.total_Count[i]) * 100
                );
                if (isNaN(this.chartData3Down.rows[i]["정확도(%)"])) {
                  this.chartData3Down.rows[i]["정확도(%)"] = 0;
                }
                break;
              case 5:
                this.chartData3Final.rows[i]["정확도(%)"] = parseInt(
                  (this.total_ACC[i] / this.total_Count[i]) * 100
                );
                if (isNaN(this.chartData3Final.rows[i]["정확도(%)"])) {
                  this.chartData3Final.rows[i]["정확도(%)"] = 0;
                }
                break;
            }
          }

          //   this.$EventBus.$emit('loading-remove', 'fetch-analdata');
        })
        .catch(error => {
          //   this.$EventBus.$emit('loading-remove', 'fetch-analdata');
          console.log(error);
        });
    },

    fetchAnalDayData() { //일 분석자료 가져오기 함수
      this.$axios
        .post(this.$Api2.analictics.keyAccDay, {
          uuid: this.uuid,
          language: this.language
        })
        .then(response => {
          console.log(response.data);
          console.log("ACC");
          if (!response || response.data.result !== 0) {
            for (var i = 0; i < this.chartData.rows.length; i++) {
              this.chartData.rows[i]["정확도(%)"] = 0;
            }
            // this.$EventBus.$emit('loading-remove', 'fetch-analdata');
            return;
          }

          this.total_ACC = [];
          this.total_Count = [];
          for (var i = 0; i < response.data.data.length; i++) {
            this.total_ACC.push(response.data.data[i].total_acc);
            this.total_Count.push(response.data.data[i].input_total_count);
            // if(this.language === 1 || this.language === 2){
            //     this.chartDataEng.rows[i]['정확도(%)'] = parseInt(this.total_ACC[i]/this.total_Count[i]*100);
            //     if(isNaN(this.chartDataEng.rows[i]['정확도(%)'])){
            //         this.chartDataEng.rows[i]['정확도(%)'] = 0;
            //     }
            // }else{
            //     this.chartData.rows[i]['정확도(%)'] = parseInt(this.total_ACC[i]/this.total_Count[i]*100);
            //     if(isNaN(this.chartData.rows[i]['정확도(%)'])){
            //         this.chartData.rows[i]['정확도(%)'] = 0;
            //     }
            // }
            switch (this.language) {
              case 0:
                this.chartData.rows[i]["정확도(%)"] = parseInt(
                  (this.total_ACC[i] / this.total_Count[i]) * 100
                );
                if (isNaN(this.chartData.rows[i]["정확도(%)"])) {
                  this.chartData.rows[i]["정확도(%)"] = 0;
                }
                break;
              case 1:
                this.chartDataEng.rows[i]["정확도(%)"] = parseInt(
                  (this.total_ACC[i] / this.total_Count[i]) * 100
                );
                if (isNaN(this.chartDataEng.rows[i]["정확도(%)"])) {
                  this.chartDataEng.rows[i]["정확도(%)"] = 0;
                }
                break;
              case 2:
                this.chartDataEngDvo.rows[i]["정확도(%)"] = parseInt(
                  (this.total_ACC[i] / this.total_Count[i]) * 100
                );
                if (isNaN(this.chartDataEngDvo.rows[i]["정확도(%)"])) {
                  this.chartDataEngDvo.rows[i]["정확도(%)"] = 0;
                }
                break;
              case 3:
                this.chartData390.rows[i]["정확도(%)"] = parseInt(
                  (this.total_ACC[i] / this.total_Count[i]) * 100
                );
                if (isNaN(this.chartData390.rows[i]["정확도(%)"])) {
                  this.chartData390.rows[i]["정확도(%)"] = 0;
                }
                break;
              case 4:
                this.chartData3Down.rows[i]["정확도(%)"] = parseInt(
                  (this.total_ACC[i] / this.total_Count[i]) * 100
                );
                if (isNaN(this.chartData3Down.rows[i]["정확도(%)"])) {
                  this.chartData3Down.rows[i]["정확도(%)"] = 0;
                }
                break;
              case 5:
                this.chartData3Final.rows[i]["정확도(%)"] = parseInt(
                  (this.total_ACC[i] / this.total_Count[i]) * 100
                );
                if (isNaN(this.chartData3Final.rows[i]["정확도(%)"])) {
                  this.chartData3Final.rows[i]["정확도(%)"] = 0;
                }
                break;
            }
          }
          //   this.$EventBus.$emit('loading-remove', 'fetch-analdata');
        })
        .catch(error => {
          //   this.$EventBus.$emit('loading-remove', 'fetch-analdata');
          console.log(error);
        });
    },

    resetTabSelection() { //탬 재설정
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

    next() { //다음달 분석자료 가져오기 함수
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
      console.log(oldVal);
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
.grid {
  text-align: left;
}
.key {
  padding-right: 50px;
  padding-left: 30px;
  align-self: left;
}
.keyValue {
  text-align: right;
  padding-left: 30px;
}

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
.tg .tg-vox4 {
  font-weight: bold;
  font-size: 16px;
  text-align: center;
  vertical-align: middle;
  background-color: #e8e8e8;
  width: 75px;
}
.tg .tg-5l8j {
  background-color: #f9f9f9;
  font-size: 16px;
  text-align: right;
  vertical-align: middle;
  width: 90px;
  padding-right: 20px;
}
</style>

