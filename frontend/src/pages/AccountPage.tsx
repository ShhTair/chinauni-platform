import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { User, LogOut, Save } from 'lucide-react'
import { useAuthStore } from '@/stores/auth'
import { profileApi } from '@/lib/api'
import { Input, Textarea } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

export function AccountPage() {
  const { user, logout, fetchMe } = useAuthStore()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const [displayName, setDisplayName] = useState('')
  const [countryOrigin, setCountryOrigin] = useState('')
  const [currentCity, setCurrentCity] = useState('')
  const [bio, setBio] = useState('')
  const [isPublic, setIsPublic] = useState(true)
  const [saved, setSaved] = useState(false)

  const updateMut = useMutation({
    mutationFn: () => profileApi.update({
      display_name: displayName,
      country_origin: countryOrigin,
      current_city: currentCity,
      bio,
      is_public: isPublic,
    }),
    onSuccess: () => {
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
      fetchMe()
    },
  })

  useEffect(() => {
    if (!user) navigate('/')
  }, [user])

  if (!user) return null

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="font-display text-4xl text-ink">Личный кабинет</h1>
            <p className="text-ink-muted mt-1">{user.email}</p>
          </div>
          <button
            onClick={() => { logout(); navigate('/') }}
            className="flex items-center gap-2 text-sm text-ink-muted hover:text-red-600 transition-colors"
          >
            <LogOut size={16} /> Выйти
          </button>
        </div>

        {/* Profile form */}
        <div className="bg-surface border border-border rounded-2xl p-6 space-y-5 mb-6">
          <h3 className="font-display text-xl text-ink">Профиль</h3>

          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center">
              <User size={28} className="text-accent" />
            </div>
            <div>
              <p className="text-sm font-medium text-ink">Фото профиля</p>
              <p className="text-xs text-ink-muted">Функция загрузки будет доступна скоро</p>
            </div>
          </div>

          <Input
            label="Отображаемое имя"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Например: Айдана К."
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Страна происхождения"
              value={countryOrigin}
              onChange={(e) => setCountryOrigin(e.target.value)}
              placeholder="Казахстан"
            />
            <Input
              label="Текущий город"
              value={currentCity}
              onChange={(e) => setCurrentCity(e.target.value)}
              placeholder="Шанхай"
            />
          </div>

          <Textarea
            label="О себе"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Расскажите о себе, своём опыте поступления..."
          />

          <div className="flex items-center justify-between p-4 rounded-xl bg-bg border border-border">
            <div>
              <p className="text-sm font-medium text-ink">Публичный профиль</p>
              <p className="text-xs text-ink-muted">Виден другим авторизованным пользователям</p>
            </div>
            <button
              onClick={() => setIsPublic(!isPublic)}
              className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${isPublic ? 'bg-accent' : 'bg-border'}`}
            >
              <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${isPublic ? 'translate-x-7' : 'translate-x-1'}`} />
            </button>
          </div>

          <div className="flex items-center gap-3">
            <Button
              loading={updateMut.isPending}
              onClick={() => updateMut.mutate()}
            >
              <Save size={14} />
              {saved ? 'Сохранено ✓' : 'Сохранить'}
            </Button>
          </div>
        </div>

        {/* Account info */}
        <div className="bg-surface border border-border rounded-2xl p-6 space-y-3">
          <h3 className="font-display text-xl text-ink mb-4">Аккаунт</h3>
          <div className="flex items-center justify-between py-2 border-b border-border">
            <span className="text-sm text-ink-muted">Email</span>
            <span className="text-sm font-medium text-ink">{user.email}</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-border">
            <span className="text-sm text-ink-muted">Роль</span>
            <span className="text-sm font-medium text-ink capitalize">{user.role}</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-ink-muted">Дата регистрации</span>
            <span className="text-sm font-medium text-ink">
              {new Date(user.created_at).toLocaleDateString('ru-RU')}
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
