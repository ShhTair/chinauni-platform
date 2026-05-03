import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, User, LogOut, Settings, ChevronDown, Palette } from 'lucide-react'
import { useAuthStore } from '@/stores/auth'
import { useCompareStore } from '@/stores/compare'
import ThemeLangToggle from './ThemeLangToggle'
import { AuthModal } from './AuthModal'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

const NAV_LINKS = [
  { href: '/universities', translationKey: 'universities' },
  { href: '/majors', translationKey: 'majors' },
  { href: '/scholarships', translationKey: 'scholarships' },
  { href: '/deadlines', translationKey: 'deadlines' },
  { href: '/about', translationKey: 'about' },
]

export function Navbar() {
  const { user, logout } = useAuthStore()
  const { t } = useTranslation()
  const { selectedIds } = useCompareStore()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [authOpen, setAuthOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [location])

  const isHome = location.pathname === '/'

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-40 transition-all duration-300',
          scrolled || !isHome
            ? 'bg-surface/95 backdrop-blur-md border-b border-border shadow-sm'
            : 'bg-transparent'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="font-display text-2xl text-ink leading-none">
              China<span className="text-accent">Uni</span>
            </span>
            <span className="hidden sm:block text-[10px] font-mono-data text-ink-faint border border-border rounded px-1 py-0.5">
              KZ
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  'text-sm font-medium animated-underline transition-colors',
                  location.pathname.startsWith(link.href)
                    ? 'text-accent'
                    : 'text-ink-muted hover:text-ink'
                )}
              >
                {link.translationKey ? t(link.translationKey) : link.label}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <Link
              to="/brandbook"
              title="Design System"
              className={cn(
                'hidden md:flex items-center justify-center w-8 h-8 rounded-lg transition-colors',
                location.pathname === '/brandbook'
                  ? 'text-accent bg-accent/10'
                  : 'text-ink-faint hover:text-ink hover:bg-bg'
              )}
            >
              <Palette size={15} />
            </Link>
            <ThemeLangToggle />
            {/* Compare badge */}
            {selectedIds.length > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
              >
                <Link to="/compare">
                  <Button variant="outline" size="sm" className="hidden sm:flex">
                    {t('compare', 'Сравнить')}
                    <span className="ml-1 w-5 h-5 flex items-center justify-center rounded-full bg-accent text-white text-xs font-bold">
                      {selectedIds.length}
                    </span>
                  </Button>
                </Link>
              </motion.div>
            )}

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-bg transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-accent/10 flex items-center justify-center">
                    <User size={14} className="text-accent" />
                  </div>
                  <span className="hidden sm:block text-sm font-medium text-ink max-w-[120px] truncate">
                    {user.email.split('@')[0]}
                  </span>
                  <ChevronDown size={14} className="text-ink-muted" />
                </button>

                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-48 bg-surface rounded-xl shadow-card-hover border border-border py-1 z-50"
                    >
                      <Link to="/account" className="flex items-center gap-2 px-4 py-2 text-sm text-ink hover:bg-bg transition-colors" onClick={() => setProfileOpen(false)}>
                        <Settings size={14} />
                        Личный кабинет
                      </Link>
                      {user.role !== 'user' && (
                        <Link to="/admin" className="flex items-center gap-2 px-4 py-2 text-sm text-accent hover:bg-bg transition-colors" onClick={() => setProfileOpen(false)}>
                          <Settings size={14} />
                          Администрация
                        </Link>
                      )}
                      <hr className="my-1 border-border" />
                      <button
                        onClick={() => { logout(); setProfileOpen(false) }}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                      >
                        <LogOut size={14} />
                        Выйти
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Button size="sm" onClick={() => setAuthOpen(true)}>
                {t('login')}
              </Button>
            )}

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-bg transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="fixed top-16 left-0 right-0 z-30 bg-surface border-b border-border shadow-lg md:hidden"
          >
            <div className="px-4 py-4 space-y-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="block px-3 py-2 rounded-lg text-sm font-medium text-ink hover:bg-bg transition-colors"
                >
                  {link.translationKey ? t(link.translationKey) : link.label}
                </Link>
              ))}
              {selectedIds.length > 0 && (
                <Link
                  to="/compare"
                  className="block px-3 py-2 rounded-lg text-sm font-medium text-accent hover:bg-bg transition-colors"
                >
                  {t('compare', 'Сравнить')} ({selectedIds.length})
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />

      {/* Close profile dropdown on outside click */}
      {profileOpen && (
        <div className="fixed inset-0 z-20" onClick={() => setProfileOpen(false)} />
      )}
    </>
  )
}
