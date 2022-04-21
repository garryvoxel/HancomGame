/**
 * 파일명: setcoinserver2/common/character.js
 * 캐릭터 클래스 정의
 * 캐릭터 풀 초기화, 캐릭터 풀 위치를 랜덤으로 바꾸기, 타입으로부터 캐릭터 얻기 메소드 정의
 */
var CHARACTER_TYPE = {
    "AMOGAE":0,
    "GIGI":1,
    "MOA":2,
    "MAMANG":3,
    "YUKBEE":4,
    "YAYA":5
}

class CCharacter{
    constructor(type,name){
        this.type =  type;
        this.name = name;       
    }
    //캐릭터 타입 얻기
    getType(){
        return this.type;
    }
    //캐릭터 네임 얻기
    getName(){
        return this.name;
    }
}

var character_pool = [];
/**
 * 캐릭터 초기화
 */
function character_init(){
    console.log('character_init start....!!!')
    
    character_pool.push(new CCharacter(CHARACTER_TYPE.AMOGAE,"아모개"));
    character_pool.push(new CCharacter(CHARACTER_TYPE.GIGI,"지지"));
    character_pool.push(new CCharacter(CHARACTER_TYPE.MOA,"모아"));
    character_pool.push(new CCharacter(CHARACTER_TYPE.MAMANG,"마망"));
    character_pool.push(new CCharacter(CHARACTER_TYPE.YUKBEE,"육비"));
    character_pool.push(new CCharacter(CHARACTER_TYPE.YAYA,"야야"));


}

//character_init();

function character_suffle(){    
    var temp = null;
    //캐릭터풀의 위치를 랜덤으로 바꾸기
    for( var i=character_pool.length - 1; i > 0; i -=1 ){
        j = Math.floor(Math.random() * (i+1));
        temp = character_pool[i];
        character_pool[i] = character_pool[j];
        character_pool[j] = temp;
    }
}

function get_bot_character(type){
    //타입으로부터 캐릭터얻기
    for(var i = 0; i < character_pool.length; i++){
        if(character_pool[i].getType() === type){
            continue;
        }

        return character_pool[i];
    }
}

module.exports = {
    character_suffle:character_suffle,
    get_bot_character:get_bot_character,
    CHARACTER_TYPE:CHARACTER_TYPE,
    character_init:character_init
}

