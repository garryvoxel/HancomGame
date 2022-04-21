<template>
    <div class="main-content">
        <!-- header area start -->
        <header-area/>
        <favor-zone ref="favor_zone"/>
        <!-- header area end -->
        <div class="main-content-inner">
            <!-- page title area start -->
            <page-title-area/>
            <!-- page title area end -->
            <!-- search area start -->
            <div class="spage-title-area">
                <div class="row align-items-center">
                    <div class="col-sm-12">
                        <div class="breadcrumbs-area clearfix">
                            <h4 class="spage-title pull-left">
                                <i class="ti-control-play"></i> 포인트 지급
                            </h4>
                        </div>
                    </div>
                </div>
            </div>
            <div class="data-tables">
                <div class="tablewrap2">
                    <table class="tbsty02 text-center">
                        <colgroup>
                            <col width="150">
                            <col width="*">
                        </colgroup>
                        <tbody>
                            <tr>
                                <th>지급대상<br>(개별 추가)</th>
                                <td class="text-left">
                                    <ul class="txt-cont">
                                        <li v-for="i in userCount" class="col-sm-3">
                                            <input type="text" class="form-control" v-model="userIds[i-1]" >
                                        </li>
                                    </ul>
                                    <div class="pl-1 text-left mt-3">
                                        <button
                                            type="submit"
                                            class="btn btn-flat btn-warning"
                                            data-toggle="modal"
                                            data-target="#exampleModalCenter"
                                        >회원 검색하여 추가</button>
                                    </div>

                                    <div
                                        class="modal fade"
                                        id="exampleModalCenter"
                                        aria-hidden="true"
                                        style="display: none;"
                                    >
                                        <div
                                            class="modal-dialog modal-dialog-centered"
                                            role="document"
                                        >
                                            <div class="modal-content">
                                                <div class="modal-header">
                                                    <input type="text" class="form-control"  v-model="nicknamekeyword" placeholder="닉네임 입력" style="margin-right:5px">
                                                    <button class="btn btn-flat" v-on:click.prevent="getUserList" style="margin-right:5px">검색</button>
                                                    <button class="btn btn-flat" v-on:click.prevent="clearUserList">취소</button>
                                                    <button
                                                        type="button"
                                                        class="close"
                                                        data-dismiss="modal"
                                                    >
                                                        <span>×</span>
                                                    </button>
                                                </div>
                                                <div class="modal-body" >
                                                    <div style="overflow:auto;max-height:300px;">
                                                        <table style="width:90%; ">
                                                            <colgroup>
                                                                <col width="80">
                                                                <col width="*">
                                                            </colgroup>
                                                            <thead>
                                                                <tr>
                                                                    <th>선택</th>
                                                                    <th>닉네임</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                <tr v-for="user in userListTemp">
                                                                    <td><input type="checkbox" :value="user.nickname" v-model="tempSelectedIds"></td>
                                                                    <td>{{user.nickname}}</td>
                                                                </tr>
                                                                <tr v-if="userListTemp.length === 0">
                                                                    <td colspan="2" class="clan-empty">검색된 닉네임이 없습니다.</td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                                <div class="modal-footer text-center">
                                                    <button
                                                        type="button"
                                                        class="btn btn-secondary"
                                                        data-dismiss="modal"
                                                        v-on:click="userListUpdate"
                                                    >대상추가</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </td>
                            </tr>
                            <tr>
                                <th>지급대상<br>(파일 업로드)</th>
                                <td class="text-left">
                                    <div class="col-sm-5">
                                        <div class="input-group mb-2">
                                            <div class="custom-file">
                                                <input
                                                    type="file"
                                                    class="custom-file-input"
                                                    id="inputGroupFile01"
                                                    ref="csvFile"
                                                    enctype="multipart/form-data"
                                                    v-on:change="handleFileUpload()"
                                                >
                                                <label
                                                    class="custom-file-label"
                                                    for="inputGroupFile01"
                                                    style="vertical-align:middle;"
                                                    id="file_label"
                                                >파일선택</label>
                                            </div>
                                        </div>
                                        <p>* 양식에 맞게 정리한 엑셀파일(UTF-8 인코딩된 .csv)을 등록해주세요.</p>
                                    </div>
                                </td>
                            </tr>                             
                            <tr>
                                <th>포인트 종류</th>
                                <td class="text-left">
                                    <select v-model="selectedPointType">
                                        <option v-for="type in pointType" v-bind:value="type.value">{{type.name}}</option>
                                    </select>
                                </td>
                            </tr>       
                            <tr>
                                <th>지급 포인트</th>
                                <td class="text-left">
                                    <input type="text" class="form-control col-sm-2" placeholder="포인트" v-model="pointAmount">
                                </td>
                            </tr>    
                            <tr>
                                <th>지급 내역</th>
                                <td class="text-left">
                                    <textarea class="form-control" v-model="description"></textarea>
                                </td>
                            </tr>                                                                           
                        </tbody>
                    </table>
                </div>
            </div>
            <div class="col-12 text-center mt-5">
                <button v-on:click="goToBack" class="btn btn-flat btn-dark">취소</button>
                <button v-on:click="doGivePoint" class="btn btn-flat btn-success">포인트 지급</button>
            </div>
        </div>
    </div>
</template>

<script>
import HeaderArea from "@/components/HeaderArea.vue";
import FavorZone from "@/components/FavorZone.vue";
import PageTitleArea from "@/components/PageTitleArea.vue";

import ResponseCode from "@/utils/response_code";

export default {
    name: "MonitoringSlangWrite",
    components: {
        "header-area": HeaderArea,
        "favor-zone": FavorZone,
        "page-title-area": PageTitleArea
    },
    data() {
        return{
            pointType: [
                {name: '포인트', value: 'point'},
            ],  
            selectedPointType: 'point',
            giveType : '+',
            pointAmount : 0,
            description: '',
            userCount : 0, 
            userIds: [],
            userIdNamesMap: {},
            nicknamekeyword: "",
            tempSelectedIds: [],
            userListTemp: {},
            csvFile: ''
        }
    },
    methods: {
        goToBack() {
            this.$router.go(-1);
        },
        addWordCount(){
            this.wordCount++;
        },
        doGivePoint(){

            if(this.userIds.length < 1 && this.csvFile == '' ) {alert('지급할 대상을 선택해 주세요'); return;}
            if(this.pointAmount < 1)  {alert('지급할 포인트를 입력해 주세요'); return;}
            if(confirm('등록한 유저에게 포인트를 지급 하시겠습니까?')){

                var data = new FormData();
                data.set('give_type', this.giveType)
                data.set('description', this.description)
                data.set('nicknames', this.userIds)
                data.set('point_amount', this.pointAmount)
                data.set('type', this.selectedPointType)
                data.append('csvfile',this.csvFile);

                this.$axios
                    .post('/typing/api/point/givepoint',
                    data,
                    {
                        headers: {
                            'content-type': 'multipart/form-data'
                        }
                    })
                .then(response => {
//
                    if (typeof response == "undefined") {
                        alert(
                            "서버와 통신이 원활하지 않습니다.\n잠시후 다시 시도해 주세요."
                        );
                        return;
                    } else {
                        switch (response.data.code) {
                            case ResponseCode.UNAUTHORIZED.code:
                                this.$root.deleteCookieNGoToLogin();
                                break;

                            case ResponseCode.NO_AUTHORITY.code:
                                alert('해당 페이지에 접근할 권한이 없습니다.');
                                return;
                                break;


                            case ResponseCode.PASSWORDEXPIRE.code:
                                alert('비밀번호 유효기간(180일)이 지났습니다.\n비밀번호를 변경해 주세요.');
                                window.location.href = "/typing/managers/pwmodifyforce";
                                return;
                                break;

                            case ResponseCode.NO_UTF8.code:
                                alert('업로드 하신 파일이 \'UTF-8\' 로 인코딩 되어 있지 않습니다.\n문서편집기에서 내용 작성후 저장하실때\n\'UTF-8\' 로 인코딩 설정해 저장하신후 다시 올려주시기 바랍니다. ');
                                break;

                            case ResponseCode.OK.code:
                                alert(JSON.stringify('포인트가 지급되었습니다.'));
                                window.location.href='/typing/point/point-management/list';
                                break;

                            default:
                                alert(
                                    "포인트 지급에 실패했습니다.\n다시 시도해 주세요.\n"
                                    +response.data.code+ "::" +response.data.message
                                );
                        } //switch

                    } //if else   
//
                })
                .catch(error=>{alert('Catch case: '+error.message);});                    
            }
        },
        getUserList(){
            if(this.nicknamekeyword === "") {
                alert('검색할 닉네임을 입력해 주세요');
                return;
            }
            let url =
                "/typing/api/users/list?count=100&page=1&fieldId=1&keyword=" + this.nicknamekeyword;

            this.$axios
                .get(url)
                .then(response=>{
//
                    if (typeof response == "undefined") {
                        alert(
                            "서버와 통신이 원활하지 않습니다.\n잠시후 다시 시도해 주세요."
                        );
                        return;
                    } else {
                        switch (response.data.code) {
                            case ResponseCode.UNAUTHORIZED.code:
                                this.$root.deleteCookieNGoToLogin();
                                break;

                            case ResponseCode.NO_AUTHORITY.code:
                                alert('해당 페이지에 접근할 권한이 없습니다.');
                                return;
                                break;
                                
                            case ResponseCode.PASSWORDEXPIRE.code:
                                return;
                                break;
                                                                
                            case ResponseCode.OK.code:
                                //alert(JSON.stringify(response.data.result));
                                this.userListTemp =           response.data.result.rows;
                                break;

                            default:
                                alert(
                                    "닉네임으로 검색결과를 가져오는데 실패 했습니다.\n다시 시도해 주세요.\n"
                                    +response.data.code+ "::" +response.data.message
                                );
                        } //switch

                    } //if else   
//
                })
                .catch(error=>{alert('Catch case: '+error.message);});
        },
        clearUserList(){
            this.nicknamekeyword='';
            this.userListTemp={};
            this.tempSelectedIds=[];
        },
        makeMap(value, name){
            //alert('우와');
            this.userIdNamesMap[value] = name;
            
        },
        matchMap(value){
            return this.userIdNamesMap[value];
        },
        userListUpdate(){
            //alert(this.tempSelectedIds);
            this.userIds = Array.concat(this.userIds, this.tempSelectedIds);
            this.userIds = Array.from(new Set(this.userIds));
            this.userCount = this.userIds.length;
            this.clearUserList();          
        },
        updateFavor(){
            this.$refs.favor_zone.updateFavorZone();
        },
        handleFileUpload(){

            //라벨 변경
            document.getElementById('file_label').innerHTML=document.getElementById('inputGroupFile01').value;

            this.csvFile = this.$refs.csvFile.files[0];
        }
    }
}
</script>