import { img } from '../assets'

export type DisciplineId = 'structural' | 'mep' | 'supervision'

export interface Discipline {
  id: DisciplineId
  code: string
  title: string
  /** One-sentence summary used on cards (Home). */
  summary: string
  /** Four headline capabilities used on cards (Home). */
  highlights: string[]
  linkLabel: string
  image: string
  imageAlt: string
}

export const disciplines: Discipline[] = [
  {
    id: 'structural',
    code: 'S-100',
    title: 'Structural design',
    summary:
      'RCC, structural steel and post-tensioned systems — analysed for gravity, wind and seismic loads, and detailed for how they will actually be built.',
    highlights: [
      'Analysis & design',
      'Foundations & soil coordination',
      'Structural audits & retrofits',
      'Proof checking & design vetting',
    ],
    linkLabel: 'Explore structural',
    image: img.rebarColumns,
    imageAlt: 'Reinforcement cages for concrete columns on site',
  },
  {
    id: 'mep',
    code: 'M-200',
    title: 'MEP design',
    summary:
      'HVAC, electrical, plumbing and fire protection — sized from first principles and routed around the structure, not through it.',
    highlights: [
      'HVAC & ventilation',
      'Electrical, lighting & ELV',
      'Plumbing & public health',
      'Fire detection & protection',
    ],
    linkLabel: 'Explore MEP',
    image: img.fireCeiling,
    imageAlt: 'Concrete ceiling with fire sprinkler pipes and cable trays',
  },
  {
    id: 'supervision',
    code: 'C-300',
    title: 'Site supervision',
    summary:
      'Periodic or full-time supervision, so what is poured, fixed and commissioned matches what was designed.',
    highlights: [
      'Inspections & quality audits',
      'Reinforcement & shuttering checks',
      'Shop drawing & RFI review',
      'Testing, commissioning & handover',
    ],
    linkLabel: 'Explore supervision',
    image: img.siteEngineers,
    imageAlt: 'Engineers in hard hats walking a construction site',
  },
]

/** Codes the practice designs to (confirm with the client). */
export const designCodes = ['IS 456', 'IS 800', 'IS 875', 'IS 1893', 'IS 13920', 'NBC 2016', 'ECBC 2017']

/* ------------------------------------------------------------------
   Services page — per-discipline detail, engagement options and FAQs.
   Copy comes from the approved Services design; [bracketed] text is a placeholder.
   ------------------------------------------------------------------ */

/** One row in a "What we do" / "What you receive" list. */
export interface ServiceLine {
  label: string
  /** Optional right-aligned mono note, e.g. when it happens ("Before each pour"). */
  note?: string
}

/** MEP sub-discipline (M-210 … M-240). */
export interface MepSystem {
  code: string
  title: string
  items: string[]
}

export interface DisciplineDetail {
  id: DisciplineId
  code: string
  /** Section label next to the gridline bubble. */
  label: string
  /** Scope line under the title in the hero sheet index. */
  scope: string
  /** Section heading, one string per line. */
  heading: [string, string]
  intro: string
  figure: { image: string; alt: string; caption: string; objectPosition?: string }
  /** "What we do" list (structural, supervision). */
  services?: ServiceLine[]
  /** "What we do" sub-systems (MEP). */
  systems?: MepSystem[]
  /** "What you receive" list. */
  deliverables: ServiceLine[]
  /** Short coordination note shown under the deliverables. */
  note?: string
}

export const mepSystems: MepSystem[] = [
  {
    code: 'M-210',
    title: 'HVAC & ventilation',
    items: ['Heat load calculations', 'System selection & duct design', 'Car park & kitchen ventilation'],
  },
  {
    code: 'M-220',
    title: 'Electrical, lighting & ELV',
    items: ['Load calculations & SLDs', 'Lighting & small power layouts', 'ELV: CCTV, access control & data'],
  },
  {
    code: 'M-230',
    title: 'Plumbing & public health',
    items: ['Water supply & storage', 'Drainage & rainwater systems', 'STP & WTP sizing'],
  },
  {
    code: 'M-240',
    title: 'Fire detection & protection',
    items: ['Sprinkler & hydrant systems', 'Fire alarm & detection', 'Pump room & tank sizing'],
  },
]

export const disciplineDetails: Record<DisciplineId, DisciplineDetail> = {
  structural: {
    id: 'structural',
    code: 'S-100',
    label: 'Structural design',
    scope: 'RCC · Steel · Post-tensioned',
    heading: ['Designed to stand.', 'Detailed to build.'],
    intro:
      'RCC, structural steel and post-tensioned frames, analysed for gravity, wind and seismic loads — sized for economy, detailed for the site, and checked against the Indian Standards before a sheet is issued.',
    figure: {
      image: img.rebarColumns,
      alt: 'Reinforcement cages for concrete columns, with workers on site',
      caption: 'Fig. 01 — Column reinforcement cages',
    },
    services: [
      { label: 'RCC, structural steel & PT slabs' },
      { label: 'Gravity, wind & seismic analysis' },
      { label: 'Foundations & soil coordination' },
      { label: 'Structural audits & retrofits' },
      { label: 'Strengthening & rehabilitation' },
      { label: 'Proof checking & design vetting' },
    ],
    deliverables: [
      { label: 'Design basis report' },
      { label: 'Analysis & design calculations' },
      { label: 'GA & reinforcement drawings' },
      { label: 'Bar bending schedules' },
      { label: 'Structural BOQ' },
    ],
  },
  mep: {
    id: 'mep',
    code: 'M-200',
    label: 'MEP design',
    scope: 'HVAC · Electrical · Plumbing · Fire',
    heading: ['Sized to the load.', 'Routed around the frame.'],
    intro:
      'HVAC, electrical, plumbing and fire protection designed alongside the structure — so shafts, plant rooms and ceiling voids are sized for what has to fit in them.',
    figure: {
      image: img.fireCeiling,
      alt: 'Concrete soffit with red fire sprinkler mains and cable trays',
      caption: 'Fig. 02 — Fire mains and cable trays below slab',
    },
    systems: mepSystems,
    deliverables: [
      { label: 'Load calculations' },
      { label: 'Single-line diagrams' },
      { label: 'Schematics & riser diagrams' },
      { label: 'Coordinated services layouts' },
      { label: 'Equipment schedules' },
      { label: 'Specifications & BOQ' },
    ],
    note: 'Coordinated with S-100: sleeves, cut-outs and shaft sizes are fixed on the structural drawings before they are issued.',
  },
  supervision: {
    id: 'supervision',
    code: 'C-300',
    label: 'Site supervision',
    scope: 'Inspection · QA · Commissioning · PMC',
    heading: ['Built as drawn.', 'Checked at every stage.'],
    intro:
      'Periodic or full-time supervision by the engineers who designed the building. We inspect at every critical stage, so what is poured, fixed and commissioned matches what was drawn.',
    figure: {
      image: img.aerialRebar,
      alt: 'Aerial view of reinforcement mats on a slab with workers',
      caption: 'Fig. 03 — Reinforcement check before a pour',
    },
    services: [
      { label: 'Periodic or full-time supervision', note: 'Per agreed scope' },
      { label: 'Stage inspections & quality audits', note: 'Critical stages' },
      { label: 'Reinforcement & shuttering checks', note: 'Before each pour' },
      { label: 'Shop drawing & RFI review', note: 'Throughout' },
      { label: 'Testing & commissioning', note: 'MEP systems' },
      { label: 'Project management consultancy', note: 'Optional' },
    ],
    deliverables: [
      { label: 'Stage inspection reports', note: 'Each stage' },
      { label: 'Pour approvals', note: 'Each pour' },
      { label: 'Non-conformance reports', note: 'As raised' },
      { label: 'RFI log', note: 'Kept live' },
      { label: 'Testing & commissioning records', note: 'Each system' },
      { label: 'Handover dossier', note: 'At completion' },
    ],
  },
}

export interface EngagementOption {
  id: 'design' | 'design-supervision' | 'review'
  /** e.g. "Option A". */
  option: string
  /** Sheets / scope covered, e.g. "S-100 · M-200". */
  scope: string
  title: string
  /** "Who it's for". */
  audience: string
  included: string[]
  cta: string
  /** Highlighted (dark) card. */
  featured?: boolean
}

export const engagementOptions: EngagementOption[] = [
  {
    id: 'design',
    option: 'Option A',
    scope: 'S-100 · M-200',
    title: 'Design',
    audience:
      'Developers and architects with a contractor or PMC already on site, who need a complete, coordinated drawing set.',
    included: [
      'Design basis & scheme options',
      'Detailed structural and/or MEP design',
      'GFC drawings, specifications & BOQ',
      'Site queries answered from the studio',
    ],
    cta: 'Discuss a design scope',
  },
  {
    id: 'design-supervision',
    option: 'Option B',
    scope: 'S-100 · M-200 · C-300',
    title: 'Design + supervision',
    audience:
      'Owners who want one consultant accountable for the design and its execution, from first sketch to handover.',
    included: [
      'Everything in Design',
      'Stage inspections & pour approvals',
      'Shop drawing & RFI review',
      'Testing, commissioning & handover',
    ],
    cta: 'Discuss a full scope',
    featured: true,
  },
  {
    id: 'review',
    option: 'Option C',
    scope: 'Proof check · Audit',
    title: 'Review & audit',
    audience:
      'Owners, developers and apartment associations who need an independent check of a design or an existing building.',
    included: [
      'Proof checking & design vetting',
      'Structural audit of existing buildings',
      'Testing coordination & condition reports',
      'Retrofit & strengthening design',
    ],
    cta: 'Request a review',
  },
]

export interface Faq {
  id: string
  question: string
  answer: string
}

export const serviceFaqs: Faq[] = [
  {
    id: 'architect-drawings',
    question: 'Can you work from our architect’s drawings?',
    answer:
      'Yes. Most projects begin with the architect’s plans, sections and elevations, along with the soil investigation report. We review them at the brief stage and flag anything that affects the structure or services before scheme design begins.',
  },
  {
    id: 'single-discipline',
    question: 'Can we appoint you for only structure or only MEP?',
    answer:
      'Yes. Each discipline can be appointed on its own. Where another consultant handles the other discipline, we share our drawings and design assumptions with them and coordinate through the architect.',
  },
  {
    id: 'boq-tender',
    question: 'Do you prepare BOQs and tender documents?',
    answer:
      'Yes. BOQs and specifications are issued with the good-for-construction drawings, so contractors price the same scope on the same basis. Technical tender documents for structural and MEP packages can be included in the scope.',
  },
  {
    id: 'site-visits',
    question: 'How often will your engineers visit site?',
    answer:
      'Visits are tied to agreed construction stages — reinforcement before each pour, for example, and MEP installations before they are closed in. Frequency is [as agreed in scope]: periodic visits, or a full-time engineer on site.',
  },
  {
    id: 'approvals',
    question: 'Do you support statutory approvals?',
    answer:
      'We prepare the structural and MEP drawings, calculations and certificates that approval authorities typically ask for, and respond to their queries. The extent of this support depends on the project and the authority [confirm scope].',
  },
]
