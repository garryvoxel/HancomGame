<template>
    <img :src="`/imgs/avatars/avatar_${id}.png`" alt="아바타">
</template>

<script>
export default {
    props: ["index"],

    computed: {
        id() {
            return this.index < 10 ? `0${this.index}` : this.index;
        }
    }
};
</script>