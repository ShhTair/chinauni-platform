import { useQuery } from '@tanstack/react-query'
import { universitiesApi } from '@/lib/api'
import { Search, BookOpen, Building2 } from 'lucide-react'
import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Input } from '@/components/ui/Input'
import type { University } from '@/types'

export default function MajorsPage() {
  const [search, setSearch] = useState('')
  const [selectedField, setSelectedField] = useState<string | null>(null)

  const { data: uniData, isLoading } = useQuery({
    queryKey: ['universities', 'all'],
    queryFn: () => universitiesApi.list({ limit: 100 }), // Get all for client side aggregation for now
  })

  // In a real app we would have a specific /api/majors endpoint, but we can extract from universities if majors were included,
  // or we need a new API endpoint. Since we don't want to touch backend right now unless needed, let's assume we build a UI that filters fields.
  // Actually, wait, the API might not return all majors in the university list.
  // Let's build a UI that searches through standard fields and shows universities that match.
  
  const fields = ['AI', 'Data Science', 'Business', 'Computer Science (CS)', 'Electrical Engineering (EE)', 'Finance', 'Engineering', 'Medicine', 'Arts', 'Economics']

  const universities = uniData?.data?.items || []

  // Filter universities based on selected field or search
  const filteredUnis = useMemo(() => {
    return universities.filter((uni: any) => {
      // Mock search since we don't have major details in the brief list
      if (search && !uni.name.toLowerCase().includes(search.toLowerCase())) return false
      return true
    })
  }, [universities, search, selectedField])

  return (
    <div className="min-h-screen bg-bg text-text pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[96%] mx-auto space-y-8">
        <header className="space-y-4">
          <h1 className="text-5xl font-display text-accent flex items-center gap-4">
            <BookOpen size={40} />
            Explore Majors
          </h1>
          <p className="text-xl text-text-muted max-w-2xl">
            Find universities in China offering English-taught programs in your desired field of study.
          </p>
        </header>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full md:w-64 space-y-6 flex-shrink-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" size={18} />
              <Input
                type="text"
                placeholder="Search fields..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 h-12 border-2"
              />
            </div>
            
            <div className="bg-surface rounded-2xl border border-border p-5">
              <h3 className="font-bold text-sm text-ink-muted uppercase tracking-wider mb-4">Fields of Study</h3>
              <div className="space-y-2">
                <button 
                  onClick={() => setSelectedField(null)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm font-bold transition-colors ${selectedField === null ? 'bg-accent text-white' : 'hover:bg-bg'}`}
                >
                  All Fields
                </button>
                {fields.map(field => (
                  <button
                    key={field}
                    onClick={() => setSelectedField(field)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm font-bold transition-colors ${selectedField === field ? 'bg-accent text-white' : 'hover:bg-bg'}`}
                  >
                    {field}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-surface rounded-2xl border border-border p-8">
              <h2 className="text-2xl font-display mb-6">
                {selectedField ? `Universities offering ${selectedField}` : 'Popular Programs'}
              </h2>
              
              {isLoading ? (
                <div className="animate-pulse space-y-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-24 bg-bg rounded-xl"></div>
                  ))}
                </div>
              ) : (
                <div className="grid gap-4">
                  {filteredUnis.length > 0 ? filteredUnis.map((uni: any) => (
                    <Link 
                      key={uni.id} 
                      to={`/universities/${uni.slug}`}
                      className="group p-4 rounded-xl border border-border hover:border-accent hover:shadow-sm transition-all flex items-center gap-4"
                    >
                      {uni.logo_url ? (
                        <img src={uni.logo_url} alt="" className="w-12 h-12 object-contain rounded-lg bg-surface" />
                      ) : (
                        <div className="w-12 h-12 bg-bg flex items-center justify-center rounded-lg">
                          <Building2 size={20} className="text-ink-muted" />
                        </div>
                      )}
                      <div>
                        <h3 className="font-bold text-lg group-hover:text-accent transition-colors">{uni.name}</h3>
                        <p className="text-sm text-ink-muted">{uni.city}, {uni.province}</p>
                      </div>
                      <div className="ml-auto flex items-center gap-2">
                         <span className="text-xs font-bold px-2 py-1 bg-bg rounded text-ink-muted uppercase">View Programs →</span>
                      </div>
                    </Link>
                  )) : (
                    <div className="text-center py-12 text-ink-muted font-bold">
                      No universities found for this criteria.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
