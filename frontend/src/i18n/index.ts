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
      "map": "Map",
      "login": "Login",
      "dark_mode": "Dark Mode",
      "light_mode": "Light Mode",
      "language": "Language",
      "search": "Search",
      "filters": "Filters"
    }
  },
  ru: {
    translation: {
      "home": "Главная",
      "universities": "Университеты",
      "majors": "Специальности",
      "scholarships": "Стипендии",
      "deadlines": "Дедлайны",
      "map": "Карта",
      "login": "Войти",
      "dark_mode": "Темная тема",
      "light_mode": "Светлая тема",
      "language": "Язык",
      "search": "Поиск",
      "filters": "Фильтры"
    }
  },
  kz: {
    translation: {
      "home": "Басты бет",
      "universities": "Университеттер",
      "majors": "Мамандықтар",
      "scholarships": "Стипендиялар",
      "deadlines": "Дедлайндар",
      "map": "Карта",
      "login": "Кіру",
      "dark_mode": "Қараңғы режим",
      "light_mode": "Жарық режим",
      "language": "Тіл",
      "search": "Іздеу",
      "filters": "Сүзгілер"
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
