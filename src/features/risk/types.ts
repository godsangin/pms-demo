import type { ProjectListItem, RiskItem, RiskStatus } from '@/shared/types/pms'

export type RiskBoardItem = {
  risk: RiskItem
  project: Pick<ProjectListItem, 'id' | 'name' | 'status' | 'svThisWeek'>
}

export type RiskBoardData = {
  asOfDate: string
  items: RiskBoardItem[]
}

export type RiskStatusOverride = Partial<Record<string, RiskStatus>>
