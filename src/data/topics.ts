import type { PostTopic } from '../cms/types'

export type TopicId = PostTopic

/** Topics for Insights notes and blog posts (the filter on the Insights page). */
export const topics: { id: TopicId; label: string }[] = [
  { id: 'structural', label: 'Structural' },
  { id: 'mep', label: 'MEP' },
  { id: 'site', label: 'Site' },
  { id: 'codes', label: 'Codes' },
]
