const credis = require('./../src/module/redis');
const res_code = require('./../config/res_code');
const redis_config = require('./../config/redis.json')[process.env.NODE_ENV || 'development']['GCSERVER_CHANNEL'];
const { isEmpty } = require('./../utils/global');
const { addDataToSortedSet, setHashValue, getHashValue, 
    removeFromSortedSet, getListFromSortedSet } = require('./../src/module/gcserverModule');
const { removeRedisInfo } = require('./module/panchangeModule');

exports.clear = function(req, res) {       
    const gc_redis = credis.getGcserverChannel();   
    gc_redis.flushdb((err, succeeded) => {
        if (err) {
            console.log("=================== GCServer 삭제오류 ================", err);   
            res.json({
                'ERR_CODE': res_code.GC_DB_RESET_FAIL
            })
            return;
        }
        console.log("=================== GCServer 성공 ================");   
        res.json({ 'ERR_CODE': res_code.SUCCESS });
    });    
}

exports.setUsedUser = async function(req, res) {
    if( isEmpty(req.body.socket_id) || isEmpty(req.body.nick_name) || isEmpty(req.body.session_id) ) {
        res.json({ 'ERR_CODE': res_code.INVALID_PARAM });
        return;
    }

    const gc_redis = credis.getGcserverChannel();   

    try {
        await addDataToSortedSet(gc_redis, redis_config.GC_SESSION_ID_LIST + '_' + req.body.nick_name, req.body.session_id);
        let _data = {
            "SESSION_ID": req.body.session_id,
            "POSITION": redis_config.LOBBY,
            "SOCKET": req.body.socket_id,
            "NICKNAME": req.body.nick_name
        };
        await setHashValue(gc_redis, redis_config.GC_USER_DETAIL + '_' + req.body.session_id, _data);
        await setHashValue(gc_redis, redis_config.GC_SESSION_SOCKET + '_' + req.body.socket_id, {"SESSION_ID": req.body.session_id});
        return res.json({ 'ERR_CODE' : res_code.SUCCESS });
    }   
    catch(err22) {
        return res.json({ 'ERR_CODE' : err22 });
    }
}

exports.withdraw = async function(req, res) {
    if( isEmpty(req.body.socket_id) )  { 
        res.json({ 'ERR_CODE': res_code.INVALID_PARAM });
        return;
    }

    const gc_redis = credis.getGcserverChannel();   

    try {
        let _session_id = await getHashValue(gc_redis, redis_config.GC_SESSION_SOCKET + '_' + req.body.socket_id, 'SESSION_ID');
        if(!_session_id)    {
            return res.json({ 'ERR_CODE' : res_code.SUCCESS, 'NICKNAME': null });
        }

        await removeRedisInfo(gc_redis, redis_config.GC_SESSION_SOCKET + '_' + req.body.socket_id);

        let _nick_name = await getHashValue(gc_redis, redis_config.GC_USER_DETAIL + '_' + _session_id, 'NICKNAME');
        if(!_nick_name) {
            return res.json({ 'ERR_CODE' : res_code.SUCCESS, 'NICKNAME': null });
        }
        let _socket = await getHashValue(gc_redis, redis_config.GC_USER_DETAIL + '_' + _session_id, 'SOCKET');
        if(_socket != req.body.socket_id) {
            return res.json({ 'ERR_CODE' : res_code.SUCCESS, 'NICKNAME': _nick_name });    
        }
        await removeRedisInfo(gc_redis, redis_config.GC_USER_DETAIL + '_' + _session_id);
        await removeFromSortedSet(gc_redis, redis_config.GC_SESSION_ID_LIST + '_' + _nick_name, _session_id);

        let nickname_session_list = await getListFromSortedSet(gc_redis, redis_config.GC_SESSION_ID_LIST + '_' + _nick_name);
        if(nickname_session_list.length == 0) {
            await removeRedisInfo(gc_redis, redis_config.GC_SESSION_ID_LIST + '_' + _nick_name);
        }

        return res.json({ 'ERR_CODE' : res_code.SUCCESS, 'NICKNAME': _nick_name });
    }
    catch(err22) {
        return res.json({ 'ERR_CODE' : err22 });
    }
}

exports.getUserByNickName = async function(req, res) {
    if( isEmpty(req.body.nick_name) ) {
        res.json({ 'ERR_CODE': res_code.INVALID_PARAM });
        return;   
    }

    const gc_redis = credis.getGcserverChannel();   

    try {
        let _nickname_session_list = await getListFromSortedSet(gc_redis, redis_config.GC_SESSION_ID_LIST + '_' + req.body.nick_name);
        if(_nickname_session_list.length == 0) {
            return res.json({ 'ERR_CODE' : res_code.SUCCESS, 'USER': [] });
        }

        let _user_list = [] , _pass_len = _nickname_session_list.length;
        for(let i = 0; i < _nickname_session_list.length; i ++) {
            let _user = await getHashValue(gc_redis, redis_config.GC_USER_DETAIL + '_' + _nickname_session_list[i]);
            _user_list.push(_user);
            _pass_len --;
            if(_pass_len == 0) {
                return res.json({ 'ERR_CODE' : res_code.SUCCESS, 'USER': _user_list });           
            }
        }
    }
    catch(err22) {
        return res.json({ 'ERR_CODE' : err22 });
    }
}

exports.getUserBySocketId = async function(req, res) {
    if( isEmpty(req.body.socket_id) ) {
        res.json({ 'ERR_CODE': res_code.INVALID_PARAM });
        return;   
    }

    const gc_redis = credis.getGcserverChannel();   

    try {
        let _session_id = await getHashValue(gc_redis, redis_config.GC_SESSION_SOCKET + '_' + req.body.socket_id, 'SESSION_ID');
        if(!_session_id)    {
            return res.json({ 'ERR_CODE' : res_code.SUCCESS, 'USER': null });
        }

        let _user = await getHashValue(gc_redis, redis_config.GC_USER_DETAIL + '_' + _session_id);        
        return res.json({ 'ERR_CODE' : res_code.SUCCESS, 'USER': _user });
    }
    catch(err22) {
        return res.json({ 'ERR_CODE' : err22 });    
    }
}

exports.setPosition = async function(req, res) {
    if( isEmpty(req.body.nick_name) || isEmpty(req.body.position)) {
        res.json({ 'ERR_CODE': res_code.INVALID_PARAM });
        return;   
    }

    const gc_redis = credis.getGcserverChannel();   
    
    try {
        let _nickname_session_list = await getListFromSortedSet(gc_redis, redis_config.GC_SESSION_ID_LIST + '_' + req.body.nick_name);       

        for(let i = 0; i < _nickname_session_list.length; i ++) {
            await setHashValue(gc_redis, redis_config.GC_USER_DETAIL + '_' + _nickname_session_list[i], {"POSITION": req.body.position});
        }
        return res.json({ 'ERR_CODE' : res_code.SUCCESS });
    }
    catch(err22) {
        return res.json({ 'ERR_CODE' : err22 });        
    }
}