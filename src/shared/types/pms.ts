export type StatusSignal = 'GREEN' | 'YELLOW' | 'RED'

export type RiskSeverity = 'MEDIUM' | 'HIGH' | 'CRITICAL'

export type RiskStatus = 'OPEN' | 'MITIGATING' | 'CLOSED'

export type Milestone = {
  name: string
  date: string
}

export type ProjectListItem = {
  id: string
  name: string
  description: string
  pmName: string
  startDate: string
  endDate: string
  status: StatusSignal
  svThisWeek: number
  nextMilestone: Milestone
  highRiskCount: number
  deliverableApprovalRate: number
  criticalTaskCount: number
}

export type RiskItem = {
  id: string
  projectId: string
  severity: RiskSeverity
  status: RiskStatus
  title: string
  owner: string
  cause: string
  action: string
  expectedImpact: string
  targetDate: string
}

export type ProjectTask = {
  id: string
  projectId: string
  wbsCode: string
  depth: number
  name: string
  weight: number
  progressPct: number
  baselineStart: string
  baselineEnd: string
  actualStart?: string
  actualEnd?: string
}

export type DeliverableStatus = 'PLANNED' | 'SUBMITTED' | 'ACCEPTED' | 'REJECTED' | 'NOT_SUBMITTED'

export type DeliveryStage = 'ANALYSIS_DESIGN' | 'DEVELOPMENT' | 'TEST' | 'DEPLOYMENT'

export type DeliverableItem = {
  id: string
  projectId: string
  title: string
  status: DeliverableStatus
  stage?: DeliveryStage
  dueDate: string
  submittedDate?: string
  decidedDate?: string
  attachment?: {
    name: string
    url: string
    uploadedAt: string
  }
  tailoringHistory?: {
    id: string
    type: 'ADD' | 'REMOVE' | 'MODIFY'
    reason: string
    date: string
    author: string
  }[]
}

export type ProgramStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'DONE' | 'BLOCKED'

export type ProgramItem = {
  id: string
  projectId: string
  code: string
  name: string
  owner: string
  status: ProgramStatus
  progressPct: number
  baselineStart: string
  baselineEnd: string
  actualStart?: string
  actualEnd?: string
}

export type TestType = 'UNIT' | 'INTEGRATION'

export type TestScenarioStatus = 'DRAFT' | 'READY' | 'EXECUTED'

export type TestResult = 'PASS' | 'FAIL' | 'BLOCKED' | 'NA'

export type IntakeStatus = 'PENDING' | 'RECEIVED'

export type TestScenario = {
  id: string
  projectId: string
  programId: string
  type: TestType
  title: string
  status: TestScenarioStatus
  result: TestResult
  owner: string
  evidenceNote: string
  intakeStatus: IntakeStatus
  executedDate?: string
}

export type StageProgress = {
  projectId: string
  stage: DeliveryStage
  plannedPct: number
  actualPct: number
}

export type PortfolioKpis = {
  totalProjects: number
  inProgressProjects: number
  onTrackPercent: number
  atRiskProjects: number
  criticalTasks: number
  deliverableApprovalRate: number
  portfolioSvAvg: number
}

export type PortfolioDashboard = {
  asOfDate: string
  kpis: PortfolioKpis
  projects: ProjectListItem[]
  topRisks: RiskItem[]
}

export type ProjectDetail = {
  project: ProjectListItem
  risks: RiskItem[]
}

export type ProgressPoint = {
  week: string
  planned: number
  actual: number
}
