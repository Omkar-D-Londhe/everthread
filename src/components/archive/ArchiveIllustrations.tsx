import React from 'react';

interface IllustrationProps {
  className?: string;
  style?: React.CSSProperties;
  color?: string;
  title?: string;
}

/**
 * Fine-line Warp/Weft Interlacing Grid Motif
 * Represents foundational handloom weave structure.
 */
export const WeaveGridIllustration: React.FC<IllustrationProps> = ({
  className = '',
  style,
  color = 'var(--color-champagne-thread, #B49A70)'
}) => (
  <svg
    viewBox="0 0 120 80"
    width="100%"
    height="100%"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`archive-svg-illustration ${className}`.trim()}
    style={{ maxWidth: 120, maxHeight: 80, opacity: 0.55, ...style }}
    aria-hidden="true"
  >
    {/* Warp Vertical Filaments */}
    <line x1="20" y1="10" x2="20" y2="70" stroke={color} strokeWidth="1" strokeDasharray="3 2" />
    <line x1="35" y1="10" x2="35" y2="70" stroke={color} strokeWidth="1.2" />
    <line x1="50" y1="10" x2="50" y2="70" stroke={color} strokeWidth="1" strokeDasharray="3 2" />
    <line x1="65" y1="10" x2="65" y2="70" stroke={color} strokeWidth="1.2" />
    <line x1="80" y1="10" x2="80" y2="70" stroke={color} strokeWidth="1" strokeDasharray="3 2" />
    <line x1="95" y1="10" x2="95" y2="70" stroke={color} strokeWidth="1.2" />

    {/* Weft Horizontal Passes */}
    <path d="M10 22 C 25 18, 45 26, 65 20 S 95 24, 110 20" stroke={color} strokeWidth="1.2" />
    <path d="M10 38 C 30 42, 50 34, 75 40 S 95 36, 110 38" stroke={color} strokeWidth="1" />
    <path d="M10 54 C 20 50, 45 58, 70 52 S 100 56, 110 54" stroke={color} strokeWidth="1.2" />

    {/* Structural Interlace Nodes */}
    <circle cx="35" cy="22" r="1.5" fill={color} />
    <circle cx="65" cy="38" r="1.5" fill={color} />
    <circle cx="95" cy="54" r="1.5" fill={color} />
  </svg>
);

/**
 * Geometric Stepped Fret / Pallu Border Motif
 * Inspired by architectural end-piece sari borders.
 */
export const PalluBorderIllustration: React.FC<IllustrationProps> = ({
  className = '',
  style,
  color = 'var(--color-champagne-thread, #B49A70)'
}) => (
  <svg
    viewBox="0 0 160 40"
    width="100%"
    height="100%"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`archive-svg-illustration ${className}`.trim()}
    style={{ maxWidth: 160, maxHeight: 40, opacity: 0.6, ...style }}
    aria-hidden="true"
  >
    {/* Frame Lines */}
    <line x1="0" y1="6" x2="160" y2="6" stroke={color} strokeWidth="0.75" />
    <line x1="0" y1="34" x2="160" y2="34" stroke={color} strokeWidth="0.75" />

    {/* Stepped Diamond Chevrons */}
    <path d="M10 20 L20 10 L30 20 L20 30 Z" stroke={color} strokeWidth="1" />
    <path d="M40 20 L50 10 L60 20 L50 30 Z" stroke={color} strokeWidth="1" />
    <path d="M70 20 L80 10 L90 20 L80 30 Z" stroke={color} strokeWidth="1" />
    <path d="M100 20 L110 10 L120 20 L110 30 Z" stroke={color} strokeWidth="1" />
    <path d="M130 20 L140 10 L150 20 L140 30 Z" stroke={color} strokeWidth="1" />

    {/* Center Pinprick Accent Points */}
    <circle cx="20" cy="20" r="1" fill={color} />
    <circle cx="50" cy="20" r="1" fill={color} />
    <circle cx="80" cy="20" r="1" fill={color} />
    <circle cx="110" cy="20" r="1" fill={color} />
    <circle cx="140" cy="20" r="1" fill={color} />
  </svg>
);

/**
 * Minimal Pit-Loom Heddle Thread Path Schematic
 * Architectural craft line illustration showing the tension path from beam to fell.
 */
export const LoomThreadPathIllustration: React.FC<IllustrationProps> = ({
  className = '',
  style,
  color = 'var(--color-champagne-thread, #B49A70)'
}) => (
  <svg
    viewBox="0 0 140 90"
    width="100%"
    height="100%"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`archive-svg-illustration ${className}`.trim()}
    style={{ maxWidth: 140, maxHeight: 90, opacity: 0.5, ...style }}
    aria-hidden="true"
  >
    {/* Warp Beam Cylinder */}
    <circle cx="20" cy="45" r="12" stroke={color} strokeWidth="1" />
    <circle cx="20" cy="45" r="4" fill={color} opacity={0.4} />

    {/* Heddle Frames (Shafts 1 & 2) */}
    <line x1="55" y1="12" x2="55" y2="78" stroke={color} strokeWidth="1.25" strokeDasharray="6 3" />
    <circle cx="55" cy="38" r="2.5" stroke={color} strokeWidth="1" fill="none" />
    <line x1="75" y1="12" x2="75" y2="78" stroke={color} strokeWidth="1.25" strokeDasharray="6 3" />
    <circle cx="75" cy="52" r="2.5" stroke={color} strokeWidth="1" fill="none" />

    {/* Reed Sley Frame */}
    <line x1="95" y1="20" x2="95" y2="70" stroke={color} strokeWidth="1.5" />

    {/* Thread Path Lines */}
    <path d="M28 37 C 38 35, 48 38, 55 38 S 85 45, 95 45 L 125 45" stroke={color} strokeWidth="1.1" />
    <path d="M28 53 C 40 55, 60 52, 75 52 S 88 45, 95 45 L 125 45" stroke={color} strokeWidth="1.1" strokeDasharray="3 2" />

    {/* Cloth Fell Point */}
    <circle cx="125" cy="45" r="1.5" fill={color} />
  </svg>
);

/**
 * Architectural Thread Divider with Diamond Accent
 */
export const ArchitecturalThreadDivider: React.FC<IllustrationProps> = ({
  className = '',
  style,
  color = 'var(--color-champagne-thread, #B49A70)'
}) => (
  <div
    className={`d-flex align-items-center justify-content-center gap-2 my-3 ${className}`.trim()}
    style={{ opacity: 0.7, ...style }}
    aria-hidden="true"
  >
    <div style={{ flex: 1, height: 1, backgroundColor: color }} />
    <div style={{ width: 6, height: 6, border: `1px solid ${color}`, transform: 'rotate(45deg)' }} />
    <div style={{ flex: 1, height: 1, backgroundColor: color }} />
  </div>
);
