<template>
    <header id="site-header">
        <div class="header-container">
            <gnb/>

            <div v-if="isTypingPractice" class="header-banner">
                <div class="wave-container">
                    <div id="wave3" class="wave"></div>
                    <div id="wave2" class="wave"></div>
                    <div id="wave1" class="wave"></div>
                </div>
                <div class="hangul">
                    <img src="/images/m_title_01.png" alt="한글 모음">
                </div>
                <div class="fireworks">
                    <img src="/images/bomlight_01.png" alt="불꽃">
                </div>
                <div class="s01img">
                    <img src="/images/m_ch_01.png" alt="캐릭터">
                </div>
            </div>

            <div v-else-if="isGame" class="header-banner">
                <div class="wave-container">
                    <div id="wave3" class="wave"></div>
                    <div id="wave2" class="wave"></div>
                    <div id="wave1" class="wave"></div>
                </div>
                <div class="fireworks">
                    <img src="/images/bomlight_01.png" alt="불꽃">
                </div>
                <div class="s02img2">
                    <img src="/images/m_ch_02.png" alt="PLAY">
                </div>
                <div class="s02txt">
                    <img src="/images/m_title_02.png" alt="새로워진 한컴 타자게임">
                </div>
            </div>

            <div v-else-if="isRankings" class="header-banner">
                <div class="wave-container">
                    <div id="wave3" class="wave"></div>
                    <div id="wave2" class="wave"></div>
                    <div id="wave1" class="wave"></div>
                </div>
                <div class="fireworks">
                    <img src="/images/bomlight_01.png" alt="불꽃">
                </div>
                <div class="s03img2">
                    <img src="/images/m_ch_02.png" alt="PLAY">
                </div>
                <div class="s03txt">
                    <img src="/images/m_title_03.png" alt="새로워진 한컴 타자게임">
                </div>
            </div>

            <div v-else-if="isCommunity" class="header-banner">
                <div class="wave-container">
                    <div id="wave3" class="wave"></div>
                    <div id="wave2" class="wave"></div>
                    <div id="wave1" class="wave"></div>
                </div>

                <div class="fireworks">
                    <img src="/images/bomlight_01.png" alt="불꽃">
                </div>

                <div class="s04img1">
                    <img src="/images/m_ch_04.png" alt="상자">
                </div>

                <div class="s04txt">
                    <img src="/images/m_title_04.png" alt="커뮤니티">
                </div>
            </div>

            <div v-else-if="isSupport">
                <div class="wave-container">
                    <div id="wave3" class="wave"></div>
                    <div id="wave2" class="wave"></div>
                    <div id="wave1" class="wave"></div>
                </div>

                <div class="fireworks">
                    <img src="/images/bomlight_01.png" alt="불꽃">
                </div>
                <div class="school">
                    <img src="/images/m_ch_05.png" alt="학교">
                </div>
                <div class="header-text">
                    <img src="/images/m_title_05.png" alt="고객센터">
                </div>
            </div>

            <div v-else-if="isMypage">
                <div class="wave-container">
                    <div id="wave3" class="wave"></div>
                    <div id="wave2" class="wave"></div>
                    <div id="wave1" class="wave"></div>
                </div>
                <div class="fireworks">
                    <img src="/images/bomlight_01.png" alt="불꽃">
                </div>
                <div class="character">
                    <img src="/images/m_ch_06.png" alt="캐릭터">
                </div>
                <div class="s06txt">
                    <img src="/images/m_title_06.png" alt="새로워진 한컴 타자게임">
                </div>
            </div>
        </div>
    </header>
</template>

<script>
export default {
    computed: {
        isTypingPractice() {
            return /^[/]?typing[-]practice[/]?.*$/.test(this.$route.path);
        },

        isGame() {
            return /^[/]?game[/]?.*$/.test(this.$route.path);
        },

        isRankings() {
            return /^[/]?rankings[/]?.*$/.test(this.$route.path);
        },

        isCommunity() {
            return /^[/]?community[/]?.*$/.test(this.$route.path);
        },

        isSupport() {
            return /^[/]?support[/]?.*$/.test(this.$route.path);
        },

        isMypage() {
            return /^[/]?mypage[/]?.*$/.test(this.$route.path);
        }
    },

    mounted() {
        this.$nextTick(function() {
            $("#wave2")
                .animate(
                    { "background-position-x": "-=10000" },
                    500000,
                    "linear"
                )
                .animate(
                    { "background-position-x": "-=10000" },
                    500000,
                    "linear"
                );

            $("#wave3")
                .animate(
                    { "background-position-x": "10000" },
                    1000000,
                    "linear"
                )
                .animate(
                    { "background-position-x": "20000" },
                    1000000,
                    "linear"
                );
        });
    }
};
</script>