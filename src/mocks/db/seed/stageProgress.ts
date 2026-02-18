import type { StageProgress } from '@/shared/types/pms'

export const stageProgressSeedByProjectId: Record<string, StageProgress[]> = {
  'P-1098': [
    { projectId: 'P-1098', stage: 'ANALYSIS_DESIGN', plannedPct: 100, actualPct: 100 },
    { projectId: 'P-1098', stage: 'DEVELOPMENT', plannedPct: 78, actualPct: 64 },
    { projectId: 'P-1098', stage: 'TEST', plannedPct: 40, actualPct: 22 },
    { projectId: 'P-1098', stage: 'DEPLOYMENT', plannedPct: 10, actualPct: 0 },
  ],
}
