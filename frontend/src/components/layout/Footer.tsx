import { Link } from 'react-router-dom'

export function Footer() {
  return (
    <footer className="bg-surface border-t border-border mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="font-display text-2xl text-ink mb-2">
              China<span className="text-accent">Uni</span>
            </div>
            <p className="text-sm text-ink-muted leading-relaxed">
              Гид по поступлению в университеты Китая для студентов из Казахстана и СНГ.
            </p>
          </div>

          {/* Explore */}
          <div>
            <h4 className="text-xs font-semibold text-ink uppercase tracking-wider mb-3">Навигация</h4>
            <ul className="space-y-2">
              {[
                { href: '/universities', label: 'Каталог' },
                { href: '/scholarships', label: 'Стипендии' },
                { href: '/deadlines', label: 'Дедлайны' },
                { href: '/compare', label: 'Сравнение' },
              ].map((l) => (
                <li key={l.href}>
                  <Link to={l.href} className="text-sm text-ink-muted hover:text-accent transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-xs font-semibold text-ink uppercase tracking-wider mb-3">Ресурсы</h4>
            <ul className="space-y-2">
              {[
                { href: '/about', label: 'О проекте' },
                { href: '/account', label: 'Личный кабинет' },
              ].map((l) => (
                <li key={l.href}>
                  <Link to={l.href} className="text-sm text-ink-muted hover:text-accent transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Socials */}
          <div>
            <h4 className="text-xs font-semibold text-ink uppercase tracking-wider mb-3">Контакты</h4>
            <ul className="space-y-2">
              <li>
                <a href="https://t.me/chinauni_kz" target="_blank" rel="noreferrer" className="text-sm text-ink-muted hover:text-accent transition-colors flex items-center gap-1">
                  Telegram канал →
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-ink-faint">
            © {new Date().getFullYear()} ChinaUni. Все права защищены.
          </p>
          <p className="text-xs text-ink-faint">
            Данные носят информационный характер. Проверяйте актуальность на сайтах университетов.
          </p>
        </div>
      </div>
    </footer>
  )
}
