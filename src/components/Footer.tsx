import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
      setEmail('');
    }
  };

  return (
    <footer className="atelier-footer" role="contentinfo">
      <div className="page-container">
        <div className="row g-4 mb-5">
          <div className="col-12 col-sm-6 col-lg-3">
            <span className="label-caps text-champagne d-block mb-3">Navigation</span>
            <ul className="list-unstyled mb-0">
              <li><Link to="/collections" className="footer-link">Collections</Link></li>
              <li><Link to="/compass" className="footer-link">Thread Compass</Link></li>
              <li><Link to="/archive" className="footer-link">Cultural Archive</Link></li>
              <li><Link to="/the-house" className="footer-link">The House</Link></li>
              <li><Link to="/journal" className="footer-link">Journal</Link></li>
              <li><Link to="/saved" className="footer-link">Saved Pieces</Link></li>
              <li><Link to="/bag" className="footer-link">Bespoke Bag</Link></li>
            </ul>
          </div>

          <div className="col-12 col-sm-6 col-lg-3">
            <span className="label-caps text-champagne d-block mb-3">Client Service</span>
            <ul className="list-unstyled mb-0">
              <li><Link to="/the-house" className="footer-link">Atelier Concierge</Link></li>
              <li><Link to="/the-house" className="footer-link">Bespoke Shipping &amp; Returns</Link></li>
              <li><Link to="/the-house" className="footer-link">Garment Care Guide</Link></li>
              <li><Link to="/the-house" className="footer-link">Private Salon Appointments</Link></li>
              <li><Link to="/checkout" className="footer-link">Checkout Demo</Link></li>
            </ul>
          </div>

          <div className="col-12 col-sm-6 col-lg-3">
            <span className="label-caps text-champagne d-block mb-3">The House</span>
            <ul className="list-unstyled mb-0">
              <li><Link to="/the-house" className="footer-link">Craftsmanship Creed</Link></li>
              <li><Link to="/the-house" className="footer-link">Material Transparency</Link></li>
              <li><Link to="/archive" className="footer-link">Weave Library &amp; Loom Lineage</Link></li>
              <li><Link to="/journal" className="footer-link">Monographs &amp; Essays</Link></li>
            </ul>
          </div>

          <div className="col-12 col-sm-6 col-lg-3">
            <span className="label-caps text-champagne d-block mb-3">The Gazette</span>
            <p className="body-sm text-muted-editorial mb-3">
              Quarterly monographs delivered directly to your atelier correspondence.
            </p>
            {submitted ? (
              <p className="body-sm text-oxblood fst-italic">
                Your correspondence address has been registered in the Atelier Gazette Ledger.
              </p>
            ) : (
              <form className="gazette-form mb-3" onSubmit={handleSubmit}>
                <div className="gazette-input-wrap">
                  <label htmlFor="gazette-email-input" className="visually-hidden">
                    Email address
                  </label>
                  <input 
                    id="gazette-email-input"
                    type="email" 
                    className="gazette-input" 
                    placeholder="Atelier correspondence email" 
                    aria-label="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required 
                  />
                  <button className="btn btn-sm btn-link p-0 text-oxblood" type="submit" aria-label="Subscribe to Gazette">
                    <span className="material-symbols-outlined fs-5" aria-hidden="true">arrow_forward</span>
                  </button>
                </div>
              </form>
            )}
            <span className="label-caps-wide text-muted-editorial" style={{ fontSize: '0.625rem' }}>
              “Every thread carries a story.”
            </span>
          </div>
        </div>

        <div className="pt-4 border-hairline-t d-flex flex-column flex-md-row justify-content-between align-items-center gap-2 text-outline label-caps">
          <div>
            <span>© EverThread Haute Couture. Simulated Demo Experience.</span>
            <span className="d-block pt-1 text-muted-editorial" style={{ fontSize: '0.625rem', letterSpacing: '0.04em', textTransform: 'none' }}>
              Educational frontend case study demonstrating contemporary heritage luxury storytelling and bespoke curation.
            </span>
          </div>
          <span>Paris • Milan • Kyoto • New Delhi</span>
        </div>
      </div>
    </footer>
  );
};
