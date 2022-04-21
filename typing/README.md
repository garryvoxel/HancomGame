# typing
한컴타자연습 클라이언트

### 빌드 방법
- npm install
- npm run build-test/development/stage/production
- node index.js
-     => pm2 startOrRestart ./pm2/pm2.config-test/development/stage/production.json

### 별도 환경설정 방법
- npm run set-test/development/stage/production
-     => 단, test<->development / stage<->production 간에만 동일 빌드 호환 가능
- npm run set-test-me
-     => 타자연습 클라이언트만 test, 나머지 모듈은 development

#### 브랜치정책(20.06.25 기준)
- develop -> 개발용/dev서버용
- master -> stg/prd용, develop 브랜치에서 cherrypick or branch merge로 반영

##### 최초 실행시 gulp 에러 뜰 경우
npm install gulp-cli -g

##### NOTE
- gulp tst/dev-build: 빌드시 난독화 과정 없이 단순 copy(dev서버용)
- gulp stg/prd-build: 빌드시 js파일 난독화/console 제거
- 빌드 결과물은 public/typing 폴더에 생김
- 로컬에서 확인시 mGameStartState = this.gameConst.GameStartType.WEB,
  서버에서 동작할경우 mGameStartState = this.gameConst.GameStartType.WEB 사용 (MenuV2.js 2958라인)