'use client';

import * as React from 'react';
import { Button as ArcButton } from '@/components/arc/button/button';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'ghost'
  | 'danger'
  | 'default'
  | 'brand'
  | 'destructive'
  | 'outline'
  | 'link';

export type ButtonSize = 'default' | 'sm' | 'md' | 'lg' | 'icon';

export interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'size'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  className?: string;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', className, ...props }, ref) => {
    let arcVariant: 'primary' | 'secondary' | 'ghost' | 'danger' = 'primary';
    if (variant === 'destructive' || variant === 'danger') {
      arcVariant = 'danger';
    } else if (variant === 'outline' || variant === 'secondary') {
      arcVariant = 'secondary';
    } else if (variant === 'ghost' || variant === 'link') {
      arcVariant = 'ghost';
    } else if (variant === 'brand' || variant === 'default' || variant === 'primary') {
      arcVariant = 'primary';
    }

    let arcSize: 'sm' | 'md' | 'lg' = 'md';
    if (size === 'sm') {
      arcSize = 'sm';
    } else if (size === 'lg') {
      arcSize = 'lg';
    } else if (size === 'icon') {
      arcSize = 'sm';
    }

    return (
      <ArcButton
        ref={ref}
        variant={arcVariant}
        size={arcSize}
        className={className}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';
