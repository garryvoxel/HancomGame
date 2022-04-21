<template>
    <div>
        <h1>{{ count }}</h1><br>
        <p>{{ text }}</p>
        <button @click="openAlert">Watch</button>
    </div>
</template>

<script>
export default {
  
    methods: {
        openAlert(){
            alert('Count ::: ' + this.count)
        }
    },

    data() {
        return{
            count: false,
            text: '변경 전입니다.',
        }       
    },

    watch: {
        count: function (newVal, oldVal) {
            if(this.count){
                this.text = '여기가 1번';
            }else{
                this.text = '여기가 2번';
            }
        },
    }
}
</script>
