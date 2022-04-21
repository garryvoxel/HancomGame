/**
 * 파일명: panchangeserver/src/game.js
 * 판뒤집기 게임의 기본 로직이 구현되어 있습니다.
 * 다른 서버와 달리 (gcserver , setcoinserver) 유저 및 게임방 은 클래스화 되어 있지 않으며, 유저 및
 게임방 목록은 글로벌 배열 변수로 가지고 있습니다.
 */
// 게임 단어 DB
const wordDict = require('./word_dict.js');
// 게임 장문 DB
const eventDict = require('./event_dict.js');
// 상수 값들
const enumDict = require('./enum.js');
// 설정 값들
const gameConf = require('../config/game.json');

const robbyModule = require('./robby.js');
const serverConf = require('../config/server.json')[process.env.NODE_ENV || 'development'];

const panchangeRedisApiHandler = require('axios');
panchangeRedisApiHandler.defaults.baseURL = serverConf.REDIS_NEW_MODULE;
panchangeRedisApiHandler.defaults.headers.post['Content-Type'] = 'application/json';

// 랜덤값 출력
/* 
랜덤 값은 redis-new 모듈에서 이용
이용하지 않는 메소드이므로 코멘트 처리 진행
function getRandomIndex(max, target) {
    var index = [];
    while (index.length < target) {
        var num = Math.floor(Math.random() * max);
        if (index.indexOf(num) < 0) {
            index.push(num);
        }
    }
    return index;
} */

// socketID 속한 방 찾기
exports.findRoomNum = async function(socket) {
    try {
        let ret = await panchangeRedisApiHandler.post('/panchange_game/find_room_num', {
            socket_id: socket
        });
        if(ret.data.ERR_CODE != 0)
            return  null;
        return ret.data.ROOM_NUMBER;
    }
    catch(err22) {
        return null;
    }
}

//방장 소켓 , 팀 컬러 가져오기
exports.getMaster = async function(roomNum) {
    try {
        let ret = await panchangeRedisApiHandler.post('/panchange/get_master', {
            room_number: roomNum.substring(4)
        });
        if(ret.data.ERR_CODE == 0) {
            return [ret.data.MASTER.COLOR, 0, ret.data.MASTER.SOCKET];    
        }
        return ['', -1, null];
    }
    catch(err22) {
        console.log("[getMaster ERR]========");
        return ['', -1, null];
    }
}

// session으로 유저 찾기
exports.findUserBySession = async function(session_id) {
    if(session_id == 0 || session_id == '') {
        return false;
    }
    try {
        let ret = await panchangeRedisApiHandler.post('/panchange_game/find_user_by_session', {
            session_id: session_id
        });
        if(ret.data.ERR_CODE == 0 && ret.data.IS_EXIST) {
            return true;
        }
        return false;
    }    
    catch (err22) {
        console.log("findUserBySession=============", err22);
        return false;
    }
}

// 방 내 유저 찾기
async function findUser(roomNum, socketID, _key = null) {
    try {
        let ret = await panchangeRedisApiHandler.post('/panchange_game/get_user', {
            room_number: roomNum.substring(4),
            socket_id: socketID,
            key: _key
        });
        if(ret.data.ERR_CODE == 0)
            return ret.data.DATA;
        return null;
    }
    catch(err22) {
        return null;
    }
}
exports.findUser = findUser;

//UUID 또는 닉네임으로 게임 내 유저 찾기
exports.findByUUID = async function(roomNum, uuid, nickname) {
    try {
        let ret = await panchangeRedisApiHandler.post('/panchange_game/find_by_uuid', {
            room_number: roomNum.substring(4),
            uuid: uuid,
            nickname: nickname
        });
        if(ret.data.ERR_CODE != 0)
            return null;

        return ret.data.DATA;
    }
    catch(err22) {
        return null;
    }
}

exports.replaceSocket = async function(roomNum, socketID, nickname) {
    try {
        let ret = await panchangeRedisApiHandler.post('/panchange_game/replace_socket_by_nickname', {
            "room_number": roomNum.substring(4),
            "socket_id": socketID,
            "nickname": nickname
        });

        if(ret.data.ERR_CODE != 0)
            return false;

        return true;
    }
    catch(err22) {
        console.log("[replaceSocket]===================", err22);
        return false;
    }
}

// 방장 위임
exports.changeMaster = async function(roomNum, socketID) {
    try {
        let ret = await panchangeRedisApiHandler.post('/panchange/change_room_master', {
            room_number: roomNum.substring(4),
            socket_id: socketID
        });  
        if(ret.data.ERR_CODE != 0)
            return false;
        return true;
    }
    catch(err22) {
        console.log("[changeMaster]=============", err22);
        return false;
    }
}

// 전체 레디 상태인지 체크
exports.isAllReady = async function(roomNum) {
    try {
        let ret = await panchangeRedisApiHandler.post('/panchange_game/is_all_ready', {
            room_number: roomNum.substring(4)
        });

        if(ret.data.ERR_CODE != 0)
            return { success: false, unready_list: [] };    
        
        return {
            success: true,
            unready_list: ret.data.UNREADY_LIST
        };
    }
    catch(err22) {
        console.log("[isAllReady]=============", err22);
        return {
            success: false,
            unready_list: []
        };
    }
}

// 인원 수 맞는지 체크
exports.isValance = async function(roomNum) {
    try {
        let ret = await panchangeRedisApiHandler.post('/panchange_game/is_valance', {
            "room_number": roomNum.substring(4)
        });
        if(ret.data.ERR_CODE != 0)
            return false;
        return ret.data.IS_VALANCE;
    }
    catch(err22) {
        console.log("[isValance]=============", err22);
        return false;
    }
}

// 방 참여
exports.joinUser = async function(roomNum, socketID, data) {
    try {   

        let ret = await panchangeRedisApiHandler.post('/panchange_game/join_user', {
            room_number: roomNum.substring(4),
            PK: data.PK,
            SESSION_ID: data.SESSION_ID,
            NICKNAME: data.NICKNAME,
            AVATAR: data.AVATAR,
            socket_id: socketID,
            PASSWORD: data.PASSWORD,
            CLAN: data.CLAN,
            COLOR: data.COLOR 
        });

        console.log("joinUser response=======", ret.data);

        if(ret.data.ERR_CODE == 0)
            return enumDict.JOIN_RET.OK;
        if(ret.data.ERR_CODE == 124)
            return enumDict.JOIN_RET.FULL;
        if(ret.data.ERR_CODE == 125)
            return enumDict.JOIN_RET.PLAYING;
        if(ret.data.ERR_CODE == 130)
            return enumDict.JOIN_RET.NOTMATCHPWD;
        if(ret.data.ERR_CODE == 102)
            return enumDict.JOIN_RET.CLANERR;
        if(ret.data.ERR_CODE == 131)
            return enumDict.JOIN_RET.NOTMYCLANROOM;

        return enumDict.JOIN_RET.ERR;
    } catch (err22) {
        console.log("***** joinUser Err *****");
        console.log(err22);
        console.log(" --- roomNum : " + roomNum);
        console.log(" --- socketID : " + socketID);
        console.log(" --- data : " + data);
        console.log(" --- rooms : ");

        return enumDict.JOIN_RET.ERR;
    }
}

// 방 나가기
exports.leaveUser = async function(roomNum, socketID) {
    try {
        let ret = await panchangeRedisApiHandler.post('/panchange_game/leave_user', {
            room_number: roomNum.substring(4),
            socket_id: socketID
        });
        if(ret.data.ERR_CODE != 0)
            return false;
        return true;
    }
    catch(err22) {
        return false;
    }
}

// 방 삭제
exports.removeRoom = async function(roomNum) {
    //
    try  {
        let ret = await panchangeRedisApiHandler.post('/panchange/delete_room', {
            room_number: roomNum.substring(4)
        });

        if(ret.data.ERR_CODE != 0)
            return false;
        
        return true;
    }
    catch(err22) {
        console.log("[removeRoom]==========", err22);
        return false;
    }
}

// 팀 이동 시키기
exports.moveOtherTeam = async function(roomNum, socketID) {
    try {
        let ret = await panchangeRedisApiHandler.post('/panchange_game/move_other_team', {
            room_number: roomNum.substring(4),
            socket_id: socketID
        });

        if(ret.data.ERR_CODE != 0)
            return false;
        return true;
    }
    catch(err22) {
        return false;
    }
}

// 방 일반 정보
exports.getRoomInfo = async function(roomNum) {
    try {
        let ret = await panchangeRedisApiHandler.post('/panchange_game/get_room_info', {
            room_number: roomNum.substring(4)
        });
        if(ret.data.ERR_CODE != 0) 
            return null;
        return ret.data.DATA;
    }
    catch(err22) {
        return null;
    }
}

// 클랜 정보
exports.getClanInfo = async function(roomNum) {
    try {
        let ret = await panchangeRedisApiHandler.post('/panchange_game/get_clan_info', {
            room_number: roomNum.substring(4)
        });
        if(ret.data.ERR_CODE == 0)
            return ret.data.DATA;
        return null;
    }
    catch(err22) {
        return null;
    }
}

// 준비 상태 변경
exports.changeReady = async function(roomNum, socketID) {
    try {
        let ret = await panchangeRedisApiHandler.post('/panchange_game/change_ready', {
            room_number: roomNum.substring(4),
            socket_id: socketID
        });
        if(ret.data.ERR_CODE == 0)
            return ret.data.CHANGE_READY;
        return false;
    }
    catch(err22) {
        console.log("[changeReady Err==========]", err22);
        return false;
    }
}

// 방 유저 정보
exports.getUserInfo = async function(roomNum) {
    try {
        let ret = await panchangeRedisApiHandler.post('/panchange_game/get_user_info', {
            room_number: roomNum.substring(4)
        });
        if(ret.data.ERR_CODE == 0)
            return ret.data.DATA;
        return null;
    }
    catch(err22) {
        return null;
    }
}

// 게임 데이터 가져오기
exports.getInit = async function(roomNum) {
    try {
        let ret = await panchangeRedisApiHandler.post('/panchange_game_data/get_init', {
            room_number: roomNum.substring(4)
        });

        if(ret.data.ERR_CODE != 0) 
            return null;

        return ret.data.DATA;
    }
    catch(err22) {
        return null;
    }
}

// 게임 데이터 초기화
exports.init = async function(roomNum) {
    try {
        let ret = await panchangeRedisApiHandler.post('/panchange_game_data/init', {
            room_number: roomNum.substring(4)
        }); 

        if(ret.data.ERR_CODE != 0)
            return false;

        return true;
    }
    catch(err22) {
        console.log("[init]=============", err22);
        return false;
    }
}

// 게임 로딩 완료
exports.setLoading = async function(roomNum, socketID) {
    try {
        await panchangeRedisApiHandler.post('/panchange_game/set_loading', {
            room_number: roomNum.substring(4),
            socket_id: socketID
        });
        return true;
    }
    catch(err22) {
        return false;
    }
}

// 모두 로딩 완료됐는지
exports.isAllLoading = async function(roomNum) {
    try {
        let ret = await panchangeRedisApiHandler.post('/panchange_game/is_all_loading', {
            room_number: roomNum.substring(4)
        });
        if(ret.data.ERR_CODE != 0)
            return false;
        return ret.data.IS_ALL_LOADING;
    }
    catch(err22) {
        return false;
    }
}

// 강제 게임 시작
exports.forceStartGame = async function(roomNum) {
    try {
        let ret = await panchangeRedisApiHandler.post('/panchange_game/force_start_game', {
            room_number: roomNum.substring(4)
        });

        if(ret.data.ERR_CODE != 0)
            return [];
        
        return ret.data.SOCKET_LIST;
    }
    catch(err22) {
        console.log("[forceStartGame]=============", err22);
        return [];
    }
}

// 현재 로딩 완료 수
exports.getCurrentLoading = async function(roomNum) {
    try {
        let ret = await panchangeRedisApiHandler.post('/panchange_game/get_current_loading', {
            room_number: roomNum.substring(4)
        });
        if(ret.data.ERR_CODE != 0)
            return null;
        return ret.data.MSG;
    }
    catch(err22) {
        return null;
    }
}

// 게임 종료
exports.setEndGame = async function(roomNum, socketID) {
    try {
        await panchangeRedisApiHandler.post('/panchange_game/set_end_game', {
            room_number: roomNum.substring(4),
            socket_id: socketID
        });
        return true;
    }
    catch(err22) {
        return false;
    }
}

// 모두 게임 완료했는지
exports.isAllEndGame = async function(roomNum) {
    try {
        let ret = await panchangeRedisApiHandler.post('/panchange_game/is_all_end_game', {
            room_number: roomNum.substring(4)
        });
        if(ret.data.ERR_CODE != 0)
            return false;
        return ret.data.IS_ALL_END_GAME;
    }
    catch(err22) {
        return false;
    }
}

// 판 뒤집기 체크
exports.checkAnswer = async function(roomNum, socketID, data) {
    try {
        let ret = await panchangeRedisApiHandler.post('/panchange_game_data/check_answer', {
            room_number: roomNum.substring(4),
            socket_id: socketID,
            board_id: data.BOARD_ID,
            answer: data.ANSWER
        });

        if(ret.data.ERR_CODE != 0)
            return [false, false, false];
        
        return ret.data.DATA;
    }
    catch(err22) {
        return [false, false, false];
    }
}

// 보드 1칸 정보 확인
exports.getBoard = async function(roomNum, boardID) {
    try {
        let ret = await panchangeRedisApiHandler.post('/panchange_game_data/game_board', {
            room_number: roomNum.substring(4),
            board_id: boardID
        });
        
        if(ret.data.ERR_CODE != 0)
            return null;
        
        return ret.data.DATA;
    }
    catch(err22) {
        return null;
    }
}

// 해당 팀 보드 정보 확인
exports.getTeamBoard = async function(roomNum, socketID) {
    try {
        let ret = await panchangeRedisApiHandler.post('/panchange_game_data/get_team_board', {
            room_number: roomNum.substring(4),
            socket_id: socketID
        });

        if(ret.data.ERR_CODE != 0)
            return null;

        return { 'BOARD': ret.data.BOARD };
    }
    catch(err22) {
        return null;
    }
}

// 장문 정답 체크
exports.checkEvent = async function(roomNum, socketID, data) {
    try {
        let ret = await panchangeRedisApiHandler.post('/panchange_game_data/check_event', {
            room_number: roomNum.substring(4),
            socket_id: socketID,
            event_id: data.EVENT_ID,
            quiz_id: data.QUIZ_ID
        });    

        if(ret.data.ERR_CODE != 0)
            return false;
        
        return ret.data.CHECK_RESULT;
    }
    catch(err22) {
        console.log("[checkEvent]===================", err22);
        return false;
    }
}

// 이벤트 정답자 정보 전송
exports.getEvent = async function(roomNum, data) {
    try {
        let ret = await panchangeRedisApiHandler.post('/panchange_game_data/get_event', {
            room_number: roomNum.substring(4),
            event_id: data.EVENT_ID,
            quiz_id: data.QUIZ_ID
        });    

        if(ret.data.ERR_CODE != 0) 
            return null;

        return ret.data.DATA;
    }
    catch(err22) {
        console.log("[getEvent]===================", err22);
        return null;
    }
}

// 보너스 아이템 점수 더하기
exports.addBonus = async function(roomNum, socketID) {
    try {
        let ret = await panchangeRedisApiHandler.post('/panchange_game_data/add_bonus', {
            room_number: roomNum.substring(4),
            socket_id: socketID
        });    

        if(ret.data.ERR_CODE != 0) 
            return false;

        return true;
    }
    catch(err22) {
        console.log("[addBonus]===================", err22);
        return false;
    }
}

// 해당 팀 보드 초기화
exports.setTeamBoard = async function(roomNum, socketID) {
    try {
        let ret = await panchangeRedisApiHandler.post('/panchange_game_data/set_team_board', {
            room_number: roomNum.substring(4),
            socket_id: socketID
        });

        if(ret.data.ERR_CODE != 0)
            return false;

        return true;
    }
    catch(err22) {
        return false;
    }
}

// 해당 방 순위 정보
exports.getRanking = async function(roomNum) {
    try {
        let ret = await panchangeRedisApiHandler.post('/panchange_game_data/get_ranking', {
            room_number: roomNum.substring(4)
        });

        if(ret.data.ERR_CODE != 0)
            return null;

        return {
            RED_SCORE: ret.data.RED_SCORE,
            BLUE_SCORE: ret.data.BLUE_SCORE
        }
    }
    catch(err22) {
        return null;
    }
}

// 게임 결과
exports.getGameResult = async function(roomNum) {
    try {
        let ret = await panchangeRedisApiHandler.post('/panchange_game_data/get_game_result', {
            room_number: roomNum.substring(4)
        });

        if(ret.data.ERR_CODE != 0)        
            return null;
        return ret.data.DATA;
    }
    catch(err22) {
        return null;
    }
}

// 게임방 상태 체크 
exports.checkRoomListForRemove = async function() {
    try {
        let ret = await panchangeRedisApiHandler.post('/panchange/check_room_list_for_remove', {
        });
        if(ret.data.ERR_CODE != 0)
            return {ret_code: 0, room_number: ''};
        return { ret_code: ret.data.ROOM_LIST_CHANGE, room_number: ret.data.ROOM_NUMBER };
    }
    catch(err22) {
        return {ret_code: 0, room_number: ''};
    }
}