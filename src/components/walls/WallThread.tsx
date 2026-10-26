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
  // If reduced motion, fully drawn (offset 0), otherwise mapped
  const dashOffset = isReducedMotion
    ? 0
    : Math.max(0, Math.min(pathLength, pathLength * (1 - progress)));

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
            <stop offset="0%" stopColor="#DFC396" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#B49A70" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#DFC396" stopOpacity="0.8" />
          </linearGradient>
          <filter id="wallThreadGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Tactile gold thread running horizontally along the architectural plinth line */}
        <path
          d="M 0 18 Q 300 8, 600 18 T 1200 18"
          stroke="url(#wallThreadGradient)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray={pathLength}
          strokeDashoffset={dashOffset}
          filter={isSettled && !isReducedMotion ? 'url(#wallThreadGlow)' : undefined}
          style={{
            transition: isReducedMotion ? 'none' : 'stroke-dashoffset 0.1s linear'
          }}
        />
      </svg>
    </div>
  );
};
