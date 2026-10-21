import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import { SearchModal } from '../components/SearchModal.tsx';

describe('Atelier Curatorial Search Modal Suite', () => {
  it('renders search suggestions when input is empty', () => {
    render(
      <MemoryRouter>
        <SearchModal isOpen={true} onClose={vi.fn()} />
      </MemoryRouter>
    );

    expect(screen.getByTestId('search-input')).toBeInTheDocument();
    expect(screen.getByText('Curatorial Suggestions')).toBeInTheDocument();
    expect(screen.getByText('Varanasi Brocade')).toBeInTheDocument();
  });

  it('filters and displays product results when matching product title or weave', () => {
    render(
      <MemoryRouter>
        <SearchModal isOpen={true} onClose={vi.fn()} />
      </MemoryRouter>
    );

    const input = screen.getByTestId('search-input');
    fireEvent.change(input, { target: { value: 'Coat-Dress' } });

    expect(screen.getByText(/Archival Matches/i)).toBeInTheDocument();
    expect(screen.getByText('Oxblood Wool-Silk Signature Coat-Dress')).toBeInTheDocument();
  });

  it('filters and displays living weave traditions when searching for a tradition', () => {
    render(
      <MemoryRouter>
        <SearchModal isOpen={true} onClose={vi.fn()} />
      </MemoryRouter>
    );

    const input = screen.getByTestId('search-input');
    fireEvent.change(input, { target: { value: 'Chanderi' } });

    expect(screen.getByText('Chanderi & Kota Doria Sheer Weave')).toBeInTheDocument();
  });

  it('filters and displays monograph stories and journal essays', () => {
    render(
      <MemoryRouter>
        <SearchModal isOpen={true} onClose={vi.fn()} />
      </MemoryRouter>
    );

    const input = screen.getByTestId('search-input');
    fireEvent.change(input, { target: { value: 'Drape' } });

    expect(screen.getByText('The Art of the Drape')).toBeInTheDocument();
  });

  it('shows an empty state when no records match', () => {
    render(
      <MemoryRouter>
        <SearchModal isOpen={true} onClose={vi.fn()} />
      </MemoryRouter>
    );

    const input = screen.getByTestId('search-input');
    fireEvent.change(input, { target: { value: 'NonExistentFiber12345' } });

    expect(screen.getByTestId('search-empty-state')).toBeInTheDocument();
    expect(screen.getByText('No Archival Records Found')).toBeInTheDocument();
  });
});
