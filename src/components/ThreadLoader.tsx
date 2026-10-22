import React, { useState, useEffect, useRef } from 'react';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion.ts';

// Resolve image paths relative to Vite's base (/ locally, /everthread/ on GitHub Pages)
const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');

export interface ThreadLoaderProps {
  /**
   * Display mode:
   * - 'fullscreen': Fixed viewport overlay with warm ivory background
   * - 'overlay': Absolute container overlay with subtle backdrop blur
   * - 'inline': Embedded within document layout
   */
  variant?: 'fullscreen' | 'overlay' | 'inline';

  /**
   * Controls whether loading is active.
   */
  isLoading?: boolean;

  /**
   * Subtitle message below the EverThread wordmark.
   * Default: "An heirloom, not a trend."
   */
  message?: string;

  /**
   * Whether to display the EVERTHREAD serif wordmark.
   * Default: true
   */
  showWordmark?: boolean;

  /**
   * Minimum display time (in ms) to avoid flashing on near-instant loads.
   * Default: 600ms
   */
  minDisplayTimeMs?: number;

  /**
   * Fade-out animation duration (in ms) before unmounting.
   * Default: 400ms
   */
  fadeDurationMs?: number;

  /**
   * Callback fired when fade-out animation completes and component unmounts.
   */
  onExited?: () => void;

  /**
   * Additional custom CSS classes.
   */
  className?: string;
}

const isTestEnv = typeof process !== 'undefined' && process.env?.NODE_ENV === 'test';

export const ThreadLoader: React.FC<ThreadLoaderProps> = ({
  variant = 'fullscreen',
  isLoading = true,
  message = 'An heirloom, not a trend.',
  showWordmark = true,
  minDisplayTimeMs = isTestEnv ? 0 : 1900,
  fadeDurationMs = isTestEnv ? 0 : 400,
  onExited,
  className = ''
}) => {
  const prefersReduced = usePrefersReducedMotion();
  const effectiveMinDisplay = prefersReduced ? 0 : minDisplayTimeMs;
  const effectiveFadeDuration = prefersReduced ? 0 : fadeDurationMs;

  const [shouldRender, setShouldRender] = useState(isLoading);
  const [isFading, setIsFading] = useState(false);
  const mountTimeRef = useRef<number>(Date.now());
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isLoading) {
      setShouldRender(true);
      setIsFading(false);
      mountTimeRef.current = Date.now();
    } else {
      // In reduced-motion mode, unmount immediately without artificial delay or transition
      if (prefersReduced) {
        setShouldRender(false);
        setIsFading(false);
        onExited?.();
        return;
      }

      // Calculate remaining time to fulfill minDisplayTimeMs
      const elapsed = Date.now() - mountTimeRef.current;
      const delay = Math.max(0, effectiveMinDisplay - elapsed);

      timerRef.current = setTimeout(() => {
        setIsFading(true);
        // Wait for CSS transition to finish before fully unmounting
        timerRef.current = setTimeout(() => {
          setShouldRender(false);
          setIsFading(false);
          onExited?.();
        }, effectiveFadeDuration);
      }, delay);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [isLoading, prefersReduced, effectiveMinDisplay, effectiveFadeDuration, onExited]);

  if (!shouldRender) {
    return null;
  }

  const variantClass = 
    variant === 'fullscreen' ? 'thread-loader-fullscreen' :
    variant === 'overlay' ? 'thread-loader-overlay' : 'thread-loader-inline';

  const fadingClass = isFading ? 'thread-loader-fading' : '';

  return (
    <div 
      className={`thread-loader-root ${variantClass} ${fadingClass} ${className}`.trim()}
      role="status"
      aria-live="polite"
      aria-label="Loading EverThread..."
      data-testid="thread-loader"
    >
      <div className="thread-loader-canvas">
        <div className="thread-loader-artwork-wrapper">
          <picture className="d-flex align-items-center justify-content-center w-100 h-100">
            <source srcSet={`${BASE}/images/everthread-loader-hand-clean.webp`} type="image/webp" />
            <img
              src={`${BASE}/images/everthread-loader-hand-clean.png`}
              alt="EverThread artisan hand poised with thread"
              className="thread-hand-artwork"
              data-testid="thread-hand-artwork"
              width={896}
              height={1200}
              loading="eager"
              decoding="sync"
              onError={(e) => {
                const target = e.currentTarget;
                if (!target.src.endsWith('everthread-loader-hand.png')) {
                  target.src = `${BASE}/images/everthread-loader-hand.png`;
                }
              }}
            />
          </picture>
          <svg 
            className="thread-loader-svg" 
            viewBox="0 0 896 1200" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="champagneSilkFilament" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#DFC396" stopOpacity="0.9" />
                <stop offset="30%" stopColor="#FAF4E8" stopOpacity="1" />
                <stop offset="65%" stopColor="#DFC396" stopOpacity="0.95" />
                <stop offset="100%" stopColor="#B49A70" stopOpacity="0.9" />
              </linearGradient>
              <filter id="silkSubtleGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodColor="#DFC396" floodOpacity="0.35" />
              </filter>
            </defs>

            {/* Continuous Champagne Silk Filament ("The Thread Between Fingers") */}
            <path
              className="thread-active-silk"
              d="M 710 45 C 640 150, 528 313, 554 405 C 572 468, 660 620, 702 730 C 724 788, 665 848, 605 848 C 545 848, 490 770, 490 680 C 490 590, 510 480, 530 435"
              pathLength="1000"
            />
          </svg>
        </div>
      </div>

      {(showWordmark || message) && (
        <div className="thread-loader-text-group">
          {showWordmark && (
            <div className="thread-loader-brand" data-testid="thread-loader-brand">EVERTHREAD</div>
          )}
          {message && (
            <div className="thread-loader-tagline" data-testid="thread-loader-tagline">{message}</div>
          )}
        </div>
      )}
    </div>
  );
};
