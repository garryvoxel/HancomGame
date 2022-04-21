# HOMEPAGE

한컴타자 PC용 front 프로젝트

### 빌드 방법(2020.07.17 수정)

- npm install
- npm run build-test/development/stage/production
- pm2 startOrRestart ./pm2/pm2.config-test/development/stage/production.json

### 로컬 로그인 테스트

- hosts 파일에 taja.malangmalang.com 추가
- npm install
- npm run build-development
- pm2 startOrRestart ./pm2/pm2.config-development.json
- test로 빌드 및 실행시 백엔드권한 없을경우 로컬로 연결되어 실행안됨
