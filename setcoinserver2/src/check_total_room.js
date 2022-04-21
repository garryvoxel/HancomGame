/**
 * 파일명: setcoinserver2/src/check_total_room.js
 * CCheckTotalRoom클래스 정의
 * 1초 간격으로 룸풀에 등록되어 있는 게임방목록의 게임상태를 체크한다.
 */
const svrcfg            = require('../config/server.json')[process.env.NODE_ENV];
const room_pool         = require('./RoomPool');
class CCheckTotalRoom{
    

    constructor(){        
       // this.redis_total_room = [];
    }
    //1초간격으로 함수 호출
    start(){
        setInterval(this.work,svrcfg.CHECK_TOTAL_ROOM_TIME);
        //setInterval(this.delete_waste_room,svrcfg.DELETE_WASTE_ROOM);
    }
    //게임 종료 체크
    work(){
        //console.log('gameover...');
        room_pool.check_game_over();        
    }

    
    delete_waste_room(){
        let _len = this.redis_total_room.length;
        for(var i=0; i<_len; i++){

        }

    }
}


let check_total_room = new CCheckTotalRoom();

module.exports = check_total_room;