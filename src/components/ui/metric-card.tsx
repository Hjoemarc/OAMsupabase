'use client';

import React from 'react';
import type { LegacyBadgeVariant } from '@/components/ui/badge';
import {
  FooterStatCard,
  PlainStatCard,
  type Stat,
  type StatTone,
  type StatCardsVariant,
} from '@/components/ui/stat-cards';

export interface MetricCardProps {
  title?: string;
  label?: string;
  value: string | number;
  suffix?: string;
  badge?: {
    label: string;
    variant?: LegacyBadgeVariant;
  };
  subtitle?: string;
  context?: string;
  microtext?: string;
  change?: string;
  href?: string;
  actionLabel?: string;
  className?: string;
  icon?: React.ComponentType<{ className?: string; 'aria-hidden'?: boolean | 'true' | 'false' }>;
  tone?: StatTone;
  variant?: StatCardsVariant;
}

export function MetricCard({
  title,
  label,
  value,
  suffix,
  badge,
  subtitle,
  context,
  microtext,
  change,
  href,
  actionLabel,
  className: _className,
  icon: Icon,
  tone,
  variant = 'footer',
}: MetricCardProps) {
  const displayLabel = title ?? label ?? '';
  const displayCaption = subtitle ?? context ?? '';
  const displayDelta = change ?? badge?.label;

  // Determine a harmonic gradient tone if not passed
  let resolvedTone: StatTone = tone ?? 'blue';
  if (!tone) {
    const textLower = displayLabel.toLowerCase();
    if (textLower.includes('cycle') || textLower.includes('framework') || textLower.includes('assigned area')) {
      resolvedTone = 'maroon';
    } else if (textLower.includes('pending') || textLower.includes('approval') || textLower.includes('criteria')) {
      resolvedTone = 'orange';
    } else if (textLower.includes('benchmark') || textLower.includes('mean') || textLower.includes('rating') || textLower.includes('audited')) {
      resolvedTone = 'emerald';
    } else if (textLower.includes('vault') || textLower.includes('evidence') || textLower.includes('document')) {
      resolvedTone = 'purple';
    } else if (textLower.includes('personnel') || textLower.includes('user') || textLower.includes('areas')) {
      resolvedTone = 'blue';
    }
  }

  const stat: Stat = {
    icon: (Icon as any) ?? (() => null),
    label: displayLabel,
    value,
    suffix,
    delta: displayDelta,
    tone: resolvedTone,
    caption: displayCaption,
    hint: microtext,
    href,
    actionLabel,
  };

  if (variant === 'plain') {
    return <PlainStatCard stat={stat} />;
  }

  return <FooterStatCard stat={stat} />;
}
