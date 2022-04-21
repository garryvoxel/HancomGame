<template>
    <modal id="accustaion-popup" @close="$emit('cancel')">
        <h3 slot="header">신고하기</h3>

        <div slot="body">
            <div>
                <p><b>대표적인 1개의 사유를 선택해 주세요.</b></p><br>
            </div>
            <div>
                <input type="radio" id="1" value="1" v-model="picked">
                <label for="1"> 부적절한 홍보 게시글</label>
                <br>
                <br>
                <input type="radio" id="2" value="2" v-model="picked">
                <label for="2"> 음란성 또는 청소년에게 부적합한 내용</label>
                <br>
                <br>
                <input type="radio" id="3" value="3" v-model="picked">
                <label for="3"> 명예훼손/사생활침해 및 저작권침해 내용</label>
                <br>
                <br>
                <input type="radio" id="4" value="4" v-model="picked">
                <label for="4"> 기타</label>
                <br>
                <br>
                <!-- <span>선택: {{ picked }}</span> -->

                <textarea v-if="picked==4" v-model="desc" placeholder="신고내용을 입력해주세요." style="margin: 0px; width: 350px; height: 200px;"></textarea>

            </div>
        </div>

        <div slot="footer">
            <button @click="$emit('continue', picked, desc)" class="button-rounded-red">신고하기</button>
        </div>
    </modal>
</template>

<script>
export default {
    data() {
        return {
            subject: "",
            writer: "",
            picked: 0,
            desc: "",
        }
    }
};
</script>