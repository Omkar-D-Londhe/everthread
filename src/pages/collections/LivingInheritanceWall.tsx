import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { TRADITIONAL_PRODUCTS } from '../../data/traditionalProducts.ts';
import { TraditionalProduct } from '../../types/catalog.ts';
import { ProductCard } from '../../components/ProductCard.tsx';
import { getListedWallMoments, PopulatedWallMoment } from '../../data/wallMoments.ts';

export type TRSortOrder = 'featured' | 'price-asc' | 'price-desc';

export const TR_CATEGORY_OPTIONS = [
  'All',
  'Outerwear',
  'Sets & Co-ords',
  'Dresses & Gowns'
];

export const TR_COLOUR_OPTIONS = [
  { id: 'oxblood', label: 'Oxblood / Antique Gold' },
  { id: 'ivory', label: 'Warm Ivory / Champagne' },
  { id: 'indigo', label: 'Midnight Ink / Indigo' },
  { id: 'emerald', label: 'Deep Emerald / Forest' }
];

export const TR_PRICE_TIERS = [
  { id: 'under-100k', label: 'Under ₹1,00,000', min: 0, max: 99999 },
  { id: '100k-130k', label: '₹1,00,000 – ₹1,30,000', min: 100000, max: 130000 },
  { id: 'over-130k', label: 'Over ₹1,30,000', min: 130001, max: Infinity }
];

interface LivingInheritanceWallProps {
  productsOverride?: TraditionalProduct[];
}

export const LivingInheritanceWall: React.FC<LivingInheritanceWallProps> = ({
  productsOverride
}) => {
  const allTraditional = productsOverride || TRADITIONAL_PRODUCTS;
  
  // Filter for listed products only per Stage 05 rules
  const listedProducts = useMemo(() => {
    return allTraditional.filter(p => p.isListed);
  }, [allTraditional]);

  // Toolbar state
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedColours, setSelectedColours] = useState<string[]>([]);
  const [selectedPriceTier, setSelectedPriceTier] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<TRSortOrder>('featured');

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (selectedCategory !== 'All') count += 1;
    count += selectedColours.length;
    if (selectedPriceTier !== 'all') count += 1;
    return count;
  }, [selectedCategory, selectedColours, selectedPriceTier]);

  const handleResetFilters = () => {
    setSelectedCategory('All');
    setSelectedColours([]);
    setSelectedPriceTier('all');
    setSortOrder('featured');
  };

  const toggleColour = (colId: string) => {
    setSelectedColours(prev =>
      prev.includes(colId) ? prev.filter(c => c !== colId) : [...prev, colId]
    );
  };

  // Filtered and sorted flat products (used when filters/sort active)
  const filteredAndSorted = useMemo(() => {
    const filtered = listedProducts.filter(p => {
      if (selectedCategory !== 'All' && p.category !== selectedCategory) {
        return false;
      }
      if (selectedColours.length > 0) {
        const colText = p.colors.map(c => c.name.toLowerCase()).join(' ');
        const matches = selectedColours.some(cid => colText.includes(cid));
        if (!matches) return false;
      }
      if (selectedPriceTier !== 'all') {
        const tier = TR_PRICE_TIERS.find(t => t.id === selectedPriceTier);
        if (tier && (p.price < tier.min || p.price > tier.max)) {
          return false;
        }
      }
      return true;
    });

    const sorted = [...filtered];
    if (sortOrder === 'price-asc') {
      sorted.sort((a, b) => a.price - b.price);
    } else if (sortOrder === 'price-desc') {
      sorted.sort((a, b) => b.price - a.price);
    }
    return sorted;
  }, [listedProducts, selectedCategory, selectedColours, selectedPriceTier, sortOrder]);

  // Populated moments (featured mode with zero filters active)
  const moments: PopulatedWallMoment[] = useMemo(() => {
    return getListedWallMoments(allTraditional);
  }, [allTraditional]);

  const isCustomFilteredOrSorted = sortOrder !== 'featured' || activeFilterCount > 0;

  return (
    <main id="main-content" className="main-content" data-testid="living-inheritance-wall">
      {/* Living Inheritance Editorial Hero Header */}
      <section className="py-5 bg-cream border-hairline-b">
        <div className="page-container">
          <div className="d-flex align-items-center gap-2 mb-2 editorial-enter">
            <span style={{ width: 24, height: 1, backgroundColor: 'var(--color-champagne-thread)' }}></span>
            <span className="label-caps text-champagne">Heritage Concept Wall</span>
            <span style={{ width: 24, height: 1, backgroundColor: 'var(--color-champagne-thread)' }}></span>
          </div>

          <h1 className="display-hero text-oxblood mb-2 editorial-enter" data-testid="living-inheritance-heading">
            The Living Inheritance
          </h1>

          <p className="headline-sm text-on-surface fst-italic fw-light mb-4 editorial-enter" style={{ maxWidth: 760 }}>
            Classical subcontinental loom lineage, korvai geometries, and double-ikat resist structures translated through contemporary architectural silhouettes.
          </p>

          {/* Category Navigation Pills */}
          <nav aria-label="Traditional Category Filter Navigation" className="d-flex flex-wrap gap-2 pt-2">
            {TR_CATEGORY_OPTIONS.map(cat => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  className={`category-pill ${isActive ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(cat)}
                  aria-pressed={isActive}
                  data-testid={`tr-category-pill-${cat.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                >
                  <span>{cat}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </section>

      {/* Shared Toolbar: Sort and Specific TR Filters (Category, Colour, Price; No craft/fibre) */}
      <section className="bg-canvas border-hairline-b sticky-top" style={{ zIndex: 20, top: 'var(--header-height)' }}>
        <div className="page-container py-3">
          <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
            {/* Live Count Indicator & Quick Palette Filters */}
            <div className="d-flex align-items-center gap-3 flex-wrap">
              <div 
                className="body-sm text-muted-editorial" 
                aria-live="polite" 
                aria-atomic="true"
                data-testid="tr-product-count-indicator"
              >
                Showing <strong className="text-oxblood fw-bold">{listedProducts.length}</strong> listed concept {listedProducts.length === 1 ? 'piece' : 'pieces'}
              </div>

              {/* Palette Filters (No craft or fibre filters on TR wall) */}
              <div className="d-flex align-items-center gap-1">
                {TR_COLOUR_OPTIONS.map(col => {
                  const isSel = selectedColours.includes(col.id);
                  return (
                    <button
                      key={col.id}
                      type="button"
                      className={`filter-active-tag ${isSel ? 'bg-oxblood text-white' : ''}`}
                      onClick={() => toggleColour(col.id)}
                      data-testid={`tr-color-${col.id}`}
                    >
                      <span>{col.label}</span>
                    </button>
                  );
                })}
              </div>

              {activeFilterCount > 0 && (
                <button
                  type="button"
                  className="btn-link text-oxblood body-sm p-0 border-0"
                  style={{ textDecoration: 'underline' }}
                  onClick={handleResetFilters}
                  data-testid="tr-reset-filters-btn"
                >
                  Clear filters
                </button>
              )}
            </div>

            {/* Sorting Control */}
            <div className="d-flex align-items-center gap-2">
              <label htmlFor="tr-sort-select" className="label-caps-wide text-muted-editorial d-none d-sm-inline body-sm">
                Ordering:
              </label>
              <select
                id="tr-sort-select"
                className="form-select sort-select"
                value={sortOrder}
                onChange={e => setSortOrder(e.target.value as TRSortOrder)}
                data-testid="tr-sort-select"
              >
                <option value="featured">Featured / Curated Moments</option>
                <option value="price-asc">Price: Ascending (Lowest First)</option>
                <option value="price-desc">Price: Descending (Highest First)</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Products & Moments Composition Area */}
      <section className="py-5 bg-canvas">
        <div className="page-container">
          {listedProducts.length === 0 ? (
            /* Curatorial Invariant Notice: TR products are currently unlisted */
            <div className="p-5 bg-cream border-hairline text-center my-4" data-testid="curatorial-reserve-notice">
              <div className="d-inline-flex align-items-center gap-2 mb-3">
                <span style={{ width: 16, height: 1, backgroundColor: 'var(--color-champagne-thread)' }}></span>
                <span className="label-caps text-champagne">Archival Reserve Inquiry</span>
                <span style={{ width: 16, height: 1, backgroundColor: 'var(--color-champagne-thread)' }}></span>
              </div>
              <h2 className="headline-md text-oxblood mb-2">
                Seven Exploratory Concept Silhouettes in Curatorial Reserve
              </h2>
              <p className="body-md text-muted-editorial mx-auto mb-4" style={{ maxWidth: 640 }}>
                The Living Inheritance (TR-01 through TR-07) represents exploratory concept studies. In strict compliance with House authenticity standards (O-6-C and O-11), pieces remain in archival documentation reserve until visual assets and craft provenance records are approved.
              </p>
              <div className="d-flex justify-content-center gap-3 flex-wrap">
                <Link to="/collections" className="btn-oxblood">
                  Explore Contemporary Repertoire
                </Link>
                <Link to="/archive" className="btn-outline-editorial">
                  Consult Cultural Archive
                </Link>
              </div>
            </div>
          ) : isCustomFilteredOrSorted ? (
            /* Flattened Grid for Filtered / Sorted View */
            <div className="row g-4 g-lg-5" data-testid="tr-products-flat-grid">
              {filteredAndSorted.map(product => (
                <div key={product.id} className="col-12 col-md-6 col-lg-4">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          ) : (
            /* Curated Wall Moments: feature-offset, staggered-pair, triptych-lead-last */
            <div className="wall-moments-container d-flex flex-column gap-5" data-testid="wall-moments-list">
              {moments.map(moment => (
                <article key={moment.id} className="wall-moment-block py-3 border-hairline-b" data-testid={`moment-${moment.id}`}>
                  <header className="mb-4">
                    <span className="label-caps text-champagne d-block mb-1">Moment</span>
                    <h2 className="headline-md text-oxblood mb-1">{moment.title}</h2>
                    <p className="body-md text-muted-editorial mb-0">{moment.caption}</p>
                  </header>

                  {/* Asymmetric Moment Layouts */}
                  {moment.layout === 'feature-offset' && (
                    <div className="row g-4 align-items-center">
                      {moment.products[0] && (
                        <div className="col-12 col-md-7">
                          <ProductCard product={moment.products[0]} />
                        </div>
                      )}
                      {moment.products[1] && (
                        <div className="col-12 col-md-5 pt-md-5">
                          <ProductCard product={moment.products[1]} />
                        </div>
                      )}
                    </div>
                  )}

                  {moment.layout === 'staggered-pair' && (
                    <div className="row g-4">
                      {moment.products[0] && (
                        <div className="col-12 col-md-6">
                          <ProductCard product={moment.products[0]} />
                        </div>
                      )}
                      {moment.products[1] && (
                        <div className="col-12 col-md-6 pt-md-4">
                          <ProductCard product={moment.products[1]} />
                        </div>
                      )}
                    </div>
                  )}

                  {moment.layout === 'triptych-lead-last' && (
                    <div className="row g-4 align-items-end">
                      {moment.products[0] && (
                        <div className="col-12 col-md-4">
                          <ProductCard product={moment.products[0]} />
                        </div>
                      )}
                      {moment.products[1] && (
                        <div className="col-12 col-md-4">
                          <ProductCard product={moment.products[1]} />
                        </div>
                      )}
                      {moment.products[2] && (
                        <div className="col-12 col-md-4">
                          <ProductCard product={moment.products[2]} />
                        </div>
                      )}
                    </div>
                  )}
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
};
