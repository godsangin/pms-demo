import { progressSeed } from '@/mocks/db/seed/progress'
import { deliverablesSeedByProjectId } from '@/mocks/db/seed/deliverables'
import { programsSeedByProjectId } from '@/mocks/db/seed/programs'
import { projectsSeed } from '@/mocks/db/seed/projects'
import { risksSeed } from '@/mocks/db/seed/risks'
import { stageProgressSeedByProjectId } from '@/mocks/db/seed/stageProgress'
import { tasksSeedByProjectId } from '@/mocks/db/seed/tasks'
import { testScenariosSeedByProjectId } from '@/mocks/db/seed/testScenarios'
import { usersSeed } from '@/mocks/db/seed/users'
import { phasesSeed } from '@/mocks/db/seed/phases'

export const AS_OF_DATE = '2026-04-08' // CSV 기준일자에 맞춤

export const db = {
  asOfDate: AS_OF_DATE,
  users: usersSeed,
  projects: projectsSeed,
  phases: phasesSeed,
  risks: risksSeed,
  tasksByProjectId: tasksSeedByProjectId,
  deliverablesByProjectId: deliverablesSeedByProjectId,
  programsByProjectId: programsSeedByProjectId,
  testScenariosByProjectId: testScenariosSeedByProjectId,
  stageProgressByProjectId: stageProgressSeedByProjectId,
  progressByProjectId: progressSeed,
}
