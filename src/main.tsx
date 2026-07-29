import { StrictMode, Suspense, lazy } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { Analytics } from '@vercel/analytics/react'
import './index.css'
import HomeFilmPage from './pages/HomeFilmPage.tsx'

// The landing page is the demo film alone. Every other route is kept alive but
// loaded on demand so the film does not ship the rest of the site with it.
const App = lazy(() => import('./App.tsx'))
const LogoPage = lazy(() => import('./pages/LogoPage.tsx'))
const BlogIndexPage = lazy(() => import('./components/blog/BlogIndexPage.tsx'))
const BlogPostPage = lazy(() => import('./components/blog/BlogPostPage.tsx'))

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <Suspense fallback={null}>
          <Routes>
            <Route path="/" element={<HomeFilmPage />} />
            {/* The previous marketing site stays reachable for internal use;
                it is no longer linked from anywhere. */}
            <Route path="/studio" element={<App />} />
            <Route path="/logo" element={<LogoPage />} />
            <Route path="/blog" element={<BlogIndexPage />} />
            <Route path="/blog/:slug" element={<BlogPostPage />} />
            <Route path="*" element={<HomeFilmPage />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
      <Analytics />
    </HelmetProvider>
  </StrictMode>,
)
