import { site } from '../config/site'

export type RoleDiscipline = 'structural' | 'mep' | 'site' | 'bim'

export const roleDisciplines: { id: RoleDiscipline; label: string }[] = [
  { id: 'structural', label: 'Structural' },
  { id: 'mep', label: 'MEP' },
  { id: 'site', label: 'Site' },
  { id: 'bim', label: 'BIM' },
]

export interface Role {
  /** Schedule reference, e.g. "R-01". */
  ref: string
  title: string
  discipline: RoleDiscipline
  /** Keep the [placeholders] until the brief for each role is confirmed. */
  experience: string
  location: string
  type: string
}

export const roles: Role[] = [
  {
    ref: 'R-01',
    title: 'Structural Design Engineer',
    discipline: 'structural',
    experience: '[0–0] yrs',
    location: site.contact.city,
    type: 'Full-time',
  },
  {
    ref: 'R-02',
    title: 'MEP Design Engineer — HVAC',
    discipline: 'mep',
    experience: '[0–0] yrs',
    location: site.contact.city,
    type: 'Full-time',
  },
  {
    ref: 'R-03',
    title: 'MEP Design Engineer — Electrical',
    discipline: 'mep',
    experience: '[0–0] yrs',
    location: site.contact.city,
    type: 'Full-time',
  },
  {
    ref: 'R-04',
    title: 'Site Engineer — Supervision',
    discipline: 'site',
    experience: '[0–0] yrs',
    location: site.contact.city,
    type: 'Full-time',
  },
  {
    ref: 'R-05',
    title: 'BIM / Revit Modeller',
    discipline: 'bim',
    experience: '[0–0] yrs',
    location: site.contact.city,
    type: 'Full-time',
  },
]

export const whyJoin = [
  {
    title: 'Design and site, both',
    text: 'You design a building, then inspect the reinforcement and services that come out of your drawings. Few things teach detailing faster than seeing it built.',
  },
  {
    title: 'Structure and MEP side by side',
    text: 'Structural and MEP engineers work in the same office and review each other’s drawings. You learn why a beam is deep or a shaft is wide.',
  },
  {
    title: 'Responsibility early',
    text: 'You own a defined part of a project early, with a senior engineer checking your work. You explain your design decisions to architects and clients.',
  },
]

export const hiringSteps = [
  {
    title: 'Apply',
    text: 'Send your CV and, if you have one, a few drawings or calculations you worked on.',
  },
  {
    title: 'Technical conversation',
    text: 'A conversation with senior engineers about your projects and the decisions behind them.',
  },
  {
    title: 'Design exercise [confirm]',
    text: 'A short, practical exercise — sizing, detailing or checking a drawing — close to the work you would do here.',
  },
  {
    title: 'Offer',
    text: 'If it is a fit on both sides, we make an offer and agree a start date.',
  },
]
