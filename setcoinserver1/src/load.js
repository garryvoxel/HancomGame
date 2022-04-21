//load word
/*
    파일명: setcoinserver1/src/load.js
    일반 단어들 묶음 로드
    콤보 공격 타입 3 단어들 로드
    콤보 공격 타입 4 단어들 로드
    콤보 공격 타입 5 단어들 로드
    콤보 공격 타입 6 단어들 로드
*/
const fs = require('fs');

var word_data = [];

var word_1_data = [];
var word_2_data = [];
var word_3_data = [];
var word_4_data = [];
var word_5_data = [];
var word_6_data = [];

var combo_attack_word_3 = [];
var combo_attack_word_4 = [];
var combo_attack_word_5 = [];
var combo_attack_word_6 = [];

/*exports.load_word = function(dir,filename){
    var data = fs.readFileSync(dir+filename,'utf8');
    const lines = data.toString().split("\n");
    console.log("length : "+data.length);
    for( i in lines){
        if( lines[i] === "") continue;
        var _ww=lines[i].replace(/[\r\n]/g,'');
        word_data.push(_ww);
    }
}*/


/*
json파일에서 문자열 데이터 불러오기
 */
function load_word_data(dir,filename,w_data){
    const lines = require(dir+filename);
    for( i in lines){
        if( lines[i] === "") continue;
        var _ww=lines[i].replace(/[\r\n]/g,'');
        w_data.push(_ww);
    }
}


/*
콤보 공격 타입 3번재 단어들 셔플
 */
exports.word_shuffle_combo_attack_word_type_3 = function(){
    var j, temp = null;

    for( var i=combo_attack_word_3.length - 1; i > 0; i -=1 ){
        j = Math.floor(Math.random() * (i+1));
        temp = combo_attack_word_3[i];
        combo_attack_word_3[i] = combo_attack_word_3[j];
        combo_attack_word_3[j] = temp;
    }
}

/**
 * 콤보 공격 타입 4번재 단어들 셔플
 */
exports.word_shuffle_combo_attack_word_type_4 = function(){
    var j, temp = null;

    for( var i=combo_attack_word_4.length - 1; i > 0; i -=1 ){
        j = Math.floor(Math.random() * (i+1));
        temp = combo_attack_word_4[i];
        combo_attack_word_4[i] = combo_attack_word_4[j];
        combo_attack_word_4[j] = temp;
    }
}

/**
 * 콤보 공격 타입 5번재 단어들 셔플
 */
exports.word_shuffle_combo_attack_word_type_5 = function(){
    var j, temp = null;

    for( var i=combo_attack_word_5.length - 1; i > 0; i -=1 ){
        j = Math.floor(Math.random() * (i+1));
        temp = combo_attack_word_5[i];
        combo_attack_word_5[i] = combo_attack_word_5[j];
        combo_attack_word_5[j] = temp;
    }
}

/**
 * 콤보 공격 타입 6번재 단어들 셔플
 */
exports.word_shuffle_combo_attack_word_type_6 = function(){
    var j, temp = null;

    for( var i=combo_attack_word_6.length - 1; i > 0; i -=1 ){
        j = Math.floor(Math.random() * (i+1));
        temp = combo_attack_word_6[i];
        combo_attack_word_6[i] = combo_attack_word_6[j];
        combo_attack_word_6[j] = temp;
    }
}

/**
 * 일반 단어 1음절 단어들 셔플
 */
exports.normal_1_word_shuffle = function(){
    var j, temp = null;

    for( var i=word_1_data.length - 1; i > 0; i -=1 ){
        j = Math.floor(Math.random() * (i+1));
        temp = word_1_data[i];
        word_1_data[i] = word_1_data[j];
        word_1_data[j] = temp;
    }
}

/**
 * 일반 단어 2음절 단어들 셔플
 */
exports.normal_2_word_shuffle = function(){
    var j, temp = null;

    for( var i=word_2_data.length - 1; i > 0; i -=1 ){
        j = Math.floor(Math.random() * (i+1));
        temp = word_2_data[i];
        word_2_data[i] = word_2_data[j];
        word_2_data[j] = temp;
    }
}

/**
 * 일반 단어 3음절 단어들 셔플
 */
exports.normal_3_word_shuffle = function(){
    var j, temp = null;

    for( var i=word_3_data.length - 1; i > 0; i -=1 ){
        j = Math.floor(Math.random() * (i+1));
        temp = word_3_data[i];
        word_3_data[i] = word_3_data[j];
        word_3_data[j] = temp;
    }
}

/**
 * 일반 단어 4음절 단어들 셔플
 */
exports.normal_4_word_shuffle = function(){
    var j, temp = null;

    for( var i=word_4_data.length - 1; i > 0; i -=1 ){
        j = Math.floor(Math.random() * (i+1));
        temp = word_4_data[i];
        word_4_data[i] = word_4_data[j];
        word_4_data[j] = temp;
    }
}

/**
 * 일반 단어 5음절 단어들 셔플
 */
exports.normal_5_word_shuffle = function(){
    var j, temp = null;

    for( var i=word_5_data.length - 1; i > 0; i -=1 ){
        j = Math.floor(Math.random() * (i+1));
        temp = word_5_data[i];
        word_5_data[i] = word_5_data[j];
        word_5_data[j] = temp;
    }
}

/**
 * 일반 단어 6음절 단어들 셔플
 */
exports.normal_6_word_shuffle = function(){
    var j, temp = null;

    for( var i=word_6_data.length - 1; i > 0; i -=1 ){
        j = Math.floor(Math.random() * (i+1));
        temp = word_6_data[i];
        word_6_data[i] = word_6_data[j];
        word_6_data[j] = temp;
    }
}




/*exports.getwords = function(count){    
    var _temp = [];
    for( var i =0; i<count; i++){
        if(word_data[i] != undefined && word_data[i] != ""){
        _temp.push(word_data[i]);
        }
    }
     console.log(_temp);
return _temp;
}*/
//지정된 카운트개수만큼 콤보 공격 타입 3번재 단어들 얻기
exports.getcombo_attack_word_type3 = function(count){
    var _temp = [];
    for( var i =0; i<count; i++){
        _temp.push(combo_attack_word_3[i]);
    }
     return _temp;
}
//지정된 카운트개수만큼 콤보 공격 타입 4번재 단어들 얻기
exports.getcombo_attack_word_type4 = function(count){
    var _temp = [];
    for( var i =0; i<count; i++){
        _temp.push(combo_attack_word_4[i]);
    }
     return _temp;
}
//지정된 카운트개수만큼 콤보 공격 타입 5번재 단어들 얻기
exports.getcombo_attack_word_type5 = function(count){
    var _temp = [];
    for( var i =0; i<count; i++){
        _temp.push(combo_attack_word_5[i]);
    }
     return _temp;
}
//지정된 카운트개수만큼 콤보 공격 타입 6번재 단어들 얻기
exports.getcombo_attack_word_type6 = function(count){
    var _temp = [];
    for( var i =0; i<count; i++){
        _temp.push(combo_attack_word_6[i]);
    }
     return _temp;
}
//지정된 카운트개수만큼 일반 1음절단어들 얻기
exports.getNormal_1_word = function(count){
    var _temp = [];
    for( var i =0; i<count&&i<word_1_data.length; i++){
        _temp.push(word_1_data[i]);
    }
     return _temp;
}
//지정된 카운트개수만큼 일반 2음절단어들 얻기
exports.getNormal_2_word = function(count){
    var _temp = [];
    for( var i =0; i<count &&i<word_2_data.length; i++){
        _temp.push(word_2_data[i]);
    }
     return _temp;
}
//지정된 카운트개수만큼 일반 3음절단어들 얻기
exports.getNormal_3_word = function(count){
    var _temp = [];
    for( var i =0; i<count&&i<word_3_data.length; i++){
        _temp.push(word_3_data[i]);
    }
     return _temp;
}
//지정된 카운트개수만큼 일반 4음절단어들 얻기
exports.getNormal_4_word = function(count){
    var _temp = [];
    for( var i =0; i<count && i<word_4_data.length; i++){
        _temp.push(word_4_data[i]);
    }
     return _temp;
}
//지정된 카운트개수만큼 일반 5음절단어들 얻기
exports.getNormal_5_word = function(count){
    var _temp = [];
    for( var i =0; i<count &&i<word_5_data.length; i++){
        _temp.push(word_5_data[i]);
    }
    return _temp;
}
//지정된 카운트개수만큼 일반 6음절단어들 얻기
exports.getNormal_6_word = function(count){
    var _temp = [];
    for( var i =0; i<count && i<word_6_data.length; i++){
        _temp.push(word_6_data[i]);
    }
    return _temp;
}

exports.load_word = function(dir){
    load_word_data(dir,'1_word.json',word_1_data);
    load_word_data(dir,'2_word.json',word_2_data);
    load_word_data(dir,'3_word.json',word_3_data);
    load_word_data(dir,'4_word.json',word_4_data);
    load_word_data(dir,'5_word.json',word_5_data);
    load_word_data(dir,'6_word.json',word_6_data);
    load_word_data(dir,'6_arithmetic.json',combo_attack_word_3);
    load_word_data(dir,'8_arithmetic.json',combo_attack_word_4);
    load_word_data(dir,'12_arithmetic.json',combo_attack_word_5);
    load_word_data(dir,'16_arithmetic.json',combo_attack_word_6);
}