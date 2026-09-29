import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router'
import { ClerkProvider } from '@clerk/react'

import './index.css'
import App from './App.tsx'
import Room from './Room.tsx'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  console.warn("Clerk Publishable Key no encontrada en variables de entorno (VITE_CLERK_PUBLISHABLE_KEY)")
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY || ""}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/room/:roomId" element={<Room />} />
        </Routes>
      </BrowserRouter>
    </ClerkProvider>
  </StrictMode>,
)
