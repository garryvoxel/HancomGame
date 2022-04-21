const credis = require('./../src/module/redis');
const res_code = require('./../config/res_code');
const { isEmpty } = require('./../utils/global');
const { getRandomIndex, addUserToRankList, addEventQuiz, getTeamRankList,
    getGameDataObject, getQuiz, setGameDataObject, updateRankScore, 
    calcPoint, timeFormat, getUserScore } = require('./../src/module/gameEngineModule');
const { setRoomDetailInfo, getTeamSocketIdList, setUserDetailInfo, 
    getRoomDetail, getUserDetailInfo, removeRedisInfo, addDataToArray, getListFromArray, removeInArray } = require('./../src/module/panchangeModule');
const { findUserByNickNameInRankList } = require('./panchange/panchangeMethod');

const gameConf = require('./../config/game.json');
const wordDict = require('./../config/word_dict.js');
const eventDict = require('./../config/event_dict.js');
const redis_config = require('./../config/redis.json')[process.env.NODE_ENV || 'development']['PANCHANGE_CHANNEL'];

exports.init = async function(req, res) {
    if(isEmpty(req.body.room_number)) {
        res.json({ 'ERR_CODE': res_code.INVALID_PARAM });   
        return;   
    }
    const pan_room_list_redis = credis.getPanchangeChannel();
    try {
        /* background */
        let _room_detail_info = await getRoomDetail(pan_room_list_redis, req.body.room_number);

        /**
         * 방 상태 변경전 events 와 rank_list , rank_user_detail삭제 
         */
        for(let i = 0; i < parseInt(_room_detail_info.event_num); i ++)
            for(let j = 0; j < parseInt(gameConf.EVENT_QUIZ_NUM); j ++) {
                await removeRedisInfo(pan_room_list_redis, redis_config.EVENTS_DETAIL + '_' + req.body.room_number + '_' + i + '_' + j);
            }

        let _red_rank_list = await getTeamRankList(pan_room_list_redis, req.body.room_number, 'RED');
        let _blue_rank_list = await getTeamRankList(pan_room_list_redis, req.body.room_number, 'BLUE');

        for(let i = 0; i < _red_rank_list.length; i ++)  {
            await removeRedisInfo(pan_room_list_redis, redis_config.RANK_USER_DETAIL + '_' + _red_rank_list[i]);
        }
        for(let i = 0; i < _blue_rank_list.length; i ++) {
            await removeRedisInfo(pan_room_list_redis, redis_config.RANK_USER_DETAIL + '_' + _blue_rank_list[i]);
        }

        await removeRedisInfo(pan_room_list_redis, redis_config.RED_RANK_LIST + '_' + req.body.room_number);
        await removeRedisInfo(pan_room_list_redis, redis_config.BLUE_RANK_LIST + '_' + req.body.room_number);

        await removeRedisInfo(pan_room_list_redis, redis_config.BOARD_RED_PK_ARRAY + '_' + req.body.room_number);
        await removeRedisInfo(pan_room_list_redis, redis_config.BOARD_BLUE_PK_ARRAY + '_' + req.body.room_number);

        /* 방 상태 변경 */
        await setRoomDetailInfo(pan_room_list_redis, req.body.room_number, { 'status': 1 });

        /* 준비 해제 */
        let _red_user_list = await getTeamSocketIdList(pan_room_list_redis, req.body.room_number, 'RED');
        let _blue_user_list = await getTeamSocketIdList(pan_room_list_redis, req.body.room_number, 'BLUE');
        
        if(_room_detail_info.back_ground == gameConf.BACKGROUND_RANDOM) {
            await setRoomDetailInfo(pan_room_list_redis, req.body.room_number, { 'back_ground': Math.floor(Math.random() * gameConf.BACKGROUND_MAX + 1) });
        }

        /* board setting */
        let boardIdx = getRandomIndex(wordDict.dataset.length, gameConf.BOARD_NUM);
        await addDataToArray(pan_room_list_redis, redis_config.BOARD_RED_PK_ARRAY + '_' + req.body.room_number, boardIdx.slice(0, 39));
        await addDataToArray(pan_room_list_redis, redis_config.BOARD_BLUE_PK_ARRAY + '_' + req.body.room_number, boardIdx.slice(39, boardIdx.length));
        for(let i = 0; i < boardIdx.length; i ++) {
            await setGameDataObject(1, pan_room_list_redis, req.body.room_number, 0, i, '', {
                'IDX': i,
                'ANSWER': wordDict.dataset[boardIdx[i]],
                'ANSWER_PK': boardIdx[i],
                'COLOR': (i < 39) ? ('RED') : ('BLUE')
            });
        }

        /* score setting */
        //for(let i = 0; i < _red_user_list.length; i ++) {
        for(let i = _red_user_list.length - 1; i >= 0; i --) {
            //게임방 유저 정보 변경
            await setUserDetailInfo(pan_room_list_redis, _red_user_list[i], {'READY': 0, 'LOADING': 0, 'ENDGAME': 0});
            //유저 디테일정보 복사본 생성
            let _user_detail_info = await getUserDetailInfo(pan_room_list_redis, _red_user_list[i]);
            await setGameDataObject(4, pan_room_list_redis, req.body.room_number, 0, _red_user_list[i], '', {
                'PK': _user_detail_info.PK,
                'SOCKET': _user_detail_info.SOCKET,
                'NICKNAME': _user_detail_info.NICKNAME,
                'AVATAR': _user_detail_info.AVATAR,
                'SCORE': 0,
                'COLOR': _user_detail_info.COLOR,
                'INDEX': (i + 1)
            });
            //Rank List에 소켓아이디 추가
            await addUserToRankList(pan_room_list_redis, req.body.room_number, _red_user_list[i], 'RED');
        }
        
        
        for(let i = _blue_user_list.length - 1; i >= 0; i --) {
            //게임방 유저 정보 변경
            await setUserDetailInfo(pan_room_list_redis, _blue_user_list[i], {'READY': 0, 'LOADING': 0, 'ENDGAME': 0});
            //유저 디테일정보 복사본 생성
            let _user_detail_info = await getUserDetailInfo(pan_room_list_redis, _blue_user_list[i]);
            await setGameDataObject(4, pan_room_list_redis, req.body.room_number, 0, _blue_user_list[i], '', {
                'PK': _user_detail_info.PK,
                'SOCKET': _user_detail_info.SOCKET,
                'NICKNAME': _user_detail_info.NICKNAME,
                'AVATAR': _user_detail_info.AVATAR,
                'SCORE': 0,
                'COLOR': _user_detail_info.COLOR,
                'INDEX': (i + 1)
            });
            //Rank List에 소켓아이디 추가
            await addUserToRankList(pan_room_list_redis, req.body.room_number, _blue_user_list[i], 'BLUE');
        }

        //RED팀 SCORE설정
        await setGameDataObject(2, pan_room_list_redis, req.body.room_number, 'TEAM_SCORE',  0, 'RED');
        await setGameDataObject(2, pan_room_list_redis, req.body.room_number, 'BONUS_SCORE',  0, 'RED');
        await setGameDataObject(2, pan_room_list_redis, req.body.room_number, 'SMALL_NUM',  39, 'RED');
        await setGameDataObject(2, pan_room_list_redis, req.body.room_number, 'BIG_NUM',  0, 'RED');

        //BLUE팀 SCORE 설정
        await setGameDataObject(2, pan_room_list_redis, req.body.room_number, 'TEAM_SCORE',  0, 'BLUE');
        await setGameDataObject(2, pan_room_list_redis, req.body.room_number, 'BONUS_SCORE',  0, 'BLUE');
        await setGameDataObject(2, pan_room_list_redis, req.body.room_number, 'SMALL_NUM',  39, 'BLUE');
        await setGameDataObject(2, pan_room_list_redis, req.body.room_number, 'BIG_NUM',  0, 'BLUE');
        
        /* event setting */
        let event_tmp = gameConf.EVENT_INIT_TIME;
        let EVENT_TIME = [];
        while(event_tmp <= parseInt(_room_detail_info.play_time) * 60) {
            EVENT_TIME.push(event_tmp);
            event_tmp += gameConf.EVENT_INTERVAL;
        }

        let eventIdx = getRandomIndex(eventDict.dataset.length, gameConf.EVENT_QUIZ_NUM * EVENT_TIME.length);
        await setRoomDetailInfo(pan_room_list_redis, req.body.room_number, { 'event_num': EVENT_TIME.length });

        for(let i = 0; i < EVENT_TIME.length; i ++) {
            for(let j = 0; j < gameConf.EVENT_QUIZ_NUM; j ++) {
                await addEventQuiz(pan_room_list_redis, req.body.room_number,i, j, {
                    'ANSWER': eventDict.dataset[eventIdx[j + (i * gameConf.EVENT_QUIZ_NUM)]],
                    'SCORE': gameConf.EVENT_SCORE,
                    'RIGHTER': '',
                    'TEAM': '',
                    'TIME': EVENT_TIME[i]
                });
            }
        }

        return res.json({ 'ERR_CODE': res_code.SUCCESS });
    }   
    catch(err22) {
        return res.json({ 'ERR_CODE': err22 });
    }
}

exports.getBoard = async function(req, res) {
    if(isEmpty(req.body.room_number) || isEmpty(req.body.board_id)) {
        res.json({ 'ERR_CODE': res_code.INVALID_PARAM });           
        return;
    }
    const pan_room_list_redis = credis.getPanchangeChannel();
    try {
        let _data = await getGameDataObject(1, pan_room_list_redis, req.body.room_number, 0, req.body.board_id);
        return res.json({ 'ERR_CODE': res_code.SUCCESS,
                            'DATA': _data });
    }
    catch(err22) {
        return res.json({ 'ERR_CODE': err22 });
    }
}

exports.getTeamBoard = async function(req, res) {
    if( isEmpty(req.body.room_number) || isEmpty(req.body.socket_id) ) {
        res.json({ 'ERR_CODE': res_code.INVALID_PARAM });   
        return;           
    }
    const pan_room_list_redis = credis.getPanchangeChannel();
    try {
        let userTeam = await getGameDataObject(4, pan_room_list_redis, req.body.room_number, 0, req.body.socket_id, '', 'COLOR');
        let ret = [];
        for(let i = 0; i < gameConf.BOARD_NUM; i ++) {
            let _data = await getGameDataObject(1, pan_room_list_redis, req.body.room_number, 0, i);
            if(userTeam == _data.COLOR) {
                ret.push(_data);
            }
        }
        return res.json({ 'ERR_CODE': res_code.SUCCESS, 'BOARD': ret });
    }
    catch(err22) {
        return res.json({ 'ERR_CODE': err22 });
    }
}

// 장문 정답 체크
exports.checkEvent = async function(req, res) {
    if( isEmpty(req.body.room_number) || isEmpty(req.body.socket_id) || isEmpty(req.body.event_id) || isEmpty(req.body.quiz_id)) {
        res.json({ 'ERR_CODE': res_code.INVALID_PARAM });   
        return;           
    }
    const pan_room_list_redis = credis.getPanchangeChannel();
    try {
        let quiz = await getQuiz(pan_room_list_redis, req.body.room_number, req.body.event_id, req.body.quiz_id);
        if(!(quiz.RIGHTER == '' || quiz.RIGHTER == null)) {
            return res.json({ 'ERR_CODE': res_code.SUCCESS, 'CHECK_RESULT': false });    
        }
        let userInfo = await getGameDataObject(4, pan_room_list_redis, req.body.room_number, 0, req.body.socket_id, '');
        if(userInfo.COLOR == 'RED') {

            await updateRankScore(pan_room_list_redis, req.body.room_number, 'BONUS_SCORE', 'RED', parseInt(quiz.SCORE), 2);
            await updateRankScore(pan_room_list_redis, req.body.room_number, 'BIG_NUM', 'RED', 1, 2);

            await setGameDataObject(3, pan_room_list_redis, req.body.room_number, req.body.event_id, req.body.quiz_id, '', {
                'TEAM': 'RED',
                'RIGHTER': userInfo.NICKNAME
            });
        }
        else {

            await updateRankScore(pan_room_list_redis, req.body.room_number, 'BONUS_SCORE', 'BLUE', parseInt(quiz.SCORE), 2);
            await updateRankScore(pan_room_list_redis, req.body.room_number, 'BIG_NUM', 'BLUE', 1, 2);

            await setGameDataObject(3, pan_room_list_redis, req.body.room_number, req.body.event_id, req.body.quiz_id, '', {
                'TEAM': 'BLUE',
                'RIGHTER': userInfo.NICKNAME
            });
        }
        return res.json({ 'ERR_CODE': res_code.SUCCESS, 'CHECK_RESULT': true });
    }
    catch(err22) {
        return res.json({ 'ERR_CODE': err22 });
    }
}

// 이벤트 정답자 정보 전송
exports.getEvent = async function(req, res) {

    if(isEmpty(req.body.room_number) || isEmpty(req.body.event_id) || isEmpty(req.body.quiz_id)) {
        res.json({ 'ERR_CODE': res_code.INVALID_PARAM });   
        return;           
    }    
    
    const pan_room_list_redis = credis.getPanchangeChannel();

    try {
        let _obj = {};
        _obj['EVENT_ID'] = req.body.event_id;
        _obj['QUIZ_ID'] = req.body.quiz_id;
        let quiz = await getQuiz(pan_room_list_redis, req.body.room_number, req.body.event_id, req.body.quiz_id);

        if(quiz.RIGHTER == null || quiz.RIGHTER == "") {
            _obj['USER'] = null;
        }
        else {
            _obj['USER'] = await findUserByNickNameInRankList(pan_room_list_redis, req.body.room_number, quiz.RIGHTER);
        }

        _obj['COLOR'] = quiz.TEAM;
        return res.json({ 'ERR_CODE': res_code.SUCCESS, 'DATA': _obj });
    }
    catch(err22) {
        return res.json({ 'ERR_CODE': err22 });
    }

}

// 보너스 아이템 점수 더하기
exports.addBonus = async function(req, res) {
    if(isEmpty(req.body.room_number) || isEmpty(req.body.socket_id)) {
        res.json({ 'ERR_CODE': res_code.INVALID_PARAM });   
        return;             
    }
    const pan_room_list_redis = credis.getPanchangeChannel();
    try {
        let teamColor = await getGameDataObject(4, pan_room_list_redis, req.body.room_number, 0, req.body.socket_id, '', 'COLOR');

        console.log("teamColor============", teamColor);

        if(teamColor == 'RED') {
            await updateRankScore(pan_room_list_redis, req.body.room_number, 'TEAM_SCORE', 'RED', parseInt(gameConf.ITEM_BONUS_SCORE), 2);
            await updateRankScore(pan_room_list_redis, req.body.room_number, req.body.socket_id, 'RED', parseInt(gameConf.ITEM_BONUS_SCORE));
        }
        else {   
            await updateRankScore(pan_room_list_redis, req.body.room_number, 'TEAM_SCORE', 'BLUE', parseInt(gameConf.ITEM_BONUS_SCORE), 2);
            await updateRankScore(pan_room_list_redis, req.body.room_number, req.body.socket_id, 'BLUE', parseInt(gameConf.ITEM_BONUS_SCORE));
        }
        return res.json({ 'ERR_CODE': res_code.SUCCESS });
    }
    catch(err22) {
        console.log(err22);
        return res.json({ 'ERR_CODE': err22 });
    }
}

// 해당 팀 보드 초기화
exports.setTeamBoard = async function(req, res) {
   if(isEmpty(req.body.room_number) || isEmpty(req.body.socket_id)) {
        res.json({ 'ERR_CODE': res_code.INVALID_PARAM });   
        return;
    }
    const pan_room_list_redis = credis.getPanchangeChannel();
    try {
        let userTeam = await getGameDataObject(4, pan_room_list_redis, req.body.room_number, 0, req.body.socket_id, '', 'COLOR');
        let existIdx = [], newIdxArray = [];
        
        if(userTeam == 'RED') 
            existIdx = await getListFromArray(pan_room_list_redis, redis_config.BOARD_BLUE_PK_ARRAY + '_' + req.body.room_number);
        else 
            existIdx = await getListFromArray(pan_room_list_redis, redis_config.BOARD_RED_PK_ARRAY + '_' + req.body.room_number);

        for(let i = 0; i < gameConf.BOARD_NUM; i ++) {
            let _board = await getGameDataObject(1, pan_room_list_redis, req.body.room_number, 0, i);
            if(_board.COLOR == userTeam) {
                let newIdx = 0;
                do {
                    newIdx = Math.floor(Math.random() * wordDict.dataset.length);
                    newIdx = newIdx.toString();
                } while (existIdx.indexOf(newIdx) >= 0);
                await setGameDataObject(1, pan_room_list_redis, req.body.room_number, 0, i, '', {
                    'ANSWER': wordDict.dataset[newIdx],
                    'ANSWER_PK': newIdx
                });
                existIdx.push(newIdx);                  
                newIdxArray.push(newIdx);
            }
        }

        if(userTeam == 'RED')  {
            await removeRedisInfo(pan_room_list_redis, redis_config.BOARD_RED_PK_ARRAY + '_' + req.body.room_number);
            await addDataToArray(pan_room_list_redis, redis_config.BOARD_RED_PK_ARRAY + '_' + req.body.room_number, newIdxArray);
        }
        else {
            await removeRedisInfo(pan_room_list_redis, redis_config.BOARD_BLUE_PK_ARRAY + '_' + req.body.room_number);
            await addDataToArray(pan_room_list_redis, redis_config.BOARD_BLUE_PK_ARRAY + '_' + req.body.room_number, newIdxArray);
        }

        return res.json({ 'ERR_CODE': res_code.SUCCESS });
    }
    catch(err22) {
        return res.json({ 'ERR_CODE': err22 });
    }
}

// 해당 방 순위 정보
exports.getRanking = async function(req, res) {
    if(isEmpty(req.body.room_number)) {
        res.json({ 'ERR_CODE': res_code.INVALID_PARAM });   
        return;    
    }
    const pan_room_list_redis = credis.getPanchangeChannel();
    try {
        let redScore = {}, blueScore = {};

        redScore = {
            'TEAM_SCORE': (await getGameDataObject(2, pan_room_list_redis, req.body.room_number, 0, 0, 'RED', 'TEAM_SCORE')),
            'BONUS_SCORE': (await getGameDataObject(2, pan_room_list_redis, req.body.room_number, 0, 0, 'RED', 'BONUS_SCORE')),
            'SMALL_NUM': (await getGameDataObject(2, pan_room_list_redis, req.body.room_number, 0, 0, 'RED', 'SMALL_NUM')),
            'BIG_NUM': (await getGameDataObject(2, pan_room_list_redis, req.body.room_number, 0, 0, 'RED', 'BIG_NUM'))
        };

        blueScore = {
            'TEAM_SCORE': (await getGameDataObject(2, pan_room_list_redis, req.body.room_number, 0, 0, 'BLUE', 'TEAM_SCORE')),
            'BONUS_SCORE': (await getGameDataObject(2, pan_room_list_redis, req.body.room_number, 0, 0, 'BLUE', 'BONUS_SCORE')),
            'SMALL_NUM': (await getGameDataObject(2, pan_room_list_redis, req.body.room_number, 0, 0, 'BLUE', 'SMALL_NUM')),
            'BIG_NUM': (await getGameDataObject(2, pan_room_list_redis, req.body.room_number, 0, 0, 'BLUE', 'BIG_NUM'))
        };

        let red_rank_list = await getTeamRankList(pan_room_list_redis, req.body.room_number, 'RED');
        let blue_rank_list = await getTeamRankList(pan_room_list_redis, req.body.room_number, 'BLUE');
        redScore.RANK_SCORE = [];
        blueScore.RANK_SCORE = [];
        for(let i = 0; i < red_rank_list.length; i ++) {
            let _user_detail = await getGameDataObject(4, pan_room_list_redis, req.body.room_number, 0, red_rank_list[i])
            redScore.RANK_SCORE.push({
                'PK': _user_detail.PK,
                'SOCKET': _user_detail.SOCKET,
                'NICKNAME': _user_detail.NICKNAME,
                'AVATAR': _user_detail.AVATAR,
                'SCORE': (await getUserScore(pan_room_list_redis, req.body.room_number, red_rank_list[i], 'RED'))
            });
        }
        for(let i = 0; i < blue_rank_list.length; i ++) {
            let _user_detail = await getGameDataObject(4, pan_room_list_redis, req.body.room_number, 0, blue_rank_list[i])
            blueScore.RANK_SCORE.push({
                'PK': _user_detail.PK,
                'SOCKET': _user_detail.SOCKET,
                'NICKNAME': _user_detail.NICKNAME,
                'AVATAR': _user_detail.AVATAR,
                'SCORE': (await getUserScore(pan_room_list_redis, req.body.room_number, blue_rank_list[i], 'BLUE'))
            });
        }
        return res.json({ 'ERR_CODE': res_code.SUCCESS,
                            'RED_SCORE': redScore,
                            'BLUE_SCORE': blueScore });
    }
    catch(err22) {
        return res.json({ 'ERR_CODE': err22 });
    }
}

exports.getGameResult = async function(req, res) {
    if(isEmpty(req.body.room_number)) {
        res.json({ 'ERR_CODE': res_code.INVALID_PARAM });
        return;
    }
    const pan_room_list_redis = credis.getPanchangeChannel();
    try {
        let ret = {};
        let result = {};

        // let red_score = await getGameDataObject(2, pan_room_list_redis, req.body.room_number, 0, 0, 'RED');
        // let blue_score = await getGameDataObject(2, pan_room_list_redis, req.body.room_number, 0, 0, 'BLUE');
        let red_score = {}, blue_score = {};

        red_score = {
            'TEAM_SCORE': (await getGameDataObject(2, pan_room_list_redis, req.body.room_number, 0, 0, 'RED', 'TEAM_SCORE')),
            'BONUS_SCORE': (await getGameDataObject(2, pan_room_list_redis, req.body.room_number, 0, 0, 'RED', 'BONUS_SCORE')),
            'SMALL_NUM': (await getGameDataObject(2, pan_room_list_redis, req.body.room_number, 0, 0, 'RED', 'SMALL_NUM')),
            'BIG_NUM': (await getGameDataObject(2, pan_room_list_redis, req.body.room_number, 0, 0, 'RED', 'BIG_NUM'))
        };

        blue_score = {
            'TEAM_SCORE': (await getGameDataObject(2, pan_room_list_redis, req.body.room_number, 0, 0, 'BLUE', 'TEAM_SCORE')),
            'BONUS_SCORE': (await getGameDataObject(2, pan_room_list_redis, req.body.room_number, 0, 0, 'BLUE', 'BONUS_SCORE')),
            'SMALL_NUM': (await getGameDataObject(2, pan_room_list_redis, req.body.room_number, 0, 0, 'BLUE', 'SMALL_NUM')),
            'BIG_NUM': (await getGameDataObject(2, pan_room_list_redis, req.body.room_number, 0, 0, 'BLUE', 'BIG_NUM'))
        };

        let redSmall = parseInt(red_score.SMALL_NUM);
        let blueSmall = parseInt(blue_score.SMALL_NUM);
        let redBig = parseInt(red_score.BIG_NUM) * 10;
        let blueBig = parseInt(blue_score.BIG_NUM) * 10;
        let redScore = parseInt(red_score.TEAM_SCORE);
        let blueScore = parseInt(blue_score.TEAM_SCORE);
        let redBonus = parseInt(red_score.BONUS_SCORE);
        let blueBonus = parseInt(blue_score.BONUS_SCORE);
        //무슨 색이 이겼는지 판단
        if ((redSmall + redBig) > (blueSmall + blueBig)) {
            result['WIN'] = 'RED';
        } else if ((redSmall + redBig) < (blueSmall + blueBig)) {
            result['WIN'] = 'BLUE';
        } else if((redSmall + redBig) == (blueSmall + blueBig)) {
            if ((redScore + redBonus) > (blueScore + blueBonus)) {
                result['WIN'] = 'RED';
            } else if ((redScore + redBonus) < (blueScore + blueBonus)) {
                result['WIN'] = 'BLUE';
            } else if ((redScore + redBonus) == (blueScore + blueBonus)) {
                result['WIN'] = 'DRAW';
            }
        }
        result['RED'] = {
            SMALL_NUM: redSmall,
            BIG_NUM: redBig,
            TEAM_SCORE: redScore,
            BONUS_SCORE: redBonus
        };
        result['BLUE'] = {
            SMALL_NUM: blueSmall,
            BIG_NUM: blueBig,
            TEAM_SCORE: blueScore,
            BONUS_SCORE: blueBonus
        };

        let red_rank_list = await getTeamRankList(pan_room_list_redis, req.body.room_number, 'RED');
        let blue_rank_list = await getTeamRankList(pan_room_list_redis, req.body.room_number, 'BLUE');

        let red_user_list = await getTeamSocketIdList(pan_room_list_redis, req.body.room_number, 'RED');
        let blue_user_list = await getTeamSocketIdList(pan_room_list_redis, req.body.room_number, 'BLUE');

        let endTime = Math.floor(Date.now() / 1000);
        let _room_detail_info = await getRoomDetail(pan_room_list_redis, req.body.room_number);

        for(let i = 0; i < red_rank_list.length; i ++) {
            let _user_detail_info = await getGameDataObject(4, pan_room_list_redis, req.body.room_number, 0, red_rank_list[i], '');
            ret[_user_detail_info.SOCKET] = {
                WIN: result.WIN,
                RED: result.RED,
                BLUE: result.BLUE
            };
            //랭킹 세팅
            ret[_user_detail_info.SOCKET].RANK = i + 1;
            ret[_user_detail_info.SOCKET].HISTORY = {
                WIN: 0,
                LOSE: 0,
                DRAW: 0
            };

            ret[_user_detail_info.SOCKET].MODE = (_room_detail_info.is_clan == 0 ? 1 : 2);
            ret[_user_detail_info.SOCKET].POINT = calcPoint(result.WIN, 'RED', i + 1, _room_detail_info.user_max_count, _room_detail_info.current_user_count, _room_detail_info.update_time);
            ret[_user_detail_info.SOCKET].AVATAR = _user_detail_info.AVATAR;
            ret[_user_detail_info.SOCKET].TEAM = 'RED';
            ret[_user_detail_info.SOCKET].UUID = _user_detail_info.PK;
            ret[_user_detail_info.SOCKET].NICKNAME = _user_detail_info.NICKNAME;
            ret[_user_detail_info.SOCKET].ENDTIME = timeFormat(endTime);
            ret[_user_detail_info.SOCKET].STARTTIME = timeFormat(_room_detail_info.update_time);
            
            ret[_user_detail_info.SOCKET].RED_STARTCOUNT = red_rank_list.length;
            ret[_user_detail_info.SOCKET].BLUE_STARTCOUNT = blue_rank_list.length;

            ret[_user_detail_info.SOCKET].RED_ENDCOUNT = red_user_list.length;
            ret[_user_detail_info.SOCKET].BLUE_ENDCOUNT = blue_user_list.length;
            
            ret[_user_detail_info.SOCKET].STATE = 3;

            for(let j = 0; j < red_user_list.length; j ++) {
                if((await getUserDetailInfo(pan_room_list_redis, red_user_list[j], 'NICKNAME')) == _user_detail_info.NICKNAME) {
                    ret[_user_detail_info.SOCKET].STATE = 1;
                    break;
                }
            }
            if(ret[_user_detail_info.SOCKET].STATE == 1) {
                if(ret[_user_detail_info.SOCKET].BLUE_ENDCOUNT == 0) {
                    ret[_user_detail_info.SOCKET].STATE = 2;
                }
            }
        }

        for(let i = 0; i < blue_rank_list.length; i ++) {
            let _user_detail_info = await getGameDataObject(4, pan_room_list_redis, req.body.room_number, 0, blue_rank_list[i], '');
            ret[_user_detail_info.SOCKET] = {
                WIN: result.WIN,
                RED: result.RED,
                BLUE: result.BLUE
            };
            //랭킹 세팅
            ret[_user_detail_info.SOCKET].RANK = i + 1;
            ret[_user_detail_info.SOCKET].HISTORY = {
                WIN: 0,
                LOSE: 0,
                DRAW: 0
            };

            ret[_user_detail_info.SOCKET].MODE = (_room_detail_info.is_clan == 0 ? 1 : 2);
            ret[_user_detail_info.SOCKET].POINT = calcPoint(result.WIN, 'BLUE', i + 1, _room_detail_info.user_max_count, _room_detail_info.current_user_count, _room_detail_info.update_time);
            ret[_user_detail_info.SOCKET].AVATAR = _user_detail_info.AVATAR;
            ret[_user_detail_info.SOCKET].TEAM = 'BLUE';
            ret[_user_detail_info.SOCKET].UUID = _user_detail_info.PK;
            ret[_user_detail_info.SOCKET].NICKNAME = _user_detail_info.NICKNAME;
            ret[_user_detail_info.SOCKET].ENDTIME = timeFormat(endTime);
            ret[_user_detail_info.SOCKET].STARTTIME = timeFormat(_room_detail_info.update_time);
            
            ret[_user_detail_info.SOCKET].RED_STARTCOUNT = red_rank_list.length;
            ret[_user_detail_info.SOCKET].BLUE_STARTCOUNT = blue_rank_list.length;

            ret[_user_detail_info.SOCKET].RED_ENDCOUNT = red_user_list.length;
            ret[_user_detail_info.SOCKET].BLUE_ENDCOUNT = blue_user_list.length;

            ret[_user_detail_info.SOCKET].STATE = 3;

            for(let j = 0; j < blue_user_list.length; j ++) {
                if((await getUserDetailInfo(pan_room_list_redis, blue_user_list[j], 'NICKNAME')) == _user_detail_info.NICKNAME) {
                    ret[_user_detail_info.SOCKET].STATE = 1;
                    break;
                }
            }
            if(ret[_user_detail_info.SOCKET].STATE == 1) {
                if(ret[_user_detail_info.SOCKET].RED_ENDCOUNT == 0) {
                    ret[_user_detail_info.SOCKET].STATE = 2;
                }
            }
        }

        /* 방 상태 변경 */
        await setRoomDetailInfo(pan_room_list_redis, req.body.room_number, { "status": 0, 'update_time': Math.floor(Date.now() / 1000) });

        return res.json({ 'ERR_CODE': res_code.SUCCESS, 'DATA': ret });
    }
    catch(err22) {
        return res.json({ 'ERR_CODE': err22 });
    }
}

/**
 * [res1, res2, res3]
 * res1 - TRUE : 정답인 경우 / FALSE: 오타인  경우
 * res2 - TRUE:   다른 색상을 뒤집은 경우 (추가점수 가산) / FALSE: 같은 색상을 뒤집은 경우 (추가 점수 없음)
 * res3- TRUE:  한쪽색으로 채워져 게임 종료 / FALSE:  한쪽색으로 채워지지 않은 경우
 * @param {*} req 
 * @param {*} res 
 */
exports.checkAnswer = async function(req, res) {

    if(isEmpty(req.body.room_number) || isEmpty(req.body.socket_id) || isEmpty(req.body.board_id) || isEmpty(req.body.answer)) {
        res.json({ 'ERR_CODE': res_code.INVALID_PARAM });
        return;            
    }

    const pan_room_list_redis = credis.getPanchangeChannel();    
    try {
        let board = await getGameDataObject(1, pan_room_list_redis, req.body.room_number, 0, req.body.board_id);        

        console.log(board.ANSWER, req.body.answer);

        if(board.ANSWER == req.body.answer) {
            let userTeam = await getGameDataObject(4, pan_room_list_redis, req.body.room_number, 0, req.body.socket_id, '', 'COLOR');

            /* 새로운 정답 할당 */   
            let existIdx = [];

            existIdx = await getListFromArray(pan_room_list_redis, redis_config.BOARD_RED_PK_ARRAY + '_' + req.body.room_number);
            existIdx = existIdx.concat( (await getListFromArray(pan_room_list_redis, redis_config.BOARD_BLUE_PK_ARRAY + '_' + req.body.room_number)) );

            let newIdx = -100;
            do {
                newIdx = Math.floor(Math.random() * wordDict.dataset.length);
                newIdx = newIdx.toString();
            } while (existIdx.indexOf(newIdx) >= 0);

            await setGameDataObject(1, pan_room_list_redis, req.body.room_number, 0, req.body.board_id, '', {
                'ANSWER': wordDict.dataset[newIdx],
                'ANSWER_PK': newIdx
            });

            if(userTeam == board.COLOR) {
                if(board.COLOR == 'RED') {
                    await removeInArray(pan_room_list_redis, redis_config.BOARD_RED_PK_ARRAY + '_' + req.body.room_number, board.ANSWER_PK);
                    await addDataToArray(pan_room_list_redis, redis_config.BOARD_RED_PK_ARRAY + '_' + req.body.room_number, newIdx);
                }
                else  {
                    await removeInArray(pan_room_list_redis, redis_config.BOARD_BLUE_PK_ARRAY + '_' + req.body.room_number, board.ANSWER_PK);
                    await addDataToArray(pan_room_list_redis, redis_config.BOARD_BLUE_PK_ARRAY + '_' + req.body.room_number, newIdx);
                }
            }
            else {
                if(board.COLOR == 'RED') {
                    await removeInArray(pan_room_list_redis, redis_config.BOARD_RED_PK_ARRAY + '_' + req.body.room_number, board.ANSWER_PK);
                    await addDataToArray(pan_room_list_redis, redis_config.BOARD_BLUE_PK_ARRAY + '_' + req.body.room_number, newIdx);
                }
                else  {
                    await removeInArray(pan_room_list_redis, redis_config.BOARD_BLUE_PK_ARRAY + '_' + req.body.room_number, board.ANSWER_PK);
                    await addDataToArray(pan_room_list_redis, redis_config.BOARD_RED_PK_ARRAY + '_' + req.body.room_number, newIdx);
                }
            }

            /* 같은 색상을 뒤집었으면 */
            if(userTeam == board.COLOR) {
                return res.json({ 'ERR_CODE': res_code.SUCCESS, 'DATA': [true, false, false]});        
            }
            /* 다른 색상을 뒤집었으면 */
            else {
                await setGameDataObject(1, pan_room_list_redis, req.body.room_number, 0, req.body.board_id, '', {
                    'COLOR': ((userTeam == 'RED') ? ('RED') : ('BLUE'))
                });
                /* 점수 부여 */   
                if(userTeam == 'RED') {
                    await updateRankScore(pan_room_list_redis, req.body.room_number, 'SMALL_NUM', 'RED', 1, 2);
                    await updateRankScore(pan_room_list_redis, req.body.room_number, 'TEAM_SCORE', 'RED', parseInt(gameConf.REVERSE_SCORE), 2);
                    await updateRankScore(pan_room_list_redis, req.body.room_number, 'SMALL_NUM', 'BLUE', -1, 2);
                    await updateRankScore(pan_room_list_redis, req.body.room_number, req.body.socket_id, 'RED', parseInt(gameConf.REVERSE_SCORE));
                } else {
                    await updateRankScore(pan_room_list_redis, req.body.room_number, 'SMALL_NUM', 'RED', -1, 2);
                    await updateRankScore(pan_room_list_redis, req.body.room_number, 'SMALL_NUM', 'BLUE', 1, 2);
                    await updateRankScore(pan_room_list_redis, req.body.room_number, 'TEAM_SCORE', 'BLUE', parseInt(gameConf.REVERSE_SCORE), 2);
                    await updateRankScore(pan_room_list_redis, req.body.room_number, req.body.socket_id, 'BLUE', parseInt(gameConf.REVERSE_SCORE));
                }

                if( (await getGameDataObject(2, pan_room_list_redis, req.body.room_number, 0, 0, 'RED', 'SMALL_NUM')) != 0 &&
                    (await getGameDataObject(2, pan_room_list_redis, req.body.room_number, 0, 0, 'BLUE', 'SMALL_NUM')) != 0) {
                    return res.json({ 'ERR_CODE': res_code.SUCCESS, 'DATA': [true, true, false]});        
                }
                else {
                    return res.json({ 'ERR_CODE': res_code.SUCCESS, 'DATA': [true, true, true]});        
                }   
            }
        }
        else {
            return res.json({ 'ERR_CODE': res_code.SUCCESS, 'DATA': [false, false, false]});        
        }
    }
    catch(err22) {
        return res.json({ 'ERR_CODE': err22 });   
    }
}

exports.getInit = async function(req, res) {
    if(isEmpty(req.body.room_number)) {
        res.json({ 'ERR_CODE': res_code.INVALID_PARAM });           
        return;
    }
    const pan_room_list_redis = credis.getPanchangeChannel();    
    try {
        let obj = {};
        let _room_detail_info = await getRoomDetail(pan_room_list_redis, req.body.room_number);
        
        obj['BACKGROUND'] = _room_detail_info['back_ground'];
        obj['BOARD'] = [];
        /* board setting */
        for(let i = 0; i < gameConf.BOARD_NUM; i ++) {
            let _board = await getGameDataObject(1, pan_room_list_redis, req.body.room_number, 0, i);
            obj['BOARD'].push({
                'IDX': i,
                'ANSWER': _board.ANSWER,
                'ANSWER_PK': _board.ANSWER_PK,
                'COLOR': _board.COLOR
            });
        }

        /* score setting */
        // let _red_score = await getGameDataObject(2, pan_room_list_redis, req.body.room_number, 0, 0, 'RED');
        // let _blue_score = await getGameDataObject(2, pan_room_list_redis, req.body.room_number, 0, 0, 'BLUE');
        obj['RED_SCORE'] = {
            TEAM_SCORE: (await getGameDataObject(2, pan_room_list_redis, req.body.room_number, 0, 0, 'RED', 'TEAM_SCORE')),
            BONUS_SCORE: (await getGameDataObject(2, pan_room_list_redis, req.body.room_number, 0, 0, 'RED', 'BONUS_SCORE')),
            SMALL_NUM: (await getGameDataObject(2, pan_room_list_redis, req.body.room_number, 0, 0, 'RED', 'SMALL_NUM')),
            BIG_NUM: (await getGameDataObject(2, pan_room_list_redis, req.body.room_number, 0, 0, 'RED', 'BIG_NUM'))
        };

        obj['BLUE_SCORE'] = {
            TEAM_SCORE: (await getGameDataObject(2, pan_room_list_redis, req.body.room_number, 0, 0, 'BLUE', 'TEAM_SCORE')),
            BONUS_SCORE: (await getGameDataObject(2, pan_room_list_redis, req.body.room_number, 0, 0, 'BLUE', 'BONUS_SCORE')),
            SMALL_NUM: (await getGameDataObject(2, pan_room_list_redis, req.body.room_number, 0, 0, 'BLUE', 'SMALL_NUM')),
            BIG_NUM: (await getGameDataObject(2, pan_room_list_redis, req.body.room_number, 0, 0, 'BLUE', 'BIG_NUM'))
        };
        /*
        obj['BLUE_SCORE'] = {
            TEAM_SCORE: _blue_score.TEAM_SCORE,
            BONUS_SCORE: _blue_score.BONUS_SCORE,
            SMALL_NUM: _blue_score.SMALL_NUM,
            BIG_NUM: _blue_score.BIG_NUM
        } */

        obj['RED_SCORE']['USER_SCORE'] = obj['RED_SCORE']['RANK_SCORE'] = [];
        obj['BLUE_SCORE']['USER_SCORE'] = obj['BLUE_SCORE']['RANK_SCORE'] = [];

        let red_rank_list = await getTeamRankList(pan_room_list_redis, req.body.room_number, 'RED');
        let blue_rank_list = await getTeamRankList(pan_room_list_redis, req.body.room_number, 'BLUE');

        for(let i = 0; i < red_rank_list.length; i ++) {
            let _user_detail = await getGameDataObject(4, pan_room_list_redis, req.body.room_number, 0, red_rank_list[i]);
            obj['RED_SCORE']['RANK_SCORE'].push({
                'PK': _user_detail.PK,
                'SOCKET': _user_detail.SOCKET,
                'NICKNAME': _user_detail.NICKNAME,
                'AVATAR': _user_detail.AVATAR,
                'SCORE': (await getUserScore(pan_room_list_redis, req.body.room_number, red_rank_list[i], 'RED')),
                'INDEX': _user_detail.INDEX
            });
        }
        obj['RED_SCORE']['USER_SCORE'] = obj['RED_SCORE']['RANK_SCORE'];
        obj['RED_SCORE']['USER_SCORE'].sort(function(a, b) {
            return a.INDEX - b.INDEX;
        });

        for(let i = 0; i < blue_rank_list.length; i ++) {
            let _user_detail = await getGameDataObject(4, pan_room_list_redis, req.body.room_number, 0, blue_rank_list[i]);
            obj['BLUE_SCORE']['RANK_SCORE'].push({
                'PK': _user_detail.PK,
                'SOCKET': _user_detail.SOCKET,
                'NICKNAME': _user_detail.NICKNAME,
                'AVATAR': _user_detail.AVATAR,
                'SCORE': (await getUserScore(pan_room_list_redis, req.body.room_number, blue_rank_list[i], 'BLUE')),
                'INDEX': _user_detail.INDEX
            });
        }
        obj['BLUE_SCORE']['USER_SCORE'] = obj['BLUE_SCORE']['RANK_SCORE'];
        obj['BLUE_SCORE']['USER_SCORE'].sort(function(a, b) {
            return a.INDEX - b.INDEX;
        });

        // play time
        obj['TIME'] = parseInt(_room_detail_info.play_time) * 60;

        // event setting
        obj['EVENTS'] = [];

        for(let i = 0; i < _room_detail_info.event_num; i ++) {
            let event = {};
            let quizs = [];
            for(let j = 0; j < gameConf.EVENT_QUIZ_NUM; j ++) {

                let _quiz = await getGameDataObject(3, pan_room_list_redis, req.body.room_number, i, j);
                let quiz = {
                    ANSWER: _quiz.ANSWER,
                    SCORE: _quiz.SCORE,
                    TEAM: _quiz.TEAM == "" ? null : _quiz.TEAM
                }
                if(_quiz.RIGHTER != null && _quiz.RIGHTER != "") {
                    let _userInfo = await findUserByNickNameInRankList(pan_room_list_redis, req.body.room_number, _quiz.RIGHTER);
                    quiz['RIGHTER'] = _userInfo;
                }     
                else {
                    quiz['RIGHTER'] = null;
                }
                quizs.push(quiz);
                event['TIME'] = _quiz.TIME;

            }
            event['QUIZ'] = quizs;
            obj['EVENTS'].push(event);
        }
        
        return res.json({ 'ERR_CODE': res_code.SUCCESS, 'DATA': obj });
    }
    catch(err22) {
        return res.json({ 'ERR_CODE': err22 });
    }
}

exports.setGameTimer = function(req, res) {
    return res.json({ 'ERR_CODE': res_code.SUCCESS });
}









