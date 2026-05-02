import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import { ArrowRight, MapPin, GraduationCap, Users, BookOpen, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { UniCardGrid } from '@/components/universities/UniCard'
import { AuthModal } from '@/components/layout/AuthModal'
import { universitiesApi, deadlinesApi } from '@/lib/api'
import { formatDate, daysUntil, cn } from '@/lib/utils'
import type { University, UpcomingDeadline } from '@/types'

const STATS = [
  { icon: GraduationCap, value: '70+', label: 'Университетов в базе' },
  { icon: BookOpen, value: '300+', label: 'Программ на английском' },
  { icon: Users, value: '2000+', label: 'Студентов из СНГ' },
  { icon: MapPin, value: '15', label: 'Провинций Китая' },
]

const FEATURED_SLUGS = ['sjtu', 'cuhk-sz', 'nyu-shanghai', 'zju', 'fudan', 'xjtlu']

export function HomePage() {
  const [authOpen, setAuthOpen] = useState(false)
  const { scrollY } = useScroll()
  const heroY = useTransform(scrollY, [0, 400], [0, 120])
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0])

  const { data: uniData } = useQuery({
    queryKey: ['universities', 'featured'],
    queryFn: () => universitiesApi.list({ sort: 'prestige_desc', limit: 50 }),
  })

  const { data: deadlineData } = useQuery({
    queryKey: ['deadlines', 'upcoming'],
    queryFn: () => deadlinesApi.upcoming(),
  })

  const featured: University[] = uniData?.data?.items?.filter((u: University) =>
    FEATURED_SLUGS.includes(u.slug)
  ) || []

  const deadlines: UpcomingDeadline[] = deadlineData?.data?.slice(0, 5) || []

  return (
    <div className="min-h-screen">
      {/* ── Hero ──────────────────────────────────────────────────── */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden">
        {/* Background */}
        <motion.div
          className="absolute inset-0"
          style={{ y: heroY }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#0A0F1C] via-[#1a1224] to-[#0A0F1C]" />
          {/* Decorative elements */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-1/4 left-1/3 w-96 h-96 rounded-full bg-accent/20 blur-[120px]" />
            <div className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full bg-[#E8A000]/15 blur-[100px]" />
          </div>
          {/* Subtle grid */}
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
              backgroundSize: '60px 60px',
            }}
          />
          {/* Chinese character decoration */}
          <div className="absolute top-8 right-8 sm:right-16 text-[180px] sm:text-[280px] font-serif text-white/3 leading-none select-none pointer-events-none">
            大
          </div>
          <div className="absolute bottom-8 left-4 sm:left-8 text-[120px] font-serif text-white/3 leading-none select-none pointer-events-none">
            学
          </div>
        </motion.div>

        <motion.div
          className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-24"
          style={{ opacity: heroOpacity }}
        >
          <div className="max-w-3xl">
            {/* Tag */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 border border-white/20 rounded-full px-4 py-1.5 text-white/60 text-xs mb-8 bg-white/5 backdrop-blur-sm"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              Платформа для CIS студентов
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.7 }}
              className="font-display text-5xl sm:text-6xl md:text-7xl text-white leading-[1.1] mb-6"
            >
              Поступи в
              <br />
              <span className="text-accent">китайский</span>
              <br />
              университет
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-white/60 text-lg sm:text-xl max-w-xl mb-10 leading-relaxed"
            >
              Полная база университетов Китая с английскими программами. Стипендии, дедлайны, профили студентов из Казахстана и СНГ.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap items-center gap-4"
            >
              <Link to="/universities">
                <Button size="lg" className="bg-accent hover:bg-accent-dark shadow-accent">
                  Смотреть университеты
                  <ArrowRight size={18} />
                </Button>
              </Link>
              <Button
                size="lg"
                variant="ghost"
                className="text-white/70 hover:text-white hover:bg-white/10"
                onClick={() => setAuthOpen(true)}
              >
                Войти бесплатно
              </Button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-6"
            >
              {STATS.map((stat, i) => (
                <div key={i} className="text-white/80">
                  <div className="flex items-center gap-2 mb-1">
                    <stat.icon size={16} className="text-accent" />
                    <span className="font-display text-2xl text-white">{stat.value}</span>
                  </div>
                  <p className="text-xs text-white/40 leading-tight">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/30"
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <ChevronDown size={24} />
        </motion.div>
      </section>

      {/* ── Upcoming Deadlines Banner ──────────────────────────── */}
      {deadlines.length > 0 && (
        <section className="bg-accent/5 border-y border-accent/20 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
            <div className="flex items-center gap-4 overflow-x-auto hide-scrollbar">
              <span className="text-xs font-semibold text-accent uppercase tracking-wider flex-shrink-0">
                ⏰ Ближайшие дедлайны
              </span>
              <div className="flex items-center gap-3 flex-shrink-0">
                {deadlines.map((d) => {
                  const days = daysUntil(d.deadline_date)
                  return (
                    <Link
                      key={d.id}
                      to={`/universities/${d.university_slug}`}
                      className="flex items-center gap-2 bg-surface border border-border rounded-full px-3 py-1 hover:border-accent transition-colors group"
                    >
                      <span className="text-xs font-medium text-ink group-hover:text-accent transition-colors">
                        {d.university_name}
                      </span>
                      <span className="text-xs text-ink-muted">{d.round_label}</span>
                      <span className={cn(
                        'text-xs font-mono-data font-bold',
                        days !== null && days <= 14 ? 'text-red-600' : 'text-ink-muted'
                      )}>
                        {days !== null ? (days <= 0 ? 'Прошёл' : `${days}д`) : formatDate(d.deadline_date)}
                      </span>
                    </Link>
                  )
                })}
              </div>
              <Link to="/deadlines" className="text-xs text-accent hover:underline flex-shrink-0 ml-auto">
                Все дедлайны →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── Featured Universities ──────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-end justify-between mb-10"
        >
          <div>
            <p className="text-xs font-semibold text-accent uppercase tracking-wider mb-2">Топ университеты</p>
            <h2 className="font-display text-4xl text-ink">Лучшие программы</h2>
            <p className="text-ink-muted mt-2">C9, HK-партнёры и US-дипломы — самые востребованные для CIS студентов</p>
          </div>
          <Link to="/universities" className="hidden sm:flex items-center gap-1 text-sm text-accent hover:underline">
            Все {uniData?.data?.total || ''} университетов <ArrowRight size={14} />
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {featured.slice(0, 6).map((uni, i) => (
            <motion.div
              key={uni.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <UniCardGrid uni={uni} />
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link to="/universities">
            <Button variant="outline" size="lg">
              Смотреть все университеты <ArrowRight size={16} />
            </Button>
          </Link>
        </div>
      </section>

      {/* ── How it works ──────────────────────────────────────── */}
      <section className="bg-surface border-y border-border py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-4xl text-ink mb-3">Как использовать платформу</h2>
            <p className="text-ink-muted max-w-lg mx-auto">
              От выбора университета до подачи заявки — всё в одном месте
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { num: '01', title: 'Изучи каталог', desc: 'Фильтруй по провинции, лиге, языку программ, стоимости и рейтингу QS', icon: '🔍' },
              { num: '02', title: 'Сравни варианты', desc: 'Выбери 2-4 университета и сравни по всем критериям бок о бок', icon: '⚖️' },
              { num: '03', title: 'Заполни анкету', desc: 'Расскажи о своих оценках, опыте и результатах. Помоги другим студентам', icon: '📝' },
              { num: '04', title: 'Следи за дедлайнами', desc: 'Не пропусти раунды подачи R1/R2/R3 — всё в одном календаре', icon: '📅' },
            ].map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-bg rounded-2xl p-6 relative overflow-hidden group hover:shadow-card-hover transition-shadow"
              >
                <div className="text-3xl mb-3">{step.icon}</div>
                <div className="font-mono-data text-xs text-accent mb-2">{step.num}</div>
                <h3 className="font-display text-lg text-ink mb-2">{step.title}</h3>
                <p className="text-sm text-ink-muted leading-relaxed">{step.desc}</p>
                <div className="absolute -bottom-4 -right-4 text-[80px] text-ink/3 font-display select-none">
                  {step.num}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative bg-gradient-to-br from-accent to-accent-dark rounded-3xl p-10 sm:p-16 overflow-hidden text-center noise"
        >
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 text-[200px] font-serif text-white leading-none">中</div>
          </div>
          <div className="relative z-10">
            <h2 className="font-display text-4xl sm:text-5xl text-white mb-4">
              Поступи в Китай<br />в 2025 году
            </h2>
            <p className="text-white/70 max-w-lg mx-auto mb-8 text-lg">
              Зарегистрируйся бесплатно и получи доступ к полной базе — стипендии, дедлайны, отзывы студентов.
            </p>
            <Button
              size="lg"
              className="bg-white text-accent hover:bg-white/90 shadow-lg"
              onClick={() => setAuthOpen(true)}
            >
              Начать бесплатно <ArrowRight size={18} />
            </Button>
          </div>
        </motion.div>
      </section>

      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} defaultTab="register" />
    </div>
  )
}
