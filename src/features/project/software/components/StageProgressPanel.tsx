import React from 'react';
import { Card, CardHeader, CardTitle, CardBody } from '@/shared/ui/Card';
import type { DeliverableItem, ProgramItem, TestScenario } from '@/shared/types/pms';
import { cn } from '@/shared/lib/cn';

interface StageProgressProps {
  deliverables?: DeliverableItem[];
  programs?: ProgramItem[];
  scenarios?: TestScenario[];
}

export const StageProgressPanel: React.FC<StageProgressProps> = ({ 
  deliverables = [], 
  programs = [],
  scenarios = []
}) => {
  // 1. 분석/설계: 전체 산출물 대비 '입고(SUBMITTED 이상)' 산출물 기준
  const calculateAnalysisProgress = () => {
    if (!deliverables || deliverables.length === 0) return 0;
    // 입고된 것은 SUBMITTED, ACCEPTED, REJECTED 상태를 포함 (PLANNED/NOT_SUBMITTED 제외)
    const received = deliverables.filter(d => 
      d.status === 'SUBMITTED' || d.status === 'ACCEPTED' || d.status === 'REJECTED'
    ).length;
    return (received / deliverables.length) * 100;
  };

  // 2. 개발: 프로그램 목록별 진척률의 평균 값
  const calculateDevProgress = () => {
    if (!programs || programs.length === 0) return 0;
    const total = programs.reduce((acc, p) => acc + (p.progressPct || 0), 0);
    return total / programs.length;
  };

  // 3. 테스트: 전체 통합테스트 시나리오 대비 결과가 PASS인 시나리오 기준
  const calculateTestProgress = () => {
    const integrationScenarios = scenarios.filter(s => s.type === 'INTEGRATION');
    if (integrationScenarios.length === 0) return 0;
    
    const passed = integrationScenarios.filter(s => s.result === 'PASS').length;
    return (passed / integrationScenarios.length) * 100;
  };

  const analysisProgress = calculateAnalysisProgress();
  const devProgress = calculateDevProgress();
  const testProgress = calculateTestProgress();

  const metrics = [
    {
      label: '분석 / 설계',
      subLabel: '산출물 입고 기준',
      progress: analysisProgress,
      color: 'bg-blue-500',
      textColor: 'text-blue-600',
      detail: `입고 ${deliverables.filter(d => d.status !== 'PLANNED').length} / 전체 ${deliverables.length} 건`
    },
    {
      label: '개발 구현',
      subLabel: '프로그램 진척도 평균',
      progress: devProgress,
      color: 'bg-emerald-500',
      textColor: 'text-emerald-600',
      detail: `대상 ${programs.length}개 프로그램 목록 연동`
    },
    {
      label: '테스트 / 검증',
      subLabel: '통합테스트 PASS 기준',
      progress: testProgress,
      color: 'bg-indigo-500',
      textColor: 'text-indigo-600',
      detail: `PASS ${scenarios.filter(s => s.type === 'INTEGRATION' && s.result === 'PASS').length} / 전체 통합 ${scenarios.filter(s => s.type === 'INTEGRATION').length} 건`
    }
  ];

  return (
    <Card className="h-full border-zinc-200/60 shadow-sm">
      <CardHeader className="border-b border-zinc-100/80 pb-3">
        <CardTitle className="text-base font-bold text-zinc-900">단계별 자동 집계 현황</CardTitle>
      </CardHeader>
      <CardBody className="py-5 space-y-8">
        {metrics.map((m, idx) => (
          <div key={idx} className="group">
            <div className="flex justify-between items-end mb-2">
              <div>
                <span className="text-sm font-bold text-zinc-900">{m.label}</span>
                <span className="ml-2 text-[11px] font-medium text-zinc-400 uppercase tracking-wider">{m.subLabel}</span>
              </div>
              <span className={cn("text-lg font-black tabular-nums tracking-tighter", m.textColor)}>
                {m.progress.toFixed(1)}%
              </span>
            </div>
            
            <div className="relative w-full bg-zinc-100 h-3 rounded-full overflow-hidden shadow-inner border border-zinc-200/50">
              <div 
                className={cn("h-full transition-all duration-1000 ease-out rounded-full", m.color)} 
                style={{ width: `${m.progress}%` }}
              />
            </div>
            
            <div className="mt-2 flex items-center justify-between">
              <p className="text-[11px] text-zinc-500 font-medium">
                {m.detail}
              </p>
              {m.progress === 100 && (
                <span className="text-[10px] font-bold text-white bg-zinc-900 px-1.5 py-0.5 rounded uppercase tracking-tighter">Completed</span>
              )}
            </div>
          </div>
        ))}

        {/* 종합 지수 (Optional) */}
        <div className="pt-4 mt-2 border-t border-dashed border-zinc-200">
          <div className="flex justify-between items-center px-1">
            <span className="text-xs font-bold text-zinc-500">실시간 데이터 정합성</span>
            <span className="text-[10px] font-mono text-zinc-400">Checked: {new Date().toLocaleTimeString()}</span>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};
