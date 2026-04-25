import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import {
  fetchPrograms,
  fetchStageProgress,
  fetchTestScenarios,
  fetchDefects,
  registerProgramsBulk,
  registerDeliverablesBulk,
  updateProgram,
  createTask,
  updateDeliverableTailoring,
  createDeliverable,
  uploadDeliverableFile,
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

export function useDefectsQuery(projectId: string) {
  return useQuery({
    queryKey: ['project-defects', projectId],
    queryFn: () => fetchDefects(projectId),
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

export function useRegisterDeliverablesBulkMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ projectId, deliverables }: { projectId: string; deliverables: any[] }) =>
      registerDeliverablesBulk(projectId, deliverables),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['project-deliverables', variables.projectId] })
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
      queryClient.invalidateQueries({ queryKey: ['software-stage-progress', variables.projectId] })
      queryClient.invalidateQueries({ queryKey: ['project-detail', variables.projectId] })
    },
  })
}

export function useCreateTaskMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ projectId, task }: { projectId: string; task: Partial<ProgramItem> }) =>
      createTask(projectId, task),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['software-programs', variables.projectId] })
      queryClient.invalidateQueries({ queryKey: ['software-stage-progress', variables.projectId] })
      queryClient.invalidateQueries({ queryKey: ['project-detail', variables.projectId] })
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
      queryClient.invalidateQueries({ queryKey: ['project-detail', variables.projectId] })
    },
  })
}

export function useUploadDeliverableFileMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ projectId, deliverableId, file }: { projectId: string; deliverableId: string; file: File }) =>
      uploadDeliverableFile(projectId, deliverableId, file),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['project-deliverables', variables.projectId] })
      queryClient.invalidateQueries({ queryKey: ['project-detail', variables.projectId] })
    },
  })
}
