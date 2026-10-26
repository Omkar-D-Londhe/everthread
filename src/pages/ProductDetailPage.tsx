import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getCatalogueProductBySlug, PRODUCTS } from '../data/products.ts';
import { ProductColorVariant, isTraditional, Product } from '../types/catalog.ts';
import { PRODUCT_ASSET_MAP, ResponsiveImage } from '../data/assetMap.ts';
import { useCart } from '../context/CartContext.tsx';
import { useSaved } from '../context/SavedContext.tsx';
import { getStoryBySlug } from '../data/stories.ts';
import { ProductCard } from '../components/ProductCard.tsx';
import { ProductImageStage } from '../components/ProductImageStage.tsx';
import { AtelierLensModal } from '../components/AtelierLensModal.tsx';
import { useEditorialScroll } from '../hooks/useEditorialScroll.ts';

export const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const product = slug ? getCatalogueProductBySlug(slug) : undefined;

  const { addToBag } = useCart();
  const { isSaved, toggleSaved } = useSaved();

  // Selected State
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [prevImage, setPrevImage] = useState<ResponsiveImage | null>(null);
  const [selectedColor, setSelectedColor] = useState<ProductColorVariant | undefined>(undefined);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [addedSuccess, setAddedSuccess] = useState<boolean>(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState<boolean>(false);
  const [isLensOpen, setIsLensOpen] = useState<boolean>(false);
  const mainRef = useRef<HTMLElement>(null);

  useEditorialScroll({
    scopeRef: mainRef,
    headerSelector: '.editorial-enter',
    sectionSelector: '.editorial-section',
    deps: [product?.id]
  });

  // Accordion open states
  const [openAccordions, setOpenAccordions] = useState<Record<string, boolean>>({
    specs: true,
    care: false,
    allocation: false,
    integrity: false
  });

  // Re-synchronize state whenever product/slug changes
  useEffect(() => {
    if (product) {
      setActiveImageIndex(0);
      setPrevImage(null);
      setSelectedColor(product.colors[0]);
      if ('sizes' in product && Array.isArray((product as Product).sizes)) {
        if (product.category === 'Accessories') {
          setSelectedSize((product as Product).sizes[0] || 'One Size');
        } else {
          setSelectedSize((product as Product).sizes[0] || 'II (M)');
        }
      }
      setQuantity(1);
      setValidationError(null);
      setAddedSuccess(false);
      setIsSizeGuideOpen(false);
    }
  }, [product?.id, slug]);

  const handleSelectImage = (idx: number) => {
    if (idx === activeImageIndex) return;
    if (product) {
      const currentGallery = PRODUCT_ASSET_MAP[product.id]?.gallery || [PRODUCT_ASSET_MAP[product.id]?.primary];
      const currentImg = currentGallery[activeImageIndex] || PRODUCT_ASSET_MAP[product.id]?.primary;
      if (currentImg) {
        setPrevImage(currentImg);
      }
    }
    setActiveImageIndex(idx);
  };

  const toggleAccordion = (section: string) => {
    setOpenAccordions(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // If product is not found in catalogue
  if (!product) {
    return (
      <main id="main-content" className="main-content">
        <div className="py-2 border-hairline-b bg-stone">
          <div className="page-container">
            <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb mb-0 body-sm">
                  <li className="breadcrumb-item"><Link to="/" className="text-muted-editorial">Home</Link></li>
                  <li className="breadcrumb-item"><Link to="/collections" className="text-muted-editorial">Collections</Link></li>
                  <li className="breadcrumb-item active text-oxblood" aria-current="page">Uncatalogued Silhouette</li>
                </ol>
              </nav>
              <span className="label-caps-wide text-muted-editorial" data-testid="archival-identifier">
                Identifier: {slug}
              </span>
            </div>
          </div>
        </div>

        <section className="py-5 bg-canvas">
          <div className="page-container text-center py-5">
            <div className="p-5 bg-cream border-hairline mx-auto" style={{ maxWidth: 640 }} data-testid="product-not-found">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" className="text-champagne mb-3" aria-hidden="true">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <line x1="3" y1="9" x2="21" y2="9"/>
                <line x1="3" y1="15" x2="21" y2="15"/>
                <line x1="9" y1="3" x2="9" y2="21"/>
                <line x1="15" y1="3" x2="15" y2="21"/>
              </svg>
              <span className="label-caps-wide text-champagne d-block mb-2">House Ledger Registry</span>
              <h1 className="headline-md text-oxblood mb-3">Archival Specimen Not Found</h1>
              <p className="body-lg text-muted-editorial mb-4">
                The requested silhouette identifier (<strong className="text-oxblood">{slug}</strong>) is not catalogued in our permanent collection.
              </p>
              <div className="d-flex justify-content-center gap-3 flex-wrap">
                <Link to="/collections" className="btn-oxblood">
                  Return to Curated Repertoire
                </Link>
                <Link to="/" className="btn-outline-editorial">
                  Atelier Home
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    );
  }

  // If product is an unlisted traditional concept piece (Stage 02 PDP guard)
  if (isTraditional(product) || ('isListed' in product && !product.isListed)) {
    return (
      <main id="main-content" className="main-content" role="status">
        <div className="py-2 border-hairline-b bg-stone">
          <div className="page-container">
            <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb mb-0 body-sm">
                  <li className="breadcrumb-item"><Link to="/" className="text-muted-editorial">Home</Link></li>
                  <li className="breadcrumb-item"><Link to="/collections" className="text-muted-editorial">Collections</Link></li>
                  <li className="breadcrumb-item active text-oxblood" aria-current="page">{product.title}</li>
                </ol>
              </nav>
              <span className="label-caps-wide text-muted-editorial" data-testid="archival-identifier">
                Identifier: {product.id.toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        <section className="py-5 bg-canvas">
          <div className="page-container text-center py-5">
            <div className="p-5 bg-cream border-hairline mx-auto" style={{ maxWidth: 640 }} data-testid="product-not-available">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" className="text-champagne mb-3" aria-hidden="true">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <line x1="3" y1="9" x2="21" y2="9"/>
                <line x1="3" y1="15" x2="21" y2="15"/>
                <line x1="9" y1="3" x2="9" y2="21"/>
                <line x1="15" y1="3" x2="15" y2="21"/>
              </svg>
              <span className="label-caps-wide text-champagne d-block mb-2">Curatorial Status</span>
              <h1 className="headline-md text-oxblood mb-3">This piece is not currently available</h1>
              <p className="body-lg text-muted-editorial mb-4">
                This exploratory concept specification is currently undergoing archival documentation and is not available for purchase or allocation.
              </p>
              <div className="d-flex justify-content-center gap-3 flex-wrap">
                <Link to="/collections" className="btn-oxblood">
                  Return to Curated Repertoire
                </Link>
                <Link to="/" className="btn-outline-editorial">
                  Atelier Home
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    );
  }

  // Gallery resolution from asset map
  const assetRecord = PRODUCT_ASSET_MAP[product.id];
  const galleryImages: ResponsiveImage[] = assetRecord?.gallery && assetRecord.gallery.length > 0
    ? assetRecord.gallery
    : product.gallery && product.gallery.length > 0
      ? product.gallery
      : [{
          src: product.image,
          srcSet: `${product.image} 1200w`,
          sizes: '(max-width: 768px) 100vw, 50vw',
          width: 1024,
          height: 1536,
          alt: product.imageAlt || product.title,
          label: 'Primary View'
        }];

  const currentImage = galleryImages[activeImageIndex] || galleryImages[0];
  const isApparel = product.category !== 'Accessories';
  const saved = isSaved(product.id);

  // Add to Bag handler
  const handleAddToBag = () => {
    if (isApparel && !selectedSize) {
      setValidationError('Please select a bespoke size before adding to your bag.');
      return;
    }
    setValidationError(null);

    addToBag({
      productId: product.id,
      size: selectedSize || (product.sizes[0] || 'Standard'),
      color: selectedColor?.name || product.colors[0]?.name || 'Signature',
      quantity
    });

    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 5000);
  };

  // Resolve related archive stories
  const relatedStories = (product.relatedStorySlugs || [])
    .map(storySlug => getStoryBySlug(storySlug))
    .filter((s): s is NonNullable<typeof s> => !!s);

  // Complementary silhouettes (exclude current product)
  const complementaryProducts = PRODUCTS.filter(p => p.id !== product.id).slice(0, 3);

  return (
    <main id="main-content" className="main-content" ref={mainRef}>
      {/* Top Breadcrumb & Archival Identifier Bar */}
      <div className="py-2 border-hairline-b bg-stone">
        <div className="page-container">
          <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb mb-0 body-sm">
                <li className="breadcrumb-item"><Link to="/" className="text-muted-editorial">Home</Link></li>
                <li className="breadcrumb-item"><Link to="/collections" className="text-muted-editorial">Collections</Link></li>
                <li className="breadcrumb-item"><span className="text-muted-editorial">{product.category}</span></li>
                <li className="breadcrumb-item active text-oxblood fw-medium" aria-current="page">{product.title}</li>
              </ol>
            </nav>
            <span className="label-caps-wide text-muted-editorial" data-testid="archival-identifier">
              Identifier: {slug}
            </span>
          </div>
        </div>
      </div>

      {/* Main Product Showcase: Gallery + Details */}
      <section className="py-5 bg-canvas">
        <div className="page-container">
          <div className="row g-5">
            {/* Left Column: Product Gallery */}
            <div className="col-12 col-lg-7">
              <div className="position-sticky" style={{ top: 'calc(var(--header-height) + 1.5rem)' }}>
                {/* Responsive Portrait/Landscape Product Image Stage */}
                <ProductImageStage
                  image={currentImage}
                  prevImage={prevImage}
                  edition={product.edition}
                  onAnimationEnd={() => setPrevImage(null)}
                  onInspectClick={() => setIsLensOpen(true)}
                />

                {/* Thumbnails Navigation Strip (Overflow-protected) */}
                {galleryImages.length > 1 && (
                  <div className="w-100 overflow-hidden" style={{ minWidth: 0, maxWidth: '100%' }}>
                    <div 
                      className="d-flex gap-2 overflow-x-auto pt-3 pb-2 w-100" 
                      role="tablist" 
                      aria-label="Product Image Views"
                      data-testid="gallery-thumbnails"
                      style={{ WebkitOverflowScrolling: 'touch' }}
                    >
                      {galleryImages.map((img, idx) => {
                        const isSelected = idx === activeImageIndex;
                        return (
                          <button
                            key={`${img.src}-${idx}`}
                            type="button"
                            role="tab"
                            aria-selected={isSelected}
                            aria-label={`Select view ${idx + 1}: ${img.label || img.alt || `Angle ${idx + 1}`}`}
                            className={`gallery-thumb-btn ${isSelected ? 'active' : ''}`}
                            onClick={() => handleSelectImage(idx)}
                            data-testid={`gallery-thumb-${idx}`}
                          >
                            <img
                              src={img.src}
                              alt={img.alt || `${product.title} thumbnail ${idx + 1}`}
                              width={80}
                              height={100}
                              loading="lazy"
                            />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Product Information, Actions & Accordions */}
            <div className="col-12 col-lg-5">
              {/* Product Header */}
              <div className="d-flex align-items-center gap-2 mb-2 flex-wrap editorial-enter">
                <span className="label-caps text-champagne">{product.category}</span>
                <span className="text-champagne">•</span>
                <span className="label-caps text-muted-editorial">{product.status}</span>
                <span className="text-champagne">•</span>
                <span className="badge badge-sand text-oxblood body-sm px-2 py-0" style={{ fontSize: '0.625rem', letterSpacing: '0.05em' }}>
                  Editorial Demonstration
                </span>
              </div>

              <h1 className="headline-lg text-oxblood mb-2 editorial-enter" data-testid="product-title" style={{ fontSize: '2.5rem' }}>
                {product.title}
              </h1>

              {product.subtitle && (
                <p className="body-lg text-muted-editorial fst-italic mb-3 editorial-enter" data-testid="product-subtitle">
                  {product.subtitle}
                </p>
              )}

              {/* Dynamic Price Render */}
              <div className="d-flex align-items-baseline gap-3 mb-4 pb-3 border-hairline-b editorial-enter">
                <span className="headline-sm text-oxblood fw-bold" data-testid="product-price">
                  {product.currency}{product.price.toLocaleString('en-IN')}
                </span>
                <span className="body-sm text-muted-editorial">
                  House Ledger Valuation
                </span>
              </div>

              {/* Narrative Description */}
              <p className="body-md text-on-surface mb-4">
                {product.description}
              </p>

              {/* Variant 1: Colourway Selector */}
              <div className="mb-4">
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <span className="label-caps text-oxblood">
                    Colourway: <strong className="text-oxblood fw-bold" data-testid="selected-color-name">{selectedColor?.name || 'Signature'}</strong>
                  </span>
                  <span className="body-sm text-muted-editorial" style={{ fontSize: '0.75rem' }}>
                    {product.colors.length} {product.colors.length === 1 ? 'shade' : 'shades'} available
                  </span>
                </div>

                <div 
                  className="d-flex flex-wrap gap-2" 
                  role="radiogroup" 
                  aria-label="Available Colourways"
                  data-testid="color-selector"
                >
                  {product.colors.map(color => {
                    const isSelected = selectedColor?.id === color.id;
                    return (
                      <button
                        key={color.id}
                        type="button"
                        role="radio"
                        aria-checked={isSelected}
                        className={`color-option-btn ${isSelected ? 'active' : ''}`}
                        onClick={() => setSelectedColor(color)}
                        data-testid={`color-option-${color.id}`}
                      >
                        <span 
                          className="color-option-swatch" 
                          style={{ backgroundColor: color.hex }}
                          aria-hidden="true"
                        />
                        <span>{color.name}</span>
                      </button>
                    );
                  })}
                </div>
                <p className="body-sm text-muted-editorial mt-1 mb-0" style={{ fontSize: '0.75rem' }}>
                  * Bespoke Vegetal Dye Allocation: Hand-dyed upon commission. Shown in atelier signature tone.
                </p>
              </div>

              {/* Variant 2: Size Selector (Apparel Only) or Dimension Note (Accessories) */}
              {isApparel ? (
                <div className="mb-4">
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <span className="label-caps text-oxblood">
                      Bespoke Fit / Size: <strong className="text-oxblood fw-bold">{selectedSize || 'Select Size'}</strong>
                    </span>
                    <button
                      type="button"
                      className="btn-link text-oxblood body-sm p-0 border-0 bg-transparent"
                      style={{ textDecoration: 'underline', fontSize: '0.75rem' }}
                      onClick={() => setIsSizeGuideOpen(prev => !prev)}
                      aria-expanded={isSizeGuideOpen}
                      data-testid="size-guide-toggle"
                    >
                      {isSizeGuideOpen ? 'Hide Size Matrix' : 'View Size Matrix'}
                    </button>
                  </div>

                  <div 
                    className="d-flex flex-wrap gap-2" 
                    role="radiogroup" 
                    aria-label="Bespoke Garment Sizes"
                    data-testid="size-selector"
                  >
                    {product.sizes.map(size => {
                      const isSelected = selectedSize === size;
                      return (
                        <button
                          key={size}
                          type="button"
                          role="radio"
                          aria-checked={isSelected}
                          className={`variant-option-btn ${isSelected ? 'active' : ''}`}
                          onClick={() => {
                            setSelectedSize(size);
                            setValidationError(null);
                          }}
                          data-testid={`size-option-${size.replace(/[^a-zA-Z0-9]/g, '-')}`}
                        >
                          {size}
                        </button>
                      );
                    })}
                  </div>

                  {/* Expandable Size Matrix */}
                  {isSizeGuideOpen && (
                    <div className="mt-3 p-3 bg-stone border-hairline" data-testid="size-matrix-panel">
                      <div className="d-flex align-items-center justify-content-between mb-2">
                        <span className="label-caps text-champagne">Guild Anatomical Proportion Matrix</span>
                        <span className="label-caps-wide text-muted-editorial" style={{ fontSize: '0.625rem' }}>
                          Standard Reference
                        </span>
                      </div>
                      <table className="table table-sm table-borderless body-sm mb-2">
                        <thead>
                          <tr className="border-bottom border-hairline text-muted-editorial">
                            <th>Grade</th>
                            <th>Chest</th>
                            <th>Waist</th>
                            <th>Hips</th>
                            <th>Length</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr><td>I (XS–S)</td><td>34–36″</td><td>28–30″</td><td>36–38″</td><td>46″</td></tr>
                          <tr><td>II (M)</td><td>38–40″</td><td>32–34″</td><td>40–42″</td><td>47″</td></tr>
                          <tr><td>III (L–XL)</td><td>42–44″</td><td>36–38″</td><td>44–46″</td><td>48″</td></tr>
                        </tbody>
                      </table>
                      <p className="body-sm text-muted-editorial mb-0" style={{ fontSize: '0.75rem' }}>
                        * Standard pattern sample dimensions. For Bespoke Measurement, personal measurements are simulated for this demonstration.
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                /* Dimension Specification for Bags and Scarves (No apparel sizes) */
                <div className="mb-4 p-3 bg-stone border-hairline" data-testid="accessory-dimension-spec">
                  <span className="label-caps text-champagne d-block mb-1">Architectural Dimension Specification</span>
                  <p className="body-md text-oxblood mb-0 fw-medium">
                    {product.sizes[0] || 'One Size Atelier Specification'}
                  </p>
                </div>
              )}

              {/* Quantity Selector & Allocation Speed */}
              <div className="d-flex align-items-center gap-4 mb-4">
                <div>
                  <span className="label-caps text-oxblood d-block mb-2">Quantity</span>
                  <div className="quantity-control" data-testid="quantity-control">
                    <button
                      type="button"
                      className="qty-btn"
                      onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                      disabled={quantity <= 1}
                      aria-label="Decrease quantity"
                      data-testid="qty-minus"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <line x1="5" y1="12" x2="19" y2="12"/>
                      </svg>
                    </button>
                    <span className="qty-display" data-testid="qty-value">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      className="qty-btn"
                      onClick={() => setQuantity(prev => Math.min(10, prev + 1))}
                      disabled={quantity >= 10}
                      aria-label="Increase quantity"
                      data-testid="qty-plus"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <line x1="12" y1="5" x2="12" y2="19"/>
                        <line x1="5" y1="12" x2="19" y2="12"/>
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="pt-3">
                  <span className="label-caps-wide text-muted-editorial d-block" style={{ fontSize: '0.625rem' }}>
                    Production Lead Time
                  </span>
                  <span className="body-sm text-oxblood fw-medium">
                    {product.leadTime} <span className="text-muted-editorial fst-italic body-sm">(Simulated)</span>
                  </span>
                </div>
              </div>

              {/* Validation Warning */}
              {validationError && (
                <div className="alert alert-warning border-hairline p-3 mb-3 body-sm" role="alert" data-testid="validation-error">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="align-middle me-1" aria-hidden="true">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="16" x2="12" y2="12"/>
                    <line x1="12" y1="8" x2="12.01" y2="8"/>
                  </svg>
                  {validationError}
                </div>
              )}

              {/* Product Actions: Add to Bag & Save Piece */}
              <div className="d-flex gap-3 mb-4 flex-wrap">
                <button
                  type="button"
                  className="btn-oxblood flex-grow-1 py-3 px-4 d-inline-flex align-items-center justify-content-center gap-2"
                  onClick={handleAddToBag}
                  data-testid="add-to-bag-btn"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                    <line x1="3" y1="6" x2="21" y2="6"/>
                    <path d="M16 10a4 4 0 0 1-8 0"/>
                  </svg>
                  <span>Acquire for Bespoke Bag</span>
                </button>

                <button
                  type="button"
                  className={`btn-outline-editorial py-3 px-4 d-inline-flex align-items-center justify-content-center gap-2 ${saved ? 'bg-oxblood text-white' : ''}`}
                  onClick={() => toggleSaved(product.id)}
                  aria-label={saved ? `Remove ${product.title} from Saved Pieces` : `Save ${product.title} to Saved Pieces`}
                  aria-pressed={saved}
                  data-testid="save-piece-btn"
                >
                  {saved ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
                    </svg>
                  )}
                  <span className="d-none d-sm-inline">{saved ? 'Saved' : 'Save Piece'}</span>
                </button>
              </div>

              {/* Success Notification Feedback */}
              {addedSuccess && (
                <div 
                  className="p-3 bg-stone border-champagne mb-4 body-sm d-flex align-items-center justify-content-between"
                  data-testid="added-to-bag-toast"
                >
                  <div className="d-flex align-items-center gap-2">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-champagne flex-shrink-0" aria-hidden="true">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                      <polyline points="22 4 12 14.01 9 11.01"/>
                    </svg>
                    <span>Piece added to your demonstration bag.</span>
                  </div>
                  <Link to="/bag" className="link-editorial">
                    View Bespoke Bag →
                  </Link>
                </div>
              )}

              {/* Atelier Expandable Accordions */}
              <div className="border-hairline-t pt-2">
                {/* Accordion 1: Textile Architecture & Weave Specifications */}
                <div>
                  <button
                    type="button"
                    className="accordion-editorial-btn"
                    onClick={() => toggleAccordion('specs')}
                    aria-expanded={openAccordions.specs}
                    aria-controls="accordion-body-specs"
                    data-testid="accordion-toggle-specs"
                  >
                    <span>Textile Architecture &amp; Weave Specifications</span>
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={`accordion-chevron ${openAccordions.specs ? 'accordion-chevron--open' : ''}`}
                      aria-hidden="true"
                    >
                      <polyline points="6 9 12 15 18 9"/>
                    </svg>
                  </button>
                  {openAccordions.specs && (
                    <div id="accordion-body-specs" className="accordion-editorial-body body-sm" data-testid="accordion-content-specs">
                      <div className="spec-grid mb-3">
                        <span className="text-muted-editorial">Fiber Composition:</span>
                        <strong className="text-on-surface">{product.fiberPurity}</strong>

                        <span className="text-muted-editorial">Weave Technique:</span>
                        <strong className="text-on-surface">{product.weaveType}</strong>

                        <span className="text-muted-editorial">Cultural Origin / Lineage:</span>
                        <strong className="text-on-surface">{product.origin}</strong>

                        <span className="text-muted-editorial">Warp Density:</span>
                        <strong className="text-on-surface">{product.warpDensity}</strong>

                        <span className="text-muted-editorial">Estimated Labor Benchmark:</span>
                        <strong className="text-on-surface">{product.artisanHours}</strong>
                      </div>
                      <p className="body-sm text-muted-editorial mb-0 fst-italic" style={{ fontSize: '0.75rem' }}>
                        * Warp density and labor figures are curated craft benchmarks illustrating handloom complexity, not audited payroll or laboratory certification records.
                      </p>
                    </div>
                  )}
                </div>

                {/* Accordion 2: Conservation & Archival Care */}
                <div>
                  <button
                    type="button"
                    className="accordion-editorial-btn"
                    onClick={() => toggleAccordion('care')}
                    aria-expanded={openAccordions.care}
                    aria-controls="accordion-body-care"
                    data-testid="accordion-toggle-care"
                  >
                    <span>Conservation &amp; Archival Care</span>
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={`accordion-chevron ${openAccordions.care ? 'accordion-chevron--open' : ''}`}
                      aria-hidden="true"
                    >
                      <polyline points="6 9 12 15 18 9"/>
                    </svg>
                  </button>
                  {openAccordions.care && (
                    <div id="accordion-body-care" className="accordion-editorial-body body-sm" data-testid="accordion-content-care">
                      <p className="body-sm text-muted-editorial mb-3" style={{ fontSize: '0.8125rem' }}>
                        General Heirloom Conservation Guidance: The following recommendations reflect standard archival care practices for noble natural fibers. Provided as general educational advice for garment longevity.
                      </p>
                      <ul className="mb-0 ps-3">
                        {product.careInstructions.map((instruction, index) => (
                          <li key={index} className="mb-2 text-on-surface">
                            {instruction}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Accordion 3: Commission Terms & Allocation */}
                <div>
                  <button
                    type="button"
                    className="accordion-editorial-btn"
                    onClick={() => toggleAccordion('allocation')}
                    aria-expanded={openAccordions.allocation}
                    aria-controls="accordion-body-allocation"
                    data-testid="accordion-toggle-allocation"
                  >
                    <span>Commission Terms &amp; Allocation</span>
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={`accordion-chevron ${openAccordions.allocation ? 'accordion-chevron--open' : ''}`}
                      aria-hidden="true"
                    >
                      <polyline points="6 9 12 15 18 9"/>
                    </svg>
                  </button>
                  {openAccordions.allocation && (
                    <div id="accordion-body-allocation" className="accordion-editorial-body body-sm" data-testid="accordion-content-allocation">
                      <div className="p-3 bg-stone border-hairline mb-3">
                        <span className="label-caps text-champagne d-block mb-1">Demonstration Notice</span>
                        <p className="body-sm text-oxblood mb-0">
                          EverThread is an editorial frontend case study. Edition limits, bespoke allocation queues, and checkout flows are simulated for demonstration.
                        </p>
                      </div>
                      <p className="mb-2"><strong>Registered Edition:</strong> {product.edition} <span className="text-muted-editorial fst-italic">(Demonstration constraint)</span></p>
                      <p className="mb-2"><strong>Estimated Atelier Lead Time:</strong> {product.leadTime} <span className="text-muted-editorial fst-italic">(Simulated scheduling)</span></p>
                      <p className="text-muted-editorial mb-0"><strong>Allocation Terms:</strong> {product.statusDisclaimer}</p>
                    </div>
                  )}
                </div>

                {/* Accordion 4: Content Integrity & Provenance Disclosure */}
                <div>
                  <button
                    type="button"
                    className="accordion-editorial-btn"
                    onClick={() => toggleAccordion('integrity')}
                    aria-expanded={openAccordions.integrity}
                    aria-controls="accordion-body-integrity"
                    data-testid="accordion-toggle-integrity"
                  >
                    <span>Content Integrity &amp; Provenance Disclosure</span>
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={`accordion-chevron ${openAccordions.integrity ? 'accordion-chevron--open' : ''}`}
                      aria-hidden="true"
                    >
                      <polyline points="6 9 12 15 18 9"/>
                    </svg>
                  </button>
                  {openAccordions.integrity && (
                    <div id="accordion-body-integrity" className="accordion-editorial-body body-sm" data-testid="accordion-content-integrity">
                      <div className="p-3 bg-stone border-hairline mb-3">
                        <div className="d-flex align-items-center gap-2 mb-1">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-champagne flex-shrink-0" aria-hidden="true">
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                            <polyline points="9 12 11 14 15 10"/>
                          </svg>
                          <span className="label-caps text-champagne">Content Integrity Standard</span>
                        </div>
                        <p className="body-sm text-on-surface mb-0">
                          EverThread strictly distinguishes documented cultural textile heritage (such as Varanasi Kadwa zari, Changthangi pashmina, and Chanderi weaving) from conceptual brand storytelling.
                        </p>
                      </div>
                      <span className="label-caps text-oxblood d-block mb-2">Editorial Disclosures for this Silhouette</span>
                      <ul className="mb-0 ps-3">
                        {product.contentFlags.unsupportedClaims.map((claim, idx) => (
                          <li key={idx} className="mb-2 text-muted-editorial">
                            {claim}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Cultural Archive Folios */}
      {relatedStories.length > 0 && (
        <section className="py-5 bg-cream border-hairline-t editorial-section" data-testid="related-stories-section">
          <div className="page-container">
            <div className="d-flex align-items-center gap-2 mb-2">
              <span style={{ width: 24, height: 1, backgroundColor: 'var(--color-champagne-thread)' }}></span>
              <span className="label-caps text-champagne">Cultural Archive Connection</span>
              <span style={{ width: 24, height: 1, backgroundColor: 'var(--color-champagne-thread)' }}></span>
            </div>
            <h2 className="headline-md text-oxblood mb-2">
              Documented Weave Lineage &amp; Folios
            </h2>
            <p className="body-sm text-muted-editorial mb-4" style={{ maxWidth: 720 }}>
              These archival folios document living handloom traditions and drape geometries that inform our silhouette designs. Certain masterweaver workshops and studio personas are presented as curated illustrative profiles.
            </p>

            <div className="row g-4">
              {relatedStories.map(story => (
                <div key={story.id} className="col-12 col-md-6 editorial-card">
                  <div className="p-4 bg-canvas border-hairline h-100 d-flex flex-column" data-testid={`related-story-${story.slug}`}>
                    <div className="d-flex align-items-center justify-content-between mb-1">
                      <span className="label-caps text-champagne">{story.chapter} • {story.folio}</span>
                      {story.contentFlags?.isPersonaIllustrative && (
                        <span className="badge badge-sand text-oxblood" style={{ fontSize: '0.5625rem' }}>
                          Illustrative Persona
                        </span>
                      )}
                    </div>
                    <h3 className="headline-sm text-oxblood mb-2">
                      <Link to={`/archive/${story.slug}`} className="text-oxblood text-decoration-none">
                        {story.title}
                      </Link>
                    </h3>
                    <p className="body-sm text-muted-editorial fst-italic mb-2">{story.subtitle}</p>
                    <p className="body-sm text-on-surface mb-4 flex-grow-1">{story.summary}</p>
                    <Link to={`/archive/${story.slug}`} className="link-editorial mt-auto">
                      Examine Cultural Folio →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Complementary Silhouettes (Related Products) */}
      <section className="py-5 bg-canvas border-hairline-t editorial-section" data-testid="related-products-section">
        <div className="page-container">
          <div className="d-flex align-items-center justify-content-between mb-4">
            <div>
              <span className="label-caps text-champagne d-block mb-1">House Curation</span>
              <h2 className="headline-md text-oxblood mb-0">Complementary Heirlooms</h2>
            </div>
            <Link to="/collections" className="link-editorial d-none d-sm-inline-flex">
              View All 7 Silhouettes →
            </Link>
          </div>

          <div className="row g-4">
            {complementaryProducts.map(compProduct => (
              <div key={compProduct.id} className="col-12 col-md-4 editorial-card">
                <ProductCard product={compProduct} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Atelier Fabric Inspection Lens Modal (Supports All 7 Silhouettes with Active Image Binding) */}
      <AtelierLensModal
        isOpen={isLensOpen}
        onClose={() => setIsLensOpen(false)}
        imageSrc={currentImage.src}
        imageAlt={currentImage.alt}
        naturalWidth={currentImage.width}
        naturalHeight={currentImage.height}
        fallbackImageSrc={currentImage.src}
        title={`${product.title} — Textile Architecture`}
        subtitle={`${product.fiberPurity} • ${product.weaveType}`}
        caption={`High-resolution atelier inspection of ${product.title}. Examined under natural light to reveal the ${product.warpDensity} structural density and authentic handloom surface geometry.`}
        zoom={3.5}
        restoreFocusSelector='[data-testid="inspect-fabric-lens-btn"]'
      />
    </main>
  );
};
