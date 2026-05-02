import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Check, X, Users, MessageSquare, Edit3 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/auth'
import { adminApi } from '@/lib/api'
import { Button } from '@/components/ui/Button'

type AdminTab = 'submissions' | 'reviews' | 'users'

export function AdminPage() {
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const [tab, setTab] = useState<AdminTab>('submissions')
  const queryClient = useQueryClient()

  if (!user || (user.role !== 'admin' && user.role !== 'moderator')) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <p className="font-display text-2xl text-ink mb-2">Доступ запрещён</p>
        <p className="text-ink-muted">Требуются права модератора</p>
      </div>
    )
  }

  const { data: submissionsData } = useQuery({
    queryKey: ['admin', 'submissions'],
    queryFn: () => adminApi.submissions('pending'),
    enabled: tab === 'submissions',
  })

  const { data: reviewsData } = useQuery({
    queryKey: ['admin', 'reviews'],
    queryFn: () => adminApi.reviews(false),
    enabled: tab === 'reviews',
  })

  const { data: usersData } = useQuery({
    queryKey: ['admin', 'users'],
    queryFn: () => adminApi.users(),
    enabled: tab === 'users',
  })

  const reviewSubMut = useMutation({
    mutationFn: ({ id, action }: { id: string; action: string }) =>
      adminApi.reviewSubmission(id, action),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'submissions'] }),
  })

  const reviewRevMut = useMutation({
    mutationFn: ({ id, action }: { id: string; action: string }) =>
      adminApi.reviewReview(id, action),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'reviews'] }),
  })

  const submissions = submissionsData?.data || []
  const reviews = reviewsData?.data || []
  const users = usersData?.data || []

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="font-display text-4xl text-ink mb-8">Панель модератора</h1>

      {/* Tabs */}
      <div className="flex gap-1 bg-bg rounded-xl p-1 mb-8 w-fit">
        {([
          { key: 'submissions', label: 'Правки', icon: Edit3, count: submissions.length },
          { key: 'reviews', label: 'Отзывы', icon: MessageSquare, count: reviews.length },
          { key: 'users', label: 'Пользователи', icon: Users },
        ] as const).map(({ key, label, icon: Icon, ...rest }) => {
          const count = 'count' in rest ? rest.count : undefined
          return (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              tab === key ? 'bg-surface text-ink shadow-sm' : 'text-ink-muted hover:text-ink'
            }`}
          >
            <Icon size={14} />
            {label}
            {count !== undefined && count > 0 && (
              <span className="w-5 h-5 rounded-full bg-accent text-white text-xs flex items-center justify-center">
                {count}
              </span>
            )}
          </button>
          )
        })}
      </div>

      {/* Submissions */}
      {tab === 'submissions' && (
        <div className="space-y-3">
          {submissions.length === 0 ? (
            <p className="text-ink-muted text-center py-10">Нет ожидающих правок ✓</p>
          ) : submissions.map((s: Record<string, string>) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-surface border border-border rounded-2xl p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-medium text-ink text-sm">{s.field_name}</p>
                  <p className="text-xs text-ink-muted mt-1">
                    <span className="line-through">{s.old_value || 'пусто'}</span>
                    {' → '}
                    <span className="text-green-700 font-medium">{s.new_value}</span>
                  </p>
                  <p className="text-xs text-ink-faint mt-1">{new Date(s.submitted_at).toLocaleDateString('ru-RU')}</p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <Button
                    size="sm"
                    variant="secondary"
                    className="bg-green-50 text-green-700 hover:bg-green-100"
                    onClick={() => reviewSubMut.mutate({ id: s.id, action: 'approve' })}
                  >
                    <Check size={14} />
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="bg-red-50 text-red-700 hover:bg-red-100"
                    onClick={() => reviewSubMut.mutate({ id: s.id, action: 'reject' })}
                  >
                    <X size={14} />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Reviews */}
      {tab === 'reviews' && (
        <div className="space-y-3">
          {reviews.length === 0 ? (
            <p className="text-ink-muted text-center py-10">Нет ожидающих отзывов ✓</p>
          ) : reviews.map((r: Record<string, unknown>) => (
            <motion.div
              key={String(r.id)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-surface border border-border rounded-2xl p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm text-ink">{String(r.author_name || 'Анон')}</span>
                    <span className="text-amber-500">{'★'.repeat(Number(r.rating))}</span>
                  </div>
                  <p className="text-sm text-ink-muted">{String(r.body)}</p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <Button
                    size="sm"
                    className="bg-green-50 text-green-700 hover:bg-green-100"
                    variant="secondary"
                    onClick={() => reviewRevMut.mutate({ id: String(r.id), action: 'approve' })}
                  >
                    <Check size={14} />
                  </Button>
                  <Button
                    size="sm"
                    className="bg-red-50 text-red-700 hover:bg-red-100"
                    variant="secondary"
                    onClick={() => reviewRevMut.mutate({ id: String(r.id), action: 'reject' })}
                  >
                    <X size={14} />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Users */}
      {tab === 'users' && (
        <div className="overflow-x-auto rounded-2xl border border-border">
          <table className="w-full">
            <thead>
              <tr className="bg-bg border-b border-border">
                <th className="px-4 py-3 text-left text-xs font-semibold text-ink-muted uppercase">Email</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-ink-muted uppercase">Роль</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-ink-muted uppercase">Дата</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u: Record<string, string>) => (
                <tr key={u.id} className="border-t border-border hover:bg-bg/50">
                  <td className="px-4 py-3 text-sm text-ink">{u.email}</td>
                  <td className="px-4 py-3">
                    <span className={`badge text-[10px] ${u.role === 'admin' ? 'bg-red-50 text-red-700 border-red-200 border' : u.role === 'moderator' ? 'bg-blue-50 text-blue-700 border-blue-200 border' : 'bg-bg text-ink-muted border border-border'}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-ink-muted font-mono-data">{u.created_at}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
