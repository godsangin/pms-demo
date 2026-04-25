import type { StageProgress } from '@/shared/types/pms'

export const stageProgressSeedByProjectId: Record<string, StageProgress[]> = {
  'P-2026': [
    { projectId: 'P-2026', stage: 'ANALYSIS_DESIGN', planned: 45, actual: 36.15 },
    { projectId: 'P-2026', stage: 'DEVELOPMENT', planned: 5, actual: 0 },
    { projectId: 'P-2026', stage: 'TEST', planned: 0, actual: 0 },
    { projectId: 'P-2026', stage: 'DEPLOYMENT', planned: 0, actual: 0 },
  ],
}
