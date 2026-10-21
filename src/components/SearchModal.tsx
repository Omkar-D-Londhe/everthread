import React, { useEffect, useRef } from 'react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
      if (
        e.key === '/' && 
        !isOpen && 
        document.activeElement?.tagName !== 'INPUT' && 
        document.activeElement?.tagName !== 'TEXTAREA'
      ) {
        e.preventDefault();
        // Trigger opening via parent
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      <div 
        className="modal-backdrop fade show" 
        style={{ zIndex: 1050 }} 
        onClick={onClose} 
      />
      <div 
        className="modal fade show d-block" 
        tabIndex={-1} 
        role="dialog" 
        aria-modal="true"
        style={{ zIndex: 1055 }}
      >
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content bg-canvas border-hairline p-0 text-dark">
            <div className="modal-header border-hairline-b p-3 bg-cream d-flex justify-content-between align-items-center">
              <span className="label-caps text-oxblood">Atelier Curatorial Search</span>
              <button 
                type="button" 
                className="btn-close" 
                aria-label="Close" 
                onClick={onClose} 
              />
            </div>
            <div className="modal-body p-4">
              <div className="position-relative mb-3">
                <input 
                  ref={inputRef}
                  type="text" 
                  className="form-control form-control-editorial w-100 ps-3" 
                  placeholder="Type a fabric, weave, silhouette or heritage chapter... (Press Esc to close)" 
                />
              </div>
              <div className="p-4 text-center text-muted-editorial font-sans">
                <span className="label-caps d-block mb-2 text-champagne">Atelier Index Search</span>
                <p className="body-sm mb-0">
                  Search across silk trenches, Changthangi pashmina, Varanasi Kadwa weaves, or archive folios...
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
