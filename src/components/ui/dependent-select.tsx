'use client';

import React from 'react';
import { ChevronDown } from 'lucide-react';

export interface DependentSelectOption {
  value: string;
  label: string;
  subtext?: string;
  disabled?: boolean;
}

export interface DependentSelectProps {
  id?: string;
  label?: string;
  value: string;
  onChange: (value: string) => void;
  options: DependentSelectOption[];
  placeholder?: string;
  disabled?: boolean;
  disabledReason?: string;
  emptyMessage?: string;
  required?: boolean;
  error?: string;
  className?: string;
}

export function DependentSelect({
  id,
  label,
  value,
  onChange,
  options,
  placeholder = 'Select an option...',
  disabled = false,
  disabledReason,
  emptyMessage = 'No options available',
  required = false,
  error,
  className = '',
}: DependentSelectProps) {
  const isDisabled = disabled || (options.length === 0 && !disabledReason);

  return (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <label
          htmlFor={id}
          className="block text-xs font-medium text-[var(--text-secondary)]"
        >
          {label}
          {required && <span className="text-[var(--danger)] ml-0.5">*</span>}
        </label>
      )}

      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={isDisabled}
          required={required}
          className={`w-full text-xs p-2 pr-8 rounded-[var(--radius-control)] border appearance-none transition-colors focus:outline-none ${
            error
              ? 'border-[var(--danger)] bg-[var(--surface)] text-[var(--foreground)]'
              : isDisabled
              ? 'border-[var(--border-subtle)] bg-[var(--surface-muted)] text-[var(--text-muted)] cursor-not-allowed opacity-60'
              : 'border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] hover:border-[var(--border-strong)] focus:border-[var(--accent)]'
          }`}
        >
          <option value="" disabled>
            {disabledReason || (options.length === 0 ? emptyMessage : placeholder)}
          </option>

          {options.map((opt) => (
            <option key={opt.value} value={opt.value} disabled={opt.disabled}>
              {opt.label} {opt.subtext ? `(${opt.subtext})` : ''}
            </option>
          ))}
        </select>

        <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none stroke-[2]" />
      </div>

      {error && <p className="text-[11px] text-[var(--danger)] mt-0.5">{error}</p>}
      {disabled && disabledReason && (
        <p className="text-[11px] text-[var(--text-muted)] mt-0.5">{disabledReason}</p>
      )}
    </div>
  );
}
