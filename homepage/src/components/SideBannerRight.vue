<template>
    <div id="side-banner-right" class="side-banner-right">
        <a :href="leftBanner.target_uri" title="배너">
            <img :src="leftBanner.image_url" alt="배너">
        </a>
    </div>
</template>

<script>
export default {
    name: "side-banner-right",

    props: ["leftBanner", "rightBanner"]
};
</script>