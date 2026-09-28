import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import Samtycke from './Samtycke.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
    <Samtycke />
  </StrictMode>,
)
