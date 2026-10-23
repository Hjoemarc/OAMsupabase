'use client';

import React, { useState } from 'react';
import { useAccreditationStore } from '@/features/accreditations/context/store-context';
import SegmentedControl from '@/components/arc/segmented-control/segmented-control';
import { Badge } from '@/components/ui/badge';

type ViewMode = 'both' | 'auditor' | 'self';

export function AreaBenchmarkChart() {
  const { areas, getAreaSummaryMetric } = useAccreditationStore();
  const [viewMode, setViewMode] = useState<ViewMode>('both');

  // Compute metrics for all 10 areas
  const areaSummaries = areas.slice(0, 10).map((area) => {
    const summary = getAreaSummaryMetric(area);
    return {
      areaNumber: area.areaNumber,
      title: area.title.split(':')[1]?.trim() || `Area ${area.areaNumber}`,
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

  return (
    <div className="rounded-[var(--radius-surface)] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow-resting)]">
      {/* Header with Title and Mode Filter Buttons */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-5">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-[family-name:var(--font-display)] text-base font-medium text-[var(--foreground)] tracking-tight">
              AACCUP 10 standard areas benchmark assessment
            </h3>
            <Badge tone="info" size="sm">
              Level III target: 4.00
            </Badge>
          </div>
          <p className="font-[family-name:var(--font-body)] text-xs text-[var(--text-muted)] mt-1">
            Comparative institutional rating: Faculty self-survey vs. Accreditor verified audit across standard areas
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

      {/* 10 Standard Areas Benchmark Bar Chart */}
      <div className="space-y-4 pt-2">
        <div className="overflow-x-auto -mx-2 px-2 sm:mx-0 sm:px-0">
          <div className="min-w-[540px]">
            <div className="grid grid-cols-10 gap-2 h-44 items-end pb-2 pt-6 relative border-b border-[var(--border)]">
              {/* Target Level III Benchmark Reference Line (4.0 / 5.0 = 80% height) */}
              <div className="absolute left-0 right-0 top-[20%] border-t border-dashed border-amber-500/70 z-0">
                <span className="absolute right-0 -top-4 text-[10px] font-medium text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                  Level III benchmark (4.00)
                </span>
              </div>

              {/* Minimum Passing Benchmark Reference Line (3.0 / 5.0 = 60% from bottom, top 40%) */}
              <div className="absolute left-0 right-0 top-[40%] border-t border-dashed border-[var(--border-strong)] z-0">
                <span className="absolute left-0 -top-4 text-[10px] font-medium text-[var(--text-muted)] bg-[var(--surface-muted)] px-1.5 py-0.5 rounded border border-[var(--border)]">
                  Passing (3.00)
                </span>
              </div>

              {areaSummaries.map((item) => {
                const selfHeight = Math.min(100, Math.max(10, (item.selfScore / 5.0) * 100));
                const auditHeight = item.isAudited
                  ? Math.min(100, Math.max(10, (item.auditorScore / 5.0) * 100))
                  : 0;

                return (
                  <div key={item.areaNumber} className="flex flex-col items-center h-full justify-end z-10 group relative">
                    {/* Tooltip on Hover */}
                    <div
                      className={`absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-[var(--foreground)] text-[var(--background)] text-[10px] py-1 px-2 rounded-[var(--radius-control)] shadow-[var(--shadow-floating)] pointer-events-none whitespace-nowrap z-20 ${
                        item.areaNumber >= 8
                          ? 'right-0'
                          : item.areaNumber <= 2
                          ? 'left-0'
                          : 'left-1/2 -translate-x-1/2'
                      }`}
                    >
                      <span className="font-medium">{item.title}</span>: Self {item.selfScore.toFixed(2)} | Auditor{' '}
                      {item.isAudited ? item.auditorScore.toFixed(2) : 'Pending'}
                    </div>

                    <div className="flex items-end gap-1 w-full justify-center max-w-[28px] h-full">
                      {/* Self-Survey Bar */}
                      {(viewMode === 'both' || viewMode === 'self') && (
                        <div
                          className="w-2.5 rounded-t bg-amber-400 hover:bg-amber-500 transition-colors"
                          style={{ height: `${selfHeight}%` }}
                          title={`Self-Survey: ${item.selfScore.toFixed(2)}`}
                        />
                      )}

                      {/* Auditor Score Bar */}
                      {(viewMode === 'both' || viewMode === 'auditor') && (
                        <div
                          className={`w-2.5 rounded-t transition-colors ${
                            item.isAudited
                              ? item.auditorScore >= 4.0
                                ? 'bg-[var(--accent)]'
                                : 'bg-amber-600'
                              : 'bg-[var(--surface-muted)] border-t border-dashed border-[var(--border-strong)]'
                          }`}
                          style={{ height: `${auditHeight || 10}%` }}
                          title={item.isAudited ? `Auditor score: ${item.auditorScore.toFixed(2)}` : 'Pending audit'}
                        />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Labels (Area I to Area X) */}
            <div className="grid grid-cols-10 gap-2 text-center pt-2">
              {areaSummaries.map((item) => (
                <div key={item.areaNumber} className="truncate">
                  <span className="font-medium text-xs text-[var(--foreground)] block">
                    Area {item.areaNumber}
                  </span>
                  <span className="text-[10px] text-[var(--text-muted)] truncate block" title={item.title}>
                    {item.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Chart Legend */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-[var(--text-secondary)] pt-3 border-t border-[var(--border-subtle)] gap-2">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-xs bg-amber-400 inline-block" />
              <span>Faculty self-survey score</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-xs bg-[var(--accent)] inline-block" />
              <span>Auditor verified score (meets Level III)</span>
            </div>
          </div>
          <span className="text-[11px] font-mono text-[var(--text-muted)]">
            Scale: 1.0 (poor) to 5.0 (excellent)
          </span>
        </div>
      </div>
    </div>
  );
}
