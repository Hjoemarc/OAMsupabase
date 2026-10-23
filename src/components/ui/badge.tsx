'use client';

import * as React from 'react';
import { Badge as ArcBadge, type BadgeTone, type BadgeSize } from '@/components/arc/badge/badge';

export type LegacyBadgeVariant =
  | 'default'
  | 'secondary'
  | 'destructive'
  | 'outline'
  | 'success'
  | 'process'
  | 'brand'
  | 'warning'
  | 'info';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: LegacyBadgeVariant;
  tone?: BadgeTone;
  size?: BadgeSize;
  icon?: React.ReactNode;
}

export function Badge({
  variant = 'default',
  tone,
  size = 'md',
  icon,
  className,
  children,
  ...props
}: BadgeProps) {
  let resolvedTone: BadgeTone = tone ?? 'neutral';

  if (!tone && variant) {
    if (variant === 'success') {
      resolvedTone = 'success';
    } else if (variant === 'process' || variant === 'warning') {
      resolvedTone = 'warning';
    } else if (variant === 'destructive') {
      resolvedTone = 'danger';
    } else if (variant === 'brand' || variant === 'info') {
      resolvedTone = 'info';
    } else {
      resolvedTone = 'neutral';
    }
  }

  return (
    <ArcBadge
      tone={resolvedTone}
      size={size}
      icon={icon}
      className={className}
      {...props}
    >
      {children}
    </ArcBadge>
  );
}
