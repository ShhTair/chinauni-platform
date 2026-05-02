import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { ExternalLink, Calendar, Gift } from 'lucide-react'
import { scholarshipsApi } from '@/lib/api'
import { formatCNY, formatDate, cn } from '@/lib/utils'
import type { Scholarship } from '@/types'

const TYPE_CONFIG: Record<string, { label: string; color: string }> = {
  full: { label: 'Полная', color: 'bg-green-50 text-green-700 border-green-200' },
  partial: { label: 'Частичная', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  tuition_only: { label: 'Только обучение', color: 'bg-purple-50 text-purple-700 border-purple-200' },
  national: { label: 'Государственная', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  provincial: { label: 'Провинциальная', color: 'bg-cyan-50 text-cyan-700 border-cyan-200' },
}

export function ScholarshipsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['scholarships'],
    queryFn: () => scholarshipsApi.list(),
  })

  const scholarships: Scholarship[] = data?.data || []
  const national = scholarships.filter((s) => !s.university_id)
  const university = scholarships.filter((s) => s.university_id)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <p className="text-xs font-semibold text-accent uppercase tracking-wider mb-2">💰 Финансирование</p>
        <h1 className="font-display text-5xl text-ink mb-3">Стипендии</h1>
        <p className="text-ink-muted max-w-xl">
          Государственные, провинциальные и университетские стипендии для студентов из Казахстана и СНГ.
        </p>
      </motion.div>

      {/* National scholarships */}
      {national.length > 0 && (
        <section className="mb-12">
          <h2 className="font-display text-2xl text-ink mb-6">Государственные стипендии</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {national.map((s, i) => (
              <ScholarshipCard key={s.id} scholarship={s} index={i} featured />
            ))}
          </div>
        </section>
      )}

      {/* University scholarships */}
      {university.length > 0 && (
        <section>
          <h2 className="font-display text-2xl text-ink mb-6">Университетские стипендии</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {university.map((s, i) => (
              <ScholarshipCard key={s.id} scholarship={s} index={i} />
            ))}
          </div>
        </section>
      )}

      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-48 bg-surface rounded-2xl animate-pulse" />
          ))}
        </div>
      )}
    </div>
  )
}

function ScholarshipCard({ scholarship: s, index, featured }: {
  scholarship: Scholarship; index: number; featured?: boolean
}) {
  const typeCfg = TYPE_CONFIG[s.type || ''] || { label: s.type || '', color: 'bg-border text-ink' }
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      className={cn(
        'bg-surface border rounded-2xl p-6 hover:shadow-card-hover transition-shadow',
        featured ? 'border-gold/40 bg-gradient-to-br from-surface to-amber-50/30' : 'border-border'
      )}
    >
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          {featured && <Gift size={16} className="text-gold flex-shrink-0" />}
          <h3 className="font-display text-lg text-ink leading-tight">{s.name}</h3>
        </div>
        <span className={cn('badge border text-[10px] flex-shrink-0', typeCfg.color)}>
          {typeCfg.label}
        </span>
      </div>

      {s.coverage && <p className="text-sm text-ink-muted mb-3 leading-relaxed">{s.coverage}</p>}

      {s.amount_cny_yr && (
        <p className="font-mono-data text-2xl font-bold text-accent mb-3">{formatCNY(s.amount_cny_yr)}</p>
      )}

      {s.conditions && (
        <div className="bg-bg rounded-lg p-3 mb-3">
          <p className="text-xs text-ink-muted">{s.conditions}</p>
        </div>
      )}

      <div className="flex items-center justify-between">
        {s.deadline && (
          <div className="flex items-center gap-1 text-xs text-ink-muted">
            <Calendar size={11} /> {formatDate(s.deadline)}
          </div>
        )}
        {s.renewable && <span className="text-xs text-green-600">↻ Возобновляемая</span>}
        {s.url && (
          <a href={s.url} target="_blank" rel="noreferrer"
            className="flex items-center gap-1 text-xs text-accent hover:underline ml-auto">
            Подробнее <ExternalLink size={10} />
          </a>
        )}
      </div>

      {s.notes && <p className="text-xs text-ink-muted mt-3 italic">{s.notes}</p>}
    </motion.div>
  )
}
