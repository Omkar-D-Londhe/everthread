import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  CompassPreferences,
  RecommendationResult,
  FABRIC_OPTIONS,
  MOVEMENT_OPTIONS,
  CRAFT_OPTIONS,
  STORY_OPTIONS,
  matchProductsToPreferences
} from '../utils/compassMatcher.ts';
import { PRODUCT_ASSET_MAP } from '../data/assetMap.ts';
import { useSaved } from '../context/SavedContext.tsx';

export const CompassPage: React.FC = () => {
  // Stepper state: 1: Fabric, 2: Movement, 3: Craft, 4: Story, 5: Results
  const [currentStep, setCurrentStep] = useState<number>(1);
  // Transition direction for slide/fade animations
  const [stepDirection, setStepDirection] = useState<'forward' | 'backward'>('forward');

  // Preference selections
  const [preferences, setPreferences] = useState<CompassPreferences>({
    fabric: undefined,
    movement: undefined,
    craft: undefined,
    story: undefined
  });

  const { isSaved, toggleSaved } = useSaved();

  const safeScrollToTop = () => {
    try {
      if (typeof window !== 'undefined' && typeof window.scrollTo === 'function') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch {}
  };

  // Reset all preferences
  const handleReset = () => {
    setPreferences({
      fabric: undefined,
      movement: undefined,
      craft: undefined,
      story: undefined
    });
    setStepDirection('backward');
    setCurrentStep(1);
    safeScrollToTop();
  };

  // Step advancement
  const handleNext = () => {
    if (currentStep < 5) {
      setStepDirection('forward');
      setCurrentStep(prev => prev + 1);
      safeScrollToTop();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setStepDirection('backward');
      setCurrentStep(prev => prev - 1);
      safeScrollToTop();
    }
  };

  // Selection handlers
  const handleSelectFabric = (id: string) => {
    setPreferences(prev => ({ ...prev, fabric: id }));
  };

  const handleSelectMovement = (id: string) => {
    setPreferences(prev => ({ ...prev, movement: id }));
  };

  const handleSelectCraft = (id: string) => {
    setPreferences(prev => ({ ...prev, craft: id }));
  };

  const handleSelectStory = (id: string) => {
    setPreferences(prev => ({ ...prev, story: id }));
  };

  // Deterministic matching computed via pure matcher function
  const recommendations: RecommendationResult[] = useMemo(() => {
    return matchProductsToPreferences(preferences);
  }, [preferences]);

  // Current step validation (must select an option to continue)
  const isCurrentStepValid = useMemo(() => {
    switch (currentStep) {
      case 1:
        return !!preferences.fabric;
      case 2:
        return !!preferences.movement;
      case 3:
        return !!preferences.craft;
      case 4:
        return !!preferences.story;
      default:
        return true;
    }
  }, [currentStep, preferences]);

  // Selected Option Labels for Summary
  const selectedFabricLabel = FABRIC_OPTIONS.find(o => o.id === preferences.fabric)?.title;
  const selectedMovementLabel = MOVEMENT_OPTIONS.find(o => o.id === preferences.movement)?.title;
  const selectedCraftLabel = CRAFT_OPTIONS.find(o => o.id === preferences.craft)?.title;
  const selectedStoryLabel = STORY_OPTIONS.find(o => o.id === preferences.story)?.title;

  return (
    <main id="main-content" className="main-content">
      {/* Editorial Consultation Hero */}
      <section className="py-5 bg-cream border-hairline-b">
        <div className="page-container">
          <div className="d-flex align-items-center gap-2 mb-2">
            <span style={{ width: 24, height: 1, backgroundColor: 'var(--color-champagne-thread)' }}></span>
            <span className="label-caps text-champagne">Curated Consultation</span>
            <span style={{ width: 24, height: 1, backgroundColor: 'var(--color-champagne-thread)' }}></span>
          </div>

          <h1 className="display-hero text-oxblood mb-2">
            The Thread Compass
          </h1>

          <p className="headline-sm text-on-surface fst-italic fw-light mb-3" style={{ maxWidth: 760 }}>
            Guided tactile discovery, not filters disguised as a quiz.
          </p>

          <p className="body-md text-muted-editorial mb-0" style={{ maxWidth: 700 }}>
            An intentional consultation matching fiber composition, drape mechanics, and artisan lineages to your personal cadence. Grounded in deterministic catalogue attributes — zero artificial intelligence or fabricated claims.
          </p>
        </div>
      </section>

      {/* Main Guided Experience */}
      <section className="py-5 bg-canvas min-vh-75">
        <div className="page-container">
          {/* Stepper Navigation Indicator with Subtle Champagne Thread */}
          <div className="compass-stepper-wrap position-relative mb-5">
            <div className="compass-stepper-thread-track" aria-hidden="true">
              <div
                className="compass-stepper-thread-fill"
                style={{ width: `${((currentStep - 1) / 4) * 100}%` }}
              />
            </div>
            <nav aria-label="Consultation Progress" className="compass-stepper" data-testid="compass-stepper">
              {[
                { step: 1, title: 'Fabric & Fiber' },
                { step: 2, title: 'Movement & Form' },
                { step: 3, title: 'Hands & Craft' },
                { step: 4, title: 'Story & Lineage' },
                { step: 5, title: 'Curated Matches' }
              ].map(item => {
                const isActive = currentStep === item.step;
                const isCompleted = currentStep > item.step;
                return (
                  <button
                    key={item.step}
                    type="button"
                    className={`compass-step-pill ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
                    onClick={() => {
                      // Allow navigating back to completed steps
                      if (isCompleted || item.step < currentStep) {
                        setStepDirection(item.step > currentStep ? 'forward' : 'backward');
                        setCurrentStep(item.step);
                        safeScrollToTop();
                      }
                    }}
                    disabled={item.step > currentStep}
                    aria-current={isActive ? 'step' : undefined}
                    data-testid={`stepper-pill-${item.step}`}
                  >
                    <span className="compass-step-number">
                      {isCompleted ? '✓' : `0${item.step}`}
                    </span>
                    <span>{item.title}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* STEP 1: Fabric & Tactility */}
          {currentStep === 1 && (
            <div data-testid="compass-step-1" className={`compass-step-panel compass-step-panel--${stepDirection}`}>
              <div className="mb-4">
                <span className="label-caps text-champagne d-block mb-1">Phase 01 / Four Inquiries</span>
                <h2 className="headline-md text-oxblood mb-2">
                  Which tactile fiber hand speaks to your sensibility?
                </h2>
                <p className="body-md text-muted-editorial">
                  Select the raw natural fiber and surface density you wish to wear against your skin.
                </p>
              </div>

              <div 
                className="row g-4 mb-5" 
                role="radiogroup" 
                aria-label="Fabric and Fiber Options"
                data-testid="fabric-options-group"
              >
                {FABRIC_OPTIONS.map(opt => {
                  const isSelected = preferences.fabric === opt.id;
                  return (
                    <div key={opt.id} className="col-12 col-md-6 col-lg-4">
                      <div
                        role="radio"
                        aria-checked={isSelected}
                        tabIndex={0}
                        className={`compass-option-card ${isSelected ? 'active' : ''}`}
                        onClick={() => handleSelectFabric(opt.id)}
                        onKeyDown={e => {
                          if (e.key === ' ' || e.key === 'Enter') {
                            e.preventDefault();
                            handleSelectFabric(opt.id);
                          }
                        }}
                        data-testid={`option-fabric-${opt.id}`}
                      >
                        <div className="d-flex align-items-center justify-content-between mb-3">
                          <span className="label-caps text-champagne">{opt.tag}</span>
                          <span className="compass-option-radio" aria-hidden="true" />
                        </div>
                        <h3 className="title-md text-oxblood mb-1">{opt.title}</h3>
                        <p className="body-sm text-oxblood fw-medium mb-2">{opt.subtitle}</p>
                        <p className="body-sm text-muted-editorial mb-0">{opt.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 2: Movement & Silhouette */}
          {currentStep === 2 && (
            <div data-testid="compass-step-2" className={`compass-step-panel compass-step-panel--${stepDirection}`}>
              <div className="mb-4">
                <span className="label-caps text-champagne d-block mb-1">Phase 02 / Four Inquiries</span>
                <h2 className="headline-md text-oxblood mb-2">
                  How should the garment relate to your anatomical movement?
                </h2>
                <p className="body-md text-muted-editorial">
                  Choose between architectural structured tailoring or gravity-suspended bias flow.
                </p>
              </div>

              <div 
                className="row g-4 mb-5" 
                role="radiogroup" 
                aria-label="Movement and Form Options"
                data-testid="movement-options-group"
              >
                {MOVEMENT_OPTIONS.map(opt => {
                  const isSelected = preferences.movement === opt.id;
                  return (
                    <div key={opt.id} className="col-12 col-md-6">
                      <div
                        role="radio"
                        aria-checked={isSelected}
                        tabIndex={0}
                        className={`compass-option-card ${isSelected ? 'active' : ''}`}
                        onClick={() => handleSelectMovement(opt.id)}
                        onKeyDown={e => {
                          if (e.key === ' ' || e.key === 'Enter') {
                            e.preventDefault();
                            handleSelectMovement(opt.id);
                          }
                        }}
                        data-testid={`option-movement-${opt.id}`}
                      >
                        <div className="d-flex align-items-center justify-content-between mb-3">
                          <span className="label-caps text-champagne">{opt.tag}</span>
                          <span className="compass-option-radio" aria-hidden="true" />
                        </div>
                        <h3 className="headline-sm text-oxblood mb-1">{opt.title}</h3>
                        <p className="body-sm text-oxblood fw-medium mb-2">{opt.subtitle}</p>
                        <p className="body-md text-muted-editorial mb-0">{opt.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 3: Hands & Craft */}
          {currentStep === 3 && (
            <div data-testid="compass-step-3" className={`compass-step-panel compass-step-panel--${stepDirection}`}>
              <div className="mb-4">
                <span className="label-caps text-champagne d-block mb-1">Phase 03 / Four Inquiries</span>
                <h2 className="headline-md text-oxblood mb-2">
                  Which artisanal discipline fascinates your intellect?
                </h2>
                <p className="body-md text-muted-editorial">
                  Identify the guild technique or hand-construction lineage you wish to support.
                </p>
              </div>

              <div 
                className="row g-4 mb-5" 
                role="radiogroup" 
                aria-label="Artisanal Craft Options"
                data-testid="craft-options-group"
              >
                {CRAFT_OPTIONS.map(opt => {
                  const isSelected = preferences.craft === opt.id;
                  return (
                    <div key={opt.id} className="col-12 col-md-6 col-lg-4">
                      <div
                        role="radio"
                        aria-checked={isSelected}
                        tabIndex={0}
                        className={`compass-option-card ${isSelected ? 'active' : ''}`}
                        onClick={() => handleSelectCraft(opt.id)}
                        onKeyDown={e => {
                          if (e.key === ' ' || e.key === 'Enter') {
                            e.preventDefault();
                            handleSelectCraft(opt.id);
                          }
                        }}
                        data-testid={`option-craft-${opt.id}`}
                      >
                        <div className="d-flex align-items-center justify-content-between mb-3">
                          <span className="label-caps text-champagne">{opt.tag}</span>
                          <span className="compass-option-radio" aria-hidden="true" />
                        </div>
                        <h3 className="title-md text-oxblood mb-1">{opt.title}</h3>
                        <p className="body-sm text-oxblood fw-medium mb-2">{opt.subtitle}</p>
                        <p className="body-sm text-muted-editorial mb-0">{opt.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 4: Story & Cultural Lineage */}
          {currentStep === 4 && (
            <div data-testid="compass-step-4" className={`compass-step-panel compass-step-panel--${stepDirection}`}>
              <div className="mb-4">
                <span className="label-caps text-champagne d-block mb-1">Phase 04 / Four Inquiries</span>
                <h2 className="headline-md text-oxblood mb-2">
                  Which cultural narrative resonates with your journey?
                </h2>
                <p className="body-md text-muted-editorial">
                  Select the historical archive chapter that anchors your heirloom garment.
                </p>
              </div>

              <div 
                className="row g-4 mb-5" 
                role="radiogroup" 
                aria-label="Story and Cultural Options"
                data-testid="story-options-group"
              >
                {STORY_OPTIONS.map(opt => {
                  const isSelected = preferences.story === opt.id;
                  return (
                    <div key={opt.id} className="col-12 col-md-6 col-lg-4">
                      <div
                        role="radio"
                        aria-checked={isSelected}
                        tabIndex={0}
                        className={`compass-option-card ${isSelected ? 'active' : ''}`}
                        onClick={() => handleSelectStory(opt.id)}
                        onKeyDown={e => {
                          if (e.key === ' ' || e.key === 'Enter') {
                            e.preventDefault();
                            handleSelectStory(opt.id);
                          }
                        }}
                        data-testid={`option-story-${opt.id}`}
                      >
                        <div className="d-flex align-items-center justify-content-between mb-3">
                          <span className="label-caps text-champagne">{opt.tag}</span>
                          <span className="compass-option-radio" aria-hidden="true" />
                        </div>
                        <h3 className="title-md text-oxblood mb-1">{opt.title}</h3>
                        <p className="body-sm text-oxblood fw-medium mb-2">{opt.subtitle}</p>
                        <p className="body-sm text-muted-editorial mb-0">{opt.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 5: Curated Matches or No-Match State */}
          {currentStep === 5 && (
            <div data-testid="compass-step-5" className={`compass-step-panel compass-step-panel--${stepDirection}`}>
              {/* Selected Affinities Summary Bar */}
              <div className="p-4 bg-stone border-hairline mb-5">
                <span className="label-caps text-champagne d-block mb-2">Your Curated Affinities</span>
                <div className="d-flex flex-wrap gap-2 align-items-center">
                  {selectedFabricLabel && (
                    <span className="match-reason-pill">
                      <span className="match-reason-category">Fiber:</span>
                      <span>{selectedFabricLabel}</span>
                    </span>
                  )}
                  {selectedMovementLabel && (
                    <span className="match-reason-pill">
                      <span className="match-reason-category">Form:</span>
                      <span>{selectedMovementLabel}</span>
                    </span>
                  )}
                  {selectedCraftLabel && (
                    <span className="match-reason-pill">
                      <span className="match-reason-category">Craft:</span>
                      <span>{selectedCraftLabel}</span>
                    </span>
                  )}
                  {selectedStoryLabel && (
                    <span className="match-reason-pill">
                      <span className="match-reason-category">Lineage:</span>
                      <span>{selectedStoryLabel}</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Recommendation Results */}
              {recommendations.length > 0 ? (
                <div>
                  <div className="d-flex align-items-baseline justify-content-between flex-wrap gap-2 mb-4">
                    <div>
                      <span className="label-caps text-champagne d-block mb-1">Curated Repertoire Allocation</span>
                      <h2 className="headline-lg text-oxblood mb-0" data-testid="recommendations-heading">
                        Recommended Heirlooms ({recommendations.length})
                      </h2>
                    </div>
                    <span className="body-sm text-muted-editorial">
                      Deterministic attribute rank • Ranked by affinity score
                    </span>
                  </div>

                  {/* Content Integrity Disclosure Notice */}
                  <div className="p-3 bg-stone border-hairline mb-4" data-testid="compass-integrity-banner">
                    <div className="d-flex align-items-center gap-2 mb-1">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-champagne flex-shrink-0" aria-hidden="true">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                        <polyline points="9 12 11 14 15 10"/>
                      </svg>
                      <span className="label-caps text-champagne">Content Integrity Notice</span>
                    </div>
                    <p className="body-sm text-muted-editorial mb-0">
                      Recommendations derive strictly from verified physical textile attributes (fiber purity, weave technique, drape form, and archival story folios). Artisan labor hours and edition counts are curated case-study models.
                    </p>
                  </div>

                  <div className="d-flex flex-column gap-5 mb-5" data-testid="recommendations-list">
                    {recommendations.map((result, index) => {
                      const { product, score, matchReasons, relatedStoryTitle, relatedStorySlug } = result;
                      const asset = PRODUCT_ASSET_MAP[product.id]?.primary;
                      const saved = isSaved(product.id);

                      return (
                        <article
                          key={product.id}
                          className="p-4 p-lg-5 bg-stone border-hairline position-relative"
                          data-testid={`recommendation-card-${product.id}`}
                        >
                          <div className="row g-4 g-lg-5 align-items-center">
                            {/* Product Plinth Image */}
                            <div className="col-12 col-md-5 col-lg-4">
                              <div className="garment-img-wrap mb-0">
                                <Link to={`/product/${product.slug}`} tabIndex={-1} aria-hidden="true">
                                  <img
                                    src={asset?.src || product.image}
                                    srcSet={asset?.srcSet}
                                    sizes="(max-width: 768px) 100vw, 33vw"
                                    alt={product.imageAlt || product.title}
                                    loading="lazy"
                                    width={asset?.width || 800}
                                    height={asset?.height || 1200}
                                  />
                                </Link>
                                <span className="edition-badge">{product.edition}</span>
                                <button
                                  type="button"
                                  className={`bookmark-action-btn ${saved ? 'active' : ''}`}
                                  onClick={() => toggleSaved(product.id)}
                                  aria-label={saved ? `Remove ${product.title} from Saved Pieces` : `Save ${product.title} to Saved Pieces`}
                                  aria-pressed={saved}
                                  data-testid={`compass-save-${product.id}`}
                                >
                                  {saved ? (
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
                                    </svg>
                                  ) : (
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
                                    </svg>
                                  )}
                                </button>
                              </div>
                            </div>

                            {/* Details & Transparent Matching Reasons */}
                            <div className="col-12 col-md-7 col-lg-8">
                              <div className="d-flex align-items-center justify-content-between mb-2">
                                <div className="d-flex align-items-center gap-2">
                                  <span className="label-caps text-champagne">Recommendation #{index + 1}</span>
                                  <span className="text-champagne">•</span>
                                  <span className="label-caps text-muted-editorial">{product.category}</span>
                                </div>
                                <span className="badge badge-sand text-oxblood body-sm px-2 py-1" style={{ fontSize: '0.6875rem' }}>
                                  Affinity Score: {score} pts
                                </span>
                              </div>

                              <h3 className="headline-md text-oxblood mb-2">
                                <Link to={`/product/${product.slug}`} className="text-oxblood text-decoration-none">
                                  {product.title}
                                </Link>
                              </h3>

                              <div className="d-flex align-items-baseline gap-3 mb-3">
                                <span className="title-md text-oxblood fw-bold">
                                  {product.currency}{product.price.toLocaleString('en-IN')}
                                </span>
                                <span className="body-sm text-muted-editorial">
                                  House Ledger Valuation
                                </span>
                              </div>

                              <p className="body-md text-on-surface mb-4">
                                {product.description}
                              </p>

                              {/* Transparent Match Reasons */}
                              <div className="p-3 bg-canvas border-hairline mb-4" data-testid={`match-reasons-${product.id}`}>
                                <span className="label-caps text-oxblood d-block mb-2">
                                  Why This Silhouette Matched Your Inquiry:
                                </span>
                                <ul className="mb-0 ps-3">
                                  {matchReasons.map((reason, rIdx) => (
                                    <li key={rIdx} className="body-sm text-on-surface mb-1">
                                      <strong className="text-oxblood">{reason.category}:</strong> {reason.description}
                                    </li>
                                  ))}
                                </ul>
                              </div>

                              {/* Related Cultural Story Connection */}
                              {relatedStorySlug && (
                                <div className="mb-4">
                                  <span className="label-caps-wide text-champagne d-block mb-1">Cultural Archive Document</span>
                                  <Link to={`/archive/${relatedStorySlug}`} className="link-editorial">
                                    Examine Related Folio: {relatedStoryTitle || 'Cultural Story'} →
                                  </Link>
                                </div>
                              )}

                              {/* Action Link */}
                              <div className="d-flex gap-3 flex-wrap">
                                <Link to={`/product/${product.slug}`} className="btn-oxblood py-2 px-4 d-inline-flex align-items-center gap-2">
                                  <span>View Heirloom Folio</span>
                                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                    <line x1="5" y1="12" x2="19" y2="12"></line>
                                    <polyline points="12 5 19 12 12 19"></polyline>
                                  </svg>
                                </Link>
                              </div>
                            </div>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                </div>
              ) : (
                /* No-Match State (Zero Fallbacks Guaranteed) */
                <div className="p-5 bg-cream border-hairline text-center my-4" data-testid="compass-no-match">
                  <div className="d-inline-flex align-items-center gap-2 mb-3">
                    <span style={{ width: 16, height: 1, backgroundColor: 'var(--color-champagne-thread)' }}></span>
                    <span className="label-caps text-champagne">Zero Catalogue Matches</span>
                    <span style={{ width: 16, height: 1, backgroundColor: 'var(--color-champagne-thread)' }}></span>
                  </div>
                  <h2 className="headline-md text-oxblood mb-3">
                    No Single Silhouette Satisfies This Exact Combination
                  </h2>
                  <p className="body-lg text-muted-editorial mx-auto mb-4" style={{ maxWidth: 620 }}>
                    Our permanent collection is deliberately constrained to seven architectural pieces. The specific combination of fabric, movement, craft, and story you selected does not coincide within a single garment. We do not substitute arbitrary fallback items.
                  </p>
                  <div className="d-flex justify-content-center gap-3 flex-wrap">
                    <button
                      type="button"
                      className="btn-oxblood d-inline-flex align-items-center gap-2"
                      onClick={() => {
                        setStepDirection('backward');
                        setCurrentStep(1);
                        safeScrollToTop();
                      }}
                      data-testid="no-match-refine-btn"
                    >
                      <span>Refine Inquiries</span>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <line x1="4" y1="21" x2="4" y2="14"></line>
                        <line x1="4" y1="10" x2="4" y2="3"></line>
                        <line x1="12" y1="21" x2="12" y2="12"></line>
                        <line x1="12" y1="8" x2="12" y2="3"></line>
                        <line x1="20" y1="21" x2="20" y2="16"></line>
                        <line x1="20" y1="12" x2="20" y2="3"></line>
                        <line x1="1" y1="14" x2="7" y2="14"></line>
                        <line x1="9" y1="8" x2="15" y2="8"></line>
                        <line x1="17" y1="16" x2="23" y2="16"></line>
                      </svg>
                    </button>
                    <button
                      type="button"
                      className="btn-outline-editorial"
                      onClick={handleReset}
                      data-testid="no-match-reset-btn"
                    >
                      Reset Consultation
                    </button>
                  </div>
                </div>
              )}

              {/* Consultation Finished Navigation Bar */}
              <div className="d-flex align-items-center justify-content-between pt-4 border-hairline-t flex-wrap gap-3">
                <button
                  type="button"
                  className="btn-outline-editorial d-inline-flex align-items-center gap-2"
                  onClick={handleReset}
                  data-testid="results-reset-btn"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <polyline points="23 4 23 10 17 10"></polyline>
                    <polyline points="1 20 1 14 7 14"></polyline>
                    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
                  </svg>
                  <span>Restart Consultation</span>
                </button>

                <div className="d-flex gap-2">
                  <button
                    type="button"
                    className="btn-outline-editorial"
                    onClick={() => {
                      setStepDirection('backward');
                      setCurrentStep(1);
                      safeScrollToTop();
                    }}
                    data-testid="results-tweak-btn"
                  >
                    Adjust Inquiries
                  </button>
                  <Link to="/collections" className="btn-oxblood">
                    Explore Complete Repertoire
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Stepper Navigation Footer Controls (Steps 1–4) */}
          {currentStep < 5 && (
            <div className="d-flex align-items-center justify-content-between pt-4 border-hairline-t flex-wrap gap-3">
              <button
                type="button"
                className="btn-outline-editorial"
                onClick={handleReset}
                data-testid="step-reset-btn"
              >
                Reset
              </button>

              <div className="d-flex align-items-center gap-3">
                {currentStep > 1 && (
                  <button
                    type="button"
                    className="btn-outline-editorial d-inline-flex align-items-center gap-2"
                    onClick={handleBack}
                    data-testid="step-back-btn"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <line x1="19" y1="12" x2="5" y2="12"></line>
                      <polyline points="12 19 5 12 12 5"></polyline>
                    </svg>
                    <span>Back</span>
                  </button>
                )}

                <button
                  type="button"
                  className="btn-oxblood px-4 d-inline-flex align-items-center gap-2"
                  onClick={handleNext}
                  disabled={!isCurrentStepValid}
                  data-testid="step-continue-btn"
                >
                  <span>{currentStep === 4 ? 'Discover Matches' : 'Continue'}</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
};
