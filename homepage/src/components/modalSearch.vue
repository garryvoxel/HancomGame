<template>
    <transition name="modalSearch">
        <div class="modal-mask">
            <div class="modal-wrapper">
                <div class="modal-container">
                    <div class="modal-header">
                        <slot name="header">친구 찾기</slot>
                    </div>

                    <div class="modal-body">
                        <slot name="body">default body</slot>
                    </div>

                    <div class="modal-footer">
                        <slot name="footer">
							<button @click="$emit('close')" class="button-rounded-gray">취소</button>
                        </slot>
                    </div>
					<button @click="$emit('close')" class="modal-close"></button>
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
