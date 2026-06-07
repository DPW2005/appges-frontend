import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import LanguagePicker from './components/custom/LanguagePicker'
import ThemePicker from './components/custom/ThemePicker'
import { useTranslation } from 'react-i18next';
import { ThemeProvider } from './context/ThemeContext'
import { LanguageProvider } from './context/LanguageContext'

function App() {
  const { t } = useTranslation();

  return (
    <ThemeProvider>
      <LanguageProvider>
        <div className="text-orange-500">
          {t("test")}
        </div>
        <LanguagePicker />
        <ThemePicker />
      </LanguageProvider>
    </ThemeProvider>
  )
}

export default App
