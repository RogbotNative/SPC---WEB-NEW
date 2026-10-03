/* Image registry — every photo used on the site is imported here so Vite can fingerprint it.
   Photos are free-licence images from Unsplash (unsplash.com/license) used as stand-ins.
   Replace them with SPC's own project photography before launch: drop the new file into
   src/assets/images/ with the same name, or add a new import below. */

import aerialRebar from './images/aerial-rebar.webp'
import apartments from './images/apartments.webp'
import concreteBldg from './images/concrete-bldg.webp'
import concreteFrame from './images/concrete-frame.webp'
import craneFrame from './images/crane-frame.webp'
import cranesDusk from './images/cranes-dusk.webp'
import drafting from './images/drafting.webp'
import drawingsDesk from './images/drawings-desk.webp'
import electrician from './images/electrician.webp'
import fireCeiling from './images/fire-ceiling.webp'
import glassTowers from './images/glass-towers.webp'
import hardhat from './images/hardhat.webp'
import heroTower from './images/hero-tower.webp'
import highriseDusk from './images/highrise-dusk.webp'
import hvacUnit from './images/hvac-unit.webp'
import modernBuilding from './images/modern-building.webp'
import officeServices from './images/office-services.webp'
import panelTesting from './images/panel-testing.webp'
import plantRoom from './images/plant-room.webp'
import rebarColumns from './images/rebar-columns.webp'
import siteColumns from './images/site-columns.webp'
import siteEngineers from './images/site-engineers.webp'
import studio from './images/studio.webp'
import team from './images/team.webp'
import villa from './images/villa.webp'

import markColor from './brand/mark-color.svg'
import markReverse from './brand/mark-reverse.svg'
import wordmarkNavy from './brand/wordmark-navy.svg'
import wordmarkWhite from './brand/wordmark-white.svg'
import logoFullColor from './brand/logo-full-color.svg'
import logoFullWhite from './brand/logo-full-white.svg'

export const img = {
  aerialRebar,
  apartments,
  concreteBldg,
  concreteFrame,
  craneFrame,
  cranesDusk,
  drafting,
  drawingsDesk,
  electrician,
  fireCeiling,
  glassTowers,
  hardhat,
  heroTower,
  highriseDusk,
  hvacUnit,
  modernBuilding,
  officeServices,
  panelTesting,
  plantRoom,
  rebarColumns,
  siteColumns,
  siteEngineers,
  studio,
  team,
  villa,
} as const

export type ImageKey = keyof typeof img

export const brand = {
  markColor,
  markReverse,
  wordmarkNavy,
  wordmarkWhite,
  logoFullColor,
  logoFullWhite,
} as const
