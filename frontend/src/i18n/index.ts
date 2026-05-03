import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      "home": "Home",
      "universities": "Universities",
      "majors": "Majors",
      "scholarships": "Scholarships",
      "deadlines": "Deadlines",
      "about": "About Project",
      "map": "Map",
      "login": "Login",
      "dark_mode": "Dark Mode",
      "light_mode": "Light Mode",
      "language": "Language",
      "search": "Search",
      "filters": "Filters",
      "compare": "Compare",
      "grid": "Grid",
      "list": "List",
      "table": "Table",
      "map_label": "Map",
      "timeline": "Timeline",
      "loading_map": "Loading map...",
      "load_error": "Loading error. Please try again.",
      "see_partial_db": "Viewing partial database",
      "login_to_see_all": "Log in to see all",
      "universities_portals_data": "universities, portal links, and full data",
      "login_free": "Login for free"
    }
  },
  ru: {
    translation: {
      "home": "Главная",
      "universities": "Университеты",
      "majors": "Специальности",
      "scholarships": "Стипендии",
      "deadlines": "Дедлайны",
      "about": "О проекте",
      "map": "Карта",
      "login": "Войти",
      "dark_mode": "Темная тема",
      "light_mode": "Светлая тема",
      "language": "Язык",
      "search": "Поиск",
      "filters": "Фильтры",
      "compare": "Сравнить",
      "grid": "Сетка",
      "list": "Список",
      "table": "Таблица",
      "map_label": "Карта",
      "timeline": "Тайм лайн",
      "loading_map": "Загрузка карты...",
      "load_error": "Ошибка загрузки. Попробуйте снова.",
      "see_partial_db": "Видите только часть базы",
      "login_to_see_all": "Войдите чтобы увидеть все",
      "universities_portals_data": "университетов, ссылки на порталы и полные данные",
      "login_free": "Войти бесплатно"
    }
  },
  kz: {
    translation: {
      "home": "Басты бет",
      "universities": "Университеттер",
      "majors": "Мамандықтар",
      "scholarships": "Стипендиялар",
      "deadlines": "Дедлайндар",
      "about": "Жоба туралы",
      "map": "Карта",
      "login": "Кіру",
      "dark_mode": "Қараңғы режим",
      "light_mode": "Жарық режим",
      "language": "Тіл",
      "search": "Іздеу",
      "filters": "Сүзгілер",
      "compare": "Салыстыру",
      "grid": "Тор",
      "list": "Тізім",
      "table": "Кесте",
      "map_label": "Карта",
      "timeline": "Таймлайн",
      "loading_map": "Карта жүктелуде...",
      "load_error": "Жүктеу қатесі. Қайта көріңіз.",
      "see_partial_db": "Деректер қорының бір бөлігін көріп тұрсыз",
      "login_to_see_all": "Барлығын көру үшін кіріңіз",
      "universities_portals_data": "университеттер, портал сілтемелері және толық деректер",
      "login_free": "Тегін кіру"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem("i18nextLng") || "en",
    fallbackLng: "en",
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
