const fs = require('fs');
const path = '/home/tair/Claude Sandbox/uni_guide/chinauni/frontend/src/pages/UniversitiesPage.tsx';

let content = fs.readFileSync(path, 'utf8');

if (!content.includes("useTranslation")) {
    content = content.replace(
        "import { useState } from 'react';",
        "import { useState } from 'react';\nimport { useTranslation } from 'react-i18next';"
    );
}

// In UniversitiesPage() function
content = content.replace(
  "const [viewMode, setViewMode] = useState<ViewMode>('grid');",
  "const [viewMode, setViewMode] = useState<ViewMode>('grid');\n  const { t } = useTranslation();"
);

// Map over string replacements
content = content.replace(
  "label: 'Сетка'",
  "label: t('grid', 'Сетка')"
);
content = content.replace(
  "label: 'Список'",
  "label: t('list', 'Список')"
);
content = content.replace(
  "label: 'Таблица'",
  "label: t('table', 'Таблица')"
);
content = content.replace(
  "label: 'Карта'",
  "label: t('map_label', 'Карта')"
);
content = content.replace(
  "label: 'Тайм лайн'",
  "label: t('timeline', 'Тайм лайн')"
);
content = content.replace(
  "Загрузка карты...",
  "{t('loading_map', 'Загрузка карты...')}"
);
content = content.replace(
  "Ошибка загрузки. Попробуйте снова.",
  "{t('load_error', 'Ошибка загрузки. Попробуйте снова.')}"
);
content = content.replace(
  "Видите только часть базы",
  "{t('see_partial_db', 'Видите только часть базы')}"
);
content = content.replace(
  "Войдите чтобы увидеть все",
  "{t('login_to_see_all', 'Войдите чтобы увидеть все')}"
);
content = content.replace(
  "университетов, ссылки на порталы и полные данные",
  "{t('universities_portals_data', 'университетов, ссылки на порталы и полные данные')}"
);
content = content.replace(
  "Войти бесплатно",
  "{t('login_free', 'Войти бесплатно')}"
);

fs.writeFileSync(path, content);
