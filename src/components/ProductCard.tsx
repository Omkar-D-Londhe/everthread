import React from 'react';
import { Link } from 'react-router-dom';
import { CatalogueProduct } from '../types/catalog.ts';
import { PRODUCT_ASSET_MAP, TRADITIONAL_PRODUCT_ASSET_MAP } from '../data/assetMap.ts';
import { useSaved } from '../context/SavedContext.tsx';

interface ProductCardProps {
  product: CatalogueProduct;
  index?: number;
  variant?: 'standard' | 'flagship';
  isFlagship?: boolean;
  priority?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  index,
  variant = 'standard',
  isFlagship = false,
  priority = false
}) => {
  const effectiveVariant = isFlagship ? 'flagship' : variant;
  const { isSaved, toggleSaved } = useSaved();
  const saved = isSaved(product.id);
  const assetRecord = PRODUCT_ASSET_MAP[product.id] || TRADITIONAL_PRODUCT_ASSET_MAP[product.id];
  const primaryImage = assetRecord?.primary;

  const handleToggleSave = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    toggleSaved(product.id);
  };

  const handleKeyDownSave = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.stopPropagation();
    }
  };

  // Prominent Editorial Flagship Plinth Variant
  if (effectiveVariant === 'flagship') {
    return (
      <article 
        className="garment-tile plinth-card plinth-reveal flagship-card w-100 d-flex flex-column flex-lg-row align-items-stretch" 
        aria-labelledby={`product-heading-${product.id}`}
        data-testid={`product-card-${product.id}`}
        data-product-id={product.id}
        style={index !== undefined ? { animationDelay: `${Number((Math.min(index, 6) * 0.05).toFixed(2))}s` } : undefined}
      >
        {/* Large Flagship Image Plinth */}
        <div className="garment-img-wrap position-relative flex-shrink-0">
          <Link 
            to={`/product/${product.slug}`} 
            tabIndex={-1} 
            aria-hidden="true"
            className="d-block w-100 h-100"
          >
            <img
              src={primaryImage?.src || product.image}
              srcSet={primaryImage?.srcSet}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 480px"
              alt={product.imageAlt || product.title}
              loading={priority ? 'eager' : 'lazy'}
              width={primaryImage?.width || 800}
              height={primaryImage?.height || 1200}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </Link>

          {/* Edition Badge */}
          {'edition' in product && product.edition && (
            <span className="edition-badge">
              {product.edition}
            </span>
          )}

          {/* Save Piece Action Bookmark Button */}
          <button
            type="button"
            className={`bookmark-action-btn ${saved ? 'active' : ''}`}
            onClick={handleToggleSave}
            onKeyDown={handleKeyDownSave}
            aria-label={saved ? `Remove ${product.title} from Saved Pieces` : `Save ${product.title} to Saved Pieces`}
            aria-pressed={saved}
            data-testid={`save-btn-${product.id}`}
            title={saved ? 'Remove from Saved Pieces' : 'Save to Saved Pieces'}
          >
            <span className="material-symbols-outlined fs-5" aria-hidden="true">
              {saved ? 'bookmark' : 'bookmark_border'}
            </span>
          </button>
        </div>

        {/* Flagship Editorial Content */}
        <div className="d-flex flex-column flex-grow-1 p-4 p-xl-5 justify-content-between">
          <div>
            <div className="d-inline-flex align-items-center gap-2 mb-3">
              <span style={{ width: 24, height: 1, backgroundColor: 'var(--color-champagne-thread)' }} />
              <span className="label-caps text-champagne">Flagship Silhouette • Permanent Capsule</span>
            </div>

            {/* Colorway Swatch Dots */}
            <div 
              className="d-flex align-items-center gap-1 mb-3" 
              aria-label={`Available colourways: ${product.colors.map(c => c.name).join(', ')}`}
            >
              {product.colors.map(color => (
                <span
                  key={color.id}
                  className="swatch-dot"
                  style={{ backgroundColor: color.hex }}
                  title={color.name}
                />
              ))}
              <span className="body-sm text-muted-editorial ms-2" style={{ fontSize: '0.75rem' }}>
                {product.colors.length} {product.colors.length === 1 ? 'tone' : 'tones'}
              </span>
            </div>

            {/* Product Title Linked */}
            <h2 id={`product-heading-${product.id}`} className="display-editorial text-oxblood mb-2">
              <Link 
                to={`/product/${product.slug}`} 
                className="text-oxblood text-decoration-none"
                data-testid={`product-link-${product.id}`}
              >
                {product.title}
              </Link>
            </h2>

            {/* Subtitle */}
            <p className="headline-sm text-on-surface fst-italic fw-light mb-3">
              {product.subtitle}
            </p>

            {/* Product Narrative */}
            <p className="body-md text-muted-editorial mb-4" style={{ maxWidth: 580 }}>
              {product.description}
            </p>

            {/* Specifications Row */}
            <div className="row g-3 py-3 border-hairline-y mb-4" style={{ maxWidth: 540 }}>
              <div className="col-6">
                <span className="label-caps-wide text-champagne d-block" style={{ fontSize: '0.625rem' }}>
                  TAILORING FORM
                </span>
                <span className="body-sm text-oxblood fw-medium d-block pt-1">
                  {'weaveType' in product ? product.weaveType : product.inspiration?.label || product.category}
                </span>
              </div>
              <div className="col-6">
                <span className="label-caps-wide text-champagne d-block" style={{ fontSize: '0.625rem' }}>
                  FIBER COMPOSITION
                </span>
                <span className="body-sm text-oxblood fw-medium d-block pt-1">
                  {'fiberPurity' in product ? product.fiberPurity : (product.materials?.[0]?.composition || 'Curated Textile Spec')}
                </span>
              </div>
            </div>
          </div>

          {/* Pricing & CTA */}
          <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 pt-3 border-hairline-t mt-auto">
            <div>
              <span className="label-caps-wide text-muted-editorial d-block" style={{ fontSize: '0.625rem' }}>
                Valuation
              </span>
              <span className="title-lg text-oxblood font-serif fw-semibold" data-testid={`product-price-${product.id}`}>
                {product.currency}{product.price.toLocaleString('en-IN')}
              </span>
            </div>

            <Link 
              to={`/product/${product.slug}`} 
              className="btn-oxblood py-2 px-4 d-inline-flex align-items-center gap-2"
              aria-label={`View piece details for ${product.title}`}
            >
              <span>View Piece</span>
              <span className="material-symbols-outlined fs-6" aria-hidden="true">arrow_forward</span>
            </Link>
          </div>
        </div>
      </article>
    );
  }

  // Standard Companion Silhouette Card
  return (
    <article 
      className="garment-tile plinth-card plinth-reveal h-100 d-flex flex-column" 
      aria-labelledby={`product-heading-${product.id}`}
      data-testid={`product-card-${product.id}`}
      data-product-id={product.id}
      style={index !== undefined ? { animationDelay: `${Number((Math.min(index, 6) * 0.05).toFixed(2))}s` } : undefined}
    >
      {/* Image Plinth Container */}
      <div className="garment-img-wrap position-relative">
        <Link 
          to={`/product/${product.slug}`} 
          tabIndex={-1} 
          aria-hidden="true"
          className="d-block w-100 h-100"
        >
          <img
            src={primaryImage?.src || product.image}
            srcSet={primaryImage?.srcSet}
            sizes={primaryImage?.sizes || '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'}
            alt={product.imageAlt || product.title}
            loading="lazy"
            width={primaryImage?.width || 800}
            height={primaryImage?.height || 1200}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </Link>

        {/* Edition / Allocation Badge */}
        {'edition' in product && product.edition && (
          <span className="edition-badge">
            {product.edition}
          </span>
        )}

        {/* Save Piece Action Bookmark Button */}
        <button
          type="button"
          className={`bookmark-action-btn ${saved ? 'active' : ''}`}
          onClick={handleToggleSave}
          onKeyDown={handleKeyDownSave}
          aria-label={saved ? `Remove ${product.title} from Saved Pieces` : `Save ${product.title} to Saved Pieces`}
          aria-pressed={saved}
          data-testid={`save-btn-${product.id}`}
          title={saved ? 'Remove from Saved Pieces' : 'Save to Saved Pieces'}
        >
          <span className="material-symbols-outlined fs-5" aria-hidden="true">
            {saved ? 'bookmark' : 'bookmark_border'}
          </span>
        </button>
      </div>

      {/* Product Information Body */}
      <div className="d-flex flex-column flex-grow-1 pt-2">
        {/* Colorway Swatch Dots */}
        <div 
          className="d-flex align-items-center gap-1 mb-2" 
          aria-label={`Available colourways: ${product.colors.map(c => c.name).join(', ')}`}
        >
          {product.colors.map(color => (
            <span
              key={color.id}
              className="swatch-dot"
              style={{ backgroundColor: color.hex }}
              title={color.name}
            />
          ))}
          <span className="body-sm text-muted-editorial ms-1" style={{ fontSize: '0.75rem' }}>
            {product.colors.length} {product.colors.length === 1 ? 'tone' : 'tones'}
          </span>
        </div>

        {/* Craft Lineage & Category Label */}
        <div className="label-caps text-champagne mb-1">
          {product.category} • {'weaveType' in product ? product.weaveType : product.inspiration?.label || product.category}
        </div>

        {/* Product Title Linked */}
        <h3 id={`product-heading-${product.id}`} className="headline-sm text-oxblood mb-2" style={{ fontSize: '1.25rem' }}>
          <Link 
            to={`/product/${product.slug}`} 
            className="text-oxblood text-decoration-none"
            data-testid={`product-link-${product.id}`}
          >
            {product.title}
          </Link>
        </h3>

        {/* Concise Fiber Composition Note */}
        <p className="body-sm text-muted-editorial mb-3 line-clamp-2" style={{ minHeight: '2.5rem' }}>
          {'fiberPurity' in product ? product.fiberPurity : (product.materials?.[0]?.composition || '')}
        </p>

        {/* Pricing & Navigation Footer */}
        <div className="d-flex align-items-center justify-content-between pt-3 border-hairline-t mt-auto">
          <div>
            <span className="label-caps-wide text-muted-editorial d-block" style={{ fontSize: '0.625rem' }}>
              Valuation
            </span>
            <span className="title-md text-oxblood fw-semibold" data-testid={`product-price-${product.id}`}>
              {product.currency}{product.price.toLocaleString('en-IN')}
            </span>
          </div>

          <Link 
            to={`/product/${product.slug}`} 
            className="link-editorial d-inline-flex align-items-center gap-1"
            aria-label={`View piece details for ${product.title}`}
          >
            <span>View Piece</span>
            <span className="material-symbols-outlined fs-6" aria-hidden="true">arrow_forward</span>
          </Link>
        </div>
      </div>
    </article>
  );
};
