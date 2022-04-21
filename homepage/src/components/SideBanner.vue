<template>
    <div>
        <div id="side-banner" class="side-banner">
             <!-- <tbody>
                <td style="width: 100%;"> 
                    <a :href="leftBanner.target_uri" title="배너">
                        <img :src="leftBanner.image_url" alt="배너">
                    </a>
                </td>
                <td>
                    <a :href="leftBanner.target_uri" title="배너">
                        <img :src="leftBanner.image_url" alt="배너">
                    </a>
                </td>
            </tbody> -->
            <a :href="leftBanner.target_uri" title="배너">
                <img :src="leftBanner.image_url" alt="배너">
            </a>
        </div>
    </div>
</template>

<script>
export default {
    name: "side-banner",

    props: ["leftBanner", "rightBanner"]
};
</script>