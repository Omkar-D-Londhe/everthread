import { describe, it, expect, beforeEach, vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { CheckoutPage } from '../pages/CheckoutPage.tsx';
import { BagPage } from '../pages/BagPage.tsx';
import { CollectionsPage } from '../pages/CollectionsPage.tsx';
import { Header } from '../components/Header.tsx';
import { CartProvider, useCart } from '../context/CartContext.tsx';
import { SavedProvider } from '../context/SavedContext.tsx';

// Test harness with AppShell and routing
const renderCheckout = (initialBag?: Array<{ productId: string; size: string; color: string; quantity: number }>) => {
  if (initialBag) {
    localStorage.setItem('everthread_bag_v2', JSON.stringify(initialBag));
  }

  return render(
    <MemoryRouter initialEntries={['/checkout']}>
      <CartProvider>
        <SavedProvider>
          <Header onOpenSearch={() => {}} />
          <Routes>
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/bag" element={<BagPage />} />
            <Route path="/collections" element={<CollectionsPage />} />
            <Route path="/" element={<div data-testid="mock-home-page">Home</div>} />
          </Routes>
        </SavedProvider>
      </CartProvider>
    </MemoryRouter>
  );
};

// Component to observe cart state directly during test executions
const CartStateObserver: React.FC = () => {
  const { bagCount, bag } = useCart();
  return (
    <div>
      <span data-testid="live-bag-count">{bagCount}</span>
      <span data-testid="live-bag-lines">{bag.length}</span>
    </div>
  );
};

const renderCheckoutWithObserver = (initialBag?: Array<{ productId: string; size: string; color: string; quantity: number }>) => {
  if (initialBag) {
    localStorage.setItem('everthread_bag_v2', JSON.stringify(initialBag));
  }

  return render(
    <MemoryRouter initialEntries={['/checkout']}>
      <CartProvider>
        <SavedProvider>
          <CartStateObserver />
          <Header onOpenSearch={() => {}} />
          <Routes>
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/bag" element={<BagPage />} />
            <Route path="/collections" element={<CollectionsPage />} />
            <Route path="/" element={<div data-testid="mock-home-page">Home</div>} />
          </Routes>
        </SavedProvider>
      </CartProvider>
    </MemoryRouter>
  );
};

describe('EverThread Stage 3.6: Demo Concierge Checkout Suite', () => {
  beforeEach(() => {
    localStorage.clear();
    window.scrollTo = vi.fn();
  });

  /* -------------------------------------------------------------------------
   * Requirement 1: Empty Bag Checkout Protection
   * ------------------------------------------------------------------------- */
  describe('1. Empty Bag Checkout Protection', () => {
    it('prevents checkout and renders empty state plinth with link to collections when bag is empty', () => {
      renderCheckout();

      expect(screen.getByTestId('empty-checkout-state')).toBeInTheDocument();
      expect(screen.getByText('Your Bespoke Bag Is Empty')).toBeInTheDocument();
      expect(screen.getByTestId('empty-checkout-explore-btn')).toHaveAttribute('href', '/collections');
      expect(screen.queryByTestId('checkout-details-step')).not.toBeInTheDocument();
      expect(screen.queryByTestId('checkout-review-step')).not.toBeInTheDocument();
    });
  });

  /* -------------------------------------------------------------------------
   * Requirement 2: Required-Field Validation
   * ------------------------------------------------------------------------- */
  describe('2. Required-Field Validation on Step 1', () => {
    it('blocks advancing and renders field error messages when submitting empty form', () => {
      renderCheckout([
        { productId: 'et-01', size: 'II (M)', color: 'Madder Oxblood', quantity: 1 }
      ]);

      expect(screen.getByTestId('checkout-details-step')).toBeInTheDocument();

      // Click "Proceed to Order Review" without filling fields
      const proceedBtn = screen.getByTestId('proceed-to-review-btn');
      fireEvent.click(proceedBtn);

      // Remains on Step 1
      expect(screen.getByTestId('checkout-details-step')).toBeInTheDocument();
      expect(screen.queryByTestId('checkout-review-step')).not.toBeInTheDocument();

      // Field error messages are visible
      expect(screen.getByTestId('error-fullName')).toHaveTextContent(/full name is required/i);
      expect(screen.getByTestId('error-email')).toHaveTextContent(/correspondence email is required/i);
      expect(screen.getByTestId('error-phone')).toHaveTextContent(/contact telephone is required/i);
      expect(screen.getByTestId('error-address')).toHaveTextContent(/delivery residence address is required/i);
      expect(screen.getByTestId('error-city')).toHaveTextContent(/city.*is required/i);
      expect(screen.getByTestId('error-state')).toHaveTextContent(/state.*is required/i);
      expect(screen.getByTestId('error-postalCode')).toHaveTextContent(/postal.*is required/i);
    });
  });

  /* -------------------------------------------------------------------------
   * Requirement 3: Invalid Email, Phone, and Postal-Code Handling
   * ------------------------------------------------------------------------- */
  describe('3. Formatting Validation for Email, Phone, and Postal Code', () => {
    it('rejects invalid email formats and shows descriptive error', () => {
      renderCheckout([
        { productId: 'et-01', size: 'II (M)', color: 'Madder Oxblood', quantity: 1 }
      ]);

      const emailInput = screen.getByTestId('input-email');
      fireEvent.change(emailInput, { target: { value: 'invalid-email-string' } });

      fireEvent.click(screen.getByTestId('proceed-to-review-btn'));

      expect(screen.getByTestId('error-email')).toHaveTextContent(/valid email format/i);
      expect(emailInput).toHaveAttribute('aria-invalid', 'true');
    });

    it('rejects too short or malformed phone numbers without enforcing country bias', () => {
      renderCheckout([
        { productId: 'et-01', size: 'II (M)', color: 'Madder Oxblood', quantity: 1 }
      ]);

      const phoneInput = screen.getByTestId('input-phone');
      fireEvent.change(phoneInput, { target: { value: '123' } }); // only 3 digits

      fireEvent.click(screen.getByTestId('proceed-to-review-btn'));

      expect(screen.getByTestId('error-phone')).toHaveTextContent(/valid telephone number/i);
      expect(phoneInput).toHaveAttribute('aria-invalid', 'true');
    });

    it('rejects invalid postal codes with symbols', () => {
      renderCheckout([
        { productId: 'et-01', size: 'II (M)', color: 'Madder Oxblood', quantity: 1 }
      ]);

      const postalInput = screen.getByTestId('input-postalCode');
      fireEvent.change(postalInput, { target: { value: '@#$%' } });

      fireEvent.click(screen.getByTestId('proceed-to-review-btn'));

      expect(screen.getByTestId('error-postalCode')).toHaveTextContent(/valid postal code/i);
      expect(postalInput).toHaveAttribute('aria-invalid', 'true');
    });
  });

  /* -------------------------------------------------------------------------
   * Requirement 4: Moving Between Form and Review Steps
   * ------------------------------------------------------------------------- */
  describe('4. Navigation Between Form and Review Steps', () => {
    it('allows advancing to Step 2 review when valid and preserves entered values when returning to edit', () => {
      renderCheckout([
        { productId: 'et-01', size: 'II (M)', color: 'Madder Oxblood', quantity: 1 }
      ]);

      // Fill in valid details
      fireEvent.change(screen.getByTestId('input-fullName'), { target: { value: 'Lady Genevieve Sterling' } });
      fireEvent.change(screen.getByTestId('input-email'), { target: { value: 'genevieve@sterling.co.uk' } });
      fireEvent.change(screen.getByTestId('input-phone'), { target: { value: '+44 20 7946 0912' } });
      fireEvent.change(screen.getByTestId('input-address'), { target: { value: '42 Mayfair Belgravia Close' } });
      fireEvent.change(screen.getByTestId('input-city'), { target: { value: 'London' } });
      fireEvent.change(screen.getByTestId('input-state'), { target: { value: 'Greater London' } });
      fireEvent.change(screen.getByTestId('input-postalCode'), { target: { value: 'SW1X 7XL' } });
      fireEvent.change(screen.getByTestId('input-country'), { target: { value: 'United Kingdom' } });
      fireEvent.change(screen.getByTestId('input-notes'), { target: { value: 'Calligraphy inscription for heirloom gift' } });

      // Advance
      fireEvent.click(screen.getByTestId('proceed-to-review-btn'));

      // Now on Step 2 Review
      expect(screen.getByTestId('checkout-review-step')).toBeInTheDocument();
      expect(screen.getByTestId('review-name')).toHaveTextContent('Lady Genevieve Sterling');
      expect(screen.getByTestId('review-email')).toHaveTextContent('genevieve@sterling.co.uk');
      expect(screen.getByTestId('review-phone')).toHaveTextContent('+44 20 7946 0912');
      expect(screen.getByTestId('review-address')).toHaveTextContent('42 Mayfair Belgravia Close');
      expect(screen.getByTestId('review-country')).toHaveTextContent('United Kingdom');
      expect(screen.getByTestId('review-notes')).toHaveTextContent('Calligraphy inscription for heirloom gift');

      // Click "Edit Details"
      fireEvent.click(screen.getByTestId('back-to-details-btn'));

      // Back on Step 1 with preserved values
      expect(screen.getByTestId('checkout-details-step')).toBeInTheDocument();
      expect(screen.getByTestId('input-fullName')).toHaveValue('Lady Genevieve Sterling');
      expect(screen.getByTestId('input-email')).toHaveValue('genevieve@sterling.co.uk');
      expect(screen.getByTestId('input-notes')).toHaveValue('Calligraphy inscription for heirloom gift');
    });
  });

  /* -------------------------------------------------------------------------
   * Requirement 5: Accurate Order Summary & Subtotal
   * ------------------------------------------------------------------------- */
  describe('5. Accurate Canonical Order Summary & Pricing', () => {
    it('calculates subtotal strictly from verified catalogue prices and discloses demonstration courier and taxes', () => {
      // ET-01 (68,500) x 1 + ET-05 (54,000) x 1 = 122,500
      renderCheckout([
        { productId: 'et-01', size: 'II (M)', color: 'Madder Oxblood', quantity: 1 },
        { productId: 'et-05', size: 'One Size (Structured Mini Box)', color: 'Obsidian Night', quantity: 1 }
      ]);

      expect(screen.getByTestId('checkout-subtotal')).toHaveTextContent('₹1,22,500');
      expect(screen.getByTestId('checkout-total')).toHaveTextContent('₹1,22,500');
      expect(screen.getByText(/complimentary \(demonstration\)/i)).toBeInTheDocument();
      expect(screen.getByText(/included \(demonstration\)/i)).toBeInTheDocument();
    });
  });

  /* -------------------------------------------------------------------------
   * Requirement 6: Correct Variant & Quantity Display
   * ------------------------------------------------------------------------- */
  describe('6. Correct Variant and Quantity Presentation in Summary Panel', () => {
    it('displays apparel sizes and accessory dimensions distinctly with respective quantities', () => {
      renderCheckout([
        { productId: 'et-01', size: 'II (M)', color: 'Madder Oxblood', quantity: 2 },
        { productId: 'et-05', size: 'One Size (Structured Mini Box)', color: 'Obsidian Night', quantity: 1 }
      ]);

      const item0 = screen.getByTestId('checkout-item-0');
      expect(within(item0).getByText(/Size: II \(M\)/i)).toBeInTheDocument();
      expect(within(item0).getByText(/Qty: 2/i)).toBeInTheDocument();

      const item1 = screen.getByTestId('checkout-item-1');
      expect(within(item1).getByText(/Spec: One Size \(Structured Mini Box\)/i)).toBeInTheDocument();
      expect(within(item1).getByText(/Qty: 1/i)).toBeInTheDocument();
    });
  });

  /* -------------------------------------------------------------------------
   * Requirement 7: Demo Completion Disclosure
   * ------------------------------------------------------------------------- */
  describe('7. Explicit Demo Completion Disclosure', () => {
    it('renders prominent demonstration confirmation stating no payment was charged and no order was shipped', () => {
      renderCheckout([
        { productId: 'et-01', size: 'II (M)', color: 'Madder Oxblood', quantity: 1 }
      ]);

      // Complete form
      fireEvent.change(screen.getByTestId('input-fullName'), { target: { value: 'Alistair Vance' } });
      fireEvent.change(screen.getByTestId('input-email'), { target: { value: 'alistair@atelier.com' } });
      fireEvent.change(screen.getByTestId('input-phone'), { target: { value: '+91 98765 43210' } });
      fireEvent.change(screen.getByTestId('input-address'), { target: { value: '14 Place Vendome' } });
      fireEvent.change(screen.getByTestId('input-city'), { target: { value: 'Paris' } });
      fireEvent.change(screen.getByTestId('input-state'), { target: { value: 'Ile-de-France' } });
      fireEvent.change(screen.getByTestId('input-postalCode'), { target: { value: '75001' } });
      fireEvent.change(screen.getByTestId('input-country'), { target: { value: 'France' } });

      fireEvent.click(screen.getByTestId('proceed-to-review-btn'));

      // Click "Complete Demo Concierge Order"
      const completeBtn = screen.getByTestId('complete-demo-order-btn');
      expect(completeBtn).toHaveTextContent(/complete demo concierge order/i);
      fireEvent.click(completeBtn);

      // On Confirmation Step
      expect(screen.getByTestId('checkout-confirmation-step')).toBeInTheDocument();
      expect(screen.getByTestId('demo-disclosure-banner')).toBeInTheDocument();
      expect(screen.getByText(/DEMONSTRATION CONFIRMATION ONLY/i)).toBeInTheDocument();
      expect(screen.getByText(/No real payment was charged, no financial credentials were collected/i)).toBeInTheDocument();
      expect(screen.getByTestId('order-reference-code')).toHaveTextContent(/ET-DEMO-/i);
    });
  });

  /* -------------------------------------------------------------------------
   * Requirement 8: Bag-Clearing Policy
   * ------------------------------------------------------------------------- */
  describe('8. Bag-Clearing Policy', () => {
    it('preserves bag during Step 1 and Step 2, and clears bag only upon demo completion', () => {
      renderCheckoutWithObserver([
        { productId: 'et-01', size: 'II (M)', color: 'Madder Oxblood', quantity: 1 }
      ]);

      expect(screen.getByTestId('live-bag-count')).toHaveTextContent('1');

      // Step 1: form entry
      fireEvent.change(screen.getByTestId('input-fullName'), { target: { value: 'Devi Sharma' } });
      fireEvent.change(screen.getByTestId('input-email'), { target: { value: 'devi@sharma.in' } });
      fireEvent.change(screen.getByTestId('input-phone'), { target: { value: '+91 9988776655' } });
      fireEvent.change(screen.getByTestId('input-address'), { target: { value: 'Heritage Lane 12' } });
      fireEvent.change(screen.getByTestId('input-city'), { target: { value: 'Varanasi' } });
      fireEvent.change(screen.getByTestId('input-state'), { target: { value: 'Uttar Pradesh' } });
      fireEvent.change(screen.getByTestId('input-postalCode'), { target: { value: '221001' } });

      fireEvent.click(screen.getByTestId('proceed-to-review-btn'));

      // In Step 2 Review: Bag is still populated
      expect(screen.getByTestId('live-bag-count')).toHaveTextContent('1');

      // Complete Demo Order
      fireEvent.click(screen.getByTestId('complete-demo-order-btn'));

      // After completion: Bag is cleared!
      expect(screen.getByTestId('live-bag-count')).toHaveTextContent('0');
      expect(screen.getByTestId('checkout-confirmation-step')).toBeInTheDocument();
    });
  });

  /* -------------------------------------------------------------------------
   * Requirement 9: Prevention of Duplicate Completion
   * ------------------------------------------------------------------------- */
  describe('9. Prevention of Duplicate Completion Clicks', () => {
    it('prevents repeated submission clicks by disabling action button', () => {
      renderCheckout([
        { productId: 'et-01', size: 'II (M)', color: 'Madder Oxblood', quantity: 1 }
      ]);

      fireEvent.change(screen.getByTestId('input-fullName'), { target: { value: 'Devi Sharma' } });
      fireEvent.change(screen.getByTestId('input-email'), { target: { value: 'devi@sharma.in' } });
      fireEvent.change(screen.getByTestId('input-phone'), { target: { value: '+91 9988776655' } });
      fireEvent.change(screen.getByTestId('input-address'), { target: { value: 'Heritage Lane 12' } });
      fireEvent.change(screen.getByTestId('input-city'), { target: { value: 'Varanasi' } });
      fireEvent.change(screen.getByTestId('input-state'), { target: { value: 'Uttar Pradesh' } });
      fireEvent.change(screen.getByTestId('input-postalCode'), { target: { value: '221001' } });

      fireEvent.click(screen.getByTestId('proceed-to-review-btn'));

      const completeBtn = screen.getByTestId('complete-demo-order-btn');
      fireEvent.click(completeBtn);

      // Transitions to confirmation, so completeBtn is no longer on screen
      expect(screen.queryByTestId('complete-demo-order-btn')).not.toBeInTheDocument();
      expect(screen.getByTestId('checkout-confirmation-step')).toBeInTheDocument();
    });
  });

  /* -------------------------------------------------------------------------
   * Requirement 10: Refresh & Navigation Handling
   * ------------------------------------------------------------------------- */
  describe('10. Refresh and Post-Completion Navigation', () => {
    it('provides working navigation links on confirmation step to explore collections or return home', () => {
      renderCheckout([
        { productId: 'et-01', size: 'II (M)', color: 'Madder Oxblood', quantity: 1 }
      ]);

      fireEvent.change(screen.getByTestId('input-fullName'), { target: { value: 'Devi Sharma' } });
      fireEvent.change(screen.getByTestId('input-email'), { target: { value: 'devi@sharma.in' } });
      fireEvent.change(screen.getByTestId('input-phone'), { target: { value: '+91 9988776655' } });
      fireEvent.change(screen.getByTestId('input-address'), { target: { value: 'Heritage Lane 12' } });
      fireEvent.change(screen.getByTestId('input-city'), { target: { value: 'Varanasi' } });
      fireEvent.change(screen.getByTestId('input-state'), { target: { value: 'Uttar Pradesh' } });
      fireEvent.change(screen.getByTestId('input-postalCode'), { target: { value: '221001' } });

      fireEvent.click(screen.getByTestId('proceed-to-review-btn'));
      fireEvent.click(screen.getByTestId('complete-demo-order-btn'));

      expect(screen.getByTestId('confirmation-explore-btn')).toHaveAttribute('href', '/collections');
      expect(screen.getByTestId('confirmation-home-btn')).toHaveAttribute('href', '/');
    });
  });

  /* -------------------------------------------------------------------------
   * Requirement 11: Accessibility & Semantic Structure
   * ------------------------------------------------------------------------- */
  describe('11. Accessibility & Semantic Form Structure', () => {
    it('links labels with inputs via matching id and htmlFor attributes', () => {
      renderCheckout([
        { productId: 'et-01', size: 'II (M)', color: 'Madder Oxblood', quantity: 1 }
      ]);

      expect(screen.getByLabelText(/full name/i)).toHaveAttribute('id', 'chkFullName');
      expect(screen.getByLabelText(/correspondence email/i)).toHaveAttribute('id', 'chkEmail');
      expect(screen.getByLabelText(/contact telephone/i)).toHaveAttribute('id', 'chkPhone');
      expect(screen.getByLabelText(/street address/i)).toHaveAttribute('id', 'chkAddress');
      expect(screen.getByLabelText(/city/i)).toHaveAttribute('id', 'chkCity');
      expect(screen.getByLabelText(/state/i)).toHaveAttribute('id', 'chkState');
      expect(screen.getByLabelText(/postal code/i)).toHaveAttribute('id', 'chkPostalCode');
      expect(screen.getByLabelText(/country/i)).toHaveAttribute('id', 'chkCountry');
    });
  });
});
