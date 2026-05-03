import { useState, lazy, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import {
  LayoutGrid, List, Table2, Map, GitBranch,
  SlidersHorizontal, ChevronLeft, ChevronRight
} from 'lucide-react'
import { universitiesApi } from '@/lib/api'
import { useFiltersStore, type ViewMode } from '@/stores/filters'
import { useAuthStore } from '@/stores/auth'
import { FilterSidebar } from '@/components/universities/FilterSidebar'
import { UniCardGrid, UniCardList } from '@/components/universities/UniCard'
import { UniTable } from '@/components/universities/UniTable'
import { TimelineView } from '@/components/universities/TimelineView'
import { AuthModal } from '@/components/layout/AuthModal'
import { Button } from '@/components/ui/Button'
import { UniCardGridSkeleton, UniCardListSkeleton, Skeleton } from '@/components/ui/Skeleton'
import type { University } from '@/types'

// Lazy-load Leaflet map (heavy — ~200KB)
const MapView = lazy(() =>
  import('@/components/map/MapView').then(m => ({ default: m.MapView }))
)
function MapLoadingFallback() {
  return (
    <div className="relative rounded-2xl overflow-hidden">
      <Skeleton className="h-[500px] w-full" />
      <div className="absolute inset-0 flex items-center justify-center">
        <p className="text-ink-muted text-sm">Загрузка карты...</p>
      </div>
    </div>
  )
}

const VIEW_BUTTONS: { mode: ViewMode; icon: React.ElementType; label: string }[] = [
  { mode: 'grid', icon: LayoutGrid, label: 'Сетка' },
  { mode: 'list', icon: List, label: 'Список' },
  { mode: 'table', icon: Table2, label: 'Таблица' },
  { mode: 'map', icon: Map, label: 'Карта' },
  { mode: 'timeline', icon: GitBranch, label: 'Тайм лайн' },
]

export function UniversitiesPage() {
  const filters = useFiltersStore()
  const { user } = useAuthStore()
  const [authOpen, setAuthOpen] = useState(false)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  const queryParams = {
    search: filters.search || undefined,
    province: filters.province || undefined,
    league: filters.league || undefined,
    english_ug: filters.english_ug || undefined,
    prestige_min: filters.prestige_min || undefined,
    prestige_max: filters.prestige_max || undefined,
    diploma_type: filters.diploma_type || undefined,
    sort: filters.sort,
    page: filters.page,
    limit: 24,
  }

  const { data, isLoading, error } = useQuery({
    queryKey: ['universities', queryParams],
    queryFn: () => universitiesApi.list(queryParams),
  })

  const universities: University[] = data?.data?.items || []
  const total: number = data?.data?.total || 0
  const pages: number = data?.data?.pages || 1
  const isAuth: boolean = !!user

  return (
    <>
      {/* Header */}
      <div className="bg-surface border-b border-border">
              <div className={`mx-auto px-4 sm:px-6 py-8 transition-all duration-300 ${filters.isFullWidth ? "max-w-[96%]" : "max-w-7xl"}`}>
        <div className="flex gap-6">
          {/* Sidebar */}
          <aside className="hidden md:block w-64 flex-shrink-0">
            <div className="sticky top-20">
              <FilterSidebar />
            </div>
          </aside>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {filters.viewMode === 'map' ? (
              <Suspense fallback={<MapLoadingFallback />}>
                <MapView />
              </Suspense>
            ) : (
              <>
                {isLoading ? (
                  filters.viewMode === 'list' ? (
                    <div className="space-y-3">
                      {Array.from({ length: 8 }).map((_, i) => <UniCardListSkeleton key={i} />)}
                    </div>
                  ) : filters.viewMode === 'table' ? (
                    <div className="space-y-4">
                      <Skeleton className="h-12 w-full" />
                      {Array.from({ length: 10 }).map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                      {Array.from({ length: 9 }).map((_, i) => <UniCardGridSkeleton key={i} />)}
                    </div>
                  )
                ) : error ? (
                  <div className="text-red-500 p-4 border border-red-200 rounded-lg bg-red-50">
                    Failed to load universities.
                  </div>
                ) : (
                  <>
                    {/* View Switcher */}
                    {filters.viewMode === 'grid' && (
                      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                        {universities.map(u => <UniCardGrid key={u.id} uni={u} />)}
                      </div>
                    )}
                    {filters.viewMode === 'list' && (
                      <div className="space-y-3">
                        {universities.map(u => <UniCardList key={u.id} uni={u} />)}
                      </div>
                    )}
                    {filters.viewMode === 'table' && (
                      <UniTable
                        universities={universities}
                        isAuth={!!user}
                        onAuthRequired={() => setAuthOpen(true)}
                      />
                    )}
                    {filters.viewMode === 'timeline' && (
                      <TimelineView universities={universities} />
                    )}

                    {/* Pagination */}
                    {data?.data.pages > 1 && (
                      <div className="mt-8 flex justify-center items-center gap-4">
                        <Button
                          variant="outline"
                          disabled={filters.page === 1}
                          onClick={() => filters.prevPage()}
                        >
                          <ChevronLeft size={18} /> Prev
                        </Button>
                        <span className="font-bold text-sm text-ink-muted">
                          {filters.page} / {data.data.pages}
                        </span>
                        <Button
                          variant="outline"
                          disabled={filters.page === data.data.pages}
                          onClick={() => filters.nextPage()}
                        >
                          Next <ChevronRight size={18} />
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      </div>

      {/* Main content */}
      <div className={`mx-auto px-4 sm:px-6 py-8 transition-all duration-300 ${filters.isFullWidth ? "max-w-[96%]" : "max-w-7xl"}`}>
        {filters.viewMode === 'map' ? (
          <Suspense fallback={<MapLoadingFallback />}>
            <MapView />
          </Suspense>
        ) : (
          <div className="flex gap-6">
            {/* Sidebar */}
            <aside className="hidden md:block w-64 flex-shrink-0">
              <div className="sticky top-20">
                <FilterSidebar />
              </div>
            </aside>

            {/* Content */}
            <div className="flex-1 min-w-0">
              {isLoading ? (
                filters.viewMode === 'list' ? (
                  <div className="space-y-3">
                    {Array.from({ length: 8 }).map((_, i) => <UniCardListSkeleton key={i} />)}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {Array.from({ length: 6 }).map((_, i) => <UniCardGridSkeleton key={i} />)}
                  </div>
                )
              ) : error ? (
                <div className="text-center py-20">
                  <p className="text-ink-muted">Ошибка загрузки. Попробуйте снова.</p>
                </div>
              ) : (
                <>
                  {filters.viewMode === 'grid' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                      {universities.map((uni) => (
                        <UniCardGrid key={uni.id} uni={uni} />
                      ))}
                    </div>
                  )}

                  {filters.viewMode === 'list' && (
                    <div className="space-y-3">
                      {universities.map((uni) => (
                        <UniCardList key={uni.id} uni={uni} />
                      ))}
                    </div>
                  )}

                  {filters.viewMode === 'table' && (
                    <UniTable
                      universities={universities}
                      isAuth={isAuth}
                      onAuthRequired={() => setAuthOpen(true)}
                    />
                  )}

                  {filters.viewMode === 'timeline' && (
                    <TimelineView universities={universities} />
                  )}

                  {/* Auth gate for grid/list */}
                  {!isAuth && filters.viewMode !== 'table' && universities.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-8 text-center bg-surface rounded-2xl border border-border p-8"
                    >
                      <p className="font-display text-2xl text-ink mb-2">
                        Видите только часть базы
                      </p>
                      <p className="text-ink-muted mb-4">
                        Войдите чтобы увидеть все {total}+ университетов, ссылки на порталы и полные данные
                      </p>
                      <Button onClick={() => setAuthOpen(true)}>
                        Войти бесплатно
                      </Button>
                    </motion.div>
                  )}

                  {/* Pagination */}
                  {isAuth && pages > 1 && (
                    <div className="flex items-center justify-center gap-3 mt-10">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={filters.prevPage}
                        disabled={filters.page <= 1}
                      >
                        <ChevronLeft size={16} />
                      </Button>
                      <span className="text-sm text-ink-muted font-mono-data">
                        {filters.page} / {pages}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={filters.nextPage}
                        disabled={filters.page >= pages}
                      >
                        <ChevronRight size={16} />
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Mobile sidebar drawer */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-50 md:hidden"
              onClick={() => setMobileSidebarOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              className="fixed top-0 left-0 bottom-0 w-80 bg-bg z-50 md:hidden overflow-y-auto p-4 pt-6"
            >
              <FilterSidebar mobile onClose={() => setMobileSidebarOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  )
}
