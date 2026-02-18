import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import { useI18n } from '@/shared/i18n/I18nProvider'
import type { ProgressPoint } from '@/shared/types/pms'
import { Card, CardBody, CardHeader, CardTitle } from '@/shared/ui/Card'

export function ProgressTrendChart({ points }: { points: ProgressPoint[] }) {
  const { t } = useI18n()

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('chart.progressTrend.title')}</CardTitle>
      </CardHeader>
      <CardBody className="h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={points} margin={{ left: 8, right: 8, top: 8, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E4E4E7" />
            <XAxis
              dataKey="week"
              tick={{ fontSize: 11, fill: '#52525B' }}
              axisLine={{ stroke: '#D4D4D8' }}
              tickLine={{ stroke: '#D4D4D8' }}
            />
            <YAxis
              domain={[0, 100]}
              tickFormatter={(v) => `${v}%`}
              tick={{ fontSize: 11, fill: '#52525B' }}
              axisLine={{ stroke: '#D4D4D8' }}
              tickLine={{ stroke: '#D4D4D8' }}
            />
            <Tooltip
              formatter={(v) => [`${v}%`, '']}
              contentStyle={{ borderRadius: 12, borderColor: '#E4E4E7' }}
              labelStyle={{ fontWeight: 600 }}
            />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Line
              type="monotone"
              dataKey="planned"
              name={t('chart.progressTrend.planned')}
              stroke="#71717A"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="actual"
              name={t('chart.progressTrend.actual')}
              stroke="#18181B"
              strokeWidth={2.5}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardBody>
    </Card>
  )
}
