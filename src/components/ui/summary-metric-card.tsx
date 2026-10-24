import React, { type ComponentType, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

export type SummaryCardTone =
  | 'default'
  | 'accent'
  | 'emerald'
  | 'amber'
  | 'blue'
  | 'purple'
  | 'rose';

export interface SummaryMetricCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  icon?: ComponentType<{ className?: string; strokeWidth?: number }> | ReactNode;
  tone?: SummaryCardTone;
  badge?: {
    label: string;
    tone?: 'neutral' | 'info' | 'success' | 'warning' | 'danger';
  };
  className?: string;
}

const VALUE_TONE_STYLES: Record<SummaryCardTone, string> = {
  default: 'text-[var(--foreground)]',
  accent: 'text-[var(--foreground)]',
  blue: 'text-[var(--foreground)]',
  purple: 'text-[var(--foreground)]',
  emerald: 'text-emerald-700 dark:text-emerald-400',
  amber: 'text-amber-700 dark:text-amber-400',
  rose: 'text-rose-700 dark:text-rose-400',
};

export function SummaryMetricCard({
  label,
  value,
  subtext,
  icon: Icon,
  tone = 'default',
  badge,
  className,
}: SummaryMetricCardProps) {
  const isComponent =
    typeof Icon === 'function' ||
    (typeof Icon === 'object' && Icon !== null && 'render' in Icon);

  return (
    <div
      className={cn(
        'group flex flex-col justify-between rounded-[var(--radius-panel)] border border-[var(--border)] bg-[var(--surface)] p-4 sm:p-5 transition-colors duration-150 hover:border-[var(--border-strong)]',
        className
      )}
    >
      {/* Top Row: Quiet Label + Small Monochrome Indicator/Badge */}
      <div className="flex items-center justify-between gap-2">
        <span
          className="text-xs font-medium text-[var(--text-secondary)] line-clamp-1"
          title={label}
        >
          {label}
        </span>

        {badge ? (
          <span
            className={cn(
              'inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-medium tracking-normal',
              badge.tone === 'danger' && 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-500/20',
              badge.tone === 'warning' && 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20',
              badge.tone === 'success' && 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20',
              (!badge.tone || badge.tone === 'neutral' || badge.tone === 'info') &&
                'bg-[var(--surface-muted)] text-[var(--text-secondary)] border border-[var(--border)]'
            )}
          >
            {badge.label}
          </span>
        ) : Icon ? (
          <span className="text-[var(--text-muted)] group-hover:text-[var(--text-secondary)] transition-colors shrink-0">
            {isComponent ? (
              // @ts-expect-error Valid component invocation
              <Icon className="w-4 h-4 stroke-[1.75]" />
            ) : (
              Icon
            )}
          </span>
        ) : null}
      </div>

      {/* Metric Value & Context Subtext */}
      <div className="mt-3.5 space-y-1">
        <div
          className={cn(
            'font-[family-name:var(--font-display)] text-2xl sm:text-[26px] font-semibold tabular-nums tracking-tight',
            VALUE_TONE_STYLES[tone]
          )}
        >
          {value}
        </div>
        {subtext && (
          <p
            className="text-xs text-[var(--text-muted)] line-clamp-1 font-normal leading-relaxed"
            title={subtext}
          >
            {subtext}
          </p>
        )}
      </div>
    </div>
  );
}
