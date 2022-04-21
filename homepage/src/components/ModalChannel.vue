<template>
    <modal id="modal-select-channel" @close="$emit('close')">
        <h3 slot="header">동전쌓기 서버 선택</h3>

        <div slot="body" class="select-channel-container">
            <ul class="channel-list">
                <li class="channel-listitem" v-for="(channel, index) in channels" :key="channel.id">
                    <div>
                        동전쌓기 서버
                        <span class="channel-number">{{ channel.channel_name }}</span>
                    </div>
                    <div
                        class="channel-stats"
                        :class="{ idle : status(channel) === '원활', busy : status(channel) === '혼잡', blocked : status(channel) === '불가' }"
                    >{{ status(channel) }}</div>
                    <a
                        class="channel-enter"
                        :class="{ gray : channel.current_count === channel.max_count }"
                        title="입장"
                        @click.prevent="enterChannel(channel)"
                    >입장</a>
                </li>
            </ul>
        </div>

        <div slot="footer" class="channel-pagination">
            <pagination :current="page" :totalCount="totalChannelCount"/>
            <button @click="$emit('close')" class="button-rounded-gray">나가기</button>
        </div>
    </modal>
</template>

<script>
import Result from "../utils/result";

export default {
    name: "modal-channel",

    data() {
        return {
            channels: [],
            totalChannelCount: 0,
            isLoading: false,
            selectedChannel: null
        };
    },

    computed: {
        page() {
            return this.$route.params.page || 1;
        }
    },

    methods: {
        enterChannel(channel) { //채널에 입장하기
            // console.log("Selected channel: ", channel);
            if (channel.current_count >= channel.max_count) {
                alert("서버가 가득 차 입장할 수 없습니다.");
                return;
            }

            // console.log("Selected channel: ", channel);

            this.selectedChannel = channel;
            this.$root.playGame("piling-coins", channel.idx);
        },

        channelNumber(index) { //채널번호 얻기
            if (index < 10) {
                return `0${index}`;
            } else {
                return index;
            }
        },

        status(channel) { //채널 상태 얻기
            const ratio =
                channel.current_count <= 0
                    ? 0
                    : channel.current_count / channel.max_count;
            // console.log(channel.current_count)
            if (ratio < 0.6) {
                return "원활";
            } else if (ratio < 1) {
                return "혼잡";
            } else {
                return "불가";
            }
        },

        fetchChannels() { //채널 목록 가져오기
            if (this.isLoading) {
                alert("잠시만 기다려 주세요. 채널목록을 받아오는 중입니다.");
                return;
            }

            const args = {
                page: this.page,
                count: 4
            };

            this.isLoading = true;

            this.$axios
                .get(
                    this.$Api.channels +
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

                    this.isLoading = false;

                    if (!response || response.data.code !== Result.OK.code) {
                        return;
                    }

                    this.totalChannelCount = response.data.totalCount;
                    this.channels = response.data.items.sort(
                        (channel1, channel2) => {
                            return channel1.idx - channel2.idx;
                        }
                    );
                })
                .catch(error => {
                    console.log(error);
                    this.isLoading = false;
                });
        }
    },

    created() {
        this.fetchChannels();
    }
};
</script>