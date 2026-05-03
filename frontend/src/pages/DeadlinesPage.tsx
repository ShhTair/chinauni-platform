import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Calendar, Clock } from 'lucide-react'
import { deadlinesApi } from '@/lib/api'
import { formatDate, daysUntil, cn } from '@/lib/utils'
import type { UpcomingDeadline } from '@/types'

export function DeadlinesPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['deadlines', 'upcoming'],
    queryFn: () => deadlinesApi.upcoming(),
  })

  const deadlines: UpcomingDeadline[] = data?.data || []

  // Group by month
  const grouped: Record<string, UpcomingDeadline[]> = {}
  for (const d of deadlines) {
    if (!d.deadline_date) continue
    const monthKey = new Date(d.deadline_date).toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' })
    if (!grouped[monthKey]) grouped[monthKey] = []
    grouped[monthKey].push(d)
  }

  return (
    <div className="max-w-[96%] mx-auto px-4 sm:px-6 py-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <p className="text-xs font-semibold text-accent uppercase tracking-wider mb-2">📅 Даты</p>
        <h1 className="font-display text-5xl text-ink mb-3">Дедлайны</h1>
        <p className="text-ink-muted max-w-xl">
          Ближайшие дедлайны подачи по всем университетам. Следите и не пропустите раунды R1/R2/R3.
        </p>
      </motion.div>

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-20 bg-surface rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : deadlines.length === 0 ? (
        <div className="text-center py-20">
          <Calendar size={40} className="text-ink-faint mx-auto mb-4" />
          <p className="text-ink-muted">Нет предстоящих дедлайнов</p>
        </div>
      ) : (
        <div className="space-y-10">
          {Object.entries(grouped).map(([month, items], gi) => (
            <motion.section
              key={month}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: gi * 0.1 }}
            >
              <h2 className="font-display text-2xl text-ink mb-4 capitalize">{month}</h2>
              <div className="space-y-2">
                {items.map((d, i) => {
                  const days = daysUntil(d.deadline_date)
                  const urgent = days !== null && days <= 7
                  const soon = days !== null && days <= 30

                  return (
                    <motion.div
                      key={d.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04 }}
                      className={cn(
                        'bg-surface border rounded-2xl p-4 flex flex-wrap items-center gap-4 hover:shadow-card transition-all',
                        urgent ? 'border-red-300 bg-red-50/30' : 'border-border hover:border-border-strong'
                      )}
                    >
                      {/* Date */}
                      <div className="w-16 text-center flex-shrink-0">
                        <div className={cn(
                          'font-mono-data text-2xl font-bold',
                          urgent ? 'text-red-600' : soon ? 'text-amber-600' : 'text-ink'
                        )}>
                          {new Date(d.deadline_date!).getDate()}
                        </div>
                        <div className="text-xs text-ink-muted">
                          {new Date(d.deadline_date!).toLocaleDateString('en-US', { month: 'short' })}
                        </div>
                      </div>

                      {/* Uni logo */}
                      <div className="w-10 h-10 rounded-xl bg-bg flex items-center justify-center flex-shrink-0 overflow-hidden">
                        {d.university_logo ? (
                          <img src={d.university_logo} alt="" className="w-8 h-8 object-contain" />
                        ) : (
                          <span className="text-lg">🏛</span>
                        )}
                      </div>

                      {/* Name */}
                      <div className="flex-1 min-w-0">
                        <Link
                          to={`/universities/${d.university_slug}`}
                          className="font-medium text-sm text-ink hover:text-accent transition-colors"
                        >
                          {d.university_name}
                        </Link>
                        <div className="flex items-center gap-2 mt-0.5">
                          {d.round_label && (
                            <span className="badge bg-bg text-ink-muted border border-border text-[10px]">
                              {d.round_label}
                            </span>
                          )}
                          {d.scholarship_eligible && (
                            <span className="badge bg-green-50 text-green-700 border border-green-200 text-[10px]">
                              Стипендия ✓
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Countdown */}
                      {days !== null && (
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          <Clock size={13} className={urgent ? 'text-red-500' : 'text-ink-muted'} />
                          <span className={cn(
                            'font-mono-data text-sm font-bold',
                            urgent ? 'text-red-600' : soon ? 'text-amber-600' : 'text-ink-muted'
                          )}>
                            {days <= 0 ? 'Сегодня!' : `${days} дн.`}
                          </span>
                        </div>
                      )}
                    </motion.div>
                  )
                })}
              </div>
            </motion.section>
          ))}
        </div>
      )}
    </div>
  )
}
