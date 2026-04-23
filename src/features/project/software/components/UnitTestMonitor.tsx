import { Card, CardBody, CardHeader, CardTitle } from '@/shared/ui/Card'
import { Badge } from '@/shared/ui/Badge'
import { Table } from '@/shared/ui/Table'
import type { ProjectTask, DefectItem } from '@/shared/types/pms'

interface UnitTestMonitorProps {
  programs: ProjectTask[]
  defects: DefectItem[]
}

export function UnitTestMonitor({ programs, defects }: UnitTestMonitorProps) {
  // 수행기관별 집계
  const orgStats = programs.reduce((acc, p) => {
    if (!acc[p.orgName]) acc[p.orgName] = { total: 0, progressSum: 0 }
    acc[p.orgName].total += 1
    acc[p.orgName].progressSum += p.progressPct
    return acc
  }, {} as Record<string, { total: number, progressSum: number }>)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {Object.entries(orgStats).map(([org, stat]) => (
          <Card key={org}>
            <CardBody className="p-4">
              <div className="text-xs font-medium text-zinc-500">{org} 생산성</div>
              <div className="mt-1 flex items-baseline gap-2">
                <div className="text-2xl font-bold">{(stat.progressSum / stat.total).toFixed(1)}%</div>
                <div className="text-xs text-zinc-400">{stat.total}개 프로그램</div>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>단위테스트 수행 현황</CardTitle>
        </CardHeader>
        <CardBody className="p-0">
          <Table>
            <thead>
              <tr className="border-b border-zinc-100 bg-zinc-50/50 text-left text-xs font-medium text-zinc-500">
                <th className="px-4 py-3">프로그램명</th>
                <th className="px-4 py-3">수행기관</th>
                <th className="px-4 py-3">진척률</th>
                <th className="px-4 py-3">연관 결함</th>
                <th className="px-4 py-3">상태</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {programs.map((p) => {
                const programDefects = defects.filter(d => d.taskId === p.id)
                return (
                  <tr key={p.id} className="text-sm hover:bg-zinc-50/50">
                    <td className="px-4 py-3 font-medium">{p.name}</td>
                    <td className="px-4 py-3 text-zinc-600">{p.orgName}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-16 overflow-hidden rounded-full bg-zinc-100">
                          <div 
                            className="h-full bg-blue-500" 
                            style={{ width: `${p.progressPct}%` }}
                          />
                        </div>
                        <span className="text-xs tabular-nums">{p.progressPct}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {programDefects.length > 0 ? (
                        <Badge variant="outline" className="text-red-600 border-red-200 bg-red-50">
                          결함 {programDefects.length}건
                        </Badge>
                      ) : (
                        <span className="text-zinc-400">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={p.progressPct === 100 ? 'success' : 'secondary'}>
                        {p.progressPct === 100 ? '완료' : '진행중'}
                      </Badge>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </Table>
        </CardBody>
      </Card>
    </div>
  )
}
