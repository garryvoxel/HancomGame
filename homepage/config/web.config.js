const ENVIRONMENT = process.env.NODE_ENV;
/**
 * 홈페이지 Config값 정의
 */
const WebConfig = {
  test: {
    environment: ENVIRONMENT,

    //한컴계열사 사이트
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
      { name: '한컴텔라딘', uri: 'http://teladin.com/kr' },
      { name: '한컴로보틱스', uri: 'http://www.hancomrobotics.com' },
      { name: '한컴모빌리티', uri: 'http://www.hmobility.co.kr/index' },
      { name: '한컴아카데미', uri: 'http://www.hancomacademy.co.kr/' },
      { name: 'Accufly.AI', uri: 'http://www.accufly.ai/' }
    ],

    //말랑말랑 연관 링크
    malangmalangLinks: {
      site: { name: '말랑말랑', uri: 'https://dev-www.malangmalang.com' },
      login: {
        name: '로그인',
        uri: 'https://dev-accounts.malangmalang.com/sign/in',
      },
      logout: {
        name: '로그아웃',
        uri: 'https://dev-accounts.malangmalang.com/sign/out',
      },
      signup: {
        name: '회원가입',
        uri: 'https://dev-accounts.malangmalang.com/sign/up',
      },
      typing: {
        name: '한컴타자',
        uri: 'http://taja.malangmalang.com:7302',
      },
      intro: {
        name: '말랑말랑플랫폼 바로가기',
        uri: 'https://dev-www.malangmalang.com',
      },
      collaboration: {
        name: '제휴사모집',
        uri: 'https://dev-www.malangmalang.com/collaboration',
      },
      inquiry: {
        name: '문의하기',
        uri: 'https://dev-www.malangmalang.com/inquiry?menu=taja',
      },
      termsOfUse: {
        name: '이용약관',
        uri: 'https://dev-accounts.malangmalang.com/terms/current/ko',
      },
      privacyPolicy: {
        name: '개인정보처리방침',
        uri: 'https://dev-accounts.malangmalang.com/privacy/current/ko',
      },

      gnbScript: {
        name: '한컴 GNB script',
        uri: 'https://dev-www.malangmalang.com/public/javascript/hm.1.js',
      },

      typingPractice: {
        name: '한컴 타자연습',
        uri: 'http://taja.malangmalang.com:7308/typing/WebContent',
      },
      flippingCards: {
        name: '판 뒤집기',
        uri: 'http://taja.malangmalang.com:7306/Flip01/WebContent',
      },
      pilingCoins: {
        name: '동전쌓기',
        uri: 'http://taja.malangmalang.com:7304/coinpile_sample/WebContent',
      },
      catchingMoles: {
        name: '두더지잡기',
        uri: 'http://taja.malangmalang.com:7309/mole/WebContent',
      },
      rain: {
        name: '산성비',
        uri: 'http://taja.malangmalang.com:8801',
      },

      pilingCoinsGameServer: 'ws://taja.malangmalang.com:7301',
    },
    kakaoAuthKey: {
      key: '3d1abd0e5f4a75a427e3e81500ea55ff',
    },
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
      { name: 'Accufly.AI', uri: 'http://www.accufly.ai/' },
    ],

    malangmalangLinks: {
      site: { name: '말랑말랑', uri: 'https://dev-www.malangmalang.com' },
      login: {
        name: '로그인',
        uri: 'https://dev-accounts.malangmalang.com/sign/in',
      },
      logout: {
        name: '로그아웃',
        uri: 'https://dev-accounts.malangmalang.com/sign/out',
      },
      signup: {
        name: '회원가입',
        uri: 'https://dev-accounts.malangmalang.com/sign/up',
      },
      typing: {
        name: '한컴타자',
        uri: 'http://localhost:7302',
      },
      intro: {
        name: '말랑말랑플랫폼 바로가기',
        uri: 'https://dev-www.malangmalang.com',
      },
      collaboration: {
        name: '제휴사모집',
        uri: 'https://dev-www.malangmalang.com/collaboration',
      },
      inquiry: {
        name: '문의하기',
        uri: 'https://dev-www.malangmalang.com/inquiry?menu=taja',
      },
      termsOfUse: {
        name: '이용약관',
        uri: 'https://dev-accounts.malangmalang.com/terms/current/ko',
      },
      privacyPolicy: {
        name: '개인정보처리방침',
        uri: 'https://dev-accounts.malangmalang.com/privacy/current/ko',
      },

      gnbScript: {
        name: '한컴 GNB script',
        uri: 'https://dev-www.malangmalang.com/public/javascript/hm.1.js',
      },

      typingPractice: {
        name: '한컴 타자연습',
        uri: 'https://dev-tt-exam-c.malangmalang.com/typing/WebContent',
      },
      flippingCards: {
        name: '판 뒤집기',
        uri: 'http://localhost:7306/Flip01/WebContent',
      },
      pilingCoins: {
        name: '동전쌓기',
        // uri: 'https://dev-tt-coin-c.malangmalang.com/coinpile_sample/WebContent',
        uri: 'http://localhost:7304/coinpile_sample/WebContent',
      },
      catchingMoles: {
        name: '두더지잡기',
        uri: 'https://dev-tt-mole-c.malangmalang.com/mole/WebContent',
      },
      rain: {
        name: '산성비',
        uri: 'https://dev-rain.malangmalang.com',
      },
      pilingCoinsGameServer: 'wss://dev-tt-gcs.malangmalang.com',
    },
    kakaoAuthKey: {
      key: '3d1abd0e5f4a75a427e3e81500ea55ff',
    },
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
      { name: 'Accufly.AI', uri: 'http://www.accufly.ai/' },
    ],

    malangmalangLinks: {
      site: { name: '말랑말랑', uri: 'https://stg-www.malangmalang.com' },
      login: {
        name: '로그인',
        uri: 'https://stg-accounts.malangmalang.com/sign/in',
      },
      logout: {
        name: '로그아웃',
        uri: 'https://stg-accounts.malangmalang.com/sign/out',
      },
      signup: {
        name: '회원가입',
        uri: 'https://stg-accounts.malangmalang.com/sign/up',
      },
      typing: {
        name: '한컴타자',
        uri: 'https://stg-typing.malangmalang.com',
      },
      intro: {
        name: '말랑말랑플랫폼 바로가기',
        uri: 'https://stg-www.malangmalang.com',
      },
      collaboration: {
        name: '제휴사모집',
        uri: 'https://stg-www.malangmalang.com/collaboration',
      },
      inquiry: {
        name: '문의하기',
        uri: 'https://stg-www.malangmalang.com/inquiry?menu=taja',
      },
      termsOfUse: {
        name: '이용약관',
        uri: 'https://stg-accounts.malangmalang.com/terms',
      },
      privacyPolicy: {
        name: '개인정보처리방침',
        uri: 'https://stg-accounts.malangmalang.com/privacy',
      },

      gnbScript: {
        name: '한컴 GNB script',
        uri: 'https://stg-www.malangmalang.com/public/javascript/hm.1.js',
      },

      typingPractice: {
        name: '한컴 타자연습',
        uri: 'https://stg-tt-exam-c.malangmalang.com/typing/WebContent',
      },
      flippingCards: {
        name: '판 뒤집기',
        uri: 'https://stg-tt-block-c.malangmalang.com/Flip01/WebContent',
      },
      pilingCoins: {
        name: '동전쌓기',
        uri: 'https://stg-tt-coin-c.malangmalang.com/coinpile_sample/WebContent',
      },
      catchingMoles: {
        name: '두더지잡기',
        uri: 'https://stg-tt-mole-c.malangmalang.com/mole/WebContent',
      },
      rain: {
        name: '산성비',
        uri: 'https://stg-rain.malangmalang.com',
      },

      pilingCoinsGameServer: 'wss://stg-tt-gcs.malangmalang.com',
    },
    kakaoAuthKey: {
      key: 'aab54a4a77c2972c2694b19ad080bf5a',
    },
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
      { name: 'Accufly.AI', uri: 'http://www.accufly.ai/' },
    ],

    malangmalangLinks: {
      site: { name: '말랑말랑', uri: 'https://www.malangmalang.com' },
      login: {
        name: '로그인',
        uri: 'https://accounts.malangmalang.com/sign/in',
      },
      logout: {
        name: '로그아웃',
        uri: 'https://accounts.malangmalang.com/sign/out',
      },
      signup: {
        name: '회원가입',
        uri: 'https://accounts.malangmalang.com/sign/up',
      },
      typing: {
        name: '한컴타자',
        uri: 'https://typing.malangmalang.com',
      },
      intro: {
        name: '말랑말랑플랫폼 바로가기',
        uri: 'https://www.malangmalang.com',
      },
      collaboration: {
        name: '제휴사모집',
        uri: 'https://www.malangmalang.com/collaboration',
      },
      inquiry: {
        name: '문의하기',
        uri: 'https://www.malangmalang.com/inquiry?menu=taja',
      },
      termsOfUse: {
        name: '이용약관',
        uri: 'https://accounts.malangmalang.com/terms/current/ko',
      },
      privacyPolicy: {
        name: '개인정보처리방침',
        uri: 'https://accounts.malangmalang.com/privacy/current/ko',
      },

      gnbScript: {
        name: '한컴 GNB script',
        uri: 'https://www.malangmalang.com/public/javascript/hm.1.js',
      },

      typingPractice: {
        name: '한컴 타자연습',
        uri: 'https://tt-exam-c.malangmalang.com/typing/WebContent',
      },
      flippingCards: {
        name: '판 뒤집기',
        uri: 'https://tt-block-c.malangmalang.com/Flip01/WebContent',
      },
      pilingCoins: {
        name: '동전쌓기',
        uri: 'https://tt-coin-c.malangmalang.com/coinpile_sample/WebContent',
      },
      catchingMoles: {
        name: '두더지잡기',
        uri: 'https://tt-mole-c.malangmalang.com/mole/WebContent',
      },
      rain: {
        name: '산성비',
        uri: 'https://rain.malangmalang.com',
      },

      pilingCoinsGameServer: 'wss://tt-gcs.malangmalang.com',
    },
    kakaoAuthKey: {
      key: '9034004b7058278adca25bc25eb2e656',
    },
  },
};

export default WebConfig[ENVIRONMENT];
