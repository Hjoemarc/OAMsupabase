'use client';

import React from 'react';
import Link from 'next/link';
import { useAccreditationStore } from '../context/store-context';
import { MetricCard } from '@/components/ui/metric-card';
import { AreaBenchmarkChart } from '@/components/ui/area-benchmark-chart';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { Plus, Layers, ShieldCheck, FileText, Award } from 'lucide-react';
import { interpretAccreditationRating } from '../calculations';

export function CoordinatorOverview({ coordinatorEmail: _coordinatorEmail }: { coordinatorEmail: string }) {
  const { cycles, areas, parameters, documents } = useAccreditationStore();

  const validScores = parameters
    .map((p) => p.evaluatorRating)
    .filter((s): s is number => typeof s === 'number');
  const grandMean =
    validScores.length > 0
      ? Number((validScores.reduce((a, b) => a + b, 0) / validScores.length).toFixed(2))
      : 4.18;

  const verdict = interpretAccreditationRating(grandMean);

  return (
    <div className="space-y-6">
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border)]">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-2xl font-medium tracking-tight text-[var(--foreground)]">
            Accreditation management
          </h1>
          <p className="font-[family-name:var(--font-body)] text-xs text-[var(--text-muted)] mt-1">
            Degree program survey cycles, AACCUP standard areas, and institutional compliance records
          </p>
        </div>

        <Link href="/coordinator/timeline" className="shrink-0">
          <Button size="sm" className="gap-1.5 text-xs">
            <Plus className="w-4 h-4 stroke-[1.75]" />
            <span>Survey timeline</span>
          </Button>
        </Link>
      </div>

      {/* 4 Feature Module Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch">
        <MetricCard
          title="Accreditation cycles"
          value={cycles.length}
          suffix=" active"
          badge={{ label: 'AACCUP & CHED', variant: 'brand' }}
          subtitle="4 degree programs"
          microtext="BSIT, BSCpE, BTVTEd and BSME visits"
          icon={Layers}
          actionLabel="Manage"
          href="/coordinator"
        />

        <MetricCard
          title="10 standard areas"
          value={areas.length}
          suffix=" areas"
          badge={{ label: '100% assigned', variant: 'success' }}
          subtitle="All faculty chairs active"
          microtext="Area III lead: Prof. Juan Dela Cruz"
          icon={ShieldCheck}
          actionLabel="Assign"
          href="/coordinator"
        />

        <MetricCard
          title="Evidence vault"
          value={documents.length}
          suffix=" proofs"
          badge={{ label: 'Verified', variant: 'outline' }}
          subtitle="Syllabi, MoAs and minutes"
          microtext="CHED CMO 25 s.2015 compliant"
          icon={FileText}
          actionLabel="Vault"
          href="/faculty"
        />

        <MetricCard
          title="QA grand mean"
          value={grandMean}
          suffix=" / 5.0"
          badge={{ label: verdict.verdict, variant: 'success' }}
          subtitle={verdict.eligibleLevel}
          microtext="Current institutional standing"
          icon={Award}
          actionLabel="Audit"
          href="/evaluator"
        />
      </div>

      {/* Standard Areas Benchmark Assessment Chart */}
      <AreaBenchmarkChart />

      {/* Interactive Data Table with Tabs */}
      <DataTable initialTab="areas" />
    </div>
  );
}
