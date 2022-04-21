'use strict';    
const redis_config = require('./../../config/redis.json')[process.env.NODE_ENV || 'development']['GCSERVER_CHANNEL'];
const res_code = require('./../../config/res_code');
const { isEmpty } = require('../../utils/global');

exports.addDataToSortedSet = function(gc_redis, _key, _data) {
    return new Promise((resolve, reject) => {
        let _time_stamp = Math.floor(Date.now() / 1000);
        gc_redis.zadd(_key, _time_stamp, _data, (err1, res1) => {
            if(err1) {
                reject(res_code.ADD_DATA_TO_ARRAY_FAIL);
            }
            else {
                if(res1 < 0) {
                    reject(res_code.ADD_DATA_TO_ARRAY_FAIL);
                }
                else {
                    resolve(res_code.SUCCESS);
                }
            }
        });
    });
}

exports.setHashValue = function(gc_redis, _key, _data) {
    return new Promise((resolve, reject) => {
        gc_redis.hmset(_key, _data, (err1, res1) => {
            if(err1) {
                reject(res_code.GC_METHOD_FAIL);
                return;
            }
            if(res1 != 'OK') {
                reject(res_code.GC_METHOD_FAIL);
                return;
            }
            resolve(res_code.SUCCESS); 
        });
    });
}

exports.getHashValue = function(gc_redis, _key, _member = null) {    
    return new Promise((resolve, reject) => {
        if(!_member) {
            gc_redis.hgetall(_key, (err1, res1) => {
                if(err1) {
                    reject(res_code.GET_HASH_VALUE_FAIL);
                }
                else if(res1 <= 0 || isEmpty(res1)) {
                    resolve(null);
                }
                else
                    resolve(res1);
            });
        }
        else {
            gc_redis.hget(_key, _member, (err1, res1) => {
                if(err1) {
                    resolve(null);
                }
                else
                    resolve(res1);
            });
        }
    });
}

exports.removeFromSortedSet = function(gc_redis, _key, _member) {
    return new Promise((resolve, reject) => {
        gc_redis.zrem(_key, _member, (err1, res1) => {
            if(err1) {
                reject(res_code.GC_METHOD_FAIL);
                return;
            }
            resolve(res_code.SUCCESS);
        });
    });
}

exports.getListFromSortedSet = function(gc_redis, _key) {
    console.log("[getListFromSortedSet]", _key);
    return new Promise((resolve, reject) => {
        gc_redis.zrevrange(_key, 0, -1, (err1, res1) => {
            if(res1 == null || err1) {
                resolve([]);
                return;
            }
            resolve(res1);
        });
    });
}