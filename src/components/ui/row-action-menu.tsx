'use client';

import React from 'react';
import * as DropdownPrimitive from '@radix-ui/react-dropdown-menu';
import { MoreVertical } from 'lucide-react';
import { Button } from './button';

export interface RowActionItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  destructive?: boolean;
  separatorBefore?: boolean;
}

export interface RowActionMenuProps {
  items: RowActionItem[];
  ariaLabel?: string;
  triggerClassName?: string;
}

export function RowActionMenu({
  items,
  ariaLabel = 'Open row actions',
  triggerClassName = 'h-7 w-7 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200',
}: RowActionMenuProps) {
  return (
    <DropdownPrimitive.Root>
      <DropdownPrimitive.Trigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={triggerClassName}
          aria-label={ariaLabel}
        >
          <MoreVertical className="w-3.5 h-3.5" />
        </Button>
      </DropdownPrimitive.Trigger>

      <DropdownPrimitive.Portal>
        <DropdownPrimitive.Content
          align="end"
          sideOffset={4}
          className="z-50 min-w-[140px] rounded-[var(--radius-panel)] border border-[var(--border)] bg-[var(--surface-raised)] p-1 text-[var(--foreground)] shadow-[var(--shadow-floating)] focus:outline-none animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95"
        >
          {items.map((item) => (
            <React.Fragment key={item.id}>
              {item.separatorBefore && (
                <DropdownPrimitive.Separator className="h-px bg-[var(--border-subtle)] my-1" />
              )}
              <DropdownPrimitive.Item
                disabled={item.disabled}
                onSelect={(e) => {
                  e.preventDefault();
                  item.onClick();
                }}
                className={`flex items-center gap-2 px-2.5 py-1.5 rounded-[calc(var(--radius-panel)-6px)] text-xs cursor-pointer select-none outline-none transition-colors ${
                  item.disabled
                    ? 'opacity-40 cursor-not-allowed'
                    : item.destructive
                    ? 'text-[var(--danger)] hover:bg-red-500/10 focus:bg-red-500/10 focus:text-[var(--danger)]'
                    : 'text-[var(--foreground)] hover:bg-[var(--surface-muted)] focus:bg-[var(--surface-muted)]'
                }`}
              >
                {item.icon && (
                  <span
                    className={`w-3.5 h-3.5 shrink-0 ${
                      item.destructive ? 'text-[var(--danger)]' : 'text-[var(--text-secondary)]'
                    }`}
                  >
                    {item.icon}
                  </span>
                )}
                <span className="font-medium truncate">{item.label}</span>
              </DropdownPrimitive.Item>
            </React.Fragment>
          ))}
        </DropdownPrimitive.Content>
      </DropdownPrimitive.Portal>
    </DropdownPrimitive.Root>
  );
}
