/**
 * Every photo the admin panel can replace, with plain-language notes on where it appears.
 * Keys match the image registry in src/assets/index.ts. Replacing a photo changes it everywhere it is used.
 * No runtime imports: the server functions use this list to validate photo keys.
 */
import type { ImageKey } from '../assets/keys.ts'

export type PhotoGroup = 'Home page' | 'Services' | 'Projects' | 'Other pages'

export interface PhotoSlot {
  key: ImageKey
  label: string
  group: PhotoGroup
  /** Where the photo appears on the website. */
  usedOn: string[]
  /** Suggested shape, so the client picks a photo that crops well. */
  shape: 'Landscape' | 'Portrait' | 'Any'
}

export const photoSlots: PhotoSlot[] = [
  // Home page
  { key: 'heroTower', label: 'Home — main photo', group: 'Home page', shape: 'Portrait', usedOn: ['Home: top of the page'] },
  {
    key: 'officeServices',
    label: 'Home — coordination photo',
    group: 'Home page',
    shape: 'Landscape',
    usedOn: ['Home: “Coordinated before the pour”', 'Services: Gas & utility distribution'],
  },
  { key: 'cranesDusk', label: 'Home — closing banner', group: 'Home page', shape: 'Landscape', usedOn: ['Home: “Bring us in early” banner'] },

  // Services
  { key: 'siteEngineers', label: 'Audit — category photo', group: 'Services', shape: 'Landscape', usedOn: ['Home: Audit card'] },
  {
    key: 'craneFrame',
    label: 'Construction — category photo',
    group: 'Services',
    shape: 'Landscape',
    usedOn: ['Home: Construction card', 'Services: closing banner', 'Projects: project 09'],
  },
  { key: 'drafting', label: 'Design — category photo', group: 'Services', shape: 'Landscape', usedOn: ['Home: Design card'] },
  {
    key: 'apartments',
    label: 'Structural audit & certification',
    group: 'Services',
    shape: 'Any',
    usedOn: ['Services: Structural audit & certification', 'Projects: project 05'],
  },
  {
    key: 'concreteFrame',
    label: 'Non-destructive tests',
    group: 'Services',
    shape: 'Any',
    usedOn: ['Services: Non-destructive tests', 'About page', 'Insights: floor systems note'],
  },
  {
    key: 'plantRoom',
    label: 'Public health engineering',
    group: 'Services',
    shape: 'Landscape',
    usedOn: ['Services: Public health engineering', 'Projects: project 07', 'Insights: shafts note'],
  },
  {
    key: 'hvacUnit',
    label: 'HVAC & mechanical engineering',
    group: 'Services',
    shape: 'Landscape',
    usedOn: ['Services: HVAC & mechanical engineering', 'Insights: featured note'],
  },
  {
    key: 'fireCeiling',
    label: 'Fire & life safety',
    group: 'Services',
    shape: 'Landscape',
    usedOn: ['Services: Fire & life safety', 'Insights: sprinklers note'],
  },
  { key: 'panelTesting', label: 'Electrical engineering', group: 'Services', shape: 'Landscape', usedOn: ['Services: Electrical engineering'] },
  {
    key: 'drawingsDesk',
    label: 'BIM modeling',
    group: 'Services',
    shape: 'Landscape',
    usedOn: ['Services: BIM modeling', 'Process page'],
  },
  {
    key: 'modernBuilding',
    label: 'Design Division',
    group: 'Services',
    shape: 'Landscape',
    usedOn: ['Services: SP Consulting Services – Design Division', 'Projects: project 04'],
  },

  // Projects
  { key: 'highriseDusk', label: 'Project 01 — cover', group: 'Projects', shape: 'Landscape', usedOn: ['Projects: project 01 (also featured on Home)'] },
  { key: 'villa', label: 'Project 02 — cover', group: 'Projects', shape: 'Landscape', usedOn: ['Projects: project 02'] },
  { key: 'glassTowers', label: 'Project 03 — cover', group: 'Projects', shape: 'Landscape', usedOn: ['Projects: project 03'] },
  { key: 'concreteBldg', label: 'Project 06 — cover', group: 'Projects', shape: 'Portrait', usedOn: ['Projects: project 06'] },
  { key: 'studio', label: 'Project 08 — cover', group: 'Projects', shape: 'Landscape', usedOn: ['Projects: project 08', 'About page'] },
  {
    key: 'siteColumns',
    label: 'Project gallery — photo 1',
    group: 'Projects',
    shape: 'Any',
    usedOn: ['Project pages: gallery', 'Careers page', 'Insights: audit report note'],
  },
  {
    key: 'rebarColumns',
    label: 'Project gallery — photo 2',
    group: 'Projects',
    shape: 'Any',
    usedOn: ['Project pages: gallery', 'Insights: seismic detailing note'],
  },
  {
    key: 'aerialRebar',
    label: 'Project gallery — photo 3',
    group: 'Projects',
    shape: 'Landscape',
    usedOn: ['Project pages: gallery', 'Insights: slab pour note'],
  },

  // Other pages
  { key: 'hardhat', label: 'Careers — main photo', group: 'Other pages', shape: 'Landscape', usedOn: ['Careers: top of the page'] },
]

export const photoGroups: PhotoGroup[] = ['Home page', 'Services', 'Projects', 'Other pages']

export const isPhotoKey = (key: string) => photoSlots.some((s) => s.key === key)
