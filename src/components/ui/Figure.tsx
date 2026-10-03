import type { CSSProperties } from 'react'
import s from './Figure.module.css'

export interface Pin {
  label: string
  /** Position as a percentage of the image box, e.g. "18%". */
  x: string
  y: string
}

interface Props {
  src: string
  alt: string
  /** Mono caption tag in the bottom-left corner, e.g. "Fig. 01 — Services zone". */
  caption?: string
  /** Sheet code tag in the top-left corner, e.g. "S-100". */
  tag?: string
  /** Number of dashed vertical gridlines drawn over the image. */
  gridlines?: number
  /** Labels for gridline bubbles drawn above the image (one per gridline). */
  bubbles?: string[]
  /** Draw a vertical dimension line to the left of the image. */
  dimension?: boolean
  pins?: Pin[]
  objectPosition?: string
  /** Use for above-the-fold images. */
  priority?: boolean
  className?: string
  style?: CSSProperties
}

/** Photo framed like a drawing figure: optional gridlines, gridline bubbles, pins and caption tags. */
export function Figure({
  src,
  alt,
  caption,
  tag,
  gridlines = 0,
  bubbles,
  dimension,
  pins,
  objectPosition,
  priority,
  className,
  style,
}: Props) {
  const lines = Array.from({ length: gridlines }, (_, i) => ((i + 1) / (gridlines + 1)) * 100)
  return (
    <figure
      className={[s.figure, bubbles?.length && s.withBubbles, dimension && s.withDimension, className]
        .filter(Boolean)
        .join(' ')}
      style={style}
    >
      <img
        src={src}
        alt={alt}
        className={s.img}
        style={objectPosition ? { objectPosition } : undefined}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        {...(priority ? { fetchPriority: 'high' as const } : {})}
      />
      {lines.map((left, i) => (
        <span key={`l${i}`} className={s.gridline} style={{ left: `${left}%` }} aria-hidden="true">
          {bubbles?.[i] && <span className={s.bubble}>{bubbles[i]}</span>}
        </span>
      ))}
      {dimension && (
        <span className={s.dimension} aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
      )}
      {pins?.map((p) => (
        <span key={p.label} className={s.pin} style={{ left: p.x, top: p.y }} aria-hidden="true">
          {p.label}
        </span>
      ))}
      {tag && <span className={s.tag}>{tag}</span>}
      {caption && <figcaption className={s.caption}>{caption}</figcaption>}
    </figure>
  )
}
