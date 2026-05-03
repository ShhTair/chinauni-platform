import { lazy, Suspense, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'sonner'
import { Layout } from '@/components/layout/Layout'
import { useAuthStore } from '@/stores/auth'
import { initContentProtection } from '@/lib/protection'

// ── Lazy-loaded pages ──────────────────────────────────────────────────────────
const HomePage           = lazy(() => import('@/pages/HomePage').then(m => ({ default: m.HomePage })))
const UniversitiesPage   = lazy(() => import('@/pages/UniversitiesPage').then(m => ({ default: m.UniversitiesPage })))
const UniversityDetailPage = lazy(() => import('@/pages/UniversityDetailPage').then(m => ({ default: m.UniversityDetailPage })))
const IntakeFormPage     = lazy(() => import('@/pages/IntakeFormPage').then(m => ({ default: m.IntakeFormPage })))
const ComparePage        = lazy(() => import('@/pages/ComparePage').then(m => ({ default: m.ComparePage })))
const ScholarshipsPage   = lazy(() => import('@/pages/ScholarshipsPage').then(m => ({ default: m.ScholarshipsPage })))
const DeadlinesPage      = lazy(() => import('@/pages/DeadlinesPage').then(m => ({ default: m.DeadlinesPage })))
const ProfilePage        = lazy(() => import('@/pages/ProfilePage').then(m => ({ default: m.ProfilePage })))
const AccountPage        = lazy(() => import('@/pages/AccountPage').then(m => ({ default: m.AccountPage })))
const AdminPage          = lazy(() => import('@/pages/AdminPage').then(m => ({ default: m.AdminPage })))
const AboutPage          = lazy(() => import('@/pages/AboutPage').then(m => ({ default: m.AboutPage })))
// Dev/system pages
const BrandbookPage      = lazy(() => import('@/pages/BrandbookPage'))
const ProgressPage       = lazy(() => import('@/pages/ProgressPage'))
const DeveloperHandover  = lazy(() => import('@/pages/DeveloperHandover'))
const NotFoundPage       = lazy(() => import('@/pages/NotFoundPage').then(m => ({ default: m.NotFoundPage })))

// ── Query client ───────────────────────────────────────────────────────────────
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
})

// ── Page skeleton while lazy chunks load ──────────────────────────────────────
function PageSkeleton() {
  return (
    <div className="min-h-screen bg-bg animate-pulse">
      <div className="max-w-7xl mx-auto px-4 py-12 space-y-6">
        <div className="h-8 bg-border rounded-lg w-1/3" />
        <div className="h-4 bg-border rounded w-2/3" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-2xl bg-border h-64" />
          ))}
        </div>
      </div>
    </div>
  )
}

function AppInit() {
  const { token, fetchMe } = useAuthStore()
  useEffect(() => {
    initContentProtection()
    if (token) fetchMe()
  }, [])
  return null
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppInit />
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              fontFamily: 'Outfit, sans-serif',
              fontSize: '14px',
              borderRadius: '12px',
              border: '1px solid #E2DFD9',
              background: '#FFFFFF',
              color: '#1A1A1A',
            },
          }}
        />
        <Suspense fallback={<PageSkeleton />}>
          <Routes>
            <Route path="/"                          element={<Layout><HomePage /></Layout>} />
            <Route path="/universities"              element={<Layout><UniversitiesPage /></Layout>} />
            <Route path="/universities/:slug"        element={<Layout><UniversityDetailPage /></Layout>} />
            <Route path="/universities/:slug/apply"  element={<Layout><IntakeFormPage /></Layout>} />
            <Route path="/compare"                   element={<Layout><ComparePage /></Layout>} />
            <Route path="/scholarships"              element={<Layout><ScholarshipsPage /></Layout>} />
            <Route path="/deadlines"                 element={<Layout><DeadlinesPage /></Layout>} />
            <Route path="/profile/:userId"           element={<Layout><ProfilePage /></Layout>} />
            <Route path="/account"                   element={<Layout><AccountPage /></Layout>} />
            <Route path="/admin"                     element={<Layout><AdminPage /></Layout>} />
            <Route path="/admin/submissions"         element={<Layout><AdminPage /></Layout>} />
            <Route path="/about"                     element={<Layout><AboutPage /></Layout>} />
            {/* System / dev pages */}
            <Route path="/brandbook"  element={<BrandbookPage />} />
            <Route path="/progress"   element={<ProgressPage />} />
            <Route path="/handover"   element={<DeveloperHandover />} />
            <Route path="*"           element={<Layout><NotFoundPage /></Layout>} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
