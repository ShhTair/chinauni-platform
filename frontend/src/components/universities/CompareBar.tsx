import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { X } from 'lucide-react'
import { useCompareStore } from '@/stores/compare'
import { Button } from '@/components/ui/Button'

export function CompareBar() {
  const { selectedIds, toggle, clear } = useCompareStore()

  return (
    <AnimatePresence>
      {selectedIds.length > 0 && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
        >
          <div className="bg-ink rounded-2xl shadow-2xl px-5 py-3 flex items-center gap-4 min-w-[320px]">
            <div className="flex items-center gap-1">
              {selectedIds.map((id, i) => (
                <motion.div
                  key={id}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-8 h-8 rounded-lg bg-surface/10 flex items-center justify-center text-xs text-white font-bold"
                >
                  {i + 1}
                </motion.div>
              ))}
              {Array.from({ length: 4 - selectedIds.length }).map((_, i) => (
                <div
                  key={`empty-${i}`}
                  className="w-8 h-8 rounded-lg border border-dashed border-white/20 flex items-center justify-center text-white/20 text-xs"
                >
                  +
                </div>
              ))}
            </div>

            <div className="flex-1 text-sm text-white/70">
              <span className="text-white font-medium">{selectedIds.length}</span> выбрано для сравнения
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={clear}
                className="text-white/40 hover:text-white/80 transition-colors p-1"
              >
                <X size={14} />
              </button>
              <Link to="/compare">
                <Button size="sm" className="bg-accent hover:bg-accent-dark text-white">
                  Сравнить →
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
