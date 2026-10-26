/**
 * EverThread Legacy Archive Route Mappings
 * Maps legacy monograph and tradition URL slugs to canonical archive query parameters.
 * Required for backward-compatibility with previously circulated URLs and external citations.
 */

export const LEGACY_ARCHIVE_ROUTES: Record<string, string> = {
  'varanasi-kadwa': 'banarasi-brocade',
  'chanderi-handloom': 'kota-doria',
  'changthangi-pashmina': 'kashmiri-sozni',
  'assam-wild-silk-twill': 'muga-silk',
  'kanchipuram-korvai-temple': 'kanchipuram-silk',
  'maharashtra-paithani-tapestry': 'paithani-silk',
  'gujarat-patan-patola-double-ikat': 'patan-patola',
  'telangana-pochampally-ikat': 'pochampally-ikat',
  'odisha-sambalpuri-bandha': 'sambalpuri-ikat',
};
