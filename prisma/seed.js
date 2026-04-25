import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 시드 데이터 입력을 시작합니다...')
  
  const sqlPath = path.join(__dirname, '..', 'SEED.sql')
  const sql = fs.readFileSync(sqlPath, 'utf8')

  // 1. 주석 제거 및 SQL 문 분리
  const statements = sql
    .split('\n')
    // 한 줄 주석 제거
    .map(line => line.split('--')[0])
    .join('\n')
    // 세미콜론으로 문장 분리
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0)

  try {
    // 2. 순차적으로 실행
    for (const statement of statements) {
      await prisma.$executeRawUnsafe(statement)
    }
    console.log(`✅ 총 ${statements.length}개의 SQL 문이 성공적으로 실행되었습니다.`)
  } catch (e) {
    console.error('❌ 시드 데이터 입력 중 오류 발생:', e)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
