const WORD_LEVEL    = require('./../config/word_level_ctrl.json');
const TIME          = require('./../utils/time');
const gamecfg       = require('./../config/game.json');
const combo_attack_type = require('./../src/module/define').COMBO_ATTACK_TYPYE;

function isEmpty(param) {
    if (param === "" || param === null || param === undefined 
    || (param !== null && typeof param === "object" && !Object.keys(param).length))
        return true
    else
        return false
}

//룸번호 생성
function generateRoomNumber(length = 5) {
    var result = '';
    var characters       = '0123456789';   
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
     }
     return result;
}


/**
 * 난위도 1 레벨 음절 찾기
 */
function get_1_WordLevel() {
    let _r = TIME.getRandom();
    let _g1 = parseInt(WORD_LEVEL.LEVEL_1_1_WORD); //25%
    let _g2 = parseInt(WORD_LEVEL.LEVEL_1_2_WORD); //30%
    let _g3 = parseInt(WORD_LEVEL.LEVEL_1_3_WORD); //25%
    let _g4 = parseInt(WORD_LEVEL.LEVEL_1_4_WORD); //13%
    let _g5 = parseInt(WORD_LEVEL.LEVEL_1_5_WORD); //5%

    if((_r >= 0) && (_r <= _g1))  { //0 ~ 25%     
        return WORD_LEVEL.WORD_1;
    } else if((_r>_g1) &&(_r<= (_g1 + _g2))) { // 25% ~ 55%            
        return WORD_LEVEL.WORD_2;
    } else if((_r>(_g1+_g2)) &&(_r<= (_g1 + _g2 + _g3))) { // //55% ~ 80%
        return WORD_LEVEL.WORD_3;
    } else if((_r>(_g1+_g2+_g3)) &&(_r<= (_g1 + _g2 + _g3 + _g4))) {   //80% ~93%
        return WORD_LEVEL.WORD_4;
    } else if((_r>(_g1+_g2+_g3+_g4)) &&(_r<= (_g1 + _g2 + _g3 + _g4+_g5))) {  //93% ~98%
        return WORD_LEVEL.WORD_5;
    }

    return WORD_LEVEL.WORD_6;       
}

/**
 * 난위도 2 레벨 음절 찾기
 */
function get_2_WordLevel(){
    let _r = TIME.getRandom();
    let _g1 = parseInt(WORD_LEVEL.LEVEL_2_1_WORD); //15%
    let _g2 = parseInt(WORD_LEVEL.LEVEL_2_2_WORD); //30%
    let _g3 = parseInt(WORD_LEVEL.LEVEL_2_3_WORD); //25%
    let _g4 = parseInt(WORD_LEVEL.LEVEL_2_4_WORD); //17%
    let _g5 = parseInt(WORD_LEVEL.LEVEL_2_5_WORD); //8%

    if((_r>=0) &&(_r<= _g1)) { //0 ~ 15%     
        return WORD_LEVEL.WORD_1;
    } else if((_r>_g1) &&(_r<= (_g1 + _g2))) { //15% ~ 45%
        return WORD_LEVEL.WORD_2;
    } else if((_r>(_g1+_g2)) &&(_r<= (_g1 + _g2 + _g3))) { // 45% ~ 70%
        return WORD_LEVEL.WORD_3;
    } else if((_r>(_g1+_g2+_g3)) &&(_r<= (_g1 + _g2 + _g3 + _g4))) { // 70% ~ 87%
        return WORD_LEVEL.WORD_4;
    } else if((_r>(_g1+_g2+_g3+_g4)) &&(_r<= (_g1 + _g2 + _g3 + _g4+_g5))) { // 87% ~ 95%
        return WORD_LEVEL.WORD_5;
    }

    return WORD_LEVEL.WORD_6;       
}

/**
 * 난위도 3 레벨 음절 찾기
 */
function get_3_WordLevel(){
    let _r = TIME.getRandom();

    let _g1 = parseInt(WORD_LEVEL.LEVEL_3_1_WORD); //13%
    let _g2 = parseInt(WORD_LEVEL.LEVEL_3_2_WORD); //18%
    let _g3 = parseInt(WORD_LEVEL.LEVEL_3_3_WORD); //25%
    let _g4 = parseInt(WORD_LEVEL.LEVEL_3_4_WORD); //20%
    let _g5 = parseInt(WORD_LEVEL.LEVEL_3_5_WORD); //18%

    if((_r>=0) &&(_r<= _g1)) { //0 ~ 13%
        return WORD_LEVEL.WORD_1;       
    } else if((_r>_g1) &&(_r<= (_g1 + _g2))) { //13 ~ 31%
        return WORD_LEVEL.WORD_2;
    } else if((_r>(_g1+_g2)) &&(_r<= (_g1 + _g2 + _g3))) { //31% ~ 56%
        return WORD_LEVEL.WORD_3;
    } else if((_r>(_g1+_g2+_g3)) &&(_r<= (_g1 + _g2 + _g3 + _g4))) { // 56% ~ 76%
        return WORD_LEVEL.WORD_4;
    } else if((_r>(_g1+_g2+_g3+_g4)) &&(_r<= (_g1 + _g2 + _g3 + _g4+_g5))) { // 76% ~ 94%
        return WORD_LEVEL.WORD_5;
    }

    return WORD_LEVEL.WORD_6;       
}

/**
 * 난위도 4 레벨 음절 찾기
 */
function get_4_WordLevel(){
    let _r = TIME.getRandom();

    let _g1 = parseInt(WORD_LEVEL.LEVEL_4_1_WORD); //10%
    let _g2 = parseInt(WORD_LEVEL.LEVEL_4_2_WORD); //15%
    let _g3 = parseInt(WORD_LEVEL.LEVEL_4_3_WORD); //20%
    let _g4 = parseInt(WORD_LEVEL.LEVEL_4_4_WORD); //25%
    let _g5 = parseInt(WORD_LEVEL.LEVEL_4_5_WORD); //20%

    if((_r>=0) &&(_r<= _g1)){ //0 ~ 10%     
        return WORD_LEVEL.WORD_1;       
    }else if((_r>_g1) &&(_r<= (_g1 + _g2))){ // 10% ~ 25%            
        return WORD_LEVEL.WORD_2;
    }else if((_r>(_g1+_g2)) &&(_r<= (_g1 + _g2 + _g3))){ //25% ~ 45%
        return WORD_LEVEL.WORD_3;
    }else if((_r>(_g1+_g2+_g3)) &&(_r<= (_g1 + _g2 + _g3 + _g4))){ //45% ~70%
        return WORD_LEVEL.WORD_4;
    }else if((_r>(_g1+_g2+_g3+_g4)) &&(_r<= (_g1 + _g2 + _g3 + _g4+_g5))){ //70% ~90%
        return WORD_LEVEL.WORD_5;
    }

    return WORD_LEVEL.WORD_6;
}

/**
 * 난위도 5 레벨 음절 찾기
 */
function get_5_WordLevel(){
    let _r = TIME.getRandom();

    let _g1 = parseInt(WORD_LEVEL.LEVEL_5_1_WORD); //5%
    let _g2 = parseInt(WORD_LEVEL.LEVEL_5_2_WORD); //8%
    let _g3 = parseInt(WORD_LEVEL.LEVEL_5_3_WORD); //15%
    let _g4 = parseInt(WORD_LEVEL.LEVEL_5_4_WORD); //30%
    let _g5 = parseInt(WORD_LEVEL.LEVEL_5_5_WORD); //25%

    if((_r>=0) &&(_r<= _g1)){ //0 ~ 5%     
        return WORD_LEVEL.WORD_1;       
    }else if((_r>_g1) &&(_r<= (_g1 + _g2))){ // 5% ~ 13%            
        return WORD_LEVEL.WORD_2;
    }else if((_r>(_g1+_g2)) &&(_r<= (_g1 + _g2 + _g3))){ //13% ~ 28%
        return WORD_LEVEL.WORD_3;
    }else if((_r>(_g1+_g2+_g3)) &&(_r<= (_g1 + _g2 + _g3 + _g4))){ //28% ~58%
        return WORD_LEVEL.WORD_4;
    }else if((_r>(_g1+_g2+_g3+_g4)) &&(_r<= (_g1 + _g2 + _g3 + _g4+_g5))){ //58% ~83%
        return WORD_LEVEL.WORD_5;
    }

    return WORD_LEVEL.WORD_6;       
}

/**
 * 난위도 6 레벨 음절 찾기
 */
function get_6_WordLevel(){
    let _r = TIME.getRandom();

    let _g1 = parseInt(WORD_LEVEL.LEVEL_6_1_WORD); //3%
    let _g2 = parseInt(WORD_LEVEL.LEVEL_6_2_WORD); //5%
    let _g3 = parseInt(WORD_LEVEL.LEVEL_6_3_WORD); //8%
    let _g4 = parseInt(WORD_LEVEL.LEVEL_6_4_WORD); //27%
    let _g5 = parseInt(WORD_LEVEL.LEVEL_6_5_WORD); //32%

    if((_r>=0) &&(_r<= _g1)){ //0 ~ 3%     
        return WORD_LEVEL.WORD_1;       
    }else if((_r>_g1) &&(_r<= (_g1 + _g2))){ // 3% ~ 8%            
        return WORD_LEVEL.WORD_2;
    }else if((_r>(_g1+_g2)) &&(_r<= (_g1 + _g2 + _g3))){ //8% ~ 16%
        return WORD_LEVEL.WORD_3;
    }else if((_r>(_g1+_g2+_g3)) &&(_r<= (_g1 + _g2 + _g3 + _g4))){ //16% ~43%
        return WORD_LEVEL.WORD_4;
    }else if((_r>(_g1+_g2+_g3+_g4)) &&(_r<= (_g1 + _g2 + _g3 + _g4+_g5))){ //43% ~75%
        return WORD_LEVEL.WORD_5;
    }

    return WORD_LEVEL.WORD_6;       
}

/**
 * 난위도 7 레벨 음절 찾기
 */
function get_7_WordLevel() {
    let _r = TIME.getRandom();
    let _g1 = parseInt(WORD_LEVEL.LEVEL_7_1_WORD); //2%
    let _g2 = parseInt(WORD_LEVEL.LEVEL_7_2_WORD); //3%
    let _g3 = parseInt(WORD_LEVEL.LEVEL_7_3_WORD); //5%
    let _g4 = parseInt(WORD_LEVEL.LEVEL_7_4_WORD); //25%
    let _g5 = parseInt(WORD_LEVEL.LEVEL_7_5_WORD); //30%
    //let _g6 = parseInt(WORD_LEVEL.LEVEL_2_6_WORD); //35%


    if((_r>=0) &&(_r<= _g1)){ //0 ~ 25%     
        return WORD_LEVEL.WORD_1;       
    }else if((_r>_g1) &&(_r<= (_g1 + _g2))){ // 25% ~ 55%            
        return WORD_LEVEL.WORD_2;
    }else if((_r>(_g1+_g2)) &&(_r<= (_g1 + _g2 + _g3))){ //55% ~ 80%
        return WORD_LEVEL.WORD_3;
    }else if((_r>(_g1+_g2+_g3)) &&(_r<= (_g1 + _g2 + _g3 + _g4))){ //80% ~93%
        return WORD_LEVEL.WORD_4;
    }else if((_r>(_g1+_g2+_g3+_g4)) &&(_r<= (_g1 + _g2 + _g3 + _g4+_g5))){ //93% ~98%
        return WORD_LEVEL.WORD_5;
    }

    return WORD_LEVEL.WORD_6;       
}
 
function getLevelWord(l) {
    switch(l) {
        case WORD_LEVEL.WORD_LEVEL_1: {
            return get_1_WordLevel();
        }
        case WORD_LEVEL.WORD_LEVEL_2: {
            return get_2_WordLevel();
        }
        case WORD_LEVEL.WORD_LEVEL_3: {
            return get_3_WordLevel();
        }
        case WORD_LEVEL.WORD_LEVEL_4: {
            return get_4_WordLevel(); 
        }
        case WORD_LEVEL.WORD_LEVEL_5: {
            return get_5_WordLevel();
        }
        case WORD_LEVEL.WORD_LEVEL_6: {
            return get_6_WordLevel();
        }
        case WORD_LEVEL.WORD_LEVEL_7: {
            return get_7_WordLevel();
        }
    }
}

function getWordLevel(t) {
    let _ct = TIME.getTime();
    let _lt = _ct - t;
    let got = parseInt(gamecfg.GAME_OVER_TIME);
    let gft = got - (_lt / 1000);
    if((gft <= parseInt(WORD_LEVEL.TIME_1_LEVEL)) && (gft >= parseInt(WORD_LEVEL.TIME_2_LEVEL))) { //180초 ~ 150초
        return WORD_LEVEL.WORD_LEVEL_1;
    } else if((gft <= parseInt(WORD_LEVEL.TIME_2_LEVEL)) && (gft>= parseInt(WORD_LEVEL.TIME_3_LEVEL))) { //150초 ~ 120초
        return WORD_LEVEL.WORD_LEVEL_2;
    } else if((gft <= parseInt(WORD_LEVEL.TIME_3_LEVEL)) && (gft>= parseInt(WORD_LEVEL.TIME_4_LEVEL))){ //120초 ~ 90초
        return WORD_LEVEL.WORD_LEVEL_3;
    } else if((gft <= parseInt(WORD_LEVEL.TIME_4_LEVEL)) && (gft>= parseInt(WORD_LEVEL.TIME_5_LEVEL))){ //90초 ~ 60초
        return WORD_LEVEL.WORD_LEVEL_4;
    } else if((gft <= parseInt(WORD_LEVEL.TIME_5_LEVEL)) && (gft>= parseInt(WORD_LEVEL.TIME_6_LEVEL))){ //60초 ~ 30초
        return WORD_LEVEL.WORD_LEVEL_5;
    } else if((gft <= parseInt(WORD_LEVEL.TIME_6_LEVEL)) && (gft>= parseInt(WORD_LEVEL.TIME_7_LEVEL))){ //30초 ~ 15초
        return WORD_LEVEL.WORD_LEVEL_6;
    }
    return WORD_LEVEL.WORD_LEVEL_6;
}

function getGosuWordLevel(t){
    let _ct = TIME.getTime();
    let _lt = _ct - t;
    let got = parseInt(gamecfg.GAME_OVER_TIME);
    let gft = got - (_lt / 1000);
    if((gft <= parseInt(WORD_LEVEL.TIME_1_LEVEL)) && (gft>= parseInt(WORD_LEVEL.TIME_2_LEVEL))){ //180초 ~ 150초
        return WORD_LEVEL.WORD_LEVEL_4;
    }else if((gft <= parseInt(WORD_LEVEL.TIME_2_LEVEL)) && (gft>= parseInt(WORD_LEVEL.TIME_3_LEVEL))){ //150초 ~ 120초
        return WORD_LEVEL.WORD_LEVEL_4;
    }else if((gft <= parseInt(WORD_LEVEL.TIME_3_LEVEL)) && (gft>= parseInt(WORD_LEVEL.TIME_4_LEVEL))){ //120초 ~ 90초
        return WORD_LEVEL.WORD_LEVEL_4;
    }else if((gft <= parseInt(WORD_LEVEL.TIME_4_LEVEL)) && (gft>= parseInt(WORD_LEVEL.TIME_5_LEVEL))){ //90초 ~ 60초
        return WORD_LEVEL.WORD_LEVEL_4;
    }else if((gft <= parseInt(WORD_LEVEL.TIME_5_LEVEL)) && (gft>= parseInt(WORD_LEVEL.TIME_6_LEVEL))){ //60초 ~ 30초
        return WORD_LEVEL.WORD_LEVEL_5;
    }else if((gft <= parseInt(WORD_LEVEL.TIME_6_LEVEL)) && (gft>= parseInt(WORD_LEVEL.TIME_7_LEVEL))){ //30초 ~ 15초
        return WORD_LEVEL.WORD_LEVEL_6;
    }
    return WORD_LEVEL.WORD_LEVEL_6;        
}

//스코 평가
function judgement_score(combo_attack_count, session_id){
    let _score = 0;
    //콤보 공격개수가 0일때
    if( combo_attack_count === 0){
        _score = gamecfg.JUDGEMENT_VARIABLE;
    }
    else{
        //유저의 콤보 공격개수 가져오기
        let _cbc = combo_attack_count;
        //스코 계산
        _score = gamecfg.JUDGEMENT_VARIABLE * _cbc * gamecfg.COMBO_VARIABLE;
        console.log("nick_name : "+ session_id + "score : " + _score);
    }
    return _score; 
}

function getComboAttackType(combo_attack_count) {
    if( parseInt(combo_attack_count) === 3 ){
        return combo_attack_type.ATTACK_TYPE_3;
    }
    else if(parseInt(combo_attack_count) === 4){
        return combo_attack_type.ATTACK_TYPE_4;
    }
    else if( parseInt(combo_attack_count) === 5){
        return combo_attack_type.ATTACK_TYPE_5;
    }
    else if(parseInt(combo_attack_count) === 6){
        return combo_attack_type.ATTACK_TYPE_6;
    }
    return combo_attack_type.ATTACK_TYPE_INIT;
}

function check_bonus(user) {
    let _combo_count = parseInt(user.combo_attack_count);
    let _heart_count = parseInt(user.heart_count);
    let _score = parseInt(user.score);
    let _combo_bonus = 10 * _combo_count * gamecfg.COMBO_VARIABLE;
    let _heart_bonus = _heart_count * (_score / 10);

    return Math.round(_combo_bonus + _heart_bonus);
}

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;   
}

module.exports = {
    isEmpty, 
    generateRoomNumber,
    getLevelWord,
    getWordLevel,
    getGosuWordLevel,
    judgement_score,
    getComboAttackType,
    check_bonus,
    getRandomIntInclusive
}