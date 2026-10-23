'use client';

import React, { useState } from 'react';
import SegmentedControl from '@/components/arc/segmented-control/segmented-control';

type TimeRange = '3months' | '30days' | '7days';

const CHART_DATA: Record<
  TimeRange,
  { labels: string[]; pathD: string; areaD: string }
> = {
  '3months': {
    labels: ['Jun 24', 'Jun 25', 'Jun 26', 'Jun 27', 'Jun 28', 'Jun 29', 'Jun 30'],
    pathD:
      'M 0,110 C 60,110 80,30 150,30 C 220,30 240,120 320,120 C 400,120 420,30 500,30 C 580,30 620,130 700,130 C 780,130 820,35 900,35 C 960,35 980,90 1000,90',
    areaD:
      'M 0,110 C 60,110 80,30 150,30 C 220,30 240,120 320,120 C 400,120 420,30 500,30 C 580,30 620,130 700,130 C 780,130 820,35 900,35 C 960,35 980,90 1000,90 L 1000,180 L 0,180 Z',
  },
  '30days': {
    labels: ['Oct 01', 'Oct 06', 'Oct 11', 'Oct 16', 'Oct 21', 'Oct 26', 'Oct 31'],
    pathD:
      'M 0,130 C 80,130 120,45 200,45 C 280,45 320,125 400,125 C 480,125 540,40 650,40 C 740,40 800,120 900,120 C 950,120 980,80 1000,80',
    areaD:
      'M 0,130 C 80,130 120,45 200,45 C 280,45 320,125 400,125 C 480,125 540,40 650,40 C 740,40 800,120 900,120 C 950,120 980,80 1000,80 L 1000,180 L 0,180 Z',
  },
  '7days': {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    pathD:
      'M 0,120 C 80,120 120,50 250,50 C 350,50 400,130 550,130 C 680,130 750,45 880,45 C 940,45 980,75 1000,75',
    areaD:
      'M 0,120 C 80,120 120,50 250,50 C 350,50 400,130 550,130 C 680,130 750,45 880,45 C 940,45 980,75 1000,75 L 1000,180 L 0,180 Z',
  },
};

export function AnalyticsWaveChart({
  title = 'Total compliance velocity',
  subtitle = 'Total for the selected range',
}: {
  title?: string;
  subtitle?: string;
}) {
  const [range, setRange] = useState<TimeRange>('3months');
  const current = CHART_DATA[range];

  const rangeSegments = [
    { value: '3months', label: 'Last 3 months' },
    { value: '30days', label: 'Last 30 days' },
    { value: '7days', label: 'Last 7 days' },
  ];

  return (
    <div className="rounded-[var(--radius-surface)] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow-resting)]">
      {/* Header with Title and Segmented Range Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div>
          <h3 className="font-[family-name:var(--font-display)] text-base font-medium text-[var(--foreground)] tracking-tight">
            {title}
          </h3>
          <p className="font-[family-name:var(--font-body)] text-xs text-[var(--text-muted)] mt-1">
            {subtitle}
          </p>
        </div>

        {/* Range Segmented Controls */}
        <div className="shrink-0">
          <SegmentedControl
            options={rangeSegments}
            value={range}
            onValueChange={(val) => setRange(val as TimeRange)}
          />
        </div>
      </div>

      {/* SVG Wave Curve with Brand Accent */}
      <div className="w-full h-44 relative">
        <svg
          viewBox="0 0 1000 180"
          className="w-full h-full overflow-visible"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="waveArcGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#7B1113" stopOpacity="0.16" />
              <stop offset="60%" stopColor="#7B1113" stopOpacity="0.04" />
              <stop offset="100%" stopColor="#7B1113" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Area Fill */}
          <path d={current.areaD} fill="url(#waveArcGradient)" />

          {/* Top Line Stroke */}
          <path
            d={current.pathD}
            fill="none"
            stroke="#7B1113"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Bottom Date Labels */}
      <div className="flex justify-between items-center text-xs text-[var(--text-muted)] mt-2 px-1 pt-2 border-t border-[var(--border-subtle)]">
        {current.labels.map((lbl, idx) => (
          <span key={idx} className="font-mono text-[11px] tabular-nums">
            {lbl}
          </span>
        ))}
      </div>
    </div>
  );
}
