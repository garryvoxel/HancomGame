<template>
  <div>
    <h4 class="pg_tit1">기본정보</h4>
    <ul class="my_box">
      <button
        @click="showModalAvatar = true"
        type="button"
        class="btn_photo"
        data-toggle="modal"
        data-target=".modal-xl"
      >
        <i class="ti-camera"></i>
      </button>
      <li class="my_th">
        <avatar-image :index="user.avatar || 0" />
      </li>
      <li class="my_nic" v-if="this.$root.user != null">
        게임 닉네임 :
        <span>{{this.$root.user.nickname}}</span>
      </li>
    </ul>
    <h4 class="pg_tit1 mt-5">한컴타자 추가정보</h4>
    <div class="mypage-school-info-content">
      <table class="tbs02 mt-2" style="width:100%;">
        <colgroup>
          <col width="20%" />
          <col width="*" />
        </colgroup>
        <tbody>
          <tr>
            <th class="tit">학교</th>
          </tr>
          <tr>
            <td>
              <div class="mypage-school-info-search">
                <input
                  type="text"
                  placeholder="학교를 등록해주세요."
                  :value="selectedSchool ? selectedSchool.schoolName : schoolName"
                  readonly
                  @click.prevent="showSchoolSearch"
                />&nbsp;&nbsp;
                <button
                  class="btn btn-dark btn-xs"
                  @click.prevent="showSchoolSearch"
                >학교검색</button>
              </div>
            </td>
            <!-- <td>
              <div v-if="user.mySchool === null">
                <div class="mypage-school-info-search">
                  <input
                    type="text"
                    placeholder="학교를 등록해주세요."
                    :value="selectedSchool ? selectedSchool.schoolName : ''"
                    readonly
                    @click.prevent="showSchoolSearch"
                  />&nbsp;&nbsp;
                  <button
                    class="btn btn-dark btn-xs"
                    @click.prevent="showSchoolSearch"
                  >학교검색</button>
                </div>
              </div>
              <div v-else>{{ schoolName }}</div>
            </td>-->
          </tr>
          <tr>
            <th class="tit">주소</th>
          </tr>
          <tr>
            <td>
              <div v-if="schoolName">{{ schoolAddress }}</div>
              <div v-else>학교를 등록해주세요.</div>
            </td>
          </tr>
          <tr>
            <th class="tit">학년/반</th>
          </tr>
          <tr>
            <td>
              <select v-model="schoolYear">
                <option value="0">선택</option>
                <option v-for="year in this.maxYear" :value="year">{{ year }}</option>
              </select>
              <span>&nbsp;&nbsp;학년&nbsp;&nbsp;</span>
              <input class="dsetinput" type="text" v-model="schoolClassRoom" maxlength="10" />
              <span>&nbsp;&nbsp;반</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <!-- <div class="mypage-school-msg">
      <h5>
        <i class="fa fa-bullhorn"></i> 온라인 대동제 안내 (5/22 ~ 6/2)
      </h5>
      <ul>
        <li>
          이벤트 참여는
          <strong>'대학교'</strong> 로 학교정보를 등록하셔야 합니다.
        </li>
        <li>
          이벤트 기간 중 학교정보 등록은
          <strong>최초 1회</strong>만 가능합니다.
        </li>
      </ul>
    </div>-->
    <div class="text-center mt-3">
      <button type="button" class="btn btn-danger pull-center" @click="update">기본정보 저장</button>
    </div>
    <modal id="modal-change-avatar" v-if="showModalAvatar" @close="showModalAvatar = false">
      <h3 slot="header">캐릭터 선택</h3>

      <div slot="body">
        <!-- <div v-for=" n in 6" class="avatar-listitem" 
                        :class="{ selected : selectedAvatar === (n - 1) }"
                        @click.prevent="selectAvatar(n - 1)"
                    >
                        
                      
                            <div class="avatar-border">
                                <div class="avatar-wrapper">
                                    <avatar-image :index="n - 1"/>
                                </div>
                            </div>
                        
                          
                            <div class="avatar-name">{{ avatarName(n - 1) }}</div>
        </div>-->
        <tbody class="avatar-list">
          <tr class="first-avatar-items">
            <td class="avatar-listitem" @click.prevent="selectAvatar(0)">
              <div class="avatar-border">
                <div class="avatar-wrapper">
                  <avatar-image :index="0" />
                </div>
                <div class="avatar-name">{{ avatarName(0) }}</div>
              </div>
            </td>
            <td class="avatar-listitem" @click.prevent="selectAvatar(1)">
              <div class="avatar-border">
                <div class="avatar-wrapper">
                  <avatar-image :index="1" />
                </div>
                <div class="avatar-name">{{ avatarName(1) }}</div>
              </div>
            </td>
            <td class="avatar-listitem" @click.prevent="selectAvatar(2)">
              <div class="avatar-border">
                <div class="avatar-wrapper">
                  <avatar-image :index="2" />
                </div>
                <div class="avatar-name">{{ avatarName(2) }}</div>
              </div>
            </td>
          </tr>

          <tr class="first-avatar-items">
            <td class="avatar-listitem" @click.prevent="selectAvatar(3)">
              <div class="avatar-border">
                <div class="avatar-wrapper">
                  <avatar-image :index="3" />
                </div>
                <div class="avatar-name">{{ avatarName(3) }}</div>
              </div>
            </td>
            <td class="avatar-listitem" @click.prevent="selectAvatar(4)">
              <div class="avatar-border">
                <div class="avatar-wrapper">
                  <avatar-image :index="4" />
                </div>
                <div class="avatar-name">{{ avatarName(4) }}</div>
              </div>
            </td>
            <td class="avatar-listitem" @click.prevent="selectAvatar(5)">
              <div class="avatar-border">
                <div class="avatar-wrapper">
                  <avatar-image :index="5" />
                </div>
                <div class="avatar-name">{{ avatarName(5) }}</div>
              </div>
            </td>
          </tr>
        </tbody>
      </div>
      <div slot="footer" class="button-container">
        <button class="button-rounded-red" @click="confirmAvatar">확인</button>
        <button class="button-rounded-gray" @click="cancelAvatar">취소</button>
      </div>
    </modal>
    <modalSearch id="modal-search-school" v-if="showSearchSchool" @close="showSearchSchool = false">
      <h3 slot="header">학교 검색</h3>

      <div slot="body">
        <div class="search-bar">
          <div>
            <select v-model="schoolType" class="select-school-type">
              <option value="elem_list">초등학교</option>
              <option value="midd_list">중학교</option>
              <option value="high_list">고등학교</option>
              <option value="univ_list">대학교</option>
              <option value="seet_list">특수/기타학교</option>
              <option value="alte_list">대안학교</option>
            </select>
          </div>
          <div>
            <input type="text" class="input-keyword" v-model="keyword" placeholder="학교 이름으로 검색" />
            <button type="button" class="find-button" @click="submitSearch"></button>
          </div>
        </div>

        <div class="guide" v-if="isSearched && ! schools.length">검색된 학교가 없습니다.</div>

        <ul class="school-list" v-if=" schools.length">
          <li class="school-listitem" v-for="school in schools" :key="school.id">
            <div class="school-info">
              <h4>{{ school.schoolName }}</h4>
              <div class="school-address">{{ school.adres }}</div>
            </div>
            <button class="button-rounded-blue" @click="selectSchool(school)">선택</button>
          </li>
        </ul>
        <pagination
          class="school-pagination"
          :prevent="true"
          :current="schoolPage"
          :totalCount="totalSchoolCount"
          count="20"
          @prev="prevSchools"
          @next="nextSchools"
          @page="moveToSchools"
          v-if="schools.length && totalSchoolCount"
        />
      </div>

      <div slot="footer">
        <button class="button-rounded-gray" @click="closeModal">닫기</button>
      </div>
    </modalSearch>
  </div>
</template>

<script>
import Result from "@/utils/result";
import { constants } from "crypto";

export default {
  data() {
    return {
      nickname: "",
      user: {},
      showModalAvatar: false,
      selectedAvatar: 0,
      schoolYear: 0,
      schoolClassRoom: "",
      isSaving: false,
      showSearchSchool: false,
      schoolType: "elem_list",
      isSearching: false,
      isSearched: false,
      keyword: "",
      schools: [],
      selectedSchool: null,
      totalSchoolCount: 0,
      schoolPage: 1,
      schoolName: "",
      schoolAddress: "",
      loginCheck: false,
      searchNullSchool: [],
      maxYear: 6
    };
  },

  methods: {
    closeModal() {
      this.showSearchSchool = false;
    },
    OnPhoto() {
      alert("사진선택기능");
    },
    avatarName(index) {
      switch (index) {
        case 1:
          return "지지";
          console.log("지지");
        case 2:
          return "모아";
          console.log("모아");
        case 3:
          return "마망";
          console.log("마망");
        case 4:
          return "육비";
          console.log("육비");
        case 5:
          return "야야";
          console.log("야야");

        case 0:
        default:
          return "아모개";
          console.log("아모개");
      }
    },
    selectAvatar(index) {
      this.selectedAvatar = index;
    },
    confirmAvatar() {
      localStorage.setItem("isSelected", "Y");
      this.user.avatar = this.selectedAvatar;
      this.showModalAvatar = false;
    },
    cancelAvatar() {
      this.selectedAvatar = this.user.avatar;
      this.showModalAvatar = false;
    },
    findschool() {
      alert("준비중 입니다.");
    },
    selectSchool(school) {
      this.selectedSchool = school;
      this.schoolName = school.schoolName;
      this.schoolAddress = school.adres;
      this.showSearchSchool = false;
      this.schoolYear = 1;
      localStorage.setItem("isSelected", "Y");
      switch (this.schoolType) {
        case "elem_list":
          this.maxYear = 6;
          break;
        case "midd_list":
          this.maxYear = 3;
          break;
        case "high_list":
          this.maxYear = 3;
          break;
        case "univ_list":
          this.maxYear = 4;
          break;
        default:
          this.maxYear = 6;
          break;
      }
    },
    showSchoolSearch() {
      this.isSearched = false;
      this.showSearchSchool = true;
    },
    prevSchools() {
      this.schoolPage--;
      if (this.schoolPage <= 0) {
        alert("첫번째 페이지 입니다.");
        this.schoolPage = 1;
        return;
      }
      this.searchSchool();
    },

    prevSchools10() {
      this.schoolPage -= 10;
      if (this.schoolPage <= 0) {
        alert("첫번째 페이지 입니다.");
        this.schoolPage = 1;
        return;
      }
      this.searchSchool();
    },

    nextSchools() {
      this.schoolPage++;
      console.log(this.schoolPage);
      if (this.schoolPage > this.totalSchoolCount / 20 + 1) {
        alert("마지막 페이지 입니다.");
        this.schoolPage = this.totalSchoolCount / 20 + 1;
        return;
      }
      this.searchSchool();
    },

    nextSchools10() {
      this.schoolPage += 10;
      console.log(this.schoolPage);
      if (this.schoolPage > totalSchoolCount / 20 + 1) {
        alert("마지막 페이지 입니다.");
        this.schoolPage = totalSchoolCount / 20 + 1;
        return;
      }
      this.searchSchool();
    },

    moveToSchools(page) {
      this.schoolPage = page;
      this.searchSchool();
    },

    submitSearch() {
      this.schoolPage = 1;
      this.searchSchool();
    },

    searchSchool() {
      console.log("search");
      if (!this.keyword) {
        alert("검색어를 입력해주세요.");
        return;
      }

      if (this.isSearching) {
        return;
      }

      const args = {
        keyword: this.keyword,
        school_type: this.schoolType,
        page: this.schoolPage
      };

      this.$axios
        .get(
          this.$Api.schools +
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

          this.isSearching = false;

          if (!response || response.data.code !== Result.OK.code) {
            return;
          }

          this.schools = [];
          this.totalSchoolCount = response.data.totalCount;

          for (var i = 0; i < response.data.items.length; i++) {
            if (response.data.items[i].region !== "해외거주") {
              this.schools.push(response.data.items[i]);
              this.totalSchoolCount = response.data.totalCount;
            }
          }

          // this.schools = response.data.items;

          this.isSearched = true;
        })
        .catch(error => {
          console.log(error);

          this.isSearching = false;
        });
    },
    fetchUser() {
      this.$axios
        .get(this.$Api.me, this.$root.bearerHeaders())
        .then(response => {
          console.log(response.data);

          if (response.data.code === 103) {
            this.loginCheck = false;
          }

          if (!response || response.data.code !== Result.OK.code) {
            return;
          }
          this.loginCheck = true;
          this.user = response.data.user;
          this.selectedAvatar = this.user.avatar;

          if (this.user.mySchool) {
            if (this.user.mySchool.school) {
              this.schoolName = this.user.mySchool.school.name;
              this.schoolAddress = this.user.mySchool.school.address;
            }

            this.schoolYear = this.user.mySchool.year || 0;

            this.schoolClassRoom = this.user.mySchool.classroom;
          }
          if (this.schoolName.indexOf("초등") != -1) {
            this.maxYear = 6;
          } else if (this.schoolName.indexOf("중학") != -1) {
            this.maxYear = 3;
          } else if (this.schoolName.indexOf("고등") != -1) {
            this.maxYear = 3;
          } else if (this.schoolName.indexOf("대학") != -1) {
            this.maxYear = 4;
          } else {
            this.maxYear = 6;
          }
        })
        .catch(error => {
          console.log(error);
        });
    },

    update() {
      if (this.isSaving) {
        return;
      }

      const args = {
        avatar: this.user.avatar,
        school_region: this.selectedSchool
          ? this.selectedSchool.region
          : this.user.mySchool
          ? this.user.mySchool.school.region
          : null,
        school_name: this.selectedSchool
          ? this.selectedSchool.schoolName
          : this.user.mySchool
          ? this.user.mySchool.school.name
          : null,
        school_address: this.selectedSchool
          ? this.selectedSchool.adres
          : this.user.mySchool
          ? this.user.mySchool.school.address
          : null,
        school_website: this.selectedSchool
          ? this.selectedSchool.link
          : this.user.mySchool
          ? this.user.mySchool.school.website
          : null,
        school_year: this.schoolYear,
        school_classroom: this.schoolClassRoom
      };

      this.isSaving = true;

      this.$axios
        .post(this.$Api.updateMe, args, this.$root.bearerHeaders())
        .then(response => {
          console.log(response.data);
          console.log(this.$Api.updateMe);
          console.log(args);
          console.log(this.$root.bearerHeaders());
          this.isSaving = false;

          if (!response || response.data.code !== Result.OK.code) {
            return;
          }

          alert("저장되었습니다.");
          localStorage.setItem("isSelected", "N");
          console.log(localStorage.getItem("isSelected"));
          this.$router.go();
        })
        .catch(error => {
          console.log(error);
          this.isSaving = false;
        });
    },
    Log() {
      this.$axios
        .put(
          this.$Api.logs,
          { menu_type: 19, Authorization: "Bearer" + this.$root.sessionId() },
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
    }
  },
  watch: {
    $route() {
      if (this.showSearchSchool === true) {
        console.log("enter");
      }
    }
  },

  created() {
    if (this.$root.isLoggedIn()) {
      this.fetchUser();
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
<style scoped>
input[type="text"],
#mypage select,
>>> button {
  -moz-appearance: none;
  -webkit-appearance: none;
  box-sizing: border-box;
  height: 2.5rem;
  border-radius: 0.25rem;
  box-shadow: none;
  border: 1px solid #e5e5e5;
  padding: 0 0.5rem;
}
.tbs02 td {
  height: calc(2.5rem + 16px);
  word-break: keep-all;
}
.mypage-school-info-search {
  display: flex;
}
.mypage-school-info-search input[type="text"] {
  flex-grow: 1;
  text-align: center;
  width: 1%;
}
.mypage-school-info-search button {
  box-sizing: border-box;
  height: 2.5rem;
}
.select-school-type {
}
#modal-search-school >>> .search-bar {
  display: block;
  padding: 0;
}
#modal-search-school >>> .search-bar > div {
  display: flex;
}
#modal-search-school >>> .search-bar > div + div {
  margin-top: 0.25rem;
}
#modal-search-school >>> .select-school-type {
  width: 100%;
}
#modal-search-school >>> .input-keyword {
  height: 2.5rem;
  width: 1%;
  padding: 0 0.5rem;
  line-height: 2.5;
}
#modal-search-school >>> .find-button {
  box-sizing: border-box;
  margin-left: 0.2rem;
  width: 2.5rem;
  height: 2.5em;
  border: 1px solid #adadad;
}
#modal-search-school >>> .modal-footer {
  justify-content: center;
  padding: 1rem 0;
}
#modal-search-school >>> button {
  line-height: 1;
  border-radius: 0.25rem;
  border: 1px solid #adadad;
}
#modal-search-school >>> .modal-close {
  display: none;
}
#modal-search-school >>> .modal-header {
  padding: 0.5rem 0 0.25rem;
}
#modal-search-school >>> .modal-header h3 {
  margin: 0;
  font-size: 1.5rem;
}
#modal-search-school >>> .school-list {
  max-height: calc(100vh - 450px);
}
#modal-search-school >>> .school-list .school-listitem {
  padding: 1rem 0;
}
#modal-search-school >>> .school-list .school-listitem h4 {
  margin: 0;
  text-align: left;
}
#modal-search-school >>> .school-list .school-listitem .school-address {
  text-align: left;
  word-break: keep-all;
  color: #797676;
}
#modal-search-school >>> .school-list .school-listitem button {
  flex: 0 0 auto;
  width: 4rem;
  height: 2rem;
  border: 1px solid #2653b0;
  margin-left: 0.25rem;
}
</style>
<style scoped>
.mypage-school-msg {
  margin-top: 10px;
  font-size: 13px;
  color: #f75259;
  line-height: 1.3;
  word-break: keep-all;
}
.mypage-school-msg h5 {
  position: relative;
  display: table;
  margin: 0 0 0.6em 0;
  font-size: 1.1em;
  font-weight: 700;
  padding-left: 1.3em;
  color: currentColor;
}
.mypage-school-msg h5 .fa {
  position: absolute;
  left: 0;
  top: 0.1em;
}
.mypage-school-msg ul {
  list-style: none;
  margin: 0 0 0 0.5em;
  padding: 0;
}
.mypage-school-msg li {
  position: relative;
  margin: 0;
  padding-left: 0.7em;
}
.mypage-school-msg li:before {
  content: "-";
  position: absolute;
  left: 0;
}
.mypage-school-msg li + li {
  margin-top: 0.4em;
}
.mypage-school-msg strong {
  position: relative;
  white-space: nowrap;
}
.mypage-school-msg strong:after {
  content: "";
  position: absolute;
  bottom: -1px;
  left: -1px;
  right: -1px;
  border: 3px solid rgba(255, 169, 0, 0.3);
}
.mypage-school-msg span {
  white-space: nowrap;
}
</style>
