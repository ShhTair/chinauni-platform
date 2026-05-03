const fs = require('fs');

function updateNavbar() {
    const p = 'src/components/layout/Navbar.tsx';
    let c = fs.readFileSync(p, 'utf8');
    if (!c.includes('useTranslation')) {
        c = c.replace("import { Link,", "import { useTranslation } from 'react-i18next'\nimport { Link,");
        
        c = c.replace(
`const NAV_LINKS = [
  { href: '/universities', label: 'Университеты' },
  { href: '/majors', label: 'Специальности' },
  { href: '/scholarships', label: 'Стипендии' },
  { href: '/deadlines', label: 'Дедлайны' },
  { href: '/about', label: 'О проекте' },
]`,
`const NAV_LINKS = [
  { href: '/universities', translationKey: 'universities' },
  { href: '/majors', translationKey: 'majors' },
  { href: '/scholarships', translationKey: 'scholarships' },
  { href: '/deadlines', translationKey: 'deadlines' },
  { href: '/about', translationKey: 'about' },
]`);

        c = c.replace(
            "const { user, logout } = useAuthStore()",
            "const { user, logout } = useAuthStore()\n  const { t } = useTranslation()"
        );

        c = c.replace(/{link\.label}/g, "{link.translationKey ? t(link.translationKey) : link.label}");
        c = c.replace(/>Сравнить</g, ">{t('compare', 'Сравнить')}<");
        c = c.replace(/Сравнить \(\{/g, "{t('compare', 'Сравнить')} ({");
        c = c.replace(/>Войти</g, ">{t('login')}<");

        fs.writeFileSync(p, c);
        console.log("Updated Navbar");
    }
}

function updateUniPage() {
    const p = 'src/pages/UniversitiesPage.tsx';
    let c = fs.readFileSync(p, 'utf8');
    if (!c.includes('useTranslation')) {
        c = c.replace("import { useState", "import { useTranslation } from 'react-i18next'\nimport { useState");
        
        c = c.replace("const [viewMode, setViewMode] = useState<ViewMode>('grid')", "const [viewMode, setViewMode] = useState<ViewMode>('grid')\n  const { t } = useTranslation()");

        c = c.replace("label: 'Сетка'", "label: t('grid', 'Сетка')");
        c = c.replace("label: 'Список'", "label: t('list', 'Список')");
        c = c.replace("label: 'Таблица'", "label: t('table', 'Таблица')");
        c = c.replace("label: 'Карта'", "label: t('map_label', 'Карта')");
        c = c.replace("label: 'Тайм лайн'", "label: t('timeline', 'Тайм лайн')");
        c = c.replace(">Загрузка карты...<", ">{t('loading_map', 'Загрузка карты...')}<");
        c = c.replace(">Ошибка загрузки. Попробуйте снова.<", ">{t('load_error', 'Ошибка загрузки. Попробуйте снова.')}<");
        c = c.replace(">Видите только часть базы<", ">{t('see_partial_db', 'Видите только часть базы')}<");
        c = c.replace(">Войдите чтобы увидеть все ", ">{t('login_to_see_all', 'Войдите чтобы увидеть все')} ");
        c = c.replace("+ университетов, ссылки на порталы и полные данные<", "+ {t('universities_portals_data', 'университетов, ссылки на порталы и полные данные')}<");
        c = c.replace(">Войти бесплатно<", ">{t('login_free', 'Войти бесплатно')}<");

        fs.writeFileSync(p, c);
        console.log("Updated UniPage");
    }
}

updateNavbar();
updateUniPage();
