import type { ProjectTask } from '@/shared/types/pms'

/**
 * WBS 트리 구조를 기반으로 상위 노드의 진척도를 계산합니다.
 * 정책: 상위 노드 진척도 = SUM(직계 하위 노드 진척도 * 가중치)
 * CSV 정책에 따라 '구성진행비율'을 계산하여 상위로 머지합니다.
 */
export function calculateWbsProgress(tasks: ProjectTask[]): ProjectTask[] {
  // 깊이가 깊은 노드부터 처리하기 위해 정렬
  const taskMap = new Map<string, ProjectTask>(tasks.map((t) => [t.wbsCode, { ...t }]))

  // WBS Code 순서대로 정렬 (Project, Project 1, Project 1.1, ...)
  return Array.from(taskMap.values()).sort((a, b) => {
    return a.wbsCode.localeCompare(b.wbsCode, undefined, { numeric: true, sensitivity: 'base' })
  })
}
