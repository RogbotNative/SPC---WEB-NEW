export interface Stage {
  num: string
  title: string
  /** Short description used on the Home page timeline. */
  short: string
  /** In-page anchor id on the Process page, e.g. "stage-1". */
  id: string
  /** The headline deliverable shown in the Process hero's stage index. */
  keyOutput: string
  /** Paragraph under the stage title on the Process page. */
  summary: string
  /** Mono note next to the stage progress bar. Keep [placeholders] until real figures are confirmed. */
  duration: string
  /** "What we do" column. */
  weDo: string[]
  /** "What we need from you" column. */
  weNeed: string[]
  /** "What you receive" column — each one is a document/deliverable. */
  youReceive: string[]
}

export const stages: Stage[] = [
  {
    num: '01',
    title: 'Brief & site study',
    short:
      'We study the architectural scheme, soil report and site constraints, and agree the design basis with you.',
    id: 'stage-1',
    keyOutput: 'Design basis',
    summary:
      'We study the architect’s drawings, walk the site and read the soil report before anything is sized. Then we agree a design basis — loads, codes, materials and performance — that every later drawing depends on.',
    duration: 'Typical duration [0–0] weeks',
    weDo: [
      'Review architectural drawings',
      'Site visit and constraints check',
      'Study the soil investigation report',
      'Agree design loads and codes',
      'Fix materials and performance criteria',
    ],
    weNeed: [
      'Architectural drawings (DWG)',
      'Soil investigation report',
      'Site survey',
      'Local bye-law and approval requirements',
    ],
    youReceive: ['Design basis report', 'Scope, fee and programme', 'Inputs checklist'],
  },
  {
    num: '02',
    title: 'Scheme design',
    short:
      'Structural systems and MEP concepts are compared for cost, speed and space — then frozen together.',
    id: 'stage-2',
    keyOutput: 'Scheme options',
    summary:
      'We compare structural systems and MEP concepts for cost, speed and the space they take up. You choose with the trade-offs laid out on one page, and the scheme is frozen for both disciplines at once.',
    duration: 'Typical duration [0–0] weeks',
    weDo: [
      'Compare beam-slab, flat slab and PT floors',
      'HVAC, electrical, plumbing and fire concepts',
      'Preliminary column and core sizes',
      'Size shafts and plant rooms',
    ],
    weNeed: ['Architect’s scheme drawings', 'Your brief on services and performance', 'Budget range'],
    youReceive: ['Options note: cost and space trade-offs', 'Preliminary member sizes', 'Shaft and plant room layout'],
  },
  {
    num: '03',
    title: 'Detailed design',
    short: 'Analysis, sizing and full coordination between structure and services, checked sheet by sheet.',
    id: 'stage-3',
    keyOutput: 'Calculations',
    summary:
      'We analyse and design the structure, and size every service from its load calculations. Before anything is drawn for issue, structure and services are checked against each other, sheet by sheet.',
    duration: 'Typical duration [0–0] weeks',
    weDo: [
      'Analysis and design in ETABS / SAFE [confirm]',
      'Reinforcement detailing',
      'MEP load calculations',
      'Equipment selection',
      'Clash checks between structure and services',
    ],
    weNeed: ['Frozen architectural plans', 'Equipment and make preferences', 'Sign-off on the frozen scheme'],
    youReceive: ['Design calculations', 'Coordinated structure and MEP layouts', 'Clash resolution record'],
  },
  {
    num: '04',
    title: 'GFC drawings & BOQ',
    short: 'Good-for-construction drawings, specifications and quantities your contractor can price and build.',
    id: 'stage-4',
    keyOutput: 'GFC set',
    summary:
      'We issue good-for-construction drawings, specifications and quantities your contractor can price and build from. During tendering, we answer bidders’ technical queries so every price covers the same scope.',
    duration: 'Typical duration [0–0] weeks',
    weDo: [
      'GFC structural drawings',
      'Bar bending schedules',
      'MEP layouts, single-line diagrams and schematics',
      'Specifications and BOQ',
      'Tender support',
    ],
    weNeed: ['Tender format', 'Preferred makes list', 'Tender programme'],
    youReceive: ['GFC drawing set', 'BOQ and specifications', 'Tender queries answered'],
  },
  {
    num: '05',
    title: 'Site supervision',
    short: 'Inspections at every critical stage, through testing and commissioning to handover.',
    id: 'stage-5',
    keyOutput: 'Handover dossier',
    summary:
      'Our engineers inspect the work at every critical stage — reinforcement before each pour, services before they are closed in. Supervision continues through testing and commissioning to handover.',
    duration: 'Through construction to handover',
    weDo: [
      'Stage inspections',
      'Reinforcement checks before every pour',
      'RFI and shop drawing responses',
      'Witness testing and commissioning',
      'As-built review and handover',
    ],
    weNeed: ['Contractor’s construction schedule', 'Site access for our engineers', 'Pour notice [24/48] hours ahead'],
    youReceive: ['Inspection reports', 'Pour approvals', 'NCR log', 'Handover dossier'],
  },
]

/** Coordination points on the Process page (Fig. 01 pins match these numbers). */
export const coordinationPoints = [
  {
    title: 'Beam penetrations agreed early',
    text: 'Sleeve sizes and positions are fixed on the structural drawings.',
  },
  {
    title: 'Shafts sized with their services',
    text: 'Shaft and riser sizes are set by the ducts and pipes they carry.',
  },
  {
    title: 'Clash checks before GFC',
    text: 'Structure and services are checked together before issue.',
  },
]
