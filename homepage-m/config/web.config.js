const ENVIRONMENT = process.env.NODE_ENV
//const ENVIRONMENT = process.env.NODE_ENV
const WebConfig = {
    
    test: {
        environment: ENVIRONMENT,

        hancomFamilies: [
            { name: '한컴그룹', uri: 'https://www.hancomgroup.com' },
            { name: '한글과컴퓨터', uri: 'https://www.hancom.com' },
            { name: '한컴MDS', uri: 'http://www.hancommds.com' },
            { name: '한컴인텔리전스', uri: 'https://www.hancomit.com/' },
            { name: '한컴위드', uri: 'https://www.hsecure.co.kr' },
            // { name: '한컴GMD', uri: 'http://www.hancomgmd.com/ko' },
            { name: '한컴인터프리', uri: 'http://www.interfree.com/' },
            { name: '한컴톡카페', uri: 'http://www.talkafe.net/kr/main.html' },
            { name: '한컴라이프케어', uri: 'http://www.sancheong.com' },
            //{ name: '한컴유니맥스', uri: 'http://hancomunimax.co.kr' },
            { name: '한컴텔라딘', uri: 'http://teladin.com/kr' },
            { name: '한컴로보틱스', uri: 'http://www.hancomrobotics.com' },
            { name: '한컴모빌리티', uri: 'http://www.hmobility.co.kr/index' },
            { name: '한컴아카데미', uri: 'http://www.hancomacademy.co.kr/' },
            { name: 'Accufly.AI', uri: 'http://www.accufly.ai/' }
        ],

        malangmalangLinks: {
            site: { name: '말랑말랑', uri: 'https://dev-www.malangmalang.com' },
            login: { name: '로그인', uri: 'https://dev-accounts.malangmalang.com/sign/in' },
            mypage: { name: '마이페이지', uri: 'https://dev-accounts.malangmalang.com/mypage/general' },
            logout: { name: '로그아웃', uri: 'https://dev-accounts.malangmalang.com/sign/out' },
            signup : {name : '회원가입', uri:'https://dev-accounts.malangmalang.com/sign/up'},
            typing: { name: '한컴타자', uri: 'http://taja.malangmalang.com:7312'},
            intro: { name: '말랑말랑 서비스 소개', uri: 'https://dev-www.malangmalang.com/malang_intro' },
            collaboration: { name: '제휴사모집', uri: 'https://dev-www.malangmalang.com/collaboration' },
            inquiry: { name: '문의하기', uri: 'https://dev-www.malangmalang.com/inquiry?menu=taja' },
            termsOfUse: { name: '이용약관', uri: 'https://dev-accounts.malangmalang.com/terms' },
            privacyPolicy: { name: '개인정보처리방침', uri: 'https://dev-accounts.malangmalang.com/privacy' },

            gnbScript: { name: '한컴 GNB script', uri: 'https://dev-www.malangmalang.com/public/javascript/hm.1.js' },

            typingPractice: { name: '한컴 타자연습', uri: 'http://taja.malangmalang.com:7308/typing/WebContent' },
            flippingCards: { name: '판 뒤집기', uri: 'http://taja.malangmalang.com:7306/Flip01/WebContent' },
            pilingCoins: { name: '동전쌓기', uri: 'http://taja.malangmalang.com:7304/coinpile_sample/WebContent' },
            catchingMoles: { name: '두더지잡기', uri: 'http://taja.malangmalang.com:7309/mole/WebContent' },

            pilingCoinsGameServer: 'ws://taja.malangmalang.com:7301',
        },
        kakaoAuthKey:{
            key : '95e3a945acd67ca51c5a4a0910a78d83'
        }
    },

    development: {
        environment: ENVIRONMENT,

        hancomFamilies: [
            { name: '한컴그룹', uri: 'https://www.hancomgroup.com' },
            { name: '한글과컴퓨터', uri: 'https://www.hancom.com' },
            { name: '한컴MDS', uri: 'http://www.hancommds.com' },
            { name: '한컴인텔리전스', uri: 'https://www.hancomit.com/' },
            { name: '한컴위드', uri: 'https://www.hsecure.co.kr' },
            // { name: '한컴GMD', uri: 'http://www.hancomgmd.com/ko' },
            { name: '한컴인터프리', uri: 'http://www.interfree.com/' },
            { name: '한컴톡카페', uri: 'http://www.talkafe.net/kr/main.html' },
            { name: '한컴라이프케어', uri: 'http://www.sancheong.com' },
            //{ name: '한컴유니맥스', uri: 'http://hancomunimax.co.kr' },
            { name: '한컴텔라딘', uri: 'http://teladin.com/kr' },
            { name: '한컴로보틱스', uri: 'http://www.hancomrobotics.com' },
            { name: '한컴모빌리티', uri: 'http://www.hmobility.co.kr/index' },
            { name: '한컴아카데미', uri: 'http://www.hancomacademy.co.kr/' },
            { name: 'Accufly.AI', uri: 'http://www.accufly.ai/' }
        ],

        malangmalangLinks: {
            site: { name: '말랑말랑', uri: 'https://dev-www.malangmalang.com' },
            login: { name: '로그인', uri: 'https://dev-accounts.malangmalang.com/sign/in' },
            mypage: { name: '마이페이지', uri: 'https://dev-accounts.malangmalang.com/mypage/general' },
            logout: { name: '로그아웃', uri: 'https://dev-accounts.malangmalang.com/sign/out' },
            signup: { name: '회원가입', uri: 'https://dev-accounts.malangmalang.com/sign/up' },
            typing: { name: '한컴타자', uri: 'https://dev-typing.malangmalang.com' },
            intro: { name: '말랑말랑 서비스 소개', uri: 'https://dev-www.malangmalang.com/malang_intro' },
            collaboration: { name: '제휴사모집', uri: 'https://dev-www.malangmalang.com/collaboration' },
            inquiry: { name: '문의하기', uri: 'https://dev-www.malangmalang.com/inquiry?menu=taja' },
            termsOfUse: { name: '이용약관', uri: 'https://dev-accounts.malangmalang.com/terms' },
            privacyPolicy: { name: '개인정보처리방침', uri: 'https://dev-accounts.malangmalang.com/privacy' },
            signup : {name : '회원가입', uri:'https://dev-accounts.malangmalang.com/sign/up'},
            gnbScript: { name: '한컴 GNB script', uri: 'https://dev-www.malangmalang.com/public/javascript/hm.1.js' },

            typingPractice: { name: '한컴 타자연습', uri: 'https://dev-tt-exam-c.malangmalang.com/typing/WebContent' },
            flippingCards: { name: '판 뒤집기', uri: 'https://dev-tt-block-c.malangmalang.com/Flip01/WebContent' },
            pilingCoins: { name: '동전쌓기', uri: 'https://dev-tt-coin-c.malangmalang.com/coinpile_sample/WebContent' },
            catchingMoles: { name: '두더지잡기', uri: 'https://dev-tt-mole-c.malangmalang.com/mole/WebContent' },

            pilingCoinsGameServer: 'wss://dev-tt-gcs.malangmalang.com'
        },
        kakaoAuthKey:{
            key : '95e3a945acd67ca51c5a4a0910a78d83'
        }
    },

    stage: {
        environment: ENVIRONMENT,

        hancomFamilies: [
            { name: '한컴그룹', uri: 'https://www.hancomgroup.com' },
            { name: '한글과컴퓨터', uri: 'https://www.hancom.com' },
            { name: '한컴MDS', uri: 'http://www.hancommds.com' },
            { name: '한컴인텔리전스', uri: 'https://www.hancomit.com/' },
            { name: '한컴위드', uri: 'https://www.hsecure.co.kr' },
            // { name: '한컴GMD', uri: 'http://www.hancomgmd.com/ko' },
            { name: '한컴인터프리', uri: 'http://www.interfree.com/' },
            { name: '한컴톡카페', uri: 'http://www.talkafe.net/kr/main.html' },
            { name: '한컴라이프케어', uri: 'http://www.sancheong.com' },
           //{ name: '한컴유니맥스', uri: 'http://hancomunimax.co.kr' },
            { name: '한컴텔라딘', uri: 'http://teladin.com/kr' },
            { name: '한컴로보틱스', uri: 'http://www.hancomrobotics.com' },
            { name: '한컴모빌리티', uri: 'http://www.hmobility.co.kr/index' },
            { name: '한컴아카데미', uri: 'http://www.hancomacademy.co.kr/' },
            { name: 'Accufly.AI', uri: 'http://www.accufly.ai/' }
        ],

        malangmalangLinks: {
            site: { name: '말랑말랑', uri: 'https://stg-www.malangmalang.com' },
            login: { name: '로그인', uri: 'https://stg-accounts.malangmalang.com/sign/in' },
            mypage: { name: '마이페이지', uri: 'https://stg-accounts.malangmalang.com/mypage/general' },
            logout: { name: '로그아웃', uri: 'https://stg-accounts.malangmalang.com/sign/out' },
            signup: { name: '회원가입', uri: 'https://stg-accounts.malangmalang.com/sign/up' },
            typing: { name: '한컴타자', uri: 'https://stg-typing.malangmalang.com' },
            intro: { name: '말랑말랑 서비스 소개', uri: 'https://stg-www.malangmalang.com/malang_intro' },
            collaboration: { name: '제휴사모집', uri: 'https://stg-www.malangmalang.com/collaboration' },
            inquiry: { name: '문의하기', uri: 'https://stg-www.malangmalang.com/inquiry?menu=taja' },
            termsOfUse: { name: '이용약관', uri: 'https://stg-accounts.malangmalang.com/terms' },
            privacyPolicy: { name: '개인정보처리방침', uri: 'https://stg-accounts.malangmalang.com/privacy' },
            signup : {name : '회원가입', uri:'https://stg-accounts.malangmalang.com/sign/up'},
            gnbScript: { name: '한컴 GNB script', uri: 'https://stg-www.malangmalang.com/public/javascript/hm.1.js' },

            typingPractice: { name: '한컴 타자연습', uri: 'https://stg-tt-exam-c.malangmalang.com/typing/WebContent' },
            flippingCards: { name: '판 뒤집기', uri: 'https://stg-tt-block-c.malangmalang.com/Flip01/WebContent' },
            pilingCoins: { name: '동전쌓기', uri: 'https://stg-tt-coin-c.malangmalang.com/coinpile_sample/WebContent' },
            catchingMoles: { name: '두더지잡기', uri: 'https://stg-tt-mole-c.malangmalang.com/mole/WebContent' },

            pilingCoinsGameServer: 'wss://stg-tt-gcs.malangmalang.com'
        },
        kakaoAuthKey:{
            key : '95e3a945acd67ca51c5a4a0910a78d83'
        }
    },

    production: {
        environment: ENVIRONMENT,

        hancomFamilies: [
            { name: '한컴그룹', uri: 'https://www.hancomgroup.com' },
            { name: '한글과컴퓨터', uri: 'https://www.hancom.com' },
            { name: '한컴MDS', uri: 'http://www.hancommds.com' },
            { name: '한컴인텔리전스', uri: 'https://www.hancomit.com/' },
            { name: '한컴위드', uri: 'https://www.hsecure.co.kr' },
            // { name: '한컴GMD', uri: 'http://www.hancomgmd.com/ko' },
            { name: '한컴인터프리', uri: 'http://www.interfree.com/' },
            { name: '한컴톡카페', uri: 'http://www.talkafe.net/kr/main.html' },
            { name: '한컴라이프케어', uri: 'http://www.sancheong.com' },
            //{ name: '한컴유니맥스', uri: 'http://hancomunimax.co.kr' },
            { name: '한컴텔라딘', uri: 'http://teladin.com/kr' },
            { name: '한컴로보틱스', uri: 'http://www.hancomrobotics.com' },
            { name: '한컴모빌리티', uri: 'http://www.hmobility.co.kr/index' },
            { name: '한컴아카데미', uri: 'http://www.hancomacademy.co.kr/' },
            { name: 'Accufly.AI', uri: 'http://www.accufly.ai/' }
        ],

        malangmalangLinks: {
            site: { name: '말랑말랑', uri: 'https://www.malangmalang.com' },
            login: { name: '로그인', uri: 'https://accounts.malangmalang.com/sign/in' },
            mypage: { name: '마이페이지', uri: 'https://accounts.malangmalang.com/mypage/general' },
            logout: { name: '로그아웃', uri: 'https://accounts.malangmalang.com/sign/out' },
            signup: { name: '회원가입', uri: 'https://accounts.malangmalang.com/sign/up' },
            typing: { name: '한컴타자', uri: 'https://typing.malangmalang.com' },
            intro: { name: '말랑말랑 서비스 소개', uri: 'https://www.malangmalang.com/malang_intro' },
            collaboration: { name: '제휴사모집', uri: 'https://www.malangmalang.com/collaboration' },
            inquiry: { name: '문의하기', uri: 'https://www.malangmalang.com/inquiry?menu=taja' },
            termsOfUse: { name: '이용약관', uri: 'https://accounts.malangmalang.com/terms' },
            privacyPolicy: { name: '개인정보처리방침', uri: 'https://accounts.malangmalang.com/privacy' },
            signup : {name : '회원가입', uri:'https://accounts.malangmalang.com/sign/up'},
            gnbScript: { name: '한컴 GNB script', uri: 'https://www.malangmalang.com/public/javascript/hm.1.js' },

            typingPractice: { name: '한컴 타자연습', uri: 'https://tt-exam-c.malangmalang.com/typing/WebContent' },
            flippingCards: { name: '판 뒤집기', uri: 'https://tt-block-c.malangmalang.com/Flip01/WebContent' },
            pilingCoins: { name: '동전쌓기', uri: 'https://tt-coin-c.malangmalang.com/coinpile_sample/WebContent' },
            catchingMoles: { name: '두더지잡기', uri: 'https://tt-mole-c.malangmalang.com/mole/WebContent' },

            pilingCoinsGameServer: 'wss://tt-gcs.malangmalang.com'
        },
        kakaoAuthKey:{
            key : '16bb506192e84902ed1bf1bb5b1a8dde'
        }
    }
}

export default WebConfig[ENVIRONMENT]