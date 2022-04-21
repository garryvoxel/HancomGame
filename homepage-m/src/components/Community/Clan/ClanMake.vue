<template>
    <div class="page-container">
        <div class="page-wrapper page-community clan">
            <Header/>
            <SideMenu />
            <section class="main-content">
                <header class="page-header">
                    <h1 class="page-title">클랜</h1>
                </header>
                <div class="sub-wrap p-3">
                    <ul class="nav-tabs1">
                        <li>
                            <div><router-link style="color : black;" to="/clan">전체클랜</router-link></div>
                        </li>
                        <li>
                            <div><router-link style="color : black;" to="/clan/my"> 내 클랜</router-link></div>
                        </li>
                        <li class="current">
                            <div><router-link to="/clan/make">클랜만들기</router-link></div>
                        </li>
                    </ul>
                    <div class="clanmake" >
                        <div v-if="this.clanCheck === false">
                            <table class="tbs02 mt-2" style="width:100%;" >
                                <colgroup>
                                    <col width="20%">
                                    <col width="*">
                                </colgroup>
                                <tbody>
                                    <tr>
                                        <th class="tit">클랜이름</th>
                                        <td class="ta_l">
                                            <input type="text" name="" v-model="makeInfo.clanName" style="width:100%;">
                                        </td>
                                    </tr>
                                    <tr>
                                        <th class="tit">클랜소개</th>
                                        <td class="ta_l">
                                            <textarea name="name" rows="8" v-model="makeInfo.clanText" style="width:100%;"></textarea>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <div class="col-12 mt-2 text-center">
                                <button class="btn btn-dark btn-xs" @click="makeClan">클랜 만들기</button>
                                <button class="btn btn-dark btn-xs" @click="cancle">취소</button>
                            </div>
                        </div>
                        <div v-else>
                            클랜은 1개이상 보유 혹은 가입할 수 없습니다.<br>
                            활동중인 클랜을 확인하세요.
                        </div>
                    </div>
                </div>
            </section>
            <Footer/>
        </div>
    </div>
</template>

<script>
import Header from '@/components/Header.vue'
import SideMenu from '@/components/SideMenu.vue'
import Footer from '@/components/Footer.vue'
import moment from "moment";
import Result from "@/utils/result";

export default {
    
    data() {
        return{
        myclan : [],
        clanCheck : false,
        totalCount : 0,
        makeInfo:{
            clanName:'',
            clanText:''
        }
        }
    },

    components: {
        Header,
        SideMenu,
        Footer,
    },

    methods:{
        cancle()
        {
            this.$router.push("/clan");
        },
        
        makeClan()
        {
            if(this.makeInfo.clanName == '')
            {
                alert("클랜 이름을 입력해 주세요.");
                return
            }
           console.log(this.makeInfo.clanName);
           console.log(this.makeInfo.clanText);
           this.$axios
           .post(this.$Api2.clans.makeClan,
           {sessionid : this.$root.sessionId(), clanname : this.makeInfo.clanName, desc : this.makeInfo.clanText})
           .then(response => {
               console.log(response.data);
           
            if(response.data.result == 9181)
            {
                alert("이미 클랜이 있습니다");
                return;
            }
            if(response.data.result == 9186)
            {
                alert("클랜 소개 내용은 40자를 넘어갈 수 없습니다.");
                return;
            }
            if(response.data.result == 10303)
            {
                alert(response.data.word + "은(는) 사용할 수 없습니다.\n올바르게 수정 후 다시 등록해주세요.");
                return;
            }
            if(response.data.result == 10304)
            {
                alert("특수문자는 사용할 수 없습니다.")
            }
            this.$router.push({ name: "clantotal" });
            if (!response || response.data.code != 1) {
                console.log(this.makeInfo.clanText);
                return
            }
            console.log("bb");
            this.$router.go();
                
        })
        .catch(error => {
            console.error(error)
        })
      },
      loadClanInfo()
      {
        this.$axios
        .post(this.$Api2.clans.getMyClan,
        { sessionid : this.$root.sessionId()})
        .then(response => {
                
            this.myclan = response.data;
       

            this.clanCheck =true;
            this.postAllClan();
            if(this.myclan.MyClanInfo == null)
            {
                this.clanCheck =false;
            }
            if (!response || response.data.code != 1) {
               
                return
            }

        })
        .catch(error => {
             this.clanCheck =false;
            console.error(error)
        })
      },
      postAllClan()
    {
        this.$axios
        .post(this.$Api2.clans.getClans,
        {   sessionid : this.$root.sessionId()  })
        .then(response => {
            
            
            this.totalCount = response.data.TotalCount;

            
            if (!response || response.data.code != 1) {
                return
            }
                
        })
        .catch(error => {
            console.error(error)
        })
    

    },
      
    },
    created()
    {
        this.loadClanInfo();
        this.postAllClan();
    }
}
    

</script>

