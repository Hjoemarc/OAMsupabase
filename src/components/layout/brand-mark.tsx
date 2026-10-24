import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export interface BrandMarkProps {
  variant?: 'seal' | 'lockup' | 'wordmark' | 'tagline';
  size?: number;
  className?: string;
  priority?: boolean;
}

export function BrandMark({
  variant = 'seal',
  size,
  className,
  priority = false,
}: BrandMarkProps) {
  if (variant === 'seal') {
    const dimension = size ?? 36;
    return (
      <Image
        src="/brand/zppsu-seal.png"
        alt="ZPPSU Official University Seal"
        width={dimension}
        height={dimension}
        priority={priority}
        className={cn('shrink-0 object-contain', className)}
      />
    );
  }

  if (variant === 'wordmark') {
    const width = size ?? 180;
    const height = Math.round(width * 0.28);
    return (
      <Image
        src="/brand/zppsu-wordmark.png"
        alt="Zamboanga Peninsula Polytechnic State University"
        width={width}
        height={height}
        priority={priority}
        className={cn('shrink-0 object-contain', className)}
      />
    );
  }

  if (variant === 'tagline') {
    const width = size ?? 160;
    const height = Math.round(width * 0.17);
    return (
      <Image
        src="/brand/un-sagwan-un-layag.png"
        alt="Un Sagwan, Un Layag"
        width={width}
        height={height}
        priority={priority}
        className={cn('shrink-0 object-contain', className)}
      />
    );
  }

  // 'lockup' = Official Seal + Barlow Typography Lockup
  const sealDim = size ?? 36;
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <Image
        src="/brand/zppsu-seal.png"
        alt="ZPPSU Official Seal"
        width={sealDim}
        height={sealDim}
        priority={priority}
        className="shrink-0 object-contain"
      />
      <div className="leading-tight">
        <span className="block font-[family-name:var(--font-display)] text-sm font-bold tracking-tight text-[var(--foreground)]">
          ZPPSU OAMS
        </span>
        <span className="block text-[11px] font-normal text-[var(--text-muted)] tracking-normal">
          Accreditation Management
        </span>
      </div>
    </div>
  );
}
