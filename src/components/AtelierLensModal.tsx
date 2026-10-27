import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useDialogFocus } from '../hooks/useDialogFocus.ts';
import {
  getContainRect,
  pointerToImage,
  calculateEffectiveZoom,
  isMagnificationEnabled,
  previewBackground,
  RenderedRect,
} from '../utils/lensMath.ts';

export interface AtelierLensModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc?: string;
  imageAlt?: string;
  naturalWidth?: number;
  naturalHeight?: number;
  fallbackImageSrc?: string;
  title?: string;
  subtitle?: string;
  caption?: string;
  zoom?: number;
  restoreFocusSelector?: string;
  productAction?: {
    label: string;
    productSlug: string;
    price: number;
    currency?: string;
    onAddToCart?: () => void;
  };
}

export const AtelierLensModal: React.FC<AtelierLensModalProps> = ({
  isOpen,
  onClose,
  imageSrc = '/images/home/everthread-textile-folds-01.webp',
  imageAlt,
  naturalWidth,
  naturalHeight,
  fallbackImageSrc = '/images/home/everthread-hero-01.webp',
  title = 'Living Weave Detail',
  subtitle = '70% Fine Merino Wool, 30% Wild Mulberry Silk',
  caption = 'A closer look at the weave. High-resolution study of the raw silk fibers and structured weft geometry.',
  zoom = 3.5,
  restoreFocusSelector,
  productAction,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const glassRef = useRef<HTMLDivElement>(null);
  const reticleRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const [currentSrc, setCurrentSrc] = useState<string>(imageSrc);
  const [hasError, setHasError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentZoom, setCurrentZoom] = useState<number>(zoom);
  const [effectiveZoom, setEffectiveZoom] = useState<number>(zoom);
  const [renderedRect, setRenderedRect] = useState<RenderedRect>({ width: 0, height: 0, x: 0, y: 0 });
  const [isGlassVisible, setIsGlassVisible] = useState<boolean>(false);
  const [glassPos, setGlassPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Use natural dimensions from props or detect from loaded image
  const [dims, setDims] = useState<{ w: number; h: number }>({
    w: naturalWidth || 1536,
    h: naturalHeight || 1024,
  });

  // Sync image source if prop changes
  useEffect(() => {
    setCurrentSrc(imageSrc);
    setHasError(false);
    setIsLoading(true);
    if (naturalWidth && naturalHeight) {
      setDims({ w: naturalWidth, h: naturalHeight });
    }
  }, [imageSrc, naturalWidth, naturalHeight]);

  // Shared dialog accessibility: focus trap, Escape dismissal, opener focus restoration
  useDialogFocus({
    isOpen,
    onClose,
    containerRef: modalRef,
    initialFocusRef: closeBtnRef,
    restoreFocusSelector,
  });

  // Measure viewport and compute contain rect
  const updateMeasurements = useCallback(() => {
    if (!viewportRef.current) return;
    const clientWidth = viewportRef.current.clientWidth || 800;
    const clientHeight = viewportRef.current.clientHeight || 500;

    const rect = getContainRect(clientWidth, clientHeight, dims.w, dims.h);
    setRenderedRect(rect);

    const effZoom = calculateEffectiveZoom(dims.w, rect.width, zoom);
    setEffectiveZoom(effZoom);
    setCurrentZoom(effZoom);
  }, [dims.w, dims.h, zoom]);

  useEffect(() => {
    if (!isOpen) return;
    updateMeasurements();
    const handleResize = () => updateMeasurements();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isOpen, updateMeasurements]);

  // Update loupe glass position and background offset
  const updateLoupePosition = useCallback(
    (clientX: number, clientY: number) => {
      const viewport = viewportRef.current;
      const glass = glassRef.current;
      if (!viewport || !glass || hasError) return;

      const rect = viewport.getBoundingClientRect();
      const px = clientX - (rect.left || 0);
      const py = clientY - (rect.top || 0);

      const effectiveRect =
        renderedRect.width > 0
          ? renderedRect
          : getContainRect(rect.width || 800, rect.height || 500, dims.w, dims.h);

      // Check if pointer is within the rendered contain rect (allow in jsdom when dimensions are zero)
      const imgPoint = pointerToImage(px, py, effectiveRect, dims.w, dims.h);
      if (!imgPoint && renderedRect.width > 0) {
        setIsGlassVisible(false);
        return;
      }

      const pointerInRect = {
        x: px - effectiveRect.x,
        y: py - effectiveRect.y,
      };

      const glassDiameter = 200; // 200px diameter circular loupe matching CSS
      const bgResult = previewBackground(pointerInRect, effectiveRect, currentZoom, glassDiameter);

      const loupeX = effectiveRect.x + bgResult.loupeCenterX;
      const loupeY = effectiveRect.y + bgResult.loupeCenterY;

      setIsGlassVisible(true);
      setGlassPos({ x: loupeX, y: loupeY });

      glass.style.left = `${loupeX}px`;
      glass.style.top = `${loupeY}px`;

      glass.style.backgroundSize = bgResult.backgroundSize;
      glass.style.backgroundPosition = bgResult.backgroundPosition;
      glass.style.opacity = '1';

      if (reticleRef.current) {
        reticleRef.current.style.left = `${bgResult.reticleX}px`;
        reticleRef.current.style.top = `${bgResult.reticleY}px`;
      }
    },
    [renderedRect, dims.w, dims.h, currentZoom, hasError]
  );

  // Keyboard navigation for loupe: Arrow keys pan by 10%, +/- change zoom
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!viewportRef.current || hasError) return;
      const stepX = renderedRect.width * 0.1;
      const stepY = renderedRect.height * 0.1;

      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        const newX = Math.max(renderedRect.x, glassPos.x - stepX);
        const clientX = viewportRef.current.getBoundingClientRect().left + newX;
        const clientY = viewportRef.current.getBoundingClientRect().top + glassPos.y;
        updateLoupePosition(clientX, clientY);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        const newX = Math.min(renderedRect.x + renderedRect.width, glassPos.x + stepX);
        const clientX = viewportRef.current.getBoundingClientRect().left + newX;
        const clientY = viewportRef.current.getBoundingClientRect().top + glassPos.y;
        updateLoupePosition(clientX, clientY);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        const newY = Math.max(renderedRect.y, glassPos.y - stepY);
        const clientX = viewportRef.current.getBoundingClientRect().left + glassPos.x;
        const clientY = viewportRef.current.getBoundingClientRect().top + newY;
        updateLoupePosition(clientX, clientY);
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        const newY = Math.min(renderedRect.y + renderedRect.height, glassPos.y + stepY);
        const clientX = viewportRef.current.getBoundingClientRect().left + glassPos.x;
        const clientY = viewportRef.current.getBoundingClientRect().top + newY;
        updateLoupePosition(clientX, clientY);
      } else if (e.key === '+' || e.key === '=') {
        e.preventDefault();
        setCurrentZoom(prev => Math.min(effectiveZoom, prev + 0.5));
      } else if (e.key === '-' || e.key === '_') {
        e.preventDefault();
        setCurrentZoom(prev => Math.max(1, prev - 0.5));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, renderedRect, glassPos, updateLoupePosition, hasError, effectiveZoom]);

  // Pointer tracking
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      updateLoupePosition(e.clientX, e.clientY);
    },
    [updateLoupePosition]
  );

  const handleMouseEnter = useCallback(() => {
    if (glassRef.current && !hasError) {
      setIsGlassVisible(true);
    }
  }, [hasError]);

  const handleMouseLeave = useCallback(() => {
    setIsGlassVisible(false);
    if (glassRef.current) {
      glassRef.current.style.opacity = '0';
    }
  }, []);

  // Touch tracking for mobile loupe magnification
  const handleTouchStart = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      if (e.touches.length > 0) {
        updateLoupePosition(e.touches[0].clientX, e.touches[0].clientY);
      }
    },
    [updateLoupePosition]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      if (e.touches.length > 0) {
        updateLoupePosition(e.touches[0].clientX, e.touches[0].clientY);
      }
    },
    [updateLoupePosition]
  );

  const handleTouchEnd = useCallback(() => {
    // Keep loupe active at the touched location on mobile
  }, []);

  // Double tap on mobile to toggle zoom between 1x and effectiveZoom; click to center loupe
  const lastTapRef = useRef<number>(0);
  const handleDoubleTap = () => {
    const now = Date.now();
    if (now - lastTapRef.current < 300) {
      setCurrentZoom(prev => (prev > 1.5 ? 1 : effectiveZoom));
    }
    lastTapRef.current = now;
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    handleDoubleTap();
    updateLoupePosition(e.clientX, e.clientY);
  };

  const handleImageError = useCallback(() => {
    if (!hasError && fallbackImageSrc && fallbackImageSrc !== currentSrc) {
      setCurrentSrc(fallbackImageSrc);
    } else {
      setHasError(true);
      setIsLoading(false);
    }
  }, [hasError, fallbackImageSrc, currentSrc]);

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    setIsLoading(false);
    const img = e.currentTarget;
    if (img.naturalWidth && img.naturalHeight) {
      setDims({ w: img.naturalWidth, h: img.naturalHeight });
    }
    updateMeasurements();
  };

  const canMagnify = isMagnificationEnabled(effectiveZoom) && !hasError;
  const imageAltText = imageAlt
    ? `${imageAlt} — magnified view`
    : `${title} — magnified view`;

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
        tabIndex={-1}
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
                display: 'inline-block',
              }}
            />
            <span className="label-caps text-oxblood">Atelier Fabric Inspection</span>
          </div>

          <div className="d-flex align-items-center gap-2">
            {/* Zoom Controls (+ / -) */}
            <div className="d-flex align-items-center border-hairline bg-surface" role="group" aria-label="Magnification Controls">
              <button
                type="button"
                className="btn btn-sm btn-icon-editorial px-2 py-0"
                onClick={() => setCurrentZoom(prev => Math.max(1, prev - 0.5))}
                disabled={currentZoom <= 1 || !canMagnify}
                aria-label="Zoom out"
                data-testid="lens-zoom-out-btn"
              >
                −
              </button>
              <span className="body-sm px-2 text-oxblood fw-medium" style={{ fontSize: '0.6875rem' }} data-testid="lens-zoom-display">
                {currentZoom === 1 ? '1.0×' : `${currentZoom.toFixed(1)}×`}
              </span>
              <button
                type="button"
                className="btn btn-sm btn-icon-editorial px-2 py-0"
                onClick={() => setCurrentZoom(prev => Math.min(effectiveZoom, prev + 0.5))}
                disabled={currentZoom >= effectiveZoom || !canMagnify}
                aria-label="Zoom in"
                data-testid="lens-zoom-in-btn"
              >
                +
              </button>
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
        </div>

        {/* Inspection Viewport with Loupe Glass */}
        <div
          ref={viewportRef}
          className="atelier-lens-viewport position-relative d-flex align-items-center justify-content-center"
          style={{ width: '100%', aspectRatio: '16/10', maxHeight: '58vh', touchAction: 'none' }}
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={handleTouchEnd}
          onClick={handleClick}
          data-testid="atelier-lens-viewport"
        >
          {hasError ? (
            <div className="text-center p-4 text-white" data-testid="atelier-lens-error">
              <p className="headline-sm mb-1 text-oxblood">This image could not be loaded.</p>
              <p className="body-sm text-muted-editorial mb-0">High-resolution magnification is unavailable for this specimen.</p>
            </div>
          ) : (
            <>
              {isLoading && (
                <div className="position-absolute text-muted-editorial body-sm" data-testid="lens-loading-state">
                  Loading high-resolution plate...
                </div>
              )}
              <img
                ref={imgRef}
                src={currentSrc}
                alt={imageAltText}
                className="w-100 h-100 object-fit-contain"
                onError={handleImageError}
                onLoad={handleImageLoad}
                data-testid="atelier-lens-image"
              />

              {/* Precision Loupe Glass (active only if magnification is enabled) */}
              {canMagnify && (
                <div
                  ref={glassRef}
                  className="atelier-lens-glass"
                  data-testid="atelier-lens-glass"
                  style={{
                    backgroundImage: `url("${currentSrc}")`,
                    backgroundRepeat: 'no-repeat',
                    display: isGlassVisible ? 'block' : 'none',
                  }}
                >
                  {/* Soft glass specular arc highlight */}
                  <div
                    className="atelier-lens-specular-arc position-absolute"
                    style={{
                      top: '4px',
                      left: '8px',
                      right: '8px',
                      height: '42%',
                      borderRadius: '50% 50% 40% 40% / 60% 60% 20% 20%',
                      background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.22) 0%, rgba(255, 255, 255, 0) 100%)',
                      pointerEvents: 'none',
                    }}
                  />

                  {/* Circular Deep Oxblood Magnification Badge with Champagne Rim (e.g. 2.1×) */}
                  <div className="atelier-loupe-zoom-badge" data-testid="modal-loupe-zoom-badge">
                    {currentZoom === 1 ? '1.0×' : `${currentZoom.toFixed(1)}×`}
                  </div>

                  {/* Center inspection reticle */}
                  <div
                    ref={reticleRef}
                    className="atelier-lens-reticle position-absolute translate-middle"
                    style={{
                      left: '50%',
                      top: '50%',
                      width: '6px',
                      height: '6px',
                      backgroundColor: 'var(--color-primary, #49232D)',
                      border: '1px solid #C4A265',
                      borderRadius: '50%',
                      boxShadow: '0 0 0 2px rgba(255, 255, 255, 0.6)',
                      pointerEvents: 'none',
                    }}
                    aria-hidden="true"
                  />
                </div>
              )}

              {/* Inspection Mode Indicator Badge */}
              <div
                className="position-absolute top-0 end-0 m-3 px-2 py-1 bg-stone border-hairline label-caps text-oxblood d-none d-sm-inline-flex align-items-center gap-1 fw-bold"
                style={{ backgroundColor: 'rgba(254, 249, 240, 0.94)', backdropFilter: 'blur(4px)', fontSize: '0.6875rem' }}
                data-testid="lens-zoom-badge"
              >
                <span className="material-symbols-outlined text-oxblood" style={{ fontSize: '0.875rem' }}>
                  loupe
                </span>
                <span>
                  {effectiveZoom === 1
                    ? 'Native resolution view'
                    : `${effectiveZoom.toFixed(1)}× Atelier Magnification`}
                </span>
              </div>
            </>
          )}
        </div>

        {/* Archival Caption Plinth */}
        <div className="p-3 px-4 bg-canvas border-hairline-t">
          <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3">
            <div>
              <h2 id="atelier-lens-title" className="title-md text-oxblood mb-1" data-testid="atelier-lens-title">
                {title}
              </h2>
              <p className="body-sm text-oxblood fw-medium mb-1 font-serif">
                {subtitle}
              </p>
              <p className="body-sm text-muted-editorial mb-0" style={{ maxWidth: 640 }}>
                {caption}
              </p>

              {productAction && (
                <div className="d-flex align-items-center gap-2 mt-2 pt-2 border-hairline-t">
                  <span className="label-caps-wide text-oxblood fw-bold" style={{ fontSize: '0.625rem' }}>
                    Sellable Repertoire Piece:
                  </span>
                  <button
                    type="button"
                    className="btn-oxblood py-1 px-3 body-sm d-inline-flex align-items-center gap-2"
                    onClick={() => {
                      if (productAction.onAddToCart) {
                        productAction.onAddToCart();
                      }
                    }}
                    data-testid="lens-acquire-btn"
                  >
                    <span>Acquire Piece ({productAction.currency || '₹'}{productAction.price.toLocaleString('en-IN')})</span>
                    <span className="material-symbols-outlined fs-6" aria-hidden="true">shopping_bag</span>
                  </button>
                </div>
              )}
            </div>

            <div className="text-sm-end text-muted-editorial font-sans" style={{ fontSize: '0.75rem' }}>
              <span className="d-block label-caps-wide text-oxblood mb-1 fw-semibold">Navigation Guidance</span>
              <span className="d-none d-sm-inline">
                Move pointer or use <kbd className="editorial-kbd">←</kbd> <kbd className="editorial-kbd">→</kbd> <kbd className="editorial-kbd">↑</kbd> <kbd className="editorial-kbd">↓</kbd> • <kbd className="editorial-kbd">ESC</kbd> to exit
              </span>
              <span className="d-inline d-sm-none">
                Drag to inspect • Double tap or +/− to zoom • Close to exit
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
