# PMS-SI 통합 프로젝트 빌드 및 배포 가이드

본 프로젝트는 프론트엔드(React)와 백엔드(NestJS)가 하나로 통합된 풀스택 어플리케이션입니다. 빌드 후 단일 Node.js 프로세스로 기동됩니다.

## 1. 사전 준비 사항
- **Node.js**: v18 이상 권장
- **데이터베이스**: PostgreSQL (서비스 포트 5432)
- **환경 변수**: 루트 디렉토리에 `.env` 파일 설정

```env
# 데이터베이스 접속 정보
DATABASE_URL="postgresql://사용자명:비밀번호@localhost:5432/DB명?schema=public"

# 서버 설정
PORT=3000

# 프론트엔드 설정 (Mock 모드 해제 필수)
VITE_MOCK_MODE=false
```

## 2. 초기 세팅 (최초 1회 또는 환경 변경 시)

새로운 환경에서 프로젝트를 시작할 때 반드시 아래 순서대로 실행하여 데이터베이스와 타입 시스템을 준비해야 합니다.

```bash
# 1. 의존성 설치
npm install --legacy-peer-deps

# 2. Prisma Client 생성 (TypeScript 타입 동기화)
npm run prisma:generate

# 3. 데이터베이스 스키마 생성 및 초기 데이터(Seed) 주입
# *주의: 이 명령은 DB 테이블을 생성하고 prisma/seed.js를 실행합니다.
npm run prisma:push
```

## 3. 빌드 과정

루트 디렉토리에서 아래 명령어를 실행하여 프론트엔드와 백엔드를 모두 빌드합니다.

```bash
# 통합 빌드 (FE -> BE 순차 진행)
# 내부적으로 npm run build:fe && npm run build:be 를 실행합니다.
npm run build
```

### 빌드 결과물 (`dist/` 폴더)
- `dist/`: 프론트엔드 정적 파일 (index.html, JS, CSS 등)
- `dist/pms-was/`: 백엔드 실행 파일 및 관련 설정

## 4. 배포 및 기동

### 파일 복사
서버의 배포 경로에 아래 항목들을 복사합니다.
- `dist/` (폴더 전체)
- `package.json`
- `node_modules/` (또는 서버에서 `npm install --production` 실행)
- `.env` (서버 환경에 맞게 수정)

### 서버 기동 (터미널)
```bash
npm run start
```
위 명령어는 내부적으로 `node dist/pms-was/main.js`를 실행하며, 설정된 포트(기본 3000)에서 웹과 API 서비스를 동시에 시작합니다.

## 5. 운영 환경 권장 설정

### 프로세스 관리 (PM2)
서버가 예기치 않게 종료되거나 재부팅될 때 자동으로 재시작되도록 PM2 사용을 권장합니다.

```bash
# PM2 설치
npm install -g pm2

# 서비스 등록 및 실행
pm2 start dist/pms-was/main.js --name pms-app

# 리부트 시 자동 실행 설정
pm2 save
pm2 startup
```

### 리버스 프록시 (Nginx)
보안(SSL) 및 포트 관리를 위해 Nginx를 앞단에 두는 구조를 권장합니다.

```nginx
server {
    listen 80;
    server_name your.domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---
**주의 사항**:
1. **DB 스키마 변경 시**: `prisma/schema.prisma`를 수정한 경우 반드시 `npm run prisma:generate`와 `npm run prisma:push`를 다시 실행해야 합니다.
2. **Node.js 버전**: 백엔드와 프론트엔드 모두 최신 LTS 버전을 권장합니다.
3. **포트 충돌**: 설정한 `PORT`가 이미 사용 중인지 확인하십시오.
