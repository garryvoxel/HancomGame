<template>
    <div id="clan-list">
        <ul class="nav-tabs">
            <li class="w_50p" :class="{ current : type !== 'my' }">
                <a v-on:click.prevent="switchToAllClans" class="clan-tab">전체 클랜</a>
            </li>

            <li class="w_50p" :class="{ current : type === 'my' }">
                <a v-on:click.prevent="switchToMyClan" class="clan-tab">내 클랜</a>
            </li>
        </ul>
        
        <table class="tbs02">
            <colgroup>
                <col width="*"/>
                <col width="180"/>
                <col width="100"/>
                <col width="120"/>
                <col width="120"/>
            </colgroup>
            <thead>
            <tr>
                <th class="first">클랜명</th>
                <th>클랜장</th>
                <th>인원수</th>
                <th>클랜정보</th>
                <th class="last">가입여부</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="clan in clans" :key="clan.id">
                <td class="first ta_l">
                    <router-link :to="'/community/clans/' + clan.id">
                        <p class="btit">{{ clan.name }}</p>
                        <p class="stit">{{ clan.description }}</p>
                    </router-link>
                </td>
                <td>{{ clan && clan.manager ? clan.manager.nickname : '없음' }}</td>
                <td>{{ clan && clan.manager ? clan.memberCount : '없음' }}</td>
                <td><router-link :to="'/community/clans/' + clan.id" class="btn_gray_round"><span>클랜정보</span></router-link></td>
                <td class="last">
                    <a v-if="! myClan" href="" class="btn_blue_round"><span>가입하기</span></a>
                    <a v-else-if="clan.id === myClan.id" class="btn_gray_round"><span>가입완료</span></a>
                    <a v-else class="btn_gray_round"><span>가입하기</span></a>
                </td>
            </tr>
            <tr v-if="clans.length === 0">
                <td colspan="5" class="clan-empty">등록된 클랜이 없습니다.</td>
            </tr>
            </tbody>
        </table>
        
        <router-link to="/community/clans/create" v-if="! myClan" class="make_cl"><span>클랜만들기</span></router-link>

        <pagination :current="page" :totalCount="totalCount" />
    </div>
</template>

<script>
export default {
    data() {
        return {
            myClan: null,
            clans: [],
            totalCount: 0,
            page: this.$route.query.page || 1,
            type: this.$route.query.type
        }
    },

    methods: {
        switchToAllClans() { //전체 클랜 보기방식으로 변경
            this.$router.push({ query: { type: 'all' } })
            this.type = 'all'
            this.loadClans()
        },

        switchToMyClan() { //내 클랜 보기방식으로 변경
            if (this.$root.isLoggedIn()) {
                this.$router.push({ query: { type: 'my' } })
                this.type = 'my'
                this.loadClans()
            } else {
                alert('로그인이 필요합니다.')
            }
        },

        loadClans() { //클랜 가져오기 함수
            let headers

            if (this.type === 'my') {
                headers = this.$root.bearerHeaders()
            }

			this.$axios
				.get(this.$Api.clansUri + '?page=' + this.page + (this.type ? '&type=' + this.type : ''), headers)
				.then(response => {
					console.log(response.data)

					if (! response || response.data.code != 1) {
						return
					}

					this.clans = response.data.items
					this.totalCount = response.data.totalCount
				})
				.catch(error => {
					console.log(error)
				})
		},
		
		loadMyClan() { //내 클랜 가져오기 함수
			this.$axios
				.get(this.$Api.clan, this.$root.bearerHeaders())
				.then(response => {
					console.log(response.data)

					if (!response || response.data.code != 1) {
						return
					}

					this.myClan = response.data.clan
				})
		}
    },

    created() {
		this.loadClans()
		this.loadMyClan()
    }
}
</script>

<style scoped>
.clan-empty {
    text-align: center;
}
</style>