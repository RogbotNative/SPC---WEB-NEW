import { img } from '../assets'
import { getContent } from '../cms/runtime'
import type { PostMeta } from '../cms/types'

import { topics, type TopicId } from './topics'

export { topics, type TopicId }

export interface Article {
  id: string
  topic: TopicId
  /** Sheet-code tag drawn on the image, e.g. "S-100". */
  tag: string
  title: string
  excerpt: string
  /** Keep the [placeholder] until the article is published. */
  date: string
  readTime: string
  image: string
  imageAlt: string
  /** Figure caption (featured card only). */
  caption?: string
  /** Shown in the "Featured" slot at the top of the page. Not counted in the topic grid. */
  featured?: boolean
  /**
   * Route of the full article once it exists (e.g. "/insights/floor-systems").
   * Leave undefined while the article is unpublished: the card renders without a link
   * and shows "Coming soon" instead of "Read article", so the page never ships a dead link.
   */
  to?: string
}

/** Placeholder notes, shown until the first post is published from the admin panel. */
const placeholderArticles: Article[] = [
  {
    id: 'mep-before-structure-freeze',
    topic: 'mep',
    tag: 'M-200',
    title: 'Why your MEP consultant should see the structure before it’s frozen',
    excerpt:
      'Beam depths, shafts and sleeves cost nothing to change on paper and a great deal in concrete. What to share, and when.',
    date: '[Date]',
    readTime: '[0] min read',
    image: img.hvacUnit,
    imageAlt: 'HVAC unit suspended from a steel roof structure',
    caption: 'Fig. 01 — Services under a roof structure',
    featured: true,
  },
  {
    id: 'choosing-a-floor-system',
    topic: 'structural',
    tag: 'S-100',
    title: 'Flat slab, PT or beam-slab: choosing a floor system',
    excerpt: 'Span, depth, speed and services, compared.',
    date: '[Date]',
    readTime: '[0] min read',
    image: img.concreteFrame,
    imageAlt: 'Bare reinforced concrete frame under construction',
  },
  {
    id: 'seismic-detailing',
    topic: 'codes',
    tag: 'IS 13920',
    title: 'Seismic detailing your structural drawings should show',
    excerpt: 'Ductile detailing to IS 13920, sheet by sheet.',
    date: '[Date]',
    readTime: '[0] min read',
    image: img.rebarColumns,
    imageAlt: 'Column reinforcement cages with workers on site',
  },
  {
    id: 'sizing-shafts-early',
    topic: 'mep',
    tag: 'M-200',
    title: 'Sizing shafts early: a checklist for architects',
    excerpt: 'What to fix before the floor plates freeze.',
    date: '[Date]',
    readTime: '[0] min read',
    image: img.plantRoom,
    imageAlt: 'Plant room with pumps and stainless steel pipework',
  },
  {
    id: 'structural-audit-report',
    topic: 'structural',
    tag: 'S-100',
    title: 'What a structural audit report should tell you',
    excerpt: 'Scope, tests and the recommendations to expect.',
    date: '[Date]',
    readTime: '[0] min read',
    image: img.siteColumns,
    imageAlt: 'Construction site with reinforced concrete columns and workers',
  },
  {
    id: 'sprinklers-and-hydrants',
    topic: 'mep',
    tag: 'M-200',
    title: 'Sprinklers, hydrants and what drives their layout',
    excerpt: 'Hazard class, coverage and pipe routing.',
    date: '[Date]',
    readTime: '[0] min read',
    image: img.fireCeiling,
    imageAlt: 'Concrete ceiling with red fire sprinkler pipes and cable trays',
  },
  {
    id: 'inspections-before-a-pour',
    topic: 'site',
    tag: 'C-300',
    title: 'Five inspections that matter before a slab pour',
    excerpt: 'Rebar, cover, shuttering, sleeves and levels.',
    date: '[Date]',
    readTime: '[0] min read',
    image: img.aerialRebar,
    imageAlt: 'Aerial view of reinforcement mats and workers on a slab',
  },
]

/* ------------------------------------------------------------------
   Posts written in the admin panel (/admin → Blog)
   ------------------------------------------------------------------ */

const topicTag: Record<TopicId, string> = { structural: 'S-100', mep: 'M-200', site: 'C-300', codes: 'Codes' }
const topicImage: Record<TopicId, string> = {
  structural: img.concreteFrame,
  mep: img.hvacUnit,
  site: img.aerialRebar,
  codes: img.drawingsDesk,
}

export const formatPostDate = (iso: string | null) =>
  iso ? new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : ''

function toArticle(post: PostMeta, featured: boolean): Article {
  return {
    id: post.slug,
    topic: post.topic,
    tag: topicTag[post.topic],
    title: post.title,
    excerpt: post.excerpt,
    date: formatPostDate(post.publishedAt),
    readTime: `${post.readMinutes} min read`,
    image: post.coverUrl || topicImage[post.topic],
    imageAlt: post.coverAlt || '',
    featured,
    to: `/insights/${post.slug}`,
  }
}

const published = getContent().posts
const featuredId = (published.find((p) => p.featured) ?? published[0])?.id

/**
 * Once anything is published from the admin panel, the Insights page shows only real posts
 * (newest first, with the post marked "featured" — or the newest — at the top).
 */
export const articles: Article[] = published.length
  ? published.map((p) => toArticle(p, p.id === featuredId))
  : placeholderArticles
