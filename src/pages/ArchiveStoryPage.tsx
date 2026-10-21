import React, { useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getStoryBySlug, STORIES } from '../data/stories.ts';
import { getProductBySlug } from '../data/products.ts';
import { Product } from '../types/catalog.ts';
import { PRODUCT_ASSET_MAP } from '../data/assetMap.ts';
import { LoomThreadPathIllustration } from '../components/archive/ArchiveIllustrations.tsx';
import { useEditorialScroll } from '../hooks/useEditorialScroll.ts';

export const ArchiveStoryPage: React.FC = () => {
  const { storySlug } = useParams<{ storySlug: string }>();
  const story = storySlug ? getStoryBySlug(storySlug) : undefined;

  // Handle Invalid / Non-Existent Story Slug
  if (!story) {
    return (
      <main id="main-content" className="main-content bg-canvas" data-testid="archive-story-page">
        <section className="py-5">
          <div className="page-container">
            <div className="empty-curation-box" data-testid="story-not-found">
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-champagne mb-3"
                aria-hidden="true"
                data-testid="story-not-found-icon"
              >
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
              </svg>
              <h1 className="headline-md text-oxblood mb-2">Exhibition Folio Not Found</h1>
              <p className="body-md text-muted-editorial mx-auto mb-4" style={{ maxWidth: 540 }}>
                The requested archival monograph &ldquo;{storySlug}&rdquo; has not been catalogued in Volume I of the Cultural Archive.
              </p>
              <Link to="/archive" className="btn-oxblood px-4 py-2" data-testid="return-archive-btn">
                ← Return to Cultural Archive
              </Link>
            </div>
          </div>
        </section>
      </main>
    );
  }

  // Find adjacent stories for continuous exhibition navigation
  const currentIndex = STORIES.findIndex(s => s.slug === story.slug);
  const prevStory = currentIndex > 0 ? STORIES[currentIndex - 1] : undefined;
  const nextStory = currentIndex < STORIES.length - 1 ? STORIES[currentIndex + 1] : undefined;

  // Resolve related products only when an explicit valid relationship exists in canonical catalogue
  const validRelatedProducts: Product[] = (story.relatedProductSlugs || [])
    .map(slug => getProductBySlug(slug))
    .filter((prod): prod is Product => !!prod);

  const mainRef = useRef<HTMLElement>(null);

  useEditorialScroll({
    scopeRef: mainRef,
    headerSelector: '.editorial-enter',
    sectionSelector: '.editorial-section',
    deps: [story?.slug]
  });

  return (
    <main id="main-content" className="main-content bg-canvas" data-testid="archive-story-page" ref={mainRef}>
      {/* Editorial Breadcrumb Plinth */}
      <div className="py-2 border-hairline-b bg-stone">
        <div className="page-container">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-0 body-sm">
              <li className="breadcrumb-item"><Link to="/" className="text-muted-editorial text-decoration-none">Home</Link></li>
              <li className="breadcrumb-item"><Link to="/archive" className="text-muted-editorial text-decoration-none">Cultural Archive</Link></li>
              <li className="breadcrumb-item active text-oxblood fw-medium" aria-current="page">{story.title}</li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Hero Header */}
      <section className="py-5 bg-cream border-hairline-b">
        <div className="page-container">
          <div className="d-flex align-items-center gap-2 mb-2 editorial-enter">
            <span style={{ width: 24, height: 1, backgroundColor: 'var(--color-champagne-thread)' }}></span>
            <span className="label-caps text-champagne">{story.chapter} • {story.folio}</span>
          </div>

          <h1 className="display-hero text-oxblood mb-2 editorial-enter" data-testid="story-title" style={{ fontSize: '3rem' }}>
            {story.title}
          </h1>
          <span className="visually-hidden">{story.slug.replace(/-/g, ' ')}</span>

          <p className="headline-sm text-on-surface fst-italic fw-light mb-3 editorial-enter" data-testid="story-subtitle" style={{ maxWidth: 800 }}>
            {story.subtitle}
          </p>

          <div className="d-flex flex-wrap align-items-center gap-3 body-sm text-muted-editorial pt-2">
            <span><strong>Focus:</strong> {story.focus}</span>
            <span>•</span>
            <span><strong>Location:</strong> {story.location}</span>
          </div>
        </div>
      </section>

      {/* Main Exhibition Article Body */}
      <section className="py-5 editorial-section">
        <div className="page-container">
          <div className="row g-5">
            {/* Left Main Article Column */}
            <div className="col-12 col-lg-8">
              {/* Primary Specimen Visual */}
              <div className="mb-4 border-hairline overflow-hidden bg-stone" style={{ maxHeight: 560 }}>
                <img
                  src={story.image}
                  alt={story.imageAlt || story.title}
                  className="w-100 h-100 object-fit-cover"
                  style={{ maxHeight: 560 }}
                  data-testid="story-primary-image"
                />
              </div>

              <div className="p-2 mb-4 text-start">
                <p className="body-sm text-muted-editorial fst-italic mb-0" style={{ fontSize: '0.8125rem' }}>
                  * {story.imageCredit}
                </p>
              </div>

              {/* Curatorial Summary Section */}
              <div className="mb-5">
                <span className="label-caps text-champagne d-block mb-2">Curatorial Overview</span>
                <p className="body-lg text-on-surface fw-light mb-4" data-testid="story-summary" style={{ lineHeight: 1.8 }}>
                  {story.summary}
                </p>
              </div>

              {/* Exhibition Monograph Text */}
              <div className="mb-5 journal-article-prose">
                <span className="label-caps text-champagne d-block mb-3">Exhibition Discourse</span>
                <blockquote data-testid="story-exhibition-text">
                  &ldquo;{story.exhibitionText}&rdquo;
                </blockquote>
              </div>

              {/* Technical Drafting Specifications Table */}
              <div className="mb-5 p-4 bg-stone border-hairline" data-testid="story-drafting-specs">
                <div className="d-flex align-items-center justify-content-between mb-3 pb-2 border-hairline-b">
                  <span className="label-caps text-champagne">Technical Drafting Parameters</span>
                  <span className="label-caps-wide text-muted-editorial" style={{ fontSize: '0.625rem' }}>
                    Archival Specification
                  </span>
                </div>

                <div className="table-responsive">
                  <table className="table table-borderless body-sm mb-0">
                    <tbody>
                      {story.draftingSpecs.map((spec, idx) => (
                        <tr key={idx} className="border-bottom border-hairline">
                          <th scope="row" className="text-oxblood fw-medium py-2" style={{ width: '40%' }}>
                            {spec.label}
                          </th>
                          <td className="text-on-surface py-2">
                            {spec.value}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Sources & References */}
              {story.sources && story.sources.length > 0 && (
                <div className="mb-5 p-4 bg-canvas border-hairline" data-testid="story-sources-section">
                  <span className="label-caps text-champagne d-block mb-2">Academic &amp; Field Sources</span>
                  <ul className="list-unstyled mb-0 body-sm text-muted-editorial">
                    {story.sources.map((source, sIdx) => (
                      <li key={sIdx} className="mb-1 d-flex align-items-baseline gap-2">
                        <span className="text-champagne">§</span>
                        <span>{source}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Continuous Navigation Stepper */}
              <div className="pt-4 border-hairline-t d-flex justify-content-between align-items-center gap-3">
                {prevStory ? (
                  <Link to={`/archive/${prevStory.slug}`} className="btn-outline-editorial text-start" data-testid="prev-story-link">
                    <span className="label-caps-wide text-muted-editorial d-block" style={{ fontSize: '0.625rem' }}>Previous Folio</span>
                    <span className="fw-medium">← {prevStory.title}</span>
                  </Link>
                ) : <div />}

                {nextStory ? (
                  <Link to={`/archive/${nextStory.slug}`} className="btn-outline-editorial text-end" data-testid="next-story-link">
                    <span className="label-caps-wide text-muted-editorial d-block" style={{ fontSize: '0.625rem' }}>Next Folio</span>
                    <span className="fw-medium">{nextStory.title} →</span>
                  </Link>
                ) : <div />}
              </div>
            </div>

            {/* Right Sidebar: Artisan Persona & Related Products */}
            <div className="col-12 col-lg-4">
              <aside className="d-flex flex-column gap-4">
                {/* Guild Artisan Persona Plinth */}
                <div className="p-4 bg-stone border-hairline" data-testid="story-artisan-plinth">
                  <span className="label-caps text-champagne d-block mb-2">Guild Attribution</span>
                  <h3 className="title-md text-oxblood mb-2">{story.artisan}</h3>
                  <p className="body-sm text-muted-editorial mb-3">
                    Documented from workshop field sessions in {story.location}.
                  </p>
                  {story.contentFlags?.isPersonaIllustrative && (
                    <div className="p-2 bg-canvas border-hairline body-sm text-muted-editorial" style={{ fontSize: '0.75rem' }}>
                      <span className="fw-medium text-oxblood">Notice:</span> Named artisan is an illustrative persona representing traditional guild lineages.
                    </div>
                  )}

                  {/* Restrained Architectural Loom Thread Path Illustration */}
                  <div className="pt-3 text-center d-flex flex-column align-items-center" aria-hidden="true">
                    <LoomThreadPathIllustration />
                    <span className="label-caps-wide text-muted-editorial mt-1" style={{ fontSize: '0.5625rem' }}>
                      Heddle Tension Sequence
                    </span>
                  </div>
                </div>

                {/* Related 6-Plate Exhibition Companion */}
                {story.relatedTraditionKey && (
                  <div className="p-4 bg-stone border-hairline" data-testid="story-tradition-cta">
                    <span className="label-caps text-champagne d-block mb-2">Exhibition Folio Companion</span>
                    <h3 className="title-md text-oxblood mb-2">{story.relatedTraditionTitle || 'Textile Tradition'}</h3>
                    <p className="body-sm text-muted-editorial mb-3">
                      Inspect the complete 6-plate photographic suite and technical drafting schematics for this tradition in the Weave Library.
                    </p>
                    <Link
                      to={`/archive?tradition=${story.relatedTraditionKey}`}
                      className="btn-oxblood w-100 py-2 d-flex align-items-center justify-content-center gap-2 text-decoration-none"
                      data-testid="enter-tradition-exhibition-btn"
                    >
                      <span>Examine 6-Plate Suite</span>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <rect x="3" y="3" width="18" height="18" rx="1"></rect>
                        <circle cx="8.5" cy="8.5" r="1.5"></circle>
                        <polyline points="21 15 16 10 5 21"></polyline>
                      </svg>
                    </Link>
                  </div>
                )}

                {/* Valid Related Products Section (Strictly validated against catalog) */}
                {validRelatedProducts.length > 0 && (
                  <div className="p-4 bg-stone border-hairline" data-testid="related-products-section">
                    <span className="label-caps text-champagne d-block mb-2">Repertoire Lineage</span>
                    <h3 className="title-md text-oxblood mb-3">Associated Heirlooms</h3>

                    <div className="d-flex flex-column gap-3">
                      {validRelatedProducts.map(prod => {
                        const asset = PRODUCT_ASSET_MAP[prod.id];
                        return (
                          <div key={prod.id} className="d-flex gap-3 bg-canvas p-2 border-hairline align-items-center">
                            <div style={{ width: 60, height: 80, flexShrink: 0, overflow: 'hidden' }}>
                              <img
                                src={asset?.primary.src || prod.image}
                                alt={prod.title}
                                width={60}
                                height={80}
                                className="w-100 h-100 object-fit-cover"
                              />
                            </div>
                            <div className="flex-grow-1">
                              <span className="label-caps text-champagne d-block" style={{ fontSize: '0.625rem' }}>
                                {prod.category}
                              </span>
                              <Link to={`/product/${prod.slug}`} className="body-sm fw-bold text-oxblood text-decoration-none d-block mb-1">
                                {prod.title}
                              </Link>
                              <span className="body-sm text-muted-editorial">
                                ₹{prod.price.toLocaleString('en-IN')}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Return link */}
                <Link to="/archive" className="btn-outline-editorial text-center w-100 py-2">
                  ← Back to Complete Archive
                </Link>
              </aside>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};
