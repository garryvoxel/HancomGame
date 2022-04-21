<template>
    <transition name="modalSearch">
        <div class="modal-mask">
            <div class="modal-wrapper">
                <div class="modal-container">
                    <div class="modal-header">
                        <slot style="margin-right:33%" name="header">신고 하기</slot>
                    </div>

                    <div class="modal-body">
                        <slot name="body">default body</slot>
                    </div>

                    <div style="margin-right:5%" class="modal-footer">
                        <slot name="footer">
							<button @click="$emit('close')" class="">취소</button>
                        </slot>
                        	<button style="font-size : 95%" @click="$emit('close')" class="button-rounded-gray">취소하기</button>
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
            searchedFriend : null,
            isCompletedSentFriendRequest : false,
            modalAlert : "",
            showModal : true,
            nickname : "",
        }
    }
}
</script>
