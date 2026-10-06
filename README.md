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
| `/insights/:slug` | Blog post written in the admin panel |
| `/admin` | Admin panel (sign-in required) |
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

## Admin panel (`/admin`)

A password-protected panel where the client can, without touching code:

- **Photos:** replace any photo on the site (or drag one onto its card). Photos are resized in the browser to 2400 px and saved as WebP, and their location data is removed. "Put back original" undoes a replacement.
- **Testimonials:** add, edit, reorder, hide or delete the quotes on the home page. If there is more than one, visitors can click through them.
- **Blog:** write Insights posts in a Word-style editor with headings, bold, lists, quotes, links, photos and alignment. Pasting from Word keeps the formatting. Posts can be saved as drafts, published, taken offline, featured or deleted. Once the first post is published, the sample notes on `/insights` are replaced, and each post gets its own page at `/insights/<slug>`.
- **Security:** a log of every sign-in, including wrong passwords, and every change, with the time, device and IP address. The current session and the previous sign-in are shown too.

Changes appear on the live site within about a minute (the public content is cached for 30 s at Vercel's edge).

### Setting it up on Vercel (one time)

1. **Storage:** in the Vercel project, go to **Storage → Create → Blob** and connect it to the project (all environments). This is the only setting needed: it adds `BLOB_READ_WRITE_TOKEN`, and the session secret is derived from it.
2. **Deploy**, then open `https://<your-domain>/admin`.
3. **Sign in with the temporary details** the client was given, then go to **Security → Sign-in details** and set a new email and password straight away. Until you do, the dashboard shows a reminder.

The email and password are changed **in the admin panel** (Security → Sign-in details). The current password is always required, passwords are stored as scrypt hashes, and saving signs out every other device.

**Forgot the password?** In Vercel → Storage → the Blob store, delete the file `private-…/credentials.json`. The temporary sign-in then works again, so you can set new details. Optional environment variables override the defaults: `ADMIN_USERNAME` with `ADMIN_PASSWORD_HASH` (from `npm run admin:hash-password`) or `ADMIN_PASSWORD` (these apply only while no details have been saved from the panel), and `SESSION_SECRET` (32+ characters).

### Security

- Passwords are only ever stored as scrypt hashes, including the temporary one in the code, and checks run in constant time. The current password is needed to change the email or password.
- Sessions use a signed `__Host-` cookie that is HttpOnly, Secure and SameSite=Strict, and they expire after 8 hours. Changing the sign-in details signs out every other session.
- After 5 wrong passwords from one IP address within 15 minutes, sign-in is paused for 15 minutes. Every attempt is logged.
- Every request that changes something must carry a custom header and come from the same origin, which blocks cross-site request forgery.
- The server checks every upload by its actual file bytes (only JPG, PNG and WebP, up to 4 MB) and stores it under a random name. Only photos stored in this project's Blob storage can be used.
- Blog text is cleaned with DOMPurify before it is shown on the site.
- `/admin` is served with a strict Content-Security-Policy, `X-Frame-Options: DENY` and `noindex`, and is disallowed in `robots.txt`.
- Sign-in details, the activity log and lockout records are stored at a path derived from the server secret, so they can't be guessed.

### Running it locally

Run `npm run dev` and open `http://localhost:5173/admin`. Sign in with the temporary details (no `.env.local` needed). Without a `BLOB_READ_WRITE_TOKEN`, content and uploads are saved in `.data/`, which is git-ignored.

| Where | What |
|---|---|
| `api/` | Vercel functions: `content` and `post` are public; `admin/*` handles sign-in, content, posts, uploads and activity |
| `api/_lib/` | Auth, password hashing, storage (Blob or local), validation, activity log |
| `src/admin/` | The admin panel (loaded only when `/admin` is opened) |
| `src/cms/` | Shared content types, the list of replaceable photos (`photoSlots.ts`) and the runtime loader |

## Deploying

The site is hosted on Vercel. Every push to `main` deploys automatically once the repo is imported in Vercel.

| Host | How |
|---|---|
| **Vercel** | Import the repo. `vercel.json` handles rewrites, caching and security headers. The admin panel needs Vercel (see above). |

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
public/                   favicon, social image, robots, sitemap
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
