# SP Consulting Services — Website

Marketing website for **SP Consulting Services**, Structural & MEP Consultants — *Engineered To Simplify*.

Built from the approved "Architectural premium" design: navy `#003366` and steel `#006699` from the logo,
condensed display type, blueprint grids and drawing-sheet details (gridline bubbles, sheet codes, a title block in the footer).

## Stack

| | |
|---|---|
| Framework | React 19 + TypeScript |
| Build tool | Vite 8 |
| Routing | React Router 7 (each page is code-split) |
| Styling | CSS Modules + design tokens (`src/styles/tokens.css`). No CSS framework. |
| Fonts | Barlow Condensed, IBM Plex Sans, IBM Plex Mono, self-hosted via `@fontsource` |
| Linting | oxlint |

## Getting started

You need **Node.js 20.19+ or 22 LTS** ([nodejs.org](https://nodejs.org)).

```bash
npm install       # first time only
npm run dev       # dev server at http://localhost:5173
```

| Command | What it does |
|---|---|
| `npm run dev` | Start the dev server with hot reload |
| `npm run build` | Type-check and build the production site into `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Lint the source |
| `npm run typecheck` | Type-check only |

## Pages

| Route | Page |
|---|---|
| `/` | Home |
| `/services` | Services: audit (A-100), construction (C-200), design (D-300), engagement models, FAQ. Each service has an anchor, e.g. `/services#non-destructive-tests` |
| `/projects` | Project index with sector filter (`?sector=residential`) |
| `/projects/:slug` | Case study template (`/projects/project-01` … `project-09`) |
| `/process` | Five-stage process |
| `/about` | Practice, principles, leadership, credentials |
| `/insights` | Articles with topic filter (`?topic=mep`) and newsletter sign-up |
| `/careers` | Open roles with discipline filter, hiring process |
| `/contact` | Enquiry form with validation and attachments, office map |
| anything else | 404 page |

## Editing content

Most content lives in data files, so you rarely need to touch page code.

| What | Where |
|---|---|
| Phone, email, address, hours, reply time, home-page stats, testimonial, map, form endpoints | **`src/config/site.ts`** |
| Projects and case-study details | `src/data/projects.ts` |
| Service categories and services (also used by the home page, footer and contact form), engagement options, FAQ, design codes | `src/data/services.ts` |
| Process stages | `src/data/process.ts` |
| Articles | `src/data/insights.ts`. Set `to` on an article to turn its card into a link. |
| Job openings, hiring steps | `src/data/careers.ts` |
| About page (principles, leadership, software, memberships) | `src/pages/About.tsx` (constants at the top) |
| Photos | `src/assets/images/` registered in `src/assets/index.ts` |
| Logo files | `src/assets/brand/`, plus `public/favicon.svg`, `public/apple-touch-icon.png` and `public/og-image.png` |

### Placeholders to replace before launch

Anything in **[square brackets]** is a placeholder. Search the `src` folder for `[` to find them all. Key ones:

- **`site.ts`:** phone, email, office address, hours, reply time, stats (`[00]+` …), testimonial, client-logo slots.
- **`site.url`** (used for canonical/OG tags). Also replace the domain in `public/robots.txt` and `public/sitemap.xml`.
- **Projects:** names, cities, client, area, storeys, status, case-study text and photos for each project.
- **About:** founding year, founder, leadership names and portraits, professional memberships.
- **Careers and Process:** experience ranges and durations (`[0–0]`), pour-notice hours, reply time.
- **Insights:** dates and read times.
- **To confirm with the client:** items marked **`[confirm]`**, such as software (ETABS, SAFE, Revit) and the design-code lists.

### Photos

The current photos are free-licence stand-ins from [Unsplash](https://unsplash.com/license).
**Replace the project photos with SPC's own work before launch**, because stock buildings presented as SPC projects would mislead clients.
To swap a photo, overwrite the file in `src/assets/images/` (same name), or add a new file and register it in `src/assets/index.ts`.
WebP at 1200–1600px wide keeps pages fast.

## Forms

The contact and newsletter forms validate in the browser. Where submissions go is set in `src/config/site.ts`:

```ts
forms: {
  contactEndpoint: '',     // e.g. 'https://formspree.io/f/xxxxxxx'
  newsletterEndpoint: '',
}
```

- **Endpoint set:** the contact form POSTs `multipart/form-data` (including attachments, 20 MB max) with `Accept: application/json`. Formspree, Getform, Web3Forms or your own API all work.
- **Endpoint empty:** the form shows its success state without sending anything. This is fine for development, but **set the endpoint before launch**.
- **Map:** set `contact.mapEmbedUrl` (Google Maps → Share → Embed a map → copy the `src`) and `contact.directionsUrl` to replace the blueprint map placeholder.

## Deploying

Run `npm run build` and upload the contents of `dist/`. The site is a single-page app, so the host must send unknown paths to `index.html`. Config for that is included:

| Host | How |
|---|---|
| **Vercel** | Import the repo. `vercel.json` handles rewrites and caching. |
| **Netlify** | Build command `npm run build`, publish directory `dist`. `public/_redirects` handles rewrites. |
| **cPanel / Apache** | Upload `dist/` contents to `public_html`. `public/.htaccess` (copied into `dist`) handles rewrites. |

## Project structure

```
src/
  App.tsx                 routes (+ per-route header style and footer sheet number)
  main.tsx                fonts, global styles, app mount
  config/site.ts          company details & placeholders  ← edit me
  data/                   projects, services, process, insights, careers
  assets/                 images, logo SVGs, index.ts registry
  styles/                 tokens.css (colours, type, spacing), global.css (utilities)
  hooks/useReveal.ts      scroll-reveal animation (respects reduced motion)
  components/
    layout/               Layout, Header (+ mobile menu), Footer (title block)
    ui/                   Button, SectionLabel, Figure, FilterChips, CtaBand, SplitBand, Placeholder, Icons, Seo
  pages/                  one folder-less page per route + its CSS module
public/                   favicon, social image, robots, sitemap, host rewrite rules
```

## Accessibility & performance

- **Accessibility:**
  - semantic landmarks and a skip link
  - visible focus states and keyboard-operable menu, filters, accordion and forms
  - `aria-pressed`, `aria-expanded` and `aria-live` where needed
  - reduced-motion support
- **Performance:**
  - WebP images, lazy-loaded below the fold
  - self-hosted fonts
  - route-level code splitting
  - fingerprinted assets, cacheable for a year
