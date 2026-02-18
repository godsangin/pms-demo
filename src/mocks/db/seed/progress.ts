import type { ProgressPoint } from '@/shared/types/pms'

export const progressSeed: Record<string, ProgressPoint[]> = {
  'P-1042': [
    { week: 'W-6', planned: 52, actual: 50 },
    { week: 'W-5', planned: 58, actual: 57 },
    { week: 'W-4', planned: 64, actual: 64 },
    { week: 'W-3', planned: 70, actual: 71 },
    { week: 'W-2', planned: 76, actual: 77 },
    { week: 'W-1', planned: 82, actual: 83 },
    { week: 'W0', planned: 88, actual: 89 },
  ],
  'P-1098': [
    { week: 'W-6', planned: 40, actual: 39 },
    { week: 'W-5', planned: 46, actual: 46 },
    { week: 'W-4', planned: 52, actual: 52 },
    { week: 'W-3', planned: 58, actual: 58 },
    { week: 'W-2', planned: 64, actual: 63 },
    { week: 'W-1', planned: 70, actual: 70 },
    { week: 'W0', planned: 76, actual: 77 },
  ],
  'P-1120': [
    { week: 'W-6', planned: 18, actual: 17 },
    { week: 'W-5', planned: 24, actual: 22 },
    { week: 'W-4', planned: 30, actual: 27 },
    { week: 'W-3', planned: 36, actual: 32 },
    { week: 'W-2', planned: 42, actual: 38 },
    { week: 'W-1', planned: 48, actual: 44 },
    { week: 'W0', planned: 54, actual: 50 },
  ],
  'P-1187': [
    { week: 'W-6', planned: 60, actual: 56 },
    { week: 'W-5', planned: 66, actual: 60 },
    { week: 'W-4', planned: 72, actual: 64 },
    { week: 'W-3', planned: 78, actual: 68 },
    { week: 'W-2', planned: 84, actual: 71 },
    { week: 'W-1', planned: 90, actual: 74 },
    { week: 'W0', planned: 96, actual: 78 },
  ],
}
