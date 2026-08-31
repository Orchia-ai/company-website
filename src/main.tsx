import { StrictMode, Suspense, lazy } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { Analytics } from '@vercel/analytics/react'
import './index.css'

// Keep route bundles independent so the promotion-video homepage does not ship
// the rest of the site until a visitor asks for it.
const App = lazy(() => import('./App.tsx'))
const HomeFilmPage = lazy(() => import('./pages/HomeFilmPage.tsx'))
const LogoPage = lazy(() => import('./pages/LogoPage.tsx'))
const BlogIndexPage = lazy(() => import('./components/blog/BlogIndexPage.tsx'))
const BlogPostPage = lazy(() => import('./components/blog/BlogPostPage.tsx'))
const DocsIndexPage = lazy(() => import('./pages/DocsIndexPage.tsx'))
const DiscordVideoWorkflowPage = lazy(() => import('./pages/DiscordVideoWorkflowPage.tsx'))
const Demo2Page = lazy(() => import('./pages/Demo2Page.tsx'))
const Demo3Page = lazy(() => import('./pages/Demo3Page.tsx'))
const HomeV2Page = lazy(() => import('./pages/HomeV2Page.tsx'))

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <Suspense fallback={null}>
          <Routes>
            <Route path="/" element={<HomeV2Page />} />
            <Route path="/v2" element={<HomeV2Page />} />
            <Route path="/about-us" element={<HomeFilmPage />} />
            {/* The previous marketing site stays reachable for internal use;
                it is no longer linked from anywhere. */}
            <Route path="/studio" element={<App />} />
            <Route path="/logo" element={<LogoPage />} />
            <Route path="/blog" element={<BlogIndexPage />} />
            <Route path="/blog/:slug" element={<BlogPostPage />} />
            <Route path="/docs" element={<DocsIndexPage />} />
            <Route path="/docs/discord-video-workflow" element={<DiscordVideoWorkflowPage />} />
            <Route path="/demo2" element={<Demo2Page />} />
            <Route path="/demo3" element={<Demo3Page />} />
            <Route path="*" element={<HomeV2Page />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
      <Analytics />
    </HelmetProvider>
  </StrictMode>,
)
