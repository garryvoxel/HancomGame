const credis = require('./module/redis');
const res_code = require('../config/res_code');
const redis_config = require('../config/redis.json')[process.env.NODE_ENV || 'development']['REDIS_KEY'];
const gamecfg = require('./../config/game.json');
const { getOtherUser, getLeaveUserNickName } = require('./module/setCoinMethod');
const { getUserDetailInfo, getUserScore, getRoomDetail, setUserDetailInfo, 
    setRoomDetailInfo, updateScore } = require('./module/setCoinModule');
const { isEmpty, check_bonus } = require('../utils/global');

const write_game_result     = require('./module/call_apiserver').write_game_result;
const start_end_game_log    = require('./module/call_apiserver').start_end_game_log;
const update_point          = require('./module/call_apiserver').update_point;

exports.gameResult = async function(req, res) {
    if(isEmpty(req.body.server_idx) || isEmpty(req.body.room_number) || isEmpty(req.body.session_id)) {
        res.json({ 'ERR_CODE': res_code.INVALID_PARAM });   
        return;       
    }

    const setcoinserver1_redis = credis.getSetcoinRoomChannel(req.body.server_idx);   
    try {
        let is_draw = 0;
        let _rdata = {};
        //상대방 유저 가져오기
        let _ouser = await getOtherUser(setcoinserver1_redis, req.body.room_number, req.body.session_id);
        let _user = await getUserDetailInfo(setcoinserver1_redis, req.body.session_id);

        _user.win = await getUserScore(setcoinserver1_redis, redis_config.USER_SCORE_KEY + '_' + req.body.session_id, 'win');
        _user.lose = await getUserScore(setcoinserver1_redis, redis_config.USER_SCORE_KEY + '_' + req.body.session_id, 'lose');
        _user.draw = await getUserScore(setcoinserver1_redis, redis_config.USER_SCORE_KEY + '_' + req.body.session_id, 'draw');
        _user.score = await getUserScore(setcoinserver1_redis, redis_config.USER_SCORE_KEY + '_' + req.body.session_id, 'score');
        _user.heart_count = await getUserScore(setcoinserver1_redis, redis_config.USER_SCORE_KEY + '_' + req.body.session_id, 'heart_count');
        _user.coin_count = await getUserScore(setcoinserver1_redis, redis_config.USER_SCORE_KEY + '_' + req.body.session_id, 'coin_count');

        let _room = await getRoomDetail(setcoinserver1_redis, req.body.room_number);

        setRoomDetailInfo(setcoinserver1_redis, req.body.room_number, {update_time: Math.floor(Date.now() / 1000)});

        if(_ouser == null)  {
            //승 세팅
            _rdata.win              = true;
            _rdata.draw             = false;
            _rdata.win_count        = parseInt(await updateScore(setcoinserver1_redis, redis_config.USER_SCORE_KEY + '_' + req.body.session_id, 'win', 1));
            _rdata.lose_count       = parseInt(_user.lose);
            _rdata.draw_count       = parseInt(_user.draw);

            let _point = 0;

            //포인트 세팅
            if(_user.is_user == 1) {
                _point = Math.round(gamecfg.WIN_POINT * parseInt(_room.play_time) / 3);
                _rdata.point = _point;
            }

            let _score = parseInt(_user.score);
            let _bscore = check_bonus(_user);

            _rdata.score        = _score + _bscore;
            _rdata.coin_count   = parseInt(_user.coin_count);

            //상대방 정보
            let _onn = await getLeaveUserNickName(setcoinserver1_redis, req.body.room_number, req.body.session_id);

            _rdata.other_nick_name = _onn;
            _rdata.other_score = 0;
            _rdata.other_coin_count = 0;
            _rdata.other_win_count = 0;
            _rdata.other_lose_count = 0;
            _rdata.other_draw_count = 0;    

            if(_user.is_user == 1) {
                write_game_result(_user.uuid, _user.nickname, 0, ()=>{});    

                start_end_game_log( _user.uuid, _user.nickname,
                                    1, _onn, 2, 1, _user.total_score,
                                    _room.start_date, _room.end_date, ()=>{});                

                update_point(_user.uuid, _point, _user.nickname, () => {});
            }

            res.json({ 'ERR_CODE': res_code.SUCCESS, 'DATA': _rdata });                  

            return;
        }

        //
        let A_win_count = _user.win;
        let A_lose_count = _user.lose;
        let A_draw_count = _user.draw;
        
        let B_win_count = _ouser.win;
        let B_lose_count = _ouser.lose;
        let B_draw_count = _ouser.draw;
        //
        let r_A_win_count = 'win_calc_A';
        let r_A_lose_count = 'lose_calc_A';
        let r_A_draw_count = 'draw_calc_A';

        let r_B_win_count = 'win_calc_B';
        let r_B_lose_count = 'lose_calc_B';
        let r_B_draw_count = 'draw_calc_B';

        if(_room.host_session_id != req.body.session_id) {
            r_A_win_count = 'win_calc_B';
            r_A_lose_count = 'lose_calc_B';
            r_A_draw_count = 'draw_calc_B';

            r_B_win_count = 'win_calc_A';
            r_B_lose_count = 'lose_calc_A';
            r_B_draw_count = 'draw_calc_A';
        }


            let _score = parseInt(_user.score);
            let _bscore = check_bonus(_user);           
            await setUserDetailInfo(setcoinserver1_redis, _user.session_id, { total_score: (_score + _bscore) });
            

            let _oscore = parseInt(_ouser.score);
            let _obscore = check_bonus(_ouser);
            await setUserDetailInfo(setcoinserver1_redis, _ouser.session_id, { total_score: (_oscore + _obscore) });

            // await setRoomDetailInfo(setcoinserver1_redis, req.body.room_number, {is_draw: 0}); 
            is_draw = 0;

            //1.하트 검색
            if(_user.heart_count == 0 && _ouser.heart_count == 0) {
                if(_user.coin_count == _ouser.coin_count) {
                    if(_user.score === _ouser.score){
                        //await setRoomDetailInfo(setcoinserver1_redis, req.body.room_number, {is_draw: 1}); 
                        is_draw = 1;
                        if( (await updateScore(setcoinserver1_redis, redis_config.ROOM_SCORE_KEY + '_' + req.body.room_number, r_A_draw_count, 1)) < 2 ) {
                            A_draw_count = await updateScore(setcoinserver1_redis, redis_config.USER_SCORE_KEY + '_' + _user.session_id, 'draw', 1);
                        }
                        else {
                            A_draw_count = await getUserScore(setcoinserver1_redis, redis_config.USER_SCORE_KEY + '_' + _user.session_id, 'draw');
                        }

                        if( (await updateScore(setcoinserver1_redis, redis_config.ROOM_SCORE_KEY + '_' + req.body.room_number, r_B_draw_count, 1)) < 2 ) {
                            B_draw_count = await updateScore(setcoinserver1_redis, redis_config.USER_SCORE_KEY + '_' + _ouser.session_id, 'draw', 1);
                        }
                        else {
                            B_draw_count = await getUserScore(setcoinserver1_redis, redis_config.USER_SCORE_KEY + '_' + _ouser.session_id, 'draw');
                        }

                    }else{

                        if(_user.score > _ouser.score){
                            await setUserDetailInfo(setcoinserver1_redis, _user.session_id, {is_win: 1});
                            await setUserDetailInfo(setcoinserver1_redis, _ouser.session_id, {is_win: 0});

                            if( (await updateScore(setcoinserver1_redis, redis_config.ROOM_SCORE_KEY + '_' + req.body.room_number, r_A_win_count, 1)) < 2 ) {
                                A_win_count = await updateScore(setcoinserver1_redis, redis_config.USER_SCORE_KEY + '_' + _user.session_id, 'win', 1);
                            }
                            else {
                                A_win_count = await getUserScore(setcoinserver1_redis, redis_config.USER_SCORE_KEY + '_' + _user.session_id, 'win');
                            }

                            if( (await updateScore(setcoinserver1_redis, redis_config.ROOM_SCORE_KEY + '_' + req.body.room_number, r_B_lose_count, 1)) < 2 ) {
                                B_lose_count = await updateScore(setcoinserver1_redis, redis_config.USER_SCORE_KEY + '_' + _ouser.session_id, 'lose', 1);
                            }
                            else {
                                B_lose_count = await getUserScore(setcoinserver1_redis, redis_config.USER_SCORE_KEY + '_' + _ouser.session_id, 'lose');
                            }
                            // await updateScore(setcoinserver1_redis, redis_config.USER_SCORE_KEY + '_' + _user.nickname, 'win', 1);
                            // await updateScore(setcoinserver1_redis, redis_config.USER_SCORE_KEY + '_' + _ouser.nickname, 'lose', 1);                            

                        }else{
                            await setUserDetailInfo(setcoinserver1_redis, _user.session_id, {is_win: 0});
                            await setUserDetailInfo(setcoinserver1_redis, _ouser.session_id, {is_win: 1});

                            if( (await updateScore(setcoinserver1_redis, redis_config.ROOM_SCORE_KEY + '_' + req.body.room_number, r_A_lose_count, 1)) < 2 ) {
                                A_lose_count = await updateScore(setcoinserver1_redis, redis_config.USER_SCORE_KEY + '_' + _user.session_id, 'lose', 1);
                            }
                            else {
                                A_lose_count = await getUserScore(setcoinserver1_redis, redis_config.USER_SCORE_KEY + '_' + _user.session_id, 'lose');
                            }

                            if( (await updateScore(setcoinserver1_redis, redis_config.ROOM_SCORE_KEY + '_' + req.body.room_number, r_B_win_count, 1)) < 2 ) {
                                B_win_count = await updateScore(setcoinserver1_redis, redis_config.USER_SCORE_KEY + '_' + _ouser.session_id, 'win', 1);
                            }
                            else {
                                B_win_count = await getUserScore(setcoinserver1_redis, redis_config.USER_SCORE_KEY + '_' + _ouser.session_id, 'win');
                            }
                            // await updateScore(setcoinserver1_redis, redis_config.USER_SCORE_KEY + '_' + _user.nickname, 'lose', 1);
                            // await updateScore(setcoinserver1_redis, redis_config.USER_SCORE_KEY + '_' + _ouser.nickname, 'win', 1);
                        }

                    }               
                } else {
                    //동전 타워 비교
                    if(_user.coin_count > _ouser.coin_count) {
                        await setUserDetailInfo(setcoinserver1_redis, _user.session_id, {is_win: 1});
                        await setUserDetailInfo(setcoinserver1_redis, _ouser.session_id, {is_win: 0});

                        if( (await updateScore(setcoinserver1_redis, redis_config.ROOM_SCORE_KEY + '_' + req.body.room_number, r_A_win_count, 1)) < 2 ) {
                            A_win_count = await updateScore(setcoinserver1_redis, redis_config.USER_SCORE_KEY + '_' + _user.session_id, 'win', 1);
                        }
                        else {
                            A_win_count = await getUserScore(setcoinserver1_redis, redis_config.USER_SCORE_KEY + '_' + _user.session_id, 'win');
                        }

                        if( (await updateScore(setcoinserver1_redis, redis_config.ROOM_SCORE_KEY + '_' + req.body.room_number, r_B_lose_count, 1)) < 2 ) {
                            B_lose_count = await updateScore(setcoinserver1_redis, redis_config.USER_SCORE_KEY + '_' + _ouser.session_id, 'lose', 1);
                        }
                        else {
                            B_lose_count = await getUserScore(setcoinserver1_redis, redis_config.USER_SCORE_KEY + '_' + _ouser.session_id, 'lose');
                        }
                        // await updateScore(setcoinserver1_redis, redis_config.USER_SCORE_KEY + '_' + _user.nickname, 'win', 1);
                        // await updateScore(setcoinserver1_redis, redis_config.USER_SCORE_KEY + '_' + _ouser.nickname, 'lose', 1);
                    } else {
                        await setUserDetailInfo(setcoinserver1_redis, _user.session_id, {is_win: 0});
                        await setUserDetailInfo(setcoinserver1_redis, _ouser.session_id, {is_win: 1});

                        if( (await updateScore(setcoinserver1_redis, redis_config.ROOM_SCORE_KEY + '_' + req.body.room_number, r_A_lose_count, 1)) < 2 ) {
                            A_lose_count = await updateScore(setcoinserver1_redis, redis_config.USER_SCORE_KEY + '_' + _user.session_id, 'lose', 1);
                        }
                        else {
                            A_lose_count = await getUserScore(setcoinserver1_redis, redis_config.USER_SCORE_KEY + '_' + _user.session_id, 'lose');
                        }

                        if( (await updateScore(setcoinserver1_redis, redis_config.ROOM_SCORE_KEY + '_' + req.body.room_number, r_B_win_count, 1)) < 2 ) {
                            B_win_count = await updateScore(setcoinserver1_redis, redis_config.USER_SCORE_KEY + '_' + _ouser.session_id, 'win', 1);
                        }
                        else {
                            B_win_count = await getUserScore(setcoinserver1_redis, redis_config.USER_SCORE_KEY + '_' + _ouser.session_id, 'win');
                        }

                        // await updateScore(setcoinserver1_redis, redis_config.USER_SCORE_KEY + '_' + _user.nickname, 'lose', 1);
                        // await updateScore(setcoinserver1_redis, redis_config.USER_SCORE_KEY + '_' + _ouser.nickname, 'win', 1);
                    }
                }
            } else {
                if(_user.heart_count == 0) { //하트개수가 0일때
                    
                    await setUserDetailInfo(setcoinserver1_redis, _user.session_id, {is_win: 0});
                    await setUserDetailInfo(setcoinserver1_redis, _ouser.session_id, {is_win: 1});
                    
                    if( (await updateScore(setcoinserver1_redis, redis_config.ROOM_SCORE_KEY + '_' + req.body.room_number, r_A_lose_count, 1)) < 2 ) {
                        A_lose_count = await updateScore(setcoinserver1_redis, redis_config.USER_SCORE_KEY + '_' + _user.session_id, 'lose', 1);
                    }
                    else {
                        A_lose_count = await getUserScore(setcoinserver1_redis, redis_config.USER_SCORE_KEY + '_' + _user.session_id, 'lose');
                    }

                    if( (await updateScore(setcoinserver1_redis, redis_config.ROOM_SCORE_KEY + '_' + req.body.room_number, r_B_win_count, 1)) < 2 ) {
                        B_win_count = await updateScore(setcoinserver1_redis, redis_config.USER_SCORE_KEY + '_' + _ouser.session_id, 'win', 1);
                        console.log("1[updateScore]==========", r_B_win_count, B_win_count);
                    }
                    else {
                        B_win_count = await getUserScore(setcoinserver1_redis, redis_config.USER_SCORE_KEY + '_' + _ouser.session_id, 'win');
                        console.log("1[updateScore1234]==========", r_B_win_count, B_win_count);
                    }

                    // await updateScore(setcoinserver1_redis, redis_config.USER_SCORE_KEY + '_' + _user.nickname, 'lose', 1);
                    // await updateScore(setcoinserver1_redis, redis_config.USER_SCORE_KEY + '_' + _ouser.nickname, 'win', 1);

                } else if(_ouser.heart_count == 0) { //상대방하트개수가 0일때
                    
                    await setUserDetailInfo(setcoinserver1_redis, _user.session_id, {is_win: 1});
                    await setUserDetailInfo(setcoinserver1_redis, _ouser.session_id, {is_win: 0});

                    if( (await updateScore(setcoinserver1_redis, redis_config.ROOM_SCORE_KEY + '_' + req.body.room_number, r_A_win_count, 1)) < 2 ) {
                        A_win_count = await updateScore(setcoinserver1_redis, redis_config.USER_SCORE_KEY + '_' + _user.session_id, 'win', 1);
                        console.log("2[updateScore]==========", r_A_win_count, A_win_count);
                    }
                    else {
                        A_win_count = await getUserScore(setcoinserver1_redis, redis_config.USER_SCORE_KEY + '_' + _user.session_id, 'win');
                        console.log("2[updateScore1234]==========", r_A_win_count, A_win_count);
                    }

                    if( (await updateScore(setcoinserver1_redis, redis_config.ROOM_SCORE_KEY + '_' + req.body.room_number, r_B_lose_count, 1)) < 2 ) {
                        B_lose_count = await updateScore(setcoinserver1_redis, redis_config.USER_SCORE_KEY + '_' + _ouser.session_id, 'lose', 1);
                    }
                    else {
                        B_lose_count = await getUserScore(setcoinserver1_redis, redis_config.USER_SCORE_KEY + '_' + _ouser.session_id, 'lose');
                    }

                    // await updateScore(setcoinserver1_redis, redis_config.USER_SCORE_KEY + '_' + _user.nickname, 'win', 1);
                    // await updateScore(setcoinserver1_redis, redis_config.USER_SCORE_KEY + '_' + _ouser.nickname, 'lose', 1);   
                } else {
                    if(_user.coin_count == _ouser.coin_count)     { //동전 타워 비교
                        if( parseInt(await getUserDetailInfo(setcoinserver1_redis, _user.session_id, 'total_score')) ==
                            parseInt(await getUserDetailInfo(setcoinserver1_redis, _ouser.session_id, 'total_score')) ) { //총점수가 같을때                
                            // await setRoomDetailInfo(setcoinserver1_redis, req.body.room_number, {is_draw: 1});
                            is_draw = 1;

                            if( (await updateScore(setcoinserver1_redis, redis_config.ROOM_SCORE_KEY + '_' + req.body.room_number, r_A_draw_count, 1)) < 2 ) {
                                A_draw_count = await updateScore(setcoinserver1_redis, redis_config.USER_SCORE_KEY + '_' + _user.session_id, 'draw', 1);
                            }
                            else {
                                A_draw_count = await getUserScore(setcoinserver1_redis, redis_config.USER_SCORE_KEY + '_' + _user.session_id, 'draw');
                            }
    
                            if( (await updateScore(setcoinserver1_redis, redis_config.ROOM_SCORE_KEY + '_' + req.body.room_number, r_B_draw_count, 1)) < 2 ) {
                                B_draw_count = await updateScore(setcoinserver1_redis, redis_config.USER_SCORE_KEY + '_' + _ouser.session_id, 'draw', 1);
                            }
                            else {
                                B_draw_count = await getUserScore(setcoinserver1_redis, redis_config.USER_SCORE_KEY + '_' + _ouser.session_id, 'draw');
                            }

                            // await updateScore(setcoinserver1_redis, redis_config.USER_SCORE_KEY + '_' + _user.nickname, 'draw', 1);    
                            // await updateScore(setcoinserver1_redis, redis_config.USER_SCORE_KEY + '_' + _ouser.nickname, 'draw', 1);    
                        } else {
                            if( parseInt(await getUserDetailInfo(setcoinserver1_redis, _user.session_id, 'total_score')) >
                                parseInt(await getUserDetailInfo(setcoinserver1_redis, _ouser.session_id, 'total_score')) ){        //총점수가 큰 유저 승 처리
                                console.log("[game result win count change]=======142");
                                await setUserDetailInfo(setcoinserver1_redis, _user.session_id, {is_win: 1});
                                await setUserDetailInfo(setcoinserver1_redis, _ouser.session_id, {is_win: 0});

                                if( (await updateScore(setcoinserver1_redis, redis_config.ROOM_SCORE_KEY + '_' + req.body.room_number, r_A_win_count, 1)) < 2 ) {
                                    A_win_count = await updateScore(setcoinserver1_redis, redis_config.USER_SCORE_KEY + '_' + _user.session_id, 'win', 1);
                                }
                                else {
                                    A_win_count = await getUserScore(setcoinserver1_redis, redis_config.USER_SCORE_KEY + '_' + _user.session_id, 'win');
                                }
            
                                if( (await updateScore(setcoinserver1_redis, redis_config.ROOM_SCORE_KEY + '_' + req.body.room_number, r_B_lose_count, 1)) < 2 ) {
                                    B_lose_count = await updateScore(setcoinserver1_redis, redis_config.USER_SCORE_KEY + '_' + _ouser.session_id, 'lose', 1);
                                }
                                else {
                                    B_lose_count = await getUserScore(setcoinserver1_redis, redis_config.USER_SCORE_KEY + '_' + _ouser.session_id, 'lose');
                                }
                                    
                                // await updateScore(setcoinserver1_redis, redis_config.USER_SCORE_KEY + '_' + _user.nickname, 'win', 1);
                                // await updateScore(setcoinserver1_redis, redis_config.USER_SCORE_KEY + '_' + _ouser.nickname, 'lose', 1);
                            }     
                            else{                    //상대방 유저 승 처리
                                console.log("[game result win count change]=======149");
                                await setUserDetailInfo(setcoinserver1_redis, _user.session_id, {is_win: 0});
                                await setUserDetailInfo(setcoinserver1_redis, _ouser.session_id, {is_win: 1});

                                if( (await updateScore(setcoinserver1_redis, redis_config.ROOM_SCORE_KEY + '_' + req.body.room_number, r_A_lose_count, 1)) < 2 ) {
                                    A_lose_count = await updateScore(setcoinserver1_redis, redis_config.USER_SCORE_KEY + '_' + _user.session_id, 'lose', 1);
                                }
                                else {
                                    A_lose_count = await getUserScore(setcoinserver1_redis, redis_config.USER_SCORE_KEY + '_' + _user.session_id, 'lose');
                                }
            
                                if( (await updateScore(setcoinserver1_redis, redis_config.ROOM_SCORE_KEY + '_' + req.body.room_number, r_B_win_count, 1)) < 2 ) {
                                    B_win_count = await updateScore(setcoinserver1_redis, redis_config.USER_SCORE_KEY + '_' + _ouser.session_id, 'win', 1);
                                }
                                else {
                                    B_win_count = await getUserScore(setcoinserver1_redis, redis_config.USER_SCORE_KEY + '_' + _ouser.session_id, 'win');
                                }

                                // await updateScore(setcoinserver1_redis, redis_config.USER_SCORE_KEY + '_' + _user.nickname, 'lose', 1);
                                // await updateScore(setcoinserver1_redis, redis_config.USER_SCORE_KEY + '_' + _ouser.nickname, 'win', 1);
                            }                                     
                        }
                    } else {
                        if(_user.coin_count > _ouser.coin_count) {
                            console.log("[game result win count change]=======158");
                            await setUserDetailInfo(setcoinserver1_redis, _user.session_id, {is_win: 1});
                            await setUserDetailInfo(setcoinserver1_redis, _ouser.session_id, {is_win: 0});

                            if( (await updateScore(setcoinserver1_redis, redis_config.ROOM_SCORE_KEY + '_' + req.body.room_number, r_A_win_count, 1)) < 2 ) {
                                A_win_count = await updateScore(setcoinserver1_redis, redis_config.USER_SCORE_KEY + '_' + _user.session_id, 'win', 1);
                            }
                            else {
                                A_win_count = await getUserScore(setcoinserver1_redis, redis_config.USER_SCORE_KEY + '_' + _user.session_id, 'win');
                            }
        
                            if( (await updateScore(setcoinserver1_redis, redis_config.ROOM_SCORE_KEY + '_' + req.body.room_number, r_B_lose_count, 1)) < 2 ) {
                                B_lose_count = await updateScore(setcoinserver1_redis, redis_config.USER_SCORE_KEY + '_' + _ouser.session_id, 'lose', 1);
                            }
                            else {
                                B_lose_count = await getUserScore(setcoinserver1_redis, redis_config.USER_SCORE_KEY + '_' + _ouser.session_id, 'lose');
                            }

                            // await updateScore(setcoinserver1_redis, redis_config.USER_SCORE_KEY + '_' + _user.nickname, 'win', 1);
                            // await updateScore(setcoinserver1_redis, redis_config.USER_SCORE_KEY + '_' + _ouser.nickname, 'lose', 1);
                        } else {
                            console.log("[game result win count change]=======164");
                            await setUserDetailInfo(setcoinserver1_redis, _user.session_id, {is_win: 0});
                            await setUserDetailInfo(setcoinserver1_redis, _ouser.session_id, {is_win: 1});

                            if( (await updateScore(setcoinserver1_redis, redis_config.ROOM_SCORE_KEY + '_' + req.body.room_number, r_A_lose_count, 1)) < 2 ) {
                                A_lose_count = await updateScore(setcoinserver1_redis, redis_config.USER_SCORE_KEY + '_' + _user.session_id, 'lose', 1);
                            }
                            else {
                                A_lose_count = await getUserScore(setcoinserver1_redis, redis_config.USER_SCORE_KEY + '_' + _user.session_id, 'lose');
                            }
        
                            if( (await updateScore(setcoinserver1_redis, redis_config.ROOM_SCORE_KEY + '_' + req.body.room_number, r_B_win_count, 1)) < 2 ) {
                                B_win_count = await updateScore(setcoinserver1_redis, redis_config.USER_SCORE_KEY + '_' + _ouser.session_id, 'win', 1);
                            }
                            else {
                                B_win_count = await getUserScore(setcoinserver1_redis, redis_config.USER_SCORE_KEY + '_' + _ouser.session_id, 'win');
                            }

                            // await updateScore(setcoinserver1_redis, redis_config.USER_SCORE_KEY + '_' + _user.nickname, 'lose', 1);
                            // await updateScore(setcoinserver1_redis, redis_config.USER_SCORE_KEY + '_' + _ouser.nickname, 'win', 1);
                        }
                    }
                }
            }

            if( (await updateScore(setcoinserver1_redis, redis_config.ROOM_SCORE_KEY + '_' + req.body.room_number, 'is_result', 1)) < 2 ) {
                //if( (await getRoomDetail(setcoinserver1_redis, req.body.room_number, 'is_draw')) == 1) {
                if( is_draw == 1) {
                    //포인트 계산
                    let _pt = (_room.game_over_time - _room.game_start_time) / 1000;
                    let _point = parseInt(gamecfg.DRAW_POINT) * (_pt / 180);
                    _point = Math.round(_point);
    
                    if(_user.is_user == 1) {
                        await setUserDetailInfo(setcoinserver1_redis, _user.session_id, {point: _point});
                        write_game_result(_user.uuid, _user.nickname, 2, ()=>{});   
    
                        start_end_game_log(_user.uuid, _user.nickname,
                                        1, _ouser.nickname, 1, 3, (await getUserDetailInfo(setcoinserver1_redis, _user.session_id, 'total_score')),
                                        _room.start_date, _room.end_date, ()=>{});
    
                        update_point(_user.uuid, _point, _user.nickname, ()=>{});
                    }
                    if(_ouser.is_user == 1) {
                        write_game_result(_ouser.uuid, _ouser.nickname, 2, ()=>{});       
                        await setUserDetailInfo(setcoinserver1_redis, _ouser.session_id, {point: _point});
                        start_end_game_log( _ouser.uuid,_ouser.nickname,
                        1,_user.nickname, 1, 3, (await getUserDetailInfo(setcoinserver1_redis, _ouser.session_id, 'total_score')),
                        _room.start_date, _room.end_date, ()=>{});
                        update_point(_ouser.uuid, _point, _user.nickname, ()=>{});
                    }   
                } else {
                    if( (await getUserDetailInfo(setcoinserver1_redis, _user.session_id, 'is_win')) == 1 ) {
                        if(_user.is_user == 1) {
                            write_game_result(_user.uuid, _user.nickname, 0, ()=>{});    
                            let _pt = (_room.game_over_time - _room.game_start_time) / 1000;
                            let _point = gamecfg.WIN_POINT * (_pt / 180);
                            _point = Math.round(_point);
                            await setUserDetailInfo(setcoinserver1_redis, _user.session_id, {point: _point});
                            
                            start_end_game_log( _user.uuid, _user.nickname,
                            1, _ouser.nickname, 1, 1, (await getUserDetailInfo(setcoinserver1_redis, _user.session_id, 'total_score')),
                            _room.start_date, _room.end_date, ()=>{});
    
                            update_point(_user.uuid, _point, _user.nickname, ()=>{});
                        }
                        if(_ouser.is_user == 1) {
                            write_game_result(_ouser.uuid, _ouser.nickname, 1, ()=>{});    
                            let _pt = (_room.game_over_time - _room.game_start_time) / 1000;
                            let _point = gamecfg.LOSE_POINT * (_pt / 180);
                            _point = Math.round(_point);
                            await setUserDetailInfo(setcoinserver1_redis, _ouser.session_id, {point: _point});
                            
                            start_end_game_log( _ouser.uuid, _ouser.nickname,
                            1,_user.nickname, 1, 2, (await getUserDetailInfo(setcoinserver1_redis, _ouser.session_id, 'total_score')),
                            _room.start_date, _room.end_date, ()=>{});
    
                            update_point(_ouser.uuid, _point, _user.nickname, ()=>{});
                        }
                    } else {
                        if(_user.is_user == 1) {
                            //패
                            write_game_result(_user.uuid, _user.nickname, 1, ()=>{});    
                            let _pt = (_room.game_over_time - _room.game_start_time) / 1000;                        
                            let _point = gamecfg.LOSE_POINT * (_pt / 180);   
    
                            _point = Math.round(_point);
                            await setUserDetailInfo(setcoinserver1_redis, _user.session_id, {point: _point});                             
    
                            start_end_game_log( _user.uuid, _user.nickname, 1, _ouser.nickname, 1, 2, (await getUserDetailInfo(setcoinserver1_redis, _user.session_id, 'total_score')),
                            _room.start_date, _room.end_date, ()=>{});   
    
                            update_point(_user.uuid, _point, _user.nickname, ()=>{});
                        }
    
                        if(_ouser.is_user == 1) {
                            //승
                            let _pt = (_room.game_over_time - _room.game_start_time) / 1000;                        
    
                            let _point = gamecfg.WIN_POINT * (_pt / 180);
                            _point = Math.round(_point);
                            await setUserDetailInfo(setcoinserver1_redis, _ouser.session_id, {point: _point});                                                   
                            
                            write_game_result(_ouser.uuid, _ouser.nickname, 0, ()=>{});
    
                            start_end_game_log( _ouser.uuid, _ouser.nickname,
                            1, _user.nickname, 1, 1, (await getUserDetailInfo(setcoinserver1_redis, _ouser.session_id, 'total_score')),
                            _room.start_date, _room.end_date, ()=>{});
    
                            update_point(_ouser.uuid, _point, _ouser.nickname, ()=>{});
                        }
                    }
                }
            }
            else {

                //if( (await getRoomDetail(setcoinserver1_redis, req.body.room_number, 'is_draw')) == 1) {
                if( is_draw == 1) {
                    //포인트 계산
                    let _pt = (_room.game_over_time - _room.game_start_time) / 1000;
                    let _point = parseInt(gamecfg.DRAW_POINT) * (_pt / 180);
                    _point = Math.round(_point);
    
                    if(_user.is_user == 1) {
                        await setUserDetailInfo(setcoinserver1_redis, _user.session_id, {point: _point});
                    }
                    if(_ouser.is_user == 1) {
                        await setUserDetailInfo(setcoinserver1_redis, _ouser.session_id, {point: _point});
                    }   
                } else {
                    if( (await getUserDetailInfo(setcoinserver1_redis, _user.session_id, 'is_win')) == 1 ) {
                        if(_user.is_user == 1) {
                            let _pt = (_room.game_over_time - _room.game_start_time) / 1000;
                            let _point = gamecfg.WIN_POINT * (_pt / 180);
                            _point = Math.round(_point);
                            await setUserDetailInfo(setcoinserver1_redis, _user.session_id, {point: _point});
                        }
                        if(_ouser.is_user == 1) {
                            let _pt = (_room.game_over_time - _room.game_start_time) / 1000;
                            let _point = gamecfg.LOSE_POINT * (_pt / 180);
                            _point = Math.round(_point);
                            await setUserDetailInfo(setcoinserver1_redis, _ouser.session_id, {point: _point});
                        }
                    } else {
                        if(_user.is_user == 1) {
                            //패
                            let _pt = (_room.game_over_time - _room.game_start_time) / 1000;                        
                            let _point = gamecfg.LOSE_POINT * (_pt / 180);   
    
                            _point = Math.round(_point);
                            await setUserDetailInfo(setcoinserver1_redis, _user.session_id, {point: _point});                             
                        }
    
                        if(_ouser.is_user == 1) {
                            //승
                            let _pt = (_room.game_over_time - _room.game_start_time) / 1000;                        
    
                            let _point = gamecfg.WIN_POINT * (_pt / 180);
                            _point = Math.round(_point);
                            await setUserDetailInfo(setcoinserver1_redis, _ouser.session_id, {point: _point});                                                   
                        }
                    }
                }

            }

        //_rdata.draw             = (await getRoomDetail(setcoinserver1_redis, req.body.room_number, 'is_draw') == 1);
        _rdata.draw             = (is_draw == 1);
        _rdata.win              = (await getUserDetailInfo(setcoinserver1_redis, _user.session_id, 'is_win') == 1);

        _rdata.score            = await getUserDetailInfo(setcoinserver1_redis, _user.session_id, 'total_score');
        _rdata.coin_count       = await getUserScore(setcoinserver1_redis, redis_config.USER_SCORE_KEY + '_' + _user.session_id, 'coin_count');

        _rdata.win_count        = A_win_count;
        _rdata.lose_count       = A_lose_count;
        _rdata.draw_count       = A_draw_count;

        _rdata.point            = await getUserDetailInfo(setcoinserver1_redis, _user.session_id, 'point');

        _rdata.other_nick_name  = _ouser.nickname;
        _rdata.other_score      = await getUserDetailInfo(setcoinserver1_redis, _ouser.session_id, 'total_score');
        _rdata.other_coin_count = await getUserScore(setcoinserver1_redis, redis_config.USER_SCORE_KEY + '_' + _ouser.session_id, 'coin_count');
        _rdata.other_win_count  = B_win_count;
        _rdata.other_lose_count = B_lose_count;
        _rdata.other_draw_count = B_draw_count;

        console.log("game_result >> " + JSON.stringify(_rdata));
        
        res.json({ 'ERR_CODE': res_code.SUCCESS, 'DATA': _rdata });                  
        return;
    }
    catch(err22) {
        return res.json({ 'ERR_CODE': err22 });                  
    }
}