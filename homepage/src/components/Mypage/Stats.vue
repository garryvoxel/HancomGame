<template>
  <div id="stats">
    <div class="mypage-stats-summary">
      <h3>한컴타자 통계</h3>
      <div class="mypage-stats-summary-container">
        <div class="mypage-stats-summary-avatar-area">
          <div class="mypage-stats-summary-avatar-wrapper">
            <avatar-image :index="user.avatar" />
          </div>
        </div>

        <ul class="mypage-stats-summary-list">
          <li>
            닉네임 :
            <span class="value">{{ user.nickname || '없음' }}</span>
            <!-- <span class="badge">3등급(타자왕)</span> -->
          </li>
          <li v-if="false">
            평균타수 :
            <span class="value">- 타/분</span>
          </li>
          <li>
            목표타수 :
            <span class="value">{{ user.target_typing_speed || 0 }} 타/분</span>
          </li>
          <li v-if="false">
            정확도 :
            <span class="value">- %</span>
          </li>
          <li>
            목표 정확도 :
            <span class="value">{{ user.target_typing_accuracy || 0 }}%</span>
          </li>
        </ul>

        <div class="mypage-stats-summary-score-area">
          <div class="mypage-stats-summary-score" v-if="false">
            0
            <span class="unit">점</span>
          </div>
          <button
            class="mypage-stats-summary-typing-setting"
            @click="showModalSetTarget = true"
          >타자연습 설정</button>
        </div>
      </div>
    </div>

    <nav class="tab-rounded">
      <ul>
        <li :class="{ selected : currentTab === 'stats' }">
          <router-link to="/mypage/stats" title="타자속도">
            <a>타자 속도</a>
          </router-link>
        </li>
        <li :class="{ selected : currentTab === 'typing-total' }">
          <router-link to="/mypage/stats/typing-total" title="글쇠별타수">
            <a>글쇠별 타수</a>
          </router-link>
        </li>
        <li :class="{ selected : currentTab === 'typing-acc' }">
          <router-link to="/mypage/stats/typing-acc" title="글쇠별정확도">
            <a>글쇠별 정확도</a>
          </router-link>
        </li>
        <li :class="{ selected : currentTab === 'typing-velocity' }">
          <router-link to="/mypage/stats/typing-velocity" title="글쇠별속도">
            <a>글쇠별 속도</a>
          </router-link>
        </li>
        <li :class="{ selected : currentTab === 'finger-speed' }">
          <router-link to="/mypage/stats/finger-speed" title="손가락빠르기">
            <a>손가락 빠르기</a>
          </router-link>
        </li>
      </ul>
    </nav>

    <div class="mypage-stats-graph">
      <Gragh v-if="currentTab === 'stats'" />
      <GraghSpeedFinger v-if="currentTab === 'finger-speed'" />
      <GraghVelocity v-if="currentTab === 'typing-velocity'" />
      <GraghAcc v-if="currentTab === 'typing-acc'" />
      <GraghTotal v-if="currentTab === 'typing-total'" />
    </div>
    <modal id="modal-set-target" v-if="showModalSetTarget" @close="showModalSetTarget = false">
      <h3 slot="header">타자연습 설정</h3>

      <div slot="body" class="set-target-container">
        <table class="set-target-table">
          <tbody>
            <tr>
              <td rowspan="5" class="avatar-area">
                <div class="avatar-wrapper">
                  <avatar-image :index="user.avatar" />
                </div>
              </td>
              <th>닉네임</th>
              <td class="value">{{ user.nickname || '없음' }}</td>
            </tr>
            <tr>
              <th>목표 타수 (타/분)</th>
              <td class="controller">
                <div class="controller-row">
                  <button class="decrement" @click="decrementTypingSpeed"></button>
                  <input type="text" v-model="targetTypingSpeed" />
                  <button class="increment" @click="incrementTypingSpeed"></button>
                </div>
              </td>
            </tr>
            <tr>
              <th>목표 정확도 (%)</th>
              <td class="controller">
                <div class="controller-row">
                  <button class="decrement" @click="decrementTypingAccuracy"></button>
                  <input type="text" v-model="targetTypingAccuracy" />
                  <button class="increment" @click="incrementTypingAccuracy"></button>
                </div>
              </td>
            </tr>
            <!--<tr>
                            <th>글자판 선택</th>
                            <td class="controller">
                                <div class="select-wrapper">
                                    <select disabled>
                                        <option>한글</option>
                                        <option>영문</option>
                                    </select>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <th>글자판 종류</th>
                            <td class="controller">
                                <div class="select-wrapper">
                                    <select disabled>
                                        <option>두벌</option>
                                        <option>세벌</option>
                                    </select>
                                </div>
                            </td>
            </tr>-->
          </tbody>
        </table>
      </div>

      <div slot="footer" class="stats-modal-footer">
        <p class="stats-modal-alert">목표타수, 목표정확도 변경 후에는 반영 을 위해 타자연습을 재실행 해 주세요.</p>
        <div class="button-container">
          <button class="button-rounded-red" @click="save">저장</button>
          <button class="button-rounded-gray" @click="showModalSetTarget = false">취소</button>
        </div>
      </div>
    </modal>
  </div>
</template>

<script>
import Result from '../../utils/result';
import Gragh from '@/components/Mypage/Gragh.vue';
import GraghSpeedFinger from '@/components/Mypage/GraghSpeedFinger.vue';
import GraghVelocity from '@/components/Mypage/GraghVelocity.vue';
import GraghAcc from '@/components/Mypage/GraghAcc.vue';
import GraghTotal from '@/components/Mypage/GraghTotal.vue';

export default {
  name: 'State',
  components: {
    Gragh,
    GraghSpeedFinger,
    GraghVelocity,
    GraghAcc,
    GraghTotal,
  },

  data() {
    return {
      user: {},
      showModalSetTarget: false,
      targetTypingAccuracy: 0,
      targetTypingSpeed: 0,
      isSaving: false,
      currentTab: 'stats',
    };
  },

  watch: {
    $route(to, from) {
      this.changeTab();
    },
    targetTypingAccuracy(value) { //목표정확도 세팅
      if (!parseInt(value) || value < 0) {
        this.targetTypingAccuracy = 5;
        alert('목표정확도는 0이상 이어야 합니다.');
      } else if (value > 100) {
        this.targetTypingAccuracy = 100;
      }
    },

    targetTypingSpeed(value) { //목표타수 세팅
      if (!parseInt(value) || value < 0) {
        this.targetTypingSpeed = 50;
        alert('목표타수는 0이상 이어야 합니다.');
      } else if (value > 3000) {
        this.targetTypingSpeed = 3000;
        alert('최대 목표타수는 3000타 입니다.');
      }
    },
  },

  methods: {
    changeTab() {
      this.currentTab = this.$route.name;
    },
    incrementTypingSpeed() { //타이핑속도 높이기
      this.targetTypingSpeed = parseInt(this.targetTypingSpeed) + 50;
    },

    decrementTypingSpeed() { //타이핑속도 줄이기
      this.targetTypingSpeed = Math.max(0, this.targetTypingSpeed - 50);
    },

    incrementTypingAccuracy() { //타이핑정확도 높이기
      this.targetTypingAccuracy = parseInt(this.targetTypingAccuracy) + 5;
    },

    decrementTypingAccuracy() { //타이핑정확도 줄이기
      this.targetTypingAccuracy = Math.max(0, this.targetTypingAccuracy - 5);
    },

    save() {
      if (this.isSaving) {
        alert('저장중입니다.');
        return;
      }

      this.isSaving = true;

      this.$axios
        .post(
          this.$Api.updateMe,
          {
            avatar: this.user.avatar,
            target_typing_speed: this.targetTypingSpeed,
            target_typing_accuracy: this.targetTypingAccuracy,
          },
          this.$root.bearerHeaders(),
        )
        .then(response => {
          this.isSaving = false;

          if (!response || response.data.code !== Result.OK.code) {
            return;
          }
          this.showModalSetTarget = false;

          alert('저장되었습니다.');
          this.$router.go();
        })
        .catch(error => {
          this.isSaving = false;
        });
    },

    fetchUser() {
      this.$axios
        .get(this.$Api.me + '?token=' + localStorage.getItem('uid'), this.$root.bearerHeaders())
        .then(response => {
          if (!response || response.data.code !== Result.OK.code) {
            return;
          }

          this.user = response.data.user;
          this.targetTypingAccuracy = this.user.target_typing_accuracy;
          this.targetTypingSpeed = this.user.target_typing_speed;
        })
        .catch(error => {
          alert('데이터를 불러올수 없습니다.');
        });
    },
  },

  created() {
    this.changeTab();
    this.fetchUser();
    localStorage.setItem('isSelected', 'N');
    this.$root.sendLog(21);
  },
};
</script>