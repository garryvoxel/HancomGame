exports.ROOM_STATE = {
    "INIT":0,
    "CREATE_ROOM":1,
    "ENTER_FINISHED":2,
    "GAME_PLAY_READY":3,
    "GAME_PAYING":4,
    "PRE_GAME_OVER":5,
    "GAME_OVER_WAIT":6, //약 1초 뒤에 게임종료 처리한다.
    "GAME_OVER":7,  //game_over 상태이면 결과창을 요청한다.    
    "GAME_CLEAR":8
}

exports.USER_STATE = {
    "READY":0,
    "PLAYING":1,
    "PRE_GAME_OVER":2,
    "GAME_OVER":3
}

exports.COMBO_ATTACK_TYPYE = {
    "ATTACK_TYPE_INIT":0,
    "ATTACK_TYPE_3":1,
    "ATTACK_TYPE_4":2,
    "ATTACK_TYPE_5":3,
    "ATTACK_TYPE_6":4
}

exports.PLAY_TIME = {
    "PLAY_TIME_1":60,
    "PLAY_TIME_2":120,
    "PLAY_TIME_3":180,
    "PLAY_TIME_4":240,
    "PLAY_TIME_5":300
}