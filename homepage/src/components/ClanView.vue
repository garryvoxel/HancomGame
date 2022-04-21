<template>
	<div id="clan-view">
		<table class="tbs04 w_100p">
			<colgroup>
				<col width="150">
				<col width="*">
			</colgroup>
			<tr>
				<th class="first">클랜 이름</th>
				<td>{{ clan ? clan.name : '없음' }}</td>
			</tr>
			<tr>
				<th class="first">클랜 소개</th>
				<td>{{ clan ? clan.description : '없음' }}</td>
			</tr>
			<tr>
				<th class="first">클랜장</th>
				<td>{{ clan ? clan.manager.nickname : '없음' }}</td>
			</tr>
			<tr>
				<th class="first">클랜원</th>
				<td>
					<div class="party">
						<ul>
							<li class="w_3z" v-for="member in clan ? clan.members : []" :key="member.id">
								<div>
									<div class="thum">
										<img src="/images/sub04_img01.png" alt>
									</div>
									<p class="nick">{{ member.nickname }}</p>
									<p class="lv">Lv. 준비중</p>
								</div>
							</li>
						</ul>
					</div>
				</td>
			</tr>
		</table>
		<div class="btn_zone">
			<button class="btn_blue" v-if="! myClan">가입</button>
			<button v-on:click.prevent="back" class="btn_gray ml_10">닫기</button>
		</div>
	</div>
</template>

<script>
export default {
	data() {
		return {
			clan: null,
			myClan: null
		}
	},

	methods: {
		loadClan() {
			this.$axios
				.get(this.$Api.clans + '/' + this.id, this.$root.bearerHeaders())
				.then(response => {
					console.log(response.data)

					if (! response || response.data.code != 1) {
						return
					}
					
					this.clan = response.data.clan
				})
		},

		loadMyClan() {
			this.$axios
				.get(this.$Api.myClan, this.$root.bearerHeaders())
				.then(response => {
					console.log(response.data)

					if (! response || response.data.code != 1) {
						return
					}
					
					this.myClan = response.data.clan
				})
		},

		back() {
			this.$router.go(-1)
		}
	},

	computed: {
		id() {
            return this.$route.params.id
        }
	},

	created() {
		this.loadClan()
		this.loadMyClan()
	}
}
</script>