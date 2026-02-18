import { useQuery } from '@tanstack/react-query'

import {
  fetchPrograms,
  fetchStageProgress,
  fetchTestScenarios,
} from '@/features/project/software/api'
import type { Lang } from '@/shared/i18n/dict'

export function useProgramsQuery(projectId: string, lang: Lang) {
  return useQuery({
    queryKey: ['software-programs', projectId, lang],
    queryFn: () => fetchPrograms(projectId, lang),
    enabled: projectId.length > 0,
  })
}

export function useTestScenariosQuery(projectId: string, lang: Lang) {
  return useQuery({
    queryKey: ['software-test-scenarios', projectId, lang],
    queryFn: () => fetchTestScenarios(projectId, lang),
    enabled: projectId.length > 0,
  })
}

export function useStageProgressQuery(projectId: string) {
  return useQuery({
    queryKey: ['software-stage-progress', projectId],
    queryFn: () => fetchStageProgress(projectId),
    enabled: projectId.length > 0,
  })
}
