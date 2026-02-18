import { useQuery } from '@tanstack/react-query'

import { fetchPortfolioDashboard } from '@/features/portfolio/api'
import type { Lang } from '@/shared/i18n/dict'

export function usePortfolioDashboardQuery(lang: Lang) {
  return useQuery({
    queryKey: ['portfolio-dashboard', lang],
    queryFn: () => fetchPortfolioDashboard(lang),
  })
}
