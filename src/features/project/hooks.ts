import { useQuery } from '@tanstack/react-query'

import {
  fetchProjectDeliverables,
  fetchProjectDetail,
  fetchProjectProgress,
  fetchProjectTasks,
  fetchProjectDefects,
} from '@/features/project/api'
import type { Lang } from '@/shared/i18n/dict'

export function useProjectDetailQuery(projectId: string, lang: Lang) {
  return useQuery({
    queryKey: ['project-detail', projectId, lang],
    queryFn: () => fetchProjectDetail(projectId, lang),
    enabled: projectId.length > 0,
  })
}

export function useProjectProgressQuery(projectId: string) {
  return useQuery({
    queryKey: ['project-progress', projectId],
    queryFn: () => fetchProjectProgress(projectId),
    enabled: projectId.length > 0,
  })
}

export function useProjectTasksQuery(projectId: string, lang: Lang) {
  return useQuery({
    queryKey: ['project-tasks', projectId, lang],
    queryFn: () => fetchProjectTasks(projectId, lang),
    enabled: projectId.length > 0,
  })
}

export function useProjectDeliverablesQuery(projectId: string, lang: Lang) {
  return useQuery({
    queryKey: ['project-deliverables', projectId, lang],
    queryFn: () => fetchProjectDeliverables(projectId, lang),
    enabled: projectId.length > 0,
  })
}

export function useProjectDefectsQuery(projectId: string) {
  return useQuery({
    queryKey: ['project-defects', projectId],
    queryFn: () => fetchProjectDefects(projectId),
    enabled: projectId.length > 0,
  })
}
