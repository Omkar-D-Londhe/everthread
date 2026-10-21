import { ArchiveStory, WeaveLibraryItem } from '../types/catalog.ts';

export const STORIES: ArchiveStory[] = [
  {
    id: 'story-01',
    slug: 'the-living-loom',
    chapter: 'CHAPTER 01',
    folio: 'FOLIO 1.1',
    title: 'The Living Loom',
    subtitle: 'Varanasi Kadwa Brocade & The Rhythm of Sacred Streets',
    focus: 'Interlocking Gold Zari Weft',
    image: '/images/archive/general/archive-living-loom-01.webp',
    imageAlt: 'Subterranean pit-loom in Madanpura weaving gold zari threadwork',
    imageCredit: 'Archival cultural documentation specimen',
    artisan: 'Varanasi Brocade Guild (Maqbool Hasan Representative Persona)',
    location: 'Madanpura, Varanasi (25°18′N, 83°00′E)',
    summary: 'In the narrow lanes of Madanpura, pit-looms sink two feet into the earth to maintain steady humidity for raw silk threads. Unlike machine jacquard, each Kadwa motif is hand-engraved into the weft without floating threads at the reverse.',
    exhibitionText: 'The sound of the loom is an acoustic clock. The wooden shuttle slides horizontally, followed by the foot pedal press and the gentle clatter of the bamboo reeds. To watch the weaver work is to realize that textile is an architectural dialogue between human muscle tension and botanical fiber memory.',
    draftingSpecs: [
      { label: 'Warp Anchoring', value: 'Subterranean Clay Pit (Regulated Ambient Humidity)' },
      { label: 'Zari Composition', value: 'Traditional Silver-Gilt Metallic Zari' },
      { label: 'Reverse Finish', value: 'Zero Floating Threads (Individually Knotted Butis)' },
      { label: 'Daily Weaving Rate', value: '3 to 5 Centimeters per 8-Hour Cycle' }
    ],
    relatedProductSlugs: ['the-architectonic-zari-waistcoat', 'the-kadwa-brocade-ceremony-cape'],
    relatedTraditionKey: 'banarasi-brocade',
    relatedTraditionTitle: 'Varanasi Kadwa Brocade',
    sources: [
      'Textiles and Ornaments of India, Museum of Modern Art monograph archives.',
      'All India Handicrafts Board Handloom Census Documentation.'
    ],
    contentFlags: {
      isPersonaIllustrative: true,
      isLocationDemonstration: false,
      unsupportedClaims: [
        'Master Weaver Maqbool Hasan is an illustrative persona representing multi-generational Varanasi weaver guilds.',
        'Workshop field audio is a simulated soundscape for demonstration.'
      ]
    }
  },
  {
    id: 'story-02',
    slug: 'the-art-of-the-drape',
    chapter: 'CHAPTER 02',
    folio: 'FOLIO 1.2',
    title: 'The Art of the Drape',
    subtitle: 'Radial Geometry, Zero-Waste Cloths & Anatomic Equilibrium',
    focus: 'Zero-Waste Radial Fluidity',
    image: '/images/archive/general/archive-art-of-drape-01.webp',
    imageAlt: 'Radial draped silhouette study demonstrating uncut bias tension',
    imageCredit: 'Atelier pattern monograph archives',
    artisan: 'Atelier Pattern Guild (Claire Vance Drape Study Concept)',
    location: 'Kyoto & New Delhi Demonstration Salons',
    summary: 'From ancient Greek himations to unstitched Indian sarees and Japanese kimono geometry, true luxury honors the uncut cloth. EverThread silhouettes integrate gravity as a structural seam, allowing garments to breathe with the wearer.',
    exhibitionText: 'When a garment is cut violently into 40 rigid flat panels, it forgets how cloth moves. We construct using unbroken bias lines and underarm diamond gussets that expand with breath and step.',
    draftingSpecs: [
      { label: 'Geometric Principle', value: 'Radial Bias Flow on 45° Grain Line' },
      { label: 'Fabric Consumption', value: 'Zero Cut-Off Scrap (Fold-Integrated Selvedge)' },
      { label: 'Underarm Architecture', value: 'Double Rhombus Diamond Gusset' },
      { label: 'Seam Construction', value: 'Silk Organza Taped French Seams' }
    ],
    relatedProductSlugs: ['the-drape-collar-pashmina-overcoat', 'the-madder-dyed-bias-robe'],
    sources: [
      'Max Tilke, Oriental Costumes: Their Design and Colors.',
      'Sari: The Sacred and the Secular, National Institute of Design.'
    ],
    contentFlags: {
      isPersonaIllustrative: true,
      isLocationDemonstration: true,
      unsupportedClaims: [
        'Madame Claire Vance is a fictional editorial persona.',
        'Joint studio operation between Kyoto and New Delhi is an illustrative brand concept.'
      ]
    }
  },
  {
    id: 'story-03',
    slug: 'the-language-of-the-surface',
    chapter: 'CHAPTER 03',
    folio: 'FOLIO 1.3',
    title: 'The Language of the Surface',
    subtitle: 'Kutch Ari Needlework, Ahimsa Sericulture & Tactile Scripts',
    focus: 'Ahimsa Wild Silk Tactility',
    image: '/images/archive/general/archive-language-of-surface-01.webp',
    imageAlt: 'Micro-needlework borders and raw silk fibers from the Kutch salt desert',
    imageCredit: 'Field ethnography textile research folio',
    artisan: 'Kutch Artisanal Guild (Ari Needlework Lineage Concept)',
    location: 'Kutch Salt Flats, Gujarat (23°45′N, 70°45′E)',
    summary: 'Before written alphabet, generational nomadic histories were stitched into needlework borders. Each geometric chevron denotes rainfall, marriage covenants, and migration paths across salt flats. Coupled with Ahimsa silk harvested after the moth departs.',
    exhibitionText: 'Our silk is harvested non-violently after the moth has naturally pierced the cocoon and departed into the forest. The resulting fiber has a dry, crisp handfeel and an organic matte luster that reflects sunlight like unpolished marble.',
    draftingSpecs: [
      { label: 'Needlework Tool', value: 'Tempered Ari Awl with Micro-Hook Tip' },
      { label: 'Stitch Geometry', value: 'Unbroken Continuous Chain-Stitch Loop' },
      { label: 'Fiber Extraction', value: 'Non-Violent Ahimsa Wild Mulberry Sericulture' },
      { label: 'Tactile Finish', value: 'Unbleached Crisp Matte Texture (Zero Chemical Degumming)' }
    ],
    relatedProductSlugs: ['the-sylvan-mulberry-silk-trench', 'the-madder-dyed-bias-robe'],
    sources: [
      'John Irwin & Margaret Hall, Indian Embroidery: Historic Textiles of India.',
      'Central Silk Board of India Ahimsa Sericulture Bulletins.'
    ],
    contentFlags: {
      isPersonaIllustrative: true,
      isLocationDemonstration: false,
      unsupportedClaims: [
        'Exclusive tribal guild contract agreements are editorial narrative devices.'
      ]
    }
  },
  {
    id: 'story-04',
    slug: 'the-architecture-of-a-garment',
    chapter: 'CHAPTER 04',
    folio: 'FOLIO 1.4',
    title: 'The Architecture of a Garment',
    subtitle: 'Internal Gussets, French Seams & Lifetime Mending Covenants',
    focus: 'Underarm Diamond Gussets & Bound Hems',
    image: '/images/archive/general/archive-architecture-of-garment-01.webp',
    imageAlt: 'Interior tailoring anatomy of an heirloom coat displaying French seams and silk organza tape',
    imageCredit: 'Atelier master pattern construction records',
    artisan: 'EverThread Master Pattern Cutters (Atelier Guild Concept)',
    location: 'Paris Atelier Concept (Rue de Rivoli)',
    summary: 'Examine the interior of an EverThread coat: no synthetic overlocking, no glued interfacing, only hand-bound silk organza tape and clean interior finishing as immaculate as the exterior.',
    exhibitionText: 'A garment designed for an heirloom lifespan must be capable of being taken in or let out over decades. Our garments feature generous 1.5-inch hidden inlay margins and hand-stitched bar tacks at points of strain.',
    draftingSpecs: [
      { label: 'Interfacing Philosophy', value: 'Zero Glued Fusibles; Floating Horsehair Canvas Only' },
      { label: 'Edge Binding', value: 'Hand-Mitered 100% Silk Organza Tape' },
      { label: 'Expansion Allowance', value: '1.5-Inch Concealed Hem & Side-Seam Inlays' },
      { label: 'Reinforcement', value: 'Hand-Stitched Silk Bar Tacks at Pocket Strains' }
    ],
    relatedProductSlugs: ['the-sylvan-mulberry-silk-trench', 'the-pleated-indigo-chanderi-tunic'],
    sources: [
      'Norah Waugh, The Cut of Men\'s and Women\'s Clothes.',
      'Chambre Syndicale de la Haute Couture Master Tailoring Guidelines.'
    ],
    contentFlags: {
      isPersonaIllustrative: true,
      isLocationDemonstration: true,
      unsupportedClaims: [
        'Paris Rue de Rivoli workshop address is a demonstration design premise.',
        'Lifetime repair covenants are simulated brand concepts.'
      ]
    }
  }
];

export const WEAVE_LIBRARY: WeaveLibraryItem[] = [
  {
    id: 'weave-01',
    slug: 'varanasi-kadwa',
    traditionKey: 'banarasi-brocade',
    diagramId: 'library-warp-weft-diagram-01',
    title: 'Varanasi Kadwa Jacquard',
    technique: 'Interlocking discontinuous weft brocade',
    region: 'Varanasi, Uttar Pradesh',
    fiber: 'Traditional Handloom Silk with Brocade Zari',
    warpDensity: 'Traditional Handloom Sett',
    description: 'Each floral buti motif is individually hand-locked into the warp using small spools. Zero floating threads remain on the reverse, creating an embossed relief that never snags.',
    distinction: 'weaving',
    structuralProfile: 'Heavier weight, ceremonial durability, zero snag reverse',
    image: '/images/archive/banarasi-brocade/archive-banarasi-brocade-macro-05.webp',
    imageAlt: 'Macro view of Varanasi Kadwa gold zari brocade interlocking weft'
  },
  {
    id: 'weave-02',
    slug: 'chanderi-handloom',
    traditionKey: 'kota-doria',
    diagramId: 'library-warp-weft-diagram-01',
    title: 'Chanderi & Kota Doria Sheer Weave',
    technique: 'Extra-weft sheer plain weave with square khat grids',
    region: 'Chanderi (MP) & Kota (Rajasthan)',
    fiber: 'Handloom Silk Warp with Fine Cotton Weft',
    warpDensity: 'Traditional Khat Square Open Sett',
    description: 'Woven with high-twist silk warp threads and un-degummed cotton weft, giving the fabric its signature shimmering translucence, crisp paper hand, and gossamer drape.',
    distinction: 'weaving',
    structuralProfile: 'Sheer, lightweight, micro-pleat memory',
    image: '/images/archive/kota-doria/archive-kota-doria-macro-05.webp',
    imageAlt: 'Macro view of Kota Doria transparent khat grid weave'
  },
  {
    id: 'weave-03',
    slug: 'changthangi-pashmina',
    traditionKey: 'kashmiri-sozni',
    diagramId: 'library-embroidery-weaving-comparison-01',
    title: 'Kashmiri Sozni on Changthangi Pashmina',
    technique: 'Single-strand fine needle sozni needlework on hand-spun twill',
    region: 'Changthang Plateau & Kashmir Valley',
    fiber: 'Hand-Spun Cashmere Ground with Silk Needlework',
    warpDensity: 'Hand-Spun Fine Twill Sett',
    description: 'Ultra-fine needle sozni embroidery worked with single silk filaments upon hand-combed, hand-spun high-altitude Changthangi cashmere base.',
    distinction: 'embroidery',
    structuralProfile: 'Plush loft, cloud softness, thermal insulation',
    image: '/images/archive/kashmiri-sozni/archive-kashmiri-sozni-macro-05.webp',
    imageAlt: 'Macro view of delicate Kashmiri Sozni needlework on fine cashmere'
  },
  {
    id: 'weave-04',
    slug: 'assam-wild-silk-twill',
    traditionKey: 'muga-silk',
    diagramId: 'library-warp-weft-diagram-01',
    title: 'Assam Muga Wild Silk Twill',
    technique: 'Continuous diagonal ridge twill weave on bamboo looms',
    region: 'Brahmaputra Valley, Assam',
    fiber: 'Wild Assam Muga Silk (Antheraea assamensis)',
    warpDensity: 'Traditional Diagonal Ridge Twill Sett',
    description: 'Endemic wild golden silk known for natural golden luster and tensile endurance that outlasts the weaver, gaining richer sheen with every organic washing.',
    distinction: 'weaving',
    structuralProfile: 'Natural golden luster, high tensile stamina, shape retention',
    image: '/images/archive/muga-silk/archive-muga-silk-macro-05.webp',
    imageAlt: 'Macro view of natural Assam Muga golden silk fibers'
  },
  {
    id: 'weave-05',
    slug: 'kutch-ari-embroidery',
    traditionKey: 'chikankari',
    diagramId: 'library-embroidery-weaving-comparison-01',
    title: 'Lucknow Chikankari Needlework',
    technique: 'Hand-stitched shadow-work (bakhiya) and pulled-thread fretwork (jali)',
    region: 'Lucknow, Uttar Pradesh',
    fiber: 'Fine untwisted cotton threads on gossamer muslin',
    warpDensity: 'Surface needlework',
    description: 'Meticulously worked from the reverse to create subtle translucent shadow relief upon sheer muslin ground, combined with un-cut pulled-thread floral jali lattices.',
    distinction: 'embroidery',
    structuralProfile: 'Diaphanous relief, opaque shadow play on translucent ground',
    image: '/images/archive/chikankari/archive-chikankari-macro-05.webp',
    imageAlt: 'Macro view of Lucknow Chikankari delicate shadow needlework'
  },
  {
    id: 'weave-06',
    slug: 'bagru-madder-dyeing',
    traditionKey: 'bagru',
    diagramId: 'library-block-printing-process-01',
    title: 'Bagru Natural Madder & Dabu Resist',
    technique: 'Mud resist (dabu) and fermented botanical root vat infusion',
    region: 'Bagru, Rajasthan',
    fiber: 'Natural Madder Root Dye on Unbleached Cotton',
    warpDensity: 'Hand-Block Dabu Resist on Cotton Ground',
    description: 'Distinct from synthetic chemical printing: black soil, gum, and clay resist paste is hand-block applied before slow immersion into boiling alizarin root vats for deep madder hues.',
    distinction: 'dyeing',
    structuralProfile: 'Natural color penetration, earthy aroma, graceful patina aging',
    image: '/images/archive/bagru/archive-bagru-macro-05.webp',
    imageAlt: 'Macro view of Bagru madder-dyed botanical block relief'
  },
  {
    id: 'weave-07',
    slug: 'kutch-ajrakh-resist',
    traditionKey: 'ajrakh',
    diagramId: 'library-block-printing-process-01',
    title: 'Kutch Ajrakh Double-Sided Resist',
    technique: '16-stage mud resist, indigo and harda mordant block printing',
    region: 'Ajrakhpur & Dhamadka, Kutch, Gujarat',
    fiber: 'Natural Indigo and Mineral Mordants on Fine Cotton',
    warpDensity: 'Double-Sided Block Resist on Cotton Ground',
    description: 'Complex 16-step artisanal chemistry aligned with celestial rhythms and river water chemistry, printing mirror-perfect geometric astronomy motifs on both sides of the cloth simultaneously.',
    distinction: 'dyeing',
    structuralProfile: 'Double-face penetration, nocturnal geometric symmetry',
    image: '/images/archive/ajrakh/archive-ajrakh-macro-05.webp',
    imageAlt: 'Macro view of Kutch Ajrakh natural indigo and madder double resist'
  },
  {
    id: 'weave-08',
    slug: 'gujarat-bandhani-tie-dye',
    traditionKey: 'bandhani',
    diagramId: 'library-resist-dyeing-process-01',
    title: 'Kutch & Jamnagar Bandhani',
    technique: 'Micro-point knotting with waxed fingernail point (nakhla)',
    region: 'Jamnagar & Bhuj, Gujarat',
    fiber: 'Traditional Gaji Silk with Natural Botanical Dyes',
    warpDensity: 'High-Density Hand-Plucked Micro-Resist',
    description: 'Artisans pinch minuscule beads of cloth with sharp fingernails, binding them with continuous unknotted thread before resist dye immersion, leaving crinkled tactile texture.',
    distinction: 'dyeing',
    structuralProfile: 'Three-dimensional crinkled surface, dotted celestial clusters',
    image: '/images/archive/bandhani/archive-bandhani-macro-05.webp',
    imageAlt: 'Macro view of hand-plucked Bandhani silk knotting texture'
  },
  {
    id: 'weave-09',
    slug: 'kanchipuram-korvai-temple',
    traditionKey: 'kanchipuram-silk',
    diagramId: 'library-warp-weft-diagram-01',
    title: 'Kanchipuram Korvai Temple Silk',
    technique: 'Three-shuttle interlocking joint with traditional zari',
    region: 'Kanchipuram, Tamil Nadu',
    fiber: 'Double-Warp Handloom Silk with Metallic Zari',
    warpDensity: 'Heavyweight Triple-Ply Handloom Sett',
    description: 'Two weavers operate three shuttles simultaneously to interlock contrasting solid body and heavy border wefts through interlocking petni zig-zag joints.',
    distinction: 'weaving',
    structuralProfile: 'Sculptural stiffness, high weight, ceremonial grandeur',
    image: '/images/archive/kanchipuram-silk/archive-kanchipuram-silk-macro-05.webp',
    imageAlt: 'Macro view of Kanchipuram Korvai interlocking temple border weft'
  },
  {
    id: 'weave-10',
    slug: 'maharashtra-paithani-tapestry',
    traditionKey: 'paithani-silk',
    diagramId: 'library-technique-comparison-01',
    title: 'Paithani Tapestry Silk',
    technique: 'Discontinuous interlocking weft tapestry weave (dhada)',
    region: 'Paithan & Yeola, Maharashtra',
    fiber: 'Fine Filature Silk Warp with Traditional Brocade Zari',
    warpDensity: 'Interlocking Tapestry Weft Handloom Sett',
    description: 'Woven like a medieval European Gobelins tapestry, using small wooden bobbins to weave intricate peacock (mor) and lotus motifs directly into the zari field without jacquard punch-cards.',
    distinction: 'weaving',
    structuralProfile: 'Luminous dual-tone dhoop-chhaon luster, seamless reverse',
    image: '/images/archive/paithani-silk/archive-paithani-silk-macro-05.webp',
    imageAlt: 'Macro view of Paithani traditional metallic zari tapestry weave'
  },
  {
    id: 'weave-11',
    slug: 'gujarat-patan-patola-double-ikat',
    traditionKey: 'patan-patola',
    diagramId: 'library-double-ikat-process-01',
    title: 'Patan Patola Double-Ikat',
    technique: 'Exact mathematical double-ikat tie-dye resist on warp and weft',
    region: 'Patan, Gujarat',
    fiber: 'Multi-Ply Handloom Silk with Natural Botanical Dyes',
    warpDensity: 'Balanced Double-Ikat Plain-Weave Sett',
    description: 'Both warp and weft threads are tie-dyed independently with microscopic mathematical precision before weaving so they intersect on the loom to form razor-sharp geometric flora.',
    distinction: 'weaving',
    structuralProfile: 'Identical dual-face clarity, indestructible dye bond',
    image: '/images/archive/patan-patola/archive-patan-patola-macro-05.webp',
    imageAlt: 'Macro view of Patan Patola double-ikat geometric alignment'
  },
  {
    id: 'weave-12',
    slug: 'telangana-pochampally-ikat',
    traditionKey: 'pochampally-ikat',
    diagramId: 'library-double-ikat-process-01',
    title: 'Pochampally Tie-Dye Ikat',
    technique: 'Transfer-frame warp and weft ikat resisted in natural vats',
    region: 'Bhoodan Pochampally, Telangana',
    fiber: 'Fine Cotton Warp with Wild Tussar Silk Weft',
    warpDensity: 'Traditional Ikat Handloom Sett',
    description: 'Yarns are bound around rotating pegs and dyed prior to loom setting. The characteristic slight feathery blur (chowka) at pattern edges celebrates the human hand in mechanical precision.',
    distinction: 'weaving',
    structuralProfile: 'Feathery geometric edge, tactile cotton-silk breathability',
    image: '/images/archive/pochampally-ikat/archive-pochampally-ikat-macro-05.webp',
    imageAlt: 'Macro view of Pochampally ikat geometric weave'
  },
  {
    id: 'weave-13',
    slug: 'odisha-sambalpuri-bandha',
    traditionKey: 'sambalpuri-ikat',
    diagramId: 'library-warp-weft-diagram-01',
    title: 'Sambalpuri Bandha Curvilinear Ikat',
    technique: 'Curvilinear tie-dye bandha weaving on pit looms',
    region: 'Sambalpur & Bargarh, Odisha',
    fiber: 'Wild Tussar Silk and Hand-Spun Cotton',
    warpDensity: 'Pit-Loom Bandha Handloom Sett',
    description: 'Masters tie curved shell (shankha), wheel (chakra), and wildlife motifs onto fine yarn arrays, requiring extraordinary tension control across pit-loom clay floors to prevent motif distortion.',
    distinction: 'weaving',
    structuralProfile: 'Organic curvilinear lines, rustic earth luster',
    image: '/images/archive/sambalpuri-ikat/archive-sambalpuri-ikat-macro-05.webp',
    imageAlt: 'Macro view of Sambalpuri Bandha curvilinear ikat motif'
  },
  {
    id: 'weave-14',
    slug: 'radial-bias-draping',
    title: 'Uncut Radial Bias Draping',
    technique: '45-degree true bias gravity suspension',
    region: 'Pan-Cultural Draping Traditions',
    fiber: 'Silk Crepe de Chine and Pashmina',
    warpDensity: 'Dynamic diagonal grain elasticity',
    description: 'Distinct from planar tailoring: cloth is cut along the true bias so that the weave opens and contracts dynamically with body movement, eliminating stiff structural seams.',
    distinction: 'draping',
    structuralProfile: 'Gravitational stretch, zero seam resistance',
    image: '/images/archive/general/archive-art-of-drape-01.webp',
    imageAlt: 'Radial draped silhouette study demonstrating uncut bias tension'
  }
];

export const getStoryBySlug = (slug: string): ArchiveStory | undefined => {
  return STORIES.find(s => s.slug === slug);
};

export const getStoryById = (id: string): ArchiveStory | undefined => {
  return STORIES.find(s => s.id === id);
};
