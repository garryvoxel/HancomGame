<template>
  <div id="app">
    <router-view />
    <tt-sdk-modal v-if="invitation !== null" :invitation="invitation" />
    <loader v-if="loadings.length" />
  </div>
</template>

<script>
import io from 'socket.io-client';
import TtSdkModal from './components/TtSdkModal.vue';

export default {
  components: {
    'tt-sdk-modal': TtSdkModal,
  },

  data() {
    return {
      socket: null,
      isSocketLoggedIn: false,
      isApiLoggedIn: false,
      invitation: null,
      loadings: [],
    };
  },

  created() {
    const option = {
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: 5,
      },
      self = this;

    if (process.env.NODE_ENV !== 'test') {
      option.transports = ['websocket'];
    }

    // GC-Server와 소켓 연결 & 소켓 핸들러 정의
    this.socket = io(
      self.$WebConfig.malangmalangLinks.pilingCoinsGameServer,
      option
    );

    this.$EventBus.$on('ttsdk-accept', invitation => {
      self.acceptInvitation(invitation);
      self.destroyInvitations();
      self.invitation = null;
    });

    this.$EventBus.$on('ttsdk-reject', invitation => {
      self.rejectInvitation(invitation);
      self.deleteInvitation(invitation);
      this.invitation = null;
    });

    this.$EventBus.$on('ttsdk-close', () => {
      self.deleteInvitation(this.invitation);
      this.invitation = null;
    });

    this.$EventBus.$on('loading-add', loadingName => {
      self.loadings.push(loadingName);
    });

    this.$EventBus.$on('loading-remove', loadingName => {
      self.loadings.splice(self.loadings.indexOf(loadingName), 1);
    });
  },

  mounted() {
    //소켓 연결이 성공한 후
    if (this.socket) {
      const self = this;
      /**
       * main.js 의 registerUser 호출한후 trigger되는 이벤트
       * gcServer 소켓 호출 & gc_server의 req_login 이벤트 참조
       */
      this.$EventBus.$on('api-logged-in', user => {
        this.isApiLoggedIn = true;

        if (this.isSocketLoggedIn) {
          return;
        }

        this.socketLogin(user);
      });
      /**
       * gc server에서 유저 소켓 로그인 처리후 말단 res_login 이벤트로 emit
       * 로직 오류 ~ response에 대한 처리 필요 
       */
      this.socket.on('res_login', response => {
        if (this.isApiLoggedIn && this.socket.connected && response) {
          this.isSocketLoggedIn = true;
        }
      });
      /**
       * gc server와 소켓 연결이 성공한 경우
       */
      this.socket.on('connect', () => {
        this.socketLogin(this.$root.user);
      });
      /**
       * 소켓 연결 끊어질 경우의 처리
       */
      this.socket.on('disconnect', () => {
        this.isSocketLoggedIn = false;
      });

      this.socket.on('game_invited', invitation => {
        if (
          self.$root.typingPracticeWindow &&
          !self.$root.typingPracticeWindow.closed
        ) {
          invitation.isForTypingPractice = true;
        }

        if (self.$root.gameWindow && !self.$root.gameWindow.closed) {
          invitation.isForGame = true;
        }

        if (!invitation.isForTypingPractice && !invitation.isForGame) {
          invitation.isForWeb = true;
        }

        let invitations = self.getInvitations();

        if (invitations) {
          invitations.push(invitation);
        } else {
          invitations = [invitation];
        }

        self.bakeInvitations(invitations);

        if (!self.invitationSupervisor) {
          self.runInvitationSupervisor();
        }
      });
    }
  },
  /**
   * 홈페이지 소켓처리는 컴포넌트와 무관하므로 socket io client핸들러 및 이벤트를 APP / methods에 정의
   */
  methods: {
    isEqualInvitation(invitation1, invitation2) {
      if (!invitation1 || !invitation2) {
        return false;
      }

      return (
        invitation1.from_nick_name === invitation2.from_nick_name &&
        invitation1.invited_time === invitation2.invited_time
      );
    },

    getInvitations() {
      const raw = this.$cookie.get('invitations');

      if (raw && raw !== 'undefined') {
        return JSON.parse(raw) || [];
      }

      return [];
    },

    bakeInvitations(invitations) {
      if (invitations && invitations.length) {
        this.$cookie.set('invitations', JSON.stringify(invitations), {
          expires: '10m',
          domain: '.malangmalang.com',
          path: '/',
        });
      } else {
        this.destroyInvitations();
      }
    },

    deleteInvitation(invitation) {
      const invitations = this.getInvitations(),
        self = this;

      this.bakeInvitations(
        invitations.filter(item => {
          return !self.isEqualInvitation(item, invitation);
        }) || []
      );
    },

    destroyInvitations() {
      this.$cookie.delete('invitations', {
        domain: '.malangmalang.com',
        path: '/',
      });
    },

    runInvitationSupervisor() {
      const self = this;

      this.invitationSupervisor = setInterval(() => {
        let invitations = self.getInvitations();
        if (invitations && invitations.length) {
          let isDirty = false;

          if (!self.invitation) {
            self.invitation =
              invitations.find(invitation => {
                return invitation.isForWeb;
              }) || null;
          }

          invitations.forEach(invitation => {
            if (invitation.isRejected) {
              self.rejectInvitation(invitation);
              self.deleteInvitation(invitation);
              isDirty = true;
            }
          });

          if (isDirty) {
            invitations = self.getInvitations();

            if (invitations.length) {
              self.bakeInvitations(invitations);
            }
          }
        } else {
          // self.destroyInvitations();
          self.stopInvitationSupervisor();
        }
      }, 1000);
    },

    stopInvitationSupervisor() {
      clearInterval(this.invitationSupervisor);
      this.invitationSupervisor = null;
    },
    /**
     * 유저정보를 req_login 소켓으로 emit
     * @param {*유저정보} user  
     */
    socketLogin(user) {
      if (this.socket) {
        //소켓 , API서버 로그인 플래그가 적어도 TRUE인 경우에만 소켓 emit가능
        if (this.isSocketLoggedIn) {
          return;
        }

        if (!this.$root.isApiServerLoggedIn) {
          return;
        }

        if (!this.socket.connected) {
          return;
        }

        if (!user || !user.nickname) {
          return;
        }

        const params = {
          msg_idx: 'req_login',
          nick_name: user.nickname,
          session_id: this.$root.sessionId(),
        };
        /**
         * req_login이벤트를 gc_server 에 emit
         * @param {*소켓 메시지 타입} msg_idx   
         * @param {*닉네임} nick_name  
         * @param {*세션아이디} session_id 
         */
        this.socket.emit('req_login', {
          msg_idx: 'req_login',
          nick_name: user.nickname,
          session_id: this.$root.sessionId(),
        });
      }
    },

    rejectInvitation(invitation) {
      if (this.socket) {
        const data = {
          msg_idx: 'req_invite_reject',
          session_id: this.$root.sessionId(),
          invite_nick_name: invitation.from_nick_name,
          nick_name: this.$root.user.nickname,
          invited_time: invitation.invited_time,
          game_code: invitation.game_code,
        };

        this.socket.emit('req_invite_reject', data);
      }
    },

    acceptInvitation(invitation) {
      this.$cookie.set('accepted_invitation', JSON.stringify(invitation), {
        expires: '10m',
        domain: '.malangmalang.com',
        path: '/',
      });

      if (invitation.game_code === 10000) {
        this.$root.playGame('piling-coins', invitation.server_idx);
      } else if (invitation.game_code === 10001) {
        this.$root.playGame('flipping-cards', invitation.server_idx);
      }
    },
  },
};
</script>
