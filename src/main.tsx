import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// Self-hosted fonts (no Google Fonts request at runtime)
import '@fontsource/barlow-condensed/500.css'
import '@fontsource/barlow-condensed/600.css'
import '@fontsource/ibm-plex-sans/400.css'
import '@fontsource/ibm-plex-sans/500.css'
import '@fontsource/ibm-plex-sans/600.css'
import '@fontsource/ibm-plex-mono/400.css'
import '@fontsource/ibm-plex-mono/500.css'

import './styles/tokens.css'
import './styles/global.css'
import { applyImageOverrides } from './assets'
import { loadContent } from './cms/runtime'

/**
 * Photos, testimonials and posts edited in the admin panel are fetched first and applied before the app
 * (and the data files that read the photo registry) is imported, so every page renders with them.
 */
async function start() {
  if (!location.pathname.startsWith('/admin')) {
    const content = await loadContent()
    applyImageOverrides(content.images)
  }
  const { default: App } = await import('./App')
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}

void start()
