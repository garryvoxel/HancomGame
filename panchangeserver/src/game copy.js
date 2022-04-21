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

const axios = require('axios');
axios.defaults.baseURL = serverConf.REDIS_NEW_MODULE;
axios.defaults.headers.post['Content-Type'] = 'application/json';
// global 변수
var gameRoom = {};
exports.gameRoom = gameRoom;

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

// nickname으로 socket 찾기
exports.findNickname = function(nickname) {
    for (var key in gameRoom) {
        for (var i = 0; i < gameRoom[key].redUsers.length; i++) {
            if (gameRoom[key].redUsers[i].NICKNAME == nickname) {
                return gameRoom[key].redUsers[i].SOCKET;
            }
        }

        for (var i = 0; i < gameRoom[key].blueUsers.length; i++) {
            if (gameRoom[key].blueUsers[i].NICKNAME == nickname) {
                return gameRoom[key].blueUsers[i].SOCKET;
            }
        }
    }
    return null;
}

// socketID 속한 방 찾기
exports.findRoomNum = async function(socket) {
    try {
        let ret = await axios.post('/panchange_game/find_room_num', {
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

// 방장 찾기
function findMaster(roomNum) {
    for (var i = 0; i < gameRoom[roomNum].redUsers.length; i++) {
        if (gameRoom[roomNum].redUsers[i].MASTER) {
            return ['RED', i, gameRoom[roomNum].redUsers[i].SOCKET];
        }
    }

    for (var i = 0; i < gameRoom[roomNum].blueUsers.length; i++) {
        if (gameRoom[roomNum].blueUsers[i].MASTER) {
            return ['BLUE', i, gameRoom[roomNum].blueUsers[i].SOCKET];
        }
    }

    return ['', -1, null];
}

//방장 소켓 , 팀 컬러 가져오기
exports.getMaster = async function(roomNum) {
    try {
        let ret = await axios.post('/panchange/get_master', {
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
        let ret = await axios.post('/panchange_game/find_user_by_session', {
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
        let ret = await axios.post('/panchange_game/get_user', {
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

// 게임 내 유저 찾기
/*
redis-new 모듈에서 처리하는 부분
이용하지 않는 메소드이므로 코멘트 처리 진행
function findUserInGame(roomNum, socketID) {
    console.log("socket", socketID);
    console.log("red", gameRoom[roomNum].gameData.RED_SCORE.USER_SCORE);
    console.log("blue", gameRoom[roomNum].gameData.BLUE_SCORE.USER_SCORE);
    for (var i = 0; i < gameRoom[roomNum].gameData.RED_SCORE.USER_SCORE.length; i++) {
        if (gameRoom[roomNum].gameData.RED_SCORE.USER_SCORE[i].SOCKET == socketID) {
            return ['RED', i];
        }
    }

    for (var i = 0; i < gameRoom[roomNum].gameData.BLUE_SCORE.USER_SCORE.length; i++) {
        if (gameRoom[roomNum].gameData.BLUE_SCORE.USER_SCORE[i].SOCKET == socketID) {
            return ['BLUE', i];
        }
    }
    return null;
}
*/

//UUID 또는 닉네임으로 게임 내 유저 찾기
exports.findByUUID = async function(roomNum, uuid, nickname) {
    try {
        let ret = await axios.post('/panchange_game/find_by_uuid', {
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
        let ret = await axios.post('/panchange_game/replace_socket_by_nickname', {
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

//컬러로 게임 내 유저 찾기
exports.getUser = function(roomNum, color, idx) {
    if (color == 'RED') {
        return gameRoom[roomNum].redUsers[idx];
    } else {
        return gameRoom[roomNum].blueUsers[idx];
    }
}

// 정보 변경
/*
게임방 정보 변경은 robby 모듈에서 진행
이용하지 않는 메소드이므로 코멘트 처리 진행
exports.changeRoom = function(roomNum, data, callback) {
    var master = findMaster(roomNum);
    if (master[0] != data.COLOR && gameRoom[roomNum].IS_PUBLIC) {
        if (data.COLOR == 'RED') {
            if (gameRoom[roomNum].redUsers.length >= (gameRoom[roomNum].MEMBER_NUM / 2)) {
                callback({
                    result: enumDict.JOIN_RET.FULL
                })
                return;
            }
        } else {
            if (gameRoom[roomNum].blueUsers.length >= (gameRoom[roomNum].MEMBER_NUM / 2)) {
                callback({
                    result: enumDict.JOIN_RET.FULL
                })
                return;
            }
        }

        // 방장 이동
        if (master[0] == 'RED') {
            var tmp = gameRoom[roomNum].redUsers[master[1]];
            gameRoom[roomNum].redUsers.splice(master[1], 1);
            gameRoom[roomNum].blueUsers.splice(0, 0, tmp);
        } else {
            var tmp = gameRoom[roomNum].blueUsers[master[1]];
            gameRoom[roomNum].blueUsers.splice(master[1], 1);
            gameRoom[roomNum].redUsers.splice(0, 0, tmp);
        }
    }

    gameRoom[roomNum].IS_PUBLIC = data.IS_PUBLIC;
    gameRoom[roomNum].IS_FREE = data.IS_FREE;
    gameRoom[roomNum].PASSWORD = data.PASSWORD;
    gameRoom[roomNum].BACKGROUND = data.BACKGROUND;
    gameRoom[roomNum].RUNNING_TIME = data.RUNNING_TIME;
    gameRoom[roomNum].UPDATE = new Date();

    callback({
        result: enumDict.JOIN_RET.OK,
        room: {
            IS_FREE: gameRoom[roomNum].IS_FREE,
            RUNNING_TIME: gameRoom[roomNum].RUNNING_TIME,
            BACKGROUND: gameRoom[roomNum].BACKGROUND
        }
    });
}
*/

// 방장 위임
exports.changeMaster = async function(roomNum, socketID) {
    try {
        let ret = await axios.post('/panchange/change_room_master', {
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

// 해당 팀 소켓 정보 가져오기
/*
이용하지 않는 메소드이므로 코멘트 처리 진행
exports.getTeamSockets = function(roomNum, color) {
    var ret = [];
    var taget = null;
    if (color == 'RED') {
        target = gameRoom[roomNum].redUsers;
    } else {
        target = gameRoom[roomNum].blueUsers;
    }
    for (var i = 0; i < target.length; i++) {
        ret.push(target[i].SOCKET);
    }
    return ret;
}
*/

// 전체 레디 상태인지 체크
exports.isAllReady = async function(roomNum) {
    try {
        let ret = await axios.post('/panchange_game/is_all_ready', {
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
        let ret = await axios.post('/panchange_game/is_valance', {
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

// 방 생성
exports.createRoom = function(data) {
    console.log("[createRoom]======[room" + data.ROOM_NUMBER + ']');
    gameRoom['room' + data.ROOM_NUMBER] ={
        gameTimer: 0,
        gameCount: 0,
        RUNNING_TIME: data.RUNNING_TIME
    };
}

// 현재 방 접속 인원
/*
이용하지 않는 메소드이므로 코멘트 처리 진행
exports.currentMemberNumber = function(roomNum) {
    try {
        return gameRoom[roomNum].redUsers.length + gameRoom[roomNum].blueUsers.length;
    } catch (e) {
        console.log("currentMemberNumber : " + e);
        return 0;
    }
}
*/

// 방 참여
exports.joinUser = async function(roomNum, socketID, data) {
    try {   

        let ret = await axios.post('/panchange_game/join_user', {
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
        console.log("***** joinUser Err *****", err22);
        return enumDict.JOIN_RET.ERR;
    }
}

// 방 나가기
exports.leaveUser = async function(roomNum, socketID) {
    try {
        let ret = await axios.post('/panchange_game/leave_user', {
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
    
    if (gameRoom[roomNum].gameTimer && gameRoom[roomNum].gameTimer != 0) {
        clearInterval(gameRoom[roomNum].gameTimer);
    }
    delete gameRoom[roomNum];

    //

    try  {
        let ret = await axios.post('/panchange/delete_room', {
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
        let ret = await axios.post('/panchange_game/move_other_team', {
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

// 방 수
/*
이용하지 않는 메소드이므로 코멘트 처리 진행
exports.getRoomNum = function() {
    return Object.keys(gameRoom).length;
}
*/

// 방 일반 정보
exports.getRoomInfo = async function(roomNum) {
    try {
        let ret = await axios.post('/panchange_game/get_room_info', {
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
        let ret = await axios.post('/panchange_game/get_clan_info', {
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
        let ret = await axios.post('/panchange_game/change_ready', {
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
        let ret = await axios.post('/panchange_game/get_user_info', {
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
        let ret = await axios.post('/panchange_game_data/get_init', {
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
        let ret = await axios.post('/panchange_game_data/init', {
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
        await axios.post('/panchange_game/set_loading', {
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
        let ret = await axios.post('/panchange_game/is_all_loading', {
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

// 강제 게임 종료
/*
강제 게임 시작은 redis-new 모듈에서 진행
exports.forceEndGame = function(roomNum) {
    var result = 0;
    try {
        if (gameRoom[roomNum].STATUS == enumDict.ROOM_STATUS.PLAYING) {
            for (var i = 0; i < gameRoom[roomNum].redUsers.length; i++) {
                if (!gameRoom[roomNum].redUsers[i].ENDGAME) {
                    gameRoom[roomNum].redUsers[i].ENDGAME = true;
                    result += 1;
                }
            }
            for (var i = 0; i < gameRoom[roomNum].blueUsers.length; i++) {
                if (!gameRoom[roomNum].blueUsers[i].ENDGAME) {
                    gameRoom[roomNum].blueUsers[i].ENDGAME = true;
                    result += 1;
                }
            }
        }
    } catch (e) {
        console.log("[[timer err]]");
        console.log(e);
        return 0;
    }
    return result;
}
*/

// 강제 게임 시작
exports.forceStartGame = async function(roomNum) {
    try {
        let ret = await axios.post('/panchange_game/force_start_game', {
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
        let ret = await axios.post('/panchange_game/get_current_loading', {
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
        await axios.post('/panchange_game/set_end_game', {
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
        let ret = await axios.post('/panchange_game/is_all_end_game', {
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
        let ret = await axios.post('/panchange_game_data/check_answer', {
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
        let ret = await axios.post('/panchange_game_data/game_board', {
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
        let ret = await axios.post('/panchange_game_data/get_team_board', {
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
        let ret = await axios.post('/panchange_game_data/check_event', {
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
        let ret = await axios.post('/panchange_game_data/get_event', {
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
        let ret = await axios.post('/panchange_game_data/add_bonus', {
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
        let ret = await axios.post('/panchange_game_data/set_team_board', {
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
        let ret = await axios.post('/panchange_game_data/get_ranking', {
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

/*
이용하지 않는 메소드이므로 코멘트 처리 진행
function calcPoint(winTeam, currentTeam, roomNum, rank) {
    const score = {
        'N2': [30],
        'N10': [45, 36, 18, 18, 18],
        'N20': [66, 60, 57, 45, 45, 24, 24, 24, 24, 24],
        'N40': [96, 87, 75, 60, 60, 60, 60, 60, 60, 60,
            42, 42, 42, 42, 42, 42, 42, 42, 42, 42
        ],
        'N60': [150, 138, 123, 105, 105, 105, 105, 105, 105, 105,
            84, 84, 84, 84, 84, 84, 84, 84, 84, 84,
            60, 60, 60, 60, 60, 60, 60, 60, 60, 60
        ],
        'N100': [240, 225, 204, 177, 177, 177, 177, 177, 177, 177,
            147, 147, 147, 147, 147, 147, 147, 147, 147, 147,
            117, 117, 117, 117, 117, 117, 117, 117, 117, 117,
            84, 84, 84, 84, 84, 84, 84, 84, 84, 84,
            84, 84, 84, 84, 84, 84, 84, 84, 84, 84
        ]
    }
    var member_num = gameRoom[roomNum].MEMBER_NUM;
    var ret = 0;

    if (winTeam == 'DRAW') {
        ret = Math.ceil(score['N' + member_num][rank - 1] * 0.8);
    } else if (winTeam == currentTeam) {
        ret = score['N' + member_num][rank - 1];
    } else {
        ret = Math.ceil(score['N' + member_num][rank - 1] * 0.7);
    }
    var current_num = gameRoom[roomNum].redUsers.length + gameRoom[roomNum].blueUsers.length;
    var plaingTime = new Date() - gameRoom[roomNum].UPDATE;
    //var gameTime = gameRoom[roomNum].RUNNING_TIME * 1000;
    var gameTime = 180 * 1000;
    if (plaingTime > gameTime) {
        plaingTime = gameTime;
    }
    ret = Math.ceil(ret * (current_num / member_num) * (plaingTime / gameTime));

    return ret;
}
*/

// 게임 결과
exports.getGameResult = async function(roomNum) {
    try {
        let ret = await axios.post('/panchange_game_data/get_game_result', {
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

exports.setGameTimer = function(roomNum, gameTimer) {

    console.log("[setGameTimer]", gameRoom);

    gameRoom[roomNum].gameTimer = gameTimer;
    gameRoom[roomNum].gameCount = 0;
}   

exports.onTiming = function(roomNum) {
    try {
        gameRoom[roomNum].gameCount += 1;
        if (gameRoom[roomNum].gameCount >= gameRoom[roomNum].RUNNING_TIME + 4) {
            clearInterval(gameRoom[roomNum].gameTimer);
            gameRoom[roomNum].gameTimer = 0;
        }
    } catch (e) {
        console.log("update time err", e);
    }
}

/*
이용하지 않는 메소드이므로 코멘트 처리 진행
exports.updateCount = function(roomNum, socketID, count) {
    var result = findUser(roomNum, socketID);
    if (result[0] == 'RED') {
        gameRoom[roomNum].redUsers[result[1]].TCOUNT = count;
    } else {
        gameRoom[roomNum].blueUsers[result[1]].TCOUNT = count;
    }
}

function timeFormat(date) {
    var ret = "";
    var y = date.getFullYear();
    var m = date.getMonth();
    var d = date.getDate();
    var h = date.getHours();
    var i = date.getMinutes();
    var s = date.getSeconds();

    ret += y;
    ret += "-";
    ret += ((m + 1) > 10) ? (m + 1) : ('0' + (m + 1));
    ret += "-";
    ret += (d > 10) ? (d) : ('0' + d);
    ret += " ";
    ret += (h > 10) ? (h) : ('0' + h);
    ret += ":";
    ret += (i > 10) ? (i) : ('0' + i);
    ret += ":";
    ret += (s > 10) ? (s) : ('0' + s);

    return ret;
}
*/