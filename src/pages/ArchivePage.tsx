import React, { useState, useEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { STORIES, WEAVE_LIBRARY } from '../data/stories.ts';
import { DIAGRAM_ASSETS } from '../data/assetMap.ts';
import { WeaveLibraryItem, TraditionImageRole } from '../types/catalog.ts';
import { TraditionExhibitionModal } from '../components/TraditionExhibitionModal.tsx';
import { PalluBorderIllustration, ArchitecturalThreadDivider } from '../components/archive/ArchiveIllustrations.tsx';
import { useEditorialScroll } from '../hooks/useEditorialScroll.ts';

type WeaveFilter = 'all' | 'weaving' | 'embroidery' | 'dyeing' | 'draping';

export const ArchivePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [weaveFilter, setWeaveFilter] = useState<WeaveFilter>('all');
  const [activeDiagramId, setActiveDiagramId] = useState<string>('library-warp-weft-diagram-01');
  const [selectedExhibitionTradition, setSelectedExhibitionTradition] = useState<string | null>(null);
  const [isExhibitionOpen, setIsExhibitionOpen] = useState<boolean>(false);
  const [initialRole, setInitialRole] = useState<TraditionImageRole>('model-01');
  const [initialDiagramOpen, setInitialDiagramOpen] = useState<boolean>(false);
  const mainRef = useRef<HTMLElement>(null);

  useEditorialScroll({
    scopeRef: mainRef,
    headerSelector: '.editorial-enter',
    sectionSelector: '.archive-folio-card',
    staggerSelector: '.editorial-card',
    deps: [weaveFilter]
  });

  useEffect(() => {
    const traditionParam = searchParams.get('tradition');
    const roleParam = searchParams.get('role') as TraditionImageRole | null;
    const diagramParam = searchParams.get('diagram') === 'true';

    if (traditionParam) {
      setSelectedExhibitionTradition(traditionParam);
      if (roleParam) {
        setInitialRole(roleParam);
      }
      setInitialDiagramOpen(diagramParam);
      setIsExhibitionOpen(true);
    }
  }, [searchParams]);

  const handleOpenExhibition = (traditionKeyOrSlug: string, role?: TraditionImageRole) => {
    setSelectedExhibitionTradition(traditionKeyOrSlug);
    setInitialRole(role || 'model-01');
    setInitialDiagramOpen(false);
    setIsExhibitionOpen(true);
  };

  const handleCloseExhibition = () => {
    setIsExhibitionOpen(false);
  };

  const handleSelectTradition = (keyOrSlug: string) => {
    setSelectedExhibitionTradition(keyOrSlug);
    setInitialRole('model-01');
  };

  // Filter weave library items based on craft distinction
  const filteredWeaves: WeaveLibraryItem[] = weaveFilter === 'all'
    ? WEAVE_LIBRARY
    : WEAVE_LIBRARY.filter(item => item.distinction === weaveFilter);

  const activeDiagram = DIAGRAM_ASSETS[activeDiagramId] || DIAGRAM_ASSETS['library-warp-weft-diagram-01'];
  const diagramKeys = Object.keys(DIAGRAM_ASSETS);

  return (
    <main id="main-content" className="main-content bg-canvas" data-testid="cultural-archive-page" ref={mainRef}>
      {/* Hero Exhibition Header */}
      <section className="py-5 bg-cream border-hairline-b">
        <div className="page-container">
          <div className="d-flex align-items-center gap-2 mb-2 editorial-enter">
            <span style={{ width: 24, height: 1, backgroundColor: 'var(--color-champagne-thread)' }}></span>
            <span className="label-caps text-champagne">Curatorial Exhibition Series • Volume I</span>
          </div>

          <h1 className="display-hero text-oxblood mb-2 editorial-enter" style={{ fontSize: '3.5rem' }}>
            The Cultural Archive
          </h1>

          <p className="headline-sm text-on-surface fst-italic fw-light mb-4 editorial-enter" style={{ maxWidth: 720 }}>
            Clothing as living history, memory, and spatial architecture.
          </p>

          <p className="body-lg text-muted-editorial mb-4 editorial-enter" style={{ maxWidth: 720 }}>
            Our cultural archive exists to document, analyze, and perpetuate endangered textile guild methods. Explore four foundational monograph folios below, or enter the Weave Library to examine complete six-plate archival photographic exhibitions and technical drafting schematics across 13 Indian textile traditions.
          </p>

          <div className="d-flex flex-wrap gap-3 pt-2 editorial-enter">
            <a href="#folios" className="btn-oxblood d-inline-flex align-items-center gap-2">
              <span>Explore Exhibition Folios (1.1 – 1.4)</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <polyline points="19 12 12 19 5 12"></polyline>
              </svg>
            </a>
            <a href="#weave-library" className="btn-outline-editorial d-inline-flex align-items-center gap-2">
              <span>Technical Weave Library &amp; Diagrams</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="3" y="3" width="6" height="6" rx="1"></rect>
                <rect x="15" y="3" width="6" height="6" rx="1"></rect>
                <rect x="9" y="15" width="6" height="6" rx="1"></rect>
                <path d="M6 9v3a3 3 0 0 0 3 3h3m6-6v3a3 3 0 0 1-3 3"></path>
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* Exhibition Folio Chapters Section */}
      <section id="folios" className="py-5 border-hairline-b">
        <div className="page-container">
          <div className="d-flex align-items-center justify-content-between mb-4 pb-2 border-hairline-b">
            <div>
              <span className="label-caps text-champagne d-block mb-1">Exhibition Monograph Folios</span>
              <h2 className="headline-md text-oxblood mb-0">Four Foundational Studies</h2>
            </div>
            <span className="body-sm text-muted-editorial d-none d-md-inline">
              Curatorial Volume I • Complete Archive Index
            </span>
          </div>

          <div className="d-flex flex-column gap-5">
            {STORIES.map((story, index) => {
              const isEven = index % 2 === 1;

              return (
                <article
                  key={story.id}
                  className="p-4 p-lg-5 bg-stone border-hairline archive-folio-card"
                  data-testid={`archive-folio-card-${story.slug}`}
                >
                  <div className={`row g-4 g-lg-5 align-items-center ${isEven ? 'flex-lg-row-reverse' : ''}`}>
                    {/* Folio Image Specimen */}
                    <div className="col-12 col-lg-5">
                      <div className="position-relative overflow-hidden border-hairline" style={{ aspectRatio: '16/10', backgroundColor: 'var(--color-surface)' }}>
                        <img
                          src={story.image}
                          alt={story.imageAlt || story.title}
                          className="w-100 h-100 object-fit-cover"
                          loading="lazy"
                          width={600}
                          height={375}
                        />
                        <div className="position-absolute bottom-0 start-0 m-3 px-3 py-1 bg-oxblood text-white border-hairline">
                          <span className="label-caps-wide text-champagne-glow" style={{ fontSize: '0.625rem' }}>
                            {story.folio} • PRIMARY SPECIMEN
                          </span>
                        </div>
                      </div>
                      <p className="body-sm text-muted-editorial fst-italic mt-2 mb-0" style={{ fontSize: '0.75rem' }}>
                        * {story.imageCredit}
                      </p>
                    </div>

                    {/* Folio Narrative Body */}
                    <div className="col-12 col-lg-7">
                      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-2">
                        <span className="label-caps text-champagne">{story.chapter} • {story.folio}</span>
                        <span className="label-caps text-muted-editorial">{story.location}</span>
                      </div>

                      <h3 className="headline-md text-oxblood mb-2" style={{ fontSize: '2rem' }}>
                        {story.title}
                      </h3>

                      <p className="headline-sm text-on-surface fst-italic fw-light mb-3" style={{ fontSize: '1.125rem' }}>
                        {story.subtitle}
                      </p>

                      <p className="body-md text-on-surface mb-4">
                        {story.summary}
                      </p>

                      {/* Technical Spec Summary Pills */}
                      <div className="p-3 bg-canvas border-hairline mb-4">
                        <span className="label-caps text-champagne d-block mb-2">Drafting Specifications</span>
                        <div className="row g-2 body-sm">
                          {story.draftingSpecs.slice(0, 2).map((spec, sIdx) => (
                            <div key={sIdx} className="col-12 col-sm-6">
                              <span className="fw-medium text-oxblood">{spec.label}:</span>{' '}
                              <span className="text-muted-editorial">{spec.value}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Custodian Persona / Attribution */}
                      <div className="mb-4">
                        <span className="label-caps-wide text-muted-editorial d-block mb-1" style={{ fontSize: '0.625rem' }}>
                          Guild Custodian &amp; Lineage Attribution
                        </span>
                        <p className="body-sm text-oxblood fw-medium mb-1">
                          {story.artisan}
                        </p>
                        {story.contentFlags?.isPersonaIllustrative && (
                          <span className="badge badge-sand text-oxblood body-sm px-2 py-0" style={{ fontSize: '0.625rem' }}>
                            Illustrative Guild Persona
                          </span>
                        )}
                      </div>

                      {/* CTA */}
                      <Link
                        to={`/archive/${story.slug}`}
                        className="btn-oxblood py-2 px-4 d-inline-flex align-items-center gap-2"
                        data-testid={`archive-story-link-${story.slug}`}
                      >
                        <span>Enter Deep Exhibition Folio</span>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <line x1="5" y1="12" x2="19" y2="12"></line>
                          <polyline points="12 5 19 12 12 19"></polyline>
                        </svg>
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Editorial Transition Divider */}
      <div className="py-2 bg-canvas">
        <ArchitecturalThreadDivider />
      </div>

      {/* Embedded Weave Library Section */}
      <section id="weave-library" className="py-5 bg-cream border-hairline-b" data-testid="weave-library-section">
        <div className="page-container">
          <div className="text-center mx-auto mb-5" style={{ maxWidth: 720 }}>
            <div className="d-flex align-items-center justify-content-center gap-2 mb-2">
              <span style={{ width: 16, height: 1, backgroundColor: 'var(--color-champagne-thread)' }}></span>
              <span className="label-caps text-champagne">Technical Craft Taxonomy</span>
              <span style={{ width: 16, height: 1, backgroundColor: 'var(--color-champagne-thread)' }}></span>
            </div>
            <h2 className="headline-lg text-oxblood mb-2" style={{ fontSize: '2.75rem' }}>
              The Weave Library
            </h2>
            <p className="body-md text-muted-editorial mb-0">
              A permanent taxonomy distinguishing pure loom weaving from surface needlework, botanical resist vat-dyeing, and anatomic bias draping.
            </p>
          </div>

          {/* Distinction Filter Tabs */}
          <div className="d-flex justify-content-center flex-wrap gap-2 mb-5" role="tablist" aria-label="Weave Library Distinction Filters">
            {(['all', 'weaving', 'embroidery', 'dyeing', 'draping'] as WeaveFilter[]).map(tab => (
              <button
                key={tab}
                type="button"
                className={`category-pill ${weaveFilter === tab ? 'active' : ''}`}
                onClick={() => setWeaveFilter(tab)}
                data-testid={`weave-filter-${tab}`}
                role="tab"
                aria-selected={weaveFilter === tab}
              >
                {tab === 'all' ? 'All Disciplines' : tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Filtered Library Grid */}
          <div className="row g-4 mb-5" data-testid="weave-library-grid">
            {filteredWeaves.map(item => (
              <div key={item.id} className="col-12 col-md-6 col-lg-4 editorial-card">
                <article className="p-4 bg-canvas border-hairline h-100 d-flex flex-column justify-content-between" data-testid={`weave-card-${item.slug}`}>
                  <div>
                    {item.image && (
                      <div className="mb-3 overflow-hidden border-hairline position-relative" style={{ aspectRatio: '16/10', backgroundColor: 'var(--color-surface)' }}>
                        <img
                          src={item.image}
                          alt={item.imageAlt || item.title}
                          className="w-100 h-100 object-fit-cover"
                          loading="lazy"
                          width={400}
                          height={250}
                        />
                        {item.traditionKey ? (
                          <button
                            type="button"
                            className="position-absolute bottom-0 end-0 m-2 px-2 py-1 bg-surface border-hairline label-caps text-oxblood body-sm d-flex align-items-center gap-1"
                            style={{ fontSize: '0.625rem', backdropFilter: 'blur(4px)', cursor: 'pointer' }}
                            onClick={() => handleOpenExhibition(item.traditionKey || item.slug)}
                            aria-label={`Open 6-plate gallery for ${item.title}`}
                          >
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                              <rect x="3" y="3" width="18" height="18" rx="1"></rect>
                              <circle cx="8.5" cy="8.5" r="1.5"></circle>
                              <polyline points="21 15 16 10 5 21"></polyline>
                            </svg>
                            <span>6 Plates</span>
                          </button>
                        ) : (
                          <Link
                            to="/archive/the-art-of-the-drape"
                            className="position-absolute bottom-0 end-0 m-2 px-2 py-1 bg-surface border-hairline label-caps text-oxblood body-sm d-flex align-items-center gap-1 text-decoration-none"
                            style={{ fontSize: '0.625rem', backdropFilter: 'blur(4px)', cursor: 'pointer' }}
                            aria-label="Read Folio 1.2: The Art of the Drape"
                            data-testid="weave-14-badge-link"
                          >
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                            </svg>
                            <span>Folio 1.2</span>
                          </Link>
                        )}
                      </div>
                    )}

                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className={`weave-distinction-badge weave-distinction-${item.distinction}`}>
                        {item.distinction}
                      </span>
                      <span className="label-caps text-muted-editorial" style={{ fontSize: '0.6875rem' }}>
                        {item.region}
                      </span>
                    </div>

                    <h3 className="headline-sm text-oxblood mb-2" style={{ fontSize: '1.25rem' }}>
                      {item.title}
                    </h3>

                    <p className="body-sm text-muted-editorial mb-3">
                      {item.description}
                    </p>
                  </div>

                  <div className="pt-3 border-hairline-t body-sm">
                    <div className="mb-1">
                      <strong className="text-oxblood fw-medium">Fiber:</strong> <span className="text-muted-editorial">{item.fiber}</span>
                    </div>
                    <div className="mb-1">
                      <strong className="text-oxblood fw-medium">Loom Sett / Structure:</strong> <span className="text-muted-editorial">{item.warpDensity}</span>
                    </div>
                    <div>
                      <strong className="text-oxblood fw-medium">Profile:</strong> <span className="text-muted-editorial">{item.structuralProfile}</span>
                    </div>
                    {item.traditionKey ? (
                      <button
                        type="button"
                        className="btn-outline-editorial w-100 py-2 mt-3 d-flex align-items-center justify-content-center gap-2"
                        onClick={() => handleOpenExhibition(item.traditionKey || item.slug)}
                        data-testid={`open-exhibition-${item.slug}`}
                        aria-haspopup="dialog"
                        aria-label={`Examine 6-plate exhibition folio for ${item.title}`}
                      >
                        <span>Examine 6-Plate Folio</span>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                          <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                      </button>
                    ) : (
                      <Link
                        to="/archive/the-art-of-the-drape"
                        className="btn-outline-editorial w-100 py-2 mt-3 d-flex align-items-center justify-content-center gap-2 text-decoration-none"
                        data-testid={`read-monograph-${item.slug}`}
                        aria-label={`Read foundational monograph for ${item.title}`}
                      >
                        <span>Read Foundational Folio 1.2</span>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <line x1="5" y1="12" x2="19" y2="12"></line>
                          <polyline points="12 5 19 12 12 19"></polyline>
                        </svg>
                      </Link>
                    )}
                  </div>
                </article>
              </div>
            ))}
          </div>

          {/* Interactive Technical Diagram Visualizer */}
          <div className="diagram-viewer-panel" data-testid="diagram-viewer">
            <div className="row g-4 align-items-center">
              <div className="col-12 col-lg-4">
                <span className="label-caps text-champagne d-block mb-1">Archival Drafting Sequence</span>
                <h3 className="headline-sm text-oxblood mb-3">Technical Diagram Library</h3>
                <p className="body-sm text-muted-editorial mb-4">
                  Select an archival schematic to inspect geometric loom structures, double-ikat tie-dye geometry, and garment construction anatomy.
                </p>

                {/* Diagram Selector Dropdown / List */}
                <div className="d-flex flex-column gap-2 mb-3">
                  <label htmlFor="diagram-selector" className="label-caps text-muted-editorial">Select Diagram Specimen</label>
                  <select
                    id="diagram-selector"
                    value={activeDiagramId}
                    onChange={(e) => setActiveDiagramId(e.target.value)}
                    className="form-select form-control-editorial w-100"
                    data-testid="diagram-selector-dropdown"
                  >
                    {diagramKeys.map(key => (
                      <option key={key} value={key}>
                        {DIAGRAM_ASSETS[key].title}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="pt-2">
                  <span className="label-caps-wide text-champagne d-block mb-1" style={{ fontSize: '0.625rem' }}>Currently Viewing</span>
                  <p className="body-sm text-oxblood fw-bold mb-2" data-testid="active-diagram-title">
                    {activeDiagram.title}
                  </p>
                  {activeDiagram.description && (
                    <p className="body-sm text-muted-editorial mb-0" data-testid="active-diagram-description">
                      {activeDiagram.description}
                    </p>
                  )}
                  <div className="pt-3" aria-hidden="true">
                    <PalluBorderIllustration style={{ opacity: 0.45 }} />
                  </div>
                </div>
              </div>

              {/* Diagram Graphic Display Box */}
              <div className="col-12 col-lg-8">
                <div className="diagram-display-box" data-testid="diagram-display-container">
                  <img
                    src={activeDiagram.svg}
                    alt={`${activeDiagram.title} technical diagram`}
                    loading="lazy"
                    data-testid="active-diagram-img"
                    onError={(e) => {
                      // Fallback to PNG if SVG encounters an error
                      const target = e.currentTarget;
                      if (!target.src.endsWith('.png')) {
                        target.src = activeDiagram.fallbackPng;
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Editorial Transparency Footer */}
      <section className="py-4 bg-stone border-hairline-t">
        <div className="page-container">
          <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 body-sm text-muted-editorial">
            <div>
              <strong className="text-oxblood d-block">Curatorial Methodology &amp; Transparency</strong>
              <span>Folio texts, technical drafting tables, and ethnographic references are compiled as an educational museum showcase of traditional Indian textile guilds.</span>
            </div>
            <Link to="/compass" className="btn-outline-editorial text-nowrap align-self-start align-self-md-center">
              Consult Thread Compass
            </Link>
          </div>
        </div>
      </section>

      {/* Phase 6.3.2.2: Immersive 6-Plate Exhibition Folio Modal */}
      <TraditionExhibitionModal
        isOpen={isExhibitionOpen}
        traditionKeyOrSlug={selectedExhibitionTradition}
        onClose={handleCloseExhibition}
        onSelectTradition={handleSelectTradition}
        initialRole={initialRole}
        initialDiagramOpen={initialDiagramOpen}
      />
    </main>
  );
};
