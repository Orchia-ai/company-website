import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Analytics } from '@vercel/analytics/react'
import './index.css'
import App from './App.tsx'
import LogoPage from './pages/LogoPage.tsx'

const isLogoRoute = window.location.pathname === '/logo'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {isLogoRoute ? <LogoPage /> : <App />}
    <Analytics />
  </StrictMode>,
)
