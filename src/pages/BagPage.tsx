import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext.tsx';
import { useSaved } from '../context/SavedContext.tsx';
import { PRODUCT_ASSET_MAP, TRADITIONAL_PRODUCT_ASSET_MAP } from '../data/assetMap.ts';
import { useEditorialScroll } from '../hooks/useEditorialScroll.ts';

export const BagPage: React.FC = () => {
  const { bag, bagCount, subtotal, formatPrice, updateQuantity, removeFromBag, clearBag, getItemProduct } = useCart();
  const { isSaved, toggleSaved } = useSaved();

  const mainRef = useRef<HTMLElement>(null);

  useEditorialScroll({
    scopeRef: mainRef,
    headerSelector: '.editorial-enter',
    staggerSelector: '.editorial-card',
    deps: [bagCount]
  });

  const handleSaveForLater = (productId: string, target: string | number) => {
    if (!isSaved(productId)) {
      toggleSaved(productId);
    }
    removeFromBag(target);
  };

  return (
    <main id="main-content" className="main-content bg-canvas" data-testid="bag-page" ref={mainRef}>
      {/* Editorial Header */}
      <section className="py-5 bg-cream border-hairline-b">
        <div className="page-container">
          <div className="d-flex align-items-center gap-2 mb-2 editorial-enter">
            <span style={{ width: 24, height: 1, backgroundColor: 'var(--color-champagne-thread)' }}></span>
            <span className="label-caps text-champagne">Atelier Concierge Order</span>
          </div>

          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end gap-3 mb-3">
            <div>
              <h1 className="display-hero text-oxblood mb-2 editorial-enter" style={{ fontSize: '3rem' }}>
                Bespoke Shopping Bag
              </h1>
              <p className="headline-sm text-on-surface fst-italic fw-light mb-0 editorial-enter" style={{ fontSize: '1.25rem' }}>
                Review allocated pieces before bespoke tailoring and ledger registration.
              </p>
            </div>

            {bagCount > 0 && (
              <div className="d-flex align-items-center gap-3 editorial-enter">
                <span className="label-caps text-muted-editorial" data-testid="bag-total-count">
                  {bagCount} {bagCount === 1 ? 'Piece Allocated' : 'Pieces Allocated'}
                </span>
                <button
                  type="button"
                  className="btn-remove-editorial"
                  onClick={clearBag}
                  data-testid="clear-bag-btn"
                >
                  <span className="material-symbols-outlined fs-6">delete_sweep</span>
                  <span>Clear Bag</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Main Bag Content */}
      <section className="py-5">
        <div className="page-container">
          {bagCount === 0 || bag.length === 0 ? (
            /* Empty State */
            <div className="empty-curation-box" data-testid="empty-bag-state">
              <span className="material-symbols-outlined text-champagne fs-1 mb-3">shopping_bag</span>
              <h2 className="headline-md text-oxblood mb-2">Your Bespoke Bag Is Empty</h2>
              <p className="body-md text-muted-editorial mx-auto mb-4" style={{ maxWidth: 540 }}>
                Discover the permanent capsule and select an heirloom piece tailored to your cadence.
              </p>
              <div className="d-flex justify-content-center gap-3 flex-wrap">
                <Link to="/collections" className="btn-oxblood px-4 py-2" data-testid="empty-bag-explore-btn">
                  Explore Curated Collections
                </Link>
                <Link to="/saved" className="btn-outline-editorial px-4 py-2">
                  View Saved Pieces
                </Link>
              </div>
            </div>
          ) : (
            /* Populated Bag Layout */
            <div className="row g-4 lg-g-5">
              {/* Left Column: Bag Line Items List */}
              <div className="col-12 col-lg-8" data-testid="bag-items-list">
                <div className="d-flex flex-column gap-3">
                  {bag.map((item, idx) => {
                    const product = getItemProduct(item.productId);
                    if (!product) return null; // Gracefully skip unresolvable items

                    const assetRecord = PRODUCT_ASSET_MAP[product.id] || TRADITIONAL_PRODUCT_ASSET_MAP[product.id];
                    const primaryImage = assetRecord?.primary;
                    const isApparel = product.category !== 'Accessories';
                    const lineTotal = product.price * item.quantity;
                    const itemKey = item.variantId || `${item.productId}-${item.color}-${item.size}-${idx}`;

                    return (
                      <article 
                        key={itemKey}
                        className="bag-item-card"
                        data-testid={`bag-item-${idx}`}
                        data-product-id={product.id}
                        data-variant-id={item.variantId}
                      >
                        <div className="d-flex gap-3 gap-sm-4">
                          {/* Item Thumbnail */}
                          <div className="bag-item-img-wrap">
                            <Link to={`/product/${product.slug}`} aria-label={`View folio for ${product.title}`}>
                              <img
                                src={primaryImage?.src || product.image}
                                alt={product.imageAlt || product.title}
                                loading="lazy"
                                width={110}
                                height={145}
                              />
                            </Link>
                          </div>

                          {/* Item Specifications & Quantities */}
                          <div className="flex-grow-1 d-flex flex-column justify-content-between">
                            <div>
                              <div className="d-flex align-items-center justify-content-between gap-2 mb-1">
                                <span className="label-caps text-champagne">
                                  {product.category}{'weaveType' in product && product.weaveType ? ` • ${product.weaveType}` : ''}
                                </span>
                                <span className="label-caps text-muted-editorial">
                                  {'edition' in product ? product.edition : ''}
                                </span>
                              </div>

                              <h2 className="headline-sm text-oxblood mb-1" style={{ fontSize: '1.25rem' }}>
                                <Link 
                                  to={`/product/${product.slug}`} 
                                  className="text-oxblood text-decoration-none"
                                  data-testid={`bag-item-title-${idx}`}
                                >
                                  {product.title}
                                </Link>
                              </h2>

                              {/* Variant Details */}
                              <div className="d-flex flex-wrap align-items-center gap-3 body-sm text-muted-editorial mb-2">
                                <div>
                                  <span className="fw-medium text-oxblood">Colour:</span> {item.color}
                                </div>
                                <span className="text-champagne">•</span>
                                <div>
                                  {isApparel ? (
                                    <>
                                      <span className="fw-medium text-oxblood">Size:</span> {item.size}
                                    </>
                                  ) : (
                                    <>
                                      <span className="fw-medium text-oxblood">Spec:</span> {item.size}
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Quantity Controls & Line Pricing */}
                            <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 pt-2 border-hairline-t">
                              {/* Quantity Control */}
                              <div className="d-flex align-items-center gap-2">
                                <span className="label-caps text-muted-editorial d-none d-sm-inline">Qty:</span>
                                <div className="quantity-control" data-testid={`quantity-control-${idx}`}>
                                  <button
                                    type="button"
                                    className={`qty-btn ${item.quantity <= 1 ? 'opacity-50' : ''}`}
                                    onClick={() => {
                                      if (item.quantity > 1) {
                                        updateQuantity(item.variantId || idx, -1);
                                      }
                                    }}
                                    aria-disabled={item.quantity <= 1}
                                    aria-label={`Decrease quantity of ${product.title}`}
                                    data-testid={`qty-minus-${idx}`}
                                  >
                                    <span className="material-symbols-outlined fs-6">remove</span>
                                  </button>

                                  <span 
                                    className="qty-display"
                                    data-testid={`item-qty-${idx}`}
                                    aria-live="polite"
                                  >
                                    {item.quantity}
                                  </span>

                                  <button
                                    type="button"
                                    className="qty-btn"
                                    onClick={() => updateQuantity(item.variantId || idx, 1)}
                                    aria-label={`Increase quantity of ${product.title}`}
                                    data-testid={`qty-plus-${idx}`}
                                  >
                                    <span className="material-symbols-outlined fs-6">add</span>
                                  </button>
                                </div>
                              </div>

                              {/* Unit Price & Line Total */}
                              <div className="text-end">
                                <div className="body-sm text-muted-editorial">
                                  ₹{product.price.toLocaleString('en-IN')} each
                                </div>
                                <div 
                                  className="headline-sm text-oxblood fw-bold" 
                                  data-testid={`bag-item-total-${idx}`}
                                >
                                  ₹{lineTotal.toLocaleString('en-IN')}
                                </div>
                              </div>
                            </div>

                            {/* Secondary Line Actions: Move to Saved & Remove */}
                            <div className="d-flex align-items-center justify-content-between pt-2 border-hairline-t mt-2">
                              <button
                                type="button"
                                className="btn-move-editorial"
                                onClick={() => handleSaveForLater(product.id, item.variantId || idx)}
                                data-testid={`move-to-saved-${idx}`}
                                aria-label={`Save ${product.title} for later`}
                              >
                                <span className="material-symbols-outlined fs-6">bookmark</span>
                                <span>Save for Later</span>
                              </button>

                              <button
                                type="button"
                                className="btn-remove-editorial"
                                onClick={() => removeFromBag(item.variantId || idx)}
                                data-testid={`remove-item-${idx}`}
                                aria-label={`Remove ${product.title} from bag`}
                              >
                                <span className="material-symbols-outlined fs-6">close</span>
                                <span>Remove</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>

                {/* Return to Collections link */}
                <div className="pt-4">
                  <Link 
                    to="/collections" 
                    className="btn-outline-editorial d-inline-flex align-items-center gap-2"
                    data-testid="continue-shopping-btn"
                  >
                    <span className="material-symbols-outlined fs-6">arrow_back</span>
                    <span>Continue Curating Repertoire</span>
                  </Link>
                </div>
              </div>

              {/* Right Column: Order Ledger & Allocation Summary */}
              <div className="col-12 col-lg-4">
                <aside className="bag-summary-panel" data-testid="bag-summary">
                  <div className="d-flex align-items-center gap-2 mb-3">
                    <span style={{ width: 16, height: 1, backgroundColor: 'var(--color-champagne-thread)' }}></span>
                    <span className="label-caps text-champagne">House Ledger Summary</span>
                  </div>

                  <h2 className="headline-sm text-oxblood mb-3 pb-2 border-hairline-b" style={{ fontSize: '1.5rem' }}>
                    Allocation Total
                  </h2>

                  {/* Summary Rows */}
                  <div className="d-flex flex-column gap-2 mb-3 body-sm">
                    <div className="d-flex justify-content-between">
                      <span className="text-muted-editorial">Allocated Pieces</span>
                      <span className="text-oxblood fw-medium" data-testid="summary-pieces-count">
                        {bagCount}
                      </span>
                    </div>

                    <div className="d-flex justify-content-between">
                      <span className="text-muted-editorial">Line Items</span>
                      <span className="text-oxblood fw-medium">
                        {bag.length}
                      </span>
                    </div>

                    <div className="d-flex justify-content-between pt-2 border-hairline-t">
                      <span className="text-muted-editorial">Subtotal</span>
                      <span className="text-oxblood fw-bold" data-testid="bag-subtotal">
                        {formatPrice(subtotal)}
                      </span>
                    </div>
                  </div>

                  {/* Ledger Allocation Notice */}
                  <div className="p-3 bg-stone border-hairline mb-4">
                    <span className="label-caps-wide text-champagne d-block mb-1" style={{ fontSize: '0.625rem' }}>
                      Atelier Valuation Policy
                    </span>
                    <p className="body-sm text-muted-editorial mb-0" style={{ fontSize: '0.75rem', lineHeight: 1.45 }}>
                      Calculated strictly from canonical catalogue pricing. Taxes, bespoke courier allocation, and personalized monogramming are finalized during concierge checkout.
                    </p>
                  </div>

                  {/* Grand Subtotal Total */}
                  <div className="d-flex justify-content-between align-items-baseline mb-4 pt-2 border-hairline-t">
                    <span className="title-md text-oxblood">Estimated Total</span>
                    <span className="headline-sm text-oxblood fw-bold" data-testid="bag-total">
                      {formatPrice(subtotal)}
                    </span>
                  </div>

                  {/* Primary Checkout CTA */}
                  <Link
                    to="/checkout"
                    className="btn-oxblood w-100 py-3 d-flex align-items-center justify-content-center gap-2 mb-2"
                    data-testid="checkout-btn"
                  >
                    <span>Proceed to Concierge Checkout</span>
                    <span className="material-symbols-outlined fs-6">arrow_forward</span>
                  </Link>
                </aside>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
};
