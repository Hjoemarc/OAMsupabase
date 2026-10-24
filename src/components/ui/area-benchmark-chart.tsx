'use client';

import React, { useState } from 'react';
import { useAccreditationStore } from '@/features/accreditations/context/store-context';
import SegmentedControl from '@/components/arc/segmented-control/segmented-control';
import { Badge } from '@/components/ui/badge';
import { Clock } from 'lucide-react';

type ViewMode = 'both' | 'auditor' | 'self';

const AREA_SHORT_TITLES: Record<number, string> = {
  1: 'VMGO',
  2: 'Faculty',
  3: 'Curriculum',
  4: 'Student Services',
  5: 'Research',
  6: 'Extension',
  7: 'Library',
  8: 'Physical Plant',
  9: 'Laboratories',
  10: 'Administration',
};

const AREA_FULL_TITLES: Record<number, string> = {
  1: 'Vision, Mission, Goals & Objectives',
  2: 'Faculty Credentials & Development',
  3: 'Curriculum & Instruction',
  4: 'Support to Students',
  5: 'Research & Development',
  6: 'Extension & Community Involvement',
  7: 'Library Resources',
  8: 'Physical Plant & Facilities',
  9: 'Specialized Laboratories',
  10: 'Administration & Financial Management',
};

export function AreaBenchmarkChart() {
  const { areas, getAreaSummaryMetric } = useAccreditationStore();
  const [viewMode, setViewMode] = useState<ViewMode>('both');

  // Compute metrics for all 10 areas
  const areaSummaries = areas.slice(0, 10).map((area) => {
    const summary = getAreaSummaryMetric(area);
    return {
      areaNumber: area.areaNumber,
      shortTitle: AREA_SHORT_TITLES[area.areaNumber] || `Area ${area.areaNumber}`,
      fullTitle: AREA_FULL_TITLES[area.areaNumber] || area.title,
      selfScore: summary.selfMeanScore ?? 4.0,
      auditorScore: summary.evaluatorMeanScore ?? 0,
      isAudited: summary.evaluatorMeanScore !== null,
    };
  });

  const viewSegments = [
    { value: 'both', label: 'Comparative view' },
    { value: 'auditor', label: 'Auditor scores' },
    { value: 'self', label: 'Self-survey ratings' },
  ];

  // Y-axis grid increments (0 to 5.0)
  const yAxisTicks = [5.0, 4.0, 3.0, 2.0, 1.0, 0.0];

  return (
    <div data-testid="area-benchmark-chart" className="rounded-[var(--radius-surface)] border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6 shadow-[var(--shadow-resting)]">
      {/* Header with Title and Mode Filter Buttons */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-[family-name:var(--font-display)] text-base font-semibold text-[var(--foreground)] tracking-tight">
              AACCUP 10 standard areas benchmark assessment
            </h3>
            <Badge tone="info" size="sm">
              Level III target: 4.00
            </Badge>
          </div>
          <p className="font-[family-name:var(--font-body)] text-xs text-[var(--text-muted)] mt-1">
            Comparative institutional rating: Faculty self-survey baseline vs. Accreditor verified audit
          </p>
        </div>

        {/* View Mode Segmented Controls */}
        <div className="overflow-x-auto max-w-full pb-1 shrink-0">
          <SegmentedControl
            options={viewSegments}
            value={viewMode}
            onValueChange={(val) => setViewMode(val as ViewMode)}
          />
        </div>
      </div>

      {/* 10 Standard Areas Benchmark Chart Area */}
      <div className="space-y-4">
        <div className="overflow-x-auto -mx-2 px-2 sm:mx-0 sm:px-0">
          <div className="min-w-[640px]">
            {/* Chart Grid with Y-Axis, Plot Area, and Reference Margins */}
            <div className="flex gap-2 relative">
              {/* Left Y-Axis Scale (0.0 to 5.0) */}
              <div className="w-8 flex flex-col justify-between items-end pr-1 text-[11px] font-mono font-medium text-[var(--text-muted)] h-56 select-none shrink-0 py-0.5">
                {yAxisTicks.map((tick) => (
                  <span key={tick} className="leading-none">
                    {tick.toFixed(1)}
                  </span>
                ))}
              </div>

              {/* Central Plot Area */}
              <div className="flex-1 relative h-56">
                {/* Horizontal Gridlines */}
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none z-0">
                  {yAxisTicks.map((tick) => (
                    <div
                      key={tick}
                      className={`w-full border-b ${
                        tick === 4.0
                          ? 'border-dashed border-amber-500/60'
                          : tick === 3.0
                          ? 'border-dashed border-[var(--border-strong)]'
                          : tick === 0.0
                          ? 'border-[var(--border)]'
                          : 'border-[var(--border-subtle)]/40'
                      }`}
                    />
                  ))}
                </div>

                {/* 10 Column Bars Container */}
                <div className="absolute inset-0 grid grid-cols-10 gap-2 sm:gap-2.5 items-end z-10 px-1">
                  {areaSummaries.map((item) => {
                    const selfHeight = Math.min(100, Math.max(8, (item.selfScore / 5.0) * 100));
                    const auditHeight = item.isAudited
                      ? Math.min(100, Math.max(8, (item.auditorScore / 5.0) * 100))
                      : 0;

                    return (
                      <div
                        key={item.areaNumber}
                        data-area={item.areaNumber}
                        className="flex flex-col items-center h-full justify-end group relative"
                      >
                        {/* Hover Inspection Card / Tooltip */}
                        <div
                          className={`absolute -top-24 opacity-0 group-hover:opacity-100 transition-all duration-150 pointer-events-none z-40 bg-[var(--surface-raised)] border border-[var(--border)] shadow-[var(--shadow-floating)] rounded-[var(--radius-control)] p-2.5 text-left w-52 ${
                            item.areaNumber >= 8
                              ? 'right-0'
                              : item.areaNumber <= 3
                              ? 'left-0'
                              : 'left-1/2 -translate-x-1/2'
                          }`}
                        >
                          <div className="flex items-center justify-between border-b border-[var(--border)] pb-1 mb-1.5">
                            <span className="font-semibold text-xs text-[var(--foreground)]">
                              Area {item.areaNumber}
                            </span>
                            <span
                              className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${
                                item.isAudited
                                  ? item.auditorScore >= 4.0
                                    ? 'bg-emerald-500/10 text-emerald-700'
                                    : 'bg-amber-500/10 text-amber-700'
                                  : 'bg-slate-500/10 text-slate-600'
                              }`}
                            >
                              {item.isAudited
                                ? item.auditorScore >= 4.0
                                  ? 'Level III'
                                  : 'Deficient'
                                : 'Pending'}
                            </span>
                          </div>
                          <div className="text-[11px] text-[var(--text-muted)] line-clamp-1 mb-1.5 font-normal">
                            {item.fullTitle}
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-[11px]">
                            <div>
                              <span className="text-[var(--text-muted)] block text-[10px]">Self-Survey</span>
                              <span className="font-semibold text-[var(--foreground)]">
                                {item.selfScore.toFixed(2)}
                              </span>
                            </div>
                            <div>
                              <span className="text-[var(--text-muted)] block text-[10px]">Auditor Score</span>
                              <span className="font-semibold text-[var(--foreground)]">
                                {item.isAudited ? item.auditorScore.toFixed(2) : 'Awaiting Audit'}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Subtle Column Track Slot */}
                        <div className="w-full max-w-[42px] h-full rounded-md bg-[var(--surface-muted)]/30 hover:bg-[var(--surface-muted)]/70 transition-colors flex items-end justify-center gap-1 sm:gap-1.5 px-1 pb-0.5">
                          {/* Faculty Self-Survey Bar */}
                          {(viewMode === 'both' || viewMode === 'self') && (
                            <div
                              className="w-3 sm:w-3.5 rounded-t-[3px] bg-slate-400 dark:bg-slate-500 hover:bg-slate-500 transition-all duration-300"
                              style={{ height: `${selfHeight}%` }}
                              title={`Self-Survey: ${item.selfScore.toFixed(2)}`}
                            />
                          )}

                          {/* Auditor Verified Score Bar */}
                          {(viewMode === 'both' || viewMode === 'auditor') && (
                            item.isAudited ? (
                              <div
                                className={`w-3 sm:w-3.5 rounded-t-[3px] transition-all duration-300 ${
                                  item.auditorScore >= 4.0
                                    ? 'bg-[var(--accent)] hover:opacity-90'
                                    : 'bg-amber-600 hover:bg-amber-700'
                                }`}
                                style={{ height: `${auditHeight}%` }}
                                title={`Auditor score: ${item.auditorScore.toFixed(2)}`}
                              />
                            ) : (
                              /* Clean Awaiting Review Placeholder Slot */
                              <div
                                className="w-3 sm:w-3.5 h-full rounded-t-[3px] border border-dashed border-[var(--border-strong)] bg-transparent flex flex-col items-center justify-end pb-1 opacity-40 group-hover:opacity-80 transition-opacity"
                                title="Pending external auditor evaluation"
                              >
                                <Clock className="w-2.5 h-2.5 text-[var(--text-muted)]" />
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Margin Benchmark Badges (Aligned with gridlines, zero bar overlap) */}
              <div className="w-28 sm:w-32 relative h-56 shrink-0 select-none pl-1">
                {/* Level III Benchmark (4.0 = 20% from top) */}
                <div className="absolute top-[20%] -translate-y-1/2 left-1">
                  <span className="text-[10px] font-semibold text-amber-700 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-300/60 whitespace-nowrap block">
                    Level III (4.00)
                  </span>
                </div>

                {/* Passing Benchmark (3.0 = 40% from top) */}
                <div className="absolute top-[40%] -translate-y-1/2 left-1">
                  <span className="text-[10px] font-medium text-[var(--text-muted)] bg-[var(--surface-muted)] px-2 py-0.5 rounded border border-[var(--border)] whitespace-nowrap block">
                    Passing (3.00)
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom X-Axis Column Headers (Area 1 to Area 10) */}
            <div className="flex gap-2 pt-3 pl-8 pr-28 sm:pr-32 border-t border-[var(--border)]">
              <div className="w-full grid grid-cols-10 gap-2 sm:gap-2.5 text-center">
                {areaSummaries.map((item) => (
                  <div key={item.areaNumber} className="flex flex-col items-center min-w-0">
                    <span className="font-semibold text-xs text-[var(--foreground)] block">
                      Area {item.areaNumber}
                    </span>
                    <span
                      className="text-[10px] sm:text-[11px] text-[var(--text-secondary)] font-medium leading-tight truncate max-w-full block mt-0.5"
                      title={item.fullTitle}
                    >
                      {item.shortTitle}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Chart Legend */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-[var(--text-secondary)] pt-4 border-t border-[var(--border-subtle)] gap-3">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-xs bg-slate-400 dark:bg-slate-500 inline-block shadow-2xs" />
              <span className="text-xs font-medium">Faculty self-survey (baseline)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-xs bg-[var(--accent)] inline-block shadow-2xs" />
              <span className="text-xs font-medium">Auditor verified (meets Level III &ge; 4.00)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-xs border border-dashed border-[var(--border-strong)] bg-transparent inline-flex items-center justify-center">
                <Clock className="w-2 h-2 text-[var(--text-muted)]" />
              </span>
              <span className="text-xs font-medium text-[var(--text-muted)]">Awaiting audit</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-[var(--text-muted)] font-mono">
              Scale: 1.00 (poor) &rarr; 5.00 (excellent)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
