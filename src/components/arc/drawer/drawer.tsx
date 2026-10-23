"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { createContext, useCallback, useContext, useLayoutEffect, useRef, useState } from "react";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { Transition } from "motion/react";
import { X } from "lucide-react";
import { motionTokens } from "../lib/motion-tokens";

const OpenContext = createContext<boolean | null>(null);

export function Drawer({
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  ...props
}: ComponentPropsWithoutRef<typeof DialogPrimitive.Root>) {
  const [uncontrolled, setUncontrolled] = useState(defaultOpen);
  const open = openProp ?? uncontrolled;
  const setOpen = useCallback(
    (next: boolean) => {
      if (openProp === undefined) setUncontrolled(next);
      onOpenChange?.(next);
    },
    [openProp, onOpenChange]
  );
  return (
    <OpenContext.Provider value={open}>
      <DialogPrimitive.Root {...props} open={open} onOpenChange={setOpen} />
    </OpenContext.Provider>
  );
}

export const DrawerTrigger = DialogPrimitive.Trigger;
export const DrawerClose = DialogPrimitive.Close;

export interface DrawerContentProps extends ComponentPropsWithoutRef<typeof DialogPrimitive.Content> {
  title: string;
  description?: string;
  size?: "md" | "lg" | "xl" | "full";
  children: ReactNode;
  footer?: ReactNode;
}

const fade: Transition = { duration: motionTokens.duration.instant };
const slideEnter: Transition = { duration: motionTokens.duration.standard, ease: [...motionTokens.ease.enter] };
const slideExit: Transition = { duration: motionTokens.duration.fast, ease: [...motionTokens.ease.standard] };

const SIZE_CLASSES = {
  md: "w-full sm:max-w-md",
  lg: "w-full sm:max-w-lg",
  xl: "w-full sm:max-w-xl",
  full: "w-full sm:max-w-3xl",
};

export function DrawerContent({
  title,
  description,
  size = "lg",
  children,
  footer,
  className = "",
  onPointerDownOutside,
  ...props
}: DrawerContentProps) {
  const open = useContext(OpenContext);
  const reduced = useReducedMotion();

  const change = useRef({ open, at: 0 });
  useLayoutEffect(() => {
    change.current = { open, at: performance.now() };
  }, [open]);

  const pressOutside: DrawerContentProps["onPointerDownOutside"] = (event) => {
    onPointerDownOutside?.(event);
    if (open !== null && (!change.current.open || event.detail.originalEvent.timeStamp < change.current.at)) {
      event.preventDefault();
    }
  };

  const panelClasses = [
    "fixed top-0 bottom-0 right-0 z-50 h-full max-h-screen bg-[var(--surface-raised)] border-l border-[var(--border)] shadow-[var(--shadow-floating)] flex flex-col focus:outline-none",
    SIZE_CLASSES[size] ?? SIZE_CLASSES.lg,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const inner = (
    <>
      {/* Sticky Header */}
      <div className="flex items-start justify-between gap-4 p-5 sm:p-6 border-b border-[var(--border)] bg-[var(--surface-raised)] shrink-0">
        <div>
          <DialogPrimitive.Title className="text-base sm:text-lg font-semibold tracking-tight text-[var(--foreground)] font-[family-name:var(--font-display)]">
            {title}
          </DialogPrimitive.Title>
          {description && (
            <DialogPrimitive.Description className="mt-1 text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
              {description}
            </DialogPrimitive.Description>
          )}
        </div>
        <DialogPrimitive.Close
          className="p-1.5 rounded-[var(--radius-control)] border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--foreground)] hover:bg-[var(--surface-muted)] transition-colors shrink-0"
          aria-label="Close drawer"
        >
          <X className="w-4 h-4 stroke-[1.75]" aria-hidden="true" />
        </DialogPrimitive.Close>
      </div>

      {/* Scrollable Body */}
      <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5 text-sm">{children}</div>

      {/* Optional Sticky Footer */}
      {footer && (
        <div className="flex items-center justify-end gap-3 p-4 sm:p-5 border-t border-[var(--border)] bg-[var(--surface-muted)]/50 shrink-0">
          {footer}
        </div>
      )}
    </>
  );

  return (
    <AnimatePresence>
      {open && (
        <DialogPrimitive.Portal key="drawer-portal" forceMount>
          {/* Backdrop Overlay */}
          <DialogPrimitive.Overlay asChild forceMount>
            <motion.div
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: reduced ? fade : slideExit }}
              transition={reduced ? fade : { duration: motionTokens.duration.standard }}
            />
          </DialogPrimitive.Overlay>

          {/* Slide-over Content */}
          <DialogPrimitive.Content
            {...props}
            onPointerDownOutside={pressOutside}
            asChild
            forceMount
          >
            <motion.div
              className={panelClasses}
              initial={reduced ? { opacity: 0 } : { x: "100%" }}
              animate={{ x: 0 }}
              exit={reduced ? { opacity: 0 } : { x: "100%", transition: slideExit }}
              transition={reduced ? fade : slideEnter}
            >
              {inner}
            </motion.div>
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      )}
    </AnimatePresence>
  );
}

export function DrawerFooter({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`flex items-center justify-end gap-3 p-4 sm:p-5 border-t border-[var(--border)] bg-[var(--surface-muted)]/50 shrink-0 ${className}`}
    >
      {children}
    </div>
  );
}
