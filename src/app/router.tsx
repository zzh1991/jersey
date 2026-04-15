import { createBrowserRouter } from 'react-router'
import LandingPage from '@/routes/landing'
import JerseyPage from '@/routes/jersey'

export const router = createBrowserRouter([
  { path: '/', element: <LandingPage /> },
  { path: '/jersey', element: <JerseyPage /> },
])
