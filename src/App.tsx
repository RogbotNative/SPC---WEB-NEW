import type { ComponentType } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Layout, type RouteHandle } from './components/layout/Layout'
import Home from './pages/Home'

const h = (header: RouteHandle['header'], sheet: string, sheetTitle: string): RouteHandle => ({
  header,
  sheet,
  sheetTitle,
})

/** Code-split each page except Home so the first load stays small. */
const page = (load: () => Promise<{ default: ComponentType }>) => async () => ({ Component: (await load()).default })

const router = createBrowserRouter([
  {
    element: <Layout />,
    hydrateFallbackElement: null,
    children: [
      { index: true, element: <Home />, handle: h('dark', 'A-00', 'Home') },
      { path: 'about', lazy: page(() => import('./pages/About')), handle: h('dark', 'A-02', 'About') },
      { path: 'services', lazy: page(() => import('./pages/Services')), handle: h('light', 'A-03', 'Services') },
      { path: 'projects', lazy: page(() => import('./pages/Projects')), handle: h('dark', 'A-04', 'Projects') },
      {
        path: 'projects/:slug',
        lazy: page(() => import('./pages/ProjectDetail')),
        handle: h('dark', 'A-05', 'Project detail'),
      },
      { path: 'contact', lazy: page(() => import('./pages/Contact')), handle: h('light', 'A-06', 'Contact') },
      { path: 'process', lazy: page(() => import('./pages/Process')), handle: h('dark', 'A-07', 'Process') },
      { path: 'insights', lazy: page(() => import('./pages/Insights')), handle: h('light', 'A-08', 'Insights') },
      {
        path: 'insights/:slug',
        lazy: page(() => import('./pages/Article')),
        handle: h('light', 'A-08', 'Insights note'),
      },
      { path: 'careers', lazy: page(() => import('./pages/Careers')), handle: h('dark', 'A-09', 'Careers') },
      { path: '*', lazy: page(() => import('./pages/NotFound')), handle: h('dark', 'A-404', 'Not found') },
    ],
  },
  // Admin panel: its own layout, loaded only when someone opens /admin.
  { path: 'admin/*', lazy: page(() => import('./admin/AdminApp')), hydrateFallbackElement: null },
])

export default function App() {
  return <RouterProvider router={router} />
}
