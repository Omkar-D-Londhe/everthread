import { Product } from '../types/catalog.ts';
import { PRODUCT_ASSET_MAP } from './assetMap.ts';

export const PRODUCTS: Product[] = [
  {
    id: 'et-01',
    slug: 'oxblood-wool-silk-signature-coat-dress',
    title: 'Oxblood Wool-Silk Signature Coat-Dress',
    subtitle: 'Asymmetric Hand-Loomed Brocade Facing with Architectural Lapel',
    category: 'Outerwear',
    edition: 'Edition of 30',
    price: 68500,
    currency: '₹',
    status: 'Made to Order',
    statusDisclaimer: 'Simulated allocation queue. Garments are hand-tailored upon bespoke commission.',
    leadTime: '3–4 Weeks',
    description: 'Structured wool-silk tailored silhouette with an unbelted, razor-sharp shoulder line and hand-finished asymmetric woven brocade interior facing.',
    fiberPurity: '70% Fine Merino Wool, 30% Wild Mulberry Silk',
    weaveType: 'Pit-Loomed 2/2 Twill with Kadwa Facing',
    origin: 'New Delhi Atelier Concept / Varanasi Lineage',
    warpDensity: '140 TPI (Threads Per Inch)',
    artisanHours: '64 Hours (Estimated Guild Craft Benchmark)',
    colors: [
      { id: 'c-01', name: 'Madder Oxblood', hex: '#49232d' },
      { id: 'c-02', name: 'Warm Ivory', hex: '#f2ede4' },
      { id: 'c-03', name: 'Forest Espresso', hex: '#251800' }
    ],
    sizes: ['I (XS–S)', 'II (M)', 'III (L–XL)', 'Bespoke Measurement'],
    curatorTags: ['material-silk', 'form-structured', 'atelier-loom'],
    image: PRODUCT_ASSET_MAP['et-01'].primary.src,
    macroImage: PRODUCT_ASSET_MAP['et-01'].macro?.src || PRODUCT_ASSET_MAP['et-01'].primary.src,
    imageAlt: 'Oxblood Wool-Silk Signature Coat-Dress in natural atelier light',
    macroImageAlt: 'Macro loupe showing asymmetric brocade facing and wool-silk twill structure',
    imageCredit: 'EverThread Atelier Archival Study',
    gallery: PRODUCT_ASSET_MAP['et-01'].gallery,
    relatedStorySlugs: ['the-architecture-of-a-garment', 'the-language-of-the-surface'],
    careInstructions: [
      'Store in provided untreated red cedar chest to deter pests naturally.',
      'Specialist dry clean only using organic solvents.',
      'Steam with pure distilled water; do not press iron directly on silk twill ridges.'
    ],
    contentFlags: {
      isEditionFictional: true,
      isHoursEstimate: true,
      isAtelierConcept: true,
      unsupportedClaims: [
        'Production hour count (64 hours) is an unverified editorial estimate.',
        'Edition size (30 pieces) is a fictional demo constraint.',
        'New Delhi Guild physical workshop is an editorial narrative concept.'
      ]
    }
  },
  {
    id: 'et-02',
    slug: 'ivory-raw-tussar-cocoon-trench',
    title: 'Ivory Raw Tussar Cocoon Trench',
    subtitle: 'Hand-Spun Changthangi Matka Silk with Minimalist Cocoon Collar',
    category: 'Outerwear',
    edition: 'Edition of 15',
    price: 112000,
    currency: '₹',
    status: 'Atelier Masterwork',
    statusDisclaimer: 'Limited demonstration allocation. Fiber hand-combed from wild sericulture harvest.',
    leadTime: '6 Weeks',
    description: 'Structured raw silk coat in natural ivory tone. Clean architectonic cut without harsh exterior hardware or belts, allowing the heavy raw silk hand to drape naturally.',
    fiberPurity: '100% Hand-Spun Matka Raw Silk',
    weaveType: 'Hand-Spun Plain Weave',
    origin: 'Assam Sericulture / Kashmir Guild Lineage',
    warpDensity: '95 TPI',
    artisanHours: '110 Hours (Estimated Guild Craft Benchmark)',
    colors: [
      { id: 'c-04', name: 'Natural Warm Ivory', hex: '#fef9f0' },
      { id: 'c-05', name: 'Smoked Burgundy', hex: '#300f19' }
    ],
    sizes: ['I (XS–S)', 'II (M)', 'III (L–XL)', 'Bespoke Measurement'],
    curatorTags: ['material-silk', 'form-structured', 'atelier-hands'],
    image: PRODUCT_ASSET_MAP['et-02'].primary.src,
    macroImage: PRODUCT_ASSET_MAP['et-02'].macro?.src || PRODUCT_ASSET_MAP['et-02'].primary.src,
    imageAlt: 'Structured drape of the Ivory Raw Tussar Cocoon Trench in soft gallery light',
    macroImageAlt: 'Macro loupe showing textured slubs of 100% hand-spun raw silk at 95 TPI',
    imageCredit: 'EverThread Atelier Archival Study',
    gallery: PRODUCT_ASSET_MAP['et-02'].gallery,
    relatedStorySlugs: ['the-art-of-the-drape'],
    careInstructions: [
      'Air out on padded wide cedar hangers between wearings in shaded cross-breeze.',
      'Gently comb with natural horn cashmere/silk brush to maintain surface loft.',
      'Professional gentle museum dry clean only.'
    ],
    contentFlags: {
      isEditionFictional: true,
      isHoursEstimate: true,
      isAtelierConcept: true,
      unsupportedClaims: [
        'Production hour count (110 hours) is an unverified craft benchmark.',
        'Edition of 15 is a simulated availability claim.'
      ]
    }
  },
  {
    id: 'et-03',
    slug: 'architectonic-zari-waistcoat',
    title: 'Architectonic Zari Waistcoat',
    subtitle: 'Sculpted Tussar Silhouette with Interlocking Kadwa Zari Motifs',
    category: 'Waistcoats',
    edition: 'Edition of 40',
    price: 44000,
    currency: '₹',
    status: 'Made to Order',
    statusDisclaimer: 'Simulated allocation queue. Hand-loomed in Varanasi pit-loom workshops.',
    leadTime: '2–3 Weeks',
    description: 'Gold-gilt thread embroidery on hand-woven raw tussar silk base. Sculpted, razor-sharp architectural shoulder line engineered to be worn standalone or layered.',
    fiberPurity: '100% Wild Tussar Silk with Fine Zari',
    weaveType: 'Heavy Tussar Rib with Kadwa Zari',
    origin: 'Varanasi Master Handloom Cluster',
    warpDensity: '120 TPI',
    artisanHours: '52 Hours (Estimated Guild Craft Benchmark)',
    colors: [
      { id: 'c-06', name: 'Raw Bronze Tussar', hex: '#3d2c0b' },
      { id: 'c-07', name: 'Coal Black', hex: '#1d1c16' }
    ],
    sizes: ['I (XS–S)', 'II (M)', 'III (L–XL)'],
    curatorTags: ['material-silk', 'form-structured', 'atelier-loom', 'heritage-ceremony'],
    image: PRODUCT_ASSET_MAP['et-03'].primary.src,
    macroImage: PRODUCT_ASSET_MAP['et-03'].macro?.src || PRODUCT_ASSET_MAP['et-03'].primary.src,
    imageAlt: 'Architectural tailored line of the raw bronze Zari Waistcoat',
    macroImageAlt: 'Close-up macro of genuine metallic zari weft threads intertwined with raw tussar rib',
    imageCredit: 'EverThread Atelier Archival Study',
    gallery: PRODUCT_ASSET_MAP['et-03'].gallery,
    relatedStorySlugs: ['the-living-loom'],
    careInstructions: [
      'Do not expose metallic zari threads to perfumes, citrus, or acidic chemicals.',
      'Wrap in pure unbleached muslin cloth for long-term archival conservation.',
      'Professional spot cleaning only by textile conservators.'
    ],
    contentFlags: {
      isEditionFictional: true,
      isHoursEstimate: true,
      isAtelierConcept: true,
      unsupportedClaims: [
        '52 hours is an editorial estimate rather than an audited payroll record.',
        'Use of reclaimed silver-gilt thread is an editorial narrative specification.'
      ]
    }
  },
  {
    id: 'et-04',
    slug: 'angrakha-asymmetric-sheer-tunic',
    title: 'Angrakha Asymmetric Sheer Tunic',
    subtitle: 'Fermented Indigo Resist Dye with Mother-of-Pearl Closures',
    category: 'Tunics & Drapes',
    edition: 'Edition of 25',
    price: 32000,
    currency: '₹',
    status: 'Limited Reserve',
    statusDisclaimer: 'Demonstration reserve piece. Plant-indigo bacterial vat fermentation.',
    leadTime: 'Ready to Dispatch',
    description: 'Fermented plant-indigo resist dye on translucent silk-cotton blend with micro-pleated front apron and hand-carved mother-of-pearl stud closures.',
    fiberPurity: '70% Mulberry Silk, 30% Desi Organic Cotton',
    weaveType: 'Chanderi Handloom Weave',
    origin: 'Chanderi, Madhya Pradesh',
    warpDensity: '160 TPI',
    artisanHours: '38 Hours (Estimated Guild Craft Benchmark)',
    colors: [
      { id: 'c-08', name: 'Vat Fermented Indigo', hex: '#203144' },
      { id: 'c-09', name: 'Unbleached Sheer', hex: '#f8f3ea' }
    ],
    sizes: ['I (XS–S)', 'II (M)', 'III (L–XL)'],
    curatorTags: ['material-linen', 'form-fluid', 'heritage-ceremony'],
    image: PRODUCT_ASSET_MAP['et-04'].primary.src,
    macroImage: PRODUCT_ASSET_MAP['et-04'].macro?.src || PRODUCT_ASSET_MAP['et-04'].primary.src,
    imageAlt: 'Translucent pleated silhouette of the Angrakha Asymmetric Sheer Tunic',
    macroImageAlt: 'Macro view showing natural indigo fermentation penetration on sheer Chanderi weave',
    imageCredit: 'EverThread Atelier Archival Study',
    gallery: PRODUCT_ASSET_MAP['et-04'].gallery,
    relatedStorySlugs: ['the-art-of-the-drape', 'the-architecture-of-a-garment'],
    careInstructions: [
      'Natural indigo dye will subtly rub off initially; wash separately with pH-neutral soapberry nuts.',
      'Drip dry in shade inside out.',
      'Warm iron on reverse side while slightly damp.'
    ],
    contentFlags: {
      isEditionFictional: true,
      isHoursEstimate: true,
      isAtelierConcept: true,
      unsupportedClaims: [
        '38 hours is an approximate handloom benchmark.',
        'Ready to dispatch status is a simulation UI flag.'
      ]
    }
  },
  {
    id: 'et-05',
    slug: 'box-calf-structured-frame-bag',
    title: 'Box-Calf Structured Frame Bag',
    subtitle: 'Architectonic Box Silhouette with Hand-Saddle Stitching and Brass Clasp',
    category: 'Accessories',
    edition: 'Edition of 20',
    price: 54000,
    currency: '₹',
    status: 'Atelier Masterwork',
    statusDisclaimer: 'Limited demonstration allocation. Vegetable-tanned box calf leather.',
    leadTime: '3 Weeks',
    description: 'Architectonic box bag crafted from vegetable-tanned French box calf leather dyed in our signature madder oxblood. Features hand-burnished edge finishing and bespoke antique brass lock.',
    fiberPurity: '100% Vegetable-Tanned Box Calf Leather & Cast Brass Hardware',
    weaveType: 'Hand-Saddle Stitched Leathercraft',
    origin: 'Atelier Leather Guild Concept',
    warpDensity: '7 Stitches Per Inch (Waxed Linen)',
    artisanHours: '42 Hours (Estimated Guild Craft Benchmark)',
    colors: [
      { id: 'c-10', name: 'Madder Oxblood', hex: '#49232d' },
      { id: 'c-11', name: 'Obsidian Night', hex: '#1d1c16' }
    ],
    sizes: ['One Size (Structured Mini Box)'],
    curatorTags: ['material-leather', 'form-structured', 'atelier-hands'],
    image: PRODUCT_ASSET_MAP['et-05'].primary.src,
    macroImage: PRODUCT_ASSET_MAP['et-05'].macro?.src || PRODUCT_ASSET_MAP['et-05'].primary.src,
    imageAlt: 'Sculptural silhouette of the Box-Calf Structured Frame Bag',
    macroImageAlt: 'Macro view showing vegetable-tanned leather grain and beeswax hand saddle stitching',
    imageCredit: 'EverThread Atelier Archival Study',
    gallery: PRODUCT_ASSET_MAP['et-05'].gallery,
    relatedStorySlugs: ['the-architecture-of-a-garment'],
    careInstructions: [
      'Condition twice annually with organic beeswax leather balm.',
      'Keep away from prolonged dampness and direct heat.',
      'Store in provided unbleached linen dust bag stuffed with acid-free tissue.'
    ],
    contentFlags: {
      isEditionFictional: true,
      isHoursEstimate: true,
      isAtelierConcept: true,
      unsupportedClaims: [
        '42 hours production time is an unverified craft estimate.',
        'Atelier Leather Guild is an editorial concept persona.'
      ]
    }
  },
  {
    id: 'et-06',
    slug: 'hand-rolled-mulberry-twill-scarf',
    title: 'Hand-Rolled Mulberry Twill Scarf',
    subtitle: 'Featherweight Handloom Twill with Hand-Rolled Handkerchief Hems',
    category: 'Accessories',
    edition: 'Edition of 50',
    price: 24500,
    currency: '₹',
    status: 'Limited Reserve',
    statusDisclaimer: 'Demonstration allocation. Hand-reeled wild silk yarns.',
    leadTime: 'Ready to Dispatch',
    description: 'Featherweight handspun mulberry silk stole dyed in rich burgundy with subtle champagne zari selvedge stripe and eyelash fringe.',
    fiberPurity: '100% Hand-Reeled Mulberry Silk with Fine Zari Edge',
    weaveType: 'Featherweight Gauze Twill Weave',
    origin: 'Murshidabad Master Weaving Cluster',
    warpDensity: '110 TPI',
    artisanHours: '24 Hours (Estimated Guild Craft Benchmark)',
    colors: [
      { id: 'c-12', name: 'Burgundy Wine', hex: '#49232d' },
      { id: 'c-13', name: 'Champagne Silk', hex: '#dfc396' }
    ],
    sizes: ['Classic Stole (200cm × 70cm)'],
    curatorTags: ['material-silk', 'form-fluid', 'atelier-loom'],
    image: PRODUCT_ASSET_MAP['et-06'].primary.src,
    macroImage: PRODUCT_ASSET_MAP['et-06'].macro?.src || PRODUCT_ASSET_MAP['et-06'].primary.src,
    imageAlt: 'Fluid tactile fold of the Hand-Rolled Mulberry Twill Scarf',
    macroImageAlt: 'Macro view showing diaphanous handspun silk gauze weave and eyelash fringe',
    imageCredit: 'EverThread Atelier Archival Study',
    gallery: PRODUCT_ASSET_MAP['et-06'].gallery,
    relatedStorySlugs: ['the-language-of-the-surface'],
    careInstructions: [
      'Gently hand-wash in cold water with pH-neutral silk detergent.',
      'Do not wring; roll gently in a terry towel to extract excess moisture.',
      'Iron on low silk setting while still slightly damp.'
    ],
    contentFlags: {
      isEditionFictional: true,
      isHoursEstimate: true,
      isAtelierConcept: true,
      unsupportedClaims: [
        '24 hours is an approximate handloom benchmark.',
        'Murshidabad historical cluster connection is an editorial attribution.'
      ]
    }
  },
  {
    id: 'et-07',
    slug: 'high-altitude-hand-spun-pashmina-stole',
    title: 'High-Altitude Hand-Spun Pashmina Stole',
    subtitle: 'Hand-Combed Changthangi Pashmina with Interwoven Real Zari Borders',
    category: 'Accessories',
    edition: 'Edition of 35',
    price: 38000,
    currency: '₹',
    status: 'Atelier Masterwork',
    statusDisclaimer: 'Demonstration allocation. Hand-spun pashm fiber from Ladakh plateau.',
    leadTime: 'Ready to Dispatch',
    description: 'Reversible stole weaving undyed natural warm ivory Changthangi pashmina with an ultra-fine champagne gold metallic zari warp, providing dual-faced luminous luster.',
    fiberPurity: '85% Grade-A Pashmina Wool, 15% Metallic Zari Yarns',
    weaveType: 'Interlocked Diamond Twill Weave (Chashm-e-Bulbul)',
    origin: 'Ladakh High-Plateau / Srinagar Guild Lineage',
    warpDensity: '125 TPI',
    artisanHours: '48 Hours (Estimated Guild Craft Benchmark)',
    colors: [
      { id: 'c-14', name: 'Natural Warm Ivory', hex: '#fef9f0' },
      { id: 'c-15', name: 'Smoked Espresso', hex: '#30231f' }
    ],
    sizes: ['Reversible Shawl (220cm × 80cm)'],
    curatorTags: ['material-cashmere', 'form-fluid', 'heritage-ceremony'],
    image: PRODUCT_ASSET_MAP['et-07'].primary.src,
    macroImage: PRODUCT_ASSET_MAP['et-07'].macro?.src || PRODUCT_ASSET_MAP['et-07'].primary.src,
    imageAlt: 'Reversible drape of the High-Altitude Hand-Spun Pashmina Stole',
    macroImageAlt: 'Macro view of interlocking Chashm-e-Bulbul diamond twill weave of fine pashm and zari',
    imageCredit: 'EverThread Atelier Archival Study',
    gallery: PRODUCT_ASSET_MAP['et-07'].gallery,
    relatedStorySlugs: ['the-art-of-the-drape', 'the-living-loom'],
    careInstructions: [
      'Store wrapped in clean white cotton muslin with dried neem leaves.',
      'Dry clean by specialist cashmere and heirloom textile conservator only.',
      'Steam gently from 6 inches distance; do not press iron on metallic zari lines.'
    ],
    contentFlags: {
      isEditionFictional: true,
      isHoursEstimate: true,
      isAtelierConcept: true,
      unsupportedClaims: [
        '48 hours is a guild craft estimate, not an audited time log.',
        'Edition of 35 is an illustrative exclusivity cap.'
      ]
    }
  }
];

// Utility lookups with full backward-compatibility for legacy slugs
export const getProductById = (id: string): Product | undefined => {
  return PRODUCTS.find(p => p.id === id);
};

export const getProductBySlug = (slug: string): Product | undefined => {
  return PRODUCTS.find(
    p => p.slug === slug || 
         p.id === slug ||
         (slug === 'the-sylvan-mulberry-silk-trench' && p.id === 'et-01') ||
         (slug === 'the-drape-collar-pashmina-overcoat' && p.id === 'et-02') ||
         (slug === 'ivory-structured-raw-silk-coat' && p.id === 'et-02') ||
         (slug === 'the-architectonic-zari-waistcoat' && p.id === 'et-03') ||
         (slug === 'the-pleated-indigo-chanderi-tunic' && p.id === 'et-04') ||
         (slug === 'the-madder-dyed-bias-robe' && p.id === 'et-05') ||
         (slug === 'oxblood-structured-box-calf-leather-bag' && p.id === 'et-05') ||
         (slug === 'the-kadwa-brocade-ceremony-cape' && p.id === 'et-06') ||
         (slug === 'handspun-mulberry-silk-scarf-burgundy' && p.id === 'et-06') ||
         (slug === 'fine-pashmina-zari-reversible-stole-ivory' && p.id === 'et-07') ||
         (slug === 'fine-pashmina-and-zari-reversible-stole-in-ivory' && p.id === 'et-07')
  );
};
