import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  getContainRect,
  pointerToImage,
  calculateEffectiveZoom,
  isMagnificationEnabled,
  previewBackground,
  RenderedRect,
} from '../utils/lensMath.ts';

export interface StageImageRecord {
  src: string;
  width?: number;
  height?: number;
  alt?: string;
  srcSet?: string;
  sizes?: string;
  label?: string;
}

export interface ProductImageStageProps {
  image: StageImageRecord;
  prevImage?: StageImageRecord | null;
  edition?: string;
  onAnimationEnd?: () => void;
  onInspectClick: () => void;
}

export const ProductImageStage: React.FC<ProductImageStageProps> = ({
  image,
  prevImage,
  edition,
  onAnimationEnd,
  onInspectClick,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rafIdRef = useRef<number | null>(null);

  const [isHoverPreviewActive, setIsHoverPreviewActive] = useState<boolean>(false);
  const [crosshairPos, setCrosshairPos] = useState<{ x: number; y: number } | null>(null);
  const [reticlePos, setReticlePos] = useState<{ x: number; y: number }>({ x: 120, y: 120 });
  const [previewStyle, setPreviewStyle] = useState<React.CSSProperties>({});
  const [effectiveZoom, setEffectiveZoom] = useState<number>(3.5);
  const [canMagnify, setCanMagnify] = useState<boolean>(true);
  const [renderedRect, setRenderedRect] = useState<RenderedRect>({ width: 0, height: 0, x: 0, y: 0 });
  const [imageError, setImageError] = useState<boolean>(false);

  // Natural dimensions
  const naturalW = image.width || 1536;
  const naturalH = image.height || 1024;
  const aspectRatio = naturalW / naturalH;

  // Measure container and compute contain rect and effective zoom
  const updateMeasurements = useCallback(() => {
    if (!containerRef.current) return;
    const { clientWidth, clientHeight } = containerRef.current;
    if (clientWidth === 0 || clientHeight === 0) return;

    const rect = getContainRect(clientWidth, clientHeight, naturalW, naturalH);
    setRenderedRect(rect);

    const zoom = calculateEffectiveZoom(naturalW, rect.width, 3.5);
    setEffectiveZoom(zoom);
    setCanMagnify(isMagnificationEnabled(zoom));
  }, [naturalW, naturalH]);

  // Synchronize and re-measure whenever image source changes (thumbnail switch)
  useEffect(() => {
    setImageError(false);
    updateMeasurements();
  }, [image.src, updateMeasurements]);

  useEffect(() => {
    updateMeasurements();
    const handleResize = () => updateMeasurements();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [updateMeasurements]);

  // Clean up rAF on unmount
  useEffect(() => {
    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, []);

  // Handle pointer tracking for desktop hover preview
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement> | React.MouseEvent<HTMLDivElement>) => {
    // Check desktop pointer fine media query
    const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const isDesktopWidth = window.innerWidth >= 1024;

    if (!isFinePointer || !isDesktopWidth || !canMagnify || imageError) {
      if (isHoverPreviewActive) setIsHoverPreviewActive(false);
      return;
    }

    if (!containerRef.current) return;
    const clientRect = containerRef.current.getBoundingClientRect();
    const px = e.clientX - clientRect.left;
    const py = e.clientY - clientRect.top;

    const currentRect =
      renderedRect.width > 0
        ? renderedRect
        : getContainRect(clientRect.width, clientRect.height, naturalW, naturalH);

    // Map pointer to image point
    const imgPoint = pointerToImage(px, py, currentRect, naturalW, naturalH);
    if (!imgPoint) {
      // Pointer is in pillarbox or letterbox padding
      setIsHoverPreviewActive(false);
      setCrosshairPos(null);
      return;
    }

    const pointerInRect = {
      x: px - currentRect.x,
      y: py - currentRect.y,
    };

    const previewSize = 240; // 240px precision circular magnifying loupe matching CSS
    const bgResult = previewBackground(pointerInRect, currentRect, effectiveZoom, previewSize);

    setIsHoverPreviewActive(true);
    setCrosshairPos({
      x: currentRect.x + bgResult.loupeCenterX,
      y: currentRect.y + bgResult.loupeCenterY,
    });

    setReticlePos({ x: bgResult.reticleX, y: bgResult.reticleY });

    setPreviewStyle({
      backgroundImage: `url("${image.src}")`,
      backgroundSize: bgResult.backgroundSize,
      backgroundPosition: bgResult.backgroundPosition,
      backgroundRepeat: 'no-repeat',
    });
  };

  const handlePointerLeave = () => {
    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current);
    }
    setIsHoverPreviewActive(false);
    setCrosshairPos(null);
  };

  return (
    <div className="product-stage-root position-relative w-100">
      {/* Aspect-constrained responsive containment stage */}
      <div
        ref={containerRef}
        className="product-stage-container position-relative overflow-hidden border-hairline d-flex align-items-center justify-content-center"
        style={{
          aspectRatio: aspectRatio.toString(),
          maxHeight: 'min(80vh, 900px)',
          width: '100%',
          backgroundColor: 'var(--color-surface, #FEF9F0)',
          cursor: canMagnify ? 'crosshair' : 'default',
        }}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        onMouseMove={handlePointerMove}
        onMouseLeave={handlePointerLeave}
        onClick={() => {
          // On mobile or touch devices, tapping the stage opens the modal
          const isCoarsePointer = window.matchMedia('(hover: none) or (pointer: coarse)').matches;
          if (isCoarsePointer) {
            onInspectClick();
          }
        }}
        data-testid="gallery-main-container"
      >
        {imageError ? (
          <div className="text-center p-4 text-muted-editorial" data-testid="stage-image-error">
            <p className="body-sm mb-1 text-oxblood">This image could not be loaded.</p>
            <p className="body-sm mb-0" style={{ fontSize: '0.75rem' }}>Textile specimen plate temporarily unavailable.</p>
          </div>
        ) : (
          <>
            {/* Outgoing previous image layer during cross-dissolve */}
            {prevImage && (
              <img
                src={prevImage.src}
                srcSet={prevImage.srcSet}
                sizes={prevImage.sizes || '(max-width: 768px) 100vw, 50vw'}
                alt=""
                width={prevImage.width || 1536}
                height={prevImage.height || 1024}
                className="gallery-main-img gallery-main-img--prev gallery-main-img--contain"
                aria-hidden="true"
              />
            )}

            {/* Active current image layer */}
            <img
              src={image.src}
              srcSet={image.srcSet}
              sizes={image.sizes || '(max-width: 768px) 100vw, 50vw'}
              alt={image.alt || 'Atelier Product Plate'}
              width={naturalW}
              height={naturalH}
              className={`gallery-main-img gallery-main-img--active gallery-main-img--contain ${
                prevImage ? 'gallery-cross-dissolve' : ''
              }`}
              data-testid="gallery-main-image"
              loading="eager"
              onAnimationEnd={onAnimationEnd}
              onError={() => setImageError(true)}
              onLoad={updateMeasurements}
            />
          </>
        )}

        {/* Allocation Status Badge */}
        {edition && <span className="edition-badge">{edition}</span>}

        {/* Active Angle / View Tag */}
        {image.label && (
          <span
            className="position-absolute top-0 start-0 m-3 py-1 px-2 label-caps"
            style={{ backgroundColor: 'rgba(254, 249, 240, 0.9)', color: 'var(--color-primary)' }}
            data-testid="active-image-label"
          >
            {image.label}
          </span>
        )}

        {/* Precise Circular Magnified Loupe Viewport (Bug 2 Fix - Inspired by Editorial Bezel Loupe) */}
        {isHoverPreviewActive && crosshairPos && (
          <div
            className="product-stage-hover-preview position-absolute d-none d-lg-block"
            style={{
              left: `${crosshairPos.x}px`,
              top: `${crosshairPos.y}px`,
              width: '240px',
              height: '240px',
              transform: 'translate(-50%, -50%)',
              borderRadius: '50%',
              border: '2.5px solid #C4A265',
              boxShadow: '0 0 0 1px rgba(73, 35, 45, 0.2), inset 0 1px 3px rgba(255, 255, 255, 0.45), inset 0 -2px 6px rgba(48, 35, 31, 0.25), 0 16px 36px rgba(48, 35, 31, 0.4)',
              backgroundColor: 'var(--color-surface, #FEF9F0)',
              pointerEvents: 'none',
              zIndex: 30,
              overflow: 'visible',
              transition: 'opacity 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
              ...previewStyle,
            }}
            data-testid="stage-hover-preview-pane"
            aria-hidden="true"
          >
            {/* Soft glass specular arc highlight */}
            <div
              className="position-absolute"
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
            <div
              className="atelier-loupe-zoom-badge"
              data-testid="loupe-zoom-badge"
            >
              {effectiveZoom === 1 ? '1.0×' : `${effectiveZoom.toFixed(1)}×`}
            </div>

            {/* Center inspection reticle */}
            <div
              className="product-stage-crosshair position-absolute translate-middle"
              style={{
                left: `${reticlePos.x}px`,
                top: `${reticlePos.y}px`,
                width: '6px',
                height: '6px',
                backgroundColor: 'var(--color-primary, #49232D)',
                border: '1px solid #C4A265',
                borderRadius: '50%',
                boxShadow: '0 0 0 2px rgba(255, 255, 255, 0.6)',
                pointerEvents: 'none',
              }}
              data-testid="stage-hover-crosshair"
              aria-hidden="true"
            />

            {/* Editorial Weave Detail Callout Header */}
            {crosshairPos.x < (renderedRect.width || 800) - 180 && crosshairPos.y > 60 && (
              <div
                className="position-absolute d-none d-xl-flex flex-column align-items-start"
                style={{
                  top: '24px',
                  left: '190px',
                  whiteSpace: 'nowrap',
                  pointerEvents: 'none',
                  zIndex: 10,
                }}
              >
                {/* Diagonal & horizontal connector leader line */}
                <svg width="60" height="24" viewBox="0 0 60 24" fill="none" style={{ position: 'absolute', left: '-58px', top: '10px' }} aria-hidden="true">
                  <polyline points="2,20 28,4 58,4" stroke="#B49A70" strokeWidth="1" opacity="0.85" />
                  <circle cx="2" cy="20" r="1.5" fill="#49232D" />
                </svg>
                <span
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.5625rem',
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: 'var(--color-primary, #49232D)',
                    fontWeight: 600,
                  }}
                >
                  Weave Detail
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.5rem',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: 'var(--color-muted-editorial, #7A6963)',
                  }}
                >
                  {image.label || 'Textile Architecture'}
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Loupe Archival Caption & Manual Atelier Lens Modal Trigger */}
      <div className="pt-2 d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-2">
        <p className="body-sm text-muted-editorial fst-italic mb-0" style={{ fontSize: '0.75rem' }}>
          * Natural atelier light capture. Hand-woven specimen documentation.
        </p>
        <button
          type="button"
          className="btn-outline-editorial py-1 px-3 body-sm d-inline-flex align-items-center gap-2"
          onClick={onInspectClick}
          data-testid="inspect-fabric-lens-btn"
          aria-haspopup="dialog"
          style={{ fontSize: '0.75rem' }}
          disabled={!canMagnify}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            <line x1="11" y1="8" x2="11" y2="14"/>
            <line x1="8" y1="11" x2="14" y2="11"/>
          </svg>
          <span>
            {canMagnify
              ? `Inspect with Atelier Lens (${effectiveZoom === 1 ? 'Native' : `${effectiveZoom.toFixed(1)}×`})`
              : 'Full-resolution view'}
          </span>
        </button>
      </div>
    </div>
  );
};
