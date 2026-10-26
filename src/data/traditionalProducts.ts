/**
 * EverThread Traditional Concept Products Data Specification
 * Concept specifications for "The Living Inheritance" (TR-01 through TR-07).
 *
 * Subject to Decision O-6-C, O-9, O-11:
 * - These are exploratory atelier concept specifications, NOT verified artisan or manufacturing records.
 * - Must never invent edition, artisan-hour, warp density, origin, dispatch, or certification claims.
 * - All records remain `isListed: false` and `isPurchasable: false` until image assets are approved.
 */

import { TraditionalProduct } from '../types/catalog.ts';

export const TR_STATUS_TEXT =
  'Concept specification for creative exploration; not verified artisan or manufacturing provenance.';

export const CONCEPT_NOTICE_TEXT =
  'Concept garment specification. Images represent exploratory atelier concepts generated with AI.';

export const TRADITIONAL_PRODUCTS: TraditionalProduct[] = [
  {
    id: 'tr-01',
    slug: 'banaras-afterlight-sculpted-brocade-mantle-coat',
    title: 'Banaras Afterlight — Sculpted Brocade Mantle Coat',
    collection: 'traditional',
    category: 'Outerwear',
    price: 128000,
    currency: '₹',
    description:
      'An architectural evening mantle coat crafted with sculptural shoulder contours and opulent brocade motifs inspired by classical Banaras jacquard weaving traditions.',
    story:
      'Banaras Afterlight is an exploratory outerwear study re-interpreting the metallic luster and heavy weight of traditional Varanasi brocade through an austere architectural silhouette.',
    inspiration: {
      traditionKey: 'banarasi-brocade',
      label: 'Banarasi Brocade'
    },
    pieces: [
      {
        key: 'coat',
        label: 'Sculpted Brocade Mantle Coat',
        sizes: ['XS', 'S', 'M', 'L', 'XL']
      }
    ],
    includes: ['Sculpted Brocade Mantle Coat'],
    materials: [
      { part: 'shell', composition: '70% mulberry silk 30% viscose jacquard' },
      { part: 'lining', composition: '100% cupro' },
      { part: 'decorative thread', composition: '100% polyester' }
    ],
    colors: [
      { id: 'c-tr01-1', name: 'Oxblood / Antique Gold', hex: '#49232D' },
      { id: 'c-tr01-2', name: 'Midnight Indigo / Champagne', hex: '#1C2841' }
    ],
    statusText: TR_STATUS_TEXT,
    conceptNotice: CONCEPT_NOTICE_TEXT,
    isListed: false,
    isPurchasable: false,
    image: '/images/products/traditional/tr-01-banaras-afterlight.webp',
    imageAlt: 'Banaras Afterlight — Sculpted Brocade Mantle Coat — Conceptual Rendering',
    provenance: 'ai-concept-fashion',
    creditText: '',
    careInstructions: [],
    contentFlags: {
      isEditionFictional: true,
      isHoursEstimate: false,
      isAtelierConcept: true,
      unsupportedClaims: ['Concept specification for creative exploration']
    }
  },
  {
    id: 'tr-02',
    slug: 'mayura-axis-sculpted-drape-gown',
    title: 'Mayura Axis — Sculpted Drape Gown',
    collection: 'traditional',
    category: 'Gowns & Drapes',
    price: 142000,
    currency: '₹',
    description:
      'A monumental draped gown tracing the avian geometry and vibrant tapestry borders of classical Maharashtra Paithani weaves.',
    story:
      'Mayura Axis translates the rich gold borders and stylized peacock motifs of Yeola and Paithan tapestries into an asymmetric evening gown with fluid silk satin drape.',
    inspiration: {
      traditionKey: 'paithani-silk',
      label: 'Paithani Silk'
    },
    pieces: [
      {
        key: 'gown',
        label: 'Sculpted Drape Gown',
        sizes: ['XS', 'S', 'M', 'L', 'XL']
      }
    ],
    includes: ['Sculpted Drape Gown'],
    materials: [
      { part: 'shell', composition: '100% mulberry silk satin' },
      { part: 'contrast', composition: '100% silk jacquard' },
      { part: 'lining', composition: '100% cupro' }
    ],
    colors: [
      { id: 'c-tr02-1', name: 'Peacock Emerald / Antique Gold', hex: '#0B4F42' },
      { id: 'c-tr02-2', name: 'Rani Rose / Champagne', hex: '#A82D58' }
    ],
    statusText: TR_STATUS_TEXT,
    conceptNotice: CONCEPT_NOTICE_TEXT,
    isListed: false,
    isPurchasable: false,
    image: '/images/products/traditional/tr-02-mayura-axis.webp',
    imageAlt: 'Mayura Axis — Sculpted Drape Gown — Conceptual Rendering',
    provenance: 'ai-concept-fashion',
    creditText: '',
    careInstructions: [],
    contentFlags: {
      isEditionFictional: true,
      isHoursEstimate: false,
      isAtelierConcept: true,
      unsupportedClaims: ['Concept specification for creative exploration']
    }
  },
  {
    id: 'tr-03',
    slug: 'patola-geometry-reversible-jacket-and-trouser-set',
    title: 'Patola Geometry — Reversible Jacket and Trouser Set',
    collection: 'traditional',
    category: 'Sets & Co-ords',
    price: 148000,
    currency: '₹',
    description:
      'A sharp two-piece ensemble exploring the strict mathematical symmetries and chromatic reversals of Gujarat double-ikat traditions.',
    story:
      'Patola Geometry adapts the complex grid alignments of Patan double-ikat resist into a reversible tailored jacket and coordinated trouser suite.',
    inspiration: {
      traditionKey: 'patan-patola',
      label: 'Patan Patola'
    },
    pieces: [
      {
        key: 'jacket',
        label: 'Reversible Jacket',
        sizes: ['XS', 'S', 'M', 'L', 'XL']
      },
      {
        key: 'trousers',
        label: 'Tailored Trouser',
        sizes: ['XS', 'S', 'M', 'L', 'XL']
      }
    ],
    includes: ['Reversible Jacket', 'Tailored Trouser'],
    materials: [
      { part: 'shell', composition: '60% silk 40% cotton jacquard' },
      { part: 'jacket lining', composition: '100% cotton' }
    ],
    colors: [
      { id: 'c-tr03-1', name: 'Midnight Ink / Vermilion', hex: '#1E232A' },
      { id: 'c-tr03-2', name: 'Forest / Old Gold', hex: '#1D3B2B' }
    ],
    statusText: TR_STATUS_TEXT,
    conceptNotice: CONCEPT_NOTICE_TEXT,
    isListed: false,
    isPurchasable: false,
    image: '/images/products/traditional/tr-03-patola-geometry.webp',
    imageAlt: 'Patola Geometry — Reversible Jacket and Trouser Set — Conceptual Rendering',
    provenance: 'ai-concept-fashion',
    creditText: '',
    careInstructions: [],
    contentFlags: {
      isEditionFictional: true,
      isHoursEstimate: false,
      isAtelierConcept: true,
      unsupportedClaims: ['Concept specification for creative exploration']
    }
  },
  {
    id: 'tr-04',
    slug: 'temple-grid-longline-tunic-and-trouser-set',
    title: 'Temple Grid — Longline Tunic and Trouser Set',
    collection: 'traditional',
    category: 'Sets & Co-ords',
    price: 118000,
    currency: '₹',
    description:
      'A structured tunic and trouser coordinate framed with contrasting temple border grids inspired by heavy Kanchipuram korvai architectures.',
    story:
      'Temple Grid explores the interlocking pyramid spires (mokku) of Kanchipuram borders through a clean longline silhouette with high side vents and relaxed trousers.',
    inspiration: {
      traditionKey: 'kanchipuram-silk',
      label: 'Kanchipuram Silk'
    },
    pieces: [
      {
        key: 'tunic',
        label: 'Longline Tunic',
        sizes: ['XS', 'S', 'M', 'L', 'XL']
      },
      {
        key: 'trousers',
        label: 'Narrow Trouser',
        sizes: ['XS', 'S', 'M', 'L', 'XL']
      }
    ],
    includes: ['Longline Tunic', 'Narrow Trouser'],
    materials: [
      { part: 'tunic', composition: '100% mulberry silk twill' },
      { part: 'trousers', composition: '65% cotton 35% silk' },
      { part: 'borders', composition: '100% silk jacquard' }
    ],
    colors: [
      { id: 'c-tr04-1', name: 'Deep Oxblood / Warm Ivory', hex: '#49232D' },
      { id: 'c-tr04-2', name: 'Midnight Blue / Champagne', hex: '#152238' }
    ],
    statusText: TR_STATUS_TEXT,
    conceptNotice: CONCEPT_NOTICE_TEXT,
    isListed: false,
    isPurchasable: false,
    image: '/images/products/traditional/tr-04-temple-grid.webp',
    imageAlt: 'Temple Grid — Longline Tunic and Trouser Set — Conceptual Rendering',
    provenance: 'ai-concept-fashion',
    creditText: '',
    careInstructions: [],
    contentFlags: {
      isEditionFictional: true,
      isHoursEstimate: false,
      isAtelierConcept: true,
      unsupportedClaims: ['Concept specification for creative exploration']
    }
  },
  {
    id: 'tr-05',
    slug: 'moonveil-sheer-embroidered-overlay',
    title: 'Moonveil — Sheer Embroidered Overlay',
    collection: 'traditional',
    category: 'Outerwear',
    price: 78000,
    currency: '₹',
    description:
      'A weightless diaphanous sheer overlay paired with an inner slip, interpreting the tonal white-on-white shadow needlework of Awadh Chikankari.',
    story:
      'Moonveil is an ethereal layered garment evoking the play of light through delicate bakhia (shadow-work) and tepchi stitches on sheer muslin.',
    inspiration: {
      traditionKey: 'chikankari',
      label: 'Chikankari'
    },
    pieces: [
      {
        key: 'overlay-slip-pair',
        label: 'Overlay with Inner Slip',
        sizes: ['XS', 'S', 'M', 'L', 'XL']
      }
    ],
    includes: ['Sheer Embroidered Overlay', 'Inner Mulberry Silk Slip'],
    materials: [
      { part: 'overlay', composition: '100% cotton voile' },
      { part: 'embroidery', composition: '100% cotton' },
      { part: 'slip', composition: '100% mulberry silk crepe' }
    ],
    colors: [
      { id: 'c-tr05-1', name: 'Warm Ivory / Pearl', hex: '#FEF9F0' },
      { id: 'c-tr05-2', name: 'Deep Oxblood / Muted Rose', hex: '#49232D' }
    ],
    statusText: TR_STATUS_TEXT,
    conceptNotice: CONCEPT_NOTICE_TEXT,
    isListed: false,
    isPurchasable: false,
    image: '/images/products/traditional/tr-05-moonveil.webp',
    imageAlt: 'Moonveil — Sheer Embroidered Overlay — Conceptual Rendering',
    provenance: 'ai-concept-fashion',
    creditText: '',
    careInstructions: [],
    contentFlags: {
      isEditionFictional: true,
      isHoursEstimate: false,
      isAtelierConcept: true,
      unsupportedClaims: ['Concept specification for creative exploration']
    }
  },
  {
    id: 'tr-06',
    slug: 'indigo-orbit-geometric-overshirt-and-trouser-co-ord',
    title: 'Indigo Orbit — Geometric Overshirt and Trouser Co-ord',
    collection: 'traditional',
    category: 'Sets & Co-ords',
    price: 66000,
    currency: '₹',
    description:
      'An everyday architectural co-ord adorned with an Ajrakh-inspired geometric print, translating astral symmetry into modern tailoring.',
    story:
      'Indigo Orbit draws upon the celestial mandalas, star repeats, and indigo-madder harmonies of traditional Ajrakh patterning in a relaxed two-piece set.',
    inspiration: {
      traditionKey: 'ajrakh',
      label: 'Ajrakh'
    },
    pieces: [
      {
        key: 'overshirt',
        label: 'Geometric Overshirt',
        sizes: ['XS', 'S', 'M', 'L', 'XL']
      },
      {
        key: 'trousers',
        label: 'Relaxed Trouser',
        sizes: ['XS', 'S', 'M', 'L', 'XL']
      }
    ],
    includes: ['Geometric Overshirt', 'Relaxed Trouser'],
    materials: [
      { part: 'all', composition: '100% cotton twill' }
    ],
    colors: [
      { id: 'c-tr06-1', name: 'Indigo / Terracotta', hex: '#1C3144' },
      { id: 'c-tr06-2', name: 'Espresso / Sand', hex: '#30231F' }
    ],
    statusText: TR_STATUS_TEXT,
    conceptNotice: CONCEPT_NOTICE_TEXT,
    isListed: false,
    isPurchasable: false,
    image: '/images/products/traditional/tr-06-indigo-orbit.webp',
    imageAlt: 'Indigo Orbit — Geometric Overshirt and Trouser Co-ord — Conceptual Rendering',
    provenance: 'ai-concept-fashion',
    creditText: '',
    careInstructions: [],
    contentFlags: {
      isEditionFictional: true,
      isHoursEstimate: false,
      isAtelierConcept: true,
      unsupportedClaims: ['Concept specification for creative exploration']
    }
  },
  {
    id: 'tr-07',
    slug: 'tidal-bind-sculpted-cape-dress',
    title: 'Tidal Bind — Sculpted Cape Dress',
    collection: 'traditional',
    category: 'Gowns & Drapes',
    price: 92000,
    currency: '₹',
    description:
      'A dramatic evening dress with integrated cape lines, inspired by the resist-bound rhythm and cosmic pointillism of western Indian Bandhani.',
    story:
      'Tidal Bind captures the tiny pinched resist knots of western Indian tie-dye in a flowing silk crepe cape gown that moves with sweeping cadence.',
    inspiration: {
      traditionKey: 'bandhani',
      label: 'Bandhani'
    },
    pieces: [
      {
        key: 'dress',
        label: 'Sculpted Cape Dress',
        sizes: ['XS', 'S', 'M', 'L', 'XL']
      }
    ],
    includes: ['Sculpted Cape Dress'],
    materials: [
      { part: 'shell', composition: '100% mulberry silk crepe' },
      { part: 'lining', composition: '100% cupro' }
    ],
    colors: [
      { id: 'c-tr07-1', name: 'Oxblood / Champagne', hex: '#49232D' },
      { id: 'c-tr07-2', name: 'Deep Indigo / Warm Ivory', hex: '#1C2841' }
    ],
    statusText: TR_STATUS_TEXT,
    conceptNotice: CONCEPT_NOTICE_TEXT,
    isListed: false,
    isPurchasable: false,
    image: '/images/products/traditional/tr-07-tidal-bind.webp',
    imageAlt: 'Tidal Bind — Sculpted Cape Dress — Conceptual Rendering',
    provenance: 'ai-concept-fashion',
    creditText: '',
    careInstructions: [],
    contentFlags: {
      isEditionFictional: true,
      isHoursEstimate: false,
      isAtelierConcept: true,
      unsupportedClaims: ['Concept specification for creative exploration']
    }
  }
];
