import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import OrtPage from './OrtPage.tsx'
import Samtycke from './Samtycke.tsx'
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <OrtPage />
    <Samtycke />
  </StrictMode>,
)
