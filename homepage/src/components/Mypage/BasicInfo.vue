<template>
    <div id="basic-info">
        <div class="mypage-info-container">
            <div class="mypage-basic-info">
                <div class="mypage-basic-info-header">
                    <h4>기본정보</h4>
                    <span>나의 기본정보를 표시합니다.</span>
                </div>
                <div class="mypage-basic-info-content">
                    <div class="left">
                        <div class="mypage-basic-info-avatar-wrapper">
                            <avatar-image :index="user.avatar || 0"/>
                        </div>
                        <button
                            @click="showModalAvatar = true"
                            class="mypage-basic-info-button-chage"
                        >프로필 이미지 변경</button>
                    </div>
                    <div class="right">
                        <h4>게임 닉네임 :</h4>
                        <span>{{ user.nickname || '설정필요' }}</span>
                    </div>
                </div>
            </div>
            <div class="mypage-school-info">
                <div class="mypage-basic-info-header">
                    <h4>학교정보</h4>
                    <span>나의 학교정보를 표시합니다.</span>
                </div>
                <div class="mypage-school-info-content">
                    <table>
                        <tr>
                            <th>학교</th>
                            <td>
                                <div class="mypage-school-info-search">
                                    <input
                                    type="text"
                                    placeholder="학교를 등록해주세요."
                                    :value="selectedSchool ? selectedSchool.schoolName : schoolName"
                                    readonly onfocus="this.blur();"
                                    @click.prevent="showSchoolSearch"
                                    >
                                    <button class="find-button" @click.prevent="showSchoolSearch" />
                                </div>
                            </td>
                            <!-- <td>
                                <div v-if="user.mySchool === null">
                                    <div class="mypage-school-info-search">
                                        <input
                                            type="text"
                                            placeholder="학교를 등록해주세요."
                                            :value="selectedSchool ? selectedSchool.schoolName : ''"
                                            readonly onfocus="this.blur();"
                                            @click.prevent="showSchoolSearch"
                                        >
                                        <button class="find-button" @click.prevent="showSchoolSearch" />
                                    </div>
                                </div>
                                <div v-else>
                                    {{ schoolName }}
                                </div>
                            </td> -->
                        </tr>
                        <tr>
                            <th>주소</th>
                            <td>
                                <div  v-if="schoolName">
                                    {{ schoolAddress }}
                                </div>
                                <div v-else>
                                    학교를 등록해주세요.
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <th>학년 / 반</th>
                            <td>
                                <div class="class-year-selector">
                                    <div class="school-year-selector">
                                        <select v-model="schoolYear">
                                            <option value="0">선택</option>
                                            <option v-bind:key="year" v-for="year in this.maxYear" :value="year">{{ year }}</option>
                                        </select>
                                    </div>
                                    <span>학년</span>
                                    <div class="school-class-selector">
                                        <input type="text" v-model="schoolClassRoom" maxlength="10">
                                    </div>
                                    <span>반</span>
                                </div>
                            </td>
                        </tr>
                    </table>
                </div>
                <!-- <div class="mypage-school-msg">
                    <h5><i class="fa fa-bullhorn"></i> 온라인 대동제 안내 (5/22 ~ 6/2)</h5>
                    <ul>
                        <li>이벤트 참여는 <strong>'대학교'</strong> 로 학교정보를 등록하셔야 합니다.</li>
                        <li>이벤트 기간 중 학교정보 등록은 <strong>최초 1회</strong>만 가능합니다.</li>
                    </ul>
                </div> -->
            </div>
        </div>
        <div class="mypage-basic-info-button">
            <button @click="update" class="button-rounded-red">기본정보 저장</button>
        </div>

        <modal id="modal-change-avatar" v-if="showModalAvatar" @close="showModalAvatar = false">
            <h3 slot="header">캐릭터 선택</h3>

            <div slot="body">
                <ul class="avatar-list">
                    <li
                        v-for="n in 6" v-bind:key="n"
                        class="avatar-listitem"
                        :class="{ selected : selectedAvatar === (n - 1) }"
                        @click.prevent="selectAvatar(n - 1)"
                    >
                        <div class="avatar-border">
                            <div class="avatar-wrapper">
                                <avatar-image :index="n - 1"/>
                            </div>
                        </div>
                        <div class="avatar-name">{{ avatarName(n - 1) }}</div>
                    </li>
                </ul>
            </div>

            <div slot="footer" class="button-container">
                <button class="button-rounded-red" @click="confirmAvatar">확인</button>
                <button class="button-rounded-gray" @click="cancelAvatar">취소</button>
            </div>
        </modal>

        <modal id="modal-search-school" v-if="showSearchSchool" @close="showSearchSchool = false">
            <h3 slot="header">학교 검색</h3>

            <div slot="body">
                <form class="search-bar" @submit.prevent="submitSearch">
                    <div class="select-school-type">
                        <select v-model="schoolType">
                            <option value="elem_list">초등학교</option>
                            <option value="midd_list">중학교</option>
                            <option value="high_list">고등학교</option>
                            <option value="univ_list">대학교</option>
                            <option value="seet_list">특수/기타학교</option>
                            <option value="alte_list">대안학교</option>
                        </select>
                    </div>
                    <input
                        type="text"
                        class="input-keyword"
                        v-model="keyword"
                        placeholder="학교 이름으로 검색"
                    >
                    <button class="find-button"/>
                </form>

                <div class="guide" v-if="isSearched && ! schools.length">검색된 학교가 없습니다.</div>

                <ul class="school-list" v-if="schools.length">
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
                    v-if="schools.length&&totalSchoolCount"
                />
            </div>

            <div slot="footer">
                <button class="button-rounded-gray" @click="showSearchSchool = false">닫기</button>
            </div>
        </modal>
    </div>
</template>

<script>
import Result from "../../utils/result";
import { finished } from 'stream';

export default {
    data() { //변수 초기화
        return {
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
            totalSchoolCount: null,
            schoolPage: 1,
            schoolName: "",
            schoolAddress: "",
            maxYear:6,
        };
    },

    methods: {
        showSchoolSearch() {
            this.schools = [];
            this.keyword = "";
            this.isSearched = false;
            this.showSearchSchool = true;
        },

        selectSchool(school) { //학교선택
            this.selectedSchool = school;
            this.schoolName = school.schoolName;
            this.schoolAddress = school.adres;
            this.showSearchSchool = false;
            localStorage.setItem("isSelected", 'Y');

            switch(this.schoolType)
            {
                case 'elem_list':
                    this.maxYear = 6;
                    break;
                case 'midd_list':
                    this.maxYear = 3;
                    break;
                case 'high_list':
                    this.maxYear = 3;
                    break;
                case 'univ_list':
                    this.maxYear =4;
                    break;
                default:
                    this.maxYear =6;
                    break;
            }
          
        },

        submitSearch() { //학교검색하기
            this.schoolPage = 1;
            this.searchSchool();

        },

        prevSchools() { //이전 페이지 보기
            this.schoolPage--;
            if(this.schoolPage <= 0){
                alert("첫번째 페이지 입니다.");
                this.schoolPage = 1;
                return;
            }
            this.searchSchool();
        },

        prevSchools10() { //이용하지 않음
            this.schoolPage-=10;
            if(this.schoolPage <= 0){
                alert("첫번째 페이지 입니다.");
                this.schoolPage = 1;
                return;
            }
            this.searchSchool();
        },

        nextSchools() { //다음 페이지 보기
            this.schoolPage++;
            console.log(this.schoolPage);
            if(this.schoolPage > this.totalSchoolCount/20+1){
                alert("마지막 페이지 입니다.");
                this.schoolPage = parseInt(this.totalSchoolCount/20+1);
                return;
            }
            this.searchSchool();
        },

        nextSchools10() {
            this.schoolPage+=10;
            console.log(this.schoolPage);
            if(this.schoolPage > totalSchoolCount/20+1){
                alert("마지막 페이지 입니다.");
                this.schoolPage = totalSchoolCount/20+1;
                return;
            }
            this.searchSchool();
        },

        moveToSchools(page) { //선택한 페이지로 보기
            this.schoolPage = page;
            this.searchSchool();
        },

        searchSchool() { //학교 검색하기
            
            if (!this.keyword) {
                alert("검색어를 입력해주세요.");
                return;
            }

            if (this.isSearching) {
                return;
            }
            this.$EventBus.$emit("loading-add", "searchSchool");
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
                                return (
                                    key + "=" + encodeURIComponent(args[key])
                                );
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
                    // console.log(this.totalSchoolCount);
                    for(var i =0; i <response.data.items.length; i++)
                    {
                        if(response.data.items[i].region !=='해외거주')
                        {
                            this.schools.push(response.data.items[i]);
                            this.totalSchoolCount = response.data.totalCount;

                        }
                    }
                    console.log(this.schools);
                    this.isSearched = true;
                    this.$EventBus.$emit("loading-remove", "searchSchool");
                })
                .catch(error => {
                    console.log(error);

                    this.isSearching = false;
                    this.$EventBus.$emit("loading-remove", "searchSchool");
                });
        },

        selectAvatar(index) { //캐릭터 선택
            this.selectedAvatar = index;
            
        },

        confirmAvatar() { //캐릭터 확인하기
            this.user.avatar = this.selectedAvatar;
            this.showModalAvatar = false;
            localStorage.setItem("isSelected", 'Y');
            console.log(localStorage.getItem("isSelected"))
        },

        cancelAvatar() { //캐릭터 취소
            this.selectedAvatar = this.user.avatar;
            this.showModalAvatar = false;
        },

        select() { //캐릭터 선택
            this.user.avatar = this.selectedAvatar;
        },

        avatarName(index) { //캐릭터 이름 가져오기
            switch (index) {
                case 1:
                    return "지지";
                case 2:
                    return "모아";
                case 3:
                    return "마망";
                case 4:
                    return "육비";
                case 5:
                    return "야야";

                case 0:
                default:
                    return "아모개";
            }
        },

        fetchUser() { //유저 불러오기
            this.$axios
                .get(this.$Api.me + '?token='+localStorage.getItem('uid'), this.$root.bearerHeaders())
                .then(response => {
                    if (!response || response.data.code !== Result.OK.code) {
                        return;
                    }
                   
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

                    if(this.schoolName.indexOf('초등') != -1){
                        this.maxYear = 6;
                    }else if(this.schoolName.indexOf('중학') != -1){
                        this.maxYear = 3;
                    }else if(this.schoolName.indexOf('고등') != -1){
                        this.maxYear = 3;
                    }else if(this.schoolName.indexOf('대학') != -1){
                        this.maxYear = 4;
                    }else{
                        this.maxYear =6;
                    }
                })
                .catch(error => {
                    console.log(error);
                });
        },

        update() { //변경한 자료 보관하기
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

                    this.isSaving = false;

                    if (!response || response.data.code !== Result.OK.code) {
                        return;
                    }

                    alert("저장되었습니다.");
                    localStorage.setItem("isSelected", 'N'); 
                    this.$router.go();
                })
                .catch(error => {
                    console.log(error);
                    this.isSaving = false;
                });
        }
    },

    created() { //페이지 초기 로딩
        this.fetchUser();
        this.$root.sendLog(19);
    },
};
</script>
<style scoped>
    .mypage-school-msg {
        margin-top: 10px;
        font-size: 13px;
        color: #f75259;
        line-height: 1.3;
    }
    .mypage-school-msg h5 {
        position: relative;
        display: table;
        margin: 0 0 0.6em 0;
        font-size: 1.1em;
        font-weight: 700;
        padding-left: 1.5em;
        color:currentColor;
    }
    .mypage-school-msg h5 .fa {
        position: absolute;
        left: 0;
        top: 0.2em;
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
        content:'-';
        position: absolute;
        left: 0;
    }
    .mypage-school-msg li+li {
        margin-top: 0.4em;
    }
    .mypage-school-msg strong {
        position: relative;
    }
    .mypage-school-msg strong:after {
        content: '';
        position: absolute;
        bottom: -1px;
        left: -1px;
        right: -1px;
        border: 3px solid rgba(255, 169, 0, .3);
    }
</style>
