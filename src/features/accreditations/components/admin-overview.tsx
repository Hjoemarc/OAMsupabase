'use client';

import React from 'react';
import Link from 'next/link';
import { useAccreditationStore } from '../context/store-context';
import { MetricCard } from '@/components/ui/metric-card';
import { AreaBenchmarkChart } from '@/components/ui/area-benchmark-chart';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { Plus, Users, ShieldCheck, Layers, Award } from 'lucide-react';
import { interpretAccreditationRating } from '../calculations';

interface AdminOverviewProps {
  totalUsers: number;
  pendingCount: number;
  adminEmail: string;
}

export function AdminOverview({
  totalUsers,
  pendingCount,
  adminEmail: _adminEmail,
}: AdminOverviewProps) {
  const { cycles, parameters } = useAccreditationStore();

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
            Executive QA administration
          </h1>
          <p className="font-[family-name:var(--font-body)] text-xs text-[var(--text-muted)] mt-1">
            Institutional quality assurance governance, personnel RBAC, and accreditation surveys
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Link href="/admin/users">
            <Button variant="secondary" size="sm" className="gap-1.5 text-xs">
              <Users className="w-3.5 h-3.5 stroke-[1.75]" />
              <span>Personnel directory</span>
            </Button>
          </Link>

          <Link href="/admin/cycles">
            <Button size="sm" className="gap-1.5 text-xs">
              <Plus className="w-4 h-4 stroke-[1.75]" />
              <span>New cycle</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* 4 Feature Module Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch">
        <MetricCard
          title="Personnel directory"
          value={totalUsers}
          suffix=" active"
          badge={{ label: 'RBAC', variant: 'outline' }}
          subtitle="Super admins and leads"
          microtext="Institutional account provisioning"
          icon={Users}
          actionLabel="Directory"
          href="/admin/users"
        />

        <MetricCard
          title="Pending approvals"
          value={pendingCount}
          badge={{
            label: pendingCount === 0 ? 'Clear' : 'Action required',
            variant: pendingCount === 0 ? 'success' : 'process',
          }}
          subtitle={pendingCount === 0 ? 'All accounts verified' : 'Pending role review'}
          microtext="Access provisioning queue"
          icon={ShieldCheck}
          actionLabel="Review"
          href="/admin/users"
        />

        <MetricCard
          title="Accreditation visits"
          value={cycles.length}
          suffix=" active"
          badge={{ label: 'AACCUP / CHED', variant: 'brand' }}
          subtitle="Institutional surveys"
          microtext="CICS, CET and CTE colleges"
          icon={Layers}
          actionLabel="Manage"
          href="/coordinator"
        />

        <MetricCard
          title="QA grand mean"
          value={grandMean}
          suffix=" / 5.0"
          badge={{ label: verdict.verdict, variant: 'success' }}
          subtitle={verdict.eligibleLevel}
          microtext="Institutional quality benchmark"
          icon={Award}
          actionLabel="Scores"
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
