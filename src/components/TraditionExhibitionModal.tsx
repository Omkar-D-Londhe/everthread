import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useInRouterContext } from 'react-router-dom';
import { TraditionImageRole, TraditionAssetRecord } from '../types/catalog.ts';
import { getTraditionAssets, getAllTraditionAssets, DIAGRAM_ASSETS, getPlateCaption } from '../data/assetMap.ts';
import { getCatalogueProductById } from '../data/products.ts';
import { ARCHIVE_RELATED_PIECES, TRADITION_INSPIRED_DESIGNS, PROVISIONAL_RELATED_TEXTS } from '../data/archiveRelations.ts';
import { useDialogFocus } from '../hooks/useDialogFocus.ts';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion.ts';
import { useExhibitionOpening } from '../hooks/useExhibitionOpening.ts';
import { WeaveGridIllustration } from './archive/ArchiveIllustrations.tsx';
import { AtelierLensModal } from './AtelierLensModal.tsx';

// Safe link that degrades gracefully to anchor tag if rendered outside router context
const SafeLink: React.FC<{
  to: string;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
  children: React.ReactNode;
}> = ({ to, children, ...props }) => {
  const inRouter = useInRouterContext();
  if (inRouter) {
    return <Link to={to} {...props}>{children}</Link>;
  }
  return <a href={to} {...props}>{children}</a>;
};

// Curatorial related piece component per Decision O-7 / Stage 02 / Stage 07 §7.7
const RelatedPiece: React.FC<{ traditionKey: string; traditionTitle: string; onClose: () => void }> = ({ traditionKey, traditionTitle, onClose }) => {
  const entry = ARCHIVE_RELATED_PIECES[traditionKey];

  // 1. Check direct ET product relationship (e.g. Banarasi -> ET-01, Kota Doria -> ET-04)
  if (entry && entry.kind === 'piece' && entry.productId) {
    const product = getCatalogueProductById(entry.productId);
    const isListed = product && (!('isListed' in product) || product.isListed);
    if (product && isListed) {
      return (
        <div className="p-3 mx-3 mb-3 bg-stone border-hairline" data-testid="exhibition-related-piece">
          <div className="d-flex align-items-center justify-content-between mb-1">
            <span className="label-caps-wide text-oxblood fw-bold" style={{ fontSize: '0.625rem' }}>
              Related Silhouette
            </span>
          </div>
          {entry.text && (
            <p className="body-sm text-espresso mb-2" style={{ fontSize: '0.75rem' }}>
              {entry.text}
            </p>
          )}
          <SafeLink
            to={`/product/${product.slug}`}
            onClick={onClose}
            className="body-sm text-oxblood text-decoration-underline fw-medium d-inline-block"
            style={{ fontSize: '0.75rem' }}
          >
            View related piece →
          </SafeLink>
        </div>
      );
    }
  }

  // 2. Check archival context info notice (e.g. Kashmiri Sozni ground fabric)
  if (entry && entry.kind === 'info') {
    return (
      <div className="p-3 mx-3 mb-3 bg-stone border-hairline" data-testid="exhibition-info-notice">
        <div className="d-flex align-items-center justify-content-between mb-1">
          <span className="label-caps-wide text-oxblood fw-bold" style={{ fontSize: '0.625rem' }}>
            Archival Context
          </span>
          <span className="badge badge-sand text-oxblood" style={{ fontSize: '0.5625rem' }}>
            Reference Only
          </span>
        </div>
        <p className="body-sm text-espresso mb-0" style={{ fontSize: '0.75rem' }}>
          {entry.text}
        </p>
      </div>
    );
  }

  // 3. Check TR inspiration relationship (e.g. paithani-silk -> tr-02, patan-patola -> tr-03, etc.)
  const trProductId = TRADITION_INSPIRED_DESIGNS[traditionKey];
  if (trProductId) {
    const trProduct = getCatalogueProductById(trProductId);
    const isListed = trProduct && (!('isListed' in trProduct) || trProduct.isListed);
    if (trProduct && isListed) {
      return (
        <div className="p-3 mx-3 mb-3 bg-stone border-hairline" data-testid="exhibition-inspired-piece">
          <div className="d-flex align-items-center justify-content-between mb-1">
            <span className="label-caps-wide text-oxblood fw-bold" style={{ fontSize: '0.625rem' }}>
              Repertoire Inspiration
            </span>
            <span className="badge badge-sand text-oxblood" style={{ fontSize: '0.5625rem' }}>
              Living Inheritance
            </span>
          </div>
          <p className="body-sm text-espresso mb-2" style={{ fontSize: '0.75rem' }}>
            {PROVISIONAL_RELATED_TEXTS.traditionalInspiration(traditionTitle)}
          </p>
          <SafeLink
            to={`/product/${trProduct.slug}`}
            onClick={onClose}
            className="body-sm text-oxblood text-decoration-underline fw-medium d-inline-block"
            style={{ fontSize: '0.75rem' }}
          >
            View design inspired by this tradition →
          </SafeLink>
        </div>
      );
    }
  }

  // 4. Default educational record notice
  return (
    <div className="p-3 mx-3 mb-3 bg-stone border-hairline" data-testid="exhibition-curatorial-notice">
      <div className="d-flex align-items-center justify-content-between mb-1">
        <span className="label-caps-wide text-oxblood fw-bold" style={{ fontSize: '0.625rem' }}>
          Curatorial Archival Record
        </span>
        <span className="badge badge-sand text-oxblood" style={{ fontSize: '0.5625rem' }}>
          Educational Document
        </span>
      </div>
      <p className="body-sm text-espresso mb-0" style={{ fontSize: '0.75rem' }}>
        Documented exclusively for textile preservation and technical guild study. Not currently commissioned in the commercial repertoire.
      </p>
    </div>
  );
};

export interface TraditionExhibitionModalProps {
  isOpen: boolean;
  traditionKeyOrSlug: string | null;
  onClose: () => void;
  onSelectTradition?: (keyOrSlug: string) => void;
  initialRole?: TraditionImageRole;
  initialDiagramOpen?: boolean;
}

export const TRADITION_ROLES: TraditionImageRole[] = [
  'model-01',
  'model-02',
  'drape-03',
  'stilllife-04',
  'macro-05',
  'process-06'
];

export const TraditionExhibitionModal: React.FC<TraditionExhibitionModalProps> = ({
  isOpen,
  traditionKeyOrSlug,
  onClose,
  onSelectTradition,
  initialRole = 'model-01',
  initialDiagramOpen = false
}) => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [activeRole, setActiveRole] = useState<TraditionImageRole>(initialRole);
  const [showDiagram, setShowDiagram] = useState<boolean>(initialDiagramOpen);
  const [isThreadDrawn, setIsThreadDrawn] = useState<boolean>(false);
  const [imageError, setImageError] = useState<boolean>(false);
  const [isLensOpen, setIsLensOpen] = useState<boolean>(false);

  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Stage 07 Accessibility & Dialog Focus Trap per F-08
  useDialogFocus({
    isOpen,
    onClose,
    containerRef: modalRef,
    initialFocusRef: closeButtonRef
  });

  // Stage 08 Five-Step Exhibition Opening Choreography per V3-06 / F-04
  const { interruptAndComplete } = useExhibitionOpening({
    isOpen,
    modalRef,
    activeRole
  });

  // Derive current tradition record
  const currentRecord: TraditionAssetRecord | undefined = traditionKeyOrSlug
    ? getTraditionAssets(traditionKeyOrSlug)
    : undefined;

  const allTraditions = getAllTraditionAssets();
  const currentTraditionIndex = currentRecord
    ? allTraditions.findIndex(t => t.traditionKey === currentRecord.traditionKey)
    : -1;

  // Reset role and diagram state when tradition changes or modal opens
  useEffect(() => {
    setActiveRole(initialRole);
    setImageError(false);
    setShowDiagram(initialDiagramOpen);
  }, [traditionKeyOrSlug, initialRole, initialDiagramOpen]);

  // Thread animation trigger
  useEffect(() => {
    if (!isOpen) {
      setIsThreadDrawn(false);
      return;
    }
    if (prefersReducedMotion) {
      setIsThreadDrawn(true);
      return;
    }
    setIsThreadDrawn(false);
    const timer = setTimeout(() => {
      setIsThreadDrawn(true);
    }, 80);
    return () => clearTimeout(timer);
  }, [isOpen, activeRole, traditionKeyOrSlug, prefersReducedMotion]);

  // Focus trap, Escape key handling, and background scroll locking are managed by useDialogFocus (F-08)

  // Navigation: Next / Prev Image role within tradition
  const currentRoleIndex = TRADITION_ROLES.indexOf(activeRole);

  const handlePrevImage = useCallback(() => {
    const nextIdx = (currentRoleIndex - 1 + TRADITION_ROLES.length) % TRADITION_ROLES.length;
    setActiveRole(TRADITION_ROLES[nextIdx]);
    setImageError(false);
  }, [currentRoleIndex]);

  const handleNextImage = useCallback(() => {
    const nextIdx = (currentRoleIndex + 1) % TRADITION_ROLES.length;
    setActiveRole(TRADITION_ROLES[nextIdx]);
    setImageError(false);
  }, [currentRoleIndex]);

  // Navigation: Next / Prev Tradition
  const handlePrevTradition = useCallback(() => {
    if (currentTraditionIndex === -1 || allTraditions.length === 0) return;
    const prevIdx = (currentTraditionIndex - 1 + allTraditions.length) % allTraditions.length;
    const targetTradition = allTraditions[prevIdx];
    if (onSelectTradition) {
      onSelectTradition(targetTradition.traditionKey);
    }
  }, [currentTraditionIndex, allTraditions, onSelectTradition]);

  const handleNextTradition = useCallback(() => {
    if (currentTraditionIndex === -1 || allTraditions.length === 0) return;
    const nextIdx = (currentTraditionIndex + 1) % allTraditions.length;
    const targetTradition = allTraditions[nextIdx];
    if (onSelectTradition) {
      onSelectTradition(targetTradition.traditionKey);
    }
  }, [currentTraditionIndex, allTraditions, onSelectTradition]);

  // Keyboard navigation & Focus trap
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        if (showDiagram) {
          setShowDiagram(false);
        } else {
          onClose();
        }
        return;
      }

      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrevImage();
        return;
      }

      if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNextImage();
        return;
      }

      // Focus trap for Tab key
      if (e.key === 'Tab' && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    },
    [onClose, showDiagram, handlePrevImage, handleNextImage]
  );

  if (!isOpen || !currentRecord) {
    return null;
  }

  const activeItem = currentRecord.roles[activeRole];
  const linkedDiagram = currentRecord.diagramId ? DIAGRAM_ASSETS[currentRecord.diagramId] : undefined;

  return (
    <div
      className="exhibition-backdrop" data-step="cover"
      role="dialog"
      aria-modal="true"
      aria-labelledby="exhibition-title"
      ref={modalRef}
      onKeyDown={handleKeyDown}
      data-testid="tradition-exhibition-modal"
    >
      <div className="exhibition-dialog" data-step="surface">
        {/* Header Bar */}
        <header className="exhibition-header">
          <div className="exhibition-header__meta">
            <div className="d-flex align-items-center gap-2 mb-1">
              <span className={`weave-distinction-badge weave-distinction-${currentRecord.distinction}`}>
                {currentRecord.distinction}
              </span>
              <span className="label-caps text-muted-editorial" style={{ fontSize: '0.6875rem' }}>
                {currentRecord.region}
              </span>
            </div>
            <h2 id="exhibition-title" className="exhibition-title headline-sm mb-0">
              {currentRecord.title}
            </h2>
          </div>

          {/* Center: Tradition switcher controls */}
          <div className="exhibition-tradition-nav d-none d-md-flex align-items-center gap-2">
            <button
              type="button"
              className="btn-icon-editorial"
              onClick={handlePrevTradition}
              aria-label="Previous tradition"
              title="Previous tradition"
              data-testid="prev-tradition-btn"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
            </button>
            <span className="label-caps text-muted-editorial px-2" style={{ fontSize: '0.6875rem' }}>
              Tradition {currentTraditionIndex + 1} of {allTraditions.length}
            </span>
            <button
              type="button"
              className="btn-icon-editorial"
              onClick={handleNextTradition}
              aria-label="Next tradition"
              title="Next tradition"
              data-testid="next-tradition-btn"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </button>
          </div>

          {/* Right: Actions */}
          <div className="d-flex align-items-center gap-2 flex-shrink-0">
            {linkedDiagram && (
              <button
                type="button"
                className={`btn-outline-editorial py-1 px-2 px-sm-3 body-sm d-flex align-items-center gap-1 flex-shrink-0 ${
                  showDiagram ? 'active' : ''
                }`}
                onClick={() => setShowDiagram(!showDiagram)}
                data-testid="toggle-diagram-btn"
                aria-expanded={showDiagram}
                aria-controls="exhibition-diagram-drawer"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M3 21h18M5 21V7l7-4 7 4v14M9 9h6M9 13h6M9 17h6"/>
                </svg>
                <span className="d-none d-sm-inline">
                  {showDiagram ? 'Close Drafting' : 'Technical Drafting'}
                </span>
              </button>
            )}

            <button
              type="button"
              ref={closeButtonRef}
              className="btn-icon-editorial close-btn flex-shrink-0"
              onClick={() => {
                interruptAndComplete();
                onClose();
              }}
              aria-label="Close exhibition folio"
              data-testid="close-exhibition-btn"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </header>

        {/* Main Exhibition Workspace */}
        <div className="exhibition-body">
          {/* Dominant Adaptive Stage Container */}
          <div className="exhibition-stage-container">
            {/* Stage Plinth */}
            <div className="exhibition-stage" data-testid="exhibition-stage">
              {/* Champagne Thread Motif */}
              <svg
                className="exhibition-thread-svg" data-step="thread"
                viewBox="0 0 1000 600"
                preserveAspectRatio="none"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M 40,510 C 220,535 380,515 540,490 S 840,450 960,390"
                  stroke="var(--color-champagne-thread, #B49A70)"
                  strokeWidth="1.05"
                  strokeDasharray="1400"
                  strokeDashoffset={isThreadDrawn ? 0 : 1400}
                  style={{
                    transition: prefersReducedMotion ? 'none' : 'stroke-dashoffset 0.9s cubic-bezier(0.16, 1, 0.3, 1)',
                    opacity: 0.45
                  }}
                />
              </svg>

              {/* Stage Image with contain-fit to preserve landscape models and details */}
              {activeItem && !imageError ? (
                <picture className="exhibition-stage-picture" data-step="main-image">
                  <source
                    srcSet={activeItem.srcSet}
                    sizes="(max-width: 768px) 95vw, (max-width: 1200px) 75vw, 75vw"
                    type="image/webp"
                  />
                  <img
                    src={activeItem.src}
                    alt={getPlateCaption(currentRecord, activeRole)}
                    width={activeItem.width}
                    height={activeItem.height}
                    className="exhibition-stage-image"
                    data-testid="exhibition-active-image"
                    onError={() => setImageError(true)}
                  />
                </picture>
              ) : (
                <div className="exhibition-image-fallback" data-testid="exhibition-image-fallback">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-muted-editorial mb-2" aria-hidden="true">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                    <line x1="3" y1="3" x2="21" y2="21" />
                  </svg>
                  <p className="body-sm text-muted-editorial mb-0">
                    Textile plate unavailable. Please select another view.
                  </p>
                </div>
              )}

              {/* Stage Chevrons for Prev/Next Plate within Tradition */}
              <button
                type="button"
                className="exhibition-chevron-btn chevron-prev"
                onClick={handlePrevImage}
                aria-label="Previous plate"
                data-testid="prev-plate-btn"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
              </button>
              <button
                type="button"
                className="exhibition-chevron-btn chevron-next"
                onClick={handleNextImage}
                aria-label="Next plate"
                data-testid="next-plate-btn"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </button>

              {/* Stage Floating Caption / Role pill with mobile & desktop descriptive text */}
              <div className="exhibition-stage-caption">
                <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-1">
                  <div className="exhibition-stage-caption__meta">
                    <span className="label-caps-wide text-oxblood fw-bold" style={{ fontSize: '0.6875rem' }}>
                      Plate 0{currentRoleIndex + 1} of 0{TRADITION_ROLES.length}
                    </span>
                    <span className="exhibition-stage-caption__label text-oxblood" data-testid="active-role-label">
                      {activeItem?.label || activeRole}
                    </span>
                  </div>

                  <button
                    type="button"
                    className="btn-outline-editorial py-1 px-2 px-sm-3 body-sm d-inline-flex align-items-center gap-1"
                    style={{ fontSize: '0.75rem', backgroundColor: 'rgba(254, 249, 240, 0.95)' }}
                    onClick={() => setIsLensOpen(true)}
                    aria-haspopup="dialog"
                    aria-label={`Inspect ${activeItem?.label || 'textile plate'} with Atelier Lens`}
                    data-testid="inspect-tradition-lens-btn"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <circle cx="11" cy="11" r="8"/>
                      <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                      <line x1="11" y1="8" x2="11" y2="14"/>
                      <line x1="8" y1="11" x2="14" y2="11"/>
                    </svg>
                    <span className="d-none d-sm-inline">Inspect with Atelier Lens (3.5×)</span>
                    <span className="d-inline d-sm-none">Inspect (3.5×)</span>
                  </button>
                </div>
                <p
                  className="exhibition-stage-caption__desc body-sm text-espresso mb-0"
                  data-testid="active-plate-description"
                >
                  {getPlateCaption(currentRecord, activeRole)}
                </p>
              </div>
            </div>
          </div>

          {/* Asymmetrical Supporting Views / Desktop Selector Column */}
          <aside className="exhibition-supporting-col" aria-label="Supporting textile plates" data-step="views">
            <div className="exhibition-supporting-header">
              <div className="d-flex align-items-center justify-content-between mb-1">
                <span className="label-caps text-oxblood fw-bold" style={{ fontSize: '0.6875rem' }}>
                  Complete 6-Plate Suite
                </span>
                <span className="badge badge-sand text-oxblood" style={{ fontSize: '0.5625rem' }}>
                  Archival
                </span>
              </div>
              <span className="body-sm text-espresso fw-medium" style={{ fontSize: '0.75rem' }}>
                Directly inspect all dimensions
              </span>
              {/* Downward Scroll & Inspection Guidance */}
              <div className="exhibition-scroll-guidance d-flex align-items-center gap-1 mt-2 pt-1 border-hairline-t text-espresso" data-testid="exhibition-scroll-guidance">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="text-oxblood">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <polyline points="19 12 12 19 5 12"></polyline>
                </svg>
                <span className="label-caps-wide text-espresso fw-bold" style={{ fontSize: '0.6875rem', letterSpacing: '0.08em' }}>
                  Scroll Down To Examine Plates
                </span>
              </div>
            </div>

            <div className="exhibition-supporting-grid">
              {TRADITION_ROLES.map((roleKey, idx) => {
                const roleItem = currentRecord.roles[roleKey];
                const isActive = roleKey === activeRole;
                if (!roleItem) return null;

                return (
                  <button
                    key={roleKey}
                    type="button"
                    className={`exhibition-thumb-card ${isActive ? 'is-active' : ''}`}
                    onClick={() => {
                      setActiveRole(roleKey);
                      setImageError(false);
                    }}
                    data-testid={`exhibition-thumb-${roleKey}`}
                    aria-label={`Select plate ${idx + 1}: ${roleItem.label}`}
                    aria-pressed={isActive}
                  >
                    <div className="exhibition-thumb-img-wrap">
                      <img
                        src={roleItem.src}
                        alt=""
                        loading="lazy"
                        className="exhibition-thumb-img"
                      />
                    </div>
                    <div className="exhibition-thumb-info">
                      <span className="label-caps text-oxblood fw-semibold" style={{ fontSize: '0.6875rem' }}>
                        Plate 0{idx + 1}
                      </span>
                      <strong className="exhibition-thumb-label text-espresso">{roleItem.label}</strong>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Cultural Archive Lineage & Related Piece per Decision O-7 */}
            <RelatedPiece traditionKey={currentRecord.traditionKey} traditionTitle={currentRecord.title} onClose={onClose} />

            {/* Restrained Architectural SVG Textile Illustration */}
            <div className="p-3 mx-3 mb-3 text-center d-flex flex-column align-items-center" aria-hidden="true">
              <WeaveGridIllustration />
              <span className="label-caps-wide text-muted-editorial mt-1" style={{ fontSize: '0.5625rem' }}>
                Handloom Sett Geometry
              </span>
            </div>
          </aside>

          {/* Contextual Technical Diagram Drawer */}
          {linkedDiagram && showDiagram && (
            <div
              id="exhibition-diagram-drawer"
              className="exhibition-diagram-drawer"
              data-testid="exhibition-diagram-drawer"
            >
              <div className="exhibition-diagram-header">
                <div>
                  <span className="label-caps text-champagne d-block" style={{ fontSize: '0.625rem' }}>
                    Archival Technique Reference
                  </span>
                  <h3 className="headline-sm text-oxblood mb-0" style={{ fontSize: '1.125rem' }}>
                    {linkedDiagram.title}
                  </h3>
                </div>
                <button
                  type="button"
                  className="btn-icon-editorial"
                  onClick={() => setShowDiagram(false)}
                  aria-label="Close technical diagram"
                  data-testid="close-diagram-btn"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>

              <div className="exhibition-diagram-content">
                <div className="diagram-display-box mb-3" style={{ minHeight: 280 }}>
                  <img
                    src={linkedDiagram.svg}
                    alt={`${linkedDiagram.title} technical drafting diagram`}
                    loading="lazy"
                    data-testid="exhibition-diagram-img"
                    onError={(e) => {
                      const target = e.currentTarget;
                      if (!target.src.endsWith('.png')) {
                        target.src = linkedDiagram.fallbackPng;
                      }
                    }}
                  />
                </div>
                <p className="body-sm text-muted-editorial mb-0" data-testid="exhibition-diagram-description">
                  {linkedDiagram.description || 'Archival educational schematic illustrating foundational weave geometry and thread interlacing taxonomy, presented as an academic craft reference for comparative textile analysis.'}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Mobile Horizontal Thumbnail Selector Strip */}
        <div className="exhibition-mobile-strip d-md-none" aria-label="Mobile plate selector" data-step="views">
          <div className="exhibition-mobile-strip__track">
            {TRADITION_ROLES.map((roleKey, idx) => {
              const roleItem = currentRecord.roles[roleKey];
              const isActive = roleKey === activeRole;
              if (!roleItem) return null;

              return (
                <button
                  key={roleKey}
                  type="button"
                  className={`exhibition-mobile-thumb ${isActive ? 'is-active' : ''}`}
                  onClick={() => {
                    setActiveRole(roleKey);
                    setImageError(false);
                  }}
                  data-testid={`mobile-thumb-${roleKey}`}
                  aria-label={`Plate ${idx + 1}: ${roleItem.label}`}
                  aria-pressed={isActive}
                >
                  <img
                    src={roleItem.src}
                    alt=""
                    loading="lazy"
                    className="exhibition-mobile-thumb-img"
                  />
                  <span className="exhibition-mobile-thumb-label">{roleItem.label}</span>
                </button>
              );
            })}
          </div>

          {/* Mobile Related Piece Notice */}
          <div className="px-2 pt-2 border-hairline-t bg-stone">
            <RelatedPiece traditionKey={currentRecord.traditionKey} traditionTitle={currentRecord.title} onClose={onClose} />
          </div>
        </div>

        {/* Footer Bar: Metadata specs */}
        <footer className="exhibition-footer">
          <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 w-100 body-sm">
            <div className="d-flex flex-wrap align-items-center gap-3">
              <div>
                <strong className="text-oxblood fw-medium">Fiber Base:</strong>{' '}
                <span className="text-muted-editorial">{currentRecord.fiber}</span>
              </div>
              <div className="d-none d-sm-block text-champagne">•</div>
              <div>
                <strong className="text-oxblood fw-medium">Loom Sett / Structure:</strong>{' '}
                <span className="text-muted-editorial">{currentRecord.warpDensity}</span>
              </div>
            </div>

            <div className="d-flex align-items-center gap-2 flex-wrap">
              <span className="d-inline-flex align-items-center gap-1 text-espresso" style={{ fontSize: '0.75rem' }}>
                Use <kbd className="editorial-kbd">←</kbd> <kbd className="editorial-kbd">→</kbd> to browse plates
              </span>
              <span className="text-muted-editorial d-none d-sm-inline">•</span>
              <span className="d-inline-flex align-items-center gap-1 text-espresso" style={{ fontSize: '0.75rem' }}>
                <kbd className="editorial-kbd">ESC</kbd> to exit
              </span>
            </div>
          </div>
        </footer>

        {/* Atelier Lens Magnification Modal for Traditional Outfits & Weave Plates */}
        <AtelierLensModal
          isOpen={isLensOpen}
          onClose={() => setIsLensOpen(false)}
          imageSrc={activeItem?.src}
          fallbackImageSrc={activeItem?.src}
          title={`${currentRecord.title} — ${activeItem?.label || 'Textile Specimen'}`}
          subtitle={`${currentRecord.region} • ${currentRecord.fiber}`}
          caption={activeItem?.alt || activeItem?.purpose || currentRecord.structuralProfile}
          zoom={3.5}
        />
      </div>
    </div>
  );
};
