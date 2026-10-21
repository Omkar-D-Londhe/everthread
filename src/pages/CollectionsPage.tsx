import React, { useState, useMemo, useEffect, useRef } from 'react';
import { PRODUCTS } from '../data/products.ts';
import { Product } from '../types/catalog.ts';
import { ProductCard } from '../components/ProductCard.tsx';
import { useEditorialScroll } from '../hooks/useEditorialScroll.ts';

// Attribute Filter Definitions derived directly from actual catalogue data
export interface FilterOption {
  id: string;
  label: string;
}

export const CATEGORY_OPTIONS: { id: string; label: string; count: number }[] = [
  { id: 'All', label: 'All Silhouettes', count: PRODUCTS.length },
  { id: 'Outerwear', label: 'Outerwear', count: PRODUCTS.filter(p => p.category === 'Outerwear').length },
  { id: 'Waistcoats', label: 'Waistcoats', count: PRODUCTS.filter(p => p.category === 'Waistcoats').length },
  { id: 'Tunics & Drapes', label: 'Tunics & Drapes', count: PRODUCTS.filter(p => p.category === 'Tunics & Drapes').length },
  { id: 'Accessories', label: 'Accessories', count: PRODUCTS.filter(p => p.category === 'Accessories').length },
];

export const MATERIAL_OPTIONS: FilterOption[] = [
  { id: 'silk', label: 'Mulberry & Wild Silk' },
  { id: 'wool', label: 'Merino Wool' },
  { id: 'pashmina', label: 'Changthangi Pashmina' },
  { id: 'cotton', label: 'Desi Organic Cotton' },
  { id: 'leather', label: 'Box Calf Leather' },
  { id: 'zari', label: 'Metallic Zari' },
];

export const COLOUR_OPTIONS: FilterOption[] = [
  { id: 'oxblood', label: 'Oxblood / Burgundy' },
  { id: 'ivory', label: 'Warm Ivory / Sheer' },
  { id: 'espresso', label: 'Espresso / Obsidian' },
  { id: 'indigo', label: 'Fermented Indigo' },
  { id: 'bronze', label: 'Bronze / Champagne' },
];

export const CRAFT_OPTIONS: FilterOption[] = [
  { id: 'pit-loom', label: 'Pit-Loom / Handloom Twill' },
  { id: 'hand-spun', label: 'Hand-Spun Matka Plain Weave' },
  { id: 'kadwa', label: 'Kadwa Zari Brocade' },
  { id: 'resist', label: 'Vat Resist Dyeing' },
  { id: 'saddle', label: 'Hand-Saddle Stitched Leathercraft' },
];

export const PRICE_TIERS: { id: string; label: string; min: number; max: number }[] = [
  { id: 'under-35k', label: 'Under ₹35,000', min: 0, max: 34999 },
  { id: '35k-60k', label: '₹35,000 – ₹60,000', min: 35000, max: 60000 },
  { id: 'over-60k', label: 'Over ₹60,000', min: 60001, max: Infinity },
];

// Predicate matchers grounded strictly in actual product properties
export function matchesMaterial(p: Product, matId: string): boolean {
  const text = `${p.fiberPurity} ${p.curatorTags.join(' ')}`.toLowerCase();
  switch (matId) {
    case 'silk':
      return text.includes('silk');
    case 'wool':
      return text.includes('merino') || (text.includes('wool') && !text.includes('pashmina'));
    case 'pashmina':
      return text.includes('pashmina') || text.includes('pashm') || text.includes('cashmere');
    case 'cotton':
      return text.includes('cotton') || text.includes('chanderi');
    case 'leather':
      return text.includes('leather') || text.includes('calf');
    case 'zari':
      return text.includes('zari');
    default:
      return false;
  }
}

export function matchesColour(p: Product, colId: string): boolean {
  const colText = p.colors.map(c => c.name.toLowerCase()).join(' ');
  switch (colId) {
    case 'oxblood':
      return colText.includes('oxblood') || colText.includes('burgundy');
    case 'ivory':
      return colText.includes('ivory') || colText.includes('sheer') || colText.includes('champagne');
    case 'espresso':
      return colText.includes('espresso') || colText.includes('black') || colText.includes('obsidian');
    case 'indigo':
      return colText.includes('indigo');
    case 'bronze':
      return colText.includes('bronze') || colText.includes('champagne');
    default:
      return false;
  }
}

export function matchesCraft(p: Product, craftId: string): boolean {
  const text = `${p.weaveType} ${p.subtitle || ''}`.toLowerCase();
  switch (craftId) {
    case 'pit-loom':
      return text.includes('pit-loom') || text.includes('handloom') || text.includes('twill') || text.includes('gauze');
    case 'hand-spun':
      return text.includes('hand-spun');
    case 'kadwa':
      return text.includes('kadwa');
    case 'resist':
      return text.includes('resist') || text.includes('chanderi') || text.includes('indigo');
    case 'saddle':
      return text.includes('saddle') || text.includes('leathercraft');
    default:
      return false;
  }
}

export function matchesPrice(p: Product, priceTierId: string): boolean {
  const tier = PRICE_TIERS.find(t => t.id === priceTierId);
  if (!tier) return true;
  return p.price >= tier.min && p.price <= tier.max;
}

export type SortOrder = 'featured' | 'price-asc' | 'price-desc';

export function getCardColumnClass(
  index: number,
  totalCount: number,
  isDesktopFiltersOpen: boolean,
  isFeaturedOrder: boolean,
  isFlagship: boolean
): string {
  if (isFlagship) {
    return 'col-12';
  }

  // When desktop sidebar is open (9-column parent area)
  if (isDesktopFiltersOpen) {
    return 'col-12 col-md-6';
  }

  // Default full catalogue (7 items in featured order): Asymmetric editorial layout
  if (isFeaturedOrder && totalCount === 7) {
    switch (index) {
      case 1:
        return 'col-12 col-md-6 col-lg-7';
      case 2:
        return 'col-12 col-md-6 col-lg-5';
      case 3:
        return 'col-12 col-md-6 col-lg-5';
      case 4:
        return 'col-12 col-md-6 col-lg-7';
      case 5:
      case 6:
        return 'col-12 col-md-6 col-lg-6';
      default:
        return 'col-12 col-md-6 col-lg-6';
    }
  }

  // Filtered down to 3 items (e.g. Accessories)
  if (totalCount === 3) {
    return 'col-12 col-md-4';
  }

  // Filtered down to 2 items
  if (totalCount === 2) {
    return 'col-12 col-md-6';
  }

  // Filtered down to 1 item
  if (totalCount === 1) {
    return 'col-12 col-md-8 mx-auto';
  }

  // General fallback for sorted or other filtered counts
  return 'col-12 col-md-6 col-lg-4';
}

export const CollectionsPage: React.FC = () => {
  // Filter States
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [selectedColours, setSelectedColours] = useState<string[]>([]);
  const [selectedCrafts, setSelectedCrafts] = useState<string[]>([]);
  const [selectedPriceTier, setSelectedPriceTier] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<SortOrder>('featured');

  // UI Drawer / Desktop Collapsible Panel States
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [isDesktopFiltersOpen, setIsDesktopFiltersOpen] = useState(false);

  // References for focus management
  const drawerRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const openTriggerRef = useRef<HTMLButtonElement>(null);
  const mainRef = useRef<HTMLElement>(null);

  useEditorialScroll({
    scopeRef: mainRef,
    headerSelector: '.editorial-enter',
    staggerSelector: '.editorial-card',
    deps: [selectedCategory, selectedMaterials, selectedColours, selectedCrafts, selectedPriceTier, sortOrder]
  });

  // Total active filter count
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (selectedCategory !== 'All') count += 1;
    count += selectedMaterials.length;
    count += selectedColours.length;
    count += selectedCrafts.length;
    if (selectedPriceTier !== 'all') count += 1;
    return count;
  }, [selectedCategory, selectedMaterials, selectedColours, selectedCrafts, selectedPriceTier]);

  // Reset all filters back to full catalogue
  const handleResetFilters = () => {
    setSelectedCategory('All');
    setSelectedMaterials([]);
    setSelectedColours([]);
    setSelectedCrafts([]);
    setSelectedPriceTier('all');
  };

  // Toggle multi-select items
  const toggleMaterial = (id: string) => {
    setSelectedMaterials(prev => 
      prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
    );
  };

  const toggleColour = (id: string) => {
    setSelectedColours(prev => 
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const toggleCraft = (id: string) => {
    setSelectedCrafts(prev => 
      prev.includes(id) ? prev.filter(cr => cr !== id) : [...prev, id]
    );
  };

  // Focus trap and escape listener for mobile drawer
  useEffect(() => {
    if (isMobileDrawerOpen) {
      document.body.style.overflow = 'hidden';
      closeButtonRef.current?.focus();

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          setIsMobileDrawerOpen(false);
          openTriggerRef.current?.focus();
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      document.body.style.overflow = '';
    }
  }, [isMobileDrawerOpen]);

  // Filter and Sort Pipeline
  const filteredAndSortedProducts = useMemo(() => {
    // 1. Filter
    const filtered = PRODUCTS.filter(product => {
      // Category filter
      if (selectedCategory !== 'All' && product.category !== selectedCategory) {
        return false;
      }
      // Material filter (OR within facet)
      if (selectedMaterials.length > 0 && !selectedMaterials.some(m => matchesMaterial(product, m))) {
        return false;
      }
      // Colour filter (OR within facet)
      if (selectedColours.length > 0 && !selectedColours.some(c => matchesColour(product, c))) {
        return false;
      }
      // Craft filter (OR within facet)
      if (selectedCrafts.length > 0 && !selectedCrafts.some(cr => matchesCraft(product, cr))) {
        return false;
      }
      // Price Tier filter
      if (selectedPriceTier !== 'all' && !matchesPrice(product, selectedPriceTier)) {
        return false;
      }
      return true;
    });

    // 2. Sort
    const sorted = [...filtered];
    if (sortOrder === 'price-asc') {
      sorted.sort((a, b) => a.price - b.price);
    } else if (sortOrder === 'price-desc') {
      sorted.sort((a, b) => b.price - a.price);
    }
    // 'featured' preserves the established default catalogue order in PRODUCTS

    return sorted;
  }, [selectedCategory, selectedMaterials, selectedColours, selectedCrafts, selectedPriceTier, sortOrder]);

  return (
    <main id="main-content" className="main-content" ref={mainRef}>
      {/* Editorial Repertoire Hero */}
      <section className="py-5 bg-cream border-hairline-b">
        <div className="page-container">
          <div className="d-flex align-items-center gap-2 mb-2 editorial-enter">
            <span style={{ width: 24, height: 1, backgroundColor: 'var(--color-champagne-thread)' }}></span>
            <span className="label-caps text-champagne">Permanent Capsule</span>
            <span style={{ width: 24, height: 1, backgroundColor: 'var(--color-champagne-thread)' }}></span>
          </div>

          <h1 className="display-hero text-oxblood mb-2 editorial-enter">
            Curated Repertoire
          </h1>

          <p className="headline-sm text-on-surface fst-italic fw-light mb-4 editorial-enter" style={{ maxWidth: 760 }}>
            Seven architectural heirlooms hand-finished across master weaving guilds and leather ateliers, numbered and registered in the House Ledger.
          </p>

          {/* Category Quick Pills */}
          <nav aria-label="Category Filter Navigation" className="d-flex flex-wrap gap-2 pt-2">
            {CATEGORY_OPTIONS.map(cat => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  className={`category-pill ${isActive ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(cat.id)}
                  aria-pressed={isActive}
                  data-testid={`category-pill-${cat.id.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                >
                  <span>{cat.label}</span>
                  <span className="pill-count">({cat.count})</span>
                </button>
              );
            })}
          </nav>
        </div>
      </section>

      {/* Control Bar: Filter Toggle, Count, Sorting */}
      <section className="bg-canvas border-hairline-b sticky-top" style={{ zIndex: 20, top: 'var(--header-height)' }}>
        <div className="page-container py-3">
          <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
            {/* Filter Toggle & Results Count */}
            <div className="d-flex align-items-center gap-3">
              {/* Mobile Drawer Trigger */}
              <button
                ref={openTriggerRef}
                type="button"
                className="btn-oxblood d-lg-none py-2 px-3 body-sm"
                onClick={() => setIsMobileDrawerOpen(true)}
                aria-label={`Open Filters and Sort, ${activeFilterCount} active filters`}
                data-testid="mobile-filter-trigger"
              >
                <span className="material-symbols-outlined fs-6" aria-hidden="true">tune</span>
                <span>Filters &amp; Sort</span>
                {activeFilterCount > 0 && (
                  <span className="badge badge-sand text-oxblood px-2 py-1 ms-1">
                    {activeFilterCount}
                  </span>
                )}
              </button>

              {/* Desktop Filters Toggle */}
              <button
                type="button"
                className="btn-outline-editorial d-none d-lg-inline-flex py-2 px-3 body-sm"
                onClick={() => setIsDesktopFiltersOpen(prev => !prev)}
                aria-expanded={isDesktopFiltersOpen}
                aria-controls="desktop-filters-panel"
                data-testid="desktop-filter-toggle"
              >
                <span className="material-symbols-outlined fs-6" aria-hidden="true">
                  {isDesktopFiltersOpen ? 'filter_list_off' : 'tune'}
                </span>
                <span>{isDesktopFiltersOpen ? 'Hide Filters' : 'Refine Silhouettes'}</span>
                {activeFilterCount > 0 && (
                  <span className="badge badge-oxblood text-white px-2 py-1 ms-1">
                    {activeFilterCount}
                  </span>
                )}
              </button>

              {/* Live Count Indicator */}
              <div 
                className="body-sm text-muted-editorial" 
                aria-live="polite"
                data-testid="product-count-indicator"
              >
                Showing <strong className="text-oxblood">{filteredAndSortedProducts.length}</strong> of{' '}
                <strong>{PRODUCTS.length}</strong> Heirlooms
              </div>
            </div>

            {/* Sorting Dropdown */}
            <div className="d-flex align-items-center gap-2">
              <label htmlFor="collection-sort-select" className="label-caps text-muted-editorial d-none d-sm-inline">
                Sort:
              </label>
              <select
                id="collection-sort-select"
                className="sort-select"
                value={sortOrder}
                onChange={e => setSortOrder(e.target.value as SortOrder)}
                data-testid="sort-select"
                aria-label="Sort silhouettes"
              >
                <option value="featured">Featured (Atelier Order)</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Active Filter Badges */}
          {activeFilterCount > 0 && (
            <div className="d-flex flex-wrap align-items-center gap-2 pt-3 border-hairline-t mt-3" data-testid="active-filters-bar">
              <span className="label-caps text-muted-editorial me-1">Active Refinements:</span>

              {selectedCategory !== 'All' && (
                <span className="filter-chip" data-testid="chip-category">
                  <span>Category: {selectedCategory}</span>
                  <button
                    type="button"
                    className="filter-chip-remove"
                    onClick={() => setSelectedCategory('All')}
                    aria-label={`Remove Category ${selectedCategory} filter`}
                  >
                    <span className="material-symbols-outlined fs-6">close</span>
                  </button>
                </span>
              )}

              {selectedMaterials.map(mId => {
                const opt = MATERIAL_OPTIONS.find(m => m.id === mId);
                return (
                  <span key={mId} className="filter-chip" data-testid={`chip-material-${mId}`}>
                    <span>Material: {opt?.label || mId}</span>
                    <button
                      type="button"
                      className="filter-chip-remove"
                      onClick={() => toggleMaterial(mId)}
                      aria-label={`Remove Material ${opt?.label || mId} filter`}
                    >
                      <span className="material-symbols-outlined fs-6">close</span>
                    </button>
                  </span>
                );
              })}

              {selectedColours.map(cId => {
                const opt = COLOUR_OPTIONS.find(c => c.id === cId);
                return (
                  <span key={cId} className="filter-chip" data-testid={`chip-colour-${cId}`}>
                    <span>Colour: {opt?.label || cId}</span>
                    <button
                      type="button"
                      className="filter-chip-remove"
                      onClick={() => toggleColour(cId)}
                      aria-label={`Remove Colour ${opt?.label || cId} filter`}
                    >
                      <span className="material-symbols-outlined fs-6">close</span>
                    </button>
                  </span>
                );
              })}

              {selectedCrafts.map(crId => {
                const opt = CRAFT_OPTIONS.find(cr => cr.id === crId);
                return (
                  <span key={crId} className="filter-chip" data-testid={`chip-craft-${crId}`}>
                    <span>Craft: {opt?.label || crId}</span>
                    <button
                      type="button"
                      className="filter-chip-remove"
                      onClick={() => toggleCraft(crId)}
                      aria-label={`Remove Craft ${opt?.label || crId} filter`}
                    >
                      <span className="material-symbols-outlined fs-6">close</span>
                    </button>
                  </span>
                );
              })}

              {selectedPriceTier !== 'all' && (
                <span className="filter-chip" data-testid="chip-price">
                  <span>Valuation: {PRICE_TIERS.find(t => t.id === selectedPriceTier)?.label}</span>
                  <button
                    type="button"
                    className="filter-chip-remove"
                    onClick={() => setSelectedPriceTier('all')}
                    aria-label="Remove valuation filter"
                  >
                    <span className="material-symbols-outlined fs-6">close</span>
                  </button>
                </span>
              )}

              <button
                type="button"
                className="btn-outline-editorial py-1 px-2 body-sm ms-auto"
                onClick={handleResetFilters}
                data-testid="reset-all-filters-btn"
                style={{ fontSize: '0.6875rem' }}
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Main Catalogue Section: Filter Panel + Product Plinths */}
      <section className="py-5 bg-canvas">
        <div className="page-container">
          <div className="row g-4">
            {/* Desktop Collapsible Filter Sidebar */}
            {isDesktopFiltersOpen && (
              <aside 
                id="desktop-filters-panel" 
                className="col-12 col-lg-3 d-none d-lg-block"
                aria-label="Refine Catalogue Filters"
                data-testid="desktop-filters-panel"
              >
                <div className="p-4 bg-stone border-hairline sticky-top" style={{ top: 'calc(var(--header-height) + 5rem)' }}>
                  <div className="d-flex align-items-center justify-content-between pb-3 border-hairline-b mb-3">
                    <span className="label-caps text-oxblood">Facet Curation</span>
                    {activeFilterCount > 0 && (
                      <button
                        type="button"
                        className="btn-link text-oxblood p-0 border-0 bg-transparent label-caps"
                        onClick={handleResetFilters}
                        style={{ textDecoration: 'underline' }}
                      >
                        Clear All
                      </button>
                    )}
                  </div>

                  {/* Material Facet */}
                  <div className="mb-4">
                    <h2 className="label-caps text-oxblood mb-2" style={{ fontSize: '0.6875rem' }}>
                      Fiber &amp; Material
                    </h2>
                    {MATERIAL_OPTIONS.map(opt => {
                      const checked = selectedMaterials.includes(opt.id);
                      const matchingCount = PRODUCTS.filter(p => matchesMaterial(p, opt.id)).length;
                      return (
                        <label key={opt.id} className="filter-option-item">
                          <span className="d-flex align-items-center">
                            <input
                              type="checkbox"
                              className="filter-checkbox"
                              checked={checked}
                              onChange={() => toggleMaterial(opt.id)}
                              data-testid={`filter-mat-${opt.id}`}
                            />
                            <span>{opt.label}</span>
                          </span>
                          <span className="filter-option-count">({matchingCount})</span>
                        </label>
                      );
                    })}
                  </div>

                  {/* Colourway Facet */}
                  <div className="mb-4">
                    <h2 className="label-caps text-oxblood mb-2" style={{ fontSize: '0.6875rem' }}>
                      Colour Palette
                    </h2>
                    {COLOUR_OPTIONS.map(opt => {
                      const checked = selectedColours.includes(opt.id);
                      const matchingCount = PRODUCTS.filter(p => matchesColour(p, opt.id)).length;
                      return (
                        <label key={opt.id} className="filter-option-item">
                          <span className="d-flex align-items-center">
                            <input
                              type="checkbox"
                              className="filter-checkbox"
                              checked={checked}
                              onChange={() => toggleColour(opt.id)}
                              data-testid={`filter-col-${opt.id}`}
                            />
                            <span>{opt.label}</span>
                          </span>
                          <span className="filter-option-count">({matchingCount})</span>
                        </label>
                      );
                    })}
                  </div>

                  {/* Craft Lineage Facet */}
                  <div className="mb-4">
                    <h2 className="label-caps text-oxblood mb-2" style={{ fontSize: '0.6875rem' }}>
                      Craft Lineage
                    </h2>
                    {CRAFT_OPTIONS.map(opt => {
                      const checked = selectedCrafts.includes(opt.id);
                      const matchingCount = PRODUCTS.filter(p => matchesCraft(p, opt.id)).length;
                      return (
                        <label key={opt.id} className="filter-option-item">
                          <span className="d-flex align-items-center">
                            <input
                              type="checkbox"
                              className="filter-checkbox"
                              checked={checked}
                              onChange={() => toggleCraft(opt.id)}
                              data-testid={`filter-craft-${opt.id}`}
                            />
                            <span>{opt.label}</span>
                          </span>
                          <span className="filter-option-count">({matchingCount})</span>
                        </label>
                      );
                    })}
                  </div>

                  {/* Valuation (Price Tier) Facet */}
                  <div>
                    <h2 className="label-caps text-oxblood mb-2" style={{ fontSize: '0.6875rem' }}>
                      House Valuation
                    </h2>
                    <label className="filter-option-item">
                      <span className="d-flex align-items-center">
                        <input
                          type="radio"
                          name="desktop-price-tier"
                          className="filter-checkbox"
                          checked={selectedPriceTier === 'all'}
                          onChange={() => setSelectedPriceTier('all')}
                        />
                        <span>All Valuations</span>
                      </span>
                      <span className="filter-option-count">({PRODUCTS.length})</span>
                    </label>
                    {PRICE_TIERS.map(tier => {
                      const checked = selectedPriceTier === tier.id;
                      const count = PRODUCTS.filter(p => matchesPrice(p, tier.id)).length;
                      return (
                        <label key={tier.id} className="filter-option-item">
                          <span className="d-flex align-items-center">
                            <input
                              type="radio"
                              name="desktop-price-tier"
                              className="filter-checkbox"
                              checked={checked}
                              onChange={() => setSelectedPriceTier(tier.id)}
                              data-testid={`filter-price-${tier.id}`}
                            />
                            <span>{tier.label}</span>
                          </span>
                          <span className="filter-option-count">({count})</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </aside>
            )}

            {/* Product Grid Area */}
            <div className={isDesktopFiltersOpen ? 'col-12 col-lg-9' : 'col-12'}>
              {filteredAndSortedProducts.length > 0 ? (
                <div 
                  className="row g-4" 
                  data-testid="products-grid"
                >
                  {filteredAndSortedProducts.map((product, index) => {
                    const isFeaturedOrder = sortOrder === 'featured';
                    const isFlagship = (product.id === 'et-01' && isFeaturedOrder);
                    const colClass = getCardColumnClass(
                      index,
                      filteredAndSortedProducts.length,
                      isDesktopFiltersOpen,
                      isFeaturedOrder,
                      isFlagship
                    );

                    return (
                      <div 
                        key={product.id} 
                        className={`${colClass} editorial-card`}
                      >
                        <ProductCard 
                          product={product} 
                          index={index} 
                          variant={isFlagship ? 'flagship' : 'standard'} 
                        />
                      </div>
                    );
                  })}
                </div>
              ) : (
                /* Polished Editorial No-Results State */
                <div 
                  className="p-5 bg-cream border-hairline text-center my-4" 
                  data-testid="no-results-state"
                >
                  <div className="d-inline-flex align-items-center gap-2 mb-3">
                    <span style={{ width: 16, height: 1, backgroundColor: 'var(--color-champagne-thread)' }}></span>
                    <span className="label-caps text-champagne">Zero Silhouettes Found</span>
                    <span style={{ width: 16, height: 1, backgroundColor: 'var(--color-champagne-thread)' }}></span>
                  </div>
                  <h2 className="headline-md text-oxblood mb-3">
                    No Heirlooms Match This Precise Curation
                  </h2>
                  <p className="body-lg text-muted-editorial mx-auto mb-4" style={{ maxWidth: 540 }}>
                    Our permanent repertoire is deliberately restrained to seven masterwork silhouettes. Try clearing one or more facets to rediscover available pieces.
                  </p>
                  <button
                    type="button"
                    className="btn-oxblood"
                    onClick={handleResetFilters}
                    data-testid="empty-reset-filters-btn"
                  >
                    <span>Reset All Filters</span>
                    <span className="material-symbols-outlined fs-6">refresh</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* House Provenance & Assurance Note */}
      <section className="py-5 bg-cream border-hairline-t">
        <div className="page-container text-center">
          <div className="d-inline-flex align-items-center gap-2 mb-2">
            <span style={{ width: 24, height: 1, backgroundColor: 'var(--color-champagne-thread)' }}></span>
            <span className="label-caps text-champagne">Atelier Discipline</span>
            <span style={{ width: 24, height: 1, backgroundColor: 'var(--color-champagne-thread)' }}></span>
          </div>
          <h2 className="headline-md text-oxblood mb-3">
            Pure Botanical Fibers &amp; Slow Tailoring
          </h2>
          <p className="body-md text-muted-editorial mx-auto mb-4" style={{ maxWidth: 680 }}>
            Every silhouette in our permanent repertoire is commissioned with a deep reverence for ancestral handloom traditions and noble raw fibers, documenting living disciplines from Varanasi pit looms to uncut radial draping.
          </p>
          <div className="d-flex justify-content-center gap-4">
            <span className="label-caps-wide text-oxblood">Registered Archival Editions</span>
            <span className="label-caps-wide text-champagne">•</span>
            <span className="label-caps-wide text-oxblood">Bespoke Allocation Queue</span>
          </div>
        </div>
      </section>

      {/* Mobile Accessible Filter & Sort Offcanvas Modal Drawer */}
      {isMobileDrawerOpen && (
        <div 
          className="filter-drawer-backdrop"
          onClick={() => setIsMobileDrawerOpen(false)}
          aria-hidden="true"
        />
      )}

      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Filter and Sort Heirlooms"
        className={`filter-drawer-content ${isMobileDrawerOpen ? 'open' : ''}`}
        style={{ visibility: isMobileDrawerOpen ? 'visible' : 'hidden' }}
        data-testid="mobile-filter-drawer"
      >
        {/* Drawer Header */}
        <div className="d-flex align-items-center justify-content-between p-4 bg-cream border-hairline-b">
          <div>
            <span className="label-caps text-champagne d-block mb-1">Refine Silhouettes</span>
            <h2 className="title-md text-oxblood mb-0">Filters &amp; Sorting</h2>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            className="action-icon-btn p-2"
            onClick={() => {
              setIsMobileDrawerOpen(false);
              openTriggerRef.current?.focus();
            }}
            aria-label="Close filters drawer"
            data-testid="close-mobile-drawer"
          >
            <span className="material-symbols-outlined fs-5">close</span>
          </button>
        </div>

        {/* Drawer Scrollable Body */}
        <div className="flex-grow-1 overflow-y-auto p-4">
          {/* Sorting Group in Drawer */}
          <div className="mb-4 pb-3 border-hairline-b">
            <h3 className="label-caps text-oxblood mb-2" style={{ fontSize: '0.6875rem' }}>
              Sort Catalogue
            </h3>
            <select
              className="sort-select w-100"
              value={sortOrder}
              onChange={e => setSortOrder(e.target.value as SortOrder)}
              data-testid="mobile-sort-select"
              aria-label="Sort silhouettes in drawer"
            >
              <option value="featured">Featured (Atelier Order)</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>

          {/* Category Facet */}
          <div className="mb-4 pb-3 border-hairline-b">
            <h3 className="label-caps text-oxblood mb-2" style={{ fontSize: '0.6875rem' }}>
              Silhouette Category
            </h3>
            {CATEGORY_OPTIONS.map(cat => (
              <label key={cat.id} className="filter-option-item">
                <span className="d-flex align-items-center">
                  <input
                    type="radio"
                    name="mobile-cat-filter"
                    className="filter-checkbox"
                    checked={selectedCategory === cat.id}
                    onChange={() => setSelectedCategory(cat.id)}
                    data-testid={`mobile-cat-${cat.id.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                  />
                  <span>{cat.label}</span>
                </span>
                <span className="filter-option-count">({cat.count})</span>
              </label>
            ))}
          </div>

          {/* Material Facet */}
          <div className="mb-4 pb-3 border-hairline-b">
            <h3 className="label-caps text-oxblood mb-2" style={{ fontSize: '0.6875rem' }}>
              Fiber &amp; Material
            </h3>
            {MATERIAL_OPTIONS.map(opt => {
              const checked = selectedMaterials.includes(opt.id);
              const matchingCount = PRODUCTS.filter(p => matchesMaterial(p, opt.id)).length;
              return (
                <label key={opt.id} className="filter-option-item">
                  <span className="d-flex align-items-center">
                    <input
                      type="checkbox"
                      className="filter-checkbox"
                      checked={checked}
                      onChange={() => toggleMaterial(opt.id)}
                      data-testid={`mobile-filter-mat-${opt.id}`}
                    />
                    <span>{opt.label}</span>
                  </span>
                  <span className="filter-option-count">({matchingCount})</span>
                </label>
              );
            })}
          </div>

          {/* Colour Facet */}
          <div className="mb-4 pb-3 border-hairline-b">
            <h3 className="label-caps text-oxblood mb-2" style={{ fontSize: '0.6875rem' }}>
              Colour Palette
            </h3>
            {COLOUR_OPTIONS.map(opt => {
              const checked = selectedColours.includes(opt.id);
              const matchingCount = PRODUCTS.filter(p => matchesColour(p, opt.id)).length;
              return (
                <label key={opt.id} className="filter-option-item">
                  <span className="d-flex align-items-center">
                    <input
                      type="checkbox"
                      className="filter-checkbox"
                      checked={checked}
                      onChange={() => toggleColour(opt.id)}
                      data-testid={`mobile-filter-col-${opt.id}`}
                    />
                    <span>{opt.label}</span>
                  </span>
                  <span className="filter-option-count">({matchingCount})</span>
                </label>
              );
            })}
          </div>

          {/* Craft Facet */}
          <div className="mb-4 pb-3 border-hairline-b">
            <h3 className="label-caps text-oxblood mb-2" style={{ fontSize: '0.6875rem' }}>
              Craft Lineage
            </h3>
            {CRAFT_OPTIONS.map(opt => {
              const checked = selectedCrafts.includes(opt.id);
              const matchingCount = PRODUCTS.filter(p => matchesCraft(p, opt.id)).length;
              return (
                <label key={opt.id} className="filter-option-item">
                  <span className="d-flex align-items-center">
                    <input
                      type="checkbox"
                      className="filter-checkbox"
                      checked={checked}
                      onChange={() => toggleCraft(opt.id)}
                      data-testid={`mobile-filter-craft-${opt.id}`}
                    />
                    <span>{opt.label}</span>
                  </span>
                  <span className="filter-option-count">({matchingCount})</span>
                </label>
              );
            })}
          </div>

          {/* Valuation (Price Tier) Facet */}
          <div>
            <h3 className="label-caps text-oxblood mb-2" style={{ fontSize: '0.6875rem' }}>
              House Valuation
            </h3>
            <label className="filter-option-item">
              <span className="d-flex align-items-center">
                <input
                  type="radio"
                  name="mobile-price-tier"
                  className="filter-checkbox"
                  checked={selectedPriceTier === 'all'}
                  onChange={() => setSelectedPriceTier('all')}
                />
                <span>All Valuations</span>
              </span>
              <span className="filter-option-count">({PRODUCTS.length})</span>
            </label>
            {PRICE_TIERS.map(tier => {
              const checked = selectedPriceTier === tier.id;
              const count = PRODUCTS.filter(p => matchesPrice(p, tier.id)).length;
              return (
                <label key={tier.id} className="filter-option-item">
                  <span className="d-flex align-items-center">
                    <input
                      type="radio"
                      name="mobile-price-tier"
                      className="filter-checkbox"
                      checked={checked}
                      onChange={() => setSelectedPriceTier(tier.id)}
                      data-testid={`mobile-filter-price-${tier.id}`}
                    />
                    <span>{tier.label}</span>
                  </span>
                  <span className="filter-option-count">({count})</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Drawer Action Controls Footer */}
        <div className="p-3 bg-cream border-hairline-t d-flex gap-2">
          <button
            type="button"
            className="btn-outline-editorial flex-fill py-3"
            onClick={handleResetFilters}
            data-testid="mobile-reset-btn"
          >
            Reset
          </button>
          <button
            type="button"
            className="btn-oxblood flex-fill py-3"
            onClick={() => {
              setIsMobileDrawerOpen(false);
              openTriggerRef.current?.focus();
            }}
            data-testid="mobile-apply-btn"
          >
            Apply ({filteredAndSortedProducts.length})
          </button>
        </div>
      </div>
    </main>
  );
};
