import React from 'react';
import { useTranslation } from 'react-i18next';
import { Moon, Sun, Globe } from 'lucide-react';
import { useTheme } from 'next-themes';

export default function ThemeLangToggle() {
  const { i18n } = useTranslation();
  const { theme, setTheme } = useTheme();

  const toggleLanguage = () => {
    const nextLng = i18n.language === 'en' ? 'ru' : i18n.language === 'ru' ? 'kz' : 'en';
    i18n.changeLanguage(nextLng);
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className="flex items-center gap-2">
      <button 
        onClick={toggleLanguage}
        className="p-2 rounded-full hover:bg-surface border border-border flex items-center gap-2 text-sm font-bold uppercase transition-colors"
        title="Toggle Language"
      >
        <Globe className="w-4 h-4" />
        {i18n.language}
      </button>
      
      <button 
        onClick={toggleTheme}
        className="p-2 rounded-full hover:bg-surface border border-border transition-colors"
        title="Toggle Theme"
      >
        {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
      </button>
    </div>
  );
}
