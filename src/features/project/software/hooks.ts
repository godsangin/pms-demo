import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import {
  fetchPrograms,
  fetchStageProgress,
  fetchTestScenarios,
  registerProgramsBulk,
  updateProgram,
  updateDeliverableTailoring,
  createDeliverable,
} from '@/features/project/software/api'
import type { Lang } from '@/shared/i18n/dict'
import type { ProgramItem, DeliverableItem } from '@/shared/types/pms'

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

export function useRegisterProgramsBulkMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ projectId, programs }: { projectId: string; programs: any[] }) =>
      registerProgramsBulk(projectId, programs),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['software-programs', variables.projectId] })
    },
  })
}

export function useUpdateProgramMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ projectId, programId, updates }: { projectId: string; programId: string; updates: Partial<ProgramItem> }) =>
      updateProgram(projectId, programId, updates),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['software-programs', variables.projectId] })
    },
  })
}

export function useUpdateDeliverableTailoringMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ projectId, deliverableId, tailoring }: { projectId: string; deliverableId: string; tailoring: any }) =>
      updateDeliverableTailoring(projectId, deliverableId, tailoring),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['project-deliverables', variables.projectId] })
    },
  })
}

export function useCreateDeliverableMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ projectId, deliverable }: { projectId: string; deliverable: Partial<DeliverableItem> }) =>
      createDeliverable(projectId, deliverable),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['project-deliverables', variables.projectId] })
    },
  })
}
