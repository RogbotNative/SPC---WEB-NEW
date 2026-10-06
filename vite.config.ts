import { createReadStream, existsSync } from 'node:fs'
import { join, normalize } from 'node:path'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv, type Plugin } from 'vite'

/**
 * Runs the Vercel functions in /api during `npm run dev`, so the admin panel works locally.
 * Content and uploads are saved under .data/ unless BLOB_READ_WRITE_TOKEN is set in .env.local.
 */
function localApi(): Plugin {
  return {
    name: 'spc-local-api',
    apply: 'serve',
    configureServer(server) {
      const env = loadEnv(server.config.mode, process.cwd(), '')
      for (const key of ['ADMIN_USERNAME', 'ADMIN_PASSWORD', 'ADMIN_PASSWORD_HASH', 'SESSION_SECRET', 'BLOB_READ_WRITE_TOKEN']) {
        if (env[key] && !process.env[key]) process.env[key] = env[key]
      }

      server.middlewares.use(async (req, res, next) => {
        let url: URL
        try {
          url = new URL(req.url ?? '/', `http://${req.headers.host ?? 'localhost'}`)
        } catch {
          return next() // malformed address (e.g. "//"): let Vite deal with it
        }

        // Locally stored uploads (/__uploads/…) → .data/uploads/…
        if (url.pathname.startsWith('/__uploads/')) {
          const file = join(process.cwd(), '.data', normalize(url.pathname.slice(3)).replace(/^(\.\.[/\\])+/, ''))
          if (!existsSync(file)) return next()
          res.setHeader('Content-Type', file.endsWith('.png') ? 'image/png' : file.endsWith('.jpg') ? 'image/jpeg' : 'image/webp')
          return createReadStream(file).pipe(res)
        }

        if (!url.pathname.startsWith('/api/')) return next()
        const route = url.pathname.slice(1).replace(/\/$/, '')
        if (!/^api(\/[a-z-]+)+$/.test(route) || route.includes('_lib')) return next()
        const file = join(process.cwd(), `${route}.ts`)
        if (!existsSync(file)) return next()

        try {
          const mod = await server.ssrLoadModule(file)
          const method = req.method ?? 'GET'
          const handler = mod[method] as ((r: Request) => Promise<Response>) | undefined
          if (!handler) {
            res.statusCode = 405
            return res.end('Method not allowed')
          }
          const chunks: Buffer[] = []
          for await (const chunk of req) chunks.push(chunk as Buffer)
          const headers = new Headers()
          for (const [k, v] of Object.entries(req.headers)) if (typeof v === 'string') headers.set(k, v)
          const request = new Request(url, {
            method,
            headers,
            body: ['GET', 'HEAD'].includes(method) ? undefined : Buffer.concat(chunks),
          })
          const response = await handler(request)
          res.statusCode = response.status
          response.headers.forEach((value, key) => {
            if (key !== 'set-cookie') res.setHeader(key, value)
          })
          const cookies = response.headers.getSetCookie()
          if (cookies.length) res.setHeader('Set-Cookie', cookies)
          res.end(Buffer.from(await response.arrayBuffer()))
        } catch (e) {
          server.ssrFixStacktrace(e as Error)
          console.error(e)
          res.statusCode = 500
          res.end('API error')
        }
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), localApi()],
})
