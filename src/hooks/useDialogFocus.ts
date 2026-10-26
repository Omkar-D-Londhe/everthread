import { useEffect, useRef } from 'react';

export interface UseDialogFocusOptions {
  isOpen: boolean;
  onClose: () => void;
  containerRef: React.RefObject<HTMLElement | null>;
  initialFocusRef?: React.RefObject<HTMLElement | null>;
  restoreFocusRef?: React.RefObject<HTMLElement | null>;
  restoreFocusSelector?: string;
}

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Shared accessibility hook managing focus trapping, initial focus placement,
 * Escape key dismissal, and opener focus restoration for modal dialogs.
 */
export function useDialogFocus({
  isOpen,
  onClose,
  containerRef,
  initialFocusRef,
  restoreFocusRef,
  restoreFocusSelector,
}: UseDialogFocusOptions): void {
  const previousActiveElementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    // Capture the opener element before modal takes focus (only if opener is outside container)
    if (
      document.activeElement instanceof HTMLElement &&
      document.activeElement !== document.body &&
      (!containerRef.current || !containerRef.current.contains(document.activeElement))
    ) {
      previousActiveElementRef.current = document.activeElement;
    }

    // Move initial focus
    const focusTimer = setTimeout(() => {
      if (initialFocusRef?.current) {
        initialFocusRef.current.focus();
      } else if (containerRef.current) {
        const firstFocusable = containerRef.current.querySelector<HTMLElement>(FOCUSABLE_SELECTOR);
        if (firstFocusable) {
          firstFocusable.focus();
        } else {
          containerRef.current.focus();
        }
      }
    }, 40);

    // Document-level keydown handler for Escape dismissal and Tab trap
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        onClose();
        return;
      }

      if (e.key === 'Tab' && containerRef.current) {
        const focusableElements = Array.from(
          containerRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
        ).filter(el => !el.hasAttribute('disabled') && el.getAttribute('aria-hidden') !== 'true');

        if (focusableElements.length === 0) {
          e.preventDefault();
          return;
        }

        const firstEl = focusableElements[0];
        const lastEl = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstEl || !containerRef.current.contains(document.activeElement)) {
            e.preventDefault();
            lastEl.focus();
          }
        } else {
          if (document.activeElement === lastEl || !containerRef.current.contains(document.activeElement)) {
            e.preventDefault();
            firstEl.focus();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown, true);

    // Prevent background scrolling while open
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      clearTimeout(focusTimer);
      window.removeEventListener('keydown', handleKeyDown, true);
      document.body.style.overflow = originalOverflow;

      // Restore focus to opener element upon modal exit
      let target = restoreFocusRef?.current || previousActiveElementRef.current;
      if ((!target || !document.contains(target)) && restoreFocusSelector) {
        try {
          target = document.querySelector<HTMLElement>(restoreFocusSelector);
        } catch {
          // ignore malformed selectors
        }
      }
      if (target && typeof target.focus === 'function') {
        const toFocus = target;
        setTimeout(() => {
          if (document.contains(toFocus)) {
            toFocus.focus();
          } else if (restoreFocusSelector) {
            try {
              const fallback = document.querySelector<HTMLElement>(restoreFocusSelector);
              fallback?.focus();
            } catch {}
          }
        }, 10);
      }
    };
  }, [isOpen, onClose, containerRef, initialFocusRef, restoreFocusRef, restoreFocusSelector]);
}

