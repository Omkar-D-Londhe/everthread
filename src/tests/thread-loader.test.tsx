import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThreadLoader } from '../components/ThreadLoader.tsx';

describe('EverThread Custom Minimal Loading Animation (ThreadLoader)', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders the approved watercolor hand artwork with continuous silk filament overlay', () => {
    render(<ThreadLoader isLoading={true} />);

    const loader = screen.getByTestId('thread-loader');
    expect(loader).toBeDefined();
    expect(loader.getAttribute('role')).toBe('status');
    expect(loader.getAttribute('aria-live')).toBe('polite');

    // Verify approved hand artwork presence
    const artwork = screen.getByTestId('thread-hand-artwork');
    expect(artwork).toBeDefined();
    expect(artwork.getAttribute('src')).toBe('/images/everthread-loader-hand-clean.png');

    // Verify SVG presence and coordinate space matching artwork
    const svg = loader.querySelector('svg.thread-loader-svg');
    expect(svg).toBeDefined();
    expect(svg?.getAttribute('viewBox')).toBe('0 0 896 1200');

    // Verify continuous silk thread filament
    const silkThread = svg?.querySelector('.thread-active-silk');
    expect(silkThread).toBeDefined();
    expect(silkThread?.getAttribute('pathLength')).toBe('1000');

    // Verify complete elimination of old SVG hand, guide track, and mechanical spool
    expect(svg?.querySelector('.thread-sleeve-group')).toBeNull();
    expect(svg?.querySelector('.thread-hand-group')).toBeNull();
    expect(svg?.querySelector('.thread-guide-track')).toBeNull();
    expect(svg?.querySelector('.thread-pinch-glow')).toBeNull();
    expect(svg?.querySelector('.thread-spool-wrapper')).toBeNull();
    expect(svg?.querySelector('.thread-spool-token')).toBeNull();
    expect(svg?.querySelector('animateMotion')).toBeNull();
  });

  it('displays the EverThread wordmark and the requested tagline', () => {
    render(<ThreadLoader isLoading={true} message="An heirloom, not a trend." />);

    expect(screen.getByText('EVERTHREAD')).toBeDefined();
    expect(screen.getByText('An heirloom, not a trend.')).toBeDefined();
  });

  it('supports custom messages and can hide wordmark if requested', () => {
    render(
      <ThreadLoader 
        isLoading={true} 
        message="Consulting the Curator's Compass..." 
        showWordmark={false} 
      />
    );

    expect(screen.queryByText('EVERTHREAD')).toBeNull();
    expect(screen.getByText("Consulting the Curator's Compass...")).toBeDefined();
  });

  it('supports different variants: fullscreen, overlay, and inline', () => {
    const { rerender } = render(<ThreadLoader variant="fullscreen" isLoading={true} />);
    expect(screen.getByTestId('thread-loader').classList.contains('thread-loader-fullscreen')).toBe(true);

    rerender(<ThreadLoader variant="overlay" isLoading={true} />);
    expect(screen.getByTestId('thread-loader').classList.contains('thread-loader-overlay')).toBe(true);

    rerender(<ThreadLoader variant="inline" isLoading={true} />);
    expect(screen.getByTestId('thread-loader').classList.contains('thread-loader-inline')).toBe(true);
  });

  it('fades out smoothly and unmounts when isLoading becomes false, calling onExited', () => {
    const onExited = vi.fn();
    const { rerender } = render(
      <ThreadLoader 
        isLoading={true} 
        minDisplayTimeMs={200} 
        fadeDurationMs={150} 
        onExited={onExited} 
      />
    );

    const loader = screen.getByTestId('thread-loader');
    expect(loader).toBeDefined();
    expect(loader.classList.contains('thread-loader-fading')).toBe(false);

    // Signal loading finished
    rerender(
      <ThreadLoader 
        isLoading={false} 
        minDisplayTimeMs={200} 
        fadeDurationMs={150} 
        onExited={onExited} 
      />
    );

    // Fast-forward past minDisplayTimeMs (200ms)
    act(() => {
      vi.advanceTimersByTime(200);
    });

    // Should now be in fading state
    expect(screen.getByTestId('thread-loader').classList.contains('thread-loader-fading')).toBe(true);
    expect(onExited).not.toHaveBeenCalled();

    // Fast-forward past fadeDurationMs (150ms)
    act(() => {
      vi.advanceTimersByTime(150);
    });

    // Should be unmounted from DOM and callback fired
    expect(screen.queryByTestId('thread-loader')).toBeNull();
    expect(onExited).toHaveBeenCalledTimes(1);
  });

  it('bypasses artificial minDisplayTimeMs and fadeDurationMs when reduced motion is preferred', () => {
    // Mock reduced motion = true
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: query.includes('prefers-reduced-motion: reduce'),
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn()
    }));

    const onExited = vi.fn();
    const { rerender } = render(
      <ThreadLoader 
        isLoading={true} 
        minDisplayTimeMs={800} 
        fadeDurationMs={400} 
        onExited={onExited} 
      />
    );

    expect(screen.getByTestId('thread-loader')).toBeInTheDocument();

    // Finish loading
    rerender(
      <ThreadLoader 
        isLoading={false} 
        minDisplayTimeMs={800} 
        fadeDurationMs={400} 
        onExited={onExited} 
      />
    );

    // Fast-forward 0ms (next tick)
    act(() => {
      vi.advanceTimersByTime(0);
    });

    // Unmounts immediately without waiting for 800ms + 400ms
    expect(screen.queryByTestId('thread-loader')).toBeNull();
    expect(onExited).toHaveBeenCalledTimes(1);
  });

  it('falls back gracefully to original artwork if clean image fails to load', () => {
    render(<ThreadLoader isLoading={true} />);
    const artwork = screen.getByTestId('thread-hand-artwork') as HTMLImageElement;
    expect(artwork.src).toContain('/images/everthread-loader-hand-clean.png');

    // Simulate error loading clean image
    act(() => {
      artwork.dispatchEvent(new Event('error'));
    });
    expect(artwork.src).toContain('/images/everthread-loader-hand.png');
  });
});
