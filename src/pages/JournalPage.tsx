import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { JOURNAL_ARTICLES } from '../data/journal.ts';

export const JournalPage: React.FC = () => {
  const [subEmail, setSubEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (subEmail.trim()) {
      setSubscribed(true);
    }
  };

  const featuredArticle = JOURNAL_ARTICLES[0];
  const remainingArticles = JOURNAL_ARTICLES.slice(1);

  return (
    <main id="main-content" className="main-content bg-canvas" data-testid="journal-page">
      {/* Editorial Header */}
      <section className="py-5 bg-cream border-hairline-b">
        <div className="page-container">
          <div className="d-flex align-items-center gap-2 mb-2">
            <span style={{ width: 24, height: 1, backgroundColor: 'var(--color-champagne-thread)' }}></span>
            <span className="label-caps text-champagne">The EverThread Gazette</span>
          </div>

          <h1 className="display-hero text-oxblood mb-3" style={{ fontSize: '3.5rem' }}>
            Monographs &amp; Essays
          </h1>

          <p className="body-lg text-muted-editorial mb-0" style={{ maxWidth: 680 }}>
            Quarterly critical writings on textile ecology, guild anthropology, anatomical drape engineering, and the enduring poetics of slow fashion.
          </p>
        </div>
      </section>

      {/* Featured Lead Monograph Section */}
      {featuredArticle && (
        <section className="py-5 bg-canvas border-hairline-b" data-testid="featured-article-section">
          <div className="page-container">
            <article className="p-4 p-lg-5 bg-stone border-hairline">
              <div className="row g-5 align-items-center">
                <div className="col-12 col-lg-7">
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <span className="badge badge-sand text-oxblood body-sm px-2 py-1" style={{ fontSize: '0.6875rem' }}>
                      Featured Monograph
                    </span>
                    <span className="label-caps text-champagne">• {featuredArticle.category}</span>
                  </div>

                  <h2 className="headline-lg text-oxblood mb-3" style={{ fontSize: '2.5rem' }}>
                    <Link to={`/journal/${featuredArticle.slug}`} className="text-oxblood text-decoration-none">
                      {featuredArticle.title}
                    </Link>
                  </h2>

                  <p className="headline-sm text-on-surface fst-italic fw-light mb-3" style={{ fontSize: '1.125rem' }}>
                    {featuredArticle.subtitle}
                  </p>

                  <p className="body-md text-muted-editorial mb-4">
                    {featuredArticle.excerpt}
                  </p>

                  <div className="d-flex flex-wrap align-items-center gap-3 text-muted-editorial label-caps mb-4">
                    <span>{featuredArticle.author}</span>
                    <span>•</span>
                    <span>{featuredArticle.readTime}</span>
                    <span>•</span>
                    <span className="text-oxblood">{featuredArticle.date}</span>
                  </div>

                  <Link 
                    to={`/journal/${featuredArticle.slug}`} 
                    className="btn-oxblood py-2 px-4 d-inline-flex align-items-center gap-2"
                    data-testid={`read-article-${featuredArticle.slug}`}
                  >
                    <span>Read Complete Monograph</span>
                    <span className="material-symbols-outlined fs-6">arrow_forward</span>
                  </Link>
                </div>

                <div className="col-12 col-lg-5">
                  <div className="position-relative overflow-hidden border-hairline shadow-sm" style={{ aspectRatio: '4/3', backgroundColor: 'var(--color-surface)' }}>
                    <img
                      src={featuredArticle.image || '/images/journal/journal-architecture-01.webp'}
                      alt={featuredArticle.imageAlt || 'EverThread Gazette Monograph Feature'}
                      className="w-100 h-100 object-fit-cover"
                      loading="eager"
                      width={600}
                      height={450}
                    />
                    <div className="position-absolute bottom-0 start-0 m-3 px-3 py-1 bg-oxblood text-white border-hairline">
                      <span className="label-caps-wide text-champagne-glow" style={{ fontSize: '0.625rem' }}>
                        GAZETTE MONOGRAPH • ISSUE 01
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          </div>
        </section>
      )}

      {/* Gazette Archive Articles Grid */}
      <section className="py-5 bg-cream border-hairline-b">
        <div className="page-container">
          <div className="d-flex align-items-center justify-content-between mb-4 pb-2 border-hairline-b">
            <div>
              <span className="label-caps text-champagne d-block mb-1">Gazette Library</span>
              <h2 className="headline-md text-oxblood mb-0">Critical Textile Monographs</h2>
            </div>
            <span className="body-sm text-muted-editorial">
              {JOURNAL_ARTICLES.length} Published Essays
            </span>
          </div>

          <div className="row g-4" data-testid="journal-grid">
            {remainingArticles.map(article => (
              <div key={article.id} className="col-12 col-md-6">
                <article 
                  className="p-4 bg-canvas border-hairline h-100 d-flex flex-column justify-content-between"
                  data-testid={`journal-card-${article.slug}`}
                >
                  <div>
                    {article.image && (
                      <div className="mb-3 overflow-hidden border-hairline position-relative" style={{ aspectRatio: '16/10', backgroundColor: 'var(--color-surface)' }}>
                        <img
                          src={article.image}
                          alt={article.imageAlt || article.title}
                          className="w-100 h-100 object-fit-cover"
                          loading="lazy"
                          width={500}
                          height={312}
                        />
                      </div>
                    )}

                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="label-caps text-champagne">{article.category}</span>
                      <span className="label-caps text-muted-editorial">{article.readTime}</span>
                    </div>

                    <h3 className="headline-sm text-oxblood mb-2" style={{ fontSize: '1.35rem' }}>
                      <Link to={`/journal/${article.slug}`} className="text-oxblood text-decoration-none">
                        {article.title}
                      </Link>
                    </h3>

                    <p className="body-sm text-on-surface fst-italic mb-3">
                      {article.subtitle}
                    </p>

                    <p className="body-sm text-muted-editorial mb-4">
                      {article.excerpt}
                    </p>
                  </div>

                  <div className="pt-3 border-hairline-t d-flex justify-content-between align-items-center">
                    <span className="label-caps text-muted-editorial">{article.date}</span>
                    <Link 
                      to={`/journal/${article.slug}`} 
                      className="link-editorial d-inline-flex align-items-center gap-1"
                      data-testid={`read-article-${article.slug}`}
                    >
                      <span>Read Monograph</span>
                      <span className="material-symbols-outlined fs-6">arrow_forward</span>
                    </Link>
                  </div>
                </article>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gazette Print Dispatch Subscription */}
      <section className="py-5 bg-stone border-hairline-b">
        <div className="page-container">
          <div className="row justify-content-center">
            <div className="col-12 col-lg-8 text-center">
              <span className="label-caps text-champagne d-block mb-2">QUARTERLY DISPATCH</span>
              <h2 className="headline-md text-oxblood mb-2">Receive the EverThread Gazette</h2>
              <p className="body-sm text-muted-editorial mb-4">
                Quarterly monographs, curatorial field notes, and weave analyses delivered directly to your correspondence.
              </p>

              {subscribed ? (
                <div className="p-3 bg-canvas border-hairline" data-testid="gazette-subscribed-plinth">
                  <span className="material-symbols-outlined text-champagne fs-4 align-middle me-2">verified</span>
                  <span className="body-sm text-oxblood fw-medium">
                    Correspondence registered. You will receive Volume I in your inbox.
                  </span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="d-flex justify-content-center gap-2 flex-wrap">
                  <input
                    type="email"
                    value={subEmail}
                    onChange={(e) => setSubEmail(e.target.value)}
                    placeholder="Enter your correspondence email"
                    className="form-control form-control-editorial"
                    style={{ maxWidth: 360 }}
                    required
                    data-testid="gazette-email-input"
                  />
                  <button type="submit" className="btn-oxblood px-4 py-2" data-testid="gazette-subscribe-btn">
                    <span>Subscribe to Gazette</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};
