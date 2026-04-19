import React from 'react';
import { Card, CardHeader, CardTitle, CardBody } from '@/shared/ui/Card';
import { Badge } from '@/shared/ui/Badge';
import type { StageProgress, DeliverableItem, ProgramItem } from '@/shared/types/pms';

interface StageProgressProps {
  stages?: StageProgress[];
  deliverables?: DeliverableItem[];
  programs?: ProgramItem[];
}

export const StageProgressPanel: React.FC<StageProgressProps> = ({ 
  deliverables = [], 
  programs = [] 
}) => {
  // 연동 로직 시뮬레이션
  const calculateAnalysisProgress = () => {
    if (!deliverables || deliverables.length === 0) return 0;
    const analysisDocs = deliverables.filter(d => d.stage === 'ANALYSIS_DESIGN');
    if (analysisDocs.length === 0) return 0;
    
    const approved = analysisDocs.filter(d => d.status === 'ACCEPTED').length;
    return (approved / analysisDocs.length) * 100;
  };

  const calculateDevProgress = () => {
    if (!programs || programs.length === 0) return 0;
    const total = programs.reduce((acc, p) => acc + (p.progressPct || 0), 0);
    return total / programs.length;
  };

  const analysisProgress = calculateAnalysisProgress();
  const devProgress = calculateDevProgress();
  const approvedCount = deliverables?.filter(d => d.status === 'ACCEPTED').length || 0;

  return (
    <Card className="p-4 min-h-[300px]">
      <CardHeader className="flex justify-between items-center border-b pb-2 mb-4">
        <CardTitle>WBS 진척 현황 (Baseline 연동)</CardTitle>
        <Badge tone="yellow">SPI: 0.98 (On Schedule)</Badge>
      </CardHeader>
      <CardBody className="space-y-6">
        {/* 분석 단계 (산출물 연동) */}
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="font-semibold text-zinc-900">분석/설계 (산출물 기준)</span>
            <span className="font-mono text-blue-600 font-bold">{analysisProgress.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-zinc-100 h-2 rounded-full overflow-hidden border border-zinc-200">
            <div 
              className="bg-blue-500 h-full transition-all duration-700 ease-out" 
              style={{ width: `${analysisProgress}%` }}
            />
          </div>
          <p className="text-[10px] text-zinc-500 mt-1.5 flex items-center gap-1">
            <span className="w-1 h-1 rounded-full bg-zinc-400" />
            산출물 승인 건수 연동 ( {approvedCount} / {deliverables?.length || 0} 건 )
          </p>
        </div>

        {/* 개발 단계 (프로그램 연동) */}
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="font-semibold text-zinc-900">개발구현 (프로그램 목록 연동)</span>
            <span className="font-mono text-green-600 font-bold">{devProgress.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-zinc-100 h-2 rounded-full overflow-hidden border border-zinc-200">
            <div 
              className="bg-green-500 h-full transition-all duration-700 ease-out" 
              style={{ width: `${devProgress}%` }}
            />
          </div>
          <p className="text-[10px] text-zinc-500 mt-1.5 flex items-center gap-1">
            <span className="w-1 h-1 rounded-full bg-zinc-400" />
            프로그램별 고도화 진척률 가중 평균 반영 ( {programs?.length || 0} 개 프로그램 )
          </p>
        </div>

        {/* 테스트 단계 (추후 보완) */}
        <div className="opacity-60">
          <div className="flex justify-between text-sm mb-1 text-zinc-500">
            <span className="font-medium italic">단위/통합 테스트 (시나리오 연동 예정)</span>
            <span className="font-mono font-bold">0%</span>
          </div>
          <div className="w-full bg-zinc-50 h-1.5 rounded-full overflow-hidden border border-zinc-100">
            <div className="bg-zinc-300 h-full" style={{ width: '0%' }} />
          </div>
        </div>
      </CardBody>
    </Card>
  );
};
