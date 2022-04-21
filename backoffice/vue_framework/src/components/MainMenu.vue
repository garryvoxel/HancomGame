<template>
    <div class="sidebar-menu">
        <div class="sidebar-header">
            <div class="logo">
                <a href=""><img src="/typing/static/images/ad_logo.png" alt="logo"></a>
            </div>
        </div>

        <div class="main-menu">
            <div class="menu-inner">
                <nav>
                    <ul class="metismenu" id="menu">
                        <li v-for="(parent, parentKey) in menu" :key="parent.id" v-bind:class="[isCurrentSubject(parent.uri) ? 'active' : '']">
                            <a href="javascript:void(0)" aria-expanded="true"><i :class=parent.css></i><span>{{ parent.name }}</span></a>
                            <ul class="collapse">
                                <li v-for="(child, key) in parent.children" :key="child.id" 
                                    v-bind:class="[ isCurrentSubPage(parent.uri, child.uri) ? 'active' : '']"
                                ><a :href=child.uri>{{ child.name }}</a></li>
                            </ul>
                        </li>
                    </ul>
                </nav>
                <div class="text-white text-right float-right mt-3 mr-1" role="button"> <span class="p-2"  style="background-color:#888;cursor: pointer" @click="menuHide()">《 </span></div>
            </div>
        </div>
    </div>    
</template>

<script>
export default {
    data(){
        return {
            menu: this.$root.menu
        }
    },
    methods: {
        isCurrentSubPage(subject, subpage) {
            // 페이지 주소가 모두 일치할때만 하면 너무 많은 메뉴가 생겨야 함. 2 depth 까지만 봄.
            //return this.$route.path === page;

            // subject 가 동일하고
            // 이 subject 의 차일드가 1개이면 true
            let hasOneChildMenuArray = ['/ad','/member','/point','/managers'];
            if(this.isCurrentSubject(subject) && hasOneChildMenuArray.indexOf(subject) >= 0) return true;

            // 아니라면 2차 subpage 까지 봄.
            // uri /typing 서브폴더 추가로 3차를 봄
            const
            pathUriArray = this.$route.path.split('/'),
            subpageUriArray = subpage.split('/');            

            //if(pathUriArray[1]+pathUriArray[2]  == subpageUriArray[1]+subpageUriArray[2]) return true;
            if(pathUriArray[2]+pathUriArray[3]  == subpageUriArray[2]+subpageUriArray[3]) return true;
            else return false;

        },
        isCurrentSubject(subject) {
            const regexp = new RegExp(/^[/]([^/]*)[/]([^/]*)/),
                firstPart = regexp.exec(this.$route.path);
                //alert(firstPart[0] + " == "+'/typing'+subject);
            if (firstPart) {
                return firstPart[0] === '/typing'+subject;
            }
            return false;
        },
        menuHide(){
            //$(".sidebar-menu").css("left", '0');
            //$(".sidebar-menu").css("width", '0%');
            window.location.reload();
        }
    },
    mounted() {
        this.$nextTick(() => {
            $('#menu').metisMenu();

            $('.menu-inner').slimScroll({
                height: 'auto'
            });
            $('.nofity-list').slimScroll({
                height: '435px'
            });
            $('.timeline-area').slimScroll({
                height: '500px'
            });
            $('.recent-activity').slimScroll({
                height: 'calc(100vh - 114px)'
            });
            $('.settings-list').slimScroll({
                height: 'calc(100vh - 158px)'
            });    
        });
    }

}
</script>