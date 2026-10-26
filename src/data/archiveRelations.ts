/**
 * EverThread Archive Relationships & Lineage Map
 * Governs associations between Cultural Archive folios/traditions and Atelier products.
 *
 * Subject to Decision O-7 and DEC D-25 (F-52 hold):
 * - Banarasi Brocade & Kota Doria: blocked (no link rendered) pending owner resolution of candidate selection.
 * - Kashmiri Sozni: info-only notice ("Pashmina is the ground fabric discussed in this folio.").
 * - Muga Silk: no related piece (kind: 'none').
 * - TR inspiration links: written for 6 traditions (omitting banarasi-brocade per hold), but remain hidden until the product is listed.
 * - Zero Add to Bag / Acquire actions in the Archive.
 */

export interface ArchiveRelatedPieceEntry {
  kind: 'piece' | 'info' | 'none' | 'blocked';
  productId?: string;
  text?: string;
}

// Provisional constants flagged NEEDS-OWNER-WORDING
export const PROVISIONAL_RELATED_TEXTS = {
  et01: 'Related piece: its weave record notes a Kadwa-style facing.', // NEEDS-OWNER-WORDING
  et04: 'Related piece: woven in a Chanderi handloom weave, a technique this folio also covers.', // NEEDS-OWNER-WORDING
  et07Info: 'Pashmina is the ground fabric discussed in this folio.', // NEEDS-OWNER-WORDING
  traditionalInspiration: (tradition: string) =>
    `A contemporary design inspired by the visual language of ${tradition}.`, // NEEDS-OWNER-WORDING
};

export const ARCHIVE_RELATED_PIECES: Record<string, ArchiveRelatedPieceEntry> = {
  // Active per Stage 07 §7.7 (Decision O-7, F-05, F-52 resolution)
  'banarasi-brocade': {
    kind: 'piece',
    productId: 'et-01',
    text: PROVISIONAL_RELATED_TEXTS.et01,
  },
  'kota-doria': {
    kind: 'piece',
    productId: 'et-04',
    text: PROVISIONAL_RELATED_TEXTS.et04,
  },
  'kashmiri-sozni': {
    kind: 'info',
    text: PROVISIONAL_RELATED_TEXTS.et07Info,
  },
  'muga-silk': {
    kind: 'none',
  },
};

// TR inspiration mappings (excluding banarasi-brocade pending F-52 / DEC D-25)
export const TRADITION_INSPIRED_DESIGNS: Record<string, string> = {
  'paithani-silk': 'tr-02',
  'patan-patola': 'tr-03',
  'kanchipuram-silk': 'tr-04',
  'chikankari': 'tr-05',
  'ajrakh': 'tr-06',
  'bandhani': 'tr-07',
};
