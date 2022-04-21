<template>
  <footer class="site-footer">
    <ul class="footer-private">
      <li><a href="https://accounts.malangmalang.com/terms/current/ko">서비스 이용약관</a></li>
      <li><a href="https://accounts.malangmalang.com/privacy/current/ko" style="color:#ba8feb;">개인정보처리방침</a></li>
    </ul>
    <!-- 
    <ul>
      <li class="text-center">
        <img src="../imgs/f_logo.png" alt="" width="30%">
      </li>
    </ul>
     -->
    <!-- <div class="family_zone">
      <select @change="openFamilySite">
        <option> 패밀리사이트</option>
        <option
            :value="family.uri"
            v-for="family in famillies" 
            :key="family.id">
            {{family.name}}</option>
      </select>
    </div> -->
    <!-- <div class="footer_family_wrap" style="display: none;">
      <div class="footer_family_inbox">
        <div class="footer_family_list">
          
        </div>
      </div>
    </div>
    <div class="footer_family_btn">
      <a href="#none" class="on">패밀리사이트</a>
    </div> -->

    <div class="footer-family js-family">
      <h2>패밀리사이트</h2>
      <button type="button" title="패밀리사이트 열기/닫기" @click="dropFamilySite" class="footer-family__button-view">열기/닫기</button>
      <ul>
        <li
          v-for="family in famillies"
          :key="family.id">
          <a :href="family.uri" target="_blank">{{family.name}}</a>
        </li>
      </ul>
      <button type="button" title="패밀리사이트 열기/닫기" @click="dropFamilySite" class="footer-family__button-close">열기/닫기</button>
    </div>

    <address class="footer-address">
      <span>(주)한글과컴퓨터</span>
      <span>대표자: 변성준</span> <br>
      <span>사업자등록번호: 107-81-52230</span> <br>
      <span>통신판매신고번호: 2012-경기성남-1092</span> <br>
      <span>주소: 경기도 성남시 분당구 대왕판교로 644번길 49 한컴타워 10층</span> <br>
      <!-- <span>개인정보관리책임자: 박미영</span> -->
      <span>E-mail: typing@hancom.com</span>
      <span>고객지원: 평일 9시~18시</span> <br>
      <span>Copyright 2019. Hancom Inc. all rights reserved.</span>
    </address>
  </footer>
</template>

<script>
import { Script } from "vm";
export default {
  data()
  {
    return{

      famillies : this.$WebConfig.hancomFamilies,
    };
  },
  methods:{
    // openFamilySite(event){
    //   console.log(event);
    //   const targetUri = event.target.value;
    //   if(targetUri){
    //     location.href = targetUri;
    //   }
    //   console.log(targetUri);
    // },
    dropFamilySite() {
      const list = document.querySelector('.js-family')
      const active = 'is-active'
      if (list.classList.contains(active)) {
        list.classList.remove(active);
        return;
      }
      list.classList.add(active);
    }
  }
}
</script>