import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { DIAGRAM_ASSETS, TECHNIQUE_STRIP_DIAGRAM_IDS, DiagramAsset } from '../../data/assetMap.ts';

interface TechniqueStripProps {
  activeDiagramId?: string;
  onSelectDiagram?: (id: string) => void;
}

export const TechniqueStrip: React.FC<TechniqueStripProps> = ({
  activeDiagramId,
  onSelectDiagram
}) => {
  // Track image error states per diagram: 'none' -> 'svg-failed' (fallback to PNG) -> 'all-failed' (fallback to title text)
  const [imageErrorMap, setImageErrorMap] = useState<Record<string, 'svg-failed' | 'all-failed'>>({});

  const handleImageError = (id: string) => {
    setImageErrorMap(prev => {
      const current = prev[id];
      if (!current) {
        return { ...prev, [id]: 'svg-failed' };
      }
      return { ...prev, [id]: 'all-failed' };
    });
  };

  const diagrams: DiagramAsset[] = TECHNIQUE_STRIP_DIAGRAM_IDS
    .map(id => DIAGRAM_ASSETS[id])
    .filter(Boolean);

  return (
    <section
      className="py-5 bg-stone border-hairline-b technique-strip-section"
      data-testid="technique-strip"
      aria-label="Archival Technique Drafting Strip"
    >
      <div className="page-container">
        {/* Header Metadata */}
        <div className="d-flex align-items-center justify-content-between mb-4 pb-2 border-hairline-b">
          <div>
            <div className="d-flex align-items-center gap-2 mb-1">
              <span style={{ width: 16, height: 1, backgroundColor: 'var(--color-champagne-thread)' }}></span>
              <span className="label-caps text-champagne">Drafting Schematics &amp; Taxonomy</span>
            </div>
            <h2 className="headline-md text-oxblood mb-0">Technique Strip</h2>
          </div>
          <span className="body-sm text-muted-editorial d-none d-md-inline">
            9 Archival Schematics • Scroll horizontally to examine
          </span>
        </div>

        {/* Horizontally scrollable snap strip */}
        <div
          className="technique-strip-track"
          data-testid="technique-strip-track"
          tabIndex={0}
          role="region"
          aria-label="Horizontal scrollable technique diagrams strip"
        >
          {diagrams.map((diag, index) => {
            const errState = imageErrorMap[diag.id];
            const isActive = activeDiagramId === diag.id;

            return (
              <Link
                key={diag.id}
                to={`/archive?diagram=${diag.id}`}
                onClick={() => {
                  if (onSelectDiagram) {
                    onSelectDiagram(diag.id);
                  }
                }}
                onFocus={(e) => {
                  e.currentTarget.scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest',
                    inline: 'center'
                  });
                }}
                className={`technique-strip-card ${isActive ? 'is-active' : ''}`}
                data-testid={`technique-strip-item-${diag.id}`}
                data-diagram-id={diag.id}
                aria-label={`Diagram 0${index + 1}: ${diag.title}`}
              >
                {/* Visual Thumbnail Frame */}
                <div className="technique-strip-thumb-wrap">
                  {errState === 'all-failed' ? (
                    <div
                      className="technique-strip-fallback-text"
                      data-testid={`technique-strip-fallback-${diag.id}`}
                    >
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                        className="text-muted-editorial mb-1"
                      >
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                        <line x1="16" y1="13" x2="8" y2="13"></line>
                        <line x1="16" y1="17" x2="8" y2="17"></line>
                        <polyline points="10 9 9 9 8 9"></polyline>
                      </svg>
                      <span className="body-xs text-oxblood fw-medium text-center px-2">
                        {diag.title}
                      </span>
                    </div>
                  ) : (
                    <img
                      src={errState === 'svg-failed' ? diag.fallbackPng : diag.svg}
                      alt={diag.title}
                      className="technique-strip-img"
                      loading="lazy"
                      data-testid={`technique-strip-img-${diag.id}`}
                      onError={() => handleImageError(diag.id)}
                    />
                  )}
                  <span className="technique-strip-index-badge">
                    0{index + 1}
                  </span>
                </div>

                {/* Visible Title & Instruction */}
                <div className="technique-strip-meta">
                  <h3
                    className="technique-strip-title text-oxblood"
                    data-testid={`technique-strip-title-${diag.id}`}
                  >
                    {diag.title}
                  </h3>
                  <span className="technique-strip-cta text-muted-editorial body-xs">
                    Examine schematic →
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};
