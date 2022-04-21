<template>
  <!-- sidebar menu area start -->
  <aside class="sidebar-menu">
    <div class="sidebar-header">
      <button type="button" class="btn-sidebar-toggle js-btn-toggle is-active">
        <span></span>
        <span></span>
        <span></span>
      </button>
    </div>
    <div class="sidebar-login">
      <div v-if="isLoggedIn === true">
        <div class="login-stat" v-if="this.$root.user != null">
          <p>
            <span>{{this.$root.user.nickname}}</span>
            <span>님, 환영합니다.</span>
          </p>
        </div>
        <div class="join-stat">
          <ul>
            <li>
              <a :href="mypageUri">
                <i class="fa fa-user"></i> 마이페이지
              </a>
            </li>
            <li>
              <a @click="logout">
                <i class="fa fa-sign-out"></i> 로그아웃
              </a>
            </li>
          </ul>
        </div>
      </div>
      <!-- 비회원상태 시작-->
      <div v-if="!isLoggedIn">
        <div class="guest-stat">
          <p>
            <span>
              현재게스트 상태입니다.
              <br />로그인해서 한컴 타자연습 플랫폼의<br> 다양한 혜택을 이용해보세요.
            </span>
          </p>
        </div>
        <div class="join-stat">
          <ul>
            <li>
              <a :href="signInUri">
                <i class="fa fa-user-plus"></i> 회원가입
              </a>
            </li>
            <li>
              <a :href="loginUri">
                <i class="fa fa-sign-in"></i> 로그인
              </a>
            </li>
          </ul>
        </div>
      </div>
      <!-- 비회원상태 끝 -->
    </div>
    <div class="main-menu">
      <div class="menu-inner">
        <nav>
          <ul class="metismenu" id="menu">
            <li>
              <a href="javascript:void(0)" aria-expanded="true">
                <span>게임</span>
              </a>
              <ul>
                <li @click="sideMenuHide()">
                  <router-link to="/game/coin" @click="sideMenuHide()">동전쌓기</router-link>
                </li>
                <li @click="sideMenuHide()">
                  <router-link to="/game/moles" @click="sideMenuHide()">두더지게임</router-link>
                </li>
                <!-- <li><a href="#/game/coin">동전쌓기</a></li>
                <li><router-link :to="'/game/moles'">두더지게임</router-link></li>-->
              </ul>
            </li>
            <!--
            <li>
              <a href="javascript:void(0)" aria-expanded="true">
                <span>랭킹</span>
              </a>
              <ul class="collapse">
                <li @click="sideMenuHide()"><router-link to="/ranking/coin">동전쌓기</router-link></li>
                <li @click="sideMenuHide()"><router-link to="/ranking/moles">두더지게임</router-link></li>
                <li @click="sideMenuPc()">
                  <a>판 뒤집기</a>
                </li>
              </ul>
            </li>
            -->
            <li>
              <a href="javascript:void(0)" aria-expanded="true">
                <span>커뮤니티</span>
              </a>
              <ul class="collapse">
                <li @click="sideMenuHide()">
                  <router-link to="/clan">클랜</router-link>
                </li>
                <!-- <li @click="sideMenuHide()">
                  <router-link to="/free">자유게시판</router-link>
                </li> -->
                <li @click="sideMenuHide()">
                  <router-link to="/friends/list">친구관리</router-link>
                </li>
                <li @click="sideMenuHide()">
                  <router-link to="/notice">공지사항</router-link>
                </li>
                <li @click="sideMenuHide()">
                  <router-link to="/event">이벤트</router-link>
                </li>
              </ul>
            </li>
            <li>
              <a href="javascript:void(0)" aria-expanded="true">
                <span>고객센터</span>
              </a>
              <ul class="collapse">
                <li @click="sideMenuHide()">
                  <router-link to="/support">FAQ</router-link>
                </li>
                <li @click="sideMenuHide()">
                  <!-- <component
                    :is="checkLogin() ? 'a' : 'router-link'"
                    class="routerArea"
                    :to="'/mypage/register-nickname'"
                    :href="inquiryUri"
                    :target="checkLogin() ? '_blank':'_self'"
                  >문의하기</component>-->
                </li>
                <li @click="sideMenuHide()">
                  <a class="routerArea" :href="inquiryUri" target="_blank">문의하기</a>
                </li>
              </ul>
            </li>
            <li v-if="isLoggedIn === true" @click="sideMenuHide()">
              <router-link to="/mypage" aria-expanded="true">
                <span>내타자정보</span>
              </router-link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  </aside>
  <!-- sidebar menu area end -->
</template>

<script>
import services from "../services";
import { throws } from "assert";

export default {
  data() {
    return {
      isLoggedIn: this.$root.isLoggedIn(),
      loginUri: this.$root.loginUri(),
      signInUri: this.$root.signupUri(),
      mypageUri: this.$root.mypageUri(),
      menu: this.$root.menu,
      services: services,
      isServicesVisible: false,
      isAccountMenuVisible: false,
      inquiryUri: this.$root.inquryUri(),
      isMenuOver: false,
      isPreventedMouseOver: false
    };
  },

  computed: {
    user() {
      if (this.$root.user != null) return this.$root.user;
    }
  },

  methods: {
    sideMenuHide() {
      console.log("pressed");
      $('#app').removeClass('is-sidebar-on');
    },
    sideMenuPc() {
      alert("PC에서 확인 가능합니다.");
    },
    checkLogin() {
      console.log(this.$root.user);
      if (this.$root.user != null) {
        const nickname = this.$root.user.nickname;
        if (this.isLoggedIn && nickname != null) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    },
    routeLink(num) {
      switch (num) {
        case 0:
          this.$router.push("/game/coin");
          this.$router.go();
          break;

        case 1:
          this.$router.push("/game/moles");
          this.$router.go();
          break;

        case 3:
          this.$router.push("/ranking/coin");
          this.$router.go();
          break;

        case 4:
          this.$router.push("/ranking/moles");
          this.$router.go();
          break;

        case 5:
          this.$router.push("/clan");
          this.$router.go();
          break;

        case 6:
          this.$router.push("/free");
          this.$router.go();
          break;

        case 7:
          if (!this.$root.isLoggedIn()) {
            if (!confirm("로그인이 필요합니다.\n로그인 하시겠습니까?")) {
              return;
            }
            this.$root.redirectToLoginUrl();
            return;
          } else {
            this.$router.push("/friends/list");
            this.$router.go();
          }

          break;

        case 8:
          this.$router.push("/notice");
          this.$router.go();
          break;

        case 9:
          this.$router.push("/event");
          this.$router.go();
          break;

        case 10:
          this.$router.push("/support");
          this.$router.go();
          break;

        case 11:
          this.$router.push("/mypage");
          this.$router.go();
          break;

        case 12:
          this.$router.go();
          break;
      }
    },
    isMenuActive(key) {
      if (key === "mypage") {
        if (this.$root.isLoggedIn()) {
          return true;
        }
      } else {
        if (Object.keys(this.menu[key].children).length > 1) {
          return true;
        }
      }

      return false;
    },

    moveToMypage() {
      this.isAccountMenuVisible = false;

      if (this.isCurrentPath("/mypage/register-nickname")) {
        alert("닉네임을 먼저 설정해주세요.");
      } else {
        this.$router.push("/mypage");
      }
    },

    menuOver() {
      if (!this.isPreventedMouseOver) {
        this.isMenuOver = true;
      }
    },

    menuOut() {
      this.isMenuOver = false;
    },

    hideMenu() {
      const self = this;

      self.isPreventedMouseOver = true;
      self.isMenuOver = false;

      setTimeout(() => {
        self.isPreventedMouseOver = false;
      }, 500);
    },

    showServices() {
      this.isServicesVisible = !this.isServicesVisible;

      if (this.isAccountMenuVisible) {
        this.isAccountMenuVisible = false;
      }
    },

    showAccountMenu() {
      this.isAccountMenuVisible = !this.isAccountMenuVisible;

      if (this.isServicesVisible) {
        this.isServicesVisible = false;
      }
    },

    logout() {
      this.$router.push("/");
      this.$root.logout();
    },

    isCurrentPath(path) {
      let currentPath = this.$route.path;

      if (
        currentPath !== "/" &&
        currentPath.charAt(currentPath.length - 1) === "/"
      ) {
        currentPath = currentPath.substring(0, currentPath.length - 1);
      }

      return currentPath === path;
    },

    isCurrentPage(page) {
      const regexp = new RegExp(/^[/]([^/]*)/),
        firstPart = regexp.exec(this.$route.path);

      if (firstPart) {
        return firstPart[1] === page;
      }

      return false;
    }
  },

  mounted() {
    this.$nextTick(function() {
      /*================================
        sidebar collapsing
        ==================================*/
      $(".js-btn-toggle").on('click', function() {
          if ($('#app').hasClass('is-sidebar-on')) {
              $('#app').removeClass('is-sidebar-on');
          } else {
              $('#app').addClass('is-sidebar-on');
          }
      });

      /*================================
        Start Footer resizer
        ==================================*/
      // var e = function() {
      //     var e = (window.innerHeight > 0 ? window.innerHeight : this.screen.height) - 5;
      //     (e -= 67) < 1 && (e = 1), e > 67 && $(".main-content").css("min-height", e + "px")
      // };
      // $(window).ready(e), $(window).on("resize", e);

      /*================================
        sidebar menu
        ==================================*/
      $("#menu").metisMenu();

      /*================================
        slimscroll activation
        ==================================*/
      // $('.menu-inner').slimScroll({
      //     height: 'auto'
      // });
      // $('.nofity-list').slimScroll({
      //     height: '435px'
      // });
      // $('.timeline-area').slimScroll({
      //     height: '500px'
      // });
      // $('.recent-activity').slimScroll({
      //     height: 'calc(100vh - 114px)'
      // });
      // $('.settings-list').slimScroll({
      //     height: 'calc(100vh - 158px)'
      // });

      /*================================
        stickey Header
        ==================================*/
      $(window).on("scroll", function() {
        var scroll = $(window).scrollTop(),
          mainHeader = $("#sticky-header"),
          mainHeaderHeight = mainHeader.innerHeight();

        // console.log(mainHeader.innerHeight());
        if (scroll > 1) {
          $("#sticky-header").addClass("sticky-menu");
        } else {
          $("#sticky-header").removeClass("sticky-menu");
        }
      });

      /*================================
        form bootstrap validation
        ==================================*/
      $('[data-toggle="popover"]').popover();

      /*------------- Start form Validation -------------*/
      window.addEventListener(
        "load",
        function() {
          // Fetch all the forms we want to apply custom Bootstrap validation styles to
          var forms = document.getElementsByClassName("needs-validation");
          // Loop over them and prevent submission
          var validation = Array.prototype.filter.call(forms, function(form) {
            form.addEventListener(
              "submit",
              function(event) {
                if (form.checkValidity() === false) {
                  event.preventDefault();
                  event.stopPropagation();
                }
                form.classList.add("was-validated");
              },
              false
            );
          });
        },
        false
      );

      /*================================
        datatable active
        ==================================*/
      if ($("#dataTable").length) {
        $("#dataTable").DataTable({
          responsive: true
        });
      }
      if ($("#dataTable2").length) {
        $("#dataTable2").DataTable({
          responsive: true
        });
      }
      if ($("#dataTable3").length) {
        $("#dataTable3").DataTable({
          responsive: true
        });
      }

      /*================================
        Slicknav mobile menu
        ==================================*/
      $("ul#nav_menu").slicknav({
        prependTo: "#mobile_menu"
      });

      /*================================
        login form
        ==================================*/
      $(".form-gp input").on("focus", function() {
        $(this)
          .parent(".form-gp")
          .addClass("focused");
      });
      $(".form-gp input").on("focusout", function() {
        if ($(this).val().length === 0) {
          $(this)
            .parent(".form-gp")
            .removeClass("focused");
        }
      });

      /*================================
        slider-area background setting
        ==================================*/
      $(".settings-btn, .offset-close").on("click", function() {
        $(".offset-area").toggleClass("show_hide");
        $(".settings-btn").toggleClass("active");
      });

      /*================================
        Owl Carousel
        ==================================*/
      function slider_area() {
        var owl = $(".testimonial-carousel").owlCarousel({
          margin: 50,
          loop: true,
          autoplay: false,
          nav: false,
          dots: true,
          responsive: {
            0: {
              items: 1
            },
            450: {
              items: 1
            },
            768: {
              items: 2
            },
            1000: {
              items: 2
            },
            1360: {
              items: 1
            },
            1600: {
              items: 2
            }
          }
        });
      }
      slider_area();

      /*================================
        Fullscreen Page
        ==================================*/

      if ($("#full-view").length) {
        var requestFullscreen = function(ele) {
          if (ele.requestFullscreen) {
            ele.requestFullscreen();
          } else if (ele.webkitRequestFullscreen) {
            ele.webkitRequestFullscreen();
          } else if (ele.mozRequestFullScreen) {
            ele.mozRequestFullScreen();
          } else if (ele.msRequestFullscreen) {
            ele.msRequestFullscreen();
          } else {
            console.log("Fullscreen API is not supported.");
          }
        };

        var exitFullscreen = function() {
          if (document.exitFullscreen) {
            document.exitFullscreen();
          } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
          } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
          } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
          } else {
            console.log("Fullscreen API is not supported.");
          }
        };

        var fsDocButton = document.getElementById("full-view");
        var fsExitDocButton = document.getElementById("full-view-exit");

        fsDocButton.addEventListener("click", function(e) {
          e.preventDefault();
          requestFullscreen(document.documentElement);
          $("body").addClass("expanded");
        });

        fsExitDocButton.addEventListener("click", function(e) {
          e.preventDefault();
          exitFullscreen();
          $("body").removeClass("expanded");
        });
      }
      //패밀리사이트
      // $('.footer_family_wrap').hide();
      //   $('.footer_family_btn a').click(function(){
      //       $('.footer_family_wrap').slideToggle(200, function(){
      //           if($(this).is(':hidden')) $('.footer_family_btn a').removeClass('on');
      //           else $('.footer_family_btn a').addClass('on');
      //       });
      //   });
    });
  },
  created() {
    console.log(this.$root.user);
    Kakao.init(this.$WebConfig.kakaoAuthKey.key);
  }
};
</script>
<style>
.routerArea {
  position: relative;
  display: block;
  color: #222;
  font-size: 18px;
  text-transform: capitalize;
  padding: 15px 15px;
  letter-spacing: 0;
  font-weight: 400;
  width: 100%;
  text-align: left;
  border-style: 1px solid #eee;
  background: #eee;
}
.mypageside {
  text-align: center;
  color: #0068b7;
  padding: 20px 0;
  display: block;
  font-weight: bold;
  display: inline-block;
  font: normal normal normal 14px/1 FontAwesome;
  font-size: inherit;
  text-rendering: auto;
  -webkit-font-smoothing: antialiased;
}
</style>
<style scoped>

</style>

