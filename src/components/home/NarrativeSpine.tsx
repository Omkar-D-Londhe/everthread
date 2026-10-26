import React from 'react';
import { Link } from 'react-router-dom';

export const NarrativeSpine: React.FC = () => {
  const steps = [
    { label: 'Thread', path: '/compass', caption: 'Intuitive Navigation' },
    { label: 'Textile', path: '/archive', caption: 'Weave Library' },
    { label: 'Craft', path: '/archive', caption: 'Living Disciplines' },
    { label: 'Garment', path: '/collections', caption: 'Permanent Repertoire' },
    { label: 'Story', path: '/journal', caption: 'Monographs' },
  ];

  const brandLines = [
    'An heirloom, not a trend.',
    'Every thread carries a story.',
    'One thread. A world of stories.'
  ];

  return (
    <div className="row g-5 align-items-start" data-testid="making-promise-composite">
      {/* Column 1: The Making (Approved 5-Stage Narrative Spine) */}
      <div className="col-12 col-lg-6 border-hairline-end-lg pe-lg-5" data-testid="narrative-spine-col">
        <div className="d-flex align-items-center gap-2 mb-2">
          <span style={{ width: 16, height: 1, backgroundColor: 'var(--color-champagne-thread)' }}></span>
          <span className="label-caps text-champagne">The Making</span>
        </div>
        <h3 className="headline-lg text-oxblood font-serif mb-4">
          Architectural Lineage
        </h3>

        <nav aria-label="The Making Narrative Spine" className="narrative-spine-list d-flex flex-column gap-3">
          {steps.map((step, idx) => (
            <Link
              key={step.label}
              to={step.path}
              className="narrative-spine-step d-flex align-items-center justify-content-between p-3 bg-stone border-hairline text-decoration-none transition-base"
              data-testid={`spine-step-${step.label.toLowerCase()}`}
            >
              <div className="d-flex align-items-center gap-3">
                <span className="font-serif text-champagne body-sm fw-medium">
                  0{idx + 1}
                </span>
                <span className="font-serif headline-sm text-oxblood">
                  {step.label}
                </span>
              </div>
              <div className="d-flex align-items-center gap-2 text-muted-editorial body-xs">
                <span>{step.caption}</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </div>
            </Link>
          ))}
        </nav>
      </div>

      {/* Column 2: The Promise (Approved 3 Brand Lines) */}
      <div className="col-12 col-lg-6 ps-lg-5" data-testid="brand-promise-col">
        <div className="d-flex align-items-center gap-2 mb-2">
          <span style={{ width: 16, height: 1, backgroundColor: 'var(--color-champagne-thread)' }}></span>
          <span className="label-caps text-champagne">The Promise</span>
        </div>
        <h3 className="headline-lg text-oxblood font-serif mb-4">
          House Disciplines
        </h3>

        <div className="promise-lines-wrap d-flex flex-column gap-4 py-2">
          {brandLines.map((line, idx) => (
            <div 
              key={idx} 
              className="promise-line-item p-4 bg-cream border-hairline"
              data-testid={`promise-line-${idx + 1}`}
            >
              <span className="label-caps-wide text-champagne d-block mb-1">Principle 0{idx + 1}</span>
              <p className="headline-md text-oxblood font-serif mb-0 fst-italic">
                “{line}”
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
