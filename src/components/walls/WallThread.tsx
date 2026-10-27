import React from 'react';

interface WallThreadProps {
  progress: number; // 0 (contemporary) to 1 (living-inheritance)
  isSettled: boolean;
  isReducedMotion: boolean;
}

export const WallThread: React.FC<WallThreadProps> = ({
  progress,
  isSettled,
  isReducedMotion
}) => {
  // Total virtual path length for dashoffset calculation
  const pathLength = 1200;

  // Perceptual lead curve:
  // Calibrated so rightward travel initiates visibly and smoothly during normal scrolling
  const clampedProgress = Math.max(0, Math.min(1, progress));
  const perceptualProgress = isReducedMotion
    ? 1
    : Math.sin((clampedProgress * Math.PI) / 2);

  const dashOffset = isReducedMotion
    ? 0
    : Math.max(0, Math.min(pathLength, pathLength * (1 - perceptualProgress)));

  // Compute exact tip coordinates along quadratic bezier path:
  // M 0 18 Q 300 8, 600 18 T 1200 18
  const t = perceptualProgress;
  const headX = 1200 * t;
  let headY = 18;
  if (t <= 0.5) {
    const u = 2 * t;
    headY = 18 - 20 * u * (1 - u);
  } else {
    const u = 2 * (t - 0.5);
    headY = 18 + 20 * u * (1 - u);
  }

  // Active traveling indicator is visible while actively traversing (0.02 < t < 0.98)
  const isMoving = !isReducedMotion && clampedProgress > 0.02 && clampedProgress < 0.98;

  return (
    <div 
      className={`wall-thread-container ${isSettled ? 'wall-thread-settled' : ''}`}
      aria-hidden="true"
      style={{ pointerEvents: 'none' }}
    >
      <svg 
        className="wall-thread-svg" 
        viewBox="0 0 1200 36" 
        preserveAspectRatio="none"
        fill="none"
        data-testid="wall-thread-svg"
      >
        <defs>
          <linearGradient id="wallThreadGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#DFC396" stopOpacity="0.85" />
            <stop offset="50%" stopColor="#C9AC7A" stopOpacity="1" />
            <stop offset="100%" stopColor="#DFC396" stopOpacity="0.9" />
          </linearGradient>
          <filter id="wallThreadGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <filter id="wallThreadHeadGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Tactile gold thread running horizontally along the architectural plinth line */}
        <path
          d="M 0 18 Q 300 8, 600 18 T 1200 18"
          stroke="url(#wallThreadGradient)"
          strokeWidth="2.75"
          strokeLinecap="round"
          strokeDasharray={pathLength}
          strokeDashoffset={dashOffset}
          filter={!isReducedMotion ? 'url(#wallThreadGlow)' : undefined}
          style={{
            transition: isReducedMotion ? 'none' : 'stroke-dashoffset 0.16s cubic-bezier(0.22, 1, 0.36, 1)'
          }}
        />

        {/* Luminous leading head beacon that clearly guides the eye rightward during scroll */}
        {isMoving && (
          <g className="wall-thread-head" data-testid="wall-thread-head">
            <circle
              cx={headX}
              cy={headY}
              r="5"
              fill="#B49A70"
              opacity="0.6"
              filter="url(#wallThreadHeadGlow)"
            />
            <circle
              cx={headX}
              cy={headY}
              r="3.5"
              fill="#DFC396"
            />
            <circle
              cx={headX}
              cy={headY}
              r="1.75"
              fill="#FFFFFF"
            />
          </g>
        )}
      </svg>
    </div>
  );
};
