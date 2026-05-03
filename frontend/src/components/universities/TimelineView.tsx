import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import { Calendar } from 'lucide-react'
import { deadlinesApi } from '@/lib/api'
import { LeagueBadge } from '@/components/ui/Badge'
import { daysUntil, cn } from '@/lib/utils'
import type { University } from '@/types'

const MONTHS = ['Янв','Фев','Мар','Апр','Май','Июн','Июл','Авг','Сен','Окт','Ноя','Дек']
const NOW = new Date()
const YEAR = NOW.getFullYear()

/** 0–1 position within the year for a given date */
function yearFraction(dateStr: string): number {
  const d = new Date(dateStr)
  const start = new Date(YEAR, 0, 1).getTime()
  const end   = new Date(YEAR + 1, 0, 1).getTime()
  return Math.max(0, Math.min(1, (d.getTime() - start) / (end - start)))
}

const todayFraction = yearFraction(NOW.toISOString())

interface Marker {
  pct: number
  label: string
  days: number | null
  date: string
}

interface TimelineViewProps {
  universities: University[]
}

export function TimelineView({ universities }: TimelineViewProps) {
  const { data, isLoading } = useQuery({
    queryKey: ['deadlines', 'upcoming'],
    queryFn: () => deadlinesApi.upcoming(),
  })

  const deadlinesByUni = useMemo(() => {
    const map: Record<string, Marker[]> = {}
    if (!data?.data) return map
    for (const d of data.data) {
      if (!d.deadline_date) continue
      if (!map[d.university_slug]) map[d.university_slug] = []
      map[d.university_slug].push({
        pct: yearFraction(d.deadline_date) * 100,
        label: d.round_label || 'R',
        days: daysUntil(d.deadline_date),
        date: d.deadline_date,
      })
    }
    return map
  }, [data])

  const unisWithDeadlines = universities.filter(u => deadlinesByUni[u.slug])

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 animate-pulse">
            <div className="w-44 h-10 bg-border rounded-lg flex-shrink-0" />
            <div className="flex-1 h-10 bg-border rounded-lg" />
          </div>
        ))}
      </div>
    )
  }

  if (unisWithDeadlines.length === 0) {
    return (
      <div className="text-center py-20 text-ink-muted">
        <Calendar size={40} className="mx-auto mb-3 opacity-30" />
        <p className="font-display text-xl text-ink mb-1">Нет дедлайнов</p>
        <p className="text-sm">Для выбранных университетов дедлайны не добавлены</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto -mx-2 px-2">
      <div className="min-w-[720px]">

        {/* ── Month header ─────────────────────────────────────────────── */}
        <div className="flex mb-1 pl-44">
          <div className="flex-1 relative flex">
            {MONTHS.map((m, i) => (
              <div
                key={m}
                className={cn(
                  'flex-1 text-center text-[10px] font-medium py-1.5 first:rounded-l-lg last:rounded-r-lg',
                  i % 2 === 0 ? 'bg-bg text-ink-muted' : 'bg-surface text-ink-faint'
                )}
              >
                {m}
              </div>
            ))}
            {/* Today marker on header */}
            <div
              className="absolute top-0 bottom-0 w-px bg-accent/60 z-10 pointer-events-none"
              style={{ left: `${todayFraction * 100}%` }}
            />
          </div>
        </div>

        {/* ── Rows ─────────────────────────────────────────────────────── */}
        <div className="space-y-1.5">
          {unisWithDeadlines.map((uni, rowIdx) => (
            <motion.div
              key={uni.id}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: rowIdx * 0.04, duration: 0.25 }}
              className="flex items-center gap-0"
            >
              {/* University name */}
              <div className="w-44 flex-shrink-0 pr-3 text-right">
                <Link
                  to={`/universities/${uni.slug}`}
                  className="text-[11px] font-medium text-ink hover:text-accent transition-colors leading-tight line-clamp-2 block"
                >
                  {uni.name}
                </Link>
                <div className="flex justify-end mt-0.5">
                  <LeagueBadge league={uni.league} />
                </div>
              </div>

              {/* Timeline track */}
              <div className="flex-1 relative h-9">
                {/* Alternating month bands */}
                <div className="absolute inset-0 flex rounded-lg overflow-hidden">
                  {MONTHS.map((m, i) => (
                    <div
                      key={m}
                      className={i % 2 === 0 ? 'flex-1 bg-bg' : 'flex-1 bg-surface'}
                    />
                  ))}
                </div>

                {/* Today line */}
                <div
                  className="absolute top-0 bottom-0 w-px bg-accent/40 z-10 pointer-events-none"
                  style={{ left: `${todayFraction * 100}%` }}
                />

                {/* Deadline dots */}
                {(deadlinesByUni[uni.slug] || []).map((marker, i) => {
                  const urgent   = marker.days !== null && marker.days >= 0 && marker.days <= 14
                  const past     = marker.days !== null && marker.days < 0
                  const upcoming = marker.days !== null && marker.days > 14 && marker.days <= 60

                  return (
                    <div
                      key={i}
                      className="absolute top-1/2 -translate-y-1/2 group z-20"
                      style={{ left: `${marker.pct}%`, transform: 'translate(-50%, -50%)' }}
                    >
                      {/* Dot */}
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: rowIdx * 0.04 + i * 0.05 + 0.1, type: 'spring', stiffness: 400 }}
                        className={cn(
                          'w-3.5 h-3.5 rounded-full border-2 border-surface shadow cursor-pointer',
                          past     ? 'bg-border'      :
                          urgent   ? 'bg-red-500 ring-2 ring-red-200' :
                          upcoming ? 'bg-amber-400'   :
                                     'bg-accent'
                        )}
                      />

                      {/* Tooltip */}
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-30 pointer-events-none">
                        <div className="bg-ink text-white text-[11px] rounded-lg px-2.5 py-1.5 whitespace-nowrap shadow-xl">
                          <p className="font-semibold">{marker.label}</p>
                          <p className="text-white/70">
                            {new Date(marker.date).toLocaleDateString('ru', { day: 'numeric', month: 'short' })}
                          </p>
                          {marker.days !== null && (
                            <p className={cn(
                              'font-mono-data text-[10px] mt-0.5',
                              past ? 'text-white/40' : urgent ? 'text-red-300' : 'text-green-300'
                            )}>
                              {past ? 'Прошёл' : `${marker.days} дн.`}
                            </p>
                          )}
                          {/* Arrow */}
                          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-ink" />
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </motion.div>
          ))}
        </div>

        {/* ── Legend ───────────────────────────────────────────────────── */}
        <div className="flex items-center gap-5 mt-5 pt-4 border-t border-border text-[11px] text-ink-muted pl-44">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" /> Срочно (&lt;14 дн.)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" /> Скоро (&lt;60 дн.)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-accent inline-block" /> Открыт
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-border inline-block" /> Прошёл
          </span>
          <span className="flex items-center gap-1.5 ml-2">
            <span className="w-px h-3 bg-accent/60 inline-block" /> Сегодня
          </span>
        </div>
      </div>
    </div>
  )
}
