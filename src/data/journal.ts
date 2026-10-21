import { JournalArticle } from '../types/catalog.ts';

export const JOURNAL_ARTICLES: JournalArticle[] = [
  {
    id: 'post-01',
    slug: 'on-unbroken-heirlooms',
    title: 'On Unbroken Heirlooms: Why Fast Fashion Is an Architectural Failure',
    subtitle: 'The Mathematical and Cultural Divergence Between Transient Novelty and Slow Tailoring',
    excerpt: 'When garments are conceived for a single season, we lose the tactile connection between human civilization and the earth. An essay on slow construction.',
    category: 'Atelier Philosophy',
    date: 'Spring Solstice Monograph',
    readTime: '6 min read',
    author: 'Editorial Atelier Board',
    authorRole: 'Curatorial Monograph Series',
    image: '/images/journal/journal-architecture-01.webp',
    imageAlt: 'Architectural tailoring details and floating canvas anatomy',
    bodyParagraphs: [
      'When an industrialized fashion supply chain plans a garment to survive ninety days before landfill consignment, its seams cannot afford honor. The modern garment factory calculates success by high-speed needle throughput per minute, using petroleum-based polyester thread, plastic interlining, and chemical fusing adhesives that stiffen cloth into artificial stillness.',
      'In contrast, heirloom construction treats a coat as architecture in motion. A hand-loomed twill silk or Changthangi pashmina does not depend on glued stays. It breathes with the ambient humidity, flexing along the bias and conforming to the contours of the body that inhabits it.',
      'To build an heirloom requires generous inlay margins: 1.5 inches of hidden cloth at side seams and hems that allow the piece to be taken in or let out over decades. When we construct clothes to outlive fleeting trend cycles, fashion ceases to be transient waste and returns to its historical place as generational heritage.'
    ],
    sources: [
      'Thorstein Veblen, The Theory of the Leisure Class: An Economic Study of Institutions.',
      'Gilles Lipovetsky, The Empire of Fashion: Dressing Modern Democracy.'
    ],
    contentFlags: {
      isEditorialPersona: true,
      unsupportedClaims: [
        'Madame Claire Vance is an illustrative author persona.'
      ]
    }
  },
  {
    id: 'post-02',
    slug: 'varanasi-at-dawn',
    title: 'Varanasi at Dawn: The Acoustics of 18th-Century Pit Looms',
    subtitle: 'A Morning Study of Subterranean Humidity, Boxwood Shuttles, and Generational Memory',
    excerpt: 'A morning journey through the sacred weavers guild where warp threads echo centuries of generational oral songs.',
    category: 'Field Journal',
    date: 'Exhibition Notes No. 04',
    readTime: '4 min read',
    author: 'Atelier Field Anthropologist',
    authorRole: 'Heritage Field Studies',
    image: '/images/craft/everthread-craft-thread-spools-01.webp',
    imageAlt: 'Traditional wooden thread spools for Varanasi handlooms',
    bodyParagraphs: [
      'Before sunrise along the banks of the Ganges in Madanpura, the acoustic signature of the city begins not with motorized traffic, but with the rhythmic, hollow clack of the wooden boxwood shuttle gliding across pit-looms.',
      'The pit loom is an ecological marvel. By excavating two feet into the cool earth, the weaver preserves a stable subterranean micro-climate. Raw silk, which would snap or become brittle in the harsh northern Indian dry heat, maintains its tensile elasticity.',
      'Here, no punched plastic punch-cards or computerized jacquards dictate the floral buti motifs. The master weaver holds the mathematical grid in memory, singing or chanting counting cadences that determine exactly which silver-gilt thread is lifted and knotted.'
    ],
    sources: [
      'Pupul Jayakar, The Earth Mother: Legends, Goddesses and Rebirth in Indian Textiles.',
      'All India Handicrafts Board Handloom Documentation Archives.'
    ],
    contentFlags: {
      isEditorialPersona: true,
      unsupportedClaims: [
        'Specific field encounters are compiled composites representing traditional Varanasi handloom workshops.'
      ]
    }
  },
  {
    id: 'post-03',
    slug: 'botanical-alchemy',
    title: 'The Botanical Alchemy of Living Indigo and Madder Root',
    subtitle: 'How Fermented Plant Vats Produce Patinas That Deepen Across Decades',
    excerpt: 'How living bacterial fermentation yields hues that age like fine burgundy, deepening rather than fading over decades of sunlight.',
    category: 'Natural Dyes',
    date: 'Material Science Archive',
    readTime: '5 min read',
    author: 'Atelier Natural Dye Research Folio',
    authorRole: 'Textile Chemistry Research',
    image: '/images/materials/journal-drape-01.webp',
    imageAlt: 'Botanical madder root and indigo dyed silk drape study',
    bodyParagraphs: [
      'Synthetic aniline dyes, invented in the late 19th century, coat the surface of fabric with uniform, flat pigment. When exposed to ultraviolet radiation over years, synthetic dye molecules break down abruptly, resulting in bleached, lifeless blotches.',
      'Living botanical dyes behave organically. A true fermented indigo vat contains living aerobic bacteria that consume natural sugars and reduce insoluble indigotin into its soluble leuco form. When cloth is lifted from the vat into the open air, oxygen acts as the catalyst, locking indigo into the core protein sheath of silk or cellulose pores of cotton.',
      'Madder root (Rubia cordifolia) provides an equally profound alchemy. Rich in alizarin and purpurin, it yields our signature deep oxblood and madder tones. Over decades of wear, sunlight does not diminish the color; it oxidizes the root tannins, creating an antique patina as rich and layered as aged wine.'
    ],
    sources: [
      'Dominique Cardon, Natural Dyes: Sources, Tradition, Technology and Science.',
      'Jenny Balfour-Paul, Indigo in the Arab World and Indian Trade Routes.'
    ],
    contentFlags: {
      isEditorialPersona: false,
      unsupportedClaims: []
    }
  }
];

export const getArticleBySlug = (slug: string): JournalArticle | undefined => {
  return JOURNAL_ARTICLES.find(a => a.slug === slug);
};
