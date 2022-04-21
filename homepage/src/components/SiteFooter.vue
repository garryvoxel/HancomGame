<template>
  <footer id="site-footer">
    <section
      v-if="$route.name === 'home' && bottomBanner"
      class="footer-banner"
    >
      <a :href="bottomBanner.target_uri" title="배너">
        <img :src="bottomBanner.image_url" alt="배너" />
      </a>
    </section>

    <section class="footer_in">
      <div class="footer-container">
        <div>
          <div class="foot_link">
            <a
              v-for="link in links"
              :key="link.id"
              :href="link.uri"
              :title="link.name"
              target="_blank"
              >{{ link.name }}</a
            >
            <a
              :key="privacyPolicylink.id"
              style="color : #b7aedb;"
              :href="privacyPolicylink.uri"
              :title="privacyPolicylink.name"
              target="_blank"
              >{{ privacyPolicylink.name }}</a
            >
            <a
              :key="inquirylink.id"
              :href="inquirylink.uri"
              :title="inquirylink.name"
              target="_blank"
              >{{ inquirylink.name }}</a
            >
          </div>
          <address class="mt_8">
            경기도 성남시 분당구 대왕판교로 644번길 49 한컴타워 10층 고객지원 :
            평일 9시~18시, typing@hancom.com
          </address>
          <p>
            사업자등록번호 107-81-52230 통신판매신고번호
            2012-경기성남-1092 (주)한글과컴퓨터 대표자 : 변성준
          </p>
          <p class="copyright">Copyrights © Hancom Inc. All rights reserved.</p>
        </div>

        <div ref="familySite" class="footer-family" :class="{ 'is-active' : isOpen }">
            <h2 class="footer-family__title">한컴계열사 사이트</h2>
            <button type="button" class="footer-family__button" @click="toggleFamily">열기/닫기</button>
            <ul class="footer-family__list">
              <li 
                v-for="family in families"
                :key="family.id"
                class="footer-family__item"
              >
                <a
                  :href="family.uri"
                  target="_blank"
                  class="footer-family__link"
                >
                  {{ family.name }}
                </a>
              </li>
            </ul>
            <button type="button" class="footer-family__button" @click="toggleFamily">열기/닫기</button>
          </div>


      </div>
    </section>
  </footer>
</template>

<script>
export default {
  name: 'SiteFooter',

  props: ['bottomBanner'],

  data() {
    return {
      isOpen: false,
      families: this.$WebConfig.hancomFamilies,
      privacyPolicylink: this.$WebConfig.malangmalangLinks.privacyPolicy,
      inquirylink: this.$WebConfig.malangmalangLinks.inquiry,
      links: [
        this.$WebConfig.malangmalangLinks.intro,
        this.$WebConfig.malangmalangLinks.termsOfUse,
      ],
    };
  },
  mounted() {
    document.addEventListener('click', this.documentClick);
  },
  destroyed() {
    document.removeEventListener('click', this.documentClick);
  },
  methods: {
    toggleFamily() {
      this.isOpen = !this.isOpen;
    },
    documentClick(e) {
      const el = this.$refs.familySite;
      const target = e.target;
      if (el !== target && !el.contains(target)) {
        this.isOpen = false;
      }
    },
  },
};
</script>
<style scoped>
.footer-family {
  position: absolute;
  top: 0;
  right: 0;
  box-sizing: border-box;
  width: 250px;
  height: 30px;
	padding: 5px 30px 5px 15px;
  border-radius: 30px;
  background: #fff url('/images/ico-select-purple-arrow.png') no-repeat center right;
  color: #666;
	font-size: 14px;
  line-height: 1.3;
}
.footer-family__title {
  margin: 0;
  font-size: 1em;
}
.footer-family__list {
  display: none;
  overflow: hidden;
  position: absolute;
  bottom: 100%;
  left: 0;
  list-style: none;
  width: 100%;
  margin: 0 0 5px 0;
  padding: 10px 15px;
  box-shadow: 0 0 3px rgba(0, 0, 0, 0.5);
  border-radius: 15px;
  background-color: #fff;
}
.footer-family.is-active .footer-family__list {
  display: block;
}
.footer-family__item {
  margin: 0 -15px;
  padding: 0;
}
.footer-family__link {
  position: relative;
  padding: 5px 15px;
  display: block;
  color: inherit;
  text-decoration: none;
}
.footer-family__link:hover {
  background-color: #5D49A8;
  color: #fff;
}
.footer-family__button {
  overflow: hidden;
  position: absolute; 
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding: 0;
  border: none;
  border-radius: 15px;
  background-color: transparent;
  text-align: left;
  white-space: nowrap;
  text-indent: 200%;
}
.footer-family__button:focus {
  outline: none;
  box-shadow: 0 0 10px rgb(183, 174, 219);
}
</style>
