import { motion } from 'framer-motion'
import { ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-xs font-semibold text-accent uppercase tracking-wider mb-2">О проекте</p>
        <h1 className="font-display text-5xl text-ink mb-6">ChinaUni</h1>

        <div className="prose prose-sm max-w-none space-y-4 text-ink-muted leading-relaxed">
          <p className="text-lg text-ink">
            ChinaUni — это краудсорсинговая платформа-гид для студентов из Казахстана и стран СНГ, которые хотят поступить в университеты Китая.
          </p>
          <p>
            Мы собираем и структурируем информацию о ~70 университетах: программы на английском языке, стипендии, дедлайны, рейтинги, стоимость обучения. А главное — реальные истории студентов из СНГ: с какими баллами поступили, какие стипендии получили, на что обратить внимание.
          </p>
          <p>
            Проект существует благодаря вкладу самих студентов. Заполнив анкету, вы помогаете тысячам других абитуриентов принять более взвешенное решение.
          </p>
        </div>

        <div className="mt-10 flex flex-wrap gap-4">
          <a href="https://t.me/chinauni_kz" target="_blank" rel="noreferrer">
            <Button size="lg">
              Telegram канал <ExternalLink size={16} />
            </Button>
          </a>
        </div>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { title: '70+ университетов', desc: 'Полная база с фильтрами, картой и сравнением' },
            { title: 'Краудсорсинг', desc: 'Студенты делятся реальными данными о поступлении' },
            { title: 'Актуальные данные', desc: 'Сообщество помогает поддерживать базу в актуальном состоянии' },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-surface border border-border rounded-2xl p-5"
            >
              <h3 className="font-display text-lg text-ink mb-2">{item.title}</h3>
              <p className="text-sm text-ink-muted">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
