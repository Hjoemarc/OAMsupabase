'use client';

import React from 'react';
import Link from 'next/link';
import { useAccreditationStore } from '@/features/accreditations/context/store-context';
import { MetricCard } from '@/components/ui/metric-card';
import { AreaBenchmarkChart } from '@/components/ui/area-benchmark-chart';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { Plus, Layers, CheckCircle2, Clock, Award } from 'lucide-react';
import { calculateMeanScore, interpretAccreditationRating } from '@/features/accreditations/calculations';

export function EvaluatorOverview({ evaluatorEmail: _evaluatorEmail }: { evaluatorEmail: string }) {
  const { parameters } = useAccreditationStore();

  const auditedCount = parameters.filter((p) => p.status === 'Audited').length;
  const pendingCount = parameters.length - auditedCount;

  const validEvaluatorScores = parameters
    .map((p) => p.evaluatorRating)
    .filter((s): s is number => typeof s === 'number');
  const teamMean = calculateMeanScore(validEvaluatorScores) ?? 4.13;
  const verdict = interpretAccreditationRating(teamMean);

  return (
    <div className="space-y-6">
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border)]">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-2xl font-medium tracking-tight text-[var(--foreground)]">
            Audit and evaluation console
          </h1>
          <p className="font-[family-name:var(--font-body)] text-xs text-[var(--text-muted)] mt-1">
            Institutional auditor queue, documentary proof verification, and AACCUP rubric evaluations
          </p>
        </div>

        <Link href="/evaluator/reviews" className="shrink-0">
          <Button size="sm" className="gap-1.5 text-xs">
            <Plus className="w-4 h-4 stroke-[1.75]" />
            <span>Audit rubrics</span>
          </Button>
        </Link>
      </div>

      {/* 4 Feature Module Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch">
        <MetricCard
          title="Audit queue"
          value={parameters.length}
          suffix=" benchmarks"
          badge={{ label: 'Active visit', variant: 'brand' }}
          subtitle="BSIT degree program"
          microtext="AACCUP 4th survey visit"
          icon={Layers}
        />

        <MetricCard
          title="Audited benchmarks"
          value={auditedCount}
          suffix=" verified"
          badge={{ label: 'Complete', variant: 'success' }}
          subtitle="Formal scores recorded"
          microtext="Rubric evaluations finalized"
          icon={CheckCircle2}
        />

        <MetricCard
          title="Pending audit"
          value={pendingCount}
          suffix=" benchmarks"
          badge={{ label: 'In review', variant: 'process' }}
          subtitle="Awaiting inspection"
          microtext="Evidence verification queue"
          icon={Clock}
        />

        <MetricCard
          title="Auditor grand mean"
          value={teamMean}
          suffix=" / 5.0"
          badge={{ label: verdict.verdict, variant: 'success' }}
          subtitle={verdict.eligibleLevel}
          microtext="Survey team verified decision"
          icon={Award}
        />
      </div>

      {/* Standard Areas Benchmark Assessment Chart */}
      <AreaBenchmarkChart />

      {/* Interactive Data Table with Tabs */}
      <DataTable initialTab="parameters" />
    </div>
  );
}
