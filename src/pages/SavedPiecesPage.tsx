import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSaved } from '../context/SavedContext.tsx';
import { useCart } from '../context/CartContext.tsx';
import { getProductById } from '../data/products.ts';
import { PRODUCT_ASSET_MAP } from '../data/assetMap.ts';
import { Product } from '../types/catalog.ts';
import { useEditorialScroll } from '../hooks/useEditorialScroll.ts';

interface SavedCardItemProps {
  product: Product;
  onRemove: (id: string) => void;
  onMoveToBag: (item: { productId: string; size: string; color: string }) => void;
}

const SavedCardItem: React.FC<SavedCardItemProps> = ({ product, onRemove, onMoveToBag }) => {
  const navigate = useNavigate();
  const isApparel = product.category !== 'Accessories';
  const isTraditionalProduct = (product as unknown as { collection?: string }).collection === 'traditional';
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0] || 'Standard');
  const [selectedColor, setSelectedColor] = useState<string>(product.colors[0]?.name || 'Signature');
  const [feedback, setFeedback] = useState<string | null>(null);

  const assetRecord = PRODUCT_ASSET_MAP[product.id];
  const primaryImage = assetRecord?.primary;

  const handleMove = () => {
    if (isTraditionalProduct) {
      navigate(`/product/${product.slug}`);
      return;
    }
    onMoveToBag({
      productId: product.id,
      size: selectedSize,
      color: selectedColor
    });
    setFeedback('Moved to Bag');
  };

  return (
    <article 
      className="saved-piece-card h-100" 
      data-testid={`saved-card-${product.id}`}
      data-product-id={product.id}
    >
      {/* Image Plinth */}
      <div className="saved-piece-img-wrap">
        <Link to={`/product/${product.slug}`} aria-label={`View folio for ${product.title}`}>
          <img
            src={primaryImage?.src || product.image}
            srcSet={primaryImage?.srcSet}
            sizes={primaryImage?.sizes || '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'}
            alt={product.imageAlt || product.title}
            loading="lazy"
            width={primaryImage?.width || 800}
            height={primaryImage?.height || 1200}
          />
        </Link>
        <span className="edition-badge">{product.edition}</span>
      </div>

      {/* Card Details */}
      <div className="p-3 d-flex flex-column flex-grow-1">
        <div className="label-caps text-champagne mb-1">
          {product.category} • {product.weaveType}
        </div>

        <h3 className="headline-sm text-oxblood mb-2" style={{ fontSize: '1.25rem' }}>
          <Link 
            to={`/product/${product.slug}`} 
            className="text-oxblood text-decoration-none"
            data-testid={`saved-title-${product.id}`}
          >
            {product.title}
          </Link>
        </h3>

        <div className="mb-3">
          <span className="headline-sm text-oxblood fw-bold" data-testid={`saved-price-${product.id}`}>
            ₹{product.price.toLocaleString('en-IN')}
          </span>
          <span className="body-sm text-muted-editorial ms-2">House Valuation</span>
        </div>

        {/* Variant Controls */}
        <div className="mb-3 pt-2 border-hairline-t">
          {/* Colourway Selection */}
          <div className="mb-2">
            <span className="label-caps text-muted-editorial d-block mb-1">
              Colour: <strong className="text-oxblood">{selectedColor}</strong>
            </span>
            <div className="d-flex align-items-center gap-2">
              {product.colors.map(c => (
                <button
                  key={c.id}
                  type="button"
                  className={`swatch-dot ${selectedColor === c.name ? 'active' : ''}`}
                  style={{ backgroundColor: c.hex }}
                  onClick={() => setSelectedColor(c.name)}
                  aria-label={`Select ${c.name}`}
                  title={c.name}
                />
              ))}
            </div>
          </div>

          {/* Size / Dimension Selection */}
          {isApparel ? (
            <div>
              <span className="label-caps text-muted-editorial d-block mb-1">
                Size: <strong className="text-oxblood">{selectedSize}</strong>
              </span>
              <div 
                className="d-flex flex-wrap gap-1"
                data-testid={`saved-size-select-${product.id}`}
              >
                {product.sizes.map(sz => (
                  <button
                    key={sz}
                    type="button"
                    className={`btn btn-sm ${selectedSize === sz ? 'btn-oxblood' : 'btn-outline-editorial'} py-1 px-2`}
                    style={{ fontSize: '0.6875rem' }}
                    onClick={() => setSelectedSize(sz)}
                    data-testid={`saved-size-opt-${product.id}-${sz.replace(/[^a-zA-Z0-9]/g, '-')}`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <span className="label-caps text-muted-editorial d-block mb-1">Specification</span>
              <span 
                className="badge bg-stone text-oxblood border-hairline py-1 px-2 body-sm fw-normal"
                data-testid={`saved-dim-spec-${product.id}`}
              >
                {product.sizes[0] || 'Atelier Specification'}
              </span>
            </div>
          )}
        </div>

        {/* Actions Area */}
        <div className="mt-auto pt-2 d-flex flex-column gap-2">
          {feedback ? (
            <div className="alert alert-success py-2 px-3 body-sm mb-0 text-center" role="alert">
              {feedback}
            </div>
          ) : (
            <button
              type="button"
              className="btn-oxblood w-100 py-2 d-flex align-items-center justify-content-center gap-2"
              onClick={handleMove}
              data-testid={`move-to-bag-${product.id}`}
            >
              <span className="material-symbols-outlined fs-6">shopping_bag</span>
              <span>Move to Bespoke Bag</span>
            </button>
          )}

          <div className="d-flex align-items-center justify-content-between pt-1">
            <Link 
              to={`/product/${product.slug}`} 
              className="body-sm text-muted-editorial text-decoration-underline"
            >
              View Folio
            </Link>

            <button
              type="button"
              className="btn-remove-editorial"
              onClick={() => onRemove(product.id)}
              data-testid={`remove-saved-${product.id}`}
              aria-label={`Remove ${product.title} from Saved Pieces`}
            >
              <span className="material-symbols-outlined fs-6">close</span>
              <span>Remove</span>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};

export const SavedPiecesPage: React.FC = () => {
  const { saved, toggleSaved, clearSaved } = useSaved();
  const { addToBag } = useCart();

  const mainRef = useRef<HTMLElement>(null);

  useEditorialScroll({
    scopeRef: mainRef,
    headerSelector: '.editorial-enter',
    staggerSelector: '.editorial-card',
    deps: [saved.length]
  });

  // Resolve valid products from the canonical catalogue
  const savedProducts: Product[] = saved
    .map(id => getProductById(id))
    .filter((p): p is Product => !!p);

  const handleRemove = (productId: string) => {
    toggleSaved(productId);
  };

  const handleMoveToBag = (item: { productId: string; size: string; color: string }) => {
    addToBag({
      productId: item.productId,
      size: item.size,
      color: item.color,
      quantity: 1
    });
    // Remove from saved once moved to bag
    toggleSaved(item.productId);
  };

  return (
    <main id="main-content" className="main-content bg-canvas" data-testid="saved-pieces-page" ref={mainRef}>
      {/* Editorial Header Plinth */}
      <section className="py-5 bg-cream border-hairline-b">
        <div className="page-container">
          <div className="d-flex align-items-center gap-2 mb-2 editorial-enter">
            <span style={{ width: 24, height: 1, backgroundColor: 'var(--color-champagne-thread)' }}></span>
            <span className="label-caps text-champagne">Personal Archival Curation</span>
          </div>

          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end gap-3 mb-3">
            <div>
              <h1 className="display-hero text-oxblood mb-2 editorial-enter" style={{ fontSize: '3rem' }}>
                Saved Pieces
              </h1>
              <p className="headline-sm text-on-surface fst-italic fw-light mb-0 editorial-enter" style={{ fontSize: '1.25rem' }}>
                Curated heirlooms reserved for consideration, consultation, and bespoke allocation.
              </p>
            </div>

            {savedProducts.length > 0 && (
              <div className="d-flex align-items-center gap-3 editorial-enter">
                <span className="label-caps text-muted-editorial" data-testid="saved-total-count">
                  {savedProducts.length} {savedProducts.length === 1 ? 'Piece Reserved' : 'Pieces Reserved'}
                </span>
                <button
                  type="button"
                  className="btn-remove-editorial"
                  onClick={clearSaved}
                  data-testid="clear-all-saved-btn"
                >
                  <span className="material-symbols-outlined fs-6">delete_sweep</span>
                  <span>Clear Curation</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="py-5">
        <div className="page-container">
          {savedProducts.length === 0 ? (
            /* Empty State */
            <div className="empty-curation-box" data-testid="empty-saved-state">
              <span className="material-symbols-outlined text-champagne fs-1 mb-3">bookmark_border</span>
              <h2 className="headline-md text-oxblood mb-2">Your Saved Curation is Empty</h2>
              <p className="body-md text-muted-editorial mx-auto mb-4" style={{ maxWidth: 540 }}>
                You have not preserved any heirlooms yet. Explore the permanent capsule to curate and bookmark pieces for bespoke tailoring.
              </p>
              <div className="d-flex justify-content-center gap-3 flex-wrap">
                <Link to="/collections" className="btn-oxblood px-4 py-2" data-testid="empty-saved-explore-btn">
                  Explore Curated Collections
                </Link>
                <Link to="/compass" className="btn-outline-editorial px-4 py-2">
                  Consult Thread Compass
                </Link>
              </div>
            </div>
          ) : (
            /* Populated Grid */
            <div>
              <div className="row g-4" data-testid="saved-products-grid">
                {savedProducts.map(product => (
                  <div key={product.id} className="col-12 col-md-6 col-lg-4 editorial-card">
                    <SavedCardItem
                      product={product}
                      onRemove={handleRemove}
                      onMoveToBag={handleMoveToBag}
                    />
                  </div>
                ))}
              </div>

              {/* Editorial Reassurance Footer */}
              <div className="mt-5 p-4 bg-stone border-hairline d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
                <div className="d-flex align-items-center gap-3">
                  <span className="material-symbols-outlined text-champagne fs-4">verified</span>
                  <div>
                    <span className="label-caps text-oxblood d-block">House Preservation Guarantee</span>
                    <p className="body-sm text-muted-editorial mb-0">
                      Saved pieces remain secured in your browser session and synchronize across atelier consultation folios.
                    </p>
                  </div>
                </div>
                <Link to="/collections" className="btn-outline-editorial text-nowrap align-self-start align-self-md-center">
                  Continue Curating
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
};
