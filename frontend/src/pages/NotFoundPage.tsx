import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowLeft, Search } from 'lucide-react'

export function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-lg"
      >
        {/* Big Chinese character */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="text-[120px] leading-none font-display text-accent/10 select-none mb-2"
          aria-hidden="true"
        >
          无
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
          className="font-mono-data text-8xl font-bold text-border mb-4 -mt-6"
        >
          404
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <h1 className="font-display text-3xl text-ink mb-3">Страница не найдена</h1>
          <p className="text-ink-muted mb-8 leading-relaxed">
            Возможно, она была удалена, переименована или никогда не существовала.
            Попробуйте воспользоваться поиском.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/"
              className="flex items-center gap-2 px-6 py-3 bg-accent text-white rounded-xl hover:bg-accent-dark transition-colors font-medium text-sm"
            >
              <ArrowLeft size={16} />
              На главную
            </Link>
            <Link
              to="/universities"
              className="flex items-center gap-2 px-6 py-3 bg-bg border border-border text-ink rounded-xl hover:border-accent/50 transition-colors font-medium text-sm"
            >
              <Search size={16} />
              Каталог университетов
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
