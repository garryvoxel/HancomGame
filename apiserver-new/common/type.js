const TYPE = {
    'PLATFORM' : {
        'UNKNOWN'           : 0,
        'WEB'               : 1,
        'MOBILE'            : 2
    },
    'BROWSER' : {
        'UNKNOWN'           : 0,
        'EXPLORER'          : 1,
        'CHROME'            : 2,
        'SAFARI'            : 3,
        'FIREFOX'           : 4,
        'EDGE'              : 5
    },
    'OS' : {
        'UNKNOWN'           : 0,
        'WINDOWS'           : 1,
        'MAC'               : 2,
        'IOS'               : 3,
        'ANDROID'           : 4
    },
    'LOG' : {
        'LOGIN_WEB'                 : 10001,        // 웹 로그인
        'LOGOUT_WEB'                : 10002,        // 웹 로그아웃
        'SCORE_EARN'                : 10003,        // 포인트 획득
        'SCORE_CONSUME'             : 10004,        // TODO : 미정
        'MENU_ENTRANCE'             : 10005,        // 페이지뷰 (각 메뉴 진입시)
        'AD_WEB_SHOW'               : 10006,        // 웹광고노출
        'AD_WEB_CLICK'              : 10007,        // 웹광고클릭
        'GAME_TYPE_BEGIN'           : 10008,        // 타자연습시작
        'GAME_TYPE_END'             : 10009,        // 타자연습종료
        'GAME_MOLE_BEGIN'           : 10010,        // 두더지 게임시작
        'GAME_MOLE_END'             : 10011,        // 두더지 게임종료
        'GAME_COIN_BEGIN'           : 10012,        // 동전쌓기 게임시작
        'GAME_COIN_END'             : 10013,        // 동전쌓기 게임종료
        'GAME_PAN_BEGIN'            : 10014,        // 판뒤집기 게임시작
        'GAME_PAN_END'              : 10015,        // 판뒤집기 게임종료
        'FRIEND_REQUEST'            : 10016,        // 친구신청
        'FRIEND_ACCEPT'             : 10017,        // 친구수락
        'FRIEND_DELETE'             : 10018,        // 친구제거
        'SCORE_SEND'                : 10019,        // 점수쪽지전송
        'SCORE_SHARE_KAKAOTALK'     : 10020,        // SNS 점수공유-카톡
        'SCORE_SHARE_FACEBOOK'      : 10021,        // SNS 점수공유-페이스북
        'INVITATION_REQUEST'        : 10022,        // 초대전송
        'INVITATION_ACCEPT'         : 10023,        // 초대수락
        'INVITATION_REJECT'         : 10024         // 초대거절
    },
    'GAME' : {  // TODO: fix
        'MAIN' : {
            'COIN'              : 10000,            // 동전쌓기
            'PAN'               : 10001,            // 판 뒤짚기
            'MOLE'              : 10002,            // 두더지
            'TYPE'              : 10003             // 타자연습
        },
        'SUB' : {
            'POSITION'          : 1,                // 자리연습
            'LANGUAGE'          : 2,                // 낱말연습
            'SHORT'             : 3,                // 짧은 글
            'LONG'              : 4                 // 긴글
        },
        'LEVEL' : {
            // TODO :
        }
    },
    'MENU' : {
        'MAIN'                  : 1,                // 메인
        'MY_PAGE'               : 2,                // 마이페이지
        'GAME_PRACTICE'         : 3,                // 한컴타자연습
        'GAME'                  : 4,                // 게임
        'RANK': {
            'MAIN'              : 5,                // 랭킹
            'TYPE'              : 6,                // 랭킹 타자 연습
            'PAN'               : 7,                // 랭킹 판 뒤집기
            'COIN'              : 8,                // 랭킹 동전쌓기
            'MOLE'              : 9                 // 랭킹 두더지 잡기
        },
        'COMMUNITY': {
            'MAIN'              : 10,                // 커뮤니티
            'CLAN'              : 11,                // 커뮤니티 클랜
            'FORUM'             : 12,                // 커뮤니티 자유게시판
            'FRIEND'            : 13,                // 커뮤니티 친구관리
            'NOTICE'            : 14,                // 커뮤니티 공지사항
            'EVENT'             : 15                 // 커뮤니티 이벤트
        },
        'CUSTOMER'              : 16                 // 고객센터
    }

};

module.exports = TYPE;