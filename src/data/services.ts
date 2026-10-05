import { img } from '../assets'

/* ------------------------------------------------------------------
   Services — three categories (Audit, Construction, Design), each with its own services.
   Category and service names follow SPC's previous website. The summaries and scope lines
   are written for this design: check them with SPC before launch.
   Images are stand-ins until SPC's own photos and BIM renders are added (see src/assets/index.ts).
   ------------------------------------------------------------------ */

export type ServiceCategoryId = 'audit' | 'construction' | 'design'

/** One service, shown as a card on the Services page and listed on the home-page cards. */
export interface Service {
  /** Anchor on the Services page, e.g. /services#non-destructive-tests. */
  id: string
  /** Sheet code shown on the photo, e.g. "A-120". */
  code: string
  title: string
  /** Shorter name for compact lists (home-page cards, contact form). */
  shortTitle: string
  summary: string
  /** Three scope lines shown under the summary. */
  items: string[]
  image: string
  imageAlt: string
  /** CSS object-position for the photo crop, e.g. "center 30%". */
  objectPosition?: string
}

export interface ServiceCategory {
  id: ServiceCategoryId
  code: string
  title: string
  /** One-sentence summary used on the home-page cards. */
  summary: string
  /** Scope line under the title in the Services hero sheet index. */
  scope: string
  /** Section heading on the Services page, one string per line. */
  heading: [string, string]
  intro: string
  /** Enquiry link next to the section intro (Services page). */
  cta: string
  /** Link label on the home-page card. */
  linkLabel: string
  /** Photo on the home-page card. */
  image: string
  imageAlt: string
  services: Service[]
}

export const serviceCategories: ServiceCategory[] = [
  {
    id: 'audit',
    code: 'A-100',
    title: 'Audit',
    summary:
      'Structural audits, stability certificates and non-destructive tests — an independent check on how an existing building is really performing.',
    scope: 'Structural audit · Certification · NDT',
    heading: ['Tested on site.', 'Certified on paper.'],
    intro:
      'Independent structural audits of existing buildings, backed by non-destructive tests on site — so decisions on repair, strengthening and certification rest on evidence, not guesswork.',
    cta: 'Request an audit',
    linkLabel: 'Explore audit',
    image: img.siteEngineers,
    imageAlt: 'Engineers in hard hats walking a construction site',
    services: [
      {
        id: 'structural-audit',
        code: 'A-110',
        title: 'Structural audit & structural certification',
        shortTitle: 'Structural audit & certification',
        summary:
          'A structured assessment of an existing building — visual inspection, testing and analysis — to establish its condition and safety, leading to a structural stability certificate and clear repair recommendations.',
        items: [
          'Visual inspection & condition survey',
          'Structural stability certificate',
          'Repair & strengthening recommendations',
        ],
        image: img.apartments,
        imageAlt: 'Facade of an occupied concrete apartment block',
        objectPosition: 'center 35%',
      },
      {
        id: 'non-destructive-tests',
        code: 'A-120',
        title: 'Non-destructive tests',
        shortTitle: 'Non-destructive tests',
        summary:
          'On-site tests that gauge the strength and quality of concrete and locate its reinforcement — without cutting into or damaging the structure.',
        items: ['Rebound hammer test', 'Cover meter test', 'Ultrasonic pulse velocity test'],
        image: img.concreteFrame,
        imageAlt: 'Bare concrete columns and slabs of a building frame',
        objectPosition: 'center 40%',
      },
    ],
  },
  {
    id: 'construction',
    code: 'C-200',
    title: 'Construction',
    summary:
      'Public health and HVAC & mechanical engineering — sized from first principles and routed around the structure, not through it.',
    scope: 'Public health · HVAC · Mechanical',
    heading: ['Sized to the load.', 'Routed around the frame.'],
    intro:
      'Public health and HVAC & mechanical systems designed alongside the structure — so shafts, plant rooms and ceiling voids are sized for what has to fit in them.',
    cta: 'Discuss a services scope',
    linkLabel: 'Explore construction',
    image: img.craneFrame,
    imageAlt: 'Building frame under construction with tower cranes overhead',
    services: [
      {
        id: 'public-health-engineering',
        code: 'C-210',
        title: 'Public health engineering',
        shortTitle: 'Public health engineering',
        summary:
          'Water supply, drainage and treatment systems sized for how the building will be used, and routed in step with the structure.',
        items: ['Water supply & storage', 'Drainage & rainwater systems', 'STP & WTP sizing'],
        image: img.plantRoom,
        imageAlt: 'Pump room with a motor and stainless-steel pipework',
      },
      {
        id: 'hvac-mechanical-engineering',
        code: 'C-220',
        title: 'HVAC and mechanical engineering',
        shortTitle: 'HVAC & mechanical',
        summary:
          'Air-conditioning and ventilation designed from heat-load calculations up, with ducts, plant and equipment coordinated with the frame.',
        items: ['Heat load calculations', 'System selection & duct design', 'Car park & kitchen ventilation'],
        image: img.hvacUnit,
        imageAlt: 'Air-handling unit and ductwork suspended under a glazed roof',
      },
    ],
  },
  {
    id: 'design',
    code: 'D-300',
    title: 'Design',
    summary:
      'Fire and life safety, electrical, and gas and utility systems — designed by our in-house design division and coordinated in one BIM model.',
    scope: 'Fire · Electrical · Gas & utility · BIM',
    heading: ['Designed together.', 'Coordinated in one model.'],
    intro:
      'Fire and life safety, electrical, and gas and utility systems from our design division, built into one BIM model — so services are coordinated with each other and with the frame before anything reaches site.',
    cta: 'Discuss a design scope',
    linkLabel: 'Explore design',
    image: img.drafting,
    imageAlt: 'Engineer marking up a drawing at a desk',
    services: [
      {
        id: 'fire-life-safety',
        code: 'D-310',
        title: 'Fire and life safety system',
        shortTitle: 'Fire & life safety',
        summary:
          'Detection, protection and life-safety systems laid out with the building — from sprinkler and hydrant networks to fire alarms and pump rooms.',
        items: ['Sprinkler & hydrant systems', 'Fire alarm & detection', 'Pump room & tank sizing'],
        image: img.fireCeiling,
        imageAlt: 'Concrete soffit with red fire sprinkler mains and cable trays',
      },
      {
        id: 'electrical-engineering',
        code: 'D-320',
        title: 'Electrical engineering',
        shortTitle: 'Electrical engineering',
        summary:
          'Power, lighting and low-voltage systems, from load calculations and single-line diagrams to coordinated layouts.',
        items: ['Load calculations & SLDs', 'Lighting & small power layouts', 'ELV: CCTV, access control & data'],
        image: img.panelTesting,
        imageAlt: 'Electrician testing breakers in a distribution panel',
      },
      {
        id: 'gas-utility-distribution',
        code: 'D-330',
        title: 'Gas & utility distribution system',
        shortTitle: 'Gas & utility distribution',
        summary:
          'Gas and utility piping networks, sized for demand and routed with the structure and the other services in mind.',
        items: ['Gas piping & distribution', 'Utility piping networks', 'Pipe sizing & routing'],
        image: img.officeServices,
        imageAlt: 'Office floor with exposed pipes and ducts below the slab',
      },
      {
        id: 'bim-modeling',
        code: 'D-340',
        title: 'BIM modeling',
        shortTitle: 'BIM modeling',
        summary:
          'Building information models that bring the structure and every service into one coordinated 3D model — for clash detection, quantities and drawings.',
        items: ['3D models of structure & services', 'Clash detection & coordination', 'Drawings & quantities from the model'],
        image: img.drawingsDesk,
        imageAlt: 'Engineer working on technical drawings at a desk, seen from above',
      },
      {
        id: 'design-division',
        code: 'D-350',
        title: 'SP Consulting Services\u00a0– Design Division',
        shortTitle: 'Design division',
        summary:
          'Our in-house design team — taking projects from concept to construction drawings, with every discipline coordinated in one place.',
        items: ['Concept & scheme design', 'Multi-disciplinary coordination', 'Construction drawing sets'],
        image: img.modernBuilding,
        imageAlt: 'Contemporary building with an angular glass facade',
      },
    ],
  },
]

/** Every service in page order — used for the contact form's "Services needed" options. */
export const allServices: Service[] = serviceCategories.flatMap((c) => c.services)

/* ------------------------------------------------------------------
   Engineering disciplines on project case studies ("Scope by discipline" and the hero tags).
   ------------------------------------------------------------------ */

export type DisciplineId = 'structural' | 'mep' | 'supervision'

export interface Discipline {
  id: DisciplineId
  code: string
  title: string
}

export const disciplines: Discipline[] = [
  { id: 'structural', code: 'S-100', title: 'Structural design' },
  { id: 'mep', code: 'M-200', title: 'MEP design' },
  { id: 'supervision', code: 'C-300', title: 'Site supervision' },
]

/** Codes the practice designs to (confirm with the client). */
export const designCodes = ['IS 456', 'IS 800', 'IS 875', 'IS 1893', 'IS 13920', 'NBC 2016', 'ECBC 2017']

/* ------------------------------------------------------------------
   Services page — engagement options and FAQs.
   Copy comes from the approved Services design; [bracketed] text is a placeholder.
   ------------------------------------------------------------------ */

export interface EngagementOption {
  id: 'design' | 'design-supervision' | 'review'
  /** e.g. "Option A". */
  option: string
  /** Sheets / scope covered, e.g. "C-200 · D-300". */
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
    scope: 'C-200 · D-300',
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
    scope: 'C-200 · D-300 · Site',
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
    scope: 'A-100 · Proof check',
    title: 'Review & audit',
    audience:
      'Owners, developers and apartment associations who need an independent check of a design or an existing building.',
    included: [
      'Proof checking & design vetting',
      'Structural audit of existing buildings',
      'Non-destructive tests & condition reports',
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
