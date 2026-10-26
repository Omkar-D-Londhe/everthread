/**
 * EverThread Archive Disciplines & Asymmetric Layout Taxonomy
 * Groups the 14 Weave Library records into canonical craft disciplines using existing metadata.
 * No records are reclassified or invented.
 */

import { WeaveLibraryItem } from '../types/catalog.ts';

export type DisciplineLayoutPreset = 'feature-left' | 'feature-right' | 'triptych' | 'monograph-single';

export interface ArchiveDisciplineGroup {
  id: string;
  discipline: 'weaving' | 'embroidery' | 'dyeing' | 'draping';
  title: string;
  categoryHeading: string;
  description: string;
  layoutPreset: DisciplineLayoutPreset;
  itemIds: string[];
}

export const ARCHIVE_DISCIPLINE_GROUPS: ArchiveDisciplineGroup[] = [
  {
    id: 'group-weaving',
    discipline: 'weaving',
    title: 'Loom Architecture & Structural Interlacing',
    categoryHeading: 'Pure Loom Weaving',
    description: 'Interlocking warp and weft architectures on pit, frame, and jacquard looms—where structural density and metallic zari define the cloth.',
    layoutPreset: 'feature-left',
    itemIds: [
      'weave-01', // Varanasi Kadwa (Feature)
      'weave-02', // Chanderi & Kota Doria
      'weave-04', // Assam Muga
      'weave-09', // Kanchipuram Korvai
      'weave-10', // Paithani Tapestry
      'weave-11', // Patan Patola
      'weave-12', // Pochampally Ikat
      'weave-13', // Sambalpuri Bandha
    ]
  },
  {
    id: 'group-embroidery',
    discipline: 'embroidery',
    title: 'Surface Needlework & Relievo Shadow Play',
    categoryHeading: 'Surface Needlework',
    description: 'Single-filament needlecraft and reverse shadow-work executed upon handloom grounds—distinguishing surface embellishment from structural weave.',
    layoutPreset: 'feature-right',
    itemIds: [
      'weave-03', // Changthangi Pashmina / Sozni (Feature)
      'weave-05', // Lucknow Chikankari
    ]
  },
  {
    id: 'group-dyeing',
    discipline: 'dyeing',
    title: 'Botanical Resist, Mordant & Vat Alchemy',
    categoryHeading: 'Resist & Vat Dyeing',
    description: 'Mud resist (dabu), mineral mordants, and micro-knotted tie-dye immersion into fermented botanical indigo and alizarin vats.',
    layoutPreset: 'triptych',
    itemIds: [
      'weave-06', // Bagru Madder (Feature)
      'weave-07', // Kutch Ajrakh
      'weave-08', // Kutch & Jamnagar Bandhani
    ]
  },
  {
    id: 'group-draping',
    discipline: 'draping',
    title: 'Anatomic Bias Equilibrium & Uncut Cloth',
    categoryHeading: 'Anatomic Draping',
    description: 'Zero-waste radial fluidity and uncut selvedges honoring cloth continuity over fragmented tailoring.',
    layoutPreset: 'monograph-single',
    itemIds: [
      'weave-14', // Uncut Radial Bias Draping (Foundational Folio 1.2 companion)
    ]
  }
];

export function getDisciplineGroups(items: WeaveLibraryItem[], filter: string): { group: ArchiveDisciplineGroup; items: WeaveLibraryItem[] }[] {
  const itemMap = new Map<string, WeaveLibraryItem>(items.map(item => [item.id, item]));

  return ARCHIVE_DISCIPLINE_GROUPS.map(group => {
    // If filter is specific and not matching this discipline, return empty items
    if (filter !== 'all' && filter !== group.discipline) {
      return { group, items: [] };
    }

    const groupItems = group.itemIds
      .map(id => itemMap.get(id))
      .filter((item): item is WeaveLibraryItem => Boolean(item));

    return { group, items: groupItems };
  }).filter(entry => entry.items.length > 0);
}
