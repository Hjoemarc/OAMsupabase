'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAccreditationStore } from '@/features/accreditations/context/store-context';
import { MetricCard } from '@/components/ui/metric-card';
import { AreaBenchmarkChart } from '@/components/ui/area-benchmark-chart';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { Plus, ShieldCheck, Layers, FileText, Award } from 'lucide-react';
import { calculateMeanScore } from '@/features/accreditations/calculations';

export function FacultyOverview({ facultyEmail: _facultyEmail }: { facultyEmail: string }) {
  const { areas, parameters, documents } = useAccreditationStore();

  const [selectedAreaId, setSelectedAreaId] = useState<string>('area-3');

  const currentArea = areas.find((a) => a.id === selectedAreaId) || areas[2] || areas[0];
  const areaParameters = parameters.filter((p) => p.areaId === currentArea?.id);
  const areaDocs = documents.filter((d) =>
    areaParameters.some((p) => p.id === d.parameterId)
  );

  const selfRatings = areaParameters
    .map((p) => p.selfSurveyRating)
    .filter((r): r is number => typeof r === 'number');
  const selfMean = calculateMeanScore(selfRatings) ?? 4.22;

  return (
    <div className="space-y-6">
      {/* Top Header Row */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-[var(--border)]">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-2xl font-medium tracking-tight text-[var(--foreground)]">
            Evidence vault and self-survey
          </h1>
          <p className="font-[family-name:var(--font-body)] text-xs text-[var(--text-muted)] mt-1">
            Faculty evidence submission, course syllabus repository, and parameter self-survey ratings
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start lg:self-auto shrink-0 max-w-full">
          {/* Assigned Area Selector */}
          <select
            value={selectedAreaId}
            onChange={(e) => setSelectedAreaId(e.target.value)}
            className="text-xs font-medium px-3 py-1.5 rounded-[var(--radius-control)] border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] focus:border-[var(--accent)] focus:outline-none max-w-[200px] sm:max-w-xs truncate"
          >
            {areas.map((a) => (
              <option key={a.id} value={a.id}>
                {a.title}
              </option>
            ))}
          </select>

          <Link href="/faculty/documents" className="shrink-0">
            <Button size="sm" className="gap-1.5 text-xs">
              <Plus className="w-4 h-4 stroke-[1.75]" />
              <span>Attach evidence</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* 4 Feature Module Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch">
        <MetricCard
          title="Assigned area"
          value={currentArea?.title.split(':')[0] || 'Area III'}
          badge={{ label: 'Active lead', variant: 'brand' }}
          subtitle={currentArea?.title.split(':')[1]?.trim() || 'Curriculum'}
          microtext={`Weight: ${currentArea?.weight || 15}% institutional credit`}
          icon={ShieldCheck}
        />

        <MetricCard
          title="Criteria benchmarks"
          value={areaParameters.length}
          suffix=" parameters"
          badge={{ label: 'CMO aligned', variant: 'outline' }}
          subtitle="OBE curriculum mapped"
          microtext="Syllabi, learning outcomes and grading"
          icon={Layers}
        />

        <MetricCard
          title="Attached evidence"
          value={areaDocs.length}
          suffix=" proofs"
          badge={{ label: 'Verified', variant: 'success' }}
          subtitle="Documentary vault"
          microtext="BOR resolution, MoAs and minutes"
          icon={FileText}
          actionLabel="Attach"
          href="/faculty"
        />

        <MetricCard
          title="Self-survey rating"
          value={selfMean}
          suffix=" / 5.0"
          badge={{ label: 'Verified', variant: 'brand' }}
          subtitle="Area faculty rating"
          microtext="Benchmark for evaluators"
          icon={Award}
        />
      </div>

      {/* Standard Areas Benchmark Assessment Chart */}
      <AreaBenchmarkChart />

      {/* Interactive Data Table with Tabs */}
      <DataTable initialTab="evidence" />
    </div>
  );
}
