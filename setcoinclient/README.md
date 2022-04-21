# SetCoinClient
동전쌓기 게임클라이언트

### 빌드 방법
- npm install
- npm run build-test/development/stage/production
- node index.js
-     => pm2 startOrRestart ./pm2/pm2.config-test/development/stage/production.json

### 별도 환경설정 방법
- npm run set-test/development/stage/production
- 단, test<->development / stage<->production 간에만 동일 빌드 호환 가능

#### 브랜치정책(20.06.25 기준)
- develop -> 개발용/dev서버용
- master -> stg/prd용, develop 브랜치에서 cherrypick or branch merge로 반영

##### 최초 실행시 gulp 에러뜰 경우
npm install gulp-cli -g

##### NOTE
- gulp tst/dev-build: 빌드시 난독화 과정 없이 단순 copy(tst/dev서버용)
- gulp stg/prd-build: 빌드시 js파일 난독화/console 제거
- 빌드 결과물은 public/coinpile_sample 폴더에 생김