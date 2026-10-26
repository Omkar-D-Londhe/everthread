import React, { useEffect, useRef } from 'react';
import { MOTION_TOKENS } from '../../config/designTokens.ts';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion.ts';

export interface StrandThreadProps {
  /**
   * Normalized draw progress from 0 (undrawn) to 1 (fully drawn).
   * Default: 1 (fully drawn).
   */
  progress?: number;
  /**
   * If true, fires a single 400ms champagne pulse glow upon settling.
   */
  pulse?: boolean;
  /**
   * Custom CSS class name.
   */
  className?: string;
  /**
   * Orientation / placement variant.
   */
  variant?: 'horizontal' | 'vertical' | 'curve' | 'crossing';
  /**
   * Width in px or string.
   */
  width?: string | number;
  /**
   * Height in px or string.
   */
  height?: string | number;
}

export const StrandThread: React.FC<StrandThreadProps> = ({
  progress = 1,
  pulse = false,
  className = '',
  variant = 'horizontal',
  width = '100%',
  height = 24
}) => {
  const prefersReduced = usePrefersReducedMotion();
  const pathRef = useRef<SVGPathElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // SVG Path definition based on variant
  const getPathData = () => {
    switch (variant) {
      case 'curve':
        return 'M 0,12 C 150,0 250,24 400,12 S 650,0 800,12 S 1050,24 1200,12';
      case 'crossing':
        return 'M 0,2 C 200,18 400,2 600,18 S 800,2 1000,18 S 1200,2 1440,18';
      case 'vertical':
        return 'M 12,0 L 12,200';
      case 'horizontal':
      default:
        return 'M 0,12 L 1200,12';
    }
  };

  useEffect(() => {
    const path = pathRef.current;
    if (!path) return;

    if (prefersReduced) {
      path.style.strokeDashoffset = '0';
      return;
    }

    try {
      const length = path.getTotalLength() || 1200;
      path.style.strokeDasharray = `${length}`;
      const clampedProg = Math.max(0, Math.min(1, progress));
      path.style.strokeDashoffset = `${length * (1 - clampedProg)}`;
    } catch {
      // Fallback in test/headless environments where getTotalLength is mock
      path.style.strokeDashoffset = '0';
    }
  }, [progress, prefersReduced]);

  useEffect(() => {
    if (!pulse || prefersReduced) return;
    const container = containerRef.current;
    if (!container) return;

    container.classList.add('strand-thread-pulse');
    const timer = setTimeout(() => {
      container.classList.remove('strand-thread-pulse');
    }, MOTION_TOKENS.thread.pulseDurationSec * 1000);

    return () => clearTimeout(timer);
  }, [pulse, prefersReduced]);

  return (
    <div
      ref={containerRef}
      className={`strand-thread-container ${className}`}
      data-testid={`strand-thread-${variant}`}
      style={{
        width,
        height,
        position: 'relative',
        overflow: 'hidden',
        pointerEvents: 'none'
      }}
      aria-hidden="true"
    >
      <svg
        width="100%"
        height="100%"
        viewBox={variant === 'crossing' ? '0 0 1440 24' : '0 0 1200 24'}
        preserveAspectRatio="none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: 'block', pointerEvents: 'none' }}
      >
        <path
          ref={pathRef}
          d={getPathData()}
          stroke="var(--color-champagne-thread, #B49A70)"
          strokeWidth="1.5"
          strokeLinecap="round"
          style={{
            transition: prefersReduced
              ? 'none'
              : 'stroke-dashoffset 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        />
      </svg>
    </div>
  );
};
