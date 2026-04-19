import type { StageProgress } from '@/shared/types/pms'

export const stageProgressSeedByProjectId: Record<string, StageProgress[]> = {
  'P-2026': [
    { projectId: 'P-2026', stage: 'ANALYSIS_DESIGN', plannedPct: 45, actualPct: 36.15 },
    { projectId: 'P-2026', stage: 'DEVELOPMENT', plannedPct: 5, actualPct: 0 },
    { projectId: 'P-2026', stage: 'TEST', plannedPct: 0, actualPct: 0 },
    { projectId: 'P-2026', stage: 'DEPLOYMENT', plannedPct: 0, actualPct: 0 },
  ],
}
