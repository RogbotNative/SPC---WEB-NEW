/** Line icons for the admin panel, drawn to match the website's 1.6px-stroke icons. */
import type { ReactNode, SVGProps } from 'react'

type P = SVGProps<SVGSVGElement> & { size?: number }

function Svg({ size = 20, children, ...rest }: P & { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {children}
    </svg>
  )
}

export const IconDashboard = (p: P) => <Svg {...p}><path d="M3 3h8v8H3zM13 3h8v5h-8zM13 10h8v11h-8zM3 13h8v8H3z" /></Svg>
export const IconPhoto = (p: P) => <Svg {...p}><>
    <rect x="3" y="4" width="18" height="16" />
    <circle cx="9" cy="10" r="2" />
    <path d="M21 16l-5-5-9 9" />
  </>,</Svg>
export const IconQuote = (p: P) => <Svg {...p}><path d="M7 7h4v6H5v-2a4 4 0 0 1 2-4zM15 7h4v6h-6v-2a4 4 0 0 1 2-4zM5 13v4M13 13v4" /></Svg>
export const IconPen = (p: P) => <Svg {...p}><path d="M4 20h4L19 9l-4-4L4 16v4zM13 7l4 4" /></Svg>
export const IconShield = (p: P) => <Svg {...p}><>
    <path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3z" />
    <path d="M9 12l2 2 4-4" />
  </>,</Svg>
export const IconExternal = (p: P) => <Svg {...p}><path d="M14 4h6v6M20 4l-9 9M18 14v6H4V6h6" /></Svg>
export const IconLogout = (p: P) => <Svg {...p}><path d="M15 4h5v16h-5M10 8l-4 4 4 4M6 12h11" /></Svg>
export const IconUpload = (p: P) => <Svg {...p}><path d="M12 16V4M7 9l5-5 5 5M4 16v4h16v-4" /></Svg>
export const IconTrash = (p: P) => <Svg {...p}><path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" /></Svg>
export const IconReset = (p: P) => <Svg {...p}><path d="M4 12a8 8 0 1 0 2.3-5.6M4 4v4h4" /></Svg>
export const IconUp = (p: P) => <Svg {...p}><path d="M12 19V5M6 11l6-6 6 6" /></Svg>
export const IconDown = (p: P) => <Svg {...p}><path d="M12 5v14M6 13l6 6 6-6" /></Svg>
export const IconPlus = (p: P) => <Svg {...p}><path d="M12 5v14M5 12h14" /></Svg>
export const IconCheck = (p: P) => <Svg {...p}><path d="M5 12.5l4.5 4.5L19 7.5" /></Svg>
export const IconAlert = (p: P) => <Svg {...p}><path d="M12 8v5M12 16.5v.5M10.3 3.9L2.6 17.5A2 2 0 0 0 4.3 20.5h15.4a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" /></Svg>
export const IconLock = (p: P) => <Svg {...p}><>
    <rect x="5" y="11" width="14" height="10" />
    <path d="M8 11V8a4 4 0 0 1 8 0v3" />
  </>,</Svg>
export const IconMenu = (p: P) => <Svg {...p}><path d="M3 6h18M3 12h18M3 18h12" /></Svg>
export const IconClose = (p: P) => <Svg {...p}><path d="M5 5l14 14M19 5L5 19" /></Svg>
export const IconBack = (p: P) => <Svg {...p}><path d="M19 12H5M11 6l-6 6 6 6" /></Svg>
export const IconEye = (p: P) => <Svg {...p}><>
    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
    <circle cx="12" cy="12" r="3" />
  </>,</Svg>
export const IconClock = (p: P) => <Svg {...p}><>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </>,</Svg>

/* Editor toolbar */
export const IconBold = (p: P) => <Svg {...p}><path d="M7 5h6a3.5 3.5 0 0 1 0 7H7zM7 12h7a3.5 3.5 0 0 1 0 7H7z" strokeWidth={2} /></Svg>
export const IconItalic = (p: P) => <Svg {...p}><path d="M10 5h8M6 19h8M14 5l-4 14" /></Svg>
export const IconUnderline = (p: P) => <Svg {...p}><path d="M7 4v7a5 5 0 0 0 10 0V4M5 20h14" /></Svg>
export const IconStrike = (p: P) => <Svg {...p}><path d="M4 12h16M16 6.5C15 5 13.6 4.5 12 4.5c-2.5 0-4.5 1.3-4.5 3.5M8 17.5c1 1.5 2.4 2 4 2 2.5 0 4.5-1.3 4.5-3.5" /></Svg>
export const IconListBullet = (p: P) => <Svg {...p}><path d="M9 6h11M9 12h11M9 18h11M4.5 6h.01M4.5 12h.01M4.5 18h.01" strokeWidth={2} /></Svg>
export const IconListNumber = (p: P) => <Svg {...p}><path d="M10 6h10M10 12h10M10 18h10M4 5l1.5-1v5M3.5 13.5a1.5 1.5 0 1 1 2.5 1L3.5 17H6.5" /></Svg>
export const IconQuoteBlock = (p: P) => <Svg {...p}><path d="M4 6v12M8 8h12M8 12h12M8 16h8" /></Svg>
export const IconAlignLeft = (p: P) => <Svg {...p}><path d="M4 6h16M4 10h10M4 14h16M4 18h10" /></Svg>
export const IconAlignCenter = (p: P) => <Svg {...p}><path d="M4 6h16M7 10h10M4 14h16M7 18h10" /></Svg>
export const IconAlignRight = (p: P) => <Svg {...p}><path d="M4 6h16M10 10h10M4 14h16M10 18h10" /></Svg>
export const IconLink = (p: P) => <Svg {...p}><path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" /></Svg>
export const IconRule = (p: P) => <Svg {...p}><path d="M3 12h18" /></Svg>
export const IconUndo = (p: P) => <Svg {...p}><path d="M9 7L4 12l5 5M4 12h11a5 5 0 0 1 0 10h-3" /></Svg>
export const IconRedo = (p: P) => <Svg {...p}><path d="M15 7l5 5-5 5M20 12H9a5 5 0 0 0 0 10h3" /></Svg>
