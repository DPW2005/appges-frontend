import { createContext, useCallback, useContext, useEffect, useState } from "react";
// 1. On retire useTranslation
// import { useTranslation } from "react-i18next";

// 2. On importe DIRECTEMENT votre instance i18next initialisée
// (Ajustez le chemin si votre fichier d'initialisation s'appelle autrement)
import i18n from "@/i18n/index.js"; 

import { getStoredLang, resolveActiveLang, storeLang } from "@/utils/i18n.utils";

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  // 3. On supprime l'appel au hook
  // const { i18n } = useTranslation(); 

  // Préférence utilisateur ("system" | "fr" | "en")
  const [langPreference, setLangPreference] = useState(getStoredLang);

  const setLanguage = useCallback((preference) => {
    storeLang(preference);                                  // 1. Persiste
    setLangPreference(preference);                          // 2. Met à jour le state
    i18n.changeLanguage(resolveActiveLang(preference));     // 3. Applique via l'instance importée
  }, []); // 4. i18n n'est plus une dépendance React, on le retire du tableau

  // Réécoute les changements OS si on est en mode "system"
  useEffect(() => {
    if (langPreference !== "system") return;

    const handleLanguageChange = () => {
      i18n.changeLanguage(resolveActiveLang("system"));
    };

    window.addEventListener("languagechange", handleLanguageChange);
    return () => window.removeEventListener("languagechange", handleLanguageChange);
  }, [langPreference]); // 5. Pareil ici, on retire i18n du tableau

  return (
    <LanguageContext.Provider value={{ langPreference, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === null) {
    throw new Error("[useLanguage] doit être utilisé à l'intérieur d'un <LanguageProvider>");
  }
  return context;
}