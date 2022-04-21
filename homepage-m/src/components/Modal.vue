<template>
    <transition name="modal">
        <div class="modal-mask">
            <div class="modal-wrapper">
                <div class="modal-container" >

                    <div class="modal-body">
                        <slot name="body">
                            <ul class="channel-list">
                                <li class="channel-listitem" v-for="(channel, index) in channels" :key="channel.id">
                                    <div>동전쌓기 서버<span class="channel-number">{{channel.channel_name}}</span></div>
                                    <div class="channel-stats idle" :class="{ idle : status === '원활', busy : status === '혼잡', blocked : status === '불가' }">
                                        {{ status(channel.current_count, channel.max_count) }}
                                    </div>
                                    <a class="channel-enter" :class="{ gray : channel.current_count === channel.max_count }" title="입장" @click.prevent="enterChannel(index)">입장</a>
                                </li>
                            </ul>
                        </slot>
                        <pagination :current="page" :totalCount="totalChannelCount" class="paging1"/>
                    </div>

                    <div class="modal-footer">
                        <slot name="footer">
                            <div>
                                <button class="btn btn-danger btn-xs" @click="closeModal()">
                                    나가기
                                </button>
                            </div>
                        </slot>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
import Result from "../utils/result";

export default {
    data(){
        return{
            showModalSelectChannel: false,
            channels: [],
            totalChannelCount: 0,
            isLoading: false,
            selectedChannel: null
        }
    },

    computed: {
        page() {
            return this.$route.query.page || 1;
        }
    },
    
    methods: {
        enterChannel(index) {
            const channel = this.channels[index]
            console.log("channel : " + channel)
            if (channel.current_count >= channel.max_count) {
                alert('채널이 가득 차 입장할 수 없습니다.')
                return
            }

            console.log('Selected channel: ', channel)

            this.selectedChannel = channel
            this.showModalSelectChannel = false
            console.log("idx : "+channel.idx);

            this.$root.playGame('piling-coins',channel.idx);
        },

        channelNumber(index) {
            const no = index + 1

            if (no < 10) {
                return '0'.concat(no.toString())
            } else {
                return no
            }
        },

        status(current, max) {
            const ratio = current <= 0 ? 0 : current / max

            if (ratio < .6) {
                return '원활'
            } else if (ratio < 1) {
                return '혼잡'
            } else {
                return '불가'
            }
        },

        launch() {
            this.showModalSelectChannel = true;
            this.showSelectChannel()
        },

        closeModal(){
            this.isLoading = false;
            console.log(this.isLoading);
            this.$emit('close');
        },

        showSelectChannel() {
            if (this.isLoading) {
                alert('게임 실행 중입니다.')
                return;
            }

            this.isLoading = true;

            this.$axios
                .get(this.$Api.channels, this.$root.bearerHeaders())
                .then(response => {
                    console.log(response.data);

                    this.isLoading = false;

                    if (!response || response.data.code !== Result.OK.code) {
                        return;
                    }

                    this.showModalSelectChannel = true;

                    this.totalChannelCount = response.data.totalCount;
                    this.channels = response.data.items;
         
                })
                .catch(error => {
                    console.log(error);
                    this.isLoading = false;
                });
        }
    },

    beforeRouteEnter(to, from, next) {
        next(vm => {
            vm.$root.registerNicknameIfNotExist();
        });
    },

    created() {
        const self = this

        this.$EventBus.$on('onPostMessage', (event) => {
            console.log('Posted message:', event.data)

            if (event.data.message === 'getSelectedChannel') {
                const response = {
                    ...self.selectedChannel,
                    message: 'returnSelectedChannel'
                }

                console.log('Response: ', response)
                
                event.source.postMessage({
                    ...self.selectedChannel,
                    message: 'returnSelectedChannel'
                }, event.origin)
            }
        })
        this.showSelectChannel();
     

    },
}
</script>


<style>
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: table;
  transition: opacity 0.3s ease;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.modal-container {
  width: 90%;
  margin: 0px auto;
  padding: 5px 15px;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
  font-family: Helvetica, Arial, sans-serif;
}

.modal-header p{
  margin-top: 0;
  color: #42b983;
  text-align: center;
}

.modal-body {
  margin: 10px 0;
  text-align: center;
  padding: 0;
}

.modal-default-button {
  float: right;
}

.modal-enter {
  opacity: 0;
}

.modal-leave-active {
  opacity: 0;
}

.modal-enter .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}

#modal-select-channel .channel-list .channel-listitem {
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    background-color: #eee;
    border-radius: 16px;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    flex-direction: column;
    font-size: 13px;
    height: 95px;
    justify-content: center;
    margin: top0.9rem;
    width: 100%;
    margin-top: 5px;
}

#modal-select-channel .channel-list .channel-enter {
    background: #100964;
    border-radius: 36px;
    color: #fff;
    line-height: 30px;
    margin-top: 2px;
    padding: 0 22px 0 22px;
}

#modal-select-channel .channel-list .channel-stats.idle {
    color: #3c82d8;
}

#modal-select-channel .channel-list .channel-stats.busy {
    color: #e79e00;
}

#modal-select-channel .channel-list .channel-stats.blocked {
    color: #f75259;
}
</style>
