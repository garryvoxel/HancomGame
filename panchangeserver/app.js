var app = require('express')();
var server = require('http').createServer(app);
var io = require('socket.io')(server, { transports: [ 'websocket', 'polling' ] });
var gameModule = require('./src/game.js');
var robbyModule = require('./src/robby.js');
var redisModule = require('./src/redis.js');
// redis 설정 파일 가져오기
var redisConf = require('./config/pubsub.json')[process.env.NODE_ENV || 'development'];
const enumDict = require('./src/enum.js');
const redis         = require('socket.io-redis');
var serverConf = require('./config/server.json')[process.env.NODE_ENV || 'development'];

// 게임 설정 값
const gameConf = require('./config/game.json');

const port = serverConf.SERVER_PORT;

server.listen(port, function() {

    process.send = process.send || function () {};
    process.send('ready');

    console.log('[[[ Panchange Server Open ]]]');
    console.log(' --- port : ' + port);
    console.log('');

   const ioRedis = redis({ host: redisConf.PUB_SUB_REDIS_HOST, port: redisConf.PUB_SUB_REDIS_PORT });
   //ioRedis.prototype.on('error', err => console.error('ioRedis Error', err));
   io.adapter(ioRedis);

   initSocket();
});

process.on('SIGINT', function () {
    server.close(function () {
        console.log('server closed')
        process.exit(0)
    });
});  

//게임서버가 꺼졋다 켜지면 API REDIS 방정보를 플러싱한다.
//robbyModule.flush_redis_ch(); 불필요한 코드 부분 삭제진행

var robby = null;
var game = null;

/**
 * 친구초대 수락 & 거절 callback
 *  socket 찾기
 *  메시지 전달
 */
redisModule.initAcceptCallback(function(data) {
});

/**
 * from : 원래 초대를 보낸사람
 * to : 초대를 받아 거절한 사람
 * data: {from: 'nick_from', to: 'nick_to'}
 */
redisModule.initRejectCallback(function(data) {
    var sid = gameModule.findNickname(data.from);
    if (sid) {
        game.to(sid).emit('REJECT_INVI', {
            NICKNAME: data.to
        });
    }
});

function updateMembers(roomNum, members, nickname, method) {
    robby.emit('UPDATE_MEMBERS', { room_number: roomNum, method: method, members: members, nickname: nickname });
}

function updateRoomStatusToPlay(roomNum, is_play = true) {
    robby.emit('UPDATE_ROOM_PLAY', {room_number: roomNum, is_play: is_play});
}

function updateRoomInfo(roomNum, isLock, playTime) {
    robby.emit('UPDATE_ROOM_INFO', {room_number: roomNum, is_lock: isLock, play_time: playTime});
}

async function checkRoomListStatus() {
    let _res = await gameModule.checkRoomListForRemove();
    if( _res.ret_code == 1 ) {
        let _room_list = await robbyModule.getRoomList(1);   
        if(robby != null) {
            robby.emit('RES_ROOMLIST', _room_list);
        }
        if(_res.room_number != '' && game != null) {
            game.to('room' + _res.room_number).emit('YOU_FIRE', {
                roomNum: 'room' + _res.room_number
            });
        }
    }
}

//소켓 초기화
function initSocket() {
    setInterval(checkRoomListStatus, gameConf.CHECK_ROOM_INTERVAL);
    /* * * * * * * * * * * * * * * * * */
    /*              robby              */
    /* * * * * * * * * * * * * * * * * */
    console.log('[[[ Init Socket ]]]');
    robby = io.of('/robby');
    robby.on('connection', function(socket) {
        console.log('socket---connection');
        socket.on('disconnect', function() {
            socket.disconnect();
        });
        /* 방 목록 요청 */
        socket.on('REQ_ROOMLIST', async function(data) {
            console.log('[REQ_ROOMLIST]');
            // await robbyModule.resetRedis();
            try {
                let _room_list = await robbyModule.getRoomList(data.PAGE);
                robby.to(socket.id).emit('RES_ROOMLIST_INDIVIDUAL', _room_list);
            }
            catch(err22) {
                console.log("[REQ_ROOMLIST ERR]==================");
            }
        });

        /* 클랜 확인 */
        socket.on('CHECK_CLAN', async function(data) {
            let ret = await robbyModule.autoClan(data);
            if(ret == null || ret.result == 4202) {
                robby.to(socket.id).emit('CHECKED_CLAN', '');
                return;
            }
            robby.to(socket.id).emit('CHECKED_CLAN', ret.data[0].my_clan_name);
        });

        /* 방 생성하기 */
        socket.on('CREATE_ROOM', async function(data) {
            console.log('[CREATE_ROOM]');
            console.log(data);
            /**
             * 이미 유저에 의해 방이 생성되었거나 방에 입장한 케이스  
             */
            try {
                if(await gameModule.findUserBySession(data.PK)) {
                    console.log(data.PK);
                    robby.to(socket.id).emit('DUPLICATE_SESSION', 0);
                }
                else {
                    if(!data.IS_PUBLIC) { // 클랜방 생성하기 케이스
                        let _data = await robbyModule.autoClan(data.HOST_NAME);
                        if(_data) {
                            if(_data.result == 0)     {
                                robby.to(socket.id).emit('CREATE_ROOM_FAIL', 1);
                            }
                            else if(_data.result == 1 || _data.result == 2) {
                                let _room_number = await robbyModule.reqRoomNum();
                                if(_room_number == null) {
                                    robby.to(socket.id).emit('CREATE_ROOM_FAIL', 0);
                                    return;
                                }
                                data.ROOM_NUMBER = _room_number;

                                let _create_res = await robbyModule.createRoom(data);
                                if(!_create_res.success) {
                                    robby.to(socket.id).emit('CREATE_ROOM_FAIL', _create_res.err_code);
                                    return;
                                }
                                robby.to(socket.id).emit('CREATED_ROOM', {
                                    roomNum: _room_number,
                                    color: 'RED',
                                    roomHost: _create_res.host,
                                    password: data.PASSWORD,
                                    myteam: _data.data[0].my_clan_name
                                });

                                let _room_list = await robbyModule.getRoomList(1);
                                if(_room_list.ROOMLIST.length > 0)
                                    _room_list.ROOMLIST[0]['CURRENT_MEN'] = '1';
                                socket.broadcast.emit('RES_ROOMLIST', _room_list);
                            }   
                            else {
                                robby.to(socket.id).emit('CREATE_ROOM_FAIL', 2);       
                            }
                        }
                        else {
                            robby.to(socket.id).emit('CREATE_ROOM_FAIL', 2);
                        }
                    }
                    else { // 자유대전방 생성하기 케이스
                        let _room_number = await robbyModule.reqRoomNum();

                        if(_room_number == null) {
                            robby.to(socket.id).emit('CREATE_ROOM_FAIL', 0);       
                            return;
                        }
                        data.ROOM_NUMBER = _room_number;

                        let _create_res = await robbyModule.createRoom(data);
                        if(!_create_res.success) {
                            robby.to(socket.id).emit('CREATE_ROOM_FAIL', _create_res.err_code);
                            return;
                        }
                        robby.to(socket.id).emit('CREATED_ROOM', {
                            roomNum: _room_number,
                            color: data.COLOR,
                            roomHost: _create_res.host,
                            password: data.PASSWORD
                        });

                        let _room_list = await robbyModule.getRoomList(1);
                        if(_room_list.ROOMLIST.length > 0)
                            _room_list.ROOMLIST[0]['CURRENT_MEN'] = '1';
                        socket.broadcast.emit('RES_ROOMLIST', _room_list);
                    }
                }
            }
            catch(err22) {
                console.log("CREATE_ROOM error====================", err22);
            }
        });

        /* 방 검색하기 */
        socket.on('SEARCH_ROOM', async function(data) {
            console.log('[SEARCH_ROOM]===========');
            let _ret = await robbyModule.searchRoom(data.searchType, data.keyword);
            robby.to(socket.id).emit('SEARCH_RESULT', {
                result: _ret
            });
        });

        /* 방 자동 입장 */
        socket.on('AUTO_ENTER', async function() {
            console.log("AUTOENTER==============================================================");
            let callback_data = await robbyModule.autoSearch();
            robby.to(socket.id).emit('AUTO_RESULT', callback_data);
        });

        /* 클랜 방 자동 입장 */
        socket.on('AUTO_CLAN', async function(data) {
            let callback_data = await robbyModule.autoClan(data);
            if(callback_data == null) {
                robby.to(socket.id).emit('AUTO_CLAN_RESULT', { result: 1 });    
            }
            else {
                robby.to(socket.id).emit('AUTO_CLAN_RESULT', callback_data);    
            }
        });

        /* 유저 정보 요청 */
        socket.on('REQ_USERINFO', function(data) {
            console.log('[REQ_USERINFO]');
            console.log(data);
            var callback = function(callback_data) {
                robby.to(socket.id).emit('RES_USERINFO', callback_data);
            }
            robbyModule.getUserInfo(data.SESSION, callback);
        });
    });

    /* * * * * * * * * * * * * * * * * */
    /*              game               */
    /* * * * * * * * * * * * * * * * * */
    game = io.of('/game');

    game.on('connection', function(socket) {

        socket.on('disconnect', async function() {
            try {
                console.log("user disconnect in the game");
                let roomNum = await gameModule.findRoomNum(socket.id);
                console.log(roomNum);
                if (roomNum) {
                    await gameModule.setLoading(roomNum, socket.id);
                    if((await gameModule.isAllLoading(roomNum))) {
                        game.to(roomNum).emit('PLAY_GAME', {
                            roomNum: roomNum    
                        });
                    }

                    await gameModule.setEndGame(roomNum, socket.id);
                    if((await gameModule.isAllEndGame(roomNum))) {
                        let result = await gameModule.getGameResult(roomNum);
                        if(result) {
                            for(let key in result) {
                                robbyModule.saveResult(result[key], key, function(send_key, saveResult) {
                                    game.to(send_key).emit('END_GAME', { ...saveResult, roomNum: roomNum });
                                });
                            }
                        }
                    }

                    let _nickname = await gameModule.findUser(roomNum, socket.id, 'NICKNAME');
                    
                    await gameModule.leaveUser(roomNum, socket.id);

                    let _obj = {
                        USER_INFO: (await gameModule.getUserInfo(roomNum)),
                        MASTER: (await gameModule.getMaster(roomNum)),
                        CLAN: (await gameModule.getClanInfo(roomNum)),
                        roomNum: roomNum
                    };

                    game.to(roomNum).emit('UPDATE_MEMBERS', _obj);

                    updateMembers(roomNum, _obj.USER_INFO == null ? 0 : (_obj.USER_INFO['RED'].length + _obj.USER_INFO['BLUE'].length), _nickname, 'disconnect');

                    if(_obj.USER_INFO != null && (_obj.USER_INFO['RED'].length + _obj.USER_INFO['BLUE'].length == 0)) {
                        // 방 삭제, 번호 반환
                        await gameModule.removeRoom(roomNum);
                        let _room_list = await robbyModule.getRoomList(1);
                        robby.emit('RES_ROOMLIST', _room_list);
                    }
                    else {
                        if(_nickname) {
                            game.to(roomNum).emit('INGAME_LEAVE', {
                                NICKNAME: _nickname,
                                roomNum: roomNum
                            });
                            let _current_loading_msg = await gameModule.getCurrentLoading(roomNum);
                            if(_current_loading_msg) {
                                game.to(roomNum).emit('CURRENT_LOADING', {
                                    MSG: _current_loading_msg,
                                    roomNum: roomNum
                                });
                            }
                        }
                    }
                }
                socket.disconnect();
            }
            catch(err22) {
                console.log("[game disconnect]=====================", err22);
            }
        });


        /* ---------- */
        socket.on('JOIN_GAME', async function(data) {
            console.log("[[JOIN_GAME]]===========================", data);
            if(!data.isReconnectPanChangeGame)
                return;
            if(data.hasOwnProperty('roomNum') && data.roomNum != '' && data.roomNum != null) {
                socket.join(data.roomNum);
                await gameModule.replaceSocket(data.roomNum, socket.id, data.NICKNAME);
                game.to(data.roomNum).emit('UPDATE_MEMBERS', {
                    USER_INFO: (await gameModule.getUserInfo(data.roomNum)),
                    MASTER: (await gameModule.getMaster(data.roomNum)),
                    CLAN: (await gameModule.getClanInfo(data.roomNum)),
                    roomNum: data.roomNum
                });
            }
        });

        /* 방 들어오기 */
        socket.on('JOIN_ROOM', async function(roomNum, data) {
            if((await gameModule.findUserBySession(data.SESSION_ID))) {
                game.to(socket.id).emit('DUPLICATE_SESSION', {
                    roomNum: roomNum
                });
                return;
            }

            socket.join(roomNum);
                
                let joinResult = await gameModule.joinUser(roomNum, socket.id, data);

                if(joinResult != enumDict.JOIN_RET.OK) {
                        game.to(socket.id).emit('JOIN_ROOM_FAIL', joinResult);
                        return;
                }
                game.to(socket.id).emit('ENTERED_ROOM', {
                    ROOM_NUM: roomNum,
                    SOCKET: socket.id,
                    TEAM: (await gameModule.findUser(roomNum, socket.id, 'COLOR')),
                    roomNum: roomNum
                });

                let _obj = {
                    USER_INFO: (await gameModule.getUserInfo(roomNum)),
                    MASTER: (await gameModule.getMaster(roomNum)),
                    CLAN: (await gameModule.getClanInfo(roomNum))
                };             
                
                socket.broadcast.to(roomNum).emit('UPDATE_MEMBERS', _obj);
                updateMembers(roomNum, _obj.USER_INFO == null ? 0 : (_obj.USER_INFO['RED'].length + _obj.USER_INFO['BLUE'].length), data.NICKNAME, 'join_room');
        });

        /* 방 정보 수정 */
        socket.on('CHANGE_ROOM', async function(roomNum, data) {
            console.log('[CHANGE_ROOM] : ' + roomNum);
            console.log(data);
            let ret = await robbyModule.changeRoom(roomNum, data);
            if(ret == enumDict.REDIS_RET.ROOM_FULL) // 방이 꽉찬 경우
            {
                game.to(socket.id).emit('MOVE_FAIL', {
                    roomNum: roomNum
                });
            }
            else {
                game.to(roomNum).emit('CHANGED_ROOM', {
                    result: enumDict.JOIN_RET.OK,
                    room: {
                        IS_FREE: data.IS_FREE,
                        RUNNING_TIME: data.RUNNING_TIME,
                        BACKGROUND: data.BACKGROUND
                    },
                    roomNum: roomNum
                });
                
                game.to(roomNum).emit('UPDATE_MEMBERS', {
                    USER_INFO: (await gameModule.getUserInfo(roomNum)),
                    MASTER: (await gameModule.getMaster(roomNum)),
                    CLAN: (await gameModule.getClanInfo(roomNum)),
                    roomNum: roomNum
                });

                updateRoomInfo(roomNum, ((data.IS_FREE) ? 0 : 1), data.RUNNING_TIME);
            }
        });

        /* 친구 목록 요청 */
        socket.on('GET_FRDLIST', function(roomNum, data) {
            console.log('[GET_FRDLIST] : ' + roomNum);
            console.log(data);

            var callback = function(frdList) {
                game.to(socket.id).emit('RES_FRDLIST', {...frdList, roomNum: roomNum});
            }

            robbyModule.getFrdList(data.SESSION, callback);
        });

        /* 타 유저 정보 */
        socket.on('GET_ANOTHER', function(roomNum, data) {
            console.log('[GET_ANOTHER] : ' + roomNum);
            console.log(data);
            
            var callback = async function(result) {
                let userInfo = await gameModule.findByUUID(roomNum, data.UUID, data.NICKNAME);
                userInfo.RESULT = result;
                delete userInfo.SESSION_ID;
                game.to(socket.id).emit('RES_ANOTHER', {...userInfo, roomNum: roomNum});
            }

            robbyModule.getAnother(data.UUID, callback);
        });

        /* 방장 팀 이동 */
        socket.on('MOVE_OTHERTEAM', async function(roomNum, data) {
            console.log('[MOVE_OTHERTEAM] : ' + roomNum);
            console.log(data);
            let result = await gameModule.moveOtherTeam(roomNum, data.SOCKET);
            if(result) {
                game.to(roomNum).emit('UPDATE_MEMBERS', {
                    USER_INFO: (await gameModule.getUserInfo(roomNum)),
                    MASTER: (await gameModule.getMaster(roomNum)),
                    CLAN: (await gameModule.getClanInfo(roomNum)),
                    roomNum: roomNum
                });
            } else {
                game.to(socket.id).emit('MOVE_FAIL', {
                    roomNum: roomNum
                });
            }
        });

        /* 방장 위임 */
        socket.on('CHANGE_MASTER', async function(roomNum, data) {
            console.log('[CHANGE_MASTER] : ' + roomNum);
            console.log(data);

            await gameModule.changeMaster(roomNum, data.SOCKET);
            game.to(roomNum).emit('UPDATE_MEMBERS', {
                USER_INFO: (await gameModule.getUserInfo(roomNum)),
                MASTER: (await gameModule.getMaster(roomNum)),
                CLAN: (await gameModule.getClanInfo(roomNum)),
                roomNum: roomNum
            });

            game.to(data.SOCKET).emit('YOU_MASTER', {
                roomNum: roomNum
            });
        });

        /* 강제 추방 */
        socket.on('FIRE_MEN', async function(roomNum, data) {
            console.log('[FIRE_MEN] : ' + roomNum);
            console.log(data);
            await gameModule.leaveUser(roomNum, data.SOCKET);
            game.to(data.SOCKET).emit('YOU_FIRE', {roomNum: roomNum});
            game.sockets.get(data.SOCKET).leave(roomNum);
            let _obj = {
                USER_INFO: (await gameModule.getUserInfo(roomNum)),
                MASTER: (await gameModule.getMaster(roomNum)),
                CLAN: (await gameModule.getClanInfo(roomNum)),
                roomNum: roomNum
            };
            game.to(roomNum).emit('UPDATE_MEMBERS', _obj);
            // get nickname
            let _fnickname = await gameModule.findUser(roomNum, data.SOCKET, 'NICKNAME');
            updateMembers(roomNum, _obj.USER_INFO == null ? 0 : (_obj.USER_INFO['RED'].length + _obj.USER_INFO['BLUE'].length), _fnickname, 'fire_men');
        });

        /* 대기방 로딩 완료 */
        socket.on('LOADED_ROBBY', async function(roomNum) {
            if((await gameModule.findUser(roomNum, socket.id, 'COLOR'))) {
                await gameModule.changeReady(roomNum, socket.id);
                game.to(socket.id).emit('RES_ROOM_INIT', {
                    ROOM_INFO: (await gameModule.getRoomInfo(roomNum)),
                    USER_INFO: (await gameModule.getUserInfo(roomNum)),
                    MASTER: (await gameModule.getMaster(roomNum)),
                    CODE: 0,
                    roomNum: roomNum
                });
                game.to(roomNum).emit('UPDATE_MEMBERS', {
                    USER_INFO: (await gameModule.getUserInfo(roomNum)),
                    MASTER: (await gameModule.getMaster(roomNum)),
                    CLAN: (await gameModule.getClanInfo(roomNum)),
                    roomNum: roomNum
                });
            } else {
                game.to(socket.id).emit('RES_ROOM_INIT', {
                    CODE: 500,
                    roomNum: roomNum
                });
            }
        });

        socket.on('RE_PLAY', async function(roomNum) {
            console.log("재 플레이 요청 했음 ================" + roomNum);
            await robbyModule.set_play_not(roomNum);
            updateRoomStatusToPlay(roomNum, false);
        });

        /* 준비상태 변경 */
        socket.on('SEND_READY', async function(roomNum) {
            let result = await gameModule.changeReady(roomNum, socket.id);
            if (result) {
                game.to(roomNum).emit('UPDATE_MEMBERS', {
                    USER_INFO: (await gameModule.getUserInfo(roomNum)),
                    MASTER: (await gameModule.getMaster(roomNum)),
                    CLAN: (await gameModule.getClanInfo(roomNum)),
                    roomNum: roomNum
                });
            }
        });

        /* 방 나가기 */
        socket.on('LEAVE_ROOM', async function(roomNum) {
            console.log('[LEAVE_ROOM] : ' + roomNum);
            socket.leave(roomNum);  

            await gameModule.leaveUser(roomNum, socket.id);
            game.to(socket.id).emit('LEAVE_ROOM', {roomNum: roomNum});
            let _obj = {
                USER_INFO: (await gameModule.getUserInfo(roomNum)),
                MASTER: (await gameModule.getMaster(roomNum)),
                CLAN: (await gameModule.getClanInfo(roomNum)),
                roomNum: roomNum
            };
            game.to(roomNum).emit('UPDATE_MEMBERS', _obj);

            if(_obj.USER_INFO != null && (_obj.USER_INFO['RED'].length + _obj.USER_INFO['BLUE'].length == 0)) {
                // 방 삭제, 번호 반환
                await gameModule.removeRoom(roomNum);
                let _room_list = await robbyModule.getRoomList(1);
                robby.emit('RES_ROOMLIST', _room_list);
            } else {
                let _nickname = await gameModule.findUser(roomNum, socket.id, 'NICKNAME');
                if(_nickname) {
                    game.to(roomNum).emit('INGAME_LEAVE', {
                        NICKNAME: _nickname,
                        roomNum: roomNum
                    });
                }
                updateMembers(roomNum, (_obj.USER_INFO == null ? 0 : (_obj.USER_INFO['RED'].length + _obj.USER_INFO['BLUE'].length)), _nickname, 'leave_room');
            }
        });

        /* 게임 시작 */
        socket.on('START_GAME', async function(roomNum) {
            console.log('[START_GAME] : ' + roomNum);
            let isValance = await gameModule.isValance(roomNum);
            if(isValance) {
                let _ready_data = await gameModule.isAllReady(roomNum);
                if(!_ready_data.success) {
                    game.to(socket.id).emit('START_GAME_FAIL_VAL', {
                        roomNum: roomNum
                    });   
                    return;
                }
                if(_ready_data.unready_list.length == 0) {
                    // 게임 데이터 초기화   
                    await gameModule.init(roomNum);

                    // 게임 기본화면 이동
                    game.to(roomNum).emit('LOAD_LEVEL', {roomNum: roomNum});
                    console.log("게임시작을 눌러 버렸다===============!!!");
                    
                    // send play emit to clients
                    updateRoomStatusToPlay(roomNum);
                    // 게임방 플레이중으로 플래그 업데이트 합니다.
                    await robbyModule.set_play(roomNum);

                    /* 비 정상 로딩 처리 */
                    setTimeout(async function() { 
                        console.log("forceStartGame =====");

                        let _result = await gameModule.forceStartGame(roomNum);
                        console.log("비 정상 로딩 처리=============" , _result);

                        if(_result.length > 0) {
                            // 비 정상 로딩 처리 시 COM_LOADING에서 이미 PLAY_GAME했는지 체크 필요 
                            for(let i = 0; i < _result.length; i ++) {
                                game.sockets.get(_result[i]).disconnect();
                            }

                            if((await gameModule.isAllLoading(roomNum))) {
                                game.to(roomNum).emit('PLAY_GAME', {roomNum: roomNum});        
                            }
                        }
                    }, gameConf.STANDBY_TIME);
                } else {
                    game.to(socket.id).emit('START_GAME_FAIL', {roomNum: roomNum});
                    for (let i = 0; i < _ready_data.unready_list.length; i++) {
                        game.to(_ready_data.unready_list[i]).emit('NEED_READY', {roomNum: roomNum});
                    }          
                }
            }
            else {
                game.to(socket.id).emit('START_GAME_FAIL_VAL', {roomNum: roomNum});    
            }
        });

        /* 게임데이터 요청 */
        socket.on('LOADED_LEVEL', async function(roomNum) {
            console.log('[LOADED_LEVEL] : ' + roomNum);

            let obj = await gameModule.getInit(roomNum);

            if(obj)
                game.to(socket.id).emit('INIT_GAME', {...obj, roomNum: roomNum});
        });

        /* 게임 시작 후 로딩 완료 */
        socket.on('COM_LOADING', async function(roomNum) {
            console.log('[COM_LOADING] : ' + roomNum);
            await gameModule.setLoading(roomNum, socket.id);
            // room내 유저들의 Loading 모두 상태가 TRUE인 경우
            if ((await gameModule.isAllLoading(roomNum))) {
                //게임 시작 
                game.to(roomNum).emit('PLAY_GAME', {roomNum: roomNum});
            } else {
                let _current_loading_msg = await gameModule.getCurrentLoading(roomNum);
                if(_current_loading_msg) {
                    game.to(roomNum).emit('CURRENT_LOADING', {
                        MSG: _current_loading_msg,
                        roomNum: roomNum
                    });
                }
            }
        });
        

        /* 정답 전송 */
        socket.on('SEND_ANSWER', async function(roomNum, data) {
            console.log('[SEND_ANSWER] : ' + roomNum);
            console.log(data);
            let result = await gameModule.checkAnswer(roomNum, socket.id, data);
            // 한쪽색으로 채워져 게임 종료
            if (result[2]) {
                // 한쪽색으로 채워져 게임 종료
                console.log("한쪽색으로 채워져 게임 종료-----", result);

                let _board = await gameModule.getBoard(roomNum, data.BOARD_ID);
                let _ranking = await gameModule.getRanking(roomNum);
                if(_board)
                    game.to(roomNum).emit('UPDATE_BOARD', {..._board, roomNum: roomNum});
                if(_ranking)
                    game.to(roomNum).emit('UPDATE_RANKING', {..._ranking, roomNum: roomNum});

                let game_result = await gameModule.getGameResult(roomNum);

                for (let key in game_result) {
                    robbyModule.saveResult(game_result[key], key, function(send_key, saveResult) {
                        game.to(send_key).emit('END_GAME', {...saveResult, roomNum: roomNum});
                    })
                }
            } else {
                if (result[0] == false && result[1] == false) {
                    data['RESULT'] = false;
                    game.to(socket.id).emit('RES_ANSWER', {...data, roomNum: roomNum});
                } else {
                    if (result[0]) {
                        let _board = await gameModule.getBoard(roomNum, data.BOARD_ID);
                        if(_board)
                            game.to(roomNum).emit('UPDATE_BOARD', {..._board, roomNum: roomNum});
                    }
                    if (result[1]) {
                        let _ranking = await gameModule.getRanking(roomNum);
                        if(_ranking)
                            game.to(roomNum).emit('UPDATE_RANKING', {..._ranking, roomNum: roomNum});
                    }
                    data['RESULT'] = true;
                    game.to(socket.id).emit('RES_ANSWER', {...data, roomNum: roomNum});
                }
            }
        });

        /* 아이템 사용 */
        socket.on('USE_ITEM', async function(roomNum, data) {
            console.log('[USE_ITEM] : ' + roomNum);
            console.log(data);
            let userInfo = null;
            /* 팀 구별해서 각각 전송 */
            switch (data.ITEM_ID) {
                // 구름 아이템 사용
                case enumDict.ITEM.CLOUD:
                    userInfo = await gameModule.findUser(roomNum, socket.id);
                    if(userInfo) {
                        game.to(roomNum).emit('USED_CLOUD', {
                            USING_USER: userInfo,
                            USING_TEAM: userInfo.COLOR,
                            roomNum: roomNum
                        });
                    }
                    break;
                    // 천사 아이템 사용
                case enumDict.ITEM.ANGEL:
                    userInfo = await gameModule.findUser(roomNum, socket.id);
                    if(userInfo) {
                        game.to(roomNum).emit('USED_ANGEL', {
                            USING_USER: userInfo,
                            USING_TEAM: userInfo.COLOR,
                            roomNum: roomNum
                        });
                    }
                    break;
                    // 지우개 아이템 사용
                case enumDict.ITEM.ERASER:
                    await gameModule.setTeamBoard(roomNum, socket.id);
                    userInfo = await gameModule.findUser(roomNum, socket.id);
                    if(userInfo) {
                        game.to(roomNum).emit('USED_ERASER', {
                            USING_USER: userInfo,
                            USING_TEAM: userInfo.COLOR,
                            roomNum: roomNum
                        });
                    }
                    let _team_board = await gameModule.getTeamBoard(roomNum, socket.id);
                    if(_team_board)
                        game.to(roomNum).emit('UPDATE_TEAMBOARD', {..._team_board, roomNum: roomNum});
                    break;
                    // 보너스 아이템 사용
                case enumDict.ITEM.BONUS:
                    await gameModule.addBonus(roomNum, socket.id);
                    let _ranking = await gameModule.getRanking(roomNum);
                    if(_ranking)
                        game.to(roomNum).emit('UPDATE_RANKING', {..._ranking, roomNum: roomNum});
                    break;
                    // 스탑 아이템 사용
                case enumDict.ITEM.STOP:
                    userInfo = await gameModule.findUser(roomNum, socket.id);
                    if(userInfo) {
                        game.to(roomNum).emit('USED_CANTINPUT', {
                            USING_USER: userInfo,
                            USING_TEAM: userInfo.COLOR,
                            roomNum: roomNum
                        });
                    }   
                    break;
            }
        });

        /* 이벤트 정답 전송 */
        socket.on('SEND_EVENT', async function(roomNum, data) {
            console.log('[SEND_EVENT] : ' + roomNum);
            console.log(data);
            let result = await gameModule.checkEvent(roomNum, socket.id, data);
            if (result) {
                let _event = await gameModule.getEvent(roomNum, data);
                let _ranking = await gameModule.getRanking(roomNum);
                if(_event)
                    game.to(roomNum).emit('UPDATE_EVENT', {..._event, roomNum: roomNum});
                if(_ranking)
                    game.to(roomNum).emit('UPDATE_RANKING', {..._ranking, roomNum: roomNum});
            }
            data['RESULT'] = result;
            game.to(socket.id).emit('RES_EVENT', {...data, roomNum: roomNum});
        });

        /* 게임 시간 종료 */
        socket.on('SEND_ENDGAME', async function(roomNum) {
            console.log('[SEND_ENDGAME] : ' + roomNum);
            await gameModule.setEndGame(roomNum, socket.id);
            if ((await gameModule.isAllEndGame(roomNum))) {
                let result = await gameModule.getGameResult(roomNum);
                for (let key in result) {
                    robbyModule.saveResult(result[key], key, function(send_key, saveResult) {
                        game.to(send_key).emit('END_GAME', {...saveResult, roomNum: roomNum});
                    });
                }
            }
        });

        /* 친구 초대 */
        socket.on('INVITATION', async function(roomNum, data) {
            console.log('[INVITATION] : ' + roomNum);
            console.log(data);
            let userInfo = await gameModule.findUser(roomNum, socket.id);
            if(userInfo) {
                redisModule.invite(userInfo.NICKNAME, userInfo.AVATAR, userInfo.COLOR, data.INVILIST, roomNum, (await gameModule.getRoomInfo(roomNum)));
            }
        });
        //////////////////////////////////////////////////////////////////////////////
    });
}