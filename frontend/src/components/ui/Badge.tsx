import { cn } from '@/lib/utils'
import { LEAGUE_CONFIG } from '@/lib/utils'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'outline' | 'success' | 'warning' | 'danger'
  className?: string
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'badge',
        variant === 'default' && 'bg-border text-ink',
        variant === 'outline' && 'border border-border text-ink-muted',
        variant === 'success' && 'bg-green-50 text-green-700 border border-green-200',
        variant === 'warning' && 'bg-amber-50 text-amber-700 border border-amber-200',
        variant === 'danger' && 'bg-red-50 text-red-700 border border-red-200',
        className
      )}
    >
      {children}
    </span>
  )
}

export function LeagueBadge({ league }: { league?: string }) {
  if (!league) return null
  const cfg = LEAGUE_CONFIG[league]
  if (!cfg) return null
  return (
    <span
      className="badge text-[10px] font-bold tracking-wider"
      style={{ backgroundColor: cfg.bg, color: cfg.color }}
    >
      {cfg.label}
    </span>
  )
}

export function PortalBadge({ status }: { status?: string }) {
  if (!status) return null
  return (
    <span className={cn('badge border text-[10px]', status === 'OPEN' ? 'portal-open' : 'portal-closed')}>
      {status}
    </span>
  )
}

export function TierBadge({ tier }: { tier?: string }) {
  if (!tier) return null
  const colors: Record<string, string> = {
    REACH: 'bg-red-50 text-red-700 border-red-200',
    TARGET: 'bg-amber-50 text-amber-700 border-amber-200',
    LIKELY: 'bg-green-50 text-green-700 border-green-200',
  }
  return (
    <span className={cn('badge border text-[10px]', colors[tier] || 'bg-border text-ink')}>
      {tier}
    </span>
  )
}

export function Stars({ count }: { count?: number }) {
  if (!count) return null
  return (
    <span className="flex items-center gap-px text-sm">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={i < count ? 'star-filled' : 'text-border'}>
          ★
        </span>
      ))}
    </span>
  )
}
