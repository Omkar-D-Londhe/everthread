import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useEditorialScroll } from '../hooks/useEditorialScroll.ts';

export const NotFoundPage: React.FC = () => {
  const mainRef = useRef<HTMLElement>(null);

  useEditorialScroll({
    scopeRef: mainRef,
    headerSelector: '.editorial-enter'
  });

  return (
    <main id="main-content" className="main-content" ref={mainRef}>
      <section className="py-5 bg-cream border-hairline-b text-center" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center' }}>
        <div className="page-container py-5">
          <div className="d-inline-flex align-items-center gap-2 mb-3 editorial-enter">
            <span style={{ width: 24, height: 1, backgroundColor: 'var(--color-champagne-thread)' }}></span>
            <span className="label-caps text-champagne">Folio Unrecorded</span>
            <span style={{ width: 24, height: 1, backgroundColor: 'var(--color-champagne-thread)' }}></span>
          </div>
          <h1 className="display-hero text-oxblood mb-3 editorial-enter" style={{ fontSize: '4rem' }}>
            404
          </h1>
          <p className="headline-sm text-on-surface fst-italic fw-light mb-4 editorial-enter">
            This thread has not yet been woven into the archive.
          </p>
          <p className="body-md text-muted-editorial mx-auto mb-4 editorial-enter" style={{ maxWidth: 520 }}>
            The requested atelier folio, silhouette, or monograph could not be located.
          </p>
          <div className="d-flex justify-content-center gap-3 editorial-enter">
            <Link to="/" className="btn-oxblood">
              <span>Return to Atelier Home</span>
            </Link>
            <Link to="/collections" className="btn-outline-editorial">
              <span>Explore Repertoire</span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};
