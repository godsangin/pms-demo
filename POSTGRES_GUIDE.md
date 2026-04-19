# PostgreSQL 설치 및 PMS 데이터베이스 구성 가이드

이 문서는 PMS 데모 백엔드(`pms-was`) 연동을 위한 PostgreSQL 설치 및 설정 방법을 설명합니다.

---

## 1. 설치 방법

### 방법 A: Docker 사용 (가장 추천)
Docker가 설치되어 있다면 아래 명령어로 즉시 실행 가능합니다.
```bash
docker run --name pms-postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=pms \
  -p 5432:5432 \
  -d postgres:15
```

### 방법 B: 직접 설치 (Windows/macOS)
1. [PostgreSQL 공식 다운로드 페이지](https://www.postgresql.org/download/)에서 설치 파일을 다운로드합니다.
2. 설치 과정 중 **Password**를 \`postgres\`로 설정합니다.
3. 포트는 기본값인 \`5432\`를 유지합니다.

### 방법 C: 리눅스(Linux) 환경 설치
#### Ubuntu / Debian 계열
\`\`\`bash
# 1. 패키지 업데이트 및 설치
sudo apt update
sudo apt install postgresql postgresql-contrib

# 2. 서비스 시작 및 활성화
sudo systemctl start postgresql
sudo systemctl enable postgresql

# 3. 기본 계정(postgres) 비밀번호 설정
sudo -u postgres psql -c "ALTER USER postgres PASSWORD 'postgres';"
\`\`\`

#### RHEL / CentOS / Rocky Linux 계열
\`\`\`bash
# 1. 리포지토리 설치 및 패키지 설치
sudo dnf install -y https://download.postgresql.org/pub/repos/yum/reporpms/EL-9-x86_64/pgdg-redhat-repo-latest.noarch.rpm
sudo dnf -qy module disable postgresql
sudo dnf install -y postgresql15-server

# 2. DB 초기화 및 서비스 시작
sudo /usr/pgsql-15/bin/postgresql-15-setup initdb
sudo systemctl enable --now postgresql-15

# 3. 비밀번호 설정
sudo -u postgres psql -c "ALTER USER postgres PASSWORD 'postgres';"
\`\`\`


---

## 2. 데이터베이스 및 계정 생성

직접 설치한 경우, `psql` 또는 `pgAdmin`을 통해 아래 SQL을 실행합니다.

```sql
-- 데이터베이스 생성
CREATE DATABASE pms;

-- (선택) 전용 사용자 생성
CREATE USER pms_user WITH PASSWORD 'pms_pass';
GRANT ALL PRIVILEGES ON DATABASE pms TO pms_user;
```

---

## 3. 백엔드 연동 설정 (`pms-was`)

`pms-was` 디렉토리에 `.env` 파일을 생성하여 위에서 설정한 정보를 입력합니다.

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=pms
PORT=3000
```

---

## 4. 확인 사항
1. **서버 실행:** `npm run start:dev` 실행 시 콘솔에 `TypeORM` 연결 성공 메시지가 나오는지 확인합니다.
2. **테이블 자동 생성:** `synchronize: true` 설정으로 인해 서버 실행 시 엔티티 기반 테이블이 자동 생성됩니다.
3. **Swagger 확인:** `http://localhost:3000/api-docs` 접속 확인.
