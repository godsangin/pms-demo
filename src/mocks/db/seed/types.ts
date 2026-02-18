import type {
  DeliverableItem,
  ProjectListItem,
  ProgramItem,
  ProjectTask,
  RiskItem,
  StageProgress,
  TestScenario,
} from '@/shared/types/pms'

export type LocalizedText = {
  en: string
  ko: string
}

export type LocalizedProject = Omit<ProjectListItem, 'name' | 'description' | 'nextMilestone'> & {
  name: LocalizedText
  description: LocalizedText
  nextMilestone: {
    name: LocalizedText
    date: string
  }
}

export type LocalizedRisk = Omit<RiskItem, 'title' | 'cause' | 'action' | 'expectedImpact'> & {
  title: LocalizedText
  cause: LocalizedText
  action: LocalizedText
  expectedImpact: LocalizedText
}

export type LocalizedTask = Omit<ProjectTask, 'name'> & {
  name: LocalizedText
}

export type LocalizedDeliverable = Omit<DeliverableItem, 'title'> & {
  title: LocalizedText
}

export type LocalizedProgram = Omit<ProgramItem, 'name'> & {
  name: LocalizedText
}

export type LocalizedTestScenario = Omit<TestScenario, 'title' | 'evidenceNote'> & {
  title: LocalizedText
  evidenceNote: LocalizedText
}

export type LocalizedStageProgress = StageProgress
