import type { ProgressPoint } from '@/shared/types/pms'

export const progressSeed: Record<string, ProgressPoint[]> = {
  'P-2026': [
    { week: 'W-6', planned: 2, actual: 2 },
    { week: 'W-5', planned: 4, actual: 4 },
    { week: 'W-4', planned: 6, actual: 6 },
    { week: 'W-3', planned: 8, actual: 8 },
    { week: 'W-2', planned: 10, actual: 10 },
    { week: 'W-1', planned: 12, actual: 11.5 },
    { week: 'W0', planned: 14, actual: 12.16 },
  ],
}
