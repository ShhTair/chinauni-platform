import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MapPin, Globe, BookOpen, CheckSquare, Square } from 'lucide-react'
import { toast } from 'sonner'
import { Stars, LeagueBadge, PortalBadge, TierBadge } from '@/components/ui/Badge'
import { useCompareStore } from '@/stores/compare'
import { formatCNY, formatUSD, cn } from '@/lib/utils'
import type { University } from '@/types'

// ── Grid Card ────────────────────��─────────────────────────��───────────────
export function UniCardGrid({ uni }: { uni: University }) {
  const { toggle, isSelected } = useCompareStore()
  const selected = isSelected(uni.id)

  const coverImg = uni.cover_image_url ||
    `https://source.unsplash.com/400x225/?university,china,campus&sig=${uni.slug}`

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className={cn(
        'bg-surface rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-shadow duration-300 group relative',
        selected && 'ring-2 ring-accent'
      )}
    >
      {/* Compare checkbox */}
      <button
        onClick={(e) => {
          e.preventDefault()
          const adding = !isSelected(uni.id)
          toggle(uni.id)
          if (adding) toast.success(`${uni.name} добавлен в сравнение`, { duration: 2000 })
          else toast(`Убран из сравнения`, { duration: 1500 })
        }}
        className="absolute top-3 right-3 z-10 p-1 rounded-lg bg-surface/90 backdrop-blur-sm hover:bg-surface transition-colors"
      >
        {selected
          ? <CheckSquare size={18} className="text-accent" />
          : <Square size={18} className="text-ink-muted group-hover:text-ink" />
        }
      </button>

      <Link to={`/universities/${uni.slug}`}>
        {/* Cover */}
        <div className="relative h-44 overflow-hidden bg-bg-warm">
          <img
            src={coverImg}
            alt={uni.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

          {/* Logo */}
          {uni.logo_url && (
            <div className="absolute bottom-3 left-3 w-10 h-10 rounded-lg bg-surface flex items-center justify-center shadow-md overflow-hidden">
              <img src={uni.logo_url} alt="" className="w-8 h-8 object-contain" />
            </div>
          )}

          {/* Tier badge */}
          <div className="absolute top-3 left-3">
            <TierBadge tier={uni.tier} />
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-display text-base text-ink leading-tight line-clamp-2 flex-1">
              {uni.name}
            </h3>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            <LeagueBadge league={uni.league} />
            <PortalBadge status={uni.portal_status} />
            {uni.english_ug === 'yes' && (
              <span className="badge bg-blue-50 text-blue-700 border border-blue-200 text-[10px]">
                🇬🇧 English
              </span>
            )}
            {uni.app_fee_usd === 0 && (
              <span className="badge bg-green-50 text-green-700 border border-green-200 text-[10px]">
                Free Apply
              </span>
            )}
          </div>

          {/* Stars */}
          <Stars count={uni.prestige_stars} />

          {/* Stats */}
          <div className="mt-3 space-y-1.5">
            {uni.city && (
              <div className="flex items-center gap-1.5 text-xs text-ink-muted">
                <MapPin size={12} className="flex-shrink-0" />
                <span>{uni.city}, {uni.province}</span>
              </div>
            )}
            {uni.qs_rank && (
              <div className="flex items-center gap-1.5 text-xs text-ink-muted">
                <Globe size={12} className="flex-shrink-0" />
                <span className="font-mono-data">QS #{uni.qs_rank}</span>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="mt-4 pt-3 border-t border-border flex items-center justify-between">
            <span className="text-xs text-ink-muted font-mono-data">
              {formatCNY(uni.tuition_cny_yr)}
            </span>
            <span className="text-xs font-medium text-accent hover:underline">
              Подробнее →
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

// ── List Card ──────────────────────────────────────────────────────────────
export function UniCardList({ uni }: { uni: University }) {
  const { toggle, isSelected } = useCompareStore()
  const selected = isSelected(uni.id)

  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      className={cn(
        'bg-surface rounded-2xl p-4 shadow-card hover:shadow-card-hover transition-all duration-200 group',
        selected && 'ring-2 ring-accent'
      )}
    >
      <Link to={`/universities/${uni.slug}`} className="flex gap-4">
        {/* Logo */}
        <div className="w-14 h-14 rounded-xl bg-bg-warm flex items-center justify-center flex-shrink-0 overflow-hidden">
          {uni.logo_url ? (
            <img src={uni.logo_url} alt="" className="w-10 h-10 object-contain" />
          ) : (
            <BookOpen size={20} className="text-ink-muted" />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-display text-base text-ink leading-tight mb-1">
                {uni.name}
                {uni.name_cn && <span className="ml-2 text-sm text-ink-muted font-sans">{uni.name_cn}</span>}
              </h3>
              <div className="flex flex-wrap items-center gap-1.5">
                <Stars count={uni.prestige_stars} />
                <LeagueBadge league={uni.league} />
                <PortalBadge status={uni.portal_status} />
                {uni.english_ug === 'yes' && (
                  <span className="badge bg-blue-50 text-blue-700 border border-blue-200 text-[10px]">English ✓</span>
                )}
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              {uni.qs_rank && (
                <div className="font-mono-data text-sm text-ink-muted">QS #{uni.qs_rank}</div>
              )}
              <TierBadge tier={uni.tier} />
            </div>
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-ink-muted">
            {uni.city && <span className="flex items-center gap-1"><MapPin size={11} />{uni.city}</span>}
            {uni.tuition_cny_yr && <span className="font-mono-data">{formatCNY(uni.tuition_cny_yr)}</span>}
            {uni.ielts_min && <span className="font-mono-data">IELTS {uni.ielts_min}+</span>}
            <span className="flex items-center gap-1 text-accent font-medium">{formatUSD(uni.app_fee_usd)}</span>
          </div>
        </div>
      </Link>

      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border">
        <button
          onClick={() => {
            const adding = !isSelected(uni.id)
            toggle(uni.id)
            if (adding) toast.success(`${uni.name} добавлен в сравнение`, { duration: 2000 })
            else toast(`Убран из сравнения`, { duration: 1500 })
          }}
          className="text-xs text-ink-muted hover:text-accent flex items-center gap-1 transition-colors"
        >
          {selected ? <CheckSquare size={13} className="text-accent" /> : <Square size={13} />}
          {selected ? 'Убрать из сравнения' : 'Сравнить'}
        </button>
        <Link to={`/universities/${uni.slug}`} className="ml-auto text-xs font-medium text-accent hover:underline">
          Подробнее →
        </Link>
      </div>
    </motion.div>
  )
}
