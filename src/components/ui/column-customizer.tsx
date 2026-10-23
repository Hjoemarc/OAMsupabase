'use client';

import React, { useState, useEffect } from 'react';
import * as PopoverPrimitive from '@radix-ui/react-popover';
import { SlidersHorizontal, ChevronDown, Check, RotateCcw } from 'lucide-react';
import { Button } from './button';

export interface ColumnOption {
  id: string;
  label: string;
  locked?: boolean;
}

export interface ColumnCustomizerProps {
  columns: ColumnOption[];
  visibleColumnIds: string[];
  onChange: (visibleIds: string[]) => void;
  storageKey?: string;
  defaultVisibleIds?: string[];
}

export function ColumnCustomizer({
  columns,
  visibleColumnIds,
  onChange,
  storageKey,
  defaultVisibleIds,
}: ColumnCustomizerProps) {
  const [open, setOpen] = useState(false);

  // Initialize from localStorage if key provided
  useEffect(() => {
    if (!storageKey || typeof window === 'undefined') return;
    try {
      const stored = window.localStorage.getItem(`oams_cols_${storageKey}`);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          onChange(parsed);
        }
      }
    } catch {
      // Ignore storage errors
    }
  }, [storageKey]);

  const handleToggle = (id: string) => {
    const isVisible = visibleColumnIds.includes(id);
    let updated: string[];

    if (isVisible) {
      // Don't allow hiding if it's the last remaining column
      if (visibleColumnIds.length <= 1) return;
      updated = visibleColumnIds.filter((colId) => colId !== id);
    } else {
      updated = [...visibleColumnIds, id];
    }

    onChange(updated);
    if (storageKey && typeof window !== 'undefined') {
      try {
        window.localStorage.setItem(`oams_cols_${storageKey}`, JSON.stringify(updated));
      } catch {
        // Ignore storage errors
      }
    }
  };

  const handleShowAll = () => {
    const allIds = columns.map((c) => c.id);
    onChange(allIds);
    if (storageKey && typeof window !== 'undefined') {
      try {
        window.localStorage.setItem(`oams_cols_${storageKey}`, JSON.stringify(allIds));
      } catch {
        // Ignore storage errors
      }
    }
  };

  const handleReset = () => {
    const resetIds = defaultVisibleIds || columns.map((c) => c.id);
    onChange(resetIds);
    if (storageKey && typeof window !== 'undefined') {
      try {
        window.localStorage.setItem(`oams_cols_${storageKey}`, JSON.stringify(resetIds));
      } catch {
        // Ignore storage errors
      }
    }
  };

  return (
    <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
      <PopoverPrimitive.Trigger asChild>
        <Button
          variant="secondary"
          size="sm"
          className="gap-1.5 shrink-0"
          aria-label="Customize columns"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>Customize Columns</span>
          <ChevronDown
            className={`w-3 h-3 opacity-60 transition-transform duration-200 ${
              open ? 'rotate-180' : ''
            }`}
          />
        </Button>
      </PopoverPrimitive.Trigger>

      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          align="end"
          sideOffset={6}
          className="z-50 w-64 rounded-[var(--radius-panel)] border border-[var(--border)] bg-[var(--surface-raised)] p-3 text-[var(--foreground)] shadow-[var(--shadow-floating)] focus:outline-none animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95"
        >
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-[var(--border-subtle)]">
            <span className="text-xs font-semibold text-[var(--foreground)]">Table Columns</span>
            <span className="text-[10px] text-[var(--text-muted)] font-mono">
              {visibleColumnIds.length}/{columns.length} shown
            </span>
          </div>

          <div className="space-y-1 max-h-56 overflow-y-auto py-1">
            {columns.map((col) => {
              const isChecked = visibleColumnIds.includes(col.id);
              const isLocked = col.locked;

              return (
                <label
                  key={col.id}
                  className={`flex items-center gap-2.5 px-2 py-1.5 rounded-[var(--radius-control)] text-xs cursor-pointer select-none transition-colors ${
                    isLocked
                      ? 'opacity-60 cursor-not-allowed'
                      : 'hover:bg-[var(--surface-muted)]'
                  }`}
                >
                  <button
                    type="button"
                    role="checkbox"
                    aria-checked={isChecked}
                    disabled={isLocked}
                    onClick={() => !isLocked && handleToggle(col.id)}
                    className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                      isChecked
                        ? 'bg-[var(--accent)] border-[var(--accent)] text-white'
                        : 'border-[var(--border-strong)] bg-[var(--surface)]'
                    }`}
                  >
                    {isChecked && <Check className="w-3 h-3 stroke-[2.5]" />}
                  </button>
                  <span className="flex-1 truncate text-xs">{col.label}</span>
                  {isLocked && (
                    <span className="text-[10px] text-[var(--text-muted)] italic">Locked</span>
                  )}
                </label>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-2 mt-2 border-t border-[var(--border-subtle)] text-[11px]">
            <button
              type="button"
              onClick={handleShowAll}
              className="text-[var(--accent)] hover:underline font-medium"
            >
              Show all
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="text-[var(--text-muted)] hover:text-[var(--foreground)] flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
}
