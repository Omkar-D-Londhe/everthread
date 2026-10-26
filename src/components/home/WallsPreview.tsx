import React from 'react';
import { Link } from 'react-router-dom';

export const WallsPreview: React.FC = () => {
  return (
    <div className="walls-preview-doors row g-4 g-lg-5" data-testid="walls-preview-doors">
      {/* Door 1: Contemporary Collection */}
      <div className="col-12 col-md-6">
        <Link 
          to="/collections" 
          className="wall-door-card d-block text-decoration-none"
          data-testid="wall-door-contemporary"
          aria-label="Enter Contemporary Collection Wall"
        >
          <div className="wall-door-frame overflow-hidden border-hairline position-relative">
            <img 
              src="/images/home/contemporary-collection-plate.webp"
              srcSet="/images/home/contemporary-collection-plate-800w.webp 800w, /images/home/contemporary-collection-plate-1280w.webp 1280w, /images/home/contemporary-collection-plate-1672w.webp 1672w"
              sizes="(max-width: 768px) 100vw, 50vw"
              alt="Contemporary Collection architectural drape"
              className="wall-door-img w-100"
              loading="lazy"
            />
            <div className="wall-door-overlay d-flex flex-column justify-content-end p-4 p-lg-5">
              <span className="label-caps text-champagne d-block mb-1">
                Volume 01 · Permanent Repertoire
              </span>
              <h3 className="headline-md text-white font-serif mb-2">
                Contemporary Collection
              </h3>
              <p className="body-sm text-sand mb-3" style={{ maxWidth: 360, opacity: 0.9 }}>
                Architectural silhouettes crafted in unbleached silk and high-twist wool.
              </p>
              <div className="wall-door-cta d-inline-flex align-items-center gap-2 text-champagne body-sm fw-medium">
                <span>Explore the collection</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* Door 2: The Living Inheritance */}
      <div className="col-12 col-md-6">
        <Link 
          to="/collections/the-living-inheritance" 
          className="wall-door-card d-block text-decoration-none"
          data-testid="wall-door-living-inheritance"
          aria-label="Enter The Living Inheritance Wall"
        >
          <div className="wall-door-frame overflow-hidden border-hairline position-relative">
            <img 
              src="/images/home/living-inheritance-campaign-r1.webp"
              srcSet="/images/home/living-inheritance-campaign-r1-800w.webp 800w, /images/home/living-inheritance-campaign-r1-1280w.webp 1280w, /images/home/living-inheritance-campaign-r1-1672w.webp 1672w"
              sizes="(max-width: 768px) 100vw, 50vw"
              alt="The Living Inheritance artisanal loom atmosphere"
              className="wall-door-img w-100"
              loading="lazy"
            />
            <div className="wall-door-overlay d-flex flex-column justify-content-end p-4 p-lg-5">
              <span className="label-caps text-champagne d-block mb-1">
                Volume 02 · Heritage Archive
              </span>
              <h3 className="headline-md text-white font-serif mb-2">
                The Living Inheritance
              </h3>
              <p className="body-sm text-sand mb-3" style={{ maxWidth: 360, opacity: 0.9 }}>
                Exploratory concept pieces inspired by classical subcontinental loom disciplines.
              </p>
              <div className="wall-door-cta d-inline-flex align-items-center gap-2 text-champagne body-sm fw-medium">
                <span>Explore curatorial archive</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};
