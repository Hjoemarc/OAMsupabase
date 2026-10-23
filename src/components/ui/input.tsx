'use client';

import * as React from 'react';
import { Input as ArcInput, type InputProps as ArcInputProps } from '@/components/arc/input/input';
import { cn } from '@/lib/utils';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'label'> {
  label?: string;
  description?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, description, error, className, ...props }, ref) => {
    if (label) {
      return (
        <ArcInput
          ref={ref}
          label={label}
          description={description}
          error={error}
          className={className}
          {...props}
        />
      );
    }

    return (
      <input
        ref={ref}
        className={cn(
          'w-full min-h-[var(--control-height-md)] rounded-[var(--radius-control)] border border-[var(--border-strong)] bg-[var(--surface)] px-3.5 py-2 text-sm text-[var(--foreground)] placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] focus:outline-none transition-colors disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';
