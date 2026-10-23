'use client';

import React, { useState, type ComponentType } from 'react';
import Link from 'next/link';
import {
  ArrowDownCircle,
  ArrowUpCircle,
  MinusCircle,
  Info,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip } from '@/components/arc/tooltip/tooltip';
import { AnimatedCounter } from '@/components/arc/animated-counter/animated-counter';

type IconComponent = ComponentType<{
  className?: string;
  'aria-hidden'?: boolean | 'true' | 'false';
}>;

export type StatCardsVariant = 'plain' | 'footer';

/** Tint of the footer variant's gradient icon tile. */
export type StatTone =
  | 'maroon'
  | 'blue'
  | 'orange'
  | 'purple'
  | 'pink'
  | 'sky'
  | 'emerald';

export type Stat = {
  icon: IconComponent;
  label: string;
  value: string | number;
  suffix?: string;
  delta?: string;
  deltaColor?: 'lime' | 'rose' | 'neutral';
  tone?: StatTone;
  caption?: string;
  hint?: string;
  href?: string;
  actionLabel?: string;
};

/** Gradient stops for the footer variant's icon tile, keyed by tone. */
export const TILE_TONES: Record<StatTone, string> = {
  maroon: 'from-[#7B1113] to-[#580C0E]',
  blue: 'from-blue-500 to-blue-600',
  orange: 'from-amber-500 to-amber-600',
  purple: 'from-purple-500 to-purple-600',
  pink: 'from-pink-500 to-pink-600',
  sky: 'from-sky-400 to-sky-500',
  emerald: 'from-emerald-500 to-emerald-600',
};

const DELTA_STYLES: Record<
  'lime' | 'rose' | 'neutral',
  { icon: IconComponent; className: string; pill: string }
> = {
  lime: {
    icon: ArrowUpCircle,
    className: 'text-emerald-700',
    pill: 'bg-emerald-50 border border-emerald-200/80',
  },
  rose: {
    icon: ArrowDownCircle,
    className: 'text-rose-700',
    pill: 'bg-rose-50 border border-rose-200/80',
  },
  neutral: {
    icon: MinusCircle,
    className: 'text-[var(--text-secondary)]',
    pill: 'bg-[var(--surface-muted)] border border-[var(--border)]',
  },
};

/** Tinted pill with a direction glyph for the footer band readout */
export function DeltaPill({
  delta,
  deltaColor = 'neutral',
}: {
  delta: string;
  deltaColor?: 'lime' | 'rose' | 'neutral';
}) {
  const { icon: Icon, className, pill } = DELTA_STYLES[deltaColor];
  return (
    <span
      className={cn(
        'flex shrink-0 items-center gap-1 rounded-full py-0.5 pe-2 ps-1.5 text-xs font-medium tabular-nums',
        pill
      )}
    >
      <Icon className={cn('size-3.5 shrink-0 stroke-[2]', className)} aria-hidden />
      <span className={cn('whitespace-nowrap text-[11px] font-medium font-mono', className)}>
        {delta}
      </span>
    </span>
  );
}

/** Bare info glyph with a tooltip for hints */
export function StatHint({ label, hint }: { label: string; hint: string }) {
  return (
    <Tooltip content={hint}>
      <button
        type="button"
        aria-label={`About ${label}`}
        className="flex shrink-0 cursor-pointer items-center justify-center rounded-full text-[var(--text-muted)] outline-none transition-colors duration-150 hover:text-[var(--foreground)] focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
      >
        <Info className="size-4 stroke-[1.75]" aria-hidden />
      </button>
    </Tooltip>
  );
}

export function PlainStatCard({ stat }: { stat: Stat }) {
  const numericValue =
    typeof stat.value === 'number'
      ? stat.value
      : parseFloat(String(stat.value).replace(/[^0-9.-]/g, ''));
  const isPureNumber =
    !isNaN(numericValue) && String(numericValue) === String(stat.value).trim();
  const decimalCount =
    typeof stat.value === 'number'
      ? (String(stat.value).split('.')[1]?.length ?? 0)
      : (String(stat.value).trim().split('.')[1]?.length ?? 0);

  const card = (
    <section className="flex h-[132px] min-w-0 flex-col items-start justify-between rounded-2xl bg-[var(--surface-muted)] p-4 border border-[var(--border)] transition hover:border-[var(--border-strong)]">
      <span className="flex items-center rounded-md bg-[var(--surface)] border border-[var(--border)] p-1.5 text-[var(--foreground)]">
        <stat.icon className="size-5 shrink-0" aria-hidden />
      </span>
      <div className="flex w-full flex-col gap-0.5">
        <p className="w-full text-xs font-medium text-[var(--text-secondary)]">{stat.label}</p>
        <div className="flex w-full flex-wrap items-center justify-between gap-2">
          <div className="text-xl font-semibold whitespace-nowrap text-[var(--foreground)] tabular-nums font-[family-name:var(--font-display)]">
            {isPureNumber ? (
              <AnimatedCounter value={numericValue} decimals={decimalCount} suffix={stat.suffix} animateOnView />
            ) : (
              <span>
                {stat.value}
                {stat.suffix}
              </span>
            )}
          </div>
          {stat.delta && (
            <DeltaPill delta={stat.delta} deltaColor={stat.deltaColor ?? 'neutral'} />
          )}
        </div>
      </div>
    </section>
  );

  if (stat.href) {
    return (
      <Link href={stat.href} className="block focus:outline-none">
        {card}
      </Link>
    );
  }

  return card;
}

export function FooterStatCard({ stat }: { stat: Stat }) {
  const numericValue =
    typeof stat.value === 'number'
      ? stat.value
      : parseFloat(String(stat.value).replace(/[^0-9.-]/g, ''));
  const isPureNumber =
    !isNaN(numericValue) && String(numericValue) === String(stat.value).trim();
  const decimalCount =
    typeof stat.value === 'number'
      ? (String(stat.value).split('.')[1]?.length ?? 0)
      : (String(stat.value).trim().split('.')[1]?.length ?? 0);

  const resolvedDeltaColor: 'lime' | 'rose' | 'neutral' =
    stat.deltaColor ??
    (stat.delta?.startsWith('+') ||
    stat.delta?.includes('100%') ||
    stat.delta?.includes('Active') ||
    stat.delta?.includes('Clear') ||
    stat.delta?.includes('Complete') ||
    stat.delta?.includes('Verified') ||
    stat.delta?.includes('Level')
      ? 'lime'
      : stat.delta?.startsWith('-') ||
        stat.delta?.includes('Deficient') ||
        stat.delta?.includes('Action required')
      ? 'rose'
      : 'neutral');

  const card = (
    <section className="flex min-w-0 flex-col rounded-2xl bg-[var(--surface-muted)] p-2 border border-[var(--border)] transition-all hover:border-[var(--border-strong)] shadow-2xs group h-full justify-between">
      {/* Icon tile + optional info glyph, both hanging from the same top inset */}
      <div className="flex w-full items-start justify-between gap-2.5 p-2">
        <span
          className={cn(
            'flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-b text-white shadow-2xs',
            TILE_TONES[stat.tone ?? 'blue']
          )}
        >
          <stat.icon className="size-5 shrink-0 text-white stroke-[2]" aria-hidden />
        </span>
        {stat.hint && <StatHint label={stat.label} hint={stat.hint} />}
      </div>

      {/* Label sits directly over the number, as on the plain cards */}
      <div className="flex flex-col gap-0.5 px-2 pt-2.5 pb-3.5">
        <p className="truncate text-xs font-medium text-[var(--text-secondary)]" title={stat.label}>{stat.label}</p>
        <div className="text-2xl sm:text-3xl font-semibold whitespace-nowrap text-[var(--foreground)] tabular-nums font-[family-name:var(--font-display)]">
          {isPureNumber ? (
            <AnimatedCounter value={numericValue} decimals={decimalCount} suffix={stat.suffix} animateOnView />
          ) : (
            <span>
              {stat.value}
              {stat.suffix}
            </span>
          )}
        </div>
      </div>

      {/* Footer band: comparison caption + delta pill on an inner tile */}
      <div className="mt-auto flex w-full items-center justify-between gap-2 rounded-xl bg-[var(--surface)] py-1.5 pe-1.5 ps-2.5 border border-[var(--border)] shadow-2xs">
        <p className="truncate text-xs font-normal text-[var(--text-secondary)]" title={stat.caption ?? undefined}>
          {stat.caption ?? 'From last survey'}
        </p>
        {stat.delta && (
          <DeltaPill delta={stat.delta} deltaColor={resolvedDeltaColor} />
        )}
      </div>
    </section>
  );

  if (stat.href) {
    return (
      <Link href={stat.href} className="block focus:outline-none h-full">
        {card}
      </Link>
    );
  }

  return card;
}

export function StatCards({
  variant = 'footer',
  stats,
  count,
  columns = 4,
  className,
}: {
  variant?: StatCardsVariant;
  stats: Stat[];
  count?: number;
  columns?: 1 | 2 | 4;
  className?: string;
}) {
  const items = stats;
  return (
    <div
      className={cn(
        'grid w-full gap-4 items-stretch',
        columns === 1
          ? 'grid-cols-1'
          : variant === 'footer'
          ? 'grid-cols-1 sm:grid-cols-2'
          : 'grid-cols-2',
        columns === 4 && (variant === 'footer' ? 'lg:grid-cols-4' : 'lg:grid-cols-4'),
        className
      )}
    >
      {items.slice(0, count ?? items.length).map((stat) =>
        variant === 'footer' ? (
          <FooterStatCard key={stat.label} stat={stat} />
        ) : (
          <PlainStatCard key={stat.label} stat={stat} />
        )
      )}
    </div>
  );
}
