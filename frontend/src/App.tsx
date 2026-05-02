import { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Layout } from '@/components/layout/Layout'
import { HomePage } from '@/pages/HomePage'
import { UniversitiesPage } from '@/pages/UniversitiesPage'
import { UniversityDetailPage } from '@/pages/UniversityDetailPage'
import { IntakeFormPage } from '@/pages/IntakeFormPage'
import { ComparePage } from '@/pages/ComparePage'
import { ScholarshipsPage } from '@/pages/ScholarshipsPage'
import { DeadlinesPage } from '@/pages/DeadlinesPage'
import { ProfilePage } from '@/pages/ProfilePage'
import { AccountPage } from '@/pages/AccountPage'
import { AdminPage } from '@/pages/AdminPage'
import { AboutPage } from '@/pages/AboutPage'
import { useAuthStore } from '@/stores/auth'
import { initContentProtection } from '@/lib/protection'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
})

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
        <Routes>
          <Route path="/" element={<Layout><HomePage /></Layout>} />
          <Route path="/universities" element={<Layout><UniversitiesPage /></Layout>} />
          <Route path="/universities/:slug" element={<Layout><UniversityDetailPage /></Layout>} />
          <Route path="/universities/:slug/apply" element={<Layout><IntakeFormPage /></Layout>} />
          <Route path="/compare" element={<Layout><ComparePage /></Layout>} />
          <Route path="/scholarships" element={<Layout><ScholarshipsPage /></Layout>} />
          <Route path="/deadlines" element={<Layout><DeadlinesPage /></Layout>} />
          <Route path="/profile/:userId" element={<Layout><ProfilePage /></Layout>} />
          <Route path="/account" element={<Layout><AccountPage /></Layout>} />
          <Route path="/admin" element={<Layout><AdminPage /></Layout>} />
          <Route path="/admin/submissions" element={<Layout><AdminPage /></Layout>} />
          <Route path="/about" element={<Layout><AboutPage /></Layout>} />
          <Route path="*" element={
            <Layout>
              <div className="max-w-xl mx-auto px-4 py-20 text-center">
                <p className="font-display text-6xl text-ink mb-4">404</p>
                <p className="text-ink-muted mb-6">Страница не найдена</p>
                <a href="/" className="text-accent hover:underline">← На главную</a>
              </div>
            </Layout>
          } />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
