import React from 'react';
import { Link } from 'react-router-dom';
import { WeaveLibraryItem } from '../../types/catalog.ts';
import { ArchiveDisciplineGroup } from '../../data/archiveDisciplines.ts';

interface DisciplineGroupProps {
  group: ArchiveDisciplineGroup;
  items: WeaveLibraryItem[];
  onOpenExhibition: (traditionKeyOrSlug: string) => void;
}

export const DisciplineGroup: React.FC<DisciplineGroupProps> = ({
  group,
  items,
  onOpenExhibition
}) => {
  if (items.length === 0) return null;

  // Render a single weave card with responsive layout flags
  const renderCard = (item: WeaveLibraryItem, isFeature: boolean, stretch: boolean = true) => {
    return (
      <article
        className={`p-4 bg-canvas border-hairline d-flex flex-column justify-content-between editorial-card ${
          stretch ? 'h-100' : ''
        } ${
          isFeature ? 'discipline-feature-card' : 'discipline-standard-card'
        }`}
        data-testid={`weave-card-${item.slug}`}
      >
        <div>
          {item.image && (
            <div
              className="mb-3 overflow-hidden border-hairline position-relative"
              style={{
                aspectRatio: isFeature ? '16/11' : '16/10',
                backgroundColor: 'var(--color-surface)'
              }}
            >
              <img
                src={item.image}
                alt={item.imageAlt || item.title}
                className="w-100 h-100 object-fit-cover"
                loading="lazy"
                width={isFeature ? 600 : 400}
                height={isFeature ? 412 : 250}
              />
              {item.traditionKey ? (
                <button
                  type="button"
                  className="position-absolute bottom-0 end-0 m-2 px-2 py-1 bg-surface border-hairline label-caps text-oxblood body-sm d-flex align-items-center gap-1"
                  style={{ fontSize: '0.625rem', backdropFilter: 'blur(4px)', cursor: 'pointer' }}
                  onClick={() => onOpenExhibition(item.traditionKey || item.slug)}
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

          <h3
            className={`headline-sm text-oxblood mb-2 ${isFeature ? 'fw-bold' : ''}`}
            style={{ fontSize: isFeature ? '1.5rem' : '1.25rem' }}
          >
            {item.title}
          </h3>

          <p className="body-sm text-muted-editorial mb-3">
            {item.description}
          </p>
        </div>

        <div className="pt-3 border-hairline-t body-sm mt-auto">
          <div className="mb-1">
            <strong className="text-oxblood fw-medium">Fiber:</strong>{' '}
            <span className="text-muted-editorial">{item.fiber}</span>
          </div>
          <div className="mb-1">
            <strong className="text-oxblood fw-medium">Loom Sett / Structure:</strong>{' '}
            <span className="text-muted-editorial">{item.warpDensity}</span>
          </div>
          <div>
            <strong className="text-oxblood fw-medium">Profile:</strong>{' '}
            <span className="text-muted-editorial">{item.structuralProfile}</span>
          </div>

          {item.traditionKey ? (
            <button
              type="button"
              className="btn-outline-editorial w-100 py-2 mt-3 d-flex align-items-center justify-content-center gap-2"
              onClick={() => onOpenExhibition(item.traditionKey || item.slug)}
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
    );
  };

  // Asymmetric Layout Renderer per preset
  const renderLayout = () => {
    switch (group.layoutPreset) {
      case 'feature-left': {
        const featureItem = items[0];
        const secondItem = items[1];
        const remainingItems = items.slice(2);

        return (
          <>
            {/* Lead Asymmetric Row: Feature 7/12, Secondary 5/12 */}
            <div className="row g-4 mb-4">
              {featureItem && (
                <div className="col-12 col-lg-7">
                  {renderCard(featureItem, true)}
                </div>
              )}
              {secondItem && (
                <div className="col-12 col-lg-5">
                  {renderCard(secondItem, false)}
                </div>
              )}
            </div>

            {/* Remaining items in 3-column rhythm */}
            {remainingItems.length > 0 && (
              <div className="row g-4">
                {remainingItems.map(item => (
                  <div key={item.id} className="col-12 col-md-6 col-lg-4">
                    {renderCard(item, false)}
                  </div>
                ))}
              </div>
            )}
          </>
        );
      }

      case 'feature-right': {
        const firstItem = items[0];
        const featureItem = items[1] || items[0];
        const remainingItems = items.slice(2);

        return (
          <>
            <div className="row g-4 mb-4">
              {firstItem && items.length > 1 && (
                <div className="col-12 col-lg-5 order-2 order-lg-1">
                  {renderCard(firstItem, false)}
                </div>
              )}
              <div className="col-12 col-lg-7 order-1 order-lg-2">
                {renderCard(featureItem, true)}
              </div>
            </div>

            {remainingItems.length > 0 && (
              <div className="row g-4">
                {remainingItems.map(item => (
                  <div key={item.id} className="col-12 col-md-6 col-lg-4">
                    {renderCard(item, false)}
                  </div>
                ))}
              </div>
            )}
          </>
        );
      }

      case 'triptych': {
        const leadItem = items[0];
        const otherItems = items.slice(1);

        return (
          <div className="row g-4 align-items-start">
            {leadItem && (
              <div className="col-12 col-lg-6">
                {renderCard(leadItem, true, false)}
              </div>
            )}
            <div className="col-12 col-lg-6">
              <div className="row g-4">
                {otherItems.map(item => (
                  <div key={item.id} className="col-12 col-md-6 col-lg-12">
                    {renderCard(item, false)}
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      }

      case 'monograph-single':
      default: {
        return (
          <div className="row g-4">
            <div className="col-12 col-lg-8 mx-auto">
              {renderCard(items[0], true)}
            </div>
          </div>
        );
      }
    }
  };

  return (
    <div
      className="mb-5 pb-4 discipline-group-section"
      data-testid={`discipline-group-${group.discipline}`}
      data-discipline={group.discipline}
    >
      {/* Discipline Header & Descriptive Line */}
      <div className="d-flex align-items-center justify-content-between mb-3 pb-2 border-hairline-b">
        <div>
          <span className="label-caps text-champagne d-block mb-1">
            {group.categoryHeading} • {items.length} {items.length === 1 ? 'Tradition' : 'Traditions'}
          </span>
          <h3 className="headline-sm text-oxblood mb-1">
            {group.title}
          </h3>
        </div>
      </div>
      <p className="body-sm text-muted-editorial mb-4" style={{ maxWidth: 760 }}>
        {group.description}
      </p>

      {/* Asymmetric Cards */}
      {renderLayout()}
    </div>
  );
};
