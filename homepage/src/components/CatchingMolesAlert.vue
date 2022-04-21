<template>
    <modal id="typing-practice-alert" @close="$emit('cancel', dontShowCatchingMolesAlertTodayAnymore)">
        <h3 slot="header">두더지잡기 알림</h3>

        <div slot="body">
            <p>두더지잡기 실행 시 브라우저의 팝업차단을 해제해야 합니다.<br>
                브라우저의 팝업차단 설정에서 한컴 타자연습을 제외해 주세요.<br><br>    
                IE : 화면 하단의 팝업차단 안내 알림에서 허용 선택<br>
                크롬 : 주소창 오른쪽 팝업차단 버튼 클릭 후 허용 선택<br><br>

                더욱 자세한 내용은 FAQ를 참고해 주세요.</p>
        </div>

        <div slot="footer">
            <div class="buttons">
                <button @click="$emit('continue', dontShowCatchingMolesAlertTodayAnymore)" class="button-rounded-red">확인</button>
                <button @click="$emit('cancel', dontShowCatchingMolesAlertTodayAnymore)" class="button-rounded-gray">취소</button>
            </div>
            <div class="dont-show-anymore">
                <input id="typing-practice-alert-dont-show" type="checkbox" v-model="dontShowCatchingMolesAlertTodayAnymore">
                <label for="typing-practice-alert-dont-show">7일간 보지 않기</label>
            </div>
        </div>
    </modal>
</template>

<script>
export default {
    data() {
        return {
            dontShowCatchingMolesAlertTodayAnymore: false,
        }
    }
}
</script>