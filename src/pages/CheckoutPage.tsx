import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext.tsx';
import { PRODUCT_ASSET_MAP, TRADITIONAL_PRODUCT_ASSET_MAP } from '../data/assetMap.ts';
import { BagItem } from '../types/index.ts';
import { Product } from '../types/catalog.ts';
import { useEditorialScroll } from '../hooks/useEditorialScroll.ts';

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  notes: string;
}

interface FormErrors {
  fullName?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
}

interface CompletedOrderSnapshot {
  orderReference: string;
  contact: FormData;
  items: Array<{
    item: BagItem;
    product: Product;
    lineTotal: number;
  }>;
  subtotal: number;
  completedAt: string;
}

type CheckoutStep = 'details' | 'review' | 'confirmation';

export const CheckoutPage: React.FC = () => {
  const { bag, bagCount, subtotal, formatPrice, clearBag, getItemProduct } = useCart();

  const [step, setStep] = useState<CheckoutStep>('details');
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
    notes: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<CompletedOrderSnapshot | null>(null);

  const mainRef = useRef<HTMLElement>(null);

  useEditorialScroll({
    scopeRef: mainRef,
    headerSelector: '.editorial-enter',
    deps: [step]
  });

  // Field change handler
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for field on change
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  // Form validation
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Full Name
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required for atelier ledger registration.';
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Please enter a valid full name (at least 2 characters).';
    }

    // Email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Correspondence email is required.';
    } else if (!emailPattern.test(formData.email.trim())) {
      newErrors.email = 'Please provide a valid email format (e.g. name@domain.com).';
    }

    // Phone (sensible flexible pattern allowing international prefixes without country bias)
    const phonePattern = /^[0-9+()\s.-]{7,20}$/;
    if (!formData.phone.trim()) {
      newErrors.phone = 'Contact telephone is required for dispatch courier notification.';
    } else if (!phonePattern.test(formData.phone.trim())) {
      newErrors.phone = 'Please provide a valid telephone number (7 to 20 digits/symbols).';
    }

    // Address
    if (!formData.address.trim()) {
      newErrors.address = 'Delivery residence address is required.';
    } else if (formData.address.trim().length < 3) {
      newErrors.address = 'Please provide a complete delivery street address.';
    }

    // City
    if (!formData.city.trim()) {
      newErrors.city = 'City or metropolitan area is required.';
    }

    // State / Region
    if (!formData.state.trim()) {
      newErrors.state = 'State, province, or region is required.';
    }

    // Postal Code (3 to 10 alphanumeric characters)
    const postalPattern = /^[a-zA-Z0-9\s-]{3,10}$/;
    if (!formData.postalCode.trim()) {
      newErrors.postalCode = 'Postal or PIN code is required.';
    } else if (!postalPattern.test(formData.postalCode.trim())) {
      newErrors.postalCode = 'Please enter a valid postal code (3–10 alphanumeric characters).';
    }

    // Country
    if (!formData.country.trim()) {
      newErrors.country = 'Country is required.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const scrollToTop = () => {
    try {
      if (typeof window !== 'undefined' && typeof window.scrollTo === 'function') {
        window.scrollTo(0, 0);
      }
    } catch {
      // Ignore in mock test environments
    }
  };

  // Move from Details to Review
  const handleProceedToReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setStep('review');
      scrollToTop();
    }
  };

  // Complete Demo Order
  const handleCompleteDemoOrder = () => {
    if (isSubmitting || bag.length === 0) return;
    setIsSubmitting(true);

    // Build line items snapshot with canonical products
    const orderItems = bag
      .map(item => {
        const prod = getItemProduct(item.productId);
        if (!prod) return null;
        return {
          item,
          product: prod,
          lineTotal: prod.price * item.quantity
        };
      })
      .filter((entry): entry is { item: BagItem; product: Product; lineTotal: number } => entry !== null);

    const snapshot: CompletedOrderSnapshot = {
      orderReference: `ET-DEMO-${Date.now().toString().slice(-6)}`,
      contact: { ...formData },
      items: orderItems,
      subtotal,
      completedAt: new Date().toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })
    };

    setCompletedOrder(snapshot);
    // Clear Bag strictly upon completion
    clearBag();
    setIsSubmitting(false);
    setStep('confirmation');
    scrollToTop();
  };

  // ---------------------------------------------------------------------------
  // Case 1: Empty Bag Protection (when not in confirmation step)
  // ---------------------------------------------------------------------------
  if (bagCount === 0 && step !== 'confirmation') {
    return (
      <main id="main-content" className="main-content bg-canvas" data-testid="checkout-page">
        {/* Simulation Banner */}
        <div className="simulation-banner">
          <span>SIMULATION NOTICE: This is an editorial frontend demonstration. No payment credentials are collected.</span>
        </div>

        <section className="py-5">
          <div className="page-container">
            <div className="empty-curation-box" data-testid="empty-checkout-state">
              <span className="material-symbols-outlined text-champagne fs-1 mb-3" aria-hidden="true">shopping_bag</span>
              <span className="label-caps text-champagne d-block mb-2">Concierge Allocation Demo</span>
              <h1 className="headline-md text-oxblood mb-2">Your Bespoke Bag Is Empty</h1>
              <p className="body-md text-muted-editorial mx-auto mb-4" style={{ maxWidth: 540 }}>
                An atelier concierge allocation cannot be initiated without reserved heirlooms. Explore our curated collections to select a piece.
              </p>
              <div className="d-flex justify-content-center gap-3">
                <Link to="/collections" className="btn-oxblood px-4 py-2" data-testid="empty-checkout-explore-btn">
                  Explore Curated Collections
                </Link>
                <Link to="/saved" className="btn-outline-editorial px-4 py-2">
                  View Saved Pieces
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    );
  }

  // ---------------------------------------------------------------------------
  // Case 2: Confirmation Step
  // ---------------------------------------------------------------------------
  if (step === 'confirmation' && completedOrder) {
    return (
      <main id="main-content" className="main-content bg-canvas" data-testid="checkout-page">
        {/* Prominent Demo Disclosure Alert */}
        <div className="simulation-banner bg-oxblood text-white py-3 text-center" data-testid="demo-disclosure-banner">
          <div className="page-container">
            <span className="label-caps-wide text-champagne-glow d-block mb-1">
              DEMONSTRATION CONFIRMATION ONLY
            </span>
            <p className="mb-0 body-sm" style={{ opacity: 0.95 }}>
              This was an editorial simulation. No real payment was charged, no financial credentials were collected, and no physical order or inventory shipment will be dispatched.
            </p>
          </div>
        </div>

        <section className="py-5" data-testid="checkout-confirmation-step">
          <div className="page-container">
            <div className="p-4 p-md-5 bg-stone border-hairline mb-5">
              <div className="text-center mb-4">
                <span className="material-symbols-outlined text-champagne fs-1 mb-2" aria-hidden="true">check_circle</span>
                <span className="label-caps text-champagne d-block mb-1">Atelier Allocation Demo</span>
                <h1 className="headline-lg text-oxblood mb-2" data-testid="confirmation-heading" style={{ fontSize: '2.5rem' }}>
                  Simulated Concierge Allocation Registered
                </h1>
                <p className="body-md text-muted-editorial mx-auto mb-0" style={{ maxWidth: 600 }}>
                  Demonstration folio reference: <strong className="text-oxblood" data-testid="order-reference-code">{completedOrder.orderReference}</strong>
                </p>
              </div>

              {/* Recipient & Delivery Summary */}
              <div className="row g-4 mb-4 pt-3 border-hairline-t">
                <div className="col-12 col-md-6">
                  <span className="label-caps text-champagne d-block mb-2">Simulated Recipient</span>
                  <div className="body-sm text-on-surface" data-testid="confirmation-recipient">
                    <p className="mb-1 fw-bold text-oxblood">{completedOrder.contact.fullName}</p>
                    <p className="mb-1 text-muted-editorial">{completedOrder.contact.email}</p>
                    <p className="mb-0 text-muted-editorial">{completedOrder.contact.phone}</p>
                  </div>
                </div>

                <div className="col-12 col-md-6">
                  <span className="label-caps text-champagne d-block mb-2">Simulated Delivery Residence</span>
                  <div className="body-sm text-on-surface" data-testid="confirmation-delivery">
                    <p className="mb-1">{completedOrder.contact.address}</p>
                    <p className="mb-1">{completedOrder.contact.city}, {completedOrder.contact.state} {completedOrder.contact.postalCode}</p>
                    <p className="mb-0 fw-medium text-oxblood">{completedOrder.contact.country}</p>
                    {completedOrder.contact.notes && (
                      <p className="mt-2 text-muted-editorial fst-italic">
                        * Inscription Note: &ldquo;{completedOrder.contact.notes}&rdquo;
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Completed Line Items Table */}
              <div className="pt-3 border-hairline-t mb-4">
                <span className="label-caps text-champagne d-block mb-3">Simulated Allocated Heirlooms</span>
                <div className="d-flex flex-column gap-2" data-testid="confirmation-items-list">
                  {completedOrder.items.map((entry, idx) => {
                    const isApparel = entry.product.category !== 'Accessories';
                    return (
                      <div 
                        key={idx} 
                        className="p-3 bg-canvas border-hairline d-flex justify-content-between align-items-center flex-wrap gap-2"
                        data-testid={`confirmation-item-${idx}`}
                      >
                        <div>
                          <span className="body-md fw-bold text-oxblood d-block">{entry.product.title}</span>
                          <span className="body-sm text-muted-editorial">
                            Colour: {entry.item.color} • {isApparel ? `Size: ${entry.item.size}` : `Spec: ${entry.item.size}`} • Qty: {entry.item.quantity}
                          </span>
                        </div>
                        <div className="text-end">
                          <span className="headline-sm text-oxblood fw-bold" style={{ fontSize: '1.125rem' }}>
                            {formatPrice(entry.lineTotal)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Ledger Subtotal */}
              <div className="d-flex justify-content-between align-items-center pt-3 border-hairline-t mb-4">
                <span className="title-md text-oxblood">Simulated House Total</span>
                <span className="headline-sm text-oxblood fw-bold" data-testid="confirmation-total">
                  {formatPrice(completedOrder.subtotal)}
                </span>
              </div>

              {/* Navigation Actions */}
              <div className="d-flex justify-content-center gap-3 flex-wrap pt-2">
                <Link to="/collections" className="btn-oxblood px-4 py-2" data-testid="confirmation-explore-btn">
                  Explore Curated Collections
                </Link>
                <Link to="/" className="btn-outline-editorial px-4 py-2" data-testid="confirmation-home-btn">
                  Return to Atelier Home
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    );
  }

  // ---------------------------------------------------------------------------
  // Case 3: Details & Review Stepper
  // ---------------------------------------------------------------------------
  return (
    <main id="main-content" className="main-content bg-canvas" data-testid="checkout-page" ref={mainRef}>
      {/* Simulation Disclosure Banner */}
      <div className="simulation-banner">
        <span>SIMULATION NOTICE: This is an editorial frontend demonstration. No payment credentials are required or processed.</span>
      </div>

      {/* Stepper Header */}
      <section className="py-4 bg-cream border-hairline-b">
        <div className="page-container">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
            <div>
              <div className="d-flex align-items-center gap-2 mb-1 editorial-enter">
                <span style={{ width: 16, height: 1, backgroundColor: 'var(--color-champagne-thread)' }}></span>
                <span className="label-caps text-champagne">Atelier Concierge Ledger</span>
              </div>
              <h1 className="headline-md text-oxblood mb-0 editorial-enter">
                {step === 'details' ? 'Step 1: Recipient & Delivery Residence' : 'Step 2: Order Review & Demo Allocation'}
              </h1>
            </div>

            {/* Stepper Pills */}
            <div className="d-flex align-items-center gap-2" role="tablist" aria-label="Checkout Progress">
              <span 
                className={`checkout-step-badge ${step === 'details' ? 'active' : 'completed'}`}
                data-testid="step-badge-details"
                aria-current={step === 'details' ? 'step' : undefined}
              >
                1. Delivery & Contact
              </span>
              <span className="text-champagne">→</span>
              <span 
                className={`checkout-step-badge ${step === 'review' ? 'active' : ''}`}
                data-testid="step-badge-review"
                aria-current={step === 'review' ? 'step' : undefined}
              >
                2. Order Review
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Form and Summary Split */}
      <section className="py-5">
        <div className="page-container">
          <div className="row g-5">
            {/* Left Column: Form or Review Details */}
            <div className="col-12 col-lg-7">
              {step === 'details' ? (
                /* Step 1: Form */
                <form 
                  onSubmit={handleProceedToReview} 
                  noValidate 
                  className="p-4 p-md-5 bg-stone border-hairline"
                  data-testid="checkout-details-step"
                >
                  <div className="d-flex align-items-center justify-content-between mb-4 pb-2 border-hairline-b">
                    <span className="label-caps text-champagne">A. Contact Details</span>
                    <span className="body-sm text-muted-editorial" style={{ fontSize: '0.75rem' }}>* Required fields</span>
                  </div>

                  {/* Full Name */}
                  <div className="mb-3">
                    <label htmlFor="chkFullName" className="label-caps text-oxblood d-block mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="chkFullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="e.g. Alistair Vance"
                      className={`form-control form-control-editorial w-100 ${errors.fullName ? 'is-invalid' : ''}`}
                      autoComplete="name"
                      aria-invalid={!!errors.fullName}
                      aria-describedby={errors.fullName ? 'error-fullName' : undefined}
                      data-testid="input-fullName"
                      required
                    />
                    {errors.fullName && (
                      <div id="error-fullName" className="field-error-message" role="alert" data-testid="error-fullName">
                        {errors.fullName}
                      </div>
                    )}
                  </div>

                  {/* Email & Phone */}
                  <div className="row g-3 mb-4">
                    <div className="col-12 col-md-6">
                      <label htmlFor="chkEmail" className="label-caps text-oxblood d-block mb-1">
                        Correspondence Email *
                      </label>
                      <input
                        type="email"
                        id="chkEmail"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="e.g. alistair@atelier.com"
                        className={`form-control form-control-editorial w-100 ${errors.email ? 'is-invalid' : ''}`}
                        autoComplete="email"
                        aria-invalid={!!errors.email}
                        aria-describedby={errors.email ? 'error-email' : undefined}
                        data-testid="input-email"
                        required
                      />
                      {errors.email && (
                        <div id="error-email" className="field-error-message" role="alert" data-testid="error-email">
                          {errors.email}
                        </div>
                      )}
                    </div>

                    <div className="col-12 col-md-6">
                      <label htmlFor="chkPhone" className="label-caps text-oxblood d-block mb-1">
                        Contact Telephone *
                      </label>
                      <input
                        type="tel"
                        id="chkPhone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="e.g. +91 98765 43210"
                        className={`form-control form-control-editorial w-100 ${errors.phone ? 'is-invalid' : ''}`}
                        autoComplete="tel"
                        aria-invalid={!!errors.phone}
                        aria-describedby={errors.phone ? 'error-phone' : undefined}
                        data-testid="input-phone"
                        required
                      />
                      {errors.phone && (
                        <div id="error-phone" className="field-error-message" role="alert" data-testid="error-phone">
                          {errors.phone}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Delivery Residence Section */}
                  <div className="d-flex align-items-center justify-content-between mb-4 pt-3 pb-2 border-hairline-t border-hairline-b">
                    <span className="label-caps text-champagne">B. Delivery Residence</span>
                  </div>

                  {/* Street Address */}
                  <div className="mb-3">
                    <label htmlFor="chkAddress" className="label-caps text-oxblood d-block mb-1">
                      Street Address & Residence *
                    </label>
                    <input
                      type="text"
                      id="chkAddress"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="e.g. 14 Place Vendôme, Suite 4B"
                      className={`form-control form-control-editorial w-100 ${errors.address ? 'is-invalid' : ''}`}
                      autoComplete="street-address"
                      aria-invalid={!!errors.address}
                      aria-describedby={errors.address ? 'error-address' : undefined}
                      data-testid="input-address"
                      required
                    />
                    {errors.address && (
                      <div id="error-address" className="field-error-message" role="alert" data-testid="error-address">
                        {errors.address}
                      </div>
                    )}
                  </div>

                  {/* City, State, Postal Code */}
                  <div className="row g-3 mb-3">
                    <div className="col-12 col-md-4">
                      <label htmlFor="chkCity" className="label-caps text-oxblood d-block mb-1">
                        City *
                      </label>
                      <input
                        type="text"
                        id="chkCity"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        placeholder="e.g. Mumbai"
                        className={`form-control form-control-editorial w-100 ${errors.city ? 'is-invalid' : ''}`}
                        autoComplete="address-level2"
                        aria-invalid={!!errors.city}
                        aria-describedby={errors.city ? 'error-city' : undefined}
                        data-testid="input-city"
                        required
                      />
                      {errors.city && (
                        <div id="error-city" className="field-error-message" role="alert" data-testid="error-city">
                          {errors.city}
                        </div>
                      )}
                    </div>

                    <div className="col-12 col-md-4">
                      <label htmlFor="chkState" className="label-caps text-oxblood d-block mb-1">
                        State / Region *
                      </label>
                      <input
                        type="text"
                        id="chkState"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        placeholder="e.g. Maharashtra"
                        className={`form-control form-control-editorial w-100 ${errors.state ? 'is-invalid' : ''}`}
                        autoComplete="address-level1"
                        aria-invalid={!!errors.state}
                        aria-describedby={errors.state ? 'error-state' : undefined}
                        data-testid="input-state"
                        required
                      />
                      {errors.state && (
                        <div id="error-state" className="field-error-message" role="alert" data-testid="error-state">
                          {errors.state}
                        </div>
                      )}
                    </div>

                    <div className="col-12 col-md-4">
                      <label htmlFor="chkPostalCode" className="label-caps text-oxblood d-block mb-1">
                        Postal Code *
                      </label>
                      <input
                        type="text"
                        id="chkPostalCode"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleChange}
                        placeholder="e.g. 400001"
                        className={`form-control form-control-editorial w-100 ${errors.postalCode ? 'is-invalid' : ''}`}
                        autoComplete="postal-code"
                        aria-invalid={!!errors.postalCode}
                        aria-describedby={errors.postalCode ? 'error-postalCode' : undefined}
                        data-testid="input-postalCode"
                        required
                      />
                      {errors.postalCode && (
                        <div id="error-postalCode" className="field-error-message" role="alert" data-testid="error-postalCode">
                          {errors.postalCode}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Country Selection */}
                  <div className="mb-4">
                    <label htmlFor="chkCountry" className="label-caps text-oxblood d-block mb-1">
                      Country *
                    </label>
                    <select
                      id="chkCountry"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      className={`form-select form-control-editorial w-100 ${errors.country ? 'is-invalid' : ''}`}
                      aria-invalid={!!errors.country}
                      aria-describedby={errors.country ? 'error-country' : undefined}
                      data-testid="input-country"
                      required
                    >
                      <option value="India">India</option>
                      <option value="France">France</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="United States">United States</option>
                      <option value="Japan">Japan</option>
                      <option value="Italy">Italy</option>
                      <option value="United Arab Emirates">United Arab Emirates</option>
                      <option value="Singapore">Singapore</option>
                      <option value="Switzerland">Switzerland</option>
                      <option value="Australia">Australia</option>
                    </select>
                    {errors.country && (
                      <div id="error-country" className="field-error-message" role="alert" data-testid="error-country">
                        {errors.country}
                      </div>
                    )}
                  </div>

                  {/* Inscription Note (Optional) */}
                  <div className="mb-4">
                    <label htmlFor="chkNotes" className="label-caps text-oxblood d-block mb-1">
                      Handwritten Calligraphy Inscription Note (Optional)
                    </label>
                    <textarea
                      id="chkNotes"
                      name="notes"
                      rows={2}
                      value={formData.notes}
                      onChange={handleChange}
                      placeholder="Special dedication or bespoke monogramming note to enclose with the cedar presentation box..."
                      className="form-control form-control-editorial w-100"
                      data-testid="input-notes"
                    />
                  </div>

                  {/* Form Actions */}
                  <div className="d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-3 pt-3 border-hairline-t">
                    <Link to="/bag" className="btn-outline-editorial" data-testid="return-to-bag-link">
                      ← Return to Bag
                    </Link>
                    <button
                      type="submit"
                      className="btn-oxblood py-3 px-4 d-flex align-items-center justify-content-center gap-2"
                      data-testid="proceed-to-review-btn"
                    >
                      <span>Proceed to Order Review</span>
                      <span className="material-symbols-outlined fs-6" aria-hidden="true">arrow_forward</span>
                    </button>
                  </div>
                </form>
              ) : (
                /* Step 2: Review */
                <div className="p-4 p-md-5 bg-stone border-hairline" data-testid="checkout-review-step">
                  <div className="d-flex align-items-center justify-content-between mb-4 pb-2 border-hairline-b">
                    <span className="label-caps text-champagne">Review Recipient & Delivery Information</span>
                    <button
                      type="button"
                      className="btn-remove-editorial"
                      onClick={() => setStep('details')}
                      data-testid="back-to-details-btn"
                    >
                      <span className="material-symbols-outlined fs-6" aria-hidden="true">edit</span>
                      <span>Edit Details</span>
                    </button>
                  </div>

                  {/* Customer Review Summary */}
                  <div className="row g-4 mb-4">
                    <div className="col-12 col-md-6">
                      <span className="label-caps text-muted-editorial d-block mb-1">Recipient</span>
                      <p className="body-md fw-bold text-oxblood mb-1" data-testid="review-name">{formData.fullName}</p>
                      <p className="body-sm text-muted-editorial mb-1" data-testid="review-email">{formData.email}</p>
                      <p className="body-sm text-muted-editorial mb-0" data-testid="review-phone">{formData.phone}</p>
                    </div>

                    <div className="col-12 col-md-6">
                      <span className="label-caps text-muted-editorial d-block mb-1">Delivery Address</span>
                      <p className="body-sm text-on-surface mb-1" data-testid="review-address">{formData.address}</p>
                      <p className="body-sm text-on-surface mb-1" data-testid="review-city-state-postal">
                        {formData.city}, {formData.state} {formData.postalCode}
                      </p>
                      <p className="body-sm fw-medium text-oxblood mb-0" data-testid="review-country">{formData.country}</p>
                    </div>
                  </div>

                  {formData.notes && (
                    <div className="p-3 bg-canvas border-hairline mb-4">
                      <span className="label-caps text-champagne d-block mb-1">Calligraphy Note</span>
                      <p className="body-sm text-muted-editorial mb-0 fst-italic" data-testid="review-notes">
                        &ldquo;{formData.notes}&rdquo;
                      </p>
                    </div>
                  )}

                  {/* Review Disclaimer Notice */}
                  <div className="p-3 bg-canvas border-hairline mb-4">
                    <div className="d-flex align-items-start gap-2">
                      <span className="material-symbols-outlined text-champagne fs-5 mt-1" aria-hidden="true">info</span>
                      <div>
                        <span className="label-caps text-oxblood d-block mb-1">Demonstration Checkout Disclosure</span>
                        <p className="body-sm text-muted-editorial mb-0" style={{ fontSize: '0.8125rem', lineHeight: 1.45 }}>
                          By completing this demo order, you acknowledge that EverThread is operating as a frontend exhibition showcase. No actual payment, bank card details, or delivery logistics will be transacted.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Review Actions */}
                  <div className="d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-3 pt-3 border-hairline-t">
                    <button
                      type="button"
                      className="btn-outline-editorial"
                      onClick={() => setStep('details')}
                    >
                      ← Back to Details
                    </button>
                    <button
                      type="button"
                      className="btn-oxblood py-3 px-4 d-flex align-items-center justify-content-center gap-2"
                      onClick={handleCompleteDemoOrder}
                      disabled={isSubmitting}
                      data-testid="complete-demo-order-btn"
                    >
                      <span className="material-symbols-outlined fs-6" aria-hidden="true">verified</span>
                      <span>Complete Demo Concierge Order</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Order Ledger & Canonical Pricing Review */}
            <div className="col-12 col-lg-5">
              <aside className="bag-summary-panel" data-testid="checkout-summary-panel">
                <div className="d-flex align-items-center gap-2 mb-3">
                  <span style={{ width: 16, height: 1, backgroundColor: 'var(--color-champagne-thread)' }}></span>
                  <span className="label-caps text-champagne">Allocated Repertoire</span>
                </div>

                <h2 className="headline-sm text-oxblood mb-3 pb-2 border-hairline-b" style={{ fontSize: '1.35rem' }}>
                  {bagCount} {bagCount === 1 ? 'Piece' : 'Pieces'} Allocated
                </h2>

                {/* Items Mini List */}
                <div className="d-flex flex-column gap-3 mb-4 max-vh-50 overflow-auto" data-testid="checkout-items-list">
                  {bag.map((item, idx) => {
                    const product = getItemProduct(item.productId);
                    if (!product) return null;
                    const assetRecord = PRODUCT_ASSET_MAP[product.id] || TRADITIONAL_PRODUCT_ASSET_MAP[product.id];
                    const primaryImage = assetRecord?.primary;
                    const isApparel = product.category !== 'Accessories';
                    const lineTotal = product.price * item.quantity;

                    return (
                      <div 
                        key={idx} 
                        className="d-flex gap-3 pb-3 border-hairline-b"
                        data-testid={`checkout-item-${idx}`}
                      >
                        <div style={{ width: 64, height: 85, flexShrink: 0, overflow: 'hidden' }}>
                          <img
                            src={primaryImage?.src || product.image}
                            alt={product.imageAlt || product.title}
                            width={64}
                            height={85}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        </div>

                        <div className="flex-grow-1">
                          <span className="label-caps text-champagne d-block" style={{ fontSize: '0.625rem' }}>
                            {product.category}
                          </span>
                          <h3 className="body-sm fw-bold text-oxblood mb-1" style={{ fontSize: '0.875rem' }}>
                            {product.title}
                          </h3>
                          <p className="body-sm text-muted-editorial mb-1" style={{ fontSize: '0.75rem' }}>
                            Colour: {item.color} • {isApparel ? `Size: ${item.size}` : `Spec: ${item.size}`}
                          </p>
                          <div className="d-flex justify-content-between align-items-center">
                            <span className="body-sm text-muted-editorial" style={{ fontSize: '0.75rem' }}>
                              Qty: {item.quantity} × {formatPrice(product.price)}
                            </span>
                            <span className="body-sm fw-bold text-oxblood">
                              {formatPrice(lineTotal)}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Canonical Financial Breakdown */}
                <div className="d-flex flex-column gap-2 mb-3 body-sm">
                  <div className="d-flex justify-content-between">
                    <span className="text-muted-editorial">Repertoire Subtotal</span>
                    <span className="text-oxblood fw-bold" data-testid="checkout-subtotal">
                      {formatPrice(subtotal)}
                    </span>
                  </div>

                  <div className="d-flex justify-content-between">
                    <span className="text-muted-editorial">Courier Dispatch</span>
                    <span className="text-oxblood" style={{ fontSize: '0.8125rem' }}>
                      Complimentary (Demonstration)
                    </span>
                  </div>

                  <div className="d-flex justify-content-between">
                    <span className="text-muted-editorial">Atelier Valuation Taxes</span>
                    <span className="text-oxblood" style={{ fontSize: '0.8125rem' }}>
                      Included (Demonstration)
                    </span>
                  </div>
                </div>

                {/* Grand Total */}
                <div className="d-flex justify-content-between align-items-baseline pt-3 border-hairline-t">
                  <span className="title-md text-oxblood">Estimated Total</span>
                  <span className="headline-sm text-oxblood fw-bold" data-testid="checkout-total">
                    {formatPrice(subtotal)}
                  </span>
                </div>
              </aside>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};
