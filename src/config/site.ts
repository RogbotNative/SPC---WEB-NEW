/**
 * Company details — edit this ONE file to replace the placeholders across the whole site.
 * Anything in [square brackets] is a placeholder waiting for real information.
 */
export const site = {
  name: 'SP Consulting Services',
  shortName: 'SPC',
  tagline: 'Engineered To Simplify',
  descriptor: 'Structural & MEP Consultants',
  url: 'https://www.yourdomain.com', // used for canonical/OG tags

  contact: {
    phoneDisplay: '[+91 00000 00000]',
    phoneHref: 'tel:+910000000000',
    email: '[hello@yourdomain.com]',
    emailHref: 'mailto:hello@yourdomain.com',
    careersEmail: '[careers@yourdomain.com]',
    careersEmailHref: 'mailto:careers@yourdomain.com',
    addressLines: ['[Office address, line 1]', '[Area, City – PIN]'],
    hours: '[Mon–Sat, 9:30–18:30]',
    city: '[City]',
    replyTime: '[2 working days]',
    /** Google Maps "embed" URL (Share → Embed a map → copy the src). Leave empty to show the blueprint placeholder. */
    mapEmbedUrl: '',
    /** Link for the "Get directions" button. */
    directionsUrl: '',
  },

  /** Headline numbers on the home page. */
  stats: [
    { value: '[00]+', label: 'Years in practice' },
    { value: '[000]+', label: 'Projects delivered' },
    { value: '[0.0]M', label: 'Sq ft engineered' },
    { value: '[00]', label: 'Engineers on the team' },
  ],

  testimonial: {
    quote:
      '[A short quote from a client or architect about working with SPC — one or two sentences, in their words.]',
    attribution: '[Name] — [Role], [Company]',
  },

  /** Number of client-logo slots shown on the home page (replace with real logos in Home.tsx). */
  clientLogoSlots: 6,

  forms: {
    /**
     * POST endpoint for the contact form (e.g. Formspree, Getform, Web3Forms or your own API).
     * Leave empty during development: the form will validate and show its success state without sending.
     */
    contactEndpoint: '',
    newsletterEndpoint: '',
  },
} as const

export const nav = [
  { to: '/services', label: 'Services' },
  { to: '/projects', label: 'Projects' },
  { to: '/process', label: 'Process' },
  { to: '/about', label: 'About' },
  { to: '/insights', label: 'Insights' },
  { to: '/careers', label: 'Careers' },
] as const
