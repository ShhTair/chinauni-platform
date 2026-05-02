import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { deadlinesApi } from '@/lib/api'
import { LeagueBadge } from '@/components/ui/Badge'
import { daysUntil, cn } from '@/lib/utils'
import type { University } from '@/types'

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

interface TimelineViewProps {
  universities: University[]
}

export function TimelineView({ universities }: TimelineViewProps) {
  const { data } = useQuery({
    queryKey: ['deadlines', 'upcoming'],
    queryFn: () => deadlinesApi.upcoming(),
  })

  const deadlinesByUni = useMemo(() => {
    const map: Record<string, Array<{ month: number; label: string; days: number | null }>> = {}
    if (!data?.data) return map
    for (const d of data.data) {
      if (!d.deadline_date) continue
      const month = new Date(d.deadline_date).getMonth()
      const days = daysUntil(d.deadline_date)
      if (!map[d.university_slug]) map[d.university_slug] = []
      map[d.university_slug].push({ month, label: d.round_label || '?', days })
    }
    return map
  }, [data])

  const unisWithDeadlines = universities.filter((u) => deadlinesByUni[u.slug])

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[800px]">
        {/* Month header */}
        <div className="flex mb-2 pl-48">
          {MONTHS.map((m) => (
            <div key={m} className="timeline-month flex-1">{m}</div>
          ))}
        </div>

        {/* Rows */}
        <div className="space-y-2">
          {unisWithDeadlines.map((uni) => (
            <div key={uni.id} className="flex items-center gap-0">
              {/* Name */}
              <div className="w-48 flex-shrink-0 pr-4">
                <Link to={`/universities/${uni.slug}`} className="text-xs font-medium text-ink hover:text-accent transition-colors line-clamp-2 leading-tight">
                  {uni.name}
                </Link>
                <div className="mt-0.5">
                  <LeagueBadge league={uni.league} />
                </div>
              </div>

              {/* Timeline bar */}
              <div className="flex-1 flex relative h-8">
                {/* Background track */}
                <div className="absolute inset-0 flex">
                  {MONTHS.map((m, i) => (
                    <div key={m} className={`flex-1 ${i % 2 === 0 ? 'bg-bg' : 'bg-surface'} rounded`} />
                  ))}
                </div>

                {/* Deadline markers */}
                {(deadlinesByUni[uni.slug] || []).map((d, i) => (
                  <div
                    key={i}
                    className="absolute top-1/2 -translate-y-1/2"
                    style={{ left: `${(d.month / 12) * 100}%`, transform: 'translate(-50%, -50%)' }}
                  >
                    <div
                      className={cn(
                        'w-3 h-3 rounded-full border-2 border-surface shadow-sm relative group',
                        d.days !== null && d.days <= 14 ? 'bg-red-500' : 'bg-accent'
                      )}
                    >
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block z-10">
                        <div className="bg-ink text-white text-[10px] rounded px-1.5 py-0.5 whitespace-nowrap">
                          {d.label}{d.days !== null ? ` (${d.days}д)` : ''}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {unisWithDeadlines.length === 0 && (
          <div className="text-center py-16 text-ink-muted">
            <p>Нет данных о дедлайнах для выбранных университетов</p>
          </div>
        )}
      </div>
    </div>
  )
}
