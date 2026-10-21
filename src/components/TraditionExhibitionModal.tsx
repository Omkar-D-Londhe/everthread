import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useInRouterContext } from 'react-router-dom';
import { TraditionImageRole, TraditionAssetRecord } from '../types/catalog.ts';
import { getTraditionAssets, getAllTraditionAssets, DIAGRAM_ASSETS, PRODUCT_ASSET_MAP } from '../data/assetMap.ts';
import { PRODUCTS } from '../data/products.ts';
import { useOptionalCart } from '../context/CartContext.tsx';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion.ts';
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

// Verified cultural lineage mapping from Archive Traditions to EverThread Repertoire Silhouettes
const TRADITION_PRODUCT_MAP: Record<string, string> = {
  'banarasi-brocade': 'et-01',   // Oxblood Wool-Silk Signature Coat-Dress (Kadwa Brocade Facing)
  'chanderi': 'et-04',           // Angrakha Asymmetric Sheer Tunic (Chanderi Handloom Weave)
  'kota-doria': 'et-04',         // Angrakha Asymmetric Sheer Tunic (Chanderi & Kota Khat Weave)
  'pashmina': 'et-07',           // High-Altitude Hand-Spun Pashmina Stole (Changthangi Pashmina)
  'kashmiri-sozni': 'et-07',     // High-Altitude Hand-Spun Pashmina Stole (Changthangi Pashmina)
  'muga-silk': 'et-02',          // Ivory Raw Tussar Cocoon Trench (Assam Wild Silk Matka)
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
  const cart = useOptionalCart();
  const [activeRole, setActiveRole] = useState<TraditionImageRole>(initialRole);
  const [showDiagram, setShowDiagram] = useState<boolean>(initialDiagramOpen);
  const [isThreadDrawn, setIsThreadDrawn] = useState<boolean>(false);
  const [imageError, setImageError] = useState<boolean>(false);
  const [bagToast, setBagToast] = useState<string | null>(null);
  const [isLensOpen, setIsLensOpen] = useState<boolean>(false);

  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const lastActiveElementRef = useRef<HTMLElement | null>(null);

  // Derive current tradition record
  const currentRecord: TraditionAssetRecord | undefined = traditionKeyOrSlug
    ? getTraditionAssets(traditionKeyOrSlug)
    : undefined;

  // Resolve verified associated purchasable product for cultural archive commerce bridge
  const associatedProductId = currentRecord ? TRADITION_PRODUCT_MAP[currentRecord.traditionKey] : undefined;
  const associatedProduct = associatedProductId ? PRODUCTS.find(p => p.id === associatedProductId) : undefined;

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

  // Save last active element and focus close button on open; restore focus on close
  useEffect(() => {
    if (isOpen) {
      lastActiveElementRef.current = document.activeElement as HTMLElement | null;
      const timer = setTimeout(() => {
        closeButtonRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    } else {
      if (lastActiveElementRef.current && typeof lastActiveElementRef.current.focus === 'function') {
        lastActiveElementRef.current.focus();
      }
    }
  }, [isOpen]);

  // Body and HTML scroll lock
  useEffect(() => {
    if (!isOpen) return;
    const originalBodyOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalBodyOverflow;
      document.documentElement.style.overflow = originalHtmlOverflow;
    };
  }, [isOpen]);

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
      className="exhibition-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="exhibition-title"
      ref={modalRef}
      onKeyDown={handleKeyDown}
      data-testid="tradition-exhibition-modal"
    >
      <div className="exhibition-dialog">
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
              onClick={onClose}
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
                className="exhibition-thread-svg"
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
                <picture className="exhibition-stage-picture">
                  <source
                    srcSet={activeItem.srcSet}
                    sizes="(max-width: 768px) 95vw, (max-width: 1200px) 75vw, 75vw"
                    type="image/webp"
                  />
                  <img
                    src={activeItem.src}
                    alt={activeItem.alt}
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
                  {activeItem?.alt || activeItem?.purpose || 'Archival textile documentation plate.'}
                </p>
              </div>
            </div>
          </div>

          {/* Asymmetrical Supporting Views / Desktop Selector Column */}
          <aside className="exhibition-supporting-col" aria-label="Supporting textile plates">
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

            {/* Cultural Archive Commerce Bridge: Associated Repertoire Silhouette */}
            {associatedProduct ? (
              <div className="p-3 mx-3 mb-3 bg-stone border-hairline" data-testid="exhibition-commerce-card">
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <span className="label-caps-wide text-oxblood fw-bold" style={{ fontSize: '0.625rem' }}>
                    Repertoire Lineage
                  </span>
                  <span className="badge badge-sand text-oxblood" style={{ fontSize: '0.5625rem' }}>
                    {associatedProduct.category}
                  </span>
                </div>
                <div className="d-flex gap-2 align-items-center mb-2">
                  <img
                    src={PRODUCT_ASSET_MAP[associatedProduct.id]?.primary.src || associatedProduct.image}
                    alt={associatedProduct.title}
                    width={48}
                    height={60}
                    className="object-fit-cover border-hairline flex-shrink-0"
                  />
                  <div className="min-w-0">
                    <SafeLink
                      to={`/product/${associatedProduct.slug}`}
                      onClick={onClose}
                      className="body-sm fw-bold text-oxblood text-decoration-none d-block text-truncate"
                      style={{ fontSize: '0.8125rem' }}
                    >
                      {associatedProduct.title}
                    </SafeLink>
                    <span className="body-sm text-espresso fw-medium" style={{ fontSize: '0.75rem' }}>
                      ₹{associatedProduct.price.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
                <div className="d-flex gap-2">
                  <SafeLink
                    to={`/product/${associatedProduct.slug}`}
                    onClick={onClose}
                    className="btn-outline-editorial py-1 px-2 body-sm flex-grow-1 text-center text-decoration-none"
                    style={{ fontSize: '0.6875rem' }}
                  >
                    Examine
                  </SafeLink>
                  <button
                    type="button"
                    className="btn-oxblood py-1 px-2 body-sm flex-grow-1"
                    style={{ fontSize: '0.6875rem' }}
                    onClick={() => {
                      cart?.addToBag({
                        productId: associatedProduct.id,
                        size: associatedProduct.sizes[0] || 'Standard',
                        color: associatedProduct.colors[0]?.name || 'Signature',
                        quantity: 1
                      });
                      setBagToast(associatedProduct.title);
                      setTimeout(() => setBagToast(null), 4000);
                    }}
                    data-testid="archive-acquire-btn"
                  >
                    Acquire to Bag
                  </button>
                </div>
              </div>
            ) : (
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
            )}

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
        <div className="exhibition-mobile-strip d-md-none" aria-label="Mobile plate selector">
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
        </div>

        {/* Toast Notification for Archive-to-Bag Acquisition */}
        {bagToast && (
          <div
            className="position-absolute bottom-0 start-50 translate-middle-x mb-5 p-3 px-4 bg-oxblood text-white border-hairline shadow-lg d-flex align-items-center gap-3 z-3 body-sm"
            style={{ borderRadius: 2 }}
            data-testid="archive-bag-toast"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-champagne-glow" aria-hidden="true">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
            <span>Piece added to your bespoke bag: <strong>{bagToast}</strong></span>
            <SafeLink to="/bag" onClick={onClose} className="text-champagne-glow fw-bold text-decoration-underline ms-2">
              View Bag →
            </SafeLink>
          </div>
        )}

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
          productAction={associatedProduct ? {
            label: associatedProduct.title,
            productSlug: associatedProduct.slug,
            price: associatedProduct.price,
            currency: associatedProduct.currency,
            onAddToCart: () => {
              cart?.addToBag({
                productId: associatedProduct.id,
                size: associatedProduct.sizes[0] || 'Standard',
                color: associatedProduct.colors[0]?.name || 'Signature',
                quantity: 1
              });
              setBagToast(associatedProduct.title);
              setTimeout(() => setBagToast(null), 4000);
              setIsLensOpen(false);
            }
          } : undefined}
        />
      </div>
    </div>
  );
};
