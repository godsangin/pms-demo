import { useQuery } from '@tanstack/react-query'

import { fetchRisksBoard } from '@/features/risk/api'
import type { Lang } from '@/shared/i18n/dict'

export function useRisksBoardQuery(lang: Lang) {
  return useQuery({
    queryKey: ['risks-board', lang],
    queryFn: () => fetchRisksBoard(lang),
  })
}
