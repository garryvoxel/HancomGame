<template>
  <div id="frontModal">
    <div class="front-modal" v-if="popups && popups.length">
      <div class="front-modal__wrapper">
        <div class="front-modal__body"  v-for="(popup, idx) in popups" :key="idx">
          <article class="modal-article" v-html="popup.bdcontData"></article>
        </div>
        <div class="front-modal__footer">
          <label class="front-modal__chk-label">
            <input
              id="modalToday"
              type="checkbox"
              class="front-modal__chk-input"
            />
            오늘 하루 보지않기
          </label>
        </div>
        <button class="front-modal__btn-close" @click="closeWin">
          팝업 닫기
        </button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data(){
    return {
      popups:[]
    }
  },
  methods: {
    getPopup() { //팝업 보이기
      this.$axios
      .get(this.$Api3.popup)
      .then(response => {
        this.popups = response.data.elements
      })
    },
    setCookie(name, value, expiredays) { //쿠키 세팅
      let today = new Date();
      today = new Date(parseInt(today.getTime() / 86400000) * 86400000 + 54000000);
      if ( today > new Date() ) expiredays = expiredays - 1;
      today.setDate(today.getDate() + expiredays);
      document.cookie =
        name +
        '=' +
        escape(value) +
        '; path=/; expires=' +
        today.toGMTString() +
        ';';
    },
    closeWin() {
      if (document.getElementById('modalToday').checked) this.setCookie('not_today', 'Y', 1);
      document.getElementById('frontModal').style.display = 'none';
    },
  },
  mounted() {
    this.getPopup();
    const frontCookie = modal => {
      if (!modal) return
      modal.style.display = document.cookie.indexOf('not_today=Y') < 0 ? '': 'none';
    }
    frontCookie(document.getElementById('frontModal'))
  },
};
</script>
<style scoped>
@keyframes modal-dimmed {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
.front-modal {
  box-sizing: border-box;
  overflow: auto;
  opacity: 0;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding: 20px;
  background-color: rgba(0, 0, 0, 0.7);
  text-align: center;
  white-space: nowrap;
  animation-name: modal-dimmed;
  animation-duration: 0.3s;
  animation-fill-mode: forwards;
  animation-timing-function: ease-in-out;
}
.front-modal:before,
.front-modal:after {
  content: '';
  display: inline-block;
  width: 0;
  height: 100%;
  vertical-align: middle;
}
@keyframes modal-wrapper {
  0% {
    transform: translate(0, 100%);
    opacity: 0;
  }
  100% {
    transform: translate(0, 0);
    opacity: 1;
  }
}
.front-modal__wrapper {
  position: relative;
  display: inline-block;
  height: auto;
  vertical-align: middle;
  white-space: normal;
  text-align: left;
  padding-top: 53px;
  animation-name: modal-wrapper;
  animation-duration: 0.3s;
  animation-delay: 0.3s;
  animation-fill-mode: forwards;
  animation-timing-function: ease-in-out;
  transform: translate(0, 100%);
  opacity: 0;
}
.front-modal__body {
  position: relative;
  display: flex;
}
.front-modal__body:before,
.front-modal__body:after {
  content: '';
  display: table;
  overflow: hidden;
}
.front-modal__footer {
  padding-top: 20px;
}
.front-modal__chk-label {
  margin: 0;
  font-size: 22px;
  font-weight: 400;
  line-height: 1.3;
  color: #fff;
}
.front-modal__chk-input {
  vertical-align: middle;
  -o-appearance: none;
  -moz-appearance: none;
  -webkit-appearance: none;
  appearance: none;
  width: 34px;
  height: 34px;
  margin-left: 4px;
  border-radius: 0;
  background-color: #fff;
  background-repeat: no-repeat;
  background-size: contain;
  background-position: left -2px top 0px;
  box-shadow: -4px -4px 0px rgba(0, 0, 0, 0.69);
  cursor: pointer;
}
.front-modal__chk-input:checked {
  background-image: url('/images/event/front_modal_icon_chk.png');
  background-image: -webkit-image-set(
    url('/images/event/front_modal_icon_chk.png') 1x, 
    url('/images/event/front_modal_icon_chk@2x.png') 2x
  )
}
.front-modal__chk-input::-ms-check {
  opacity: 0;
}
.front-modal__btn-close {
  position: absolute;
  top: 0;
  right: 0;
  overflow: hidden;
  margin: 0;
  padding: 0;
  width: 36px;
  height: 36px;
  border: none;
  background-color: transparent;
  background-repeat: no-repeat;
  background-image: url('/images/event/front_modal_btn_close.png');
  background-image: -webkit-image-set(
    url('/images/event/front_modal_btn_close.png') 1x,
    url('/images/event/front_modal_btn_close@2x.png') 2x
  );
  background-position: center;
  text-indent: 100%;
  text-align: left;
  cursor: pointer;
  white-space: nowrap;
}
.modal-article {
  position: relative;
}
.modal-article >>> img {
  max-width: 100%;
  vertical-align: top;
}
</style>
