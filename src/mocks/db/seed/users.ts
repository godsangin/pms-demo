import type { User } from '@/shared/types/pms'

export const usersSeed: User[] = [
  {
    id: '00000000-0000-0000-0000-000000000001',
    username: 'komsco',
    fullName: '한국조폐공사 관리자',
    role: 'ADMIN',
  },
  {
    id: '00000000-0000-0000-0000-000000000002',
    username: 'seeroo',
    fullName: '시루 담당자',
    role: 'USER',
  },
  {
    id: '00000000-0000-0000-0000-000000000003',
    username: 'dukn',
    fullName: '덕은 담당자',
    role: 'USER',
  },
  {
    id: '00000000-0000-0000-0000-000000000004',
    username: 'pytha',
    fullName: '피타 담당자',
    role: 'USER',
  },
  {
    id: '00000000-0000-0000-0000-000000000005',
    username: 'nice',
    fullName: '나이스 담당자',
    role: 'USER',
  },
]
