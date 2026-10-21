import React, { useRef, useEffect, useState, useCallback } from 'react';

export interface AtelierLensModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc?: string;
  fallbackImageSrc?: string;
  title?: string;
  subtitle?: string;
  caption?: string;
}

export const AtelierLensModal: React.FC<AtelierLensModalProps> = ({
  isOpen,
  onClose,
  imageSrc = '/images/home/everthread-textile-folds-01.webp',
  fallbackImageSrc = '/images/home/everthread-hero-01.webp',
  title = 'Living Weave Detail',
  subtitle = 'Hand-spun Mulberry Silk & Structured Cashmere',
  caption = 'A closer look at the weave. High-resolution study of the raw silk fibers and structured weft geometry.'
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const glassRef = useRef<HTMLDivElement>(null);

  const [currentSrc, setCurrentSrc] = useState<string>(imageSrc);
  const [hasError, setHasError] = useState<boolean>(false);

  // Sync image source if prop changes
  useEffect(() => {
    setCurrentSrc(imageSrc);
    setHasError(false);
  }, [imageSrc]);

  // Handle image load error with graceful fallback
  const handleImageError = useCallback(() => {
    if (!hasError && fallbackImageSrc) {
      setHasError(true);
      setCurrentSrc(fallbackImageSrc);
    }
  }, [hasError, fallbackImageSrc]);

  // Focus trap / initial focus on close button and Escape key listener
  useEffect(() => {
    if (!isOpen) return;

    // Focus close button when modal opens
    const focusTimer = setTimeout(() => {
      closeBtnRef.current?.focus();
    }, 50);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    // Prevent background scrolling while modal is open
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      clearTimeout(focusTimer);
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, onClose]);

  // High-performance pointer tracking for loupe magnification without React state re-renders
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const viewport = viewportRef.current;
    const glass = glassRef.current;
    if (!viewport || !glass) return;

    const rect = viewport.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Constrain position within viewport boundaries
    const clampedX = Math.max(0, Math.min(x, rect.width));
    const clampedY = Math.max(0, Math.min(y, rect.height));

    glass.style.left = `${clampedX}px`;
    glass.style.top = `${clampedY}px`;

    // Mathematical coordinate alignment: 2.2x magnification directly centered under cursor
    const zoom = 2.2;
    const bgX = -(clampedX * zoom - 80);
    const bgY = -(clampedY * zoom - 80);
    glass.style.backgroundSize = `${rect.width * zoom}px ${rect.height * zoom}px`;
    glass.style.backgroundPosition = `${bgX}px ${bgY}px`;
    glass.style.opacity = '1';
  }, []);

  const handleMouseEnter = useCallback(() => {
    if (glassRef.current) {
      glassRef.current.style.opacity = '1';
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (glassRef.current) {
      glassRef.current.style.opacity = '0';
    }
  }, []);

  if (!isOpen) return null;

  return (
    <div
      className="atelier-lens-backdrop"
      data-testid="atelier-lens-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="atelier-lens-title"
        className="atelier-lens-modal"
        data-testid="atelier-lens-dialog"
      >
        {/* Header Bar */}
        <div className="p-3 px-4 bg-cream border-hairline-b d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center gap-2">
            <span
              style={{
                width: 6,
                height: 6,
                backgroundColor: 'var(--color-champagne-thread)',
                transform: 'rotate(45deg)',
                display: 'inline-block'
              }}
            />
            <span className="label-caps text-oxblood">Atelier Fabric Inspection</span>
          </div>

          <button
            ref={closeBtnRef}
            type="button"
            className="btn-outline-editorial py-1 px-3 body-sm d-inline-flex align-items-center gap-1"
            aria-label="Close fabric inspection view"
            data-testid="atelier-lens-close-btn"
            onClick={onClose}
          >
            <span>Close</span>
            <span className="material-symbols-outlined fs-6">close</span>
          </button>
        </div>

        {/* Inspection Viewport with Loupe Glass */}
        <div
          ref={viewportRef}
          className="atelier-lens-viewport position-relative"
          style={{ width: '100%', aspectRatio: '16/10', maxHeight: '58vh' }}
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          data-testid="atelier-lens-viewport"
        >
          <img
            src={currentSrc}
            alt="Living weave macro inspection view"
            className="w-100 h-100 object-fit-cover"
            onError={handleImageError}
            data-testid="atelier-lens-image"
          />

          {/* Desktop Precision Loupe Glass */}
          <div
            ref={glassRef}
            className="atelier-lens-glass"
            data-testid="atelier-lens-glass"
            style={{
              backgroundImage: `url("${currentSrc}")`,
              backgroundSize: '220% 220%'
            }}
          />

          {/* Inspection Mode Indicator Badge */}
          <div
            className="position-absolute top-0 end-0 m-3 px-2 py-1 bg-stone border-hairline label-caps text-muted-editorial d-none d-sm-inline-flex align-items-center gap-1"
            style={{ backgroundColor: 'rgba(254, 249, 240, 0.9)', backdropFilter: 'blur(4px)' }}
          >
            <span className="material-symbols-outlined text-champagne" style={{ fontSize: '0.875rem' }}>
              loupe
            </span>
            <span>2.2× Atelier Magnification</span>
          </div>
        </div>

        {/* Archival Caption Plinth */}
        <div className="p-3 px-4 bg-canvas border-hairline-t">
          <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-2">
            <div>
              <h2 id="atelier-lens-title" className="title-md text-oxblood mb-1" data-testid="atelier-lens-title">
                {title}
              </h2>
              <p className="body-sm text-champagne fw-medium mb-1 font-serif">
                {subtitle}
              </p>
              <p className="body-sm text-muted-editorial mb-0" style={{ maxWidth: 640 }}>
                {caption}
              </p>
            </div>

            <div className="text-sm-end text-muted-editorial font-sans" style={{ fontSize: '0.75rem' }}>
              <span className="d-block label-caps text-outline mb-1">Navigation Guidance</span>
              <span className="d-none d-sm-inline">Move cursor to magnify • Press ESC to exit</span>
              <span className="d-inline d-sm-none">Tap Close to return to Atelier Home</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
