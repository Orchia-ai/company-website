import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './print/print.css'
import StudioBook from './print/StudioBook'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <div className="book-note">⌘P · Save as PDF</div>
    <StudioBook />
  </StrictMode>,
)
