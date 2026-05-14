import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { QueryProvider } from './contexts/QueryProvider'
import { Layout } from './components/layout/Layout'
import { ProtectedRoute } from './components/auth/ProtectedRoute'
import { Spinner } from './components/ui/Spinner'

// ── Code-split every page into its own chunk ─────────────────────────────────
// This keeps the initial bundle lean and lets Vercel's CDN cache each chunk
// independently, so most users only download what they actually visit.
const Landing     = lazy(() => import('./pages/Landing').then(m => ({ default: m.Landing })))
const Login       = lazy(() => import('./pages/Login').then(m => ({ default: m.Login })))
const Register    = lazy(() => import('./pages/Register').then(m => ({ default: m.Register })))
const Dashboard   = lazy(() => import('./pages/Dashboard').then(m => ({ default: m.Dashboard })))
const SprintDetail = lazy(() => import('./pages/SprintDetail').then(m => ({ default: m.SprintDetail })))
const NotFound    = lazy(() => import('./pages/NotFound').then(m => ({ default: m.NotFound })))

function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Spinner size="lg" />
    </div>
  )
}

export default function App() {
  return (
    <QueryProvider>
      <BrowserRouter>
        <AuthProvider>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Public routes */}
              <Route
                path="/"
                element={
                  <Layout>
                    <Landing />
                  </Layout>
                }
              />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Dashboard />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/sprints/:id"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <SprintDetail />
                    </Layout>
                  </ProtectedRoute>
                }
              />

              {/* Catch-all */}
              <Route path="/404" element={<Layout><NotFound /></Layout>} />
              <Route path="*" element={<Navigate to="/404" replace />} />
            </Routes>
          </Suspense>
        </AuthProvider>
      </BrowserRouter>
    </QueryProvider>
  )
}
