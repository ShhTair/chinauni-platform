import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  MapPin, Globe, ExternalLink, BookOpen,
  DollarSign, Calendar, Users, ChevronRight, Lock
} from 'lucide-react'
import { universitiesApi } from '@/lib/api'
import { useAuthStore } from '@/stores/auth'
import { useCompareStore } from '@/stores/compare'
import { Stars, LeagueBadge, PortalBadge, TierBadge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { AuthModal } from '@/components/layout/AuthModal'
import { formatCNY, formatUSD, formatDate, daysUntil, cn } from '@/lib/utils'
import type { University, Review, Major, Scholarship } from '@/types'

const TABS = ['Overview', 'Majors', 'Scholarships', 'Deadlines', 'Reviews'] as const
type Tab = typeof TABS[number]

export function UniversityDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const { user } = useAuthStore()
  const { toggle, isSelected } = useCompareStore()
  const [tab, setTab] = useState<Tab>('Overview')
  const [authOpen, setAuthOpen] = useState(false)
  const [reviewBody, setReviewBody] = useState('')
  const [reviewRating, setReviewRating] = useState(5)
  const queryClient = useQueryClient()

  const { data, isLoading, error } = useQuery({
    queryKey: ['university', slug],
    queryFn: () => universitiesApi.get(slug!),
    enabled: !!slug,
  })

  const { data: reviewsData } = useQuery({
    queryKey: ['reviews', slug],
    queryFn: () => universitiesApi.getReviews(slug!),
    enabled: !!slug,
  })

  const postReviewMut = useMutation({
    mutationFn: ({ slug, data }: { slug: string; data: { rating: number; body: string } }) =>
      universitiesApi.postReview(slug, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews', slug] })
      setReviewBody('')
    },
  })

  const uni: University | undefined = data?.data
  const reviews: Review[] = reviewsData?.data || []
  const selected = uni ? isSelected(uni.id) : false

  if (isLoading) return (
    <div className="max-w-7xl mx-auto px-4 py-20 text-center">
      <div className="animate-pulse space-y-4">
        <div className="h-64 bg-border rounded-2xl" />
        <div className="h-8 bg-border rounded w-1/2 mx-auto" />
      </div>
    </div>
  )

  if (error || !uni) return (
    <div className="max-w-7xl mx-auto px-4 py-20 text-center">
      <p className="font-display text-2xl text-ink">Университет не найден</p>
      <Link to="/universities" className="text-accent text-sm mt-2 inline-block hover:underline">← К каталогу</Link>
    </div>
  )

  const coverImg = uni.cover_image_url ||
    `https://source.unsplash.com/1400x400/?university,china,${uni.city}&sig=${uni.slug}`

  return (
    <div className="protected-content">
      {/* ── Hero ── */}
      <div className="relative h-64 sm:h-80 overflow-hidden">
        <img
          src={coverImg}
          alt={uni.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

        {/* Breadcrumb */}
        <div className="absolute top-4 left-4 sm:top-6 sm:left-6">
          <Link to="/universities" className="text-white/70 hover:text-white text-sm flex items-center gap-1 transition-colors">
            ← Университеты
          </Link>
        </div>

        {/* Title overlay */}
        <div className="absolute bottom-0 left-0 right-0 px-4 sm:px-8 pb-6">
          <div className="max-w-7xl mx-auto flex items-end justify-between gap-4">
            <div>
              {uni.logo_url && (
                <div className="w-14 h-14 rounded-xl bg-surface shadow-lg overflow-hidden mb-3">
                  <img src={uni.logo_url} alt="" className="w-full h-full object-contain p-1" />
                </div>
              )}
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <LeagueBadge league={uni.league} />
                <PortalBadge status={uni.portal_status} />
                <TierBadge tier={uni.tier} />
              </div>
              <h1 className="font-display text-3xl sm:text-4xl text-white leading-tight">{uni.name}</h1>
              {uni.name_cn && <p className="text-white/70 text-lg mt-0.5">{uni.name_cn}</p>}
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={() => uni && toggle(uni.id)}
                className="bg-white/10 border-white/30 text-white hover:bg-white/20"
              >
                {selected ? '✓ В сравнении' : '⚖ Сравнить'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Quick stats ── */}
      <div className="bg-surface border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-4">
          <div className="flex flex-wrap gap-6">
            {uni.city && (
              <div className="flex items-center gap-1.5 text-sm text-ink-muted">
                <MapPin size={14} /> {uni.city}, {uni.province}
              </div>
            )}
            {uni.qs_rank && (
              <div className="flex items-center gap-1.5 text-sm">
                <Globe size={14} className="text-ink-muted" />
                <span className="font-mono-data font-medium text-ink">QS #{uni.qs_rank}</span>
              </div>
            )}
            <Stars count={uni.prestige_stars} />
            {uni.english_ug && (
              <div className={cn('text-sm font-medium', uni.english_ug === 'yes' ? 'text-green-600' : 'text-ink-muted')}>
                {uni.english_ug === 'yes' ? '✓ English programs' : uni.english_ug === 'partial' ? '~ Partial English' : 'No English'}
              </div>
            )}
            {uni.ielts_min && (
              <div className="text-sm font-mono-data text-ink-muted">IELTS {uni.ielts_min}+</div>
            )}
          </div>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="bg-surface border-b border-border sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="flex gap-0 overflow-x-auto">
            {TABS.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={cn(
                  'px-4 py-3 text-sm font-medium border-b-2 transition-all whitespace-nowrap',
                  tab === t
                    ? 'border-accent text-accent'
                    : 'border-transparent text-ink-muted hover:text-ink'
                )}
              >
                {t}
              </button>
            ))}
            <Link
              to={`/universities/${slug}/apply`}
              className="ml-auto px-4 py-3 text-sm font-medium text-white bg-accent hover:bg-accent-dark transition-colors self-center my-1 rounded-lg flex-shrink-0"
            >
              Заполнить анкету
            </Link>
          </div>
        </div>
      </div>

      {/* ── Tab content ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {tab === 'Overview' && <OverviewTab uni={uni} isAuth={!!user} onAuth={() => setAuthOpen(true)} />}
          {tab === 'Majors' && <MajorsTab majors={uni.majors || []} />}
          {tab === 'Scholarships' && <ScholarshipsTab scholarships={uni.scholarships || []} />}
          {tab === 'Deadlines' && <DeadlinesTab deadlines={uni.deadlines || []} />}
          {tab === 'Reviews' && (
            <ReviewsTab
              reviews={reviews}
              isAuth={!!user}
              onAuth={() => setAuthOpen(true)}
              onSubmit={(body, rating) => postReviewMut.mutate({ slug: slug!, data: { body, rating } })}
              submitting={postReviewMut.isPending}
              reviewBody={reviewBody}
              setReviewBody={setReviewBody}
              reviewRating={reviewRating}
              setReviewRating={setReviewRating}
            />
          )}
        </motion.div>
      </div>

      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </div>
  )
}

// ── Overview Tab ────────────────────────────────────────────────────────────
function OverviewTab({ uni, isAuth, onAuth }: { uni: University; isAuth: boolean; onAuth: () => void }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Main info */}
      <div className="lg:col-span-2 space-y-6">
        {uni.notes_public && (
          <div>
            <h3 className="font-display text-2xl text-ink mb-3">Об университете</h3>
            <p className="text-ink-muted leading-relaxed">{uni.notes_public}</p>
          </div>
        )}

        {/* Key stats grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {[
            { label: 'Стоимость обучения', value: formatCNY(uni.tuition_cny_yr), icon: DollarSign },
            { label: 'Вступительный взнос', value: formatUSD(uni.app_fee_usd), icon: DollarSign },
            { label: 'IELTS минимум', value: uni.ielts_min ? `${uni.ielts_min}` : '—', icon: BookOpen },
            { label: 'QS Rank', value: uni.qs_rank ? `#${uni.qs_rank}` : '—', icon: Globe },
            { label: 'THE Rank', value: uni.the_rank ? `#${uni.the_rank}` : '—', icon: Globe },
            { label: 'Иностранных студентов', value: uni.intl_pct ? `${uni.intl_pct}%` : '—', icon: Users },
          ].map((item, i) => (
            <div key={i} className="bg-bg rounded-xl p-4">
              <p className="text-xs text-ink-muted mb-1">{item.label}</p>
              <p className="font-mono-data font-semibold text-ink text-lg">{item.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Links card */}
      <div className="space-y-4">
        <div className="bg-surface border border-border rounded-2xl p-5">
          <h3 className="font-medium text-ink mb-4 text-sm">Полезные ссылки</h3>
          {!isAuth ? (
            <div className="text-center py-4">
              <Lock size={20} className="text-ink-muted mx-auto mb-2" />
              <p className="text-xs text-ink-muted mb-3">Войдите для просмотра ссылок на порталы</p>
              <Button size="sm" onClick={onAuth}>Войти</Button>
            </div>
          ) : (
            <div className="space-y-2">
              {[
                { url: uni.url_portal, label: '🌐 Портал подачи' },
                { url: uni.url_info, label: '📄 Официальный сайт' },
                { url: uni.url_majors, label: '📚 Специальности' },
                { url: uni.url_scholarships, label: '💰 Стипендии' },
                { url: uni.url_deadlines, label: '📅 Дедлайны' },
                { url: uni.google_maps_url, label: '📍 Google Maps' },
              ]
                .filter((l) => l.url)
                .map((link) => (
                  <a
                    key={link.label}
                    href={link.url!}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between p-2.5 rounded-lg hover:bg-bg transition-colors group text-sm"
                  >
                    <span className="text-ink group-hover:text-accent transition-colors">{link.label}</span>
                    <ExternalLink size={12} className="text-ink-muted" />
                  </a>
                ))}
            </div>
          )}
        </div>

        <Link to={`/universities/${uni.slug}/apply`}>
          <div className="bg-accent rounded-2xl p-5 text-white text-center hover:bg-accent-dark transition-colors">
            <p className="font-display text-xl mb-1">Подать заявку</p>
            <p className="text-white/70 text-xs mb-3">Заполни анкету — помоги другим студентам</p>
            <Button className="bg-white text-accent hover:bg-white/90 w-full" size="sm">
              Открыть анкету <ChevronRight size={14} />
            </Button>
          </div>
        </Link>
      </div>
    </div>
  )
}

// ── Majors Tab ───────────────────────────────────────────────────────────────
function MajorsTab({ majors }: { majors: Major[] }) {
  if (!majors.length) return <p className="text-ink-muted">Информация о специальностях пока не добавлена.</p>
  return (
    <div>
      <h3 className="font-display text-2xl text-ink mb-6">Специальности</h3>
      <div className="overflow-x-auto rounded-2xl border border-border">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-bg">
              <th className="px-4 py-3 text-left text-xs font-semibold text-ink-muted uppercase tracking-wider">Название</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-ink-muted uppercase tracking-wider">Направление</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-ink-muted uppercase tracking-wider">Язык</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-ink-muted uppercase tracking-wider">Срок</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-ink-muted uppercase tracking-wider">Кафедра</th>
            </tr>
          </thead>
          <tbody>
            {majors.map((m, i) => (
              <tr key={m.id} className={cn('border-t border-border hover:bg-bg/50 transition-colors', i % 2 === 0 ? '' : 'bg-bg/20')}>
                <td className="px-4 py-3">
                  <div className="font-medium text-sm text-ink">{m.major_name}</div>
                  {m.notes && <div className="text-xs text-ink-muted mt-0.5">{m.notes}</div>}
                </td>
                <td className="px-4 py-3">
                  {m.field && (
                    <span className="badge bg-blue-50 text-blue-700 border border-blue-200 text-[10px]">{m.field}</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <span className={cn(
                    'text-xs font-medium',
                    m.language === 'English' ? 'text-green-600' :
                    m.language === 'Chinese' ? 'text-red-600' : 'text-amber-600'
                  )}>
                    {m.language || '—'}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-ink-muted">{m.duration || '—'}</td>
                <td className="px-4 py-3 text-xs text-ink-muted max-w-[200px] truncate">{m.department || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ── Scholarships Tab ──────────────────────────────────────────────────────────
function ScholarshipsTab({ scholarships }: { scholarships: Scholarship[] }) {
  if (!scholarships.length) return <p className="text-ink-muted">Информация о стипендиях пока не добавлена.</p>
  return (
    <div>
      <h3 className="font-display text-2xl text-ink mb-6">Стипендии</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {scholarships.map((s) => (
          <div key={s.id} className="bg-surface border border-border rounded-2xl p-5">
            <div className="flex items-start justify-between gap-2 mb-3">
              <h4 className="font-medium text-ink">{s.name}</h4>
              {s.type && (
                <span className={cn(
                  'badge text-[10px]',
                  s.type === 'full' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-blue-50 text-blue-700 border border-blue-200'
                )}>
                  {s.type}
                </span>
              )}
            </div>
            {s.coverage && <p className="text-sm text-ink-muted mb-2">{s.coverage}</p>}
            {s.amount_cny_yr && (
              <p className="font-mono-data text-lg font-bold text-accent mb-2">{formatCNY(s.amount_cny_yr)}</p>
            )}
            {s.conditions && <p className="text-xs text-ink-muted mb-3">{s.conditions}</p>}
            {s.deadline && (
              <p className="text-xs text-ink-muted flex items-center gap-1">
                <Calendar size={11} /> Дедлайн: {formatDate(s.deadline)}
              </p>
            )}
            {s.url && (
              <a href={s.url} target="_blank" rel="noreferrer"
                className="mt-3 flex items-center gap-1 text-xs text-accent hover:underline">
                Подробнее <ExternalLink size={10} />
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Deadlines Tab ──────────────────────────────────────────────────────────────
function DeadlinesTab({ deadlines }: { deadlines: Array<{ id: string; round_label?: string; deadline_date?: string; result_date?: string; scholarship_eligible: boolean; notes?: string }> }) {
  if (!deadlines.length) return <p className="text-ink-muted">Дедлайны пока не добавлены.</p>
  return (
    <div>
      <h3 className="font-display text-2xl text-ink mb-6">Дедлайны подачи</h3>
      <div className="space-y-3">
        {deadlines.map((d, i) => {
          const days = daysUntil(d.deadline_date)
          return (
            <div
              key={d.id}
              className={cn(
                'bg-surface border rounded-2xl p-5 flex flex-wrap items-center gap-4',
                days !== null && days <= 7 ? 'border-red-300 bg-red-50/50' : 'border-border'
              )}
            >
              <div className="flex-shrink-0">
                <span className={cn(
                  'font-mono-data text-3xl font-bold',
                  days !== null && days <= 7 ? 'text-red-600' : 'text-accent'
                )}>
                  {d.round_label || `R${i + 1}`}
                </span>
              </div>
              <div className="flex-1">
                <p className="font-medium text-ink">{formatDate(d.deadline_date)}</p>
                {d.result_date && (
                  <p className="text-xs text-ink-muted">Результаты: {formatDate(d.result_date)}</p>
                )}
                {d.notes && <p className="text-xs text-ink-muted mt-1">{d.notes}</p>}
              </div>
              <div className="flex items-center gap-2">
                {d.scholarship_eligible && (
                  <span className="badge bg-green-50 text-green-700 border border-green-200 text-[10px]">
                    Стипендия ✓
                  </span>
                )}
                {days !== null && (
                  <span className={cn(
                    'font-mono-data text-sm font-bold',
                    days <= 7 ? 'text-red-600' : days <= 30 ? 'text-amber-600' : 'text-ink-muted'
                  )}>
                    {days <= 0 ? 'Прошёл' : `${days} дней`}
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── Reviews Tab ──────────────────────────────────────────────────────────────
function ReviewsTab({
  reviews, isAuth, onAuth, onSubmit, submitting,
  reviewBody, setReviewBody, reviewRating, setReviewRating
}: {
  reviews: Review[]
  isAuth: boolean
  onAuth: () => void
  onSubmit: (body: string, rating: number) => void
  submitting: boolean
  reviewBody: string
  setReviewBody: (v: string) => void
  reviewRating: number
  setReviewRating: (v: number) => void
}) {
  return (
    <div>
      <h3 className="font-display text-2xl text-ink mb-6">Отзывы студентов</h3>

      {/* Write review */}
      {isAuth ? (
        <div className="bg-bg rounded-2xl p-5 mb-8 border border-border">
          <p className="font-medium text-sm text-ink mb-3">Написать отзыв</p>
          <div className="flex gap-1 mb-3">
            {[1,2,3,4,5].map((s) => (
              <button key={s} onClick={() => setReviewRating(s)}>
                <span className={s <= reviewRating ? 'star-filled text-2xl' : 'text-2xl text-border'}>★</span>
              </button>
            ))}
          </div>
          <textarea
            value={reviewBody}
            onChange={(e) => setReviewBody(e.target.value)}
            placeholder="Расскажите о вашем опыте поступления, учёбе, кампусе..."
            className="w-full px-3 py-2 rounded-lg border border-border bg-surface text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 resize-none"
            rows={4}
          />
          <Button
            size="sm"
            className="mt-3"
            loading={submitting}
            onClick={() => reviewBody && onSubmit(reviewBody, reviewRating)}
          >
            Отправить отзыв
          </Button>
          <p className="text-xs text-ink-muted mt-2">Отзыв появится после проверки модератором</p>
        </div>
      ) : (
        <div className="bg-bg rounded-2xl p-5 mb-8 text-center border border-border">
          <p className="text-sm text-ink-muted mb-3">Войдите, чтобы оставить отзыв</p>
          <Button size="sm" onClick={onAuth}>Войти</Button>
        </div>
      )}

      {/* Reviews list */}
      {reviews.length === 0 ? (
        <p className="text-ink-muted text-center py-8">Пока нет отзывов. Будьте первым!</p>
      ) : (
        <div className="space-y-4">
          {reviews.map((r) => (
            <div key={r.id} className="bg-surface border border-border rounded-2xl p-5">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-medium text-sm text-ink">{r.author_name || 'Студент'}</p>
                  <div className="flex gap-px mt-0.5">
                    {[1,2,3,4,5].map((s) => (
                      <span key={s} className={s <= r.rating ? 'star-filled' : 'text-border'}>★</span>
                    ))}
                  </div>
                </div>
                <p className="text-xs text-ink-faint">{formatDate(r.created_at)}</p>
              </div>
              <p className="text-sm text-ink-muted leading-relaxed">{r.body}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
