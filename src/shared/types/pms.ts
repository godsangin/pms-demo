export type Role = 'ADMIN' | 'USER' | 'EXEC'

export type User = {
  id: string
  username: string
  fullName: string
  orgName?: string
  role: Role
}

export type TaskCategory = 'MILESTONE' | 'PERIODIC' | 'DELIVERABLE' | 'PROGRAM' | 'SCENARIO' | 'COMMON'

export type DefectStatus = '조치예정' | '조치 중' | '조치완료'

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
  pmId?: string
  startDate: string
  endDate: string
  status: StatusSignal
  totalProgress: number
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
  ownerId?: string
  cause: string
  action: string
  expectedImpact: string
  targetDate: string
}

export type ProgramStatus = 'READY' | 'IN_PROGRESS' | 'COMPLETED' | 'DELAYED' | 'DONE' | 'BLOCKED' | 'NOT_STARTED'

export type ProjectTask = {
  id: string
  projectId: string
  phaseId: number
  category: TaskCategory
  name: string
  orgName: string
  managerId: string
  progressPct: number
  isRequiredDeliverable: boolean
  startDate: string
  endDate: string
  status: ProgramStatus | string
  owner?: string // ProgramItem과의 호환성을 위해 추가
  wbsCode?: string
  depth?: number
  weight?: number
  baselineStart?: string
  baselineEnd?: string
  actualStart?: string
  actualEnd?: string
}

export type DefectItem = {
  id: string
  taskId: string
  title: string
  description?: string
  status: DefectStatus
  severity: string
  reporterId: string
  assigneeId: string
  createdAt: string
}

export type DeliverableStatus = 'PLANNED' | 'SUBMITTED' | 'ACCEPTED' | 'REJECTED' | 'NOT_SUBMITTED'
export type DeliveryStage = 'ANALYSIS_DESIGN' | 'DEVELOPMENT' | 'TEST' | 'DEPLOYMENT'

export type DeliverableItem = {
  id: string
  projectId: string
  taskId?: string
  title: string
  status: DeliverableStatus
  dueDate: string
  submittedDate?: string
  decidedDate?: string
  stage?: DeliveryStage
  tailoringHistory?: any[]
  attachment?: {
    name: string
    url: string
    uploadedAt: string
  }
}

export type ProjectDetail = {
  project: ProjectListItem
  risks: RiskItem[]
  phases: {
    id: number
    type: string
    name: string
    weight: number
    progressRate: number
  }[]
}

export type ProgressPoint = {
  week: string
  planned: number
  actual: number
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

export type ProgramItem = {
  id: string
  projectId: string
  name: string
  owner?: string
  status: ProgramStatus
  progressPct: number
  baselineEnd: string
  actualEnd?: string
  code?: string
  baselineStart?: string
  actualStart?: string
}

export type StageProgress = {
  projectId: string
  stage: DeliveryStage
  planned: number
  actual: number
  plannedPct?: number
  actualPct?: number
}

export type TestType = 'UNIT' | 'INTEGRATION'
export type TestScenarioStatus = 'READY' | 'EXECUTED' | 'DRAFT'
export type TestResult = 'PASS' | 'FAIL' | 'N/A' | 'BLOCKED' | 'NA'
export type IntakeStatus = 'PLANNED' | 'RECEIVED' | 'REJECTED' | 'PENDING'

export type TestScenario = {
  id: string
  projectId: string
  programId: string
  type: TestType
  title: string
  status: TestScenarioStatus
  result: TestResult
  owner: string
  evidenceNote?: string
  intakeStatus: IntakeStatus
  executedDate?: string
}
