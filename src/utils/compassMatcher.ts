/**
 * EverThread Thread Compass — Deterministic Recommendation Engine
 * Pure attribute-based matching function grounded strictly in actual catalogue data.
 * Zero AI / ML claims: transparent, reproducible rule-based curator logic.
 */

import { Product } from '../types/catalog.ts';
import { PRODUCTS } from '../data/products.ts';
import { getStoryBySlug } from '../data/stories.ts';

export interface CompassPreferences {
  fabric?: string;    // 'wild-silk' | 'merino-wool' | 'pashmina' | 'box-calf' | 'chanderi-cotton'
  movement?: string;  // 'architectural' | 'fluid'
  craft?: string;     // 'kadwa-zari' | 'matka-weave' | 'indigo-resist' | 'saddle-stitch' | 'diamond-twill'
  story?: string;     // 'varanasi' | 'drape' | 'surface' | 'architecture' | aliases
}

export interface MatchReason {
  category: 'Fabric' | 'Movement' | 'Craft' | 'Story';
  description: string;
}

export interface RecommendationResult {
  product: Product;
  score: number;
  matchReasons: MatchReason[];
  relatedStoryTitle?: string;
  relatedStorySlug?: string;
}

export interface PreferenceOption {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  tag: string;
}

export const FABRIC_OPTIONS: PreferenceOption[] = [
  {
    id: 'wild-silk',
    title: 'Wild & Raw Sericulture Silk',
    subtitle: 'Tactile slub, structural body, natural sheen',
    description: 'Combed wild Tussar and Matka raw silks retaining organic texture and natural filament strength.',
    tag: 'Silk Lineage'
  },
  {
    id: 'merino-wool',
    title: 'Fine Merino & Wild Mulberry Blend',
    subtitle: 'Crisp architectural drape, natural thermal memory',
    description: '70% fine merino wool blended with 30% wild mulberry silk for structured tailoring that maintains form.',
    tag: 'Wool-Silk'
  },
  {
    id: 'pashmina',
    title: 'High-Plateau Changthangi Pashmina',
    subtitle: 'Weightless loft, microscopic warmth',
    description: 'Ultra-fine raw pashm fiber from the Ladakh high plateau, woven with fine metallic zari threads.',
    tag: 'Changthangi'
  },
  {
    id: 'box-calf',
    title: 'Vegetable-Tanned Box Calfskin Leather',
    subtitle: 'Firm grain, hand-burnished edge patina',
    description: 'Full-grain vegetable-tanned box calf leather assembled with dual-needle beeswax saddle stitching.',
    tag: 'Leathercraft'
  },
  {
    id: 'chanderi-cotton',
    title: 'Translucent Chanderi Silk-Cotton',
    subtitle: 'Breezy sheer drape, micro-pleated front apron',
    description: 'Diaphanous blend of 70% mulberry silk warp and 30% organic desi cotton weft dyed in fermented plant-indigo.',
    tag: 'Silk-Cotton'
  }
];

export const MOVEMENT_OPTIONS: PreferenceOption[] = [
  {
    id: 'architectural',
    title: 'Architectural & Tailored Presence',
    subtitle: 'Structured lines, razor-sharp shoulder posture, unbelted clarity',
    description: 'Sculptural silhouettes engineered to hold defined form without synthetic glued interfacings.',
    tag: 'Form: Structured'
  },
  {
    id: 'fluid',
    title: 'Fluid Bias & Radial Drape',
    subtitle: 'Uncut cloth, zero-waste gravitational flow, weightless motion',
    description: 'Silhouettes honoring continuous bias lines that breathe and expand dynamically with the wearer’s movement.',
    tag: 'Form: Fluid'
  }
];

export const CRAFT_OPTIONS: PreferenceOption[] = [
  {
    id: 'kadwa-zari',
    title: 'Varanasi Kadwa Zari Brocade',
    subtitle: 'Subterranean pit-loom weaving, zero floating reverse wefts',
    description: 'Each metallic gold or silver motif is hand-engraved individually into the weft without floating threads at the reverse.',
    tag: 'Pit-Loom Kadwa'
  },
  {
    id: 'matka-weave',
    title: 'Hand-Spun Matka Plain Weave',
    subtitle: 'Hand-reeled wild yarns, slow foot-treadle balance',
    description: 'Yarns spun by hand from uneven wild sericulture filaments, retaining tactile slubs and soft cocoon hand.',
    tag: 'Hand-Spun Weave'
  },
  {
    id: 'indigo-resist',
    title: 'Fermented Plant-Indigo & Pleating',
    subtitle: 'Living bacterial vats, hand-carved mother-of-pearl closures',
    description: 'Living botanical indigo fermentation creating deep natural hues with precision knife-pleated cloth architecture.',
    tag: 'Resist Dyeing'
  },
  {
    id: 'saddle-stitch',
    title: 'Dual-Needle Beeswax Saddle Stitching',
    subtitle: 'Cast antique brass hardware, beeswax-coated linen thread',
    description: 'Two needles passing through each awl hole simultaneously at 7 stitches per inch to ensure durable, unravelling seams.',
    tag: 'Hand-Saddle Stitch'
  },
  {
    id: 'diamond-twill',
    title: 'Chashm-e-Bulbul Interlocking Diamond Twill',
    subtitle: 'Traditional bird’s-eye diamond twill weaving',
    description: 'Four-shaft loomed diamond twill that yields reversible dual-faced luster with metallic zari yarns.',
    tag: 'Diamond Twill'
  }
];

export const STORY_OPTIONS: PreferenceOption[] = [
  {
    id: 'varanasi',
    title: 'The Living Loom (Folio 1.1)',
    subtitle: 'Varanasi subterranean pit looms & Kadwa zari lineage',
    description: 'Documenting the acoustic rhythm of pit-looms sinking into clay earth to protect delicate zari threads from drying.',
    tag: 'Folio 1.1'
  },
  {
    id: 'drape',
    title: 'The Art of the Drape (Folio 1.2)',
    subtitle: 'Radial bias geometry, zero-waste cloth & fluid equilibrium',
    description: 'Examining uncut cloth traditions that use gravity as a structural seam, allowing garments to breathe with the body.',
    tag: 'Folio 1.2'
  },
  {
    id: 'surface',
    title: 'The Language of the Surface (Folio 1.3)',
    subtitle: 'Ahimsa wild silk tactility & natural botanical dyes',
    description: 'Documenting tactile surface scripts, non-violent silk harvesting after the moth departs, and botanical color memory.',
    tag: 'Folio 1.3'
  },
  {
    id: 'architecture',
    title: 'The Architecture of a Garment (Folio 1.4)',
    subtitle: 'Interior tailoring anatomy, hand-bound seams & structural longevity',
    description: 'Examines pure interior finishing: hand-mitered silk organza tape, floating canvas, and zero synthetic glues.',
    tag: 'Folio 1.4'
  }
];

/**
 * Deterministic recommendation matching function
 */
export function matchProductsToPreferences(
  preferences: CompassPreferences,
  catalogue: Product[] = PRODUCTS,
  options?: { minScore?: number }
): RecommendationResult[] {
  const { fabric, movement, craft, story } = preferences;
  const minScore = options?.minScore ?? 1;

  // If no preferences selected at all, return empty
  if (!fabric && !movement && !craft && !story) {
    return [];
  }

  const results: RecommendationResult[] = [];

  catalogue.forEach(product => {
    let score = 0;
    const matchReasons: MatchReason[] = [];

    // --- 1. Fabric Match ---
    if (fabric) {
      if (fabric === 'wild-silk') {
        if (product.id === 'et-01') {
          score += 15;
          matchReasons.push({
            category: 'Fabric',
            description: 'Features 30% Wild Mulberry Silk blended with 70% Fine Merino Wool for structured lustre.'
          });
        } else if (product.id === 'et-02') {
          score += 25;
          matchReasons.push({
            category: 'Fabric',
            description: 'Woven entirely from 100% Hand-Spun Matka Raw Silk with natural slub texture.'
          });
        } else if (product.id === 'et-03') {
          score += 25;
          matchReasons.push({
            category: 'Fabric',
            description: 'Crafted from 100% Wild Tussar Silk with fine metallic zari.'
          });
        } else if (product.id === 'et-04') {
          score += 15;
          matchReasons.push({
            category: 'Fabric',
            description: 'Blends 70% Mulberry Silk with 30% Desi Organic Cotton in a translucent weave.'
          });
        } else if (product.id === 'et-06') {
          score += 20;
          matchReasons.push({
            category: 'Fabric',
            description: 'Woven from 100% Hand-Reeled Mulberry Silk with fine zari edge.'
          });
        }
      } else if (fabric === 'merino-wool') {
        if (product.id === 'et-01') {
          score += 30;
          matchReasons.push({
            category: 'Fabric',
            description: 'Tailored with 70% Fine Merino Wool providing structural memory and warmth.'
          });
        }
      } else if (fabric === 'pashmina') {
        if (product.id === 'et-07') {
          score += 30;
          matchReasons.push({
            category: 'Fabric',
            description: 'Woven from 85% Grade-A Changthangi Pashmina Wool and 15% Metallic Zari Yarns from the Ladakh high plateau.'
          });
        }
      } else if (fabric === 'box-calf') {
        if (product.id === 'et-05') {
          score += 30;
          matchReasons.push({
            category: 'Fabric',
            description: 'Sculpted from 100% vegetable-tanned French box calfskin with beeswax edge finishing.'
          });
        }
      } else if (fabric === 'chanderi-cotton') {
        if (product.id === 'et-04') {
          score += 30;
          matchReasons.push({
            category: 'Fabric',
            description: 'Traditional Chanderi handloom weave harmonizing 30% Desi Organic Cotton with 70% Mulberry Silk.'
          });
        }
      }
    }

    // --- 2. Movement / Form Match ---
    if (movement) {
      if (movement === 'architectural') {
        if (product.curatorTags.includes('form-structured') || product.id === 'et-01' || product.id === 'et-02' || product.id === 'et-03' || product.id === 'et-05') {
          score += 20;
          const detail = product.category === 'Accessories' 
            ? 'Rigid box silhouette engineered with firm architectural geometry.'
            : 'Sculpted razor-sharp silhouette that maintains crisp posture without synthetic fusing.';
          matchReasons.push({
            category: 'Movement',
            description: detail
          });
        }
      } else if (movement === 'fluid') {
        if (product.curatorTags.includes('form-fluid') || product.id === 'et-04' || product.id === 'et-06' || product.id === 'et-07') {
          score += 20;
          matchReasons.push({
            category: 'Movement',
            description: 'Fluid, unstitched draping behavior that flows naturally with gravitational breath and movement.'
          });
        }
      }
    }

    // --- 3. Hands / Craft Match ---
    if (craft) {
      if (craft === 'kadwa-zari') {
        if (product.id === 'et-01' || product.id === 'et-03') {
          score += 25;
          const detail = product.id === 'et-03'
            ? 'Interlocking Kadwa Zari embroidery woven directly onto raw tussar rib without reverse floating threads.'
            : 'Features asymmetric hand-loomed brocade facing with Kadwa technique lapel interior.';
          matchReasons.push({
            category: 'Craft',
            description: detail
          });
        }
      } else if (craft === 'matka-weave') {
        if (product.id === 'et-02') {
          score += 25;
          matchReasons.push({
            category: 'Craft',
            description: 'Traditional plain weave executed with hand-spun Matka raw silk yarns.'
          });
        }
      } else if (craft === 'indigo-resist') {
        if (product.id === 'et-04') {
          score += 25;
          matchReasons.push({
            category: 'Craft',
            description: 'Subjected to living bacterial indigo fermentation and detailed front micro-pleating.'
          });
        }
      } else if (craft === 'saddle-stitch') {
        if (product.id === 'et-05') {
          score += 25;
          matchReasons.push({
            category: 'Craft',
            description: 'Entirely stitched by hand using two needles and beeswax-coated linen thread at 7 stitches per inch.'
          });
        }
      } else if (craft === 'diamond-twill') {
        if (product.id === 'et-07') {
          score += 25;
          matchReasons.push({
            category: 'Craft',
            description: 'Interlocked Chashm-e-Bulbul diamond twill weave pairing metallic zari yarns with pure pashmina.'
          });
        } else if (product.id === 'et-06') {
          score += 15;
          matchReasons.push({
            category: 'Craft',
            description: 'Featherweight twill gauze with hand-rolled handkerchief hems and fine zari selvedge.'
          });
        }
      }
    }

    // --- 4. Story Match (Direct Folio Mapping with Backwards-Compatible Aliases) ---
    if (story) {
      const isVaranasi = story === 'varanasi' || story === 'the-living-loom';
      const isDrape = story === 'drape' || story === 'the-art-of-the-drape' || story === 'himalayan';
      const isSurface = story === 'surface' || story === 'the-language-of-the-surface' || story === 'murshidabad';
      const isArchitecture = story === 'architecture' || story === 'the-architecture-of-a-garment' || story === 'minimalist-atelier' || story === 'chanderi-vat';

      if (isVaranasi) {
        if (product.relatedStorySlugs?.includes('the-living-loom') || product.id === 'et-01' || product.id === 'et-03' || product.id === 'et-07') {
          score += 20;
          matchReasons.push({
            category: 'Story',
            description: 'Connected to Folio 1.1 (The Living Loom), exploring Varanasi pit-loom brocade traditions.'
          });
        }
      } else if (isDrape) {
        if (product.relatedStorySlugs?.includes('the-art-of-the-drape') || product.id === 'et-02' || product.id === 'et-04' || product.id === 'et-07') {
          score += 20;
          matchReasons.push({
            category: 'Story',
            description: 'Connected to Folio 1.2 (The Art of the Drape), examining uncut radial geometry and fluid bias suspension.'
          });
        }
      } else if (isSurface) {
        if (product.relatedStorySlugs?.includes('the-language-of-the-surface') || product.id === 'et-01' || product.id === 'et-06') {
          score += 20;
          matchReasons.push({
            category: 'Story',
            description: 'Connected to Folio 1.3 (The Language of the Surface), exploring Ahimsa silk tactility and botanical dyes.'
          });
        }
      } else if (isArchitecture) {
        if (product.relatedStorySlugs?.includes('the-architecture-of-a-garment') || product.id === 'et-01' || product.id === 'et-04' || product.id === 'et-05') {
          score += 20;
          matchReasons.push({
            category: 'Story',
            description: 'Connected to Folio 1.4 (The Architecture of a Garment), examining interior hand-bound organza finishes.'
          });
        }
      }
    }

    // Only include products that genuinely matched at least one preference and meet threshold
    if (score >= minScore && matchReasons.length > 0) {
      // Find related archive story if available
      let relatedStoryTitle: string | undefined;
      let relatedStorySlug: string | undefined;

      if (product.relatedStorySlugs && product.relatedStorySlugs.length > 0) {
        const storyObj = getStoryBySlug(product.relatedStorySlugs[0]);
        if (storyObj) {
          relatedStoryTitle = storyObj.title;
          relatedStorySlug = storyObj.slug;
        }
      }

      results.push({
        product,
        score,
        matchReasons,
        relatedStoryTitle,
        relatedStorySlug
      });
    }
  });

  // Sort deterministically:
  // Primary: highest match score first
  // Secondary (tie-breaker): original catalogue index in PRODUCTS (ET-01 before ET-02 etc.)
  results.sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    const indexA = catalogue.findIndex(p => p.id === a.product.id);
    const indexB = catalogue.findIndex(p => p.id === b.product.id);
    return indexA - indexB;
  });

  return results;
}
