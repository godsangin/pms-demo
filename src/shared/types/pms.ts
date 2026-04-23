export type Role = 'ADMIN' | 'USER'

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
  status: string
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

export type DeliverableItem = {
  id: string
  taskId: string
  name: string
  filePath?: string
  linkUrl?: string
  uploadedAt: string
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
