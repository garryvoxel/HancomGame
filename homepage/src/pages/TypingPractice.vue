<template>
    <div id="typing-practice">
        <site-header/>

        <!-- 본문영역 -->
        <section id="container">
            <div class="content-wrapper">
                <div class="contentService">
                    <!-- 타이틀 -->
                    <h4 class="page_tit" v-bind="titleName">{{ title }}</h4>
                    <!-- location -->
                    <div class="location">
                        <ol>
                            <li class="home">
                                <router-link to="/" title="홈으로">
                                    <img src="/images/icon_home.png" alt="홈으로">
                                </router-link>
                            </li>
                            <li class="on">
                                <router-link :to="menu.uri" :title="menu.name">{{ menu.name }}</router-link>
                            </li>
                            <li>{{ title }}</li>
                        </ol>
                    </div>
                </div>

                <div class="content" v-if="$route.name === 'exercising-words-typing'">
                    <div class="board">
                        <div class="figure">
                            <img src="/images/01_sub_img_02.png" alt="말풍선">
                        </div>
                        <div>
                            <h5>"기본기를 다졌다면 간단한 단어로 손을 풀어줄까요?”</h5>
                            <p>단어에 따라 손가락이 저절로 움직이게 될 때까지!</p>
                        </div>
                    </div>
                    <div class="button-play">
                        <a v-on:click.prevent="launchTajaTyping" title="낱말 연습 시작하기">
                            <img src="/images/start_p02.png" alt="낱말 연습 시작하기">
                        </a>
                    </div>
                    <div class="screenshot">
                        <img src="/images/sub0102_img.png" alt="자리연습">
                    </div>
                </div>

                <div class="content" v-else-if="$route.name === 'exercising-sentence-typing'">
                    <div class="board">
                        <div class="figure">
                            <img src="/images/01_sub_img_03.png" alt="말풍선">
                        </div>
                        <div>
                            <h5>“본격적인 타자의 시작! 짧은 글을 입력하며 속도를 향상시켜 봐요.”</h5>
                            <p>원하는 카테고리에서 지식도 쌓을 수 있어요!</p>
                        </div>
                    </div>
                    <div class="button-play">
                        <a v-on:click.prevent="launchTajaTyping" title="짧은 글 연습 시작하기">
                            <img src="/images/start_p03.png" alt="짧은 글 연습 시작하기">
                        </a>
                    </div>
                    <div class="screenshot">
                        <img src="/images/sub0103_img.png" alt="짧은 글 연습">
                    </div>
                </div>

                <div class="content" v-else-if="$route.name === 'exercising-writing-typing'">
                    <div class="board">
                        <div class="figure">
                            <img src="/images/01_sub_img_04.png" alt="말풍선">
                        </div>
                        <div>
                            <h5>“긴 글 연습은 시간제한 없이 연습해볼 수 있어요.”</h5>
                            <p>타자검정으로 쌓아온 실력을 발휘해 봅시다!
                                <br>쌓아온 타자실력을 긴 글 연습에서 확인할 수 있어요.
                            </p>
                        </div>
                    </div>
                    <div class="button-play">
                        <a v-on:click.prevent="launchTajaTyping" title="긴 글 연습 시작하기">
                            <img src="/images/start_p04.png" alt="긴 글 연습 시작하기">
                        </a>
                    </div>
                    <div class="screenshot">
                        <img src="/images/sub0104_img.png" alt="긴글연습">
                    </div>
                </div>

                <div class="content" v-else>
                    <div class="board">
                        <div class="figure">
                            <img src="/images/01_sub_img_01.png" alt="키보드">
                        </div>
                        <div>
                            <h5>"기본이 튼튼하면 속도는 금방이죠! 자리 연습으로 기본부터 해볼까요?”</h5>
                            <p>타자의 첫 걸음은 자리 연습부터! 차근차근 타자 실력을 키워봅시다.
                                <br>타자를 처음 하는 사용자도 한컴 타자연습으로 누구나 쉽고 재미있게 익힐 수 있습니다.
                                <br>자리 연습, 낱말 연습, 짧은 글 연습, 긴 글 연습을 통해서 단계별로 타자 실력을 향상시켜보세요.
                            </p>
                        </div>
                    </div>
                    <div class="button-play">
                        <a v-on:click.prevent="launchTajaTyping" title="자리 연습 시작하기">
                            <img src="/images/start_p01.png" alt="자리 연습 시작하기">
                        </a>
                    </div>
                    <div class="screenshot">
                        <img src="/images/sub0101_img.png" alt="자리연습">
                    </div>
                </div>
            </div>
        </section>

        <site-footer/>

        <typing-practice-alert
            @cancel="cancelTypingPracticeAlert"
            @continue="continueTypingPracticeAlert"
            v-if="showTypingPracticeAlert"
        />
    </div>
</template>

<script>
import TypingPracticeAlert from "../components/TypingPracticeAlert.vue";

export default {
    name: "typing-practice",

    components: {
        "typing-practice-alert": TypingPracticeAlert
    },

    data() { //변수 초기화
        return {
            menu: this.$root.menu[this.$options.name],
            items: this.$root.menu[this.$options.name].children,
            cookieNameDontShowTypngPracticeAlertToday:
                "dont_show_typing_practice_alert_today",
            showTypingPracticeAlert: false,
            titleName: ""
        };
    },

    computed: {
        title() {
            switch (this.$route.name) {
                case "learning-key-placements":
                    return "자리 연습";
                case "exercising-words-typing":
                    return "낱말 연습";
                case "exercising-sentence-typing":
                    return "짧은 글 연습";
                default:
                    return "긴 글 연습";
            }
        }
    },

    methods: {
        //광고만료날짜 세팅
        processCookieDontShowTypingPracticeAlertToday(isChecked) {
            if (isChecked) {
                const midnight = new Date();

                midnight.setDate(midnight.getDate() + 7);
                midnight.setHours(0);
                midnight.setMinutes(0);
                midnight.setSeconds(0);
                midnight.setMilliseconds(0);

                this.$cookie.set(
                    this.cookieNameDontShowTypngPracticeAlertToday,
                    true,
                    {
                        expires: midnight
                    }
                );
            } else {
                this.$cookie.delete(
                    this.cookieNameDontShowTypngPracticeAlertToday
                );
            }
        },

        cancelTypingPracticeAlert(isChecked) {
            this.showTypingPracticeAlert = false;
            this.processCookieDontShowTypingPracticeAlertToday(isChecked);
        },

        continueTypingPracticeAlert(isChecked) {
            this.showTypingPracticeAlert = false;
            this.processCookieDontShowTypingPracticeAlertToday(isChecked);
            this.$root.launchTajaTyping(this.$route.name);
        },

        launchTajaTyping() {
            if(!this.$root.isLoggedIn())
            {
                if (!confirm("게스트는 연습기록, 포인트 등이 저장되지 않습니다.\n로그인 하시겠습니까?")) {
                    if (!this.$cookie.get(this.cookieNameDontShowTypngPracticeAlertToday)) {
                        this.showTypingPracticeAlert = true;
                        return;
                    }
                    this.$root.launchTajaTyping(this.$route.name);
                    return;
                }
                this.$root.redirectToLogin();   
                return;
            }else{
                if (!this.$cookie.get(this.cookieNameDontShowTypngPracticeAlertToday)) {
                    this.showTypingPracticeAlert = true;
                    return;
                }
                this.$root.launchTajaTyping(this.$route.name);
            }
        },

      
    },
    beforeRouteEnter(to, from, next) {
        next(vm => {
            vm.$root.registerNicknameIfNotExist();
        });
    }
};
</script>