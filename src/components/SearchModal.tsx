import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ALL_PRODUCTS } from '../data/products.ts';
import { WEAVE_LIBRARY, STORIES } from '../data/stories.ts';
import { JOURNAL_ARTICLES } from '../data/journal.ts';
import { PRODUCT_ASSET_MAP } from '../data/assetMap.ts';
import { useDialogFocus } from '../hooks/useDialogFocus.ts';

export const WEAVE_STORY_ROUTES: Record<string, string> = {
  'weave-14': '/archive/the-art-of-the-drape',
};

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type SearchCategory = 'product' | 'tradition' | 'story' | 'journal';

interface SearchResultItem {
  id: string;
  category: SearchCategory;
  categoryLabel: string;
  title: string;
  subtitle?: string;
  url: string;
  image?: string;
  badge?: string;
}

const CURATED_SEARCH_SUGGESTIONS = [
  'Varanasi Brocade',
  'Changthangi Pashmina',
  'Chanderi',
  'Coat Dress',
  'Kadwa Weave',
  'Handloom Silk',
  'Pit Loom',
  'Jamdani'
];

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState<string>('');
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const modalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Reset query and selected index on open
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(-1);
    }
  }, [isOpen]);

  // Shared dialog accessibility: focus trap, Escape dismissal, opener focus restoration
  useDialogFocus({
    isOpen,
    onClose,
    containerRef: modalRef,
    initialFocusRef: inputRef,
    restoreFocusSelector: 'button[aria-label*="Search" i]',
  });

  // Unified index search across all 4 house directories
  const results: SearchResultItem[] = useMemo(() => {
    const tokens = query.toLowerCase().split(/\s+/).filter(Boolean);
    if (tokens.length === 0) return [];

    const matchesAllTokens = (haystack: string) =>
      tokens.every(token => haystack.includes(token));

    const matches: SearchResultItem[] = [];

    // 1. Products (Canonical Pieces, listed only)
    ALL_PRODUCTS.filter(p => !('isListed' in p) || p.isListed !== false).forEach(p => {
      const weaveStr = 'weaveType' in p ? p.weaveType : '';
      const fiberStr = 'fiberPurity' in p ? p.fiberPurity : '';
      const originStr = 'origin' in p ? p.origin : '';
      const tagsStr = (p.curatorTags || []).join(' ');
      const haystack = `${p.title} ${p.subtitle || ''} ${p.category} ${weaveStr} ${fiberStr} ${originStr} ${p.description} ${tagsStr}`.toLowerCase();
      if (matchesAllTokens(haystack)) {
        const asset = PRODUCT_ASSET_MAP[p.id];
        matches.push({
          id: `prod-${p.id}`,
          category: 'product',
          categoryLabel: 'Silhouettes & Repertoire',
          title: p.title,
          subtitle: `${p.currency}${p.price.toLocaleString('en-IN')}${weaveStr ? ` • ${weaveStr}` : ''}`,
          url: `/product/${p.slug}`,
          image: asset?.primary.src || p.image,
          badge: p.category
        });
      }
    });

    // 2. Cultural Archive Traditions (13 Living Weave Traditions)
    WEAVE_LIBRARY.forEach(w => {
      const haystack = `${w.title} ${w.region} ${w.fiber} ${w.distinction} ${w.structuralProfile} ${w.description}`.toLowerCase();
      if (matchesAllTokens(haystack)) {
        let destinationUrl: string | undefined;
        if (w.traditionKey) {
          destinationUrl = `/archive?tradition=${w.traditionKey}`;
        } else if (WEAVE_STORY_ROUTES[w.id]) {
          destinationUrl = WEAVE_STORY_ROUTES[w.id];
        }

        if (destinationUrl) {
          matches.push({
            id: `weave-${w.id}`,
            category: 'tradition',
            categoryLabel: 'Living Weave Tradition',
            title: w.title,
            subtitle: `${w.region} • ${w.fiber}`,
            url: destinationUrl,
            image: w.image,
            badge: w.distinction.toUpperCase()
          });
        }
      }
    });

    // 3. Archive Monograph Folios (4 Studies)
    STORIES.forEach(s => {
      const haystack = `${s.title} ${s.subtitle} ${s.chapter} ${s.folio} ${s.location} ${s.artisan} ${s.summary}`.toLowerCase();
      if (matchesAllTokens(haystack)) {
        matches.push({
          id: `story-${s.id}`,
          category: 'story',
          categoryLabel: 'Archival Folio Monograph',
          title: s.title,
          subtitle: `${s.chapter} • ${s.folio} • ${s.location}`,
          url: `/archive/${s.slug}`,
          image: s.image,
          badge: 'MONOGRAPH'
        });
      }
    });

    // 4. Journal Articles (Editorial Monograph Essays)
    JOURNAL_ARTICLES.forEach(j => {
      const haystack = `${j.title} ${j.subtitle || ''} ${j.category} ${j.author} ${j.excerpt} ${j.bodyParagraphs.join(' ')}`.toLowerCase();
      if (matchesAllTokens(haystack)) {
        matches.push({
          id: `journal-${j.id}`,
          category: 'journal',
          categoryLabel: 'Editorial Journal',
          title: j.title,
          subtitle: `${j.category} • ${j.readTime}`,
          url: `/journal/${j.slug}`,
          image: j.image,
          badge: 'ESSAY'
        });
      }
    });

    return matches;
  }, [query]);

  // Keyboard navigation through results
  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (results.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1 < results.length ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 >= 0 ? prev - 1 : results.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const target = selectedIndex >= 0 ? results[selectedIndex] : results[0];
      if (target) {
        onClose();
        navigate(target.url);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="modal-backdrop fade show"
        style={{ zIndex: 1050, backgroundColor: 'rgba(26, 20, 22, 0.72)', backdropFilter: 'blur(6px)' }}
        onClick={onClose}
        data-testid="search-modal-backdrop"
      />
      <div
        ref={modalRef}
        className="modal fade show d-block"
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label="Atelier Curatorial Search"
        data-testid="curatorial-search-dialog"
        style={{ zIndex: 1055 }}
      >
        <div className="modal-dialog modal-lg modal-dialog-centered" style={{ maxWidth: 740 }}>
          <div className="modal-content bg-canvas border-hairline p-0 text-dark shadow-lg overflow-hidden">
            {/* Header */}
            <div className="modal-header border-hairline-b p-3 px-4 bg-cream d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center gap-2">
                <span style={{ width: 6, height: 6, backgroundColor: 'var(--color-champagne-thread)', transform: 'rotate(45deg)' }} />
                <span className="label-caps text-oxblood">Atelier Curatorial Search</span>
              </div>
              <button
                type="button"
                className="btn-outline-editorial py-1 px-3 body-sm d-inline-flex align-items-center gap-1"
                aria-label="Close search"
                onClick={onClose}
                data-testid="search-close-btn"
              >
                <span>Close</span>
                <span className="material-symbols-outlined fs-6">close</span>
              </button>
            </div>

            {/* Search Input Bar */}
            <div className="p-4 bg-surface border-hairline-b">
              <div className="position-relative">
                <span
                  className="position-absolute top-50 start-0 translate-middle-y ps-3 text-muted-editorial d-flex align-items-center"
                  style={{ pointerEvents: 'none' }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <circle cx="11" cy="11" r="8"/>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                  </svg>
                </span>
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setSelectedIndex(-1);
                  }}
                  onKeyDown={handleInputKeyDown}
                  className="form-control form-control-editorial w-100 py-3 ps-5 pe-4"
                  placeholder="Search silhouettes, weaves, materials, or folios... (e.g. Pashmina, Brocade)"
                  data-testid="search-input"
                  aria-autocomplete="list"
                  aria-controls="search-results-list"
                />
                {query && (
                  <button
                    type="button"
                    className="position-absolute top-50 end-0 translate-middle-y pe-3 border-0 bg-transparent text-muted-editorial"
                    onClick={() => {
                      setQuery('');
                      setSelectedIndex(-1);
                      inputRef.current?.focus();
                    }}
                    aria-label="Clear search query"
                  >
                    <span className="material-symbols-outlined fs-5">clear</span>
                  </button>
                )}
              </div>
            </div>

            {/* Results or Suggestions Panel */}
            <div
              ref={listRef}
              id="search-results-list"
              className="p-3 p-sm-4 bg-canvas overflow-y-auto"
              style={{ maxHeight: '60vh', minHeight: 240 }}
              data-testid="search-results-container"
            >
              {query.trim() === '' ? (
                /* Initial Curated Guidance State */
                <div>
                  <div className="d-flex align-items-center justify-content-between mb-3 pb-2 border-hairline-b">
                    <span className="label-caps text-oxblood">Curatorial Suggestions</span>
                    <span className="body-sm text-muted-editorial" style={{ fontSize: '0.75rem' }}>
                      Click to explore
                    </span>
                  </div>
                  <div className="d-flex flex-wrap gap-2 mb-4">
                    {CURATED_SEARCH_SUGGESTIONS.map(sug => (
                      <button
                        key={sug}
                        type="button"
                        className="btn-outline-editorial py-1 px-3 body-sm"
                        style={{ fontSize: '0.8125rem' }}
                        onClick={() => {
                          setQuery(sug);
                          inputRef.current?.focus();
                        }}
                      >
                        {sug}
                      </button>
                    ))}
                  </div>

                  <div className="p-3 bg-stone border-hairline body-sm text-muted-editorial font-sans">
                    <span className="label-caps-wide text-oxblood d-block mb-1" style={{ fontSize: '0.625rem' }}>
                      House Search Index
                    </span>
                    <p className="mb-0" style={{ fontSize: '0.8125rem' }}>
                      Indexed across 7 permanent silhouettes, 13 living weave traditions, 4 curatorial folios, and continuous field journal studies.
                    </p>
                  </div>
                </div>
              ) : results.length > 0 ? (
                /* Search Results List */
                <div data-testid="search-results-list">
                  <div className="d-flex align-items-center justify-content-between mb-3 pb-2 border-hairline-b">
                    <span className="label-caps text-oxblood">
                      Archival Matches ({results.length})
                    </span>
                    <span className="body-sm text-muted-editorial" style={{ fontSize: '0.75rem' }}>
                      Use ↑↓ to browse • Press Enter to select
                    </span>
                  </div>

                  <div className="d-flex flex-column gap-2">
                    {results.map((item, idx) => {
                      const isFocused = idx === selectedIndex;
                      return (
                        <Link
                          key={item.id}
                          to={item.url}
                          onClick={onClose}
                          className={`p-3 bg-stone border-hairline d-flex align-items-center gap-3 text-decoration-none transition-all ${
                            isFocused ? 'bg-cream border-oxblood' : ''
                          }`}
                          style={{
                            borderLeft: isFocused ? '3px solid var(--color-primary)' : '1px solid var(--color-hairline)'
                          }}
                          data-testid="search-result-item"
                          data-result-id={item.id}
                        >
                          {item.image && (
                            <div
                              style={{ width: 56, height: 56, flexShrink: 0, overflow: 'hidden' }}
                              className="border-hairline bg-surface"
                            >
                              <img
                                src={item.image}
                                alt=""
                                width={56}
                                height={56}
                                className="w-100 h-100 object-fit-cover"
                              />
                            </div>
                          )}

                          <div className="flex-grow-1 min-w-0">
                            <div className="d-flex align-items-center gap-2 mb-1">
                              <span className="label-caps-wide text-champagne" style={{ fontSize: '0.5625rem' }}>
                                {item.categoryLabel}
                              </span>
                              {item.badge && (
                                <span className="badge badge-sand text-oxblood" style={{ fontSize: '0.5625rem' }}>
                                  {item.badge}
                                </span>
                              )}
                            </div>
                            <h4 className="title-md text-oxblood mb-0 text-truncate" style={{ fontSize: '1rem' }}>
                              {item.title}
                            </h4>
                            {item.subtitle && (
                              <p className="body-sm text-muted-editorial mb-0 text-truncate" style={{ fontSize: '0.8125rem' }}>
                                {item.subtitle}
                              </p>
                            )}
                          </div>

                          <div className="d-flex align-items-center gap-2 flex-shrink-0">
                            {item.category === 'product' ? (
                              <span
                                className="btn-oxblood py-1 px-2 body-sm d-none d-sm-inline-flex align-items-center gap-1"
                                style={{ fontSize: '0.6875rem' }}
                              >
                                <span>Order Folio</span>
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                  <line x1="5" y1="12" x2="19" y2="12"/>
                                  <polyline points="12 5 19 12 12 19"/>
                                </svg>
                              </span>
                            ) : (
                              <span
                                className="btn-outline-editorial py-1 px-2 body-sm d-none d-sm-inline-flex align-items-center"
                                style={{ fontSize: '0.6875rem' }}
                              >
                                {item.category === 'tradition' ? 'Examine' : item.category === 'story' ? 'Read Folio' : 'Read Essay'}
                              </span>
                            )}
                            <div className="text-oxblood flex-shrink-0">
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                <polyline points="9 18 15 12 9 6"/>
                              </svg>
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ) : (
                /* Empty Match State */
                <div className="text-center py-5" data-testid="search-empty-state">
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-muted-editorial mb-3" aria-hidden="true">
                    <circle cx="11" cy="11" r="8"/>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                    <line x1="8" y1="11" x2="14" y2="11"/>
                  </svg>
                  <h3 className="title-md text-oxblood mb-2">No Archival Records Found</h3>
                  <p className="body-sm text-muted-editorial mx-auto mb-4" style={{ maxWidth: 440 }}>
                    No specimens matching &ldquo;<strong className="text-oxblood">{query}</strong>&rdquo; were discovered in the house registry. Try refining your term or search by a fundamental weave (e.g. &ldquo;Brocade&rdquo;, &ldquo;Pashmina&rdquo;, &ldquo;Chanderi&rdquo;).
                  </p>
                  <button
                    type="button"
                    className="btn-outline-editorial py-1 px-3 body-sm"
                    onClick={() => {
                      setQuery('');
                      inputRef.current?.focus();
                    }}
                  >
                    Clear Search
                  </button>
                </div>
              )}
            </div>

            {/* Footer Navigation Hints */}
            <div className="modal-footer p-2 px-4 bg-cream border-hairline-t d-flex flex-wrap justify-content-between align-items-center body-sm text-muted-editorial">
              <div className="d-flex align-items-center gap-2 flex-wrap" style={{ fontSize: '0.75rem' }}>
                <span className="d-inline-flex align-items-center gap-1 text-espresso">
                  <kbd className="editorial-kbd">ESC</kbd> to exit
                </span>
                <span className="text-muted-editorial">•</span>
                <span className="d-inline-flex align-items-center gap-1 text-espresso">
                  <kbd className="editorial-kbd">↑</kbd>
                  <kbd className="editorial-kbd">↓</kbd> to navigate
                </span>
                <span className="text-muted-editorial">•</span>
                <span className="d-inline-flex align-items-center gap-1 text-espresso">
                  <kbd className="editorial-kbd">↵</kbd> to select
                </span>
              </div>
              <span className="d-none d-md-inline" style={{ fontSize: '0.75rem' }}>
                EverThread Curatorial Catalog
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
