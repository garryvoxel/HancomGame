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
                                <i class="ti-control-play"></i> 두더지게임 문제관리
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
                                <th>검색조건</th>
                                <td class="text-left">
                                    <div class="form-row align-items-center">
                                        <div class="col-sm-4">
                                            <div class="input-group">
                                                <input
                                                    type="text"
                                                    class="form-control"
                                                    id
                                                    placeholder
                                                >
                                            </div>
                                        </div>
                                        <div class="col-auto">
                                            <button type="submit" class="btn btn-warning">검색</button>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div class="row mt-3">
                <!-- data table start -->
                <div class="col-12 mt-5">
                    <div class="data-tables">
                        <div class="row">
                            <div class="col-md-6 pull-left">전체 :
                                <span class="fc_y">300</span>
                            </div>
                            <div class="col-md-6">
                                <select
                                    class="custom-select custom-select-sm form-control form-control-sm pull-right"
                                    style="width:100px;"
                                >
                                    <option value="10">10</option>
                                    <option value="25">25</option>
                                    <option value="50">50</option>
                                    <option value="100">100</option>
                                </select>
                            </div>
                        </div>
                        <div class="tablewrap mt-2">
                            <table class="tbsty01 text-center">
                                <colgroup>
                                    <col width="50">
                                    <col width="120">
                                    <col width="*">
                                    <col width="*">
                                    <col width="*">
                                    <col width="120">
                                </colgroup>
                                <thead>
                                    <tr>
                                        <th>
                                            <span>
                                                <input type="checkbox">
                                            </span>
                                        </th>
                                        <th>
                                            <span>No
                                                <i class="ti-exchange-vertical"></i>
                                            </span>
                                        </th>
                                        <th>
                                            <span>글자판종류
                                                <i class="ti-exchange-vertical"></i>
                                            </span>
                                        </th>
                                        <th>
                                            <span>난이도
                                                <i class="ti-exchange-vertical"></i>
                                            </span>
                                        </th>
                                        <th>
                                            <span>단어
                                                <i class="ti-exchange-vertical"></i>
                                            </span>
                                        </th>
                                        <th>
                                            <span>수정
                                                <i class="ti-exchange-vertical"></i>
                                            </span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>
                                            <span>
                                                <input type="checkbox">
                                            </span>
                                        </td>
                                        <td>1</td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td>
                                            <button
                                                type="submit"
                                                class="btn btn-xs btn-flat btn-success"
                                            >수정하기</button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div class="mt-1 text-left">
                            <button
                                type="submit"
                                class="btn btn-sm btn-flat btn-outline-success pull-left"
                            >선택항목 삭제</button>
                        </div>
                        <div class="paging">
                            <a href class="prev">이전</a>
                            <strong>1</strong>
                            <a href>2</a>
                            <a href>3</a>
                            <a href>4</a>
                            <a href>5</a>
                            <a href>6</a>
                            <a href>7</a>
                            <a href>8</a>
                            <a href>9</a>
                            <a href>10</a>
                            <a href class="next">다음</a>
                        </div>
                    </div>
                </div>
                <!-- data table end -->
                <div class="col-12 text-center mt-5">
                    <button type="submit" class="btn btn-flat btn-dark">엑셀등록</button>
                    <button type="submit" class="btn btn-flat btn-success">한글글쇠등록</button>
                    <button type="submit" class="btn btn-flat btn-success">영어글쇠등록</button>
                </div>
            </div>
            <!-- 두더지게임  한글낱말등록 시작-->
            <div class="spage-title-area">
                <div class="row align-items-center">
                    <div class="col-sm-12">
                        <div class="breadcrumbs-area clearfix">
                            <h4 class="spage-title pull-left">
                                <i class="ti-control-play"></i> 한글낱말등록
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
                                <th>난이도설정</th>
                                <td class="text-left">
                                    <div class="form-row align-items-center">
                                        <div class="col-sm-2">
                                            <select class="form-control" name>
                                                <option value>전체</option>
                                                <option value>전체</option>
                                                <option value>전체</option>
                                            </select>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <th>낱말텍스트</th>
                                <td class="text-left">
                                    <ul class="txt-cont">
                                        <li class="col-sm-3">
                                            <input type="text" class="form-control" id placeholder>
                                        </li>
                                        <li class="col-sm-3">
                                            <input type="text" class="form-control" id placeholder>
                                        </li>
                                        <li class="col-sm-3">
                                            <input type="text" class="form-control" id placeholder>
                                        </li>
                                        <li class="col-sm-3">
                                            <input type="text" class="form-control" id placeholder>
                                        </li>
                                        <li class="col-sm-3">
                                            <input type="text" class="form-control" id placeholder>
                                        </li>
                                    </ul>
                                    <div class="pl-1 text-left mt-3">
                                        <button
                                            type="submit"
                                            class="btn btn-flat btn-warning"
                                        >입력 항목추가</button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div class="col-12 text-center mt-5">
                <button type="submit" class="btn btn-flat btn-success">등록</button>
            </div>
            <!-- 두더지게임  한글낱말등록 끝-->
        </div>
    </div>
</template>

<script>
import HeaderArea from "@/components/HeaderArea.vue";
import FavorZone from "@/components/FavorZone.vue";
import PageTitleArea from "@/components/PageTitleArea.vue";

export default {
    name: "catchingMole",
    components: {
        "header-area": HeaderArea,
        "favor-zone": FavorZone,
        "page-title-area": PageTitleArea
    },
    methods: {
        updateFavor(){
            this.$refs.favor_zone.updateFavorZone();
        },
        goToArticleCsvUpload(){
            window.location.href='/typing/content/typing/article_csvupload'
        }
    }
}
</script>