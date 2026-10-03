import { img } from '../assets'
import type { DisciplineId } from './services'

export type Sector = 'residential' | 'commercial' | 'institutional' | 'industrial'

/** One photo in a project's case-study gallery. Caption is shown after "Fig. 0N — ". */
export interface GalleryImage {
  src: string
  alt: string
  caption: string
  objectPosition?: string
}

/** Three short bullets per discipline for the "Scope by discipline" section. */
export type ScopeBullets = Partial<Record<DisciplineId, string[]>>

/**
 * Case-study fields shown on /projects/:slug. All optional on a project — anything left out
 * falls back to `projectDetailDefaults` below, so every project always renders a complete page.
 */
export interface ProjectDetail {
  client: string
  /** Built-up area, e.g. "240,000 sq ft". */
  area: string
  /** e.g. "2B + G + 24". */
  storeys: string
  structuralSystem: string
  /** e.g. "Completed 2023" or "Under construction". */
  status: string
  /** Design codes, e.g. "IS 456 · IS 1893". */
  codes: string
  software: string
  /** e.g. "18 months". */
  duration: string
  /** Case-study headline: the engineering problem the project solved. */
  headline: string
  brief: string
  approach: string
  outcome: string
  /** Bullets per discipline. Only disciplines in the project's scope are shown. */
  scopeBullets: ScopeBullets
  /** Exactly three photos read best (one tall, two stacked). */
  gallery: GalleryImage[]
}

export interface Project extends Partial<ProjectDetail> {
  code: string
  slug: string
  name: string
  sector: Sector
  sectorLabel: string
  scope: string
  city: string
  image: string
  imageAlt: string
  /** CSS object-position for the card/hero crop, e.g. "center 40%". */
  imagePosition?: string
  /** Disciplines in SPC's scope. Derived from `scope` when omitted. */
  disciplines?: DisciplineId[]
}

/** Display names for the sector filter and labels. */
export const sectorNames: Record<Sector, string> = {
  residential: 'Residential',
  commercial: 'Commercial',
  institutional: 'Institutional',
  industrial: 'Industrial',
}

export const sectorOrder: Sector[] = ['residential', 'commercial', 'institutional', 'industrial']

/** Shared placeholder case study — replace per project by adding the same keys to its entry below. */
export const projectDetailDefaults: ProjectDetail = {
  client: '[Client name]',
  area: '[000,000] sq ft',
  storeys: '[G + 00]',
  structuralSystem: '[e.g. RCC flat slab — confirm]',
  status: '[Completed YEAR]',
  codes: 'IS 456 · IS 875 · IS 1893 · IS 13920 · NBC 2016 [confirm]',
  software: 'ETABS · SAFE · Revit [confirm]',
  duration: '[00] months',
  headline: '[Headline: the engineering problem this project solved.]',
  brief: '[Two or three sentences on what the client needed: building use, site constraints, programme.]',
  approach:
    '[Two or three sentences on the structural system chosen, how the MEP was routed around it, and why.]',
  outcome:
    '[Two or three sentences on what was delivered and what it meant on site — only results the client has approved.]',
  scopeBullets: {
    structural: [
      '[Key structural decision, e.g. transfer girders at podium level]',
      '[Foundation system, e.g. raft or piles, per the soil report]',
      '[Lateral system, e.g. shear walls checked to IS 1893]',
    ],
    mep: [
      '[HVAC approach, e.g. VRF for homes, jet fans in basements]',
      '[Public health, e.g. STP with treated water reused for flushing]',
      '[Fire protection, e.g. wet risers and sprinklers to NBC]',
    ],
    supervision: [
      '[Supervision mode, e.g. periodic visits at each slab pour]',
      '[Checks, e.g. reinforcement and shuttering sign-off before pours]',
      '[Handover, e.g. MEP testing and commissioning witnessed]',
    ],
  },
  gallery: [
    { src: img.siteColumns, alt: 'Site with cast RCC columns and workers', caption: '[Caption]' },
    { src: img.rebarColumns, alt: 'Column reinforcement cages being fixed on site', caption: '[Caption]' },
    { src: img.aerialRebar, alt: 'Aerial view of slab reinforcement with workers', caption: '[Caption]' },
  ],
}

/**
 * Project list. Names, cities and photos are placeholders — replace with real projects.
 * The slug becomes the URL: /projects/<slug>.
 */
export const projects: Project[] = [
  {
    code: 'P-01',
    slug: 'project-01',
    name: '[Project name]',
    sector: 'residential',
    sectorLabel: 'Residential high-rise',
    scope: 'Structural + MEP + Supervision',
    city: '[City]',
    image: img.highriseDusk,
    imageAlt: 'High-rise residential tower under construction at dusk',
  },
  {
    code: 'P-02',
    slug: 'project-02',
    name: '[Project name]',
    sector: 'residential',
    sectorLabel: 'Villa',
    scope: 'Structural + MEP',
    city: '[City]',
    image: img.villa,
    imageAlt: 'Contemporary villa with large glazed openings at dusk',
  },
  {
    code: 'P-03',
    slug: 'project-03',
    name: '[Project name]',
    sector: 'commercial',
    sectorLabel: 'Commercial',
    scope: 'MEP',
    city: '[City]',
    image: img.glassTowers,
    imageAlt: 'Glass office towers seen from street level',
  },
  {
    code: 'P-04',
    slug: 'project-04',
    name: '[Project name]',
    sector: 'institutional',
    sectorLabel: 'Institutional',
    scope: 'Structural + MEP',
    city: '[City]',
    image: img.modernBuilding,
    imageAlt: 'Modern white building with angular facade',
  },
  {
    code: 'P-05',
    slug: 'project-05',
    name: '[Project name]',
    sector: 'residential',
    sectorLabel: 'Residential',
    scope: 'Structural + Supervision',
    city: '[City]',
    image: img.apartments,
    imageAlt: 'Apartment tower against the sky',
    imagePosition: 'center 40%',
  },
  {
    code: 'P-06',
    slug: 'project-06',
    name: '[Project name]',
    sector: 'institutional',
    sectorLabel: 'Institutional',
    scope: 'Structural + Supervision',
    city: '[City]',
    image: img.concreteBldg,
    imageAlt: 'Minimal concrete building',
    imagePosition: 'center 45%',
  },
  {
    code: 'P-07',
    slug: 'project-07',
    name: '[Project name]',
    sector: 'industrial',
    sectorLabel: 'Industrial',
    scope: 'MEP + Supervision',
    city: '[City]',
    image: img.plantRoom,
    imageAlt: 'Pump and stainless steel pipework in a plant room',
  },
  {
    code: 'P-08',
    slug: 'project-08',
    name: '[Project name]',
    sector: 'commercial',
    sectorLabel: 'Commercial',
    scope: 'Interior fit-out MEP',
    city: '[City]',
    image: img.studio,
    imageAlt: 'Open-plan office interior with glazing',
  },
  {
    code: 'P-09',
    slug: 'project-09',
    name: '[Project name]',
    sector: 'commercial',
    sectorLabel: 'Commercial',
    scope: 'Structural + Supervision',
    city: '[City]',
    image: img.craneFrame,
    imageAlt: 'Tower cranes over a steel frame under construction',
  },
]

export const getProject = (slug: string | undefined) => projects.find((p) => p.slug === slug)

/** Case-study fields for a project, with the shared placeholders filling any gaps. */
export function getProjectDetail(p: Project): ProjectDetail {
  const d = projectDetailDefaults
  return {
    client: p.client ?? d.client,
    area: p.area ?? d.area,
    storeys: p.storeys ?? d.storeys,
    structuralSystem: p.structuralSystem ?? d.structuralSystem,
    status: p.status ?? d.status,
    codes: p.codes ?? d.codes,
    software: p.software ?? d.software,
    duration: p.duration ?? d.duration,
    headline: p.headline ?? d.headline,
    brief: p.brief ?? d.brief,
    approach: p.approach ?? d.approach,
    outcome: p.outcome ?? d.outcome,
    scopeBullets: { ...d.scopeBullets, ...p.scopeBullets },
    gallery: p.gallery?.length ? p.gallery : d.gallery,
  }
}

/** Disciplines in SPC's scope on a project, in S → M → C order. */
export function getProjectDisciplines(p: Project): DisciplineId[] {
  if (p.disciplines?.length) return p.disciplines
  const scope = p.scope.toLowerCase()
  const ids: DisciplineId[] = []
  if (scope.includes('structural')) ids.push('structural')
  if (scope.includes('mep')) ids.push('mep')
  if (scope.includes('supervision')) ids.push('supervision')
  return ids
}

/** The project after `slug` in the list, wrapping round to the first. */
export function getNextProject(slug: string): Project {
  const i = projects.findIndex((p) => p.slug === slug)
  return projects[(i + 1) % projects.length]
}
