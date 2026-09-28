import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import KurserPage from './KurserPage.tsx'
import Samtycke from './Samtycke.tsx'
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <KurserPage />
    <Samtycke />
  </StrictMode>,
)
