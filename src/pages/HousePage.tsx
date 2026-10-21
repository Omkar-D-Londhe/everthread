import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useEditorialScroll } from '../hooks/useEditorialScroll.ts';

interface AppointmentForm {
  name: string;
  email: string;
  atelier: string;
  garment: string;
  notes: string;
}

export const HousePage: React.FC = () => {
  const [formData, setFormData] = useState<AppointmentForm>({
    name: '',
    email: '',
    atelier: 'Paris Atelier (Rue de Rivoli)',
    garment: 'Oxblood Wool-Silk Signature Coat-Dress',
    notes: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const mainRef = useRef<HTMLElement>(null);

  useEditorialScroll({
    scopeRef: mainRef,
    headerSelector: '.editorial-enter',
    staggerSelector: '.editorial-card',
    sectionSelector: '.editorial-section'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) {
      setFormError('Please provide your name and email address to request a salon appointment.');
      return;
    }
    setFormError(null);
    setSubmitted(true);
  };

  return (
    <main id="main-content" className="main-content bg-canvas" data-testid="house-page" ref={mainRef}>
      {/* Hero Header */}
      <section className="py-5 bg-cream border-hairline-b">
        <div className="page-container">
          <div className="row g-5 align-items-center">
            <div className="col-12 col-lg-7">
              <div className="d-flex align-items-center gap-2 mb-2 editorial-enter">
                <span style={{ width: 24, height: 1, backgroundColor: 'var(--color-champagne-thread)' }}></span>
                <span className="label-caps text-champagne">The House of EverThread</span>
              </div>

              <h1 className="display-hero text-oxblood mb-3 editorial-enter" style={{ fontSize: '3.5rem' }}>
                An heirloom, not a trend.
              </h1>

              <p className="headline-sm text-on-surface fst-italic fw-light mb-4 editorial-enter">
                Every thread carries a story.
              </p>

              <p className="body-lg text-muted-editorial mb-4 editorial-enter" style={{ maxWidth: 640 }}>
                EverThread was conceived upon an architectural imperative: that clothing must return to its enduring, cultural, and generational foundations. We create garments meant to outlive fleeting trend cycles, constructed with noble raw fibers and preserved through generational covenants.
              </p>

              <div className="d-flex flex-wrap gap-3 editorial-enter">
                <Link to="/collections" className="btn-oxblood">
                  Explore Curated Repertoire
                </Link>
                <a href="#philosophy" className="btn-outline-editorial">
                  Craftsmanship Creed
                </a>
              </div>
            </div>

            <div className="col-12 col-lg-5">
              <div className="position-relative overflow-hidden border-hairline shadow-sm editorial-enter" style={{ aspectRatio: '4/3', backgroundColor: 'var(--color-surface)' }}>
                <img
                  src="/images/house/house-philosophy-01.webp"
                  srcSet="/images/house/house-philosophy-01.webp 1536w, /images/house/house-philosophy-01-1200w.webp 1200w, /images/house/house-philosophy-01-800w.webp 800w, /images/house/house-philosophy-01-400w.webp 400w"
                  sizes="(max-width: 768px) 100vw, 450px"
                  alt="The House of EverThread atelier architectural study"
                  className="w-100 h-100 object-fit-cover"
                  loading="eager"
                  width={600}
                  height={450}
                />
                <div className="position-absolute bottom-0 start-0 m-3 px-3 py-1 bg-oxblood text-white border-hairline">
                  <span className="label-caps-wide text-champagne-glow" style={{ fontSize: '0.625rem' }}>
                    ATELIER PHILOSOPHY • FOUNDING MONOGRAPH
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Craftsmanship Creed Section */}
      <section id="philosophy" className="py-5 bg-canvas border-hairline-b editorial-section">
        <div className="page-container">
          <div className="row g-5 align-items-center">
            <div className="col-12 col-lg-7">
              <span className="label-caps text-champagne d-block mb-2">FOUNDATIONAL CREED</span>
              <h2 className="headline-md text-oxblood mb-3">Patience as an Architectural Principle</h2>
              <p className="body-md text-on-surface mb-3">
                Industrial garment manufacturing is engineered around high-speed automated throughput and rapid obsolescence. In contrast, EverThread embraces measured slowness. A single piece in our permanent repertoire spends weeks on the traditional loom, allowing raw fiber tensions to settle naturally into equilibrium.
              </p>
              <p className="body-md text-on-surface mb-4">
                We eliminate synthetic fusibles and toxic glue interlinings. Every lapel, collar, and hem is shaped using traditional horsehair floating canvas, hand-basting, and silk organza taped French seams that allow the garment to expand, breathe, and move with the wearer.
              </p>

              <div className="p-4 bg-stone border-hairline">
                <span className="label-caps text-oxblood d-block mb-1">Generational Inlay Covenant</span>
                <p className="body-sm text-muted-editorial mb-0">
                  All tailored garments incorporate 1.5-inch hidden side-seam and hem inlays, ensuring each heirloom can be altered and adapted across generations.
                </p>
              </div>
            </div>

            <div className="col-12 col-lg-5">
              <div className="overflow-hidden border-hairline bg-stone">
                <div className="position-relative" style={{ aspectRatio: '16/10' }}>
                  <img
                    src="/images/house/house-design-studio-01.webp"
                    srcSet="/images/house/house-design-studio-01.webp 1536w, /images/house/house-design-studio-01-1200w.webp 1200w, /images/house/house-design-studio-01-800w.webp 800w, /images/house/house-design-studio-01-400w.webp 400w"
                    sizes="(max-width: 768px) 100vw, 450px"
                    alt="Zero-glue tailoring workshop demonstrating hand-basting and horsehair floating canvas"
                    className="w-100 h-100 object-fit-cover"
                    loading="lazy"
                    width={500}
                    height={312}
                  />
                </div>
                <div className="p-4 text-center">
                  <h3 className="title-md text-oxblood mb-2">Zero-Glue Tailoring</h3>
                  <p className="body-sm text-muted-editorial mb-0">
                    Floating natural canvas stays, pure silk thread basting, and hand-bound organza interior finishes.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Material Perspective Section */}
      <section className="py-5 bg-cream border-hairline-b editorial-section">
        <div className="page-container">
          <div className="text-center mx-auto mb-5" style={{ maxWidth: 700 }}>
            <span className="label-caps text-champagne d-block mb-2">MATERIAL INTEGRITY</span>
            <h2 className="headline-lg text-oxblood mb-2">Noble Natural Fibers</h2>
            <p className="body-md text-muted-editorial mb-0">
              We work exclusively with uncompromised natural fibers, fermented botanicals, and hand-reeled wild silks.
            </p>
          </div>

          <div className="row g-4">
            <div className="col-12 col-md-4 editorial-card">
              <div className="p-4 bg-canvas border-hairline h-100">
                <span className="label-caps text-champagne d-block mb-1">Kashmir &amp; Ladakh</span>
                <h3 className="headline-sm text-oxblood mb-2">Grade-A Changthangi Pashmina</h3>
                <p className="body-sm text-muted-editorial mb-0">
                  Combed by hand from the high-altitude Changthangi capra fleece. Weaved into reversible diamond twill without chemical bleaching.
                </p>
              </div>
            </div>

            <div className="col-12 col-md-4 editorial-card">
              <div className="p-4 bg-canvas border-hairline h-100">
                <span className="label-caps text-champagne d-block mb-1">Assam &amp; Murshidabad</span>
                <h3 className="headline-sm text-oxblood mb-2">Ahimsa Wild Mulberry Silk</h3>
                <p className="body-sm text-muted-editorial mb-0">
                  Harvested non-violently after the moth departs the cocoon. Yields an organic, dry handfeel with a soft marble luster.
                </p>
              </div>
            </div>

            <div className="col-12 col-md-4 editorial-card">
              <div className="p-4 bg-canvas border-hairline h-100">
                <span className="label-caps text-champagne d-block mb-1">Varanasi &amp; Bagru</span>
                <h3 className="headline-sm text-oxblood mb-2">Pure Metallic Zari &amp; Botanicals</h3>
                <p className="body-sm text-muted-editorial mb-0">
                  Real silver and gold-gilt threads interlocked into warp yarns, paired with living madder root and indigo fermentation vats.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Global Ateliers Section */}
      <section className="py-5 bg-canvas border-hairline-b editorial-section" id="ateliers">
        <div className="page-container">
          <div className="text-center mx-auto mb-5" style={{ maxWidth: 700 }}>
            <span className="label-caps text-champagne d-block mb-2">DEMONSTRATION SANCTUARIES</span>
            <h2 className="headline-lg text-oxblood mb-2">Our Global Ateliers</h2>
            <p className="body-md text-muted-editorial mb-0">
              Salon environments where clients explore living textile heritage and bespoke measurement consultations.
            </p>
            <span className="d-block pt-2 text-muted-editorial label-caps" style={{ fontSize: '0.625rem' }}>
              (Demonstration Atelier Residences &amp; Design Concepts)
            </span>
          </div>

          <div className="row g-4">
            <div className="col-12 col-sm-6 col-lg-3 editorial-card">
              <div className="p-4 bg-stone border-hairline h-100 d-flex flex-column justify-content-between">
                <div>
                  <span className="label-caps text-champagne d-block mb-1">FRANCE</span>
                  <h3 className="headline-sm text-oxblood mb-2">Paris Atelier</h3>
                  <p className="body-sm text-muted-editorial mb-0">
                    Rue de Rivoli. Dedicated to pattern drafting, bias drape architecture, and private European client salons.
                  </p>
                </div>
                <div className="pt-3 border-hairline-t mt-3">
                  <span className="label-caps-wide text-muted-editorial d-block" style={{ fontSize: '0.625rem' }}>By Private Appointment</span>
                </div>
              </div>
            </div>

            <div className="col-12 col-sm-6 col-lg-3 editorial-card">
              <div className="p-4 bg-stone border-hairline h-100 d-flex flex-column justify-content-between">
                <div>
                  <span className="label-caps text-champagne d-block mb-1">INDIA</span>
                  <h3 className="headline-sm text-oxblood mb-2">New Delhi Atelier</h3>
                  <p className="body-sm text-muted-editorial mb-0">
                    Sundar Nagar Guild House. Coordination center for our master handloom families in Varanasi and Chanderi.
                  </p>
                </div>
                <div className="pt-3 border-hairline-t mt-3">
                  <span className="label-caps-wide text-muted-editorial d-block" style={{ fontSize: '0.625rem' }}>Mon – Sat • 10am – 7pm</span>
                </div>
              </div>
            </div>

            <div className="col-12 col-sm-6 col-lg-3 editorial-card">
              <div className="p-4 bg-stone border-hairline h-100 d-flex flex-column justify-content-between">
                <div>
                  <span className="label-caps text-champagne d-block mb-1">JAPAN</span>
                  <h3 className="headline-sm text-oxblood mb-2">Kyoto Salon</h3>
                  <p className="body-sm text-muted-editorial mb-0">
                    Gion Machiya Sanctuary. Research center for fermented indigo vats and zero-waste radial cutting philosophies.
                  </p>
                </div>
                <div className="pt-3 border-hairline-t mt-3">
                  <span className="label-caps-wide text-muted-editorial d-block" style={{ fontSize: '0.625rem' }}>Seasonal Salon Reserving</span>
                </div>
              </div>
            </div>

            <div className="col-12 col-sm-6 col-lg-3 editorial-card">
              <div className="p-4 bg-stone border-hairline h-100 d-flex flex-column justify-content-between">
                <div>
                  <span className="label-caps text-champagne d-block mb-1">ITALY</span>
                  <h3 className="headline-sm text-oxblood mb-2">Milan Showroom</h3>
                  <p className="body-sm text-muted-editorial mb-0">
                    Via Montenapoleone. Private showcase for bespoke tailoring, winter cashmere commissions, and archival folios.
                  </p>
                </div>
                <div className="pt-3 border-hairline-t mt-3">
                  <span className="label-caps-wide text-muted-editorial d-block" style={{ fontSize: '0.625rem' }}>By Private Appointment</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Private Salon Appointment Request Simulation */}
      <section className="py-5 bg-stone border-hairline-b" id="appointments">
        <div className="page-container">
          <div className="row justify-content-center">
            <div className="col-12 col-lg-8">
              <div className="p-4 p-md-5 bg-canvas border-hairline">
                <div className="text-center mb-4">
                  <span className="label-caps text-champagne d-block mb-1">BESPOKE CLIENT CONCIERGE</span>
                  <h2 className="headline-md text-oxblood mb-2">Request an Atelier Salon Appointment</h2>
                  <p className="body-sm text-muted-editorial mb-0">
                    Join our master tailors for a dedicated anatomical fitting and fiber consultation.
                  </p>
                </div>

                {submitted ? (
                  <div className="p-4 bg-stone border-hairline text-center" data-testid="appointment-success-plinth">
                    <span className="material-symbols-outlined text-champagne fs-1 mb-2">check_circle</span>
                    <h3 className="headline-sm text-oxblood mb-2">Appointment Request Registered</h3>
                    <p className="body-sm text-muted-editorial mb-3">
                      Thank you, <strong className="text-oxblood">{formData.name}</strong>. Our Master Concierge will contact you at <strong className="text-oxblood">{formData.email}</strong> to coordinate your bespoke session at our {formData.atelier}.
                    </p>
                    <span className="label-caps-wide text-muted-editorial" style={{ fontSize: '0.625rem' }}>
                      (Simulated Concierge Confirmation)
                    </span>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} noValidate data-testid="appointment-form">
                    {formError && (
                      <div className="alert alert-warning py-2 px-3 body-sm mb-3" role="alert">
                        {formError}
                      </div>
                    )}

                    <div className="row g-3 mb-3">
                      <div className="col-12 col-md-6">
                        <label htmlFor="aptName" className="label-caps text-oxblood d-block mb-1">Full Name *</label>
                        <input
                          type="text"
                          id="aptName"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="e.g. Lady Clara Vance"
                          className="form-control form-control-editorial w-100"
                          required
                          data-testid="apt-name-input"
                        />
                      </div>

                      <div className="col-12 col-md-6">
                        <label htmlFor="aptEmail" className="label-caps text-oxblood d-block mb-1">Correspondence Email *</label>
                        <input
                          type="email"
                          id="aptEmail"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="clara@atelier.com"
                          className="form-control form-control-editorial w-100"
                          required
                          data-testid="apt-email-input"
                        />
                      </div>
                    </div>

                    <div className="row g-3 mb-3">
                      <div className="col-12 col-md-6">
                        <label htmlFor="aptAtelier" className="label-caps text-oxblood d-block mb-1">Preferred Atelier</label>
                        <select
                          id="aptAtelier"
                          value={formData.atelier}
                          onChange={(e) => setFormData({ ...formData, atelier: e.target.value })}
                          className="form-select form-control-editorial w-100"
                        >
                          <option value="Paris Atelier (Rue de Rivoli)">Paris Atelier (Rue de Rivoli)</option>
                          <option value="New Delhi Atelier (Sundar Nagar)">New Delhi Atelier (Sundar Nagar)</option>
                          <option value="Kyoto Salon (Gion)">Kyoto Salon (Gion)</option>
                          <option value="Milan Showroom (Via Montenapoleone)">Milan Showroom (Via Montenapoleone)</option>
                          <option value="Digital Virtual Salon">Digital Virtual Salon</option>
                        </select>
                      </div>

                      <div className="col-12 col-md-6">
                        <label htmlFor="aptGarment" className="label-caps text-oxblood d-block mb-1">Piece of Primary Interest</label>
                        <select
                          id="aptGarment"
                          value={formData.garment}
                          onChange={(e) => setFormData({ ...formData, garment: e.target.value })}
                          className="form-select form-control-editorial w-100"
                        >
                          <option value="Oxblood Wool-Silk Signature Coat-Dress">Oxblood Wool-Silk Signature Coat-Dress</option>
                          <option value="Ivory Structured Raw Silk Coat">Ivory Structured Raw Silk Coat</option>
                          <option value="Architectonic Zari Waistcoat">Architectonic Zari Waistcoat</option>
                          <option value="Pleated Indigo Chanderi Tunic">Pleated Indigo Chanderi Tunic</option>
                          <option value="Oxblood Structured Box Calf Leather Bag">Oxblood Structured Box Calf Leather Bag</option>
                        </select>
                      </div>
                    </div>

                    <div className="mb-4">
                      <label htmlFor="aptNotes" className="label-caps text-oxblood d-block mb-1">Anatomical &amp; Scheduling Notes (Optional)</label>
                      <textarea
                        id="aptNotes"
                        rows={2}
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        placeholder="Specific date windows, bespoke proportion considerations..."
                        className="form-control form-control-editorial w-100"
                      />
                    </div>

                    <button
                      type="submit"
                      className="btn-oxblood w-100 py-3 text-center"
                      data-testid="submit-appointment-btn"
                    >
                      <span>Request Atelier Salon Consultation</span>
                      <span className="material-symbols-outlined fs-6 ms-2">calendar_month</span>
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Transparency Disclosure */}
      <section className="py-4 bg-cream border-hairline-t">
        <div className="page-container text-center">
          <span className="label-caps text-champagne d-block mb-1">Demonstration Notice</span>
          <p className="body-sm text-muted-editorial mx-auto mb-0" style={{ maxWidth: 640 }}>
            The House of EverThread is an academic and cultural frontend luxury case study. All atelier addresses, artisan partnerships, and lifetime warranty covenants are simulated concepts created for design demonstration.
          </p>
        </div>
      </section>
    </main>
  );
};
