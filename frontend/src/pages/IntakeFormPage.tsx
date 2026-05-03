import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import { Check, ChevronRight, ChevronLeft, Copy } from 'lucide-react'
import { toast } from 'sonner'
import { universitiesApi, intakeApi } from '@/lib/api'
import { Input, Select, Textarea } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import type { University } from '@/types'


const EXAM_TYPES = ['IELTS', 'TOEFL', 'Duolingo', 'SAT', 'GPA', 'ENT', 'IB', 'A-Level', 'CSCA', 'HSK', 'Other']
const DEGREE_LEVELS = [
  { value: 'bachelor', label: 'Бакалавриат' },
  { value: 'master', label: 'Магистратура' },
  { value: 'phd', label: 'PhD' },
]
const APP_STATUS = [
  { value: 'applied', label: 'Подал заявку' },
  { value: 'interview', label: 'Интервью' },
  { value: 'offer', label: 'Получил оффер' },
  { value: 'rejected', label: 'Отклонён' },
  { value: 'waitlist', label: 'Лист ожидания' },
]
const EXTRACURRICULAR_LEVELS = [
  { value: 'excellent', label: '🌟 Отличный уровень (олимпиады, международные призы)' },
  { value: 'high', label: '⭐ Высокий (нац. конкурсы, волонтёрство)' },
  { value: 'mid', label: '✓ Средний (школьные клубы, хобби)' },
  { value: 'low', label: '○ Минимальный' },
]
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December']
const YEARS = [2023, 2024, 2025, 2026]

interface FormState {
  // Step 1
  major_id: string
  major_custom: string
  year_of_study: string
  enrollment_year: string
  degree_level: string
  scholarship_received: string
  // Step 2
  exams: { type: string; score: string; grade: string; subject: string; year: string }[]
  // Step 3
  extracurricular_level: string
  extracurricular_description: string
  application_status: string
  scholarship_applied: string
  month_applied: string
  month_interview: string
  month_offer: string
  month_scholarship: string
  // Step 4
  email: string
  tg_username: string
  instagram: string
  is_public: boolean
  agreed: boolean
}

const defaultForm: FormState = {
  major_id: '', major_custom: '', year_of_study: '', enrollment_year: '',
  degree_level: 'bachelor', scholarship_received: '',
  exams: [],
  extracurricular_level: '', extracurricular_description: '',
  application_status: '', scholarship_applied: '',
  month_applied: '', month_interview: '', month_offer: '', month_scholarship: '',
  email: '', tg_username: '', instagram: '', is_public: true, agreed: false,
}

interface IntakeResult {
  account_created: boolean
  email: string
  temp_password?: string
  profile_url: string
  message: string
}

export function IntakeFormPage() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const [form, setForm] = useState<FormState>(defaultForm)
  const [result, setResult] = useState<IntakeResult | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const { data: uniData } = useQuery({
    queryKey: ['university', slug],
    queryFn: () => universitiesApi.get(slug!),
    enabled: !!slug,
  })

  const uni: University | undefined = uniData?.data

  const set = (key: keyof FormState, value: unknown) =>
    setForm((f) => ({ ...f, [key]: value }))

  const toggleExam = (type: string) => {
    const exists = form.exams.find((e) => e.type === type)
    if (exists) {
      set('exams', form.exams.filter((e) => e.type !== type))
    } else {
      set('exams', [...form.exams, { type, score: '', grade: '', subject: '', year: '' }])
    }
  }

  const updateExam = (type: string, field: string, value: string) => {
    set('exams', form.exams.map((e) => e.type === type ? { ...e, [field]: value } : e))
  }

  const handleSubmit = async () => {
    if (!form.agreed) { setError('Необходимо согласие на обработку данных'); return }
    if (!form.email) { setError('Укажите email'); return }
    setSubmitting(true)
    setError('')
    try {
      const payload = {
        university_slug: slug,
        major_id: form.major_id || undefined,
        major_custom: form.major_custom || undefined,
        year_of_study: form.year_of_study ? +form.year_of_study : undefined,
        enrollment_year: form.enrollment_year ? +form.enrollment_year : undefined,
        degree_level: form.degree_level,
        scholarship_received: form.scholarship_received || undefined,
        exam_scores: form.exams.map((e) => ({
          exam_type: e.type,
          score: e.score ? +e.score : undefined,
          grade: e.grade || undefined,
          subject: e.subject || undefined,
          year_taken: e.year ? +e.year : undefined,
        })),
        extracurricular_level: form.extracurricular_level || undefined,
        extracurricular_description: form.extracurricular_description || undefined,
        application_status: form.application_status || undefined,
        scholarship_applied: form.scholarship_applied || undefined,
        month_applied: form.month_applied || undefined,
        month_interview: form.month_interview || undefined,
        month_offer: form.month_offer || undefined,
        month_scholarship: form.month_scholarship || undefined,
        email: form.email,
        tg_username: form.tg_username || undefined,
        instagram: form.instagram || undefined,
        is_public: form.is_public,
        agreed: true,
      }
      const res = await intakeApi.submit(slug!, payload)
      setResult(res.data)
      toast.success('Анкета отправлена! Профиль создан ✓')
    } catch (e: unknown) {
      const msg = (e as { response?: { data?: { detail?: string } } })?.response?.data?.detail || 'Ошибка при отправке'
      setError(msg)
      toast.error(msg)
    } finally {
      setSubmitting(false)
    }
  }

  const copyPassword = () => {
    if (result?.temp_password) {
      navigator.clipboard.writeText(result.temp_password)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  // ── Success screen ──
  if (result) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6"
        >
          <Check size={32} className="text-green-600" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="font-display text-3xl text-ink mb-3">Готово!</h1>
          <p className="text-ink-muted mb-6">{result.message}</p>

          {result.account_created && result.temp_password && (
            <div className="bg-bg border border-border rounded-2xl p-6 text-left mb-6">
              <p className="text-sm font-medium text-ink mb-3">Данные вашего аккаунта:</p>
              <div className="space-y-2">
                <div>
                  <p className="text-xs text-ink-muted">Email</p>
                  <p className="font-mono-data text-sm text-ink">{result.email}</p>
                </div>
                <div>
                  <p className="text-xs text-ink-muted">Временный пароль</p>
                  <div className="flex items-center gap-2">
                    <p className="font-mono-data text-sm text-ink font-bold">{result.temp_password}</p>
                    <button onClick={copyPassword} className="text-accent hover:text-accent-dark">
                      <Copy size={14} />
                    </button>
                    {copied && <span className="text-xs text-green-600">Скопировано!</span>}
                  </div>
                </div>
              </div>
              <p className="text-xs text-ink-muted mt-3">
                ⚠ Данные также отправлены на ваш email. Смените пароль после входа.
              </p>
            </div>
          )}

          <div className="flex flex-col gap-3">
            <Link to={result.profile_url}>
              <Button className="w-full">Открыть мой профиль</Button>
            </Link>
            <Link to="/universities">
              <Button variant="outline" className="w-full">← Вернуться к каталогу</Button>
            </Link>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-8">
        <Link to={`/universities/${slug}`} className="text-sm text-ink-muted hover:text-accent flex items-center gap-1 mb-4">
          ← {uni?.name || 'Университет'}
        </Link>
        <h1 className="font-display text-4xl text-ink mb-2">Анкета студента</h1>
        <p className="text-ink-muted">
          Поделитесь данными о поступлении — помогите другим студентам из СНГ.
          Мы создадим для вас аккаунт автоматически.
        </p>
      </div>
      {/* Step content */}
        <div className="space-y-12">
          <div className="space-y-5">
            <Step1 uni={uni} form={form} set={set} />
          </div>
          <hr className="border-border" />
          <div className="space-y-5">
            <Step2 form={form} toggleExam={toggleExam} updateExam={updateExam} />
          </div>
          <hr className="border-border" />
          <div className="space-y-5">
            <Step3 form={form} set={set} />
          </div>
          <hr className="border-border" />
          <div className="space-y-5">
            <Step4 form={form} set={set} error={error} />
          </div>
        </div>
      {/* Navigation */}
      <div className="mt-10">
        <Button className="w-full" size="lg" loading={submitting} onClick={handleSubmit}>
            Отправить анкету
        </Button>
      </div>

      {error && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 text-sm text-red-600 text-center"
        >
          {error}
        </motion.p>
      )}
    </div>
  )
}

// ── Step 1: University ────────────────────────────────────────────────────────
function Step1({ uni, form, set }: { uni?: University; form: FormState; set: (k: keyof FormState, v: unknown) => void }) {
  const majorOptions = uni?.majors?.map((m) => ({ value: m.id, label: m.major_name })) || []

  return (
    <>
      <h2 className="font-display text-2xl text-ink">Расскажите об университете</h2>

      {uni && (
        <div className="bg-bg rounded-xl p-4 flex items-center gap-3">
          {uni.logo_url && <img src={uni.logo_url} alt="" className="w-10 h-10 object-contain" />}
          <div>
            <p className="font-medium text-ink">{uni.name}</p>
            {uni.city && <p className="text-xs text-ink-muted">{uni.city}, {uni.province}</p>}
          </div>
        </div>
      )}

      <Select
        label="Специальность"
        value={form.major_id}
        onChange={(e) => set('major_id', e.target.value)}
        placeholder="Выберите специальность"
        options={majorOptions}
      />

      <Input
        label="Или введите название специальности вручную"
        value={form.major_custom}
        onChange={(e) => set('major_custom', e.target.value)}
        placeholder="Например: Computer Science"
      />

      <div className="grid grid-cols-2 gap-4">
        <Select
          label="Уровень программы"
          value={form.degree_level}
          onChange={(e) => set('degree_level', e.target.value)}
          options={DEGREE_LEVELS}
        />
        <Select
          label="Курс"
          value={form.year_of_study}
          onChange={(e) => set('year_of_study', e.target.value)}
          placeholder="Выберите курс"
          options={[1,2,3,4,5,6].map((y) => ({ value: String(y), label: `${y} курс` }))}
        />
      </div>

      <Select
        label="Год поступления"
        value={form.enrollment_year}
        onChange={(e) => set('enrollment_year', e.target.value)}
        placeholder="Год"
        options={[2020,2021,2022,2023,2024,2025,2026].map((y) => ({ value: String(y), label: String(y) }))}
      />

      <Input
        label="Стипендия (если есть)"
        value={form.scholarship_received}
        onChange={(e) => set('scholarship_received', e.target.value)}
        placeholder="Например: CSC Full Scholarship"
        hint="Оставьте пустым, если без стипендии"
      />
    </>
  )
}

// ── Step 2: Exams ─────────────────────────────────────────────────────────────
function Step2({ form, toggleExam, updateExam }: {
  form: FormState
  toggleExam: (type: string) => void
  updateExam: (type: string, field: string, value: string) => void
}) {
  return (
    <>
      <h2 className="font-display text-2xl text-ink">Результаты экзаменов</h2>
      <p className="text-sm text-ink-muted">Необязательно. Заполните те, которые сдавали.</p>

      {/* Exam type selector */}
      <div className="flex flex-wrap gap-2">
        {EXAM_TYPES.map((type) => {
          const active = form.exams.some((e) => e.type === type)
          return (
            <button
              key={type}
              onClick={() => toggleExam(type)}
              className={cn(
                'px-3 py-1.5 rounded-full text-sm font-medium border transition-all',
                active ? 'bg-accent text-white border-accent' : 'bg-bg text-ink-muted border-border hover:border-accent'
              )}
            >
              {type}
            </button>
          )
        })}
      </div>

      {/* Exam inputs */}
      {form.exams.map((exam) => (
        <motion.div
          key={exam.type}
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-bg rounded-xl p-4 border border-border"
        >
          <p className="font-medium text-sm text-ink mb-3">{exam.type}</p>
          <div className="grid grid-cols-2 gap-3">
            {exam.type === 'A-Level' ? (
              <>
                <Input
                  label="Предмет"
                  value={exam.subject}
                  onChange={(e) => updateExam(exam.type, 'subject', e.target.value)}
                  placeholder="Mathematics"
                />
                <Select
                  label="Оценка"
                  value={exam.grade}
                  onChange={(e) => updateExam(exam.type, 'grade', e.target.value)}
                  placeholder="Оценка"
                  options={['A*','A','B','C','D','E'].map((g) => ({ value: g, label: g }))}
                />
              </>
            ) : exam.type === 'HSK' ? (
              <Select
                label="Уровень HSK"
                value={exam.score}
                onChange={(e) => updateExam(exam.type, 'score', e.target.value)}
                placeholder="Уровень"
                options={[1,2,3,4,5,6].map((l) => ({ value: String(l), label: `HSK ${l}` }))}
              />
            ) : (
              <Input
                label="Балл"
                type="number"
                value={exam.score}
                onChange={(e) => updateExam(exam.type, 'score', e.target.value)}
                placeholder={
                  exam.type === 'IELTS' ? '0.0 - 9.0' :
                  exam.type === 'SAT' ? '400 - 1600' :
                  exam.type === 'GPA' ? '0 - 4.0 / 5.0' :
                  exam.type === 'ENT' ? '0 - 140' : 'Балл'
                }
              />
            )}
            <Input
              label="Год сдачи"
              type="number"
              value={exam.year}
              onChange={(e) => updateExam(exam.type, 'year', e.target.value)}
              placeholder="2024"
            />
          </div>
        </motion.div>
      ))}
    </>
  )
}

// ── Step 3: Activities & Application ─────────────────────────────────────────
function Step3({ form, set }: { form: FormState; set: (k: keyof FormState, v: unknown) => void }) {
  return (
    <>
      <h2 className="font-display text-2xl text-ink">Активности и поступление</h2>

      {/* Extracurriculars */}
      <div>
        <label className="text-sm font-medium text-ink block mb-2">Уровень внеклассной активности</label>
        <div className="space-y-2">
          {EXTRACURRICULAR_LEVELS.map((l) => (
            <button
              key={l.value}
              onClick={() => set('extracurricular_level', l.value)}
              className={cn(
                'w-full text-left px-4 py-3 rounded-xl border transition-all text-sm',
                form.extracurricular_level === l.value
                  ? 'border-accent bg-accent/5 text-ink'
                  : 'border-border bg-bg hover:border-accent/50 text-ink-muted'
              )}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>

      <Textarea
        label="Описание активностей (необязательно)"
        value={form.extracurricular_description}
        onChange={(e) => set('extracurricular_description', e.target.value)}
        placeholder="Расскажите о своих достижениях, волонтёрстве, проектах..."
      />

      <Select
        label="Статус заявки"
        value={form.application_status}
        onChange={(e) => set('application_status', e.target.value)}
        placeholder="Выберите статус"
        options={APP_STATUS}
      />

      <Input
        label="На какую стипендию подавали"
        value={form.scholarship_applied}
        onChange={(e) => set('scholarship_applied', e.target.value)}
        placeholder="CSC, SJTU Scholarship, и т.д."
      />

      {/* Timeline */}
      <div className="grid grid-cols-2 gap-4">
        <Select
          label="Дата подачи заявки"
          value={form.month_applied}
          onChange={(e) => set('month_applied', e.target.value)}
          placeholder="Месяц/год"
          options={YEARS.flatMap((y) => MONTHS.map((m) => ({ value: `${m} ${y}`, label: `${m} ${y}` })))}
        />
        <Select
          label="Дата интервью"
          value={form.month_interview}
          onChange={(e) => set('month_interview', e.target.value)}
          placeholder="Не было"
          options={[{ value: 'none', label: 'Не было' }, ...YEARS.flatMap((y) => MONTHS.map((m) => ({ value: `${m} ${y}`, label: `${m} ${y}` })))]}
        />
        <Select
          label="Дата оффера"
          value={form.month_offer}
          onChange={(e) => set('month_offer', e.target.value)}
          placeholder="Нет"
          options={[{ value: 'none', label: 'Нет' }, ...YEARS.flatMap((y) => MONTHS.map((m) => ({ value: `${m} ${y}`, label: `${m} ${y}` })))]}
        />
        <Select
          label="Стипендия подтверждена"
          value={form.month_scholarship}
          onChange={(e) => set('month_scholarship', e.target.value)}
          placeholder="Нет"
          options={[{ value: 'none', label: 'Нет' }, ...YEARS.flatMap((y) => MONTHS.map((m) => ({ value: `${m} ${y}`, label: `${m} ${y}` })))]}
        />
      </div>
    </>
  )
}

// ── Step 4: Account ───────────────────────────────────────────────────────────
function Step4({ form, set, error }: {
  form: FormState
  set: (k: keyof FormState, v: unknown) => void
  error: string
}) {
  return (
    <>
      <h2 className="font-display text-2xl text-ink">Создать аккаунт</h2>
      <p className="text-sm text-ink-muted">
        Мы автоматически создадим аккаунт и вышлем пароль на почту.
        Все поля кроме email — необязательные.
      </p>

      <Input
        label="Email"
        type="email"
        value={form.email}
        onChange={(e) => set('email', e.target.value)}
        placeholder="your@email.com"
        required
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Telegram"
          value={form.tg_username}
          onChange={(e) => set('tg_username', e.target.value)}
          placeholder="@username"
        />
        <Input
          label="Instagram"
          value={form.instagram}
          onChange={(e) => set('instagram', e.target.value)}
          placeholder="@username"
        />
      </div>

      {/* Visibility toggle */}
      <div className="flex items-center justify-between p-4 rounded-xl bg-bg border border-border">
        <div>
          <p className="text-sm font-medium text-ink">Публичный профиль</p>
          <p className="text-xs text-ink-muted">Другие студенты смогут видеть ваш профиль</p>
        </div>
        <button
          onClick={() => set('is_public', !form.is_public)}
          className={cn(
            'relative w-12 h-6 rounded-full transition-colors duration-200',
            form.is_public ? 'bg-accent' : 'bg-border'
          )}
        >
          <span className={cn(
            'absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200',
            form.is_public ? 'translate-x-7' : 'translate-x-1'
          )} />
        </button>
      </div>

      {/* Consent */}
      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={form.agreed}
          onChange={(e) => set('agreed', e.target.checked)}
          className="mt-0.5 w-4 h-4 rounded accent-accent"
        />
        <span className="text-sm text-ink-muted">
          Я согласен(-на) на обработку данных в соответствии с{' '}
          <span className="text-accent hover:underline cursor-pointer">политикой конфиденциальности</span>.
          Данные будут использованы анонимно для помощи другим студентам.
        </span>
      </label>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>
      )}
    </>
  )
}
