import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ModalProps {
  open: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

export function Modal({ open, onClose, title, children, size = 'md' }: ModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              key="modal"
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className={cn(
                'bg-surface rounded-2xl shadow-2xl w-full relative overflow-hidden',
                size === 'sm' && 'max-w-sm',
                size === 'md' && 'max-w-md',
                size === 'lg' && 'max-w-2xl',
                size === 'xl' && 'max-w-4xl',
              )}
            >
              {title && (
                <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-border">
                  <h3 className="font-display text-xl text-ink">{title}</h3>
                  <button
                    onClick={onClose}
                    className="p-1 rounded-lg text-ink-muted hover:text-ink hover:bg-bg transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>
              )}
              {!title && (
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-1 rounded-lg text-ink-muted hover:text-ink hover:bg-bg transition-colors z-10"
                >
                  <X size={18} />
                </button>
              )}
              <div className="p-6">{children}</div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
