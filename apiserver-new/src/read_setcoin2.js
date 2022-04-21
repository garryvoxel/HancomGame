const mysql = require('./mysql');
const PACKET_ERR = require('./packet_err').PACKET_ERR;
const getRLI = require('../src/redis_util').getRLI;
const getRedis = require('../src/redis_util').getRedis;


/**
 * 룸번호로 방 찾기
 */
exports.search_room_num = function(svr_idx, room_num, callback) {
    console.log('search_room_num >> server_idx : ' + svr_idx + " room_number : " + room_num);
    const room_list_redis = getRedis(svr_idx);
    const RLI = getRLI(svr_idx);
    var _rinfo_key = RLI.KEY3 + '-' + room_num; //

    if (isNaN(room_num)) {
        console.log("방검색을 문자로 넣었네요 못찾아요 ==================");
        callback(PACKET_ERR.SETCOIN_SEARCH_ROOM_NUM_RDIS, null);
    } else {
        room_list_redis.hgetall(_rinfo_key, (err, res) => {
            if (err) {
                console.log('search_room_num >> redis error' + err);
                callback(PACKET_ERR.SETCOIN_SEARCH_ROOM_NUM_RDIS, null);
            } else {
                if (res === null) {
                    callback(PACKET_ERR.SETCOIN_SEARCH_ROOM_NUM_EMPTY, null);
                } else {
                    callback(PACKET_ERR.SUCCESS, res);
                }
            }
        });
    }


}

/**
 * 룸의 총 갯수 가져오기
 */
exports.get_total_room_list = function(svr_idx, callback) {
    const room_list_redis = getRedis(svr_idx);
    const RLI = getRLI(svr_idx);
    room_list_redis.zcard(RLI.KEY2, (err, reply) => {
        if (err) {
            callback(err, null);
        } else {
            callback(0, reply);
        }
    });
}

exports.request_game_result = function(uuid, callback) {
    mysql.getGameWrite().getConnection((err, con) => {

        if (err) {
            if (con) release();
            console.error('request_game_result >> getConnection error (mysql err)!!!' + err);
            callback(PACKET_ERR.SETCOIN_READ_GAME_RESULT_MYSQL, null);
        } else {
            let _query = 'SELECT SUM(Win) as Win, SUM(Lose) as Lose, SUM(Draw) as Draw FROM GameDB.TbSetCoin WHERE UUID=?';
            con.query(_query, [uuid], (err1, result, fields) => {
                con.release();
                if (err1) {
                    console.error('request_game_result >> query error (mysql err)!!!' + err1);
                    callback(PACKET_ERR.SETCOIN_READ_GAME_RESULT_MYSQL_QUERY, null);
                } else {
                    let _rdata = {};
                    if (result.length <= 0) { //console.error('request_game_result >> query res !!!'+result.length);
                        //callback(PACKET_ERR.SETCOIN_READ_GAME_RESULT_MYSQL_QUERY_RES,null);

                        _rdata.result = PACKET_ERR.SUCCESS;
                        _rdata.uuid = uuid;
                        _rdata.win = 0;
                        _rdata.lose = 0;
                        _rdata.draw = 0;
                        callback(PACKET_ERR.SUCCESS, _rdata);
                    } else {
                        //let _data=[];
                        //let _info={};
                        _rdata.result = PACKET_ERR.SUCCESS;
                        _rdata.uuid = result[0].UUID;
                        _rdata.win = result[0].Win;
                        _rdata.lose = result[0].Lose;
                        _rdata.draw = result[0].Draw;
                        //_data.push(_info);
                        //_rdata.data = _data;
                        callback(PACKET_ERR.SUCCESS, _rdata);
                    }
                }
            });
        }

    });
}


exports.request_total_room_list_number = function(_server_idx, callback) {
    let server_idx = parseInt(_server_idx);
    const RLI = getRLI(server_idx);
    room_list_redis.zrevrange(RLI.KEY2, 0, -1, (err, res) => {
        if (err) {
            console.error('request_total_room_list_number >> zrevrange..err ' + err);
            callback(PACKET_ERR.SETCOIN_REQUEST_TOTAL_ROOM_LIST_NUMBER_REDIS, null);

        } else {
            if (res.length <= 0) {
                console.error('request_total_room_list_number >> zrevrange..res ' + res);
                callback(PACKET_ERR.SETCOIN_REQUEST_TOTAL_ROOM_LIST_NUMBER_REDIS_RES, null);
            } else {
                callback(PACKET_ERR.SUCCESS, res);

            }
        }
    });

}