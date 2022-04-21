const credis = require('./module/redis');
const res_code = require('../config/res_code');
const redis_config = require('../config/redis.json')[process.env.NODE_ENV || 'development']['REDIS_KEY'];
const gamecfg = require('./../config/game.json');
const wlccfg  = require('./../config/word_level_ctrl.json');
const { isEmpty, getLevelWord, getWordLevel, getGosuWordLevel, judgement_score, getComboAttackType } = require('../utils/global');
const room_state = require('./module/define').ROOM_STATE;
const combo_attack_type = require('./module/define').COMBO_ATTACK_TYPYE;
const TIME = require('./../utils/time');

const word_shuffle_combo_attack_word_type_3 = require('./module/load').word_shuffle_combo_attack_word_type_3;
const word_shuffle_combo_attack_word_type_4 = require('./module/load').word_shuffle_combo_attack_word_type_4;
const word_shuffle_combo_attack_word_type_5 = require('./module/load').word_shuffle_combo_attack_word_type_5;
const word_shuffle_combo_attack_word_type_6 = require('./module/load').word_shuffle_combo_attack_word_type_6;

const normal_1_word_shuffle = require('./module/load').normal_1_word_shuffle;
const normal_2_word_shuffle = require('./module/load').normal_2_word_shuffle;
const normal_3_word_shuffle = require('./module/load').normal_3_word_shuffle;
const normal_4_word_shuffle = require('./module/load').normal_4_word_shuffle;
const normal_5_word_shuffle = require('./module/load').normal_5_word_shuffle;
const normal_6_word_shuffle = require('./module/load').normal_6_word_shuffle;

// 단어 리소스 적재
const getNormal_1_word      = require('./module/load').getNormal_1_word;
const getNormal_2_word      = require('./module/load').getNormal_2_word;
const getNormal_3_word      = require('./module/load').getNormal_3_word;
const getNormal_4_word      = require('./module/load').getNormal_4_word;
const getNormal_5_word      = require('./module/load').getNormal_5_word;
const getNormal_6_word      = require('./module/load').getNormal_6_word;

const getcombo_attack_word_type3 = require('./module/load').getcombo_attack_word_type3;
const getcombo_attack_word_type4 = require('./module/load').getcombo_attack_word_type4;
const getcombo_attack_word_type5 = require('./module/load').getcombo_attack_word_type5;
const getcombo_attack_word_type6 = require('./module/load').getcombo_attack_word_type6;

const { getUserSocketListInRoom, removeInArray, setRoomDetailInfo, getUserDetailInfo, setUserDetailInfo, 
    removeRedisInfo, addDataToArray, getRoomDetail, getValueByIdx, updateScore, getUserScore, 
    getUserSessionListInRoom, getListFromArray, getHashValue, removeRoomInRoomList, setUserScore, setHashValue } = require('./module/setCoinModule');
const { findUser, getOtherUser, setDataToArray, getComboAttackWord, roomGetWordLevelS1, roomGetWordLevelS2, 
    sendComboAttack, isRestart, userReset, getEnterOtherNickName, roomReset, deleteRoomMethod } = require('./module/setCoinMethod');

exports.roomGameReady = async function(req, res) {
    if(isEmpty(req.body.server_idx) || isEmpty(req.body.room_number) || isEmpty(req.body.session_id)) {
        res.json({ 'ERR_CODE': res_code.INVALID_PARAM });   
        return;       
    }
    console.log("=======================게임 준비상태=====================");
    const setcoinserver1_redis = credis.getSetcoinRoomChannel(req.body.server_idx);   
    try {
        let _usr = await getUserDetailInfo(setcoinserver1_redis, req.body.session_id);

        if(_usr === null || _usr === undefined) 
            return res.json({ 'ERR_CODE': res_code.GET_USER_DETAIL_FAIL });                  

        let _ousr = await getOtherUser(setcoinserver1_redis, req.body.room_number, req.body.session_id);

        if(_ousr === null || _ousr === undefined)
            return res.json({ 'ERR_CODE': res_code.GET_USER_DETAIL_FAIL });                  
        
        await setRoomDetailInfo(setcoinserver1_redis, req.body.room_number, {state: room_state.GAME_PLAY_READY, update_time: Math.floor(Date.now() / 1000)});
        //단어 셔플하기

        word_shuffle_combo_attack_word_type_3();
        word_shuffle_combo_attack_word_type_4();
        word_shuffle_combo_attack_word_type_5();
        word_shuffle_combo_attack_word_type_6();

        normal_1_word_shuffle();
        normal_2_word_shuffle();
        normal_3_word_shuffle();
        normal_4_word_shuffle();
        normal_5_word_shuffle();
        normal_6_word_shuffle();

        //단어 저장하기
        let _1word = getNormal_1_word(gamecfg.MAX_NORMAL_WORDS);
        let _2word = getNormal_2_word(gamecfg.MAX_NORMAL_WORDS);
        let _3word = getNormal_3_word(gamecfg.MAX_NORMAL_WORDS);
        let _4word = getNormal_4_word(gamecfg.MAX_NORMAL_WORDS);
        let _5word = getNormal_5_word(gamecfg.MAX_NORMAL_WORDS);
        let _6word = getNormal_6_word(gamecfg.MAX_NORMAL_WORDS);       

        await setUserScore(setcoinserver1_redis, redis_config.USER_SCORE_KEY + '_' + req.body.session_id, 'heart_count', 3);
        await setUserScore(setcoinserver1_redis, redis_config.USER_SCORE_KEY + '_' + _ousr.session_id, 'heart_count', 3);

        let _combo_attack_wordlist_type3 = getcombo_attack_word_type3(gamecfg.MAX_COMBO_ATTACK_TYPE_3);
        let _combo_attack_wordlist_type4 = getcombo_attack_word_type4(gamecfg.MAX_COMBO_ATTACK_TYPE_4);
        let _combo_attack_wordlist_type5 = getcombo_attack_word_type5(gamecfg.MAX_COMBO_ATTACK_TYPE_5);
        let _combo_attack_wordlist_type6 = getcombo_attack_word_type6(gamecfg.MAX_COMBO_ATTACK_TYPE_6);

        await setDataToArray(setcoinserver1_redis, redis_config.COMBO_ATTACK_TYPE + '_3_' + req.body.room_number, _combo_attack_wordlist_type3);
        await setDataToArray(setcoinserver1_redis, redis_config.COMBO_ATTACK_TYPE + '_4_' + req.body.room_number, _combo_attack_wordlist_type4);
        await setDataToArray(setcoinserver1_redis, redis_config.COMBO_ATTACK_TYPE + '_5_' + req.body.room_number, _combo_attack_wordlist_type5);
        await setDataToArray(setcoinserver1_redis, redis_config.COMBO_ATTACK_TYPE + '_6_' + req.body.room_number, _combo_attack_wordlist_type6);

        //시간 설정
        let _start_time = TIME.getTime();  //초로 저장...

        await setRoomDetailInfo(setcoinserver1_redis, req.body.room_number, {game_start_time: _start_time, start_date: TIME.getYMD(_start_time)});

        //워드 레벨 리셋
        await removeRedisInfo(setcoinserver1_redis, redis_config.WORD_LEVEL + '1_' + req.body.room_number);
        await removeRedisInfo(setcoinserver1_redis, redis_config.WORD_LEVEL + '2_' + req.body.room_number);
        await removeRedisInfo(setcoinserver1_redis, redis_config.WORD_LEVEL + '3_' + req.body.room_number);
        await removeRedisInfo(setcoinserver1_redis, redis_config.WORD_LEVEL + '4_' + req.body.room_number);
        await removeRedisInfo(setcoinserver1_redis, redis_config.WORD_LEVEL + '5_' + req.body.room_number);
        await removeRedisInfo(setcoinserver1_redis, redis_config.WORD_LEVEL + '6_' + req.body.room_number);


        //단어 설정
        await removeRedisInfo(setcoinserver1_redis, redis_config.WORD_LEVEL_LIST + '_' + req.body.room_number);

        //레벨1
        for(let i = 0; i < gamecfg.MAX_WORD_POOL; i ++)
            await addDataToArray(setcoinserver1_redis, redis_config.WORD_LEVEL + '1_' + req.body.room_number, _1word[i]);
        let _lv = wlccfg.WORD_LEVEL_1;
        let _wlv = getLevelWord(_lv);
        await addDataToArray(setcoinserver1_redis, redis_config.WORD_LEVEL_LIST + '_' + req.body.room_number, _wlv);

        //레벨2
        for(let i = 0; i < gamecfg.MAX_WORD_POOL; i ++)
            await addDataToArray(setcoinserver1_redis, redis_config.WORD_LEVEL + '2_' + req.body.room_number, _2word[i]);
        _lv = wlccfg.WORD_LEVEL_2;
        _wlv = getLevelWord(_lv);
        await addDataToArray(setcoinserver1_redis, redis_config.WORD_LEVEL_LIST + '_' + req.body.room_number, _wlv);

        //레벨3
        for(let i = 0; i < gamecfg.MAX_WORD_POOL; i ++)
            await addDataToArray(setcoinserver1_redis, redis_config.WORD_LEVEL + '3_' + req.body.room_number, _3word[i]);
        _lv = wlccfg.WORD_LEVEL_3;
        _wlv = getLevelWord(_lv);
        await addDataToArray(setcoinserver1_redis, redis_config.WORD_LEVEL_LIST + '_' + req.body.room_number, _wlv);

        //레벨4
        for(let i = 0; i < gamecfg.MAX_WORD_POOL; i ++)
            await addDataToArray(setcoinserver1_redis, redis_config.WORD_LEVEL + '4_' + req.body.room_number, _4word[i]);
        _lv = wlccfg.WORD_LEVEL_4;
        _wlv = getLevelWord(_lv);
        await addDataToArray(setcoinserver1_redis, redis_config.WORD_LEVEL_LIST + '_' + req.body.room_number, _wlv);

        //레벨5
        for(let i = 0; i < gamecfg.MAX_WORD_POOL; i ++)
            await addDataToArray(setcoinserver1_redis, redis_config.WORD_LEVEL + '5_' + req.body.room_number, _5word[i]);
        _lv = wlccfg.WORD_LEVEL_5;
        _wlv = getLevelWord(_lv);
        await addDataToArray(setcoinserver1_redis, redis_config.WORD_LEVEL_LIST + '_' + req.body.room_number, _wlv);

        //레벨6
        for(let i = 0; i < gamecfg.MAX_WORD_POOL; i ++)
            await addDataToArray(setcoinserver1_redis, redis_config.WORD_LEVEL + '6_' + req.body.room_number, _6word[i]);
        _lv = wlccfg.WORD_LEVEL_6;
        _wlv = getLevelWord(_lv);
        await addDataToArray(setcoinserver1_redis, redis_config.WORD_LEVEL_LIST + '_' + req.body.room_number, _wlv);

        await setRoomDetailInfo(setcoinserver1_redis, req.body.room_number, { state: room_state.GAME_PAYING });

        return res.json({ 'ERR_CODE': res_code.SUCCESS, 'DATA': {
            'USER': _usr,
            'OUSER': _ousr
        }});
    }
    catch(err22) {
        return res.json({ 'ERR_CODE': err22 });              
    }
}

exports.newWord = async function(req, res) {
    if(isEmpty(req.body.server_idx) || isEmpty(req.body.room_number) || isEmpty(req.body.session_id)) {
        res.json({ 'ERR_CODE': res_code.INVALID_PARAM });   
        return;       
    }
    
    const setcoinserver1_redis = credis.getSetcoinRoomChannel(req.body.server_idx);   
    try {
        //콤보 공격받은 경우 콤보 단어를 전달한다.    
        let _word;
        let _is_received_combo_attack = false;
        let _receive_combo_attack = -1;
        let _user = await getUserDetailInfo(setcoinserver1_redis, req.body.session_id);
        if(_user.received_combo_attack == 1) {
            //콤보 공격 받을 경우     
            let _type = _user.received_combo_attack_type;
            _receive_combo_attack = _type;
            _word = await getComboAttackWord(setcoinserver1_redis, _type, req.body.room_number);
            _is_received_combo_attack = true;
            //콤보 공격 받은 상태 플래그 꺼줌
            await setUserDetailInfo(setcoinserver1_redis, req.body.session_id, {received_combo_attack: 0});
        }
        else {
            //콤보 공격 받지 않은 경우
            let _start_time = await getRoomDetail(setcoinserver1_redis, req.body.room_number, 'game_start_time');
            let _lv;
            if(req.body.server_idx <= 1000) {
                _lv = getWordLevel(_start_time);
            } else {
                _lv = getGosuWordLevel(_start_time);
            }
            console.log("난위도 : " + _lv);
            let _wlv = await getValueByIdx(setcoinserver1_redis, redis_config.WORD_LEVEL_LIST + '_' + req.body.room_number, parseInt(_lv) - 1);
            console.log("음절 : "+_wlv);

            if(req.body.server_idx <= 1000) {   
                _word = await roomGetWordLevelS1(setcoinserver1_redis, _wlv, req.body.session_id, req.body.room_number);
            }
            else {
                _word = await roomGetWordLevelS2(setcoinserver1_redis, _wlv, req.body.session_id, req.body.room_number);
            }
        }
        console.log("new word====", _word);
        await setUserDetailInfo(setcoinserver1_redis, req.body.session_id, {check_word: _word, new_word_send_time: TIME.getTime()});
        
        return res.json({
            'ERR_CODE': res_code.SUCCESS,
            'DATA': {
                'new_word': _word,
                'combo_attack': _is_received_combo_attack,
                'combo_attack_type': _receive_combo_attack
            }
        });
    }
    catch(err22) {
        return res.json({ 'ERR_CODE': err22 });              
    }    
}

exports.inputWordTimeOver = async function(req, res) {

    if(isEmpty(req.body.server_idx) || isEmpty(req.body.room_number) || isEmpty(req.body.session_id) || isEmpty(req.body.nickname)) {
        res.json({ 'ERR_CODE': res_code.INVALID_PARAM });   
        return;       
    }
    const setcoinserver1_redis = credis.getSetcoinRoomChannel(req.body.server_idx);   
    try {
        let _ousr = await getOtherUser(setcoinserver1_redis, req.body.room_number, req.body.session_id);
        if(_ousr == null || _ousr == undefined) {
            return res.json({ 'ERR_CODE': res_code.SUCCESS, 'RES_CODE': 1 });
        }
        let _usr = await getUserDetailInfo(setcoinserver1_redis, req.body.session_id);
        if(_usr == null || _usr == undefined) {
            return res.json({ 'ERR_CODE': res_code.SUCCESS, 'RES_CODE': 4 });
        }

        let _heart = await getUserScore(setcoinserver1_redis, redis_config.USER_SCORE_KEY + '_' + req.body.session_id, 'heart_count');
        if(_heart < 0) {
            return res.json({ 'ERR_CODE': res_code.SUCCESS, 'RES_CODE': 2 });
        }

        //차감된 하트개수 세팅
        await updateScore(setcoinserver1_redis, redis_config.USER_SCORE_KEY + '_' + req.body.session_id, 'heart_count', -1);

        let _combo_attack_count = _usr.combo_attack_count;
        let _combo_attack_type = getComboAttackType(_combo_attack_count);

        let _able = (parseInt(_combo_attack_count) >= 3);
        if(_able) {
            await setUserDetailInfo(setcoinserver1_redis, _ousr.session_id, {received_combo_attack_type: _combo_attack_type, received_combo_attack: 1});
        }
        await setUserDetailInfo(setcoinserver1_redis, req.body.session_id, {combo_attack_count: 0});        

        _combo_attack_count = 0;
        _heart --;

        if(_heart == 0) {
            //게임오버 처리해야함...        
            // console.log('input_word_time_over >> heart count is zero..');
            await setUserDetailInfo(setcoinserver1_redis, req.body.session_id, {is_end: 1});        
        }

        return res.json({ 'ERR_CODE': res_code.SUCCESS, 'RES_CODE': 3, 'DATA': {
            nick_name: req.body.nickname,
            heart_count: _heart,
            is_combo_attack: _able,
            combo_attack_type: _combo_attack_type,
            combo_count: 0, 
            usr_socket: _usr.socket,
            ousr_socket: _ousr.socket
        } });              
    }
    catch(err22) {
        return res.json({ 'ERR_CODE': err22 });              
    }

}

exports.checkWord = async function(req, res) {
    if(isEmpty(req.body.server_idx) || isEmpty(req.body.room_number) || isEmpty(req.body.session_id) || isEmpty(req.body.o_session_id)) {
        res.json({ 'ERR_CODE': res_code.INVALID_PARAM });   
        return;       
    }

    const setcoinserver1_redis = credis.getSetcoinRoomChannel(req.body.server_idx);   
    
    try {
        let _combo_attack_type = combo_attack_type.ATTACK_TYPE_INIT;
        let _combo_attack_count = 0;
        let _able = false;
        let _score;
        let _coin_count;
        if(parseInt(req.body.is_combo_flag) === 0){  //2초 안에 입력했을 경우          
            
            //2초안에 단어 입력했지만 콤보카운트가 6개이면 발동 한다.
            let _cnt = await getUserDetailInfo(setcoinserver1_redis, req.body.session_id, 'combo_attack_count');
            if(_cnt == 6) {
                _able = true;
                _combo_attack_type = combo_attack_type.ATTACK_TYPE_6;
                _combo_attack_count = 1;
                await setUserDetailInfo(setcoinserver1_redis, req.body.session_id, {combo_attack_count: _combo_attack_count});
                console.log("check_word...11111 : able" + _able + " attack_type : " + _combo_attack_type);
                await setUserDetailInfo(setcoinserver1_redis, req.body.o_session_id, {received_combo_attack_type: _combo_attack_type, received_combo_attack: 1});
            }
            else {
                //콤보 공격 한개 획득
                await setUserDetailInfo(setcoinserver1_redis, req.body.session_id, { combo_attack_count: parseInt(_cnt) + 1 });
                _combo_attack_count = parseInt(_cnt) + 1
                console.log("cac : " +  _combo_attack_count);
                //6개면 바로 발동
                if(_combo_attack_count == 6) {   
                    _score = judgement_score(_combo_attack_count, req.body.session_id);
                    _combo_attack_type = getComboAttackType(_combo_attack_count);
                    await setUserDetailInfo(setcoinserver1_redis, req.body.session_id, {combo_attack_count: 0});
                    await setUserDetailInfo(setcoinserver1_redis, req.body.o_session_id, {received_combo_attack_type: _combo_attack_type, received_combo_attack: 1});
                    await updateScore(setcoinserver1_redis, redis_config.USER_SCORE_KEY + '_' + req.body.session_id, 'coin_count', 1);
                    let _ret_data = await sendComboAttack(setcoinserver1_redis, _score, req.body.session_id, _combo_attack_count, true, _combo_attack_type, req.body.is_combo_flag, req.body.bad_coin_count);   
                    return res.json({ 'ERR_CODE': res_code.SUCCESS, 'DATA': _ret_data });                     
                }
            }
        }
        else {
            let _cnt = await getUserDetailInfo(setcoinserver1_redis, req.body.session_id, 'combo_attack_count');
            //콤보 공격가능 한지 체크
            console.log("combo count: " + _cnt);

            if(_cnt >= 3) {
                _able = true;
                _combo_attack_type = getComboAttackType(_cnt);
                await setUserDetailInfo(setcoinserver1_redis, req.body.o_session_id, {received_combo_attack_type: _combo_attack_type, received_combo_attack: 1});            
            }
            _combo_attack_count = 0;
            await setUserDetailInfo(setcoinserver1_redis, req.body.session_id, {combo_attack_count: 0});       
        }

        //유저의 스코 가져오기;
        _score = judgement_score(_combo_attack_count, req.body.session_id);
        console.log(" able : "+_able+ " cat : "+_combo_attack_type);

        //코인 개수 가져와 증가
        await updateScore(setcoinserver1_redis, redis_config.USER_SCORE_KEY + '_' + req.body.session_id, 'coin_count', 1);

        let _ret_data = await sendComboAttack(setcoinserver1_redis, _score, req.body.session_id, _combo_attack_count, _able, _combo_attack_type, req.body.is_combo_flag, req.body.bad_coin_count);
        return res.json({ 'ERR_CODE': res_code.SUCCESS, 'DATA': _ret_data });                     
    }
    catch(err22) {
        return res.json({ 'ERR_CODE': err22 });                     
    }
}

exports.userLeave = async function(req, res) {
    if(isEmpty(req.body.server_idx) || isEmpty(req.body.session_id) || isEmpty(req.body.room_number)) {
        res.json({ 'ERR_CODE': res_code.INVALID_PARAM });   
        return;       
    }      
    const setcoinserver1_redis = credis.getSetcoinRoomChannel(req.body.server_idx); 
    try {
        if( !(await findUser(setcoinserver1_redis, req.body.room_number, req.body.session_id)) ) {
            res.json({ 'ERR_CODE': res_code.SUCCESS, 'FIND_USER_NULL': true });       
            return;
        }

        await removeInArray(setcoinserver1_redis, redis_config.USER_LIST_KEY + '_' + req.body.room_number, req.body.session_id);
        await addDataToArray(setcoinserver1_redis, redis_config.L_USER_LIST_KEY + '_' + req.body.room_number, req.body.session_id);
        await updateScore(setcoinserver1_redis, redis_config.ROOM_SCORE_KEY + '_' + req.body.room_number, 'current_user_count', -1);

        let _socket_list = [];
        _socket_list = await getUserSocketListInRoom(setcoinserver1_redis, req.body.room_number);

        res.json({ 'ERR_CODE': res_code.SUCCESS, 'FIND_USER_NULL': false, 'SOCKET_LIST': _socket_list });   
        return;
    }
    catch(err22) {
        return res.json({ 'ERR_CODE': err22 });                     
    }
}

exports.reGameStart = async function(req, res) {

    if(isEmpty(req.body.server_idx) || isEmpty(req.body.room_number)) {
        res.json({ 'ERR_CODE': res_code.INVALID_PARAM });   
        return;               
    }

    const setcoinserver1_redis = credis.getSetcoinRoomChannel(req.body.server_idx);   
    try {
        if(!(await isRestart(setcoinserver1_redis, req.body.room_number))) {
            res.json({ 'ERR_CODE': res_code.SUCCESS, 'IS_RESTART': false });   
            return;
        }
        await roomReset(setcoinserver1_redis, req.body.room_number);
        await setRoomDetailInfo(setcoinserver1_redis, req.body.room_number, {state: 2, update_time: Math.floor(Date.now() / 1000)});
        let _user_list = await getUserSessionListInRoom(setcoinserver1_redis, req.body.room_number);
        for(let i = 0; i < _user_list.length; i ++) {
            await userReset(setcoinserver1_redis, _user_list[i]);
        }
        return res.json({ 'ERR_CODE': res_code.SUCCESS, 'IS_RESTART': true });                     
    }
    catch(err22) {
        return res.json({ 'ERR_CODE': err22 });                     
    }

}

exports.getUserBySocket = async function(req, res) {
    if(isEmpty(req.body.server_idx) || isEmpty(req.body.socket)) {
        res.json({ 'ERR_CODE': res_code.INVALID_PARAM });   
        return;                              
    }

    const setcoinserver1_redis = credis.getSetcoinRoomChannel(req.body.server_idx);
    try {
        let _session_id = await getHashValue(setcoinserver1_redis, redis_config.SESSION_SOCKET + '_' + req.body.socket, 'session_id');
        let _usr = await getUserDetailInfo(setcoinserver1_redis, _session_id);
        return res.json({ 'ERR_CODE': res_code.SUCCESS, 'DATA': _usr });
    }
    catch(err22) {
        return res.json({ 'ERR_CODE': err22 });
    }
}

exports.deleteUser = async function(req, res) {
    if(isEmpty(req.body.server_idx) || isEmpty(req.body.socket) || isEmpty(req.body.session_id)) {
        res.json({ 'ERR_CODE': res_code.INVALID_PARAM });   
        return;
    }
    const setcoinserver1_redis = credis.getSetcoinRoomChannel(req.body.server_idx);
    try {
        //SETCOIN_USER_DETAIL(_nickname) (HASH)
        await removeRedisInfo(setcoinserver1_redis, redis_config.USER_DETAIL_KEY + '_' + req.body.session_id);    
        //SETCOIN_USER_SCORE(_nickname) (SORTED_SET)
        await removeRedisInfo(setcoinserver1_redis, redis_config.USER_SCORE_KEY + '_' + req.body.session_id);
        //NICKNAME_SOCKET(_socket_id)
        await removeRedisInfo(setcoinserver1_redis, redis_config.SESSION_SOCKET + '_' + req.body.socket);
        await removeInArray(setcoinserver1_redis, redis_config.MEMBER_LIST, req.body.session_id);

        return res.json({ 'ERR_CODE': res_code.SUCCESS });        
    }
    catch(err22) {
        return res.json({ 'ERR_CODE': err22 });        
    }
}

exports.getEnterOtherNickName = async function(req, res) {
    if(isEmpty(req.body.server_idx) || isEmpty(req.body.room_number) || isEmpty(req.body.session_id)) {
        res.json({ 'ERR_CODE': res_code.INVALID_PARAM });
        return;
    }
    const setcoinserver1_redis = credis.getSetcoinRoomChannel(req.body.server_idx);
    try {
        let _o_nick_name = await getEnterOtherNickName(setcoinserver1_redis, req.body.room_number, req.body.session_id);
        return res.json({ 'ERR_CODE': res_code.SUCCESS, 'DATA': _o_nick_name });
    }
    catch(err22) {
        return res.json({ 'ERR_CODE': err22 });
    }
}

exports.deleteRoom = async function(req, res) {
    // is_force remove
    if(isEmpty(req.body.server_idx) || isEmpty(req.body.room_number)) {
        res.json({ 'ERR_CODE': res_code.INVALID_PARAM });   
        return;
    }
    const setcoinserver1_redis = credis.getSetcoinRoomChannel(req.body.server_idx);
    try {
        let _current_user_count = await getUserScore(setcoinserver1_redis, redis_config.ROOM_SCORE_KEY + '_' + req.body.room_number, 'current_user_count');
        if( (!isEmpty(req.body.is_force) && req.body.is_force) 
        ||  _current_user_count == 0) {
            /*
            // 강제 삭제
            await removeRoomInRoomList(setcoinserver1_redis, req.body.room_number);
            // SETCOIN_ROOM_DETAIL_(room_number)
            await removeRedisInfo(setcoinserver1_redis, redis_config.ROOM_DETAIL_KEY + '_' + req.body.room_number);
            // SETCOIN_ROOM_SCORE_(room_number)
            await removeRedisInfo(setcoinserver1_redis, redis_config.ROOM_SCORE_KEY + '_' + req.body.room_number);
            // SET_COIN_USER_LIST_(room_number)
            await removeRedisInfo(setcoinserver1_redis, redis_config.USER_LIST_KEY + '_' + req.body.room_number);
            // SET_COIN_L_USER_LIST_(room_number)
            await removeRedisInfo(setcoinserver1_redis, redis_config.L_USER_LIST_KEY + '_' + req.body.room_number);
            // WORD_LEVEL_LIST_(room_number) 
            await removeRedisInfo(setcoinserver1_redis, redis_config.WORD_LEVEL_LIST + '_' + req.body.room_number);
            // SET_COIN_COMBO_A_3,  SET_COIN_COMBO_A_4,  SET_COIN_COMBO_A_5,  SET_COIN_COMBO_A_6
            await removeRedisInfo(setcoinserver1_redis, redis_config.COMBO_ATTACK_TYPE + '_3_' + req.body.room_number);
            await removeRedisInfo(setcoinserver1_redis, redis_config.COMBO_ATTACK_TYPE + '_4_' + req.body.room_number);
            await removeRedisInfo(setcoinserver1_redis, redis_config.COMBO_ATTACK_TYPE + '_5_' + req.body.room_number);
            await removeRedisInfo(setcoinserver1_redis, redis_config.COMBO_ATTACK_TYPE + '_6_' + req.body.room_number);
            // SET_COIN_WORD_LEVEL(1~6)_(room_number)
            await removeRedisInfo(setcoinserver1_redis, redis_config.WORD_LEVEL + '1_' + req.body.room_number);
            await removeRedisInfo(setcoinserver1_redis, redis_config.WORD_LEVEL + '2_' + req.body.room_number);
            await removeRedisInfo(setcoinserver1_redis, redis_config.WORD_LEVEL + '3_' + req.body.room_number);
            await removeRedisInfo(setcoinserver1_redis, redis_config.WORD_LEVEL + '4_' + req.body.room_number);
            await removeRedisInfo(setcoinserver1_redis, redis_config.WORD_LEVEL + '5_' + req.body.room_number);
            await removeRedisInfo(setcoinserver1_redis, redis_config.WORD_LEVEL + '6_' + req.body.room_number); */

            await deleteRoomMethod(setcoinserver1_redis, req.body.room_number);

            return res.json({ 'ERR_CODE': res_code.SUCCESS, 'DELETE_DONE': true });    
        }
        else {
            return res.json({ 'ERR_CODE': res_code.SUCCESS, 'DELETE_DONE': false });    
        }
    }
    catch(err22) {
        return res.json({ 'ERR_CODE': err22 });
    }
}

exports.replaceSocketBySessionId = async function(req, res) {
    if(isEmpty(req.body.server_idx) || isEmpty(req.body.session_id) || isEmpty(req.body.socket)) {
        res.json({ 'ERR_CODE': res_code.INVALID_PARAM });   
        return;       
    }
    const setcoinserver1_redis = credis.getSetcoinRoomChannel(req.body.server_idx);
    try {
        let _old_socket = await getUserDetailInfo(setcoinserver1_redis, req.body.session_id, 'socket');
        await removeRedisInfo(setcoinserver1_redis, redis_config.SESSION_SOCKET + '_' + _old_socket);
        await setUserDetailInfo(setcoinserver1_redis, req.body.session_id, { socket: req.body.socket });
        await setHashValue(setcoinserver1_redis, redis_config.SESSION_SOCKET + '_' + req.body.socket, {session_id: req.body.session_id});
        return res.json({ 'ERR_CODE': res_code.SUCCESS });
    }
    catch(err22) {
        return res.json({ 'ERR_CODE': err22 });
    }
}