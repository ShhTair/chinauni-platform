import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { X } from 'lucide-react'
import { useCompareStore } from '@/stores/compare'
import { universitiesApi } from '@/lib/api'
import { LeagueBadge, Stars, PortalBadge } from '@/components/ui/Badge'
import { formatCNY, formatUSD, cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import type { University } from '@/types'

const COMPARE_ROWS: { label: string; key: keyof University; format?: (v: unknown) => string }[] = [
  { label: 'QS Rank', key: 'qs_rank', format: (v) => v ? `#${v}` : '—' },
  { label: 'THE Rank', key: 'the_rank', format: (v) => v ? `#${v}` : '—' },
  { label: 'Рейтинг ★', key: 'prestige_stars', format: (v) => v ? '★'.repeat(v as number) : '—' },
  { label: 'Провинция', key: 'province' },
  { label: 'Тип диплома', key: 'diploma_type' },
  { label: 'Английские программы', key: 'english_ug', format: (v) => v === 'yes' ? '✓ Да' : v === 'partial' ? '~ Частично' : '✗ Нет' },
  { label: 'IELTS минимум', key: 'ielts_min' },
  { label: 'Стоимость обучения', key: 'tuition_cny_yr', format: (v) => formatCNY(v as number) },
  { label: 'Вступительный взнос', key: 'app_fee_usd', format: (v) => formatUSD(v as number) },
  { label: 'Иностранных студентов', key: 'intl_pct', format: (v) => v ? `${v}%` : '—' },
  { label: 'Статус портала', key: 'portal_status' },
  { label: 'Категория', key: 'tier' },
]

export function ComparePage() {
  const { selectedIds, toggle, clear } = useCompareStore()

  const queries = selectedIds.map((id) => {
    // We need slugs, but we only have IDs. We'll fetch the universities list
    // For this implementation, we'll use the full list query and filter
    return id
  })

  const { data } = useQuery({
    queryKey: ['universities', 'all'],
    queryFn: () => universitiesApi.list({ limit: 100 }),
  })

  const allUnis: University[] = data?.data?.items || []
  const unis = selectedIds
    .map((id) => allUnis.find((u) => u.id === id))
    .filter(Boolean) as University[]

  if (selectedIds.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 text-center">
        <div className="text-5xl mb-4">⚖️</div>
        <h1 className="font-display text-4xl text-ink mb-3">Сравнение университетов</h1>
        <p className="text-ink-muted mb-6">Выберите 2-4 университета из каталога для сравнения</p>
        <Link to="/universities">
          <Button>Перейти к каталогу →</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-4xl text-ink">Сравнение</h1>
          <p className="text-ink-muted mt-1">{unis.length} университета</p>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/universities">
            <Button variant="outline" size="sm">+ Добавить</Button>
          </Link>
          <Button variant="ghost" size="sm" onClick={clear}>
            <X size={14} /> Сбросить
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          {/* Uni headers */}
          <thead>
            <tr>
              <th className="w-48 text-left px-4 py-3 text-xs font-semibold text-ink-muted uppercase tracking-wider">
                Критерий
              </th>
              {unis.map((uni) => (
                <th key={uni.id} className="px-4 py-3 text-center min-w-[200px]">
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative"
                  >
                    <button
                      onClick={() => toggle(uni.id)}
                      className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-border hover:bg-red-100 hover:text-red-600 flex items-center justify-center text-ink-muted transition-colors"
                    >
                      <X size={10} />
                    </button>
                    {uni.logo_url ? (
                      <img src={uni.logo_url} alt="" className="w-12 h-12 object-contain mx-auto mb-2" />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-bg mx-auto mb-2 flex items-center justify-center text-xl">🏛</div>
                    )}
                    <Link to={`/universities/${uni.slug}`} className="font-display text-base text-ink hover:text-accent transition-colors block">
                      {uni.name}
                    </Link>
                    <div className="flex items-center justify-center gap-1 mt-1">
                      <LeagueBadge league={uni.league} />
                      <Stars count={uni.prestige_stars} />
                    </div>
                  </motion.div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {COMPARE_ROWS.map((row, i) => {
              const values = unis.map((u) => u[row.key])
              const numericValues = values
                .filter((v) => typeof v === 'number' && v > 0)
                .map((v) => v as number)
              const best = numericValues.length > 0 ? Math.min(...numericValues) : null

              return (
                <tr
                  key={row.key}
                  className={cn('border-t border-border', i % 2 === 0 ? 'bg-surface' : 'bg-bg/30')}
                >
                  <td className="px-4 py-3 text-sm font-medium text-ink-muted">{row.label}</td>
                  {unis.map((uni) => {
                    const raw = uni[row.key]
                    const formatted = row.format ? row.format(raw) : (raw ?? '—')
                    const isBest = typeof raw === 'number' && raw === best && numericValues.length > 1

                    return (
                      <td
                        key={uni.id}
                        className={cn(
                          'px-4 py-3 text-center text-sm',
                          isBest ? 'font-bold text-green-700 bg-green-50' : 'text-ink'
                        )}
                      >
                        <span className="font-mono-data">{String(formatted)}</span>
                        {isBest && <span className="ml-1 text-xs">✓</span>}
                      </td>
                    )
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
