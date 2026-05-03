import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useAuthStore } from '@/stores/auth'

const schema = z.object({
  email: z.string().email('Введите корректный email'),
  password: z.string().min(6, 'Минимум 6 символов'),
})

type FormData = z.infer<typeof schema>

interface AuthModalProps {
  open: boolean
  onClose: () => void
  defaultTab?: 'login' | 'register'
}

export function AuthModal({ open, onClose, defaultTab = 'login' }: AuthModalProps) {
  const [tab, setTab] = useState<'login' | 'register'>(defaultTab)
  const { login, register } = useAuthStore()
  const { register: rhfRegister, handleSubmit, formState: { errors, isSubmitting }, setError, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    try {
      if (tab === 'login') {
        await login(data.email, data.password)
      } else {
        await register(data.email, data.password)
      }
      toast.success(tab === 'login' ? 'Добро пожаловать! 👋' : 'Аккаунт создан ✓')
      reset()
      onClose()
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail || 'Ошибка. Попробуйте снова.'
      setError('root', { message: msg })
    }
  }

  return (
    <Modal open={open} onClose={onClose} size="sm">
      {/* Logo */}
      <div className="text-center mb-6">
        <div className="text-2xl font-display text-ink mb-1">
          China<span className="text-accent">Uni</span>
        </div>
        <p className="text-sm text-ink-muted">Платформа для поступления в китайские университеты</p>
      </div>

      {/* Tabs */}
      <div className="flex bg-bg rounded-lg p-1 mb-6">
        {(['login', 'register'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-2 text-sm rounded-md font-medium transition-all duration-200 ${
              tab === t
                ? 'bg-surface text-ink shadow-sm'
                : 'text-ink-muted hover:text-ink'
            }`}
          >
            {t === 'login' ? 'Войти' : 'Регистрация'}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Email"
          type="email"
          placeholder="your@email.com"
          error={errors.email?.message}
          {...rhfRegister('email')}
        />
        <Input
          label="Пароль"
          type="password"
          placeholder={tab === 'register' ? 'Минимум 6 символов' : '••••••••'}
          error={errors.password?.message}
          {...rhfRegister('password')}
        />

        {errors.root && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2"
          >
            {errors.root.message}
          </motion.p>
        )}

        <Button type="submit" className="w-full" loading={isSubmitting}>
          {tab === 'login' ? 'Войти' : 'Создать аккаунт'}
        </Button>
      </form>

      <p className="text-xs text-ink-muted text-center mt-4">
        {tab === 'login' ? 'Нет аккаунта? ' : 'Уже есть аккаунт? '}
        <button
          className="text-accent hover:underline"
          onClick={() => setTab(tab === 'login' ? 'register' : 'login')}
        >
          {tab === 'login' ? 'Зарегистрироваться' : 'Войти'}
        </button>
      </p>
    </Modal>
  )
}
