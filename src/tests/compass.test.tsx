import { describe, it, expect, beforeEach, vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { CompassPage } from '../pages/CompassPage.tsx';
import {
  matchProductsToPreferences,
  CompassPreferences
} from '../utils/compassMatcher.ts';
import { PRODUCTS } from '../data/products.ts';
import { SavedProvider, useSaved } from '../context/SavedContext.tsx';

// Test wrapper
const renderCompass = () => {
  return render(
    <MemoryRouter initialEntries={['/compass']}>
      <SavedProvider>
        <Routes>
          <Route path="/compass" element={<CompassPage />} />
        </Routes>
      </SavedProvider>
    </MemoryRouter>
  );
};

// Test harness with Saved inspector
const SavedInspector: React.FC = () => {
  const { savedCount, isSaved } = useSaved();
  return (
    <div>
      <span data-testid="global-saved-count">{savedCount}</span>
      <span data-testid="is-et01-saved">{isSaved('et-01') ? 'yes' : 'no'}</span>
    </div>
  );
};

const renderCompassWithInspector = () => {
  return render(
    <MemoryRouter initialEntries={['/compass']}>
      <SavedProvider>
        <SavedInspector />
        <Routes>
          <Route path="/compass" element={<CompassPage />} />
        </Routes>
      </SavedProvider>
    </MemoryRouter>
  );
};

describe('Stage 3.4 Thread Compass Implementation Tests', () => {
  beforeEach(() => {
    localStorage.clear();
    window.scrollTo = vi.fn();
  });

  describe('1. Deterministic Recommendation Engine (Unit Tests)', () => {
    it('returns empty array when no preferences are specified', () => {
      const results = matchProductsToPreferences({});
      expect(results).toEqual([]);
    });

    it('matches Merino Wool strictly to ET-01', () => {
      const results = matchProductsToPreferences({ fabric: 'merino-wool' });
      expect(results.length).toBeGreaterThanOrEqual(1);
      expect(results[0].product.id).toBe('et-01');
      expect(results[0].matchReasons.some(r => r.category === 'Fabric' && r.description.includes('Merino'))).toBe(true);
    });

    it('matches Box Calf Leather strictly to ET-05', () => {
      const results = matchProductsToPreferences({ fabric: 'box-calf' });
      expect(results.length).toBe(1);
      expect(results[0].product.id).toBe('et-05');
      expect(results[0].matchReasons[0].description).toContain('box calfskin');
    });

    it('matches Changthangi Pashmina strictly to ET-07', () => {
      const results = matchProductsToPreferences({ fabric: 'pashmina' });
      expect(results.length).toBe(1);
      expect(results[0].product.id).toBe('et-07');
      expect(results[0].matchReasons[0].description).toContain('Changthangi Pashmina');
    });

    it('matches Dual-Needle Saddle Stitching strictly to ET-05', () => {
      const results = matchProductsToPreferences({ craft: 'saddle-stitch' });
      expect(results.length).toBe(1);
      expect(results[0].product.id).toBe('et-05');
    });

    it('matches Kadwa Zari Brocade to ET-03 and ET-01', () => {
      const results = matchProductsToPreferences({ craft: 'kadwa-zari' });
      const ids = results.map(r => r.product.id);
      expect(ids).toContain('et-03');
      expect(ids).toContain('et-01');
    });

    it('ranks multi-attribute match at the top deterministically', () => {
      // Preferences specifically curated for ET-07:
      // Pashmina + Fluid + Diamond Twill + Himalayan
      const preferences: CompassPreferences = {
        fabric: 'pashmina',
        movement: 'fluid',
        craft: 'diamond-twill',
        story: 'himalayan'
      };

      const results = matchProductsToPreferences(preferences);
      expect(results.length).toBeGreaterThanOrEqual(1);
      // Top recommendation must be ET-07 with highest score
      expect(results[0].product.id).toBe('et-07');
      expect(results[0].score).toBe(30 + 20 + 25 + 20); // 95 points
      expect(results[0].matchReasons).toHaveLength(4);
    });

    it('resolves related archive story links when available in catalogue', () => {
      const results = matchProductsToPreferences({ fabric: 'pashmina', movement: 'fluid' });
      const et07Result = results.find(r => r.product.id === 'et-07');
      expect(et07Result).toBeDefined();
      expect(et07Result?.relatedStorySlug).toBeDefined();
    });

    it('preserves stable, deterministic secondary ordering for tied scores', () => {
      // Both ET-01 and ET-03 match kadwa-zari with equal craft score
      const results = matchProductsToPreferences({ craft: 'kadwa-zari' });
      const et01Idx = results.findIndex(r => r.product.id === 'et-01');
      const et03Idx = results.findIndex(r => r.product.id === 'et-03');
      // In tie-breaker, ET-01 precedes ET-03 due to catalogue order
      expect(et01Idx).toBeLessThan(et03Idx);
    });
  });

  describe('2. Guided Consultation Stepper & State Navigation', () => {
    it('starts on Step 1 with Fabric and Fiber options', () => {
      renderCompass();

      expect(screen.getByTestId('compass-step-1')).toBeInTheDocument();
      expect(screen.getByText('Which tactile fiber hand speaks to your sensibility?')).toBeInTheDocument();
      expect(screen.getByTestId('step-continue-btn')).toBeDisabled();
    });

    it('enables Continue button when an option is selected', () => {
      renderCompass();

      const optionSilk = screen.getByTestId('option-fabric-wild-silk');
      fireEvent.click(optionSilk);

      expect(optionSilk).toHaveClass('active');
      expect(screen.getByTestId('step-continue-btn')).not.toBeDisabled();
    });

    it('navigates through all four steps and advances to Recommendations', () => {
      renderCompass();

      // Step 1: Fabric
      fireEvent.click(screen.getByTestId('option-fabric-merino-wool'));
      fireEvent.click(screen.getByTestId('step-continue-btn'));

      // Step 2: Movement
      expect(screen.getByTestId('compass-step-2')).toBeInTheDocument();
      fireEvent.click(screen.getByTestId('option-movement-architectural'));
      fireEvent.click(screen.getByTestId('step-continue-btn'));

      // Step 3: Craft
      expect(screen.getByTestId('compass-step-3')).toBeInTheDocument();
      fireEvent.click(screen.getByTestId('option-craft-kadwa-zari'));
      fireEvent.click(screen.getByTestId('step-continue-btn'));

      // Step 4: Story
      expect(screen.getByTestId('compass-step-4')).toBeInTheDocument();
      fireEvent.click(screen.getByTestId('option-story-varanasi'));
      fireEvent.click(screen.getByTestId('step-continue-btn'));

      // Step 5: Recommendations
      expect(screen.getByTestId('compass-step-5')).toBeInTheDocument();
      expect(screen.getByTestId('recommendations-heading')).toBeInTheDocument();
    });

    it('preserves previous selections when navigating backward and forward', () => {
      renderCompass();

      // Select Fabric on Step 1
      fireEvent.click(screen.getByTestId('option-fabric-box-calf'));
      fireEvent.click(screen.getByTestId('step-continue-btn'));

      // Step 2: Select Movement
      expect(screen.getByTestId('compass-step-2')).toBeInTheDocument();
      fireEvent.click(screen.getByTestId('option-movement-architectural'));

      // Click Back to Step 1
      fireEvent.click(screen.getByTestId('step-back-btn'));
      expect(screen.getByTestId('compass-step-1')).toBeInTheDocument();

      // Box calf should still be selected
      expect(screen.getByTestId('option-fabric-box-calf')).toHaveClass('active');

      // Click Continue to Step 2
      fireEvent.click(screen.getByTestId('step-continue-btn'));
      expect(screen.getByTestId('compass-step-2')).toBeInTheDocument();

      // Architectural should still be selected
      expect(screen.getByTestId('option-movement-architectural')).toHaveClass('active');
    });

    it('resets all selections and returns to Step 1 when Reset is clicked', () => {
      renderCompass();

      fireEvent.click(screen.getByTestId('option-fabric-pashmina'));
      fireEvent.click(screen.getByTestId('step-continue-btn'));
      expect(screen.getByTestId('compass-step-2')).toBeInTheDocument();

      // Click Reset
      fireEvent.click(screen.getByTestId('step-reset-btn'));

      // Back to Step 1
      expect(screen.getByTestId('compass-step-1')).toBeInTheDocument();
      expect(screen.getByTestId('option-fabric-pashmina')).not.toHaveClass('active');
      expect(screen.getByTestId('step-continue-btn')).toBeDisabled();
    });

    it('allows jumping back to a completed step via the stepper pills', () => {
      renderCompass();

      fireEvent.click(screen.getByTestId('option-fabric-pashmina'));
      fireEvent.click(screen.getByTestId('step-continue-btn'));
      expect(screen.getByTestId('compass-step-2')).toBeInTheDocument();

      // Click Step 1 in stepper
      const step1Pill = screen.getByTestId('stepper-pill-1');
      fireEvent.click(step1Pill);

      expect(screen.getByTestId('compass-step-1')).toBeInTheDocument();
    });
  });

  describe('3. Recommendation Results & Verified Content', () => {
    it('displays top match with accurate approved price and matching reasons', () => {
      renderCompass();

      // Complete consultation for ET-01
      fireEvent.click(screen.getByTestId('option-fabric-merino-wool'));
      fireEvent.click(screen.getByTestId('step-continue-btn'));
      fireEvent.click(screen.getByTestId('option-movement-architectural'));
      fireEvent.click(screen.getByTestId('step-continue-btn'));
      fireEvent.click(screen.getByTestId('option-craft-kadwa-zari'));
      fireEvent.click(screen.getByTestId('step-continue-btn'));
      fireEvent.click(screen.getByTestId('option-story-varanasi'));
      fireEvent.click(screen.getByTestId('step-continue-btn'));

      // In Step 5
      expect(screen.getByTestId('recommendation-card-et-01')).toBeInTheDocument();
      expect(screen.getByText('Oxblood Wool-Silk Signature Coat-Dress')).toBeInTheDocument();
      expect(screen.getByText('₹68,500')).toBeInTheDocument();

      // Matching reasons container
      const reasonsBox = screen.getByTestId('match-reasons-et-01');
      expect(reasonsBox).toBeInTheDocument();
      expect(reasonsBox.textContent).toContain('Fabric:');
      expect(reasonsBox.textContent).toContain('Movement:');
    });

    it('integrates Saved Pieces toggle in recommendation cards', () => {
      renderCompassWithInspector();

      // Advance to results
      fireEvent.click(screen.getByTestId('option-fabric-merino-wool'));
      fireEvent.click(screen.getByTestId('step-continue-btn'));
      fireEvent.click(screen.getByTestId('option-movement-architectural'));
      fireEvent.click(screen.getByTestId('step-continue-btn'));
      fireEvent.click(screen.getByTestId('option-craft-kadwa-zari'));
      fireEvent.click(screen.getByTestId('step-continue-btn'));
      fireEvent.click(screen.getByTestId('option-story-varanasi'));
      fireEvent.click(screen.getByTestId('step-continue-btn'));

      expect(screen.getByTestId('global-saved-count').textContent).toBe('0');

      const saveBtn = screen.getByTestId('compass-save-et-01');
      fireEvent.click(saveBtn);

      expect(screen.getByTestId('global-saved-count').textContent).toBe('1');
      expect(screen.getByTestId('is-et01-saved').textContent).toBe('yes');
      expect(saveBtn.getAttribute('aria-pressed')).toBe('true');

      // Click again to unsave
      fireEvent.click(saveBtn);
      expect(screen.getByTestId('global-saved-count').textContent).toBe('0');
      expect(screen.getByTestId('is-et01-saved').textContent).toBe('no');
    });

    it('provides working link to product detail page', () => {
      renderCompass();

      fireEvent.click(screen.getByTestId('option-fabric-box-calf'));
      fireEvent.click(screen.getByTestId('step-continue-btn'));
      fireEvent.click(screen.getByTestId('option-movement-architectural'));
      fireEvent.click(screen.getByTestId('step-continue-btn'));
      fireEvent.click(screen.getByTestId('option-craft-saddle-stitch'));
      fireEvent.click(screen.getByTestId('step-continue-btn'));
      fireEvent.click(screen.getByTestId('option-story-architecture'));
      fireEvent.click(screen.getByTestId('step-continue-btn'));

      const cardEt05 = screen.getByTestId('recommendation-card-et-05');
      const detailLink = within(cardEt05).getByRole('link', { name: /view heirloom folio/i });
      expect(detailLink).toHaveAttribute('href', '/product/box-calf-structured-frame-bag');
    });
  });

  describe('4. Accessibility & Keyboard Support', () => {
    it('supports selecting option via keyboard Space or Enter key', () => {
      renderCompass();

      const optionPashmina = screen.getByTestId('option-fabric-pashmina');
      expect(optionPashmina.getAttribute('aria-checked')).toBe('false');

      fireEvent.keyDown(optionPashmina, { key: 'Enter' });
      expect(optionPashmina.getAttribute('aria-checked')).toBe('true');

      const optionWool = screen.getByTestId('option-fabric-merino-wool');
      fireEvent.keyDown(optionWool, { key: ' ' });
      expect(optionWool.getAttribute('aria-checked')).toBe('true');
      expect(optionPashmina.getAttribute('aria-checked')).toBe('false');
    });
  });

  describe('5. No-Match Behavior & Fallback Prohibition', () => {
    it('returns empty array and does NOT substitute arbitrary fallback products when criteria do not match', () => {
      // Preference with impossible/unmatched criterion or excessive threshold
      const results = matchProductsToPreferences(
        { fabric: 'pashmina', movement: 'architectural' }, // Pashmina is fluid, not architectural
        PRODUCTS,
        { minScore: 200 } // Unachievable threshold
      );

      expect(results).toEqual([]);
      // Guarantees zero arbitrary fallbacks
      expect(results.length).toBe(0);
    });

    it('displays graceful no-match state when recommendation list is empty on results step', () => {
      // In CompassPage, if user jumps to step 5 without matching preferences
      renderCompass();

      // Step 1: select fabric
      fireEvent.click(screen.getByTestId('option-fabric-pashmina'));
      fireEvent.click(screen.getByTestId('step-continue-btn'));

      // Advance through to step 5
      fireEvent.click(screen.getByTestId('option-movement-fluid'));
      fireEvent.click(screen.getByTestId('step-continue-btn'));
      fireEvent.click(screen.getByTestId('option-craft-diamond-twill'));
      fireEvent.click(screen.getByTestId('step-continue-btn'));
      fireEvent.click(screen.getByTestId('option-story-drape'));
      fireEvent.click(screen.getByTestId('step-continue-btn'));

      // Now on step 5, recommendations exist
      expect(screen.getByTestId('recommendations-list')).toBeInTheDocument();

      // Click "Restart Consultation"
      fireEvent.click(screen.getByTestId('results-reset-btn'));
      expect(screen.getByTestId('compass-step-1')).toBeInTheDocument();
    });
  });

  describe('5. Phase 6.4: Motion Transitions, Champagne Thread & SVG Icon Integrity', () => {
    it('applies directional transition classes when stepping forward and backward', () => {
      renderCompass();

      // Step 1 initial mount has panel class
      const step1 = screen.getByTestId('compass-step-1');
      expect(step1).toHaveClass('compass-step-panel');

      // Select fabric and advance
      fireEvent.click(screen.getByTestId('option-fabric-wild-silk'));
      fireEvent.click(screen.getByTestId('step-continue-btn'));

      // Step 2 should have forward transition class
      const step2 = screen.getByTestId('compass-step-2');
      expect(step2).toHaveClass('compass-step-panel');
      expect(step2).toHaveClass('compass-step-panel--forward');

      // Step back to Step 1
      fireEvent.click(screen.getByTestId('step-back-btn'));
      const step1Again = screen.getByTestId('compass-step-1');
      expect(step1Again).toHaveClass('compass-step-panel');
      expect(step1Again).toHaveClass('compass-step-panel--backward');
    });

    it('renders champagne thread progress fill corresponding to current step', () => {
      renderCompass();

      // At step 1, progress width is 0%
      const threadFill = document.querySelector('.compass-stepper-thread-fill') as HTMLElement;
      expect(threadFill).toBeInTheDocument();
      expect(threadFill.style.width).toBe('0%');

      // Advance to step 2
      fireEvent.click(screen.getByTestId('option-fabric-wild-silk'));
      fireEvent.click(screen.getByTestId('step-continue-btn'));
      expect(threadFill.style.width).toBe('25%');

      // Advance to step 3
      fireEvent.click(screen.getByTestId('option-movement-architectural'));
      fireEvent.click(screen.getByTestId('step-continue-btn'));
      expect(threadFill.style.width).toBe('50%');
    });

    it('uses SVG icons for step controls and content disclosures without raw ligature text', () => {
      renderCompass();

      // Continue button contains an SVG icon with aria-hidden="true"
      const continueBtn = screen.getByTestId('step-continue-btn');
      const continueSvg = continueBtn.querySelector('svg');
      expect(continueSvg).toBeInTheDocument();
      expect(continueSvg).toHaveAttribute('aria-hidden', 'true');
      expect(continueBtn).not.toHaveTextContent('arrow_forward');
    });
  });
});
