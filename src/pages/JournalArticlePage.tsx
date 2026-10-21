import React, { useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getArticleBySlug, JOURNAL_ARTICLES } from '../data/journal.ts';
import { useEditorialScroll } from '../hooks/useEditorialScroll.ts';

export const JournalArticlePage: React.FC = () => {
  const { articleSlug } = useParams<{ articleSlug: string }>();
  const article = articleSlug ? getArticleBySlug(articleSlug) : undefined;

  // Handle Invalid / Non-Existent Article Slug
  if (!article) {
    return (
      <main id="main-content" className="main-content bg-canvas" data-testid="journal-article-page">
        <section className="py-5">
          <div className="page-container">
            <div className="empty-curation-box" data-testid="article-not-found">
              <span className="material-symbols-outlined text-champagne fs-1 mb-3">menu_book</span>
              <h1 className="headline-md text-oxblood mb-2">Monograph Not Found</h1>
              <p className="body-md text-muted-editorial mx-auto mb-4" style={{ maxWidth: 540 }}>
                The requested journal essay &ldquo;{articleSlug}&rdquo; has not been catalogued in the EverThread Gazette archive.
              </p>
              <Link to="/journal" className="btn-oxblood px-4 py-2" data-testid="return-journal-btn">
                ← Return to Gazette Index
              </Link>
            </div>
          </div>
        </section>
      </main>
    );
  }

  // Find adjacent articles for navigation
  const currentIndex = JOURNAL_ARTICLES.findIndex(a => a.slug === article.slug);
  const prevArticle = currentIndex > 0 ? JOURNAL_ARTICLES[currentIndex - 1] : undefined;
  const nextArticle = currentIndex < JOURNAL_ARTICLES.length - 1 ? JOURNAL_ARTICLES[currentIndex + 1] : undefined;

  const mainRef = useRef<HTMLElement>(null);

  useEditorialScroll({
    scopeRef: mainRef,
    headerSelector: '.editorial-enter',
    sectionSelector: '.editorial-section',
    deps: [article?.slug]
  });

  return (
    <main id="main-content" className="main-content bg-canvas" data-testid="journal-article-page" ref={mainRef}>
      {/* Editorial Breadcrumbs */}
      <div className="py-2 border-hairline-b bg-stone">
        <div className="page-container">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-0 body-sm">
              <li className="breadcrumb-item"><Link to="/" className="text-muted-editorial text-decoration-none">Home</Link></li>
              <li className="breadcrumb-item"><Link to="/journal" className="text-muted-editorial text-decoration-none">Journal</Link></li>
              <li className="breadcrumb-item active text-oxblood fw-medium" aria-current="page">{article.category}</li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Monograph Header Plinth */}
      <section className="py-5 bg-cream border-hairline-b">
        <div className="page-container">
          <div className="mx-auto" style={{ maxWidth: 840 }}>
            <div className="d-flex align-items-center gap-2 mb-2 editorial-enter">
              <span className="label-caps text-champagne">{article.category}</span>
              <span className="text-champagne">•</span>
              <span className="label-caps text-muted-editorial">{article.date}</span>
              <span className="text-champagne">•</span>
              <span className="label-caps text-muted-editorial">{article.readTime}</span>
            </div>

            <h1 className="display-hero text-oxblood mb-3 editorial-enter" data-testid="article-title" style={{ fontSize: '2.75rem', lineHeight: 1.2 }}>
              {article.title}
            </h1>
            <span className="visually-hidden">{article.slug.replace(/-/g, ' ')}</span>

            <p className="headline-sm text-on-surface fst-italic fw-light mb-4 editorial-enter" data-testid="article-subtitle" style={{ fontSize: '1.25rem' }}>
              {article.subtitle}
            </p>

            <div className="pt-2 border-hairline-t d-flex align-items-center justify-content-between flex-wrap gap-2 body-sm text-muted-editorial">
              <div>
                <span className="fw-medium text-oxblood">By {article.author}</span>
                <span className="d-block text-muted-editorial" style={{ fontSize: '0.75rem' }}>{article.authorRole}</span>
              </div>
              <Link to="/journal" className="body-sm text-oxblood text-decoration-underline">
                ← Gazette Index
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Article Prose Content */}
      <section className="py-5 editorial-section">
        <div className="page-container">
          <article className="mx-auto" style={{ maxWidth: 800 }}>
            {/* Excerpt Lead Paragraph */}
            <p className="body-lg text-oxblood fw-medium fst-italic mb-5 pb-3 border-hairline-b" style={{ fontSize: '1.25rem', lineHeight: 1.75 }}>
              {article.excerpt}
            </p>

            {/* Featured Article Lead Specimen */}
            {article.image && (
              <div className="mb-5 overflow-hidden border-hairline bg-stone editorial-image" style={{ aspectRatio: '16/9', maxHeight: 480 }}>
                <img
                  src={article.image}
                  alt={article.imageAlt || article.title}
                  className="w-100 h-100 object-fit-cover"
                  data-testid="article-lead-image"
                  loading="eager"
                  width={800}
                  height={450}
                />
              </div>
            )}

            {/* Body Paragraphs */}
            <div className="journal-article-prose" data-testid="article-body-content">
              {article.bodyParagraphs.map((paragraph, pIdx) => (
                <p key={pIdx}>
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Academic & Field Sources */}
            {article.sources && article.sources.length > 0 && (
              <div className="mt-5 p-4 bg-stone border-hairline" data-testid="article-sources-box">
                <span className="label-caps text-champagne d-block mb-2">Academic &amp; Historical Sources</span>
                <ul className="list-unstyled mb-0 body-sm text-muted-editorial">
                  {article.sources.map((src, sIdx) => (
                    <li key={sIdx} className="mb-1 d-flex align-items-baseline gap-2">
                      <span className="text-champagne">§</span>
                      <span>{src}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Editorial Disclosure */}
            {article.contentFlags?.isEditorialPersona && (
              <div className="mt-3 p-3 bg-canvas border-hairline body-sm text-muted-editorial" style={{ fontSize: '0.75rem' }}>
                <span className="fw-medium text-oxblood">Curatorial Note:</span> This monograph was authored as an educational critical essay by the EverThread editorial board. Author personas and simulated field notes are compiled for curatorial demonstration.
              </div>
            )}

            {/* Next / Prev Article Navigation */}
            <div className="mt-5 pt-4 border-hairline-t d-flex justify-content-between align-items-center gap-3">
              {prevArticle ? (
                <Link to={`/journal/${prevArticle.slug}`} className="btn-outline-editorial text-start" data-testid="prev-article-link">
                  <span className="label-caps-wide text-muted-editorial d-block" style={{ fontSize: '0.625rem' }}>Previous Monograph</span>
                  <span className="fw-medium">← {prevArticle.title}</span>
                </Link>
              ) : <div />}

              {nextArticle ? (
                <Link to={`/journal/${nextArticle.slug}`} className="btn-outline-editorial text-end" data-testid="next-article-link">
                  <span className="label-caps-wide text-muted-editorial d-block" style={{ fontSize: '0.625rem' }}>Next Monograph</span>
                  <span className="fw-medium">{nextArticle.title} →</span>
                </Link>
              ) : <div />}
            </div>
          </article>
        </div>
      </section>
    </main>
  );
};
