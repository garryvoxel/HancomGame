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
            <div class="spage-title-area" style="border-bottom: 2px #555 solid;">
                <div class="row align-items-center">
                    <div class="col-sm-12">
                        <div class="breadcrumbs-area clearfix">
                            <h4 class="spage-title pull-left"><i class="ti-control-play"></i> 한컴타자연습 문제관리</h4>
                        </div>
                    </div>
                </div>
            </div>
            <div class="mt-5">
                <ul class="nav nav-tabs" id="myTab" role="tablist">
                    <li class="nav-item">
                        <a class="nav-link active" id="home-tab" data-toggle="tab" href="#po-word" role="tab"  aria-selected="false">자리</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" id="profile-tab" data-toggle="tab" href="#hn-word" role="tab" aria-selected="false">낱말</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" id="profile-tab" data-toggle="tab" href="#sh-word" role="tab" aria-selected="false">짧은글</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" id="profile-tab" data-toggle="tab" href="#lg-word" role="tab" aria-selected="false">긴글</a>
                    </li>
                </ul>
                <div class="tab-content mt-3" id="myTabContent">
                    <div class="tab-pane fade active show" id="po-word" role="tabpanel" >
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
                                                <input type="text" class="form-control" id="" placeholder="">
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
                                <div class="col-md-6 pull-left">
                                    전체 : <span class="fc_y">300</span>
                                </div>
                                <div class="col-md-6">
                                    <select class="custom-select custom-select-sm form-control form-control-sm  pull-right" style="width:100px;">
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
                                    <col width="200">
                                    <col width="200">
                                    <col width="120">
                                    <col width="120">
                                    <col width="120">
                                    </colgroup>
                                    <thead>
                                        <tr>
                                            <th><span><input type="checkbox"></span></th>
                                            <th><span>No <i class="ti-exchange-vertical"></i></span></th>
                                            <th><span>글자판종류 <i class="ti-exchange-vertical"></i></span></th>
                                            <th><span>난이도<i class="ti-exchange-vertical"></i></span></th>
                                            <th><span>글쇠 <i class="ti-exchange-vertical"></i></span></th>
                                            <th><span>수정 <i class="ti-exchange-vertical"></i></span></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td><span><input type="checkbox"></span></td>
                                            <td>1</td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td><button type="submit" class="btn btn-xs btn-flat btn-success">수정하기</button></td>
                                        </tr>
                                    </tbody>
                                </table>
                                </div>
                                <div class="mt-1 text-left">
                                <button type="submit" class="btn btn-sm btn-flat btn-outline-success pull-left">선택항목 삭제</button>
                                </div>
                                <div class="paging">
                                    <a href="" class="prev">이전</a>
                                    <strong>1</strong>
                                    <a href=""> 2</a>
                                    <a href=""> 3</a>
                                    <a href=""> 4</a>
                                    <a href=""> 5</a>
                                    <a href=""> 6</a>
                                    <a href=""> 7</a>
                                    <a href=""> 8</a>
                                    <a href=""> 9</a>
                                    <a href=""> 10</a>
                                    <a href="" class="next">다음</a>
                                </div>
                            </div>
                        </div>
                        <!-- data table end -->
                        <div class="col-12 text-center mt-5">
                        <button type="submit" class="btn btn-flat btn-dark" v-on:click="goToArticleCsvUpload">엑셀등록</button> <button type="submit" class="btn btn-flat btn-success">한글글쇠등록</button> <button type="submit" class="btn btn-flat btn-success">영어글쇠등록</button>
                        </div>
                    </div>
                    <!-- 자리탭  한글글쇠등록 시작-->
                    <div class="spage-title-area">
                        <div class="row align-items-center">
                            <div class="col-sm-12">
                                <div class="breadcrumbs-area clearfix">
                                    <h4 class="spage-title pull-left"><i class="ti-control-play"></i> 한글글쇠등록</h4>
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
                                        <select class="form-control" name="">
                                            <option value="">전체</option>
                                            <option value="">전체</option>
                                            <option value="">전체</option>
                                        </select>
                                    </div>
                                    </div>
                                </td>
                                </tr>
                                <tr>
                                <th>낱말텍스트</th>
                                <td class="text-left">
                                    <ul class="txt-cont">
                                        <li class="col-sm-3"><input type="text" class="form-control" id="" placeholder=""></li>
                                        <li class="col-sm-3"><input type="text" class="form-control" id="" placeholder=""></li>
                                        <li class="col-sm-3"><input type="text" class="form-control" id="" placeholder=""></li>
                                        <li class="col-sm-3"><input type="text" class="form-control" id="" placeholder=""></li>
                                        <li class="col-sm-3"><input type="text" class="form-control" id="" placeholder=""></li>

                                    </ul>
                                    <div class="pl-1 text-left mt-3">
                                    <button type="submit" class="btn btn-flat btn-warning">입력 항목추가</button>
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
                    </div>
                    <div class="tab-pane fade " id="hn-word" role="tabpanel" >
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
                                                <input type="text" class="form-control" id="" placeholder="">
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
                                <div class="col-md-6 pull-left">
                                    전체 : <span class="fc_y">300</span>
                                </div>
                                <div class="col-md-6">
                                    <select class="custom-select custom-select-sm form-control form-control-sm  pull-right" style="width:100px;">
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
                                            <th><span><input type="checkbox"></span></th>
                                            <th><span>No <i class="ti-exchange-vertical"></i></span></th>
                                            <th><span>글자판종류 <i class="ti-exchange-vertical"></i></span></th>
                                            <th><span>난이도<i class="ti-exchange-vertical"></i></span></th>
                                            <th><span>낱말 <i class="ti-exchange-vertical"></i></span></th>
                                            <th><span>수정 <i class="ti-exchange-vertical"></i></span></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td><span><input type="checkbox"></span></td>
                                            <td>1</td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td><button type="submit" class="btn btn-xs btn-flat btn-success">수정하기</button></td>
                                        </tr>
                                    </tbody>
                                </table>
                                </div>
                                <div class="mt-1 text-left">
                                <button type="submit" class="btn btn-sm btn-flat btn-outline-success pull-left">선택항목 삭제</button>
                                </div>
                                <div class="paging">
                                    <a href="" class="prev">이전</a>
                                    <strong>1</strong>
                                    <a href=""> 2</a>
                                    <a href=""> 3</a>
                                    <a href=""> 4</a>
                                    <a href=""> 5</a>
                                    <a href=""> 6</a>
                                    <a href=""> 7</a>
                                    <a href=""> 8</a>
                                    <a href=""> 9</a>
                                    <a href=""> 10</a>
                                    <a href="" class="next">다음</a>
                                </div>
                            </div>
                        </div>
                        <!-- data table end -->
                        <div class="col-12 text-center mt-5">
                        <button type="submit" class="btn btn-flat btn-dark">엑셀등록</button> <button type="submit" class="btn btn-flat btn-success">한글낱말등록</button> <button type="submit" class="btn btn-flat btn-success">영어낱말등록</button>
                        </div>
                    </div>
                    <!-- 낱말탭  엑셀등록 시작-->
                    <div class="spage-title-area">
                        <div class="row align-items-center">
                            <div class="col-sm-12">
                                <div class="breadcrumbs-area clearfix">
                                    <h4 class="spage-title pull-left"><i class="ti-control-play"></i> 엑셀등록</h4>
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
                                <th>파일선택</th>
                                <td class="text-left">
                                    <div class=" col-sm-6">
                                    <div class="input-group mb-2">
                                        <div class="custom-file">
                                            <input type="file" class="custom-file-input" id="inputGroupFile01">
                                            <label class="custom-file-label" for="inputGroupFile01">파일선택</label>
                                        </div>
                                    </div>
                                    <p>* 양식에 맞게 정리한 엑셀파일을 등록해주세요.</p>
                                    </div>
                                </td>
                                </tr>
                            </tbody>
                        </table>
                        </div>
                    </div>
                    <div class="col-12 text-center mt-5">
                        <button type="submit" class="btn btn-flat btn-success">등록</button> <button type="submit" class="btn btn-flat btn-outline-success">엑셀양식다운로드</button>
                    </div>

                    <!-- 낱말탭  엑셀등록 끝-->
                    <!-- 낱말탭  한글낱말등록 시작-->
                    <div class="spage-title-area">
                        <div class="row align-items-center">
                            <div class="col-sm-12">
                                <div class="breadcrumbs-area clearfix">
                                    <h4 class="spage-title pull-left"><i class="ti-control-play"></i> 한글낱말등록</h4>
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
                                        <select class="form-control" name="">
                                            <option value="">전체</option>
                                            <option value="">전체</option>
                                            <option value="">전체</option>
                                        </select>
                                    </div>
                                    </div>
                                </td>
                                </tr>
                                <tr>
                                <th>낱말텍스트</th>
                                <td class="text-left">
                                    <ul class="txt-cont">
                                        <li class="col-sm-3"><input type="text" class="form-control" id="" placeholder=""></li>
                                        <li class="col-sm-3"><input type="text" class="form-control" id="" placeholder=""></li>
                                        <li class="col-sm-3"><input type="text" class="form-control" id="" placeholder=""></li>
                                        <li class="col-sm-3"><input type="text" class="form-control" id="" placeholder=""></li>
                                        <li class="col-sm-3"><input type="text" class="form-control" id="" placeholder=""></li>

                                    </ul>
                                    <div class="pl-1 text-left mt-3">
                                    <button type="submit" class="btn btn-flat btn-warning">입력 항목추가</button>
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
                    <!-- 낱말탭  한글낱말등록 끝-->
                    </div>
                    <div class="tab-pane fade " id="sh-word" role="tabpanel" >
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
                                                <input type="text" class="form-control" id="" placeholder="">
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
                                <div class="col-md-6 pull-left">
                                    전체 : <span class="fc_y">300</span>
                                </div>
                                <div class="col-md-6">
                                    <select class="custom-select custom-select-sm form-control form-control-sm  pull-right" style="width:100px;">
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
                                            <th><span><input type="checkbox"></span></th>
                                            <th><span>No <i class="ti-exchange-vertical"></i></span></th>
                                            <th><span>글자판종류 <i class="ti-exchange-vertical"></i></span></th>
                                            <th><span>난이도<i class="ti-exchange-vertical"></i></span></th>
                                            <th><span>짧은글 <i class="ti-exchange-vertical"></i></span></th>
                                            <th><span>수정 <i class="ti-exchange-vertical"></i></span></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td><span><input type="checkbox"></span></td>
                                            <td>1</td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td><button type="submit" class="btn btn-xs btn-flat btn-success">수정하기</button></td>
                                        </tr>
                                    </tbody>
                                </table>
                                </div>
                                <div class="mt-1 text-left">
                                <button type="submit" class="btn btn-sm btn-flat btn-outline-success pull-left">선택항목 삭제</button>
                                </div>
                                <div class="paging">
                                    <a href="" class="prev">이전</a>
                                    <strong>1</strong>
                                    <a href=""> 2</a>
                                    <a href=""> 3</a>
                                    <a href=""> 4</a>
                                    <a href=""> 5</a>
                                    <a href=""> 6</a>
                                    <a href=""> 7</a>
                                    <a href=""> 8</a>
                                    <a href=""> 9</a>
                                    <a href=""> 10</a>
                                    <a href="" class="next">다음</a>
                                </div>
                            </div>
                        </div>
                        <!-- data table end -->
                        <div class="col-12 text-center mt-5">
                        <button type="submit" class="btn btn-flat btn-dark">엑셀등록</button> <button type="submit" class="btn btn-flat btn-success">한글짧은글등록</button> <button type="submit" class="btn btn-flat btn-success">영어짧은글등록</button>
                        </div>
                    </div>
                    <!-- 짤은글탭  한글짧은글등록 시작-->
                    <div class="spage-title-area">
                        <div class="row align-items-center">
                            <div class="col-sm-12">
                                <div class="breadcrumbs-area clearfix">
                                    <h4 class="spage-title pull-left"><i class="ti-control-play"></i> 한글짧은글등록</h4>
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
                                        <select class="form-control" name="">
                                            <option value="">전체</option>
                                            <option value="">전체</option>
                                            <option value="">전체</option>
                                        </select>
                                    </div>
                                    </div>
                                </td>
                                </tr>
                                <tr>
                                <th>짧은글텍스트</th>
                                <td class="text-left">
                                    <ul class="txt-cont">
                                        <li class="col-sm-3"><input type="text" class="form-control" id="" placeholder=""></li>
                                        <li class="col-sm-3"><input type="text" class="form-control" id="" placeholder=""></li>
                                        <li class="col-sm-3"><input type="text" class="form-control" id="" placeholder=""></li>
                                        <li class="col-sm-3"><input type="text" class="form-control" id="" placeholder=""></li>
                                        <li class="col-sm-3"><input type="text" class="form-control" id="" placeholder=""></li>

                                    </ul>
                                    <div class="pl-1 text-left mt-3">
                                    <button type="submit" class="btn btn-flat btn-warning">입력 항목추가</button>
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
                    </div>
                    <div class="tab-pane fade " id="lg-word" role="tabpanel" >
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
                                                <input type="text" class="form-control" id="" placeholder="">
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
                                <div class="col-md-6 pull-left">
                                    전체 : <span class="fc_y">300</span>
                                </div>
                                <div class="col-md-6">
                                    <select class="custom-select custom-select-sm form-control form-control-sm  pull-right" style="width:100px;">
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
                                            <th><span><input type="checkbox"></span></th>
                                            <th><span>No <i class="ti-exchange-vertical"></i></span></th>
                                            <th><span>글자판종류 <i class="ti-exchange-vertical"></i></span></th>
                                            <th><span>난이도<i class="ti-exchange-vertical"></i></span></th>
                                            <th><span>긴글 <i class="ti-exchange-vertical"></i></span></th>
                                            <th><span>수정 <i class="ti-exchange-vertical"></i></span></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td><span><input type="checkbox"></span></td>
                                            <td>1</td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td><button type="submit" class="btn btn-xs btn-flat btn-success">수정하기</button></td>
                                        </tr>
                                    </tbody>
                                </table>
                                </div>
                                <div class="mt-1 text-left">
                                <button type="submit" class="btn btn-sm btn-flat btn-outline-success pull-left">선택항목 삭제</button>
                                </div>
                                <div class="paging">
                                    <a href="" class="prev">이전</a>
                                    <strong>1</strong>
                                    <a href=""> 2</a>
                                    <a href=""> 3</a>
                                    <a href=""> 4</a>
                                    <a href=""> 5</a>
                                    <a href=""> 6</a>
                                    <a href=""> 7</a>
                                    <a href=""> 8</a>
                                    <a href=""> 9</a>
                                    <a href=""> 10</a>
                                    <a href="" class="next">다음</a>
                                </div>
                            </div>
                        </div>
                        <!-- data table end -->
                        <div class="col-12 text-center mt-5">
                        <button type="submit" class="btn btn-flat btn-dark">엑셀등록</button> <button type="submit" class="btn btn-flat btn-success">한글긴글등록</button> <button type="submit" class="btn btn-flat btn-success">영어긴글등록</button>
                        </div>
                    </div>
                    <!-- 긴글탭  한글긴글등록 시작-->
                    <div class="spage-title-area">
                        <div class="row align-items-center">
                            <div class="col-sm-12">
                                <div class="breadcrumbs-area clearfix">
                                    <h4 class="spage-title pull-left"><i class="ti-control-play"></i> 한글긴글등록</h4>
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
                                <th>긴글텍스트</th>
                                <td class="text-left">
                                    <div class="col-sm-12">
                                        <div class="input-group">
                                            <textarea name="name" rows="8" class="form-control"></textarea>
                                        </div>
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
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import HeaderArea from "@/components/HeaderArea.vue";
import FavorZone from "@/components/FavorZone.vue";
import PageTitleArea from "@/components/PageTitleArea.vue";

export default {
    name: "eventList",
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