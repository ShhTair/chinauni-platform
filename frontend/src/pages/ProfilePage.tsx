import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { MapPin, User, Mail, BookOpen } from 'lucide-react'
import { profileApi } from '@/lib/api'

export function ProfilePage() {
  const { userId } = useParams<{ userId: string }>()

  const { data, isLoading, error } = useQuery({
    queryKey: ['profile', userId],
    queryFn: () => profileApi.get(userId!),
    enabled: !!userId,
  })

  const profile = data?.data

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20">
        <div className="animate-pulse space-y-4">
          <div className="w-20 h-20 rounded-full bg-border mx-auto" />
          <div className="h-8 bg-border rounded w-48 mx-auto" />
        </div>
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <p className="font-display text-2xl text-ink mb-2">Профиль недоступен</p>
        <p className="text-ink-muted">Профиль скрыт или не существует</p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        {/* Avatar + name */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
            {profile.avatar_url ? (
              <img src={profile.avatar_url} alt="" className="w-full h-full rounded-full object-cover" />
            ) : (
              <User size={32} className="text-accent" />
            )}
          </div>
          <h1 className="font-display text-3xl text-ink">{profile.display_name || 'Студент'}</h1>
          <div className="flex items-center justify-center gap-4 mt-2 text-sm text-ink-muted">
            {profile.country_origin && (
              <span className="flex items-center gap-1">
                🌍 {profile.country_origin}
              </span>
            )}
            {profile.current_city && (
              <span className="flex items-center gap-1">
                <MapPin size={13} /> {profile.current_city}
              </span>
            )}
          </div>
        </div>

        {/* Bio */}
        {profile.bio && (
          <div className="bg-surface border border-border rounded-2xl p-6 mb-6">
            <p className="text-ink-muted leading-relaxed">{profile.bio}</p>
          </div>
        )}

        {/* Student status */}
        {profile.student_status?.length > 0 && (
          <div className="bg-surface border border-border rounded-2xl p-6 mb-6">
            <h3 className="font-display text-xl text-ink mb-4">Статус студента</h3>
            {profile.student_status.map((s: Record<string, unknown>, i: number) => (
              <div key={i} className="flex items-center gap-3 py-2 border-b border-border last:border-0">
                <BookOpen size={16} className="text-ink-muted flex-shrink-0" />
                <div>
                  {s.enrollment_year != null && <span className="text-sm font-medium text-ink">Поступил {String(s.enrollment_year)}</span>}
                  {s.year_of_study != null && <span className="text-sm text-ink-muted ml-2">· {String(s.year_of_study)} курс</span>}
                  {s.degree_level != null && <span className="text-sm text-ink-muted ml-2">· {String(s.degree_level)}</span>}
                  {s.scholarship_received != null && (
                    <span className="ml-2 badge bg-amber-50 text-amber-700 border border-amber-200 text-[10px]">
                      💰 {String(s.scholarship_received)}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Exam scores */}
        {profile.exam_scores?.length > 0 && (
          <div className="bg-surface border border-border rounded-2xl p-6 mb-6">
            <h3 className="font-display text-xl text-ink mb-4">Экзаменационные баллы</h3>
            <div className="flex flex-wrap gap-3">
              {profile.exam_scores.map((e: Record<string, unknown>, i: number) => (
                <div key={i} className="bg-bg rounded-xl px-4 py-2 text-center">
                  <p className="text-xs text-ink-muted">{String(e.exam_type)}</p>
                  <p className="font-mono-data font-bold text-ink text-lg">
                    {e.score ? String(e.score) : e.grade ? String(e.grade) : '—'}
                    {e.subject ? ` (${e.subject})` : ''}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Contacts */}
        <div className="flex justify-center gap-4">
          {profile.tg_username && (
            <a
              href={`https://t.me/${profile.tg_username.replace('@', '')}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 text-sm text-ink-muted hover:text-accent transition-colors"
            >
              ✈ Telegram
            </a>
          )}
          {profile.instagram && (
            <a
              href={`https://instagram.com/${profile.instagram.replace('@', '')}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 text-sm text-ink-muted hover:text-accent transition-colors"
            >
              📸 Instagram
            </a>
          )}
        </div>
      </motion.div>
    </div>
  )
}
