# HOMEPAGE-M
한컴타자 모바일용 front 프로젝트

### 빌드 방법
- npm install
- npm run build-test/development/stage/production
- pm2 startOrRestart ./pm2/pm2.config-test/development/stage/production.json

### 로컬 로그인 테스트
- hosts 파일에 taja.malangmalang.com 추가
- npm install
- npm run build-test
- pm2 startOrRestart ./pm2/pm2.config-test.json

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Run your tests
```
npm run test
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
