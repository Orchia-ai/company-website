import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { Analytics } from '@vercel/analytics/react'
import './index.css'
import App from './App.tsx'
import LogoPage from './pages/LogoPage.tsx'
import BlogIndexPage from './components/blog/BlogIndexPage.tsx'
import BlogPostPage from './components/blog/BlogPostPage.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/logo" element={<LogoPage />} />
          <Route path="/blog" element={<BlogIndexPage />} />
          <Route path="/blog/:slug" element={<BlogPostPage />} />
          <Route path="*" element={<App />} />
        </Routes>
      </BrowserRouter>
      <Analytics />
    </HelmetProvider>
  </StrictMode>,
)
